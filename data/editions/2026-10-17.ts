import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-17.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-17 00:45 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-17',
  intro:
    'Fed-Chef Warsh lobt eine KI-Investitionswelle, der Ölpreis nähert sich 110 Dollar, und Deutschland und Frankreich weichen das Verbrenner-Aus auf.',
  top: [
    {
      headline: 'Fed-Chef Warsh lobt KI-Investitionswelle, Wall Street bleibt nervös',
      summary: [
        'Die US-Börsen beendeten die Woche schwächer. Der Dow Jones gab 0,3 Prozent ab. Bei Chip- und KI-Werten hielt der Ausverkauf an. Der Angst-Index VIX stieg über 22 Punkte – den höchsten Stand seit vier Monaten.',
        'Mitten in den Ausverkauf sprach Fed-Chef Kevin Warsh am Freitag öffentlich. Er beschrieb eine „enorme Investitionswelle“ bei Künstlicher Intelligenz. Seine Worte dämpften zugleich die Aussicht auf eine baldige Zinserhöhung.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der VIX misst die vom Markt erwartete Schwankung, nicht die Kursrichtung – ein hoher Wert zeigt Nervosität, sagt aber nichts darüber, ob Kurse weiter fallen oder sich erholen.',
      relatedTopics: ['notenbanken-geldpolitik', 'risiko-und-rendite'],
      relatedSymbols: ['dow-jones', 'nasdaq-100'],
      sources: [
        {
          label:
            'Handelsblatt, 16.10.2026, 18:22 Uhr GMT: „Dow Jones, S&P 500, Nasdaq: US-Börsen verlieren deutlich – Ausverkauf bei KI-Aktien geht weiter“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-dow-jones-schliesst-03-prozent-niedriger/100262834.html',
        },
        {
          label:
            "CNBC, 16.10.2026, 19:28 Uhr GMT: „Wall Street's fear gauge is ripping. Traders see it going even higher“",
          url: 'https://www.cnbc.com/2026/10/16/wall-streets-fear-gauge-is-ripping-traders-see-it-going-even-higher.html',
        },
      ],
    },
    {
      headline: 'Ölpreis steigt auf rund 110 Dollar, Iran weitet Hormus-Angriffe aus',
      summary: [
        'Der Ölpreis zog kräftig an. Die Sorte Brent näherte sich am Freitag 110 Dollar je Barrel. Grund ist eine Eskalation am Persischen Golf. Iran hat seine Angriffe in der Straße von Hormus in dieser Woche verstärkt – eine zweite, unabhängige Quelle dazu lag bislang nicht vor.',
        'Zugleich kündigte die Ukraine neue Schritte an. Sie will nach eigenen Angaben russische Ölraffinerien angreifen. Spürbar wird der höhere Ölpreis schon in Europa. Die Lufthansa-Tochter Eurowings streicht Flüge und prüft Kurzarbeit – als Grund nennt sie die gestiegenen Kerosinpreise durch den Krieg.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Energiepreise wirken mit Verzögerung auf die Inflation – ein höherer Ölpreis verteuert zunächst Treibstoff und Fracht, bevor er sich in den Verbraucherpreisen zeigt.',
      relatedTopics: ['rohstoffe', 'inflation'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'CNBC, 16.10.2026, 20:02 Uhr GMT: „Brent oil touches $110 as Iran escalates Hormuz attacks, Ukraine vows to hit Russian refineries“',
          url: 'https://www.cnbc.com/2026/10/16/oil-price-today-iran-strait-hormuz-ukraine-russia.html',
        },
        {
          label:
            'Tagesschau, 16.10.2026, 18:52 Uhr: „Eurowings streicht Flüge und prüft Kurzarbeit“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/eurowings-kurzarbeit-100.html',
        },
      ],
    },
    {
      headline:
        'Deutschland und Frankreich weichen Verbrenner-Aus auf, Autoaktien springen an',
      summary: [
        'Deutschland und Frankreich einigten sich am Freitag. Beide Regierungen kündigten eine Aufweichung des EU-weiten Verbrenner-Aus an. Fahrzeuge mit Verbrennungsmotor könnten damit auch nach 2035 neu zugelassen werden. Eine zweite, unabhängige Quelle dazu lag bislang nicht vor.',
        'Die Ankündigung bewegte sofort die Börse. Aktien von Autobauern sprangen deutlich nach oben. Auch der Dax legte am Mittag zu. Frankreichs Präsident Macron hatte sich bislang gegen eine Lockerung gesperrt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein regulatorisches Signal wirkt direkt auf einzelne Branchen – wer in einen breiten Index wie den Dax investiert, trägt solche Sektorschwankungen automatisch mit, ohne sie wählen zu können.',
      relatedTopics: ['aktien-laender-branchen', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'volkswagen', 'mercedes-benz'],
      sources: [
        {
          label:
            'Tagesschau, 16.10.2026, 13:48 Uhr: „Deutschland und Frankreich einig bei Lockerung von Verbrenner-Aus“',
          url: 'https://www.tagesschau.de/wirtschaft/energie/frankreich-deutschland-verbrenner-aus-einigung-100.html',
        },
        {
          label:
            'Tagesschau, 16.10.2026, 14:17 Uhr: „Auto-Aktien steigen nach deutsch-französischer Einigung deutlich“',
          url: 'https://www.tagesschau.de/wirtschaft/finanzen/autobauer-verbrenneraus-marktbericht-100.html',
        },
      ],
    },
    {
      headline: 'Baugenehmigungen steigen im August, Stimmung am Bau bleibt gedrückt',
      summary: [
        'Der deutsche Wohnungsbau zieht an. Im August stieg die Zahl der Baugenehmigungen für Wohnungen um fast sieben Prozent. Mehr Ein- und Mehrfamilienhäuser wurden genehmigt als zuvor. Der Aufwärtstrend aus dem ersten Halbjahr setzt sich damit fort.',
        'Doch steigende Finanzierungskosten bremsen die Branche. Das Geschäftsklima im Wohnungsbau verschlechterte sich zuletzt weiter. Höhere Zinsen und stornierte Aufträge belasten viele Bauherren.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Baugenehmigungen sind ein Frühindikator: Sie zeigen, was gebaut werden darf, nicht was tatsächlich gebaut wird – zwischen Genehmigung und Fertigstellung vergehen oft Jahre.',
      relatedTopics: ['immobilien', 'schulden-und-kredit'],
      relatedSymbols: ['vonovia'],
      sources: [
        {
          label:
            'WirtschaftsWoche, 16.10.2026, 07:47 Uhr GMT: „Wohnungsbau: Baugenehmigungen für Wohnungen steigen im August um fast sieben Prozent“',
          url: 'https://www.wiwo.de/finanzen/immobilien/wohnungsbau-baugenehmigungen-steigen-im-august-um-fast-sieben-prozent/100262757.html',
        },
        {
          label:
            'Tagesschau, 16.10.2026, 11:29 Uhr: „Wohnimmobilien: Deutlich mehr Baugenehmigungen“',
          url: 'https://www.tagesschau.de/wirtschaft/baugenehmigungen-steigen-wieder-2026-100.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'MSCI droht Indonesien mit Rauswurf aus dem Schwellenländer-Index',
      summary: [
        'Der Indexanbieter MSCI prüft einen Rauswurf. Betroffen ist Indonesiens Status als Schwellenland im MSCI-Index. Die Börse in Jakarta brach daraufhin stark ein. Laut FAZ war es der stärkste Einbruch seit der Asienkrise.',
        'Grund sind nach Handelsblatt-Angaben unzureichende Reformen zur Markttransparenz. Das trifft auch bekannte Indonesien-ETFs, die den Index nachbilden. Ein Entzug des Schwellenland-Status würde viele Fonds zu Verkäufen zwingen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Entzug des Schwellenland-Status wirkt wie ein erzwungener Verkauf: Passive ETFs, die den MSCI-Index nachbilden, müssen die Aktien automatisch abstoßen – unabhängig vom tatsächlichen Wert des Unternehmens.',
      relatedTopics: ['etf', 'risiko-und-rendite'],
      relatedSymbols: ['etf-em-imi'],
      sources: [
        {
          label:
            'Handelsblatt, 16.10.2026, 10:54 Uhr GMT: „Südostasien: MSCI droht Indonesien mit Index-Rauswurf – Börse verliert heftig“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/suedostasien-msci-droht-indonesien-mit-index-rauswurf-boerse-verliert/100262750.html',
        },
        {
          label:
            'FAZ, 16.10.2026, 09:57 Uhr GMT: „Börse: Indonesien erhält nächsten Warnschuss von MSCI“',
          url: 'https://www.faz.net/aktuell/finanzen/finanzmarkt/msci-prueft-indonesiens-schwellenland-status-boerse-bricht-ein-accg-201528065.html',
        },
      ],
    },
  ],
}
