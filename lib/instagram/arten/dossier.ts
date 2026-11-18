/**
 * Das Dossier (17.11.2026, Betreiber: „zu Silber mal mehrere Seiten … wo
 * stehen wir, wo war das Top, wie tief … und die Anwendungsbereiche“): ein
 * Karussell aus Teilkarten verschiedener Arten, je Seite eine einseitige
 * Art. Die erste Teilkarte trägt den großen Titel; ab Seite 2 wird der
 * Titel der Teilkarte zur kleinen Überschrift.
 */
import type { NeueKarte } from './index.ts'
import type { Element } from './rahmen.ts'
import { pruefeGemeinsam, type Art, type NeuGemeinsam } from './rahmen.ts'

export interface Dossierkarte extends NeuGemeinsam {
  art: 'dossier'
  /** Einseitige Teilkarten; Datum und Fußzeile dürfen eigene sein. */
  teile: Exclude<NeueKarte, Dossierkarte>[]
}

/** Wird von index.ts gesetzt, damit dieses Modul das Register nicht importiert. */
export const DOSSIER_ARTEN: Record<string, Art<never>> = {}

export const dossier: Art<Dossierkarte> = {
  seiten: (k) => k.teile.length,
  seite(k, logo, nr): Element {
    const t = k.teile[nr - 1]
    const art = DOSSIER_ARTEN[t.art] as unknown as Art<typeof t>
    return art.seite(
      { ...t, _dossier: { seite: nr, seiten: k.teile.length } } as unknown as typeof t,
      logo,
      1
    )
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    /*
      Bis sieben (19.11.2026, GTA V gegen GTA VI: Übersicht und sechs Werte,
      Vorbild mit sieben Kacheln, Auftrag des Betreibers). Instagram nimmt
      zwanzig; mehr als sieben ist für die Zahlenkarte zu viel Inhalt.
    */
    if (k.teile.length < 2 || k.teile.length > 7)
      f.push(`${k.teile.length} Teile – zwei bis sieben.`)
    for (const [i, t] of k.teile.entries()) {
      const art = DOSSIER_ARTEN[t.art] as unknown as Art<typeof t> | undefined
      if (!art) {
        f.push(`Teil ${i + 1}: Art „${t.art}“ ist keine neue Art.`)
        continue
      }
      if ((t.art as string) === 'dossier')
        f.push(`Teil ${i + 1}: kein Dossier im Dossier.`)
      else if (art.seiten(t) !== 1)
        f.push(`Teil ${i + 1}: „${t.art}“ hat mehr als eine Seite.`)
      f.push(...art.pruefe(t).map((x) => `Teil ${i + 1}: ${x}`))
    }
    return f
  },
}
