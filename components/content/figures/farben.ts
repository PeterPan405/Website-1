/**
 * Die Farben der Lerngrafiken.
 *
 * ## Warum eigene Datei und nicht in `Diagramme.tsx`
 *
 * Dort standen sie bis zum 23. August 2026. Solange nur Zeichnungen sie
 * brauchten, war das richtig. Seit die Vorlesefassungen der Grafiken in reinem
 * TypeScript stehen müssen – `scripts/lese-texte-schreiben.ts` läuft unter
 * `node --experimental-strip-types` und kann keine `.tsx` laden –, ist es
 * das nicht mehr: Eine Kastenreihe, deren Beschriftungen gesprochen werden
 * sollen, trägt auch eine Farbe, und über die Farbe hing sie an einer `.tsx`.
 *
 * Diese Datei enthält deshalb nur Daten. `Diagramme.tsx` reicht sie weiter,
 * damit kein bestehender Import umgeschrieben werden muss.
 *
 * Es sind CSS-Variablen und keine festen Werte – daran hängt, dass eine
 * Grafik mit dem hellen und dunklen Schema mitwechselt, ohne dass es zwei
 * Fassungen bräuchte.
 */
export const FARBEN = {
  marke: 'var(--c-brand)',
  akzent: 'var(--c-accent)',
  gefahr: 'var(--c-danger)',
  warnung: 'var(--c-warning)',
  ruhig: 'var(--c-fg-subtle)',
  raster: 'var(--c-border)',
  flaeche: 'var(--c-surface-muted)',
} as const

export type Farbe = string
