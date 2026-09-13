import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-09-13.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-09-13 00:14 UTC
 */
export const edition: DailyEdition = {
  date: '2026-09-13',
  intro:
    'DAX und Wien laufen zum Wochenschluss auseinander, zwei KI-Chefs treten auf die Bremse, und Gold hält seine Marke vor der Fed-Entscheidung.',
  top: [
    {
      headline:
        'Gold hält Unterstützung, Spekulanten setzen vor der Fed-Sitzung auf mehr',
      summary: [
        'Der Goldpreis schloss die Woche laut Goldreporter an der Unterstützung von 4.350 Dollar, während große Spekulanten ihre Netto-Long-Positionen weiter ausbauten.',
        'Eine Überschrift bei wallstreet-online fragt bereits, ob die Fed die Rallye am Mittwoch mit ihrer Zinsentscheidung beenden könnte, ohne selbst eine Antwort zu liefern.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Zeigt, dass eine aufgebaute Markterwartung vor einer Notenbanksitzung keine Garantie für deren Ausgang ist.',
      relatedTopics: ['rohstoffe', 'notenbanken-geldpolitik'],
      relatedSymbols: ['gold'],
      sources: [
        {
          label: 'Goldreporter, CoT-Daten Gold, Meldung vom 12.09.2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline:
        'DAX bleibt im Wochenminus, Wien holt sich trotz hohem Ölpreis ein Rekordhoch',
      summary: [
        'Der DAX stabilisierte sich laut dpa-AFX am Freitag, verbuchte auf Wochensicht aber weiterhin ein Minus – zwei Kursleisten nannten dafür leicht unterschiedliche Schlussstände.',
        'Die Wiener Börse erreichte im selben Umfeld ein Rekordhoch, obwohl der Ölpreis hoch blieb; eine Begründung dafür nennt die Meldung nicht.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Macht sichtbar, dass derselbe Ölpreis auf unterschiedlich zusammengesetzte Indizes verschieden wirken kann.',
      relatedTopics: ['aktien-laender-branchen', 'wie-funktioniert-der-markt'],
      relatedSymbols: ['dax', 'brent'],
      sources: [
        {
          label:
            'dpa-AFX über onvista, Index-Analysen, Meldung vom 11.09.2026, 16:23 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
    {
      headline: 'OpenAI verschiebt den Börsengang, Anthropic wirbt für Tempo-Drosselung',
      summary: [
        'Am selben Samstag meldete dpa-AFX, dass OpenAIs Chef einen Börsengang in diesem Jahr ausschließt und Anthropics Chef sich für eine langsamere Entwicklung ausspricht.',
        'Der Nasdaq zeigte sich davon unbeeindruckt und stand laut finanzen.net am Sonntagmorgen weiterhin nahe seinen jüngsten Höchstständen.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Verdeutlicht den Unterschied zwischen einer verschobenen Börsen-Notierung und einer Aussage zum Entwicklungstempo eines Unternehmens.',
      relatedTopics: ['aktie', 'boerse'],
      relatedSymbols: ['nasdaq-100'],
      sources: [
        {
          label: 'dpa-AFX über onvista, Aktuelle News, Meldung vom 12.09.2026, 20:21 Uhr',
          url: 'https://www.onvista.de/news/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Hapag-Lloyd verfolgt ZIM-Übernahme trotz israelischem Veto weiter',
      summary: [
        'Laut finanzen.net hält Hapag-Lloyd an der geplanten Übernahme des Konkurrenten ZIM fest, obwohl es dagegen ein Veto aus Israel gibt.',
        'Weder die Begründung des Vetos noch die Eckdaten der Übernahme selbst gehen aus der ausgewerteten Meldung hervor.',
      ],
      category: 'Steuern & Recht',
      whyItMatters:
        'Zeigt an einem konkreten Fall, dass politische Vetos Übernahmen unabhängig von deren wirtschaftlicher Logik stoppen können.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: [],
      sources: [
        {
          label: 'finanzen.net, News-Ticker vom 12.09.2026',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Schweden vergibt Großauftrag an Lockheed Martin statt an Rheinmetall',
      summary: [
        'Laut wallstreetONLINE hat Schweden einen großen Rüstungsauftrag vergeben, von dem Lockheed Martin statt Rheinmetall profitieren soll.',
        'Ein weiterer Bericht vom 12. September beschreibt Rheinmetall zugleich als „unter Druck“, ohne die genannten Risiken selbst zu benennen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Erinnert daran, dass ein wachsender Sektor nicht automatisch jedes Unternehmen darin gleichmäßig wachsen lässt.',
      relatedTopics: ['aktie', 'risiko-und-rendite'],
      relatedSymbols: ['rheinmetall', 'lockheed'],
      sources: [
        {
          label:
            'wallstreetONLINE Redaktion, Gefragte Nachrichten, Meldung vom 10.09.2026',
          url: 'https://www.wallstreet-online.de/nachrichten',
        },
      ],
    },
  ],
}
