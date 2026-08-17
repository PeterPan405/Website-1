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
import { Rechenweg, type Rechenschritt } from '@/components/calculators/Rechenweg'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import {
  anschlussvergleich,
  auswerten,
  rateBeiTilgungssatz,
  restschuldNach,
  sondertilgungswirkung,
  tilgungsplan,
  UEBLICHE_SONDERTILGUNG_PROZENT,
} from '@/lib/kredit'
import { baueTilgungsplanCsv } from '@/lib/tilgungsplan-csv'

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
  sondertilgung: 0,
  /*
    Ein Prozentpunkt Aufschlag als Vorbelegung.

    Nicht als Prognose – niemand weiß, wo die Zinsen in zehn Jahren stehen.
    Ein Prozentpunkt ist die Größenordnung, in der sich Bauzinsen innerhalb
    einer Zinsbindung regelmäßig bewegt haben, und er macht die Frage
    greifbar, die sonst gar nicht gestellt wird.
  */
  anschlussAufschlag: 1,
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
  const [sondertilgung, setSondertilgung] = useState(voreinstellung.sondertilgung)
  const [anschlussAufschlag, setAnschlussAufschlag] = useState(
    voreinstellung.anschlussAufschlag
  )

  /*
    Als `useMemo`, damit die Abhängigkeitslisten darunter ehrlich sind.

    Vorher entstand hier bei jedem Rendern ein neues Objekt, und die
    Listen nannten stattdessen seine Felder. Das rechnete richtig – der
    Linter meldete es trotzdem, und er hatte insofern recht, als niemand
    von außen sehen konnte, dass die Liste vollständig ist. Eine Warnung,
    die man dauerhaft überliest, verdeckt die nächste, die zählt.
  */
  const kredit = useMemo(() => ({ summe, zinsProzent }), [summe, zinsProzent])
  const rate = eigeneRate ?? rateBeiTilgungssatz(kredit, tilgungProzent)

  const ergebnis = useMemo(
    () => auswerten(kredit, rate, sondertilgung),
    [kredit, rate, sondertilgung]
  )
  const restschuld = useMemo(
    () => restschuldNach(kredit, rate, zinsbindungJahre, sondertilgung),
    [kredit, rate, zinsbindungJahre, sondertilgung]
  )

  const wirkung = useMemo(
    () => sondertilgungswirkung(kredit, rate, sondertilgung),
    [kredit, rate, sondertilgung]
  )

  /*
    Der Anschluss wird über die **verbleibende** Laufzeit gerechnet.

    Nicht über eine runde Zahl: Wer nach zehn Jahren Bindung noch 17 Jahre vor
    sich hat, bekommt die Mehrkosten für 17 Jahre. Bleibt nichts übrig, gibt es
    nichts anzuschließen – dann entfällt der ganze Abschnitt, statt eine Zahl
    für einen Fall zu zeigen, den es nicht gibt.
  */
  const restlaufzeitMonate = Math.max(0, ergebnis.monate - zinsbindungJahre * 12)
  const anschluss = useMemo(
    () =>
      anschlussvergleich(
        restschuld,
        zinsProzent,
        zinsProzent + anschlussAufschlag,
        restlaufzeitMonate
      ),
    [restschuld, zinsProzent, anschlussAufschlag, restlaufzeitMonate]
  )

  const sonderAnteilProzent = summe > 0 ? (sondertilgung / summe) * 100 : 0

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
      {
        bezeichnung: 'Sondertilgung je Jahr',
        wert: sondertilgung > 0 ? formatCurrency(sondertilgung) : 'keine',
        hinweis:
          sondertilgung > 0
            ? `${formatPercent(sonderAnteilProzent / 100, 1)} der Darlehenssumme, gerechnet jeweils am Jahresende.`
            : undefined,
      },
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
          ...(sondertilgung > 0
            ? [
                {
                  bezeichnung: 'Durch Sondertilgung gesparte Zinsen',
                  wert: formatCurrency(wirkung.zinsersparnis),
                  hinweis: `Der Kredit ist ${laufzeitText(wirkung.monateFrueher)} früher abbezahlt.`,
                },
              ]
            : []),
          ...(restschuld > 0 && restlaufzeitMonate > 0
            ? [
                {
                  bezeichnung: `Anschluss mit ${anschlussAufschlag > 0 ? '+' : ''}${formatNumber(anschlussAufschlag, 1)} Prozentpunkten`,
                  wert: `${anschluss.mehrProMonat > 0 ? '+' : ''}${formatCurrency(anschluss.mehrProMonat)} im Monat`,
                  hinweis: `Über die Restlaufzeit ${formatCurrency(anschluss.mehrGesamt)}, bei gleicher Restlaufzeit gerechnet.`,
                },
              ]
            : []),
        ],
    grenzen: getCalculatorDefinition('kreditrechner')!.grenzen,
  })

  /*
    Der Rechenweg zeigt die erste Rate von innen.

    Wer einmal sieht, dass von 1.740 € Rate über 900 € Zins sind, versteht die
    Aussage des Rechners besser als aus jeder Kennzahl: Am Anfang tilgt man
    fast nichts, und deshalb steht nach zehn Jahren noch so viel offen.
  */
  const rechenweg: Rechenschritt[] = [
    {
      was: 'Die Rate aus Zins und Anfangstilgung',
      formel: 'Summe × (Zins + Tilgung) ÷ 100 ÷ 12',
      eingesetzt: `${formatCurrency(summe, 0)} × (${formatNumber(zinsProzent, 2)} + ${formatNumber(tilgungProzent, 2)}) ÷ 100 ÷ 12`,
      ergebnis: `${formatCurrency(rate, 2)} je Monat`,
      hinweis: 'So werden Kredite in Deutschland angeboten – die Rate folgt aus beidem.',
    },
    {
      was: 'Der Zinsanteil der ersten Rate',
      formel: 'Restschuld × Jahreszins ÷ 12',
      eingesetzt: `${formatCurrency(summe, 0)} × ${formatNumber(zinsProzent / 100, 4)} ÷ 12`,
      ergebnis: formatCurrency(monatszins, 2),
      hinweis: `Das sind ${formatPercent(rate > 0 ? monatszins / rate : 0, 0)} der Rate. Getilgt wird nur der Rest – und weil die Restschuld sinkt, verschiebt sich das Verhältnis mit jedem Monat.`,
    },
    {
      was: 'Was die erste Rate tilgt',
      formel: 'Rate − Zins',
      eingesetzt: `${formatCurrency(rate, 2)} − ${formatCurrency(monatszins, 2)}`,
      ergebnis: formatCurrency(Math.max(0, rate - monatszins), 2),
    },
    {
      was: `Was nach ${zinsbindungJahre} Jahren noch offen ist`,
      formel: 'Summe − alle Tilgungen der Zinsbindung',
      eingesetzt: `${formatCurrency(summe, 0)} − ${formatCurrency(getilgtBeiBindung, 0)}`,
      ergebnis: formatCurrency(restschuld, 0),
      hinweis:
        'Die Zahl, auf die es ankommt: Sie muss dann zu heute unbekannten Konditionen weiterfinanziert werden.',
    },
  ]

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

        <div className="border-border space-y-5 border-t pt-5">
          <NumberField
            label="Sondertilgung je Jahr"
            value={sondertilgung}
            onChange={setSondertilgung}
            min={0}
            max={200_000}
            step={500}
            suffix="€"
            hint={`Zusätzliche Zahlung, gerechnet jeweils am Jahresende. Die meisten Verträge erlauben ${UEBLICHE_SONDERTILGUNG_PROZENT} % der Darlehenssumme im Jahr – mehr kostet in der Regel einen Zinsaufschlag.`}
          />
          <NumberField
            label="Zinsaufschlag beim Anschluss"
            value={anschlussAufschlag}
            onChange={setAnschlussAufschlag}
            min={-5}
            max={10}
            step={0.1}
            suffix="%-Punkte"
            hint="Keine Prognose, sondern eine Frage: Was passiert, wenn der Zins nach der Bindung so viel höher liegt? Negative Werte für den umgekehrten Fall."
          />
        </div>
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

            {sondertilgung > 0 && (
              <div className="fk-card p-5 sm:p-6">
                <h3 className="text-fg text-base font-semibold">
                  Was die Sondertilgung bringt
                </h3>
                <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
                  Verglichen wird mit demselben Kredit ohne Sondertilgung – gleiche Rate,
                  gleicher Zins.{' '}
                  {sonderAnteilProzent > UEBLICHE_SONDERTILGUNG_PROZENT && (
                    <>
                      <strong className="text-warning font-semibold">
                        {formatPercent(sonderAnteilProzent / 100, 1)} der Darlehenssumme
                      </strong>{' '}
                      liegen über dem, was die meisten Verträge ohne Aufschlag erlauben –
                      prüfe das im Vertrag, bevor du damit rechnest.
                    </>
                  )}
                </p>
                <StatGrid columns={3} className="mt-5">
                  <Stat
                    label="Gesparte Zinsen"
                    value={formatCurrency(wirkung.zinsersparnis, 0)}
                    tone="positive"
                  />
                  <Stat
                    label="Früher schuldenfrei"
                    value={laufzeitText(wirkung.monateFrueher)}
                    tone="positive"
                  />
                  <Stat
                    label="Ersparnis je gezahltem Euro"
                    value={formatCurrency(wirkung.ersparnisJeEuro, 2)}
                    hint="Eine Sondertilgung ist eine Anlage zum Kreditzins – steuerfrei und ohne Risiko."
                  />
                </StatGrid>
              </div>
            )}

            {restschuld > 0 && restlaufzeitMonate > 0 && (
              <div className="fk-card p-5 sm:p-6">
                <h3 className="text-fg text-base font-semibold">
                  Was ein höherer Zins beim Anschluss kostet
                </h3>
                <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
                  Nach {zinsbindungJahre} Jahren stehen noch{' '}
                  {formatCurrency(restschuld, 0)} offen, die über{' '}
                  {laufzeitText(restlaufzeitMonate)} weiterlaufen. Gerechnet wird bei{' '}
                  <strong className="text-fg">gleicher Restlaufzeit</strong>: Wer die Rate
                  gleich lässt, verschiebt die Mehrkosten nur ans Ende und sieht sie
                  nicht.
                </p>
                <StatGrid columns={3} className="mt-5">
                  <Stat
                    label={`Rate bei ${formatPercent(zinsProzent / 100, 2)}`}
                    value={formatCurrency(anschluss.rateAlt, 0)}
                    hint="Der heutige Zins, weitergeführt."
                  />
                  <Stat
                    label={`Rate bei ${formatPercent((zinsProzent + anschlussAufschlag) / 100, 2)}`}
                    value={formatCurrency(anschluss.rateNeu, 0)}
                    tone={anschluss.mehrProMonat > 0 ? 'negative' : 'positive'}
                    hint={`${anschluss.mehrProMonat > 0 ? '+' : ''}${formatCurrency(anschluss.mehrProMonat, 0)} im Monat.`}
                  />
                  <Stat
                    label="Unterschied insgesamt"
                    value={formatCurrency(anschluss.mehrGesamt, 0)}
                    tone={anschluss.mehrGesamt > 0 ? 'negative' : 'positive'}
                    hint={`Über ${formatNumber(restlaufzeitMonate / 12, 0)} Jahre Restlaufzeit.`}
                  />
                </StatGrid>
              </div>
            )}

            {/*
              Der Tilgungsplan als Datei statt als 360 Zeilen auf der Seite.

              Wer damit wirklich rechnen will – gegen ein Bankangebot halten, in
              eine eigene Tabelle einbauen –, braucht ihn als Datei. Auf dem
              Bildschirm wäre er eine Kolonne, durch die niemand scrollt.
            */}
            <div className="fk-card p-5 sm:p-6">
              <h3 className="text-fg text-base font-semibold">Tilgungsplan</h3>
              <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
                Alle {formatNumber(ergebnis.monate)} Monate mit Zins, Tilgung,
                Sondertilgung und Restschuld – als Tabelle zum Weiterrechnen. Semikolon
                als Trenner, Zahlen mit Punkt, wie bei allen Dateien dieser Website.
              </p>
              <button
                type="button"
                onClick={() => {
                  const plan = tilgungsplan(kredit, rate, 12 * 60, sondertilgung)
                  const csv = baueTilgungsplanCsv(plan, {
                    summe,
                    zinsProzent,
                    rate,
                    sondertilgungProJahr: sondertilgung,
                  })
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
                  const adresse = URL.createObjectURL(blob)
                  const anker = document.createElement('a')
                  anker.href = adresse
                  anker.download = `tilgungsplan-${Math.round(summe)}-euro.csv`
                  anker.click()
                  URL.revokeObjectURL(adresse)
                }}
                className="text-fg-subtle hover:text-fg mt-4 text-sm underline underline-offset-2"
              >
                Tilgungsplan als CSV herunterladen
              </button>
            </div>
          </>
        )}
        <Rechenweg schritte={rechenweg} />
      </ResultPanel>
    </CalculatorGrid>
  )
}
