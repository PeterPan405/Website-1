import { siteConfig } from '@/lib/site'

/**
 * Wortmarke mit Kompass-Signet.
 *
 * Das Signet ist dekorativ (aria-hidden), der Name steht als echter Text
 * daneben – so bleibt die Marke für Suchmaschinen und Screenreader lesbar.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="flex items-center gap-2.5">
        <svg
          viewBox="0 0 32 32"
          className="size-8 shrink-0"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="16" cy="16" r="15" className="fill-brand" />
          <path
            d="M16 4.5 18.6 13.4 27.5 16 18.6 18.6 16 27.5 13.4 18.6 4.5 16 13.4 13.4Z"
            className="fill-brand-contrast"
            opacity="0.92"
          />
          <circle cx="16" cy="16" r="2.6" className="fill-brand" />
        </svg>
        <span className="font-display text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </span>
      </span>
    </span>
  )
}
