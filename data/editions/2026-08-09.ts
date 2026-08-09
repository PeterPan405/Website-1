import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-09.
 *
 * Recherchierte Fassung vom Abend des 9. August: Sie ersetzt den am Morgen
 * automatisch erzeugten Notbehelf aus dem eigenen Kursbestand – auf Wunsch
 * des Betreibers („die internen rausnehmen und ersetzen“). Quellen wurden
 * über `quellen-holen.yml` gelesen; die Rubrik-Übersichtsseiten waren am
 * Sonntagabend sämtlich Gerüste, deshalb stützt sich die Ausgabe auf einzeln
 * gesuchte Artikelseiten.
 */
export const edition: DailyEdition = {
  date: '2026-08-09',
  intro:
    'Ein schwacher US-Jobbericht kippt die Zinswetten, Chinas Inflation halbiert sich, Gold verbucht die stärkste Woche seit Januar – der Sonntag im Überblick.',
  top: [
    {
      headline: 'Von Erhöhung auf Pause: Jobbericht kippt die Fed-Wetten',
      summary: [
        'Statt erwarteter 80.000 neuer Stellen meldeten die USA für Juli ein Minus von 23.000; der Juni wurde nach unten revidiert.',
        'Vor dem Bericht preisten Terminmärkte eine September-Zinserhöhung mit 55 Prozent ein – danach gilt die Pause als wahrscheinlichstes Szenario (Polymarket 63, Kalshi 65, CME 55,6 Prozent).',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Was alle erwarten, steckt schon in den Kursen – erst die Abweichung bewegt sie. Wie schnell Zinswetten kippen, zeigt, dass sie Momentaufnahmen sind und keine Fakten.',
      relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['sp500', 'nasdaq-100'],
      sources: [
        {
          label: 'FXStreet-Wochenausblick vom 7.8.2026, abgerufen 9.8.2026',
          url: 'https://www.fxstreet.de.com/news/prognose-fur-die-kommende-woche-us-inflation-steht-nachste-woche-im-mittelpunkt-202608071934',
        },
        {
          label: 'finanzmarktwelt.de zum Arbeitsmarktbericht, abgerufen 9.8.2026',
          url: 'https://finanzmarktwelt.de/us-arbeitsmarkt-schockt-maerkte-fed-zinswetten-kippen-397726/',
        },
        {
          label: 'Bitcoin.com News (deutsch) vom 9.8.2026 zu den Prognosemärkten',
          url: 'https://news.bitcoin.com/de/finance/erwartungen-hinsichtlich-einer-zinserhoehung-durch-die-fed-schwinden-waehrend-die-wahrscheinlichkeit-einer-pause-im-september-deutlich-an-boden-gewinnt/',
        },
      ],
    },
    {
      headline: 'China: Inflation halbiert sich auf 0,5 Prozent',
      summary: [
        'Das Statistikamt NBS meldete am Sonntag für Juli +0,5 Prozent zum Vorjahr nach 1,0 Prozent im Juni; erwartet waren 0,8 Prozent.',
        'Die Kernrate liegt bei 0,9 Prozent, getragen von Dienstleistungen; die Erzeugerpreise stiegen um 3,5 Prozent zum Vorjahr.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Sehr niedrige Inflation kann auf schwache Binnennachfrage hindeuten. Wer Schwellenländer-ETFs hält, hält immer auch eine Wette auf Chinas Nachfrage – Preisdaten sind dafür ein früher Fühler.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['hang-seng', 'eur-cny'],
      sources: [
        {
          label: 'CGTN mit den NBS-Daten vom 9.8.2026, abgerufen 9.8.2026',
          url: 'https://news.cgtn.com/news/2026-08-09/China-s-CPI-and-PPI-maintain-upward-trend-in-July-1PsKq8Nf3cQ/p.html',
        },
      ],
    },
    {
      headline: 'Gold über 4.300 Dollar: stärkste Woche seit Januar',
      summary: [
        'Nach dem Jobbericht reichte die Bewegung in der Spitze bis 4.371 Dollar; am Sonntagabend standen 4.342,26 Dollar in der Kursleiste.',
        'Träger der Rally sind die eingebrochenen Zinserhöhungserwartungen – nicht die Krisenlage, an der sich diese Woche nichts geändert hat.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Gold zahlt keine Zinsen – sein Preis hängt an den Opportunitätskosten. Fällt der US-Inflationswert am Mittwoch höher aus als erwartet, kann sich der Rückenwind schnell drehen.',
      relatedTopics: ['rohstoffe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'FXStreet-Wochenausblick vom 7.8.2026, abgerufen 9.8.2026',
          url: 'https://www.fxstreet.de.com/news/prognose-fur-die-kommende-woche-us-inflation-steht-nachste-woche-im-mittelpunkt-202608071934',
        },
        {
          label: 'finanzmarktwelt.de (Spitze 4.371 Dollar), abgerufen 9.8.2026',
          url: 'https://finanzmarktwelt.de/us-arbeitsmarkt-schockt-maerkte-fed-zinswetten-kippen-397726/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Euro über 1,15 Dollar – eine Dollar-Geschichte',
      summary: [
        'EUR/USD beendete die Woche über 1,1550 nahe einem Zweimonatshoch, der Dollar-Index fiel unter 100; der Dollar verlor gegen alle großen Währungen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Wechselkurs erzählt immer zwei Geschichten. Diesmal ist es die amerikanische: Ein schwächerer Dollar drückt den Euro-Wert von US-Anlagen, ohne dass sich an den Unternehmen etwas ändert.',
      relatedTopics: ['waehrungen-wechselkurse'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label: 'FXStreet-Wochenausblick vom 7.8.2026, abgerufen 9.8.2026',
          url: 'https://www.fxstreet.de.com/news/prognose-fur-die-kommende-woche-us-inflation-steht-nachste-woche-im-mittelpunkt-202608071934',
        },
      ],
    },
    {
      headline: 'Bitcoin: Kursziele liegen 212.000 Dollar auseinander',
      summary: [
        'Große Häuser sehen Bitcoin laut wallstreet-online zwischen 38.000 und 250.000 Dollar; der Kurs lag am 7. August bei rund 64.970 Dollar, 48 Prozent unter dem Rekord.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Eine so breite Prognosespanne ist selbst die Information: Niemand weiß es. Und die beiden Quelltexte münden in Werbung für denselben Token-Vorverkauf – ein Lehrstück, Werbung in Nachrichtenform zu erkennen.',
      relatedTopics: ['bitcoin-krypto', 'anlegerpsychologie'],
      relatedSymbols: ['bitcoin'],
      sources: [
        {
          label:
            'wallstreet-online vom 9.8.2026 zu Bitcoin-Prognosen, abgerufen 9.8.2026',
          url: 'https://www.wallstreet-online.de/nachricht/21220632-bitcoin-prognose-2026-wale-kaufen-btc-1-2-milliarden-dollar-kursziele-liegen-212-000-dollar-auseinander',
        },
      ],
    },
    {
      headline: 'Die Woche voraus: US-Inflation am Mittwoch',
      summary: [
        'Der US-Verbraucherpreisindex am Mittwoch ist der Haupttermin (Prognose 3,4 Prozent); dazu RBA-Entscheid am Dienstag, BIP aus Großbritannien und der Eurozone.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Prognosewerte stecken bereits in den Kursen. Ein Ergebnis auf Konsens ist oft ein Nicht-Ereignis, wenige Zehntel Abweichung bewegen Renditen, Währungen und Aktien zugleich.',
      relatedTopics: ['notenbanken-geldpolitik', 'boerse'],
      relatedSymbols: ['sp500', 'euro-stoxx-50'],
      sources: [
        {
          label: 'FXStreet-Wochenausblick vom 7.8.2026, abgerufen 9.8.2026',
          url: 'https://www.fxstreet.de.com/news/prognose-fur-die-kommende-woche-us-inflation-steht-nachste-woche-im-mittelpunkt-202608071934',
        },
      ],
    },
  ],
}
