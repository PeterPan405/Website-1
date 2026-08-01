'use client'

import { useMemo, useState } from 'react'

import { NumberField } from '@/components/calculators/NumberField'
import {
  CalculatorGrid,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { useVorbelegung } from '@/components/calculators/vorbelegung'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { modifizierteDuration, zinsschock, type Anleihe } from '@/lib/anleihen'
import { formatNumber, formatPercentSigned } from '@/lib/format'
import { leseZahl } from '@/lib/rechner-vorbelegung'

/**
 * Was eine Zinsänderung mit einem Anleihekurs macht.
 *
 * ## Warum das einen eigenen Rechner verdient
 *
 * Weil der Zusammenhang gegenläufig ist und deshalb regelmäßig für einen
 * Fehler gehalten wird: Der Zins steigt – eine gute Nachricht für Sparer –,
 * und der Anleihefonds im Depot verliert. Beides gehört zusammen, und wer nur
 * den zweiten Teil sieht, hält den Fonds für schlecht gemanagt.
 *
 * Erklären lässt sich das in zwei Sätzen. Begreifen lässt es sich am Regler:
 * Wer die Restlaufzeit von drei auf dreißig Jahre schiebt und zusieht, wie aus
 * zwei Prozent Kursverlust zwanzig werden, braucht die zwei Sätze danach nicht
 * mehr.
 *
 * ## Warum die Näherung danebensteht
 *
 * Die Duration sagt einen Kursverlust vorher, der Barwert einen anderen. Der
 * Unterschied heißt **Konvexität** und fällt immer zugunsten des Besitzers
 * aus: Bei steigenden Zinsen fällt der Kurs weniger als vorhergesagt, bei
 * fallenden steigt er stärker.
 *
 * Beide Zahlen nebeneinander sind der eigentliche Inhalt. Nur die Näherung zu
 * zeigen hieße, eine Faustregel als Ergebnis auszugeben; nur den exakten Wert
 * zu zeigen hieße, die Faustregel unerklärt zu lassen, die überall sonst
 * steht.
 */

const vorgaben = {
  kupon: 2,
  jahre: 10,
  marktzins: 2,
  aenderung: 1,
}

/** Die Laufzeiten der Vergleichstabelle – kurz, mittel, lang, sehr lang. */
const LAUFZEITEN = [2, 5, 10, 20, 30]

export function Anleihenrechner() {
  const [kupon, setzeKupon] = useState(vorgaben.kupon)
  const [jahre, setzeJahre] = useState(vorgaben.jahre)
  const [marktzins, setzeMarktzins] = useState(vorgaben.marktzins)
  const [aenderung, setzeAenderung] = useState(vorgaben.aenderung)

  /* Vorbelegung aus einem Lerntext: `#kupon=2&jahre=10&zins=2&aenderung=1`. */
  useVorbelegung((werte) => {
    setzeKupon(leseZahl(werte.kupon, vorgaben.kupon, { min: 0, max: 15 }))
    setzeJahre(leseZahl(werte.jahre, vorgaben.jahre, { min: 1, max: 30, ganzzahl: true }))
    setzeMarktzins(leseZahl(werte.zins, vorgaben.marktzins, { min: 0, max: 15 }))
    setzeAenderung(leseZahl(werte.aenderung, vorgaben.aenderung, { min: -5, max: 5 }))
  })

  const anleihe: Anleihe = useMemo(() => ({ kuponProzent: kupon, jahre }), [kupon, jahre])
  const schock = useMemo(
    () => zinsschock(anleihe, marktzins, aenderung),
    [anleihe, marktzins, aenderung]
  )
  const duration = modifizierteDuration(anleihe, marktzins)

  /*
    Dieselbe Rechnung für fünf Laufzeiten. Sie ist die eigentliche Auskunft:
    Nicht „Anleihen fallen bei steigenden Zinsen“, sondern „um wie viel hängt
    fast nur an der Restlaufzeit“.
  */
  const reihe = LAUFZEITEN.map((laufzeit) => {
    const einzeln: Anleihe = { kuponProzent: kupon, jahre: laufzeit }
    return {
      laufzeit,
      duration: modifizierteDuration(einzeln, marktzins),
      ...zinsschock(einzeln, marktzins, aenderung),
    }
  })

  function zuruecksetzen() {
    setzeKupon(vorgaben.kupon)
    setzeJahre(vorgaben.jahre)
    setzeMarktzins(vorgaben.marktzins)
    setzeAenderung(vorgaben.aenderung)
  }

  const steigt = aenderung > 0
  const konvexitaet = schock.tatsaechlichProzent - schock.genaehertProzent

  return (
    <CalculatorGrid>
      <InputPanel onReset={zuruecksetzen}>
        <NumberField
          label="Kupon"
          value={kupon}
          onChange={setzeKupon}
          min={0}
          max={15}
          step={0.1}
          suffix="%"
          hint="Der jährliche Zins auf den Nennwert. Er steht bei der Ausgabe fest und ändert sich nie wieder – das ist der Grund für alles Weitere."
        />
        <NumberField
          label="Restlaufzeit"
          value={jahre}
          onChange={setzeJahre}
          min={1}
          max={30}
          step={1}
          decimals={0}
          suffix="Jahre"
          hint="Bis zur Rückzahlung des Nennwerts."
        />
        <NumberField
          label="Marktzins heute"
          value={marktzins}
          onChange={setzeMarktzins}
          min={0}
          max={15}
          step={0.1}
          suffix="%"
          hint="Was eine neue Anleihe gleicher Laufzeit und Bonität heute bietet."
        />
        <NumberField
          label="Zinsänderung"
          value={aenderung}
          onChange={setzeAenderung}
          min={-5}
          max={5}
          step={0.25}
          suffix="Prozentpunkte"
          hint="Ein Plus bedeutet steigende Zinsen. Negative Werte sind erlaubt – der Kurs steigt dann."
        />
      </InputPanel>

      <ResultPanel>
        <HeadlineResult
          label={`Kurs nach ${steigt ? 'einem Anstieg' : 'einem Rückgang'} um ${formatNumber(Math.abs(aenderung), 2)} Prozentpunkte`}
          value={`${formatNumber(schock.nachher, 2)} %`}
          hint={`Vorher ${formatNumber(schock.vorher, 2)} Prozent des Nennwerts – das sind ${formatPercentSigned(schock.tatsaechlichProzent)} Kursänderung.`}
        />

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">
            Faustregel gegen exakte Rechnung
          </h3>
          <StatGrid className="mt-5">
            <Stat
              label="Modifizierte Duration"
              value={`${formatNumber(duration, 2)}`}
              hint="Um so viel Prozent fällt der Kurs rechnerisch je Prozentpunkt Zinsanstieg."
            />
            <Stat
              label="Näherung über die Duration"
              value={formatPercentSigned(schock.genaehertProzent)}
              hint="Duration mal Zinsänderung – die Zahl, die in den meisten Texten steht."
            />
            <Stat
              label="Tatsächlich"
              value={formatPercentSigned(schock.tatsaechlichProzent)}
              hint="Der Barwert aller Zahlungen zum neuen Zins."
            />
            <Stat
              label="Unterschied"
              value={formatPercentSigned(konvexitaet)}
              hint="Die Konvexität. Sie fällt immer zugunsten des Besitzers aus."
            />
          </StatGrid>
        </div>

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">
            Dieselbe Zinsänderung, fünf Laufzeiten
          </h3>
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">
            Kupon und Marktzins bleiben, nur die Restlaufzeit ändert sich. Der Ausschlag
            hängt fast ausschließlich daran.
          </p>
          <div className="relative mt-4 overflow-x-auto">
            <table className="w-full min-w-[26rem] text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th scope="col" className="text-fg-subtle py-2.5 text-left font-medium">
                    Restlaufzeit
                  </th>
                  <th
                    scope="col"
                    className="text-fg-subtle py-2.5 text-right font-medium"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="text-fg-subtle py-2.5 text-right font-medium"
                  >
                    Kurs danach
                  </th>
                  <th
                    scope="col"
                    className="text-fg-subtle py-2.5 text-right font-medium"
                  >
                    Änderung
                  </th>
                </tr>
              </thead>
              <tbody>
                {reihe.map((zeile) => (
                  <tr
                    key={zeile.laufzeit}
                    className={
                      zeile.laufzeit === jahre
                        ? 'border-border bg-surface-muted border-b'
                        : 'border-border border-b'
                    }
                  >
                    <th scope="row" className="text-fg py-2.5 text-left font-medium">
                      {zeile.laufzeit} Jahre
                    </th>
                    <td className="text-fg-muted py-2.5 text-right tabular-nums">
                      {formatNumber(zeile.duration, 2)}
                    </td>
                    <td className="text-fg-muted py-2.5 text-right tabular-nums">
                      {formatNumber(zeile.nachher, 2)} %
                    </td>
                    <td
                      className={
                        zeile.tatsaechlichProzent < 0
                          ? 'text-danger py-2.5 text-right font-semibold tabular-nums'
                          : 'text-success py-2.5 text-right font-semibold tabular-nums'
                      }
                    >
                      {formatPercentSigned(zeile.tatsaechlichProzent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Callout variant="warning" title="Was dieser Rechner nicht sagt">
          <ul className="space-y-2">
            <li>
              <strong>Jährliche Kupons, ganze Jahre, ein einziger Zinssatz.</strong> Die
              Schulbuchvariante. Eine echte Anleihe zahlt halbjährlich, hat Stückzinsen
              und wird gegen eine ganze Zinsstrukturkurve bewertet, nicht gegen eine Zahl.
              Die Mechanik stimmt, der Kurs einer konkreten Anleihe kommt hier nicht
              heraus.
            </li>
            <li>
              <strong>Kein Ausfallrisiko.</strong> Gerechnet wird, als würde der Schuldner
              mit Sicherheit zahlen. Bei einer Bundesanleihe ist das eine brauchbare
              Annahme, bei einer Unternehmensanleihe mit schwacher Bonität nicht – dort
              bewegt sich der Kurs auch dann, wenn der Marktzins stillsteht.
            </li>
            <li>
              <strong>Der Kursverlust ist keiner, wenn du hältst.</strong> Wer bis zur
              Rückzahlung wartet, bekommt den Nennwert und alle Kupons – unabhängig davon,
              was der Kurs zwischendurch gemacht hat. Der Verlust wird erst durch einen
              Verkauf zu einem. Bei einem Anleihefonds gilt das nicht in dieser Form: Er
              hält nichts bis zum Ende, sondern rollt laufend um.
            </li>
          </ul>
        </Callout>
      </ResultPanel>
    </CalculatorGrid>
  )
}
