import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { RetirementGapCalculator } from '@/components/calculators/RetirementGapCalculator'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

const definition = getCalculatorDefinition('rentenluecke')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function RentenlueckePage() {
  return (
    <CalculatorPage definition={definition}>
      <RetirementGapCalculator />
    </CalculatorPage>
  )
}
