import { siteConfig } from '@/lib/site'

/**
 * Wortmarke mit dem Signet.
 *
 * Das Signet zeigt bewusst **nicht** den Schriftzug „IMI“ aus dem Volllogo:
 * Bei 40 Pixel Höhe wäre er unleserlich, und direkt daneben steht der
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
        {/*
          40 Pixel und nicht kleiner: Darunter fallen die Köpfe der vier Figuren
          zu Punkten zusammen und die Lücken zwischen ihnen schließen sich.
        */}
        <IMISignet className="size-10 shrink-0" />
        <span className="font-display text-lg font-semibold tracking-tight">
          {siteConfig.name}
        </span>
      </span>
    </span>
  )
}

/**
 * Vier Figuren im Ring – das Signet ohne Schriftzug.
 *
 * Aufbau je Figur: ein Kopfkreis und ein dicker Bogen als Körper, der im
 * Uhrzeigersinn bis zum Kopf der nächsten Figur läuft. Dadurch entsteht der
 * geschlossene Ring, ohne dass Puzzle-Kerben nötig wären – die waren in der
 * ersten Fassung der Grund, warum das Zeichen unleserlich war: als 2 Pixel
 * große weiße Punkte ergaben sie kein Motiv, sondern nur Unruhe.
 *
 * Die Maße sind auf Erkennbarkeit hin gewählt und hängen voneinander ab:
 * Der Kopf (r 20) ist deutlich größer als das Band dick ist (24), damit er
 * heraussticht statt mit ihm zu verschmelzen. Der Kopfmittelpunkt liegt auf
 * Radius 77, die Außenkante damit bei 97 – knapp innerhalb der Zeichenfläche,
 * sonst würden die Köpfe abgeflacht. Die 20 Grad Lücke zwischen den Körpern
 * (90 Grad Raster minus 70 Grad Bogen) grenzt die Figuren voneinander ab.
 */
export function IMISignet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <g fill="var(--c-logo-navy)">
        <path
          d="M 100 44 A 56 56 0 0 1 152.62 80.85"
          fill="none"
          stroke="var(--c-logo-navy)"
          strokeWidth={24}
          strokeLinecap="round"
        />
        <circle cx="100" cy="23" r="20" />
      </g>
      <g fill="var(--c-logo-grey)">
        <path
          d="M 156 100 A 56 56 0 0 1 119.15 152.62"
          fill="none"
          stroke="var(--c-logo-grey)"
          strokeWidth={24}
          strokeLinecap="round"
        />
        <circle cx="177" cy="100" r="20" />
      </g>
      <g fill="var(--c-logo-red)">
        <path
          d="M 100 156 A 56 56 0 0 1 47.38 119.15"
          fill="none"
          stroke="var(--c-logo-red)"
          strokeWidth={24}
          strokeLinecap="round"
        />
        <circle cx="100" cy="177" r="20" />
      </g>
      <g fill="var(--c-logo-green)">
        <path
          d="M 44 100 A 56 56 0 0 1 80.85 47.38"
          fill="none"
          stroke="var(--c-logo-green)"
          strokeWidth={24}
          strokeLinecap="round"
        />
        <circle cx="23" cy="100" r="20" />
      </g>
    </svg>
  )
}
