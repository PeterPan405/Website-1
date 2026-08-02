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
import { useVorbelegung } from '@/components/calculators/vorbelegung'
import { getCalculatorDefinition } from '@/data/calculators'
import {
  WACHSTUM_MAX,
  WACHSTUM_MIN,
  gerechtfertigtesKgv,
  implizitesWachstum,
} from '@/lib/eingepreist'
import { leseZahl } from '@/lib/rechner-vorbelegung'
import { Callout } from '@/components/ui/Callout'
import { formatNumber, formatPercentSigned } from '@/lib/format'

/**
 * Der Bewertungsrechner – rückwärts, mit Absicht.
 *
 * Er beantwortet nicht „Was ist die Aktie wert?“ (das täuscht Präzision
 * vor), sondern „Welches Gewinnwachstum bezahlst du mit diesem KGV?“ –
 * die Frage, die man vor einem Kauf tatsächlich beantworten kann. Die
 * Rechnung steht geprüft in `lib/eingepreist.ts`; die Empfindlichkeits-
 * tafel unten zeigt, wie stark das Ergebnis an den beiden weichsten
 * Annahmen hängt – das gehört zur Antwort dazu, nicht ins Kleingedruckte.
 */

const voreinstellung = {
  kgv: 25,
  jahre: 10,
  abzinsungProzent: 8,
  endKgv: 15,
}

/** Die Achsen der Empfindlichkeitstafel. */
const ABZINSUNGEN = [6, 8, 10]
const END_KGVS = [10, 15, 20]

export function EingepreistCalculator() {
  const [kgv, setzeKgv] = useState(voreinstellung.kgv)
  const [jahre, setzeJahre] = useState(voreinstellung.jahre)
  const [abzinsungProzent, setzeAbzinsung] = useState(voreinstellung.abzinsungProzent)
  const [endKgv, setzeEndKgv] = useState(voreinstellung.endKgv)

  /* Vorbelegung von der Aktienseite: `#kgv=32.4`. */
  useVorbelegung((werte) => {
    setzeKgv(leseZahl(werte.kgv, voreinstellung.kgv, { min: 0.1, max: 1000 }))
    setzeJahre(
      leseZahl(werte.jahre, voreinstellung.jahre, { min: 3, max: 25, ganzzahl: true })
    )
    setzeAbzinsung(
      leseZahl(werte.abzinsung, voreinstellung.abzinsungProzent, { min: 2, max: 20 })
    )
    setzeEndKgv(leseZahl(werte.endkgv, voreinstellung.endKgv, { min: 5, max: 40 }))
  })

  const annahmen = { jahre, abzinsungProzent, endKgv }
  const wachstum = useMemo(
    () => implizitesWachstum(kgv, annahmen),
    [kgv, jahre, abzinsungProzent, endKgv]
  )
  const kgvOhneWachstum = useMemo(
    () => gerechtfertigtesKgv(0, annahmen),
    [jahre, abzinsungProzent, endKgv]
  )

  useErgebnisbericht({
    titel: 'Bewertungsrechner',
    pfad: '/rechner/bewertungsrechner',
    annahmen: [
      { bezeichnung: 'Kurs-Gewinn-Verhältnis heute', wert: formatNumber(kgv, 1) },
      { bezeichnung: 'Betrachtungszeitraum', wert: `${jahre} Jahre` },
      {
        bezeichnung: 'Abzinsung je Jahr',
        wert: `${formatNumber(abzinsungProzent, 1)} %`,
      },
      { bezeichnung: 'End-KGV', wert: formatNumber(endKgv, 1) },
    ],
    ergebnisse: [
      {
        bezeichnung: 'Eingepreistes Gewinnwachstum je Jahr',
        wert:
          wachstum === null
            ? 'außerhalb des Modells (−50 bis +60 % je Jahr)'
            : formatPercentSigned(wachstum),
      },
      {
        bezeichnung: 'KGV, das ganz ohne Wachstum gerechtfertigt wäre',
        wert: formatNumber(kgvOhneWachstum, 1),
      },
    ],
    grenzen: getCalculatorDefinition('bewertungsrechner')!.grenzen,
  })

  return (
    <CalculatorGrid>
      <InputPanel>
        <NumberField
          label="Kurs-Gewinn-Verhältnis heute"
          value={kgv}
          onChange={setzeKgv}
          min={0.1}
          max={1000}
          step={0.1}
          decimals={1}
          hint="Kurs geteilt durch Jahresgewinn je Aktie – steht auf jeder Aktienseite dieser Website. Bei Verlust gibt es kein KGV und keine Rechnung."
        />
        <NumberField
          label="Betrachtungszeitraum"
          value={jahre}
          onChange={setzeJahre}
          min={3}
          max={25}
          step={1}
          decimals={0}
          suffix="Jahre"
          hint="Wie lange das Wachstum durchgehalten werden müsste. Zehn Jahre sind der übliche Rahmen solcher Modelle."
        />
        <NumberField
          label="Abzinsung pro Jahr"
          value={abzinsungProzent}
          onChange={setzeAbzinsung}
          min={2}
          max={20}
          step={0.5}
          decimals={1}
          suffix="%"
          hint="Die Rendite, die du für das Risiko verlangst. Acht Prozent entsprechen grob der langfristigen Aktienmarktrendite."
        />
        <NumberField
          label="End-KGV"
          value={endKgv}
          onChange={setzeEndKgv}
          min={5}
          max={40}
          step={1}
          decimals={0}
          hint="Zu welchem Vielfachen der Gewinn am Ende noch bewertet wird – die Annahme, wie gewöhnlich das Unternehmen dann ist. 15 ist der historische Marktdurchschnitt."
        />
      </InputPanel>

      <ResultPanel>
        {wachstum === null ? (
          <Callout variant="warning" title="Außerhalb des Modells">
            Für dieses KGV liegt das nötige Wachstum außerhalb von {WACHSTUM_MIN} bis +
            {WACHSTUM_MAX} Prozent je Jahr. Ein Modell, das solche Raten braucht, erklärt
            nichts mehr – die ehrliche Antwort ist: Dieser Preis lässt sich mit
            Gewinnwachstum allein nicht begründen.
          </Callout>
        ) : (
          <>
            <HeadlineResult
              label="Eingepreistes Gewinnwachstum"
              value={`${formatPercentSigned(wachstum)} pro Jahr`}
              hint={`So stark müsste der Gewinn ${jahre} Jahre lang jedes Jahr wachsen, damit ein Käufer zum heutigen KGV von ${formatNumber(kgv, 1)} genau seine ${formatNumber(abzinsungProzent, 1)} Prozent Rendite bekommt.`}
            />
            <p className="text-fg-muted mt-4 text-sm leading-relaxed">
              Zum Vergleich: Ganz ohne Gewinnwachstum wäre bei denselben Annahmen ein KGV
              von {formatNumber(kgvOhneWachstum, 1)} gerechtfertigt. Alles darüber ist
              bezahltes Zukunftsvertrauen – die Frage an dich ist nicht, ob das
              Unternehmen gut ist, sondern ob es <em>so viel besser</em> ist.
            </p>
          </>
        )}

        {/* ------------------------------------------- Empfindlichkeitstafel */}
        <div className="mt-6">
          <h3 className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
            Wie stark das Ergebnis an den Annahmen hängt
          </h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[20rem] text-sm">
              <thead>
                <tr className="border-border text-fg-subtle border-b text-xs">
                  <th scope="col" className="py-1.5 pr-3 text-left font-medium">
                    Abzinsung ↓ / End-KGV →
                  </th>
                  {END_KGVS.map((spalte) => (
                    <th
                      key={spalte}
                      scope="col"
                      className="py-1.5 pr-3 text-right font-medium tabular-nums"
                    >
                      {spalte}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ABZINSUNGEN.map((zeile) => (
                  <tr key={zeile} className="border-border border-b">
                    <th
                      scope="row"
                      className="text-fg-muted py-1.5 pr-3 text-left font-medium tabular-nums"
                    >
                      {zeile} %
                    </th>
                    {END_KGVS.map((spalte) => {
                      const wert = implizitesWachstum(kgv, {
                        jahre,
                        abzinsungProzent: zeile,
                        endKgv: spalte,
                      })
                      return (
                        <td
                          key={spalte}
                          className="text-fg py-1.5 pr-3 text-right tabular-nums"
                        >
                          {wert === null ? '–' : formatPercentSigned(wert)}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-fg-subtle mt-2 text-xs leading-relaxed">
            Dasselbe KGV, neun Antworten: Das eingepreiste Wachstum je nach Abzinsung und
            End-KGV. Dass die Spanne so breit ist, ist keine Schwäche der Tafel, sondern
            die Wahrheit über solche Modelle – und der Grund, warum hier kein Kursziel
            steht.
          </p>
        </div>
      </ResultPanel>
    </CalculatorGrid>
  )
}
