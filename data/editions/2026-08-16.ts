import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-16.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-16 02:00 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-16',
  intro:
    'Bundesbank meldet mehr Außenhandelsüberschuss und weniger Falschgeld, NORMA Group startet einen Aktienrückkauf, eine Anleihe zeigt, wie Risikoprämien wirken.',
  top: [
    {
      headline: 'Bundesbank: Leistungsbilanzüberschuss steigt auf 19 Milliarden Euro',
      summary: [
        'Die deutsche Leistungsbilanz verzeichnete im Juni 2026 laut Bundesbank einen Überschuss von 19,0 Milliarden Euro, 10,1 Milliarden Euro mehr als im Mai.',
        'Am Rentenmarkt liefen die Neuemissionen dagegen leicht zurück: Mit 133,5 Milliarden Euro lagen die Bruttoemissionen im Juni unter dem Vormonatswert von 134,5 Milliarden Euro.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zeigt, dass ein wachsender Außenhandelsüberschuss und ein schrumpfender Rentenmarkt-Neuabsatz im selben Monat nebeneinander bestehen können.',
      relatedTopics: ['schuldverschreibung'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Deutsche Bundesbank, Pressemitteilung „Die deutsche Zahlungsbilanz im Juni 2026“, Stand 16.8.2026',
          url: 'https://www.bundesbank.de/de/presse/pressenotizen',
        },
        {
          label:
            'Deutsche Bundesbank, Pressemitteilung „Mäßiger Nettoabsatz von Schuldverschreibungen im Juni 2026“ vom 12.8.2026',
          url: 'https://www.bundesbank.de/de/presse/pressenotizen',
        },
      ],
    },
    {
      headline: 'NORMA Group startet Aktienrückkauf über 208 Millionen Euro',
      summary: [
        'Der Vorstand kündigt laut einer Ad-hoc-Meldung ein Rückkaufprogramm über 208 Millionen Euro für bis zu 9,3 Millionen eigene Aktien an.',
        'Zu Zeitplan und Ausführung der Käufe macht die Kurzmeldung keine weiteren Angaben – Details zeigen erst kommende Quartalsberichte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Aktienrückkauf verringert die Zahl ausstehender Aktien und wirkt damit anders auf Anleger als eine klassische Bardividende.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'wallstreetONLINE Newsflash, Ad-hoc-Meldung vom 14.8.2026: „NORMA Group: Vorstand startet Aktienrückkauf über 208 Mio. Euro“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Börsengänge summieren sich 2026 weltweit auf 186 Milliarden Dollar',
      summary: [
        'Laut einer Kurzmeldung von finanzen.net haben Unternehmen 2026 bislang weltweit rund 186 Milliarden Dollar über Börsengänge eingesammelt.',
        'Wer davon konkret profitiert, geht aus der reinen Ticker-Zeile nicht hervor – die Meldung nennt selbst keine Einzelfälle.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein hohes IPO-Volumen zeigt, wann Unternehmen den Zeitpunkt für einen Börsengang für günstig halten – für einzelne Neuemissionen sagt es wenig.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 15.8.2026: „Börsengänge-Bilanz 2026: 186 Milliarden Dollar und ein Gewinner, den keiner kennt“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline:
        'Homann Holzwerkstoffe senkt Prognose – Anleihe mit 7,5 Prozent Kupon betroffen',
      summary: [
        'Homann Holzwerkstoffe passt laut einer Ad-hoc-Meldung die Jahresprognose 2026 an, wegen Anlaufverlusten in Litauen und schwächerer Nachfrage.',
        'Betroffen ist eine Unternehmensanleihe mit 7,50 Prozent Zins bis Juni 2032 – ihr hoher Kupon spiegelt von Anfang an ein erhöhtes Ausfallrisiko.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, dass bei Unternehmensanleihen mit hohem Kupon nicht der Gewinn zählt, sondern die Fähigkeit, Zins und Rückzahlung zu bedienen.',
      relatedTopics: ['schuldverschreibung', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'EQS Group AG über wallstreet-online, Ad-hoc-Meldung vom 14.8.2026: „Homann Holzwerkstoffe GmbH passt Jahresprognose an: Vorläufige Halbjahreszahlen 2026 aufgrund weiterhin hoher Anlaufverluste in Litauen und Nachfrageschwäche unter Vorjahr“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Weniger Falschgeld: Bundesbank zieht Halbjahresbilanz',
      summary: [
        'Die Bundesbank hat im ersten Halbjahr 2026 rund 30.000 falsche Euro-Banknoten im Wert von 1,75 Millionen Euro aus dem Verkehr gezogen.',
        'Gegenüber dem zweiten Halbjahr 2025 sank die Zahl der Fälschungen um 4,3 Prozent – rein rechnerisch kamen sieben falsche Scheine auf 10.000 Einwohner.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Erinnert daran, dass Bargeld grundsätzlich fälschbar bleibt, auch wenn die Fälschungsquote in Deutschland insgesamt niedrig ist.',
      relatedTopics: ['geldsystem'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Deutsche Bundesbank, Pressemitteilung „Weniger Falschgeld im Umlauf – Schadenssumme ebenfalls gesunken“ vom 7.8.2026',
          url: 'https://www.bundesbank.de/de/presse/pressenotizen',
        },
      ],
    },
  ],
}
