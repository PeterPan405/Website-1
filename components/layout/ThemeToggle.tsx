'use client'

import { Icon } from '@/components/ui/Icon'
import { LEISTENFARBE, THEME_STORAGE_KEY } from '@/lib/theme'

/**
 * Umschalter für Hell-/Dunkelmodus.
 *
 * Die Komponente hält absichtlich keinen React-State: Der aktuelle Modus steht
 * im `data-theme`-Attribut des <html>-Elements, und beide Icons werden immer
 * gerendert – sichtbar wird jeweils nur eines per CSS. Damit gibt es weder
 * einen Hydration-Mismatch noch ein kurzes Aufblitzen des falschen Icons.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggleTheme() {
    const root = document.documentElement
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
    root.dataset.theme = next

    /*
      Die Browserleiste mitziehen.

      Auf dem Telefon färbt Safari die Leiste über der Seite nach diesem
      Attribut. Ohne diese Zeile bliebe sie hell, während die Seite dunkel wird
      – auf dem Handy der auffälligste Teil der ganzen Umschaltung.
    */
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.setAttribute('content', LEISTENFARBE[next]))

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
