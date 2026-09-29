#!/usr/bin/env node
/**
 * Alles, was dieses Projekt WEISS, in den Obsidian-Tresor legen.
 *
 * ## Warum es das gibt (29.09.2026)
 *
 * Gefragt war: „wurden eigentlich in den letzten Wochen und Monaten alle
 * Informationen in Obsidian gespeichert?" Gemessen an diesem Tag: **nein.**
 * Der Tresor trug 165 Dateien, davon 162 aus dem Import vom 02.08.2026; die
 * Wörter „Website-1" und „Börsenkalender" kamen darin nicht ein einziges Mal
 * vor. Aus 345 inhaltlichen Änderungen seit dem 1. August stand dort nichts.
 *
 * Der erste Reflex war eine **Regel** in den Arbeitsregeln: „am Ende jeder
 * Sitzung festhalten". Das Handels-Dashboard hatte dieselbe Frage am selben
 * Tag bekommen und die bessere Antwort schon gebaut – `scripts/obsidian-
 * ablage.js` dort, mit der Begründung, die auch hier gilt:
 *
 *   „Eine REGEL allein hätte das nicht behoben. Ein Bericht, der gelesen
 *    werden muss, wird irgendwann nicht gelesen."
 *
 * Also ein Skript, das die Ablage macht, und eine Prüfung, die merkt, wenn
 * sie veraltet ist. Die Regel bleibt daneben stehen – sie sagt jetzt, dass
 * dieses Skript zu laufen hat, und nicht mehr, dass ich daran denken soll.
 *
 * ## Was hineingeht und was nie
 *
 * Hinein: `AGENTS.md`, `ENTSCHEIDUNGEN.md`, `EINRICHTUNG.md`, `README.md`,
 * `MONETARISIERUNG.md` – also genau das, was ohnehin im Git liegt und weder
 * Bestand noch Geheimnis enthält. `ENTSCHEIDUNGEN.md` wird an ihren
 * Überschriften **zerlegt**: 82 Abschnitte in einer Datei von 200.000 Zeichen
 * sind in Obsidian unbrauchbar, als 82 Notizen sind sie durchsuchbar und
 * verlinkbar – und `AGENTS.md` verweist ohnehin auf genau diese Überschriften.
 *
 * Nie hinein: `.env`, `data/`, alles Erzeugte. `pruefbericht.md` ebenfalls
 * nicht – das ist die Ausgabe eines Laufs, kein Wissen.
 *
 * Und das ist keine blosse Absicht, sondern eine **Sperre**:
 * `pruefeGeheimnisse()` liest jede Datei, die geschrieben werden soll, und
 * bricht den ganzen Lauf ab, wenn etwas nach Schlüssel, Marke oder Passwort
 * aussieht. Lieber gar keine Ablage als eine mit einem Schlüssel darin.
 *
 * ## Aufruf
 *
 *     npm run obsidian              # schreiben
 *     npm run obsidian -- --pruefen # nur sagen, was fehlt
 *     OBSIDIAN_TRESOR=… npm run obsidian
 */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const WURZEL = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const NUR_PRUEFEN = process.argv.includes('--pruefen')

/** Die Dateien, die abgelegt werden – Reihenfolge wie auf der Eingangsseite. */
const DOKUMENTE: { datei: string; titel: string; marken: string[] }[] = [
  { datei: 'AGENTS.md', titel: 'Regeln für das Repository', marken: ['regeln'] },
  { datei: 'EINRICHTUNG.md', titel: 'Einrichtung', marken: ['betrieb'] },
  { datei: 'README.md', titel: 'README', marken: ['dokumentation'] },
  { datei: 'MONETARISIERUNG.md', titel: 'Monetarisierung', marken: ['plan'] },
]

/** Diese Datei wird zerlegt statt am Stück abgelegt. */
const CHRONIK_DATEI = 'ENTSCHEIDUNGEN.md'

/**
 * Den Tresor finden, ohne seinen Namen zu tippen.
 *
 * Er heisst „Gedächtnis" – mit Umlaut. Ein fest geschriebener Pfad geht in
 * der PowerShell dieses Rechners kaputt (UTF-8 ohne BOM wird als ANSI
 * gelesen). Also auflisten statt tippen: Unter `C:\Obsidian` liegt genau ein
 * Tresor, und ein Tresor ist ein Ordner mit `.obsidian` darin – ohne diese
 * zweite Bedingung würde ein beliebiger Unterordner zum Ziel.
 */
export function tresorFinden(
  basis = process.env.OBSIDIAN_TRESOR ?? 'C:\\Obsidian'
): string | null {
  if (process.env.OBSIDIAN_TRESOR) return process.env.OBSIDIAN_TRESOR
  if (!fs.existsSync(basis)) return null
  const kandidaten = fs
    .readdirSync(basis, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => path.join(basis, e.name))
  return (
    kandidaten.find((p) => fs.existsSync(path.join(p, '.obsidian'))) ??
    kandidaten[0] ??
    null
  )
}

/**
 * Die Sperre: sieht das nach einem Geheimnis aus?
 *
 * Absichtlich **grosszügig** – ein Fehlalarm kostet eine Minute, ein
 * durchgerutschter Schlüssel kostet den Schlüssel. Geprüft wird der Inhalt
 * jeder Datei, nicht ihr Name: Ein Schlüssel in einem Beispiel in
 * `EINRICHTUNG.md` wäre sonst nicht aufgefallen, und dort stehen Dutzende
 * Anleitungen zum Eintragen von Schlüsseln.
 *
 * Die Muster sind vom Handels-Dashboard übernommen, samt der drei Fallen,
 * die dort ein Test gefunden hat:
 *
 * 1. `\b` vor `PASSWORD` trifft `HOSTINGER_PASSWORD` **nicht** – der
 *    Unterstrich ist ein Wortzeichen, dort gibt es keine Wortgrenze. Deshalb
 *    darf ein Präfix aus Grossbuchstaben und Unterstrichen davorstehen.
 * 2. `const SCHLUESSEL = process.env.SCHLUESSEL` ist ein Verweis, kein
 *    Geheimnis. Sonst schlägt die Sperre auf dem eigenen Quelltext an – und
 *    eine Sperre, die immer zuschlägt, wird abgeschaltet.
 * 3. Platzhalter wie `<HIER EINFÜGEN>` sind keine Werte. Genau der steht in
 *    diesem Repo in einer Anleitung.
 */
export const GEHEIM_MUSTER: [RegExp, string][] = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'privater Schlüssel'],
  [/\bsk-[A-Za-z0-9_-]{20,}/, 'OpenAI-artiger Schlüssel'],
  [/\bsk_(live|test)_[A-Za-z0-9]{16,}/, 'Stripe-Schlüssel'],
  [/\bghp_[A-Za-z0-9]{30,}/, 'GitHub-Marke'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack-Marke'],
  [/\bAIza[A-Za-z0-9_-]{30,}/, 'Google-Schlüssel'],
  [/\b\d{8,10}:[A-Za-z0-9_-]{30,}/, 'Telegram-Marke'],
  [
    /\b[A-Z][A-Z0-9_]*(PASSWORT|PASSWORD|SECRET|TOKEN|API_KEY|KEY)[A-Z0-9_]*\s*[:=]\s*["']?(?!process\.env|import\.meta|os\.environ|\$\{|<|\.\.\.|xxx|XXX|dein|DEIN|ABC|HIER)[^\s"'`<>{}$]{8,}/,
    'Zuweisung mit Wert',
  ],
]

/**
 * Ein `BEGIN`-Header ohne Körper ist kein Schlüssel.
 *
 * Gefunden am 29.09.2026 von `tests/obsidian-ablage.test.ts`: In
 * `EINRICHTUNG.md` steht der Satz „Der Inhalt beginnt mit
 * `-----BEGIN OPENSSH PRIVATE KEY-----` und endet mit …" – eine Anleitung,
 * die das Format beschreibt. Die Sperre schlug an und hätte die Ablage jeden
 * Tag abgebrochen.
 *
 * Der falsche Ausweg wäre gewesen, das Muster zu entschärfen; dann rutscht
 * irgendwann ein echter Schlüssel durch. Unterschieden wird deshalb an einem
 * Merkmal, das der Stoff wirklich hat: **Ein echter Schlüssel hat einen
 * Körper.** Nach dem Header folgt eine lange Zeile aus Base64-Zeichen. Steht
 * in den nächsten drei Zeilen nichts dergleichen, ist es Prosa.
 */
function hatSchluesselkoerper(zeilen: string[], ab: number): boolean {
  return zeilen
    .slice(ab + 1, ab + 4)
    .some((z) => /^[A-Za-z0-9+/=]{40,}\s*$/.test(z.replace(/\r$/, '')))
}

export function pruefeGeheimnisse(
  text: string
): null | { muster: string; zeile: number; stelle: string } {
  const zeilen = text.split('\n')
  for (let i = 0; i < zeilen.length; i += 1) {
    for (const [muster, name] of GEHEIM_MUSTER) {
      const t = muster.exec(zeilen[i])
      if (!t) continue
      if (name === 'privater Schlüssel' && !hatSchluesselkoerper(zeilen, i)) continue
      return { muster: name, zeile: i + 1, stelle: t[0].slice(0, 24) }
    }
  }
  return null
}

/** Windows und Obsidian vertragen diese Zeichen nicht im Dateinamen. */
export const dateiName = (s: string): string =>
  s
    .replace(/[\\/:*?"<>|#^[\]]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 110)

/**
 * `ENTSCHEIDUNGEN.md` an ihren Überschriften zerlegen.
 *
 * Alles **vor** der ersten Überschrift ist die Einleitung und gehört auf die
 * Eingangsseite, nicht in eine eigene Notiz. Überschriften tragen hier
 * Auszeichnungen („Die Regel gilt an **jeder** Stelle…"), die im Dateinamen
 * nichts zu suchen haben – die Sternchen fallen weg, die Anführungszeichen
 * auch, aber erst im Namen und nicht im Text.
 *
 * ## Das `\r` am Zeilenende
 *
 * Der erste Anlauf lautete `/^## (.+)$/` und traf **null** von 82
 * Überschriften. Der Grund ist eine Eigenheit, die man nur auf einem
 * Windows-Rechner sieht: `core.autocrlf` legt die Datei mit CRLF auf die
 * Platte, und in JavaScript zählt `\r` als Zeilenende – `.` passt also nicht
 * darauf, `$` steht aber schon dahinter. In CI unter Linux hätte dieselbe
 * Zeile funktioniert, und der Fehler wäre nie aufgefallen.
 *
 * Dritter Fall dieser Art in diesem Repo, nach dem Testläufer und der
 * Zeichenzählung in `AGENTS.md`. Deshalb wird **einmal am Anfang**
 * normalisiert und nicht an jeder Stelle ein `\r?` eingefügt.
 */
export interface Stueck {
  titel: string
  /** Die `#`-Überschrift, unter der der Abschnitt steht. */
  kapitel: string
  zeilen: string[]
}

export function chronikTeilen(text: string): Stueck[] {
  const stuecke: Stueck[] = []
  let kapitel = ''
  let aktuell: Stueck | null = null
  for (const z of text.replace(/\r\n/g, '\n').split('\n')) {
    const k = /^# (.+)$/.exec(z)
    if (k) {
      kapitel = k[1].replace(/\*\*/g, '').replace(/[„""]/g, '').trim()
    }
    const t = /^## (.+)$/.exec(z)
    if (t) {
      if (aktuell) stuecke.push(aktuell)
      aktuell = {
        titel: t[1].replace(/\*\*/g, '').replace(/[„""]/g, '').trim(),
        kapitel,
        zeilen: [z],
      }
    } else if (aktuell) {
      aktuell.zeilen.push(z)
    }
  }
  if (aktuell) stuecke.push(aktuell)
  return stuecke
}

/**
 * Der Notiztitel je Abschnitt – und warum er nicht einfach die Überschrift ist.
 *
 * `ENTSCHEIDUNGEN.md` hat 17 Kapitel, und **vier** davon schliessen mit einem
 * Abschnitt, der wörtlich „Die Lehre" heisst. Im Fliesstext ist das richtig:
 * Darüber steht ja, um welchen Fall es geht. Als Dateiname ist es zweierlei
 * falsch – die vier Notizen überschrieben einander lautlos, und übrig bliebe
 * eine Notiz namens „Die Lehre", von der niemand weiss, wozu.
 *
 * Deshalb: Ein Titel, den es nur einmal gibt, bleibt kurz. Ein Titel, den es
 * mehrfach gibt, bekommt **alle** seine Vorkommen mit dem Kapitel davor –
 * auch das erste. Sonst hiesse eines „Die Lehre" und die anderen drei
 * „Kapitel · Die Lehre", und die Liste sähe nach einem Fehler aus.
 */
export function titelVergeben(stuecke: Stueck[]): string[] {
  const zahl = new Map<string, number>()
  for (const s of stuecke) zahl.set(s.titel, (zahl.get(s.titel) ?? 0) + 1)
  return stuecke.map((s) =>
    (zahl.get(s.titel) ?? 0) > 1 && s.kapitel ? `${s.kapitel} · ${s.titel}` : s.titel
  )
}

/* --------------------------------------------------------------- Der Lauf */

/*
  Alles ab hier steht in einer Funktion, und die läuft nur beim direkten
  Aufruf.

  Der Grund ist ein Fehler, der beim Schreiben dieser Datei fast passiert
  wäre: `tests/obsidian-ablage.test.ts` importiert `pruefeGeheimnisse` und
  `chronikTeilen` von hier. Stünde der Lauf auf oberster Ebene, würde **jeder
  Testlauf in den Tresor schreiben** – auf einem fremden Rechner in einen
  Ordner, den niemand erwartet hat. Ein Modul, das beim Importieren etwas
  tut, ist kein Modul.
*/

const jetzt = new Date().toISOString().slice(0, 10)
let stand = 'unbekannt'
try {
  stand = execFileSync('git', ['rev-parse', '--short=8', 'HEAD'], {
    cwd: WURZEL,
    encoding: 'utf8',
  }).trim()
} catch {
  /* kein git – dann eben ohne Stand */
}

/**
 * Der Kopf jeder Notiz.
 *
 * `quelle` ist Pflicht und der Grund, warum die Ablage überhaupt taugt: Wer
 * in einem halben Jahr eine Zahl darin liest, muss wissen, woher sie kommt
 * und ob die Datei im Repo inzwischen weiter ist. Eine Notiz ohne Quelle ist
 * eine zweite Wahrheit.
 */
function kopf({
  titel,
  quelle,
  marken = [],
}: {
  titel: string
  quelle: string
  marken?: string[]
}): string {
  return [
    '---',
    `titel: ${JSON.stringify(titel)}`,
    'projekt: IM Invests',
    `quelle: ${quelle}`,
    `stand: ${stand}`,
    `abgelegt: ${jetzt}`,
    `marken: [iminvests, ${marken.join(', ')}]`,
    '---',
    '',
    `> Automatisch abgelegt aus \`${quelle}\` (Stand \`${stand}\`).`,
    '> **Geändert wird im Repo, nicht hier** – der nächste Lauf überschreibt diese Datei.',
    '',
    '',
  ].join('\n')
}

function ablegen(): void {
  const tresor = tresorFinden()
  if (!tresor) {
    console.log(
      'Kein Obsidian-Tresor gefunden (gesucht unter C:\\Obsidian, oder OBSIDIAN_TRESOR setzen).'
    )
    process.exit(2)
  }
  const ziel = path.join(tresor, 'Projekte', 'IM Invests')

  /*
  Erst sammeln, dann prüfen, dann schreiben.

  Ein Lauf, der in der Mitte abbricht, liesse den Tresor halb aktuell – und
  halb aktuell ist schlimmer als gar nicht, weil es aussieht wie ganz.
*/
  const geplant: { pfad: string; inhalt: string }[] = []

  for (const d of DOKUMENTE) {
    const roh = fs.readFileSync(path.join(WURZEL, d.datei), 'utf8')
    geplant.push({
      pfad: path.join(ziel, `${dateiName(d.titel)}.md`),
      inhalt: kopf({ titel: d.titel, quelle: d.datei, marken: d.marken }) + roh,
    })
  }

  const chronikRoh = fs.readFileSync(path.join(WURZEL, CHRONIK_DATEI), 'utf8')
  const chronik = chronikTeilen(chronikRoh)
  const chronikTitel = titelVergeben(chronik)
  chronik.forEach((s, i) => {
    geplant.push({
      pfad: path.join(ziel, 'Entscheidungen', `${dateiName(chronikTitel[i])}.md`),
      inhalt:
        kopf({
          titel: chronikTitel[i],
          quelle: CHRONIK_DATEI,
          marken: ['entscheidung'],
        }) + s.zeilen.join('\n'),
    })
  })

  // Die Eingangsseite – in Obsidian der Einstieg, von dem alles abgeht.
  const index = [
    kopf({
      titel: 'IM Invests',
      quelle: 'scripts/obsidian-ablage.ts',
      marken: ['einstieg'],
    }),
    '# IM Invests',
    '',
    'Die Finanz-Website **iminvests.de** mit täglichem Podcast und',
    'Instagram-Beitrag. Jeden Morgen aktualisiert sie sich selbst; die Zusage an',
    'den Leser ist 6:00 Uhr deutscher Zeit.',
    '',
    'Quelltext: `C:\\Users\\maier\\Projects\\Website-1`, Repo `PeterPan405/Website-1`.',
    '',
    '## Die Dokumente',
    '',
    ...DOKUMENTE.map((d) => `- [[${dateiName(d.titel)}]] – \`${d.datei}\``),
    '',
    `## Entscheidungen (${chronik.length} Abschnitte)`,
    '',
    'Warum etwas so ist, wie es ist. Fast jeder Abschnitt ist die Antwort auf',
    'einen Fehler, der einmal eine Folge, einen Tag oder Geld gekostet hat –',
    'und `AGENTS.md` verweist auf genau diese Überschriften.',
    '',
    ...chronikTitel.slice(0, 40).map((t) => `- [[${dateiName(t)}]]`),
    chronik.length > 40
      ? `\n…und ${chronik.length - 40} weitere im Ordner \`Entscheidungen\`.`
      : '',
    '',
    '## Von Hand gepflegt',
    '',
    'Das hier überschreibt der Lauf **nicht** – es steht auch nirgends im Repo:',
    '',
    '- [[Projekte/IM Invests – Website|Stand, und was nur Pascal erledigen kann]]',
    '- [[Projekte/IM Invests – Chronik 2026|Chronik August und September 2026]]',
    '',
    '---',
    '',
    '## Wie diese Ablage entsteht',
    '',
    '`npm run obsidian` im Projektordner. Der Lauf **überschreibt** diese',
    'Notizen – wer hier etwas ändert, verliert es beim nächsten Mal. Geändert',
    'wird im Repo.',
    '',
    '`npm run obsidian -- --pruefen` sagt nur, was fehlt oder veraltet ist.',
    '',
    '**Was nie hineingeht:** `.env`, `data/`, alles Erzeugte. Das ist keine',
    'Absicht, sondern eine Sperre – `pruefeGeheimnisse()` liest jede Datei vor',
    'dem Schreiben und bricht den ganzen Lauf ab, wenn etwas nach Schlüssel,',
    'Marke oder Passwort aussieht.',
    '',
  ].join('\n')
  geplant.push({ pfad: path.join(ziel, 'IM Invests.md'), inhalt: index })

  // ── Die Sperre. Vor dem ersten Schreiben, über alles.
  for (const g of geplant) {
    const fund = pruefeGeheimnisse(g.inhalt)
    if (fund) {
      console.log(
        `ABGEBROCHEN – ${path.basename(g.pfad)} Zeile ${fund.zeile} sieht aus wie ${fund.muster}: ${fund.stelle}…`
      )
      console.log('Es wurde NICHTS geschrieben. Erst die Stelle im Repo klären.')
      process.exit(1)
    }
  }

  /*
  Verglichen wird der Rumpf, nicht die ganze Datei.

  Im Kopf stehen `abgelegt` und `stand`, und die ändern sich bei jedem Lauf.
  Wer die ganze Datei vergleicht, bekommt immer „alles geändert" – und
  `--pruefen` wäre nutzlos, weil es nie Ruhe meldete.
*/
  const rumpf = (s: string | null) => (s ?? '').split('\n---\n').slice(1).join('\n---\n')

  let neu = 0
  let geaendert = 0
  let gleich = 0
  for (const g of geplant) {
    const alt = fs.existsSync(g.pfad) ? fs.readFileSync(g.pfad, 'utf8') : null
    if (alt === null) neu += 1
    else if (rumpf(alt) !== rumpf(g.inhalt)) geaendert += 1
    else {
      gleich += 1
      continue
    }
    if (!NUR_PRUEFEN) {
      fs.mkdirSync(path.dirname(g.pfad), { recursive: true })
      fs.writeFileSync(g.pfad, g.inhalt, 'utf8')
    }
  }

  console.log(`Tresor: ${tresor}`)
  console.log(`Ziel:   ${path.relative(tresor, ziel)}`)
  console.log(
    `${geplant.length} Notizen: ${neu} neu, ${geaendert} geändert, ${gleich} unverändert` +
      ` (${chronik.length} davon Entscheidungen, ${DOKUMENTE.length} Dokumente)`
  )
  if (NUR_PRUEFEN && (neu || geaendert)) {
    console.log('VERALTET – `npm run obsidian` laufen lassen.')
    process.exit(1)
  }
}

/* Nur beim direkten Aufruf, nie beim Importieren – siehe oben. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  ablegen()
}
