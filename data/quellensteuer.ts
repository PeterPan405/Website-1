/**
 * Quellensteuer auf Dividenden, je Sitzland des Unternehmens.
 *
 * ## Was hier steht – und was nicht
 *
 * Zwei Zahlen je Land: der Satz, den das Sitzland auf Dividenden einbehält,
 * und der Satz, auf den das Doppelbesteuerungsabkommen mit Deutschland ihn für
 * Privatanleger begrenzt. Aus beiden ergibt sich, wie viel in Deutschland
 * angerechnet wird und wie viel nur über einen Antrag im Ausland
 * zurückzuholen ist.
 *
 * **Diese Tabelle ist eine Orientierung und keine Rechtsquelle.** Verbindlich
 * ist die Übersicht des Bundeszentralamts für Steuern; sie wird laufend
 * fortgeschrieben, und Sätze ändern sich durch Gesetzgebung im Sitzland. Wer
 * eine Steuererklärung darauf stützt, muss dort nachsehen.
 *
 * ## Warum nicht alle Länder aufgeführt sind
 *
 * Weil eine Zahl, die vielleicht stimmt, hier schlimmer wäre als keine. Diese
 * Website führt Aktien aus 45 Ländern; für einen Teil davon ließe sich der
 * aktuelle Satz nur aus dritter Hand angeben. Solche Länder stehen nicht in
 * der Tabelle, und auf der Aktienseite steht dann, dass kein Satz hinterlegt
 * ist – mit dem Verweis auf die amtliche Übersicht.
 *
 * ## Sonderfälle, die im Text auftauchen müssen
 *
 * - **Deutschland**: Keine Quellensteuer im hier gemeinten Sinn. Die Bank
 *   führt 25 Prozent Kapitalertragsteuer plus Solidaritätszuschlag direkt ab;
 *   damit ist die Sache erledigt.
 * - **Schweiz**: 35 Prozent einbehalten, 15 anrechenbar, 20 nur auf Antrag
 *   bei der Eidgenössischen Steuerverwaltung zurück. Der häufigste Fall, in
 *   dem Geld liegen bleibt.
 * - **Frankreich**: Der einbehaltene Satz gilt ohne vorherige Freistellung.
 *   Manche Depotbanken wenden den Abkommenssatz direkt an, andere nicht.
 */

export interface Quellensteuersatz {
  /** Was das Sitzland ohne Abkommen einbehält, in Prozent. */
  satz: number
  /**
   * Der Satz nach dem Doppelbesteuerungsabkommen mit Deutschland, in Prozent.
   *
   * Für Streubesitz natürlicher Personen. Für Schachtelbeteiligungen von
   * Kapitalgesellschaften gelten andere, niedrigere Sätze – die haben mit
   * einem Privatdepot nichts zu tun und stehen deshalb nicht hier.
   */
  dba: number
  /** Ein Satz zur Besonderheit dieses Landes, wo es eine gibt. */
  hinweis?: string
}

/**
 * Wie viel ausländische Quellensteuer Deutschland höchstens anrechnet.
 *
 * Fünfzehn Prozentpunkte, § 32d Abs. 5 EStG. Was darüber hinaus einbehalten
 * wurde, ist in Deutschland nicht anrechenbar – es muss im Sitzland
 * zurückgefordert werden, sonst bleibt es weg.
 */
export const ANRECHNUNG_HOECHSTSATZ = 15

/** Stand der Angaben. Bei jeder Änderung mitziehen. */
export const QUELLENSTEUER_STAND = '2026-07'

export const quellensteuerQuelle = {
  label: 'Bundeszentralamt für Steuern: Quellensteuersätze und Erstattung',
  url: 'https://www.bzst.de/DE/Unternehmen/Kapitalertraege/Auslaendische_Quellensteuer/auslaendische_quellensteuer_node.html',
}

/**
 * Sätze je Sitzland, Schlüssel ist die ISO-3166-Zahl.
 *
 * Aufgenommen ist ein Land nur, wenn beide Sätze feststehen. Die Auswahl deckt
 * die Sitzländer der großen Mehrheit der hier geführten Aktien ab.
 */
export const quellensteuer: Record<string, Quellensteuersatz> = {
  /*
    Deutschland steht mit null, nicht mit 25.

    Das sieht zunächst falsch aus und ist der Kern der Sache: Gemeint ist die
    **ausländische** Quellensteuer, und die beträgt bei einem deutschen
    Unternehmen null. Die 25 Prozent, die die Bank einbehält, sind die deutsche
    Abgeltungsteuer – und die steht in der Rechnung ohnehin schon.

    Mit `satz: 25` wurde sie zweimal abgezogen: Ein deutscher Titel kam auf
    63,63 Euro je hundert statt auf 73,63, und damit auf zehn Euro weniger als
    eine niederländische Aktie. Gefunden hat das der Test, der beide
    gegeneinanderhält – beim Lesen des Codes fiel es nicht auf, weil die Zahl
    für sich genommen plausibel aussah.
  */
  '276': {
    satz: 0,
    dba: 0,
    hinweis:
      'Kein Auslandsfall: Es gibt keine ausländische Quellensteuer, und die Bank führt die deutsche Abgeltungsteuer samt Solidaritätszuschlag direkt ab. Damit ist die Sache erledigt.',
  },
  // Vereinigte Staaten
  '840': {
    satz: 30,
    dba: 15,
    hinweis:
      'Der Abkommenssatz gilt nur, wenn der Depotbank ein ausgefülltes Formular W-8BEN vorliegt. Ohne dieses Formular behalten die USA 30 Prozent ein, und die Hälfte davon ist in Deutschland nicht anrechenbar.',
  },
  // Schweiz
  '756': {
    satz: 35,
    dba: 15,
    hinweis:
      'Zwanzig Prozentpunkte sind nur auf Antrag bei der Eidgenössischen Steuerverwaltung zurückzuholen. Bei kleinen Beträgen übersteigt der Aufwand oft den Ertrag – das ist der häufigste Fall, in dem Geld liegen bleibt.',
  },
  // Vereinigtes Königreich
  '826': {
    satz: 0,
    dba: 0,
    hinweis:
      'Das Vereinigte Königreich erhebt auf Dividenden keine Quellensteuer. Es bleibt bei der deutschen Abgeltungsteuer.',
  },
  // Niederlande
  '528': { satz: 15, dba: 15 },
  // Frankreich
  '250': {
    satz: 25,
    dba: 15,
    hinweis:
      'Ob gleich 15 oder zunächst 25 Prozent einbehalten werden, hängt davon ab, ob die Depotbank die Freistellung im Voraus beantragt. Sie tun das nicht alle.',
  },
  // Österreich
  '040': { satz: 27.5, dba: 15 },
  // Belgien
  '056': { satz: 30, dba: 15 },
  // Dänemark
  '208': { satz: 27, dba: 15 },
  // Schweden
  '752': { satz: 30, dba: 15 },
  // Norwegen
  '578': { satz: 25, dba: 15 },
  // Finnland
  '246': { satz: 30, dba: 15 },
  // Italien
  '380': { satz: 26, dba: 15 },
  // Spanien
  '724': { satz: 19, dba: 15 },
  // Portugal
  '620': { satz: 28, dba: 15 },
  // Irland
  '372': { satz: 25, dba: 15 },
  // Luxemburg
  '442': { satz: 15, dba: 15 },
  // Polen
  '616': { satz: 19, dba: 15 },
  // Tschechien
  '203': { satz: 15, dba: 15 },
  // Ungarn
  '348': { satz: 15, dba: 15 },
  // Japan
  '392': { satz: 15.315, dba: 15 },
  // Kanada
  '124': { satz: 25, dba: 15 },
  // Australien
  '036': {
    satz: 30,
    dba: 15,
    hinweis:
      'Auf den Teil der Dividende, für den das Unternehmen bereits Körperschaftsteuer gezahlt hat („franked“), fällt keine Quellensteuer an.',
  },
  // Neuseeland
  '554': { satz: 30, dba: 15 },
  // China
  '156': { satz: 10, dba: 10 },
  // Hongkong
  '344': {
    satz: 0,
    dba: 0,
    hinweis: 'Hongkong erhebt auf Dividenden keine Quellensteuer.',
  },
  // Singapur
  '702': {
    satz: 0,
    dba: 0,
    hinweis: 'Singapur erhebt auf Dividenden an Privatanleger keine Quellensteuer.',
  },
  // Südkorea
  '410': { satz: 22, dba: 15 },
  // Südafrika
  '710': { satz: 20, dba: 15 },
  // Mexiko
  '484': { satz: 10, dba: 10 },
  // Brasilien
  '076': {
    satz: 0,
    dba: 0,
    hinweis:
      'Brasilien besteuert ausgeschüttete Gewinne beim Unternehmen, nicht beim Empfänger.',
  },
  // Malaysia
  '458': { satz: 0, dba: 0 },
}
