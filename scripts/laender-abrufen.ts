/**
 * Holt die Länderdaten für den Globus und legt sie als Momentaufnahme ab.
 *
 * Dasselbe Verfahren wie bei `scripts/kurse-abrufen.ts`: Die Website wird
 * statisch gebaut und kann zur Laufzeit nichts nachladen. Was auf der Seite
 * steht, muss also beim Bauen im Repository liegen. Der Abruf läuft deshalb
 * hier und schreibt `data/snapshots/laender.json`.
 *
 * ## Woher die Zahlen kommen
 *
 * Bruttoinlandsprodukt und Einwohnerzahl stammen aus den Reihen der Weltbank
 * (`NY.GDP.MKTP.CD` und `SP.POP.TOTL`), abgerufen über die offenen
 * CSV-Spiegel des Frictionless-Data-Projekts. Die Zuordnung der Ländercodes
 * kommt aus demselben Projekt.
 *
 * Warum nicht direkt von der Weltbank: Deren Schnittstelle ist aus dieser
 * Umgebung nicht erreichbar. Die Spiegel enthalten dieselben Reihen und nennen
 * ihre Herkunft; der Preis ist, dass sie dem Original um ein bis zwei Jahre
 * hinterherlaufen. Genau deshalb steht das Bezugsjahr in der Momentaufnahme
 * und auf der Seite – eine Kennzahl ohne Jahr wäre eine Behauptung.
 *
 * ## Warum ein gemeinsames Jahr
 *
 * Das BIP pro Kopf wird nicht gespeichert, sondern gerechnet. Damit die
 * Division stimmt, müssen Zähler und Nenner aus demselben Jahr stammen –
 * genommen wird deshalb das jüngste Jahr, für das **beide** Reihen vorliegen,
 * nicht jeweils das jüngste je Reihe.
 *
 * Aufruf: `npm run laender`
 */

import { ECB_HISTORY_FULL_URL, parseEcbEnvelope } from '../lib/providers/ecb.ts'

const GDP_URL = 'https://raw.githubusercontent.com/datasets/gdp/main/data/gdp.csv'
const POP_URL =
  'https://raw.githubusercontent.com/datasets/population/main/data/population.csv'
const CODES_URL =
  'https://raw.githubusercontent.com/datasets/country-codes/master/data/country-codes.csv'

/**
 * Zwei Einkommensreihen der Weltbank – die Antwort auf den weissen Fleck Afrika.
 *
 * ## Das Problem, das sie loesen
 *
 * Beim Durchschnittsgehalt standen 38 von 249 Laendern, in Afrika kein
 * einziges von 60. Die OECD erhebt Loehne nur bei ihren Mitgliedern, und eine
 * weltweite Lohnreihe nach einheitlicher Abgrenzung veroeffentlicht niemand
 * offen – die ILO-Schnittstelle antwortet auf jede Abfrage mit HTML.
 *
 * ## Warum nicht geschaetzt wird
 *
 * Ein aus dem BIP hochgerechnetes „Durchschnittsgehalt“ waere eine erfundene
 * Zahl unter einer Ueberschrift, die etwas anderes verspricht. Diese beiden
 * Reihen sind statt dessen **gemessen** und fuer fast jedes Land vorhanden:
 *
 * - `NY.GNP.PCAP.CD` – Bruttonationaleinkommen je Kopf in US-Dollar nach der
 *   Atlas-Methode. Was ein Land im Schnitt je Einwohner einnimmt, ueber drei
 *   Jahre wechselkursgeglaettet. 245 Laender.
 * - `NY.GDP.PCAP.PP.CD` – Wirtschaftsleistung je Kopf, kaufkraftbereinigt.
 *   Macht Laender mit sehr unterschiedlichem Preisniveau vergleichbar. 242
 *   Laender.
 *
 * Beides ist kein Gehalt und wird auf der Seite auch nicht so genannt. Es
 * beantwortet die Frage, um die es beim Blick auf die Karte meist geht – wie
 * wohlhabend ist dieses Land – und zwar fuer fast alle statt fuer ein Sechstel.
 */
const WELTBANK_BASIS = 'https://api.worldbank.org/v2/country/all/indicator'
const EINKOMMENSREIHEN = [
  { feld: 'bneProKopf' as const, indikator: 'NY.GNP.PCAP.CD' },
  { feld: 'bipProKopfKKP' as const, indikator: 'NY.GDP.PCAP.PP.CD' },
]

/**
 * Arbeitslosenquote und Inflation – zwei Reihen, die anders zu lesen sind.
 *
 * Bisher zeigte der Globus ausschliesslich Bestandsgroessen: wie gross, wie
 * reich, wie verschuldet. Diese beiden sind **Raten** und verhalten sich in
 * drei Punkten anders. Alle drei stehen in der Erklaerung auf der Seite, weil
 * sie sonst zu falschen Schluessen fuehren.
 *
 * - `SL.UEM.TOTL.ZS` – Arbeitslose in Prozent der Erwerbspersonen. **Ein
 *   Modellwert der ILO**, keine nationale Meldung: Die Laender zaehlen
 *   verschieden, und die ILO rechnet sie auf eine gemeinsame Abgrenzung um,
 *   damit ein Vergleich ueberhaupt moeglich ist. Wer die deutsche Zahl der
 *   Bundesagentur danebenlegt, findet einen Unterschied – und der ist kein
 *   Fehler, sondern der Preis der Vergleichbarkeit.
 * - `FP.CPI.TOTL.ZG` – Verbraucherpreise, Veraenderung zum Vorjahr in Prozent.
 *   Das ist der **Jahresdurchschnitt eines abgeschlossenen Jahres**, nicht die
 *   Rate von heute. In einer Zeit fallender Inflation steht auf der Karte
 *   deshalb eine hoehere Zahl als in den Nachrichten.
 *
 * ## Warum hier nichts geschaetzt wird
 *
 * Bei Lohn und Vermoegen fuellt eine Regression aus der Kaufkraft die Luecken.
 * Hier waere das falsch: Arbeitslosigkeit und Inflation haengen nicht am
 * Wohlstand, sondern an Konjunktur, Waehrungsordnung und Politik. Die Schweiz
 * und Spanien sind aehnlich reich und liegen bei der Arbeitslosigkeit um den
 * Faktor fuenf auseinander. Eine Schaetzung daraus waere eine erfundene Zahl,
 * und eine Luecke ist ehrlicher.
 *
 * ## Warum die Farbskala das aushaelt
 *
 * Inflation kann negativ sein (Deflation) und dreistellig (Venezuela, Simbabwe).
 * Die Karte teilt nach Quantilen, nicht nach gleich breiten Klassen – Rang
 * statt Abstand. Ein einzelnes Land mit 400 Prozent verschiebt damit keine
 * Farbe, und negative Werte sortieren sich von selbst nach unten.
 */
const RATENREIHEN = [
  { feld: 'arbeitslosenquote' as const, indikator: 'SL.UEM.TOTL.ZS' },
  { feld: 'inflation' as const, indikator: 'FP.CPI.TOTL.ZG' },
]

/**
 * Schuldenquote aus der Datamapper-Schnittstelle des IWF.
 *
 * `GGXWDG_NGDP` ist die Bruttoschuld des Gesamtstaats in Prozent des BIP – die
 * Groesse, die in jeder Schlagzeile steht, und die einzige, die alle Laender
 * nach derselben Abgrenzung ausweist. Eurostat rechnet nach Maastricht, die
 * Weltbank fuehrt nur den Zentralstaat; beides waere je Land etwas anderes.
 *
 * Der Abruf ist **nicht zwingend**. Laeuft das Skript in einer Umgebung ohne
 * Zugang zu imf.org, bleibt es bei den bereits abgelegten Werten und es gibt
 * eine Warnung – siehe `ladeSchuldenquoten`.
 */
const IWF_SCHULDEN_URL = 'https://www.imf.org/external/datamapper/api/v1/GGXWDG_NGDP'

/**
 * Durchschnittliche Jahresloehne aus der SDMX-Schnittstelle der OECD.
 *
 * `AV_AN_WAGE` ist der Durchschnittslohn einer vollzeitbeschaeftigten Person,
 * kaufkraftbereinigt in US-Dollar. Die OECD deckt damit rund vierzig Laender ab
 * – von Hand gepflegt waren es neun.
 *
 * Weiter reicht es nicht, und das ist keine Nachlaessigkeit: Eine weltweite
 * Lohnreihe nach einheitlicher Abgrenzung veroeffentlicht niemand offen. Fuer
 * die uebrigen Laender bleibt es deshalb bei „keine Angabe hinterlegt“.
 *
 * Wie beim IWF ist der Abruf **nicht zwingend** – siehe `ladeLoehne`.
 */
const OECD_LOEHNE_URL =
  'https://sdmx.oecd.org/public/rest/data/OECD.ELS.SAE,DSD_EARNINGS@AV_AN_WAGE,1.0/?format=csvfilewithlabels&dimensionAtObservation=AllDimensions'

/** Die Einheit, die gemeint ist – siehe `ladeLoehne`. */
const OECD_EINHEIT = 'USD_PPP'

/**
 * Vermoegensverteilung aus derselben SDMX-Schnittstelle.
 *
 * Von Hand gepflegt standen hier drei Werte aus einem Bankenbericht. Diese
 * Datenbank fuehrt 31 Laender nach einheitlicher Abgrenzung, mit Jahr und
 * Waehrung an jedem Wert.
 *
 * ## Das Median-Reinvermoegen ist eine andere Groesse als vorher
 *
 * Die OECD weist es **je Haushalt** aus, der Bankenbericht wies es je
 * erwachsener Person aus. Das sind zwei verschiedene Zahlen, und die
 * Umrechnung ineinander braeuchte die durchschnittliche Haushaltsgroesse –
 * also eine dritte Quelle und eine weitere Fehlerquelle. Auf der Seite steht
 * deshalb ausdruecklich „je Haushalt“.
 *
 * Warum ueberhaupt der Median und nicht der Durchschnitt: Beim Durchschnitt
 * zieht eine kleine Zahl sehr vermoegender Haushalte den Wert nach oben. Wer
 * wissen will, wie es der Mitte einer Gesellschaft geht, braucht den Median.
 */
const OECD_VERMOEGEN_URL =
  'https://sdmx.oecd.org/public/rest/data/OECD.WISE.INE,DSD_WEALTH@DF_WEALTH,1.0/?format=csvfilewithlabels'

/**
 * Die Zeilen, die gemeint sind.
 *
 * `NW` ist das Reinvermoegen, `MEDIAN` die Rechengroesse, `XDC_HH` die Einheit
 * „Landeswaehrung je Haushalt“. Alle drei muessen stimmen: Dieselbe Datenbank
 * enthaelt auch den arithmetischen Mittelwert und eine Fassung je Person, und
 * beide saehen im Ergebnis genauso plausibel aus.
 */
const VERMOEGEN_FILTER = {
  groesse: 'NW',
  rechnung: 'MEDIAN',
  einheit: 'XDC_HH',
} as const

const ZIEL = 'data/snapshots/laender.json'

/**
 * Die taegliche Kursreihe der Europaeischen Zentralbank seit 1999.
 *
 * Sie liegt bereits im Projekt und wird fuer die Waehrungspaare auf der
 * Marktseite benutzt (`lib/providers/ecb.ts`). Fuer die Umrechnung der
 * Vermoegenswerte ist sie die naheliegende Wahl: amtlich, kostenlos, mit
 * historischen Kursen bis 1999 – und eine Quelle weniger, als eine neue
 * Schnittstelle bedeutet haette.
 */
const ECB_REIHE_URL = ECB_HISTORY_FULL_URL

/**
 * Kopfzeilen für die beiden Statistikschnittstellen.
 *
 * ## Warum das nötig wurde
 *
 * Der erste echte Lauf auf einem GitHub-Läufer hat beide Abrufe abgewiesen:
 * imf.org mit 403, sdmx.oecd.org mit 500. Beim IWF ist 403 der typische
 * Abweisungscode einer Schutzschicht, die einen Aufruf ohne erkennbaren
 * Absender für einen Roboter hält – Node schickt von sich aus keine
 * `User-Agent`-Zeile.
 *
 * Die Antwort darauf ist nicht, sich als Browser auszugeben, sondern zu sagen,
 * wer man ist: Name des Abrufs und eine Adresse, unter der man erreichbar ist.
 * Genau dafür ist das Feld gedacht, und wer den Abruf unterbinden will, kann
 * ihn so gezielt sperren, statt dass jemand ihn tarnt.
 */
const KOPFZEILEN: Record<string, string> = {
  'User-Agent': 'IM-Invests-Laenderabruf/1.0 (+https://iminvests.de)',
  Accept: 'application/json, text/csv;q=0.9, */*;q=0.8',
}

/**
 * Eigene Kopfzeilen für die OECD.
 *
 * Deren SDMX-Dienst hat mit 500 und dem Text `languageTag1` geantwortet – eine
 * Meldung aus der Sprachauswahl des Servers, nicht aus der Abfrage. Er bekommt
 * deshalb ausdrücklich gesagt, in welcher Sprache und in welchem Format
 * geantwortet werden soll, statt es aushandeln zu müssen.
 */
const OECD_KOPFZEILEN: Record<string, string> = {
  'User-Agent': KOPFZEILEN['User-Agent'],
  Accept: 'application/vnd.sdmx.data+csv; charset=utf-8; version=2',
  'Accept-Language': 'en',
}

/**
 * Sagt bei einer Fehlantwort, **was** der Server geantwortet hat.
 *
 * Ohne diesen Auszug stand im Protokoll nur „antwortete mit 500“. Bei einer
 * SDMX-Schnittstelle steht die eigentliche Auskunft im Rumpf – welche
 * Dimension unbekannt ist, welcher Datenfluss nicht existiert. Ein Statuscode
 * allein lässt nur raten, und raten kostet bei zwei Minuten je Lauf mehr Zeit
 * als lesen.
 */
async function fehlerauszug(antwort: Response): Promise<string> {
  try {
    const rumpf = (await antwort.text()).replace(/\s+/g, ' ').trim()
    return rumpf.length > 0 ? ` – Antwort: ${rumpf.slice(0, 300)}` : ''
  } catch {
    return ''
  }
}

/** Aggregate der Weltbank („Europäische Union“, „Welt“) sind keine Länder. */
const KEINE_LAENDER =
  /^(WLD|EU[UN]?|OED|ARB|CSS|CEB|EAR|EAS|EAP|TEA|ECS|ECA|TEC|EMU|FCS|HPC|HIC|IBD|IBT|IDB|IDX|IDA|LTE|LCN|LAC|TLA|LDC|LMY|LIC|LMC|MEA|MNA|TMN|MIC|NAC|INX|OSS|PSS|PST|PRE|SST|SAS|TSA|SSF|SSA|TSS|UMC|AFE|AFW|CHI)$/

interface Rohzeile {
  code: string
  jahr: number
  wert: number
}

async function ladeCsv(url: string): Promise<Record<string, string>[]> {
  const antwort = await fetch(url)
  if (!antwort.ok) {
    throw new Error(`${url} antwortete mit ${antwort.status}`)
  }
  return parseCsv(await antwort.text())
}

/**
 * Genügsamer CSV-Leser mit Anführungszeichen.
 *
 * Reicht für diese drei Dateien und spart eine Abhängigkeit, die nur ein
 * Skript bräuchte. Die Ländernamen enthalten Kommas („Korea, Rep.“), Zeilen-
 * umbrüche in Feldern kommen dagegen nicht vor.
 */
function parseCsv(text: string): Record<string, string>[] {
  const zeilen = text.split(/\r?\n/).filter((zeile) => zeile.length > 0)
  const kopf = zerlege(zeilen[0])
  return zeilen.slice(1).map((zeile) => {
    const felder = zerlege(zeile)
    return Object.fromEntries(kopf.map((name, index) => [name, felder[index] ?? '']))
  })
}

function zerlege(zeile: string): string[] {
  const felder: string[] = []
  let aktuell = ''
  let inAnfuehrung = false
  for (let i = 0; i < zeile.length; i += 1) {
    const zeichen = zeile[i]
    if (zeichen === '"') {
      // Doppelte Anführungszeichen im Feld stehen für ein einzelnes.
      if (inAnfuehrung && zeile[i + 1] === '"') {
        aktuell += '"'
        i += 1
      } else {
        inAnfuehrung = !inAnfuehrung
      }
    } else if (zeichen === ',' && !inAnfuehrung) {
      felder.push(aktuell)
      aktuell = ''
    } else {
      aktuell += zeichen
    }
  }
  felder.push(aktuell)
  return felder
}

function zuReihe(zeilen: Record<string, string>[]): Rohzeile[] {
  return zeilen
    .map((zeile) => ({
      code: zeile['Country Code'],
      jahr: Number(zeile['Year']),
      wert: Number(zeile['Value']),
    }))
    .filter(
      (zeile) =>
        zeile.code.length === 3 &&
        !KEINE_LAENDER.test(zeile.code) &&
        Number.isFinite(zeile.jahr) &&
        Number.isFinite(zeile.wert) &&
        zeile.wert > 0
    )
}

/** Das jüngste Jahr, für das eine Reihe mindestens `mindestens` Länder kennt. */
function juengstesVollesJahr(reihe: Rohzeile[], mindestens = 100): number {
  const jeJahr = new Map<number, number>()
  for (const zeile of reihe) {
    jeJahr.set(zeile.jahr, (jeJahr.get(zeile.jahr) ?? 0) + 1)
  }
  const brauchbar = [...jeJahr.entries()]
    .filter(([, anzahl]) => anzahl >= mindestens)
    .map(([jahr]) => jahr)
  if (brauchbar.length === 0) throw new Error('Keine ausreichend besetzte Jahresreihe.')
  return Math.max(...brauchbar)
}

function werteImJahr(reihe: Rohzeile[], jahr: number): Map<string, number> {
  return new Map(
    reihe.filter((zeile) => zeile.jahr === jahr).map((zeile) => [zeile.code, zeile.wert])
  )
}

/**
 * Holt die Schuldenquoten, oder `null`, wenn die Quelle nicht erreichbar ist.
 *
 * Bewusst ohne Abbruch: Der Abruf laeuft auch in Umgebungen, deren
 * Netzwerkregeln imf.org nicht zulassen. Dort sollen BIP und Einwohnerzahl
 * trotzdem aktualisiert werden, statt dass der ganze Lauf scheitert. Was fehlt,
 * bleibt beim vorherigen Stand – dieselbe Regel wie beim Kursabruf: niemals
 * verwerfen, nur ergaenzen.
 */
async function ladeSchuldenquoten(): Promise<Map<
  string,
  { wert: number; jahr: number }
> | null> {
  try {
    const antwort = await fetch(IWF_SCHULDEN_URL, { headers: KOPFZEILEN })
    if (!antwort.ok) {
      console.log(
        `::warning::IWF antwortete mit ${antwort.status}${await fehlerauszug(antwort)} – Schuldenquoten bleiben unveraendert.`
      )
      return null
    }
    const inhalt = (await antwort.json()) as {
      values?: Record<string, Record<string, Record<string, number>>>
    }
    const reihe = inhalt.values?.GGXWDG_NGDP
    if (!reihe || typeof reihe !== 'object') {
      // Die Antwort kam an, sah aber anders aus als erwartet. Lieber nichts
      // schreiben als Unsinn – eine Schuldenquote von 0 sieht auf der Karte
      // aus wie ein schuldenfreies Land.
      console.log(
        '::warning::Antwort des IWF hat eine unerwartete Form – Schuldenquoten bleiben unveraendert.'
      )
      return null
    }

    const aktuellesJahr = new Date().getUTCFullYear()
    const werte = new Map<string, { wert: number; jahr: number }>()
    for (const [code, jahre] of Object.entries(reihe)) {
      if (code.length !== 3) continue
      /*
        Das juengste **abgeschlossene** Jahr.

        Die WEO-Reihe laeuft Jahre voraus; ein Wert fuer 2030 waere eine
        Vorhersage, keine Kennzahl. Das laufende Jahr gehoert aus demselben
        Grund nicht dazu, auch wenn die Versuchung gross ist: Beim ersten Lauf
        kamen 183 von 191 Werten aus dem laufenden Jahr – eine Schaetzung fuer
        zwoelf Monate, von denen sieben noch nicht vorbei waren, hätte auf der
        Karte ausgesehen wie eine gemessene Groesse.
      */
      const passende = Object.entries(jahre)
        .map(([jahr, wert]) => ({ jahr: Number(jahr), wert: Number(wert) }))
        .filter(
          (eintrag) =>
            Number.isFinite(eintrag.jahr) &&
            Number.isFinite(eintrag.wert) &&
            eintrag.wert > 0 &&
            eintrag.jahr < aktuellesJahr
        )
        .sort((a, b) => b.jahr - a.jahr)
      if (passende.length > 0) {
        werte.set(code, {
          wert: Math.round(passende[0].wert * 10) / 10,
          jahr: passende[0].jahr,
        })
      }
    }
    console.log(`Schuldenquoten fuer ${werte.size} Laender geholt.`)
    return werte
  } catch (fehler) {
    console.log(
      `::warning::Schuldenquoten nicht erreichbar (${fehler instanceof Error ? fehler.message : fehler}) – vorheriger Stand bleibt.`
    )
    return null
  }
}

/**
 * Holt eine Reihe der Weltbank je Land, juengstes Jahr mit Wert.
 *
 * Abgefragt werden mehrere Jahrgaenge auf einmal (`date=2018:2025`), weil die
 * Reihen je Land unterschiedlich weit reichen: Fuer Deutschland liegt 2024
 * vor, fuer manche kleine Volkswirtschaft nur 2021. Ein fester Jahrgang haette
 * genau die Laender wieder herausgeworfen, um die es hier geht.
 *
 * Die Antwort ist ein Array aus zwei Elementen: erst ein Kopf mit der
 * Seitenzahl, dann die Zeilen. Ohne `per_page` liefert die Schnittstelle nur
 * fuenfzig Zeilen und verteilt den Rest auf Folgeseiten.
 */
/**
 * Wie eine Reihe zu behandeln ist.
 *
 * Beides ist am 6. August 2026 durch Schaden gelernt worden. Der erste Lauf
 * mit den Ratenreihen schrieb Arbeitslosenquoten als glatte ganze Zahlen –
 * 4 · 10 · 32 statt 3,5 · 10,4 · 32,1 – und haette bei Deflation gar nichts
 * geschrieben.
 */
interface Reihenart {
  /**
   * Nachkommastellen, auf die gerundet wird.
   *
   * Fuer Betraege in Dollar oder Personen ist 0 richtig: Eine
   * Nachkommastelle bei 43.812 US-Dollar taeuscht eine Genauigkeit vor, die
   * die Quelle nicht hat. Bei einer Rate zwischen 0 und 30 ist dieselbe
   * Rundung ein Fehler – aus 3,4 Prozent wird 3, und der Unterschied
   * zwischen Deutschland und Spanien schrumpft auf ganze Stufen.
   */
  stellen?: number
  /**
   * Ob null und negative Werte gueltig sind.
   *
   * Die Vorgabe verwirft sie, und das ist bei einem Bruttonationaleinkommen
   * richtig – ein Land mit −2 US-Dollar je Kopf gibt es nicht, so ein Wert
   * waere ein Fehler in der Quelle. Bei der Inflation ist ein negativer Wert
   * dagegen die Aussage selbst: fallende Preise.
   */
  auchNichtPositiv?: boolean
}

async function ladeWeltbankreihe(
  indikator: string,
  art: Reihenart = {}
): Promise<Map<string, { wert: number; jahr: number }> | null> {
  const { stellen = 0, auchNichtPositiv = false } = art
  const url = `${WELTBANK_BASIS}/${indikator}?format=json&per_page=20000&date=2018:2025`
  try {
    /*
      Drei Anlaeufe, nicht einer.

      Beim ersten Lauf mit vier gleichzeitigen Abfragen antwortete die
      Weltbank auf eine davon mit `400 Request Error` – eine XHTML-Seite, kein
      JSON. Die uebrigen drei liefen im selben Augenblick durch. Das ist keine
      falsche Adresse, sondern eine Schnittstelle unter Last, und ein
      Fehlschlag hiess bisher: die Kennzahl fehlt einen Monat lang ganz.
    */
    let antwort: Response | null = null
    for (const versuch of [1, 2, 3]) {
      antwort = await fetch(url, { headers: KOPFZEILEN })
      if (antwort.ok) break
      if (versuch < 3) {
        console.log(
          `Weltbank ${indikator}: Versuch ${versuch} ergab ${antwort.status} – neuer Anlauf in ${versuch * 5}s.`
        )
        await new Promise((fertig) => setTimeout(fertig, versuch * 5000))
      }
    }

    if (!antwort || !antwort.ok) {
      console.log(
        `::warning::Weltbank ${indikator} antwortete dreimal mit ${antwort?.status ?? '—'}${antwort ? await fehlerauszug(antwort) : ''} – bisheriger Stand bleibt.`
      )
      return null
    }

    const roh = (await antwort.json()) as unknown
    if (!Array.isArray(roh) || roh.length < 2 || !Array.isArray(roh[1])) {
      console.log(`::warning::Weltbank ${indikator}: unerwarteter Aufbau der Antwort.`)
      return null
    }

    const zeilen = roh[1] as {
      countryiso3code?: string
      date?: string
      value?: number | null
    }[]

    const werte = new Map<string, { wert: number; jahr: number }>()
    for (const zeile of zeilen) {
      const code = zeile.countryiso3code
      const jahr = Number(zeile.date)
      const wert = zeile.value
      if (!code || code.length !== 3 || KEINE_LAENDER.test(code)) continue
      if (!Number.isFinite(jahr)) continue
      if (typeof wert !== 'number' || !Number.isFinite(wert)) continue
      if (!auchNichtPositiv && wert <= 0) continue

      const faktor = 10 ** stellen
      const gerundet = Math.round(wert * faktor) / faktor
      const bisher = werte.get(code)
      if (!bisher || jahr > bisher.jahr) werte.set(code, { wert: gerundet, jahr })
    }

    if (werte.size === 0) {
      console.log(`::warning::Weltbank ${indikator}: keine verwertbare Zeile.`)
      return null
    }

    console.log(`Weltbank ${indikator}: ${werte.size} Laender.`)
    return werte
  } catch (fehler) {
    console.log(
      `::warning::Weltbank ${indikator} nicht erreichbar (${fehler instanceof Error ? fehler.message : fehler}) – bisheriger Stand bleibt.`
    )
    return null
  }
}

/**
 * Wechselkurse zum Jahresende, Euro zu Fremdwaehrung.
 *
 * Genommen wird der letzte Handelstag des jeweiligen Jahres. Ein
 * Jahresdurchschnitt waere die sauberere Wahl fuer Stromgroessen wie einen
 * Jahreslohn; ein Vermoegen ist aber ein Stichtagswert, und die Erhebungen
 * beziehen sich auf das Jahresende. Der Stichtagskurs passt also zur Groesse.
 */
async function ladeJahresendkurse(): Promise<Map<
  number,
  { datum: string; kurse: Record<string, number> }
> | null> {
  try {
    const antwort = await fetch(ECB_REIHE_URL, { headers: KOPFZEILEN })
    if (!antwort.ok) {
      console.log(
        `::warning::EZB antwortete mit ${antwort.status}${await fehlerauszug(antwort)} – Vermoegenswerte bleiben unveraendert.`
      )
      return null
    }

    const tage = parseEcbEnvelope(await antwort.text())
    if (tage.length === 0) {
      console.log('::warning::EZB-Reihe leer – Vermoegenswerte bleiben unveraendert.')
      return null
    }

    /*
      Je Jahr der spaeteste Tag – ausdruecklich per Datumsvergleich.

      Der erste Anlauf hat sich auf die Reihenfolge der Datei verlassen und
      angenommen, der juengste Tag komme zuerst. Er kommt zuletzt. Umgerechnet
      wurde damit zum Kurs des 2. Januar statt zum Jahresende, und bei
      Australien waren das 312.000 statt 344.000 Dollar – ein Unterschied von
      zehn Prozent, dem man die Ursache nicht ansieht.

      Ein Vergleich ist ein paar Zeichen mehr und haengt an nichts, was sich
      auf der Gegenseite aendern kann.
    */
    const jeJahr = new Map<number, { datum: string; kurse: Record<string, number> }>()
    for (const tag of tage) {
      const jahr = Number(tag.date.slice(0, 4))
      if (!Number.isFinite(jahr)) continue
      const bisher = jeJahr.get(jahr)
      if (!bisher || tag.date > bisher.datum) {
        jeJahr.set(jahr, { datum: tag.date, kurse: tag.rates })
      }
    }

    console.log(`Jahresendkurse fuer ${jeJahr.size} Jahre geholt.`)
    return jeJahr
  } catch (fehler) {
    console.log(
      `::warning::EZB-Reihe nicht erreichbar (${fehler instanceof Error ? fehler.message : fehler}) – Vermoegenswerte bleiben unveraendert.`
    )
    return null
  }
}

/**
 * Holt das Median-Reinvermoegen je Haushalt, umgerechnet in US-Dollar.
 *
 * ## Warum die Umrechnung ueber den Euro laeuft
 *
 * Die EZB veroeffentlicht Kurse immer als Euro zu Fremdwaehrung. Ein Wert in
 * australischen Dollar wird deshalb erst durch den AUD-Kurs geteilt – das
 * ergibt Euro – und dann mit dem USD-Kurs desselben Tages multipliziert. Beide
 * Kurse stammen aus einer Datei und einem Stichtag; ein Mischen von Quellen
 * oder Tagen entfaellt.
 *
 * ## Was dabei herausfaellt
 *
 * Waehrungen, die die EZB nicht fuehrt. Das betrifft von den 31 Laendern der
 * Datenbank genau eines: Chile. Eine zweite Kursquelle nur dafuer waere ein
 * schlechtes Geschaeft – sie muesste gepflegt, geprueft und erklaert werden,
 * fuer ein Land.
 */
async function ladeVermoegen(
  kurse: Map<number, { datum: string; kurse: Record<string, number> }> | null
): Promise<Map<string, { wert: number; jahr: number }> | null> {
  if (!kurse) return null

  try {
    const antwort = await fetch(OECD_VERMOEGEN_URL, { headers: OECD_KOPFZEILEN })
    if (!antwort.ok) {
      console.log(
        `::warning::OECD-Vermoegen antwortete mit ${antwort.status}${await fehlerauszug(antwort)} – bisheriger Stand bleibt.`
      )
      return null
    }

    const zeilen = parseCsv(await antwort.text())
    const aktuellesJahr = new Date().getUTCFullYear()
    const roh = new Map<string, { wert: number; jahr: number; waehrung: string }>()

    for (const zeile of zeilen) {
      if (zeile['MEASURE'] !== VERMOEGEN_FILTER.groesse) continue
      if (zeile['STATISTICAL_OPERATION'] !== VERMOEGEN_FILTER.rechnung) continue
      if (zeile['UNIT_MEASURE'] !== VERMOEGEN_FILTER.einheit) continue

      const code = zeile['REF_AREA']
      const jahr = Number(zeile['TIME_PERIOD'])
      const wert = Number(zeile['OBS_VALUE'])
      const waehrung = zeile['CURRENCY']
      if (!code || code.length !== 3 || KEINE_LAENDER.test(code)) continue
      if (!waehrung || waehrung.length !== 3) continue
      if (!Number.isFinite(jahr) || jahr > aktuellesJahr) continue
      if (!Number.isFinite(wert) || wert <= 0) continue

      const bisher = roh.get(code)
      if (!bisher || jahr > bisher.jahr) roh.set(code, { wert, jahr, waehrung })
    }

    if (roh.size === 0) {
      const spalten = Object.keys(zeilen[0] ?? {}).join(', ')
      console.log(
        `::warning::Keine Zeile mit ${VERMOEGEN_FILTER.groesse}/${VERMOEGEN_FILTER.rechnung}/${VERMOEGEN_FILTER.einheit} – bisheriger Stand bleibt.`
      )
      console.log(`  Zeilen: ${zeilen.length} | Spalten: ${spalten || '(keine)'}`)
      return null
    }

    const werte = new Map<string, { wert: number; jahr: number }>()
    const ohneKurs: string[] = []

    for (const [code, eintrag] of roh) {
      /*
        Kurse des Erhebungsjahres, nicht die von heute.

        Ein britischer Wert von 2017 mit dem Pfundkurs von 2026 umgerechnet
        waere eine Zahl, die es nie gab. Fehlt das Jahr in der Reihe, wird der
        Wert weggelassen – nicht mit einem anderen Jahr behelfsmaessig
        gerechnet.
      */
      const tag = kurse.get(eintrag.jahr)
      if (!tag) {
        ohneKurs.push(`${code} (Jahr ${eintrag.jahr})`)
        continue
      }

      const usd = tag.kurse['USD']
      if (!usd) {
        ohneKurs.push(`${code} (kein USD-Kurs)`)
        continue
      }

      // Der Euroraum selbst braucht keine Division – die Quelle steht schon
      // in Euro, und die EZB fuehrt den Euro nicht gegen sich selbst.
      const inEuro =
        eintrag.waehrung === 'EUR'
          ? eintrag.wert
          : eintrag.wert / (tag.kurse[eintrag.waehrung] ?? 0)

      if (!Number.isFinite(inEuro) || inEuro <= 0) {
        ohneKurs.push(`${code} (${eintrag.waehrung})`)
        continue
      }

      werte.set(code, { wert: Math.round(inEuro * usd), jahr: eintrag.jahr })
    }

    if (ohneKurs.length > 0) {
      console.log(`  Ohne Umrechnung geblieben: ${ohneKurs.join(', ')}`)
    }
    console.log(`Medianvermoegen fuer ${werte.size} Laender geholt und umgerechnet.`)
    return werte
  } catch (fehler) {
    console.log(
      `::warning::OECD-Vermoegen nicht erreichbar (${fehler instanceof Error ? fehler.message : fehler}) – bisheriger Stand bleibt.`
    )
    return null
  }
}

/**
 * Holt die Durchschnittsloehne, oder `null`, wenn die Quelle nicht antwortet.
 *
 * ## Warum hier strenger geprueft wird als beim IWF
 *
 * Die OECD liefert dieselbe Reihe in mehreren Einheiten: in Landeswaehrung, in
 * Landeswaehrung zu konstanten Preisen und kaufkraftbereinigt in US-Dollar.
 * Auf der Seite steht „US-Dollar im Jahr“. Griffe der Abruf versehentlich die
 * Reihe in Landeswaehrung, staende bei Japan eine Zahl in Millionenhoehe unter
 * der Ueberschrift US-Dollar – und bei Deutschland eine, die falsch ist, ohne
 * falsch auszusehen.
 *
 * Deshalb: Es zaehlen nur Zeilen mit genau der erwarteten Einheit. Findet sich
 * keine – etwa weil die OECD die Spalte umbenennt –, kommt nichts zurueck und
 * es bleibt beim vorherigen Stand. Lieber eine Luecke als eine falsche Zahl.
 *
 * ## Wozu die zweite Schranke
 *
 * Ein Jahreslohn liegt zwischen wenigen tausend und wenigen hunderttausend
 * Dollar. Alles ausserhalb ist keine Kennzahl, sondern ein Missverstaendnis –
 * ein Monatswert, ein Index oder eine Waehrung, die durchgerutscht ist.
 */
async function ladeLoehne(): Promise<Map<string, { wert: number; jahr: number }> | null> {
  try {
    const antwort = await fetch(OECD_LOEHNE_URL, { headers: OECD_KOPFZEILEN })
    if (!antwort.ok) {
      console.log(
        `::warning::OECD antwortete mit ${antwort.status}${await fehlerauszug(antwort)} – Durchschnittsloehne bleiben unveraendert.`
      )
      return null
    }

    const zeilen = parseCsv(await antwort.text())
    const aktuellesJahr = new Date().getUTCFullYear()
    const werte = new Map<string, { wert: number; jahr: number }>()

    for (const zeile of zeilen) {
      if (zeile['UNIT_MEASURE'] !== OECD_EINHEIT) continue
      const code = zeile['REF_AREA']
      const jahr = Number(zeile['TIME_PERIOD'])
      const wert = Number(zeile['OBS_VALUE'])
      if (!code || code.length !== 3 || KEINE_LAENDER.test(code)) continue
      if (!Number.isFinite(jahr) || jahr > aktuellesJahr) continue
      if (!Number.isFinite(wert) || wert < 3_000 || wert > 250_000) continue

      const bisher = werte.get(code)
      if (!bisher || jahr > bisher.jahr) werte.set(code, { wert: Math.round(wert), jahr })
    }

    if (werte.size === 0) {
      /*
        Was stattdessen dastand, gehört ins Protokoll.

        Die Antwort kam an, nur passte keine Zeile. Ohne die tatsächlich
        vorhandenen Einheiten und Spaltennamen bliebe als nächster Schritt
        wieder nur ein Versuch ins Blaue – mit ihnen ist es eine Zeile Arbeit.
      */
      const spalten = Object.keys(zeilen[0] ?? {}).join(', ')
      const einheiten = [...new Set(zeilen.map((z) => z['UNIT_MEASURE']).filter(Boolean))]
      console.log(
        `::warning::Keine Zeile mit Einheit ${OECD_EINHEIT} – Durchschnittsloehne bleiben unveraendert.`
      )
      console.log(`  Zeilen: ${zeilen.length} | Spalten: ${spalten || '(keine)'}`)
      console.log(`  Vorhandene Einheiten: ${einheiten.join(', ') || '(keine)'}`)
      return null
    }

    console.log(`Durchschnittsloehne fuer ${werte.size} Laender geholt.`)
    return werte
  } catch (fehler) {
    console.log(
      `::warning::Durchschnittsloehne nicht erreichbar (${fehler instanceof Error ? fehler.message : fehler}) – vorheriger Stand bleibt.`
    )
    return null
  }
}

/** Der vorherige Stand, damit ein fehlgeschlagener Abruf nichts loescht. */
async function ladeVorherigenStand(): Promise<Record<string, unknown> | null> {
  try {
    const { readFile } = await import('node:fs/promises')
    return JSON.parse(await readFile(ZIEL, 'utf8'))
  } catch {
    return null
  }
}

async function main() {
  console.log('Lade Weltbank-Reihen …')
  const [
    gdpRoh,
    popRoh,
    codesRoh,
    schulden,
    loehne,
    kurse,
    bne,
    bipKkp,
    arbeitslos,
    inflation,
    vorher,
  ] = await Promise.all([
    ladeCsv(GDP_URL),
    ladeCsv(POP_URL),
    ladeCsv(CODES_URL),
    ladeSchuldenquoten(),
    ladeLoehne(),
    ladeJahresendkurse(),
    ladeWeltbankreihe(EINKOMMENSREIHEN[0].indikator),
    ladeWeltbankreihe(EINKOMMENSREIHEN[1].indikator),
    // Eine Nachkommastelle, und bei der Inflation zaehlen negative Werte:
    // Deflation ist eine Aussage, kein Fehler in der Quelle.
    ladeWeltbankreihe(RATENREIHEN[0].indikator, { stellen: 1 }),
    ladeWeltbankreihe(RATENREIHEN[1].indikator, {
      stellen: 1,
      auchNichtPositiv: true,
    }),
    ladeVorherigenStand(),
  ])

  const gdp = zuReihe(gdpRoh)
  const pop = zuReihe(popRoh)

  /*
    Das jüngste Jahr, das beide Reihen kennen.

    Die Einwohnerreihe reicht üblicherweise ein Jahr weiter als die
    BIP-Reihe. Nähme man je Reihe das eigene Maximum, wäre das BIP pro Kopf
    das BIP eines Jahres geteilt durch die Bevölkerung eines anderen – ein
    Fehler, den man dem Ergebnis nicht ansieht.
  */
  // Braucht die Kurse und laeuft deshalb nach dem Buendel, nicht darin.
  const vermoegen = await ladeVermoegen(kurse)

  const jahr = Math.min(juengstesVollesJahr(gdp), juengstesVollesJahr(pop))
  console.log(`Gemeinsames Bezugsjahr: ${jahr}`)

  const gdpImJahr = werteImJahr(gdp, jahr)
  const popImJahr = werteImJahr(pop, jahr)

  // ISO-numerisch ist der Schlüssel der Kartengeometrie, Alpha-3 der der
  // Weltbank. Ohne diese Brücke ließe sich beides nicht verbinden.
  const codes = codesRoh
    .map((zeile) => ({
      alpha3: zeile['ISO3166-1-Alpha-3'],
      alpha2: zeile['ISO3166-1-Alpha-2'],
      numerisch: zeile['ISO3166-1-numeric'],
      region: zeile['Region Name'],
      subregion: zeile['Sub-region Name'],
      waehrung: zeile['ISO4217-currency_alphabetic_code'],
    }))
    .filter((zeile) => zeile.alpha3 && zeile.numerisch)

  const laender: Record<
    string,
    {
      alpha2: string
      numerisch: string
      region: string
      subregion: string
      waehrung: string
      bipUsd?: number
      einwohner?: number
      schuldenquote?: { wert: number; jahr: number }
      durchschnittsgehalt?: { wert: number; jahr: number }
      medianvermoegen?: { wert: number; jahr: number }
      bneProKopf?: { wert: number; jahr: number }
      bipProKopfKKP?: { wert: number; jahr: number }
      arbeitslosenquote?: { wert: number; jahr: number }
      inflation?: { wert: number; jahr: number }
    }
  > = {}

  const vorherigeLaender =
    (vorher?.laender as Record<
      string,
      {
        schuldenquote?: { wert: number; jahr: number }
        durchschnittsgehalt?: { wert: number; jahr: number }
        medianvermoegen?: { wert: number; jahr: number }
        bneProKopf?: { wert: number; jahr: number }
        bipProKopfKKP?: { wert: number; jahr: number }
        arbeitslosenquote?: { wert: number; jahr: number }
        inflation?: { wert: number; jahr: number }
      }
    >) ?? {}

  for (const code of codes) {
    const bip = gdpImJahr.get(code.alpha3)
    const einwohner = popImJahr.get(code.alpha3)
    laender[code.alpha3] = {
      alpha2: code.alpha2,
      numerisch: code.numerisch.padStart(3, '0'),
      region: code.region,
      subregion: code.subregion,
      waehrung: code.waehrung,
      // Auf volle Millionen beziehungsweise volle Personen gerundet: Die
      // Nachkommastellen der Quelle sind Artefakte der Umrechnung.
      ...(bip ? { bipUsd: Math.round(bip / 1_000_000) } : {}),
      ...(einwohner ? { einwohner: Math.round(einwohner) } : {}),
      // Neuer Wert, sonst der alte – nie eine Loeschung durch einen
      // fehlgeschlagenen Abruf.
      ...(() => {
        const neu = schulden?.get(code.alpha3)
        const alt = vorherigeLaender[code.alpha3]?.schuldenquote
        const gewaehlt = neu ?? alt
        return gewaehlt ? { schuldenquote: gewaehlt } : {}
      })(),
      ...(() => {
        const neu = loehne?.get(code.alpha3)
        const alt = vorherigeLaender[code.alpha3]?.durchschnittsgehalt
        const gewaehlt = neu ?? alt
        return gewaehlt ? { durchschnittsgehalt: gewaehlt } : {}
      })(),
      ...(() => {
        const neu = vermoegen?.get(code.alpha3)
        const alt = vorherigeLaender[code.alpha3]?.medianvermoegen
        const gewaehlt = neu ?? alt
        return gewaehlt ? { medianvermoegen: gewaehlt } : {}
      })(),
      ...(() => {
        const neu = bne?.get(code.alpha3)
        const alt = vorherigeLaender[code.alpha3]?.bneProKopf
        const gewaehlt = neu ?? alt
        return gewaehlt ? { bneProKopf: gewaehlt } : {}
      })(),
      ...(() => {
        const neu = bipKkp?.get(code.alpha3)
        const alt = vorherigeLaender[code.alpha3]?.bipProKopfKKP
        const gewaehlt = neu ?? alt
        return gewaehlt ? { bipProKopfKKP: gewaehlt } : {}
      })(),
      ...(() => {
        const neu = arbeitslos?.get(code.alpha3)
        const alt = vorherigeLaender[code.alpha3]?.arbeitslosenquote
        const gewaehlt = neu ?? alt
        return gewaehlt ? { arbeitslosenquote: gewaehlt } : {}
      })(),
      ...(() => {
        const neu = inflation?.get(code.alpha3)
        const alt = vorherigeLaender[code.alpha3]?.inflation
        const gewaehlt = neu ?? alt
        return gewaehlt ? { inflation: gewaehlt } : {}
      })(),
    }
  }

  const mitBip = Object.values(laender).filter((land) => land.bipUsd).length
  const mitEinwohnern = Object.values(laender).filter((land) => land.einwohner).length
  const mitSchulden = Object.values(laender).filter((land) => land.schuldenquote).length
  const mitLohn = Object.values(laender).filter((land) => land.durchschnittsgehalt).length
  const mitVermoegen = Object.values(laender).filter(
    (land) => land.medianvermoegen
  ).length
  const mitBne = Object.values(laender).filter((land) => land.bneProKopf).length
  const mitKkp = Object.values(laender).filter((land) => land.bipProKopfKKP).length
  const mitArbeitslos = Object.values(laender).filter(
    (land) => land.arbeitslosenquote
  ).length
  const mitInflation = Object.values(laender).filter((land) => land.inflation).length
  console.log(
    `${Object.keys(laender).length} Länder, davon ${mitBip} mit BIP, ${mitEinwohnern} mit Einwohnerzahl, ${mitSchulden} mit Schuldenquote, ${mitLohn} mit Durchschnittslohn, ${mitVermoegen} mit Medianvermoegen, ${mitBne} mit Einkommen je Kopf, ${mitKkp} mit Kaufkraft je Kopf, ${mitArbeitslos} mit Arbeitslosenquote und ${mitInflation} mit Inflation.`
  )

  if (mitBip < 150) {
    // Lieber abbrechen als eine halb gefüllte Momentaufnahme schreiben: Auf
    // der Karte sähe eine Lücke wie ein Land ohne Wirtschaft aus.
    throw new Error(`Nur ${mitBip} Länder mit BIP – das ist zu wenig, Abbruch.`)
  }

  const inhalt = {
    abgerufenAm: new Date().toISOString(),
    bezugsjahr: jahr,
    quelle: {
      label: 'Weltbank (NY.GDP.MKTP.CD, SP.POP.TOTL) über die offenen CSV-Spiegel',
      urls: [GDP_URL, POP_URL, CODES_URL],
    },
    schuldenQuelle: {
      label:
        'IWF, World Economic Outlook (GGXWDG_NGDP) über die Datamapper-Schnittstelle',
      url: 'https://www.imf.org/external/datamapper/GGXWDG_NGDP@WEO',
      abgrenzung:
        'Bruttoschuld des Gesamtstaats in Prozent des BIP. Eine einheitliche Abgrenzung für alle Länder – nicht deckungsgleich mit der Maastricht-Abgrenzung von Eurostat.',
    },
    lohnQuelle: {
      label: 'OECD, Durchschnittslöhne (AV_AN_WAGE) über die SDMX-Schnittstelle',
      url: 'https://data-explorer.oecd.org/vis?fs[0]=Topic%2C1%7CEmployment%23JOB%23%7CBenefits%252C%20earnings%20and%20wages%23JOB_BEW%23&pg=0&fc=Topic&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_EARNINGS%40AV_AN_WAGE',
      abgrenzung:
        'Durchschnittlicher Jahreslohn einer vollzeitbeschäftigten Person, kaufkraftbereinigt in US-Dollar. Brutto, vor Steuern und Abgaben. Nur OECD-Mitglieder – eine weltweite Reihe nach einheitlicher Abgrenzung gibt es offen nicht.',
    },
    vermoegenQuelle: {
      label:
        'OECD, Vermögensverteilungsdatenbank (Reinvermögen, Median) über die SDMX-Schnittstelle',
      url: 'https://data-explorer.oecd.org/vis?fs[0]=Topic%2C1%7CSociety%23SOC%23%7CInequality%23SOC_INE%23&df[ds]=dsDisseminateFinalDMZ&df[id]=DSD_WEALTH%40DF_WEALTH',
      abgrenzung:
        'Median des Reinvermögens je Haushalt – Vermögen abzüglich Schulden, in der Mitte der Verteilung. Von der Quelle in Landeswährung gemeldet und mit dem Referenzkurs der Europäischen Zentralbank zum Ende des jeweiligen Erhebungsjahres in US-Dollar umgerechnet. Das Erhebungsjahr steht an jedem Wert und reicht je Land von 2016 bis 2023.',
      umrechnung: {
        label: 'Europäische Zentralbank, Euro-Referenzkurse',
        url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
      },
    },
    einkommenQuelle: {
      label: 'Weltbank, World Development Indicators (NY.GNP.PCAP.CD, NY.GDP.PCAP.PP.CD)',
      url: 'https://data.worldbank.org/indicator/NY.GNP.PCAP.CD',
      abgrenzung:
        'Bruttonationaleinkommen je Kopf in US-Dollar nach der Atlas-Methode sowie Wirtschaftsleistung je Kopf zu Kaufkraftparitaeten. Beides ist kein Lohn: Es umfasst die gesamte Wertschoepfung einschliesslich Unternehmensgewinnen und Staatseinnahmen, geteilt durch die Einwohnerzahl. Genommen wird je Land das juengste Jahr mit Wert; das Jahr steht an jedem Eintrag.',
    },
    arbeitslosenQuelle: {
      label: 'Weltbank, World Development Indicators (SL.UEM.TOTL.ZS)',
      url: 'https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS',
      abgrenzung:
        'Arbeitslose in Prozent der Erwerbspersonen, Modellschaetzung der ILO. Keine nationale Meldung: Die Laender zaehlen nach verschiedenen Regeln, die ILO rechnet sie auf eine gemeinsame Abgrenzung um. Deshalb weicht der Wert von der Zahl ab, die im jeweiligen Land veroeffentlicht wird – das ist der Preis der Vergleichbarkeit, kein Fehler.',
    },
    inflationQuelle: {
      label: 'Weltbank, World Development Indicators (FP.CPI.TOTL.ZG)',
      url: 'https://data.worldbank.org/indicator/FP.CPI.TOTL.ZG',
      abgrenzung:
        'Verbraucherpreise, Veraenderung gegenueber dem Vorjahr in Prozent. Der Jahresdurchschnitt eines abgeschlossenen Jahres, nicht die Rate von heute – in einer Zeit fallender Inflation steht hier deshalb eine hoehere Zahl als in den Nachrichten. Der Warenkorb wird je Land national festgelegt und ist zwischen Laendern nicht deckungsgleich.',
    },
    laender,
  }

  /*
    Nur schreiben, wenn sich etwas geändert hat – der Zeitstempel zählt nicht.

    `abgerufenAm` ist bei jedem Lauf neu. Ohne diese Prüfung entstünde jeden
    Monat ein Commit, der nichts enthält als eine andere Uhrzeit, und bei
    einem Push auf `main` würde die Website ohne Grund neu gebaut. Genau
    dieser Fehler ist beim Kursabruf schon einmal aufgetreten.
  */
  const ohneZeitstempel = (wert: unknown) =>
    JSON.stringify(wert, (schluessel, inhalt) =>
      schluessel === 'abgerufenAm' ? undefined : inhalt
    )

  if (vorher && ohneZeitstempel(vorher) === ohneZeitstempel(inhalt)) {
    console.log(
      'Keine Änderung gegenüber der abgelegten Momentaufnahme – nichts geschrieben.'
    )
    return
  }

  await schreibe(ZIEL, `${JSON.stringify(inhalt, null, 2)}\n`)
  console.log(`Geschrieben: ${ZIEL}`)
}

async function schreibe(pfad: string, inhalt: string): Promise<void> {
  const { writeFile, mkdir } = await import('node:fs/promises')
  const { dirname } = await import('node:path')
  await mkdir(dirname(pfad), { recursive: true })
  await writeFile(pfad, inhalt, 'utf8')
}

main().catch((fehler) => {
  console.error(fehler)
  process.exit(1)
})

/*
  Macht die Datei zu einem Modul – siehe die gleiche Zeile in
  `scripts/fundamentaldaten-abrufen.ts`. Ohne `import` oder `export` gilt eine
  Datei als globales Skript, und dann kollidieren gleichnamige Konstanten
  zwischen zwei Abrufskripten.
*/
export {}
