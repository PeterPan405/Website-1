'use client'

import { useMemo, useState } from 'react'
import { getCalculatorDefinition } from '@/data/calculators'

import {
  CalculatorGrid,
  ComparisonBars,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { NumberField } from '@/components/calculators/NumberField'
import { Rechenweg, type Rechenschritt } from '@/components/calculators/Rechenweg'
import { useErgebnisbericht } from '@/components/calculators/ErgebnisDownload'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import { vergleiche } from '@/lib/kosten'

/**
 * Was zwei Kostenquoten über die Jahre auseinanderbringt.
 *
 * ## Warum dieser Rechner die Voreinstellung so wählt
 *
 * 0,20 gegen 1,50 Prozent ist kein konstruierter Gegensatz, sondern die Spanne,
 * die einem in Deutschland tatsächlich begegnet: Ein breiter Index-ETF liegt
 * heute bei etwa 0,20 Prozent, ein aktiv verwalteter Aktienfonds bei 1,50 bis
 * 1,80. Beides gilt als normal, und der Unterschied sieht auf dem Papier klein
 * aus – bis man ihn über dreißig Jahre laufen lässt.
 *
 * ## Was die Anzeige leisten muss
 *
 * Die entscheidende Zahl ist nicht der Endwert, sondern der **Anteil**: Wie
 * viel Prozent des Vermögens, das sonst dagestanden hätte, ist an die Gebühr
 * gegangen. Ein Eurobetrag über dreißig Jahre lässt sich schwer einordnen, ein
 * Anteil nicht.
 */

const voreinstellung = {
  einmalanlage: 10_000,
  sparrate: 250,
  jahre: 30,
  rendite: 7,
  guenstig: 0.2,
  teuer: 1.5,
}

export function CostCalculator() {
  const [einmalanlage, setEinmalanlage] = useState(voreinstellung.einmalanlage)
  const [sparrate, setSparrate] = useState(voreinstellung.sparrate)
  const [jahre, setJahre] = useState(voreinstellung.jahre)
  const [rendite, setRendite] = useState(voreinstellung.rendite)
  const [guenstig, setGuenstig] = useState(voreinstellung.guenstig)
  const [teuer, setTeuer] = useState(voreinstellung.teuer)

  const ergebnis = useMemo(
    () =>
      vergleiche(
        {
          einmalanlage,
          sparrate,
          jahre,
          bruttorendite: rendite / 100,
        },
        guenstig / 100,
        teuer / 100
      ),
    [einmalanlage, sparrate, jahre, rendite, guenstig, teuer]
  )

  useErgebnisbericht({
    titel: 'Kostenrechner',
    pfad: '/rechner/kostenrechner',
    annahmen: [
      { bezeichnung: 'Einmalanlage', wert: formatCurrency(einmalanlage) },
      { bezeichnung: 'Sparrate monatlich', wert: formatCurrency(sparrate) },
      { bezeichnung: 'Laufzeit', wert: `${formatNumber(jahre)} Jahre` },
      { bezeichnung: 'Bruttorendite je Jahr', wert: formatPercent(rendite, 2) },
      { bezeichnung: 'Kostenquote günstig', wert: formatPercent(guenstig, 2) },
      { bezeichnung: 'Kostenquote teuer', wert: formatPercent(teuer, 2) },
    ],
    ergebnisse: [
      {
        bezeichnung: 'Unterschied im Endvermögen',
        wert: formatCurrency(ergebnis.guenstig.endwert - ergebnis.teuer.endwert),
      },
      { bezeichnung: 'Endwert günstig', wert: formatCurrency(ergebnis.guenstig.endwert) },
      { bezeichnung: 'Endwert teuer', wert: formatCurrency(ergebnis.teuer.endwert) },
      { bezeichnung: 'Eingezahlt', wert: formatCurrency(ergebnis.guenstig.eingezahlt) },
    ],
    grenzen: getCalculatorDefinition('kostenrechner')!.grenzen,
  })

  function zuruecksetzen() {
    setEinmalanlage(voreinstellung.einmalanlage)
    setSparrate(voreinstellung.sparrate)
    setJahre(voreinstellung.jahre)
    setRendite(voreinstellung.rendite)
    setGuenstig(voreinstellung.guenstig)
    setTeuer(voreinstellung.teuer)
  }

  const unterschiedProJahr = jahre > 0 ? ergebnis.unterschied / jahre : 0

  /*
    Der Rechenweg zeigt, wo der Unterschied herkommt.

    Nicht aus der Gebühr selbst – die ist klein. Sondern daraus, dass sie
    jedes Jahr auf den ganzen Bestand anfällt und das Fehlende danach nie
    wieder mitverzinst wird.
  */
  const rechenweg: Rechenschritt[] = [
    {
      was: 'Die Rendite nach Kosten',
      formel: '(1 + Bruttorendite) × (1 − Kostenquote) − 1',
      eingesetzt: `(1 + ${formatNumber(rendite / 100, 4)}) × (1 − ${formatNumber(guenstig / 100, 4)}) − 1`,
      ergebnis: `${formatPercent(ergebnis.guenstig.nettorendite * 100, 3)} gegen ${formatPercent(ergebnis.teuer.nettorendite * 100, 3)}`,
      hinweis:
        'Kein Abziehen, sondern ein Produkt: Die Gebühr wird vom Fondsvermögen genommen, also vom bereits gewachsenen Betrag. Der Unterschied zur Subtraktion ist klein und über dreißig Jahre trotzdem sichtbar.',
    },
    {
      was: 'Endkapital mit dem günstigen Produkt',
      formel: 'Einmalanlage und Raten, verzinst mit der Nettorendite',
      eingesetzt: `${formatCurrency(einmalanlage, 0)} + ${formatCurrency(sparrate, 0)} je Monat über ${formatNumber(jahre, 0)} Jahre bei ${formatPercent(ergebnis.guenstig.nettorendite * 100, 2)}`,
      ergebnis: formatCurrency(ergebnis.guenstig.endwert, 0),
    },
    {
      was: 'Endkapital mit dem teuren Produkt',
      formel: 'dieselbe Rechnung, andere Nettorendite',
      eingesetzt: `dieselben Einzahlungen bei ${formatPercent(ergebnis.teuer.nettorendite * 100, 2)}`,
      ergebnis: formatCurrency(ergebnis.teuer.endwert, 0),
    },
    {
      was: 'Was der Kostenunterschied ausmacht',
      formel: 'günstiges Endkapital − teures Endkapital',
      eingesetzt: `${formatCurrency(ergebnis.guenstig.endwert, 0)} − ${formatCurrency(ergebnis.teuer.endwert, 0)}`,
      ergebnis: formatCurrency(ergebnis.unterschied, 0),
      hinweis: `Das sind ${formatPercent(ergebnis.anteil * 100, 1)} des Endkapitals – aus einem Unterschied von ${formatNumber(teuer - guenstig, 2)} Prozentpunkten im Jahr. Die entnommenen Gebühren selbst sind nur ${formatCurrency(ergebnis.teuer.gebuehren - ergebnis.guenstig.gebuehren, 0)}; der Rest ist der Zinsertrag, der ihnen entgangen ist.`,
    },
  ]

  return (
    <CalculatorGrid>
      <InputPanel onReset={zuruecksetzen}>
        <NumberField
          label="Einmalanlage zu Beginn"
          value={einmalanlage}
          onChange={setEinmalanlage}
          min={0}
          max={10_000_000}
          suffix="€"
          hint="Was bereits angelegt ist. Kann null sein, wenn du bei null anfängst."
        />
        <NumberField
          label="Monatliche Sparrate"
          value={sparrate}
          onChange={setSparrate}
          min={0}
          max={100_000}
          suffix="€"
        />
        <NumberField
          label="Anlagedauer"
          value={jahre}
          onChange={setJahre}
          min={1}
          max={60}
          step={1}
          decimals={0}
          suffix="Jahre"
        />
        <NumberField
          label="Rendite vor Kosten"
          value={rendite}
          onChange={setRendite}
          min={0}
          max={20}
          step={0.1}
          suffix="%"
          hint="Für beide Anlagen dieselbe – genau darum geht es: Verglichen wird nur der Preis, nicht die Leistung."
        />

        <div className="border-border border-t pt-5">
          <NumberField
            label="Kostenquote der günstigen Anlage"
            value={guenstig}
            onChange={setGuenstig}
            min={0}
            max={5}
            step={0.01}
            suffix="%"
            hint="Ein breit streuender Index-ETF liegt heute bei etwa 0,2 Prozent."
          />
        </div>
        <NumberField
          label="Kostenquote der teuren Anlage"
          value={teuer}
          onChange={setTeuer}
          min={0}
          max={5}
          step={0.01}
          suffix="%"
          hint="Aktiv verwaltete Aktienfonds liegen häufig zwischen 1,5 und 1,8 Prozent. Die Zahl steht im Factsheet als „laufende Kosten“ oder „TER“."
        />
      </InputPanel>

      <ResultPanel>
        <HeadlineResult
          label={`Was die teurere Anlage nach ${formatNumber(jahre, 0)} Jahren weniger einbringt`}
          value={formatCurrency(ergebnis.unterschied, 0)}
          tone="negative"
          hint={`Das sind ${formatPercent(ergebnis.anteil * 100, 1)} des Vermögens, das bei der günstigen Anlage dastünde – oder rechnerisch ${formatCurrency(unterschiedProJahr, 0)} je Jahr.`}
        />

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">
            Gleiche Einzahlung, gleiche Rendite, zwei Endstände
          </h3>
          <p className="text-fg-muted mt-1.5 text-sm">
            Beide Anlagen bekommen exakt dasselbe Geld und erwirtschaften vor Kosten exakt
            dieselbe Rendite. Der einzige Unterschied ist die Gebühr.
          </p>
          <div className="mt-5">
            <ComparisonBars
              bars={[
                {
                  label: 'Eingezahlt',
                  value: ergebnis.guenstig.eingezahlt,
                  display: formatCurrency(ergebnis.guenstig.eingezahlt, 0),
                  barClass: 'bg-fg-subtle',
                },
                {
                  label: `Endvermögen bei ${formatNumber(guenstig, 2)} % Kosten`,
                  value: ergebnis.guenstig.endwert,
                  display: formatCurrency(ergebnis.guenstig.endwert, 0),
                  barClass: 'bg-brand',
                },
                {
                  label: `Endvermögen bei ${formatNumber(teuer, 2)} % Kosten`,
                  value: ergebnis.teuer.endwert,
                  display: formatCurrency(ergebnis.teuer.endwert, 0),
                  barClass: 'bg-danger',
                },
              ]}
            />
          </div>
        </div>

        <StatGrid>
          <Stat
            label="Nettorendite günstig"
            value={formatPercent(ergebnis.guenstig.nettorendite * 100, 2)}
            hint="Nach Abzug der laufenden Kosten."
          />
          <Stat
            label="Nettorendite teuer"
            value={formatPercent(ergebnis.teuer.nettorendite * 100, 2)}
            hint="Derselbe Bruttoertrag, weniger davon bleibt übrig."
          />
          <Stat
            label="Gebühren insgesamt"
            value={formatCurrency(ergebnis.teuer.gebuehren, 0)}
            hint="Bei der teuren Anlage – die Entnahmen selbst plus alles, was sie bis zum Ende noch erwirtschaftet hätten."
          />
        </StatGrid>

        <Callout variant="warning" title="Warum die Zahl so viel größer ist als erwartet">
          <p>
            Ein Unterschied von {formatNumber(teuer - guenstig, 2)} Prozentpunkten klingt
            nach {formatNumber(teuer - guenstig, 2)} Prozent weniger Ertrag. Tatsächlich
            sind es hier {formatPercent(ergebnis.anteil * 100, 1)} des Endvermögens. Der
            Grund: Die Gebühr fällt jedes Jahr an, auf den gesamten Bestand – und was sie
            entnimmt, verzinst sich nie wieder. Je länger die Laufzeit, desto größer wird
            dieser zweite Teil.
          </p>
        </Callout>

        <Callout variant="info" title="Was hier nicht drinsteckt">
          <p>
            Nur die laufende Kostenquote. Ausgabeaufschläge, Depotgebühren,
            Transaktionskosten und Steuern kommen obendrauf – wer sie mitrechnen will,
            schlägt sie auf die Kostenquote auf. Und die Annahme, beide Anlagen
            erwirtschafteten dieselbe Bruttorendite, ist bewusst gesetzt: Ob ein teurer
            Fonds seine Kosten durch bessere Auswahl wieder einspielt, ist die eigentliche
            Streitfrage – dieser Rechner beantwortet sie nicht, er zeigt nur, wie hoch die
            Hürde dafür ist.
          </p>
        </Callout>
        <Rechenweg schritte={rechenweg} />
      </ResultPanel>
    </CalculatorGrid>
  )
}
