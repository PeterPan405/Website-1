/**
 * Der erste Besuch ist weiß – geprüft, nicht behauptet.
 *
 * ## Warum diese Prüfung existiert
 *
 * Am 13. August 2026 hat der Betreiber festgelegt, dass die Website beim ersten
 * Start weiß ist. Vorher entschied das die Systemvorgabe des Geräts: Wer sein
 * Telefon auf Dunkel gestellt hatte, bekam eine dunkle Seite, ohne je etwas an
 * ihr eingestellt zu haben.
 *
 * Die Änderung selbst war eine halbe Zeile. Das Heikle daran ist, dass ihr
 * Gegenteil **völlig harmlos aussieht**: `s==='dark'||(!s&&matchMedia(…))` ist
 * die Fassung, die in jeder Anleitung steht und die jeder wieder hinschreibt,
 * der die Stelle das nächste Mal anfasst. Sie fällt niemandem auf, der auf
 * einem hell gestellten Rechner entwickelt – dort verhalten sich beide
 * Fassungen identisch.
 *
 * Deshalb wird hier nicht der Quelltext gelesen, sondern das Skript
 * **ausgeführt**, gegen eine nachgebaute Umgebung, in allen vier Kombinationen
 * aus gespeicherter Wahl und Systemvorgabe.
 *
 * ## Was sie nicht prüft
 *
 * Ob die Farben stimmen und ob das CSS sie umsetzt. Das ist Sache von
 * `tests/farbvariablen.test.ts` und der Referenzbilder. Hier geht es allein um
 * die Entscheidung, welches Schema gilt.
 */

import { readFileSync } from 'node:fs'

import { LEISTENFARBE, THEME_STORAGE_KEY, startSkript } from '@/lib/theme'

const skript = startSkript()

type Umgebung = {
  gespeichert: string | null
  systemDunkel: boolean
}

type Ergebnis = {
  theme: string | undefined
}

/**
 * Eine nachgebaute Seite – und eine Falle für den nächsten Rückfall.
 *
 * Das Startskript darf den `<head>` **nicht mehr anfassen**. Die Leistenfarbe
 * hängt seit dem 17. August 2026 an `media`-Bedingungen im HTML; ein Skript,
 * das `theme-color` sucht und ersetzt, würde sie zerstören.
 *
 * Deshalb sind `createElement`, `querySelectorAll` und `head` hier keine
 * Attrappen mehr, sondern **Fallen**: Sie werfen. Ein Skript, das sie anfasst,
 * bricht ab, und der Test meldet es – statt still eine Angabe zu erzeugen, die
 * niemand mehr liest.
 *
 * Das ist die Lehre aus drei Anläufen: Diese Prüfung hat sie alle abgesegnet,
 * weil sie das Verhalten im Nachbau maß statt der Bauart. Ein Nachbau, der
 * alles mitmacht, bestätigt jede Fassung.
 */
function neueSeite() {
  const verboten = (was: string) => () => {
    throw new Error(
      `Das Startskript hat ${was} aufgerufen. Es darf den <head> nicht mehr ` +
        'anfassen – die Leistenfarbe hängt an `media` im HTML, und ein Skript, ' +
        'das `theme-color` ersetzt, macht die Angaben kaputt.'
    )
  }

  const dokument = {
    documentElement: { dataset: {} as { theme?: string } },
    get head(): never {
      return verboten('document.head')()
    },
    createElement: verboten('document.createElement'),
    querySelectorAll: verboten('document.querySelectorAll'),
  }

  return { dokument }
}

/**
 * Führt das Startskript gegen eine nachgebaute Seite aus.
 *
 * Nachgebaut ist genau so viel, wie das Skript anfasst: `localStorage`,
 * `matchMedia`, das `<html>`-Element mit seinem `dataset` und ein `<head>`,
 * in dem sich Angaben anlegen und entfernen lassen. Eine echte DOM-Bibliothek
 * wäre eine Abhängigkeit für eine Handvoll Eigenschaften – und würde
 * verdecken, worauf sich das Skript stützt.
 *
 * `matchMedia` ist **absichtlich noch da**, obwohl das Skript es nicht mehr
 * benutzen darf. Fehlte es, käme ein Rückfall auf die Systemvorgabe als
 * `TypeError` zurück und würde vom `try/catch` des Skripts verschluckt – der
 * Test wäre dann grün, weil das Skript abgestürzt ist. Es meldet sich
 * stattdessen, wenn es doch gefragt wird.
 */
function ausfuehren({
  gespeichert,
  systemDunkel,
}: Umgebung): Ergebnis & { gefragt: boolean } {
  let gefragt = false
  const { dokument } = neueSeite()

  const fenster = {
    matchMedia: (frage: string) => {
      gefragt = true
      return { matches: systemDunkel && frage.includes('dark') }
    },
  }

  const speicher = {
    getItem: (schluessel: string) =>
      schluessel === THEME_STORAGE_KEY ? gespeichert : null,
  }

  /*
    `new Function` statt `eval`: Das Skript bekommt seine Umgebung als
    Parameter, nicht über den Sichtbarkeitsbereich dieser Datei. Damit ist
    ausgeschlossen, dass es versehentlich etwas Echtes trifft.
  */
  new Function('document', 'window', 'localStorage', skript)(dokument, fenster, speicher)

  return {
    theme: dokument.documentElement.dataset.theme,
    gefragt,
  }
}

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis: string): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}\n     ${hinweis}`)
  }
}

console.log('Startskript des Farbschemas – vier Fälle\n')

/* ------------------------------------------------------------------
   Die Leistenfarbe hängt an `media`, nicht an JavaScript.

   ## Vier Anläufe, und was jeder gemessen hat

       keine Angabe im HTML                     Safari malt schwarz
       feste Angabe im HTML                     Safari nimmt sie
       Skript ändert sie danach (setAttribute)  Safari ignoriert
       Skript tauscht den Knoten aus            Safari ignoriert

   Safari friert den Wert beim Parsen ein; die gespeicherte Wahl steht erst
   danach fest. Damit war jede JS-Fassung eine Variante desselben unmöglichen
   Vorhabens – und diese Prüfung hat sie dreimal in Folge abgesegnet, weil sie
   das Verhalten in einer nachgebauten Umgebung maß statt der Bauart.

   ## Was sie jetzt festhält

   Dass die Farbe **an der Systemvorgabe hängt** und nicht mehr am Skript. Das
   ist der Punkt, an dem der nächste Umbau danebengreifen wird: „Der Umschalter
   müsste die Leiste doch mitziehen" ist der naheliegende Gedanke, und er kostet
   die `media`-Angaben, an denen beide Browser hängen.
------------------------------------------------------------------- */

{
  const layout = readFileSync('app/layout.tsx', 'utf8')

  pruefen(
    'Das Layout liefert zwei theme-color-Angaben nach Systemvorgabe aus',
    /prefers-color-scheme: light/.test(layout) &&
      /prefers-color-scheme: dark/.test(layout),
    'Ohne `media` kann die Angabe die Systemvorgabe nicht kennen – dann ist der\n' +
      '     Balken entweder immer hell oder (ohne Angabe) immer schwarz.'
  )

  pruefen(
    'Beide Farben kommen aus LEISTENFARBE',
    /color:\s*LEISTENFARBE\.weiss/.test(layout) &&
      /color:\s*LEISTENFARBE\.dark/.test(layout),
    'Ein zweites Mal `#f2ebdd` hinzuschreiben heißt, zwei Stellen zu pflegen,\n' +
      '     von denen eine an `--c-canvas` hängt und die andere an nichts.'
  )

  /*
    Und die Gegenprobe, auf die es ankommt: kein JavaScript mehr an der Farbe.

    Ein Aufruf, der `theme-color` anfasst, würde die `media`-Angaben oben
    zerstören – er müsste sie ja ersetzen. Geprüft wird deshalb der Quelltext
    dreier Dateien, nicht ein Verhalten: Es geht darum, **dass es die Stelle
    nicht mehr gibt.**
  */
  for (const datei of [
    'lib/theme.ts',
    'app/layout.tsx',
    'components/layout/ThemeToggle.tsx',
  ]) {
    const inhalt = readFileSync(datei, 'utf8')
    const ohneKommentare = inhalt
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
    pruefen(
      `${datei} fasst theme-color nicht per JavaScript an`,
      !/theme-color/.test(ohneKommentare),
      'In Safari hat das nie gewirkt – viermal nachgemessen. Und es würde die\n' +
        '     `media`-Angaben zerstören, an denen jetzt beide Browser hängen.'
    )
  }

  /*
    Der Kommentarfilter darf nicht alles wegwerfen, sonst bestünde die Prüfung
    immer. `lib/theme.ts` ist die Datei mit dem meisten Fließtext.
  */
  const themeOhneKommentare = readFileSync('lib/theme.ts', 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
  pruefen(
    'Der Kommentarfilter lässt den Code stehen',
    themeOhneKommentare.includes('export function startSkript'),
    'Nach dem Entfernen der Kommentare ist zu wenig übrig, um etwas zu prüfen.'
  )
}

/* ------------------------------------------------------------------
   Der erste Besuch. Beide Male weiß, das ist der Kern der Sache.
------------------------------------------------------------------- */

const ersterHell = ausfuehren({ gespeichert: null, systemDunkel: false })
pruefen(
  'Erster Besuch, Gerät hell → weiss',
  ersterHell.theme === 'weiss',
  `bekommen: ${ersterHell.theme}`
)

const ersterDunkel = ausfuehren({ gespeichert: null, systemDunkel: true })
pruefen(
  'Erster Besuch, Gerät dunkel → weiss',
  ersterDunkel.theme === 'weiss',
  `bekommen: ${ersterDunkel.theme} – die Systemvorgabe darf den ersten Besuch ` +
    'nicht mehr bestimmen (Festlegung des Betreibers vom 13. August 2026)'
)

pruefen(
  'Die Systemvorgabe wird gar nicht erst gefragt',
  !ersterHell.gefragt && !ersterDunkel.gefragt,
  'Das Skript ruft matchMedia auf. Selbst wenn das Ergebnis heute nichts ' +
    'ändert, ist der Aufruf die Stelle, an der die alte Rangfolge zurückkommt.'
)

/* ------------------------------------------------------------------
   Die eigene Wahl. Sie gilt, und zwar gegen jede Systemvorgabe.
------------------------------------------------------------------- */

for (const systemDunkel of [false, true]) {
  const lage = systemDunkel ? 'Gerät dunkel' : 'Gerät hell'

  const gewaehltDunkel = ausfuehren({ gespeichert: 'dark', systemDunkel })
  pruefen(
    `Wahl „dark", ${lage} → dark`,
    gewaehltDunkel.theme === 'dark',
    `bekommen: ${gewaehltDunkel.theme}`
  )

  const gewaehltWeiss = ausfuehren({ gespeichert: 'weiss', systemDunkel })
  pruefen(
    `Wahl „weiss", ${lage} → weiss`,
    gewaehltWeiss.theme === 'weiss',
    `bekommen: ${gewaehltWeiss.theme}`
  )
}

/* ------------------------------------------------------------------
   Werte aus früheren Fassungen. Sie liegen auf echten Geräten.
------------------------------------------------------------------- */

for (const alt of ['light', 'grau']) {
  const ergebnis = ausfuehren({ gespeichert: alt, systemDunkel: true })
  pruefen(
    `Alter Wert „${alt}" zählt als weiss`,
    ergebnis.theme === 'weiss',
    `bekommen: ${ergebnis.theme} – der Wert liegt seit früheren Fassungen im localStorage`
  )
}

/* ------------------------------------------------------------------
   Ein Speicher, der wirft. Privater Modus mancher Browser.
------------------------------------------------------------------- */

{
  const dokument = {
    documentElement: { dataset: {} as { theme?: string } },
    querySelectorAll: () => [],
  }
  const speicher = {
    getItem: () => {
      throw new Error('Zugriff verweigert')
    },
  }
  new Function('document', 'window', 'localStorage', skript)(dokument, {}, speicher)
  const theme = dokument.documentElement.dataset.theme

  pruefen(
    'Ein werfender localStorage bricht die Seite nicht ab',
    theme === undefined,
    `bekommen: ${theme} – erwartet ist, dass das Skript still aufgibt und das ` +
      'im HTML gesetzte data-theme="weiss" stehen lässt'
  )
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
