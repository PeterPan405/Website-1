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
  /** Das Deckblatt, aus dem es geschnitten ist. */
  quelle: string
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
    id: 'frankfurt',
    quelle: '2026-09-23.jpg',
    muster: woerter('Dax', 'DAX', 'MDax', 'Frankfurter Börse'),
    auchImText: true,
  },
  {
    id: 'banken',
    quelle: '2026-09-07.jpg',
    muster: woerter(
      'Bank*',
      'Banken*',
      'Commerzbank',
      'UniCredit',
      'UBS',
      'Sparkasse*',
      'EuGH'
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
  {
    id: 'finanzviertel',
    quelle: '2026-09-08.jpg',
    muster: woerter(
      'Fusion*',
      'Übernahme*',
      'Kapitalregel*',
      'Anleihe*',
      'Rendite*',
      'Umzug'
    ),
    auchImText: false,
  },
  {
    id: 'deutschland',
    quelle: '2026-10-06.jpg',
    muster: woerter('Deutschland', 'Bundesregierung', 'ifo', 'Konjunktur*'),
    auchImText: false,
  },
  {
    id: 'europa',
    quelle: '2026-09-29.jpg',
    muster: woerter('Spanien', 'Europa', 'EU', 'Frankreich', 'Italien'),
    auchImText: false,
  },
  {
    id: 'new-york',
    quelle: '2026-10-09.jpg',
    muster: woerter('USA', 'US-*', 'Trump'),
    auchImText: false,
  },
]

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

/** Fotos und Kurse für alle Kacheln eines Beitrags – kein Motiv doppelt. */
export function bebildere(kacheln: { titel: string; text: string }[]): Bebilderung[] {
  const vergeben = new Set<string>()
  return kacheln.map(({ titel, text }) => {
    let motiv: string | null = null
    const frei = MOTIVE.filter((x) => !vergeben.has(x.id))
    const m =
      frei.find((x) => x.muster.test(titel)) ??
      frei.find((x) => x.auchImText && x.muster.test(text))
    if (m) {
      motiv = m.id
      vergeben.add(m.id)
    }
    return { motiv, kurs: kursZurKachel(titel) }
  })
}

/**
 * Das Motiv des Titelbilds eines Tagesbeitrags: das gewählte, sonst aus
 * Überschrift und Text gewählt wie bei den Tageskacheln, sonst die
 * Frankfurter Skyline – ein Titelbild ohne Foto wäre keins.
 */
export function titelmotiv(k: {
  titel: { text: string }[]
  text: string
  titelbild?: string
}): Motiv {
  const gewaehlt = k.titelbild ? MOTIVE.find((m) => m.id === k.titelbild) : undefined
  if (gewaehlt) return gewaehlt
  const [auto] = bebildere([
    { titel: k.titel.map((t) => t.text).join(' '), text: k.text },
  ])
  return (
    MOTIVE.find((m) => m.id === auto.motiv) ?? MOTIVE.find((m) => m.id === 'frankfurt')!
  )
}
