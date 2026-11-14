import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-11-14.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-11-14 01:34 UTC
 */
export const edition: DailyEdition = {
  date: '2026-11-14',
  intro:
    'US-Erzeugerpreise treiben die Zinsdebatte, ein Ground Stop legt US-Flughäfen lahm, Microsoft entschuldigt sich – und Anthropics IPO ist sechsfach überzeichnet.',
  top: [
    {
      headline: 'US-Erzeugerpreise steigen auf höchste Jahresrate seit vier Jahren',
      summary: [
        'Die US-Erzeugerpreise sind im Oktober gestiegen.',
        'Der Anstieg lag bei 0,3 Prozent zum Vormonat, Ökonomen hatten 0,4 Prozent erwartet.',
        'Im Jahresvergleich kletterte die Rate auf 6,5 Prozent, den höchsten Stand seit fast vier Jahren.',
        'Der Chicagoer Fed-Präsident Austan Goolsbee sagte, die Notenbank habe bei der Inflation weiter Arbeit vor sich.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Erzeugerpreise gelten als Frühindikator für die Verbraucherpreise, weil Unternehmen gestiegene Einkaufskosten häufig an ihre Kunden weitergeben.',
      relatedTopics: ['notenbanken-geldpolitik', 'inflation'],
      relatedSymbols: ['sp500', 'dow-jones'],
      sources: [
        {
          label:
            'CNBC, News-Ticker vom 13.11.2026, 16:44 Uhr: „Wholesale prices rose 0.3% in October, putting annual rate at 6.5%, the highest in nearly four years“',
          url: 'https://www.cnbc.com/2026/11/13/ppi-inflation-report-october-2026.html',
        },
        {
          label:
            'Handelsblatt, News-Ticker vom 13.11.2026, 20:11 Uhr: „Wall Street: Wall Street schließt uneinheitlich – Erzeugerpreise steigen weiter“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dow-jones-sp-500-nasdaq-wall-street-schliesst-uneinheitlich-erzeugerpreise-steigen-weiter/100269764.html',
        },
      ],
    },
    {
      headline: 'USA stoppen landesweit alle Flugstarts für vier Stunden',
      summary: [
        'Die USA haben am Freitag landesweit alle Flugstarts gestoppt.',
        'Auslöser war eine Störung in der Telekommunikation mehrerer Flugsicherungszentren.',
        'Die Behörde hob den Stopp nach gut vier Stunden wieder auf.',
        'Mehr als 10.000 Flüge gerieten in Verzug, rund 600 wurden umgeleitet.',
        'Die Fluggesellschaft JetBlue strich zahlreiche Flüge bis weit ins Wochenende.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein einzelner technischer Ausfall kann tagelange Folgewirkungen auslösen, weil Flugzeuge und Besatzungen erst wieder an ihren vorgesehenen Plätzen im Netz stehen müssen.',
      relatedTopics: [],
      relatedSymbols: [],
      sources: [
        {
          label:
            'CNBC, News-Ticker vom 14.11.2026, 02:21 Uhr: „FAA lifts ground stop after four hours, but flight cancellations will stretch into the weekend“',
          url: 'https://www.cnbc.com/2026/11/13/faa-ground-stop.html',
        },
        {
          label:
            'onvista (dpa-AFX), News-Ticker vom 13.11.2026, 21:48 Uhr: „ROUNDUP: Landesweiter Stopp von Starts an US-Flughäfen“',
          url: 'https://www.onvista.de/news/2026/11-13-roundup-landesweiter-stopp-von-starts-an-us-flughaefen-0-10-26576275',
        },
      ],
    },
    {
      headline: 'Microsoft entschuldigt sich für Dienste-Ausfall',
      summary: [
        'Microsoft hat sich für seinen weltweiten Dienste-Ausfall entschuldigt.',
        'Betroffen waren seit Donnerstag Outlook, Teams und weitere 365-Anwendungen.',
        'Am Freitagabend meldete der Konzern deutliche Verbesserung, vor allem in Nordamerika und Europa.',
        'IT-Sicherheitsexperte Dennis-Kenji Kipker forderte danach mehr digitale Souveränität von Unternehmen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Entschuldigung ersetzt keine Entschädigung: Ob und wie viel Kunden erhalten, hängt von vertraglich vereinbarten Verfügbarkeits- und Entschädigungsregeln ab.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['microsoft'],
      sources: [
        {
          label:
            'CNBC, News-Ticker vom 13.11.2026, 19:18 Uhr: „Microsoft apologizes for massive outage that took down Outlook and other 365 services“',
          url: 'https://www.cnbc.com/2026/11/12/microsoft-outage-outlook-aws-google.html',
        },
        {
          label:
            "Tagesschau, 13.11.2026, 21:21 Uhr: „IT-Störungen: Microsoft sieht 'deutliche Verbesserung' der Lage“",
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/microsoft-outlook-stoerung-100.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Neues Altersvorsorgedepot soll ab 2027 die Riester-Rente ablösen',
      summary: [
        'Die Riester-Rente bekommt ab 2027 einen Nachfolger.',
        'Das neue Altersvorsorgedepot soll weiter staatlich gefördert werden.',
        'Ökonom Martin Werding nannte die Reform einen Riesenschritt in die richtige Richtung.',
        'Besitzer eines Riester-Vertrags müssen nun entscheiden, was mit ihrem alten Vertrag passiert.',
      ],
      category: 'Vorsorge',
      whyItMatters:
        'Die bisherige Riester-Rente setzte auf Beitragsgarantien, das Altersvorsorgedepot stärker auf Kapitalmarktrenditen – das bedeutet mehr Renditechancen, aber auch mehr Schwankung.',
      relatedTopics: ['rente'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, 13.11.2026, 04:00 Uhr: „Rente: Mit der Aktie ins Alter: Die zwölf wichtigsten Antworten zum Vorsorgedepot“',
          url: 'https://www.handelsblatt.com/finanzen/vorsorge/altersvorsorge-sparen/rente-die-zwoelf-wichtigsten-antworten-zum-altersvorsorgedepot/100265976.html',
        },
        {
          label:
            'WirtschaftsWoche, 13.11.2026, 07:16 Uhr: „Altersvorsorgedepot: Was Sie mit dem alten Riestervertrag machen sollten“',
          url: 'https://www.wiwo.de/finanzen/vorsorge/altersvorsorgedepot-was-sie-mit-dem-alten-riestervertrag-machen-sollten/100268653.html',
        },
      ],
    },
    {
      headline: 'Anthropic-Börsengang laut Bericht schon sechsfach überzeichnet',
      summary: [
        'Der Börsengang von Anthropic ist einem Bericht zufolge sechsfach überzeichnet.',
        'Es könnte der größte Börsengang der Geschichte werden.',
        'Anthropic hatte zuvor eine Preisspanne von 70 bis 78 Dollar je Aktie genannt.',
        'Mitarbeiter dürfen anders als sonst üblich schon am ersten Handelstag eigene Aktien verkaufen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Dass Mitarbeiter schon am ersten Handelstag verkaufen dürfen, bricht mit der üblichen Praxis fester Haltefristen nach einem Börsengang und kann zusätzlichen Verkaufsdruck erzeugen.',
      relatedTopics: ['boerse', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'Handelsblatt, 13.11.2026, 08:12 Uhr: „KI: Anthropic-Börsengang offenbar schon sechsfach überzeichnet“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/ki-anthropic-boersengang-offenbar-schon-sechsfach-ueberzeichnet/100269621.html',
        },
        {
          label:
            'WirtschaftsWoche, 13.11.2026, 10:05 Uhr: „Anthropic-Aktie: IPO wohl sechsfach überzeichnet – die wichtigsten Antworten zu Anthropics Börsengang“',
          url: 'https://www.wiwo.de/finanzen/boerse/anthropic-ipo-die-wichtigsten-antworten-zur-aktie-des-ki-entwicklers/100268848.html',
        },
      ],
    },
  ],
}
