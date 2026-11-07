import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-07.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-07 00:13 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-07',
  intro:
    'Der Dax fällt vom Rekord, Asiens Chipbörsen stürzen stärker ab, US-Jobdaten überraschen, und die EZB bekommt einen zweiten Kandidaten für die Lagarde-Nachfolge.',
  top: [
    {
      headline: 'Dax fällt weiter, Asiens Chipbörsen brechen ein',
      summary: [
        'Der Dax hat sein Rekordhoch vom Donnerstag nicht gehalten. Er schloss am Freitag bei 25.820 Punkten, ein Minus von 1,9 Prozent, meldet Handelsblatt.',
        'In Asien traf es Chipwerte härter. Japans Nikkei schloss knapp sechs Prozent im Minus. Südkoreas Kospi verlor zum Handelsschluss sechs Prozent. An der Wall Street erholten sich Dow Jones und Nasdaq 100 dagegen leicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Index mit wenigen schwergewichtigen Branchen wie Halbleitern schwankt stärker als ein breit gestreuter – ein Tagesverlust sagt mehr über die Indexzusammensetzung als über eine Volkswirtschaft.',
      relatedTopics: ['boerse', 'risiko-und-rendite'],
      relatedSymbols: ['dax', 'nikkei-225', 'kospi'],
      sources: [
        {
          label:
            'Handelsblatt, 6.11.2026, 18:18 Uhr: „Dax aktuell: Dax schließt im Minus und fällt weit von Rekord zurück – Rüstungsaktie verliert"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-sackt-trotz-stabiler-chip-werte-fast-600-punkte-ab/100267806.html',
        },
        {
          label:
            'Handelsblatt, 6.11.2026, 07:13 Uhr: „Nikkei, Kospi und Topix: Abverkauf bei Chipaktien erfasst Japan und Südkorea"',
          url: 'https://www.handelsblatt.com/finanzen/asiens-boersen-setzen-abschwung-von-chipaktien-in-den-usa-fort/100267767.html',
        },
      ],
    },
    {
      headline: 'US-Jobmarkt wächst kräftig, Langzeitarbeitslosigkeit steigt',
      summary: [
        'Die US-Wirtschaft hat im Oktober 165.000 neue Stellen geschaffen. Erwartet waren nur 65.000, meldet Goldreporter. Die Arbeitslosenquote sank auf 4,1 Prozent.',
        'Ein zweiter Wert zeigt mehr Schwäche. Arbeitslose suchten im Schnitt 27,1 Wochen nach einem Job, berichtet CNBC. Das ist die längste Dauer außerhalb der Pandemie seit zehn Jahren. 27,6 Prozent der Arbeitslosen waren mindestens ein halbes Jahr ohne Stelle.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Arbeitslosenquote ist ein Durchschnitt und verdeckt, wie lange einzelne Menschen ohne Arbeit bleiben – ein zweiter Blick auf die Verteilung zeigt oft ein anderes Bild als die Schlagzeile.',
      relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dow-jones'],
      sources: [
        {
          label:
            'CNBC, 6.11.2026, 20:11 Uhr: „A disturbing employment trend is hiding beneath the latest strong job numbers"',
          url: 'https://www.cnbc.com/2026/11/06/long-term-unemployment-october-jobs-report.html',
        },
        {
          label:
            'Goldreporter, 6.11.2026: „US-Arbeitsmarkt überrascht mit 165.000 neuen Stellen"',
          url: 'https://www.goldreporter.de/us-arbeitsmarkt-ueberrascht-mit-165-000-neuen-stellen/konjunktur/262896/',
        },
      ],
    },
    {
      headline: 'EZB-Nachfolge: Spanien nominiert Hernández de Cos',
      summary: [
        'Im Rennen um die EZB-Spitze gibt es jetzt zwei Kandidaten. Spanien nominierte Pablo Hernández de Cos, den Chef der Bank für Internationalen Zahlungsausgleich, berichtet Handelsblatt unter Berufung auf Reuters.',
        'Die Niederlande hatten bereits Klaas Knot vorgeschlagen. Die Euro-Finanzminister sichten beide Bewerbungen am Montag. Christine Lagarde verlässt die EZB laut Handelsblatt vorzeitig, am 7. Februar 2027.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wer die EZB führt, beeinflusst mit über Leitzinsen, die Kredite, Anleihen und Sparzinsen in der gesamten Eurozone verändern.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'Handelsblatt, 6.11.2026, 21:00 Uhr (Reuters): „EZB: Spanien nominiert Pablo Hernandez de Cos für Lagarde-Nachfolge"',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/ezb-spanien-nominiertpablo-hernandez-de-cos-fuer-lagarde-nachfolge/100267919.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Daimler Truck: Gewinn springt, Aufträge schwächeln',
      summary: [
        'Daimler Truck hat im dritten Quartal deutlich mehr verdient. Der Umsatz im Industriegeschäft stieg um 20 Prozent, das Ebit um 73 Prozent, meldet onvista. Getragen wurde das vom US-Geschäft, bestätigt die Tagesschau.',
        'Beim Auftragseingang hakt es dagegen. Das Unternehmen verbuchte 71.170 bestellte Fahrzeuge, weniger als erwartet. Ein Gewinn blickt zurück, ein Auftragseingang nach vorn.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein kräftiger Gewinn beschreibt das vergangene Quartal – ein schwacher Auftragseingang verrät eher, wie die kommenden Quartale für das Unternehmen aussehen könnten.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'onvista, 6.11.2026, 15:32 Uhr: „Daimler Truck: Das Gewinnplus verlangt Vorsicht"',
          url: 'https://www.onvista.de/news/2026/11-06-daimler-truck-das-gewinnplus-verlangt-vorsicht-40338625-19-26573515',
        },
        {
          label:
            'tagesschau.de, 6.11.2026, 10:13 Uhr: „Daimler Truck meldet deutlichen Gewinnsprung wegen USA-Geschäft"',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/daimlertruck-100.html',
        },
      ],
    },
    {
      headline: 'Anthropic: Zweifel an Zwei-Billionen-Bewertung wachsen',
      summary: [
        'Anthropics Börsengang sollte einmal bis zu zwei Billionen Dollar wert sein, berichtet Handelsblatt. Im Mai war das Start-up privat noch mit 965 Milliarden Dollar bewertet worden.',
        'Nach dem Tech-Ausverkauf ist die Stimmung gekippt. Einige Investoren halten laut CNBC nur noch 1 bis 1,25 Billionen Dollar für realistisch. Ein Investor nannte 1,5 Billionen Dollar „zu ambitioniert".',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Bewertung vor einem Börsengang ist das Ergebnis einer Verhandlung, keine feste Zahl – sie hängt von der Marktstimmung am Tag der Preisfestsetzung ab.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            "CNBC, 6.11.2026, 21:07 Uhr: „Investors brace for lower Anthropic valuation, calling $1.5 trillion a 'stretch'\"",
          url: 'https://www.cnbc.com/2026/11/06/investors-brace-for-anthropic-valuation-1point5-trillion-a-stretch.html',
        },
        {
          label:
            'Handelsblatt, 6.11.2026, 13:27 Uhr: „IPO: Vom Zwei-Billionen-Traum zum Preisnachlass: Das Dilemma hinter Anthropics Börsengang"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/boersengang-zweifel-an-bewertung-ipo-von-anthropic-koennte-sich-verzoegern/100267771.html',
        },
      ],
    },
  ],
}
