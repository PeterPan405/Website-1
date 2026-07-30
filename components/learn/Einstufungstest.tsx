'use client'

import Link from 'next/link'
import { useId, useRef, useState } from 'react'

import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { cn } from '@/lib/cn'
import {
  FRAGEN_JE_STUFE,
  TESTLAENGE,
  einstufungssatz,
  waehleTestfragen,
  werteAus,
  type Antwort,
  type Einstufung,
} from '@/lib/einstufung'
import type { Bestandsfrage } from '@/lib/fragenbestand'
import { formatPercent } from '@/lib/format'

/**
 * Der Einstufungstest.
 *
 * ## Arbeitsteilung
 *
 * Auswahl und Auswertung stehen in `lib/einstufung.ts` und sind ohne Browser
 * geprüft – einschließlich des Satzes, der unter dem Ergebnis erscheint. Hier
 * geht es ums Anzeigen und ums Einsammeln der Antworten.
 *
 * ## Warum ohne Begründung während des Tests
 *
 * Der Wissenscheck am Ende einer Lernstufe zeigt nach jeder Antwort die
 * Begründung, weil dort gelernt werden soll. Hier soll gemessen werden: Wer
 * nach Frage drei die Erklärung liest, beantwortet Frage vier anders, und die
 * Einstufung misst dann den Test statt den Stand. Alle Begründungen stehen
 * hinterher zusammen – dann stören sie nichts mehr.
 */

/** Wie viele Themen der Ergebnisblock als Schwächen benennt. */
const SCHWAECHEN_ZEIGEN = 5

type Lage = 'ruht' | 'laedt' | 'fehler' | 'laeuft' | 'fertig'

export function Einstufungstest({
  themennamen,
}: {
  /** Slug → Titel, damit das Ergebnis Themen benennen kann statt Slugs. */
  themennamen: Record<string, string>
}) {
  const gruppe = useId()
  const [lage, setLage] = useState<Lage>('ruht')
  const [fragen, setFragen] = useState<Bestandsfrage[]>([])
  const [position, setPosition] = useState(0)
  const [gewaehlt, setGewaehlt] = useState<number | null>(null)
  const [antworten, setAntworten] = useState<Antwort[]>([])
  const [ergebnis, setErgebnis] = useState<Einstufung | null>(null)

  const ergebnisRef = useRef<HTMLDivElement>(null)

  async function starte() {
    setLage('laedt')
    try {
      const antwort = await fetch('/lernen/fragen.json')
      if (!antwort.ok) throw new Error(String(antwort.status))
      const bestand = (await antwort.json()) as Bestandsfrage[]
      const auswahl = waehleTestfragen(bestand)
      if (auswahl.length === 0) {
        setLage('fehler')
        return
      }
      setFragen(auswahl)
      setPosition(0)
      setGewaehlt(null)
      setAntworten([])
      setErgebnis(null)
      setLage('laeuft')
    } catch {
      setLage('fehler')
    }
  }

  const frage = fragen[position]

  function weiter() {
    if (gewaehlt === null || !frage) return

    const naechste = [
      ...antworten,
      {
        themaSlug: frage.themaSlug,
        stufe: frage.stufe,
        richtig: gewaehlt === frage.richtig,
      },
    ]

    if (position === fragen.length - 1) {
      setAntworten(naechste)
      setErgebnis(werteAus(naechste))
      setLage('fertig')
      window.setTimeout(() => ergebnisRef.current?.focus(), 50)
      return
    }

    setAntworten(naechste)
    setPosition((wert) => wert + 1)
    setGewaehlt(null)
  }

  // ------------------------------------------------------------- Ergebnis
  if (lage === 'fertig' && ergebnis) {
    const zielstufe = ergebnis.empfehlung
    const schwaechen = ergebnis.schwaechen.slice(0, SCHWAECHEN_ZEIGEN)

    return (
      <div
        ref={ergebnisRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="rounded-card border-learn/30 bg-learn-soft border p-6 sm:p-7"
      >
        <p className="fk-chip bg-learn text-white">
          <Icon name="sparkles" className="size-3.5" />
          Einstufung
        </p>

        <h3 className="text-fg mt-4 text-xl font-bold">
          {einstufungssatz(ergebnis).split('.')[0]}
        </h3>
        <p className="text-fg-muted mt-2 leading-relaxed">
          {einstufungssatz(ergebnis).split('. ').slice(1).join('. ')}
        </p>

        <ul className="mt-6 space-y-3">
          {ergebnis.jeStufe.map((stufe) => (
            <li key={stufe.stufe}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-fg text-sm font-medium">
                  {stufe.stufe === 'beginner'
                    ? 'Beginner'
                    : stufe.stufe === 'fortgeschritten'
                      ? 'Fortgeschritten'
                      : 'Profi'}
                </span>
                <span className="text-fg-subtle text-sm tabular-nums">
                  {stufe.richtig} von {stufe.gestellt}
                  {stufe.quote !== null && ` · ${formatPercent(stufe.quote * 100, 0)}`}
                </span>
              </div>
              <ProgressBar
                value={stufe.richtig}
                max={Math.max(stufe.gestellt, 1)}
                label={`${stufe.richtig} von ${stufe.gestellt} richtig`}
                showValue={false}
                barClassName={stufe.bestanden ? 'bg-success' : 'bg-warning'}
                className="mt-1.5"
              />
            </li>
          ))}
        </ul>

        {schwaechen.length > 0 && (
          <div className="mt-6">
            <p className="text-fg text-sm font-medium">Hier lag etwas daneben:</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {schwaechen.map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/lernen/${slug}`}
                    className="fk-chip bg-surface text-fg hover:text-learn"
                  >
                    {themennamen[slug] ?? slug}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-fg-subtle mt-2 text-xs leading-relaxed">
              Eine falsche Antwort ist kein Urteil über ein ganzes Thema – es war je Thema
              höchstens eine Frage. Als Einstiegspunkt taugt die Liste trotzdem.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {zielstufe && (
            <Link href="/lernen" className="fk-btn-primary">
              Themen der Stufe{' '}
              {zielstufe === 'beginner'
                ? 'Beginner'
                : zielstufe === 'fortgeschritten'
                  ? 'Fortgeschritten'
                  : 'Profi'}{' '}
              ansehen
              <Icon name="arrow-right" className="size-4" />
            </Link>
          )}
          {!zielstufe && (
            <Link href="/akademie" className="fk-btn-primary">
              Weiter zur Akademie
              <Icon name="arrow-right" className="size-4" />
            </Link>
          )}
          <button type="button" onClick={starte} className="fk-btn-secondary">
            Test wiederholen
          </button>
        </div>

        <p className="text-fg-subtle mt-6 text-xs leading-relaxed">
          Der Test ist bei jedem Durchlauf derselbe. Das ist Absicht: Nur so lässt sich in
          vier Wochen sagen, ob sich etwas geändert hat – bei wechselnden Fragen wäre
          jeder Vergleich ein Vergleich mit anderen Fragen. Gespeichert wird das Ergebnis
          nicht.
        </p>
      </div>
    )
  }

  // ------------------------------------------------------------ Fragenlauf
  if (lage === 'laeuft' && frage) {
    return (
      <section
        aria-labelledby={`${gruppe}-titel`}
        className="rounded-card border-learn/30 bg-surface border p-6 sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="fk-chip bg-learn-soft text-learn">
            <Icon name="target" className="size-3.5" />
            Einstufungstest
          </p>
          <p className="text-fg-subtle text-sm font-medium tabular-nums">
            Frage {position + 1} von {fragen.length}
          </p>
        </div>

        <h3 id={`${gruppe}-titel`} className="sr-only">
          Einstufungstest, Frage {position + 1} von {fragen.length}
        </h3>

        <ProgressBar
          value={position}
          max={fragen.length}
          label={`Frage ${position + 1} von ${fragen.length}`}
          showValue={false}
          className="mt-4"
        />

        <fieldset className="mt-6">
          <legend className="text-fg text-lg font-semibold">{frage.frage}</legend>

          <div className="mt-4 space-y-2">
            {frage.antworten.map((option, index) => (
              <label
                key={index}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition',
                  'hover:border-learn/50 hover:bg-surface-muted',
                  gewaehlt === index ? 'border-learn bg-learn-soft' : 'border-border'
                )}
              >
                <input
                  type="radio"
                  name={`${gruppe}-frage-${position}`}
                  value={index}
                  checked={gewaehlt === index}
                  onChange={() => setGewaehlt(index)}
                  className="accent-learn mt-0.5 size-4 shrink-0"
                />
                <span className="text-fg min-w-0 flex-1 text-sm leading-relaxed">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-fg-subtle text-xs">
            Keine Rückmeldung zwischendurch – die Auswertung kommt am Ende.
          </p>
          <button
            type="button"
            onClick={weiter}
            disabled={gewaehlt === null}
            className="fk-btn-primary"
          >
            {position === fragen.length - 1 ? 'Auswerten' : 'Weiter'}
            <Icon name="arrow-right" className="size-4" />
          </button>
        </div>
      </section>
    )
  }

  // --------------------------------------------------------------- Auftakt
  return (
    <div className="rounded-card border-learn/30 bg-learn-soft border p-6 sm:p-7">
      <p className="fk-chip bg-learn text-white">
        <Icon name="target" className="size-3.5" />
        Einstufungstest
      </p>
      <h3 className="text-fg mt-4 text-xl font-bold">Wo solltest du anfangen?</h3>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        {TESTLAENGE} Fragen, {FRAGEN_JE_STUFE} je Stufe, quer über die Themen verteilt.
        Rund fünf Minuten. Am Ende steht, mit welcher Stufe der Einstieg sich lohnt – und
        wo etwas danebenlag.
      </p>
      <p className="text-fg-subtle mt-3 max-w-2xl text-sm leading-relaxed">
        Geraten wird nichts weggerechnet: Wer bei vier Möglichkeiten würfelt, trifft im
        Mittel jede vierte. Wer das tut, bekommt eine Empfehlung, die zu einem Würfel
        passt und nicht zu ihm.
      </p>

      {lage === 'fehler' && (
        <Callout
          variant="warning"
          title="Die Fragen ließen sich nicht laden"
          className="mt-6"
        >
          <p>
            Das kann an der Verbindung liegen – versuch es gleich noch einmal. Die
            Lernthemen selbst sind davon nicht betroffen.
          </p>
        </Callout>
      )}

      <button
        type="button"
        onClick={starte}
        disabled={lage === 'laedt'}
        className="fk-btn-primary mt-6"
      >
        {lage === 'laedt' ? 'Fragen werden geladen …' : 'Test starten'}
        <Icon name="arrow-right" className="size-4" />
      </button>
    </div>
  )
}
