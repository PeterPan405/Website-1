import type { DailyEdition } from './types'

/**
 * Ausgabe vom 28. Juli 2026.
 *
 * Ein Tag mit einem Thema, das um die Welt läuft: Ein Bericht über chinesische
 * Lithografieanlagen drückt ASML in Amsterdam, die Chipwerte in New York und
 * den Nikkei in Tokio. Daneben beginnt die Fed-Sitzung, deren eigentliche
 * Neuigkeit nicht der Zinsschritt ist, sondern die Richtung der Prognosen.
 */
export const edition: DailyEdition = {
  date: '2026-07-28',
  intro:
    'Ein Bericht über chinesische Chipanlagen drückt ASML und die Halbleiterwerte weltweit. Zugleich beginnt die Fed-Sitzung, deren Prognosen nach oben zeigen.',
  top: [
    {
      headline: 'Chinesische DUV-Anlagen kosten ASML zeitweise 8,5 Prozent',
      summary: [
        'Der Branchendienst The Information berichtete am Montag, ein staatlich gestütztes Unternehmen in Schanghai habe begonnen, selbst entwickelte Immersions-DUV-Lithografieanlagen zu bauen. Die ASML-Aktie fiel im Tagesverlauf um bis zu 8,5 Prozent und lag am Nachmittag rund 6,6 Prozent tiefer bei etwa 1.442 Euro – der tiefste Stand seit gut sieben Wochen.',
        'Geplant sind rund fünf Maschinen in diesem und etwa zwanzig im kommenden Jahr. ASML lieferte 2025 allein 131 Immersions-DUV-Anlagen aus, insgesamt 327 Lithografiesysteme bei 32,7 Milliarden Euro Umsatz.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Gehandelt wurden nicht fünf Maschinen, sondern die Frage, wie lange der Vorsprung hält. Bei hoch bewerteten Aktien besteht der Kurs überwiegend aus Zukunft – deshalb bewegen Nachrichten, die in keiner Quartalszahl auftauchen, ihn stärker als das laufende Geschäft.',
      relatedTopics: ['aktie', 'risiko-und-rendite', 'aktien-laender-branchen'],
      relatedSymbols: ['asml', 'nvidia', 'tsmc'],
      sources: [
        {
          label:
            'MarketScreener: China beginnt mit der Herstellung heimischer DUV-Lithografieanlagen',
          url: 'https://de.marketscreener.com/boerse-nachrichten/china-beginnt-mit-der-herstellung-heimischer-duv-lithografieanlagen-berichtet-the-information-ce7f51dcde89ff22',
        },
        {
          label: 'onvista: ASML fallen aus Sorge vor China-Konkurrenz (27.07.2026)',
          url: 'https://www.onvista.de/news/2026/07-27-aktie-im-fokus-asml-fallen-aus-sorge-vor-china-konkurrenz-chipsektor-folgt-0-10-26536524',
        },
      ],
    },
    {
      headline: 'Fed hebt ihre Inflationsprognose von 2,7 auf 3,6 Prozent an',
      summary: [
        'Der Offenmarktausschuss tagt Dienstag und Mittwoch, die Entscheidung kommt Mittwoch um 20:00 Uhr deutscher Zeit. Der Leitzins liegt seit Dezember 2025 bei 3,50 bis 3,75 Prozent, die Terminmärkte preisen mit knapp 78 Prozent eine weitere Pause ein.',
        'Bei der Juni-Sitzung blieb der Zins einstimmig unverändert – zugleich sagten neun der achtzehn Teilnehmer für 2026 eine Erhöhung voraus, der Hinweis auf eine Lockerung verschwand aus der Erklärung, und die PCE-Prognose stieg von 2,7 auf 3,6 Prozent.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Eine Pause auf dem Weg nach unten ist etwas anderes als eine Pause auf dem Weg nach oben – die Zahl ist gleich, die Richtung umgedreht. Wer heute Geld für mehrere Jahre festlegt, trifft damit eine Entscheidung, die vor einem halben Jahr noch selbstverständlich war.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation', 'tagesgeld'],
      relatedSymbols: ['eur-usd', 'sp500', 'gold'],
      sources: [
        {
          label: 'LBBW: Fed-Zinsentscheid – aktueller Leitzins und Prognose 2026',
          url: 'https://www.lbbw.de/artikel/maerkte-verstehen/fed-zinsentscheid-leitzins-prognosen_ait4a5bv66_d.html',
        },
        {
          label: 'Yahoo Finanzen: Neun Fed-Vertreter kündigen Zinserhöhung für 2026 an',
          url: 'https://de.finance.yahoo.com/nachrichten/warsh-warnt-neun-fed-vertreter-180221098.html',
        },
      ],
    },
    {
      headline: 'Der Abverkauf lief durch drei Zeitzonen',
      summary: [
        'Nach ASML in Amsterdam traf der Verkaufsdruck die US-Werte: Nvidia verlor mehr als fünf Prozent, Micron über 5,5 Prozent, SanDisk fast zwölf Prozent. Der Nasdaq Composite schloss 0,2 Prozent tiefer bei 24.932 Punkten, während der Dow Jones um 263 Punkte auf 52.210 stieg.',
        'In der Nacht setzte sich die Bewegung in Tokio fort: Als Grund für den schwachen Start des japanischen Marktes galten ausdrücklich die Verluste im Nasdaq und im Philadelphia-Halbleiterindex.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein niederländischer, ein amerikanischer und ein japanischer Wert fielen aus demselben Grund – nicht weil sie im selben Land sitzen, sondern weil sie in derselben Lieferkette stehen. Streuung über Länder hilft an solchen Tagen wenig; entscheidend ist die Branchengewichtung.',
      relatedTopics: ['portfolio-aufbau', 'etf', 'aktien-laender-branchen'],
      relatedSymbols: ['nvidia', 'micron', 'nikkei-225'],
      sources: [
        {
          label:
            'MarketScreener: Stock Market Today – Chip Stocks Fall, Dragging Down Nasdaq',
          url: 'https://www.marketscreener.com/news/stock-market-today-chip-stocks-fall-dragging-down-nasdaq-ce7f51dcd180f32c',
        },
        {
          label:
            'Proactive Investors: Dow closes higher as oil tumbles, Nasdaq slips with Nvidia leading chip selloff',
          url: 'https://www.proactiveinvestors.com/companies/news/1096070/dow-jones-and-nasdaq-make-solid-start-to-massive-week-as-oil-tumbles-1096070.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'DAX schließt bei 25.361 Punkten – 36 von 40 Werten im Plus',
      summary: [
        'Der deutsche Leitindex gewann am Montag ein Prozent und schloss auf dem höchsten Stand seit fast drei Wochen. Getragen wurde der Anstieg von der Waffenpause zwischen den USA und Iran und den daraufhin gefallenen Energiepreisen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass 36 der 40 Werte im Plus schlossen, sagt mehr als das Prozent selbst: Ein breiter Anstieg zeigt, dass sich die Lageeinschätzung verschoben hat, ein schmaler nur, dass ein paar Schwergewichte den Index optisch mitgezogen haben.',
      relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'euro-stoxx-50'],
      sources: [
        {
          label: 'Handelsblatt: Dax schließt auf höchstem Stand seit fast drei Wochen',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-schliesst-auf-hoechstem-stand-seit-fast-drei-wochen/100243054.html',
        },
      ],
    },
    {
      headline: 'Berichtswoche beginnt: Mercedes-Benz, Boeing, Visa',
      summary: [
        'An diesem Dienstag legen in Europa Mercedes-Benz, Barclays und Unilever Halbjahreszahlen vor, in den USA berichten Coca-Cola, Boeing, Visa und PayPal. Am Mittwoch folgt Microsoft, am Donnerstag nach US-Börsenschluss Apple und Amazon.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Kurs vor einer Veröffentlichung enthält bereits, was der Markt erwartet. Bewegt wird er deshalb nicht vom Ergebnis, sondern von der Abweichung – und vom Ausblick, der oft schwerer wiegt als die Zahlen selbst.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['mercedes-benz', 'coca-cola', 'visa'],
      sources: [
        {
          label: 'boersennews: Wochenvorschau KW 31 – rekorddichte Berichtswoche',
          url: 'https://www.boersennews.de/nachrichten/service/community/wochenvorschau-kw-31-rekorddichte-berichtswoche-apple-microsoft-meta-und-der-fed-entscheid/5220495/',
        },
      ],
    },
  ],
}
