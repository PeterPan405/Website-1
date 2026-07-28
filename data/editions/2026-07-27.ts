import type { DailyEdition } from './types'

/**
 * Ausgabe vom 27. Juli 2026.
 *
 * Ein Tag mit einem beherrschenden Thema: Die Waffenpause zwischen den USA und
 * Iran ordnet fast alles andere. Der Ölpreis fällt, die Aktienmärkte springen,
 * und die eigentlich wichtigen Termine der Woche – Fed am Mittwoch, die
 * Quartalszahlen der vier größten US-Technologiekonzerne – stehen noch bevor.
 */
export const edition: DailyEdition = {
  date: '2026-07-27',
  intro:
    'Die Waffenpause zwischen USA und Iran lässt den Ölpreis einbrechen und den DAX springen. Voraus liegen der Fed-Entscheid und die dichteste Berichtswoche.',
  top: [
    {
      headline: 'DAX eröffnet mit einer Kurslücke und steigt auf 25.500 Punkte',
      summary: [
        'Der DAX ist am Montag mit einem Sprung in die Woche gestartet: Nach 25.069 Punkten zum Freitagsschluss notierte er vorbörslich bereits um 25.350 und lag zur Mittagszeit rund 1,6 Prozent im Plus bei etwa 25.500 Punkten – dem höchsten Stand seit fast drei Wochen.',
        'Auslöser ist die Waffenpause zwischen den USA und Iran. Nach dreizehn aufeinanderfolgenden Nächten mit Luftangriffen haben beide Seiten ihre Angriffe über das Wochenende ausgesetzt.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zwischen Freitagsschluss und Montagseröffnung wurde nicht gehandelt – den Sprung konnte niemand mitnehmen, der vorher ausgestiegen war. Genau daran scheitert Markttiming: Die entscheidenden Tage folgen auf schlechte Nachrichten und sind vorher nicht erkennbar.',
      relatedTopics: ['boerse', 'wann-kaufen-verkaufen', 'anlegerpsychologie'],
      relatedSymbols: ['dax', 'euro-stoxx-50'],
      sources: [
        {
          label: 'wallstreetONLINE: DAX – Gap-up! (27.07.2026)',
          url: 'https://www.wallstreet-online.de/nachricht/21154226-dax-gap-up',
        },
        {
          label: 'Handelsblatt: Dax erreicht den höchsten Stand seit fast drei Wochen',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-erreicht-den-hoechsten-stand-seit-fast-drei-wochen/100243054.html',
        },
      ],
    },
    {
      headline: 'Ölpreis bricht um bis zu neun Prozent ein',
      summary: [
        'Brent verlor am Montag im frühen Handel 4,1 Prozent auf 92,12 US-Dollar je Barrel und rutschte zeitweise um mehr als sieben Prozent unter 90 Dollar; am Mittag lag der September-Kontrakt rund neun Prozent tiefer bei etwa 88 Dollar. Die US-Sorte WTI gab um 4,5 Prozent auf 84,72 Dollar nach.',
        'Gefördert wird deshalb kein Barrel mehr als vorher. Gesunken ist allein die erwartete Wahrscheinlichkeit einer Lieferstörung – und bei einem Rohstoff ohne Bewertungsanker schlägt das unmittelbar auf den Preis durch.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Gemessen am Jahresanfang notiert Brent trotz dieses Einbruchs immer noch mehr als 50 Prozent höher. Zu jeder Prozentzahl in einer Schlagzeile gehört ein Vergleichszeitpunkt – ohne ihn ist sie nicht falsch, sondern bedeutungslos.',
      relatedTopics: ['rohstoffe', 'inflation'],
      relatedSymbols: ['brent', 'wti', 'erdgas'],
      sources: [
        {
          label:
            'wallstreetONLINE: Eskalation gestoppt – Ölpreis fällt nach Waffenpause (27.07.2026)',
          url: 'https://www.wallstreet-online.de/nachricht/21153272-eskalation-gestoppt-oelpreis-faellt-waffenpause-usa-iran',
        },
        {
          label: 'Handelsblatt: Preise für Öl und Gas fallen nach Pause der US-Angriffe',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/devisen-rohstoffe/iran-krieg-preise-fuer-oel-und-gas-fallen-nach-pause-der-us-angriffe-deutlich/100243031.html',
        },
      ],
    },
    {
      headline: 'ifo-Geschäftsklima steigt auf 86,6 Punkte – die Lage fällt',
      summary: [
        'Der ifo-Geschäftsklimaindex ist im Juli auf 86,6 Punkte gestiegen, nach 85,7 im Juni; erwartet worden war ein unveränderter Wert. Der Anstieg kommt vollständig aus den Erwartungen, die um 2,4 Punkte auf 86,7 zulegten. Die Beurteilung der aktuellen Lage gab dagegen auf 86,5 Punkte nach.',
        'Das ifo-Institut nennt die Lage am Persischen Golf ausdrücklich weiter als Risiko. Die Umfrage lief vor der Waffenpause vom Wochenende.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Steigende Erwartungen bei fallender Lagebeurteilung sind kein Widerspruch, sondern die interessanteste Information: Die Geschäfte laufen heute schlechter, die Unternehmen rechnen aber mit Besserung. Aktienkurse bilden Erwartungen ab, nicht die Gegenwart.',
      relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label: 'ifo Institut: ifo Geschäftsklimaindex gestiegen (Juli 2026)',
          url: 'https://www.ifo.de/pressemitteilung/2026-07-27/ifo-geschaeftsklimaindex-gestiegen-juli-2026',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Fed entscheidet am Mittwoch – eine Pause ist eingepreist',
      summary: [
        'Der Offenmarktausschuss tagt Dienstag und Mittwoch; die Entscheidung kommt am Mittwoch um 20:00 Uhr deutscher Zeit. Der Leitzins liegt seit Dezember 2025 unverändert bei 3,50 bis 3,75 Prozent, und die eingepreiste Wahrscheinlichkeit einer weiteren Pause lag zuletzt bei knapp 78 Prozent.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Was erwartet wird, steckt bereits im Kurs. Bewegen wird die Märkte deshalb nicht der Zinsbeschluss, sondern jede Abweichung im Wortlaut. Für Tagesgeld in Euro ist ohnehin die EZB zuständig – sie hat am 23. Juli pausiert.',
      relatedTopics: ['notenbanken-geldpolitik', 'tagesgeld'],
      relatedSymbols: ['eur-usd', 'sp500'],
      sources: [
        {
          label: 'LBBW: Fed-Zinsentscheid – aktueller Leitzins und Prognose 2026',
          url: 'https://www.lbbw.de/artikel/maerkte-verstehen/fed-zinsentscheid-leitzins-prognosen_ait4a5bv66_d.html',
        },
      ],
    },
    {
      headline: 'Microsoft, Meta, Apple und Amazon berichten diese Woche',
      summary: [
        'Nach US-Börsenschluss legen am Mittwoch Microsoft und Meta ihre Quartalszahlen vor, am Donnerstag folgen Apple und Amazon. In Deutschland berichten elf DAX-Konzerne; den Auftakt machen am Montag unter anderem AstraZeneca, LVMH und Hochtief.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die vier US-Konzerne gehören zu den schwersten Werten im S&P 500 und damit auch in jedem weltweit streuenden ETF – wer breit gestreut anlegt, hält von ihnen mehr, als die Zahl der Titel vermuten lässt. Ein Grund, die Aufteilung zu ändern, ist eine Quartalsmeldung trotzdem nicht.',
      relatedTopics: ['aktie', 'etf'],
      relatedSymbols: ['microsoft', 'meta', 'apple', 'amazon'],
      sources: [
        {
          label:
            'boersennews: Wochenvorschau KW 31 – Apple, Microsoft, Meta und der Fed-Entscheid',
          url: 'https://www.boersennews.de/nachrichten/service/community/wochenvorschau-kw-31-rekorddichte-berichtswoche-apple-microsoft-meta-und-der-fed-entscheid/5220495/',
        },
      ],
    },
  ],
}
