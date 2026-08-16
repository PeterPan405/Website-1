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
      Rubriken, keine Einzeltitel.

      Bis August 2026 standen hier neun Kurse namentlich: DAX, S&P 500,
      Nasdaq 100, Gold, Bitcoin, Brent, Magnificent Seven, EUR/USD, MSCI World.
      Zwei Dinge stimmten daran nicht.

      Erstens war es eine Auswahl aus über tausend Kursen, die niemand
      begründen konnte – warum Brent und nicht Silber, warum der Nasdaq und
      nicht der Nikkei. Wer den Nikkei suchte, fand im Menü keinen Hinweis
      darauf, dass es ihn gibt.

      Zweitens beantwortet ein Menü die Frage „was gibt es hier?“, nicht „was
      ist heute wichtig?“. Neun Namen sagen: Das ist der Bestand. Sieben
      Rubriken sagen: Das sind die Gattungen, und in jeder stehen mehrere.

      Die Anker entsprechen den Überschriften auf `/maerkte` – wer eine Rubrik
      wählt, landet bei ihrer Liste und nicht auf einem einzelnen Kurs.
    */
    children: [
      {
        label: 'Aktienindizes',
        href: '/maerkte#indizes',
        hint: 'DAX, S&P 500, Nikkei und die übrigen Leitindizes',
      },
      {
        label: 'Einzelaktien',
        href: '/maerkte#aktien',
        hint: 'Werte aus Europa, Nordamerika und Asien',
      },
      {
        label: 'Branchen',
        href: '/maerkte/branchen',
        hint: 'Nach Geschäftsfeld sortiert statt nach Herkunft',
      },
      {
        label: 'ETFs',
        href: '/maerkte#etfs',
        hint: 'Indexfonds mit Kosten und Abbildung',
      },
      {
        label: 'Rohstoffe',
        href: '/maerkte#rohstoffe',
        hint: 'Edelmetalle, Energie und Agrarrohstoffe',
      },
      {
        label: 'Währungen',
        href: '/maerkte#waehrungen',
        hint: 'Euro-Referenzkurse der EZB',
      },
      {
        label: 'Krypto',
        href: '/maerkte#krypto',
        hint: 'Bitcoin, Ethereum und was daran anders ist',
      },
      {
        label: 'Anleihen',
        href: '/anleihen',
        hint: 'Warum der Kurs fällt, wenn der Zins steigt – mit Rechner',
      },
      {
        label: 'Dividenden',
        href: '/maerkte/dividenden',
        hint: 'Rendite, Historie und Ausschüttungstermine',
      },
      {
        label: 'Vergleich',
        href: '/maerkte/vergleich',
        hint: 'Zwei Titel nebeneinander, mit Kurve',
      },
      {
        label: '52 Wochen',
        href: '/maerkte/52-wochen',
        hint: 'Wo jeder Wert zwischen Jahrestief und Jahreshoch steht',
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
    Die Akademie steht zwischen Globus und Kalender – und nicht im Lernbereich.

    Beides sind Lehrinhalte, aber sie beantworten verschiedene Fragen. Der
    Lernbereich erklärt, was es gibt: Was ist eine Aktie, wie funktioniert ein
    ETF, was passiert bei einer Zinserhöhung. Die Akademie erklärt, wie man
    beurteilt, was man da vor sich hat – einen Chart lesen, eine Kennzahl
    einordnen. Das setzt den Lernbereich voraus und ist trotzdem ein anderes
    Handwerk.

    Unter „Lernen“ wäre daraus eine vierte Stufe hinter Beginner,
    Fortgeschritten und Profi geworden, und das stimmt nicht: Wer die
    technische Analyse verstehen will, muss den Lernbereich nicht abgeschlossen
    haben.
  */
  {
    label: 'Akademie',
    href: '/akademie',
    area: 'akademie',
    /*
      Das Menü führt die fünf Bereiche, nicht einzelne Lektionen.

      Solange es zwei Bereiche gab, standen hier vier ausgewählte Lektionen
      daneben. Bei fünf Bereichen und siebzig Lektionen ist jede solche Auswahl
      willkürlich – und sie veraltet, sobald eine Lektion umbenannt wird. Der
      Einstieg ist jetzt einheitlich der Bereich; die Lektionen stehen dort als
      Kacheln.
    */
    children: [
      {
        label: 'Technische Analyse',
        href: '/akademie/technische-analyse',
        hint: 'Trends, Unterstützungen, Indikatoren und Chartmuster',
      },
      {
        label: 'Fundamentalanalyse',
        href: '/akademie/fundamentalanalyse',
        hint: 'Bilanz, Cashflow und die Deutung von Kennzahlen',
      },
      {
        label: 'Portfoliotheorie',
        href: '/akademie/portfoliotheorie',
        hint: 'Streuung, Risikomaße und die Grenzen der Modelle',
      },
      {
        label: 'Makroanalyse',
        href: '/akademie/makroanalyse',
        hint: 'Konjunktur, Zinsen und was Marktdaten verraten',
      },
      {
        label: 'Anlegerverhalten',
        href: '/akademie/anlegerverhalten',
        hint: 'Die belegten Denkfehler – und was gegen sie hilft',
      },
    ],
    footerLink: { label: 'Alle Lektionen ansehen', href: '/akademie' },
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
      { label: 'Akademie', href: '/akademie' },
      { label: 'Glossar', href: '/glossar' },
      { label: 'Märkte', href: '/maerkte' },
      { label: 'Rechner', href: '/rechner' },
      { label: 'News', href: '/news' },
      { label: 'Podcast', href: '/podcast' },
      { label: 'Globus', href: '/globus' },
      { label: 'Kalender', href: '/kalender' },
      { label: 'Staatsverschuldung', href: '/staatsverschuldung' },
      { label: 'Anleihen', href: '/anleihen' },
    ],
  },
  {
    title: 'Plattform',
    links: [
      { label: 'Über uns', href: '/ueber-uns' },
      { label: 'Unsere Philosophie', href: '/unternehmensphilosophie' },
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
