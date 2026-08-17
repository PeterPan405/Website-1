import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { KaufenOderMieten } from '@/components/calculators/KaufenOderMieten'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

// Bei einem unbekannten Slug wäre das ein Programmierfehler, kein Nutzerfehler –
// daher hart fehlschlagen statt notFound().
const definition = getCalculatorDefinition('kaufen-oder-mieten')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function KaufenOderMietenPage() {
  return (
    <CalculatorPage definition={definition}>
      <KaufenOderMieten />
    </CalculatorPage>
  )
}
