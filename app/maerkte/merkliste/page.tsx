import type { Metadata } from 'next'

import { Merklistentafel, type Merkdaten } from '@/components/markets/Merklistentafel'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { getDividendenbefund } from '@/lib/dividendentermine'
import { getQuotes } from '@/lib/markets'
import { getQuartalstermine } from '@/lib/quartalstermine'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Merkliste'),
  description:
    'Titel im Blick behalten, ohne Konto und ohne Anmeldung: Kurs, Dividendenrendite und der nächste erwartete Termin, gespeichert allein in diesem Browser.',
  path: '/maerkte/merkliste',
  ogTitle: 'Die eigene Merkliste – ohne Konto',
  /*
    Nicht in den Index: Die Seite hat für jeden Besucher einen anderen Inhalt,
    und für eine Suchmaschine ist sie immer leer. Eine leere Seite als Treffer
    ist schlechter als kein Treffer.
  */
  noIndex: true,
})

/**
 * Der Datensatz, aus dem die Merkliste im Browser ihre Zeilen zieht.
 *
 * Alle Aktien, nicht nur die gemerkten – welche das sind, weiß der Server
 * nicht. Die Felder sind knapp gehalten, weil jedes von ihnen tausendfach im
 * Seitenpaket landet.
 */
async function baueDaten(): Promise<Merkdaten[]> {
  const quotes = await getQuotes()
  const termine = getQuartalstermine()

  /*
    Je Symbol der nächste Quartalstermin. Die Dividendentermine kommen nicht
    aus derselben Liste, sondern aus dem Befund – dort steht der nächste
    erwartete Abschlag ohnehin schon, und er ist für eine Merkliste der
    nähere Anlass.
  */
  const heute = new Date().toISOString().slice(0, 10)
  const quartal = new Map<string, string>()
  for (const termin of termine) {
    if (termin.datum < heute) continue
    for (const symbol of termin.symbole ?? []) {
      const bisher = quartal.get(symbol)
      if (!bisher || termin.datum < bisher) quartal.set(symbol, termin.datum)
    }
  }

  return quotes
    .filter((quote) => quote.kind === 'stock')
    .map((quote) => {
      const dividende = getDividendenbefund(quote.symbol)
      const dividendentag = dividende?.naechsterErwartet ?? null
      const quartalstag = quartal.get(quote.symbol) ?? null

      /*
        Der nähere der beiden Termine gewinnt. Beide anzuzeigen wäre in einer
        Zeile nicht unterzubringen, und die Frage lautet „was kommt als
        Nächstes“ – nicht „was kommt alles“.
      */
      const beide = [
        dividendentag ? { tag: dividendentag, art: 'Dividende' } : null,
        quartalstag ? { tag: quartalstag, art: 'Quartalszahlen' } : null,
      ].filter((eintrag): eintrag is { tag: string; art: string } => Boolean(eintrag))
      const naechster = beide.sort((a, b) => a.tag.localeCompare(b.tag))[0] ?? null

      return {
        symbol: quote.symbol,
        ticker: quote.ticker,
        name: quote.name,
        einheit: quote.unit,
        stellen: quote.decimals,
        wert: quote.value,
        veraenderung: quote.changePercent,
        rendite: dividende?.renditeProzent ?? null,
        termin: naechster?.tag ?? null,
        terminArt: naechster?.art ?? null,
      }
    })
}

export default async function MerklisteSeite() {
  const daten = await baueDaten()

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Merkliste"
        eyebrowIcon="bookmark"
        title="Im Blick behalten, ohne Konto"
        lead="Wer ein paar Titel verfolgt, will nicht jedes Mal tausend Kurse durchsuchen. Diese Liste steht in deinem Browser – keine Anmeldung, keine Übertragung, kein Konto, das jemand verwalten müsste."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: 'Merkliste' }]}
          />
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Merklistentafel daten={daten} />

        <Callout variant="info" title="Was das ohne Konto bedeutet" className="mt-10">
          <p>
            Die Liste liegt im Speicher deines Browsers und verlässt dieses Gerät nicht.
            Das ist die gute Nachricht: Was du beobachtest, ist eine Aussage über dein
            Geld, und die geht niemanden etwas an.
          </p>
          <p>
            Das ist zugleich die Einschränkung. Am Telefon steht eine andere Liste als am
            Rechner, und wer die Browserdaten löscht, löscht sie mit. Ein
            <strong> Depot ist das hier ausdrücklich nicht</strong>: Es stehen keine
            Stückzahlen und keine Kaufkurse darin, und es wird nichts gerechnet, was wie
            ein Depotwert aussieht.
          </p>
        </Callout>
      </div>
    </>
  )
}
