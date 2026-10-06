import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-06.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-06 00:11 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-06',
  intro:
    'Der Euro rutscht auf ein 17-Monats-Tief, der Nasdaq 100 markiert einen Rekord, Wadephul warnt vor russischen Plänen, und KKR kauft für Milliarden zu.',
  top: [
    {
      headline:
        'Deutsche Werkaufträge, eine BoJ-Rede und Britanniens Bau-PMI stehen heute an',
      summary: [
        'Deutschland veröffentlicht heute um acht Uhr seine Werkaufträge für September. Ökonomen erwarten ein Minus von einem Prozent, nach einem Plus von 2,5 Prozent im Vormonat. Um 8:35 Uhr spricht Bank-of-Japan-Gouverneur Kazuo Ueda.',
        'Um 10:30 Uhr folgt der britische Einkaufsmanagerindex für die Bauwirtschaft, erwartet bei 45,4 Punkten nach 44,3 im Vormonat. Um 10:40 Uhr äußert sich Bank-of-England-Ratsmitglied Catherine Mann.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein einzelner Monatswert bei den Werkaufträgen sagt wenig über einen Trend aus – solche Daten schwanken stark und ergeben erst im Mittel mehrerer Monate ein verlässliches Bild.',
      relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'wallstreet-online.de, Wirtschaftskalender „Kommende Termine“, Datenstand 6.10.2026, 02:11 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Wadephul sieht weitergehende Pläne Russlands über die Ukraine hinaus',
      summary: [
        'Bundesaußenminister Johann Wadephul sagte, Russland verfolge nach seiner Einschätzung Pläne, die über die Ukraine hinausgehen. Er nannte Georgien, Moldau und die baltischen Staaten als mögliche weitere Ziele, berichtete dpa-AFX am Montagabend um 21:10 Uhr.',
        'Wadephul verwies zudem auf einen Drohnenfund im August 2026 am Flughafen Leipzig/Halle und auf andauernde Cyberangriffe als Beispiele hybrider Bedrohungen. Deutschland sei dadurch schon jetzt betroffen, sagte er.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Geopolitische Warnungen wie diese fließen oft als Risikoprämie in die Preise von Anleihen, Währungen und Rüstungsaktien ein, lange bevor sich konkret etwas ändert.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'onvista.de, Aktuelle News vom 6.10.2026 (dpa-AFX, Meldung vom 5.10.2026, 21:10 Uhr): „Wadephul sieht weitergehende Pläne Russlands“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'zdfheute.de, Artikel abgerufen am 6.10.2026: Wadephul zu russischen Plänen über die Ukraine hinaus',
          url: 'https://www.zdfheute.de/politik/ausland/wadephul-russland-warnung-ausweitung-gefahr-ukraine-krieg-100.html',
        },
      ],
    },
    {
      headline: 'USA ziehen B-1-Bomber von britischem Stützpunkt ab, Trump nennt Drohung',
      summary: [
        'Die USA haben ihre B-1-Bomber vom britischen Stützpunkt RAF Fairford abgezogen. Das meldete dpa-AFX am Montagabend unter Berufung auf US-Präsident Donald Trump, der von einer Drohung sprach.',
        'Trump brachte die Drohung mit dem Iran in Verbindung. Zuvor waren am 27. September fünf Männer wegen des Verdachts auf Sprengstoffpläne nahe der Basis festgenommen worden, später aber ohne Anklage freigelassen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass ein Ölpreis trotz einer sicherheitspolitischen Drohung sinkt, zeigt: Angebot und Nachfrage am Markt können eine Risikowahrnehmung überwiegen.',
      relatedTopics: ['risiko-und-rendite', 'rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'onvista.de, Aktuelle News vom 6.10.2026 (dpa-AFX, Meldungen vom 5.10.2026, 20:53 und 21:10 Uhr): „ROUNDUP 4: US-Bomber aus Großbritannien abgezogen - wegen Bedrohung?“, „Doch wegen Bedrohung: Was Trump über den Bomberabzug sagt“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'aljazeera.com, Artikel vom 4.10.2026, abgerufen am 6.10.2026: Hintergrund zum Abzug der B-1-Bomber von RAF Fairford',
          url: 'https://www.aljazeera.com/news/2026/10/4/us-withdraws-b-1-bomber-aircraft-from-uks-fairford-base-amid-iran-fears',
        },
      ],
    },
    {
      headline: 'Euro fällt erstmals seit Mai 2025 unter 1,12 Dollar',
      summary: [
        'Der Euro fiel am Montag erstmals seit Mai 2025 unter 1,12 Dollar. Die Europäische Zentralbank setzte ihren Referenzkurs bei 1,1204 Dollar fest, meldete dpa-AFX. Am frühen Dienstagmorgen notierte das Paar bei 1,12153 Dollar, ein Minus von 0,06 Prozent.',
        'Grund waren laut Agenturberichten steigende Sorgen um Frankreichs Staatsschulden und die Ankündigung von Neuwahlen in Spanien für den 29. November.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Risikoaufschläge auf Staatsanleihen einzelner Euro-Länder wirken sich über den Wechselkurs auf die gesamte Gemeinschaftswährung aus, nicht nur auf das betroffene Land.',
      relatedTopics: ['waehrungen-wechselkurse', 'staatsanleihe'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'wallstreet-online.de, Devisennachrichten und Kursleiste, Datenstand 6.10.2026, 02:11 Uhr: „Devisen: Eurokurs fällt erstmals seit Mai 2025 unter 1,12 US-Dollar“, „Devisen: Eurokurs gefallen - EZB-Referenzkurs: 1,1204 US-Dollar“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'euronews.com, Artikel vom 5.10.2026, abgerufen am 6.10.2026: Euro auf 17-Monats-Tief wegen Frankreichs Schuldensorgen und Spaniens Neuwahl',
          url: 'https://www.euronews.com/2026/10/05/euro-hits-17-month-low-as-french-debt-fears-mount-and-spain-heads-for-snap-election',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Nasdaq 100 markiert Rekord, Dax stagniert',
      summary: [
        'Der Nasdaq 100 erreichte am Montag ein neues Rekordhoch, meldete dpa-AFX. Der Dow Jones (US 30) gewann an Wert. Der Dax dagegen stagnierte, dpa-AFX sprach von „Anleger sind auf der Hut“.',
        'Am Dienstagmorgen notierte der Dax bei 25.321,61 Punkten, ein Plus von 0,19 Prozent. Der Dow stand bei 51.273,75 Punkten, der Nasdaq 100 bei 31.062,84 Punkten, ein Plus von 0,83 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Rekord in einem marktbreiten US-Index und eine Stagnation in Frankfurt am selben Tag zeigen, dass unterschiedliche Indizes unterschiedliche Teile des Marktes abbilden.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'nasdaq-100', 'dow-jones'],
      sources: [
        {
          label:
            'onvista.de, Aktuelle News und Marktberichte vom 6.10.2026 (dpa-AFX, Meldungen vom 5.10.2026): „Aktien New York: Gewinne zum Wochenstart - Nasdaq 100 mit weiterem Rekord“, „ROUNDUP/Aktien Frankfurt Schluss: Stagnation - Anleger sind auf der Hut“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'wallstreet-online.de, Kursleiste, Datenstand 6.10.2026, 02:11 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Ölpreis fällt um 2,36 Prozent trotz Spannungen im Nahen Osten',
      summary: [
        'Der Ölpreis der Sorte Brent fiel am Montag um 2,36 Prozent auf 100,28 Dollar je Barrel. Dpa-AFX nannte sinkende Ölpreise neben den Kursgewinnen als Merkmal des New Yorker Handelstags.',
        'G7-Staaten gaben zusammen 100 Millionen Barrel Diesel und Rohöl aus ihren Notreserven frei, und Saudi-Arabien senkte seinen offiziellen Verkaufspreis für Asien um 3 Dollar je Barrel.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass der Ölpreis trotz anhaltender Konfliktlage fällt, zeigt, wie stark zusätzliches Angebot – etwa aus Notreserven – eine Risikoprämie überdecken kann.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online.de, Aktuelle Rohstoffpreise, Datenstand 6.10.2026, 02:11 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'onvista.de, Marktberichte vom 6.10.2026 (dpa-AFX, Meldung vom 5.10.2026, 20:39 Uhr): „ROUNDUP/Aktien New York Schluss: Gewinne zum Wochenstart - Ölpreise sinken“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'boersennews.de, Artikel vom 5.10.2026, abgerufen am 6.10.2026: „Ölpreis unter Spannung: Notreserven treffen auf neue Angebotsrisiken“',
          url: 'https://www.boersennews.de/nachrichten/artikel/boersennews/oelpreis-unter-spannung-notreserven-treffen-auf-neue-angebotsrisiken/5300522/',
        },
      ],
    },
    {
      headline: 'Gold gibt leicht nach, Silber legt am selben Morgen zu',
      summary: [
        'Gold notierte am frühen Dienstagmorgen bei 4.134,90 Dollar je Feinunze, ein Minus von 0,12 Prozent. Silber stieg im selben Zeitraum um 1,33 Prozent auf 61,10 Dollar je Feinunze, meldete wallstreet-online.',
        'Goldreporter.de berichtete, der schwache Euro verstärke den Anstieg des Goldpreises in Euro gerechnet, auch wenn der Dollarpreis selbst kaum nachgab.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Weil Gold in Dollar notiert wird, kann sein Preis in Euro steigen, selbst wenn er in Dollar kaum nachgibt – allein durch die Abwertung der eigenen Währung.',
      relatedTopics: ['rohstoffe', 'waehrungen-wechselkurse'],
      relatedSymbols: ['gold', 'silber', 'eur-usd'],
      sources: [
        {
          label:
            'wallstreet-online.de, Aktuelle Rohstoffpreise, Datenstand 6.10.2026, 02:11 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'goldreporter.de, Top-News und Ausblick Gold vom 5.10.2026: „Goldpreis heute: Euro fällt auf 17-Monats-Tief – Gold steigt“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'KKR übernimmt Fondsverwalter Gen II für über 5,1 Milliarden Dollar',
      summary: [
        'Die Beteiligungsgesellschaft KKR kündigte an, den Fondsdienstleister Gen II Fund Services von den bisherigen Eigentümern Hg und General Atlantic zu übernehmen. Der Deal bewertet Gen II mit mehr als 5,1 Milliarden Dollar, meldete Business Wire.',
        'Gen II betreut nach eigenen Angaben mehr als 275 Investmentmanager mit zusammen über 2 Billionen Dollar verwaltetem Vermögen. Der Abschluss wird für 2027 erwartet.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein Fondsverwalter wie Gen II verdient unabhängig davon, ob die von ihm verwalteten Fonds selbst gerade gut oder schlecht laufen – ein Geschäftsmodell abseits der Kursschwankungen.',
      relatedTopics: ['fonds'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'onvista.de, Aktuelle Nachrichten vom 6.10.2026 (Business Wire, Meldung vom 5.10.2026, 1:30 Uhr): „KKR to Acquire Gen II Fund Services for More Than $5 Billion from Hg and General Atlantic“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'financialcontent.com, Pressemitteilung vom 5.10.2026, abgerufen am 6.10.2026',
          url: 'https://www.financialcontent.com/article/bizwire-2026-10-5-kkr-to-acquire-gen-ii-fund-services-for-more-than-5-billion-from-hg-and-general-atlantic',
        },
      ],
    },
  ],
}
