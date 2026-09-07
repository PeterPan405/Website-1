/**
 * Prüft die Unternehmenszahlen gegen den Kurs auf Plausibilität.
 *
 * ## Wogegen das läuft
 *
 * Die Zahlen kommen aus den XBRL-Pflichtmeldungen bei der SEC, zugeordnet über
 * eine Tabelle von Börsenkürzel zu Börsenkürzel. Diese Zuordnung ist die
 * gefährlichste Stelle im ganzen Vorgang, denn sie kann falsch sein, ohne dass
 * irgendetwas fehlschlägt: `MRK.DE` ist Merck in Darmstadt, `MRK` ist Merck &
 * Co. in New Jersey. Beide melden echte Zahlen, beide sind Pharmakonzerne, und
 * beide Datensätze sehen für sich genommen tadellos aus.
 *
 * Auffliegen kann so etwas nur im Verhältnis zum Kurs. Ein Unternehmen, das an
 * der Börse das Zweihundertfache seines Jahresumsatzes kostet, gibt es –
 * dieselbe Zahl entsteht aber auch, wenn ein Umsatz in Yen neben einem Kurs in
 * Dollar steht oder wenn die Aktienzahl von vor einem Split stammt. Der
 * Unterschied ist von außen nicht zu sehen, und genau deshalb steht hier eine
 * Grenze und kein Kommentar.
 *
 * ## Warum die Grenzen so weit sind
 *
 * Sie sollen nicht beurteilen, ob eine Aktie teuer ist. Sie sollen den Fall
 * abfangen, in dem eine Größenordnung nicht stimmt – und Größenordnungen
 * verfehlt man um Faktoren wie 100 (Pence statt Pfund), 150 (Yen statt Dollar)
 * oder 5 (ein Aktiensplit).
 *
 * Die Obergrenze liegt bei 120. Der höchste echte Wert im Bestand ist Palantir
 * mit 66 – eine Aktie, die tatsächlich das Sechsundsechzigfache ihres
 * Jahresumsatzes kostet. Eine Grenze von 60 hätte den gemeldet, und eine
 * Prüfung, die Richtiges anschlägt, schaut man nach dem zweiten Mal nicht mehr
 * an. Der Median liegt bei 4, der niedrigste Wert bei 0,19.
 *
 * ## Was diese Prüfung schon gefunden hat
 *
 * Beim ersten Lauf sechs britische Aktien mit Werten zwischen 173 und 711.
 * Ursache war keine Fehlzuordnung, sondern die Einheit: Die Londoner Börse
 * stellt Aktien in Pence, im Katalog stand `GBP`. Die Website zeigte damit für
 * 26 Werte den hundertfachen Kurs – mit korrekt aussehendem Währungskürzel
 * daneben.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { werteDividenden } from '../lib/dividenden.ts'
import { HINTERLEGUNGSSCHEINE } from '../lib/hinterlegungsscheine.ts'
import { gleicheWaehrung, inHauptwaehrung } from '../lib/waehrungseinheit.ts'

const wurzel = join(import.meta.dirname, '..')

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

interface Zahlen {
  umsatz?: number
  gewinn?: number
  cashflow?: number
  eigenkapital?: number
  aktien?: number
  waehrung?: string
}

const momentaufnahme = JSON.parse(
  readFileSync(join(wurzel, 'data/snapshots/fundamentaldaten.json'), 'utf8')
) as { unternehmen: Record<string, Zahlen> }

/** Kürzel, Symbol und Kurswährung aus dem Katalog. */
const katalog = new Map<string, { symbol: string; waehrung: string }>()
for (const datei of ['data/markets.ts', 'data/markets-aktien.ts']) {
  const text = readFileSync(join(wurzel, datei), 'utf8')
  for (const treffer of text.matchAll(
    /^\s*symbol: '([^']+)',\n\s*ticker: '([^']+)',\n\s*name: (?:'[^']*'|"[^"]*"),\n\s*kind: '([^']+)',\n\s*unit: '([^']+)',/gm
  )) {
    if (treffer[3] !== 'stock') continue
    katalog.set(treffer[2], { symbol: treffer[1], waehrung: treffer[4] })
  }
}

const kurse = JSON.parse(
  readFileSync(join(wurzel, 'data/snapshots/markets.json'), 'utf8')
) as { instruments: Record<string, { points?: { d: string; c: number }[] }> }

function letzterKurs(symbol: string): number | null {
  const punkte = kurse.instruments[symbol]?.points
  if (!punkte || punkte.length === 0) return null
  const letzter = punkte[punkte.length - 1]?.c
  return typeof letzter === 'number' && Number.isFinite(letzter) ? letzter : null
}

/* ---------------------------------------------------------------------------
   Die Zahlen für sich – ohne Kurs
--------------------------------------------------------------------------- */

console.log('\n— Jeder Datensatz für sich —')

const eintraege = Object.entries(momentaufnahme.unternehmen)
pruefe('es stehen überhaupt Unternehmen in der Momentaufnahme', eintraege.length > 100)

const winzigeAktienzahl = eintraege.filter(
  ([, z]) => typeof z.aktien === 'number' && z.aktien < 1000
)
pruefe(
  'keine Aktienzahl unter tausend',
  winzigeAktienzahl.length === 0,
  winzigeAktienzahl.map(([k, z]) => `${k}: ${z.aktien}`).join(', ')
)

const negativerUmsatz = eintraege.filter(
  ([, z]) => typeof z.umsatz === 'number' && z.umsatz <= 0
)
pruefe(
  'kein Umsatz von null oder darunter',
  negativerUmsatz.length === 0,
  negativerUmsatz.map(([k]) => k).join(', ')
)

/*
  Ein Gewinn größer als der Umsatz kommt vor – bei Beteiligungsgesellschaften,
  die ihre Erträge nicht als Umsatz ausweisen. Das Fünffache nicht mehr; dann
  stammen die beiden Zahlen aus verschiedenen Meldungen.
*/
const gewinnUeberUmsatz = eintraege.filter(
  ([, z]) =>
    typeof z.gewinn === 'number' &&
    typeof z.umsatz === 'number' &&
    z.umsatz > 0 &&
    Math.abs(z.gewinn) > z.umsatz * 5
)
pruefe(
  'kein Gewinn über dem Fünffachen des Umsatzes',
  gewinnUeberUmsatz.length === 0,
  gewinnUeberUmsatz
    .map(([k, z]) => `${k}: ${Math.round((z.gewinn! / z.umsatz!) * 10) / 10}×`)
    .join(', ')
)

const waehrungen = new Set(
  eintraege.map(([, z]) => z.waehrung).filter((w): w is string => Boolean(w))
)
pruefe(
  'jede Berichtswährung ist ein Dreibuchstabencode',
  [...waehrungen].every((w) => /^[A-Z]{3}$/.test(w)),
  [...waehrungen].filter((w) => !/^[A-Z]{3}$/.test(w)).join(', ')
)

/* ---------------------------------------------------------------------------
   Die Zahlen im Verhältnis zum Kurs
--------------------------------------------------------------------------- */

console.log('\n— Bewertung im Verhältnis zum Kurs —')

/** Untere und obere Grenze für das Kurs-Umsatz-Verhältnis. */
const KUV_MIN = 0.05
const KUV_MAX = 120

const auffaellig: string[] = []
let geprueft = 0

for (const [ticker, zahlen] of eintraege) {
  const eintrag = katalog.get(ticker)
  if (!eintrag) continue

  /*
    Hinterlegungsscheine bleiben draußen – aus demselben Grund wie auf der
    Website: Ein Papier von Taiwan Semiconductor verbrieft fünf Stammaktien,
    die Aktienzahl der Meldung zählt Stammaktien. Das Kurs-Umsatz-Verhältnis
    liegt dadurch beim Fünffachen und würde hier zu Recht auffallen – nur ist
    es eben schon bekannt und wird gar nicht erst angezeigt.
  */
  if (HINTERLEGUNGSSCHEINE.has(ticker)) continue

  // Nur rechnen, wo Bilanz- und Kurswährung übereinstimmen – wie die Website.
  const berichtswaehrung = zahlen.waehrung ?? 'USD'
  if (!gleicheWaehrung(eintrag.waehrung, berichtswaehrung)) continue

  if (!zahlen.aktien || !zahlen.umsatz || zahlen.umsatz <= 0) continue
  const roh = letzterKurs(eintrag.symbol)
  if (roh === null || roh <= 0) continue

  geprueft += 1
  const kurs = inHauptwaehrung(roh, eintrag.waehrung)
  const kuv = (kurs.wert * zahlen.aktien) / zahlen.umsatz
  if (kuv < KUV_MIN || kuv > KUV_MAX) {
    auffaellig.push(
      `${ticker} (${eintrag.symbol}): KUV ${kuv < 1 ? kuv.toFixed(3) : Math.round(kuv)} ` +
        `aus Kurs ${kurs.wert} ${kurs.waehrung} × ${zahlen.aktien} Aktien / Umsatz ${zahlen.umsatz}`
    )
  }
}

pruefe(`es wurden überhaupt Bewertungen gerechnet (${geprueft})`, geprueft > 50)
pruefe(
  `jedes Kurs-Umsatz-Verhältnis liegt zwischen ${KUV_MIN} und ${KUV_MAX}`,
  auffaellig.length === 0,
  `\n       ${auffaellig.join('\n       ')}`
)

/* ---------------------------------------------------------------------------
   Der Börsenwert gegen das Eigenkapital
--------------------------------------------------------------------------- */

console.log('\n— Börsenwert gegen Eigenkapital —')

/*
  Diese Prüfung gibt es, weil die vorige eine Lücke hatte.

  Das Kurs-Umsatz-Verhältnis braucht einen Umsatz. Für die Werte an der Börse
  Taipeh liegt der in den ersten drei Quartalen eines Jahres nicht vor – und
  genau dort ist die Aktienzahl beim ersten Lauf um den Faktor tausend
  danebengelegen, ohne dass irgendetwas angeschlagen hätte. TSMC bekam 25,9
  Billionen Aktien statt 25,9 Milliarden.

  Das Kurs-Buchwert-Verhältnis braucht nur Eigenkapital und Aktienzahl. Es
  deckt damit auch die Datensätze ab, die noch keine Erfolgsrechnung haben.

  ## Warum die Obergrenze davon abhängt, ob ein Umsatz vorliegt

  Eine einzige Obergrenze für alle war zu grob, und das hat die Erweiterung
  der Aktienauswahl gezeigt: Colgate kam auf ein KBV von 516, Gartner auf 175,
  Alnylam auf 163, Seagate auf 157 – und in keinem der vier Fälle lag ein
  Datenfehler vor. Colgate kauft seit Jahrzehnten eigene Aktien zurück und hat
  deshalb ein Eigenkapital von 145 Millionen Dollar bei 20 Milliarden Umsatz;
  Alnylam trägt Verlustvorträge. Ein KBV in den Hundertern ist dort die
  Wahrheit über die Bilanz, keine Fehlmessung.

  Belegt ist das über die anderen beiden Kennzahlen: Alle drei entstehen aus
  demselben Kurs und derselben Aktienzahl. Wäre eine davon um den Faktor
  tausend falsch, wären alle drei es. Colgates Kurs-Umsatz-Verhältnis von 3,7
  und sein Kurs-Gewinn-Verhältnis von 35 sind unauffällig – also stimmen Kurs
  und Aktienzahl, und allein das Eigenkapital ist klein.

  Daraus folgt die Zweiteilung. Liegt ein Umsatz vor, prüft ihn schon die
  vorige Prüfung mit einer engen Grenze; das KBV darf dann weit sein, ohne
  dass ein Faktor tausend durchkäme – der müsste sich dort zeigen. Fehlt der
  Umsatz – der Fall der Börse Taipeh in den ersten drei Quartalen, wegen dem
  diese Prüfung überhaupt entstand –, ist das KBV die einzige Sicherung und
  bleibt streng.
*/
const KBV_MIN = 0.02
/** Ohne Umsatz zur Gegenprobe: streng, wie bisher. */
const KBV_MAX_OHNE_UMSATZ = 150
/** Mit Umsatz: weit, aber weit unter dem Faktor tausend, der gesucht wird. */
const KBV_MAX_MIT_UMSATZ = 800

const auffaelligKbv: string[] = []
let geprueftKbv = 0

for (const [ticker, zahlen] of eintraege) {
  const eintrag = katalog.get(ticker)
  if (!eintrag || HINTERLEGUNGSSCHEINE.has(ticker)) continue

  const berichtswaehrung = zahlen.waehrung ?? 'USD'
  if (!gleicheWaehrung(eintrag.waehrung, berichtswaehrung)) continue

  // Negatives Eigenkapital gibt es wirklich – dort sagt ein KBV nichts.
  if (!zahlen.aktien || !zahlen.eigenkapital || zahlen.eigenkapital <= 0) continue
  const roh = letzterKurs(eintrag.symbol)
  if (roh === null || roh <= 0) continue

  geprueftKbv += 1
  const kurs = inHauptwaehrung(roh, eintrag.waehrung)
  const kbv = (kurs.wert * zahlen.aktien) / zahlen.eigenkapital
  const grenze =
    zahlen.umsatz && zahlen.umsatz > 0 ? KBV_MAX_MIT_UMSATZ : KBV_MAX_OHNE_UMSATZ
  if (kbv < KBV_MIN || kbv > grenze) {
    auffaelligKbv.push(
      `${ticker} (${eintrag.symbol}): KBV ${kbv < 1 ? kbv.toFixed(3) : Math.round(kbv)} ` +
        `aus Kurs ${kurs.wert} ${kurs.waehrung} × ${zahlen.aktien} Aktien / Eigenkapital ${zahlen.eigenkapital}` +
        ` (Grenze ${grenze})`
    )
  }
}

pruefe(`es wurden überhaupt Buchwerte gerechnet (${geprueftKbv})`, geprueftKbv > 50)
pruefe(
  `jedes Kurs-Buchwert-Verhältnis liegt zwischen ${KBV_MIN} und ${KBV_MAX_OHNE_UMSATZ} ` +
    `beziehungsweise ${KBV_MAX_MIT_UMSATZ}, wo ein Umsatz gegenprüft`,
  auffaelligKbv.length === 0,
  `\n       ${auffaelligKbv.join('\n       ')}`
)

/* ---------------------------------------------------------------------------
   Die Dividendenrendite
--------------------------------------------------------------------------- */

console.log('\n— Dividendenrendite —')

/*
  Dieselbe Prüfung wie oben, für die dritte Quelle: die gemeldeten
  Dividendenzahlungen.

  Der Fehler, der hier gefangen wird, ist ein Einheitenfehler – und es hat
  ihn schon gegeben, wenn auch nur in der Anzeige: Weil `formatPercent` die
  Prozentzahl selbst erwartet und nicht den Anteil, wies Apple eine
  Dividendenrendite von 0,00 Prozent aus statt 0,31. Andersherum wäre er
  gefährlicher: Stünde bei Shell versehentlich der Kurs in Pfund und die
  Dividende in Pence, käme eine Rendite von 327 Prozent heraus.

  Eine reguläre Dividendenrendite über 20 Prozent gibt es praktisch nicht.
  Über 15 liegen einige Sonderfälle – geschlossene Fonds, einmalige
  Sonderausschüttungen –, deshalb ist die Grenze nicht knapp gesetzt.

  ## Warum die Grenze am 19. August 2026 von 25 auf 35 gegangen ist

  Sie hat Johnson Matthey gemeldet: 25,2 Prozent aus 579,17 Pence bei einem
  Kurs von 2300. Die Zahl ist **richtig** – am 17. August 2026 kam eine
  einzelne Zahlung von 476,50 Pence zu den regulären 29,33 und 73,33 hinzu.
  Kein Einheitenfehler: Wären Pence und Pfund vertauscht, stünde der Faktor
  100 auf **allen** Zahlungen dieses Titels, nicht auf einer.

  Der Versuch, Sonderausschüttungen an ihrer Form zu erkennen, ist an den
  Daten gescheitert, und zwar zweimal:

  - „Zahlung über dem Dreifachen des Medians" trifft 30 Titel, darunter
    Nvidia (die Dividende ist gewachsen) und Bradesco (viele kleine
    Zwischenzahlungen). Das sind keine Sonderausschüttungen.
  - „Eine Zahlung größer als die Summe der übrigen" trifft über 240 Titel –
    faktisch jede Aktie mit großer Schluss- und kleiner Zwischendividende,
    also fast den gesamten britischen und japanischen Bestand.

  In dieser Momentaufnahme steht nicht, ob eine Zahlung einmalig war; das
  weiß nur, wer die Meldung des Unternehmens gelesen hat. Eine
  Fallunterscheidung über ein Merkmal, das der Stoff nicht hat, ist keine –
  deshalb bleibt die Zwölfmonatssumme, wie sie ist, und die Grenze steigt.

  **Die Gegenprobe steht darunter.** Eine Grenze bei 35 Prozent würde einen
  Faktor 100 nur noch bei Titeln fangen, deren echte Rendite über 0,35
  Prozent liegt – 46 der 773 lägen darunter und rutschten durch. Genau diese
  Lücke schließt die Prüfung „gegen die eigene Vergangenheit": Sie sieht den
  Einheitenfehler unabhängig von der Höhe der Rendite.
*/
const RENDITE_MAX = 35

const dividenden = JSON.parse(
  readFileSync(join(wurzel, 'data/snapshots/dividenden.json'), 'utf8')
) as { titel: Record<string, { date: string; amount: number }[]> }

const heute = new Date().toISOString().slice(0, 10)

/** Ein Kalendertag plus/minus Tage – über `Date.UTC`, ohne Zeitzonenfallen. */
function plusTageIso(tag: string, tage: number): string {
  return new Date(Date.parse(`${tag}T00:00:00Z`) + tage * 86400000)
    .toISOString()
    .slice(0, 10)
}
const auffaelligeRendite: string[] = []
const renditeWerte: number[] = []
let geprueftRendite = 0

for (const [symbol, zahlungen] of Object.entries(dividenden.titel)) {
  const kurs = letzterKurs(symbol)
  if (kurs === null || kurs <= 0) continue
  const befund = werteDividenden(zahlungen, kurs, heute)
  if (!befund || befund.renditeProzent === null) continue

  geprueftRendite += 1
  renditeWerte.push(befund.renditeProzent)
  if (befund.renditeProzent > RENDITE_MAX) {
    auffaelligeRendite.push(
      `${symbol}: ${befund.renditeProzent.toFixed(1)} % aus ` +
        `${befund.summeZwoelfMonate} je Aktie bei Kurs ${kurs}`
    )
  }
}

pruefe(`es wurden Renditen gerechnet (${geprueftRendite})`, geprueftRendite > 50)

/*
  Wie nah die Grenze am echten Höchstwert liegt – ausgegeben, nicht geprüft.

  Am 5. September 2026 nachgemessen: Der höchste echte Wert war
  `johnson-matthey` mit 25,8 Prozent, die Grenze steht bei 35. Das ist **Faktor
  1,35** – deutlich enger als bei der Sprungprüfung unten, wo derselbe Abstand
  „fast das Doppelte" beträgt und ausdrücklich als ausreichend begründet ist.

  Die Grenze ist trotzdem richtig gesetzt: Sie ist aus dem Faktor 100
  hergeleitet, den sie fangen soll. Sie anzuheben hieße, den Einheitenfehler
  bei mehr Titeln durchzulassen.

  Aber eine Dividendenrendite ist Dividende **durch Kurs**. Fällt ein Kurs um
  ein Viertel, steigt sie um ein Drittel – und dieser Test hält den
  Nachrichtenlauf an, weil `npm test` vor dem Veröffentlichen läuft. Ein
  Kurssturz bei einem einzigen Titel könnte also die Tagesausgabe kosten,
  ohne dass ein Datenfehler vorliegt.

  Deshalb steht die Zahl hier. Wer sie über 30 steigen sieht, entscheidet
  **vorher**, was dann gelten soll – statt es an einem Morgen um vier Uhr zu
  entscheiden, an dem der Lauf schon rot ist.
*/
const hoechsteRendite = Math.max(0, ...renditeWerte)
console.log(
  `       (höchste echte Rendite ${hoechsteRendite.toFixed(1)} %, Grenze ${RENDITE_MAX} – ` +
    `Abstand Faktor ${(RENDITE_MAX / Math.max(hoechsteRendite, 0.01)).toFixed(2)})`
)

pruefe(
  `jede Dividendenrendite liegt unter ${RENDITE_MAX} Prozent`,
  auffaelligeRendite.length === 0,
  `\n       ${auffaelligeRendite.join('\n       ')}`
)

/* ---------------------------------------------------------------------------
   Der Einheitenfehler, unabhängig von der Höhe der Rendite
--------------------------------------------------------------------------- */

/*
  Die Renditegrenze oben fängt einen Faktor 100 nur bei Titeln, deren echte
  Rendite hoch genug ist. Bei 46 der 773 liegt sie unter 0,35 Prozent – dort
  ergäbe auch der hundertfache Betrag noch eine Zahl unter der Grenze, und der
  Fehler ginge durch.

  Diese Prüfung sieht ihn trotzdem, weil sie den Titel **gegen sich selbst**
  hält: Ein Einheitenfehler multipliziert die ganze Reihe, also auch das
  Verhältnis zwischen diesem Jahr und den Jahren davor. Eine Sonderausschüttung
  tut das nicht – sie hebt ein Jahr, nicht die Reihe.

  Gemessen am 19. August 2026 über 849 Titel mit vergleichbarer Vergangenheit:

  | Titel            | Faktor |
  | ---------------- | -----: |
  | cellnex          |  16,24 |
  | nvidia           |  11,91 |
  | royal-caribbean  |   8,16 |
  | progressive      |   6,66 |
  | johnson-matthey  |   5,64 |

  Nichts über 20; die Grenze steht bei 30. Der Abstand zum höchsten echten
  Wert ist damit fast das Doppelte – eine Grenze, die den guten Tag gerade
  eben trägt, wäre eine Wette. Ein Faktor 100 liegt weit darüber.

  Titel ohne vier Vergleichsjahre bleiben außen vor: Wer erst seit einem Jahr
  zahlt, hat kein „vorher", und eine Zahl daraus wäre erfunden.
*/
const SPRUNG_MAX = 30

const vorJahren = (n: number) => plusTageIso(heute, -365 * n)
const auffaelligerSprung: string[] = []
const sprungWerte: number[] = []
let geprueftSprung = 0

for (const [symbol, zahlungen] of Object.entries(dividenden.titel)) {
  const gueltig = zahlungen.filter((z) => z.amount > 0)
  const diesesJahr = gueltig
    .filter((z) => z.date > vorJahren(1))
    .reduce((summe, z) => summe + z.amount, 0)
  const davor = gueltig.filter((z) => z.date <= vorJahren(1) && z.date > vorJahren(5))
  if (diesesJahr <= 0 || davor.length < 4) continue

  const schnitt = davor.reduce((summe, z) => summe + z.amount, 0) / 4
  if (schnitt <= 0) continue

  geprueftSprung += 1
  const faktor = diesesJahr / schnitt
  sprungWerte.push(faktor)
  if (faktor > SPRUNG_MAX) {
    auffaelligerSprung.push(
      `${symbol}: Faktor ${faktor.toFixed(1)} – ${diesesJahr.toFixed(2)} in zwölf ` +
        `Monaten gegen ${schnitt.toFixed(2)} im Jahresschnitt davor`
    )
  }
}

pruefe(`es wurden Sprünge geprüft (${geprueftSprung})`, geprueftSprung > 100)

/*
  Auch hier der laufend gemessene Abstand statt der Tabelle von oben. Sie
  stammt vom 19. August 2026 und altert – eine Zahl, die bei jedem Lauf neu
  entsteht, tut das nicht.
*/
const hoechsterSprung = Math.max(0, ...sprungWerte)
console.log(
  `       (höchster echter Sprung Faktor ${hoechsterSprung.toFixed(1)}, Grenze ${SPRUNG_MAX} – ` +
    `Abstand Faktor ${(SPRUNG_MAX / Math.max(hoechsterSprung, 0.01)).toFixed(2)})`
)

pruefe(
  `keine Zwölfmonatssumme über dem ${SPRUNG_MAX}-fachen des eigenen Schnitts`,
  auffaelligerSprung.length === 0,
  `\n       ${auffaelligerSprung.join('\n       ')}`
)

/*
  Die Gegenprobe.

  Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe. Hier bekommt sie
  deshalb genau den Fehler vorgelegt, für den sie gebaut ist: dieselbe Reihe,
  hundertfach – als stünde der Kurs in Pfund und die Dividende in Pence.

  Genommen wird ein echter Titel aus dem Bestand, nicht eine erfundene Reihe:
  Eine Prüfung, die nur an ausgedachten Zahlen greift, hat noch nichts über
  die Daten gesagt.
*/
const probeTitel = Object.entries(dividenden.titel).find(([, z]) => {
  const g = z.filter((x) => x.amount > 0)
  return (
    g.filter((x) => x.date > vorJahren(1)).length > 0 &&
    g.filter((x) => x.date <= vorJahren(1) && x.date > vorJahren(5)).length >= 4
  )
})

if (probeTitel) {
  const [, zahlungen] = probeTitel
  const hundertfach = zahlungen.map((z) =>
    z.date > vorJahren(1) ? { ...z, amount: z.amount * 100 } : z
  )
  const jahr = hundertfach
    .filter((z) => z.amount > 0 && z.date > vorJahren(1))
    .reduce((summe, z) => summe + z.amount, 0)
  const davor = hundertfach.filter(
    (z) => z.amount > 0 && z.date <= vorJahren(1) && z.date > vorJahren(5)
  )
  const schnitt = davor.reduce((summe, z) => summe + z.amount, 0) / 4

  pruefe(
    'die Sprungprüfung fängt eine hundertfache Reihe',
    jahr / schnitt > SPRUNG_MAX,
    `Faktor ${(jahr / schnitt).toFixed(1)} bei ${probeTitel[0]} – ` +
      'wenn der durchgeht, prüft die Zeile darüber nichts.'
  )
} else {
  pruefe('die Sprungprüfung fängt eine hundertfache Reihe', false, 'kein Probetitel')
}

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
