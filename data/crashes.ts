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
    rueckgangProzent: 20,
    erholungJahre: 2,
    ausloeser: 'kein klarer Anlass; automatisierte Absicherungsprogramme',
  },
  {
    name: 'Dotcom',
    jahr: 2000,
    rueckgangProzent: 50,
    erholungJahre: 7,
    ausloeser: 'Bewertungen von Technologiewerten ohne Gewinne',
  },
  {
    name: 'Finanzkrise',
    jahr: 2008,
    rueckgangProzent: 50,
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
