import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-15.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-15 00:19 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-15',
  intro:
    'Ein Tanker brennt in der Straße von Hormus, Gold fällt trotzdem, KI-Aktien schwächeln – und heute kommen Zahlen aus London und Paris.',
  top: [
    {
      headline: 'Öltanker explodiert in der Straße von Hormus',
      summary: [
        'In der wichtigen Öl-Meerenge Straße von Hormus ist laut dpa-AFX ein Tanker explodiert, die Meldung nennt die iranischen Revolutionsgarden im Zusammenhang.',
        'Zwei Finanzportale zeigten den Ölpreis Brent zur gleichen Uhrzeit mit sehr unterschiedlichen Tagesveränderungen – ein Hinweis auf unterschiedliche Vergleichsbasen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Zuspitzung an einer zentralen Öltransportroute kann die Ölpreise weltweit bewegen – wichtig für alles, was von Energiekosten abhängt.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'onvista, Agentur-Meldungen vom 14.09.2026, 20:33 Uhr (dpa-AFX): „ROUNDUP/Revolutionsgarden: Öltanker in Straße von Hormus explodiert“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Gold fällt trotz eskalierendem Nahost-Konflikt',
      summary: [
        'Der Goldpreis gab laut Goldreporter am Montag nach, obwohl der Ölpreis wegen der Nahost-Spannungen gleichzeitig über 107 Dollar stieg.',
        'Als möglichen Gegenspieler nennt eine zweite Meldung deutlich gestiegene US-Marktzinsen, die zinslos gehaltenes Gold rechnerisch teurer machen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Wer Gold als verlässlichen Krisenschutz einplant, sollte wissen, dass auch andere Kräfte wie das Zinsniveau den Preis an einzelnen Tagen überlagern können.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Top-News und Marktbericht vom 14.09.2026: „Goldpreis fällt zum Wochenstart – Nahost-Spannungen treiben den Ölpreis“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'KI-Aktien schwächer, Cybersicherheits-Aktien fester',
      summary: [
        'Nvidia, AMD, Super Micro, Micron und Infineon gaben laut finanzen.net am Montag unter „KI-Sorgen“ nach, ohne dass die Übersicht einen konkreten Auslöser nennt.',
        'CrowdStrike und Palo Alto stiegen am selben Tag – ein Beleg dafür, dass die Sammelbezeichnung „KI-Aktien“ Unternehmen mit unterschiedlichen Geschäftsmodellen zusammenfasst.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer ein ganzes Themenfeld wie „KI-Aktien“ als Einheit behandelt, übersieht, dass einzelne Geschäftsmodelle innerhalb dieses Feldes gegensätzlich reagieren können.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 14.09.2026: „Aktien von CrowdStrike, Palo Alto & Co. im Höhenflug: Darum trotzen Cybersicherheits-Titel den KI-Sorgen“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Rheinmetall: neuer Großauftrag, Aktie unter 1.000 Euro',
      summary: [
        'Rheinmetall erhielt laut finanzen.net einen neuen Millionenauftrag für sein Munitionsgeschäft, hielt die runde 1.000-Euro-Marke im Aktienkurs aber nicht.',
        'Am selben Tag stand der gesamte DAX laut finanzen.net wegen der Fed-Erwartung und der Sorgen um Öl und KI-Aktien ohnehin unter Druck.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Fall zeigt, dass ein guter Auftragseingang allein nicht reicht, wenn der Gesamtmarkt an diesem Tag in eine andere Richtung läuft.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['rheinmetall'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 14.09.2026: „Rheinmetall-Aktie hält 1.000-Euro-Marke nicht: Neuer Millionenauftrag treibt Munitionsgeschäft“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'WashTec ändert die Prognose, CEWE kauft eigene Aktien zurück',
      summary: [
        'WashTec veröffentlichte laut wallstreet-online eine Ad-hoc-Mitteilung zu einer geänderten Ergebniserwartung 2026, ohne die Richtung der Änderung in der Schlagzeile zu nennen.',
        'CEWE beschloss am selben Tag per Ad-hoc einen Aktienrückkauf – ein Instrument, das die Aktienzahl verringert, statt Geld direkt als Dividende auszuzahlen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Beide Meldungen zeigen unterschiedliche Wege, wie Unternehmen mit Kapital und Erwartungen umgehen – Prognoseänderung auf der einen, Kapitalrückgabe auf der anderen Seite.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'wallstreet-online, wO Newsflash vom 14.09.2026: „CEWE Stiftung beschließt Aktienrückkauf – das müssen Anleger wissen“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Wirtschaftskalender: Großhandelspreise, britischer Arbeitsmarkt, Frankreichs Inflation',
      summary: [
        'Heute stehen laut wallstreet-online der deutsche Großhandelspreisindex, mehrere britische Arbeitsmarktdaten und Frankreichs finale Verbraucherpreise auf dem Kalender.',
        'Die britischen Daten zeigen laut Prognose gleichzeitig abkühlende Lohnzuwächse und eine steigende Arbeitslosenquote – zwei Signale, die in dieselbe Richtung weisen.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Diese Zahlen laufen einen Tag vor der erwarteten Fed-Zinsentscheidung und zeigen, dass auch andere Notenbanken und Volkswirtschaften diese Woche im Blick behalten werden.',
      relatedTopics: ['inflation'],
      relatedSymbols: ['eur-gbp'],
      sources: [
        {
          label: 'wallstreet-online, Kommende Termine, Stand 15.09.2026, 00:19 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
