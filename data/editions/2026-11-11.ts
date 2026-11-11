import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-11.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-11 00:16 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-11',
  intro:
    'Überraschende US-Inflationsdaten, Anthropics Preisspanne für den Mega-Börsengang, ein fallender Ölpreis, Infineons Rekordquartal und Nvidias schwere Woche.',
  top: [
    {
      headline:
        'US-Inflation steigt stärker als erwartet, Fed-Zinsschritt im Dezember gilt als sicher',
      summary: [
        'Die US-Verbraucherpreise stiegen im Oktober um 0,4 Prozent zum Vormonat, Ökonomen hatten nur 0,3 Prozent erwartet.',
        'Die Rendite zehnjähriger US-Staatsanleihen kletterte danach auf ein neues Zweijahreshoch, Fed-Gouverneur Waller brachte einen größeren Zinsschritt im Dezember ins Spiel.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Steigende Anleiherenditen verteuern die Abzinsung künftiger Unternehmensgewinne und belasten deshalb meist auch die Aktienmärkte.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['sp500'],
      sources: [
        {
          label:
            'Handelsblatt, News-Ticker vom 10.11.2026, 20:30 Uhr: „Wall Street: Überraschend hohe Inflation treibt wichtige US-Anleiherendite über Zwei-Jahres-Hoch“',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/usa-hohe-inflation-treibt-wichtige-anleiherendite-ueber-zwei-jahres-hoch/100268295.html',
        },
        {
          label:
            'CNBC, News-Ticker vom 10.11.2026, 22:06 Uhr: „10-year Treasury yield races back to 5%“',
          url: 'https://www.cnbc.com/2026/11/10/us-bonds-treasurys-yields.html',
        },
      ],
    },
    {
      headline: 'Anthropic nennt Preisspanne für Börsengang: 70 bis 78 Dollar',
      summary: [
        'Der KI-Konzern Anthropic hat für seinen Börsengang eine Preisspanne von 70 bis 78 Dollar je Aktie genannt, der Handel soll am 19. November beginnen.',
        'Bei diesem Preis würde Anthropic mit über einer Billion Dollar bewertet, Händler am Terminmarkt setzen bereits auf einen deutlichen Kurssprung zum Start.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein hoher Kurssprung am ersten Handelstag bedeutet zugleich, dass die begleitenden Banken das Unternehmen beim Ausgabepreis günstiger bewertet haben, als Anleger zu zahlen bereit sind.',
      relatedTopics: ['aktie', 'boerse'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'Tagesschau, 10.11.2026, 16:37 Uhr: „Anthropic peilt Börsen-Bewertung von über einer Billion Dollar an“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/anthropic-boerse-kuenstliche-intelligenz-100.html',
        },
        {
          label:
            'CNBC, News-Ticker vom 10.11.2026, 16:42 Uhr: „Anthropic sets IPO price range of $70 to $78“',
          url: 'https://www.cnbc.com/2026/11/10/anthropic-sets-price-range-of-70-to-78-in-upcoming-ipo.html',
        },
      ],
    },
    {
      headline: 'Ölpreis fällt erstmals seit August unter 90 Dollar',
      summary: [
        'Der Preis für ein Barrel der Sorte Brent fiel am Dienstag erstmals seit August unter 90 Dollar.',
        'US-Präsident Trump erklärte den Krieg um Iran für „effektiv vorüber“, Anleger setzen nach den Zwischenwahlen auf Verhandlungen statt weitere Eskalation.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ölpreise reagieren fast augenblicklich auf geopolitische Nachrichten, während niedrigere Einkaufspreise erst mit Verzögerung bei Verbrauchern ankommen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'Handelsblatt, News-Ticker vom 10.11.2026, 11:04 Uhr: „Energie: Ölpreis sinkt erstmals seit August wieder unter 90 Dollar“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/devisen-rohstoffe/energie-oelpreis-sinkt-erstmals-seit-august-wieder-unter-90-dollar/100268734.html',
        },
        {
          label:
            'WirtschaftsWoche, News-Ticker vom 10.11.2026, 09:10 Uhr: „Ölpreis aktuell: Iran-Krieg laut Donald Trump ‚effektiv vorüber‘“',
          url: 'https://www.wiwo.de/finanzen/oelpreis-aktuell-iran-krieg-laut-donald-trump-effektiv-vorueber/100207502.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Infineon schließt Geschäftsjahr mit Rekordquartal ab',
      summary: [
        'Infineon erzielte im vierten Quartal einen Umsatz von 4,706 Milliarden Euro und im Gesamtjahr 16,353 Milliarden Euro, beides Rekordwerte.',
        'Für 2027 erwartet der Chipkonzern ein Umsatzwachstum von mehr als 20 Prozent und will die Dividende je Aktie um 3 Cent auf 38 Cent anheben.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Prognose für das kommende Jahr bewegt Aktienkurse oft stärker als die bereits bekannten Zahlen des vergangenen, weil Börsenkurse künftige Gewinne vorwegnehmen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['infineon'],
      sources: [
        {
          label:
            'ad-hoc-news.de, Unternehmensmeldung (DGAP) vom 10.11.2026, 07:30 Uhr: „Infineon schließt GJ 2026 mit Rekordquartal ab“',
          url: 'https://www.ad-hoc-news.de/boerse/news/corporate-news/infineon-schliesst-gj-2026-mit-rekordquartal-ab-und-erwartet-fuer-gj-2027-starkes-umsatzwachstum/70484279',
        },
        {
          label:
            'Tagesschau, 10.11.2026, 14:33 Uhr: „KI-Boom: Deutscher Chipkonzern Infineon will weiter zweistellig wachsen“',
          url: 'https://www.tagesschau.de/wirtschaft/finanzen/marktbericht-infineon-ki-100.html',
        },
      ],
    },
    {
      headline:
        'Nvidia verliert binnen einer Woche fast eine Billion Dollar an Börsenwert',
      summary: [
        'Die Nvidia-Aktie fiel am Dienstag den zweiten Tag in Folge, binnen einer Woche verlor der Konzern rund eine Billion Dollar an Börsenwert.',
        'Chef Jensen Huang kehrte ins Büro zurück, nachdem er eine Affäre mit einer mutmaßlichen chinesischen Spionin eingeräumt hatte, der Vorstand prüft einen Spionagevorwurf gegen ihn.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Kursverlust zeigt, wie stark Aktienkurse auch vom Vertrauen in die Unternehmensführung abhängen können, unabhängig von Umsatz und Gewinn.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['nvidia'],
      sources: [
        {
          label:
            'Handelsblatt, News-Ticker vom 10.11.2026, 20:41 Uhr: „Huang-Affäre: Nvidia verliert binnen einer Woche rund eine Billion Dollar an Börsenwert“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/nvidia-aktie-chipkonzern-verliert-in-einer-woche-knapp-eine-billion-dollar-boersenwert/100268874.html',
        },
        {
          label:
            "CNBC, News-Ticker vom 10.11.2026, 23:08 Uhr: „Nvidia sells off for second day in fallout from Jensen Huang's affair with alleged spy“",
          url: 'https://www.cnbc.com/2026/11/10/nvidia-nvda-jensen-huang-affair-chinese-spy.html',
        },
      ],
    },
  ],
}
