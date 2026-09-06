/**
 * Wann welcher Inhalt wieder angesehen werden muss.
 *
 * ## Warum es dieses Register gibt
 *
 * Am 9. August 2026 nachgezählt: Der Basiszins für die Vorabpauschale stand
 * seit sieben Monaten auf dem Wert des Vorjahres. Nicht, weil es niemand
 * hätte merken können – `npm run frische` meldet es wortgenau –, sondern weil
 * die Prüfung in **keinem einzigen Workflow** lief. Sie hing daran, dass
 * jemand von Hand einen Befehl tippt.
 *
 * Der teuerste Fehler dieses Projekts ist nicht der rote Lauf, sondern der
 * stille. Ein Inhalt, der still veraltet, ist genau das.
 *
 * ## Die Gliederung folgt dem Alterungstempo, nicht dem Kalender
 *
 * Es hat keinen Wert, eine Definition des Kurs-Gewinn-Verhältnisses alle zwei
 * Wochen zu lesen – sie ändert sich nicht. Es hat sehr wohl Wert, den
 * Sparerpauschbetrag zweiwöchentlich anzusehen, weil er sich zu einem festen
 * Termin ändert, den niemand ankündigt.
 *
 * Deshalb drei Takte:
 *
 * - **14 Tage** – Werte mit Verfallsdatum. Steuersätze, Freibeträge,
 *   Basiszins, laufende Kosten. Vierzehn Tage ist der Abstand, in dem ein
 *   Jahreswert nicht sieben Monate alt wird.
 * - **28 Tage** – Fachtexte und Definitionen. Ändern sich fast nie; häufiger
 *   zu prüfen erzeugt Lärm ohne Ertrag, und Lärm führt dazu, dass man
 *   irgendwann wegsieht.
 * - **28 Tage** – Rechtliches. Ändert sich selten, kostet im Fehlerfall aber
 *   am meisten.
 *
 * Wöchentlich läuft ohnehin, was Sekunden kostet: `npm run frische`,
 * `npm run vertraege`. Was billig ist, prüft man oft.
 *
 * ## Wie man damit arbeitet
 *
 * Nach einer Durchsicht wird `zuletztGeprueft` auf das Datum gesetzt – **auch
 * dann, wenn nichts zu ändern war.** „Angesehen und in Ordnung“ ist ein
 * Ergebnis; ohne diesen Eintrag steht der Bereich in vier Wochen wieder als
 * überfällig da und man prüft ihn zweimal umsonst.
 */

/** Ein Bereich, der regelmäßig angesehen werden will. */
export interface Turnuseintrag {
  /** Kurzname, wie er im Bericht steht. */
  id: string
  /** Was genau angesehen wird – eine Anweisung, kein Etikett. */
  auftrag: string
  /** Abstand in Tagen. */
  taktTage: 14 | 28
  /** Letzte Durchsicht, `JJJJ-MM-TT`. */
  zuletztGeprueft: string
  /** Die Dateien, um die es geht. */
  dateien: readonly string[]
  /**
   * Woher die Wahrheit kommt, wenn sie nicht im Repository steht.
   *
   * Leer heißt: im Repository nachweisbar. Sonst die Adresse, die über
   * `.github/workflows/quellen-holen.yml` zu holen ist – von einer Sitzung
   * aus ist sie nicht erreichbar (403 am Egress-Proxy).
   */
  quelle?: string
}

export const inhalteTurnus: readonly Turnuseintrag[] = [
  // ---------------------------------------------------------------- 14 Tage
  {
    id: 'steuerwerte',
    auftrag:
      'Abgeltungsteuer, Solidaritätszuschlag, Sparerpauschbetrag, Teilfreistellungen ' +
      'und den Basiszins der Vorabpauschale gegen den amtlichen Stand halten.',
    taktTage: 14,
    /*
      05.09.2026: erstmals alle fünf Werte gegen die Primärquelle gehalten –
      aus einer Umgebung mit Netzzugang, die `gesetze-im-internet.de` erreicht
      (viermal HTTP 200, wo der Läufer am 28. August zweimal ins Timeout lief).

        25 %          § 32d Absatz 1 EStG, wörtlich
        5,5 %         § 4 SolzG 1995 – und dessen Satz 3 nimmt die
                      Abgeltungsteuer von der Freigrenzen-Rückführung aus,
                      genau so, wie `kapitalertragsteuer.ts` rechnet
        1.000/2.000 € § 20 Absatz 9 EStG
        30/15/60/80 % § 20 InvStG, Absätze 1 bis 3
        3,20 %        BMF 13.01.2026, GZ IV C 1 - S 1980/00230/012/001

      Nichts zu ändern. Der Zwischenstand in `data/stichtagswerte.ts` ist
      damit ein Ergebnis geworden.
    */
    zuletztGeprueft: '2026-09-05',
    dateien: ['lib/kapitalertragsteuer.ts', 'data/stichtagswerte.ts'],
    quelle: 'https://www.bundesfinanzministerium.de/',
  },
  {
    id: 'etf-kosten',
    auftrag:
      'Laufende Kosten (TER) der acht Katalog-ETFs. Am 9. August 2026 war ' +
      'keine einzige hinterlegt – ein Kostenrechner ohne Kosten.',
    taktTage: 14,
    /*
      05.09.2026: alle acht eingetragen. Zwei aus dem Basisinformationsblatt
      des Anbieters (Vanguard, DWS), sechs aus je vier bis sieben
      übereinstimmenden Portalangaben – iShares antwortet auf jede Adresse mit
      403, auch auf die PDFs.

      Beim nächsten Mal ist die Frage nicht „stehen Zahlen da?“, sondern:
      Hat ein Anbieter gesenkt? Vanguard hat es zwischen Oktober 2025 und
      Juli 2026 zweimal getan (0,22 → 0,19 → 0,14). Die sechs mit `art:
      'anbieterangabe'` gehören zuerst angesehen – sie tragen den Tag der
      Durchsicht, nicht das Datum eines Dokuments.
    */
    zuletztGeprueft: '2026-09-05',
    dateien: ['data/etf-kosten.ts'],
    quelle: 'Factsheets der Anbieter, ISIN steht je Eintrag',
  },
  {
    id: 'datenstaende',
    auftrag:
      'Alter der Momentaufnahmen und der Zahlen im Fließtext. Deckt sich mit ' +
      '`npm run frische`; hier steht es, damit es im Bericht auftaucht.',
    taktTage: 14,
    // 28.08.2026: `npm run frische` durchgesehen, alles innerhalb seiner
    // Grenzen. Ältester Wert war `laender.json` mit 21 Tagen (ohne Grenze),
    // die drei Kurs- und Marktwerte 0 bis 1 Tag.
    zuletztGeprueft: '2026-08-28',
    dateien: ['data/snapshots/', 'data/stichtagswerte.ts'],
  },

  // ---------------------------------------------------------------- 28 Tage
  {
    id: 'definitionen',
    auftrag:
      'Fachliche Definitionen auf Richtigkeit und auf zu pauschale Aussagen: ' +
      'Performance- gegen Kursindex, Gewichtungsmethoden, Aktienrückkauf gegen ' +
      'Dividende, FFO, Book-to-Bill, KUV.',
    taktTage: 28,
    zuletztGeprueft: '2026-08-09',
    dateien: ['data/glossar.ts', 'data/learn/', 'data/akademie/'],
  },
  {
    id: 'historische-zahlen',
    auftrag:
      'Crash-Daten, Renditeangaben, Indexstände, Jahreszahlen in Lerntexten ' +
      'und Akademie. Jede Zahl gegen eine Quelle, und die Quelle notieren.',
    taktTage: 28,
    zuletztGeprueft: '2026-08-09',
    dateien: ['data/crashes.ts', 'data/learn/', 'data/akademie/'],
    quelle: 'je Zahl verschieden – im Text hinterlegen',
  },
  {
    id: 'rechner',
    auftrag:
      'Je Rechner ein Beispiel von Hand nachrechnen und die Formel im Code ' +
      'gegen die auf der Seite angegebene Methodik halten.',
    taktTage: 28,
    zuletztGeprueft: '2026-09-06',
    dateien: ['lib/kapitalertragsteuer.ts', 'lib/kosten.ts', 'lib/kredit.ts'],
  },
  {
    id: 'rechtliches',
    auftrag:
      'Impressum, Datenschutz, Haftungsausschluss, KI-Hinweise. Ändert sich ' +
      'selten, kostet im Fehlerfall am meisten.',
    taktTage: 28,
    zuletztGeprueft: '2026-08-09',
    dateien: [
      'app/impressum/page.tsx',
      'app/datenschutz/page.tsx',
      'lib/provider.ts',
      'lib/sprechfassung.ts',
      'data/podcast-eigener-feed.json',
    ],
  },
]
