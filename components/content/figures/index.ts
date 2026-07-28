import type { ComponentType } from 'react'

import {
  AktieAnteil,
  AktieDividendenabschlag,
  AktieSpread,
} from '@/components/content/figures/aktie'
import {
  BlockchainZahlung,
  BoerseVomKlickZurBuchung,
  EinsteigerReihenfolge,
  NotenbankTransmission,
} from '@/components/content/figures/ablaeufe'
import {
  AnleiheKursUndZins,
  StaatsanleiheZinsschock,
} from '@/components/content/figures/anleihen'
import { InflationKaufkraft } from '@/components/content/figures/inflation'
import {
  KreditAnfangstilgung,
  KreditTilgungsverlauf,
} from '@/components/content/figures/kredit'
import {
  OptionAuszahlung,
  OptionZeitwertverfall,
} from '@/components/content/figures/optionen'
import { MarktOrderbuch } from '@/components/content/figures/orderbuch'
import { RenteLuecke } from '@/components/content/figures/rente'
import { RisikoErholung } from '@/components/content/figures/risiko'
import { TimingBesteWochen } from '@/components/content/figures/timing'
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
  'anleihe-kurs-und-zins': AnleiheKursUndZins,
  'staatsanleihe-zinsschock': StaatsanleiheZinsschock,
  'option-auszahlung': OptionAuszahlung,
  'option-zeitwertverfall': OptionZeitwertverfall,
  'kredit-zins-und-tilgung': KreditTilgungsverlauf,
  'kredit-anfangstilgung': KreditAnfangstilgung,
  'risiko-erholung': RisikoErholung,
  'timing-beste-wochen': TimingBesteWochen,
  'rente-luecke': RenteLuecke,
  'boerse-vom-klick-zur-buchung': BoerseVomKlickZurBuchung,
  'blockchain-zahlung': BlockchainZahlung,
  'notenbank-transmission': NotenbankTransmission,
  'einsteiger-reihenfolge': EinsteigerReihenfolge,
  'markt-orderbuch': MarktOrderbuch,
}
