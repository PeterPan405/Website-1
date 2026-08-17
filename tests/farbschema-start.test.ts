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

import { LEISTENFARBE, THEME_STORAGE_KEY, leisteFaerben, startSkript } from '@/lib/theme'

const skript = startSkript()

type Umgebung = {
  gespeichert: string | null
  systemDunkel: boolean
}

type Ergebnis = {
  theme: string | undefined
  leiste: string[]
}

/** Eine Meta-Angabe, so viel davon, wie angefasst wird. */
class Angabe {
  werte: Record<string, string> = {}
  parentNode: Kopf | null = null
  setAttribute(name: string, wert: string) {
    this.werte[name] = wert
  }
  getAttribute(name: string) {
    return this.werte[name] ?? null
  }
  remove() {
    this.parentNode?.removeChild(this)
  }
}

/** Der `<head>` mit seinen Kindern. */
class Kopf {
  kinder: Angabe[] = []
  appendChild(kind: Angabe) {
    kind.parentNode = this
    this.kinder.push(kind)
    return kind
  }
  removeChild(kind: Angabe) {
    this.kinder = this.kinder.filter((k) => k !== kind)
    kind.parentNode = null
    return kind
  }
}

/**
 * Baut eine Seite mit `anzahl` Farbangaben im Kopf.
 *
 * Voreingestellt ist **keine**, und das ist hier Absicht, obwohl das HTML
 * seit dem 17. August 2026 eine mitbringt: Geprüft werden soll, dass das
 * Skript aus dem Nichts genau eine anlegt. Dass es eine vorhandene **ersetzt**
 * statt weitere danebenzustellen, prüft weiter unten ein eigener Fall mit
 * `neueSeite(2)` – das ist die Lage im Browser.
 */
function neueSeite(anzahl = 0) {
  const kopf = new Kopf()
  for (let i = 0; i < anzahl; i++) {
    const angabe = new Angabe()
    angabe.setAttribute('name', 'theme-color')
    angabe.setAttribute('content', LEISTENFARBE.weiss)
    kopf.appendChild(angabe)
  }

  const dokument = {
    head: kopf,
    documentElement: { dataset: {} as { theme?: string } },
    createElement: (art: string) => {
      if (art !== 'meta') throw new Error(`Unerwartetes Element: ${art}`)
      return new Angabe()
    },
    querySelectorAll: (wahl: string) => {
      if (wahl !== 'meta[name="theme-color"]') {
        throw new Error(`Unerwartete Auswahl: ${wahl}`)
      }
      return kopf.kinder.filter((k) => k.getAttribute('name') === 'theme-color')
    },
  }

  return { dokument, kopf }
}

/** Welche Farben nach dem Lauf im Kopf stehen. */
function leisteAus(kopf: Kopf): string[] {
  return kopf.kinder
    .filter((k) => k.getAttribute('name') === 'theme-color')
    .map((k) => k.getAttribute('content') ?? '')
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
  const { dokument, kopf } = neueSeite()

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
    leiste: leisteAus(kopf),
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
   Das Layout liefert die **helle** Leistenfarbe aus – und keine andere.

   ## Die Prüfung stand bis zum 17. August 2026 auf dem Kopf

   Sie verlangte, dass in `app/layout.tsx` **keine** `themeColor` steht. Das
   war die Lehre aus dem 13. August: Eine feste Farbe im HTML ist für Safari
   endgültig, und auf einem dunkel gestellten Gerät stand ein heller Balken
   über einer schwarzen Seite.

   Der Schluss daraus – Angabe weglassen, Safari nimmt dann den
   Seitenhintergrund – war falsch. Am 17. August zeigte der Betreiber die
   Startseite im **hellen** Modus: beige Seite, schwarzer Balken. Ohne
   `theme-color` malt Safari die Fläche schwarz, egal was auf `html` steht.

   ## Was jetzt geprüft wird

   Nicht mehr „keine Farbe", sondern **die richtige**: die helle aus
   `LEISTENFARBE`. Sie ist keine Wahl, sondern dieselbe Regel wie in
   `startSkript()` – der erste Besuch ist weiß, ausnahmslos. Stünde hier die
   dunkle, widerspräche das HTML dem Skript, das eine Zeile später läuft.

   Gelesen wird der Quelltext und nicht ein Verhalten, weil es um eine
   Bauentscheidung geht: **dass die Farbe überhaupt im HTML steht** und aus
   der einen Quelle kommt statt als Zeichenkette danebenzuliegen.
------------------------------------------------------------------- */

{
  const layout = readFileSync('app/layout.tsx', 'utf8')
  const treffer = layout.match(/^\s*themeColor:\s*(.+?),?\s*$/m)

  pruefen(
    'app/layout.tsx liefert eine themeColor aus',
    treffer !== null,
    'In `app/layout.tsx` steht keine `themeColor` mehr. Ohne sie malt Safari\n' +
      '     den Bereich über der Seite schwarz – auch im hellen Modus, nachgewiesen\n' +
      '     am 17. August 2026. Der Seitenhintergrund rettet das nicht.'
  )

  pruefen(
    'Sie kommt aus LEISTENFARBE und nicht als eigene Zeichenkette',
    treffer?.[1] === 'LEISTENFARBE.weiss',
    `Dort steht \`${treffer?.[1] ?? '(nichts)'}\`.\n` +
      '     Ein zweites Mal `#f2ebdd` hinzuschreiben heißt, zwei Stellen zu pflegen,\n' +
      '     von denen eine an `--c-canvas` hängt und die andere an nichts.'
  )

  /*
    Und die Gegenprobe: Es muss die **helle** sein.

    `LEISTENFARBE.dark` wäre ebenfalls „aus der einen Quelle" und bestünde die
    Prüfung darüber – und stünde trotzdem im Widerspruch zum Startskript, das
    beim ersten Besuch auf Weiß geht.
  */
  pruefen(
    'Es ist die helle Farbe, wie beim ersten Besuch',
    !/^\s*themeColor:.*dark/m.test(layout),
    'Die dunkle Leistenfarbe im HTML widerspricht `startSkript()`: Der erste\n' +
      '     Besuch ist weiß, ausnahmslos – dann gehört auch der Balken hell.'
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

pruefen(
  'Ohne gespeicherte Wahl steht genau eine helle Angabe im Kopf',
  ersterDunkel.leiste.length === 1 && ersterDunkel.leiste[0] === LEISTENFARBE.weiss,
  `bekommen: [${ersterDunkel.leiste.join(', ')}] – erwartet genau [${LEISTENFARBE.weiss}]`
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
  pruefen(
    `Wahl „dark", ${lage} → genau eine dunkle Angabe`,
    gewaehltDunkel.leiste.length === 1 && gewaehltDunkel.leiste[0] === LEISTENFARBE.dark,
    `bekommen: [${gewaehltDunkel.leiste.join(', ') || '(nichts)'}] – erwartet ` +
      `genau [${LEISTENFARBE.dark}]. Bleibt eine alte Angabe stehen, gibt es zwei, ` +
      'und welche gilt, entscheidet der Browser.'
  )

  const gewaehltWeiss = ausfuehren({ gespeichert: 'weiss', systemDunkel })
  pruefen(
    `Wahl „weiss", ${lage} → weiss`,
    gewaehltWeiss.theme === 'weiss',
    `bekommen: ${gewaehltWeiss.theme}`
  )
  pruefen(
    `Wahl „weiss", ${lage} → genau eine helle Angabe`,
    gewaehltWeiss.leiste.length === 1 && gewaehltWeiss.leiste[0] === LEISTENFARBE.weiss,
    `bekommen: [${gewaehltWeiss.leiste.join(', ') || '(nichts)'}]`
  )
}

/* ------------------------------------------------------------------
   Startskript und Umschalter müssen dasselbe tun.

   Sie können sich keinen Aufruf teilen – das eine ist eine Zeichenkette
   im <head>, das andere Code in einer React-Komponente. Also werden hier
   beide über dieselbe nachgebaute Seite geschickt und verglichen.

   Ohne das ist es eine Doppelung, die beim nächsten Anfassen auseinander-
   geht, und auffallen würde es auf einem Telefon.
------------------------------------------------------------------- */

for (const [name, farbe] of Object.entries(LEISTENFARBE)) {
  const ueberSkript = neueSeite()
  new Function('document', 'window', 'localStorage', skript)(
    ueberSkript.dokument,
    {},
    { getItem: () => (name === 'dark' ? 'dark' : 'weiss') }
  )

  /*
    `leisteFaerben` greift auf das globale `document` zu – die nachgebaute
    Seite wird ihm deshalb untergeschoben und danach wieder entfernt. Ein
    echtes `document` gibt es in dieser Umgebung nicht.
  */
  const ueberFunktion = neueSeite()
  const vorher = (globalThis as { document?: unknown }).document
  ;(globalThis as { document?: unknown }).document = ueberFunktion.dokument
  try {
    leisteFaerben(farbe)
  } finally {
    ;(globalThis as { document?: unknown }).document = vorher
  }

  const a = leisteAus(ueberSkript.kopf)
  const b = leisteAus(ueberFunktion.kopf)
  pruefen(
    `Startskript und Umschalter erzeugen dasselbe (${name})`,
    a.length === b.length && a.every((wert, i) => wert === b[i]),
    `Skript: [${a.join(', ')}]   Umschalter: [${b.join(', ')}]`
  )
}

/* ------------------------------------------------------------------
   Zwei Angaben im HTML: Am Ende bleibt genau eine – und zwar **die erste**.

   Das ist seit dem 17. August 2026 der Kern der Sache und nicht mehr nur
   Ordnungsliebe. Das Layout liefert wieder eine `themeColor` aus, weil Safari
   sie beim Parsen liest und ohne sie schwarz malt. Würde das Skript sie
   löschen und eine neue anlegen, wäre der Knoten weg, den Safari gelesen hat –
   und ob die Farbe das überlebt, lässt sich von hier aus nicht prüfen.

   Deshalb wird der erste Knoten **abgeändert, nicht ersetzt**, und diese
   Prüfung sieht ihm dabei zu: Sie merkt sich die Kennung vorher und verlangt
   sie hinterher zurück. Ein Test, der nur die Farbe zählt, ginge auch dann
   durch, wenn das Skript wieder löscht und neu anlegt.
------------------------------------------------------------------- */

{
  const { dokument, kopf } = neueSeite(2)
  const ersterVorher = kopf.kinder[0]
  new Function('document', 'window', 'localStorage', skript)(
    dokument,
    {},
    { getItem: () => 'dark' }
  )
  const heraus = leisteAus(kopf)
  pruefen(
    'Von zwei Angaben bleibt genau eine übrig',
    heraus.length === 1 && heraus[0] === LEISTENFARBE.dark,
    `bekommen: [${heraus.join(', ')}] – erwartet genau [${LEISTENFARBE.dark}]`
  )
  pruefen(
    'Es ist derselbe Knoten wie vorher, nur mit neuer Farbe',
    kopf.kinder[0] === ersterVorher,
    'Das Skript hat den Knoten aus dem HTML weggeworfen und einen neuen\n' +
      '     angelegt. Genau den hat Safari beim Parsen gelesen – nimmt man ihn\n' +
      '     heraus, ist der schwarze Balken vom 17. August 2026 zurück.'
  )
}

/*
  Und der Fall ohne jede Angabe: Dann muss eine entstehen.

  Er kommt im Browser heute nicht mehr vor – aber die Funktion muss ihn
  können, sonst hinge die ganze Farbgebung daran, dass jemand die `themeColor`
  im Layout nie entfernt. Zwei Absicherungen, die einander stützen.
*/
{
  const { dokument, kopf } = neueSeite(0)
  new Function('document', 'window', 'localStorage', skript)(
    dokument,
    {},
    { getItem: () => 'dark' }
  )
  const heraus = leisteAus(kopf)
  pruefen(
    'Ohne vorhandene Angabe wird eine angelegt',
    heraus.length === 1 && heraus[0] === LEISTENFARBE.dark,
    `bekommen: [${heraus.join(', ')}]`
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
