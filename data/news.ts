import type { ContentBlock } from '@/data/content'

/**
 * Die Nachrichten der Website.
 *
 * Alle Artikel beziehen sich auf tatsächliche Ereignisse und nennen ihre
 * Quellen. Das war nicht immer so: Bis Juli 2026 standen hier erfundene
 * Beispieltexte, die nur Layout und strukturierte Daten demonstrieren sollten.
 * Sie sind ersatzlos entfernt.
 *
 * ## Das rollierende Prinzip
 *
 * Vorne stehen die fünf jüngsten Artikel, alles Ältere rutscht in „Weitere
 * Artikel“. Diese Aufteilung steht **nicht** in den Daten – sie ergibt sich in
 * `lib/news.ts` aus der Reihenfolge. Kommt ein neuer Artikel dazu, verschiebt
 * sich alles von selbst; niemand muss einen alten Artikel umtragen oder ein
 * Kennzeichen umsetzen.
 *
 * ## Was beim Schreiben gilt
 *
 * - **Zusammenfassen, nicht spiegeln.** Die Texte sind selbst geschrieben und
 *   erklären den Mechanismus hinter der Meldung. Fremde Artikel dürften weder
 *   im Volltext noch in längeren Auszügen übernommen werden; verlinkt wird auf
 *   die Quelle.
 * - **Mindestens eine Quelle je Artikel**, https, mit lesbarer Beschriftung.
 *   `lib/news-validate.ts` bricht den Build ab, wenn das fehlt.
 * - **`publishedAt` ist unser Erscheinungsdatum**, nicht das der Quelle. Wann
 *   die Meldung selbst datiert, steht im Text.
 */

export type NewsCategory =
  'Geldpolitik' | 'Märkte' | 'Vorsorge' | 'Steuern & Recht' | 'Geldanlage'

/** Beleg zum Nachlesen – jede Zahl im Text muss hierüber prüfbar sein. */
export interface NewsSource {
  label: string
  url: string
}

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
  /** Belege zum Nachlesen. Mindestens einer ist Pflicht. */
  sources: NewsSource[]
}

export const newsArticles: NewsArticle[] = [
  // ------------------------------------------------------------------ 25.07.
  {
    slug: 'bitcoin-haelt-64000-dollar',
    title: 'Bitcoin hält die 64.000 Dollar – und der Kurs sagt wenig über den Markt',
    metaTitle: 'Bitcoin bei 64.000 Dollar: Kurs und Marktgröße',
    teaser:
      'Nach schwachen Handelstagen stabilisiert sich Bitcoin. Interessanter als der Kurs ist, wie groß der Kryptomarkt insgesamt noch ist – und wie wenig davon Bitcoin ist.',
    category: 'Geldanlage',
    publishedAt: '2026-07-25T21:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Bitcoin', 'Ethereum', 'Kryptowährungen', 'Marktkapitalisierung'],
    relatedTopics: ['bitcoin-krypto', 'blockchain', 'derivat'],
    relatedSymbols: ['nasdaq-100'],
    sources: [
      {
        label: 'ms-aktuell: Bitcoin-Kurs am 25. Juli 2026',
        url: 'https://ms-aktuell.de/welt/25072026-bitcoin-kurs/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Bitcoin hat sich am Samstagabend oberhalb von 64.000 US-Dollar stabilisiert, nach Rückgängen an den vorangegangenen Handelstagen. Gegen 21 Uhr deutscher Zeit lag der Kurs bei rund 64.365 Dollar, umgerechnet etwa 56.500 Euro; die Tagesspanne reichte von rund 63.765 bis 64.368 Dollar. Ethereum notierte bei etwa 1.625 Dollar.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Kurs ist die kleinere Hälfte der Information',
      },
      {
        type: 'paragraph',
        text: 'Ein Bitcoin-Kurs für sich genommen sagt nichts darüber, wie groß dieser Markt ist. Der Gesamtwert aller Kryptowährungen liegt derzeit bei rund 2,23 Billionen US-Dollar, Bitcoin macht davon etwa 56 Prozent aus. **Diese Dominanz ist die eigentlich aussagekräftige Zahl:** Sie zeigt, wie viel Kapital in die kleineren, schwankungsanfälligeren Coins geflossen ist.',
      },
      {
        type: 'paragraph',
        text: 'Zum Vergleich: Der Gesamtwert aller Kryptowährungen bleibt damit unter der Marktkapitalisierung einzelner großer US-Technologiekonzerne. Wer Kryptowährungen als eigene Anlageklasse betrachtet, betrachtet damit eine sehr kleine Anlageklasse.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum sich hier kein fairer Wert ausrechnen lässt',
      },
      {
        type: 'paragraph',
        text: 'Bei einer Aktie lässt sich ein Wert herleiten: Ein Unternehmen erwirtschaftet Gewinne, zahlt Dividenden, besitzt Anlagen. Bei einer Anleihe stehen Zins und Rückzahlung im Vertrag. Bitcoin hat nichts davon. Der Preis ergibt sich vollständig daraus, was die nächste Käuferin zu zahlen bereit ist.',
      },
      {
        type: 'paragraph',
        text: 'Das ist kein Werturteil, sondern eine Feststellung über die Methode: Kursziele für Bitcoin sind keine Bewertungen, sondern Erwartungen. Wer sie liest, sollte sie entsprechend gewichten.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Praktische Konsequenz',
        items: [
          'Ohne Bewertungsanker gibt es kein „zu teuer“ und kein „zu billig“ – und damit auch keine verlässliche Kaufregel. Was bleibt, ist die Frage nach der Größe der Position.',
          'Eine brauchbare Obergrenze: der Betrag, der vollständig ausfallen könnte, ohne die eigene Finanzplanung zu berühren.',
        ],
      },
    ],
  },
  {
    slug: 'gold-nach-dem-rekord-in-der-korrektur',
    title: 'Gold nach dem Rekord: Auch ein sicherer Hafen schwankt',
    teaser:
      'Der Goldpreis liegt gut ein Viertel unter seinem Allzeithoch von 5.598 Dollar. Silber hält sich bei knapp 58 Dollar. Beides zeigt, was Rohstoffe im Depot leisten – und was nicht.',
    category: 'Märkte',
    publishedAt: '2026-07-25T10:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Gold', 'Silber', 'Rohstoffe', 'Realzins'],
    relatedTopics: ['rohstoffe', 'groesste-crashes', 'worauf-achten-einsteiger'],
    relatedSymbols: ['gold', 'silber'],
    sources: [
      {
        label: 'Goldreporter: Goldpreis aktuell – Charts und Marktberichte',
        url: 'https://www.goldreporter.de/goldpreis-aktuell/',
      },
      {
        label: 'goldpreis.de: Goldpreis-Prognose 2026',
        url: 'https://www.goldpreis.de/prognose/',
      },
      {
        label: 'gold.de: Silberpreis aktuell in Euro und US-Dollar',
        url: 'https://www.gold.de/kurse/silberpreis/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Goldpreis notiert bei rund 4.054 US-Dollar je Feinunze. Das ist historisch hoch – und gleichzeitig deutlich unter dem Allzeithoch dieses Jahres bei 5.598 Dollar. Seither läuft eine ausgeprägte Korrekturphase; als entscheidende Unterstützungszone gilt der Bereich zwischen 3.900 und 4.100 Dollar. Silber legte zuletzt um 0,4 Prozent auf 57,92 Dollar zu, nachdem ein starker US-Dollar und die Erwartung anhaltend hoher US-Zinsen auf den Preis gedrückt hatten.',
      },
      { type: 'heading', level: 2, text: 'Gut ein Viertel unter dem Hoch' },
      {
        type: 'paragraph',
        text: 'Vom Rekord bis zum heutigen Stand fehlen rund 27 Prozent. Ein Rückgang dieser Größenordnung wäre bei einem Aktienindex ein Bärenmarkt und stünde in jeder Nachrichtensendung. Bei Gold wird er selten so genannt – obwohl der Verlust für jemanden, der am Hoch gekauft hat, identisch ist.',
      },
      {
        type: 'paragraph',
        text: '**„Sicherer Hafen“ heißt nicht „schwankungsarm“.** Der Begriff beschreibt, dass Gold in bestimmten Krisen anders läuft als Aktien – nicht, dass es ruhig läuft. Wer Gold als Ersatz für das Tagesgeldkonto einsetzt, verwechselt die beiden Eigenschaften.',
      },
      { type: 'heading', level: 2, text: 'Warum der Realzins den Goldpreis bewegt' },
      {
        type: 'paragraph',
        text: 'Gold zahlt keine Zinsen und keine Dividende. Wer Gold hält, verzichtet also auf die Verzinsung, die dasselbe Geld anderswo bringen würde. Dieser Verzicht ist der eigentliche Preis des Goldbesitzes – und er steigt, wenn die Zinsen nach Abzug der Inflation steigen.',
      },
      {
        type: 'formula',
        expression: 'Haltekosten von Gold ≈ Realzins = Nominalzins − Inflationsrate',
        description:
          'Genau deshalb reagiert der Goldpreis so empfindlich auf Notenbanksitzungen: Nicht der Goldmarkt ändert sich dabei, sondern die Alternative dazu.',
      },
      {
        type: 'paragraph',
        text: 'Das erklärt auch die aktuelle Bewegung: Solange die Märkte damit rechnen, dass die US-Notenbank ihre Zinsen hoch hält, bleibt die Alternative zu Gold attraktiv. Ein starker Dollar wirkt zusätzlich, weil Gold in Dollar notiert und für alle außerhalb des Dollarraums damit teurer wird.',
      },
      { type: 'heading', level: 2, text: 'Silber ist nicht das kleine Gold' },
      {
        type: 'paragraph',
        text: 'Silber wird häufig als günstigere Variante von Gold beschrieben. Das führt in die Irre: Ein großer Teil der Silbernachfrage kommt aus der Industrie – Elektronik, Photovoltaik, Medizintechnik. Silber hängt damit an der Konjunktur, Gold nicht. In Abschwüngen fällt Silber deshalb regelmäßig stärker.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was das für die eigene Aufteilung heißt',
        items: [
          'Rohstoffe erzeugen keinen Ertrag, sie ändern nur ihren Preis. Ein Depot, das ausschließlich daraus besteht, hat keine Ertragsquelle.',
          'Als Beimischung ist die übliche Größenordnung einstellig prozentual – der Zweck ist die andere Schwankungsrichtung, nicht die Rendite.',
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ 24.07.
  {
    slug: 'gewinnmitnahmen-bei-ki-aktien',
    title: 'Gewinnmitnahmen bei KI-Aktien: Intel liefert, der Nasdaq gibt trotzdem nach',
    metaTitle: 'KI-Aktien: Warum gute Zahlen den Kurs nicht heben',
    teaser:
      'An der Wall Street erholte sich der Dow, während der Nasdaq nachgab – trotz starker Intel-Zahlen. Ein Lehrstück darüber, wie Erwartungen in Kursen stecken.',
    category: 'Märkte',
    publishedAt: '2026-07-24T22:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Nasdaq', 'Wall Street', 'Künstliche Intelligenz', 'Quartalszahlen'],
    relatedTopics: ['aktie', 'wann-kaufen-verkaufen', 'aktien-laender-branchen'],
    relatedSymbols: ['nasdaq-100', 'sp500'],
    sources: [
      {
        label: 'onvista: Dow leicht erholt – Nasdaq leidet unter Gewinnmitnahmen',
        url: 'https://www.onvista.de/news/2026/07-24-roundup-aktien-new-york-dow-leicht-erholt-nasdaq-leidet-unter-gewinnmitnahmen-0-10-26535815',
      },
      {
        label: 'Invezz: Dow edges higher as Intel slips despite earnings',
        url: 'https://invezz.com/news/2026/07/24/dow-edges-higher-as-intel-slips-despite-earnings-nasdaq-dips/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'An der Wall Street setzte sich am Freitag das Auf und Ab fort: Der Dow Jones erholte sich vom Rückschlag des Vortages, der technologielastige Nasdaq gab dagegen nach. Ausgelöst wurde die Erholung von wieder rückläufigen Ölpreisen. Im Technologiesektor blieb es vorsichtig – ungeachtet einer starken Quartalsbilanz von Intel, deren Aktie dennoch verlor.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum gute Zahlen den Kurs nicht automatisch heben',
      },
      {
        type: 'paragraph',
        text: 'Der Kurs einer Aktie enthält bereits das, was der Markt erwartet. Wenn ein Unternehmen gute Zahlen meldet, entscheidet nicht die Zahl selbst über die Reaktion, sondern die Differenz zur Erwartung. **Ein starkes Quartal, das ein noch stärkeres hätte sein sollen, ist an der Börse eine Enttäuschung.**',
      },
      {
        type: 'paragraph',
        text: 'Genau das ist der Mechanismus hinter „Gewinnmitnahmen“. Nach einem starken Lauf sind die Erwartungen hoch – und die Messlatte damit ebenfalls. Wer aus einer guten Meldung auf einen steigenden Kurs schließt, überspringt diesen Zwischenschritt.',
      },
      { type: 'heading', level: 2, text: 'Dow und Nasdaq messen nicht dasselbe' },
      {
        type: 'paragraph',
        text: 'Dass die beiden Indizes in verschiedene Richtungen liefen, ist weniger überraschend, als es klingt. Der Dow Jones enthält 30 Werte und ist preisgewichtet: Eine Aktie mit hohem Kurs zählt mehr, unabhängig von der Unternehmensgröße. Der Nasdaq 100 bündelt die großen Technologiewerte und ist nach Marktwert gewichtet.',
      },
      {
        type: 'list',
        items: [
          '**Dow Jones:** 30 Titel, preisgewichtet – eine Konstruktion aus dem 19. Jahrhundert, die heute niemand mehr so bauen würde.',
          '**Nasdaq 100:** technologielastig, nach Marktkapitalisierung gewichtet – wenige sehr große Unternehmen bestimmen den Verlauf.',
          '**S&P 500:** die breiteste der drei Messgrößen und deshalb der übliche Bezugspunkt für den US-Markt.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Konzentration im vermeintlich breiten Index',
        items: [
          'Weil nach Marktwert gewichtet wird, hängt auch ein breiter US-Index inzwischen stark an wenigen Technologiekonzernen. Wer „weltweit gestreut“ investiert, hält davon oft mehr, als er vermutet.',
          'Ein Blick in die Top-10-Positionen des eigenen ETF beantwortet die Frage in zwei Minuten.',
        ],
      },
    ],
  },
  {
    slug: 'oelpreis-ueber-100-dollar',
    title: 'Brent über 100 Dollar: Wie ein Ölpreis in der eigenen Inflationsrate landet',
    metaTitle: 'Brent über 100 Dollar: der Weg in die Inflationsrate',
    teaser:
      'Der Streit um die Straße von Hormus hat den Ölpreis auf den höchsten Stand seit zwei Monaten getrieben. Die Kette von dort bis zur Zinsentscheidung ist kürzer als gedacht.',
    category: 'Märkte',
    publishedAt: '2026-07-24T18:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Ölpreis', 'Brent', 'Inflation', 'Geopolitik'],
    relatedTopics: ['rohstoffe', 'boerse', 'staatsanleihe'],
    relatedSymbols: ['dax', 'eur-usd'],
    sources: [
      {
        label: 'onvista: Ölpreise – Brent-Rohöl weiter über 100 Dollar',
        url: 'https://www.onvista.de/news/2026/07-24-oelpreise-brent-rohoel-weiter-ueber-100-dollar-0-10-26535551',
      },
      {
        label: 'euronews: Golfstaaten suchen Alternativen zur Straße von Hormus',
        url: 'https://de.euronews.com/2026/07/23/golfstaaten-suchen-alternativen-zur-strasse-von-hormus-olpreis-steigt-auf-100-dollar',
      },
      {
        label: 't-online: Preis für Brent-Rohöl übersteigt wichtige Marke',
        url: 'https://www.t-online.de/finanzen/aktuelles/wirtschaft/id_101357118/preis-fuer-brent-rohoel-uebersteigt-mit-ueber-100-dollar-wichtige-marke.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Ein Barrel der Nordseesorte Brent hat am Donnerstag bis zu 100,36 US-Dollar gekostet – der höchste Stand seit zwei Monaten. Auslöser ist die erneute Eskalation um die Straße von Hormus, die für den weltweiten Handel mit Öl und Flüssiggas zentrale Meerenge. Vom Iran unterstützte Huthi-Milizen erklärten zudem, zwei saudi-arabische Tanker im Roten Meer angegriffen zu haben. Am Freitag pendelte der Preis um die 100-Dollar-Marke; das Nachgeben im Tagesverlauf sorgte an den Aktienmärkten für Erleichterung.',
      },
      {
        type: 'paragraph',
        text: 'Die Ölproduzenten am Golf investieren inzwischen Milliarden in Pipelines, die Rohöl an der Meerenge vorbeileiten sollen. Das ist die eigentliche Nachricht hinter der Nachricht: Der Markt preist nicht einen Tag ein, sondern eine dauerhafte Risikoprämie.',
      },
      { type: 'heading', level: 2, text: 'Vier Schritte vom Barrel zum Zinssatz' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Energie verteuert sich.** Kraftstoff, Heizen, Strom aus Gaskraftwerken – der Effekt ist innerhalb weniger Wochen an der Zapfsäule sichtbar.',
          '**Produktion verteuert sich.** Energie steckt in jedem hergestellten und transportierten Gut. Die Kosten wandern zeitversetzt in die Endpreise.',
          '**Die Inflationsrate steigt.** Energie ist im Warenkorb direkt und über die Zweitrundeneffekte indirekt enthalten.',
          '**Die Notenbank reagiert.** Steigt die Inflation, sinkt der Spielraum für Zinssenkungen – und die Wahrscheinlichkeit weiterer Erhöhungen steigt.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Diese Kette ist der Grund, warum ein geopolitisches Ereignis am anderen Ende der Welt in der eigenen Baufinanzierung ankommen kann. **Der Umweg läuft über die Inflationsrate, nicht über den Aktienmarkt.**',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum Aktienmärkte auf teures Öl doppelt reagieren',
      },
      {
        type: 'paragraph',
        text: 'Für die meisten Unternehmen ist Energie ein Kostenblock: Steigt er, sinkt die Gewinnmarge. Gleichzeitig drückt ein höheres Zinsniveau auf die Bewertung, weil künftige Gewinne stärker abgezinst werden. Beide Effekte wirken in dieselbe Richtung – deshalb fallen Aktienkurse bei Ölpreisschocks überproportional.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was daraus für den Sparplan folgt',
        items: [
          'Nichts. Ein Ölpreis, der um eine runde Marke pendelt, ist kein Anlass, eine langfristige Aufteilung zu ändern.',
          'Wer bewusst gegen dieses Risiko streuen will, tut das über die Zusammensetzung des Depots – nicht über Ein- und Ausstiege.',
        ],
      },
    ],
  },
  {
    slug: 'dax-schliesst-ueber-25000-punkten',
    title: 'DAX über 25.000 Punkten – getragen von einer einzigen Aktie',
    metaTitle: 'DAX über 25.000: Wenn ein Wert den Index trägt',
    teaser:
      'Der Leitindex holt sich die 25.000 zurück und schließt die Woche im Plus. Der Schub kam vor allem von SAP – und das sagt mehr über den Index als über die Wirtschaft.',
    category: 'Märkte',
    publishedAt: '2026-07-24T18:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['DAX', 'SAP', 'Indexgewichtung', 'Klumpenrisiko'],
    relatedTopics: ['aktie', 'etf', 'aktien-laender-branchen'],
    relatedSymbols: ['dax', 'euro-stoxx-50'],
    sources: [
      {
        label: 'Handelsblatt: Dax schließt oberhalb der 25.000-Punkte-Marke',
        url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-schliesst-oberhalb-der-25.000-punkte-marke/100242615.html',
      },
      {
        label: 'finanzen.at: KW 30 – so performten die DAX-Aktien',
        url: 'https://www.finanzen.at/nachrichten/aktien/kw-30-so-performten-die-dax-aktien-in-der-vergangenen-woche-1036340766',
      },
      {
        label: 'AVR Online: DAX über 25.000 Punkte – SAP-Rally und fallende Ölpreise',
        url: 'https://www.avronline.de/nachrichten/news-views-markets/dax-25000-punkte-sap-oelpreise-zinsen-aktienmarkt/25311/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der DAX hat den Rückschlag vom Donnerstag wettgemacht: Am Freitag legte der deutsche Leitindex knapp 1,4 Prozent zu und schloss mit 25.099 Punkten auf dem Tageshoch. Über die Woche steht damit ein Plus von 1,1 Prozent, bei vier Gewinn- und einem Verlusttag. Getragen wurde der Anstieg von der SAP-Aktie, die nach den Zahlen zum zweiten Quartal um fast zehn Prozent zulegte – Analysten verwiesen auf das Wachstum im Cloud-Geschäft. Hinzu kamen wieder nachgebende Ölpreise.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Wenn ein Wert den Index bewegt, ist das eine Aussage über den Index',
      },
      {
        type: 'paragraph',
        text: 'Der DAX ist nach Marktkapitalisierung gewichtet: Je wertvoller ein Unternehmen an der Börse ist, desto stärker schlägt seine Kursbewegung im Index durch. Bei 40 Werten und einem sehr großen Schwergewicht heißt das, dass ein einzelnes Quartalsergebnis den Index sichtbar verschieben kann.',
      },
      {
        type: 'paragraph',
        text: '**Ein Indexstand ist deshalb kein Konjunkturindikator.** Er misst den Börsenwert von 40 Unternehmen, nicht den Zustand der deutschen Wirtschaft. Wer aus einem DAX-Hoch auf eine gute Wirtschaftslage schließt, zieht den Schluss aus der falschen Zahl.',
      },
      { type: 'heading', level: 2, text: 'Was das für ein DAX-Investment bedeutet' },
      {
        type: 'paragraph',
        text: 'Ein ETF auf den DAX klingt nach Streuung: 40 Unternehmen in einem Papier. Tatsächlich ist die Streuung geringer, als die Zahl suggeriert. Die Werte kommen aus einem Land, viele aus wenigen Branchen, und die größten Positionen bestimmen den Verlauf.',
      },
      {
        type: 'list',
        items: [
          '**Ein Land.** Der deutsche Markt macht global einen einstelligen Prozentanteil aus. Wer nur ihn hält, wettet auf einen kleinen Ausschnitt.',
          '**Wenige Branchen.** Software, Industrie, Chemie und Finanzen dominieren; ganze Wirtschaftszweige fehlen.',
          '**Wenige Schwergewichte.** Die Top-Werte tragen einen großen Teil der Bewegung – das ist ein Klumpenrisiko, kein Streuungseffekt.',
        ],
      },
      { type: 'heading', level: 2, text: 'Ein Hinweis zum Vergleichen' },
      {
        type: 'paragraph',
        text: 'Beim Vergleich mit US-Indizes lohnt der Blick auf die Berechnungsart. Der DAX ist ein Performance-Index: Dividenden werden rechnerisch wieder angelegt. Der S&P 500 wird üblicherweise als Kursindex dargestellt. Prozentzahlen der beiden direkt nebeneinanderzustellen, bevorteilt den DAX systematisch.',
      },
    ],
  },
  // ------------------------------------------------------- 23.07. und früher
  {
    slug: 'ezb-pausiert-nach-der-zinserhoehung',
    title: 'EZB pausiert nach der Erhöhung – Einlagenzins bleibt bei 2,25 Prozent',
    metaTitle: 'EZB-Zinspause: Einlagenzins bleibt bei 2,25 Prozent',
    teaser:
      'Der EZB-Rat lässt die Leitzinsen unverändert – sechs Wochen nach der ersten Erhöhung seit drei Jahren. Für Sparer entscheidet genau dieser eine Satz über das Tagesgeld.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-23T16:00:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['EZB', 'Leitzins', 'Einlagenzins', 'Tagesgeld'],
    relatedTopics: ['tagesgeld', 'zinseszins', 'einlagensicherung'],
    relatedSymbols: ['eur-usd'],
    sources: [
      {
        label: 'LBBW: EZB-Zinsentscheid Juli 2026',
        url: 'https://www.lbbw.de/artikel/news-und-einschaetzungen/ezb-zinsentscheid-juli-2026_am6zch3ggt_d.html',
      },
      {
        label: 'Handelsblatt: So hat EZB-Chefin Lagarde die Zinsentscheidung erklärt',
        url: 'https://www.handelsblatt.com/finanzen/geldpolitik/geldpolitik-so-hat-ezb-chefin-lagarde-die-neue-zinsentscheidung-erklaert/100242434.html',
      },
      {
        label: 'Trading Economics: EZB stoppt Zinssenkungen',
        url: 'https://de.tradingeconomics.com/euro-area/interest-rate/news/472456',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der EZB-Rat hat am 23. Juli alle drei Leitzinsen unverändert gelassen. Der Einlagensatz bleibt damit bei 2,25 Prozent. Die Entscheidung wurde um 14:15 Uhr veröffentlicht, EZB-Präsidentin Christine Lagarde erläuterte sie ab 14:45 Uhr auf der Pressekonferenz.',
      },
      {
        type: 'paragraph',
        text: 'Bemerkenswert ist die Pause vor allem im Rückblick: Bei der Sitzung am 11. Juni hatte die Notenbank alle drei Leitzinsen um je 0,25 Prozentpunkte angehoben – die erste Erhöhung seit drei Jahren. Die Pause bedeutet also nicht Stillstand, sondern Abwarten, ob dieser Schritt gegen die Inflation genügt.',
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
        text: 'Deshalb bewegen sich Tagesgeldangebote mit einiger Verzögerung im Gleichschritt mit dem Einlagensatz. **Die Verzögerung läuft asymmetrisch:** Sinkende Notenbankzinsen geben Banken meist schnell weiter, steigende deutlich langsamer.',
      },
      { type: 'heading', level: 2, text: 'Drei Zinssätze, nicht einer' },
      {
        type: 'table',
        caption: 'Die drei Leitzinsen der EZB und wofür sie stehen',
        head: ['Satz', 'Bedeutung'],
        rows: [
          [
            'Einlagesatz',
            'Was Banken für über Nacht bei der EZB geparktes Geld bekommen. Der für Sparer relevante Satz.',
          ],
          [
            'Hauptrefinanzierungssatz',
            'Zu diesem Satz leihen sich Banken wöchentlich Geld bei der EZB.',
          ],
          [
            'Spitzenrefinanzierungssatz',
            'Der teure Notfallsatz für kurzfristigen Bedarf über Nacht.',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Wenn in Meldungen von „dem Leitzins“ die Rede ist, ist meist der Einlagesatz gemeint – seit die Banken im Euroraum insgesamt mehr Geld parken als sie leihen, ist er der wirksame Satz.',
      },
      { type: 'heading', level: 2, text: 'Der Blick nach vorn' },
      {
        type: 'paragraph',
        text: 'Sollte die EZB die Inflationsrisiken weiter als aufwärts gerichtet einschätzen, gilt ein weiterer Schritt um 25 Basispunkte als möglich. Genannt wird dabei die Sitzung im September. Für Kreditnehmer heißt das: Auf schnell fallende Bauzinsen zu setzen, ist derzeit die schwächere Wette.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Nominal ist nicht real',
        items: [
          'Entscheidend ist nicht der Zins auf dem Kontoauszug, sondern was nach Inflation übrig bleibt. Bei 2,25 Prozent Tagesgeld und rund 2,3 Prozent Inflation in Deutschland ist der Realzins vor Steuern etwa null.',
          'Nach Abgeltungssteuer wird daraus ein Minus – es sei denn, der Sparerpauschbetrag ist noch nicht ausgeschöpft.',
        ],
      },
    ],
  },
  {
    slug: 'fed-vor-der-juli-sitzung',
    title: 'Fed vor der Juli-Sitzung: Der Dot Plot zeigt erstmals nach oben',
    metaTitle: 'Fed-Sitzung im Juli: Was der Dot Plot signalisiert',
    teaser:
      'Am 29. Juli entscheidet die US-Notenbank. Erwartet wird die fünfte Pause in Folge – bemerkenswert ist aber, was die Projektionen der Mitglieder inzwischen andeuten.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-23T09:00:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Fed', 'FOMC', 'Dot Plot', 'US-Zinsen'],
    relatedTopics: ['staatsanleihe', 'aktien-laender-branchen', 'tagesgeld'],
    relatedSymbols: ['sp500', 'eur-usd'],
    sources: [
      {
        label: 'Kagels Trading: Fed-Zinsentscheid – FOMC-Termine und Prognose 2026',
        url: 'https://www.kagels-trading.de/fed-zinsentscheid/',
      },
      {
        label: 'LBBW: Fed-Zinsentscheid Juni 2026',
        url: 'https://www.lbbw.de/artikel/news-und-einschaetzungen/fed-zinsentscheid-juni-2026_amz3w3dac2_d.html',
      },
      {
        label: 'Mehrwertsteuerrechner: FOMC-Termine und US-Leitzinsen 2026',
        url: 'https://www.mehrwertsteuerrechner.de/notenbanken/fed-sitzung-zinsentscheid-termine/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die US-Notenbank tagt am 28. und 29. Juli. Die Entscheidung wird am 29. Juli um 20:00 Uhr MESZ veröffentlicht, die Pressekonferenz beginnt um 20:30 Uhr. Neue Wirtschaftsprojektionen gibt es bei dieser Sitzung nicht.',
      },
      {
        type: 'paragraph',
        text: 'Zuletzt hatte die Fed am 17. Juni den Leitzins zum vierten Mal in Folge bei 3,50 bis 3,75 Prozent belassen. Für die Juli-Sitzung rechnen die Terminmärkte überwiegend erneut mit einer Pause: Das FedWatch-Tool der CME Group weist eine Wahrscheinlichkeit von rund 78 Prozent dafür aus.',
      },
      { type: 'heading', level: 2, text: 'Was ein Dot Plot ist' },
      {
        type: 'paragraph',
        text: 'Viermal im Jahr veröffentlicht die Fed eine Grafik, in der jedes stimmberechtigte Mitglied anonym einen Punkt für den aus seiner Sicht angemessenen Zinssatz der kommenden Jahre setzt. Diese Punktwolke – der Dot Plot – ist keine Zusage und kein Beschluss, sondern eine Momentaufnahme der Einschätzungen.',
      },
      {
        type: 'paragraph',
        text: 'Der jüngste Dot Plot signalisiert erstmals eine mögliche Zinserhöhung statt einer Senkung. Ein Teil der Mitglieder hält angesichts hartnäckiger Inflation und der Zollpolitik weitere Schritte nach oben für denkbar. **Das ist der eigentliche Richtungswechsel** – nicht der Zinssatz selbst, der sich seit vier Sitzungen nicht bewegt hat.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum eine US-Entscheidung ein deutsches Depot betrifft',
      },
      {
        type: 'list',
        items: [
          '**Über die Bewertung.** Höhere US-Zinsen zinsen künftige Unternehmensgewinne stärker ab. Das trifft besonders Wachstumswerte – und damit die schwersten Positionen in weltweit streuenden ETFs.',
          '**Über den Wechselkurs.** Steigende US-Zinsen machen den Dollar attraktiver. Ein stärkerer Dollar hebt den Eurowert von US-Anlagen; ein schwächerer senkt ihn.',
          '**Über die Anleihen.** Der Kurs bestehender Anleihen fällt, wenn das Zinsniveau steigt. Anleihefonds mit langer Duration reagieren darauf am stärksten.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was Notenbanktermine nicht sind',
        items: [
          'Kein Handelssignal. Was erwartet wird, steckt bereits in den Kursen; bewegt wird der Markt nur von der Abweichung – und die kennt vorher niemand.',
          'Interessant sind Notenbanksitzungen als Erklärung im Nachhinein, nicht als Grundlage für Entscheidungen im Voraus.',
        ],
      },
    ],
  },
  {
    slug: 'fruehstartrente-entwurf-liegt-vor',
    title: 'Frühstartrente: 10 Euro im Monat vom Staat – der Gesetzentwurf liegt vor',
    metaTitle: 'Frühstartrente: Was im Gesetzentwurf steht',
    teaser:
      'Das Bundesfinanzministerium hat den Entwurf zur Frühstartrente vorgelegt. Zehn Euro im Monat klingen nach wenig – über die Laufzeit ist es vor allem eine Zeitfrage.',
    category: 'Vorsorge',
    publishedAt: '2026-07-22T08:00:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Frühstartrente', 'Altersvorsorge', 'Zinseszins', 'Sparplan'],
    relatedTopics: ['rente', 'zinseszins', 'etf'],
    relatedSymbols: [],
    sources: [
      {
        label: 'Bundesfinanzministerium: Entwurf eines Frühstartrentengesetzes',
        url: 'https://www.bundesfinanzministerium.de/Content/DE/Gesetzestexte/Gesetze_Gesetzesvorhaben/Abteilungen/Abteilung_IV/21_Legislaturperiode/2026-07-21-FruehStRG/0-Gesetz.html',
      },
      {
        label:
          'DATEV magazin: Entwurf eines Gesetzes zur Einführung einer Frühstartrente',
        url: 'https://www.datev-magazin.de/nachrichten-steuern-recht/steuern/entwurf-eines-gesetzes-zur-einfuehrung-einer-fruehstartrente-148005',
      },
      {
        label: 'Bundesfinanzministerium: FAQ zur Reform der privaten Altersvorsorge',
        url: 'https://www.bundesfinanzministerium.de/Content/DE/FAQ/reform-der-privaten-altersvorsorge.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Das Bundesfinanzministerium hat am 21. Juli einen Referentenentwurf für die Frühstartrente vorgelegt – rund eineinhalb Jahre nachdem die Idee in den Koalitionsvertrag aufgenommen wurde. Vorgesehen ist, dass der Staat für jedes Kind zwischen 6 und 18 Jahren, das in Deutschland eine Bildungseinrichtung besucht, monatlich zehn Euro in ein individuelles, kapitalgedecktes und privat organisiertes Altersvorsorgedepot einzahlt.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Noch kein geltendes Recht',
        items: [
          'Ein Referentenentwurf ist der Anfang des Gesetzgebungsverfahrens, nicht das Ergebnis. Bis zur Verkündung kann sich vieles ändern.',
          'Die ersten staatlichen Beiträge sollen rückwirkend zum 1. Januar 2026 gutgeschrieben werden, sobald Gesetz und technische Umsetzung stehen.',
        ],
      },
      { type: 'heading', level: 2, text: 'Was zehn Euro im Monat ausmachen' },
      {
        type: 'paragraph',
        text: 'Von 6 bis 18 sind es 144 Monate, also 1.440 Euro an staatlichen Einzahlungen. Das allein wäre unbedeutend. Interessant wird die Sache erst durch die Liegezeit danach: Das Geld bleibt bis zum Renteneintritt investiert.',
      },
      {
        type: 'table',
        caption:
          'Modellrechnung mit 6 Prozent jährlicher Rendite, nominal, vor Kosten und Steuern',
        head: ['Zeitpunkt', 'Wert des Depots'],
        rows: [
          ['eingezahlt insgesamt (6 bis 18 Jahre)', '1.440 €'],
          ['mit 18 Jahren', 'rund 2.100 €'],
          ['mit 67 Jahren, ohne weitere Einzahlung', 'rund 36.000 €'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Aus 1.440 Euro werden in dieser Rechnung etwa das Fünfundzwanzigfache – **nicht weil der Betrag groß wäre, sondern weil die Zeit lang ist.** Wer dieselbe Endsumme erst mit 40 aufbauen will, muss ein Vielfaches einzahlen.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Wie diese Zahlen zu lesen sind',
        items: [
          'Sechs Prozent sind eine Annahme, keine Zusage. Kapitalmärkte liefern keine gleichmäßigen Jahresrenditen.',
          'Die Werte sind nominal. Bei zwei Prozent Inflation entsprechen 36.000 Euro in 49 Jahren einer heutigen Kaufkraft von etwa 13.700 Euro.',
          'Kosten des Depots und die spätere Besteuerung sind nicht enthalten. Beides steht im Entwurf noch nicht abschließend fest.',
        ],
      },
      { type: 'heading', level: 2, text: 'Der eigentliche Zweck' },
      {
        type: 'paragraph',
        text: 'Der Entwurf nennt als Ziel ausdrücklich, breite Bevölkerungsgruppen früh mit Kapitalmarktanlagen und deren Erträgen in Berührung zu bringen und die Kapitalmarktfinanzierung in Deutschland zu stärken. Die Frühstartrente ist dabei eng mit der Reform der geförderten privaten Altersvorsorge abgestimmt, damit ein Übergang von der einen in die andere möglich ist.',
      },
      {
        type: 'paragraph',
        text: 'Für Eltern ändert das an der wichtigsten Größe nichts: Ob und wann zusätzlich eingezahlt wird, entscheidet über das Ergebnis weit stärker als die staatlichen zehn Euro.',
      },
    ],
  },
  {
    slug: 'tagesgeldzinsen-ziehen-wieder-an',
    title: 'Tagesgeld: Die Zinsen ziehen wieder an – der Realzins bleibt dünn',
    metaTitle: 'Tagesgeldzinsen steigen: Was real übrig bleibt',
    teaser:
      'Im Schnitt gibt es 2,6 Prozent, einzelne Aktionsangebote liegen über vier Prozent. Nach Inflation und Steuer bleibt davon weniger übrig, als die Zahlen vermuten lassen.',
    category: 'Geldanlage',
    publishedAt: '2026-07-21T07:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Tagesgeld', 'Festgeld', 'Realzins', 'Sparerpauschbetrag'],
    relatedTopics: ['tagesgeld', 'einlagensicherung', 'sparerpauschbetrag'],
    relatedSymbols: [],
    sources: [
      {
        label: 'WEB.DE: Tagesgeld und Festgeld – die besten Zinsen im Juli 2026',
        url: 'https://web.de/magazine/ratgeber/finanzen-verbraucher/tagesgeld-festgeld-juli-2026-besten-zinsen-bekommt-42474846',
      },
      {
        label: 'Handelsblatt: Tagesgeld-Vergleich',
        url: 'https://www.handelsblatt.com/vergleich/tagesgeld-vergleich/',
      },
      {
        label: 'Statistisches Bundesamt: Inflationsrate im Juni 2026 bei +2,3 %',
        url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/07/PD26_243_611.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Tagesgeldzinsen sind im Jahresvergleich um 0,3 Prozentpunkte gestiegen, von 2,3 auf 2,6 Prozent. Einzelne Anbieter werben befristet mit über vier Prozent, Festgeld erreicht je nach Laufzeit bis zu rund 3,2 Prozent. Auch die Spitzenangebote liegen je nach Laufzeit 0,25 bis 0,35 Prozentpunkte höher als vor einem Jahr.',
      },
      { type: 'heading', level: 2, text: 'Zwei Abzüge, die in keiner Werbung stehen' },
      {
        type: 'paragraph',
        text: 'Die Inflationsrate in Deutschland lag im Juni bei 2,3 Prozent. Bei einem Tagesgeldzins von 2,6 Prozent bleibt damit vor Steuern ein Realzins von etwa 0,3 Prozent. Auf die Zinserträge fällt zusätzlich Abgeltungssteuer plus Solidaritätszuschlag an, sofern der Sparerpauschbetrag ausgeschöpft ist.',
      },
      {
        type: 'formula',
        expression: 'Realzins ≈ Nominalzins − Inflationsrate',
        description:
          'Eine brauchbare Näherung für kleine Werte. Exakt gilt: (1 + Nominalzins) / (1 + Inflationsrate) − 1.',
      },
      {
        type: 'paragraph',
        text: '**Aus 2,6 Prozent auf dem Plakat werden so real leicht null.** Das ist kein Argument gegen Tagesgeld – es ist eines dagegen, Tagesgeld für den langfristigen Vermögensaufbau einzusetzen.',
      },
      { type: 'heading', level: 2, text: 'Aktionszins ist nicht Bestandszins' },
      {
        type: 'paragraph',
        text: 'Die höchsten beworbenen Sätze gelten fast immer nur für Neukunden und nur für einige Monate. Danach fällt der Zins auf den Bestandssatz, der deutlich niedriger liegen kann. Wer die Spitzenangebote mitnimmt, muss die Frist im Kalender haben – sonst zahlt die Trägheit die Differenz.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Worauf vor der Kontoeröffnung zu achten ist',
        items: [
          'Einlagensicherung: In welchem Land sitzt die Bank, welches Sicherungssystem greift? Die gesetzlichen 100.000 Euro je Kunde und Institut gelten EU-weit – im Ernstfall zahlt aber die Sicherung des Sitzlandes.',
          'Freistellungsauftrag: Der Sparerpauschbetrag wirkt nicht automatisch. Ohne Auftrag führt die Bank Steuern ab, die man sich über die Anlage KAP zurückholen müsste.',
          'Laufzeitbindung: Festgeld zahlt mehr, weil das Geld gebunden ist. Für den Notgroschen ist das die falsche Eigenschaft.',
        ],
      },
    ],
  },
]
