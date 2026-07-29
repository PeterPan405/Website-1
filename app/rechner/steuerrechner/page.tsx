import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { TaxCalculator } from '@/components/calculators/TaxCalculator'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

const definition = getCalculatorDefinition('steuerrechner')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function SteuerrechnerPage() {
  return (
    <CalculatorPage definition={definition}>
      <TaxCalculator />
    </CalculatorPage>
  )
}
