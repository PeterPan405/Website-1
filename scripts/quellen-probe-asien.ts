/**
 * Klopft die Aufsichtsbehörden außerhalb von USA und EU ab.
 *
 * ## Was nach SEC und ESEF noch fehlt
 *
 * Rund 190 der 529 Aktien. Der Block verteilt sich auf fünf Länder, und jedes
 * hat seine eigene Aufsicht mit eigenem Format:
 *
 * - **Deutschland** – Allianz, BMW, BASF, Bayer, die Telekom. Sie melden an den
 *   Bundesanzeiger. Der taucht im ESEF-Verzeichnis nicht auf, obwohl die Pflicht
 *   auch für sie gilt: Die deutsche Sammelstelle gibt ihre Meldungen nicht an
 *   XBRL International weiter.
 * - **Japan** – EDINET, die Meldeplattform der Finanzaufsicht FSA.
 * - **Korea** – DART, geführt von der Finanzaufsicht FSS.
 * - **Taiwan** – die Börse selbst, TWSE, stellt offene Daten bereit.
 * - **Hongkong und Indien** – HKEX und BSE/NSE.
 *
 * ## Was diese Sonde beantworten soll
 *
 * Für jede Adresse dieselben drei Fragen: Antwortet sie ohne Schlüssel? Steht
 * dahinter eine Schnittstelle oder eine Website? Und liefert sie die fünf
 * Größen, um die es geht?
 *
 * Wo ein Schlüssel verlangt wird, ist das kein Scheitern, sondern ein Befund:
 * Ein kostenloser Schlüssel ist eine Entscheidung, die dem Betreiber dieser
 * Website zusteht – anders als das Nachbauen einer Zugangssperre, das hier
 * nicht in Frage kommt.
 *
 * Aufruf über `.github/workflows/quellen-probe.yml`.
 */

const KOPFZEILEN = {
  'User-Agent': 'IM-Invests Datenabruf pm252543@gmail.com',
  Accept: 'application/json, text/plain, */*',
}

interface Versuch {
  land: string
  name: string
  url: string
  /** Was die Adresse liefern soll, wenn sie funktioniert. */
  erwartung: string
}

const VERSUCHE: Versuch[] = [
  {
    land: 'Taiwan',
    name: 'TWSE, Gewinn- und Verlustrechnung börsennotierter Gesellschaften',
    url: 'https://openapi.twse.com.tw/v1/opendata/t187ap06_L_ci',
    erwartung: 'Umsatz und Gewinn je Unternehmen, mit Börsenkürzel',
  },
  {
    land: 'Taiwan',
    name: 'TWSE, Bilanz börsennotierter Gesellschaften',
    url: 'https://openapi.twse.com.tw/v1/opendata/t187ap07_L_ci',
    erwartung: 'Eigenkapital und Bilanzsumme je Unternehmen',
  },
  {
    land: 'Taiwan',
    name: 'TWSE, Grunddaten der Gesellschaften',
    url: 'https://openapi.twse.com.tw/v1/opendata/t187ap03_L',
    erwartung: 'Aktienzahl und Nennwert je Unternehmen',
  },
  {
    land: 'Japan',
    name: 'EDINET, Dokumentenliste (Fassung 2)',
    url: 'https://api.edinet-fsa.go.jp/api/v2/documents.json?date=2026-06-30&type=2',
    erwartung: 'Liste der an diesem Tag eingereichten Berichte',
  },
  {
    land: 'Japan',
    name: 'EDINET, Dokumentenliste (Fassung 1)',
    url: 'https://disclosure.edinet-fsa.go.jp/api/v1/documents.json?date=2026-06-30&type=2',
    erwartung: 'dieselbe Liste über die ältere Adresse',
  },
  {
    land: 'Korea',
    name: 'DART, Liste der Pflichtmeldungen',
    url: 'https://opendart.fss.or.kr/api/list.json?bgn_de=20260101&end_de=20260630',
    erwartung: 'Meldungen im Zeitraum – erwartet wird eine Schlüsselabfrage',
  },
  {
    land: 'Hongkong',
    name: 'HKEX, Verzeichnis der Meldungen',
    url: 'https://www1.hkexnews.hk/search/titlesearch.xhtml',
    erwartung: 'eine Suchmaske – vermutlich keine Schnittstelle',
  },
  {
    land: 'Indien',
    name: 'BSE, Ergebnismeldungen',
    url: 'https://api.bseindia.com/BseIndiaAPI/api/AnnGetData/w',
    erwartung: 'Meldungen – vermutlich mit Sperre gegen fremde Aufrufe',
  },
  {
    land: 'Deutschland',
    name: 'Unternehmensregister, Suche nach Rechnungslegung',
    url: 'https://www.unternehmensregister.de/ureg/api/rest/search',
    erwartung: 'Jahresabschlüsse – vermutlich keine offene Schnittstelle',
  },
  {
    land: 'Deutschland',
    name: 'Bundesanzeiger, Suchdienst',
    url: 'https://www.bundesanzeiger.de/pub/api/search',
    erwartung: 'dasselbe über die zweite Adresse',
  },
  {
    land: 'weltweit',
    name: 'GLEIF, Verzeichnis der Rechtsträgerkennungen',
    url: 'https://api.gleif.org/api/v1/lei-records?filter%5Bentity.legalName%5D=Allianz%20SE&page%5Bsize%5D=1',
    erwartung:
      'keine Bilanzzahlen, aber eine amtliche Kennung – der Schlüssel, mit dem sich Meldungen später eindeutig zuordnen ließen',
  },
]

interface Befund {
  land: string
  name: string
  status: number | string
  art: string
  probe: string
}

async function pruefe(versuch: Versuch): Promise<Befund> {
  try {
    const antwort = await fetch(versuch.url, {
      headers: KOPFZEILEN,
      signal: AbortSignal.timeout(30_000),
    })
    const typ = antwort.headers.get('content-type') ?? ''
    const text = (await antwort.text()).slice(0, 100_000)

    let art = 'unbekannt'
    if (typ.includes('json')) art = 'JSON'
    else if (typ.includes('html')) art = 'HTML – eine Website, keine Schnittstelle'
    else if (typ.includes('xml')) art = 'XML'

    /*
      Der Inhaltstyp allein reicht nicht: Manche Behörden liefern eine
      HTML-Fehlerseite mit dem Statuscode 200 und dem Inhaltstyp JSON. Deshalb
      wird zusätzlich versucht, das Ergebnis zu lesen.
    */
    let probe = text.replace(/\s+/g, ' ').slice(0, 300)
    if (art === 'JSON') {
      try {
        const gelesen: unknown = JSON.parse(text)
        if (Array.isArray(gelesen)) {
          probe = `Liste mit ${gelesen.length} Einträgen. Erster: ${JSON.stringify(gelesen[0]).slice(0, 400)}`
        } else {
          probe = JSON.stringify(gelesen).slice(0, 400)
        }
      } catch {
        art = 'als JSON angekündigt, aber nicht lesbar'
      }
    }

    return { land: versuch.land, name: versuch.name, status: antwort.status, art, probe }
  } catch (fehler) {
    return {
      land: versuch.land,
      name: versuch.name,
      status: 'Fehler',
      art: fehler instanceof Error ? fehler.message : String(fehler),
      probe: '',
    }
  }
}

async function main() {
  console.log('Quellen außerhalb von USA und EU\n')

  for (const versuch of VERSUCHE) {
    const befund = await pruefe(versuch)
    console.log(`\n── ${befund.land}: ${befund.name}`)
    console.log(`   ${versuch.url}`)
    console.log(`   Erwartet: ${versuch.erwartung}`)
    console.log(`   Status:   ${befund.status}  (${befund.art})`)
    if (befund.probe) console.log(`   Probe:    ${befund.probe}`)
    await new Promise((fertig) => setTimeout(fertig, 500))
  }

  console.log('\n\nZu lesen ist das so: Ein Status 200 mit JSON und einer Liste')
  console.log('darin ist eine brauchbare Quelle. Alles andere – 401, 403, HTML –')
  console.log('heißt entweder Schlüssel nötig oder keine Schnittstelle vorhanden.')
}

await main()

export {}
