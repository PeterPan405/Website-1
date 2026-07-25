/**
 * Platzhalter, solange ein Diagramm nachgeladen wird.
 *
 * Die Höhe entspricht der des fertigen Diagramms, damit beim Erscheinen kein
 * Layoutsprung entsteht (relevant für Cumulative Layout Shift).
 */
export function ChartSkeleton({ height = 340 }: { height?: number }) {
  return (
    <div
      style={{ height }}
      className="border-border bg-surface-muted w-full overflow-hidden rounded-xl border"
      role="status"
      aria-live="polite"
    >
      <div
        aria-hidden="true"
        className="animate-shimmer size-full"
        style={{
          backgroundImage:
            'linear-gradient(100deg, transparent 20%, var(--c-border) 50%, transparent 80%)',
          backgroundSize: '200% 100%',
        }}
      />
      <span className="sr-only">Diagramm wird geladen …</span>
    </div>
  )
}
