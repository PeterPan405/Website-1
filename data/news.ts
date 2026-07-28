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
 * Vorne stehen die jüngsten Artikel (`CURRENT_NEWS_COUNT` in `lib/news.ts`),
 * alles Ältere rutscht in „Weitere Artikel“. Diese Aufteilung steht **nicht**
 * in den Daten – sie ergibt sich allein aus der Reihenfolge. Kommt ein neuer
 * Artikel dazu, verschiebt sich alles von selbst; niemand muss einen alten
 * Artikel umtragen, ein Kennzeichen umsetzen oder etwas löschen. Ältere
 * Ausgaben bleiben vollständig erreichbar – das Archiv ist kein eigener
 * Datenbestand, sondern der hintere Teil derselben Liste.
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
  // ------------------------------------------------------------------ 28.07.
  {
    slug: 'china-baut-eigene-duv-anlagen-asml-bricht-ein',
    title: 'Fünf Maschinen gegen 131 – warum ASML trotzdem einbricht',
    metaTitle: 'ASML bricht ein: China baut eigene DUV-Anlagen',
    teaser:
      'Ein Bericht über chinesische Lithografieanlagen kostet ASML zeitweise 8,5 Prozent. Um Stückzahlen geht es dabei nicht – die sprechen für den Marktführer.',
    category: 'Märkte',
    publishedAt: '2026-07-28T06:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['ASML', 'Halbleiter', 'China', 'Bewertung'],
    relatedTopics: ['aktie', 'risiko-und-rendite', 'aktien-laender-branchen'],
    relatedSymbols: ['asml', 'nvidia', 'tsmc'],
    sources: [
      {
        label:
          'MarketScreener: China beginnt mit der Herstellung heimischer DUV-Lithografieanlagen (Bericht von The Information)',
        url: 'https://de.marketscreener.com/boerse-nachrichten/china-beginnt-mit-der-herstellung-heimischer-duv-lithografieanlagen-berichtet-the-information-ce7f51dcde89ff22',
      },
      {
        label: 'onvista: ASML fallen aus Sorge vor China-Konkurrenz (27.07.2026)',
        url: 'https://www.onvista.de/news/2026/07-27-aktie-im-fokus-asml-fallen-aus-sorge-vor-china-konkurrenz-chipsektor-folgt-0-10-26536524',
      },
      {
        label:
          'Investing.com: Bericht über Chinas DUV-Durchbruch schickt ASML und US-Chip-Aktien auf Talfahrt',
        url: 'https://de.investing.com/news/stock-market-news/bericht-uber-chinas-duvdurchbruch-schickt-asml-und-uschipaktien-auf-talfahrt-3581320',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Branchendienst The Information berichtete am Montag, ein staatlich gestütztes Unternehmen in Schanghai habe begonnen, selbst entwickelte Immersions-DUV-Anlagen zu bauen – jene Maschinen, mit denen Chiphersteller Schaltungsmuster auf Silizium belichten. Bislang beherrschen das weltweit nur eine Handvoll Anbieter, allen voran der niederländische Konzern ASML.',
      },
      {
        type: 'paragraph',
        text: 'Die Reaktion kam sofort. Die ASML-Aktie verlor im Tagesverlauf zeitweise 8,5 Prozent und notierte am Nachmittag rund 6,6 Prozent tiefer bei etwa 1.442 Euro – der niedrigste Stand seit gut sieben Wochen. Je nach Uhrzeit meldeten einzelne Dienste zwischen 4,6 und 8,5 Prozent Minus; das ist kein Widerspruch, sondern derselbe Tag zu verschiedenen Stunden.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die Stückzahlen sprechen eine andere Sprache',
      },
      {
        type: 'paragraph',
        text: 'Wer die Meldung neben die Produktionszahlen legt, findet zunächst kein Drama:',
      },
      {
        type: 'table',
        caption:
          'Immersions-DUV-Anlagen: geplante chinesische Fertigung gegen ASML-Auslieferungen',
        head: ['', 'Anlagen'],
        rows: [
          ['Schanghaier Hersteller, geplant für 2026', 'etwa 5'],
          ['Schanghaier Hersteller, geplant für 2027', 'etwa 20'],
          ['ASML, ausgeliefert im Jahr 2025', '131'],
        ],
      },
      {
        type: 'paragraph',
        text: 'ASML lieferte 2025 insgesamt 327 Lithografiesysteme aus, darunter 131 Immersions-DUV-Anlagen und 48 EUV-Systeme, und erzielte damit 32,7 Milliarden Euro Umsatz. Fünf Maschinen aus Schanghai ändern daran in diesem Jahr nichts. Auch die Berichte selbst schränken ein: Leistung und Zuverlässigkeit liegen zurück, vor einer Serienfertigung steht noch umfangreiche Erprobung, und ähnliche Meldungen über chinesische Fortschritte haben sich in der Vergangenheit schon als überzogen erwiesen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum der Kurs trotzdem fällt',
      },
      {
        type: 'paragraph',
        text: 'Weil ein Kurs nicht das laufende Jahr bezahlt, sondern alle künftigen. In der Bewertung von ASML steckt die Annahme, dass es auf absehbare Zeit kaum jemanden gibt, der dasselbe kann – und wer keine Konkurrenz hat, bestimmt den Preis. Eine glaubwürdige Meldung, dass jemand anfängt, es zu können, ändert nicht die Zahlen von heute, sondern die Wahrscheinlichkeit für die Zahlen von 2032.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was hier gehandelt wurde',
        items: [
          'Nicht fünf Maschinen, sondern die Frage, ob aus fünf irgendwann fünfzig werden.',
          'Nicht der Umsatz dieses Jahres, sondern die Dauer des Vorsprungs.',
          'Genau deshalb reagieren hoch bewertete Aktien so heftig auf Nachrichten, die sich in keiner Quartalszahl niederschlagen: Ihr Preis besteht überwiegend aus Zukunft.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Für die eigene Anlage weniger, als die Schlagzeile nahelegt. Wer ASML einzeln hält, hat gestern gesehen, was Einzelwertrisiko konkret bedeutet: Ein Bericht eines einzelnen Mediums, den niemand nachprüfen kann, bewegt an einem Vormittag mehr, als eine solide Dividende in einem Jahr einbringt. Wer den Wert über einen breiten Index hält, hat den Tag kaum bemerkt.',
      },
      {
        type: 'paragraph',
        text: 'Die nützliche Frage ist nicht, ob China es schafft – das weiß heute niemand. Sie lautet, wie viel vom eigenen Vermögen an dieser einen Frage hängt.',
      },
    ],
  },
  {
    slug: 'chip-abverkauf-laeuft-durch-drei-zeitzonen',
    title: 'Ein Bericht, drei Zeitzonen: wie sich der Chip-Abverkauf fortpflanzte',
    metaTitle: 'Chip-Abverkauf in drei Zeitzonen: Amsterdam, New York, Tokio',
    teaser:
      'Von Amsterdam über New York nach Tokio: Dieselbe Meldung drückte binnen eines Tages Kurse auf drei Kontinenten. Über Streuung sagt das etwas Unbequemes.',
    category: 'Märkte',
    publishedAt: '2026-07-28T07:00:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Halbleiter', 'Streuung', 'Klumpenrisiko', 'Nvidia'],
    relatedTopics: ['portfolio-aufbau', 'etf', 'aktien-laender-branchen'],
    relatedSymbols: ['nvidia', 'micron', 'nikkei-225'],
    sources: [
      {
        label:
          'MarketScreener: Stock Market Today – Chip Stocks Fall, Dragging Down Nasdaq',
        url: 'https://www.marketscreener.com/news/stock-market-today-chip-stocks-fall-dragging-down-nasdaq-ce7f51dcd180f32c',
      },
      {
        label: 'MarketScreener: Japans Nikkei fällt nach Chip-Abverkauf',
        url: 'https://de.marketscreener.com/boerse-nachrichten/japans-nikkei-faellt-nach-chip-abverkauf-ce7f51ddd980f42c',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Bericht über chinesische Lithografieanlagen erschien am Montag. Sein Weg um die Welt lässt sich fast auf die Stunde nachzeichnen – und er ist lehrreicher als die Meldung selbst.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Amsterdam, Vormittag.** ASML gibt frühe Gewinne ab und rutscht zeitweise 8,5 Prozent ins Minus. Der europäische Chipsektor folgt.',
          '**New York, Nachmittag.** Der Verkaufsdruck erreicht die US-Werte: Nvidia verliert mehr als 5 Prozent, Micron über 5,5 Prozent, SanDisk fast 12 Prozent. Der Nasdaq schließt 0,2 Prozent tiefer.',
          '**Tokio, Nacht.** Der japanische Markt startet schwach in den Dienstag; als Grund gelten ausdrücklich die Verluste im Nasdaq und im Philadelphia-Halbleiterindex.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was das über Streuung sagt',
      },
      {
        type: 'paragraph',
        text: 'Die übliche Empfehlung lautet, über Länder zu streuen. Dieser Tag zeigt die Grenze davon: Ein niederländischer, ein amerikanischer und ein japanischer Wert fielen aus demselben Grund. Nicht weil sie im selben Land sitzen – sie tun es nicht –, sondern weil sie in derselben Lieferkette stehen.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Ländergrenzen sind nicht die Bruchlinie',
        items: [
          'Ein Halbleiterhersteller in Taiwan, sein Ausrüster in den Niederlanden und sein Kunde in Kalifornien reagieren auf dieselbe Nachricht.',
          'Ein weltweiter Aktienindex enthält sie alle – die Streuung über 23 Länder hilft an einem solchen Tag wenig, wenn eine einzige Branche schwer wiegt.',
          'Wer wissen will, wie stark er betroffen ist, schaut nicht auf die Länderliste seines Fonds, sondern auf die Branchengewichtung und die zehn größten Positionen.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Das heißt nicht, dass Streuung nicht wirkt',
      },
      {
        type: 'paragraph',
        text: 'Sie wirkte auch am Montag – nur an anderer Stelle. Während die Chipwerte fielen, stieg der Dow Jones um ein halbes Prozent, weil Öl deutlich billiger wurde und das andere Branchen entlastet. Genau das ist der Zweck: nicht, dass nichts fällt, sondern dass nicht alles zugleich fällt.',
      },
      {
        type: 'paragraph',
        text: 'Die praktische Folgerung ist unspektakulär. Wer breit anlegt, sollte einmal nachsehen, welchen Anteil Technologie in seinem Depot tatsächlich hat – in vielen weltweiten Indizes ist er über die Jahre still gewachsen, ohne dass jemand eine Entscheidung dafür getroffen hätte.',
      },
    ],
  },
  {
    slug: 'dow-steigt-nasdaq-faellt-am-selben-tag',
    title: 'Dow steigt, Nasdaq fällt – am selben Tag, im selben Markt',
    teaser:
      'Der Dow legte 0,5 Prozent zu, der Nasdaq verlor 0,2 Prozent, der S&P 500 bewegte sich kaum. Drei Zahlen, ein Handelstag – und ein Missverständnis.',
    category: 'Märkte',
    publishedAt: '2026-07-28T07:15:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Dow Jones', 'Nasdaq', 'S&P 500', 'Index'],
    relatedTopics: ['wie-funktioniert-der-markt', 'etf', 'aktie'],
    relatedSymbols: ['dow-jones', 'nasdaq-100', 'sp500'],
    sources: [
      {
        label:
          'Proactive Investors: Dow closes higher as oil tumbles, Nasdaq slips with Nvidia leading chip selloff',
        url: 'https://www.proactiveinvestors.com/companies/news/1096070/dow-jones-and-nasdaq-make-solid-start-to-massive-week-as-oil-tumbles-1096070.html',
      },
      {
        label:
          'Yahoo Finance: Stock market today – Dow rises, Nasdaq slips as Nvidia leads chip stocks lower (27.07.2026)',
        url: 'https://finance.yahoo.com/markets/live/stock-market-today-monday-july-27-dow-sp-500-nasdaq-080412540.html',
      },
    ],
    body: [
      {
        type: 'keyfacts',
        items: [
          { label: 'Dow Jones', value: '52.210 Punkte, plus 263 (0,5 %)' },
          { label: 'S&P 500', value: '7.413 Punkte, plus 1,2 Punkte' },
          { label: 'Nasdaq Composite', value: '24.932 Punkte, minus 44 (0,2 %)' },
        ],
      },
      {
        type: 'paragraph',
        text: 'Wer am Montagabend wissen wollte, wie die amerikanische Börse gelaufen ist, bekam drei verschiedene Antworten. Alle drei stimmen. Sie messen nur verschiedene Dinge.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Drei Indizes, drei Bauweisen',
      },
      {
        type: 'table',
        caption: 'Was hinter den Namen steckt',
        head: ['Index', 'Enthält', 'Gewichtet nach'],
        rows: [
          [
            'Dow Jones',
            '30 große US-Unternehmen, von Hand ausgewählt',
            'Kurs je Aktie – eine teure Aktie zählt mehr',
          ],
          ['S&P 500', '500 große US-Unternehmen nach festen Regeln', 'Börsenwert'],
          [
            'Nasdaq Composite',
            'Alle an der Nasdaq notierten Werte, überwiegend Technologie',
            'Börsenwert',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Daraus erklärt sich der Montag von selbst. Der Chip-Abverkauf traf den technologielastigen Nasdaq voll, ließ den Dow mit seinen dreißig Industrie-, Konsum- und Finanzwerten weitgehend kalt – und im S&P 500 hoben sich beide Kräfte fast genau auf, weshalb dort am Ende 1,2 Punkte Zuwachs standen.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Der Dow ist der eigenartigste der drei',
        items: [
          'Er gewichtet nach dem **Kurs je Aktie**, nicht nach der Größe des Unternehmens. Eine Aktie zu 500 Dollar bewegt ihn zehnmal so stark wie eine zu 50 Dollar – auch wenn das zweite Unternehmen dreimal so viel wert ist.',
          'Das ist ein Überbleibsel aus dem Jahr 1896, als man Kurse noch mit Bleistift addierte.',
          'Für die Frage „wie lief der US-Markt?" ist der S&P 500 deshalb die bessere Zahl, obwohl der Dow öfter genannt wird.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Wer einen Index als Vergleichsmaßstab für das eigene Depot nimmt, sollte wissen, wogegen er sich misst. Ein technologielastiges Depot mit dem Dow zu vergleichen, schmeichelt in guten Technologiejahren und wirkt in schlechten wie ein Versagen – beides hat mit der eigenen Leistung nichts zu tun, sondern mit der Wahl des Maßstabs.',
      },
    ],
  },
  {
    slug: 'fed-hebt-eigene-inflationsprognose-auf-36-prozent',
    title: 'Die Fed hat ihre eigene Inflationsprognose kräftig angehoben',
    metaTitle: 'Fed hebt Inflationsprognose von 2,7 auf 3,6 Prozent',
    teaser:
      'Von 2,7 auf 3,6 Prozent für das laufende Jahr – und neun von achtzehn Sitzungsteilnehmern erwarten inzwischen eine Zinserhöhung. Ein Blick auf diese Zahl lohnt.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-28T07:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Fed', 'PCE', 'Inflation', 'Leitzins'],
    relatedTopics: ['notenbanken-geldpolitik', 'inflation', 'tagesgeld'],
    relatedSymbols: ['eur-usd', 'sp500', 'gold'],
    sources: [
      {
        label: 'Yahoo Finanzen: Neun Fed-Vertreter kündigen Zinserhöhung für 2026 an',
        url: 'https://de.finance.yahoo.com/nachrichten/warsh-warnt-neun-fed-vertreter-180221098.html',
      },
      {
        label: 'LBBW: Fed-Zinsentscheid – aktueller Leitzins und Prognose 2026',
        url: 'https://www.lbbw.de/artikel/maerkte-verstehen/fed-zinsentscheid-leitzins-prognosen_ait4a5bv66_d.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Fed-Sitzung beginnt an diesem Dienstag, die Entscheidung kommt am Mittwoch um 20:00 Uhr deutscher Zeit. Dass der Leitzins bei 3,50 bis 3,75 Prozent bleibt, ist weitgehend eingepreist. Wir haben vergangene Woche beschrieben, warum der Dot Plot dabei die interessantere Größe ist als der Zinssatz. Eine Zahl aus derselben Juni-Sitzung ist dabei bisher untergegangen.',
      },
      {
        type: 'keyfacts',
        items: [
          { label: 'PCE-Prognose der Fed für 2026, bisher', value: '2,7 Prozent' },
          { label: 'PCE-Prognose der Fed für 2026, seit Juni', value: '3,6 Prozent' },
          { label: 'Teilnehmer, die 2026 eine Erhöhung erwarten', value: '9 von 18' },
          { label: 'Beschluss im Juni', value: 'unverändert, einstimmig 12 zu 0' },
        ],
      },
      {
        type: 'paragraph',
        text: 'Die Notenbank hat ihre eigene Erwartung für die Teuerung im laufenden Jahr um 0,9 Prozentpunkte angehoben – von 2,7 auf 3,6 Prozent. Gemessen an ihrem Ziel von zwei Prozent ist das keine Feinjustierung, sondern eine Korrektur um fast die Hälfte des Zielwerts. Zugleich verschwand der Hinweis auf eine mögliche Lockerung aus der Erklärung.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'PCE, nicht CPI – und warum das nicht dasselbe ist',
      },
      {
        type: 'paragraph',
        text: 'In den Nachrichten steht meist die Verbraucherpreisinflation, der CPI. Die Fed steuert aber nach einer anderen Größe: dem **PCE-Deflator**, der Preisentwicklung der privaten Konsumausgaben. Beide messen Teuerung, kommen aber regelmäßig zu unterschiedlichen Zahlen – der PCE liegt meist etwas niedriger.',
      },
      {
        type: 'table',
        caption: 'Zwei Inflationsmaße, zwei Bauweisen',
        head: ['', 'CPI (Verbraucherpreise)', 'PCE (Konsumausgaben)'],
        rows: [
          [
            'Warenkorb',
            'Fest, wird nur selten angepasst',
            'Wird laufend angepasst, wenn Haushalte ihr Verhalten ändern',
          ],
          [
            'Erfasst',
            'Was Haushalte selbst bezahlen',
            'Zusätzlich, was für sie bezahlt wird – etwa Gesundheitskosten über Versicherungen',
          ],
          ['Gewicht der Wohnkosten', 'Hoch', 'Deutlich niedriger'],
          [
            'Wird genutzt von',
            'Öffentlichkeit, Rentenanpassungen, Verträge',
            'Der Notenbank für ihr Zwei-Prozent-Ziel',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum die Fed den PCE bevorzugt',
        items: [
          'Weil er Substitution abbildet: Wird Rindfleisch teuer und die Leute kaufen Hühnchen, sieht der PCE das, der feste Warenkorb des CPI nicht.',
          'Das ist keine Beschönigung, sondern eine andere Frage – der CPI misst die Kosten eines gleichbleibenden Korbs, der PCE die Kosten des tatsächlichen Konsums.',
          'Für die eigene Haushaltsrechnung ist der CPI der ehrlichere Maßstab. Für die Frage, was die Notenbank tun wird, der PCE.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Eine Notenbank, die ihre eigene Inflationsprognose deutlich anhebt, hat zwei Möglichkeiten: Sie hält die Zinsen länger hoch, oder sie akzeptiert, dass sie ihr Ziel länger verfehlt. Beides ist für Sparer keine schlechte Nachricht und für Kreditnehmer keine gute – nur ist es das Gegenteil dessen, worauf sich die Märkte über Jahre eingerichtet hatten.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die Zahl ist eine Prognose, kein Ergebnis',
        items: [
          'Notenbankprognosen sind in der Vergangenheit regelmäßig danebengelegen – in beide Richtungen.',
          'Für einen Sparplan über Jahrzehnte folgt daraus nichts. Für die Frage, ob man Geld heute für fünf Jahre festlegt, schon.',
        ],
      },
    ],
  },
  {
    slug: 'wer-die-fed-fuehrt-und-warum-das-fuer-sparer-zaehlt',
    title: 'Wer die Fed führt – und warum das auch deutsche Sparer angeht',
    teaser:
      'Seit Mai leitet Kevin Warsh die US-Notenbank, bestätigt mit der knappsten Mehrheit ihrer Geschichte. Was für die eigene Anlage zählt, ist nicht die Person.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-28T07:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Fed', 'Notenbank', 'Unabhängigkeit', 'Inflation'],
    relatedTopics: ['notenbanken-geldpolitik', 'inflation', 'waehrungen-wechselkurse'],
    relatedSymbols: ['eur-usd', 'gold'],
    sources: [
      {
        label: 'CNBC: Kevin Warsh to be sworn in as Federal Reserve chair',
        url: 'https://www.cnbc.com/2026/05/18/kevin-warsh-trump-federal-reserve-chair.html',
      },
      {
        label:
          'CNN Business: Kevin Warsh sworn in as Fed chair at pivotal moment for US economy',
        url: 'https://www.cnn.com/2026/05/22/economy/kevin-warsh-sworn-in-fed-chair',
      },
      {
        label: 'Al Jazeera: Kevin Warsh sworn in as new US Fed chair',
        url: 'https://www.aljazeera.com/economy/2026/5/22/kevin-warsh-sworn-in-as-new-us-fed-chair',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Am 22. Mai 2026 wurde Kevin Warsh als siebzehnter Vorsitzender der US-Notenbank vereidigt und trat damit die Nachfolge von Jerome Powell an. Der Senat hatte ihn neun Tage zuvor mit 54 zu 45 Stimmen bestätigt – die knappste Bestätigung, die es für dieses Amt je gab. Seine Amtszeit läuft bis Mai 2030. Die Sitzung, die an diesem Dienstag beginnt, ist seine zweite.',
      },
      {
        type: 'paragraph',
        text: 'Personalfragen einer fremden Notenbank wirken weit weg. Sie sind es nicht: Der Dollar ist die Währung, in der Öl, Gold und ein großer Teil des Welthandels abgerechnet werden, und der amerikanische Leitzins bestimmt mit, was Kapital weltweit kostet. Wer einen weltweiten Aktienindex hält, hält zu rund zwei Dritteln amerikanische Unternehmen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum Unabhängigkeit keine Formalie ist',
      },
      {
        type: 'paragraph',
        text: 'Eine Notenbank hat eine unangenehme Aufgabe: Sie muss die Zinsen manchmal genau dann erhöhen, wenn es politisch am teuersten ist – vor einer Wahl, in einer Abschwächung, gegen den erklärten Wunsch der Regierung. Damit sie das kann, ist sie in den meisten Ländern rechtlich unabhängig.',
      },
      {
        type: 'paragraph',
        text: 'Der Grund dafür ist keine Ideologie, sondern eine Erfahrung. Notenbanken, die politischem Druck nachgeben, verlieren ihre Glaubwürdigkeit – und mit ihr das wirksamste Instrument, das sie haben. Solange alle darauf vertrauen, dass die Inflation mittelfristig zum Ziel zurückkehrt, wird ein Preisschub als vorübergehend behandelt und nicht in Löhne und Kalkulationen eingebaut. Geht dieses Vertrauen verloren, muss es mit sehr viel höheren Zinsen zurückgekauft werden. Genau das geschah in den USA Anfang der achtziger Jahre, zum Preis einer schweren Rezession.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Woran man das im Alltag merkt',
        items: [
          'An den Renditen langlaufender Staatsanleihen: Sie enthalten die Inflation, mit der Anleger für die nächsten zehn Jahre rechnen.',
          'Am Wechselkurs: Eine Währung, deren Notenbank als beeinflussbar gilt, verliert gegenüber anderen an Wert.',
          'Am Goldpreis, der historisch dann steigt, wenn das Vertrauen in Papierwährungen nachlässt.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Nicht, den Kurs eines Notenbankchefs zu handeln – wer das versucht, wettet gegen Marktteilnehmer, die dieselben Reden hören und schneller sind. Wohl aber, die eigene Anlage nicht auf eine einzige Währung zu stellen. Ein weltweit anlegender Index tut das automatisch; ein Depot, das nur aus Euro-Anleihen oder nur aus US-Technologie besteht, tut es nicht.',
      },
    ],
  },
  {
    slug: 'dax-schliesst-auf-hoechstem-stand-seit-drei-wochen',
    title: 'DAX schließt auf 25.361 Punkten – 36 von 40 Werten im Plus',
    teaser:
      'Der deutsche Leitindex gewann am Montag ein Prozent. Die aussagekräftigere Zahl ist nicht das Prozent, sondern wie viele Werte den Anstieg getragen haben.',
    category: 'Märkte',
    publishedAt: '2026-07-28T07:50:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['DAX', 'Marktbreite', 'Index', 'Handelstag'],
    relatedTopics: ['boerse', 'wie-funktioniert-der-markt', 'aktie'],
    relatedSymbols: ['dax', 'euro-stoxx-50'],
    sources: [
      {
        label: 'Handelsblatt: Dax schließt auf höchstem Stand seit fast drei Wochen',
        url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-schliesst-auf-hoechstem-stand-seit-fast-drei-wochen/100243054.html',
      },
      {
        label: 'finanzen.net: Aufschläge in Frankfurt – DAX klettert zum Handelsende',
        url: 'https://www.finanzen.net/nachricht/aktien/aufschlaege-in-frankfurt-dax-klettert-zum-handelsende-15825201',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der DAX schloss am Montag ein Prozent höher bei 25.361 Punkten – der höchste Schlussstand seit fast drei Wochen. Getragen wurde der Anstieg von der vorläufigen Waffenpause zwischen den USA und Iran und den daraufhin deutlich gefallenen Energiepreisen.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Ein Hinweis zu unserer eigenen Meldung von gestern',
        items: [
          'Am Montagmittag stand hier „DAX springt auf 25.500 Punkte“. Der Schlussstand lautet 25.361.',
          'Beides ist richtig: Das eine war der Stand während des Handels, das andere der Schluss. Zwischen Höchstkurs und Schlusskurs eines Tages liegen regelmäßig ein bis zwei Prozent.',
          'Wer Kurse vergleicht, sollte deshalb immer wissen, welche Sorte er vor sich hat – die meisten Charts und Statistiken arbeiten mit Schlusskursen.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die Zahl hinter der Zahl',
      },
      {
        type: 'paragraph',
        text: 'Von den 40 DAX-Werten schlossen 36 im Plus. Diese Angabe heißt **Marktbreite**, und sie beantwortet eine Frage, die das Indexprozent offenlässt: Steigt der Markt, oder steigen ein paar große Werte und ziehen den Rest optisch mit?',
      },
      {
        type: 'table',
        caption: 'Ein Prozent Plus – zwei sehr verschiedene Tage',
        head: ['', 'Breiter Anstieg', 'Schmaler Anstieg'],
        rows: [
          ['Werte im Plus', '36 von 40', 'etwa 12 von 40'],
          [
            'Ursache',
            'Etwas betrifft alle – Zinsen, Energie, Konjunktur',
            'Einzelne Schwergewichte, oft nach Quartalszahlen',
          ],
          [
            'Was es aussagt',
            'Die Lageeinschätzung hat sich verschoben',
            'Über den Markt insgesamt wenig',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Der Montag war eindeutig der erste Fall. Ein billigerer Ölpreis senkt Kosten für Chemie, Verkehr, Industrie und Konsum zugleich – deshalb stiegen fast alle.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Für die eigene Anlage nichts, was heute zu tun wäre. Aber die Marktbreite ist eine der wenigen Zusatzangaben, die in fast jedem Börsenbericht steht und die tatsächlich etwas erklärt. Wer sie mitliest, versteht schneller, ob eine Bewegung ein Thema hat oder nur einen Namen.',
      },
    ],
  },
  {
    slug: 'bitcoin-faellt-nach-etf-abfluessen-auf-64000-dollar',
    title: 'Bitcoin bei 64.000 Dollar – 240 Millionen flossen aus den ETFs ab',
    teaser:
      'Der Kurs bewegte sich binnen 24 Stunden in einer Spanne von rund 1.700 Dollar. Auffällig ist nicht der Kurs, sondern woher der Verkaufsdruck kam.',
    category: 'Geldanlage',
    publishedAt: '2026-07-28T08:00:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Bitcoin', 'ETF', 'Kryptowährung', 'Volatilität'],
    relatedTopics: ['bitcoin-krypto', 'etf', 'risiko-und-rendite'],
    relatedSymbols: ['bitcoin', 'ethereum'],
    sources: [
      {
        label:
          'wallstreetONLINE: Bitcoin Prognose Juli 2026 – BTC bei 64.000 Dollar nach 240 Millionen an ETF-Abflüssen (28.07.2026)',
        url: 'https://www.wallstreet-online.de/nachricht/21157712-bitcoin-prognose-juli-2026-btc-64-000-dollar-240-millionen-etf-abfluessen',
      },
      {
        label:
          'wallstreetONLINE: Bitcoin Kurs heute – BTC rutscht unter 64.000 Dollar (26.07.2026)',
        url: 'https://www.wallstreet-online.de/nachricht/21152366-bitcoin-kurs-heute-btc-rutscht-64-000-dollar-28-juli-entscheidet-fed',
      },
    ],
    body: [
      {
        type: 'keyfacts',
        items: [
          { label: 'Bitcoin', value: 'rund 64.000 bis 64.600 US-Dollar' },
          { label: 'Spanne der letzten 24 Stunden', value: 'etwa 1.700 US-Dollar' },
          {
            label: 'Krypto-Marktkapitalisierung',
            value: '2,28 Billionen Dollar, minus 1,1 Prozent',
          },
          { label: 'Bitcoin-Anteil daran', value: '56,4 Prozent' },
        ],
      },
      {
        type: 'paragraph',
        text: 'Bitcoin pendelt vor dem Zinsentscheid am Mittwoch um die Marke von 64.000 Dollar. Genannt wird als Grund für den Druck ein Abfluss von rund 240 Millionen Dollar aus den amerikanischen Spot-ETFs.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was ein ETF-Abfluss überhaupt ist',
      },
      {
        type: 'paragraph',
        text: 'Ein Spot-ETF auf Bitcoin hält echte Bitcoin. Kaufen mehr Anleger Anteile, als verkaufen, muss der Fonds Bitcoin nachkaufen; überwiegen die Verkäufe, muss er welche abgeben. Der Nettobetrag dieser Bewegung heißt Zufluss oder Abfluss – und im Unterschied zu Käufen und Verkäufen zwischen Anlegern an der Börse landet er tatsächlich am Markt.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum das den Kurs anders bewegt',
        items: [
          'Wenn zwei Anleger an der Börse Anteile tauschen, ändert sich am Bestand des Fonds nichts – es wechselt nur der Besitzer.',
          'Ein **Abfluss** dagegen bedeutet, dass der Fonds selbst Bitcoin verkauft. Das ist zusätzliches Angebot, das vorher nicht da war.',
          'Deshalb werden diese Zahlen seit Zulassung der Spot-ETFs täglich verfolgt: Sie sind einer der wenigen halbwegs messbaren Indikatoren für die Nachfrage einer sonst schwer greifbaren Anlegergruppe.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die Größenordnung einordnen',
      },
      {
        type: 'paragraph',
        text: '240 Millionen Dollar klingen nach viel und sind es im Verhältnis nicht: Der gesamte Kryptomarkt kommt auf 2,28 Billionen Dollar. Der Abfluss entspricht rund einem Zehntausendstel davon. Dass er trotzdem als Erklärung genannt wird, sagt mehr über die Dünne des Marktes an einem ruhigen Julitag als über die Summe.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Vorsicht mit Kausalerklärungen',
        items: [
          'Ein Kurs fällt, ein Abfluss wird gemeldet, und beides wird zu einer Geschichte verbunden. Ob das eine das andere verursacht hat, weiß niemand.',
          'Eine Spanne von 1.700 Dollar in 24 Stunden entspricht rund 2,7 Prozent – für Bitcoin ein unauffälliger Tag, für einen breiten Aktienindex ein sehr bewegter.',
          'Wer Kryptowährungen hält, sollte diesen Unterschied im Anteil am Gesamtvermögen abbilden, nicht in der Häufigkeit des Nachschauens.',
        ],
      },
    ],
  },
  {
    slug: 'mercedes-benz-und-die-dichteste-berichtswoche-des-jahres',
    title: 'Mercedes-Benz eröffnet die dichteste Berichtswoche des Jahres',
    metaTitle: 'Mercedes-Benz, Boeing, Visa: Zahlen am Dienstag',
    teaser:
      'Heute legen Mercedes-Benz, Coca-Cola, Boeing und Visa Zahlen vor, Mittwoch Microsoft, Donnerstag Apple. Warum gute Zahlen den Kurs drücken können.',
    category: 'Märkte',
    publishedAt: '2026-07-28T08:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Quartalszahlen', 'Mercedes-Benz', 'Berichtssaison', 'Erwartungen'],
    relatedTopics: ['aktie', 'anlegerpsychologie', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['mercedes-benz', 'coca-cola', 'boeing', 'visa'],
    sources: [
      {
        label: 'boersennews: Wochenvorschau KW 31 – rekorddichte Berichtswoche',
        url: 'https://www.boersennews.de/nachrichten/service/community/wochenvorschau-kw-31-rekorddichte-berichtswoche-apple-microsoft-meta-und-der-fed-entscheid/5220495/',
      },
      {
        label:
          'TradingKey: Die kommende Woche – Fed-Zinsentscheidung im Fokus, Quartalszahlen von Apple, Microsoft, Meta und Amazon',
        url: 'https://www.tradingkey.com/de/analysis/stocks/us-stocks/262054306-weekly-preview-fed-apple-microsoft-meta-amazon-earnings-reports-tradingkey',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'An diesem Dienstag legen in Europa Mercedes-Benz, Barclays und Unilever ihre Halbjahreszahlen vor, in den USA berichten Coca-Cola, Boeing, Visa und PayPal. Am Mittwoch folgt Microsoft, am Donnerstag nach US-Börsenschluss Apple und Amazon. Dazwischen liegt am Mittwochabend der Zinsentscheid der Fed.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum ein Kurs nach Rekordzahlen fallen kann',
      },
      {
        type: 'paragraph',
        text: 'Es ist der häufigste Moment, in dem die Börse unlogisch wirkt: Ein Unternehmen meldet den höchsten Gewinn seiner Geschichte, und die Aktie verliert fünf Prozent. Erklärt ist das schnell, wenn man einen Schritt zurücktritt.',
      },
      {
        type: 'paragraph',
        text: 'Der Kurs vor der Veröffentlichung enthält bereits, was der Markt erwartet. Analysten schätzen, Anleger positionieren sich, und beides ist im Preis. Was den Kurs bewegt, ist deshalb nicht das Ergebnis, sondern die **Abweichung** vom Erwarteten – und der Ausblick auf die kommenden Quartale, der oft schwerer wiegt als die Zahlen selbst.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Drei Dinge, die den Kurs nach Zahlen bewegen',
        items: [
          '**Die Abweichung.** Ein Gewinn über der Schätzung ist gut, einer unter der Schätzung schlecht – unabhängig davon, ob er absolut hoch oder niedrig ist.',
          '**Der Ausblick.** Senkt ein Unternehmen seine Prognose fürs Gesamtjahr, hilft ein starkes Quartal wenig.',
          '**Die Qualität.** Ein Gewinn aus dem laufenden Geschäft wird anders bewertet als einer aus einem Grundstücksverkauf. Deshalb lohnt der Blick auf den operativen Cashflow.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Wer breit gestreut anlegt, muss diese Woche nichts tun – in einem Weltindex gleichen sich Enttäuschungen und Überraschungen weitgehend aus. Wer einzelne Aktien hält, sollte wissen, dass die Tage um eine Veröffentlichung die schwankungsreichsten des Quartals sind. Wer in dieser Woche ohnehin kaufen oder verkaufen wollte, hat einen sachlichen Grund, es vor oder nach dem Termin zu tun statt am Tag selbst.',
      },
    ],
  },
  {
    slug: 'inflationsdaten-am-donnerstag-gesamtrate-und-kernrate',
    title: 'Inflationsdaten am Donnerstag: auf welche Zahl es ankommt',
    teaser:
      'Am 30. Juli kommt die Schnellschätzung für Juli. Für die Notenbanken zählt dabei nicht die Zahl in den Schlagzeilen, sondern eine zweite daneben.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-28T08:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Inflation', 'Kerninflation', 'HVPI', 'EZB'],
    relatedTopics: ['inflation', 'notenbanken-geldpolitik', 'tagesgeld'],
    relatedSymbols: ['eur-usd', 'dax'],
    sources: [
      {
        label: 'LBBW: Fed und EZB Zinsentscheid – das bewegt Märkte im Juli 2026',
        url: 'https://www.lbbw.de/artikel/maerkte-verstehen/termine-juli-2026_am4innwm2g_d.html',
      },
      {
        label: 'Deutsche Bundesbank: Harmonisierter Verbraucherpreisindex',
        url: 'https://www.bundesbank.de/de/statistiken/konjunktur-und-preise/harmonisierter-verbraucherpreisindex/harmonisierter-verbraucherpreisindex-927952',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Am Donnerstag, dem 30. Juli, veröffentlicht das Statistische Bundesamt die vorläufigen Ergebnisse des harmonisierten Verbraucherpreisindex für Juli. Für den Euroraum erwartet die LBBW einen leichten Rückgang auf 2,7 Prozent bei einer unveränderten Kernrate von 2,4 Prozent. Im selben Zeitraum kommen die BIP-Zahlen für das zweite Quartal.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Zwei Raten, zwei Fragen',
      },
      {
        type: 'table',
        caption: 'Gesamtrate und Kernrate im Vergleich',
        head: ['', 'Gesamtrate', 'Kernrate'],
        rows: [
          ['Enthält', 'Alles im Warenkorb', 'Alles außer Energie und Nahrungsmitteln'],
          [
            'Beantwortet',
            'Wie viel teurer ist das Leben geworden?',
            'Hat sich die Teuerung in der Breite festgesetzt?',
          ],
          [
            'Schwankt',
            'Stark – Energiepreise bewegen sich sprunghaft',
            'Träge, dafür hartnäckig',
          ],
          ['Wichtig für', 'Den Haushalt', 'Die Notenbank'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die Kernrate lässt ausgerechnet das weg, was für viele Haushalte am meisten zählt – Heizung, Tanken, Lebensmittel. Als Aussage über die Lebenshaltungskosten taugt sie deshalb nicht. Ihr Zweck ist ein anderer: Energiepreise werden von Wetter, Kriegen und Förderquoten getrieben, also von Dingen, auf die ein Leitzins keinen Einfluss hat. Wer wissen will, ob die Teuerung im Rest der Wirtschaft angekommen ist, muss sie herausrechnen.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Der häufigste Lesefehler',
        items: [
          'Eine **fallende** Inflationsrate bedeutet nicht, dass etwas billiger wird. Sie bedeutet, dass es langsamer teurer wird.',
          'Der Preisanstieg der Vorjahre bleibt vollständig im System – er wird nicht zurückgenommen.',
          'Deshalb passt „Entspannung bei der Inflation“ in den Nachrichten widerspruchsfrei zu „im Supermarkt ist alles teuer“.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Für die eigene Anlage ist die Inflationsrate keine Handlungsaufforderung, sondern die Messlatte. Erst was über ihr liegt, ist ein echter Zuwachs – ein Tagesgeldzins von zwei Prozent bei 2,7 Prozent Inflation lässt das Konto wachsen und die Kaufkraft schrumpfen. Genau diese Rechnung führt das Lernthema Inflation Schritt für Schritt vor.',
      },
    ],
  },
  // ------------------------------------------------------------------ 27.07.
  {
    slug: 'dax-springt-nach-waffenpause-auf-25500-punkte',
    title: 'DAX springt auf 25.500 Punkte – und niemand konnte dabei sein',
    metaTitle: 'DAX auf 25.500 Punkte: höchster Stand seit drei Wochen',
    teaser:
      'Nach der Waffenpause eröffnet der DAX mit einer Kurslücke und steigt auf den höchsten Stand seit fast drei Wochen. Handeln ließ sich der Sprung nicht.',
    category: 'Märkte',
    publishedAt: '2026-07-27T13:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['DAX', 'Kurslücke', 'Markttiming', 'Geopolitik'],
    relatedTopics: ['boerse', 'wann-kaufen-verkaufen', 'anlegerpsychologie'],
    relatedSymbols: ['dax', 'euro-stoxx-50'],
    sources: [
      {
        label: 'wallstreetONLINE: DAX – Gap-up! (27.07.2026)',
        url: 'https://www.wallstreet-online.de/nachricht/21154226-dax-gap-up',
      },
      {
        label: 'Handelsblatt: Dax erreicht den höchsten Stand seit fast drei Wochen',
        url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-erreicht-den-hoechsten-stand-seit-fast-drei-wochen/100243054.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der DAX ist am Montag mit einer deutlichen Kurslücke in die Woche gestartet. Am Freitag schloss er bei 25.069 Punkten, vorbörslich notierte er bereits um 25.350; bis zum Mittag stand ein Plus von rund 1,6 Prozent auf etwa 25.500 Punkte – der höchste Stand seit fast drei Wochen. Auslöser ist die Waffenpause zwischen den USA und Iran: Nach dreizehn aufeinanderfolgenden Nächten mit Luftangriffen haben beide Seiten ihre Angriffe über das Wochenende ausgesetzt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was eine Kurslücke ist – und warum sie hier alles erklärt',
      },
      {
        type: 'paragraph',
        text: 'Zwischen dem Freitagsschluss und der Montagseröffnung wurde in Frankfurt nicht gehandelt. Die Nachricht kam am Wochenende, verarbeitet wurde sie in der ersten Sekunde des Montagshandels. Der Kurs sprang von 25.069 auf über 25.300, **ohne dass es dazwischen einen Preis gab**. Eine solche Lücke heißt Gap.',
      },
      {
        type: 'paragraph',
        text: 'Das ist mehr als eine Feinheit der Kursdarstellung. Wer am Freitag verkauft hatte – aus welchem guten Grund auch immer –, war bei diesem Sprung nicht dabei und konnte auch nicht mehr einsteigen: Der günstige Kurs existierte nie. Eine Stop-Loss-Order, die bei 25.000 Punkten verkaufen sollte, hätte bei einer Lücke nach unten genauso wenig zum gewünschten Preis ausgelöst.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum Markttiming daran scheitert',
        items: [
          'Ein erheblicher Teil der langfristigen Aktienrendite entsteht an wenigen einzelnen Handelstagen – und die sind vorher nicht erkennbar. Der heutige gehört dazu.',
          'Diese Tage folgen typischerweise auf schlechte Nachrichten, also genau auf die Phasen, in denen der Ausstieg am naheliegendsten wirkt.',
          'Wer investiert bleibt, muss nichts prognostizieren. Wer aussteigt, muss zweimal richtig liegen: beim Ausstieg und beim Wiedereinstieg.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Eine Waffenpause ist keine Lösung',
      },
      {
        type: 'paragraph',
        text: 'Ausgesetzt ist nicht beendet. Der Markt preist heute die Hoffnung auf eine diplomatische Lösung ein, nicht die Lösung selbst. Kehrt der Konflikt zurück, kann dieselbe Bewegung in einer einzigen Eröffnung wieder verschwinden – dann als Lücke nach unten.',
      },
    ],
  },
  {
    slug: 'oelpreis-bricht-nach-der-waffenpause-ein',
    title: 'Ölpreis bricht ein – und liegt trotzdem 50 Prozent über Jahresbeginn',
    metaTitle: 'Ölpreis nach Waffenpause: Brent fällt um neun Prozent',
    teaser:
      'Brent verliert zeitweise neun Prozent auf rund 88 Dollar, WTI fällt ähnlich stark. Der Blick auf ein Tagesminus verdeckt, wo der Preis herkommt.',
    category: 'Märkte',
    publishedAt: '2026-07-27T12:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Brent', 'WTI', 'Rohöl', 'Erdgas', 'Rohstoffe'],
    relatedTopics: ['rohstoffe', 'inflation', 'risiko-und-rendite'],
    relatedSymbols: ['brent', 'wti', 'erdgas'],
    sources: [
      {
        label:
          'wallstreetONLINE: Eskalation gestoppt – Ölpreis fällt nach Waffenpause (27.07.2026)',
        url: 'https://www.wallstreet-online.de/nachricht/21153272-eskalation-gestoppt-oelpreis-faellt-waffenpause-usa-iran',
      },
      {
        label: 'Handelsblatt: Preise für Öl und Gas fallen nach Pause der US-Angriffe',
        url: 'https://www.handelsblatt.com/finanzen/maerkte/devisen-rohstoffe/iran-krieg-preise-fuer-oel-und-gas-fallen-nach-pause-der-us-angriffe-deutlich/100243031.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Rohöl der Sorte Brent verlor am Montag im frühen Handel 4,1 Prozent auf 92,12 US-Dollar je Barrel und rutschte zeitweise um mehr als sieben Prozent unter die Marke von 90 Dollar; am Mittag lag der September-Kontrakt rund neun Prozent tiefer bei etwa 88 Dollar. Die US-Sorte WTI gab um 4,5 Prozent auf 84,72 Dollar nach. Auch die Gaspreise fielen deutlich.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Bezugspunkt entscheidet über die Aussage',
      },
      {
        type: 'paragraph',
        text: 'Neun Prozent an einem Tag klingen nach einer Wende. Gemessen am Jahresanfang notiert Brent trotz dieses Einbruchs immer noch **mehr als 50 Prozent höher**. Beide Sätze sind richtig, und sie beschreiben denselben Preis. Welcher davon in einer Überschrift steht, hängt davon ab, welchen Zeitraum jemand gewählt hat.',
      },
      {
        type: 'paragraph',
        text: 'Das ist der praktisch wichtigste Umgang mit Kursmeldungen: Zu jeder Prozentzahl gehört ein Vergleichszeitpunkt. Ohne ihn ist sie nicht falsch, sondern bedeutungslos.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum ein Rohstoff so viel schneller fällt als eine Aktie',
      },
      {
        type: 'paragraph',
        text: 'Hinter einer Aktie steht ein Unternehmen mit Umsatz, Anlagen und erwarteten Gewinnen. Daran lässt sich ein Wert festmachen, und dieser Anker bremst Bewegungen. Ein Barrel Öl hat keinen solchen Anker: Sein Preis ergibt sich allein aus Angebot und Nachfrage – und die Nachfrage lässt sich kurzfristig kaum anpassen, das Angebot ebenso wenig.',
      },
      {
        type: 'paragraph',
        text: 'Kommt eine Nachricht dazu, die das erwartete Angebot verändert, springt der Preis. Genau das ist heute passiert: Nicht ein einziges Barrel mehr wurde gefördert, aber die Wahrscheinlichkeit einer Lieferstörung ist gesunken.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Was davon an der Tankstelle ankommt',
        items: [
          'Der Rohölpreis ist nur ein Teil des Spritpreises. Energiesteuer, Mehrwertsteuer, Raffinerie- und Vertriebsmarge machen den größeren Teil aus und bewegen sich nicht mit.',
          'Der Rest wirkt mit Verzögerung: Was heute an der Börse gehandelt wird, betrifft Lieferungen im September.',
        ],
      },
    ],
  },
  {
    slug: 'ifo-geschaeftsklima-steigt-im-juli-auf-86-6-punkte',
    title: 'ifo-Geschäftsklima steigt überraschend – aber nur die Erwartungen',
    metaTitle: 'ifo-Geschäftsklima Juli 2026: 86,6 Punkte',
    teaser:
      'Der ifo-Index klettert im Juli auf 86,6 Punkte und liegt über den Prognosen. Der Anstieg kommt ganz aus den Erwartungen – die Lagebeurteilung fällt.',
    category: 'Märkte',
    publishedAt: '2026-07-27T10:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['ifo-Index', 'Konjunktur', 'Frühindikator', 'Deutschland'],
    relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt', 'boerse'],
    relatedSymbols: ['dax'],
    sources: [
      {
        label: 'ifo Institut: ifo Geschäftsklimaindex gestiegen (Juli 2026)',
        url: 'https://www.ifo.de/pressemitteilung/2026-07-27/ifo-geschaeftsklimaindex-gestiegen-juli-2026',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der ifo-Geschäftsklimaindex ist im Juli auf 86,6 Punkte gestiegen, nach 85,7 Punkten im Juni. Volkswirte hatten mit einem unveränderten Wert gerechnet. Der Anstieg geht vollständig auf die Erwartungen zurück: Der entsprechende Teilindex legte um 2,4 Punkte auf 86,7 zu, während die Beurteilung der aktuellen Lage auf 86,5 Punkte nachgab.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Zwei Zahlen, zwei verschiedene Fragen',
      },
      {
        type: 'paragraph',
        text: 'Das ifo-Institut befragt monatlich rund 9.000 Unternehmen und stellt ihnen zwei Fragen: Wie beurteilen Sie Ihre **derzeitige** Geschäftslage? Und wie erwarten Sie die Entwicklung in den **kommenden sechs Monaten**? Aus beiden Antworten entsteht der Gesamtindex.',
      },
      {
        type: 'paragraph',
        text: 'Dass die Erwartungen steigen und die Lage gleichzeitig fällt, ist deshalb kein Widerspruch, sondern die interessanteste Information des Tages: Die Geschäfte laufen heute etwas schlechter, die Unternehmen rechnen aber damit, dass es besser wird. Genau umgekehrt – gute Lage, fallende Erwartungen – kündigt sich üblicherweise ein Abschwung an.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Ein Stimmungsindex misst keine Produktion',
        items: [
          'Der ifo-Index ist eine Umfrage. Er sagt, was Unternehmen erwarten, nicht was sie herstellen. Erwartungen können sich als falsch erweisen.',
          'Der Index hat keine Einheit. „86,6 Punkte“ bedeutet nichts für sich – Aussagekraft hat nur die Veränderung gegenüber dem Vormonat und der Abstand zum langjährigen Mittel.',
          'Das ifo-Institut nennt die Lage am Persischen Golf ausdrücklich weiter als Risiko. Die Umfrage lief vor der Waffenpause vom Wochenende.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum Börsen auf so etwas reagieren',
      },
      {
        type: 'paragraph',
        text: 'Aktienkurse bilden Erwartungen ab, nicht die Gegenwart. Ein Frühindikator wie der ifo-Index ist deshalb für den Markt oft relevanter als eine Zahl über das abgelaufene Quartal: Er kommt früher. Der Preis dafür ist, dass er sich häufiger irrt.',
      },
    ],
  },
  {
    slug: 'fed-entscheidet-am-mittwoch-ueber-den-leitzins',
    title: 'Fed entscheidet am Mittwoch – erwartet wird nichts',
    teaser:
      'Die US-Notenbank tagt Dienstag und Mittwoch. Die Märkte rechnen mit einer Pause – deshalb bewegt nicht die Entscheidung die Kurse, sondern jede Abweichung.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-27T09:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Fed', 'Leitzins', 'FOMC', 'Geldpolitik'],
    relatedTopics: ['notenbanken-geldpolitik', 'tagesgeld', 'waehrungen-wechselkurse'],
    relatedSymbols: ['eur-usd', 'sp500'],
    sources: [
      {
        label: 'LBBW: Fed-Zinsentscheid – aktueller Leitzins und Prognose 2026',
        url: 'https://www.lbbw.de/artikel/maerkte-verstehen/fed-zinsentscheid-leitzins-prognosen_ait4a5bv66_d.html',
      },
      {
        label: 'DeltaValue: Fed-Zinsentscheid – Termine und Bedeutung 2026',
        url: 'https://www.deltavalue.de/fed-zinsentscheid/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Offenmarktausschuss der US-Notenbank tagt am Dienstag und Mittwoch; die Entscheidung wird am Mittwoch um 20:00 Uhr deutscher Zeit veröffentlicht, die Pressekonferenz beginnt um 20:30 Uhr. Der Leitzins liegt seit Dezember 2025 unverändert in der Spanne von 3,50 bis 3,75 Prozent. Nach dem FedWatch-Instrument der Terminbörse CME lag die eingepreiste Wahrscheinlichkeit für eine weitere Pause zuletzt bei knapp 78 Prozent.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum eine erwartete Entscheidung keine Kurse bewegt',
      },
      {
        type: 'paragraph',
        text: 'Wenn vier von fünf Marktteilnehmern mit einer Pause rechnen, steckt diese Pause bereits in den heutigen Kursen. Tritt sie ein, ändert sich rechnerisch nichts – die Erwartung war schon bezahlt. **Kurse bewegt nicht das Ereignis, sondern die Abweichung von dem, was erwartet wurde.**',
      },
      {
        type: 'paragraph',
        text: 'Deshalb richtet sich die Aufmerksamkeit am Mittwoch weniger auf die Zinszahl als auf die Formulierungen: Wie beschreibt die Fed die Inflation? Wie den Arbeitsmarkt? Ein einziger geänderter Halbsatz kann mehr bewegen als der Zinsbeschluss selbst.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was das für Sparer in Deutschland heißt',
      },
      {
        type: 'paragraph',
        text: 'Direkt nichts. Für Tagesgeld- und Festgeldzinsen in Euro ist die Europäische Zentralbank zuständig, und die hat am 23. Juli ihre Zinsen unverändert gelassen; der Einlagensatz liegt bei 2,25 Prozent. Indirekt gibt es zwei Verbindungen.',
      },
      {
        type: 'list',
        items: [
          '**Der Wechselkurs.** Steigt der Zinsunterschied zwischen Dollar und Euro, wird die höher verzinste Währung für Anleger attraktiver. Das wirkt auf EUR/USD – und damit auf den Euro-Wert jedes Welt-ETFs, der überwiegend US-Aktien enthält.',
          '**Der Ton.** Die EZB entscheidet eigenständig, beobachtet die Fed aber. Eine Notenbank, die früher lockert als die andere, schwächt ihre Währung – und importiert damit Inflation über teurere Einfuhren.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Für die eigene Anlage folgt daraus wenig',
        items: [
          'Ein Zinsentscheid ist ein Termin, keine Handlungsaufforderung. Wer langfristig anlegt, ändert an einem Mittwochabend nichts an seiner Aufteilung.',
          'Wer Tagesgeld hält, sollte trotzdem hinsehen: Banken passen ihre Konditionen oft erst mit Wochen Verzögerung an – nach oben langsamer als nach unten.',
        ],
      },
    ],
  },
  {
    slug: 'bitcoin-wieder-ueber-65000-dollar',
    title: 'Bitcoin wieder über 65.000 Dollar – gestiegen ist er am Wochenende',
    metaTitle: 'Bitcoin über 65.000 Dollar: Kurs am 27. Juli 2026',
    teaser:
      'Bitcoin legt binnen 24 Stunden 1,4 Prozent zu und notiert bei 65.360 Dollar. Der Anstieg fiel in die Zeit geschlossener Aktienbörsen – kein Zufall.',
    category: 'Geldanlage',
    publishedAt: '2026-07-27T09:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Bitcoin', 'Ethereum', 'Kryptowährungen', 'Handelszeiten'],
    relatedTopics: ['bitcoin-krypto', 'blockchain', 'risiko-und-rendite'],
    relatedSymbols: ['bitcoin', 'ethereum'],
    sources: [
      {
        label: 'Fortune: Current price of Bitcoin for July 27, 2026',
        url: 'https://fortune.com/article/price-of-bitcoin-07-27-2026/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Bitcoin notierte am Montagmittag deutscher Zeit bei rund 65.360 US-Dollar, ein Plus von etwa 900 Dollar oder 1,4 Prozent gegenüber dem Vortag. Damit liegt der Kurs wieder über der Marke von 65.000 Dollar, die er in der vergangenen Woche unterschritten hatte. Ethereum legte ebenfalls zu.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Anstieg fand an einem Sonntag statt',
      },
      {
        type: 'paragraph',
        text: 'Kryptowährungen werden rund um die Uhr gehandelt, auch samstags und sonntags. Ein Handelsschluss existiert nicht. Als die Nachricht von der Waffenpause am Wochenende kam, konnte Bitcoin sie sofort einpreisen – während der DAX bis Montagmorgen warten musste und die Bewegung dann als Kurslücke nachholte.',
      },
      {
        type: 'paragraph',
        text: 'Das ist mehr als eine Randnotiz. Es macht jeden direkten Vergleich schief: Ein Aktienjahr hat rund 252 Handelstage, ein Bitcoin-Jahr 365. Wer „die letzten 250 Kurse“ vergleicht, vergleicht bei Aktien ein Jahr und bei Bitcoin acht Monate.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was der Wochenendhandel praktisch bedeutet',
        items: [
          'An Wochenenden sind weniger Marktteilnehmer aktiv. Dieselbe Nachricht bewegt den Kurs dann stärker als am Dienstagvormittag – die Schwankung ist teilweise ein Liquiditätseffekt, keine Meinungsänderung.',
          'Eine Position lässt sich jederzeit schließen. Das klingt nach Freiheit und ist vor allem eine Einladung, nachts auf den Kurs zu schauen.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Kurs bleibt die kleinere Hälfte der Information',
      },
      {
        type: 'paragraph',
        text: 'Anders als bei einer Aktie oder einer Anleihe lässt sich für Bitcoin kein Wert herleiten: Es gibt keine Gewinne, keine Zinsen, keine Anlagen. Der Preis ergibt sich vollständig daraus, was die nächste Käuferin zu zahlen bereit ist. Kursziele sind hier deshalb keine Bewertungen, sondern Erwartungen – und sollten entsprechend gelesen werden.',
      },
    ],
  },
  {
    slug: 'goldpreis-fest-vor-dem-fed-entscheid',
    title: 'Gold steigt auf rund 4.100 Dollar – in Euro weniger',
    teaser:
      'Der Goldpreis legt zum Wochenstart ein Prozent zu. In Euro bleibt weniger übrig – daran zeigt sich, warum ein Goldkurs zwei Ursachen hat.',
    category: 'Märkte',
    publishedAt: '2026-07-27T08:50:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Gold', 'Silber', 'Wechselkurs', 'Feinunze'],
    relatedTopics: ['rohstoffe', 'waehrungen-wechselkurse', 'inflation'],
    relatedSymbols: ['gold', 'silber', 'eur-usd'],
    sources: [
      {
        label: 'Goldreporter: Marktbericht Gold – Gold steigt, Ölpreis fällt',
        url: 'https://www.goldreporter.de/goldpreis-heute-28072026/marktbericht-gold/260364/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Gold ist fester in die Woche gestartet. Die Feinunze kostete am Montagmorgen rund 4.095 US-Dollar und damit etwa ein Prozent mehr als am Freitag. In Euro gerechnet lag der Preis bei etwa 3.588 Euro – ein Plus von nur rund 0,7 Prozent. Gestützt wird das Metall von der Entspannung im Iran-Konflikt und den fallenden Ölpreisen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum dieselbe Unze zwei verschiedene Zahlen ergibt',
      },
      {
        type: 'paragraph',
        text: 'Gold wird international in US-Dollar je Feinunze gehandelt – 31,1035 Gramm. Der Euro-Preis entsteht daraus erst durch Umrechnung. Wer in Euro rechnet, hat deshalb **zwei Bewegungen im Preis**: die des Metalls und die des Wechselkurses.',
      },
      {
        type: 'paragraph',
        text: 'Heute zeigt sich das an einer Differenz von 0,3 Prozentpunkten: Gold stieg in Dollar um ein Prozent, in Euro um 0,7 Prozent. Die Lücke ist der Wechselkurs – der Euro hat gegenüber dem Dollar zugelegt und einen Teil des Gewinns aufgezehrt. In anderen Phasen wirkt derselbe Mechanismus in die andere Richtung und macht aus einem Dollar-Verlust einen Euro-Gewinn.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Konsequenz für die eigene Rechnung',
        items: [
          'Für eine Anlegerin im Euroraum ist der Euro-Preis die einzig relevante Zahl. Dollar-Kurse aus internationalen Meldungen sagen nur die halbe Wahrheit.',
          'Eine Währungsabsicherung entfernt diesen zweiten Effekt – sie kostet aber laufend Gebühr und nimmt auch die Chance mit.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Mittwoch ist der eigentliche Termin',
      },
      {
        type: 'paragraph',
        text: 'Gold zahlt keinen Zins. Wer es hält, verzichtet auf den Ertrag, den er anderswo sicher bekäme – und dieser Verzicht richtet sich nach dem Realzins, also dem Zins abzüglich der erwarteten Inflation. Deshalb ist der Fed-Entscheid am Mittwoch für den Goldpreis wichtiger als fast jede andere Nachricht dieser Woche.',
      },
      {
        type: 'paragraph',
        text: 'Aus technischer Sicht bleibt es vorerst bei einer Erholung: Um den seit rund sechs Monaten laufenden Abwärtstrend zu beenden, müsste der Preis die Marke von 4.200 Dollar überwinden.',
      },
    ],
  },
  {
    slug: 'berichtswoche-apple-microsoft-meta-amazon',
    title: 'Die dichteste Berichtswoche des Quartals beginnt',
    teaser:
      'Microsoft und Meta berichten am Mittwoch, Apple und Amazon am Donnerstag, dazu elf DAX-Konzerne. Warum ein Kurs auch nach guten Zahlen fallen kann.',
    category: 'Märkte',
    publishedAt: '2026-07-27T08:15:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Quartalszahlen', 'Berichtssaison', 'Erwartungen', 'Big Tech'],
    relatedTopics: ['aktie', 'anlegerpsychologie', 'wann-kaufen-verkaufen'],
    relatedSymbols: ['microsoft', 'meta', 'apple', 'amazon'],
    sources: [
      {
        label:
          'boersennews: Wochenvorschau KW 31 – Apple, Microsoft, Meta und der Fed-Entscheid',
        url: 'https://www.boersennews.de/nachrichten/service/community/wochenvorschau-kw-31-rekorddichte-berichtswoche-apple-microsoft-meta-und-der-fed-entscheid/5220495/',
      },
      {
        label:
          'wallstreetONLINE: Wichtigste Woche des Quartals – 11 DAX-Konzerne berichten',
        url: 'https://www.wallstreet-online.de/nachricht/21153185-wichtigste-woche-quartals-dax-11-konzerne-apple-amazon-sk-hynix-zahlen',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Diese Woche legen Hunderte Unternehmen ihre Quartalszahlen vor. Nach US-Börsenschluss berichten am Mittwoch Microsoft und Meta, am Donnerstag folgen Apple und Amazon. In Deutschland öffnen elf DAX-Konzerne ihre Bücher; den Auftakt machen am Montag unter anderem AstraZeneca, LVMH und Hochtief. Am Mittwoch kommt der Fed-Entscheid dazu.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Gute Zahlen, fallender Kurs – wie das zusammengeht',
      },
      {
        type: 'paragraph',
        text: 'Der häufigste Grund für Verwunderung in der Berichtssaison: Ein Unternehmen meldet einen Rekordgewinn, und die Aktie verliert danach fünf Prozent. Das ist kein Fehler des Marktes, sondern seine Funktionsweise.',
      },
      {
        type: 'paragraph',
        text: 'Im Kurs vor der Veröffentlichung steckt bereits, was Analysten erwarten. Veröffentlicht wird also nicht „ein guter Gewinn“, sondern **die Abweichung von der Erwartung**. Liegt der Gewinn über der Schätzung, aber der Ausblick darunter, kann der Kurs trotz Rekordzahlen fallen.',
      },
      {
        type: 'list',
        items: [
          '**Die Zahl für das vergangene Quartal** ist Vergangenheit. Sie bestätigt oder korrigiert, was ohnehin geschätzt wurde.',
          '**Der Ausblick auf die kommenden Quartale** ist die eigentliche Neuigkeit. Er verändert die Erwartung – und damit den Preis.',
          '**Die Reaktion der ersten Minuten** ist selten das Ergebnis einer Analyse. Der vollständige Bericht hat oft mehr als hundert Seiten.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum das auch Anleger ohne Einzelaktien betrifft',
        items: [
          'Die vier Unternehmen dieser Woche gehören zu den schwersten Werten im S&P 500 und damit auch in jedem weltweit streuenden ETF. Wer breit gestreut anlegt, hält von ihnen mehr, als die Zahl der enthaltenen Titel vermuten lässt.',
          'Eine Handlungsaufforderung ist das nicht. Wer die Aufteilung wegen einer Quartalsmeldung ändert, hat sie vorher falsch gewählt.',
        ],
      },
    ],
  },
  {
    slug: 'bank-of-england-und-bip-zahlen-in-dieser-woche',
    title: 'Nicht nur die Fed: Auch die Bank of England entscheidet',
    teaser:
      'Neben dem Fed-Entscheid stehen diese Woche die britische Notenbank, erste BIP-Schätzungen für das zweite Quartal und neue Inflationsdaten an.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-27T07:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 3,
    tags: ['Bank of England', 'Bruttoinlandsprodukt', 'Inflation', 'Konjunktur'],
    relatedTopics: ['notenbanken-geldpolitik', 'inflation', 'staatsanleihe'],
    relatedSymbols: ['eur-gbp'],
    sources: [
      {
        label:
          'onvista: Wochenausblick – Fed- und BoE-Zinsentscheid, BIP und Inflationsdaten (26.07.2026)',
        url: 'https://www.onvista.de/news/2026/07-26-wochenausblick-fed-und-boe-zinsentscheid-bruttoinlandsprodukt-und-inflationsdaten-sowie-berichtssaison-im-fokus-0-12-26536151',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Fed-Entscheid am Mittwoch ist der bekannteste Termin dieser Woche, aber nicht der einzige. Auch die Bank of England entscheidet über ihren Leitzins. Dazu kommen erste Schätzungen zum Bruttoinlandsprodukt des zweiten Quartals und neue Inflationsdaten.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was eine Erstschätzung wert ist',
      },
      {
        type: 'paragraph',
        text: 'Eine BIP-Erstschätzung entsteht wenige Wochen nach Quartalsende, wenn viele Daten noch fehlen. Sie wird später zweimal revidiert, und diese Korrekturen fallen regelmäßig größer aus als der Unterschied, über den in der Erstmeldung diskutiert wird. Aus 0,1 Prozent Wachstum kann so nachträglich ein Rückgang werden – und umgekehrt.',
      },
      {
        type: 'paragraph',
        text: 'Für die Börse zählt die Erstschätzung trotzdem, weil sie zuerst da ist. Für die Einschätzung der Wirtschaftslage sollte man wissen, wie vorläufig sie ist.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum mehrere Notenbanken in einer Woche interessant sind',
        items: [
          'Notenbanken entscheiden eigenständig, beobachten sich aber gegenseitig. Wer als Erster lockert, schwächt seine Währung.',
          'Für Anleger im Euroraum wirkt das über den Wechselkurs auf jeden Fonds mit ausländischen Wertpapieren – auch ohne dass sich dort ein einziger Kurs bewegt.',
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ 26.07.
  {
    slug: 'ki-bewertungen-vor-der-testwoche',
    title: 'Vor den Big-Tech-Zahlen: Was „KI-Blase“ eigentlich bedeutet',
    metaTitle: 'KI-Bewertungen vor den Big-Tech-Quartalszahlen',
    teaser:
      'Vor den Zahlen von Microsoft, Meta, Apple und Amazon steht die Blasenfrage im Raum. Sie ist vorher nicht beantwortbar – prüfen lässt sich anderes.',
    category: 'Geldanlage',
    publishedAt: '2026-07-26T19:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Künstliche Intelligenz', 'Bewertung', 'Konzentrationsrisiko', 'ETF'],
    relatedTopics: ['etf', 'aktie', 'risiko-und-rendite'],
    relatedSymbols: ['nasdaq-100', 'msci-world', 'nvidia'],
    sources: [
      {
        label:
          'wallstreetONLINE: Earnings Preview – Ist das die Woche, in der die KI-Blase platzt? (26.07.2026)',
        url: 'https://www.wallstreet-online.de/nachricht/21145460-earnings-preview-microsoft-meta-amazon-apple-woche-ki-blase-platzt',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Vor den Quartalszahlen der vier größten US-Technologiekonzerne taucht die Frage wieder auf, ob die Bewertungen rund um künstliche Intelligenz eine Blase sind. Die Frage ist berechtigt. Beantwortbar ist sie vorher nicht – und das liegt an ihrer Definition.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Eine Blase erkennt man daran, dass sie geplatzt ist',
      },
      {
        type: 'paragraph',
        text: 'Von einer Blase spricht man, wenn Preise deutlich über dem liegen, was die künftigen Erträge rechtfertigen. Das Problem steckt im Wort „künftig“: Ob die Investitionen in Rechenzentren und Modelle sich auszahlen, entscheidet sich in den nächsten Jahren, nicht am Mittwochabend. Vorher lässt sich die Aussage weder bestätigen noch widerlegen.',
      },
      {
        type: 'paragraph',
        text: 'Wer heute „Blase“ sagt, trifft deshalb eine Prognose, keine Feststellung. Das gilt auch für die Gegenseite.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was sich stattdessen prüfen lässt',
      },
      {
        type: 'paragraph',
        text: 'Zwei Dinge sind keine Prognose, sondern nachlesbar – und für die eigene Anlage wichtiger als die Blasenfrage.',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Wie viel von deinem Depot hängt an diesen Unternehmen?** Der MSCI World gewichtet nach Börsenwert. Rund sieben von zehn Euro in einem Welt-ETF stecken in US-Aktien, ein erheblicher Teil davon in einer Handvoll Technologiewerte. Wer zusätzlich einzelne dieser Aktien hält, hat sie doppelt.',
          '**Was du erwartest, wenn du falsch liegst.** Ein Rückgang von 50 Prozent verlangt anschließend ein Plus von 100 Prozent zum Ausgleich. Die entscheidende Frage ist nicht, ob es dazu kommt, sondern ob die Position so groß ist, dass sie die eigene Planung berühren würde.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Der nützlichere Blick',
        items: [
          'Streuung ist die einzige Antwort, die ohne Prognose auskommt. Sie kostet Rendite, wenn die Konzentration recht behält – und rettet die Planung, wenn nicht.',
          'Wer die Gewichtung seines Welt-ETFs nicht kennt, kann sie im Factsheet nachlesen. Das dauert zwei Minuten und ersetzt jede Blasendiskussion.',
        ],
      },
    ],
  },
  // ------------------------------------------------------------------ 25.07.
  {
    slug: 'bitcoin-haelt-64000-dollar',
    title: 'Bitcoin hält die 64.000 Dollar – und der Kurs sagt wenig über den Markt',
    metaTitle: 'Bitcoin bei 64.000 Dollar: Kurs und Marktgröße',
    teaser:
      'Nach schwachen Handelstagen stabilisiert sich Bitcoin. Interessanter als der Kurs ist, wie groß der Kryptomarkt noch ist – und wie wenig davon Bitcoin.',
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
      'Gold liegt gut ein Viertel unter seinem Allzeithoch von 5.598 Dollar, Silber bei knapp 58 Dollar. Beides zeigt, was Rohstoffe leisten – und was nicht.',
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
      'Der Streit um die Straße von Hormus treibt den Ölpreis auf den höchsten Stand seit zwei Monaten. Die Kette bis zur Zinsentscheidung ist kurz.',
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
      'Der Leitindex holt sich die 25.000 zurück und schließt die Woche im Plus. Der Schub kam von SAP – das sagt mehr über den Index als über die Wirtschaft.',
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
      'Der EZB-Rat lässt die Leitzinsen unverändert – sechs Wochen nach der ersten Erhöhung seit drei Jahren. Für Sparer zählt genau dieser eine Satz.',
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
      'Am 29. Juli entscheidet die US-Notenbank. Erwartet wird die fünfte Pause in Folge – bemerkenswert ist, was die Projektionen inzwischen andeuten.',
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
      'Das Bundesfinanzministerium hat den Entwurf zur Frühstartrente vorgelegt. Zehn Euro im Monat klingen nach wenig – über die Laufzeit ist es eine Zeitfrage.',
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
      'Im Schnitt gibt es 2,6 Prozent, einzelne Aktionsangebote über vier. Nach Inflation und Steuer bleibt weniger übrig, als die Zahlen vermuten lassen.',
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
