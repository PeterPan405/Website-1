/**
 * Prüfungen für die Ermittlung der Basis-URL.
 *
 * Anlass war ein Fehler, den erst der Server-Build sichtbar gemacht hat: Eine
 * nicht gesetzte GitHub-Variable wird als leerer String übergeben, nicht
 * weggelassen. `??` greift dort nicht, die Basis-URL wurde leer und der Build
 * brach mit „Invalid URL“ ab. Der erste Fall unten ist genau dieser.
 */

import { FALLBACK_SITE_URL, resolveSiteUrl } from '../lib/resolve-site-url.ts'

let failed = 0

function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) {
    failed++
    console.log(`FEHL ${name}\n     erwartet ${JSON.stringify(expected)}`)
    console.log(`     erhalten ${JSON.stringify(actual)}`)
  } else {
    console.log(`OK   ${name}`)
  }
}

function checkThrows(name: string, fn: () => unknown) {
  try {
    fn()
    failed++
    console.log(`FEHL ${name} – es wurde kein Fehler geworfen`)
  } catch {
    console.log(`OK   ${name}`)
  }
}

// Der Fall, der den Build zum Absturz gebracht hat.
check(
  'leerer String faellt auf den Fallback zurueck',
  resolveSiteUrl(''),
  FALLBACK_SITE_URL
)
check('nur Leerzeichen ebenso', resolveSiteUrl('   '), FALLBACK_SITE_URL)
check('undefined ebenso', resolveSiteUrl(undefined), FALLBACK_SITE_URL)

check(
  'echte Domain wird uebernommen',
  resolveSiteUrl('https://www.im-invests.de'),
  'https://www.im-invests.de'
)
check(
  'abschliessender Schraegstrich faellt weg',
  resolveSiteUrl('https://www.im-invests.de/'),
  'https://www.im-invests.de'
)
check(
  'mehrere Schraegstriche fallen weg',
  resolveSiteUrl('https://www.im-invests.de///'),
  'https://www.im-invests.de'
)
check(
  'umgebende Leerzeichen werden entfernt',
  resolveSiteUrl('  https://www.im-invests.de  '),
  'https://www.im-invests.de'
)
check(
  'http ist erlaubt (lokale Vorschau)',
  resolveSiteUrl('http://localhost:3000'),
  'http://localhost:3000'
)

checkThrows('Adresse ohne Schema wird abgelehnt', () =>
  resolveSiteUrl('www.im-invests.de')
)
checkThrows('Unsinn wird abgelehnt', () =>
  resolveSiteUrl('nicht mal ansatzweise eine url')
)
checkThrows('fremdes Schema wird abgelehnt', () => resolveSiteUrl('ftp://im-invests.de'))

console.log(
  failed === 0 ? '\nAlle Pruefungen bestanden' : `\n${failed} Pruefung(en) fehlgeschlagen`
)
process.exit(failed === 0 ? 0 : 1)
