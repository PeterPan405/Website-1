import type { Metadata } from 'next'

import { absoluteUrl, siteConfig } from '@/lib/site'

/**
 * Zentrale SEO-Hilfsfunktion.
 *
 * Jede Seite ruft `buildMetadata()` auf, statt das Metadaten-Boilerplate
 * (Open Graph, Twitter-Card, canonical) zu duplizieren. Dadurch ist garantiert,
 * dass keine Seite ohne canonical-URL oder ohne OG-Bild ausgeliefert wird.
 */

/**
 * Zielkorridore für Suchmaschinen-Snippets.
 *
 * Google schneidet Titel etwa ab 580 Pixel und Descriptions etwa ab 160 Zeichen
 * ab. Die Werte sind Richtwerte für die Redaktion, keine harten Grenzen – im
 * Entwicklungsmodus warnt {@link buildMetadata} bei Abweichungen.
 */
export const SEO_TITLE_RANGE = { min: 30, max: 62 } as const
export const SEO_DESCRIPTION_RANGE = { min: 110, max: 165 } as const

/**
 * Hängt den Unternehmensnamen an einen Seitentitel.
 *
 * Der Markenname steht dadurch nirgends fest im Quellcode einer Seite – eine
 * Umbenennung des Unternehmens betrifft nur `siteConfig.name`. Nicht überall
 * sinnvoll: Bei langen, sprechenden Titeln (etwa Artikelüberschriften) würde das
 * Suffix die Anzeigelänge sprengen, dort bleibt der Titel ohne Marke.
 */
export function withBrand(title: string): string {
  return `${title} | ${siteConfig.name}`
}

export interface SeoInput {
  /**
   * Der vollständige Inhalt des <title>-Tags, inklusive eventueller Marke.
   * Wird absolut gesetzt, damit die Länge exakt steuerbar bleibt und kein
   * Template unbemerkt Zeichen anhängt.
   */
  title: string
  /** Meta-Description, individuell pro Seite. */
  description: string
  /** Pfad ab Domain-Wurzel, z. B. `/lernen/aktie`. Wird zur canonical-URL. */
  path: string
  /** Überschreibt den Titel in der Social-Vorschau (oft kürzer/griffiger). */
  ogTitle?: string
  /** Überschreibt die Beschreibung in der Social-Vorschau. */
  ogDescription?: string
  /** `article` für News- und Lerninhalte, sonst `website`. */
  type?: 'website' | 'article'
  /** ISO-Datum der Veröffentlichung (nur bei `type: 'article'` relevant). */
  publishedTime?: string
  /** ISO-Datum der letzten Änderung. */
  modifiedTime?: string
  /** Schlagwörter des Artikels. */
  tags?: readonly string[]
  /** Von der Indexierung ausnehmen (z. B. Danke-Seiten). */
  noIndex?: boolean
}

function warnAboutLength(
  field: string,
  value: string,
  range: { min: number; max: number }
) {
  if (process.env.NODE_ENV === 'production') return
  if (value.length < range.min || value.length > range.max) {
    console.warn(
      `[seo] ${field} hat ${value.length} Zeichen, empfohlen sind ${range.min}–${range.max}: "${value}"`
    )
  }
}

/**
 * Das von `app/opengraph-image.tsx` erzeugte Vorschaubild.
 *
 * Die relative URL wird über `metadataBase` im Root-Layout zur absoluten URL
 * aufgelöst, wie es Open Graph verlangt.
 */
const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} – ${siteConfig.slogan}`,
} as const

export function buildMetadata(input: SeoInput): Metadata {
  const {
    title,
    description,
    path,
    ogTitle,
    ogDescription,
    type = 'website',
    publishedTime,
    modifiedTime,
    tags,
    noIndex = false,
  } = input

  warnAboutLength(`title (${path})`, title, SEO_TITLE_RANGE)
  warnAboutLength(`description (${path})`, description, SEO_DESCRIPTION_RANGE)

  const url = absoluteUrl(path)
  const socialTitle = ogTitle ?? title
  const socialDescription = ogDescription ?? description

  return {
    title: { absolute: title },
    description,
    alternates: {
      // Relative Angabe – wird über metadataBase im Root-Layout aufgelöst.
      canonical: path,
    },
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      locale: 'de_DE',
      title: socialTitle,
      description: socialDescription,
      // Das Bild muss hier ausdrücklich stehen: Sobald eine Seite ein eigenes
      // openGraph-Objekt exportiert, ersetzt es das des Layouts vollständig –
      // das von app/opengraph-image.tsx erzeugte Bild würde dann auf allen
      // Unterseiten fehlen.
      images: [OG_IMAGE],
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
            tags: tags ? [...tags] : undefined,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title: socialTitle,
      description: socialDescription,
      images: [OG_IMAGE],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}
