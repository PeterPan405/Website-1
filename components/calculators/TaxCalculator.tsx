'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorGrid,
  ComparisonBars,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { NumberField } from '@/components/calculators/NumberField'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import {
  berechneSteuer,
  berechneVorabpauschale,
  gesamtsteuersatz,
  SPARERPAUSCHBETRAG_EINZELN,
  SPARERPAUSCHBETRAG_ZUSAMMEN,
  TEILFREISTELLUNG,
  type Fondsart,
} from '@/lib/kapitalertragsteuer'

/**
 * Steuer auf Kapitalerträge, einschließlich Vorabpauschale.
 *
 * ## Warum beides in einem Rechner steht
 *
 * Weil die Vorabpauschale keine eigene Steuer ist, sondern ein Betrag, der wie
 * jeder andere Kapitalertrag behandelt wird: Teilfreistellung, dann
 * Sparerpauschbetrag, dann Steuersatz. Wer sie getrennt ausrechnet, übersieht
 * genau das – und wundert sich, warum die Bank am Jahresanfang weniger abbucht
 * als erwartet oder gar nichts.
 *
 * ## Die Reihenfolge, die den Unterschied macht
 *
 * Erst die Teilfreistellung, dann der Freibetrag. Bei 1.400 Euro Ertrag aus
 * einem Aktienfonds bleiben nach 30 Prozent Teilfreistellung 980 Euro – und die
 * deckt der Sparerpauschbetrag vollständig ab. Andersherum gerechnet käme
 * Steuer heraus, die nicht anfällt.
 */

const fondsarten: { id: Fondsart; label: string; hinweis: string }[] = [
  {
    id: 'aktienfonds',
    label: 'Aktienfonds (mind. 51 % Aktien)',
    hinweis: 'Der Regelfall bei breit streuenden Aktien-ETFs.',
  },
  {
    id: 'mischfonds',
    label: 'Mischfonds (mind. 25 % Aktien)',
    hinweis: 'Maßgeblich ist die Mindestquote in den Anlagebedingungen.',
  },
  {
    id: 'immobilienfonds',
    label: 'Immobilienfonds (Inland)',
    hinweis: 'Mindestens 51 Prozent Immobilien.',
  },
  {
    id: 'immobilienfondsAusland',
    label: 'Immobilienfonds (überwiegend Ausland)',
    hinweis: 'Mindestens 51 Prozent ausländische Immobilien.',
  },
  {
    id: 'sonstige',
    label: 'Anleihenfonds oder Einzelwerte',
    hinweis: 'Keine Teilfreistellung – auch bei Zinsen und Einzelaktien.',
  },
]

const voreinstellung = {
  fondsertrag: 2000,
  zinsen: 300,
  fondsart: 'aktienfonds' as Fondsart,
  zusammen: false,
  kirchensteuer: 0,
  wertBeginn: 30_000,
  wertEnde: 33_000,
  ausschuettung: 0,
  basiszins: 2.53,
}

export function TaxCalculator() {
  const [fondsertrag, setFondsertrag] = useState(voreinstellung.fondsertrag)
  const [zinsen, setZinsen] = useState(voreinstellung.zinsen)
  const [fondsart, setFondsart] = useState<Fondsart>(voreinstellung.fondsart)
  const [zusammen, setZusammen] = useState(voreinstellung.zusammen)
  const [kirchensteuer, setKirchensteuer] = useState(voreinstellung.kirchensteuer)
  const [wertBeginn, setWertBeginn] = useState(voreinstellung.wertBeginn)
  const [wertEnde, setWertEnde] = useState(voreinstellung.wertEnde)
  const [ausschuettung, setAusschuettung] = useState(voreinstellung.ausschuettung)
  const [basiszins, setBasiszins] = useState(voreinstellung.basiszins)

  const freibetrag = zusammen ? SPARERPAUSCHBETRAG_ZUSAMMEN : SPARERPAUSCHBETRAG_EINZELN

  const vorab = useMemo(
    () =>
      berechneVorabpauschale({
        wertJahresbeginn: wertBeginn,
        wertJahresende: wertEnde,
        ausschuettung,
        basiszins: basiszins / 100,
      }),
    [wertBeginn, wertEnde, ausschuettung, basiszins]
  )

  /*
    Zwei Töpfe, ein Freibetrag.

    Fondserträge und Vorabpauschale tragen die Teilfreistellung, Zinsen nicht.
    Der Sparerpauschbetrag gilt aber für alles zusammen – deshalb wird er
    durchgereicht: erst auf den Fondstopf, der Rest auf die Zinsen.
  */
  const fonds = useMemo(
    () =>
      berechneSteuer({
        ertrag: fondsertrag + vorab.vorabpauschale,
        fondsart,
        freibetrag,
        kirchensteuersatz: kirchensteuer / 100,
      }),
    [fondsertrag, vorab.vorabpauschale, fondsart, freibetrag, kirchensteuer]
  )

  const zins = useMemo(
    () =>
      berechneSteuer({
        ertrag: zinsen,
        fondsart: 'sonstige',
        freibetrag: fonds.freibetragRest,
        kirchensteuersatz: kirchensteuer / 100,
      }),
    [zinsen, fonds.freibetragRest, kirchensteuer]
  )

  const ertragGesamt = fondsertrag + vorab.vorabpauschale + zinsen
  const steuerGesamt = fonds.steuerGesamt + zins.steuerGesamt
  const effektiv = ertragGesamt > 0 ? steuerGesamt / ertragGesamt : 0

  function zuruecksetzen() {
    setFondsertrag(voreinstellung.fondsertrag)
    setZinsen(voreinstellung.zinsen)
    setFondsart(voreinstellung.fondsart)
    setZusammen(voreinstellung.zusammen)
    setKirchensteuer(voreinstellung.kirchensteuer)
    setWertBeginn(voreinstellung.wertBeginn)
    setWertEnde(voreinstellung.wertEnde)
    setAusschuettung(voreinstellung.ausschuettung)
    setBasiszins(voreinstellung.basiszins)
  }

  return (
    <CalculatorGrid>
      <InputPanel onReset={zuruecksetzen}>
        <NumberField
          label="Erträge aus Fonds und ETFs"
          value={fondsertrag}
          onChange={setFondsertrag}
          min={0}
          max={10_000_000}
          suffix="€"
          hint="Ausschüttungen und realisierte Verkaufsgewinne dieses Jahres."
        />

        <label className="block">
          <span className="text-fg text-sm font-medium">Art des Fonds</span>
          <select
            value={fondsart}
            onChange={(ereignis) => setFondsart(ereignis.target.value as Fondsart)}
            className="border-border bg-canvas text-fg focus-visible:ring-ring mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            {fondsarten.map((art) => (
              <option key={art.id} value={art.id}>
                {art.label} – {formatPercent(TEILFREISTELLUNG[art.id] * 100, 0)} frei
              </option>
            ))}
          </select>
          <span className="text-fg-subtle mt-1.5 block text-xs leading-relaxed">
            {fondsarten.find((art) => art.id === fondsart)?.hinweis}
          </span>
        </label>

        <NumberField
          label="Zinsen und übrige Kapitalerträge"
          value={zinsen}
          onChange={setZinsen}
          min={0}
          max={10_000_000}
          suffix="€"
          hint="Tagesgeld, Festgeld, Dividenden aus Einzelaktien. Ohne Teilfreistellung."
        />

        <div className="border-border border-t pt-5">
          <span className="text-fg text-sm font-medium">Sparerpauschbetrag</span>
          <div className="mt-2 flex gap-2">
            {[
              {
                wert: false,
                text: `Einzeln (${formatCurrency(SPARERPAUSCHBETRAG_EINZELN, 0)})`,
              },
              {
                wert: true,
                text: `Zusammen (${formatCurrency(SPARERPAUSCHBETRAG_ZUSAMMEN, 0)})`,
              },
            ].map((wahl) => (
              <button
                key={String(wahl.wert)}
                type="button"
                onClick={() => setZusammen(wahl.wert)}
                aria-pressed={zusammen === wahl.wert}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  zusammen === wahl.wert
                    ? 'border-brand bg-brand text-brand-contrast'
                    : 'border-border text-fg-muted hover:text-fg'
                }`}
              >
                {wahl.text}
              </button>
            ))}
          </div>
          <span className="text-fg-subtle mt-1.5 block text-xs leading-relaxed">
            Er wirkt nur, wenn bei der Bank ein Freistellungsauftrag vorliegt. Sonst
            behält sie die Steuer ein, und man holt sie über die Steuererklärung zurück.
          </span>
        </div>

        <div>
          <span className="text-fg text-sm font-medium">Kirchensteuer</span>
          <div className="mt-2 flex gap-2">
            {[
              { wert: 0, text: 'keine' },
              { wert: 8, text: '8 % (BY, BW)' },
              { wert: 9, text: '9 %' },
            ].map((wahl) => (
              <button
                key={wahl.wert}
                type="button"
                onClick={() => setKirchensteuer(wahl.wert)}
                aria-pressed={kirchensteuer === wahl.wert}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                  kirchensteuer === wahl.wert
                    ? 'border-brand bg-brand text-brand-contrast'
                    : 'border-border text-fg-muted hover:text-fg'
                }`}
              >
                {wahl.text}
              </button>
            ))}
          </div>
        </div>

        <div className="border-border border-t pt-5">
          <p className="text-fg text-sm font-semibold">Vorabpauschale</p>
          <p className="text-fg-subtle mt-1 text-xs leading-relaxed">
            Nur für Fondsanteile, die du über den Jahreswechsel gehalten hast. Bei
            ausschüttenden Fonds oft null.
          </p>
        </div>
        <NumberField
          label="Wert der Anteile zu Jahresbeginn"
          value={wertBeginn}
          onChange={setWertBeginn}
          min={0}
          max={10_000_000}
          suffix="€"
        />
        <NumberField
          label="Wert am Jahresende"
          value={wertEnde}
          onChange={setWertEnde}
          min={0}
          max={10_000_000}
          suffix="€"
        />
        <NumberField
          label="Ausschüttungen im Jahr"
          value={ausschuettung}
          onChange={setAusschuettung}
          min={0}
          max={1_000_000}
          suffix="€"
          hint="Bei thesaurierenden Fonds null."
        />
        <NumberField
          label="Basiszins"
          value={basiszins}
          onChange={setBasiszins}
          min={0}
          max={10}
          step={0.01}
          suffix="%"
          hint="Wird jährlich vom Bundesfinanzministerium bekanntgegeben. Für 2025 lag er bei 2,53 Prozent."
        />
      </InputPanel>

      <ResultPanel>
        <HeadlineResult
          label="Steuer auf deine Kapitalerträge"
          value={formatCurrency(steuerGesamt, 2)}
          tone="negative"
          hint={`Das sind ${formatPercent(effektiv * 100, 1)} von ${formatCurrency(ertragGesamt, 0)} Ertrag – der Höchstsatz läge bei ${formatPercent(gesamtsteuersatz(kirchensteuer / 100) * 100, 2)}.`}
        />

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">Wo der Ertrag bleibt</h3>
          <p className="text-fg-muted mt-1.5 text-sm">
            Von deinem Ertrag wird zuerst die Teilfreistellung abgezogen, dann der
            Sparerpauschbetrag. Nur der Rest wird besteuert.
          </p>
          <div className="mt-5">
            <ComparisonBars
              bars={[
                {
                  label: 'Ertrag insgesamt',
                  value: ertragGesamt,
                  display: formatCurrency(ertragGesamt, 0),
                  barClass: 'bg-fg-subtle',
                },
                {
                  label: 'Steuerfrei durch Teilfreistellung',
                  value: fonds.teilfreigestellt,
                  display: formatCurrency(fonds.teilfreigestellt, 0),
                  barClass: 'bg-success',
                },
                {
                  label: 'Gedeckt durch den Sparerpauschbetrag',
                  value: fonds.durchFreibetrag + zins.durchFreibetrag,
                  display: formatCurrency(
                    fonds.durchFreibetrag + zins.durchFreibetrag,
                    0
                  ),
                  barClass: 'bg-brand',
                },
                {
                  label: 'Steuerpflichtig',
                  value: fonds.bemessungsgrundlage + zins.bemessungsgrundlage,
                  display: formatCurrency(
                    fonds.bemessungsgrundlage + zins.bemessungsgrundlage,
                    0
                  ),
                  barClass: 'bg-danger',
                },
              ]}
            />
          </div>
        </div>

        <StatGrid>
          <Stat
            label="Kapitalertragsteuer"
            value={formatCurrency(
              fonds.kapitalertragsteuer + zins.kapitalertragsteuer,
              2
            )}
          />
          <Stat
            label="Solidaritätszuschlag"
            value={formatCurrency(
              fonds.solidaritaetszuschlag + zins.solidaritaetszuschlag,
              2
            )}
            hint="5,5 Prozent der Kapitalertragsteuer."
          />
          <Stat
            label="Kirchensteuer"
            value={formatCurrency(fonds.kirchensteuer + zins.kirchensteuer, 2)}
            hint={
              kirchensteuer === 0
                ? 'Keine Mitgliedschaft angegeben.'
                : `${formatNumber(kirchensteuer, 0)} Prozent der Kapitalertragsteuer.`
            }
          />
        </StatGrid>

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">Die Vorabpauschale</h3>
          {vorab.vorabpauschale > 0 ? (
            <>
              <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
                Für dieses Jahr gelten{' '}
                <strong className="text-fg font-semibold">
                  {formatCurrency(vorab.vorabpauschale, 2)}
                </strong>{' '}
                als zugeflossen – ohne dass Geld geflossen wäre. Die Bank bucht die Steuer
                darauf am Anfang des Folgejahres von deinem Verrechnungskonto ab.
              </p>
              <dl className="text-fg-subtle mt-4 space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt>Basisertrag ({formatNumber(basiszins, 2)} % × 70 %)</dt>
                  <dd className="text-fg-muted tabular-nums">
                    {formatCurrency(vorab.basisertrag, 2)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Wertzuwachs des Jahres (Obergrenze)</dt>
                  <dd className="text-fg-muted tabular-nums">
                    {formatCurrency(vorab.wertzuwachs, 2)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>abzüglich Ausschüttungen</dt>
                  <dd className="text-fg-muted tabular-nums">
                    −{formatCurrency(ausschuettung, 2)}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
              Für dieses Jahr fällt keine Vorabpauschale an –{' '}
              {vorab.grund === 'wertverlust'
                ? 'die Anteile haben im Jahresverlauf nicht an Wert gewonnen. Bei Wertverlust gibt es grundsätzlich keine.'
                : 'die Ausschüttungen decken den Basisertrag bereits ab.'}
            </p>
          )}
        </div>

        <Callout
          variant="info"
          title="Warum die Vorabpauschale keine zusätzliche Steuer ist"
        >
          <p>
            Sie holt nur vor, was beim Verkauf ohnehin anfiele. Beim späteren Verkauf wird
            alles, was bereits als Vorabpauschale versteuert wurde, vom Gewinn abgezogen –
            versteuert wird also nicht doppelt. Ihr Zweck ist die Gleichbehandlung: Ohne
            sie bliebe ein thesaurierender Fonds bis zum Verkauf unversteuert, ein
            ausschüttender nicht.
          </p>
        </Callout>

        <Callout variant="warning" title="Was dieser Rechner nicht kann">
          <p>
            Er rechnet den Regelfall eines privaten Anlegers mit Wohnsitz in Deutschland.
            Nicht enthalten sind die Günstigerprüfung (sinnvoll bei niedrigem Einkommen),
            anrechenbare ausländische Quellensteuer, Verlustverrechnungstöpfe und
            Altbestände von vor 2009. Das Ergebnis ist eine Orientierung und ersetzt keine
            Steuerberatung.
          </p>
        </Callout>
      </ResultPanel>
    </CalculatorGrid>
  )
}
