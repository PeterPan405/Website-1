/**
 * Der Begriff (26.11.2026, Ideenpool Nr. 3 „Begriffe der Woche“): ein Wort,
 * das gerade überall fällt, in einem Satz erklärt – und darunter das
 * Beispiel aus dieser Woche als Kurslinie seit vor dem Hoch, mit den
 * Grenzen als gestrichelte Linien (etwa −10 % und −20 % unter dem Hoch).
 * Eine Seite; im Dossier eine je Begriff.
 *
 * Der Abstand zum Hoch wird aus der Reihe gerechnet, nicht eingetragen: Die
 * Karte nennt das Hoch, den letzten Kurs und die Prozentzahl, und die
 * Prüfung beanstandet, wenn die drei nicht zusammenpassen.
 */
import { createElement as h } from 'react'

import {
  STIL,
  STIL_RAND,
  ZK_BREITE,
  achsenschritt,
  svgAdresse,
} from '../../instagram-zahlenkarte.ts'
import {
  OBEN_ERSTE,
  OBEN_FOLGE,
  UNTEN,
  prozent,
  pruefeGemeinsam,
  rahmen,
  zahl,
  type Art,
  type Element,
  type NeuGemeinsam,
} from './rahmen.ts'

export interface Begriffkarte extends NeuGemeinsam {
  art: 'begriff'
  /** Die Erklärung in einem oder zwei Sätzen – höchstens 150 Zeichen. */
  erklaerung: string
  /** Das Beispiel: Name und Kursreihe (Schlusskurse, aufsteigend). */
  beispiel: string
  reihe: readonly (readonly [string, number])[]
  einheit: string
  stellen?: number
  /** Grenzen als Betrag unter dem Hoch der Reihe, gestrichelt: [10, 20]. */
  grenzen: number[]
  satz?: string
}

const MONATE = [
  'Jan.',
  'Feb.',
  'März',
  'Apr.',
  'Mai',
  'Juni',
  'Juli',
  'Aug.',
  'Sep.',
  'Okt.',
  'Nov.',
  'Dez.',
]

/**
 * Hoch der Reihe, tiefster Schluss danach und letzter Wert, je mit Abstand in
 * Prozent (negativ). Korrektur und Bärenmarkt werden vom Hoch zum tiefsten
 * Schluss gemessen und enden erst mit einem neuen Hoch – deshalb zählt der
 * tiefste Stand, nicht nur der letzte.
 */
export function abstandZumHoch(reihe: Begriffkarte['reihe']) {
  let hoch = reihe[0]
  for (const p of reihe) if (p[1] > hoch[1]) hoch = p
  const danach = reihe.filter(([d]) => d >= hoch[0])
  let tief = danach[0]
  for (const p of danach) if (p[1] < tief[1]) tief = p
  const letzt = reihe[reihe.length - 1]
  return {
    hoch,
    tief,
    letzt,
    prozent: (letzt[1] / hoch[1] - 1) * 100,
    tiefProzent: (tief[1] / hoch[1] - 1) * 100,
  }
}

const tagKurz = (d: string) => `${Number(d.slice(8, 10))}.${Number(d.slice(5, 7))}.`

export const begriff: Art<Begriffkarte> = {
  seiten: () => 1,
  seite(k, logo) {
    const folge = ((k as { _dossier?: { seite: number } })._dossier?.seite ?? 1) > 1
    const start = folge ? OBEN_FOLGE + 10 : OBEN_ERSTE
    const {
      hoch,
      tief: tiefst,
      letzt,
      prozent: abstand,
      tiefProzent,
    } = abstandZumHoch(k.reihe)
    const tiefEigen = tiefst[0] !== letzt[0]
    const n = k.stellen ?? 0

    /* Die Erklärung oben, darunter die Beispielzeile, dann die Grafik. */
    const oben = start + 300
    const unten = UNTEN - (k.satz ? 110 : 60)
    const links = STIL_RAND + 90
    const rechts = ZK_BREITE - STIL_RAND - 170
    const werte = k.reihe.map(([, v]) => v)
    const tiefWert = Math.min(...werte, hoch[1] * (1 - Math.max(...k.grenzen) / 100))
    const s = achsenschritt(hoch[1] - tiefWert, 5)
    /* Etwas Luft unter dem Tief, damit seine Beschriftung nicht auf der Achse liegt. */
    const tief = Math.floor((tiefWert - 0.25 * s) / s) * s
    const hochAchse = Math.ceil(hoch[1] / s - 1e-9) * s
    const t0 = Date.parse(k.reihe[0][0])
    const t1 = Date.parse(letzt[0])
    const X = (d: string) => links + ((Date.parse(d) - t0) / (t1 - t0)) * (rechts - links)
    const Y = (v: number) => unten - ((v - tief) / (hochAchse - tief)) * (unten - oben)

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ZK_BREITE}" height="${unten + 4}">`
    const ticks: number[] = []
    for (let v = tief; v <= hochAchse + 1e-9; v += s) {
      ticks.push(v)
      svg += `<line x1="${links}" x2="${rechts}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === tief ? STIL.hellgrau : STIL.rand}" stroke-width="${v === tief ? 2.5 : 1.5}"/>`
    }
    /* Die Fächer unter dem Hoch, leicht getönt. */
    const stufen = [0, ...k.grenzen]
    for (let i = 0; i < stufen.length; i++) {
      const y0 = Y(hoch[1] * (1 - stufen[i] / 100))
      const y1 = i + 1 < stufen.length ? Y(hoch[1] * (1 - stufen[i + 1] / 100)) : unten
      svg += `<rect x="${links}" y="${y0}" width="${rechts - links}" height="${Math.max(0, y1 - y0)}" fill="${STIL.rot}" fill-opacity="${[0.03, 0.08, 0.15][i] ?? 0.15}"/>`
    }
    for (const g of k.grenzen) {
      const y = Y(hoch[1] * (1 - g / 100))
      svg += `<line x1="${links}" x2="${rechts + 20}" y1="${y}" y2="${y}" stroke="${STIL.rot}" stroke-width="2.5" stroke-dasharray="10 8"/>`
    }
    svg += `<polyline fill="none" stroke="${STIL.navy}" stroke-width="3.5" stroke-linejoin="round" points="${k.reihe.map(([d, v]) => `${X(d).toFixed(1)},${Y(v).toFixed(1)}`).join(' ')}"/>`
    svg += `<circle cx="${X(hoch[0])}" cy="${Y(hoch[1])}" r="10" fill="${STIL.navy}" stroke="#ffffff" stroke-width="4"/>`
    if (tiefEigen)
      svg += `<circle cx="${X(tiefst[0])}" cy="${Y(tiefst[1])}" r="10" fill="${STIL.rot}" stroke="#ffffff" stroke-width="4"/>`
    svg += `<circle cx="${X(letzt[0])}" cy="${Y(letzt[1])}" r="10" fill="${tiefEigen ? STIL.navy : STIL.rot}" stroke="#ffffff" stroke-width="4"/>`
    svg += '</svg>'

    const klein = (text: string, stil: Record<string, string | number>): Element =>
      h(
        'div',
        {
          style: {
            position: 'absolute',
            display: 'flex',
            fontFamily: 'Montserrat',
            fontSize: 18,
            color: STIL.hellgrau,
            ...stil,
          },
        },
        text
      )
    const achse: [string, string][] = []
    for (let t = new Date(t0); t.getTime() <= t1; t.setUTCMonth(t.getUTCMonth() + 1)) {
      const d = `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-01`
      if (Date.parse(d) >= t0) achse.push([d, MONATE[t.getUTCMonth()]])
      t.setUTCDate(1)
    }
    const schritt = Math.ceil(achse.length / 7)
    const hochRechts = X(hoch[0]) > ZK_BREITE / 2
    return rahmen(k, logo, {
      seite: 1,
      seiten: 1,
      satz: k.satz,
      inhalt: [
        h(
          'div',
          {
            style: {
              position: 'absolute',
              top: start,
              left: STIL_RAND,
              right: STIL_RAND,
              display: 'flex',
              padding: '26px 30px',
              borderLeft: `6px solid ${STIL.navy}`,
              backgroundColor: '#f4f6fa',
              fontFamily: 'Montserrat',
              fontSize: 29,
              lineHeight: 1.4,
              color: STIL.tinte,
            },
          },
          k.erklaerung
        ),
        klein(`Beispiel: ${k.beispiel}`, {
          top: start + 196,
          left: STIL_RAND,
          fontSize: 26,
          fontWeight: 800,
          color: STIL.tinte,
        }),
        klein(
          tiefEigen
            ? `Hoch ${zahl(hoch[1], n)} · Tief ${zahl(tiefst[1], n)} · ${tagKurz(letzt[0])} ${zahl(letzt[1], n)} ${k.einheit}`
            : `Hoch ${zahl(hoch[1], n)} → ${tagKurz(letzt[0])} ${zahl(letzt[1], n)} ${k.einheit}`,
          { top: start + 234, left: STIL_RAND, fontSize: 22, color: STIL.grau }
        ),
        h('img', {
          src: svgAdresse(svg),
          width: ZK_BREITE,
          height: unten + 4,
          style: { position: 'absolute', top: 0, left: 0 },
        }),
        ...ticks.map((v) => klein(zahl(v, 0), { top: Y(v) - 12, left: STIL_RAND })),
        ...achse
          .filter((_, i) => i % schritt === 0)
          .map(([d, text]) =>
            klein(text, {
              top: unten + 10,
              left: X(d) - 30,
              width: 60,
              justifyContent: 'center',
            })
          ),
        ...k.grenzen.map((g) =>
          klein(`−${g} %`, {
            top: Y(hoch[1] * (1 - g / 100)) - 14,
            left: rechts + 28,
            fontSize: 21,
            fontWeight: 700,
            color: STIL.rot,
          })
        ),
        klein(`Hoch ${tagKurz(hoch[0])}`, {
          top: Y(hoch[1]) - 46,
          ...(hochRechts
            ? { right: ZK_BREITE - X(hoch[0]) - 20 }
            : { left: X(hoch[0]) - 20 }),
          fontSize: 20,
          fontWeight: 700,
          color: STIL.navy,
        }),
        ...(tiefEigen
          ? [
              klein(`Tief ${tagKurz(tiefst[0])} ${prozent(tiefProzent, 1)}`, {
                /* Am Boden der Achse links neben den Punkt, sonst darunter. */
                ...(Y(tiefst[1]) + 50 > unten
                  ? { top: Y(tiefst[1]) - 14, right: ZK_BREITE - X(tiefst[0]) + 18 }
                  : { top: Y(tiefst[1]) + 16, right: ZK_BREITE - X(tiefst[0]) - 20 }),
                fontSize: 20,
                fontWeight: 700,
                color: STIL.rot,
              }),
            ]
          : []),
        klein(`${tagKurz(letzt[0])} ${prozent(abstand, 1)}`, {
          top: Y(letzt[1]) - 14,
          left: X(letzt[0]) + 18,
          fontSize: 20,
          fontWeight: 700,
          color: tiefEigen ? STIL.navy : STIL.rot,
        }),
      ],
    })
  },
  pruefe(k) {
    const f = pruefeGemeinsam(k)
    if (k.erklaerung.length > 150)
      f.push(`Erklärung hat ${k.erklaerung.length} Zeichen – höchstens 150.`)
    if (k.reihe.length < 20) f.push('Weniger als 20 Werte in der Reihe.')
    for (let i = 1; i < k.reihe.length; i++)
      if (k.reihe[i][0] <= k.reihe[i - 1][0]) {
        f.push('Die Reihe ist nicht aufsteigend nach Tag.')
        break
      }
    if (k.grenzen.length < 1 || k.grenzen.length > 2)
      f.push(`${k.grenzen.length} Grenzen – eine oder zwei.`)
    const { hoch, letzt } = abstandZumHoch(k.reihe)
    if (hoch[0] === letzt[0])
      f.push('Das Hoch ist der letzte Tag – kein Abstand zu zeigen.')
    if (k.beispiel.length > 22)
      f.push(`Beispiel „${k.beispiel}“ zu lang – höchstens 22 Zeichen.`)
    return f
  },
}
