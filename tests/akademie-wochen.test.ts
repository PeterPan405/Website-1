/**
 * Prüfungen für die Verteilung der Akademie auf drei Wochen.
 *
 * ## Was hier geprüft wird – und warum genau das
 *
 * `lib/akademie-wochen.ts` rechnet die Reihenfolge aus dem Voraussetzungsgraph
 * aus, statt sie aufzuschreiben. Das ist die bessere Lösung, aber sie hat einen
 * eigenen Fehlermodus: Eine Rechnung, die danebenliegt, sieht genauso
 * plausibel aus wie eine, die stimmt. Eine Liste, in der eine Lektion fehlt,
 * fällt beim Lesen auf; eine Aufteilung, die eine Lektion verschluckt, nicht.
 *
 * Deshalb stehen hier die zwei Zusagen, die die Struktur macht:
 *
 * 1. **Jede Lektion kommt genau einmal vor.** Nicht keine, nicht zwei.
 * 2. **Keine Lektion steht vor ihrer Voraussetzung** – über die Wochengrenzen
 *    hinweg, nicht nur innerhalb einer Woche.
 *
 * Dazu die Gegenprobe: Eine Reihenfolge, die absichtlich falsch ist, muss von
 * derselben Prüfung beanstandet werden. Sonst prüft der Test nur, dass er
 * durchläuft. („Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.")
 */

import { getAlleLektionen, type Lektion } from '@/lib/akademie'
import { getAkademiewochen, lehrreihenfolge } from '@/lib/akademie-wochen'

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

/**
 * Die erste Lektion, die vor einer ihrer Voraussetzungen steht – oder nichts.
 *
 * Bewusst als eigene Funktion, damit unten dieselbe Prüfung auf eine
 * absichtlich zerstörte Reihenfolge losgelassen werden kann.
 */
function ersteVerletzung(reihe: readonly Lektion[]): string | undefined {
  const stelle = new Map(reihe.map((lektion, i) => [lektion.slug, i]))

  for (const [i, lektion] of reihe.entries()) {
    for (const vorher of lektion.setztVoraus ?? []) {
      const stelleVorher = stelle.get(vorher)
      if (stelleVorher !== undefined && stelleVorher > i) {
        return `„${lektion.slug}" (Platz ${i + 1}) setzt „${vorher}" (Platz ${stelleVorher + 1}) voraus`
      }
    }
  }
  return undefined
}

const alle = getAlleLektionen()
const reihe = lehrreihenfolge()
const wochen = getAkademiewochen()

/* ------------------------------------------------------- Die Reihenfolge */

pruefe(
  'die Lehrreihenfolge enthält jede Lektion genau einmal',
  reihe.length === alle.length && new Set(reihe.map((l) => l.slug)).size === alle.length,
  `${reihe.length} Einträge, ${new Set(reihe.map((l) => l.slug)).size} verschiedene, ${alle.length} Lektionen`
)

pruefe(
  'keine Lektion steht vor ihrer Voraussetzung',
  ersteVerletzung(reihe) === undefined,
  ersteVerletzung(reihe)
)

/*
  Die Gegenprobe.

  Zwei Lektionen zu tauschen, die nichts miteinander zu tun haben, ändert
  nichts – deshalb wird gezielt ein echtes Paar gesucht und umgedreht. Findet
  sich keines, hätte die Prüfung oben nichts zu tun gehabt, und auch das gehört
  gemeldet.
*/
const paar = reihe.flatMap((lektion, i) => {
  const vorher = (lektion.setztVoraus ?? [])
    .map((slug) => reihe.findIndex((l) => l.slug === slug))
    .filter((stelle) => stelle !== -1)
  return vorher.length ? [{ spaeter: i, frueher: Math.max(...vorher) }] : []
})[0]

pruefe(
  'es gibt überhaupt Voraussetzungen zu prüfen',
  paar !== undefined,
  'keine einzige Lektion nennt eine Voraussetzung – dann prüft der Test oben nichts'
)

if (paar) {
  const verdreht = [...reihe]
  const hilf = verdreht[paar.frueher]
  verdreht[paar.frueher] = verdreht[paar.spaeter]
  verdreht[paar.spaeter] = hilf

  pruefe(
    'eine vertauschte Reihenfolge wird beanstandet',
    ersteVerletzung(verdreht) !== undefined,
    'die Prüfung findet nichts, obwohl absichtlich zwei abhängige Lektionen getauscht wurden'
  )
}

/* ------------------------------------------------------------ Die Wochen */

pruefe('es sind drei Wochen', wochen.length === 3, `${wochen.length} Wochen`)

pruefe(
  'die Wochen tragen die Nummern 1 bis 3',
  wochen.every((woche, i) => woche.nummer === i + 1),
  wochen.map((w) => w.nummer).join(', ')
)

pruefe(
  'die Wochen laufen parallel zu Beginner, Fortgeschritten und Profi',
  wochen.map((w) => w.parallelZu).join('|') === 'Beginner|Fortgeschritten|Profi',
  wochen.map((w) => w.parallelZu).join('|')
)

const verteilt = wochen.flatMap((woche) => woche.lektionen)

pruefe(
  'die Wochen enthalten zusammen jede Lektion genau einmal',
  verteilt.length === alle.length &&
    new Set(verteilt.map((l) => l.slug)).size === alle.length,
  `${verteilt.length} verteilt, ${new Set(verteilt.map((l) => l.slug)).size} verschieden, ${alle.length} vorhanden`
)

pruefe(
  'die Wochen halten die Lehrreihenfolge ein',
  verteilt.map((l) => l.slug).join('|') === reihe.map((l) => l.slug).join('|'),
  'die Aufteilung ordnet um, statt nur zu schneiden'
)

/*
  Gleich große Wochen, mit dem Rest hinten.

  Die Zusage ist „rund 23 je Woche". Ein Schnitt, der 40/15/15 ergäbe, wäre
  technisch gültig und für einen Leser trotzdem falsch – deshalb steht hier
  eine Grenze und nicht nur „größer null".
*/
const groessen = wochen.map((woche) => woche.lektionen.length)

pruefe(
  'keine Woche ist mehr als eine Lektion größer als eine andere',
  Math.max(...groessen) - Math.min(...groessen) <= 1,
  groessen.join(' / ')
)

pruefe(
  'die letzte Woche trägt den Rest',
  groessen[2] >= groessen[0] && groessen[2] >= groessen[1],
  groessen.join(' / ')
)

for (const woche of wochen) {
  pruefe(
    `Woche ${woche.nummer} nennt einen Titel und einen roten Faden`,
    woche.titel.trim().length >= 10 && woche.warum.trim().length >= 60,
    `Titel ${woche.titel.trim().length} Zeichen, warum ${woche.warum.trim().length} Zeichen`
  )
}

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert`)
if (gescheitert > 0) process.exit(1)
