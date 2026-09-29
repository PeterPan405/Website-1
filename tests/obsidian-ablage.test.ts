/**
 * Prüfungen für die Obsidian-Ablage.
 *
 * ## Warum gerade diese Prüfungen
 *
 * Das Skript schreibt Repo-Inhalte in einen Ordner ausserhalb des Repos. Zwei
 * Dinge können dabei teuer werden, und beide sind still:
 *
 * 1. **Ein Schlüssel rutscht durch.** Dagegen steht `pruefeGeheimnisse()`.
 *    Eine Sperre, die nie anschlägt, sieht aus wie Ruhe – deshalb bekommt sie
 *    hier Material, das sie beanstanden **muss**, und daneben Material, das
 *    sie durchlassen muss. Ein Melder, der auf alles anschlägt, wird
 *    abgeschaltet und ist danach kein Melder mehr.
 * 2. **Das Zerlegen verschluckt Abschnitte.** 82 Überschriften hinein, 80
 *    Notizen heraus – und niemand zählt nach. Deshalb wird hier gegen die
 *    echte `ENTSCHEIDUNGEN.md` gezählt, nicht gegen ein Beispiel.
 *
 * Der Tresor selbst wird nicht gebraucht: Diese Datei prüft die Logik, nicht
 * das Schreiben. Sonst liefe der Test in CI nie – dort gibt es kein
 * `C:\Obsidian`.
 */

import { readFileSync } from 'node:fs'

import {
  chronikTeilen,
  dateiName,
  pruefeGeheimnisse,
  titelVergeben,
} from '../scripts/obsidian-ablage.ts'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/* ------------------------------------------- Die Sperre muss anschlagen */

const musserkannt: [string, string][] = [
  [
    /*
      Mit Körper, denn nur so sieht ein echter Schlüssel aus.

      Der erste Anlauf prüfte den blossen Header – und wurde grün gemeldet,
      obwohl die Sperre ihn seit der Verfeinerung durchlässt. Ein Testfall,
      den es in der Wirklichkeit nicht gibt, prüft nichts.
    */
    '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAvX9tR3nQwK2mB7cZpL4eYjH6sD1aFgT0uNxV5iOcPqRbWyEz',
    'ein privater Schlüssel',
  ],
  ['sk-proj-abcdefghijklmnopqrstuvwxyz0123', 'ein OpenAI-artiger Schlüssel'],
  ['ghp_abcdefghijklmnopqrstuvwxyz0123456789', 'eine GitHub-Marke'],
  ['AIzaSyAbcdefghijklmnopqrstuvwxyz0123456', 'ein Google-Schlüssel'],
  ['ALPHAVANTAGE_API_KEY=R7XK2P9QW4TZ8N3M', 'eine Zuweisung mit Wert'],
  ['HOSTINGER_SSH_PASSWORD: hunter2istzukurz', 'ein Passwort hinter einem Unterstrich'],
]

for (const [text, was] of musserkannt) {
  const fund = pruefeGeheimnisse(`Irgendein Text\n${text}\nund noch eine Zeile`)
  pruefe(
    `erkannt: ${was}`,
    fund !== null && fund.zeile === 2,
    fund === null
      ? `„${text.slice(0, 40)}…" ist durchgerutscht – das Muster greift nicht.`
      : `gefunden in Zeile ${fund.zeile} statt 2.`
  )
}

/* ------------------------------------- …und bei Harmlosem schweigen */

const mussdurch: [string, string][] = [
  [
    'export const SCHLUESSEL = process.env.ALPHAVANTAGE_API_KEY',
    'ein Verweis auf process.env',
  ],
  ['googleSiteVerification: <HIER EINFÜGEN>', 'ein Platzhalter'],
  ['Das PASSWORT gehört nie in den Chat.', 'das blosse Wort ohne Zuweisung'],
  ['`ANTHROPIC_API_KEY` als Secret hinterlegen', 'ein Name in Anführungszeichen'],
  ['API_KEY = ${process.env.API_KEY}', 'eine Einsetzung'],
  /*
    Der Fall, wegen dem die Verfeinerung überhaupt entstand: Genau dieser
    Satz steht in EINRICHTUNG.md Zeile 94 und hätte die Ablage jeden Tag
    abgebrochen. Ein Header ohne Körper ist eine Formatbeschreibung.
  */
  [
    'Der Inhalt beginnt mit `-----BEGIN OPENSSH PRIVATE KEY-----` und endet mit',
    'ein BEGIN-Header ohne Schlüsselkörper',
  ],
]

for (const [text, was] of mussdurch) {
  const fund = pruefeGeheimnisse(text)
  pruefe(
    `durchgelassen: ${was}`,
    fund === null,
    fund === null ? '' : `fälschlich beanstandet als ${fund.muster}: ${fund.stelle}`
  )
}

/*
  Die Gegenprobe am eigenen Haus.

  Wenn die Sperre auf den echten Dateien anschlägt, die abgelegt werden
  sollen, bricht der Lauf jedes Mal ab – und dann wird die Sperre entschärft
  statt die Stelle geklärt. Also hier nachsehen, solange es ruhig ist.
*/
for (const datei of ['AGENTS.md', 'ENTSCHEIDUNGEN.md', 'EINRICHTUNG.md', 'README.md']) {
  const fund = pruefeGeheimnisse(readFileSync(datei, 'utf8'))
  pruefe(
    `${datei} enthält nichts, was nach einem Geheimnis aussieht`,
    fund === null,
    fund === null ? '' : `Zeile ${fund.zeile}, ${fund.muster}: ${fund.stelle}…`
  )
}

/* ------------------------------------------------- Das Zerlegen zählt */

const roh = readFileSync('ENTSCHEIDUNGEN.md', 'utf8')
const ueberschriften = roh.split('\n').filter((z) => /^## /.test(z)).length
const stuecke = chronikTeilen(roh)

pruefe(
  `Jede der ${ueberschriften} Überschriften wird ein Stück`,
  stuecke.length === ueberschriften,
  `${stuecke.length} Stücke aus ${ueberschriften} Überschriften – es gehen welche verloren.`
)

/*
  `[].every(…)` ist `true`.

  Beim ersten Lauf kamen null Stücke heraus, und die drei Prüfungen darunter
  meldeten alle grün – „kein Stück ist leer", „keine Auszeichnung", „kein
  doppelter Name" stimmen für eine leere Menge sämtlich. Rot war nur die
  Zählung darüber. Genau dieser Fall steht schon einmal in ENTSCHEIDUNGEN.md
  („Zwei Prüfungen, die sich widersprachen, solange eine Menge leer war").

  Deshalb steht vor jeder Aussage über die Stücke erst die Frage, ob es
  überhaupt welche gibt.
*/
pruefe(
  'Es gibt überhaupt Stücke',
  stuecke.length > 0,
  'Ohne Stücke sagen die Prüfungen darunter nichts aus – sie wären alle grün.'
)

pruefe(
  'Kein Stück ist leer',
  stuecke.length > 0 && stuecke.every((s) => s.titel.length > 0 && s.zeilen.length > 1),
  stuecke
    .filter((s) => !s.titel || s.zeilen.length <= 1)
    .map((s) => `„${s.titel}"`)
    .join(', ')
)

pruefe(
  'Die Titel tragen keine Auszeichnung mehr',
  stuecke.length > 0 &&
    stuecke.every((s) => !s.titel.includes('**') && !s.titel.includes('„')),
  stuecke
    .filter((s) => s.titel.includes('**') || s.titel.includes('„'))
    .map((s) => `„${s.titel}"`)
    .join(', ')
)

/*
  Zwei Abschnitte mit demselben Dateinamen würden sich gegenseitig
  überschreiben – und zwar lautlos: Am Ende stünden 79 Notizen da, wo 82
  hingehören, und die Eingangsseite verlinkte mehrfach dieselbe.

  Das ist kein erfundener Fall. Vier Kapitel schliessen mit einem Abschnitt
  namens „Die Lehre"; `titelVergeben()` stellt genau diesen vier das Kapitel
  voran und lässt alle eindeutigen Titel kurz.
*/
const titel = titelVergeben(stuecke)
const namen = titel.map(dateiName)

pruefe(
  'Mehrfache Titel bekommen ihr Kapitel voran',
  titel.filter((t) => t.includes(' · Die Lehre')).length === 4,
  `${titel.filter((t) => t.includes(' · Die Lehre')).length} statt 4 – ` +
    `und blank steht „Die Lehre" noch ${titel.filter((t) => t === 'Die Lehre').length}-mal da.`
)

pruefe(
  'Eindeutige Titel bleiben kurz',
  titel.includes('Wozu diese Datei'),
  'Auch eindeutige Abschnitte bekommen das Kapitel vorangestellt – unnötig lang.'
)
const doppelt = namen.filter((n, i) => namen.indexOf(n) !== i)
pruefe(
  'Kein Dateiname kommt zweimal vor',
  doppelt.length === 0,
  `doppelt: ${[...new Set(doppelt)].join(', ')}`
)

pruefe(
  'Kein Dateiname trägt ein für Windows verbotenes Zeichen',
  namen.length > 0 && namen.every((n) => !/[\\/:*?"<>|]/.test(n)),
  namen.filter((n) => /[\\/:*?"<>|]/.test(n)).join(', ')
)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
