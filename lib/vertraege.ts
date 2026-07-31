/**
 * Was jede fremde Schnittstelle liefern muss, damit diese Website stimmt.
 *
 * ## Warum es das gibt
 *
 * Weil eine Quelle aufhören kann zu antworten, ohne aufzuhören zu antworten.
 *
 * Die EZB hat den Datensatz `ICP` zum 4. Februar 2026 eingestellt und durch
 * `HICP` ersetzt. Eingestellt heißt hier: Er blieb erreichbar, lieferte weiter
 * Statuscode 200, weiter gültiges JSON, weiter Zahlen – nur endete die Reihe
 * im Dezember 2025. Fünf Monate lang hat unser Abruf brav gefragt und brav
 * eine tote Reihe bekommen, und auf der Website stand eine halbjährig alte
 * Inflationsrate neben dem Wort „aktuell“.
 *
 * `npm run frische` fängt das inzwischen – aber erst, **nachdem** die tote Zahl
 * im Bestand steht. Diese Prüfung fragt früher: Hält die Quelle noch, was der
 * Abruf von ihr erwartet? Sie schreibt nichts, sie ändert nichts, sie stellt
 * nur je Schnittstelle die eine Frage, an der der Abruf hängt.
 *
 * ## Warum sie nicht im Bau läuft
 *
 * Weil sie das Netz braucht und fremde Server befragt. Ein Bau, der rot wird,
 * weil die Weltbank gerade wartet, wäre ein Bau, dem niemand mehr glaubt. Sie
 * läuft wöchentlich als eigener Workflow und meldet sich, wenn etwas kippt.
 *
 * ## Schlüssel
 *
 * Manche Quellen brauchen einen. Der steht in den Actions-Secrets und **kommt
 * nie ins Protokoll** – weder als Wert noch als Teil einer Adresse. Deshalb
 * trägt jeder Vertrag eine schlüsselfreie `adresse` zum Anzeigen und baut die
 * echte Adresse erst im Aufruf.
 */

import { alterInTagen } from './reihen-alter.ts'

export interface Vertrag {
  name: string
  /** Wofür die Website diese Quelle braucht. Steht in der Meldung. */
  zweck: string
  /**
   * Die Adresse, wie sie im Protokoll erscheinen darf – ohne Schlüssel.
   *
   * Wird auch als tatsächliche Adresse genommen, wenn `mitSchluessel` fehlt.
   */
  adresse: string
  /** Name der Umgebungsvariablen, falls die Quelle einen Schlüssel verlangt. */
  schluessel?: string
  /** Baut die echte Adresse. Ihr Ergebnis wird nie ausgegeben. */
  mitSchluessel?: (wert: string) => string
  /** Zusätzliche Kopfzeilen, etwa der von der SEC verlangte Absender. */
  kopf?: Record<string, string>
  /**
   * Prüft die Antwort auf das, was der Abruf von ihr erwartet.
   *
   * Gibt `null` zurück, wenn der Vertrag hält, sonst den Mangel im Klartext.
   * Bekommt zusätzlich `jetzt`, damit die Prüfung testbar bleibt.
   */
  pruefe: (text: string, jetzt: Date) => string | null
}

/**
 * Liest die jüngste Beobachtung aus einer SDMX-Antwort im CSV-Format.
 *
 * Die Spalten heißen `TIME_PERIOD` und `OBS_VALUE`; die Zeilen kommen
 * aufsteigend. Bewusst kein vollständiger CSV-Zerleger: Gebraucht wird die
 * letzte nichtleere Zeile und daraus zwei Felder, und ein Zerleger, der
 * Anführungszeichen und eingebettete Kommata beherrscht, wäre hier mehr Code
 * als Prüfung.
 */
export function letzteSdmxBeobachtung(
  csv: string
): { zeitraum: string; wert: string } | null {
  const zeilen = csv.trim().split('\n')
  if (zeilen.length < 2) return null
  const kopf = zeilen[0].split(',')
  const zeit = kopf.indexOf('TIME_PERIOD')
  const wert = kopf.indexOf('OBS_VALUE')
  if (zeit < 0 || wert < 0) return null
  const letzte = zeilen[zeilen.length - 1].split(',')
  if (letzte.length <= Math.max(zeit, wert)) return null
  return { zeitraum: letzte[zeit], wert: letzte[wert] }
}

/**
 * Baut eine Prüfung auf eine EZB-Reihe.
 *
 * Verlangt wird beides: dass die Reihe überhaupt Werte hat **und** dass der
 * jüngste nicht älter ist als erlaubt. Das erste allein hätte den ICP-Fall
 * nicht gefunden – dort waren Werte da, nur alte.
 */
function ezbReihe(hoechstalterTage: number) {
  return (text: string, jetzt: Date): string | null => {
    const letzte = letzteSdmxBeobachtung(text)
    if (letzte === null) {
      return 'Keine Beobachtung in der Antwort – Format oder Schlüssel haben sich geändert.'
    }
    const alter = alterInTagen(letzte.zeitraum, jetzt)
    if (alter === null) return `Zeitraum „${letzte.zeitraum}“ ist nicht lesbar.`
    if (alter > hoechstalterTage) {
      return (
        `Jüngste Beobachtung ${letzte.zeitraum} (${letzte.wert}) ist ${alter} Tage alt, ` +
        `erlaubt sind ${hoechstalterTage}. Die Reihe wird vermutlich nicht mehr gepflegt – ` +
        'genau so verhielt sich ICP nach dem 4. Februar 2026.'
      )
    }
    return null
  }
}

/** Prüft, dass eine Antwort gültiges JSON ist und einen erwarteten Pfad trägt. */
function jsonMitPfad(...glieder: string[]) {
  return (text: string): string | null => {
    let wurzel: unknown
    try {
      wurzel = JSON.parse(text)
    } catch {
      return 'Antwort ist kein gültiges JSON.'
    }
    let hier: unknown = wurzel
    for (const glied of glieder) {
      if (Array.isArray(hier)) {
        hier = hier[0]
      }
      if (typeof hier !== 'object' || hier === null) {
        return `Der Pfad ${glieder.join('.')} fehlt – ab „${glied}“ ist nichts mehr da.`
      }
      hier = (hier as Record<string, unknown>)[glied]
    }
    if (hier === undefined || hier === null) {
      return `Der Pfad ${glieder.join('.')} ist leer.`
    }
    return null
  }
}

/**
 * Die überwachten Verträge.
 *
 * Nur Quellen, von denen ein Datenbestand dieser Website unmittelbar abhängt.
 * Eine Schnittstelle, die niemand abruft, hier zu überwachen hieße, eine
 * Warnung zu erzeugen, auf die niemand reagieren muss – und nach der dritten
 * solchen Warnung liest niemand mehr hin.
 */
export const VERTRAEGE: Vertrag[] = [
  {
    name: 'EZB · Leitzins',
    zweck: 'Der Leitzins neben den Rechnern und im Lernbereich.',
    adresse:
      'https://data-api.ecb.europa.eu/service/data/FM/D.U2.EUR.4F.KR.MRR_FR.LEV?lastNObservations=1&format=csvdata',
    pruefe: ezbReihe(10),
  },
  {
    name: 'EZB · Inflation Euroraum',
    zweck: 'Die Inflationsrate, gegen die jede Realrendite gerechnet wird.',
    adresse:
      'https://data-api.ecb.europa.eu/service/data/HICP/M.U2.N.000000.4D0.ANR?lastNObservations=1&format=csvdata',
    pruefe: ezbReihe(75),
  },
  {
    name: 'EZB · Inflation Deutschland',
    zweck: 'Dieselbe Rechnung für Deutschland allein.',
    adresse:
      'https://data-api.ecb.europa.eu/service/data/HICP/M.DE.N.000000.4D0.ANR?lastNObservations=1&format=csvdata',
    pruefe: ezbReihe(75),
  },
  {
    name: 'EZB · Wechselkurse',
    zweck: 'Jeder Kurs, der zusätzlich in Euro ausgewiesen wird.',
    adresse: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
    pruefe: (text, jetzt) => {
      const treffer = text.match(/time=['"](\d{4}-\d{2}-\d{2})['"]/)
      if (!treffer) return 'Kein Datum in der Tagesdatei – das Format hat sich geändert.'
      if (!/currency=['"]USD['"]/.test(text)) return 'Der US-Dollar fehlt in der Liste.'
      const alter = alterInTagen(treffer[1], jetzt)
      if (alter !== null && alter > 6) {
        return `Die Tagesdatei ist vom ${treffer[1]} und damit ${alter} Tage alt.`
      }
      return null
    },
  },
  {
    name: 'Yahoo · Kursverlauf',
    zweck: 'Alle Kurse und Kursverläufe der Marktseiten.',
    adresse:
      'https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=5d&interval=1d',
    kopf: { 'User-Agent': 'Mozilla/5.0 (kompatibel; IM-Invests Vertragsprüfung)' },
    pruefe: jsonMitPfad('chart', 'result', 'meta', 'regularMarketPrice'),
  },
  {
    name: 'Weltbank · Länderdaten',
    zweck: 'Bevölkerung, Wirtschaftsleistung und Schuldenstand auf dem Globus.',
    /*
      Ein einzelnes Land und kein `mrnev`.

      Der erste Versuch fragte `country/all` mit `mrnev=1` ab und bekam
      Statuscode 400 – die Weltbank nimmt „jüngster verfügbarer Wert“ nicht
      zusammen mit der Sammelabfrage über alle Länder. Für eine Vertragsprüfung
      ist ein Land ohnehin die bessere Frage: Es geht darum, ob die Struktur
      der Antwort noch stimmt, nicht darum, Daten zu holen.
    */
    adresse:
      'https://api.worldbank.org/v2/country/DEU/indicator/NY.GDP.MKTP.CD?format=json&per_page=1',
    pruefe: (text) => {
      let wurzel: unknown
      try {
        wurzel = JSON.parse(text)
      } catch {
        return 'Antwort ist kein gültiges JSON.'
      }
      /*
        Die Weltbank antwortet mit einem Zweierpaar: erst die Kopfdaten, dann
        die Werte. Wer nur das erste Element prüft, prüft die Seitenzählung.
      */
      if (!Array.isArray(wurzel) || wurzel.length < 2) {
        return 'Die Antwort ist nicht das erwartete Paar aus Kopf und Werten.'
      }
      const werte = wurzel[1]
      if (!Array.isArray(werte) || werte.length === 0) return 'Keine Werte enthalten.'
      return null
    },
  },
  {
    name: 'SEC · Unternehmenszahlen',
    zweck: 'Bilanzkennzahlen der US-Werte.',
    adresse:
      'https://data.sec.gov/api/xbrl/companyconcept/CIK0000320193/us-gaap/Assets.json',
    /*
      Die SEC verlangt einen Absender mit Kontaktmöglichkeit und antwortet
      sonst mit 403. Das ist dort Hausordnung und keine Schikane.
    */
    kopf: { 'User-Agent': 'IM Invests Vertragspruefung kontakt@iminvests.de' },
    pruefe: jsonMitPfad('units', 'USD'),
  },
  {
    name: 'XBRL Filings · ESEF',
    zweck: 'Bilanzkennzahlen der europäischen Werte.',
    adresse: 'https://filings.xbrl.org/api/filings?page[size]=1',
    pruefe: jsonMitPfad('data', 'attributes'),
  },
  {
    name: 'TWSE · Taiwan',
    zweck: 'Kennzahlen der taiwanischen Werte.',
    adresse: 'https://openapi.twse.com.tw/v1/opendata/t187ap03_L',
    pruefe: (text) => {
      let wurzel: unknown
      try {
        wurzel = JSON.parse(text)
      } catch {
        return 'Antwort ist kein gültiges JSON.'
      }
      if (!Array.isArray(wurzel) || wurzel.length === 0) return 'Leere Liste.'
      return null
    },
  },
  {
    name: 'Twelve Data · Quartalstermine',
    zweck: 'Die Termine im Kalender und auf den Aktienseiten.',
    adresse:
      'https://api.twelvedata.com/earnings?symbol=AAPL (Schlüssel nicht angezeigt)',
    schluessel: 'TWELVEDATA_API_KEY',
    mitSchluessel: (wert) =>
      `https://api.twelvedata.com/earnings?symbol=AAPL&outputsize=1&apikey=${wert}`,
    pruefe: (text) => {
      let wurzel: unknown
      try {
        wurzel = JSON.parse(text)
      } catch {
        return 'Antwort ist kein gültiges JSON.'
      }
      const o = wurzel as Record<string, unknown>
      /*
        Twelve Data meldet Fehler mit Statuscode 200 und einem `status`-Feld.
        Wer nur den Statuscode prüft, hält ein abgelaufenes Kontingent für
        einen erfolgreichen Abruf.
      */
      if (o.status === 'error') {
        return `Die Schnittstelle meldet einen Fehler: ${String(o.message ?? 'ohne Angabe')}`
      }
      if (!Array.isArray(o.earnings)) return 'Das Feld „earnings“ fehlt.'
      return null
    },
  },
]
