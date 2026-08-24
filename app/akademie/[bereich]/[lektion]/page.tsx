import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LektionAbschluss } from '@/components/akademie/LektionAbschluss'
import { ContentBlocks } from '@/components/content/ContentBlocks'
import { Druckknopf } from '@/components/ui/Druckknopf'
import { Druckquelle } from '@/components/ui/Druckquelle'
import { Vorlesen } from '@/components/ui/Vorlesen'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { TagLinks } from '@/components/ui/TagLinks'
import { getCalculatorDefinition } from '@/data/calculators'
import { vorlesegrafiken } from '@/lib/grafik-beschreibungen'
import {
  belegarten,
  getAlleLektionen,
  getBereich,
  getLektion,
  nachbarn,
} from '@/lib/akademie'
import { begriffeZumThema, getBegriffsindex, kurzerklaerung } from '@/lib/glossar'
import { learningResourceSchema } from '@/lib/jsonld'
import { getLearnTopic } from '@/lib/learn'
import { buildMetadata, withBrand } from '@/lib/seo'
import { vorleseaufnahme } from '@/lib/lese-audio'
import { vorleseAbschnitte } from '@/lib/vorlese-text'

type Props = { params: Promise<{ bereich: string; lektion: string }> }

export function generateStaticParams() {
  return getAlleLektionen().map((lektion) => ({
    bereich: lektion.bereich,
    lektion: lektion.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bereich, lektion } = await params
  const gefunden = getLektion(bereich, lektion)

  if (!gefunden) {
    return buildMetadata({
      title: withBrand('Lektion nicht gefunden'),
      description: 'Diese Lektion der Akademie gibt es nicht.',
      path: `/akademie/${bereich}/${lektion}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: withBrand(gefunden.titel),
    description: gefunden.kurz,
    path: `/akademie/${bereich}/${gefunden.slug}`,
    ogTitle: gefunden.titel,
  })
}

export default async function LektionPage({ params }: Props) {
  const { bereich, lektion } = await params
  const gefunden = getLektion(bereich, lektion)
  const bereichsdaten = getBereich(bereich)

  if (!gefunden || !bereichsdaten) notFound()

  const { vorher, nachher } = nachbarn(gefunden)

  /*
    Die Glossarverlinkung wie im Lernbereich: Jeder Begriff wird auf einer
    Seite höchstens einmal verlinkt. Ausgenommen sind hier keine Begriffe – die
    Lektionen tragen andere Titel als die Glossareinträge, ein Verweis von
    „MACD“ auf den Glossareintrag zum gleitenden Durchschnitt führt also nicht
    auf eine kürzere Fassung derselben Seite.
  */
  const glossarlage = {
    index: getBegriffsindex(),
    benutzt: new Set<string>(),
    ausgenommen: begriffeZumThema(gefunden.slug),
    erklaerung: kurzerklaerung,
  }

  const voraussetzungen = (gefunden.setztVoraus ?? [])
    .map((slug) => getLektion(bereich, slug))
    .filter((eintrag) => eintrag !== undefined)

  const rechner = (gefunden.rechner ?? [])
    .map((slug) => getCalculatorDefinition(slug))
    .filter((eintrag) => eintrag !== undefined)

  const lernthemen = (
    await Promise.all((gefunden.lernthemen ?? []).map((slug) => getLearnTopic(slug)))
  ).filter((thema) => thema !== null)

  return (
    <>
      <PageHeader
        area="akademie"
        eyebrow={bereichsdaten.titel}
        eyebrowIcon={bereichsdaten.sinnbild}
        title={gefunden.titel}
        lead={gefunden.kurz}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Akademie', path: '/akademie' },
              { name: bereichsdaten.titel, path: `/akademie/${bereichsdaten.id}` },
              { name: gefunden.titel },
            ]}
          />
        }
        meta={
          <>
            <span>{gefunden.dauer} Min. Lesezeit</span>
            <span aria-hidden="true">·</span>
            <span>{belegarten[gefunden.belegart].label}</span>
          </>
        }
      />

      <div className="fk-container py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <article className="min-w-0">
            {/*
              Die Kernaussage steht vor dem Text, nicht als Zusammenfassung
              dahinter. Wer nach dem ersten Absatz abbricht, soll den Satz
              mitgenommen haben, um den es geht.
            */}
            <p className="border-akademie text-fg border-l-4 py-1 pl-5 text-lg leading-relaxed font-medium">
              {gefunden.kernaussage}
            </p>

            {/*
              Die Abschnitte entstehen beim Bauen aus denselben Blöcken wie die
              Seite – die Kernaussage zuerst, dann der Inhalt. Grafiken werden
              über ihre Vorlesefassung aus data/figures.ts gesprochen.
            */}
            <div data-drucken="aus" className="mt-6 flex flex-wrap items-center gap-3">
              <Vorlesen
                abschnitte={vorleseAbschnitte(
                  [{ type: 'paragraph', text: gefunden.kernaussage }, ...gefunden.inhalt],
                  vorlesegrafiken()
                )}
                aufnahme={vorleseaufnahme(
                  `akademie/${gefunden.bereich}/${gefunden.slug}`
                )}
              />
              <Druckknopf />
            </div>

            <div className="mt-8">
              <ContentBlocks blocks={gefunden.inhalt} glossar={glossarlage} />
            </div>

            <div className="mt-10">
              <Callout
                variant="info"
                title={`Einstufung: ${belegarten[gefunden.belegart].label}`}
              >
                <p>{belegarten[gefunden.belegart].erklaerung}</p>
              </Callout>
            </div>

            {/*
              Der Erledigt-Schalter steht vor der Blätternavigation.

              Wer unten ankommt, hat die Lektion gelesen – der Haken gehört
              deshalb an diese Stelle und nicht in die Seitenleiste, wo er beim
              Ankommen längst aus dem Bild wäre.
            */}
            {/*
              Der Haken im Behälter, nicht am Bauteil.

              `LektionAbschluss` reicht unbekannte Eigenschaften nicht durch;
              ein `data-drucken` daran wäre stillschweigend verschwunden – und
              stünde dann auf jedem Ausdruck.
            */}
            <div data-drucken="aus">
              <LektionAbschluss
                bereich={bereich}
                lektionSlug={gefunden.slug}
                lektionTitel={gefunden.titel}
                naechste={nachher && { slug: nachher.slug, titel: nachher.titel }}
              />
            </div>

            {/* Vor und zurück innerhalb des Bereichs */}
            <nav
              data-drucken="aus"
              aria-label="Weitere Lektionen"
              className="border-border mt-10 grid gap-3 border-t pt-6 sm:grid-cols-2"
            >
              {vorher ? (
                <Link
                  href={`/akademie/${bereich}/${vorher.slug}`}
                  className="fk-card-interactive group flex flex-col p-4"
                >
                  <span className="text-fg-subtle flex items-center gap-1 text-xs">
                    <Icon name="arrow-left" className="size-3.5" />
                    Vorherige Lektion
                  </span>
                  <span className="text-fg group-hover:text-akademie mt-1 font-semibold transition">
                    {vorher.titel}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {nachher ? (
                <Link
                  href={`/akademie/${bereich}/${nachher.slug}`}
                  className="fk-card-interactive group flex flex-col p-4 sm:text-right"
                >
                  <span className="text-fg-subtle flex items-center gap-1 text-xs sm:justify-end">
                    Nächste Lektion
                    <Icon name="arrow-right" className="size-3.5" />
                  </span>
                  <span className="text-fg group-hover:text-akademie mt-1 font-semibold transition">
                    {nachher.titel}
                  </span>
                </Link>
              ) : (
                <Link
                  href={`/akademie/${bereich}`}
                  className="fk-card-interactive group flex flex-col p-4 sm:text-right"
                >
                  <span className="text-fg-subtle text-xs sm:text-right">
                    Ende des Bereichs
                  </span>
                  <span className="text-fg group-hover:text-akademie mt-1 font-semibold transition">
                    Zurück zur Übersicht
                  </span>
                </Link>
              )}
            </nav>

            {/* Steht nur auf Papier – damit das Blatt seinen Absender kennt. */}
            <Druckquelle pfad={`/akademie/${bereich}/${lektion}`} />
          </article>

          {/*
            Die Seitenleiste ist auf Papier nichts als eine Liste toter
            Verweise: Voraussetzungen, Grundlagen, Rechner, Stichworte – alles
            Wege woandershin. Sie stünde außerdem hinter der Herkunftszeile und
            damit hinter dem Schluss des Blattes.
          */}
          <aside
            data-drucken="aus"
            className="space-y-6 lg:sticky lg:top-24 lg:self-start"
          >
            {voraussetzungen.length > 0 && (
              <section className="fk-card p-5">
                <h2 className="text-fg text-sm font-semibold">Setzt voraus</h2>
                <ul className="mt-3 space-y-2">
                  {voraussetzungen.map((eintrag) => (
                    <li key={eintrag.slug}>
                      <Link
                        href={`/akademie/${bereich}/${eintrag.slug}`}
                        className="text-fg-muted hover:text-akademie text-sm transition"
                      >
                        {eintrag.titel}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {lernthemen.length > 0 && (
              <section className="fk-card p-5">
                <h2 className="text-fg text-sm font-semibold">Grundlagen dazu</h2>
                <p className="text-fg-subtle mt-1 text-xs leading-relaxed">
                  Aus dem Lernbereich – falls ein Begriff hier vorausgesetzt wird.
                </p>
                <ul className="mt-3 space-y-2">
                  {lernthemen.map((thema) => (
                    <li key={thema.slug}>
                      <Link
                        href={`/lernen/${thema.slug}`}
                        className="text-fg-muted hover:text-learn text-sm transition"
                      >
                        {thema.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {rechner.length > 0 && (
              <section className="fk-card p-5">
                <h2 className="text-fg text-sm font-semibold">Selbst nachrechnen</h2>
                <ul className="mt-3 space-y-2">
                  {rechner.map((eintrag) => (
                    <li key={eintrag.slug}>
                      <Link
                        href={`/rechner/${eintrag.slug}`}
                        className="text-fg-muted hover:text-tools flex items-center gap-2 text-sm transition"
                      >
                        <Icon name="calculator" className="size-4 shrink-0" />
                        {eintrag.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="fk-card p-5">
              <h2 className="text-fg text-sm font-semibold">Stichworte</h2>
              <div className="mt-3">
                <TagLinks tags={gefunden.stichworte} />
              </div>
            </section>
          </aside>
        </div>
      </div>

      <JsonLd
        data={learningResourceSchema({
          name: gefunden.titel,
          description: gefunden.kurz,
          path: `/akademie/${bereich}/${gefunden.slug}`,
          /*
            Als Niveau steht hier die Einstufung der Belegart und nicht
            „Fortgeschritten“. Sie ist die Angabe, die diese Lektionen
            tatsächlich unterscheidet – eine Stufeneinteilung wie im
            Lernbereich gibt es hier nicht.
          */
          educationalLevel: belegarten[gefunden.belegart].label,
          timeRequiredMinutes: gefunden.dauer,
          about: bereichsdaten.titel,
          keywords: gefunden.stichworte,
        })}
      />
    </>
  )
}
