/**
 * Geometrie für die Lerngrafiken.
 *
 * Die Diagramme im Lernbereich sind handgeschriebenes SVG, kein Bildmaterial:
 * Sie stehen im HTML, brauchen kein JavaScript, wachsen mit der Spaltenbreite
 * und übernehmen die Farben des Themes. Was ihnen fehlt, ist die Rechnung von
 * einem Datenwert auf eine Bildkoordinate – die steht hier.
 *
 * Ohne Importe, damit sich die Rechnung unter `tests/` direkt prüfen lässt –
 * dieselbe Aufteilung wie bei `lib/market-range.ts` und `lib/market-quote.ts`.
 * Der Anlass ist derselbe: Eine falsch skalierte Achse fällt in einer Grafik
 * nicht auf. Sie sieht plausibel aus und ist trotzdem falsch.
 */

/** Bildbereich einer Grafik in SVG-Koordinaten. */
export interface Plotflaeche {
  links: number
  oben: number
  breite: number
  hoehe: number
}

/**
 * Rechnet einen Datenwert auf eine x-Koordinate.
 *
 * `von`/`bis` ist der Wertebereich, nicht der Bildbereich – die Reihenfolge der
 * Argumente ist hier schon einmal verwechselt worden.
 */
export function skaliereX(
  wert: number,
  von: number,
  bis: number,
  flaeche: Plotflaeche
): number {
  if (bis === von) return flaeche.links
  return flaeche.links + ((wert - von) / (bis - von)) * flaeche.breite
}

/**
 * Rechnet einen Datenwert auf eine y-Koordinate.
 *
 * SVG zählt y von oben nach unten, Diagramme von unten nach oben. Der große
 * Wert liegt deshalb bei der *kleinen* Koordinate – das ist die Stelle, an der
 * eine Grafik lautlos auf dem Kopf steht.
 */
export function skaliereY(
  wert: number,
  von: number,
  bis: number,
  flaeche: Plotflaeche
): number {
  if (bis === von) return flaeche.oben + flaeche.hoehe
  return flaeche.oben + flaeche.hoehe - ((wert - von) / (bis - von)) * flaeche.hoehe
}

export interface Punkt {
  x: number
  y: number
}

/** Linienzug durch alle Punkte als `d`-Attribut. */
export function linienpfad(punkte: readonly Punkt[]): string {
  if (punkte.length === 0) return ''
  return punkte
    .map(
      (punkt, index) => `${index === 0 ? 'M' : 'L'}${runde(punkt.x)} ${runde(punkt.y)}`
    )
    .join(' ')
}

/**
 * Fläche unter einem Linienzug bis zur Grundlinie.
 *
 * Der Pfad wird geschlossen, sonst füllt der Browser die Lücke selbst – und
 * zwar auf dem kürzesten Weg, was bei einer gekrümmten Linie sichtbar falsch
 * aussieht.
 */
export function flaechenpfad(punkte: readonly Punkt[], grundlinie: number): string {
  if (punkte.length === 0) return ''
  const erster = punkte[0]
  const letzter = punkte[punkte.length - 1]
  return `${linienpfad(punkte)} L${runde(letzter.x)} ${runde(grundlinie)} L${runde(erster.x)} ${runde(grundlinie)} Z`
}

/**
 * Teilstriche von null bis mindestens `maximum`.
 *
 * Die Obergrenze wird auf einen runden Wert aufgerundet, damit an der Achse
 * „100.000“ steht und nicht „102.857“. Zurück kommen `anzahl + 1` Werte, weil
 * die Null mitzählt.
 */
export function teilstriche(maximum: number, anzahl = 4): number[] {
  if (maximum <= 0 || anzahl < 1) return [0]
  const roh = maximum / anzahl
  const groessenordnung = 10 ** Math.floor(Math.log10(roh))
  const schritt = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]
    .map((faktor) => faktor * groessenordnung)
    .find((kandidat) => kandidat * anzahl >= maximum)
  const gewaehlt = schritt ?? groessenordnung * 10
  return Array.from({ length: anzahl + 1 }, (_, index) => index * gewaehlt)
}

/** Zwei Nachkommastellen genügen im SVG und halten das HTML klein. */
function runde(wert: number): number {
  return Math.round(wert * 100) / 100
}
