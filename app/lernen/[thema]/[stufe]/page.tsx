import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContentBlocks } from '@/components/content/ContentBlocks'
import { LevelComplete } from '@/components/learn/LevelComplete'
import { LevelNav, type LevelNavEntry } from '@/components/learn/LevelNav'
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
import { buildMetadata } from '@/lib/seo'

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
      title: 'Lernstufe nicht gefunden | Finanzkompass',
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

  const levelEntries: LevelNavEntry[] = learnLevelIds.map((id) => ({
    id,
    title: topic.levels[id].title,
    readingMinutes: topic.levels[id].readingMinutes,
    status: topic.levels[id].status,
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
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          {/* ------------------------------------------------------ Inhalt */}
          <article className="min-w-0">
            {isOutline && (
              <Callout variant="warning" title="Diese Stufe ist noch eine Gliederung">
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

            <div className={isOutline ? 'mt-8' : ''}>
              <ContentBlocks blocks={level.blocks} />
            </div>

            {/* --------------------------------------- Abschluss und Weiter */}
            <div className="mt-14">
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
