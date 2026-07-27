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

const GDP_URL = 'https://raw.githubusercontent.com/datasets/gdp/main/data/gdp.csv'
const POP_URL =
  'https://raw.githubusercontent.com/datasets/population/main/data/population.csv'
const CODES_URL =
  'https://raw.githubusercontent.com/datasets/country-codes/master/data/country-codes.csv'

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
  'https://sdmx.oecd.org/public/rest/data/OECD.ELS.SAE,DSD_EARNINGS@AV_AN_WAGE,1.0/all?format=csvfilewithlabels&dimensionAtObservation=AllDimensions'

/** Die Einheit, die gemeint ist – siehe `ladeLoehne`. */
const OECD_EINHEIT = 'USD_PPP'

const ZIEL = 'data/snapshots/laender.json'

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
    const antwort = await fetch(IWF_SCHULDEN_URL)
    if (!antwort.ok) {
      console.log(
        `::warning::IWF antwortete mit ${antwort.status} – Schuldenquoten bleiben unveraendert.`
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
        Das juengste Jahr bis einschliesslich heute.

        Die WEO-Reihe enthaelt Projektionen mehrere Jahre voraus. Ein Wert fuer
        2030 waere eine Vorhersage, keine Kennzahl – auf einer Karte ohne
        Jahresangabe waere das nicht zu erkennen.
      */
      const passende = Object.entries(jahre)
        .map(([jahr, wert]) => ({ jahr: Number(jahr), wert: Number(wert) }))
        .filter(
          (eintrag) =>
            Number.isFinite(eintrag.jahr) &&
            Number.isFinite(eintrag.wert) &&
            eintrag.wert > 0 &&
            eintrag.jahr <= aktuellesJahr
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
    const antwort = await fetch(OECD_LOEHNE_URL)
    if (!antwort.ok) {
      console.log(
        `::warning::OECD antwortete mit ${antwort.status} – Durchschnittsloehne bleiben unveraendert.`
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
      console.log(
        `::warning::Keine Zeile mit Einheit ${OECD_EINHEIT} gefunden – Durchschnittsloehne bleiben unveraendert.`
      )
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
  const [gdpRoh, popRoh, codesRoh, schulden, loehne, vorher] = await Promise.all([
    ladeCsv(GDP_URL),
    ladeCsv(POP_URL),
    ladeCsv(CODES_URL),
    ladeSchuldenquoten(),
    ladeLoehne(),
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
    }
  > = {}

  const vorherigeLaender =
    (vorher?.laender as Record<
      string,
      {
        schuldenquote?: { wert: number; jahr: number }
        durchschnittsgehalt?: { wert: number; jahr: number }
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
    }
  }

  const mitBip = Object.values(laender).filter((land) => land.bipUsd).length
  const mitEinwohnern = Object.values(laender).filter((land) => land.einwohner).length
  const mitSchulden = Object.values(laender).filter((land) => land.schuldenquote).length
  const mitLohn = Object.values(laender).filter((land) => land.durchschnittsgehalt).length
  console.log(
    `${Object.keys(laender).length} Länder, davon ${mitBip} mit BIP, ${mitEinwohnern} mit Einwohnerzahl, ${mitSchulden} mit Schuldenquote und ${mitLohn} mit Durchschnittslohn.`
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
