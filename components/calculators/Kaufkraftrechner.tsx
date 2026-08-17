'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorGrid,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { useErgebnisbericht } from '@/components/calculators/ErgebnisDownload'
import { NumberField } from '@/components/calculators/NumberField'
import { Rechenweg, type Rechenschritt } from '@/components/calculators/Rechenweg'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { getCalculatorDefinition } from '@/data/calculators'
import {
  BASISJAHR,
  ERSTES_JAHR,
  HERKUNFT,
  LETZTES_JAHR,
  PREISINDEX,
  WAEHRUNGEN,
} from '@/data/preisindex'
import { formatCurrency, formatNumber, formatPercentSigned } from '@/lib/format'
import { findeWaehrung, vergleiche, verbliebeneKaufkraft } from '@/lib/kaufkraft'

/**
 * Kaufkraft und Wechselkurs, getrennt ausgewiesen.
 *
 * ## Warum drei Zahlen statt einer
 *
 * „Was sind 100 € von 2015 heute wert?" wird üblicherweise mit **einer** Zahl
 * beantwortet, und die vermischt zwei Dinge, die nichts miteinander zu tun
 * haben: dass Waren in Deutschland teurer geworden sind, und dass der Euro
 * gegenüber anderen Währungen anders steht als damals.
 *
 * Hier steht jede Wirkung für sich, und die dritte Zahl ist ausdrücklich ihre
 * Kombination. Wer nur eine davon braucht, findet sie einzeln; wer beide
 * braucht, sieht, welcher Anteil woher kommt.
 *
 * ## Warum die Zahlen nicht eingegeben werden
 *
 * Weil sie gemessen sind. Preisindex und Wechselkurse kommen aus
 * `data/preisindex.ts` – abgerufen bei Eurostat, mit Datensatzkennung und
 * Datenstand. Ein Feld „erwartete Inflation" gäbe es hier nicht: Die
 * Vergangenheit ist keine Annahme.
 */

const standard = {
  betrag: 100,
  vonJahr: 2015,
  waehrung: 'USD',
}

export function Kaufkraftrechner() {
  const [betrag, setBetrag] = useState(standard.betrag)
  const [vonJahr, setVonJahr] = useState(standard.vonJahr)
  const [nachJahr, setNachJahr] = useState(LETZTES_JAHR)
  const [waehrungscode, setWaehrungscode] = useState(standard.waehrung)

  /*
    Die Jahre werden gedeckelt statt beanstandet.

    Ein Jahr außerhalb der Reihe hat keine Zahlen, und die Rechnung gäbe `null`
    zurück. Statt einer roten Meldung – die beim Tippen von „201" schon
    aufblitzen würde – bleiben die Eingaben im Bereich, für den es Daten gibt.
  */
  const von = Math.min(LETZTES_JAHR, Math.max(ERSTES_JAHR, Math.round(vonJahr)))
  const nach = Math.min(LETZTES_JAHR, Math.max(ERSTES_JAHR, Math.round(nachJahr)))

  const ergebnis = useMemo(
    () => vergleiche(betrag, von, nach, waehrungscode),
    [betrag, von, nach, waehrungscode]
  )
  const uebrig = useMemo(
    () => verbliebeneKaufkraft(betrag, von, nach),
    [betrag, von, nach]
  )

  const waehrung = findeWaehrung(waehrungscode)

  const fremd = (wert: number) =>
    `${formatNumber(wert, waehrung?.stellen ?? 2)} ${waehrungscode}`

  useErgebnisbericht(
    ergebnis && waehrung
      ? {
          titel: 'Kaufkraft und Wechselkurs',
          pfad: '/rechner/kaufkraft',
          annahmen: [
            { bezeichnung: 'Betrag', wert: formatCurrency(betrag) },
            { bezeichnung: 'Ausgangsjahr', wert: String(von) },
            { bezeichnung: 'Vergleichsjahr', wert: String(nach) },
            { bezeichnung: 'Währung', wert: `${waehrung.name} (${waehrung.code})` },
            {
              bezeichnung: 'Datengrundlage',
              wert: 'Eurostat',
              hinweis: `Verbraucherpreisindex Deutschland (${HERKUNFT.preise.datensatz}) und Euro-Referenzkurse (${HERKUNFT.kurse.datensatz}), Jahresdurchschnitte.`,
            },
          ],
          ergebnisse: [
            {
              bezeichnung: `Gleiche Kaufkraft in ${nach}`,
              wert: formatCurrency(ergebnis.gleicheKaufkraft),
              hinweis: `So viel braucht man in ${nach}, um sich dasselbe zu kaufen wie ${formatCurrency(betrag)} in ${von}.`,
            },
            {
              bezeichnung: `Was davon übrig ist`,
              wert: uebrig === null ? '—' : formatCurrency(uebrig),
              hinweis: `Die Kaufkraft von ${formatCurrency(betrag)} aus ${von}, gemessen in Geld von ${nach}.`,
            },
            {
              bezeichnung: 'Teuerung insgesamt',
              wert: formatPercentSigned(ergebnis.teuerungProzent, 1),
              hinweis: `${formatPercentSigned(ergebnis.teuerungProJahrProzent, 2)} je Jahr.`,
            },
            {
              bezeichnung: `Der Betrag in ${von}`,
              wert: fremd(ergebnis.fremdDamals),
            },
            {
              bezeichnung: `Derselbe Betrag in ${nach}`,
              wert: fremd(ergebnis.fremdHeute),
              hinweis: `Allein aus dem Wechselkurs: ${formatPercentSigned(ergebnis.kurseffektProzent, 1)}.`,
            },
            {
              bezeichnung: 'Beides zusammen',
              wert: fremd(ergebnis.fremdMitKaufkraft),
              hinweis: `So viel ${waehrung.code} braucht man in ${nach} für den Lebensstandard von ${formatCurrency(betrag)} aus ${von}.`,
            },
          ],
          grenzen: getCalculatorDefinition('kaufkraft')!.grenzen,
        }
      : null
  )

  /*
    Der Rechenweg macht die Trennung noch einmal an den Zahlen sichtbar.

    Auf der Seite stehen die beiden Wirkungen in getrennten Kästen. Hier steht,
    dass wirklich zwei verschiedene Rechnungen dahinterstecken – und dass die
    dritte Zahl nichts weiter ist als ihr Produkt.
  */
  const rechenweg: Rechenschritt[] = ergebnis
    ? [
        {
          was: 'Die Preise: was derselbe Einkauf heute kostet',
          formel: 'Betrag × Preisindex(Vergleichsjahr) ÷ Preisindex(Ausgangsjahr)',
          eingesetzt: `${formatCurrency(betrag, 0)} × ${formatNumber(PREISINDEX[nach] ?? 0, 1)} ÷ ${formatNumber(PREISINDEX[von] ?? 0, 1)}`,
          ergebnis: formatCurrency(ergebnis.gleicheKaufkraft, 2),
          hinweis: `Der Preisindex ist auf ${BASISJAHR} = 100 normiert. Der Quotient zweier Jahre sagt, um welchen Faktor derselbe Warenkorb teurer geworden ist.`,
        },
        {
          was: 'Der Wechselkurs: was der Betrag damals im Ausland war',
          formel: 'Betrag × Kurs des Ausgangsjahres',
          eingesetzt: `${formatCurrency(betrag, 0)} × ${formatNumber(ergebnis.kurse.damals, 4)}`,
          ergebnis: fremd(ergebnis.fremdDamals),
          hinweis:
            'Jahresdurchschnitt der Euro-Referenzkurse. Diese Zahl hat mit den Preisen in Deutschland nichts zu tun.',
        },
        {
          was: 'Derselbe Betrag heute im Ausland',
          formel: 'Betrag × Kurs des Vergleichsjahres',
          eingesetzt: `${formatCurrency(betrag, 0)} × ${formatNumber(ergebnis.kurse.heute, 4)}`,
          ergebnis: fremd(ergebnis.fremdHeute),
        },
        {
          was: 'Beides zusammen',
          formel: 'gleiche Kaufkraft × Kurs des Vergleichsjahres',
          eingesetzt: `${formatCurrency(ergebnis.gleicheKaufkraft, 2)} × ${formatNumber(ergebnis.kurse.heute, 4)}`,
          ergebnis: fremd(ergebnis.fremdMitKaufkraft),
          hinweis:
            'Erst wenn beide Wirkungen einzeln dastehen, ist ihr Produkt eine Auskunft und keine vermischte Zahl.',
        },
      ]
    : []

  function zuruecksetzen() {
    setBetrag(standard.betrag)
    setVonJahr(standard.vonJahr)
    setNachJahr(LETZTES_JAHR)
    setWaehrungscode(standard.waehrung)
  }

  return (
    <CalculatorGrid>
      <InputPanel onReset={zuruecksetzen}>
        <NumberField
          label="Betrag"
          value={betrag}
          onChange={setBetrag}
          min={0}
          max={100_000_000}
          suffix="€"
          hint="Was damals auf dem Konto lag, im Umschlag steckte oder ein Einkauf gekostet hat."
        />
        <NumberField
          label="Ausgangsjahr"
          value={von}
          onChange={setVonJahr}
          min={ERSTES_JAHR}
          max={LETZTES_JAHR}
          step={1}
          decimals={0}
          hint={`Die Reihen reichen von ${ERSTES_JAHR} bis ${LETZTES_JAHR}. Vor 1999 sind es Kurse der ECU, der Rechnungseinheit, aus der der Euro hervorging.`}
        />
        <NumberField
          label="Vergleichsjahr"
          value={nach}
          onChange={setNachJahr}
          min={ERSTES_JAHR}
          max={LETZTES_JAHR}
          step={1}
          decimals={0}
          hint={`${LETZTES_JAHR} ist das letzte Jahr, für das ein vollständiger Jahresdurchschnitt vorliegt.`}
        />

        <label className="block">
          <span className="text-fg text-sm font-medium">Währung</span>
          <select
            value={waehrungscode}
            onChange={(ereignis) => setWaehrungscode(ereignis.target.value)}
            className="border-border bg-canvas text-fg focus-visible:ring-ring mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            {WAEHRUNGEN.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name} ({w.code})
              </option>
            ))}
          </select>
          <span className="text-fg-subtle mt-1.5 block text-xs leading-relaxed">
            Jahresdurchschnitte der Euro-Referenzkurse der EZB.
          </span>
        </label>
      </InputPanel>

      <ResultPanel>
        {!ergebnis || !waehrung ? (
          <Callout variant="warning" title="Für diese Jahre gibt es keine Zahlen">
            Die Reihen reichen von {ERSTES_JAHR} bis {LETZTES_JAHR}. Eine Zahl dazwischen
            zu schätzen wäre hier der schlimmste Fehler – diese Seite rechnet mit
            gemessenen Werten oder gar nicht.
          </Callout>
        ) : (
          <>
            <HeadlineResult
              label={`${formatCurrency(betrag, 0)} aus ${von} entsprechen in ${nach}`}
              value={formatCurrency(ergebnis.gleicheKaufkraft, 2)}
              tone={ergebnis.teuerungProzent > 0 ? 'warning' : 'positive'}
              hint={`So viel braucht man in ${nach}, um sich dasselbe zu kaufen. Die Preise sind in dieser Zeit um ${formatPercentSigned(ergebnis.teuerungProzent, 1)} gestiegen, im Mittel ${formatPercentSigned(ergebnis.teuerungProJahrProzent, 2)} je Jahr.`}
            />

            {/*
              Die beiden Wirkungen bekommen je einen eigenen Kasten.

              Nebeneinander in einer Kachelreihe säßen sie zwar auch, aber die
              Aussage der Seite ist die Trennung – und die muss man sehen, nicht
              lesen. Ein Kasten je Wirkung ist die Gliederung, die dem
              entspricht.
            */}
            <div className="fk-card p-5 sm:p-6">
              <h3 className="text-fg text-base font-semibold">
                Erste Wirkung: die Preise in Deutschland
              </h3>
              <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
                Was dieselben Waren heute kosten – gemessen am Verbraucherpreisindex,
                Basis {BASISJAHR} = 100. Mit dem Wechselkurs hat das nichts zu tun.
              </p>
              <StatGrid columns={3} className="mt-5">
                <Stat
                  label={`Nötig in ${nach}`}
                  value={formatCurrency(ergebnis.gleicheKaufkraft, 2)}
                  tone="negative"
                  hint="Für denselben Einkauf."
                />
                <Stat
                  label="Davon übrig"
                  value={uebrig === null ? '—' : formatCurrency(uebrig, 2)}
                  tone="negative"
                  hint={`Was ${formatCurrency(betrag, 0)} aus ${von} in Geld von ${nach} noch wert sind – dieselbe Rechnung, andersherum gelesen.`}
                />
                <Stat
                  label="Teuerung je Jahr"
                  value={formatPercentSigned(ergebnis.teuerungProJahrProzent, 2)}
                  hint={`Insgesamt ${formatPercentSigned(ergebnis.teuerungProzent, 1)} über ${formatNumber(nach - von)} Jahre.`}
                />
              </StatGrid>
            </div>

            <div className="fk-card p-5 sm:p-6">
              <h3 className="text-fg text-base font-semibold">
                Zweite Wirkung: der Wechselkurs
              </h3>
              <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
                Was derselbe Eurobetrag an {waehrung.name} bringt – damals und heute.
                Diese Zahl bewegt sich aus ganz anderen Gründen als die Preise, und oft in
                die andere Richtung.
              </p>
              <StatGrid columns={3} className="mt-5">
                <Stat
                  label={`In ${von}`}
                  value={fremd(ergebnis.fremdDamals)}
                  hint={`Kurs: ${formatNumber(ergebnis.kurse.damals, 4)} ${waehrung.code} je Euro.`}
                />
                <Stat
                  label={`In ${nach}`}
                  value={fremd(ergebnis.fremdHeute)}
                  hint={`Kurs: ${formatNumber(ergebnis.kurse.heute, 4)} ${waehrung.code} je Euro.`}
                />
                <Stat
                  label="Allein aus dem Kurs"
                  value={formatPercentSigned(ergebnis.kurseffektProzent, 1)}
                  tone={ergebnis.kurseffektProzent >= 0 ? 'positive' : 'negative'}
                  hint="Ohne jede Preisveränderung."
                />
              </StatGrid>
            </div>

            <div className="fk-card p-5 sm:p-6">
              <h3 className="text-fg text-base font-semibold">Beides zusammen</h3>
              <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
                Wer den Lebensstandard von {von} halten und in {nach} in {waehrung.name}{' '}
                zahlen will, braucht:
              </p>
              <p className="text-fg mt-4 text-3xl font-bold tabular-nums">
                {fremd(ergebnis.fremdMitKaufkraft)}
              </p>
              <p className="text-fg-muted mt-3 text-sm leading-relaxed">
                Statt der {fremd(ergebnis.fremdDamals)}, die {formatCurrency(betrag, 0)}{' '}
                in {von} wert waren. Der Unterschied ist{' '}
                <strong className="text-fg">
                  {formatPercentSigned(
                    (ergebnis.fremdMitKaufkraft / ergebnis.fremdDamals - 1) * 100,
                    1
                  )}
                </strong>{' '}
                – und er setzt sich aus beiden Wirkungen oben zusammen, nicht aus einer.
              </p>
            </div>

            <Rechenweg
              schritte={rechenweg}
              fussnote={`Preisindex und Kurse aus ${HERKUNFT.preise.datensatz} und ${HERKUNFT.kurse.datensatz} bei Eurostat, abgerufen am ${HERKUNFT.abgerufenAm}.`}
            />

            <Callout variant="info" title="Was diese Rechnung nicht sagt">
              <p>
                Sie sagt, wie viele {waehrung.name} man <strong>bekommt</strong> – nicht,
                was man dafür <strong>bekommt</strong>. Dafür bräuchte es den Preisindex
                des jeweiligen Landes, und das ist eine andere Rechnung: Wenn die Preise
                dort schneller gestiegen sind als hier, reicht derselbe umgerechnete
                Betrag trotzdem für weniger.
              </p>
              <p className="mt-3">
                Der Verbraucherpreisindex misst außerdem einen{' '}
                <strong>durchschnittlichen Warenkorb</strong>. Wer überdurchschnittlich
                viel für Miete oder Energie ausgibt, hat eine andere persönliche
                Teuerungsrate als die hier ausgewiesene – nach oben wie nach unten.
              </p>
            </Callout>
          </>
        )}
      </ResultPanel>
    </CalculatorGrid>
  )
}
