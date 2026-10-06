/**
 * Die beiden Verteidigungslinien gegen Störgeräusche – **sind sie verdrahtet?**
 *
 * Ausführen mit `npm test`.
 *
 * ## Der Anlass
 *
 * Am 6. Oktober 2026 meldete der Betreiber „irgendwelche Störgeräusche im
 * Hintergrund". Nachgemessen mit `scripts/aufnahmen-nachpruefen.py` an den
 * vier letzten veröffentlichten Folgen:
 *
 *     06.10.  2:29 rau · 3:37 rau
 *     05.10.  3:30 rau
 *     04.10.  2:14 rau · 4:11 rau
 *     03.10.  0:01 Rumpeln · 1:34 rau · 2:05 Rumpeln
 *
 * Acht Stellen in vier Folgen – zwei je Folge, in **jeder** Folge.
 *
 * Die Ursache war nicht der Maßstab und nicht die Stimme. In `AGENTS.md`
 * steht seit dem 11. August: „Geprüft wird die fertige Aufnahme, nicht das
 * Stück. `nachbessern()` läuft nach dem Zusammenfügen und dämpft." Der
 * Lernseitenlauf tat das. **Der Podcastlauf hat die Funktion nie aufgerufen** –
 * das Wort kam in `scripts/stimme-erzeugen.py` nicht ein einziges Mal vor.
 *
 * ## Warum das ein Test über Quelltext ist und keiner über Ton
 *
 * Weil der Fehler kein Rechenfehler war. Beide Funktionen sind richtig und
 * geprüft – `sprechstimme.py` hat seinen eigenen Selbsttest, und
 * `auffaellige_stellen` findet die Stellen nachweislich, sonst stünde die
 * Liste oben nicht da. Gefehlt hat **der Aufruf**.
 *
 * Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe. Eine, die nie
 * aufgerufen wird, auch – nur merkt man es nicht einmal am Protokoll.
 *
 * Ton zu prüfen bräuchte Modell, Grafikkarte und zwanzig Minuten; dieser
 * Test braucht zwei Dateien und läuft in Millisekunden. Er beantwortet die
 * eine Frage, die am 6. Oktober offen war: Ist die Kette angeschlossen?
 */

import { readFileSync } from 'node:fs'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const podcast = readFileSync('scripts/stimme-erzeugen.py', 'utf8')
const lernseiten = readFileSync('scripts/lese-stimme-erzeugen.py', 'utf8')

/*
  Ein Aufruf, nicht eine Erwähnung.

  **Die erste Fassung dieser Funktion hat ihre eigene Gegenprobe nicht
  überstanden**, und das ist der Grund, warum sie hier so ausführlich
  dasteht. Sie strich nur `#`-Kommentare – `stimme-erzeugen.py` dokumentiert
  aber mit Docstrings, und in dem Absatz, den ich selbst dort hingeschrieben
  hatte, stand „`nachbessern()` läuft nach dem Zusammenfügen". Mit der
  Klammer. Der Test war grün, nachdem ich den Aufruf zum Versuch entfernt
  hatte – also blind für genau den Zustand, den er finden soll.

  Dieselbe Falle wie der Fehler, den er bewacht: ein Name, der dasteht, ohne
  dass etwas passiert. Gestrichen werden deshalb **beide** Formen, Docstrings
  zuerst.
*/
const ohneText = (quelle: string) =>
  quelle
    .replace(/"""[\s\S]*?"""/g, '')
    .replace(/'''[\s\S]*?'''/g, '')
    .split('\n')
    .filter((z) => !/^\s*#/.test(z))
    .join('\n')

const ruft = (quelle: string, name: string) =>
  new RegExp(`(?<!def )\\b${name}\\s*\\(`).test(ohneText(quelle))

/* ------------------------------------------- Die zweite Linie: die Folge */

pruefe(
  'der Podcastlauf dämpft die fertige Aufnahme (nachbessern)',
  ruft(podcast, 'nachbessern'),
  'scripts/stimme-erzeugen.py ruft sprechstimme.nachbessern nicht auf –\n' +
    '     genau der Zustand, der am 6. Oktober 2026 acht Störstellen in vier\n' +
    '     Folgen stehen ließ.'
)
pruefe(
  'der Lernseitenlauf ebenso',
  ruft(lernseiten, 'nachbessern'),
  'scripts/lese-stimme-erzeugen.py ruft sprechstimme.nachbessern nicht auf.'
)

/*
  Und zwar **vor** der Klangkette.

  Gedämpft wird die Rohfassung: Die Klangkette normiert danach auf −16 LUFS
  und hebt die Präsenz ab 3,5 kHz an. Eine stummgeschaltete halbe Sekunde
  bleibt dabei stumm; ein gedämpftes Zischen würde wieder angehoben. Die
  Reihenfolge ist also nicht Geschmack, sondern Wirkung.
*/
{
  /* Auch hier ohne Docstrings – sonst gewinnt die Erwähnung im Absatz
     darüber das Rennen gegen den Aufruf darunter. */
  const nackt = ohneText(podcast)
  const d = nackt.indexOf('nachbessern(')
  const k = nackt.indexOf('zu_mp3(')
  pruefe(
    'und zwar vor der Klangkette',
    d > 0 && k > 0 && d < k,
    `nachbessern bei ${d}, zu_mp3 bei ${k} – das Dämpfen muss zuerst kommen.`
  )
}

/* -------------------------------------------- Die erste Linie: das Stück */

/*
  Sie hat nicht gefehlt, und deshalb steht sie hier: Wer den Aufruf oben
  einbaut, darf nicht auf den Gedanken kommen, den unteren dafür zu
  entfernen. Die beiden finden Verschiedenes – das Stück wird am Pegel des
  Stücks gemessen, die Folge am Pegel der Folge. Begründung im Docstring von
  `nachbessern`.
*/
pruefe(
  'der Podcastlauf prüft außerdem jedes Stück (brauchbar)',
  ruft(podcast, 'brauchbar')
)
pruefe('der Lernseitenlauf ebenso', ruft(lernseiten, 'brauchbar'))

/* ------------------------------------------------- Die Gegenprobe zum Test */

/*
  **Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.** Also bekommt
  die Suche den Zustand vom 6. Oktober vorgelegt – eine Quelle, in der der
  Name nur im Kommentar steht – und darf ihn nicht für einen Aufruf halten.
*/
pruefe(
  'ein Name im Kommentar zählt nicht als Aufruf',
  !ruft('# hier könnte nachbessern(audio) stehen\naudio = fertig\n', 'nachbessern')
)
/* Der Fall, an dem die erste Fassung dieses Tests gescheitert ist. */
pruefe(
  'ein Name im Docstring auch nicht',
  !ruft(
    '"""`nachbessern()` läuft nach dem Zusammenfügen."""\naudio = fertig\n',
    'nachbessern'
  ),
  'Genau so war der Test am 6. Oktober 2026 grün, obwohl der Aufruf fehlte.'
)
pruefe(
  'eine Quelle ohne den Aufruf fällt durch',
  !ruft('audio = np.concatenate(teile)\nsf.write(ziel, audio, rate)\n', 'nachbessern')
)
pruefe(
  'und die eigene Definition ist kein Aufruf',
  !ruft('def nachbessern(audio, rate):\n    return audio, 0\n', 'nachbessern')
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
