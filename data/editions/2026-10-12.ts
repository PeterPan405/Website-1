import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-12.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-12 00:10 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-12',
  intro:
    'Vier Notenbanker sprechen zum IWF-Start, die Ukraine meldet neue Spannungen um Energieanlagen, und am Rohstoffmarkt ziehen Öl und Silber an.',
  top: [
    {
      headline: 'IWF-Jahrestagung startet, vier Notenbanker sprechen am Montag',
      summary: [
        'Die neue Woche beginnt dicht getaktet. In Washington eröffnet der Internationale Währungsfonds seine Jahrestagung.',
        'Gleich vier Notenbanker treten am selben Tag auf. Um 11:30 Uhr spricht ein Mitglied der Bank of England, um 12 Uhr ein EZB-Ratsmitglied. Am Nachmittag und am Abend folgen zwei weitere Reden, aus London und aus den USA.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Vier Auftritte an einem Tag aus drei Notenbanken erhöhen die Chance, dass mindestens eine Äußerung kurzfristig Anleihen oder Devisen bewegt.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['dax', 'eur-usd'],
      sources: [
        {
          label: 'wallstreet-online, Wirtschaftskalender, Stand 12.10.2026, 00:10 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Trump meldet Waffenruhe für Energieanlagen, Selenskyj neuen Angriff',
      summary: [
        'Am Sonntagabend kamen zwei Meldungen zur Ukraine im Abstand von einer halben Stunde. Zuerst berichtete Präsident Selenskyj von einem neuen russischen Angriff auf eine Energieanlage.',
        'Kurz danach verkündete US-Präsident Trump laut einem dpa-AFX-Roundup eine Waffenruhe für Energieanlagen. Details zu Umfang oder Dauer nannte keine der beiden Meldungen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Frühere Ankündigungen von Teil-Waffenruhen für die Energieinfrastruktur hielten im Ukraine-Krieg bislang nicht dauerhaft – entscheidend wird, ob neue Angriffe ausbleiben.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'erdgas'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 11.10.2026, 17:52 Uhr und 18:22 Uhr (dpa-AFX): „Selenskyj: Neuer russischer Angriff auf Energieanlage“ und „ROUNDUP 3/Ukraine-Krieg: Trump verkündet Waffenruhe für Energieanlagen“',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'Öl bei 104 Dollar, trotz Entspannung am Golf',
      summary: [
        'Brent kostet weiter rund 104 Dollar pro Fass. Das zeigt die Preisleiste von wallstreet-online in der Nacht zum Montag.',
        'Dabei melden mehrere Berichte Entspannung. Ölexporte aus der Golfregion liegen über dem Niveau vor dem Krieg, der Tankerverkehr durch die Straße von Hormus erreichte einen Höchststand. Warum der Preis trotzdem fest bleibt, erklärt keine der Quellen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Ölpreis preist nicht nur aktuelle Mengen ein, sondern auch die Unsicherheit über künftige Lieferungen – diese Risikoprämie kann bleiben, auch wenn mehr Öl fließt.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffpreise, Stand 12.10.2026, kurz nach 2 Uhr MESZ: Brent 103,90 USD',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'wallstreet-online, Rohstoff-Analysen, Société Générale vom 6.10.2026: „Freigabe von Dieselreserven wendet US-Exportstopp ab“ und „Trotz Hormus-Blockade: Ölexporte aus der Golfregion über Vorkriegsniveau“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Silber nähert sich 61 Dollar, Gold hält die Linie',
      summary: [
        'Silber hat in der Nacht zum Montag kräftig zugelegt. Der Preis stieg um 2,80 Prozent auf rund 60,83 Dollar je Feinunze.',
        'Gold bewegte sich dagegen kaum. Die Feinunze kostete 4.196,81 Dollar, ein Plus von nur 0,06 Prozent. Schon am Freitag hatte sich laut Goldreporter Silber stärker erholt als Gold.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Silber ist ein deutlich kleinerer Markt als Gold. Das macht seinen Kurs anfälliger für größere prozentuale Ausschläge in beide Richtungen.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['silber', 'gold'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffpreise, Stand 12.10.2026, 02:09 Uhr: Silber 60,83 USD (+2,80 %), Gold 4.196,81 USD (+0,06 %)',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'goldreporter.de, Marktbericht: „Der Goldpreis legt am Freitag deutlich zu und nähert sich der Marke von 4.200 USD. Silber erholt sich noch stärker.“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'SpaceX kauft Frequenzen von Grain Management – Telekom-Aktie fällt',
      summary: [
        'Ein Frequenzdeal von SpaceX hat am Freitag die Telekom-Aktie belastet. SpaceX übernimmt von Grain Management ein Frequenzportfolio im 800-Megahertz-Bereich, bis zu 14 Megahertz gepaartes Spektrum.',
        'Die Telekom-Aktie verlor im frühen Handel zeitweise rund sieben Prozent. Auch T-Mobile US, AT&T und Verizon gerieten unter Druck. Die Deutsche Telekom hält an T-Mobile US einen Anteil von 54,2 Prozent.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Frequenzen sollen laut Berichten ein eigenständiges Mobilfunkangebot unter der Marke Starlink Mobile vorbereiten – eine direkte Konkurrenz zum Kerngeschäft von T-Mobile US.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['deutsche-telekom'],
      sources: [
        {
          label:
            'ms-aktuell.de, 9.10.2026: „SpaceX drängt in den US-Mobilfunkmarkt und setzt die Telekom massiv unter Druck“',
          url: 'https://ms-aktuell.de/welt/telekom-aktie-spacex-09-10-2026/',
        },
        {
          label:
            'wallstreet-online, Startseite „Gefragte Nachrichten“, Stand 12.10.2026: „Telekom-Aktie bricht ein – ausgerechnet SpaceX ist der Grund!“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [],
}
