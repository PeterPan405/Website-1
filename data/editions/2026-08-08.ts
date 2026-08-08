import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-08.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-08 03:46 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-08',
  intro:
    'Ein schwacher US-Jobbericht schickt den DAX auf Rekordkurs, Gold steigt den dritten Tag, und zwei Großbanken verpacken den KI-Boom in Anleihekörbe.',
  top: [
    {
      headline: 'Schwacher US-Jobbericht schickt DAX und Wall Street auf Rekordkurs',
      summary: [
        "Nach der dpa-AFX-Meldung „US-Beschäftigung schrumpft überraschend - 'kalte Dusche'“ legten DAX, Dow Jones und US Tech 100 am Freitag zu, während auch Öl, Gold und Silber sich verteuerten.",
        'Der DAX schloss laut wallstreet-online bei 26.364,00 Punkten (+0,81 Prozent), der Dow Jones bei 54.036,10 Punkten (+0,25 Prozent).',
      ],
      category: 'Märkte',
      whyItMatters:
        'Schwache Konjunkturdaten senken die erwarteten Notenbankzinsen, und niedrigere Zinsen erhöhen rechnerisch den heutigen Wert künftiger Unternehmensgewinne – deshalb können enttäuschende Zahlen die Kurse heben.',
      relatedTopics: ['wie-funktioniert-der-markt', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dax', 'dow-jones'],
      sources: [
        {
          label:
            "wallstreet-online, „ROUNDUP: US-Beschäftigung schrumpft überraschend - 'kalte Dusche'“ (dpa-AFX, 7.8.2026), abgerufen 8.8.2026, 03:47 Uhr UTC",
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Trump erwägt laut Medienberichten erneut die Entlassung von Fed-Gouverneurin Lisa Cook',
      summary: [
        'finanzen.net und wallstreet-online berichteten am Freitag übereinstimmend, US-Medien zufolge erwäge Trump erneut die Entlassung von Fed-Gouverneurin Lisa Cook.',
        'Die Grundlage für den erneuten Vorstoß nennt keine der beiden abgerufenen Übersichten.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zweifel an der Unabhängigkeit einer Notenbank können sich in höheren Risikoprämien auf Staatsanleihen niederschlagen, weil Anleger künftig eine stärker politisch motivierte Geldpolitik einpreisen.',
      relatedTopics: ['notenbanken-geldpolitik', 'staatsanleihe'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 7.8.2026: „Fed unter Druck: Trump erwägt erneut Entlassung von Lisa Cook“, abgerufen 8.8.2026, 03:46 Uhr UTC',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'Gold steigt den dritten Tag in Folge, Privatanleger halten laut finanzen.net trotz Gewinnmitnahmen fest',
      summary: [
        'Goldreporter meldete am 7. August den dritten Anstiegstag in Folge und nannte neben dem Iran-Konflikt auch die erneute Yen-Schwäche als Faktor.',
        'finanzen.net berichtete am Samstagmorgen, Privatanleger blieben Gold trotz Gewinnmitnahmen treu; der Preis stand in der Kursleiste bei 4.342 US-Dollar, ein Plus von 2,4 Prozent.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein steigender Goldpreis allein zeigt nicht, ob ein Trend von neuem Kapital getragen wird – erst der Vergleich mit dem Verhalten verschiedener Anlegergruppen wie kurzfristigen Verkäufern und langfristigen Haltern liefert dieses Bild.',
      relatedTopics: ['rohstoffe', 'anlegerpsychologie'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, „Goldpreis aktuell: Gold steigt dritten Tag in Folge – Japan rückt in den Fokus“ vom 7.8.2026, abgerufen 8.8.2026, 03:47 Uhr UTC',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'Alphabet: Milliardenklagen drohen, während Anleger sich um KI-Anleihen reißen',
      summary: [
        'finanzen.net meldete am Freitag hohe Nachfrage nach Alphabets KI-Anleihen und am Samstagmorgen eine drohende neue Prozesswelle wegen einer EU-Kartellstrafe.',
        'Beide Meldungen nennen keine konkreten Beträge; sie zeigen aber, dass Aktien- und Anleihemarkt bei Alphabet derzeit unterschiedliche Fragen stellen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Anleihegläubiger prüfen vor allem, ob ein Unternehmen Zins und Tilgung bedienen kann, während Aktionäre auch strukturelle Risiken für künftige Gewinne einpreisen – deshalb können beide Märkte gleichzeitig unterschiedlich auf dieselbe Firma reagieren.',
      relatedTopics: ['schuldverschreibung', 'risiko-und-rendite'],
      relatedSymbols: ['alphabet'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 8.8.2026, 05:01 Uhr: „Alphabet-Aktie im Blick: Google drohen Milliardenklagen - EU-Kartellstrafe entfacht neue Prozesswelle“, abgerufen 8.8.2026, 03:46 Uhr UTC',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Goldman und JPMorgan bringen Handelskörbe für KI-Anleihen an den Markt',
      summary: [
        'Beide Banken bündeln laut finanzen.net Anleihen von Unternehmen mit KI-Bezug zu handelbaren Körben, während eine zweite Meldung nach der Cashflow-Belastung bei Amazon, SpaceX und Lucid fragt.',
        'Volumen der Körbe und Höhe der Cashflow-Belastung gehen aus den abgerufenen Überschriften nicht hervor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Handelskorb bündelt Einzelrisiken zu einem Produkt, ändert aber nichts daran, dass jede enthaltene Anleihe nur so werthaltig ist wie der Cashflow des Unternehmens, das sie ausgegeben hat.',
      relatedTopics: ['schuldverschreibung', 'schulden-und-kredit'],
      relatedSymbols: ['goldman-sachs', 'jpmorgan'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 8.8.2026, 05:32 Uhr: „Goldman und JPMorgan bringen Handelskörbe für KI-Anleihen an den Markt“, abgerufen 8.8.2026, 03:46 Uhr UTC',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Bank of America warnt: Bull-&-Bear-Indikator sendet Extremsignal',
      summary: [
        'Laut finanzen.net stuft Bank of America die Marktstimmung anhand ihres Bull-&-Bear-Indikators derzeit als extrem ein und warnt vor Euphorie am Aktienmarkt.',
        'Den genauen Indikatorstand nennt die abgerufene Übersicht nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Extreme Stimmungswerte gelten historisch als antizyklisches Warnsignal, weil bei fast einheitlich optimistischer Positionierung kaum noch neues Kapital nachziehen kann – sie sind aber ein Zeitpunkt der Beschreibung, keine Vorhersage.',
      relatedTopics: ['anlegerpsychologie', 'wann-kaufen-verkaufen'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 7.8.2026: „Bank of America warnt vor Euphorie am Aktienmarkt: Bull-&-Bear-Indikator sendet Extrem-Signal“, abgerufen 8.8.2026, 03:46 Uhr UTC',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Warren Buffett setzt hunderte Milliarden Dollar auf nur fünf Aktien',
      summary: [
        'finanzen.net berichtete über eine stark konzentrierte Positionierung von Warren Buffetts Berkshire Hathaway, angeführt von Apple.',
        'Die genaue Verteilung der Summe auf die fünf Positionen nennt die Meldung nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Konzentration ist das rechnerische Gegenteil von Diversifikation: Sie vergrößert die Bandbreite möglicher Ergebnisse in beide Richtungen und verlangt eine Analysetiefe, die die meisten Privatanleger nicht leisten können.',
      relatedTopics: ['portfolio-aufbau', 'risiko-und-rendite'],
      relatedSymbols: ['apple'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 8.8.2026, 04:13 Uhr: „Hunderte Milliarden US-Dollar, nur fünf Aktien: So radikal setzt Warren Buffett auf Apple-Aktien und Co“, abgerufen 8.8.2026, 03:46 Uhr UTC',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
