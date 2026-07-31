import { groesserRueckschlag, type Rueckschlag } from './depot-simulation.ts'

/**
 * Was ein Jahr an den Märkten gebracht hat – gerechnet, nicht erzählt.
 *
 * ## Wofür
 *
 * Ein Jahresrückblick ist die Textgattung, in der am meisten behauptet und am
 * wenigsten nachgesehen wird. „Das Jahr der Rohstoffe“, „ein verlorenes Jahr
 * für Anleger“ – Sätze, die eine Zahl ersetzen sollen und es nicht können.
 *
 * Hier steht deshalb nichts, was nicht aus den gespeicherten Kursreihen fällt:
 * die Veränderung vom letzten Schlusskurs des Vorjahres bis zum letzten
 * Schlusskurs des Jahres, das Hoch, das Tief, der größte Rückschlag unterwegs.
 * Dazu die eigenen Artikel des Archivs aus demselben Jahr – als Beleg dafür,
 * was zu welcher Zeit Thema war, und nicht als Nacherzählung.
 *
 * ## Der Bezugspunkt ist der letzte Kurs des Vorjahres
 *
 * Nicht der erste des Jahres. Zwischen dem 31. Dezember und dem ersten
 * Handelstag liegt eine Kurslücke, und wer vom ersten Kurs des Jahres aus
 * rechnet, lässt sie unter den Tisch fallen. Sie gehört zum Jahr: Wer am
 * Silvesterabend investiert war, hat sie erlebt.
 *
 * Daraus folgt: **Ein Jahr ohne Vorjahresschluss ist nicht rechenbar.** Die
 * Momentaufnahme beginnt im August 2021; für 2021 gibt es deshalb keine
 * Bilanz, und sie wird auch nicht aus dem ersten vorhandenen Kurs
 * zusammengeschätzt.
 *
 * ## Das laufende Jahr ist keine Jahresbilanz
 *
 * Es steht trotzdem hier – aber `vollesJahr` sagt es, und die Seite muss es
 * hinschreiben. Eine Veränderung über sieben Monate als Jahresrendite
 * auszuweisen ist derselbe Fehler wie eine Vierteljahreszahl hochzurechnen,
 * nur unauffälliger.
 *
 * ## Die Auflösung ist nicht in allen Jahren gleich
 *
 * Die Momentaufnahme trägt für zurückliegende Jahre Wochenschlusskurse und
 * erst seit Mitte 2025 Tageskurse. Auf Wochenwerten fällt jeder Rückschlag
 * kleiner aus, der innerhalb einer Woche begann und endete – gemessen wird ja
 * nur freitags. Deshalb steht `punkteJeMonat` in jeder Bilanz: Die Zahl
 * unterscheidet ein Jahr aus zweiundfünfzig Werten von einem aus
 * zweihundertfünfzig, und ohne sie sähen beide gleich belastbar aus.
 *
 * Ohne Laufzeitimporte außer dem Rückschlag, damit `tests/` das Modul direkt
 * laden kann.
 */

export type { Rueckschlag }

/** Ein Punkt einer Kursreihe, wie ihn die Momentaufnahme führt. */
export interface Kurspunkt {
  /** Handelstag, `JJJJ-MM-TT`. */
  d: string
  /** Schlusskurs. */
  c: number
}

export interface Jahresbilanz {
  jahr: number
  /** Letzter Handelstag **vor** dem Jahr – der Bezugspunkt. */
  basisTag: string
  basisKurs: number
  /** Letzter Handelstag im Jahr, für den ein Kurs vorliegt. */
  endeTag: string
  endeKurs: number
  /** Veränderung vom Basis- zum Endkurs in Prozent. */
  prozent: number
  hoch: Kurspunkt
  tief: Kurspunkt
  /** Der tiefste Rückgang vom jeweils höchsten bis dahin erreichten Stand. */
  rueckschlag: Rueckschlag | null
  /** Wie viele Kurspunkte das Jahr trägt. */
  punkte: number
  /**
   * Punkte je Monat, gerundet. Zwanzig heißt Tageskurse, vier heißt
   * Wochenkurse – und das ändert, wie belastbar der Rückschlag ist.
   */
  punkteJeMonat: number
  /**
   * Ob die Reihe bis ans Jahresende reicht.
   *
   * Bewusst als Aussage über die **Daten** und nicht über den Kalender: Ein
   * fehlender Dezember sieht in der Rechnung genauso aus, ob das Jahr noch
   * läuft oder ob der Abruf ausgesetzt hat. Beide Male ist `prozent` keine
   * Jahresrendite, und beide Male muss es dabeistehen.
   */
  vollesJahr: boolean
}

export interface Monatsschritt {
  /** 1 bis 12. */
  monat: number
  /** Veränderung gegenüber dem letzten Kurs des Vormonats, in Prozent. */
  prozent: number
}

/** Der letzte Punkt der Reihe, dessen Tag vor `grenze` liegt. */
function letzterVor(punkte: readonly Kurspunkt[], grenze: string): Kurspunkt | null {
  let treffer: Kurspunkt | null = null
  for (const punkt of punkte) {
    if (punkt.d >= grenze) break
    if (punkt.c > 0) treffer = punkt
  }
  return treffer
}

/**
 * Die Bilanz eines Jahres aus einer Kursreihe.
 *
 * `null`, wenn das Jahr keinen Kurs trägt oder kein Kurs aus dem Vorjahr
 * vorliegt. Die Reihe muss aufsteigend nach Tag sortiert sein – so kommt sie
 * aus der Momentaufnahme.
 */
export function bilanz(punkte: readonly Kurspunkt[], jahr: number): Jahresbilanz | null {
  const anfang = `${jahr}-01-01`
  const nachher = `${jahr + 1}-01-01`

  const basis = letzterVor(punkte, anfang)
  if (!basis || basis.c <= 0) return null

  const imJahr = punkte.filter((p) => p.d >= anfang && p.d < nachher && p.c > 0)
  if (imJahr.length === 0) return null

  const ende = imJahr[imJahr.length - 1]

  let hoch = imJahr[0]
  let tief = imJahr[0]
  for (const punkt of imJahr) {
    if (punkt.c > hoch.c) hoch = punkt
    if (punkt.c < tief.c) tief = punkt
  }

  /*
    Der Rückschlag wird über das Jahr gemessen und beginnt beim ersten Kurs des
    Jahres, nicht beim Vorjahresschluss. Sonst zählte ein Absturz über den
    Jahreswechsel doppelt: einmal im alten Jahr, einmal im neuen.
  */
  const rueckschlag = groesserRueckschlag(imJahr.map((p) => ({ d: p.d, wert: p.c })))

  /* Monate zwischen erstem und letztem Punkt, beide mitgezählt. */
  const monate = Math.max(
    1,
    Number(ende.d.slice(5, 7)) - Number(imJahr[0].d.slice(5, 7)) + 1
  )

  return {
    jahr,
    basisTag: basis.d,
    basisKurs: basis.c,
    endeTag: ende.d,
    endeKurs: ende.c,
    prozent: ((ende.c - basis.c) / basis.c) * 100,
    hoch,
    tief,
    rueckschlag,
    punkte: imJahr.length,
    punkteJeMonat: Math.round(imJahr.length / monate),
    vollesJahr: ende.d >= `${jahr}-12-15`,
  }
}

/**
 * Die Monatsschritte eines Jahres – je Monat die Veränderung gegenüber dem
 * letzten Kurs des Vormonats.
 *
 * Der Januar bezieht sich auf den Vorjahresschluss, damit die zwölf Schritte
 * lückenlos aneinander anschließen. Monate ohne Kurs fehlen; sie werden nicht
 * mit null gefüllt, denn null hieße „unverändert“ und nicht „unbekannt“.
 */
export function monatsschritte(
  punkte: readonly Kurspunkt[],
  jahr: number
): Monatsschritt[] {
  const anfang = `${jahr}-01-01`
  const basis = letzterVor(punkte, anfang)
  if (!basis || basis.c <= 0) return []

  /* Je Monat der letzte Kurs. */
  const letzter = new Map<number, number>()
  for (const punkt of punkte) {
    if (punkt.d < anfang || punkt.d >= `${jahr + 1}-01-01` || punkt.c <= 0) continue
    letzter.set(Number(punkt.d.slice(5, 7)), punkt.c)
  }

  const schritte: Monatsschritt[] = []
  let vorher = basis.c
  for (let monat = 1; monat <= 12; monat += 1) {
    const kurs = letzter.get(monat)
    if (kurs === undefined) continue
    schritte.push({ monat, prozent: ((kurs - vorher) / vorher) * 100 })
    vorher = kurs
  }
  return schritte
}

/**
 * Die Jahre, für die eine Bilanz überhaupt möglich ist – jüngstes zuerst.
 *
 * Das erste Jahr der Reihe fällt heraus, weil ihm der Vorjahresschluss fehlt.
 */
export function rechenbareJahre(punkte: readonly Kurspunkt[]): number[] {
  const jahre = new Set<number>()
  for (const punkt of punkte) {
    if (punkt.c > 0) jahre.add(Number(punkt.d.slice(0, 4)))
  }
  const sortiert = [...jahre].sort((a, b) => a - b)
  return sortiert.slice(1).reverse()
}

/* ------------------------------------------------------------- Das Archiv */

/** Was der Rückblick von einem Artikel braucht. */
export interface Archiveintrag {
  slug: string
  title: string
  /** ISO 8601 mit Zeitzone. */
  publishedAt: string
  category: string
}

export interface Archivmonat {
  /** 1 bis 12. */
  monat: number
  artikel: Archiveintrag[]
}

/**
 * Der Kalendertag eines Artikels in der Zone, in der er erschienen ist.
 *
 * Dieselbe Regel wie `tagVon()` in `lib/news.ts` und aus demselben Grund: Ein
 * Umweg über `new Date` verschöbe einen Artikel vom 1. Januar 02:00 Uhr MEZ in
 * den 31. Dezember – und damit in den Rückblick des falschen Jahres.
 */
export function tagVon(publishedAt: string): string {
  return publishedAt.slice(0, 10)
}

/**
 * Die Artikel eines Jahres, nach Monat gruppiert, jüngster Monat zuerst.
 *
 * Monate ohne Artikel fehlen. Innerhalb eines Monats steht der jüngste vorn.
 */
export function archivJeMonat(
  artikel: readonly Archiveintrag[],
  jahr: number
): Archivmonat[] {
  const nachMonat = new Map<number, Archiveintrag[]>()
  for (const eintrag of artikel) {
    const tag = tagVon(eintrag.publishedAt)
    if (Number(tag.slice(0, 4)) !== jahr) continue
    const monat = Number(tag.slice(5, 7))
    const liste = nachMonat.get(monat)
    if (liste) liste.push(eintrag)
    else nachMonat.set(monat, [eintrag])
  }

  return [...nachMonat.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([monat, liste]) => ({
      monat,
      artikel: [...liste].sort((a, b) =>
        a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0
      ),
    }))
}

export interface Archivabdeckung {
  /** Wie viele Monate des Jahres mindestens einen Artikel tragen. */
  monateMitArtikeln: number
  /**
   * Wie viele Monate des Jahres überhaupt vergangen sind – bei einem laufenden
   * Jahr weniger als zwölf. Ohne diese Zahl sähe ein Julirückblick mit sieben
   * abgedeckten Monaten aus wie ein halb leeres Jahr.
   */
  monateVergangen: number
  gesamtzahl: number
  /** Erster und letzter Artikeltag des Jahres – `null` ohne Artikel. */
  vonTag: string | null
  bisTag: string | null
}

/**
 * Wie weit das eigene Archiv das Jahr überhaupt trägt.
 *
 * Diese Zahlen gehören auf die Seite, nicht in eine Fußnote. Ein Rückblick,
 * der zwölf Monate Markt gegen einen Monat eigener Artikel stellt, ist kein
 * falscher Rückblick – aber einer, dessen Beleglage der Leser kennen muss.
 */
export function archivabdeckung(
  artikel: readonly Archiveintrag[],
  jahr: number,
  heute: string
): Archivabdeckung {
  const tage = artikel
    .map((a) => tagVon(a.publishedAt))
    .filter((t) => Number(t.slice(0, 4)) === jahr)
    .sort()

  const monate = new Set(tage.map((t) => Number(t.slice(5, 7))))

  const jahrHeute = Number(heute.slice(0, 4))
  const monateVergangen =
    jahrHeute > jahr ? 12 : jahrHeute < jahr ? 0 : Number(heute.slice(5, 7))

  return {
    monateMitArtikeln: monate.size,
    monateVergangen,
    gesamtzahl: tage.length,
    vonTag: tage[0] ?? null,
    bisTag: tage[tage.length - 1] ?? null,
  }
}

/** Die deutschen Monatsnamen, Index 1 bis 12. */
export const MONATSNAMEN = [
  '',
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const

/**
 * Zahlwörter bis zwölf, darüber die Ziffern.
 *
 * Zwölf, weil das die Zahl der beobachteten Märkte und die der Monate ist –
 * beide Sätze, in denen diese Wörter vorkommen, bleiben damit ausgeschrieben.
 */
const ZAHLWORT = [
  'kein',
  'ein',
  'zwei',
  'drei',
  'vier',
  'fünf',
  'sechs',
  'sieben',
  'acht',
  'neun',
  'zehn',
  'elf',
  'zwölf',
] as const

/**
 * Kleine Zahlen als Wort, große als Ziffer.
 *
 * Exportiert, weil die Seiten denselben Bruch brauchen: „Artikel aus 1 von 7
 * Monaten" liest sich wie ein Formular, „aus einem von sieben Monaten" wie ein
 * Satz. Die Grenze bei zwölf ist keine Typografieregel, sondern die Länge der
 * Liste oben – darüber wird es unleserlich, nicht falsch.
 */
export function zahlwort(n: number): string {
  return n >= 0 && n < ZAHLWORT.length ? ZAHLWORT[n] : String(n)
}

/**
 * Dasselbe im Dativ – „aus **einem** von sieben Monaten".
 *
 * Nur die Eins beugt sich; zwei bis zwölf stehen unverändert. Eine eigene
 * Funktion und keine Bedingung an der Aufrufstelle, weil der Satz an zwei
 * Stellen steht und dort zweimal „aus ein von sieben Monaten" stand.
 */
export function zahlwortDativ(n: number): string {
  return n === 1 ? 'einem' : zahlwort(n)
}

/**
 * Ein Satz über die Verteilung eines Jahres: wie viele Märkte im Plus stehen.
 *
 * Gerechnet und nicht geschrieben, weil jeder Jahrgang diesen Satz braucht und
 * niemand ihn nachträglich pflegt. Genau Null wird als unverändert gezählt und
 * nicht dem Plus zugeschlagen – bei einem Wechselkurs kommt das vor.
 */
export function bilanzsatz(prozente: readonly number[]): string {
  const gesamt = prozente.length
  if (gesamt === 0) return 'Für dieses Jahr liegen keine Kursreihen vor.'

  const plus = prozente.filter((p) => p > 0).length
  const minus = prozente.filter((p) => p < 0).length
  const gleich = gesamt - plus - minus

  const teile: string[] = []
  if (plus > 0) teile.push(`${zahlwort(plus)} im Plus`)
  if (minus > 0) teile.push(`${zahlwort(minus)} im Minus`)
  if (gleich > 0) teile.push(`${zahlwort(gleich)} unverändert`)

  const aufzaehlung =
    teile.length === 1
      ? teile[0]
      : `${teile.slice(0, -1).join(', ')} und ${teile[teile.length - 1]}`

  return `Von ${zahlwort(gesamt)} beobachteten Märkten stehen ${aufzaehlung}.`
}

/**
 * Die stärkste und die schwächste Bewegung einer Liste von Bilanzen.
 *
 * `null` bei leerer Liste. Bei Gleichstand gewinnt der erste Eintrag – die
 * Reihenfolge der Liste ist damit Teil der Aussage und deshalb im Aufrufer
 * festgelegt, nicht hier.
 */
export function raender(bilanzen: readonly { symbol: string; bilanz: Jahresbilanz }[]): {
  staerkste: { symbol: string; bilanz: Jahresbilanz }
  schwaechste: { symbol: string; bilanz: Jahresbilanz }
  tiefster: { symbol: string; bilanz: Jahresbilanz }
} | null {
  if (bilanzen.length === 0) return null

  let staerkste = bilanzen[0]
  let schwaechste = bilanzen[0]
  let tiefster = bilanzen[0]

  for (const eintrag of bilanzen) {
    if (eintrag.bilanz.prozent > staerkste.bilanz.prozent) staerkste = eintrag
    if (eintrag.bilanz.prozent < schwaechste.bilanz.prozent) schwaechste = eintrag
    const jetzt = eintrag.bilanz.rueckschlag?.prozent ?? 0
    const bisher = tiefster.bilanz.rueckschlag?.prozent ?? 0
    if (jetzt < bisher) tiefster = eintrag
  }

  return { staerkste, schwaechste, tiefster }
}
