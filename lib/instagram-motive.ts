/**
 * Bilder für die Instagram-Kacheln: ein Foto zum Thema und, wo es passt, ein
 * Kursverlauf.
 *
 * Auftrag des Betreibers vom 16.10.2026: „Insta-Beitrag ab heute mit etwas
 * mehr Bildern, also spannender gestalten" – für die Tagesnews und den
 * Tagesbeitrag, mit Fotos **und** Kursgrafiken.
 *
 * ## Woher die Fotos kommen
 *
 * Aus den eigenen Deckblättern (`lib/instagram/titelbilder/`) – Bilder, die
 * im Kanal schon veröffentlicht sind. Ausgeschnitten wird der Teil unter der
 * eingebrannten Überschrift (`scripts/instagram-motive.ts`), abgelegt in
 * `lib/instagram/motive/`. Eine neue Bildquelle hätte eine Lizenzfrage
 * aufgemacht; diese hier ist beantwortet. Weggelassen sind Bilder mit
 * Menschen, das Schloss und reine Himmel.
 *
 * **Keine Skylines** (Betreiber, 18.10.2026): „Die Bilder müssen immer auch
 * zum Thema passen. Ansonsten einfach kein Bild nehmen, bevor du eine
 * Skyline nimmst. Das ist langweilig." Gestrichen sind deshalb Frankfurt,
 * Banken (die Frankfurter Türme), Finanzviertel, Deutschland (Düsseldorf),
 * Europa (Barcelona) und New York.
 *
 * **Jede Kachel bekommt ein Bild** (Betreiber, 20.10.2026: „bitte auf jede
 * Seite ein Bild" – „neue Regel: es findet sich immer etwas"). Findet die
 * Kachel kein Motiv zu ihrem Thema, nimmt sie eins aus `RUECKFALL`: Geld,
 * Börse, Tresor, Einkaufswagen – Bilder, die zu jeder Wirtschaftsmeldung
 * passen, ohne einen Ort oder eine Person zu behaupten. Keine Skyline bleibt
 * keine Skyline.
 *
 * ## Wie ein Foto zu einer Kachel findet
 *
 * Über den Inhalt der Kachel, nicht über ihre Stelle: Am 14.10.2026 lagen
 * Kacheln und Meldungen der Ausgabe gegeneinander verschoben – „Brent über
 * 107 $" stand neben der Meldung zum EZB-Tag. Geprüft wird zuerst die
 * Überschrift, dann der Text, jeweils in der Reihenfolge von `MOTIVE`. Kein
 * Motiv zweimal in einem Beitrag; wer keins findet, bekommt keins.
 *
 * ## Wann ein Kursverlauf dazukommt
 *
 * Nur, wenn die Überschrift der Kachel einen Wert nennt, den es hier als
 * Kurs gibt: ein Unternehmen beim Namen („Commerzbank"), einen Index, einen Rohstoff. Eine
 * Grafik zu einer Meldung, die keinen Kurs nennt – S&P 500 neben der
 * US-Inflation –, sähe aus wie ein Zusammenhang, den die Meldung nicht
 * behauptet.
 */
import { marketDefinitions } from '@/data/markets'

export interface Motiv {
  id: string
  /** Das Deckblatt, aus dem es geschnitten ist – oder `herkunft` bei einem Bild von außen. */
  quelle?: string
  /**
   * Ein Bild von außen (seit 18.10.2026): nur gemeinfrei, mit Fundstelle.
   * Geholt über `.github/workflows/bilder-holen.yml` (Wikimedia Commons).
   * CC0 ist ein Verzicht auf alle Rechte und steht gemeinfrei gleich.
   */
  herkunft?: {
    titel: string
    seite: string
    lizenz: 'Public domain' | 'CC0'
    urheber: string
  }
  muster: RegExp
  /**
   * Auch, wenn das Stichwort nur im Text steht. Allgemeine Motive (New York,
   * Europa, Deutschland) nur bei der Überschrift: „Ukraine: Neuer Angriff"
   * bekam sonst die Skyline von Manhattan, weil im Text „US-" stand.
   */
  auchImText: boolean
}

/**
 * Ein Muster aus ganzen Wörtern; `*` am Ende heißt „mit beliebiger
 * Endung". Die Wortgrenze ist die von Unicode – `\b` kennt nur ASCII und
 * findet vor „Öl" keine Grenze.
 */
export function woerter(...liste: string[]): RegExp {
  const teile = liste.map((w) =>
    w.endsWith('*')
      ? `${w.slice(0, -1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\p{L}\\p{N}-]*`
      : w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  )
  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${teile.join('|')})(?![\\p{L}\\p{N}])`, 'u')
}

/*
  Die Reihenfolge ist die Vorfahrt: Das Speziellere steht vorn. „US-Banken"
  soll die Wall Street bekommen, nicht das Frankfurter Bankenviertel;
  „Lufthansa gewinnt TAP" das Flugzeug, nicht die Übernahme.
*/
export const MOTIVE: Motiv[] = [
  {
    id: 'oel',
    quelle: '2026-10-05.jpg',
    muster: woerter(
      'Öl*',
      'Brent',
      'WTI',
      'Opec',
      'Rohöl*',
      'Raffinerie*',
      'Erdgas*',
      'Gaspreis*'
    ),
    auchImText: true,
  },
  {
    id: 'ezb',
    quelle: '2026-10-08.jpg',
    muster: woerter('EZB', 'Lagarde', 'Euroraum*', 'Eurozone'),
    auchImText: true,
  },
  {
    id: 'fed',
    quelle: '2026-09-16.jpg',
    muster: woerter(
      'Fed',
      'US-Notenbank',
      'Powell',
      'Warsh',
      'FOMC',
      'US-Inflation',
      'US-Erzeugerpreise',
      'US-Verbraucherpreise',
      'US-Zins*',
      'US-Arbeitsmarkt*',
      'Zinswoche'
    ),
    auchImText: true,
  },
  {
    id: 'wall-street',
    quelle: '2026-09-18.jpg',
    muster: woerter(
      'Wall Street',
      'Dow',
      'S&P',
      'Nasdaq',
      'US-Börse*',
      'US-Bank*',
      'US-Großbank*',
      'US-Aktie*'
    ),
    auchImText: true,
  },
  /*
    Personen und Orte der US-Politik (18.10.2026). Der Betreiber zu „Trump
    hebt Sanktionen auf": „ein Bild von Trump hätte sein können." Aus den
    Deckblättern waren Menschen bewusst weggelassen; diese drei sind Werke
    der US-Regierung und damit gemeinfrei. Nur aus der Überschrift – eine
    Meldung, die Trump im Text nennt, handelt nicht von ihm.
  */
  {
    id: 'trump',
    herkunft: {
      titel: 'January 2025 Official Presidential Portrait of Donald J. Trump',
      seite:
        'https://commons.wikimedia.org/wiki/File:January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg',
      lizenz: 'Public domain',
      urheber: 'Daniel Torok, Weißes Haus',
    },
    muster: woerter('Trump', 'Trumps'),
    auchImText: false,
  },
  {
    id: 'kapitol',
    herkunft: {
      titel: 'United States Capitol - west front',
      seite:
        'https://commons.wikimedia.org/wiki/File:United_States_Capitol_-_west_front.jpg',
      lizenz: 'Public domain',
      urheber: 'Architect of the Capitol',
    },
    muster: woerter(
      'Kongress',
      'US-Kongress',
      'Senat',
      'US-Senat',
      'Repräsentantenhaus',
      'Shutdown',
      'US-Haushalt*',
      'US-Defizit',
      'Schuldenobergrenze',
      'Midterms',
      'US-Wahl*'
    ),
    auchImText: false,
  },
  {
    id: 'weisses-haus',
    herkunft: {
      titel: 'North Façade White House',
      seite: 'https://commons.wikimedia.org/wiki/File:North_Fa%C3%A7ade_White_House.JPG',
      lizenz: 'Public domain',
      urheber: 'Nishkid64 (gemeinfrei erklärt)',
    },
    muster: woerter(
      'Weißes Haus',
      'Weißen Haus*',
      'US-Regierung',
      'US-Präsident*',
      'Washington'
    ),
    auchImText: false,
  },
  /*
    Seit 20.10.2026 („es findet sich immer etwas"): weitere Motive von
    Wikimedia Commons, gemeinfrei oder CC0, geholt mit bilder-holen.yml.
  */
  {
    id: 'frankreich',
    herkunft: {
      titel: 'Palais Bourbon, Paris 7e, NW View 140402 1',
      seite:
        'https://commons.wikimedia.org/wiki/File:Palais_Bourbon,_Paris_7e,_NW_View_140402_1.jpg',
      lizenz: 'Public domain',
      urheber: 'DXR',
    },
    muster: woerter(
      'Frankreich',
      'Frankreichs',
      'Paris',
      'Macron',
      'französisch*',
      'Le Pen'
    ),
    auchImText: false,
  },
  {
    id: 'bank-of-england',
    herkunft: {
      titel: 'The Royal Exchange and Bank of England LL',
      seite:
        'https://commons.wikimedia.org/wiki/File:The_Royal_Exchange_and_Bank_of_England_LL.jpg',
      lizenz: 'Public domain',
      urheber: 'unbekannt (historische Postkarte)',
    },
    muster: woerter(
      'BoE',
      'Bank of England',
      'Bailey',
      'Pfund',
      'Großbritannien*',
      'britisch*',
      'London*'
    ),
    auchImText: true,
  },
  {
    id: 'gericht',
    herkunft: {
      titel: 'Courtroom One Gavel - Flickr - Joe Gratz',
      seite:
        'https://commons.wikimedia.org/wiki/File:Courtroom_One_Gavel_-_Flickr_-_Joe_Gratz.jpg',
      lizenz: 'CC0',
      urheber: 'Joe Gratz',
    },
    muster: woerter(
      'Gericht*',
      'Klage*',
      'verklagt',
      'Urteil*',
      'Richter*',
      'Anklage*',
      'Kartell*',
      'Prozess'
    ),
    auchImText: true,
  },
  {
    id: 'luftfahrt',
    quelle: '2026-08-31.jpg',
    muster: woerter('Lufthansa', 'Airbus', 'Boeing', 'Airline*', 'Flug*', 'TAP'),
    auchImText: true,
  },
  {
    id: 'bahn',
    quelle: '2026-08-28.jpg',
    muster: woerter('Bahn', 'Zug', 'Züge', 'Schiene*'),
    auchImText: true,
  },
  {
    id: 'tech',
    quelle: '2026-09-30.jpg',
    muster: woerter(
      'KI',
      'KI-*',
      'Chip*',
      'Nvidia',
      'Halbleiter*',
      'Tech*',
      'Software',
      'CoreWeave',
      'Rechenzentr*'
    ),
    auchImText: true,
  },
  {
    id: 'smartphone',
    herkunft: {
      titel: 'Man with smartphone and laptop (Unsplash)',
      seite:
        'https://commons.wikimedia.org/wiki/File:Man_with_smartphone_and_laptop_(Unsplash).jpg',
      lizenz: 'CC0',
      urheber: 'Alejandro Escamilla',
    },
    muster: woerter(
      'Smartphone*',
      'iPhone*',
      'Handy*',
      'App',
      'Apps',
      'Apple',
      'Meta',
      'Facebook',
      'WhatsApp',
      'Instagram',
      'Google',
      'Alphabet',
      'Microsoft',
      'Amazon',
      'Gerät*',
      'Online*',
      'Internet*',
      'Telekom',
      'SpaceX',
      'Satellit*',
      'Mobilfunk*'
    ),
    auchImText: true,
  },
  {
    id: 'hafen',
    quelle: '2026-09-24.jpg',
    muster: woerter(
      'China',
      'Chinas',
      'Export*',
      'Import*',
      'Zoll',
      'Zölle*',
      'Handelsüberschuss*',
      'Handelsbilanz*',
      'Lieferkette*'
    ),
    auchImText: true,
  },
  {
    id: 'industrie',
    quelle: '2026-09-28.jpg',
    muster: woerter(
      'Industrie*',
      'Auftr*',
      'Produktion',
      'Fabrik*',
      'Autobauer*',
      'Autoindustrie',
      'Autoaktie*',
      'Autowerte',
      'Auto',
      'Autos',
      'Elektroauto*',
      'Tesla',
      'Volkswagen',
      'Verbrenner*',
      'VW',
      'BMW',
      'Mercedes'
    ),
    auchImText: true,
  },
  {
    id: 'wohnen',
    quelle: '2026-09-11.jpg',
    muster: woerter('Immobilie*', 'Wohn*', 'Miete*'),
    auchImText: true,
  },
  /* Die allgemeinen Motive – sie sind zugleich der Rückfall (`RUECKFALL`). */
  {
    id: 'euro',
    herkunft: {
      titel: 'Euro coins and banknotes (cropped)',
      seite:
        'https://commons.wikimedia.org/wiki/File:Euro_coins_and_banknotes_(cropped).jpg',
      lizenz: 'Public domain',
      urheber: 'Avij',
    },
    muster: woerter(
      'Euro',
      'Inflation*',
      'Teuerung*',
      'Verbraucherpreis*',
      'Bundesbank',
      'Lohn',
      'Löhne*',
      'Gehalt',
      'Gehälter*',
      'Tarif*',
      'Rente*',
      'Steuer*',
      'Sparer*',
      'Geld*',
      'Schulden*',
      'Haushalt*'
    ),
    auchImText: true,
  },
  {
    id: 'konsum',
    herkunft: {
      titel: 'Shopping Cart Supermarket',
      seite: 'https://commons.wikimedia.org/wiki/File:Shopping_Cart_Supermarket.jpg',
      lizenz: 'CC0',
      urheber: 'safaritravelplus',
    },
    muster: woerter(
      'Einzelhandel*',
      'Konsum*',
      'Verbraucher*',
      'Supermarkt*',
      'Kaufkraft',
      'Lebensmittel*',
      'Händler*',
      'Umsatz*',
      'Weihnachtsgeschäft'
    ),
    auchImText: true,
  },
  {
    id: 'tresor',
    herkunft: {
      titel: 'Porta caveau banca - Bank vault door - 1967',
      seite:
        'https://commons.wikimedia.org/wiki/File:Porta_caveau_banca_-_Bank_vault_door_-_1967.png',
      lizenz: 'Public domain',
      urheber: 'Aldo Moisio',
    },
    muster: woerter(
      'Bank',
      'Banken',
      'Bankaktie*',
      'Großbank*',
      'Sparkasse*',
      'Volksbank*',
      'Hedgefonds',
      'Fonds',
      'Kredit*',
      'Geldhaus',
      'Finanzaufsicht',
      'Bafin',
      'Gold',
      'Goldpreis*'
    ),
    auchImText: true,
  },
  {
    id: 'boerse',
    herkunft: {
      titel:
        'New York Stock Exchange trading floor on Wall Street, New York, New York LCCN2011634218',
      seite:
        'https://commons.wikimedia.org/wiki/File:New_York_Stock_Exchange_trading_floor_on_Wall_Street,_New_York,_New_York_LCCN2011634218.tif',
      lizenz: 'Public domain',
      urheber: 'Carol M. Highsmith, Library of Congress',
    },
    muster: woerter(
      'Börse*',
      'Aktie*',
      'Anleger*',
      'Index',
      'Indizes',
      'Rally',
      'Kursrutsch',
      'Rekordhoch',
      'Quartalszahl*',
      'Dividende*',
      'Börsengang*',
      'IPO'
    ),
    auchImText: true,
  },
]

/**
 * Der Rückfall, wenn eine Kachel zu ihrem Thema nichts findet – in dieser
 * Reihenfolge, das erste, das im Beitrag noch frei ist. Sind alle vergeben,
 * kommt das erste ein zweites Mal: Ein Bild doppelt ist besser als eine
 * Seite ohne (Betreiber, 20.10.2026).
 */
export const RUECKFALL = ['boerse', 'euro', 'tresor', 'konsum']

/* --------------------------------------------------------------- Kurse */

/**
 * Wörter, unter denen ein Wert in einer Meldung auftaucht, ohne seinen
 * vollen Namen. Nur für Werte, deren Name in der Liste unten nicht von
 * selbst passt.
 */
const BEINAMEN: [RegExp, string][] = [
  [woerter('Öl', 'Ölpreis*', 'Brent', 'Rohöl*'), 'brent'],
  [woerter('Gold', 'Goldpreis*'), 'gold'],
  [woerter('Silber', 'Silberpreis*'), 'silber'],
  [woerter('Dax', 'DAX'), 'dax'],
  [woerter('Nasdaq'), 'nasdaq-100'],
  [woerter('S&P', 'S&P 500'), 'sp500'],
  [woerter('Dow', 'Dow Jones'), 'dow-jones'],
  [woerter('Bitcoin'), 'bitcoin'],
  [woerter('Berkshire', 'Buffett'), 'berkshire'],
]

const SYMBOLE = new Set(marketDefinitions.map((m) => m.symbol))

/*
  Unternehmen beim Namen: „Commerzbank", „UniCredit", „UBS". Abgeschnitten
  wird, was im Text nie steht – Rechtsform, Klammerzusatz. Ein Name, der
  zugleich ein Beiname ist, gehört dem Beinamen: „Dow" ist in einer
  Meldung der Index, nicht die Chemiefirma Dow Inc.
*/
const NAMEN: [RegExp, string][] = marketDefinitions
  .filter((m) => m.kind === 'stock')
  .map((m) => [
    m.name
      .replace(/\s*\(.*\)$/, '')
      .replace(
        /\s+(AG|SE|Inc\.?|Corp\.?|Corporation|plc|N\.V\.|S\.A\.|Holding|Group)$/i,
        ''
      )
      .trim(),
    m.symbol,
  ])
  .filter(([name]) => name.length >= 3 && !BEINAMEN.some(([muster]) => muster.test(name)))
  .map(([name, symbol]) => [woerter(name), symbol])

/**
 * Der Kurs, den eine Kachel in der **Überschrift** nennt – oder keiner.
 *
 * Nur die Überschrift: Steht ein Unternehmen bloß im Text, ist es meist ein
 * Beispiel („… darunter Morgan Stanley"), und eine Grafik dazu gäbe ihm ein
 * Gewicht, das die Meldung ihm nicht gibt. Bei mehreren gewinnt, was zuerst
 * steht; bei gleicher Stelle der Beiname.
 */
export function kursZurKachel(titel: string): string | null {
  let bester: { stelle: number; symbol: string } | null = null
  for (const [muster, symbol] of [...BEINAMEN, ...NAMEN]) {
    if (!SYMBOLE.has(symbol)) continue
    const treffer = muster.exec(titel)
    if (treffer && (!bester || treffer.index < bester.stelle))
      bester = { stelle: treffer.index, symbol }
  }
  return bester?.symbol ?? null
}

/* ------------------------------------------------------------ Auswahl */

export interface Bebilderung {
  motiv: string | null
  kurs: string | null
}

/** Das Motiv einer einzelnen Kachel – Überschrift vor Text, wie in `bebildere()`. */
function motivFuer(k: { titel: string; text: string }, frei: Motiv[]): Motiv | undefined {
  return (
    frei.find((x) => x.muster.test(k.titel)) ??
    frei.find((x) => x.auchImText && x.muster.test(k.text))
  )
}

/**
 * Das Thema des Deckblatts: das Motiv der wichtigsten Meldung (erste Kachel),
 * wenn ihr Deckblatt dafür taugt (`erlaubt`, die Liste aus
 * `deckblaetter()`). Betreiber, 18.10.2026: „Bei dem Deckblatt musst du auch
 * nicht immer eine Skyline nehmen. Da kannst du gerne auch mal
 * themenbezogene Sachen nehmen." Das Motiv kommt dann nicht noch einmal in
 * einer Kachel vor.
 */
export function deckblattMotiv(
  kacheln: { titel: string; text: string }[],
  erlaubt: string[]
): Motiv | null {
  const erste = kacheln[0]
  if (!erste) return null
  const m = motivFuer(erste, MOTIVE)
  return m?.quelle && erlaubt.includes(m.quelle) ? m : null
}

/**
 * Fotos und Kurse für alle Kacheln eines Beitrags – jede Kachel mit Foto,
 * kein Motiv doppelt, solange der Rückfall reicht.
 */
export function bebildere(
  kacheln: { titel: string; text: string }[],
  /** Schon vergeben, etwa ans Deckblatt. */
  ohne: string | null = null
): Bebilderung[] {
  const vergeben = new Set<string>(ohne ? [ohne] : [])
  return kacheln.map(({ titel, text }) => {
    let motiv: string
    const frei = MOTIVE.filter((x) => !vergeben.has(x.id))
    const m = motivFuer({ titel, text }, frei)
    if (m) motiv = m.id
    else motiv = RUECKFALL.find((id) => !vergeben.has(id)) ?? RUECKFALL[0]
    vergeben.add(motiv)
    return { motiv, kurs: kursZurKachel(titel) }
  })
}
