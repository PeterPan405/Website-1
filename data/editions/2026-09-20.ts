import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-20.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-20 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-20',
  intro:
    'Vor der Fed-Zinserhöhung ist nach ihr: Eine Notenbank-Woche steht an, Gold kratzt an 4.400 Dollar, und der Tankrabatt bleibt politisch umstritten.',
  top: [
    {
      headline: 'Woche mit fünf Notenbank-Terminen beginnt',
      summary: [
        'Nach der Zinserhöhung der US-Notenbank Fed in der vergangenen Woche sprechen laut wallstreet-online am 21. September das Fed-Mitglied Goolsbee, EZB-Präsidentin Lagarde, EZB-Mitglied Cipollone und der Gouverneur der kanadischen Notenbank, Macklem.',
        'Am selben Tag veröffentlicht die Deutsche Bundesbank ihren monatlichen Bericht. Am 22. September folgt laut derselben Quelle ein weiterer Auftritt von EZB-Mitglied Nagel.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Reden einzelner Notenbanker sind keine Zinsentscheidungen, können Finanzmärkte aber trotzdem bewegen, wenn sie Hinweise auf die künftige Geldpolitik geben.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender „Wichtige Termine", Stand 20.09.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Tankrabatt-Streit: Kubicki spricht von Planwirtschaft',
      summary: [
        'Der FDP-Politiker Kubicki bezeichnete den zuvor von Bund und Ländern vereinbarten Spritpreisdeckel laut finanzen.net als „Planwirtschaft".',
        'Die sächsische SPD begrüßte laut derselben Quelle den geplanten Tankrabatt, forderte aber zusätzlich eine Übergewinnsteuer für Ölkonzerne; Niedersachsens Wirtschaftsminister sprach sich für ein europäisches Vorgehen dabei aus.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Der Streit zeigt, dass ein staatlicher Rabatt an der Zapfsäule politisch umstritten bleibt, auch nachdem die grundsätzliche Einigung bereits stand.',
      relatedTopics: ['inflation', 'schulden-und-kredit'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            "finanzen.net, News-Ticker vom 19.09.2026: „Kubicki kritisiert Spritpreisdeckel als 'Planwirtschaft'\"",
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'finanzen.net, News-Ticker vom 19.09.2026: „Sachsens SPD lobt Tankrabatt - fordert aber Übergewinnsteuer"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Gold nahe 4.400 Dollar, JPMorgan ohne Ölprognose',
      summary: [
        'Der Goldpreis näherte sich laut wallstreet-online zum Wochenende der Marke von 4.400 US-Dollar je Feinunze, ohne sie zu überschreiten; zum Stand Sonntagfrüh nennt finanzen.net für Gold 4.380 Dollar, ein Plus von 0,9 Prozent.',
        'Die US-Bank JPMorgan hat laut wallstreet-online ihre Prognose für den Ölpreis aufgegeben; als Zitat nennt die Quelle den Satz „Wir wissen es einfach nicht" angesichts der als unberechenbar beschriebenen Ölpolitik von US-Präsident Trump.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass eine große Bank offen eine Prognose zurückzieht statt sie beizubehalten, zeigt, wie ungewöhnlich unsicher die Lage am Ölmarkt derzeit eingeschätzt wird.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold', 'brent'],
      sources: [
        {
          label:
            'wallstreet-online, Devisen & Rohstoffe, Stand 20.09.2026: „Der Goldpreis stürmte ins Wochenende, verpasste dabei den Sprung über die 4.400 US-Dollar nur knapp"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            "wallstreet-online, wallstreetONLINE Redaktion, 19.09.2026: „'Wir wissen es einfach nicht': JPMorgan kapituliert vor Trumps Öl-Chaos\"",
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'KI-Bewertungen im Fokus: Hohe Preise, wenig Umsatz',
      summary: [
        'Laut wallstreet-online werden chinesische KI-Modelle zunehmend beliebt, während der Umsatz einiger Anbieter weit zurückbleibt; als Beispiele nennt die Quelle Alibaba und MiniMax.',
        'Der Börsengang von Anthropic verzögert sich laut finanzen.net offenbar auf November; dpa-AFX meldete zudem am 19. September um 18:28 Uhr, Präsident Trump setze trotz Warnungen vor Gefahren stärker auf Künstliche Intelligenz.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine hohe Bewertung bei geringem Umsatz setzt auf künftiges Wachstum – bleibt es aus, fällt die Rechtfertigung für den Preis weg.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: ['alibaba'],
      sources: [
        {
          label:
            'wallstreet-online, Nachrichten: Aktien & Indizes, Stand 20.09.2026: „Chinas KI-Modelle werden immer beliebter. Doch beim Umsatz liegen sie weit zurück."',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'onvista, Aktuelle News, 19.09.2026, 18:28 Uhr, dpa-AFX: „Trump setzt stärker auf KI trotz Warnungen vor Gefahren"',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Google meldet KI-gestützte Hacking-Vorfälle',
      summary: [
        'Der Google-Mutterkonzern Alphabet hat laut finanzen.net am 19. September Vorfälle bekanntgegeben, bei denen nach Angaben der Meldung Künstliche Intelligenz für Hackerangriffe eingesetzt wurde. Weitere Angaben nennt die Quelle nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein großer Tech-Konzern, der einen KI-Sicherheitsvorfall selbst öffentlich macht, zeigt, dass Cybersicherheit zum festen Bestandteil der KI-Debatte geworden ist.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: ['alphabet'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 19.09.2026: „Alphabet-Aktie im Visier: Google-KI Gemini außer Kontrolle? Tech-Riese macht KI-Hacking-Vorfälle publik"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Huawei erhöht die Preise für seine KI-Chips',
      summary: [
        'Huawei hat laut finanzen.net die Preise für seine KI-Chips angehoben; die Meldung ordnet den Schritt als Risiko für Chinas Plan ein, sich mit eigener Technik unabhängiger vom US-Anbieter Nvidia zu machen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer die Preise für Schlüsselkomponenten anhebt, verschiebt die Kalkulation aller Kunden, die auf diese Komponenten angewiesen sind – hier Chinas eigene KI-Industrie.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 19.09.2026: „Huawei-Aktie: Warum die Preiserhöhung bei KI-Chips Chinas Plan gegen NVIDIA gefährdet"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Bitcoin und Gold: laut Meldung so eng korreliert wie nie',
      summary: [
        'Bitcoin und Goldpreis bewegten sich laut finanzen.net zuletzt so eng miteinander wie nie zuvor; zum Stand Sonntagfrüh nennt dieselbe Quelle für Bitcoin 70.722 Dollar, ein Minus von 0,1 Prozent, und für Gold 4.380 Dollar, ein Plus von 0,9 Prozent.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Eine enge Korrelation zwischen zwei Anlageklassen bedeutet, dass sie ein Portfolio in schwierigen Marktphasen weniger stark gegeneinander absichern als bislang angenommen.',
      relatedTopics: ['bitcoin-krypto'],
      relatedSymbols: ['bitcoin', 'gold'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 19.09.2026: „Bitcoin-Kurs und Goldpreis so eng wie nie: Was die Korrelation wirklich bedeutet - Chance für Anleger?"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label: 'finanzen.net, Kursleiste, Stand 20.09.2026, 02:15 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
