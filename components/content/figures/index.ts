import type { ComponentType } from 'react'

import {
  AktieAnteil,
  AktieDividendenabschlag,
  AktieSpread,
} from '@/components/content/figures/aktie'
import { InflationKaufkraft } from '@/components/content/figures/inflation'
import { IndexLaendergewichtung } from '@/components/content/figures/index-laender'
import {
  RohstoffeKeinErtrag,
  RohstoffeRollkurve,
} from '@/components/content/figures/rohstoffe'
import {
  ZinsFruehVsSpaet,
  ZinsGeradeVsKurve,
  ZinsKosten,
  ZinsVolatilitaetsbremse,
} from '@/components/content/figures/zins'
import type { FigureId } from '@/data/figures'

/**
 * Zuordnung von Kennung zu Zeichnung.
 *
 * Der Typ `Record<FigureId, …>` ist hier die eigentliche Absicherung: Wer in
 * `data/figures.ts` eine Kennung ergänzt, bekommt beim Bauen einen Fehler,
 * solange die Zeichnung fehlt. Eine Grafik, die zur Laufzeit still verschwindet,
 * kann es damit nicht geben.
 */
export const figureDrawings: Record<FigureId, ComponentType> = {
  'zins-gerade-vs-kurve': ZinsGeradeVsKurve,
  'zins-frueh-vs-spaet': ZinsFruehVsSpaet,
  'zins-kosten': ZinsKosten,
  'zins-volatilitaetsbremse': ZinsVolatilitaetsbremse,
  'aktie-anteil': AktieAnteil,
  'aktie-dividendenabschlag': AktieDividendenabschlag,
  'aktie-spread': AktieSpread,
  'rohstoffe-kein-ertrag': RohstoffeKeinErtrag,
  'rohstoffe-rollkurve': RohstoffeRollkurve,
  'msci-world-laender': IndexLaendergewichtung,
  'inflation-kaufkraft': InflationKaufkraft,
}
