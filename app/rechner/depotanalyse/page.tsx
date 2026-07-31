import type { Metadata } from 'next'

import { Depotanalyse, type Auswahleintrag } from '@/components/calculators/Depotanalyse'
import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { marketDefinitions } from '@/data/markets'
import { getCalculatorDefinition } from '@/data/calculators'
import { etfKosten } from '@/data/etf-kosten'
import { laendernamen } from '@/data/laender/namen'
import { buildMetadata } from '@/lib/seo'

const definition = getCalculatorDefinition('depotanalyse')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

/**
 * Was zur Auswahl steht.
 *
 * Nur, was man tatsächlich halten kann. Indizes und Währungspaare fallen
 * heraus: In einen Index legt man nicht an, sondern in einen Fonds darauf, und
 * ein Währungspaar ist ein Kurs und keine Position. Sie in die Liste zu nehmen
 * hieße, eine Aufteilung zu ermöglichen, die es so nicht gibt.
 *
 * Mitgegeben wird nur, was die Analyse braucht – nicht die vollen Stammdaten
 * mit Beschreibungstexten und Kursreihen. Der Katalog geht als Prop in den
 * Browser, und dort zählt jedes Kilobyte.
 */
const katalog: Auswahleintrag[] = marketDefinitions
  .filter(
    (e) =>
      e.kind === 'stock' ||
      e.kind === 'etf' ||
      e.kind === 'commodity' ||
      e.kind === 'crypto'
  )
  .map((e) => ({
    symbol: e.symbol,
    name: e.name,
    ticker: e.ticker,
    kind: e.kind,
    unit: e.unit,
    ...(e.branche ? { branche: e.branche } : {}),
    ...(e.sitzland ? { sitzland: e.sitzland } : {}),
    ...(e.sitzland && laendernamen[e.sitzland]
      ? { landName: laendernamen[e.sitzland] }
      : {}),
    ...(etfKosten[e.symbol]
      ? { kostenquote: etfKosten[e.symbol].laufendeKostenProzent }
      : {}),
  }))
  .sort((a, b) => a.name.localeCompare(b.name, 'de'))

export default function DepotanalysePage() {
  return (
    <CalculatorPage definition={definition}>
      <Depotanalyse katalog={katalog} />
    </CalculatorPage>
  )
}
