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

/**
 * Die harte Grenze der Paketprüfung.
 *
 * `SEO_DESCRIPTION_RANGE.max` ist der redaktionelle Richtwert;
 * `scripts/paket-pruefen.ts` beanstandet ab 161 Zeichen. Für eine Beschreibung,
 * die aus Daten zusammengesetzt wird, zählt die zweite Zahl.
 */
export const BESCHREIBUNG_GRENZE = 160

/**
 * Eine Beschreibung aus Teilsätzen, die die Grenze nicht reißt.
 *
 * ## Wofür das da ist
 *
 * Für Seiten, deren Beschreibung einen **Namen aus den Daten** enthält – ein
 * Lernthema, ein Instrument, ein Land. Dort ist die Länge nicht bekannt, wenn
 * der Satz geschrieben wird: „Wie funktioniert der Markt“ ist vierzehn Zeichen
 * länger als „ETF“, und die fünf Themen mit den längsten Titeln rissen die
 * Grenze, während die übrigen neunundzwanzig durchgingen.
 *
 * Den Satz gerade so zu kürzen, dass er für die heutigen Titel passt, wäre
 * eine Wette auf den nächsten Titel. Stattdessen werden hier **Teile**
 * übergeben, in absteigender Wichtigkeit: Der erste steht immer, jeder weitere
 * nur, wenn er noch hineinpasst.
 *
 * @param teile Satzteile ohne Satzzeichen am Ende, wichtigster zuerst.
 * @param grenze Höchstlänge, voreingestellt die der Paketprüfung.
 */
export function beschreibungAusTeilen(
  teile: readonly string[],
  grenze: number = BESCHREIBUNG_GRENZE
): string {
  let satz = ''

  for (const teil of teile) {
    const kandidat = satz ? `${satz} ${teil}` : teil
    /*
      Der erste Teil kommt auch dann hinein, wenn er allein zu lang ist.

      Eine leere Beschreibung wäre schlechter als eine zu lange: Die zu lange
      wird abgeschnitten angezeigt, die leere gar nicht – und die Paketprüfung
      meldet beides, sodass es niemandem entgeht.
    */
    if (!satz || kandidat.length <= grenze) satz = kandidat
  }

  return satz
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

/**
 * Bereiche mit eigenem Vorschaubild, samt Bildbeschreibung.
 *
 * Zu jedem Eintrag gehört eine Datei `app/<bereich>/opengraph-image.tsx`. Die
 * beiden gehören zusammen und stehen leider an zwei Stellen – der Grund steht
 * bei `ogBildFuer`.
 */
const BEREICHSBILDER: Record<string, string> = {
  lernen: 'Lernen bei IM Invests – Finanzwissen in drei Stufen',
  maerkte: 'Märkte bei IM Invests – Kurse, Kennzahlen und Termine',
  rechner: 'Rechner bei IM Invests – nachrechnen statt schätzen',
  news: 'News bei IM Invests – die Meldung als Anlass, nicht als Inhalt',
  akademie: 'Akademie bei IM Invests – Verfahren statt Grundlagen',
  glossar: 'Glossar bei IM Invests – Begriffe in einem Satz',
  podcast: 'Der Podcast von IM Invests',
}

/**
 * Das Vorschaubild, das zu einem Pfad gehört.
 *
 * ## Warum das hier entschieden wird und nicht je Seite
 *
 * Next legt das Bild aus `app/<bereich>/opengraph-image.tsx` von selbst an alle
 * Seiten des Bereichs – aber nur, solange die Seite kein eigenes
 * `openGraph`-Objekt exportiert. Genau das tut hier jede Seite, weil
 * `buildMetadata` Titel und Beschreibung setzt; das Objekt ersetzt das der
 * Layouts vollständig, und das Bereichsbild fiele stillschweigend heraus.
 *
 * Die Zuordnung aus dem Pfad zu holen ist die einzige Fassung, die keine 1.400
 * Seitendateien anfasst und bei der niemand etwas vergessen kann: Wer eine
 * Seite unter `/maerkte/` anlegt, bekommt das Marktbild, ohne davon zu wissen.
 */
export function ogBildFuer(path: string) {
  const bereich = path.split('/').filter(Boolean)[0]
  const alt = bereich ? BEREICHSBILDER[bereich] : undefined
  if (!bereich || !alt) return OG_IMAGE
  return { url: `/${bereich}/opengraph-image`, width: 1200, height: 630, alt } as const
}

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
  const bild = ogBildFuer(path)

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
      // Unterseiten fehlen. Welches es ist, entscheidet `ogBildFuer`.
      images: [bild],
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
      images: [bild],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}
