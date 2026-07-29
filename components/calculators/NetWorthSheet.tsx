'use client'

import { useId, useMemo, useState } from 'react'

import { ComparisonBars } from '@/components/calculators/CalculatorPanels'
import {
  heute,
  leereWerte,
  setzeStichtag,
  setzeWert,
  useBogenstand,
} from '@/components/calculators/vermoegen-speicher'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatCurrency, formatNumber } from '@/lib/format'
import { formatForInput, parseGermanNumber } from '@/lib/parse-number'
import {
  alsTabelle,
  bogen,
  dateiname,
  werteAuswerten,
  type Gruppe,
  type Werte,
} from '@/lib/vermoegen'

/**
 * Der Bogen für das Nettovermögen.
 *
 * ## Warum das kein Rechner im üblichen Sinn ist
 *
 * Die anderen Rechner dieser Seite beantworten eine Frage. Dieser hier stellt
 * eine: Was besitzt du, was schuldest du, und was bleibt. Gerechnet wird nur
 * addiert und einmal subtrahiert – der Wert liegt nicht in der Rechnung,
 * sondern darin, dass man einmal alles zusammenträgt.
 *
 * ## Warum es zwei Downloads gibt
 *
 * Weil es zwei Arten gibt, so etwas zu machen. Die einen füllen hier aus und
 * nehmen das Ergebnis mit. Die anderen wollen einen leeren Bogen, den sie
 * ausdrucken und mit dem Kontoauszug daneben mit der Hand ausfüllen. Beide
 * Wege enden bei derselben Datei – nur einmal mit Zahlen und einmal ohne.
 *
 * ## Wo die Eingaben bleiben
 *
 * Im Browser, im localStorage dieses Geräts – siehe `vermoegen-speicher.ts`.
 * Es gibt keinen Server, an den etwas ginge, und keine Anmeldung. Das ist bei
 * einer vollständigen Vermögensaufstellung kein Nebenaspekt, sondern die
 * Voraussetzung dafür, dass jemand sie überhaupt ausfüllt.
 */

/** Wie viele leere Spalten die heruntergeladene Datei für spätere Male bekommt. */
const WEITERE_SPALTEN = 5

/** Eine Datei im Browser erzeugen und herunterladen. */
function herunterladen(inhalt: string, name: string) {
  /*
    Das Byte-Order-Mark davor ist kein Zierrat: Ohne es liest eine deutsche
    Tabellenkalkulation die Datei als Windows-1252 und macht aus jedem Umlaut
    ein Fragezeichen. Mit ihm erkennt sie UTF-8 und öffnet die Datei ohne
    Rückfrage.
  */
  const datei = new Blob(['﻿', inhalt], { type: 'text/csv;charset=utf-8' })
  const adresse = URL.createObjectURL(datei)
  const verweis = document.createElement('a')
  verweis.href = adresse
  verweis.download = name
  document.body.append(verweis)
  verweis.click()
  verweis.remove()
  URL.revokeObjectURL(adresse)
}

export function NetWorthSheet() {
  const { stichtag, werte } = useBogenstand()
  const auswertung = useMemo(() => werteAuswerten(werte), [werte])

  /*
    Der Stichtag ist bis zur Übernahme durch den Browser leer – absichtlich:
    Die Seite wird beim Erzeugen der Website vorgerendert, „heute“ wäre dort der
    Tag des Bauens und stimmte beim Besuch nicht mehr mit dem überein, was der
    Browser einsetzt. Angezeigt wird deshalb, was im Speicher steht; nur beim
    Herunterladen tritt ersatzweise das heutige Datum ein.
  */
  const postenGesamt = bogen.reduce((summe, gruppe) => summe + gruppe.posten.length, 0)

  return (
    <div className="space-y-6">
      <div className="fk-card p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <label
              htmlFor="vermoegen-stichtag"
              className="text-fg block text-sm font-medium"
            >
              Stichtag
            </label>
            <input
              id="vermoegen-stichtag"
              type="date"
              value={stichtag}
              onChange={(event) => setzeStichtag(event.target.value)}
              className="fk-input mt-1.5 w-auto"
            />
            <p className="text-fg-subtle mt-1.5 text-xs leading-relaxed">
              Das Datum, auf das sich alle Werte beziehen. Es steht später als
              Spaltenüberschrift in der Datei.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const tag = stichtag || heute()
                herunterladen(
                  alsTabelle({ werte, stichtag: tag, weitereSpalten: WEITERE_SPALTEN }),
                  dateiname(tag, true)
                )
              }}
              className="fk-btn-primary px-4 py-2 text-sm"
            >
              <Icon name="download" className="size-4" />
              Ausgefüllt herunterladen
            </button>
            <button
              type="button"
              onClick={() => {
                const tag = stichtag || heute()
                herunterladen(
                  alsTabelle({ stichtag: tag, weitereSpalten: WEITERE_SPALTEN }),
                  dateiname(tag, false)
                )
              }}
              className="fk-btn-secondary px-4 py-2 text-sm"
            >
              <Icon name="download" className="size-4" />
              Leeren Bogen herunterladen
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/*
          Die beiden Überschriften stehen nur für Screenreader da: Sichtbar
          erklären sich die Spalten von selbst, aber ohne sie spränge die
          Gliederung von der h1 der Seite direkt zu den h3 der Gruppen.
        */}
        <section aria-labelledby="bogen-eingaben" className="min-w-0 space-y-6">
          <h2 id="bogen-eingaben" className="sr-only">
            Bogen ausfüllen
          </h2>
          {bogen.map((gruppe) => (
            <GruppenKarte
              key={gruppe.id}
              gruppe={gruppe}
              werte={werte}
              summe={auswertung.jeGruppe[gruppe.id] ?? 0}
              onChange={setzeWert}
            />
          ))}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-fg-subtle text-xs">
              {formatNumber(auswertung.ausgefuellt, 0)} von{' '}
              {formatNumber(postenGesamt, 0)} Zeilen ausgefüllt. Leere Zeilen zählen als
              null – es müssen nicht alle sein.
            </p>
            <button
              type="button"
              onClick={leereWerte}
              className="fk-btn-ghost px-3 py-1.5 text-xs"
              disabled={auswertung.ausgefuellt === 0}
            >
              <Icon name="close" className="size-3.5" />
              Alle Eingaben löschen
            </button>
          </div>
        </section>

        <section
          aria-labelledby="bogen-ergebnis"
          className="lg:sticky lg:top-24 lg:h-fit"
        >
          <h2 id="bogen-ergebnis" className="sr-only">
            Ergebnis
          </h2>
          <div className="fk-card p-5 sm:p-6">
            <p className="text-fg-muted text-sm font-medium">Nettovermögen</p>
            <p
              className={`mt-1.5 text-3xl font-bold tabular-nums ${
                auswertung.netto < 0 ? 'text-danger' : 'text-brand'
              }`}
            >
              {formatCurrency(auswertung.netto, 0)}
            </p>
            <p className="text-fg-subtle mt-2 text-sm leading-relaxed">
              Besitz minus Schulden
              {stichtag && ` zum ${stichtag.split('-').reverse().join('.')}`}.
            </p>

            <div className="mt-5">
              <ComparisonBars
                bars={[
                  {
                    label: 'Besitz',
                    value: auswertung.besitz,
                    display: formatCurrency(auswertung.besitz, 0),
                    barClass: 'bg-success',
                  },
                  {
                    label: 'Schulden',
                    value: auswertung.schulden,
                    display: formatCurrency(auswertung.schulden, 0),
                    barClass: 'bg-danger',
                  },
                ]}
              />
            </div>
          </div>

          <StatGrid columns={2} className="mt-4">
            <Stat
              label="Besitz"
              value={formatCurrency(auswertung.besitz, 0)}
              tone="positive"
            />
            <Stat
              label="Schulden"
              value={formatCurrency(auswertung.schulden, 0)}
              tone="negative"
            />
          </StatGrid>

          <p className="text-fg-subtle mt-4 text-xs leading-relaxed">
            Die Eingaben bleiben auf diesem Gerät. Sie werden nicht übertragen und nicht
            gespeichert außerhalb deines Browsers.
          </p>
        </section>
      </div>

      {auswertung.netto < 0 && (
        <Callout variant="info" title="Ein negatives Nettovermögen ist kein Fehler">
          <p>
            Wer ein Haus finanziert oder ein Studium hinter sich hat, steht am Anfang
            regelmäßig im Minus. Aussagekräftig ist nicht der Stand, sondern die Richtung:
            Lade den Bogen herunter, trage ihn in einem halben Jahr erneut ein und
            vergleiche die beiden Spalten.
          </p>
        </Callout>
      )}

      <Callout variant="tip" title="Zweimal im Jahr genügt">
        <p>
          Eine einzelne Aufstellung sagt wenig. Erst die Reihe zeigt, ob das Nettovermögen
          wächst und woran das liegt – am Sparen oder an den Kursen. Die heruntergeladene
          Datei hat deshalb {formatNumber(WEITERE_SPALTEN, 0)} leere Spalten für die
          nächsten Male: Wer sie ausdruckt, trägt beim nächsten Mal einfach daneben ein.
        </p>
      </Callout>
    </div>
  )
}

/** Eine Gruppe des Bogens mit ihren Zeilen und der Gruppensumme. */
function GruppenKarte({
  gruppe,
  werte,
  summe,
  onChange,
}: {
  gruppe: Gruppe
  werte: Werte
  summe: number
  onChange: (id: string, wert: number | undefined) => void
}) {
  return (
    <section aria-labelledby={`gruppe-${gruppe.id}`} className="fk-card p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={`gruppe-${gruppe.id}`} className="text-fg text-base font-semibold">
          {gruppe.titel}
        </h3>
        <span
          className={`text-sm font-semibold tabular-nums ${
            gruppe.art === 'schulden' ? 'text-danger' : 'text-fg'
          }`}
        >
          {gruppe.art === 'schulden' && summe > 0 ? '− ' : ''}
          {formatCurrency(summe, 0)}
        </span>
      </div>
      <p className="text-fg-muted mt-1 text-sm leading-relaxed">{gruppe.erklaerung}</p>

      <div className="mt-4 space-y-3">
        {gruppe.posten.map((posten) => (
          <BetragsZeile
            key={posten.id}
            label={posten.label}
            hinweis={posten.hinweis}
            wert={werte[posten.id]}
            onChange={(wert) => onChange(posten.id, wert)}
          />
        ))}
      </div>
    </section>
  )
}

/**
 * Eine Zeile des Bogens.
 *
 * Bewusst nicht `NumberField`: Bei 26 Zeilen untereinander braucht es keine
 * Schieberegler und keine Hinweistexte unter jedem Feld, sondern Label und
 * Eingabe in einer Zeile. Ein leeres Feld bleibt leer und wird nicht zu einer
 * Null – wer eine Zeile nicht ausfüllt, soll das später auch sehen.
 */
function BetragsZeile({
  label,
  hinweis,
  wert,
  onChange,
}: {
  label: string
  hinweis?: string
  wert: number | undefined
  onChange: (wert: number | undefined) => void
}) {
  const fehlerId = useId()
  const [text, setText] = useState(() => (wert === undefined ? '' : formatForInput(wert)))
  const [zuletzt, setZuletzt] = useState(wert)
  const [fehler, setFehler] = useState<string | undefined>(undefined)

  // Wird der Wert von außen gesetzt – etwa durch „Alle Eingaben löschen“ oder
  // das Laden aus dem Speicher –, das Textfeld nachziehen. Während des Renderns
  // statt in einem Effekt, wie React es für abgeleiteten State empfiehlt.
  if (wert !== zuletzt) {
    setZuletzt(wert)
    setText(wert === undefined ? '' : formatForInput(wert))
    setFehler(undefined)
  }

  function aendern(eingabe: string) {
    setText(eingabe)
    if (eingabe.trim() === '') {
      setFehler(undefined)
      onChange(undefined)
      return
    }
    const gelesen = parseGermanNumber(eingabe, { min: 0, label })
    setFehler(gelesen.error)
    if (gelesen.ok) onChange(gelesen.value)
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_9rem] items-center gap-3">
      <label className="min-w-0">
        <span className="text-fg block text-sm">{label}</span>
        {hinweis && (
          <span className="text-fg-subtle block text-xs leading-snug">{hinweis}</span>
        )}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          placeholder="—"
          onChange={(event) => aendern(event.target.value)}
          aria-label={label}
          aria-invalid={fehler ? true : undefined}
          aria-describedby={fehler ? fehlerId : undefined}
          className={`fk-input pr-8 text-right tabular-nums ${
            fehler ? 'border-danger focus:border-danger' : ''
          }`}
        />
        <span
          aria-hidden="true"
          className="text-fg-subtle pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm"
        >
          €
        </span>
      </div>
      {fehler && (
        <p
          id={fehlerId}
          role="alert"
          className="text-danger col-span-2 -mt-1 text-xs font-medium"
        >
          {fehler}
        </p>
      )}
    </div>
  )
}
