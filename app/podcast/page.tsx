import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { formatDate, formatDateTime } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { folgenDauer, getFolgen, podcastBeschreibung, podcastStand } from '@/lib/podcast'
import { buildMetadata, withBrand } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

const spotify = siteConfig.socialLinks.find((eintrag) => eintrag.icon === 'spotify')

export const metadata: Metadata = buildMetadata({
  title: withBrand('Der Podcast'),
  description:
    'Alle Folgen des Podcasts von IM Invests mit Titel, Datum und Beschreibung – zum Nachlesen, was in welcher Folge behandelt wurde, und mit dem Weg zum Anhören.',
  path: '/podcast',
  ogTitle: 'Der Podcast: alle Folgen im Überblick',
})

export default function PodcastSeite() {
  const folgen = getFolgen()

  return (
    <>
      <PageHeader
        area="news"
        eyebrow="Podcast"
        eyebrowIcon="spotify"
        title="Zum Hören statt zum Lesen"
        lead="Dieselben Themen wie auf dieser Website, nur gesprochen. Hier steht, was in welcher Folge vorkommt – damit sich eine bestimmte wiederfinden lässt, ohne die ganze Liste durchzuhören."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Podcast' }]} />}
        meta={
          <>
            <span>
              {folgen.length > 0 ? `${folgen.length} Folgen` : 'Folgenliste im Aufbau'}
            </span>
            {podcastStand && (
              <>
                <span aria-hidden="true">·</span>
                <span>Stand {formatDateTime(podcastStand)}</span>
              </>
            )}
          </>
        }
        actions={
          spotify && (
            <a
              href={spotify.href}
              target="_blank"
              rel="noopener noreferrer"
              className="fk-btn fk-btn-primary"
            >
              <Icon name="spotify" className="size-4" />
              Bei Spotify anhören
            </a>
          )
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {podcastBeschreibung && (
          <p className="text-fg-muted max-w-2xl text-lg leading-relaxed">
            {podcastBeschreibung}
          </p>
        )}

        {folgen.length === 0 ? (
          /*
            Der Zustand vor dem ersten Abruf.

            Diese Seite entsteht auch dann, wenn noch keine Folge im Bestand
            steht – sie beantwortet ja auch so eine Frage, nämlich wo der
            Podcast zu hören ist. Ein leeres Gerüst mit „bald mehr“ wäre
            allerdings eine leere Versprechung; deshalb steht hier, woran es
            liegt.
          */
          <Callout
            variant="info"
            title="Die Folgenliste steht noch nicht"
            className="mt-8"
          >
            <p>
              Die Folgen werden aus dem RSS-Feed des Podcasts übernommen, sobald dessen
              Adresse hinterlegt ist. Bis dahin führt der Weg über{' '}
              {spotify ? (
                <a
                  href={spotify.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-news font-medium underline underline-offset-2"
                >
                  Spotify
                </a>
              ) : (
                'die Abspielplattform'
              )}
              . Dort sind alle Folgen vollständig.
            </p>
          </Callout>
        ) : (
          <ol className="border-border mt-10 border-t">
            {folgen.map((folge, index) => {
              const dauer = folgenDauer(folge)
              /*
                Jede Folge trägt ihre eigene Sprungmarke.

                Damit hat sie eine Adresse, die sich weitergeben lässt, und die
                Suche kann direkt auf sie zeigen – wie beim Glossar, wo jeder
                Begriff unter `/glossar#<slug>` steht. `scroll-mt` hält die
                Überschrift dabei unter der Kopfzeile statt darunter.
              */
              return (
                <li
                  key={folge.slug}
                  id={folge.slug}
                  className="border-border scroll-mt-24 border-b py-6"
                >
                  <Reveal delay={Math.min(index, 12) * 0.03}>
                    <div className="text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      {folge.datum && <span>{formatDate(folge.datum)}</span>}
                      {folge.datum && dauer && <span aria-hidden="true">·</span>}
                      {dauer && <span>{dauer}</span>}
                    </div>
                    <h2 className="text-fg mt-1.5 text-xl font-semibold">
                      <a
                        href={`#${folge.slug}`}
                        className="hover:text-news transition-colors"
                      >
                        {folge.titel}
                      </a>
                    </h2>
                    {folge.beschreibung && (
                      <div className="text-fg-muted mt-2 max-w-3xl space-y-3 leading-relaxed">
                        {/*
                          Die Beschreibung, wie sie im Feed steht – ungekürzt
                          und unverändert. Das ist der Text des Autors, kein
                          Rohmaterial. Absätze entstehen an Leerzeilen; mehr
                          Struktur gibt der Feed nicht her, weil die
                          Auszeichnung beim Einlesen entfernt wurde.
                        */}
                        {folge.beschreibung.split(/\n\s*\n/).map((absatz, nummer) => (
                          <p key={nummer}>{absatz}</p>
                        ))}
                      </div>
                    )}
                    {/*
                      Der Verweis zur Folge, sonst zur Sendung. Manche Hoster
                      lassen den `link` je Folge weg – dann ist eine Ebene höher
                      immer noch besser als ein Knopf, der ins Leere zeigt.
                    */}
                    {(folge.url ?? spotify?.href) && (
                      <a
                        href={folge.url ?? spotify?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-news mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-2"
                      >
                        <Icon name="spotify" className="size-4" />
                        {folge.url ? 'Diese Folge anhören' : 'Podcast anhören'}
                      </a>
                    )}
                  </Reveal>
                </li>
              )
            })}
          </ol>
        )}

        <section aria-labelledby="warum-hier" className="mt-14">
          <h2 id="warum-hier" className="text-fg text-2xl font-bold">
            Warum die Folgen auch hier stehen
          </h2>
          <div className="text-fg-muted mt-3 max-w-2xl space-y-4 leading-relaxed">
            <p>
              Weil ein Verweis nach außen nur so lange hilft, wie jemand ihn anklickt. Wer
              sich an eine Folge über Zinsen erinnert und nach ihr sucht, findet sie hier
              – mit Titel, Datum und dem, was darin vorkommt. Jede Folge hat dabei ihre
              eigene Adresse: Ein Klick auf ihre Überschrift führt zu einem Verweis, der
              genau diese Folge trifft.
            </p>
            <p>
              Abgespielt wird auf dieser Seite nichts. Ein eingebetteter Abspieler lädt
              beim bloßen Seitenaufruf die Skripte seines Anbieters nach und setzt
              Kennungen, bevor jemand auf „Play“ gedrückt hat. Ein Verweis tut das nicht.
            </p>
          </div>
        </section>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Der Podcast von IM Invests',
          description:
            'Alle Folgen des Podcasts mit Titel, Datum und Beschreibung – und dem Weg zum Anhören.',
          path: '/podcast',
          items: folgen.slice(0, 20).map((folge) => ({
            name: folge.titel,
            path: `/podcast#${folge.slug}`,
          })),
        })}
      />
    </>
  )
}
