import { realRatePercent } from '@/lib/finance'

/**
 * Der Entnahmeplan: wie lange ein Kapital trägt, aus dem gelebt wird.
 *
 * ## Die Lücke, die das schließt
 *
 * `rentenrechner` und `rentenluecke` rechnen **bis** zum Ruhestand: Wie viel
 * muss zusammenkommen? Was danach passiert, rechnete bisher nichts – dabei ist
 * das die Frage, die sich am Tag der letzten Gehaltszahlung stellt und die für
 * den Rest des Lebens gilt.
 *
 * ## Gerechnet wird in heutiger Kaufkraft
 *
 * Das ist die eine Entscheidung, an der die meisten Entnahmerechner
 * vorbeigehen: Sie nehmen eine feste Entnahme in Euro und lassen sie dreißig
 * Jahre lang gleich. Damit rechnen sie eine Kürzung ein, die niemand
 * beschlossen hat – bei zwei Prozent Inflation sind 2.000 € nach dreißig
 * Jahren noch 1.104 € wert, und die Reichweite fällt entsprechend zu
 * freundlich aus.
 *
 * Hier steigt die Entnahme jedes Jahr mit der Inflation. Innen wird deshalb
 * durchgehend real gerechnet: eine gleichbleibende Entnahme zum **Realzins**
 * `(1+nominal)/(1+inflation) − 1`. Beides ist dieselbe Rechnung; die reale ist
 * die, in der die Zahlen bedeuten, was sie zu bedeuten scheinen. Die nominalen
 * Beträge kommen im Verlauf trotzdem vor – sie zeigen, was aus der Entnahme
 * bis zum Ende wird, und diese Zahl überrascht die meisten.
 *
 * ## Die Reihenfolge im Jahr
 *
 * Erst die Rendite, dann die Entnahme – dieselbe Reihenfolge wie in
 * `lib/sequenzrisiko.ts`, dessen Verlauf auf derselben Seite steht. Zwei
 * Konventionen nebeneinander ergäben zwei Zahlen, die sich nicht vergleichen
 * lassen, und niemand sähe, woran der Unterschied liegt.
 *
 * Sie ist die **freundlichere** der beiden üblichen: Wer monatlich entnimmt,
 * nimmt im Schnitt ein halbes Jahr früher heraus als hier gerechnet. Das steht
 * bei den Grenzen des Rechners, und bei einer Reichweite von dreißig Jahren
 * kostet es etwa ein halbes bis ein Jahr.
 *
 * ## Was hier nicht steht
 *
 * Steuern. Die Abgeltungsteuer fällt in der Entnahmephase auf den
 * Gewinnanteil jedes verkauften Anteils an, und wie hoch der ist, hängt vom
 * Einstandskurs ab – einer Größe, die dieser Rechner nicht kennt und nicht
 * raten sollte. Der Steuerrechner rechnet das für einen einzelnen Verkauf.
 */

/** Die Eingaben eines Entnahmeplans. */
export interface Entnahmeeingabe {
  /** Verfügbares Kapital zu Beginn. */
  kapital: number
  /** Gewünschte Entnahme je Monat, in **heutiger** Kaufkraft. */
  entnahmeProMonat: number
  /** Erwartete nominale Rendite je Jahr, in Prozent. */
  renditeProzent: number
  /** Erwartete Inflationsrate je Jahr, in Prozent. */
  inflationProzent: number
  /** Wie lange der Plan tragen soll, in Jahren. */
  zieldauerJahre: number
}

/** Ein Jahr im Verlauf – real und nominal nebeneinander. */
export interface Entnahmejahr {
  jahr: number
  /** Depotwert am Jahresanfang, in heutiger Kaufkraft. */
  startwert: number
  /** Die Entnahme dieses Jahres, in heutiger Kaufkraft – konstant. */
  entnahme: number
  /** Dieselbe Entnahme in den Euro dieses Jahres. */
  entnahmeNominal: number
  /** Depotwert am Jahresende, in heutiger Kaufkraft. */
  endwert: number
  /** Derselbe Endwert in den Euro dieses Jahres. */
  endwertNominal: number
}

export interface Entnahmeergebnis {
  verlauf: Entnahmejahr[]
  /**
   * Nach wie vielen Jahren das Kapital aufgebraucht ist.
   *
   * `null` heißt **nicht** „trägt ewig", sondern nur: innerhalb von
   * `MAX_JAHRE` nicht aufgebraucht. Ob es dauerhaft trägt, sagt `dauerhaft` –
   * und das ist ein anderer Befund. Beides in ein Feld zu legen wäre die
   * bequeme Variante und würde „reicht 61 Jahre" und „reicht immer" zu
   * derselben Zahl machen.
   */
  reichweiteJahre: number | null
  /**
   * Trägt der Plan dauerhaft?
   *
   * Geprüft an der Sache, nicht am Ende der Schleife: Bleibt die Entnahme
   * unter dem realen Ertrag des Kapitals, wächst das Depot trotz Entnahme.
   */
  dauerhaft: boolean
  /** Trägt der Plan die gewünschte Dauer? */
  zieldauerGedeckt: boolean
  /** Was am Ende der Zieldauer übrig ist, in heutiger Kaufkraft. */
  restKapital: number
  realzinsProzent: number
  /** Entnahme des ersten Jahres in Prozent des Kapitals – die „Entnahmequote". */
  entnahmequoteProzent: number
  /**
   * Was sich **dauerhaft** entnehmen ließe, ohne das Kapital zu verringern.
   * Bei negativem Realzins null: Dann trägt kein Betrag dauerhaft.
   */
  dauerhaftProMonat: number
  /** Was sich über die Zieldauer entnehmen ließe, wenn am Ende null bleibt. */
  fuerZieldauerProMonat: number
}

/**
 * Die Entnahme, die ein Kapital über N Jahre trägt und dann auf null endet.
 *
 * Die Rentenformel, nachschüssig – dieselbe Reihenfolge im Jahr wie im
 * Verlauf. Bei einem Realzins nahe null geht sie in die Division auf: Ohne
 * Ertrag ist es schlicht das Kapital durch die Jahre.
 *
 * Bei **negativem** Realzins bleibt sie gültig und liefert weniger als
 * Kapital ÷ Jahre. Das ist kein Sonderfall, sondern der Normalfall in einer
 * Phase, in der die Inflation über der Rendite liegt.
 */
export function entnahmeFuerDauer(
  kapital: number,
  jahre: number,
  realzinsProzent: number
): number {
  if (jahre <= 0 || kapital <= 0) return 0

  const r = realzinsProzent / 100
  if (Math.abs(r) < 1e-9) return kapital / jahre

  const faktor = (1 + r) ** jahre
  return (kapital * r * faktor) / (faktor - 1)
}

/**
 * Die Entnahme, die ein Kapital dauerhaft trägt.
 *
 * Der reale Ertrag und nichts darüber. Bei negativem Realzins gibt es sie
 * nicht – dann verliert das Kapital auch ohne jede Entnahme an Kaufkraft, und
 * eine Zahl größer null wäre eine Behauptung, die die Rechnung nicht deckt.
 */
export function dauerhafteEntnahme(kapital: number, realzinsProzent: number): number {
  const r = realzinsProzent / 100
  if (r <= 0 || kapital <= 0) return 0
  return kapital * r
}

/**
 * Obergrenze der Rechnung in Jahren.
 *
 * Nicht als Rechenschutz gedacht, sondern als Aussagegrenze: Wer mit 65 in
 * Rente geht, plant nicht über hundert. Ein Verlauf, der bei sehr kleiner
 * Entnahme über Jahrhunderte liefe, wäre außerdem eine Tabelle, die niemand
 * liest – der Fall „trägt dauerhaft" wird ohnehin eigens erkannt und
 * benannt.
 */
export const MAX_JAHRE = 60

/**
 * Der ganze Plan: Verlauf, Reichweite und die beiden Vergleichsbeträge.
 *
 * Der Verlauf läuft bis zur Erschöpfung, längstens bis `MAX_JAHRE` – und
 * mindestens über die Zieldauer, damit die Tabelle die Frage beantwortet, die
 * eingegeben wurde.
 */
export function entnahmeplan(eingabe: Entnahmeeingabe): Entnahmeergebnis {
  const realzinsProzent = realRatePercent(
    eingabe.renditeProzent,
    eingabe.inflationProzent
  )
  const r = realzinsProzent / 100
  const entnahmeJahr = eingabe.entnahmeProMonat * 12
  const inflation = 1 + eingabe.inflationProzent / 100

  const zieldauer = Math.max(1, Math.round(eingabe.zieldauerJahre))

  /*
    Gerechnet wird bis `MAX_JAHRE`, nicht bis zur Zieldauer.

    Sonst stünde bei einer Zieldauer von 30 Jahren und einer Reichweite von 45
    „nicht aufgebraucht" – richtig für die gestellte Frage, aber die
    Reichweite wäre verloren, und genau danach ist dieser Rechner benannt.
  */
  const verlauf: Entnahmejahr[] = []
  let wert = Math.max(0, eingabe.kapital)
  let reichweiteJahre: number | null = null

  for (let jahr = 1; jahr <= MAX_JAHRE; jahr += 1) {
    const startwert = wert

    wert *= 1 + r
    const entnahme = Math.min(entnahmeJahr, Math.max(wert, 0))
    wert -= entnahme

    if (wert <= 0 && reichweiteJahre === null) {
      wert = 0
      reichweiteJahre = jahr
    }

    /*
      Die nominalen Beträge sind die realen mal der aufgelaufenen Inflation.

      Sie werden nicht zweitgerechnet, sondern umgerechnet – eine zweite
      Rechnung könnte von der ersten abweichen, und zwei Zahlen für dieselbe
      Sache sind die Sorte Fehler, die niemand findet, weil beide für sich
      plausibel aussehen.
    */
    const teuerung = inflation ** jahr

    verlauf.push({
      jahr,
      startwert,
      entnahme,
      entnahmeNominal: entnahme * teuerung,
      endwert: wert,
      endwertNominal: wert * teuerung,
    })

    if (reichweiteJahre !== null) break
  }

  const dauerhaftBetrag = dauerhafteEntnahme(eingabe.kapital, realzinsProzent)

  const bisZieldauer = verlauf.find((j) => j.jahr === zieldauer)
  const restKapital = bisZieldauer ? bisZieldauer.endwert : (verlauf.at(-1)?.endwert ?? 0)

  return {
    verlauf,
    reichweiteJahre,
    dauerhaft: eingabe.kapital > 0 && entnahmeJahr <= dauerhaftBetrag,
    zieldauerGedeckt: reichweiteJahre === null || reichweiteJahre > zieldauer,
    restKapital,
    realzinsProzent,
    entnahmequoteProzent:
      eingabe.kapital > 0 ? (entnahmeJahr / eingabe.kapital) * 100 : 0,
    dauerhaftProMonat: dauerhaftBetrag / 12,
    fuerZieldauerProMonat:
      entnahmeFuerDauer(eingabe.kapital, zieldauer, realzinsProzent) / 12,
  }
}
