/**
 * Uhrzeiten zwischen New York und Berlin – ohne Zeitzonenbibliothek.
 *
 * ## Wofür das gebraucht wird
 *
 * Ein amerikanisches Unternehmen meldet seine Quartalszahlen zu einer festen
 * Zeit **seiner** Börse: vor der Eröffnung um 9:30 Uhr New Yorker Zeit oder
 * nach dem Schluss um 16:00 Uhr. Wer wissen will, wann das in Deutschland ist,
 * darf nicht einfach sechs Stunden addieren.
 *
 * Zwischen New York und Berlin liegen nämlich nicht immer sechs Stunden. Beide
 * stellen die Uhr um, aber an **verschiedenen Tagen**: Amerika am zweiten
 * Sonntag im März und am ersten Sonntag im November, Europa am letzten Sonntag
 * im März und im Oktober. Zweimal im Jahr gibt es deshalb ein Fenster von zwei
 * bis drei Wochen, in dem der Abstand fünf Stunden beträgt statt sechs. Genau
 * in dieses Fenster fällt die amerikanische Berichtssaison für das erste
 * Quartal – die Wochen nach dem 20. März.
 *
 * ## Warum über die Zeitzonennamen und nicht über eine Tabelle
 *
 * `Intl.DateTimeFormat` kennt die Umstellungsregeln beider Länder, und zwar in
 * der Fassung, die zur Laufzeit gilt. Eine eigene Tabelle wäre eine Kopie
 * davon, die niemand nachzieht, wenn ein Land seine Regel ändert – die USA
 * haben das zuletzt 2007 getan, und Europa diskutiert es seit Jahren.
 *
 * ## Warum die Wanduhr und nicht der Zeitpunkt fortgeschrieben wird
 *
 * Der Termin des kommenden Jahres wird aus dem des Vorjahres abgeleitet. Wer
 * dabei den **Zeitpunkt** um ein Jahr verschiebt, verschiebt auch die
 * Zeitzonenlage: Aus 16:01 Uhr New Yorker Zeit im August würde im Februar
 * 15:01 Uhr. Ein Unternehmen meldet aber nach *seinem* Börsenschluss, und der
 * liegt immer um 16:00 Uhr Ortszeit.
 *
 * Deshalb wird die New Yorker **Wanduhrzeit** aus der alten Meldung gelesen
 * und auf den neuen Tag gesetzt. Erst daraus entsteht wieder ein Zeitpunkt,
 * und der wird in Berliner Zeit angezeigt.
 */

/**
 * Der Versatz einer Zeitzone gegenüber UTC, in Minuten, zu einem Zeitpunkt.
 *
 * Positiv östlich von Greenwich: Berlin im Sommer +120, New York −240.
 *
 * Der Weg über `formatToParts` und `Date.UTC` ist der übliche: Die Zeitzone
 * wird auf den Zeitpunkt angewandt, das Ergebnis als wäre es UTC wieder
 * eingelesen, und die Differenz ist der Versatz.
 */
export function zonenversatzMinuten(zeitpunkt: Date, zone: string): number {
  const teile = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(zeitpunkt)

  const wert = (art: string) =>
    Number(teile.find((teil) => teil.type === art)?.value ?? '0')

  /*
    `hour` kommt bei `hour12: false` in manchen Umgebungen als „24“ für
    Mitternacht. Modulo 24 macht daraus die 0, die gemeint ist – ohne das
    verschiebt sich jeder Termin um Mitternacht um einen ganzen Tag.
  */
  const alsUtc = Date.UTC(
    wert('year'),
    wert('month') - 1,
    wert('day'),
    wert('hour') % 24,
    wert('minute'),
    wert('second')
  )

  return Math.round((alsUtc - zeitpunkt.getTime()) / 60_000)
}

/** Die Wanduhrzeit `HH:MM` eines Zeitpunkts in einer Zeitzone. */
export function wanduhrzeit(zeitpunkt: Date, zone: string): string {
  const teile = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(zeitpunkt)

  const wert = (art: string) =>
    Number(teile.find((teil) => teil.type === art)?.value ?? '0')

  const stunde = wert('hour') % 24
  return `${String(stunde).padStart(2, '0')}:${String(wert('minute')).padStart(2, '0')}`
}

/** Die New Yorker Wanduhrzeit eines Zeitpunkts, `HH:MM`. */
export function newYorkerUhrzeit(zeitpunkt: Date | string): string {
  const wann = typeof zeitpunkt === 'string' ? new Date(zeitpunkt) : zeitpunkt
  if (Number.isNaN(wann.getTime())) return ''
  return wanduhrzeit(wann, 'America/New_York')
}

/**
 * Der Zeitpunkt, zu dem an einem Tag in einer Zeitzone die Uhr `HH:MM` zeigt.
 *
 * Zwei Durchgänge, und der zweite ist nicht überflüssig: Der erste rechnet mit
 * dem Versatz, der zur *vermuteten* UTC-Zeit gilt, und der kann in der Nacht
 * einer Zeitumstellung der falsche sein. Der zweite rechnet mit dem Versatz am
 * tatsächlich getroffenen Zeitpunkt. Mehr als zwei braucht es nicht – eine
 * Umstellung springt um höchstens eine Stunde.
 */
export function zeitpunktAusZonenzeit(
  datumIso: string,
  uhrzeit: string,
  zone: string
): Date {
  const [jahr, monat, tag] = datumIso.split('-').map(Number)
  const [stunde, minute] = uhrzeit.split(':').map(Number)
  const naiv = Date.UTC(jahr, monat - 1, tag, stunde, minute)

  let zeitstempel = naiv
  for (let durchgang = 0; durchgang < 2; durchgang++) {
    const versatz = zonenversatzMinuten(new Date(zeitstempel), zone)
    zeitstempel = naiv - versatz * 60_000
  }

  return new Date(zeitstempel)
}

/** Ob in Berlin an diesem Tag Sommerzeit gilt. */
export function berlinerZeitkuerzel(zeitpunkt: Date): 'MEZ' | 'MESZ' {
  return zonenversatzMinuten(zeitpunkt, 'Europe/Berlin') >= 120 ? 'MESZ' : 'MEZ'
}

/**
 * Wie spät es in Berlin ist, wenn es an einem Tag in New York `HH:MM` schlägt.
 *
 * @returns Uhrzeit und Kürzel, oder `null` bei unbrauchbarer Eingabe.
 */
export function berlinerUhrzeit(
  datumIso: string,
  newYorkerZeit: string
): { uhrzeit: string; kuerzel: 'MEZ' | 'MESZ' } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datumIso)) return null
  if (!/^\d{2}:\d{2}$/.test(newYorkerZeit)) return null

  const zeitpunkt = zeitpunktAusZonenzeit(datumIso, newYorkerZeit, 'America/New_York')
  if (Number.isNaN(zeitpunkt.getTime())) return null

  return {
    uhrzeit: wanduhrzeit(zeitpunkt, 'Europe/Berlin'),
    kuerzel: berlinerZeitkuerzel(zeitpunkt),
  }
}

/**
 * Wo eine New Yorker Uhrzeit in der dortigen Handelssitzung liegt.
 *
 * Die Sitzung an der NYSE und der Nasdaq geht von 9:30 bis 16:00 Uhr Ortszeit,
 * das ganze Jahr über – deshalb wird hier in New Yorker Zeit verglichen und
 * nicht in Berliner. In Berlin verschöbe sich die Grenze zweimal im Jahr um
 * eine Stunde, und dann stünde bei einer Meldung um 21:30 Uhr MEZ „während des
 * Handels“, obwohl die Börse längst zu war.
 *
 * Der Zweck ist die einzige Frage, die ein Anleger hier wirklich hat: Bewegt
 * sich der Kurs noch heute oder erst morgen früh?
 */
export type Sitzungslage = 'vorboerse' | 'handel' | 'nachboerse'

export function sitzungslage(newYorkerZeit: string): Sitzungslage | null {
  if (!/^\d{2}:\d{2}$/.test(newYorkerZeit)) return null
  const minuten =
    Number(newYorkerZeit.slice(0, 2)) * 60 + Number(newYorkerZeit.slice(3, 5))
  if (minuten < 9 * 60 + 30) return 'vorboerse'
  if (minuten < 16 * 60) return 'handel'
  return 'nachboerse'
}

export const sitzungslageLabel: Record<Sitzungslage, string> = {
  vorboerse: 'vor der US-Eröffnung',
  handel: 'während des US-Handels',
  nachboerse: 'nach dem US-Schluss',
}
