/**
 * Macht aus Inhaltsblöcken vorlesbare Abschnitte.
 *
 * ## Warum aus den Blöcken und nicht aus der Seite
 *
 * Man könnte den gerenderten Text aus dem HTML kratzen. Dann läse die Stimme
 * alles vor, was zufällig im `<article>` steht – Schaltflächen, die Zeile
 * „7 Min. Lesezeit“, die Blätternavigation. Die Blöcke sind dieselbe Quelle,
 * aus der die Seite entsteht, und sie wissen, was sie sind: Eine Formel aus
 * Zeichen wie „σ = √(…)“ ist gesprochen wertlos, ihre Erläuterung nicht.
 * Eine Grafik ist unsichtbar für die Stimme – aber ihre Vorlesefassung aus
 * `data/figures.ts` existiert ja gerade für diesen Fall.
 *
 * ## Warum Abschnitte statt eines Textes
 *
 * Browser brechen lange Vorleseaufträge ab – Chrome verstummt bei manchen
 * Stimmen nach einigen Sätzen, ohne Fehler. Kurze Aufträge, die nacheinander
 * gestartet werden, haben das Problem nicht und geben nebenbei den Fortschritt
 * her: „Abschnitt 12 von 40“.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann; die
 * Typimporte entfernt das Type-Stripping.
 */

import type { ContentBlock } from '@/data/content'

/** Was die Vorlesefassung über eine Grafik wissen muss. */
export interface Vorlesegrafik {
  title: string
  caption: string
  description?: string
}

/** Die deutschen Ordnungswörter für nummerierte Listen. */
const ORDNUNG = [
  'Erstens',
  'Zweitens',
  'Drittens',
  'Viertens',
  'Fünftens',
  'Sechstens',
  'Siebtens',
  'Achtens',
  'Neuntens',
  'Zehntens',
]

/** Entfernt Auszeichnungen, die nur fürs Auge sind. */
function nurText(text: string): string {
  return text.replaceAll('**', '').replace(/\s+/g, ' ').trim()
}

/** Sorgt dafür, dass die Stimme am Ende absetzt. */
function alsSatz(text: string): string {
  const glatt = nurText(text)
  if (glatt === '') return ''
  return /[.!?:]$/.test(glatt) ? glatt : `${glatt}.`
}

/**
 * Zerlegt Inhaltsblöcke in vorlesbare Abschnitte.
 *
 * Jeder Abschnitt ist kurz genug für einen einzelnen Vorleseauftrag. Leere
 * Abschnitte entstehen nicht – wer das Ergebnis zählt, zählt Gesprochenes.
 */
export function vorleseAbschnitte(
  bloecke: readonly ContentBlock[],
  grafiken: Record<string, Vorlesegrafik> = {}
): string[] {
  const abschnitte: string[] = []
  const sag = (text: string) => {
    if (text.trim() !== '') abschnitte.push(text)
  }

  for (const block of bloecke) {
    switch (block.type) {
      case 'heading':
        sag(alsSatz(block.text))
        break

      case 'paragraph':
        sag(alsSatz(block.text))
        break

      case 'list':
        block.items.forEach((eintrag, stelle) => {
          const vorwort = block.ordered && ORDNUNG[stelle] ? `${ORDNUNG[stelle]}: ` : ''
          sag(vorwort + alsSatz(eintrag))
        })
        break

      case 'callout':
        if (block.title) sag(alsSatz(block.title))
        for (const eintrag of block.items) sag(alsSatz(eintrag))
        break

      case 'quote':
        sag(
          `Zitat: ${alsSatz(block.text)}${block.source ? ` – ${nurText(block.source)}.` : ''}`
        )
        break

      case 'table': {
        /*
          Eine Tabelle wird zeilenweise gelesen, jede Zelle mit ihrer
          Spaltenüberschrift davor. Nur die Zellen hintereinander („15, 25,
          50“) kann niemand zuordnen, der die Spalten nicht sieht.
        */
        if (block.caption) sag(alsSatz(`Tabelle: ${block.caption}`))
        for (const zeile of block.rows) {
          const teile = zeile.map((zelle, spalte) => {
            const kopf = nurText(block.head[spalte] ?? '')
            return kopf === '' ? nurText(zelle) : `${kopf}: ${nurText(zelle)}`
          })
          sag(`${teile.join('. ')}.`)
        }
        break
      }

      case 'formula':
        /*
          Die Formel selbst wird nicht gesprochen. „K G V gleich Kurs geteilt
          durch“ trüge noch, aber „Sigma gleich Wurzel aus Klammer auf“ ist
          Geräusch. Die Erläuterung daneben sagt, was die Formel tut – sie ist
          die Vorlesefassung.
        */
        sag(`Es folgt eine Formel. ${alsSatz(block.description)}`)
        break

      case 'keyfacts':
        for (const fakt of block.items) {
          sag(`${nurText(fakt.label)}: ${alsSatz(fakt.value)}`)
        }
        break

      case 'figure': {
        const grafik = grafiken[block.figure]
        if (!grafik) break
        const beschreibung = grafik.description ?? block.caption ?? grafik.caption
        sag(`Grafik: ${alsSatz(grafik.title)} ${alsSatz(beschreibung)}`)
        break
      }
    }
  }

  return abschnitte
}
