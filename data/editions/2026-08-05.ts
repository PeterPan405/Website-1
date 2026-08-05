import type { DailyEdition } from './types'

/**
 * Ausgabe vom 5. August 2026 – ein Mittwoch mit einer geopolitischen
 * Hauptmeldung und der zweiten Halbzeit der Berichtssaison.
 *
 * Über Nacht kam der Bericht über einen Übergangsdeal für die Straße von
 * Hormus; der Ölpreis liegt am Morgen bei knapp 79 Dollar, am Montag waren es
 * noch 85. Dazu die US-Schlusskurse mit Rekorden für Dow und S&P 500, AMDs
 * enttäuschende Prognose aus der Nachbörse und, ab 7 Uhr, die deutschen
 * Halbjahreszahlen von DHL, Siemens Energy und Vonovia.
 *
 * Zur Quellenlage: gelesen aus `quellen-heute` (Stand 5. August, 05:09 UTC,
 * 7 von 8 Adressen mit Inhalt) – dpa-AFX-Meldungen über onvista, der
 * News-Ticker von finanzen.net, die Kurstafeln von wallstreet-online und
 * finanzen.net. Es sind Ticker-Überschriften; wo eine Begründung nicht daraus
 * hervorgeht, steht sie hier auch nicht.
 */
export const edition: DailyEdition = {
  date: '2026-08-05',
  intro:
    'Ein Übergangsdeal für die Straße von Hormus drückt Öl unter 79 Dollar, AMD enttäuscht mit der Prognose – und Dow und S&P 500 schlossen auf Rekordständen.',
  top: [
    {
      headline: 'Übergangsdeal in der Straße von Hormus – Öl unter 79 Dollar',
      summary: [
        'Um 4:58 Uhr meldet dpa-AFX einen Bericht, wonach die USA und der Iran vor einer Übergangslösung für die Meerenge stehen. Brent notiert am Morgen bei knapp 79 Dollar je Fass – am Montag waren es rund 85, vor einer Woche über 90.',
        'Durch die Straße von Hormus fährt ein erheblicher Teil des seewärts gehandelten Öls, und für die meisten Golfstaaten gibt es keinen zweiten Weg. Wird sie unsicher, fehlt zunächst nichts – es steigt nur die Wahrscheinlichkeit, dass etwas fehlen wird.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Übergang ist eine Regelung auf Zeit, kein Ende des Konflikts. Der Markt preist damit keine Sicherheit ein, sondern eine geringere Wahrscheinlichkeit – und derselbe Aufschlag kommt zurück, wenn die Einigung ausbleibt.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'onvista, Agentur-Meldungen vom 5. August 2026, 4:58 Uhr (dpa-AFX): „ROUNDUP/Bericht: USA und Iran vor Übergangsdeal in Straße von Hormus“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'AMD enttäuscht mit der Prognose – die Aktie fällt nachbörslich',
      summary: [
        'Die Meldung steht um 4:53 Uhr deutscher Zeit im Ticker. Wieder ist es der Ausblick, nicht das abgelaufene Quartal – und wieder passiert die Bewegung dort, wo kaum jemand hinsieht: im nachbörslichen Handel nach 22 Uhr deutscher Zeit.',
        'Amerikanische Unternehmen legen ihre Zahlen bewusst in dieses Fenster, damit die Meldung nicht in den laufenden Handel platzt. Der Preis dafür ist ein dünner Markt: wenige Stücke, große Spanne, vorläufige Kurse.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Kursangabe aus der Nachbörse sagt, in welche Richtung eine Meldung gelesen wurde – nicht wie weit. Das entscheidet sich erst, wenn der reguläre Handel wieder öffnet.',
      relatedTopics: ['aktie', 'boerse'],
      relatedSymbols: ['amd', 'nasdaq-100'],
      sources: [
        {
          label:
            'onvista, Agentur-Meldungen vom 5. August 2026, 4:53 Uhr (dpa-AFX): „AMD enttäuscht mit Prognose – Aktie verliert nachbörslich“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Rekorde für Dow und S&P 500, Erholung bei der Nasdaq',
      summary: [
        'Die Wall Street schloss am Dienstag mit Bestmarken für Dow Jones und S&P 500; die Nasdaq legte kräftig zu. Die Kurstafel am Mittwochmorgen zeigt den Dow bei 54.149,39 Punkten (+1,78 %) und den Nasdaq-100 bei 29.737,32 (+3,40 %).',
        'Drei Indizes in einem Satz – und drei verschiedene Rechenwerke. Der Dow gewichtet nach Aktienkurs, der S&P 500 nach Börsenwert, der Nasdaq-100 ist eine Auswahl nach Handelsplatz und Sektorausschluss.',
      ],
      category: 'Märkte',
      whyItMatters:
        '„Rekord“ heißt bei jedem der drei etwas anderes. Wer einen ETF darauf kauft, kauft die Bauweise mit – sie entscheidet über Streuung und Schwankung mehr als der Name des Index.',
      relatedTopics: ['boerse', 'etf'],
      relatedSymbols: ['dow-jones', 'sp500', 'nasdaq-100'],
      sources: [
        {
          label:
            'onvista, Index-Analysen vom 4. August 2026, 20:31 Uhr (dpa-AFX): „Aktien New York Schluss: Rekorde für Dow und S&P – Nasdaq mit Erholungsrally“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'DHL stockt den Rückkauf auf – aus Zoll-Rückzahlungen',
      summary: [
        'Zwei Ticker-Zeilen, drei Minuten auseinander: überproportional gestiegene Gewinne (7:01 Uhr) und ein aufgestocktes Aktienrückkaufprogramm, gespeist aus Mittelzuflüssen von US-Zoll-Rückzahlungen (7:04 Uhr). Eine Rückzahlung ist echtes Geld – aber ein Einmaleffekt, der sich nicht wiederholt.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Bei jeder Ausschüttungsmeldung lohnt eine Rückfrage: Ist das Geld verdient oder zugeflossen? Beides ist legitim, nur die Erwartung fürs nächste Jahr richtet man daran unterschiedlich aus.',
      relatedTopics: ['aktie', 'kosten-und-gebuehren'],
      relatedSymbols: ['deutsche-post', 'dax'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 5. August 2026, 7:01 und 7:04 Uhr: „DHL steigert Gewinne überproportional zum Umsatz im 2Q“ / „DHL stockt Aktienrückkaufprogramm auf“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Gold bei 4.137 Dollar – trotz der Rekorde an der Wall Street',
      summary: [
        'Das Metall legt um rund anderthalb Prozent zu, am selben Morgen, an dem Dow und S&P 500 von Bestmarken kommen. Nach der landläufigen Regel dürfte das nicht zusammenpassen – Gold gilt als sicherer Hafen für fallende Aktienmärkte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Gold und Aktien laufen nicht systematisch gegeneinander; ihre Korrelation ist über lange Zeiträume nahe null. Das heißt „ohne festen Zusammenhang“, nicht „gegenläufig“ – und genau das ist der Nutzen für ein Depot.',
      relatedTopics: ['rohstoffe', 'portfolio-aufbau'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'wallstreet-online, Kurstafel am 5. August 2026 gegen 7:10 Uhr: Gold 4.137,19 Dollar (+1,46 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Siemens Energy: Gewinn im Windgeschäft',
      summary: [
        'Der Ticker meldet um 7:04 Uhr ungebremste Nachfrage und einen Gewinn in der Windsparte. Ein Bereich, der Verluste schreibt, wird an der Börse meist mit null oder negativ bewertet; kippt er in den Gewinn, ändert sich nicht nur ein Betrag, sondern das Vorzeichen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein Konzernergebnis ist eine Summe, und Summen verstecken. Erst die Segmenttabelle im Quartalsbericht zeigt, welcher Teil das Geschäft trägt und welcher daran zieht.',
      relatedTopics: ['aktie', 'aktien-laender-branchen'],
      relatedSymbols: ['siemens-energy', 'dax'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 5. August 2026, 7:04 Uhr: „Siemens Energy verzeichnet ungebremste Nachfrage – Gewinn im Windgeschäft“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Vonovia: operativer Gewinn leicht höher, Ausblick bestätigt',
      summary: [
        'Bei einem Wohnungskonzern taugt der Jahresüberschuss wenig: Steigen die Immobilienpreise, entsteht ein Gewinn, ohne dass eine Wohnung verkauft wurde – fallen sie, ein Milliardenverlust, ohne dass eine Miete ausbleibt. Maßgeblich ist deshalb der FFO, der Bewertungsänderungen bewusst außen vor lässt.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Immobilien werden zu großen Teilen mit Fremdkapital gehalten. Steigende Zinsen treffen doppelt: Die Finanzierung wird teurer, und der Bestand wird niedriger bewertet, weil künftige Mieten stärker abgezinst werden.',
      relatedTopics: ['immobilien', 'aktie'],
      relatedSymbols: ['vonovia', 'dax'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 5. August 2026, 7:03 Uhr: „Vonovia steigert operativen Gewinn leicht im 1H – Ausblick bestätigt“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Musk stellt Billionen-Umsätze in Aussicht – die Aktie fällt',
      summary: [
        'Eine sehr große Zahl für eine sehr ferne Zukunft, und der Kurs gibt nach. Das ist kein Rätsel: Jeder Betrag wird umso stärker abgezinst, je weiter er entfernt liegt – bei acht Prozent Kapitalkosten ist Geld in zwanzig Jahren heute noch etwa ein Fünftel wert.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zu jeder Zukunftszahl gehören zwei Rückfragen: wann, und wie sicher. Ohne sie ist auch eine Billion nur eine Ziffernfolge.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'onvista, Agentur-Meldungen vom 5. August 2026, 4:05 Uhr (dpa-AFX): „ROUNDUP: Musk prophezeit Billionen-Umsatz für SpaceX – Aktie fällt“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
}
