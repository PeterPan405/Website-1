import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-04.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-04 00:14 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-04',
  intro:
    'Die Bundesbank hält eine EZB-Zinserhöhung im Dezember für wahrscheinlich, Schaeffler streicht Tausende Stellen, und BASF wirbt weiter um Evonik.',
  top: [
    {
      headline:
        'Bundesbank-Präsident Nagel hält EZB-Zinserhöhung im Dezember für wahrscheinlich',
      summary: [
        'Bundesbankpräsident Joachim Nagel hält eine EZB-Zinserhöhung im Dezember für wahrscheinlich. Ohne eine deutliche Verbesserung des Inflationsausblicks führe kaum ein Weg daran vorbei, sagte er am Dienstagabend in Berlin.',
        'Die Inflation bleibt hoch. Sie lag im Euroraum im September bei 3,8 Prozent, dem höchsten Stand seit drei Jahren. Der Einlagensatz der EZB liegt seit der vergangenen Sitzung unverändert bei 2,5 Prozent.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein höherer Leitzins verteuert Kredite und macht festverzinsliche Anlagen wie Tagesgeld im Vergleich zu Aktien wieder attraktiver.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'Handelsblatt, 03.11.2026, 19:23 Uhr: „Geldpolitik: Bundesbankpräsident Nagel: EZB-Zinserhöhung im Dezember wahrscheinlich"',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/geldpolitik-nagel-zinserhoehung-im-dezember-wahrscheinlich/100267104.html',
        },
        {
          label:
            'trading-treff.de, 08.10.2026, 13:27 Uhr: „EZB steuert wegen hoher Teuerung auf Zinserhöhung im Dezember zu"',
          url: 'https://trading-treff.de/wirtschaft/ezb-steuert-wegen-hoher-teuerung-auf-zinserhoehung-im-dezember-zu',
        },
      ],
    },
    {
      headline: 'Schaeffler streicht 3.460 Stellen – vier Werke vor dem Aus',
      summary: [
        'Der Autozulieferer Schaeffler streicht 3.460 Stellen in Europa. Davon entfallen 2.660 Stellen auf Deutschland. Vier deutsche Werke sollen schließen: Dortmund, Berlin, Morbach und Schwalbach.',
        'Als Grund nennt der Vorstand die Krise der europäischen Autoindustrie. Hinzu kommen hohe Kosten. Der Umsatz sank in den ersten neun Monaten leicht auf 17,5 Milliarden Euro. Der Nettogewinn lag bei nur elf Millionen Euro.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Umsatz in Milliardenhöhe sagt nichts über die tatsächliche Ertragskraft aus, wenn am Ende nur ein winziger Gewinn übrig bleibt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Handelsblatt, 03.11.2026, 14:38 Uhr: „Krise der Autoindustrie: Schaeffler streicht Tausende Jobs und schließt Werke"',
          url: 'https://www.handelsblatt.com/politik/deutschland/krise-der-autoindustrie-schaeffler-streicht-tausende-jobs-und-schliesst-werke/100266863.html',
        },
        {
          label:
            'tagesschau.de, 03.11.2026, 10:02 Uhr: „Kahlschlag bei Schaeffler: Stellenabbau und Standortschließungen"',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/schaeffler-154.html',
        },
      ],
    },
    {
      headline: 'EU genehmigt Übernahme von MediaMarkt und Saturn durch JD.com',
      summary: [
        'Die EU-Kommission erlaubt die MediaMarkt-Übernahme durch JD.com. Der chinesische Online-Händler darf MediaMarkt und Saturn übernehmen – allerdings nur mit Auflagen für zehn Jahre.',
        'Die Kommission befürchtete Wettbewerbsvorteile durch chinesische Staatssubventionen. JD.com muss seine Logistik und Technik deshalb anderen Händlern zu denselben Bedingungen anbieten wie der eigenen Tochter. Der Konzern hält 59,8 Prozent der Anteile. Über eine Stimmbindung mit der Gründerfamilie kommt er aber auf mehr als 85 Prozent der Stimmrechte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wer die Mehrheit der Stimmrechte hält, kontrolliert ein Unternehmen oft stärker, als der eigene Kapitalanteil vermuten lässt.',
      relatedTopics: ['aktie', 'aktien-laender-branchen'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'ZDFheute, 03.11.2026, 13:08 Uhr: „Mediamarkt-Saturn: Brüssel genehmigt chinesische Übernahme"',
          url: 'https://www.zdfheute.de/wirtschaft/mediamarkt-saturn-china-eu-uebernahme-100.html',
        },
        {
          label:
            'tagesschau.de, 03.11.2026, 14:25 Uhr: „EU genehmigt MediaMarktSaturn-Übernahme durch JD.com"',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/eu-mediamarkt-saturn-jd-genehmigung-100.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'BASF und Evonik: Größte Fusion der Chemiebranche weiter offen',
      summary: [
        'BASF wirbt weiter um den Chemiekonzern Evonik. Noch sträubt sich Evonik gegen eine Fusion, die den größten Zusammenschluss der deutschen Chemiebranche bedeuten würde.',
        'Zusammen kämen beide auf rund 74 Milliarden Euro Umsatz. Zuletzt bot BASF nach Angaben von dpa-AFX rund 11 Milliarden Euro oder 24 Euro je Aktie. Evonik hält das weiterhin für zu niedrig.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein zurückgewiesenes Angebot zeigt, dass ein Unternehmenspreis kein fester Wert ist, sondern Verhandlungssache zwischen Vorstand und Großaktionären.',
      relatedTopics: ['aktie', 'aktien-laender-branchen'],
      relatedSymbols: ['basf'],
      sources: [
        {
          label:
            'tagesschau.de, 03.11.2026, 15:59 Uhr: „Evonik wehrt sich gegen Chemieriese BASF"',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/evonik-basf-fusion-100.html',
        },
        {
          label:
            'Börse Online / dpa-AFX, 28.10.2026: „ROUNDUP 3: BASF drückt bei Evonik-Kauf aufs Gas – höheres Ergebnisziel für 2026"',
          url: 'https://www.boerse-online.de/dpa-afx/roundup-3-basf-drueckt-bei-evonik-kauf-aufs-gas-hoeheres-ergebnisziel-fuer-2026-561520.html',
        },
      ],
    },
    {
      headline: 'AMD: Data-Center-Geschäft treibt Gewinn und Aktie',
      summary: [
        'AMD hat die Erwartungen der Wall Street im dritten Quartal übertroffen. Der Umsatz stieg um 45 Prozent auf 13,4 Milliarden Dollar. Die Aktie legte nachbörslich rund 8 Prozent zu.',
        'Der Umsatz im Data-Center-Geschäft hat sich binnen eines Jahres fast verdoppelt. Er macht inzwischen 64 Prozent des Konzernumsatzes aus, während das Geschäft mit PC- und Gaming-Chips schrumpfte.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein kräftiges Umsatzplus kann zwei gegenläufige Geschäfte verdecken – hier ein wachsendes Rechenzentrumsgeschäft und ein schrumpfendes Consumer-Geschäft.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['amd'],
      sources: [
        {
          label:
            'CNBC, 03.11.2026, 23:04 Uhr: „AMD stock jumps 8% on earnings as data center revenue nearly doubles"',
          url: 'https://www.cnbc.com/2026/11/03/amd-amd-q3-earnings-report-2026-.html',
        },
        {
          label:
            'onvista / dpa-AFX, 03.11.2026, 21:39 Uhr: „KI-Boom heizt AMD-Wachstum weiter an - Aktie legt nachbörslich kräftig zu"',
          url: 'https://www.onvista.de/news/2026/11-03-ki-boom-heizt-amd-wachstum-weiter-an-aktie-legt-nachboerslich-kraeftig-zu-0-10-26572031',
        },
      ],
    },
  ],
}
