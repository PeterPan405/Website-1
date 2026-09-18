import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-18.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-18 00:17 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-18',
  intro:
    'Die Fed erhöht den Leitzins, Trump greift Fed-Chef Warsh an, Japan liefert Inflationsdaten vor der BoJ-Entscheidung – und an der Wall Street verfallen Optionen.',
  top: [
    {
      headline:
        'Bank of Japan entscheidet über Leitzins, Inflationsdaten liegen schon vor',
      summary: [
        'Japan veröffentlichte heute früh neue Verbraucherpreisdaten: Die Jahresrate blieb laut Wirtschaftskalender von wallstreet-online bei 1,9 Prozent, während die um frische Lebensmittel bereinigte Kernrate von 1,8 auf 2,0 Prozent stieg. Um 5 Uhr entscheidet die Bank of Japan über den Leitzins, im Kalender genannte Markterwartung ist ein Anstieg auf 1,25 Prozent von aktuell 1 Prozent.',
        'Um 8 Uhr treffen sich laut demselben Kalender zudem die Finanzminister der Eurogruppe. Eine Tagesordnung dazu nennt die Quelle nicht.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zwei Notenbanktermine und ein Finanzministertreffen am selben Tag zeigen, wie eng getaktet die globale Geldpolitik gerade ist – relevant für alle mit Anleihen oder Fremdwährungspositionen.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['nikkei-225', 'eur-jpy'],
      sources: [
        {
          label: 'wallstreet-online, Wirtschaftskalender, Stand 18.09.2026, 02:17 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Trump fordert nach Zinserhöhung 1 Prozent Leitzins, Warsh unter Druck',
      summary: [
        'Nach der jüngsten Leitzinserhöhung der Fed forderte Präsident Trump laut wallstreetONLINE einen Leitzins von rund 1 Prozent. Goldreporter berichtete am 17. September, die Fed habe zugleich einen weiteren Zinsschritt noch in diesem Jahr signalisiert.',
        'Goldreporter warf zudem die Frage auf, ob Trump versuchen könnte, Fed-Chef Kevin Warsh erneut aus seinem Amt zu entfernen. Eine Antwort oder einen konkreten Schritt dazu nannte die Quelle nicht.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zweifel an der Unabhängigkeit einer Notenbank gelten unter Ökonomen als Risiko für die langfristige Preisstabilität und damit für die Zinsen am Anleihemarkt.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'wallstreetONLINE Redaktion, 17.09.2026: „Trump fordert 1% Zinsen!: Fed erhöht Zinsen, Börsen atmen auf, Ölpreis fällt"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'Goldreporter, 17. September 2026, „Trump attackiert Fed nach Zinserhöhung – Warsh in Gefahr?"',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Wall Street und Dax schließen im Plus, Ölpreis gibt weiter nach',
      summary: [
        'Dow Jones, S&P 500 und Nasdaq Composite schlossen den Donnerstagshandel laut dpa-AFX-Meldungen auf onvista im Plus, während der Brent-Ölpreis weiter nachgab. Auch der Dax legte zu und knüpfte an das Plus vom Vortag an, unterstützt von Übernahmespekulationen um Qiagen.',
        'In Wien erholte sich der ATX laut dpa-AFX weiter, obwohl die Aktie der Raiffeisen Bank International deutlich im Minus notierte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein breiter Kursanstieg bei gleichzeitig fallendem Ölpreis zeigt, dass Anleger die Zinsentscheidung der Fed inzwischen gelassener einschätzen als am Tag der Entscheidung selbst.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dow-jones', 'dax', 'brent'],
      sources: [
        {
          label: 'onvista, Aktuelle News, 17.09.2026, 20:34 Uhr, 16:17 Uhr und 16:08 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Riesiger Optionsverfall an der Wall Street am Freitag',
      summary: [
        'Am heutigen Freitag verfallen an der Wall Street laut wallstreet-online Optionen mit einem Nominalwert von 6,2 Billionen US-Dollar auf Indizes wie den S&P 500, den Nasdaq 100 und den Dow Jones.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein solcher Verfalltag kann kurzfristig für stärkere Kursausschläge sorgen, ohne dass sich an den wirtschaftlichen Rahmendaten etwas ändert.',
      relatedTopics: ['option'],
      relatedSymbols: ['sp500', 'nasdaq-100', 'dow-jones'],
      sources: [
        {
          label:
            'wallstreet-online, 17.09.2026: „Großer Optionsverfall: Wall Street vor dem 6,2-Billionen-Dollar-Showdown"',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Putin entzieht Nestlé die Kontrolle über sein Russland-Geschäft',
      summary: [
        'Laut einer Meldung von finanzen.net vom 17. September hat Putin Nestlé die Kontrolle über sein Russland-Geschäft entzogen. Weitere Einzelheiten zu Umfang oder Begründung nannte die Quelle nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Der Fall zeigt das Risiko für internationale Konzerne, wenn ihr Vermögen in einem Land liegt, dessen Regierung ausländisches Eigentum jederzeit neu ordnen kann.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nestle'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, 17.09.2026: „Nestlé-Aktie: Putin entzieht Nestlé die Kontrolle in Russland"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Tesla-Aktie legt trotz Cybercab-Untersuchung zu',
      summary: [
        'Laut finanzen.net leitete eine US-Aufsichtsbehörde am 17. September eine Untersuchung zum Tesla Cybercab ein. Die Tesla-Aktie legte am selben Tag dennoch zu, wie derselbe Ticker meldete.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass eine Aktie trotz einer behördlichen Untersuchung steigt, zeigt, dass ein Kurs oft schon andere Erwartungen einpreist, als es die Schlagzeile nahelegt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['tesla'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, 17.09.2026: „Tesla-Aktie dennoch fester: US-Aufsichtsbehörde leitet Untersuchung zum Cybercab ein"',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
