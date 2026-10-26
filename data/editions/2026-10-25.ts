import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-25.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Ohne gesammelte Quellendatei erzeugt – die Herkunft steht an jedem Artikel.
 */
export const edition: DailyEdition = {
  date: '2026-10-25',
  intro:
    'Fed und EZB entscheiden diese Woche über ihren Leitzins, Frankreich steuert auf eine Haushaltsdebatte zu, und Audi baut sein erstes eigenes US-Werk.',
  top: [
    {
      headline: 'Fed und EZB entscheiden in der Woche der großen Tech-Bilanzen',
      summary: [
        'Die US-Notenbank entscheidet am Mittwoch über ihren Leitzins.',
        'Sie dürfte ihn in der Spanne von 3,75 bis 4,00 Prozent belassen.',
        'Einen Tag später tagt die Europäische Zentralbank.',
        'Auch sie dürfte zunächst eine Pause einlegen.',
        'Am Dienstag legt zunächst Coca-Cola seine Quartalszahlen vor.',
        'Am Mittwoch folgen Alphabet und Microsoft, am Donnerstag Amazon und Intel.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein Zinsentscheid, der wie erwartet ausfällt, bewegt oft weniger als ein Quartalsbericht, der von der eingepreisten Erwartung abweicht.',
      relatedTopics: ['notenbanken-geldpolitik'],
      relatedSymbols: ['alphabet', 'microsoft', 'amazon', 'intel'],
      sources: [
        {
          label:
            'WirtschaftsWoche, Finanzen, Sören Imöhl, Live-Ticker vom 23.10.2026, 16:01 Uhr: „Ölpreis aktuell: Ölpreise steigen weiter – Fed-Zinsentscheid im Fokus“',
          url: 'https://www.wiwo.de/finanzen/oelpreis-aktuell-oelpreise-steigen-weiter-fed-zinsentscheid-im-fokus/100207502.html',
        },
        {
          label:
            'wallstreetONLINE, Earnings Preview, Stand 25.10.2026, 10:00 Uhr: „Retten Alphabet, Microsoft und Amazon den Markt jetzt vor dem Totalabsturz?“',
          url: 'https://www.wallstreet-online.de/nachricht/21552146-earnings-preview-retten-alphabet-microsoft-amazon-markt-totalabsturz',
        },
      ],
    },
    {
      headline: 'Frankreich: Massenproteste vor Haushaltsdebatte, EZB tagt unter Druck',
      summary: [
        'In Frankreich gingen am Samstag erneut Hunderttausende auf die Straße.',
        'Das Innenministerium zählte 410.000 Teilnehmer, die Gewerkschaft CGT rund 800.000.',
        'Am Dienstag nimmt die Nationalversammlung die Haushaltsdebatte wieder auf.',
        'Die Regierung will das Defizit 2027 auf 5 Prozent der Wirtschaftsleistung senken.',
        'Die Europäische Zentralbank entscheidet am Donnerstag über ihren Leitzins.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Ein Instrument wie Artikel 49.3 kann eine Regierung handlungsfähig halten, löst aber den eigentlichen Streit über den Haushalt nicht.',
      relatedTopics: ['staatsanleihe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['cac-40'],
      sources: [
        {
          label:
            'CNBC, Markets, Hugh Leask, Meldung vom 24.10.2026 (aktualisiert 25.10.2026): „What next for France as riots rattle markets?“',
          url: 'https://www.cnbc.com/2026/10/24/france-riots-paris-unrest-debt-budget.html',
        },
        {
          label:
            'FAZ.NET, Finanzen, Christian Siedenbiedel, Meldung vom 23.10.2026, 17:08 Uhr: „Oktober-Zinssitzung: Frankreich stellt die EZB auf die Probe“',
          url: 'https://www.faz.net/aktuell/finanzen/geldpolitik-frankreich-krise-stellt-ezb-auf-die-probe-201614455.html',
        },
      ],
    },
    {
      headline: 'Audi kündigt erstes eigenes US-Werk an',
      summary: [
        'Audi hat auf einer Trump-Wahlkampfveranstaltung ein neues SUV-Werk in Georgia angekündigt.',
        'Geplant sind rund 4.500 Arbeitsplätze und eine Investition von vier Milliarden Dollar.',
        'Der Baubeginn ist für 2027 vorgesehen, die Produktion soll Anfang der 2030er Jahre starten.',
        'Es ist das erste eigene US-Werk der Marke.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zwischen Ankündigung und erstem Fahrzeug liegen nach eigenen Angaben rund sechs Jahre – ein Zeitraum, der weit über einen Wahlkampf hinausreicht.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label:
            'wallstreetONLINE, dpa-AFX, Meldung vom 25.10.2026, 08:35 Uhr: „ROUNDUP/Auf Trump-Wahlkampftour: Audi kündigt SUV-Werk in den USA an“',
          url: 'https://www.wallstreet-online.de/nachricht/21576985-roundup-auf-trump-wahlkampftour-audi-kuendigt-suv-werk-usa',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'PHP-Sicherheitslücke: IT-Branche spricht von „Black October“',
      summary: [
        'Weltweit haben Cybersicherheitsteams kritische Lücken in der Programmiersprache PHP geschlossen.',
        'Nach Schätzungen läuft fast 70 Prozent aller Websites mit PHP.',
        'Die Schwachstellen wurden am Dienstag vergangener Woche öffentlich bekannt.',
        'Updates folgten bereits am nächsten Tag.',
        'Das Bundesamt für Sicherheit in der Informationstechnik rät zu zusätzlicher Überwachung.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass eine einzelne Schwachstelle weltweit Behörden gleichzeitig beschäftigt, zeigt eine Kehrseite geteilter Software: ein gemeinsam getragenes Risiko.',
      relatedTopics: ['risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            "CNBC, Tech, Ashley Capoot, Meldung vom 23.10.2026, 11:17 Uhr EDT: „AI's 'Black October': Critical PHP flaws set off global security scramble“",
          url: 'https://www.cnbc.com/2026/10/23/php-vulnerabilities-ai-cybersecurity.html',
        },
        {
          label:
            'Tagesschau, Wirtschaft/Digitales, Meldung vom 23.10.2026, 12:47 Uhr: „PHP-Sicherheitslücke: IT-Experten fordern Maßnahmen über Updates hinaus“',
          url: 'https://www.tagesschau.de/wirtschaft/digitales/it-sicherheit-php-100.html',
        },
      ],
    },
    {
      headline: 'Amgen-Studie beflügelt die Rallye der Biotech-Aktien',
      summary: [
        'Eine Studie zeigt starke Ergebnisse für Amgens Lungenkrebs-Kombitherapie.',
        'Das Sterberisiko sank in Kombination mit Imfinzi um 58 Prozent.',
        'Der Biotech-Index iShares Biotechnology ETF legte seit Jahresbeginn um 24 Prozent zu.',
        'Moderna führt die Liste mit einem Kursplus von 587 Prozent in diesem Jahr an.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Während Technologie- und KI-Aktien unter Druck standen, lief der Biotech-Sektor in die andere Richtung – ein Beispiel für Streuung über Sektoren.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['astrazeneca'],
      sources: [
        {
          label:
            'CNBC, Health and Science, Annika Kim Constantino, Meldung vom 24.10.2026, 10:30 Uhr EDT: „Amgen says drug combo cuts risk of death by 58% in patients with aggressive lung cancer“',
          url: 'https://www.cnbc.com/2026/10/24/amgen-imdelltra-lung-cancer-data.html',
        },
        {
          label:
            'CNBC, Pro Analysis, Paulina Likos, Meldung vom 24.10.2026, 9:10 Uhr EDT: „Biotech stocks are surging. How investors can play the new drug innovation boom“',
          url: 'https://www.cnbc.com/2026/10/24/biotech-stocks-drug-innovation-rally.html',
        },
      ],
    },
  ],
}
