import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatNumber } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'
import { getWebsiteZahlen } from '@/lib/website-zahlen'

export const metadata: Metadata = buildMetadata({
  // 152 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`).
  title: withBrand('Die Website in Zahlen'),
  description:
    'Wie viele Lernseiten, Kurse, Artikel, Quellen und Rechenwege es hier gibt – beim Bauen aus den echten Beständen gezählt, nicht von Hand eingetragen.',
  path: '/zahlen',
  ogTitle: 'Die Website in Zahlen',
})

/**
 * Der Umfang dieser Website, gezählt statt behauptet.
 *
 * ## Warum jede Zahl beim Bauen entsteht
 *
 * Weil eine hingeschriebene Zahl am Tag nach ihrer Eintragung falsch ist.
 * „34 Themen" stand monatelang richtig da und wäre beim fünfunddreißigsten
 * still zur Lüge geworden – niemand ändert eine Überschrift, weil ein
 * Datensatz dazugekommen ist.
 *
 * Gezählt wird deshalb aus **denselben Funktionen, aus denen die Seiten
 * lesen** (`lib/website-zahlen.ts`). Eine Zahl hier kann nicht von der
 * Wirklichkeit abweichen, weil sie die Wirklichkeit ist.
 *
 * ## Und warum die Seite zugleich eine Prüfung ist
 *
 * Das ist ihr eigentlicher Zweck. Diese Zahlen fallen nicht von selbst. Wenn
 * eine trotzdem fällt, hat sich ein Bestand geleert – und das ist genau die
 * Sorte Fehler, die nichts rot macht: Die Seite baut, die Prüfungen laufen, es
 * steht nur weniger da. `npm run zahlen` vergleicht gegen den letzten Stand.
 */
export default async function ZahlenSeite() {
  const zahlen = await getWebsiteZahlen()

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Zahlen"
        eyebrowIcon="chart"
        title="Die Website in Zahlen"
        lead="Wie viel hier eigentlich steht – jede Zahl beim Bauen aus den echten Beständen gezählt, keine von Hand eingetragen."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Zahlen' }]} />}
        meta={
          <>
            <span>{zahlen.length} Größen</span>
            <span aria-hidden="true">·</span>
            <span>bei jedem Bau neu gezählt</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Callout variant="info" title="Warum hier nichts von Hand gepflegt wird">
          <p>
            Eine Zahl, die jemand einträgt, ist am Tag danach falsch – niemand ändert eine
            Überschrift, weil ein Datensatz dazugekommen ist. Jede Zahl auf dieser Seite
            wird beim Bauen aus denselben Beständen gezählt, aus denen die Seiten selbst
            lesen. Sie kann von der Website nicht abweichen, weil sie die Website ist.
          </p>
          <p className="mt-3">
            Das ist zugleich eine Prüfung: Diese Zahlen fallen nicht von selbst. Fällt
            eine trotzdem, fehlt ein Datenbestand – und das meldet uns die Prüfung, bevor
            es jemandem auf der Seite auffällt.
          </p>
        </Callout>

        {/*
          Eine Liste, keine Tabelle.

          Der Hinweissatz unter jeder Zahl ist der Teil, der zählt: „102
          Lernstufen" heißt nichts, solange nicht dabeisteht, dass das einzelne
          Seiten mit eigenem Text sind und nicht Themen mal drei. In einer
          Tabellenzelle wäre für diesen Satz kein Platz.
        */}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {zahlen.map((zahl) => (
            <li key={zahl.id} className="fk-card p-6">
              <p className="text-fg text-4xl font-bold tabular-nums">
                {formatNumber(zahl.wert)}
              </p>
              <h2 className="text-fg mt-1 text-base font-semibold">
                {zahl.ziel ? (
                  <Link
                    href={zahl.ziel}
                    className="hover:text-markets underline underline-offset-2 transition"
                  >
                    {zahl.label}
                  </Link>
                ) : (
                  zahl.label
                )}
              </h2>
              <p className="text-fg-muted mt-2 text-sm leading-relaxed">{zahl.hinweis}</p>
            </li>
          ))}
        </ul>

        <div className="text-fg-muted mt-14 max-w-3xl space-y-4 text-sm leading-relaxed">
          <p>
            Was hier <strong className="text-fg">nicht</strong> steht: Besucherzahlen,
            Abrufe, Verweildauer. Diese Website misst ihre Leser nicht – es gibt kein
            Zählpixel und keine Cookies, also auch keine Zahl darüber, wer hier war.
          </p>
          <p>
            Wie die einzelnen Kennzahlen gerechnet werden, steht auf{' '}
            <Link
              href="/methoden"
              className="hover:text-markets underline underline-offset-2"
            >
              Methoden
            </Link>
            , woher die Daten kommen auf{' '}
            <Link
              href="/quellen"
              className="hover:text-markets underline underline-offset-2"
            >
              Quellen
            </Link>
            , und was sich zuletzt geändert hat im{' '}
            <Link
              href="/aenderungen"
              className="hover:text-markets underline underline-offset-2"
            >
              Änderungsprotokoll
            </Link>
            .
          </p>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Die Website in Zahlen',
          description:
            'Umfang dieser Website: Lernseiten, Kurse, Artikel, Quellen und Rechenwege, beim Bauen gezählt.',
          path: '/zahlen',
          items: zahlen.map((zahl) => ({
            name: `${zahl.label}: ${zahl.wert}`,
            path: zahl.ziel ?? '/zahlen',
          })),
        })}
      />
    </>
  )
}
