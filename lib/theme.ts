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

/*
 * ## Die Leistenfarbe steht nicht mehr hier – und das ist der Kern der Sache
 *
 * Bis zum 17. August 2026 standen an dieser Stelle `leisteFaerben()` und ihr
 * Zwilling als Zeichenkette: zwei Funktionen, die die Farbe der Browserleiste
 * per JavaScript nachzogen. Sie sind ersatzlos entfallen.
 *
 * Gemessen wurde, in vier Anläufen, jeweils am Gerät des Betreibers:
 *
 *     keine Angabe im HTML                     Safari malt schwarz
 *     feste Angabe im HTML                     Safari nimmt sie
 *     Skript ändert sie danach (setAttribute)  Safari ignoriert
 *     Skript tauscht den Knoten aus            Safari ignoriert
 *
 * **Safari friert den Wert beim Parsen ein.** Die gespeicherte Wahl steht erst
 * danach fest. Kein noch so geschickter Umbau ändert daran etwas – die drei
 * Fassungen davor waren Varianten desselben unmöglichen Vorhabens.
 *
 * Die Farbe hängt seither an `media`-Bedingungen in `app/layout.tsx` und damit
 * an der Systemvorgabe des Geräts, die der Browser beim Parsen kennt. Das ist
 * keine JavaScript-Aufgabe mehr.
 *
 * **Wer hier wieder eine Funktion für `theme-color` einbaut, macht es schlimmer
 * als vorher:** Sie müsste die vorhandenen Angaben anfassen, und die tragen
 * jetzt die `media`-Bedingungen, an denen beide Browser hängen.
 *
 * Was dieses Skript weiterhin tut, ist das eine, was es tun kann und muss:
 * `data-theme` setzen, bevor gemalt wird.
 */

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
 * Die Browserleiste wird **immer** gesetzt, nicht nur bei gespeicherter Wahl.
 *
 * Bis zum 13. August 2026 stand hier ein `if(s)`: Ohne gespeicherte Wahl sei
 * die Farbe im `<head>` ohnehin die richtige. Das stimmte und war trotzdem
 * die schlechtere Fassung – ein Zweig, der fast immer übersprungen wird,
 * wird nie geprüft, und beim ersten Mal, an dem er zählt, trägt er nicht.
 * Der Aufruf kostet nichts und macht die Angabe zur Ableitung aus
 * `data-theme` statt zu einem Sonderfall.
 *
 * `try/catch` um alles: `localStorage` wirft im privaten Modus mancher Browser
 * beim bloßen Zugriff. Ein Fehler hier bliebe unbehandelt im `<head>` stehen
 * und die Seite ganz ohne Farbschema.
 */
export function startSkript(): string {
  return `(function(){try{
var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
var t=s==='dark'?'dark':'weiss';
document.documentElement.dataset.theme=t;
}catch(e){}})()`
}
