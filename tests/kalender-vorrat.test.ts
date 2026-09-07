/**
 * Reicht der Vorrat des von Hand gepflegten Kalenders noch?
 *
 * ## Der Anlass
 *
 * Am 7. September 2026 hat der Betreiber gemeldet, die Quartalszahlen seien
 * falsch. Beim Nachsehen zeigte sich ein zweiter, größerer Schaden daneben:
 * `data/kalender/termine.ts` trug für die kommenden zwölf Monate **sechs**
 * Zinsentscheide und **zwei** Konjunkturtermine – und danach nichts. Der
 * letzte Notenbanktermin lag am 17. Dezember 2026, der letzte Konjunkturwert
 * am 10. November.
 *
 * Nichts daran war rot. Der Build lief grün, die Kalenderseite baute, die
 * Prüfung in `lib/kalender-validate.ts` fand keinen Fehler – denn jeder
 * einzelne Eintrag *war* richtig. Falsch war, wie **wenige** es waren.
 *
 * Genau das ist der Fall, für den `AGENTS.md` den Satz führt: „Der teuerste
 * Fehler ist nicht der rote Lauf, sondern der stille." Eine Datei, die von
 * Hand gepflegt wird, leert sich nicht auf einmal, sondern indem die Zeit an
 * ihr vorbeiläuft. Und das sieht bis zum letzten Tag aus wie Ruhe.
 *
 * ## Warum diese Prüfung mit dem echten Datum rechnet
 *
 * Sie **soll** eines Tages von selbst rot werden, ohne dass jemand etwas
 * ändert – das ist ihr ganzer Zweck. Ein fest eingetragener Stichtag könnte
 * das nicht: Er würde mit dem Bestand zusammen altern und genau dann noch
 * grün melden, wenn es darauf ankommt. (Denselben Fehler hatte
 * `tests/quartalstermine.test.ts` und musste am 4. September nachgebessert
 * werden.)
 *
 * Der Alarm kommt deshalb **vor** der Frist, wie beim `ausgabe-waechter`: Die
 * Fristen unten sind so gewählt, dass nach dem ersten roten Lauf noch Wochen
 * bleiben, den Kalender nachzutragen.
 *
 * ## Warum die Fristen verschieden lang sind
 *
 * Weil die Quellen verschieden weit reichen, und eine Frist, die weiter
 * verlangt als die Quelle hergibt, erzwingt erfundene Termine:
 *
 * - **Notenbanken** veröffentlichen ihre Sitzungstermine ein bis zwei Jahre
 *   im Voraus, Börsen ihre Feiertage sogar sechs. Hier ist ein halbes Jahr
 *   Vorrat eine bequeme Forderung.
 * - **Konjunkturtermine** gibt es nur, soweit die Ämter sie angekündigt
 *   haben: Am 7. September 2026 reichte Destatis bis zum 15. Januar 2027,
 *   das ifo bis zum 17. Dezember, das BLS bis zum 10. Dezember. Mehr als zwei
 *   Monate Vorrat lassen sich daraus nicht immer bilden – deshalb steht hier
 *   die kürzeste Frist.
 */

import { termine } from '../data/kalender/termine.ts'
import type { Termin, TerminArt } from '../data/kalender/typen.ts'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/** Heute als `JJJJ-MM-TT`, in Ortszeit gelesen – ohne Umweg über UTC. */
function heute(): string {
  const jetzt = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${jetzt.getFullYear()}-${p(jetzt.getMonth() + 1)}-${p(jetzt.getDate())}`
}

/** Ein Datum um `tage` Tage weiter, als `JJJJ-MM-TT`. */
function plusTage(datum: string, tage: number): string {
  const d = new Date(`${datum}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + tage)
  return d.toISOString().slice(0, 10)
}

/**
 * Der letzte Tag, an dem diese Art von Termin noch etwas zu bieten hat.
 *
 * Bei Zeiträumen zählt das Ende: Eine Berichtssaison, die heute läuft und
 * noch fünf Wochen dauert, ist Vorrat.
 */
function reichtBis(eintraege: readonly Termin[], art: TerminArt): string | null {
  const tage = eintraege
    .filter((termin) => termin.art === art)
    .map((termin) => termin.bis ?? termin.datum)
    .sort()
  return tage.at(-1) ?? null
}

/* ------------------------------------------------------ Die Fristen selbst */

interface Frist {
  art: TerminArt
  /** So viele Tage Vorrat müssen ab heute noch da sein. */
  tage: number
  /** Wo nachgetragen wird, wenn es rot wird. */
  quelle: string
}

const FRISTEN: Frist[] = [
  {
    art: 'notenbank',
    tage: 180,
    quelle:
      'federalreserve.gov/monetarypolicy/fomccalendars.htm und ecb.europa.eu (Sitzungskalender)',
  },
  {
    art: 'boersenfeiertag',
    tage: 180,
    quelle: 'nyse.com/markets/hours-calendars und der FWB-Handelskalender',
  },
  {
    art: 'verfallstag',
    tage: 180,
    quelle: 'die Regel selbst – dritter Freitag im März, Juni, September, Dezember',
  },
  {
    art: 'berichtssaison',
    tage: 120,
    quelle: 'das übliche Fenster: zweiter Montag des Folgemonats, gut vier Wochen lang',
  },
  {
    art: 'konjunktur',
    tage: 60,
    quelle:
      'destatis.de (Veröffentlichungskalender), ifo.de (Upcoming Release Dates), bls.gov/schedule/news_release/',
  },
]

const HEUTE = heute()

for (const frist of FRISTEN) {
  const ende = reichtBis(termine, frist.art)
  const verlangt = plusTage(HEUTE, frist.tage)
  const anzahl = termine.filter(
    (termin) => termin.art === frist.art && (termin.bis ?? termin.datum) >= HEUTE
  ).length

  pruefe(
    `„${frist.art}“ hat noch ${frist.tage} Tage Vorrat`,
    ende !== null && ende >= verlangt,
    ende === null
      ? `Es steht überhaupt kein Termin dieser Art im Kalender.\n` +
          `     Nachtragen in data/kalender/termine.ts, Quelle: ${frist.quelle}`
      : `Der Vorrat endet am ${ende}, verlangt ist mindestens ${verlangt}.\n` +
          `     Künftige Termine dieser Art: ${anzahl}.\n` +
          `     Nachtragen in data/kalender/termine.ts, Quelle: ${frist.quelle}`
  )
}

/* ----------------------------------------- Und schlägt sie auch wirklich an? */

/*
  „Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe." Also bekommt sie
  hier etwas vorgelegt, das sie beanstanden muss: einen Bestand, dessen
  einziger Notenbanktermin gestern war. Ginge das durch, wäre die Prüfung
  oben eine Zeile Text und kein Wächter.
*/
const gestern = plusTage(HEUTE, -1)
const leergelaufen: Termin[] = [
  {
    datum: gestern,
    titel: 'Fed-Zinsentscheid',
    art: 'notenbank',
    bedeutung: 'Nur zum Prüfen der Prüfung – dieser Eintrag steht nicht im Kalender.',
    quelle: { label: 'Testfall', url: 'https://example.invalid/' },
  },
]

pruefe(
  'Ein leergelaufener Bestand fällt durch',
  reichtBis(leergelaufen, 'notenbank')! < plusTage(HEUTE, 180),
  'Die Vorratsprüfung würde einen abgelaufenen Kalender durchwinken.'
)

pruefe(
  'Eine Art ohne einen einzigen Termin fällt durch',
  reichtBis(leergelaufen, 'konjunktur') === null,
  'Ein Bestand ohne Konjunkturtermine müsste als leer erkannt werden.'
)

/*
  Die Gegenprobe zur Gegenprobe: Ein Zeitraum, der heute läuft und dessen Ende
  weit genug in der Zukunft liegt, ist Vorrat – auch wenn sein Anfangstag
  hinter uns liegt. Sonst meldete die Prüfung mitten in einer laufenden
  Berichtssaison einen leeren Kalender.
*/
const laufenderZeitraum: Termin[] = [
  {
    datum: plusTage(HEUTE, -10),
    bis: plusTage(HEUTE, 200),
    titel: 'Ein laufender Zeitraum',
    art: 'berichtssaison',
    bedeutung: 'Nur zum Prüfen der Prüfung – dieser Eintrag steht nicht im Kalender.',
    quelle: { label: 'Testfall', url: 'https://example.invalid/' },
  },
]

pruefe(
  'Ein laufender Zeitraum zählt bis zu seinem Ende als Vorrat',
  reichtBis(laufenderZeitraum, 'berichtssaison')! >= plusTage(HEUTE, 180),
  'Bei Zeiträumen muss das Ende zählen, nicht der Anfang.'
)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
