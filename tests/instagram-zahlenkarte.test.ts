/**
 * Die Zahlenkarte: Daten, Beschriftung und das gesetzte Bild.
 *
 * Ausführen mit `npm test`. Anlass und Form in `lib/instagram-zahlenkarte.ts`.
 */
import { readFileSync } from 'node:fs'

import { zahlenkarten, aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { RECHTSHINWEIS } from '@/lib/instagram-plan'
import {
  beschriftungZahlenkarte,
  pruefeZahlenkarte,
  signetOhneMitte,
  zahlenkartePng,
  ZK_BREITE,
  ZK_HOEHE,
  type Rangkarte,
  type Vergleichskarte,
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

for (const k of zahlenkarten)
  pruefe(
    `Karte vom ${k.datum} hält die Form ein`,
    pruefeZahlenkarte(k).length === 0,
    pruefeZahlenkarte(k).join(' | ')
  )
pruefe(
  'jedes Datum höchstens einmal',
  new Set(zahlenkarten.map((k) => k.datum)).size === zahlenkarten.length
)

/* Die Prüfung muss beanstanden, was das Muster verfehlt. */
const gut = aktuelleZahlenkarte()!
const kaputt: Zahlenkarte = {
  ...gut,
  titel: [{ text: 'Ohne Pointe' }],
  fusszeile: 'Stand: 2025',
  schlagworte: ['a b', 'zwei'],
  text: 'Kein Quellenhinweis',
}
const fehler = pruefeZahlenkarte(kaputt)
for (const teil of [
  'grüne Pointe',
  'keine Quelle',
  'Quellen',
  'genau fünf',
  'Schlagwort „a b"',
])
  pruefe(
    `beanstandet: ${teil}`,
    fehler.some((f) => f.includes(teil)),
    fehler.join(' | ')
  )

/* Beschriftung: Rechtshinweis mit KI-Hinweis wörtlich, fünf Schlagworte. */
const b = beschriftungZahlenkarte(gut)
pruefe('die Beschriftung trägt den Rechtshinweis wörtlich', b.includes(RECHTSHINWEIS))
pruefe('und den KI-Hinweis', b.includes('mit Unterstützung von KI erstellt'))
pruefe('fünf Schlagworte', (b.match(/#[a-zäöüß0-9]+/g) ?? []).length === 5)

/* Die Rangliste muss beanstanden, was ihre Form verfehlt. */
const rang: Rangkarte = {
  ...(zahlenkarten.find((k) => k.art === 'rangliste') as Rangkarte),
  zeilen: [
    { name: 'Klein', wert: 40, land: 'DEU', hervor: true },
    { name: 'Gross', wert: 90, land: 'POL', hervor: true },
    { name: 'Zu viel', wert: 140, land: 'ITA' },
    { name: 'Fremd', wert: 10, land: 'XYZ' },
  ],
}
const rangFehler = pruefeZahlenkarte(rang)
for (const teil of [
  'absteigend',
  'genau eine hervorgehobene',
  '0 bis 100',
  'keine Flagge',
])
  pruefe(
    `Rangliste beanstandet: ${teil}`,
    rangFehler.some((f) => f.includes(teil)),
    rangFehler.join(' | ')
  )
pruefe(
  'Rangliste beanstandet zwölf Zeilen',
  pruefeZahlenkarte({
    ...rang,
    zeilen: Array.from({ length: 12 }, (_, i) => ({
      name: `L${i}`,
      wert: 90 - i,
      land: 'DEU',
      hervor: i === 0,
    })),
  }).some((f) => f.includes('12 Zeilen'))
)

/*
  Die Zahlen der Karte vom 15.10.2026 stammen aus dem Datenbestand der
  Website – und dürfen sich nicht unbemerkt davon lösen. Der EU-Schnitt
  steht nicht in `laender.json`; er kommt aus derselben Eurostat-Antwort,
  die `tests/wohneigentum.test.ts` liest.
*/
const laender: Record<string, { wohneigentumsquote?: { wert: number } }> = JSON.parse(
  readFileSync('data/snapshots/laender.json', 'utf8')
).laender
const eurostat = JSON.parse(
  readFileSync('tests/fixtures/eurostat-ilc_lvho02-2025.json', 'utf8')
)
const wohnen = zahlenkarten.find((k) => k.datum === '2026-10-15') as Rangkarte
for (const z of wohnen.zeilen) {
  const soll =
    z.land === 'EU27'
      ? eurostat.value[eurostat.dimension.geo.category.index.EU27_2020]
      : laender[z.land]?.wohneigentumsquote?.wert
  pruefe(`${z.name} wie im Bestand (${soll})`, z.wert === soll, `Karte ${z.wert}`)
}
pruefe(
  'Deutschland ist hervorgehoben und das Schlusslicht aller Länder im Bestand',
  wohnen.zeilen.find((z) => z.hervor)?.land === 'DEU' &&
    Object.values(laender).every(
      (l) => !l.wohneigentumsquote || l.wohneigentumsquote.wert >= 47.2
    )
)
pruefe(
  'der Spitzenreiter steht oben',
  wohnen.zeilen[0].wert ===
    Math.max(...Object.values(laender).map((l) => l.wohneigentumsquote?.wert ?? 0))
)

/*
  Das Signet ohne „IMI" – wie im Vorbild. Fünf Flächen im Logo, vier im
  Signet; die vier Figuren bleiben (je eine Farbe, Grau einmal).
*/
const logoSvg = readFileSync('public/logo.svg', 'utf8')
const signet = signetOhneMitte(logoSvg)
const flaechen = (svg: string) => (svg.match(/<path/g) ?? []).length
pruefe('das Logo hat fünf Flächen', flaechen(logoSvg) === 5, String(flaechen(logoSvg)))
pruefe('das Signet vier', flaechen(signet) === 4, String(flaechen(signet)))
for (const farbe of ['#17296F', '#6E6E6E', '#8B2225', '#205437'])
  pruefe(`die Figur in ${farbe} bleibt`, signet.includes(`fill="${farbe}"`))
pruefe(
  'eine fremde letzte Fläche bleibt stehen',
  signetOhneMitte('<svg><path fill="#000" d="M0 0"/></svg>') ===
    '<svg><path fill="#000" d="M0 0"/></svg>'
)

/* Das Bild: PNG im Format 1080 × 1350 – in beiden Formen. */
const vergleich: Vergleichskarte = {
  datum: '2026-10-12',
  titel: [{ text: 'Zwei Balken' }, { text: 'zum Vergleich', gruen: true }],
  links: {
    name: 'Links',
    wert: 47.2,
    anzeige: '47,2 %',
    zusatz: 'im Eigentum',
    flagge: ['#000', '#d00', '#fc0'],
  },
  rechts: { name: 'Rechts', wert: 87.2, anzeige: '87,2 %', zusatz: 'im Eigentum' },
  differenz: { text: '+40,0', zusatz: 'Prozentpunkte' },
  fusszeile: 'Stand: 2025 | Quelle: Beispiel',
  text: 'Beispiel.\nQuellen: Beispiel',
  schlagworte: ['eins', 'zwei', 'drei', 'vier', 'fuenf'],
}
pruefe('die Vergleichskarte hält die Form ein', pruefeZahlenkarte(vergleich).length === 0)
for (const [form, karte] of [
  ['Rangliste', wohnen],
  ['Vergleich', vergleich],
] as const) {
  const png = await zahlenkartePng(karte, readFileSync('public/logo.svg', 'utf8'))
  pruefe(`${form}: das Bild ist ein PNG`, png.subarray(1, 4).toString() === 'PNG')
  pruefe(
    `${form}: im Format ${ZK_BREITE} × ${ZK_HOEHE}`,
    png.readUInt32BE(16) === ZK_BREITE && png.readUInt32BE(20) === ZK_HOEHE,
    `${png.readUInt32BE(16)} × ${png.readUInt32BE(20)}`
  )
}

/* Die Karte vom 16.10.2026 – jede Zahl gegen ihre Quelle im Bestand. */
const inflation = zahlenkarten.find((k) => k.datum === '2026-10-16') as Vergleichskarte
const nachricht = readFileSync('data/news.ts', 'utf8')
pruefe(
  '3,7 % wie in der Meldung vom 14.10.',
  inflation.rechts.wert === 3.7 &&
    nachricht.includes(
      'Die US-Verbraucherpreise sind im September um 3,7 Prozent gestiegen'
    )
)
pruefe(
  '2 % Inflationsziel wie in derselben Meldung',
  inflation.links.wert === 2 &&
    nachricht.includes('Inflationsziel der US-Notenbank von 2 Prozent')
)
const ff = JSON.parse(
  readFileSync('tests/fixtures/forexfactory-2026-10-16.json', 'utf8')
) as { title: string; country: string; forecast: string; previous: string }[]
const cpi = ff.find((e) => e.country === 'USD' && e.title === 'CPI y/y')
pruefe(
  'Prognose 3,6 % und Vormonat 3,4 % wie bei ForexFactory',
  cpi?.forecast === '3.6%' &&
    cpi?.previous === '3.4%' &&
    inflation.text.includes('3,6 %') &&
    inflation.text.includes('3,4 %')
)
pruefe(
  'die Differenz ist gerechnet: +1,7',
  inflation.differenz.text ===
    `+${(inflation.rechts.wert - inflation.links.wert).toFixed(1).replace('.', ',')}`
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
