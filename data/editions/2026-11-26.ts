import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-26.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-26 00:17 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-26',
  intro:
    'USA kündigen neue Sonderzölle an, die US-Inflation zieht an, der EZB-Rat streitet über die Mindestreserve, der Euro fällt, der Dax rutscht unter 25.000.',
  top: [
    {
      headline: 'USA kündigen neue Sonderzölle gegen mehrere Handelspartner an',
      summary: [
        'Die US-Regierung kündigte neue Sonderzölle gegen 14 Handelspartner an.',
        'Betroffen sind unter anderem die Europäische Union und China.',
        'Auf EU-Waren soll ein Satz von 15 Prozent kommen, auf chinesische Waren von 20 Prozent.',
        'Die US-Regierung begründet die Zölle mit unfairen Handelspraktiken der betroffenen Länder.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Einfuhrzoll wird zuerst vom Importeur an der Grenze gezahlt, nicht vom Exportland – ob er beim Kunden oder in der Marge landet, zeigt sich erst an der Preisliste.',
      relatedTopics: ['wie-funktioniert-der-markt', 'aktien-laender-branchen'],
      relatedSymbols: ['dax', 'euro-stoxx-50', 'sp500'],
      sources: [
        {
          label: 'tagesschau.de, 25.11.2026, 16:18 Uhr',
          url: 'https://www.tagesschau.de/ausland/amerika/usa-zoelle-124.html',
        },
        {
          label: 'CNBC, 25.11.2026, 16:02 UTC',
          url: 'https://www.cnbc.com/2026/11/25/us-tariffs-trump-section-301.html',
        },
      ],
    },
    {
      headline: 'Fed-Bericht zeigt moderates Wachstum, Inflation bleibt hoch',
      summary: [
        'Das Beige Book der US-Notenbank meldet ein leichtes bis moderates Wachstum.',
        'Die Inflation in den USA bleibt dabei hartnäckig hoch.',
        'Der von der Fed bevorzugte Preisindex PCE stieg im Oktober auf 3,8 Prozent.',
        'Anleger rechnen deshalb eher mit einer weiteren Zinserhöhung als mit einer Senkung.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der PCE misst Inflation anders als die bekanntere Verbraucherpreisrate CPI, und ein höherer Zins wirkt wie ein höherer Abschlag auf künftige Unternehmensgewinne – das trifft Wachstumswerte stärker als Substanzwerte.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['sp500', 'nasdaq-100', 'dow-jones'],
      sources: [
        {
          label: 'Handelsblatt, 25.11.2026, 21:24 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/konjunktur-us-wirtschaft-waechst-laut-notenbank-bericht-leicht-bis-moderat/100272820.html',
        },
        {
          label: 'CNBC, 25.11.2026, 14:18 UTC',
          url: 'https://www.cnbc.com/2026/11/25/pce-inflation-report-october-2026.html',
        },
        {
          label: 'Handelsblatt, 25.11.2026, 14:41 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/us-konjunktur-inflationsmass-in-den-usa-steigt-weiter/100272700.html',
        },
      ],
    },
    {
      headline: 'EZB-Rat streitet über höhere Mindestreserve für Banken',
      summary: [
        'Der EZB-Rat streitet weiter über eine höhere Mindestreserve für Banken.',
        'Das Geld darauf bringt den Banken keine Zinsen.',
        'Eine Entscheidung könnte am 16. Dezember fallen.',
        'Nach Informationen des Handelsblatts gibt es intern weiterhin Gesprächsbedarf.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Eine unverzinste Mindestreserve ist für Banken entgangener Zinsertrag – steigt der Satz, sinkt die Marge der Institute, auch ohne dass sich der Leitzins selbst bewegt.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['deutsche-bank', 'euro-stoxx-50'],
      sources: [
        {
          label: 'FAZ, 25.11.2026, 18:03 Uhr',
          url: 'https://www.faz.net/aktuell/finanzen/finanzmarkt/ezb-diskutiert-hoehere-mindestreserve-fuer-banken-201716008.html',
        },
        {
          label: 'Handelsblatt, 25.11.2026, 11:59 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/ezb-streit-ueber-hoehere-mindestreserve-fuer-banken-schwelt-weiter/100271993.html',
        },
      ],
    },
    {
      headline: 'Euro fällt wegen des KI-Booms auf Tief seit anderthalb Jahren',
      summary: [
        'Der Euro ist zum Dollar auf den tiefsten Stand seit anderthalb Jahren gefallen.',
        'Als Grund nennt tagesschau.de den Kapitalstrom in US-Technologiewerte.',
        'Anleger parken ihr Geld verstärkt in Dollar-Anlagen, um vom KI-Boom der US-Börsen zu profitieren.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein schwacher Euro verteuert Importe aus den USA, hilft aber unabgesicherten Anlegern in US-Aktien und Dollar-ETFs über den Wechselkurs zu einem zusätzlichen Kursgewinn.',
      relatedTopics: ['waehrungen-wechselkurse'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label: 'tagesschau.de, 25.11.2026, 12:47 Uhr',
          url: 'https://www.tagesschau.de/wirtschaft/verbraucher/euro-dollar-ki-etf-sparer-100.html',
        },
      ],
    },
    {
      headline: 'Dax fällt unter 25.000 Punkte, S&P droht Nvidia mit Herabstufung',
      summary: [
        'Der Dax ist unter 25.000 Punkte gefallen.',
        'Das ist der tiefste Stand seit Ende Juni.',
        'Die Ratingagentur S&P droht Nvidia nach den Führungswirren an der Konzernspitze mit einer Herabstufung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Ratingagentur bewertet die Kreditwürdigkeit, nicht den Aktienkurs – eine Herabstufung würde vor allem künftige Anleihen von Nvidia teurer machen, unabhängig davon, wohin sich die Aktie bewegt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['dax', 'nvidia'],
      sources: [
        {
          label: 'Handelsblatt, 25.11.2026, 17:59 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-schliesst-auf-tiefstem-stand-seit-ende-juni/100272589.html',
        },
        {
          label: 'WirtschaftsWoche, 25.11.2026, 18:25 Uhr',
          url: 'https://www.wiwo.de/finanzen/boerse/boerse-dax-schliesst-nach-negativen-signalen-aus-den-usa-unter-25.000-punkten/100272595.html',
        },
        {
          label: 'Handelsblatt, 25.11.2026, 20:51 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/aktien/ratingagentur-sp-droht-nvidia-nach-fuehrungswirren-mit-herabstufung/100272817.html',
        },
      ],
    },
  ],
  further: [],
}
