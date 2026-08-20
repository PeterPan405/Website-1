import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-20.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-20 01:55 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-20',
  intro:
    'Fed-Protokoll zeigt drei Falken, Gold fällt vom Rekord zurück, Moderna springt 177 Prozent – und der Kalender bringt deutsche Erzeugerpreise.',
  top: [
    {
      headline: 'Fed-Protokoll: Drei Notenbanker wollten die Zinsen erhöhen',
      summary: [
        'Finanzen.net meldet, das jüngste Fed-Protokoll zeige drei Befürworter einer Zinserhöhung – eine Begründung dafür liefert die Kurzmeldung nicht.',
        'Der Wirtschaftskalender nennt für heute außerdem deutsche Erzeugerpreise um 8 Uhr, den Bundesbank-Monatsbericht um 12 Uhr sowie US-Arbeitsmarktdaten und eine Fed-Rede am Nachmittag.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zeigt, wie gespalten die Notenbank hinter einer nach außen ruhig wirkenden Entscheidung tatsächlich war, und nennt konkrete Termine für den heutigen Tag.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 19.8.2026: Fed-Protokoll sorgt für Aufsehen: Drei Notenbanker wollten Zinserhöhung',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'wallstreet-online, Wirtschaftskalender „Kommende Termine“, abgerufen 20.8.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Moderna springt um 177 Prozent nach erfolgreicher Melanom-Studie',
      summary: [
        'Gleich drei Portale melden übereinstimmend, Moderna-Aktien seien nach einer erfolgreichen Melanom-Studie um 177 Prozent gestiegen, verknüpft mit dem Namen Merck & Co.',
        'Konkrete Studiendaten oder die genaue Handelsphase des Sprungs nennen die Kurzmeldungen nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Extrembeispiel dafür, wie stark ein einzelnes binäres Ereignis den Kurs einer Einzelaktie bewegen kann – anders als bei einem breiten Index.',
      relatedTopics: ['risiko-und-rendite', 'anlegerpsychologie'],
      relatedSymbols: ['moderna', 'merck'],
      sources: [
        {
          label:
            'dpa-AFX über finanzen.net, News vom 19.8.2026, 20:35 Uhr: AKTIEN IM FOKUS 3: Moderna steigen um 177 Prozent - Erfolgreiche Melanom-Studie',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'Gold erreicht nach verdoppelten US-Anleihekäufen ein Rekordhoch – und gibt am Morgen wieder nach',
      summary: [
        'Goldreporter meldet, verdoppelte US-Rückkäufe lang laufender Staatsanleihen hätten Renditen und Dollar gedrückt und den Goldpreis auf ein Rekordhoch von 4.440 US-Dollar getrieben.',
        'Am frühen Morgen zeigen finanzen.net und wallstreet-online den Kurs zur gleichen Uhrzeit mit leicht unterschiedlichen Zahlen, aber übereinstimmend im Minus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erklärt den Mechanismus, über den ein Anleiheprogramm den Goldpreis bewegt, und zeigt, dass ein Rekord am Vortag eine rote Handelsphase am nächsten Morgen nicht ausschließt.',
      relatedTopics: ['rohstoffe', 'staatsanleihe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, Meldungen & Analysen, 19. August 2026: USA stützen Anleihemarkt – Goldpreis springt über 4.400 Dollar',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'finanzen.net und wallstreet-online, Kursleisten, Stand 20.8.2026, ca. 3:55 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'Brent bleibt nach einer Rally erhöht, während Gold zur gleichen Stunde nachgibt',
      summary: [
        'Nach einem gestrigen Anstieg um 1,16 Prozent notiert Brent auch heute früh noch über 91 US-Dollar, während Gold laut denselben Portalen zur gleichen Zeit im Minus steht.',
        'Eine Iran-Schlagzeile auf derselben Startseite nennt weder Datum noch einen belegten Zusammenhang zur Ölpreisbewegung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt an einem konkreten Morgen, dass zwei oft als „Krisenbarometer“ bezeichnete Rohstoffe unterschiedlichen Treibern folgen und nicht zwangsläufig gleichlaufen.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent', 'gold'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffnachrichten vom 19.8.2026, Markt Bote: Ölpreis: Ölmarkt mit Rally: Brent steigt +1,16 % auf 92,37 USD',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Trump pausiert Kanada-Zölle für eine Pipeline, der Euro erreicht ein Mehrmonatshoch',
      summary: [
        'Finanzen.net meldet eine Zollpause gegen Kanada im Tausch gegen eine Öl-Pipeline, während wallstreet-online unabhängig davon einen Euro-Höchststand seit Ende Mai vermeldet.',
        'Am Morgen hat sich die Euro-Rally in den Kursleisten bereits wieder beruhigt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erinnert daran, dass zwei Meldungen vom selben Tag nicht automatisch denselben Auslöser haben müssen, nur weil beide den Dollar betreffen.',
      relatedTopics: ['waehrungen-wechselkurse'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 19.8.2026: Kurz vor Deadline-Ende: Trump pausiert Zölle gegen Kanada und will dafür Öl-Pipeline',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'wallstreet-online, Devisennachrichten vom 19.8.2026, dpa-AFX: Devisen: Euro steigt zum US-Dollar auf den höchsten Stand seit Ende Mai',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Palantir: Starkes Quartal, offene Frage zur Bewertung',
      summary: [
        'Finanzen.net meldet ein starkes Palantir-Quartal, stellt in derselben Überschrift aber die Frage, wie tragfähig die Bewertung nach der vorangegangenen Rally noch ist.',
        'Konkrete Zahlen zu Umsatz, Gewinn oder Kursanstieg liefert die Kurzmeldung nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein gutes Quartal und eine hohe Bewertung sind zwei getrennte Fragen – die zweite lässt sich nicht allein aus der ersten beantworten.',
      relatedTopics: ['risiko-und-rendite', 'wann-kaufen-verkaufen'],
      relatedSymbols: ['palantir'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 19.8.2026: Palantir-Aktie nach starkem Quartal: Wie tragfähig ist die Bewertung nach der Rally?',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
