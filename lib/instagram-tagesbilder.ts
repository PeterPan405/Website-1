/**
 * Tagesbilder: jeden Tag neue Fotos für die Kacheln der Tagesnews.
 *
 * Betreiber, 21.10.2026, nachdem er den Beitrag vom Morgen wieder
 * herausgenommen hatte: „Er hatte die gleichen Bilder drin wie … News vor
 * ein paar Tagen. Es soll immer neue Bilder geben. Es gibt ja genug Bilder
 * auf der Welt." Frankreich, Hafen und Euro-Geld waren am 20.10. schon
 * dagewesen – mit 21 festen Motiven kehrt jedes nach wenigen Tagen wieder.
 *
 * ## Woher
 *
 * Von Wikimedia Commons, jeden Morgen neu gesucht
 * (`scripts/instagram-bilder.ts`, `.github/workflows/instagram-bilder.yml`).
 * Genommen wird nur, was frei ist – gemeinfrei, CC0, und seit dem 21.10.2026
 * auch CC BY und CC BY-SA mit Nennung im Beitragstext (`bildnachweis()`;
 * Betreiber: „CC BY/BY-SA erlauben") –, im Querformat, groß genug,
 * ohne Einschränkung (Persönlichkeitsrecht, Marke) – und **was noch nie
 * genommen wurde**: Das Register `data/instagram/bilder.json` hält jede
 * Datei fest, die je auf einer Kachel stand.
 *
 * ## Wonach gesucht wird
 *
 * Nach dem Thema der Kachel, wie es `bebildere()` bestimmt, mit festen
 * englischen Suchbegriffen je Motiv (`SUCHE`) – Commons ist englisch
 * beschriftet. Nennt die Überschrift ein Land, kommt es vor den Begriff
 * („Japan container ship"); nennt sie ein Unternehmen aus dem Kursbestand,
 * wird zuerst nach dem Namen gesucht, und genommen wird nur eine Datei, deren
 * Titel den Namen trägt. Findet sich nichts Neues, bleibt das feste Motiv –
 * eins, das in den letzten Tagen nicht dran war.
 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { marketDefinitions } from '@/data/markets'
import { MOTIVE } from '@/lib/instagram-motive'

export const REGISTER = 'data/instagram/bilder.json'
export const TAGESBILDER = 'lib/instagram/tagesbilder'

export interface Tagesbild {
  /** Stelle im Karussell – 2 ist die erste Meldung (1 ist das Deckblatt). */
  stelle: number
  datei: string
  /** Titel der Datei auf Commons, „File:…" – daran hängt „nie zweimal". */
  titel: string
  seite: string
  lizenz: string
  urheber: string
  suche: string
  /**
   * Statt eines Fotos der Kursverlauf dieses Symbols (`kachelKurs()`).
   *
   * Betreiber, 24.10.2026, zu „Munich Re: Prognose steigt": „vielleicht dann
   * mal wieder ein Chart. Wenn sich da kein richtiges Bild finden lässt,
   * dann einfach ein Chart auch zukünftig." Der Morgenlauf trägt ihn ein,
   * wenn er für ein Unternehmen kein Markenfoto findet.
   */
  kurs?: string
}

export type Register = Record<string, Tagesbild[]>

export function leseRegister(pfad = REGISTER): Register {
  return existsSync(pfad) ? JSON.parse(readFileSync(pfad, 'utf8')) : {}
}

/**
 * Jede Commons-Datei, die je auf einer Kachel stand – auch die der festen
 * Motive: Am 21.10.2026 fand der erste Lauf für „Rekord bei
 * Haushaltsvermögen" genau das Euro-Foto, das am Vortag als Motiv stand.
 */
/**
 * Was der Betreiber beanstandet hat – kommt nie wieder, auch wenn es im
 * Register durch eine Wahl von Hand ersetzt wurde und dort nicht mehr steht.
 * Am 26.10.2026 kam der Eiffelturm mit den Olympia-Ringen ein zweites Mal:
 * Am 24.10. war er ersetzt worden und galt damit als unbenutzt.
 */
export const ABGELEHNT = [
  'File:Olympic rings on the Eiffel Tower 2024 (5).jpg',
  'File:Tanzanian Sign Language (TSL) - Manual alphabet - F.jpg',
  'File:Rotor-Gene Q thermocycle of Qiagen.jpg',
  'File:Seria Refinery flare stack in 2025 - 03.jpg',
  'File:Palais Brongniart PARIS.JPG',
  'File:Munich RE (1).jpg',
  'File:American Express Centurion Card front.jpg',
  'File:Andrew Bailey (9053038723).jpg',
]

export function verwendeteTitel(register: Register): Set<string> {
  const motive = MOTIVE.flatMap((m) =>
    m.herkunft ? [titelAusSeite(m.herkunft.seite)] : []
  )
  return new Set([
    ...ABGELEHNT,
    ...motive,
    ...Object.values(register).flatMap((tag) =>
      tag.filter((b) => !b.kurs).map((b) => b.titel)
    ),
  ])
}

/** Steht für die Stelle ein Kursverlauf statt eines Fotos? Dann sein Symbol. */
export function tageskurs(
  datum: string,
  stelle: number,
  register = leseRegister()
): string | null {
  return register[datum]?.find((x) => x.stelle === stelle)?.kurs ?? null
}

/** „https://commons.wikimedia.org/wiki/File:A_b.jpg" → „File:A b.jpg". */
export function titelAusSeite(seite: string): string {
  const name = decodeURIComponent(seite.split('/wiki/')[1] ?? '')
  return name.replace(/_/g, ' ')
}

/**
 * Der Dateiname eines Tagesbilds – mit einem Stück vom Titel.
 *
 * Bis zum 26.10.2026 hieß die Datei nur nach Tag und Stelle. Dann wurden die
 * Kacheln umsortiert, die Stellen im Register von Hand umnummeriert, die
 * Dateien nicht: Das Ifo-Logo (jetzt Stelle 5) lag weiter unter `…-3.jpg`.
 * Die Wahl des Audi-Werks für Stelle 3 schrieb dieselbe Datei – und im
 * Beitrag standen zweimal das Werk. Ein Name, der am Bild hängt, kann kein
 * anderes Bild überschreiben.
 */
export function dateiname(datum: string, stelle: number, titel: string): string {
  const kurz = createHash('sha1').update(titel).digest('hex').slice(0, 8)
  return `${datum}-${stelle}-${kurz}.jpg`
}

/**
 * Was an einem Tag doppelt wäre: zwei Einträge mit derselben Datei, oder zwei
 * Dateien mit demselben Inhalt. Leer heißt: jede Kachel ein eigenes Bild.
 */
export function doppelteBilder(
  eintraege: Tagesbild[],
  lesen: (datei: string) => Buffer | null = (datei) => {
    const pfad = join(process.cwd(), TAGESBILDER, datei)
    return existsSync(pfad) ? readFileSync(pfad) : null
  }
): string[] {
  const fehler: string[] = []
  const namen = new Map<string, number>()
  const inhalte = new Map<string, number>()
  for (const e of eintraege) {
    if (e.kurs || !e.datei) continue
    const vorher = namen.get(e.datei)
    if (vorher !== undefined)
      fehler.push(`Stelle ${vorher} und ${e.stelle} teilen sich die Datei ${e.datei}`)
    namen.set(e.datei, e.stelle)
    const inhalt = lesen(e.datei)
    if (!inhalt) {
      fehler.push(`Stelle ${e.stelle}: ${e.datei} fehlt`)
      continue
    }
    const h = createHash('sha1').update(inhalt).digest('hex')
    const gleich = inhalte.get(h)
    if (gleich !== undefined && gleich !== e.stelle)
      fehler.push(`Stelle ${gleich} und ${e.stelle} zeigen dasselbe Bild`)
    inhalte.set(h, e.stelle)
  }
  return fehler
}

/** Das Tagesbild für eine Stelle, wenn es eins gibt. */
export function tagesbild(
  datum: string,
  stelle: number,
  register = leseRegister()
): Buffer | null {
  const b = register[datum]?.find((x) => x.stelle === stelle)
  if (!b || b.kurs) return null
  const pfad = join(process.cwd(), TAGESBILDER, b.datei)
  return existsSync(pfad) ? readFileSync(pfad) : null
}

/** Englische Suchbegriffe je Motiv – in dieser Reihenfolge versucht. */
export const SUCHE: Record<string, string[]> = {
  oel: ['oil refinery', 'oil tanker ship', 'oil pumpjack', 'offshore oil platform'],
  ezb: ['euro banknotes', 'European Central Bank'],
  fed: ['Marriner S. Eccles Federal Reserve Board Building', 'Federal Reserve'],
  'wall-street': ['New York Stock Exchange', 'Wall Street New York'],
  trump: ['Donald Trump 2025 White House'],
  kapitol: ['United States Capitol'],
  'weisses-haus': ['White House Washington'],
  frankreich: ['Eiffel Tower', 'Arc de Triomphe', 'Paris Seine', 'French flag'],
  'bank-of-england': ['Bank of England', 'City of London'],
  gericht: ['gavel', 'courtroom', 'Lady Justice statue'],
  luftfahrt: ['airliner takeoff', 'Airbus aircraft', 'airport aircraft apron'],
  bahn: ['railway train', 'train station platform', 'ICE train'],
  tech: ['semiconductor wafer', 'printed circuit board', 'data center servers'],
  smartphone: ['smartphone hand', 'smartphone screen', 'mobile phone apps'],
  hafen: ['container ship', 'container terminal port', 'harbour cranes containers'],
  industrie: ['factory assembly line', 'car factory production', 'industrial plant'],
  wohnen: ['apartment buildings', 'residential houses street', 'house construction site'],
  euro: ['piggy bank', 'euro coins', 'coins money', 'euro banknotes'],
  konsum: ['supermarket', 'shopping cart', 'shopping street'],
  tresor: ['bank vault', 'gold bars', 'safe deposit boxes'],
  boerse: [
    'stock exchange trading floor',
    'stock market ticker',
    'stock exchange building',
  ],
}

/** Länder in der Überschrift – deutsch, wie sie dort stehen, und englisch. */
const LAENDER: [RegExp, string][] = [
  /* „UK-Inflation auf 3,5 %" (22.10.2026) fand kein Land – und Wasserbüffel. */
  [/\bUK\b|\bBriten\b|\bbritisch/u, 'United Kingdom'],
  [/\bUS-|\bUSA\b/u, 'United States'],
  [/\bJapans?\b/u, 'Japan'],
  [/\bChinas?\b/u, 'China'],
  [/\bIndiens?\b/u, 'India'],
  [/\bFrankreichs?\b/u, 'France'],
  [/\bItaliens?\b/u, 'Italy'],
  [/\bSpaniens?\b/u, 'Spain'],
  [/\bGroßbritanniens?\b|\bBritannien\b/u, 'United Kingdom'],
  [/\bDeutschlands?\b/u, 'Germany'],
  [/\bSchweiz\b/u, 'Switzerland'],
  [/\bÖsterreichs?\b/u, 'Austria'],
  [/\bPolens?\b/u, 'Poland'],
  [/\bRusslands?\b/u, 'Russia'],
  [/\bUkraine\b/u, 'Ukraine'],
  [/\bTürkei\b/u, 'Turkey'],
  [/\bKanadas?\b/u, 'Canada'],
  [/\bBrasiliens?\b/u, 'Brazil'],
  [/\bIndonesiens?\b/u, 'Indonesia'],
  [/\bSüdkoreas?\b|\bKoreas?\b/u, 'South Korea'],
  [/\bMexikos?\b/u, 'Mexico'],
]

/** Unternehmen aus dem Kursbestand, wie sie in einer Überschrift stehen. */
function unternehmenIn(titel: string): string | null {
  for (const m of marketDefinitions) {
    if (m.kind !== 'stock') continue
    const name = m.name
      .replace(/\s*\(.*\)$/, '')
      .replace(
        /\s+(AG|SE|Inc\.?|Corp\.?|Corporation|plc|N\.V\.|S\.A\.|Holding|Group)$/i,
        ''
      )
      .trim()
    if (
      name.length >= 3 &&
      new RegExp(
        `(?<![\\p{L}])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`,
        'u'
      ).test(titel)
    )
      return name
  }
  /* Marken, die im Bestand unter dem Konzern stehen. */
  const marke = /\b(Google|YouTube|Instagram|WhatsApp|iPhone)\b/u.exec(titel)
  return marke?.[1] ?? null
}

export interface Suche {
  begriff: string
  /** Nur Dateien, deren Titel dieses Wort trägt – bei Firmennamen. */
  mussEnthalten?: string
  /**
   * Nur Dateien, deren Titel eins dieser Wörter trägt. Am 21.10.2026 fand
   * „Japan container ship" unter den ausgezeichneten Fotos einen Eisvogel –
   * die Suche trifft auch Beschreibung und Kategorien, der Titel nicht.
   */
  stichwoerter?: string[]
  /** Nur Firmenfotos, die die Marke zeigen (`MARKENBILD`). */
  marke?: boolean
  /**
   * Nur aus den ausgezeichneten Fotos von Commons („Quality images"). Für
   * alles, was keine Marke ist – dort entscheidet die Ästhetik, und die
   * prüft hier niemand außer der Auszeichnung.
   */
  nurAusgezeichnet?: boolean
  /**
   * Ein Mensch im Amt, bei einem öffentlichen Auftritt – Pressekonferenz,
   * Rede, Treffen. Dafür gelten „conference" und „meeting" nicht als
   * Ausschluss, und der Commons-Hinweis auf Persönlichkeitsrechte auch
   * nicht: Er betrifft Werbung, nicht die Nachricht über ein Amt.
   */
  person?: boolean
}

/** Die tragenden Wörter eines Suchbegriffs – ab vier Buchstaben. */
function stichwoerterVon(begriff: string): string[] {
  return begriff
    .split(/[\s.]+/)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length >= 4)
}

/** Die Suchen für eine Kachel, die genaueste zuerst. */
/**
 * Wahrzeichen und Institutionen je Land – das Bild zu einer Meldung über ein
 * Land, wenn ihr Motiv allgemein ist (Geld, Börse, Konsum, Tresor). Am
 * 22.10.2026 bekam „UK-Inflation auf 3,5 %" statt der Bank of England
 * Wasserbüffel am Mekong.
 */
export const WAHRZEICHEN: Record<string, string[]> = {
  'United Kingdom': ['Bank of England', 'Palace of Westminster', 'Tower Bridge'],
  'United States': ['United States Capitol', 'New York Stock Exchange'],
  France: ['Eiffel Tower', 'Arc de Triomphe', 'Palais Bourbon'],
  Germany: ['Reichstag building', 'Brandenburg Gate', 'Deutsche Bundesbank'],
  Japan: ['Tokyo Tower', 'Bank of Japan', 'Mount Fuji'],
  China: ['Shanghai Lujiazui', 'Forbidden City', 'Great Wall of China'],
  India: ['Bombay Stock Exchange', 'Gateway of India'],
  Italy: ['Colosseum', 'Palazzo Montecitorio'],
  Spain: ['Puerta de Alcalá', 'Plaza Mayor Madrid'],
  Switzerland: ['Federal Palace of Switzerland', 'Paradeplatz Zurich'],
}

/**
 * Wer die Notenbank führt – als Kategorie auf Commons, nicht als Name.
 *
 * Betreiber, 22.10.2026, zur Bank of England als Gebäude: „das kennt man
 * nicht mal. Dort gibt es … einen Head of the Zentralbank, der bestimmt mal
 * gesprochen hat mit Fahnen im Hintergrund." Bei Inflation und Zins zeigt
 * die Kachel den Menschen, der entscheidet – nicht seine Fassade.
 *
 * Die Kategorie, weil der Name nicht reicht: „Andrew Bailey" fand am selben
 * Tag zuerst einen Baseballspieler der Boston Red Sox. Gesucht wird mit
 * `deepcat:`, denn die Fotos liegen oft in Unterkategorien („… by year").
 *
 * Stand 22.10.2026; ein Wechsel im Amt gehört hier nachgetragen.
 */
export const NOTENBANKCHEFS: Record<string, string> = {
  'United Kingdom': 'Andrew Bailey (banker)',
  'United States': 'Kevin Warsh',
  'Euro area': 'Christine Lagarde',
  Japan: 'Kazuo Ueda',
}

/** Worum es bei einer Notenbank geht – in Überschrift oder Text. */
const GELDPOLITIK =
  /Inflation|Teuerung|Zins|Notenbank|Zentralbank|\bEZB\b|\bFed\b|Bank of England|Bank of Japan|\bBoE\b|\bBoJ\b/u

/** Das Land einer Notenbank-Meldung; die EZB und der Euroraum zählen als eins. */
function notenbankLand(inhalt: string): string | undefined {
  if (/\bEZB\b|Euroraum|Eurozone/u.test(inhalt)) return 'Euro area'
  if (/\bFed\b/u.test(inhalt)) return 'United States'
  if (/Bank of England|\bBoE\b/u.test(inhalt)) return 'United Kingdom'
  if (/Bank of Japan|\bBoJ\b/u.test(inhalt)) return 'Japan'
  return LAENDER.find(([muster]) => muster.test(inhalt))?.[1]
}

/** Allgemeine Motive – für sie zählt ein Land mehr als das Motiv. */
const ALLGEMEIN = new Set(['euro', 'boerse', 'konsum', 'tresor'])

/** Was ein Firmenfoto zeigen muss: die Marke, nicht ein Produkt im Labor. */
export const MARKENBILD =
  /\b(logo|sign|signage|headquarters|hq|head office|building|office|campus|store|shop|tower|zentrale|hauptsitz)\b/i

/**
 * Themen, die ein allgemeines Motiv nicht trifft – mit dem Bild, das sie
 * zeigen müssen.
 *
 * Am 28.10.2026 hielt die Bildprüfung den Beitrag dreimal an: „IG Metall
 * lehnt ab" bekam einen Banktresor, „Kredite für Firmen strenger" einen
 * Einkaufswagen, „Dax-Aktien: Handel 24/7" die New Yorker Börse. Keins der
 * drei Themen hatte ein eigenes Motiv; die Suche lief deshalb mit den
 * Begriffen des Rückfalls („bank vault", „shopping cart") und fand genau
 * das. Ein Stichwort in Überschrift oder Text geht deshalb vor dem Motiv –
 * und `mussEnthalten` hält den Titel der Datei am Thema.
 */
export const THEMENSUCHE: {
  muster: RegExp
  begriffe: string[]
  mussEnthalten: string
}[] = [
  {
    muster: /IG Metall|Warnstreik|Gewerkschaft|\bVerdi\b|Tarifrunde|Tarifverhandlung/u,
    begriffe: ['IG Metall Warnstreik', 'Warnstreik', 'IG Metall'],
    mussEnthalten: 'streik',
  },
  {
    muster:
      /(?<![\p{L}])(?:Dax|MDax|SDax|TecDax|Xetra|Deutsche Börse|Frankfurter Börse)(?![\p{L}])/iu,
    begriffe: ['Frankfurt Stock Exchange', 'Börse Frankfurt'],
    mussEnthalten: 'frankfurt',
  },
  {
    muster:
      /Bundesbank|Deutsche[nr]? Banken|Kreditrichtlinie|Kreditvergabe|Kredite für Firmen/u,
    begriffe: ['Deutsche Bundesbank Frankfurt', 'Bankenviertel Frankfurt'],
    mussEnthalten: 'bank',
  },
  /*
    Israel (29.10.2026): „Israel-Wahl: Börse -3%" fand nichts und bekam das
    feste Motiv – Euro-Scheine für den Schekel, acht Reparaturen lang. Die
    Börse Tel Aviv trägt ihren Namen am Gebäude und auf der Kurstafel.
  */
  {
    muster: /Israel|Tel Aviv|Schekel|\bTA-35\b/u,
    begriffe: ['Tel Aviv Stock Exchange', 'Tel Aviv skyline'],
    mussEnthalten: 'tel aviv',
  },
]

export function suchenFuer(titel: string, motiv: string, text = ''): Suche[] {
  const liste: Suche[] = []
  const firma = unternehmenIn(titel)
  /*
    Bildsprache wie Trade Republic und HKCM (Betreiber, 21.10.2026): bei
    einem Unternehmen zuerst die Marke – Logo, Schild, Schriftzug am
    Gebäude –, dann der Firmensitz. Am 21.10. trugen „Netflix 2018" (Logo
    auf dem Telefon) und „GoogleTorontoOffice4" (Schriftzug) die Kacheln.
  */
  /*
    Nur die Marke, nie der bloße Name: „Qiagen" allein fand am 22.10.2026 ein
    graues Laborgerät. Ohne Logo, Schild oder Sitz kein Firmenbild.
  */
  if (firma) {
    for (const b of [
      `${firma} logo`,
      `${firma} sign`,
      `${firma} headquarters`,
      `${firma} building`,
    ])
      liste.push({ begriff: b, mussEnthalten: firma, marke: true })
  }
  /*
    Das Thema vor dem Motiv – siehe `THEMENSUCHE`. Aus der Überschrift geht
    es auch dem Notenbankchef vor, aus dem Text nur dem Motiv: „Zinsentscheid
    heute" mit „Dax" im Text bleibt beim Fed-Chef (28.10.2026).
  */
  const themaTitel = THEMENSUCHE.find((t) => t.muster.test(titel))
  const themaText = themaTitel ? undefined : THEMENSUCHE.find((t) => t.muster.test(text))
  const themaSuchen = (t: (typeof THEMENSUCHE)[number] | undefined) =>
    (t?.begriffe ?? []).map((b) => ({ begriff: b, mussEnthalten: t!.mussEnthalten }))
  liste.push(...themaSuchen(themaTitel))
  /* Bei Inflation und Zins: der Notenbankchef am Pult – Name im Dateititel. */
  if (GELDPOLITIK.test(`${titel} ${text}`)) {
    const bank = notenbankLand(titel) ?? notenbankLand(text)
    const kategorie = bank && NOTENBANKCHEFS[bank]
    if (kategorie)
      for (const b of ['press conference', 'speech', ''])
        liste.push({
          begriff: `${b} deepcat:"${kategorie}"`.trim(),
          person: true,
        })
  }
  liste.push(...themaSuchen(themaText))
  const land = LAENDER.find(([muster]) => muster.test(titel))?.[1]
  const begriffe = SUCHE[motiv] ?? SUCHE.boerse
  if (land && ALLGEMEIN.has(motiv))
    for (const w of WAHRZEICHEN[land] ?? [])
      liste.push({ begriff: w, stichwoerter: stichwoerterVon(w), nurAusgezeichnet: true })
  if (land)
    for (const b of begriffe)
      liste.push({
        begriff: `${land} ${b}`,
        stichwoerter: stichwoerterVon(b),
        nurAusgezeichnet: true,
      })
  for (const b of begriffe)
    liste.push({ begriff: b, stichwoerter: stichwoerterVon(b), nurAusgezeichnet: true })
  return liste
}

/** Was Commons über eine Datei liefert – das, was hier zählt. */
export interface Kandidat {
  titel: string
  breite: number
  hoehe: number
  lizenz: string
  einschraenkung: string
}

/*
  Frei heißt: gemeinfrei, CC0, CC BY, CC BY-SA. Nicht: NC (nicht kommerziell
  – der Kanal wirbt für die Website), ND (keine Bearbeitung – der Zuschnitt
  ist eine), GFDL allein (verlangt den ganzen Lizenztext).
*/
const FREI = /^(Public domain|CC0|PD\b|PDM|CC BY(-SA)? \d)/i

/** Braucht die Lizenz eine Nennung? Gemeinfrei und CC0 nicht. */
export function nennungNoetig(lizenz: string): boolean {
  return /^CC BY/i.test(lizenz.trim())
}

/**
 * Die Nennung unter dem Beitrag – je Foto mit CC-BY-Lizenz Urheber, Quelle
 * und Lizenz, wie die Lizenz es verlangt. Leer, wenn keins eine braucht.
 */
export function bildnachweis(datum: string, register = leseRegister()): string {
  const noetig = (register[datum] ?? []).filter((b) => nennungNoetig(b.lizenz))
  if (!noetig.length) return ''
  return [
    'Fotos (Wikimedia Commons):',
    ...noetig.map((b) => `Seite ${b.stelle}: ${b.urheber.slice(0, 60)}, ${b.lizenz}`),
  ].join('\n')
}

/*
  Was kein Foto zum Thema ist. Am 21.10.2026 fand der erste Lauf einen
  Stadtplan von Paris, ein Netflix-Diagramm und eine Gruppenaufnahme vor
  dem Googleplex – alle frei, alle quer, alle falsch.
*/
const KEIN_FOTO = new RegExp(
  '\\b(' +
    [
      'map',
      'karte',
      'plan',
      'diagram',
      'diagramm',
      'chart',
      'graph',
      'grafik',
      'logo',
      'poster',
      'stamp',
      'briefmarke',
      'coat of arms',
      'wappen',
      'seal',
      'document',
      'page',
      'p\\d+',
      'scan',
      'tabloid',
      'newspaper',
      'zeitung',
      'students',
      'visit',
      'visiting',
      'team',
      'group',
      'portrait',
      'screenshot',
      'cartoon',
      'caricature',
      'drawing',
      'painting',
      'illustration',
      'engraving',
      'lithograph',
      'postcard',
      'tittar',
      'andel',
      'statistics',
      'infographic',
      'bedroom',
      'couch',
      'hotel room',
      'apartment interior',
      'handshake',
      'hands shaking',
      'bribe',
      'bribery',
      'corruption',
      'crime',
      'bandit',
      /* Ereignisse statt Orte: Olympia-Ringe am Eiffelturm (24. und 26.10.2026). */
      'olympic',
      'olympics',
      'olympia',
      'sign language',
      'manual alphabet',
    ].join('|') +
    ')\\b',
  'i'
)

/** Bei Dingen ein Ausschluss, bei einem Menschen im Amt gerade das Bild. */
const KEIN_SACHFOTO = /\b(meeting|conference)\b/i

/**
 * Der Kern eines Dateititels – ohne Klammerzusatz, Endung und Zählnummer.
 * „Euro coins and banknotes (cropped).jpg" und „Euro coins and
 * banknotes.jpg" sind dasselbe Foto (21.10.2026).
 */
export function kern(titel: string): string {
  return titel
    .toLowerCase()
    .replace(/^file:/, '')
    .replace(/\.[a-z]+$/, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/[\s_-]*\d+$/, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/** Taugt die Datei? – frei, Querformat, groß genug, unbelastet, neu. */
export function taugt(
  k: Kandidat,
  verwendet: Set<string>,
  mussEnthalten?: string,
  stichwoerter?: string[],
  person = false
): boolean {
  if (verwendet.has(k.titel)) return false
  const kerne = new Set([...verwendet].map(kern))
  if (kerne.has(kern(k.titel))) return false
  if (
    /*
      Jedes Wort, als ganzes Wort: „piggy bank" fand am 22.10.2026 mit
      „irgendein Wort" einen Flusslauf – „river bank".
    */
    stichwoerter?.length &&
    !stichwoerter.every((w) =>
      new RegExp(`(?<![\\p{L}])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'iu').test(
        k.titel
      )
    )
  )
    return false
  if (!FREI.test(k.lizenz.trim())) return false
  const einschraenkung = person
    ? k.einschraenkung.replace(/personality/gi, '')
    : k.einschraenkung
  if (einschraenkung.replace(/[\s|,]+/g, '').length) return false
  if (k.breite < 1200 || k.breite / k.hoehe < 1.25) return false
  if (!/\.jpe?g$/i.test(k.titel)) return false
  if (KEIN_FOTO.test(k.titel)) return false
  if (!person && KEIN_SACHFOTO.test(k.titel)) return false
  if (mussEnthalten && !k.titel.toLowerCase().includes(mussEnthalten.toLowerCase()))
    return false
  return true
}
