/**
 * Die Tagesausgabe aus eigenem Bestand – ohne Modell, ohne Netz, ohne Kosten.
 *
 * ## Warum es das gibt
 *
 * Weil „die Nachrichten müssen morgens um halb sechs stehen" eine Zusage ist
 * und jeder bisherige Weg dorthin eine Bedingung hatte: Die Routine braucht
 * eine Sitzung, die durchläuft. Der Workflow braucht einen bezahlten
 * Schnittstellenschlüssel. Beide brauchen eine Quellendatei, die ein dritter
 * Lauf erst holen muss.
 *
 * Dieses Skript braucht nichts davon. Es liest die Momentaufnahmen, die
 * ohnehin im Repository liegen, rechnet daraus fünf Artikel und eine Ausgabe
 * und schreibt sie als JSON – genau in der Form, die
 * `nachrichten-erzeugen.ts` sonst vom Modell bekommt. Über `ANTWORT_DATEI`
 * geht es dort hinein und durch dieselbe Prüfung.
 *
 * Es ist damit die unterste Ebene: schmaler als eine recherchierte Ausgabe,
 * aber sie steht immer, und jede Zahl darin ist belegt.
 *
 * ## Die Regel, die hier alles bestimmt
 *
 * **Keine Ursache, die nicht gelesen wurde.** Aus diesen Dateien geht hervor,
 * *dass* der Nikkei 0,8 Prozent tiefer steht – nicht *warum*. Also steht hier
 * nirgends ein „wegen". Was fehlt, wird benannt statt ergänzt; das ist für
 * einen Lernleser ohnehin der bessere Text.
 *
 * Jede Zahl trägt ihren Stand-Zeitpunkt, weil eine Kurszahl ohne Uhrzeit
 * keine Aussage ist.
 *
 * ## Aufruf
 *
 *   node --experimental-strip-types scripts/nachrichten-aus-bestand.ts
 *
 * Schreibt `antwort-bestand.json` (oder wohin `ZIEL` zeigt). `STICHTAG`
 * überschreibt das Datum.
 */

import { readFileSync, writeFileSync } from 'node:fs'

import { marketDefinitions } from '../data/markets.ts'

// ------------------------------------------------------------------ Bestand

interface Punkt {
  d: string
  c: number
}

interface Reihe {
  sourceLabel?: string
  sourceUrl?: string
  asOf?: string
  points: Punkt[]
}

const marktreihen = JSON.parse(readFileSync('data/snapshots/markets.json', 'utf8')) as {
  fetchedAt: string
  instruments: Record<string, Reihe>
}

const kurse = JSON.parse(readFileSync('data/snapshots/kurse-aktuell.json', 'utf8')) as {
  fetchedAt: string
  latest: Record<string, { value: number; at: string } | null>
}

const breite = JSON.parse(readFileSync('data/snapshots/marktbreite.json', 'utf8')) as {
  abgerufenAm: string
  reihe: {
    d: string
    steigend: number
    fallend: number
    unveraendert: number
    schnitt: number
    breite: number
  }[]
}

const zinsen = JSON.parse(readFileSync('data/snapshots/zinsen.json', 'utf8')) as {
  abgerufenAm: string
  reihen: Record<
    string,
    { bezeichnung: string; einheit: string; aktuell: { t: string; wert: number } }
  >
}

const nachSymbol = new Map(marketDefinitions.map((m) => [m.symbol, m]))

// ------------------------------------------------------------------ Rechnen

/** Tagesveränderung in Prozent aus den letzten zwei Schlusskursen. */
function tagesaenderung(symbol: string): { prozent: number; stand: string } | null {
  const reihe = marktreihen.instruments[symbol]
  if (!reihe || reihe.points.length < 2) return null
  const [vor, letzt] = reihe.points.slice(-2)
  if (!vor?.c || !letzt?.c) return null
  return { prozent: ((letzt.c - vor.c) / vor.c) * 100, stand: letzt.d }
}

function letzterKurs(symbol: string): { wert: number; stand: string } | null {
  const eintrag = kurse.latest[symbol]
  if (!eintrag) return null
  return { wert: eintrag.value, stand: eintrag.at }
}

const zahl = (wert: number, stellen = 2) =>
  wert.toLocaleString('de-DE', {
    minimumFractionDigits: stellen,
    maximumFractionDigits: stellen,
  })

const prozent = (wert: number) =>
  `${wert >= 0 ? '+' : '−'}${zahl(Math.abs(wert))} Prozent`

const datumLang = (iso: string) => {
  const [j, m, t] = iso.slice(0, 10).split('-')
  return `${Number(t)}.${Number(m)}.${j}`
}

const uhrzeit = (iso: string) =>
  `${datumLang(iso)}, ${new Date(iso).toISOString().slice(11, 16)} Uhr UTC`

/**
 * Baut einen Text aus wahren Sätzen bis in ein Längenfenster.
 *
 * Nicht kosmetisch: `teaser` muss zwischen 100 und 160 Zeichen liegen, sonst
 * bricht der Build ab. Sätze zu strecken wäre der falsche Ausweg – hier wird
 * stattdessen so lange ein weiterer **wahrer** Satz angehängt, bis es passt,
 * und wenn keiner mehr da ist, schlägt der Lauf hier fehl statt später.
 */
function fuege(saetze: string[], min: number, max: number, wofuer: string): string {
  let text = ''
  for (const satz of saetze) {
    const naechster = text ? `${text} ${satz}` : satz
    if (naechster.length > max) continue
    text = naechster
    if (text.length >= min) return text
  }
  throw new Error(
    `${wofuer}: aus den vorliegenden Sätzen lässt sich kein Text zwischen ` +
      `${min} und ${max} Zeichen bauen (erreicht: ${text.length}).`
  )
}

// ------------------------------------------------------------------ Ausgabe

const stichtag = process.env.STICHTAG || new Date().toISOString().slice(0, 10)
const ziel = process.env.ZIEL || 'antwort-bestand.json'

interface Quelle {
  label: string
  url: string
}

const QUELLE_KURSE: Quelle = {
  label: `Eigene Kursübersicht, Yahoo-Tagesdaten, Stand ${uhrzeit(kurse.fetchedAt)}`,
  url: 'https://iminvests.de/maerkte',
}
const QUELLE_BREITE: Quelle = {
  label: `Eigene Marktbreite-Aufzeichnung, Stand ${uhrzeit(breite.abgerufenAm)}`,
  url: 'https://iminvests.de/maerkte/tagesbild',
}
const QUELLE_ZINSEN: Quelle = {
  label: `Europäische Zentralbank über die eigene Zinsübersicht, Stand ${uhrzeit(zinsen.abgerufenAm)}`,
  url: 'https://iminvests.de/maerkte/zinsen',
}

const HINWEIS =
  'Diese Ausgabe entstand ohne redaktionelle Recherche aus dem eigenen ' +
  'Datenbestand. Sie nennt deshalb Bewegungen und keine Begründungen: Aus ' +
  'Kursdaten geht hervor, dass sich etwas bewegt hat, nicht warum.'

interface Artikel {
  slug: string
  title: string
  metaTitle?: string
  teaser: string
  category: string
  readingMinutes: number
  tags: string[]
  relatedTopics: string[]
  relatedSymbols: string[]
  sources: Quelle[]
  body: { type: 'paragraph' | 'heading'; text: string; level?: number }[]
}

interface Meldung {
  headline: string
  summary: string[]
  category: string
  whyItMatters: string
  relatedTopics: string[]
  relatedSymbols: string[]
  sources: Quelle[]
}

const artikel: Artikel[] = []
const top: Meldung[] = []
const further: Meldung[] = []

// ------------------------------------------------------- 1. Die Leitindizes

const LEITINDIZES = ['dax', 'sp500', 'nikkei-225', 'euro-stoxx-50', 'nasdaq-100']

const indexZeilen = LEITINDIZES.map((symbol) => {
  const def = nachSymbol.get(symbol)
  const aenderung = tagesaenderung(symbol)
  const kurs = letzterKurs(symbol)
  if (!def || !aenderung || !kurs) return null
  return { name: def.name, symbol, ...aenderung, kurs: kurs.wert, kursStand: kurs.stand }
}).filter((z): z is NonNullable<typeof z> => z !== null)

if (indexZeilen.length >= 2) {
  const beste = [...indexZeilen].sort((a, b) => b.prozent - a.prozent)[0]!
  const schlechteste = [...indexZeilen].sort((a, b) => a.prozent - b.prozent)[0]!

  artikel.push({
    slug: `leitindizes-stand-${stichtag}`,
    title: `Die Leitindizes am ${datumLang(stichtag)}: was die Zahlen sagen`,
    teaser: fuege(
      [
        `${beste.name} führt mit ${prozent(beste.prozent)}, ${schlechteste.name} liegt mit ${prozent(schlechteste.prozent)} hinten.`,
        'Warum ein Vergleich zweier Indizes fast immer schiefgeht.',
        'Gerechnet aus den eigenen Tagesdaten, nicht gedeutet.',
      ],
      100,
      160,
      'Teaser Leitindizes'
    ),
    category: 'Märkte',
    readingMinutes: 4,
    tags: ['Indizes', 'Marktdaten'],
    relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
    relatedSymbols: indexZeilen.map((z) => z.symbol).slice(0, 4),
    sources: [QUELLE_KURSE],
    body: [
      {
        type: 'paragraph',
        text: `Der Stand der geführten Leitindizes zum letzten abgerufenen Schluss: ${indexZeilen
          .map((z) => `**${z.name}** ${prozent(z.prozent)} (${datumLang(z.stand)})`)
          .join(', ')}.`,
      },
      { type: 'heading', level: 2, text: 'Warum diese Zahlen nicht vergleichbar sind' },
      {
        type: 'paragraph',
        text: 'Der DAX ist ein **Performanceindex**: Dividenden werden rechnerisch wieder angelegt und stecken im Indexstand. Der Euro Stoxx 50, der S&P 500 und der Nikkei 225 sind in ihrer gängigen Fassung **Kursindizes** – dort fehlt die Dividende. Über ein Jahr macht das je nach Markt zwei bis drei Prozentpunkte aus, über zwanzig Jahre den größeren Teil des Unterschieds.',
      },
      {
        type: 'paragraph',
        text: 'Auf einen einzelnen Tag wirkt sich das kaum aus – wohl aber auf jeden Langfristvergleich, der zwei solche Indizes nebeneinanderstellt. Wer den DAX über zehn Jahre gegen den Euro Stoxx 50 hält, vergleicht nicht zwei Märkte, sondern zwei Rechenweisen.',
      },
      { type: 'heading', level: 2, text: 'Was hier bewusst fehlt' },
      { type: 'paragraph', text: HINWEIS },
    ],
  })

  top.push({
    headline: `Leitindizes: ${beste.name} vorn, ${schlechteste.name} hinten`,
    summary: [
      `Zum letzten abgerufenen Schluss steht ${beste.name} bei ${prozent(beste.prozent)}, ${schlechteste.name} bei ${prozent(schlechteste.prozent)}.`,
      'Die Spanne zwischen beiden ist der eigentliche Befund des Tages, nicht der einzelne Indexstand.',
    ],
    category: 'Märkte',
    whyItMatters:
      'Ein Indexstand allein ist keine Aussage über einen Markt: Performance- und Kursindizes rechnen verschieden, und ein Vergleich zwischen ihnen misst die Rechenweise mit.',
    relatedTopics: ['boerse'],
    relatedSymbols: [beste.symbol, schlechteste.symbol],
    sources: [QUELLE_KURSE],
  })
}

// ------------------------------------------------------- 2. Die Marktbreite

const heute = breite.reihe[breite.reihe.length - 1]
if (heute) {
  const bewegt = heute.steigend + heute.fallend
  artikel.push({
    slug: `marktbreite-${stichtag}`,
    title: `Marktbreite am ${datumLang(heute.d)}: wie viele Titel tragen die Bewegung`,
    metaTitle: `Marktbreite am ${datumLang(heute.d)}`,
    teaser: fuege(
      [
        `${heute.steigend} Titel im Plus, ${heute.fallend} im Minus – die Bewegung ist zu ${zahl(heute.breite, 1)} Prozent getragen.`,
        'Was diese Zahl über einen Indexstand hinaus verrät.',
        'Aus der eigenen Aufzeichnung gerechnet.',
      ],
      100,
      160,
      'Teaser Marktbreite'
    ),
    category: 'Märkte',
    readingMinutes: 4,
    tags: ['Marktbreite', 'Marktdaten'],
    relatedTopics: ['wie-funktioniert-der-markt', 'risiko-und-rendite'],
    relatedSymbols: ['dax', 'sp500'],
    sources: [QUELLE_BREITE],
    body: [
      {
        type: 'paragraph',
        text: `Von den ausgewerteten Titeln standen am ${datumLang(heute.d)} **${heute.steigend}** im Plus und **${heute.fallend}** im Minus, ${heute.unveraendert} unverändert. Der ungewichtete Schnitt über alle lag bei ${prozent(heute.schnitt)}, die Breite bei ${zahl(heute.breite, 1)} Prozent.`,
      },
      { type: 'heading', level: 2, text: 'Was „Breite" hier misst' },
      {
        type: 'paragraph',
        text: `Die Breite ist der Anteil der bewegten Titel, die in dieselbe Richtung laufen wie der Gesamtschnitt. Bei 50 Prozent ist der Markt geteilt; bei 90 zieht fast alles mit. Heute sind es ${zahl(heute.breite, 1)} Prozent von ${bewegt} bewegten Titeln.`,
      },
      {
        type: 'paragraph',
        text: 'Der Unterschied ist praktisch. Ein Index kann steigen, weil alle 40 Werte steigen – oder weil drei schwere Werte steigen und 37 fallen. Der Indexstand ist in beiden Fällen derselbe, die Lage nicht. Nach Börsenwert gewichtete Indizes verbergen diesen Unterschied bauartbedingt.',
      },
      {
        type: 'paragraph',
        text: 'Deshalb wird hier ungewichtet gerechnet: Jede Aktie zählt gleich. Nach Börsenwert gewichtet wäre der Schnitt der Halbleiter praktisch der Kurs eines einzigen Unternehmens.',
      },
      { type: 'heading', level: 2, text: 'Was hier bewusst fehlt' },
      { type: 'paragraph', text: HINWEIS },
    ],
  })

  top.push({
    headline: `${heute.steigend} Titel im Plus, ${heute.fallend} im Minus`,
    summary: [
      `Am ${datumLang(heute.d)} lag der ungewichtete Schnitt über alle ausgewerteten Aktien bei ${prozent(heute.schnitt)}.`,
      `Die Bewegung war zu ${zahl(heute.breite, 1)} Prozent getragen – so groß ist der Anteil der Titel, die mit dem Gesamtschnitt liefen.`,
    ],
    category: 'Märkte',
    whyItMatters:
      'Ob ein Plus von allen Titeln getragen wird oder von drei schweren Werten, ist am Indexstand nicht ablesbar. Die Breite macht genau diesen Unterschied sichtbar.',
    relatedTopics: ['wie-funktioniert-der-markt'],
    relatedSymbols: ['dax'],
    sources: [QUELLE_BREITE],
  })
}

// -------------------------------------------- 3. Zinsen, Inflation, Realzins

const leitzins = zinsen.reihen.leitzins
const inflationDe = zinsen.reihen['inflation-de']
if (leitzins && inflationDe) {
  const real = leitzins.aktuell.wert - inflationDe.aktuell.wert
  /*
    Am 5. August lagen beide Zahlen bei 2,4 – „rund 0,0 Prozentpunkte" wäre
    formal richtig und als Satz unlesbar. Bei einer Differenz unter einem
    Zehntel heißt es deshalb, was es heißt: die beiden halten sich die Waage.
  */
  const realSatz =
    Math.abs(real) < 0.1
      ? 'praktisch bei null – Zins und Inflation halten sich die Waage'
      : `bei rund ${zahl(real, 1)} Prozentpunkten`
  artikel.push({
    slug: `realzins-${stichtag}`,
    title: `Leitzins ${zahl(leitzins.aktuell.wert, 2)} Prozent, Inflation ${zahl(inflationDe.aktuell.wert, 1)} Prozent – was übrig bleibt`,
    metaTitle: 'Leitzins gegen Inflation: der Realzins',
    teaser: fuege(
      [
        `Der EZB-Leitzins liegt bei ${zahl(leitzins.aktuell.wert, 2)} Prozent, die deutsche Inflationsrate bei ${zahl(inflationDe.aktuell.wert, 1)} Prozent.`,
        'Die Differenz ist der Realzins – und die einzige Zahl, die zählt.',
        'Beide Werte stammen von der EZB.',
      ],
      100,
      160,
      'Teaser Realzins'
    ),
    category: 'Geldpolitik',
    readingMinutes: 4,
    tags: ['Zinsen', 'Inflation'],
    relatedTopics: ['notenbanken-geldpolitik', 'inflation', 'tagesgeld'],
    relatedSymbols: [],
    sources: [QUELLE_ZINSEN],
    body: [
      {
        type: 'paragraph',
        text: `**${leitzins.bezeichnung}**: ${zahl(leitzins.aktuell.wert, 2)} Prozent, Stand ${datumLang(leitzins.aktuell.t)}. **${inflationDe.bezeichnung}**: ${zahl(inflationDe.aktuell.wert, 1)} Prozent für ${inflationDe.aktuell.t}.`,
      },
      { type: 'heading', level: 2, text: 'Der Realzins' },
      {
        type: 'paragraph',
        text: `Die Differenz beider Zahlen heißt Realzins und liegt derzeit ${realSatz}. Sie beantwortet die einzige Frage, die für Erspartes zählt: Kann man sich in einem Jahr mehr kaufen als heute, oder weniger?`,
      },
      {
        type: 'paragraph',
        text: 'Ein Tagesgeldkonto mit drei Prozent bei vier Prozent Inflation verliert Kaufkraft, obwohl der Kontostand steigt. Umgekehrt kann ein Prozent Zins bei null Prozent Inflation ein Gewinn sein. Der nominale Zinssatz allein sagt darüber nichts.',
      },
      {
        type: 'paragraph',
        text: 'Zwei Einschränkungen: Der Leitzins der EZB ist nicht der Zins, den eine Bank zahlt – er ist die Untergrenze, an der sich der Geldmarkt orientiert. Und die Inflationsrate ist ein Durchschnitt über einen Warenkorb, der niemandes tatsächlichem Einkauf entspricht.',
      },
      { type: 'heading', level: 2, text: 'Was hier bewusst fehlt' },
      { type: 'paragraph', text: HINWEIS },
    ],
  })

  further.push({
    headline: `Realzins ${realSatz.replace(/ – .*/, '')}`,
    summary: [
      `Leitzins ${zahl(leitzins.aktuell.wert, 2)} Prozent (Stand ${datumLang(leitzins.aktuell.t)}) gegen eine deutsche Inflationsrate von ${zahl(inflationDe.aktuell.wert, 1)} Prozent für ${inflationDe.aktuell.t}.`,
    ],
    category: 'Geldpolitik',
    whyItMatters:
      'Der Kontostand steigt, die Kaufkraft kann trotzdem sinken. Erst die Differenz aus Zins und Inflation sagt, ob Erspartes tatsächlich mehr wert wird.',
    relatedTopics: ['inflation', 'tagesgeld'],
    relatedSymbols: [],
    sources: [QUELLE_ZINSEN],
  })
}

// ------------------------------------------------- 4. Der Euro und das Gold

/*
  Der Euro steht nicht in `kurse-aktuell.json` – Devisen kommen von der EZB und
  nicht von der Kursquelle. Ein `letzterKurs('eur-usd')` liefert deshalb `null`,
  und dieser ganze Abschnitt fiel beim ersten Durchlauf still aus. Die Reihe in
  `markets.json` ist die richtige Stelle; sie trägt ihre Quelle gleich mit.
*/
const eurReihe = marktreihen.instruments['eur-usd']
const eurPunkt = eurReihe?.points.at(-1)
const eurUsd = eurPunkt ? { wert: eurPunkt.c, stand: eurPunkt.d } : null
const gold = letzterKurs('gold')
if (eurUsd && gold) {
  const goldEuro = gold.wert / eurUsd.wert
  const QUELLE_EURO: Quelle = {
    label: `${eurReihe?.sourceLabel ?? 'Europäische Zentralbank'}, Referenzkurs vom ${datumLang(eurUsd.stand)}`,
    url: eurReihe?.sourceUrl ?? 'https://iminvests.de/maerkte/eur-usd',
  }
  artikel.push({
    slug: `gold-in-zwei-waehrungen-${stichtag}`,
    title: 'Ein Goldpreis, zwei Zahlen: warum Dollar und Euro auseinanderlaufen',
    metaTitle: 'Gold in Dollar und in Euro',
    teaser: fuege(
      [
        `Gold notiert bei ${zahl(gold.wert)} Dollar, der Euro bei ${zahl(eurUsd.wert, 4)} Dollar – in Euro sind das rund ${zahl(goldEuro)}.`,
        'Ein Euro-Preis hat immer zwei Ursachen.',
        'Stand jeweils aus den eigenen Kursdaten.',
      ],
      100,
      160,
      'Teaser Gold'
    ),
    category: 'Geldanlage',
    readingMinutes: 4,
    tags: ['Gold', 'Währungen'],
    relatedTopics: ['rohstoffe', 'waehrungen-wechselkurse'],
    relatedSymbols: ['gold', 'eur-usd'],
    sources: [QUELLE_KURSE, QUELLE_EURO],
    body: [
      {
        type: 'paragraph',
        text: `Gold stand zuletzt bei **${zahl(gold.wert)} Dollar** je Feinunze (Stand ${uhrzeit(gold.stand)}). Der Euro notierte bei **${zahl(eurUsd.wert, 4)} Dollar** (Stand ${datumLang(eurUsd.stand)}). Umgerechnet sind das rund **${zahl(goldEuro)} Euro**.`,
      },
      { type: 'heading', level: 2, text: 'Zwei Ursachen für eine Zahl' },
      {
        type: 'paragraph',
        text: 'Gold wird international in Dollar gehandelt. Wer den Preis in Euro sehen will, rechnet um – und übernimmt damit den Wechselkurs als zweite bewegliche Größe. Der Euro-Preis kann deshalb steigen, während der Dollar-Preis fällt: Es genügt, dass der Euro gegenüber dem Dollar stärker nachgibt.',
      },
      {
        type: 'paragraph',
        text: 'Für einen Anleger im Euroraum heißt das: Eine Goldposition ist immer auch eine Dollarposition. Wer „auf Gold setzt", setzt zur Hälfte auf eine Währung. Dasselbe gilt für Öl, für Kupfer und für jeden weltweit in Dollar notierten Rohstoff.',
      },
      {
        type: 'paragraph',
        text: 'Deshalb ist die Frage bei jeder Rohstoffmeldung: in welcher Währung? Zwei Berichte, die scheinbar widersprüchliche Zahlen nennen, meinen oft dieselbe Unze in zwei Währungen – oder zu zwei Uhrzeiten.',
      },
      { type: 'heading', level: 2, text: 'Was hier bewusst fehlt' },
      { type: 'paragraph', text: HINWEIS },
    ],
  })

  further.push({
    headline: `Gold bei ${zahl(gold.wert)} Dollar, umgerechnet rund ${zahl(goldEuro)} Euro`,
    summary: [
      `Der Euro notierte zuletzt bei ${zahl(eurUsd.wert, 4)} Dollar (Stand ${datumLang(eurUsd.stand)}).`,
      'Der Euro-Preis eines Dollar-Rohstoffs bewegt sich mit zwei Größen zugleich.',
    ],
    category: 'Geldanlage',
    whyItMatters:
      'Wer einen in Dollar notierten Rohstoff hält, hält immer auch eine Währungsposition. Ein steigender Euro-Preis muss nichts über den Rohstoff selbst aussagen.',
    relatedTopics: ['rohstoffe', 'waehrungen-wechselkurse'],
    relatedSymbols: ['gold', 'eur-usd'],
    sources: [QUELLE_KURSE, QUELLE_EURO],
  })
}

// ------------------------------------------- 5. Die Spanne unter den Aktien

const aktien = marketDefinitions
  .filter((m) => m.kind === 'stock')
  .map((m) => {
    const a = tagesaenderung(m.symbol)
    return a ? { name: m.name, symbol: m.symbol, ...a } : null
  })
  .filter((z): z is NonNullable<typeof z> => z !== null)

if (aktien.length >= 20) {
  const sortiert = [...aktien].sort((a, b) => b.prozent - a.prozent)
  const gewinner = sortiert.slice(0, 3)
  const verlierer = sortiert.slice(-3).reverse()

  artikel.push({
    slug: `spanne-des-tages-${stichtag}`,
    title: 'Die Spanne des Tages: warum Prozentzahlen einen Bezugspunkt brauchen',
    metaTitle: 'Die Spanne des Tages',
    teaser: fuege(
      [
        `Zwischen ${gewinner[0]!.name} mit ${prozent(gewinner[0]!.prozent)} und ${verlierer[0]!.name} mit ${prozent(verlierer[0]!.prozent)} liegen Welten.`,
        'Was eine Prozentzahl verschweigt.',
        `Gerechnet über ${aktien.length} geführte Aktien.`,
      ],
      100,
      160,
      'Teaser Spanne'
    ),
    category: 'Märkte',
    readingMinutes: 4,
    tags: ['Aktien', 'Marktdaten'],
    relatedTopics: ['aktie', 'risiko-und-rendite'],
    relatedSymbols: [],
    sources: [QUELLE_KURSE],
    body: [
      {
        type: 'paragraph',
        text: `Über ${aktien.length} geführte Aktien reichte die Tagesveränderung von ${prozent(gewinner[0]!.prozent)} bis ${prozent(verlierer[0]!.prozent)}. Vorn: ${gewinner.map((g) => `**${g.name}** ${prozent(g.prozent)}`).join(', ')}. Hinten: ${verlierer.map((v) => `**${v.name}** ${prozent(v.prozent)}`).join(', ')}.`,
      },
      { type: 'heading', level: 2, text: 'Prozent von was' },
      {
        type: 'paragraph',
        text: 'Eine Prozentangabe ist eine Verhältniszahl, und ihr Nenner steht selten dabei. Ein Titel, der von zwei auf drei Euro steigt, legt 50 Prozent zu; einer, der von 200 auf 210 Euro steigt, nur fünf – obwohl der zweite den Anleger um zehn Euro je Stück reicher macht und der erste um einen.',
      },
      {
        type: 'paragraph',
        text: 'Deshalb stehen an der Spitze solcher Listen überdurchschnittlich oft kleine und wenig gehandelte Werte. Das ist kein Befund über ihre Qualität, sondern eine Eigenschaft des Bruchs: Bei einem kleinen Nenner erzeugt eine kleine Bewegung eine große Zahl.',
      },
      {
        type: 'paragraph',
        text: 'Umgekehrt gilt dasselbe für Verluste – und dort mit einer Schieflage, die häufig übersehen wird: Ein Minus von 50 Prozent erfordert ein Plus von 100 Prozent, um wieder am Ausgangspunkt zu stehen. Auf- und Abstieg sind nicht symmetrisch.',
      },
      { type: 'heading', level: 2, text: 'Was hier bewusst fehlt' },
      { type: 'paragraph', text: HINWEIS },
    ],
  })

  top.push({
    headline: `Von ${prozent(gewinner[0]!.prozent)} bis ${prozent(verlierer[0]!.prozent)}: die Spanne des Tages`,
    summary: [
      `Über ${aktien.length} geführte Aktien führte ${gewinner[0]!.name}, am Ende stand ${verlierer[0]!.name}.`,
      'Aus den Kursdaten geht die Bewegung hervor, nicht ihr Anlass.',
    ],
    category: 'Märkte',
    whyItMatters:
      'Prozentzahlen ohne Bezugspunkt führen in die Irre: Bei einem niedrigen Kurs erzeugt eine kleine Bewegung eine große Zahl, und ein Minus wiegt schwerer als ein gleich großes Plus.',
    relatedTopics: ['aktie', 'risiko-und-rendite'],
    relatedSymbols: [],
    sources: [QUELLE_KURSE],
  })
}

// ------------------------------------------------------------- Zusammenbau

if (artikel.length < 3) {
  console.error(
    `::error::Nur ${artikel.length} Artikel aus dem Bestand – zu wenig für eine Ausgabe. ` +
      'Vermutlich fehlt eine Momentaufnahme unter data/snapshots/.'
  )
  process.exit(1)
}

const intro = fuege(
  [
    `Der ${datumLang(stichtag)} in Zahlen aus dem eigenen Bestand.`,
    'Was sich bewegt hat, wie breit es getragen war und was die Zahlen nicht verraten.',
    'Ohne Deutung, mit Stand-Zeitpunkt an jeder Angabe.',
  ],
  110,
  165,
  'Intro der Ausgabe'
)

const ergebnis = { intro, artikel, top: top.slice(0, 6), further }

writeFileSync(ziel, JSON.stringify(ergebnis, null, 2))
console.log(
  `${artikel.length} Artikel, ${top.length} Top-Meldungen und ${further.length} weitere ` +
    `aus dem Bestand gerechnet – geschrieben nach ${ziel}.`
)
console.log(`Intro (${intro.length} Zeichen): ${intro}`)
for (const a of artikel) console.log(`  · ${a.title} (Teaser ${a.teaser.length})`)
