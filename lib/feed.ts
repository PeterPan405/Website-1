/**
 * Baut RSS- und iCalendar-Dateien.
 *
 * ## Warum diese beiden Formate zusammen in einer Datei stehen
 *
 * Weil sie dasselbe Problem haben. Beide sind alte Textformate mit strengen
 * Regeln darüber, was ein Zeichen im Inhalt anrichten kann: Ein `&` in einer
 * Überschrift macht einen RSS-Feed ungültig, ein Komma in einem Termintitel
 * zerlegt eine iCalendar-Zeile in zwei Felder. Beide Male ist das Ergebnis kein
 * sichtbarer Fehler, sondern eine Datei, die ein Programm stillschweigend
 * verwirft.
 *
 * Genau dieses Maskieren ist hier geprüft. Alles andere an beiden Formaten ist
 * Zusammenstecken von Zeichenketten.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Maskiert die fünf Zeichen, die in XML eine Bedeutung haben. */
export function xmlText(roh: string): string {
  return roh
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Ein Datum im Format, das RSS verlangt (RFC 822). */
export function rfc822(iso: string): string {
  return new Date(iso).toUTCString()
}

export interface Feedeintrag {
  titel: string
  /** Vollständige Adresse, mit Schema und Host. */
  url: string
  beschreibung: string
  /** Veröffentlichung als ISO-Zeitstempel. */
  datum: string
  /** Rubrik, wird als `category` ausgegeben. */
  kategorie?: string
}

export interface Feedkopf {
  titel: string
  url: string
  beschreibung: string
  /** Adresse des Feeds selbst, für `atom:link`. */
  feedUrl: string
  sprache: string
}

/**
 * Ein RSS-2.0-Feed.
 *
 * Der `guid` ist die Adresse und `isPermaLink="true"` – das ist bei einer
 * Website mit dauerhaften Adressen die richtige Wahl und erspart eine zweite
 * Kennung, die auseinanderlaufen könnte.
 */
export function baueRss(kopf: Feedkopf, eintraege: readonly Feedeintrag[]): string {
  const zeilen = eintraege.map((eintrag) =>
    [
      '    <item>',
      `      <title>${xmlText(eintrag.titel)}</title>`,
      `      <link>${xmlText(eintrag.url)}</link>`,
      `      <guid isPermaLink="true">${xmlText(eintrag.url)}</guid>`,
      `      <pubDate>${rfc822(eintrag.datum)}</pubDate>`,
      eintrag.kategorie
        ? `      <category>${xmlText(eintrag.kategorie)}</category>`
        : null,
      `      <description>${xmlText(eintrag.beschreibung)}</description>`,
      '    </item>',
    ]
      .filter((zeile): zeile is string => zeile !== null)
      .join('\n')
  )

  const juengstes = eintraege[0]?.datum

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${xmlText(kopf.titel)}</title>`,
    `    <link>${xmlText(kopf.url)}</link>`,
    `    <description>${xmlText(kopf.beschreibung)}</description>`,
    `    <language>${xmlText(kopf.sprache)}</language>`,
    `    <atom:link href="${xmlText(kopf.feedUrl)}" rel="self" type="application/rss+xml" />`,
    juengstes ? `    <lastBuildDate>${rfc822(juengstes)}</lastBuildDate>` : null,
    ...zeilen,
    '  </channel>',
    '</rss>',
    '',
  ]
    .filter((zeile): zeile is string => zeile !== null)
    .join('\n')
}

/**
 * Maskiert einen Text für ein iCalendar-Feld.
 *
 * Komma und Semikolon trennen in iCalendar Werte voneinander, der
 * Rückwärtsstrich maskiert – wer sie ungeschützt in einen Termintitel schreibt,
 * erzeugt eine Datei, die der Kalender entweder ablehnt oder falsch liest.
 * Zeilenumbrüche werden zu `\n`, weil ein echter Umbruch die Zeile beendet.
 */
export function icsText(roh: string): string {
  return roh
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/**
 * Faltet eine Zeile auf 75 Oktette.
 *
 * Das schreibt RFC 5545 vor, und manche Kalenderprogramme sind darin streng.
 * Fortsetzungszeilen beginnen mit einem Leerzeichen. Gezählt wird in Bytes und
 * nicht in Zeichen: Ein Umlaut belegt in UTF-8 zwei, und eine Umbruchstelle
 * mitten in seinen Bytes macht aus dem Umlaut zwei kaputte Zeichen.
 *
 * Gezählt wird mit `TextEncoder` und nicht mit `Buffer`. Der Unterschied ist
 * kein Geschmack: `Buffer` gibt es nur in Node. Seit die Merkliste ihren
 * Kalender im Browser erzeugt, läuft dieselbe Funktion auch dort, und mit
 * `Buffer` wäre sie beim ersten Umlaut mit „Buffer is not defined“
 * stehengeblieben – auf einer Seite, die statisch ausgeliefert wird und
 * niemandem eine Fehlermeldung schickt.
 */
const KODIERER = new TextEncoder()
const DEKODIERER = new TextDecoder()

export function falte(zeile: string): string[] {
  const bytes = KODIERER.encode(zeile)
  if (bytes.length <= 75) return [zeile]

  const teile: string[] = []
  let anfang = 0
  let grenze = 75
  while (anfang < bytes.length) {
    let ende = Math.min(anfang + grenze, bytes.length)
    // Nicht mitten in einem Mehrbyte-Zeichen schneiden.
    while (
      ende > anfang &&
      ende < bytes.length &&
      (bytes[ende] & 0b1100_0000) === 0b1000_0000
    ) {
      ende -= 1
    }
    teile.push(
      (anfang === 0 ? '' : ' ') + DEKODIERER.decode(bytes.subarray(anfang, ende))
    )
    anfang = ende
    // Fortsetzungszeilen tragen ein führendes Leerzeichen und dürfen deshalb
    // nur 74 weitere Oktette aufnehmen.
    grenze = 74
  }
  return teile
}

export interface Termineintrag {
  /** Eindeutige Kennung des Termins, stabil über Läufe hinweg. */
  uid: string
  /** Tag als `JJJJ-MM-TT`. */
  datum: string
  /** Letzter Tag eines mehrtägigen Fensters, oder `undefined`. */
  bis?: string
  titel: string
  beschreibung: string
  url?: string
}

function ohneBindestriche(datum: string): string {
  return datum.replace(/-/g, '')
}

/** Ein Tag später – iCalendar schließt das Ende eines Ganztagstermins aus. */
function tagDanach(datum: string): string {
  const d = new Date(`${datum}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + 1)
  return ohneBindestriche(d.toISOString().slice(0, 10))
}

/**
 * Eine iCalendar-Datei mit Ganztagsterminen.
 *
 * ## Warum Ganztagstermine
 *
 * Weil keiner dieser Termine eine Uhrzeit hat, die für alle stimmt. Ein
 * Zinsentscheid wird um 14:15 Uhr mitteleuropäischer Zeit verkündet, die
 * Quartalszahlen eines US-Konzerns nach Handelsschluss in New York. Eine
 * erfundene Uhrzeit im Kalender wäre schlimmer als keine: Sie sähe aus wie
 * eine Angabe.
 *
 * ## Warum `stand` in die UID gehört – und nicht
 *
 * Die Kennung muss über Läufe hinweg stabil bleiben, sonst legt der Kalender
 * bei jedem Abgleich neue Einträge an, statt die vorhandenen zu aktualisieren.
 * Sie besteht deshalb aus Datum und Titel, nicht aus einem Zeitstempel.
 */
export function baueIcs(
  name: string,
  beschreibung: string,
  termine: readonly Termineintrag[],
  jetzt = new Date()
): string {
  const stempel = `${jetzt.toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`

  const zeilen: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//IM Invests//Boersenkalender//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${icsText(name)}`,
    `X-WR-CALDESC:${icsText(beschreibung)}`,
  ]

  for (const termin of termine) {
    zeilen.push(
      'BEGIN:VEVENT',
      `UID:${icsText(termin.uid)}`,
      `DTSTAMP:${stempel}`,
      `DTSTART;VALUE=DATE:${ohneBindestriche(termin.datum)}`,
      `DTEND;VALUE=DATE:${tagDanach(termin.bis ?? termin.datum)}`,
      `SUMMARY:${icsText(termin.titel)}`,
      `DESCRIPTION:${icsText(termin.beschreibung)}`
    )
    if (termin.url) zeilen.push(`URL:${icsText(termin.url)}`)
    zeilen.push('TRANSP:TRANSPARENT', 'END:VEVENT')
  }

  zeilen.push('END:VCALENDAR')

  /*
    Zeilenenden nach RFC 5545 mit CRLF. Ein reines `\n` funktioniert bei den
    meisten Programmen und bei einem nicht – und welches das ist, erfährt man
    von dem einen Nutzer, bei dem der Kalender leer bleibt.
  */
  return zeilen.flatMap(falte).join('\r\n') + '\r\n'
}
