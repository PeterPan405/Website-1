/**
 * Die großen Kurseinbrüche als Datensatz.
 *
 * ## Warum als Daten und nicht als Fließtext
 *
 * Im Lernthema stehen diese Ereignisse in einer Tabelle, und die trägt die
 * eigentliche Aussage: Das Ausmaß eines Einbruchs sagt fast nichts über die
 * Dauer der Erholung. 1987 war der Tagesverlust dramatisch und nach zwei
 * Jahren erledigt; 1929 dauerte es eine Generation.
 *
 * Diese Aussage ist ein Vergleich zweier Zahlenreihen – genau das, was ein
 * Diagramm besser kann als eine Tabelle. Stünden die Zahlen zweimal da, würde
 * die Grafik irgendwann etwas anderes behaupten als die Tabelle über ihr.
 *
 * ## Zur Genauigkeit
 *
 * Es sind Größenordnungen, keine Messwerte. Je nachdem, welcher Index
 * betrachtet wird, ob nominal oder real gerechnet und ob Dividenden
 * eingerechnet werden, verschieben sich sowohl der Rückgang als auch die
 * Erholungsdauer erheblich – bei 1929 zwischen gut fünfzehn und über
 * fünfundzwanzig Jahren. Die Werte hier folgen der gängigen Darstellung für
 * breite US-Indizes ohne Dividenden und stehen im Text ausdrücklich als
 * Näherung.
 *
 * Genau deshalb wäre eine Nachkommastelle hier eine Lüge: Sie behauptete eine
 * Genauigkeit, die keine Quelle hergibt.
 */

export interface Kurseinbruch {
  /** Kurzbezeichnung, wie sie in der Tabelle steht. */
  name: string
  /** Jahr des Höhepunkts vor dem Einbruch. */
  jahr: number
  /** Rückgang vom Höchststand bis zum Tiefpunkt, in Prozent. */
  rueckgangProzent: number
  /** Jahre vom Höchststand bis zum Wiedererreichen desselben Stands. */
  erholungJahre: number
  /** Der Auslöser in einem Halbsatz. */
  ausloeser: string
}

/*
  Nachgerechnet am 06.11.2026 aus den Tagesschlusskursen des S&P 500
  (Kursindex, Yahoo ^GSPC), auf ganze Prozent gerundet:
    1987         25.08. 336,77 → 04.12. 223,92   −33,5 %  (vorher stand hier
                 20 – der Eintagesverlust vom 19.10., nicht Hoch bis Tief)
    Dotcom       24.03.2000 1.527,46 → 09.10.2002 776,76   −49,1 %
    Finanzkrise  09.10.2007 1.565,15 → 09.03.2009 676,53   −56,8 %
                 (Höhepunkt 2007, nicht 2008; vorher „50“)
    Pandemie     19.02. → 23.03.2020                        −33,9 %
  Dadurch sind jetzt 1987 und Pandemie die zwei Fälle gleicher Tiefe
  (`erholungsbefund()`), nicht mehr Dotcom und Finanzkrise.
*/
export const kurseinbrueche: Kurseinbruch[] = [
  {
    name: '1929',
    jahr: 1929,
    rueckgangProzent: 85,
    erholungJahre: 25,
    ausloeser: 'Spekulation auf Kredit, dann eine einbrechende Realwirtschaft',
  },
  {
    name: '1987',
    jahr: 1987,
    rueckgangProzent: 34,
    erholungJahre: 2,
    ausloeser: 'kein klarer Anlass; automatisierte Absicherungsprogramme',
  },
  {
    name: 'Dotcom',
    jahr: 2000,
    rueckgangProzent: 49,
    erholungJahre: 7,
    ausloeser: 'Bewertungen von Technologiewerten ohne Gewinne',
  },
  {
    name: 'Finanzkrise',
    jahr: 2007,
    rueckgangProzent: 57,
    erholungJahre: 5,
    ausloeser: 'Immobilienkredite, Verbriefungen, ein Bankensystem am Rand',
  },
  {
    name: 'Pandemie',
    jahr: 2020,
    rueckgangProzent: 34,
    erholungJahre: 0.5,
    ausloeser: 'ein exogener Schock und weltweite Stilllegungen',
  },
]
