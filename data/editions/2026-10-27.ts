import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-27.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-27 00:16 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-27',
  intro:
    'Brasiliens Börse crasht nach Lulas Wahlsieg, Anthropic plant den Börsengang, DWS bremst einen Immobilienfonds, und Erdgas läuft gegensätzlich.',
  top: [
    {
      headline: 'Brasiliens Börse bricht nach Lulas Wahlsieg ein',
      summary: [
        'Die Finanzmärkte hatten auf einen Sieg von Jair Bolsonaro gesetzt. Stattdessen gewann der amtierende Präsident Lula da Silva die Stichwahl in Brasilien.',
        'Brasiliens Börse reagierte mit einem zeitweiligen Handelsstopp. Zuvor aufgebaute Kursgewinne, die auf einen Bolsonaro-Sieg gesetzt hatten, lösten sich wieder auf.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Kurse nehmen erwartete Ereignisse oft schon vorweg. Trifft die Erwartung nicht ein, muss der Markt die eingepreiste Wahrscheinlichkeit rasch neu bewerten.',
      relatedTopics: ['aktien-laender-branchen', 'anlegerpsychologie'],
      relatedSymbols: ['ibovespa'],
      sources: [
        {
          label:
            'FAZ.NET, Finanzmarkt, Gregor Brunner, Meldung vom 26.10.2026, 14:20 Uhr GMT: „Handelsstopp: Brasiliens Börse bricht nach Lula-Sieg ein“',
          url: 'https://www.faz.net/aktuell/finanzen/finanzmarkt/lula-wiederwahl-brasiliens-boerse-stellt-sich-auf-unruhe-ein-accg-201621022.html',
        },
        {
          label:
            'CNBC, Meldung vom 26.10.2026, 17:29 Uhr GMT: „Lula wins Brazil runoff after prediction markets favored Bolsonaro“',
          url: 'https://www.cnbc.com/2026/10/26/lula-brazil-election-prediction-markets.html',
        },
      ],
    },
    {
      headline: 'Anthropic beantragt Börsengang in den USA',
      summary: [
        'Das KI-Unternehmen Anthropic hat die Unterlagen für einen Börsengang in den USA eingereicht. Der Börsengang könnte bereits im November stattfinden.',
        'Der Prospekt nennt eine mögliche Bewertung von rund zwei Billionen Dollar, bei zugleich hohen Verlusten und einer langen Liste von Risikofaktoren.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine hohe angestrebte Bewertung sagt nichts über laufende Gewinne aus. Die Risikofaktoren im Prospekt zeigen, wovon das Geschäftsmodell abhängt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'Tagesschau, Wirtschaft/Unternehmen, Meldung vom 26.10.2026, 16:49 Uhr: „KI-Unternehmen Anthropic beantragt Börsengang und warnt vor Risiken“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/anthropic-bereitet-boersengang-vor-100.html',
        },
        {
          label:
            'FAZ.NET, Finanzmarkt, Roland Lindner, New York, Meldung vom 26.10.2026, 23:21 Uhr GMT: „Jeder der Anthropic-Gründer könnte bald bis zu 29 Milliarden Dollar schwer sein“',
          url: 'https://www.faz.net/aktuell/finanzen/finanzmarkt/anthropic-strebt-boersenbewertung-von-zwei-billionen-dollar-an-201622644.html',
        },
      ],
    },
    {
      headline: 'DWS beschränkt Auszahlungen beim Immobilienfonds Grundbesitz Europa',
      summary: [
        'Die Deutsche-Bank-Tochter DWS zahlt bei ihrem Immobilienfonds Grundbesitz Europa nur noch zehn Prozent der angeforderten Summen aus. Wer mehr Geld möchte, muss die Kündigung erneut einreichen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Offene Immobilienfonds versprechen tägliche Liquidität für Gebäude, die sich nicht schnell verkaufen lassen – diese Lücke zeigt sich jetzt.',
      relatedTopics: ['fonds', 'immobilien'],
      relatedSymbols: ['deutsche-bank'],
      sources: [
        {
          label:
            'Handelsblatt, Banken + Versicherungen, Markus Hinterberger, Martin Müller, Meldung vom 26.10.2026, 20:00 Uhr GMT: „Grundbesitz Europa: „Persönliche Belastung für Anleger möglich“: DWS schränkt Rücknahme bei Immobilienfonds ein“',
          url: 'https://www.handelsblatt.com/finanzen/banken-versicherungen/geldanlage-dws-beschraenkt-ruecknahme-ihres-groessten-offenen-immobilienfonds/100265044.html',
        },
        {
          label:
            'WirtschaftsWoche, Geldanlage, Heike Schwerdtfeger, Meldung vom 26.10.2026, 18:18 Uhr GMT: „Grundbesitz Europa: Jetzt gibt es beim DWS-Immobilienfonds Geld nur noch kleckerweise“',
          url: 'https://www.wiwo.de/finanzen/geldanlage/dws-immobilienfonds-jetzt-gibt-es-geld-nur-noch-kleckerweise/100265056.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Erdgas: Europa zahlt Rekordpreise, die USA ein Zweijahrestief',
      summary: [
        'Erdgas kostet Großhändler in Europa so viel wie seit knapp vier Jahren nicht mehr, knapp unter 100 Euro je Megawattstunde. Als Treiber nennt das Handelsblatt den Krieg um den Iran und das Auffüllen der deutschen Gasspeicher.',
        'In den USA fiel der Erdgaspreis zur gleichen Zeit auf den tiefsten Stand seit zwei Jahren. Einen Grund dafür nennt die Quelle nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein globaler Rohstoff kann an verschiedenen Handelsplätzen gleichzeitig teurer und billiger werden – wer nur auf einen Preis schaut, sieht nur die halbe Geschichte.',
      relatedTopics: ['rohstoffe', 'inflation'],
      relatedSymbols: ['erdgas'],
      sources: [
        {
          label:
            'Handelsblatt, Devisen + Rohstoffe, Meldung vom 26.10.2026, 13:52 Uhr GMT: „Rohstoff: Europäischer Gaspreis weiter im Höhenflug – knapp unter 100 Euro“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/devisen-rohstoffe/rohstoff-europaeischer-gaspreis-weiter-im-hoehenflug-knapp-unter-100-euro/100265010.html',
        },
        {
          label:
            'wallstreetONLINE, Redaktion, Meldung vom 26.10.2026: „Erdgas im freien Fall: Gaspreis-Schock in den USA: Erdgas stürzt auf tiefsten Stand seit 2 Jahren“',
          url: 'https://www.wallstreet-online.de/nachricht/21582588-erdgas-freien-fall-gaspreis-schock-usa-erdgas-stuerzt-tiefsten-stand-2-jahren',
        },
      ],
    },
    {
      headline: 'Microsoft bietet 60.000 Beschäftigten einen freiwilligen Abschied',
      summary: [
        'Microsoft bietet nach einem Bericht von CNBC rund 60.000 Beschäftigten in den USA einen freiwilligen Abschied an. Der Konzern will damit sein schnelles Wachstum bei der KI-Infrastruktur mit mehr Kapitaleffizienz verbinden.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Hohe KI-Investitionen und Sparprogramme schließen sich nicht aus – beide können aus derselben Entscheidung über den Einsatz von Kapital folgen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['microsoft'],
      sources: [
        {
          label:
            'CNBC, Meldung vom 26.10.2026, 20:44 Uhr GMT: „Microsoft offers voluntary buyouts to 60,000 employees as AI leads to efficiency push“',
          url: 'https://www.cnbc.com/2026/10/26/microsoft-msft-voluntary-buyouts.html',
        },
      ],
    },
  ],
}
