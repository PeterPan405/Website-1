/**
 * Das Projektgedächtnis als Obsidian-Notizen.
 *
 * ## Warum es diese Datei gibt
 *
 * Am 29. September 2026 hat der Betreiber gefragt, ob in den letzten Wochen
 * und Monaten alle Informationen in Obsidian gespeichert worden seien.
 *
 * Nachgesehen: **nein, kein einziges Mal.** Weder im Arbeitsbaum noch in der
 * ganzen Historie von `Website-1` steht das Wort, das Repository
 * `alles-m-gliche-` enthält genau eine Datei, es gibt keinen
 * Obsidian-Connector – nicht bei den verbundenen und auch keinen im
 * Verzeichnis –, und in keiner `AGENTS.md` stand je eine Regel dazu. Was dort
 * nicht steht, tut keine Sitzung.
 *
 * Das Gedächtnis liegt statt dessen in `ENTSCHEIDUNGEN.md`: 230.000 Zeichen,
 * zwanzig Fälle, in **einer** Datei. Zum Nachschlagen beim Arbeiten ist das
 * richtig – die Datei wird gelesen, wenn jemand eine Regel anzweifelt. Zum
 * Wiederfinden Monate später ist es das nicht.
 *
 * ## Warum erzeugt und nicht von Hand geschrieben
 *
 * Weil sonst zwei Wahrheiten entstehen. Eine Notiz, die jemand in Obsidian
 * bearbeitet, und ein Abschnitt in `ENTSCHEIDUNGEN.md`, der weiterläuft –
 * nach vier Wochen weiß niemand mehr, welcher von beiden gilt. Genau diese
 * Sorte Doppelung hat dieses Projekt schon zweimal Geld gekostet.
 *
 * Deshalb: **`ENTSCHEIDUNGEN.md` und `AGENTS.md` sind die Quelle, der Ordner
 * `wissen/` ist ein Abbild.** Der Text wird wörtlich übernommen, nie
 * umformuliert. Wer eine Notiz ändern will, ändert die Quelle.
 *
 * Eigene Gedanken haben im Vault trotzdem Platz – nur nicht in diesem Ordner.
 * Das Spiegelskript rührt nichts an, was außerhalb liegt.
 */

/** Ein Abschnitt aus `ENTSCHEIDUNGEN.md` – alles unter einer `#`-Überschrift. */
export interface Abschnitt {
  /** Die Überschrift ohne `#`, ohne den Datumszusatz. */
  titel: string
  /** Die vollständige Überschrift, wie sie in der Datei steht. */
  ueberschrift: string
  /** `JJJJ-MM-TT`, wenn die Überschrift ein Datum nennt – sonst `null`. */
  datum: string | null
  /**
   * Die Überschriften darin, für die Auflösung der Verweise.
   *
   * **Zwei Ebenen, nicht eine.** Der erste Entwurf sammelte nur `##`, und
   * zwei der zwanzig Verweise aus `AGENTS.md` zeigten damit ins Leere –
   * „Eine Fallunterscheidung über Merkmale, die der Stoff nicht hat, ist
   * keine" und „Was englisch ist, wird englisch gesprochen" stehen als `###`.
   * Eine Prüfung, die still auslässt, was sie nicht findet, ist keine.
   */
  unterpunkte: { ebene: number; titel: string }[]
  /** Der Abschnitt wörtlich, mit Überschrift. */
  inhalt: string
}

const MONATE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

/**
 * Liest das Datum aus einer Überschrift – `– 28. September 2026`.
 *
 * Zwei Schreibweisen kommen vor, mit Gedankenstrich und mit Komma
 * („Mache das selber" – wo die Grenze wirklich liegt, 28. August 2026).
 * Beide werden erkannt; alles andere ergibt `null`, und das ist kein Fehler:
 * Die ältesten Abschnitte tragen kein Datum.
 */
export function datumAus(ueberschrift: string): string | null {
  const treffer = /[–—,]\s*(\d{1,2})\.\s*([A-Za-zäöüÄÖÜ]+)\s*(\d{4})\s*$/.exec(
    ueberschrift
  )
  if (!treffer) return null
  const monat = MONATE.indexOf(treffer[2])
  if (monat < 0) return null
  return `${treffer[3]}-${String(monat + 1).padStart(2, '0')}-${treffer[1].padStart(2, '0')}`
}

/** Die Überschrift ohne den Datumszusatz. */
export function ohneDatum(ueberschrift: string): string {
  return ueberschrift
    .replace(/\s*[–—,]\s*\d{1,2}\.\s*[A-Za-zäöüÄÖÜ]+\s*\d{4}\s*$/, '')
    .trim()
}

/**
 * Ein Dateiname, den Windows, Obsidian und Git gleichermaßen annehmen.
 *
 * Verboten sind unter Windows `\ / : * ? " < > |`; dazu kommen die deutschen
 * Anführungszeichen, weil sie in fast jeder Überschrift stehen und in einem
 * `[[Wikilink]]` schlecht aussehen. Umlaute bleiben – sie sind auf allen drei
 * Seiten unproblematisch, und ein „Fuer" statt „Für" wäre nicht mehr der Titel.
 *
 * Der Punkt am Ende fällt weg: Windows schneidet ihn stillschweigend ab, und
 * dann findet der Abgleich die Datei nicht wieder, die er gerade geschrieben hat.
 */
export function dateiname(titel: string): string {
  return (
    titel
      .replace(/[„“”"']/g, '')
      .replace(/[\\/:*?<>|#^[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\.+$/, '')
      .slice(0, 100)
      .trim() + '.md'
  )
}

/**
 * Zerlegt `ENTSCHEIDUNGEN.md` in seine `#`-Abschnitte.
 *
 * Der erste Abschnitt ist die Einleitung der Datei und kein Fall; der Block
 * zwischen den `nextjs-agent-rules`-Markern wird von außen eingesetzt und
 * gehört ebenfalls nicht ins Gedächtnis. Beide fallen heraus – benannt, nicht
 * über eine Zählung, damit ein neuer Abschnitt am Anfang nichts verschiebt.
 */
export function zerlegeEntscheidungen(text: string): Abschnitt[] {
  const zeilen = text.split('\n')
  const abschnitte: Abschnitt[] = []
  let laufend: string[] | null = null
  let ueberschrift = ''
  let inMarker = false

  const abschliessen = () => {
    if (laufend === null) return
    const inhalt = laufend.join('\n').replace(/\n+$/, '') + '\n'
    abschnitte.push({
      titel: ohneDatum(ueberschrift),
      ueberschrift,
      datum: datumAus(ueberschrift),
      unterpunkte: laufend
        .filter((z) => /^#{2,3} /.test(z))
        .map((z) => ({
          ebene: z.startsWith('### ') ? 3 : 2,
          titel: z.replace(/^#+\s*/, '').trim(),
        })),
      inhalt,
    })
    laufend = null
  }

  for (const zeile of zeilen) {
    if (/^<!--\s*BEGIN:/.test(zeile)) inMarker = true
    if (/^# /.test(zeile) && !inMarker) {
      abschliessen()
      ueberschrift = zeile.replace(/^#\s*/, '').trim()
      laufend = [zeile]
    } else if (laufend !== null) {
      laufend.push(zeile)
    }
    if (/^<!--\s*END:/.test(zeile)) inMarker = false
  }
  abschliessen()

  return abschnitte.filter((a) => a.titel !== 'Entscheidungen und ihre Vorgeschichte')
}

/** Vergleichsform für Verweise: ohne Anführungszeichen, ohne Mehrfach-Leerzeichen. */
function vergleichbar(text: string): string {
  return text
    .replace(/[„“”"'`*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

/** Wohin ein Verweis zeigt: auf eine Notiz, und oft auf eine Stelle darin. */
export interface Ziel {
  abschnitt: Abschnitt
  /** Die Überschrift innerhalb der Notiz, oder `null` für ihren Anfang. */
  anker: string | null
}

/**
 * Sucht zu einem Verweis aus `AGENTS.md` die Stelle, die er meint.
 *
 * `AGENTS.md` verweist mit Bruchstücken – „heißt der jüngste Erscheinungstag"
 * steht für den Abschnitt „Nachrichten: ‚Aktuell' heißt der jüngste
 * Erscheinungstag". Gesucht wird deshalb als **Teilzeichenkette**, zuerst in
 * den `#`-Überschriften, dann in den Überschriften darunter.
 *
 * ## Warum der Anker gebraucht wird
 *
 * Weil `ENTSCHEIDUNGEN.md` nicht so aufgebaut ist, wie seine eigene Einleitung
 * behauptet. Dort steht: „Die Abschnittsüberschriften sind dieselben wie die
 * Verweise in `AGENTS.md`." Nachgezählt am 29. September 2026 stimmt das für
 * **elf** der zwanzig Verweise; die anderen neun zeigen auf eine `##`- oder
 * `###`-Überschrift, die unter einer ganz anderen `#`-Überschrift einsortiert
 * ist – neue Fälle sind über Monate unter die jeweils letzte Hauptüberschrift
 * gehängt worden.
 *
 * Vier der zwanzig Abschnitte tragen dadurch 161.000 der 231.000 Zeichen;
 * „Ein Kurs ist so alt wie die Stelle, die ihn anzeigt" allein 62.000 mit
 * dreizehn Unterpunkten, von denen die wenigsten mit Kursen zu tun haben.
 *
 * Das ist ein Befund über die Quelle, nicht über dieses Abbild, und es wird
 * hier **nicht** heimlich geradegezogen: Der Verweis bekommt den Anker auf
 * seine Überschrift und landet damit an der richtigen Stelle, auch in einer
 * Notiz, die sechzigtausend Zeichen lang ist.
 */
export function abschnittZuVerweis(
  verweis: string,
  abschnitte: Abschnitt[]
): Ziel | null {
  const gesucht = vergleichbar(verweis)
  if (!gesucht) return null

  const direkt = abschnitte.find((a) => vergleichbar(a.ueberschrift).includes(gesucht))
  if (direkt) return { abschnitt: direkt, anker: null }

  for (const abschnitt of abschnitte) {
    const unterpunkt = abschnitt.unterpunkte.find((u) =>
      vergleichbar(u.titel).includes(gesucht)
    )
    if (unterpunkt) return { abschnitt, anker: unterpunkt.titel }
  }
  return null
}

/**
 * Das Ziel als Wikilink-Rumpf: `Datei` oder `Datei#Überschrift`.
 *
 * Ein `#` in der Überschrift müsste in Obsidian maskiert werden; es kommt in
 * keiner vor, und falls doch, fällt es beim Vergleich der Prüfung auf.
 */
function wikilink(ziel: Ziel): string {
  const datei = dateiname(ziel.abschnitt.titel).replace(/\.md$/, '')
  return ziel.anker ? `${datei}#${ziel.anker}` : datei
}

/**
 * Ein Verweis in `AGENTS.md` läuft über zwei Zeilen, ein Linktext darf das
 * nicht: Obsidian bricht den Link sonst auf.
 */
function einzeilig(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/**
 * Ein Wikilink, und der Zusatz nur, wenn er etwas sagt.
 *
 * `[[Die Folge war halb Kleingedrucktes|Die Folge war halb Kleingedrucktes]]`
 * ist beides zugleich: länger und nichtssagend. Steht der Titel schon im
 * Dateinamen, bleibt der Link kurz.
 */
function link(ziel: string, text: string): string {
  return ziel === text ? `[[${ziel}]]` : `[[${ziel}|${text}]]`
}

/** Alle Verweise aus einer `→ ENTSCHEIDUNGEN.md:`-Zeile in `AGENTS.md`. */
export function verweiseAus(text: string): string[] {
  const treffer: string[] = []
  /* Die Verweiszeilen laufen über mehrere Zeilen weiter, deshalb erst den
     Block ab dem Pfeil bis zur nächsten Leerzeile nehmen. */
  for (const block of text.split(/\n\s*\n/)) {
    if (!/→\s*`?ENTSCHEIDUNGEN\.md`?\s*:/.test(block)) continue
    for (const m of block.matchAll(/[„“]([^“”"]+)["“”]/g)) treffer.push(m[1].trim())
  }
  return treffer
}

/** Der Kopf einer Notiz. Obsidian liest ihn als YAML. */
function kopf(felder: Record<string, string | string[] | null>): string {
  const zeilen = ['---']
  for (const [name, wert] of Object.entries(felder)) {
    if (wert === null) continue
    if (Array.isArray(wert)) {
      zeilen.push(`${name}:`)
      for (const eintrag of wert) zeilen.push(`  - ${eintrag}`)
    } else {
      zeilen.push(`${name}: ${/[:#]/.test(wert) ? JSON.stringify(wert) : wert}`)
    }
  }
  zeilen.push('---', '')
  return zeilen.join('\n')
}

/**
 * Der Hinweis, der in **jeder** Notiz steht.
 *
 * Ohne ihn bearbeitet früher oder später jemand die Notiz im Vault, und die
 * Änderung ist beim nächsten Lauf weg. Der Satz kostet drei Zeilen und spart
 * den Ärger.
 */
const ABBILD_HINWEIS =
  '> [!info] Abbild – nicht hier bearbeiten\n' +
  '> Diese Notiz wird aus `%QUELLE%` im Repository `Website-1` erzeugt\n' +
  '> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.\n'

function hinweis(quelle: string): string {
  return ABBILD_HINWEIS.replace('%QUELLE%', quelle)
}

/** Eine Notiz aus einem Abschnitt. */
export function notiz(abschnitt: Abschnitt): string {
  return (
    kopf({
      titel: abschnitt.titel,
      datum: abschnitt.datum,
      quelle: 'ENTSCHEIDUNGEN.md',
      tags: ['projektgedaechtnis', 'website-1'],
    }) +
    hinweis('ENTSCHEIDUNGEN.md') +
    '\n' +
    abschnitt.inhalt
  )
}

/** Die Übersicht, von der aus alles erreichbar ist. */
export function uebersicht(abschnitte: Abschnitt[]): string {
  const mitDatum = abschnitte
    .filter((a) => a.datum)
    .sort((a, b) => b.datum!.localeCompare(a.datum!))
  const ohne = abschnitte.filter((a) => !a.datum)

  /*
    Unter jeder Notiz stehen ihre Unterpunkte als Anker.

    Das ist kein Zierrat, sondern die Antwort auf den Zustand der Quelle: Vier
    der zwanzig Notizen tragen 161.000 der 231.000 Zeichen, weil neue Fälle
    über Monate unter die jeweils letzte Hauptüberschrift gehängt wurden. Wer
    nur die Titel sähe, fände „Ein Commit vom Bot löst nichts aus" nirgends –
    es steht unter „Ein Kurs ist so alt wie die Stelle, die ihn anzeigt".

    Nur `##`, nicht `###`: Die dritte Ebene sind Kapitel innerhalb eines
    Falls; eine Übersicht mit 94 weiteren Zeilen wäre keine mehr.
  */
  const zeile = (a: Abschnitt) => {
    const datei = dateiname(a.titel).replace(/\.md$/, '')
    const kopfzeile = `- ${a.datum ? `**${a.datum}** – ` : ''}${link(datei, a.titel)}`
    const zwei = a.unterpunkte.filter((u) => u.ebene === 2)
    if (zwei.length < 4) return kopfzeile
    return (
      kopfzeile +
      '\n' +
      zwei.map((u) => `    - ${link(`${datei}#${u.titel}`, u.titel)}`).join('\n')
    )
  }

  return (
    kopf({
      titel: 'Projektgedächtnis Website-1',
      quelle: 'ENTSCHEIDUNGEN.md',
      tags: ['projektgedaechtnis', 'website-1', 'uebersicht'],
    }) +
    hinweis('ENTSCHEIDUNGEN.md und AGENTS.md') +
    `
# Projektgedächtnis Website-1

Was schiefging, was nachgezählt wurde, welcher Weg verworfen wurde und woran
er scheiterte. Die Regeln, die daraus wurden, stehen in [[Regeln]].

**${abschnitte.length} Fälle.** Die Quelle ist \`ENTSCHEIDUNGEN.md\` im
Repository – dieser Ordner ist ein Abbild und wird erzeugt, nicht gepflegt.

## Mit Datum

${mitDatum.map(zeile).join('\n')}

## Ohne Datum – die Grundsätze

${ohne.map(zeile).join('\n')}
`
  )
}

/**
 * Die Regeln, mit klickbaren Verweisen.
 *
 * `AGENTS.md` wird wörtlich übernommen; ersetzt wird nur, was in Obsidian
 * sonst tot dastünde: Aus `→ ENTSCHEIDUNGEN.md: „X"` wird ein `[[Wikilink]]`
 * auf die Notiz, die X enthält.
 *
 * Ein Verweis, der ins Leere zeigt, bleibt **stehen wie er ist** und wird von
 * `unaufloesbareVerweise()` gemeldet. Ihn stillschweigend zu verschlucken
 * hieße, eine Umbenennung in `ENTSCHEIDUNGEN.md` unsichtbar zu machen – und
 * genau die ist der Fall, für den es die Prüfung gibt.
 */
export function regelnNotiz(agents: string, abschnitte: Abschnitt[]): string {
  /* Ersetzt wird **nur in den Verweisblöcken**. Überall sonst stehen
     Anführungszeichen um gesprochene Beispiele („ETF", „KI", „Broker") und um
     Zitate des Betreibers – daraus Links zu machen wäre Unsinn und würde die
     Regeln unlesbar machen. */
  const ersetzt = agents.split(/\n\s*\n/).map((block) =>
    /→\s*`?ENTSCHEIDUNGEN\.md`?\s*:/.test(block)
      ? block.replace(/[„“]([^“”"]+)["“”]/g, (ganz, inhalt: string) => {
          const ziel = abschnittZuVerweis(inhalt, abschnitte)
          return ziel ? link(wikilink(ziel), einzeilig(inhalt)) : ganz
        })
      : block
  )

  return (
    kopf({
      titel: 'Regeln Website-1',
      quelle: 'AGENTS.md',
      tags: ['projektgedaechtnis', 'website-1', 'regeln'],
    }) +
    hinweis('AGENTS.md') +
    '\n' +
    ersetzt.join('\n\n').replace(/\n+$/, '') +
    '\n'
  )
}

/** Verweise in `AGENTS.md`, zu denen es keinen Abschnitt gibt. */
export function unaufloesbareVerweise(agents: string, abschnitte: Abschnitt[]): string[] {
  return verweiseAus(agents).filter((v) => abschnittZuVerweis(v, abschnitte) === null)
}

/**
 * Der ganze Ordner, als Zuordnung von Dateiname auf Inhalt.
 *
 * Eine Zuordnung und keine Schreiboperation: So lässt sich derselbe Aufbau
 * prüfen, ohne etwas anzufassen – die Prüfung vergleicht, das Skript schreibt.
 */
export function alleNotizen(entscheidungen: string, agents: string): Map<string, string> {
  const abschnitte = zerlegeEntscheidungen(entscheidungen)
  const notizen = new Map<string, string>()
  notizen.set('Projektgedächtnis Website-1.md', uebersicht(abschnitte))
  notizen.set('Regeln.md', regelnNotiz(agents, abschnitte))
  for (const abschnitt of abschnitte) {
    notizen.set(dateiname(abschnitt.titel), notiz(abschnitt))
  }
  return notizen
}
