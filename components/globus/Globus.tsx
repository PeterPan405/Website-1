'use client'

import { geoContains, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as topojson from 'topojson-client'
import type { Topology } from 'topojson-specification'

import {
  FEINE_GEOMETRIE_AB,
  MAX_NEIGUNG,
  MAX_ZOOM,
  MIN_ZOOM,
  begrenze,
  drehungNachZug,
  drehungZu,
  drehungZwischen,
  normalisiereLaenge,
  weich,
  zoomSchritt,
  type Drehung,
} from '@/lib/globus-geometrie'

/**
 * Der drehbare Globus.
 *
 * ## Warum Canvas und nicht SVG
 *
 * 177 Länder als SVG-Pfade neu zu berechnen und in den DOM zu schreiben, bei
 * jedem Bild einer Drehbewegung, bringt jeden Browser ins Stocken – die
 * Projektion muss ohnehin jeden Punkt neu rechnen, und obendrauf käme die
 * Arbeit des Layout-Systems. Auf Canvas fällt der zweite Teil weg.
 *
 * Der Preis ist, dass eine Zeichenfläche für Screenreader und für die
 * Tastatur nichts hergibt. Beides wird ersetzt: Die Karte lässt sich mit den
 * Pfeiltasten drehen und mit +/− zoomen, und unter der Seite steht dieselbe
 * Information als Tabelle. Die Zeichenfläche selbst ist `aria-hidden`.
 *
 * ## Wie getroffen wird
 *
 * Nicht über Trefferflächen im Canvas, sondern über den umgekehrten Weg: Der
 * Mauspunkt wird mit `projection.invert` in Längen- und Breitengrad
 * zurückgerechnet, dann sucht `geoContains` das Land. Das ist exakt und
 * unabhängig davon, was gerade gezeichnet wurde – und es funktioniert auch für
 * die Rückseite der Kugel, die deshalb ausdrücklich ausgeschlossen wird.
 */

/** Was der Globus je Land zum Zeichnen braucht. */
export interface GlobusLand {
  id: string
  name: string
  /** Klasse der Farbskala, −1 für „keine Angabe“. */
  stufe: number
}

const AUTODREHUNG_GRAD_JE_SEKUNDE = 4
const ANIMATIONSDAUER_MS = 700

export function Globus({
  laender,
  farben,
  ausgewaehlt,
  onAuswahl,
  onHover,
  zielId,
}: {
  laender: readonly GlobusLand[]
  /**
   * Namen der CSS-Variablen für die Füllfarben, Index 0 ist die niedrigste
   * Klasse.
   *
   * Bewusst Variablennamen und keine fertigen Farbwerte: Nur so wechselt der
   * Globus mit dem hellen und dunklen Theme mit. Aufgelöst werden sie beim
   * Zeichnen, weil `canvas` keine CSS-Farben versteht.
   */
  farben: readonly string[]
  ausgewaehlt: string | null
  onAuswahl: (id: string | null) => void
  onHover: (id: string | null) => void
  /** Land, auf das der Globus drehen soll – etwa nach einer Suche. */
  zielId: string | null
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const huelleRef = useRef<HTMLDivElement>(null)

  const [drehung, setDrehung] = useState<Drehung>({ lambda: -10, phi: 20 })
  const [zoom, setZoom] = useState(1)
  const [groesse, setGroesse] = useState({ breite: 640, hoehe: 640 })
  const [features, setFeatures] = useState<Feature<Geometry>[]>([])
  /*
    Ein Riegel, kein Zustand.

    „Habe ich den Nachladevorgang schon angestoßen“ interessiert die Anzeige
    nicht – daraus einen `useState` zu machen hieße, wegen einer internen
    Notiz neu zu rendern.
  */
  const feineAngefordert = useRef(false)
  const [zieht, setZieht] = useState(false)
  const [ueber, setUeber] = useState<string | null>(null)
  const [themawechsel, setThemawechsel] = useState(0)

  /*
    Werte, die der Zeichenschleife gehören und keinen Neuaufbau auslösen
    dürfen. Ein `useState` für die Mausposition würde bei jeder Bewegung eine
    React-Aktualisierung erzwingen – das ist genau die Arbeit, die Canvas
    einsparen soll.
  */
  const zugRef = useRef<{ x: number; y: number; start: Drehung } | null>(null)
  const animationRef = useRef<{
    von: Drehung
    nach: Drehung
    beginn: number
  } | null>(null)
  const letzterRahmen = useRef<number>(0)

  const stufeJeId = useMemo(() => {
    const karte = new Map<string, number>()
    for (const land of laender) karte.set(land.id, land.stufe)
    return karte
  }, [laender])

  const nameJeId = useMemo(() => {
    const karte = new Map<string, string>()
    for (const land of laender) karte.set(land.id, land.name)
    return karte
  }, [laender])

  /*
    Ein Theme-Wechsel muss neu zeichnen.

    Die Farben liest die Zeichenroutine aus den CSS-Variablen – aber sie läuft
    nur, wenn sich eine ihrer Abhängigkeiten ändert. Ohne diesen Beobachter
    behielte der Globus nach dem Umschalten auf Dunkel die hellen Farben, bis
    ihn jemand dreht.
  */
  useEffect(() => {
    const beobachter = new MutationObserver(() => setThemawechsel((n) => n + 1))
    beobachter.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    })
    return () => beobachter.disconnect()
  }, [])

  // ------------------------------------------------------------- Geometrie

  const ladeGeometrie = useCallback(async (datei: string) => {
    const antwort = await fetch(datei)
    if (!antwort.ok) return null
    const topologie = (await antwort.json()) as Topology
    const sammlung = topojson.feature(
      topologie,
      topologie.objects.countries
    ) as unknown as FeatureCollection<Geometry>
    return sammlung.features
  }, [])

  useEffect(() => {
    let abgebrochen = false
    ladeGeometrie('/globus/welt-110m.json').then((geladen) => {
      if (!abgebrochen && geladen) setFeatures(geladen)
    })
    return () => {
      abgebrochen = true
    }
  }, [ladeGeometrie])

  /*
    Die feinere Geometrie kommt erst beim Hineinzoomen.

    Sie ist siebenmal so groß wie die grobe. Auf dem ganzen Globus sieht man
    den Unterschied nicht; ab etwa zweifacher Vergrößerung werden Küstenlinien
    sichtbar eckig. Sie sofort zu laden hieße, 740 Kilobyte für einen Anblick zu
    übertragen, den die meisten nie sehen.
  */
  useEffect(() => {
    if (feineAngefordert.current || zoom < FEINE_GEOMETRIE_AB) return
    feineAngefordert.current = true
    ladeGeometrie('/globus/welt-50m.json').then((geladen) => {
      if (geladen) setFeatures(geladen)
    })
  }, [zoom, ladeGeometrie])

  // ----------------------------------------------------------------- Größe

  useEffect(() => {
    const huelle = huelleRef.current
    if (!huelle) return
    const beobachter = new ResizeObserver(([eintrag]) => {
      const breite = eintrag.contentRect.width
      // Quadratisch, aber nach oben begrenzt: Auf einem breiten Bildschirm
      // soll der Globus nicht die ganze Höhe fressen.
      setGroesse({ breite, hoehe: Math.min(breite, 560) })
    })
    beobachter.observe(huelle)
    return () => beobachter.disconnect()
  }, [])

  const radius = (Math.min(groesse.breite, groesse.hoehe) / 2 - 8) * zoom

  const projektion = useMemo(() => {
    return (
      geoOrthographic()
        // d3 dreht die Kugel, nicht den Betrachter: Beide Winkel gehen negativ ein.
        .rotate([drehung.lambda, -drehung.phi])
        .scale(radius)
        .translate([groesse.breite / 2, groesse.hoehe / 2])
        .clipAngle(90)
    )
  }, [drehung, radius, groesse])

  // -------------------------------------------------------------- Zeichnen

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = groesse.breite * dpr
    canvas.height = groesse.hoehe * dpr
    canvas.style.width = `${groesse.breite}px`
    canvas.style.height = `${groesse.hoehe}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, groesse.breite, groesse.hoehe)

    const stil = getComputedStyle(canvas)
    const lies = (name: string) => stil.getPropertyValue(name).trim()

    const pfad = geoPath(projektion, ctx)

    // Ozean
    ctx.beginPath()
    pfad({ type: 'Sphere' })
    ctx.fillStyle = lies('--c-globus-ozean') || '#eef2f8'
    ctx.fill()

    // Gradnetz – Orientierung beim Drehen, sonst wirkt die Kugel flach.
    ctx.beginPath()
    pfad(geoGraticule10())
    ctx.strokeStyle = lies('--c-border') || '#dde3ee'
    ctx.lineWidth = 0.5
    ctx.stroke()

    const keineDaten = lies('--c-globus-leer') || '#c8d1e0'

    for (const feature of features) {
      const id = String(feature.id ?? '')
      const stufe = stufeJeId.get(id) ?? -1
      ctx.beginPath()
      pfad(feature)
      ctx.fillStyle = stufe < 0 ? keineDaten : lies(farben[stufe]) || keineDaten
      ctx.fill()
      ctx.strokeStyle = lies('--c-surface') || '#ffffff'
      ctx.lineWidth = 0.4
      ctx.stroke()
    }

    // Hervorhebungen zuletzt, damit sie über den Nachbarn liegen.
    const hebeHervor = (id: string | null, farbe: string, breite: number) => {
      if (!id) return
      const feature = features.find((eintrag) => String(eintrag.id ?? '') === id)
      if (!feature) return
      ctx.beginPath()
      pfad(feature)
      ctx.strokeStyle = farbe
      ctx.lineWidth = breite
      ctx.lineJoin = 'round'
      ctx.stroke()
    }
    hebeHervor(ueber, lies('--c-fg') || '#0f172a', 1.4)
    hebeHervor(ausgewaehlt, lies('--c-brand') || '#17296f', 2.4)

    // Kante der Kugel
    ctx.beginPath()
    pfad({ type: 'Sphere' })
    ctx.strokeStyle = lies('--c-border-strong') || '#c8d1e0'
    ctx.lineWidth = 1
    ctx.stroke()
  }, [features, projektion, groesse, stufeJeId, farben, ueber, ausgewaehlt, themawechsel])

  // ------------------------------------------------------- Bewegung der Kugel

  const autoErlaubt =
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    let angefordert = 0

    const schritt = (zeit: number) => {
      const vergangen = letzterRahmen.current ? zeit - letzterRahmen.current : 16
      letzterRahmen.current = zeit

      const animation = animationRef.current
      if (animation) {
        const anteil = (zeit - animation.beginn) / ANIMATIONSDAUER_MS
        if (anteil >= 1) {
          setDrehung(animation.nach)
          animationRef.current = null
        } else {
          setDrehung(drehungZwischen(animation.von, animation.nach, weich(anteil)))
        }
      } else if (autoErlaubt && !zieht && !ausgewaehlt && !ueber) {
        /*
          Die Eigendrehung läuft nur im Leerlauf.

          Sie hört auf, sobald jemand zieht, ein Land ausgewählt hat oder auch
          nur mit der Maus darüber ist – eine Karte, die unter dem Zeiger
          wegdreht, ist nicht zu bedienen.
        */
        setDrehung((vorher) => ({
          ...vorher,
          lambda: vorher.lambda + (AUTODREHUNG_GRAD_JE_SEKUNDE * vergangen) / 1000,
        }))
      }

      angefordert = requestAnimationFrame(schritt)
    }

    angefordert = requestAnimationFrame(schritt)
    return () => cancelAnimationFrame(angefordert)
  }, [autoErlaubt, zieht, ausgewaehlt, ueber])

  /** Dreht den Globus weich auf ein Land. */
  useEffect(() => {
    if (!zielId || features.length === 0) return
    const feature = features.find((eintrag) => String(eintrag.id ?? '') === zielId)
    if (!feature) return
    const [laenge, breite] = zentrum(feature)
    animationRef.current = {
      von: drehung,
      nach: drehungZu(laenge, breite),
      beginn: performance.now(),
    }
    // `drehung` bewusst nicht in den Abhängigkeiten: Die Animation soll bei
    // einem neuen Ziel starten, nicht bei jedem Zwischenbild neu beginnen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zielId, features])

  // ------------------------------------------------------------ Interaktion

  const landAnPunkt = useCallback(
    (x: number, y: number): string | null => {
      const punkt = projektion.invert?.([x, y])
      if (!punkt || Number.isNaN(punkt[0])) return null
      for (const feature of features) {
        if (geoContains(feature, punkt)) return String(feature.id ?? '')
      }
      return null
    },
    [features, projektion]
  )

  const zeigerPosition = (ereignis: React.PointerEvent<HTMLDivElement>) => {
    const kasten = ereignis.currentTarget.getBoundingClientRect()
    return { x: ereignis.clientX - kasten.left, y: ereignis.clientY - kasten.top }
  }

  const beiZeigerAb = (ereignis: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = zeigerPosition(ereignis)
    zugRef.current = { x, y, start: drehung }
    animationRef.current = null
    ereignis.currentTarget.setPointerCapture(ereignis.pointerId)
  }

  const beiZeigerBewegung = (ereignis: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = zeigerPosition(ereignis)
    const zug = zugRef.current

    if (zug) {
      const dx = x - zug.x
      const dy = y - zug.y
      // Erst ab ein paar Pixeln als Ziehen werten, sonst verliert jeder Klick
      // mit unruhiger Hand seine Wirkung.
      if (!zieht && Math.hypot(dx, dy) < 3) return
      setZieht(true)
      setDrehung(drehungNachZug(zug.start, dx, dy, radius))
      return
    }

    const id = landAnPunkt(x, y)
    if (id !== ueber) {
      setUeber(id)
      onHover(id)
    }
  }

  const beiZeigerAuf = (ereignis: React.PointerEvent<HTMLDivElement>) => {
    const zug = zugRef.current
    zugRef.current = null
    ereignis.currentTarget.releasePointerCapture(ereignis.pointerId)

    if (zieht) {
      setZieht(false)
      return
    }
    if (!zug) return

    const { x, y } = zeigerPosition(ereignis)
    const id = landAnPunkt(x, y)
    // Ein Klick ins Leere hebt die Auswahl auf – erwartbarer als ein Panel,
    // das nur über eine eigene Schaltfläche wieder verschwindet.
    onAuswahl(id)
  }

  const beiTaste = (ereignis: React.KeyboardEvent<HTMLDivElement>) => {
    const schritt = ereignis.shiftKey ? 15 : 5
    const bewege = (dLambda: number, dPhi: number) => {
      ereignis.preventDefault()
      animationRef.current = null
      setDrehung((vorher) => ({
        lambda: normalisiereLaenge(vorher.lambda + dLambda),
        phi: begrenze(vorher.phi + dPhi, -MAX_NEIGUNG, MAX_NEIGUNG),
      }))
    }
    switch (ereignis.key) {
      case 'ArrowLeft':
        return bewege(-schritt, 0)
      case 'ArrowRight':
        return bewege(schritt, 0)
      case 'ArrowUp':
        return bewege(0, schritt)
      case 'ArrowDown':
        return bewege(0, -schritt)
      case '+':
      case '=':
        ereignis.preventDefault()
        return setZoom((vorher) => zoomSchritt(vorher, 1.3))
      case '-':
        ereignis.preventDefault()
        return setZoom((vorher) => zoomSchritt(vorher, 1 / 1.3))
      case 'Escape':
        return onAuswahl(null)
    }
  }

  /*
    Das Mausrad wird von Hand registriert.

    React hängt `onWheel` als passiven Zuhörer ein; `preventDefault` bleibt
    dort wirkungslos, und die Seite scrollt beim Zoomen mit weg.
  */
  useEffect(() => {
    const huelle = huelleRef.current
    if (!huelle) return
    const beiRad = (ereignis: WheelEvent) => {
      ereignis.preventDefault()
      animationRef.current = null
      setZoom((vorher) => zoomSchritt(vorher, ereignis.deltaY < 0 ? 1.12 : 1 / 1.12))
    }
    huelle.addEventListener('wheel', beiRad, { passive: false })
    return () => huelle.removeEventListener('wheel', beiRad)
  }, [])

  const ueberName = ueber ? nameJeId.get(ueber) : null

  return (
    <div className="relative">
      <div
        ref={huelleRef}
        tabIndex={0}
        role="group"
        aria-label="Drehbarer Globus. Ziehen dreht, Mausrad zoomt. Mit den Pfeiltasten drehen, mit Plus und Minus zoomen, mit Escape die Auswahl aufheben."
        onPointerDown={beiZeigerAb}
        onPointerMove={beiZeigerBewegung}
        onPointerUp={beiZeigerAuf}
        onPointerLeave={() => {
          setUeber(null)
          onHover(null)
        }}
        onKeyDown={beiTaste}
        className="ring-ring/60 relative touch-none rounded-2xl outline-none focus-visible:ring-2"
        style={{ cursor: zieht ? 'grabbing' : 'grab' }}
      >
        <canvas ref={canvasRef} aria-hidden="true" className="block" />

        {ueberName && (
          <span className="bg-fg text-canvas pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold">
            {ueberName}
          </span>
        )}

        {features.length === 0 && (
          <p className="text-fg-subtle absolute inset-0 flex items-center justify-center text-sm">
            Kartendaten werden geladen …
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <Knopf
            beschriftung="Hineinzoomen"
            zeichen="+"
            onKlick={() => setZoom((v) => zoomSchritt(v, 1.4))}
            aus={zoom >= MAX_ZOOM}
          />
          <Knopf
            beschriftung="Herauszoomen"
            zeichen="−"
            onKlick={() => setZoom((v) => zoomSchritt(v, 1 / 1.4))}
            aus={zoom <= MIN_ZOOM}
          />
          <button
            type="button"
            onClick={() => {
              animationRef.current = null
              setZoom(1)
              setDrehung({ lambda: -10, phi: 20 })
              onAuswahl(null)
            }}
            className="border-border text-fg-muted hover:text-fg hover:border-border-strong rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            Ansicht zurücksetzen
          </button>
        </div>
        <p className="text-fg-subtle text-xs tabular-nums" aria-live="off">
          {zoom.toFixed(1)}×
        </p>
      </div>
    </div>
  )
}

function Knopf({
  beschriftung,
  zeichen,
  onKlick,
  aus,
}: {
  beschriftung: string
  zeichen: string
  onKlick: () => void
  aus: boolean
}) {
  return (
    <button
      type="button"
      onClick={onKlick}
      disabled={aus}
      aria-label={beschriftung}
      className="border-border text-fg-muted hover:text-fg hover:border-border-strong flex size-8 items-center justify-center rounded-lg border text-sm font-semibold transition-colors disabled:opacity-40"
    >
      {zeichen}
    </button>
  )
}

/**
 * Mittelpunkt eines Landes in Längen- und Breitengrad.
 *
 * `geoPath().centroid` liefert Bildkoordinaten einer Projektion; hier wird der
 * Punkt auf der Kugel gebraucht. Der Umweg über die Ausdehnung (`bounds` in
 * geografischen Koordinaten) genügt dafür und kommt ohne zweite Projektion aus.
 */
function zentrum(feature: Feature<Geometry>): [number, number] {
  let minX = 180
  let maxX = -180
  let minY = 90
  let maxY = -90

  const besuche = (koordinaten: unknown): void => {
    if (Array.isArray(koordinaten) && typeof koordinaten[0] === 'number') {
      const [x, y] = koordinaten as [number, number]
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
      return
    }
    if (Array.isArray(koordinaten)) koordinaten.forEach(besuche)
  }

  besuche((feature.geometry as { coordinates?: unknown }).coordinates)
  return [(minX + maxX) / 2, (minY + maxY) / 2]
}
