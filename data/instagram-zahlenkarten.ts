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

export const zahlenkarten: Zahlenkarte[] = [
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
export function aktuelleZahlenkarte(): Zahlenkarte | null {
  return [...zahlenkarten].sort((a, b) => b.datum.localeCompare(a.datum))[0] ?? null
}
