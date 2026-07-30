/**
 * Prüfungen für den SDMX-Leser.
 *
 * Der Fehler, den dieses Modul verhindern soll, ist unsichtbar: richtige
 * Zahlen mit falschen Zeitpunkten. In SDMX stehen Werte und Zeitpunkte in
 * getrennten Bäumen und werden über eine Ziffer verbunden. Wer sie falsch
 * zusammenführt, bekommt eine Inflationsrate, die für Mai so plausibel
 * aussieht wie für Juni – und niemand merkt es je.
 */

import { juengster, leseSdmx, vorEinemJahr } from '../lib/providers/sdmx.ts'

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

/**
 * Ein Ausschnitt in der Form, die die EZB liefert.
 *
 * Nachgebaut nach der Antwort auf `ICP/M.U2.N.000000.4.ANR` – die jährliche
 * Veränderungsrate des harmonisierten Verbraucherpreisindex im Euroraum.
 */
function antwort(werte: (number | null)[], zeitpunkte: string[]) {
  return {
    header: { id: 'test' },
    dataSets: [
      {
        action: 'Replace',
        series: {
          '0:0:0:0:0:0': {
            attributes: [0, null],
            observations: Object.fromEntries(
              werte.map((wert, index) => [String(index), [wert, 0, null]])
            ),
          },
        },
      },
    ],
    structure: {
      dimensions: {
        series: [{ id: 'FREQ', values: [{ id: 'M', name: 'Monthly' }] }],
        observation: [
          {
            id: 'TIME_PERIOD',
            values: zeitpunkte.map((t) => ({ id: t, name: t })),
          },
        ],
      },
    },
  }
}

console.log('\n— Zerlegen —')

{
  const { punkte } = leseSdmx(antwort([2.1, 2.3, 2.0], ['2026-04', '2026-05', '2026-06']))
  pruefe('drei Punkte', punkte.length === 3)
  /*
    Der Kern: Wert und Zeitpunkt gehoeren zusammen. Die Zuordnung laeuft ueber
    den Index — waere sie um eins verschoben, saehe das Ergebnis genauso
    plausibel aus.
  */
  pruefe(
    'der erste Wert gehoert zum ersten Zeitpunkt',
    punkte[0].t === '2026-04' && punkte[0].wert === 2.1
  )
  pruefe(
    'und der letzte zum letzten',
    punkte[2].t === '2026-06' && punkte[2].wert === 2.0
  )
}

/*
  Fehlende Werte kommen als null. Sie als Null zu lesen waere der teuerste
  denkbare Fehler in einer Zinsreihe: „0,0 Prozent Inflation“ ist eine Aussage,
  „keine Meldung“ ist keine.
*/
{
  const { punkte } = leseSdmx(
    antwort([2.1, null, 2.0], ['2026-04', '2026-05', '2026-06'])
  )
  pruefe('null wird uebersprungen', punkte.length === 2)
  pruefe(
    'und nicht als 0 gelesen',
    punkte.every((punkt) => punkt.wert !== 0)
  )
  pruefe('die uebrigen behalten ihren Zeitpunkt', punkte[1].t === '2026-06')
}

pruefe(
  'unsortierte Zeitpunkte werden sortiert',
  leseSdmx(antwort([1, 2], ['2026-06', '2026-04'])).punkte[0].t === '2026-04'
)

console.log('\n— Was fehlschlagen darf —')

pruefe('leere Antwort ergibt nichts', leseSdmx({}).punkte.length === 0)
pruefe('Unsinn ergibt nichts', leseSdmx('kaputt').punkte.length === 0)
pruefe(
  'Antwort ohne Beobachtungen ergibt nichts',
  leseSdmx({
    structure: { dimensions: { observation: [{ id: 'TIME_PERIOD', values: [] }] } },
  }).punkte.length === 0
)

/*
  Mehrere Reihen in einer Antwort heissen: Die Abfrage war zu unscharf.
  Stillschweigend die erste zu nehmen waere ein Fehler mit Ansage — deshalb
  wird es gemeldet.
*/
{
  const zwei = antwort([1, 2], ['2026-04', '2026-05']) as Record<string, unknown>
  const datensaetze = zwei.dataSets as { series: Record<string, unknown> }[]
  datensaetze[0].series['1:0:0:0:0:0'] = datensaetze[0].series['0:0:0:0:0:0']
  pruefe('mehrere Reihen werden gemeldet', leseSdmx(zwei).mehrereReihen)
}
pruefe('eine einzelne nicht', !leseSdmx(antwort([1], ['2026-04'])).mehrereReihen)

console.log('\n— Jüngster und Vorjahresmonat —')

{
  const { punkte } = leseSdmx(antwort([1.9, 2.1, 2.3], ['2025-06', '2026-05', '2026-06']))
  pruefe('der juengste ist der letzte', juengster(punkte)?.t === '2026-06')
  /*
    Der Vorjahresmonat wird ueber den Zeitpunkt gesucht und nicht ueber die
    Position. In einer Reihe mit Luecken waere „zwoelf Eintraege zurueck“
    irgendein Monat — hier waere es Mai statt Juni gewesen.
  */
  pruefe(
    'vor einem Jahr wird ueber das Datum gefunden',
    vorEinemJahr(punkte)?.t === '2025-06'
  )
  pruefe('mit dem richtigen Wert', vorEinemJahr(punkte)?.wert === 1.9)
}

pruefe(
  'ohne Vorjahresmonat kommt null',
  vorEinemJahr(leseSdmx(antwort([2], ['2026-06'])).punkte) === null
)
pruefe('leere Reihe hat keinen juengsten', juengster([]) === null)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
