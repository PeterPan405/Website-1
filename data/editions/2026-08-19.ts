import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-19.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-19 01:57 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-19',
  intro:
    'Steigende US-Anleiherenditen treffen Technologiewerte hart, Großbritannien meldet um 8 Uhr gleich drei Preisindizes, Klarna stürzt trotz starkem Quartal.',
  top: [
    {
      headline: 'Anleiherenditen setzen Technologiewerte weltweit unter Druck',
      summary: [
        'Laut dpa-AFX schloss die Wall Street am Dienstag mit „Anleiherenditen setzen Techsektor unter Druck“, auch der EuroStoxx gab wegen schwacher Halbleiterwerte nach und der DAX zog laut onvista-Tagesrückblick mit.',
        'Heute früh gegen 3:57 Uhr zeigten finanzen.net und wallstreet-online übereinstimmend, dass Nasdaq beziehungsweise „US Tech 100“ deutlich stärker verlieren als der DAX – die genauen Prozentwerte weichen je nach Portal aber voneinander ab.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass steigende Zinsen zukunftslastige Wachstumswerte stärker treffen als den breiten Markt – ein Effekt, der jedes technologielastige Depot unterschiedlich stark betrifft.',
      relatedTopics: ['wie-funktioniert-der-markt', 'staatsanleihe'],
      relatedSymbols: ['nasdaq-100', 'dax'],
      sources: [
        {
          label:
            'dpa-AFX über onvista, News vom 18.8.2026, 20:27 Uhr: ROUNDUP/Aktien New York Schluss: Anleiherenditen setzen Techsektor unter Druck',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'finanzen.net, Kursleiste, Stand 19.8.2026, ca. 3:57 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Großbritannien meldet heute um 8 Uhr drei Preisindizes gleichzeitig',
      summary: [
        'Der Wirtschaftskalender von wallstreet-online nennt für 8:00 Uhr britische Erzeugerpreise, Verbraucherpreise und den Einzelhandelspreisindex – mit Prognosen, die in unterschiedliche Richtungen zeigen.',
        'Während die Verbraucherpreise (Monat) laut Prognose von 0,1 auf 0,3 Prozent anziehen sollen, wird bei den Erzeugerpreisen (Jahr) ein Rückgang von 3,5 auf 3,2 Prozent erwartet – eine Begründung für das Auseinanderlaufen liefert der Kalender nicht.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein konkreter Kalendertermin mit Uhrzeit, mit dem Leser gezielt in den Vormittag starten können, statt nur auf den Rückblick vom Vortag zu schauen.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['ftse-100'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender „Kommende Termine“, abgerufen 19.8.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Klarna bricht trotz starkem Quartal zweistellig ein',
      summary: [
        'Finanzen.net meldet, die Klarna-Aktie sei trotz eines starken Quartals wegen einer schwachen Umsatzprognose zweistellig eingebrochen – konkrete Prozent- oder Dollarzahlen nennt die Kurzmeldung nicht.',
        'Der Fall zeigt exemplarisch, wie stark der Ausblick eines Unternehmens den Kurs bewegen kann, selbst wenn die bereits berichteten Zahlen positiv ausfallen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erinnert daran, dass Märkte oft stärker auf die Guidance als auf die Vergangenheit reagieren – ein Muster, das bei jeder Berichtssaison wiederkehrt.',
      relatedTopics: ['risiko-und-rendite', 'wann-kaufen-verkaufen'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 18.8.2026: Klarna-Aktie bricht trotz starkem Quartal nach schwacher Umsatzprognose zweistellig ein',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'SAP steigt, obwohl Analysten das Potenzial begrenzt sehen',
      summary: [
        'Finanzen.net titelt, SAP steige, obwohl Analysten überwiegend zum Kauf raten, das weitere Potenzial aber als begrenzt gilt – Rating und Kursziel sind zwei getrennte Kennzahlen, die die Meldung selbst nicht beziffert.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Verdeutlicht, dass eine Kaufempfehlung allein nichts über die Höhe der erwarteten Rendite aussagt, solange das Kursziel fehlt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['sap'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 18.8.2026: SAP-Aktie steigt: Analysten überwiegend für Kauf - doch ist Potenzial begrenzt?',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Novo Nordisk erreicht Etappenziel beim Aktienrückkauf',
      summary: [
        'Finanzen.net meldet ein weiteres Etappenziel im laufenden Aktienrückkaufprogramm von Novo Nordisk, ohne Volumen oder Erreichungsgrad zu nennen – die Aktie reagierte laut Überschrift darauf.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein Rückkauf senkt die Aktienzahl und erhöht so rechnerisch den Gewinn je Aktie – ein Mechanismus, der sich von einer Dividendenausschüttung deutlich unterscheidet.',
      relatedTopics: ['aktie', 'portfolio-aufbau'],
      relatedSymbols: ['novo-nordisk'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 18.8.2026: Novo Nordisk erreicht beim Aktienrückkauf weiteres Etappenziel - So reagiert die Aktie',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Bridgewater verkauft Nvidia, Cathie Wood kauft nach',
      summary: [
        'Laut finanzen.net hat Bridgewater im zweiten Quartal Nvidia-Aktien verkauft, während Cathie Woods ARK zur gleichen Zeit mehr Nvidia und Cloudflare hielt und AMD sowie Palantir reduzierte.',
        'Beide Offenlegungen zeigen nur die Richtung der Umschichtung – Stückzahlen oder Beträge nennt keine der beiden Kurzmeldungen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt an einem konkreten Beispiel, dass selbst prominente Adressen aus denselben öffentlichen Informationen gegensätzliche Schlüsse ziehen können.',
      relatedTopics: ['anlegerpsychologie', 'portfolio-aufbau'],
      relatedSymbols: ['nvidia', 'amd', 'palantir'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 19.8.2026, 3:08 Uhr: Bridgewater verkauft Aktien von NVIDIA und Co.: Die zehn größten Beteiligungen im zweiten Quartal',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Gold in Shanghai zuletzt 22 Dollar günstiger als in Europa',
      summary: [
        'Goldreporter meldet, eine Feinunze Gold habe in Shanghai zuletzt 22 US-Dollar weniger gekostet als am europäischen Spotmarkt – der China-Spread habe sich damit erneut ausgeweitet, eine Ursache nennt die Quelle nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Erinnert daran, dass selbst ein global gehandelter Rohstoff wie Gold regional unterschiedliche Preise haben kann, wenn Kapital oder Metall nicht frei fließen.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Meldungen & Analysen, 18. August 2026: China – Gold kostet in Shanghai zuletzt 22 US-Dollar je Unze weniger als am europäischen Spotmarkt',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
  ],
}
