import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2. August 2026 – ein Sonntag.
 *
 * Sonntags ruht die Börse, aber nicht die Nachrichtenlage: OPEC+ setzt
 * seine Quotensitzungen bewusst auf diesen Tag, Kryptowährungen handeln
 * durch, und die Terminliste der neuen Woche steht fest. Die Ausgabe ist
 * entsprechend schlanker als eine Werktagsausgabe – vier Meldungen, alle
 * mit Wochenend- oder Wochenblick, keine mit erfundener Börsenaktivität.
 *
 * Zur Quellenlage: AFP-Text zum OPEC-Treffen über zwei unabhängig geholte
 * Artikelseiten (Al-Monitor, Free Malaysia Today), dazu wallstreetONLINE
 * vom Freitag und finanzmarktwelt vom Wochenanfang. Ein gesponserter
 * Krypto-Prognosetext (Tokenwire) wurde gelesen und bewusst nicht
 * verwendet – gekaufte Inhalte sind keine Quelle.
 */
export const edition: DailyEdition = {
  date: '2026-08-02',
  intro:
    'Sieben OPEC+-Staaten beraten online über die September-Quote, Bitcoin handelt das Wochenende schwächer durch, und 31 Quartalstermine warten.',
  top: [
    {
      headline: 'OPEC+ berät heute über 188.000 Barrel mehr – auf dem Papier',
      summary: [
        'Saudi-Arabien, Russland und fünf weitere OPEC+-Staaten beraten heute in einer Online-Sitzung über die Förderquoten für September. Erwartet wird laut AFP eine Anhebung um 188.000 Barrel pro Tag – voraussichtlich die letzte der laufenden Serie, mit der die Kürzungen aus den Jahren 2022/23 zurückgedreht werden.',
        'Viele Mitglieder können ihre Ziele allerdings gar nicht ausschöpfen: Russland fördert nach Drohnenangriffen auf seine Infrastruktur rund neun statt der erlaubten 9,8 Millionen Barrel täglich, und die Straße von Hormus bleibt im Nahostkrieg weitgehend gelähmt. Es ist zudem die erste September-Entscheidung seit dem Austritt der Emirate zum 1. Mai.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Quote ist eine Erlaubnis, kein Öl. Der Preis richtet sich nach Fässern, die wirklich verladen werden – deshalb kann eine beschlossene „Erhöhung“ den Markt kaltlassen, wenn Kapazität und Transportwege fehlen.',
      relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'Al-Monitor / AFP: „OPEC+ tipped to raise production again but new quotas loom“ (1. August 2026)',
          url: 'https://www.al-monitor.com/originals/2026/08/opec-tipped-raise-production-again-new-quotas-loom',
        },
        {
          label:
            'Free Malaysia Today / AFP: gleicher Agenturtext, unabhängig geholt (2. August 2026)',
          url: 'https://www.freemalaysiatoday.com/category/business/2026/08/02/opec-tipped-to-raise-production-again-but-new-quotas-loom',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Bitcoin handelt das Wochenende durch – und weiter abwärts',
      summary: [
        'Bitcoin fiel am Freitag laut wallstreetONLINE auf 63.744 US-Dollar und gab am Wochenende weiter nach: In der Nacht zum Sonntag standen nach den hier geführten Yahoo-Tagesdaten 62.766 Dollar auf der Anzeige, Ethereum notierte bei rund 1.845 Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Kryptowährungen handeln an 365 Tagen, Aktien an rund 252. Wochenendbewegungen entstehen in dünnem Handel und gehören nicht überinterpretiert – und Vergleiche zwischen beiden Welten brauchen denselben Zeitraum.',
      relatedTopics: ['bitcoin-krypto', 'boerse'],
      relatedSymbols: ['bitcoin', 'ethereum'],
      sources: [
        {
          label:
            'wallstreetONLINE: „Bitcoin vor Wochenende schwächer: Kurs fällt auf 63.744 USD“ (31. Juli 2026)',
          url: 'https://www.wallstreet-online.de/nachricht/21178403-bitcoin-kurs-aktuell-bitcoin-wochenende-schwaecher-kurs-faellt-63-744-usd-alarm-31-07-26',
        },
      ],
    },
    {
      headline: 'Die neue Woche: 31 erwartete Quartalstermine',
      summary: [
        'Der Terminkalender dieser Website erwartet für die kommenden Handelstage 31 Quartalsmeldungen – am Montag unter anderem Berkshire Hathaway und Palantir, am Dienstag AMD, Caterpillar und Pfizer, am Mittwoch McDonald’s und Uber, am Donnerstag Eli Lilly und Gilead. Alle Termine sind aus den Meldemustern der Vorjahre gerechnet, nicht von den Unternehmen bestätigt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Termine sind selbst Kurstreiber: Vor Zahlen steigt oft die Schwankung, danach entlädt sie sich. Wer weiß, wann seine Titel melden, wird seltener überrascht – verbindlich ist allein die Ankündigung des Unternehmens.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['berkshire', 'palantir', 'amd', 'eli-lilly'],
      sources: [
        {
          label:
            'Terminkalender dieser Website: erwartete Meldetermine aus den 8-K-Mustern der SEC',
          url: 'https://iminvests.de/kalender',
        },
      ],
    },
    {
      headline: 'Terminmarkt: September-Erhöhung der Fed voll eingepreist',
      summary: [
        'Vor dem Fed-Entscheid der vergangenen Woche preiste der Terminmarkt laut finanzmarktwelt eine Zinserhöhung im September vollständig ein, bis Jahresende sogar einen zweiten Schritt; die Rendite zehnjähriger US-Anleihen stieg auf 4,7 Prozent. Die Fed hielt die Spanne am Mittwoch still – mit drei Gegenstimmen für eine Erhöhung.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Eingepreist heißt: schon bezahlt. Kurse bewegt nicht die Nachricht selbst, sondern ihr Abstand zur Erwartung – und steigende Anleiherenditen sind die Schwerkraft jeder Aktienbewertung.',
      relatedTopics: ['notenbanken-geldpolitik', 'schuldverschreibung'],
      relatedSymbols: ['sp500', 'nasdaq-100'],
      sources: [
        {
          label:
            'finanzmarktwelt.de: „Aktienmärkte vor Schicksalswoche: Vier Tage, fünf Risiken“ (28. Juli 2026)',
          url: 'https://finanzmarktwelt.de/aktienmaerkte-vor-schicksalswoche-vier-tage-fuenf-risiken-396636/',
        },
      ],
    },
  ],
}
