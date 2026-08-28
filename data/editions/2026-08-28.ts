import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-28.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-28 04:23 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-28',
  intro:
    'Nvidia lässt den DAX steigen und den Euro Stoxx 50 fallen, ein Gold-ETF zieht fast zwei Milliarden Dollar an, heute meldet die Bundesagentur Arbeitsmarktzahlen.',
  top: [
    {
      headline: 'DAX gewinnt, Euro Stoxx 50 verliert – am selben Morgen',
      summary: [
        'Nach Nvidias Quartalszahlen zeigte die Kurstafel von finanzen.net den DAX am Freitagmorgen bei 26.367 Punkten im Plus von 0,3 Prozent, den Euro Stoxx 50 zur selben Zeit bei 6.425 Punkten im Minus von 0,7 Prozent.',
        'Laut Dax-Tagesrückblick von onvista stand SAP an der Dax-Spitze, während dpa-AFX für Europa insgesamt Verluste trotz Nvidia vor dem Notenbanksymposium in Jackson Hole meldete.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zwei Indizes aus derselben Region liefen am selben Tag auseinander – ein Beleg dafür, dass die Gewichtung einzelner Werte einen Index stärker prägt als die gemeinsame Region.',
      relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'euro-stoxx-50'],
      sources: [
        {
          label:
            'finanzen.net, Kursleiste „Heute im Fokus“, Abruf 28.8.2026, 04:23 Uhr GMT: DAX 26.367 Punkte (+0,3 %), Est50 6.425 Punkte (-0,7 %)',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'onvista, Dax Tagesrückblick vom 27.8.2026, 15:59 Uhr: „Nvidia-Zahlen reichen für kleines Plus – SAP an Dax-Spitze“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'EZB-Falken drängen auf höhere Zinsen, der Freitag bringt neue Daten',
      summary: [
        'Wallstreet-online und finanzen.net berichten übereinstimmend, dass im EZB-Rat bereits über eine weitere Zinserhöhung diskutiert wird – ein Beschlussdatum nennt keine der beiden Quellen.',
        'Am Freitag selbst folgen laut Wirtschaftskalender mehrere Konjunkturdaten: die deutsche Arbeitslosenquote um 09:55 Uhr, Importpreise um 08:00 Uhr sowie mehrere französische Zahlen um 08:45 Uhr.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zinserwartungen bewegen Anleihen, Kredite und Aktien gleichermaßen – wer die Richtung der Diskussion kennt, versteht auch, warum der Bund-Future heute Morgen im Minus notierte.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'wallstreet-online.de, Nachricht vom 27.8.2026: „Falken setzen sich durch: EZB vor Zinserhöhung – doch das könnten erst der Anfang sein“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'boerse-frankfurt.de, „Kommende Termine“, Abruf 28.8.2026, 04:23 Uhr GMT: Termine am 28. August 2026',
          url: 'https://www.boerse-frankfurt.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Größter Gold-ETF zieht fast zwei Milliarden Dollar an',
      summary: [
        'Goldreporter meldet einen Zufluss von fast zwei Milliarden US-Dollar beim größten Gold-ETF, während der Goldpreis selbst nach der August-Rally laut derselben Quelle einen neuen Boden sucht.',
        'Am Freitagmorgen notierte Gold laut Kurstafel von wallstreet-online bei 4.583,08 US-Dollar, ein Minus von 0,40 Prozent.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Der Zufluss zeigt gestiegene Nachfrage nach physischem Gold über den Fonds – unabhängig davon, ob der Kurs am selben Tag steigt oder fällt.',
      relatedTopics: ['etf', 'rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'goldreporter.de, Top-News, Abruf 28.8.2026, 04:23 Uhr GMT: „Größter Gold-ETF meldet fast 2 Milliarden Dollar Zufluss“',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'wallstreet-online.de, Kurstafel, Abruf 28.8.2026, 04:23 Uhr GMT: Gold 4.583,08 US-Dollar (-0,40 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Öl fließt wieder durch die Straße von Hormus – aber zäh',
      summary: [
        'Mit sogenannten Shuttle-Schiffen gelangt laut wallstreet-online wieder Rohöl durch die Straße von Hormus; die genaue Menge lässt sich laut Quelle nur über Satellitenbilder abschätzen.',
        'Zwei Kurstafeln zeigten am Freitagmorgen unterschiedliche Vorzeichen für „Öl“ – ein Hinweis darauf, dass Brent und WTI zwei verschiedene Referenzpreise sind.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer Ölpreis-Prozentzahlen zwischen Portalen vergleicht, sollte zuerst prüfen, ob beide dieselbe Rohölsorte meinen – sonst vergleicht er zwei verschiedene Märkte.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online.de, Nachricht vom 27.8.2026: „Mit Shuttle-Schiffen: Durch die Straße von Hormus fließt wieder Rohöl – aber sehr zäh“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'finanzen.net, Kursleiste „Heute im Fokus“, Abruf 28.8.2026, 04:23 Uhr GMT: Öl 89,21 US-Dollar (-0,6 %)',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Voltatron kauft zu: mehr Umsatz, weniger Marge in Aussicht',
      summary: [
        'Laut einer EQS-Adhoc-Meldung übernimmt Voltatron die Kurz Elektronik GmbH gegen Bargeld und neue Aktien aus einer Sachkapitalerhöhung.',
        'Die Umsatzprognose steigt laut Mitteilung, die Erwartung an die EBT-Marge sinkt zugleich wegen geplanter Investitionen und Integrationsaufwendungen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Die Meldung zeigt, warum eine angehobene Umsatzprognose allein noch nichts über die Profitabilität einer Übernahme aussagt.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'EQS Group AG, EQS-Adhoc vom 27.8.2026: „Voltatron übernimmt Kurz Elektronik GmbH gegen Geldleistung und Ausgabe neuer Aktien aus einer Sachkapitalerhöhung“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'wallstreet-online.de, wO Newsflash vom 27.8.2026: „Voltatron kauft Kurz Elektronik: Umsatzprognose steigt trotz Investitionen“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
