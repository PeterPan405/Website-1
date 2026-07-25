import { siteConfig } from '@/lib/site'

/**
 * Wortmarke mit dem IMI-Signet.
 *
 * Das Signet zeigt bewusst **nicht** den Schriftzug „IMI“ aus dem Volllogo:
 * Bei 32 Pixel Höhe wäre er ohnehin unleserlich, und direkt daneben steht der
 * ausgeschriebene Name. Das vollständige Logo inklusive Schriftzug liegt unter
 * `public/logo.svg` und wird für strukturierte Daten und Downloads verwendet.
 *
 * Das Signet ist dekorativ (aria-hidden); der Name steht als echter Text daneben
 * und bleibt damit für Suchmaschinen und Screenreader lesbar.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="flex items-center gap-2.5">
        <IMISignet className="size-9 shrink-0" />
        <span className="font-display text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </span>
      </span>
    </span>
  )
}

/**
 * Nur der Ring aus vier Puzzle-Figuren, ohne Schriftzug.
 *
 * Jede Figur besteht aus einem dick gezeichneten Bogen mit runden Enden (Körper),
 * einer Kreisnase am Bogenende und einem Kopfkreis. Die weißen Kreise darüber
 * bilden die Puzzle-Kerben, in die die Nase der Nachbarfigur greift.
 *
 * Die Kerben nutzen `--c-surface` statt eines festen Weiß, damit das Signet auch
 * im Dunkelmodus und auf farbigen Flächen sauber freigestellt wirkt.
 */
export function IMISignet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <g>
        <path
          d="M 49.09 49.09 A 72 72 0 0 1 121.05 31.15"
          fill="none"
          stroke="var(--c-logo-navy)"
          strokeWidth={42}
          strokeLinecap="round"
        />
        <circle cx="131.56" cy="35.29" r="10" fill="var(--c-logo-navy)" />
        <circle cx="49.09" cy="49.09" r="22" fill="var(--c-logo-navy)" />
      </g>
      <g>
        <path
          d="M 150.91 49.09 A 72 72 0 0 1 168.85 121.05"
          fill="none"
          stroke="var(--c-logo-grey)"
          strokeWidth={42}
          strokeLinecap="round"
        />
        <circle cx="164.71" cy="131.56" r="10" fill="var(--c-logo-grey)" />
        <circle cx="150.91" cy="49.09" r="22" fill="var(--c-logo-grey)" />
      </g>
      <g>
        <path
          d="M 150.91 150.91 A 72 72 0 0 1 78.95 168.85"
          fill="none"
          stroke="var(--c-logo-red)"
          strokeWidth={42}
          strokeLinecap="round"
        />
        <circle cx="68.44" cy="164.71" r="10" fill="var(--c-logo-red)" />
        <circle cx="150.91" cy="150.91" r="22" fill="var(--c-logo-red)" />
      </g>
      <g>
        <path
          d="M 49.09 150.91 A 72 72 0 0 1 31.15 78.95"
          fill="none"
          stroke="var(--c-logo-green)"
          strokeWidth={42}
          strokeLinecap="round"
        />
        <circle cx="35.29" cy="68.44" r="10" fill="var(--c-logo-green)" />
        <circle cx="49.09" cy="150.91" r="22" fill="var(--c-logo-green)" />
      </g>
      {/* Puzzle-Kerben */}
      <g fill="var(--c-surface)">
        <circle cx="38.94" cy="61.85" r="12" />
        <circle cx="138.15" cy="38.94" r="12" />
        <circle cx="161.06" cy="138.15" r="12" />
        <circle cx="61.85" cy="161.06" r="12" />
      </g>
    </svg>
  )
}
