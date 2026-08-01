import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { KreditCalculator } from '@/components/calculators/KreditCalculator'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

const definition = getCalculatorDefinition('kreditrechner')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function KreditrechnerPage() {
  return (
    <CalculatorPage definition={definition}>
      <KreditCalculator />
    </CalculatorPage>
  )
}
