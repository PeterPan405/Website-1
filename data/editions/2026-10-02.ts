import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-02.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-02 00:19 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-02',
  intro:
    'Putin setzt Kiew eine Frist beim Donbass, Irans Ölexporte brechen fast weg, und am Abend dämpft die Fed die Sorge vor weiteren Zinserhöhungen.',
  top: [
    {
      headline: 'Fed-Vize Jefferson lässt Zinsfrage offen, Wall Street schließt im Plus',
      summary: [
        'Die US-Börsen haben am Donnerstag frühe Verluste aufgeholt. Der Dow Jones schloss knapp höher bei 50.926 Punkten, der S&P 500 gewann 0,19 Prozent, der Nasdaq 100 0,31 Prozent.',
        'Geholfen haben sinkende Anleiherenditen. Fed-Vizechef Philip Jefferson sagte dazu: Es brauche noch Zeit, um zu beurteilen, ob weitere Zinserhöhungen nötig seien.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Steigende Anleiherenditen verteuern rechnerisch künftige Unternehmensgewinne über die Abzinsung, sinkende Renditen wirken deshalb oft wie Rückenwind für Aktien.',
      relatedTopics: ['notenbanken-geldpolitik', 'staatsanleihe'],
      relatedSymbols: ['dow-jones', 'sp500', 'nasdaq-100'],
      sources: [
        {
          label:
            'onvista, Meldung vom 01.10.2026, 20:42 Uhr: „ROUNDUP/Aktien New York Schluss: Moderate Gewinne – Anleiherenditen geben nach“',
          url: 'https://www.onvista.de/news/2026/10-01-roundup-aktien-new-york-schluss-moderate-gewinne-anleiherenditen-geben-nach-0-10-26559711',
        },
      ],
    },
    {
      headline: 'Putin kündigt Donbass-Eroberung an, Kiew zeigt erste eigene Rakete',
      summary: [
        'Putin kündigte beim Waldai-Forum in Moskau an, Russland werde den gesamten Donbass binnen anderthalb Jahren erobern. Nach seiner Angabe stehen derzeit elf Prozent der Region unter ukrainischer Kontrolle.',
        'Am selben Tag meldete Präsident Selenskyj den ersten Kampfeinsatz einer eigenen ballistischen Rakete vom Typ FP-7, gebaut von der Firma Fire Point.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Militärische Eskalation gilt als einer der Risikofaktoren, die sich in der Risikoprämie von Rohstoffpreisen wie Öl niederschlagen können, unabhängig vom tatsächlichen Kriegsverlauf.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'ariva.de, Meldung vom 01.10.2026: „Putin will Donbass in weniger als anderthalb Jahren erobern“',
          url: 'https://www.ariva.de/news/putin-will-donbass-in-weniger-als-anderthalb-jahren-erobern-12155954',
        },
        {
          label:
            'ariva.de, Meldung vom 01.10.2026, 20:39 Uhr: „Kiew verkündet ersten Einsatz eigener ballistischer Rakete“',
          url: 'https://www.ariva.de/news/kiew-verkuendet-ersten-einsatz-eigener-ballistischer-rakete-12155928',
        },
      ],
    },
    {
      headline: 'Irans Ölexporte brechen fast weg, Brent bleibt über 100 Dollar',
      summary: [
        'Irans Ölexporte fielen im September auf rund 475.000 Barrel täglich. Seit dem 26. September kamen praktisch keine neuen Tanker mehr an, meldete wallstreet-online.',
        'Der Ölpreis blieb trotzdem über 100 Dollar je Barrel. Andere Golf-Produzenten liefern laut zwei Meldungen inzwischen deutlich mehr über die Straße von Hormus, wobei die genannten Mengen voneinander abweichen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Höhere Liefermengen senken einen Ölpreis nicht automatisch, wenn gleichzeitig Fracht-, Versicherungs- und Logistikkosten steigen – der Preis bildet beides zugleich ab.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffnachrichten, Meldung vom 01.10.2026, 18:29 Uhr: „Teherans gefährlichster Hebel: Irans Ölexporte brechen weg – 13 Mio. Barrel der Nachbarn fließen durch Hormus“',
          url: 'https://www.wallstreet-online.de/nachricht/21460779-teherans-gefaehrlichster-hebel-irans-oelexporte-brechen-13-mio-barrel-nachbarn-fliessen-hormus',
        },
        {
          label:
            'wallstreet-online, Rohstoffnachrichten, Meldung vom 01.10.2026: „Immer noch dreistellige Preise: Hormus öffnet sich wieder, doch der Ölpreis fällt trotzdem nicht!“',
          url: 'https://www.wallstreet-online.de/nachricht/21462456-dreistellige-preise-hormus-oeffnet-wieder-oelpreis-faellt-nicht',
        },
      ],
    },
    {
      headline: 'Euro fällt auf 1,1235 Dollar, tiefster Stand seit Mai 2025',
      summary: [
        'Der Euro fiel zum Dollar auf 1,1235, den tiefsten Stand seit Mai 2025. Als Gründe nannte dpa-AFX steigende Ölpreise und verstärkte Spekulation auf weitere Fed-Zinserhöhungen.',
        'Schon am Dienstag hatte der Euro mit 1,1338 Dollar eine ähnliche Marke erreicht. Am Freitag spricht um 9:30 Uhr EZB-Direktoriumsmitglied Cipollone.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Zinserwartungen bewegen Wechselkurse oft schneller, als eine Notenbank sie am Ende tatsächlich bestätigt oder verwirft.',
      relatedTopics: ['waehrungen-wechselkurse', 'notenbanken-geldpolitik'],
      relatedSymbols: ['eur-usd'],
      sources: [
        {
          label:
            'onvista, Meldung vom 01.10.2026, 19:05 Uhr: „Devisen: Euro rutscht zum US-Dollar auf Niveau von Mai 2025“',
          url: 'https://www.onvista.de/news/2026/10-01-devisen-euro-rutscht-zum-us-dollar-auf-niveau-von-mai-2025-0-10-26559702',
        },
      ],
    },
    {
      headline: 'Dax rutscht unter 25.000 Punkte, 200-Tage-Linie hält',
      summary: [
        'Der Dax fiel um 1,03 Prozent auf 24.939 Punkte und rutschte unter die 25.000-Marke. Der MDax verlor stärker, 1,92 Prozent auf 30.251 Punkte.',
        'Am Tagestief von 24.831 Punkten fing die 200-Tage-Linie den Dax auf. Als Belastung nannte onvista schwache US-Börsen, hohe Ölpreise und steigende Anleiherenditen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die 200-Tage-Linie gilt vielen Marktteilnehmern als technische Orientierung für den langfristigen Trend, ohne dass sie etwas über die Zukunft aussagen kann.',
      relatedTopics: ['wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'mdax'],
      sources: [
        {
          label:
            'onvista, Meldung vom 01.10.2026, 15:58 Uhr: „Leitindex unter 25.000 Punkten – doch 200-Tage-Linie hält“',
          url: 'https://www.onvista.de/news/2026/10-01-leitindex-unter-25-000-punkten-200-tage-linie-haelt-41121301-19-26559651',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Micron dreht nach Gewinnmitnahmen ins Plus',
      summary: [
        'Micron fiel trotz Rekordumsatz von 54,23 Milliarden Dollar zeitweise fast vier Prozent, Anleger nahmen Gewinne mit. Zum Schluss stand die Aktie drei Prozent höher bei 1.097,39 Dollar.',
        'Für das laufende Quartal stellte Micron einen Umsatz von 60 bis 63 Milliarden Dollar in Aussicht. Die Aktie hat sich binnen eines Jahres etwa versechsfacht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wenn ein Kurs schon viel Zukunft vorwegnimmt, kann selbst eine Prognose über den Erwartungen zunächst wenig zusätzlichen Schub geben.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['micron', 'nasdaq-100'],
      sources: [
        {
          label:
            'onvista, Meldung vom 01.10.2026, 20:57 Uhr: „AKTIE IM FOKUS 2: Micron drehen ins Plus – Gewinnmitnahmen belasten nur kurz“',
          url: 'https://www.onvista.de/news/2026/10-01-aktie-im-fokus-2-micron-drehen-ins-plus-gewinnmitnahmen-belasten-nur-kurz-0-10-26559712',
        },
      ],
    },
    {
      headline: 'Nike verschärft Sparprogramm nach weiterem Umsatzrückgang',
      summary: [
        'Nike will über die kommenden Jahre 2,5 Milliarden Dollar sparen, inklusive Stellenabbau. Im vergangenen Quartal sanken Umsatz um 4 Prozent und Gewinn um 2 Prozent.',
        'Für das Geschäftsjahr bis Mai 2027 erwartet Nike einen Umsatzrückgang im hohen einstelligen Prozentbereich. Die Aktie fiel nachbörslich zeitweise rund 4 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Prognose, die schlechter ausfällt als der bereits gemeldete Rückgang, wiegt an der Börse oft schwerer als die vergangenen Zahlen selbst.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['nike'],
      sources: [
        {
          label:
            'onvista, Meldung vom 01.10.2026, 21:35 Uhr: „Weitere Rückgänge bei Umsatz und Gewinn – Nike verschärft Sparprogramm“',
          url: 'https://www.onvista.de/news/2026/10-01-weitere-rueckgaenge-bei-umsatz-und-gewinn-nike-verscharft-sparprogramm-0-10-26559714',
        },
      ],
    },
  ],
}
