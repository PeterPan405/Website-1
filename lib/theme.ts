/**
 * Die Konstanten des Farbschemas – für Server und Browser gemeinsam.
 *
 * ## Warum sie eine eigene Datei brauchen
 *
 * Sie standen in `components/layout/ThemeToggle.tsx`, und die Datei beginnt mit
 * `'use client'`. Das Layout ist eine Server-Komponente und hat den Schlüssel
 * von dort importiert – über diese Grenze kommt aber kein Wert, sondern ein
 * Platzhalter für den Browser.
 *
 * Im ausgelieferten HTML stand deshalb wörtlich:
 *
 *     var s = localStorage.getItem(undefined)
 *
 * Das ist gültiges JavaScript. Es liest den Schlüssel `"undefined"`, findet dort
 * nie etwas und gibt `null` zurück. Der Umschalter schrieb unter `fk-theme`, das
 * Startskript las unter `"undefined"` – die Wahl des Besuchers hat kein einziges
 * Neuladen überlebt, und weil das Skript ersatzweise der Systemeinstellung
 * folgte, sah es nach Absicht aus.
 *
 * Eine Datei ohne `'use client'` lässt sich von beiden Seiten importieren, und
 * der Wert ist auf beiden derselbe.
 */

/** Schlüssel im localStorage für die gewählte Darstellung. */
export const THEME_STORAGE_KEY = 'fk-theme'

/**
 * Die Farbe der Browserleiste je Darstellung – dieselben Werte wie `--c-canvas`.
 *
 * Sie stehen als Literale da, weil `<meta name="theme-color">` keine
 * CSS-Variable auflöst: Der Browser liest das Attribut, nicht das Stylesheet.
 * Ändert sich eine Canvas-Farbe in `app/globals.css`, gehören diese Werte
 * mitgeändert.
 *
 * **Und nicht nur sie.** Am `--c-canvas` des hellen Schemas hängt seit dem
 * 13. August 2026 auch das Symbol auf dem Homescreen:
 *
 *     python scripts/app-icon-faerben.py
 *
 * Das ist die Stelle, die man vergisst – eine Bilddatei sieht nicht aus wie
 * etwas, das von einer CSS-Variablen abhängt. `tests/app-icon.test.ts` fragt
 * deshalb nach.
 */
export const LEISTENFARBE = {
  weiss: '#f2ebdd',
  dark: '#0a0a0c',
} as const

/**
 * Das Startskript, das im `<head>` läuft – als Zeichenkette.
 *
 * ## Warum es hier steht und nicht im Layout
 *
 * Es stand bis zum 13. August 2026 als Literal in `app/layout.tsx`. Dort ließ
 * es sich nicht prüfen: Ein Test hätte den Quelltext der Layout-Datei einlesen
 * und das Skript per Regex herausschneiden müssen – eine Prüfung, die schon an
 * einer umgestellten Zeile scheitert und dann nicht den Fehler meldet, sondern
 * sich selbst.
 *
 * Als Funktion in einer Datei ohne `'use client'` ist es von beiden Seiten
 * importierbar – vom Layout, das es ausliefert, und von
 * `tests/farbschema-start.test.ts`, der es gegen eine nachgebaute Umgebung
 * laufen lässt. Genau deshalb gibt es diese Datei überhaupt (siehe oben).
 *
 * ## Was es tut
 *
 * 1. **Gespeicherte Wahl.** Nur `dark` schaltet um. Alles andere – `weiss` wie
 *    auch die Werte früherer Fassungen (`light`, `grau`) – ist Weiß.
 * 2. **Sonst Weiß.** Ausnahmslos, auch auf einem dunkel gestellten Gerät.
 *
 * Die Systemvorgabe stand bis zum 13. August 2026 zwischen beiden. Der
 * Betreiber hat sie an dem Tag gestrichen: **Der erste Besuch ist weiß.**
 *
 * Die Browserleiste wird nur bei gespeicherter Wahl nachgezogen – ohne sie
 * steht im `<head>` bereits die richtige, helle Farbe.
 *
 * `try/catch` um alles: `localStorage` wirft im privaten Modus mancher Browser
 * beim bloßen Zugriff. Ein Fehler hier bliebe unbehandelt im `<head>` stehen
 * und die Seite ganz ohne Farbschema.
 */
export function startSkript(): string {
  return `(function(){try{
var farben=${JSON.stringify(LEISTENFARBE)};
var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
var t=s==='dark'?'dark':'weiss';
document.documentElement.dataset.theme=t;
if(s){document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute('content',farben[t])})}
}catch(e){}})()`
}
