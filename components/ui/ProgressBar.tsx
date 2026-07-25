import { cn } from '@/lib/cn'

/**
 * Fortschrittsbalken für den Lernbereich.
 *
 * Nutzt `role="progressbar"` mit den aria-value*-Attributen, damit
 * Screenreader den Stand vorlesen können.
 */
export function ProgressBar({
  value,
  max = 100,
  label,
  barClassName = 'bg-learn',
  className,
  showValue = true,
}: {
  value: number
  max?: number
  /** Beschreibung des Fortschritts, z. B. „2 von 3 Stufen“. */
  label: string
  barClassName?: string
  className?: string
  showValue?: boolean
}) {
  const clamped = Math.max(0, Math.min(value, max))
  const percent = max === 0 ? 0 : Math.round((clamped / max) * 100)

  return (
    <div className={className}>
      {showValue && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          <span className="text-fg-muted text-xs font-medium">{label}</span>
          <span className="text-fg text-xs font-semibold tabular-nums">{percent} %</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="bg-surface-muted h-2 w-full overflow-hidden rounded-full"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-500 ease-out',
            barClassName
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
