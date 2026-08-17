'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorGrid,
  ComparisonBars,
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
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import { vergleicheKaufMiete } from '@/lib/kaufen-mieten'

/**
 * Kaufen oder mieten – über den gleichen Geldabfluss verglichen.
 *
 * ## Warum die Hauptzahl nicht „lohnt sich" heißt
 *
 * Weil das niemand beantworten kann: Es hängt daran, was die Immobilie in
 * zwanzig Jahren wert ist, und das weiß heute keiner. Beantwortbar ist die
 * andere Frage – **was müsste passieren, damit es sich lohnt?** Die notwendige
 * jährliche Wertsteigerung ist deshalb die Zahl, die oben steht: Wer sie
 * sieht, kann selbst entscheiden, ob er sie für wahrscheinlich hält.
 *
 * ## Warum die Nebenkosten so prominent stehen
 *
 * Weil sie der Posten sind, den fast jede Überschlagsrechnung vergisst. Zehn
 * Prozent von 400.000 € sind 40.000 €, die am Tag des Kaufs ausgegeben sind –
 * sie stecken nicht in der Immobilie, und wer sie mitfinanziert, zahlt zwanzig
 * Jahre lang Zinsen darauf.
 */

const standard = {
  kaufpreis: 400_000,
  nebenkostenProzent: 10,
  eigenkapital: 100_000,
  zinsProzent: 3.8,
  tilgungProzent: 2,
  instandhaltungProzent: 1.2,
  wertsteigerungProzent: 2,
  mieteProMonat: 1_200,
  mietsteigerungProzent: 2,
  anlagerenditeProzent: 6,
  jahre: 20,
}

export function KaufenOderMieten() {
  const [kaufpreis, setKaufpreis] = useState(standard.kaufpreis)
  const [nebenkosten, setNebenkosten] = useState(standard.nebenkostenProzent)
  const [eigenkapital, setEigenkapital] = useState(standard.eigenkapital)
  const [zins, setZins] = useState(standard.zinsProzent)
  const [tilgung, setTilgung] = useState(standard.tilgungProzent)
  const [instandhaltung, setInstandhaltung] = useState(standard.instandhaltungProzent)
  const [wertsteigerung, setWertsteigerung] = useState(standard.wertsteigerungProzent)
  const [miete, setMiete] = useState(standard.mieteProMonat)
  const [mietsteigerung, setMietsteigerung] = useState(standard.mietsteigerungProzent)
  const [anlagerendite, setAnlagerendite] = useState(standard.anlagerenditeProzent)
  const [jahre, setJahre] = useState(standard.jahre)

  const ergebnis = useMemo(
    () =>
      vergleicheKaufMiete({
        kaufpreis,
        nebenkostenProzent: nebenkosten,
        eigenkapital,
        zinsProzent: zins,
        tilgungProzent: tilgung,
        instandhaltungProzent: instandhaltung,
        wertsteigerungProzent: wertsteigerung,
        mieteProMonat: miete,
        mietsteigerungProzent: mietsteigerung,
        anlagerenditeProzent: anlagerendite,
        jahre,
        /* Ohne Kirchensteuer – wer sie zahlt, findet den Aufschlag im Steuerrechner. */
        kirchensteuersatz: 0,
      }),
    [
      kaufpreis,
      nebenkosten,
      eigenkapital,
      zins,
      tilgung,
      instandhaltung,
      wertsteigerung,
      miete,
      mietsteigerung,
      anlagerendite,
      jahre,
    ]
  )

  const kaufBesser = ergebnis.unterschied > 0
  const noetig = ergebnis.notwendigeWertsteigerungProzent

  useErgebnisbericht({
    titel: 'Kaufen oder mieten',
    pfad: '/rechner/kaufen-oder-mieten',
    annahmen: [
      { bezeichnung: 'Kaufpreis', wert: formatCurrency(kaufpreis) },
      {
        bezeichnung: 'Kaufnebenkosten',
        wert: `${formatPercent(nebenkosten / 100, 1)} = ${formatCurrency(ergebnis.nebenkosten)}`,
        hinweis: 'Grunderwerbsteuer, Notar, Grundbuch und Makler.',
      },
      { bezeichnung: 'Eigenkapital', wert: formatCurrency(eigenkapital) },
      { bezeichnung: 'Kreditzins', wert: formatPercent(zins / 100, 2) },
      { bezeichnung: 'Anfängliche Tilgung', wert: formatPercent(tilgung / 100, 1) },
      {
        bezeichnung: 'Instandhaltung je Jahr',
        wert: `${formatPercent(instandhaltung / 100, 2)} des Kaufpreises`,
      },
      {
        bezeichnung: 'Wertsteigerung je Jahr',
        wert: formatPercent(wertsteigerung / 100, 2),
      },
      { bezeichnung: 'Kaltmiete', wert: `${formatCurrency(miete)} je Monat` },
      {
        bezeichnung: 'Mietsteigerung je Jahr',
        wert: formatPercent(mietsteigerung / 100, 2),
      },
      {
        bezeichnung: 'Anlagerendite je Jahr',
        wert: formatPercent(anlagerendite / 100, 2),
      },
      { bezeichnung: 'Zeitraum', wert: `${formatNumber(jahre)} Jahre` },
    ],
    ergebnisse: [
      {
        bezeichnung: 'Vermögen beim Kaufen',
        wert: formatCurrency(ergebnis.vermoegenKauf),
        hinweis: 'Immobilienwert minus Restschuld.',
      },
      {
        bezeichnung: 'Vermögen beim Mieten',
        wert: formatCurrency(ergebnis.vermoegenMiete),
        hinweis: 'Depotwert nach Abgeltungsteuer auf die Gewinne.',
      },
      {
        bezeichnung: 'Unterschied',
        wert: `${kaufBesser ? '+' : ''}${formatCurrency(ergebnis.unterschied)} für ${kaufBesser ? 'den Kauf' : 'die Miete'}`,
      },
      {
        bezeichnung: 'Notwendige Wertsteigerung je Jahr',
        wert: noetig === null ? 'im Suchbereich keine' : formatPercent(noetig / 100, 2),
        hinweis: 'Ab hier stehen beide Wege gleich.',
      },
      {
        bezeichnung: 'Gezahlte Zinsen',
        wert: formatCurrency(ergebnis.zinsenGezahlt),
      },
      {
        bezeichnung: 'Instandhaltung insgesamt',
        wert: formatCurrency(ergebnis.instandhaltungGesamt),
      },
    ],
    grenzen: getCalculatorDefinition('kaufen-oder-mieten')!.grenzen,
  })

  /*
    Der Rechenweg zeigt die Posten, die sonst untergehen.

    Nicht die Monatsrate – die kennt jeder. Sondern die drei Zeilen, an denen
    sich der Vergleich entscheidet: was die Nebenkosten wirklich kosten, womit
    der Mieter startet, und wie beide Vermögen am Ende zustande kommen.
  */
  const rechenweg: Rechenschritt[] = [
    {
      was: 'Die Kaufnebenkosten',
      formel: 'Kaufpreis × Nebenkostensatz',
      eingesetzt: `${formatCurrency(kaufpreis, 0)} × ${formatPercent(nebenkosten / 100, 1)}`,
      ergebnis: formatCurrency(ergebnis.nebenkosten, 0),
      hinweis:
        'Am Tag des Kaufs ausgegeben. Wer am nächsten Tag zum selben Preis verkauft, hat diesen Betrag verloren – er steckt nicht in der Immobilie.',
    },
    {
      was: 'Das Darlehen',
      formel: 'Kaufpreis + Nebenkosten − Eigenkapital',
      eingesetzt: `${formatCurrency(kaufpreis, 0)} + ${formatCurrency(ergebnis.nebenkosten, 0)} − ${formatCurrency(eigenkapital, 0)}`,
      ergebnis: formatCurrency(ergebnis.darlehen, 0),
    },
    {
      was: 'Was der Käufer im Monat ausgibt',
      formel: 'Kreditrate + Instandhaltung je Monat',
      eingesetzt: `Rate + ${formatCurrency(kaufpreis, 0)} × ${formatPercent(instandhaltung / 100, 2)} ÷ 12`,
      ergebnis: `${formatCurrency(ergebnis.monatsrateKauf, 0)} je Monat`,
      hinweis:
        'An dieser Zahl misst sich der Mieter: Er zahlt Miete und legt die Differenz an. Beide geben also gleich viel aus.',
    },
    {
      was: `Vermögen beim Kaufen nach ${formatNumber(jahre)} Jahren`,
      formel: 'Immobilienwert − Restschuld',
      eingesetzt: `${formatCurrency(ergebnis.verlauf.at(-1)?.immobilienwert ?? 0, 0)} − ${formatCurrency(ergebnis.verlauf.at(-1)?.restschuld ?? 0, 0)}`,
      ergebnis: formatCurrency(ergebnis.vermoegenKauf, 0),
    },
    {
      was: `Vermögen beim Mieten nach ${formatNumber(jahre)} Jahren`,
      formel: 'Depotwert − Abgeltungsteuer auf den Gewinn',
      eingesetzt: `${formatCurrency(ergebnis.vermoegenMiete + ergebnis.steuerMieter, 0)} − ${formatCurrency(ergebnis.steuerMieter, 0)}`,
      ergebnis: formatCurrency(ergebnis.vermoegenMiete, 0),
      hinweis:
        'Das Depot beginnt mit dem Eigenkapital, das der Käufer in die Immobilie gesteckt hat, und bekommt jeden Monat die Differenz. Der Gewinn wird versteuert – der Wertzuwachs der selbstgenutzten Immobilie nicht.',
    },
  ]

  function zuruecksetzen() {
    setKaufpreis(standard.kaufpreis)
    setNebenkosten(standard.nebenkostenProzent)
    setEigenkapital(standard.eigenkapital)
    setZins(standard.zinsProzent)
    setTilgung(standard.tilgungProzent)
    setInstandhaltung(standard.instandhaltungProzent)
    setWertsteigerung(standard.wertsteigerungProzent)
    setMiete(standard.mieteProMonat)
    setMietsteigerung(standard.mietsteigerungProzent)
    setAnlagerendite(standard.anlagerenditeProzent)
    setJahre(standard.jahre)
  }

  return (
    <CalculatorGrid>
      <InputPanel onReset={zuruecksetzen}>
        <NumberField
          label="Kaufpreis"
          value={kaufpreis}
          onChange={setKaufpreis}
          min={10_000}
          max={10_000_000}
          step={10_000}
          suffix="€"
        />
        <NumberField
          label="Kaufnebenkosten"
          value={nebenkosten}
          onChange={setNebenkosten}
          min={0}
          max={20}
          step={0.5}
          suffix="%"
          hint="Grunderwerbsteuer (3,5 bis 6,5 % je Bundesland), Notar und Grundbuch (rund 2 %), Makler (bis 3,57 %). Dieses Geld ist am Tag des Kaufs ausgegeben."
        />
        <NumberField
          label="Eigenkapital"
          value={eigenkapital}
          onChange={setEigenkapital}
          min={0}
          max={10_000_000}
          step={5_000}
          suffix="€"
          hint="Beim Kaufen fließt es in Immobilie und Nebenkosten, beim Mieten ins Depot. Genau dieser Unterschied entscheidet mit."
        />

        <div className="border-border space-y-5 border-t pt-5">
          <NumberField
            label="Kreditzins"
            value={zins}
            onChange={setZins}
            min={0}
            max={15}
            step={0.1}
            suffix="%"
          />
          <NumberField
            label="Anfängliche Tilgung"
            value={tilgung}
            onChange={setTilgung}
            min={0.5}
            max={10}
            step={0.1}
            suffix="%"
          />
          <NumberField
            label="Instandhaltung je Jahr"
            value={instandhaltung}
            onChange={setInstandhaltung}
            min={0}
            max={5}
            step={0.1}
            suffix="% vom Kaufpreis"
            hint="Rücklage für Dach, Heizung, Fenster – plus Grundsteuer und nicht umlegbares Hausgeld. Ein bis anderthalb Prozent sind der übliche Ansatz; in der Miete sind diese Posten enthalten."
          />
          <NumberField
            label="Wertsteigerung je Jahr"
            value={wertsteigerung}
            onChange={setWertsteigerung}
            min={-5}
            max={12}
            step={0.1}
            suffix="%"
            hint="Die unsicherste Annahme des ganzen Rechners. Deshalb steht oben, wie hoch sie sein müsste, damit sich der Kauf gerade lohnt."
          />
        </div>

        <div className="border-border space-y-5 border-t pt-5">
          <NumberField
            label="Kaltmiete"
            value={miete}
            onChange={setMiete}
            min={0}
            max={20_000}
            step={50}
            suffix="€/Monat"
            hint="Ohne Nebenkosten – die zahlt der Eigentümer genauso."
          />
          <NumberField
            label="Mietsteigerung je Jahr"
            value={mietsteigerung}
            onChange={setMietsteigerung}
            min={0}
            max={10}
            step={0.1}
            suffix="%"
          />
          <NumberField
            label="Anlagerendite je Jahr"
            value={anlagerendite}
            onChange={setAnlagerendite}
            min={0}
            max={15}
            step={0.1}
            suffix="%"
            hint="Was das Eigenkapital und die monatliche Differenz im Depot bringen. Die Gewinne werden am Ende mit Abgeltungsteuer belegt – der Wertzuwachs der selbstgenutzten Immobilie nicht."
          />
          <NumberField
            label="Zeitraum"
            value={jahre}
            onChange={setJahre}
            min={1}
            max={50}
            step={1}
            decimals={0}
            suffix="Jahre"
          />
        </div>
      </InputPanel>

      <ResultPanel>
        {/*
          Die Hauptzahl ist die notwendige Wertsteigerung, nicht das Ergebnis.

          „Kaufen ist besser" wäre eine Behauptung über die Zukunft, denn sie
          hängt an einer Annahme, die niemand kennt. Die notwendige
          Wertsteigerung dreht die Frage um: Sie sagt, was passieren müsste –
          und das kann jeder selbst einschätzen.
        */}
        <HeadlineResult
          label="Damit sich der Kauf lohnt, müsste die Immobilie steigen um"
          value={
            noetig === null
              ? kaufBesser
                ? 'gar nicht'
                : 'mehr als 20 % im Jahr'
              : `${formatPercent(noetig / 100, 2)} im Jahr`
          }
          tone={noetig !== null && noetig > wertsteigerung ? 'warning' : 'positive'}
          hint={
            noetig === null
              ? kaufBesser
                ? 'Der Kauf liegt nach diesen Angaben selbst bei fallenden Preisen vorn – meist ist dann die Miete sehr hoch angesetzt.'
                : 'Nach diesen Angaben trägt keine realistische Wertsteigerung den Kauf.'
              : `Sie haben ${formatPercent(wertsteigerung / 100, 2)} angenommen. ${
                  noetig > wertsteigerung
                    ? `Das sind ${formatNumber(noetig - wertsteigerung, 2)} Prozentpunkte zu wenig – nach ${formatNumber(jahre)} Jahren steht das Mieten besser da.`
                    : `Das reicht – nach ${formatNumber(jahre)} Jahren steht das Kaufen besser da.`
                }`
          }
        />

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">
            Vermögen nach {formatNumber(jahre)} Jahren
          </h3>
          <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
            Beide Wege geben in jedem Monat{' '}
            <strong className="text-fg">gleich viel</strong> aus: Der Mieter legt die
            Differenz zu den Ausgaben des Käufers an. Ohne diese Gleichstellung verglichen
            man einen Sparer mit einem Nicht-Sparer.
          </p>
          <div className="mt-5">
            <ComparisonBars
              bars={[
                {
                  label: 'Kaufen: Immobilie minus Restschuld',
                  value: Math.max(0, ergebnis.vermoegenKauf),
                  display: formatCurrency(ergebnis.vermoegenKauf, 0),
                  barClass: 'bg-brand',
                },
                {
                  label: 'Mieten: Depot nach Steuern',
                  value: Math.max(0, ergebnis.vermoegenMiete),
                  display: formatCurrency(ergebnis.vermoegenMiete, 0),
                  barClass: 'bg-markets',
                },
              ]}
            />
          </div>
          <p className="text-fg-muted mt-5 text-sm leading-relaxed">
            Unterschied:{' '}
            <strong className={kaufBesser ? 'text-success' : 'text-warning'}>
              {formatCurrency(Math.abs(ergebnis.unterschied), 0)} für{' '}
              {kaufBesser ? 'das Kaufen' : 'das Mieten'}
            </strong>
            .
          </p>
        </div>

        {/*
          Die drei Posten, um die es geht – und die in „Rate gegen Miete" alle
          drei fehlen.
        */}
        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">
            Was in „Rate gegen Miete“ nicht vorkommt
          </h3>
          <StatGrid columns={3} className="mt-5">
            <Stat
              label="Kaufnebenkosten"
              value={formatCurrency(ergebnis.nebenkosten, 0)}
              tone="negative"
              hint="Am Tag des Kaufs ausgegeben. Sie stecken nicht in der Immobilie – der Wert muss sie erst wieder aufholen."
            />
            <Stat
              label="Zinsen über den Zeitraum"
              value={formatCurrency(ergebnis.zinsenGezahlt, 0)}
              tone="negative"
              hint="Der Teil der Rate, der kein Sparen ist."
            />
            <Stat
              label="Instandhaltung"
              value={formatCurrency(ergebnis.instandhaltungGesamt, 0)}
              tone="negative"
              hint="In der Kaltmiete enthalten, beim Eigentum nicht."
            />
          </StatGrid>
          <StatGrid columns={3} className="mt-4">
            <Stat
              label="Darlehen"
              value={formatCurrency(ergebnis.darlehen, 0)}
              hint="Kaufpreis plus Nebenkosten minus Eigenkapital."
            />
            <Stat
              label="Ausgaben je Monat"
              value={formatCurrency(ergebnis.monatsrateKauf, 0)}
              hint="Rate plus Instandhaltung – die Zahl, an der sich der Mieter misst."
            />
            <Stat
              label="Steuer auf den Depotgewinn"
              value={formatCurrency(ergebnis.steuerMieter, 0)}
              tone="negative"
              hint="Fällt beim Mieter an. Der Wertzuwachs der selbstgenutzten Immobilie bleibt steuerfrei."
            />
          </StatGrid>
        </div>

        <Rechenweg
          schritte={rechenweg}
          fussnote="Die notwendige Wertsteigerung oben wird durch Intervallhalbierung gesucht – sie lässt sich nicht in einer Zeile hinschreiben."
        />

        <Callout variant="info" title="Warum „Rate gegen Miete“ nichts beantwortet">
          <p>
            In der Rate steckt <strong className="text-fg">Tilgung</strong>, und die ist
            keine Ausgabe, sondern Sparen. In der Miete steckt{' '}
            <strong className="text-fg">keine Instandhaltung</strong>, keine Grundsteuer
            und kein nicht umlegbares Hausgeld. Zwei Zahlen, die Verschiedenes enthalten,
            nebeneinanderzustellen beantwortet die Frage nicht – es beantwortet gar
            nichts.
          </p>
          <p className="mt-3">
            Entschieden wird sie von zwei Posten, die in beiden Zahlen fehlen: den
            Kaufnebenkosten, die sofort weg sind, und dem Eigenkapital, das beim Kaufen
            nicht mehr angelegt ist.
          </p>
        </Callout>

        <Callout variant="tip" title="Was diese Rechnung nicht kann">
          <p>
            Sie rechnet mit Geld, und die Entscheidung ist keine reine Geldfrage. Nicht
            kaufen zu können, wo man leben will; ein Vermieter, der Eigenbedarf anmeldet;
            die Freiheit, in einem Jahr in eine andere Stadt zu ziehen – dafür gibt es
            keine Zeile in dieser Tabelle, und für viele sind sie ausschlaggebend.
          </p>
        </Callout>
      </ResultPanel>
    </CalculatorGrid>
  )
}
