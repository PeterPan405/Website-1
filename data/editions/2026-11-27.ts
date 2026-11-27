import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-27.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-27 00:16 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-27',
  intro:
    'US-BIP wird kräftig nach oben korrigiert, Reallöhne wachsen langsamer, Unicredit krempelt die Commerzbank um, Chips überholen Öl, die EZB hat einen neuen Chef.',
  top: [
    {
      headline:
        'US-Wirtschaft wuchs im dritten Quartal deutlich stärker als zunächst gemeldet',
      summary: [
        'Das US-Handelsministerium hat das Wirtschaftswachstum im dritten Quartal von 3,4 auf 4,3 Prozent nach oben revidiert.',
        'Das ist die größte Korrektur seit dem zweiten Quartal 2020.',
        'Donald Trump nannte die Revision auf Truth Social einen Rekordfehler und forderte eine Untersuchung.',
        'Er warf den Statistikern vor, vor der Wahl zu niedrige Zahlen veröffentlicht zu haben.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die zweite von drei geplanten BIP-Schätzungen beruht auf mehr tatsächlichen Daten als die erste – eine Korrektur nach oben ist ein normaler Teil der Berechnung, kein Beleg für einen Fehler.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['sp500', 'dow-jones'],
      sources: [
        {
          label: 'Bureau of Economic Analysis, 25.11.2026, 8:30 Uhr ET',
          url: 'https://www.bea.gov/news/2026/gdp-second-estimate-and-corporate-profits-3rd-quarter-2026',
        },
        {
          label: 'CNBC, 26.11.2026, 21:13 Uhr',
          url: 'https://www.cnbc.com/2026/11/26/trump-gdp-revision-investigation.html',
        },
      ],
    },
    {
      headline: 'Deutsche Reallöhne wachsen im dritten Quartal nur noch langsam',
      summary: [
        'Die Reallöhne in Deutschland lagen im dritten Quartal 1,3 Prozent über dem Vorjahresquartal.',
        'Die Nominallöhne stiegen um 4,3 Prozent, die Verbraucherpreise um 2,9 Prozent.',
        'Das unterste Einkommensfünftel verzeichnete mit 6,6 Prozent den stärksten Zuwachs aller Gruppen.',
        'Es ist der schwächste Reallohnzuwachs seit Anfang 2025.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Nur die reale, um Inflation bereinigte Zahl zeigt, ob die Kaufkraft tatsächlich steigt – die nominale Lohnerhöhung allein sagt darüber nichts aus.',
      relatedTopics: ['inflation'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'Statistisches Bundesamt, Pressemitteilung Nr. 411, 26.11.2026',
          url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/11/PD26_411_62321.html',
        },
        {
          label: 'tagesschau.de, 26.11.2026, 11:59 Uhr',
          url: 'https://www.tagesschau.de/wirtschaft/arbeitsmarkt/loehne-wachstum-inflation-100.html',
        },
      ],
    },
    {
      headline:
        'Unicredit-Chef Orcel will den Aufsichtsrat der Commerzbank komplett umbauen',
      summary: [
        'Unicredit hat alle Genehmigungen für die Commerzbank-Übernahme beisammen.',
        'Konzernchef Andrea Orcel will selbst Aufsichtsratsvorsitzender werden und damit Jens Weidmann ablösen.',
        'Neun von zehn Anteilseigner-Vertretern im Aufsichtsrat sollen ausgetauscht werden.',
        'Eine außerordentliche Hauptversammlung dazu wird im Januar oder spätestens Anfang Februar 2027 erwartet.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer den Aufsichtsratsvorsitz übernimmt, wird nicht Vorstandschef, bekommt aber die Macht, über die Besetzung des Vorstands zu entscheiden – diese Zweiteilung ist typisch für deutsche Aktiengesellschaften.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'Handelsblatt, 26.11.2026, 10:38 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/unicredit-orcel-will-aufsichtsratschef-der-commerzbank-werden/100272891.html',
        },
        {
          label: 'FAZ.NET, 26.11.2026, 8:59 Uhr',
          url: 'https://www.faz.net/aktuell/finanzen/andrea-orcel-will-aufsichtsratschef-der-commerzbank-werden-anstelle-von-jens-weidmann-accg-201718811.html',
        },
      ],
    },
    {
      headline: 'Weltweiter Chiphandel überholt erstmals den Handel mit Öl und Gas',
      summary: [
        'Der globale Handel mit Halbleitern ist nach einer Analyse der Deutschen Bank größer als der mit Öl und Gas.',
        'Im ersten Quartal 2026 kamen Chipexporte auf rund 1,61 Billionen Dollar gegenüber 1,53 Billionen Dollar bei Öl und Gas.',
        'Im zweiten Quartal wuchs der Abstand auf 1,60 zu 1,47 Billionen Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Statistik misst gehandelte Warenwerte über Grenzen, keine Börsenkurse oder Unternehmensgewinne – der Vorsprung der Chipexporte sagt deshalb nichts über die Kursentwicklung einzelner Aktien aus.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label: 'CNBC, 26.11.2026, 17:52 Uhr',
          url: 'https://www.cnbc.com/2026/11/26/semiconductor-chips-are-the-new-oil-heres-why.html',
        },
        {
          label: 'Longbridge, 17.11.2026, 3:57 Uhr',
          url: 'https://longbridge.com/news/305702667',
        },
      ],
    },
    {
      headline: 'Spanier Hernández de Cos wird neuer EZB-Präsident',
      summary: [
        'Die EU-Staats- und Regierungschefs haben sich auf den Spanier Pablo Hernández de Cos als Nachfolger von Christine Lagarde geeinigt.',
        'De Cos leitet derzeit die Bank für Internationalen Zahlungsausgleich und war zuvor spanischer Zentralbankchef.',
        'Er tritt das Amt Anfang 2027 für acht Jahre an, Lagarde gibt im Februar ab.',
        'Der Deutsche Markus Brunnermeier soll zudem ab Mai neuer EZB-Chefvolkswirt werden.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Die Amtszeit des EZB-Präsidenten ist fest auf acht Jahre ohne Wiederwahl angelegt – das soll die Geldpolitik von politischen Wahlterminen unabhängig halten.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['euro-stoxx-50', 'eur-usd'],
      sources: [
        {
          label: 'Handelsblatt, 26.11.2026, 15:48 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/ezb-pablo-hernandez-de-cos-wird-neuer-chef-der-euro-notenbank/100272970.html',
        },
        {
          label: 'tagesschau.de, 26.11.2026, 18:28 Uhr',
          url: 'https://www.tagesschau.de/wirtschaft/ezb-chef-de-cos-100.html',
        },
      ],
    },
  ],
  further: [],
}
