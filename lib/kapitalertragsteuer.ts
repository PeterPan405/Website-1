/**
 * Die Steuer auf Kapitalerträge in Deutschland – samt Vorabpauschale.
 *
 * Bewusst ohne Importe, damit `tests/` das Modul direkt laden kann.
 *
 * ## Warum das mehr ist als „25 Prozent“
 *
 * Weil zwischen dem Ertrag und dem Steuerbescheid vier Größen stehen, die alle
 * in eine bestimmte Reihenfolge gehören:
 *
 * 1. **Teilfreistellung** – bei Fonds bleibt je nach Art ein Anteil des Ertrags
 *    von vornherein steuerfrei. Sie wird zuerst abgezogen.
 * 2. **Sparerpauschbetrag** – erst auf das, was danach übrig ist.
 * 3. **Kapitalertragsteuer** – 25 Prozent, aber nicht immer.
 * 4. **Zuschläge** – Solidaritätszuschlag und, wer Mitglied ist, Kirchensteuer.
 *
 * ## Der Sonderfall Kirchensteuer
 *
 * Sie beträgt 8 oder 9 Prozent **der Kapitalertragsteuer** – und mindert
 * zugleich als Sonderausgabe deren Bemessungsgrundlage. Deshalb sind es nicht
 * 25 Prozent plus Kirchensteuer, sondern etwas weniger:
 *
 *     Kapitalertragsteuer = Ertrag / (4 + Kirchensteuersatz)
 *
 * Ohne Kirchensteuer ergibt das die bekannten 25 Prozent, mit 9 Prozent
 * dagegen 24,45. Die Gesamtbelastung liegt damit bei 26,375 Prozent ohne und
 * 27,99 Prozent mit Kirchensteuer – nicht bei 25 und nicht bei 34.
 *
 * ## Wo dieses Modul aufhört
 *
 * Es rechnet den Regelfall eines privaten Anlegers mit Wohnsitz in Deutschland.
 * Nicht enthalten sind die Günstigerprüfung, anrechenbare ausländische
 * Quellensteuer, Verlustverrechnungstöpfe und alles, was mit Altbeständen von
 * vor 2009 zusammenhängt.
 */

/** Kapitalertragsteuersatz auf Kapitalerträge. */
export const ABGELTUNGSTEUERSATZ = 0.25

/** Solidaritätszuschlag, bezogen auf die Kapitalertragsteuer. */
export const SOLIDARITAETSZUSCHLAG = 0.055

/**
 * Der Sparerpauschbetrag seit 2023.
 *
 * Er gilt je Person; Zusammenveranlagte haben den doppelten Betrag. Er wird
 * nicht automatisch berücksichtigt – ohne Freistellungsauftrag bei der Bank
 * führt sie die Steuer ab, und man holt sie sich über die Steuererklärung
 * zurück.
 */
export const SPARERPAUSCHBETRAG_EINZELN = 1000
export const SPARERPAUSCHBETRAG_ZUSAMMEN = 2000

/**
 * Die Teilfreistellung nach Investmentsteuergesetz, für Privatanleger.
 *
 * Sie gleicht die Steuer aus, die der Fonds bereits auf seiner Ebene zahlt.
 * Maßgeblich ist, was in den Anlagebedingungen als Mindestquote steht – nicht,
 * was der Fonds gerade tatsächlich hält.
 */
export const TEILFREISTELLUNG = {
  aktienfonds: 0.3,
  mischfonds: 0.15,
  immobilienfonds: 0.6,
  immobilienfondsAusland: 0.8,
  sonstige: 0,
} as const

export type Fondsart = keyof typeof TEILFREISTELLUNG

export interface Steuerannahmen {
  /** Kapitalertrag vor allen Abzügen, in Euro. */
  ertrag: number
  /** Art des Fonds – bestimmt die Teilfreistellung. */
  fondsart: Fondsart
  /** Noch nicht verbrauchter Sparerpauschbetrag, in Euro. */
  freibetrag: number
  /** 0 für kein Kirchenmitglied, sonst 0,08 (BY, BW) oder 0,09. */
  kirchensteuersatz: number
}

export interface Steuerergebnis {
  /** Der durch die Teilfreistellung steuerfrei gestellte Teil. */
  teilfreigestellt: number
  /** Der Teil, der durch den Sparerpauschbetrag gedeckt ist. */
  durchFreibetrag: number
  /** Worauf am Ende Steuer erhoben wird. */
  bemessungsgrundlage: number
  kapitalertragsteuer: number
  solidaritaetszuschlag: number
  kirchensteuer: number
  /** Alle drei zusammen. */
  steuerGesamt: number
  /** Was vom Ertrag übrig bleibt. */
  nettoertrag: number
  /**
   * Die tatsächliche Belastung, bezogen auf den vollen Ertrag.
   *
   * Fast immer deutlich unter den 26,375 Prozent, die man erwartet – wegen
   * Teilfreistellung und Freibetrag. Genau deshalb steht sie hier.
   */
  effektiverSatz: number
  /** Wie viel Freibetrag danach noch übrig ist. */
  freibetragRest: number
}

/** Der Steuersatz auf die Bemessungsgrundlage, Zuschläge eingerechnet. */
export function gesamtsteuersatz(kirchensteuersatz: number): number {
  const kapitalertragsteuer = 1 / (4 + kirchensteuersatz)
  return kapitalertragsteuer * (1 + SOLIDARITAETSZUSCHLAG + kirchensteuersatz)
}

/** Die Steuer auf einen Kapitalertrag. */
export function berechneSteuer(annahmen: Steuerannahmen): Steuerergebnis {
  const ertrag = Math.max(annahmen.ertrag, 0)
  const freibetrag = Math.max(annahmen.freibetrag, 0)
  const k = Math.max(annahmen.kirchensteuersatz, 0)

  const teilfreigestellt = ertrag * TEILFREISTELLUNG[annahmen.fondsart]
  const nachTeilfreistellung = ertrag - teilfreigestellt

  const durchFreibetrag = Math.min(nachTeilfreistellung, freibetrag)
  const bemessungsgrundlage = nachTeilfreistellung - durchFreibetrag

  /*
    Die Kirchensteuer mindert ihre eigene Bemessungsgrundlage.

    Deshalb `/ (4 + k)` und nicht `× 0,25`. Wer stattdessen 25 Prozent nimmt und
    die Kirchensteuer obendrauf schlägt, kommt auf 28,375 statt 27,99 Prozent –
    ein Fehler, der klein aussieht und in jeder Zeile wiederkehrt.
  */
  const kapitalertragsteuer = bemessungsgrundlage / (4 + k)
  const solidaritaetszuschlag = kapitalertragsteuer * SOLIDARITAETSZUSCHLAG
  const kirchensteuer = kapitalertragsteuer * k
  const steuerGesamt = kapitalertragsteuer + solidaritaetszuschlag + kirchensteuer

  return {
    teilfreigestellt,
    durchFreibetrag,
    bemessungsgrundlage,
    kapitalertragsteuer,
    solidaritaetszuschlag,
    kirchensteuer,
    steuerGesamt,
    nettoertrag: ertrag - steuerGesamt,
    effektiverSatz: ertrag > 0 ? steuerGesamt / ertrag : 0,
    freibetragRest: freibetrag - durchFreibetrag,
  }
}

export interface Vorabannahmen {
  /** Rücknahmepreis zu Beginn des Jahres, in Euro. */
  wertJahresbeginn: number
  /** Rücknahmepreis am Ende des Jahres, in Euro. */
  wertJahresende: number
  /** Ausschüttungen des Jahres, in Euro. Bei thesaurierenden Fonds null. */
  ausschuettung: number
  /** Basiszins des Jahres als Dezimalzahl, vom Bundesfinanzministerium. */
  basiszins: number
}

export interface Vorabergebnis {
  /** Wert zu Jahresbeginn mal Basiszins mal 0,7. */
  basisertrag: number
  /** Der Wertzuwachs des Jahres – die Obergrenze für den Basisertrag. */
  wertzuwachs: number
  /** Basisertrag nach der Begrenzung auf den Wertzuwachs. */
  begrenzterBasisertrag: number
  /** Was nach Abzug der Ausschüttungen als Vorabpauschale gilt. */
  vorabpauschale: number
  /** Warum die Vorabpauschale null ist, falls sie es ist. */
  grund: 'wertverlust' | 'ausschuettungGedeckt' | null
}

/**
 * Die Vorabpauschale nach § 18 Investmentsteuergesetz.
 *
 * ## Wozu es sie gibt
 *
 * Ein thesaurierender Fonds schüttet nichts aus – ohne Vorabpauschale bliebe
 * er bis zum Verkauf unversteuert, ein ausschüttender nicht. Die
 * Vorabpauschale besteuert deshalb jährlich einen Mindestbetrag, damit beide
 * gleich behandelt werden. Sie ist keine zusätzliche Steuer: Beim Verkauf wird
 * alles, was bereits als Vorabpauschale versteuert wurde, vom Gewinn abgezogen.
 *
 * ## Die drei Regeln, an denen die meisten hängen bleiben
 *
 * 1. Der Basisertrag ist **70 Prozent** des Basiszinses auf den Wert zu
 *    Jahresbeginn – nicht der volle Zins.
 * 2. Er ist **auf den Wertzuwachs des Jahres begrenzt**. Ist der Fonds gefallen,
 *    gibt es keine Vorabpauschale.
 * 3. Ausschüttungen werden **abgezogen**. Wer genug ausgeschüttet bekommen hat,
 *    zahlt keine.
 *
 * ## Offen seit dem 6. September 2026: zählt die Ausschüttung in den Deckel?
 *
 * Aufgefallen bei der Turnus-Durchsicht `rechner`, beim Nachrechnen von Hand.
 * Regel 2 und Regel 3 greifen ineinander, und es gibt zwei Lesarten:
 *
 *     A (so rechnet der Code)   Deckel = Wertende − Wertbeginn
 *     B                         Deckel = Wertende − Wertbeginn + Ausschüttungen
 *
 * Für einen **thesaurierenden** Fonds sind beide gleich – ohne Ausschüttung
 * gibt es keinen Unterschied, und das ist der Fall, für den dieser Rechner
 * meistens benutzt wird.
 *
 * Für einen **ausschüttenden** trennen sie sich, und zwar messbar. Wert
 * 10.000 → 10.050, Ausschüttung 20 €, Basiszins 3,20 %:
 *
 *     Basisertrag              224,00 €   (10.000 × 3,20 % × 0,7)
 *     Deckel nach A                50,00 €  →  Vorabpauschale  30,00 €
 *     Deckel nach B                70,00 €  →  Vorabpauschale  50,00 €
 *
 * Lesart A gibt die **niedrigere** Vorabpauschale aus. Ein Rechner, der zu
 * wenig Steuer ausweist, ist die unangenehmere Richtung des Irrtums.
 *
 * **Entschieden wird das nicht hier, sondern am Gesetzestext** – § 18 Absatz 1
 * InvStG, der Satz zur Begrenzung des Basisertrags. Aus dieser Umgebung ist
 * `gesetze-im-internet.de` nicht erreichbar (siehe `data/stichtagswerte.ts`);
 * vom Rechner des Betreibers aus war es das am 5. September sehr wohl. Wer
 * dort das nächste Mal nachsieht, klärt bitte diesen einen Satz mit.
 *
 * Bis dahin bleibt der Code, wie er ist: Die Durchsicht vom 6. September hat
 * die Rechnung gegen die **hier angegebene** Methodik geprüft, und die stimmt
 * mit ihr überein. Geändert wird eine Formel nicht auf eine Erinnerung hin.
 */
export function berechneVorabpauschale(annahmen: Vorabannahmen): Vorabergebnis {
  const wertBeginn = Math.max(annahmen.wertJahresbeginn, 0)
  const wertEnde = Math.max(annahmen.wertJahresende, 0)
  const ausschuettung = Math.max(annahmen.ausschuettung, 0)
  const basiszins = Math.max(annahmen.basiszins, 0)

  const basisertrag = wertBeginn * basiszins * 0.7
  const wertzuwachs = Math.max(wertEnde - wertBeginn, 0)
  const begrenzterBasisertrag = Math.min(basisertrag, wertzuwachs)
  const vorabpauschale = Math.max(begrenzterBasisertrag - ausschuettung, 0)

  let grund: Vorabergebnis['grund'] = null
  if (vorabpauschale === 0) {
    grund = wertzuwachs <= 0 ? 'wertverlust' : 'ausschuettungGedeckt'
  }

  return { basisertrag, wertzuwachs, begrenzterBasisertrag, vorabpauschale, grund }
}
