import { LEARN_TOPIC_COUNT, type AreaId } from '@/lib/site'

/**
 * Navigationsbaum für Kopf- und Fußzeile.
 *
 * Bewusst handgeschrieben und frei von Importen aus `data/`: Der Header ist
 * eine Client-Komponente, und ein Import der Kurs- oder Lerndaten würde diese
 * kompletten Datensätze mit ins Browser-Bundle ziehen.
 */

export interface NavLink {
  label: string
  href: string
  /** Kurzbeschreibung für das Mega-Menü. */
  hint?: string
}

export interface NavItem {
  label: string
  href: string
  area: AreaId
  /** Ohne Kinder wird der Eintrag als einfacher Link gerendert. */
  children?: NavLink[]
  /** Zusatzzeile am Fuß des Dropdowns. */
  footerLink?: NavLink
}

export const mainNav: NavItem[] = [
  { label: 'News', href: '/news', area: 'news' },
  {
    label: 'Märkte',
    href: '/maerkte',
    area: 'markets',
    children: [
      { label: 'EUR/USD', href: '/maerkte/eur-usd', hint: 'Euro zu US-Dollar' },
      { label: 'EUR/CNY', href: '/maerkte/eur-cny', hint: 'Euro zu Renminbi' },
      { label: 'EUR/CHF', href: '/maerkte/eur-chf', hint: 'Euro zu Schweizer Franken' },
      { label: 'DAX', href: '/maerkte/dax', hint: '40 große deutsche Unternehmen' },
      { label: 'S&P 500', href: '/maerkte/sp500', hint: '500 US-Unternehmen' },
      {
        label: 'MSCI World',
        href: '/maerkte/msci-world',
        hint: 'Industrieländer weltweit',
      },
      { label: 'Gold', href: '/maerkte/gold', hint: 'Feinunze in US-Dollar' },
      { label: 'Silber', href: '/maerkte/silber', hint: 'Feinunze in US-Dollar' },
    ],
    footerLink: { label: 'Alle Kurse und Indizes', href: '/maerkte' },
  },
  {
    label: 'Rechner',
    href: '/rechner',
    area: 'tools',
    children: [
      {
        label: 'Zinsrechner',
        href: '/rechner/zinsrechner',
        hint: 'Zinseszins mit Sparplan',
      },
      {
        label: 'Inflationsrechner',
        href: '/rechner/inflationsrechner',
        hint: 'Kaufkraft über die Jahre',
      },
      {
        label: 'Rentenrechner',
        href: '/rechner/rentenrechner',
        hint: 'Alterseinkommen abschätzen',
      },
      {
        label: 'Rentenlücke',
        href: '/rechner/rentenluecke',
        hint: 'Bedarf gegen Erwartung',
      },
      {
        label: 'Haushaltsrechner',
        href: '/rechner/haushaltsrechner',
        hint: 'Budget und Sparquote',
      },
    ],
    footerLink: { label: 'Alle Rechner im Überblick', href: '/rechner' },
  },
  {
    label: 'Lernen',
    href: '/lernen',
    area: 'learn',
    children: [
      {
        label: 'Aktie',
        href: '/lernen/aktie',
        hint: 'Anteil am Unternehmen – vollständig ausgearbeitet',
      },
      {
        label: 'Zinseszins',
        href: '/lernen/zinseszins',
        hint: 'Das 8. Weltwunder – vollständig ausgearbeitet',
      },
      {
        label: 'Rohstoffe',
        href: '/lernen/rohstoffe',
        hint: 'Gold und Silber – vollständig ausgearbeitet',
      },
      { label: 'ETF', href: '/lernen/etf', hint: 'Indexfonds als Basisbaustein' },
      { label: 'Börse', href: '/lernen/boerse', hint: 'Wo Kurse entstehen' },
      {
        label: 'Cost-Average & Sparplan',
        href: '/lernen/cost-average-sparplan',
        hint: 'Regelmäßig investieren',
      },
      {
        label: 'Einlagensicherung',
        href: '/lernen/einlagensicherung',
        hint: 'Was beim Bankguthaben geschützt ist',
      },
    ],
    footerLink: { label: `Alle ${LEARN_TOPIC_COUNT} Themen ansehen`, href: '/lernen' },
  },
  { label: 'Staatsverschuldung', href: '/staatsverschuldung', area: 'debt' },
]

/** Rechtliche und redaktionelle Seiten für die Fußzeile. */
export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Inhalte',
    links: [
      { label: 'Lernbereich', href: '/lernen' },
      { label: 'Märkte', href: '/maerkte' },
      { label: 'Rechner', href: '/rechner' },
      { label: 'News', href: '/news' },
      { label: 'Staatsverschuldung', href: '/staatsverschuldung' },
    ],
  },
  {
    title: 'Plattform',
    links: [
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Unternehmensphilosophie', href: '/unternehmensphilosophie' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
  },
  /*
    Ohne eine Spalte „Rechtliches“: Impressum und Datenschutz stehen bereits in
    der Zeile unter der Fußzeile, direkt neben dem Urheberrechtsvermerk. Dort
    sucht man sie, und dort ist auch die vorgeschriebene leichte Erreichbarkeit
    gegeben. Beide Verweise ein zweites Mal darüber zu wiederholen, hätte die
    Fußzeile nur verlängert.
  */
]
