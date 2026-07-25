import { absoluteUrl, siteConfig } from '@/lib/site'

/**
 * Bausteine für strukturierte Daten (JSON-LD, schema.org).
 *
 * Die Funktionen liefern reine Objekte. Ausgegeben werden sie über die
 * Komponente `components/seo/JsonLd.tsx`, die das Escaping übernimmt.
 */

export type JsonLdObject = Record<string, unknown>

/** Stabile @id für die Organisation, damit andere Knoten darauf verweisen können. */
const organizationId = `${siteConfig.url}/#organization`
const websiteId = `${siteConfig.url}/#website`

export function organizationSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: siteConfig.name,
    url: siteConfig.url,
    slogan: siteConfig.slogan,
    description: siteConfig.description,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.svg'),
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Redaktion',
      email: siteConfig.contactEmail,
      availableLanguage: ['de'],
    },
  }
}

export function webSiteSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'de-DE',
    publisher: { '@id': organizationId },
    // Hinweis: Eine SearchAction wird bewusst nicht ausgegeben, solange die
    // Website keine eigene Suchfunktion hat. Google verlangt für sitelinks
    // searchbox eine tatsächlich funktionierende Such-URL.
  }
}

export interface BreadcrumbItem {
  name: string
  /** Pfad ab Domain-Wurzel. Beim letzten Element optional. */
  path?: string
}

export function breadcrumbSchema(items: readonly BreadcrumbItem[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(item.path) } : {}),
    })),
  }
}

export interface NewsArticleSchemaInput {
  headline: string
  description: string
  path: string
  publishedAt: string
  updatedAt?: string
  author: string
  section: string
  keywords: readonly string[]
}

export function newsArticleSchema(input: NewsArticleSchemaInput): JsonLdObject {
  const url = absoluteUrl(input.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline: input.headline,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    inLanguage: 'de-DE',
    articleSection: input.section,
    keywords: input.keywords.join(', '),
    author: { '@type': 'Person', name: input.author },
    publisher: { '@id': organizationId },
    isAccessibleForFree: true,
  }
}

export interface LearningResourceSchemaInput {
  name: string
  description: string
  path: string
  /** z. B. "Beginner", "Fortgeschritten", "Profi". */
  educationalLevel: string
  /** Grobe Bearbeitungsdauer in Minuten. */
  timeRequiredMinutes: number
  about: string
  keywords: readonly string[]
}

export function learningResourceSchema(input: LearningResourceSchemaInput): JsonLdObject {
  const url = absoluteUrl(input.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    name: input.name,
    description: input.description,
    inLanguage: 'de-DE',
    learningResourceType: 'Lerneinheit',
    educationalLevel: input.educationalLevel,
    // ISO-8601-Dauer, z. B. PT8M für acht Minuten.
    timeRequired: `PT${input.timeRequiredMinutes}M`,
    about: { '@type': 'Thing', name: input.about },
    keywords: input.keywords.join(', '),
    teaches: input.about,
    isAccessibleForFree: true,
    provider: { '@id': organizationId },
  }
}

export interface WebApplicationSchemaInput {
  name: string
  description: string
  path: string
  /** Kurze Auflistung, was das Werkzeug kann. */
  featureList: readonly string[]
}

export function webApplicationSchema(input: WebApplicationSchemaInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    applicationCategory: 'FinanceApplication',
    // Läuft vollständig im Browser, es gibt keine Installationsvoraussetzung.
    operatingSystem: 'Alle Betriebssysteme mit modernem Webbrowser',
    browserRequirements: 'Erfordert JavaScript',
    inLanguage: 'de-DE',
    featureList: [...input.featureList],
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    publisher: { '@id': organizationId },
  }
}

export interface CollectionPageSchemaInput {
  name: string
  description: string
  path: string
  items: readonly { name: string; path: string }[]
}

/** Übersichtsseiten: WebPage mit ItemList der enthaltenen Unterseiten. */
export function collectionPageSchema(input: CollectionPageSchemaInput): JsonLdObject {
  const url = absoluteUrl(input.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name: input.name,
    description: input.description,
    inLanguage: 'de-DE',
    isPartOf: { '@id': websiteId },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: input.items.length,
      itemListElement: input.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  }
}

export interface DatasetSchemaInput {
  name: string
  description: string
  path: string
  temporalCoverage: string
  keywords: readonly string[]
}

/** Für die Marktseiten und den Staatsverschuldungs-Vergleich. */
export function datasetSchema(input: DatasetSchemaInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    inLanguage: 'de-DE',
    temporalCoverage: input.temporalCoverage,
    keywords: [...input.keywords],
    creator: { '@id': organizationId },
    isAccessibleForFree: true,
  }
}
