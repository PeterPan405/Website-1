import Link from 'next/link'

import { Vergleichskurve } from '@/components/markets/Vergleichskurve'
import { Callout } from '@/components/ui/Callout'
import { cn } from '@/lib/cn'
import { formatDateShort, formatPercentSigned } from '@/lib/format'
import { zusammenfassung, type Indexvergleich } from '@/lib/indexvergleich'
import type { Kurspunkt } from '@/lib/normierung'

/**
 * Die Aktie gegen den Leitindex ihres Handelsplatzes.
 *
 * ## Warum drei Zeiträume und nicht einer
 *
 * Weil ein einzelner Zeitraum eine Auswahl ist, und zwar eine, die sich
 * beliebig hindrehen lässt. „Plus 180 Prozent in fünf Jahren, der Markt nur
 * plus 60“ klingt nach einem besseren Unternehmen; dass derselbe Titel im
 * letzten Jahr zwanzig Punkte hinter dem Index lag, steht dann nirgends.
 * Nebeneinander zeigen die drei Zahlen, was tatsächlich der Fall ist: Der
 * Abstand zum Index wechselt, und zwar häufiger, als die Fünfjahreszahl
 * vermuten lässt.
 *
 * ## Warum die Differenz in Prozentpunkten steht
 *
 * Weil sie sonst falsch gelesen wird. Zwischen „plus 100 Prozent“ und „plus 60
 * Prozent“ liegen 40 **Prozentpunkte**, nicht 40 Prozent – wer aus 100 und 60
 * einen Faktor bildet, kommt auf 25 Prozent Vorsprung und meint etwas anderes.
 * Die Einheit steht deshalb an jeder Zahl.
 */
export function Indexvergleichstafel({
  vergleich,
  name,
  ticker,
  reihen,
  className,
}: {
  vergleich: Indexvergleich
  name: string
  ticker: string
  reihen: { wert: readonly Kurspunkt[]; index: readonly Kurspunkt[] } | null
  className?: string
}) {
  const { index } = vergleich

  return (
    <section aria-labelledby="indexvergleich" className={cn(className)}>
      <h2 id="indexvergleich" className="text-fg text-2xl font-bold">
        Gegen den {index.name}
      </h2>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        {zusammenfassung(vergleich, name)} Verglichen wird mit dem{' '}
        <Link href={`/maerkte/${index.symbol}`} className="text-markets hover:underline">
          {index.name}
        </Link>{' '}
        – {index.grund}. Beide notieren in {index.waehrung}, der Abstand enthält also
        keine Wechselkursbewegung.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-sm">
          <caption className="sr-only">
            {name} und {index.name} über ein, drei und fünf Jahre
          </caption>
          <thead>
            <tr className="border-border border-b">
              <th scope="col" className="text-fg-subtle py-3 text-left font-medium">
                Zeitraum
              </th>
              <th scope="col" className="text-fg py-3 text-right font-semibold">
                {ticker}
              </th>
              <th scope="col" className="text-fg py-3 text-right font-semibold">
                {index.name}
              </th>
              <th scope="col" className="text-fg py-3 text-right font-semibold">
                Abstand
              </th>
            </tr>
          </thead>
          <tbody>
            {vergleich.zeitraeume.map((zeitraum) => {
              const vorn = zeitraum.differenz > 0
              return (
                <tr key={zeitraum.jahre} className="border-border border-b align-top">
                  <th scope="row" className="text-fg py-3 pr-4 text-left font-medium">
                    {zeitraum.label}
                    <span className="text-fg-subtle mt-0.5 block text-xs font-normal">
                      {formatDateShort(zeitraum.vonTag)} bis{' '}
                      {formatDateShort(zeitraum.bisTag)}
                    </span>
                  </th>
                  <td className="text-fg py-3 pl-4 text-right font-medium tabular-nums">
                    {formatPercentSigned(zeitraum.wertProzent)}
                  </td>
                  <td className="text-fg-muted py-3 pl-4 text-right tabular-nums">
                    {formatPercentSigned(zeitraum.indexProzent)}
                  </td>
                  <td
                    className={cn(
                      'py-3 pl-4 text-right font-semibold tabular-nums',
                      vorn ? 'text-success' : 'text-danger'
                    )}
                  >
                    {formatPercentSigned(zeitraum.differenz)}
                    <span className="text-fg-subtle block text-xs font-normal">
                      Prozentpunkte
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {reihen && (
        <Vergleichskurve
          links={reihen.wert}
          rechts={reihen.index}
          namelinks={name}
          namerechts={index.name}
        />
      )}

      {/*
        Der Vorbehalt gehört unter die Tabelle und nicht in eine Fußnote: Er
        ändert, was die Zahlen bedeuten, und nicht nur, wie genau sie sind.
      */}
      <Callout
        variant={index.art === 'performance' ? 'warning' : 'info'}
        title="Was dieser Vergleich nicht sagt"
        className="mt-8"
      >
        <ul className="space-y-2">
          <li>
            <strong>
              Der {index.name} ist der Index des Marktes, nicht der des Unternehmens.
            </strong>{' '}
            Ob {name} selbst darin enthalten ist, sagt dieser Vergleich nicht – ein
            deutscher Nebenwert steht im SDAX und wird hier trotzdem am DAX gemessen, weil
            das der Bezugspunkt seines Heimatmarktes ist.
          </li>
          {index.art === 'performance' ? (
            <li>
              <strong>Die Grundlagen sind nicht dieselben.</strong> Der {index.name} ist
              ein Performanceindex: Dividenden stecken in seinem Stand, so als würde jede
              Ausschüttung sofort wieder angelegt. Die Kursreihe einer Aktie enthält sie
              nicht. Über fünf Jahre macht das bei einem Titel mit drei Prozent
              Ausschüttung gut fünfzehn Prozentpunkte aus –{' '}
              <strong>{name} sieht hier also schlechter aus, als es war.</strong>
            </li>
          ) : (
            <li>
              <strong>Dividenden fehlen auf beiden Seiten.</strong> Der {index.name} ist
              ein Kursindex, die Aktienreihe eine Kursreihe. Der Vergleich steht damit auf
              derselben Grundlage – die Zahlen sind aber beide niedriger als die
              tatsächliche Wertentwicklung eines Anlegers, der Ausschüttungen bekommen
              hat.
            </li>
          )}
          <li>
            <strong>Drei Zeiträume sind drei Zeiträume.</strong> Wer den Anfangstag um
            zwei Monate verschiebt, bekommt andere Zahlen und manchmal ein anderes
            Vorzeichen. Ein Vorsprung in der Vergangenheit ist kein Hinweis auf den
            nächsten Zeitraum, und diese Tabelle ist kein Grund, etwas zu kaufen oder zu
            verkaufen.
          </li>
        </ul>
      </Callout>
    </section>
  )
}
