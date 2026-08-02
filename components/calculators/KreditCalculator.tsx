'use client'

import { useMemo, useState } from 'react'
import { getCalculatorDefinition } from '@/data/calculators'

import {
  CalculatorGrid,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { useErgebnisbericht } from '@/components/calculators/ErgebnisDownload'
import { NumberField } from '@/components/calculators/NumberField'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatCurrency, formatPercent } from '@/lib/format'
import { auswerten, rateBeiTilgungssatz, restschuldNach } from '@/lib/kredit'

/**
 * Annuitätendarlehen: Rate, Laufzeit, Zinskosten, Restschuld.
 *
 * ## Warum die Restschuld die Hauptzahl ist
 *
 * Kreditangebote werden über die Rate verkauft, und die Rate ist die am
 * wenigsten interessante Zahl daran: Sie ist so gewählt, dass sie tragbar
 * klingt. Was der Ratenblick verschweigt, ist die **Restschuld am Ende der
 * Zinsbindung** – der Betrag, der dann zu unbekannten Konditionen
 * weiterfinanziert werden muss. `lib/kredit.ts` nennt sie den wichtigsten
 * Wert bei Immobilienkrediten, und genau deshalb steht sie hier oben.
 *
 * ## Warum die Rate über die Anfangstilgung vorbelegt ist
 *
 * So werden Immobilienkredite in Deutschland angeboten: „3,8 Prozent Zins,
 * 2 Prozent Anfangstilgung“. Wer ein solches Angebot vor sich hat, kann es
 * ohne Umrechnung eintippen; wer eine konkrete Rate kennt, überschreibt das
 * Feld einfach.
 */

const voreinstellung = {
  summe: 300_000,
  zinsProzent: 3.8,
  tilgungProzent: 2,
  zinsbindungJahre: 10,
}

/** Laufzeit in Monaten lesbar machen: „27 Jahre, 4 Monate“. */
function laufzeitText(monate: number): string {
  const jahre = Math.floor(monate / 12)
  const rest = monate % 12
  if (jahre === 0) return `${rest} Monate`
  const jahresteil = jahre === 1 ? 'ein Jahr' : `${jahre} Jahre`
  if (rest === 0) return jahresteil
  return `${jahresteil}, ${rest} ${rest === 1 ? 'Monat' : 'Monate'}`
}

export function KreditCalculator() {
  const [summe, setSumme] = useState(voreinstellung.summe)
  const [zinsProzent, setZinsProzent] = useState(voreinstellung.zinsProzent)
  const [tilgungProzent, setTilgungProzent] = useState(voreinstellung.tilgungProzent)
  const [zinsbindungJahre, setZinsbindungJahre] = useState(
    voreinstellung.zinsbindungJahre
  )
  /*
    `null` heißt: Die Rate folgt der Anfangstilgung. Sobald jemand das
    Ratenfeld anfasst, gilt seine Zahl – bis die Tilgung wieder verstellt
    wird, denn wer an der Tilgung dreht, will die daraus folgende Rate sehen.
  */
  const [eigeneRate, setEigeneRate] = useState<number | null>(null)

  const kredit = { summe, zinsProzent }
  const rate = eigeneRate ?? rateBeiTilgungssatz(kredit, tilgungProzent)

  const ergebnis = useMemo(() => auswerten(kredit, rate), [summe, zinsProzent, rate])
  const restschuld = useMemo(
    () => restschuldNach(kredit, rate, zinsbindungJahre),
    [summe, zinsProzent, rate, zinsbindungJahre]
  )

  const monatszins = (summe * zinsProzent) / 100 / 12
  const traegtNicht = rate <= monatszins && summe > 0
  /* 60 Jahre ist die Obergrenze des Tilgungsplans – wer sie erreicht, tilgt
     praktisch nicht. Ehrlicher als eine scheinbar exakte Laufzeit. */
  const uferlos = !traegtNicht && ergebnis.monate >= 12 * 60

  const getilgtBeiBindung = summe - restschuld

  useErgebnisbericht({
    titel: 'Kreditrechner',
    pfad: '/rechner/kreditrechner',
    annahmen: [
      { bezeichnung: 'Darlehenssumme', wert: formatCurrency(summe) },
      { bezeichnung: 'Nominalzins je Jahr', wert: formatPercent(zinsProzent / 100, 2) },
      { bezeichnung: 'Monatliche Rate', wert: formatCurrency(rate) },
      {
        bezeichnung: 'Rate bestimmt über',
        wert:
          eigeneRate === null
            ? `anfängliche Tilgung von ${formatPercent(tilgungProzent / 100, 1)}`
            : 'eigene Eingabe',
      },
      { bezeichnung: 'Zinsbindung', wert: `${zinsbindungJahre} Jahre` },
    ],
    ergebnisse: traegtNicht
      ? [{ bezeichnung: 'Ergebnis', wert: 'Rate deckt den Zins nicht – keine Tilgung' }]
      : [
          { bezeichnung: 'Laufzeit', wert: laufzeitText(ergebnis.monate) },
          { bezeichnung: 'Zinsen gesamt', wert: formatCurrency(ergebnis.zinsenGesamt) },
          { bezeichnung: 'Gesamtkosten', wert: formatCurrency(ergebnis.gesamtkosten) },
          {
            bezeichnung: `Restschuld nach ${zinsbindungJahre} Jahren`,
            wert: formatCurrency(restschuld),
          },
        ],
    grenzen: getCalculatorDefinition('kreditrechner')!.grenzen,
  })

  return (
    <CalculatorGrid>
      <InputPanel>
        <NumberField
          label="Darlehenssumme"
          value={summe}
          onChange={setSumme}
          min={1000}
          max={10_000_000}
          step={1000}
          suffix="€"
          hint="Der ausgezahlte Betrag. Kaufnebenkosten, die mitfinanziert werden, gehören mit hinein."
        />
        <NumberField
          label="Nominalzins pro Jahr"
          value={zinsProzent}
          onChange={setZinsProzent}
          min={0}
          max={25}
          step={0.01}
          suffix="%"
          hint="Der gebundene Sollzins aus dem Angebot – nicht der Effektivzins."
        />
        <NumberField
          label="Anfängliche Tilgung"
          value={tilgungProzent}
          onChange={(wert) => {
            setTilgungProzent(wert)
            setEigeneRate(null)
          }}
          min={0}
          max={20}
          step={0.1}
          suffix="%"
          hint="So werden Kredite angeboten: Zins plus Anfangstilgung ergibt die Rate. Diese Angabe bestimmt das Ratenfeld darunter."
        />
        <NumberField
          label="Monatliche Rate"
          value={Math.round(rate * 100) / 100}
          onChange={setEigeneRate}
          min={0}
          max={100_000}
          step={10}
          suffix="€"
          hint="Aus Zins und Anfangstilgung berechnet – oder direkt überschreiben, wenn eine konkrete Rate feststeht."
        />
        <NumberField
          label="Zinsbindung"
          value={zinsbindungJahre}
          onChange={setZinsbindungJahre}
          min={1}
          max={40}
          step={1}
          suffix="Jahre"
          hint="So lange gilt der Zins. Danach wird die Restschuld zu dann geltenden Konditionen weiterfinanziert."
        />
      </InputPanel>

      <ResultPanel>
        {traegtNicht ? (
          <Callout variant="warning" title="Diese Rate tilgt nichts">
            Die Rate von {formatCurrency(rate)} deckt nicht einmal den Monatszins von{' '}
            {formatCurrency(monatszins)}. Die Schuld würde wachsen statt schrumpfen –
            derselbe Mechanismus, aus dem ein dauerhaft überzogenes Konto nie herauskommt.
          </Callout>
        ) : (
          <>
            <HeadlineResult
              label={`Restschuld nach ${zinsbindungJahre} Jahren Zinsbindung`}
              value={formatCurrency(restschuld)}
              hint={
                restschuld > 0
                  ? 'Dieser Betrag muss dann zu neuen, heute unbekannten Konditionen weiterfinanziert werden. Auf ihn kommt es an, nicht auf die Rate.'
                  : 'Der Kredit ist innerhalb der Zinsbindung vollständig getilgt.'
              }
            />
            <StatGrid>
              <Stat
                label="Laufzeit bis zur Tilgung"
                value={uferlos ? 'über 60 Jahre' : laufzeitText(ergebnis.monate)}
              />
              <Stat label="Monatliche Rate" value={formatCurrency(ergebnis.rate)} />
              <Stat
                label="Zinsen gesamt"
                value={formatCurrency(ergebnis.zinsenGesamt)}
                hint="über die gesamte Laufzeit"
              />
              <Stat
                label="Gesamtkosten"
                value={formatCurrency(ergebnis.gesamtkosten)}
                hint="Darlehen plus Zinsen"
              />
              <Stat
                label={`Getilgt in ${zinsbindungJahre} Jahren`}
                value={formatCurrency(getilgtBeiBindung)}
              />
              <Stat
                label="Zinsanteil der ersten Rate"
                value={formatPercent(rate > 0 ? monatszins / rate : 0, 0)}
                hint="sinkt mit jeder Zahlung"
              />
            </StatGrid>
          </>
        )}
      </ResultPanel>
    </CalculatorGrid>
  )
}
