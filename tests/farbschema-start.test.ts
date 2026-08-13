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

import { LEISTENFARBE, THEME_STORAGE_KEY, startSkript } from '@/lib/theme'

const skript = startSkript()

type Umgebung = {
  gespeichert: string | null
  systemDunkel: boolean
}

type Ergebnis = {
  theme: string | undefined
  leiste: string[]
}

/**
 * Führt das Startskript gegen eine nachgebaute Seite aus.
 *
 * Nachgebaut ist genau so viel, wie das Skript anfasst: `localStorage`,
 * `matchMedia`, das `<html>`-Element mit seinem `dataset` und die
 * Meta-Angaben. Eine echte DOM-Bibliothek wäre eine Abhängigkeit für fünf
 * Eigenschaften – und würde verdecken, worauf sich das Skript stützt.
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
  const leiste: string[] = []

  // Zwei Meta-Angaben, obwohl das Layout nur noch eine ausliefert: Die Schleife
  // im Skript muss auch dann alle treffen, wenn jemand eine zweite einführt.
  const metas = [
    { setAttribute: (_: string, wert: string) => leiste.push(wert) },
    { setAttribute: (_: string, wert: string) => leiste.push(wert) },
  ]

  const dokument = {
    documentElement: { dataset: {} as { theme?: string } },
    querySelectorAll: (wahl: string) => {
      if (wahl !== 'meta[name="theme-color"]') {
        throw new Error(`Unerwartete Auswahl im Startskript: ${wahl}`)
      }
      return metas
    },
  }

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

  return { theme: dokument.documentElement.dataset.theme, leiste, gefragt }
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
  'Ohne gespeicherte Wahl bleibt die Browserleiste unangetastet',
  ersterDunkel.leiste.length === 0,
  `gesetzt auf: ${ersterDunkel.leiste.join(', ')} – im <head> steht bereits die helle Farbe`
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
    `Wahl „dark", ${lage} → beide Leisten dunkel`,
    gewaehltDunkel.leiste.length === 2 &&
      gewaehltDunkel.leiste.every((f) => f === LEISTENFARBE.dark),
    `gesetzt auf: ${gewaehltDunkel.leiste.join(', ') || '(nichts)'}`
  )

  const gewaehltWeiss = ausfuehren({ gespeichert: 'weiss', systemDunkel })
  pruefen(
    `Wahl „weiss", ${lage} → weiss`,
    gewaehltWeiss.theme === 'weiss',
    `bekommen: ${gewaehltWeiss.theme}`
  )
  pruefen(
    `Wahl „weiss", ${lage} → beide Leisten hell`,
    gewaehltWeiss.leiste.length === 2 &&
      gewaehltWeiss.leiste.every((f) => f === LEISTENFARBE.weiss),
    `gesetzt auf: ${gewaehltWeiss.leiste.join(', ') || '(nichts)'}`
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
