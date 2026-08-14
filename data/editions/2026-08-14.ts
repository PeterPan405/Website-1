import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-14.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-14 03:04 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-14',
  intro:
    'Gold fällt trotz schwächerer US-Erzeugerpreise, Cerebras bricht trotz Umsatzsprung ein, und der Iran fordert Maut für Hormus – der Ölpreis sinkt trotzdem.',
  top: [
    {
      headline:
        'DAX unterbricht Rekordkurs, Wall Street schließt fester – ein Tag, zwei Richtungen',
      summary: [
        'Eine Ticker-Meldung von finanzen.net sprach am Donnerstagnachmittag wegen der unklaren Lage im Nahen Osten von „kleinen Abschlägen“ beim DAX, eine Tagesübersicht fasste den Schluss später mit „DAX fällt letztlich ins Minus“ zusammen.',
        'Eine Kurstabelle von Börse Frankfurt weist den DAX für denselben Tag dagegen mit 26.411 Punkten und einem Plus von 0,20 Prozent aus – während Nasdaq 100, S&P 500 und Dow Jones laut Ticker durchweg im Plus schlossen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zwei Quellen nennen für denselben Index am selben Tag unterschiedliche Vorzeichen – ein Hinweis darauf, dass ein „Tagesschluss“ je nach Zeitpunkt der Momentaufnahme unterschiedlich ausfallen kann.',
      relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'nasdaq-100'],
      sources: [
        {
          label:
            'finanzen.net, Übersicht „Heute im Fokus“ vom 13.8.2026: „DAX fällt letztlich ins Minus -- Wall Street schließt fester“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
        {
          label:
            'Börse Frankfurt, Marktüberblick vom 13.8.2026 (DAX 26.411,00 Punkte, +0,20 %)',
          url: 'https://www.boerse-frankfurt.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Rüstungsaktien gesucht: TKMS steuert auf Rekordhoch zu',
      summary: [
        'Laut einem News-Ticker von finanzen.net vom Donnerstag war TKMS (thyssenkrupp Marine Systems) auf dem Weg zu einem Rekordhoch, während Anleger auch Rheinmetall, Hensoldt und Renk im Blick behielten.',
        'Eine Begründung für die gesuchten Rüstungswerte nennt die Kurzmeldung nicht – sie hält nur die Kursbewegung und die genannten Werte fest.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Wenn mehrere Rüstungsaktien gleichzeitig gesucht sind, deutet das auf ein sektorweites Thema hin – wichtig für alle, die Einzelwerte sonst isoliert betrachten würden.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['rheinmetall'],
      sources: [
        {
          label:
            'finanzen.net, News-Ticker vom 13.8.2026: „Rüstungsaktien gesucht: TKMS springt Richtung Rekordhoch – Rheinmetall, HENSOLDT und RENK im Blick“',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline:
        'Apple kauft sich laut Meldung Nachrichteninhalte für die KI-gestützte Siri ein',
      summary: [
        'Eine Meldung auf wallstreet-online berichtet unter dem Titel „Milliardenmarkt KI: Apple kauft sich für Siri hochwertige Nachrichten ein“ von Deals, mit denen sich Apple Zugang zu Nachrichteninhalten sichert.',
        'Details zu Umfang, Partnern oder Kosten der „Millionen-Deals“ nennt die kurze Meldung nicht – nur die Richtung: Apple investiert in Inhalte für seinen Sprachassistenten.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dass ein Hardware-Konzern für einen Sprachassistenten Lizenzen bei Verlagen kauft, zeigt, dass KI-Wettbewerb inzwischen auch über den Einkauf von Inhalten statt nur über Rechenleistung ausgetragen wird.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['apple'],
      sources: [
        {
          label:
            'wallstreet-online, Meldung vom 14.8.2026 (Rubrik „Aktien & Indizes“): „Apple plant Millionen-Deals: Milliardenmarkt KI: Apple kauft sich für Siri hochwertige Nachrichten ein“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'IBM holt sich OpenAI ins Kerngeschäft',
      summary: [
        'Laut einer Meldung auf wallstreet-online arbeitet IBM enger mit OpenAI zusammen und rückt die Kooperation damit ins Kerngeschäft – die Kurzmeldung spricht von Milliardenmärkten, die dabei auf dem Spiel stehen.',
        'Details zur Art der Zusammenarbeit oder zu vertraglichen Eckpunkten nennt die Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Eine engere Bindung zwischen einem etablierten IT-Konzern und einem führenden KI-Anbieter zeigt, wie stark sich etablierte Technologiefirmen inzwischen um den Zugang zu KI-Modellen bemühen.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['ibm'],
      sources: [
        {
          label:
            'wallstreet-online, Meldung vom 14.8.2026 (Rubrik „Politik, Wirtschaft & Konjunktur“): „KI-Allianz mit Wucht: IBM holt OpenAI ins Kerngeschäft – jetzt geht es um Milliardenmärkte“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Microsofts stiller Rückzug aus China',
      summary: [
        'Eine Meldung auf wallstreet-online berichtet von einem „stillen China-Rückzug“ Microsofts und nennt Standorte, die davon profitieren sollen – welche das konkret sind, bleibt in der Kurzfassung offen.',
        'Eine Begründung für den Rückzug liefert die Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Verlagert ein globaler Technologiekonzern Standorte weg von China, betrifft das nicht nur die eigene Lieferkette, sondern kann ein Signal für die gesamte Branche sein.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['microsoft'],
      sources: [
        {
          label:
            'wallstreet-online, Meldung vom 14.8.2026 (Rubrik „Politik, Wirtschaft & Konjunktur“): „China verliert an Bedeutung: Stiller China-Rückzug von Microsoft: Diese Standorte sollen jetzt profitieren“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
    {
      headline: 'Chinas Immobilienkrise bekommt laut Meldung neuen Zündstoff',
      summary: [
        'Eine Meldung auf wallstreet-online beschreibt die chinesische Immobilienkrise als weiterhin ungelöst und spricht von „neuem Zündstoff“ – als betroffenes Unternehmen wird Hang Lung Properties genannt.',
        'Um welchen konkreten Auslöser es sich handelt, geht aus der kurzen Zusammenfassung nicht hervor.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Der chinesische Immobiliensektor gilt seit Jahren als Risiko für die zweitgrößte Volkswirtschaft der Welt – neue Belastungen dort können auch auf global anlegende Portfolios ausstrahlen.',
      relatedTopics: ['immobilien', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label:
            'wallstreet-online, Meldung vom 13.8.2026: „Krise weitet sich aus: Chinas Immobilienkrise war nie weg – jetzt bekommt sie neuen Zündstoff“',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
