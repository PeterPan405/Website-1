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

async function main() {
  console.log('Lade Weltbank-Reihen …')
  const [gdpRoh, popRoh, codesRoh] = await Promise.all([
    ladeCsv(GDP_URL),
    ladeCsv(POP_URL),
    ladeCsv(CODES_URL),
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
    }
  > = {}

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
    }
  }

  const mitBip = Object.values(laender).filter((land) => land.bipUsd).length
  const mitEinwohnern = Object.values(laender).filter((land) => land.einwohner).length
  console.log(
    `${Object.keys(laender).length} Länder, davon ${mitBip} mit BIP und ${mitEinwohnern} mit Einwohnerzahl.`
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
    laender,
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
