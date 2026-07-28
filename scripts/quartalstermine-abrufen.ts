/**
 * Holt die Termine der Quartalszahlen bei der US-Börsenaufsicht.
 *
 * ## Warum 8-K und nicht 10-Q
 *
 * Gesucht ist der Tag, an dem ein Unternehmen seine Zahlen **veröffentlicht** –
 * das ist der Tag, an dem der Kurs sich bewegt. Die Bilanz selbst (`10-Q`,
 * `10-K`) wird Tage bis Wochen später eingereicht. Wer sie als Termin nimmt,
 * liegt systematisch zu spät.
 *
 * Die Veröffentlichung ist eine eigene Pflichtmeldung: ein `8-K` mit dem
 * Punkt **2.02 – Results of Operations and Financial Condition**. Genau danach
 * wird hier gesucht.
 *
 * ## Warum überhaupt gerechnet wird
 *
 * Künftige Termine stehen in keiner öffentlichen Datei. Unternehmen kündigen
 * sie wenige Wochen vorher selbst an, jedes auf seiner eigenen Seite. Es gibt
 * dafür keine freie Sammelquelle.
 *
 * Was es gibt, ist die eigene Vergangenheit jedes Unternehmens – und die ist
 * bemerkenswert regelmäßig. Apple meldet seit Jahren Ende Oktober, Ende
 * Januar, Ende April und Ende Juli, jeweils innerhalb weniger Tage desselben
 * Kalenderfensters. Aus dieser Reihe lässt sich der nächste Termin ableiten.
 *
 * Das Ergebnis ist eine **Schätzung**, und sie wird auf der Website auch so
 * ausgewiesen – mit dem Tag des Vorjahres als Beleg und mit einer Angabe
 * dazu, wie verlässlich das Muster bisher war. Ein erfundener Termin ohne
 * diesen Zusatz wäre schlimmer als gar keiner.
 *
 * ## Wen es nicht erfasst
 *
 * Nur Unternehmen, die bei der SEC ein `8-K` einreichen – also im Wesentlichen
 * US-Emittenten. Ausländische Emittenten melden über `6-K`, und das kennt
 * keine Punktnummern.
 *
 * Ob sich die Ergebnismeldung stattdessen an der Dokumentbeschreibung erkennen
 * lässt, ist geprüft worden und scheitert: Bei SAP, ASML, Novo Nordisk, Shell,
 * Sony und TSMC steht dort ausnahmslos „FORM 6-K“ und sonst nichts. Bei
 * AstraZeneca gibt es Beschreibungen, aber die Treffer auf „results“ sind
 * Studienergebnisse aus der Arzneimittelentwicklung – ein Filter darauf würde
 * Kalendereinträge erzeugen, die mit Quartalszahlen nichts zu tun haben.
 *
 * Für ausländische Emittenten bleibt der Kalender deshalb leer. Das ist eine
 * echte Lücke, sie ist auf der Seite benannt, und sie lässt sich mit dieser
 * Quelle nicht schließen. Eine plausibel aussehende Schätzung wäre hier
 * schlechter als keine Angabe.
 *
 * Aufruf: `npm run quartalstermine`
 */

import { writeFile } from 'node:fs/promises'

import { marketDefinitions, marketSources } from '../data/markets.ts'
import {
  holeTermine,
  istAbfragbar,
  KontingentErschoepft,
  marktcodeAusYahoo,
} from '../lib/providers/twelvedata-termine.ts'

const KOPFZEILEN: Record<string, string> = {
  'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com',
  'Accept-Encoding': 'gzip, deflate',
}

const TICKER_URL = 'https://www.sec.gov/files/company_tickers.json'
const SUBMISSIONS_BASIS = 'https://data.sec.gov/submissions'
const ZIEL = 'data/snapshots/quartalstermine.json'

/** Kürzel, die hier anders heißen als bei der SEC. */
const KUERZELBRUECKE: Record<string, string> = {
  '7203.T': 'TM',
  '6758.T': 'SONY',
  '7267.T': 'HMC',
  'SAN.MC': 'SAN',
}

/**
 * Die SEC bittet um höchstens zehn Anfragen je Sekunde.
 *
 * Gewählt sind fünf. Der Abruf läuft ohnehin nächtlich in einem Workflow;
 * doppelt so lange zu brauchen kostet nichts und hält Abstand zur Grenze.
 */
const PAUSE_MS = 200

/**
 * Abstand zwischen zwei Abfragen bei Twelve Data.
 *
 * Der kostenlose Tarif erlaubt acht Abrufe je Minute. Achteinhalb Sekunden
 * halten Abstand zur Grenze, ohne den Lauf unnötig zu dehnen: Für rund 370
 * offene Aktien sind das gut fünfzig Minuten, einmal die Woche.
 */
const TWELVEDATA_PAUSE_MS = 8_500

/** Vier Quartale, ein Jahr – so viele Termine werden vorausgerechnet. */
const VORHERSAGEN = 4

/**
 * Ein Jahr in Tagen, gemessen in ganzen Wochen.
 *
 * 364 statt 365: Unternehmen melden an Wochentagen, meist am selben
 * Wochentag wie im Vorjahr. Wer 365 addiert, verschiebt jeden Termin um
 * einen Wochentag und landet regelmäßig auf einem Samstag.
 */
const JAHR_IN_TAGEN = 364

interface Vorhersage {
  /** Erwarteter Termin, `JJJJ-MM-TT`. */
  erwartet: string
  /** Der tatsächliche Termin des Vorjahres, aus dem er abgeleitet ist. */
  basis: string
  /**
   * Wie weit die bisherigen Jahresabstände gestreut haben, in Tagen.
   *
   * Null hieße: Das Unternehmen meldet auf den Tag genau ein Jahr später.
   * Je größer der Wert, desto unschärfer die Vorhersage – die Website macht
   * daraus ein Zeitfenster statt eines Datums.
   */
  streuungTage: number
}

interface Eintrag {
  name: string
  /** Die letzten tatsächlichen Veröffentlichungen, neueste zuerst. */
  bisher: string[]
  vorhersagen: Vorhersage[]
}

function tage(a: string, b: string): number {
  return Math.round((Date.parse(a) - Date.parse(b)) / 86_400_000)
}

function plusTage(datum: string, anzahl: number): string {
  const d = new Date(`${datum}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + anzahl)
  return d.toISOString().slice(0, 10)
}

/**
 * Holt eine Datei und versucht es bei Störungen erneut.
 *
 * Ohne Wiederholung hing die Vollständigkeit an der Tagesform der Gegenstelle:
 * Im ersten Lauf fehlten ExxonMobil, Goldman Sachs und Fiserv, obwohl alle
 * drei reichlich Meldungen haben – ein einzelner gescheiterter Abruf, und das
 * Unternehmen fiel für eine Woche aus dem Kalender. Ein solcher Ausfall ist
 * unsichtbar: Ein fehlender Termin sieht aus wie ein Unternehmen ohne Muster.
 */
const VERSUCHE = 3

async function hole(url: string): Promise<unknown> {
  let letzterFehler: unknown = null

  for (let versuch = 1; versuch <= VERSUCHE; versuch++) {
    try {
      const antwort = await fetch(url, { headers: KOPFZEILEN })
      if (!antwort.ok) {
        throw new Error(`${antwort.status} ${antwort.statusText} – ${url}`)
      }
      return await antwort.json()
    } catch (fehler) {
      letzterFehler = fehler
      // Wachsender Abstand: 1s, 2s. Die SEC drosselt bei zu vielen Anfragen.
      if (versuch < VERSUCHE) {
        await new Promise((weiter) => setTimeout(weiter, 1000 * versuch))
      }
    }
  }

  throw letzterFehler
}

interface Einreichungen {
  form?: string[]
  filingDate?: string[]
  items?: string[]
}

/** Die Ergebnismeldungen aus einem Block von Einreichungen. */
function ergebnismeldungen(block: Einreichungen | undefined): string[] {
  const treffer: string[] = []
  if (!block?.form || !block.filingDate || !block.items) return treffer

  for (let i = 0; i < block.form.length; i++) {
    if (block.form[i] !== '8-K') continue
    if (!(block.items[i] ?? '').includes('2.02')) continue
    treffer.push(block.filingDate[i])
  }
  return treffer
}

/**
 * So viele Termine braucht die Ableitung, damit ein Muster erkennbar ist.
 *
 * Vier für die vier Quartale des kommenden Jahres, dazu mindestens einer aus
 * dem Vorjahr als Beleg. Weniger heißt: keine Vorhersage.
 */
const MINDESTTERMINE = 5

/**
 * Und so weit muss die Reihe zurückreichen.
 *
 * Die Zahl allein genügt nicht, und daran ist Goldman Sachs gescheitert: Die
 * Bank hatte fünf Meldungen – aber alle aus zwölf Monaten, weil zwei davon im
 * selben Januar lagen. Zu keinem der jüngeren Quartale gab es einen
 * Vorjahrespartner, also entstand keine einzige Vorhersage, obwohl formal
 * genug Daten da waren.
 *
 * Gut zwei Jahre statt genau zwei: Ein Unternehmen, das seinen Termin um zwei
 * Wochen verschiebt, soll nicht knapp aus dem Fenster fallen.
 */
const BENOETIGTE_HISTORIE_TAGE = 800

/** Reicht, was bisher zusammengekommen ist? */
function reichtAus(termine: readonly string[]): boolean {
  if (termine.length < MINDESTTERMINE) return false
  const sortiert = [...termine].sort()
  return tage(sortiert[sortiert.length - 1], sortiert[0]) >= BENOETIGTE_HISTORIE_TAGE
}

/**
 * Alle Veröffentlichungstermine eines Unternehmens, neueste zuerst.
 *
 * ## Warum die ausgelagerten Blöcke gelesen werden müssen
 *
 * Die submissions-Datei führt die jüngsten Einreichungen direkt und ältere in
 * ausgelagerten Blöcken. Ursprünglich wurde nur der junge Block gelesen – mit
 * der Begründung, für ein Muster genügten die jüngsten Meldungen.
 *
 * Das stimmt für die meisten Unternehmen und ist bei Großbanken grundfalsch.
 * JPMorgan hat im jungen Block **25.493** Einreichungen, und sie decken
 * dennoch nur zwölf Monate ab: Fast alle sind 8-K für strukturierte Anleihen.
 * Übrig bleiben vier Meldungen mit Punkt 2.02 – eine zu wenig. Dasselbe bei
 * Citigroup, Bank of America, Morgan Stanley und Goldman Sachs. Genau die
 * Häuser, deren Zahlen die Berichtssaison eröffnen, fehlten deshalb im
 * Kalender.
 *
 * Nachgeladen wird nur, solange die Reihe weder genug Termine noch genug
 * Historie hat. Bei den meisten Unternehmen entsteht dadurch keine einzige
 * zusätzliche Anfrage.
 *
 * ## Warum die Blöcke nach ihrem Zeitraum ausgewählt werden
 *
 * Sie stehen in der Datei aufsteigend nach Alter – `-001` enthält die
 * ältesten Einreichungen. Wer sie der Reihe nach nachlädt und aufhört, sobald
 * fünf Termine zusammen sind, bekommt bei JPMorgan Meldungen aus den
 * Neunzigerjahren und keine aus dem Vorjahr. Genau das ist im ersten Lauf
 * passiert: Die Bank tauchte danach zwar im Kalender auf, aber mit einem
 * einzigen Termin statt vier, weil zu jedem der jüngeren Quartale der
 * Vorjahrespartner fehlte.
 *
 * Ausgewählt wird deshalb über `filingTo`, den jüngsten Tag im Block, und in
 * absteigender Reihenfolge – also von der Gegenwart rückwärts. Fehlt das Feld,
 * bleibt es bei der Reihenfolge der Datei; dann ist wenigstens etwas besser
 * als nichts.
 */
async function termineVon(cik: number): Promise<{ name: string; termine: string[] }> {
  const kennung = String(cik).padStart(10, '0')
  const daten = (await hole(`${SUBMISSIONS_BASIS}/CIK${kennung}.json`)) as {
    name?: string
    filings?: {
      recent?: Einreichungen
      files?: { name?: string; filingFrom?: string; filingTo?: string }[]
    }
  }

  const termine = ergebnismeldungen(daten.filings?.recent)

  const bloecke = [...(daten.filings?.files ?? [])].sort((a, b) =>
    (b.filingTo ?? '').localeCompare(a.filingTo ?? '')
  )

  for (const block of bloecke) {
    if (reichtAus(termine)) break
    if (!block.name) continue

    try {
      const nachgeladen = (await hole(
        `${SUBMISSIONS_BASIS}/${block.name}`
      )) as Einreichungen
      termine.push(...ergebnismeldungen(nachgeladen))
    } catch (fehler) {
      // Ein fehlender Altblock ist kein Grund, das Unternehmen ganz fallen zu
      // lassen – vielleicht reicht schon, was bis hierher zusammengekommen ist.
      console.warn(`    Altblock ${block.name}: ${(fehler as Error).message}`)
    }
    await new Promise((weiter) => setTimeout(weiter, PAUSE_MS))
  }

  // Absteigend und ohne Dubletten – ein Tag kann mehrfach gemeldet worden sein.
  return {
    name: daten.name ?? '',
    termine: [...new Set(termine)].sort((a, b) => (a < b ? 1 : -1)),
  }
}

/**
 * Aus der Vergangenheit die nächsten Termine ableiten.
 *
 * Vorgehen: Für jeden der vier zuletzt gemeldeten Termine wird geprüft, ob es
 * ein Jahr davor einen passenden gab. Stimmt der Abstand ungefähr, ist das
 * Muster bestätigt – dann wird derselbe Abstand nach vorn fortgeschrieben.
 *
 * Gibt es kein Vorjahr zum Vergleich, entsteht keine Vorhersage. Lieber eine
 * Lücke als eine Zahl ohne Grundlage.
 */
function vorhersagen(termine: string[], heute: string): Vorhersage[] {
  if (termine.length < MINDESTTERMINE) return []

  const ergebnis: Vorhersage[] = []

  for (const basis of termine.slice(0, VORHERSAGEN)) {
    /*
      Der passende Termin des Vorjahres ist der, dessen Abstand am nächsten
      an einem Jahr liegt. Über den Index zu gehen wäre falsch: Manche
      Unternehmen melden fünfmal im Jahr, etwa bei einem Rumpfgeschäftsjahr.
    */
    let vorjahr: string | null = null
    let besterAbstand = Infinity
    for (const kandidat of termine) {
      const abstand = Math.abs(tage(basis, kandidat) - JAHR_IN_TAGEN)
      if (abstand < besterAbstand && tage(basis, kandidat) > 180) {
        besterAbstand = abstand
        vorjahr = kandidat
      }
    }

    // Mehr als drei Wochen Abweichung heißt: kein verlässliches Jahresmuster.
    if (!vorjahr || besterAbstand > 21) continue

    const erwartet = plusTage(basis, JAHR_IN_TAGEN)
    if (erwartet <= heute) continue

    ergebnis.push({ erwartet, basis, streuungTage: besterAbstand })
  }

  ergebnis.sort((a, b) => (a.erwartet < b.erwartet ? -1 : 1))

  /*
    Doppelte Vorhersagen für dasselbe Quartal entfernen.

    Manche Unternehmen melden zweimal kurz hintereinander – etwa den
    Jahresabschluss und wenige Tage später eine Ergänzung. Beide bekommen
    dann einen eigenen Vorjahrespartner, und im Kalender stünden zwei
    Termine für dieselbe Berichtsperiode. Beobachtet bei W&T Offshore mit
    dem 8. und dem 15. März.

    Behalten wird der Termin mit der kleineren Streuung: Er stammt aus dem
    Muster, das sich über die Jahre bestätigt hat.
  */
  const ABSTAND_GLEICHES_QUARTAL = 30
  const bereinigt: Vorhersage[] = []
  for (const kandidat of ergebnis) {
    const nachbar = bereinigt.findIndex(
      (vorhanden) =>
        Math.abs(tage(kandidat.erwartet, vorhanden.erwartet)) < ABSTAND_GLEICHES_QUARTAL
    )
    if (nachbar === -1) {
      bereinigt.push(kandidat)
      continue
    }
    if (kandidat.streuungTage < bereinigt[nachbar].streuungTage) {
      bereinigt[nachbar] = kandidat
    }
  }

  return bereinigt
}

async function main(): Promise<void> {
  const heute = new Date().toISOString().slice(0, 10)

  /*
    ------------------------------------------- Aktien der Website lesen

    Gelesen wird der Katalog selbst, nicht sein Quelltext.

    Bis hierher wurde die Datei als Text zerlegt und nach `ticker:` durchsucht.
    Das ging so lange gut, wie nur das Kürzel gebraucht wurde – und ging schief,
    sobald es um die Art ging: Der Ausdruck nahm auch Rohstoffe mit, und im
    Kalender stand „WTI Rohöl (USA): Quartalszahlen erwartet“, weil das Kürzel
    der Ölsorte bei der SEC einem Ölförderunternehmen gehört.

    Die Datenmodule sind bewusst mit relativen Pfaden geschrieben, damit
    Skripte sie mit blankem Node laden können. Also werden sie geladen. Dann
    ist `kind` ein Feld und keine Zeichenkette in einem Ausdruck.
  */
  const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock')
  const gefuehrt = new Set(aktien.map((eintrag) => eintrag.ticker))

  /** Kursquelle je Kürzel – für den zweiten Weg über Twelve Data. */
  const kursquellen = new Map<string, { yahoo: string; twelvedata: string }>()
  for (const eintrag of aktien) {
    const quelle = marketSources[eintrag.symbol]
    if (quelle && quelle.provider === 'market') {
      kursquellen.set(eintrag.ticker, {
        yahoo: quelle.yahoo,
        twelvedata: quelle.twelvedata,
      })
    }
  }

  console.log(
    `${gefuehrt.size} Aktien im Katalog der Website, ` +
      `${kursquellen.size} davon mit hinterlegter Kursquelle.`
  )

  // ------------------------------------------------- Kennnummern zuordnen
  const verzeichnis = (await hole(TICKER_URL)) as Record<
    string,
    { cik_str: number; ticker: string }
  >
  const cikJeKuerzel = new Map<string, number>()
  for (const eintrag of Object.values(verzeichnis)) {
    cikJeKuerzel.set(eintrag.ticker, eintrag.cik_str)
  }

  const gesucht: { katalog: string; cik: number }[] = []
  const nichtRegistriert: string[] = []
  for (const kuerzel of gefuehrt) {
    const secKuerzel = KUERZELBRUECKE[kuerzel] ?? kuerzel
    const cik = cikJeKuerzel.get(secKuerzel)
    if (cik !== undefined) gesucht.push({ katalog: kuerzel, cik })
    else nichtRegistriert.push(kuerzel)
  }
  console.log(`${gesucht.length} davon sind bei der SEC registriert.`)

  // ------------------------------------------------------------- abrufen
  const unternehmen: Record<string, Eintrag> = {}

  /*
    Wer herausfällt, wird namentlich festgehalten.

    Vorher wurden die Ausfälle nur gezählt. Eine Zahl beantwortet aber nicht
    die einzige Frage, die zählt: Fehlt hier ein Unternehmen, das eigentlich
    drin sein müsste? Die Liste macht aus einer Vermutung eine Prüfung – und
    hat auf Anhieb gezeigt, dass ExxonMobil und Goldman Sachs nicht an der
    Quelle scheitern, sondern am Muster.
  */
  const ohneMuster: string[] = []
  const gescheitert: string[] = []

  for (const [index, { katalog, cik }] of gesucht.entries()) {
    try {
      const { name, termine } = await termineVon(cik)
      const abgeleitet = vorhersagen(termine, heute)

      if (abgeleitet.length === 0) {
        ohneMuster.push(`${katalog}/CIK${cik} (${termine.length} Meldungen)`)
      } else {
        unternehmen[katalog] = {
          name,
          bisher: termine.slice(0, 8),
          vorhersagen: abgeleitet,
        }
      }
    } catch (fehler) {
      gescheitert.push(katalog)
      console.warn(`  ${katalog}: ${(fehler as Error).message}`)
    }

    if ((index + 1) % 50 === 0) {
      console.log(`  … ${index + 1} von ${gesucht.length}`)
    }
    await new Promise((weiter) => setTimeout(weiter, PAUSE_MS))
  }

  /*
    ------------------------------------------ Zweiter Weg: Twelve Data

    Die SEC deckt nur US-Emittenten ab. Wer hier noch keine Vorhersage hat,
    bekommt eine zweite Chance über einen Anbieter mit Nutzungsbedingungen,
    die den Abruf ausdrücklich vorsehen.

    Abgeleitet wird danach mit **derselben** Funktion wie bei der SEC. Das ist
    der Punkt: Zwei Quellen, aber ein Verfahren – sonst stünden im Kalender
    Termine nebeneinander, die nach verschiedenen Regeln entstanden sind, und
    die Angabe zur Streuung bedeutete für die eine Hälfte etwas anderes als
    für die andere.
  */
  const schluessel = process.env.TWELVEDATA_API_KEY
  const zweiterWeg: string[] = []

  if (!schluessel) {
    console.log(
      '\nKein TWELVEDATA_API_KEY hinterlegt – der zweite Weg bleibt zu.\n' +
        'Ohne ihn bleibt es bei den Unternehmen, die bei der SEC melden.'
    )
  } else {
    const offen = [...gefuehrt].filter((kuerzel) => !unternehmen[kuerzel])
    console.log(`\n${offen.length} Aktien ohne Termin – zweiter Anlauf über Twelve Data.`)

    let kontingentWeg = false
    for (const [index, kuerzel] of offen.entries()) {
      if (kontingentWeg) break

      const quelle = kursquellen.get(kuerzel)
      if (!quelle || !istAbfragbar(quelle.yahoo)) continue

      try {
        const termine = await holeTermine(
          quelle.twelvedata,
          marktcodeAusYahoo(quelle.yahoo),
          schluessel
        )
        if (termine) {
          const abgeleitet = vorhersagen(termine, heute)
          if (abgeleitet.length > 0) {
            unternehmen[kuerzel] = {
              name: kuerzel,
              bisher: termine.slice(0, 8),
              vorhersagen: abgeleitet,
            }
            zweiterWeg.push(kuerzel)
          }
        }
      } catch (fehler) {
        if (fehler instanceof KontingentErschoepft) {
          console.warn(
            `\nKontingent aufgebraucht nach ${index} Abfragen: ${fehler.message}\n` +
              'Der Rest bleibt für den nächsten Lauf liegen – was bis hierher\n' +
              'zusammengekommen ist, wird geschrieben.'
          )
          kontingentWeg = true
        } else {
          throw fehler
        }
      }

      if ((index + 1) % 25 === 0) {
        console.log(`  … ${index + 1} von ${offen.length}`)
      }
      await new Promise((weiter) => setTimeout(weiter, TWELVEDATA_PAUSE_MS))
    }
  }

  const momentaufnahme = {
    abgerufenAm: new Date().toISOString(),
    quelle: {
      label: 'US-Börsenaufsicht SEC – Formular 8-K, Punkt 2.02',
      url: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany',
      abgrenzung:
        'Die Termine sind aus dem bisherigen Meldemuster jedes Unternehmens abgeleitet und keine Ankündigung. Den genauen Tag gibt jedes Unternehmen wenige Wochen vorher selbst bekannt. Erfasst sind nur Unternehmen, die bei der SEC ein 8-K einreichen – überwiegend US-Emittenten.',
    },
    unternehmen,
  }

  await writeFile(ZIEL, `${JSON.stringify(momentaufnahme, null, 2)}\n`, 'utf8')

  const anzahlTermine = Object.values(unternehmen).reduce(
    (summe, e) => summe + e.vorhersagen.length,
    0
  )
  const jeUnternehmen = Object.values(unternehmen).map((e) => e.vorhersagen.length)
  const vollstaendig = jeUnternehmen.filter((n) => n >= VORHERSAGEN).length

  console.log(
    `\n${Object.keys(unternehmen).length} Unternehmen mit erkennbarem Muster, ` +
      `${anzahlTermine} erwartete Termine.`
  )
  console.log(
    `  davon ${vollstaendig} mit allen ${VORHERSAGEN} Quartalen, ` +
      `${jeUnternehmen.length - vollstaendig} mit weniger.`
  )
  console.log(`\n${ohneMuster.length} ohne verwertbares Muster:`)
  console.log(`  ${ohneMuster.join(', ') || '–'}`)
  if (gescheitert.length > 0) {
    console.log(
      `\n${gescheitert.length} beim Abruf gescheitert: ${gescheitert.join(', ')}`
    )
  }
  console.log(
    `\n${nichtRegistriert.length} Kürzel sind bei der SEC nicht registriert – ` +
      `Aktien, die nur an ihrer Heimatbörse notieren.`
  )
  console.log(
    zweiterWeg.length > 0
      ? `Davon über Twelve Data nachgeholt: ${zweiterWeg.length}.`
      : 'Über Twelve Data ist nichts dazugekommen.'
  )

  const ohneTermin = gefuehrt.size - Object.keys(unternehmen).length
  console.log(
    `\nStand: ${Object.keys(unternehmen).length} von ${gefuehrt.size} Aktien mit Terminen, ` +
      `${ohneTermin} ohne.`
  )
  console.log(`\nGeschrieben nach ${ZIEL}.`)
}

main().catch((fehler) => {
  console.error(fehler)
  process.exit(1)
})
