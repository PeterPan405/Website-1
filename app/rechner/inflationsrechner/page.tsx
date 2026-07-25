import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { InflationCalculator } from '@/components/calculators/InflationCalculator'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

const definition = getCalculatorDefinition('inflationsrechner')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function InflationsrechnerPage() {
  return (
    <CalculatorPage definition={definition}>
      <InflationCalculator />
    </CalculatorPage>
  )
}
