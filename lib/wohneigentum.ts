/**
 * Die Wohneigentumsquoten aus Eurostats JSON-stat lesen.
 *
 * ## Warum das Auswerten hier steht und nicht im Abrufskript
 *
 * Weil `scripts/laender-abrufen.ts` beim Laden sofort `main()` aufruft – wer
 * es importiert, startet einen vollständigen Abruf. Eine Auswertung, die sich
 * nur über das Netz prüfen lässt, ist in dieser Umgebung gar nicht prüfbar:
 * Sie erreicht ausser GitHub nichts.
 *
 * Getrennt ist beides prüfbar. `tests/wohneigentum.test.ts` legt dieser
 * Funktion die **echte Antwort** vor, die ein Läufer am 16. September 2026
 * geholt hat, und sieht nach, ob dieselben Zahlen herauskommen. Dieselbe
 * Bauart wie `lib/pruefvergleich.ts` und `lib/tageswecker.ts`: Die Tatsachen
 * holt der eine Teil, die Auswertung macht der andere.
 *
 * ## Was JSON-stat ist, in drei Sätzen
 *
 * `value` ist eine **flache** Liste aller Zellen. Welche Zelle zu welchem Land
 * gehört, ergibt sich aus der Reihenfolge der Dimensionen in `id`, ihren
 * Grössen in `size` und dem Index der Ausprägung in
 * `dimension.<name>.category.index`. Eine Abfrage, die alle Dimensionen ausser
 * `geo` auf einen einzigen Wert festlegt, macht die Rechnung trivial – **aber
 * nur, solange sie das wirklich tut.**
 */

/** Ein Wert, so wie ihn die Momentaufnahme führt. */
export interface Wohneigentumswert {
  wert: number
  jahr: number
}

/**
 * Eurostat schreibt zwei Ländercodes anders als die ISO-Norm.
 *
 * `EL` statt `GR` für Griechenland und `UK` statt `GB` für das Vereinigte
 * Königreich – alte Gepflogenheiten der EU-Statistik, keine Fehler. Der Rest
 * dieses Projekts arbeitet mit ISO-Codes; ohne die Umschlüsselung fiele
 * Griechenland stillschweigend aus der Karte, und niemand würde es merken:
 * Ein fehlendes Land sieht aus wie ein Land ohne Daten.
 */
export const EUROSTAT_ISO: Record<string, string> = { EL: 'GR', UK: 'GB' }

/** Die Gestalt, in der Eurostat antwortet – nur die gelesenen Teile. */
export interface JsonStat {
  id?: string[]
  size?: number[]
  dimension?: Record<string, { category?: { index?: Record<string, number> } }>
  value?: Record<string, number>
}

export interface Auswertung {
  /** Alpha-2-Code nach ISO → Quote und Jahr. Leer, wenn etwas nicht stimmt. */
  werte: Map<string, Wohneigentumswert>
  /** Warum nichts herauskam – `null`, wenn alles in Ordnung war. */
  beanstandung: string | null
}

const LEER = (grund: string): Auswertung => ({ werte: new Map(), beanstandung: grund })

/**
 * Aus der Antwort die Quoten je Land holen.
 *
 * Fünf Gründe, aus denen nichts zurückkommt – und jeder einzelne wird benannt,
 * statt als leeres Ergebnis durchzugehen. Ein Abruf, der still nichts liefert,
 * ist der teure Fehler: Die Karte bliebe grau, der Lauf grün.
 */
export function wohneigentumAusJsonStat(daten: JsonStat): Auswertung {
  const id = daten.id ?? []
  const size = daten.size ?? []
  const geoPos = id.indexOf('geo')
  const geoIndex = daten.dimension?.geo?.category?.index
  const zeitIndex = daten.dimension?.time?.category?.index

  if (geoPos < 0 || !geoIndex || !zeitIndex || !daten.value) {
    return LEER('Die Antwort hat nicht die erwartete Gestalt (id, dimension, value).')
  }

  /*
    Jede Dimension ausser `geo` muss auf genau eine Ausprägung gefiltert sein.

    Ohne diese Prüfung läse die Rechnung unten stillschweigend die falschen
    Zellen: Käme `tenure` mit sieben Ausprägungen zurück, stünde bei jedem Land
    irgendein Wert – plausibel aussehend, mit Nachkommastelle, und falsch. Das
    ist die Art Fehler, die niemand mehr findet.
  */
  const mehrdeutig = id.filter((name, i) => name !== 'geo' && (size[i] ?? 0) !== 1)
  if (mehrdeutig.length > 0) {
    return LEER(
      `Mehrere Ausprägungen bei ${mehrdeutig.join(', ')} – die Zuordnung wäre geraten.`
    )
  }

  const jahr = Number(Object.keys(zeitIndex)[0])
  if (!Number.isFinite(jahr)) return LEER('Die Antwort nennt kein auswertbares Jahr.')

  /* Der Abstand zwischen zwei Ländern in der flachen Liste. */
  let schritt = 1
  for (let i = geoPos + 1; i < size.length; i++) schritt *= size[i] ?? 1

  const werte = new Map<string, Wohneigentumswert>()
  for (const [code, position] of Object.entries(geoIndex)) {
    /*
      Aggregate sind keine Länder.

      `EU27_2020`, `EA20`, `EA21` stehen in derselben Liste wie Belgien und
      Bulgarien. Auf einer Karte haben sie keinen Platz – es gibt kein Gebiet,
      das man einfärben könnte –, und in einer Rangliste wären sie eine
      Doppelzählung. Erkennbar sind sie an der Länge: Ein Ländercode hat zwei
      Zeichen.
    */
    if (code.length !== 2) continue

    const wert = daten.value[String(position * schritt)]
    if (typeof wert !== 'number' || !Number.isFinite(wert)) continue
    /* Eine Quote ausserhalb von 0 bis 100 ist keine Quote. */
    if (wert < 0 || wert > 100) continue

    werte.set(EUROSTAT_ISO[code] ?? code, {
      wert: Math.round(wert * 10) / 10,
      jahr,
    })
  }

  if (werte.size === 0) {
    return LEER(
      `Kein einziger brauchbarer Wert bei ${Object.keys(geoIndex).length} Gebieten.`
    )
  }

  return { werte, beanstandung: null }
}
