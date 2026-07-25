import type { Metadata } from 'next'

import { BudgetCalculator } from '@/components/calculators/BudgetCalculator'
import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

const definition = getCalculatorDefinition('haushaltsrechner')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function HaushaltsrechnerPage() {
  return (
    <CalculatorPage definition={definition}>
      <BudgetCalculator />
    </CalculatorPage>
  )
}
