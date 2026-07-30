/**
 * Der Tag in Zahlen – gerechnet, nicht geschrieben.
 *
 * ## Warum das kein Nachrichtentext ist
 *
 * Die Nachrichten dieser Website entstehen aus Recherche: echte Meldungen,
 * benannte Quellen, jede Zahl nachprüfbar. Das ist aufwendig und deshalb
 * täglich, nicht halbstündlich.
 *
 * Dieser Bericht ist etwas anderes und soll auch so aussehen. Er behauptet
 * nichts über Ursachen, nennt keine Gründe und deutet nichts – er zählt. Wie
 * viele Titel im Plus stehen, welche Branche vorn liegt, wie breit eine
 * Bewegung getragen ist. Alles davon steckt bereits in den Kursen; hier wird
 * es nur addiert.
 *
 * Der Vorteil: Es kann nichts falsch werden, was nicht schon in den Kursen
 * falsch ist. Kein „wegen der Zinsentscheidung“, das niemand belegen kann.
 *
 * ## Warum die Breite die interessanteste Zahl ist
 *
 * Ein Index kann steigen, weil alles steigt – oder weil drei schwere Werte
 * steigen und der Rest fällt. Beides sieht am Indexstand gleich aus und
 * bedeutet Verschiedenes. Das Verhältnis von steigenden zu fallenden Titeln
 * beantwortet genau diese Frage, und es steht sonst nirgends auf dieser
 * Website.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

/** Ein Titel, so weit der Bericht ihn braucht. */
export interface Berichtsposten {
  symbol: string
  ticker: string
  name: string
  /** Tagesveränderung in Prozent. */
  veraenderung: number
  /** Branche, oder `null`. */
  branche: string | null
}

export interface Branchenbewegung {
  name: string
  /** Ungewichteter Mittelwert der Tagesveränderungen, in Prozent. */
  schnitt: number
  titel: number
}

export interface Marktbericht {
  /** Wie viele Titel ausgewertet wurden. */
  titel: number
  steigend: number
  fallend: number
  unveraendert: number
  /**
   * Wie breit die Bewegung getragen ist, in Prozent.
   *
   * Der Anteil der Titel, die sich in die Richtung des Gesamtschnitts bewegt
   * haben. Bei 50 Prozent ist der Markt geteilt, bei 90 zieht fast alles
   * mit – und ein Indexstand allein verrät diesen Unterschied nicht.
   */
  breiteProzent: number
  /** Ungewichteter Mittelwert über alle Titel, in Prozent. */
  schnitt: number
  /** Die drei stärksten Branchen, beste zuerst. */
  starkeBranchen: Branchenbewegung[]
  /** Die drei schwächsten, schlechteste zuerst. */
  schwacheBranchen: Branchenbewegung[]
  /** Die fünf größten Tagesgewinne. */
  gewinner: Berichtsposten[]
  /** Die fünf größten Tagesverluste. */
  verlierer: Berichtsposten[]
}

/** Ab wie vielen Titeln eine Branche im Bericht auftaucht. */
const MINDESTZAHL_BRANCHE = 4

/**
 * Wertet den Tag aus.
 *
 * Alle Mittelwerte sind **ungewichtet**: Jede Aktie zählt gleich, unabhängig
 * von ihrem Börsenwert. Nach Börsenwert gewichtet wäre der Schnitt der
 * Halbleiter praktisch der Nvidia-Kurs und sagte nichts über die Branche.
 * Prozentzahlen lassen sich außerdem über Währungen hinweg mitteln, Beträge
 * nicht – und dieser Katalog führt Titel in dreißig Währungen.
 */
export function baueMarktbericht(posten: readonly Berichtsposten[]): Marktbericht | null {
  const gueltig = posten.filter((eintrag) => Number.isFinite(eintrag.veraenderung))
  if (gueltig.length === 0) return null

  const steigend = gueltig.filter((eintrag) => eintrag.veraenderung > 0).length
  const fallend = gueltig.filter((eintrag) => eintrag.veraenderung < 0).length
  const schnitt =
    gueltig.reduce((summe, eintrag) => summe + eintrag.veraenderung, 0) / gueltig.length

  /*
    Die Breite misst gegen die Richtung des Gesamtschnitts, nicht gegen null.
    An einem Tag, an dem der Markt insgesamt fällt, ist „wie viele fallen mit“
    die Frage – nicht „wie viele steigen“.
  */
  const mitDerRichtung = schnitt >= 0 ? steigend : fallend
  const bewegt = steigend + fallend

  const nachBranche = new Map<string, number[]>()
  for (const eintrag of gueltig) {
    if (!eintrag.branche) continue
    const liste = nachBranche.get(eintrag.branche)
    if (liste) liste.push(eintrag.veraenderung)
    else nachBranche.set(eintrag.branche, [eintrag.veraenderung])
  }

  const branchen: Branchenbewegung[] = [...nachBranche.entries()]
    .filter(([, werte]) => werte.length >= MINDESTZAHL_BRANCHE)
    .map(([name, werte]) => ({
      name,
      schnitt: werte.reduce((summe, wert) => summe + wert, 0) / werte.length,
      titel: werte.length,
    }))
    /*
      Bei gleichem Schnitt entscheidet der Name. Ohne diesen zweiten Schlüssel
      hinge die Reihenfolge an der Aufzählung des Katalogs und spränge, sobald
      eine Aktie dazukommt – bei einer Seite, die sich alle dreißig Minuten neu
      baut, wäre das ein Diff ohne Anlass.
    */
    .sort((a, b) => b.schnitt - a.schnitt || a.name.localeCompare(b.name, 'de'))

  const sortiert = [...gueltig].sort(
    (a, b) => b.veraenderung - a.veraenderung || a.ticker.localeCompare(b.ticker)
  )

  return {
    titel: gueltig.length,
    steigend,
    fallend,
    unveraendert: gueltig.length - bewegt,
    breiteProzent: bewegt > 0 ? (mitDerRichtung / bewegt) * 100 : 0,
    schnitt,
    starkeBranchen: branchen.slice(0, 3),
    schwacheBranchen: branchen.slice(-3).reverse(),
    gewinner: sortiert.slice(0, 5),
    verlierer: sortiert.slice(-5).reverse(),
  }
}

/**
 * Ein Satz zur Lage – aus Zahlen zusammengesetzt, ohne Deutung.
 *
 * Bewusst ohne Ursachenbehauptung. „Der Markt fiel wegen der Zinsentscheidung“
 * wäre eine Aussage, die dieses Modul nicht belegen kann; „612 von 1.029
 * Titeln stiegen“ ist eine, die es zählen kann.
 */
export function lagesatz(bericht: Marktbericht): string {
  const richtung = bericht.schnitt >= 0 ? 'stiegen' : 'fielen'
  const anzahl = bericht.schnitt >= 0 ? bericht.steigend : bericht.fallend
  const breite =
    bericht.breiteProzent >= 75
      ? 'Die Bewegung geht breit durch den Markt'
      : bericht.breiteProzent >= 55
        ? 'Die Bewegung ist mehrheitlich getragen'
        : 'Der Markt ist geteilt'

  return `${anzahl} von ${bericht.titel} Titeln ${richtung}. ${breite}.`
}
