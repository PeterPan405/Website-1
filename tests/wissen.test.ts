/**
 * Das Abbild des Projektgedächtnisses in `wissen/`.
 *
 * Ausführen mit `npm test`.
 *
 * ## Was hier geprüft wird – und warum das die eigentliche Absicherung ist
 *
 * Ein Abbild, das niemand nachzieht, wird stillschweigend falsch. Das ist
 * genau der teuerste Fehler dieses Hauses: nicht der rote Lauf, sondern der
 * stille. Ein Vault, der die Regeln von vorletzter Woche zeigt, sieht aus wie
 * ein Vault, der stimmt.
 *
 * Deshalb vergleicht dieser Test den Ordner **Zeichen für Zeichen** mit dem,
 * was aus `ENTSCHEIDUNGEN.md` und `AGENTS.md` entsteht. Wer eine der beiden
 * Dateien ändert und `ANWENDEN=1 npm run wissen` vergisst, bekommt einen
 * roten Lauf.
 *
 * Dazu die beiden Eigenschaften, an denen ein Vault zerbricht:
 *
 * - **Kein Link zeigt ins Leere.** Obsidian legt beim Klick auf einen toten
 *   `[[Link]]` eine leere Notiz an – aus einem übersehenen Verweis würde so
 *   eine erfundene.
 * - **Nichts wird umformuliert.** Der Text der Quelle steht wörtlich in der
 *   Notiz. Zwei Fassungen desselben Satzes sind schlimmer als eine.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  abschnittZuVerweis,
  alleNotizen,
  dateiname,
  datumAus,
  ohneDatum,
  unaufloesbareVerweise,
  zerlegeEntscheidungen,
} from '@/lib/wissen'

let failed = 0
function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const ORDNER = 'wissen'
const entscheidungen = readFileSync('ENTSCHEIDUNGEN.md', 'utf8')
const agents = readFileSync('AGENTS.md', 'utf8')
const abschnitte = zerlegeEntscheidungen(entscheidungen)
const soll = alleNotizen(entscheidungen, agents)

/* ------------------------------------------------------------- Zerlegung */

pruefen(
  `ENTSCHEIDUNGEN.md zerfällt in Abschnitte (${abschnitte.length})`,
  abschnitte.length > 10,
  'Ohne Abschnitte prüft alles Folgende die leere Menge.'
)
pruefen(
  'die Einleitung der Datei ist kein Fall',
  !abschnitte.some((a) => a.titel === 'Entscheidungen und ihre Vorgeschichte')
)
pruefen(
  'der eingesetzte Next.js-Block auch nicht',
  !abschnitte.some((a) => a.titel.includes('This is NOT the Next.js'))
)
pruefen(
  'jeder Abschnitt trägt seine eigene Überschrift',
  abschnitte.every((a) => a.inhalt.startsWith(`# ${a.ueberschrift}`))
)

/* Das Datum – beide Schreibweisen, die in der Datei vorkommen. */
pruefen(
  'Datum mit Gedankenstrich ergibt JJJJ-MM-TT',
  datumAus('Die Folge – 28. September 2026') === '2026-09-28',
  String(datumAus('Die Folge – 28. September 2026'))
)
pruefen(
  'Datum mit Komma',
  datumAus('„Mache das selber" – wo die Grenze liegt, 28. August 2026') === '2026-08-28'
)
pruefen(
  'eine Überschrift ohne Datum ergibt null',
  datumAus('Der erste Besuch ist weiß') === null
)
pruefen(
  'der Titel verliert den Datumszusatz',
  ohneDatum('Die Folge – 28. September 2026') === 'Die Folge'
)
pruefen(
  'und eine Überschrift ohne Datum bleibt ganz',
  ohneDatum('Der erste Besuch ist weiß') === 'Der erste Besuch ist weiß'
)

/* ----------------------------------------------------------- Dateinamen */

/*
  Die Zeichen, an denen Windows scheitert. Der Vault liegt dort – ein
  Dateiname mit `:` entsteht hier klaglos und lässt sich auf dem Zielrechner
  nicht anlegen, und das fiele erst beim Spiegeln auf.
*/
pruefen(
  'verbotene Zeichen fallen aus dem Dateinamen',
  dateiname('Der Link: raus und zurück/„zweimal"') ===
    'Der Link raus und zurückzweimal.md',
  dateiname('Der Link: raus und zurück/„zweimal"')
)
pruefen(
  'Umlaute bleiben',
  dateiname('Der erste Besuch ist weiß') === 'Der erste Besuch ist weiß.md'
)
pruefen(
  'ein Punkt am Ende fällt weg',
  dateiname('Und dann war Schluss.') === 'Und dann war Schluss.md',
  dateiname('Und dann war Schluss.')
)
pruefen(
  'kein Dateiname enthält ein verbotenes Zeichen',
  [...soll.keys()].every((n) => !/[\\/:*?"<>|]/.test(n)),
  [...soll.keys()].filter((n) => /[\\/:*?"<>|]/.test(n)).join(', ')
)
pruefen(
  'und keiner kommt doppelt vor',
  new Set([...soll.keys()].map((n) => n.toLowerCase())).size === soll.size,
  'Windows unterscheidet Groß- und Kleinschreibung im Dateinamen nicht.'
)

/* -------------------------------------------------------------- Verweise */

const tot = unaufloesbareVerweise(agents, abschnitte)
pruefen(
  'kein Verweis aus AGENTS.md zeigt ins Leere',
  tot.length === 0,
  tot.map((v) => `„${v.replace(/\s+/g, ' ')}"`).join('  ·  ')
)

/*
  Die Gegenprobe. **Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe** –
  also bekommt die Auflösung einen Verweis vorgelegt, den sie nicht finden darf.
*/
pruefen(
  'ein erfundener Verweis wird als tot erkannt',
  abschnittZuVerweis('Ein Abschnitt, den es nie gegeben hat', abschnitte) === null
)
pruefen(
  'ein Verweis auf einen Unterpunkt bekommt seinen Anker',
  abschnittZuVerweis('Ein Commit vom Bot löst nichts aus', abschnitte)?.anker ===
    'Ein Commit vom Bot löst nichts aus'
)
pruefen(
  'ein Verweis auf eine Hauptüberschrift bekommt keinen',
  abschnittZuVerweis('Der erste Besuch ist weiß', abschnitte)?.anker === null
)

/*
  Und jeder Link, der tatsächlich in einer Notiz steht, muss eine Notiz und –
  wo ein Anker dransteht – eine Überschrift treffen. Ein toter `[[Link]]` ist
  in Obsidian keine Fehlermeldung, sondern eine Einladung, eine leere Notiz
  anzulegen.
*/
{
  /*
    Code zählt nicht mit.

    In `ENTSCHEIDUNGEN.md` steht der Satz „Obsidian legt beim Klick auf einen
    toten `[[Link]]` eine leere Notiz an" – in Backticks, also für Obsidian
    kein Link, sondern Schrift. Der erste Entwurf dieser Prüfung sah das
    nicht und meldete eine fehlende Notiz namens „Link". Die Prüfung hatte
    unrecht, nicht der Text; gestrichen werden deshalb erst die Codestellen.
  */
  /*
    Übersprungen wird nach **Stelle**, nicht durch Wegschneiden.

    Der erste Entwurf schnitt die Codestellen heraus und prüfte den Rest. Das
    ging schief, sobald eine Überschrift selbst Backticks trägt – `000` ist
    der Hoster, der Alias `@/`, `default` hat den Fehler verdeckt: Der Anker
    im Link verlor sein Code, die Überschrift behielt ihres, und vier gute
    Links galten als kaputt. Gesucht wird deshalb im vollen Text, und
    verworfen werden nur Treffer, die **innerhalb** einer Codestelle beginnen.
  */
  const codeStellen = (text: string): [number, number][] => {
    const bereiche: [number, number][] = []
    for (const re of [/```[\s\S]*?```/g, /`[^`\n]*`/g]) {
      for (const m of text.matchAll(re)) bereiche.push([m.index, m.index + m[0].length])
    }
    return bereiche
  }

  let geprueft = 0
  const kaputt: string[] = []
  for (const [datei, inhalt] of soll) {
    const code = codeStellen(inhalt)
    for (const m of inhalt.matchAll(/\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|[^\]]*)?\]\]/g)) {
      if (code.some(([von, bis]) => m.index >= von && m.index < bis)) continue
      geprueft++
      const ziel = `${m[1]}.md`
      if (!soll.has(ziel)) {
        kaputt.push(`${datei}: [[${m[1]}]] gibt es nicht`)
        continue
      }
      if (m[2] && !soll.get(ziel)!.includes(`# ${m[2]}`)) {
        kaputt.push(`${datei}: [[${m[1]}#${m[2]}]] – Überschrift fehlt`)
      }
    }
  }
  pruefen(
    `alle Links treffen (${geprueft})`,
    kaputt.length === 0,
    kaputt.slice(0, 5).join('\n     ')
  )
  pruefen('und es sind überhaupt welche da', geprueft > 20)
}

/* ------------------------------------------------------------- Wörtlich */

/*
  Der Text der Quelle steht in der Notiz, Zeichen für Zeichen. Umformuliert
  wird nichts – sonst gäbe es zwei Fassungen desselben Satzes, und nach vier
  Wochen weiß niemand, welche gilt.
*/
{
  const fehlend = abschnitte.filter((a) => {
    const notiz = soll.get(dateiname(a.titel))
    return !notiz || !notiz.includes(a.inhalt)
  })
  pruefen(
    'jeder Abschnitt steht wörtlich in seiner Notiz',
    fehlend.length === 0,
    fehlend.map((a) => a.titel).join(', ')
  )
}
pruefen(
  'jede Notiz sagt, dass sie ein Abbild ist',
  [...soll.values()].every((n) => n.includes('Abbild – nicht hier bearbeiten'))
)
pruefen(
  'und nennt ihre Quelle im Kopf',
  [...soll.values()].every((n) => /^---\n(.*\n)*?quelle: /m.test(n))
)

/* ------------------------------------------------------- Ist der Ordner da */

pruefen(
  `der Ordner ${ORDNER}/ existiert`,
  existsSync(ORDNER),
  'ANWENDEN=1 npm run wissen'
)

if (existsSync(ORDNER)) {
  const ist = new Map<string, string>()
  for (const name of readdirSync(ORDNER)) {
    if (name.endsWith('.md')) ist.set(name, readFileSync(join(ORDNER, name), 'utf8'))
  }

  const fehlen = [...soll.keys()].filter((n) => !ist.has(n))
  const anders = [...soll.keys()].filter((n) => ist.has(n) && ist.get(n) !== soll.get(n))
  const zuviel = [...ist.keys()].filter((n) => !soll.has(n))

  pruefen(
    `der Ordner ist auf Stand (${soll.size} Notizen)`,
    fehlen.length + anders.length + zuviel.length === 0,
    [
      fehlen.length ? `fehlen: ${fehlen.join(', ')}` : '',
      anders.length ? `abweichend: ${anders.join(', ')}` : '',
      zuviel.length ? `zu viel: ${zuviel.join(', ')}` : '',
      'Nachziehen mit: ANWENDEN=1 npm run wissen',
    ]
      .filter(Boolean)
      .join('\n     ')
  )
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
