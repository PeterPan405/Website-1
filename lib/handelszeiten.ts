/**
 * Wann der Markt hinter einem Kurs überhaupt geöffnet hat.
 *
 * ## Warum es das gibt
 *
 * Am Morgen des 5. August 2026 stand auf der Nikkei-Seite ein Kurs vom Vortag,
 * 8:45 Uhr. Der Betreiber sah eine Zahl, die aussah wie von jetzt, und hielt
 * sie für einen Fehler – es war aber der reguläre Schlusskurs einer Börse, die
 * zu diesem Zeitpunkt seit Stunden geschlossen war.
 *
 * Beides gehört an den Kurs: **wann dieser Markt handelt**, und **ob seither
 * eine Sitzung stattgefunden hat, die hier fehlt.** Das erste erklärt einen
 * alten Kurs, das zweite deckt einen echten Ausfall auf. Ohne die
 * Unterscheidung sieht ein normaler Feierabend genauso aus wie ein
 * abgestürzter Abruf.
 *
 * ## Woher der Handelsplatz kommt
 *
 * Aus dem `ticker`, nicht aus dem Sitzland. Der Ticker trägt das Kürzel der
 * Börse, an der der Kurs tatsächlich gestellt wird (`7267.T` – Tokio), und
 * genau von dort kommen die Daten. Das Sitzland wäre ein Umweg mit
 * eingebautem Fehler: Eine in Irland ansässige Gesellschaft, die in New York
 * notiert, bekäme sonst die Dubliner Zeiten.
 *
 * Wo sich der Platz nicht ableiten lässt, wird **nichts** behauptet. Eine
 * geratene Handelszeit wäre schlimmer als keine.
 */

/** Ein Handelsplatz mit seinen Zeiten in **Ortszeit**. */
export interface Handelsplatz {
  /** Anzeigename, z. B. „Börse Tokio". */
  name: string
  /**
   * IANA-Zeitzone, z. B. `Asia/Tokyo`.
   *
   * Bewusst die Zone und nicht ein fester Versatz zu UTC: New York, London und
   * Frankfurt stellen ihre Uhren um, Tokio nicht. Ein gespeicherter Versatz
   * wäre die Hälfte des Jahres falsch, und zwar lautlos.
   */
  zone: string
  /** Eröffnung in Ortszeit, Minuten seit Mitternacht. */
  von: number
  /** Schluss in Ortszeit, Minuten seit Mitternacht. */
  bis: number
  /**
   * `werktags` – Montag bis Freitag; `taeglich` – ohne Pause.
   *
   * Feiertage bleiben außen vor. Sie ließen sich je Börse pflegen, und genau
   * das wäre der Anfang einer Liste, die niemand aktuell hält. Die Folge ist
   * ein Feiertag, an dem „geöffnet" steht – ärgerlich, aber harmlos, weil die
   * Aussage über den Kurs daneben davon nicht abhängt.
   */
  tage: 'werktags' | 'taeglich'
}

function uhr(stunden: number, minuten = 0): number {
  return stunden * 60 + minuten
}

const NEW_YORK: Handelsplatz = {
  name: 'New York',
  zone: 'America/New_York',
  von: uhr(9, 30),
  bis: uhr(16),
  tage: 'werktags',
}

const XETRA: Handelsplatz = {
  name: 'Xetra',
  zone: 'Europe/Berlin',
  von: uhr(9),
  bis: uhr(17, 30),
  tage: 'werktags',
}

/**
 * Die Handelsplätze, auf die die Ticker-Kürzel zeigen.
 *
 * Nur die Zeiten des regulären Handels. Vor- und nachbörsliche Fenster bleiben
 * draußen: Dort entstehen zwar Kurse, aber keine, die diese Website führt –
 * und der Unterschied ist genau der Punkt, den der Artikel zum
 * nachbörslichen Handel erklärt.
 */
const PLAETZE = {
  newYork: NEW_YORK,
  xetra: XETRA,
  london: {
    name: 'London',
    zone: 'Europe/London',
    von: uhr(8),
    bis: uhr(16, 30),
    tage: 'werktags',
  },
  paris: {
    name: 'Euronext Paris',
    zone: 'Europe/Paris',
    von: uhr(9),
    bis: uhr(17, 30),
    tage: 'werktags',
  },
  amsterdam: {
    name: 'Euronext Amsterdam',
    zone: 'Europe/Amsterdam',
    von: uhr(9),
    bis: uhr(17, 30),
    tage: 'werktags',
  },
  bruessel: {
    name: 'Euronext Brüssel',
    zone: 'Europe/Brussels',
    von: uhr(9),
    bis: uhr(17, 30),
    tage: 'werktags',
  },
  lissabon: {
    name: 'Euronext Lissabon',
    zone: 'Europe/Lisbon',
    von: uhr(8),
    bis: uhr(16, 30),
    tage: 'werktags',
  },
  mailand: {
    name: 'Borsa Italiana',
    zone: 'Europe/Rome',
    von: uhr(9),
    bis: uhr(17, 30),
    tage: 'werktags',
  },
  madrid: {
    name: 'Bolsa de Madrid',
    zone: 'Europe/Madrid',
    von: uhr(9),
    bis: uhr(17, 30),
    tage: 'werktags',
  },
  zuerich: {
    name: 'SIX Zürich',
    zone: 'Europe/Zurich',
    von: uhr(9),
    bis: uhr(17, 30),
    tage: 'werktags',
  },
  wien: {
    name: 'Wiener Börse',
    zone: 'Europe/Vienna',
    von: uhr(9),
    bis: uhr(17, 30),
    tage: 'werktags',
  },
  stockholm: {
    name: 'Nasdaq Stockholm',
    zone: 'Europe/Stockholm',
    von: uhr(9),
    bis: uhr(17, 30),
    tage: 'werktags',
  },
  kopenhagen: {
    name: 'Nasdaq Kopenhagen',
    zone: 'Europe/Copenhagen',
    von: uhr(9),
    bis: uhr(17),
    tage: 'werktags',
  },
  helsinki: {
    name: 'Nasdaq Helsinki',
    zone: 'Europe/Helsinki',
    von: uhr(10),
    bis: uhr(18, 30),
    tage: 'werktags',
  },
  oslo: {
    name: 'Oslo Børs',
    zone: 'Europe/Oslo',
    von: uhr(9),
    bis: uhr(16, 20),
    tage: 'werktags',
  },
  dublin: {
    name: 'Euronext Dublin',
    zone: 'Europe/Dublin',
    von: uhr(8),
    bis: uhr(16, 30),
    tage: 'werktags',
  },
  prag: {
    name: 'Prager Börse',
    zone: 'Europe/Prague',
    von: uhr(9),
    bis: uhr(16, 20),
    tage: 'werktags',
  },
  warschau: {
    name: 'Warschauer Börse',
    zone: 'Europe/Warsaw',
    von: uhr(9),
    bis: uhr(17),
    tage: 'werktags',
  },
  athen: {
    name: 'Athener Börse',
    zone: 'Europe/Athens',
    von: uhr(10, 15),
    bis: uhr(17, 20),
    tage: 'werktags',
  },
  tokio: {
    name: 'Börse Tokio',
    zone: 'Asia/Tokyo',
    von: uhr(9),
    bis: uhr(15, 30),
    tage: 'werktags',
  },
  hongkong: {
    name: 'Börse Hongkong',
    zone: 'Asia/Hong_Kong',
    von: uhr(9, 30),
    bis: uhr(16),
    tage: 'werktags',
  },
  shanghai: {
    name: 'Börse Shanghai',
    zone: 'Asia/Shanghai',
    von: uhr(9, 30),
    bis: uhr(15),
    tage: 'werktags',
  },
  seoul: {
    name: 'Börse Seoul',
    zone: 'Asia/Seoul',
    von: uhr(9),
    bis: uhr(15, 30),
    tage: 'werktags',
  },
  taipeh: {
    name: 'Börse Taipeh',
    zone: 'Asia/Taipei',
    von: uhr(9),
    bis: uhr(13, 30),
    tage: 'werktags',
  },
  mumbai: {
    name: 'Börse Mumbai',
    zone: 'Asia/Kolkata',
    von: uhr(9, 15),
    bis: uhr(15, 30),
    tage: 'werktags',
  },
  singapur: {
    name: 'Börse Singapur',
    zone: 'Asia/Singapore',
    von: uhr(9),
    bis: uhr(17),
    tage: 'werktags',
  },
  telAviv: {
    name: 'Börse Tel Aviv',
    zone: 'Asia/Jerusalem',
    von: uhr(9, 59),
    bis: uhr(17, 14),
    // Der Handel läuft dort von Sonntag bis Donnerstag. `werktags` ist damit
    // an zwei Tagen im Jahr… genauer: an jedem Sonntag und Donnerstag knapp
    // daneben. Für die Frage „warum ist dieser Kurs alt“ reicht es; für mehr
    // bräuchte es einen eigenen Tagestyp, den sonst kein Platz nutzt.
    tage: 'werktags',
  },
  doha: {
    name: 'Börse Doha',
    zone: 'Asia/Qatar',
    von: uhr(9, 30),
    bis: uhr(13),
    tage: 'werktags',
  },
  riad: {
    name: 'Tadawul Riad',
    zone: 'Asia/Riyadh',
    von: uhr(10),
    bis: uhr(15),
    tage: 'werktags',
  },
  sydney: {
    name: 'Börse Sydney',
    zone: 'Australia/Sydney',
    von: uhr(10),
    bis: uhr(16),
    tage: 'werktags',
  },
  toronto: {
    name: 'Börse Toronto',
    zone: 'America/Toronto',
    von: uhr(9, 30),
    bis: uhr(16),
    tage: 'werktags',
  },
  saoPaulo: {
    name: 'B3 São Paulo',
    zone: 'America/Sao_Paulo',
    von: uhr(10),
    bis: uhr(17, 55),
    tage: 'werktags',
  },
  mexiko: {
    name: 'Börse Mexiko-Stadt',
    zone: 'America/Mexico_City',
    von: uhr(8, 30),
    bis: uhr(15),
    tage: 'werktags',
  },
  johannesburg: {
    name: 'Börse Johannesburg',
    zone: 'Africa/Johannesburg',
    von: uhr(9),
    bis: uhr(17),
    tage: 'werktags',
  },
} as const satisfies Record<string, Handelsplatz>

type PlatzName = keyof typeof PLAETZE

/**
 * Ticker-Endung zu Handelsplatz.
 *
 * Ohne Endung notiert ein Wert in den USA – so schreibt Yahoo die Kürzel, und
 * so stehen sie in `data/markets-aktien.ts`.
 */
const ENDUNGEN: Record<string, PlatzName> = {
  DE: 'xetra',
  F: 'xetra',
  L: 'london',
  PA: 'paris',
  AS: 'amsterdam',
  BR: 'bruessel',
  LS: 'lissabon',
  MI: 'mailand',
  MC: 'madrid',
  SW: 'zuerich',
  VI: 'wien',
  ST: 'stockholm',
  CO: 'kopenhagen',
  HE: 'helsinki',
  OL: 'oslo',
  IR: 'dublin',
  PR: 'prag',
  WA: 'warschau',
  AT: 'athen',
  T: 'tokio',
  HK: 'hongkong',
  SS: 'shanghai',
  SZ: 'shanghai',
  KS: 'seoul',
  KQ: 'seoul',
  TW: 'taipeh',
  NS: 'mumbai',
  BO: 'mumbai',
  SI: 'singapur',
  TA: 'telAviv',
  QA: 'doha',
  SR: 'riad',
  AX: 'sydney',
  TO: 'toronto',
  SA: 'saoPaulo',
  MX: 'mexiko',
  JO: 'johannesburg',
}

/** Indizes tragen kein Börsenkürzel – ihr Platz steht hier ausdrücklich. */
const INDIZES: Record<string, PlatzName> = {
  dax: 'xetra',
  mdax: 'xetra',
  tecdax: 'xetra',
  sdax: 'xetra',
  'euro-stoxx-50': 'xetra',
  sp500: 'newYork',
  'nasdaq-100': 'newYork',
  'dow-jones': 'newYork',
  'russell-2000': 'newYork',
  'nikkei-225': 'tokio',
  'hang-seng': 'hongkong',
  kospi: 'seoul',
  taiex: 'taipeh',
  'nifty-50': 'mumbai',
  'asx-200': 'sydney',
  'tsx-composite': 'toronto',
  ibovespa: 'saoPaulo',
  'omx-stockholm-30': 'stockholm',
  smi: 'zuerich',
  'cac-40': 'paris',
  'ftse-100': 'london',
  // `msci-world` fehlt mit Absicht: Er wird einmal täglich berechnet und an
  // keiner Börse gehandelt. Eine Handelszeit dafür wäre erfunden.
}

/** Was für die Frage „warum ist dieser Kurs alt“ gebraucht wird. */
export interface Instrumentkennung {
  symbol: string
  ticker: string
  kind: string
}

/**
 * Der Handelsplatz eines Instruments – oder `null`, wenn er unbekannt ist.
 *
 * `null` steht auch für die durchgehend gehandelten Werte: Krypto kennt keinen
 * Schluss, und Devisen und Rohstoff-Terminkontrakte laufen fast rund um die
 * Uhr. Für sie ist die Frage „hat die Börse zu?“ keine Erklärung für einen
 * alten Kurs, sondern der Hinweis auf einen Ausfall – und genau so behandelt
 * sie `verpassteSitzungen`.
 */
export function handelsplatzFuer(instrument: Instrumentkennung): Handelsplatz | null {
  if (instrument.kind === 'crypto' || instrument.kind === 'fx') return null
  if (instrument.kind === 'commodity') return null

  const ausIndex = INDIZES[instrument.symbol]
  if (ausIndex) return PLAETZE[ausIndex]

  const punkt = instrument.ticker.lastIndexOf('.')
  if (punkt < 0) {
    /*
      Kein Börsenkürzel – dann muss der Ticker wenigstens wie ein
      amerikanisches Symbol aussehen.

      In diesem Katalog notieren solche Werte in den USA, und zwar auch dann,
      wenn das Unternehmen nicht dort sitzt: `SAP`, `ASML`, `TSM` und `NVO`
      sind die New Yorker Notierungen, und von dort kommen die Kurse. Genau
      deshalb steht hier der Ticker und nicht das Sitzland.

      Die ETFs tragen dagegen einen beschreibenden Namen statt eines Kürzels
      („MSCI World ETF"). Ohne diese Prüfung bekämen sie New Yorker
      Handelszeiten – für europäische UCITS-Fonds schlicht falsch.
    */
    return /^[A-Z][A-Z0-9-]{0,5}$/.test(instrument.ticker) ? NEW_YORK : null
  }

  const endung = instrument.ticker.slice(punkt + 1).toUpperCase()
  const platz = ENDUNGEN[endung]
  return platz ? PLAETZE[platz] : null
}

/** Wochentag (0 = Sonntag) und Minute des Tages an einem Ort. */
export function ortszeit(
  zeitpunkt: Date,
  zone: string
): { wochentag: number; minute: number; datum: string } {
  /*
    `formatToParts` statt einer Rechnung mit Zeitzonen-Versätzen.

    Der Versatz einer Zone ist keine Konstante – er hängt am Datum, und zwar
    nach Regeln, die sich ändern. Alles, was hier nachgerechnet würde, wäre
    eine zweite, schlechtere Zeitzonendatenbank. Die richtige liegt in der
    Laufzeitumgebung.
  */
  const teile = new Intl.DateTimeFormat('en-CA', {
    timeZone: zone,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(zeitpunkt)

  const teil = (art: string) => teile.find((t) => t.type === art)?.value ?? ''
  const wochentage = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  // `hour` kann bei `hour12: false` als „24“ herauskommen – Mitternacht.
  const stunde = Number(teil('hour')) % 24

  return {
    wochentag: Math.max(0, wochentage.indexOf(teil('weekday'))),
    minute: stunde * 60 + Number(teil('minute')),
    datum: `${teil('year')}-${teil('month')}-${teil('day')}`,
  }
}

/** Handelt dieser Platz gerade? Feiertage bleiben unberücksichtigt. */
export function istGeoeffnet(platz: Handelsplatz, jetzt: Date): boolean {
  const { wochentag, minute } = ortszeit(jetzt, platz.zone)
  if (platz.tage === 'werktags' && (wochentag === 0 || wochentag === 6)) return false
  return minute >= platz.von && minute < platz.bis
}

/**
 * Wie viele Handelsschlüsse seit diesem Kurs vergangen sind.
 *
 * Das ist die Zahl, an der ein Ausfall hängt – nicht das Alter in Stunden. Ein
 * Kurs vom Freitagabend ist am Montagmorgen 60 Stunden alt und völlig in
 * Ordnung; derselbe Kurs am Dienstagmorgen hat eine Sitzung verpasst und ist
 * ein Fehler.
 *
 * Gezählt werden Werktage, deren Schluss zwischen `stand` und `jetzt` liegt.
 * Feiertage zählen mit und erzeugen dadurch gelegentlich einen Fehlalarm –
 * die Richtung stimmt: lieber einmal zu viel gefragt als eine tote Zahl, die
 * aussieht wie eine lebende.
 */
export function verpassteSitzungen(
  platz: Handelsplatz,
  stand: Date,
  jetzt: Date
): number {
  const tagMs = 24 * 60 * 60 * 1000
  let zaehler = 0

  // Höchstens vierzehn Tage zurück: Was länger steht, ist ohnehin ein Befund,
  // und die Schleife soll auch bei einem kaputten Zeitstempel enden.
  for (let i = 0; i <= 14; i++) {
    const tag = new Date(jetzt.getTime() - i * tagMs)
    const { wochentag, datum } = ortszeit(tag, platz.zone)
    if (platz.tage === 'werktags' && (wochentag === 0 || wochentag === 6)) continue

    const schluss = zeitpunktIn(datum, platz.bis, platz.zone)
    const oeffnung = zeitpunktIn(datum, platz.von, platz.zone)
    if (schluss === null || oeffnung === null) continue

    // Der Schluss muss zwischen Kurs und Jetzt liegen …
    if (schluss <= stand.getTime() || schluss > jetzt.getTime()) continue

    /*
      … und der Kurs darf nicht aus dieser Sitzung selbst stammen.

      Ohne diese Zeile zählt ein Kurs von 15:25 Uhr die Sitzung als verpasst,
      die um 15:30 Uhr endet – obwohl er mitten aus ihr kommt. Genau so liefert
      Yahoo den Schlusskurs: als letzten Handel vor dem Schluss, nicht auf die
      Minute.
    */
    if (stand.getTime() >= oeffnung) continue

    zaehler++
  }

  return zaehler
}

/**
 * Der Zeitpunkt, an dem an einem Ort ein bestimmter Tag und eine bestimmte
 * Minute herrschen – als Millisekunden seit 1970.
 *
 * Der Weg führt über einen Versuch und eine Korrektur: Erst wird angenommen,
 * die Ortszeit sei UTC; dann wird gemessen, wie weit das danebenlag, und um
 * genau diesen Betrag verschoben. Ein zweiter Durchgang fängt den Sprung an
 * den Umstellungstagen ab.
 */
function zeitpunktIn(datum: string, minute: number, zone: string): number | null {
  const [jahr, monat, tag] = datum.split('-').map(Number)
  if (!jahr || !monat || !tag) return null

  let versuch = Date.UTC(jahr, monat - 1, tag, Math.floor(minute / 60), minute % 60)

  for (let runde = 0; runde < 2; runde++) {
    const dort = ortszeit(new Date(versuch), zone)
    const [j2, m2, t2] = dort.datum.split('-').map(Number)
    const sollTag = Date.UTC(jahr, monat - 1, tag)
    const istTag = Date.UTC(j2, m2 - 1, t2)
    const abweichung = istTag - sollTag + (dort.minute - minute) * 60_000
    if (abweichung === 0) break
    versuch -= abweichung
  }

  return versuch
}
