import type { ReactNode } from 'react'

/**
 * Hielt Inhalte unsichtbar, bis sie hereingescrollt wurden – und tut das
 * seit dem 26.10.2026 nicht mehr.
 *
 * Betreiber: Die Website solle „nicht mehr nach dem klassischen
 * 0815-Vibe-Coding aussehen". Das Einblenden beim Scrollen ist eines seiner
 * deutlichsten Erkennungszeichen – und hatte einen handfesten Nachteil:
 * Bis zum Scrollen standen ganze Abschnitte als leere Fläche da (im
 * Bildschirmfoto der ganzen Seite blieben die Rechner, die Lernstufen und
 * der Podcast leer). Eine Nachrichtenseite zeigt ihren Inhalt, statt ihn
 * aufzuführen.
 *
 * Die Hülle bleibt, damit die zwanzig Stellen, die sie benutzen, nicht alle
 * angefasst werden müssen; `delay` wird ignoriert.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return <div className={className}>{children}</div>
}
