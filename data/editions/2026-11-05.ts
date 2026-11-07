import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-05.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-05 00:15 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-05',
  intro:
    'Die Demokraten gewinnen die US-Zwischenwahlen, die Börsen jubeln, die Inflation im Euroraum steigt auf 4,0 Prozent, und BMW kappt erneut die Prognose.',
  top: [
    {
      headline: 'US-Kongresswahl: Demokraten siegen, Börsen legen kräftig zu',
      summary: [
        'Die Demokraten haben die Kontrolle über beide Kammern des US-Kongresses übernommen. Nach ersten Auszählungen gewannen sie sieben Senatssitze, fast 30 Sitze im Repräsentantenhaus und fünf Gouverneursposten hinzu. Der Dow Jones schloss daraufhin drei Prozent höher bei 53.356 Punkten, der Dax stieg um 2,98 Prozent auf 26.614 Punkte.',
        'Nicht alle Aktien profitierten gleich. Amazon und Microsoft legten jeweils über sechs Prozent zu, während die Aktie des Rechenzentrumsbetreibers CoreWeave fiel. Investoren befürchten, die neue demokratische Mehrheit könnte den Ausbau von KI-Rechenzentren stärker regulieren – in mehreren US-Bundesstaaten lehnten Wähler entsprechende Bauvorhaben am Wahltag bereits ab.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein steigender Gesamtindex kann einzelne Branchen verdecken, die sich zur selben Zeit in die entgegengesetzte Richtung bewegen.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dow-jones', 'dax'],
      sources: [
        {
          label:
            'Handelsblatt, 04.11.2026, 20:27 Uhr: „US-Börsen: Dow Jones schließt drei Prozent höher"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-dow-jones-schliesst-drei-prozent-hoeher/100267318.html',
        },
        {
          label:
            'CNBC, 04.11.2026, 23:44 Uhr: „Democrats flip dozens of GOP seats. Republicans haven\'t flipped a single one"',
          url: 'https://www.cnbc.com/2026/11/04/democrats-2026-midterm-election-results.html',
        },
      ],
    },
    {
      headline: 'Eurozone: Inflation klettert im Oktober auf 4,0 Prozent',
      summary: [
        'Die Inflation im Euroraum ist im Oktober auf 4,0 Prozent gestiegen, den höchsten Stand seit September 2023. Das teilte die Statistikbehörde Eurostat in ihrer Schnellschätzung mit, nach 3,8 Prozent im September. Energie war mit einem Anstieg von 20,8 Prozent gegenüber dem Vorjahr erneut die stärkste Einzelkomponente.',
        'Erst am Dienstag hatte Bundesbank-Präsident Joachim Nagel eine Zinserhöhung der EZB im Dezember für wahrscheinlich gehalten – mit Blick auf genau diese Entwicklung. Der EZB-Rat entscheidet turnusgemäß am 17. Dezember über den Leitzins.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Eine Inflation, die vor allem von Energiepreisen getrieben wird, wirkt auf die Geldpolitik anders als eine breit verteilte Teuerung in vielen Bereichen.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'tagesschau.de, 04.11.2026, 12:12 Uhr: „Inflation im Euroraum steigt auf 4,0 Prozent"',
          url: 'https://www.tagesschau.de/wirtschaft/konjunktur/inflation-eurozone-oktober-102.html',
        },
        {
          label: 'Eurostat, 04.11.2026: „Annual inflation up to 4.0% in the euro area"',
          url: 'https://ec.europa.eu/eurostat/product?code=2-04112026-ap',
        },
      ],
    },
    {
      headline: 'EZB-Spitze: Niederlande nominieren Klaas Knot',
      summary: [
        'Die Niederlande haben den früheren Zentralbankchef Klaas Knot offiziell als Kandidaten für die EZB-Präsidentschaft nominiert. Finanzminister Eelco Heinen teilte das dem Parlament in Den Haag mit. Knot war von 2011 bis 2025 Präsident der niederländischen Notenbank.',
        'Der Posten wird frei, weil EZB-Chefin Christine Lagarde im Februar vorzeitig zurücktritt. Die Euro-Länder müssen ihre Kandidaten bis Freitag benennen. Neben Knot gilt der Spanier Pablo Hernández de Cos als Anwärter, auch Bundesbank-Chef Joachim Nagel hat Interesse bekundet.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Die EZB-Spitze bestimmt über Jahre die Richtung der Geldpolitik – wer sie führt, wirkt oft länger nach als ein einzelner Zinsschritt.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'tagesschau.de, 04.11.2026, 15:30 Uhr: „Neuer EZB-Chef: Niederlande nominieren Ex-Zentralbanker Knot"',
          url: 'https://www.tagesschau.de/wirtschaft/konjunktur/knot-nominierung-ezb-100.html',
        },
        {
          label:
            'WirtschaftsWoche / dpa, 04.11.2026, 12:20 Uhr: „Notenbank: Niederlande nominieren Ex-Zentralbanker Knot als EZB-Chef"',
          url: 'https://www.wiwo.de/unternehmen/notenbank-niederlande-nominieren-ex-zentralbanker-knot-als-ezb-chef/100267274.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'BMW: Gewinn bricht wegen China-Krise weiter ein',
      summary: [
        'BMW hat im dritten Quartal einen Nettogewinn von 1,5 Milliarden Euro erzielt, 15 Prozent weniger als vor einem Jahr. Der Umsatz sank um 6 Prozent auf 30,5 Milliarden Euro, die Marge im Autogeschäft fiel von 5,2 auf 3,4 Prozent.',
        'Grund ist vor allem China: Dort brachen die Verkäufe um 25 Prozent ein, während Europa und die USA zulegten. Hinzu kommen teure Abfindungen und das vorgezogene Ende älterer Modelle. BMW senkte deshalb seine Jahresprognose für Marge und Gewinn erneut.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Umsatzrückgang von sechs Prozent erklärt nicht, warum das operative Ergebnis um dreißig Prozent einbricht – das zeigt, wie stark hohe Fixkosten die Marge belasten können.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['bmw'],
      sources: [
        {
          label:
            'tagesschau.de, 04.11.2026, 09:21 Uhr: „BMW erwirtschaftet noch weniger Gewinn"',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/bmw-gewinnwarnung-100.html',
        },
        {
          label:
            'onvista / dpa-AFX, 04.11.2026, 15:53 Uhr: „BMW: Die schwache Prognose spricht für Vorsicht"',
          url: 'https://www.onvista.de/news/2026/11-04-bmw-die-schwache-prognose-spricht-fuer-vorsicht-40338625-19-26572453',
        },
      ],
    },
    {
      headline: 'Immobilienfonds-Krise: DWS begrenzt Rückgaben auf zehn Prozent',
      summary: [
        'Die Fondsgesellschaft DWS zahlt bei ihrem offenen Immobilienfonds Grundbesitz Europa fällige Rückgaben seit dem 28. Oktober nur noch zu zehn Prozent aus. Im September hatte der Fonds seinen Wert bereits um 7,3 Prozent gesenkt, binnen acht Monaten flossen netto mehr als 640 Millionen Euro ab.',
        'An der Börse notierten die Anteile Ende Oktober rund 47,5 bis 50 Prozent unter dem von DWS ausgewiesenen Rücknahmewert. Auch Deutschlands größter Vermieter Vonovia hat seine Jahresprognose gesenkt und verliert in Kürze seinen Finanzvorstand.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Der von einer Fondsgesellschaft errechnete Rücknahmewert und der Preis am Zweitmarkt können weit auseinanderliegen, wenn Anleger in großer Zahl verkaufen wollen.',
      relatedTopics: ['immobilien', 'fonds'],
      relatedSymbols: ['vonovia'],
      sources: [
        {
          label:
            'Handelsblatt, 04.11.2026, 15:49 Uhr: „Immobilien: Milliardenrisiko? Die Krise der Immobilienfonds spitzt sich zu"',
          url: 'https://www.handelsblatt.com/finanzen/immobilien/immobilien-milliardenrisiko-die-krise-der-immobilienfonds-spitzt-sich-zu/100265249.html',
        },
        {
          label:
            'cash-online.de, 30.10.2026, 12:15 Uhr: „Offener Immobilienfonds der DWS: Anleger erhalten nur zehn Prozent ihrer Rückgaben"',
          url: 'https://www.cash-online.de/a/offener-immobilienfonds-der-dws-anleger-erhalten-nur-zehn-prozent-ihrer-rueckgaben-729112/',
        },
      ],
    },
  ],
}
