import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { PensionCalculator } from '@/components/calculators/PensionCalculator'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

const definition = getCalculatorDefinition('rentenrechner')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function RentenrechnerPage() {
  return (
    <CalculatorPage definition={definition}>
      <PensionCalculator />
    </CalculatorPage>
  )
}
