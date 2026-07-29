/**
 * Prüfungen für die Akademie.
 *
 * ## Warum es diese neben der Prüfung in `lib/akademie.ts` gibt
 *
 * Die dortige Prüfung bricht den Bau ab und deckt die Fälle ab, die eine
 * kaputte Seite ergäben – ein Verweis auf eine Grafik, die es nicht gibt, eine
 * Lektion, die in keiner Reihenfolge steht. Sie läuft nur, weil `lib/akademie.ts`
 * beim Rendern geladen wird.
 *
 * Hier stehen die Prüfungen, die etwas über die *Qualität* aussagen und die man
 * beim Schreiben sofort sehen will, ohne 791 Seiten zu bauen: dass jede Lektion
 * ihre Grenzen benennt, dass keine allein aus Fließtext besteht, dass die
 * Einstufungen zum Inhalt passen.
 *
 * Geladen wird über relative Pfade: Der Alias `@/` existiert nur im Build. Die
 * Datendateien kommen ohne Laufzeitimporte aus – ihre Typimporte werden beim
 * Type-Stripping entfernt –, deshalb funktioniert das hier überhaupt.
 */

import { readdirSync } from 'node:fs'

import { technischeAnalyseLektionen } from '../data/akademie/technische-analyse.ts'
import type { Bereich, Lektion } from '../data/akademie/types.ts'
import { figureMeta } from '../data/figures.ts'

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

/*
  Die Bereiche werden aus dem Ordner gelesen, nicht aufgezählt.

  Hier stand einmal `[technischeAnalyse, fundamentalanalyse]`. Als drei weitere
  Bereiche dazukamen, lief der Test weiter durch und prüfte sie schlicht nicht –
  achtzehn grüne Zeilen für zwei von fünf Bereichen. Das ist die schlechteste
  Sorte Prüfung: eine, die schweigt, obwohl sie nichts gesehen hat.

  `data/akademie/index.ts` lässt sich hier nicht laden, weil es den `@/`-Alias
  benutzt. Die einzelnen Bereichsdateien kommen ohne Laufzeitimporte aus.
*/
const bereiche: Bereich[] = []
const lektionen: Lektion[] = []

for (const datei of readdirSync('data/akademie').sort()) {
  if (!datei.endsWith('.ts') || datei === 'index.ts' || datei === 'types.ts') continue
  const modul: Record<string, unknown> = await import(`../data/akademie/${datei}`)
  for (const wert of Object.values(modul)) {
    if (Array.isArray(wert)) {
      if (
        wert.length > 0 &&
        typeof wert[0] === 'object' &&
        wert[0] !== null &&
        'slug' in wert[0]
      ) {
        lektionen.push(...(wert as Lektion[]))
      }
    } else if (typeof wert === 'object' && wert !== null && 'grenzen' in wert) {
      bereiche.push(wert as Bereich)
    }
  }
}

pruefe(
  'jede Bereichsdatei wurde eingelesen',
  bereiche.length ===
    readdirSync('data/akademie').filter(
      (d) => d.endsWith('.ts') && d !== 'index.ts' && d !== 'types.ts'
    ).length,
  `${bereiche.length} Bereiche aus dem Ordner`
)

console.log('\n— Aufbau —')

/*
  Die Zahl der Bereiche steht nicht fest im Test.

  Sie stand hier einmal auf zwei, und beim dritten Bereich wäre der Test
  gescheitert, obwohl nichts kaputt war – eine Prüfung, die beim Erweitern
  anschlägt, wird beim nächsten Mal einfach hochgezählt und prüft dann nichts
  mehr. Geprüft wird stattdessen, was tatsächlich schiefgehen kann: dass ein
  Bereich ohne Lektionen dasteht oder eine Lektion zu einem Bereich gehört,
  den es nicht gibt.
*/
pruefe('es gibt mindestens zwei Bereiche', bereiche.length >= 2)

const bereichsIds = new Set(bereiche.map((bereich) => bereich.id))
const heimatlos = lektionen.filter((lektion) => !bereichsIds.has(lektion.bereich))
pruefe(
  'jede Lektion gehört zu einem vorhandenen Bereich',
  heimatlos.length === 0,
  heimatlos.map((l) => `${l.slug} → ${l.bereich}`).join(', ')
)
pruefe(
  'jeder Bereich hat mindestens zehn Lektionen',
  bereiche.every(
    (bereich) => lektionen.filter((l) => l.bereich === bereich.id).length >= 10
  ),
  bereiche
    .map((b) => `${b.id}: ${lektionen.filter((l) => l.bereich === b.id).length}`)
    .join(', ')
)

const slugs = lektionen.map((lektion) => lektion.slug)
pruefe('kein Slug kommt doppelt vor', new Set(slugs).size === slugs.length)
pruefe(
  'jeder Slug ist als URL-Segment tauglich',
  slugs.every((slug) => /^[a-z0-9-]+$/.test(slug)),
  slugs.filter((slug) => !/^[a-z0-9-]+$/.test(slug)).join(', ')
)

for (const bereich of bereiche) {
  const eigene = lektionen.filter((lektion) => lektion.bereich === bereich.id)
  pruefe(
    `„${bereich.id}“: Reihenfolge und Lektionen decken sich`,
    bereich.reihenfolge.length === eigene.length &&
      eigene.every((lektion) => bereich.reihenfolge.includes(lektion.slug)),
    `${bereich.reihenfolge.length} in der Reihenfolge, ${eigene.length} Lektionen`
  )
}

/*
  Voraussetzungen dürfen nur zurückweisen.

  Eine Lektion, die eine spätere voraussetzt, schickt den Leser vor und wieder
  zurück. Beim Schreiben fällt das nicht auf, weil jede Lektion für sich stimmt –
  erst die Reihenfolge macht den Kreis sichtbar.
*/
const rueckwaerts: string[] = []
for (const bereich of bereiche) {
  for (const lektion of lektionen.filter((l) => l.bereich === bereich.id)) {
    const stelle = bereich.reihenfolge.indexOf(lektion.slug)
    for (const vorher of lektion.setztVoraus ?? []) {
      const stelleVorher = bereich.reihenfolge.indexOf(vorher)
      if (stelleVorher === -1 || stelleVorher >= stelle) {
        rueckwaerts.push(`${lektion.slug} → ${vorher}`)
      }
    }
  }
}
pruefe(
  'jede Voraussetzung steht vorher in der Reihenfolge',
  rueckwaerts.length === 0,
  rueckwaerts.join(', ')
)

console.log('\n— Redaktionelle Mindestanforderungen —')

/*
  Die Kernaussage ist der Satz über dem Text. Wer nach dem ersten Absatz
  abbricht, soll ihn mitgenommen haben. Ein Halbsatz taugt dafür nicht, und ein
  Absatz auch nicht – deshalb eine Unter- und eine Obergrenze.
*/
const kurzeKernaussagen = lektionen.filter(
  (lektion) => lektion.kernaussage.trim().length < 40
)
pruefe(
  'jede Lektion hat eine ausformulierte Kernaussage',
  kurzeKernaussagen.length === 0,
  kurzeKernaussagen.map((l) => l.slug).join(', ')
)
const langeKernaussagen = lektionen.filter(
  (lektion) => lektion.kernaussage.trim().length > 320
)
pruefe(
  'und keine, die zum Absatz geworden ist',
  langeKernaussagen.length === 0,
  langeKernaussagen.map((l) => l.slug).join(', ')
)

pruefe(
  'jede Lektion nennt mindestens zwei Stichworte',
  lektionen.every((lektion) => lektion.stichworte.length >= 2)
)
pruefe(
  'jede Lesezeit liegt zwischen 3 und 20 Minuten',
  lektionen.every((lektion) => lektion.dauer >= 3 && lektion.dauer <= 20)
)

/*
  Keine Lektion darf reiner Fließtext sein.

  Dieselbe Sache in acht Absätzen hintereinander liest niemand. Verlangt wird
  mindestens ein gliedernder Block – Tabelle, Liste, Formel, Grafik oder ein
  Kasten. Das ist keine Geschmacksfrage: Der Stoff besteht aus Rechenwegen und
  Abgrenzungen, und beide gehören nicht in einen Absatz.
*/
const nurText = lektionen.filter(
  (lektion) =>
    !lektion.inhalt.some((block) =>
      ['list', 'table', 'formula', 'figure', 'callout', 'keyfacts'].includes(block.type)
    )
)
pruefe(
  'keine Lektion besteht nur aus Absätzen',
  nurText.length === 0,
  nurText.map((l) => l.slug).join(', ')
)

/*
  Jede Lektion muss irgendwo sagen, wo die Methode aufhört.

  Der Kasten mit der Variante „warning“ ist dafür der Ort. Es gibt zwei
  Ausnahmen, und beide sind begründet: Reine Rechenwege haben keine Grenze im
  Sinne einer Fehldeutung, wenn der Text sie ohnehin nur definiert. Deshalb
  greift die Prüfung nur für die Einstufungen „Beobachtung“ und „Auslegung“ –
  also genau dort, wo die Aussagekraft umstritten ist.
*/
const ohneWarnung = lektionen.filter(
  (lektion) =>
    lektion.belegart !== 'definition' &&
    !lektion.inhalt.some(
      (block) => block.type === 'callout' && block.variant === 'warning'
    )
)
pruefe(
  'jede Beobachtung und jede Auslegung nennt ihre Grenzen',
  ohneWarnung.length === 0,
  ohneWarnung.map((l) => l.slug).join(', ')
)

pruefe(
  'jeder Bereich nennt mindestens drei Grenzen',
  bereiche.every((bereich) => bereich.grenzen.length >= 3),
  bereiche.map((b) => `${b.id}: ${b.grenzen.length}`).join(', ')
)

console.log('\n— Verweise —')

const grafiken = new Set(Object.keys(figureMeta))
const fehlendeGrafiken: string[] = []
for (const lektion of lektionen) {
  for (const block of lektion.inhalt) {
    if (block.type === 'figure' && !grafiken.has(block.figure)) {
      fehlendeGrafiken.push(`${lektion.slug}: ${block.figure}`)
    }
  }
}
pruefe(
  'jede eingebundene Grafik steht im Verzeichnis',
  fehlendeGrafiken.length === 0,
  fehlendeGrafiken.join(', ')
)

/*
  Grafiken sind teuer und sollen dort stehen, wo eine Form etwas erklärt, das
  Text nicht erklärt. Geprüft wird deshalb nicht „jede Lektion hat eine“,
  sondern dass der Bereich mit den Chartformen überhaupt genug davon hat.
*/
const mitGrafik = technischeAnalyseLektionen.filter((lektion) =>
  lektion.inhalt.some((block) => block.type === 'figure')
)
pruefe(
  'die technische Analyse zeigt mindestens fünf Grafiken',
  mitGrafik.length >= 5,
  `${mitGrafik.length} Lektionen mit Grafik`
)

/*
  Formeln stehen im Modell als eigener Blocktyp, damit sie einheitlich gesetzt
  werden. Steht eine Formel stattdessen als Fließtext in einem Absatz, sieht
  man das nur an Zeichen wie „÷“ – genau danach wird hier gesucht.
*/
const formelImAbsatz: string[] = []
for (const lektion of lektionen) {
  for (const block of lektion.inhalt) {
    if (block.type === 'paragraph' && /\s÷\s/.test(block.text)) {
      formelImAbsatz.push(lektion.slug)
    }
  }
}
pruefe(
  'keine Formel versteckt sich in einem Absatz',
  formelImAbsatz.length === 0,
  formelImAbsatz.join(', ')
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
