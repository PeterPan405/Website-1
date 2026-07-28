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
 * Die Farbe der Browserleiste je Modus – dieselben Werte wie `--c-canvas`.
 *
 * Sie stehen als Literale da, weil `<meta name="theme-color">` keine
 * CSS-Variable auflöst: Der Browser liest das Attribut, nicht das Stylesheet.
 * Ändert sich die Canvas-Farbe in `app/globals.css`, gehören diese beiden Werte
 * mitgeändert.
 */
export const LEISTENFARBE = { light: '#f6f8fc', dark: '#060911' } as const
