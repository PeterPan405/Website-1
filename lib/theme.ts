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
 * Setzt die Farbe der Browserleiste – als JavaScript-Ausdruck über `farbe`.
 *
 * ## Warum die Angabe **ersetzt** und nicht geändert wird
 *
 * Am 13. August 2026 meldete der Betreiber einen weißen Balken über der
 * dunklen Seite, auf dem Telefon. Die Ursache war eine Regression vom selben
 * Morgen und lehrreich genug, um sie hier festzuhalten.
 *
 * Vorher standen im `<head>` **zwei** Angaben mit `media`-Bedingung, eine
 * helle und eine dunkle. Auf einem dunkel gestellten Gerät griff die dunkle
 * schon beim Parsen – ohne eine Zeile JavaScript. Das hat den eigentlichen
 * Fehler verdeckt: Die JS-Korrektur daneben war nie nötig und deshalb nie
 * geprüft.
 *
 * Seit der erste Besuch weiß ist, ist die Systemvorgabe bedeutungslos
 * geworden – eine `media`-Bedingung fragt genau das ab, worauf es nicht mehr
 * ankommt. Übrig blieb also nur noch der JS-Weg, und der trug nicht: Safari
 * übernimmt ein `setAttribute` auf einer bereits gelesenen `theme-color`
 * nicht verlässlich. In Chromium funktioniert es, nachgemessen – deshalb wäre
 * es hier auch nie aufgefallen.
 *
 * Ein **neuer Knoten** dagegen ist für den Browser eine neue Angabe und wird
 * neu ausgewertet. Die alten werden vorher entfernt: Bliebe eine stehen,
 * gäbe es zwei, und welche gilt, entscheidet dann der Browser.
 *
 * ## Warum es die Arbeit zweimal gibt
 *
 * Sie fällt an zwei Stellen an, die nichts teilen können: im Startskript, das
 * als **Text** im `<head>` steht und vor jedem Bündel läuft, und im
 * Umschalter, einer React-Komponente. Das eine ist eine Zeichenkette, das
 * andere Code – ein gemeinsamer Aufruf ist nicht möglich.
 *
 * Die Doppelung ist deshalb bewusst und abgesichert:
 * `tests/farbschema-start.test.ts` lässt **beide** gegen dieselbe nachgebaute
 * Seite laufen und vergleicht das Ergebnis. Gingen sie auseinander, fiele es
 * dort auf – und nicht erst auf einem Telefon.
 */
export function leisteFaerben(farbe: string): void {
  const alt = document.querySelectorAll('meta[name="theme-color"]')
  for (const angabe of alt) angabe.remove()

  const neu = document.createElement('meta')
  neu.setAttribute('name', 'theme-color')
  neu.setAttribute('content', farbe)
  document.head.appendChild(neu)
}

/**
 * Dasselbe als Text fürs Startskript – `ausdruck` liefert die Farbe.
 *
 * Muss sich verhalten wie `leisteFaerben`; ein Test hält beide zusammen.
 */
export function leisteFaerbenSkript(ausdruck: string): string {
  return `(function(f){
var alt=document.querySelectorAll('meta[name="theme-color"]');
for(var i=alt.length-1;i>=0;i--){alt[i].parentNode.removeChild(alt[i])}
var m=document.createElement('meta');
m.setAttribute('name','theme-color');
m.setAttribute('content',f);
(document.head||document.documentElement).appendChild(m);
})(${ausdruck})`
}

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
var farben=${JSON.stringify(LEISTENFARBE)};
var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
var t=s==='dark'?'dark':'weiss';
document.documentElement.dataset.theme=t;
${leisteFaerbenSkript('farben[t]')};
}catch(e){}})()`
}
