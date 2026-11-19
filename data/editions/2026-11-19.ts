import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-19.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-19 00:12 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-19',
  intro:
    'Anthropic startet an der Nasdaq, die Fed-Protokolle zeigen Streit um Dezember, und Commerzbank kommt der Übernahme näher.',
  top: [
    {
      headline: 'Anthropic geht an die Nasdaq – größter Börsengang der Geschichte',
      summary: [
        'Der KI-Entwickler Anthropic ist am Donnerstag mit einem Ausgabepreis von 83 Dollar je Aktie an die Nasdaq gegangen, unter dem Kürzel ANT. Das Unternehmen sammelte dabei 81,3 Milliarden Dollar ein und verkaufte rund 980 Millionen Aktien – deutlich mehr als die ursprünglich geplanten 825 Millionen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Ausgabepreis ist nur der erste Schritt: Wie teuer die Aktie tatsächlich wird, entscheidet erst der Handel am ersten Tag.',
      relatedTopics: ['boerse'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'CNBC, 18. November 2026, 23:44 Uhr MEZ: „Anthropic IPO raises over $81 billion in largest offering on record, topping SpaceX“',
          url: 'https://www.cnbc.com/2026/11/18/anthropic-ipo-ai-offering-price.html',
        },
      ],
    },
    {
      headline: 'Fed-Gouverneur Waller: Dezember braucht einen großen Zinsschritt',
      summary: [
        'Fed-Gouverneur Christopher Waller sagte am Mittwoch im Sender CNBC, die Notenbank müsse die Zinsen im Dezember wahrscheinlich um einen halben Prozentpunkt anheben. Das veröffentlichte Protokoll der Sitzung vom 27. und 28. Oktober zeigt zudem: Zwei Mitglieder stimmten bereits damals gegen die Entscheidung, den Leitzins bei 3,75 bis 4 Prozent zu halten, und wollten ihn direkt erhöhen.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein überraschend großer Zinsschritt würde die Finanzmärkte stärker bewegen als ein bereits erwarteter, weil er nicht in den Kursen eingepreist ist.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            "CNBC, 18. November 2026: „Fed's Waller says central bank may need to 'shock people' with half-point rate hike“",
          url: 'https://www.cnbc.com/2026/11/18/federal-reserve-governor-christopher-waller.html',
        },
        {
          label:
            'Federal Reserve, veröffentlicht 18. November 2026: „Minutes of the Federal Open Market Committee, October 27-28, 2026“',
          url: 'https://www.federalreserve.gov/monetarypolicy/fomcminutes20261028.htm',
        },
      ],
    },
    {
      headline: 'Bund und Unicredit verständigen sich über Commerzbank',
      summary: [
        'Die Bundesregierung und die italienische Unicredit haben sich einer Reuters-Meldung zufolge auf eine gemeinsame Basis für die Übernahme der Commerzbank verständigt. Finanzminister Lars Klingbeil sagte demnach nach einem Gespräch mit Unicredit-Chef Andrea Orcel: „Wir haben eine gemeinsame Basis gefunden.“ Eine zweite, unabhängige Quelle für diese Einigung lag zum Zeitpunkt dieses Berichts nicht vor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Für den deutschen Bankenmarkt entsteht ein Institut, das über Grenzen hinweg mit großen europäischen Häusern konkurrieren will.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['commerzbank', 'unicredit'],
      sources: [
        {
          label:
            'Handelsblatt, 18. November 2026, 23:13 Uhr (Reuters): „Banken: Bundesregierung und Unicredit einigen sich bei Commerzbank-Übernahme“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/banken-bundesregierung-und-unicredit-einigen-sich-bei-commerzbank-uebernahme/100271077.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Großbritannien: Inflation steigt auf Jahreshoch von 3,6 Prozent',
      summary: [
        'Die Inflationsrate in Großbritannien stieg im Oktober auf 3,6 Prozent, nach 3,5 Prozent im September. Das teilte das Statistikamt ONS am Mittwoch mit. Haupttreiber waren steigende Spritpreise und eine Tabaksteuererhöhung. Die Bank of England hatte den Leitzins Anfang November erstmals seit drei Jahren auf 4,00 Prozent angehoben und rechnet im Laufe des kommenden Jahres mit einer Inflation von fast fünf Prozent.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Je näher die Inflation am Fünf-Prozent-Ausblick der Notenbank liegt, desto wahrscheinlicher werden aus Sicht der Marktteilnehmer weitere Zinserhöhungen.',
      relatedTopics: ['inflation'],
      relatedSymbols: ['eur-gbp'],
      sources: [
        {
          label:
            'Office for National Statistics, 18. November 2026, 7:00 Uhr: „Consumer price inflation, UK: October 2026“',
          url: 'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/consumerpriceinflation/october2026',
        },
        {
          label:
            'Handelsblatt, 18. November 2026, 10:13 Uhr: „Großbritannien: Britische Inflation steigt auf Jahreshoch von 3,6 Prozent“',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/grossbritannien-britische-inflation-steigt-auf-jahreshoch-von-36-prozent/100270860.html',
        },
      ],
    },
    {
      headline: 'Target meldet stärkstes Umsatzwachstum seit fünf Jahren',
      summary: [
        'Der US-Einzelhändler Target meldete am Mittwoch für das dritte Quartal einen Umsatz von 27,1 Milliarden Dollar, ein Plus von 7,1 Prozent und das stärkste Wachstum seit mehr als fünf Jahren. Der Gewinn je Aktie lag bei 2,65 Dollar. Davon stammten nach Unternehmensangaben 0,50 Dollar aus einer einmaligen Rückerstattung von Zollzahlungen in Höhe von 301 Millionen Dollar. Die Aktie stieg um rund 7 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein einmaliger Sondereffekt wie die Zoll-Rückerstattung hebt den Gewinn eines Quartals, sagt aber nichts über die wiederholbare operative Stärke aus.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['target'],
      sources: [
        {
          label:
            'Target Corporation, Pressemitteilung vom 18. November 2026: „Target Corporation Reports Third Quarter Earnings“',
          url: 'https://corporate.target.com/press/release/2026/11/target-corporation-reports-third-quarter-earnings',
        },
        {
          label:
            'CNBC, 18. November 2026: „Target shares rise 7% as retailer posts best sales growth in five years, hikes guidance“',
          url: 'https://www.cnbc.com/2026/11/18/target-tgt-q3-2026-earnings.html',
        },
      ],
    },
  ],
}
