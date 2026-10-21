import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-21.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-21 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-21',
  intro:
    'Frankreich rüstet sich mit Soldaten gegen neue Proteste, Japans Exporte schwächeln, Haushalte sind so vermögend wie nie, Netflix fällt trotz Gewinn.',
  top: [
    {
      headline: 'Frankreichs Regierung schickt Soldaten gegen neue Proteste',
      summary: [
        'Frankreichs Regierung bereitet sich auf neue Proteste vor. Innenminister Laurent Nuñez kündigte für den kommenden Samstag den Einsatz von Sentinelle-Soldaten an, berichtet CNBC. Im ganzen Land und in mehreren anderen europäischen Staaten hatte es zuvor Proteste gegen hohe Lebenshaltungskosten, schlechte Schulbedingungen und die Wohnungskrise gegeben.',
        'Spekulanten setzen zugleich auf Frankreichs nächste Wahl. An der Wettplattform Kalshi stiegen laut CNBC die Kurse auf einen Sieg von Marine Le Pen bei der Präsidentschaftswahl 2027. Solche Plattformen sind keine Wahlumfragen, sondern Wettmärkte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Wettquoten gegen eine Regierung sind kein Beweis für einen Wahlausgang, zeigen aber, wie Marktteilnehmer politisches Risiko einpreisen – ähnlich wie es sonst Zinsaufschläge auf Staatsanleihen tun.',
      relatedTopics: ['staatsanleihe'],
      relatedSymbols: ['cac-40', 'eur-usd'],
      sources: [
        {
          label:
            'CNBC, 20.10.2026, 17:01 Uhr MESZ: „France to deploy military as it braces for fresh unrest this weekend“',
          url: 'https://www.cnbc.com/2026/10/20/france-protests-curfews-macron-gulf-trip.html',
        },
        {
          label:
            'CNBC, 20.10.2026, 22:34 Uhr MESZ: „Prediction-market odds rise for Marine Le Pen in France 2027 presidential race as protests roil nation“',
          url: 'https://www.cnbc.com/2026/10/20/marine-le-pen-france-2027-election-odds-kalshi.html',
        },
      ],
    },
    {
      headline: 'Japans Exporte verfehlen im September deutlich die Erwartungen',
      summary: [
        'Japans Exportwirtschaft kühlt sich ab. Die Ausfuhren legten im September im Jahresvergleich nur um 16,7 Prozent zu und blieben damit deutlich unter den Erwartungen, berichtet CNBC.',
        'Auch die Einfuhren schwächten sich ab. Sie wuchsen um 18,9 Prozent und verfehlten damit die von Reuters befragten Ökonomen, die im Schnitt 19,6 Prozent erwartet hatten, so CNBC. Im Vormonat hatte das Importwachstum noch bei 28 Prozent gelegen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Schwächere Außenhandelsdaten können die japanische Notenbank in ihrer Zinspolitik beeinflussen, und über den Yen-Kurs wirkt das auch auf den Welthandel mit Elektronik und Halbleitern zurück.',
      relatedTopics: ['aktien-laender-branchen', 'waehrungen-wechselkurse'],
      relatedSymbols: ['nikkei-225', 'eur-jpy'],
      sources: [
        {
          label:
            'CNBC, 21.10.2026, 02:12 Uhr MESZ: „Japan exports post huge miss in September as growth slows to 16.7%“',
          url: 'https://www.cnbc.com/2026/10/21/japan-trade-exports-semiconductor-yen.html',
        },
      ],
    },
    {
      headline: 'Geldvermögen deutscher Haushalte steigt auf einen neuen Höchststand',
      summary: [
        'Das Geldvermögen deutscher Haushalte hat einen neuen Höchststand erreicht. Es stieg im zweiten Quartal 2026 auf 9.831 Milliarden Euro, teilte die Bundesbank mit. Das waren 335 Milliarden Euro mehr als im Quartal zuvor.',
        'Der größte Teil davon war aber kein frisches Geld. Laut Bundesbank gingen 258 der 335 Milliarden Euro auf Kursgewinne an den Finanzmärkten zurück, nicht auf neues Sparen oder neue Einlagen. Die Finanzmärkte hatten sich im zweiten Quartal nach Unsicherheiten im ersten Quartal deutlich erholt, so die Notenbank.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Steigt Geldvermögen vor allem durch Kursgewinne, handelt es sich um Bewertungseffekte auf dem Papier, die sich bei fallenden Kursen ebenso schnell umkehren können wie tatsächlich gesparte Beträge das nicht tun.',
      relatedTopics: ['budget-und-sparquote', 'risiko-und-rendite'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Deutsche Bundesbank, Pressemitteilung vom 20.10.2026: „Geldvermögensbildung und Außenfinanzierung in Deutschland im zweiten Quartal 2026“',
          url: 'https://www.bundesbank.de/de/presse/pressemitteilungen/geldvermoegensbildung-und-aussenfinanzierung-in-deutschland-im-zweiten-quartal-2026-1012260',
        },
      ],
    },
    {
      headline: 'Netflix übertrifft die Gewinnerwartungen, die Aktie fällt trotzdem',
      summary: [
        'Netflix hat die Erwartungen beim Gewinn übertroffen. Trotzdem fiel die Aktie nach Vorlage der Quartalszahlen am Dienstag, meldet die Nachrichtenagentur dpa-AFX. Das Streaming-Geschäft wachse langsamer als zuvor, berichtet dpa-AFX weiter.',
        'Grund für den Kursrückgang war der Ausblick, nicht das abgelaufene Quartal. Netflix stellte für das Werbegeschäft und den Umsatz einen schwächeren Verlauf in Aussicht, berichtet CNBC. Optionshändler hatten im Vorfeld einen Kurssprung von rund 9 Prozent eingepreist. Das war laut CNBC der höchste Wert seit dem dritten Quartal 2022, als Händler mit 11 Prozent gerechnet hatten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Gewinn über den Erwartungen bedeutet nicht automatisch einen steigenden Kurs: Entscheidend ist oft der Ausblick, den ein Unternehmen für die kommenden Monate gibt, nicht nur das bereits abgelaufene Quartal.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['netflix', 'nasdaq-100'],
      sources: [
        {
          label:
            'CNBC, 21.10.2026, 00:29 Uhr MESZ: „Netflix posts third-quarter earnings beat, but shares fall on advertising and revenue guidance“',
          url: 'https://www.cnbc.com/2026/10/20/netflix-nflx-earnings-q3-2026.html',
        },
        {
          label:
            "CNBC, 20.10.2026, 20:10 Uhr MESZ: „Traders are betting Netflix's stock drama may be coming to an end“",
          url: 'https://www.cnbc.com/2026/10/20/traders-are-betting-netflixs-stock-drama-may-be-coming-to-an-end.html',
        },
        {
          label:
            'onvista, Aktuelle News, 20.10.2026, 21:10 Uhr, dpa-AFX: „Netflix wächst langsamer - Aktie fällt“',
          url: 'https://www.onvista.de/news/2026/10-20-netflix-waechst-langsamer-aktie-faellt-0-10-26566325',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Google-Ausfall legt Online-Banking von ING und Revolut lahm',
      summary: [
        'Ein Ausfall bei Google hat am Dienstag Banken getroffen. Kunden der Digitalbanken ING und Revolut konnten laut Handelsblatt stundenlang nicht auf ihre Konten zugreifen. Betroffen waren auch mehrere britische Institute, meldet die Zeitung.',
        'Die Störung reichte über das Bankgeschäft hinaus. Auch Webseiten und Dienste anderer Unternehmen kämpften mit Ausfällen, berichten Handelsblatt und FAZ übereinstimmend. Ursache und Ausmaß des Google-Ausfalls waren zum Zeitpunkt der Berichte noch nicht geklärt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Viele Banken und Unternehmen hängen für ihre digitale Infrastruktur an wenigen großen Cloud-Anbietern wie Google, Amazon oder Microsoft – fällt einer aus, trifft das gleichzeitig viele unabhängige Dienste.',
      relatedTopics: ['depot-und-broker'],
      relatedSymbols: ['alphabet'],
      sources: [
        {
          label:
            'Handelsblatt, 20.10.2026, 15:14 Uhr MESZ: „Digitalbanken: Massive Störungen im Online-Banking von ING und Revolut – Auch britische Banken betroffen“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/banken-massive-stoerungen-im-online-banking-von-ing-und-revolut/100263510.html',
        },
        {
          label:
            'FAZ, 20.10.2026, 15:00 Uhr MESZ: „ING und Revolut: IT-Störungen nerven Bankkunden“',
          url: 'https://www.faz.net/aktuell/finanzen/google-cloud-ausfall-trifft-revolut-und-ing-in-europa-accg-201605159.html',
        },
      ],
    },
  ],
}
