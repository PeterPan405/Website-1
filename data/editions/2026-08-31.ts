import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-31.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-31 00:14 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-31',
  intro:
    'DAX-Rekord und Nasdaq-Bremse nach einer Fed-Rede, Gold und Öl schlagen unterschiedlich aus, und heute meldet halb Deutschland seine Inflation.',
  top: [
    {
      headline: 'DAX auf Rekordhoch, Nasdaq bremst: Warsh-Rede spaltet die Märkte',
      summary: [
        'Nach der Rede von Fed-Chef Kevin Warsh in Jackson Hole kletterte der DAX am Freitag auf ein neues Rekordhoch von rund 26.570 Punkten, während die technologielastige Nasdaq nachgab.',
        'Als Grund für die schwächere Nasdaq nannten Agenturmeldungen Signale für eine mögliche US-Zinserhöhung, die besonders Technologiewerte belasteten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, wie dieselbe Notenbank-Rede unterschiedlich zusammengesetzte Indizes in entgegengesetzte Richtungen bewegen kann – wichtig für alle, die international gestreut investieren.',
      relatedTopics: ['notenbanken-geldpolitik', 'aktie'],
      relatedSymbols: ['dax', 'nasdaq-100'],
      sources: [
        {
          label:
            'onvista, Nachricht vom 28.8.2026, 16:01 Uhr (dpa-AFX): „ROUNDUP/Aktien Frankfurt Schluss: Fed-Chef Warsh hievt Dax auf weitere Bestmarke“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Gold- und Silberrally bricht nach Warsh-Rede ab',
      summary: [
        'Der Goldpreis war im August laut Goldreporter.de zeitweise um 15 Prozent gestiegen, brach aber am Freitag nach der Rede von Fed-Chef Kevin Warsh scharf ein.',
        'Silber geriet laut wallstreet-online noch stärker unter Druck; beide Metalle notierten zum Redaktionsschluss wieder etwas fester als am Freitag.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Verdeutlicht, wie stark der Goldpreis an Zinserwartungen hängt, obwohl sich am tatsächlichen Leitzins bislang nichts geändert hat.',
      relatedTopics: ['notenbanken-geldpolitik', 'rohstoffe'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label:
            'goldreporter.de, Analyse vom 29.8.2026: „Spekulative Exzesse am Goldmarkt vor dem Freitags-Einbruch“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Ölpreis fällt trotz Eskalation an der Straße von Hormus',
      summary: [
        'Trotz neuer Tankerangriffe in der Straße von Hormus und eines US-Militärschlags gegen iranische Raketenwerfer gab der Brent-Ölpreis in der Nacht zum Montag um 0,91 Prozent nach.',
        'Warum der Preis trotz der Eskalation fiel, benennen die gelesenen Quellen nicht ausdrücklich; als möglicher Faktor werden zusätzlich gesicherte US-Ölvorkommen in Venezuela genannt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Macht sichtbar, dass ein geopolitisches Risiko nicht automatisch zu höheren Ölpreisen führt, wenn andere Faktoren stärker wirken.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'wallstreet-online, Nachricht vom 30.8.2026 (dpa-AFX): „ROUNDUP/US-Medien: US-Militär greift iranische Raketenwerfer an“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Inflationstag in Deutschland: Länder legen vor, der Bund folgt',
      summary: [
        'Vier Bundesländer melden heute um 10 Uhr ihre vorläufigen Verbraucherpreise für August; im Vormonat lagen die Werte zwischen 0,7 und 0,9 Prozent gegenüber dem Vormonat.',
        'Für 14 Uhr nennt der Wirtschaftskalender zusätzlich eine EU-harmonisierte Jahresteuerung mit einer Prognose von 3,0 Prozent nach zuvor 2,8 Prozent.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Die Verbraucherpreise gehören zu den Zahlen, an denen sich die EZB bei ihrer Zinsentscheidung orientiert – wichtig für alle, die Zinsentwicklungen einschätzen wollen.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'wallstreet-online, Wirtschaftskalender „Kommende Termine“, Abruf 31.8.2026, 00:14 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Über 7 Prozent Rendite: Warum diese Aktie im S&P 500 auffällt',
      summary: [
        'VICI Properties bietet laut wallstreet-online eine Dividendenrendite von über 7 Prozent, Erhöhungen seit dem Börsengang und Mietverträge bis zum Jahr 2100.',
        'Als Reit ist das Unternehmen gesetzlich verpflichtet, den Großteil seiner Gewinne auszuschütten – das erklärt tendenziell hohe Renditen in diesem Aktiensegment.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt am Beispiel eines Reit, dass eine hohe Dividendenrendite allein noch nichts über die Qualität eines Investments aussagt.',
      relatedTopics: ['risiko-und-rendite', 'portfolio-aufbau'],
      relatedSymbols: ['sp500', 'realty-income'],
      sources: [
        {
          label:
            'wallstreet-online, Dividenden-Radar vom 30.8.2026: „Vici bietet die höchste Rendite im S&P 500, doch kaum jemand kennt die Aktie“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
