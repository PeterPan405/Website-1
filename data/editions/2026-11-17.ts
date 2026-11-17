import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-17.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-17 00:11 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-17',
  intro:
    'UniCredit darf die Commerzbank übernehmen, eine IT-Panne trifft US-Banken, Buffett verschenkt Milliarden – und Nvidia steht vor der ersten Bilanz ohne Huang.',
  top: [
    {
      headline: 'UniCredit darf die Commerzbank übernehmen',
      summary: [
        'Die EU-Kommission hat der Übernahme der Commerzbank durch die italienische UniCredit zugestimmt. Sie sieht keine wettbewerbsrechtlichen Bedenken. Auch die US-Notenbank Fed hat dem Zusammenschluss zugestimmt.',
        'Die EU-Kommission bezog bei ihrer Prüfung auch die Finanzierung des deutschen Mittelstands ein, für den die Commerzbank als Hausbank vieler Betriebe eine wichtige Rolle spielt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zwei Aufsichtsbehörden mit unterschiedlichem Auftrag mussten zustimmen: Die EU prüft den Wettbewerb, die Fed die Finanzstabilität.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['commerzbank', 'unicredit'],
      sources: [
        {
          label:
            'Tagesschau, 16. November 2026, 12:50 Uhr: „EU gibt UniCredit grünes Licht für Commerzbank-Übernahme"',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/commerzbank-unicredit-eu-genehmigung-100.html',
        },
        {
          label:
            'Handelsblatt, 16. November 2026, 18:22 Uhr: „Banken: EU und Fed erlauben Commerzbank-Übernahme durch Unicredit"',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/banken-eu-und-fed-erlauben-commerzbank-uebernahme-durch-unicredit/100270206.html',
        },
      ],
    },
    {
      headline: 'Fed-Chef Warsh warnt vor überzogenen KI-Erwartungen',
      summary: [
        'US-Notenbankchef Kevin Warsh hat Künstliche Intelligenz als wichtig für die US-Wirtschaft bezeichnet. Zugleich sagte er, sie könne die hohen Erwartungen auch enttäuschen.',
        'Investitionen in Rechenzentren und Chips tragen inzwischen erheblich zum US-Wachstum bei. Bleibt der erhoffte Produktivitätsschub aus, fehlt der Wirtschaft ein Teil dieses Wachstums.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wie viel vom aktuellen Wachstum auf Dauer trägt, bestimmt mit, wie die Notenbank ihre nächsten Zinsentscheidungen begründet.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            "CNBC, 16. November 2026, 19:46 Uhr MEZ: „Fed Chairman Kevin Warsh stresses importance of AI to economy, but says it could 'disappoint'\"",
          url: 'https://www.cnbc.com/2026/11/16/fed-ai-task-force-kevin-warsh.html',
        },
        {
          label:
            'Goldreporter, 16. November 2026: „Goldpreis rutscht auf Jahrestief – negatives Momentum vor Warsh-Rede"',
          url: 'https://www.goldreporter.de/goldpreis-heute-jahrestief-warsh-rede-16-11-2026/marktbericht-gold/263121/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Software-Fehler legt Online-Banking bei JPMorgan Chase lahm',
      summary: [
        'Kundinnen und Kunden von JPMorgan Chase kamen am Montagabend zeitweise nicht an ihr Online-Konto. Die Bank sprach von einem vorübergehenden Software-Fehler im Privatkundengeschäft.',
        'Es ist bereits der vierte technische Ausfall binnen zwei Wochen, nach Problemen bei Microsoft, einem Flugstopp der US-Luftfahrtbehörde FAA und einer Störung bei United Airlines.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Softwarefehler trifft nicht die Bilanz einer Bank, sondern das Vertrauen in digitale Dienste, die rund um die Uhr funktionieren sollen.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: ['jpmorgan'],
      sources: [
        {
          label:
            'CNBC, 16. November 2026, 23:14 Uhr MEZ: „JPMorgan Chase says temporary software bug is affecting consumer banking"',
          url: 'https://www.cnbc.com/2026/11/16/jpmorgan-chase-technical-issue.html',
        },
        {
          label:
            'Handelsblatt, 17. November 2026, 00:07 Uhr: „IT-Störung: Bankkunden in USA melden Probleme beim Zugriff auf Online-Konten"',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/it-stoerung-bankkunden-in-usa-melden-probleme-beim-zugriff-auf-online-konten/100270373.html',
        },
      ],
    },
    {
      headline: 'Buffett schenkt Familienstiftungen Aktien für 5,5 Milliarden Dollar',
      summary: [
        'Warren Buffett hat seinen Familienstiftungen Berkshire-Hathaway-Aktien im Wert von 5,5 Milliarden Dollar geschenkt. Nach der Spende hält er weiterhin Anteile im Wert von rund 162 Milliarden Dollar.',
        'Am selben Tag wurde bekannt, dass Berkshire im dritten Quartal seinen Anteil an Delta Air Lines erhöht und die Position in der Bank of America verkleinert hat.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Wer Aktien statt Bargeld verschenkt, zahlt auf den Wertzuwachs keine Steuer – ein Grund, warum Großvermögen oft in Aktien weitergegeben werden.',
      relatedTopics: ['zinseszins'],
      relatedSymbols: ['berkshire'],
      sources: [
        {
          label:
            "CNBC, 16. November 2026, 18:39 Uhr MEZ: „Warren Buffett donates $5.5 billion, says kindness 'compounds' in Thanksgiving letter\"",
          url: 'https://www.cnbc.com/2026/11/16/warren-buffett-donates-5point5-billion-thanksgiving.html',
        },
        {
          label:
            'Handelsblatt, 16. November 2026, 17:57 Uhr: „Berkshire Hathaway: Buffett schenkt Familienstiftungen Aktien im Wert von 5,5 Milliarden Dollar"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/berkshire-hathaway-buffett-verschenkt-fuer-55-milliarden-dollar-aktien/100270318.html',
        },
      ],
    },
    {
      headline: 'Nvidia fällt vor den Zahlen auf Platz drei zurück',
      summary: [
        'Nvidia ist im Ranking der wertvollsten Unternehmen der Welt hinter Microsoft auf Platz drei zurückgefallen, nachdem die Aktie am Montag mehr als vier Prozent verlor. Der S&P 500 schloss fast zwei Prozent im Minus.',
        'An diesem Dienstagabend legt Nvidia zum ersten Mal seit Jensen Huangs Rücktritt Quartalszahlen vor. Interimschefin Colette Kress hält die Präsentation; eine Rückkehr Huangs ist Medienberichten zufolge nicht geplant.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Je größer ein Unternehmen im Index, desto stärker wirkt sein eigener Kurs auf den gesamten Markt – das macht einen einzelnen Quartalsbericht zum Markttermin.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['nvidia', 'microsoft'],
      sources: [
        {
          label:
            'Handelsblatt, 16. November 2026, 20:17 Uhr: „Wall Street: S&P 500 schließt fast zwei Prozent im Minus – Microsoft wertvoller als Nvidia"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-nvidia-affaere-und-anthropic-debuet-machen-wall-street-zu-schaffen/100270217.html',
        },
        {
          label:
            "CNBC, 16. November 2026, 14:42 Uhr MEZ: „Nvidia's Colette Kress confronts key questions in first earnings report since Jensen Huang's exit\"",
          url: 'https://www.cnbc.com/2026/11/16/nvidia-earnings-jensen-huang-resignation.html',
        },
        {
          label:
            'wallstreet-online/dpa-AFX, 16. November 2026: „Nur noch Platz 3! Nvidia fällt hinter Microsoft zurück: Chip-Riese vor den Zahlen angeschlagen"',
          url: 'https://www.wallstreet-online.de/nachricht/21702030-platz-3-nvidia-faellt-microsoft-zurueck-chip-riese-zahlen-angeschlagen',
        },
      ],
    },
  ],
}
