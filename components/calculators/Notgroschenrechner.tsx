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
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { getCalculatorDefinition } from '@/data/calculators'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import { notgroschen, PAUSCHALE, type Beschaeftigung } from '@/lib/notgroschen'

/**
 * Wie viele Monatsausgaben der Notgroschen tragen muss – für diesen Haushalt.
 *
 * ## Warum die Begründungen die halbe Seite einnehmen
 *
 * Weil sie das Ergebnis sind. Eine Zahl allein wäre wieder eine Faustregel,
 * nur mit mehr Rechenschritten davor – „acht Monate" ist genauso wenig
 * überprüfbar wie „drei bis sechs", solange nicht dabeisteht, woher die acht
 * kommen.
 *
 * Deshalb steht jeder Zu- und Abschlag mit Grund und Erklärung untereinander.
 * Wer der Begründung nicht folgt, kann die Angabe ändern und sieht sofort, was
 * sie ausmacht – das ist mehr wert als jede Nachkommastelle.
 */

const beschaeftigungen: { id: Beschaeftigung; label: string; hinweis: string }[] = [
  {
    id: 'unbefristet',
    label: 'Unbefristet angestellt',
    hinweis:
      'Kündigungsfrist als Vorwarnzeit und Anspruch auf Arbeitslosengeld – der Fall, für den die Faustregel gemacht ist.',
  },
  {
    id: 'verbeamtet',
    label: 'Verbeamtet',
    hinweis:
      'Der Wegfall des Einkommens ist sehr unwahrscheinlich. Waschmaschine, Auto und Zahnersatz bleiben.',
  },
  {
    id: 'befristet',
    label: 'Befristet angestellt',
    hinweis:
      'Der Vertrag endet, ohne dass jemand kündigen muss – und damit ohne die Vorwarnzeit, die eine Kündigung gibt.',
  },
  {
    id: 'probezeit',
    label: 'In der Probezeit',
    hinweis:
      'Zwei Wochen Kündigungsfrist. Der Anspruch auf Arbeitslosengeld setzt zwölf Versicherungsmonate in den letzten dreißig voraus.',
  },
  {
    id: 'selbststaendig',
    label: 'Selbstständig',
    hinweis:
      'Kein Arbeitslosengeld, keine Kündigungsfrist, schwankende Einnahmen. Der Puffer ist hier auch Betriebsmittel.',
  },
]

const standard = {
  beschaeftigung: 'unbefristet' as Beschaeftigung,
  einkommen: 1,
  ausgabenProMonat: 2_400,
  fixkostenProMonat: 1_500,
  unterhaltspflichten: 0,
}

export function Notgroschenrechner() {
  const [beschaeftigung, setBeschaeftigung] = useState<Beschaeftigung>(
    standard.beschaeftigung
  )
  const [einkommen, setEinkommen] = useState(standard.einkommen)
  const [ausgaben, setAusgaben] = useState(standard.ausgabenProMonat)
  const [fixkosten, setFixkosten] = useState(standard.fixkostenProMonat)
  const [unterhalt, setUnterhalt] = useState(standard.unterhaltspflichten)

  /*
    Fixkosten können nicht über den Ausgaben liegen.

    Nicht durch eine Fehlermeldung, sondern durch Deckeln: Wer die Ausgaben
    nachträglich senkt, hat für einen Moment eine unmögliche Eingabe, und dafür
    eine rote Meldung zu zeigen wäre Bevormundung. Der Anteil bleibt so
    höchstens 100 Prozent, und das ist die Zahl, an der die Rechnung hängt.
  */
  const fixkostenGedeckelt = Math.min(fixkosten, ausgaben)

  const ergebnis = useMemo(
    () =>
      notgroschen({
        beschaeftigung,
        einkommen,
        ausgabenProMonat: ausgaben,
        fixkostenProMonat: fixkostenGedeckelt,
        unterhaltspflichten: unterhalt,
      }),
    [beschaeftigung, einkommen, ausgaben, fixkostenGedeckelt, unterhalt]
  )

  const abweichung = ergebnis.monateVon - PAUSCHALE.min

  useErgebnisbericht({
    titel: 'Notgroschen',
    pfad: '/rechner/notgroschen',
    annahmen: [
      {
        bezeichnung: 'Beschäftigung',
        wert: beschaeftigungen.find((b) => b.id === beschaeftigung)?.label ?? '',
      },
      { bezeichnung: 'Einkommen im Haushalt', wert: formatNumber(einkommen) },
      { bezeichnung: 'Ausgaben je Monat', wert: formatCurrency(ausgaben) },
      {
        bezeichnung: 'Davon Fixkosten',
        wert: formatCurrency(fixkostenGedeckelt),
        hinweis: `${formatPercent(ergebnis.fixkostenanteilProzent, 0)} der Ausgaben.`,
      },
      {
        bezeichnung: 'Mitversorgte Personen',
        wert: formatNumber(unterhalt),
      },
    ],
    ergebnisse: [
      {
        bezeichnung: 'Empfohlener Notgroschen',
        wert: `${formatCurrency(ergebnis.euroVon)} – ${formatCurrency(ergebnis.euroBis)}`,
        hinweis: `${ergebnis.monateVon} bis ${ergebnis.monateBis} Monatsausgaben.`,
      },
      {
        bezeichnung: 'Gegenüber der Faustregel',
        wert:
          abweichung === 0
            ? 'unverändert'
            : `${abweichung > 0 ? '+' : ''}${formatNumber(abweichung)} Monate`,
      },
      {
        bezeichnung: 'Reichweite im Sparmodus',
        wert: `${formatNumber(ergebnis.monateImSparmodus, 1)} Monate`,
        hinweis: 'Die Obergrenze, wenn nur noch die Fixkosten laufen.',
      },
      ...ergebnis.beitraege
        .filter((b) => b.monate !== 0)
        .map((b) => ({
          bezeichnung: b.grund,
          wert: `${b.monate > 0 ? '+' : ''}${formatNumber(b.monate)} Monate`,
          hinweis: b.erklaerung,
        })),
    ],
    grenzen: getCalculatorDefinition('notgroschen')!.grenzen,
  })

  function zuruecksetzen() {
    setBeschaeftigung(standard.beschaeftigung)
    setEinkommen(standard.einkommen)
    setAusgaben(standard.ausgabenProMonat)
    setFixkosten(standard.fixkostenProMonat)
    setUnterhalt(standard.unterhaltspflichten)
  }

  const gewaehlt = beschaeftigungen.find((b) => b.id === beschaeftigung)

  return (
    <CalculatorGrid>
      <InputPanel onReset={zuruecksetzen}>
        <label className="block">
          <span className="text-fg text-sm font-medium">Beschäftigung</span>
          <select
            value={beschaeftigung}
            onChange={(ereignis) =>
              setBeschaeftigung(ereignis.target.value as Beschaeftigung)
            }
            className="border-border bg-canvas text-fg focus-visible:ring-ring mt-1.5 w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
          >
            {beschaeftigungen.map((art) => (
              <option key={art.id} value={art.id}>
                {art.label}
              </option>
            ))}
          </select>
          <span className="text-fg-subtle mt-1.5 block text-xs leading-relaxed">
            {gewaehlt?.hinweis}
          </span>
        </label>

        <NumberField
          label="Einkommen im Haushalt"
          value={einkommen}
          onChange={setEinkommen}
          min={1}
          max={4}
          step={1}
          decimals={0}
          hint="Wie viele Menschen tragen den Haushalt mit ihrem Einkommen? Zwei Einkommen beim selben Arbeitgeber zählen im Ernstfall wie eines."
        />

        <NumberField
          label="Ausgaben je Monat"
          value={ausgaben}
          onChange={setAusgaben}
          min={0}
          max={50_000}
          suffix="€"
          hint="Alles, was der Haushalt monatlich braucht – jährliche Posten wie Versicherungen anteilig gerechnet. Der Haushaltsrechner liefert die Zahl."
        />

        <NumberField
          label="Davon Fixkosten"
          value={fixkosten}
          onChange={setFixkosten}
          min={0}
          max={50_000}
          suffix="€"
          hint="Was auch dann weiterläuft, wenn das Einkommen wegfällt: Miete oder Kredit, Nebenkosten, Versicherungen, Kita, Mobilfunk. Nicht: Restaurant, Kleidung, Urlaub, Abonnements."
        />

        <NumberField
          label="Mitversorgte Personen"
          value={unterhalt}
          onChange={setUnterhalt}
          min={0}
          max={8}
          step={1}
          decimals={0}
          hint="Kinder und unterhaltsberechtigte Angehörige. Sie machen die kurzfristigen Auswege – Umzug, Nebenjob, Ortswechsel – langsamer."
        />
      </InputPanel>

      <ResultPanel>
        <HeadlineResult
          label="Empfohlener Notgroschen"
          value={`${formatCurrency(ergebnis.euroVon, 0)} – ${formatCurrency(ergebnis.euroBis, 0)}`}
          tone={abweichung > 0 ? 'warning' : 'brand'}
          hint={`${ergebnis.monateVon} bis ${ergebnis.monateBis} Monatsausgaben${
            abweichung === 0
              ? ' – wie die Faustregel.'
              : abweichung > 0
                ? `, also ${formatNumber(abweichung)} Monate mehr als die verbreitete Faustregel von ${PAUSCHALE.min} bis ${PAUSCHALE.max}.`
                : `, also ${formatNumber(-abweichung)} Monate weniger als die verbreitete Faustregel von ${PAUSCHALE.min} bis ${PAUSCHALE.max}.`
          }`}
        />

        {/*
          Die Begründungen sind das Ergebnis, nicht die Zahl darüber.

          Eine Empfehlung ohne sie wäre wieder eine Faustregel – nur mit mehr
          Rechenschritten davor. Wer einer Zeile nicht folgt, ändert die
          zugehörige Angabe und sieht sofort, was sie ausmacht.
        */}
        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">
            Wie diese Zahl zustande kommt
          </h3>
          <ol className="mt-4 space-y-4">
            {ergebnis.beitraege.map((beitrag) => (
              <li key={beitrag.grund} className="flex gap-4">
                <span
                  className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold tabular-nums ${
                    beitrag.monate > 0
                      ? 'border-warning/40 text-warning'
                      : beitrag.monate < 0
                        ? 'border-success/40 text-success'
                        : 'border-border-strong text-fg-muted'
                  }`}
                >
                  {beitrag.monate === 0
                    ? `${PAUSCHALE.min}–${PAUSCHALE.max}`
                    : `${beitrag.monate > 0 ? '+' : ''}${beitrag.monate}`}
                </span>
                <span>
                  <strong className="text-fg text-sm font-semibold">
                    {beitrag.grund}
                  </strong>
                  <span className="text-fg-muted mt-1 block text-sm leading-relaxed">
                    {beitrag.erklaerung}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <StatGrid columns={3}>
          <Stat
            label="Fixkostenanteil"
            value={formatPercent(ergebnis.fixkostenanteilProzent, 0)}
            tone={ergebnis.fixkostenanteilProzent >= 75 ? 'negative' : 'neutral'}
            hint="Der Teil der Ausgaben, der im Ernstfall weiterläuft."
          />
          <Stat
            label="Reichweite im Sparmodus"
            value={`${formatNumber(ergebnis.monateImSparmodus, 1)} Monate`}
            tone="positive"
            hint="Wie lange die Obergrenze trägt, wenn alles Streichbare gestrichen ist."
          />
          <Stat
            label="Gegenüber der Faustregel"
            value={
              abweichung === 0
                ? 'gleich'
                : `${abweichung > 0 ? '+' : ''}${formatNumber(abweichung)} Monate`
            }
            tone={abweichung > 0 ? 'negative' : abweichung < 0 ? 'positive' : 'neutral'}
            hint={`Die verbreitete Regel nennt ${PAUSCHALE.min} bis ${PAUSCHALE.max} Monatsausgaben – für jeden dieselbe Zahl.`}
          />
        </StatGrid>

        <Callout variant="info" title="Warum an den Ausgaben und nicht am Gehalt">
          <p>
            „Drei Monatsgehälter“ rechnet die falsche Größe. Wer 4.000 € verdient und
            2.000 € ausgibt, braucht einen halb so großen Puffer wie jemand mit demselben
            Gehalt und 4.000 € Ausgaben. Die Frage lautet nicht, wie viel jemand verdient,
            sondern wie lange er ohne Einkommen zurechtkommt.
          </p>
        </Callout>

        <Callout variant="tip" title="Wo das Geld liegen sollte">
          <p>
            Auf einem Tagesgeldkonto, getrennt vom Girokonto, jederzeit verfügbar. Nicht
            im Depot: Der Notgroschen wird gebraucht, wenn es schlecht läuft – und das ist
            oft genau dann, wenn auch die Kurse unten stehen. Dann müsste man verkaufen,
            wenn man am wenigsten dafür bekommt.
          </p>
        </Callout>
      </ResultPanel>
    </CalculatorGrid>
  )
}
