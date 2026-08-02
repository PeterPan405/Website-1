import type { Metadata } from 'next'

import { laendernamen } from '@/data/laender/namen'
import { Merkaustausch } from '@/components/markets/Merkaustausch'
import { Merkkalender } from '@/components/markets/Merkkalender'
import { Merkbericht, type Merkmeldung } from '@/components/markets/Merkbericht'
import { Merklistentafel, type Merkdaten } from '@/components/markets/Merklistentafel'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { getDividendenbefund } from '@/lib/dividendentermine'
import { getQuotes, getSeries } from '@/lib/markets'
import { getNewsArticles } from '@/lib/news'
import { letzteAbgeschlosseneWoche, wochenveraenderung } from '@/lib/wochenrechnung'
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
    Je Symbol **alle** künftigen Quartalstermine, nicht nur der nächste. Die
    Dividendentermine kommen nicht aus derselben Liste, sondern aus dem Befund
    – dort steht der nächste erwartete Abschlag ohnehin schon.

    Der Grund für „alle“ ist der Kalender zum Herunterladen: Eine Datei mit
    einem Eintrag je Titel ist nach dem ersten Termin leer, und niemand lädt
    sie ein zweites Mal.
  */
  const heute = new Date().toISOString().slice(0, 10)
  const quartal = new Map<string, string[]>()
  for (const termin of termine) {
    if (termin.datum < heute) continue
    for (const symbol of termin.symbole ?? []) {
      const bisher = quartal.get(symbol)
      if (bisher) bisher.push(termin.datum)
      else quartal.set(symbol, [termin.datum])
    }
  }

  return quotes
    .filter((quote) => quote.kind === 'stock')
    .map((quote) => {
      const dividende = getDividendenbefund(quote.symbol)
      const dividendentag = dividende?.naechsterErwartet ?? null

      /*
        Beide Arten zusammen, nach Datum sortiert. Die Tabelle zeigt davon nur
        den ersten – die Frage in einer Zeile lautet „was kommt als Nächstes“.
        Der Kalender nimmt alle.

        Die Obergrenze ist keine Kosmetik: Diese Daten reisen für **alle**
        1.029 Aktien im Seitenpaket mit, weil der Server nicht weiß, welche
        gemerkt sind. Vier Termine je Titel decken ein Jahr ab und sind das,
        was die Vorhersage überhaupt hergibt.
      */
      const alleTermine = [
        ...(dividendentag ? [{ tag: dividendentag, art: 'Dividende' }] : []),
        ...(quartal.get(quote.symbol) ?? []).map((tag) => ({
          tag,
          art: 'Quartalszahlen',
        })),
      ]
        .sort((a, b) => a.tag.localeCompare(b.tag))
        .slice(0, 4)

      return {
        symbol: quote.symbol,
        ticker: quote.ticker,
        name: quote.name,
        einheit: quote.unit,
        stellen: quote.decimals,
        wert: quote.value,
        veraenderung: quote.changePercent,
        rendite: dividende?.renditeProzent ?? null,
        branche: quote.branche ?? null,
        sitzland: quote.sitzland ?? null,
        termine: alleTermine,
      }
    })
}

/**
 * Die Zutaten des Wochenberichts, für alle Titel vorgerechnet.
 *
 * Wie bei den Merkdaten gilt: Der Server weiß nicht, welche Titel gemerkt
 * sind, also rechnet er alle – dieselbe Wochenrechnung wie /news/woche.
 * Übertragen wird je Titel nur eine Zahl.
 */
async function baueWochen(
  daten: Merkdaten[]
): Promise<{
  wochen: Record<string, number | null>
  spanne: ReturnType<typeof letzteAbgeschlosseneWoche>
}> {
  const spanne = letzteAbgeschlosseneWoche(new Date().toISOString().slice(0, 10))
  const wochen: Record<string, number | null> = {}
  for (const eintrag of daten) {
    const reihe = await getSeries(eintrag.symbol, '1M')
    wochen[eintrag.symbol] = wochenveraenderung(reihe, spanne)?.prozent ?? null
  }
  return { wochen, spanne }
}

/** Die jüngste Meldung je Symbol – nur für Symbole, zu denen es eine gibt. */
async function baueMeldungen(): Promise<Record<string, Merkmeldung>> {
  const meldungen: Record<string, Merkmeldung> = {}
  // Artikel kommen absteigend sortiert – der erste Treffer je Symbol ist der jüngste.
  for (const artikel of await getNewsArticles()) {
    for (const symbol of artikel.relatedSymbols) {
      if (!(symbol in meldungen)) {
        meldungen[symbol] = {
          slug: artikel.slug,
          titel: artikel.title,
          datum: artikel.publishedAt.slice(0, 10),
        }
      }
    }
  }
  return meldungen
}

export default async function MerklisteSeite() {
  const daten = await baueDaten()
  const [{ wochen, spanne }, meldungen] = await Promise.all([
    baueWochen(daten),
    baueMeldungen(),
  ])

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
        <Merklistentafel daten={daten} laendernamen={laendernamen} />

        <Merkbericht
          daten={daten}
          wochen={wochen}
          meldungen={meldungen}
          spanne={spanne}
        />

        <Merkkalender daten={daten} />

        <Merkaustausch bekannteSymbole={daten.map((eintrag) => eintrag.symbol)} />

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
