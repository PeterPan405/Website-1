'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import { useCompletedLevels } from '@/components/learn/progress-store'
import { Druckknopf } from '@/components/ui/Druckknopf'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { siteConfig } from '@/lib/site'

/**
 * Die Abschluss-Urkunde eines Lernpfads – zum Ausdrucken gestaltet.
 *
 * ## Was sie ist und was nicht
 *
 * Sie bescheinigt, dass alle Stufen des Pfads im Browser abgehakt sind –
 * mehr weiß die Website nicht, und mehr behauptet das Blatt auch nicht:
 * keine Prüfung, kein Abschluss, keine Gegenzeichnung. Der Wert liegt
 * woanders. Ein Pfad ist mehrere Stunden Lesearbeit, und ein Blatt am
 * Kühlschrank oder im Ordner ist eine ehrlichere Belohnung als ein
 * Zahlenstand in einem Browserspeicher, den nie jemand ansieht.
 *
 * ## Gestaltung
 *
 * Doppelrahmen, Serifenschrift, viel Ruhe – die Form einer Urkunde eben,
 * aber mit den Farben sparsam: Gedruckt wird oft schwarzweiß, also trägt
 * die Form das Blatt, nicht die Farbe. Der Name ist ein Eingabefeld und
 * druckt sich mit; bleibt es leer, druckt sich eine Linie zum
 * Von-Hand-Eintragen – beides ist richtig.
 *
 * ## Warum die Urkunde erst am Ende erscheint
 *
 * Vorher zeigt die Seite den Stand und was noch fehlt. Eine Urkunde, die
 * jeder sofort drucken kann, bescheinigt nichts – die Sperre ist mit den
 * Werkzeugen des Browsers zu umgehen, klar, aber wer sich selbst betrügen
 * will, braucht dafür keine Website.
 *
 * Das Ausstellungsdatum entsteht wie bei der Herkunftszeile erst beim
 * Drucken (`beforeprint`): Die Website ist statisch gebaut, ein Datum vom
 * Bautag wäre auf einem später gedruckten Blatt falsch.
 */
export function Urkunde({
  pfadTitel,
  pfadSlug,
  stufenkennungen,
}: {
  pfadTitel: string
  pfadSlug: string
  stufenkennungen: string[]
}) {
  const erledigt = useCompletedLevels()
  const fertig = stufenkennungen.filter((kennung) => erledigt.includes(kennung)).length
  const komplett = fertig === stufenkennungen.length && stufenkennungen.length > 0

  const [name, setzeName] = useState('')
  const [datum, setzeDatum] = useState('')

  // Der Name gilt für alle Pfade – wer die zweite Urkunde druckt, muss ihn
  // nicht noch einmal eintippen. Er bleibt wie aller Lernstand im Gerät.
  useEffect(() => {
    try {
      const gespeichert = window.localStorage.getItem('fk-urkunde-name')
      if (gespeichert) setzeName(gespeichert)
    } catch {
      // Ohne localStorage (Privatmodus mancher Browser) bleibt das Feld leer.
    }
  }, [])

  useEffect(() => {
    const heute = () =>
      setzeDatum(
        new Date().toLocaleDateString('de-DE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      )
    heute()
    window.addEventListener('beforeprint', heute)
    return () => window.removeEventListener('beforeprint', heute)
  }, [])

  function beiEingabe(wert: string) {
    setzeName(wert)
    try {
      window.localStorage.setItem('fk-urkunde-name', wert)
    } catch {
      // Nicht speichern können heißt nur: beim nächsten Mal neu eintippen.
    }
  }

  if (!komplett) {
    return (
      <div className="fk-card max-w-xl p-6" data-drucken="aus">
        <h2 className="text-fg text-lg font-semibold">Noch nicht ganz</h2>
        <ProgressBar
          value={fertig}
          max={stufenkennungen.length}
          label={`${fertig} von ${stufenkennungen.length} Stufen gelesen`}
          className="mt-4"
        />
        <p className="text-fg-muted mt-4 text-sm leading-relaxed">
          Die Urkunde gibt es, wenn alle Stufen des Pfads abgehakt sind. Der Stand zählt
          aus diesem Browser – auf einem anderen Gerät fängt er bei null an.
        </p>
        <Link href={`/lernen/pfade/${pfadSlug}`} className="fk-btn-secondary mt-5">
          <Icon name="arrow-left" className="size-4" />
          Zurück zum Pfad
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/*
        Der Doppelrahmen ist zwei geschachtelte Rahmen mit Luft dazwischen –
        das druckt auf jedem Drucker sauber, auch schwarzweiß, wo ein
        Farbverlauf nur grau matschte.
      */}
      <section
        aria-label={`Urkunde: Lernpfad ${pfadTitel} abgeschlossen`}
        className="border-learn mx-auto max-w-2xl border-4 p-1.5 print:max-w-none"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        <div className="border-fg/30 border px-6 py-10 text-center sm:px-12 sm:py-14">
          <p className="text-fg-subtle text-xs tracking-[0.3em] uppercase">
            {siteConfig.name} · {siteConfig.url.replace(/^https?:\/\//, '')}
          </p>

          {/* Ausdrücklich die Serifenschrift des Rahmens – die Display-Schrift
              der Website würde hier gewinnen und das Blatt in zwei Schriften
              teilen. */}
          <h2
            className="text-fg mt-6 text-4xl font-bold tracking-wide sm:text-5xl"
            style={{ fontFamily: 'inherit' }}
          >
            Urkunde
          </h2>
          <p className="text-fg-muted mt-3 text-sm italic">
            über den Abschluss des Lernpfads
          </p>

          <p className="text-learn mt-6 text-2xl font-semibold text-balance sm:text-3xl">
            {pfadTitel}
          </p>

          {/*
            Das Namensfeld druckt sich mit seinem Inhalt; leer druckt es die
            Linie darunter – zum Eintragen von Hand. Beides ist vorgesehen,
            deshalb kein Pflichtfeld und keine Prüfung.
          */}
          <div className="mx-auto mt-10 max-w-sm">
            <input
              type="text"
              value={name}
              onChange={(ereignis) => beiEingabe(ereignis.target.value)}
              placeholder="Name eintragen – oder später von Hand"
              aria-label="Name für die Urkunde"
              className="border-fg/40 text-fg placeholder:text-fg-subtle w-full border-b bg-transparent pb-1 text-center text-xl focus:outline-none print:placeholder:text-transparent"
              style={{ fontFamily: 'inherit' }}
            />
          </div>

          <p className="text-fg mt-8 leading-relaxed">
            hat alle {stufenkennungen.length} Stufen dieses Lernpfads durchgearbeitet.
          </p>

          <p className="text-fg-subtle mt-10 text-sm">Ausgestellt am {datum}</p>

          {/*
            Die ehrliche Zeile gehört auf das Blatt, nicht daneben: Wer die
            Urkunde Dritten zeigt, zeigt auch die Einordnung mit.
          */}
          <p className="text-fg-subtle mx-auto mt-6 max-w-md text-xs leading-relaxed italic">
            Bestätigt durch den Lernstand im eigenen Browser. Diese Urkunde bescheinigt
            Ausdauer beim Lernen – keine Prüfung und keinen Abschluss.
          </p>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap justify-center gap-3" data-drucken="aus">
        <Druckknopf text="Urkunde drucken oder als PDF speichern" />
        <Link href={`/lernen/pfade/${pfadSlug}`} className="fk-btn-secondary text-sm">
          <Icon name="arrow-left" className="size-4" />
          Zurück zum Pfad
        </Link>
      </div>
    </div>
  )
}
