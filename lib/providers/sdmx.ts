/**
 * Liest SDMX-JSON, das Format der Statistikschnittstellen von EZB und Bundesbank.
 *
 * ## Warum ein eigener Leser
 *
 * SDMX ist ein Format für Statistikämter, und man merkt es. Die Werte stehen
 * nicht bei ihren Zeitpunkten, sondern in zwei getrennten Bäumen: Unter
 * `dataSets[0].series[…].observations` liegen die Zahlen, indiziert mit „0“,
 * „1“, „2“ – und wofür diese Ziffern stehen, sagt erst
 * `structure.dimensions.observation[0].values[]` an ganz anderer Stelle.
 *
 * Wer die beiden falsch zusammenführt, bekommt richtige Zahlen mit falschen
 * Daten. Das fällt niemandem auf: Eine Inflationsrate von 2,1 Prozent sieht
 * für Mai so plausibel aus wie für Juni.
 *
 * ## Warum getrennt vom Abrufskript
 *
 * Weil sich das Zerlegen prüfen lässt und der Abruf nicht. Aus der
 * Entwicklungsumgebung dieses Projekts ist die EZB ohnehin nicht erreichbar –
 * ein Test gegen die Schnittstelle sagte nur, ob der Proxy gerade
 * durchlässt. Ein Test gegen einen echten Antwortausschnitt sagt, ob dieses
 * Modul ihn richtig liest.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

export interface Zeitreihenpunkt {
  /** Zeitpunkt, wie die Quelle ihn führt: `2026-06`, `2026-06-30` oder `2026`. */
  t: string
  wert: number
}

/** Die Struktur, so weit dieser Leser sie braucht. */
interface SdmxAntwort {
  dataSets?: {
    series?: Record<string, { observations?: Record<string, (number | null)[]> }>
    observations?: Record<string, (number | null)[]>
  }[]
  structure?: {
    dimensions?: {
      observation?: { id?: string; values?: { id?: string; name?: string }[] }[]
    }
  }
}

/**
 * Zerlegt eine SDMX-JSON-Antwort in eine Zeitreihe.
 *
 * Genommen wird die **erste** Serie. Eine Abfrage dieses Projekts fragt immer
 * genau eine Reihe ab; kämen mehrere zurück, wäre die Abfrage zu unscharf, und
 * stillschweigend die erste zu nehmen wäre dann ein Fehler mit Ansage. Deshalb
 * meldet `mehrereReihen` das.
 */
export function leseSdmx(roh: unknown): {
  punkte: Zeitreihenpunkt[]
  mehrereReihen: boolean
} {
  const antwort = roh as SdmxAntwort

  const zeitpunkte =
    antwort.structure?.dimensions?.observation
      ?.find((dimension) => dimension.id === 'TIME_PERIOD')
      ?.values?.map((wert) => wert.id ?? wert.name ?? '') ??
    /*
      Manche Antworten benennen die Zeitdimension nicht `TIME_PERIOD`. Dann
      gibt es genau eine Beobachtungsdimension, und das ist die Zeit – jede
      andere Lesart würde bedeuten, dass die Antwort gar keine Zeitreihe ist.
    */
    antwort.structure?.dimensions?.observation?.[0]?.values?.map(
      (wert) => wert.id ?? wert.name ?? ''
    ) ??
    []

  if (zeitpunkte.length === 0) return { punkte: [], mehrereReihen: false }

  const datensatz = antwort.dataSets?.[0]
  const serien = datensatz?.series
  const beobachtungen = serien
    ? Object.values(serien)[0]?.observations
    : datensatz?.observations

  if (!beobachtungen) return { punkte: [], mehrereReihen: false }

  const punkte: Zeitreihenpunkt[] = []
  for (const [index, werte] of Object.entries(beobachtungen)) {
    const zeitpunkt = zeitpunkte[Number(index)]
    const wert = Array.isArray(werte) ? werte[0] : null
    /*
      Fehlende Werte kommen als `null` zurück und werden übersprungen. Sie als
      Null zu lesen wäre der teuerste denkbare Fehler in einer Zinsreihe: Eine
      Inflationsrate von 0,0 Prozent ist eine Aussage, „keine Meldung“ ist
      keine.
    */
    if (!zeitpunkt || typeof wert !== 'number' || !Number.isFinite(wert)) continue
    punkte.push({ t: zeitpunkt, wert })
  }

  return {
    punkte: punkte.sort((a, b) => a.t.localeCompare(b.t)),
    mehrereReihen: Boolean(serien && Object.keys(serien).length > 1),
  }
}

/** Der jüngste Punkt einer Reihe, oder `null`. */
export function juengster(punkte: readonly Zeitreihenpunkt[]): Zeitreihenpunkt | null {
  return punkte.length > 0 ? punkte[punkte.length - 1] : null
}

/**
 * Der Wert zwölf Monate vor dem jüngsten, für den Jahresvergleich.
 *
 * Gesucht wird über den Zeitpunkt und nicht über die Position: In einer Reihe
 * mit Lücken wäre „zwölf Einträge zurück“ irgendein Monat.
 */
export function vorEinemJahr(punkte: readonly Zeitreihenpunkt[]): Zeitreihenpunkt | null {
  const letzter = juengster(punkte)
  if (!letzter) return null

  const [jahr, monat] = letzter.t.split('-')
  if (!jahr || !monat) return null
  const gesucht = `${Number(jahr) - 1}-${monat}`

  return punkte.find((punkt) => punkt.t.startsWith(gesucht)) ?? null
}
