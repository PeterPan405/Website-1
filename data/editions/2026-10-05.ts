import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-05.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-05 00:19 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-05',
  intro:
    'Fünf Länder melden heute ihre Dienstleistungs-PMI, am Ölmarkt treffen Huthi-Angriffe auf eine stillgehaltene Opec-Quote, Galeria meldet erneut Insolvenz an.',
  top: [
    {
      headline: 'Fünf Länder veröffentlichen heute ihre Dienstleistungs-PMI',
      summary: [
        'Fünf Länder veröffentlichen heute ihren Dienstleistungs-PMI. In Irland liegt der Wert schon vor. Der AIB Services PMI fiel von 55,4 auf 54,1 Punkte. Spanien, Italien, Frankreich und Deutschland folgen im Laufe des Vormittags.',
        'Um 9:45 Uhr spricht EZB-Vorstand Joachim Nagel. Um 10 Uhr folgt EZB-Chefökonom Philip Lane. Dazwischen meldet Deutschland seinen Einkaufsmanagerindex für den Dienstleistungssektor, erwartet bei 52,9 Punkten – genau dem Vorwert.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wenn die Prognose exakt dem letzten Wert entspricht, erwarten Ökonomen keine Veränderung – die eigentliche Marktreaktion entsteht erst bei einer Abweichung nach oben oder unten.',
      relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'euro-stoxx-50'],
      sources: [
        {
          label:
            'wallstreet-online.de, Wirtschaftskalender „Kommende Termine“, Datenstand 5.10.2026, 02:19 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Huthi-Miliz greift Ölanlagen in Saudi-Arabien an, Iran stellt Bedingungen für Hormus',
      summary: [
        'Die Huthi-Miliz im Jemen meldete Angriffe auf Ölanlagen in Saudi-Arabien. Separat kündigte Jemens Regierung eine Großoffensive gegen die Huthi-Miliz an. Beide Meldungen stammen aus der aktuellen Nachrichtenlage vom Wochenende.',
        'Iran knüpft die Öffnung der Straße von Hormus an sieben Vorbedingungen. Welche das sind, nennt die Meldung nicht. Die Lage bleibt angespannt. Der Brentpreis stand zuletzt bei 102,70 US-Dollar, unverändert zum Vortag.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Eskalation an einer wichtigen Öltransportroute gilt gewöhnlich als Risikoaufschlag für den Ölpreis – hier bewegt er sich trotzdem kaum, ein Beispiel dafür, wie unterschiedlich Nachrichtenlage und Preisreaktion ausfallen können.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online.de, Rohstoffnachrichten-Übersicht vom 5.10.2026 (dpa-AFX, Meldungen vom 4.10.2026)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Opec-Plus-Staaten lassen die Förderquote erneut unverändert',
      summary: [
        'Mehrere Opec-Plus-Staaten beschlossen, ihre Förderquote nicht anzuheben. Das meldete wallstreet-online am Wochenende. Welche Länder genau beteiligt waren und für welchen Monat die Quote gilt, nennt die Meldung nicht.',
        'Der Brentpreis notierte zuletzt bei 102,70 US-Dollar je Barrel. Das entspricht keiner Veränderung zum Vortag. Eine Förderquote ist dabei ein Versprechen auf dem Papier, keine Messung der tatsächlich gepumpten Menge.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer Ölpreis-Prognosen liest, sollte eine beschlossene Förderquote nicht automatisch mit einer entsprechenden Angebotsmenge am Markt gleichsetzen – zwischen beiden kann ein erheblicher Unterschied liegen.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online.de, Marktberichte-Übersicht vom 5.10.2026 (Meldung vom 4.10.2026)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'DAX, Dow und Nasdaq 100 stehen vorbörslich im Plus',
      summary: [
        'Der DAX stand früh am Montag bei 25.274 Punkten. Das entspricht einem Plus von 1,19 Prozent. Der Dow Jones (US 30) lag 0,46 Prozent höher bei 51.183 Punkten. Der Nasdaq 100 (US Tech 100) gewann 0,98 Prozent auf 30.808 Punkte.',
        'Gold notierte 0,16 Prozent fester bei 4.149 Dollar je Feinunze. Der Euro gab zum Dollar leicht nach, um 0,05 Prozent auf 1,1248. Diese Stände stammen von kurz nach zwei Uhr morgens, vor der offiziellen Handelseröffnung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Diese Kurse stammen aus dem vorbörslichen Handel und sind nicht dasselbe wie der offizielle Eröffnungskurs der Börsen – zwischen beiden kann es Unterschiede geben.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'dow-jones', 'nasdaq-100', 'gold', 'eur-usd'],
      sources: [
        {
          label: 'wallstreet-online.de, Kursleiste, Datenstand 5.10.2026, 02:19 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Warenhauskette Galeria stellt erneut einen Insolvenzantrag',
      summary: [
        'Die Warenhauskette Galeria hat erneut einen Insolvenzantrag gestellt. Das meldete die Nachrichtenagentur dpa-AFX in mehreren aktualisierten Fassungen. Mit-Eigentümer Beetz kritisierte den Schritt am Sonntagabend um 22:15 Uhr.',
        'Einen Grund für den erneuten Antrag nennt die Meldung nicht. Galeria hatte bereits zuvor mehrfach Insolvenz angemeldet.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Insolvenzantrag ist der Beginn eines gerichtlichen Verfahrens und bedeutet nicht automatisch die Schließung des Unternehmens – wie es bei Galeria weitergeht, ist damit noch offen.',
      relatedTopics: ['schulden-und-kredit'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'onvista.de, Aktuelle News vom 5.10.2026 (Stand 4.10.2026, 22:15 Uhr, dpa-AFX)',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'US-Häusermarkt: Jeder fünfte Verkäufer senkt den Preis',
      summary: [
        'In den USA senkt nach einem aktuellen Bericht mehr als jeder fünfte Hausverkäufer seinen Angebotspreis. Das meldete wallstreet-online unter der Überschrift „US-Häusermarkt kippt“. Genauere Zahlen oder die Datenquelle nennt die Meldung nicht.',
        'Ein gesenkter Angebotspreis ist noch kein abgeschlossener Verkauf zu einem niedrigeren Preis. Beide Kennziffern messen unterschiedliche Dinge am Immobilienmarkt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wohnkosten fließen verzögert in die US-Inflationsmessung ein – ein schwächerer Häusermarkt zeigt sich deshalb oft erst Monate später in den offiziellen Preisindizes.',
      relatedTopics: ['immobilien'],
      relatedSymbols: [],
      sources: [
        {
          label: 'wallstreet-online.de, Nachrichten-Übersicht vom 5.10.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
