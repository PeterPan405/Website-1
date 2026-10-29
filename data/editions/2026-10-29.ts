import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-29.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-29 00:10 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-29',
  intro:
    'Die Fed pausiert bei den Zinsen, die EZB entscheidet heute. Microsoft und die Deutsche Bank überzeugen, Alphabet und Israels Wahl schicken Kurse auf Talfahrt.',
  top: [
    {
      headline: 'Fed lässt den Leitzins unverändert – zwei Notenbanker wollten mehr',
      summary: [
        'Die Fed lässt den Leitzins unverändert. Er bleibt bei 3,75 bis 4,0 Prozent. Zwei Mitglieder stimmten dagegen und wollten ihn anheben: Gouverneurin Lisa Cook und die Chefin der Cleveland Fed, Beth Hammack.',
        'Fed-Chef Kevin Warsh erläuterte die Entscheidung am Nachmittag vor Journalisten. Als Risiken nannte die Fed hohe Energiekosten und einen möglichen neuen Iran-Konflikt. Für Dezember hält sie eine weitere Zinserhöhung für möglich.',
        'Auch die Europäische Zentralbank entscheidet heute, um 14:15 Uhr. Die Inflation in der Eurozone liegt wegen des Irankriegs auf einem Dreijahreshoch. Gleichzeitig verkaufen Investoren französische Staatsanleihen wegen der Schuldenkrise dort.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zinsentscheidungen verändern die Finanzierungskosten von Staaten und Unternehmen und wirken sich darüber auf Aktien- und Anleihekurse aus. Steigt die Zinsdifferenz zwischen den USA und Europa, bewegt das auch den Euro-Kurs.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['dax', 'sp500'],
      sources: [
        {
          label:
            'Handelsblatt, 28.10.2026, 21:22 Uhr: „Geldpolitik: Fed lässt Zinsen unverändert – weniger Zinsentscheidungen ab 2027"',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/geldpolitik-fed-laesst-zinsen-unveraendert-weniger-zinsentscheidungen-ab-2027/100264521.html',
        },
        {
          label:
            'wallstreet-online, 28.10.2026: „Leitzins bleibt stabil: Fed pausiert bei Zinsen: Zwei Währungshüter wollten mehr"',
          url: 'https://www.wallstreet-online.de/nachricht/21597354-leitzins-bleibt-stabil-fed-pausiert-zinsen-waehrungshueter',
        },
      ],
    },
    {
      headline: 'Microsoft übertrifft, Alphabet verfehlt die Erwartungen deutlich',
      summary: [
        'Microsoft hat die Erwartungen der Analysten klar übertroffen. Der Umsatz stieg auf 92,3 Milliarden Dollar, erwartet waren 90,7 Milliarden. Die Aktie sprang nachbörslich um vier Prozent auf ein Rekordhoch.',
        'Alphabet verfehlte dagegen Umsatz und Gewinn. Der Gewinn je Aktie lag bei 2,12 Dollar, erwartet waren 2,97 Dollar. Die Aktie brach nachbörslich um 7,7 Prozent ein und fiel unter 300 Dollar.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Beide Konzerne stecken Milliarden in KI-Rechenzentren. Wie stark sich das schon im Umsatz zeigt, unterscheidet sich aber deutlich – und genau das bewertet die Börse gerade neu.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['microsoft', 'alphabet'],
      sources: [
        {
          label:
            'onvista, 28.10.2026, 20:20 Uhr: „Hyperscaler-Zahlen: Microsoft glänzt, Alphabet sackt ab"',
          url: 'https://www.onvista.de/news/2026/10-28-hyperscaler-zahlen-microsoft-glaenzt-alphabet-sackt-ab-41121301-19-26569458',
        },
        {
          label:
            'CNBC, 28.10.2026, 22:07 Uhr: „Alphabet sinks 10% as it holds 2026 capex unchanged, expects significant increase in 2027"',
          url: 'https://www.cnbc.com/2026/10/28/alphabet-googl-earnings-q3-2026.html',
        },
      ],
    },
    {
      headline: 'Deutsche Bank übertrifft Erwartungen – Aktie an der Dax-Spitze',
      summary: [
        'Die Deutsche Bank verdiente mehr als erwartet. Der Gewinn vor Steuern stieg um acht Prozent auf gut 2,6 Milliarden Euro. Analysten hatten im Schnitt mit 2,4 Milliarden gerechnet.',
        'Der Nettogewinn legte nur leicht zu. Er stieg um ein Prozent auf 1,6 Milliarden Euro, gebremst von Einmalkosten. Die Aktie stieg um gut drei Prozent und war damit Spitzenreiter im Dax.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass Vorsteuer- und Nettogewinn unterschiedlich stark wachsen, zeigt, wie stark Einmaleffekte und Steuern das Ergebnis einer Bank verzerren können – ein Blick auf Vorsteuergewinn und Nettogewinn getrennt lohnt sich.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['deutsche-bank', 'dax'],
      sources: [
        {
          label:
            'Handelsblatt, 28.10.2026, 09:31 Uhr: „Quartalszahlen: Deutsche Bank erzielt Milliardengewinn und übertrifft Erwartungen – Aktie an der Dax-Spitze"',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/banken-deutsche-bank-uebertrifft-erwartungen-aktie-steigt-deutlich/100263571.html',
        },
        {
          label:
            'onvista, 28.10.2026, 11:57 Uhr: „Deutsche Bank mit Rekordzahlen – SK Hynix glänzt"',
          url: 'https://www.onvista.de/news/2026/10-28-deutsche-bank-mit-rekordzahlen-sk-hynix-glaenzt-40338625-19-26569357',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Israels Wahl bringt keine Mehrheit – Börse und Schekel fallen',
      summary: [
        'Bei der Parlamentswahl in Israel hat keine Seite eine Mehrheit erreicht. Nach rund 70 Prozent der Auszählung kommt das Lager von Benjamin Netanyahu auf 54 Sitze. Der Oppositionsblock um Gadi Eisenkot erreicht 47 Sitze. Nötig wären 61 von 120.',
        'Der Leitindex in Tel Aviv fiel um rund drei Prozent. Der Schekel verlor etwa zwei Prozent auf 3,1185 Dollar, der größte Tagesverlust seit fast anderthalb Jahren. Auch israelische Staatsanleihen gerieten unter Druck. Die Märkte hatten zuvor auf einen Sieg der Opposition gesetzt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Index war vor der Wahl gestiegen, weil Anleger auf einen Regierungswechsel gesetzt hatten. Das Beispiel zeigt, wie stark schon eingepreiste Erwartungen Kursausschläge verstärken können, wenn sie sich nicht erfüllen.',
      relatedTopics: ['anlegerpsychologie', 'waehrungen-wechselkurse'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, 28.10.2026, 13:27 Uhr: „Parlamentswahl: Israels Leitindex fällt um drei Prozent – auch Währung unter Druck"',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/aktien/parlamentswahl-israels-leitindex-faellt-um-drei-prozent-waehrung-unter-druck/100265623.html',
        },
      ],
    },
    {
      headline: 'UBS verdient deutlich mehr – doch die Schweiz-Debatte dominiert',
      summary: [
        'Die UBS steigerte ihren Gewinn kräftig. Der Gewinn vor Steuern stieg um rund ein Viertel auf 3,6 Milliarden Dollar. Getragen wurde das vor allem von der Vermögensverwaltung und dem Schweizer Heimmarkt.',
        'Die Aktie fiel trotzdem leicht. Im Analystencall ging es vor allem um drohende Kapitalauflagen in der Schweiz. Bankchef Sergio Ermotti reagierte zunehmend verärgert: „Wir kommentieren keine Spekulationen, Annahmen oder Meinungen in Bezug auf Notfallpläne.“',
      ],
      category: 'Märkte',
      whyItMatters:
        'Gute Quartalszahlen schützen eine Aktie nicht automatisch, wenn ein ungelöstes politisches Risiko im Raum steht – hier die Frage, ob die UBS wegen strengerer Eigenkapitalregeln aus der Schweiz wegziehen könnte.',
      relatedTopics: ['aktie', 'schulden-und-kredit'],
      relatedSymbols: ['ubs'],
      sources: [
        {
          label:
            'Handelsblatt, 28.10.2026, 12:35 Uhr: „Schweizer Großbank: Wegzugsdebatte überlagert positive UBS-Zahlen"',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/banken/ubs-wegzugsdebatte-ueberlagert-positive-quartalszahlen-der-grossbank/100265319.html',
        },
      ],
    },
  ],
}
