import { Icon } from '@/components/ui/Icon'
import { formatDateShort } from '@/lib/format'
import type { Quartalsterminbefund } from '@/lib/quartalstermine'

/**
 * Das kleine Zeichen neben der Überschrift: Diese Aktie meldet bald.
 *
 * ## Warum es oben steht und nicht nur unten
 *
 * Weil es eine Warnung ist und keine Information. Der Abschnitt weiter unten
 * beantwortet die Frage „wann meldet die Firma?" – dafür muss man sie sich
 * gestellt haben. Dieses Zeichen beantwortet eine Frage, die sich der Leser
 * *nicht* gestellt hat, und genau deshalb gehört es dorthin, wo er ohnehin
 * hinschaut: neben den Kurs, oberhalb der Falzkante.
 *
 * Wer eine Aktie ansieht, deren Zahlen in zehn Tagen kommen, sieht einen Kurs,
 * der bis dahin wenig aussagt. Das ist der Fall, für den es dieses Zeichen
 * gibt.
 *
 * ## Warum zwei Wochen
 *
 * Nutzerwunsch vom 20. August 2026. Er trifft aber auch die Sache: Zwei Wochen
 * sind die Zeitspanne, in der ein Termin eine Kaufentscheidung noch beeinflusst
 * und in der das Unternehmen ihn üblicherweise selbst schon bekannt gegeben
 * hat.
 *
 * ## Warum der Tag danebensteht
 *
 * Ein Zeichen ohne Datum wäre eine Beunruhigung ohne Auskunft: „bald" könnte
 * morgen heißen oder in zwei Wochen, und für eine Order ist das der ganze
 * Unterschied. Die Kurzform reicht – die Langfassung samt Streuung steht im
 * Abschnitt weiter unten, und zweimal derselbe Absatz ist einer zu viel.
 */
export function Zahlenbald({ befund }: { befund: Quartalsterminbefund | null }) {
  if (!befund?.bald) return null

  return (
    <a
      href="#quartalstermin"
      /*
        Kein `title`-Attribut: Auf dem Telefon gibt es keinen Mauszeiger, und
        die Hälfte der Leser sieht es dort. Was erklärt werden muss, steht im
        sichtbaren Text oder im Abschnitt, auf den dieser Verweis springt.
      */
      className="border-brand/40 bg-brand/10 text-brand hover:bg-brand/15 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition"
    >
      <Icon name="calendar" className="size-3.5" aria-hidden="true" />
      <span>
        Zahlen erwartet am {formatDateShort(befund.erwartet)}
        <span className="sr-only"> – geschätzt, mehr dazu weiter unten</span>
      </span>
    </a>
  )
}
