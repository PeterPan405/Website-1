import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-09.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-09 00:10 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-09',
  intro:
    'Nvidia prüft einen Spionagevorwurf gegen Chef Jensen Huang, Huthi greifen Riad an, und Tesla stellt die Cybertruck-Produktion in Texas ein.',
  top: [
    {
      headline: 'Nvidia-Vorstand prüft Spionagevorwurf gegen Jensen Huang',
      summary: [
        'Nvidia-Chef Jensen Huang hat seinen Mitarbeitern per E-Mail mitgeteilt, er habe eine außereheliche Beziehung gehabt. Das berichtet CNBC unter Berufung auf die Nachricht an die Belegschaft.',
        'Der Verwaltungsrat von Nvidia hat deshalb eine Untersuchung eingeleitet. Geprüft wird der Vorwurf, die betroffene Frau könnte für einen ausländischen Geheimdienst spioniert haben. Auch die Nachrichtenagentur dpa-AFX berichtete am Sonntagabend über die Vorwürfe.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Nvidia gehört zu den größten und einflussreichsten Technologiekonzernen der Welt – Fragen zur Führungsspitze ziehen deshalb besondere Aufmerksamkeit von Investoren auf sich.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            "CNBC, 8.11.2026, 23:53 Uhr: „Nvidia investigates CEO Jensen Huang's relationship with alleged Chinese spy“",
          url: 'https://www.cnbc.com/2026/11/08/nvidia-jensen-huang-investigation-china-spy.html',
        },
        {
          label:
            'onvista, News-Ticker (dpa-AFX) vom 8.11.2026, 20:27 Uhr: „Nvidia prüft Berichte zu ausländischer Spionage gegen Chef“',
          url: 'https://www.onvista.de/news/2026/11-08-nvidia-prueft-berichte-zu-auslaendischer-spionage-gegen-chef-0-10-26573925',
        },
      ],
    },
    {
      headline:
        'Huthi greifen Riad an, USA halten neue Angriffe im Iran für unwahrscheinlich',
      summary: [
        'Huthi-Rebellen aus dem Jemen griffen nach Angaben der Nachrichtenagentur dpa-AFX einen Wolkenkratzer im Zentrum der saudischen Hauptstadt Riad an. Zu Schäden oder Verletzten lagen zunächst keine Angaben vor.',
        'US-Präsident Trump sagte laut CNBC, neue amerikanische Angriffe auf Iran seien unwahrscheinlich, sollten die Gespräche über das iranische Atomprogramm und die Straße von Hormus Fortschritte machen. Er behalte sich aber weitere Schritte vor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Straße von Hormus bleibt zentral für den weltweiten Öltransport – jede neue Spannung in der Region gilt deshalb als Risikofaktor für den Ölpreis.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'onvista, News-Ticker (dpa-AFX) vom 8.11.2026, 19:28 Uhr: „WDH/ROUNDUP 2: Huthi greifen Wolkenkratzer im Zentrum von Riad an“',
          url: 'https://www.onvista.de/news/2026/11-08-wdh-roundup-2-huthi-greifen-wolkenkratzer-im-zentrum-von-riad-an-0-10-26573924',
        },
        {
          label:
            "CNBC, 8.11.2026, 22:53 Uhr: „Trump says renewed Iran strikes 'highly unlikely' if talks progress but warns he could still strike“",
          url: 'https://www.cnbc.com/2026/11/08/trump-iran-strikes-unlikely-talks-hormuz.html',
        },
      ],
    },
    {
      headline: 'Tesla stellt Cybertruck-Produktion in Texas ein',
      summary: [
        'Tesla will die Produktion des Cybertruck am Werk in Texas einstellen. Das Elektro-Pickup sollte Teslas Antwort auf beliebte US-Pickups sein, blieb aber laut Tagesschau hinter den Erwartungen zurück.',
        'Konzernchef Elon Musk will die freiwerdende Kapazität für ein anderes Produkt nutzen. Wann genau die Produktion endet und was an ihre Stelle tritt, ließ er bislang offen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein eingestelltes Modell bindet Kapital, das in der Fertigung bereits investiert wurde – wie viel davon sich noch amortisiert, hängt von der Nachnutzung der Fabrik ab.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['tesla'],
      sources: [
        {
          label:
            'tagesschau.de, 6.11.2026, 14:09 Uhr: „Tesla will Cybertruck-Produktion in Texas einstellen“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/tesla-produktion-cybertruck-100.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Demokraten wollen Trumps Zölle beenden, Ökonomen erwarten weiter Streit',
      summary: [
        'Der künftige Mehrheitsführer im US-Repräsentantenhaus, Hakeem Jeffries, hat laut CNBC die Zölle von Präsident Trump als eine der obersten Prioritäten der Demokraten im neuen Kongress genannt. Details zu einem möglichen Vorgehen nannte er zunächst nicht.',
        'Deutsche Ökonomen rechnen trotz des Machtwechsels nicht mit einem schnellen Ende des Zollstreits. Das berichtet die Tagesschau: Mehr Planbarkeit für Unternehmen sei möglich, ein Ende der Handelskonflikte aber nicht garantiert.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zölle wirken wie eine Steuer auf Importe und verändern Kosten für Unternehmen entlang ganzer Lieferketten – ihr Fortbestand oder Ende betrifft deshalb weit mehr als die beteiligten Handelspartner.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['sp500', 'dax'],
      sources: [
        {
          label:
            "CNBC, 8.11.2026, 16:36 Uhr: „How Democrats will try to end Trump's tariffs“",
          url: 'https://www.cnbc.com/2026/11/08/trump-tariffs-democrats-congress-canada.html',
        },
        {
          label:
            'tagesschau.de, 6.11.2026, 12:17 Uhr: „Welche Folgen die US-Midterms für die deutsche Wirtschaft haben“',
          url: 'https://www.tagesschau.de/wirtschaft/midterms-wirtschaft-handelspolitik-100.html',
        },
      ],
    },
    {
      headline: 'Lebensversicherer Frankfurter Leben kämpft mit Problemkrediten',
      summary: [
        'Der Lebensversicherer Frankfurter Leben hat laut Handelsblatt Hunderte Millionen Euro an den privaten Kreditmärkten verliehen. Ein Dutzend dieser Investments steckt den Angaben zufolge in finanziellen Schwierigkeiten.',
        'Das Unternehmen selbst erklärte, Verluste für Kunden seien nicht zu befürchten. Die Meldung liegt bislang nur von einer Quelle vor; eine unabhängige Bestätigung weiterer Redaktionen steht noch aus.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Lebensversicherer legen die Beiträge ihrer Kunden auch in privaten Kreditmärkten an – fällt dort ein Kredit aus, zeigt sich erst mit Verzögerung, wie stabil die Kapitalanlage des Versicherers tatsächlich ist.',
      relatedTopics: ['rente', 'schulden-und-kredit'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, 8.11.2026, 12:52 Uhr: „Versicherungen: Frankfurter Leben kämpft mit Problemfällen im Private-Credit-Portfolio“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/versicherer/versicherung-fehlgriffe-bei-privatmarkt-anlagen-belasten-frankfurter-leben/100263978.html',
        },
      ],
    },
  ],
}
