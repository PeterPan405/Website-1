import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-21.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-21 02:02 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-21',
  intro:
    'Iran-Sanktionen treiben Brent auf 93 Dollar, der Euro streift 1,17 Dollar und wieder zurück, der DAX startet nach dem vierten Verlusttag.',
  top: [
    {
      headline: 'DAX startet nach dem vierten Verlusttag in Folge',
      summary: [
        'Der DAX ist gestern zum vierten Mal hintereinander gefallen und unter 26.000 Punkte gerutscht, belastet auch von schwachen Walmart-Zahlen und einem Dow unter 53.000 Punkten.',
        'Der Kalender nennt für heute britische Einzelhandelsdaten um 8 Uhr sowie französische Stimmungsindikatoren um 8:45 und 9:15 Uhr.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, wie sich eine mehrtägige Schwächephase und ein dichter Terminkalender an einem einzigen Morgen überlagern.',
      relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'dow-jones'],
      sources: [
        {
          label:
            'onvista, Tagesrückblick 20.08.2026: „Dax fällt unter 26.000 Punkte – Ölpreise steigen weiter“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'wallstreet-online, Kommende Termine, abgerufen 21.8.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Iran-Sanktionen treiben Brent auf 93 Dollar',
      summary: [
        'Die USA kündigen laut wallstreet-online die schärfsten Iran-Sanktionen aller Zeiten an, Brent steigt auf 93,21 US-Dollar, ein Plus von 1,77 Prozent.',
        'Gold legt zur gleichen Stunde nur um 0,27 Prozent zu – ein Beispiel dafür, wie unterschiedlich zwei Rohstoffe auf dieselbe Meldung reagieren können.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Macht sichtbar, dass Öl und Gold unterschiedliche Übertragungswege für dieselbe geopolitische Nachricht haben.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent', 'gold'],
      sources: [
        {
          label: 'wallstreet-online, Nachrichten: Aktien & Indizes, abgerufen 21.8.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Euro streift 1,17 Dollar und fällt gleich wieder zurück',
      summary: [
        'Der Euro stieg gestern laut dpa-AFX erstmals seit drei Monaten über 1,17 US-Dollar, notiert heute früh aber bei 1,16914 Dollar und damit wieder knapp darunter.',
        'Zeitgleich soll der Schweizer Franken dem Yen im Carry-Trade-Geschäft den Rang ablaufen, ohne dass die Meldung Zahlen dazu nennt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt an einem konkreten Beispiel, wie schnell eine als Meilenstein gemeldete Kursmarke wieder verblasst.',
      relatedTopics: ['waehrungen-wechselkurse'],
      relatedSymbols: ['eur-usd', 'eur-chf'],
      sources: [
        {
          label: 'wallstreet-online, Devisennachrichten vom 20.8.2026, dpa-AFX',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Größter Gold-ETF meldet fünfte Woche mit steigenden Beständen',
      summary: [
        'Der SPDR Gold Shares (GLD) hält laut Goldreporter inzwischen 1.034,65 Tonnen Gold – so viel wie seit Ende Mai nicht mehr, bei fünf Wochen in Folge steigenden Beständen.',
        'Das ist eine andere Kennzahl als der Goldpreis selbst, der heute früh nur moderat um 0,27 Prozent zulegt.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Verdeutlicht den Unterschied zwischen Kapitalzuflüssen in einen Fonds und der eigentlichen Kursbewegung des zugrunde liegenden Rohstoffs.',
      relatedTopics: ['etf', 'rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'Goldreporter, Meldungen & Analysen, 20. August 2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Fielmann senkt Prognose, Fresenius verkleinert FMC-Anteil',
      summary: [
        'Fielmann hat laut dpa-AFX seine Prognose wegen schwacher Nachfrage in Deutschland gesenkt, während Fresenius seine Beteiligung an der Tochter FMC weiter abbaut.',
        'Konkrete neue Zahlen zu Prognosehöhe oder Anteilsgröße liefern beide Kurzmeldungen nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt den Unterschied zwischen einer operativen Prognosekorrektur und einer Entscheidung über die Kapitalstruktur eines Konzerns.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'wallstreet-online, Unternehmensmeldungen vom 20.8.2026, dpa-AFX',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Holcim übernimmt Fermacell, DEAG plant Kapitalerhöhung',
      summary: [
        'Holcim kauft laut wO Newsflash und EQS Group den Baustoffhersteller Fermacell, Details zum Kaufpreis nennt keine der Meldungen.',
        'DEAG Deutsche Entertainment plant laut einer eigenen Ad-hoc-Meldung eine Kapitalerhöhung über 10 Millionen Euro – ein zweiter, andersartiger Weg an Kapital zu kommen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Stellt Zukauf und Kapitalerhöhung als zwei unterschiedliche Wege gegenüber, wie Unternehmen Wachstum finanzieren.',
      relatedTopics: ['aktie', 'schulden-und-kredit'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'wallstreet-online, Ad-hoc, gestern, wO Newsflash und EQS Group AG',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Panamakanal drosselt Passagen, deutsche Gasspeicher auf Rekordtief',
      summary: [
        'Wegen zu wenig Regen senkt der Panamakanal laut dpa-AFX die Zahl der Schiffspassagen, während der Gasspeicherverband für Deutschland ein Rekordtief bei den Füllständen meldet.',
        'Beide Meldungen von heute Nacht nennen keine konkreten Prozent- oder Stückzahlen und stehen unabhängig nebeneinander.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Erinnert daran, dass zwei gleichzeitige Engpassmeldungen nicht automatisch dieselbe Ursache haben müssen.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['erdgas'],
      sources: [
        {
          label: 'onvista, Aktuelle News, heute Nacht, dpa-AFX',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
}
