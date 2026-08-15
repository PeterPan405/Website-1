import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-15.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-15 01:53 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-15',
  intro:
    'DAX knapp am Rekord vorbei, Öl steigt trotz gesenkter Nachfrageprognosen, Silber zieht an Gold vorbei – und zwei KI-Konzerne holen sich frisches Geld.',
  top: [
    {
      headline: 'DAX verpasst laut mehreren Agenturen die Bestmarke, SAP klettert weiter',
      summary: [
        'Drei Meldungen von dpa-AFX und eine von Reuters sagen am Freitagabend übereinstimmend, der Dax habe seine Bestmarke knapp verpasst, während SAP zulegte.',
        'Eine Meldung von finanzen.net spricht dagegen von einem stärkeren Wochenschluss – ein Beleg dafür, wie unterschiedlich selbst einfache Fakten berichtet werden.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass selbst am Handelstag verbreitete Fakten wie ein Rekordschluss zwischen Agenturen und Portalen abweichen können.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'dpa-AFX über onvista, News-Ticker vom 14.8.2026, 16:16 Uhr',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'Reuters über onvista, News-Ticker vom 14.8.2026, 16:35 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline:
        'Öl steigt nach Trumps Hormus-Drohung, Kupfer fällt trotz Rallye-Erwartung',
      summary: [
        'Brent legte laut einer Meldung um bis zu 1,81 Prozent zu, nachdem Trump angekündigt haben soll, die Straße von Hormus zu US-Territorium machen zu wollen.',
        'Kupfer bewegte sich in die andere Richtung und gab nach, obwohl Charttechniker laut einem Bericht kurz zuvor eine große Rallye erwartet hatten.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein Beispiel dafür, dass geopolitische Risiken und Charttechnik zwei Rohstoffe gleichzeitig in entgegengesetzte Richtungen bewegen können.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'kupfer'],
      sources: [
        {
          label: 'dpa-AFX über onvista, News-Ticker vom 14.8.2026, 20:29 Uhr',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'wallstreetONLINE Redaktion, Meldung vom 13.8.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Silber springt 1,71 Prozent nach oben, Gold bleibt fast bewegungslos',
      summary: [
        'Silber legte laut Markt Bote am Freitag 1,71 Prozent auf 65,58 Dollar zu, während Gold in zwei verschiedenen Kursleisten zwischen 0,0 und 0,6 Prozent zeigt.',
        'Société Générale nennt nachlassende Zinserwartungen als gemeinsamen Treiber für Edelmetalle – Silber hat daneben einen eigenen industriellen Nachfrageanteil.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Verdeutlicht, dass eng verwandte Edelmetalle sich an einem einzelnen Handelstag unterschiedlich stark bewegen können.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['silber', 'gold'],
      sources: [
        {
          label: 'Markt Bote über wallstreet-online, Meldung vom 14.8.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label: 'Börse Frankfurt, Aktuelle Rohstoffpreise, abgerufen 15.8.2026',
          url: 'https://www.boerse-frankfurt.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'VW will laut einem Bericht seine Traton-Beteiligung verkaufen',
      summary: [
        'Ein Bericht der wallstreetONLINE-Redaktion spricht von einem „Milliarden-Plan“, mit dem Volkswagen sich von seiner Nutzfahrzeugholding Traton trennen wolle.',
        'Zu Umfang, Preis oder Zeitpunkt des möglichen Verkaufs nennt die Kurzmeldung keine Angaben.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein möglicher Beteiligungsverkauf würde die Konzernstruktur von Volkswagen verändern und Kapital freisetzen können.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label: 'wallstreetONLINE Redaktion, Meldung vom 14.8.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'NVIDIA und Goldman Sachs sollen an handelbaren KI-Krediten arbeiten',
      summary: [
        'Eine vorsichtig formulierte Meldung spricht von einem Deal, mit dem NVIDIA und Goldman Sachs KI-Kredite handelbar machen wollen – Details fehlen.',
        'Am selben Tag meldete finanzen.net, AMD habe sich nach einer Rekord-Finanzierung einen Milliarden-Deal für die eigene KI-Expansion gesichert.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Passt zu einer Warnung von Goldman Sachs vom 11. August, wonach der KI-Boom zunehmend auf Kredit statt auf Eigenkapital läuft.',
      relatedTopics: ['aktie', 'schulden-und-kredit'],
      relatedSymbols: ['nvidia', 'amd'],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 14.8.2026',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
