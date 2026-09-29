import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-23.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-23 00:56 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-23',
  intro:
    'USA und Iran sprechen erstmals direkt, Selenskyj bietet eine Teil-Waffenruhe an, und heute stehen die Einkaufsmanagerindizes für Deutschland und Frankreich an.',
  top: [
    {
      headline:
        'Einkaufsmanagerindizes für Frankreich, Deutschland und die Eurozone stehen heute an',
      summary: [
        'Um 9:15 Uhr erscheinen die vorläufigen Einkaufsmanagerindizes für Frankreich, um 9:30 Uhr die für Deutschland und um 10:00 Uhr der Industrie-Einkaufsmanagerindex für die gesamte Eurozone; zuvor spricht um 9:00 Uhr EZB-Ratsmitglied Boris Vujcic.',
        'Die Prognosen gehen auseinander: Für die deutsche Industrie wird mit 54,5 nach zuvor 54,3 Punkten ein Wert oberhalb der Wachstumsschwelle von 50 erwartet, der französische Gesamtindex lag zuletzt bei 48,5 Punkten und damit darunter.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Einkaufsmanagerindizes gelten als früher Hinweis auf die Konjunkturentwicklung und fließen in die Zinserwartungen der Europäischen Zentralbank ein, noch bevor amtliche Wachstumszahlen vorliegen.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax', 'euro-stoxx-50'],
      sources: [
        {
          label: 'wallstreet-online, Kommende Termine, Stand 23.09.2026, 00:56 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'USA und Iran sprechen erstmals seit Kriegsbeginn direkt miteinander',
      summary: [
        'Am Rande der UN-Generalversammlung in New York trafen sich laut US-Präsident Donald Trump Vertreter der USA und des Iran zu einem rund dreistündigen Gespräch, das Trump als „sehr gut“ bezeichnete – der erste bestätigte direkte Kontakt seit Kriegsbeginn im Februar.',
        'In seiner UN-Rede stellte Trump dem Iran ein Abkommen zur wirtschaftlichen Öffnung oder die „Vernichtung der Islamischen Republik“ in Aussicht und drohte mit möglichen Angriffen auf die Atomanlage „Pickaxe Mountain“.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Straße von Hormus ist ein zentraler Transportweg für die weltweite Ölversorgung; jede Nachricht über Entspannung oder Eskalation im Iran-Konflikt verändert den Risikoaufschlag im Ölpreis, unabhängig von tatsächlich geförderten Mengen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            't-online, Meldung vom 22.09.2026: „Trump: Vertreter der USA und des Irans haben sich getroffen“',
          url: 'https://www.t-online.de/nachrichten/ausland/id_101447804/trump-vertreter-der-usa-und-des-irans-haben-sich-getroffen.html',
        },
      ],
    },
    {
      headline: 'Selenskyj bietet Teil-Waffenruhe an, der Kreml lehnt sofort ab',
      summary: [
        'Nach einem Treffen mit Trump in New York bot der ukrainische Präsident Wolodymyr Selenskyj an, keine Angriffe mehr auf den russischen Energiesektor durchzuführen, sofern Russland im Gegenzug ukrainische Energieanlagen, weitere Infrastruktur und Lebensmittelexporte verschont.',
        'Kremlsprecher Dmitri Peskow lehnte den Vorschlag noch am selben Tag ab: Präsident Putin sei „einer dauerhaften Friedensregelung verpflichtet, nicht einer Waffenruhe, die grundsätzlich nichts bringt“.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Waffenruhe und ein Friedensvertrag sind unterschiedliche rechtliche Zustände; dass der Kreml ausdrücklich Ersteres ablehnt und Letzteres verlangt, zeigt das Ausmaß der verbleibenden Differenzen zwischen den Kriegsparteien.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'investing.com, dpa-AFX, Meldung vom 22.09.2026: „Selenskyj: Ukraine bereit zu begrenzter Waffenruhe“',
          url: 'https://de.investing.com/news/world-news/selenskyj-ukraine-bereit-zu-begrenzter-waffenruhe-3673295',
        },
      ],
    },
    {
      headline:
        'Trump empfängt Xi am Donnerstag – der Zollwaffenstillstand steht im Mittelpunkt',
      summary: [
        'Am Donnerstag trifft Chinas Staats- und Parteichef Xi Jinping in Washington auf US-Präsident Trump; im Zentrum steht laut Yahoo Finance, ob der am 10. November auslaufende Zollwaffenstillstand zwischen beiden Ländern verlängert wird.',
        'Auf der Agenda stehen zudem Käufe amerikanischer Boeing-Flugzeuge und Agrargüter durch China, eine mögliche Lockerung von Exportbeschränkungen bei Seltenen Erden sowie die Taiwan-Frage.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Solange offen ist, ob der Zollwaffenstillstand verlängert wird, preisen die Märkte eine Wahrscheinlichkeit ein; das Treffen liefert eine von zwei möglichen Antworten mit Auswirkungen auf Unternehmen mit China-Geschäft.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['dax', 'nasdaq-100'],
      sources: [
        {
          label:
            'Yahoo Finance, Meldung vom 22.09.2026: „Gipfeltreffen zwischen Trump und Xi: Diese Themen stehen auf der Agenda“',
          url: 'https://de.finance.yahoo.com/nachrichten/gipfeltreffen-zwischen-trump-xi-diese-092720683.html',
        },
      ],
    },
    {
      headline:
        'Saudi-Arabien nimmt Pipeline wieder in Betrieb, Brent fällt unter 100 Dollar',
      summary: [
        'Saudi-Arabien hat seine nach einem Drohnenangriff seit dem 13. September stillgelegte Ost-West-Pipeline wieder in Betrieb genommen und exportiert wieder Rohöl über den Hafen Yanbu; während der Störung waren Verladungen über die Straße von Hormus auf den höchsten Stand seit mindestens Juni gestiegen.',
        'Mit Wiederinbetriebnahme und zusätzlichen Golf-Verladungen fiel Brent laut The National auf 97,81 US-Dollar und damit erstmals seit Wochen unter die Marke von 100 Dollar; in der Nacht auf Mittwoch notierte der Preis laut finanzen.net bei 98,63 US-Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wenn ein Angebotsausfall durch eine tragfähige Ausweichroute kompensiert wird, kann die Wiederherstellung der ursprünglichen Route zwei Lieferwege gleichzeitig verfügbar machen und den Preis stärker drücken, als der Ausfall ihn zuvor angehoben hatte.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'The National, Meldung vom 22.09.2026: „Saudi Arabia restarts East-West pipeline for crude exports“',
          url: 'https://www.thenationalnews.com/business/energy/2026/09/22/saudi-arabia-restarts-east-west-pipeline-for-crude-exports/',
        },
      ],
    },
    {
      headline: 'Dow fällt, Nasdaq erreicht Rekord – ausgelöst von derselben KI-Sorge',
      summary: [
        'Der Dow Jones verlor am Dienstag 0,36 Prozent auf 51.863,69 Punkte, während der Nasdaq 100 um 0,82 Prozent auf 30.732,40 Punkte stieg und im Handelsverlauf mit 30.770 Punkten ein Rekordhoch erreichte; Bankaktien wie JPMorgan, Morgan Stanley und Wells Fargo verloren laut dpa-AFX bis zu 4 Prozent.',
        'Als Grund nennt dpa-AFX die Sorge, KI-Werkzeuge wie Metas neuer Assistent „Muse“ könnten Geschäftsmodelle beeinträchtigen, die auf Verbraucherträgheit beruhen; Amgen gewann nach positiven Studienergebnissen 4,3 Prozent, Shopify 7,1 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dieselbe Nachricht kann je nach Branche gegensätzlich wirken: belastend für Geschäftsmodelle, die eine neue Technologie bedroht, treibend für die Aktien der Anbieter dahinter – ein Gesamtindex zeigt davon nur den Mittelwert.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dow-jones', 'nasdaq-100'],
      sources: [
        {
          label:
            'finanzen.net, Meldung vom 22.09.2026: „ROUNDUP/Aktien New York Schluss: Dow schwächelt - Nasdaq mit Rekord“',
          url: 'https://www.finanzen.net/nachricht/aktien/roundup-aktien-new-york-schluss-dow-schwaechelt-nasdaq-mit-rekord-15947516',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'Siemens erhält an einem Tag zwei Milliardenaufträge – aus Vietnam und Österreich',
      summary: [
        'Siemens Mobility unterschrieb laut finanzen.at einen Turnkey-Vertrag mit der Vingroup-Tochter Vinspeed über bis zu einer Milliarde Euro für zwei Hochgeschwindigkeitsstrecken in Vietnam, inklusive zehn Zügen des Typs Velaro Novo.',
        'Am selben Tag beauftragte die ÖBB-Infrastruktur AG Siemens laut ariva.de mit digitaler Stellwerkstechnik im Volumen von 1,3 Milliarden Euro, deren Einführung ab 2030 beginnen soll.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Auftragseingang wird gebucht, sobald der Vertrag unterschrieben ist; Umsatz und Gewinn daraus entstehen erst über die Projektlaufzeit – eine Milliardenschlagzeile sagt für sich genommen nichts darüber, wann sie in den Quartalszahlen ankommt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['siemens', 'dax'],
      sources: [
        {
          label:
            'finanzen.at, Meldung vom 22.09.2026: „Siemens-Aktie im Plus: Bauauftrag eines Hochgeschwindigkeitsnetzes in Vietnam – Großauftrag auch aus Österreich“',
          url: 'https://www.finanzen.at/nachrichten/aktien/siemens-aktie-im-plus-bauauftrag-eines-hochgeschwindigkeitsnetzes-in-vietnam-grossauftrag-auch-aus-oesterreich-1036563188',
        },
      ],
    },
    {
      headline: 'Schweizer Goldexporte steigen im August um 81 Prozent',
      summary: [
        'Die Schweiz exportierte im August laut Goldreporter 156,5 Tonnen Gold im Wert von rund 18,8 Milliarden Euro, ein Plus von 81 Prozent gegenüber Juli; größter Abnehmer war Großbritannien mit 102 Tonnen, gefolgt von China mit 26 Tonnen.',
        'Der Goldpreis selbst war am Dienstag zeitweise unter 4.350 US-Dollar gefallen, belastet von einer Rendite zehnjähriger US-Staatsanleihen von 4,97 Prozent, und notierte in der Nacht auf Mittwoch laut finanzen.net wieder bei 4.359 US-Dollar.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Hohe Anleiherenditen mindern die Attraktivität des zinslosen Goldes, während geopolitische Unsicherheit seine Nachfrage als sicherer Vermögenswert erhöht – dass der Preis kaum von der Stelle kam, spricht dafür, dass sich beide Kräfte an diesem Tag ungefähr ausglichen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Meldung vom 22.09.2026: „Internationale Gold-Lieferungen der Schweiz steigen um 80 Prozent“',
          url: 'https://www.goldreporter.de/schweizer-goldexporte-august-2026/news/262042/',
        },
      ],
    },
  ],
}
