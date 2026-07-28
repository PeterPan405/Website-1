import {
  BlockchainZahlung,
  BoerseVomKlickZurBuchung,
  EinsteigerReihenfolge,
  NotenbankTransmission,
} from '@/components/content/figures/ablaeufe'
import {
  AktieAnteil,
  AktieDividendenabschlag,
  AktieSpread,
} from '@/components/content/figures/aktie'
import {
  AnleiheKursUndZins,
  StaatsanleiheZinsschock,
} from '@/components/content/figures/anleihen'
import {
  DepotOrderkosten,
  DerivatHebel,
  EinlagensicherungGrenze,
  SparplanDurchschnittspreis,
  TagesgeldRealzins,
  WaehrungErgebnis,
} from '@/components/content/figures/geldanlage'
import { IndexLaendergewichtung } from '@/components/content/figures/index-laender'
import {
  BudgetSparquoteJahre,
  OptionVolatilitaet,
  RisikoKorrelation,
} from '@/components/content/figures/fortgeschritten'
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
import {
  AnleiheKonvexitaet,
  DerivatPfadabhaengigkeit,
  ImmobilieHebel,
  InflationSteuer,
  OptionSensitivitaeten,
  PortfolioEntnahme,
  RenteRentenbeginn,
  RisikoSequenz,
  RohstoffeGoldSteuer,
  StreuungTitelzahl,
  TimingTrefferquote,
  ZinseszinsSteuerstundung,
} from '@/components/content/figures/profi'
import { RenteLuecke } from '@/components/content/figures/rente'
import { RisikoErholung } from '@/components/content/figures/risiko'
import {
  RohstoffeKeinErtrag,
  RohstoffeRollkurve,
} from '@/components/content/figures/rohstoffe'
import {
  BudgetHebel,
  KostenEndkapital,
  PortfolioDrift,
  PsychologieVerhaltensluecke,
} from '@/components/content/figures/sparen'
import { TimingBesteWochen } from '@/components/content/figures/timing'
import {
  BitcoinAngebot,
  CrashesErholung,
  FondsSondervermoegen,
  ImmobilieNettorendite,
  SparerpauschbetragGrenze,
} from '@/components/content/figures/vermoegen'
import {
  ZinsFruehVsSpaet,
  ZinsGeradeVsKurve,
  ZinsKosten,
  ZinsVolatilitaetsbremse,
} from '@/components/content/figures/zins'
import type { FigureId } from '@/data/figures'
import type { ComponentType } from 'react'

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
  'tagesgeld-realzins': TagesgeldRealzins,
  'sparplan-durchschnittspreis': SparplanDurchschnittspreis,
  'waehrung-ergebnis': WaehrungErgebnis,
  'derivat-hebel': DerivatHebel,
  'einlagensicherung-grenze': EinlagensicherungGrenze,
  'depot-orderkosten': DepotOrderkosten,
  'kosten-endkapital': KostenEndkapital,
  'psychologie-verhaltensluecke': PsychologieVerhaltensluecke,
  'budget-hebel': BudgetHebel,
  'portfolio-drift': PortfolioDrift,
  'sparerpauschbetrag-grenze': SparerpauschbetragGrenze,
  'immobilie-nettorendite': ImmobilieNettorendite,
  'bitcoin-angebot': BitcoinAngebot,
  'crashes-erholung': CrashesErholung,
  'fonds-sondervermoegen': FondsSondervermoegen,
  'risiko-sequenz': RisikoSequenz,
  'option-delta': OptionSensitivitaeten,
  'anleihe-konvexitaet': AnleiheKonvexitaet,
  'zinseszins-steuerstundung': ZinseszinsSteuerstundung,
  'inflation-steuer': InflationSteuer,
  'immobilie-hebel': ImmobilieHebel,
  'derivat-pfadabhaengigkeit': DerivatPfadabhaengigkeit,
  'streuung-titelzahl': StreuungTitelzahl,
  'portfolio-entnahme': PortfolioEntnahme,
  'rohstoffe-gold-steuer': RohstoffeGoldSteuer,
  'rente-rentenbeginn': RenteRentenbeginn,
  'timing-trefferquote': TimingTrefferquote,
  'budget-sparquote-jahre': BudgetSparquoteJahre,
  'risiko-korrelation': RisikoKorrelation,
  'option-volatilitaet': OptionVolatilitaet,
}
