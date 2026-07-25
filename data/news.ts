import type { ContentBlock } from '@/data/content'

/**
 * Demo-Nachrichten.
 *
 * WICHTIG: Alle Artikel in dieser Datei sind erfundene Beispieltexte. Sie
 * dienen ausschließlich dazu, Layout, Verlinkung und strukturierte Daten zu
 * demonstrieren. Jede Artikelseite gibt diesen Hinweis auch sichtbar aus
 * (siehe `isDemo`), damit niemand die Inhalte für echte Meldungen hält.
 *
 * Beim Anbinden einer echten News-API muss nur `lib/news.ts` angepasst werden.
 */

export type NewsCategory =
  'Geldpolitik' | 'Märkte' | 'Vorsorge' | 'Steuern & Recht' | 'Geldanlage'

export interface NewsArticle {
  slug: string
  /** Redaktionelle Überschrift – wird als <h1> verwendet. */
  title: string
  /**
   * Kürzerer Titel für das <title>-Tag.
   *
   * Nur nötig, wenn die redaktionelle Überschrift über etwa 60 Zeichen liegt und
   * in Suchergebnissen abgeschnitten würde. Ohne Angabe wird `title` verwendet.
   */
  metaTitle?: string
  /** Kurzfassung für Übersicht, Karussell und Meta-Description. */
  teaser: string
  category: NewsCategory
  /** ISO-8601 mit Zeitzone. */
  publishedAt: string
  updatedAt?: string
  author: string
  readingMinutes: number
  tags: string[]
  /** Slugs verwandter Lernthemen. */
  relatedTopics: string[]
  /** Symbole verwandter Kurse aus `data/markets.ts`. */
  relatedSymbols: string[]
  body: ContentBlock[]
  /** Immer `true`, solange Beispieldaten ausgeliefert werden. */
  isDemo: true
}

export const newsArticles: NewsArticle[] = [
  {
    slug: 'ezb-haelt-leitzins-stabil',
    title: 'EZB hält den Leitzins stabil – was das für Sparer bedeutet',
    teaser:
      'Die Notenbank belässt den Einlagenzins unverändert. Für Tagesgeld heißt das: Die Zinsgipfel sind vorbei, der Realzins bleibt knapp positiv.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-24T09:15:00+02:00',
    author: 'Redaktion Finanzkompass',
    readingMinutes: 4,
    tags: ['EZB', 'Leitzins', 'Tagesgeld', 'Realzins'],
    relatedTopics: ['tagesgeld', 'zinseszins', 'einlagensicherung'],
    relatedSymbols: ['eur-usd'],
    isDemo: true,
    body: [
      {
        type: 'paragraph',
        text: 'Die Europäische Zentralbank lässt ihren Einlagenzins unverändert. Damit bleibt der Zinssatz, den Geschäftsbanken für über Nacht bei der Notenbank geparktes Geld erhalten, auf dem Niveau der vergangenen Monate. Für Privatanleger ist dieser Satz die entscheidende Größe: Er bestimmt, was Banken sich beim Tagesgeld leisten können.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum der Einlagenzins über dein Tagesgeld entscheidet',
      },
      {
        type: 'paragraph',
        text: 'Eine Bank hat immer zwei Möglichkeiten, überschüssiges Geld unterzubringen: bei der Notenbank oder in Form von Krediten. Zahlt die Notenbank risikolos einen bestimmten Satz, wird keine Bank dir dauerhaft deutlich mehr bieten – sie müsste den Aufschlag aus eigener Marge bezahlen. Umgekehrt liegen Angebote deutlich unter diesem Satz, wenn eine Bank keine neuen Einlagen braucht.',
      },
      {
        type: 'paragraph',
        text: 'Genau deshalb bewegen sich Tagesgeldangebote mit einiger Verzögerung im Gleichschritt mit den Notenbankzinsen. **Die Verzögerung läuft asymmetrisch:** Sinkende Notenbankzinsen geben Banken meist schnell weiter, steigende deutlich langsamer.',
      },
      { type: 'heading', level: 2, text: 'Nominal ist nicht real' },
      {
        type: 'paragraph',
        text: 'Entscheidend ist nicht der Zins auf dem Kontoauszug, sondern was davon nach Inflation übrig bleibt. Liegt das Tagesgeld bei 2,0 Prozent und die Inflation bei 1,8 Prozent, beträgt der Realzins rund 0,2 Prozent – vor Steuern. Nach Abzug der Abgeltungssteuer kann daraus ein Minus werden.',
      },
      {
        type: 'formula',
        expression: 'Realzins ≈ Nominalzins − Inflationsrate',
        description:
          'Eine brauchbare Näherung für kleine Werte. Exakt gilt: (1 + Nominalzins) / (1 + Inflationsrate) − 1.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Was daraus folgt',
        items: [
          'Tagesgeld ist das richtige Werkzeug für den Notgroschen und für Geld, das in den nächsten zwei bis drei Jahren gebraucht wird – nicht für den langfristigen Vermögensaufbau.',
          'Wer den Sparerpauschbetrag noch nicht ausgeschöpft hat, kassiert die Zinsen bis zur Freibetragsgrenze steuerfrei. Ein Freistellungsauftrag bei der Bank genügt.',
        ],
      },
      { type: 'heading', level: 2, text: 'Der Blick auf den Wechselkurs' },
      {
        type: 'paragraph',
        text: 'Zinsentscheidungen wirken auch auf den Außenwert des Euro. Bleiben die Zinsen in Europa stabil, während sie in den USA fallen, wird der Euro für internationale Anleger relativ attraktiver. Für alle mit US-Aktien im Depot ist das eine gemischte Nachricht: Ein stärkerer Euro drückt die in Euro gerechnete Rendite von Dollar-Anlagen.',
      },
    ],
  },
  {
    slug: 'inflation-sinkt-auf-1-8-prozent',
    title: 'Inflation sinkt auf 1,8 Prozent – Kaufkraft erholt sich langsam',
    metaTitle: 'Inflation bei 1,8 Prozent: was das für Sparer heißt',
    teaser:
      'Die Teuerung liegt erstmals seit Monaten unter der Zwei-Prozent-Marke. Der Rückstand aus den Hochinflationsjahren bleibt jedoch bestehen.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-23T11:40:00+02:00',
    author: 'Redaktion Finanzkompass',
    readingMinutes: 4,
    tags: ['Inflation', 'Kaufkraft', 'Verbraucherpreise'],
    relatedTopics: ['zinseszins', 'tagesgeld', 'immobilien'],
    relatedSymbols: [],
    isDemo: true,
    body: [
      {
        type: 'paragraph',
        text: 'Die Verbraucherpreise sind im Vorjahresvergleich um 1,8 Prozent gestiegen. Die Inflationsrate liegt damit wieder unter dem Zielwert von zwei Prozent, den die Europäische Zentralbank als Definition stabiler Preise verwendet.',
      },
      { type: 'heading', level: 2, text: 'Sinkende Rate heißt nicht sinkende Preise' },
      {
        type: 'paragraph',
        text: 'Ein häufiges Missverständnis: Eine fallende Inflationsrate bedeutet nicht, dass Dinge billiger werden. Sie bedeutet nur, dass die Preise **langsamer weiter steigen**. Fallende Preise auf breiter Front hießen Deflation – und die gilt als gefährlicher als moderate Inflation, weil Konsum und Investitionen aufgeschoben werden.',
      },
      {
        type: 'paragraph',
        text: 'Der Preisniveau-Sprung der Hochinflationsjahre bleibt damit im System. Wer 2021 einen Warenkorb für 100 Euro kaufen konnte, zahlt dafür heute deutlich mehr – und dieser Aufschlag verschwindet nicht wieder.',
      },
      { type: 'heading', level: 2, text: 'Was 1,8 Prozent über 20 Jahre anrichten' },
      {
        type: 'table',
        caption: 'Kaufkraft von heute 10.000 Euro bei dauerhaft 1,8 Prozent Inflation',
        head: ['Zeitraum', 'Kaufkraft in heutigen Euro', 'Verlust'],
        rows: [
          ['nach 10 Jahren', '8.365 €', '−16,4 %'],
          ['nach 20 Jahren', '6.997 €', '−30,0 %'],
          ['nach 30 Jahren', '5.853 €', '−41,5 %'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Auch eine „harmlose“ Inflationsrate summiert sich über Jahrzehnte erheblich – der gleiche Zinseszins-Mechanismus, der beim Sparen für dich arbeitet, arbeitet hier gegen dich.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Selbst nachrechnen',
        items: [
          'Mit dem Inflationsrechner lässt sich für beliebige Beträge und Zeiträume ermitteln, was von einer Summe real übrig bleibt.',
        ],
      },
    ],
  },
  {
    slug: 'dax-erreicht-neues-jahreshoch',
    title: 'DAX auf Jahreshoch: Warum Höchststände kein Verkaufssignal sind',
    metaTitle: 'DAX auf Jahreshoch: Warum das kein Verkaufssignal ist',
    teaser:
      'Der deutsche Leitindex notiert am oberen Rand seiner Jahresspanne. Historisch folgen auf Höchststände nicht überdurchschnittlich viele Rückschläge.',
    category: 'Märkte',
    publishedAt: '2026-07-22T17:55:00+02:00',
    author: 'Redaktion Finanzkompass',
    readingMinutes: 5,
    tags: ['DAX', 'Aktienmarkt', 'Market-Timing'],
    relatedTopics: ['aktie', 'wann-kaufen-verkaufen', 'groesste-crashes'],
    relatedSymbols: ['dax', 'euro-stoxx-50'],
    isDemo: true,
    body: [
      {
        type: 'paragraph',
        text: 'Der DAX hat ein neues Jahreshoch erreicht. Für viele Anlegerinnen und Anleger löst das einen Reflex aus: Jetzt ist es zu teuer, jetzt wartet man besser auf den Rücksetzer. Historische Daten stützen diesen Reflex nicht.',
      },
      { type: 'heading', level: 2, text: 'Höchststände sind der Normalzustand' },
      {
        type: 'paragraph',
        text: 'Ein Index, der langfristig steigt, verbringt zwangsläufig viel Zeit in der Nähe seines Höchststands. Anders wäre ein Aufwärtstrend gar nicht möglich. Ein neues Hoch ist deshalb keine Anomalie, sondern das erwartbare Ergebnis eines funktionierenden Kapitalmarkts.',
      },
      {
        type: 'paragraph',
        text: 'Wer auf Rücksetzer wartet, tauscht ein bekanntes Risiko gegen ein unbekanntes: Statt Kursschwankungen trägt er das Risiko, die Aufwärtsbewegung zu verpassen. **Beides ist ein Risiko** – nur fällt das zweite weniger auf, weil es sich nicht im Depotauszug zeigt.',
      },
      { type: 'heading', level: 2, text: 'Der teure Teil des Wartens' },
      {
        type: 'paragraph',
        text: 'Die Rendite eines Jahrzehnts hängt an überraschend wenigen Handelstagen. Wer die stärksten Tage verpasst, weil er in Bargeld wartete, holt den Rückstand kaum wieder auf. Und diese Tage liegen meist unmittelbar neben den schlechtesten – also genau in Phasen, in denen kaum jemand einsteigen möchte.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was daraus nicht folgt',
        items: [
          'Das ist kein Argument dafür, jederzeit den maximal möglichen Betrag zu investieren. Es ist ein Argument gegen den Versuch, den Einstiegszeitpunkt zu erraten.',
          'Wer Geld in weniger als fünf Jahren braucht, gehört mit diesem Geld nicht in den Aktienmarkt – unabhängig vom Indexstand.',
        ],
      },
      { type: 'heading', level: 2, text: 'Ein Hinweis zum DAX selbst' },
      {
        type: 'paragraph',
        text: 'Beim Vergleich mit anderen Indizes lohnt ein Blick auf die Berechnungsart. Der DAX ist ein Performance-Index: Dividenden werden rechnerisch wieder angelegt. Der S&P 500 wird üblicherweise als Kursindex dargestellt. Prozentzahlen der beiden direkt zu vergleichen, bevorteilt den DAX systematisch.',
      },
    ],
  },
  {
    slug: 'etf-sparplaene-erreichen-rekordzahl',
    title: 'ETF-Sparpläne erreichen Rekordzahl – der Durchschnitt liegt bei 210 Euro',
    metaTitle: 'ETF-Sparpläne auf Rekordniveau: 210 Euro im Schnitt',
    teaser:
      'Immer mehr Menschen investieren automatisiert monatlich. Der Erfolg hängt weniger am Betrag als an der Frage, ob der Plan Krisen übersteht.',
    category: 'Geldanlage',
    publishedAt: '2026-07-21T08:30:00+02:00',
    author: 'Redaktion Finanzkompass',
    readingMinutes: 4,
    tags: ['ETF', 'Sparplan', 'Cost-Average'],
    relatedTopics: ['etf', 'cost-average-sparplan', 'fonds'],
    relatedSymbols: ['msci-world', 'sp500'],
    isDemo: true,
    body: [
      {
        type: 'paragraph',
        text: 'Die Zahl laufender ETF-Sparpläne hat einen neuen Höchststand erreicht. Der durchschnittliche monatliche Betrag liegt bei rund 210 Euro. Der eigentlich interessante Wert steht in keiner Statistik: wie viele dieser Pläne den nächsten größeren Kursrückgang überleben.',
      },
      { type: 'heading', level: 2, text: 'Was ein Sparplan wirklich leistet' },
      {
        type: 'paragraph',
        text: 'Ein Sparplan kauft zu festen Terminen für einen festen Betrag. Bei hohen Kursen bekommst du weniger Anteile, bei niedrigen mehr. Daraus entsteht der Cost-Average-Effekt: Der Durchschnittspreis deiner Anteile liegt unter dem Durchschnitt der Kurse.',
      },
      {
        type: 'paragraph',
        text: 'Der wichtigere Effekt ist jedoch psychologisch. Ein automatisierter Sparplan nimmt die Entscheidung „ist jetzt ein guter Zeitpunkt?“ aus dem Prozess heraus – und damit die Entscheidung, an der die meisten Anlagestrategien scheitern.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Häufiges Missverständnis',
        items: [
          'Der Cost-Average-Effekt ist keine Renditegarantie. Bei einem langfristig steigenden Markt fährt eine Einmalanlage im Durchschnitt besser, weil das Geld länger investiert ist.',
          'Der Sparplan gewinnt dort, wo es zählt: Er ist durchhaltbar, wenn man keine große Summe hat – und er verhindert, dass man auf den „richtigen Moment“ wartet.',
        ],
      },
      { type: 'heading', level: 2, text: 'Drei Dinge, die den Betrag schlagen' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Durchhalten.** Ein Plan über 100 Euro, der 20 Jahre läuft, schlägt einen über 400 Euro, der nach zwei Jahren im ersten Crash gestoppt wird.',
          '**Kosten prüfen.** Laufende Fondskosten und Ausführungsgebühren wirken jedes Jahr auf das gesamte Vermögen, nicht nur auf die neue Rate.',
          '**Notgroschen zuerst.** Ohne Puffer auf dem Tagesgeldkonto wird der Sparplan zur Notreserve – und muss ausgerechnet dann verkauft werden, wenn die Kurse unten sind.',
        ],
      },
    ],
  },
  {
    slug: 'rentenluecke-jede-zweite-unterschaetzt',
    title: 'Rentenlücke: Jede zweite Person unterschätzt den eigenen Bedarf',
    metaTitle: 'Rentenlücke: Warum der eigene Bedarf unterschätzt wird',
    teaser:
      'Die gesetzliche Rente ersetzt nur einen Teil des letzten Nettoeinkommens. Wer die Lücke nicht kennt, kann sie nicht schließen.',
    category: 'Vorsorge',
    publishedAt: '2026-07-20T07:00:00+02:00',
    updatedAt: '2026-07-22T10:20:00+02:00',
    author: 'Redaktion Finanzkompass',
    readingMinutes: 5,
    tags: ['Rente', 'Rentenlücke', 'Altersvorsorge'],
    relatedTopics: ['rente', 'zinseszins', 'cost-average-sparplan'],
    relatedSymbols: [],
    isDemo: true,
    body: [
      {
        type: 'paragraph',
        text: 'Die gesetzliche Rente ist als Basisversorgung angelegt, nicht als vollständiger Ersatz des Arbeitseinkommens. Zwischen dem letzten Nettoeinkommen und der späteren Rente bleibt eine Differenz – die Rentenlücke.',
      },
      { type: 'heading', level: 2, text: 'Warum die Renteninformation täuscht' },
      {
        type: 'paragraph',
        text: 'Der Betrag auf der jährlichen Renteninformation ist ein Bruttowert von heute. Drei Dinge kommen noch dazu: Auf die Rente fallen Beiträge zur Kranken- und Pflegeversicherung an, Renten sind zu einem steigenden Anteil steuerpflichtig, und die Inflation entwertet den Betrag bis zum Rentenbeginn.',
      },
      {
        type: 'paragraph',
        text: '**Aus 1.600 Euro brutto können so real 1.100 Euro werden** – und mit diesem Wert muss der Bedarf verglichen werden, nicht mit dem Bruttobetrag.',
      },
      { type: 'heading', level: 2, text: 'So schätzt du deinen Bedarf' },
      {
        type: 'list',
        items: [
          'Wohnen: Miete oder – bei abbezahlter Immobilie – Instandhaltung, Grundsteuer und Nebenkosten.',
          'Laufende Lebenshaltung: Häufig etwas niedriger als im Erwerbsleben, weil Berufskosten wegfallen.',
          'Gesundheit: Steigt mit dem Alter, oft unterschätzt.',
          'Einmalige Posten: Auto, Renovierung, Reisen – nicht monatlich, aber sie summieren sich.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Faustregel mit Vorsicht',
        items: [
          'Verbreitet ist die Annahme, im Alter würden rund 80 Prozent des letzten Nettoeinkommens gebraucht. Das ist ein Ausgangspunkt für die erste Abschätzung, kein Ergebnis – wer zur Miete wohnt, liegt oft deutlich darüber.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die Lücke wird nicht kleiner, wenn man wartet',
      },
      {
        type: 'paragraph',
        text: 'Jedes Jahr, das früher begonnen wird, senkt die nötige monatliche Sparrate überproportional – weil die Erträge selbst wieder Erträge erzielen. Wer mit 30 statt mit 40 beginnt, braucht für dasselbe Endvermögen deutlich weniger als die Hälfte der Rate.',
      },
    ],
  },
  {
    slug: 'sparerpauschbetrag-freistellungsauftraege-pruefen',
    title: 'Sparerpauschbetrag: Warum du deine Freistellungsaufträge prüfen solltest',
    metaTitle: 'Sparerpauschbetrag: Freistellungsaufträge richtig verteilen',
    teaser:
      'Der Freibetrag für Kapitalerträge verfällt jedes Jahr neu. Wer ihn falsch verteilt, zahlt Steuern, die er zurückfordern müsste.',
    category: 'Steuern & Recht',
    publishedAt: '2026-07-19T09:00:00+02:00',
    author: 'Redaktion Finanzkompass',
    readingMinutes: 4,
    tags: ['Sparerpauschbetrag', 'Abgeltungssteuer', 'Freistellungsauftrag'],
    relatedTopics: ['sparerpauschbetrag', 'tagesgeld', 'etf'],
    relatedSymbols: [],
    isDemo: true,
    body: [
      {
        type: 'paragraph',
        text: 'Kapitalerträge – Zinsen, Dividenden, realisierte Kursgewinne – sind in Deutschland bis zum Sparerpauschbetrag steuerfrei. Darüber greift die Abgeltungssteuer zuzüglich Solidaritätszuschlag und gegebenenfalls Kirchensteuer.',
      },
      { type: 'heading', level: 2, text: 'Der Freibetrag wirkt nicht automatisch' },
      {
        type: 'paragraph',
        text: 'Banken und Broker führen die Steuer direkt ab, wenn kein Freistellungsauftrag vorliegt. Der Freibetrag ist ein Jahresbetrag: Nicht genutzte Teile verfallen zum Jahresende und lassen sich nicht ins nächste Jahr übertragen.',
      },
      { type: 'heading', level: 2, text: 'Der typische Fehler bei mehreren Banken' },
      {
        type: 'paragraph',
        text: 'Der Betrag darf auf mehrere Institute verteilt werden, insgesamt aber nur einmal ausgeschöpft. Problematisch ist die Aufteilung nach Gefühl: Liegt der Auftrag überwiegend bei der Bank, die kaum Erträge abwirft, führt der Broker mit den Dividenden Steuern ab, obwohl Freibetrag ungenutzt bleibt.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Praktisches Vorgehen',
        items: [
          'Einmal jährlich prüfen, wo die Erträge tatsächlich anfallen, und die Aufträge entsprechend umverteilen. Änderungen sind bei den Banken in wenigen Minuten erledigt.',
          'Zu viel gezahlte Steuer ist nicht verloren: Über die Anlage KAP der Steuererklärung lässt sie sich zurückholen. Der Freistellungsauftrag erspart nur den Umweg.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Kein Steuerrat',
        items: [
          'Freibeträge, Steuersätze und Regeln ändern sich. Aktuelle Beträge gehören vor jeder Entscheidung geprüft, bei komplexeren Fällen mit steuerlicher Beratung.',
        ],
      },
    ],
  },
  {
    slug: 'anleiherenditen-ziehen-an',
    title: 'Anleiherenditen ziehen an – warum Kurs und Rendite gegenläufig sind',
    metaTitle: 'Anleihen: warum Kurs und Rendite gegenläufig laufen',
    teaser:
      'Steigende Renditen bedeuten fallende Anleihekurse. Wer den Zusammenhang kennt, versteht Verluste in vermeintlich sicheren Fonds.',
    category: 'Märkte',
    publishedAt: '2026-07-18T14:10:00+02:00',
    author: 'Redaktion Finanzkompass',
    readingMinutes: 5,
    tags: ['Anleihen', 'Rendite', 'Zinsänderungsrisiko'],
    relatedTopics: ['staatsanleihe', 'schuldverschreibung', 'fonds'],
    relatedSymbols: ['eur-gbp'],
    isDemo: true,
    body: [
      {
        type: 'paragraph',
        text: 'Die Renditen langlaufender Staatsanleihen sind gestiegen. Für Anleger mit Anleihefonds im Depot ist das zunächst eine schlechte Nachricht – obwohl „höhere Rendite“ gut klingt.',
      },
      { type: 'heading', level: 2, text: 'Die Wippe zwischen Kurs und Rendite' },
      {
        type: 'paragraph',
        text: 'Eine Anleihe zahlt einen bei Ausgabe festgelegten Zins auf ihren Nennwert. Dieser Zins ändert sich nie. Ändert sich das Zinsniveau am Markt, kann sich nur der Preis anpassen: Neue Anleihen bieten 3,5 Prozent, deine alte nur 2,0 Prozent – niemand zahlt dann noch den vollen Preis für deine. **Der Kurs fällt so weit, bis die Restlaufzeit-Rendite wieder marktgerecht ist.**',
      },
      {
        type: 'formula',
        expression: 'Kursänderung ≈ −Duration × Zinsänderung',
        description:
          'Die Duration misst in Jahren, wie zinsempfindlich eine Anleihe ist. Bei einer Duration von 8 Jahren kostet ein Zinsanstieg um 1 Prozentpunkt rund 8 Prozent Kurswert.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Einzelanleihe und Anleihefonds sind nicht dasselbe',
      },
      {
        type: 'paragraph',
        text: 'Wer eine einzelne Anleihe bis zur Fälligkeit hält, bekommt den Nennwert zurück – Kursschwankungen dazwischen sind dann nur Buchwerte. Ein Anleihefonds hat keine Fälligkeit: Er verkauft laufend und kauft neu nach. Der Kursverlust wird dort realisiert, dafür steigen die Erträge in den Folgejahren.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum das 2022 so weh tat',
        items: [
          'Nach Jahren extrem niedriger Zinsen hatten viele Anleihefonds lange Restlaufzeiten. Als die Zinsen schnell stiegen, führte die hohe Duration zu Verlusten, die kaum jemand von „sicheren“ Anlagen erwartet hatte.',
        ],
      },
    ],
  },
  {
    slug: 'bitcoin-schwankung-bleibt-hoch',
    title: 'Bitcoin: Warum die Schwankung auch als ETF-Variante hoch bleibt',
    metaTitle: 'Bitcoin als Wertpapier: Die Schwankung bleibt hoch',
    teaser:
      'Regulierte Produkte machen den Zugang einfacher, nicht den Kurs ruhiger. Am zugrunde liegenden Risiko ändert die Verpackung nichts.',
    category: 'Geldanlage',
    publishedAt: '2026-07-17T16:25:00+02:00',
    author: 'Redaktion Finanzkompass',
    readingMinutes: 4,
    tags: ['Bitcoin', 'Kryptowährungen', 'Volatilität'],
    relatedTopics: ['bitcoin-krypto', 'blockchain', 'derivat'],
    relatedSymbols: ['nasdaq-100'],
    isDemo: true,
    body: [
      {
        type: 'paragraph',
        text: 'Börsengehandelte Bitcoin-Produkte haben den Zugang deutlich vereinfacht: keine Wallet, kein privater Schlüssel, Kauf über das gewohnte Depot. An der Schwankungsbreite des Basiswerts ändert das nichts.',
      },
      { type: 'heading', level: 2, text: 'Die Verpackung ändert nicht den Inhalt' },
      {
        type: 'paragraph',
        text: 'Ein Wertpapier, das den Bitcoin-Kurs abbildet, schwankt genauso wie Bitcoin selbst. Reguliert ist der Zugangsweg – nicht das Risiko. Fällt der Kurs um 60 Prozent, fällt das Produkt entsprechend.',
      },
      {
        type: 'paragraph',
        text: 'Hinzu kommt ein Punkt, der oft übersehen wird: Solche Produkte sind in Europa meist keine ETFs im rechtlichen Sinn, weil ein einzelner Rohstoff oder eine einzelne Kryptowährung die Streuungsanforderungen an einen Fonds nicht erfüllt. Sie sind häufig Schuldverschreibungen – **damit trägst du zusätzlich das Ausfallrisiko des Emittenten**, meist über hinterlegte Sicherheiten begrenzt.',
      },
      { type: 'heading', level: 2, text: 'Wie viel ist vertretbar?' },
      {
        type: 'paragraph',
        text: 'Es gibt keinen aus Daten abgeleiteten „richtigen“ Anteil. Eine brauchbare Prüffrage: Welcher Betrag könnte vollständig ausfallen, ohne deine Finanzplanung zu berühren und ohne dass du nachts wach liegst? Dieser Betrag ist die Obergrenze.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Steuerlicher Unterschied',
        items: [
          'Direkt gehaltene Kryptowährungen und Wertpapiere auf Kryptowährungen werden in Deutschland unterschiedlich besteuert. Die Wahl der Verpackung hat deshalb Folgen über das Marktrisiko hinaus – im Zweifel steuerlich beraten lassen.',
        ],
      },
    ],
  },
]
