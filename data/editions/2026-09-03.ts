import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-03.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-03 00:17 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-03',
  intro:
    'Dell jubelt, Broadcom rutscht trotz Rekordumsatz ab, ein Investor stemmt sich gegen die Telekom-Fusion – die Anleiherenditen ziehen an.',
  top: [
    {
      headline: 'Dell jubelt, Broadcom rutscht ab – trotz KI-Boom bei beiden',
      summary: [
        'Dell hat sich laut wallstreet-online 2026 bereits um 238 Prozent verteuert, nach Rekordumsatz und angehobener Prognose haben Citi und Bank of America ihre Kursziele laut finanzen.net auf 600 US-Dollar angehoben.',
        'Broadcom meldet laut mehreren Quellen einen verdreifachten, die Erwartungen übertreffenden Umsatz – die Aktie fällt trotzdem, weil der Ausblick laut dpa-AFX über onvista enttäuschte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt an zwei KI-Profiteuren desselben Tages, dass Kurse auf die Lücke zur Erwartung reagieren, nicht auf die reine Wachstumszahl.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dell', 'broadcom'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 2.9.2026: „Dell-Aktie zieht kräftig an: Rekordumsatz und angehobene Prognose durch KI-Server-Boom"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'onvista, Aktuelle News vom 2.9.2026, 20:47 Uhr (dpa-AFX): „Broadcom wächst dank hoher KI-Nachfrage weiter rasant - Ausblick enttäuscht"',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Elliott soll gegen eine Telekom-Fusion mit T-Mobile US vorgehen',
      summary: [
        'Einem Bericht zufolge, der sich auf Kreise beruft, ist der aktivistische Investor Elliott bei der Deutschen Telekom eingestiegen, um eine Fusion mit der US-Tochter T-Mobile US zu verhindern.',
        'Weder die Höhe der Beteiligung noch die genaue Begründung nennt die Meldung – bestätigt ist der Einstieg bislang nicht offiziell.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, wie ein einzelner Großaktionär öffentlich gegen die Strategie eines Konzerns vorgehen kann, noch bevor Details bekannt sind.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['deutsche-telekom', 't-mobile-us'],
      sources: [
        {
          label:
            'onvista, Unternehmensmeldungen vom 2.9.2026 (dpa-AFX): „Kreise: Elliott steigt bei der Telekom ein - Ziel: keine Fusion mit T-Mobile US"',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Anleiherenditen steigen – der Donnerstag bringt PMI und Erzeugerpreise',
      summary: [
        'Wallstreet-online meldet, dass weltweit die Anleiherenditen anziehen, während der Wirtschaftskalender für den Donnerstag gleich mehrere Einkaufsmanagerindizes zwischen 09:15 und 09:55 Uhr auflistet.',
        'Um 11:00 Uhr folgt der Erzeugerpreisindex mit einer Prognose von plus 1,2 Prozent im Monatsvergleich, nach zuvor minus 0,3 Prozent – ein möglicher Frühindikator für mehr Inflation.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Liefert die konkreten Uhrzeiten, zu denen heute Konjunkturdaten die Richtung an den Anleihemärkten mitbestimmen können.',
      relatedTopics: ['staatsanleihe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'wallstreet-online, Startseite, Abruf 3.9.2026, 00:17 Uhr: „Staatsanleihen: Globale Anleihen stehen unter Druck: Renditen schießen nach oben"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'finanzen.net, Wirtschaftskalender „Kommende Termine", Abruf 3.9.2026, 00:17 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Delivery Hero: Vorstand empfiehlt Aktionären das Uber-Angebot',
      summary: [
        'Aufsichtsrat und Vorstand von Delivery Hero stellen sich laut finanzen.net hinter das Übernahmeangebot von Uber, zu Preis oder Konditionen äußert sich die Meldung nicht.',
        'Am selben Tag geht der Investor Elliott bei der Deutschen Telekom offenbar gegen eine geplante Fusion vor – zwei entgegengesetzte Reaktionen auf mögliche Zusammenschlüsse.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erklärt am konkreten Fall den Unterschied zwischen einer vom Vorstand unterstützten und einer feindlichen Übernahme.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['delivery-hero', 'uber'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 2.9.2026: „Delivery Hero-Aktie: Aufsichtsrat und Vorstand unterstützen Übernahmeangebot von Uber"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Silber zieht an einem Morgen fast doppelt so stark an wie Gold fällt',
      summary: [
        'Gold notierte laut finanzen.net beim Abruf um 00:17 Uhr bei 4.385,50 US-Dollar, ein Minus von 0,04 Prozent, während Silber im selben Moment um 1,87 Prozent auf 65,32 US-Dollar zulegte.',
        'Goldreporter berichtet zusätzlich, dass die Niederlande laut dpa-AFX einen Teil ihrer Goldreserve aus den USA abziehen – ohne Angabe zur Menge.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Macht sichtbar, dass zwei oft gemeinsam genannte Edelmetalle sich am selben Morgen unterschiedlich stark bewegen können.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label: 'finanzen.net, Aktuelle Rohstoffpreise, Abruf 3.9.2026, 00:17 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'finanzen.net, Rohstoffnachrichten vom 2.9.2026 (dpa-AFX): „Niederlande ziehen Teil von Goldreserve aus den USA ab"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Japans Nullzins-Ära ist laut finanzen.net vorbei',
      summary: [
        'Finanzen.net meldet auf der Startseite das Ende von Japans Nullzins-Ära, ohne die genaue Zinshöhe im Teaser zu nennen.',
        'Passend dazu fiel USD/JPY laut Markt Bote um 0,83 Prozent auf 158,838 Yen – der Yen wurde am Morgen spürbar stärker.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zeigt, wie eine geldpolitische Wende in Japan sich noch am selben Morgen im Wechselkurs niederschlägt.',
      relatedTopics: ['notenbanken-geldpolitik', 'waehrungen-wechselkurse'],
      relatedSymbols: ['eur-jpy'],
      sources: [
        {
          label:
            'finanzen.net, Startseite, Abruf 3.9.2026, 00:17 Uhr: „Zins so hoch wie lange nicht: Japans Nullzins-Ära ist vorbei: Was heißt das für Sparer und Unternehmen?"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'finanzen.net, Devisennachrichten vom 2.9.2026 (Markt Bote): „USD/JPY: USD/JPY stürzt ab -0,83 % auf 158,83800 JPY"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
