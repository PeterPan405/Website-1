import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-16.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-16 00:11 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-16',
  intro:
    'Japans Wirtschaft schrumpft, E-Autos ohne US-Förderung, KI erobert Depots, Amerikas Rente streitet über die Grenze – und Bessent will Nvidia umbauen.',
  top: [
    {
      headline: 'Japans Wirtschaft schrumpft überraschend',
      summary: [
        'Japans Wirtschaft ist im dritten Quartal überraschend geschrumpft, aufs Jahr gerechnet um 0,1 Prozent. Ökonomen hatten ein Wachstum von 0,3 Prozent erwartet, im Quartal davor war die Wirtschaft noch um 1,4 Prozent gewachsen.',
        'Grund waren schwächerer Konsum und schwächere Exporte. Höhere Energieimporte drückten das Wachstum zusätzlich um 0,6 Punkte. Der Nikkei 225 legte nach der Veröffentlichung trotzdem um 0,4 Prozent zu, der Yen gab leicht nach.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Schwache Konjunkturdaten lassen Anleger oft auf eine lockere Geldpolitik hoffen – das kann einen Aktienmarkt trotz schrumpfender Wirtschaft steigen lassen.',
      relatedTopics: ['waehrungen-wechselkurse'],
      relatedSymbols: ['nikkei-225'],
      sources: [
        {
          label:
            'CNBC, 16. November 2026, 00:57 Uhr MEZ: „Japan\'s economy unexpectedly contracts in third-quarter as elevated energy costs bite"',
          url: 'https://www.cnbc.com/2026/11/16/japan-q3-gdp-energy-oil-prices.html',
        },
      ],
    },
    {
      headline: 'E-Auto-Hersteller rechnen nicht mit neuer US-Förderung',
      summary: [
        'Die Chefs von Rivian, Lucid und dem Start-up Scout Motors rechnen nicht mit einer Rückkehr der US-Kaufprämie für Elektroautos, auch wenn die Demokraten künftig den Kongress mitkontrollieren. Die Trump-Regierung hatte den Zuschuss von bis zu 7.500 Dollar nach September 2025 gestrichen.',
        'Ein neues Elektroauto kostete im September laut Cox Automotive im Schnitt rund 54.800 Dollar, ein Auto mit Verbrennungsmotor etwa 51.100 Dollar. Scout-Chef Scott Keogh sagte, er wünsche sich Unterstützung eher für die Produktion als für den Kauf.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine staatliche Kaufprämie wirkt wie ein Preisnachlass – fällt sie weg, zeigt sich, ob eine Technologie schon ohne Hilfe mit der Konkurrenz mithalten kann.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'CNBC, 15. November 2026, 08:00 Uhr EST: „Rivian, Lucid, Scout CEOs aren\'t counting on Democrats to restore EV federal support after midterm wins"',
          url: 'https://www.cnbc.com/2026/11/15/rivian-lucid-scout-arent-counting-on-dems-to-restore-ev-incentives.html',
        },
      ],
    },
    {
      headline: 'KI-Agenten erobern das Wertpapierdepot',
      summary: [
        'Mehrere deutschsprachige Neobroker öffnen ihre Depots für Künstliche Intelligenz. Scalable Capital lässt sich über ChatGPT steuern, bei Bitpanda übernimmt ein mit Claude verbundener Agent diese Aufgabe, und eToro bietet eigene KI-Agenten-Depots an.',
        'Die Systeme können bereits Depots auswerten, Strategien vorschlagen und Order anstoßen. Die WirtschaftsWoche hat alle drei Angebote am Sonntag in eigenen Tests ausprobiert.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Wer einem Chatbot Order-Vollmacht gibt, verlässt sich auf eine Blackbox – ohne klare Haftungsregel bleibt das Risiko beim Anleger.',
      relatedTopics: ['depot-und-broker', 'portfolio-aufbau'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'WirtschaftsWoche, 15. November 2026, 17:50 Uhr: „Agentic Investing: KI-Agenten könnten die Geldanlage revolutionieren"',
          url: 'https://www.wiwo.de/finanzen/geldanlage/agentic-investing-wie-ki-agenten-uns-zu-besseren-anlegern-machen-sollen/100269014.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Amerikas Rentenkasse: Streit um die Beitragsgrenze',
      summary: [
        'Amerikas staatliche Rentenversicherung Social Security steuert auf eine Finanzierungslücke zu. Nach Angaben der Programm-Treuhänder könnte der Rentenfonds ab 2032 erschöpft sein, dann wären noch 78 Prozent der Leistungen auszahlbar; zusammen mit dem Invaliditätsfonds verschiebt sich das auf 2034 bei 83 Prozent.',
        'Im Wahlkampf warben viele Demokraten für eine höhere Beitragsgrenze, ab der Besserverdiener keine Sozialabgaben mehr zahlen – aktuell bei 184.500 Dollar. Viele Republikaner setzten stattdessen auf einen Steuerabzug für Senioren, der 2028 ausläuft.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Eine Beitragsgrenze wie in den USA zeigt, wie unterschiedlich sich ein Rentensystem finanzieren lässt – und wer am Ende für die Lücke aufkommt.',
      relatedTopics: ['rente'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'CNBC, 15. November 2026, 09:30 Uhr EST: „Social Security and the blue wave: What could happen to payroll taxes and senior tax breaks"',
          url: 'https://www.cnbc.com/2026/11/15/social-security-tax-changes-midterm-election.html',
        },
      ],
    },
    {
      headline: 'Bessent fordert radikalen Umbruch bei Nvidia',
      summary: [
        'US-Finanzminister Scott Bessent hat nach dem Rücktritt von Nvidia-Chef Jensen Huang einen externen Nachfolger verlangt und dem Verwaltungsrat binnen zehn Tagen Antworten zur Einhaltung der US-Exportkontrollen gesetzt. Er fragte, ob Nvidia illegale Chipverkäufe vorangetrieben habe, um Umsatz und Gewinn zu steigern.',
        'Im Zentrum steht die Firma Megaspeed in Singapur, die Nvidia-Chips nach China weitergeleitet haben soll. Megaspeed weist die Vorwürfe zurück, China bestreitet die Spionagevorwürfe gegen die frühere Managerin Alice Huang.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wenn ein Regierungsmitglied öffentlich die Führung eines börsennotierten Unternehmens infrage stellt, vermischen sich Aufsicht und Einflussnahme – mit Folgen für die Unabhängigkeit des Verwaltungsrats.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'dpa-AFX über wallstreet-online, 15. November 2026: „US-Finanzminister fordert neuen Nvidia-Chef von außerhalb"',
          url: 'https://www.wallstreet-online.de/nachricht/21696078-us-finanzminister-nvidia-chef',
        },
        {
          label:
            "CNBC, 15. November 2026, 18:10 Uhr GMT: „Bessent calls for 'dramatic shakeup' at Nvidia, urges outside CEO\"",
          url: 'https://www.cnbc.com/2026/11/15/bessent-nvidia-ceo-lutnick-megaspeed.html',
        },
      ],
    },
  ],
}
