/**
 * Die Texte, die unter jeden Beitrag in einem sozialen Netz gehören.
 *
 * ## Warum das eine gemeinsame Datei ist
 *
 * Weil dieselben drei Dinge unter jeden Beitrag müssen – Rechtshinweis,
 * KI-Kennzeichnung, Hashtags –, und zwar auf **jedem** Kanal: YouTube,
 * Instagram und was noch kommt. Stünden sie je Kanal einzeln da, würde die
 * nächste Änderung an einer Stelle vergessen. Das ist in diesem Projekt schon
 * zweimal passiert, beim KI-Hinweis auf den Podcastfolgen und beim
 * Erscheinungstag im Karussell.
 *
 * ## Der Rechtshinweis ist Wortlaut des Betreibers
 *
 * Er stammt aus der Website („Keine Anlageberatung – nur Wissensvermittlung")
 * und ist hier absichtlich **nicht** umformuliert. Ein Haftungshinweis, den
 * jemand für einen Kanal hübscher macht, ist auf diesem Kanal ein anderer
 * Hinweis.
 *
 * ## Hashtags kommen aus dem Tag, nicht aus einer Liste
 *
 * Bis zum 9. August 2026 trug jede Podcastfolge dieselben fünf Schlagworte
 * plus die Kategorienamen der Ausgabe – „#Märkte #Börse #Aktien #Finanzen
 * #Marktupdate #Finanzbildung". Das ist an jedem Tag richtig und an keinem
 * Tag eine Auskunft: Wer nach Gold sucht, findet die Folge nicht, in der es um
 * Gold ging.
 *
 * Deshalb kommen die ersten Schlagworte jetzt aus den `relatedSymbols` und
 * `relatedTopics` der Meldungen des Tages – also aus dem, worüber die Ausgabe
 * wirklich spricht. Die festen Schlagworte bleiben dahinter stehen; sie
 * ordnen den Kanal ein, nicht den Beitrag.
 */

import type { DailyEdition, EditionItem } from '../data/editions/types.ts'

/**
 * Der Rechtshinweis, Wortlaut des Betreibers.
 *
 * Er nennt beides – keine Beratung und die KI-Unterstützung –, weil beides
 * unter jeden Beitrag gehört und ein zweiter Absatz daneben nur die Chance
 * erhöht, dass einer davon irgendwann fehlt.
 */
export const RECHTSHINWEIS = [
  'Keine Anlageberatung – nur Wissensvermittlung.',
  'Alle Inhalte dienen der allgemeinen Information und Bildung. Sie stellen keine Anlage-, Rechts- oder Steuerberatung dar und berücksichtigen weder deine persönliche Situation noch deine Anlageziele. Kurse, Kennzahlen und Rechenergebnisse sind Beispielwerte beziehungsweise Schätzungen. Jede Kapitalanlage ist mit Risiken verbunden, bis zum vollständigen Verlust des eingesetzten Geldes.',
  'Hinweis: Die Inhalte wurden mit Unterstützung von KI erstellt.',
].join(' ')

/**
 * Schlagworte, die immer dabei sind.
 *
 * Sie sagen, um was für einen Kanal es sich handelt. Für die Auffindbarkeit
 * eines einzelnen Beitrags leisten sie wenig – dafür sind die Themen-Tags da.
 */
const FESTE_TAGS = ['#news', '#nachrichten', '#investment', '#aktien', '#finanzbildung']

/**
 * Was ein Symbol oder Lernthema als Schlagwort heißt.
 *
 * Nur die Fälle, in denen der Bezeichner aus den Daten kein brauchbares
 * Schlagwort ergibt. Alles andere geht durch `ausBezeichner()` – `dax` wird
 * `#dax`, `dow-jones` wird `#dowjones`.
 */
const BESONDERE_NAMEN: Readonly<Record<string, string>> = {
  'eur-usd': '#euro',
  'wie-funktioniert-der-markt': '#boerse',
  'notenbanken-geldpolitik': '#zinsen',
  anlegerpsychologie: '#psychologie',
  rohstoffe: '#rohstoffe',
  staatsanleihe: '#anleihen',
  'sp-500': '#sp500',
  'euro-stoxx-50': '#eurostoxx',
  'nikkei-225': '#nikkei',
  'hang-seng': '#hangseng',
  'russell-2000': '#russell2000',
  'nasdaq-100': '#nasdaq',
}

/** `dow-jones` → `#dowjones`. Umlaute bleiben, Bindestriche fallen weg. */
function ausBezeichner(wert: string): string {
  const sauber = wert.toLowerCase().replaceAll(/[^a-zäöüß0-9]/g, '')
  return sauber ? `#${sauber}` : ''
}

function alsTag(wert: string): string {
  return BESONDERE_NAMEN[wert] ?? ausBezeichner(wert)
}

/**
 * Die Schlagworte einer Tagesausgabe.
 *
 * Reihenfolge ist Absicht: erst die Symbole, dann die Lernthemen, dann die
 * festen. Ein Symbol ist das, wonach jemand sucht – „Gold", „DAX" –, ein
 * Lernthema die Einordnung dahinter.
 *
 * `grenze` deckelt die Gesamtzahl. Instagram wertet ab etwa dreißig
 * Schlagworten nichts mehr, und eine Wand aus Rauten liest niemand.
 */
export function themenTags(edition: DailyEdition, grenze = 12): string[] {
  const alle: EditionItem[] = [...edition.top, ...(edition.further ?? [])]

  const symbole = alle.flatMap((eintrag) => eintrag.relatedSymbols ?? [])
  const themen = alle.flatMap((eintrag) => eintrag.relatedTopics ?? [])

  // `Set` behält die Reihenfolge des ersten Auftretens – das ist genau die
  // gewünschte: Was in der obersten Meldung steht, steht auch vorn.
  const gesammelt = [...new Set([...symbole, ...themen].map(alsTag).filter(Boolean))]

  // Erst kürzen, dann die festen anhängen. Andersherum – kürzen über die
  // ganze Liste – schoben die Themen des Tages die festen hinaus, und an
  // einem Tag mit vielen Einzelwerten stand am Ende kein `#aktien` mehr da.
  const platzFuerThemen = Math.max(0, grenze - FESTE_TAGS.length)
  return [...new Set([...gesammelt.slice(0, platzFuerThemen), ...FESTE_TAGS])]
}

/** Dieselben Schlagworte als eine Zeile. */
export function hashtagZeile(edition: DailyEdition, grenze = 12): string {
  return themenTags(edition, grenze).join(' ')
}
