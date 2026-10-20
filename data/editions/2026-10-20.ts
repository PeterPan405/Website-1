import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-20.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-20 00:22 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-20',
  intro:
    'Die Bundesbank erwartet noch bis 2027 hohe Inflation, Unruhen in Frankreich belasten den Euro, Chinas Wachstum überrascht, und der Ölpreis gibt nach.',
  top: [
    {
      headline: 'Bundesbank erwartet noch bis 2027 hohe Inflation',
      summary: [
        'Die Deutsche Bundesbank rechnet nach eigenen Worten nicht mit einer schnellen Entspannung bei den Verbraucherpreisen. Im aktuellen Monatsbericht schreibt die Notenbank, die Inflation in Deutschland bleibe „merklich erhöht“ – und zwar bis weit in das Jahr 2027 hinein.',
        'Getragen wird die Teuerung laut Bundesbank vor allem von Treibstoff- und Dienstleistungspreisen. Diese Kosten geben Unternehmen nach Einschätzung der Notenbank nur langsam an ihre Kunden weiter, weshalb sich der Preisdruck über mehrere Jahre zieht statt rasch abzuklingen.',
      ],
      category: 'Geldpolitik',
      whyItMatters:
        'Der Monatsbericht ist keine Zinsentscheidung – die trifft die EZB. Er zeigt aber, wie die deutsche Notenbank die Lage einschätzt, bevor die EZB ihre nächste Entscheidung trifft, und das prägt die Erwartungen an den Märkten.',
      relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'Handelsblatt, 19.10.2026, 12:45 Uhr MESZ: „Monatsbericht: Bundesbank sieht starken Preisdruck bis ins Jahr 2027“',
          url: 'https://www.handelsblatt.com/finanzen/geldpolitik/bundesbank-inflation-bleibt-bis-ins-naechste-jahr-hinein-merklich-erhoeht/100263257.html',
        },
      ],
    },
    {
      headline: 'Unruhen in Frankreich drücken Euro unter 1,12 Dollar',
      summary: [
        'In Frankreich kam es am Wochenende zu gewaltsamen Protesten. Das belebte an den Finanzmärkten die Sorge um die Staatsfinanzen neu, berichtet die Tagesschau. Der Euro fiel am Montag zeitweise unter die Marke von 1,12 Dollar.',
        'Investoren verlangten für französische Staatsanleihen einen weiter wachsenden Aufschlag gegenüber deutschen Bundesanleihen, meldet das Handelsblatt. Der Dax schloss den Tag deutlich im Minus.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Der Zinsaufschlag zwischen französischen und deutschen Anleihen zeigt, wie teuer sich ein Land am Kapitalmarkt verschulden kann – ein wachsender Abstand verteuert künftige Kredite des Staates zusätzlich.',
      relatedTopics: ['staatsanleihe', 'waehrungen-wechselkurse'],
      relatedSymbols: ['cac-40', 'eur-usd'],
      sources: [
        {
          label:
            'Tagesschau, 19.10.2026, 14:05 Uhr MESZ: „Marktbericht: Sorgen um Frankreich belasten den Euro“',
          url: 'https://www.tagesschau.de/wirtschaft/finanzen/marktbericht-frankreich-proteste-euro-100.html',
        },
        {
          label:
            'Handelsblatt, 19.10.2026, 15:49 Uhr MESZ: „Investoren: Französische Staatsanleihen nach Unruhen unter Druck“',
          url: 'https://www.handelsblatt.com/finanzen/maerkte/anleihen/investoren-franzoesische-staatsanleihen-nach-unruhen-unter-druck/100263262.html',
        },
      ],
    },
    {
      headline: 'Chinas Wirtschaft wächst stärker als erwartet',
      summary: [
        'Chinas Wirtschaft ist im dritten Quartal überraschend kräftig gewachsen. Das Bruttoinlandsprodukt legte im Jahresvergleich um 4,5 Prozent zu und übertraf damit die Erwartungen der Ökonomen, berichtet CNBC unter Berufung auf amtliche Zahlen aus Peking.',
        'Getragen wurde das Wachstum vor allem von der Auslandsnachfrage nach chinesischen Technologiegütern. Der Konsum der privaten Haushalte im Inland blieb dagegen weiterhin schwach.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wächst eine Volkswirtschaft vor allem über den Export, hängt sie stärker von fremden Entscheidungen ab, etwa neuen Zöllen – ein kräftiger Binnenkonsum gilt als robusterer, weil unabhängigerer Wachstumstreiber.',
      relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite'],
      relatedSymbols: ['hang-seng'],
      sources: [
        {
          label:
            "CNBC, 19.10.2026, 06:36 Uhr MESZ: „China's third-quarter economic growth quickens to 4.5% as exports surge, beating estimates“",
          url: 'https://www.cnbc.com/2026/10/19/chinas-economic-growth-quickens-to-4point6percent-as-exports-surge-stimulus-rolls-out.html',
        },
      ],
    },
    {
      headline: 'Ölpreis fällt zurück unter die 110-Dollar-Marke',
      summary: [
        'Der Ölpreis ist zum Wochenstart zurückgerudert. Die Sorte Brent entfernte sich am Montag wieder von der 110-Dollar-Marke, die sie erst vorige Woche übersprungen hatte, meldet die WirtschaftsWoche.',
        'Auslöser war laut wallstreet-online, dass US-Präsident Donald Trump die Sanktionen gegen Russland gelockert hat – trotz neuer Angriffe. Vorige Woche hatten noch Zweifel an einem Diesel-Deal zwischen Trump und Russland den Preis über 110 Dollar getrieben.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Innerhalb einer Woche bewegte derselbe politische Streitpunkt den Ölpreis zweimal in verschiedene Richtungen – ein Beispiel dafür, wie viel stärker Schlagzeilen kurzfristig wirken können als Angebot und Nachfrage.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'WirtschaftsWoche, 19.10.2026, 08:23 Uhr MESZ: „Energiekrise: Ölpreise geben nach – Brent entfernt sich wieder von 110-Dollar-Marke“',
          url: 'https://www.wiwo.de/finanzen/boerse/energiekrise-oelpreise-geben-nach-brent-entfernt-sich-wieder-von-110-dollar-marke/100263165.html',
        },
        {
          label:
            'wallstreet-online, 19.10.2026: „Trotz neuer Angriffe: Ölpreise sinken nach Trumps Lockerung der Russland-Sanktionen“',
          url: 'https://www.wallstreet-online.de/nachricht/21544433-trotz-angriffe-oelpreise-sinken-trumps-lockerung-russland-sanktionen',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Volkswagen friert laut Berichten die Gehälter ein',
      summary: [
        'Volkswagen verschärft offenbar seine Sparmaßnahmen. Nach übereinstimmenden Medienberichten will der Konzern die Gehälter weltweit für mehrere Jahre einfrieren, berichtet die Tagesschau.',
        'Der Konzern wollte sich zu den Berichten nicht äußern. Bestätigt ist der Schritt damit nicht, er beruht auf Angaben mehrerer Medien.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine Gehaltsbremse spart Personalkosten, ohne Stellen zu streichen – ein anderer Hebel als der sonst übliche Stellenabbau, mit dem Autokonzerne zuletzt häufiger sparten.',
      relatedTopics: ['aktie', 'aktien-laender-branchen'],
      relatedSymbols: ['volkswagen'],
      sources: [
        {
          label:
            'Tagesschau, 19.10.2026, 13:27 Uhr MESZ: „Volkswagen will offenbar Gehälter einfrieren“',
          url: 'https://www.tagesschau.de/wirtschaft/unternehmen/vw-1620.html',
        },
      ],
    },
  ],
}
