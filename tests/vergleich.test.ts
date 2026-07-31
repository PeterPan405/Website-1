/**
 * Prüfungen für den Aktienvergleich.
 *
 * Der Fehler, um den es hier geht, ist eine Markierung, die es nicht geben
 * dürfte. Eine Tabelle mit einem Haken hinter einer Zahl behauptet etwas –
 * und bei Kurs, Börsenwert oder einem KGV über Branchengrenzen hinweg ist
 * diese Behauptung falsch. Geprüft wird deshalb vor allem, wo **kein** Sieger
 * markiert wird.
 */

import {
  vergleiche,
  vorbehalte,
  type Vergleichsgruppe,
  type Vergleichsposten,
} from '../lib/vergleich.ts'

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

function posten(teil: Partial<Vergleichsposten> = {}): Vergleichsposten {
  return {
    symbol: 'aaa',
    ticker: 'AAA',
    name: 'Aaa AG',
    art: 'stock',
    waehrung: 'EUR',
    branche: 'Halbleiter',
    sitzland: '276',
    kurs: 100,
    veraenderung: 0.5,
    rendite: 2,
    performance: { '1J': 10, '3J': 30, '5J': 50 },
    schwankung: 25,
    maxRueckgang: -30,
    bilanzwaehrung: 'EUR',
    marktkapitalisierung: 1_000_000_000,
    kgv: 20,
    kuv: 3,
    kbv: 2,
    ...teil,
  }
}

/** Sucht eine Zeile über ihren Namen. */
function zeile(gruppen: Vergleichsgruppe[], feld: string) {
  const treffer = gruppen.flatMap((gruppe) => gruppe.zeilen).find((z) => z.feld === feld)
  if (!treffer) throw new Error(`Zeile „${feld}“ fehlt`)
  return treffer
}

console.log('\n— Wertentwicklung —')

{
  const gruppen = vergleiche(
    posten({ performance: { '1J': 30, '3J': 30, '5J': 50 } }),
    posten({ performance: { '1J': 10, '3J': 30, '5J': 50 } })
  )
  pruefe('mehr Kursgewinn liegt vorn', zeile(gruppen, 'Ein Jahr').vorn === 'links')
  pruefe(
    'bei Gleichstand niemand',
    zeile(gruppen, 'Drei Jahre').vorn === null,
    'gleiche Werte duerfen keinen Sieger ergeben'
  )
}

/*
  Der Mindestabstand. Ein halber Prozentpunkt ueber ein Jahr ist kein
  Unterschied, sondern der Zeitpunkt, an dem die Kursreihe endet.
*/
{
  const gruppen = vergleiche(
    posten({ performance: { '1J': 10.4 } }),
    posten({ performance: { '1J': 10 } })
  )
  const z = zeile(gruppen, 'Ein Jahr')
  pruefe('zu kleiner Abstand ergibt keinen Sieger', z.vorn === null)
  pruefe('und sagt auch, warum', (z.hinweis ?? '').includes('zu klein'))
}

{
  const gruppen = vergleiche(
    posten({ performance: { '1J': 12 } }),
    posten({ performance: { '1J': 10 } })
  )
  pruefe('zwei Prozentpunkte reichen', zeile(gruppen, 'Ein Jahr').vorn === 'links')
}

/*
  Ein fehlender Zeitraum ist kein Nullwert. Wer eine Aktie ohne Fuenfjahresreihe
  gegen eine mit einer solchen stellt, darf nicht erfahren, die zweite habe
  „besser abgeschnitten“ – die erste hat gar nicht teilgenommen.
*/
{
  const gruppen = vergleiche(
    posten({ performance: { '1J': 10 } }),
    posten({ performance: { '1J': 10, '5J': 80 } })
  )
  const z = zeile(gruppen, 'Fünf Jahre')
  pruefe('fehlender Zeitraum ergibt keinen Sieger', z.vorn === null)
  pruefe('links bleibt leer statt null zu heissen', z.links === null)
  pruefe('und der Grund steht dabei', (z.hinweis ?? '').includes('fehlt'))
}

console.log('\n— Dividendenrendite —')

{
  const gruppen = vergleiche(posten({ rendite: 4 }), posten({ rendite: 1.5 }))
  const z = zeile(gruppen, 'Dividendenrendite')
  pruefe('hoehere Rendite liegt vorn', z.vorn === 'links')
  pruefe(
    'mit dem Vorbehalt zur Ursache',
    (z.hinweis ?? '').includes('Kurs gefallen'),
    'eine hohe Rendite entsteht auch durch einen gefallenen Kurs'
  )
}

console.log('\n— Schwankung —')

{
  const gruppen = vergleiche(posten({ schwankung: 18 }), posten({ schwankung: 40 }))
  pruefe(
    'weniger Schwankung liegt vorn',
    zeile(gruppen, 'Jahresschwankung').vorn === 'links'
  )
}

/*
  Das Vorzeichen des groessten Rueckgangs. Er ist negativ; milder ist der
  groessere Wert. Wer hier „kleiner ist besser“ anwendet, kehrt die Aussage um
  und erklaert den schlimmeren Einbruch zum Sieger.
*/
{
  const gruppen = vergleiche(posten({ maxRueckgang: -20 }), posten({ maxRueckgang: -60 }))
  const z = zeile(gruppen, 'Größter Rückgang')
  pruefe('milderer Einbruch liegt vorn', z.vorn === 'links', '-20 % ist milder als -60 %')
}

console.log('\n— Bewertung —')

{
  const gruppen = vergleiche(posten({ kgv: 12 }), posten({ kgv: 30 }))
  const z = zeile(gruppen, 'Kurs-Gewinn-Verhältnis')
  pruefe('in derselben Branche liegt das niedrigere KGV vorn', z.vorn === 'links')
  pruefe(
    'guenstig heisst nicht gut',
    (z.hinweis ?? '').includes('nicht dasselbe wie gut')
  )
}

/*
  Der Kern der Sache: ueber Branchengrenzen hinweg wird nichts markiert. Ein
  Versorger mit KGV 11 ist nicht „guenstiger“ als ein Softwarehaus mit KGV 38 —
  die beiden werden aus guten Gruenden verschieden bewertet.
*/
{
  const gruppen = vergleiche(
    posten({ branche: 'Versorger', kgv: 11, kuv: 1, kbv: 1 }),
    posten({ branche: 'Software', kgv: 38, kuv: 9, kbv: 7 })
  )
  for (const feld of [
    'Kurs-Gewinn-Verhältnis',
    'Kurs-Umsatz-Verhältnis',
    'Kurs-Buchwert-Verhältnis',
  ]) {
    const z = zeile(gruppen, feld)
    pruefe(`${feld} ohne Sieger bei verschiedenen Branchen`, z.vorn === null)
    pruefe(`${feld} nennt den Grund`, (z.hinweis ?? '').includes('Verschiedene Branchen'))
  }
}

{
  const gruppen = vergleiche(posten({ branche: null }), posten({ branche: 'Software' }))
  const z = zeile(gruppen, 'Kurs-Gewinn-Verhältnis')
  pruefe('ohne Branche ebenfalls kein Sieger', z.vorn === null)
  pruefe('mit eigenem Grund', (z.hinweis ?? '').includes('keine Branche'))
}

/*
  Der relative Mindestabstand. Bei einem KGV von 60 gegen 61 ist ein Punkt
  nichts, bei 6 gegen 7 ist er viel — ein fester Abstand traefe eines von
  beiden falsch.
*/
{
  const gross = vergleiche(posten({ kgv: 61 }), posten({ kgv: 60 }))
  pruefe(
    '60 gegen 61 ergibt keinen Sieger',
    zeile(gross, 'Kurs-Gewinn-Verhältnis').vorn === null
  )

  const klein = vergleiche(posten({ kgv: 7 }), posten({ kgv: 6 }))
  pruefe(
    '6 gegen 7 dagegen schon',
    zeile(klein, 'Kurs-Gewinn-Verhältnis').vorn === 'rechts'
  )
}

console.log('\n— Was nie markiert wird —')

/*
  Drei Zeilen tragen nie eine Markierung, egal wie die Zahlen stehen. Sie sind
  der Grund, warum es dieses Modul gibt: Eine Tabelle, die auch hier einen
  Sieger kuert, erzaehlt dem Leser etwas Falsches.
*/
{
  const gruppen = vergleiche(
    posten({ kurs: 320, veraenderung: 4, marktkapitalisierung: 900_000_000_000 }),
    posten({ kurs: 41, veraenderung: -2, marktkapitalisierung: 12_000_000_000 })
  )
  pruefe('der Kurs nie', zeile(gruppen, 'Kurs').vorn === null)
  pruefe('die Tagesveraenderung nie', zeile(gruppen, 'Heute').vorn === null)
  pruefe('der Boersenwert nie', zeile(gruppen, 'Börsenwert').vorn === null)
  pruefe(
    'und beim Kurs steht, warum',
    (zeile(gruppen, 'Kurs').hinweis ?? '').includes('zerlegt')
  )
}

{
  const gruppen = vergleiche(
    posten({ bilanzwaehrung: 'JPY', marktkapitalisierung: 400_000_000_000 }),
    posten({ bilanzwaehrung: 'USD', marktkapitalisierung: 40_000_000_000 })
  )
  pruefe(
    'verschiedene Bilanzwaehrungen werden am Boersenwert benannt',
    (zeile(gruppen, 'Börsenwert').hinweis ?? '').includes('verschiedenen Währungen')
  )
}

console.log('\n— Vorbehalte über der Tabelle —')

pruefe(
  'gleiche Titel ergeben keinen Vorbehalt',
  vorbehalte(posten(), posten()).length === 0
)

pruefe(
  'verschiedene Waehrungen',
  vorbehalte(posten({ waehrung: 'EUR' }), posten({ waehrung: 'USD' })).some((satz) =>
    satz.includes('USD')
  )
)

pruefe(
  'verschiedene Branchen',
  vorbehalte(posten({ branche: 'Banken' }), posten({ branche: 'Software' })).some(
    (satz) => satz.includes('Banken gegen Software')
  )
)

pruefe(
  'verschiedene Sitzlaender wegen der Quellensteuer',
  vorbehalte(posten({ sitzland: '276' }), posten({ sitzland: '840' })).some((satz) =>
    satz.includes('Quellensteuer')
  )
)

pruefe(
  'ungleich lange Kursreihen',
  vorbehalte(
    posten({ performance: { '1J': 5 } }),
    posten({ performance: { '1J': 5, '5J': 50 } })
  ).some((satz) => satz.includes('nicht erfasst'))
)

pruefe(
  'gleich kurze Kursreihen dagegen nicht',
  vorbehalte(posten({ performance: { '1J': 5 } }), posten({ performance: { '1J': 8 } }))
    .length === 0
)

/* ------------------------------------------- Gattungen jenseits der Aktie */

/*
  Ein Rohstoff hat keinen Gewinn, keinen Umsatz und kein Eigenkapital. Die
  Gruppe „Bewertung“ darf deshalb nicht mit vier leeren Zeilen dastehen – das
  läse sich als Lücke im Bestand statt als Frage, die es nicht gibt.
*/
const gold = posten({
  symbol: 'gold',
  ticker: 'XAU',
  name: 'Gold',
  art: 'commodity',
  branche: null,
  sitzland: null,
  rendite: null,
  kgv: null,
  kuv: null,
  kbv: null,
  marktkapitalisierung: null,
  bilanzwaehrung: null,
})
const silber = posten({ ...gold, symbol: 'silber', ticker: 'XAG', name: 'Silber' })

const rohstoffe = vergleiche(gold, silber).map((g) => g.titel)
pruefe(
  'zwei Rohstoffe: keine Gruppe „Bewertung“',
  !rohstoffe.includes('Bewertung'),
  `erhalten: ${rohstoffe.join(', ')}`
)
pruefe(
  'die Wertentwicklung bleibt',
  rohstoffe.includes('Wertentwicklung'),
  `erhalten: ${rohstoffe.join(', ')}`
)

/* Bei zwei Aktien bleibt alles, wie es war – auch mit Lücken. */
const mitLuecke = vergleiche(posten(), posten({ kgv: null, kuv: null, kbv: null })).map(
  (g) => g.titel
)
pruefe(
  'zwei Aktien behalten die Bewertungsgruppe, auch wenn eine Seite fehlt',
  mitLuecke.includes('Bewertung')
)

pruefe(
  'Aktie gegen Rohstoff wird als Gattungsunterschied benannt',
  vorbehalte(posten(), gold).some(
    (satz) => satz.includes('Aktie gegen Rohstoff') && satz.includes('Gattungen')
  )
)

/*
  Der Erklärsatz muss zu den beiden tatsächlich gewählten Gattungen passen.
  Er nannte zuerst immer Aktie und Rohstoff – auch bei „Kryptowährung gegen
  Index“, wo keine der beiden beteiligt ist.
*/
const kryptoGegenIndex = vorbehalte(
  posten({ art: 'crypto' }),
  posten({ symbol: 'dax', art: 'index' })
).join(' ')
pruefe(
  'der Erklärsatz nennt die beteiligten Gattungen',
  kryptoGegenIndex.includes('Netzwerk') && kryptoGegenIndex.includes('Korb')
)
pruefe(
  '… und keine unbeteiligte',
  !kryptoGegenIndex.includes('Angebot und Nachfrage'),
  kryptoGegenIndex
)

/*
  Eine Zahl gegen einen Strich ist kein Vergleich: Bei Gold gegen NVIDIA trägt
  die Aktienseite echte Bewertungszahlen, die Rohstoffseite kann keine haben.
  Die Gruppe gehört deshalb ganz weg – sonst läse sich der Strich als „nicht
  erfasst“ statt als „nicht definiert“.
*/
const gemischt = vergleiche(gold, posten()).map((g) => g.titel)
pruefe(
  'Rohstoff gegen Aktie: keine Bewertungsgruppe, obwohl eine Seite Zahlen hat',
  !gemischt.includes('Bewertung'),
  `erhalten: ${gemischt.join(', ')}`
)

pruefe(
  'zwei Aktien bekommen keinen Gattungshinweis',
  !vorbehalte(posten(), posten({ symbol: 'bbb' })).some((satz) =>
    satz.includes('Gattungen')
  )
)

/*
  Der Handelskalender: 365 gegen 252 Tage. Er gehört dazu, sobald eine der
  beiden Seiten Krypto ist – aber nicht, wenn beide es sind.
*/
const bitcoin = posten({
  symbol: 'bitcoin',
  ticker: 'BTC',
  name: 'Bitcoin',
  art: 'crypto',
})
pruefe(
  'Aktie gegen Krypto nennt die 365 Handelstage',
  vorbehalte(posten(), bitcoin).some((satz) => satz.includes('365'))
)
pruefe(
  'zwei Kryptowährungen nicht – dort ist der Kalender derselbe',
  !vorbehalte(bitcoin, posten({ ...bitcoin, symbol: 'ethereum' })).some((satz) =>
    satz.includes('365')
  )
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
