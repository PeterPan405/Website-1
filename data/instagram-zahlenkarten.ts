/**
 * Die Zahlenkarten – je Erscheinungstag eine, abgestimmt **bevor** sie hier
 * steht.
 *
 * Ablauf (Anordnung des Betreibers vom 15.10.2026, beschrieben in
 * `INSTAGRAM.md`): Thema aus den Vorschlägen gewählt → Karte hier eingetragen
 * → Entwurf um 16 Uhr im Chat → Freigabe → bis 17 Uhr im Kanal über
 * `instagram-zahlenkarte.yml`. Gesetzt wird die Karte von
 * `lib/instagram-zahlenkarte.ts`, ausgeliefert unter `/instagram/zahlenkarte.jpg`.
 *
 * **Jede Zahl mit Quelle und Stand.** Was hier steht, geht unter dem Namen
 * IM Invests hinaus – dieselbe Regel wie für die Nachrichten.
 */
import type { Zahlenkarte } from '../lib/instagram-zahlenkarte.ts'
import {
  ATOM_CHINA,
  ATOM_FRANKREICH,
  ATOM_GROSSBRITANNIEN,
  ATOM_INDIEN,
  ATOM_ISRAEL,
  ATOM_NORDKOREA,
  ATOM_PAKISTAN,
  ATOM_RUSSLAND,
  ATOM_USA,
  ATOM_WELT,
} from './instagram-reihen-atomwaffen.ts'
import { DAX_NUR_SOMMER, DAX_NUR_WINTER } from './instagram-reihen-dax-halbjahre.ts'

export const zahlenkarten: Zahlenkarte[] = [
  {
    /*
      Zahlenkarte 07.11.2026, „Krieg im Supermarkt“ (Titel nach dem ersten
      Posten geändert: „Essen an der Börse“ → „Lebensmittel an der Börse“,
      Betreiber: „klingt nicht gut“; der erste Beitrag wurde gelöscht) – vom Betreiber gewählt
      aus drei Vorschlägen, nachdem er Gold (Balken, Kurve) als „langweilig
      … das weiß schon jeder“ verworfen hatte. Form: Säulen (am 06.11.
      Balken).

      Quelle: Weltbank, Commodity Price Data („Pink Sheet"),
      CMO-Historical-Data-Monthly.xlsx, „Updated on November 03, 2026",
      abgerufen am 06.11.2026 über quellen-holen.yml (blatt 2).
      Weltmarktpreise, Monatsmittel, nominal, Januar 2026 (vor dem Krieg um
      den Iran, Beginn Ende Februar) gegen Oktober 2026:
        Zucker (Sugar, world)    0,32 → 0,43 $/kg   +34,4 %
        Weizen (Wheat, US HRW)  249,9 → 317,0 $/t   +26,9 %
        Reis (Rice, Thai 5%)    408   → 489   $/t   +19,9 %
        Kakao (Cocoa)            4,97 → 5,75 $/kg   +15,7 %
        Hähnchen (Chicken)       1,75 → 1,84 $/kg    +5,1 %
        Kaffee (Coffee, Arabica) 8,02 → 7,40 $/kg    −7,7 %
        Rind (Beef)              7,97 → 6,83 $/kg   −14,3 %
        Orangen (Orange)         1,11 → 0,75 $/kg   −32,4 %
      Die Weltbank gibt Zucker auf zwei Nachkommastellen an; die Prozente
      sind aus diesen Werten gerechnet.

      Heldenzahl auf Wunsch des Betreibers („die durchschnittliche Teuerung
      im Supermarkt"): Destatis, Pressemitteilung Nr. 382 vom 30.10.2026
      (PD26_382_611), Tabelle „Jährliche Veränderung": Nahrungsmittel
      Oktober 2026 +0,4 % (vorläufig; Juli 0,4, August 0,1, September 0,4).
      Gesamt +2,8 %, Energie +12,2 %. Abgerufen am 07.11.2026 über
      quellen-holen.yml. Kein Mittel aus den Säulen – das wäre eine
      selbst gewählte Auswahl.

      Drei Heldenzahlen auf Wunsch des Betreibers („weltweite Teuerung und
      Euro und Teuerung in Deutschland"), je Oktober 2026 zum Vorjahresmonat:
        Welt        FAO Food Price Index, ffpi-data-2026-11.xlsx (Stand
                    06.11.2026): 10/2026 133,92 gegen 10/2025 126,42 → +5,9 %
        Euroraum    Eurostat, Flash estimate October 2026 (euro indicators
                    2-04112026-ap): food, alcohol & tobacco 1,6 %
        Deutschland Destatis PD26_382_611: Nahrungsmittel +0,4 % (vorläufig)
      Produktfotos statt Emoji (Betreiber: „sehen aus wie Kindersymbole"):
      Wikimedia Commons, Nachweise in der Beschreibung.
    */
    art: 'saeulen',
    datum: '2026-11-07',
    titel: [{ text: 'Lebensmittel' }, { text: 'an der Börse.', gruen: true }],
    erklaerung: 'Agrarrohstoffe · Weltmarktpreis Januar → Oktober 2026',
    stichzeile: 'Lebensmittel · Oktober zum Vorjahr',
    helden: [
      { name: 'Welt', wert: '+5,9 %', pille: { wert: 'FAO', name: 'Index' } },
      {
        name: 'Euroraum',
        wert: '+1,6 %',
        pille: { wert: 'Eurostat', name: 'Schätzung' },
      },
      {
        name: 'Deutschland',
        wert: '+0,4 %',
        pille: { wert: 'Destatis', name: 'vorläufig' },
      },
    ],
    saeulen: [
      { text: 'Zucker', wert: 34.38, symbol: 'zucker.jpg' },
      { text: 'Weizen', wert: 26.85, symbol: 'weizen.jpg' },
      { text: 'Reis', wert: 19.85, symbol: 'reis.jpg' },
      { text: 'Kakao', wert: 15.69, symbol: 'kakao.jpg' },
      { text: 'Hähnchen', wert: 5.14, symbol: 'haehnchen.jpg' },
      { text: 'Kaffee', wert: -7.73, symbol: 'kaffee.jpg' },
      { text: 'Rind', wert: -14.3, symbol: 'rind.jpg' },
      { text: 'Orangen', wert: -32.43, symbol: 'orangen.jpg' },
    ],
    einheit: '%',
    nachkomma: 0,
    fusszeile:
      'Stand: 10/2026 | Quellen: FAO, Eurostat, Destatis, Weltbank (Pink Sheet) | Fotos: Wikimedia Commons',
    text:
      'Krieg um den Iran – werden Lebensmittel teurer? Teuerung bei Lebensmitteln im Oktober, gegenüber Oktober 2025:\n' +
      'Welt: +5,9 % (FAO-Lebensmittelpreisindex)\n' +
      'Euroraum: +1,6 % (inkl. Alkohol und Tabak, Schnellschätzung Eurostat)\n' +
      'Deutschland: +0,4 % (vorläufig, Statistisches Bundesamt)\n\n' +
      'Wusstest du: Viele Lebensmittel sind Börsenware. Zucker, Weizen, Reis, Kakao, Kaffee und Rinder werden an Rohstoffbörsen gehandelt, etwa in Chicago, New York und London – als Terminkontrakte.\n\n' +
      'Die Weltmarktpreise im Bild (Weltbank, Oktober gegen Januar 2026, vor dem Krieg):\n' +
      'Zucker +34 % · Weizen +27 % · Reis +20 % · Kakao +16 % · Hähnchen +5 % · Kaffee −8 % · Rind −14 % · Orangen −32 %\n\n' +
      'Schon gewusst?\n' +
      '– Kakao kostete im Januar 2025 noch 10,75 $ je Kilo – heute nur noch gut die Hälfte.\n' +
      '– Die Inflation insgesamt lag im Oktober im Euroraum bei 4,0 %, in Deutschland bei 2,8 %.\n\n' +
      'Warum?\n' +
      'Die Zahlen nennen keine Gründe, und wir raten nicht. Sie zeigen nur: Der Weltmarkt ist nicht der Supermarkt.\n\n' +
      'Quellen: FAO Food Price Index (6.11.2026); Eurostat, Schnellschätzung Oktober 2026; Statistisches Bundesamt, PM Nr. 382 (30.10.2026); Weltbank, Pink Sheet (3.11.2026), Monatsmittel in US-Dollar; eigene Rechnung\n' +
      'Fotos (Wikimedia Commons): Dietmar Rabich, CC BY-SA 4.0 (Zucker); Bluemoose, CC BY-SA 3.0 (Weizen); Rocky Masum, CC BY-SA 4.0 (Reis); Roger Culos, CC BY-SA 3.0 (Kakao); Baoothersks, CC BY-SA 4.0 (Hähnchen); MarkSweep, gemeinfrei (Kaffee); Jellaluna, CC BY 2.0 (Rind); Evan-Amos, CC BY-SA 3.0 (Orangen)',
    schlagworte: ['lebensmittel', 'inflation', 'iran', 'rohstoffe', 'supermarkt'],
    freigabe: '2026-11-07',
  },
  {
    /*
      Zahlenkarte 06.11.2026. Keine Wahl des Betreibers für heute; der erste
      offene Vorschlag (Bank of England) stand schon in der Tagesausgabe vom
      06.11. – der Betreiber verwarf am 02.11. Themen, die „doch alles schon
      in den News“ waren. Daher der dritte Vorschlag: Gold gegen Krisen.
      Form: waagerechte Balken (am 05.11. Zeitstrahl).

      Quelle: Weltbank, Commodity Price Data („Pink Sheet"),
      CMO-Historical-Data-Monthly.xlsx, „Updated on November 03, 2026",
      abgerufen am 06.11.2026 über quellen-holen.yml (blatt 2). Reihe „Gold",
      $ je Feinunze, Monatsmittel, nominal. Gerechnet: Monat vor Beginn
      gegen den zwölften Monat ab Beginn (2026: Februar bis Oktober, neun
      Monate):
        1973 (Okt.)  09/1973   103 → 09/1974   152    +48 %
        1979 (Jan.)  12/1978   208 → 12/1979   455   +119 %
        1987 (Okt.)  09/1987   460 → 09/1988   413    −10 %
        (1990, Irak/Kuwait: 363 → 368, +1 % – weggelassen, höchstens acht Balken)
        2001 (Sept.) 08/2001   272 → 08/2002   310    +14 %
        2008 (Sept.) 08/2008   839 → 08/2009   949    +13 %
        2020 (März)  02/2020 1.597 → 02/2021 1.808    +13 %
        2022 (Feb.)  01/2022 1.816 → 01/2023 1.898     +5 %
        2026 (Feb.)  01/2026 4.753 → 10/2026 4.105    −14 %
        2026 weiter: 02 5.020 (Höchststand der Reihe) · 03 4.856 · 04 4.721
        · 05 4.587 · 06 4.228 · 07 4.073 · 08 4.411 · 09 4.319
      Abgleich: unsere Ausgaben nennen Ende Oktober/Anfang November 2026
      Gold um 4.000 bis 4.200 $ (Goldreporter) – passt zur Reihe.
    */
    art: 'balken',
    datum: '2026-11-06',
    titel: [{ text: 'Gold in der Krise:' }, { text: 'Nicht immer sicher.', gruen: true }],
    erklaerung:
      'Goldpreis ein Jahr nach Beginn gegen den Monat davor. 2026: bis Oktober.',
    stichzeile: 'Gold · nach Kriegen und Krisen',
    helden: [
      {
        name: 'Krieg um den Iran',
        wert: '−14 %',
        pille: { wert: '4.105 $', name: 'je Unze im Oktober' },
      },
    ],
    balken: [
      { marke: '1973', text: 'Ölembargo', wert: 47.57 },
      { marke: '1979', text: 'Revolution im Iran', wert: 118.75 },
      { marke: '1987', text: 'Börsencrash', wert: -10.22 },
      { marke: '2001', text: '11. September', wert: 13.97 },
      { marke: '2008', text: 'Finanzkrise', wert: 13.11 },
      { marke: '2020', text: 'Corona', wert: 13.21 },
      { marke: '2022', text: 'Krieg in der Ukraine', wert: 4.52 },
      { marke: '2026', text: 'Krieg um den Iran', wert: -13.63, hervor: true },
    ],
    einheit: '%',
    fusszeile: 'Stand: 10/2026 | Quelle: Weltbank (Pink Sheet), Gold; eigene Rechnung',
    text:
      'Gold gilt als sicherer Hafen in der Krise. Stimmt das? Gemessen mit Monatspreisen der Weltbank: der Goldpreis ein Jahr nach Beginn, gegen den Monat davor.\n\n' +
      'Die Balken im Bild, Fall für Fall ($ je Unze):\n' +
      '1973 – Ölembargo: 103 → 152, +48 %\n' +
      '1979 – Revolution im Iran: 208 → 455, +119 %\n' +
      '1987 – Börsencrash: 460 → 413, −10 %\n' +
      '2001 – 11. September: 272 → 310, +14 %\n' +
      '2008 – Finanzkrise: 839 → 949, +13 %\n' +
      '2020 – Corona: 1.597 → 1.808, +13 %\n' +
      '2022 – Krieg in der Ukraine: 1.816 → 1.898, +5 %\n' +
      '2026 – Krieg um den Iran: 4.753 → 4.105, −14 % (bis Oktober)\n\n' +
      'Sechs von acht Mal stieg Gold. Zweimal fiel es: nach dem Crash 1987 – und jetzt.\n\n' +
      'Warum fällt Gold 2026?\n' +
      'Die Preisreihe nennt keinen Grund. Ein Hinweis aus unseren News: Am 30. Oktober fiel Gold laut Goldreporter unter 4.000 $ – mitgerissen vom Ausverkauf bei Technologieaktien.\n\n' +
      'Schon gewusst?\n' +
      '– Im Februar 2026, als der Krieg begann, kostete Gold im Schnitt 5.020 $ – so viel wie nie zuvor in der Reihe seit 1960.\n' +
      '– Im August 1971 kostete eine Unze 43 $. Im Januar 1980 waren es 675 $.\n' +
      '– Trotz des Rückgangs liegt Gold rund 50 % über Januar 2025 (2.710 $).\n\n' +
      'Und jetzt?\n' +
      'Seit Juli schwankt der Preis zwischen 4.073 und 4.411 $. Wie es weitergeht, sagen die Daten nicht.\n\n' +
      'Gerechnet: Monatsdurchschnitt, nicht inflationsbereinigt.\n' +
      'Quelle: Weltbank, Commodity Price Data („Pink Sheet"), Stand 3. November 2026; Goldreporter; eigene Rechnung',
    schlagworte: ['gold', 'krise', 'iran', 'rohstoffe', 'geopolitik'],
  },
  {
    /*
      Thema: Vorschlag 1 vom 01.11.2026 („Lagarde geht vorzeitig"). Der
      Betreiber hat keinen Vorschlag gewählt, also der erste offene. Form:
      Zeitstrahl im Hausstil, neu (am 01.11. Säulen).

      Quellen, gelesen am 02.11.2026 über quellen-holen.yml:
      - Tagesschau, „EZB-Chefin Lagarde tritt im Februar vorzeitig zurück",
        29.10.2026: Lagarde gibt ihr Amt zum 7. Februar 2027 auf, die
        achtjährige Amtszeit endete regulär Ende Oktober 2027. Nachfolge
        vor der Präsidentschaftswahl in Frankreich (April 2027); Merz:
        Besetzung bis Jahresende; Favoriten Klaas Knot und Pablo Hernández
        de Cos, Joachim Nagel hat sich ins Spiel gebracht; Deutschland
        stellte noch nie die EZB-Spitze.
      - Handelsblatt, 29.10.2026: Lagarde will offen sprechen können, vor
        allem zur Frankreich-Wahl; die Neutralität des Amtes sei damit
        nicht vereinbar.
      - Wikipedia, „Präsident der Europäischen Zentralbank" (Stand
        01.11.2026): reguläre Amtszeit 8 Jahre, keine Wiederwahl.
        Duisenberg 01.06.1998–31.10.2003 (aus Altersgründen etwa zur Mitte
        der Amtszeit zurückgetreten), Trichet 01.11.2003–31.10.2011,
        Draghi 01.11.2011–31.10.2019, Lagarde seit 01.11.2019.
      Gerechnet: Duisenberg 5 Jahre 5 Monate = 5,4; Lagarde bis 07.02.2027
      7 Jahre 3 Monate = 7,3.

      Porträts von Wikimedia Commons, geholt am 02.11.2026 über
      bilder-holen.yml, auf den Kopf zugeschnitten:
        Duisenberg – Wim Duisenberg (cropped).jpg, IWF, gemeinfrei
        Trichet – Jean-Claude Trichet - World Economic Forum Annual Meeting
          Davos 2010.jpg, World Economic Forum, CC BY-SA 2.0
        Draghi – Mario Draghi 2019.jpg, Quirinale, Namensnennung
        Lagarde – Lagarde ECB Portrait 2019.jpg, Lemrich / EZB, Namensnennung
    */
    art: 'zeitstrahl',
    datum: '2026-11-05',
    titel: [{ text: 'EZB-Chefin Lagarde' }, { text: 'geht früher.', gruen: true }],
    erklaerung:
      'Christine Lagarde gibt ihr Amt am 7. Februar 2027 auf – fast neun Monate vor dem regulären Ende ihrer achtjährigen Amtszeit.',
    stichzeile: 'EZB-Präsidenten · Amtszeit seit 1998',
    helden: [
      {
        name: 'Amtszeit Lagarde',
        wert: '7,3 Jahre',
        pille: { wert: '8 Jahre', name: 'wären regulär' },
      },
    ],
    balken: [
      {
        name: 'Wim Duisenberg',
        beginn: '1998-06-01',
        ende: '2003-10-31',
        regelEnde: '2006-05-31',
        text: '5,4 J.',
        bild: 'ezb-duisenberg.jpg',
      },
      {
        name: 'Jean-Claude Trichet',
        beginn: '2003-11-01',
        ende: '2011-10-31',
        text: '8 J.',
        bild: 'ezb-trichet.jpg',
      },
      {
        name: 'Mario Draghi',
        beginn: '2011-11-01',
        ende: '2019-10-31',
        text: '8 J.',
        bild: 'ezb-draghi.jpg',
      },
      {
        name: 'Christine Lagarde',
        beginn: '2019-11-01',
        ende: '2027-02-07',
        regelEnde: '2027-10-31',
        text: '7,3 J.',
        bild: 'ezb-lagarde.jpg',
        hervor: true,
      },
    ],
    achse: [2000, 2005, 2010, 2015, 2020, 2025],
    fusszeile:
      'Stand: 29.10.2026 | Quellen: EZB über Tagesschau, Wikipedia (Präsident der EZB)',
    text:
      'Christine Lagarde gibt ihr Amt als EZB-Präsidentin am 7. Februar 2027 auf – regulär wäre Ende Oktober 2027 Schluss gewesen (Tagesschau).\n\n' +
      'Die Balken im Bild, Präsident für Präsident:\n' +
      'Wim Duisenberg (Niederlande): Juni 1998 – Oktober 2003, 5,4 Jahre\n' +
      'Jean-Claude Trichet (Frankreich): November 2003 – Oktober 2011, 8 Jahre\n' +
      'Mario Draghi (Italien): November 2011 – Oktober 2019, 8 Jahre\n' +
      'Christine Lagarde (Frankreich): November 2019 – Februar 2027, 7,3 Jahre\n\n' +
      'Gestrichelt: der Rest bis zum regulären Ende. Vorzeitig ging bisher nur Duisenberg – laut Wikipedia aus Altersgründen.\n\n' +
      'Warum geht Lagarde?\n' +
      'Laut Handelsblatt will sie offen sprechen können, vor allem zur Präsidentschaftswahl in Frankreich im April 2027. Mit der Neutralität des Amtes sei das nicht vereinbar.\n\n' +
      'Wer folgt auf Lagarde? (Seite 2)\n' +
      '– Pablo Hernández de Cos (Spanien), seit 2025 Chef der BIZ, davor der Banco de España – Polymarket: 42,5 %\n' +
      '– Klaas Knot (Niederlande), 2011–2025 Chef der niederländischen Notenbank, offiziell nominiert – 40 %\n' +
      '– Joachim Nagel (Deutschland), Bundesbank-Präsident seit 2022, Chancen gelten als gering – 6,5 %\n' +
      'Polymarket ist ein Wettmarkt mit wenig Einsatz, keine Umfrage (Stand 5.11.). Benannt wird bis Freitag (tagesschau, WiWo/dpa).\n\n' +
      'Quellen: Tagesschau, Handelsblatt, WirtschaftsWoche/dpa, Wikipedia, Polymarket\n' +
      'Fotos (Wikimedia Commons): Duisenberg – IWF, gemeinfrei; Trichet – World Economic Forum, CC BY-SA 2.0; Draghi – Quirinale; Lagarde – Lemrich/EZB; Knot – WEF, CC BY 3.0; Hernández de Cos – Chospo, CC0; Nagel – Leonhard Lenz, CC BY 4.0',
    zweiteSeite: {
      art: 'personen',
      datum: '2026-11-05',
      titel: [{ text: 'Wer folgt' }, { text: 'auf Lagarde?', gruen: true }],
      erklaerung:
        'Die Eurostaaten benennen ihre Kandidaten bis Freitag, beraten wird kommende Woche.',
      stichzeile: 'Mögliche Nachfolger · Quote Polymarket',
      personen: [
        {
          name: 'Pablo Hernández de Cos',
          zeile: 'Spanien · seit 2025 Chef der BIZ, davor Banco de España',
          stand: 'Gilt als aussichtsreich · Polymarket 42,5 %',
          bild: 'ezb-hernandez.jpg',
        },
        {
          name: 'Klaas Knot',
          zeile: 'Niederlande · 2011–2025 Chef der Notenbank DNB',
          stand: 'Offiziell nominiert · Polymarket 40 %',
          bild: 'ezb-knot.jpg',
        },
        {
          name: 'Joachim Nagel',
          zeile: 'Deutschland · seit 2022 Präsident der Bundesbank',
          stand: 'Chancen gelten als gering · Polymarket 6,5 %',
          bild: 'ezb-nagel.jpg',
        },
      ],
      fusszeile:
        'Stand: 05.11.2026 | Quellen: tagesschau, WirtschaftsWoche/dpa, Wikipedia, Polymarket (Wettquote)',
      text: '',
      schlagworte: [],
    },
    freigabe: '2026-11-05',
    schlagworte: ['ezb', 'lagarde', 'notenbank', 'euro', 'geldpolitik'],
  },
  {
    /*
      Thema vom Betreiber am 04.11.2026: „content für heute Zwischenwahlen
      USA Ergebnis und in der Beschreibung erläutern, … dass das
      Auswirkungen hat", ausnahmsweise 10:30–11:00 Uhr (`ab`).
      Erster Entwurf (S&P 500 nach Zwischenwahlen) verworfen: „nicht im
      historischen Kontext, sondern die Ergebnisse von diesem Jahr".
      Zweiter Entwurf (Balken): „ziemlich unverständlich". Jetzt je
      Kammer ein Balken über alle Sitze mit Mehrheitsstrich.
      Form: Kammern (am 03.11. vielfach). Stand der Sitze:
      CNBC Live-Updates, abgerufen 04.11. 09:17 UTC – Demokraten im Haus
      mindestens 245, Republikaner mindestens 160.

      Quellen, gelesen am 04.11.2026 gegen 6 Uhr über quellen-holen.yml:
      - tagesschau.de, Eilmeldung und Liveblog Midterms 2026: Demokraten
        laut AP mit mindestens 51 der 100 Senatssitze; erobert in Texas
        (Talarico gegen Paxton, erstmals seit fast 40 Jahren), Kansas
        (Hamilton gegen Marshall), Ohio (Brown gegen Husted), Iowa, North
        Carolina (Cooper gegen Whatley), South Carolina (Andrews, erste
        Demokratin seit 28 Jahren). Vorher Republikaner 53 Senatoren, im
        Haus 218 von 435. Trump will laut NYT-Interview das Ergebnis
        anerkennen. Fox-Umfrage: 62 % machen Trumps Politik für
        gestiegene Preise verantwortlich.
      - CNBC, Live-Updates: Election Desk sieht die Demokraten bei
        mindestens 235 Sitzen im Repräsentantenhaus (218 nötig);
        Gouverneursämter in Texas (Hinojosa gegen Abbott) und Ohio
        (Acton gegen Ramaswamy) gedreht; Iowa: Zölle und durch den
        Iran-Krieg gestiegene Düngerkosten.
      - CNBC, „Midterm elections could jolt stocks …", 03.11.2026:
        JPMorgan erwartet bei blauer Welle etwa −0,5 % für den S&P 500 am
        Mittwoch, Futures zeigten mehr; Druck auf KI/Rechenzentren und
        Rüstung, Rückenwind für Gesundheitswerte; S&P 500 ein Jahr nach
        jeder Zwischenwahl seit Anfang der 1980er höher; BTIG (Krinsky)
        hält diesmal das Gegenteil für wahrscheinlicher.
      - Yahoo Finance, ^GSPC Monatsschluss (ab 1985), abgerufen 04.11.:
        Oktober des Wahljahrs → Oktober ein Jahr später
          1986 243,98 → 251,79 +3,2 · 1990 304,00 → 392,45 +29,1 ·
          1994 472,35 → 581,50 +23,1 · 1998 1.098,67 → 1.362,93 +24,1 ·
          2002 885,76 → 1.050,71 +18,6 · 2006 1.377,94 → 1.549,38 +12,4 ·
          2010 1.183,26 → 1.253,30 +5,9 · 2014 2.018,05 → 2.079,36 +3,0 ·
          2018 2.711,74 → 3.037,56 +12,0 · 2022 3.871,98 → 4.193,80 +8,3
    */
    art: 'kammern',
    datum: '2026-11-04',
    ab: '10:30',
    titel: [{ text: 'US-Zwischenwahl:' }, { text: 'Die blaue Welle kam.', gruen: true }],
    symbol: 'usa',
    erklaerung:
      'Die Demokraten haben jetzt die Mehrheit in beiden Kammern des Kongresses. Stand Mittwochvormittag – es wird noch gezählt.',
    stichzeile: 'Sitze der Demokraten · Wahl 2026',
    helden: [
      {
        name: 'Senat · von 100 Sitzen',
        wert: '51',
        pille: { wert: '+6', name: 'Sitze erobert' },
      },
      {
        name: 'Haus · von 435 Sitzen',
        wert: '245',
        pille: { wert: '218', name: 'für die Mehrheit' },
      },
    ],
    kammern: [
      {
        name: 'Senat',
        gesamt: 100,
        mehrheit: 51,
        teile: [
          { name: 'Demokraten', wert: 51, farbe: 'blau' },
          { name: 'Republikaner und noch offen', wert: 49, farbe: 'rot' },
        ],
      },
      {
        name: 'Repräsentantenhaus',
        gesamt: 435,
        mehrheit: 218,
        teile: [
          { name: 'Demokraten', wert: 245, farbe: 'blau' },
          { name: 'noch offen', wert: 30, farbe: 'offen' },
          { name: 'Republikaner', wert: 160, farbe: 'rot' },
        ],
      },
    ],
    fusszeile:
      'Stand: 04.11.2026, 10 Uhr, Auszählung läuft | Quellen: AP über tagesschau, CNBC Election Desk',
    text:
      'Die Nacht der Demokraten. 🇺🇸 Bei den Zwischenwahlen haben sie laut der Nachrichtenagentur AP den Senat erobert – mit mindestens 51 von 100 Sitzen. Bisher hatten die Republikaner 53. Im Repräsentantenhaus sieht das CNBC Election Desk die Demokraten bei mindestens 245 der 435 Sitze, die Republikaner bei mindestens 160 – bisher hielten sie 218. Für die Mehrheit reichen 218.\n\n' +
      'Die sechs eroberten Senatssitze laut AP:\n' +
      'Texas – James Talarico, erstmals seit fast 40 Jahren\n' +
      'Kansas – Adam Hamilton\n' +
      'Ohio – Sherrod Brown\n' +
      'Iowa – Josh Turek\n' +
      'North Carolina – Roy Cooper\n' +
      'South Carolina – Annie Andrews, erste Demokratin seit 28 Jahren\n' +
      'Dazu die Gouverneure in Texas (Gina Hinojosa) und Ohio (Amy Acton). Elon Musk hatte laut CNBC rund 224 Mio. $ auf die Texas-Republikaner gesetzt.\n\n' +
      'Warum?\n' +
      'Laut tagesschau spricht das Ergebnis für erhebliche Unzufriedenheit mit Trumps Politik. In einer Fox-Umfrage machten 62 % seine Politik für gestiegene Preise verantwortlich. In Iowa trafen laut CNBC Zölle und teurer Dünger durch den Iran-Krieg die Landwirte.\n\n' +
      'Was das bedeutet:\n' +
      '– Trump regiert bis Anfang 2029 gegen einen Kongress der Gegenseite. Er will das Ergebnis laut New York Times anerkennen und mit den Demokraten zusammenarbeiten.\n' +
      '– Börse: JPMorgan rechnete laut CNBC bei einer blauen Welle mit etwa −0,5 % für den S&P 500 heute.\n' +
      '– Unter Druck stehen könnten laut CNBC KI- und Rechenzentrumswerte – Texas ist ihr wichtigster Standort – sowie Rüstung. Rückenwind gäbe es für Gesundheitswerte.\n\n' +
      'Quellen: AP über tagesschau.de (Liveblog Midterms), CNBC (Live-Updates, Election Desk, Markt-Ausblick)',
    freigabe: '2026-11-04',
    schlagworte: ['usa', 'zwischenwahlen', 'wahlen', 'kongress', 'börse'],
  },
  {
    /*
      Thema vom Betreiber am 02.11.2026: „was Spannendes … wegen dem
      Iran-Krieg jetzt. Atomwaffen und so." Verworfen hatte er Lagarde
      (zurückgestellt), Gold, Binance, Meta, VW, Termine der Woche.
      Form: Kurven (am 01.11. Säulen).
      Am 02.11.2026 zurückgestellt (an dem Tag lief „Kriege und der
      Ölpreis"). Für den 03.11. erster offener Vorschlag. Betreiber zum
      ersten Entwurf: „oben nicht USA und Russland so groß, sondern
      insgesamt Sprengköpfe … damals und heute, dann halt noch ein paar
      Charts dazu. Von China, Nordkorea und so weiter." Form: Gesamtkurve
      mit kleinen Kurven je Atommacht (am 02.11. waagerechte Balken).
      Welt: OWID 1986 70.374, 2026 12.187 (= FAS-Gesamtbestand); Länder:
      OWID = FAS-Militärbestand, Summe 9.745. Höchststände: Frankreich
      1991 540, Großbritannien 1973 500; China, Indien, Nordkorea 2026,
      Pakistan 170 seit 2023, Israel 90 seit 2020.

      Quellen, gelesen am 02.11.2026 über quellen-holen.yml:
      - FAS, „Status of World Nuclear Forces 2026": 12.187 Sprengköpfe in
        neun Staaten, davon 9.745 im Militärbestand; USA und Russland
        besitzen rund 86 % des Gesamtbestands; Höhepunkt rund 70.300 im
        Jahr 1986. Gesamtbestand je Land: Russland 5.420, USA 5.042,
        China 620, Frankreich 370, Großbritannien 225, Indien 190,
        Pakistan 170, Israel 90, Nordkorea 60. Der Abbau verlangsamt sich
        und läuft nur noch über die Verschrottung ausgemusterter
        Sprengköpfe; die Militärbestände wachsen wieder. China baut aus,
        laut US-Verteidigungsministerium (2022) bis 2030 rund 1.000.
        Seit 2023 tauschen USA und Russland keine öffentlichen Daten mehr.
      - Our World in Data, Militärbestand je Jahr (data/instagram-reihen-atomwaffen.ts):
        Russland/Sowjetunion Höchststand 1986 mit 40.159, 2026: 4.400
        (−89 %); USA Höchststand 1967 mit 31.255, 2026: 3.700 (−88 %).
      Iran: steht nicht in der FAS-Liste der neun Atommächte.
    */
    art: 'vielfach',
    datum: '2026-11-03',
    titel: [
      { text: 'Atomwaffen weltweit:' },
      { text: 'Weniger, nicht weg.', gruen: true },
    ],
    erklaerung:
      'Sprengköpfe auf der Welt seit 1945 und der einsatzbereite Bestand jeder der neun Atommächte – logarithmische Skala.',
    stichzeile: 'Atomsprengköpfe · 1945 bis 2026',
    helden: [
      { name: 'Höchststand 1986', wert: '70.374' },
      {
        name: 'Anfang 2026',
        wert: '12.187',
        pille: { wert: '−83 %', name: 'seit 1986', richtung: 'faellt' },
      },
    ],
    gesamt: { name: 'Welt', punkte: ATOM_WELT },
    achse: [
      { bei: 0, text: '1945' },
      { bei: 15, text: '1960' },
      { bei: 35, text: '1980' },
      { bei: 55, text: '2000' },
      { bei: 81, text: '2026' },
    ],
    teile: [
      { name: 'Russland', wert: '4.400', punkte: ATOM_RUSSLAND },
      { name: 'USA', wert: '3.700', punkte: ATOM_USA },
      { name: 'China', wert: '620', punkte: ATOM_CHINA },
      { name: 'Frankreich', wert: '290', punkte: ATOM_FRANKREICH },
      { name: 'Großbritannien', wert: '225', punkte: ATOM_GROSSBRITANNIEN },
      { name: 'Indien', wert: '190', punkte: ATOM_INDIEN },
      { name: 'Pakistan', wert: '170', punkte: ATOM_PAKISTAN },
      { name: 'Israel', wert: '90', punkte: ATOM_ISRAEL },
      { name: 'Nordkorea', wert: '60', punkte: ATOM_NORDKOREA },
    ],
    fusszeile:
      'Stand: Anfang 2026 | Quellen: Federation of American Scientists, Our World in Data',
    text:
      'Krieg um den Iran, Drohungen, Aufrüstung – wie viele Atomwaffen gibt es eigentlich? Laut der Federation of American Scientists (FAS) Anfang 2026 rund 12.187 Sprengköpfe auf der Welt. 1986, auf dem Höhepunkt des Kalten Kriegs, waren es 70.374 – heute 83 % weniger.\n\n' +
      'Die neun Atommächte und ihr einsatzbereiter Bestand laut FAS:\n' +
      'Russland: 4.400\n' +
      'USA: 3.700\n' +
      'China: 620\n' +
      'Frankreich: 290\n' +
      'Großbritannien: 225\n' +
      'Indien: 190\n' +
      'Pakistan: 170\n' +
      'Israel: 90\n' +
      'Nordkorea: 60\n' +
      'Zusammen 9.745. Der Rest der 12.187 ist ausgemustert und wartet auf die Verschrottung. Der Iran steht nicht auf der Liste.\n\n' +
      'So liest du die Grafik: Die Skala ist logarithmisch – jede Linie steht für das Zehnfache der darunter. Nur so sind die 60 Sprengköpfe Nordkoreas neben den 4.400 Russlands zu sehen.\n\n' +
      'Schon gewusst?\n' +
      '– Russland (bis 1991 Sowjetunion) hatte 1986 allein 40.159 Sprengköpfe, die USA 1967 31.255.\n' +
      '– China hat so viele wie nie: 620. Indien, Pakistan und Nordkorea stehen ebenfalls auf ihrem Höchststand.\n' +
      '– Frankreich hatte 1991 540, Großbritannien 1973 500 – beide haben seitdem abgebaut.\n\n' +
      'Warum so viel weniger?\n' +
      'Laut FAS bauten die USA und Russland nach dem Kalten Krieg ab. Inzwischen gehe der Abbau nur noch weiter, weil ausgemusterte Sprengköpfe verschrottet werden.\n\n' +
      'Und jetzt?\n' +
      'Die einsatzbereiten Bestände wachsen laut FAS wieder. Das US-Verteidigungsministerium rechnete 2022 mit rund 1.000 chinesischen Sprengköpfen bis 2030.\n\n' +
      'Quellen: Federation of American Scientists, „Status of World Nuclear Forces 2026"; Our World in Data, „Nuclear warhead stockpiles"',
    freigabe: '2026-11-03',
    schlagworte: ['atomwaffen', 'geopolitik', 'iran', 'russland', 'usa'],
  },
  {
    /*
      Thema vom Betreiber am 02.11.2026 gewählt („Thema 2": Kriege und der
      Ölpreis), nachdem er Lagarde und Atomwaffen zurückgestellt hatte.
      Form: waagerechte Balken im Hausstil, neu (am 01.11. Säulen).

      Quelle: Weltbank, Commodity Price Data („Pink Sheet"),
      CMO-Historical-Data-Monthly.xlsx, Stand 02.10.2026, abgerufen am
      02.11.2026 über quellen-holen.yml (blatt 2). Reihe „Crude oil,
      average" (Mittel aus Brent, Dubai, WTI), $ je Fass, Monatsmittel.
      Gerechnet: Monat vor Beginn gegen den teuersten (Kriege) bzw.
      billigsten Monat (Krisen) der zwölf Monate ab Beginn (2026: Februar
      bis September, acht Monate). Krisen auf Wunsch des Betreibers
      („ein paar andere Beispiele extreme … nicht nur Kriege, sondern auch
      Krisen"):
        1986 (Jan.)  12/1985  26,5 → 07/1986   9,6    −64 %
        2008 (Sept.) 08/2008 114,6 → 12/2008  41,3    −64 %
        2020 (März)  02/2020  53,3 → 04/2020  21,0    −61 %
        1973 (Okt.)  09/1973   2,7 → 03/1974  13,0   +381 %
        1979 (Jan.)  12/1978  14,5 → 11/1979  40,8   +181 %
        1990 (Aug.)  07/1990  17,2 → 10/1990  34,5   +101 %
        2022 (Feb.)  01/2022  83,9 → 06/2022 116,8    +39 %
        2026 (Feb.)  01/2026  63,7 → 04/2026 103,9    +63 %
        2026 weiter: 05 100,4 · 06 81,7 · 07 79,8 · 08 84,4 · 09 102,3
      Kriegsbeginn 2026 „Ende Februar" laut goldreporter.de (unsere Ausgabe
      vom 01.10.2026). Die Brent-Spalte nicht genommen: Sie zeigt für
      September 116,8 $, unsere Quellen nannten zum Quartalsende knapp
      98 $ – die Mittelreihe passt dazu.
    */
    art: 'balken',
    datum: '2026-11-02',
    titel: [
      { text: 'Krieg, Krise, Ölpreis:' },
      { text: 'Teuer, aber kein 1973.', gruen: true },
    ],
    erklaerung:
      'Stärkster Ausschlag des Ölpreises im Jahr nach Beginn: teuerster oder billigster Monat gegen den Monat davor.',
    stichzeile: 'Rohöl · nach Kriegen und Krisen',
    helden: [
      {
        name: 'Krieg um den Iran',
        wert: '+63 %',
        pille: { wert: '103,9 $', name: 'je Fass im April' },
      },
    ],
    balken: [
      { marke: '1973', text: 'Ölembargo', wert: 381.48 },
      { marke: '1979', text: 'Revolution im Iran', wert: 181.38 },
      { marke: '1986', text: 'Ölpreisverfall', wert: -63.77 },
      { marke: '1990', text: 'Irak besetzt Kuwait', wert: 100.58 },
      { marke: '2008', text: 'Finanzkrise', wert: -63.96 },
      { marke: '2020', text: 'Corona', wert: -60.6 },
      { marke: '2022', text: 'Krieg in der Ukraine', wert: 39.21 },
      { marke: '2026', text: 'Krieg um den Iran', wert: 63.11, hervor: true },
    ],
    einheit: '%',
    fusszeile:
      'Stand: 09/2026 | Quelle: Weltbank (Pink Sheet), Rohöl-Mittel aus Brent, Dubai, WTI; eigene Rechnung',
    text:
      'Krieg treibt den Ölpreis, Krisen lassen ihn abstürzen – aber wie stark? Gemessen mit Monatspreisen der Weltbank: stärkster Ausschlag im Jahr nach Beginn, gegen den Monat davor.\n\n' +
      'Die Balken im Bild, Fall für Fall ($ je Fass):\n' +
      '1973 – Ölembargo: 2,70 → 13,00, +381 %\n' +
      '1979 – Revolution im Iran: 14,50 → 40,80, +181 %\n' +
      '1986 – Ölpreisverfall: 26,50 → 9,60, −64 %\n' +
      '1990 – Irak besetzt Kuwait: 17,20 → 34,50, +101 %\n' +
      '2008 – Finanzkrise: 114,60 → 41,30, −64 %\n' +
      '2020 – Corona: 53,30 → 21,00, −61 %\n' +
      '2022 – Krieg in der Ukraine: 83,90 → 116,80, +39 %\n' +
      '2026 – Krieg um den Iran: 63,70 → 103,90, +63 % (bis September)\n\n' +
      'Warum war 1973 so extrem?\n' +
      'Die Zahlen nennen keinen Grund, aber den Ausgangspunkt: 1973 kostete ein Fass 2,70 $ – ein Sprung von wenigen Dollar war schon eine Vervielfachung.\n\n' +
      'Schon gewusst?\n' +
      '– Von 1960 bis 1972 kostete ein Fass nie mehr als 1,90 $ – 13 Jahre fast Stillstand, dann kam 1973.\n' +
      '– Der teuerste Monat überhaupt war der Juli 2008 mit 132,80 $. Im Dezember, mitten in der Finanzkrise: 41,30 $.\n' +
      '– Im April 2020 fiel der Preis auf 21,00 $ – so billig wie seit Februar 2002 nicht mehr.\n' +
      '– Der Iran-Krieg brachte bisher höchstens 103,90 $, weniger als der Ukraine-Krieg im Juni 2022 mit 116,80 $.\n\n' +
      'Und jetzt?\n' +
      'Der Krieg um den Iran begann Ende Februar. Im April lag der Preis am höchsten, im Juli bei 79,80 $, im September wieder bei 102,30 $. Wie es weitergeht, sagen die Daten nicht.\n\n' +
      'Gerechnet: Rohöl-Mittel aus Brent, Dubai und WTI, Monatsdurchschnitt, nicht inflationsbereinigt.\n' +
      'Quelle: Weltbank, Commodity Price Data („Pink Sheet"), Stand 2. Oktober 2026; eigene Rechnung',
    freigabe: '2026-11-02',
    schlagworte: ['oelpreis', 'iran', 'krieg', 'rohstoffe', 'geopolitik'],
  },
  {
    /*
      Thema vom Betreiber am 30.10.2026: Zwischenwahl, aber einfach. Verworfen
      hatte er:
      - die Rendite nach Zwischenwahlen: „der halloweenbeitrag ist ja
        ähnlich"
      - die Sitzverteilung: „zu kompliziert"
      Gewählt hat er „Zwischenwahl, simpel": eine Aussage, eine Zahl. Form:
      Säulen im Hausstil, neu (am 31.10. Kurve).

      Quelle: Wikipedia, „United States midterm election", Tabelle „Net
      gain/loss of president's party", abgerufen am 30.10.2026 über
      quellen-holen.yml. Repräsentantenhaus, Partei des Präsidenten, seit
      1946:
        1946 −54, 1950 −28, 1954 −18, 1958 −48, 1962 −4, 1966 −47,
        1970 −12, 1974 −48, 1978 −15, 1982 −26, 1986 −5, 1990 −8,
        1994 −54, 1998 +4, 2002 +8, 2006 −32, 2010 −63, 2014 −13,
        2018 −41, 2022 −9
      Das sind 20 Wahlen mit 18 Verlusten, im Mittel −25,65 Sitze. Der
      Artikel schreibt dazu: „Since World War II, the president's party has
      lost an average of 26 seats in the House". Gewonnen hat sie nur 1998
      (Clinton) und 2002 (George W. Bush). Im Bild stehen die letzten zehn.
      Wahltag 2026: 3. November.

      Porträts (Betreiber: „kleine Bilder von den Gesichtern der Präsidenten
      zu jedem Balken“): die offiziellen Porträts von Wikimedia Commons, alle
      „Public domain“ als Werke der US-Regierung, geholt am 30.10.2026 über
      bilder-holen.yml und auf den Kopf zugeschnitten:
        Reagan – Official Portrait of President Reagan 1981 (Michael Evans)
        G. H. W. Bush – presidential portrait, cropped (David Valdez)
        Clinton – Bill Clinton.jpg (Bob McNeely)
        G. W. Bush – George-W-Bush.jpeg (Eric Draper)
        Obama – President Barack Obama.jpg (Pete Souza)
        Trump – Donald Trump official portrait.jpg (Shealeah Craighead)
        Biden – Joe Biden presidential portrait.jpg (Adam Schultz)
    */
    art: 'saeulen',
    datum: '2026-11-01',
    titel: [
      { text: 'US-Zwischenwahl:' },
      { text: 'Wer regiert, verliert.', gruen: true },
    ],
    symbol: 'usa',
    erklaerung:
      'Seit 1946 hat die Partei des Präsidenten bei fast jeder Zwischenwahl Sitze im Repräsentantenhaus verloren.',
    stichzeile: 'Sitze der Präsidentenpartei · je Wahl',
    helden: [
      {
        name: 'Verluste seit 1946',
        wert: '18 von 20',
        richtung: 'faellt',
        pille: { wert: '−26', name: 'Sitze im Schnitt', richtung: 'faellt' },
      },
    ],
    saeulen: [
      { text: '1986', wert: -5, bild: 'praesident-reagan.jpg' },
      { text: '1990', wert: -8, bild: 'praesident-bush-sen.jpg' },
      { text: '1994', wert: -54, bild: 'praesident-clinton.jpg' },
      { text: '1998', wert: 4, bild: 'praesident-clinton.jpg' },
      { text: '2002', wert: 8, bild: 'praesident-bush-jun.jpg' },
      { text: '2006', wert: -32, bild: 'praesident-bush-jun.jpg' },
      { text: '2010', wert: -63, bild: 'praesident-obama.jpg' },
      { text: '2014', wert: -13, bild: 'praesident-obama.jpg' },
      { text: '2018', wert: -41, bild: 'praesident-trump.jpg' },
      { text: '2022', wert: -9, bild: 'praesident-biden.jpg' },
    ],
    einheit: 'Sitze',
    nachkomma: 0,
    fusszeile:
      'Stand: Zwischenwahlen 1946–2022 | Quelle: Wikipedia (United States midterm election)',
    text:
      'Am Dienstag, dem 3. November, wählen die USA. Die Wahllokale schließen am Dienstagabend US-Zeit, erste Ergebnisse kommen bei uns in der Nacht zum Mittwoch. 🇺🇸\n\n' +
      'Zur Wahl stehen alle 435 Sitze im Repräsentantenhaus und ein Drittel des Senats. Weil sie in der Mitte der vierjährigen Amtszeit liegt, heißt sie Zwischenwahl – und gilt als Urteil über den Präsidenten und seine Partei.\n\n' +
      'Eine Regel hält sich seit Jahrzehnten: Die Partei des Präsidenten verliert. Seit 1946 hat sie bei 18 von 20 Zwischenwahlen Sitze im Repräsentantenhaus abgegeben – im Schnitt 26. Im Senat sind es im Schnitt vier.\n\n' +
      'Die Säulen im Bild, Jahr für Jahr:\n' +
      '1986 – Ronald Reagan: −5\n' +
      '1990 – George H. W. Bush: −8\n' +
      '1994 – Bill Clinton: −54\n' +
      '1998 – Bill Clinton: +4\n' +
      '2002 – George W. Bush: +8\n' +
      '2006 – George W. Bush: −32\n' +
      '2010 – Barack Obama: −63\n' +
      '2014 – Barack Obama: −13\n' +
      '2018 – Donald Trump: −41\n' +
      '2022 – Joe Biden: −9\n\n' +
      'Den größten Verlust gab es 2010 unter Obama mit 63 Sitzen. Dazugewonnen hat sie nur zweimal: 1998 unter Clinton (+4) und 2002 unter George W. Bush (+8). Auffällig: Bei der zweiten Zwischenwahl eines Präsidenten fallen die Verluste oft höher aus – in den USA heißt das „six-year itch\".\n\n' +
      'Diesmal stellt Donald Trump den Präsidenten – seine Republikaner verteidigen die Mehrheit im Repräsentantenhaus.\n\n' +
      'Und jetzt?\n' +
      'Eine Regel ist keine Vorhersage. Wie die Wahl am Dienstag ausgeht, sagen diese Zahlen nicht.\n\n' +
      'Quelle: Wikipedia, „United States midterm election\", Sitzveränderungen der Präsidentenpartei 1946–2022\n' +
      'Fotos: offizielle Porträts des Weißen Hauses, gemeinfrei, über Wikimedia Commons',
    freigabe: '2026-11-01',
    schlagworte: ['usa', 'zwischenwahlen', 'kongress', 'politik', 'wahlen'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 30.10.2026 aus den Vorschlägen
      („das zu Halloween klingt doch ganz gut"). Zwei Balken: „voll
      langweilig"; Kalender: „sieht sehr billig nach Vibecoding aus – nimm
      das Design von Phantom". Dazu: längere Geschichte, „mindestens 2020,
      besser 1990". Form: Kurvenkarte, neu (am 30.10. Duell).

      Zahlen: Yahoo Finance, ^GDAXI und ^GSPC, Monatsschlusskurse
      (interval=1mo, ab 12/1987 bzw. 01/1985), abgerufen am 30.10.2026 über
      quellen-holen.yml. Gerechnet: Rendite je Monat gegen den Vormonat,
      01/1990–09/2026 (36–37 Werte je Kalendermonat).
        Dax      Mittel je Wintermonat (Nov–Apr) +1,58 %, je Sommermonat
                 (Mai–Okt) −0,01 %; 100 € nur im Winter angelegt → 2.247 €,
                 nur im Sommer → 63 € (Reihen: data/instagram-reihen-dax-halbjahre.ts)
        S&P 500  Winter +1,07 %, Sommer +0,52 % je Monat; verkettet
                 +752 % gegen +154 %
    */
    art: 'kurven',
    datum: '2026-10-31',
    titel: [{ text: 'Die Halloween-Regel' }, { text: 'ging beim Dax auf.', gruen: true }],
    symbol: 'kuerbis',
    stichzeile: 'Dax · 100 € ab Januar 1990',
    erklaerung:
      'An Halloween kaufen, im Mai verkaufen: 100 € im Dax seit 1990, nur im Winter oder nur im Sommer angelegt.',
    linien: [
      {
        name: 'Nur im Winter',
        ende: '2.247 €',
        richtung: 'steigt',
        punkte: DAX_NUR_WINTER,
      },
      { name: 'Nur im Sommer', ende: '63 €', richtung: 'faellt', punkte: DAX_NUR_SOMMER },
    ],
    achse: [
      { bei: 0, text: '1990' },
      { bei: 120, text: '2000' },
      { bei: 240, text: '2010' },
      { bei: 360, text: '2020' },
      { bei: 441, text: '2026' },
    ],
    einheit: '€',
    kennzahlen: [
      { name: 'Ø je Monat', wert: '+1,58 %', richtung: 'steigt' },
      { name: 'Ø je Monat', wert: '−0,01 %' },
    ],
    fusszeile:
      'Stand: Monatsschlusskurse Dax 12/1989–09/2026 | Quelle: Yahoo Finance, eigene Rechnung',
    text:
      'Heute ist Halloween – und an der Börse der Tag einer alten Regel: „Sell in May and go away", und an Halloween wieder einsteigen. Wir haben nachgerechnet, mit dem Dax seit 1990. 🎃\n\n' +
      'Das Ergebnis ist deutlich: Von November bis April legte der Dax im Schnitt um 1,58 % pro Monat zu, von Mai bis Oktober um −0,01 % – also gar nicht. August und September waren die schwächsten Monate, November und April die stärksten.\n\n' +
      'Hochgerechnet: Aus 100 €, seit Januar 1990 nur in den Wintermonaten im Dax angelegt, wurden 2.247 €. Nur in den Sommermonaten angelegt, blieben 63 €.\n\n' +
      'In den USA ist das Muster schwächer: Der S&P 500 machte im Winter +1,07 % pro Monat, im Sommer +0,52 % – auch dort war der Sommer positiv.\n\n' +
      'Und jetzt?\n' +
      'Die Zahlen beschreiben, was war – eine Begründung liefern sie nicht. Es sind Durchschnitte über 36 Jahre, einzelne Jahre wichen stark ab. Ob der kommende Winter wieder so läuft, lässt sich daraus nicht ablesen. Und wer im Sommer aussteigt, verpasst auch starke Sommermonate wie Juli und Oktober.\n\n' +
      'Gerechnet: Mittel der monatlichen Renditen je Kalendermonat, Januar 1990 bis September 2026. Der Dax ist ein Performanceindex (Dividenden eingerechnet), der S&P 500 nicht. Hochrechnung ohne Kosten und Steuern. Keine Anlageberatung.\n' +
      'Quelle: Yahoo Finance (Monatsschlusskurse), eigene Rechnung',
    schlagworte: ['halloween', 'dax', 'börse', 'aktien', 'investieren'],
    freigabe: '2026-10-31',
  },
  {
    /*
      Thema gewählt vom Betreiber am 29.10.2026 aus den Vorschlägen („1":
      Erdgas-Schere Europa gegen USA). Form: Duell, neu im Kanal (am 29.10.
      Torte). Betreiber zum Entwurf: Warum und Folgen für den Winter in die
      Beschreibung – nur, was die beiden Meldungen sagen.

      Zahlen:
      - Kursreihen: Yahoo Finance, TTF=F (Dutch TTF, Frontmonat, €/MWh) und
        NG=F (Henry Hub, Frontmonat, $/MMBtu), Tagesschlusskurse vom
        02.01. bis 28.10.2026, abgerufen am 29.10.2026 über
        quellen-holen.yml. Hier je Freitag plus erster und letzter Tag.
        TTF 29,00 → 100,72 € (+247,3 %), Henry Hub 3,618 → 2,817 $ (−22,1 %).
      - Handelsblatt, 26.10.2026: TTF bis 97,64 €/MWh, „der höchste Preis
        seit Ende 2022", seit Jahresbeginn „mehr als verdreifacht".
      - wallstreetONLINE, 26.10.2026: US-Erdgas auf rund 2,53 $/MMBtu, „den
        niedrigsten Stand seit rund zwei Jahren"; Gründe laut Meldung:
        mildes Wetter und steigende Produktion.
    */
    art: 'duell',
    datum: '2026-10-30',
    /* Freigegeben vom Betreiber am 30.10.2026: „Ja, passt, hast die Freigabe." */
    freigabe: '2026-10-30',
    /* Betreiber 30.10.: „Gasschere ist nicht optimal … versteht nicht jeder". */
    titel: [
      { text: 'Gaspreis: Europa' },
      { text: '+247\u00a0%,', richtung: 'steigt' },
      { text: 'USA' },
      { text: '−22\u00a0%', richtung: 'faellt' },
    ],
    unterzeile: 'Großhandelspreis für Erdgas seit Jahresbeginn (Terminkontrakt):',
    links: {
      name: 'Europa',
      zusatz: 'TTF, €/MWh',
      land: 'EU27',
      punkte: [
        { t: '2026-01-02', wert: 29.004 },
        { t: '2026-01-09', wert: 28.374 },
        { t: '2026-01-16', wert: 36.879 },
        { t: '2026-01-23', wert: 40.039 },
        { t: '2026-01-30', wert: 39.285 },
        { t: '2026-02-06', wert: 35.694 },
        { t: '2026-02-13', wert: 32.5 },
        { t: '2026-02-20', wert: 32.029 },
        { t: '2026-02-27', wert: 31.959 },
        { t: '2026-03-06', wert: 53.385 },
        { t: '2026-03-13', wert: 50.115 },
        { t: '2026-03-20', wert: 59.255 },
        { t: '2026-03-27', wert: 54.177 },
        { t: '2026-04-10', wert: 43.638 },
        { t: '2026-04-17', wert: 38.769 },
        { t: '2026-04-24', wert: 44.861 },
        { t: '2026-05-01', wert: 45.766 },
        { t: '2026-05-08', wert: 44.143 },
        { t: '2026-05-15', wert: 50.167 },
        { t: '2026-05-22', wert: 48.683 },
        { t: '2026-05-29', wert: 46.001 },
        { t: '2026-06-05', wert: 48.496 },
        { t: '2026-06-12', wert: 46.773 },
        { t: '2026-06-26', wert: 40.782 },
        { t: '2026-07-10', wert: 48.655 },
        { t: '2026-07-17', wert: 57.395 },
        { t: '2026-07-24', wert: 63.575 },
        { t: '2026-07-31', wert: 59.071 },
        { t: '2026-08-07', wert: 55.544 },
        { t: '2026-08-14', wert: 61.424 },
        { t: '2026-08-21', wert: 65.865 },
        { t: '2026-08-28', wert: 66.979 },
        { t: '2026-09-04', wert: 71.952 },
        { t: '2026-09-11', wert: 79.52 },
        { t: '2026-09-18', wert: 79.518 },
        { t: '2026-09-25', wert: 72.071 },
        { t: '2026-10-02', wert: 74.76 },
        { t: '2026-10-09', wert: 81.434 },
        { t: '2026-10-16', wert: 87.547 },
        { t: '2026-10-23', wert: 93.853 },
        { t: '2026-10-28', wert: 100.72 },
      ],
    },
    rechts: {
      name: 'USA',
      zusatz: 'Henry Hub, $/MMBtu',
      land: 'USA',
      punkte: [
        { t: '2026-01-02', wert: 3.618 },
        { t: '2026-01-09', wert: 3.169 },
        { t: '2026-01-16', wert: 3.103 },
        { t: '2026-01-23', wert: 5.275 },
        { t: '2026-01-30', wert: 4.354 },
        { t: '2026-02-06', wert: 3.422 },
        { t: '2026-02-13', wert: 3.243 },
        { t: '2026-02-20', wert: 3.047 },
        { t: '2026-02-27', wert: 2.859 },
        { t: '2026-03-06', wert: 3.186 },
        { t: '2026-03-13', wert: 3.131 },
        { t: '2026-03-20', wert: 3.095 },
        { t: '2026-03-27', wert: 3.095 },
        { t: '2026-04-10', wert: 2.648 },
        { t: '2026-04-17', wert: 2.674 },
        { t: '2026-04-24', wert: 2.523 },
        { t: '2026-05-01', wert: 2.78 },
        { t: '2026-05-08', wert: 2.757 },
        { t: '2026-05-15', wert: 2.96 },
        { t: '2026-05-22', wert: 2.907 },
        { t: '2026-05-29', wert: 3.29 },
        { t: '2026-06-05', wert: 3.229 },
        { t: '2026-06-12', wert: 3.12 },
        { t: '2026-06-26', wert: 3.231 },
        { t: '2026-07-10', wert: 2.94 },
        { t: '2026-07-17', wert: 2.911 },
        { t: '2026-07-24', wert: 2.871 },
        { t: '2026-07-31', wert: 2.747 },
        { t: '2026-08-07', wert: 2.662 },
        { t: '2026-08-14', wert: 2.733 },
        { t: '2026-08-21', wert: 2.773 },
        { t: '2026-08-28', wert: 2.888 },
        { t: '2026-09-04', wert: 2.975 },
        { t: '2026-09-11', wert: 2.831 },
        { t: '2026-09-18', wert: 2.912 },
        { t: '2026-09-25', wert: 3.196 },
        { t: '2026-10-02', wert: 3.035 },
        { t: '2026-10-09', wert: 3.22 },
        { t: '2026-10-16', wert: 3.116 },
        { t: '2026-10-23', wert: 2.64 },
        { t: '2026-10-28', wert: 2.817 },
      ],
    },
    fusszeile:
      'Stand: Schlusskurse 02.01.–28.10.2026 | Quellen: Yahoo Finance, Handelsblatt, wallstreetONLINE',
    text:
      'Dasselbe Gas, zwei Welten: In Europa hat sich der Großhandelspreis seit Jahresbeginn mehr als verdreifacht, in den USA ist er gefallen. 🔥\n\n' +
      'Der europäische Terminkontrakt TTF stieg von 29,00 Euro je Megawattstunde am 2. Januar auf 100,72 Euro am 28. Oktober – ein Plus von 247 Prozent und laut Handelsblatt der höchste Stand seit Ende 2022. Der US-Kontrakt Henry Hub fiel im selben Zeitraum von 3,62 auf 2,82 Dollar je Million British Thermal Units (−22 Prozent); am 26. Oktober lag er laut wallstreetONLINE bei rund 2,53 Dollar, dem tiefsten Stand seit rund zwei Jahren.\n\n' +
      'Warum so unterschiedlich?\n' +
      '🇪🇺 Europa: Laut Handelsblatt treiben der Iran-Krieg und das Auffüllen der deutschen Gasspeicher den Preis.\n' +
      '🇺🇸 USA: Laut wallstreetONLINE rechnen Meteorologen bis Anfang November mit ungewöhnlich mildem Wetter, das senkt den Heizbedarf. Zugleich fördern die USA fast so viel wie zu den Rekorden im August und September.\n' +
      'Gas hat keinen Weltmarktpreis – es reist per Pipeline oder als LNG.\n\n' +
      'Und im Winter?\n' +
      '🇪🇺 Mit dem Preisanstieg wächst laut Handelsblatt der Druck auf Verbraucher und Industrie – allmählich steigen auch die Preise für Haushaltskunden.\n' +
      '🇺🇸 Laut wallstreetONLINE entscheidet jetzt der Beginn der Heizsaison: Bleibt es mild, dürfte der Preis weiter unter Druck bleiben; eine plötzliche Kältewelle würde die Erwartungen an den Verbrauch rasch ändern.\n\n' +
      'Beide Werte in eigener Währung und Einheit.\n' +
      'Quellen: Yahoo Finance (Schlusskurse 02.01.–28.10.2026), Handelsblatt und wallstreetONLINE (beide 26.10.2026)',
    schlagworte: ['erdgas', 'gaspreis', 'energie', 'rohstoffe', 'börse'],
  },
  {
    /*
      Thema vom Betreiber (28.10.2026): aus den Vorschlägen „4 … für morgen"
      – Anthropic vor dem Börsengang.

      Zahlen aus dem Börsenprospekt, wie zwei Meldungen vom 26.10.2026 ihn
      wiedergeben (gelesen am 28.10.2026 über quellen-holen.yml; die SEC
      selbst antwortet dem Läufer mit 403, die FAZ mit 302):
        tagesschau.de/wirtschaft/unternehmen/anthropic-bereitet-boersengang-vor-100.html
          „In den ersten sechs Monaten des Jahres 2026 kletterte der Erlös …
          von 1,2 Milliarden Dollar im Vorjahreszeitraum auf 16,3 Milliarden
          Dollar"; Nettoverlust „im ersten Halbjahr 2026 rund 80,7 Milliarden
          Dollar – bedingt durch die hohen Kosten für den Bau von
          Rechenzentren"; Nasdaq, Tickersymbol „ANT"; 2021 von Dario Amodei
          mitgegründet; Goldman Sachs und Morgan Stanley.
        wiwo.de/finanzen/boerse/anthropic-beantragt-boersengang-in-den-usa-und-offenbart-teure-abhaengigkeit/100265031.html
          „Mehr als 1900 Kunden kamen auf mindestens eine Million Dollar";
          gegenüber Google, Microsoft und Amazon „Mindestverpflichtungen von
          rund 269 Milliarden Dollar"; „Rund 80 Prozent des Umsatzes stammen
          … aus nutzungsabhängigen Gebühren".
      Erster Entwurf als Steckbrief mit Foto von Dario Amodei – Betreiber:
      „das gesicht und design kake". Zweiter als zwei Balken (Umsatz gegen
      Verlust) – „nein gib dir mühe kreativ und nicht immer das selbe".
      Jetzt eine Pyramide aus derselben WiWo-Meldung: „Ende September hatte
      das Unternehmen mehr als 11.900 Kunden, die innerhalb von zwölf
      Monaten jeweils mindestens 100.000 Dollar Umsatz generierten. Mehr als
      1900 Kunden kamen auf mindestens eine Million Dollar und rund 250
      Kunden auf mindestens zehn Millionen Dollar." – „Die fünf größten
      Kunden waren in den ersten neun Monaten für rund ein Viertel des
      Umsatzes verantwortlich."
      Dritter Entwurf, die Pyramide – „ne gefällt mir nicht auch nicht
      inhaltlich". Aus vier Geschichten gewählt: „Big Tech kassiert mit".
      WiWo: „Anthropic hat sich laut Nachrichtenagentur Reuters zu Ausgaben
      von mehr als 600 Milliarden Dollar verpflichtet. Allein gegenüber den
      Tech-Konzernen Google, Microsoft und Amazon bestehen
      Mindestverpflichtungen von rund 269 Milliarden Dollar. Das meiste
      davon entfällt auf Google mit mindestens 114,5 Milliarden Dollar und
      der geringste Betrag auf Microsoft mit knapp 45 Milliarden."
      Amazon steht dort nicht – gerechnet als Rest: 269 − 114,5 − 45 =
      109,5, daher „rund 110" und „der Rest, gerechnet".
      Logos Google, Amazon, Microsoft: Commons, gemeinfrei (File:Google 2015
      logo.svg, File:Amazon logo.svg, File:Microsoft logo (2012).svg), geholt
      mit bilder-holen.yml.
      Danach der Betreiber: „vielleicht noch dann die gesamte
      Börsenbewertung, was Sie erwarten zu IPO und so und wann der IPO dann
      auch ist, schätzungsweise". Belege, gelesen am 28.10.2026:
        Tagesschau: „ebnet den Weg für den Börsengang, der schon in der
        Woche ab dem 16. November erfolgen könnte. Berichten zufolge könnte
        das Unternehmen dabei mit bis zu 2 Billionen Dollar bewertet werden."
        WiWo: „Bislang wurde über eine mögliche Bewertung von rund zwei
        Billionen Dollar spekuliert. Inzwischen soll diese aber auf rund
        1,5 Billionen gesunken sein."
        CNBC (26.10.2026): „Anthropic is aiming to start trading the week of
        Nov. 16, according to a report in the Wall Street Journal"; Kalshi
        95 % für eine offizielle Ankündigung bis Ende 2026; Polymarket 69 %
        für den Handelsstart bis 20. November.
        Tagesschau: Der Prospekt nennt weder Zahl noch Preis der Aktien.
      Form: Torte, neu (am 28.10. Geschichte).
    */
    art: 'torte',
    datum: '2026-10-29',
    /* Freigegeben vom Betreiber am 28.10.2026: „Ja, der passt. Morgen dann 15 Uhr." */
    freigabe: '2026-10-29',
    titel: [
      { text: 'Anthropic:' },
      { text: '269\u00a0Mrd.\u00a0$', gruen: true },
      { text: 'für Big Tech' },
    ],
    erklaerung:
      'So viel muss die Firma hinter dem KI-Modell Claude laut Börsenprospekt mindestens bei Google, Amazon und Microsoft ausgeben.',
    unterzeile: 'Mindestzusagen von Anthropic, in US-Dollar:',
    mitte: { zahl: '269\u00a0Mrd.\u00a0$', text: 'zugesagt' },
    stuecke: [
      {
        name: 'Google',
        wert: 114.5,
        anzeige: '114,5\u00a0Mrd.\u00a0$',
        zusatz: 'mindestens',
        logo: 'google.png',
      },
      {
        name: 'Amazon',
        wert: 109.5,
        anzeige: 'rund 110\u00a0Mrd.\u00a0$',
        zusatz: 'der Rest, gerechnet',
        logo: 'amazon.png',
      },
      {
        name: 'Microsoft',
        wert: 45,
        anzeige: 'knapp 45\u00a0Mrd.\u00a0$',
        zusatz: 'der kleinste Teil',
        logo: 'microsoft.png',
      },
    ],
    infos: [
      { name: 'Bewertung (berichtet)', wert: '1,5\u00a0Bio.\u00a0$' },
      { name: 'Börsenstart (erwartet)', wert: 'ab 16.11.' },
      { name: 'Alle Zusagen (Reuters)', wert: '600+\u00a0Mrd.\u00a0$' },
    ],
    fusszeile: 'Stand: 26.10.2026 | Quellen: Prospekt, WiWo, Reuters, CNBC/WSJ',
    text:
      'Big Tech kassiert mit: Anthropic, die Firma hinter dem KI-Modell Claude, hat sich laut Börsenprospekt verpflichtet, bei Google, Amazon und Microsoft mindestens rund 269 Milliarden Dollar auszugeben. 🤖\n\n' +
      'Den größten Teil bekommt Google mit mindestens 114,5 Milliarden Dollar, den kleinsten Microsoft mit knapp 45 Milliarden. Für Amazon bleibt rechnerisch der Rest von rund 110 Milliarden. Insgesamt hat sich Anthropic laut Reuters zu Ausgaben von mehr als 600 Milliarden Dollar verpflichtet.\n\n' +
      'Und der Börsengang selbst? Laut Wall Street Journal (nach CNBC) soll der Handel in der Woche ab dem 16. November beginnen. Bei der Bewertung wurde zunächst über bis zu zwei Billionen Dollar spekuliert, laut WirtschaftsWoche sollen es inzwischen rund 1,5 Billionen sein. Wie viele Aktien zu welchem Preis verkauft werden, steht im Prospekt noch nicht.\n\n' +
      'Dem stehen bisher Umsätze von 16,3 Milliarden Dollar im ersten Halbjahr 2026 gegenüber – und laut Tagesschau ein Nettoverlust von rund 80,7 Milliarden Dollar, vor allem wegen des Baus von Rechenzentren. An die Börse will Anthropic an der Nasdaq unter dem Kürzel ANT.\n\n' +
      'Quellen: Börsenprospekt von Anthropic, nach WirtschaftsWoche (mit Reuters), Tagesschau und CNBC (mit Wall Street Journal), alle 26.10.2026; Amazon-Anteil eigene Rechnung',
    schlagworte: ['anthropic', 'börsengang', 'ki', 'aktien', 'börse'],
  },
  {
    /*
      Thema vom Betreiber (27.10.2026): „Die teuersten Aktien der Welt …
      Zum Beispiel könntest du da auch eine Lindt reinmachen." Über vier
      Entwürfe (Liste aus dem Kursbestand – „das sind nicht die teuersten";
      Top 5, Top 6 mit Logos, Liste statt Kacheln) dann der Betreiber: „Oder
      mach nur Berkshire Hathaway, die teuerste Aktie der Welt. Und dann
      stell mal Berkshire Hathaway vor." – und, als die Liste noch stand:
      „Nein, ich habe doch gesagt, nur Berkshire Hathaway vorstellen."

      Kurs: Berkshire Hathaway A 810.106 USD, Schluss 27.10.2026 (Yahoo
      Finance, chart-Schnittstelle, gelesen am 28.10. über quellen-holen.yml),
      zum EZB-Referenzkurs vom 27.10. (1,115 USD je Euro) 726.552 €.
      B-Aktie 542,99 USD (Kursbestand der Website, Yahoo, Schluss 27.10.)
      → 487 €. Die erste Kennzahl wiederholte zuerst die Überschrift.

      Alles andere aus en.wikipedia.org/wiki/Berkshire_Hathaway und
      de.wikipedia.org/wiki/Berkshire_Hathaway, gelesen am 28.10.2026:
        „Its class A shares have the highest per-share price of any public
        company in the world … because the board of directors has
        historically been opposed to stock splits" (en);
        „Die Aktie wurde niemals gesplittet und ist somit die teuerste
        Stückaktie der Welt" (de);
        Sitz Omaha, Nebraska; „zu deren Konglomerat über 80 Unternehmen
        gehören"; Umsatz 371,444 Mrd. US-Dollar (2025); 1965 übernahm Buffett
        die Mehrheit; „Vorsitzender ist seit dem 1. Januar 2026 Greg Abel, als
        Nachfolger von Warren Buffett" (de); GEICO, Dairy Queen, See's Candies
        als Töchter (en).
      Logo: File:Berkshire Hathaway.svg, gemeinfrei (PD-textlogo), Commons.

      Danach der Betreiber: „das geht deutlich interessanter. Erstens mal
      nimm die A-Aktie. Dann irgendwas zu Warren Buffett. Noch ein Bild von
      ihm." Aus de.wikipedia.org/wiki/Warren_Buffett und
      en.wikipedia.org/wiki/Warren_Buffett, gelesen am 28.10.2026:
        geboren 30.8.1930 in Omaha; „das Orakel von Omaha"; 1936 Sixpacks
        Coca-Cola für 25 Cent gekauft, Flaschen für je 10 Cent verkauft;
        „Seine ersten Aktien erwarb er 1942 im Alter von elf Jahren";
        wohnt „immer noch in dem Haus …, das er 1958 für 31.500 US-Dollar"
        kaufte; „mehr als 99 Prozent seines Vermögens für wohltätige
        Zwecke"; „According to Forbes, as of January 2026, Buffett's
        estimated net worth stood at US$148.9 billion"; im Mai 2025
        angekündigt, zum Jahresende als CEO zurückzutreten, Greg Abel ab
        1.1.2026.
      Danach der Betreiber: „ne mach entwicklung von denen mit chart
      geschichte usw" – daher die Form Geschichte. Kurse: Yahoo Finance,
      chart BRK-A, range=max, interval=3mo, gelesen am 28.10.2026 über
      quellen-holen.yml; je Jahr der letzte Quartalswert, ab Dezember 1984
      (1.490 $; früher reicht die Reihe nicht). Meilensteine aus
      en.wikipedia.org (action=raw, „Share price milestones"): „over
      $10,000 on October 16, 1992 … over $100,000 for the first time on
      October 23, 2006 … over $500,000 for the first time on March 16,
      2022". Das Angebot von 1964: de.wikipedia.org/wiki/Berkshire_Hathaway
      („das mündliche Angebot, die Anteile von Buffett für 11 1⁄2 $ pro Aktie
      zurückzukaufen. Wenige Wochen später … für lediglich 11 3⁄8 $").
      Form: Geschichte (am 27.10. Balken).
      Foto: File:Warren Buffett at the 2015 SelectUSA Investment Summit
      (cropped).jpg, gemeinfrei (US-Bundesbehörde), Commons, geholt mit
      bilder-holen.yml.
      Form: Steckbrief (am 27.10. Balken).
    */
    art: 'geschichte',
    datum: '2026-10-28',
    /* Freigegeben vom Betreiber am 28.10.2026: „ja passt" – hinaus ab 15 Uhr. */
    freigabe: '2026-10-28',
    titel: [{ text: '810.106\u00a0$', gruen: true }, { text: 'für eine Aktie?' }],
    erklaerung:
      'So viel kostet eine A-Aktie von Berkshire Hathaway. 1964 wollte die Firma Buffett seine Aktien für rund 11,38 $ abkaufen – er kaufte stattdessen die Mehrheit.',
    unterzeile: 'Berkshire-A-Aktie, logarithmisch, in US-Dollar:',
    einheit: '\u00a0$',
    foto: 'warren-buffett.jpg',
    /* Yahoo Finance, chart BRK-A, range=max, interval=3mo; je Jahr der letzte Wert. */
    punkte: [
      { t: '1984-12-01', wert: 1490 },
      { t: '1985-12-01', wert: 2760 },
      { t: '1986-12-01', wert: 3360 },
      { t: '1987-12-01', wert: 3150 },
      { t: '1988-12-01', wert: 4725 },
      { t: '1989-12-01', wert: 7225 },
      { t: '1990-12-01', wert: 8075 },
      { t: '1991-12-01', wert: 8725 },
      { t: '1992-12-01', wert: 12475 },
      { t: '1993-12-01', wert: 15450 },
      { t: '1994-12-01', wert: 22275 },
      { t: '1995-12-01', wert: 35500 },
      { t: '1996-12-01', wert: 35500 },
      { t: '1997-12-01', wert: 55800 },
      { t: '1998-12-01', wert: 71100 },
      { t: '1999-12-01', wert: 44000 },
      { t: '2000-12-01', wert: 70300 },
      { t: '2001-12-01', wert: 73000 },
      { t: '2002-12-01', wert: 61700 },
      { t: '2003-12-01', wert: 94500 },
      { t: '2004-12-01', wert: 90200 },
      { t: '2005-12-01', wert: 86800 },
      { t: '2006-12-01', wert: 106190 },
      { t: '2007-12-01', wert: 140000 },
      { t: '2008-12-01', wert: 78600 },
      { t: '2009-12-01', wert: 119800 },
      { t: '2010-12-01', wert: 131300 },
      { t: '2011-12-01', wert: 117934 },
      { t: '2012-12-01', wert: 152600 },
      { t: '2013-12-01', wert: 173708 },
      { t: '2014-12-01', wert: 221180 },
      { t: '2015-12-01', wert: 202555 },
      { t: '2016-12-01', wert: 257100 },
      { t: '2017-12-01', wert: 310250 },
      { t: '2018-12-01', wert: 302200 },
      { t: '2019-12-01', wert: 309096 },
      { t: '2020-12-01', wert: 364580 },
      { t: '2021-12-01', wert: 476205 },
      { t: '2022-12-01', wert: 463525 },
      { t: '2023-12-01', wert: 616561 },
      { t: '2024-12-01', wert: 775000 },
      { t: '2025-12-01', wert: 757000 },
      { t: '2026-10-27', wert: 810106 },
    ],
    marken: [
      { t: '1992-10-16', wert: 10000, text: 'erstmals, 1992' },
      { t: '2006-10-23', wert: 100000, text: 'erstmals, 2006' },
      { t: '2026-10-27', wert: 810106, text: 'heute' },
    ],
    fusszeile: 'Stand: 27.10.2026 | Quelle: Yahoo Finance, Wikipedia',
    text:
      'Die teuerste Aktie der Welt: Ende 1984 kostete eine A-Aktie von Berkshire Hathaway 1.490 Dollar. Heute sind es 810.106 Dollar – umgerechnet mehr als 726.000 Euro. 📈\n\n' +
      'Angefangen hat es mit einem Streit. 1964 wollte Berkshire, damals eine Textilfirma, Warren Buffett seine Aktien für 11 3/8 Dollar abkaufen – damals wurden Aktien in Achteldollar notiert, das sind rund 11,38 Dollar. Buffett ärgerte sich über das Angebot, lehnte ab und übernahm 1965 stattdessen die Mehrheit. Daraus baute er eine Holding mit über 80 Unternehmen – von der Versicherung GEICO bis Dairy Queen.\n\n' +
      'Die Meilensteine: 1992 schloss die Aktie erstmals über 10.000 Dollar, 2006 über 100.000, 2022 über 500.000. Geteilt wurde sie nie – deshalb ist sie so teuer.\n\n' +
      'Buffett, das „Orakel von Omaha“, kaufte seine erste Aktie mit elf Jahren. Ende 2025 gab er den Chefposten an Greg Abel ab. Er wohnt bis heute in dem Haus, das er 1958 für 31.500 Dollar gekauft hat, und will mehr als 99 % seines Vermögens spenden.\n\n' +
      'Kurse: Jahresendwerte seit 1984, Schluss am 27.10.2026; in Euro zum EZB-Referenzkurs.\n' +
      'Quellen: Yahoo Finance; Europäische Zentralbank; Wikipedia (Berkshire Hathaway, Warren Buffett, darin Forbes); Foto: USA International Trade Administration, gemeinfrei',
    schlagworte: ['warrenbuffett', 'berkshire', 'aktien', 'börse', 'geldanlage'],
  },
  {
    /*
      Thema: Für den 27.10.2026 hatte der Betreiber nichts gewählt – genommen
      war der erste offene Vorschlag vom 26.10. („Gewinn pro Sekunde",
      zuerst mit US-Konzernen). Dann der Betreiber: „Nimm bitte die größten
      Unternehmen von ein paar Ländern, zum Beispiel Deutschland, USA,
      China … mit dem Gewinn pro Sekunde." Der erste Entwurf nahm je Land
      den umsatzstärksten Konzern – in den USA also Amazon statt Alphabet,
      und der Betreiber: „gar keinen Sinn, gerade irgendwas mit Alphabet
      gezeigt, mit 4200 Dollar … und jetzt Amazon mit 2500". Jetzt je Land
      der **gewinnstärkste** – freigegeben: „Wenn du diese Zahlen nimmst,
      wie hier, dann passt der Beitrag auch für heute und ist freigegeben."
      Form: Balken (am 26.10. Burger). Farbe: akzentfarbe('2026-10-27').

      Quelle: die Liste der 50 umsatzstärksten Konzerne der Welt (Fortune
      Global 500 und weitere), en.wikipedia.org/wiki/List_of_largest_companies_by_revenue,
      gelesen am 27.10.2026 über quellen-holen.yml. Je Land der höchste
      Gewinn **in dieser Liste**; Gewinn in Mrd. US-Dollar, „most recent
      fiscal year, primarily 2024 or 2025", geteilt durch 31.536.000 s:
        Alphabet     132   → 4.186 $/s   Saudi Aramco 106  → 3.361
        ICBC          51,4 → 1.630        Toyota        34,2 → 1.084
        TotalEnergies 21,3 →   675        Shell         19,3 →   612
        Volkswagen    17,9 →   568        Samsung       11,0 →   349
      Alphabet hier 4.186 statt 4.191 im SEC-Bestand: Die Liste rundet den
      Gewinn auf 132 Mrd.
    */
    art: 'rangliste',
    skala: 'balken',
    datum: '2026-10-27',
    /* Freigegeben vom Betreiber am 27.10.2026 (Zitat oben) – hinaus ab 15 Uhr. */
    freigabe: '2026-10-27',
    titel: [
      { text: 'Gewinn pro Sekunde:' },
      { text: 'Alphabet 4.186\u00a0$', gruen: true },
    ],
    erklaerung:
      'Der gewinnstärkste Konzern jedes Landes unter den 50 umsatzstärksten der Welt – sein Jahresgewinn geteilt durch die 31,5 Millionen Sekunden eines Jahres.',
    unterzeile: 'Nettogewinn je Sekunde, in US-Dollar:',
    einheit: '\u00a0$',
    stellen: 0,
    zeilen: [
      { name: 'Alphabet', wert: 4186, land: 'USA' },
      { name: 'Saudi Aramco', wert: 3361, land: 'SAU' },
      { name: 'ICBC', wert: 1630, land: 'CHN' },
      { name: 'Toyota', wert: 1084, land: 'JPN' },
      { name: 'TotalEnergies', wert: 675, land: 'FRA' },
      { name: 'Shell', wert: 612, land: 'GBR' },
      { name: 'Volkswagen', wert: 568, land: 'DEU', hervor: true },
      { name: 'Samsung', wert: 349, land: 'KOR' },
    ],
    fusszeile:
      'Stand: GJ 2024/25 | Quelle: Fortune Global 500 (Wikipedia) | eigene Rechnung',
    text:
      'So viel Gewinn macht der gewinnstärkste Konzern eines Landes in einer Sekunde: Alphabet 4.186 Dollar, Saudi Aramco 3.361, die chinesische Bank ICBC 1.630, Toyota 1.084. Volkswagen kommt auf 568 Dollar.\n\n' +
      'Verglichen werden die 50 umsatzstärksten Konzerne der Welt; je Land steht der mit dem höchsten Gewinn. Gerechnet aus dem Nettogewinn des zuletzt gemeldeten Geschäftsjahres – meist 2024 oder 2025 –, geteilt durch die Sekunden eines Jahres.\n\n' +
      'Quellen: Wikipedia, „List of largest companies by revenue" (nach Fortune Global 500, abgerufen am 27.10.2026); eigene Rechnung',
    schlagworte: ['gewinn', 'konzerne', 'aktien', 'weltwirtschaft', 'börse'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 26.10.2026 aus fünf neuen Vorschlägen
      („werde mal ein bisschen kreativer, das sind immer die gleichen
      Muster"): Big-Mac-Index. Neue Form: Burger statt Häuschen oder Balken,
      einer je Euro (am 24.10. Zeitleiste). Farbe: akzentfarbe('2026-10-26').

      Aus The Economist, big-mac-data, output-data/big-mac-full-index.csv,
      Erhebung 2026-07-01 (abgerufen am 26.10.2026 von GitHub). In Euro
      umgerechnet als local_price / dollar_ex × 0,87439 (dollar_ex des
      Euroraums, Euro je Dollar) – die Wechselkurse der Erhebung:
        CHE 7,30 CHF  → 7,906 €    NOR 78 NOK   → 7,042 €
        GBR 5,49 GBP  → 6,471 €    EUZ 6,19 EUR → 6,190 €
        TUR 325 TRY   → 6,043 €    USA 6,22 USD → 5,439 €
        CHN 26,50 CNY → 3,422 €    KOR 5700 KRW → 3,354 €
        JPN 500 JPY   → 2,697 €
      Indien weggelassen: Dort misst der Economist den Maharaja Mac (Huhn),
      keinen Big Mac. Der Euroraum ist der Wert, den der Economist für ihn
      führt, kein Land.
    */
    art: 'rangliste',
    skala: 'burger',
    datum: '2026-10-26',
    /* Freigegeben vom Betreiber am 26.10.2026: „Okay, das passt. Dann später hochladen." – hinaus ab 15 Uhr. */
    freigabe: '2026-10-26',
    titel: [
      { text: 'Big Mac:' },
      { text: 'Schweiz 7,91\u00a0€, Japan 2,70\u00a0€', gruen: true },
    ],
    /*
      Geschichte gelesen am 26.10.2026 (quellen-holen.yml, de.wikipedia.org/
      wiki/Big-Mac-Index): „Er wurde 1986 von der britischen Wochenzeitung
      The Economist erfunden" – entwickelt von der Volkswirtin Pamela Woodall.
      Zur Frage des Betreibers (Währung oder Preisniveau?), ebenda: „Die
      Big-Mac-Preise gelten zwar als einfache Messgröße zum Vergleich des
      landesüblichen Preisniveaus", mit Einflüssen wie ortsüblichen
      Beschaffungskosten; die nach BIP je Einwohner bereinigte Fassung steht
      im README von big-mac-data.
    */
    erklaerung:
      'Ein weit verbreiteter Vergleich: Die Zeitschrift The Economist erfand den Big-Mac-Index 1986. Derselbe Burger überall – das zeigt, wie teuer ein Land ist und ob seine Währung eher zu stark oder zu schwach ist.',
    unterzeile: 'Ein Big Mac, umgerechnet in Euro:',
    einheit: '\u00a0€',
    stellen: 2,
    zeilen: [
      { name: 'Schweiz', wert: 7.91, land: 'CHE' },
      { name: 'Norwegen', wert: 7.04, land: 'NOR' },
      { name: 'Großbritannien', wert: 6.47, land: 'GBR' },
      { name: 'Euroraum', wert: 6.19, land: 'EU27', hervor: true },
      { name: 'Türkei', wert: 6.04, land: 'TUR' },
      { name: 'USA', wert: 5.44, land: 'USA' },
      { name: 'China', wert: 3.42, land: 'CHN' },
      { name: 'Südkorea', wert: 3.35, land: 'KOR' },
      { name: 'Japan', wert: 2.7, land: 'JPN' },
    ],
    fusszeile:
      'Stand: Juli 2026 | Quelle: The Economist, Big-Mac-Index | eigene Umrechnung in Euro',
    text:
      'Was kostet ein Big Mac? Den Big-Mac-Index erfand die britische Zeitschrift The Economist 1986, entwickelt von der Volkswirtin Pamela Woodall. Er vergleicht den Preis desselben Burgers weltweit. Gedacht ist er als Test für Wechselkurse: Kostet der Burger umgerechnet viel mehr als anderswo, gilt die Währung als eher überbewertet. Zugleich gilt der Preis als einfache Messgröße für das Preisniveau im Land, in den auch Kosten vor Ort einfließen – deshalb rechnet der Economist zusätzlich eine Fassung, die die Wirtschaftsleistung je Einwohner berücksichtigt.\n\n' +
      'Stand Juli 2026: In der Schweiz kostet er umgerechnet 7,91 €, im Euroraum 6,19 €, in den USA 5,44 € und in Japan 2,70 €. Umgerechnet zu den Wechselkursen der Erhebung.\n\n' +
      'Quellen: The Economist, Big-Mac-Index (Juli 2026); Wikipedia, „Big-Mac-Index"; eigene Umrechnung in Euro',
    schlagworte: ['bigmac', 'währungen', 'euro', 'preise', 'weltwirtschaft'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 24.10.2026: „Nach dem Crash: so lange
      dauerte die Erholung" – nach „kreativer werden, mal was Neues". Neue
      Form: Zeitleiste (am Vortag Balken). Farbe: akzentfarbe('2026-10-25').

      Nicht aus data/crashes.ts – dort stehen Größenordnungen ohne Quelle.
      Gerechnet aus den Tagesschlusskursen des S&P 500 seit 30.12.1927
      (Yahoo Finance, ^GSPC, abgerufen am 24.10.2026 über quellen-holen.yml),
      nominal, ohne Dividenden. Höchststand im Zeitraum → Tiefpunkt →
      erster Schluss wieder auf dem alten Hoch (Überschrift auf Wunsch des
      Betreibers: „Nach dem Crash: bis zum Hoch"):
        1929  16.09.1929 31,86 → 01.06.1932 4,40 (−86,2 %) → 22.09.1954  25,0 J.
        1987  25.08.1987 336,77 → 04.12.1987 223,92 (−33,5 %) → 26.07.1989  1,9 J.
        2000  24.03.2000 1527,46 → 09.10.2002 776,76 (−49,1 %) → 30.05.2007  7,2 J.
        2008  09.10.2007 1565,15 → 09.03.2009 676,53 (−56,8 %) → 28.03.2013  5,5 J.
        2020  19.02.2020 3386,15 → 23.03.2020 2237,40 (−33,9 %) → 18.08.2020  0,5 J.
        2022  03.01.2022 4796,56 → 12.10.2022 3577,03 (−25,4 %) → 19.01.2024  2,0 J.
    */
    art: 'rangliste',
    skala: 'zeitleiste',
    datum: '2026-10-24',
    /* Freigegeben vom Betreiber am 24.10.2026: „passt", dann „nein heute" – hinaus am 24.10. */
    freigabe: '2026-10-24',
    titel: [{ text: 'Nach dem Crash:' }, { text: 'bis zum Hoch', gruen: true }],
    unterzeile: 'So lange brauchte der S&P 500 zurück auf das alte Hoch:',
    einheit: ' Jahre',
    zeilen: [
      {
        name: 'Depression 1929',
        zusatz: 'Einbruch −86 %',
        wert: 25.0,
        land: 'USA',
        hervor: true,
      },
      { name: 'Crash 1987', zusatz: 'Einbruch −34 %', wert: 1.9, land: 'USA' },
      { name: 'Dotcom 2000', zusatz: 'Einbruch −49 %', wert: 7.2, land: 'USA' },
      { name: 'Finanzkrise 2008', zusatz: 'Einbruch −57 %', wert: 5.5, land: 'USA' },
      { name: 'Corona 2020', zusatz: 'Einbruch −34 %', wert: 0.5, land: 'USA' },
      { name: 'Zinsschock 2022', zusatz: 'Einbruch −25 %', wert: 2.0, land: 'USA' },
    ],
    fusszeile:
      'Stand: Schlüsse bis 23.10.2026 | Quelle: Yahoo Finance (S&P 500) | ohne Dividenden',
    text:
      'Nach dem Crash von 1929 brauchte der S&P 500 25 Jahre zurück auf sein altes Hoch – der Index hatte 86 % verloren. Nach Corona 2020 war es nach einem halben Jahr geschafft. ⏳\n\n' +
      'Dazwischen: Dotcom 2000 (−49 %) 7,2 Jahre, Finanzkrise 2008 (−57 %) 5,5 Jahre, Zinsschock 2022 (−25 %) 2,0 Jahre, Crash 1987 (−34 %) 1,9 Jahre.\n\n' +
      'Gerechnet vom Höchststand vor dem Einbruch bis zum ersten Schlusskurs wieder auf diesem Stand, nominal und ohne Dividenden. Mit ausgeschütteten Dividenden ging es jeweils schneller.\n' +
      'Quelle: Yahoo Finance (S&P 500, Tagesschlusskurse seit 1927)',
    schlagworte: ['börse', 'crash', 'aktien', 'investieren', 'geldanlage'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 22.10.2026: „Arbeitslosigkeit Quoten,
      aber nicht nur in Europa, sondern zur Einordnung auch ein paar andere
      Länder". Form: Kacheln (am Vortag Balken). Farbe: Rot
      (akzentfarbe('2026-10-23')).

      Zahlen: data/snapshots/laender.json, `arbeitslosenquote` – Weltbank,
      World Development Indicators (SL.UEM.TOTL.ZS), Modellschätzung der
      ILO, Jahr 2025, abgerufen am 01.10.2026. 181 Länder haben einen Wert
      für 2025; Deutschland steht mit 3,7 % auf Platz 119 (Platz 1 = höchste
      Quote: Südafrika 32,4). Südafrika, Schweden, Griechenland, Kanada und
      Brasilien fehlen auf der Karte: keine Flagge im Satz.
      Geprüft in tests/instagram-zahlenkarte.test.ts.
    */
    art: 'rangliste',
    skala: 'kacheln',
    datum: '2026-10-23',
    /* Freigegeben vom Betreiber am 22.10.2026: „passt" – hinaus am 23.10. ab 15 Uhr. */
    freigabe: '2026-10-23',
    titel: [
      { text: 'Arbeitslosigkeit:' },
      { text: 'Deutschland 3,7\u00a0%', gruen: true },
    ],
    unterzeile: 'Arbeitslose in Prozent der Erwerbspersonen, 2025:',
    zeilen: [
      { name: 'Spanien', wert: 10.4, land: 'ESP' },
      { name: 'Türkei', wert: 8.5, land: 'TUR' },
      { name: 'Frankreich', wert: 7.5, land: 'FRA' },
      { name: 'Italien', wert: 6.4, land: 'ITA' },
      { name: 'Schweiz', wert: 4.9, land: 'CHE' },
      { name: 'Großbritannien', wert: 4.7, land: 'GBR' },
      { name: 'China', wert: 4.6, land: 'CHN' },
      { name: 'USA', wert: 4.2, land: 'USA' },
      { name: 'Indien', wert: 4.2, land: 'IND' },
      { name: 'Deutschland', wert: 3.7, land: 'DEU', hervor: true },
      { name: 'Südkorea', wert: 2.7, land: 'KOR' },
      { name: 'Japan', wert: 2.5, land: 'JPN' },
    ],
    fusszeile: 'Stand: 2025 | Quelle: Weltbank (WDI), Schätzung der ILO',
    text:
      'In Deutschland waren 2025 3,7 % der Erwerbspersonen arbeitslos. In Spanien waren es 10,4 %, in Japan nur 2,5 %. 📊\n\n' +
      'Über Deutschland lagen die Türkei (8,5 %), Frankreich (7,5 %), Italien (6,4 %), die Schweiz (4,9 %), Großbritannien (4,7 %) und China (4,6 %). ' +
      'Die USA und Indien kamen auf je 4,2 %, Südkorea auf 2,7 %. Von 181 Ländern mit einem Wert für 2025 steht Deutschland auf Platz 119.\n\n' +
      'Gezählt ist die Schätzung der Internationalen Arbeitsorganisation (ILO), die alle Länder nach einer gemeinsamen Regel rechnet. ' +
      'Sie weicht deshalb von der Quote ab, die ein Land selbst veröffentlicht – in Deutschland etwa von der Zahl der Bundesagentur für Arbeit.\n' +
      'Quelle: Weltbank, World Development Indicators (ILO-Schätzung)',
    schlagworte: [
      'arbeitslosigkeit',
      'wirtschaft',
      'arbeitsmarkt',
      'deutschland',
      'finanzen',
    ],
  },
  {
    /*
      Thema gewählt vom Betreiber am 21.10.2026: „ja Verlierer, aber nur
      Verlierer". Anlass: Netflix-Zahlen und Gehalts-Aus bei VW (Ausgaben vom
      20. und 21.10.). Form: Balken, nur Minus (am Vortag Kacheln). Farbe:
      Navy (akzentfarbe('2026-10-22')).

      Zahlen: Yahoo Finance, Tagesschlusskurse, abgerufen am 21.10.2026 über
      quellen-holen.yml; Kursbestand der Website stimmt überein.
      Letzter Schluss 2025 → 20.10.2026, jeweils in Handelswährung:
        Stellantis (STLA)   10,89 →   4,33 $   −60,24 %
        HelloFresh (HFG.DE)  6,16 →   2,94 €   −52,29 % (Jahresschluss 30.12.)
        Nike (NKE)          63,71 →  37,88 $   −40,54 %
        LVMH (MC.PA)       645,00 → 386,75 €   −40,04 %
        BMW (BMW.DE)        93,14 →  57,64 €   −38,11 %
        Volkswagen (VOW3)  103,55 →  69,66 €   −32,73 %
        Rheinmetall (RHM)  1561,0 → 1054,0 €   −32,48 %
        Netflix (NFLX)      93,76 →  68,69 $   −26,74 %
      Lululemon (−51,91 %) weggelassen: kanadisches Unternehmen, keine Flagge.
    */
    art: 'rangliste',
    skala: 'balken',
    datum: '2026-10-22',
    /* Freigegeben vom Betreiber am 21.10.2026: „passt" – hinaus am 22.10. ab 15 Uhr. */
    freigabe: '2026-10-22',
    titel: [
      { text: 'Die Verlierer 2026:' },
      { text: 'Stellantis −60\u00a0%', gruen: true },
    ],
    unterzeile: 'Kursverlust seit Jahresbeginn, in Prozent:',
    zeilen: [
      { name: 'Netflix', wert: -26.7, land: 'USA' },
      { name: 'Rheinmetall', wert: -32.5, land: 'DEU' },
      { name: 'Volkswagen', wert: -32.7, land: 'DEU' },
      { name: 'BMW', wert: -38.1, land: 'DEU' },
      { name: 'LVMH', wert: -40.0, land: 'FRA' },
      { name: 'Nike', wert: -40.5, land: 'USA' },
      { name: 'HelloFresh', wert: -52.3, land: 'DEU' },
      { name: 'Stellantis', wert: -60.2, land: 'NLD', hervor: true },
    ],
    fusszeile:
      'Stand: Schlusskurse 20.10.2026 | Quelle: Yahoo Finance | in Handelswährung',
    text:
      'Stellantis hat seit Jahresbeginn 60,2 % an Wert verloren – die Aktie fiel von 10,89 auf 4,33 Dollar. 📉\n\n' +
      'Dahinter HelloFresh (−52,3 %), Nike (−40,5 %), LVMH (−40,0 %) und BMW (−38,1 %). ' +
      'Volkswagen liegt 32,7 % im Minus, Rheinmetall 32,5 %. Netflix verlor 26,7 %.\n\n' +
      'Gerechnet vom letzten Schlusskurs 2025 bis zum 20.10.2026, jeweils in Handelswährung.\n' +
      'Quelle: Yahoo Finance (Schlusskurse)',
    schlagworte: ['aktien', 'börse', 'verlierer', 'investieren', 'dax'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 20.10.2026: „thema 4" – Inflation 2025,
      Anlass: Bundesbank-Monatsbericht (Handelsblatt, 19.10.2026, in
      data/editions/2026-10-20.ts). Form: Kacheln (am Vortag Balken).
      Farbe: Grün (akzentfarbe('2026-10-21')).

      Zahlen: data/snapshots/laender.json, `inflation` – Weltbank, World
      Development Indicators (FP.CPI.TOTL.ZG), Verbraucherpreise,
      Jahresdurchschnitt 2025 gegenüber 2024. 164 Länder haben einen Wert
      für 2025; Deutschland steht mit 2,2 % auf Platz 102 (Platz 1 = höchste
      Rate: Iran 42,2). Die USA fehlen: Ihr letzter Wert stammt aus 2024.
      Geprüft in tests/instagram-zahlenkarte.test.ts.
    */
    art: 'rangliste',
    skala: 'kacheln',
    datum: '2026-10-21',
    /* Freigegeben vom Betreiber am 20.10.2026: „passt" – hinaus am 21.10. ab 15 Uhr. */
    freigabe: '2026-10-21',
    titel: [{ text: 'Inflation 2025:' }, { text: 'Deutschland 2,2\u00a0%', gruen: true }],
    unterzeile: 'So stark stiegen die Verbraucherpreise 2025 im Jahresschnitt:',
    zeilen: [
      { name: 'Türkei', wert: 34.9, land: 'TUR' },
      { name: 'Großbritannien', wert: 3.9, land: 'GBR' },
      { name: 'Polen', wert: 3.8, land: 'POL' },
      { name: 'Österreich', wert: 3.5, land: 'AUT' },
      { name: 'Niederlande', wert: 3.3, land: 'NLD' },
      { name: 'Japan', wert: 3.2, land: 'JPN' },
      { name: 'Spanien', wert: 2.7, land: 'ESP' },
      { name: 'Deutschland', wert: 2.2, land: 'DEU', hervor: true },
      { name: 'Italien', wert: 1.5, land: 'ITA' },
      { name: 'Frankreich', wert: 0.9, land: 'FRA' },
      { name: 'Schweiz', wert: 0.2, land: 'CHE' },
      { name: 'China', wert: 0.1, land: 'CHN' },
    ],
    fusszeile: 'Stand: 2025 | Quelle: Weltbank (WDI) | Jahresdurchschnitt',
    text:
      'Die Verbraucherpreise in Deutschland stiegen 2025 im Jahresschnitt um 2,2 %. In der Türkei waren es 34,9 %, in China nur 0,1 %. 📊\n\n' +
      'Über Deutschland lagen unter anderem Großbritannien (3,9 %), Polen (3,8 %), Österreich (3,5 %), die Niederlande (3,3 %), Japan (3,2 %) und Spanien (2,7 %). ' +
      'Darunter Italien (1,5 %), Frankreich (0,9 %) und die Schweiz (0,2 %). Von 164 Ländern mit einem Wert für 2025 steht Deutschland auf Platz 102.\n\n' +
      'Zum Ausblick: Die Bundesbank schreibt in ihrem Monatsbericht, die Inflation in Deutschland bleibe „merklich erhöht“ – bis weit in das Jahr 2027 hinein.\n\n' +
      'Gezählt ist der Jahresdurchschnitt 2025, nicht die Rate von heute; der Warenkorb wird je Land national festgelegt.\n' +
      'Quellen: Weltbank, World Development Indicators; Handelsblatt (19.10.2026)',
    schlagworte: ['inflation', 'preise', 'geldanlage', 'wirtschaft', 'deutschland'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 19.10.2026: „Nehmen lieber Öl schlägt
      alles." – statt „SMI schlägt Nasdaq" (Duell), nach dem Vorbild HKCM.
      Form: Balken mit Plus und Minus (am Vortag Verlauf). Farbe: Anthrazit.

      Zahlen: Yahoo Finance, Tagesschlusskurse, abgerufen am 19.10.2026 über
      quellen-holen.yml (Lauf 39277296882). Letzter Schluss 2025 → 16.10.2026:
        Brent (BZ=F)       60,85 →    109,86   +80,54 %
        Nasdaq 100 (^NDX)  25.249,85 → 29.187,55 +15,59 %
        S&P 500 (^GSPC)    6.845,50 →  7.659,44  +11,89 %
        Dax (^GDAXI)       24.490,41 → 25.622,61 +4,62 % (Jahresschluss 30.12.)
        Gold (GC=F)        4.341,10 →  4.181,10  −3,69 %
        Bitcoin (BTC-USD)  87.508,83 → 81.500,80 −6,87 %
        Silber (SI=F)      70,13 →     56,99     −18,73 %
      Rohstoffe als Terminkontrakt in US-Dollar, Indizes in Landeswährung.
      S&P 500 und Dax decken sich mit der Karte vom 19.10.
    */
    art: 'rangliste',
    skala: 'balken',
    datum: '2026-10-20',
    /* Freigegeben vom Betreiber am 19.10.2026: „Ja, perfekt, das passt. Das morgen dann hochladen." */
    freigabe: '2026-10-20',
    titel: [
      { text: 'Öl schlägt alles:' },
      { text: 'Brent +80,5 % seit Januar', gruen: true },
    ],
    unterzeile: 'Wertentwicklung seit Jahresbeginn:',
    zeilen: [
      { name: 'Öl (Brent)', wert: 80.5, land: 'OEL', hervor: true },
      { name: 'Nasdaq 100', wert: 15.6, land: 'USA' },
      { name: 'S&P 500', wert: 11.9, land: 'USA' },
      { name: 'Dax', wert: 4.6, land: 'DEU' },
      { name: 'Gold', wert: -3.7, land: 'GOLD' },
      { name: 'Bitcoin', wert: -6.9, land: 'BTC' },
      { name: 'Silber', wert: -18.7, land: 'SILBER' },
    ],
    fusszeile:
      'Stand: Schlusskurse 16.10.2026 | Quelle: Yahoo Finance | Rohstoffe und Bitcoin in US-Dollar',
    text:
      'Ein Barrel der Nordseesorte Brent kostete am Freitag 109,86 Dollar – zum Jahresende 2025 waren es 60,85 Dollar. Ein Plus von 80,5 %. 🛢️\n\n' +
      'Kein anderer der großen Werte kommt annähernd heran: Der Nasdaq 100 legte seit Jahresbeginn um 15,6 % zu, der S&P 500 um 11,9 %, der Dax um 4,6 %. ' +
      'Gold liegt 3,7 % im Minus, Bitcoin 6,9 %, Silber sogar 18,7 %.\n\n' +
      'Indizes in Landeswährung, Rohstoffe als Terminkontrakt und Bitcoin in US-Dollar.\n' +
      'Quellen: Yahoo Finance (Schlusskurse vom 16.10.2026 und Jahresschluss 2025)',
    schlagworte: ['öl', 'brent', 'rohstoffe', 'börse', 'investieren'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 19.10.2026 aus drei Vorschlägen („Dax
      gegen S&P 500"). Form: Verlauf – am Vortag Kacheln. Farbe: Rot
      (akzentfarbe('2026-10-19')).

      Zahlen: Kursbestand der Website (Yahoo Finance), getQuotes() –
      Schlusskurse vom Freitag, 16.10.2026, und die Veränderung seit dem
      letzten Schlusskurs 2025 (`ytdPercent`): Dax 25.622,61 Punkte, +4,62 %;
      S&P 500 7.659,44 Punkte, +11,89 %. Jeweils in Landeswährung.
      Geprüft in tests/instagram-zahlenkarte.test.ts.
    */
    /*
      Erster Entwurf: zwei Balken (Vergleich). Der Betreiber: „nein, mit Chart
      vergleich, bissl kreativer werden!!" – jetzt der Verlauf beider Indizes
      seit Jahresbeginn.
    */
    art: 'verlauf',
    datum: '2026-10-19',
    /* Freigegeben vom Betreiber am 19.10.2026: „ja passt" – hinaus ab 16 Uhr. */
    freigabe: '2026-10-19',
    titel: [{ text: 'Dax gegen S&P 500:' }, { text: 'Wall Street vorn', gruen: true }],
    unterzeile: 'Wertentwicklung seit Jahresbeginn, in Prozent:',
    bis: '2026-10-16',
    reihen: [
      { name: 'S&P 500', symbol: 'sp500', land: 'USA', akzent: true, endwert: '+11,9 %' },
      { name: 'Dax', symbol: 'dax', land: 'DEU', endwert: '+4,6 %' },
    ],
    fusszeile:
      'Stand: Schlusskurse 16.10.2026 | Quelle: Yahoo Finance | jeweils in Landeswährung',
    text:
      'Seit Jahresbeginn hat der S&P 500 um 11,9 % zugelegt – der Dax nur um 4,6 %. 📊\n\n' +
      'Der US-Leitindex schloss am Freitag bei 7.659 Punkten, der Dax bei 25.623 Punkten. Der Abstand beträgt 7,3 Prozentpunkte. ' +
      'Beide Werte sind in Landeswährung gerechnet; für Anleger aus dem Euroraum kommt beim S&P 500 die Entwicklung des Dollars hinzu.\n' +
      'Quellen: Yahoo Finance (Schlusskurse vom 16.10.2026 und Jahresschluss 2025)',
    schlagworte: ['dax', 'sp500', 'aktien', 'börse', 'investieren'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 18.10.2026 aus den Vorschlägen
      („Vermögen"), nachdem er „Kinder je Frau" abgelehnt hatte („Nee, lieber
      ein anderes Thema"); dazu: „nehme aber noch ein paar weitere Länder
      dazu". Form: Kacheln – am Vortag waren es Balken.

      Zahlen: data/snapshots/laender.json, `medianvermoegen` – OECD, Wealth
      Distribution Database (Reinvermögen je Haushalt, Median), von der
      Quelle in Landeswährung, mit dem EZB-Referenzkurs zum Ende des
      Erhebungsjahres in US-Dollar umgerechnet. Erhebungsjahre je Land
      verschieden (hier 2016–2023). 30 Länder; Deutschland Platz 19.
      Geprüft in tests/instagram-zahlenkarte.test.ts.
    */
    art: 'rangliste',
    /*
      Freigegeben vom Betreiber am 18.10.2026: „direkt noch danach den
      Vermögensbeitrag" – nach dem neu gemachten Tagesbeitrag.
    */
    freigabe: '2026-10-18',
    skala: 'kacheln',
    einheit: ' $',
    stellen: 0,
    datum: '2026-10-18',
    titel: [{ text: 'Vermögen:' }, { text: 'Italien vor Deutschland', gruen: true }],
    unterzeile: 'Mittleres Vermögen je Haushalt, nach Abzug der Schulden:',
    zeilen: [
      { name: 'Luxemburg', wert: 812822, land: 'LUX' },
      { name: 'Belgien', wert: 297482, land: 'BEL' },
      { name: 'Großbritannien', wert: 246692, land: 'GBR' },
      { name: 'Italien', wert: 195109, land: 'ITA' },
      { name: 'USA', wert: 165700, land: 'USA' },
      { name: 'Frankreich', wert: 154213, land: 'FRA' },
      { name: 'Niederlande', wert: 148733, land: 'NLD' },
      { name: 'Österreich', wert: 144734, land: 'AUT' },
      { name: 'Spanien', wert: 144607, land: 'ESP' },
      { name: 'Deutschland', wert: 120795, land: 'DEU', hervor: true },
      { name: 'Polen', wert: 63085, land: 'POL' },
      { name: 'Lettland', wert: 38386, land: 'LVA' },
    ],
    fusszeile: 'Stand: 2016–2023 | Quelle: OECD (Reinvermögen, Median) | in US-Dollar',
    text:
      'Ein mittlerer Haushalt in Deutschland besitzt nach Abzug aller Schulden 120.795 Dollar – in Italien sind es 195.109 Dollar. 💶\n\n' +
      'Auch in Spanien (144.607), Österreich (144.734), den Niederlanden (148.733), Frankreich (154.213) und den USA (165.700) liegt das mittlere Vermögen höher. ' +
      'Belgien kommt auf 297.482, Großbritannien auf 246.692 Dollar. An der Spitze steht Luxemburg mit 812.822 Dollar; Polen (63.085) und Lettland (38.386) liegen darunter. ' +
      'Unter den 30 Ländern der OECD-Statistik steht Deutschland auf Platz 19.\n\n' +
      'Gezählt wird der Median – der Haushalt in der Mitte, nicht der Durchschnitt, den wenige Reiche nach oben ziehen. Zum Vergleich: In Deutschland wohnen nur 47,2 % der Menschen im Eigentum, so wenige wie in keinem anderen Land der Eurostat-Statistik (2025). ' +
      'Die Erhebungsjahre liegen je Land zwischen 2016 und 2023, umgerechnet zum EZB-Kurs am Jahresende; Haushalte sind je Land verschieden groß.\n' +
      'Quellen: OECD, Wealth Distribution Database; Europäische Zentralbank (Umrechnung); Eurostat (Wohneigentum)',
    schlagworte: ['vermögen', 'geldanlage', 'finanzen', 'deutschland', 'sparen'],
  },
  {
    /*
      Thema gewählt vom Betreiber am 16.10.2026 („Für morgen Thema 1 mit den
      Staatsschulden"), Zuschnitt am 17.10.: „Niedrigstes. Höchstes, so. Und
      vielleicht noch Frankreich, weil die machen Probleme." – also der
      niedrigste und der höchste Wert aller Länder, Frankreich und die vier
      aus dem Vorschlag (Deutschland, USA, Italien, Japan).

      Zahlen: data/snapshots/laender.json, `schuldenquote` – IWF, World
      Economic Outlook (GGXWDG_NGDP), Bruttoschuld des Gesamtstaats in % des
      BIP, Jahr 2025. 188 Länder haben einen Wert für 2025; oben Venezuela
      308,7, unten Liechtenstein 0,5. Eritrea (260,4) stammt aus 2019 und
      zählt nicht mit. Deutschland steht auf Platz 68 von 188.

      Der Schnitt („durchschnittlich noch", Betreiber 17.10.): einfacher
      Mittelwert dieser 188 Werte, 59,8 – nicht nach Wirtschaftskraft
      gewichtet; der gewichtete Weltwert des IWF steht nicht im Bestand.

      Frankreichs „Probleme": Goldreporter, Top-News vom 12.10.2026
      („Anleihezinsen bleiben hoch: Frankreich unter Druck"), so in
      data/news.ts.
      Geprüft in tests/instagram-zahlenkarte.test.ts.
    */
    art: 'rangliste',
    skala: 'balken',
    datum: '2026-10-17',
    /*
      Freigegeben vom Betreiber am 17.10.2026 um 11:49 („perfekt das passt",
      Entwurf 2 mit Länderschnitt). Hinaus geht sie frühestens um 16 Uhr.
    */
    freigabe: '2026-10-17',
    titel: [
      { text: 'Staatsschulden:' },
      { text: 'Wer am tiefsten drinsteckt', gruen: true },
    ],
    unterzeile: 'Schulden des Staates in % der Wirtschaftsleistung:',
    zeilen: [
      { name: 'Venezuela', wert: 308.7, land: 'VEN' },
      { name: 'Japan', wert: 206.5, land: 'JPN' },
      { name: 'Italien', wert: 137.1, land: 'ITA' },
      { name: 'USA', wert: 123.9, land: 'USA' },
      { name: 'Frankreich', wert: 116, land: 'FRA' },
      { name: 'Deutschland', wert: 62.9, land: 'DEU', hervor: true },
      { name: 'Länderschnitt', wert: 59.8, land: 'WELT', schnitt: true },
      { name: 'Liechtenstein', wert: 0.5, land: 'LIE' },
    ],
    fusszeile:
      'Stand: 2025 | Quelle: IWF, World Economic Outlook | Auswahl aus 188 Ländern',
    text:
      'Venezuela schuldet mehr als das Dreifache seiner Wirtschaftsleistung: 308,7 % des BIP – der höchste Wert aller Länder mit Zahlen für 2025. Dahinter folgt Japan mit 206,5 %. 📊\n\n' +
      'Auch Italien (137,1 %), die USA (123,9 %) und Frankreich (116,0 %) liegen über 100 %: Der Staat schuldet dort mehr, als das ganze Land in einem Jahr erwirtschaftet. ' +
      'In Frankreich bleiben die Anleiherenditen zudem hoch. ' +
      'Deutschland kommt auf 62,9 % – Platz 68 von 188 Ländern und knapp über dem Durchschnitt aller Länder von 59,8 %. Am wenigsten Schulden hat Liechtenstein mit 0,5 %.\n\n' +
      'Gezählt wird die Bruttoschuld des Gesamtstaats in der einheitlichen Abgrenzung des IWF; sie weicht von den Maastricht-Zahlen der EU ab. Der Durchschnitt ist der einfache Mittelwert der 188 Länder, nicht nach Wirtschaftskraft gewichtet.\n' +
      'Quellen: IWF, World Economic Outlook (Stand 2025); Goldreporter (12.10.2026) zu Frankreich',
    schlagworte: ['staatsschulden', 'schulden', 'wirtschaft', 'börse', 'finanzen'],
  },
  {
    /*
      Thema: keine Wahl des Betreibers für den 16.10. – laut Ablauf der erste
      offene Vorschlag vom 15.10. („US-Inflation springt auf 3,7 %").

      Zahlen:
        3,7 %  US-Verbraucherpreise September, gegenüber Vorjahr – Handelsblatt
               und CNBC vom 14.10.2026, so in data/news.ts
               (us-inflation-september-ueberrascht-notenbank)
        2,0 %  Inflationsziel der US-Notenbank – im selben Artikel
        3,6 %  Prognose, 3,4 % Vormonat – ForexFactory, „CPI y/y" vom
               14.10.2026 (tests/fixtures/forexfactory-2026-10-16.json)
      Geprüft in tests/instagram-zahlenkarte.test.ts.
    */
    datum: '2026-10-16',
    titel: [
      { text: 'US-Inflation:' },
      { text: 'fast doppelt so hoch wie das Ziel', gruen: true },
    ],
    links: {
      name: 'Ziel der Fed',
      wert: 2,
      anzeige: '2,0 %',
      zusatz: 'Inflationsziel',
    },
    rechts: {
      name: 'US-Inflation',
      wert: 3.7,
      anzeige: '3,7 %',
      zusatz: 'im September',
    },
    differenz: { text: '+1,7', zusatz: 'Prozentpunkte' },
    fusszeile:
      'Stand: September 2026 | Quellen: Handelsblatt, CNBC (14.10.2026), ForexFactory',
    text:
      'Die US-Inflation liegt bei 3,7 % – fast doppelt so hoch wie das Ziel der US-Notenbank von 2 %. 📈\n\n' +
      'Die Verbraucherpreise sind im September stärker gestiegen als erwartet: Die Prognose lag bei 3,6 %, im August waren es 3,4 %. ' +
      'An den Anleihemärkten zogen die Renditen unmittelbar nach der Veröffentlichung an.\n\n' +
      'Quellen: Handelsblatt, CNBC (14.10.2026), ForexFactory (Prognose und Vormonat)',
    schlagworte: ['inflation', 'usa', 'fed', 'börse', 'finanzen'],
    /*
      Freigegeben vom Betreiber am 16.10.2026: „Ja, das passt" – die Karte,
      nicht das Titelbild davor („das andere nicht"). Der Tagesbeitrag bleibt
      eine Seite.
    */
    freigabe: '2026-10-16',
  },
  {
    /*
      Thema gewählt vom Betreiber am 15.10.2026 aus fünf Vorschlägen
      („Wir machen das Thema Wohneigentum").

      Zahlen: data/snapshots/laender.json, Eurostat EU-SILC ilc_lvho02,
      Bezugsjahr 2025 – Anteil der Bevölkerung (Personen, nicht Haushalte)
      in einer Wohnung im Eigentum des eigenen Haushalts, mit und ohne Kredit.
      Deutschland 47,2 % ist der niedrigste Wert aller 30 Länder der Reihe;
      oben Slowakei 93,8, Rumänien 93,2, Kroatien 91,4.
    */
    art: 'rangliste',
    datum: '2026-10-15',
    /*
      Freigegeben vom Betreiber am 15.10.2026 („so passt es", Entwurf 4).
      Nachgetragen um 17:06, als er fragte „wo bleibt der von heute" – die
      Karte war um 08:59 von Hand hinausgegangen, noch ohne dieses Feld.
      Steht sie noch im Kanal, hält der Veröffentlicher an (Riegel 4).
    */
    freigabe: '2026-10-15',
    /*
      Erster Entwurf: zwei Balken, Deutschland gegen Polen. Der Betreiber:
      „mache mehrere Länder in den Vergleich, es muss auch nicht immer so ein
      Balkendiagramm sein". Jetzt eine Auswahl aus den 30 Ländern – nur
      solche, deren Flagge sich im Kreis erkennen lässt (Kroatien mit seinem
      Schachbrett nicht), oben der Spitzenreiter, unten Deutschland als
      Schlusslicht, dazwischen der EU-Schnitt (EU27_2020, 68,5).
    */
    titel: [
      { text: 'Deutschland ist' },
      { text: 'Europas Land der Mieter', gruen: true },
    ],
    unterzeile: 'Von 10 Menschen wohnen so viele im Eigentum:',
    zeilen: [
      { name: 'Slowakei', wert: 93.8, land: 'SVK' },
      { name: 'Rumänien', wert: 93.2, land: 'ROU' },
      { name: 'Ungarn', wert: 89.8, land: 'HUN' },
      { name: 'Polen', wert: 87.2, land: 'POL' },
      { name: 'Italien', wert: 77.1, land: 'ITA' },
      { name: 'Spanien', wert: 73.6, land: 'ESP' },
      { name: 'Belgien', wert: 70.9, land: 'BEL' },
      { name: 'EU-Schnitt', wert: 68.5, land: 'EU27', schnitt: true },
      { name: 'Frankreich', wert: 61.4, land: 'FRA' },
      { name: 'Österreich', wert: 54.2, land: 'AUT' },
      { name: 'Deutschland', wert: 47.2, land: 'DEU', hervor: true },
    ],
    fusszeile:
      'Stand: 2025 | Quelle: Eurostat, EU-SILC (ilc_lvho02) | Auswahl aus 30 Ländern',
    text:
      'Deutschland ist Europas Land der Mieter: Nur 47,2 % der Menschen wohnen in den eigenen vier Wänden. 🏠\n\n' +
      'Das ist der niedrigste Wert aller 30 Länder in der Eurostat-Statistik – der EU-Schnitt liegt bei 68,5 %. ' +
      'Ganz oben stehen die Slowakei mit 93,8 % und Rumänien mit 93,2 %. ' +
      'Auch in Ungarn, Polen, Italien und Spanien wohnt die große Mehrheit im Eigentum.\n\n' +
      'Gezählt werden Personen, nicht Haushalte – mit und ohne laufenden Kredit.\n' +
      'Quellen: Eurostat, EU-SILC (ilc_lvho02), Stand 2025',
    schlagworte: ['wohneigentum', 'immobilien', 'miete', 'deutschland', 'finanzen'],
  },
]

/** Die jüngste Karte – die, um die es heute geht. */
/**
 * Gebaut, aber zurückgestellt. Betreiber, 02.11.2026, zur Lagarde-Karte:
 * „So ähnlich können wir das speichern für wann anders, aber heute ist es
 * … wichtigere Themen." Wer eine davon bringt, setzt das Datum und hängt sie
 * oben in `zahlenkarten` ein.
 */
export const zurueckgestellt: Zahlenkarte[] = []

export function aktuelleZahlenkarte(): Zahlenkarte | null {
  return [...zahlenkarten].sort((a, b) => b.datum.localeCompare(a.datum))[0] ?? null
}
