/**
 * Die erwarteten Dividendenabschläge als Kalendereinträge und als Befund je
 * Aktie.
 *
 * ## Warum diese Termine geschätzt sind
 *
 * Der Abruf liefert, was gezahlt **wurde** – Tag und Betrag je Aktie, aus der
 * Kurshistorie bei Yahoo. Künftige Termine stehen dort nicht, und sie stehen
 * auch sonst nirgends kostenlos für tausend Titel: Ein Unternehmen beschließt
 * seine Dividende auf der Hauptversammlung und nennt den Abschlagstag wenige
 * Wochen vorher.
 *
 * Also wird aus dem Muster gerechnet. Diese Termine tragen deshalb
 * `geschaetzt` und weisen die Vorjahreszahlung als Beleg aus – dieselbe Regel
 * wie bei den Quartalszahlen, aus demselben Grund: Ein geschätzter Termin, der
 * aussieht wie ein feststehender, ist schlechter als gar keiner.
 *
 * ## Warum sie im Kalender ausgeschaltet sind
 *
 * Über tausend Aktien, die meisten mit vier Zahlungen im Jahr, ergeben
 * mehrere Tausend Termine. Voreingestellt sichtbar bestünde der Kalender aus
 * nichts anderem mehr. Die Terminart steht deshalb in `nurAufWunsch`.
 */

import momentaufnahme from '@/data/snapshots/dividenden.json'
import { marketDefinitions } from '@/data/markets'
import type { Termin } from '@/data/kalender/typen'
import {
  rhythmusLabel,
  werteDividenden,
  type Dividendenbefund,
  type Zahlung,
} from '@/lib/dividenden'
import { getLiveSeries } from '@/lib/market-live'

/** Wie weit voraus Termine erzeugt werden. */
const HORIZONT_MONATE = 14

interface Bestand {
  abgerufenAm: string
  quelle: { label: string; url: string }
  titel: Record<string, Zahlung[]>
}

const daten = momentaufnahme as Bestand

/** Wann die Dividenden zuletzt abgerufen wurden – leer, solange kein Lauf war. */
export const dividendenStand: string = daten.abgerufenAm

export const dividendenQuelle = daten.quelle

/**
 * Der aktuelle Kurs in der Einheit des Instruments.
 *
 * Bevorzugt der zuletzt gehandelte Preis, sonst der letzte Schlusskurs. Wichtig
 * ist die **rohe** Einheit: Für einen britischen Titel also Pence, weil die
 * Dividendenbeträge ebenfalls in Pence stehen. Wer hier in Pfund umrechnete,
 * bekäme eine hundertfach zu hohe Rendite.
 */
function rohkurs(symbol: string): number | null {
  const reihe = getLiveSeries(symbol)
  if (!reihe) return null
  return reihe.latest?.value ?? reihe.daily[reihe.daily.length - 1]?.value ?? null
}

function heute(): string {
  return new Date().toISOString().slice(0, 10)
}

function plusMonate(monate: number): string {
  const d = new Date()
  d.setUTCMonth(d.getUTCMonth() + monate)
  return d.toISOString().slice(0, 10)
}

/**
 * Der Befund zu einer Aktie, oder `null`, wenn sie keine Dividende zahlt.
 *
 * Der Kurs kommt aus demselben Bestand wie auf der Kursseite und steht in
 * derselben Einheit wie die Beträge – bei britischen Titeln beide in Pence.
 * Genau deshalb braucht die Rendite keine Umrechnung.
 */
export function getDividendenbefund(symbol: string): Dividendenbefund | null {
  const zahlungen = daten.titel[symbol]
  if (!zahlungen || zahlungen.length === 0) return null
  return werteDividenden(zahlungen, rohkurs(symbol), heute())
}

/** Wie viele der geführten Aktien Dividenden melden. */
export function getDividendenAbdeckung(): { mitZahlungen: number; aktien: number } {
  const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock').length
  return { mitZahlungen: Object.keys(daten.titel).length, aktien }
}

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

function aufDeutsch(datum: string): string {
  const [jahr, monat, tag] = datum.split('-')
  return `${Number(tag)}. ${MONATE[Number(monat) - 1]} ${jahr}`
}

/**
 * Die erwarteten Abschlagstage als Kalendereinträge.
 *
 * Je Aktie entsteht ein Eintrag für den nächsten erwarteten Termin, nicht für
 * alle künftigen: Der zweite und dritte wären aus dem ersten hochgerechnet und
 * damit doppelt geschätzt. Wer im August die Novemberzahlung sucht, findet sie
 * nach der Augustzahlung – dann steht sie auf einer echten Grundlage.
 */
export function getDividendentermine(): Termin[] {
  const grenze = plusMonate(HORIZONT_MONATE)
  const jetzt = heute()
  const ergebnis: Termin[] = []

  for (const [symbol, zahlungen] of Object.entries(daten.titel)) {
    const definition = marketDefinitions.find((eintrag) => eintrag.symbol === symbol)
    /*
      Nur geführte Aktien. Fällt ein Titel aus der Auswahl, bleiben seine
      Zahlungen im Bestand stehen – ein Kalendereintrag ohne Kursseite hätte
      auf dieser Website keinen Ort.
    */
    if (!definition || definition.kind !== 'stock') continue

    const befund = werteDividenden(zahlungen, rohkurs(symbol), jetzt)
    if (!befund?.naechsterErwartet || !befund.schaetzungBasis) continue
    if (befund.naechsterErwartet > grenze) continue

    const betrag = `${befund.letzte.amount.toLocaleString('de-DE', {
      maximumFractionDigits: 4,
    })} ${definition.unit}`
    const rendite =
      befund.renditeProzent !== null
        ? `Auf den aktuellen Kurs gerechnet sind die Zahlungen der letzten zwölf Monate ${befund.renditeProzent.toLocaleString(
            'de-DE',
            { minimumFractionDigits: 1, maximumFractionDigits: 1 }
          )} Prozent. `
        : ''

    ergebnis.push({
      datum: befund.naechsterErwartet,
      /*
        Das Kürzel gehört in den Titel, und nicht nur zur Unterscheidung.

        Aufgefallen ist es an United Microelectronics: Die Firma steht zweimal
        im Katalog – als US-Hinterlegungsschein (UMC) und in Taipeh (2303.TW).
        Zwei Einträge mit identischem Titel hat die Kalenderprüfung zu Recht
        als Dublette abgewiesen. Der eigentliche Grund ist aber inhaltlich: Die
        beiden Notierungen haben verschiedene Abschlagstage, verschiedene
        Währungen und verschiedene Quellensteuer. Wer den Termin liest, muss
        wissen, welche der beiden gemeint ist.
      */
      titel: `${definition.name} (${definition.ticker}): Dividendenabschlag erwartet`,
      art: 'dividende',
      bedeutung:
        `Zahlt ${rhythmusLabel[befund.rhythmus]}, zuletzt ${betrag} am ` +
        `${aufDeutsch(befund.letzte.date)}. ${rendite}` +
        `Am Abschlagstag fällt der Kurs üblicherweise um etwa die Dividende – ` +
        `wer an diesem Tag kauft, bekommt sie nicht mehr, zahlt aber auch weniger.`,
      themen: ['aktie', 'wie-funktioniert-der-markt'],
      symbole: [symbol],
      geschaetzt: {
        basis: befund.schaetzungBasis,
        streuungTage: befund.streuungTage,
      },
      quelle: daten.quelle,
    })
  }

  return ergebnis
}
