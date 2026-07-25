import { Icon } from '@/components/ui/Icon'

/**
 * Sichtbarer Hinweis auf Beispieldaten.
 *
 * Steht auf jeder Seite, die Demo-Inhalte zeigt. Solche Hinweise gehören nicht
 * nur ins Impressum: Wer Kurse oder Nachrichten sieht, muss an dieser Stelle
 * erkennen können, dass es sich nicht um echte Daten handelt.
 */
export function DemoNotice({
  children,
  title = 'Beispieldaten',
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <aside className="rounded-card border-warning/30 bg-warning-soft border p-4 sm:p-5">
      <div className="flex gap-3">
        <Icon name="warning" className="text-warning mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-fg text-sm font-semibold">{title}</p>
          <div className="text-fg-muted mt-1.5 space-y-1.5 text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </aside>
  )
}
