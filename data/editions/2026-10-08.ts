import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-08.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-08 00:16 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-08',
  intro:
    'Notenbanker sprechen, Frankreichs Anleihemarkt wackelt, Öl bleibt teuer: ein dicht getakteter Donnerstag für die Märkte.',
  top: [
    {
      headline: 'Fed, EZB und Bank of England: Vier Notenbanker sprechen heute',
      summary: [
        'Um 8 Uhr veröffentlicht das Statistische Bundesamt die deutsche Handelsbilanz. Volkswirte erwarten einen Überschuss von 19,0 Milliarden Euro, nach 21,3 Milliarden Euro im Vormonat.',
        'Um 10 Uhr tagt die Eurogruppe. Um 10:30 Uhr spricht Fed-Gouverneur Christopher Waller. Um 11:15 Uhr folgt Bank-of-England-Direktorin Megan Greene, um 12 Uhr EZB-Chefvolkswirt Philip Lane.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Notenbank-Reden gelten als Fingerzeig für den nächsten Zinsschritt und bewegen deshalb Anleiherenditen und Wechselkurse, auch ohne formale Entscheidung.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax', 'eur-usd'],
      sources: [
        {
          label: 'wallstreet-online, Wirtschaftskalender, Stand 08.10.2026, 00:16 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Öl bleibt über 100 Dollar – trotz Rekord-Tankerverkehr durch Hormus',
      summary: [
        'Brent-Rohöl notiert bei 100,96 Dollar je Fass. Am Mittwoch meldete dpa-AFX drei Tote in Saudi-Arabien nach Angriffen auf Flughäfen, Hintergründe dazu nannte die Agentur nicht.',
        'Die Durchfahrten von LNG-Tankern durch die Straße von Hormus liegen laut Société Générale auf dem höchsten Stand seit Kriegsbeginn. Die Ölexporte aus der Golfregion übertreffen demnach das Niveau vor dem Krieg.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Diskrepanz zwischen Blockade-Schlagzeilen und den tatsächlichen Tankerbewegungen zeigt, wie stark Ölpreise auch von eingepreister Angst statt von realen Lieferausfällen getrieben werden.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'wallstreet-online, Nachrichtenübersicht vom 07.10.2026, Stand 08.10.2026 00:16 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Euro auf 17-Monats-Tief – Frankreichs Anleihemarkt unter Druck',
      summary: [
        'Der Euro fiel in den vergangenen Tagen auf ein 17-Monats-Tief. Dpa-AFX meldete eine Verschärfung der Lage am französischen Anleihemarkt. Die EZB setzte ihren Referenzkurs auf 1,1177 Dollar.',
        'Der Finanzdienst Markt Bote notierte am Mittwochnachmittag ein Tagesminus von 0,84 Prozent auf 1,11658 Dollar. Kurz nach Mitternacht stand das Paar bei 1,11960 Dollar, nur noch 0,02 Prozent im Minus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Risikoaufschläge für französische Staatsanleihen gelten als Test für den Zusammenhalt der Eurozone und wirken über den Wechselkurs auch auf Importpreise und Exporteure.',
      relatedTopics: ['waehrungen-wechselkurse', 'staatsanleihe'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'wallstreet-online, Devisennachrichten vom 07.10.2026, Stand 08.10.2026 00:16 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Dax und Wall Street schließen schwächer – Renditen und Ölpreis belasten',
      summary: [
        'Der Dax schloss nach Angaben von dpa-AFX deutlich im Minus, zuletzt bei 25.119,18 Punkten, ein Tagesverlust von 0,90 Prozent. Der breiter gefasste HDAX fiel um 1,36 Prozent auf 13.262,49 Punkte.',
        'An der Wall Street gab der Dow Jones 0,70 Prozent nach auf 51.173,29 Punkte, der Nasdaq 100 verlor 0,23 Prozent auf 31.164,65 Punkte. Dpa-AFX nannte steigende Anleiherenditen und hohe Ölpreise als Belastung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Anleiherenditen verteuern Kredite und senken über die Abzinsung künftiger Gewinne rechnerisch den fairen Wert von Aktien – ein Mechanismus, der ganze Indizes gleichzeitig bewegt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['dax', 'dow-jones'],
      sources: [
        {
          label: 'onvista, Nachrichtenübersicht vom 07.10.2026, 16:07 Uhr (dpa-AFX)',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Fresenius Medical Care: Shervin J. Korangy folgt auf Helen Giza',
      summary: [
        'Fresenius Medical Care hat per Ad-hoc-Mitteilung einen Wechsel an der Vorstandsspitze bekanntgegeben. Shervin J. Korangy übernimmt von Helen Giza, einen Grund nennt die Mitteilung nicht.',
        'Am selben Tag bestätigte JPMorgan laut dpa-AFX die Einstufung „Underweight“ für die Aktie, mit einem Kursziel von 32,30 Euro.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein überraschender Chefwechsel ohne genannten Grund gilt als Unsicherheitsfaktor, den Anleger bis zur nächsten Quartalsmitteilung erst einordnen müssen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['fresenius-medical'],
      sources: [
        {
          label: 'wallstreet-online, EQS-Adhoc vom 07.10.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Gold hält sich knapp, Silber verliert deutlich mehr',
      summary: [
        'Gold notierte zuletzt bei 4.108,75 Dollar je Feinunze, ein Minus von 0,06 Prozent. Silber gab 1,92 Prozent nach auf 60,20 Dollar.',
        'Laut Goldreporter steht der Goldpreis an einer wichtigen Schwelle bei 4.100 Dollar. Hält die Marke nicht, rückt das Tief vom Juli bei rund 4.000 Dollar in den Blick.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Die unterschiedliche Tagesbewegung erinnert daran, dass Silber über seine industrielle Nachfrage einen zweiten Preistreiber hat, den Gold in dieser Form nicht kennt.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label: 'goldreporter.de, Marktbericht vom 07.10.2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
  ],
}
