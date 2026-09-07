import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-02.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-02 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-02',
  intro:
    'DAX startet schwach in den September, NIO überzeugt und die Aktie fällt trotzdem – hinter Anthropics 35-Milliarden-Dollar-Deal steckt Nvidia gleich zweifach.',
  top: [
    {
      headline: 'DAX fällt zum zweiten Tag in Folge – heute entscheiden ADP und die BoC',
      summary: [
        'Der DAX schloss laut finanzen.net am Dienstag unter der Marke von 26.000 Punkten, an der Wall Street ging es laut dpa-AFX zum Handelsende ebenfalls bergab – als Grund werden vor allem Inflationssorgen bei Technologiewerten genannt.',
        'Um 14:15 Uhr kommt der US-Arbeitsmarktbericht von ADP, um 15:45 Uhr entscheidet die kanadische Notenbank BoC über ihren Leitzins – laut wallstreet-online wird dort keine Änderung der aktuell 2,25 Prozent erwartet.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt den Unterschied zwischen einem Frühindikator und dem eigentlichen Bericht und liefert die konkreten Uhrzeiten, zu denen heute neue Zahlen die Richtung mitbestimmen können.',
      relatedTopics: ['wie-funktioniert-der-markt', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dax', 'nasdaq-100'],
      sources: [
        {
          label:
            'finanzen.net, „Heute im Fokus" vom 1.9.2026: „DAX schließt unter 26.000-Punkten -- Wall Street letztlich tiefer"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'wallstreet-online, Wirtschaftskalender „Kommende Termine", Abruf 2.9.2026, 00:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'NIO verbessert sich massiv – die Aktie fällt trotzdem um vier Prozent',
      summary: [
        'NIO lieferte im zweiten Quartal 2026 laut finanzen.net 107.658 Fahrzeuge aus, 49,4 Prozent mehr als im Vorjahr, bei einem Umsatzplus von 69,1 Prozent und einem von 4,99 Milliarden auf 528 Millionen Yuan geschrumpften Nettoverlust.',
        'Trotz dieser Verbesserung fiel die NIO-Aktie am Tag der Meldung um 4,14 Prozent – ein Hinweis darauf, dass die Zahlen hinter den Erwartungen des Marktes zurückblieben, auch wenn die Quelle das nicht ausdrücklich benennt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt an einem Extrembeispiel, dass Kurse auf die Lücke zur Erwartung reagieren und nicht allein auf die Verbesserung gegenüber dem Vorjahr.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 1.9.2026: „NIO-Aktie im Fokus: Auslieferungen springen um 49 Prozent an, Verlust schrumpft deutlich"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'finanzen.net, Meldung vom 1.9.2026: „Auslieferungen ziehen an: NIO-Aktie im Fokus"',
          url: 'https://www.finanzen.net/nachricht/aktien/auslieferungen-ziehen-an-nio-aktie-im-fokus-auslieferungen-springen-um-49-prozent-an-verlust-schrumpft-deutlich-00-15911596',
        },
      ],
    },
    {
      headline:
        'Nvidia steckt mittendrin: Anthropic mietet für 35 Milliarden Dollar Cloud-Kapazität',
      summary: [
        'Anthropic hat sich laut Reuters einen Cloud-Rechenvertrag über 35 Milliarden US-Dollar mit dem Nvidia-nahen Anbieter Lambda gesichert, der Rechenkapazität auf Basis von Nvidia-Chips liefert.',
        'Nvidia ist damit sowohl Chip-Lieferant als auch Geldgeber von Lambda – ein Kreislaufgeschäft, bei dem ein Teil der gemeldeten Nachfrage nach Nvidia-Technik aus dem eigenen Beteiligungsnetz stammt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt an einem konkreten Deal, wie eng Kunden, Lieferanten und Investoren in der KI-Infrastruktur mittlerweile miteinander verflochten sind.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 1.9.2026: „NVIDIA-Aktie im Fokus: Milliarden-Deal von Anthropic mit NVIDIA-Investment Lambda"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'Reuters/Investing.com, Meldung vom 31.8.2026: „Anthropic signs $35 billion cloud deal with Nvidia-backed Lambda, source says"',
          url: 'https://www.investing.com/news/stock-market-news/anthropic-signs-35-billion-cloud-deal-with-nvidiabacked-lambda-source-says-4883414',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Volkswagen fliegt aus dem Euro Stoxx 50 – Engie und Nokia kommen rein',
      summary: [
        'Der Indexbetreiber Stoxx tauscht laut finanzen.net zum 21. September Volkswagen und Wolters Kluwer gegen Engie und Nokia im Euro Stoxx 50 aus – eine Begründung für den VW-Rauswurf liefert die Meldung nicht.',
        'Parallel dazu trifft sich laut wallstreet-online am Freitag der Aufsichtsrat von Volkswagen, um über drei konkurrierende Sanierungspläne zu entscheiden.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erklärt am konkreten Fall, dass Indexwechsel an der Marktkapitalisierung hängen und automatisch auch Indexfonds zum Nachkauf oder Verkauf zwingen.',
      relatedTopics: ['wie-funktioniert-der-markt', 'aktie'],
      relatedSymbols: ['volkswagen', 'euro-stoxx-50'],
      sources: [
        {
          label:
            'finanzen.net, Meldung vom 1.9.2026: „INDEXÄNDERUNG/Engie und Nokia ersetzen VW und Prosus im Euro-Stoxx-50"',
          url: 'https://www.finanzen.net/nachricht/aktien/indexaenderung-engie-und-nokia-ersetzen-vw-und-prosus-im-euro-stoxx-50-15913151',
        },
        {
          label:
            'onvista, Neueste Marktberichte vom 1.9.2026 (dpa-AFX): „INDEX-MONITOR/Krisenfolge: Volkswagen (VW) muss EuroStoxx 50 verlassen"',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Hugo Boss stoppt Aktienrückkauf mitten im Machtkampf mit Frasers',
      summary: [
        'Hugo Boss hat sein erst am 24. August gestartetes Rückkaufprogramm laut finanzen.net bereits am 1. September wieder beendet, nachdem Großaktionär Frasers Group ankündigte, seinen Anteil von 47,89 Prozent auf über 50 Prozent aufstocken zu wollen.',
        'Frasers kündigte zugleich an, seine Unterstützung für Aufsichtsratschef Stephan Sturm zu überprüfen – Hugo Boss selbst bezeichnet den Rückkaufstopp als Reaktion auf den Einstieg von Frasers, ohne den Mechanismus näher zu erklären.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, dass Aktienrückkäufe im Unterschied zu Dividenden jederzeit widerrufbar sind, besonders wenn ein Großaktionär nach der Kontrolle greift.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'wallstreet-online, Ad-hoc-Nachrichten vom 1.9.2026: „Hugo Boss beendet Aktienrückkaufprogramm – das steckt dahinter"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'finanzen.net, Meldung vom 1.9.2026: „Abbruch des Aktienrückkaufs – Reaktion auf den Einstieg von Frasers"',
          url: 'https://www.finanzen.net/nachricht/aktien/wertschoepfungspotenzial-hugo-boss-aktie-abbruch-des-aktienrueckkaufs-reaktion-auf-den-einstieg-von-frasers-15913064',
        },
      ],
    },
    {
      headline:
        'Nach neuer Iran-Eskalation: Öl steigt deutlich, Gold zuckt kaum, Silber fällt',
      summary: [
        'Nach einem Tanker-Beschuss in der Straße von Hormus und einem dpa-AFX-Bericht über neue gegenseitige Angriffe zwischen den USA und dem Iran stieg Brent-Öl laut wallstreet-online um 4,92 Prozent, während Gold nur 0,11 Prozent nachgab.',
        'Auffällig war die Reaktion bei Silber: Der Kurs fiel um 3,62 Prozent, deutlich stärker als bei Gold – ein Unterschied, der sich mit dem höheren Industrieanteil an der Silbernachfrage erklären lässt, auch wenn die Quellen das nicht ausdrücklich benennen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Macht sichtbar, dass Rohstoffe, die gemeinsam als sichere Häfen gelten, auf dieselbe Krise unterschiedlich reagieren, je nachdem, wie stark Zinserwartung oder Industrienachfrage mitspielen.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent', 'gold', 'silber'],
      sources: [
        {
          label:
            'onvista, Aktuelle News vom 1.9.2026 (dpa-AFX), 21:11 Uhr: „GESAMT-ROUNDUP: USA und Iran verkünden neue gegenseitige Angriffe"',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'wallstreet-online, Aktuelle Rohstoffpreise, Abruf 2.9.2026, 00:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
