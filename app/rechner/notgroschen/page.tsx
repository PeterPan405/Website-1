import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { Notgroschenrechner } from '@/components/calculators/Notgroschenrechner'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

// Bei einem unbekannten Slug wäre das ein Programmierfehler, kein Nutzerfehler –
// daher hart fehlschlagen statt notFound().
const definition = getCalculatorDefinition('notgroschen')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function NotgroschenPage() {
  return (
    <CalculatorPage definition={definition}>
      <Notgroschenrechner />
    </CalculatorPage>
  )
}
