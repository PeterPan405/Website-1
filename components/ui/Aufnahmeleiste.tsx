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

export function Aufnahmeleiste({
  adresse,
  marken,
  sekunden,
  aufGeraetestimme,
}: {
  adresse: string
  /** Startsekunde jedes Abschnitts. */
  marken: number[]
  sekunden: number
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

        Ein `range` kann beides: Er zeigt den Stand und nimmt ihn entgegen. Die
        Tastatur bekommt das geschenkt – Pfeiltasten bewegen ihn sekundenweise,
        Pos1 und Ende springen an die Enden.
      */}
      <label className="flex w-full items-center gap-2">
        <span className="sr-only">Stelle in der Aufnahme</span>
        <span className="text-fg-subtle text-xs tabular-nums">{alsZeit(jetzt)}</span>
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
          aria-valuetext={`${alsZeit(jetzt)} von ${alsZeit(dauer)}`}
          className="accent-brand h-1.5 grow cursor-pointer"
        />
        <span className="text-fg-subtle text-xs tabular-nums">{alsZeit(dauer)}</span>
      </label>
    </div>
  )
}
