import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { Entnahmeplan } from '@/components/calculators/Entnahmeplan'
import { Sequenztafel } from '@/components/calculators/Sequenztafel'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

// Bei einem unbekannten Slug wäre das ein Programmierfehler, kein Nutzerfehler –
// daher hart fehlschlagen statt notFound().
const definition = getCalculatorDefinition('entnahmeplan')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function EntnahmeplanPage() {
  return (
    <CalculatorPage definition={definition}>
      <Entnahmeplan />
      {/*
        Das Sequenzrisiko gehört hierher, mehr als an jede andere Stelle.

        Der Rechner darüber arbeitet mit einer festen Rendite je Jahr, und für
        jemanden, der aus dem Depot lebt, ist genau das die riskanteste
        Vereinfachung: Zwei schwache Jahre unmittelbar nach dem letzten
        Arbeitstag wirken anders als dieselben zwei Jahre am Ende. Die Tafel
        rechnet das an echten Jahresrenditen vor, statt es zu behaupten.
      */}
      <Sequenztafel className="mt-12" />
    </CalculatorPage>
  )
}
