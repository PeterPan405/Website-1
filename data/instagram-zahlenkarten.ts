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
      Zahlenkarte 14.11.2026, „Welches Metall ist das?“ – Rätsel. Der
      Betreiber hat aus den drei Vorschlägen vom 14.11. (Rätsel Metalle,
      Balken Edelmetalle, Zeitstrahl Jahreshochs) nicht gewählt; nach dem
      Ablauf der erste, zugleich die Empfehlung. Nicht in den News vom 14.11.
      (dort Bitcoin, Nvidia, US-Erzeugerpreise, FAA, SpaceX). Form: Rätsel
      (am 13.11. Chart).

      Kurse: data/snapshots/markets.json (Yahoo Finance, Terminkontrakte,
      $ je Feinunze), Schlusskurse 02.01. bis 13.11.2026; im Bild jeder
      zweite Handelstag, Hoch und 13.11. immer dabei.
        Silber 70,56 $ (02.01.) · Hoch 115,08 $ am 2026-01-26 · 13.11. 48,65 $ → -57,7 % vom Hoch
        Platin 2.125,7 $ (02.01.) · Hoch 2.852,4 $ am 2026-01-26 · 13.11. 1.492,2 $ → -47,7 % vom Hoch
        Gold 4.329,6 $ (02.01.) · Hoch 5.318,4 $ am 2026-01-29 · 13.11. 3.887,6 $ → -26,9 % vom Hoch
      Fotos (Wikimedia Commons, über bilder-holen.yml):
        Silber: File:Heraeus 10 oz 9999 fine silver bar (52202724589).jpg, Chi Ho Chan, CC BY 2.0;
          linker Barren freigestellt, auf hellgrauem Grund wie Platin und Gold
          (Betreiber: „komisch, da die anderen beide weiß im Hintergrund sind“)
        Platin: File:Platinum-nugget.jpg, Alchemist-hp, Free Art License
        Gold: File:Gold Ingots on white background.jpg, Szaaman, gemeinfrei
    */
    art: 'raetsel',
    datum: '2026-11-14',
    freigabe: '2026-11-14',
    titel: [{ text: 'Welches Metall' }, { text: 'ist das?' }],
    zeitraum: 'Kurs seit Jahresbeginn',
    fragen: [
      {
        tipp: 'Ein Edelmetall, das auch in Solarzellen und Elektronik steckt.',
        punkte: [
          70.56, 80.53, 74.72, 84.61, 90.87, 88.09, 92.21, 100.93, 115.08, 105.52, 114.04,
          76.78, 84.17, 76.74, 80.22, 75.55, 73.45, 77.57, 86.52, 90.94, 92.68, 82.92,
          81.69, 84.03, 85.07, 80.91, 79.53, 70.9, 69.05, 72.36, 69.54, 74.69, 72.74,
          71.83, 76.28, 75.52, 79.49, 81.74, 76.41, 75.46, 75, 71.57, 75.95, 73.11, 79.7,
          85.49, 88.89, 77.16, 74.83, 76.41, 76.31, 75.64, 75.01, 73.48, 68.94, 65.09,
          63.88, 70.07, 70.7, 65.53, 58.05, 59.22, 59.48, 60.64, 60.93, 60.38, 57.63,
          57.11, 56.04, 58.83, 57.8, 58.47, 57.86, 57.59, 60.06, 61.44, 65.11, 65.56,
          64.99, 63.94, 68.03, 68.54, 67.99, 67, 64.62, 66.97, 66.3, 64.28, 63.51, 64.29,
          66.56, 65.93, 63.46, 61.22, 60.1, 59.98, 61.17, 59.06, 60.14, 55.55, 56.99,
          57.71, 54.76, 54.11, 53.46, 49.1, 49.59, 52.23, 52.56, 51.88, 48.65,
        ],
        achse: [
          { bei: 0, text: 'Jan.' },
          { bei: 32, text: 'April' },
          { bei: 63, text: 'Juli' },
          { bei: 95, text: 'Okt.' },
          { bei: 110, text: '13.11.' },
        ],
        name: 'Silber',
        logo: 'silberbarren.png',
        foto: true,
        satz: 'Silber stieg bis zum 26. Januar auf 115,08 $ je Unze. Am 13. November waren es 48,65 $ – minus 57,7 %.',
      },
      {
        frage: 'Und dieses?',
        tipp: 'Ein Edelmetall, das in vielen Autokatalysatoren steckt.',
        punkte: [
          2125.7, 2434, 2251.7, 2359.6, 2367.1, 2303.8, 2480.4, 2722.1, 2852.4, 2513.2,
          2597.4, 2093.5, 2162.7, 2093.3, 2091.6, 2014, 2012.5, 2062.3, 2146.4, 2325.6,
          2365.6, 2074.8, 2130, 2169.6, 2205, 2036.6, 2131.8, 1939.2, 1860.3, 1925.2,
          1870.6, 1950, 1963.8, 1929.1, 2096.6, 2061.8, 2112.9, 2124.5, 2024.3, 2022.6,
          1981.1, 1885.3, 1996.6, 1960.7, 2048.1, 2115.5, 2187.1, 1981.3, 1933.8, 1955.1,
          1942.2, 1921.6, 1922.4, 1868.7, 1792, 1708.6, 1662.6, 1770, 1790.7, 1670.3,
          1580.6, 1630.9, 1550.2, 1616.6, 1651.2, 1618.8, 1602.2, 1631.5, 1605.8, 1626.1,
          1599.1, 1620.6, 1590.1, 1650.3, 1747.3, 1729, 1744.5, 1761.1, 1750, 1726.4,
          1831, 1880.1, 1835.7, 1847.6, 1761.5, 1828.4, 1848.2, 1797.1, 1775.9, 1783.2,
          1803.5, 1822.6, 1749.1, 1721.2, 1702.3, 1683.2, 1692.7, 1625.7, 1679.4, 1601.3,
          1623.3, 1646.6, 1567.5, 1536.7, 1547.9, 1438, 1432.4, 1524.4, 1561.2, 1539,
          1492.2,
        ],
        achse: [
          { bei: 0, text: 'Jan.' },
          { bei: 32, text: 'April' },
          { bei: 63, text: 'Juli' },
          { bei: 95, text: 'Okt.' },
          { bei: 110, text: '13.11.' },
        ],
        name: 'Platin',
        logo: 'platin-nugget.png',
        foto: true,
        satz: 'Platin kostete am 26. Januar 2.852,4 $ je Unze, am 13. November 1.492,2 $. Das sind 47,7 % weniger.',
      },
      {
        frage: 'Und das letzte?',
        tipp: 'Das Metall, das Notenbanken in ihren Tresoren lagern.',
        punkte: [
          4329.6, 4496.1, 4460.7, 4614.7, 4635.7, 4595.4, 4837.5, 4979.7, 5082.6, 5318.4,
          4652.6, 4950.8, 4979.8, 5031, 4948.4, 4905.9, 4997.4, 5225.6, 5226.2, 5247.9,
          5123.7, 5078.7, 5103.7, 5179.1, 5061.7, 5008.2, 4605.7, 4407.3, 4552.3, 4492.5,
          4647.6, 4679.7, 4684.7, 4818, 4767.4, 4823.6, 4879.6, 4719.6, 4724, 4693.7,
          4561.5, 4644.5, 4568.5, 4710.9, 4728.7, 4706.7, 4561.9, 4511.2, 4542.5, 4502.3,
          4499.3, 4506.3, 4466.9, 4365.3, 4286.4, 4114, 4351.6, 4381.4, 4202.7, 4008.8,
          4096.3, 4038.5, 4125.7, 4157.4, 4140.8, 4005.7, 4051.8, 4018.8, 4076.4, 4050.2,
          4077, 4036.3, 4107, 4152.6, 4299.6, 4419.7, 4467.5, 4437.3, 4420.6, 4571.4,
          4697.8, 4653.3, 4529.9, 4396.4, 4539.9, 4439, 4407.3, 4351.9, 4387.5, 4424.9,
          4376.4, 4298, 4168.4, 4186.7, 4162.3, 4187.1, 4157, 4190.6, 4107.9, 4181.1,
          4142.6, 4060.4, 4038.4, 4051.6, 3898.9, 3940.4, 4113.5, 4114.5, 4000.5, 3887.6,
        ],
        achse: [
          { bei: 0, text: 'Jan.' },
          { bei: 31, text: 'April' },
          { bei: 62, text: 'Juli' },
          { bei: 94, text: 'Okt.' },
          { bei: 109, text: '13.11.' },
        ],
        name: 'Gold',
        logo: 'goldbarren.png',
        foto: true,
        satz: 'Gold erreichte am 29. Januar 5.318,4 $ je Unze. Seitdem ging es um 26,9 % auf 3.887,6 $ zurück – am wenigsten von den dreien.',
      },
    ],
    fusszeile:
      'Stand: 13.11.2026 | Quelle: Yahoo Finance (Terminkontrakte, $ je Feinunze); eigene Rechnung',
    text:
      'Drei Kurven, drei Metalle – erkennst du sie? Erst tippen, dann wischen.\n\n' +
      'Alle drei hatten ihr Jahreshoch im Januar 2026. Seitdem ging es abwärts:\n' +
      'Silber: 115,08 $ → 48,65 $ (−57,7 %)\n' +
      'Platin: 2.852,4 $ → 1.492,2 $ (−47,7 %)\n' +
      'Gold: 5.318,4 $ → 3.887,6 $ (−26,9 %)\n' +
      'Je Feinunze, Hoch am 26.01. (Silber, Platin) bzw. 29.01. (Gold), Schluss am 13.11.\n\n' +
      'Seit Jahresbeginn liegen Silber und Platin rund 30 % im Minus, Gold rund 10 %.\n\n' +
      'Warum fielen sie so stark?\n' +
      'Die Kurse zeigen nur, dass es so war, nicht warum. Einen Grund nennen wir nicht, ohne ihn in einer Quelle gelesen zu haben.\n\n' +
      'Und jetzt?\n' +
      'Ein Absturz vom Hoch sagt nichts darüber, wie es weitergeht.\n\n' +
      'Wie viele hattest du richtig? Schreib es in die Kommentare.\n\n' +
      'Quellen: Yahoo Finance (Terminkontrakte), Stand 13.11.2026; eigene Rechnung\n' +
      'Fotos (Wikimedia Commons): Chi Ho Chan, CC BY 2.0, freigestellt (Silber); Alchemist-hp, Free Art License (Platin); Szaaman, gemeinfrei (Gold)',
    schlagworte: ['börsenrätsel', 'silber', 'gold', 'platin', 'rohstoffe'],
  },
  {
    /*
      Zahlenkarte 13.11.2026, „Rheinmetall je Jahr“. Der Betreiber hat für
      heute kein Thema gewählt. Nach dem Ablauf gilt der erste offene
      Vorschlag vom 12.11.: die Rheinmetall-Achterbahn. Er ist nicht in den
      News vom 13.11. Die Kurve war schon am 12.11. dran (DAX), daher heute
      Säulen: Kursentwicklung je Kalenderjahr.
      Den Säulen-Entwurf fand der Betreiber „vibe-gecodet, billig,
      KI-haft“ – deshalb doch die ruhige Kurslinie wie am 12.11. (die er
      abgenommen hatte), gegen die Regel „Form nicht wie am Vortag“.
      Linie: jeder fünfte Handelstag, dazu Jahresschlüsse, Hoch und 13.11.
      Am 14.11. um 02:30: „mit Unternehmenslogo … dann lad den Scheiß einfach
      hoch“ – Logo statt erster Titelzeile, Linie in der Hausfarbe (#0080C5,
      aus dem Logo), und die Karte auf den 14.11. gesetzt und freigegeben:
      Der Ablauf schickt nur die Karte des Tages, der 13.11. war vorbei.
      Hinausgegangen am 14.11. um 05:26 von Hand (folgt_auf 2026-11-13) –
      nach den Daily News vom 13., vor denen vom 14. Danach wieder auf den
      13.11. gesetzt, damit der 14.11. frei ist für seine eigene Karte.
      Logo: Wikimedia Commons, File:Rheinmetall Logo 2021.svg, gemeinfrei
      (Rheinmetall AG), geholt über bilder-holen.yml.
      Die Karte entstand erst abends; das Wochenlimit hatte die Arbeit am
      Mittag gestoppt.

      Kurse: Yahoo Finance, RHM.DE (Xetra), Tagesschlusskurse 01.12.2021
      bis 13.11.2026, abgerufen am 13.11.2026 um 20:45 UTC über
      quellen-holen.yml. Schluss je Jahr (letzter Handelstag):
        30.12.2021  83,06 €
        30.12.2022 186,05 € → 2022 +124,0 %
        29.12.2023 287,00 € → 2023  +54,3 %
        30.12.2024 614,60 € → 2024 +114,1 %
        30.12.2025 1.561,00 € → 2025 +154,0 %
        13.11.2026 765,50 € → 2026 −51,0 % (bis 13.11.)
      Höchster Schlusskurs 1.988,50 € am 29.09.2025; 765,50 € sind −61,5 %
      davon. 12.11.2021 laut Kursbestand 88,02 €: 765,50 € sind das 8,7-Fache.
      Wochenkerzen taugen nicht für Jahresschlüsse: Yahoo beginnt die Woche
      am Sonntag, die letzte Dezemberwoche reicht dann in den Januar.

      Warum: WirtschaftsWoche, „Rheinmetall-Aktie: Warum der Rüstungsboom an
      der Börse kippt“ (06.11.2026) – lesbar nur Anreißer und Bildunterschrift
      (Bezahlschranke): Prognosesenkung, ein großer Auftrag für den Radpanzer
      Boxer verzögert sich, „an der Börse zählen längst nicht mehr nur volle
      Auftragsbücher“. Mehr steht dort für uns nicht; einen Grund für den
      ganzen Rückgang seit September 2025 nennt die Karte deshalb nicht.
    */
    art: 'chart',
    datum: '2026-11-13',
    titel: [{ text: 'Rheinmetall:' }, { text: 'Vom Höhenflug zurück.', gruen: true }],
    unterzeile: 'Schlusskurs der Aktie an der Xetra seit Ende 2021, in Euro.',
    punkte: [
      83.06, 87.28, 92, 93.44, 93.04, 90.52, 96.94, 96.44, 107.05, 148.7, 155.15, 169.5,
      202, 192.85, 194.25, 215, 215.2, 222.4, 181.9, 190.65, 192.4, 188.3, 212.1, 206.7,
      224, 222.2, 188.25, 190.95, 192.6, 178, 193.35, 164.9, 176.25, 164.9, 160.5, 156.4,
      152.45, 150.4, 159.5, 154.3, 147.7, 152.95, 165.25, 165.5, 157.25, 180.1, 199.35,
      193.45, 194.6, 196.8, 180.6, 193.25, 186.05, 199, 208.2, 220.9, 220.9, 219.4, 225.6,
      240.7, 246.7, 246.2, 258, 244.7, 255.9, 272.4, 258.2, 267.2, 270.7, 265.5, 265,
      267.1, 263.2, 247.6, 236.4, 249.1, 260.1, 245.2, 251.9, 249.3, 253.4, 255.1, 257.4,
      270.1, 264.8, 249, 248.8, 247.6, 251.8, 265, 248.8, 239.5, 250.5, 269.6, 258.9,
      270.1, 272.4, 282.5, 278.8, 274, 283.4, 283.9, 283.3, 286.9, 287, 305.1, 308.2,
      334.2, 327.8, 328.5, 332.1, 377.2, 401.7, 424, 436.5, 443.6, 491.8, 521, 560.6,
      551.8, 509.8, 525, 528.8, 521.6, 527, 523.6, 517, 517.4, 490.8, 495, 481.8, 500.8,
      513.4, 493.8, 498.5, 489.8, 547.6, 534.6, 535.6, 520, 511, 483.2, 486.7, 511, 502.4,
      483, 494.1, 488.7, 480.3, 574, 604.8, 617.8, 634.8, 605.4, 612.8, 617.8, 614.6, 617,
      655, 705.4, 732.2, 758.2, 731.4, 928.8, 952.8, 1122, 1154, 1445.5, 1319.5, 1354,
      1315.5, 1494, 1382.5, 1576, 1694, 1723, 1783.5, 1885, 1788, 1795.5, 1757.5, 1751,
      1755, 1840, 1835.5, 1734, 1707.5, 1620.5, 1621, 1622.5, 1689.5, 1744.5, 1896.5,
      1928, 1960.5, 1988.5, 1962.5, 1882, 1661.5, 1764, 1701.5, 1749, 1727, 1519.5,
      1480.5, 1529.5, 1616, 1559.5, 1561, 1602, 1900, 1902, 1830, 1781.5, 1604.5, 1609,
      1740, 1663.5, 1592.5, 1592.5, 1503, 1379.5, 1531, 1486.6, 1431, 1343.2, 1441.6,
      1121.6, 1233.6, 1232.8, 1200.4, 1197.2, 1170.2, 949, 1050.6, 1058.8, 976.1, 1007.8,
      1153.4, 1200.6, 1168.2, 1178.8, 1138.8, 1090.4, 1012.4, 1013, 1025, 956.4, 926.2,
      983.3, 1020, 1012, 1003.4, 794.1, 765.5,
    ],
    einheit: '€',
    achse: [
      { bei: 26, text: '2022', zusatz: '+124 %', richtung: 'steigt' },
      { bei: 78, text: '2023', zusatz: '+54 %', richtung: 'steigt' },
      { bei: 130, text: '2024', zusatz: '+114 %', richtung: 'steigt' },
      { bei: 182, text: '2025', zusatz: '+154 %', richtung: 'steigt' },
      { bei: 231, text: '2026', zusatz: '−51 %', richtung: 'faellt' },
    ],
    marken: [
      { bei: 0, zahl: '83 €', anlass: 'Ende 2021', lage: 'rechts' },
      { bei: 195, zahl: '1.988,50 €', anlass: 'Hoch, 29.09.2025' },
    ],
    ende: { zahl: '765,50 €', anlass: '−61,5 % vom Hoch' },
    richtung: 'faellt',
    logo: 'rheinmetall.png',
    farbe: '#0080C5',
    fusszeile:
      'Stand: 13.11.2026 | Quelle: Yahoo Finance (Schlusskurse RHM.DE, Xetra); eigene Rechnung',
    text:
      'Vier Jahre ging es fast nur nach oben, jetzt geht es steil bergab: Die Rheinmetall-Aktie hat 2026 bisher 51 % verloren.\n\n' +
      'Am Freitag, dem 13. November, schloss sie bei 765,50 €. Ihr Hoch lag am 29. September 2025 bei 1.988,50 € – seitdem sind es −61,5 %.\n\n' +
      'Jahr für Jahr (Schlusskurse an der Xetra, die Punkte im Bild):\n' +
      '2022: +124 %\n' +
      '2023: +54 %\n' +
      '2024: +114 %\n' +
      '2025: +154 %\n' +
      '2026: −51 % (bis 13. November)\n\n' +
      'Zum Vergleich: Im November 2021 kostete die Aktie 88,02 €. Auch nach dem Absturz ist sie heute noch das 8,7-Fache wert.\n\n' +
      'Warum?\n' +
      'Laut WirtschaftsWoche hat Rheinmetall Anfang November seine Prognose gesenkt, und ein großer Auftrag für den Radpanzer Boxer verzögert sich. An der Börse zählten längst nicht mehr nur volle Auftragsbücher, schreibt das Blatt. Einen Grund für den ganzen Rückgang seit September 2025 nennt die Quelle nicht.\n\n' +
      'Und jetzt?\n' +
      'Wie es weitergeht, sagen diese Zahlen nicht. Sie zeigen nur, wie schnell sich ein Börsenliebling drehen kann.\n\n' +
      'Gerechnet: Schlusskurs am letzten Handelstag des Jahres gegen den des Vorjahres.\n' +
      'Quellen: Yahoo Finance (RHM.DE), Stand 13.11.2026; WirtschaftsWoche, 6.11.2026; eigene Rechnung\n' +
      'Logo: Rheinmetall AG, gemeinfrei, über Wikimedia Commons',
    schlagworte: ['rheinmetall', 'rüstung', 'aktien', 'börse', 'dax'],
    freigabe: '2026-11-13',
  },
  {
    /*
      Zahlenkarte 12.11.2026, „DAX-Rekordtage 2026“. Der Betreiber hat für
      heute kein Thema gewählt; nach dem Ablauf gilt der erste offene Vorschlag
      vom 11.11. Der erste Entwurf (Säulen je Jahr 2015–2026) kam zurück:
      „darstellung doof ki like bitte andere darstellung mit chart und den
      punkten von neuen hochs dieses jahr“. Jetzt: der DAX 2026 als Kurve,
      jeder Rekordschluss ein Punkt. In den News vom 12.11. steht der
      DAX-Rekord nicht. Form: Kurve (am 11.11. Entweder-oder).

      Kurse: Yahoo Finance, ^GDAXI, Tagesschlusskurse.
        - bis 10.11.2026: Abruf am 10.11.2026 über quellen-holen.yml (ab 1987)
        - 01.08. bis 12.11.2026: Abruf am 12.11.2026, 12:25 UTC, gleiche Werte
          an den überlappenden Tagen bis 09.11.
      Die Kurve hat 221 Handelstage, 02.01. bis 11.11.2026.
      Rekordschluss heißt: Schluss über allen früheren Schlusskursen seit
      1987. Der Rekord aus 2025 lag bei 24.611,25. 2026 sind es 18 Tage:
        Januar 7 (05.–09.01., 12.–13.01.) · Juli 3 (02., 03., 06.07.)
        August 7 (03., 04., 07., 10., 11., 14., 28.08.) · November 1 (11.11.)
      Jahresanfang 24.539,34 (02.01.), Tief 22.300,75 (27.03.), Schluss
      11.11. 26.662,77, +8,7 % seit dem 02.01.
      Zum Vergleich, gleich gezählt: 2024 45 Tage, 2025 34.
      Der 12.11. ist nicht gezählt, der Handelstag lief beim Abruf noch.
      Warum / Und jetzt: wallstreet-online, News-Ticker 11.11.2026, 09:40
      Uhr („Rekord zum Greifen nah: Diese Zahlen treiben den DAX an“), über
      quellen-holen.yml gelesen. Der Ticker nennt als Rekordhoch 26.692
      Punkte aus der Vorwoche – ein Tageshoch, kein Schlusskurs.
    */
    art: 'kurven',
    datum: '2026-11-12',
    titel: [{ text: 'DAX auf Rekord:' }, { text: 'Das 18. Mal 2026.', gruen: true }],
    erklaerung:
      'Schlusskurse 2026. Jeder Punkt ist ein Tag, an dem der DAX so hoch schloss wie nie zuvor.',
    stichzeile: 'DAX · Schlusskurse 2026',
    linien: [
      {
        name: 'DAX am 11.11.',
        ende: '26.663',
        punkte: [
          24539.34, 24868.69, 24892.2, 25122.26, 25127.46, 25261.64, 25405.34, 25420.66,
          25286.24, 25352.39, 25297.13, 24959.06, 24703.12, 24560.98, 24856.47, 24900.71,
          24933.08, 24894.44, 24822.79, 24309.46, 24538.81, 24797.52, 24780.79, 24603.04,
          24491.06, 24721.46, 25014.87, 24987.85, 24856.15, 24852.69, 24914.88, 24800.91,
          24998.4, 25278.21, 25043.57, 25260.69, 24991.97, 24986.25, 25175.94, 25289.02,
          25284.26, 24638, 23790.65, 24205.36, 23815.75, 23591.03, 23409.37, 23968.63,
          23640.03, 23589.65, 23447.29, 23564.01, 23730.92, 23502.25, 22839.56, 22380.19,
          22653.86, 22636.91, 22957.08, 22612.97, 22300.75, 22562.88, 22680.04, 23298.89,
          23168.08, 22921.59, 24080.63, 23806.99, 23803.95, 23742.44, 24044.22, 24066.7,
          24154.47, 24702.24, 24417.8, 24270.87, 24194.9, 24155.45, 24128.98, 24083.53,
          24018.26, 23954.56, 24292.38, 23991.27, 24401.7, 24918.69, 24663.61, 24338.63,
          24350.28, 23954.93, 24136.81, 24456.26, 23950.57, 24307.92, 24400.65, 24737.24,
          24606.77, 24888.56, 25389.1, 25184.89, 25177.8, 25092.25, 25104.7, 25003.04,
          25124.17, 24795.94, 24944.95, 24759.05, 24616.22, 24433.06, 24195.31, 24209.71,
          24635.3, 24894.01, 24910.41, 24934.67, 25026.8, 24985.82, 25139.69, 24893.58,
          24740.36, 24994.83, 24671.22, 24626.89, 24995.81, 25040.28, 25580.88, 25779.31,
          25817.89, 25465.25, 24897.45, 25118.27, 25067.09, 25114.25, 25147.03, 24999.53,
          24915.49, 24830.98, 24846.69, 25011.35, 25155.41, 24763.12, 25099, 25361.03,
          25464.01, 25460.48, 25612.03, 25629.24, 26001.31, 26202.35, 26126.3, 26140.13,
          26319.45, 26323.88, 26391.42, 26331.07, 26299.74, 26440.31, 26338.61, 26128.36,
          26091.33, 25983.04, 26136.56, 26106.6, 26266.14, 26285.96, 26367.24, 26569.99,
          26258.11, 25970.11, 25839.33, 26003.32, 26046.4, 26006.53, 26007.63, 25576.45,
          25361.15, 25568.56, 25440.81, 25402.28, 25537.75, 25716.71, 25304.06, 25575.01,
          25578.85, 25410.63, 25266.53, 25408.64, 25374.42, 25399.21, 25199.19, 24939.35,
          25231.2, 25254.21, 25449.19, 25104.36, 24806.97, 25087.27, 25277.68, 25259.9,
          25298.61, 25382.62, 25622.61, 25319.77, 25304.42, 25645.04, 25371.75, 25181.65,
          25410.84, 25590.77, 25704.02, 26039.68, 25818.21, 25981.09, 25864.62, 26437.67,
          26325.01, 25820.36, 26267.19, 26347.45, 26662.77,
        ],
      },
    ],
    marken: [1, 2, 3, 4, 5, 6, 7, 126, 127, 128, 148, 149, 152, 153, 154, 157, 167, 220],
    unten: 22000,
    achse: [
      { bei: 0, text: 'Jan.' },
      { bei: 41, text: 'März' },
      { bei: 83, text: 'Mai' },
      { bei: 125, text: 'Juli' },
      { bei: 169, text: 'Sept.' },
      { bei: 220, text: '11.11.' },
    ],
    einheit: '',
    kennzahlen: [{ name: 'Rekordtage 2026', wert: '18', richtung: 'steigt' }],
    fusszeile:
      'Stand: 11.11.2026 | Quelle: Yahoo Finance (Schlusskurse ^GDAXI seit 1987); eigene Rechnung',
    text:
      'Rekord am Mittwoch: Der DAX schloss am 11. November bei 26.662,77 Punkten – so hoch wie nie zuvor. 📈\n\n' +
      'Es war der 18. Rekordschluss in diesem Jahr. Jeder Punkt im Bild ist einer davon:\n' +
      'Januar: 7 Rekordtage\n' +
      'Juli: 3\n' +
      'August: 7\n' +
      'November: 1 (der 11.11.)\n\n' +
      'Dazwischen lagen lange Pausen. Von Mitte Januar bis Anfang Juli gab es keinen einzigen Rekord – am 27. März stand der DAX bei 22.300,75 Punkten. Nach dem 28. August dauerte es zweieinhalb Monate bis zum nächsten.\n\n' +
      'Seit dem ersten Handelstag des Jahres (24.539,34 Punkte) liegt der DAX 8,7 % im Plus. Zum Vergleich: 2024 schloss er an 45 Tagen auf Rekordhoch, 2025 an 34.\n\n' +
      'Warum ging es am 11. November nach oben?\n' +
      'Laut wallstreet-online kam Rückenwind von einer Erholung der Technologiewerte, guten Zahlen des US-Rechenzentrumsbetreibers CoreWeave und starken Chipmärkten in Asien. Dazu legten Siemens Energy, E.ON, RWE und Brenntag ihre Zahlen vor.\n\n' +
      'Und jetzt?\n' +
      'Als Risiko nennt dieselbe Quelle die überraschend hohe US-Inflation: Eine Zinserhöhung der Fed im Dezember gilt am Markt inzwischen als wahrscheinlich. Ein Rekord sagt nichts über den nächsten Tag.\n\n' +
      'Gerechnet: Schlusskurse ab 1987; ein Rekordtag ist ein Schluss über allen früheren Schlusskursen. Tageshochs zählen nicht mit.\n' +
      'Quellen: Yahoo Finance (^GDAXI), Stand 11.11.2026; wallstreet-online, 11.11.2026; eigene Rechnung',
    schlagworte: ['dax', 'rekord', 'börse', 'aktien', 'deutschland'],
    freigabe: '2026-11-12',
  },
  {
    /*
      Zahlenkarte 11.11.2026, „Was lief besser?“ – Entweder-oder, erste Karte
      der Art `entweder`. Der Betreiber bat zweimal um „Content für heute“
      ohne Wahl; nach dem Ablauf der erste offene Vorschlag (zugleich die
      Empfehlung) vom selben Morgen.
      Kurse: data/snapshots/markets.json (Yahoo Finance, abgerufen
      11.11.2026 01:30 UTC), Schlusskurse, im Zwei-Wochen-Raster ab
      11.11.2021 – der letzte Kurs vor jedem Stichtag –, Ende für alle der
      06.11.2026 (letzter gemeinsamer Handelstag).
        Gold 1.863,90 $ → 4.074,90 $ je Unze (+118,6 %)
        Bitcoin 64.950 $ → 75.747 $ (+16,6 %)
        Tesla 354,50 $ → 358,22 $ (+1,0 %)
        DAX 16.083,11 → 25.820,36 Punkte (+60,5 %)
        Apple 147,87 $ → 342,37 $ (+131,5 %)
        Microsoft 332,43 $ → 530,61 $ (+59,6 %)
      1.000 $ in Gold: 2.186 $; in Bitcoin: 1.166 $.
    */
    art: 'entweder',
    datum: '2026-11-11',
    titel: [{ text: 'Was lief' }, { text: 'besser?' }],
    fragen: [
      {
        a: {
          name: 'Gold',
          punkte: [
            1863.9, 1806.3, 1779.5, 1794.6, 1800.1, 1812.4, 1795, 1869.4, 1900.7, 1960.8,
            1939.8, 1948.2, 1896, 1858.6, 1847.8, 1843.7, 1838.8, 1763.9, 1710.2, 1787.7,
            1798.1, 1749.7, 1740.6, 1633.4, 1675.2, 1654.1, 1680.5, 1739.6, 1781.3,
            1797.7, 1846.1, 1909.9, 1922.9, 1863.5, 1824.9, 1916.5, 1953.8, 2003.8,
            1999.8, 2033.2, 1977.2, 1974.3, 1947.7, 1929.5, 1956.4, 1970.5, 1944, 1946.8,
            1947.2, 1936.6, 1864.3, 1987.8, 1988.6, 1980.3, 2042.2, 2040.5, 2073.4,
            2030.2, 2025.4, 2033, 2038.9, 2188.6, 2176.4, 2351, 2346.4, 2331.2, 2438.5,
            2369.3, 2329, 2338.9, 2428.9, 2377.8, 2504, 2555.2, 2532.7, 2652.5, 2666,
            2738.9, 2746.2, 2614.6, 2658.5, 2670, 2618.1, 2678.6, 2738.4, 2934.4, 2963.2,
            2899.4, 3015.6, 2973.6, 3425.3, 3322.3, 3233.5, 3397.2, 3417.3, 3307.7,
            3359.1, 3310, 3404.7, 3417.5, 3677.4, 3775.1, 3972.6, 4145.6, 3991, 4060,
            4243, 4364.5, 4341.1, 4623.7, 5318.4, 4948.4, 5194.2, 5125.8, 4376.3, 4818,
            4724, 4710.9, 4542.5, 4505, 4245.9, 4125.7, 3992.1, 4100.1, 4420.4, 4664,
            4407.3, 4298, 4157, 4060.4, 4113.5, 4074.9,
          ],
        },
        b: {
          name: 'Bitcoin',
          punkte: [
            64950, 56289, 50583, 46880, 46458, 42251, 38483, 42587, 43193, 39667, 47128,
            39522, 40458, 30297, 29099, 31371, 20600, 20231, 22486, 23314, 24137, 20298,
            22370, 19223, 19141, 19346, 20603, 15787, 16975, 16440, 16688, 21170, 22840,
            21808, 23523, 24198, 27140, 29653, 27525, 27694, 26851, 25760, 26851, 31156,
            30146, 29230, 29408, 26106, 25163, 26298, 27584, 33086, 35037, 37477, 41980,
            42624, 44167, 42512, 43288, 49958, 54522, 72124, 69959, 71631, 66838, 63162,
            71448, 68805, 66490, 62852, 64870, 66820, 59355, 62881, 57020, 63330, 62237,
            67368, 67812, 90543, 95865, 106030, 92643, 94517, 102088, 97438, 91418, 78532,
            87499, 79235, 87519, 94748, 105606, 105882, 106797, 107135, 119850, 117924,
            118731, 110124, 112071, 112749, 121706, 110070, 101301, 86632, 92142, 85463,
            88732, 95551, 84562, 66222, 67454, 70493, 68792, 71768, 78269, 80010, 77539,
            63802, 62896, 61485, 63789, 64725, 63402, 80258, 76568, 84379, 81676, 81312,
            75942, 75747,
          ],
        },
        unterzeile: 'Kursentwicklung seit November 2021',
        achse: [
          { bei: 0, text: 'Nov. 2021' },
          { bei: 30, text: '2023' },
          { bei: 82, text: '2025' },
          { bei: 131, text: 'Nov. 2026' },
        ],
        satz: 'Aus 1.000 $ wurden mit Gold rund 2.190 $, mit Bitcoin rund 1.170 $.',
      },
      {
        frage: 'Und hier?',
        a: {
          name: 'Tesla',
          punkte: [
            354.5, 385.62, 336.34, 299.98, 399.93, 343.5, 312.24, 291.92, 290.14, 255.46,
            363.95, 325.31, 332.67, 262.37, 224.97, 238.28, 237.04, 233.07, 240.55,
            297.28, 309.32, 284.82, 304.42, 276.01, 222.96, 211.25, 197.08, 167.87,
            182.45, 149.87, 108.1, 131.49, 166.66, 194.64, 207.63, 174.48, 191.81, 184.51,
            162.55, 171.79, 188.87, 217.61, 274.45, 279.82, 290.38, 267.43, 239.76,
            238.82, 273.58, 246.99, 259.67, 212.08, 219.27, 235.6, 235.58, 252.08, 248.42,
            219.91, 190.93, 188.13, 199.4, 177.77, 172.63, 172.98, 142.05, 184.76, 174.95,
            176.29, 187.44, 209.86, 252.64, 232.1, 197.49, 213.21, 216.27, 250, 240.83,
            218.85, 242.84, 338.74, 357.09, 463.02, 417.41, 403.31, 397.15, 350.73,
            330.53, 222.15, 278.39, 233.29, 227.5, 280.26, 342.09, 342.69, 329.13, 317.66,
            316.9, 325.59, 339.03, 346.6, 346.4, 434.21, 435.54, 448.98, 445.91, 395.23,
            454.53, 483.37, 449.72, 438.57, 416.56, 417.07, 408.58, 395.01, 372.11,
            345.62, 373.72, 411.79, 417.85, 418.45, 400.49, 393.45, 391.06, 308.85,
            339.96, 354.81, 363.56, 377.94, 375, 374.58, 343.69, 358.22,
          ],
        },
        b: {
          name: 'DAX',
          punkte: [
            16083.11, 16115.69, 15380.79, 15239.67, 16020.73, 15933.72, 15471.2, 15113.97,
            14461.02, 13929.11, 14417.37, 14192.78, 13924.17, 13380.67, 14175.4, 14653.81,
            13265.6, 12773.38, 12959.81, 13479.63, 13816.61, 12892.99, 13402.27, 12227.92,
            12272.94, 12931.45, 13533.52, 14379.93, 14447.61, 13942.87, 14069.26,
            15134.04, 15126.08, 15397.34, 15381.43, 14959.47, 15127.68, 15655.17,
            15863.95, 15952.83, 16223.99, 15963.89, 16201.2, 16081.04, 16068.65, 16446.83,
            15904.25, 15792.61, 15800.99, 15405.49, 15128.11, 14800.72, 15135.97,
            15901.33, 16404.76, 16650.55, 16769.36, 16622.22, 16941.71, 17037.35,
            17423.23, 17746.27, 18261.31, 18318.97, 17860.8, 18175.21, 18768.96, 18608.16,
            18068.21, 18290.66, 18590.89, 18320.67, 17726.47, 18617.02, 18443.56,
            18846.79, 19104.1, 19461.19, 19147.85, 19189.19, 19933.62, 20313.81, 19909.14,
            20132.85, 21282.18, 21911.74, 22425.93, 22620.95, 22852.66, 19789.62,
            21293.53, 23344.54, 23934.98, 23930.67, 23699.12, 23909.61, 24160.64,
            23970.36, 24081.34, 24273.12, 23807.13, 23527.05, 24611.25, 24207.79,
            23734.02, 23278.85, 23882.03, 24199.5, 24490.41, 25352.39, 24309.46, 24852.69,
            25289.02, 23589.65, 22612.97, 23806.99, 24155.45, 24663.61, 24606.77,
            24944.95, 25026.8, 25580.88, 24915.49, 25612.03, 26299.74, 26367.24, 25361.15,
            25266.53, 24806.97, 25371.75, 26325.01, 25820.36,
          ],
        },
        unterzeile: 'Kursentwicklung seit November 2021',
        achse: [
          { bei: 0, text: 'Nov. 2021' },
          { bei: 30, text: '2023' },
          { bei: 82, text: '2025' },
          { bei: 131, text: 'Nov. 2026' },
        ],
        satz: 'Tesla trat auf der Stelle: 354,50 $ damals, 358,22 $ jetzt. Der DAX stieg von 16.083 auf 25.820 Punkte.',
      },
      {
        frage: 'Und zum Schluss?',
        a: {
          name: 'Apple',
          punkte: [
            147.87, 161.02, 165.32, 169.75, 182.01, 169.8, 174.78, 168.88, 165.12, 150.62,
            175.6, 165.75, 162.88, 152.06, 143.11, 146.14, 135.87, 141.56, 147.07, 161.51,
            173.19, 161.38, 163.43, 150.77, 140.42, 149.45, 138.92, 148.01, 146.63,
            132.37, 125.07, 135.94, 143, 153.85, 147.92, 150.47, 158.28, 162.03, 165.33,
            173.5, 174.2, 179.58, 185.01, 192.46, 193.99, 196.45, 179.46, 180.19, 179.36,
            176.08, 178.99, 173, 179.23, 191.45, 189.43, 195.89, 185.64, 183.63, 191.73,
            187.15, 181.16, 172.75, 170.85, 168.45, 165.84, 181.71, 191.04, 194.03,
            216.67, 216.75, 234.4, 218.24, 217.53, 227.18, 220.91, 226.47, 221.69, 236.48,
            222.01, 228.02, 239.59, 251.04, 252.2, 234.4, 229.86, 227.65, 247.1, 227.48,
            220.73, 181.46, 193.16, 198.89, 208.78, 201.7, 198.42, 205.17, 208.62, 214.05,
            227.18, 227.16, 237.88, 256.08, 254.04, 259.58, 269.77, 266.25, 280.7, 272.19,
            271.86, 258.21, 258.28, 261.73, 272.95, 255.76, 252.89, 260.49, 273.43,
            287.44, 304.99, 311.23, 298.01, 308.63, 333.26, 333.43, 305.26, 314.58,
            326.57, 335.92, 340.42, 348.22, 344.17, 342.37,
          ],
        },
        b: {
          name: 'Microsoft',
          punkte: [
            332.43, 339.83, 326.19, 319.91, 334.75, 302.65, 310.98, 295, 298.79, 276.44,
            310.7, 285.26, 280.72, 264.58, 260.65, 268.75, 253.74, 262.85, 254.25, 278.01,
            293.47, 265.23, 266.65, 237.45, 229.25, 247.25, 227.87, 242.05, 250.2, 240.45,
            239.58, 240.35, 242.71, 271.32, 250.16, 253.92, 276.38, 289.39, 281.77,
            308.65, 321.18, 335.94, 338.05, 337.99, 345.73, 335.92, 324.04, 323.7, 337.94,
            317.54, 329.82, 329.32, 356.53, 377.44, 369.14, 372.65, 370.87, 390.27,
            409.72, 415.26, 407.54, 404.52, 422.86, 424.59, 400.96, 413.54, 425.34,
            413.52, 448.37, 456.73, 453.96, 426.73, 406.81, 413.49, 405.72, 433.51,
            409.54, 418.78, 408.46, 415.76, 430.98, 451.59, 424.83, 417.19, 434.56,
            412.22, 404, 380.16, 393.08, 357.86, 359.12, 436.17, 458.87, 461.97, 479.14,
            497.41, 503.02, 512.5, 521.77, 504.26, 498.2, 514.45, 522.4, 520.56, 497.1,
            478.43, 480.84, 483.98, 483.62, 456.66, 433.5, 401.84, 401.72, 401.86, 365.97,
            373.07, 415.75, 420.77, 419.09, 428.05, 379.4, 390.49, 401.1, 451.1, 496.88,
            505.06, 492.44, 497.93, 522.61, 521.08, 535.93, 530.61,
          ],
        },
        unterzeile: 'Kursentwicklung seit November 2021',
        achse: [
          { bei: 0, text: 'Nov. 2021' },
          { bei: 30, text: '2023' },
          { bei: 82, text: '2025' },
          { bei: 131, text: 'Nov. 2026' },
        ],
        satz: 'Apple stieg von 147,87 $ auf 342,37 $, Microsoft von 332,43 $ auf 530,61 $.',
      },
    ],
    fusszeile:
      'Stand: 06.11.2026 | Quelle: Yahoo Finance, Schlusskurse ohne Dividenden; eigene Rechnung',
    text:
      'Drei Duelle, fünf Jahre: Was lief seit November 2021 besser? Erst tippen, dann wischen.\n\n' +
      'Gold oder Bitcoin? Gold: +119 %, Bitcoin: +17 %.\n' +
      'Aus 1.000 $ wurden mit Gold rund 2.190 $, mit Bitcoin rund 1.170 $.\n\n' +
      'Tesla oder DAX? Tesla: +1 %, DAX: +61 %.\n' +
      'Tesla stand am Ende fast dort, wo es angefangen hatte: 354,50 $ damals, 358,22 $ jetzt.\n\n' +
      'Apple oder Microsoft? Apple: +132 %, Microsoft: +60 %.\n\n' +
      'Warum lief es so?\n' +
      'Die Kurse zeigen das Ergebnis, nicht die Gründe. Einen Grund nennen wir nicht, ohne ihn in einer Quelle gelesen zu haben.\n\n' +
      'Und jetzt?\n' +
      'Fünf Jahre Vergangenheit sagen nichts über die nächsten fünf. Mit einem anderen Startpunkt sähe jedes Duell anders aus.\n\n' +
      'Wie viele hattest du richtig? Schreib es in die Kommentare.\n\n' +
      'Gerechnet: Schlusskurse vom 11.11.2021 und 6.11.2026, in US-Dollar bzw. Punkten, ohne Dividenden; Gold je Feinunze.\n' +
      'Quellen: Yahoo Finance, Stand 6.11.2026; eigene Rechnung',
    schlagworte: ['entwederoder', 'aktien', 'gold', 'bitcoin', 'börse'],
    freigabe: '2026-11-11',
  },
  {
    /*
      Zahlenkarte 10.11.2026, „Mythos oder Fakt?“. Der Betreiber verwarf den
      Entwurf „Gefallene Lieblinge“ („ne“) und wählte aus fünf neuen
      Vorschlägen: „4“. Form wie das Börsenrätsel vom 09.11.
      Daten: ^GDAXI bei Yahoo Finance, Tagesschlusskurse 30.12.1987 bis
      09.11.2026 (9.828 Tage) und Monatsschlusskurse Dezember 1987 bis
      Oktober 2026, geholt am 10.11.2026 über quellen-holen.yml
      (chart?interval=1d bzw. 1mo&period1=567849600&period2=1794300000).
      Gerechnet: Veränderung Schluss zu Schluss, Mittelwert.
        Wochentag (Tage): Mo 0,0699 % (1.932), Di 0,0675 % (1.990),
          Mi 0,0377 % (1.984), Do 0,0146 % (1.969), Fr 0,0230 % (1.952);
          Montage im Plus 53,6 %.
        Freitag, der 13.: 64 Tage, Ø 0,1663 %, 41 im Plus; alle 9.827
          Veränderungen Ø 0,0425 % (Faktor 3,9).
        Monate 1988–2026 (Nov./Dez. bis 2025): Jan 0,85, Feb 1,06, Mär 0,40,
          Apr 2,65, Mai 1,03, Jun −0,04, Jul 1,60, Aug −1,84, Sep −2,08
          (15 von 39 im Plus), Okt 2,00, Nov 2,61, Dez 2,21 (%).
      Nicht genommen: „Im Dezember steigt der DAX immer“ (28 von 38, 2002
      −12,9 %) und „Kauf nie am Rekordhoch“ – drei Mythen, sechs Kacheln.
    */
    art: 'mythos',
    datum: '2026-11-10',
    titel: [{ text: 'Mythos' }, { text: 'oder Fakt?' }],
    fragen: [
      {
        behauptung: 'Montags fällt der Markt.',
        fakt: false,
        stichzeile: 'DAX · Ø Veränderung je Wochentag · seit 1988',
        saeulen: [
          { name: 'Mo', wert: 0.07, hervor: true },
          { name: 'Di', wert: 0.068 },
          { name: 'Mi', wert: 0.038 },
          { name: 'Do', wert: 0.015 },
          { name: 'Fr', wert: 0.023 },
        ],
        einheit: '%',
        stellen: 3,
        satz: 'Der Montag war im Schnitt sogar der beste Handelstag. 54 % aller Montage endeten im Plus.',
      },
      {
        frage: 'Und das?',
        behauptung: 'Freitag, der 13., bringt Pech.',
        fakt: false,
        stichzeile: 'DAX · Ø Veränderung am Tag · seit 1988',
        saeulen: [
          { name: 'Freitag, der 13.', wert: 0.166, hervor: true },
          { name: 'alle Handelstage', wert: 0.043 },
        ],
        einheit: '%',
        stellen: 3,
        satz: 'An 64 solchen Tagen stieg der DAX 41-mal – im Schnitt fast viermal so stark wie sonst.',
      },
      {
        frage: 'Und das hier?',
        behauptung: 'Der September ist der schlechteste Monat.',
        fakt: true,
        stichzeile: 'DAX · Ø Veränderung je Monat · seit 1988',
        saeulen: [
          { name: 'Jan', wert: 0.85 },
          { name: 'Feb', wert: 1.06 },
          { name: 'Mär', wert: 0.4 },
          { name: 'Apr', wert: 2.65 },
          { name: 'Mai', wert: 1.03 },
          { name: 'Jun', wert: -0.04 },
          { name: 'Jul', wert: 1.6 },
          { name: 'Aug', wert: -1.84 },
          { name: 'Sep', wert: -2.08, hervor: true },
          { name: 'Okt', wert: 2.0 },
          { name: 'Nov', wert: 2.61 },
          { name: 'Dez', wert: 2.21 },
        ],
        einheit: '%',
        stellen: 1,
        satz: 'Im Schnitt −2,1 %, kein Monat war schwächer. Nur 15 von 39 Septembern endeten im Plus.',
      },
    ],
    fusszeile:
      'Stand: 09.11.2026 | Quelle: Yahoo Finance (^GDAXI), Schlusskurse seit 1987; eigene Rechnung',
    text:
      'Drei Börsenweisheiten – was ist dran? Wir haben sie am DAX nachgerechnet, mit jedem Handelstag seit Ende 1987.\n\n' +
      '„Montags fällt der Markt.“ – Mythos.\n' +
      'Im Schnitt war der Montag sogar der beste Wochentag:\n' +
      'Montag +0,070 %\nDienstag +0,068 %\nMittwoch +0,038 %\nDonnerstag +0,015 %\nFreitag +0,023 %\n\n' +
      '„Freitag, der 13., bringt Pech.“ – Mythos.\n' +
      'An 64 solchen Tagen stieg der DAX 41-mal, im Schnitt um 0,166 %. Ein normaler Handelstag brachte 0,043 %.\n\n' +
      '„Der September ist der schlechteste Monat.“ – Fakt.\n' +
      'Im Schnitt −2,1 %, nur 15 von 39 Septembern endeten im Plus. Am besten liefen April (+2,7 %) und November (+2,6 %).\n\n' +
      'Warum ist der September so schwach?\n' +
      'Die Kursreihe zeigt nur, dass es so war, nicht warum. Einen Grund nennen wir nicht, ohne ihn in einer Quelle gelesen zu haben.\n\n' +
      'Und jetzt?\n' +
      'Ein Durchschnitt über 39 Jahre sagt nichts über den nächsten September. Einzelne Jahre weichen stark ab.\n\n' +
      'Hättest du alle drei richtig getippt? Schreib es in die Kommentare.\n\n' +
      'Gerechnet: Veränderung von Schlusskurs zu Schlusskurs, Mittelwert; Tage 30.12.1987 bis 9.11.2026, Monate bis Oktober 2026.\n' +
      'Quellen: Yahoo Finance (^GDAXI), Stand 9.11.2026; eigene Rechnung',
    schlagworte: ['dax', 'börse', 'aktien', 'mythos', 'statistik'],
    freigabe: '2026-11-10',
  },
  {
    /*
      Zahlenkarte 09.11.2026, „Welche Aktie ist das?“ – Börsenrätsel, die
      erste Karte der Art `raetsel`. Der Betreiber zu den Vorschlägen
      (Mauerfall-Depot, DAX 1989/heute, Gewinn pro Sekunde, Wem gehört der
      DAX, teuerste Aktie): „Das hatten wir alles um den Dreh schon mal so“;
      aus vier neuen gewählt: „Thema eins klingt cool“.
      Kurse: data/snapshots/markets.json (Yahoo Finance, Stand 05.11.2026),
      Schlusskurse in Landeswährung (Commerzbank €, Nike $, Rolls-Royce
      Pence), ohne Dividenden; im Zwei-Wochen-Raster ab 08.11.2021 – der
      letzte Kurs vor jedem Stichtag –, dazu der vom 05.11.2026.
        Commerzbank 6,81 € → 38,73 € (+469 %)
        Nike 171,85 $ → 39,56 $ (−77 %)
        Rolls-Royce 141,76 p → 1.239,6 p (+774 %), Tief 68,89 p am 10.10.2022
          → vom Tief das 18-Fache (1.239,6 / 68,89 = 18,0)
        Nvidia zum Vergleich 30,80 $ → 181,60 $ (+490 %)
      Logos: Wikimedia Commons, gemeinfrei (bilder-holen.yml):
      File:Commerzbank-Logo.svg, File:Logo NIKE.svg,
      File:Rolls royce holdings logo.svg.
    */
    art: 'raetsel',
    datum: '2026-11-09',
    titel: [{ text: 'Welche Aktie' }, { text: 'ist das?' }],
    fragen: [
      {
        tipp: 'Eine Bank aus Frankfurt, im Dax.',
        punkte: [
          6.81, 6.65, 6.51, 6.38, 6.99, 7.43, 7.59, 8.57, 7.53, 6.64, 7.26, 7.01, 6.34,
          6.05, 7.71, 8.48, 8.21, 6.18, 6.18, 6.72, 7.13, 6.38, 7.79, 7.75, 7.39, 8.2,
          8.33, 8.12, 7.82, 8.22, 8.9, 9.48, 10.21, 10.13, 11.15, 9.96, 9.21, 9.67, 10.64,
          9.91, 10.02, 9.5, 10.23, 10.22, 11.14, 10.88, 10.15, 10.19, 9.48, 9.63, 10.23,
          10.22, 10.39, 11.27, 11.38, 10.48, 10.78, 11.44, 10.57, 10.58, 10.74, 11.22,
          12.59, 13.44, 13.51, 13.85, 15.6, 15.39, 13.9, 14.6, 14.42, 14.88, 12.42, 13.06,
          12.9, 14.78, 16.79, 16.31, 16.42, 16.3, 14.59, 15.42, 15.73, 16.72, 18.1, 18.74,
          20.09, 23.26, 23.29, 20.58, 21.95, 24.28, 25.61, 26.58, 28.65, 26.78, 28.91,
          29.87, 35.81, 36.18, 33.6, 31.69, 31.7, 30.3, 32.09, 32.69, 34.23, 35.18, 35.56,
          35.4, 34.87, 35.45, 34.41, 30.36, 31.58, 31.48, 36.48, 34.02, 35.94, 36.98,
          36.21, 37.06, 38.85, 37.45, 39.1, 39.55, 42.75, 41.85, 39.4, 37.09, 37.99,
          38.73,
        ],
        achse: [
          { bei: 0, text: 'Nov. 2021' },
          { bei: 30, text: '2023' },
          { bei: 83, text: '2025' },
          { bei: 131, text: 'Nov. 2026' },
        ],
        name: 'Commerzbank',
        logo: 'commerzbank.png',
        satz: 'Die Commerzbank stieg in fünf Jahren von 6,81 € auf 38,73 €. Fast so stark wie Nvidia im selben Zeitraum (+490 %).',
      },
      {
        frage: 'Und diese?',
        tipp: 'Eine Weltmarke, die fast jeder im Schuhschrank hat.',
        punkte: [
          171.85, 174.24, 168.91, 156.98, 164.67, 150.44, 148.07, 141.59, 136.55, 117.57,
          134.81, 124.98, 127.94, 111.21, 108.63, 120.23, 110.44, 110.5, 103.94, 114.3,
          116.32, 107.88, 112.38, 96.06, 86.69, 88.01, 93.44, 103.83, 109.62, 103.05,
          117.56, 124.85, 126.37, 125.15, 118.53, 116.86, 117.81, 121.91, 127.09, 126.88,
          110.18, 105.2, 106.83, 109.11, 108.71, 110.39, 107.64, 99.63, 96.79, 90.6,
          96.88, 102.81, 107.25, 106.32, 115.15, 121.14, 108.02, 103.62, 103.88, 107.18,
          104.54, 101.08, 93.75, 90, 94.19, 93.36, 91.77, 94.4, 95, 76.83, 71.31, 73.55,
          74.64, 84.28, 79.49, 86.2, 80.83, 81.48, 77.19, 74.89, 79.09, 77.2, 74.65,
          72.08, 75.58, 70.94, 80.28, 76.4, 67.39, 55.61, 56.12, 57.35, 62.08, 61.57,
          61.9, 71.04, 72.25, 79.24, 74.02, 79.17, 74.15, 71.28, 71.17, 67.62, 62.65,
          62.9, 65.39, 67.78, 61.21, 65.64, 64.99, 62.41, 63.09, 56.53, 52.71, 44.03,
          46.48, 43.09, 42.57, 45.93, 45.2, 41.48, 43.76, 42.14, 42.11, 40.75, 38.4, 36.1,
          33.96, 37.21, 39.12, 39.56,
        ],
        achse: [
          { bei: 0, text: 'Nov. 2021' },
          { bei: 30, text: '2023' },
          { bei: 83, text: '2025' },
          { bei: 131, text: 'Nov. 2026' },
        ],
        name: 'Nike',
        logo: 'nike.png',
        satz: 'Nike fiel in fünf Jahren von 171,85 $ auf 39,56 $. Der Kurs hat mehr als drei Viertel verloren.',
      },
      {
        frage: 'Und die letzte?',
        tipp: 'Britischer Konzern, baut Triebwerke für Flugzeuge.',
        punkte: [
          141.76, 135.82, 129.7, 110.48, 121.88, 125.9, 114.5, 117.7, 103.5, 93.78, 98.38,
          95, 86.83, 78.5, 83.14, 92.92, 91.5, 86.54, 92.19, 89.04, 85.75, 80.4, 80.67,
          72.67, 68.89, 73.5, 86.35, 84.81, 90.59, 88.84, 92.64, 107.16, 109.12, 109.46,
          145, 145, 144.34, 149.65, 153.6, 150.5, 157.3, 147.3, 153.8, 153.6, 146.15,
          184.85, 209, 201.9, 223.6, 219.8, 205.2, 203.5, 224.1, 245.5, 285.4, 292.4,
          298.8, 300, 304, 309.1, 361.2, 383.2, 421.1, 429.1, 406.3, 414.8, 436.8, 460.9,
          461.6, 452.8, 449.5, 439.8, 486.7, 500, 475.6, 530.2, 526.6, 567, 549.6, 539.2,
          573, 583.8, 570.4, 567.4, 589.8, 613.4, 606.2, 732.8, 790, 635.8, 709.6, 754.4,
          819.2, 868.8, 885.4, 967.6, 998.4, 981.4, 1082, 1082, 1092.5, 1149, 1154.5,
          1127, 1165, 1094.5, 1037, 1114, 1137, 1287, 1235.5, 1275, 1333, 1238.5, 1183,
          1188.5, 1262.4, 1199.2, 1157.6, 1272.8, 1358.4, 1415.2, 1415.4, 1413.6, 1540,
          1500.2, 1490.8, 1504.8, 1478, 1331.6, 1276.2, 1239.6,
        ],
        achse: [
          { bei: 0, text: 'Nov. 2021' },
          { bei: 30, text: '2023' },
          { bei: 83, text: '2025' },
          { bei: 131, text: 'Nov. 2026' },
        ],
        name: 'Rolls-Royce',
        logo: 'rollsroyce.png',
        satz: 'Rolls-Royce verlor bis Oktober 2022 rund die Hälfte. Vom Tief aus hat sich der Kurs verachtzehnfacht.',
      },
    ],
    fusszeile:
      'Stand: 05.11.2026 | Quelle: Yahoo Finance, ohne Dividenden | Logos: Wikimedia Commons, gemeinfrei',
    text:
      'Drei Aktien, drei Kurven – erkennst du sie? Erst raten, dann wischen.\n\n' +
      'Die Auflösung, Kurs vom 8.11.2021 bis 5.11.2026:\n' +
      'Commerzbank: +469 % – fast so viel wie Nvidia (+490 %)\n' +
      'Nike: −77 %\n' +
      'Rolls-Royce: +774 %, vom Tief im Oktober 2022 aus das 18-Fache\n\n' +
      'Wie viele hattest du richtig? Schreib es in die Kommentare.\n\n' +
      'Schlusskurse in Landeswährung, ohne Dividenden.\n' +
      'Quelle: Yahoo Finance, Stand 5.11.2026\n' +
      'Logos: Wikimedia Commons, gemeinfrei',
    schlagworte: ['börsenrätsel', 'aktien', 'commerzbank', 'nike', 'rollsroyce'],
    freigabe: '2026-11-09',
  },
  {
    /*
      Zahlenkarte 08.11.2026 – erster Zahlenstrahl (Sorte D, INSTAGRAM.md).
      Thema vom Betreiber am 07.11. gewählt („Thema 2 … wegen Anthropic"):
      die größten Börsengänge aller Zeiten.

      Gemessen wird der Erlös, also das beim Börsengang eingesammelte Geld,
      in Mrd. US-Dollar, nominal. Quelle: Wikipedia, „Initial public
      offering", Tabelle „Largest IPOs by amount raised", abgerufen am
      07.11.2026 über quellen-holen.yml:
        SpaceX 2026 85,7 · Saudi Aramco 2019 29,4 · SK Hynix 2026 26,5 ·
        Alibaba 2014 25,0 · SoftBank Corp. 2018 23,5 · Agricultural Bank of
        China 2010 22,1 · ICBC 2006 21,9 · AIA 2010 20,5 · Visa 2008 19,7 ·
        General Motors 2010 18,15 · Facebook 2012 16,01
      Dazu Arm, 14.09.2023, 4,87 Mrd. $ (Wikipedia „Arm Holdings").
      SK Hynix: Zweitnotiz (American depositary receipts) an der Nasdaq am
      10.07.2026 (Wikipedia „SK Hynix"). SpaceX: Ausgabepreis 135 $ am
      11.06.2026, Bewertung 1,77 Bio. $ (Wikipedia „SpaceX").
      Anthropic: privat 965 Mrd. $ (Handelsblatt, 06.11.2026), 1,5 Bio. $
      „a stretch" (CNBC, 06.11.2026); Verlust 1. Hj. 2026 rund 80,7 Mrd. $
      (Tagesschau, 26.10.2026).

      Betreiber zum Entwurf: keine leeren Kacheln, „keine BIPs … sondern
      nur Börsengänge", Abstände dürfen ungleich dem Maßstab sein →
      `gleichmaessig`, „nicht maßstäblich" steht in der Beschreibung –
      auf der Titelkachel nicht (Betreiber: „bitte noch weglassen auf der
      ersten Seite").
      Zuletzt: „weniger Slides, aber es müssen immer 2 auf einer Seite
      sein" – vier Kacheln, General Motors raus.
      Dann: „nimm mal die Unbekannten weg … begrenze dich auf die 7" –
      nur bekannte Namen, Anthropic als geplanter Börsengang am Ende
      (`offen`, ohne Erlös). Raus: ICBC, AIA, Agricultural Bank of China,
      SoftBank Corp., SK Hynix, Arm.
      Danach: „nicht nach Volumen, sondern schon nach Zeit" – geordnet nach
      Jahr; die drei aus 2010 ohne Monatsangabe der Quelle, in Listenfolge.
      Weggelassen: Rivian 2021 – Wikipedia nennt 153 Mio. Aktien zu 78 $
      und „net proceeds" von 13,5 Mrd. $, zwei Zahlen ohne Abgleich.
      Für Porsche, Uber, Telekom nennt Wikipedia keinen Erlös.
      Logos: Wikimedia Commons, gemeinfrei (bilder-holen.yml).
    */
    art: 'zahlenstrahl',
    datum: '2026-11-08',
    titel: [{ text: 'Die größten' }, { text: 'Börsengänge.', gruen: true }],
    erklaerung: 'Nach Jahr · Erlös in Mrd. US-Dollar',
    kacheln: 4,
    bis: 90,
    schritt: 10,
    gleichmaessig: true,
    einheit: 'Mrd. $',
    punkte: [
      { name: 'Visa', wert: 19.7, anzeige: '19,7', zusatz: '2008', logo: 'visa.png' },
      {
        name: 'Facebook',
        wert: 16.01,
        anzeige: '16,0',
        zusatz: '2012',
        logo: 'facebook.png',
      },
      { name: 'Alibaba', wert: 25, anzeige: '25,0', zusatz: '2014', logo: 'alibaba.png' },
      {
        name: 'Saudi Aramco',
        wert: 29.4,
        anzeige: '29,4',
        zusatz: '2019',
        logo: 'aramco.png',
      },
      {
        name: 'SpaceX',
        wert: 85.7,
        anzeige: '85,7',
        zusatz: 'Juni 2026 · Rekord',
        logo: 'spacex.png',
        hervor: true,
      },
      {
        name: 'Anthropic',
        wert: 0,
        anzeige: 'bis 100',
        zusatz: 'erwartet · Termin offen',
        logo: 'anthropic.png',
        offen: true,
      },
    ],
    saetze: [
      { kachel: 2, text: 'Visa 2008 und Facebook 2012: zusammen 35,7 Mrd. $.' },
      {
        kachel: 3,
        text: 'Alibaba 2014, Aramco 2019: zweimal der größte Börsengang der Welt.',
      },
      {
        kachel: 4,
        text: 'Anthropic könnte bis zu 100 Mrd. $ einsammeln – neuer Rekord.',
      },
    ],
    fusszeile:
      'Stand: 07.11.2026 | Quellen: Wikipedia, CNN, Motley Fool | Logos: Wikimedia Commons, gemeinfrei',
    text:
      'Anthropic will an die Börse – und könnte in die Rekordliste. Die größten Börsengänge aller Zeiten, gemessen am eingesammelten Geld – nach Jahr:\n\n' +
      'Visa (2008): 19,7 Mrd. $\n' +
      'Facebook (2012): 16,0 Mrd. $\n' +
      'Alibaba (2014): 25,0 Mrd. $\n' +
      'Saudi Aramco (2019): 29,4 Mrd. $\n' +
      'SpaceX (Juni 2026): 85,7 Mrd. $ – Rekord\n' +
      'Anthropic (geplant): bis zu 100 Mrd. $ erwartet\n\n' +
      'Schon gewusst?\n' +
      '– SpaceX sammelte fast dreimal so viel ein wie Aramco, der Rekordhalter davor.\n' +
      '– Beim Ausgabepreis von 135 $ war SpaceX 1,77 Billionen $ wert – die höchste Bewertung, die ein Börsengang je hatte.\n\n' +
      'Und Anthropic?\n' +
      'Privat wurde Anthropic im Mai mit 965 Mrd. $ bewertet (Handelsblatt). Laut Wall Street Journal (zitiert von CNN) könnte der Börsengang bis zu 100 Mrd. $ einbringen, bei einer Bewertung um 2 Billionen $ – mehr als SpaceX. Laut CNBC halten Investoren schon 1,5 Billionen für gewagt. Bestätigt hat Anthropic weder Betrag noch Termin.\n\n' +
      'Im Bild nach Jahr geordnet, die Abstände sind nicht maßstäblich. Erlös in US-Dollar, nominal.\n' +
      'Quellen: Wikipedia, „Initial public offering" (Largest IPOs by amount raised), „SpaceX", abgerufen 7.11.2026; Handelsblatt und CNBC, 6.11.2026; CNN, 5.10.2026; Motley Fool, 3.10.2026\n' +
      'Logos: Wikimedia Commons, gemeinfrei',
    schlagworte: ['börsengang', 'ipo', 'spacex', 'anthropic', 'aktien'],
    freigabe: '2026-11-08',
  },
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
