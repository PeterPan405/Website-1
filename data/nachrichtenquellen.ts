/**
 * Die Quellen, aus denen ein Nachrichtenlauf schöpft – je Rubrik mehrere.
 *
 * ## Warum diese Liste überhaupt existiert
 *
 * Bis Juli 2026 suchte jeder Lauf seine Quellen neu. Das klingt flexibel und
 * ist es auch – bis eine Seite ihr Markup ändert. Dann kommt beim Abruf ein
 * Gerüst aus Menü und Fußzeile herein, der Statuscode ist 200, und die Ausgabe
 * wird still dünner: sechs Artikel statt neun, alle aus den zwei Quellen, die
 * noch gingen.
 *
 * Eine feste Liste macht diesen Ausfall sichtbar. `npm run quellenprobe` läuft
 * vor der Recherche, holt jede Adresse und sagt, welche heute Text liefert –
 * und welche Rubrik ganz ohne dasteht.
 *
 * ## Warum je Rubrik mehrere
 *
 * Damit der Ausfall einer Quelle kein Ausfall eines Themas ist. Die Reihenfolge
 * ist die Rangfolge: Was oben steht, wird zuerst genommen. Weiter unten stehen
 * die Ausweichquellen – nicht schlechter, aber weiter weg vom Original oder
 * mühsamer zu lesen.
 *
 * ## Was hier **nicht** hineingehört
 *
 * Einzelne Artikeladressen. Die ändern sich täglich; hier stehen Rubrik- und
 * Übersichtsseiten, die dauerhaft unter derselben Adresse liegen. Der Weg zur
 * einzelnen Meldung führt weiterhin über `WebSearch` – diese Liste beantwortet
 * die Frage davor: **Welcher Kanal ist heute überhaupt offen?**
 *
 * Und keine Seiten, deren Nutzungsbedingungen das Auslesen untersagen. Was hier
 * steht, sind Presse- und Rubrikseiten, die zum Lesen da sind; gelesen wird
 * daraus, zusammengefasst wird selbst, verlinkt wird immer.
 *
 * ## Jede Adresse ist abgerufen worden, keine geraten
 *
 * Stand 31. Juli 2026: alle achtzehn über `quellen-holen.yml` auf einem Läufer
 * geholt, alle achtzehn mit Status 200.
 *
 * Das ist keine Formalie. Der erste Entwurf dieser Liste bestand aus
 * plausiblen Adressen – und **sieben von siebzehn waren tot**: die EZB unter
 * `/press/pr/date/<jahr>/…` (404), die Deutsche Börse unter
 * `/dbg-de/media/pressemitteilungen` (404), onvista unter `/news/boerse`
 * (404), EQS unter `/de/news/` (404), die Rentenversicherung unter
 * `/DRV/DE/Presse/…` (404), der Bundesfinanzhof unter `pressemeldungen`
 * statt `pressemitteilungen` (404) und die IEA mit einer Bot-Sperre (403).
 *
 * Eine ungeprüfte Quellenliste ist schlimmer als keine: Sie sieht aus wie
 * Absicherung und ist eine zweite Fehlerquelle. Wer hier etwas einträgt,
 * ruft es vorher ab.
 */

export interface Nachrichtenquelle {
  /** Sprechender Name, wie er im Protokoll erscheint. */
  name: string
  /**
   * Die Adresse, die abgerufen wird.
   *
   * `{jahr}` wird beim Abruf durch das Jahr des Stichtags ersetzt. Derzeit
   * braucht es keine Quelle – die jahrgangsweise Adresse der EZB hat sich beim
   * Abruf als 404 erwiesen und ist durch die jahrgangsfreie ersetzt. Der
   * Platzhalter bleibt trotzdem, weil die Bauart wiederkommt: Eine Adresse mit
   * fest eingetragener Jahreszahl stirbt am 1. Januar, und zwar auf die
   * unauffälligste Art – sie antwortet weiter, nur eben mit dem Vorjahr.
   */
  adresse: string
  /**
   * Warum diese Quelle in dieser Rubrik steht – ein Halbsatz.
   *
   * Pflichtfeld, damit niemand eine Adresse hinzufügt, deren Zweck er nicht
   * benennen kann. Eine Liste ohne Begründung wächst, bis sie niemand mehr
   * durchsieht.
   */
  wofuer: string
  /**
   * `true`, wenn es eine Primärquelle ist – die Stelle, die die Zahl selbst
   * veröffentlicht, statt über sie zu berichten.
   *
   * Steht im Protokoll dabei, weil es die Rangfolge begründet: Eine Zahl vom
   * Statistischen Bundesamt ist dieselbe Zahl wie im Portal, nur ohne den
   * Übertragungsfehler dazwischen.
   */
  primaer: boolean
}

export interface Quellenrubrik {
  /** Thema, unter dem die Quellen zusammenstehen. */
  rubrik: string
  /** Was diese Rubrik zur Ausgabe beiträgt. */
  zweck: string
  /** In der Reihenfolge der Bevorzugung. */
  quellen: Nachrichtenquelle[]
}

export const nachrichtenquellen: Quellenrubrik[] = [
  {
    rubrik: 'Geldpolitik',
    zweck: 'Zinsentscheide, Protokolle und Reden der Notenbanken.',
    quellen: [
      {
        name: 'EZB – Pressebereich',
        adresse: 'https://www.ecb.europa.eu/press/html/index.en.html',
        wofuer: 'Zinsbeschlüsse und geldpolitische Erklärungen im Wortlaut.',
        primaer: true,
      },
      {
        name: 'Deutsche Bundesbank – Pressenotizen',
        adresse: 'https://www.bundesbank.de/de/presse/pressenotizen',
        wofuer: 'Deutsche Sicht auf dieselben Beschlüsse, dazu Bankenstatistik.',
        primaer: true,
      },
      {
        name: 'Federal Reserve – Press Releases',
        adresse: 'https://www.federalreserve.gov/newsevents/pressreleases.htm',
        wofuer: 'FOMC-Beschlüsse und Erklärungen.',
        primaer: true,
      },
    ],
  },
  {
    rubrik: 'Konjunktur',
    zweck: 'Inflation, Arbeitsmarkt, Stimmungsindizes, Wachstum.',
    quellen: [
      {
        name: 'ifo Institut – Pressemitteilungen',
        adresse: 'https://www.ifo.de/pressemitteilungen',
        wofuer: 'Geschäftsklimaindex und Konjunkturprognosen.',
        primaer: true,
      },
      {
        name: 'Eurostat – Euro-Indikatoren',
        adresse: 'https://ec.europa.eu/eurostat/web/main/news/euro-indicators',
        wofuer: 'Inflation und Arbeitslosigkeit für den Euroraum.',
        primaer: true,
      },
      {
        /*
          Steht bewusst an dritter Stelle, obwohl es die beste Quelle wäre.

          Die Seite antwortet mit 200 und liefert rund 600 Zeichen: Menü,
          Anschrift, Fußzeile. Die Mitteilungen selbst kommen per JavaScript
          nach. Genau der Fall, für den es diese Prüfung gibt – sie meldet die
          Quelle als „leer“, und die Rubrik lebt von den beiden darüber.
        */
        name: 'Statistisches Bundesamt – Pressemitteilungen',
        adresse: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/_inhalt.html',
        wofuer: 'Verbraucherpreise, Arbeitsmarkt, Außenhandel – die Zahlen selbst.',
        primaer: true,
      },
    ],
  },
  {
    rubrik: 'Märkte und Indizes',
    zweck: 'Tagesverlauf an den Börsen, Ausschläge einzelner Werte.',
    quellen: [
      {
        name: 'onvista – Nachrichten',
        adresse: 'https://www.onvista.de/news/',
        wofuer: 'Tagesberichte mit Kursständen, Uhrzeit und Datum je Meldung.',
        primaer: false,
      },
      {
        name: 'finanzen.net – Nachrichten',
        adresse: 'https://www.finanzen.net/nachrichten/',
        wofuer: 'Breite Meldungslage, dazu eine Kursleiste mit Tagesständen.',
        primaer: false,
      },
      {
        name: 'wallstreet-online – Nachrichten',
        adresse: 'https://www.wallstreet-online.de/nachrichten',
        wofuer: 'Ausweichquelle für Tagesberichte.',
        primaer: false,
      },
    ],
  },
  {
    rubrik: 'Rohstoffe',
    zweck: 'Öl, Gas, Gold und Industriemetalle.',
    quellen: [
      {
        name: 'US Energy Information Administration – Today in Energy',
        adresse: 'https://www.eia.gov/todayinenergy/',
        wofuer: 'Lagerbestände und Preise für Öl und Gas, amtlich.',
        primaer: true,
      },
      {
        name: 'LBMA – Edelmetallpreise',
        adresse: 'https://www.lbma.org.uk/prices-and-data/precious-metal-prices',
        wofuer: 'Die Londoner Referenzpreise für Gold und Silber, an der Quelle.',
        primaer: true,
      },
      {
        name: 'Goldreporter',
        adresse: 'https://www.goldreporter.de/',
        wofuer: 'Edelmetallpreise mit Uhrzeit und deutschsprachiger Einordnung.',
        primaer: false,
      },
    ],
  },
  {
    rubrik: 'Unternehmen',
    zweck: 'Quartalszahlen, Zusammenschlüsse, Kapitalmaßnahmen.',
    quellen: [
      {
        name: 'EQS News',
        adresse: 'https://www.eqs-news.com/',
        wofuer: 'Pflichtmeldungen deutscher Emittenten im Wortlaut.',
        primaer: true,
      },
      {
        name: 'Deutsche Börse – Media',
        adresse: 'https://www.deutsche-boerse.com/dbg-de/media',
        wofuer: 'Meldungen des Börsenbetreibers, Indexänderungen.',
        primaer: true,
      },
      {
        name: 'Börse Frankfurt – Nachrichten',
        adresse: 'https://www.boerse-frankfurt.de/nachrichten',
        wofuer: 'Ausweichquelle für Unternehmens- und Ad-hoc-Meldungen.',
        primaer: false,
      },
    ],
  },
  {
    rubrik: 'Vorsorge und Steuern',
    zweck: 'Rente, Sozialversicherung, Steuerrecht – der langsamere Teil.',
    quellen: [
      {
        name: 'Bundesfinanzministerium – Pressemitteilungen',
        adresse:
          'https://www.bundesfinanzministerium.de/Web/DE/Presse/Pressemitteilungen/pressemitteilungen.html',
        wofuer: 'Gesetzentwürfe und BMF-Schreiben zum Steuerrecht.',
        primaer: true,
      },
      {
        name: 'Deutsche Rentenversicherung – Presse',
        adresse:
          'https://www.deutsche-rentenversicherung.de/DRV/DE/Ueber-uns-und-Presse/Presse/presse_node.html',
        wofuer: 'Rentenanpassung, Beitragssätze, Statistik.',
        primaer: true,
      },
      {
        name: 'Bundesfinanzhof – Pressemitteilungen',
        adresse: 'https://www.bundesfinanzhof.de/de/presse/pressemitteilungen/',
        wofuer: 'Urteile, die für Anleger eine Rolle spielen.',
        primaer: true,
      },
    ],
  },
]

/** Setzt das Jahr des Stichtags in eine Adresse mit `{jahr}` ein. */
export function adresseFuer(quelle: Nachrichtenquelle, tag: string): string {
  return quelle.adresse.replaceAll('{jahr}', tag.slice(0, 4))
}

export function assertQuellenValid(rubriken: readonly Quellenrubrik[]): void {
  const probleme: string[] = []
  const gesehen = new Map<string, string>()

  for (const rubrik of rubriken) {
    if (rubrik.quellen.length < 2) {
      probleme.push(
        `Rubrik „${rubrik.rubrik}“ hat nur ${rubrik.quellen.length} Quelle(n). ` +
          'Ohne Ausweichquelle ist die Rubrik beim ersten Markup-Umbau weg.'
      )
    }
    for (const quelle of rubrik.quellen) {
      if (!quelle.adresse.startsWith('https://')) {
        probleme.push(`„${quelle.name}“: Adresse ist kein https.`)
      }
      const vorher = gesehen.get(quelle.adresse)
      if (vorher) {
        probleme.push(
          `Adresse doppelt: ${quelle.adresse} steht in „${vorher}“ und in „${rubrik.rubrik}“.`
        )
      } else {
        gesehen.set(quelle.adresse, rubrik.rubrik)
      }
      if (quelle.wofuer.trim() === '') {
        probleme.push(`„${quelle.name}“: ohne Begründung im Feld „wofuer“.`)
      }
    }
  }

  if (probleme.length > 0) {
    throw new Error(
      `Die Nachrichtenquellen sind fehlerhaft:\n  - ${probleme.join('\n  - ')}`
    )
  }
}

assertQuellenValid(nachrichtenquellen)
