/**
 * Fragt jede fremde Schnittstelle, ob sie noch liefert, was der Abruf erwartet.
 *
 * Was geprüft wird und warum, steht in `lib/vertraege.ts`. Hier steht nur, wie
 * gefragt wird.
 *
 * Aufruf: `npm run vertraege`
 *
 * ## Aus dieser Entwicklungsumgebung heraus schlägt das fehl
 *
 * Und zwar bei jeder Adresse: Der Egress-Proxy lässt nur GitHub und npm durch.
 * Das ist kein Fehler dieses Skripts, sondern eine Regel der Umgebung. Es
 * gehört auf einen GitHub-Läufer – dafür gibt es
 * `.github/workflows/vertraege.yml`, der es wöchentlich startet.
 *
 * ## Schlüssel kommen nicht ins Protokoll
 *
 * Ausgegeben wird ausschließlich `vertrag.adresse`, und die ist per
 * Vereinbarung schlüsselfrei. Die tatsächlich aufgerufene Adresse entsteht in
 * `mitSchluessel` und wird nirgends ausgegeben – auch nicht im Fehlerfall, wo
 * es am verlockendsten wäre. Workflow-Protokolle sind öffentlich.
 */

import { pathToFileURL } from 'node:url'

import { VERTRAEGE, type Vertrag } from '../lib/vertraege.ts'

/** Wie lange auf eine Antwort gewartet wird. */
const GEDULD_MS = 30_000

interface Ergebnis {
  vertrag: Vertrag
  zustand: 'hält' | 'gebrochen' | 'übersprungen'
  hinweis: string
}

async function pruefe(vertrag: Vertrag): Promise<Ergebnis> {
  let adresse = vertrag.adresse

  if (vertrag.schluessel) {
    const wert = process.env[vertrag.schluessel]
    if (!wert) {
      /*
        Ohne Schlüssel wird übersprungen, nicht beanstandet. Ein roter Lauf,
        nur weil jemand die Prüfung lokal ohne Secrets startet, wäre eine
        Meldung ohne Aussage.
      */
      return {
        vertrag,
        zustand: 'übersprungen',
        hinweis: `Kein ${vertrag.schluessel} gesetzt.`,
      }
    }
    adresse = vertrag.mitSchluessel ? vertrag.mitSchluessel(wert) : adresse
  }

  const abbruch = AbortSignal.timeout(GEDULD_MS)
  let antwort: Response
  try {
    antwort = await fetch(adresse, { headers: vertrag.kopf ?? {}, signal: abbruch })
  } catch (fehler) {
    const grund = fehler instanceof Error ? fehler.message : 'unbekannt'
    return { vertrag, zustand: 'gebrochen', hinweis: `Nicht erreichbar: ${grund}` }
  }

  if (!antwort.ok) {
    return {
      vertrag,
      zustand: 'gebrochen',
      hinweis: `Statuscode ${antwort.status}.`,
    }
  }

  const text = await antwort.text()
  const mangel = vertrag.pruefe(text, new Date())
  return mangel === null
    ? { vertrag, zustand: 'hält', hinweis: '' }
    : { vertrag, zustand: 'gebrochen', hinweis: mangel }
}

async function main(): Promise<void> {
  console.log('Verträge mit fremden Schnittstellen')
  console.log('═══════════════════════════════════\n')

  const ergebnisse: Ergebnis[] = []
  for (const vertrag of VERTRAEGE) {
    const ergebnis = await pruefe(vertrag)
    ergebnisse.push(ergebnis)

    const zeichen =
      ergebnis.zustand === 'hält'
        ? 'OK  '
        : ergebnis.zustand === 'gebrochen'
          ? 'FEHL'
          : '––  '
    console.log(`${zeichen} ${ergebnis.vertrag.name}`)
    if (ergebnis.hinweis) console.log(`     ${ergebnis.hinweis}`)

    // Zurückhaltend fragen; die meisten dieser Dienste sind kostenlos.
    await new Promise((weiter) => setTimeout(weiter, 400))
  }

  const gebrochen = ergebnisse.filter((e) => e.zustand === 'gebrochen')
  const uebersprungen = ergebnisse.filter((e) => e.zustand === 'übersprungen')

  console.log(
    `\n${ergebnisse.length - gebrochen.length - uebersprungen.length} von ` +
      `${ergebnisse.length} Verträgen halten.` +
      (uebersprungen.length > 0
        ? ` ${uebersprungen.length} ohne Schlüssel übersprungen.`
        : '')
  )

  if (gebrochen.length > 0) {
    console.log('\nWas jetzt zu tun ist')
    console.log('────────────────────')
    for (const { vertrag, hinweis } of gebrochen) {
      console.log(`\n  ${vertrag.name}`)
      console.log(`    Wofür: ${vertrag.zweck}`)
      console.log(`    Adresse: ${vertrag.adresse}`)
      console.log(`    Befund: ${hinweis}`)
    }
    console.log(
      '\n  Eine gebrochene Zusage heißt nicht zwangsläufig, dass der Bestand schon\n' +
        '  falsch ist – sie heißt, dass er es beim nächsten Abruf werden kann. Ein\n' +
        '  Statuscode 500 ist meist eine Störung und morgen weg. Eine Reihe, die\n' +
        '  Werte liefert und trotzdem stillsteht, ist es nie: Dann ist der Datensatz\n' +
        '  umbenannt oder eingestellt, und der Schlüssel gehört nachgezogen.'
    )
    process.exitCode = 1
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
