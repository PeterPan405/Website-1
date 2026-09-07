import type { Termin } from '@/data/kalender/typen'

/**
 * Die Termine des Börsenkalenders.
 *
 * Reihenfolge ist hier ohne Bedeutung – sortiert wird in `lib/kalender.ts`.
 * Gruppiert ist nach Art, damit sich beim Nachtragen leicht sehen lässt, wo
 * ein Termin hingehört.
 *
 * **Beim Nachtragen:** Jeder Eintrag braucht Quelle und Bedeutung, sonst
 * bricht der Build ab (`lib/kalender-validate.ts`). Zinsentscheide der EZB
 * fallen immer auf einen Donnerstag, die der Fed immer auf einen Mittwoch –
 * auch das wird geprüft, weil ein verrutschter Tag sonst niemandem auffiele.
 */

const EZB_QUELLE = {
  label: 'LBBW: EZB-Zinsentscheid – Termine und Prognosen',
  url: 'https://www.lbbw.de/artikel/maerkte-verstehen/ezb-zinsentscheid-leitzins-prognosen_ait4bfmrfe_d.html',
}

const FED_QUELLE = {
  label: 'Federal Reserve: FOMC-Sitzungskalender',
  url: 'https://www.federalreserve.gov/newsevents/calendar.htm',
}

const XETRA_QUELLE = {
  label: 'Deutsche Börse: Handelskalender und -zeiten',
  url: 'https://www.cashmarket.deutsche-boerse.com/cash-de/Handelskalender-und-zeiten-4302078',
}

const IFO_QUELLE = {
  label: 'ifo Institut: Geschäftsklimaindex Deutschland',
  url: 'https://www.ifo.de/en/survey/ifo-business-climate-index-germany',
}

const DESTATIS_QUELLE = {
  label: 'Statistisches Bundesamt: Veröffentlichungskalender',
  url: 'https://www.destatis.de/SiteGlobals/Forms/Suche/Termine/DE/Terminsuche_Formular.html?templateQueryString=verbraucherpreisindex',
}

/*
  Zwei Terminpläne statt eines Monatsblatts.

  Bis zum 7. September 2026 stand hier ein einzelner Monat („11_sched_list“) –
  eine Adresse, die für jeden anderen Termin die falsche Seite zeigt. Das BLS
  führt je Veröffentlichung einen eigenen Plan, und genau die beiden sind
  nachgelesen worden.
*/
const BLS_CPI_QUELLE = {
  label: 'US Bureau of Labor Statistics: Terminplan Verbraucherpreise',
  url: 'https://www.bls.gov/schedule/news_release/cpi.htm',
}

const BLS_ARBEIT_QUELLE = {
  label: 'US Bureau of Labor Statistics: Terminplan Arbeitsmarktbericht',
  url: 'https://www.bls.gov/schedule/news_release/empsit.htm',
}

const LBBW_QUELLE = {
  label: 'LBBW: Termine – das bewegt die Märkte im Juli 2026',
  url: 'https://www.lbbw.de/artikel/maerkte-verstehen/termine-juli-2026_am4innwm2g_d.html',
}

const NYSE_QUELLE = {
  label: 'NYSE: Holidays & Trading Hours',
  url: 'https://www.nyse.com/trade/hours-calendars',
}

export const termine: Termin[] = [
  /*
    ------------------------------------------------------------ Konjunktur

    **Hier steht nur, was die Ämter selbst veröffentlicht haben.** Am
    7. September 2026 waren das:

    | Quelle   | Reicht bis      |
    | -------- | --------------- |
    | Destatis | 15. Januar 2027 |
    | ifo      | 17. Dezember    |
    | BLS      | 10. Dezember    |

    Weiter reicht keine. Für 2027 gibt es deshalb – anders als bei den
    Notenbanken, die Jahre im Voraus terminieren – **keine** Konjunkturtermine
    in diesem Kalender, und es gehören auch keine hinein: Ein gerechneter
    „zweiter Freitag im Februar“ sähe hier aus wie ein amtlicher Termin.
    `tests/kalender-vorrat.test.ts` schlägt Alarm, bevor der Vorrat aufgezehrt
    ist.

    **Zwei Uhrzeiten waren falsch** und sind am 7. September korrigiert
    worden: Destatis meldet um 8:00 Uhr, nicht um 14:00 (das war die alte
    Regelung), und das ifo um 10:30 Uhr, nicht um 10:00. Beides steht so auf
    den Seiten, die auch als Quelle verlinkt sind.
  */
  {
    datum: '2026-07-30',
    titel: 'Inflation Deutschland: Schnellschätzung für Juli',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '8:00 Uhr',
    bedeutung:
      'Die vorläufige Rate für den laufenden Monat, gut zwei Wochen vor dem endgültigen Wert. Wichtiger als die Gesamtrate ist für die Notenbank die Kernrate ohne Energie und Nahrungsmittel: Sie zeigt, ob sich die Teuerung in der Breite festgesetzt hat.',
    themen: ['inflation', 'notenbanken-geldpolitik', 'tagesgeld'],
    symbole: ['dax', 'eur-usd'],
    quelle: DESTATIS_QUELLE,
  },
  {
    datum: '2026-07-30',
    titel: 'Bruttoinlandsprodukt im Euroraum, zweites Quartal',
    art: 'konjunktur',
    ort: 'Euroraum',
    bedeutung:
      'Die erste Schätzung für das abgelaufene Quartal. Achten Sie darauf, welche Zahl genannt wird: Der Vergleich zum Vorquartal fällt naturgemäß klein aus, der zum Vorjahresquartal größer – dieselbe Wirtschaft, zwei sehr verschieden klingende Prozentzahlen.',
    themen: ['wie-funktioniert-der-markt', 'notenbanken-geldpolitik'],
    symbole: ['euro-stoxx-50', 'dax'],
    quelle: LBBW_QUELLE,
  },
  {
    datum: '2026-08-25',
    titel: 'ifo-Geschäftsklimaindex für August',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '10:00 Uhr',
    bedeutung:
      'Rund 9.000 Unternehmen bewerten ihre Lage und ihre Erwartungen für die kommenden sechs Monate. Ein Stimmungsindex misst keine Produktion – er kommt dafür Wochen früher als jede amtliche Zahl und irrt sich entsprechend öfter.',
    themen: ['wie-funktioniert-der-markt', 'anlegerpsychologie'],
    symbole: ['dax'],
    quelle: IFO_QUELLE,
  },
  {
    datum: '2026-09-11',
    titel: 'US-Verbraucherpreise für August',
    art: 'konjunktur',
    ort: 'USA',
    uhrzeit: '14:30 Uhr',
    bedeutung:
      'Die letzte Inflationszahl vor dem Fed-Zinsentscheid am 16. September. Fällt sie deutlich anders aus als erwartet, verschieben sich die Zinserwartungen noch in derselben Stunde – der Entscheid selbst bestätigt danach oft nur, was der Markt schon eingepreist hat.',
    themen: ['inflation', 'notenbanken-geldpolitik'],
    symbole: ['sp500', 'eur-usd', 'gold'],
    quelle: BLS_CPI_QUELLE,
  },
  {
    datum: '2026-09-24',
    titel: 'ifo-Geschäftsklimaindex für September',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '10:30 Uhr',
    bedeutung:
      'Lage und Erwartungen werden getrennt erhoben und lohnen den getrennten Blick: Steigt der Gesamtindex nur, weil die Erwartungen anziehen, hat sich an der tatsächlichen Geschäftslage noch nichts geändert.',
    themen: ['wie-funktioniert-der-markt', 'anlegerpsychologie'],
    symbole: ['dax'],
    quelle: IFO_QUELLE,
  },
  {
    datum: '2026-09-30',
    titel: 'Inflation Deutschland: Schnellschätzung für September',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '8:00 Uhr',
    bedeutung:
      'Die vorläufige Rate, knapp zwei Wochen vor dem endgültigen Wert am 13. Oktober. Revisionen zwischen beiden sind klein, kommen aber vor – wer die Schnellschätzung zitiert, sagt dazu, dass sie eine ist.',
    themen: ['inflation', 'notenbanken-geldpolitik', 'tagesgeld'],
    symbole: ['dax', 'eur-usd'],
    quelle: DESTATIS_QUELLE,
  },
  {
    datum: '2026-10-02',
    titel: 'US-Arbeitsmarktbericht für September',
    art: 'konjunktur',
    ort: 'USA',
    uhrzeit: '14:30 Uhr',
    bedeutung:
      'Neben der Zahl neuer Stellen zählen zwei Nebenwerte: die Revision der beiden Vormonate und der Stundenlohn. Eine gute Zahl, die zwei schlechte Vormonate nach unten korrigiert, ist keine gute Zahl.',
    themen: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
    symbole: ['sp500', 'eur-usd'],
    quelle: BLS_ARBEIT_QUELLE,
  },
  {
    datum: '2026-10-14',
    titel: 'US-Verbraucherpreise für September',
    art: 'konjunktur',
    ort: 'USA',
    uhrzeit: '14:30 Uhr',
    bedeutung:
      'Erscheint zwei Wochen vor dem Fed-Entscheid am 28. Oktober und ist damit die Zahl, an der sich die Erwartung für diese Sitzung entscheidet.',
    themen: ['inflation', 'notenbanken-geldpolitik'],
    symbole: ['sp500', 'eur-usd', 'gold'],
    quelle: BLS_CPI_QUELLE,
  },
  {
    datum: '2026-10-26',
    titel: 'ifo-Geschäftsklimaindex für Oktober',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '10:30 Uhr',
    bedeutung:
      'Der meistbeachtete Frühindikator der deutschen Wirtschaft. Für ein einzelnes Depot folgt daraus nichts – für die Frage, wie die Notenbank in den kommenden Monaten entscheidet, schon.',
    themen: ['wie-funktioniert-der-markt', 'notenbanken-geldpolitik'],
    symbole: ['dax'],
    quelle: IFO_QUELLE,
  },
  {
    datum: '2026-10-30',
    titel: 'Inflation Deutschland: Schnellschätzung für Oktober',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '8:00 Uhr',
    bedeutung:
      'Einen Tag nach dem EZB-Zinsentscheid – die Notenbank kennt die Zahl beim Entscheiden also noch nicht. Wer aus der Reihenfolge etwas herausliest, liest zu viel hinein.',
    themen: ['inflation', 'notenbanken-geldpolitik', 'tagesgeld'],
    symbole: ['dax', 'eur-usd'],
    quelle: DESTATIS_QUELLE,
  },
  {
    datum: '2026-11-06',
    titel: 'US-Arbeitsmarktbericht für Oktober',
    art: 'konjunktur',
    ort: 'USA',
    uhrzeit: '14:30 Uhr',
    bedeutung:
      'Die meistbeachtete Einzelzahl der Woche, in der sie erscheint. Der Arbeitsmarkt ist die zweite Hälfte des Auftrags der US-Notenbank – neben der Preisstabilität –, und die Zahl wird deshalb unmittelbar in Zinserwartungen übersetzt.',
    themen: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
    symbole: ['sp500', 'eur-usd'],
    quelle: BLS_ARBEIT_QUELLE,
  },
  {
    datum: '2026-11-10',
    titel: 'US-Verbraucherpreise für Oktober',
    art: 'konjunktur',
    ort: 'USA',
    uhrzeit: '14:30 Uhr',
    bedeutung:
      'Der CPI steht in den Schlagzeilen, die Notenbank steuert aber nach dem PCE-Deflator – zwei verschiedene Maße, die regelmäßig zu verschiedenen Zahlen kommen. Wer beide verwechselt, wundert sich über die Reaktion der Märkte.',
    themen: ['inflation', 'notenbanken-geldpolitik'],
    symbole: ['sp500', 'eur-usd', 'gold'],
    quelle: BLS_CPI_QUELLE,
  },
  {
    datum: '2026-11-24',
    titel: 'ifo-Geschäftsklimaindex für November',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '10:30 Uhr',
    bedeutung:
      'Rund 9.000 Unternehmen antworten monatlich – deshalb schwankt der Index weniger als die Schlagzeilen dazu. Eine Bewegung von einem Punkt ist Rauschen, eine Richtung über drei Monate ist ein Signal.',
    themen: ['wie-funktioniert-der-markt', 'anlegerpsychologie'],
    symbole: ['dax'],
    quelle: IFO_QUELLE,
  },
  {
    datum: '2026-11-30',
    titel: 'Inflation Deutschland: Schnellschätzung für November',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '8:00 Uhr',
    bedeutung:
      'Die letzte Schnellschätzung vor dem EZB-Entscheid am 17. Dezember; der endgültige Novemberwert folgt am 10. Dezember. Für das Tagesgeld zählt nicht die Rate selbst, sondern was die Notenbank daraus für den Einlagensatz folgert.',
    themen: ['inflation', 'notenbanken-geldpolitik', 'tagesgeld'],
    symbole: ['dax', 'eur-usd'],
    quelle: DESTATIS_QUELLE,
  },
  {
    datum: '2026-12-04',
    titel: 'US-Arbeitsmarktbericht für November',
    art: 'konjunktur',
    ort: 'USA',
    uhrzeit: '14:30 Uhr',
    bedeutung:
      'Fünf Tage vor dem Fed-Entscheid vom 9. Dezember, und damit die letzte Arbeitsmarktzahl, die noch einfließt.',
    themen: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
    symbole: ['sp500', 'eur-usd'],
    quelle: BLS_ARBEIT_QUELLE,
  },
  {
    datum: '2026-12-10',
    titel: 'US-Verbraucherpreise für November',
    art: 'konjunktur',
    ort: 'USA',
    uhrzeit: '14:30 Uhr',
    bedeutung:
      'Erscheint einen Tag nach dem Fed-Entscheid – die Sitzung ist dann vorbei. Für die Märkte zählt die Zahl trotzdem: Sie bestimmt die Erwartung an die nächste Sitzung im Januar.',
    themen: ['inflation', 'notenbanken-geldpolitik'],
    symbole: ['sp500', 'eur-usd', 'gold'],
    quelle: BLS_CPI_QUELLE,
  },
  {
    datum: '2026-12-17',
    titel: 'ifo-Geschäftsklimaindex für Dezember',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '10:30 Uhr',
    bedeutung:
      'Am selben Tag entscheidet die EZB über den Leitzins – der Stimmungsindex am Vormittag, der Zins am frühen Nachmittag. Zwei Termine an einem Tag heißt: Wer die Kursbewegung am Abend einem von beiden zuschreibt, rät.',
    themen: ['wie-funktioniert-der-markt', 'notenbanken-geldpolitik'],
    symbole: ['dax'],
    quelle: IFO_QUELLE,
  },
  {
    datum: '2027-01-05',
    titel: 'Inflation Deutschland: Schnellschätzung für Dezember',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '8:00 Uhr',
    bedeutung:
      'Die Jahresrate für das abgelaufene Jahr, vorläufig. Sie ist die Zahl, an der Sparerinnen und Sparer ablesen können, wie viel Kaufkraft ein Tagesgeldkonto im vergangenen Jahr tatsächlich verloren hat.',
    themen: ['inflation', 'tagesgeld', 'notenbanken-geldpolitik'],
    symbole: ['dax', 'eur-usd'],
    quelle: DESTATIS_QUELLE,
  },

  // ------------------------------------------------------------ Notenbanken
  {
    datum: '2026-07-29',
    titel: 'Fed-Zinsentscheid',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Der Leitzins liegt seit Dezember 2025 unverändert bei 3,50 bis 3,75 Prozent. Bewegen wird die Märkte nicht der Beschluss – der ist eingepreist –, sondern jede Abweichung im Wortlaut der Erklärung.',
    themen: ['notenbanken-geldpolitik', 'waehrungen-wechselkurse'],
    symbole: ['sp500', 'eur-usd'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2026-09-10',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Der Einlagensatz ist die Untergrenze für alles, was Banken für Guthaben zahlen. Solange er liegt, bewegen sich Tagesgeldangebote kaum.',
    themen: ['notenbanken-geldpolitik', 'tagesgeld'],
    symbole: ['eur-usd', 'dax'],
    quelle: EZB_QUELLE,
  },
  {
    datum: '2026-09-16',
    titel: 'Fed-Zinsentscheid mit neuen Projektionen',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Vier Mal im Jahr veröffentlicht die Fed zusätzlich die Zinserwartungen ihrer Mitglieder – den sogenannten Dot Plot. Er bewegt die Märkte oft stärker als der Beschluss selbst.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500', 'nasdaq-100'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2026-10-28',
    titel: 'Fed-Zinsentscheid',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Sitzung ohne neue Projektionen. Was zählt, ist die Erklärung und die Pressekonferenz eine halbe Stunde später.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2026-10-29',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Einen Tag nach der Fed. Wer als Erster lockert, schwächt seine Währung – deshalb schauen beide Notenbanken aufeinander, auch wenn sie unabhängig entscheiden.',
    themen: ['notenbanken-geldpolitik', 'waehrungen-wechselkurse'],
    symbole: ['eur-usd'],
    quelle: EZB_QUELLE,
  },
  {
    datum: '2026-12-09',
    titel: 'Fed-Zinsentscheid mit neuen Projektionen',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Letzte Sitzung des Jahres, mit Dot Plot. Hier zeichnet sich ab, was die Fed für das kommende Jahr vorhat.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500', 'gold'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2026-12-17',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Letzter Zinsentscheid des Jahres. Für Sparerinnen und Sparer die Weichenstellung für die Tagesgeldkonditionen im ersten Quartal.',
    themen: ['notenbanken-geldpolitik', 'tagesgeld'],
    symbole: ['eur-usd'],
    quelle: EZB_QUELLE,
  },

  /*
    ------------------------------------------------------ Das Jahr 2027

    Bis zum 7. September 2026 endete dieser Abschnitt am 17. Dezember 2026 –
    sechs Zinsentscheide für ein ganzes Jahr, und danach nichts. Der Betreiber
    hat verlangt, den Kalender „viel ausführlicher und viel genauer" zu machen,
    und bei den Notenbanken ist das die leichteste Übung: Beide veröffentlichen
    ihre Sitzungstermine Jahre im Voraus.

    Die Tage stehen hier so, wie die Quellen sie führen – die EZB-Termine sind
    die **zweiten** Sitzungstage, an denen entschieden wird und die
    Pressekonferenz folgt; die Fed entscheidet am zweiten Tag ihrer
    zweitägigen Sitzung.

    **Die Uhrzeit ist nicht abgeschrieben, sondern gerechnet.** Die Fed
    veröffentlicht um 14:00 Uhr New Yorker Zeit. Das sind in Deutschland
    20:00 Uhr – außer im Umstellungsfenster, in dem Amerika schon auf
    Sommerzeit steht und Europa noch nicht. Der 17. März 2027 fällt genau
    hinein und steht deshalb auf **19:00 Uhr**. Nachgerechnet mit
    `berlinerUhrzeit()` aus `lib/zonenzeit.ts`, nicht im Kopf.

    Was hier bewusst **nicht** steht: Zinsniveaus. Die älteren Einträge nennen
    sie („liegt seit Dezember 2025 bei 3,50 bis 3,75 Prozent"), und das altert –
    für 2027 weiß es niemand.
  */
  {
    datum: '2027-01-27',
    titel: 'Fed-Zinsentscheid',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Erste Sitzung des Jahres, ohne neue Projektionen. Gelesen wird vor allem, was sich im Wortlaut der Erklärung gegenüber Dezember geändert hat – dort steht die Richtung, bevor sie im Zins steht.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2027-02-04',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Erster Zinsentscheid des Jahres. Der Einlagensatz ist die Untergrenze für alles, was Banken für Guthaben zahlen – an ihm hängen die Tagesgeldangebote der nächsten Wochen.',
    themen: ['notenbanken-geldpolitik', 'tagesgeld'],
    symbole: ['eur-usd', 'dax'],
    quelle: EZB_QUELLE,
  },
  {
    datum: '2027-03-17',
    titel: 'Fed-Zinsentscheid mit neuen Projektionen',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '19:00 Uhr',
    bedeutung:
      'Mit Dot Plot – der Zinserwartung jedes einzelnen Mitglieds. Eine Stunde früher als sonst: Amerika steht an diesem Tag schon auf Sommerzeit, Europa noch nicht, und dann sind es fünf Stunden Abstand statt sechs.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500', 'nasdaq-100'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2027-03-18',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Einen Tag nach der Fed, und mit neuen Projektionen der Notenbankvolkswirte. Wer als Erster lockert, schwächt seine Währung – deshalb schauen beide aufeinander, auch wenn sie unabhängig entscheiden.',
    themen: ['notenbanken-geldpolitik', 'waehrungen-wechselkurse'],
    symbole: ['eur-usd', 'dax'],
    quelle: EZB_QUELLE,
  },
  {
    datum: '2027-04-28',
    titel: 'Fed-Zinsentscheid',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Sitzung ohne neue Projektionen. Was zählt, ist die Erklärung und die Pressekonferenz eine halbe Stunde später.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2027-04-29',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Wieder einen Tag nach der Fed. Für Anleihen zählt weniger der Beschluss als der Ausblick: Kursgewinne entstehen dort, wo künftige Zinssenkungen eingepreist werden.',
    themen: ['notenbanken-geldpolitik', 'staatsanleihe'],
    symbole: ['eur-usd'],
    quelle: EZB_QUELLE,
  },
  {
    datum: '2027-06-09',
    titel: 'Fed-Zinsentscheid mit neuen Projektionen',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Zweite Sitzung des Jahres mit Dot Plot. Er bewegt die Märkte oft stärker als der Beschluss selbst, weil er den Pfad zeigt und nicht nur den Punkt.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500', 'gold'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2027-06-10',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Mit neuen Projektionen. Die Inflationsprognose für das übernächste Jahr ist dabei die wichtigste Zahl – an ihr misst die EZB, ob sie ihr Ziel erreicht.',
    themen: ['notenbanken-geldpolitik', 'inflation'],
    symbole: ['eur-usd', 'dax'],
    quelle: EZB_QUELLE,
  },
  {
    datum: '2027-07-22',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Letzter Entscheid vor der Sommerpause – die nächste Sitzung folgt erst im September. Was hier gesagt wird, trägt sieben Wochen.',
    themen: ['notenbanken-geldpolitik', 'tagesgeld'],
    symbole: ['eur-usd'],
    quelle: EZB_QUELLE,
  },
  {
    datum: '2027-07-28',
    titel: 'Fed-Zinsentscheid',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Sitzung ohne Projektionen, mitten in der Berichtssaison für das zweite Quartal. Zwei Treiber an einem Tag – der Zins und die Zahlen.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2027-09-09',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Erster Entscheid nach der Sommerpause, mit neuen Projektionen. Bis hierhin haben sich drei Monate Konjunkturdaten angesammelt.',
    themen: ['notenbanken-geldpolitik', 'inflation'],
    symbole: ['eur-usd', 'dax'],
    quelle: EZB_QUELLE,
  },
  {
    datum: '2027-09-15',
    titel: 'Fed-Zinsentscheid mit neuen Projektionen',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Dritte Sitzung des Jahres mit Dot Plot. Hier zeigt sich, ob die Erwartung vom Juni gehalten hat oder verschoben wurde.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500', 'nasdaq-100'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2027-10-27',
    titel: 'Fed-Zinsentscheid',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Sitzung ohne Projektionen. Einen Tag später entscheidet die EZB – dieselbe Reihenfolge wie im Oktober 2026.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2027-10-28',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Einen Tag nach der Fed. Für den Wechselkurs zählt nicht, wer wie hoch steht, sondern wer sich in welche Richtung bewegt.',
    themen: ['notenbanken-geldpolitik', 'waehrungen-wechselkurse'],
    symbole: ['eur-usd'],
    quelle: EZB_QUELLE,
  },
  {
    datum: '2027-12-08',
    titel: 'Fed-Zinsentscheid mit neuen Projektionen',
    art: 'notenbank',
    ort: 'USA',
    uhrzeit: '20:00 Uhr',
    bedeutung:
      'Letzte Sitzung des Jahres, mit Dot Plot. Hier zeichnet sich ab, was die Fed für das kommende Jahr vorhat.',
    themen: ['notenbanken-geldpolitik'],
    symbole: ['sp500', 'gold'],
    quelle: FED_QUELLE,
  },
  {
    datum: '2027-12-16',
    titel: 'EZB-Zinsentscheid',
    art: 'notenbank',
    ort: 'Eurozone',
    uhrzeit: '14:15 Uhr, Pressekonferenz 14:45 Uhr',
    bedeutung:
      'Letzter Zinsentscheid des Jahres, mit neuen Projektionen. Für Sparerinnen und Sparer die Weichenstellung für die Tagesgeldkonditionen im ersten Quartal.',
    themen: ['notenbanken-geldpolitik', 'tagesgeld'],
    symbole: ['eur-usd'],
    quelle: EZB_QUELLE,
  },

  // --------------------------------------------------------- Berichtssaison
  {
    datum: '2026-07-29',
    titel: 'Quartalszahlen: Microsoft und Meta',
    art: 'berichtssaison',
    ort: 'USA',
    uhrzeit: 'nach US-Börsenschluss',
    bedeutung:
      'Beide gehören zu den schwersten Werten im S&P 500 und damit auch in jedem weltweit streuenden ETF. Ein Kurs kann trotz Rekordzahlen fallen – entscheidend ist die Abweichung von der Erwartung, nicht die Zahl.',
    themen: ['aktie', 'etf'],
    symbole: ['microsoft', 'meta'],
    quelle: {
      label: 'boersennews: Wochenvorschau KW 31',
      url: 'https://www.boersennews.de/nachrichten/service/community/wochenvorschau-kw-31-rekorddichte-berichtswoche-apple-microsoft-meta-und-der-fed-entscheid/5220495/',
    },
  },
  {
    datum: '2026-07-30',
    titel: 'Quartalszahlen: Apple und Amazon',
    art: 'berichtssaison',
    ort: 'USA',
    uhrzeit: 'nach US-Börsenschluss',
    bedeutung:
      'Zusammen mit Microsoft und Meta die vier schwersten Einzelwerte weltweit. Wer breit gestreut anlegt, hält von ihnen mehr, als die Zahl der enthaltenen Titel vermuten lässt.',
    themen: ['aktie', 'etf'],
    symbole: ['apple', 'amazon'],
    quelle: {
      label: 'boersennews: Wochenvorschau KW 31',
      url: 'https://www.boersennews.de/nachrichten/service/community/wochenvorschau-kw-31-rekorddichte-berichtswoche-apple-microsoft-meta-und-der-fed-entscheid/5220495/',
    },
  },
  {
    datum: '2026-10-12',
    bis: '2026-11-13',
    titel: 'Berichtssaison zum dritten Quartal',
    art: 'berichtssaison',
    bedeutung:
      'Das übliche Fenster: US-Großbanken machen den Anfang, die Technologiekonzerne folgen Ende Oktober, die DAX-Unternehmen verteilen sich über den gesamten Zeitraum. Den genauen Tag kündigt jedes Unternehmen selbst wenige Wochen vorher an.',
    themen: ['aktie', 'anlegerpsychologie'],
    quelle: {
      label: 'Quartalszahlen.info: Kalender und Termine',
      url: 'https://quartalszahlen.info/',
    },
  },
  {
    datum: '2027-01-11',
    bis: '2027-02-19',
    titel: 'Berichtssaison zum Geschäftsjahr 2026',
    art: 'berichtssaison',
    bedeutung:
      'Die Jahreszahlen wiegen schwerer als ein einzelnes Quartal: Hier stehen der Ausblick auf das neue Jahr und der Dividendenvorschlag. Beides bewegt Kurse stärker als der abgelaufene Gewinn.',
    themen: ['aktie', 'wann-kaufen-verkaufen'],
    quelle: {
      label: 'Quartalszahlen.info: Kalender und Termine',
      url: 'https://quartalszahlen.info/',
    },
  },
  /*
    Die drei Fenster des Jahres 2027.

    Ein Fenster ist eine Aussage über ein wiederkehrendes Muster, kein
    abgeschriebener Termin – deshalb steht es hier und nicht als Einzeldatum:
    Beginn ist jeweils die Woche, in der die US-Großbanken eröffnen (zweiter
    Montag des Folgemonats), Ende gut vier Wochen später. Den **Tag** eines
    einzelnen Unternehmens holt die Seite aus vier Quellen (siehe
    `lib/quartalstermine.ts`) und schreibt ihn an die Aktie, nicht hierhin.
  */
  {
    datum: '2027-04-12',
    bis: '2027-05-14',
    titel: 'Berichtssaison zum ersten Quartal 2027',
    art: 'berichtssaison',
    bedeutung:
      'Das erste Quartal zeigt, ob der im Februar gegebene Jahresausblick trägt. Eine Bestätigung bewegt wenig, eine Senkung viel – und eine Anhebung schon im ersten Quartal ist selten.',
    themen: ['aktie', 'anlegerpsychologie'],
    quelle: {
      label: 'Quartalszahlen.info: Kalender und Termine',
      url: 'https://quartalszahlen.info/',
    },
  },
  {
    datum: '2027-07-12',
    bis: '2027-08-13',
    titel: 'Berichtssaison zum zweiten Quartal 2027',
    art: 'berichtssaison',
    bedeutung:
      'Mit dem Halbjahr kommen bei vielen Unternehmen die Zwischenberichte, die mehr enthalten als eine Quartalsmitteilung. Sie fällt in die umsatzschwachen Sommerwochen – dieselbe Nachricht bewegt den Kurs dann stärker als im Oktober.',
    themen: ['aktie', 'etf'],
    quelle: {
      label: 'Quartalszahlen.info: Kalender und Termine',
      url: 'https://quartalszahlen.info/',
    },
  },
  {
    datum: '2027-10-11',
    bis: '2027-11-12',
    titel: 'Berichtssaison zum dritten Quartal 2027',
    art: 'berichtssaison',
    bedeutung:
      'Das letzte volle Quartal vor dem Jahresabschluss. Wer seine Prognose bis hierhin nicht gesenkt hat, wird sie meist auch halten – die Zahl der Warnungen im Oktober ist deshalb ein Stimmungsbild für den Jahresausblick.',
    themen: ['aktie', 'anlegerpsychologie'],
    quelle: {
      label: 'Quartalszahlen.info: Kalender und Termine',
      url: 'https://quartalszahlen.info/',
    },
  },

  // ------------------------------------------------------------ Verfallstage
  {
    datum: '2026-09-18',
    titel: 'Großer Verfallstag',
    art: 'verfallstag',
    bedeutung:
      'Viermal im Jahr laufen am dritten Freitag Index- und Aktienoptionen sowie Terminkontrakte gleichzeitig aus. Der Handel ist dann unruhiger und die Umsätze sind höher, ohne dass sich an den Unternehmen etwas geändert hätte.',
    themen: ['derivat', 'option'],
    symbole: ['dax'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2026-12-18',
    titel: 'Großer Verfallstag',
    art: 'verfallstag',
    bedeutung:
      'Letzter großer Verfallstag des Jahres. Wer eine Order für diesen Tag plant, sollte mit größeren Ausschlägen rechnen – ein Limit ist hier sinnvoller als eine Market-Order.',
    themen: ['derivat', 'option'],
    symbole: ['dax'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2027-03-19',
    titel: 'Großer Verfallstag',
    art: 'verfallstag',
    bedeutung:
      'Erster großer Verfallstag des Jahres 2027, wieder am dritten Freitag des Quartalsmonats. Die Regel ist alt und ausnahmslos – deshalb stehen diese Tage hier für Jahre im Voraus.',
    themen: ['derivat', 'option'],
    symbole: ['dax'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2027-06-18',
    titel: 'Großer Verfallstag',
    art: 'verfallstag',
    bedeutung:
      'Ein Sonderfall: In Deutschland wird an diesem dritten Freitag abgerechnet, in New York bleiben die Börsen wegen Juneteenth geschlossen. Wer US-Werte über einen deutschen Handelsplatz handelt, findet an diesem Tag also die Unruhe des Verfalls und dünne Bücher zugleich.',
    themen: ['derivat', 'option'],
    symbole: ['dax'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2027-09-17',
    titel: 'Großer Verfallstag',
    art: 'verfallstag',
    bedeutung:
      'Dritter Verfallstag des Jahres. Die Umsätze sind an diesen Tagen ein Vielfaches des Üblichen, weil Positionen geschlossen oder in den nächsten Kontrakt gerollt werden – am Unternehmen selbst hat sich nichts geändert.',
    themen: ['derivat', 'option'],
    symbole: ['dax'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2027-12-17',
    titel: 'Großer Verfallstag',
    art: 'verfallstag',
    bedeutung:
      'Letzter großer Verfallstag des Jahres 2027, einen Tag nach dem EZB-Zinsentscheid. Wer eine Order für diesen Tag plant, sollte ein Limit setzen statt zum nächsten verfügbaren Kurs zu kaufen.',
    themen: ['derivat', 'option'],
    symbole: ['dax'],
    quelle: XETRA_QUELLE,
  },

  // -------------------------------------------------------- Börsenfeiertage
  {
    datum: '2026-09-07',
    titel: 'Labor Day – US-Börsen geschlossen',
    art: 'boersenfeiertag',
    ort: 'USA',
    bedeutung:
      'In Deutschland wird normal gehandelt, in New York nicht. Bei US-Aktien fehlt an solchen Tagen der Heimatmarkt – die Spanne zwischen Kauf- und Verkaufskurs ist an deutschen Handelsplätzen dann meist größer.',
    themen: ['boerse', 'depot-und-broker'],
    quelle: NYSE_QUELLE,
  },
  {
    datum: '2026-11-26',
    titel: 'Thanksgiving – US-Börsen geschlossen',
    art: 'boersenfeiertag',
    ort: 'USA',
    bedeutung:
      'Am Folgetag, dem 27. November, schließen NYSE und Nasdaq bereits um 19:00 Uhr deutscher Zeit. Die Umsätze gehören dann zu den niedrigsten des Jahres.',
    themen: ['boerse'],
    quelle: NYSE_QUELLE,
  },
  {
    datum: '2026-12-24',
    titel: 'Heiligabend – kein Handel in Deutschland',
    art: 'boersenfeiertag',
    ort: 'Deutschland',
    bedeutung:
      'Xetra und die Börse Frankfurt bleiben geschlossen, obwohl es kein gesetzlicher Feiertag ist. In den USA wird verkürzt bis 19:00 Uhr deutscher Zeit gehandelt.',
    themen: ['boerse'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2026-12-25',
    titel: '1. Weihnachtstag – Börsen geschlossen',
    art: 'boersenfeiertag',
    bedeutung:
      'Weltweit handelsfrei. Kryptowährungen werden weiter gehandelt – dort gibt es keinen Handelsschluss.',
    themen: ['boerse', 'bitcoin-krypto'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2026-12-31',
    titel: 'Silvester – kein Handel in Deutschland',
    art: 'boersenfeiertag',
    ort: 'Deutschland',
    bedeutung:
      'Der letzte Handelstag des Jahres ist der 30. Dezember. Wer Verluste noch im laufenden Steuerjahr realisieren will, muss das vorher erledigen – die Bank braucht die Ausführung, nicht die Order.',
    themen: ['boerse', 'sparerpauschbetrag'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2027-01-01',
    titel: 'Neujahr – Börsen geschlossen',
    art: 'boersenfeiertag',
    bedeutung:
      'Zum Jahreswechsel setzen Banken den Sparerpauschbetrag zurück und die Vorabpauschale für Fonds wird für das abgelaufene Jahr berechnet.',
    themen: ['sparerpauschbetrag', 'fonds'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2027-01-18',
    titel: 'Martin-Luther-King-Tag – US-Börsen geschlossen',
    art: 'boersenfeiertag',
    ort: 'USA',
    bedeutung:
      'Xetra handelt normal, New York nicht. Eine Order in einer US-Aktie wird an einem deutschen Handelsplatz zwar ausgeführt, aber ohne den Heimatmarkt als Preisanker – die Spanne zwischen An- und Verkauf ist dann größer als sonst.',
    themen: ['boerse', 'depot-und-broker'],
    quelle: NYSE_QUELLE,
  },
  {
    datum: '2027-02-15',
    titel: 'Presidents’ Day – US-Börsen geschlossen',
    art: 'boersenfeiertag',
    ort: 'USA',
    bedeutung:
      'Der dritte Montag im Februar, in den Börsenkalendern als „Washington’s Birthday“ geführt. Mitten in der Berichtssaison zum Geschäftsjahr – Zahlen, die über dieses Wochenende gemeldet werden, bewegen den Kurs erst am Dienstag.',
    themen: ['boerse'],
    quelle: NYSE_QUELLE,
  },
  {
    datum: '2027-03-26',
    titel: 'Karfreitag – Börsen geschlossen',
    art: 'boersenfeiertag',
    bedeutung:
      'Handelsfrei in Deutschland und in den USA. Der lange Wochenende-Effekt: Nachrichten aus dieser Zeit werden erst am Dienstag eingepreist, und zwar als Kurslücke.',
    themen: ['boerse', 'wann-kaufen-verkaufen'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2027-03-29',
    titel: 'Ostermontag – kein Handel in Deutschland',
    art: 'boersenfeiertag',
    ort: 'Deutschland',
    bedeutung:
      'Xetra und die Börse Frankfurt bleiben geschlossen, die US-Börsen handeln normal. Vier handelsfreie Tage in Folge in Deutschland, aber nur drei in New York – wer über Ostern investiert ist, trägt einen ganzen US-Handelstag ohne Ausstiegsmöglichkeit.',
    themen: ['boerse', 'wann-kaufen-verkaufen'],
    quelle: XETRA_QUELLE,
  },
  {
    datum: '2027-05-31',
    titel: 'Memorial Day – US-Börsen geschlossen',
    art: 'boersenfeiertag',
    ort: 'USA',
    bedeutung:
      'Der letzte Montag im Mai und der inoffizielle Sommeranfang an der Wall Street. Von hier an dünnen die Umsätze bis in den September aus, und einzelne Nachrichten bewegen die Kurse stärker.',
    themen: ['boerse'],
    quelle: NYSE_QUELLE,
  },
  {
    datum: '2027-06-18',
    titel: 'Juneteenth – US-Börsen geschlossen',
    art: 'boersenfeiertag',
    ort: 'USA',
    bedeutung:
      'Der Feiertag fällt 2027 auf einen Samstag und wird am Freitag davor begangen – und das ist ausgerechnet der große Verfallstag. In Deutschland wird an diesem Tag abgerechnet, in New York nicht.',
    themen: ['boerse', 'derivat'],
    quelle: NYSE_QUELLE,
  },
  {
    datum: '2027-07-05',
    titel: 'Unabhängigkeitstag – US-Börsen geschlossen',
    art: 'boersenfeiertag',
    ort: 'USA',
    bedeutung:
      'Der 4. Juli fällt auf einen Sonntag, deshalb ruht der Handel am Montag darauf. Die Woche danach eröffnet die Berichtssaison zum zweiten Quartal.',
    themen: ['boerse'],
    quelle: NYSE_QUELLE,
  },
  {
    datum: '2027-09-06',
    titel: 'Labor Day – US-Börsen geschlossen',
    art: 'boersenfeiertag',
    ort: 'USA',
    bedeutung:
      'Das Gegenstück zum Memorial Day: Nach diesem Montag kehren die großen Adressen an die Schreibtische zurück, die Umsätze ziehen an, und der September gilt statistisch als der schwächste Börsenmonat des Jahres.',
    themen: ['boerse', 'anlegerpsychologie'],
    quelle: NYSE_QUELLE,
  },
  {
    datum: '2027-11-25',
    titel: 'Thanksgiving – US-Börsen geschlossen',
    art: 'boersenfeiertag',
    ort: 'USA',
    bedeutung:
      'Am Folgetag, dem 26. November, schließen NYSE und Nasdaq bereits um 19:00 Uhr deutscher Zeit. Diese verkürzten Tage tragen die dünnsten Bücher des Jahres – eine Market-Order trifft dann leicht einen Kurs, den niemand für fair hielte.',
    themen: ['boerse', 'depot-und-broker'],
    quelle: NYSE_QUELLE,
  },
  {
    datum: '2027-12-24',
    titel: 'Heiligabend – Börsen in Deutschland und den USA geschlossen',
    art: 'boersenfeiertag',
    bedeutung:
      'Ein seltener Gleichklang: In Deutschland ist der 24. Dezember ohnehin handelsfrei, und weil der 1. Weihnachtstag 2027 auf einen Samstag fällt, begehen ihn die US-Börsen am Freitag davor. Weltweit also kein Handel.',
    themen: ['boerse'],
    quelle: NYSE_QUELLE,
  },
  {
    datum: '2027-12-31',
    titel: 'Silvester – kein Handel in Deutschland',
    art: 'boersenfeiertag',
    ort: 'Deutschland',
    bedeutung:
      'Der letzte deutsche Handelstag des Jahres ist der 30. Dezember. Wer Verluste noch im laufenden Steuerjahr realisieren will, braucht die Ausführung bis dahin – eine Order allein genügt der Bank nicht.',
    themen: ['boerse', 'sparerpauschbetrag'],
    quelle: XETRA_QUELLE,
  },

  // ------------------------------------------------------------------ Wahlen
  {
    datum: '2026-11-03',
    titel: 'US-Zwischenwahlen',
    art: 'wahl',
    ort: 'USA',
    bedeutung:
      'Gewählt wird das gesamte Repräsentantenhaus und ein Drittel des Senats. Für die Märkte zählt vor allem, ob die Regierung ihre Mehrheit behält – davon hängt ab, was von ihrem wirtschaftspolitischen Programm noch umsetzbar ist.',
    themen: ['wie-funktioniert-der-markt', 'anlegerpsychologie'],
    symbole: ['sp500', 'eur-usd'],
    quelle: {
      label: 'Bundeszentrale für politische Bildung: Wahlen in den USA',
      url: 'https://www.bpb.de/themen/nordamerika/usa/',
    },
  },
]
