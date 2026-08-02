/**
 * Prüfungen für die Umzugsdatei.
 *
 * Das Einlesen ist die kritische Richtung: Es schreibt in den Speicher des
 * Nutzers. Deshalb vor allem Fälle, in denen die Datei **nicht** stimmt –
 * jede davon muss an einem Satz scheitern, nie an einem halben Import.
 */

import {
  BESTAENDE,
  UMZUG_KENNUNG,
  baueUmzug,
  pruefeUmzug,
  zaehleEintraege,
} from '../lib/umzug.ts'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

// ---------------------------------------------------------------- Bauen
const speicher = new Map<string, string>([
  ['fk-merkliste', '["apple","dax"]'],
  ['fk-theme', 'dark'],
  ['fk-suchluecken', '["sollte nicht mitkommen"]'],
])
const datei = baueUmzug((schluessel) => speicher.get(schluessel) ?? null, '2026-08-02')

pruefe(
  'nur vorhandene Bestände kommen in die Datei',
  Object.keys(datei.bestaende).length === 2
)
pruefe(
  'die Werte bleiben wörtlich erhalten',
  datei.bestaende['fk-merkliste'] === '["apple","dax"]'
)
pruefe(
  'das Suchlücken-Protokoll zieht nicht mit um',
  !('fk-suchluecken' in datei.bestaende)
)
pruefe(
  'Kennung und Zeitpunkt stehen drin',
  datei.kennung === UMZUG_KENNUNG && datei.erstellt === '2026-08-02'
)

// ------------------------------------------------------------- Einlesen
const hin = pruefeUmzug(JSON.stringify(datei))
pruefe('die eigene Datei liest sich wieder ein', 'inhalt' in hin)
if ('inhalt' in hin) {
  pruefe(
    'die Merkliste wird gezählt, das Farbschema nicht',
    hin.inhalt.eintraege.find((e) => e.schluessel === 'fk-merkliste')?.anzahl === 2 &&
      hin.inhalt.eintraege.find((e) => e.schluessel === 'fk-theme')?.anzahl === null
  )
}

pruefe('Nicht-JSON scheitert an einem Satz', 'fehler' in pruefeUmzug('kein json'))
pruefe(
  'fremde Dateien werden abgewiesen',
  'fehler' in pruefeUmzug('{"kennung":"etwas-anderes","fassung":1,"bestaende":{}}')
)
pruefe(
  'eine fremde Fassung wird benannt, nicht geraten',
  (() => {
    const ergebnis = pruefeUmzug(
      `{"kennung":"${UMZUG_KENNUNG}","fassung":2,"bestaende":{"fk-theme":"dark"}}`
    )
    return 'fehler' in ergebnis && ergebnis.fehler.includes('Fassung')
  })()
)
pruefe(
  'ohne übernehmbaren Bestand kein Erfolg',
  'fehler' in pruefeUmzug(`{"kennung":"${UMZUG_KENNUNG}","fassung":1,"bestaende":{}}`)
)

const mitUnbekanntem = pruefeUmzug(
  `{"kennung":"${UMZUG_KENNUNG}","fassung":1,"bestaende":{"fk-theme":"dark","fk-zukunft":"x","fk-boese":123}}`
)
pruefe(
  'unbekannte Schlüssel werden benannt und übersprungen, nicht übernommen',
  'inhalt' in mitUnbekanntem &&
    mitUnbekanntem.inhalt.unbekannt.join(',') === 'fk-zukunft' &&
    !('fk-zukunft' in mitUnbekanntem.bestaende) &&
    !('fk-boese' in mitUnbekanntem.bestaende)
)

pruefe(
  'jeder registrierte Bestand hat einen Anzeigenamen',
  BESTAENDE.every((eintrag) => eintrag.name.length > 0)
)
pruefe('Zählung: Objekt an seinen Schlüsseln', zaehleEintraege('{"a":1,"b":2}') === 2)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
