import { formatDate, formatNumber, formatPercentSigned } from '@/lib/format'
import {
  spanneJahresrendite,
  vergleicheFenster,
  type Fenster,
  type Kurspunkt,
} from '@/lib/zeitfenster'

/**
 * Derselbe Wert in mehreren Zeitfenstern.
 *
 * ## Wozu das dasteht
 *
 * „Der DAX hat 9 Prozent im Jahr gebracht" klingt nach einer Eigenschaft des
 * DAX. Tatsächlich ist es vor allem eine Aussage über den **Startpunkt**: Wer
 * Anfang 2020 einstieg, sieht eine andere Zahl als wer Anfang 2022 einstieg,
 * und beide Zahlen sind richtig gerechnet.
 *
 * Diese Tafel zeigt für einen Wert dieselbe Rechnung in mehreren Fenstern
 * nebeneinander. Der Zweck ist nicht, ein Fenster zu küren, sondern den
 * **Abstand** zwischen ihnen sichtbar zu machen – er ist bei den meisten
 * Werten größer als der Unterschied zwischen zwei verschiedenen Anlagen.
 *
 * ## Warum die Eckdaten dastehen
 *
 * Weil das gewünschte Fenster nicht das gerechnete ist. „2020" heißt hier vom
 * ersten bis zum letzten Handelstag des Jahres, und das kann der 2. Januar bis
 * zum 30. Dezember sein. Die Spalte nennt deshalb die tatsächlichen Tage.
 */
export function Zeitfenstertafel({
  reihe,
  fenster,
  einheit,
}: {
  reihe: readonly Kurspunkt[]
  fenster: readonly Fenster[]
  /** Währungscode oder „Punkte“ – für die Start- und Endwerte. */
  einheit: string
}) {
  const vergleiche = vergleicheFenster(reihe, fenster)
  const mitDaten = vergleiche.filter((eintrag) => eintrag.befund !== null)
  const spanne = spanneJahresrendite(vergleiche)

  if (mitDaten.length === 0) {
    return (
      <p className="text-fg-muted text-sm leading-relaxed">
        Für diesen Wert liegen noch keine Kurse aus abgeschlossenen Zeitfenstern vor.
      </p>
    )
  }

  return (
    <div>
      {/*
        Die Kernaussage zuerst, die Tabelle danach.

        Wer nur die Tabelle sieht, liest sechs Zahlen. Wer den Satz darüber
        liest, weiß, wonach er in der Tabelle sucht.
      */}
      {spanne ? (
        <p className="text-fg-muted text-sm leading-relaxed">
          Je nach Startpunkt steht hier eine Jahresrendite zwischen{' '}
          <strong className="text-fg">{formatPercentSigned(spanne.von, 1)}</strong> und{' '}
          <strong className="text-fg">{formatPercentSigned(spanne.bis, 1)}</strong> – ein
          Abstand von {formatNumber(spanne.abstand, 1)} Prozentpunkten. Gerechnet ist jede
          dieser Zahlen richtig. Sie sagen nur etwas Verschiedenes aus: nämlich, wann
          jemand angefangen hat.
        </p>
      ) : (
        <p className="text-fg-muted text-sm leading-relaxed">
          Für einen Vergleich über mehrere Jahre reichen die Kurse dieses Werts noch
          nicht.
        </p>
      )}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-sm">
          <caption className="sr-only">
            Rendite desselben Werts in verschiedenen Zeitfenstern
          </caption>
          <thead>
            <tr className="text-fg-subtle border-border border-b text-left text-xs uppercase">
              <th scope="col" className="py-2 pr-4 font-semibold">
                Zeitraum
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold">
                Anfang
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold">
                Ende
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-semibold">
                Veränderung
              </th>
              <th scope="col" className="py-2 text-right font-semibold">
                Tiefster Rückgang
              </th>
            </tr>
          </thead>
          <tbody>
            {vergleiche.map(({ fenster: eines, befund }) => (
              <tr
                key={eines.label}
                className="border-border/60 border-b align-middle last:border-0"
              >
                <th scope="row" className="text-fg py-3 pr-4 text-left font-semibold">
                  {eines.label}
                  {befund ? (
                    <span className="text-fg-subtle block text-xs font-normal">
                      {formatDate(befund.von)} bis {formatDate(befund.bis)}
                    </span>
                  ) : null}
                </th>
                {befund ? (
                  <>
                    <td className="text-fg-muted py-3 pr-4 text-right tabular-nums">
                      {formatNumber(befund.startwert, 2)}
                    </td>
                    <td className="text-fg-muted py-3 pr-4 text-right tabular-nums">
                      {formatNumber(befund.endwert, 2)}
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold tabular-nums">
                      <span className={befund.rendite < 0 ? 'text-negative' : 'text-fg'}>
                        {formatPercentSigned(befund.rendite, 1)}
                      </span>
                      {/*
                        Die Jahresrendite steht klein darunter und nur, wenn das
                        Fenster lang genug ist. Ein Quartal hochzurechnen ergäbe
                        eine Zahl, die nie jemand verdient hat – siehe
                        `lib/zeitfenster.ts`.
                      */}
                      {befund.jahresrendite !== null &&
                      Math.abs(befund.jahresrendite - befund.rendite) > 0.05 ? (
                        <span className="text-fg-subtle block text-xs font-normal">
                          {formatPercentSigned(befund.jahresrendite, 1)} im Jahr
                        </span>
                      ) : null}
                    </td>
                    <td className="text-fg-muted py-3 text-right tabular-nums">
                      {befund.maxRueckgang === null ? (
                        <span
                          className="text-fg-subtle"
                          title="Für diesen Zeitraum liegen nur Wochenwerte vor – ein Rückgang daraus wäre systematisch zu klein."
                        >
                          zu grob
                        </span>
                      ) : (
                        formatPercentSigned(befund.maxRueckgang, 1)
                      )}
                    </td>
                  </>
                ) : (
                  <td
                    colSpan={4}
                    className="text-fg-subtle py-3 text-right text-sm italic"
                  >
                    Kurse reichen nicht so weit zurück
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-fg-muted mt-5 space-y-3 text-sm leading-relaxed">
        <p>
          Angaben in {einheit}. Die Zeitangabe unter jedem Zeitraum nennt den{' '}
          <strong className="text-fg">tatsächlichen</strong> ersten und letzten Handelstag
          – „2020“ beginnt nicht am 1. Januar, wenn da niemand gehandelt hat.
        </p>
        <p>
          Der tiefste Rückgang zählt ab einem Höchststand, der vorher schon dastand –
          nicht Hoch minus Tief. Ein Tief, das <em>vor</em> dem Hoch lag, hat niemand
          erlebt.
        </p>
        <p>
          <strong className="text-fg">„zu grob“</strong> heißt: Für diesen Zeitraum sind
          nur Wochenwerte gespeichert. Die Veränderung überlebt das, weil sie nur die
          beiden Enden braucht – der tiefste Rückgang nicht. Er sucht das Tief zwischen
          zwei Hochs, und bei Wochenwerten liegt jedes zweite Tief zwischen den Punkten.
          Eine Zahl daraus wäre nicht ungenau, sondern immer zu klein, und stünde neben
          den anderen, als wäre sie vergleichbar.
        </p>
      </div>
    </div>
  )
}
