import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import {
  Sparplanverlauf,
  type Verlaufseintrag,
} from '@/components/calculators/Sparplanverlauf'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'
import { liveSymbols } from '@/lib/market-live'
import { marketDefinitions } from '@/data/markets'

const definition = getCalculatorDefinition('sparplanverlauf')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

/**
 * Was zur Auswahl steht.
 *
 * Nur Titel mit **abgerufener** Kursreihe. Ein Instrument mit erzeugten
 * Demo-Daten gehört hier nicht hin: Der ganze Zweck dieser Seite ist, dass der
 * Verlauf echt ist, und ein gewürfelter Verlauf ergäbe eine Prozentzahl, die
 * von einer gemessenen nicht zu unterscheiden wäre.
 *
 * Währungspaare fallen ebenfalls heraus – einen Sparplan auf einen Wechselkurs
 * gibt es nicht.
 *
 * Mitgegeben wird nur, was Suche und Anzeige brauchen. Der Katalog geht als
 * Prop in den Browser, und dort zählt jedes Kilobyte.
 */
const vorhanden = new Set(liveSymbols())

const katalog: Verlaufseintrag[] = marketDefinitions
  .filter((e) => e.kind !== 'fx' && vorhanden.has(e.symbol))
  .map((e) => ({
    symbol: e.symbol,
    name: e.name,
    ticker: e.ticker,
    einheit: e.unit,
    ...(e.branche ? { branche: e.branche } : {}),
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'de'))

export default function SparplanverlaufSeite() {
  return (
    <CalculatorPage definition={definition}>
      <Sparplanverlauf katalog={katalog} />
    </CalculatorPage>
  )
}
