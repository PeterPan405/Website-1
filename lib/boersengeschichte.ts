import type { SeriesPoint } from '@/data/markets'

/**
 * „Heute vor X Jahren“ – der auffälligste Handelstag zum heutigen Kalendertag.
 *
 * ## Warum es das gibt
 *
 * Die Kursreihen über fünf Jahre liegen ohnehin im Repository. In ihnen
 * stecken die Tage, an denen Anleger etwas fürs Leben gelernt haben – nur
 * findet sie niemand, weil niemand rückwärts blättert. Diese Auswertung holt
 * zum heutigen Kalendertag den auffälligsten davon nach vorn: „Heute vor drei
 * Jahren fiel der DAX um 4,3 Prozent.“
 *
 * Der Lehrwinkel ist immer derselbe und steht deshalb gleich mit im Ergebnis:
 * Extreme Tage ballen sich, kommen unangekündigt und sind der Grund, warum
 * Markttiming an Einzeltagen scheitert. Eine Kachel, die das an einem echten
 * Datum zeigt, sagt mehr als der Merksatz allein.
 *
 * ## Wie gerechnet wird
 *
 * Für jedes übergebene Instrument und jedes Jahr im Bestand wird der
 * Handelstag gesucht, der dem Jahrestag des Stichtags am nächsten liegt –
 * höchstens drei Kalendertage entfernt, sonst zählt das Jahr nicht (der
 * Jahrestag fiel dann in eine längere Handelspause). Dessen Veränderung zum
 * Vortag ist der Messwert. Es gewinnt der größte Ausschlag, egal in welche
 * Richtung; bei Gleichstand der ältere, weil „vor vier Jahren“ mehr erzählt
 * als „vor einem“.
 *
 * Rein und ohne Datumsspielereien: Der Stichtag kommt als `JJJJ-MM-TT` von
 * außen, verglichen wird über Zeichenketten und Kalendertage – kein `new
 * Date`-Umweg, der nach UTC verschiebt.
 */

export interface Geschichtsfund {
  /** Symbol des Instruments, z. B. `dax`. */
  symbol: string
  /** Anzeigename, z. B. `DAX`. */
  name: string
  /** Der gefundene Handelstag, `JJJJ-MM-TT`. */
  datum: string
  /** Wie viele Jahre der Tag zurückliegt, mindestens 1. */
  jahre: number
  /** Veränderung zum Vortag in Prozent, gerundet auf eine Nachkommastelle. */
  prozent: number
}

/** Eine Reihe samt Namen, wie die Startseite sie übergibt. */
export interface Geschichtsquelle {
  symbol: string
  name: string
  punkte: readonly SeriesPoint[]
}

/** Höchstabstand zwischen Jahrestag und nächstem Handelstag, in Tagen. */
const HOECHSTABSTAND_TAGE = 3

/** Die ersten zehn Zeichen: der Kalendertag, ohne Umweg über `new Date`. */
function tagVon(zeitpunkt: string): string {
  return zeitpunkt.slice(0, 10)
}

/** Kalendertag-Abstand zweier ISO-Daten in ganzen Tagen (UTC, rein rechnerisch). */
function tageAbstand(a: string, b: string): number {
  const ms = Math.abs(Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`))
  return Math.round(ms / 86_400_000)
}

/** Der Jahrestag des Stichtags vor `jahre` Jahren; 29. Februar wird zum 28. */
function jahrestag(stichtag: string, jahre: number): string {
  const jahr = Number(stichtag.slice(0, 4)) - jahre
  const monatTag = stichtag.slice(5) === '02-29' ? '02-28' : stichtag.slice(5)
  return `${jahr}-${monatTag}`
}

/**
 * Sucht den auffälligsten Jahrestags-Handelstag über alle Quellen.
 *
 * @param quellen   Reihen mit mindestens zwei Punkten; kürzere werden übergangen.
 * @param stichtag  Heutiges Datum als `JJJJ-MM-TT` – kommt von außen, damit
 *                  die Funktion rein bleibt und testbar ist.
 */
export function findeGeschichte(
  quellen: readonly Geschichtsquelle[],
  stichtag: string
): Geschichtsfund | null {
  let bester: Geschichtsfund | null = null

  for (const quelle of quellen) {
    if (quelle.punkte.length < 2) continue

    for (let jahre = 1; jahre <= 6; jahre++) {
      const ziel = jahrestag(stichtag, jahre)

      /* Den Handelstag mit dem kleinsten Abstand zum Jahrestag suchen. Die
         Reihen sind aufsteigend sortiert; eine lineare Suche über ein paar
         tausend Punkte ist beim Bau einmalig und billig. */
      let index = -1
      let abstand = Number.POSITIVE_INFINITY
      for (let i = 1; i < quelle.punkte.length; i++) {
        const tag = tagVon(quelle.punkte[i].t)
        const d = tageAbstand(tag, ziel)
        if (d < abstand) {
          abstand = d
          index = i
        }
      }
      if (index < 1 || abstand > HOECHSTABSTAND_TAGE) continue

      const heute = quelle.punkte[index]
      const gestern = quelle.punkte[index - 1]
      if (
        !Number.isFinite(heute.value) ||
        !Number.isFinite(gestern.value) ||
        gestern.value === 0
      )
        continue

      const prozent =
        Math.round(((heute.value - gestern.value) / gestern.value) * 1000) / 10
      if (prozent === 0) continue

      const fund: Geschichtsfund = {
        symbol: quelle.symbol,
        name: quelle.name,
        datum: tagVon(heute.t),
        jahre,
        prozent,
      }

      if (
        bester === null ||
        Math.abs(fund.prozent) > Math.abs(bester.prozent) ||
        (Math.abs(fund.prozent) === Math.abs(bester.prozent) && fund.jahre > bester.jahre)
      ) {
        bester = fund
      }
    }
  }

  return bester
}

/** Der Satz zur Kachel – eine Stelle, damit Seite und Test dasselbe sagen. */
export function geschichtssatz(fund: Geschichtsfund): string {
  const richtung = fund.prozent > 0 ? 'stieg' : 'fiel'
  const betrag = Math.abs(fund.prozent).toLocaleString('de-DE', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  const wann = fund.jahre === 1 ? 'einem Jahr' : `${fund.jahre} Jahren`
  return `Heute vor ${wann} ${richtung} ${fund.name} an einem einzigen Handelstag um ${betrag} Prozent.`
}
