import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-23.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-23 00:16 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-23',
  intro:
    'Meta investiert 135 Milliarden Dollar in KI und verliert trotzdem an der Börse, ein Drohnenangriff treibt den Ölpreis, und die Türkei senkt den Leitzins.',
  top: [
    {
      headline: 'Meta investiert 135 Milliarden Dollar in KI – Aktie fällt trotzdem',
      summary: [
        'Meta zieht beim Ausbau seiner KI-Infrastruktur die Zügel noch stärker an.',
        'Der Konzern plant Investitionen von mindestens 135 Milliarden Dollar.',
        'Finanziert wird das über eine neue Aktienklasse ohne Stimmrecht.',
        'Sie sichert Firmenchef Mark Zuckerberg die Kontrolle über den Konzern.',
        'Die Meta-Aktie verlor am Donnerstag trotzdem sieben Prozent.',
        'Auslöser war ein breiter Ausverkauf von Technologiewerten an der Wall Street.',
        'Der Nasdaq 100 gab rund 2,9 Prozent nach, der Dow Jones schloss nahezu unverändert.',
        'Die Rendite zehnjähriger US-Anleihen fiel dagegen unter 5 Prozent.',
        'Auch der Dax rutschte um 1,1 Prozent auf 25.372 Punkte ab.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Aktienklasse ohne Stimmrecht lässt Zuckerberg allein über den Kurs von Meta entscheiden, obwohl andere Aktionäre das Kapital für die milliardenschwere KI-Wette mittragen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['meta', 'nasdaq-100', 'dax'],
      sources: [
        {
          label:
            'tagesschau.de, Wirtschaft/Unternehmen, Antje Sieb, Meldung vom 22.10.2026, 07:25 Uhr: „Meta investiert mindestens 135 Milliarden Dollar in KI“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/meta-quartalszahlen-ki-investitionen-100.html',
        },
        {
          label:
            'Handelsblatt, Märkte/Marktberichte, Julius Stockheim/Antonia Mannweiler, Meldung vom 22.10.2026, 19:28 Uhr: „Wall Street: Abverkauf von Tech-Werten belastet Wall Street – Meta verliert sieben Prozent“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-abverkauf-von-tech-werten-belastet-wall-street-meta-verliert-sieben-prozent/100264154.html',
        },
      ],
    },
    {
      headline: 'Angriff auf Ölfeld in Saudi-Arabien treibt Brent auf Fünfmonatshoch',
      summary: [
        'Ein Ölfeld in Saudi-Arabien wurde am Donnerstag angegriffen.',
        'Eine Drohne traf das Aramco-Feld Shaiba, die Luftabwehr schoss sie ab.',
        'Nach Angaben der WirtschaftsWoche wurden zwei Menschen durch Trümmer getötet.',
        'Der Förderbetrieb lief nach Unternehmensangaben weiter.',
        'Am Markt stieg trotzdem die Sorge vor einem knapperen Ölangebot.',
        'Die Ölsorte Brent kletterte zeitweise auf fast 113 Dollar je Barrel.',
        'Das ist der höchste Stand seit Anfang Mai.',
        'Analysten warnten vor einer neuen Eskalation im Golf nach den US-Zwischenwahlen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Ölpreise wirken wie eine zusätzliche Abgabe auf Verbraucher und Unternehmen weltweit, weil sie Transport und Produktion gleichzeitig verteuern.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'dax'],
      sources: [
        {
          label:
            'WirtschaftsWoche, Finanzen, Sören Imöhl, Live-Ticker vom 22.10.2026, 09:59 Uhr: „Ölpreis aktuell: Ölpreise steigen deutlich nach Angriff auf Ölfeld in Saudi-Arabien“',
          url: 'https://www.wiwo.de/finanzen/oelpreis-aktuell-angriff-auf-oelfeld-in-saudi-arabien-oelpreis-ueber-112-dollar/100207502.html',
        },
        {
          label:
            'Handelsblatt, Märkte/Marktberichte, Leonidas Exuzidis, Meldung vom 22.10.2026, 15:56 Uhr: „Dax aktuell: Dax verliert mehr als 270 Punkte und schließt im Minus“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-verliert-mehr-als-270-punkte-und-schliesst-im-minus/100264123.html',
        },
      ],
    },
    {
      headline: 'CoreWeave-Absturz lässt Bondmarkt an KI-Finanzierung zweifeln',
      summary: [
        'CoreWeave steht im Zentrum der jüngsten KI-Korrektur.',
        'Die Aktie des KI-Cloud-Anbieters verlor im Oktober fast 30 Prozent.',
        'Seit ihrem Jahreshoch sind es rund 55 Prozent.',
        'Mehrere Analysten halten den Kursverlust für überzogen.',
        'Ihre Kursziele liegen im Schnitt rund 140 Prozent über dem aktuellen Kurs.',
        'Am Anleihemarkt wächst dagegen das Misstrauen.',
        'Die Preise für Kreditausfallversicherungen auf CoreWeave-Anleihen steigen deutlich.',
        'Solche Anleihen stecken laut WirtschaftsWoche auch in vielen Rentenfonds.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Preise für Kreditausfallversicherungen zeigen, dass der Anleihemarkt ein höheres Risiko einpreist, selbst wenn Analysten den Aktienkurs für übertrieben niedrig halten.',
      relatedTopics: ['aktie', 'schuldverschreibung'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'Handelsblatt, Märkte/Aktien, Andreas Neuhaus, Meldung vom 22.10.2026, 11:50 Uhr: „Nasdaq: Coreweave-Aktie bricht ein – Analysten halten das für ein Missverständnis“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/aktien/aktien-analysten-halten-kurseinbruch-von-coreweave-fuer-ein-missverstaendnis/100264117.html',
        },
        {
          label:
            "CNBC, Markets, Meldung vom 21.10.2026, 20:12 Uhr (MESZ): „CoreWeave's market confidence erodes as bond yields spike and stock sinks“",
          url: 'https://www.cnbc.com/2026/10/21/coreweaves-market-confidence-erodes-as-bond-yields-spike-stock-sinks.html',
        },
      ],
    },
    {
      headline: 'Barclays eröffnet Bankensaison mit Gewinnplus und Stellenabbau',
      summary: [
        'Barclays hat die Berichtssaison der europäischen Banken eröffnet.',
        'Die britische Bank meldete einen Gewinnanstieg.',
        'Trotzdem streicht Barclays 5000 Stellen, etwa 5 Prozent der Belegschaft.',
        'Als Grund nennt die Bank Kosteneinsparungen durch Künstliche Intelligenz.',
        'Barclays will bis 2027 mehr als 1,1 Milliarden Pfund einsparen.',
        'Auch Standard Chartered und die HSBC kündigten ähnlichen Stellenabbau an.',
        'Standard Chartered will über vier Jahre mehr als 7000 Stellen abbauen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Gewinne und ein Stellenabbau schließen sich nicht aus, wenn Technologie Arbeit ersetzt – ein Muster, das sich in der gesamten Bankenbranche zeigt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['ftse-100'],
      sources: [
        {
          label:
            'Handelsblatt, Banken/Versicherungen, Torsten Riecke (Reuters, Bloomberg), Meldung vom 22.10.2026, 12:14 Uhr: „Banken: Barclays streicht 5000 Stellen – trotz Gewinnplus“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/banken-barclays-streicht-5000-stellen-trotz-gewinnplus/100264135.html',
        },
      ],
    },
    {
      headline: 'Türkische Notenbank senkt Leitzins trotz hoher Inflation',
      summary: [
        'Die türkische Notenbank hat ihren Leitzins gesenkt.',
        'Sie senkte ihn am Donnerstag um einen Punkt auf 36 Prozent.',
        'Zuvor hatte sie den Zins fünf Sitzungen lang unverändert gelassen.',
        'Die Inflation im Land bleibt dabei weiterhin sehr hoch.',
        'Im September lag die Teuerungsrate bei 29,73 Prozent.',
        'Die Notenbank wertet den jüngsten Rückgang offenbar als stabil genug für eine vorsichtige Lockerung.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein Leitzins unter der Inflationsrate bedeutet einen negativen Realzins – Sparguthaben in türkischer Lira verlieren dadurch weiter an Kaufkraft.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, Geldpolitik, Reuters, Meldung vom 22.10.2026, 12:14 Uhr: „Geldpolitik: Türkische Zentralbank senkt Leitzins nach längerer Pause“',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/geldpolitik-tuerkische-zentralbank-senkt-leitzins-nach-laengerer-pause/100264256.html',
        },
      ],
    },
  ],
  further: [],
}
