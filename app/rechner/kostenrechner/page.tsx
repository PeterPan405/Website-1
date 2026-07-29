import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { CostCalculator } from '@/components/calculators/CostCalculator'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

const definition = getCalculatorDefinition('kostenrechner')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function KostenrechnerPage() {
  return (
    <CalculatorPage definition={definition}>
      <CostCalculator />
    </CalculatorPage>
  )
}
