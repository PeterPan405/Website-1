import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-15.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-15 00:16 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-15',
  intro:
    'Die US-Inflation überrascht nach oben, KI-Infrastrukturwerte stürzen ab, und US-Banken fallen trotz starker Zahlen. Dazu Lufthansa und Chinas Exportboom.',
  top: [
    {
      headline: 'US-Inflation überrascht nach oben, Anleiherenditen ziehen an',
      summary: [
        'Die US-Verbraucherpreise sind im September um 3,7 Prozent gestiegen. Das ist mehr als erwartet, getrieben vor allem durch höhere Benzin- und Energiepreise im Zusammenhang mit dem Iran-Krieg.',
        'Die Anleiherenditen zogen sofort an. Der Nasdaq 100 schloss 1,97 Prozent schwächer, der Dow Jones gab 0,20 Prozent nach.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Höhere Zinsen verändern die Abzinsung künftiger Unternehmensgewinne und wirken sich deshalb stärker auf Wachstumsaktien aus als auf etablierte Werte.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik', 'staatsanleihe'],
      relatedSymbols: ['nasdaq-100', 'dow-jones'],
      sources: [
        {
          label:
            'Handelsblatt, 14.10.2026, 21:25 Uhr: „Inflation in den USA springt im September nach oben“',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/inflation-preise-in-den-usa-steigen-im-september-um-37-prozent/100261070.html',
        },
        {
          label:
            "CNBC, 14.10.2026, 16:56 Uhr: „Here's the inflation breakdown for September 2026“",
          url: 'https://www.cnbc.com/2026/10/14/cpi-inflation-breakdown-september-2026.html',
        },
      ],
    },
    {
      headline: 'CoreWeave und Dell führen Ausverkauf bei KI-Infrastrukturwerten an',
      summary: [
        'CoreWeave verliert an der Börse 15 Prozent. Die Rendite der Firmenanleihen kletterte in die Nähe von 15 Prozent – ein Zeichen, wie riskant Anleger die Rückzahlung einschätzen.',
        'Auch Dell traf es hart. Die Aktie brach um 11 Prozent ein. Die Bank Barclays hatte Dell, HPE und NetApp zuvor herabgestuft.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wenn ein Geschäftsmodell stark auf Fremdkapital setzt, reagiert der Kurs empfindlicher auf Zweifel am künftigen Zahlungsstrom als bei eigenkapitalfinanzierten Unternehmen.',
      relatedTopics: ['schulden-und-kredit', 'risiko-und-rendite', 'aktie'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'CNBC, 14.10.2026, 22:46 Uhr: „CoreWeave shares tumble as bond yields near 15%“',
          url: 'https://www.cnbc.com/2026/10/14/coreweave-stock-bond-yields-ai-debt.html',
        },
        {
          label: 'CNBC, 14.10.2026, 22:19 Uhr: „Dell stock plunges 11%“',
          url: 'https://www.cnbc.com/2026/10/14/dell-stock-barclays-enterprise-ai.html',
        },
      ],
    },
    {
      headline: 'US-Großbanken legen gute Zahlen vor – die Aktien fallen trotzdem',
      summary: [
        'Morgan Stanley meldete Rekord-Mittelzuflüsse im dritten Quartal. Die Bank blieb damit aber hinter Goldman Sachs zurück.',
        'Bank of America traf es schlechter. Die Aktie fiel nach einem verpassten Umsatzziel und einer regulatorischen Strafe. Trotz überwiegend starker Ergebnisse gaben am Mittwoch alle sechs großen US-Bankaktien nach.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Markt bewertet ein Quartalsergebnis gegen die vorher eingepreiste Erwartung, nicht gegen null – deshalb können selbst gute Zahlen den Kurs belasten.',
      relatedTopics: ['aktie', 'risiko-und-rendite', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['bank-of-america', 'goldman-sachs'],
      sources: [
        {
          label:
            'FAZ, 14.10.2026, 16:54 Uhr: „US-Banken: Morgan Stanley mit Rekordmittelzuflüssen“',
          url: 'https://www.faz.net/aktuell/finanzen/morgan-stanley-mit-rekordmittelzufluessen-aber-hinter-goldman-sachs-201317774.html',
        },
        {
          label:
            "CNBC, 15.10.2026, 00:48 Uhr: „Jim Cramer explains why even strong bank earnings couldn't save their stocks“",
          url: 'https://www.cnbc.com/2026/10/14/cramer-big-bank-earnings-stock-reaction.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Lufthansa gewinnt das Rennen um die portugiesische TAP',
      summary: [
        'Die Lufthansa gewinnt das Rennen um die TAP. Die Fluggesellschaft setzte sich gegen Air France-KLM durch. Portugal lässt sie nun beim Einstieg zum Zug kommen – der tatsächliche Einstieg dauert aber noch.',
        'Eine zweite, unabhängige Quelle dazu lag bislang nicht vor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Einstieg bei TAP würde das Streckennetz der Lufthansa Richtung Südamerika erweitern, sofern der angekündigte Deal tatsächlich abgeschlossen wird.',
      relatedTopics: ['aktie', 'boerse'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Tagesschau, 14.10.2026, 14:53 Uhr: „Portugal erlaubt Einstieg der Lufthansa bei staatlicher Airline TAP“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/uebernahme-tap-lufthansa-100.html',
        },
      ],
    },
    {
      headline: 'Chinas Exporte wachsen überraschend stark',
      summary: [
        'Chinas Exporte sind im September überraschend stark gestiegen. Der Handelsüberschuss der Volksrepublik könnte 2026 ein historisches Hoch erreichen. Vor allem Halbleiter und Autos trieben das Wachstum an.',
        'Genaue Prozentangaben zum September nennt die gelesene Quelle nicht. Eine zweite Bestätigung lag ebenfalls nicht vor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein wachsender Handelsüberschuss erhöht den Druck auf Handelspartner wie die EU und die USA, eigene Industrien stärker zu schützen.',
      relatedTopics: ['wie-funktioniert-der-markt', 'waehrungen-wechselkurse'],
      relatedSymbols: ['hang-seng'],
      sources: [
        {
          label:
            'Tagesschau, 14.10.2026, 12:24 Uhr: „Chinas Handelsüberschuss nähert sich der Billionen-Dollar-Marke“',
          url: 'https://www.tagesschau.de/wirtschaft/weltwirtschaft/china-handelsueberschuss-100.html',
        },
      ],
    },
  ],
}
