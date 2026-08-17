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
 * ## Die Angabe steht **nur** hier – nicht im ausgelieferten HTML
 *
 * Am 13. August 2026 meldete der Betreiber einen weißen Balken über der
 * dunklen Seite, auf dem Telefon. Es hat drei Anläufe gebraucht, und die
 * ersten beiden sind lehrreich genug, um sie festzuhalten.
 *
 * Vorher standen im `<head>` **zwei** Angaben mit `media`-Bedingung, eine
 * helle und eine dunkle. Auf einem dunkel gestellten Gerät griff die dunkle
 * schon beim Parsen – ohne eine Zeile JavaScript. Das hat den eigentlichen
 * Fehler verdeckt: Die JS-Korrektur daneben war nie nötig und deshalb nie
 * geprüft.
 *
 * Seit der erste Besuch weiß ist, ist die Systemvorgabe bedeutungslos – eine
 * `media`-Bedingung fragt genau das ab, worauf es nicht mehr ankommt. Übrig
 * blieb der JS-Weg, und der trug nicht:
 *
 *     setAttribute('content', …)   Chromium: wirkt   Safari: wirkt nicht
 *     Knoten austauschen           Chromium: wirkt   Safari: wirkt nicht
 *
 * **Safari liest `theme-color` beim Parsen und danach nicht mehr.** Kein
 * Skript kann eine Angabe retten, die schon im HTML steht – und ein
 * statischer Export weiß nicht, welches Schema der Besucher gewählt hat.
 *
 * Daraus wurde am 16. August: Angabe ganz weglassen, dann färbt Safari nach
 * dem Seitenhintergrund. **Das stimmt nicht.** Am 17. August zeigte der
 * Betreiber die Startseite im hellen Modus – beige Seite, schwarzer Balken.
 * `html` trägt `background-color: var(--c-canvas)`; Safari nimmt ihn trotzdem
 * nicht, sondern malt ohne Angabe schwarz.
 *
 * Seither steht die **helle** Farbe wieder im HTML (`app/layout.tsx`). Sie ist
 * für jeden ersten Besuch richtig, und der erste Besuch ist weiß, ausnahmslos.
 *
 * ## Warum hier nichts mehr entfernt wird
 *
 * Diese Funktion hat vorhandene Angaben zuerst gelöscht und dann eine neue
 * angelegt. Mit einer Angabe im HTML wäre das der Schuss ins eigene Knie:
 * Safari hat sie beim Parsen gelesen, und ob die Farbe eine Löschung des
 * Knotens überlebt, weiß hier niemand – geprüft werden kann es von hier aus
 * nicht, und „müsste gehen" ist an dieser Stelle schon zweimal danebengegangen.
 *
 * Deshalb wird die erste vorhandene Angabe **abgeändert statt ersetzt**. Der
 * Knoten aus dem HTML bleibt stehen, was auch immer Safari an ihm festhält.
 * Chromium wertet die Änderung aus – nachgemessen. Weitere Angaben werden
 * entfernt, damit es bei genau einer bleibt; welche sonst gälte, entschiede
 * der Browser.
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
  const vorhanden = document.querySelectorAll('meta[name="theme-color"]')

  // Überzählige zuerst weg – die erste bleibt und wird abgeändert.
  for (let i = vorhanden.length - 1; i >= 1; i--) vorhanden[i].remove()

  const angabe = vorhanden[0] ?? document.createElement('meta')
  angabe.setAttribute('name', 'theme-color')
  angabe.setAttribute('content', farbe)
  if (!vorhanden[0]) document.head.appendChild(angabe)
}

/**
 * Dasselbe als Text fürs Startskript – `ausdruck` liefert die Farbe.
 *
 * Muss sich verhalten wie `leisteFaerben`; ein Test hält beide zusammen.
 */
export function leisteFaerbenSkript(ausdruck: string): string {
  return `(function(f){
var a=document.querySelectorAll('meta[name="theme-color"]');
for(var i=a.length-1;i>=1;i--){a[i].parentNode.removeChild(a[i])}
var m=a[0];
if(!m){m=document.createElement('meta');m.setAttribute('name','theme-color');}
m.setAttribute('content',f);
if(!a[0]){(document.head||document.documentElement).appendChild(m)}
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
