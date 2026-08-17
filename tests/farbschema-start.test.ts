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
  /** Die Farben, die das Skript in den Parser geschrieben hat. */
  farben: string[]
}

/**
 * Eine nachgebaute Seite: `document.write` wird aufgefangen, das DOM ist Falle.
 *
 * ## Warum diese Trennung der Kern der Sache ist
 *
 * Safari liest `theme-color` beim Parsen. Fünf Anläufe haben gezeigt, was das
 * heißt: Jede Änderung **nach** dem Parsen wird ignoriert – `setAttribute`,
 * `appendChild`, Knoten austauschen. `document.write` während des Parsens ist
 * etwas anderes: Der Text geht in den Token-Strom, der Parser baut das Element
 * selbst, wie bei Quelltext.
 *
 * Der Nachbau bildet genau diesen Unterschied ab:
 *
 * - `write` wird **aufgefangen** und geprüft – der erlaubte Weg.
 * - `head`, `createElement`, `querySelectorAll` **werfen** – die vier Wege,
 *   die gemessen nicht tragen.
 *
 * Ein Nachbau, der alles mitmacht, bestätigt jede Fassung. Genau daran hat
 * diese Prüfung drei kaputte Fassungen durchgewinkt.
 */
function neueSeite() {
  const geschrieben: string[] = []

  const verboten = (was: string) => () => {
    throw new Error(
      `Das Startskript hat ${was} aufgerufen. Nach dem Parsen ist es zu spät – ` +
        'Safari hat die Farbe dann längst gelesen. Der einzige Weg, der trägt, ' +
        'ist `document.write` während des Parsens.'
    )
  }

  const dokument = {
    documentElement: { dataset: {} as { theme?: string } },
    write: (html: string) => geschrieben.push(html),
    get head(): never {
      return verboten('document.head')()
    },
    createElement: verboten('document.createElement'),
    querySelectorAll: verboten('document.querySelectorAll'),
  }

  return { dokument, geschrieben }
}

/** Die `content`-Werte aller geschriebenen `theme-color`-Angaben. */
function geschriebeneFarben(geschrieben: readonly string[]): string[] {
  return geschrieben.flatMap((html) =>
    [...html.matchAll(/<meta name="theme-color" content="([^"]+)"/g)].map((t) => t[1])
  )
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
  const { dokument, geschrieben } = neueSeite()

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
    farben: geschriebeneFarben(geschrieben),
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
   Die Leistenfarbe: geschrieben beim Parsen, nicht geändert danach.

   ## Fünf Anläufe, und was jeder gemessen hat

       keine Angabe im HTML                     Safari malt schwarz
       feste Angabe im HTML                     Safari nimmt sie
       Skript ändert sie danach (setAttribute)  Safari ignoriert
       Skript tauscht den Knoten aus            Safari ignoriert
       Angaben mit `media`                      folgen dem Gerät, nicht der Wahl

   Der Betreiber will, dass der Balken der **Website** folgt: beige im hellen
   Modus, dunkel im dunklen. Dafür muss die Farbe beim Parsen feststehen – und
   das geht nur mit `document.write`, das den Text in den Token-Strom schiebt,
   statt das fertige DOM zu verändern.

   ## Was hier festgehalten wird

   Die drei Stücke, die zusammen tragen und einzeln nichts wert sind:

   1. das Skript schreibt die Angabe (statt sie nachträglich zu setzen),
   2. es steht im `<head>` **vor** dem Rückfall,
   3. der Rückfall liegt in `<noscript>`, damit Next ihn nicht nach vorn zieht.

   Fällt (3) weg, stünde der Rückfall vorn und gewönne immer – bei mehreren
   passenden Angaben nimmt der Browser die erste. Der ganze Umbau wäre dann
   wirkungslos, und zwar lautlos.
------------------------------------------------------------------- */

{
  const layout = readFileSync('app/layout.tsx', 'utf8')

  pruefen(
    'Das Skript steht vor dem Rückfall',
    layout.indexOf('__html: themeScript') < layout.indexOf('<noscript>'),
    'Steht der Rückfall vorher, gewinnt er – der Browser nimmt die erste\n' +
      '     passende Angabe.'
  )

  pruefen(
    'Der Rückfall liegt in <noscript> und geht damit nicht durch Next',
    /<noscript>[\s\S]*?theme-color[\s\S]*?<\/noscript>/.test(layout),
    'Next zieht jede Meta-Angabe, die es sieht, an den Anfang des <head> –\n' +
      '     also vor das Skript. In <noscript> sieht es sie nicht.'
  )

  pruefen(
    'Der Rückfall deckt beide Systemvorgaben ab',
    /prefers-color-scheme: light/.test(layout) &&
      /prefers-color-scheme: dark/.test(layout),
    'Ohne JavaScript ist die Systemvorgabe die beste verfügbare Schätzung.'
  )

  pruefen(
    'Kein viewport.themeColor mehr',
    !/^\s*themeColor:/m.test(layout),
    'Was aus den Metadaten-Exporten kommt, zieht Next an den Anfang des <head>\n' +
      '     – vor das Skript. Genau das soll hier nicht passieren.'
  )

  /*
    Und die Gegenprobe: kein DOM-Weg mehr, in keiner der drei Dateien.

    Die vier gescheiterten Anläufe waren alle DOM-Änderungen nach dem Parsen.
    Wer einen davon wieder einbaut, bekommt hier Bescheid – und der Nachbau
    oben wirft zusätzlich, wenn das Skript es zur Laufzeit versucht.
  */
  for (const datei of [
    'lib/theme.ts',
    'app/layout.tsx',
    'components/layout/ThemeToggle.tsx',
  ]) {
    const ohneKommentare = readFileSync(datei, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    pruefen(
      `${datei} ändert theme-color nicht über das DOM`,
      !/(querySelectorAll|createElement|appendChild|removeChild)/.test(ohneKommentare),
      'Nach dem Parsen ist es zu spät – viermal nachgemessen.'
    )
  }

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
   Und was das Skript in den Parser schreibt.

   Die Fälle oben prüfen, welches Schema gilt. Hier geht es um die Farbe, die
   dabei herauskommt – der Punkt, an dem der Betreiber fünfmal einen falschen
   Balken gesehen hat.

   Genau **eine** Angabe je Lauf: Zwei geschriebene wären zwei im Kopf, und
   welche gilt, entschiede der Browser.
------------------------------------------------------------------- */

for (const [wahl, erwartet] of [
  [null, LEISTENFARBE.weiss],
  ['weiss', LEISTENFARBE.weiss],
  ['dark', LEISTENFARBE.dark],
  ['light', LEISTENFARBE.weiss],
] as const) {
  for (const systemDunkel of [false, true]) {
    const lage = `Gerät ${systemDunkel ? 'dunkel' : 'hell'}`
    const { farben } = ausfuehren({ gespeichert: wahl, systemDunkel })
    pruefen(
      `Wahl ${wahl === null ? '(keine)' : `„${wahl}"`}, ${lage} → schreibt ${erwartet}`,
      farben.length === 1 && farben[0] === erwartet,
      `bekommen: [${farben.join(', ') || '(nichts)'}]`
    )
  }
}

/*
  Die Gegenprobe: Die Farbe hängt an der Wahl und nicht am Gerät.

  Das ist der ganze Unterschied zur Fassung mit `media`, die der Betreiber
  ausdrücklich nicht wollte. Eine Prüfung, die nur „schreibt irgendeine Farbe"
  verlangt, ginge auch dann durch.
*/
{
  const dunkelAufHellemGeraet = ausfuehren({ gespeichert: 'dark', systemDunkel: false })
  const hellAufDunklemGeraet = ausfuehren({ gespeichert: 'weiss', systemDunkel: true })
  pruefen(
    'Die Systemvorgabe ändert die geschriebene Farbe nicht',
    dunkelAufHellemGeraet.farben[0] === LEISTENFARBE.dark &&
      hellAufDunklemGeraet.farben[0] === LEISTENFARBE.weiss,
    'Der Balken soll der Website folgen, nicht dem Telefon – ausdrücklicher\n' +
      '     Wunsch des Betreibers vom 17. August 2026.'
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
