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
import { zaehleTage } from '@/lib/instagram/arten/kalender'
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

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
