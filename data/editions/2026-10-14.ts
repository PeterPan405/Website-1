import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-14.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-14 05:05 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-14',
  intro:
    'Notenbanker sprechen, Spanien meldet die Inflation, Brent steigt über 107 Dollar, und US-Großbanken starten in die Berichtssaison.',
  top: [
    {
      headline:
        'EZB-Tag: Lagarde, Elderson und Escrivá sprechen, Spanien meldet Inflation',
      summary: [
        'Der Mittwoch ist dicht getaktet. Fünf Notenbanker treten auf. Um 8 Uhr spricht ein Mitglied der Bank of England, kurz danach der Gouverneur der kanadischen Notenbank. Die Europäische Zentralbank ist gleich dreifach vertreten: EZB-Mitglied Elderson um 10 Uhr, Präsidentin Lagarde um 10:30 Uhr und EZB-Mitglied Escrivá um 11:20 Uhr.',
        'Dazu kommen zwei Preisdaten. Deutschland veröffentlicht um 8 Uhr seine Großhandelspreise für September, erwartet werden 0,7 Prozent im Monatsvergleich. Spanien meldet um 9 Uhr seine Inflation. Die harmonisierte Jahresrate wird mit 5,0 Prozent erwartet, genauso wie im Vormonat.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zwei leicht unterschiedliche Inflationsmaße für dasselbe Land zeigen, warum ein einzelner Prozentwert nie die komplette Geschichte erzählt.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['eur-usd', 'dax'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender und Ticker, Stand 14.10.2026, 07:04 Uhr MESZ',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Brent steigt über 107 Dollar, Raketen auf Kiew',
      summary: [
        'Der Ölpreis der Sorte Brent ist am Mittwochmorgen über 107 Dollar je Barrel gestiegen. Das meldet wallstreet-online um 07:04 Uhr. Einen Grund für den Anstieg nennt die Meldung nicht.',
        'In der Nacht trafen nach Angaben von dpa-AFX Raketen die ukrainische Hauptstadt Kiew. Ukrainer beklagten eine fehlende Vorwarnung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Ölpreis wirkt über Transport- und Energiekosten auf die Teuerung – und die steht heute mit Spaniens Inflationsdaten und Lagardes Auftritt ohnehin im Mittelpunkt.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label: 'wallstreet-online, Marktüberblick, Stand 14.10.2026, 07:04 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'wallstreet-online/dpa-AFX, Wirtschaftsnachrichten-Ticker, 14.10.2026, 06:21 Uhr: „Raketen treffen Kiew – Ukrainer beklagen fehlende Vorwarnung“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Dax hält sich, während Chipwerte in Asien einbrechen',
      summary: [
        'Der Dax zeigt sich am Mittwochmorgen robust. Er notiert laut wallstreet-online bei 25.304,58 Punkten, ein Plus von 0,24 Prozent.',
        'Ganz anders das Bild in Asien. Dort geben laut einer Marktübersicht Speicherchip-Hersteller wie SK Hynix, Samsung Electronics und Kioxia deutlich nach. An der Wall Street war der Vortag bereits durchwachsen verlaufen, mit leichten Verlusten wegen Geschäftszahlen und schwachen Technologiewerten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein nationaler Leitindex spiegelt vor allem seine eigene Zusammensetzung – Schwäche in einer fernen Branche muss sich dort nicht niederschlagen.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['dax', 'samsung'],
      sources: [
        {
          label:
            'wallstreet-online, Kursleiste und Marktüberblick, Stand 14.10.2026, 07:04 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'wallstreet-online/dpa-AFX, Marktberichte, 13.10.2026, 20:20 Uhr: „Aktien New York Schluss: Leichte Verluste – Geschäftszahlen und Tech-Schwäche“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'US-Großbanken legen am Mittwoch ihre Quartalszahlen vor',
      summary: [
        'Der Mittwoch bringt frische Zahlen von vier großen US-Finanzkonzernen. Blackrock, Morgan Stanley, Bank of America und State Street legen ihre Quartalszahlen vor, meldet wallstreetONLINE. Konkrete Erwartungswerte nennt die Übersicht nicht.',
        'Der Termin reiht sich in eine bereits angelaufene Berichtssaison ein. Der Handel in New York hatte am Dienstag schon auf erste Geschäftszahlen reagiert. Der Tag schloss laut dpa-AFX mit leichten Verlusten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Banken berichten meist zu den Ersten – ihre Zahlen gelten oft als früher Hinweis auf die Stimmung in der Wirtschaft insgesamt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['blackrock', 'bank-of-america'],
      sources: [
        {
          label:
            'wallstreet-online, „Ihre wichtigsten Termine“, Stand 14.10.2026, 04:30 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Gold pendelt nahe 4.200 Dollar, Silber gibt weiter nach',
      summary: [
        'Gold und Silber bewegen sich am Mittwochmorgen in unterschiedliche Richtungen. Gold kostet 4.164,49 Dollar je Feinunze, ein Plus von 0,16 Prozent. Silber verliert 0,37 Prozent auf 59,28 Dollar.',
        'Goldreporter berichtete am Vortag, der Goldpreis nähere sich wieder der Marke von 4.200 Dollar. Öl und Anleiherenditen hätten damals nachgegeben. An diesem Morgen liegt der Kurs weiterhin darunter.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Gold und Silber gelten beide als Edelmetalle, reagieren aber unterschiedlich – Silber hat einen größeren industriellen Nachfrageanteil als Gold.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label: 'wallstreet-online, Kursleiste, Stand 14.10.2026, 07:04 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label: 'goldreporter.de, Top-News vom 13.10.2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Evotec übertrifft mit vorläufigen Neun-Monats-Zahlen die Erwartungen',
      summary: [
        'Evotec meldete in der Nacht zum Mittwoch vorläufige Zahlen. Die Neun-Monats-Ergebnisse liegen über den Erwartungen, teilte das Biotechnologie-Unternehmen mit. Gleichzeitig bestätigte Evotec die Prognose für 2026.',
        'Konkrete Umsatz- oder Ergebniszahlen nennt die kurze Mitteilung nicht. Vorläufige Zahlen sind eine erste, noch ungeprüfte Einschätzung des Unternehmens selbst.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine bestätigte Prognose ist etwas anderes als eine angehobene – vorläufige Zahlen sind außerdem noch nicht endgültig geprüft.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'wallstreet-online, Ad-hoc-Nachrichten, Stand 14.10.2026, 00:07 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
