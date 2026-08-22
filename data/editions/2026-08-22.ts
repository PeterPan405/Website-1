import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-22.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-22 01:55 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-22',
  intro:
    'Gold markiert neue Rekorde, VW-Chef Blume nennt die Lage mehr als kritisch, und Apple zeigt erstmals, was der Konzern in Deutschland wirklich an Steuern zahlt.',
  top: [
    {
      headline: 'Bundesanleihen so hoch verzinst wie seit 15 Jahren nicht mehr',
      summary: [
        'Die Rendite zehnjähriger Bundesanleihen erreichte Mitte August 3,22 Prozent – das höchste Niveau seit 2011, getrieben von höherer Staatsverschuldung über das 500-Milliarden-Euro-Sondervermögen und steigender Inflation im Zuge des Iran-Konflikts.',
        'Das verteuert Baufinanzierungen, verschafft Sparern und Anleihekäufern aber zugleich die besten Zinsen seit langem.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Zeigt, wie ein und dieselbe Zinsbewegung für Kreditnehmer ein Nachteil und für Sparer gleichzeitig ein Vorteil sein kann.',
      relatedTopics: ['staatsanleihe', 'immobilien'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'finanzmarktwelt.de, 17.8.2026: „Deutsche Anleiherenditen mit 15-Jahreshoch – zwei Hauptfaktoren“',
          url: 'https://finanzmarktwelt.de/deutsche-anleiherenditen-mit-15-jahreshoch-zwei-hauptfaktoren-398947/',
        },
      ],
    },
    {
      headline: 'Apple zeigt zum ersten Mal, was der Konzern in Deutschland zahlt',
      summary: [
        'Apple veröffentlicht erstmals Land-für-Land-Steuerzahlen: 153,5 Millionen Dollar Ertragsteuern in Deutschland, aber 17,08 Milliarden Dollar in Irland – letzteres laut Bericht wegen der Auflösung eines Treuhandkontos nach dem EuGH-Urteil von 2024.',
        'Möglich macht die Offenlegung eine neue EU-Pflicht zum Public Country-by-Country Reporting für Konzerne mit über 750 Millionen Euro Umsatz.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Zeigt, wie eine neue EU-Transparenzpflicht globale Konzerne länderweise vergleichbar macht – und wie leicht ein Sondereffekt einen Vergleich verzerrt.',
      relatedTopics: ['aktie', 'aktien-laender-branchen'],
      relatedSymbols: ['apple'],
      sources: [
        {
          label:
            'leinetal24.de, dpa-Meldung, 22.8.2026, 03:01 Uhr: „Apple beziffert Steuerzahlungen in Deutschland und Europa“',
          url: 'https://www.leinetal24.de/leben/apple-beziffert-steuerzahlungen-in-deutschland-und-europa-zr-94454964.html',
        },
      ],
    },
    {
      headline:
        'Dow und DAX schließen die Woche im Plus – die neue Woche bringt BIP und ifo',
      summary: [
        'Der DAX beendet seine Verlustserie über 26.000 Punkten, der Dow klettert laut wallstreet-online dank Goldman Sachs und Merck – Öl, Gold und Bitcoin legen zum Teil kräftig zu.',
        'Für den 25.8. kündigt der Wirtschaftskalender das deutsche BIP (Prognose 0,2 Prozent) und den ifo-Geschäftsklimaindex (Prognose 87,2 Punkte) an, jeweils ohne genannte Uhrzeit.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ordnet einen guten Wochenschluss an den Börsen und zwei anstehende Konjunkturzahlen so ein, dass klar wird, welche davon Stimmung und welche tatsächliche Wirtschaftsleistung misst.',
      relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'dow-jones'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker, 21.8.2026, 16:06 Uhr, dpa-AFX: „ROUNDUP/Aktien Frankfurt Schluss: Verlustserie beendet - Dax über 26.000 Punkten“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'VW-Chef Blume nennt die Lage bei Volkswagen mehr als kritisch',
      summary: [
        'Blume spricht vor Betriebsversammlungen von einer mehr als kritischen Lage und verweist auf eine operative Rendite von 3,8 Prozent, die für neue Technologien nicht ausreiche.',
        'In der Berichterstattung kursieren bis zu 50.000 möglicherweise betroffene Stellen an vier Standorten – Blume nennt diese Zahl aber ausdrücklich keine fixe Zielgröße, eine Werksschließung ist laut Meldung nicht beschlossen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt den Unterschied zwischen einer dramatischen Formulierung und einer tatsächlich getroffenen unternehmerischen Entscheidung.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label:
            "onvista, ROUNDUP, dpa-AFX, 21.8.2026, 15:44 Uhr: „VW-Chef Blume: 'Die Lage ist mehr als kritisch'“",
          url: 'https://www.onvista.de/news/2026/08-21-roundup-vw-chef-blume-die-lage-ist-mehr-als-kritisch-0-10-26545350',
        },
      ],
    },
    {
      headline: 'PSI Software senkt die Prognose für 2026 deutlich',
      summary: [
        'PSI erwartet jetzt nur noch 5 statt 10 Prozent Umsatzwachstum und eine EBIT-Marge von rund 2 statt 4 Prozent, vor allem wegen eines 15-prozentigen Umsatzrückgangs im Segment Process Industries & Metals.',
        'Andere Segmente wie Discrete Manufacturing und Logistics sollen ihre Jahresziele laut Unternehmen trotzdem erreichen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein anschauliches Beispiel dafür, dass eine konzernweite Gewinnwarnung oft aus einem einzelnen, besonders betroffenen Segment stammt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'TradingView News, EQS-Adhoc-Meldung, 21.8.2026: „PSI Adjusts Its Forecast for Fiscal Year 2026 in Light of Economic Uncertainties in Europe“',
          url: 'https://www.tradingview.com/news/eqs:a6601bafd094b:0-psi-adjusts-its-forecast-for-fiscal-year-2026-in-light-of-economic-uncertainties-in-europe/',
        },
      ],
    },
    {
      headline: 'TikTok zahlt 400 Millionen Dollar – die Ermittlungen enden',
      summary: [
        'TikTok einigt sich mit der US-Justiz auf 400 Millionen Dollar wegen Kinderkonten ohne Elternzustimmung – 300 Millionen sofort, 100 Millionen nach Aufhebung einer älteren Verfügung gegen die Vorgängerfirma Musical.ly.',
        'Das Justizministerium betont ausdrücklich, dass die Zahlung kein Schuldeingeständnis ist.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Erklärt den rechtlichen Unterschied zwischen einem Vergleich und einem Urteil an einem konkreten, beziffertem Fall.',
      relatedTopics: ['aktie'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, 21.8.2026: „Video-App: 400-Millionen-Zahlung – US-Justiz stoppt TikTok-Ermittlungen“',
          url: 'https://www.handelsblatt.com/technik/it-internet/video-app-400millionen-zahlung-us-justiz-stoppt-tiktok-ermittlungen/100248949.html',
        },
      ],
    },
    {
      headline: 'Broadcom leiht bis zu 100 Milliarden für die KI-Wette – Goldman warnt',
      summary: [
        'Broadcom verhandelt bis zu 100 Milliarden Dollar Fremdkapital, teils besichert, mit Blackstone und Apollo, um Anthropics Rechenkapazität massiv auszubauen.',
        'Goldman Sachs beziffert die US-KI-Investitionen 2026 auf rund 600 Milliarden Dollar und schätzt den Verdrängungseffekt auf andere Investitionen auf etwa 50 Milliarden Dollar – insgesamt kleiner als oft angenommen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Stellt einen einzelnen, stark fremdfinanzierten KI-Deal neben eine bankweite Einschätzung der gesamtwirtschaftlichen Wirkung des KI-Booms.',
      relatedTopics: ['aktie', 'schulden-und-kredit'],
      relatedSymbols: ['broadcom', 'goldman-sachs'],
      sources: [
        {
          label:
            'Benzinga, 21.8.2026: „Broadcom Steps Up Nvidia Challenge With Potential $100 Billion AI Financing Deal“',
          url: 'https://www.benzinga.com/markets/tech/26/08/61350252/broadcom-steps-up-nvidia-challenge-with-potential-100-billion-ai-financing-deal',
        },
      ],
    },
    {
      headline: 'Gold klettert weiter: zwölf Prozent plus allein im August',
      summary: [
        'Der Goldpreis stieg am Freitag laut Goldreporter auf 4.556 Dollar und liegt im August bereits rund 12 Prozent im Plus, eine Ticker-Anzeige von finanzen.net zeigt am Samstagmorgen sogar 4.608 Dollar.',
        'Keine der beiden Quellen nennt einen konkreten Grund für die aktuelle Bewegung.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Erinnert daran, dass ein Rekordkurs allein noch keine Erklärung liefert und eine so kräftige Monatsbewegung ungewöhnlich groß ist.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'Goldreporter, Marktberichte, Wochenschluss vom 21.8.2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
  ],
}
