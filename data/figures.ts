/**
 * Verzeichnis der Grafiken im Lernbereich.
 *
 * ## Warum gezeichnetes SVG und keine Bilddateien
 *
 * Die Grafiken sind handgeschriebenes SVG im HTML, keine hochgeladenen Bilder.
 * Das hat vier Gründe, von denen jeder für sich schon reichen würde:
 *
 * - **Rechte.** Für ein fremdes Bild bräuchte es eine Lizenz und einen
 *   Bildnachweis. Was hier gezeichnet wird, gehört uns.
 * - **Zahlen.** Die Werte in den Grafiken stammen aus denselben Funktionen wie
 *   die Tabellen daneben (`lib/finance.ts`). Ein Bild wäre eine zweite,
 *   unabhängige Quelle für dieselbe Zahl – und die geht irgendwann auseinander.
 *   Eine Grafik, die der Tabelle über ihr widerspricht, ist schlimmer als gar
 *   keine Grafik.
 * - **Darstellung.** SVG bleibt bei jeder Spaltenbreite scharf, übernimmt die
 *   Farben des hellen wie des dunklen Themes und braucht kein JavaScript. Die
 *   Seiten werden statisch gebaut; die Grafik steht fertig im HTML.
 * - **Zugänglichkeit.** Jede Grafik trägt `<title>` und `<desc>`. Wer sie nicht
 *   sehen kann, bekommt den Inhalt vorgelesen statt „Bild“.
 *
 * ## Was hier bewusst fehlt
 *
 * Karikaturen und gezeichnete Illustrationen sind nicht dabei. Sie ließen sich
 * hier nicht ehrlich herstellen: Zeichnungen von Hand gibt es nicht, und
 * fremdes Bildmaterial hätte eine Lizenz- und Urheberfrage im Schlepptau, die
 * eine Bildungsseite sich nicht einhandeln sollte. Was diese Grafiken statt
 * dessen leisten, ist der eigentliche Zweck einer Karikatur: eine Aussage in
 * einem Blick sichtbar machen.
 *
 * ## Aufbau
 *
 * Hier stehen nur Kennung und Beschreibung – die Zeichnung selbst liegt unter
 * `components/content/figures/`. Die Trennung ist nicht kosmetisch: Daten
 * dürfen in diesem Projekt nicht von Komponenten abhängen, und `data/content.ts`
 * braucht die Kennungen für das Blockmodell.
 */

export type FigureId =
  /** Einfacher Zins gegen Zinseszins über 40 Jahre. */
  | 'zins-gerade-vs-kurve'
  /** Drei Sparer mit gleicher Rate und unterschiedlichem Startalter. */
  | 'zins-frueh-vs-spaet'
  /** Endkapital bei vier Kostenquoten. */
  | 'zins-kosten'
  /** Plus 50 Prozent und minus 50 Prozent ergeben minus 25 Prozent. */
  | 'zins-volatilitaetsbremse'
  /** Hundert Anteile, davon wenige die eigenen. */
  | 'aktie-anteil'
  /** Der Kursabschlag am Ausschüttungstag. */
  | 'aktie-dividendenabschlag'
  /** Geldkurs, Briefkurs und die Spanne dazwischen. */
  | 'aktie-spread'
  /** Aktie, Anleihe, Immobilie und Rohstoff im Vergleich des laufenden Ertrags. */
  | 'rohstoffe-kein-ertrag'
  /** Terminkurve in Contango und in Backwardation. */
  | 'rohstoffe-rollkurve'
  /** Ländergewichtung des MSCI World. */
  | 'msci-world-laender'

export interface FigureMeta {
  /** Kurzer Titel – wird als `<title>` im SVG vorgelesen. */
  title: string
  /**
   * Was die Grafik zeigt, in einem Satz.
   *
   * Landet als `<desc>` im SVG und ersetzt die Grafik für alle, die sie nicht
   * sehen. Deshalb inhaltlich, nicht formal: „Die Kurve verdreifacht sich in
   * vierzig Jahren“ hilft, „Ein Liniendiagramm mit zwei Kurven“ nicht.
   */
  description: string
  /** Bildunterschrift unter der Grafik. */
  caption: string
}

export const figureMeta: Record<FigureId, FigureMeta> = {
  'zins-gerade-vs-kurve': {
    title: 'Einfacher Zins und Zinseszins im Vergleich',
    description:
      'Zwei Verläufe für 10.000 Euro bei 6 Prozent über 40 Jahre. Beim einfachen Zins wächst das Kapital als Gerade auf 34.000 Euro, weil die Erträge jedes Jahr entnommen werden. Bleiben sie liegen, wird daraus eine Kurve, die immer steiler wird und bei rund 103.000 Euro endet – dem Dreifachen.',
    caption:
      'Derselbe Zinssatz, derselbe Startbetrag. Der einzige Unterschied ist, ob die Erträge liegen bleiben.',
  },
  'zins-frueh-vs-spaet': {
    title: 'Startalter gegen Sparrate',
    description:
      'Drei Sparer zahlen bis 67 monatlich 200 Euro bei 6 Prozent ein. Wer mit 25 beginnt, zahlt rund das Doppelte ein wie jemand, der mit 45 beginnt, landet aber bei rund dem Vierfachen. Der dunkle Teil jedes Balkens ist das eingezahlte Geld, der helle sind die Erträge.',
    caption:
      'Die eingezahlten Beträge unterscheiden sich um den Faktor zwei, die Ergebnisse um den Faktor vier. Der Unterschied steckt vollständig in den Erträgen.',
  },
  'zins-kosten': {
    title: 'Wirkung laufender Kosten über 30 Jahre',
    description:
      'Vier Sparpläne über 200 Euro monatlich und 30 Jahre bei 6 Prozent Bruttorendite, belastet mit 0,2 bis 1,8 Prozent laufenden Kosten. Zwischen der günstigsten und der teuersten Variante liegen rund 50.000 Euro – etwa zwei Drittel aller Einzahlungen.',
    caption:
      'Der graue Teil jedes Balkens ist das, was die Kosten gegenüber einer Anlage ganz ohne Gebühren übrig gelassen hätten.',
  },
  'zins-volatilitaetsbremse': {
    title: 'Warum ein Durchschnitt von null Geld kostet',
    description:
      'Aus 100 Euro werden nach einem Plus von 50 Prozent 150 Euro und nach einem anschließenden Minus von 50 Prozent 75 Euro. Der Durchschnitt der beiden Jahresrenditen ist null, das Ergebnis ist ein Verlust von einem Viertel.',
    caption:
      'Plus 50 und minus 50 Prozent heben sich nicht auf: Das Minus wirkt auf den größeren Betrag.',
  },
  'aktie-anteil': {
    title: 'Was eine Aktie ist',
    description:
      'Ein Quadrat aus hundert gleichen Feldern steht für das ganze Unternehmen; jedes Feld ist ein Prozent. Fünf Felder sind hervorgehoben – so viel gehört jemandem, dem fünf Prozent der Aktien gehören: fünf Prozent der Fabriken, der Marken, der Patente, der Schulden und der künftigen Gewinne.',
    caption:
      'Wer Aktien kauft, kauft Anteile am Unternehmen – nicht ein Papier, dessen Preis grundlos schwankt.',
  },
  'aktie-dividendenabschlag': {
    title: 'Der Kursabschlag am Ausschüttungstag',
    description:
      'Vor der Ausschüttung steht die Aktie bei 50 Euro. Werden 2 Euro Dividende gezahlt, verlässt dieses Geld das Unternehmen: Der Kurs fällt rechnerisch auf 48 Euro, auf dem Konto liegen 2 Euro. Zusammen sind es wieder 50 Euro.',
    caption:
      'Eine Dividende ist kein zusätzliches Geld, sondern eine Umschichtung aus dem Unternehmenswert auf dein Konto.',
  },
  'aktie-spread': {
    title: 'Geldkurs, Briefkurs und die Spanne dazwischen',
    description:
      'Auf einer Preisachse liegt der Geldkurs bei 49,90 Euro – so viel bekommst du beim Verkauf. Der Briefkurs liegt bei 50,10 Euro – so viel zahlst du beim Kauf. Die Spanne von 20 Cent ist der Spread; wer sofort wieder verkaufte, wäre um diesen Betrag im Minus.',
    caption:
      'Es gibt nie einen einzigen Kurs. Zwischen Kauf und Verkauf liegt immer eine Spanne – sie ist der erste Kostenblock jeder Order.',
  },
  'rohstoffe-kein-ertrag': {
    title: 'Rohstoffe zahlen nichts',
    description:
      'Eine Aktie zahlt Dividende, eine Anleihe Zinsen, eine vermietete Wohnung Miete. Bei allen dreien entsteht Ertrag, ohne dass jemand kaufen muss. Ein Rohstoff zahlt nichts: Sein gesamter Ertrag muss aus einem höheren Preis kommen, den ein anderer bereit ist zu zahlen.',
    caption:
      'Der Unterschied ist kein Detail, sondern der Grund, warum sich ein Rohstoff nicht wie eine Aktie bewerten lässt.',
  },
  'rohstoffe-rollkurve': {
    title: 'Contango und Backwardation',
    description:
      'Zwei Terminkurven. Im Contango kosten spätere Liefermonate mehr als frühere: Beim Weiterrollen wird jedes Mal teurer nachgekauft, das kostet Rendite. In der Backwardation kosten spätere Monate weniger, dann bringt das Rollen einen Gewinn.',
    caption:
      'Deshalb kann der Rohstoffpreis steigen und das Produkt darauf trotzdem verlieren.',
  },
  'msci-world-laender': {
    title: 'Ländergewichtung des MSCI World',
    description:
      'Balken für die Länderanteile im MSCI World. Die USA stellen mit Abstand den größten Teil, danach folgen Japan, Großbritannien, Kanada und Frankreich mit jeweils wenigen Prozent; der Rest verteilt sich auf die übrigen Industrieländer. Die genauen Werte trägt die Grafik selbst nach, weil sie aus einem datierten Datensatz stammen.',
    caption:
      'Nach Börsenwert gewichtet heißt: Das Gewicht folgt dem Marktwert, nicht der Zahl der Länder.',
  },
}
