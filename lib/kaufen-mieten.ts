import { gesamtsteuersatz } from '@/lib/kapitalertragsteuer'
import { rateBeiTilgungssatz, tilgungsplan } from '@/lib/kredit'

/**
 * Kaufen oder mieten – ein Vollkostenvergleich über beide Seiten.
 *
 * ## Warum „Rate gegen Miete" die falsche Rechnung ist
 *
 * Weil sie zwei Dinge vergleicht, die nicht dasselbe enthalten. In der Rate
 * steckt Tilgung – die ist keine Ausgabe, sondern Sparen. In der Miete steckt
 * keine Instandhaltung, keine Grundsteuer und keine Hausverwaltung. Und beide
 * verschweigen die zwei Posten, an denen sich die Frage tatsächlich
 * entscheidet:
 *
 * 1. **Die Kaufnebenkosten.** Grunderwerbsteuer, Notar, Grundbuch, oft Makler:
 *    zusammen neun bis fünfzehn Prozent des Kaufpreises. Dieses Geld ist am
 *    Tag des Kaufs weg – es steckt nicht in der Immobilie, es ist ausgegeben.
 *    Bei 400.000 € Kaufpreis sind das bis zu 60.000 €, die der Wert erst
 *    wieder aufholen muss.
 * 2. **Die Opportunität des Eigenkapitals.** Wer 100.000 € anzahlt, hat diese
 *    100.000 € nicht mehr angelegt. Was sie in einem Depot geworden wären,
 *    fehlt auf der Kaufseite – und genau diese Zahl steht in keinem
 *    Maklerprospekt.
 *
 * ## Wie hier verglichen wird
 *
 * Über den **gleichen Geldabfluss**. Der Mieter zahlt Miete und legt die
 * Differenz zum Käufer an; ist die Miete höher, entnimmt er sie dem Depot.
 * Beide geben also in jedem Monat gleich viel aus, und am Ende wird
 * verglichen, was jeder besitzt:
 *
 * - **Käufer:** Immobilienwert minus Restschuld.
 * - **Mieter:** Depotwert nach Steuern auf die Gewinne.
 *
 * Ohne diese Gleichstellung vergleicht man einen Sparer mit einem
 * Nicht-Sparer, und das Ergebnis steht vorher fest.
 *
 * ## Die Steuerasymmetrie steht ausdrücklich drin
 *
 * Der Gewinn aus dem Depot wird versteuert. Der Wertzuwachs einer
 * selbstgenutzten Immobilie nicht – bei Eigennutzung ist er von Anfang an
 * steuerfrei, bei Vermietung nach zehn Jahren. Wer die Steuer auf der einen
 * Seite weglässt, verschiebt das Ergebnis um mehrere zehntausend Euro, ohne
 * dass es jemandem auffällt. Deshalb wird sie hier gerechnet und benannt.
 */

export interface Kaufmietvergleich {
  /* Kauf */
  kaufpreis: number
  nebenkostenProzent: number
  eigenkapital: number
  zinsProzent: number
  tilgungProzent: number
  /** Instandhaltung und nicht umlegbare Kosten je Jahr, in Prozent des Kaufpreises. */
  instandhaltungProzent: number
  /** Erwartete Wertentwicklung der Immobilie je Jahr, in Prozent. */
  wertsteigerungProzent: number

  /* Miete */
  mieteProMonat: number
  mietsteigerungProzent: number

  /* Beides */
  anlagerenditeProzent: number
  jahre: number
  /** Kirchensteuersatz für die Abgeltungsteuer auf die Depotgewinne – 0, 0.08 oder 0.09. */
  kirchensteuersatz: number
}

/** Ein Jahr im Vergleich, beide Seiten nebeneinander. */
export interface Vergleichsjahr {
  jahr: number
  /** Was der Käufer in diesem Jahr ausgegeben hat. */
  ausgabenKauf: number
  /** Was der Mieter an Miete gezahlt hat. */
  miete: number
  /** Was der Mieter dadurch anlegen konnte – negativ, wenn die Miete höher war. */
  anlage: number
  immobilienwert: number
  restschuld: number
  vermoegenKauf: number
  vermoegenMiete: number
}

export interface Kaufmietergebnis {
  verlauf: Vergleichsjahr[]
  /** Vermögen des Käufers am Ende: Immobilienwert minus Restschuld. */
  vermoegenKauf: number
  /** Vermögen des Mieters am Ende: Depotwert nach Steuern. */
  vermoegenMiete: number
  /** Positiv heißt: Kaufen war besser. */
  unterschied: number

  /* Die Posten, um die es eigentlich geht */
  nebenkosten: number
  darlehen: number
  monatsrateKauf: number
  /** Alle Zinsen, die der Käufer über den Zeitraum gezahlt hat. */
  zinsenGezahlt: number
  /** Alle Instandhaltungskosten über den Zeitraum. */
  instandhaltungGesamt: number
  /** Steuer auf den Depotgewinn des Mieters. */
  steuerMieter: number
  /**
   * Wie stark die Immobilie im Jahr steigen müsste, damit beide gleich
   * dastehen – die aussagekräftigste Zahl des ganzen Rechners.
   */
  notwendigeWertsteigerungProzent: number | null
}

/** Die monatlichen Ausgaben des Käufers im ersten Jahr. */
function monatsausgabenKauf(
  rate: number,
  kaufpreis: number,
  instandhaltungProzent: number
): number {
  return rate + (kaufpreis * instandhaltungProzent) / 100 / 12
}

/**
 * Die Rechnung selbst – ohne die Nullstellensuche.
 *
 * Getrennt, weil `notwendigeWertsteigerung()` diese Funktion **aufruft**: Wäre
 * die Suche Teil davon, riefe sie sich selbst auf. Genau das ist beim ersten
 * Anlauf passiert, und der Testlauf hat es sofort gemeldet – „Maximum call
 * stack size exceeded" in der zweiten Zeile der Ausgabe.
 *
 * Gerechnet wird monatlich, weil die Kreditrate monatlich anfällt und der
 * Zinseszins auf dem Depot sonst um bis zu ein Prozent danebenläge. Der
 * Verlauf wird jährlich zurückgegeben – 360 Zeilen liest niemand.
 */
function rechne(
  eingabe: Kaufmietvergleich
): Omit<Kaufmietergebnis, 'notwendigeWertsteigerungProzent'> {
  const monate = Math.max(1, Math.round(eingabe.jahre * 12))

  const nebenkosten = (eingabe.kaufpreis * eingabe.nebenkostenProzent) / 100

  /*
    Die Nebenkosten werden mitfinanziert, soweit das Eigenkapital nicht reicht.

    Banken verlangen sie in der Regel aus Eigenmitteln; wer sie nicht hat, zahlt
    einen Aufschlag oder bekommt keinen Kredit. Diese Rechnung nimmt trotzdem
    den einfachen Weg – Darlehen = Kaufpreis + Nebenkosten − Eigenkapital –,
    weil jede andere Regel einen Fall erzeugt, in dem der Rechner „geht nicht"
    sagen müsste. Der Aufschlag für wenig Eigenkapital steht bei den Grenzen.
  */
  const darlehen = Math.max(
    0,
    eingabe.kaufpreis + nebenkosten - eigenkapitalOhneMinus(eingabe)
  )

  const kredit = { summe: darlehen, zinsProzent: eingabe.zinsProzent }
  const rate =
    darlehen > 0 ? rateBeiTilgungssatz(kredit, Math.max(0.1, eingabe.tilgungProzent)) : 0
  const plan = tilgungsplan(kredit, rate, monate)

  const monatsrendite = (1 + eingabe.anlagerenditeProzent / 100) ** (1 / 12) - 1
  const monatswert = (1 + eingabe.wertsteigerungProzent / 100) ** (1 / 12) - 1

  /*
    Der Mieter startet mit dem Eigenkapital im Depot.

    Das ist der Kern des Vergleichs: Der Käufer hat es in die Immobilie und in
    die Nebenkosten gesteckt, der Mieter legt es an. Beide Seiten beginnen mit
    demselben Vermögen und geben von da an gleich viel aus.
  */
  let depot = eigenkapitalOhneMinus(eingabe)
  let eingezahlt = depot
  let immobilienwert = eingabe.kaufpreis
  let miete = eingabe.mieteProMonat

  let zinsenGezahlt = 0
  let instandhaltungGesamt = 0

  const verlauf: Vergleichsjahr[] = []
  let jahresausgabenKauf = 0
  let jahresmiete = 0
  let jahresanlage = 0

  const steuersatz = gesamtsteuersatz(eingabe.kirchensteuersatz)

  for (let monat = 1; monat <= monate; monat++) {
    const zeile = plan[monat - 1]
    const zins = zeile?.zins ?? 0
    const restschuld = zeile?.restschuld ?? 0
    /* Nach der letzten Rate ist die Rate weg – der Käufer zahlt dann nur noch Unterhalt. */
    const rateJetzt = zeile ? rate : 0

    const instandhaltung = (eingabe.kaufpreis * eingabe.instandhaltungProzent) / 100 / 12
    const ausgabenKauf = rateJetzt + instandhaltung

    zinsenGezahlt += zins
    instandhaltungGesamt += instandhaltung

    /*
      Die Differenz wandert ins Depot – auch wenn sie negativ ist.

      Ist die Miete höher als die Ausgaben des Käufers, entnimmt der Mieter dem
      Depot. Ihn stattdessen einfach nichts anlegen zu lassen wäre die
      bequemere Rechnung und würde ihn besserstellen, als er steht.
    */
    const anlage = ausgabenKauf - miete
    depot = depot * (1 + monatsrendite) + anlage
    eingezahlt += anlage

    immobilienwert *= 1 + monatswert

    jahresausgabenKauf += ausgabenKauf
    jahresmiete += miete
    jahresanlage += anlage

    if (monat % 12 === 0) {
      const gewinn = Math.max(0, depot - eingezahlt)
      verlauf.push({
        jahr: monat / 12,
        ausgabenKauf: jahresausgabenKauf,
        miete: jahresmiete,
        anlage: jahresanlage,
        immobilienwert,
        restschuld,
        vermoegenKauf: immobilienwert - restschuld,
        vermoegenMiete: depot - gewinn * steuersatz,
      })
      jahresausgabenKauf = 0
      jahresmiete = 0
      jahresanlage = 0

      /* Die Miete steigt einmal im Jahr, nicht jeden Monat ein Zwölftel. */
      miete *= 1 + eingabe.mietsteigerungProzent / 100
    }
  }

  const letzterZeile = plan[monate - 1]
  const restschuldEnde = letzterZeile?.restschuld ?? 0
  const vermoegenKauf = immobilienwert - restschuldEnde

  const gewinnEnde = Math.max(0, depot - eingezahlt)
  const steuerMieter = gewinnEnde * steuersatz
  const vermoegenMiete = depot - steuerMieter

  return {
    verlauf,
    vermoegenKauf,
    vermoegenMiete,
    unterschied: vermoegenKauf - vermoegenMiete,
    nebenkosten,
    darlehen,
    monatsrateKauf: monatsausgabenKauf(
      rate,
      eingabe.kaufpreis,
      eingabe.instandhaltungProzent
    ),
    zinsenGezahlt,
    instandhaltungGesamt,
    steuerMieter,
  }
}

/** Der vollständige Vergleich, samt der Frage „was müsste passieren?". */
export function vergleicheKaufMiete(eingabe: Kaufmietvergleich): Kaufmietergebnis {
  return {
    ...rechne(eingabe),
    notwendigeWertsteigerungProzent: notwendigeWertsteigerung(eingabe),
  }
}

/** Eigenkapital nie negativ – ein Minus wäre eine Eingabe ohne Bedeutung. */
function eigenkapitalOhneMinus(eingabe: Kaufmietvergleich): number {
  return Math.max(0, eingabe.eigenkapital)
}

/**
 * Bei welcher jährlichen Wertsteigerung beide Seiten gleich dastehen.
 *
 * Die Zahl, um die es eigentlich geht. Statt „lohnt sich Kaufen?" – was
 * niemand beantworten kann, weil es von der Zukunft abhängt – beantwortet sie
 * die Frage, die sich beantworten lässt: **Was müsste passieren, damit es sich
 * lohnt?** Wer sieht, dass die Immobilie dafür 4,5 Prozent im Jahr steigen
 * müsste, kann selbst entscheiden, ob er das für wahrscheinlich hält.
 *
 * Gesucht wird durch Intervallhalbierung, nicht über eine Formel: Der
 * Zusammenhang läuft über den Tilgungsplan und ist geschlossen nicht
 * auflösbar. Fünfzig Schritte über −10 bis +20 Prozent treffen auf ein
 * Zehntausendstel genau.
 */
export function notwendigeWertsteigerung(eingabe: Kaufmietvergleich): number | null {
  const bei = (wert: number) =>
    rechne({ ...eingabe, wertsteigerungProzent: wert }).unterschied

  let unten = -10
  let oben = 20

  /*
    Wenn Kaufen schon bei minus zehn Prozent im Jahr besser ist – oder bei
    plus zwanzig immer noch schlechter –, gibt es in diesem Bereich keinen
    Schnittpunkt. Dann `null` statt einer Randzahl, die wie ein Ergebnis
    aussieht.
  */
  if (bei(unten) > 0 || bei(oben) < 0) return null

  for (let schritt = 0; schritt < 50; schritt++) {
    const mitte = (unten + oben) / 2
    if (bei(mitte) < 0) unten = mitte
    else oben = mitte
  }

  return (unten + oben) / 2
}
