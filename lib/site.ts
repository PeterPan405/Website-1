/**
 * Globale Site-Konfiguration.
 *
 * Alles, was mehr als eine Seite betrifft (Name, Basis-URL, Bereichsfarben),
 * steht hier – damit es genau eine Quelle der Wahrheit gibt.
 */

import { resolveSiteUrl } from '@/lib/resolve-site-url'

/**
 * Basis-URL der Website.
 *
 * Wird für canonical-URLs, Open Graph, sitemap.xml und robots.txt benötigt.
 * In Produktion über die Umgebungsvariable NEXT_PUBLIC_SITE_URL setzen
 * (siehe .env.example). Ist sie nicht gesetzt oder leer, greift der Fallback
 * mit der reservierten .example-TLD – damit niemals versehentlich eine fremde
 * Domain als canonical ausgegeben wird.
 *
 * Die Regeln stehen in `lib/resolve-site-url.ts`, weil sie dort ohne die
 * Datenschicht prüfbar sind.
 */
export const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)

export const siteConfig = {
  /**
   * Name des Unternehmens.
   *
   * Wird an jeder Stelle der Website aus dieser Konstante gelesen – auch in den
   * Meta-Titeln über `withBrand()` in `lib/seo.ts`. Eine Umbenennung betrifft
   * daher nur diese Zeile.
   */
  name: 'IM Invests',
  /** Kurzform für Titel-Suffixe. */
  shortName: 'IM Invests',
  locale: 'de-DE',
  language: 'de',
  slogan: 'Finanzen verstehen, Fehler vermeiden.',
  description:
    'IM Invests erklärt Geldanlage, Börse und Vorsorge in drei Lernstufen – mit Rechnern, Marktdaten und verständlichen Grundlagen.',
  contactEmail: 'info@iminvests.de',
  /**
   * Telefonnummer in lesbarer Schreibweise.
   *
   * Für `tel:`-Verweise nicht diese Fassung verwenden, sondern
   * {@link siteConfig.contactPhoneLink} – Leerzeichen gehören dort nicht hinein.
   */
  contactPhone: '+49 1523 3570545',
  /** Dieselbe Nummer nach E.164, für `tel:`-Verweise. */
  contactPhoneLink: '+4915233570545',
  /**
   * Profile der Marke auf anderen Plattformen.
   *
   * Werden in der Fußzeile verlinkt und zusätzlich als `sameAs` in die
   * strukturierten Daten geschrieben. Letzteres ist der eigentliche Zweck der
   * Zweitverwendung: Über `sameAs` erkennen Suchmaschinen, dass Website und
   * Profile zum selben Anbieter gehören.
   *
   * Die Adressen stehen bewusst ohne Parameter da. Geteilte Links tragen oft
   * Anhängsel wie `igsh=…` oder `utm_source=qr`, die aus einem QR-Code oder der
   * App stammen und eine einzelne Weitergabe nachverfolgen. In einer dauerhaften
   * Verlinkung haben sie nichts zu suchen.
   */
  socialLinks: [
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@IMInvests',
      icon: 'youtube',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/im_invests',
      icon: 'instagram',
    },
  ],
  /** Platzhalter-Handle für Twitter-Cards. */
  twitterHandle: '@iminvests',
  url: siteUrl,
} as const

/** Die fünf inhaltlichen Hauptbereiche der Website. */
export type AreaId =
  'news' | 'markets' | 'tools' | 'learn' | 'globe' | 'calendar' | 'debt'

export interface Area {
  id: AreaId
  label: string
  href: string
  /** Ein Satz, der den Bereich in Übersichten beschreibt. */
  description: string
}

/**
 * Anzahl der Lernthemen.
 *
 * Steht hier als Zahl und wird nicht aus `data/learn` abgeleitet: Die Kopfzeile
 * ist eine Client-Komponente und zieht `lib/site.ts` und `lib/navigation.ts`
 * mit ins Browser-Bundle. Ein Import der Lerndaten brächte den kompletten
 * Datensatz mit – für eine einzige Zahl.
 *
 * Damit die Zahl nicht still falsch wird, prüft `lib/learn.ts` beim Bauen, ob
 * sie zur tatsächlichen Themenzahl passt, und bricht sonst ab.
 */
export const LEARN_TOPIC_COUNT = 33

export const areas: Record<AreaId, Area> = {
  learn: {
    id: 'learn',
    label: 'Lernen',
    href: '/lernen',
    description: `${LEARN_TOPIC_COUNT} Finanzthemen in drei Stufen – von der ersten Definition bis zu Steuern, Kennzahlen und Sonderfällen.`,
  },
  globe: {
    id: 'globe',
    label: 'Globus',
    href: '/globus',
    description:
      'Ein drehbarer Globus: Wirtschaftsleistung, Einwohner, Wohlstand und Schulden je Land – und die Indizes und Aktien, die von dort kommen.',
  },
  calendar: {
    id: 'calendar',
    label: 'Kalender',
    href: '/kalender',
    description:
      'Zinsentscheide, Berichtssaison, Verfallstage und Börsenfeiertage – mit einem Satz dazu, was jeder Termin bedeutet.',
  },
  markets: {
    id: 'markets',
    label: 'Märkte',
    href: '/maerkte',
    description:
      'Wechselkurse und Indizes mit Verlaufscharts und einer Erklärung, was hinter jedem Kurs steckt.',
  },
  tools: {
    id: 'tools',
    label: 'Rechner',
    href: '/rechner',
    description:
      'Fünf Rechner für Zinsen, Inflation, Rente, Rentenlücke und Haushaltsbudget – jeweils mit offengelegter Methodik.',
  },
  news: {
    id: 'news',
    label: 'News',
    href: '/news',
    description:
      'Eingeordnete Nachrichten aus Wirtschaft und Finanzmärkten – mit Bezug zu den passenden Lernthemen.',
  },
  debt: {
    id: 'debt',
    label: 'Staatsverschuldung',
    href: '/staatsverschuldung',
    description:
      'Interaktiver Ländervergleich: Schulden absolut, pro Kopf und in Prozent des Bruttoinlandsprodukts.',
  },
}

/**
 * Feste Tailwind-Klassen pro Bereich.
 *
 * Wichtig: Die Klassennamen müssen als vollständige Literale im Quellcode
 * stehen, sonst findet der Tailwind-Scanner sie nicht. Deshalb ein
 * ausgeschriebenes Mapping statt zusammengesetzter Strings.
 */
export interface AreaStyle {
  /** Textfarbe der Bereichsfarbe. */
  text: string
  /** Flächige, gedeckte Hintergrundfarbe (für Chips und Badges). */
  soft: string
  /** Volle Bereichsfarbe als Hintergrund inkl. lesbarem Text. */
  solid: string
  /** Rahmenfarbe. */
  border: string
  /** Kleiner Farbpunkt, z. B. in Navigationslisten. */
  dot: string
  /** Dekorativer Verlauf für Hero- und Kachelflächen. */
  gradient: string
}

export const areaStyles: Record<AreaId, AreaStyle> = {
  learn: {
    text: 'text-learn',
    soft: 'bg-learn-soft text-learn',
    solid: 'bg-learn text-white',
    border: 'border-learn/30',
    dot: 'bg-learn',
    gradient: 'from-learn/18 to-learn/0',
  },
  markets: {
    text: 'text-markets',
    soft: 'bg-markets-soft text-markets',
    solid: 'bg-markets text-white',
    border: 'border-markets/30',
    dot: 'bg-markets',
    gradient: 'from-markets/18 to-markets/0',
  },
  tools: {
    text: 'text-tools',
    soft: 'bg-tools-soft text-tools',
    solid: 'bg-tools text-white',
    border: 'border-tools/30',
    dot: 'bg-tools',
    gradient: 'from-tools/18 to-tools/0',
  },
  news: {
    text: 'text-news',
    soft: 'bg-news-soft text-news',
    solid: 'bg-news text-white',
    border: 'border-news/30',
    dot: 'bg-news',
    gradient: 'from-news/18 to-news/0',
  },
  globe: {
    text: 'text-globe',
    soft: 'bg-globe-soft text-globe',
    solid: 'bg-globe text-white',
    border: 'border-globe/30',
    dot: 'bg-globe',
    gradient: 'from-globe/18 to-globe/0',
  },
  calendar: {
    text: 'text-calendar',
    soft: 'bg-calendar-soft text-calendar',
    solid: 'bg-calendar text-white',
    border: 'border-calendar/30',
    dot: 'bg-calendar',
    gradient: 'from-calendar/18 to-calendar/0',
  },
  debt: {
    text: 'text-debt',
    soft: 'bg-debt-soft text-debt',
    solid: 'bg-debt text-white',
    border: 'border-debt/30',
    dot: 'bg-debt',
    gradient: 'from-debt/18 to-debt/0',
  },
}

/**
 * Baut aus einem Pfad eine absolute URL auf Basis von {@link siteUrl}.
 *
 * Der abschließende Schrägstrich ist Absicht und muss bleiben: Das Projekt wird
 * mit `trailingSlash: true` exportiert, weshalb die kanonische Adresse jeder
 * Seite auf „/“ endet. Ohne den Schrägstrich würden Sitemap und strukturierte
 * Daten eine zweite Schreibweise derselben Seite nennen – Suchmaschinen sehen
 * darin eine Weiterleitung und einen Widerspruch zum Canonical der Seite.
 *
 * Dateien bleiben unangetastet: `/logo.svg` bekommt keinen Schrägstrich.
 */
export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`
  const isFile = /\.[a-z0-9]+$/i.test(withLeadingSlash)
  const normalized =
    isFile || withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
  return `${siteUrl}${normalized}`
}
