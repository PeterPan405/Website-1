/**
 * Die neuen Kartenarten (15.11.2026): Jede hat eine Musterkarte in
 * `data/instagram-muster.ts`. Hier wird jede gesetzt, geprüft und ihre Zahlen
 * gegen den Bestand nachgerechnet – und jede Prüfung bekommt etwas vorgelegt,
 * das sie beanstanden **muss** (AGENTS.md: „Eine Absicherung, die nie
 * anschlägt, sieht aus wie Ruhe“).
 */
import { readFileSync } from 'node:fs'

import { musterkarten } from '@/data/instagram-muster'
import { NEUE_ARTEN } from '@/lib/instagram/arten/index'
import { ampelFarbe } from '@/lib/instagram/arten/ampel'
import { zaehleTage } from '@/lib/instagram/arten/kalender'
import { wochenkerzen } from '@/lib/instagram/arten/kerzen'
import { plaetze } from '@/lib/instagram/arten/rangwechsel'
import { wasserfallEnde } from '@/lib/instagram/arten/wasserfall'
import {
  form,
  pruefeZahlenkarte,
  zahlenkarteSeitePng,
  zahlenkarteSeiten,
  type Zahlenkarte,
} from '@/lib/instagram-zahlenkarte'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const logo = readFileSync('public/logo.svg', 'utf8')
const roh = JSON.parse(readFileSync('data/snapshots/markets.json', 'utf8'))
  .instruments as Record<string, { points: { d: string; c: number }[] }>
const runde = (v: number, stellen: number) =>
  Math.round(v * 10 ** stellen) / 10 ** stellen

/* Jede angemeldete Art hat eine Musterkarte, und jede Musterkarte ist sauber. */
for (const art of Object.keys(NEUE_ARTEN)) {
  const k = musterkarten.find((m) => m.art === art)
  pruefe(`${art}: Musterkarte vorhanden`, k !== undefined)
  if (!k) continue
  const f = pruefeZahlenkarte(k)
  pruefe(`${art}: keine Beanstandung`, f.length === 0, f.join(' | '))
  pruefe(`${art}: form() nennt die Art`, form(k) === art)
  for (let n = 1; n <= zahlenkarteSeiten(k); n++) {
    const png = await zahlenkarteSeitePng(k, logo, n)
    pruefe(`${art}: Seite ${n} ist ein PNG`, png.subarray(1, 4).toString() === 'PNG')
  }
}

function muster<A extends Zahlenkarte['art']>(art: A) {
  return musterkarten.find((m) => m.art === art) as Extract<Zahlenkarte, { art: A }>
}

/* Kurszettel: Veränderung über fünf Handelstage bis zum letzten Kurs. */
{
  const k = muster('kurszettel')
  const symbol: Record<string, string> = {
    AMD: 'amd',
    Dell: 'dell',
    Infineon: 'infineon',
    Micron: 'micron',
    Intel: 'intel',
    Nvidia: 'nvidia',
  }
  for (const z of k.zeilen) {
    const p = roh[symbol[z.name]].points
    const v = runde((p.at(-1)!.c / p.at(-6)!.c - 1) * 100, 1)
    pruefe(`Kurszettel: ${z.name} ${v} %`, v === z.aenderung, `Muster: ${z.aenderung}`)
  }
  const kaputt = { ...k, zeilen: k.zeilen.slice(0, 2) }
  pruefe(
    'Kurszettel: zwei Zeilen werden beanstandet',
    pruefeZahlenkarte(kaputt).some((f) => f.includes('drei bis acht'))
  )
}

/* Punktraster: Anteile der Weltregionen an den Einwohnern, auf ganze Punkte. */
{
  const k = muster('punktraster')
  const laender = JSON.parse(readFileSync('data/snapshots/laender.json', 'utf8'))
    .laender as Record<string, { region?: string; einwohner?: number }>
  const je: Record<string, number> = {}
  for (const l of Object.values(laender))
    if (l.region && l.einwohner) je[l.region] = (je[l.region] ?? 0) + l.einwohner
  const summe = Object.values(je).reduce((s, v) => s + v, 0)
  const name: Record<string, string> = {
    Asien: 'Asia',
    Afrika: 'Africa',
    Amerika: 'Americas',
    Europa: 'Europe',
    Ozeanien: 'Oceania',
  }
  for (const t of k.teile)
    pruefe(
      `Punktraster: ${t.name} ${t.punkte} von 100`,
      Math.round((je[name[t.name]] / summe) * 100) === t.punkte
    )
  const kaputt = { ...k, teile: [{ ...k.teile[0], punkte: 58 }, ...k.teile.slice(1)] }
  pruefe(
    'Punktraster: 99 Punkte werden beanstandet',
    pruefeZahlenkarte(kaputt).some((f) => f.includes('genau 100'))
  )
}

/* Kalender: jeder Handelstag des DAX 2026, Veränderung zum Vortag. */
{
  const k = muster('kalender')
  const p = roh.dax.points.filter((x) => x.d >= '2025-12-31')
  const erwartet = p
    .slice(1)
    .map((x, i) => ({ t: x.d, wert: runde((x.c / p[i].c - 1) * 100, 2) }))
  pruefe(
    `Kalender: ${erwartet.length} Handelstage wie im Bestand`,
    JSON.stringify(erwartet) === JSON.stringify(k.tage)
  )
  const { plus, minus } = zaehleTage(k)
  pruefe(
    `Kalender: ${plus} im Plus, ${minus} im Minus`,
    plus + minus <= k.tage.length && plus > 0
  )
  const kaputt = { ...k, tage: k.tage.slice(0, 20) }
  pruefe(
    'Kalender: ein Monat wird beanstandet',
    pruefeZahlenkarte(kaputt).some((f) => f.includes('drei bis zwölf'))
  )
}

/* Tacho: Gold 2026 zwischen Tief und Hoch der Schlusskurse. */
{
  const k = muster('tacho')
  const g = roh.gold.points.filter((x) => x.d >= '2026-01-01')
  const tief = Math.min(...g.map((x) => x.c))
  const hoch = Math.max(...g.map((x) => x.c))
  pruefe(
    'Tacho: Tief, Hoch und letzter Kurs wie im Bestand',
    k.von.wert === tief && k.bis.wert === hoch && k.ist.wert === g.at(-1)!.c
  )
  pruefe(
    'Tacho: „27 % weniger als im Januar“',
    Math.round((1 - k.ist.wert / k.bis.wert) * 100) === 27
  )
  const kaputt = { ...k, ist: { ...k.ist, wert: hoch + 1 } }
  pruefe(
    'Tacho: Wert über dem Hoch wird beanstandet',
    pruefeZahlenkarte(kaputt).some((f) => f.includes('außerhalb'))
  )
}

/* Wasserfall: DAX-Monatsschluss gegen Vormonat, ab Schluss 2025; das Ende ist der letzte Kurs. */
{
  const k = muster('wasserfall')
  const p = roh.dax.points
  const basis = p.filter((x) => x.d < '2026-01-01').at(-1)!
  pruefe('Wasserfall: Start ist der Schluss 2025', k.start.wert === basis.c)
  const monate = new Map<string, number>()
  for (const x of p) if (x.d >= '2026-01') monate.set(x.d.slice(0, 7), x.c)
  let vor = basis.c
  const schritte = [...monate.values()].map((c) => {
    const d = runde(c - vor, 2)
    vor = c
    return d
  })
  pruefe(
    'Wasserfall: jeder Monatsschritt wie im Bestand',
    JSON.stringify(schritte) === JSON.stringify(k.schritte.map((s) => s.wert))
  )
  pruefe(
    'Wasserfall: Ende = letzter Kurs',
    Math.abs(wasserfallEnde(k) - p.at(-1)!.c) < 0.05
  )
  const kaputt = { ...k, boden: 30000 }
  pruefe(
    'Wasserfall: Boden über dem Start wird beanstandet',
    pruefeZahlenkarte(kaputt).some((f) => f.includes('Boden'))
  )
}

/* Geldfluss: Apple, Umsatz und Nettogewinn aus den SEC-Daten. */
{
  const k = muster('geldfluss')
  const f = JSON.parse(readFileSync('data/snapshots/fundamentaldaten.json', 'utf8'))
    .unternehmen.AAPL as { umsatz: number; gewinn: number }
  pruefe(
    'Geldfluss: Umsatz und Gewinn wie bei der SEC',
    k.quelle.wert === f.umsatz && k.ziele[0].wert === f.gewinn
  )
  pruefe(
    'Geldfluss: „gut ein Viertel“',
    f.gewinn / f.umsatz > 0.25 && f.gewinn / f.umsatz < 0.3
  )
  const kaputt = { ...k, ziele: [k.ziele[0], { ...k.ziele[1], wert: 1 }] }
  pruefe(
    'Geldfluss: Teile, die das Ganze verfehlen, werden beanstandet',
    pruefeZahlenkarte(kaputt).some((t) => t.includes('das Ganze'))
  )
}

/* Kreise: Börsenwert = letzter Kurs × Aktienzahl, in Billionen $. */
{
  const k = muster('kreise')
  const fd = JSON.parse(readFileSync('data/snapshots/fundamentaldaten.json', 'utf8'))
    .unternehmen as Record<string, { aktien: number }>
  const zu: Record<string, [string, string]> = {
    Apple: ['apple', 'AAPL'],
    Nvidia: ['nvidia', 'NVDA'],
    Microsoft: ['microsoft', 'MSFT'],
    Alphabet: ['alphabet', 'GOOGL'],
    Amazon: ['amazon', 'AMZN'],
    Meta: ['meta', 'META'],
  }
  for (const kr of k.kreise) {
    const [sym, tick] = zu[kr.name]
    const wert = runde((roh[sym].points.at(-1)!.c * fd[tick].aktien) / 1e12, 3)
    pruefe(`Kreise: ${kr.name} ${wert} Bio. $`, wert === kr.wert)
  }
  const kaputt = { ...k, kreise: [...k.kreise].reverse() }
  pruefe(
    'Kreise: aufsteigende Reihenfolge wird beanstandet',
    pruefeZahlenkarte(kaputt).some((t) => t.includes('absteigend'))
  )
}

/* Ampel: Schuldenquoten 2025 (IWF), Farbe aus der Regel. */
{
  const k = muster('ampel')
  const laender = JSON.parse(readFileSync('data/snapshots/laender.json', 'utf8')).laender
  const code: Record<string, string> = {
    Niederlande: 'NLD',
    Polen: 'POL',
    Deutschland: 'DEU',
    Österreich: 'AUT',
    Spanien: 'ESP',
    Frankreich: 'FRA',
    Italien: 'ITA',
    Griechenland: 'GRC',
  }
  for (const z of k.zeilen)
    pruefe(
      `Ampel: ${z.name} ${z.wert} %`,
      laender[code[z.name]].schuldenquote.wert === z.wert &&
        laender[code[z.name]].schuldenquote.jahr === 2025
    )
  const rot = k.zeilen.filter((z) => ampelFarbe(k, z.wert) === 'rot').length
  pruefe(
    'Ampel: „Vier über 90 %“',
    rot === 4 && k.titel.some((t) => t.text.startsWith('Vier'))
  )
  pruefe(
    'Ampel: 60 % ist noch grün, 60,1 % gelb',
    ampelFarbe(k, 60) === 'gruen' && ampelFarbe(k, 60.1) === 'gelb'
  )
  const kaputt = { ...k, regel: { gruenBis: 90, gelbBis: 60 } }
  pruefe(
    'Ampel: verdrehte Regel wird beanstandet',
    pruefeZahlenkarte(kaputt).some((t) => t.includes('verdreht'))
  )
}

/* Rangwechsel, Streuung, Netz: aus Kursen (markets.json) und SEC-Daten (fundamentaldaten.json). */
{
  const fd = JSON.parse(readFileSync('data/snapshots/fundamentaldaten.json', 'utf8'))
    .unternehmen as Record<
    string,
    {
      umsatz: number
      gewinn: number
      cashflow: number
      eigenkapital: number
      aktien: number
    }
  >
  const zu: Record<string, [string, string]> = {
    Apple: ['apple', 'AAPL'],
    Nvidia: ['nvidia', 'NVDA'],
    Microsoft: ['microsoft', 'MSFT'],
    Alphabet: ['alphabet', 'GOOGL'],
    Amazon: ['amazon', 'AMZN'],
    Meta: ['meta', 'META'],
  }
  const rw = muster('rangwechsel')
  for (const r of rw.reihen) {
    const [sym, tick] = zu[r.name]
    const werte = Array.from({ length: 11 }, (_, m) => {
      const mon = `2026-${String(m + 1).padStart(2, '0')}`
      const c = roh[sym].points.filter((x) => x.d.startsWith(mon)).at(-1)!.c
      return runde((c * fd[tick].aktien) / 1e12, 3)
    })
    pruefe(
      `Rangwechsel: ${r.name} je Monat wie gerechnet`,
      JSON.stringify(werte) === JSON.stringify(r.werte)
    )
  }
  const pl = plaetze(rw)
  pruefe('Rangwechsel: Nvidia im November auf Platz 2', pl[0].at(-1) === 2)
  const gleich = {
    ...rw,
    reihen: rw.reihen.map((r) => ({ ...r, werte: r.werte.map(() => 1) })),
  }
  pruefe(
    'Rangwechsel: Gleichstand wird beanstandet',
    pruefeZahlenkarte(gleich).some((t) => t.includes('Gleichstand'))
  )

  const st = muster('streuung')
  for (const pt of st.punkte) {
    const [sym, tick] = zu[pt.name]
    const p = roh[sym].points
    const kgv = runde((p.at(-1)!.c * fd[tick].aktien) / fd[tick].gewinn, 1)
    const ytd = runde(
      (p.at(-1)!.c / p.filter((x) => x.d < '2026-01-01').at(-1)!.c - 1) * 100,
      1
    )
    pruefe(`Streuung: ${pt.name} KGV ${kgv}, ${ytd} %`, kgv === pt.x && ytd === pt.y)
  }
  pruefe(
    'Streuung: Apple hat das höchste KGV',
    st.punkte.every((p) => p.x <= st.punkte.find((q) => q.name === 'Apple')!.x)
  )
  pruefe(
    'Streuung: falscher Hervorgehobener wird beanstandet',
    pruefeZahlenkarte({ ...st, hervor: 'Tesla' }).some((t) => t.includes('Tesla'))
  )

  const nz = muster('netz')
  const a = fd.AAPL
  const m = fd.MSFT
  const soll: [number, number][] = [
    [runde(a.umsatz / 1e9, 3), runde(m.umsatz / 1e9, 3)],
    [runde(a.gewinn / 1e9, 3), runde(m.gewinn / 1e9, 3)],
    [runde((a.gewinn / a.umsatz) * 100, 1), runde((m.gewinn / m.umsatz) * 100, 1)],
    [runde(a.cashflow / 1e9, 1), runde(m.cashflow / 1e9, 1)],
    [
      runde((a.gewinn / a.eigenkapital) * 100, 1),
      runde((m.gewinn / m.eigenkapital) * 100, 1),
    ],
  ]
  soll.forEach((w, i) =>
    pruefe(
      `Netz: ${nz.achsen[i].name} ${w.join(' / ')}`,
      JSON.stringify(w) === JSON.stringify(nz.achsen[i].werte)
    )
  )
  pruefe(
    'Netz: vier Achsen werden beanstandet',
    pruefeZahlenkarte({ ...nz, achsen: nz.achsen.slice(0, 4) }).some((t) =>
      t.includes('fünf oder sechs')
    )
  )
}

/* Kerzen: Wochenkerzen aus den Tagesschlusskursen von Nvidia. */
{
  const k = muster('kerzen')
  const wochen = wochenkerzen(roh.nvidia.points.filter((x) => x.d >= '2026-07-27'))
  pruefe(
    `Kerzen: ${wochen.length} Wochen wie gerechnet`,
    JSON.stringify(wochen.map(({ auf, zu, hoch, tief }) => ({ auf, zu, hoch, tief }))) ===
      JSON.stringify(k.kerzen.map(({ auf, zu, hoch, tief }) => ({ auf, zu, hoch, tief })))
  )
  pruefe(
    'Kerzen: die markierte Woche ist die vom 9.11.',
    k.kerzen[k.marke!.bei].name === '9.11.'
  )
  const kaputt = { ...k, kerzen: [{ ...k.kerzen[0], hoch: 1 }, ...k.kerzen.slice(1)] }
  pruefe(
    'Kerzen: Docht unter dem Körper wird beanstandet',
    pruefeZahlenkarte(kaputt).some((t) => t.includes('Docht'))
  )
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
