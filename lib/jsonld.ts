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
      // E.164 ohne Leerzeichen: schema.org erwartet die maschinenlesbare
      // Fassung, nicht die für Menschen gesetzte Schreibweise.
      telephone: siteConfig.contactPhoneLink,
      availableLanguage: ['de'],
    },
    /*
      Verknüpft die Website mit den Profilen derselben Marke. Suchmaschinen
      erkennen daran, dass YouTube-Kanal, Instagram-Konto und diese Domain zum
      selben Anbieter gehören – ohne diese Angabe bleiben es drei unverbundene
      Auftritte.
    */
    sameAs: siteConfig.socialLinks.map((profil) => profil.href),
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

export interface CourseSchemaInput {
  name: string
  description: string
  path: string
  /** Die Lektionen in der vorgesehenen Reihenfolge. */
  lektionen: readonly { name: string; path: string; minuten: number }[]
}

/**
 * Ein Akademie-Bereich als Kurs.
 *
 * ## Warum hier `Course` richtig ist und bei `/lernen` nicht
 *
 * Weil ein Bereich der Akademie eine **Reihenfolge** hat. `bereich.reihenfolge`
 * ist ausdrücklich „aufbauend, nicht alphabetisch“, und genau das unterscheidet
 * einen Kurs von einer Sammlung: Lektion vier setzt Lektion drei voraus. Die
 * Lernthemen unter `/lernen` sind dagegen nebeneinander lesbar – dort ist
 * `CollectionPage` die ehrlichere Auszeichnung und steht auch schon da.
 *
 * ## Warum keine `hasCourseInstance`
 *
 * Weil es keinen Termin, keinen Ort und keine Anmeldung gibt. `Course` ohne
 * Instanz beschreibt genau das: einen Lehrstoff, den man jederzeit lesen kann.
 * Eine erfundene Instanz mit `courseMode: online` und einem ausgedachten
 * Startdatum wäre eine Angabe über etwas, das nicht stattfindet.
 */
export function courseSchema(input: CourseSchemaInput): JsonLdObject {
  const url = absoluteUrl(input.path)
  const minuten = input.lektionen.reduce((summe, l) => summe + l.minuten, 0)
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': url,
    url,
    name: input.name,
    description: input.description,
    inLanguage: 'de-DE',
    provider: { '@id': organizationId },
    isAccessibleForFree: true,
    /*
      `educationalLevel` bleibt weg. Die Akademie kennt keine Stufen – anders
      als `/lernen`, wo jede Seite ausdrücklich Beginner, Fortgeschritten oder
      Profi ist. Ein geratenes „advanced“ wäre eine Behauptung über den Leser.
    */
    timeRequired: `PT${minuten}M`,
    numberOfCredits: input.lektionen.length,
    hasPart: input.lektionen.map((lektion, stelle) => ({
      '@type': 'LearningResource',
      position: stelle + 1,
      name: lektion.name,
      url: absoluteUrl(lektion.path),
      timeRequired: `PT${lektion.minuten}M`,
      isAccessibleForFree: true,
    })),
  }
}

export interface QuizSchemaInput {
  name: string
  path: string
  fragen: readonly {
    frage: string
    antworten: readonly string[]
    richtigerIndex: number
    erklaerung: string
  }[]
}

/**
 * Die Verständnisfragen einer Lernstufe.
 *
 * ## Warum `Quiz` und ausdrücklich **nicht** `FAQPage`
 *
 * Weil es keine häufig gestellten Fragen sind. Eine FAQ beantwortet, was Leser
 * von sich aus fragen; ein Quiz prüft, ob jemand den Text darüber verstanden
 * hat. „Was passiert mit der Kaufkraft bei 2 Prozent Inflation über 20 Jahre?“
 * mit vier Antwortmöglichkeiten und einer richtigen ist keine FAQ, sondern eine
 * Prüfungsfrage – und schema.org hat dafür einen eigenen Typ.
 *
 * Der Unterschied ist keine Wortklauberei. `FAQPage` löst bei Suchmaschinen
 * eine eigene Darstellung aus, und wer Quizfragen so auszeichnet, holt sich
 * eine Darstellung, die dem Leser die **Antwort** zeigt, bevor er die Frage
 * beantwortet hat. Das ist genau das Gegenteil dessen, wofür das Quiz da ist.
 *
 * `suggestedAnswer` trägt deshalb die falschen Antworten, `acceptedAnswer` die
 * richtige samt Begründung – so, wie es der Typ vorsieht.
 */
export function quizSchema(input: QuizSchemaInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    url: absoluteUrl(input.path),
    name: input.name,
    inLanguage: 'de-DE',
    isAccessibleForFree: true,
    educationalUse: 'Selbsteinschätzung',
    assesses: input.name,
    provider: { '@id': organizationId },
    hasPart: input.fragen.map((frage) => ({
      '@type': 'Question',
      eduQuestionType: 'Multiple choice',
      text: frage.frage,
      acceptedAnswer: {
        '@type': 'Answer',
        text: frage.antworten[frage.richtigerIndex] ?? '',
        comment: { '@type': 'Comment', text: frage.erklaerung },
      },
      suggestedAnswer: frage.antworten
        .map((antwort, stelle) =>
          stelle === frage.richtigerIndex
            ? null
            : { '@type': 'Answer' as const, text: antwort }
        )
        .filter(Boolean),
    })),
  }
}

export interface HowToSchemaInput {
  name: string
  description: string
  path: string
  /** Die Bedienschritte in der Reihenfolge der Eingabefelder. */
  schritte: readonly string[]
}

/**
 * Ein Rechner als Handlungsanweisung.
 *
 * ## Warum zusätzlich zu `WebApplication`
 *
 * `WebApplication` sagt, **was** die Seite ist – ein Werkzeug, kostenlos, im
 * Browser. `HowTo` sagt, **wie** man es benutzt. Beides zusammen beschreibt
 * eine Rechnerseite vollständiger als eines von beidem.
 *
 * ## Was ein Schritt sein darf und was nicht
 *
 * Nur, was auf der Seite tatsächlich zu tun ist – die Eingabefelder in ihrer
 * Reihenfolge und das, was danach abzulesen ist. Keine Ratschläge („wähle
 * einen realistischen Zinssatz“), keine Werbung für andere Seiten. Eine
 * Anleitung, die etwas beschreibt, das der Leser auf der Seite nicht findet,
 * ist eine falsche Angabe über die Seite – und sie fällt niemandem auf, weil
 * strukturierte Daten unsichtbar sind.
 *
 * ## Was `HowTo` hier nicht bringt
 *
 * Eine eigene Darstellung in der Google-Suche: Die ist 2023 abgeschafft
 * worden. Die Auszeichnung bleibt trotzdem richtig und wird von anderen
 * Auswertern gelesen; sie ist nur kein Grund, Schritte zu erfinden, damit
 * etwas dasteht.
 */
export function howToSchema(input: HowToSchemaInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    inLanguage: 'de-DE',
    /*
      Kein `totalTime`. Wie lange jemand an einem Rechner sitzt, hängt daran,
      wie viele Zahlen er nachsieht – eine Minutenangabe wäre geraten.
    */
    tool: { '@type': 'HowToTool', name: 'Webbrowser' },
    supply: [],
    step: input.schritte.map((schritt, stelle) => ({
      '@type': 'HowToStep',
      position: stelle + 1,
      name: schritt.split(/[.:]/)[0],
      text: schritt,
      url: `${absoluteUrl(input.path)}#schritt-${stelle + 1}`,
    })),
  }
}
