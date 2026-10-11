import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-10-11.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-10-11 13:07 UTC
 */
export const edition: DailyEdition = {
  date: '2026-10-11',
  intro:
    'Trump und Putin einigen sich auf Diesel-Mengen, Russland greift erneut Saporischschja an, und eine Huthi-Rakete trifft den Flughafen Riad.',
  top: [
    {
      headline: 'Diesel-Deal mit Russland: Die Zahlen sind da, die Kritik auch',
      summary: [
        'Russland liefert künftig deutlich mehr Diesel an die USA. Nach Angaben von Donald Trump kommen sofort mehr als 300.000 Tonnen, bis Jahresende sollen insgesamt rund 4,8 Millionen Tonnen folgen. Das US-Finanzministerium setzte die Sanktionen auf russischen Diesel dafür befristet aus.',
        'Mehrere demokratische Senatoren sprachen von einem Verrat an der Ukraine. Präsident Selenskyj nannte es eine schwache Entscheidung starker Partner.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Mehr Diesel-Angebot kann die Preise an der Tankstelle dämpfen, lockert aber zugleich einen Teil des Sanktionsdrucks auf Russlands Energieexporte.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 11.10.2026, 11:05 Uhr (dpa-AFX): „ROUNDUP 3: Empörung wegen Diesel-Deal von Trump und Putin“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'The Atlanta Journal-Constitution (AP), 9.10.2026: „Trump strikes deal with Putin for Russian diesel in sharp reversal of US policy ahead of midterms“',
          url: 'https://www.ajc.com/news/2026/10/trump-strikes-deal-with-putin-for-russian-diesel-in-sharp-reversal-of-us-policy-ahead-of-midterms/',
        },
      ],
    },
    {
      headline: '23 Tote nach russischem Angriff auf Saporischschja',
      summary: [
        'Russland hat die ukrainische Stadt Saporischschja angegriffen. Die Zahl der Toten stieg auf 23, darunter vier Kinder. Das teilte Präsident Selenskyj nach Abschluss der Rettungsarbeiten mit.',
        'Russland griff in derselben Nacht auch eine Klinik in Charkiw sowie Energieanlagen an. Selenskyj bot im Gegenzug an, Angriffe auf russische Raffinerien zu stoppen – vorausgesetzt, Russland lässt die ukrainische Energieversorgung in Ruhe.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die Drohung, russische Raffinerien anzugreifen, berührt auch die weltweite Versorgung mit Diesel und Benzin – unabhängig vom separat verhandelten Diesel-Deal mit den USA.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 11.10.2026, 10:49 Uhr (dpa-AFX): „Angriff auf Saporischschja: Zahl der Toten steigt auf 23“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'ad-hoc-news.de, dpa-AFX-Meldung vom 11.10.2026, 14:46 Uhr: „Angriff auf Saporischschja: Zahl der Toten steigt auf 23“',
          url: 'https://www.ad-hoc-news.de/wirtschaft/angriff-auf-saporischschja-zahl-der-toten-steigt-auf-23/70292622',
        },
      ],
    },
    {
      headline: 'Zwölf Tote bei Huthi-Angriff auf Flughafen in Riad',
      summary: [
        'Eine Rakete traf einen Terminal des Flughafens in Riad. Mindestens zwölf Menschen starben, mehr als 300 wurden verletzt. Das meldete die saudische Luftfahrtbehörde.',
        'Das saudisch geführte Militärbündnis macht die Huthi-Miliz verantwortlich. Die USA prüfen laut saudischen Angaben eine Beteiligung an Gegenangriffen, Außenminister Rubio verurteilte den Angriff scharf.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Ausfall des wichtigsten saudischen Flughafens kann kurzfristig auch den Ölhandel in der Golfregion stören, selbst wenn Förderanlagen nicht direkt betroffen sind.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'wti'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 11.10.2026, 11:35 Uhr (dpa-AFX): „Mindestens zwölf Tote bei Angriff auf Flughafen in Riad“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'aero.de, 11.10.2026: „Zwölf Tote bei Angriff auf Flughafen Riad“',
          url: 'https://www.aero.de/news-53895/Zwoelf-Tote-bei-Angriff-auf-Flughafen-Riad.html',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Diese Woche startet die große US-Berichtssaison',
      summary: [
        'Diese Woche beginnt die US-Quartalssaison. JPMorgan Chase und Johnson & Johnson legen ihre Zahlen vor, auch BlackRock, ASML und TSMC berichten in den kommenden Tagen. Das meldet wallstreet-online unter Berufung auf den Terminkalender der Woche.',
        'Am Montag tagt zudem der IWF, mehrere Notenbanker treten öffentlich auf.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Die ersten Ausblicke großer Unternehmen gelten oft als Stimmungstest für die gesamte Berichtssaison, unabhängig vom eigentlichen Quartalsergebnis.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['jpmorgan', 'johnson-johnson', 'blackrock', 'asml', 'tsmc'],
      sources: [
        {
          label:
            'wallstreet-online, Nachrichtenübersicht vom 11.10.2026: „Diese in den kommenden Tagen (KW42) anstehenden US-Quartalszahlen müssen Anlegerinnen und Anleger kennen“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Deutsche-Bank-Chef Sewing fordert erneut mehr Reformtempo',
      summary: [
        'Deutsche-Bank-Chef Christian Sewing drängt die Bundesregierung erneut zu mehr Tempo. Das meldete dpa-AFX am Sonntagmorgen, ohne den genauen Wortlaut zu nennen.',
        'Sewing hatte zuletzt wiederholt mehr Tempo und mehr Mut bei den Reformen verlangt. Hintergrund ist ein 34 Punkte umfassendes Reformpaket von Union und SPD aus dem Juli.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Rufe nach Reformtempo aus der Finanzbranche sagen nichts über die Umsetzung – aber sie zeigen, wie ungeduldig große Unternehmen mit der Politik sind.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['deutsche-bank'],
      sources: [
        {
          label:
            'onvista, News-Ticker vom 11.10.2026, 10:49 Uhr (dpa-AFX): „Deutsche-Bank-Chef Sewing fordert mehr Tempo bei Reformen“',
          url: 'https://www.onvista.de/news/',
        },
        {
          label:
            'ms-aktuell.de: „Deutsche-Bank-Chef Sewing erhöht den Druck auf die Bundesregierung“',
          url: 'https://ms-aktuell.de/?p=155452',
        },
      ],
    },
    {
      headline: 'Gold nähert sich 4.200 Dollar, Spekulanten bauen ab',
      summary: [
        'Der Goldpreis rückt wieder näher an 4.200 Dollar heran. Noch am Dienstag hatte er bei rund 4.100 Dollar gelegen. Das zeigen die Marktberichte von Goldreporter.',
        'Gleichzeitig bauen große Spekulanten am Terminmarkt laut Goldreporter ihre Netto-Long-Positionen weiter ab, auch das Open Interest sinkt. Konkrete Kontraktzahlen nennt die Übersicht nicht.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Steigt ein Preis, während sich Spekulanten zurückziehen, trägt häufiger reale Nachfrage den Kurs als kurzfristige Wetten am Terminmarkt.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label:
            'goldreporter.de, Startseite „Top-News“, Stand 11.10.2026: „Goldmarkt: Spekulanten bauen Positionen weiter ab – Open Interest sinkt“ / „Goldpreis heute: Kräftiger Anstieg Richtung 4.200 USD“',
          url: 'https://www.goldreporter.de/',
        },
        {
          label:
            'wallstreet-online, Rohstoffpreise, Stand 11.10.2026, 13:07 Uhr: Gold 4.195,82 USD',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
