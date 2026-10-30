import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-30.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-30 00:16 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-30',
  intro:
    'Alphabet verliert 500 Milliarden Dollar Börsenwert, die US-Wirtschaft wächst kräftig, Lagarde tritt vorzeitig zurück, und VW trotzt dem Verlust.',
  top: [
    {
      headline: 'Alphabet verliert in einem Tag 500 Milliarden Dollar',
      summary: [
        'Die Google-Mutter Alphabet verlor am Donnerstag an der Nasdaq fast 13 Prozent und rund 500 Milliarden Dollar an Börsenwert – der schlechteste Handelstag der Firmengeschichte.',
        'Auch Nasdaq und Dow Jones schlossen schwächer. Microsoft-Aktien stiegen dagegen, nachdem der Konzern ein starkes Wachstum im Cloud-Geschäft Azure gemeldet hatte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Kurssturz zeigt, wie empfindlich der Markt auf hohe KI-Investitionen reagiert, wenn sie den freien Cashflow belasten.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['alphabet', 'microsoft', 'nasdaq-100', 'dow-jones'],
      sources: [
        {
          label: 'Handelsblatt, Massiver Kursrutsch von Alphabet, 29.10.2026, 20:58 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-alphabet-kursrutsch-vernichtet-500-milliarden-dollar-boersenwert/100265906.html',
        },
        {
          label:
            'CNBC, Alphabet tanks nearly 13% for worst day ever, 29.10.2026, 20:15 Uhr',
          url: 'https://www.cnbc.com/2026/10/29/alphabet-google-microsoft-msft-shares-today-earnings.html',
        },
      ],
    },
    {
      headline: 'US-Wirtschaft wächst kräftig, Inflation zieht an',
      summary: [
        'Die US-Wirtschaft wuchs im dritten Quartal nach einer ersten Schätzung um 3,4 Prozent – das kräftigste Tempo seit einem Jahr.',
        'Gleichzeitig zog der von der Notenbank Fed beachtete PCE-Preisindex weiter an. Ökonomen hatten im Schnitt mit 0,5 Prozent im Monatsvergleich gerechnet, einer Jahresrate von 3,7 Prozent entsprechend.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Starkes Wachstum bei zugleich steigender Inflation erschwert der Fed die Entscheidung über den nächsten Zinsschritt.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dow-jones', 'nasdaq-100'],
      sources: [
        {
          label:
            'CNBC, Third-quarter U.S. GDP increases a better-than-expected 3.4%, 29.10.2026, 18:06 Uhr',
          url: 'https://www.cnbc.com/2026/10/29/pce-inflation-report-september-2026-.html',
        },
        {
          label: 'Handelsblatt, Wichtiges US-Inflationsmaß steigt, 29.10.2026, 12:46 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/preise-wichtiges-us-inflationsmass-steigt-druck-auf-fed-waechst/100265861.html',
        },
      ],
    },
    {
      headline: 'EZB-Chefin Lagarde tritt im Februar vorzeitig zurück',
      summary: [
        'Die Europäische Zentralbank beließ ihren Leitzins am Donnerstag wie erwartet bei 2,5 Prozent.',
        'EZB-Chefin Christine Lagarde kündigte zugleich an, ihr Amt bereits im kommenden Februar vorzeitig aufzugeben. Sie sagte, sie wolle frei sprechen können, vor allem zur Präsidentschaftswahl in Frankreich.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der frühere Abschied löst eine Nachfolgedebatte aus, die die Ausrichtung der EZB-Geldpolitik für Jahre prägen könnte.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['euro-stoxx-50', 'eur-usd'],
      sources: [
        {
          label:
            'Tagesschau, EZB-Chefin Lagarde tritt im Februar vorzeitig zurück, 29.10.2026, 13:51 Uhr',
          url: 'https://www.tagesschau.de/wirtschaft/finanzen/lagarde-ezb-ruecktritt-100.html',
        },
        {
          label: 'Handelsblatt, Ich will frei sprechen können, 29.10.2026, 14:42 Uhr',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/ezb-das-sagt-ezb-praesidentin-lagarde-zu-ihrem-vorzeitigen-abschied/100265926.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Volkswagen verbucht Milliardenverlust, Aktie legt zu',
      summary: [
        'Volkswagen verbuchte im dritten Quartal einen Konzernverlust von 5,8 Milliarden Euro. Als Gründe nennt das Unternehmen hohe Abschreibungen und ein schwaches China-Geschäft.',
        'Die Aktie legte am Nachmittag trotz des Verlusts zu, wie onvista berichtete. Einen Grund für die Kursbewegung nennen die Berichte nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass eine Aktie trotz eines Rekordverlusts steigt, zeigt: Der Markt bewertet Ergebnisse gegen seine vorherigen Erwartungen, nicht gegen die absolute Zahl.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['volkswagen', 'dax'],
      sources: [
        {
          label: 'Tagesschau, Milliardenverlust bei Volkswagen, 29.10.2026, 09:16 Uhr',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/volkswagen-milliardenverlust-102.html',
        },
        {
          label:
            'onvista, Volkswagen: Trotz Milliardenverlust steigt die Aktie, 29.10.2026, 15:43 Uhr',
          url: 'https://www.onvista.de/news/2026/10-29-volkswagen-trotz-milliardenverlust-steigt-die-aktie-40338625-19-26570010',
        },
      ],
    },
    {
      headline: 'EU und Kanada schwächen Pläne für engere Bindung ab',
      summary: [
        'Bundeskanzler Merz und andere Staats- und Regierungschefs der EU haben die Pläne von EU-Kommissionspräsidentin von der Leyen für eine engere Bindung Kanadas an die EU abgeschwächt. Von einer assoziierten Mitgliedschaft ist keine Rede mehr.',
        'Der Gipfel der EU mit Kanada begann am Donnerstag in Montreal. Kanada spürt die Folgen der von US-Präsident Trump verhängten Zölle bereits deutlich, berichtete die Tagesschau.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wie eng sich die EU an Kanada bindet, berührt Lieferketten und Handelswege – ein Thema auch für europäische Anleger.',
      relatedTopics: ['aktien-laender-branchen'],
      relatedSymbols: ['tsx-composite', 'euro-stoxx-50'],
      sources: [
        {
          label:
            'Tagesschau, EU-Kanada-Gipfel: Kanada wird vorerst kein assoziiertes EU-Mitglied, 29.10.2026, 07:20 Uhr',
          url: 'https://www.tagesschau.de/ausland/europa/eu-kanada-gipfel-100.html',
        },
        {
          label:
            'Tagesschau, Wie Kanada unter Trumps Zöllen leidet, 29.10.2026, 14:12 Uhr',
          url: 'https://www.tagesschau.de/ausland/amerika/kanada-zoelle-trump-eu-100.html',
        },
        {
          label: "Il Foglio, Von der Leyen's proposal to Canada fizzles out, 24.10.2026",
          url: 'https://www.ilfoglio.it/en/world/2026/10/24/news/von-der-leyens-proposal-to-canada-fizzles-out-carneys-plan-is-on-the-table--411491',
        },
      ],
    },
  ],
}
