import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-04.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-04 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-04',
  intro:
    'Irans Währung stürzt ab, Kanada und der Irak bauen neue Ölwege, Bitcoin springt auf ein Wochenhoch – und die neue Woche bringt PMI-Daten und EZB-Reden.',
  top: [
    {
      headline: 'Irans Währung stürzt auf historisches Tief',
      summary: [
        'Der Euro kostet in Iran erstmals drei Millionen Rial. Das ist ein historischer Tiefstand für die iranische Währung, meldete die Nachrichtenagentur dpa-AFX am Wochenende.',
        'Löhne und Lebensmittel zeigen die Folgen. Der durchschnittliche Monatslohn fiel seit Jahresbeginn von rund 120 auf etwa 70 Euro. Ein Kilo Reis kostete zuletzt 5,5 Millionen Rial, ein halbes Jahr zuvor waren es 3,5 Millionen. Hintergrund sind laut der Meldung der anhaltende Krieg und US-Sanktionen gegen iranische Häfen, Banken und Fluggesellschaften.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein derart schneller Wertverlust einer Währung zeigt, wie stark Krieg und Sanktionen eine Volkswirtschaft von innen unter Druck setzen können.',
      relatedTopics: ['waehrungen-wechselkurse'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'investing.com, Meldung vom 03.10.2026, 14:29 Uhr (dpa-AFX): „Irans Währung fällt auf historisches Tief“',
          url: 'https://de.investing.com/news/economy-news/irans-wahrung-fallt-auf-historisches-tief-3689080',
        },
      ],
    },
    {
      headline: 'Kanada baut neue Pipeline, um unabhängiger von den USA zu werden',
      summary: [
        'Kanada treibt eine neue Ölpipeline zum Pazifik voran. Premierminister Mark Carney erklärte das Pacific-Link-Projekt zum nationalen Vorzeigevorhaben mit beschleunigter Genehmigung.',
        'Die Leitung soll bis zu eine Million Barrel Öl täglich transportieren, vor allem für Käufer in Asien. Bislang gehen neun von zehn kanadischen Ölexportbarrel in die USA. Die Kosten liegen Schätzungen zufolge bei 35 bis 44 Milliarden kanadischen Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer neue Exportwege baut, verringert seine Abhängigkeit von einem einzelnen Käufer – ein Thema, das über den Ölmarkt hinaus für jede Volkswirtschaft gilt.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['wti'],
      sources: [
        {
          label:
            'wallstreet-online, Meldung vom 02.10.2026: „Neue Groß-Pipeline: Millionen Barrel an den USA vorbei: Kanada baut die Öl-Autobahn nach Asien“',
          url: 'https://www.wallstreet-online.de/nachricht/21468168-gross-pipeline-millionen-barrel-usa-vorbei-kanada-baut-oel-autobahn-asien',
        },
      ],
    },
    {
      headline: 'Irak weicht der Straße von Hormus über die Türkei aus',
      summary: [
        'Der Irak baut eine zweite Route für sein Öl aus. Lastwagen bringen Rohöl zu einer Pipeline, die zum türkischen Hafen Ceyhan führt, vorbei an der Straße von Hormus.',
        'Im September liefen bereits 250.000 Barrel täglich über diesen Weg, bei insgesamt 2,65 Millionen Barrel Exporten. Rechnerisch wären bis zu 750.000 Barrel möglich. Der Irak bietet sein Öl dafür mit einem Abschlag von 15 bis 20 Dollar je Barrel an, berichtete wallstreet-online.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Je mehr Wege Öl aus der Golfregion findet, desto kleiner wird die Hebelwirkung einer möglichen Sperre der Straße von Hormus auf den Weltmarktpreis.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'wallstreet-online, Meldung vom 01.10.2026: „Hormus verliert an Macht: Iraks neuer Ölweg: Könnte das Angebot plötzlich stark steigen?“',
          url: 'https://www.wallstreet-online.de/nachricht/21462009-hormus-verliert-macht-iraks-oelweg-angebot-stark-steigen',
        },
      ],
    },
    {
      headline: 'Bitcoin springt auf höchsten Stand seit einer Woche',
      summary: [
        'Bitcoin stieg am Freitag zeitweise auf 87.219 Dollar. Das ist der höchste Stand seit etwa einer Woche, meldete die Nachrichtenagentur dpa-AFX.',
        'Grund waren schwache US-Arbeitsmarktdaten, die Zinserhöhungen der Fed unwahrscheinlicher machten. Kryptowährungen werfen keine eigenen Zinsen ab und profitieren deshalb besonders von sinkenden Zinserwartungen. Seit dem Rekordhoch von über 126.000 Dollar im Oktober 2025 bleibt der Kurs trotzdem rund 30 Prozent darunter.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ohne eigene Verzinsung hängt der Bitcoin-Kurs besonders stark an der erwarteten Zinsrichtung der Notenbanken – anders als etwa Anleihen oder Tagesgeld.',
      relatedTopics: ['bitcoin-krypto'],
      relatedSymbols: ['bitcoin'],
      sources: [
        {
          label:
            'finanznachrichten.de, Meldung vom 02.10.2026 (dpa-AFX): „Bitcoin-Kurs steigt über 87.000 US-Dollar auf höchsten Stand seit einer Woche“',
          url: 'https://www.finanznachrichten.de/nachrichten-2026-10/69743854-bitcoin-kurs-steigt-ueber-87-000-us-dollar-auf-hoechsten-stand-seit-einer-woche-016.htm',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Die neue Woche startet mit PMI-Daten und EZB-Reden',
      summary: [
        'Am Montag veröffentlichen Deutschland, Frankreich, Italien, Spanien und Irland ihre Dienstleistungs-Einkaufsmanagerindizes für September. Auch Japan legt seinen Wert vor.',
        'Deutschland lag im Vormonat bei 52,9 Punkten, Frankreich bei 51,4, Italien bei 55,2 und Spanien bei 57,8. Zusätzlich sprechen am selben Tag die EZB-Vertreter Joachim Nagel und Philip Lane.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Einkaufsmanagerindizes gelten als frühe Stimmungsindikatoren für die Konjunktur, lange bevor offizielle Wachstumszahlen vorliegen.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['euro-stoxx-50'],
      sources: [
        {
          label:
            'wallstreet-online.de, Wirtschaftskalender, abgerufen am 04.10.2026, 00:15 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
