/**
 * Einstieg nach Zeit – und die Zusage, die dahintersteht.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Etwas wird angeboten, das nicht in die Zeit passt.** Das ist der
 *    einzige Fehler, den diese Seite machen kann, und sie macht ihn leicht:
 *    Die kürzeste Lernstufe braucht neun Minuten, und im Fünf-Minuten-Fenster
 *    sähe sie genauso aus wie alles andere.
 * 2. **Eine Dauer wird geschätzt.** Auf einer Seite, die Zeitangaben
 *    verspricht, ist eine erfundene Minutenzahl die Zahl, der man glaubt.
 * 3. **Die Reihenfolge füllt die Zeit nicht aus.** Wer eine Stunde hat und
 *    als Erstes elf Minuten angeboten bekommt, stellt sich den Rest selbst
 *    zusammen – genau das, was die Seite abnehmen soll.
 * 4. **Sekunden werden abgerundet.** Eine Folge von 5:40 als „5 Minuten"
 *    auszuweisen heißt, jemanden mitten im Satz abbrechen zu lassen.
 */

import {
  ZEITFENSTER,
  dauerText,
  kleinstesFenster,
  minutenAusSekunden,
  passt,
  vorschlaegeFuer,
  type Vorschlag,
} from '@/lib/zeitbudget'
import { alleVorschlaege } from '@/lib/zeitbudget-daten'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

function gemessen(id: string, minuten: number): Vorschlag {
  return {
    id,
    titel: id,
    hinweis: '',
    href: `/${id}`,
    herkunft: 'Test',
    dauer: { art: 'gemessen', minuten },
  }
}

const offen: Vorschlag = {
  id: 'glossar',
  titel: 'Glossar',
  hinweis: '',
  href: '/glossar',
  herkunft: 'Test',
  dauer: { art: 'offen', hinweis: 'so lange, wie man liest' },
}

const KLEINSTES = kleinstesFenster()
const fuenf = ZEITFENSTER[0]
const stunde = ZEITFENSTER[2]

/* ------------------------------------------------------------ Die Zusage */

pruefen(
  'Das kleinste Fenster sind fünf Minuten',
  KLEINSTES === 5,
  `${KLEINSTES} – die Fenster stehen in `.concat('`ZEITFENSTER`.')
)

/*
  Die eine Prüfung, um die es geht.

  Neun Minuten ist die kürzeste Lernstufe dieser Website. Sie darf im
  Fünf-Minuten-Fenster nicht erscheinen – sonst ist die Überschrift eine
  Behauptung, die der Inhalt widerlegt.
*/
pruefen(
  'Neun Minuten passen nicht in fünf',
  !passt({ art: 'gemessen', minuten: 9 }, fuenf, KLEINSTES),
  'Die kürzeste Lernstufe dieser Website braucht neun Minuten.'
)

pruefen(
  'Genau fünf Minuten passen in fünf Minuten',
  passt({ art: 'gemessen', minuten: 5 }, fuenf, KLEINSTES),
  'Die Grenze schließt nicht aus, was sie gerade noch erlaubt.'
)

pruefen(
  'Und in die Stunde passt beides',
  passt({ art: 'gemessen', minuten: 9 }, stunde, KLEINSTES) &&
    passt({ art: 'gemessen', minuten: 60 }, stunde, KLEINSTES)
)

/*
  Offene Dauern nur im kleinsten Fenster.

  Wer drei Stunden hat, will nicht auf eine Begriffsliste geschickt werden,
  sondern auf etwas mit Anfang und Ende. „Such dir was aus" heißt bei fünf
  Minuten noch etwas; bei einem Abend hieße es, dass die Seite die Frage nicht
  beantwortet.
*/
pruefen(
  'Etwas ohne Dauer steht nur im kleinsten Fenster',
  passt(offen.dauer, fuenf, KLEINSTES) && !passt(offen.dauer, stunde, KLEINSTES)
)

/* ---------------------------------------------------------- Die Auswahl */

console.log('')

const bestand: Vorschlag[] = [
  gemessen('a', 4),
  gemessen('b', 9),
  gemessen('c', 15),
  gemessen('d', 45),
  gemessen('e', 108),
  offen,
]

const inFuenf = vorschlaegeFuer(bestand, fuenf, 6, KLEINSTES)
pruefen(
  'Im Fünf-Minuten-Fenster steht nur, was hineinpasst',
  inFuenf
    .map((v) => v.id)
    .sort()
    .join() === 'a,glossar',
  inFuenf.map((v) => v.id).join(', ')
)

const inStunde = vorschlaegeFuer(bestand, stunde, 6, KLEINSTES)
pruefen(
  'In der Stunde steht der längste zuerst',
  inStunde.map((v) => v.id).join() === 'd,c,b,a',
  inStunde.map((v) => v.id).join(', ') +
    ' – wer eine Stunde hat, soll sie nicht selbst zusammenstückeln müssen.'
)

pruefen(
  'Und nichts, was länger dauert als das Fenster',
  !inStunde.some((v) => v.dauer.art === 'gemessen' && v.dauer.minuten > stunde.minuten),
  'Der einzige Fehler, den diese Seite machen kann.'
)

pruefen(
  'Die Liste wird begrenzt',
  vorschlaegeFuer(bestand, ZEITFENSTER[3], 2, KLEINSTES).length === 2,
  'Ohne Grenze stünden im Abend-Fenster alle 102 Lernstufen.'
)

/*
  Die Gegenprobe: Jedes Fenster muss etwas anbieten können.

  Ein Fenster, das nie etwas zeigt, ist eine Überschrift ohne Inhalt – und der
  Fehler fiele niemandem auf, weil eine leere Liste wie eine leere Liste
  aussieht.
*/
pruefen(
  'Jedes Fenster findet in diesem Bestand etwas',
  ZEITFENSTER.every(
    (fenster) => vorschlaegeFuer(bestand, fenster, 6, KLEINSTES).length > 0
  ),
  ZEITFENSTER.map(
    (f) => `${f.id}:${vorschlaegeFuer(bestand, f, 6, KLEINSTES).length}`
  ).join(', ')
)

/*
  Zwei Fenster dürfen nicht dieselbe Liste zeigen – geprüft am echten Bestand.

  Der Fehler, den erst das gebaute HTML zeigte: Die längste Lernstufe braucht
  15 Minuten, der kürzeste Lernpfad 70. Dazwischen gab es nichts, und das
  Stunden-Fenster bot exakt dieselben sechs Einträge an wie die Viertelstunde.
  Beide Abschnitte sahen für sich betrachtet richtig aus – der Fehler lag im
  Vergleich, den niemand anstellte.

  Deshalb wird hier gegen den wirklichen Bestand geprüft und nicht gegen ein
  erfundenes Beispiel: Eine Lücke entsteht aus dem, was tatsächlich da ist.
*/
const echt = await alleVorschlaege()
const listen = ZEITFENSTER.map((fenster) =>
  vorschlaegeFuer(echt, fenster, 6, KLEINSTES)
    .map((v) => v.id)
    .join()
)

pruefen(
  'Jedes Fenster bietet im echten Bestand etwas an',
  listen.every((liste) => liste.length > 0),
  ZEITFENSTER.map(
    (f, i) => `${f.id}:${listen[i] ? listen[i].split(',').length : 0}`
  ).join(', ')
)

pruefen(
  'Keine zwei Fenster zeigen dieselbe Liste',
  new Set(listen).size === listen.length,
  ZEITFENSTER.map((f, i) => `${f.id}: ${listen[i]}`).join('\n     ') +
    '\n     Zwei gleiche Listen heißen: Für das größere Fenster gibt es nichts,\n' +
    '     was seine Zeit ausfüllt.'
)

/*
  Und die eigentliche Zusage, an echten Daten: Nichts im Fünf-Minuten-Fenster
  dauert laut Daten länger als fünf Minuten.
*/
pruefen(
  'Im Fünf-Minuten-Fenster steht nichts Längeres',
  vorschlaegeFuer(echt, ZEITFENSTER[0], 6, KLEINSTES).every(
    (v) => v.dauer.art === 'offen' || v.dauer.minuten <= 5
  ),
  vorschlaegeFuer(echt, ZEITFENSTER[0], 6, KLEINSTES)
    .map((v) => `${v.titel} (${dauerText(v.dauer)})`)
    .join(', ')
)

/* --------------------------------------------------------- Die Anzeige */

console.log('')

pruefen(
  'Sekunden werden aufgerundet',
  minutenAusSekunden(340) === 6,
  `${minutenAusSekunden(340)}`
)
pruefen(
  'Auch knapp darüber',
  minutenAusSekunden(301) === 6,
  'Eine Folge von 5:01 als „5 Minuten“ hieße, jemanden mitten im Satz abzubrechen.'
)
pruefen('Glatte Minuten bleiben glatt', minutenAusSekunden(300) === 5)

pruefen(
  'Eine Minute steht im Singular',
  dauerText({ art: 'gemessen', minuten: 1 }) === '1 Minute'
)
pruefen('Mehrere im Plural', dauerText({ art: 'gemessen', minuten: 11 }) === '11 Minuten')
pruefen(
  'Eine offene Dauer nennt keine Zahl',
  !/\d/.test(dauerText(offen.dauer)),
  `${dauerText(offen.dauer)} – eine geschätzte Minutenzahl wäre die Zahl, der man glaubt.`
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
