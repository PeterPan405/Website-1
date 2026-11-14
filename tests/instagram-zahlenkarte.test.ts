/**
 * Die Zahlenkarte: Daten, Beschriftung und das gesetzte Bild.
 *
 * Ausführen mit `npm test`. Anlass und Form in `lib/instagram-zahlenkarte.ts`.
 */
import { readFileSync } from 'node:fs'

import { zahlenkarten, aktuelleZahlenkarte } from '@/data/instagram-zahlenkarten'
import { RECHTSHINWEIS } from '@/lib/instagram-plan'
import {
  ABSENDER,
  akzentfarbe,
  beschriftungZahlenkarte,
  form,
  LOGOFARBEN,
  pruefeZahlenkarte,
  raetselProzent,
  signetOhneMitte,
  zahlenkartePng,
  zahlenkarteSeitePng,
  zahlenkarteSeiten,
  zahlenstrahlKachel,
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
/*
  Eine gepostete Karte prüft ihre Zahlen gegen den Bestand von ihrem Tag,
  nicht gegen den von heute. Am 01.11.2026 holte der monatliche Abruf die
  neuen IWF-Zahlen; seitdem passten die Karten vom 15. bis 23.10. nicht
  mehr zum Bestand. Die Tests wurden rot und hielten den nächtlichen Bau an,
  sodass die Nachrichten nicht online gingen. Falsch war an den Karten
  nichts: Sie zeigen den Stand, den ihre Fußzeile nennt.

  Deshalb gilt für eine Karte, deren Tag vorbei ist: Weicht eine Prüfung
  gegen den Bestand ab (`BESTANDSPRUEFUNG`), steht „ALT" da statt „FEHL".
  Alles andere bleibt hart, auch das Bild und die Form. Ein Entwurf (Tag
  heute oder später) wird weiter streng gegen den Bestand geprüft.
*/
const HEUTE = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(
  new Date()
)
const BESTANDSPRUEFUNG =
  /wie im Bestand|Platz \d|Länder mit Wert|Spitzenreiter|Länderschnitt|Schlusslicht|seit Jahresbeginn/
let stand: string | null = null
function karteVom(datum: string) {
  stand = datum
  return zahlenkarten.find((k) => k.datum === datum)
}

function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (!bedingung && stand && stand < HEUTE && BESTANDSPRUEFUNG.test(was)) {
    console.log(`ALT  ${was} – Karte vom ${stand}, der Bestand ist seither neuer`)
    return
  }
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

/*
  Die Prüfung muss beanstanden, was das Muster verfehlt. Vorlage ist die
  jüngste Karte, die eine Pointe braucht – das Rätsel trägt seinen Titel in
  einer Farbe (Betreiber, 09.11.2026).
*/
const gut =
  zahlenkarten.find(
    (k) => k.art !== 'raetsel' && k.art !== 'mythos' && k.art !== 'entweder'
  ) ?? aktuelleZahlenkarte()!
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

/* Die Geschichte (28.10.2026): Berkshire A seit 1984, Meilensteine, Foto. */
const geschichte = karteVom('2026-10-28')
if (geschichte?.art === 'geschichte') {
  pruefe(
    'Geschichte 28.10.: 1.490 $ im Dezember 1984, 810.106 $ am 27.10.2026',
    geschichte.punkte[0].wert === 1490 &&
      geschichte.punkte[0].t === '1984-12-01' &&
      geschichte.punkte.at(-1)!.wert === 810106 &&
      geschichte.foto === 'warren-buffett.jpg'
  )
  pruefe(
    'Meilensteine wie in der Quelle: 10.000 $ 1992, 100.000 $ 2006',
    geschichte.marken.some((m) => m.t === '1992-10-16' && m.wert === 10000) &&
      geschichte.marken.some((m) => m.t === '2006-10-23' && m.wert === 100000)
  )
  const nullKurs = pruefeZahlenkarte({
    ...geschichte,
    punkte: geschichte.punkte.map((p, i) => (i === 3 ? { ...p, wert: 0 } : p)),
  })
  pruefe(
    'beanstandet: ein Kurs von null auf der Log-Achse',
    nullKurs.some((f) => f.includes('Log-Achse')),
    nullKurs.join(' | ')
  )
  const ohneFoto = pruefeZahlenkarte({ ...geschichte, foto: 'gibt-es-nicht.jpg' })
  pruefe(
    'beanstandet: fehlende Fotodatei',
    ohneFoto.some((f) => f.includes('fehlt in lib/instagram/fotos')),
    ohneFoto.join(' | ')
  )
} else pruefe('die Karte vom 28.10.2026 ist eine Geschichte', false)

/* Der Steckbrief: Logo da, vier bis sechs Kennzahlen – an einer Testkarte. */
const steckbrief: Zahlenkarte = {
  art: 'steckbrief',
  datum: '2026-10-28',
  titel: [{ text: 'Test:' }, { text: '1 $', gruen: true }],
  erklaerung: 'Eine Testkarte.',
  logo: 'berkshire-hathaway.png',
  fakten: [
    { name: 'A', wert: '1' },
    { name: 'B', wert: '2' },
  ],
  fusszeile: 'Stand: 2026 | Quelle: Test',
  text: 'Test.\nQuellen: Test',
  schlagworte: ['probe', 'saeulen', 'test', 'boerse', 'aktien'],
}
const zuWenig = pruefeZahlenkarte(steckbrief)
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

/* Die Torte (29.10.2026): Anthropics Zusagen an Big Tech, wie in der Quelle. */
const torte = karteVom('2026-10-29')
if (torte?.art === 'torte') {
  pruefe(
    'Torte 29.10.: Google 114,5, Microsoft 45, Amazon als Rest von 269',
    torte.stuecke[0].name === 'Google' &&
      torte.stuecke[0].wert === 114.5 &&
      torte.stuecke.find((st) => st.name === 'Microsoft')?.wert === 45 &&
      Math.abs(torte.stuecke.reduce((a, st) => a + st.wert, 0) - 269) < 1e-9 &&
      torte.freigabe === '2026-10-29'
  )
  const aufsteigend = pruefeZahlenkarte({
    ...torte,
    stuecke: [...torte.stuecke].reverse(),
  })
  pruefe(
    'beanstandet: Stücke nicht absteigend',
    aufsteigend.some((f) => f.includes('absteigend')),
    aufsteigend.join(' | ')
  )
} else pruefe('die Karte vom 29.10.2026 ist eine Torte', false)

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
const wohnen = karteVom('2026-10-15') as Rangkarte
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
const inflation = karteVom('2026-10-16') as Vergleichskarte
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
const schulden = karteVom('2026-10-17') as Rangkarte
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
const vermoegen = karteVom('2026-10-18') as Rangkarte
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
  const dax = karteVom('2026-10-19') as Verlaufkarte
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
  const oel = karteVom('2026-10-20') as Rangkarte
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
  const verlierer = karteVom('2026-10-22') as Rangkarte
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
  const sek = karteVom('2026-10-27') as Rangkarte
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
  const mac = karteVom('2026-10-26') as Rangkarte
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
  const crash = karteVom('2026-10-24') as Rangkarte
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
  const quote = karteVom('2026-10-23') as Rangkarte
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
  const inflation = karteVom('2026-10-21') as Rangkarte
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

/* 30.10.2026: Erdgas-Schere – die Zahlen der Karte aus den Kursreihen. */
{
  const gas = karteVom('2026-10-30')
  pruefe('Gas: Karte für den 30.10. ist ein Duell', gas?.art === 'duell')
  if (gas?.art === 'duell') {
    pruefe('Gas: TTF +247,3 %', duellProzent(gas.links).toFixed(1) === '247.3')
    pruefe('Gas: Henry Hub −22,1 %', duellProzent(gas.rechts).toFixed(1) === '-22.1')
    pruefe('Gas: freigegeben für den 30.10.', gas.freigabe === '2026-10-30')
    pruefe('Gas: letzter Kurs vom 28.10.', gas.links.punkte.at(-1)?.t === '2026-10-28')
  }
}

/* 30.10.2026: „The caption was too long" – die Prüfung muss das vorher sehen. */
{
  const gas = karteVom('2026-10-30')!
  const lang = { ...gas, text: gas.text + ' Zusatz.'.repeat(30) }
  pruefe(
    'Beschriftung über der Grenze wird beanstandet',
    pruefeZahlenkarte(lang).some((f) => f.includes('Beschriftung hat'))
  )
}

/* 31.10.2026: Halloween-Effekt, Dax 1990–2026 (Yahoo, abgerufen 30.10.). */
{
  const karte = karteVom('2026-10-31')
  pruefe('Halloween: Karte für den 31.10. ist eine Kurvenkarte', karte?.art === 'kurven')
  if (karte?.art === 'kurven') {
    const [winter, sommer] = karte.linien
    const euro = (v: number) => `${v.toLocaleString('de-DE')} €`
    pruefe(
      'Halloween: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe(
      'Halloween: beide Linien beginnen bei 100 €',
      winter.punkte[0] === 100 && sommer.punkte[0] === 100
    )
    pruefe('Halloween: 442 Monatsstände, 12/1989–09/2026', winter.punkte.length === 442)
    pruefe(
      'Halloween: Endstände = letzter Punkt der Reihe',
      winter.ende === euro(winter.punkte.at(-1)!) &&
        sommer.ende === euro(sommer.punkte.at(-1)!),
      `${winter.ende}/${winter.punkte.at(-1)}, ${sommer.ende}/${sommer.punkte.at(-1)}`
    )
    pruefe(
      'Halloween: Beschreibung nennt dieselben Endstände und Mittel',
      karte.text.includes(winter.ende) &&
        karte.text.includes(sommer.ende) &&
        karte.kennzahlen.every((z) => karte.text.includes(z.wert.replace('+', '')))
    )
    pruefe(
      'Halloween: Achse 2000 liegt auf Dezember 1999',
      karte.achse.find((a) => a.text === '2000')?.bei === 120
    )
    pruefe('Halloween: freigegeben für den 31.10.', karte.freigabe === '2026-10-31')
    const png = await zahlenkartePng(karte, readFileSync('public/logo.svg', 'utf8'))
    pruefe('Halloween: das Bild ist ein PNG', png.subarray(1, 4).toString() === 'PNG')
  }
}

/* Eine Kurvenkarte mit ungleichen Linien wird beanstandet. */
{
  const karte = karteVom('2026-10-31')
  if (karte?.art === 'kurven') {
    const kaputt = {
      ...karte,
      linien: [karte.linien[0], { ...karte.linien[1], punkte: [100, 90] }],
    }
    pruefe(
      'Kurvenkarte: ungleich lange Linien werden beanstandet',
      pruefeZahlenkarte(kaputt).some((f) => f.includes('gleich viele'))
    )
  }
}

/* 01.11.2026: US-Zwischenwahlen, Sitze der Präsidentenpartei (Wikipedia, 30.10.). */
{
  const karte = karteVom('2026-11-01')
  pruefe('Zwischenwahl: Karte für den 01.11. sind Säulen', karte?.art === 'saeulen')
  if (karte?.art === 'saeulen') {
    /* Alle 20 Wahlen seit 1946 – im Bild stehen nur die letzten zehn. */
    const alle = [
      -54, -28, -18, -48, -4, -47, -12, -48, -15, -26, -5, -8, -54, 4, 8, -32, -63, -13,
      -41, -9,
    ]
    pruefe(
      'Zwischenwahl: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe(
      'Zwischenwahl: die Säulen sind die letzten zehn der Reihe',
      karte.saeulen.map((z) => z.wert).join() === alle.slice(-10).join()
    )
    pruefe(
      'Zwischenwahl: „18 von 20" = Verluste in der Reihe',
      karte.helden[0].wert === `${alle.filter((v) => v < 0).length} von ${alle.length}`
    )
    const mittel = alle.reduce((a, b) => a + b, 0) / alle.length
    pruefe(
      'Zwischenwahl: „−26 Sitze im Schnitt" = gerundetes Mittel',
      karte.helden[0].pille?.wert === `−${Math.round(-mittel)}`,
      mittel.toFixed(2)
    )
    pruefe(
      'Zwischenwahl: Beschreibung nennt dieselben Zahlen',
      ['18 von 20', 'im Schnitt 26', '63 Sitzen', '(+4)', '(+8)'].every((z) =>
        karte.text.includes(z)
      )
    )
    pruefe(
      'Zwischenwahl: die Liste in der Beschreibung = die Säulen',
      karte.saeulen.every(
        (z) =>
          karte.text.includes(`${z.text} – `) &&
          karte.text.includes(`: ${z.wert > 0 ? '+' : '−'}${Math.abs(z.wert)}\n`)
      )
    )
    pruefe('Zwischenwahl: freigegeben für den 01.11.', karte.freigabe === '2026-11-01')
  }
}

/* 02.11.2026: Krieg und Ölpreis (Weltbank, Pink Sheet, Rohöl-Mittel). */
{
  const karte = karteVom('2026-11-02')
  pruefe('Öl: Karte für den 02.11. sind waagerechte Balken', karte?.art === 'balken')
  if (karte?.art === 'balken') {
    pruefe(
      'Öl: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe('Öl: Form anders als am Vortag', form(karte) !== form(karteVom('2026-11-01')!))
    /* Monat davor → teuerster (Krieg) bzw. billigster (Krise) Monat danach, $ je Fass. */
    const paare: [number, number][] = [
      [2.7, 13.0],
      [14.5, 40.8],
      [26.5, 9.6],
      [17.2, 34.5],
      [114.6, 41.3],
      [53.3, 21.0],
      [83.9, 116.8],
      [63.7, 103.9],
    ]
    paare.forEach(([vor, hoch], i) => {
      const prozent = (hoch / vor - 1) * 100
      pruefe(
        `Öl: ${karte.balken[i].marke} ${Math.round(prozent)} %`,
        Math.abs(karte.balken[i].wert - prozent) < 0.05
      )
      pruefe(
        `Öl: ${karte.balken[i].marke} steht so in der Beschreibung`,
        karte.text.includes(
          `${prozent > 0 ? '+' : '−'}${Math.abs(Math.round(prozent))} %`
        )
      )
    })
    pruefe(
      'Öl: Heldenzahl ist der Iran-Balken',
      karte.helden[0].wert === `+${Math.round(karte.balken[7].wert)} %`
    )
  }
}

/* 14.11.2026 (gebaut am 13.11.): Rheinmetall seit Ende 2021 – Chartkarte, Zahlen an den Punkten (Yahoo Finance, RHM.DE). */
{
  const karte = karteVom('2026-11-13')
  pruefe('Rheinmetall: Karte für den 13.11. ist ein Chart', karte?.art === 'chart')
  if (karte?.art === 'chart') {
    pruefe(
      'Rheinmetall: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    const p = karte.punkte
    const m = karte.marken.map((x) => p[x.bei])
    pruefe(
      'Rheinmetall: Punkte = Schluss Ende 2021 und Hoch',
      m.join() === [83.06, 1988.5].join(),
      m.join()
    )
    /* Die Jahresschlüsse liegen an den Grenzen der Abschnitte – daraus die Prozente an der Achse. */
    const grenzen = [0, 52, 104, 156, 208, p.length - 1].map((i) => p[i])
    pruefe(
      'Rheinmetall: Jahresschlüsse in der Linie',
      grenzen.join() === [83.06, 186.05, 287, 614.6, 1561, 765.5].join(),
      grenzen.join()
    )
    const prozente = grenzen
      .slice(1)
      .map((s, i) => Math.round((s / grenzen[i] - 1) * 100))
      .map((v) => `${v > 0 ? '+' : '−'}${Math.abs(v)} %`)
    pruefe(
      'Rheinmetall: Jahresprozente an der Achse aus der Linie gerechnet',
      karte.achse.map((x) => x.zusatz).join() === prozente.join(),
      prozente.join()
    )
    pruefe(
      'Rheinmetall: Hoch 1.988,50 € ist das Maximum der Linie',
      Math.max(...p) === 1988.5
    )
    pruefe(
      'Rheinmetall: letzter Punkt 765,50 €',
      p.at(-1) === 765.5 &&
        karte.ende.zahl === '765,50 €' &&
        karte.ende.anlass === '−61,5 % vom Hoch'
    )
    pruefe(
      'Rheinmetall: freigegeben für den 13.11., mit gemeinfreiem Logo',
      karte.freigabe === '2026-11-13' &&
        karte.logo === 'rheinmetall.png' &&
        karte.text.includes('Logo: Rheinmetall AG, gemeinfrei')
    )
    pruefe(
      'Rheinmetall: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-12')!)
    )
    const schluss = [83.06, 186.05, 287.0, 614.6, 1561.0, 765.5]
    const jahre = schluss.slice(1).map((s, i) => Math.round((s / schluss[i] - 1) * 100))
    for (const [i, j] of ['2022', '2023', '2024', '2025', '2026'].entries())
      pruefe(
        `Rheinmetall: ${j} mit ${jahre[i]} % im Text`,
        karte.text.includes(`${j}: ${jahre[i] > 0 ? '+' : '−'}${Math.abs(jahre[i])} %`)
      )
    pruefe(
      'Rheinmetall: −61,5 % vom Hoch',
      Math.round((765.5 / 1988.5 - 1) * 1000) / 10 === -61.5
    )
    pruefe(
      'Rheinmetall: 8,7-Fache seit 88,02 €',
      Math.round((765.5 / 88.02) * 10) / 10 === 8.7 && karte.text.includes('8,7-Fache')
    )
    const png = await zahlenkartePng(karte, readFileSync('public/logo.svg', 'utf8'))
    pruefe('Rheinmetall: Bild ist ein PNG', png.subarray(1, 4).toString() === 'PNG')
  }
}

/* 12.11.2026: DAX-Rekordtage 2026 – Kurve mit einem Punkt je Rekordschluss (Yahoo Finance, ^GDAXI). */
{
  const karte = karteVom('2026-11-12')
  pruefe('Rekordtage: Karte für den 12.11. ist eine Kurve', karte?.art === 'kurven')
  if (karte?.art === 'kurven') {
    pruefe(
      'Rekordtage: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe(
      'Rekordtage: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-11')!)
    )
    const p = karte.linien[0].punkte
    /* Jeder Punkt liegt über allem davor – und über dem Rekord aus 2025 (24.611,25). */
    const rekorde: number[] = []
    let hoch = 24611.25
    p.forEach((v, i) => {
      if (v > hoch) {
        hoch = v
        rekorde.push(i)
      }
    })
    pruefe(
      'Rekordtage: die Punkte sind genau die Rekordschlüsse der Reihe',
      rekorde.join() === (karte.marken ?? []).join(),
      `${rekorde.join()} gegen ${(karte.marken ?? []).join()}`
    )
    pruefe(
      'Rekordtage: 18 Punkte, wie in Titel und Kennzahl',
      rekorde.length === 18 && karte.kennzahlen[0].wert === '18'
    )
    pruefe(
      'Rekordtage: letzter Punkt 26.662,77 am 11.11.',
      p.at(-1) === 26662.77 && rekorde.at(-1) === p.length - 1
    )
    pruefe(
      'Rekordtage: +8,7 % seit 02.01. wie im Text',
      Math.round((p.at(-1)! / p[0] - 1) * 1000) / 10 === 8.7 &&
        karte.text.includes('8,7 %')
    )
    pruefe(
      'Rekordtage: Tief 22.300,75 wie im Text',
      Math.min(...p) === 22300.75 && karte.text.includes('22.300,75')
    )
    const png = await zahlenkartePng(karte, readFileSync('public/logo.svg', 'utf8'))
    pruefe('Rekordtage: Bild ist ein PNG', png.subarray(1, 4).toString() === 'PNG')
  }
}
{
  const k = karteVom('2026-11-12')
  if (k?.art === 'kurven')
    pruefe(
      'Kurve: eine Marke außerhalb der Linie wird beanstandet',
      pruefeZahlenkarte({ ...k, marken: [k.linien[0].punkte.length] }).some((f) =>
        f.includes('außerhalb')
      )
    )
}

/* 11.11.2026: Entweder-oder – drei Duelle seit November 2021 (Yahoo Finance, markets.json). */
{
  const karte = karteVom('2026-11-11')
  pruefe('Entweder: Karte für den 11.11. ist Entweder-oder', karte?.art === 'entweder')
  if (karte?.art === 'entweder') {
    pruefe(
      'Entweder: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe('Entweder: zwei Kacheln je Duell', zahlenkarteSeiten(karte) === 6)
    pruefe(
      'Entweder: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-10')!)
    )
    const prozent = (p: readonly number[]) =>
      Math.round((p[p.length - 1] / p[0] - 1) * 100)
    const erwartet: [string, number, string, number][] = [
      ['Gold', 119, 'Bitcoin', 17],
      ['Tesla', 1, 'DAX', 61],
      ['Apple', 132, 'Microsoft', 60],
    ]
    for (const [i, [a, pa, b, pb]] of erwartet.entries()) {
      const q = karte.fragen[i]
      pruefe(
        `Entweder: ${a} ${pa} %, ${b} ${pb} %`,
        q.a.name === a &&
          q.b.name === b &&
          prozent(q.a.punkte) === pa &&
          prozent(q.b.punkte) === pb
      )
      pruefe(
        `Entweder: ${a} und ${b} mit denselben Zahlen im Text`,
        karte.text.includes(`${a}: +${pa} %`) && karte.text.includes(`${b}: +${pb} %`)
      )
    }
    const gold = karte.fragen[0]
    pruefe(
      'Entweder: 1.000 $ in Gold rund 2.190 $, in Bitcoin rund 1.170 $',
      Math.round((1000 * gold.a.punkte.at(-1)!) / gold.a.punkte[0] / 10) * 10 === 2190 &&
        Math.round((1000 * gold.b.punkte.at(-1)!) / gold.b.punkte[0] / 10) * 10 === 1170
    )
    pruefe(
      'Entweder: ein Unentschieden wird beanstandet',
      pruefeZahlenkarte({
        ...karte,
        fragen: [
          { ...gold, b: { ...gold.b, punkte: gold.a.punkte } },
          ...karte.fragen.slice(1),
        ],
      }).some((f) => f.includes('unentschieden'))
    )
    const logo = readFileSync('public/logo.svg', 'utf8')
    for (const nr of [1, 2, 6]) {
      const png = await zahlenkarteSeitePng(karte, logo, nr)
      pruefe(
        `Entweder: Kachel ${nr} ist ein PNG`,
        png.subarray(1, 4).toString() === 'PNG'
      )
    }
  }
}

/* 10.11.2026: Mythos oder Fakt – DAX seit 1987 (Yahoo Finance ^GDAXI, Tages- und Monatskurse). */
{
  const karte = karteVom('2026-11-10')
  pruefe('Mythos: Karte für den 10.11. ist Mythos oder Fakt', karte?.art === 'mythos')
  if (karte?.art === 'mythos') {
    pruefe(
      'Mythos: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe('Mythos: zwei Kacheln je Behauptung', zahlenkarteSeiten(karte) === 6)
    pruefe(
      'Mythos: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-09')!)
    )
    const [montag, freitag, september] = karte.fragen
    pruefe(
      'Mythos: Montag ist der beste Wochentag (sonst wäre es kein Mythos)',
      montag.saeulen.every((s) => s.wert <= montag.saeulen[0].wert) && !montag.fakt
    )
    pruefe(
      'Mythos: Freitag, der 13., über dem Schnitt aller Tage',
      freitag.saeulen[0].wert > freitag.saeulen[1].wert && !freitag.fakt
    )
    pruefe(
      'Mythos: fast viermal so stark (0,166 / 0,043)',
      Math.round(freitag.saeulen[0].wert / freitag.saeulen[1].wert) === 4
    )
    const sep = september.saeulen.find((s) => s.name === 'Sep')!
    pruefe(
      'Mythos: September ist der schwächste Monat – Fakt',
      september.fakt &&
        september.saeulen.every((s) => s.wert >= sep.wert) &&
        sep.hervor === true
    )
    pruefe('Mythos: zwölf Monate', september.saeulen.length === 12)
    pruefe(
      'Mythos: Zahlen im Text wie in den Säulen',
      karte.text.includes('Montag +0,070 %') &&
        karte.text.includes('0,166 %') &&
        karte.text.includes('0,043 %') &&
        karte.text.includes('−2,1 %')
    )
    pruefe(
      'Mythos: Titel in einer Farbe',
      karte.titel.every((t) => !t.gruen && !t.richtung)
    )
    pruefe(
      'Mythos: zwei Hervorhebungen werden beanstandet',
      pruefeZahlenkarte({
        ...karte,
        fragen: [
          { ...montag, saeulen: montag.saeulen.map((s) => ({ ...s, hervor: true })) },
          ...karte.fragen.slice(1),
        ],
      }).some((f) => f.includes('genau eine Säule'))
    )
    const logo = readFileSync('public/logo.svg', 'utf8')
    for (const nr of [1, 2, 6]) {
      const png = await zahlenkarteSeitePng(karte, logo, nr)
      pruefe(`Mythos: Kachel ${nr} ist ein PNG`, png.subarray(1, 4).toString() === 'PNG')
    }
  }
}

/* 09.11.2026: Börsenrätsel – drei Kurven ohne Namen, Yahoo Finance, Stand 05.11.2026. */
{
  const karte = karteVom('2026-11-09')
  pruefe('Rätsel: Karte für den 09.11. ist ein Rätsel', karte?.art === 'raetsel')
  if (karte?.art === 'raetsel') {
    pruefe(
      'Rätsel: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe('Rätsel: zwei Kacheln je Rätsel', zahlenkarteSeiten(karte) === 6)
    pruefe(
      'Rätsel: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-08')!)
    )
    /* Aus data/snapshots/markets.json gerechnet, ganze Prozent. */
    const erwartet: [string, number][] = [
      ['Commerzbank', 469],
      ['Nike', -77],
      ['Rolls-Royce', 774],
    ]
    for (const [name, prozent] of erwartet) {
      const q = karte.fragen.find((x) => x.name === name)
      pruefe(
        `Rätsel: ${name} ${prozent} %`,
        q !== undefined && Math.round(raetselProzent(q.punkte)) === prozent
      )
      pruefe(
        `Rätsel: ${name} steht mit derselben Zahl in der Beschreibung`,
        karte.text.includes(`${name}: ${prozent < 0 ? '−' : '+'}${Math.abs(prozent)} %`)
      )
    }
    const rr = karte.fragen.find((x) => x.name === 'Rolls-Royce')!
    pruefe(
      'Rätsel: Rolls-Royce vom Tief das 18-Fache',
      Math.round(rr.punkte.at(-1)! / Math.min(...rr.punkte)) === 18
    )
    pruefe(
      'Rätsel: ein Tipp, der die Lösung nennt, wird beanstandet',
      pruefeZahlenkarte({
        ...karte,
        fragen: [
          { ...karte.fragen[0], tipp: 'Die Commerzbank.' },
          ...karte.fragen.slice(1),
        ],
      }).some((f) => f.includes('verrät'))
    )
    pruefe(
      'Rätsel: Titel in einer Farbe, ohne Pointe – keine Beanstandung (Betreiber: „in einer Farbe“)',
      karte.titel.every((t) => !t.gruen && !t.richtung) &&
        !pruefeZahlenkarte(karte).some((f) => f.includes('Pointe'))
    )
    pruefe(
      'Rätsel: ein einzelnes Rätsel wird beanstandet',
      pruefeZahlenkarte({ ...karte, fragen: karte.fragen.slice(0, 1) }).some((f) =>
        f.includes('zwei bis vier')
      )
    )
    const logo = readFileSync('public/logo.svg', 'utf8')
    for (const nr of [1, 2, 6]) {
      const png = await zahlenkarteSeitePng(karte, logo, nr)
      pruefe(`Rätsel: Kachel ${nr} ist ein PNG`, png.subarray(1, 4).toString() === 'PNG')
    }
  }
}

/* 08.11.2026: Zahlenstrahl – die größten Börsengänge (Wikipedia, Largest IPOs by amount raised). */
{
  const karte = karteVom('2026-11-08')
  pruefe(
    'Börsengänge: Karte für den 08.11. ist ein Zahlenstrahl',
    karte?.art === 'zahlenstrahl'
  )
  if (karte?.art === 'zahlenstrahl') {
    pruefe(
      'Börsengänge: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe('Börsengänge: vier Kacheln, je zwei Punkte', zahlenkarteSeiten(karte) === 4)
    pruefe(
      'Börsengänge: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-07')!)
    )
    /* Wikipedia, „Largest IPOs by amount raised" und „Arm Holdings", Mrd. $. */
    const erwartet: [string, number][] = [
      ['Visa', 19.7],
      ['Facebook', 16.01],
      ['Alibaba', 25],
      ['Saudi Aramco', 29.4],
      ['SpaceX', 85.7],
    ]
    pruefe(
      'Börsengänge: nur Börsengänge, keine Vergleichsgrößen (Betreiber: „keine BIPs")',
      karte.punkte.every((x) => !x.vergleich) &&
        karte.punkte.length === 6 &&
        karte.punkte.at(-1)?.offen === true
    )
    pruefe(
      'Börsengänge: nach Jahr geordnet (Betreiber: „nicht nach Volumen … nach Zeit")',
      karte.punkte.map((x) => x.name).join(',') ===
        'Visa,Facebook,Alibaba,Saudi Aramco,SpaceX,Anthropic'
    )
    for (const [name, wert] of erwartet) {
      const p = karte.punkte.find((x) => x.name === name)
      pruefe(`Börsengänge: ${name} ${wert}`, p?.wert === wert)
      pruefe(
        `Börsengänge: ${name} steht so in der Beschreibung oder ist eine Vergleichsgröße`,
        p?.vergleich === true ||
          karte.text.includes(
            `${wert.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Mrd. $`
          )
      )
    }
    pruefe(
      'Börsengänge: eine leere Kachel wird beanstandet',
      pruefeZahlenkarte({
        ...karte,
        gleichmaessig: false,
        start: 0,
        punkte: karte.punkte.filter((x) => x.wert < 40),
      }).some((f) => f.includes('keine leere Kachel'))
    )
    /* Karussell-Regel 5 (INSTAGRAM.md, 09.11.): Absender ab Kachel 2, wo kein Logo steht. */
    const texte = (k: unknown): string[] => {
      if (typeof k === 'string') return [k]
      if (!k || typeof k !== 'object') return []
      const kinder = (k as { props?: { children?: unknown } }).props?.children
      return Array.isArray(kinder) ? kinder.flatMap(texte) : texte(kinder)
    }
    for (let nr = 2; nr <= karte.kacheln; nr++) {
      const t = texte(zahlenstrahlKachel(karte, '', nr))
      pruefe(
        `Börsengänge: Kachel ${nr} trägt ${ABSENDER} und den Zähler`,
        t.includes(ABSENDER) && t.includes(`${nr} / ${karte.kacheln}`)
      )
    }
    pruefe(
      'Börsengänge: das Deckblatt trägt keinen Absender (dort steht das Logo)',
      !texte(zahlenstrahlKachel(karte, '', 1)).includes(ABSENDER)
    )
    pruefe(
      'Börsengänge: SpaceX fast dreimal Aramco',
      Math.round((85.7 / 29.4) * 10) / 10 === 2.9
    )
    pruefe(
      'Börsengänge: maßstäblich muss aufsteigend sein',
      pruefeZahlenkarte({ ...karte, gleichmaessig: false, start: 0 }).some((f) =>
        f.includes('aufsteigend')
      )
    )
    pruefe(
      'Börsengänge: ein Punkt zu viel wird beanstandet (immer zwei je Kachel)',
      pruefeZahlenkarte({ ...karte, punkte: [...karte.punkte, karte.punkte[0]] }).some(
        (f) => f.includes('je Kachel genau zwei')
      )
    )
    pruefe(
      'Börsengänge: drei Kacheln werden beanstandet',
      pruefeZahlenkarte({ ...karte, kacheln: 3 }).some((f) => f.includes('vier bis acht'))
    )
    const logo = readFileSync('public/logo.svg', 'utf8')
    for (const nr of [1, 4]) {
      const png = await zahlenkarteSeitePng(karte, logo, nr)
      pruefe(
        `Börsengänge: Kachel ${nr} ist ein PNG`,
        png.subarray(1, 4).toString() === 'PNG'
      )
    }
  }
}

/* 07.11.2026: Krieg im Supermarkt (Weltbank, Pink Sheet, Januar gegen Oktober 2026). */
{
  const karte = karteVom('2026-11-07')
  pruefe('Supermarkt: Karte für den 07.11. sind Säulen', karte?.art === 'saeulen')
  if (karte?.art === 'saeulen') {
    pruefe(
      'Supermarkt: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe(
      'Supermarkt: drei Heldenzahlen – Welt, Euroraum, Deutschland',
      karte.helden.map((h) => `${h.name} ${h.wert}`).join(' | ') ===
        'Welt +5,9 % | Euroraum +1,6 % | Deutschland +0,4 %'
    )
    /* FAO Food Price Index, nominal: 10/2026 133,92 gegen 10/2025 126,42. */
    pruefe(
      'Supermarkt: FAO +5,9 %',
      Math.round((133.917 / 126.423 - 1) * 1000) / 10 === 5.9
    )
    pruefe(
      'Supermarkt: jede Heldenzahl steht in der Beschreibung',
      karte.helden.every((h) => karte.text.includes(`${h.name}: ${h.wert}`))
    )
    pruefe(
      'Supermarkt: jede Säule hat ihr Bildchen',
      karte.saeulen.every((z) => z.symbol)
    )
    pruefe(
      'Supermarkt: ein fehlendes Bildchen wird beanstandet',
      pruefeZahlenkarte({
        ...karte,
        saeulen: karte.saeulen.map((z, i) =>
          i ? z : { ...z, symbol: 'gibt-es-nicht.svg' }
        ),
      }).some((f) => f.includes('gibt-es-nicht.svg'))
    )
    pruefe(
      'Supermarkt: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-06')!)
    )
    const paare: [number, number][] = [
      [0.32, 0.43],
      [249.9, 317],
      [408, 489],
      [4.97, 5.75],
      [1.75, 1.84],
      [8.02, 7.4],
      [7.97, 6.83],
      [1.11, 0.75],
    ]
    paare.forEach(([vor, nach], i) => {
      const prozent = (nach / vor - 1) * 100
      pruefe(
        `Supermarkt: ${karte.saeulen[i].text} ${Math.round(prozent)} %`,
        Math.abs(karte.saeulen[i].wert - prozent) < 0.05
      )
      pruefe(
        `Supermarkt: ${karte.saeulen[i].text} steht so in der Beschreibung`,
        karte.text.includes(
          `${prozent > 0 ? '+' : '−'}${Math.abs(Math.round(prozent))} %`
        )
      )
    })
  }
}

/* 06.11.2026: Gold nach Kriegen und Krisen (Weltbank, Pink Sheet, Gold). */
{
  const karte = karteVom('2026-11-06')
  pruefe('Gold: Karte für den 06.11. sind waagerechte Balken', karte?.art === 'balken')
  if (karte?.art === 'balken') {
    pruefe(
      'Gold: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe(
      'Gold: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-05')!)
    )
    /* Monat davor → zwölfter Monat ab Beginn (2026: Oktober), $ je Unze. */
    const paare: [number, number][] = [
      [103, 152],
      [208, 455],
      [460, 413],
      [272, 310],
      [839, 949],
      [1597, 1808],
      [1816, 1898],
      [4753, 4105],
    ]
    paare.forEach(([vor, nach], i) => {
      const prozent = (nach / vor - 1) * 100
      pruefe(
        `Gold: ${karte.balken[i].marke} ${Math.round(prozent)} %`,
        Math.abs(karte.balken[i].wert - prozent) < 0.05
      )
      pruefe(
        `Gold: ${karte.balken[i].marke} steht so in der Beschreibung`,
        karte.text.includes(
          `${prozent > 0 ? '+' : '−'}${Math.abs(Math.round(prozent))} %`
        )
      )
    })
    pruefe(
      'Gold: Heldenzahl ist der Iran-Balken',
      karte.helden[0].wert === `−${Math.abs(Math.round(karte.balken[7].wert))} %`
    )
  }
}

/* 04.11.2026: Ergebnis der US-Zwischenwahl (AP über tagesschau, CNBC Election Desk). */
{
  const karte = karteVom('2026-11-04')
  pruefe('Wahl: Karte für den 04.11. zeigt die Kammern', karte?.art === 'kammern')
  if (karte?.art === 'kammern') {
    pruefe(
      'Wahl: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe(
      'Wahl: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-03')!)
    )
    pruefe('Wahl: ausnahmsweise ab 10:30', karte.ab === '10:30')
    for (const z of ['51', '53', '245', '160', '218'])
      pruefe(`Wahl: ${z} steht in der Beschreibung`, karte.text.includes(z))
  }
}

/* 03.11.2026: Atomwaffen weltweit (FAS 2026, Our World in Data). */
{
  const karte = karteVom('2026-11-03')
  pruefe('Atom: Karte für den 03.11. ist eine Vielfachkarte', karte?.art === 'vielfach')
  if (karte?.art === 'vielfach') {
    pruefe(
      'Atom: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    pruefe(
      'Atom: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-02')!)
    )
    const welt = karte.gesamt.punkte
    pruefe(
      'Atom: Welt 1986 70.374, 2026 12.187',
      welt[41] === 70374 && welt.at(-1) === 12187 && Math.max(...welt) === 70374
    )
    pruefe('Atom: −83 % seit 1986', Math.round((12187 / 70374 - 1) * 100) === -83)
    const summe = karte.teile.reduce((a, t) => a + t.punkte.at(-1)!, 0)
    pruefe(
      'Atom: neun Länder ergeben 9.745 (FAS-Militärbestand)',
      karte.teile.length === 9 && summe === 9745 && karte.text.includes('9.745')
    )
    for (const t of karte.teile)
      pruefe(
        `Atom: ${t.name} ${t.wert} = letzter Wert`,
        t.wert === t.punkte.at(-1)!.toLocaleString('de-DE') &&
          karte.text.includes(`${t.name}: ${t.wert}`)
      )
  }
}

/* 02.11.2026: Lagarde geht vorzeitig – Amtszeiten der EZB-Präsidenten (Wikipedia, Tagesschau). */
{
  const karte = karteVom('2026-11-05')
  pruefe('EZB: Karte für den 05.11. ist ein Zeitstrahl', karte?.art === 'zeitstrahl')
  pruefe('EZB: Form anders als am Vortag', form(karte!) !== form(karteVom('2026-11-04')!))
  if (karte?.art === 'zeitstrahl') {
    pruefe(
      'EZB: keine Beanstandung',
      pruefeZahlenkarte(karte).length === 0,
      pruefeZahlenkarte(karte).join(' | ')
    )
    const jahre = (a: string, b: string) =>
      (Date.parse(b) - Date.parse(a)) / (365.25 * 24 * 3600 * 1000)
    for (const b of karte.balken) {
      const gerechnet = jahre(b.beginn, b.ende).toLocaleString('de-DE', {
        maximumFractionDigits: 1,
      })
      pruefe(
        `EZB: ${b.name} ${b.text} passt zur Amtszeit (${gerechnet})`,
        b.text === `${gerechnet} J.`
      )
    }
    pruefe(
      'EZB: zweite Seite mit drei möglichen Nachfolgern',
      karte.zweiteSeite?.personen.length === 3
    )
    pruefe(
      'EZB: zweite Seite ohne Beanstandung (außer Text, den trägt Seite 1)',
      karte.zweiteSeite !== undefined &&
        pruefeZahlenkarte(karte.zweiteSeite).every((f) =>
          /Beschrift|Text|text|Schlagw|schlagw/.test(f)
        )
    )
    for (const pe of karte.zweiteSeite?.personen ?? [])
      pruefe(`EZB: ${pe.name} steht in der Beschreibung`, karte.text.includes(pe.name))
    pruefe(
      'EZB: Lagarde geht am 7. Februar 2027',
      karte.balken.at(-1)?.ende === '2027-02-07'
    )
    pruefe(
      'EZB: Heldenzahl ist Lagardes Amtszeit',
      karte.helden[0].wert === `${karte.balken.at(-1)?.text.replace(' J.', '')} Jahre`
    )
    pruefe(
      'EZB: Form anders als am Vortag',
      form(karte) !== form(karteVom('2026-11-01')!)
    )
    const kaputt = {
      ...karte,
      balken: [{ ...karte.balken[0], ende: '1990-01-01' }, karte.balken[1]],
    }
    pruefe(
      'Zeitstrahl: Ende vor Beginn wird beanstandet',
      pruefeZahlenkarte(kaputt).some((f) => f.includes('Beginn nicht vor Ende'))
    )
  }
}

/* Säulen im Hausstil: Rechnung, Prüfung, Bild – an einer Probekarte. */
{
  const probe: Zahlenkarte = {
    art: 'saeulen',
    datum: '2099-01-01',
    titel: [{ text: 'Probe' }, { text: 'mit Säulen', gruen: true }],
    erklaerung: 'Eine Probekarte für den Test.',
    stichzeile: 'Probe · eins bis drei',
    helden: [{ name: 'Mittel', wert: '+1,0 %', richtung: 'steigt' }],
    saeulen: [
      { text: 'A', wert: 2 },
      { text: 'B', wert: -1.5 },
      { text: 'C', wert: 2.5 },
    ],
    einheit: '%',
    fusszeile: 'Stand: Probe | Quelle: Probe',
    text: 'Probe.\nQuelle: Probe',
    schlagworte: ['probe', 'saeulen', 'test', 'boerse', 'aktien'],
  }
  pruefe(
    'Säulen: die Probekarte ist in Ordnung',
    pruefeZahlenkarte(probe).length === 0,
    pruefeZahlenkarte(probe).join(' | ')
  )
  pruefe(
    'Säulen: zwei Säulen werden beanstandet',
    pruefeZahlenkarte({ ...probe, saeulen: probe.saeulen.slice(0, 2) }).some((f) =>
      f.includes('Säulen')
    )
  )
  pruefe(
    'Hausstil: ein Titel über 22 Zeichen je Zeile wird beanstandet',
    pruefeZahlenkarte({
      ...probe,
      titel: [{ text: 'Ein viel zu langer Titel hier' }],
    }).some((f) => f.includes('22 Zeichen'))
  )
  const png = await zahlenkartePng(probe, readFileSync('public/logo.svg', 'utf8'))
  pruefe(
    'Säulen: das Bild ist ein PNG, auch mit negativem Wert',
    png.subarray(1, 4).toString() === 'PNG'
  )
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
