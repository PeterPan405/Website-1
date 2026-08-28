/**
 * Entscheidet, ob die Nachrichtenkette geweckt werden muss – und sagt es in
 * zwei Zeilen, die eine Shell übernehmen kann.
 *
 * Aufgerufen aus `.github/workflows/kurse-dauerlauf.yml`, in jeder fünften
 * Runde der Kursschleife. Warum ausgerechnet dort, steht in
 * `lib/tageswecker.ts`: Der Dauerlauf war in der Nacht auf den 28. August
 * 2026 das Einzige, was lief.
 *
 * Ausführen:
 *
 *     WECK_AUSGABE_STEHT=0 node --experimental-strip-types \
 *       --import ./scripts/alias-hook.mjs scripts/tagesausgabe-wecken.ts
 *
 * ## Warum die Tatsache von außen kommt
 *
 * Die Frage „steht die Ausgabe des Tages auf `main`?" beantwortet der
 * Workflow selbst, mit `curl` gegen die GitHub-Schnittstelle, und reicht die
 * Antwort in `WECK_AUSGABE_STEHT` herein. Der Umweg ist Absicht: Ein Abruf
 * aus diesem Skript heraus wäre ein Weg, der sich hier nirgends prüfen lässt
 * – und *wo die einzige prüfbare Umgebung nicht die ist, in der es
 * kaputtgeht, ist „müsste jetzt gehen" keine Aussage.* So bleibt hier nur
 * Entscheidung, und die ist in `tests/tageswecker.test.ts` vollständig
 * abgedeckt.
 *
 * ## Was ausgegeben wird
 *
 *     WECKEN=1
 *     GRUND=die Ausgabe des Tages fehlt auf main, und die Kette läuft nicht
 *
 * Der Rückgabewert ist immer 0. Ein Wecker, der den Dauerlauf abbricht, hätte
 * die Kurse angehalten, um die Nachrichten zu retten – der schlechtere Tausch.
 */

import { sollWecken } from '@/lib/tageswecker'

function zahl(wert: string | undefined, ersatz: number): number {
  const n = Number(wert)
  return Number.isFinite(n) ? n : ersatz
}

function antworte(wecken: boolean, grund: string): void {
  console.log(wecken ? 'WECKEN=1' : 'WECKEN=0')
  console.log(`GRUND=${grund}`)
}

const jetzt = new Date()
const minuteUtc = zahl(
  process.env.WECK_MINUTE_UTC,
  jetzt.getUTCHours() * 60 + jetzt.getUTCMinutes()
)

// Die Zähler führt die Shell im Dauerlauf – dieses Skript hat kein Gedächtnis
// zwischen zwei Aufrufen.
const versuche = zahl(process.env.WECK_VERSUCHE, 0)
const sekundenSeitWeckruf = zahl(process.env.WECK_ABSTAND_S, -1)

// `1` steht, `0` fehlt, alles andere heißt: Die Nachfrage hat keine brauchbare
// Antwort gebracht. Bei einer unklaren Antwort wird **nicht** geweckt. Ein
// Weckruf ins Blaue startet die ganze Kette; eine ausgefallene Nachfrage ist
// in zehn Minuten wieder da.
const gemeldet = process.env.WECK_AUSGABE_STEHT
if (gemeldet !== '0' && gemeldet !== '1') {
  antworte(false, 'die Nachfrage nach der Ausgabe blieb unklar – kein Weckruf ins Blaue')
} else {
  const entscheidung = sollWecken({
    minuteUtc,
    ausgabeSteht: gemeldet === '1',
    versuche,
    sekundenSeitWeckruf,
  })
  antworte(entscheidung.wecken, entscheidung.grund)
}
