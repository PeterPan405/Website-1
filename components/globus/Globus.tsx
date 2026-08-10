'use client'

import { geoContains, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import * as topojson from 'topojson-client'
import type { Topology } from 'topojson-specification'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
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
  werkzeuge,
  tafel,
  onVollbild,
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
  /**
   * Die Detailtafel – nur im Vollbild hier gezeigt.
   *
   * Ausserhalb des Vollbilds steht sie in der Seitenspalte der Seite und wird
   * hier nicht gebraucht. Im Vollbild liegt diese Spalte aber hinter dem
   * schwarzen Rahmen: Wer ein Land anklickte, sah die Auswahl aufleuchten und
   * sonst nichts. Der Knoten, der ins Vollbild geht, muss die Tafel deshalb
   * enthalten – ein Element ausserhalb davon ist im Vollbild unsichtbar, das
   * ist keine Frage der Gestaltung, sondern wie die Schnittstelle arbeitet.
   */
  tafel?: ReactNode
  /**
   * Die Kennzahlwahl – aus demselben Grund hier wie die Tafel.
   *
   * Sie steht links, weil sie die Karte steuert und nicht sie beschreibt: Was
   * eingestellt wird, gehört vor das Ergebnis, was ausgelesen wird, dahinter.
   */
  werkzeuge?: ReactNode
  /**
   * Meldet den Wechsel ins Vollbild und zurück.
   *
   * Die Seite braucht das, um ihre eigene Seitenspalte auszublenden, solange
   * die Tafel hier drin steht. Sonst stünde derselbe Text zweimal im Dokument –
   * unsichtbar hinter dem Vollbild, aber für einen Screenreader doppelt.
   */
  onVollbild?: (an: boolean) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const huelleRef = useRef<HTMLDivElement>(null)
  /** Der Knoten, der ins Vollbild geht – Kugel und Bedienleiste zusammen. */
  const rahmenRef = useRef<HTMLDivElement>(null)
  /*
    Ein eigener Rahmen nur zum Messen.

    Vorher wurde die Hülle gemessen, in der auch die Zeichenfläche liegt – und
    die trägt ihre Breite als Pixelwert im Stil. Auf dem Handy hielt sich das
    gegenseitig fest: Die Fläche war 640 Pixel breit, die Hülle wuchs
    entsprechend mit, und der gemessene Wert blieb 640, obwohl das Fenster nur
    390 Pixel hatte. Sichtbar war dann der halbe Globus, der Rest lag rechts
    außerhalb der Seite.

    Dieser Rahmen ist leer und einen Pixel hoch. Er kann nur so breit werden,
    wie der Platz hergibt.
  */
  const massRef = useRef<HTMLDivElement>(null)

  const [drehung, setDrehung] = useState<Drehung>({ lambda: -10, phi: 20 })
  const [zoom, setZoom] = useState(1)
  /*
    Bewusst klein gestartet.

    Der erste Wert steht, bevor gemessen wurde. Ist er zu groß, ragt die
    Zeichenfläche für einen Bildaufbau lang aus der Seite heraus und schiebt
    auf dem Handy einen waagerechten Rollbalken hinein, der erst danach wieder
    verschwindet.
  */
  const [breite, setBreite] = useState(320)
  const [fensterHoehe, setFensterHoehe] = useState(0)
  const [vollbild, setVollbild] = useState(false)
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
  /*
    Alle Finger, die gerade auf der Fläche liegen.

    Auf dem Handy gibt es kein Mausrad. Zwei Finger sind dort die gewohnte
    Geste zum Zoomen – ohne sie bliebe nur der kleine Plusknopf, und eine
    Karte, die man nicht aufziehen kann, fühlt sich kaputt an.
  */
  const zeigerRef = useRef(new Map<number, { x: number; y: number }>())
  const kneifRef = useRef<{ abstand: number; zoom: number } | null>(null)
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
    const rahmen = massRef.current
    if (!rahmen) return
    const beobachter = new ResizeObserver(([eintrag]) => {
      const gemessen = Math.floor(eintrag.contentRect.width)
      if (gemessen > 0) setBreite(gemessen)
    })
    beobachter.observe(rahmen)
    return () => beobachter.disconnect()
  }, [])

  /*
    Im Vollbild begrenzt zusätzlich die Fensterhöhe.

    Höher als breit zu zeichnen brächte nichts: Der Radius folgt der kleineren
    der beiden Seiten, eine Zeichenfläche im Hochformat enthielte also
    denselben Kreis und darunter Leere. Genau das war der Fall, bis die Tafel
    dazukam – auf dem Handy schob die leere Fläche sie halb aus dem Bild.
    Zentriert wird über das Layout, nicht über eine überhohe Fläche.
  */
  useEffect(() => {
    const messen = () => setFensterHoehe(window.innerHeight)
    messen()
    window.addEventListener('resize', messen)
    return () => window.removeEventListener('resize', messen)
  }, [])

  const groesse = useMemo(() => {
    const hoehe = vollbild
      ? Math.max(240, Math.min(breite, fensterHoehe - 128))
      : // Quadratisch, aber nach oben begrenzt: Auf einem breiten Bildschirm
        // soll der Globus nicht die ganze Höhe fressen.
        Math.min(breite, 560)
    return { breite, hoehe }
  }, [breite, vollbild, fensterHoehe])

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
    /*
      Die Auswahl bekommt eine doppelte Linie.

      Vorher war es eine einzelne in der Hausfarbe – einem dunklen Blau. Auf
      einem Land der obersten Klasse, das genau dieses Blau als Füllung trägt,
      war sie damit unsichtbar: Wer über die Suche auf die Vereinigten Staaten
      oder Indonesien kam, sah keine Markierung. Zuerst eine breite Linie in
      der Hintergrundfarbe, darüber eine schmale in der Textfarbe – dieses
      Paar hebt sich von jeder Füllung ab, in beiden Themes.
    */
    hebeHervor(ausgewaehlt, lies('--c-canvas') || '#f6f8fc', 4.5)
    hebeHervor(ausgewaehlt, lies('--c-fg') || '#0f172a', 2)

    /*
      Kante der Kugel – eigene Farbe, nicht `--c-border-strong`.

      Seit das Wasser im hellen Theme ein deutliches Blaugrau ist, wäre der
      Rahmenton heller als die Fläche, die er begrenzt: ein Lichtsaum um eine
      dunkle Scheibe. Die Kante muss dunkler sein als das Wasser, sonst hört
      die Kugel dort nicht auf, sondern leuchtet.
    */
    ctx.beginPath()
    pfad({ type: 'Sphere' })
    ctx.strokeStyle = lies('--c-globus-kante') || '#7c8ba4'
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

  /** Abstand der beiden ersten Finger, oder `null` bei weniger als zweien. */
  const kneifabstand = (): number | null => {
    const punkte = [...zeigerRef.current.values()]
    if (punkte.length < 2) return null
    return Math.hypot(punkte[0].x - punkte[1].x, punkte[0].y - punkte[1].y)
  }

  const beiZeigerAb = (ereignis: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = zeigerPosition(ereignis)
    zeigerRef.current.set(ereignis.pointerId, { x, y })
    animationRef.current = null
    // Kann werfen, wenn der Zeiger inzwischen nicht mehr gilt – etwa weil das
    // Betriebssystem die Geste übernommen hat. Ohne Auffangen bräche dann die
    // ganze Bewegung ab.
    try {
      ereignis.currentTarget.setPointerCapture(ereignis.pointerId)
    } catch {
      /* ohne Fangen weitermachen */
    }

    const abstand = kneifabstand()
    if (abstand !== null) {
      // Zweiter Finger: Ab jetzt wird gezoomt, nicht gedreht. Sonst würde die
      // Kugel beim Aufziehen zusätzlich wegkippen.
      kneifRef.current = { abstand, zoom }
      zugRef.current = null
      setZieht(false)
      return
    }
    zugRef.current = { x, y, start: drehung }
  }

  const beiZeigerBewegung = (ereignis: React.PointerEvent<HTMLDivElement>) => {
    const { x, y } = zeigerPosition(ereignis)
    if (zeigerRef.current.has(ereignis.pointerId)) {
      zeigerRef.current.set(ereignis.pointerId, { x, y })
    }

    const kneifen = kneifRef.current
    if (kneifen) {
      const abstand = kneifabstand()
      if (abstand !== null && kneifen.abstand > 0) {
        setZoom(zoomSchritt(kneifen.zoom, abstand / kneifen.abstand))
      }
      return
    }

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
    const kneifteGerade = kneifRef.current !== null
    zeigerRef.current.delete(ereignis.pointerId)
    zugRef.current = null
    if (zeigerRef.current.size < 2) kneifRef.current = null
    try {
      ereignis.currentTarget.releasePointerCapture(ereignis.pointerId)
    } catch {
      /* war nie gefangen */
    }

    // Nach einer Zwei-Finger-Geste darf das Loslassen kein Land auswählen:
    // Der zweite Finger hebt selten genau gleichzeitig ab.
    if (kneifteGerade) {
      setZieht(false)
      return
    }
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
        // Erst das Vollbild verlassen, dann die Auswahl aufheben – sonst
        // müsste man zweimal drücken, ohne zu sehen, was passiert ist.
        if (vollbild) {
          ereignis.preventDefault()
          return vollbildUmschalten()
        }
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

  /*
    Vollbild in zwei Schichten.

    Die eigentliche Arbeit macht `position: fixed` – das funktioniert überall,
    auch auf iPhones, wo die Vollbild-Schnittstelle des Browsers nur für Videos
    freigegeben ist. Zusätzlich wird die Schnittstelle angefragt, wo es sie
    gibt: Dann verschwindet auch die Leiste des Browsers, und es sieht aus wie
    bei einem Video.

    Schlägt die Anfrage fehl, bleibt es bei der ersten Schicht. Deshalb steht
    dort ein bewusst leeres `catch` und keine Fehlermeldung: Für die Bedienung
    ändert sich nichts.
  */
  const vollbildUmschalten = useCallback(() => {
    const neu = !vollbild
    setVollbild(neu)
    onVollbild?.(neu)
    if (neu) {
      rahmenRef.current?.requestFullscreen?.().catch(() => {})
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {})
    }
  }, [vollbild, onVollbild])

  /*
    Wer das Vollbild über die Taste des Browsers verlässt, muss auch hier
    heraus. Ohne diesen Abgleich bliebe die Seite in ihrer Vollbild-Darstellung
    hängen, während der Browser längst wieder normal anzeigt.
  */
  useEffect(() => {
    const abgleichen = () => {
      if (document.fullscreenElement) return
      setVollbild(false)
      onVollbild?.(false)
    }
    document.addEventListener('fullscreenchange', abgleichen)
    return () => document.removeEventListener('fullscreenchange', abgleichen)
  }, [onVollbild])

  // Im Vollbild darf die Seite dahinter nicht mitrollen.
  useEffect(() => {
    if (!vollbild) return
    const vorher = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = vorher
    }
  }, [vollbild])

  /*
    Escape beendet das Vollbild von überall aus.

    Der Tastaturzuhörer der Kugel greift nur, solange sie den Fokus hat – nach
    einem Klick auf den Vollbildknopf liegt der aber auf dem Knopf. Wer dann
    Escape drückt, säße fest. Bei echtem Browser-Vollbild erledigt das der
    Browser selbst; diese Schicht deckt den Fall ab, in dem nur die
    CSS-Darstellung aktiv ist.
  */
  useEffect(() => {
    if (!vollbild) return
    const beiTaste = (ereignis: KeyboardEvent) => {
      if (ereignis.key !== 'Escape') return
      ereignis.preventDefault()
      setVollbild(false)
      onVollbild?.(false)
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    }
    document.addEventListener('keydown', beiTaste)
    return () => document.removeEventListener('keydown', beiTaste)
  }, [vollbild, onVollbild])

  const ueberName = ueber ? nameJeId.get(ueber) : null

  return (
    <div
      ref={rahmenRef}
      className={cn(
        'relative w-full min-w-0',
        vollbild && 'bg-canvas fixed inset-0 z-50 flex flex-col p-3 sm:p-6'
      )}
    >
      <div
        className={cn(
          vollbild && 'flex min-h-0 flex-1 flex-col gap-4 lg:flex-row lg:items-stretch'
        )}
      >
        {/*
          Die Kennzahlwahl im Vollbild – links neben der Kugel.

          Auf schmalen Geräten steht sie oben und darf nicht schrumpfen: Die
          Knöpfe brechen dort ohnehin um, und eine gestauchte Reihe wäre nicht
          mehr zu treffen. Auf breiten Bildschirmen bekommt sie eine feste
          Spalte, damit die Kugel beim Umschalten zwischen kurzen und langen
          Beschriftungen nicht springt.
        */}
        {vollbild && werkzeuge && (
          <div className="w-full shrink-0 overflow-y-auto lg:w-56 lg:self-center">
            {werkzeuge}
          </div>
        )}

        <div className={cn('min-w-0', vollbild && 'flex flex-1 flex-col justify-center')}>
          {/*
            Der Messrahmen – leer, unsichtbar und immer nur so breit wie der
            Platz. Er steht in derselben Spalte wie die Zeichenfläche und nicht
            darüber: Im Vollbild nimmt die Tafel rechts Platz weg, und ein
            Rahmen über beiden meldete eine Breite, die die Kugel nicht hat.
          */}
          <div ref={massRef} aria-hidden="true" className="h-px w-full" />

          <div
            ref={huelleRef}
            tabIndex={0}
            role="group"
            aria-label="Drehbarer Globus. Ziehen dreht, Mausrad oder zwei Finger zoomen. Mit den Pfeiltasten drehen, mit Plus und Minus zoomen, mit Escape die Auswahl aufheben."
            onPointerDown={beiZeigerAb}
            onPointerMove={beiZeigerBewegung}
            onPointerUp={beiZeigerAuf}
            onPointerCancel={(ereignis) => {
              zeigerRef.current.delete(ereignis.pointerId)
              if (zeigerRef.current.size < 2) kneifRef.current = null
              zugRef.current = null
              setZieht(false)
            }}
            onPointerLeave={() => {
              setUeber(null)
              onHover(null)
            }}
            onKeyDown={beiTaste}
            className="ring-ring/60 relative flex touch-none justify-center overflow-hidden rounded-2xl outline-none focus-visible:ring-2"
            style={{ cursor: zieht ? 'grabbing' : 'grab' }}
          >
            <canvas ref={canvasRef} aria-hidden="true" className="block max-w-full" />

            {ueberName && (
              <span className="bg-invert text-on-invert pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold">
                {ueberName}
              </span>
            )}

            {features.length === 0 && (
              <p className="text-fg-subtle absolute inset-0 flex items-center justify-center text-sm">
                Kartendaten werden geladen …
              </p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <div className="flex flex-wrap gap-2">
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
                Zurücksetzen
              </button>
              <button
                type="button"
                onClick={vollbildUmschalten}
                aria-pressed={vollbild}
                className="border-border text-fg-muted hover:text-fg hover:border-border-strong flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
              >
                <Icon name={vollbild ? 'compress' : 'expand'} className="size-3.5" />
                {/* Im Vollbild kurz halten: Auf einem schmalen Gerät bricht
                „Vollbild beenden“ sonst über zwei Zeilen um. */}
                {vollbild ? 'Beenden' : 'Vollbild'}
              </button>
            </div>
            <p className="text-fg-subtle text-xs tabular-nums" aria-live="off">
              {zoom.toFixed(1)}×
            </p>
          </div>
        </div>

        {/*
          Die Tafel im Vollbild – rechts daneben, auf schmalen Geräten darunter.

          `overflow-y-auto` ist nicht Zierde: Ein Land mit vielen Kursen füllt
          die Tafel über die Bildschirmhöhe hinaus, und im Vollbild kann die
          Seite dahinter nicht scrollen.
        */}
        {vollbild && tafel && (
          <aside className="max-h-[45vh] min-h-0 w-full overflow-y-auto lg:max-h-none lg:w-[22rem] lg:shrink-0">
            {tafel}
          </aside>
        )}
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
