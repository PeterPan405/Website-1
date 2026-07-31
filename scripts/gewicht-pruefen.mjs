import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/**
 * Wie viel JavaScript eine Seite mitbringt – und wie viel sie darf.
 *
 * ## Warum es diese Prüfung gibt
 *
 * Weil JavaScript nur wächst. Jede Komponente, die „nur ein bisschen“
 * Interaktivität braucht, zieht ihre Bibliothek mit, und niemand merkt es:
 * Der Build bleibt grün, die Seite lädt am Schreibtisch in Millisekunden. Auf
 * einem fünf Jahre alten Telefon im Zug sind dieselben 400 Kilobyte eine
 * Sekunde Wartezeit, die niemand gemessen hat.
 *
 * Sie hat sich beim ersten Lauf sofort bezahlt gemacht: Rechnerseiten luden
 * 1.257 Kilobyte, alle anderen rund 800. Die Differenz war `recharts` mit 338
 * Kilobyte – im ersten Laden **jeder** Rechnerseite, auch derer, deren
 * Diagramm weit unter der ersten Bildschirmhöhe liegt. Seit die Diagramme
 * nachgeladen werden, sind es 862.
 *
 * `framer-motion` steckt weiterhin in der Kopfzeile und damit auf jeder der
 * 1.430 Seiten. Das ist der nächste Kandidat. Diese Prüfung soll solche
 * Entscheidungen sichtbar machen – nicht verbieten, aber sichtbar machen.
 *
 * ## Was gemessen wird
 *
 * Was die gebaute Seite tatsächlich lädt: die Summe aller `<script src>` aus
 * dem HTML. Nicht die Zahlen aus der Build-Ausgabe und nicht die Manifeste –
 * die beschreiben Nextjs' Sicht auf seine Bündel, und die ändert sich mit
 * jeder Version. Ein `<script>`-Tag ändert sich nicht.
 *
 * Gezählt wird die Größe auf der Platte, also **vor** der Übertragung. Über
 * die Leitung geht weniger, weil der Server komprimiert; das ist aber eine
 * Eigenschaft der Auslieferung und keine des Codes. Entpackt und ausgeführt
 * werden muss das Ganze, und das ist auf einem schwachen Gerät die teurere
 * Hälfte.
 *
 * Aufruf: `npm run gewicht`
 */

const PAKET = 'out'

/**
 * Die Obergrenzen, je Seitenart.
 *
 * Die Zahlen sind am tatsächlichen Stand geeicht und liegen rund zehn Prozent
 * darüber. Das ist Absicht: Eine Grenze, die genau auf dem Ist-Stand sitzt,
 * schlägt beim nächsten Zeilenumbruch an; eine, die doppelt so hoch liegt,
 * schlägt nie an. Zehn Prozent lassen normale Arbeit durch und fangen den
 * Fall, um den es geht – jemand importiert eine Bibliothek und merkt nicht,
 * was sie wiegt.
 *
 * Wer eine Grenze anhebt, soll das bewusst tun und dazuschreiben, was
 * dazugekommen ist. Ein stillschweigend erhöhter Wert ist keine Grenze.
 */
const BUDGETS = [
  { muster: /^\/$/, name: 'Startseite', grenzeKb: 860 },
  { muster: /^\/rechner\/[^/]+$/, name: 'Rechner', grenzeKb: 930 },
  { muster: /^\/maerkte\/[^/]+$/, name: 'Einzelnes Instrument', grenzeKb: 870 },
  { muster: /^\/maerkte$/, name: 'Marktübersicht', grenzeKb: 855 },
  { muster: /^\/globus$/, name: 'Globus', grenzeKb: 900 },
  { muster: /^\/news\/[^/]+$/, name: 'Nachricht', grenzeKb: 855 },
  { muster: /^\/lernen\//, name: 'Lernbereich', grenzeKb: 880 },
  { muster: /^\/akademie\//, name: 'Akademie', grenzeKb: 860 },
  /* Alles Übrige: die Seiten ohne eigene Interaktivität. */
  { muster: /./, name: 'Sonstige', grenzeKb: 860 },
]

function alleSeiten(ordner) {
  const gefunden = []
  const laufen = (pfad) => {
    for (const eintrag of readdirSync(pfad)) {
      if (eintrag === '_next') continue
      const voll = join(pfad, eintrag)
      if (statSync(voll).isDirectory()) laufen(voll)
      else if (voll.endsWith('.html')) gefunden.push(voll)
    }
  }
  laufen(ordner)
  return gefunden
}

function adresse(datei) {
  const rel = '/' + relative(PAKET, datei).split('\\').join('/')
  const ohne = rel.replace(/index\.html$/, '').replace(/\.html$/, '')
  return ohne.length > 1 ? ohne.replace(/\/$/, '') : '/'
}

/** Die Größe einer ausgelieferten Datei, gemerkt statt wiederholt gelesen. */
const groessen = new Map()
function groesse(pfad) {
  if (!groessen.has(pfad)) {
    try {
      groessen.set(pfad, statSync(join(PAKET, pfad)).size)
    } catch {
      groessen.set(pfad, 0)
    }
  }
  return groessen.get(pfad)
}

/** Summe aller Skripte, die dieses Dokument lädt. */
function gewichtVon(html) {
  const quellen = new Set()
  for (const treffer of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
    if (treffer[1].startsWith('/_next/')) quellen.add(treffer[1].slice(1))
  }
  let summe = 0
  for (const q of quellen) summe += groesse(q)
  return { bytes: summe, dateien: quellen.size }
}

const seiten = alleSeiten(PAKET)

/*
  Je Seitenart die schwerste Seite. Alle 1.430 aufzulisten wäre eine Wand aus
  Zahlen; interessant ist die Frage „reißt irgendeine Seite dieser Art das
  Budget?“, und die beantwortet der Höchstwert.
*/
const schwerste = new Map()
for (const datei of seiten) {
  const pfad = adresse(datei)
  const budget = BUDGETS.find((b) => b.muster.test(pfad))
  const { bytes, dateien } = gewichtVon(readFileSync(datei, 'utf8'))
  const bisher = schwerste.get(budget.name)
  if (!bisher || bytes > bisher.bytes) {
    schwerste.set(budget.name, { pfad, bytes, dateien, grenzeKb: budget.grenzeKb })
  }
}

console.log(`JavaScript je Seitenart (${seiten.length} Seiten geprüft)\n`)
console.log('  Art                    schwerste Seite                 geladen    Grenze')
console.log('  ' + '─'.repeat(76))

let ueberzogen = 0
for (const [name, wert] of schwerste) {
  const kb = wert.bytes / 1024
  const zuViel = kb > wert.grenzeKb
  if (zuViel) ueberzogen += 1
  console.log(
    `  ${zuViel ? '!' : ' '} ${name.padEnd(20)} ${wert.pfad.slice(0, 30).padEnd(30)} ` +
      `${kb.toFixed(0).padStart(5)} KB  ${String(wert.grenzeKb).padStart(5)} KB` +
      `  (${wert.dateien} Dateien)`
  )
}

if (ueberzogen === 0) {
  console.log('\nJede Seitenart bleibt in ihrem Budget.')
  process.exit(0)
}

console.error(
  `\n${ueberzogen} Seitenart(en) über dem Budget.\n\n` +
    'Das heißt nicht, dass etwas kaputt ist – es heißt, dass eine Seite mehr Code\n' +
    'lädt als vorgesehen, und dass jemand entscheiden sollte, ob das in Ordnung ist.\n' +
    'Meistens ist eine Bibliothek dazugekommen, die in einer Komponente steckt, die\n' +
    'auf vielen Seiten liegt. Wer die Grenze anhebt, schreibt dazu, was dazukam.'
)
process.exit(1)
