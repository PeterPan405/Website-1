import momentaufnahme from '@/data/snapshots/quartalstermine.json'

import { marketDefinitions } from '@/data/markets'
import type { Termin } from '@/data/kalender/typen'

/**
 * Erwartete Termine der Quartalszahlen.
 *
 * Die Momentaufnahme entsteht wöchentlich durch
 * `.github/workflows/quartalstermine.yml` aus den 8-K-Meldungen bei der SEC.
 * Zur Laufzeit gibt es keinen Server, der etwas nachladen könnte.
 *
 * ## Warum diese Termine anders behandelt werden als die übrigen
 *
 * Alles andere im Kalender steht fest: Ein Zinsentscheid der EZB ist ein Jahr
 * vorher terminiert, ein Verfallstag folgt einer Regel, ein Wahltermin steht
 * im Gesetz. Diese Termine dagegen sind **abgeleitet** – aus dem Muster, mit
 * dem ein Unternehmen bisher gemeldet hat.
 *
 * Sie tragen deshalb `geschaetzt` und weisen den Vorjahrestag als Beleg aus.
 * Ein erwarteter Termin, der wie ein feststehender aussieht, wäre schlechter
 * als gar keiner: Wer danach eine Order legt, verlässt sich auf eine
 * Hochrechnung, ohne es zu wissen.
 *
 * ## Warum nur ein halbes Jahr
 *
 * Vorausgerechnet werden vier Quartale. Angezeigt wird weniger: Je weiter ein
 * Termin entfernt liegt, desto wahrscheinlicher hat das Unternehmen ihn
 * inzwischen selbst bekannt gegeben – dann steht hier eine Schätzung neben
 * einer öffentlich bekannten Tatsache. Ein halbes Jahr ist der Bereich, in
 * dem die Ableitung mehr nützt als stört.
 */

const HORIZONT_MONATE = 6

/** Ab dieser Streuung wird aus dem Tag ein Zeitfenster. */
const FENSTER_AB_TAGEN = 4

interface Vorhersage {
  erwartet: string
  basis: string
  streuungTage: number
}

interface Eintrag {
  name: string
  bisher: string[]
  vorhersagen: Vorhersage[]
}

interface Momentaufnahme {
  abgerufenAm: string | null
  quelle: { label: string; url: string; abgrenzung: string }
  unternehmen: Record<string, Eintrag>
}

const daten = momentaufnahme as Momentaufnahme

/** Wann die Termine zuletzt abgeleitet wurden – `null`, solange kein Lauf war. */
export const quartalstermineStand: string | null = daten.abgerufenAm

/** Herkunft und Abgrenzung, wie sie unter dem Kalender steht. */
export const quartalstermineQuelle = daten.quelle

/**
 * Der Anzeigename und der Slug eines Kürzels aus dem Katalog.
 *
 * Ohne diesen Abgleich stünde im Kalender das Börsenkürzel – `MSFT` statt
 * „Microsoft“. Und ohne den Slug ließe sich der Termin nicht mit der
 * Kursseite verbinden, auf der er eigentlich hingehört.
 */
function ausKatalog(ticker: string): { name: string; symbol: string } | null {
  const eintrag = marketDefinitions.find((definition) => definition.ticker === ticker)
  if (!eintrag) return null

  /*
    Nur Aktien, und das ist die zweite Sperre für denselben Fehler.

    Das Kürzel „WTI“ steht im Katalog für die amerikanische Ölsorte, bei der
    SEC für W&T Offshore. Solange der Abruf beides zusammenwarf, stand im
    Kalender „WTI Rohöl (USA): Quartalszahlen erwartet“ – ein Termin für einen
    Rohstoff, der keine Zahlen vorlegt.

    Behoben ist das schon beim Abruf. Die Prüfung hier bleibt trotzdem: Die
    Momentaufnahme kommt aus einer wöchentlichen Routine, und wenn dort etwas
    schiefgeht, soll es nicht bis auf die Seite durchschlagen.
  */
  if (eintrag.kind !== 'stock') return null

  return { name: eintrag.name, symbol: eintrag.symbol }
}

function plusMonate(monate: number): string {
  const d = new Date()
  d.setUTCMonth(d.getUTCMonth() + monate)
  return d.toISOString().slice(0, 10)
}

/**
 * Die erwarteten Meldetermine als Kalendereinträge.
 *
 * Erzeugt wird je Unternehmen und Quartal ein Eintrag. Wer im Katalog nicht
 * geführt wird, fällt heraus – ein Termin ohne zugehörige Kursseite hätte auf
 * dieser Website keinen Ort.
 */
export function getQuartalstermine(): Termin[] {
  const grenze = plusMonate(HORIZONT_MONATE)
  const ergebnis: Termin[] = []

  for (const [ticker, eintrag] of Object.entries(daten.unternehmen)) {
    const katalog = ausKatalog(ticker)
    if (!katalog) continue

    for (const vorhersage of eintrag.vorhersagen) {
      if (vorhersage.erwartet > grenze) continue

      const unscharf = vorhersage.streuungTage >= FENSTER_AB_TAGEN

      ergebnis.push({
        datum: vorhersage.erwartet,
        /*
          Bei unsicherem Muster wird aus dem Tag ein Zeitraum.

          Die Streuung ist die Abweichung, die dasselbe Unternehmen im Vorjahr
          gegenüber dem Jahr davor hatte. Wer sie kennt, kann den Termin so
          breit ausweisen, wie er tatsächlich bekannt ist – statt eine
          Genauigkeit vorzutäuschen, die die Quelle nicht hergibt.
        */
        bis: unscharf
          ? verschiebe(vorhersage.erwartet, vorhersage.streuungTage)
          : undefined,
        titel: `${katalog.name}: Quartalszahlen erwartet`,
        art: 'berichtssaison',
        bedeutung:
          `Abgeleitet aus dem bisherigen Meldemuster – im Vorjahr meldete das Unternehmen am ` +
          `${aufDeutsch(vorhersage.basis)}. Der genaue Tag wird wenige Wochen vorher bekannt gegeben. ` +
          `Für den Kurs zählt ohnehin nicht die Zahl selbst, sondern ihre Abweichung von der Erwartung.`,
        themen: ['aktie', 'wie-funktioniert-der-markt'],
        symbole: [katalog.symbol],
        geschaetzt: {
          basis: vorhersage.basis,
          streuungTage: vorhersage.streuungTage,
        },
        quelle: { label: daten.quelle.label, url: daten.quelle.url },
      })
    }
  }

  return ergebnis
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

/**
 * ISO-Datum als deutscher Fließtext.
 *
 * Die Momentaufnahme führt Daten als `2025-07-30` – richtig für einen
 * Datensatz, falsch mitten in einem Satz. Ohne diese Umwandlung stünde die
 * Maschinenschreibweise in der Erklärung unter dem Termin.
 */
function aufDeutsch(datum: string): string {
  const [jahr, monat, tag] = datum.split('-')
  return `${Number(tag)}. ${MONATE[Number(monat) - 1]} ${jahr}`
}

function verschiebe(datum: string, tage: number): string {
  const d = new Date(`${datum}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + tage)
  return d.toISOString().slice(0, 10)
}

/** Wie viele Unternehmen und Termine abgedeckt sind – gehört sichtbar auf die Seite. */
export function getQuartalsterminAbdeckung(): {
  unternehmen: number
  termine: number
} {
  const termine = getQuartalstermine()
  return {
    unternehmen: new Set(termine.map((t) => t.symbole?.[0])).size,
    termine: termine.length,
  }
}
