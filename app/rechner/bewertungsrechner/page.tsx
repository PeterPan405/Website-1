import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { EingepreistCalculator } from '@/components/calculators/EingepreistCalculator'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

const definition = getCalculatorDefinition('bewertungsrechner')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function BewertungsrechnerPage() {
  return (
    <CalculatorPage definition={definition}>
      <EingepreistCalculator />
    </CalculatorPage>
  )
}
