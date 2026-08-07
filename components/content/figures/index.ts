import {
  GeldsystemDevisenmarkt,
  GeldsystemGiralgeld,
  GeldsystemLebensdauer,
} from '@/components/content/figures/geldsystem'
import {
  TaElliottZyklus,
  TaElliottExtension,
  TaElliottVerkuerzung,
  TaElliottDiagonale,
  TaElliottZigzag,
  TaElliottFlat,
  TaElliottDreieck,
  TaElliottKombination,
  TaElliottZiele,
  TaElliottWechsel,
  TaElliottGrade,
  TaElliottRuecklaeufe,
  TaElliottStreckungen,
  TaKerzeAufbau,
  TaMacd,
  TaSmaVsEma,
  TaTrendstruktur,
  TaUnterstuetzungWiderstand,
} from '@/components/content/figures/akademie'
import {
  AvWertfunktion,
  FaDreiAbschluesse,
  MaKonjunkturzyklus,
  MaZinsstruktur,
  PtDiversifikation,
  PtEffizienzlinie,
  PtKorrelation,
  PtMaximalerRueckgang,
  PtSequenzrisiko,
} from '@/components/content/figures/akademie-bereiche'
import {
  BlockchainZahlung,
  BoerseAbwicklung,
  BoerseVomKlickZurBuchung,
  EinlagensicherungKaskade,
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
  EtfIndexFassungen,
  OptionVolatilitaet,
  RisikoKorrelation,
  TagesgeldAktionszins,
} from '@/components/content/figures/fortgeschritten'
import {
  AnleiheRangfolge,
  BlockchainKette,
  BudgetHaushalt,
  DepotUndKonto,
  NotenbankZinskorridor,
  PortfolioQuoteRueckgang,
  StaatsanleiheLaufzeiten,
} from '@/components/content/figures/grundlagen'
import {
  EinsteigerPruefung,
  FondsBewertungsglaettung,
  InflationBasiseffekt,
  KryptoZugangswege,
  VerkaufGruende,
  WaehrungAbsicherung,
} from '@/components/content/figures/erweitert'
import { InflationKaufkraft } from '@/components/content/figures/inflation'
import {
  BoerseHandelszeiten,
  BranchenZyklus,
  DerivatMargin,
  EinlagensicherungAnspruch,
  SparerpauschbetragReihenfolge,
  SparplanWartezeit,
} from '@/components/content/figures/maerkte'
import {
  ImmobilieRestschuld,
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
import {
  AktieBarwert,
  KreditTilgenOderAnlegen,
  MarktEffizienzstufen,
  SparplanDynamisierung,
  StaatsschuldDynamik,
} from '@/components/content/figures/profi-zwei'
import {
  BrokerOrderflow,
  EtfSwap,
  KostenBestandsprovision,
  SparerVerlusttoepfe,
} from '@/components/content/figures/profi-drei'
import {
  BlockchainReihenfolge,
  CrashesAnsteckung,
  FondsBewertungsstufen,
  KostenEbenen,
  KryptoBewertung,
  NotenbankMessgroessen,
  PsychologieAsymmetrie,
  TagesgeldParkplaetze,
  WaehrungParitaeten,
} from '@/components/content/figures/profi-vier'
import { RenteFreibetrag, RenteLuecke } from '@/components/content/figures/rente'
import { RisikoErholung } from '@/components/content/figures/risiko'
import {
  RohstoffeKeinErtrag,
  RohstoffeRollkurve,
} from '@/components/content/figures/rohstoffe'
import {
  BudgetHebel,
  KostenEndkapital,
  KostenWahreQuote,
  PortfolioDrift,
  PsychologieVerhaltensluecke,
} from '@/components/content/figures/sparen'
import { TimingBesteWochen } from '@/components/content/figures/timing'
import {
  BitcoinAngebot,
  CrashesErholung,
  CrashesSpirale,
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
  'etf-index-fassungen': EtfIndexFassungen,
  'tagesgeld-aktionszins': TagesgeldAktionszins,
  'einlagensicherung-kaskade': EinlagensicherungKaskade,
  'boerse-abwicklung': BoerseAbwicklung,
  'budget-haushalt': BudgetHaushalt,
  'depot-und-konto': DepotUndKonto,
  'staatsanleihe-laufzeiten': StaatsanleiheLaufzeiten,
  'blockchain-kette': BlockchainKette,
  'notenbank-zinskorridor': NotenbankZinskorridor,
  'anleihe-rangfolge': AnleiheRangfolge,
  'portfolio-quote-rueckgang': PortfolioQuoteRueckgang,
  'immobilie-restschuld': ImmobilieRestschuld,
  'rente-freibetrag': RenteFreibetrag,
  'crashes-spirale': CrashesSpirale,
  'kosten-wahre-quote': KostenWahreQuote,
  'boerse-handelszeiten': BoerseHandelszeiten,
  'einlagensicherung-anspruch': EinlagensicherungAnspruch,
  'sparerpauschbetrag-reihenfolge': SparerpauschbetragReihenfolge,
  'derivat-margin': DerivatMargin,
  'sparplan-wartezeit': SparplanWartezeit,
  'branchen-zyklus': BranchenZyklus,
  'waehrung-absicherung': WaehrungAbsicherung,
  'inflation-basiseffekt': InflationBasiseffekt,
  'verkauf-gruende': VerkaufGruende,
  'krypto-zugangswege': KryptoZugangswege,
  'einsteiger-pruefung': EinsteigerPruefung,
  'fonds-bewertungsglaettung': FondsBewertungsglaettung,
  'aktie-barwert': AktieBarwert,
  'kredit-tilgen-oder-anlegen': KreditTilgenOderAnlegen,
  'staatsschuld-dynamik': StaatsschuldDynamik,
  'sparplan-dynamisierung': SparplanDynamisierung,
  'markt-effizienzstufen': MarktEffizienzstufen,
  'broker-orderflow': BrokerOrderflow,
  'etf-swap': EtfSwap,
  'kosten-bestandsprovision': KostenBestandsprovision,
  'sparer-verlusttoepfe': SparerVerlusttoepfe,
  'psychologie-asymmetrie': PsychologieAsymmetrie,
  'blockchain-reihenfolge': BlockchainReihenfolge,
  'fonds-bewertungsstufen': FondsBewertungsstufen,
  'crashes-ansteckung': CrashesAnsteckung,
  'notenbank-messgroessen': NotenbankMessgroessen,
  'tagesgeld-parkplaetze': TagesgeldParkplaetze,
  'waehrung-paritaeten': WaehrungParitaeten,
  'kosten-ebenen': KostenEbenen,
  'krypto-bewertung': KryptoBewertung,

  /* ---------------------------------------------------------- Akademie */
  'ta-kerze-aufbau': TaKerzeAufbau,
  'ta-trendstruktur': TaTrendstruktur,
  'ta-unterstuetzung-widerstand': TaUnterstuetzungWiderstand,
  'ta-sma-vs-ema': TaSmaVsEma,
  'ta-macd': TaMacd,
  'ta-elliott-zyklus': TaElliottZyklus,
  'ta-elliott-extension': TaElliottExtension,
  'ta-elliott-verkuerzung': TaElliottVerkuerzung,
  'ta-elliott-diagonale': TaElliottDiagonale,
  'ta-elliott-zigzag': TaElliottZigzag,
  'ta-elliott-flat': TaElliottFlat,
  'ta-elliott-dreieck': TaElliottDreieck,
  'ta-elliott-kombination': TaElliottKombination,
  'ta-elliott-ziele': TaElliottZiele,
  'ta-elliott-wechsel': TaElliottWechsel,
  'ta-elliott-grade': TaElliottGrade,
  'ta-elliott-ruecklaeufe': TaElliottRuecklaeufe,
  'ta-elliott-streckungen': TaElliottStreckungen,
  'pt-diversifikation': PtDiversifikation,
  'pt-effizienzlinie': PtEffizienzlinie,
  'pt-korrelation': PtKorrelation,
  'pt-maximaler-rueckgang': PtMaximalerRueckgang,
  'pt-sequenzrisiko': PtSequenzrisiko,
  'ma-zinsstruktur': MaZinsstruktur,
  'ma-konjunkturzyklus': MaKonjunkturzyklus,
  'av-wertfunktion': AvWertfunktion,
  'fa-drei-abschluesse': FaDreiAbschluesse,

  /* -------------------------------------------------------- Geldsystem */
  'geldsystem-giralgeld': GeldsystemGiralgeld,
  'geldsystem-lebensdauer': GeldsystemLebensdauer,
  'geldsystem-devisenmarkt': GeldsystemDevisenmarkt,
}
