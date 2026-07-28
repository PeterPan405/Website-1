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

const BLS_QUELLE = {
  label: 'US Bureau of Labor Statistics: Release Schedule',
  url: 'https://www.bls.gov/schedule/2026/11_sched_list.htm',
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
  // ------------------------------------------------------------ Konjunktur
  {
    datum: '2026-07-30',
    titel: 'Inflation Deutschland: Schnellschätzung für Juli',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '14:00 Uhr',
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
    datum: '2026-09-24',
    titel: 'ifo-Geschäftsklimaindex für September',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '10:00 Uhr',
    bedeutung:
      'Lage und Erwartungen werden getrennt erhoben und lohnen den getrennten Blick: Steigt der Gesamtindex nur, weil die Erwartungen anziehen, hat sich an der tatsächlichen Geschäftslage noch nichts geändert.',
    themen: ['wie-funktioniert-der-markt', 'anlegerpsychologie'],
    symbole: ['dax'],
    quelle: IFO_QUELLE,
  },
  {
    datum: '2026-10-26',
    titel: 'ifo-Geschäftsklimaindex für Oktober',
    art: 'konjunktur',
    ort: 'Deutschland',
    uhrzeit: '10:00 Uhr',
    bedeutung:
      'Der meistbeachtete Frühindikator der deutschen Wirtschaft. Für ein einzelnes Depot folgt daraus nichts – für die Frage, wie die Notenbank in den kommenden Monaten entscheidet, schon.',
    themen: ['wie-funktioniert-der-markt', 'notenbanken-geldpolitik'],
    symbole: ['dax'],
    quelle: IFO_QUELLE,
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
    quelle: BLS_QUELLE,
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
    quelle: BLS_QUELLE,
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
      'Erster großer Verfallstag des Jahres 2027, wieder am dritten Freitag des Quartalsmonats.',
    themen: ['derivat', 'option'],
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
    datum: '2027-03-26',
    titel: 'Karfreitag – Börsen geschlossen',
    art: 'boersenfeiertag',
    bedeutung:
      'Handelsfrei in Deutschland und in den USA. Der lange Wochenende-Effekt: Nachrichten aus dieser Zeit werden erst am Dienstag eingepreist, und zwar als Kurslücke.',
    themen: ['boerse', 'wann-kaufen-verkaufen'],
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
