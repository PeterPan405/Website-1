import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-18.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-18 01:55 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-18',
  intro:
    'DAX und Wall Street schwächeln trotz Rekordnähe, Öl zieht wegen Nahost-Sorgen an, Gold kämpft mit steigenden Zinsen, dazu ZEW-Umfrage und EZB-Termine.',
  top: [
    {
      headline:
        'DAX schließt in Rekordnähe trotz schwachem Wochenstart – Wall Street auch schwächer',
      summary: [
        'Der DAX beendete den Montag laut dpa-AFX in Rekordnähe mit schwachem Wochenstart, nachdem zuvor die Wall Street mit moderaten Verlusten wegen getrübter Nahost-Aussichten geschlossen hatte.',
        'Heute früh gegen 3:55 Uhr zeigt die Kursleiste von finanzen.net den DAX bei 26.339 Punkten (-0,4 Prozent) und den Euro Stoxx 50 bei 6.530 Punkten (-0,1 Prozent).',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass Kursniveau und Tagesperformance zwei unterschiedliche Maßstäbe sind, die sich scheinbar widersprechen können, ohne dass einer falsch ist.',
      relatedTopics: ['aktien-laender-branchen', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'dpa-AFX über onvista, News vom 17.8.2026, 16:02 Uhr: ROUNDUP/Aktien Frankfurt Schluss: Dax in Rekordnähe mit schwachem Wochenstart',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'finanzen.net, Kursleiste, Stand 18.8.2026, ca. 3:55 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'Ölpreis zieht wegen Nahost-Sorgen an – drei Quellen nennen drei Prozentzahlen',
      summary: [
        'Nach Berichten über Kushners Treffen mit Netanjahu und Trumps Drohung gegen Oman steigt der Brent-Ölpreis seit Montag deutlich, von 90,37 über 91,06 auf zuletzt 91,35 US-Dollar.',
        'Die dazugehörigen Prozentangaben unterscheiden sich je nach Portal und Zeitpunkt zwischen 0,5 und 2,83 Prozent, weil jede Quelle einen eigenen Referenzwert verwendet.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Erinnert daran, dass Prozentangaben ohne Zeitstempel und Vergleichsbasis kaum vergleichbar sind – der absolute Kurs ist oft die verlässlichere Information.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'Markt Bote über wallstreet-online, 17.8.2026: Ölpreis: Brent-Öl schießt um +2,06 % hoch, Kurs nun bei 90,37 USD',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label: 'finanzen.net, Kursleiste, Stand 18.8.2026, ca. 3:55 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'ZEW-Erwartungen sollen steigen, die aktuelle Lage bleibt laut Prognose tief im Minus',
      summary: [
        'Für den heutigen ZEW-Index erwartet der Wirtschaftskalender von wallstreet-online einen Anstieg der Konjunkturerwartungen auf 30 Punkte, während die Aktuelle Lage mit prognostizierten minus 68,8 Punkten weiter tief negativ bleiben soll.',
        'Um 8:00 Uhr stehen zudem britische Arbeitsmarktdaten an, um 13:45 Uhr eine Rede von EZB-Ratsmitglied Lane.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zeigt an einem konkreten Kalendertag, wie stark Erwartungen und Gegenwartseinschätzung innerhalb derselben Umfrage auseinanderlaufen können.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender Kommende Termine, abgerufen 18.8.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'Gold kämpft mit der 4.400-Dollar-Marke, weil steigende Marktzinsen bremsen',
      summary: [
        'Goldreporter titelt: Marktzinsen steigen: Gold kämpft um die Marke von 4.400 USD – während Öl wegen Nahost-Sorgen deutlich zulegt, bewegt sich Gold kaum, laut Kursleisten zwischen 4.405 und 4.407 US-Dollar.',
        'Silber legt zur gleichen Zeit laut wallstreet-online um 1,65 Prozent zu – ein auffälliger Unterschied zu Gold, den die Quellen nicht weiter erklären.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Macht deutlich, dass Gold trotz seines Rufs als sicherer Hafen nicht automatisch von jeder Krisensorge profitiert, wenn gleichzeitig andere Kräfte wie steigende Zinsen dagegenhalten.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label:
            'Goldreporter, Top-News, abgerufen 18.8.2026: Marktzinsen steigen: Gold kämpft um die Marke von 4.400 USD',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline:
        'Apple muss nach vier Jahren Streit die Tracking-Regeln fürs iPhone ändern',
      summary: [
        'Laut wallstreet-online erzwingt das Bundeskartellamt nach vierjährigem Verfahren Änderungen an Apples Tracking-Regeln in Deutschland, die künftig unter Aufsicht der Behörde gelten.',
        'Welche Regeln konkret betroffen sind, nennt die Meldung nicht.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Zeigt, dass Regulierung bei großen Plattformkonzernen ein eigener, langwieriger Risikofaktor neben Umsatz und Marge ist.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['apple'],
      sources: [
        {
          label:
            'wallstreet-online, Rubrik Nachrichten: Aktien & Indizes, abgerufen 18.8.2026: Apple unter Druck: Deutschland erzwingt Änderungen beim iPhone-Tracking',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Anthropic weckt mit Umsatzsprung IPO-Fantasie – ob es größer als SpaceX wird, bleibt offen',
      summary: [
        'KI-Aktien legten laut dpa-AFX nach Anthropic-Äußerungen zu, nachdem finanzen.net einen Umsatzsprung bei Anthropic gemeldet hatte; die Frage, ob ein IPO größer als das von SpaceX würde, bleibt in der Quelle unbeantwortet.',
        'Anthropic ist bislang nicht börsennotiert – die Kursreaktionen betreffen also bereits gelistete Werte wie Micron und Alphabet, nicht Anthropic selbst.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Trennt eine bestätigte Zahl (Umsatzsprung) von einer offenen Frage in einer Schlagzeile – ein Unterschied, der bei jeder IPO-Spekulation zählt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['alphabet'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 17.8.2026: Anthropic-Aktie kommt: Umsatzsprung nährt Fantasie und treibt KI-Aktien an – Wird das IPO größer als SpaceX?',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'Deutsche Telekom kauft sich laut Kurzmeldung in polnisches Glasfasernetz ein',
      summary: [
        'Unter der Überschrift Kampf um Kunden meldet wallstreet-online einen Milliarden-Deal der Deutschen Telekom für Glasfasernetze in Polen – konkrete Zahlen zum Kaufpreis nennt die Kurzmeldung nicht.',
        'Die Einordnung als Milliardendeal stammt direkt aus der Schlagzeile der Quelle, nicht aus einer eigenen Berechnung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, wie deutsche Indexschwergewichte auch außerhalb des Heimatmarkts wachsen – ein Datenpunkt für alle, die Telekom über den DAX hinaus verfolgen.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['deutsche-telekom'],
      sources: [
        {
          label:
            'wallstreet-online, Rubrik Nachrichten: Aktien & Indizes, abgerufen 18.8.2026: Kampf um Kunden – Telekom kauft Glasfaser-Power: Milliarden-Deal in Polen',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline:
        'Kolumbianischer Peso gewinnt über 30 Prozent zum Dollar – ein Zinsvorteil als Motor',
      summary: [
        'Laut wallstreet-online gehört der kolumbianische Peso mit einem Plus von über 30 Prozent zum US-Dollar zu den stärksten Währungen der Welt; als Grund nennt die Quelle vor allem einen außergewöhnlichen Zinsvorteil.',
        'Weitere Kennzahlen zur genauen Höhe des Zinsvorteils oder zum Zeitraum der Berechnung liefert die Kurzmeldung nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Illustriert, wie hohe Zinsdifferenzen zwischen Ländern Währungen antreiben können – ein Mechanismus, der bei Fremdwährungsanlagen ebenso hohe Chancen wie Risiken birgt.',
      relatedTopics: ['waehrungen-wechselkurse', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'wallstreetONLINE Redaktion, 17.8.2026: Über 30 % Gewinn: Extrem attraktive Zinsen machen diese Währung zur stärksten der Welt',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
