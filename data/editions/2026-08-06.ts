import type { DailyEdition } from './types'

/**
 * Ausgabe vom 2026-08-06.
 *
 * Erzeugt von `scripts/nachrichten-erzeugen.ts` auf einem GitHub-Läufer aus
 * den Quellen, die `quellen-sammeln.yml` am selben Morgen abgerufen hat.
 * Quellenlage laut Kopf der Datei: Quellenlage 2026-08-06 05:09 UTC
 */
export const edition: DailyEdition = {
  date: '2026-08-06',
  intro:
    'Quartalszahlen von Siemens, Telekom und Merck, ein ausgeweiteter Aktienrückkauf und Öl unter 80 Dollar – der Morgen des 6. August in sechs Lehrstücken.',
  top: [
    {
      headline: 'Siemens meldet den höchsten Auftragseingang seiner Geschichte',
      summary: [
        'Über den Nachrichtenticker lief um 7:04 Uhr, dass Siemens einen Rekordauftragseingang erzielt und den Ergebnisausblick erhöht hat.',
        'Welche Sparte den Rekord trägt und wie der Kurs darauf reagierte, geht aus der Meldung nicht hervor.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Auftragseingang ist bestelltes Geschäft, nicht abgerechneter Umsatz. Zwischen beiden liegen in der Industrie oft Jahre – und der erhöhte Ausblick bewegt Kurse meist stärker als das Quartal selbst.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['siemens', 'dax'],
      sources: [
        {
          label: 'finanzen.net, Nachrichten-Ticker vom 6. August 2026, 7:03 bis 7:05 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Deutsche Telekom weitet den Aktienrückkauf deutlich aus',
      summary: [
        'Die Agenturmeldung von 4:48 Uhr nennt eine deutliche Ausweitung des Rückkaufprogramms; um 7:04 Uhr folgte ein höheres operatives Ergebnis.',
        'Auch Aumovio kündigte an, überschüssige Mittel für Aktienrückkäufe einzusetzen.',
      ],
      category: 'Geldanlage',
      whyItMatters:
        'Rückkauf und Dividende geben beide Geld an die Eigentümer zurück, aber nur die Dividende löst sofort Kapitalertragsteuer aus. Wer allein auf die Dividendenrendite schaut, übersieht die halbe Ausschüttung.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['deutsche-telekom', 'dax'],
      sources: [
        {
          label:
            'onvista, Agentur-Meldungen (dpa-AFX) vom 6. August 2026, 4:24 bis 4:48 Uhr',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'finanzen.net, Nachrichten-Ticker vom 6. August 2026, 7:03 bis 7:05 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
    {
      headline: 'Zwei erhöhte Prognosen, zwei sehr verschiedene Gründe',
      summary: [
        'Merck hebt die Prognose nach einem nach eigener Darstellung robusten Quartal an; bei Rational stammt der Mehrgewinn laut Meldung aus einer Zoll-Rückzahlung.',
        'Die Jahresziele von Rational bleiben nach derselben Meldung ausdrücklich unverändert.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Ein Einmaleffekt erhöht den Gewinn dieses Quartals und wiederholt sich nicht. Wer das berichtete Ergebnis ungeprüft fortschreibt, rechnet mit Geld, das nur einmal fließt.',
      relatedTopics: ['aktie'],
      relatedSymbols: ['merck', 'dax'],
      sources: [
        {
          label: 'finanzen.net, Nachrichten-Ticker vom 6. August 2026, 7:03 bis 7:05 Uhr',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
  further: [
    {
      headline: 'Nordseeöl bleibt unter 80 Dollar, Gold hatte zuvor 4.100 überschritten',
      summary: [
        'Die Ölpreise wurden um 4:41 Uhr als unverändert gemeldet; der Goldreporter hatte am Vortag einen Anstieg auf 4.162 Dollar beschrieben.',
        'Dass ein Preis stillsteht, heißt nicht, dass nichts geschehen ist – es heißt, dass es bereits eingepreist war.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Dieselbe geopolitische Lage wirkt auf Öl über das erwartete Angebot und auf Gold über die Anleiherenditen. Deshalb können beide gegenläufig reagieren, ohne dass sich etwas widerspricht.',
      relatedTopics: ['rohstoffe'],
      relatedSymbols: ['brent', 'gold'],
      sources: [
        {
          label:
            'onvista, Agentur-Meldungen (dpa-AFX) vom 6. August 2026, 4:24 bis 4:48 Uhr',
          url: 'https://www.onvista.de/news/',
        },
        {
          label: 'Goldreporter, Marktbericht vom 5. August 2026',
          url: 'https://www.goldreporter.de/',
        },
      ],
    },
    {
      headline: 'Kursleiste um 5:09 Uhr: DAX 26.126, Nasdaq 26.363, Gold 4.264',
      summary: [
        'Zu dieser Uhrzeit sind Xetra und die US-Börsen geschlossen; nur Krypto und Devisen wurden zum Abrufzeitpunkt tatsächlich gehandelt.',
        'Die Prozentangaben beziehen sich damit auf ganz verschiedene Bezugspunkte.',
      ],
      category: 'Märkte',
      whyItMatters:
        'Zu jeder Kursangabe gehören Zeitpunkt und Handelsplatz. Fehlt eines davon, ist die Zahl nicht falsch, aber sie lässt sich nicht einordnen – und Prozentwerte daraus sind nicht vergleichbar.',
      relatedTopics: ['boerse'],
      relatedSymbols: ['dax', 'bitcoin'],
      sources: [
        {
          label: 'finanzen.net, Kursleiste, abgerufen am 6. August 2026 um 5:09 Uhr UTC',
          url: 'https://www.finanzen.net/nachrichten/',
        },
      ],
    },
  ],
}
