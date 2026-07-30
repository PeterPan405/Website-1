import type { Metadata } from 'next'

import { CalculatorPage } from '@/components/calculators/CalculatorPage'
import { InflationCalculator } from '@/components/calculators/InflationCalculator'
import { Zinsstand } from '@/components/calculators/Zinsstand'
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
      {/*
        Der gemessene Wert neben der Rechenannahme. Die Voreinstellung des
        Rechners ist bewusst eine gerundete Annahme über lange Zeiträume; hier
        steht daneben, wo die Rate gerade tatsächlich liegt.
      */}
      <Zinsstand
        reihen={['inflation-de', 'inflation']}
        titel="Wo die Inflation gerade steht"
        einleitung="Der Rechner arbeitet mit einer Annahme, und das muss er auch: Die Rate eines einzelnen Monats über dreißig Jahre fortzuschreiben wäre die schlechteste aller Prognosen. Zur Einordnung die zuletzt gemessenen Werte."
      />
    </CalculatorPage>
  )
}
