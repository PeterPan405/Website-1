'use client'

import { useEffect, useRef, useState } from 'react'

import { Icon } from '@/components/ui/Icon'

/**
 * Spielt die gesprochene Fassung einer Seite ab – die eigene Stimme.
 *
 * ## Warum es diese Leiste zusätzlich gibt
 *
 * `Vorlesen.tsx` spricht mit der Stimme des Geräts. Die ist überall
 * verfügbar und klingt überall anders: auf einem Telefon passabel, auf einem
 * Linux-Rechner nach 1998, und eine männliche deutsche Stimme ist auf vielen
 * Geräten überhaupt nicht installiert.
 *
 * Wo eine Aufnahme vorliegt, tritt diese Leiste an ihre Stelle. Sie spielt
 * eine fertige Datei ab – dieselbe Stimme wie im Podcast, auf jedem Gerät
 * dieselbe.
 *
 * ## Warum die Abschnittsanzeige bleibt
 *
 * Mit der Gerätestimme entstand sie von selbst: Jeder Abschnitt war ein
 * eigener Auftrag, und wenn er endete, zählte die Leiste weiter. Eine einzelne
 * Audiodatei hat diese Fugen nicht mehr – deshalb bringt die Aufnahme ihre
 * **Marken** mit, die Sekunde, in der jeder Abschnitt beginnt.
 *
 * Das ist mehr als Buchhaltung: Wer eine Stelle noch einmal hören will,
 * springt einen Abschnitt zurück, statt am Balken zu zielen.
 *
 * ## Die Zeitleiste ist gegliedert, nicht durchgehend
 *
 * Dieselben Marken zeichnen die Kapitel. Ein durchgehender Balken sagt nur,
 * wie weit es noch ist; ein gegliederter sagt zusätzlich, **wo man ist** –
 * und macht jeden Anfang anklickbar, statt ihn suchen zu lassen.
 *
 * Die Breite eines Kapitels ist seine Dauer. Ein langer Abschnitt ist ein
 * breites Feld, ein kurzer ein schmales; wer den Balken liest, sieht die
 * Verteilung des Textes, bevor er ihn gehört hat.
 *
 * ## Was diese Leiste nicht tut
 *
 * Sie lädt nichts von selbst. `preload="none"` heißt: Erst der Druck auf
 * „Vorlesen" holt die Datei. Eine Lernstufe wiegt gut anderthalb Megabyte;
 * das auf jeder geöffneten Seite im Hintergrund zu ziehen, wäre für den
 * Großteil der Besucher – die nicht vorlesen lassen – ein Geschenk, um das
 * niemand gebeten hat.
 */

/** 1 → 1,25 → 1,5 → 0,75 → 1 … – dieselbe Reihe wie bei der Gerätestimme. */
const TEMPI = [1, 1.25, 1.5, 0.75]

function alsZeit(sekunden: number): string {
  const ganz = Math.max(0, Math.round(sekunden))
  const minuten = Math.floor(ganz / 60)
  return `${minuten}:${String(ganz % 60).padStart(2, '0')}`
}

/**
 * Die Überschrift eines Kapitels – aus dem gesprochenen Abschnitt gewonnen.
 *
 * Ein eigenes Feld dafür gibt es nicht, und es wäre auch keine Verbesserung:
 * Was gesprochen wird, steht schon da. Genommen wird der erste Satz, gekappt
 * auf eine Länge, die in eine Sprechblase passt. Überschriften sind ohnehin
 * kurz und kommen damit vollständig durch; ein Absatz wird zum Anreißer.
 */
function kapitelname(text: string): string {
  const sauber = text.replace(/\s+/g, ' ').trim()
  const satz = sauber.split(/(?<=[.!?:])\s/)[0] ?? sauber
  const kurz = satz.length > 70 ? `${satz.slice(0, 67).trimEnd()}…` : satz
  return kurz
}

export function Aufnahmeleiste({
  adresse,
  marken,
  sekunden,
  abschnitte,
  aufGeraetestimme,
}: {
  adresse: string
  /** Startsekunde jedes Abschnitts. */
  marken: number[]
  sekunden: number
  /** Der gesprochene Text je Abschnitt – gleiche Reihenfolge wie `marken`. */
  abschnitte?: string[]
  /** Rückfall auf die Stimme des Geräts – etwa wenn die Datei fehlt. */
  aufGeraetestimme?: () => void
}) {
  const tonRef = useRef<HTMLAudioElement>(null)
  const [laeuft, setLaeuft] = useState(false)
  const [stelle, setStelle] = useState(0)
  const [tempo, setTempo] = useState(1)
  /*
    Die Zeitleiste braucht zwei Zahlen, die es vor dem ersten Abspielen noch
    nicht gibt: den Stand und die Länge. Der Stand beginnt bei null, die Länge
    kommt aus dem Verzeichnis – bis die Datei geladen ist und ihre eigene
    nennt. Ohne den Vorrat wäre der Regler bis zum ersten Klick eine Leiste
    ohne Maßstab.
  */
  const [jetzt, setJetzt] = useState(0)
  const [dauer, setDauer] = useState(sekunden)

  /*
    Beim Verlassen der Seite verstummen. Ein `<audio>` gehört zwar der
    Komponente und nicht dem Fenster – anders als `speechSynthesis` –, aber
    React baut die Seite nicht zwingend ab, bevor die nächste erscheint.
  */
  useEffect(() => {
    const ton = tonRef.current
    return () => {
      ton?.pause()
    }
  }, [])

  /*
    Die Kapitel der Zeitleiste: Anfang, Dauer und Name je Abschnitt.

    Die Dauer ist der Abstand zur nächsten Marke, beim letzten der Rest bis
    zum Ende. Sie wird nach unten begrenzt – eine Länge von null wäre ein Feld
    ohne Breite, und `flexGrow: 0` ließe es unsichtbar verschwinden statt es
    schmal zu zeichnen.
  */
  const kapitel = marken.map((beginn, i) => ({
    beginn,
    laenge: Math.max((marken[i + 1] ?? Math.max(dauer, beginn + 1)) - beginn, 0.5),
    name: abschnitte?.[i] ? kapitelname(abschnitte[i]) : `Abschnitt ${i + 1}`,
  }))

  /** In welchem Abschnitt die Wiedergabe gerade steht. */
  function abschnittBei(zeit: number): number {
    let gefunden = 0
    for (let i = 0; i < marken.length; i += 1) {
      if (marken[i] <= zeit + 0.01) gefunden = i
      else break
    }
    return gefunden
  }

  function springe(richtung: -1 | 1) {
    const ton = tonRef.current
    if (!ton) return
    /*
      Zurück heißt „an den Anfang dieses Abschnitts", solange man schon ein
      Stück drin ist – wie bei jedem Abspielgerät. Erst wer ganz am Anfang
      steht, landet beim vorigen.
    */
    const jetzt = abschnittBei(ton.currentTime)
    const anfang = marken[jetzt] ?? 0
    const ziel =
      richtung === -1 && ton.currentTime - anfang > 2 ? jetzt : jetzt + richtung
    const geklemmt = Math.min(Math.max(ziel, 0), marken.length - 1)
    ton.currentTime = marken[geklemmt] ?? 0
    setStelle(geklemmt)
  }

  function tempoWechseln() {
    const naechstes = TEMPI[(TEMPI.indexOf(tempo) + 1) % TEMPI.length]
    setTempo(naechstes)
    if (tonRef.current) tonRef.current.playbackRate = naechstes
  }

  function starten() {
    const ton = tonRef.current
    if (!ton) return
    ton.playbackRate = tempo
    void ton.play()
  }

  function stoppen() {
    const ton = tonRef.current
    if (!ton) return
    ton.pause()
    ton.currentTime = 0
    setStelle(0)
  }

  return (
    <div className="border-border bg-surface-muted flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2">
      <audio
        ref={tonRef}
        src={adresse}
        preload="none"
        onPlay={() => setLaeuft(true)}
        onPause={() => setLaeuft(false)}
        onEnded={() => {
          setLaeuft(false)
          setStelle(0)
        }}
        onLoadedMetadata={(ereignis) => {
          const gemessen = ereignis.currentTarget.duration
          if (Number.isFinite(gemessen) && gemessen > 0) setDauer(gemessen)
        }}
        onTimeUpdate={(ereignis) => {
          setStelle(abschnittBei(ereignis.currentTarget.currentTime))
          setJetzt(ereignis.currentTarget.currentTime)
        }}
        /*
          Fehlt die Datei – ein Bau, der neuer ist als die Aufnahmen, oder ein
          halb übertragener Ordner –, verschwindet die Leiste nicht wortlos:
          Die Seite fällt auf die Gerätestimme zurück. Ohne das stünde ein
          Knopf da, der nichts tut.
        */
        onError={aufGeraetestimme}
      />

      {laeuft ? (
        <button
          type="button"
          onClick={() => tonRef.current?.pause()}
          className="fk-btn-secondary px-3 py-1.5 text-xs"
        >
          <Icon name="pause" className="size-3.5" />
          Pause
        </button>
      ) : (
        <button
          type="button"
          onClick={starten}
          className="fk-btn-secondary px-3 py-1.5 text-xs"
          title="Gesprochen von derselben Stimme wie der Podcast."
        >
          <Icon name="play" className="size-3.5" />
          {stelle > 0 ? 'Weiter' : 'Vorlesen'}
        </button>
      )}

      {(laeuft || stelle > 0) && (
        <>
          <button
            type="button"
            onClick={stoppen}
            className="fk-btn-ghost px-3 py-1.5 text-xs"
          >
            <Icon name="close" className="size-3.5" />
            Stopp
          </button>
          <button
            type="button"
            onClick={() => springe(-1)}
            className="fk-btn-ghost px-2.5 py-1.5 text-xs"
            aria-label="Einen Abschnitt zurück"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => springe(1)}
            className="fk-btn-ghost px-2.5 py-1.5 text-xs"
            aria-label="Einen Abschnitt weiter"
          >
            →
          </button>
          <button
            type="button"
            onClick={tempoWechseln}
            className="fk-btn-ghost px-3 py-1.5 text-xs tabular-nums"
            aria-label={`Lesetempo ändern, derzeit ${tempo.toLocaleString('de-DE')}-fach`}
          >
            {tempo.toLocaleString('de-DE')}×
          </button>
          <span className="text-fg-subtle text-xs tabular-nums" aria-live="polite">
            Abschnitt {stelle + 1} von {marken.length}
          </span>
        </>
      )}

      <span className="text-fg-subtle ml-auto text-xs tabular-nums">
        {alsZeit((dauer - jetzt) / tempo)} übrig
      </span>

      {/*
        Die Zeitleiste – wie bei einem Video, und aus demselben Grund.

        Vorher stand hier ein Balken, der nur **zeigte**, wie weit die Aufnahme
        ist. Wer eine Stelle noch einmal hören wollte, konnte abschnittsweise
        springen und sonst nichts; eine Passage in der Mitte eines langen
        Abschnitts war nicht erreichbar.

        Sichtbar sind die Kapitel, bedient wird über einen `range` darüber:
        durchsichtig, deckungsgleich, und damit dasselbe Werkzeug wie zuvor.
        Der Klick landet auf ihm und nicht auf einem Feld – der Browser rechnet
        die Stelle aus der Mausposition, auf die Sekunde genau, egal welches
        Kapitel darunter liegt. Die Tastatur bekommt das geschenkt: Pfeiltasten
        bewegen sekundenweise, Pos1 und Ende springen an die Enden.

        Die Felder selbst nehmen keine Klicks an (`pointer-events-none`). Zwei
        Empfänger für dieselbe Geste wären zwei Antworten auf einen Klick.
      */}
      <label className="flex w-full items-center gap-2">
        <span className="sr-only">Stelle in der Aufnahme</span>
        <span className="text-fg-subtle text-xs tabular-nums">{alsZeit(jetzt)}</span>

        <span className="relative flex h-4 grow items-center">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 flex h-1.5 items-stretch gap-0.5"
          >
            {kapitel.map((kap, i) => (
              <span
                key={kap.beginn}
                title={kap.name}
                style={{ flexGrow: kap.laenge }}
                className="bg-border relative overflow-hidden rounded-full"
              >
                <span
                  className="bg-brand absolute inset-y-0 left-0"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((jetzt - kap.beginn) / kap.laenge) * 100))}%`,
                  }}
                />
                {i === stelle && (
                  <span className="ring-brand/40 absolute inset-0 rounded-full ring-2" />
                )}
              </span>
            ))}
          </span>

          <input
            type="range"
            min={0}
            max={Math.max(dauer, 1)}
            step={1}
            value={Math.min(jetzt, dauer)}
            onChange={(ereignis) => {
              const ziel = Number(ereignis.target.value)
              setJetzt(ziel)
              if (tonRef.current) tonRef.current.currentTime = ziel
            }}
            aria-valuetext={
              `${alsZeit(jetzt)} von ${alsZeit(dauer)}` +
              (kapitel[stelle] ? `, Kapitel ${stelle + 1}: ${kapitel[stelle].name}` : '')
            }
            className="fk-tonleiste relative w-full cursor-pointer bg-transparent"
          />
        </span>

        <span className="text-fg-subtle text-xs tabular-nums">{alsZeit(dauer)}</span>
      </label>

      {/*
        Der Name des Kapitels, in dem die Stimme gerade ist. Ein Feld auf einem
        Balken sagt „hier"; erst der Name sagt, wovon gerade die Rede ist – und
        auf dem Telefon ist das Zeigen auf ein Feld ohnehin keine Bedienung.
      */}
      {kapitel[stelle] && (laeuft || stelle > 0) && (
        <p className="text-fg-subtle w-full truncate text-xs" aria-hidden>
          {stelle + 1}. {kapitel[stelle].name}
        </p>
      )}
    </div>
  )
}
