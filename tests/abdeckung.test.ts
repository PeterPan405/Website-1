/**
 * Prüfungen für die Auskunft über fehlende Unternehmenszahlen.
 *
 * ## Was hier schiefging und warum es niemand sah
 *
 * Die Zuordnung „Land → warum fehlen die Zahlen“ stand zweimal da: in
 * `lib/abdeckung.ts` für `/quellen` und in `scripts/abdeckung.ts` für das
 * Terminal. Am 31. Juli 2026 klärte eine Sonde, dass das offene
 * ESEF-Verzeichnis keine deutschen Abschlüsse führt. Die Website wurde
 * berichtigt, das Skript nicht – und behauptete drei Wochen weiter, es fehle
 * nur „die geprüfte Zeile je Unternehmen“. Beide Fassungen sahen gepflegt aus.
 *
 * Die Doppelung ist weg. Bleibt der zweite stille Fehler, den dieselbe Tabelle
 * erlaubt: Ihr Schlüssel ist der **deutsche Ländername**. Steht dort einer, den
 * `data/laender/namen.ts` nicht kennt – „Grossbritannien“ statt „Vereinigtes
 * Königreich“, ein Bindestrich zu viel –, greift auf `/quellen` still der
 * Rückfall „nicht untersucht“. Nichts bricht, nichts warnt; die Auskunft ist
 * einfach weg.
 *
 * Genau das prüft diese Datei, samt Gegenprobe.
 */

import { laendernamen } from '@/data/laender/namen'
import { marketDefinitions } from '@/data/markets'
import { quellenlage } from '@/lib/abdeckung'
import { getBilanzzahlen } from '@/lib/fundamentaldaten'

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

const bekannteNamen = new Set(Object.values(laendernamen))

/** Die Schlüssel, die auf keinen geführten Ländernamen passen. */
function unbekannteSchluessel(tabelle: Readonly<Record<string, string>>): string[] {
  return Object.keys(tabelle).filter((land) => !bekannteNamen.has(land))
}

pruefe(
  'jeder Schlüssel der Quellenlage ist ein geführter Ländername',
  unbekannteSchluessel(quellenlage).length === 0,
  unbekannteSchluessel(quellenlage).join(', ')
)

/*
  Die Gegenprobe. Ohne sie prüft der Test oben nur, dass er durchläuft – und
  eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.
*/
pruefe(
  'ein verschriebener Ländername wird beanstandet',
  unbekannteSchluessel({ ...quellenlage, Grossbritannien: 'erfunden' }).length === 1,
  'die Prüfung übersieht einen Schlüssel, den es nicht gibt'
)

/* ------------------------------------ Passt der Satz zum Bestand? */

const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock')

/** Wie viele Aktien eines Landes Bilanzzahlen haben – und wie viele nicht. */
function stand(landname: string): { belegt: number; offen: number } {
  let belegt = 0
  let offen = 0
  for (const aktie of aktien) {
    const name = aktie.sitzland ? (laendernamen[aktie.sitzland] ?? aktie.sitzland) : ''
    if (name !== landname) continue
    if (getBilanzzahlen(aktie.ticker)) belegt++
    else offen++
  }
  return { belegt, offen }
}

for (const [land, satz] of Object.entries(quellenlage)) {
  const { belegt, offen } = stand(land)

  /*
    Ein Satz über ein Land ohne offene Titel ist totes Gewicht: Er erscheint
    weder auf `/quellen` noch im Skript, weil beide nur die Lücke auflisten.
  */
  pruefe(
    `${land} hat überhaupt fehlende Zahlen`,
    offen > 0,
    `${belegt} belegt, ${offen} offen – der Satz wird nirgends gezeigt`
  )

  /*
    „teilweise zugeordnet“ ist eine Tatsachenbehauptung: Es muss Titel dieses
    Landes geben, die über diese Quelle bereits Zahlen haben. Steht es an einem
    Land ohne einen einzigen belegten Titel, ist es keine Teilzuordnung,
    sondern gar keine – und der Leser bekommt eine falsche Aussicht.
  */
  if (satz.includes('teilweise')) {
    pruefe(
      `${land}: „teilweise" ist belegt`,
      belegt > 0,
      `kein einziger Titel dieses Landes hat Zahlen – dann ist nichts zugeordnet`
    )
  }
}

/*
  Deutschland eigens: Es ist der Fall, an dem die Doppelung auseinanderlief,
  und die alte Behauptung ist so verlockend richtig klingend, dass sie
  jederzeit zurückkommen kann.
*/
pruefe(
  'Deutschland nennt die Quelle als Grund, nicht eine fehlende Zuordnung',
  quellenlage.Deutschland !== undefined &&
    !quellenlage.Deutschland.includes('Zuordnung') &&
    quellenlage.Deutschland.includes('Unternehmensregister'),
  quellenlage.Deutschland ?? 'kein Eintrag'
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert`)
if (gescheitert > 0) process.exit(1)
