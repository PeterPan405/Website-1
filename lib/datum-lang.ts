/**
 * Ein ISO-Datum als deutscher Langtext: `2026-08-09` → `9. August 2026`.
 *
 * ## Warum eine eigene Datei
 *
 * Die Funktion stand in `lib/instagram-bild.tsx`, und dort kommt sie für einen
 * zweiten Leser nicht mehr heraus: Die Datei enthält JSX, und Node lädt sie
 * nicht – das Type-Stripping entfernt Typen, übersetzt aber kein JSX. Ein
 * Skript, das dieselbe Schreibweise braucht, hätte sie nachbauen müssen.
 *
 * Gebraucht wird sie an genau zwei Stellen, und die müssen zusammenpassen:
 *
 * - `app/instagram/beschriftung.txt/route.ts` **schreibt** die erste Zeile
 *   der Beschriftung, „9. August 2026 – das Marktupdate von IM Invests."
 * - `scripts/instagram-veroeffentlichen.ts` **liest** sie wieder und prüft
 *   damit, ob auf der Website schon die Ausgabe des Tages steht.
 *
 * Liefen die beiden auseinander, bekäme der Riegel ein Datum, das er nie
 * wiedererkennt – und hielte jeden Beitrag zurück oder ließe jeden durch.
 *
 * ## Ohne `new Date`
 *
 * Aus demselben Grund wie `tagVon()` in `lib/news.ts`: `new Date('2026-08-09')`
 * liest UTC, gibt aber in Ortszeit zurück. Wer westlich von Greenwich sitzt,
 * bekommt den Vortag. Die Zeichenkette wird deshalb zerlegt, nicht geparst.
 *
 * Nicht zu verwechseln mit dem gleichnamigen `datumLang` in
 * `scripts/nachrichten-aus-bestand.ts`: Das schreibt `9.8.2026` und ist eine
 * andere Funktion mit demselben Namen, keine Doppelung dieser hier.
 */
const MONATE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const

/** `2026-08-09` → `9. August 2026`. Unlesbares kommt unverändert zurück. */
export function datumLang(iso: string): string {
  const [jahr, monat, tag] = iso.split('-')
  const name = MONATE[Number(monat) - 1]
  if (!jahr || !name || !tag) return iso
  return `${Number(tag)}. ${name} ${jahr}`
}
