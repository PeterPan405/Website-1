/**
 * Was die Terminliste der Tokioter Börse über den *nächsten* Termin hergibt.
 *
 * ## Warum diese Sonde
 *
 * Der Tokio-Weg ist seit dem 23. August 2026 gebaut und hat bis zum 24. August
 * **null** Termine beigesteuert. Der Abruf sagt auch, warum: `inListe: 67`,
 * `kommend: 0` – von 72 geführten japanischen Titeln stehen 67 in der Liste,
 * und bei keinem liegt der genannte Tag noch in der Zukunft.
 *
 * Das ist kein Fehler im Abgleich, sondern eine Eigenschaft der Quelle. Die
 * Börse führt je Datei die Unternehmen, deren **Quartal in einem bestimmten
 * Monat endete** – „whose end of quarters or fiscal years in June 2026“. Wer
 * im März sein Geschäftsjahr beendet, meldet sein erstes Quartal Ende Juli
 * oder Anfang August; im Bestand vom 23. August war das vorbei.
 *
 * Die Liste hat damit eine Vorlaufzeit von wenigen Wochen und existiert für
 * unsere Titel nur viermal im Jahr. Zwischen den Quartalen ist sie leer.
 *
 * ## Was diese Sonde beantworten soll
 *
 * Ob sich aus derselben Datei ein **Abstand** ablesen lässt: Die Tabelle nennt
 * neben dem Meldetag auch das Ende des Berichtszeitraums. Ist der Abstand
 * zwischen beiden je Unternehmen stabil, ließe sich der nächste Meldetag
 * daraus ableiten – als geschätzter Tag, gekennzeichnet, wie es die
 * SEC-Ableitung auch tut.
 *
 * Gemessen wird deshalb:
 *
 * 1. Wie viele unserer Titel überhaupt einen **Periodenende**-Wert haben.
 *    Ohne ihn gibt es keinen Abstand, und die ganze Überlegung fällt.
 * 2. Wie der Abstand verteilt ist – über alle 3.000 Zeilen, nicht nur über
 *    unsere. Ein Mittelwert aus 67 Zeilen sagt weniger als eine Verteilung
 *    aus dreitausend.
 * 3. Welche Dateien die Übersichtsseite sonst noch führt. Gäbe es eine mit
 *    dem ganzen Jahr, wäre die Ableitung überflüssig.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`, Sonde `tokio`.
 * Aus der Entwicklungsumgebung ist `jpx.co.jp` nicht erreichbar.
 */

import { writeFile } from 'node:fs/promises'

import { marketDefinitions } from '../data/markets.ts'
import {
  holeTermine,
  JPX_TERMINSEITE,
  tabellenAdressen,
} from '../lib/providers/jpx-termine.ts'

const BERICHT = 'tokio-abstaende.json'

/** Tage zwischen zwei ISO-Tagen, `a` minus `b`. */
function tage(a: string, b: string): number {
  return Math.round((Date.parse(a) - Date.parse(b)) / 86_400_000)
}

/** Die Codes unserer japanischen Titel, auf das Börsenkürzel abgebildet. */
function japanischeCodes(): Map<string, string> {
  const jeCode = new Map<string, string>()
  for (const eintrag of marketDefinitions) {
    if (eintrag.kind !== 'stock') continue
    const code = /^([0-9][0-9A-Z]{3})\.T$/.exec(eintrag.ticker)?.[1]
    if (code) jeCode.set(code, eintrag.ticker)
  }
  return jeCode
}

async function main() {
  /*
    Zuerst die Dateiliste – sie ist die billigste Auskunft und die einzige,
    die die ganze Überlegung erübrigen könnte.
  */
  const seite = await (
    await fetch(JPX_TERMINSEITE, {
      headers: { 'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com' },
    })
  ).text()
  const adressen = tabellenAdressen(seite)

  console.log(`Übersichtsseite: ${JPX_TERMINSEITE}`)
  console.log(`${adressen.length} XLSX verlinkt:`)
  for (const adresse of adressen) console.log(`  ${adresse}`)

  const jpx = await holeTermine()
  console.log(`\n${jpx.termine.length} Zeilen, Stand laut Datei ${jpx.stand ?? '—'}.`)
  console.log(`Erkannte Spalten: ${jpx.kopf.join('  ///  ')}`)

  /* ------------------------------------------------ 1. Periodenende da? */

  const mitEnde = jpx.termine.filter((t) => t.periodenende !== '')
  console.log(
    `\nPeriodenende gefüllt: ${mitEnde.length} von ${jpx.termine.length} Zeilen.`
  )

  if (mitEnde.length === 0) {
    console.log(
      '\n::warning::Ohne Periodenende gibt es keinen Abstand – die Ableitung fällt aus.'
    )
    await writeFile(BERICHT, JSON.stringify({ adressen, abstaende: [] }, null, 2))
    return
  }

  /* -------------------------------------------- 2. Wie liegt der Abstand? */

  const abstaende = mitEnde
    .map((t) => ({ ...t, abstand: tage(t.termin, t.periodenende) }))
    .filter((t) => Number.isFinite(t.abstand))

  const sortiert = [...abstaende].map((t) => t.abstand).sort((a, b) => a - b)
  const anteil = (p: number) => sortiert[Math.floor((sortiert.length - 1) * p)]

  console.log('\nAbstand zwischen Periodenende und Meldetag, in Tagen:')
  console.log(
    `  kleinster ${sortiert[0]}, 10 % ${anteil(0.1)}, Median ${anteil(0.5)}, ` +
      `90 % ${anteil(0.9)}, größter ${sortiert[sortiert.length - 1]}`
  )

  /*
    Die Verteilung als Histogramm über Wochen.

    Eine Spanne allein sagt nicht, ob der Abstand *stabil* ist. Liegen neun
    von zehn Zeilen in derselben Woche, trägt eine Ableitung; verteilen sie
    sich gleichmäßig über zwei Monate, trägt sie nicht.
  */
  const woche = new Map<number, number>()
  for (const t of abstaende) {
    const w = Math.floor(t.abstand / 7)
    woche.set(w, (woche.get(w) ?? 0) + 1)
  }
  console.log('\n  Woche nach Periodenende → Zeilen:')
  for (const [w, n] of [...woche.entries()].sort((a, b) => a[0] - b[0])) {
    const balken = '#'.repeat(Math.max(1, Math.round((n / abstaende.length) * 60)))
    console.log(
      `  ${String(w * 7).padStart(3)}–${String(w * 7 + 6).padStart(3)} Tage ${String(n).padStart(5)}  ${balken}`
    )
  }

  /* ----------------------------------------- 3. Und für unsere Titel? */

  const jeCode = japanischeCodes()
  const unsere = abstaende
    .filter((t) => jeCode.has(t.code))
    .map((t) => ({ kuerzel: jeCode.get(t.code)!, ...t }))
    .sort((a, b) => a.abstand - b.abstand)

  console.log(
    `\n${unsere.length} Zeilen betreffen unsere ${jeCode.size} geführten japanischen Titel:`
  )
  for (const t of unsere) {
    console.log(
      `  ${t.kuerzel.padEnd(9)} Ende ${t.periodenende}  Meldung ${t.termin}  ` +
        `${String(t.abstand).padStart(3)} Tage  ${t.name}`
    )
  }

  const ohneEnde = jpx.termine.filter((t) => jeCode.has(t.code) && t.periodenende === '')
  if (ohneEnde.length > 0) {
    console.log(
      `\n${ohneEnde.length} unserer Zeilen haben **kein** Periodenende: ` +
        ohneEnde.map((t) => jeCode.get(t.code)).join(', ')
    )
  }

  await writeFile(
    BERICHT,
    JSON.stringify(
      {
        stand: jpx.stand,
        adressen,
        kopf: jpx.kopf,
        zeilen: jpx.termine.length,
        mitPeriodenende: mitEnde.length,
        verteilung: Object.fromEntries(
          [...woche.entries()].sort((a, b) => a[0] - b[0]).map(([w, n]) => [w * 7, n])
        ),
        unsere: unsere.map((t) => ({
          kuerzel: t.kuerzel,
          code: t.code,
          name: t.name,
          periodenende: t.periodenende,
          termin: t.termin,
          abstand: t.abstand,
        })),
      },
      null,
      2
    )
  )
  console.log(`\nAbstände in ${BERICHT}.`)
}

await main()
