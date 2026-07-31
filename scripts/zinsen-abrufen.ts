/**
 * Holt Leitzins und Inflation bei der Europäischen Zentralbank.
 *
 * ## Warum diese Quelle
 *
 * Weil sie die zuständige ist. Der Leitzins des Euroraums wird von der EZB
 * gesetzt, der harmonisierte Verbraucherpreisindex von Eurostat erhoben und
 * über dieselbe Schnittstelle ausgeliefert. Beides ohne Schlüssel, ohne
 * Registrierung, mit Quellenangabe frei verwendbar – dieselbe Grundlage, auf
 * der die Wechselkurse dieser Website seit jeher stehen.
 *
 * ## Warum das überhaupt nötig war
 *
 * Weil die Aktienkurse alle dreißig Minuten frisch kamen und die Zinsen als
 * Zahl im Quelltext standen. Auf einer Website, die Zinsen, Inflation und
 * Vorsorge erklärt, ist das die auffälligste Asymmetrie im Datenteil: Die
 * beiden Größen, um die es in der Hälfte des Lernbereichs geht, waren
 * Konstanten.
 *
 * ## Was hier bewusst nicht passiert
 *
 * Die Lernbeispiele werden **nicht** angefasst. Die 2,5 Prozent in
 * `lib/inflations-beispiele.ts` sind eine gerundete Annahme über dreißig Jahre
 * und dort so begründet; eine aktuelle Monatsrate wäre einen Monat lang
 * richtig. Was hier ankommt, steht neben solchen Rechnungen als Tatsache –
 * es ersetzt sie nicht.
 *
 * ## Warum ohne diese Datei nichts kaputtgeht
 *
 * Der Bestand hat einen leeren Ausgangszustand. Schlägt der Abruf fehl, bleibt
 * er stehen, und die Seiten zeigen ihre Angaben ohne den aktuellen Wert. Eine
 * fehlende Zahl ist ein Zustand, kein Fehler – wie überall in diesem Projekt.
 *
 * Aufruf: `npm run zinsen`
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import {
  juengster,
  leseSdmx,
  vorEinemJahr,
  type Zeitreihenpunkt,
} from '../lib/providers/sdmx.ts'

const ZIEL = 'data/snapshots/zinsen.json'

/**
 * Die Adressen der Statistikschnittstelle, in der Reihenfolge des Versuchs.
 *
 * Die EZB hat ihr Datenportal von `sdw-wsrest` auf `data-api` umgestellt; die
 * alte Adresse antwortet noch, aber nicht ewig. Beide zu versuchen kostet im
 * Regelfall nichts und überlebt die Abschaltung der einen.
 */
const HOSTS = [
  'https://data-api.ecb.europa.eu/service/data',
  'https://sdw-wsrest.ecb.europa.eu/service/data',
]

interface Abfrage {
  id: string
  bezeichnung: string
  /** Datensatz und Schlüssel, wie die EZB sie führt. */
  pfad: string
  einheit: 'prozent'
  quelle: { label: string; url: string }
  abgrenzung: string
  /**
   * Wie viele Beobachtungen geholt werden – nicht, wie viele bleiben.
   *
   * Bei Monatsreihen sind sechzig Punkte fünf Jahre; der Wert von vor einem
   * Jahr liegt darin. Bei der **täglichen** Leitzinsreihe sind sechzig Punkte
   * zwei Monate, und `vorEinemJahr` blieb deshalb leer – auf der Seite fehlte
   * dann genau die Angabe, die aus einer Zahl eine Richtung macht.
   *
   * Also breit holen, schmal ablegen: `verlauf` behält in jedem Fall nur die
   * letzten `VERLAUFSPUNKTE`.
   */
  punkte?: number
}

/**
 * Was geholt wird.
 *
 * Drei Reihen, nicht dreißig. Was hier steht, muss auf einer Seite erklärt
 * werden können – eine Sammlung von Zeitreihen ohne Verwendung wäre Ballast,
 * der bei jedem Lauf mitgeschleppt wird.
 *
 * ## `HICP` und nicht mehr `ICP`
 *
 * Eurostat hat die Berechnung des harmonisierten Verbraucherpreisindex zum
 * **4. Februar 2026** methodisch umgestellt. Die EZB hat denselben Tag genutzt,
 * um den Datensatz `ICP` einzustellen und durch `HICP` zu ersetzen.
 *
 * Eingestellt heißt hier nicht abgeschaltet: `ICP` antwortet weiter mit
 * Statuscode 200 und liefert Werte – nur endet die Reihe im Dezember 2025. Ein
 * Abruf, der nach dem jüngsten Wert fragt, bekommt also eine gültige Antwort
 * mit einer sieben Monate alten Zahl und meldet keinen Fehler. Aufgefallen ist
 * es erst, weil die Momentaufnahme „Stand Dezember 2025“ neben einem
 * Julidatum stehen hatte.
 *
 * Der Schlüssel ist fast derselbe. Die fünfte Dimension heißt jetzt
 * `DATA_PROVIDER` statt `STS_INSTITUTION`, und Eurostat trägt darin `4D0`
 * statt `4`:
 *
 *     alt:  ICP/M.U2.N.000000.4.ANR      → endet 2025-12
 *     neu:  HICP/M.U2.N.000000.4D0.ANR   → laufend
 *
 * Wer die Reihen erweitert, prüft den Datensatznamen mit
 * `.github/workflows/quellen-holen.yml` gegen die Schnittstelle, statt ihn aus
 * einer älteren Datei zu übernehmen.
 */
const ABFRAGEN: Abfrage[] = [
  {
    id: 'leitzins',
    bezeichnung: 'Leitzins der EZB (Hauptrefinanzierungsgeschäfte)',
    pfad: 'FM/D.U2.EUR.4F.KR.MRR_FR.LEV',
    einheit: 'prozent',
    quelle: {
      label: 'Europäische Zentralbank, Leitzinssätze',
      url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html',
    },
    abgrenzung:
      'Der Zinssatz für Hauptrefinanzierungsgeschäfte – der Satz, zu dem sich Banken ' +
      'Geld bei der Zentralbank leihen. Nicht der Zins, den eine Bank ihren Kunden zahlt ' +
      'oder berechnet; der liegt darüber beziehungsweise darunter.',
    // Tagesreihe: gut dreizehn Monate, damit der Vorjahreswert enthalten ist.
    punkte: 400,
  },
  {
    id: 'inflation',
    bezeichnung: 'Inflationsrate im Euroraum (HVPI, Vorjahresvergleich)',
    pfad: 'HICP/M.U2.N.000000.4D0.ANR',
    einheit: 'prozent',
    quelle: {
      label:
        'Eurostat über die Europäische Zentralbank, harmonisierter Verbraucherpreisindex',
      url: 'https://www.ecb.europa.eu/stats/macroeconomic_and_sectoral/hicp/html/index.en.html',
    },
    abgrenzung:
      'Die Veränderung des harmonisierten Verbraucherpreisindex gegenüber demselben Monat ' +
      'des Vorjahres, für den gesamten Euroraum. Für Deutschland allein weicht der Wert ab, ' +
      'und der persönliche Warenkorb weicht von beiden ab.',
  },
  {
    id: 'inflation-de',
    bezeichnung: 'Inflationsrate in Deutschland (HVPI, Vorjahresvergleich)',
    pfad: 'HICP/M.DE.N.000000.4D0.ANR',
    einheit: 'prozent',
    quelle: {
      label:
        'Eurostat über die Europäische Zentralbank, harmonisierter Verbraucherpreisindex',
      url: 'https://www.ecb.europa.eu/stats/macroeconomic_and_sectoral/hicp/html/index.en.html',
    },
    abgrenzung:
      'Dieselbe Rechnung wie für den Euroraum, aber nur für Deutschland. Der harmonisierte ' +
      'Index ist nicht deckungsgleich mit dem Verbraucherpreisindex des Statistischen ' +
      'Bundesamtes – die Warenkörbe unterscheiden sich.',
  },
]

interface Reihe {
  bezeichnung: string
  einheit: string
  aktuell: { t: string; wert: number } | null
  vorEinemJahr: { t: string; wert: number } | null
  /** Die letzten Punkte, für einen kleinen Verlauf. */
  verlauf: Zeitreihenpunkt[]
  quelle: { label: string; url: string }
  abgrenzung: string
}

interface Momentaufnahme {
  abgerufenAm: string | null
  reihen: Record<string, Reihe>
}

/** Wie viele Punkte je Reihe aufbewahrt werden. */
const VERLAUFSPUNKTE = 60

async function hole(pfad: string, punkte: number): Promise<unknown | null> {
  for (const host of HOSTS) {
    const adresse = `${host}/${pfad}?lastNObservations=${punkte}&format=jsondata`
    try {
      const antwort = await fetch(adresse, {
        headers: {
          Accept: 'application/vnd.sdmx.data+json;version=1.0.0-wd, application/json',
          'User-Agent': 'IM-Invests Datenabruf',
        },
      })
      if (!antwort.ok) {
        console.log(`[zinsen] ${host}: Status ${antwort.status}`)
        continue
      }
      console.log(`[zinsen] ${host}: geht`)
      return await antwort.json()
    } catch (fehler) {
      console.log(
        `[zinsen] ${host}: nicht erreichbar (${fehler instanceof Error ? fehler.message : 'unbekannt'})`
      )
    }
  }
  return null
}

async function main(): Promise<void> {
  let bestand: Momentaufnahme
  try {
    bestand = JSON.parse(readFileSync(ZIEL, 'utf8'))
  } catch {
    bestand = { abgerufenAm: null, reihen: {} }
  }

  const reihen: Record<string, Reihe> = { ...bestand.reihen }
  let geholt = 0

  for (const abfrage of ABFRAGEN) {
    const roh = await hole(abfrage.pfad, abfrage.punkte ?? VERLAUFSPUNKTE)
    if (!roh) {
      console.error(
        `[zinsen] ${abfrage.id}: keine Antwort – bisheriger Wert bleibt stehen.`
      )
      continue
    }

    const { punkte, mehrereReihen } = leseSdmx(roh)
    if (mehrereReihen) {
      console.error(
        `[zinsen] ${abfrage.id}: die Antwort enthält mehrere Reihen – der Schlüssel ist zu unscharf. Übersprungen.`
      )
      continue
    }
    if (punkte.length === 0) {
      console.error(`[zinsen] ${abfrage.id}: keine Werte in der Antwort. Übersprungen.`)
      continue
    }

    const letzter = juengster(punkte)
    reihen[abfrage.id] = {
      bezeichnung: abfrage.bezeichnung,
      einheit: abfrage.einheit,
      aktuell: letzter,
      vorEinemJahr: vorEinemJahr(punkte),
      verlauf: punkte.slice(-VERLAUFSPUNKTE),
      quelle: abfrage.quelle,
      abgrenzung: abfrage.abgrenzung,
    }
    geholt += 1
    console.log(
      `[zinsen] ${abfrage.id}: ${letzter?.wert} % zum ${letzter?.t} (${punkte.length} Punkte)`
    )

    // Zurückhaltend abfragen; die Schnittstelle ist kostenlos und unbeaufsichtigt.
    await new Promise((weiter) => setTimeout(weiter, 500))
  }

  if (geholt === 0) {
    console.error('[zinsen] Nichts geholt – Datei bleibt unberührt.')
    process.exitCode = 1
    return
  }

  const ergebnis: Momentaufnahme = { abgerufenAm: new Date().toISOString(), reihen }
  writeFileSync(ZIEL, `${JSON.stringify(ergebnis, null, 2)}\n`)
  console.log(`[zinsen] ${geholt} von ${ABFRAGEN.length} Reihen in ${ZIEL}.`)
}

/*
  Nur ausführen, wenn dieses Skript direkt aufgerufen wurde – aus demselben
  Grund wie bei den übrigen Abrufskripten: Ein Test, der die Datei importiert,
  soll keine Netzanfrage auslösen und keinen Bestand überschreiben.
*/
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
