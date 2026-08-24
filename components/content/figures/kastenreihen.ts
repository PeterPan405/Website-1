import { FARBEN } from '@/components/content/figures/farben'

/**
 * Die Einträge der Kastenreihen – Text und Farbe, ohne Zeichnung.
 *
 * ## Warum sie nicht in der Zeichnung stehen
 *
 * Sie standen dort, und für das Auge war das richtig: Die Kästen werden aus
 * denselben Einträgen gezeichnet, aus denen `reiheAlsText()` den Satz für die
 * Bildbeschreibung baut. Eine Quelle, zwei Ausgaben.
 *
 * Die Vorlesefassung erreichte diese Quelle trotzdem nicht.
 * `scripts/lese-texte-schreiben.ts` läuft unter `node --experimental-strip-types`
 * und kann keine `.tsx` laden; alles, was gesprochen werden soll, muss in
 * reinem TypeScript stehen. Deshalb liegen die Einträge jetzt hier, und die
 * Zeichnungen holen sie sich.
 *
 * Was hier **nicht** hineingehört: Maße. Kastenhöhe, Breite und Abstand sind
 * Sache der Zeichnung und werden nie gesprochen.
 */

/** Ein Kasten einer Reihe: Titel, Text, optional eine Fußzeile. */
export interface Kasten {
  titel: string
  text: string
  farbe: string
  fuss?: string
}

/**
 * Die Vorlesefassung einer Kastenreihe, aus denselben Einträgen gebildet.
 *
 * Sie zweimal zu schreiben – einmal für das Auge, einmal für die Vorlesung –
 * hieße, sie zweimal zu pflegen. Der Build bricht ab, wenn eine Grafik keine
 * Beschreibung hat; er kann nicht prüfen, ob eine vorhandene noch stimmt.
 */
export function reiheAlsText(eintraege: readonly Kasten[]): string {
  return eintraege
    .map((e) => `${e.titel}: ${e.text}${e.fuss ? ` – ${e.fuss}` : ''}`)
    .join('. ')
}

/**
 * Die drei Bewertungsstufen eines Fonds.
 *
 * Eine Leiter abnehmender Nachprüfbarkeit, und die unterste ist die
 * interessante: Dort entscheidet, wer die Annahmen setzt.
 */
export const BEWERTUNGSSTUFEN = [
  {
    titel: 'Stufe 1',
    text: 'notierte Preise an einem aktiven Markt',
    fuss: 'unstrittig',
    farbe: FARBEN.marke,
  },
  {
    titel: 'Stufe 2',
    text: 'abgeleitet aus beobachtbaren Größen ähnlicher Papiere',
    fuss: 'vertretbar – aber eine Schätzung',
    farbe: FARBEN.warnung,
  },
  {
    titel: 'Stufe 3',
    text: 'überwiegend aus Modellannahmen',
    fuss: 'hier entscheidet, wer die Annahmen setzt',
    farbe: FARBEN.gefahr,
  },
] as const

/**
 * Die drei Wege vom Kurssturz in die Wirtschaft.
 *
 * Nur einer hat die Wucht, und erkennbar wird das nicht an der Aufzählung,
 * sondern an der Rückkopplung: Der Bankkanal ist der einzige, der zu sich
 * selbst zurückführt.
 */
export const ANSTECKUNGSWEGE = [
  {
    titel: 'Vermögenskanal',
    text: 'Weniger Vermögen, weniger Konsum',
    fuss: 'real, aber schwach und langsam',
    farbe: FARBEN.ruhig,
  },
  {
    titel: 'Bankkanal',
    text: 'Banken verlieren Eigenkapital und vergeben weniger Kredit',
    fuss: 'Unternehmen scheitern, obwohl ihr Geschäft trägt',
    farbe: FARBEN.gefahr,
  },
  {
    titel: 'Rückkopplung',
    text: 'Die schwächere Wirtschaft erzeugt Kreditausfälle',
    fuss: 'und die treffen wieder die Banken',
    farbe: FARBEN.gefahr,
  },
] as const

/**
 * Die drei Bezugsgrößen der Geldpolitik – zwei davon sind nicht messbar.
 *
 * Das ist keine Kritik an Notenbanken; sie sagen es selbst. Es ist der Grund,
 * warum Geldpolitik keine Steuerung nach Messwerten ist.
 */
export const MESSGROESSEN = [
  {
    titel: 'Inflation',
    text: 'Wird laufend erhoben und veröffentlicht',
    fuss: 'gemessen',
    farbe: FARBEN.marke,
  },
  {
    titel: 'Natürlicher Zins',
    text: 'Das Niveau, bei dem die Geldpolitik weder bremst noch stimuliert',
    fuss: 'nicht beobachtbar – nur geschätzt',
    farbe: FARBEN.gefahr,
  },
  {
    titel: 'Output-Lücke',
    text: 'Abstand zwischen tatsächlicher und möglicher Wirtschaftsleistung',
    fuss: 'nicht messbar – und oft revidiert',
    farbe: FARBEN.gefahr,
  },
] as const

/**
 * Vier Wege, Geld kurzfristig zu parken.
 *
 * Unterschieden wird nach Verfügbarkeit und Art des Schutzes, nicht nach
 * Rendite – bei der sind die Unterschiede Bruchteile eines Prozentpunkts.
 */
export const PARKPLAETZE = [
  {
    titel: 'Tagesgeld',
    text: 'täglich verfügbar',
    fuss: 'Einlagensicherung bis zur gesetzlichen Grenze',
    farbe: FARBEN.marke,
  },
  {
    titel: 'Festgeldleiter',
    text: 'in Stufen fällig',
    fuss: 'gesichert – der laufende Teil ist gebunden',
    farbe: FARBEN.akzent,
  },
  {
    titel: 'Geldmarkt-ETF',
    text: 'börsentäglich handelbar',
    fuss: 'kein Einlagenschutz, dafür Sondervermögen',
    farbe: FARBEN.warnung,
  },
  {
    titel: 'Kurze Anleihen',
    text: 'börsentäglich handelbar',
    fuss: 'Bonität des Staates statt einer Bank; Kursrisiko',
    farbe: FARBEN.warnung,
  },
] as const

/**
 * Die drei Paritätsbedingungen des Devisenmarkts.
 *
 * Die Reihenfolge ist die Aussage: eine gilt immer, eine als langfristige
 * Tendenz, eine systematisch nicht. Aus der dritten entsteht der Carry-Trade.
 */
export const PARITAETEN = [
  {
    titel: 'Gedeckte Zinsparität',
    text: 'Der Terminkurs entspricht der Zinsdifferenz',
    fuss: 'Arbitragebedingung, keine Theorie über Verhalten',
    farbe: FARBEN.marke,
  },
  {
    titel: 'Kaufkraftparität',
    text: 'Gleiche Güter kosten überall gleich viel',
    fuss: 'über Jahrzehnte eine Tendenz, über Jahre unbrauchbar',
    farbe: FARBEN.warnung,
  },
  {
    titel: 'Ungedeckte Zinsparität',
    text: 'Hochzinswährungen müssten entsprechend abwerten',
    fuss: 'empirisch widerlegt – daraus lebt der Carry-Trade',
    farbe: FARBEN.gefahr,
  },
] as const

/**
 * Die vier Ebenen, auf denen Kosten anfallen.
 *
 * Geordnet nach Sichtbarkeit, nicht nach Höhe – darin liegt die Aussage.
 */
export const KOSTENEBENEN = [
  {
    titel: 'Depotebene',
    text: 'Depotgebühr, Ordergebühren, Handelsplatzentgelt, Spread',
    fuss: 'steht auf der Abrechnung',
    farbe: FARBEN.marke,
  },
  {
    titel: 'Produktebene',
    text: 'laufende Kosten, Handel im Fonds, Erfolgsvergütung',
    fuss: 'wird täglich aus dem Fondsvermögen entnommen',
    farbe: FARBEN.akzent,
  },
  {
    titel: 'Steuerebene',
    text: 'Abgeltungsteuer, Vorabpauschale, verlorene Quellensteuer',
    fuss: 'fällt erst beim Abrechnen auf',
    farbe: FARBEN.warnung,
  },
  {
    titel: 'Beratungsebene',
    text: 'Ausgabeaufschlag, Bestandsprovision, Verwaltungsgebühr',
    fuss: 'die teuerste – und die am schlechtesten sichtbare',
    farbe: FARBEN.gefahr,
  },
] as const

/**
 * Die drei Ersatzansätze, mit denen Kryptowerte bewertet werden – und woran
 * jeder scheitert.
 */
export const ERSATZANSAETZE = [
  {
    titel: 'Netzwerkgröße',
    text: 'Der Wert wächst mit der Zahl der Nutzer',
    fuss: 'bei pseudonymen Adressen nicht messbar',
    farbe: FARBEN.gefahr,
  },
  {
    titel: 'Erzeugungskosten',
    text: 'Der Preis kann nicht unter die Miningkosten fallen',
    fuss: 'die Kausalität läuft umgekehrt',
    farbe: FARBEN.gefahr,
  },
  {
    titel: 'Knappheit',
    text: 'Bestand geteilt durch jährlichen Zuwachs',
    fuss: 'ein Angebotsmaß ohne Aussage über Nachfrage',
    farbe: FARBEN.gefahr,
  },
] as const

/**
 * Die gesetzliche Haftungskaskade bei der Abwicklung einer Bank.
 *
 * Von oben nach unten: Jede Stufe muss vollständig aufgezehrt sein, bevor die
 * nächste angefasst wird. Ohne Farbe – die Zeichnung leitet sie aus der
 * Stellung ab, und gesprochen wird sie ohnehin nicht.
 */
export const KASKADE = [
  {
    stufe: 'Eigenkapital der Aktionäre',
    text: 'Wird zuerst und in voller Höhe aufgezehrt',
  },
  {
    stufe: 'Hybride und Nachranganleihen',
    text: 'Wandlung oder Abschreibung, oft schon vor der Abwicklung',
  },
  {
    stufe: 'Nicht bevorrechtigte vorrangige Anleihen',
    text: 'Eigens geschaffen, um den Puffer vor den Einlagen zu bilden',
  },
  {
    stufe: 'Übrige Verbindlichkeiten und Einlagen über der Grenze',
    text: 'Hier beginnt es Unternehmen und große Vermögen zu treffen',
  },
  {
    stufe: 'Gedeckte Einlagen',
    text: 'Gesetzlich vom Bail-in ausgenommen – praktisch nie erreicht',
  },
] as const

/**
 * Acht Verkaufsgründe, sortiert nach ihrer Herkunft.
 *
 * Die Herkunft ist das Erkennungsmerkmal und damit das eigentliche Werkzeug:
 * kommt der Grund von innen oder von außen?
 */
export const VERKAUFSGRUENDE = {
  tragen: [
    'Das Geld wird gebraucht',
    'Das Ziel ist erreicht',
    'Die Anlagethese ist widerlegt',
    'Die Aufteilung ist verschoben',
  ],
  tragenNicht: [
    'Der eigene Einstiegskurs',
    'Runde Marken und Chartlinien',
    'Medienstimmung und Prognosen',
    'Gewinne „mitnehmen“ wollen',
  ],
} as const

/**
 * Drei Wege zu einer Kryptoanlage – und das jeweils verbleibende Risiko.
 *
 * Es ist immer dasselbe Risiko; es wechselt nur die Stelle.
 */
export const ZUGANGSWEGE = [
  {
    weg: 'Selbst verwahrt',
    hat: 'Du hältst den Schlüssel',
    risiko: 'Verlust des Schlüssels – kein Zurücksetzen, keine Hotline',
    farbe: FARBEN.marke,
  },
  {
    weg: 'Bei der Plattform',
    hat: 'Die Plattform hält den Schlüssel',
    risiko: 'Insolvenz und Missbrauch der Plattform',
    farbe: FARBEN.warnung,
  },
  {
    weg: 'ETP im Depot',
    hat: 'Ein Wertpapier auf den Kurs',
    risiko: 'Der Emittent – auch bei hinterlegten Beständen',
    farbe: FARBEN.gefahr,
  },
] as const

/**
 * Die deutschen Bundeswertpapiere nach ihrer Laufzeit bei Ausgabe.
 *
 * Die Namen sagen nichts über die Sicherheit – dahinter steht immer derselbe
 * Schuldner – wohl aber über die Zinsempfindlichkeit.
 */
export const BUNDESPAPIERE = [
  { name: 'Bubill', jahre: 1, hinweis: 'unverzinslich, bis 12 Monate' },
  { name: 'Schatz', jahre: 2, hinweis: 'reagiert am stärksten auf die Notenbank' },
  { name: 'Bobl', jahre: 5, hinweis: 'mittleres Segment' },
  { name: 'Bund', jahre: 10, hinweis: 'der Zinsmaßstab der Eurozone' },
  { name: 'Bund lang', jahre: 30, hinweis: 'die längste Laufzeit' },
] as const
