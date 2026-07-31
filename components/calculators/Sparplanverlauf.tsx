'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  CalculatorGrid,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { InstrumentSuche } from '@/components/calculators/InstrumentSuche'
import { NumberField } from '@/components/calculators/NumberField'
import { useErgebnisbericht } from '@/components/calculators/ErgebnisDownload'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { getCalculatorDefinition } from '@/data/calculators'
import {
  formatCurrency,
  formatDateShort,
  formatNumber,
  formatPercent,
} from '@/lib/format'
import { leseKursCsv } from '@/lib/normierung'
import { einordnung, vergleiche, type Kurspunkt } from '@/lib/sparplan-verlauf'

/**
 * Ein Sparplan am tatsächlichen Kursverlauf.
 *
 * ## Was hier gegen was steht
 *
 * Links der echte Verlauf, rechts dieselbe Gesamtentwicklung ohne Schwankung.
 * Beide enden beim selben Kurs; sie unterscheiden sich nur im Weg dorthin. Was
 * übrig bleibt, ist die Wirkung der **Reihenfolge** – und die ist der ganze
 * Inhalt dieser Seite.
 *
 * ## Warum die Kursreihe nachgeladen wird
 *
 * Dieselbe Entscheidung wie beim Aktienvergleich: Über tausend Reihen ins
 * Seitenpaket zu legen, damit jeder Besucher eine davon braucht, wäre grotesk.
 * Der Browser holt genau die CSV-Datei, die unter `/maerkte/<symbol>/kurse.csv`
 * ohnehin zum Herunterladen liegt – eine Datei, zwei Zwecke.
 *
 * Schlägt der Abruf fehl, steht das da. Ein leeres Ergebnis ohne Erklärung
 * sähe aus wie ein Titel ohne Kursdaten, und das wäre eine falsche Auskunft
 * über den Titel.
 */
/** Was zur Auswahl steht – nur, was die Suche und die Anzeige brauchen. */
export interface Verlaufseintrag {
  symbol: string
  name: string
  ticker: string
  branche?: string
  /** Notierungswährung, für die Beschriftung der Kurse. */
  einheit: string
}

export function Sparplanverlauf({ katalog }: { katalog: Verlaufseintrag[] }) {
  const [symbol, setzeSymbol] = useState(katalog[0]?.symbol ?? '')
  const [rate, setzeRate] = useState(100)

  /*
    Ein einziger Zustand für Reihe **und** Fehler, dazu das Symbol, zu dem
    beides gehört.

    Zwei getrennte Zustände wären naheliegender und falsch: Beim Wechsel des
    Titels müsste der Fehler zurückgesetzt werden, und ein `setState` gleich zu
    Beginn eines Effekts ist genau das Muster, das React zu Recht beanstandet.
    Mit `fuer` im Zustand entscheidet der Vergleich beim Rendern, ob das
    Geladene noch zur Auswahl passt – zurücksetzen muss dann niemand.
  */
  const [stand, setzeStand] = useState<{
    fuer: string
    punkte?: Kurspunkt[]
    fehler?: string
  } | null>(null)

  useEffect(() => {
    if (!symbol) return
    let abgebrochen = false

    fetch(`/maerkte/${symbol}/kurse.csv`)
      .then((antwort) => {
        if (!antwort.ok) throw new Error(String(antwort.status))
        return antwort.text()
      })
      .then((text) => {
        if (abgebrochen) return
        const punkte = leseKursCsv(text).map((p) => ({ d: p.t.slice(0, 10), c: p.value }))
        setzeStand({ fuer: symbol, punkte })
      })
      .catch(() => {
        if (abgebrochen) return
        setzeStand({
          fuer: symbol,
          fehler: 'Die Kursreihe ließ sich nicht laden. Prüf die Verbindung.',
        })
      })

    return () => {
      abgebrochen = true
    }
  }, [symbol])

  const eintrag = katalog.find((k) => k.symbol === symbol)
  const passt = stand?.fuer === symbol
  const fehler = passt ? (stand?.fehler ?? null) : null
  const punkte = passt ? stand?.punkte : undefined
  const ergebnis = useMemo(
    () => (punkte ? vergleiche(punkte, rate) : null),
    [punkte, rate]
  )

  useErgebnisbericht(
    ergebnis && eintrag
      ? {
          titel: 'Sparplan am echten Kursverlauf',
          pfad: '/rechner/sparplanverlauf',
          annahmen: [
            { bezeichnung: 'Titel', wert: `${eintrag.name} (${eintrag.ticker})` },
            { bezeichnung: 'Rate je Monat', wert: formatCurrency(rate) },
            {
              bezeichnung: 'Zeitraum',
              wert: `${formatDateShort(ergebnis.vonTag)} bis ${formatDateShort(ergebnis.bisTag)}`,
            },
            { bezeichnung: 'Anzahl Raten', wert: formatNumber(ergebnis.raten, 0) },
            {
              bezeichnung: 'Gleichmäßige Vergleichsrendite',
              wert: formatPercent(ergebnis.jahresrenditeProzent, 2),
            },
          ],
          ergebnisse: [
            { bezeichnung: 'Eingezahlt', wert: formatCurrency(ergebnis.eingezahlt) },
            {
              bezeichnung: 'Am echten Kursverlauf',
              wert: formatCurrency(ergebnis.echt),
            },
            {
              bezeichnung: 'Bei gleichmäßiger Rendite',
              wert: formatCurrency(ergebnis.gleichmaessig),
            },
            { bezeichnung: 'Unterschied', wert: formatCurrency(ergebnis.unterschied) },
          ],
          grenzen: getCalculatorDefinition('sparplanverlauf')?.grenzen ?? [],
        }
      : null
  )

  return (
    <CalculatorGrid>
      <InputPanel
        onReset={() => {
          setzeSymbol(katalog[0]?.symbol ?? '')
          setzeRate(100)
        }}
      >
        <InstrumentSuche
          label="Titel"
          eintraege={katalog}
          wert={symbol}
          onWaehle={setzeSymbol}
        />
        <NumberField
          label="Rate je Monat"
          value={rate}
          onChange={setzeRate}
          min={1}
          max={100_000}
          suffix="€"
          hint="Gekauft wird am ersten Handelstag jedes Monats."
        />
      </InputPanel>

      <ResultPanel>
        {fehler && (
          <Callout variant="warning" title="Kursreihe nicht geladen">
            <p>{fehler}</p>
          </Callout>
        )}

        {!ergebnis && !fehler && (
          <div className="fk-card p-5 sm:p-6">
            <p className="text-fg-muted leading-relaxed">
              {passt
                ? 'Für diesen Titel reicht die Kursreihe nicht für einen Sparplan über mehrere Monate.'
                : 'Kursreihe wird geladen …'}
            </p>
          </div>
        )}

        {ergebnis && eintrag && (
          <>
            <HeadlineResult
              label={`Aus ${formatCurrency(ergebnis.eingezahlt, 0)} in ${ergebnis.raten} Monatsraten`}
              value={formatCurrency(ergebnis.echt, 0)}
              hint={`Am tatsächlichen Kursverlauf von ${eintrag.name}, vom ${formatDateShort(ergebnis.vonTag)} bis zum ${formatDateShort(ergebnis.bisTag)}.`}
            />

            <div className="fk-card p-5 sm:p-6">
              <h3 className="text-fg text-base font-semibold">
                Derselbe Ertrag, zwei Wege
              </h3>
              <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                Die Vergleichsrechnung setzt{' '}
                <strong className="text-fg font-medium">
                  {formatPercent(ergebnis.jahresrenditeProzent, 2)} je Jahr
                </strong>{' '}
                an – die Rendite, die {eintrag.name} in diesem Zeitraum tatsächlich
                erzielt hat. Beide Wege beginnen und enden beim selben Kurs; sie
                unterscheiden sich nur darin, wann die Bewegung stattfand.
              </p>
              <StatGrid className="mt-5">
                <Stat
                  label="Am echten Kursverlauf"
                  value={formatCurrency(ergebnis.echt, 0)}
                  hint="Jede Rate kauft zum Kurs des Tages."
                />
                <Stat
                  label="Bei gleichmäßiger Rendite"
                  value={formatCurrency(ergebnis.gleichmaessig, 0)}
                  hint="Derselbe Anfang, dasselbe Ende, keine Schwankung dazwischen."
                />
                <Stat
                  label="Unterschied"
                  value={formatCurrency(ergebnis.unterschied, 0)}
                  hint="Was allein die Reihenfolge der Kurse ausgemacht hat."
                />
                <Stat
                  label="Mittlerer Einstand"
                  value={formatNumber(ergebnis.mittlererKurs, 2)}
                  hint={`Der Durchschnitt der Kurse an den Kauftagen liegt bei ${formatNumber(ergebnis.durchschnittskurs, 2)} – der Einstand liegt immer darunter.`}
                />
              </StatGrid>
              <p className="text-fg-muted mt-5 leading-relaxed">
                {einordnung(ergebnis, eintrag.name)}
              </p>
            </div>
          </>
        )}
      </ResultPanel>
    </CalculatorGrid>
  )
}
