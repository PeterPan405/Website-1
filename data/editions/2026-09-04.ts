import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-04.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-04 04:46 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-04',
  intro:
    'VW springt nach dem Sparpaket-Ja, Commerzbank kauft eigene Aktien zurück, Gold und Bitcoin ziehen an – der Nachmittag gehört dem US-Arbeitsmarkt.',
  top: [
    {
      headline: 'Sparpaket bringt VW einen der stärksten Tagesgewinne des Jahres',
      summary: [
        'Der Aufsichtsrat von Volkswagen hat laut EQS-Adhoc einen umfassenden Zukunftsplan gebilligt, der rund 50.000 Stellen kosten soll.',
        'Die Vorzugsaktie legte am Donnerstag laut wallstreet-online um 7,47 Prozent zu – eine Begründung für die positive Reaktion nennt keine Quelle.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass Kurse auf Erwartungen an künftige Kosten und Gewinne reagieren können, selbst wenn die Nachricht selbst schmerzhaft ist.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label:
            'wallstreet-online, Ad-hoc-Meldungen vom 3.9.2026 (EQS Group AG): „EQS-Adhoc: Porsche Automobil Holding SE: Zustimmung des Aufsichtsrats der Volkswagen AG zu umfassendem Zukunftsplan für den Volkswagen-Konzern"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'wallstreet-online, Kursbewegungen vom 3.9.2026 (Markt Bote): „Besonders beachtet!: Volkswagen (VW) Vz Aktie legt weiter zu - +7,47 % - 03.09.2026"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Zwei sichere Häfen laufen gleichzeitig heiß: Gold und Bitcoin',
      summary: [
        'Der größte Gold-ETF stockte seine Bestände laut Goldreporter um 11 Tonnen auf, der Goldpreis stieg fast drei Prozent auf über 4.400 US-Dollar.',
        'Am selben Donnerstag kletterte Bitcoin laut wallstreet-online vorübergehend über 81.000 US-Dollar – zwei sehr unterschiedliche Anlagen zogen gleichzeitig an.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Macht sichtbar, dass die Erzählung von sicherem Hafen gegen Risikoanlage nicht an jedem Tag zutrifft, an dem beide gleichzeitig steigen.',
      relatedTopics: ['rohstoffe', 'bitcoin-krypto'],
      relatedSymbols: ['gold', 'bitcoin'],
      sources: [
        {
          label:
            'goldreporter.de, Meldungen & Analysen vom 3.9.2026: „Größter Gold-ETF baut Bestände siebte Woche in Folge aus"',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'wallstreet-online, News-Ticker vom 3.9.2026: „Bitcoin überspringt Marke von 81.000 US-Dollar - Strategy-Aktie hebt ab"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'DAX hält die 26.000, am Nachmittag zählt der US-Arbeitsmarkt',
      summary: [
        'Der DAX beendete den Donnerstag laut finanzen.net über 26.000 Punkten, die Wall Street schloss laut onvista auf Zinshoffnungen deutlich im Plus.',
        'Am Freitag listet der Wirtschaftskalender unter anderem den deutschen Auftragseingang um 08:00 Uhr und eine Rede von BoE-Gouverneur Bailey um 10:50 Uhr, am Nachmittag rückt zusätzlich der US-Arbeitsmarktbericht in den Fokus.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Gibt konkrete Uhrzeiten für die Konjunkturdaten des Tages, mit denen sich Kursbewegungen im Tagesverlauf einordnen lassen.',
      relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'finanzen.net, Heute im Fokus vom 3.9.2026: „DAX schließt über 26.000er-Marke -- Wall Street schließt in Grün"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'finanzen.net, Kommende Termine (Wirtschaftskalender), Abruf 4.9.2026, 02:11 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Commerzbank beschließt Aktienrückkauf über 1,2 Milliarden Euro',
      summary: [
        'Die Commerzbank hat laut Pflichtmitteilung ein Rückkaufprogramm mit einem Volumen von bis zu 1,2 Milliarden Euro beschlossen – Details zur Laufzeit fehlen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Erklärt am aktuellen Fall, wie sich ein Aktienrückkauf von einer Dividende unterscheidet, obwohl beide Geld an Aktionäre zurückgeben.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['commerzbank'],
      sources: [
        {
          label:
            'wallstreet-online, Ad-hoc-Meldungen vom 3.9.2026 (EQS Group AG): „EQS-Adhoc: Commerzbank beschließt die Durchführung eines Aktienrückkaufprogramms im Volumen von bis zu 1,2 Milliarden Euro"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Zurich Insurance baut US-Depot um: mehr AMD und Eli Lilly, weniger Microsoft',
      summary: [
        'Der Versicherer hat laut übereinstimmenden Tickermeldungen seine US-Positionen in AMD und Eli Lilly ausgebaut und Microsoft reduziert – Zahlen fehlen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, wie wenig eine bloße Richtungsangabe bei einem Portfolioumbau tatsächlich über die Größenordnung einer Entscheidung verrät.',
      relatedTopics: ['portfolio-aufbau', 'anlegerpsychologie'],
      relatedSymbols: ['amd', 'eli-lilly', 'microsoft'],
      sources: [
        {
          label:
            'finanzen.net, Top News, Abruf 4.9.2026, 02:11 Uhr: „Zurich Insurance baut US-Depot um: Mehr AMD und Eli Lilly, weniger Microsoft"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'NVIDIA bestätigt Milliarden-Übernahme von Hugging Face',
      summary: [
        'Laut wallstreet-online hat NVIDIA eine Übernahme der KI-Plattform Hugging Face „in Milliardenhöhe" bestätigt, die eigene Aktie zog daraufhin an.',
        'Einen genauen Kaufpreis oder Details zu den Konditionen nennt die Meldung nicht – „Milliarden" bleibt eine runde, unbezifferte Angabe.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erinnert daran, dass eine runde Milliardenangabe ohne genaue Zahl noch keine Grundlage für eine Bewertung der Übernahme liefert.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'wallstreet-online, News-Ticker vom 3.9.2026: „NVIDIA-Aktie zieht an: Konzern bestätigt Milliarden-Übernahme von Hugging Face"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Ströer ersetzt Hugo Boss im MDax, der DAX bleibt unverändert',
      summary: [
        'Der Indexanbieter tauscht laut dpa-AFX Ströer und Hugo Boss zwischen MDax und SDax – über die Aufnahmekriterien im Einzelnen äußert sich die Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt an einem konkreten Fall, dass Indizes regelmäßig überprüft und angepasst werden, unabhängig vom Kursverlauf eines einzelnen Tages.',
      relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'onvista, Index-Analysen vom 3.9.2026, 20:20 Uhr (dpa-AFX): „INDEX-MONITOR: Ströer ersetzt Hugo Boss im MDax - Dax unverändert"',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
}
