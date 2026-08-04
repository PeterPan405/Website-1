import type { DailyEdition } from './types'

/**
 * Ausgabe vom 4. August 2026 – ein Dienstag, an dem die Berichtssaison alles
 * andere verdeckt.
 *
 * Zwischen 7:10 und 7:45 Uhr laufen allein über den deutschen Ticker Zahlen
 * von Lufthansa, Continental, Zalando, Evonik, Fresenius Medical Care, HSBC,
 * LEG, Hamborner Reit und ams-OSRAM ein. Dazu der Dax, der am Montag erstmals
 * über 26.000 Punkten geschlossen hat, und ein Goldmarkt, der vor den
 * US-Arbeitsmarktdaten stillsteht.
 *
 * Zur Quellenlage: Alle Meldungen sind über einen GitHub-Läufer aus den
 * Nachrichtenübersichten von finanzen.net, onvista, wallstreet-online und
 * Goldreporter gelesen worden – mit Uhrzeit und Statuscode im Protokoll. Es
 * sind Ticker-Überschriften; wo eine Begründung nicht daraus hervorgeht,
 * steht sie hier auch nicht.
 */
export const edition: DailyEdition = {
  date: '2026-08-04',
  intro:
    'Die Lufthansa kassiert den Gewinnausblick, Fresenius Medical Care übertrifft und fällt trotzdem – und der Dax schloss am Montag erstmals über 26.000 Punkten.',
  top: [
    {
      headline: 'Lufthansa kassiert den Gewinnausblick',
      summary: [
        'Zwei Meldungen aus derselben Viertelstunde: Um 7:21 Uhr steht im Ticker, die Lufthansa habe im zweiten Quartal weniger verdient als erwartet. Um 7:38 Uhr folgt die gewichtigere – der Konzern nimmt seinen Gewinnausblick zurück.',
        'Das abgelaufene Quartal lässt sich nicht mehr ändern; der Ausblick betrifft das laufende Jahr. Wer eine Aktie hält, hält keinen Anspruch auf vergangene Gewinne, sondern auf künftige.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine zurückgenommene Prognose verschiebt die Grundlage jeder Bewertung, die auf ihr aufbaute. Deshalb bewegt sie den Kurs in aller Regel stärker als das Quartalsergebnis daneben.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 4. August 2026, 7:21 und 7:38 Uhr: „Lufthansa verdient im 2. Quartal weniger als erwartet“ / „Flugkonzern kassiert Gewinn-Ausblick“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Fresenius Medical Care übertrifft – und die Aktie gibt nach',
      summary: [
        'Die Ticker-Überschrift von 7:11 Uhr trägt den Widerspruch schon in sich: übertroffene Erwartungen im zweiten Quartal, eine dennoch leichtere Aktie. Das ist kein Fehler, sondern eines der zuverlässigsten Muster der Berichtssaison.',
        'Der Analystenkonsens ist ein Durchschnitt aus Modellen, oft Wochen alt. Der Kurs dagegen bewegt sich laufend und hat gute Zahlen womöglich längst vorweggenommen. Wer die Erwartung schon bezahlt hat, kauft nicht noch einmal.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        '„Besser als erwartet“ ist eine Aussage über Analysten, keine über den Kurs. Kursrelevant ist der Abstand zu dem, was der Markt bereits eingepreist hatte – und diese Zahl steht nirgends.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 4. August 2026, 7:11 Uhr: „Fresenius Medical Care übertrifft in Q2 die Erwartungen – Aktie dennoch leichter“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Der Dax schloss erstmals über 26.000 Punkten',
      summary: [
        'onvista meldete den Rekordschluss am Montag um 15:55 Uhr und nannte Autowerte als Treiber. Am Dienstagmorgen zeigten die Kurstafeln zwei Zahlen für denselben Vorgang: wallstreet-online 26.068,45 Punkte (+1,43 %), finanzen.net 26.001 (+1,5 %).',
        'Beides kann stimmen. „Der Dax“ ist kein einzelner Preis, sondern eine Rechnung, die je nach Handelsplatz und Zeitstempel anders ausfällt – Xetra-Schluss, Späthandel und vorbörsliche Indikation sind drei verschiedene Dinge.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Dax ist ein Performanceindex und enthält rechnerisch die Dividenden. Wer seinen Punktestand mit einem Kursindex vergleicht, vergleicht zwei verschieden gebaute Zahlen.',
      relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'euro-stoxx-50'],
      sources: [
        {
          label:
            'onvista, Dax-Tagesrückblick vom 3. August 2026, 15:55 Uhr: „Dax schließt erstmals über 26.000 Punkten – Autowerte stark“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'wallstreet-online, Kurstafel am 4. August 2026 gegen 7:45 Uhr: Dax 26.068,45 Punkte (+1,43 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'HSBC nimmt die Aktienrückkäufe wieder auf',
      summary: [
        'Der Quartalsgewinn steigt stärker als erwartet, das Rückkaufprogramm kehrt zurück – gemeldet um 5:12 Uhr über dpa-AFX und um 7:12 Uhr im Ticker. Ein Rückkauf zahlt nichts aus: Das Unternehmen kauft eigene Aktien und zieht sie ein, danach existieren weniger Anteile.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Der Anteil am Unternehmen wächst, ohne dass etwas zufließt – und ohne dass sofort Kapitalertragsteuer anfällt. Für den Vergleich zweier Titel gehört das Rückkaufvolumen neben die Dividendenrendite.',
      relatedTopics: ['aktie', 'kosten-und-gebuehren'],
      relatedSymbols: ['hsbc'],
      sources: [
        {
          label:
            'onvista, Agentur-Meldungen vom 4. August 2026, 5:12 Uhr (dpa-AFX): „HSBC nimmt Aktienrückkäufe wieder auf – Gewinn steigt stärker als erwartet“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Zalando wächst zweistellig – und passt die Prognose an',
      summary: [
        'Sechs Minuten liegen zwischen den beiden Meldungen: zweistelliges Wachstum im zweiten Quartal (7:27 Uhr) und ein Ergebnis unter Erwartung bei angepasster Jahresprognose (7:33 Uhr). Zwischen Umsatz und Ergebnis liegt die gesamte Kostenseite – Ware, Logistik, Retouren, Marketing.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Wachstum lässt sich über Rabatte einkaufen, Marge muss verdient werden. Bei Handelsunternehmen sagt die Marge mehr über das Geschäft als die Wachstumsrate.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 4. August 2026, 7:27 und 7:33 Uhr: „Zalando konkretisiert Gewinn- und Umsatzziele“ / „Zalando passt Jahresprognose an“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Gold steht still vor den US-Arbeitsmarktdaten',
      summary: [
        'finanzen.net meldet um 7:25 Uhr „wenig Bewegung“; die Kurstafel zeigt 4.062,42 Dollar je Unze (+0,22 %). Wer auf schwache Daten setzt, hat gekauft, wer auf starke setzt, verkauft – beide Lager sind positioniert und warten. Der Stillstand ist das Ergebnis, nicht die Abwesenheit von Meinungen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Gold zahlt keine Zinsen; sein Nachteil gegenüber Anleihen hängt an der Zinserwartung, und die hängt am US-Arbeitsmarkt. Bewegung entsteht erst an der Abweichung von der Prognose.',
      relatedTopics: ['rohstoffe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'finanzen.net, Top News vom 4. August 2026, 7:25 Uhr: „Goldpreis: Wenig Bewegung vor US-Arbeitsmarktdaten“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Warum es einen Dax-Kurs gibt, bevor die Börse öffnet',
      summary: [
        'Um 7:33 Uhr meldet der Ticker feste Dax-Futures, zwei Minuten zuvor einen Bund-Future knapp im Minus – der Xetra-Handel beginnt erst um 9 Uhr. Gehandelt werden Terminkontrakte an der Eurex, die früher öffnet; ihr Preis ist die beste Schätzung für die Eröffnung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Frühhandel ist dünn: Wenige Aufträge bewegen viel, und die Spanne zwischen Kauf- und Verkaufskurs ist am größten. Zur Einordnung taugt er, als Grundlage für eine Order kaum.',
      relatedTopics: ['derivat', 'boerse'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 4. August 2026, 7:31 und 7:33 Uhr: „EUREX/Bund-Future im Frühhandel knapp im Minus“ / „EUREX/DAX-Futures im Frühhandel etwas fester“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Nordex: Aufträge über mehr als 480 Megawatt aus den USA',
      summary: [
        'Die Unternehmensmitteilung läuft um 7:30 Uhr über den EQS-Verteiler. Zwischen Bestellung und Abrechnung einer Windkraftanlage liegen Genehmigung, Fertigung, Transport und Inbetriebnahme – in aller Regel mehrere Jahre. Megawatt sind zudem eine technische Größe, kein Preis.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Auftragseingang, Auftragsbestand und Umsatz sind drei verschiedene Zahlen zu drei verschiedenen Zeitpunkten. Nur die letzte steht in der Gewinn- und Verlustrechnung.',
      relatedTopics: ['aktie', 'aktien-laender-branchen'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'EQS-News via finanzen.net, 4. August 2026, 7:30 Uhr: „Die Nordex Group erhält neue Aufträge über mehr als 480 MW aus den USA“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
