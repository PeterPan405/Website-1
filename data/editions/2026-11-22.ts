import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-22.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-22 00:11 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-22',
  intro:
    'Costa schlägt eine EU-Digitalsteuer vor, die EU öffnet sich für Indonesien, das Altersvorsorgedepot startet ohne Staatsfonds, Gold fällt auf ein Jahrestief.',
  top: [
    {
      headline: 'Costa schlägt EU-weite Digitalsteuer vor',
      summary: [
        'Die EU streitet um ihren nächsten Haushalt. Ratspräsident António Costa legt dazu einen Kompromiss vor. Große Unternehmen sollen künftig drei Prozent auf Umsätze aus Online-Werbung, Plattformdiensten und Nutzerdaten zahlen. Zusammen mit weiteren neuen Abgaben soll das Paket gut 60 Milliarden Euro pro Jahr einbringen.',
        'Der geplante Haushalt für 2028 bis 2034 soll rund 1,781 Billionen Euro umfassen. Das sind 204 Milliarden Euro weniger als von der EU-Kommission vorgesehen. Bundeskanzler Friedrich Merz hält das Volumen weiterhin für zu hoch. Frankreich nannte den Vorschlag enttäuschend. Am Donnerstag und Freitag berät ein EU-Sondergipfel in Brüssel darüber.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Eine EU-weite Digitalsteuer würde Einnahmen erstmals direkt an die EU binden, statt sie über nationale Haushaltsbeiträge der Mitgliedstaaten umzurechnen – das verändert, wer am Ende für den EU-Haushalt aufkommt.',
      relatedTopics: ['schulden-und-kredit'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Tagesschau, 21.11.2026, 16:01 Uhr: „Im Streit über EU-Budget legt Costa Kompromiss vor"',
          url: 'https://www.tagesschau.de/wirtschaft/digitales/digitalsteuer-streit-eu-deutschland-100.html',
        },
        {
          label:
            'onvista/dpa-AFX, 21.11.2026, 16:35 Uhr: „ROUNDUP 2: Neue EU-Digitalsteuer soll Streit um Haushalt entschärfen"',
          url: 'https://www.onvista.de/news/2026/11-21-roundup-2-neue-eu-digitalsteuer-soll-streit-um-haushalt-entschaerfen-0-10-26579090',
        },
      ],
    },
    {
      headline: 'EU und Indonesien heben Zölle auf fast allen Handel auf',
      summary: [
        'Fast zehn Jahre wurde verhandelt. Jetzt haben die EU und Indonesien ihr Freihandelsabkommen unterzeichnet. Zölle auf bis zu 98,5 Prozent der Warenkategorien sollen schrittweise wegfallen. Die EU rechnet mit jährlichen Einsparungen von rund 600 Millionen Euro.',
        'Besonders profitiert die Autobranche. Indonesiens Einfuhrzölle von bis zu 50 Prozent auf europäische Autos sollen binnen fünf Jahren entfallen. Die EU erhofft sich außerdem besseren Zugang zu Nickel und Kobalt für die Batterieproduktion.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Zollabkommen regelt nur, was beim Grenzübertritt bezahlt wird – ob ein Rohstoff überhaupt verfügbar ist, hängt von zusätzlichen Regeln gegen Exportmonopole ab, die hier erst den tatsächlichen Zugang sichern sollen.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['bmw', 'volkswagen'],
      sources: [
        {
          label:
            'Tagesschau, 21.11.2026, 21:17 Uhr: „EU und Indonesien unterzeichnen Freihandelsabkommen"',
          url: 'https://www.tagesschau.de/wirtschaft/weltwirtschaft/eu-indonesien-handelsabkommen-102.html',
        },
      ],
    },
    {
      headline: 'Staatliches Altersvorsorgedepot startet erst im Sommer',
      summary: [
        'Zum 1. Januar startet das neue Altersvorsorgedepot. Es löst die Riester-Rente ab. Private Anbieter wie Banken und Versicherungen stehen bereit. Die staatlich organisierte Standardvariante kommt laut dem Bundesfinanzministerium aber erst nach dem Start, frühestens im kommenden Sommer.',
        'Beim Altersvorsorgedepot zahlt der Staat bis zu 540 Euro Grundzulage im Jahr dazu. Für Kinder kommen weitere 300 Euro pro Jahr hinzu. Als möglicher Träger des öffentlichen Fonds werden die Bundesbank, die KfW oder die Deutsche Rentenversicherung genannt.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Ohne das staatliche Standardprodukt fehlt Sparern zum Start der Vergleichsmaßstab, an dem sich private Angebote nach Kosten und Anlagestruktur eigentlich messen lassen sollten.',
      relatedTopics: ['rente'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Tagesschau, 21.11.2026, 11:16 Uhr: „Altersvorsorgedepot: Staatlich organisierter Fonds nicht startklar"',
          url: 'https://www.tagesschau.de/wirtschaft/verbraucher/altersvorsorgedepot-staatlicher-fonds-nicht-startklar-100.html',
        },
        {
          label:
            'WirtschaftsWoche/dpa, 21.11.2026, 11:33 Uhr: „Altersvorsorge: Staatliches Depot für Zusatzrente noch nicht startklar"',
          url: 'https://www.wiwo.de/finanzen/vorsorge/altersvorsorge-staatliches-depot-fuer-zusatzrente-noch-nicht-startklar/100271734.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Goldpreis fällt auf 14-Monatstief',
      summary: [
        'Der Goldpreis ist eingebrochen. Er fiel auf den tiefsten Stand seit 14 Monaten. Am Freitag kostete die Feinunze zeitweise nur noch 3.537 Dollar, ein Minus von rund 18 Prozent seit Jahresbeginn.',
        'Terminmarktdaten zeigen einen klaren Trend. Der Anteil spekulativer Positionen ist auf ein Achtmonatstief gesunken. Die Netto-Position der großen Spekulanten fiel binnen einer Woche um 12,6 Prozent.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein sinkendes offenes Interesse bei fallenden Kursen gilt oft als Hinweis auf eine mögliche Bodenbildung, beschreibt damit aber nur die aktuelle Positionierung der Händler – keine gesicherte Trendwende.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, 21.11.2026: „Goldpreis-Crash und COMEX-Daten: War das der finale Ausverkauf?"',
          url: 'https://www.goldreporter.de/goldpreis-crash-cot-daten-comex-ausverkauf/news/263243/',
        },
        {
          label:
            'Handelsblatt, 20.11.2026, 07:50 Uhr: „Edelmetall: Gold ist 18 Prozent günstiger als zu Jahresbeginn – sollten Anleger jetzt einsteigen?"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/devisen-rohstoffe/gold-ist-die-schwaeche-des-goldpreises-eine-chance-fuer-anleger/100270306.html',
        },
      ],
    },
    {
      headline: 'Fondsmanager kürzen Tech-Quote im schnellsten Tempo seit 2006',
      summary: [
        'Fondsmanager ziehen sich aus Tech-Aktien zurück. Das zeigt die monatliche Umfrage von Bank of America. Die Übergewichtung von Technologieaktien sank binnen eines Monats von netto 37 auf 12 Prozent, der stärkste Rückgang seit Juni 2006. Befragt wurden rund 169 Fondsmanager, die zusammen mehr als 461 Milliarden Dollar verwalten.',
        'Die größte Sorge gilt einer möglichen KI-Blase. Das sagen 34 Prozent der Befragten. 52 Prozent erwarten, dass ein KI-Riese seine Investitionen bald kürzt, im Vormonat waren es erst 30 Prozent. Die Kasse der Fondsmanager ist gleichzeitig auf 3,6 Prozent gefallen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine niedrige Kasse bei hohem Risikobewusstsein zeigt vor allem, wie wenig Spielraum Fondsmanager noch haben, auf weitere Kursverluste zu reagieren – sie sagt nichts darüber, ob diese tatsächlich kommen.',
      relatedTopics: ['anlegerpsychologie'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'onvista, 21.11.2026, 08:00 Uhr, Kolumne von Heiko Böhmer: „Profis kürzen Tech-Aktien so stark wie seit 2006 nicht mehr"',
          url: 'https://www.onvista.de/news/2026/11-21-profis-kuerzen-tech-aktien-so-stark-wie-seit-2006-nicht-mehr-41121334-47-26578914',
        },
        {
          label:
            'Wealth Professional, 21.11.2026: „US fund managers drop tech to a net 12% overweight: BofA"',
          url: 'https://www.wealthprofessional.ca/investments/equity-markets/us-fund-managers-drop-tech-to-a-net-12-overweight-bofa/394053',
        },
      ],
    },
  ],
}
