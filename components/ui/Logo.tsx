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
          40 Pixel und nicht kleiner: Darunter verschwinden die Lücken zwischen
          den vier Figuren und der Ring wirkt wieder wie eine geschlossene Form.
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
 * Aufbau je Figur: ein Viertelbogen als Körper und ein Kopfkreis, der **mittig
 * über dem eigenen Körper** auf der Diagonale sitzt und in ihn hineinreicht.
 * Weil beide dieselbe Farbe haben und sich überlappen, verschmelzen sie zu einer
 * Form – Kopf und Körper gehören sichtbar zusammen, statt wie ein Knauf am
 * Bogenende zu wirken.
 *
 * Die Aufteilung folgt dem Original: Jede Figur füllt einen Quadranten, die
 * Verbindungen zwischen ihnen liegen bei 12, 3, 6 und 9 Uhr, die Köpfe auf den
 * Diagonalen dazwischen. Reihenfolge wie im Logo – oben links Navy, oben rechts
 * Grau, unten rechts Rot, unten links Grün.
 *
 * Die Maße hängen voneinander ab und sind auf Erkennbarkeit hin gewählt:
 * Der Körper ist 32 Einheiten dick und liegt zwischen Radius 44 und 76. Der Kopf
 * (r 19) sitzt auf Radius 80, reicht damit von 61 bis 99 – er überlappt den
 * Körper um 15 Einheiten und bleibt knapp innerhalb der Zeichenfläche, sonst
 * würde er abgeflacht. Die 14 Grad Lücke grenzt die Figuren voneinander ab.
 *
 * Die Puzzle-Verzahnung des Originals ist bewusst nicht nachgebaut: Bei den
 * Größen, in denen das Zeichen auf der Website erscheint, ergäbe sie kein
 * erkennbares Motiv, sondern nur Unruhe.
 */
export function IMISignet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <g fill="var(--c-logo-navy)">
        <path
          d="M 40.45 92.69 A 60 60 0 0 1 92.69 40.45"
          fill="none"
          stroke="var(--c-logo-navy)"
          strokeWidth={32}
          strokeLinecap="round"
        />
        <circle cx="43.43" cy="43.43" r="19" />
      </g>
      <g fill="var(--c-logo-grey)">
        <path
          d="M 107.31 40.45 A 60 60 0 0 1 159.55 92.69"
          fill="none"
          stroke="var(--c-logo-grey)"
          strokeWidth={32}
          strokeLinecap="round"
        />
        <circle cx="156.57" cy="43.43" r="19" />
      </g>
      <g fill="var(--c-logo-red)">
        <path
          d="M 159.55 107.31 A 60 60 0 0 1 107.31 159.55"
          fill="none"
          stroke="var(--c-logo-red)"
          strokeWidth={32}
          strokeLinecap="round"
        />
        <circle cx="156.57" cy="156.57" r="19" />
      </g>
      <g fill="var(--c-logo-green)">
        <path
          d="M 92.69 159.55 A 60 60 0 0 1 40.45 107.31"
          fill="none"
          stroke="var(--c-logo-green)"
          strokeWidth={32}
          strokeLinecap="round"
        />
        <circle cx="43.43" cy="156.57" r="19" />
      </g>
    </svg>
  )
}
