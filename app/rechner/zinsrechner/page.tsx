import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { Zinsstand } from '@/components/calculators/Zinsstand'
import { CompoundInterestCalculator } from '@/components/calculators/CompoundInterestCalculator'
import { getCalculatorDefinition } from '@/data/calculators'
import { buildMetadata } from '@/lib/seo'

// Bei einem unbekannten Slug wäre das ein Programmierfehler, kein Nutzerfehler –
// daher hart fehlschlagen statt notFound().
const definition = getCalculatorDefinition('zinsrechner')!

export const metadata: Metadata = buildMetadata({
  title: definition.metaTitle,
  description: definition.metaDescription,
  path: `/rechner/${definition.slug}`,
})

export default function ZinsrechnerPage() {
  return (
    <CalculatorPage definition={definition}>
      <CompoundInterestCalculator />
      {/*
        Der Leitzins als Bezugspunkt. Er ist nicht die Rendite, mit der dieser
        Rechner rechnet – aber er ist die Größe, an der alle anderen Zinsen
        hängen, und ohne ihn steht jede eingestellte Prozentzahl im luftleeren
        Raum.
      */}
      <Zinsstand
        reihen={['leitzins', 'inflation']}
        titel="Wo die Zinsen gerade stehen"
        einleitung="Die eingestellte Rendite ist eine Annahme über die Zukunft. Diese beiden Zahlen sind Messungen der Gegenwart – der Zins, zu dem sich Banken bei der Zentralbank Geld leihen, und die Rate, um die Geld gerade an Kaufkraft verliert."
      />
    </CalculatorPage>
  )
}
