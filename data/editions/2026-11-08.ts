import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-08.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-08 00:19 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-08',
  intro:
    'Nach neuen Treffern auf Qeschm spricht Trump von „kleinen Schlägen“ gegen Iran. Deutschlands Industrie überrascht, Berkshire verdoppelt seine Rückkäufe.',
  top: [
    {
      headline: 'Iran meldet Raketentreffer, Trump spricht von „kleinen Schlägen“',
      summary: [
        'Auf der iranischen Insel Qeschm schlugen am Freitag zwei Raketen ein, berichtet CNBC unter Berufung auf die Nachrichtenagentur Tasnim. Zu Schäden gab es zunächst keine offiziellen Angaben.',
        'US-Präsident Trump sprach am selben Tag von „kleinen Schlägen“ gegen Iran. Verletzte habe es nach seinen Worten nicht gegeben. Iran verlangt vor neuen Gesprächen „praktische Maßnahmen“ der USA.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Straße von Hormus ist eine der wichtigsten Routen für den weltweiten Öltransport – jede Eskalation dort gilt als Risikofaktor für den Ölpreis.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            "CNBC, 7.11.2026, 08:37 Uhr: „Trump says U.S. carried out 'minor strikes' on Iran as missiles hit Qeshm Island“",
          url: 'https://www.cnbc.com/2026/11/07/trump-us-minor-strikes-iran-qeshm-island.html',
        },
        {
          label:
            'CNBC, 7.11.2026, 23:17 Uhr: „Risk of Iran war escalation remains high despite Democratic sweep in U.S. midterm elections“',
          url: 'https://www.cnbc.com/2026/11/07/iran-war-midterm-election-oil-price-trump.html',
        },
      ],
    },
    {
      headline: 'Deutsche Industrie wächst überraschend, August-Wert wird gesenkt',
      summary: [
        'Deutsche Industriebetriebe haben im September 0,7 Prozent mehr produziert als im Vormonat, meldet das Statistische Bundesamt. Erwartet hatten Ökonomen einen leichten Rückgang.',
        'Die Autoindustrie legte um 17,1 Prozent zu, nach einer schwachen Sommerpause. Das Amt korrigierte zugleich den August-Wert von zwei auf ein Prozent Plus nach unten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine nach unten korrigierte Vormonatszahl relativiert den Erfolg des neuen Monats – erst mehrere Monate in Folge zeigen, ob sich die Erholung der Industrie festigt.',
      relatedTopics: ['wie-funktioniert-der-markt', 'risiko-und-rendite'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'tagesschau.de, 6.11.2026, 11:42 Uhr: „Industrieproduktion wächst überraschend - Autobranche legt zu“',
          url: 'https://www.tagesschau.de/wirtschaft/konjunktur/industrieproduktion-wachstum-deutschland-100.html',
        },
      ],
    },
    {
      headline: 'Berkshire Hathaway verdoppelt Aktienrückkäufe, Gewinn sinkt',
      summary: [
        'Berkshire Hathaway hat im dritten Quartal eigene Aktien für 9,6 Milliarden Dollar zurückgekauft. Das ist mehr als doppelt so viel wie im Quartal davor, meldet CNBC.',
        'Der Nettogewinn fiel um 28 Prozent auf 22,1 Milliarden Dollar, vor allem wegen geringerer Kursgewinne im Beteiligungsportfolio. Das operative Ergebnis sank dagegen nur um 5,8 Prozent. Die Aktie stieg im vergangenen Monat um mehr als zwölf Prozent, der S&P 500 fiel.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Nettogewinn schwankt mit den Kurswerten der gehaltenen Aktien, das operative Ergebnis zeigt dagegen das eigentliche Geschäft – deshalb entwickeln sie sich oft unterschiedlich stark.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['berkshire', 'sp500'],
      sources: [
        {
          label:
            'CNBC, 7.11.2026, 16:23 Uhr: „Berkshire Hathaway more than doubles buybacks in third quarter as earnings decline“',
          url: 'https://www.cnbc.com/2026/11/07/berkshire-hathaway-q3-2026-earnings-buybacks.html',
        },
        {
          label:
            'Handelsblatt, 7.11.2026, 16:57 Uhr (Reuters): „Quartalszahlen: Berkshire meldet Gewinnrückgang, doch die Aktie profitiert“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/quartalszahlen-berkshire-meldet-gewinnrueckgang-doch-die-aktie-profitiert/100268115.html',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'Microsoft baut KI-Partnerschaften um, eigene Investitionen steigen weiter',
      summary: [
        'Microsoft will sich auf weniger externe Rechenzentrums-Partner stützen und mehr eigene Kapazität aufbauen, berichtet CNBC. Einen Vertrag mit dem Anbieter Nscale in Großbritannien hat Microsoft bereits beendet.',
        'Die eigenen Investitionen steigen trotzdem: Im jüngsten Quartal gab Microsoft 45,2 Milliarden Dollar für Infrastruktur aus. Die Aktien der Partner CoreWeave, Nebius und IREN verloren im vergangenen Monat jeweils rund die Hälfte ihres Wertes.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Mehr Investitionen insgesamt und weniger externe Partner sind kein Widerspruch – sie verschieben nur, wer von den Milliarden für KI-Rechenzentren profitiert.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['microsoft'],
      sources: [
        {
          label:
            'CNBC, 6.11.2026, 19:40 Uhr: „Microsoft plans to use fewer neoclouds as AI buildout shows signs of strain“',
          url: 'https://www.cnbc.com/2026/11/06/microsoft-moves-to-consolidate-its-relationships-with-neoclouds-in-ai.html',
        },
      ],
    },
    {
      headline: 'China drosselt Diesel-Exporte wegen niedriger Lagerbestände',
      summary: [
        'Chinas Diesel-Exporte brechen im November ein. Reuters-Berechnungen zufolge könnten sie unter 800.000 Tonnen fallen, nach 1,8 Millionen Tonnen im September, meldet wallstreet-online.',
        'Grund sind niedrige Lagerbestände im eigenen Land. Asiatische Käufer weichen deshalb verstärkt auf Diesel aus Indien, Südkorea und dem Nahen Osten aus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Weniger chinesische Exporte verändern, wer weltweit woher Diesel bezieht – das kann auch den Nachschub für europäische Käufer verknappen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'wallstreet-online, Redaktion, 6.11.2026, 18:29 Uhr (Reuters-Berechnungen): „Lager aufgebraucht: China drosselt Dieselausfuhren drastisch“',
          url: 'https://www.wallstreet-online.de/nachricht/21654078-lager-aufgebraucht-china-drosselt-dieselausfuhren-drastisch',
        },
      ],
    },
  ],
}
