import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-01.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-01 00:59 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-01',
  intro:
    'DAX rutscht nach dem Rekordhoch ab, Öl springt über 90 Dollar, Gold gibt nach – und heute startet der Rückkauf bei Mercedes-Benz.',
  top: [
    {
      headline:
        'DAX fällt nach Rekordlauf zurück – heute liefern Konjunkturdaten und G20 neue Signale',
      summary: [
        'Nach dem Rekordhoch vom Freitag ist der DAX am Montag gefallen; finanzen.net nennt steigende Zinssignale und höhere Ölpreise als Bremsen, beim Abruf stand der Index bei 26.258 Punkten, ein Minus von 1,2 Prozent.',
        'Der heutige Kalender ist dicht: Um 2 Uhr trafen sich die G20-Finanzminister, um 8 Uhr folgen deutsche Einzelhandelsumsätze und im Vormittag mehrere Einkaufsmanagerindizes der Industrie.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt, dass ein Rekordhoch keine Einbahnstraße ist, und liefert die konkreten Uhrzeiten, zu denen heute neue Daten die Richtung mitbestimmen können.',
      relatedTopics: ['wie-funktioniert-der-markt', 'aktie'],
      relatedSymbols: ['dax'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 31.8.2026: „Höhere Zinssignale und steigende Ölpreise bremsen: DAX fällt nach Rekordlauf zurück“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'wallstreet-online, Wirtschaftskalender „Kommende Termine“, Abruf 1.9.2026, 00:59 Uhr',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Öl springt über 90 Dollar nach Iran-Angriffen, Gold gibt trotzdem nach',
      summary: [
        'Nach neuen Militärschlägen im Iran-Konflikt sprang Brent-Öl laut wallstreet-online auf 90,74 US-Dollar, ein Plus von 3,74 Prozent – während Gold nur um 0,12 Prozent zulegte.',
        'Goldreporter.de erklärt die Schwäche bei Gold mit steigenden Renditen bei US- und Bundesanleihen; der Goldpreis war am Montag unter seinen 200-Tage-Schnitt gefallen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Macht sichtbar, dass zwei Rohstoffe, die oft gemeinsam als sichere Häfen gelten, auf dieselbe geopolitische Lage unterschiedlich reagieren können, wenn Zinsen als Gegenkraft wirken.',
      relatedTopics: ['rohstoffe', 'risiko-und-rendite'],
      relatedSymbols: ['brent', 'gold'],
      sources: [
        {
          label:
            'wallstreet-online, Rohstoffnachrichten vom 31.8.2026 (dpa-AFX): „Ölpreise steigen deutlich - Militärschläge im Iran-Krieg verschärfen Spannungen“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            'goldreporter.de, Analyse vom 31.8.2026: „Steigende Marktzinsen setzen Gold weiter unter Druck“',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Siemens Energy fällt trotz Kaufempfehlung von Jefferies',
      summary: [
        'Eine geplante Abspaltung drückt laut wallstreet-online weiter auf den Kurs von Siemens Energy, während die Aktie am selben Tag unter Druck weiter fiel.',
        'Gleichzeitig bestätigte die Bank Jefferies laut onvista ihre Einstufung „Buy“ mit einem Kursziel von 215 Euro – ein Beispiel dafür, dass Analystenziele und Tagesbewegungen unterschiedliche Zeiträume betreffen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Verdeutlicht an einem konkreten Fall, dass ein unverändertes Kaufrating und ein fallender Kurs sich nicht widersprechen, weil sich ein Kursziel meist auf zwölf Monate bezieht.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['siemens-energy'],
      sources: [
        {
          label:
            'wallstreet-online, Meldungen im Überblick vom 31.8.2026: „Es geht weiter abwärts: Siemens Energy: Geplante Abspaltung lässt die Kurse purzeln“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
        {
          label:
            "onvista, Analyse-Flash vom 31.8.2026 (dpa-AFX): „Jefferies belässt Siemens Energy auf 'Buy' - Ziel 215 Euro“",
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Mercedes-Benz startet heute sein Milliarden-Rückkaufprogramm',
      summary: [
        'Laut finanzen.net beginnt Mercedes-Benz heute mit einem Aktienrückkauf im Milliardenbereich; die Aktie stand bei der Ankündigung im Grünen.',
        'Eine Analyse von onvista trägt zwar den Titel „Warum der Rückkauf die Aktie kaum stützt“, die vorliegende Übersicht nennt aber keine Begründung dafür.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Erinnert daran, dass ein angekündigtes Rückkaufvolumen kein Versprechen auf einen steigenden Kurs ist und Rückkäufe anders wirken als Dividenden.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['mercedes-benz'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 31.8.2026: „Mercedes-Benz-Aktie in Grün: Startschuss für Milliarden-Rückkaufprogramm am Dienstag“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Allianz-Aktie fällt auf Bericht über Milliarden-Übernahme',
      summary: [
        'Die Allianz-Aktie gab laut finanzen.net nach, nachdem Berichte über eine erwogene Milliarden-Übernahme in Großbritannien aufkamen – die Meldung bezeichnet dies ausdrücklich als „offenbar“, also unbestätigt.',
        'Warum genau der Kurs fiel, nennt die Quelle nicht; bekannt ist nur das Muster, dass Übernahmegerüchte die Aktie des möglichen Käufers häufig belasten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zeigt den Unterschied zwischen einer berichteten Absicht und einem abgeschlossenen Geschäft – wichtig, um Kursreaktionen auf Gerüchte richtig einzuordnen.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['allianz'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 31.8.2026: „Allianz-Aktie tiefer: Versicherer erwägt offenbar Milliarden-Übernahme in Großbritannien“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Amazon rutscht ans Dow-Ende – FTC prüft laut WSJ eine Klage',
      summary: [
        'Amazon war laut wallstreet-online am Montag der schwächste Dow-Wert, nachdem das Wall Street Journal über eine mögliche Klage der US-Handelsaufsicht FTC wegen manipulierter Werbepreise berichtet hatte.',
        'Onvista beschreibt denselben Vorgang unter der Frage „Unfaire Preise für Werbung? Klage gegen Amazon in den USA“ – ein abgeschlossenes Verfahren ist es damit noch nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Macht den Unterschied zwischen einer angedrohten Klage und einem tatsächlichen Urteil deutlich – ein Muster, das bei regulatorischen Nachrichten häufig wiederkehrt.',
      relatedTopics: ['aktie', 'anlegerpsychologie'],
      relatedSymbols: ['amazon'],
      sources: [
        {
          label:
            "wallstreet-online, Unternehmensmeldungen vom 31.8.2026 (dpa-AFX): „AKTIE IM FOKUS: Amazon rutschen ans Dow-Ende - 'WSJ': FTC will Klage einreichen“",
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'SHEIN wagt heute den Börsengang in Hongkong',
      summary: [
        'Der Online-Modehändler SHEIN plant laut finanzen.net für heute seinen Börsengang in Hongkong; Angaben zu Ausgabepreis oder Bewertung liefert die Quelle nicht.',
        'Der Handelsplatz Hongkong ist für Börsengänge chinesischer Unternehmen etabliert, auch wenn die konkrete Standortwahl von SHEIN in der Meldung nicht begründet wird.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Ein erster Handelstag ist erfahrungsgemäß besonders schwankungsanfällig – ein nützlicher Hinweis für alle, die neu notierte Aktien beobachten.',
      relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['hang-seng'],
      sources: [
        {
          label:
            'finanzen.net, Top News, Abruf 1.9.2026: „SHEIN-Aktie wagt den Sprung an die Börse: IPO in Hongkong am 1. September“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
