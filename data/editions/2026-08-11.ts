import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-11.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-11 03:12 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-11',
  intro:
    'Goldman warnt vor einem schuldenfinanzierten KI-Boom, BofA rügt die eigene Fed-Kommunikation, und für Gold ziehen gleich drei Gründe in dieselbe Richtung.',
  top: [
    {
      headline: 'Goldman Sachs warnt vor Schuldenboom im KI-Ausbau',
      summary: [
        'Amazon, Alphabet, Meta, Microsoft und Oracle könnten 2027 rund 1,2 Billionen Dollar in KI investieren – mehr, als aus dem laufenden Geschäft hereinkommt.',
        'Der über Anleihen finanzierte Anteil soll laut Goldman Sachs von 26 Prozent (2025) auf 35 Prozent (2027) steigen; die Risikoaufschläge der Anleihen sind bereits gestiegen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Risikoaufschläge zeigen, wie viel Vertrauen der Kreditmarkt einer Branche noch entgegenbringt – unabhängig von der Zahlungsfähigkeit einzelner Konzerne.',
      relatedTopics: ['schulden-und-kredit'],
      relatedSymbols: ['meta', 'alphabet', 'microsoft'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 11.8.2026, 03:33 Uhr: „Schuldenfinanzierter KI-Boom: Goldman Sachs schlägt bei Big Tech-Aktien wie Meta, Alphabet und Microsoft Alarm“',
          url: 'https://www.finanzen.net/nachricht/aktien/hyperscaler-schuldenfinanzierter-ki-boom-goldman-sachs-schlaegt-bei-big-tech-aktien-wie-meta-alphabet-und-microsoft-alarm-15852734',
        },
      ],
    },
    {
      headline: 'BofA-Ökonomen zweifeln an der Kommunikation von Fed-Chef Warsh',
      summary: [
        'Nach einer 9:3-Zinsentscheidung bei 3,50 bis 3,75 Prozent nennen BofA-Volkswirte Warshs Pressekonferenz „taubenhaft und verwirrend“.',
        'Die Rendite 30-jähriger US-Staatsanleihen stieg im Umfeld der Entscheidung auf 5,2 Prozent – den höchsten Stand seit 19 Jahren.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wie klar eine Notenbank kommuniziert, beeinflusst Zinsen und Kurse oft stärker als die Zinsentscheidung selbst – Unsicherheit hat einen eigenen Preis.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 11.8.2026, 03:45 Uhr: „Scharfe Kritik von BofA-Ökonomen an Fed-Chef Warsh“',
          url: 'https://www.finanzen.net/nachricht/zinsen/fed-kritik-trifft-warsh-bank-of-america-eigene-oekonomen-ruegen-fed-chef-warsh-scharf-00-15852963',
        },
      ],
    },
    {
      headline:
        'Gold: JPMorgan-Prognose, Chinas Käufe und fallende Renditen ziehen an einem Strang',
      summary: [
        'JPMorgan sieht den Goldpreis im vierten Quartal über 5.000 Dollar; Chinas Notenbank kaufte im Juli mit 19,9 Tonnen so viel wie seit Oktober 2023 nicht mehr.',
        'Die Rendite zehnjähriger US-Staatsanleihen sank auf 4,67 Prozent – sinkende Zinsen verringern die Opportunitätskosten des unverzinsten Edelmetalls.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Drei unabhängige Datenquellen, die gleichzeitig in dieselbe Richtung zeigen, sind ein stärkeres Signal als eine einzelne Kennzahl – aber kein Garant für die nächste Woche.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'goldreporter.de vom 10.8.2026: „China kauft noch mehr Gold – stärkster Zuwachs seit Oktober 2023“',
          url: 'https://www.goldreporter.de/china-goldreserven-juli-2026/goldreserven/260817/',
        },
        {
          label:
            'goldreporter.de vom 10.8.2026: „US-Renditen sinken: Was das für den Goldpreis bedeutet“',
          url: 'https://www.goldreporter.de/us-renditen-sinken-goldpreis-nahost/zinsen/260890/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Jensen Huang wirbt für offene KI – während Chinas Kimi K3 vorlegt',
      summary: [
        'NVIDIA-Chef Jensen Huang unterzeichnete einen offenen Brief für offene KI-Modelle, den auch Meta, Microsoft, IBM und Palantir tragen – OpenAI, Google und Anthropic fehlen.',
        'Das chinesische Modell Kimi K3 mit 2,8 Billionen Parametern gilt als eines der größten frei verfügbaren KI-Modelle und wird deutlich günstiger angeboten als die US-Konkurrenz.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Streit um offene und geschlossene KI-Modelle entscheidet mit, wo künftig Preissetzungsmacht liegt – bei Modellentwicklern oder bei Infrastrukturanbietern.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 11.8.2026, 03:37 Uhr: „NVIDIA-Aktie im Blick: Jensen Huang mit eindringlicher Warnung im Kampf um Amerikas KI-Souveränität“',
          url: 'https://www.finanzen.net/nachricht/aktien/offener-brief-nvidia-aktie-im-blick-jensen-huang-mit-eindringlicher-warnung-im-kampf-um-amerikas-ki-souveraenitaet-00-15845809',
        },
        {
          label:
            'finanzen.net, News-Ticker vom 11.8.2026, 03:25 Uhr: „US-KI-Giganten unter Druck: Kimi K3 aus China fordert Anthropic und OpenAI heraus“',
          url: 'https://www.finanzen.net/nachricht/aktien/guenstige-leistung-nach-deepseek-kimi-k3-aus-china-fordert-us-ki-giganten-anthropic-und-openai-heraus-00-15849648',
        },
      ],
    },
    {
      headline: 'Bitwise-Chefanleger nennt drei Signale für eine Bitcoin-Bodenbildung',
      summary: [
        'Bitcoin fiel im zweiten Quartal um 13,4 Prozent und liegt rund 52 Prozent unter seinem Oktober-Hoch von 126.080 Dollar.',
        'Matt Hougan nennt als Signale: die Strategy-Aktie unter dem Wert ihrer Bitcoin-Bestände, einen Fear-and-Greed-Index nahe historischer Tiefs und deutlich negative Finanzierungssätze.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Extreme Stimmungswerte gelten historisch als Kontraindikator – sie beschreiben vergangene Muster, sind aber keine Vorhersage für den nächsten Kursverlauf.',
      relatedTopics: ['bitcoin-krypto'],
      relatedSymbols: ['bitcoin'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 11.8.2026, 03:31 Uhr: „Bitcoin vor Trendwende? Bitwise-CIO nennt mehrere Anzeichen“',
          url: 'https://www.finanzen.net/nachricht/devisen/bodenbildung-bitcoin-vor-trendwende-bitwise-cio-nennt-mehrere-anzeichen-00-15856749',
        },
      ],
    },
    {
      headline: 'Berkshire Hathaway: mehr Umsatz, mehr Gewinn – und mehr Rückkäufe',
      summary: [
        'Der operative Vorsteuergewinn stieg im zweiten Quartal um rund 7,5 Prozent auf 14,38 Milliarden Dollar, der Umsatz von 92,52 auf 101,81 Milliarden Dollar.',
        'Berkshire kaufte im ersten Halbjahr eigene Aktien für 4,8 Milliarden Dollar zurück, bei weiterhin 359,2 Milliarden Dollar Barmitteln und kurzfristigen Anleihen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein wachsender Cash-Bestand gilt unter Value-Investoren als Vorsichtssignal – ob die neuen Rückkäufe eine Trendwende sind, zeigt sich erst über mehrere Quartale.',
      relatedTopics: ['portfolio-aufbau'],
      relatedSymbols: ['berkshire'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 10.8.2026: „Berkshire Hathaway-Aktie in Grün: Ex-Buffett-Konzern mit Gewinn-Hammer und gigantischem Cash-Berg“',
          url: 'https://www.finanzen.net/nachricht/aktien/2-bilanz-post-buffett-berkshire-hathaway-aktie-in-gruen-ex-buffett-konzern-mit-gewinn-hammer-und-gigantischem-cash-berg-15833502',
        },
      ],
    },
    {
      headline: 'Apple abgestuft: Jefferies sieht die Preisstrategie in Gefahr',
      summary: [
        'Jefferies senkte das Rating von „Hold“ auf „Underperform“ und das Kursziel von 285,56 auf 263,66 Dollar, weil ein geplantes Glasgehäuse-iPhone offenbar entfällt.',
        'Ohne dieses Modell bleibt laut Jefferies nur das faltbare iPhone als Preishebel übrig – geschätzt 2.199 bis 3.099 Dollar je nach Speichergröße.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Fall zeigt, wie stark Analysten-Kursziele an Annahmen über Produktzyklen Jahre in der Zukunft hängen – nicht nur am aktuellen Quartalsergebnis.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['apple'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 10.8.2026: „Apple-Aktie gibt nach: Jefferies stuft auf Underperform ab und sieht die iPhone-Preisstrategie in Gefahr“',
          url: 'https://www.finanzen.net/nachricht/aktien/iphone-strategie-apple-aktie-gibt-nach-jefferies-stuft-auf-underperform-ab-und-sieht-die-iphone-preisstrategie-in-gefahr-00-15862682',
        },
      ],
    },
  ],
}
