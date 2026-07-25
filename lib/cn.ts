/**
 * Fügt Klassennamen zusammen und wirft falsche Werte weg.
 *
 * Bewusst minimal – die Website braucht kein Merge-Verhalten für
 * widersprüchliche Tailwind-Klassen, sondern nur bedingte Klassen.
 */
export function cn(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ')
}
