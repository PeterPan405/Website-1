/**
 * Trägt den Bestätigungsschlüssel der Google Search Console ein – und prüft ihn.
 *
 * Aufruf:
 *
 *     npm run search-console -- ABC123…
 *     npm run search-console            (nur prüfen, was gerade steht)
 *
 * ## Warum es dieses Skript gibt
 *
 * Der Handgriff selbst ist eine Zeichenkette in `lib/site.ts`. Was daran
 * schiefgehen kann, ist trotzdem einiges, und jeder Fehler sieht in der Search
 * Console gleich aus – „Bestätigung fehlgeschlagen", ohne Grund:
 *
 * - das ganze `<meta …>`-Element eingefügt statt nur des `content`-Werts
 * - Anführungszeichen mitkopiert
 * - eingetragen, aber nicht gebaut
 * - gebaut, aber nicht veröffentlicht
 *
 * Das Skript fängt die ersten beiden ab, erledigt das Bauen und sagt zum
 * Schluss, was noch zu tun ist. Es ist bewusst kein Workflow: Der Schlüssel
 * kommt aus einem Browser, in dem ein Mensch angemeldet ist.
 *
 * ## Was es nicht tut
 *
 * Anmelden, bestätigen, Sitemap einreichen. Das braucht ein Google-Konto und
 * bleibt beim Betreiber – siehe `EINRICHTUNG.md`, Abschnitt 4.
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const SITE = 'lib/site.ts'
const GEBAUT = 'out/index.html'

/** Die Zeile, in der der Schlüssel steht – als Anker für das Ersetzen. */
const ZEILE = /(\n\s*googleSiteVerification: ')([^']*)(',)/

/**
 * Holt den Wert aus dem, was jemand eingefügt hat.
 *
 * Google zeigt das vollständige Element. Wer es im Ganzen kopiert, hat nicht
 * unsauber gearbeitet, sondern das Naheliegende getan – deshalb wird der Wert
 * herausgelöst, statt die Eingabe abzuweisen.
 */
export function schluesselAus(eingabe: string): string {
  const roh = eingabe.trim()
  const ausElement = roh.match(/content=["']([^"']+)["']/i)
  if (ausElement) return ausElement[1]
  return roh.replace(/^["']|["']$/g, '')
}

/**
 * Sieht das nach einem Bestätigungsschlüssel aus?
 *
 * Google vergibt eine Zeichenkette aus Buchstaben, Ziffern, Bindestrich und
 * Unterstrich, rund 40 Zeichen lang. Geprüft wird die Form, nicht der Inhalt –
 * ob der Schlüssel der richtige ist, weiß nur Google.
 */
export function sieHtAus(schluessel: string): string | null {
  if (schluessel.length === 0) return 'Der Schlüssel ist leer.'
  if (/\s/.test(schluessel)) return 'Der Schlüssel enthält ein Leerzeichen.'
  if (schluessel.includes('<'))
    return 'Da steht noch Markup drin – gebraucht wird nur der Wert von content.'
  if (!/^[A-Za-z0-9_-]+$/.test(schluessel))
    return 'Der Schlüssel enthält Zeichen, die Google nicht vergibt (erlaubt: A–Z, a–z, 0–9, - und _).'
  if (schluessel.length < 20)
    return `Der Schlüssel ist mit ${schluessel.length} Zeichen zu kurz – Google vergibt rund 40.`
  return null
}

function lies(): string {
  const treffer = readFileSync(SITE, 'utf8').match(ZEILE)
  if (!treffer) {
    console.error(`In ${SITE} fehlt die Zeile googleSiteVerification.`)
    process.exit(1)
  }
  return treffer[2]
}

function schreib(schluessel: string): void {
  const inhalt = readFileSync(SITE, 'utf8')
  writeFileSync(SITE, inhalt.replace(ZEILE, `$1${schluessel}$3`))
}

/*
  Die Kommandozeile läuft nur, wenn diese Datei **aufgerufen** wird.

  `tests/search-console.test.ts` importiert `schluesselAus` und `sieHtAus`.
  Ohne diese Bedingung liefe beim Import der ganze Ablauf mit – der Test würde
  einen Bau anstoßen oder mit `process.exit(0)` enden, bevor er etwas geprüft
  hat. Genau das ist beim ersten Anlauf passiert.
*/
function kommandozeile(): void {
  const eingabe = process.argv.slice(2).join(' ')

  if (!eingabe) {
    const jetzt = lies()
    if (jetzt) {
      console.log(`Eingetragen ist: ${jetzt}`)
      console.log('Zum Ändern: npm run search-console -- NEUER_SCHLUESSEL')
    } else {
      console.log('Es ist kein Schlüssel eingetragen.')
      console.log('So kommst du an einen: EINRICHTUNG.md, Abschnitt 4.')
    }
    return
  }

  const schluessel = schluesselAus(eingabe)
  const beanstandung = sieHtAus(schluessel)
  if (beanstandung) {
    console.error(`Das geht so nicht: ${beanstandung}`)
    console.error(`Erhalten: ${JSON.stringify(eingabe.slice(0, 120))}`)
    console.error('')
    console.error('Gebraucht wird nur der Wert aus content="…", zum Beispiel:')
    console.error('  npm run search-console -- xPtLm3rQ7yN2kW9vB4hD8sF6jG1aZ5cE0uT')
    process.exit(1)
  }

  schreib(schluessel)
  console.log(`Eingetragen in ${SITE}: ${schluessel}`)

  console.log('Baue – das dauert ein bis zwei Minuten …')
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit' })

  // Die Gegenprobe: Steht das Element wirklich im ausgelieferten HTML? Ein
  // Eintrag, der es nicht bis in die Datei schafft, ist genau der stille
  // Fehler, den man in der Search Console erst als „fehlgeschlagen" bemerkt.
  const html = readFileSync(GEBAUT, 'utf8')
  const gefunden = html.match(
    /<meta name="google-site-verification" content="([^"]*)"\s*\/?>/i
  )

  if (!gefunden) {
    console.error('')
    console.error(`Kein google-site-verification-Element in ${GEBAUT}.`)
    console.error('Der Eintrag ist gesetzt, kommt aber nicht im Bau an.')
    process.exit(1)
  }
  if (gefunden[1] !== schluessel) {
    console.error('')
    console.error(`Im Bau steht ein anderer Wert: ${gefunden[1]}`)
    process.exit(1)
  }

  console.log('')
  console.log(`Gegenprobe bestanden – im gebauten HTML steht: ${gefunden[0]}`)
  console.log('')
  console.log('Was jetzt noch fehlt:')
  console.log('  1. Änderung committen und nach main bringen (Pull Request, grüne')
  console.log('     Prüfung, mergen). Erst dann steht das Element auf iminvests.de.')
  console.log(
    '  2. Warten, bis „Paket bauen" und „Veröffentlichen" durch sind (~5 Min.).'
  )
  console.log('  3. In der Search Console auf „Bestätigen" klicken.')
  console.log('  4. Dort unter „Sitemaps" eintragen: sitemap.xml')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  kommandozeile()
}
