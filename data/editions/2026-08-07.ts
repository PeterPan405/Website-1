import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-07.
 *
 * Recherchiert aus den Quellen, die `quellen-sammeln.yml` am Morgen des
 * 7. August um 03:28 bis 03:33 UTC abgerufen hat: onvista, wallstreet-online,
 * finanzen.net und Goldreporter. Vier weitere Quellen der Liste
 * (boerse-frankfurt, destatis, Bundesbank, EZB) lieferten an diesem Morgen
 * kein verwertbares Material – Gerüst ohne Inhalt oder nur Navigation.
 */
export const edition: DailyEdition = {
  date: '2026-08-07',
  intro:
    'Zinssorgen drücken die Wall Street, der DAX steht am Höhepunkt der Berichtssaison still, Gold bricht über 4.200 Dollar aus – der 7. August in acht Lehrstücken.',
  top: [
    {
      headline: 'Zinssorgen kehren zurück und drücken die Wall Street',
      summary: [
        'Die dpa-AFX-Meldung vom Donnerstagabend, 20:32 Uhr, trug den Titel „Verluste nach Rekordjagd – Zinssorgen sind zurück“.',
        'In der Kursleiste von wallstreet-online stand am Freitagmorgen der Dow Jones bei 53.901,32 Punkten (−0,92 Prozent), der US Tech 100 bei 29.381,54 Punkten (−0,51 Prozent).',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Aktie ist rechnerisch die Summe künftiger Gewinne, abgezinst auf heute. Steigt der Zins, steigt der Abschlag auf alles Künftige – der Kurs fällt, ohne dass ein Unternehmen etwas gemeldet hätte. Ferne Gewinne trifft es härter als nahe, deshalb reagieren Technologiewerte stärker.',
      relatedTopics: ['notenbanken-geldpolitik', 'aktie'],
      relatedSymbols: ['sp500', 'nasdaq-100', 'dow-jones'],
      sources: [
        {
          label:
            'onvista, „Aktien New York Schluss: Verluste nach Rekordjagd – Zinssorgen sind zurück“ (dpa-AFX, 6.8.2026, 20:32 Uhr), abgerufen 7.8.2026, 03:33 Uhr UTC',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Der DAX schließt am Höhepunkt der Berichtssaison kaum verändert',
      summary: [
        'Zwei Meldungen desselben Tages: „Dax an Berichtssaison-Höhepunkt kaum verändert“ (dpa-AFX, 16:19 Uhr) und „Leitindex kaum verändert – Telekom mit starkem Quartal“ (onvista, 15:55 Uhr).',
        'Am selben Tag verdiente die Deutsche Telekom laut den Berichten mehr, während Rheinmetall die Umsatzprognose senkte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Index ist ein gewichteter Durchschnitt. Ein kräftiger Gewinner und ein ähnlich schwerer Verlierer heben sich darin auf – der ruhige Indexstand steht über einem unruhigen Tag. Wer Einzelaktien hält, bekommt diesen Durchschnitt nicht.',
      relatedTopics: ['boerse', 'aktie'],
      relatedSymbols: ['dax', 'deutsche-telekom', 'rheinmetall'],
      sources: [
        {
          label:
            'onvista, Index-Analysen und Dax-Tagesrückblick vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'finanzen.net, „Heute im Fokus“ vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Gold steigt auf 4.268 Dollar, die ETF-Bestände wachsen die dritte Woche',
      summary: [
        'Goldreporter meldete am 6. August: „Der Goldpreis steigt am Donnerstag auf 4.268 USD. Nach dem kräftigen Ausbruch am Vortag sorgen Anschlusskäufe für weiteres positives Momentum.“',
        'Zugleich stiegen die Bestände des größten Gold-ETF die dritte Woche in Folge. Warum der Ausbruch stattfand, geht aus den Meldungen nicht hervor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Preis sagt, was zuletzt bezahlt wurde – nicht, wie viel gekauft wurde. Ein Gold-ETF muss für jeden Anteil physisches Gold einlagern; sein Bestand ist damit eine unmittelbare Spur der Nachfrage. Steigen Preis und Bestand zusammen, ist die Bewegung durch echte Käufe unterlegt.',
      relatedTopics: ['rohstoffe', 'etf'],
      relatedSymbols: ['gold', 'silber'],
      sources: [
        {
          label:
            'Goldreporter, „Goldpreis aktuell: Gold steigt weiter – Anschlusskäufe nach dem Ausbruch“ und „Größter Gold-ETF: Bestände steigen dritte Woche in Folge“, beide vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Am Markt kursiert die Erwartung von drei Zinserhöhungen noch 2026',
      summary: [
        'wallstreet-online führte am Freitagmorgen einen Aufmacher mit der Zeile „Noch 2026: Drei Zinserhöhungen stehen plötzlich im Raum“.',
        'Das ist eine Markterwartung, kein Beschluss – was eine Notenbank tut, steht erst nach ihrer Sitzung fest.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Was erwartet wird, steckt bereits im Kurs. Bewegung entsteht nur aus der Abweichung von der Erwartung. Deshalb bewegen sich Kurse an Tagen ohne Notenbanksitzung – die eigentliche Bewegung ist längst gelaufen, verteilt über alle Tage, an denen sich die Erwartung verschoben hat.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['sp500', 'dax'],
      sources: [
        {
          label:
            'wallstreet-online, Aufmacher „Fed-Hammer für die Börse“, abgerufen 7.8.2026, 03:33 Uhr UTC',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Telekom verdient mehr, Rheinmetall senkt die Umsatzprognose',
      summary: [
        'Die Übersicht von finanzen.net fasste den 6. August so zusammen: „Rheinmetall senkt Umsatzprognose – Telekom verdient mehr“.',
        'Der onvista-Rückblick desselben Tages nannte die Telekom-Zahlen ein „starkes Quartal“.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein Quartalsbericht enthält zwei verschiedene Dinge: die Bilanz des vergangenen Vierteljahrs und die Prognose für die kommenden Monate. Der Kurs ist ein Preis für die Zukunft – deshalb kann eine Aktie nach Rekordzahlen fallen, wenn der Ausblick enttäuscht.',
      relatedTopics: ['aktie', 'wann-kaufen-verkaufen'],
      relatedSymbols: ['deutsche-telekom', 'rheinmetall'],
      sources: [
        {
          label:
            'finanzen.net, „Heute im Fokus“ vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Die weltweiten Ölvorräte sind trotz Krise kaum gesunken',
      summary: [
        'wallstreet-online titelte am 6. August „Ölkrise mit vollen Tanks“ und stellte fest, dass die weltweiten Ölvorräte kaum gesunken seien.',
        'Am Freitagmorgen zeigten zwei Portale zur selben Zeit fast denselben Ölpreis: 83,54 mit +5,15 Prozent bei wallstreet-online, 83,56 mit +1,3 Prozent bei finanzen.net.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Lagerbestände sind der Puffer zwischen Störung und Knappheit – solange Tanks voll sind, bewegt eine Krisenmeldung den Preis kaum. Und eine Prozentangabe ohne Bezugspunkt ist keine Aussage: Beide Zahlen oben stimmen vermutlich und meinen verschiedene Zeitpunkte oder Sorten.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online, „Ölkrise mit vollen Tanks“ vom 6.8.2026, sowie die Kursleisten von wallstreet-online und finanzen.net, abgerufen 7.8.2026, 03:33 Uhr UTC',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Polen kauft Gold zu, Südkorea erstmals seit 13 Jahren',
      summary: [
        'Goldreporter berichtete am 6. August, Polen kaufe kräftig zu, weitere große Käufer seien am Markt.',
        'In derselben Beitragsliste steht, dass Südkoreas Zentralbank erstmals seit 13 Jahren wieder Gold gekauft habe.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Gold zahlt keine Zinsen und ist nach Ertrag betrachtet ein schlechtes Reservegut. Es hat aber eine Eigenschaft, die keine Anleihe besitzt: Es ist die Verbindlichkeit von niemandem. Für eine Notenbank ist es Versicherung, nicht Geldanlage – eine Aufgabenstellung, die mit der privaten wenig zu tun hat.',
      relatedTopics: ['notenbanken-geldpolitik', 'geldsystem'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'Goldreporter, „Goldreserven weltweit: Polen kauft kräftig zu“ vom 6.8.2026 und „Südkoreas Zentralbank kauft erstmals seit 13 Jahren wieder Gold“, abgerufen 7.8.2026, 03:33 Uhr UTC',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'RWE stoppt Offshore-Projekte nach Übereinkunft mit Trump',
      summary: [
        'Um 01:22 Uhr lief über dpa-AFX die Meldung „Deal mit Windkraftgegner Trump: RWE stoppt Offshore-Projekte“.',
        'Umfang und Bedingungen der Übereinkunft gehen aus der abgerufenen Übersicht nicht hervor.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein Offshore-Windpark rechnet sich über zwanzig Jahre und mehr, eine Wahlperiode dauert vier bis fünf. Diese Lücke ist das politische Risiko: Es steht in keiner Bilanzkennzahl, entscheidet aber über das Ergebnis mit.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['siemens-energy', 'eon'],
      sources: [
        {
          label:
            'onvista, „Deal mit Windkraftgegner Trump: RWE stoppt Offshore-Projekte“ (dpa-AFX, 7.8.2026, 01:22 Uhr), abgerufen 7.8.2026, 03:33 Uhr UTC',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'D-Wave meldet 48 Millionen Dollar Verlust bei 3,1 Millionen Umsatz',
      summary: [
        'wallstreet-online nannte am 6. August für den Quantencomputer-Anbieter D-Wave einen Verlust von 48 Millionen US-Dollar bei einem Umsatz von 3,1 Millionen US-Dollar.',
        'finanzen.net führte den Wert am selben Tag unter „D-Wave enttäuscht“.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Bei Firmen ohne Gewinn greift das Kurs-Gewinn-Verhältnis nicht – man kann nicht durch eine negative Zahl teilen. Das ersatzweise genommene Kurs-Umsatz-Verhältnis hat bei 3,1 Millionen Umsatz einen so kleinen Nenner, dass es nur noch die Erwartung misst, nicht die Substanz.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label:
            'wallstreet-online, „D-Wave macht 48 Millionen US-Dollar Verlust – bei nur 3,1 Millionen Umsatz“ vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
