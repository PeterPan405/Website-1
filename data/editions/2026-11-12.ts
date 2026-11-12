import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-12.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-12 00:19 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-12',
  intro:
    'Wirtschaftsweise heben die Wachstumsprognose an, Allianz und Siemens Energy feiern Rekordjahre – und Nvidias Vorstand berät über Jensen Huangs Zukunft.',
  top: [
    {
      headline: 'Wirtschaftsweise heben Wachstumsprognose deutlich an',
      summary: [
        'Der Sachverständigenrat erwartet für die deutsche Wirtschaft 2026 ein Wachstum von 1,3 Prozent und 2027 von 1,0 Prozent.',
        'Das sind 0,8 Prozentpunkte mehr als im Frühjahr vorhergesagt.',
        'Zugleich warnt das Gremium vor einer Finanzierungslücke im Bundeshaushalt von mindestens 2,4 Prozent des Bruttoinlandsprodukts und bringt eine Verteidigungsabgabe ins Spiel.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein höheres Wachstum allein schließt die Finanzierungslücke nicht, weil die Staatsausgaben strukturell schneller steigen als die Wirtschaft.',
      relatedTopics: ['schulden-und-kredit'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Tagesschau, 11.11.2026, 14:30 Uhr: „Wirtschaftsweise korrigieren Wachstumsprognose deutlich nach oben“',
          url: 'https://www.tagesschau.de/wirtschaft/konjunktur/wirtschaftsweise-jahresgutachten-2026-100.html',
        },
        {
          label:
            'Sachverständigenrat Wirtschaft, Pressemitteilung vom 11.11.2026: „Bundeshaushalt: Handlungsbedarf von historischem Ausmaß“',
          url: 'https://www.sachverstaendigenrat-wirtschaft.de/jahresgutachten-2026-pressemitteilung/kapitel-2.html',
        },
      ],
    },
    {
      headline: 'Allianz hebt Gewinnprognose nach Rekordergebnis an',
      summary: [
        'Die Allianz steigerte ihren operativen Gewinn in den ersten neun Monaten auf einen Rekordwert von 14,1 Milliarden Euro.',
        'Das sind eine Milliarde Euro mehr als im Vorjahreszeitraum und mehr, als Analysten im Schnitt erwartet hatten.',
        'Der Versicherer erhöhte deshalb die Obergrenze seiner Jahresprognose um 200 Millionen auf 18,6 Milliarden Euro.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass nur die Obergrenze steigt, zeigt, wie vorsichtig Versicherer ihre Prognosen auch bei Rekordergebnissen anpassen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['allianz'],
      sources: [
        {
          label:
            'Handelsblatt, News-Ticker vom 11.11.2026, 19:58 Uhr: „Versicherer: Allianz erhöht Gewinnprognose – Rekordgewinn nach neun Monaten“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/versicherung-allianz-erhoeht-gewinnprognose-rekordgewinn-nach-neun-monaten/100266550.html',
        },
        {
          label:
            'wallstreet-online, News-Ticker vom 11.11.2026, 19:45 Uhr: „Allianz blickt nach Rekordergebnis zuversichtlicher auf Gesamtjahr“',
          url: 'https://www.wallstreet-online.de/nachricht/21678057-allianz-blickt-rekordergebnis-zuversichtlicher-gesamtjahr',
        },
      ],
    },
    {
      headline: 'Siemens Energy verdoppelt Gewinn im Rekordjahr',
      summary: [
        'Siemens Energy steigerte sein operatives Ergebnis im abgelaufenen Geschäftsjahr auf 5,49 Milliarden Euro, mehr als doppelt so viel wie im Vorjahr.',
        'Die Erlöse kletterten um 15,5 Prozent auf 44,2 Milliarden Euro.',
        'Der Konzern hebt die Dividende von 70 Cent auf 2,30 Euro an und weitet Aktienrückkäufe bis 2030 auf 9 Milliarden Euro aus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die gleichzeitig steigende Dividende und ausgeweiteten Rückkäufe zeigen, wie zuversichtlich der Vorstand die künftige Nachfrage einschätzt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['siemens-energy'],
      sources: [
        {
          label:
            'Tagesschau, 11.11.2026, 09:23 Uhr: „Boom bei Windkraft und Rechenzentren beschert Siemens Energy Rekordjahr“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/siemens-bilanz-energie-strom-ki-100.html',
        },
        {
          label:
            'wallstreet-online, News-Ticker vom 11.11.2026, 09:36 Uhr: „Siemens Energy hebt ab: Rekord zum Greifen nah – diese Zahlen treiben den Dax an“',
          url: 'https://www.wallstreet-online.de/nachricht/21674658-siemens-energy-hebt-ab-rekord-greifen-nah-zahlen-treiben-dax',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'KI-Euphorie treibt die Wall Street kräftig an',
      summary: [
        'Dow Jones, S&P 500 und Nasdaq schlossen am Mittwoch deutlich im Plus, der Nasdaq 100 gewann fast 2,3 Prozent.',
        'Der Rechenzentrumsbetreiber CoreWeave sprang nach starken Quartalszahlen rund 25 Prozent.',
        'Zusätzlichen Schub gab ein Bericht, wonach die Banken hinter dem Anthropic-Börsengang eine Bewertung von rund 1,5 Billionen Dollar anstreben.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die „vollständig verwässerte“ Bewertung zählt auch Mitarbeiteroptionen hinzu und liegt deshalb über dem an der Börse gehandelten Wert.',
      relatedTopics: ['aktie', 'boerse'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'Handelsblatt, News-Ticker vom 11.11.2026, 18:56 Uhr: „Wall Street: KI-Euphorie ist zurück – Tech-Aktien schließen deutlich im Plus“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-ki-euphorie-ist-zurueck-tech-aktien-schliessen-deutlich-im-plus/100269138.html',
        },
        {
          label:
            'CNBC, News-Ticker vom 11.11.2026, 22:11 Uhr: „CoreWeave soars more than 24% for best day since April 2025 after strong Q3 report“',
          url: 'https://www.cnbc.com/2026/11/11/coreweave-crwv-outlook-earnings-ai.html',
        },
      ],
    },
    {
      headline: 'Nvidia-Vorstand berät über Huangs Zukunft',
      summary: [
        'Einem Bericht des „Wall Street Journal“ zufolge berät Nvidias Vorstand an diesem Donnerstag über eine mögliche Abberufung von Firmenchef Jensen Huang.',
        'Die Aktie fiel in der Nacht zu Donnerstag um bis zu neun Prozent auf 158 Dollar, das niedrigste Niveau seit Mitte 2025.',
        'Seit dem Rekordhoch Anfang Oktober hat Nvidia damit fast 30 Prozent und rund 1,8 Billionen Dollar an Börsenwert verloren.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Kursverlust zeigt, dass Vertrauen in die Unternehmensführung den Aktienkurs unabhängig von Umsatz und Gewinn bewegen kann.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 12.11.2026, 00:37 Uhr: „AKTIE IM FOKUS: Nvidia sackt nach Bericht über Chefablösung nachbörslich ab“',
          url: 'https://www.onvista.de/news/2026/11-11-aktie-im-fokus-nvidia-sackt-nach-bericht-ueber-chefabloesung-nachboerslich-ab-0-10-26575298',
        },
        {
          label:
            'CNBC, News-Ticker vom 12.11.2026, 00:28 Uhr: „Nvidia prepares to oust Jensen Huang, WSJ reports — stock sinks“',
          url: 'https://www.cnbc.com/2026/11/11/nvidia-jensen-huang-affair-employee.html',
        },
      ],
    },
  ],
}
