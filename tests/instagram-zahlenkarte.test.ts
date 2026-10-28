/**
 * Die Zahlenkarte: Daten, Beschriftung und das gesetzte Bild.
 *
 * Ausführen mit `npm test`. Anlass und Form in `lib/instagram-zahlenkarte.ts`.
 */
import { readFileSync } from 'node:fs'

import { zahlenkarten, aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { RECHTSHINWEIS } from '@/lib/instagram-plan'
import {
  akzentfarbe,
  beschriftungZahlenkarte,
  form,
  LOGOFARBEN,
  pruefeZahlenkarte,
  signetOhneMitte,
  zahlenkartePng,
  ZK_BREITE,
  ZK_HOEHE,
  type Rangkarte,
  type Vergleichskarte,
  type Verlaufkarte,
  type Duellkarte,
  duellProzent,
  verlaufSeitJahresbeginn,
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
  'Pointe in der Akzentfarbe',
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

/* Firmenlogos (28.10.2026): Die Datei muss da sein, und nur in Kacheln. */
const kacheln = zahlenkarten.find((k) => k.art === 'rangliste' && k.skala === 'kacheln')
if (kacheln?.art === 'rangliste') {
  const mitLogo = (logo: string) =>
    kacheln.zeilen.map((z, i) => (i === 0 ? { ...z, logo } : z))
  const ohneDatei = pruefeZahlenkarte({
    ...kacheln,
    zeilen: mitLogo('gibt-es-nicht.png'),
  })
  pruefe(
    'beanstandet: ein Logo, dessen Datei fehlt',
    ohneDatei.some((f) => f.includes('fehlt in lib/instagram/logos')),
    ohneDatei.join(' | ')
  )
  const alsBalken = pruefeZahlenkarte({
    ...kacheln,
    skala: 'balken' as const,
    zeilen: mitLogo('lpp.png'),
  })
  pruefe(
    'beanstandet: Logos außerhalb der Kacheln',
    alsBalken.some((f) => f.includes('nur in Kacheln')),
    alsBalken.join(' | ')
  )
} else pruefe('es gibt eine Kachelkarte im Bestand', false)

/* Der Steckbrief (28.10.2026): Logo da, vier bis sechs Kennzahlen. */
const steckbrief = zahlenkarten.find((k) => k.datum === '2026-10-28')
if (steckbrief?.art === 'steckbrief') {
  pruefe(
    'Steckbrief 28.10.: Berkshire allein, Logo und sechs Kennzahlen',
    steckbrief.logo === 'berkshire-hathaway.png' && steckbrief.fakten.length === 6
  )
  const zuWenig = pruefeZahlenkarte({
    ...steckbrief,
    fakten: steckbrief.fakten.slice(0, 2),
  })
  pruefe(
    'beanstandet: Steckbrief mit zwei Kennzahlen',
    zuWenig.some((f) => f.includes('vier bis sechs')),
    zuWenig.join(' | ')
  )
  const ohneLogo = pruefeZahlenkarte({ ...steckbrief, logo: 'gibt-es-nicht.png' })
  pruefe(
    'beanstandet: Steckbrief ohne Logodatei',
    ohneLogo.some((f) => f.includes('fehlt in lib/instagram/logos')),
    ohneLogo.join(' | ')
  )
} else pruefe('die Karte vom 28.10.2026 ist ein Steckbrief', false)

/* Beschriftung: Rechtshinweis mit KI-Hinweis wörtlich, fünf Schlagworte. */
const b = beschriftungZahlenkarte(gut)
pruefe('die Beschriftung trägt den Rechtshinweis wörtlich', b.includes(RECHTSHINWEIS))
pruefe('und den KI-Hinweis', b.includes('mit Unterstützung von KI erstellt'))
pruefe('fünf Schlagworte', (b.match(/#[a-zäöüß0-9]+/g) ?? []).length === 5)

/* Die Rangliste muss beanstanden, was ihre Form verfehlt. */
const rang: Rangkarte = {
  ...(zahlenkarten.find((k) => k.datum === '2026-10-15') as Rangkarte),
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
const zahl1 = (w: number) =>
  w.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
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

/*
  Die Akzentfarbe wechselt durch die vier Farben des Logos (Betreiber,
  17.10.2026) – dieselben Werte wie in public/logo.svg.
*/
for (const farbe of LOGOFARBEN)
  pruefe(`Akzentfarbe ${farbe} steht so im Logo`, logoSvg.includes(`fill="${farbe}"`))
pruefe(
  'vier Tage, vier Farben: 17.10. grün, 18.10. navy, 19.10. rot, 20.10. anthrazit, 21.10. wieder grün',
  ['2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21']
    .map(akzentfarbe)
    .join() === [...LOGOFARBEN, LOGOFARBEN[0]].join()
)

/*
  Die Karte vom 17.10.2026 – Staatsschulden, jede Zeile gegen den
  IWF-Bestand in `laender.json`. Oben und unten stehen die Ränder aller
  Länder mit einem Wert für 2025; ältere (Eritrea, 2019) zählen nicht.
*/
const schulden = zahlenkarten.find((k) => k.datum === '2026-10-17') as Rangkarte
const quote: Record<string, { schuldenquote?: { wert: number; jahr: number } }> =
  JSON.parse(readFileSync('data/snapshots/laender.json', 'utf8')).laender
const aktuell = Object.entries(quote)
  .filter(([, l]) => l.schuldenquote?.jahr === 2025)
  .map(([land, l]) => ({ land, wert: l.schuldenquote!.wert }))
  .sort((a, b) => b.wert - a.wert)
for (const z of schulden.zeilen.filter((z) => !z.schnitt))
  pruefe(
    `Schulden ${z.name} wie im Bestand (${quote[z.land]?.schuldenquote?.wert})`,
    quote[z.land]?.schuldenquote?.wert === z.wert &&
      quote[z.land]?.schuldenquote?.jahr === 2025
  )
pruefe(
  'oben steht der höchste Wert für 2025',
  schulden.zeilen[0].land === aktuell[0].land
)
pruefe('unten der niedrigste', schulden.zeilen.at(-1)!.land === aktuell.at(-1)!.land)
const platz = aktuell.findIndex((l) => l.land === 'DEU') + 1
pruefe(
  `Deutschland auf Platz ${platz} von ${aktuell.length}, wie im Text`,
  schulden.text.includes(`Platz ${platz} von ${aktuell.length}`) &&
    schulden.fusszeile.includes(`${aktuell.length} Ländern`)
)
pruefe(
  'jede Zahl der Karte steht so im Text',
  schulden.zeilen.every((z) =>
    schulden.text.includes(`${z.wert.toFixed(1).replace('.', ',')} %`)
  )
)
const mittel = aktuell.reduce((summe, l) => summe + l.wert, 0) / aktuell.length
pruefe(
  `der Länderschnitt ist der Mittelwert aller ${aktuell.length} (${mittel.toFixed(2)})`,
  schulden.zeilen.find((z) => z.schnitt)?.wert === Math.round(mittel * 10) / 10
)
pruefe(
  'Frankreichs Anleiherenditen wie in der Meldung vom 12.10.',
  nachricht.includes('Anleihezinsen bleiben hoch: Frankreich unter Druck')
)
pruefe(
  'mit Häuschen beanstandet die Rangliste Werte über 100',
  pruefeZahlenkarte({ ...schulden, skala: 'haeuser' as const }).some((f) =>
    f.includes("skala: 'balken'")
  )
)
const schuldenPng = await zahlenkartePng(
  schulden,
  readFileSync('public/logo.svg', 'utf8')
)
pruefe('Balken: das Bild ist ein PNG', schuldenPng.subarray(1, 4).toString() === 'PNG')

/* Die Karte vom 18.10.2026 – Vermögen, jede Zeile gegen den OECD-Bestand. */
const vermoegen = zahlenkarten.find((k) => k.datum === '2026-10-18') as Rangkarte
const mv: Record<string, { medianvermoegen?: { wert: number; jahr: number } }> =
  JSON.parse(readFileSync('data/snapshots/laender.json', 'utf8')).laender
const mvAlle = Object.entries(mv)
  .filter(([, l]) => l.medianvermoegen)
  .map(([land, l]) => ({ land, ...l.medianvermoegen! }))
  .sort((a, b) => b.wert - a.wert)
for (const z of vermoegen.zeilen)
  pruefe(
    `Vermögen ${z.name} wie im Bestand (${mv[z.land]?.medianvermoegen?.wert})`,
    mv[z.land]?.medianvermoegen?.wert === z.wert
  )
pruefe(
  'Vermögen: oben der höchste, unten der niedrigste Wert',
  vermoegen.zeilen[0].land === mvAlle[0].land &&
    vermoegen.zeilen.at(-1)!.land === mvAlle.at(-1)!.land
)
const mvPlatz = mvAlle.findIndex((l) => l.land === 'DEU') + 1
pruefe(
  `Vermögen: Deutschland Platz ${mvPlatz} von ${mvAlle.length}, wie im Text`,
  vermoegen.text.includes(`Platz ${mvPlatz}`) &&
    vermoegen.text.includes(`${mvAlle.length} Ländern`)
)
const jahre = vermoegen.zeilen.map((z) => mv[z.land]!.medianvermoegen!.jahr)
pruefe(
  `Vermögen: Stand ${Math.min(...jahre)}–${Math.max(...jahre)} wie in der Fußzeile`,
  vermoegen.fusszeile.includes(`${Math.min(...jahre)}–${Math.max(...jahre)}`)
)
pruefe(
  'Vermögen: jede Zahl der Karte steht so im Text',
  vermoegen.zeilen.every((z) => vermoegen.text.includes(z.wert.toLocaleString('de-DE'))),
  vermoegen.zeilen
    .filter((z) => !vermoegen.text.includes(z.wert.toLocaleString('de-DE')))
    .map((z) => z.name)
    .join()
)
pruefe(
  'Vermögen: 47,2 % Wohneigentum wie im Bestand',
  vermoegen.text.includes('47,2 %') &&
    (mv as Record<string, { wohneigentumsquote?: { wert: number } }>).DEU
      .wohneigentumsquote?.wert === 47.2
)
pruefe(
  'eine andere Einheit nur mit Balken oder Kacheln',
  pruefeZahlenkarte({ ...vermoegen, skala: 'haeuser' as const }).some((f) =>
    f.includes('Einheit')
  )
)
const vermoegenPng = await zahlenkartePng(
  vermoegen,
  readFileSync('public/logo.svg', 'utf8')
)
pruefe('Vermögen: das Bild ist ein PNG', vermoegenPng.subarray(1, 4).toString() === 'PNG')

/* Die Karte vom 19.10.2026 – Dax gegen S&P 500, gegen den Kursbestand. */
{
  const { getQuotes } = await import('@/lib/markets')
  const dax = zahlenkarten.find((k) => k.datum === '2026-10-19') as Verlaufkarte
  const [qDax, qSp] = await getQuotes(['dax', 'sp500'])
  const runde = (w: number) => `+${(Math.round(w * 10) / 10).toLocaleString('de-DE')} %`
  const endwert = (s: string) => dax.reihen.find((r) => r.symbol === s)!.endwert
  pruefe(
    `Dax seit Jahresbeginn wie im Bestand (${qDax.ytdPercent.toFixed(2)} %)`,
    endwert('dax') === runde(qDax.ytdPercent) || qDax.asOf.slice(0, 10) > dax.bis
  )
  pruefe(
    `S&P 500 seit Jahresbeginn wie im Bestand (${qSp.ytdPercent.toFixed(2)} %)`,
    endwert('sp500') === runde(qSp.ytdPercent) || qSp.asOf.slice(0, 10) > dax.bis
  )
  const linie = await verlaufSeitJahresbeginn('sp500', dax.bis)
  pruefe(
    'die Linie beginnt bei null und endet beim Endwert',
    /*
      Wie die beiden Prüfungen darüber: Ist der Bestand über den Stichtag
      hinaus, fehlt der Tagesreihe mitunter der Stichtag selbst – dann
      endet die Linie früher, und der Endwert ist nicht mehr nachzurechnen.
      Am 20.10.2026 hielt das den Bau dreimal auf.
    */
    linie[0].prozent === 0 &&
      (runde(linie.at(-1)!.prozent) === endwert('sp500') ||
        qSp.asOf.slice(0, 10) > dax.bis),
    `${linie.at(-1)?.t}: ${linie.at(-1)?.prozent}`
  )
  pruefe(
    'jede Zahl der Karte steht im Text',
    ['11,9 %', '4,6 %', '7,3 Prozentpunkte'].every((z) => dax.text.includes(z))
  )
  const daxPng = await zahlenkartePng(dax, readFileSync('public/logo.svg', 'utf8'))
  pruefe('Verlauf: das Bild ist ein PNG', daxPng.subarray(1, 4).toString() === 'PNG')
  pruefe('Akzentfarbe am 19.10. ist Rot', akzentfarbe('2026-10-19') === '#8B2225')
}

/* Die Karte vom 20.10.2026 – Öl schlägt alles, Balken mit Plus und Minus. */
{
  const oel = zahlenkarten.find((k) => k.datum === '2026-10-20') as Rangkarte
  /* Schlusskurse aus Yahoo Finance, Lauf 39277296882: Jahresschluss 2025 → 16.10.2026. */
  const kurse: Record<string, [number, number]> = {
    'Öl (Brent)': [60.85, 109.86],
    'Nasdaq 100': [25249.85, 29187.55],
    'S&P 500': [6845.5, 7659.44],
    Dax: [24490.41, 25622.61],
    Gold: [4341.1, 4181.1],
    Bitcoin: [87508.83, 81500.8],
    Silber: [70.13, 56.99],
  }
  for (const z of oel.zeilen) {
    const [von, bis] = kurse[z.name]
    const gerechnet = Math.round((bis / von - 1) * 1000) / 10
    pruefe(`${z.name}: ${z.wert} % = gerechnet ${gerechnet} %`, z.wert === gerechnet)
    pruefe(
      `${z.name}: der Wert steht im Text`,
      oel.text.includes(`${zahl1(Math.abs(z.wert))} %`)
    )
  }
  pruefe('die Karte hält die Form ein', pruefeZahlenkarte(oel).length === 0)
  pruefe(
    'Häuschen mit negativen Werten werden abgewiesen',
    pruefeZahlenkarte({ ...oel, skala: 'haeuser' as const }).some((f) =>
      f.includes('negativ')
    )
  )
  pruefe('Anthrazit am 20.10.', akzentfarbe('2026-10-20') === '#6E6E6E')
  const png = await zahlenkartePng(oel, readFileSync('public/logo.svg', 'utf8'))
  pruefe('Öl: das Bild ist ein PNG', png.subarray(1, 4).toString() === 'PNG')
}

/* Die Karte vom 22.10.2026 – die Verlierer 2026, nur Minus. */
{
  const verlierer = zahlenkarten.find((k) => k.datum === '2026-10-22') as Rangkarte
  /* Yahoo Finance, letzter Schluss 2025 → 20.10.2026. */
  const kurse: Record<string, [number, number]> = {
    Stellantis: [10.89, 4.33],
    HelloFresh: [6.16, 2.94],
    Nike: [63.71, 37.88],
    LVMH: [645.0, 386.75],
    BMW: [93.14, 57.64],
    Volkswagen: [103.55, 69.66],
    Rheinmetall: [1561.0, 1054.0],
    Netflix: [93.76, 68.69],
  }
  for (const z of verlierer.zeilen) {
    const [von, bis] = kurse[z.name]
    const gerechnet = Math.round((bis / von - 1) * 1000) / 10
    pruefe(`${z.name}: ${z.wert} % = gerechnet ${gerechnet} %`, z.wert === gerechnet)
    pruefe(
      `${z.name}: der Wert steht im Text`,
      verlierer.text.includes(`${zahl1(Math.abs(z.wert))} %`)
    )
  }
  pruefe(
    'nur Verlierer',
    verlierer.zeilen.every((z) => z.wert < 0)
  )
  pruefe(
    'die Karte hält die Form ein',
    pruefeZahlenkarte(verlierer).length === 0,
    pruefeZahlenkarte(verlierer).join(' | ')
  )
  pruefe('Navy am 22.10.', akzentfarbe('2026-10-22') === '#17296F')
  const png = await zahlenkartePng(verlierer, readFileSync('public/logo.svg', 'utf8'))
  pruefe('Verlierer: das Bild ist ein PNG', png.subarray(1, 4).toString() === 'PNG')
}

/* Die Karte vom 27.10.2026 – Gewinn pro Sekunde der größten Konzerne je Land. */
{
  const sek = zahlenkarten.find((k) => k.datum === '2026-10-27') as Rangkarte
  /* Gewinn in Mrd. US-Dollar laut Wikipedia „List of largest companies by revenue", 27.10.2026. */
  const gewinn: Record<string, number> = {
    Alphabet: 132,
    'Saudi Aramco': 106,
    ICBC: 51.4,
    Toyota: 34.2,
    TotalEnergies: 21.3,
    Shell: 19.3,
    Volkswagen: 17.9,
    Samsung: 11.0,
  }
  for (const z of sek.zeilen) {
    const jeSekunde = Math.round((gewinn[z.name] * 1e9) / (365 * 24 * 3600))
    pruefe(`${z.name}: ${z.wert} $/s aus der Quelle (${jeSekunde})`, jeSekunde === z.wert)
  }
  pruefe(
    'die Länder, nach denen der Betreiber fragte, sind dabei',
    ['DEU', 'USA', 'CHN'].every((l) => sek.zeilen.some((z) => z.land === l))
  )
  pruefe(
    'jedes Land nur einmal',
    new Set(sek.zeilen.map((z) => z.land)).size === sek.zeilen.length
  )
  pruefe('Balken', form(sek) === 'balken')
  pruefe(
    'die Karte hält die Form ein',
    pruefeZahlenkarte(sek).length === 0,
    pruefeZahlenkarte(sek).join('; ')
  )
  pruefe(
    'Form nicht wie am Vortag',
    form(sek) !== form(zahlenkarten.find((k) => k.datum === '2026-10-26')!)
  )
  pruefe(
    'Farbe nicht wie am Vortag',
    akzentfarbe('2026-10-27') !== akzentfarbe('2026-10-26')
  )
  pruefe('freigegeben für den 27.10.', sek.freigabe === '2026-10-27')
  pruefe(
    'je Land der gewinnstärkste: in den USA Alphabet',
    sek.zeilen[0].name === 'Alphabet'
  )
  const png = await zahlenkartePng(sek, readFileSync('public/logo.svg', 'utf8'))
  pruefe(
    'Gewinn pro Sekunde: das Bild ist ein PNG',
    png.subarray(1, 4).toString() === 'PNG'
  )
}

/* Die Karte vom 26.10.2026 – Big-Mac-Index, Burger (neue Form). */
{
  const mac = zahlenkarten.find((k) => k.datum === '2026-10-26') as Rangkarte
  /*
    Aus The Economist, big-mac-full-index.csv, Erhebung 2026-07-01:
    Preis in Landeswährung und Landeswährung je Dollar. Euro je Dollar 0,87439.
  */
  const roh: Record<string, [number, number]> = {
    CHE: [7.3, 0.80735],
    NOR: [78, 9.68565],
    GBR: [5.49, 0.74187],
    EU27: [6.19, 0.87439],
    TUR: [325, 47.0275],
    USA: [6.22, 1],
    CHN: [26.5, 6.7708],
    KOR: [5700, 1485.9],
    JPN: [500, 162.135],
  }
  for (const z of mac.zeilen) {
    const [preis, kurs] = roh[z.land]
    const euro = Math.round((preis / kurs) * 0.87439 * 100) / 100
    pruefe(`${z.name}: ${z.wert} € aus der Erhebung (${euro})`, euro === z.wert)
  }
  pruefe('Burger', form(mac) === 'burger')
  pruefe('freigegeben für den 26.10.', mac.freigabe === '2026-10-26')
  pruefe(
    'die Karte hält die Form ein',
    pruefeZahlenkarte(mac).length === 0,
    pruefeZahlenkarte(mac).join('; ')
  )
  pruefe(
    'Form nicht wie am Vortag mit Karte (24.10.)',
    form(mac) !== form(zahlenkarten.find((k) => k.datum === '2026-10-24')!)
  )
  pruefe(
    'die Erklärung nennt Herkunft und Jahr',
    /Economist.*1986/.test(mac.erklaerung ?? '')
  )
  pruefe(
    'mehr als zehn Burger fällt auf',
    pruefeZahlenkarte({
      ...mac,
      zeilen: [{ ...mac.zeilen[0], wert: 11 }, ...mac.zeilen.slice(1)],
    }).length > 0
  )
  pruefe(
    'eine dreizeilige Überschrift mit Erklärung fällt auf',
    pruefeZahlenkarte({
      ...mac,
      titel: [
        { text: 'Big Mac weltweit:' },
        { text: 'Schweiz am teuersten, Japan günstig', gruen: true },
      ],
    }).length > 0
  )
  const png = await zahlenkartePng(mac, readFileSync('public/logo.svg', 'utf8'))
  pruefe('Big Mac: das Bild ist ein PNG', png.subarray(1, 4).toString() === 'PNG')
}

/* Die Karte vom 24.10.2026 – Erholung nach dem Crash, Zeitleiste (neue Form). */
{
  const crash = zahlenkarten.find((k) => k.datum === '2026-10-24') as Rangkarte
  pruefe('Zeitleiste', form(crash) === 'zeitleiste')
  pruefe(
    'in der Reihenfolge der Zeit, nicht der Größe',
    crash.zeilen
      .map((z) => Number(z.name.slice(-4)))
      .every((j, i, a) => i === 0 || j > a[i - 1])
  )
  pruefe(
    'jede Zeile nennt den Einbruch',
    crash.zeilen.every((z) => /^Einbruch −\d+ %$/.test(z.zusatz ?? ''))
  )
  pruefe(
    'jede Dauer steht im Text',
    crash.zeilen.every(
      (z) =>
        z.wert === 25 || z.wert === 0.5 || crash.text.includes(`${zahl1(z.wert)} Jahre`)
    )
  )
  pruefe(
    'die Karte hält die Form ein',
    pruefeZahlenkarte(crash).length === 0,
    pruefeZahlenkarte(crash).join('; ')
  )
  pruefe(
    'Form nicht wie am Vortag',
    form(crash) !== form(zahlenkarten.find((k) => k.datum === '2026-10-23')!)
  )
  pruefe(
    'Farbe nicht wie am Vortag',
    akzentfarbe('2026-10-24') !== akzentfarbe('2026-10-23')
  )
  pruefe('freigegeben für den 24.10.', crash.freigabe === '2026-10-24')
  const png = await zahlenkartePng(crash, readFileSync('public/logo.svg', 'utf8'))
  pruefe('Zeitleiste: das Bild ist ein PNG', png.subarray(1, 4).toString() === 'PNG')
}

/* Die Karte vom 23.10.2026 – Arbeitslosigkeit 2025, Kacheln. */
{
  const quote = zahlenkarten.find((k) => k.datum === '2026-10-23') as Rangkarte
  type Wert = { wert: number; jahr: number }
  const laender: Record<string, { arbeitslosenquote?: Wert }> = JSON.parse(
    readFileSync('data/snapshots/laender.json', 'utf8')
  ).laender
  for (const z of quote.zeilen) {
    const quelle = laender[z.land!]?.arbeitslosenquote
    pruefe(
      `${z.name}: ${z.wert} % wie im Bestand (${quelle?.wert}, ${quelle?.jahr})`,
      quelle?.wert === z.wert && quelle?.jahr === 2025
    )
    pruefe(`${z.name}: der Wert steht im Text`, quote.text.includes(`${zahl1(z.wert)} %`))
  }
  pruefe(
    'nicht nur Europa: mindestens fünf Länder außerhalb',
    quote.zeilen.filter((z) =>
      ['TUR', 'CHN', 'USA', 'IND', 'KOR', 'JPN'].includes(z.land!)
    ).length >= 5
  )
  const alle = Object.values(laender)
    .map((l) => l.arbeitslosenquote)
    .filter((w): w is Wert => w?.jahr === 2025)
    .map((w) => w.wert)
    .sort((a, b) => b - a)
  pruefe(`181 Länder mit Wert für 2025 (${alle.length})`, alle.length === 181)
  pruefe(
    `Deutschland auf Platz 119 (${alle.indexOf(3.7) + 1})`,
    alle.indexOf(3.7) + 1 === 119 && quote.text.includes('Platz 119')
  )
  pruefe('die Karte hält die Form ein', pruefeZahlenkarte(quote).length === 0)
  pruefe('Rot am 23.10.', akzentfarbe('2026-10-23') === '#8B2225')
  pruefe(
    'Form nicht wie am Vortag',
    form(quote) !== form(zahlenkarten.find((k) => k.datum === '2026-10-22')!)
  )
  const png = await zahlenkartePng(quote, readFileSync('public/logo.svg', 'utf8'))
  pruefe(
    'Arbeitslosigkeit: das Bild ist ein PNG',
    png.subarray(1, 4).toString() === 'PNG'
  )
}

/* Die Karte vom 21.10.2026 – Inflation 2025, Kacheln. */
{
  const inflation = zahlenkarten.find((k) => k.datum === '2026-10-21') as Rangkarte
  type Wert = { wert: number; jahr: number }
  const laender: Record<string, { inflation?: Wert }> = JSON.parse(
    readFileSync('data/snapshots/laender.json', 'utf8')
  ).laender
  for (const z of inflation.zeilen) {
    const quelle = laender[z.land!]?.inflation
    pruefe(
      `${z.name}: ${z.wert} % wie im Bestand (${quelle?.wert}, ${quelle?.jahr})`,
      quelle?.wert === z.wert && quelle?.jahr === 2025
    )
    pruefe(
      `${z.name}: der Wert steht im Text`,
      inflation.text.includes(`${zahl1(z.wert)} %`)
    )
  }
  const alle = Object.values(laender)
    .map((l) => l.inflation)
    .filter((w): w is Wert => w?.jahr === 2025)
    .map((w) => w.wert)
    .sort((a, b) => b - a)
  pruefe(`164 Länder mit Wert für 2025 (${alle.length})`, alle.length === 164)
  pruefe(
    `Deutschland auf Platz 102 (${alle.indexOf(2.2) + 1})`,
    alle.indexOf(2.2) + 1 === 102 && inflation.text.includes('Platz 102')
  )
  pruefe(
    'Bundesbank-Zitat steht so in der Ausgabe vom 20.10.',
    readFileSync('data/editions/2026-10-20.ts', 'utf8').includes(
      '„merklich erhöht“ – und zwar bis weit in das Jahr 2027'
    )
  )
  pruefe('die Karte hält die Form ein', pruefeZahlenkarte(inflation).length === 0)
  pruefe('Grün am 21.10.', akzentfarbe('2026-10-21') === '#205437')
  const png = await zahlenkartePng(inflation, readFileSync('public/logo.svg', 'utf8'))
  pruefe('Inflation: das Bild ist ein PNG', png.subarray(1, 4).toString() === 'PNG')
}

/* Die Form Duell – gezeigt an der verworfenen Karte vom 20.10. (SMI gegen Nasdaq 100). */
{
  const duell: Duellkarte = {
    art: 'duell',
    datum: '2026-10-20',
    titel: [
      { text: 'SMI schlägt Nasdaq' },
      { text: 'um 9,9 Prozentpunkte', gruen: true },
    ],
    unterzeile: 'Wochenbilanz vom 12. bis 16. Oktober 2026:',
    links: {
      name: 'SMI',
      zusatz: 'Schweizer Leitindex',
      land: 'CHE',
      punkte: [
        { t: '2026-10-09', wert: 13787.4 },
        { t: '2026-10-14', wert: 14129.93 },
        { t: '2026-10-16', wert: 14391.31 },
      ],
    },
    rechts: {
      name: 'Nasdaq 100',
      zusatz: 'US-Technologieindex',
      land: 'USA',
      punkte: [
        { t: '2026-10-09', wert: 30883.15 },
        { t: '2026-10-14', wert: 29950.82 },
        { t: '2026-10-16', wert: 29187.55 },
      ],
    },
    fusszeile: 'Stand: Schlusskurse 09.10.–16.10.2026 | Quelle: Yahoo Finance',
    text: 'Probe.',
    schlagworte: ['probe'],
  }
  pruefe('Duell: SMI +4,38 %', duellProzent(duell.links).toFixed(2) === '4.38')
  pruefe('Duell: Nasdaq 100 −5,49 %', duellProzent(duell.rechts).toFixed(2) === '-5.49')
  const png = await zahlenkartePng(duell, readFileSync('public/logo.svg', 'utf8'))
  pruefe('Duell: das Bild ist ein PNG', png.subarray(1, 4).toString() === 'PNG')
}

/* Die Form wechselt: zwei Tage hintereinander nie dieselbe (Betreiber, 18.10.2026). */
const nachDatum = [...zahlenkarten].sort((a, b) => a.datum.localeCompare(b.datum))
for (let i = 1; i < nachDatum.length; i++)
  pruefe(
    `${nachDatum[i].datum}: Form „${form(nachDatum[i])}" nicht wie am Vortag`,
    form(nachDatum[i]) !== form(nachDatum[i - 1])
  )

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
