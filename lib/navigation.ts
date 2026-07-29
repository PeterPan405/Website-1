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
    /*
      Nach Bedeutung sortiert, nicht nach Gattung.

      Vorher standen die drei Währungspaare vorn – beim Aufklappen war also
      EUR/CNY das Zweite, was jemand sah, und der DAX kam an vierter Stelle.
      Das Menü zeigt einen Ausschnitt; welcher das ist, entscheidet, wofür die
      Rubrik gehalten wird.
    */
    children: [
      { label: 'DAX', href: '/maerkte/dax', hint: '40 große deutsche Unternehmen' },
      { label: 'S&P 500', href: '/maerkte/sp500', hint: '500 US-Unternehmen' },
      { label: 'Nasdaq 100', href: '/maerkte/nasdaq-100', hint: 'US-Technologiewerte' },
      { label: 'Gold', href: '/maerkte/gold', hint: 'Feinunze in US-Dollar' },
      { label: 'Bitcoin', href: '/maerkte/bitcoin', hint: 'Kryptowährung in US-Dollar' },
      { label: 'Brent', href: '/maerkte/brent', hint: 'Rohöl je Fass' },
      {
        label: 'Magnificent Seven',
        href: '/maerkte#magnificent-seven',
        hint: 'Die sieben schwersten Werte im S&P 500',
      },
      { label: 'EUR/USD', href: '/maerkte/eur-usd', hint: 'Euro zu US-Dollar' },
      {
        label: 'MSCI World',
        href: '/maerkte/msci-world',
        hint: 'Industrieländer weltweit',
      },
    ],
    footerLink: { label: 'Alle Kurse ansehen', href: '/maerkte' },
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
      {
        label: 'Kostenrechner',
        href: '/rechner/kostenrechner',
        hint: 'Was eine Gebühr über 30 Jahre kostet',
      },
      {
        label: 'Steuerrechner',
        href: '/rechner/steuerrechner',
        hint: 'Kapitalerträge und Vorabpauschale',
      },
      {
        label: 'Vermögensübersicht',
        href: '/rechner/vermoegensuebersicht',
        hint: 'Bogen zum Ausfüllen und Abheften',
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
        label: 'Lernpfade',
        href: '/lernen/pfade',
        hint: 'Geführte Wege für einen bestimmten Anlass',
      },
      {
        label: 'Glossar',
        href: '/glossar',
        hint: 'Fachbegriffe, in je einem Satz erklärt',
      },
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
  {
    label: 'Globus',
    href: '/globus',
    area: 'globe',
    /*
      Die Staatsverschuldung steht hier drin und nicht mehr daneben.

      Sie ist eine von mehreren Länderkennzahlen, und der Globus zeigt sie
      bereits – als eigener Hauptpunkt daneben wirkte sie wie ein eigenes
      Themengebiet. Die ausführliche Vergleichsseite bleibt vollständig
      erhalten und ist von hier aus erreichbar.
    */
    children: [
      {
        label: 'Wirtschaftsleistung',
        href: '/globus',
        hint: 'BIP, Einwohner und BIP pro Kopf für über 180 Länder',
      },
      {
        label: 'Staatsverschuldung',
        href: '/staatsverschuldung',
        hint: 'Schulden absolut, pro Kopf und in Prozent des BIP',
      },
      {
        label: 'Kurse nach Herkunft',
        href: '/globus',
        hint: 'Welche Indizes und Aktien aus welchem Land kommen',
      },
      {
        label: 'Alle Länder als Tabelle',
        href: '/globus#tabelle',
        hint: 'Dieselben Zahlen zum Nachlesen und Vergleichen',
      },
    ],
    footerLink: { label: 'Globus öffnen', href: '/globus' },
  },
  /*
    An der Stelle, an der vorher die Staatsverschuldung stand.

    Der Kalender beantwortet die Frage, die nach „was gibt es“ und „wo“ kommt:
    wann. Er ist bewusst kein Untermenü des Globus – die Termine gehören zu den
    Märkten, nicht zu den Ländern.
  */
  {
    label: 'Kalender',
    href: '/kalender',
    area: 'calendar',
  },
]

/** Rechtliche und redaktionelle Seiten für die Fußzeile. */
export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: 'Inhalte',
    links: [
      { label: 'Lernbereich', href: '/lernen' },
      { label: 'Lernpfade', href: '/lernen/pfade' },
      { label: 'Glossar', href: '/glossar' },
      { label: 'Märkte', href: '/maerkte' },
      { label: 'Rechner', href: '/rechner' },
      { label: 'News', href: '/news' },
      { label: 'Globus', href: '/globus' },
      { label: 'Kalender', href: '/kalender' },
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
