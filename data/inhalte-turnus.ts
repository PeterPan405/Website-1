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

      26.09.2026: wieder alle fünf gehalten, diesmal **von hier aus** – über
      `quellen-holen.yml`, weil die Sitzung selbst nur GitHub erreicht.

      `gesetze-im-internet.de` lief dabei fünfmal ins Timeout, wie schon am
      28. August. Der Läufer kommt über **dejure.org** durch (viermal 200);
      `buzer.de` antwortet mit 403. Wer das nächste Mal prüft, nimmt dejure
      und spart sich den Umweg.

        25 %       § 32d Abs. 1 EStG: „beträgt 25 Prozent"
        5,5 %      § 4 SolZG 1995: „beträgt 5,5 Prozent der Bemessungsgrundlage"
        1.000 €    § 20 Abs. 9 EStG: „ein Betrag von 1 000 Euro … (Sparer-
                   Pauschbetrag)"
        30 %       § 20 Abs. 1 InvStG: „bei Aktienfonds 30 Prozent"
        15 %       § 20 Abs. 2 InvStG: „Bei Mischfonds ist die Hälfte der für
                   Aktienfonds geltenden Aktienteilfreistellung anzusetzen"
        60 / 80 %  § 20 Abs. 3 InvStG: Immobilien- und Auslands-Immobilienfonds
        Basiszins  § 18 Abs. 4 InvStG: Herleitung über die Bundesbank zum
                   ersten Börsentag – deckt sich mit der Herkunft der 3,20 %

      Die 15 Prozent standen zweimal nicht im Auszug: Absatz 2 ist ein
      einziger Satz und fiel erst beim Abruf **ohne** Suchmuster heraus. Wer
      eine Zahl mit einem Suchmuster sucht, findet sie nur, wenn sie darin
      steht – „nicht gefunden" hiess hier „falsch gesucht".

      Nichts zu ändern, zum zweiten Mal.
    */
    zuletztGeprueft: '2026-09-26',
    dateien: ['lib/kapitalertragsteuer.ts', 'data/stichtagswerte.ts'],
    quelle: 'https://dejure.org/ (über quellen-holen.yml), BMF für den Basiszins',
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

      26.09.2026: alle acht über `quellen-holen.yml` bei justETF nachgesehen,
      achtmal HTTP 200. **Keine Änderung, keiner hat gesenkt:**

        IE00B4L5Y983  MSCI World        0,20 %
        IE00BK5BQT80  FTSE All-World    0,14 %
        IE00B5BMR087  S&P 500           0,07 %
        IE00BKM4GZ66  EM IMI            0,18 %
        DE0005933931  DAX               0,16 %
        DE0002635307  STOXX 600         0,20 %
        IE00BF4RFH31  World Small Cap   0,35 %
        LU0290358497  Geldmarkt         0,10 %

      Die beiden aus dem Basisinformationsblatt (0,14 und 0,10) stimmen mit
      der Portalangabe überein – das ist eine Gegenprobe auf zwei Wegen und
      kein neues Dokument. Ihr `stand` bleibt deshalb das Datum des Dokuments;
      nur die sechs Portalangaben tragen den neuen Tag der Durchsicht.
    */
    zuletztGeprueft: '2026-09-26',
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
    //
    // 20.09.2026: wieder durchgesehen, wieder alles innerhalb der Grenzen –
    // und diesmal mit den Zahlen dabei, damit der nächste sieht, wie viel
    // Luft war und nicht nur, dass jemand hingesehen hat:
    //
    //     Leitzins der EZB              4 von 10 Tagen
    //     Inflation Euroraum / DE      19 von 75 Tagen
    //     Aktienkurse                   0 von  5 Tagen
    //     Kursverläufe, Marktbreite     2 von  6 Tagen
    //
    // Abrufe 0 bis 4 Tage alt, keine abweichende Zahl im Fließtext, alle
    // acht ETF-Kosten hinterlegt. Ob die hinterlegten Kosten noch den
    // Factsheets entsprechen, sagt das nicht – das ist `etf-kosten`.
    zuletztGeprueft: '2026-09-20',
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
    // 20.09.2026: Durchsicht mit **einem** Befund, und zwar dem teuersten,
    // den dieser Bereich haben kann – einer Zusage, die nicht zutraf.
    //
    // Im Impressum stand „Jeder Inhalt wird vor der Veröffentlichung von
    // einem Menschen inhaltlich geprüft und freigegeben". Derselbe Satz war
    // am 17.08. aus der Kanalbeschreibung des Podcasts und aus dem KI-Hinweis
    // unter jeder Folge gestrichen worden, beide Male mit der Begründung, die
    // Kette veröffentliche ohne Halt. Berichtigt wurde damals die Stelle, an
    // der es auffiel, nicht die Aussage.
    //
    // `tests/ki-hinweis-zusage.test.ts` hält die Aussage jetzt an allen
    // Stellen zugleich fest – und fand beim ersten Lauf gleich eine zweite
    // im selben Abschnitt.
    //
    // Nicht geprüft, weil von hier aus nicht erreichbar: ob die Angaben zu
    // Anbieter und Hoster noch stimmen und ob sich an § 5 DDG oder der
    // DSGVO-Auslegung etwas geändert hat. Das braucht einen Blick von aussen.
    zuletztGeprueft: '2026-09-20',
    dateien: [
      'app/impressum/page.tsx',
      'app/datenschutz/page.tsx',
      'lib/provider.ts',
      'lib/sprechfassung.ts',
      'data/podcast-eigener-feed.json',
    ],
  },
]
