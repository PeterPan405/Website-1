'use client'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import {
  istGemerkt,
  merkenUmschalten,
  useMerkliste,
} from '@/components/markets/merkliste-speicher'

/**
 * Der Knopf zum Merken eines Instruments.
 *
 * ## Warum er beim ersten Rendern „nicht gemerkt“ zeigt
 *
 * Weil die Seite statisch gebaut wird und der Server nicht wissen kann, was im
 * localStorage dieses Browsers steht. `useSyncExternalStore` liefert deshalb
 * beim Server-Rendering die leere Liste und beim ersten Rendern im Browser
 * dasselbe – erst danach den echten Stand. Ein anderer Weg führte zu einer
 * Hydratationswarnung und im schlimmsten Fall zu einem Knopf, der einen
 * falschen Zustand behauptet.
 *
 * Sichtbar ist das kaum: Der Wechsel passiert im selben Frame wie die
 * Hydratation. `aria-pressed` trägt den Zustand mit, damit er auch ohne die
 * Farbe erkennbar ist.
 */
export function Merkschalter({
  symbol,
  name,
  className,
}: {
  symbol: string
  /** Für die Beschriftung, die Screenreader vorlesen. */
  name: string
  className?: string
}) {
  const liste = useMerkliste()
  const gemerkt = istGemerkt(liste, symbol)

  return (
    <button
      type="button"
      onClick={() => merkenUmschalten(symbol)}
      aria-pressed={gemerkt}
      className={cn(
        'border-border inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition',
        gemerkt
          ? 'border-markets text-markets bg-surface-muted'
          : 'text-fg-muted hover:text-fg hover:bg-surface-muted',
        className
      )}
    >
      {/*
        Dasselbe Symbol in beiden Zuständen, gefüllt oder nur umrissen. Ein
        Wechsel des Symbols selbst – Kreuz gegen Haken – ließe den Knopf wie
        zwei verschiedene Knöpfe aussehen und den Zustand wie eine Aktion.
      */}
      <Icon name="bookmark" className="size-4" filled={gemerkt} aria-hidden="true" />
      {gemerkt ? 'Gemerkt' : 'Merken'}
      <span className="sr-only">
        {gemerkt ? `${name} von der Merkliste entfernen` : `${name} auf die Merkliste`}
      </span>
    </button>
  )
}
