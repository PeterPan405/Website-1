/**
 * Prüfungen für die Vertonung der Lernseiten.
 *
 * ## Warum ausgerechnet die Kennungen
 *
 * Die Vertonung hat zwei Enden, und zwischen ihnen liegt eine Nacht.
 * Gesprochen wird auf einem Läufer aus `lese-texte/aufgaben.json`, abgespielt
 * wird im Browser aus `data/lese-audio.json`. Verbunden sind beide nur über
 * eine Zeichenkette – die Kennung `lernen/aktie/beginner` – und einen
 * Fingerabdruck über den gesprochenen Text.
 *
 * Genau dort läuft so etwas auseinander, und zwar lautlos: Wer die Kennung an
 * einer Stelle ändert, bekommt keinen Fehler. Die Aufnahmen blieben liegen,
 * die Seiten fielen still auf die Gerätestimme zurück, und der einzige Hinweis
 * wäre, dass es „irgendwie nicht mehr so gut klingt".
 *
 * Geprüft wird gegen die echten Daten: alle 34 Lernthemen mal drei Stufen und
 * alle Akademielektionen.
 */

import verzeichnis from '@/data/lese-audio.json'
import { aufnahmeAdresse, aufnahmeFuer, vorleseaufnahme } from '@/lib/lese-audio'
import { alleAufgaben } from '@/scripts/lese-texte-schreiben'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden += 1
    return
  }
  gescheitert += 1
  console.error(`  FEHLER: ${name}${hinweis ? ` – ${hinweis}` : ''}`)
}

const aufgaben = alleAufgaben()

console.log(`Vertonung: ${aufgaben.length} Seiten auf der Liste.`)

// ------------------------------------------------------- Die Arbeitsliste

{
  const kennungen = aufgaben.map((aufgabe) => aufgabe.id)
  pruefe(
    'Jede Seite hat eine eindeutige Kennung',
    new Set(kennungen).size === kennungen.length,
    `${kennungen.length - new Set(kennungen).size} doppelt`
  )
}

pruefe(
  'Es stehen nur Seiten auf der Liste, die Text haben',
  aufgaben.every((aufgabe) => aufgabe.abschnitte.join('').trim() !== '')
)

pruefe(
  'Jede Aufgabe trägt einen Fingerabdruck',
  aufgaben.every((aufgabe) => /^[0-9a-f]{16}$/.test(aufgabe.hash))
)

{
  /*
    Die Reihenfolge ist die Zuteilung von Rechenzeit: Was vorn steht, wird in
    der ersten Nacht gesprochen. Ein Umsortieren, das die Profi-Stufen nach
    vorn zöge, verschöbe den Nutzen um Tage, ohne dass irgendwo etwas
    anschlüge.
  */
  const ersteProfi = aufgaben.findIndex((aufgabe) => aufgabe.id.endsWith('/profi'))
  const letzteBeginner = aufgaben.findLastIndex((aufgabe) =>
    aufgabe.id.endsWith('/beginner')
  )
  const letzteAkademie = aufgaben.findLastIndex((aufgabe) =>
    aufgabe.id.startsWith('akademie/')
  )

  pruefe(
    'Die Beginner-Stufen kommen vor den Profi-Stufen',
    ersteProfi > letzteBeginner,
    `erste Profi-Stufe an ${ersteProfi}, letzte Beginner-Stufe an ${letzteBeginner}`
  )
  pruefe(
    'Die Akademie kommt vor den Profi-Stufen',
    ersteProfi > letzteAkademie,
    `erste Profi-Stufe an ${ersteProfi}, letzte Lektion an ${letzteAkademie}`
  )
}

// -------------------------------------------------------- Das Verzeichnis

{
  /*
    Die Gegenrichtung. Ein Eintrag ohne Seite heißt: Die Seite ist umbenannt
    oder entfernt worden, und auf dem Server liegt eine verwaiste Datei. Das
    kostet nur Platz – ist aber der erste Hinweis darauf, dass die Kennungen
    nicht mehr zusammenpassen.
  */
  const bekannt = new Set(aufgaben.map((aufgabe) => aufgabe.id))
  const verwaist = Object.keys(verzeichnis.aufnahmen).filter((id) => !bekannt.has(id))
  pruefe(
    'Zu jeder Aufnahme im Verzeichnis gibt es eine Seite',
    verwaist.length === 0,
    verwaist.slice(0, 3).join(', ')
  )
}

{
  /*
    Die Marken sind die Abschnittsanzeige. Stimmt ihre Zahl nicht mit den
    Abschnitten überein, zeigt die Leiste „Abschnitt 14 von 12", und das
    Springen landet an der falschen Stelle.

    Geprüft wird nur, wo der Fingerabdruck noch stimmt: Eine Aufnahme zu einem
    inzwischen geänderten Text darf abweichen – sie wird ohnehin neu
    gesprochen, und bis dahin zeigt die Seite die Gerätestimme.
  */
  const schief = aufgaben.filter((aufgabe) => {
    const aufnahme = aufnahmeFuer(aufgabe.id)
    return (
      aufnahme !== null &&
      aufnahme.hash === aufgabe.hash &&
      aufnahme.marken.length !== aufgabe.abschnitte.length
    )
  })
  pruefe(
    'Jede gültige Aufnahme hat so viele Marken wie Abschnitte',
    schief.length === 0,
    schief.map((aufgabe) => aufgabe.id).join(', ')
  )
}

pruefe(
  'Die Adresse entsteht aus der Kennung',
  aufnahmeAdresse('lernen/aktie/beginner') === '/lese-audio/lernen/aktie/beginner.m4a'
)

pruefe(
  'Eine Seite ohne Aufnahme meldet nichts',
  vorleseaufnahme('lernen/gibt-es-nicht/beginner') === null
)

{
  const gesprochen = Object.keys(verzeichnis.aufnahmen).length
  const anteil = aufgaben.length > 0 ? (gesprochen / aufgaben.length) * 100 : 0
  console.log(
    `  ${gesprochen} von ${aufgaben.length} Seiten gesprochen (${anteil.toFixed(0)} %).`
  )
}

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
