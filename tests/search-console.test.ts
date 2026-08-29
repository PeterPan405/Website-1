/**
 * Prüfungen für das Eintragen des Search-Console-Schlüssels.
 *
 * Ausführen mit `npm test`.
 *
 * Geprüft wird nur der Teil, der ohne Netz und ohne Google auskommt: Was
 * jemand einfügt, und was daraus als Schlüssel wird. Genau dort passieren die
 * Fehler – Google zeigt das vollständige `<meta …>`-Element, und wer es im
 * Ganzen kopiert, hat das Naheliegende getan.
 *
 * Der Ernstfall daneben – Bauen und im HTML nachsehen – lässt sich hier nicht
 * prüfen; er steht im Skript selbst als Gegenprobe und bricht dort ab.
 */

import { schluesselAus, sieHtAus } from '../scripts/search-console.ts'

let failed = 0
function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  const ok = a === e
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${e}\n     erhalten ${a}`}`
  )
}

const ECHT = 'xPtLm3rQ7yN2kW9vB4hD8sF6jG1aZ5cE0uT'

/* ------------------------------------------------ Was herausgelöst wird */

check('der blanke Schlüssel bleibt, wie er ist', schluesselAus(ECHT), ECHT)
check('Leerzeichen drumherum fallen weg', schluesselAus(`  ${ECHT}\n`), ECHT)
check(
  'aus dem ganzen Element wird der Wert',
  schluesselAus(`<meta name="google-site-verification" content="${ECHT}" />`),
  ECHT
)
check(
  'auch mit einfachen Anführungszeichen',
  schluesselAus(`<meta name='google-site-verification' content='${ECHT}'>`),
  ECHT
)
check('mitkopierte Anführungszeichen fallen weg', schluesselAus(`"${ECHT}"`), ECHT)

/* ----------------------------------------------------- Was abgewiesen wird */

check('ein echter Schlüssel geht durch', sieHtAus(ECHT), null)
check('leer wird abgewiesen', sieHtAus('') !== null, true)
check(
  'mit Leerzeichen wird abgewiesen',
  sieHtAus('abc def ghij klmno pqrst') !== null,
  true
)
check('zu kurz wird abgewiesen', sieHtAus('abc123') !== null, true)
check(
  'Umlaute vergibt Google nicht',
  sieHtAus('xPtLm3rQ7yN2kWä9vB4hD8sF6jG1aZ5cE0uT') !== null,
  true
)

/**
 * Der Fall, um den es eigentlich geht: Jemand fügt das ganze Element ein, und
 * es landet ungeprüft in der Datei. Auf der Website stünde dann ein `content`,
 * das selbst wieder Markup enthält – und die Bestätigung schlüge fehl, ohne
 * dass irgendwo stünde, warum.
 */
check(
  'ungeprüftes Markup wird nicht durchgelassen',
  sieHtAus('<meta name="google-site-verification" content="abc">') !== null,
  true
)
check(
  'aber richtig herausgelöst geht es durch',
  sieHtAus(schluesselAus(`<meta name="google-site-verification" content="${ECHT}">`)),
  null
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
