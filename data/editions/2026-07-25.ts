import type { DailyEdition } from './types'

/**
 * Ausgabe vom 25. Juli 2026.
 *
 * Die Ausgabe erscheint morgens und fasst den vorangegangenen Handelstag
 * zusammen – hier also Freitag, den 24. Juli 2026.
 */
export const edition: DailyEdition = {
  date: '2026-07-25',
  intro:
    'Die EZB lässt die Zinsen unverändert, der Ölpreis überschreitet 100 Dollar und zieht den DAX mit nach unten. Was das für Sparer bedeutet.',
  top: [
    {
      headline: 'EZB lässt den Einlagenzins bei 2,25 Prozent',
      summary: [
        'Der EZB-Rat hat auf seiner Sitzung am 23. Juli alle drei Leitzinsen unverändert gelassen. Der Einlagensatz, an dem sich Tagesgeld und Festgeld orientieren, bleibt damit bei 2,25 Prozent.',
        'Bemerkenswert ist das vor allem im Rückblick: Im Juni hatte die Notenbank die Zinsen um 0,25 Prozentpunkte angehoben – die erste Erhöhung seit September 2023. Die Pause jetzt bedeutet also nicht Stillstand, sondern Abwarten, ob dieser Schritt gegen die Inflation genügt.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der Einlagensatz ist die Untergrenze für alles, was Banken für Guthaben zahlen. Solange er liegt, bewegen sich Tagesgeldangebote kaum – wer auf höhere Sparzinsen wartet, wartet vorerst vergeblich.',
      relatedTopics: ['tagesgeld', 'zinseszins'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label: 'Finanztip: EZB-Leitzins – aktuelle Entwicklung',
          url: 'https://www.finanztip.de/zinsentwicklung/ezb-leitzins/',
        },
        {
          label: 'LBBW: EZB-Zinsentscheid, Leitzins und Prognosen',
          url: 'https://www.lbbw.de/artikel/maerkte-verstehen/ezb-zinsentscheid-leitzins-prognosen_ait4bfmrfe_d.html',
        },
      ],
    },
    {
      headline: 'Ölpreis über 100 Dollar – Eskalation im Nahen Osten treibt die Kosten',
      summary: [
        'Der Rohölpreis ist über die Marke von 100 US-Dollar gestiegen. Auslöser ist die weitere Eskalation im Mittleren Osten, die Zweifel an einer verlässlichen Versorgung nährt.',
        'Für die Börsen ist das eine doppelte Belastung: Teure Energie verteuert die Produktion und drückt damit die Gewinnaussichten der Unternehmen. Gleichzeitig treibt sie die Inflation – und verringert damit den Spielraum der Notenbanken, die Zinsen zu senken.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Energiepreise wirken doppelt auf das eigene Geld: erst über die Heiz- und Tankrechnung, dann über die Inflationsrate, an der die EZB ihre Zinsentscheidungen ausrichtet.',
      relatedTopics: ['boerse', 'staatsanleihe'],
      relatedSymbols: ['dax', 'eur-usd'],
      sources: [
        {
          label: 'MarketScreener: XETRA-Schluss – DAX zwischen Inflation und Ölpreis',
          url: 'https://de.marketscreener.com/boerse-nachrichten/xetra-schluss-dax-zwischen-inflation-und-oelpreis-ce7f5eddd881f42d',
        },
      ],
    },
    {
      headline: 'DAX verliert 1,6 Prozent und kämpft um den Wochengewinn',
      summary: [
        'Der deutsche Leitindex ist am Donnerstag um 1,6 Prozent auf 24.763 Punkte gefallen. Damit hat er den Aufschlag von 1,3 Prozent aus der Wochenmitte wieder abgegeben und muss um ein positives Wochenergebnis kämpfen.',
        'Treiber war die Kombination aus steigenden Ölpreisen und wieder aufkommenden Inflationssorgen. Mehrere EZB-Vertreter hatten zuvor durchblicken lassen, dass weitere Zinsschritte nicht vom Tisch sind.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Tagesverlust von 1,6 Prozent ist normale Schwankung, kein Signal. Wer monatlich in einen Sparplan einzahlt, kauft an solchen Tagen mehr Anteile für dasselbe Geld – deshalb ist Nichtstun hier meist die bessere Entscheidung.',
      relatedTopics: ['aktie', 'etf', 'cost-average-sparplan'],
      relatedSymbols: ['dax', 'euro-stoxx-50'],
      sources: [
        {
          label: 'MarketScreener: XETRA-Schluss – DAX zwischen Inflation und Ölpreis',
          url: 'https://de.marketscreener.com/boerse-nachrichten/xetra-schluss-dax-zwischen-inflation-und-oelpreis-ce7f5eddd881f42d',
        },
        {
          label: 'wallstreetONLINE: DAX – höheres Verlaufstief?',
          url: 'https://www.wallstreet-online.de/nachricht/21148733-dax-hoeheres-verlaufstief',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'EZB-Vertreter halten weitere Zinsschritte offen',
      summary: [
        'Mehrere Mitglieder des EZB-Rats haben sich in dieser Woche geäußert, ohne weitere Zinserhöhungen auszuschließen. Begründung sind fortbestehende Inflationsrisiken, insbesondere von der Energieseite.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Für Kreditnehmer heißt das: Die Hoffnung auf schnell fallende Bauzinsen ist verfrüht. Wer eine Finanzierung plant, sollte nicht auf eine Zinswende nach unten setzen.',
      relatedTopics: ['immobilien', 'staatsanleihe'],
      relatedSymbols: [],
      sources: [
        {
          label: 'finanzen.ch: Überblick am Morgen – Konjunktur, Zentralbanken, Politik',
          url: 'https://www.finanzen.ch/nachrichten/aktien/ueberblick-am-morgen-konjunktur-zentralbanken-politik-1036360790',
        },
      ],
    },
    {
      headline: 'Bauzinsen kaum bewegt, Festgeld bis 3,6 Prozent',
      summary: [
        'Die Bauzinsen liegen Mitte Juli bei rund 3,4 bis 3,9 Prozent effektivem Jahreszins für zehn Jahre Zinsbindung und bei 3,7 bis 4,3 Prozent für zwanzig Jahre. Bewegt hat sich zuletzt wenig.',
        'Auf der Sparseite bringt Tagesgeld etwa 2,25 Prozent, Festgeld je nach Laufzeit bis zu 3,6 Prozent. Der Abstand zwischen beiden ist der Preis für die Bindung des Geldes.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Bei rund 2 Prozent Inflation bleibt von 2,25 Prozent Tagesgeld real fast nichts übrig. Erst Festgeld mit längerer Laufzeit liefert derzeit einen nennenswerten realen Zuwachs.',
      relatedTopics: ['tagesgeld', 'zinseszins', 'immobilien'],
      relatedSymbols: [],
      sources: [
        {
          label: 'Finanztip: Zinsentwicklung und Zinsprognose 2026',
          url: 'https://www.finanztip.de/zinsentwicklung/',
        },
        {
          label: 'baufivergleich.de: Aktuelle Bauzinsen Juli 2026',
          url: 'https://baufivergleich.de/aktuelle-zinsen/',
        },
      ],
    },
  ],
}
