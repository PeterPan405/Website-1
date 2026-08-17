/**
 * Hat jeder Rechner seinen Rechenweg – und ist er an die echten Zahlen gebunden?
 *
 * ## Warum das eine Prüfung braucht
 *
 * Weil „bei jedem Rechner" eine Behauptung ist, die mit dem siebzehnten
 * Rechner still falsch wird. Wer einen neuen anlegt, denkt an die Formel, an
 * die Grenzen, an die Methodik – und an den Rechenweg zuletzt. Diese Prüfung
 * fällt dann auf, statt dass die Lücke ein Jahr lang niemandem auffällt.
 *
 * ## Was geprüft wird
 *
 * 1. **Jeder Rechner hat einen.** Gemessen an der Komponente, die seine Seite
 *    einbindet – nicht an einer Liste, die jemand pflegen müsste.
 * 2. **Die eingesetzten Zahlen kommen aus dem Zustand.** Ein Rechenweg mit
 *    fest hingeschriebenen Beispielzahlen wäre schlimmer als keiner: Er sähe
 *    nach Nachvollziehbarkeit aus und zeigte eine fremde Rechnung. Geprüft
 *    wird deshalb, dass jedes `eingesetzt` eine Einsetzung enthält.
 * 3. **Die Ausnahmen sind benannt.** Wer einen Rechner ausnimmt, schreibt
 *    dazu, warum – und die Prüfung meldet, wenn eine Ausnahme für einen
 *    Rechner steht, den es nicht mehr gibt.
 */

import { readFileSync, existsSync } from 'node:fs'

import { calculators } from '@/data/calculators'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/**
 * Rechner ohne Rechenweg – mit Begründung.
 *
 * Beide sind keine Formelrechner, sondern Aufstellungen: Ihr Rechenweg steht
 * bereits vollständig auf dem Bildschirm, Zeile für Zeile. Ein aufklappbarer
 * Kasten, der „Summe aller Zeilen" wiederholt, wäre Zierrat und keine
 * Auskunft.
 */
const AUSNAHMEN: Readonly<Record<string, string>> = {
  vermoegensuebersicht:
    'Eine Aufstellung, keine Formel – jede Zeile ist ihre eigene Rechnung, und die Summe steht darunter.',
  depotanalyse:
    'Zeigt Anteile am Depot; die Rechnung ist die Tabelle selbst, jede Zeile mit Betrag und Prozentsatz.',
}

/**
 * Welche Komponenten bindet die Seite dieses Rechners ein?
 *
 * Alle, nicht die erste. Der Zinsrechner bindet neben seinem Rechner auch die
 * Sequenztafel und den Zinsstand ein – beim ersten Anlauf hat diese Prüfung
 * die Sequenztafel erwischt und dem Zinsrechner einen fehlenden Rechenweg
 * vorgeworfen, den er hat.
 *
 * Gesucht wird auch nicht nach einer Namensregel: `kaufkraft` heißt
 * `Kaufkraftrechner`, `bewertungsrechner` heißt `EingepreistCalculator`. Der
 * Import auf der Seite ist die einzige Auskunft, die nicht raten muss.
 */
function komponentenVon(slug: string): string[] {
  const seite = `app/rechner/${slug}/page.tsx`
  if (!existsSync(seite)) return []
  const quelle = readFileSync(seite, 'utf8')

  return [...quelle.matchAll(/from '@\/components\/calculators\/([A-Za-z0-9-]+)'/g)]
    .map((m) => m[1])
    .filter(
      (name) => !['CalculatorPage', 'CalculatorPanels', 'ErgebnisDownload'].includes(name)
    )
}

console.log(`${calculators.length} Rechner\n`)

for (const rechner of calculators) {
  const ausnahme = AUSNAHMEN[rechner.slug]
  if (ausnahme) {
    console.log(`HINW ${rechner.title}: ohne Rechenweg – ${ausnahme}`)
    continue
  }

  const komponenten = komponentenVon(rechner.slug)
  pruefen(
    `${rechner.title}: die Seite bindet eine Rechnerkomponente ein`,
    komponenten.length > 0,
    `app/rechner/${rechner.slug}/page.tsx importiert nichts aus components/calculators/.`
  )
  if (komponenten.length === 0) continue

  const quelle = komponenten
    .map((name) => {
      const pfad = `components/calculators/${name}.tsx`
      return existsSync(pfad) ? readFileSync(pfad, 'utf8') : ''
    })
    .join('\n')

  pruefen(
    `${rechner.title}: hat einen Rechenweg`,
    quelle.includes('<Rechenweg'),
    `Keine der Komponenten (${komponenten.join(', ')}) bindet <Rechenweg /> ein.\n` +
      '     Wer einen Rechner ohne bauen will, trägt ihn mit Begründung in AUSNAHMEN\n' +
      '     ein – dann steht wenigstens da, warum.'
  )

  /*
    Die eingesetzten Zeilen müssen aus dem Zustand kommen.

    Ein `eingesetzt: '300.000 × 0,038 ÷ 12'` mit fest hingeschriebenen Zahlen
    wäre die gefährlichste Variante: Er sieht nach Nachvollziehbarkeit aus und
    zeigt die Rechnung eines anderen. Geprüft wird deshalb, dass jede solche
    Zeile eine Einsetzung `${'$'}{…}` enthält.
  */
  const zeilen = [...quelle.matchAll(/eingesetzt: (.+)/g)].map((m) => m[1])
  if (zeilen.length > 0) {
    const ohneEinsetzung = zeilen.filter((z) => !z.includes('${'))
    pruefen(
      `${rechner.title}: alle ${zeilen.length} Rechenschritte setzen echte Zahlen ein`,
      ohneEinsetzung.length === 0,
      `${ohneEinsetzung.length} Zeile(n) ohne Einsetzung:\n     ${ohneEinsetzung.join('\n     ')}`
    )
  }
}

/* ------------------------------------------------- Die Ausnahmen sind aktuell */

console.log('')

for (const slug of Object.keys(AUSNAHMEN)) {
  pruefen(
    `Die Ausnahme „${slug}" gilt einem Rechner, den es gibt`,
    calculators.some((r) => r.slug === slug),
    'Eine Ausnahme für einen entfernten Rechner nimmt still den nächsten aus,\n' +
      '     der zufällig denselben Namen bekommt.'
  )
}

/*
  Die Gegenprobe: Der Bauteil selbst muss die Felder haben, die die Prüfung
  oben unterstellt. Sonst prüft sie eine Struktur, die es nicht gibt.
*/
const bauteil = readFileSync('components/calculators/Rechenweg.tsx', 'utf8')
pruefen(
  'Der Rechenweg verlangt Formel, Einsetzung und Ergebnis',
  ['was:', 'formel:', 'eingesetzt:', 'ergebnis:'].every((feld) =>
    bauteil.includes(feld.replace(':', ': string'))
  ),
  'Fehlt eines der Felder im Bauteil, prüfen die Zeilen darüber nichts.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
