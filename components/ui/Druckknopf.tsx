'use client'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Öffnet den Druckdialog des Browsers.
 *
 * ## Warum kein selbstgebautes PDF
 *
 * Weil jeder Druckdialog „Als PDF speichern“ anbietet und dabei genau das
 * ausgibt, was auf der Seite steht – mit den Zeichnungen, den Tabellen, den
 * Hinweiskästen. Ein handgesetztes PDF wäre ein zweiter Satz derselben Inhalte
 * und liefe auseinander, sobald jemand einen Absatz ändert.
 *
 * Die Vermögensübersicht baut ihr PDF trotzdem selbst, und das ist kein
 * Widerspruch: Sie ist ein **Formular** zum Ausfüllen und Abheften, und dafür
 * muss das Blatt genau so aussehen. Ein Lerntext ist Fließtext.
 *
 * ## Warum der Knopf selbst nicht mitgedruckt wird
 *
 * `data-drucken="aus"` blendet ihn im Ausdruck aus. Ein Knopf auf Papier ist
 * kein Knopf, sondern ein Kasten mit dem Wort „Drucken“ darin – und er stünde
 * ausgerechnet oben, wo der Text anfängt.
 */
export function Druckknopf({
  text = 'Drucken oder als PDF speichern',
  className,
}: {
  text?: string
  className?: string
}) {
  return (
    <button
      type="button"
      data-drucken="aus"
      onClick={() => window.print()}
      className={cn('fk-btn-ghost text-sm', className)}
    >
      <Icon name="download" className="size-4" aria-hidden="true" />
      {text}
    </button>
  )
}
