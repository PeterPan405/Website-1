/**
 * Ob eine abgerufene Seite heute als Quelle taugt.
 *
 * ## Warum das geprüft werden muss, bevor jemand schreibt
 *
 * Weil eine Quelle auf drei Arten ausfallen kann und nur eine davon auffällt.
 *
 * 1. **Sie antwortet nicht.** Statuscode 404 oder 503 – das sieht jeder.
 * 2. **Sie antwortet mit 200 und liefert nichts.** Eine Seite, die ihren Inhalt
 *    per JavaScript nachlädt, kommt beim Abruf als Gerüst herein: Kopfzeile,
 *    Menü, Fußzeile, dazwischen leer. Der Statuscode ist 200, das Protokoll
 *    sieht ordentlich aus, und im Text steht nichts, worauf sich ein Satz
 *    stützen ließe.
 * 3. **Sie antwortet mit 200 und liefert etwas Altes.** Eine Rubrikseite, deren
 *    Aufmacher seit drei Tagen steht, ist keine Meldung von heute – und nichts
 *    an ihr sagt das.
 *
 * Fall 2 und 3 sind die gefährlichen. Sie führen nicht zu einem Abbruch,
 * sondern zu einer dünneren Ausgabe: Statt neun Artikeln entstehen sechs, alle
 * aus den zwei Quellen, die noch gingen, und niemand merkt, dass drei weitere
 * ausgefallen sind. Genau das ist am 31. Juli 2026 der Anlass gewesen, diese
 * Prüfung zu bauen.
 *
 * ## Was hier **nicht** entschieden wird
 *
 * Ob eine Meldung eine gute Meldung ist. Das ist eine Frage des Urteils und
 * keine der Messung. Geprüft wird nur, ob überhaupt lesbarer, heutiger Text
 * angekommen ist – die Vorbedingung dafür, dass sich das Urteil lohnt.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Wie viele Zeichen Fließtext eine brauchbare Seite mindestens hat. */
export const MINDESTZEICHEN = 800

/**
 * Ab welcher Länge eine Zeile als Fließtext zählt.
 *
 * Menüpunkte, Schlagzeilenlisten und Fußzeilenlinks sind kurz; ein Absatz ist
 * lang. Der Schwellenwert trennt genau das – und ist der Grund, warum diese
 * Prüfung ein JavaScript-Gerüst erkennt, obwohl es tausend Zeichen Menütext
 * mitbringt.
 */
export const FLIESSTEXT_AB = 120

/** Wie viel des Textes Fließtext sein muss, damit die Seite als lesbar gilt. */
export const FLIESSTEXT_ANTEIL = 0.25

/**
 * Wörter, die auf eine Sperre statt auf einen Inhalt hindeuten.
 *
 * Kein Ausschlusskriterium für sich: Ein Artikel über Datenschutz enthält das
 * Wort „Einwilligung“ völlig zu Recht. Erst zusammen mit wenig Fließtext ergibt
 * sich daraus ein Urteil – deshalb steht die Liste hier und nicht in einer
 * Abfrage, die allein entscheidet.
 */
const SPERRWOERTER = [
  'javascript aktivieren',
  'javascript ist deaktiviert',
  'cookie-einstellungen',
  'einwilligung',
  'zustimmen und weiterlesen',
  'access denied',
  'are you a robot',
  'enable javascript',
  'bitte aktivieren sie javascript',
]

export type Urteil = 'brauchbar' | 'alt' | 'leer' | 'gesperrt' | 'stumm'

export interface Befund {
  urteil: Urteil
  /** Zeichen Fließtext, also in Zeilen ab `FLIESSTEXT_AB`. */
  fliesstext: number
  /** Zeichen insgesamt nach dem Entfernen des Markups. */
  gesamt: number
  /** Ob ein Datum von heute oder gestern im Text steht. */
  aktuell: boolean
  /** Ein Satz, der das Urteil begründet. */
  grund: string
}

/**
 * Schreibt einen Tag in den Schreibweisen, in denen deutsche Seiten ihn führen.
 *
 * Vier Formen, weil alle vier vorkommen: „31.07.2026“ bei Portalen,
 * „31. Juli 2026“ im Fließtext, „2026-07-31“ in maschinennahen Angaben und
 * „31.7.2026“ ohne führende Null.
 */
export function datumsformen(tag: string): string[] {
  const [jahr, monat, tagesteil] = tag.slice(0, 10).split('-')
  const monate = [
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
  const monatsname = monate[Number(monat) - 1] ?? ''
  const ohneNull = String(Number(tagesteil))
  const monatOhneNull = String(Number(monat))
  return [
    `${tagesteil}.${monat}.${jahr}`,
    `${ohneNull}.${monatOhneNull}.${jahr}`,
    `${ohneNull}. ${monatsname} ${jahr}`,
    `${jahr}-${monat}-${tagesteil}`,
  ]
}

/** Der Kalendertag davor, ohne Umweg über die Zeitzone. */
export function tagDavor(tag: string): string {
  const d = new Date(`${tag.slice(0, 10)}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

/**
 * Ob im Text ein Datum von heute oder gestern steht.
 *
 * Gestern zählt mit, und das ist Absicht: Ein Lauf um sechs Uhr morgens findet
 * zu vielen Themen die Meldung vom Vorabend. Sie als „nicht aktuell“ zu
 * verwerfen hieße, die halbe Nachrichtenlage wegzuwerfen.
 */
export function istAktuell(text: string, heute: string): boolean {
  const formen = [...datumsformen(heute), ...datumsformen(tagDavor(heute))]
  return formen.some((form) => text.includes(form))
}

/**
 * Bewertet den Text einer abgerufenen Seite.
 *
 * `status` ist der HTTP-Statuscode, `text` der Inhalt **nach** dem Entfernen
 * des Markups, `heute` der Tag als `JJJJ-MM-TT`.
 */
export function bewerte(status: number, text: string, heute: string): Befund {
  if (status < 200 || status >= 300) {
    return {
      urteil: 'stumm',
      fliesstext: 0,
      gesamt: 0,
      aktuell: false,
      grund: `Statuscode ${status} – die Seite antwortet nicht mit Inhalt.`,
    }
  }

  const zeilen = text.split('\n').map((zeile) => zeile.trim())
  const fliesstext = zeilen
    .filter((zeile) => zeile.length >= FLIESSTEXT_AB)
    .reduce((summe, zeile) => summe + zeile.length, 0)
  const gesamt = text.length
  const anteil = gesamt === 0 ? 0 : fliesstext / gesamt
  const aktuell = istAktuell(text, heute)

  const klein = text.toLowerCase()
  const gesperrt = SPERRWOERTER.some((wort) => klein.includes(wort))

  const zuWenig = fliesstext < MINDESTZEICHEN || anteil < FLIESSTEXT_ANTEIL

  /*
    Die Reihenfolge der Urteile ist nicht beliebig.

    „Gesperrt“ steht vor „leer“, weil es dieselbe Beobachtung ist – wenig
    Fließtext – mit einer anderen Ursache und einer anderen Abhilfe: Bei einer
    Sperre hilft keine andere Uhrzeit, sondern nur eine andere Quelle. Wer
    beides als „leer“ meldet, sucht am nächsten Morgen wieder im Falschen.
  */
  if (zuWenig && gesperrt) {
    return {
      urteil: 'gesperrt',
      fliesstext,
      gesamt,
      aktuell,
      grund:
        'Wenig Fließtext, dazu Hinweise auf eine Zustimmungs- oder Bot-Sperre. ' +
        'Diese Quelle liefert einem Abruf ohne Browser nichts.',
    }
  }
  if (zuWenig) {
    return {
      urteil: 'leer',
      fliesstext,
      gesamt,
      aktuell,
      grund:
        `Nur ${fliesstext} Zeichen Fließtext von ${gesamt} insgesamt. ` +
        'Das ist ein Gerüst aus Menü und Fußzeile, kein Artikel – die Seite lädt ihren Inhalt vermutlich per JavaScript nach.',
    }
  }
  if (!aktuell) {
    return {
      urteil: 'alt',
      fliesstext,
      gesamt,
      aktuell,
      grund:
        'Lesbarer Text, aber kein Datum von heute oder gestern darin. ' +
        'Als Beleg für eine Meldung von heute taugt das nicht.',
    }
  }
  return {
    urteil: 'brauchbar',
    fliesstext,
    gesamt,
    aktuell,
    grund: `${fliesstext} Zeichen Fließtext mit einem Datum von heute oder gestern.`,
  }
}

/** Ob ein Befund für die Recherche taugt. */
export function taugt(befund: Befund): boolean {
  return befund.urteil === 'brauchbar'
}

export interface Quellenlage {
  rubrik: string
  /** Die brauchbaren Quellen dieser Rubrik, in der Reihenfolge der Liste. */
  brauchbar: string[]
  /** Alle geprüften Quellen mit ihrem Urteil. */
  geprueft: { adresse: string; befund: Befund }[]
}

/**
 * Fasst die Lage je Rubrik zusammen.
 *
 * Die interessante Zahl ist nicht, wie viele Quellen ausgefallen sind, sondern
 * **ob eine Rubrik ganz ohne dasteht**. Eine Rubrik mit drei Quellen, von denen
 * zwei ausfallen, ist in Ordnung – dafür gibt es die Ausweichliste. Eine
 * Rubrik ohne brauchbare Quelle heißt: Zu diesem Thema entsteht heute kein
 * Artikel, und das gehört gesagt, bevor jemand schreibt.
 */
export function lageJeRubrik(
  eintraege: readonly { rubrik: string; adresse: string; befund: Befund }[]
): Quellenlage[] {
  const nachRubrik = new Map<string, Quellenlage>()
  for (const eintrag of eintraege) {
    let lage = nachRubrik.get(eintrag.rubrik)
    if (!lage) {
      lage = { rubrik: eintrag.rubrik, brauchbar: [], geprueft: [] }
      nachRubrik.set(eintrag.rubrik, lage)
    }
    lage.geprueft.push({ adresse: eintrag.adresse, befund: eintrag.befund })
    if (taugt(eintrag.befund)) lage.brauchbar.push(eintrag.adresse)
  }
  return [...nachRubrik.values()]
}

/** Die Rubriken, für die heute keine Quelle antwortet. */
export function ohneQuelle(lagen: readonly Quellenlage[]): string[] {
  return lagen.filter((lage) => lage.brauchbar.length === 0).map((lage) => lage.rubrik)
}
