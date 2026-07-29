import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContentBlocks } from '@/components/content/ContentBlocks'
import { Vorlesen } from '@/components/ui/Vorlesen'
import { LevelComplete } from '@/components/learn/LevelComplete'
import { LevelNav, type LevelNavEntry } from '@/components/learn/LevelNav'
import { Quiz } from '@/components/learn/Quiz'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { TopicProgress } from '@/components/learn/TopicProgress'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { learnLevelIds, learnLevelMeta } from '@/data/learn/types'
import { learningResourceSchema } from '@/lib/jsonld'
import { getLearnLevel, getLearnLevelParams, getRelatedTopics } from '@/lib/learn'
import { begriffeZumThema, getBegriffsindex, kurzerklaerung } from '@/lib/glossar'
import { getPfadeMitStufe } from '@/lib/lernpfade'
import { buildMetadata, withBrand } from '@/lib/seo'
import { vorleseAbschnitte } from '@/lib/vorlese-text'
import { figureMeta } from '@/data/figures'

type LevelPageProps = { params: Promise<{ thema: string; stufe: string }> }

/**
 * Alle 66 Kombinationen aus Thema und Stufe werden vorgerendert.
 *
 * Jede Stufe ist damit eine eigenständige, statisch ausgelieferte Seite mit
 * eigenem Permalink – genau das, was für Indexierbarkeit nötig ist.
 */
export async function generateStaticParams() {
  return getLearnLevelParams()
}

export async function generateMetadata({ params }: LevelPageProps): Promise<Metadata> {
  const { thema, stufe } = await params
  const result = await getLearnLevel(thema, stufe)

  if (!result) {
    return buildMetadata({
      title: withBrand('Lernstufe nicht gefunden'),
      description: 'Die gesuchte Lernstufe existiert nicht.',
      path: `/lernen/${thema}/${stufe}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: result.level.metaTitle,
    description: result.level.metaDescription,
    path: `/lernen/${thema}/${stufe}`,
    type: 'article',
    tags: result.topic.keywords,
    ogTitle: `${result.topic.title} – ${learnLevelMeta[result.levelId].label}`,
  })
}

export default async function LearnLevelPage({ params }: LevelPageProps) {
  const { thema, stufe } = await params
  const result = await getLearnLevel(thema, stufe)

  if (!result) notFound()

  const { topic, levelId, level, previousLevelId, nextLevelId } = result
  const relatedTopics = await getRelatedTopics(thema, 3)
  const pfade = await getPfadeMitStufe(thema, stufe)

  /*
    Die Glossarverlinkung gilt je Seite: `benutzt` sammelt, was schon verlinkt
    ist, damit ein Begriff genau einmal vorkommt. Ausgenommen sind die Begriffe
    des eigenen Themas – ein Verweis von der Aktien-Seite auf „Aktie“ führt auf
    eine kürzere Fassung dessen, was gerade dasteht.
  */
  const glossarlage = {
    index: getBegriffsindex(),
    benutzt: new Set<string>(),
    ausgenommen: begriffeZumThema(thema),
    erklaerung: kurzerklaerung,
  }

  const levelEntries: LevelNavEntry[] = learnLevelIds.map((id) => ({
    id,
    title: topic.levels[id].title,
    readingMinutes: topic.levels[id].readingMinutes,
    status: topic.levels[id].status,
    hasQuiz: (topic.levels[id].quiz?.length ?? 0) > 0,
  }))

  const isOutline = level.status === 'outline'

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow={`${topic.title} · Stufe ${learnLevelIds.indexOf(levelId) + 1} von 3`}
        eyebrowIcon="book"
        title={level.title}
        lead={level.lead}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Lernen', path: '/lernen' },
              { name: topic.title, path: `/lernen/${topic.slug}` },
              { name: learnLevelMeta[levelId].label },
            ]}
          />
        }
        meta={
          <>
            <span className="text-fg font-semibold">{learnLevelMeta[levelId].label}</span>
            <span aria-hidden="true">·</span>
            <span>{level.readingMinutes} Min. Lesezeit</span>
            <span aria-hidden="true">·</span>
            <span>{isOutline ? 'Gliederung' : 'Ausgearbeiteter Text'}</span>
            {level.quiz && level.quiz.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-learn flex items-center gap-1 font-medium">
                  <Icon name="target" className="size-3.5" />
                  {level.quiz.length} Quizfragen
                </span>
              </>
            )}
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          {/* ------------------------------------------------------ Inhalt */}
          <article className="min-w-0">
            {isOutline && (
              <Callout variant="info" title="Diese Stufe ist noch eine Gliederung">
                <p>
                  Der ausformulierte Text zu dieser Stufe wird noch ergänzt. Die Punkte
                  unten zeigen, was er behandeln wird – inhaltlich bereits auf diese Stufe
                  abgestimmt, damit sich Beginner, Fortgeschritten und Profi nicht
                  überschneiden.
                </p>
                <p>
                  Ein vollständiges Beispiel dafür, wie die drei Stufen aufeinander
                  aufbauen, findest du bei{' '}
                  <Link
                    href="/lernen/aktie"
                    className="text-brand font-semibold underline"
                  >
                    Aktie
                  </Link>{' '}
                  und{' '}
                  <Link
                    href="/lernen/zinseszins"
                    className="text-brand font-semibold underline"
                  >
                    Zinseszins
                  </Link>
                  .
                </p>
              </Callout>
            )}

            {/* Vorlesen: dieselben Blöcke, als gesprochene Abschnitte. */}
            {!isOutline && (
              <div className="mb-8">
                <Vorlesen abschnitte={vorleseAbschnitte(level.blocks, figureMeta)} />
              </div>
            )}

            <div className={isOutline ? 'mt-8' : ''}>
              <ContentBlocks blocks={level.blocks} glossar={glossarlage} />
            </div>

            {/* ------------------------------------------------ Wissenscheck */}
            <div className="mt-14">
              {level.quiz && level.quiz.length > 0 ? (
                <Quiz
                  topicSlug={topic.slug}
                  levelId={levelId}
                  levelLabel={learnLevelMeta[levelId].label}
                  questions={level.quiz}
                />
              ) : (
                <Callout variant="info" title="Wissenscheck folgt">
                  <p>
                    Zu dieser Stufe gibt es noch keine Quizfragen – sie entstehen zusammen
                    mit dem ausformulierten Text, weil sich Fragen zu einer Gliederung
                    nicht sinnvoll beantworten lassen.
                  </p>
                  <p>
                    Ausprobieren kannst du den Wissenscheck bereits bei{' '}
                    <Link
                      href="/lernen/aktie/beginner"
                      className="text-brand font-semibold underline"
                    >
                      Aktie
                    </Link>{' '}
                    und{' '}
                    <Link
                      href="/lernen/zinseszins/beginner"
                      className="text-brand font-semibold underline"
                    >
                      Zinseszins
                    </Link>
                    .
                  </p>
                </Callout>
              )}
            </div>

            {/* --------------------------------------- Abschluss und Weiter */}
            <div className="mt-8">
              <LevelComplete
                topicSlug={topic.slug}
                topicTitle={topic.title}
                levelId={levelId}
                nextLevelId={nextLevelId}
              />
            </div>

            {/* Vorherige/nächste Stufe als klassische Blätternavigation. */}
            <nav
              aria-label="Weitere Stufen dieses Themas"
              className="border-border mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between"
            >
              {previousLevelId ? (
                <Link
                  href={`/lernen/${topic.slug}/${previousLevelId}`}
                  className="fk-btn-ghost justify-start"
                >
                  <Icon name="arrow-left" className="size-4" />
                  {learnLevelMeta[previousLevelId].label}
                </Link>
              ) : (
                <Link
                  href={`/lernen/${topic.slug}`}
                  className="fk-btn-ghost justify-start"
                >
                  <Icon name="arrow-left" className="size-4" />
                  Themenübersicht
                </Link>
              )}

              {nextLevelId && (
                <Link
                  href={`/lernen/${topic.slug}/${nextLevelId}`}
                  className="fk-btn-ghost justify-end"
                >
                  {learnLevelMeta[nextLevelId].label}
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              )}
            </nav>
          </article>

          {/* ------------------------------------------------ Seitenleiste */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section aria-labelledby="stufen-nav" className="fk-card p-6">
              <h2 id="stufen-nav" className="text-fg text-base font-semibold">
                {topic.title}
              </h2>
              <div className="mt-4">
                <TopicProgress topicSlug={topic.slug} />
              </div>
              <div className="border-border mt-5 border-t pt-4">
                <LevelNav
                  topicSlug={topic.slug}
                  entries={levelEntries}
                  currentLevelId={levelId}
                />
              </div>
              <p className="border-border mt-4 border-t pt-4">
                <Link
                  href={`/lernen/${topic.slug}`}
                  className="text-learn hover:text-brand text-sm font-semibold transition"
                >
                  Zur Themenübersicht
                </Link>
              </p>
            </section>

            {/*
              Wozu diese Stufe gehört.

              Wer über die Suche hier landet, sieht sonst eine einzelne Seite
              ohne Zusammenhang. Der Verweis sagt, auf welchem Weg sie liegt und
              an welcher Stelle – das ist die Gegenrichtung zum Pfad selbst.
            */}
            {pfade.length > 0 && (
              <section aria-labelledby="pfade-mit" className="fk-card p-6">
                <h2 id="pfade-mit" className="text-fg text-base font-semibold">
                  Teil dieser Lernpfade
                </h2>
                <ul className="mt-4 space-y-3">
                  {pfade.map(({ pfad, nummer }) => (
                    <li key={pfad.slug}>
                      <Link
                        href={`/lernen/pfade/${pfad.slug}`}
                        className="text-learn hover:text-brand text-sm font-semibold transition"
                      >
                        {pfad.titel}
                      </Link>
                      <p className="text-fg-subtle text-xs">
                        Schritt {nummer} von {pfad.schritte.length}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <TopicLinkList topics={relatedTopics} title="Verwandte Themen" />
          </aside>
        </div>
      </div>

      <JsonLd
        data={learningResourceSchema({
          name: level.title,
          description: level.metaDescription,
          path: `/lernen/${topic.slug}/${levelId}`,
          educationalLevel: learnLevelMeta[levelId].label,
          timeRequiredMinutes: level.readingMinutes,
          about: topic.title,
          keywords: topic.keywords,
        })}
      />
    </>
  )
}
