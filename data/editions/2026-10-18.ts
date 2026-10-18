import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-18.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-18 13:10 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-18',
  intro:
    'Neue Angriffe am Ölmarkt, ein Rekorddefizit in den USA, Trumps Sanktions-Kehrtwende und eine Warnung der Bank of England vor Hedgefonds.',
  top: [
    {
      headline: 'Ukraine greift Ölhafen an, Saudi-Arabien fängt Raketen ab',
      summary: [
        'Die Ukraine griff nach einem Bericht einen Ölhafen an. Ziel war demnach eine Anlage in St. Petersburg. Eine zweite, unabhängige Quelle dazu lag bislang nicht vor.',
        'Saudi-Arabien fing zwei Raketen ab. Die Raketen kamen nach Angaben der Agentur dpa-AFX aus dem Jemen. Zum Ziel wurde nichts bekannt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Angriff auf Öl-Infrastruktur erhöht die eingepreiste Risikoprämie am Ölmarkt, noch bevor sich ein tatsächlicher Lieferausfall zeigt.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'onvista, dpa-AFX-Meldung vom 18.10.2026, 10:35 Uhr: „ROUNDUP: Saudi-Arabien fängt zwei ballistische Raketen aus dem Jemen ab“',
          url: 'https://www.onvista.de/news/2026/10-18-roundup-saudi-arabien-faengt-zwei-ballistische-raketen-aus-dem-jemen-ab-0-10-26565304',
        },
        {
          label:
            'wallstreet-online, dpa-AFX-Meldung vom 18.10.2026, 11:57 Uhr: „Bericht: Ukraine greift Ölhafen in St. Petersburg an“',
          url: 'https://www.wallstreet-online.de/nachricht/21542218-bericht-ukraine-greift-oelhafen-st-petersburg',
        },
      ],
    },
    {
      headline: 'US-Haushaltsdefizit steigt im Jahr 2026 auf fast zwei Billionen Dollar',
      summary: [
        'Das US-Finanzministerium veröffentlichte die Zahlen zum Haushaltsjahr 2026. Das Defizit liegt bei fast zwei Billionen Dollar. Das sind zwölf Prozent mehr als im Vorjahr.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein höheres Defizit muss über neue Staatsanleihen finanziert werden. Das erhöht das Angebot an Anleihen und kann die Zinsen am Markt zusätzlich stützen.',
      relatedTopics: ['schulden-und-kredit', 'staatsanleihe'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'CNBC, 16.10.2026, 22:34 Uhr GMT: „U.S. budget deficit swells to almost $2 trillion for fiscal 2026, up 12% in a single year“',
          url: 'https://www.cnbc.com/2026/10/16/us-budget-deficit-2026.html',
        },
      ],
    },
    {
      headline: 'Trump setzt neue Russland-Sanktionen aus',
      summary: [
        'Donald Trump setzte neue Russland-Sanktionen aus. Er hatte das zugrunde liegende Gesetz im September unterschrieben. Ukraines Präsident Selenskyj nannte den Schritt falsch.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Sanktionen gegen ein Land wirken wie ein Eingriff in den Welthandel. Ihre Aussetzung ändert das wirtschaftliche Risiko für betroffene Branchen unmittelbar.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            "CNBC, 18.10.2026, 12:50 Uhr GMT: „Trump waives broad new Russia sanctions, Zelenskyy condemns it as 'wrong'“",
          url: 'https://www.cnbc.com/2026/10/17/trump-waives-russia-related-sanctions-tariffs-before-they-take-effect-.html',
        },
      ],
    },
    {
      headline: 'Bank of England warnt vor Hedgefonds-Risiko für Anleihemarkt',
      summary: [
        'Ein Vize-Gouverneur der Bank of England warnte vor Hedgefonds. Ihre Geschäfte könnten einen Schock am globalen Anleihemarkt wahrscheinlicher machen. Details nannte er nicht.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Wenn stark verschuldete Investoren gleichzeitig Positionen abbauen müssen, kann die Liquidität am Anleihemarkt schnell austrocknen.',
      relatedTopics: ['staatsanleihe', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'CNBC, 18.10.2026, 06:13 Uhr GMT: „Why hedge funds could be making a bond market shock more likely“',
          url: 'https://www.cnbc.com/2026/10/18/hedge-funds-bond-market-turmoil.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Berkshire-Aktie erreicht höchsten Stand seit Mai 2025',
      summary: [
        'Die Berkshire-Aktie stieg auf ihr höchstes Niveau seit Mai 2025. Damals hatte Warren Buffett seinen Rückzug als Chef angekündigt. Der breite Markt gab zuletzt nach, Berkshire nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Dass eine Einzelaktie gegen einen breiten Ausverkauf steigt, zeigt, wie wenig gleichmäßig sich ein Index unter der Oberfläche bewegt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['berkshire'],
      sources: [
        {
          label:
            'CNBC, 17.10.2026, 12:46 Uhr GMT: „Berkshire shares buck market sell-off, rally to highest since Buffett said he would step down as CEO“',
          url: 'https://www.cnbc.com/2026/10/17/berkshire-rally-to-highest-since-buffett-announcement.html',
        },
      ],
    },
  ],
}
