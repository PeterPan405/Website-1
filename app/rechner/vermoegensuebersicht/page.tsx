import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { NetWorthSheet } from '@/components/calculators/NetWorthSheet'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

const definition = getCalculatorDefinition('vermoegensuebersicht')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function VermoegensuebersichtPage() {
  return (
    <CalculatorPage definition={definition}>
      <NetWorthSheet />
    </CalculatorPage>
  )
}
