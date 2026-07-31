import { getInstrumentSymbols, getQuote, getSeries } from '@/lib/markets'

/**
 * Die Kursreihe eines Instruments als CSV.
 *
 * ## Warum eine Website ihre Zahlen herausgibt
 *
 * Weil sie ihre Quellen ohnehin offenlegt. Wer schreibt, woher eine Zahl
 * kommt, kann auch die Zahl selbst herausgeben – alles andere wäre eine
 * Offenheit, die an der bequemsten Stelle endet.
 *
 * Für den Lernbereich ist es außerdem die stärkste Übung, die es gibt: Eine
 * Rendite in einer Tabellenkalkulation selbst nachzurechnen lehrt mehr über
 * Rendite als jeder Text darüber. Bislang ließ sich das an keiner Stelle
 * dieser Website tun.
 *
 * ## Warum Semikolon und nicht Komma
 *
 * Weil deutsche Tabellenkalkulationen mit dem Komma als Dezimalzeichen
 * arbeiten und ein komma-getrenntes CSV dort in einer einzigen Spalte landet.
 * Die Zahlen selbst stehen dagegen mit **Punkt** als Dezimalzeichen: So liest
 * sie jedes Programm und jede Programmiersprache, und das ist die häufigere
 * Weiterverwendung.
 *
 * ## Warum die Bezeichnungen deutsch sind
 *
 * Weil die Datei für Menschen bestimmt ist, die diese Website lesen. Wer sie
 * maschinell weiterverarbeitet, benennt die Spalten ohnehin selbst.
 */
export const dynamic = 'force-static'

export async function generateStaticParams() {
  const symbole = await getInstrumentSymbols()
  return symbole.map((symbol) => ({ symbol }))
}

export async function GET(
  _anfrage: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params
  /*
    Über `getQuote` und nicht über `getInstrument`: Nur der Kurs kennt Quelle
    und Stand. Ohne beides wäre die Datei eine Zahlenkolonne ohne Herkunft.
  */
  const [quote, reihe] = await Promise.all([getQuote(symbol), getSeries(symbol, '5J')])

  if (!quote || !reihe) {
    return new Response('Unbekanntes Instrument\n', { status: 404 })
  }

  /*
    Ein Kopfkommentar vor der Tabelle. Tabellenkalkulationen zeigen ihn als
    Zeilen an, was etwas unschön aussieht – und trotzdem richtig ist: Eine
    Datei mit Kursen, die nicht sagt, um welches Papier es geht und woher die
    Zahlen kommen, ist genau die Art loser Zahl, gegen die diese Website
    ansonsten anschreibt.
  */
  const zeilen = [
    `# ${quote.name} (${quote.ticker})`,
    `# Einheit: ${quote.unit}`,
    `# Quelle: ${quote.source?.label ?? 'keine Quelle hinterlegt'}`,
    `# Stand: ${quote.asOf}`,
    '# Schlusskurse je Handelstag, bis zu fünf Jahre zurück.',
    '# Ältere Zeiträume sind ausgedünnt: bis etwa 400 Tage zurück täglich, davor wöchentlich.',
    'Datum;Schlusskurs',
    ...reihe.map((punkt) => `${punkt.t.slice(0, 10)};${punkt.value}`),
  ]

  return new Response(`${zeilen.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${symbol}-kurse.csv"`,
    },
  })
}
