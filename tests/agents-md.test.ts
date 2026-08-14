/**
 * `AGENTS.md` bleibt klein, und ihre Verweise gehen ins Leere oder nirgends.
 *
 * ## Warum diese Prüfung existiert
 *
 * `AGENTS.md` wird über `CLAUDE.md` bei **jedem Zug** mitgeschickt – in jeder
 * Sitzung und in jedem Agentenlauf. Am 14. August 2026 war sie auf rund
 * 90.000 Zeichen gewachsen, also etwa 22.500 Token, gelesen bevor irgendjemand
 * irgendetwas tut. Zum Vergleich: Der ganze Prompt, mit dem der Agent die
 * Nachrichten schreibt, ist ein Sechstel davon.
 *
 * Gekürzt wurde nichts. Getrennt wurde: **Regeln** stehen in `AGENTS.md`,
 * **Begründungen** in `ENTSCHEIDUNGEN.md`.
 *
 * Diese Trennung hält von selbst nicht. Sie zerfällt auf zwei Wegen, und
 * gegen beide steht hier eine Prüfung:
 *
 * 1. **`AGENTS.md` wächst wieder.** Jeder Vorfall bringt den Wunsch mit, die
 *    Vorgeschichte gleich danebenzuschreiben – so ist die Datei ja entstanden.
 *    Einzeln ist das jedes Mal vernünftig; in der Summe war es das nicht.
 * 2. **Die Verweise zeigen ins Leere.** Ein Verweis auf einen Abschnitt, den
 *    es nicht mehr gibt, ist schlimmer als keiner: Er behauptet, die
 *    Begründung sei nachlesbar, und schickt den Leser auf die Suche.
 *
 * ## Was sie nicht prüft
 *
 * Ob die Regeln stimmen. Das kann kein Test. Sie prüft, dass die Form trägt,
 * in der sie stehen.
 */

import { readFileSync } from 'node:fs'

const REGELN = 'AGENTS.md'
const GRUENDE = 'ENTSCHEIDUNGEN.md'

/**
 * Die Obergrenze, in Zeichen.
 *
 * 24.000 Zeichen sind rund 6.000 Token. Die Datei lag nach der Trennung bei
 * gut 16.000 – der Abstand ist Platz für neue Regeln, nicht für neue
 * Vorgeschichten.
 *
 * Wer hier anstößt, hat die Wahl: die neue Begründung nach
 * `ENTSCHEIDUNGEN.md` verschieben, oder diese Zahl bewusst erhöhen und dabei
 * nachrechnen, was sie je Zug kostet. Beides ist in Ordnung – das
 * Stillschweigende nicht.
 */
const HOECHSTENS = 24_000

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis: string): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}\n     ${hinweis}`)
  }
}

const regeln = readFileSync(REGELN, 'utf8')
const gruende = readFileSync(GRUENDE, 'utf8')

console.log(
  `${REGELN}: ${regeln.length} Zeichen (~${Math.round(regeln.length / 4)} Token, ` +
    `bei jedem Zug)\n${GRUENDE}: ${gruende.length} Zeichen (~${Math.round(gruende.length / 4)} Token, ` +
    `nur bei Bedarf)\n`
)

pruefen(
  `${REGELN} bleibt unter ${HOECHSTENS.toLocaleString('de-DE')} Zeichen`,
  regeln.length <= HOECHSTENS,
  `${regeln.length.toLocaleString('de-DE')} Zeichen – rund ` +
    `${Math.round(regeln.length / 4).toLocaleString('de-DE')} Token bei jedem Zug.\n` +
    `     Gehört die Ergänzung in die Regeln, oder ist sie eine Begründung?\n` +
    `     Begründungen gehören nach ${GRUENDE}.`
)

/*
  Jeder Verweis muss ankommen.

  Die Form ist ``→ `ENTSCHEIDUNGEN.md`: „Titel", „Titel"`` – ein Pfeil, die
  Datei, dann ein oder mehrere Abschnittstitel in deutschen Anführungszeichen.

  Zwei Nachlässigkeiten sind mit Absicht erlaubt: Die Backticks um den
  Dateinamen dürfen fehlen, und die Titel dürfen über Zeilen umbrochen sein –
  der Fließtext wird vorher geglättet. Eine Prüfung, die an einem Backtick
  scheitert, meldet nicht den Fehler, den sie sucht, sondern sich selbst.
*/
const geglaettet = regeln.replace(/\s+/g, ' ')
const verweise = [...geglaettet.matchAll(/→ `?ENTSCHEIDUNGEN\.md`?:([^→#]*)/g)].flatMap(
  (treffer) => [...treffer[1].matchAll(/„([^„"]+)"/g)].map((m) => m[1].trim())
)

pruefen(
  'Es gibt überhaupt Verweise',
  verweise.length > 0,
  'Kein einziger `→ ENTSCHEIDUNGEN.md: „…"` gefunden. Entweder ist die Form ' +
    'geändert worden – dann gehört diese Prüfung angepasst – oder die Regeln ' +
    'stehen ohne Weg zu ihrer Begründung da.'
)

/*
  Verglichen wird gegen die Überschriften, nicht gegen den ganzen Text.

  Ein Titel, der zufällig irgendwo im Fließtext vorkommt, wäre kein Ziel, auf
  das man springen kann – und genau darum geht es beim Verweis.
*/
const ueberschriften = [...gruende.matchAll(/^#{1,6} (.+)$/gm)].map((m) =>
  m[1].replace(/[*`_]/g, '').replace(/\s+/g, ' ').trim()
)

const verwaist = verweise.filter(
  (titel) => !ueberschriften.some((u) => u.includes(titel.replace(/[*`_]/g, '')))
)

pruefen(
  `Alle ${verweise.length} Verweise finden ihren Abschnitt`,
  verwaist.length === 0,
  `Ohne Ziel: ${verwaist.map((t) => `„${t}"`).join(', ')}\n` +
    `     Diese Überschriften gibt es in ${GRUENDE} nicht (mehr). Ein Verweis ` +
    `ins Leere\n     behauptet, die Begründung sei nachlesbar, und schickt den ` +
    `Leser auf die Suche.`
)

pruefen(
  `${GRUENDE} verweist zurück auf die Regeln`,
  gruende.includes('AGENTS.md'),
  `In ${GRUENDE} steht nirgends, wozu sie gehört. Wer sie allein findet, ` +
    'muss den Weg zurück sehen.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
