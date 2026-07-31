/**
 * Holt die Kurse und schreibt die Momentaufnahme.
 *
 * Läuft nicht beim Bauen, sondern werktäglich in einem GitHub-Workflow
 * (`.github/workflows/kurse.yml`). Das Ergebnis landet als Datei im Repository;
 * der Build liest nur noch diese Datei und braucht selbst kein Netz.
 *
 * Der Grund für diese Trennung: Ein Build, der von fremden Servern abhängt,
 * fällt aus, sobald einer davon hustet – und bei Hostinger heißt das
 * Bereitstellung rot. Hier bleibt ein Fehlschlag folgenlos: Es wird nichts
 * committet, und die Website zeigt weiter den letzten guten Stand.
 *
 * ## Grundsatz: zusammenführen, nie verwerfen
 *
 * Schlägt ein einzelner Abruf fehl oder ist das Ergebnis unplausibel, behält
 * das Instrument seinen bisherigen Wert. Die Momentaufnahme ist damit immer
 * vollständig, und ein hängender Anbieter macht nicht die halbe Marktseite
 * leer – er lässt nur ein Datum älter werden, und das steht sichtbar dabei.
 *
 * Aufruf: `npm run kurse`
 */

import { marketDefinitions, marketSources } from '../data/markets.ts'
import { vereinigeZahlungen } from '../lib/dividenden.ts'
import { fetchEcbHistoryFull, seriesForCurrency } from '../lib/providers/ecb.ts'
import {
  EMPTY_KURSSTAND,
  EMPTY_SNAPSHOT,
  checkPoints,
  ohneHeute,
  serializeKursstand,
  serializeSnapshot,
  thinPoints,
  type Devisenkurse,
  type Kursstand,
  type MarketSnapshot,
  type SnapshotInstrument,
  type SnapshotPoint,
} from '../lib/providers/snapshot.ts'
import { fuegeEin, serialisiereBreite, type Breitenpunkt } from '../lib/marktbreite.ts'
import { fetchTwelveDataDaily } from '../lib/providers/twelvedata.ts'
import { fetchYahooDaily } from '../lib/providers/yahoo.ts'

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const ZIEL = 'data/snapshots/markets.json'
/*
  Die Dividenden stehen in einer eigenen Datei, nicht im Kursbestand.

  Zwei Gründe. Erstens ändern sie sich selten – ein Titel zahlt vier Mal im
  Jahr, die Kurse ändern sich alle dreißig Minuten. In derselben Datei stünde
  bei jedem Lauf ein Diff über beides, und die eine Änderung, auf die es
  ankommt, wäre nicht zu finden. Zweitens ist der Kursbestand mit zehn
  Megabyte schon groß genug.
*/
const ZIEL_DIVIDENDEN = 'data/snapshots/dividenden.json'
/** Die kleine Datei mit den aktuellen Kursen – siehe `Kursstand`. */
const ZIEL_STAND = 'data/snapshots/kurse-aktuell.json'

/*
  Die Marktbreite je Handelstag.

  Eine dritte Datei und nicht ein Feld im Kursstand: Sie wächst um eine Zeile
  je Handelstag und ändert sich sonst nicht, während der Kursstand alle
  dreißig Minuten neu geschrieben wird. In derselben Datei hinge die
  Aufzeichnung an dessen Takt – und die Historie zeigte zweiundvierzig
  identische Fassungen am Tag.
*/
const ZIEL_BREITE = 'data/snapshots/marktbreite.json'

const QUELLEN = {
  ecb: {
    label: 'Europäische Zentralbank',
    url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
  },
  yahoo: { label: 'Yahoo Finance', url: 'https://finance.yahoo.com/' },
  twelvedata: { label: 'Twelve Data', url: 'https://twelvedata.com/' },
} as const

/**
 * Schlüssel für Twelve Data, falls hinterlegt.
 *
 * Ist er gesetzt, wird er benutzt; sonst bleibt es bei Yahoo. Die Umschaltung
 * ist damit eine Einstellung im Repository und keine Codeänderung.
 */
const TWELVEDATA_KEY = process.env.TWELVEDATA_API_KEY?.trim() || undefined

/**
 * Holt Index- und Rohstoffkurse beim ersten Anbieter, der antwortet.
 *
 * Zuerst Twelve Data, wenn ein Schlüssel vorliegt – die Schnittstelle ist
 * dokumentiert und für diesen Zweck vorgesehen. Ohne Schlüssel Yahoo, das ohne
 * Registrierung auskommt.
 */
async function holeMarktkurs(
  yahooSymbol: string,
  twelveSymbol: string
): Promise<{
  punkte: SnapshotPoint[]
  latest: { value: number; at: string } | null
  /*
    Dividenden kommen nur über Yahoo, und zwar aus derselben Antwort wie die
    Kursreihe. Über Twelve Data gibt es sie an dieser Stelle nicht – dann
    bleibt die Liste leer, und der bisherige Stand im Dividendenbestand
    bleibt unangetastet.
  */
  dividenden: { date: string; amount: number }[]
  quelle: 'yahoo' | 'twelvedata'
} | null> {
  /*
    Im Preis-Modus führt kein Weg über Twelve Data.

    Dessen Zeitreihe enthält keinen laufenden Kurs – das steht zwei Zeilen
    weiter unten und gilt hier doppelt: Ein Lauf, der nur den laufenden Kurs
    will, bekäme von dort nichts und hätte den Abruf umsonst gemacht.
  */
  if (TWELVEDATA_KEY && !NUR_PREIS) {
    const tage = await fetchTwelveDataDaily(twelveSymbol, TWELVEDATA_KEY)
    if (tage) {
      return {
        punkte: tage.map((tag) => ({ d: tag.date, c: tag.close })),
        // Die Zeitreihe von Twelve Data enthält keinen laufenden Kurs; dafür
        // gäbe es eine eigene Abfrage. Solange das der Rückfallweg ist, bleibt
        // es beim Schlusskurs.
        latest: null,
        dividenden: [],
        quelle: 'twelvedata',
      }
    }
    console.warn(`[kurse] ${twelveSymbol}: Twelve Data ohne Ergebnis, versuche Yahoo.`)
  }

  const reihe = await fetchYahooDaily(yahooSymbol, NUR_PREIS ? '1d' : '5y')
  if (!reihe) return null
  return {
    punkte: reihe.days.map((tag) => ({ d: tag.date, c: tag.close })),
    latest: reihe.latest,
    dividenden: reihe.dividends,
    quelle: 'yahoo',
  }
}

/** Der Dividendenbestand: Symbol auf Zahlungsliste. */
interface Dividendenbestand {
  abgerufenAm: string
  quelle: { label: string; url: string }
  titel: Record<string, { date: string; amount: number }[]>
}

function ladeDividenden(): Dividendenbestand {
  try {
    return JSON.parse(readFileSync(ZIEL_DIVIDENDEN, 'utf8')) as Dividendenbestand
  } catch {
    return {
      abgerufenAm: '',
      quelle: {
        label: 'Yahoo Finance: Dividendenereignisse der Kurshistorie',
        url: 'https://finance.yahoo.com/',
      },
      titel: {},
    }
  }
}

function ladeKursstand(): Kursstand {
  try {
    return JSON.parse(readFileSync(ZIEL_STAND, 'utf8')) as Kursstand
  } catch {
    return EMPTY_KURSSTAND
  }
}

function ladeBisherige(): MarketSnapshot {
  try {
    const inhalt = readFileSync(ZIEL, 'utf8')
    const daten = JSON.parse(inhalt) as MarketSnapshot
    if (daten && typeof daten === 'object' && daten.instruments) return daten
  } catch {
    // Erster Lauf oder beschädigte Datei – beides ist kein Grund abzubrechen.
  }
  return EMPTY_SNAPSHOT
}

/** Sammelt die Devisenreihen. Ein Abruf deckt alle Währungen ab. */
async function holeDevisen(): Promise<{
  reihen: Map<string, SnapshotPoint[]>
  tabelle: Devisenkurse | null
}> {
  const reihen = new Map<string, SnapshotPoint[]>()
  const tage = await fetchEcbHistoryFull()
  if (!tage) return { reihen, tabelle: null }

  for (const [symbol, quelle] of Object.entries(marketSources)) {
    if (quelle.provider !== 'ecb') continue
    const reihe = seriesForCurrency(tage, quelle.currency)
    if (reihe.length > 0) {
      reihen.set(
        symbol,
        reihe.map((punkt) => ({ d: punkt.date, c: punkt.value }))
      )
    }
  }

  /*
    Die vollstaendige Tabelle des juengsten Tages mitnehmen.

    Bisher wurden aus dieser Datei fuenf Paare uebernommen und der Rest
    weggeworfen. Gebraucht wird er trotzdem: Wer in einer anderen Waehrung
    bilanziert als er notiert – Shell in Dollar an der Londoner Boerse – bekommt
    ohne Umrechnung keine Kennzahlen. Die Tabelle kostet dreissig Zahlen.
  */
  const juengster = tage.reduce(
    (bester, tag) => (bester && bester.date >= tag.date ? bester : tag),
    null as (typeof tage)[number] | null
  )
  const tabelle = juengster
    ? { stand: juengster.date, jeEuro: { ...juengster.rates } }
    : null

  return { reihen, tabelle }
}

/**
 * Rundet auf die Genauigkeit, die die Website anzeigt.
 *
 * Yahoo liefert Fließkommazahlen in voller Maschinengenauigkeit: Der DAX kam
 * als 24763.119140625 an, Silber als 59.689998626708984. Angezeigt werden davon
 * zwei Stellen. Die übrigen sind kein Informationsgewinn, sondern Rauschen –
 * sie blähen die Datei auf und erzeugen bei jedem Abruf Unterschiede in
 * Stellen, die niemand sieht.
 */
function runde(wert: number, stellen: number): number {
  const faktor = 10 ** stellen
  return Math.round(wert * faktor) / faktor
}

/**
 * Kurze Pause zwischen zwei Abrufen.
 *
 * Mit über hundert Instrumenten und zehn Läufen am Tag kämen sonst weit über
 * tausend Anfragen täglich bei Yahoo an, alle in wenigen Sekunden. Das ist für
 * eine Schnittstelle ohne Registrierung nicht angemessen und der schnellste Weg,
 * gesperrt zu werden. Ein Viertel einer Sekunde je Abruf streckt einen Lauf auf
 * etwa eine halbe Minute – für einen Hintergrundjob ohne Belang.
 */
function warte(ms: number): Promise<void> {
  return new Promise((fertig) => setTimeout(fertig, ms))
}

/**
 * Abstand zwischen zwei **gestarteten** Abrufen in Millisekunden.
 *
 * Bis August 2026 stand hier 250, und die Pause lag seriell vor jedem Abruf:
 * warten, fragen, warten, fragen. Bei 1.053 Instrumenten waren das 250 ms mal
 * 1.053 gleich 4 Minuten 23 reine Wartezeit, plus die Antwortzeiten obendrauf –
 * gemessene 7 Minuten 22 für einen Lauf, von dem 98 Prozent im Abruf steckten.
 *
 * Der Kommentar darüber schätzte „etwa eine halbe Minute“. Das stimmte, als es
 * rund 120 Instrumente waren. Die Zahl ist seither auf das Neunfache gewachsen,
 * die Rechnung hat niemand nachgezogen.
 *
 * Jetzt ist der Abstand ein **Takt** und keine Pause: `imTakt` startet alle
 * 150 ms einen Abruf und lässt bis zu `GLEICHZEITIG` davon nebeneinander
 * laufen. Die Last bei Yahoo hängt an der Startrate, nicht an der Frage, ob
 * die Antworten überlappen – und weil der halbstündliche Lauf seit demselben
 * Umbau `range=1d` statt `range=5y` anfragt, ist jede einzelne Antwort rund
 * vierzigmal kleiner als vorher. In Summe liegt weniger Last bei Yahoo als
 * vorher, nicht mehr.
 */
const ABSTAND_MS = 150

/**
 * Wie viele Abrufe gleichzeitig unterwegs sein dürfen.
 *
 * Sechs, damit die Antwortzeit (rund 170 ms) hinter dem Takt verschwindet:
 * 150 ms Abstand und 170 ms Wartezeit bedeuten, dass zu jedem Zeitpunkt knapp
 * zwei Anfragen offen sind. Sechs ist Luft nach oben für langsame Antworten,
 * ohne dass sich je ein Stau von Dutzenden bildet.
 */
const GLEICHZEITIG = 6

/**
 * Führt `aufgabe` für jeden Eintrag aus – im festen Takt, mit mehreren Arbeitern.
 *
 * Genau ein Start je `abstandMs`, egal wie viele Arbeiter frei sind. Damit ist
 * die Rate nach außen dieselbe wie bei einer seriellen Schleife mit Pause; was
 * wegfällt, ist die Wartezeit auf die Antwort.
 *
 * Die Reihenfolge der **Ergebnisse** ist Sache des Aufrufers: Diese Funktion
 * gibt nichts zurück und garantiert nichts über die Abarbeitungsreihenfolge.
 * Der Aufrufer sammelt in eine Map und geht danach die Symbole in ihrer
 * ursprünglichen Reihenfolge durch – sonst stünden die Schlüssel in
 * `markets.json` nach jedem Lauf anders und der Unterschied im Repository wäre
 * die ganze Datei.
 */
async function imTakt<T>(
  eintraege: readonly T[],
  aufgabe: (eintrag: T) => Promise<void>
): Promise<void> {
  let naechster = 0
  let fruehestens = Date.now()

  async function arbeiter(): Promise<void> {
    for (;;) {
      const index = naechster
      naechster += 1
      if (index >= eintraege.length) return

      const jetzt = Date.now()
      const start = Math.max(jetzt, fruehestens)
      fruehestens = start + ABSTAND_MS
      if (start > jetzt) await warte(start - jetzt)

      await aufgabe(eintraege[index])
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(GLEICHZEITIG, eintraege.length) }, () => arbeiter())
  )
}

/**
 * Ob dieser Lauf nur den laufenden Preis holt.
 *
 * Gesetzt vom halbstündlichen Lauf über `NUR_PREIS=1`. Dann wird `range=1d`
 * angefragt, und geschrieben wird ausschließlich `kurse-aktuell.json`.
 * Historie und Dividenden bleiben unangetastet – sie ändern sich einmal je
 * Handelstag, und dafür gibt es den Lauf nach Börsenschluss.
 *
 * Die Aufteilung gab es bei den **Dateien** längst (`kurse-aktuell.json` neben
 * `markets.json`); nur der **Abruf** kannte sie nicht und lud alle dreißig
 * Minuten fünf Jahre Tageskerzen für tausend Titel, um daraus eine Zahl zu
 * lesen.
 */
const NUR_PREIS = process.env.NUR_PREIS === '1'

/**
 * Auf welche Instrumentenarten sich ein Lauf beschränkt.
 *
 * Leer heißt: alle. Gesetzt wird das vom Wochenendlauf mit `crypto,fx`.
 *
 * ## Warum ein Teilabruf gefahrlos ist
 *
 * Der Lauf beginnt mit `{ ...bisher.instruments }` und überschreibt nur, was
 * er tatsächlich geholt hat. Was er überspringt, behält seinen Stand – es
 * verschwindet nicht und wird nicht auf null gesetzt.
 *
 * ## Warum es diesen Schalter überhaupt gibt
 *
 * Aktien und Indizes werden am Wochenende nicht gehandelt; ein Abruf am
 * Sonntag liefert für sie denselben Freitagsschluss wie am Freitagabend.
 * Kryptowährungen und Devisen laufen dagegen weiter – Bitcoin handelt an 365
 * Tagen, und genau das erklärt diese Website an anderer Stelle. Bis Juli 2026
 * stand am Wochenende trotzdem der Freitagskurs auf der Seite.
 *
 * Alle tausend Titel dafür abzufragen wäre die falsche Antwort: sieben
 * Minuten Laufzeit und über tausend Anfragen bei einer Schnittstelle ohne
 * Registrierung, um fünf Zahlen zu aktualisieren. Mit dem Schalter sind es
 * fünf Anfragen und ein paar Sekunden.
 */
const NUR_ARTEN = (process.env.NUR_ARTEN ?? '')
  .split(',')
  .map((eintrag) => eintrag.trim())
  .filter((eintrag) => eintrag.length > 0)

/**
 * Zeichnet die Marktbreite des Tages auf.
 *
 * ## Warum hier und nicht auf der Seite
 *
 * Weil die Seite beim Bauen entsteht und danach nichts mehr rechnet. Sie kann
 * die Breite von heute zeigen; aufheben kann sie sie nicht. Aufgezeichnet wird
 * deshalb dort, wo ohnehin geschrieben wird – beim Kursabruf.
 *
 * ## Warum die Tagesveränderung hier noch einmal gerechnet wird
 *
 * `lib/market-quote.ts` tut dasselbe für die Anzeige, greift dabei aber auf die
 * zusammengeführten Daten der Service-Schicht zu, die es in diesem Skript nicht
 * gibt. Nachgebaut ist nur die eine Regel, auf die es ankommt: Verglichen wird
 * gegen den letzten Schlusskurs **vor** dem Bezugstag. Ohne diese Bedingung
 * verglich sich der Wert nach Handelsschluss mit sich selbst, und die
 * Veränderung wäre null – derselbe Fehler, der dort schon einmal auftrat.
 */
function zeichneBreiteAuf(instrumente: Record<string, SnapshotInstrument>): void {
  const aktien = marketDefinitions.filter((eintrag) => eintrag.kind === 'stock')

  let steigend = 0
  let fallend = 0
  let unveraendert = 0
  const veraenderungen: number[] = []
  let bezugstag = ''

  for (const definition of aktien) {
    const eintrag = instrumente[definition.symbol]
    if (!eintrag || eintrag.points.length < 2) continue

    const letzter = eintrag.points[eintrag.points.length - 1]
    const wert = eintrag.latest?.value ?? letzter.c
    const tag = eintrag.latest ? eintrag.latest.at.slice(0, 10) : letzter.d
    if (tag > bezugstag) bezugstag = tag

    const vergleich =
      [...eintrag.points].reverse().find((punkt) => punkt.d < tag)?.c ??
      eintrag.points[eintrag.points.length - 2]?.c
    if (!vergleich) continue

    const prozent = ((wert - vergleich) / vergleich) * 100
    veraenderungen.push(prozent)
    if (prozent > 0) steigend += 1
    else if (prozent < 0) fallend += 1
    else unveraendert += 1
  }

  if (veraenderungen.length === 0 || !bezugstag) {
    console.log('[kurse] Keine Tagesveränderungen – Marktbreite nicht aufgezeichnet.')
    return
  }

  const schnitt =
    veraenderungen.reduce((summe, wert) => summe + wert, 0) / veraenderungen.length
  const bewegt = steigend + fallend
  const mitDerRichtung = schnitt >= 0 ? steigend : fallend
  const breite = bewegt > 0 ? (mitDerRichtung / bewegt) * 100 : 0

  /*
    Gerundet, bevor es in den Bestand geht. Angezeigt wird ohnehin auf eine
    Stelle; ungerundet stünde in jeder Zeile ein Dutzend Nachkommastellen, die
    niemand sieht und die jede Zeile im Diff aufblähen.
  */
  const punkt: Breitenpunkt = {
    d: bezugstag,
    steigend,
    fallend,
    unveraendert,
    schnitt: Math.round(schnitt * 100) / 100,
    breite: Math.round(breite * 10) / 10,
  }

  let bestand: { abgerufenAm: string | null; reihe: Breitenpunkt[] }
  try {
    bestand = JSON.parse(readFileSync(ZIEL_BREITE, 'utf8'))
  } catch {
    bestand = { abgerufenAm: null, reihe: [] }
  }

  const reihe = fuegeEin(bestand.reihe, punkt)
  mkdirSync(dirname(ZIEL_BREITE), { recursive: true })
  writeFileSync(
    ZIEL_BREITE,
    serialisiereBreite({ abgerufenAm: new Date().toISOString(), reihe })
  )
  console.log(
    `[kurse] Marktbreite ${bezugstag}: ${steigend} im Plus, ${fallend} im Minus, ` +
      `Breite ${punkt.breite} % – ${reihe.length} Handelstage im Bestand.`
  )
}

async function main(): Promise<void> {
  const bisher = ladeBisherige()
  const instrumente: Record<string, SnapshotInstrument> = { ...bisher.instruments }

  const bekannt = new Set(marketDefinitions.map((definition) => definition.symbol))
  const uebernommen: string[] = []
  const behalten: string[] = []

  const dividenden = ladeDividenden()
  const { reihen: devisen, tabelle: devisentabelle } = await holeDevisen()

  if (NUR_ARTEN.length > 0) {
    console.log(
      `[kurse] Beschränkt auf: ${NUR_ARTEN.join(', ')} – alles andere behält seinen Stand.`
    )
  }

  let uebersprungen = 0

  /** Gehört dieses Symbol in diesen Lauf? */
  const gemeint = (symbol: string): boolean => {
    if (!bekannt.has(symbol)) return false
    if (NUR_ARTEN.length === 0) return true
    const art = marketDefinitions.find((eintrag) => eintrag.symbol === symbol)?.kind
    return Boolean(art && NUR_ARTEN.includes(art))
  }

  /*
    Die Abrufe laufen vorweg und im Takt – die Auswertung danach der Reihe nach.

    Die Trennung ist nicht bloß Umbau: Solange die Schleife selbst abrief, war
    Reihenfolge gleich Reihenfolge. Mit sechs Arbeitern kommen die Antworten
    durcheinander zurück, und wer in dieser Reihenfolge in `instrumente`
    schriebe, bekäme bei jedem neuen Titel eine andere Schlüsselreihenfolge in
    `markets.json` – neunzehn Megabyte Unterschied für nichts.

    Also: erst sammeln, dann in der Reihenfolge von `marketSources` auswerten.
  */
  const zuHolen = Object.entries(marketSources)
    .filter(([symbol, quelle]) => quelle.provider !== 'ecb' && gemeint(symbol))
    .map(([symbol, quelle]) => ({ symbol, quelle }))

  const abrufe = new Map<string, Awaited<ReturnType<typeof holeMarktkurs>>>()
  const begonnen = Date.now()
  await imTakt(zuHolen, async ({ symbol, quelle }) => {
    if (quelle.provider === 'ecb') return
    abrufe.set(symbol, await holeMarktkurs(quelle.yahoo, quelle.twelvedata))
  })
  console.log(
    `[kurse] ${zuHolen.length} Abrufe in ${Math.round((Date.now() - begonnen) / 1000)} s` +
      `${NUR_PREIS ? ' (nur laufender Preis, range=1d)' : ''}.`
  )

  for (const [symbol, quelle] of Object.entries(marketSources)) {
    if (!bekannt.has(symbol)) {
      console.warn(`[kurse] ${symbol} steht in marketSources, aber in keiner Definition.`)
      continue
    }

    if (!gemeint(symbol)) {
      uebersprungen += 1
      continue
    }

    /*
      Devisen im Preis-Modus: nichts zu tun.

      Die EZB veröffentlicht einen Referenzkurs je Tag, keinen laufenden. Ein
      halbstündlicher Lauf hätte für sie nichts Neues und würde sie sonst als
      „kein laufender Kurs“ ins Protokoll schreiben – fünf Zeilen Rauschen,
      achtundvierzig Mal am Tag.
    */
    if (NUR_PREIS && quelle.provider === 'ecb') continue

    let roh: SnapshotPoint[] | null
    let latest: { value: number; at: string } | null = null
    let quellenId: keyof typeof QUELLEN

    if (quelle.provider === 'ecb') {
      roh = devisen.get(symbol) ?? null
      quellenId = 'ecb'
    } else {
      const ergebnis = abrufe.get(symbol) ?? null
      roh = ergebnis?.punkte ?? null
      latest = ergebnis?.latest ?? null
      quellenId = ergebnis?.quelle ?? 'yahoo'
      /*
        Nur überschreiben, wenn die Antwort Zahlungen enthielt. Eine leere
        Liste heißt „dieser Titel zahlt keine Dividende“ – oder „die Antwort
        kam von Twelve Data“. Beides ist von hier aus nicht unterscheidbar,
        also bleibt bei leerer Liste der bisherige Stand stehen. Andernfalls
        verlöre ein Titel seine Zahlungshistorie, sobald ein einzelner Abruf
        über den Rückfallweg lief.
      */
      if (ergebnis?.dividenden && ergebnis.dividenden.length > 0) {
        /*
          Zusammenführen, nicht ersetzen – siehe `vereinigeZahlungen`. Kurz:
          Yahoo rechnet Auslandsdividenden zum Kurs des Abrufzeitpunkts um, und
          dieselbe zwei Jahre alte Zahlung kommt deshalb bei jedem Lauf mit
          einer anderen siebten Nachkommastelle zurück.
        */
        dividenden.titel[symbol] = vereinigeZahlungen(
          dividenden.titel[symbol] ?? [],
          ergebnis.dividenden
        )
      }
    }

    if (!roh) {
      behalten.push(`${symbol} (Abruf fehlgeschlagen)`)
      continue
    }

    /*
      Im Preis-Modus endet die Auswertung hier.

      `range=1d` liefert genau eine Kerze – die von heute. `ohneHeute()` würde
      sie entfernen und eine leere Reihe hinterlassen; alles Weitere rechnet
      mit `punkte[punkte.length - 1]` und liefe ins Leere. Die Historie ist in
      diesem Lauf ohnehin nicht gemeint: Sie steht schon da, und der laufende
      Kurs wird gegen ihren letzten Schlusskurs geprüft – gegen dieselbe
      35-Prozent-Grenze wie im vollen Lauf.

      Geschrieben wird nur `latest`. Weil `historieOhneKurse()` genau dieses
      Feld beim Vergleich wegwirft, bleibt `markets.json` unberührt, ohne dass
      es hier eine zweite Fallunterscheidung braucht.
    */
    if (NUR_PREIS) {
      const vorhanden = instrumente[symbol]
      if (!vorhanden || vorhanden.points.length === 0) {
        behalten.push(`${symbol} (noch keine Historie)`)
        continue
      }
      const nachkommastellen =
        marketDefinitions.find((definition) => definition.symbol === symbol)?.decimals ??
        4
      const schluss = vorhanden.points[vorhanden.points.length - 1].c
      if (!latest || Math.abs(latest.value - schluss) / schluss > 0.35) {
        if (latest) {
          console.warn(
            `[kurse] ${symbol}: laufender Kurs ${latest.value} weicht zu stark vom Schluss ${schluss} ab – verworfen.`
          )
        }
        behalten.push(`${symbol} (kein brauchbarer laufender Kurs)`)
        continue
      }
      instrumente[symbol] = {
        ...vorhanden,
        latest: { value: runde(latest.value, nachkommastellen), at: latest.at },
      }
      uebernommen.push(symbol)
      continue
    }

    const stellen =
      marketDefinitions.find((definition) => definition.symbol === symbol)?.decimals ?? 4
    const punkte = thinPoints(ohneHeute(roh)).map((punkt) => ({
      d: punkt.d,
      c: runde(punkt.c, stellen),
    }))
    const probleme = checkPoints(punkte, instrumente[symbol]?.points)
    if (probleme.length > 0) {
      for (const problem of probleme) console.warn(`[kurse] ${symbol}: ${problem}`)
      behalten.push(`${symbol} (unplausibel)`)
      continue
    }

    /*
      Den laufenden Kurs derselben Prüfung unterwerfen wie die Reihe.

      Er kommt aus einem anderen Feld der Antwort und könnte theoretisch in
      einer anderen Einheit stehen. Weicht er um mehr als 35 Prozent vom letzten
      Schlusskurs ab, wird er verworfen – dann zeigt die Kachel den Schluss, was
      allemal besser ist als eine falsche Zahl.
    */
    const letzterSchluss = punkte[punkte.length - 1].c
    const geprueft =
      latest && Math.abs(latest.value - letzterSchluss) / letzterSchluss <= 0.35
        ? { value: runde(latest.value, stellen), at: latest.at }
        : null
    if (latest && !geprueft) {
      console.warn(
        `[kurse] ${symbol}: laufender Kurs ${latest.value} weicht zu stark vom Schluss ${letzterSchluss} ab – verworfen.`
      )
    }

    instrumente[symbol] = {
      sourceLabel: QUELLEN[quellenId].label,
      sourceUrl: QUELLEN[quellenId].url,
      asOf: punkte[punkte.length - 1].d,
      ...(geprueft ? { latest: geprueft } : {}),
      points: punkte,
    }
    uebernommen.push(symbol)
  }

  /*
    Unterschiedlich alte Stände sichtbar machen.

    Beim ersten erfolgreichen Lauf standen die Indizes auf dem 23. Juli, die
    Wechselkurse auf dem 24. und die Edelmetalle auf dem 27. – ohne dass etwas
    fehlgeschlagen wäre. Ein Anbieter kann einen Handelstag später nachliefern
    oder eine Lücke haben; solange das unbemerkt bleibt, steht auf der Website
    eine ältere Zahl, als es müsste.

    Verglichen wird gegen den jüngsten Stand aller Instrumente. Vier Tage
    Abstand decken ein Wochenende samt Feiertag ab, ohne jeden Montag zu warnen.
  */
  const staende = Object.values(instrumente).map((eintrag) => eintrag.asOf)
  const juengster = staende.sort().at(-1)
  if (juengster) {
    const grenze = Date.parse(`${juengster}T00:00:00Z`) - 4 * 86_400_000
    const hinterher = Object.entries(instrumente)
      .filter(([, eintrag]) => Date.parse(`${eintrag.asOf}T00:00:00Z`) < grenze)
      .map(([symbol, eintrag]) => `${symbol} (${eintrag.asOf})`)

    if (hinterher.length > 0) {
      console.log(
        `::warning title=Ältere Stände als ${juengster}::${hinterher.join(', ')}`
      )
    }
  }

  /*
    Die Bilanz der Beschränkung gehört unmittelbar hinter die Schleife, nicht
    ans Ende des Laufs: Bei einem erfolglosen Abruf kehrt die Funktion vorher
    zurück, und dann fehlte im Protokoll gerade die Zeile, die erklärt, warum
    so wenige Titel angefragt wurden.
  */
  if (uebersprungen > 0) {
    console.log(
      `[kurse] ${uebersprungen} Instrumente übersprungen (Beschränkung auf ${NUR_ARTEN.join(', ')}).`
    )
  }

  if (uebernommen.length === 0) {
    console.error('[kurse] Kein einziger Abruf war erfolgreich – Datei bleibt unberührt.')
    process.exitCode = 1
    return
  }

  console.log(
    `[kurse] ${uebernommen.length} Instrumente aktualisiert: ${uebernommen.join(', ')}`
  )
  if (behalten.length > 0) {
    console.log(`[kurse] Bisheriger Stand behalten für: ${behalten.join(', ')}`)
  }

  /*
    Teilausfälle sichtbar machen.

    Der erste Lauf endete grün, obwohl sechs von elf Instrumenten nichts
    bekamen – „zusammenführen statt verwerfen“ funktionierte wie vorgesehen, nur
    stand das Ergebnis ausschließlich mitten im Protokoll. Wer nur auf das grüne
    Häkchen schaut, hält den Lauf für vollständig.

    Eine Warnung erscheint dagegen oben auf der Übersicht des Laufs. Der Lauf
    bleibt trotzdem erfolgreich: Ein Teilausfall ist ausdrücklich vorgesehen und
    soll die Bereitstellung der übrigen Kurse nicht verhindern.
  */
  if (behalten.length > 0) {
    console.log(
      `::warning title=${behalten.length} von ${behalten.length + uebernommen.length} Instrumenten ohne neue Kurse::` +
        `${behalten.join(', ')} – diese Instrumente behalten ihren bisherigen Stand.`
    )
  }

  /*
    Nichts schreiben, wenn sich kein Kurs geändert hat.

    `fetchedAt` ändert sich bei jedem Lauf. Ohne diesen Vergleich entstünde
    deshalb auch dann ein Commit, wenn die Kurse identisch sind – und weil ein
    Push nach `main` die Bereitstellung bei Hostinger auslöst, würde die ganze
    Website neu gebaut, um einen Zeitstempel zu ändern, den niemand sieht.

    Genau das ist am ersten Tag dreimal passiert: drei Commits „Kurse: Stand
    2026-07-27“ hintereinander, drei Bereitstellungen, kein einziger neuer Kurs.
  */
  const tabelle = devisentabelle ?? bisher.devisen
  /*
    Zwei Dateien, zwei Vergleiche – und das ist der Kern dieses Umbaus.

    Die Tagesreihen wachsen einmal je Börsentag um einen Punkt, der zuletzt
    gehandelte Preis ändert sich alle dreißig Minuten. Solange beides in einer
    Datei stand, wurde bei jedem Lauf eine Datei von neunzehn Megabyte
    vollständig neu geschrieben – zweiundvierzig Mal am Tag. Fünfzehn
    gespeicherte Fassungen wogen zusammen 179 Megabyte.

    Jetzt entscheidet jede Datei für sich, ob sie sich geändert hat. Der
    Kursstand wird fast immer geschrieben und ist ein paar hundert Kilobyte
    groß; die Historie nur dann, wenn tatsächlich ein Schlusskurs hinzugekommen
    ist – in der Regel einmal je Handelstag.
  */
  const historieOhneKurse = (
    quelle: Record<string, SnapshotInstrument>
  ): Record<string, SnapshotInstrument> =>
    Object.fromEntries(
      Object.entries(quelle).map(([symbol, eintrag]) => [
        symbol,
        {
          sourceLabel: eintrag.sourceLabel,
          sourceUrl: eintrag.sourceUrl,
          asOf: eintrag.asOf,
          points: eintrag.points,
        },
      ])
    )

  const historieVorher = serializeSnapshot({
    fetchedAt: null,
    instruments: historieOhneKurse(bisher.instruments),
  })
  const historieNachher = serializeSnapshot({
    fetchedAt: null,
    instruments: historieOhneKurse(instrumente),
  })
  const historieGleich = historieVorher === historieNachher

  /*
    Der bisherige Kursstand ist die Rückfallebene für alles, was dieser Lauf
    nicht geholt hat – und das ist keine Feinheit, sondern der Unterschied
    zwischen einer vollständigen und einer fast leeren Datei.

    Der Wochenendlauf fragt nur `crypto,fx` ab. Bei den übrigen Instrumenten
    steht der laufende Kurs deshalb nicht in `instrumente`: Die Historie führt
    ihn seit dieser Trennung nicht mehr mit, und `{ ...bisher.instruments }`
    kann folglich nichts mitbringen. Ohne diese Rückfallebene hätte der Sonntag
    fünf aktuelle Kurse geschrieben und tausend gelöscht.

    Geschrieben wird aber nur, was noch im Katalog steht: `instrumente` gibt die
    Schlüssel vor, damit ein aufgegebener Titel nicht ewig weitergereicht wird.
  */
  const standVorher = ladeKursstand()
  const standNeu: Kursstand = {
    fetchedAt: new Date().toISOString(),
    latest: Object.fromEntries(
      Object.entries(instrumente).flatMap(([symbol, eintrag]) => {
        const wert = eintrag.latest ?? standVorher.latest[symbol]
        return wert ? [[symbol, wert] as const] : []
      })
    ),
    devisen: tabelle,
  }
  const standGleich =
    serializeKursstand({ ...standVorher, fetchedAt: null }) ===
    serializeKursstand({ ...standNeu, fetchedAt: null })

  if (historieGleich && standGleich) {
    console.log('[kurse] Keine Kursänderung – beide Dateien bleiben unberührt.')
    return
  }

  if (historieGleich) {
    console.log('[kurse] Keine neue Tagesreihe – die Historie bleibt unberührt.')
  } else {
    mkdirSync(dirname(ZIEL), { recursive: true })
    writeFileSync(
      ZIEL,
      serializeSnapshot({
        fetchedAt: new Date().toISOString(),
        instruments: historieOhneKurse(instrumente),
      })
    )
    console.log(`[kurse] Historie erneuert: ${ZIEL}`)
  }

  if (standGleich) {
    console.log('[kurse] Unveränderte Kurse – der Kursstand bleibt unberührt.')
  } else {
    mkdirSync(dirname(ZIEL_STAND), { recursive: true })
    writeFileSync(ZIEL_STAND, serializeKursstand(standNeu))
    console.log(
      `[kurse] ${Object.keys(standNeu.latest).length} aktuelle Kurse in ${ZIEL_STAND}`
    )
  }

  const punkteGesamt = Object.values(instrumente).reduce(
    (summe, eintrag) => summe + eintrag.points.length,
    0
  )

  /*
    Der Dividendenbestand wird nur geschrieben, wenn sich etwas geändert hat –
    sonst stünde bei jedem der zweiundvierzig Läufe am Tag ein Commit mit
    neuem Zeitstempel und identischem Inhalt in der Historie.
  */
  // Beim ersten Lauf gibt es die Datei noch nicht – dann ist jeder Inhalt neu.
  let dividendenVorher = ''
  try {
    dividendenVorher = readFileSync(ZIEL_DIVIDENDEN, 'utf8').replace(
      /"abgerufenAm": "[^"]*"/,
      '"abgerufenAm": ""'
    )
  } catch {
    dividendenVorher = ''
  }
  const dividendenNachher = JSON.stringify({ ...dividenden, abgerufenAm: '' }, null, 2)
  if (dividendenVorher.trim() !== dividendenNachher.trim()) {
    writeFileSync(
      ZIEL_DIVIDENDEN,
      `${JSON.stringify({ ...dividenden, abgerufenAm: new Date().toISOString() }, null, 2)}\n`
    )
    const zahlungen = Object.values(dividenden.titel).reduce((s, l) => s + l.length, 0)
    console.log(
      `[kurse] ${zahlungen} Dividendenzahlungen für ${Object.keys(dividenden.titel).length} Titel in ${ZIEL_DIVIDENDEN}`
    )
  } else {
    console.log('[kurse] Keine neuen Dividenden – Datei bleibt unberührt.')
  }

  zeichneBreiteAuf(instrumente)

  console.log(`[kurse] ${punkteGesamt} Kurswerte in ${ZIEL}`)
  for (const [symbol, eintrag] of Object.entries(instrumente)) {
    const letzte = eintrag.points.slice(-3).map((punkt) => `${punkt.d}=${punkt.c}`)
    const jetzt = eintrag.latest
      ? `  | jetzt ${eintrag.latest.value} (${eintrag.latest.at})`
      : ''
    console.log(`[kurse]   ${symbol.padEnd(15)} ${letzte.join('  ')}${jetzt}`)
  }
}

await main()
