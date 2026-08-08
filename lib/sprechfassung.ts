/**
 * Die Sprechfassung: aus einer Tagesausgabe wird eine Podcastfolge.
 *
 * ## Woher die Regeln kommen
 *
 * Bis August 2026 entstand der tägliche Podcast „Börse am Morgen“ von Hand:
 * Zusammenfassung im Chat, Vertonung bei ElevenLabs, Hochladen. Die
 * Arbeitsanweisung dieses Ablaufs ist hier Zeile für Zeile übernommen –
 * fester Einstieg und Abschluss, Freitagsvariante, Fazit-Absatz,
 * ausgeschriebene Zahlen, 710 bis 740 Wörter, Folgennummer ab dem
 * 30. Juli 2026.
 *
 * ## Warum die Quelle die Tagesausgabe ist und nicht die Website
 *
 * Die alte Anweisung beschreibt drei Fehlerquellen beim Abruf von
 * iminvests.de: veraltete Zwischenspeicher, zu frühe Abrufzeiten und die
 * Verwechslung mit den automatischen Zahlen-Beiträgen. Alle drei entfallen,
 * wenn die Quelle `data/editions/JJJJ-MM-TT.ts` ist – dieselbe Datei, aus
 * der auch die Nachrichtenseite entsteht. Was dort steht, ist recherchiert,
 * geprüft und bereits veröffentlicht.
 *
 * ## Warum Zahlen ausgeschrieben werden
 *
 * Die KI-Stimme betont „26.364,00 Punkte“ falsch oder liest es englisch.
 * „sechsundzwanzigtausenddreihundertvierundsechzig Punkte“ kann sie nicht
 * missverstehen. Nachkommastellen werden Ziffer für Ziffer gesprochen, so
 * verlangt es die Vorlage: „null Komma acht eins Prozent“.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

import type { DailyEdition, EditionItem } from '@/data/editions/types'

/* ------------------------------------------------------------- Zahlwörter */

const EINER = [
  'null',
  'ein',
  'zwei',
  'drei',
  'vier',
  'fünf',
  'sechs',
  'sieben',
  'acht',
  'neun',
]
const ZEHN_BIS_NEUNZEHN = [
  'zehn',
  'elf',
  'zwölf',
  'dreizehn',
  'vierzehn',
  'fünfzehn',
  'sechzehn',
  'siebzehn',
  'achtzehn',
  'neunzehn',
]
const ZEHNER = [
  '',
  '',
  'zwanzig',
  'dreißig',
  'vierzig',
  'fünfzig',
  'sechzig',
  'siebzig',
  'achtzig',
  'neunzig',
]

/** Ganze Zahl bis unter eine Billion als deutsches Zahlwort. */
export function zahlwort(n: number): string {
  if (!Number.isFinite(n) || n < 0) return String(n)
  if (n === 0) return 'null'

  function bisTausend(rest: number): string {
    let wort = ''
    const hundert = Math.floor(rest / 100)
    const zehnerRest = rest % 100
    if (hundert > 0) wort += `${EINER[hundert]}hundert`
    if (zehnerRest === 0) return wort
    if (zehnerRest < 10) return wort + (zehnerRest === 1 ? 'eins' : EINER[zehnerRest])
    if (zehnerRest < 20) return wort + ZEHN_BIS_NEUNZEHN[zehnerRest - 10]
    const einerRest = zehnerRest % 10
    const zehnerWert = Math.floor(zehnerRest / 10)
    if (einerRest === 0) return wort + ZEHNER[zehnerWert]
    return wort + `${EINER[einerRest]}und${ZEHNER[zehnerWert]}`
  }

  const teile: string[] = []
  const milliarden = Math.floor(n / 1_000_000_000)
  const millionen = Math.floor((n % 1_000_000_000) / 1_000_000)
  const tausender = Math.floor((n % 1_000_000) / 1000)
  const rest = n % 1000

  if (milliarden === 1) teile.push('eine Milliarde ')
  else if (milliarden > 1) teile.push(`${bisTausend(milliarden)} Milliarden `)
  if (millionen === 1) teile.push('eine Million ')
  else if (millionen > 1) teile.push(`${bisTausend(millionen)} Millionen `)
  if (tausender === 1) teile.push('eintausend')
  else if (tausender > 1) teile.push(`${bisTausend(tausender)}tausend`)
  if (rest > 0) {
    /* Alleinstehende Eins heißt „eins“, im Verbund „ein“: „eintausendeins“. */
    if (teile.length === 0 && rest === 1) teile.push('eins')
    else teile.push(bisTausend(rest))
  }
  return teile.join('').trim()
}

/** Ordnungszahl für Monatstage: 1 → „erste“, 7 → „siebte“, 21 → „einundzwanzigste“. */
export function ordnungszahl(tag: number): string {
  const sonder: Record<number, string> = {
    1: 'erste',
    3: 'dritte',
    7: 'siebte',
    8: 'achte',
  }
  if (sonder[tag]) return sonder[tag]
  if (tag < 20) return `${zahlwort(tag)}te`
  return `${zahlwort(tag)}ste`
}

/* ----------------------------------------------------- Text sprechbar machen */

/**
 * Eine Zahl aus dem Fließtext in Sprechform: „26.364,45“ →
 * „sechsundzwanzigtausenddreihundertvierundsechzig Komma vier fünf“.
 */
function zahlAlsSprechform(ganz: string, nachkomma?: string): string {
  const wert = Number(ganz.replaceAll('.', ''))
  let wort = zahlwort(wert)
  if (nachkomma) {
    const ziffern = [...nachkomma]
      .map((z) =>
        z === '0' ? 'null' : EINER[Number(z)] === 'ein' ? 'eins' : EINER[Number(z)]
      )
      .join(' ')
    wort += ` Komma ${ziffern}`
  }
  return wort
}

/**
 * Macht einen geschriebenen Satz vorlesbar.
 *
 * Die Reihenfolge der Ersetzungen ist Absicht: Erst die festen Wendungen
 * („S&P 500“, Adressen, Uhrzeiten), dann Vorzeichen und Prozent, zuletzt die
 * nackten Zahlen – sonst zerlegt die Zahlregel eine Uhrzeit, bevor die
 * Uhrzeitregel sie sieht.
 */
export function sprechbar(text: string): string {
  let s = text

  s = s.replaceAll(/S&P[  ]?500/g, 'S und P fünfhundert')
  s = s.replaceAll(/\biminvests\.de\b/gi, 'iminvests punkt de')
  s = s.replaceAll(/\b(?:www\.)?([a-z0-9-]+)\.(de|com|net)\b/gi, '$1 punkt $2')

  /*
    Uhrzeiten: „07:04“ → „sieben Uhr vier“, „09:00“ → „neun Uhr“. Ein
    nachfolgendes „Uhr“ im Quelltext wird mitverbraucht – sonst stand im
    ersten Lauf „eins Uhr zweiundzwanzig Uhr“ da. Und ein Uhr heißt „ein“,
    nicht „eins“.
  */
  s = s.replaceAll(/\b(\d{1,2}):(\d{2})(\s*Uhr)?\b/g, (_, h: string, m: string) => {
    const stunde = Number(h) === 1 ? 'ein' : zahlwort(Number(h))
    const minute = Number(m)
    return minute === 0 ? `${stunde} Uhr` : `${stunde} Uhr ${zahlwort(minute)}`
  })

  /* Datumsangaben: „der 7. August“ → „der siebte August“ – vor der Zahlregel,
     die sonst „der sieben. August“ daraus machte. */
  s = s.replaceAll(
    /\b(\d{1,2})\.\s*(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)/g,
    (_, t: string, monat: string) => `${ordnungszahl(Number(t))} ${monat}`
  )

  /* Klammern sind in der Sprechfassung verboten – sie werden zu Einschüben. */
  s = s.replaceAll(/\s*\(([^)]*)\)/g, ', $1,')

  /* Vorzeichen vor Zahlen. */
  s = s.replaceAll(/([+−-])(\d)/g, (_, z: string, d: string) =>
    z === '+' ? `plus ${d}` : `minus ${d}`
  )

  /* Prozentzeichen, bevor die Zahl davor umgeschrieben wird. */
  s = s.replaceAll(/\s*%/g, ' Prozent')

  /* Zahlen mit Tausenderpunkt und/oder Dezimalkomma. */
  s = s.replaceAll(
    /\b(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?\b/g,
    (_, ganz: string, nachkomma?: string) => zahlAlsSprechform(ganz, nachkomma)
  )

  /* Aufräumen: doppelte Kommas und Leerzeichen aus der Klammerersetzung. */
  s = s.replaceAll(/,\s*,/g, ',').replaceAll(/\s{2,}/g, ' ')
  s = s.replaceAll(/,\s*\./g, '.').replaceAll('**', '')
  return s.trim()
}

/* ----------------------------------------------------------- Die Folge */

const WOCHENTAGE = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
]
const MONATE = [
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
]

/** Der Kalendertag einer Ausgabe, ohne Umweg über die Zeitzone. */
function zerlegeDatum(date: string): {
  jahr: number
  monat: number
  tag: number
  wochentag: number
} {
  const [jahr, monat, tag] = date.split('-').map(Number)
  /* Zeller-frei: UTC-Mittag vermeidet jede Zeitzonenverschiebung. */
  const wochentag = new Date(Date.UTC(jahr, monat - 1, tag, 12)).getUTCDay()
  return { jahr, monat, tag, wochentag }
}

/**
 * Folgennummer: Werktage seit dem 30. Juli 2026, dem Tag der ersten Folge.
 *
 * Die Zählung stammt aus der alten Arbeitsanweisung – 30.07. ist Folge 1,
 * 07.08. ist Folge 7 – und genau das ist die Zahl der Werktage im Zeitraum.
 */
export function folgennummer(date: string): number {
  const start = Date.UTC(2026, 6, 30, 12)
  const ziel = (() => {
    const { jahr, monat, tag } = zerlegeDatum(date)
    return Date.UTC(jahr, monat - 1, tag, 12)
  })()
  let nummer = 0
  for (let t = start; t <= ziel; t += 86_400_000) {
    const wt = new Date(t).getUTCDay()
    if (wt !== 0 && wt !== 6) nummer += 1
  }
  return nummer
}

/*
  Wörter, auf denen eine gekürzte Überschrift nicht enden darf. Der erste
  Lauf lieferte „Trump erwägt laut Medienberichten erneut die“ – gekürzt an
  der Längengrenze, mitten im Satzglied. Abgeschnitten wird deshalb wortweise,
  und Artikel, Präpositionen und Hilfsverben am Ende fallen mit.
*/
const KEIN_SCHLUSSWORT = new Set([
  'der',
  'die',
  'das',
  'den',
  'dem',
  'des',
  'ein',
  'eine',
  'einen',
  'einem',
  'und',
  'oder',
  'auf',
  'von',
  'vom',
  'für',
  'mit',
  'in',
  'im',
  'an',
  'am',
  'zu',
  'zum',
  'zur',
  'nach',
  'über',
  'unter',
  'erwägt',
  'schickt',
  'laut',
  'erneut',
  'ist',
  'sind',
  'wird',
  'werden',
  'hat',
  'haben',
  'seine',
  'ihre',
])

/** Kürzt eine Überschrift auf ihren Kern – für Titelzeile und Kapitel. */
function kernDerUeberschrift(headline: string, maxLaenge = 44): string {
  /* Am ersten Doppelpunkt, Gedankenstrich oder Komma endet der Kern. */
  let kern = headline.split(/[:–—,]/)[0].trim()
  if (kern.length > maxLaenge) {
    const woerter = kern.split(' ')
    kern = ''
    for (const wort of woerter) {
      if ((kern + ' ' + wort).trim().length > maxLaenge) break
      kern = (kern + ' ' + wort).trim()
    }
  }
  const teile = kern.split(' ')
  while (teile.length > 1 && KEIN_SCHLUSSWORT.has(teile.at(-1)!.toLowerCase())) {
    teile.pop()
  }
  /* Titel dürfen laut Vorlage keine Gedankenstriche und Sonderzeichen tragen. */
  return teile
    .join(' ')
    .replaceAll(/[„“"«»]/g, '')
    .trim()
}

/** Reiht Kerne zu „A, B und C“ – und lässt den dritten weg, wenn es zu lang wird. */
function alsAufzaehlung(kerne: string[], maxGesamt = 100): string {
  let auswahl = kerne.filter(Boolean)
  while (auswahl.length > 2 && auswahl.join(', ').length > maxGesamt) {
    auswahl = auswahl.slice(0, -1)
  }
  if (auswahl.length <= 1) return auswahl[0] ?? ''
  return `${auswahl.slice(0, -1).join(', ')} und ${auswahl.at(-1)}`
}

export interface Podcastfolge {
  datum: string
  nummer: number
  titel: string
  sprechtext: string
  wortzahl: number
  /** Kapitelnamen in Reihenfolge – die Zeiten kommen erst aus der Audiodatei. */
  kapitel: string[]
  /** Beschreibung ohne Kapitelzeiten; `(0:00)`-Zeilen fügt der Läufer ein. */
  beschreibung: string
  hashtags: string
}

const WORTZIEL_MIN = 710
const WORTZIEL_MAX = 740

/**
 * Der KI-Hinweis, wie er unter jeder Folge steht.
 *
 * Vom Betreiber wörtlich vorgegeben und deshalb hier als Konstante: Er steht
 * an zwei Stellen – unter der einzelnen Folge und, sinngemäß, in der
 * Kanalbeschreibung des Feeds (`scripts/podcast-feed-schreiben.ts`). Zwei
 * verschiedene Angaben zur selben Sache wären schlimmer als gar keine.
 *
 * **Der Satz enthält eine Zusage, die die Technik nicht einhalten kann.**
 * „Vor der Veröffentlichung von einem Menschen inhaltlich geprüft“ trifft auf
 * die Kette nicht zu: `podcast-erzeugen.yml` schreibt, vertont und
 * veröffentlicht ohne Halt dazwischen. Wer den Satz stehen lässt, muss die
 * Folge morgens tatsächlich vor der Freigabe lesen – oder den Halbsatz
 * streichen. Er ist eine Beschreibung des Verfahrens, kein Schmuck.
 */
export const KI_HINWEIS =
  'Hinweis: Text und Vertonung dieser Folge entstehen mit Unterstützung von ' +
  'KI-Werkzeugen und werden vor der Veröffentlichung von einem Menschen ' +
  'inhaltlich geprüft; die redaktionelle Verantwortung liegt beim Betreiber.'

function wortzahl(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

/** Ein Themenabsatz: Meldung mit Zahlen, dann die Einordnung. */
function themenAbsatz(item: EditionItem, mitEinordnung: boolean): string {
  const saetze = [...item.summary]
  if (mitEinordnung) saetze.push(item.whyItMatters)
  return sprechbar(saetze.join(' '))
}

/**
 * Baut die komplette Folge aus einer Tagesausgabe.
 *
 * Das Wortziel wird durch Weglassen erreicht, nie durch Erfinden: Reicht der
 * Stoff nicht an 710 Wörter heran, wird die Folge kürzer und die Wortzahl im
 * Ergebnis gemeldet – eine kurze ehrliche Folge schlägt eine gestreckte.
 */
export function baueFolge(edition: DailyEdition): Podcastfolge {
  const { jahr, monat, tag, wochentag } = zerlegeDatum(edition.date)
  const alle = [...edition.top, ...edition.further]

  /* Drei Themen für den Spannungsbogen der Begrüßung. */
  const spannungsbogen = alsAufzaehlung(
    alle.slice(0, 3).map((item) => kernDerUeberschrift(item.headline, 60)),
    150
  )

  /*
    Der Spannungsbogen kommt aus `intro` und nicht aus den Überschriften.

    Der erste Lauf setzte drei gekürzte Schlagzeilen hinter „Es geht um“ und
    ergab: „Es geht um Schwacher US-Jobbericht schickt DAX und Wall Street,
    Trump erwägt …“ – grammatisch falsch, weil eine Schlagzeile ein Satz ist
    und kein Satzglied. `intro` ist bereits ein gebauter Satz über den Tag,
    mit genau den drei Themen darin. Er passt, weil er für dieselbe Aufgabe
    geschrieben wurde.
  */
  const einstieg =
    `Guten Morgen und herzlich willkommen zum Marktupdate von IM Investments. ` +
    `Heute ist ${WOCHENTAGE[wochentag]}, der ${ordnungszahl(tag)} ${MONATE[monat - 1]} ` +
    `${zahlwort(jahr)}. ${sprechbar(edition.intro)}`

  /*
    Das Fazit wiederholt nicht die Begrüßung – dort steht `intro` bereits.
    Es nimmt die Einordnung der wichtigsten Meldung, weil das die Lehre des
    Tages ist, und die ist der erklärte Zweck dieses Podcasts.
  */
  const lehre = alle[0]?.whyItMatters ?? ''
  const fazit = `Bleibt das Fazit. ${sprechbar(lehre)}`

  const abschluss =
    wochentag === 5
      ? 'Das war das Marktupdate von IM Investments. Alle Themen ausführlich und mit Einordnung findest du auf iminvests punkt de. Bis Montag früh, schönes Wochenende und viel Erfolg.'
      : 'Das war das Marktupdate von IM Investments. Alle Themen ausführlich und mit Einordnung findest du auf iminvests punkt de. Bis morgen früh und viel Erfolg.'

  /*
    Erst alles mit Einordnung, dann von hinten kürzen: zuerst verlieren die
    letzten Themen ihre Einordnung, dann fallen sie ganz weg. So bleibt die
    Rangfolge der Ausgabe gewahrt – gekürzt wird am Unwichtigsten.
  */
  let absaetze = alle.map((item) => themenAbsatz(item, true))
  const rumpf = () => [einstieg, ...absaetze, fazit, abschluss].join('\n\n')
  let ohneEinordnung = alle.length - 1
  while (wortzahl(rumpf()) > WORTZIEL_MAX && ohneEinordnung > 0) {
    absaetze[ohneEinordnung] = themenAbsatz(alle[ohneEinordnung], false)
    ohneEinordnung -= 1
    if (wortzahl(rumpf()) > WORTZIEL_MAX && absaetze.length > 3) {
      absaetze = absaetze.slice(0, -1)
    }
  }

  const sprechtext = rumpf()

  const titel = alsAufzaehlung(
    alle.slice(0, 3).map((item) => kernDerUeberschrift(item.headline, 60)),
    110
  )

  const kapitel = [
    'Begrüßung und Überblick',
    ...alle.slice(0, absaetze.length).map((item) => kernDerUeberschrift(item.headline)),
    'Fazit',
  ]

  const themenHashtags = [...new Set(alle.map((item) => item.category))]
    .slice(0, 3)
    .map((kategorie) => `#${kategorie.replaceAll(/[^A-Za-zÄÖÜäöüß]/g, '')}`)
  const hashtags = [
    ...themenHashtags,
    '#Börse',
    '#Aktien',
    '#Finanzen',
    '#Marktupdate',
    '#Finanzbildung',
  ].join(' ')

  const weitere = alle
    .slice(2)
    .map((item) => kernDerUeberschrift(item.headline, 60))
    .join(', ')
  const beschreibung = [
    `${edition.intro} ${alle[0]?.summary[0] ?? ''}`,
    `Wir sprechen über ${weitere || spannungsbogen}. Kompakt in rund fünf Minuten.`,
    '[KAPITEL]',
    'Website: iminvests.de',
    KI_HINWEIS,
    'Hinweis: Dieser Podcast dient ausschließlich der Information und Finanzbildung. Er stellt keine Anlageberatung und keine Kauf- oder Verkaufsempfehlung dar. Alle Angaben ohne Gewähr.',
    hashtags,
  ].join('\n\n')

  return {
    datum: edition.date,
    nummer: folgennummer(edition.date),
    titel,
    sprechtext,
    wortzahl: wortzahl(sprechtext),
    kapitel,
    beschreibung,
    hashtags,
  }
}
