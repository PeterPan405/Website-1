'use client'

import { Icon } from '@/components/ui/Icon'
import { LEISTENFARBE, THEME_STORAGE_KEY, leisteFaerben } from '@/lib/theme'

/**
 * Umschalter zwischen Weiß und Schwarz.
 *
 * Weiß heißt der helle Modus seit dem 9. August 2026 auch im Wert
 * (`data-theme='weiss'`): Der Betreiber hat Weiß als Start festgelegt, eine
 * dritte Darstellung „Grau“ wurde am selben Tag gebaut und wieder verworfen.
 *
 * Seit dem 13. August 2026 gilt das ausnahmslos – auch auf einem dunkel
 * gestellten Gerät. Dieser Knopf ist damit der **einzige** Weg in den dunklen
 * Modus; die Rangfolge dahinter steht in `startSkript()` in `lib/theme.ts`.
 *
 * Die Komponente hält absichtlich keinen React-State: Der aktuelle Modus steht
 * im `data-theme`-Attribut des <html>-Elements, und beide Icons werden immer
 * gerendert – sichtbar wird jeweils nur eines per CSS. Damit gibt es weder
 * einen Hydration-Mismatch noch ein kurzes Aufblitzen des falschen Icons.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggleTheme() {
    const root = document.documentElement
    const next = root.dataset.theme === 'dark' ? 'weiss' : 'dark'
    root.dataset.theme = next

    /*
      Die Browserleiste mitziehen.

      Auf dem Telefon färbt Safari die Leiste über der Seite nach dieser
      Angabe. Ohne sie bliebe sie hell, während die Seite dunkel wird – auf
      dem Handy der auffälligste Teil der ganzen Umschaltung.

      Die Angabe wird **ersetzt**, nicht geändert: Safari übernimmt ein
      `setAttribute` auf einer bereits gelesenen `theme-color` nicht
      verlässlich. Begründung und Vorgeschichte stehen bei `leisteFaerben`.
    */
    leisteFaerben(LEISTENFARBE[next])

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Privater Modus oder blockierter Speicher: Der Wechsel gilt dann nur
      // für die aktuelle Sitzung.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`fk-btn-ghost size-10 rounded-full p-0 ${className ?? ''}`}
      title="Farbschema wechseln"
    >
      <Icon name="sun" className="size-5 dark:hidden" />
      <Icon name="moon" className="hidden size-5 dark:block" />
      <span className="sr-only">Zwischen hellem und dunklem Farbschema wechseln</span>
    </button>
  )
}
