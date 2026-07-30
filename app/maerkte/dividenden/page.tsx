import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { rhythmusLabel, type Rhythmus } from '@/lib/dividenden'
import {
  getDividendenAbdeckung,
  getDividendenbefund,
  getDividendenverlauf,
} from '@/lib/dividendentermine'
import { formatPercent } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { getQuotes } from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Dividenden: wer zahlt wie viel'),
  description:
    'Ausschüttungen über alle geführten Aktien: Rendite, Rhythmus und Jahre ohne Kürzung – und warum die höchste Rendite selten die beste ist.',
  path: '/maerkte/dividenden',
  ogTitle: 'Wer zahlt verlässlich Dividende?',
})

/** Ab dieser Rendite gilt eine Ausschüttung als auffällig hoch. */
const AUFFAELLIG_AB = 8

/** Wie viele Titel je Liste gezeigt werden. */
const LISTENLAENGE = 25

interface Zeile {
  symbol: string
  name: string
  rendite: number | null
  rhythmus: Rhythmus
  /** Wie viele abgeschlossene Jahre in Folge nicht gekürzt wurde. */
  jahreOhneKuerzung: number
}

/**
 * Eine Rangliste: Titel, Rhythmus und die Zahl, nach der sortiert wurde.
 *
 * Die beiden Listen unterscheiden sich nur in der letzten Spalte, und für
 * zwei fast gleiche Blöcke zweimal dasselbe Markup zu schreiben heißt, eine
 * spätere Änderung an genau einer von beiden zu vergessen.
 */
function Liste({
  eintraege,
  spalte,
}: {
  eintraege: readonly Zeile[]
  spalte: 'rendite' | 'jahre'
}) {
  return (
    <ul className="border-border mt-4 border-t">
      {eintraege.slice(0, LISTENLAENGE).map((zeile) => (
        <li
          key={zeile.symbol}
          className="border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-2.5"
        >
          <Link
            href={`/maerkte/${zeile.symbol}`}
            className="text-fg hover:text-markets min-w-0 flex-1 truncate text-sm font-medium"
          >
            {zeile.name}
          </Link>
          <span className="text-fg-subtle shrink-0 text-xs">
            {rhythmusLabel[zeile.rhythmus]}
          </span>
          <span className="text-fg shrink-0 text-sm font-medium tabular-nums">
            {spalte === 'rendite'
              ? zeile.rendite !== null
                ? formatPercent(zeile.rendite, 1)
                : '—'
              : `${zeile.jahreOhneKuerzung} Jahre`}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default async function DividendenSeite() {
  const quotes = await getQuotes()
  const aktien = quotes.filter((quote) => quote.kind === 'stock')
  const abdeckung = getDividendenAbdeckung()

  const zeilen: Zeile[] = []
  for (const quote of aktien) {
    const befund = getDividendenbefund(quote.symbol)
    if (!befund) continue

    const verlauf = getDividendenverlauf(quote.symbol)
    /*
      Gezählt wird über die abgeschlossenen Jahre, das laufende bleibt außen
      vor: Ein Quartalszahler hat Ende Juli zwei von vier Zahlungen geleistet,
      und diese Summe gegen ein volles Vorjahr zu halten ergäbe für jeden
      Zahler eine „Kürzung“.
    */
    const abgeschlossen = (verlauf?.jahre ?? []).filter((jahr) => !jahr.laufend)
    let ohneKuerzung = 0
    for (let index = abgeschlossen.length - 1; index > 0; index -= 1) {
      if (abgeschlossen[index].summe >= abgeschlossen[index - 1].summe) ohneKuerzung += 1
      else break
    }

    zeilen.push({
      symbol: quote.symbol,
      name: quote.name,
      rendite: befund.renditeProzent,
      rhythmus: befund.rhythmus,
      jahreOhneKuerzung: ohneKuerzung,
    })
  }

  const mitRendite = zeilen.filter(
    (zeile): zeile is Zeile & { rendite: number } => zeile.rendite !== null
  )

  const nachRendite = [...mitRendite].sort((a, b) => b.rendite - a.rendite)
  const auffaellig = nachRendite.filter((zeile) => zeile.rendite >= AUFFAELLIG_AB)
  const verlaesslich = [...zeilen]
    .filter((zeile) => zeile.jahreOhneKuerzung >= 2)
    .sort(
      (a, b) =>
        b.jahreOhneKuerzung - a.jahreOhneKuerzung || (b.rendite ?? 0) - (a.rendite ?? 0)
    )

  const mittlere =
    mitRendite.length > 0
      ? mitRendite.reduce((summe, zeile) => summe + zeile.rendite, 0) / mitRendite.length
      : 0

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Dividenden"
        eyebrowIcon="wallet"
        title="Wer zahlt – und wie verlässlich?"
        lead="Eine Dividende ist kein Zins. Sie wird jedes Jahr neu beschlossen, sie kann gekürzt werden, und am Tag der Ausschüttung fällt der Kurs um ungefähr denselben Betrag. Diese Seite zeigt, wer zahlt, wie viel und seit wann ohne Kürzung."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: 'Dividenden' }]}
          />
        }
        meta={
          <>
            <span>
              {abdeckung.mitZahlungen} von {abdeckung.aktien} Aktien mit Historie
            </span>
            <span aria-hidden="true">·</span>
            <span>{mitRendite.length} mit berechenbarer Rendite</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <StatGrid>
          <Stat
            label="Titel mit Zahlungen"
            value={String(abdeckung.mitZahlungen)}
            hint={`von ${abdeckung.aktien} geführten Aktien`}
          />
          <Stat
            label="Mittlere Rendite"
            value={formatPercent(mittlere, 2)}
            hint="Ungewichtet über alle Titel mit berechenbarer Rendite"
          />
          <Stat
            label="Auffällig hoch"
            value={String(auffaellig.length)}
            tone="negative"
            hint={`Titel mit ${AUFFAELLIG_AB} Prozent und mehr`}
          />
          <Stat
            label="Ohne Kürzung"
            value={String(verlaesslich.length)}
            tone="positive"
            hint="Titel mit mindestens zwei Jahren ohne Rückgang"
          />
        </StatGrid>

        <Callout variant="warning" title="Warum die höchste Rendite selten die beste ist">
          <p>
            Die Dividendenrendite ist ein Bruch: Ausschüttung geteilt durch Kurs. Sie
            steigt also nicht nur, wenn ein Unternehmen mehr zahlt – sie steigt auch, wenn
            der Kurs fällt. Und ein Kurs fällt selten ohne Grund.
          </p>
          <p>
            Deshalb stehen die {auffaellig.length} Titel mit {AUFFAELLIG_AB} Prozent und
            mehr weiter unten in einer eigenen Liste und nicht ganz oben in der Rangfolge:
            Bei den meisten von ihnen ist die hohe Zahl eine Nachricht über den Kurs und
            nicht über die Ausschüttung.
          </p>
        </Callout>

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <section aria-labelledby="verlaesslich">
            <h2 id="verlaesslich" className="text-fg text-2xl font-bold">
              Seit Jahren ohne Kürzung
            </h2>
            <p className="text-fg-muted mt-2 leading-relaxed">
              Gezählt werden abgeschlossene Kalenderjahre, in denen die Jahressumme nicht
              unter der des Vorjahres lag. Das laufende Jahr zählt nicht mit – es ist noch
              nicht fertig, und ein Quartalszahler hätte im Juli zwangsläufig „gekürzt“.
            </p>
            <p className="text-fg-subtle mt-2 text-sm leading-relaxed">
              Die Reihe reicht so weit zurück wie die gespeicherte Zahlungshistorie, also
              höchstens fünf Jahre. „Zwanzig Jahre ohne Kürzung“ kann diese Seite nicht
              sagen, weil sie es nicht weiß.
            </p>
            <Liste eintraege={verlaesslich} spalte="jahre" />
          </section>

          <section aria-labelledby="rendite">
            <h2 id="rendite" className="text-fg text-2xl font-bold">
              Nach Rendite
            </h2>
            <p className="text-fg-muted mt-2 leading-relaxed">
              Die Summe der Zahlungen der letzten zwölf Monate, geteilt durch den
              aktuellen Kurs. Gerechnet wird mit dem, was tatsächlich geflossen ist – wer
              eine Quartalsdividende mit vier multipliziert, unterstellt drei Zahlungen,
              die noch niemand beschlossen hat.
            </p>
            <p className="text-fg-subtle mt-2 text-sm leading-relaxed">
              Ohne die {auffaellig.length} auffällig hohen; die stehen darunter.
            </p>
            <Liste
              eintraege={nachRendite.filter((zeile) => zeile.rendite < AUFFAELLIG_AB)}
              spalte="rendite"
            />
          </section>
        </div>

        {auffaellig.length > 0 && (
          <section aria-labelledby="auffaellig" className="mt-12">
            <h2 id="auffaellig" className="text-fg text-2xl font-bold">
              Auffällig hohe Renditen
            </h2>
            <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
              Ab {AUFFAELLIG_AB} Prozent lohnt der zweite Blick. Manchmal steht dahinter
              eine Sonderausschüttung, die es nur einmal gab. Manchmal ein Geschäft, das
              seinen ganzen Gewinn ausschüttet, weil es nicht wächst. Und manchmal ein
              Kurs, der gefallen ist, weil der Markt die Ausschüttung für nicht haltbar
              hält – dann ist die hohe Rendite eine Zahl über die Vergangenheit.
            </p>
            <Liste eintraege={auffaellig} spalte="rendite" />
          </section>
        )}

        <section aria-labelledby="abgrenzung" className="mt-12">
          <h2 id="abgrenzung" className="text-fg text-2xl font-bold">
            Was hier fehlt
          </h2>
          <div className="text-fg-muted mt-3 max-w-2xl space-y-4 leading-relaxed">
            <p>
              Die Quellensteuer. Was von einer Ausschüttung ankommt, hängt am Sitzland des
              Unternehmens – bei einer Schweizer Aktie geht deutlich mehr ab als bei einer
              deutschen. Die Rechnung dazu steht auf jeder einzelnen Aktienseite und nicht
              hier: Sie hängt an der Person und nicht am Papier.
            </p>
            <p>
              Und {abdeckung.aktien - abdeckung.mitZahlungen} Aktien fehlen ganz. Bei den
              meisten, weil sie nichts ausschütten – das ist keine Lücke, sondern eine
              Angabe. Bei einigen, weil die Quelle keine Zahlungen meldet. Wie viel wovon,
              steht bei den{' '}
              <Link
                href="/quellen"
                className="text-markets font-medium underline underline-offset-2"
              >
                Quellen
              </Link>
              .
            </p>
          </div>
        </section>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Dividenden im Überblick',
          description:
            'Ausschüttungen über alle geführten Aktien: Rendite, Rhythmus und Jahre ohne Kürzung.',
          path: '/maerkte/dividenden',
          items: verlaesslich.slice(0, 20).map((zeile) => ({
            name: zeile.name,
            path: `/maerkte/${zeile.symbol}`,
          })),
        })}
      />
    </>
  )
}
