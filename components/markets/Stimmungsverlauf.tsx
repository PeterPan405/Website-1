import { farbeFuerStufe } from '@/components/markets/Tacho'
import { formatDateShort } from '@/lib/format'
import type { Stimmungsstand } from '@/lib/markets'
import { STUFEN_TEXT } from '@/lib/markets'

/**
 * Derselbe Index an früheren Stichtagen.
 *
 * ## Wozu das gut ist
 *
 * Ein Stimmungswert allein sagt wenig. Ob 71 viel ist, hängt daran, wo er
 * vorige Woche stand – dieselbe Zahl bedeutet nach einem Anstieg von 40 etwas
 * anderes als nach einem Rückgang von 90. Die Bewegung ist die Aussage, nicht
 * der Stand.
 *
 * ## Warum manche Zeilen keinen Wert haben
 *
 * Die Werte sind nicht archiviert, sondern werden neu gerechnet: dieselbe
 * Formel, dieselben Kursreihen, am Stichtag abgeschnitten. Das geht nur, wo die
 * Reihen damals schon täglich vorlagen. Das Tagesarchiv dieser Seite beginnt
 * mit dem ersten eigenen Abruf; davor gibt es Wochenwerte, und aus Wochenwerten
 * ließe sich zwar eine Zahl bilden, aber keine, die mit den übrigen
 * vergleichbar wäre.
 *
 * Solche Zeilen bleiben deshalb leer und sagen, warum. Sie füllen sich von
 * selbst, sobald das Archiv weit genug zurückreicht – dafür ist nichts zu tun.
 */
export function Stimmungsverlauf({ staende }: { staende: readonly Stimmungsstand[] }) {
  return (
    <ul className="divide-border divide-y">
      {staende.map((stand) => (
        <li
          key={stand.label}
          className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
        >
          <div className="min-w-0">
            <p className="text-fg-subtle text-xs">{stand.label}</p>
            {stand.stimmung ? (
              <p className="text-fg mt-0.5 font-semibold">
                {STUFEN_TEXT[stand.stimmung.stufe]}
              </p>
            ) : (
              <p className="text-fg-subtle mt-0.5 text-sm">
                Das Tagesarchiv reicht nicht so weit zurück
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="text-fg-subtle hidden text-xs sm:inline">
              {formatDateShort(stand.datum)}
            </span>
            {stand.stimmung ? (
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
                style={{
                  /* Der Ring in der Farbe der Stufe, die Füllung dezent: Die
                     Zahl soll lesbar bleiben, nicht auf farbigem Grund stehen. */
                  border: `2px solid ${farbeFuerStufe(stand.stimmung.stufe)}`,
                  color: 'var(--c-fg)',
                }}
              >
                {stand.stimmung.wert}
              </span>
            ) : (
              <span
                className="border-border text-fg-subtle inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-dashed text-sm"
                aria-hidden="true"
              >
                –
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
