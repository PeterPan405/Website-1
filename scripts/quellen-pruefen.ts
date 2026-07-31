import { adresseFuer, nachrichtenquellen } from '../data/nachrichtenquellen.ts'
import { bewerte, lageJeRubrik, ohneQuelle, type Befund } from '../lib/quellenprobe.ts'

/**
 * Die Vorabprüfung vor einem Nachrichtenlauf.
 *
 * ## Wofür
 *
 * Damit die Ausgabe nicht still dünner wird. Eine Quelle kann auf drei Arten
 * ausfallen, und nur eine davon fällt auf – die Begründung steht im Kopf von
 * `lib/quellenprobe.ts`. Dieses Skript holt jede Adresse aus
 * `data/nachrichtenquellen.ts`, wendet dieselbe Bewertung an und sagt vor dem
 * ersten geschriebenen Satz, welcher Kanal heute offen ist.
 *
 * ## Warum das ein Läufer machen muss
 *
 * Weil die Entwicklungsumgebung nur GitHub und npm erreicht; jede andere
 * Adresse endet am Egress-Proxy mit 403. Der Aufruf gehört deshalb in
 * `.github/workflows/quellen-pruefen.yml`. Lokal ausgeführt meldet das Skript
 * jede Quelle als „stumm“ – das ist keine Aussage über die Quelle, und es steht
 * am Ende ausdrücklich dabei.
 *
 * ## Was das Skript nicht tut
 *
 * Es schreibt nichts ins Repository und lädt keinen Text herunter, der
 * irgendwo liegen bliebe. Gemessen werden Zeichen, kein Inhalt wird
 * ausgegeben – fremde Texte gehören nicht hierher, und für das Lesen einer
 * Quelle gibt es `quellen-holen.yml`.
 *
 * Aufruf: `npm run quellenprobe`
 */

const KOPF = {
  'User-Agent':
    'Mozilla/5.0 (compatible; IMInvestsBot/1.0; +https://iminvests.de) Quellenprobe vor dem Nachrichtenlauf',
  'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
}

/** Markup heraus, Text behalten – dieselbe Behandlung wie in `quellen-holen.yml`. */
function zuText(roh: string): string {
  return roh
    .replace(/<(script|style|noscript|svg)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|div|li|tr|h[1-6]|section|article|br)\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, zahl) => String.fromCharCode(Number(zahl)))
    .replace(/[ \t\r\f\v]+/g, ' ')
    .replace(/\n\s*\n\s*/g, '\n\n')
    .trim()
}

const ZEITGRENZE_MS = 25_000

async function hole(adresse: string): Promise<{ status: number; text: string }> {
  const abbruch = AbortSignal.timeout(ZEITGRENZE_MS)
  try {
    const antwort = await fetch(adresse, { headers: KOPF, signal: abbruch })
    if (!antwort.ok) return { status: antwort.status, text: '' }
    return { status: antwort.status, text: zuText(await antwort.text()) }
  } catch (fehler) {
    /*
      Ein Netzfehler ist kein Statuscode. Er wird trotzdem als 0 gemeldet, weil
      die Bewertung nur zwischen „antwortet mit Inhalt“ und „antwortet nicht“
      unterscheidet – und weil ein erfundener Statuscode schlimmer wäre als
      eine Null, die sichtbar keine ist.
    */
    const grund = fehler instanceof Error ? fehler.message : String(fehler)
    process.stdout.write(`     (${grund})\n`)
    return { status: 0, text: '' }
  }
}

const ZEICHEN: Record<Befund['urteil'], string> = {
  brauchbar: 'OK  ',
  alt: 'ALT ',
  leer: 'LEER',
  gesperrt: 'SPER',
  stumm: 'STUM',
}

const heute = (process.argv[2] ?? new Date().toISOString().slice(0, 10)).slice(0, 10)

console.log(`Quellenprobe für den ${heute}\n`)

const eintraege: { rubrik: string; adresse: string; befund: Befund }[] = []

for (const rubrik of nachrichtenquellen) {
  console.log(`\n${rubrik.rubrik} – ${rubrik.zweck}`)
  for (const quelle of rubrik.quellen) {
    const adresse = adresseFuer(quelle, heute)
    const { status, text } = await hole(adresse)
    const befund = bewerte(status, text, heute)
    eintraege.push({ rubrik: rubrik.rubrik, adresse, befund })
    console.log(
      `  ${ZEICHEN[befund.urteil]} ${quelle.name}${quelle.primaer ? ' (Primärquelle)' : ''}`
    )
    console.log(`       ${adresse}`)
    console.log(`       ${befund.grund}`)
  }
}

const lagen = lageJeRubrik(eintraege)
const leer = ohneQuelle(lagen)

/*
  Wenn **keine einzige** Quelle antwortet, liegt es fast sicher nicht an den
  Quellen.

  Aus der Entwicklungsumgebung dieses Projekts endet jede Adresse außerhalb von
  GitHub und npm am Egress-Proxy. Ohne diesen Hinweis läse sich das Ergebnis
  als „achtzehn tote Quellen“ – und der nächste Schritt wäre, eine gepflegte
  und geprüfte Liste wegzuwerfen.
*/
if (eintraege.every((eintrag) => eintrag.befund.urteil === 'stumm')) {
  console.log('\n' + '─'.repeat(78))
  console.error(
    '\nKeine einzige Quelle hat geantwortet.\n\n' +
      'Das ist keine Aussage über die Quellen, sondern über den Ort des Aufrufs:\n' +
      'Aus der Entwicklungsumgebung erreicht dieses Projekt nur GitHub und npm,\n' +
      'jede andere Adresse endet am Egress-Proxy. Die Prüfung gehört auf einen\n' +
      'Läufer – `.github/workflows/quellen-pruefen.yml`.\n\n' +
      'Vor dem Ändern der Quellenliste also erst dort laufen lassen.'
  )
  process.exit(2)
}

console.log('\n' + '─'.repeat(78))
console.log('Was heute zu holen ist\n')
for (const lage of lagen) {
  if (lage.brauchbar.length === 0) {
    console.log(`  ${lage.rubrik}: keine brauchbare Quelle.`)
    continue
  }
  console.log(`  ${lage.rubrik}: ${lage.brauchbar.length} von ${lage.geprueft.length}`)
  for (const adresse of lage.brauchbar) console.log(`     ${adresse}`)
}

/*
  Die Adressen der brauchbaren Quellen noch einmal am Stück.

  Damit lässt sich der nächste Schritt ohne Abtippen anschließen: Was hier
  steht, geht als `urls` in `quellen-holen.yml` und kommt als gelesener Text
  zurück. Zwei Werkzeuge, ein Ablauf.
*/
const alleBrauchbaren = lagen.flatMap((lage) => lage.brauchbar)
if (alleBrauchbaren.length > 0) {
  console.log('\nFür quellen-holen.yml, Feld „urls“:\n')
  console.log(alleBrauchbaren.join(' '))
}

console.log('\n' + '─'.repeat(78))
if (leer.length === 0) {
  console.log(
    `Alle ${lagen.length} Rubriken haben mindestens eine Quelle, die heute Text liefert.`
  )
  process.exit(0)
}

console.error(
  `\n${leer.length} Rubrik(en) ohne brauchbare Quelle: ${leer.join(', ')}.\n\n` +
    'Das heißt nicht, dass der Lauf ausfällt – es heißt, dass zu diesen Themen\n' +
    'heute nichts Belegtes entsteht, wenn niemand eine Ausweichquelle nachträgt.\n' +
    'Genau dafür gibt es diese Prüfung: Der Ausfall soll vor dem Schreiben\n' +
    'sichtbar sein und nicht danach als „nur sechs Artikel geworden“.\n\n' +
    'Kommt dieselbe Rubrik mehrfach hier vor, gehört eine Quelle in\n' +
    '`data/nachrichtenquellen.ts` ersetzt.'
)
process.exit(1)
