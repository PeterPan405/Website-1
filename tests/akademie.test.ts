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

import {
  fundamentalanalyse,
  fundamentalanalyseLektionen,
} from '../data/akademie/fundamentalanalyse.ts'
import {
  technischeAnalyse,
  technischeAnalyseLektionen,
} from '../data/akademie/technische-analyse.ts'
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

const bereiche = [technischeAnalyse, fundamentalanalyse]
const lektionen = [...technischeAnalyseLektionen, ...fundamentalanalyseLektionen]

console.log('\n— Aufbau —')

pruefe('es gibt zwei Bereiche', bereiche.length === 2)
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
