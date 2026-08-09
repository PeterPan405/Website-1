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
  /**
   * Was nach der Veröffentlichung geändert wurde.
   *
   * ## Warum das ein eigenes Feld ist und kein Satz im Text
   *
   * Weil eine stillschweigend korrigierte Zahl schlimmer ist als die falsche:
   * Wer den Artikel vorher gelesen hat, trägt die alte Zahl weiter mit sich
   * und erfährt nie, dass sie überholt ist. Ein Änderungsvermerk am Fuß des
   * Artikels ist die einzige Stelle, an der er es erfahren kann.
   *
   * Das ist das Gegenstück zum ersten Grundsatz dieser Website. „Keine
   * erfundenen Zahlen, keine Quelle, die du nicht gesehen hast“ ist eine
   * Aussage darüber, wie sorgfältig gearbeitet wird. Wie mit dem Irrtum
   * umgegangen wird, der trotzdem passiert, ist die zweite Hälfte davon – und
   * die unterscheidet eine Redaktion von einem Textgenerator.
   *
   * ## Was hineingehört
   *
   * Was geändert wurde und warum, in einem Satz. Nicht: „redaktionell
   * überarbeitet“. Sondern: „Die Inflationsrate lag bei 2,4 statt 2,8 Prozent;
   * verwechselt worden waren Euroraum und Deutschland.“
   *
   * Reine Tippfehler brauchen keinen Eintrag. Alles, was eine Zahl, eine
   * Aussage oder eine Quelle betrifft, schon.
   */
  korrekturen?: {
    /** Wann geändert wurde, ISO 8601 mit Zeitzone. */
    am: string
    /** Was geändert wurde und warum – in einem Satz. */
    was: string
  }[]
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
  {
    slug: 'zinswetten-kippen-fed-september-2026-08-09',
    title: 'Von Erhöhung auf Pause: Ein Jobbericht kippt die Fed-Wetten',
    teaser:
      'Vor dem US-Jobbericht galt eine September-Zinserhöhung als wahrscheinlich, danach die Pause. Was Terminmärkte messen – und warum die erste Reaktion selten hält.',
    category: 'Geldpolitik',
    publishedAt: '2026-08-09T21:50:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Fed', 'Zinserwartung', 'Arbeitsmarkt'],
    relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['sp500', 'nasdaq-100'],
    sources: [
      {
        label:
          'FXStreet, „Prognose für die kommende Woche: US-Inflation steht nächste Woche im Mittelpunkt“ vom 7.8.2026, 19:34 Uhr GMT, abgerufen 9.8.2026, 19:25 Uhr UTC',
        url: 'https://www.fxstreet.de.com/news/prognose-fur-die-kommende-woche-us-inflation-steht-nachste-woche-im-mittelpunkt-202608071934',
      },
      {
        label:
          'finanzmarktwelt.de, „US-Arbeitsmarkt schockt Märkte – Fed-Zinswetten kippen“, abgerufen 9.8.2026, 19:26 Uhr UTC',
        url: 'https://finanzmarktwelt.de/us-arbeitsmarkt-schockt-maerkte-fed-zinswetten-kippen-397726/',
      },
      {
        label:
          'Bitcoin.com News (deutsch), „Erwartungen hinsichtlich einer Zinserhöhung durch die Fed schwinden …“ vom 9.8.2026, 13:45 Uhr',
        url: 'https://news.bitcoin.com/de/finance/erwartungen-hinsichtlich-einer-zinserhoehung-durch-die-fed-schwinden-waehrend-die-wahrscheinlichkeit-einer-pause-im-september-deutlich-an-boden-gewinnt/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der US-Arbeitsmarktbericht vom Freitag hat die Erwartungen an die Notenbanksitzung am 16. September binnen Stunden umgedreht. Statt der prognostizierten 80.000 neuen Stellen meldete die Statistik für Juli einen **Rückgang um 23.000**; der Juni-Wert wurde laut FXStreet zusätzlich auf 20.000 nach unten revidiert, und das Lohnwachstum verlangsamte sich auf 3,2 Prozent zum Vorjahr.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Vorher 55 Prozent für die Erhöhung, nachher 56 für die Pause',
      },
      {
        type: 'paragraph',
        text: 'Wie schnell die Neubewertung lief, hat finanzmarktwelt.de nachgezeichnet: Vor der Veröffentlichung preisten die Terminmärkte eine September-Zinserhöhung mit rund **55 Prozent Wahrscheinlichkeit** ein – kurz danach galten unveränderte Zinsen mit etwa 56 Prozent als wahrscheinlichstes Szenario. Am Sonntag bezifferte der Prognosemarkt Polymarket die Pause laut Bitcoin.com News auf 63 Prozent, Kalshi auf 65 Prozent, das CME-FedWatch-Tool auf knappere 55,6 Prozent. Das Zielband der Fed liegt derzeit bei 3,50 bis 3,75 Prozent.',
      },
      {
        type: 'callout',
        variant: 'info',
        items: [
          'Terminmärkte messen keine Meinung einer Redaktion, sondern Wetten mit echtem Geld: Aus den Preisen der Kontrakte lässt sich ablesen, welche Zinsentscheidung der Markt für wie wahrscheinlich hält. Ändern sich die Daten, ändern sich die Preise – manchmal innerhalb einer Stunde.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum nicht die Zahl zählt, sondern die Abweichung',
      },
      {
        type: 'paragraph',
        text: 'Ein Verlust von 23.000 Stellen ist für eine Volkswirtschaft mit über 160 Millionen Beschäftigten für sich genommen klein. Bewegt hat die Märkte nicht die Zahl, sondern der **Abstand zur Erwartung**: Prognostiziert war ein Plus von 80.000. Was alle erwarten, steckt schon in den Kursen – erst die Überraschung erzeugt Bewegung. Deshalb kann dieselbe Meldung an einem Tag ein Beben auslösen und an einem anderen verpuffen.',
      },
      {
        type: 'paragraph',
        text: 'Bemerkenswert ist auch das Kleingedruckte: Die Arbeitslosenquote **fiel** auf 4,1 Prozent – allerdings vor allem, weil weniger Menschen dem Arbeitsmarkt zur Verfügung standen. Eine sinkende Quote kann also ein Schwächesignal sein. Wer nur die Schlagzeile liest, liest das Gegenteil der Geschichte.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Die Entscheidung am 16. September ist offen – die Prognosemärkte streuen zwischen 56 und 65 Prozent für die Pause, ein gutes Drittel setzt weiter auf die Erhöhung. Für Anleger ist weniger der Ausgang die Lehre als der Mechanismus: Zinswetten sind keine Fakten, sondern Momentaufnahmen, und der Verbraucherpreisindex am Mittwoch kann sie erneut drehen.',
      },
    ],
  },
  {
    slug: 'china-inflation-juli-2026-08-09',
    title: 'China: Inflation halbiert sich auf 0,5 Prozent',
    teaser:
      'Chinas Verbraucherpreise stiegen im Juli nur noch um 0,5 Prozent, halb so schnell wie im Juni. Warum eine sehr niedrige Inflation kein Grund zur Freude ist.',
    category: 'Geldpolitik',
    publishedAt: '2026-08-09T21:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['China', 'Inflation', 'Konjunktur'],
    relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
    relatedSymbols: ['hang-seng', 'eur-cny'],
    sources: [
      {
        label:
          'CGTN, „Chinas CPI und PPI im Juli“ vom 9.8.2026 (Daten des Nationalen Statistikamts NBS), abgerufen 9.8.2026, 19:26 Uhr UTC',
        url: 'https://news.cgtn.com/news/2026-08-09/China-s-CPI-and-PPI-maintain-upward-trend-in-July-1PsKq8Nf3cQ/p.html',
      },
      {
        label:
          'FXStreet-Wochenausblick vom 7.8.2026 (Markterwartung: +0,8 Prozent), abgerufen 9.8.2026, 19:25 Uhr UTC',
        url: 'https://www.fxstreet.de.com/news/prognose-fur-die-kommende-woche-us-inflation-steht-nachste-woche-im-mittelpunkt-202608071934',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Chinas Statistikamt NBS hat am Sonntag die Preisdaten für Juli veröffentlicht: Die Verbraucherpreise stiegen um **0,5 Prozent** zum Vorjahr – nach 1,0 Prozent im Juni und damit nur halb so schnell. Erwartet worden waren laut FXStreet 0,8 Prozent. Zum Vormonat fielen die Preise um 0,1 Prozent.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Kernrate und Gesamtrate erzählen zwei Geschichten',
      },
      {
        type: 'paragraph',
        text: 'Die **Kernrate** – ohne Lebensmittel und Energie – lag mit 0,9 Prozent deutlich über der Gesamtrate. Getragen wurde sie laut NBS von Dienstleistungen: Medizinische Leistungen verteuerten sich um 4,3 Prozent, Haushaltsdienste um 1,3 Prozent, Essen außer Haus um 1,0 Prozent. Gedrückt wurde die Gesamtrate vor allem von langsamer steigenden Benzinpreisen. Die Erzeugerpreise stiegen um 3,5 Prozent zum Vorjahr, fielen aber zum Vormonat um 0,7 Prozent – in der Ölförderung um 11,8 Prozent.',
      },
      {
        type: 'callout',
        variant: 'info',
        items: [
          'Gesamtrate und Kernrate auseinanderzuhalten lohnt sich in jedem Land: Die Gesamtrate schwankt mit Öl und Lebensmitteln, die Kernrate zeigt den zugrunde liegenden Preistrend. Notenbanken schauen deshalb meist zuerst auf die Kernrate.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum „zu niedrig“ auch ein Warnsignal ist',
      },
      {
        type: 'paragraph',
        text: 'In Europa wäre eine Inflationsrate von 0,5 Prozent eine Sensationsmeldung – in China ist sie eher ein Symptom: Sehr niedrige Raten können auf schwache Binnennachfrage hindeuten, und ein Rutsch unter null (Deflation) macht Schulden real schwerer und verleitet Käufer zum Abwarten. Die Deutung ist auch unter Beobachtern nicht einheitlich: Der Staatssender CGTN überschreibt dieselben Zahlen mit einem stabilen Aufwärtstrend und verweist auf die anziehenden Erzeugerpreise, westliche Datenanbieter betonen die Abkühlung gegenüber Juni.',
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Wer chinesische Aktien oder einen Schwellenländer-ETF hält, hält immer auch eine Wette auf Chinas Binnennachfrage. Preisdaten wie diese sind dafür ein früher Fühler – und ein Beispiel dafür, dass dieselbe Zahl je nach Blickwinkel als Erfolg oder als Warnung gelesen wird.',
      },
    ],
  },
  {
    slug: 'gold-staerkste-woche-seit-januar-2026-08-09',
    title: 'Gold über 4.300 Dollar: die stärkste Woche seit Januar',
    teaser:
      'Gold beendet die Woche über 4.300 Dollar – so stark wie seit Januar nicht. Treiber sind kippende Zinserwartungen, und am Mittwoch folgt der nächste Test.',
    category: 'Geldanlage',
    publishedAt: '2026-08-09T21:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Gold', 'Zinserwartung', 'Rohstoffe'],
    relatedTopics: ['rohstoffe', 'notenbanken-geldpolitik', 'risiko-und-rendite'],
    relatedSymbols: ['gold', 'eur-usd'],
    sources: [
      {
        label:
          'FXStreet-Wochenausblick vom 7.8.2026 (Gold über 4.300 Dollar, stärkste Rally seit Januar), abgerufen 9.8.2026, 19:25 Uhr UTC',
        url: 'https://www.fxstreet.de.com/news/prognose-fur-die-kommende-woche-us-inflation-steht-nachste-woche-im-mittelpunkt-202608071934',
      },
      {
        label:
          'finanzmarktwelt.de, „US-Arbeitsmarkt schockt Märkte“ (Gold in der Spitze 4.371 Dollar), abgerufen 9.8.2026, 19:26 Uhr UTC',
        url: 'https://finanzmarktwelt.de/us-arbeitsmarkt-schockt-maerkte-fed-zinswetten-kippen-397726/',
      },
      {
        label:
          'wallstreet-online, Kursleiste vom 9.8.2026 (Gold 4.342,26 Dollar), abgerufen 9.8.2026, 19:25 Uhr UTC',
        url: 'https://www.wallstreet-online.de/nachricht/21220632-bitcoin-prognose-2026-wale-kaufen-btc-1-2-milliarden-dollar-kursziele-liegen-212-000-dollar-auseinander',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Gold hat laut FXStreet die Woche oberhalb von **4.300 Dollar** je Feinunze beendet – nach der stärksten Wochenrally seit Januar. Unmittelbar nach dem schwachen US-Arbeitsmarktbericht am Freitag reichte die Bewegung laut finanzmarktwelt.de in der Spitze bis 4.371 Dollar; am Sonntagabend stand der Preis in der Kursleiste von wallstreet-online bei 4.342,26 Dollar.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Treiber heißt nicht „Krise“, sondern „Zinserwartung“',
      },
      {
        type: 'paragraph',
        text: 'Die naheliegende Erklärung – Gold steigt, weil die Welt unsicher ist – greift diese Woche zu kurz. Der Auslöser war präziser: Nach dem Jobbericht brachen die Erwartungen einer weiteren **Zinserhöhung** der Fed ein. Gold zahlt keine Zinsen; sein größter Konkurrent ist die verzinste Staatsanleihe. Sinken die erwarteten Zinsen, sinken die Opportunitätskosten des Goldhaltens – und der Preis bekommt Rückenwind. FXStreet nennt die einbrechenden Zinserhöhungserwartungen ausdrücklich als Träger der Bewegung.',
      },
      {
        type: 'callout',
        variant: 'warning',
        items: [
          'Dieselbe Logik trägt auch in die Gegenrichtung: Fällt der US-Verbraucherpreisindex am Mittwoch höher aus als erwartet, rücken Zinserhöhungen zurück ins Bild – und der Rückenwind für Gold kann sich schnell drehen. FXStreet nennt den Mittwochstermin die mit Abstand wichtigste Veröffentlichung der Woche.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Wer Gold im Depot hat, sollte weniger auf Krisenschlagzeilen schauen als auf Realzinsen und Zinserwartungen. Eine Woche wie diese zeigt den Mechanismus in Reinform – der Preis bewegte sich in Stunden, in denen sich an den Krisen der Welt nichts geändert hat, wohl aber an den Zinswetten.',
      },
    ],
  },
  {
    slug: 'euro-dollar-zweimonatshoch-2026-08-09',
    title: 'Euro über 1,15 Dollar: Warum das eine Dollar-Geschichte ist',
    teaser:
      'Der Euro notiert über 1,15 Dollar, der Dollar-Index fiel unter 100. Warum ein Wechselkurs immer zwei Geschichten erzählt – und diesmal die amerikanische zählt.',
    category: 'Märkte',
    publishedAt: '2026-08-09T21:35:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Euro', 'Dollar', 'Wechselkurs'],
    relatedTopics: ['waehrungen-wechselkurse', 'notenbanken-geldpolitik'],
    relatedSymbols: ['eur-usd', 'eur-jpy'],
    sources: [
      {
        label:
          'FXStreet-Wochenausblick vom 7.8.2026 (EUR/USD über 1,1550, Dollar-Index unter 100, USD/JPY unter 158), abgerufen 9.8.2026, 19:25 Uhr UTC',
        url: 'https://www.fxstreet.de.com/news/prognose-fur-die-kommende-woche-us-inflation-steht-nachste-woche-im-mittelpunkt-202608071934',
      },
      {
        label:
          'wallstreet-online, Kursleiste vom 9.8.2026 (EUR/USD 1,15587), abgerufen 9.8.2026, 19:25 Uhr UTC',
        url: 'https://www.wallstreet-online.de/nachricht/21220632-bitcoin-prognose-2026-wale-kaufen-btc-1-2-milliarden-dollar-kursziele-liegen-212-000-dollar-auseinander',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Das Währungspaar Euro/Dollar hat die Woche laut FXStreet oberhalb von 1,1550 beendet, nahe einem Zweimonatshoch – am Sonntagabend zeigte die Kursleiste von wallstreet-online **1,15587 Dollar** je Euro. Der Dollar-Index, der den Dollar gegen einen Korb großer Währungen misst, fiel unter die Marke von 100.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Zwei Währungen, ein Kurs',
      },
      {
        type: 'paragraph',
        text: 'Ein Wechselkurs hat immer zwei Seiten: Er kann steigen, weil der Zähler stark ist – oder weil der Nenner schwach ist. Diese Woche spricht fast alles für die zweite Lesart. Der Auslöser war der schwache US-Arbeitsmarktbericht, der die Zinserwartungen an die Fed kippte; der Dollar verlor daraufhin **gegen alle großen Währungen**, zeitweise rund ein Prozent allein gegen den Yen. Aus dem Euroraum selbst kam wenig Neues – die EZB wartet ab, und der Datenkalender der Woche ist laut FXStreet „eher von Bestätigungen als von Überraschungen geprägt“.',
      },
      {
        type: 'callout',
        variant: 'tip',
        items: [
          'Der Dollar-Index ist ein nützlicher Schnelltest: Steigt der Euro zum Dollar, während der Index fällt, ist es eine Dollar-Bewegung. Steigt der Euro auch gegen Pfund, Yen und Franken, ist es eine Euro-Bewegung.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Für Anleger mit weltweit gestreuten Depots ist der Kurs mehr als eine Randnotiz – ein schwächerer Dollar drückt den Euro-Wert von US-Aktien und Dollar-Rohstoffen, ganz ohne dass sich an den Unternehmen etwas ändert. Wer die Ursache kennt, erschrickt nicht über Depotbewegungen, die nur Währung sind.',
      },
    ],
  },
  {
    slug: 'bitcoin-prognosespanne-2026-08-09',
    title: 'Bitcoin: Kursziele liegen 212.000 Dollar auseinander',
    teaser:
      'Große Häuser sehen Bitcoin zwischen 38.000 und 250.000 Dollar. Was solche Spannen über Prognosen verraten – und woran man Werbung in Nachrichtenform erkennt.',
    category: 'Geldanlage',
    publishedAt: '2026-08-09T21:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Bitcoin', 'Prognosen', 'Anlegerschutz'],
    relatedTopics: ['bitcoin-krypto', 'anlegerpsychologie', 'wann-kaufen-verkaufen'],
    relatedSymbols: ['bitcoin'],
    sources: [
      {
        label:
          'wallstreet-online, „Bitcoin Prognose 2026 – Wale kaufen BTC für 1,2 Milliarden Dollar, doch die Kursziele liegen 212.000 Dollar auseinander“ vom 9.8.2026, abgerufen 9.8.2026, 19:25 Uhr UTC',
        url: 'https://www.wallstreet-online.de/nachricht/21220632-bitcoin-prognose-2026-wale-kaufen-btc-1-2-milliarden-dollar-kursziele-liegen-212-000-dollar-auseinander',
      },
      {
        label:
          'finanznachrichten.de (Tokenwire), „Bitcoin Kurs Prognose August 2026 – warum die ruhigste Woche seit Mai Anleger nervös macht“ vom 5.8.2026, abgerufen 9.8.2026, 19:25 Uhr UTC',
        url: 'https://www.finanznachrichten.de/nachrichten-2026-08/69228301-bitcoin-kurs-prognose-august-2026-warum-die-ruhigste-woche-seit-mai-anleger-nervoes-macht-712.htm',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Bitcoin notierte laut einem am Sonntag bei wallstreet-online erschienenen Beitrag am 7. August bei rund **64.970 Dollar** – etwa 48 Prozent unter dem Rekordhoch von 126.080 Dollar. In der ersten Augustwoche flossen demnach 754 Millionen Dollar in die Spot-ETFs, große Adressen kauften Bitcoin im Wert von rund 1,2 Milliarden Dollar. Anfang der Woche war die erwartete Schwankungsbreite laut einem Beitrag auf finanznachrichten.de auf den tiefsten Stand seit Ende Mai gefallen.',
      },
      {
        type: 'heading',
        level: 2,
        text: '38.000 oder 250.000 – beides heißt „Prognose“',
      },
      {
        type: 'paragraph',
        text: 'Bemerkenswert ist die Spanne der Jahresprognosen großer Häuser, die der Beitrag nennt: Sie reicht von **38.000 bis 250.000 Dollar** – Standard Chartered wird mit 100.000, Bernstein mit 150.000 Dollar zitiert. Zwischen dem niedrigsten und dem höchsten Kursziel liegen 212.000 Dollar, mehr als das Dreifache des aktuellen Kurses. Eine so breite Spanne ist selbst die Information: Sie sagt, dass niemand es weiß. Eine Punktprognose („150.000 bis Jahresende“) klingt präziser, ist aber nur ein Punkt aus genau dieser Spanne.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der zweite Lehrsatz steckt in den Quellen selbst',
      },
      {
        type: 'paragraph',
        text: 'Beide Beiträge, die diese Marktzahlen liefern, münden im letzten Drittel in Werbung für denselben Token-Vorverkauf – inklusive Preisangabe und Verkaufsargumenten. Das Muster ist verbreitet: Ein Text beginnt als Marktbericht mit echten, nachprüfbaren Zahlen und wechselt dann unmerklich ins Verkaufen. Erkennbar ist es an wiederkehrenden Signalen: Ein konkretes Produkt wird prominenter als das eigentliche Thema, Knappheit wird betont („nur bis zum Listing“), und Risiken kommen nicht mehr vor.',
      },
      {
        type: 'callout',
        variant: 'warning',
        items: [
          'Vorverkäufe unregulierter Token sind hochriskant bis Totalverlust. Dieser Artikel zitiert aus den genannten Beiträgen ausschließlich die Marktdaten zu Bitcoin – die dort beworbene Vorverkaufs-Anlage ist ausdrücklich nicht Gegenstand und nicht Empfehlung dieser Seite.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Wer Krypto-Nachrichten liest, prüft zweierlei – die Zahl und den Zweck des Textes. Die Zahl kann stimmen, während der Text verkaufen will. Beides gleichzeitig zu sehen ist die eigentliche Kompetenz.',
      },
    ],
  },
  {
    slug: 'anleihen-rendite-pendel-2026-08-09',
    title: '4,67 – 4,61 – 4,63: das Rendite-Pendel nach dem Jobbericht',
    metaTitle: 'Das Rendite-Pendel nach dem US-Jobbericht',
    teaser:
      'Nach dem US-Jobbericht fiel die Zehnjahresrendite von 4,67 auf 4,61 Prozent – und stieg zurück auf 4,63. Was das Pendeln über eingepreiste Erwartungen lehrt.',
    category: 'Märkte',
    publishedAt: '2026-08-09T21:25:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Anleihen', 'Renditen', 'Fed'],
    relatedTopics: ['staatsanleihe', 'schuldverschreibung', 'notenbanken-geldpolitik'],
    relatedSymbols: ['sp500', 'nasdaq-100'],
    sources: [
      {
        label:
          'finanzmarktwelt.de, „US-Arbeitsmarkt schockt Märkte – Fed-Zinswetten kippen“ (Renditeverlauf, Marktreaktionen; Beschäftigungsdaten laut Bloomberg), abgerufen 9.8.2026, 19:26 Uhr UTC',
        url: 'https://finanzmarktwelt.de/us-arbeitsmarkt-schockt-maerkte-fed-zinswetten-kippen-397726/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Rendite zehnjähriger US-Staatsanleihen fiel unmittelbar nach dem schwachen Arbeitsmarktbericht von rund **4,668 auf 4,606 Prozent** – und stieg anschließend auf etwa 4,625 Prozent zurück, wie finanzmarktwelt.de nachzeichnet. Bei zweijährigen Papieren, die besonders empfindlich auf Fed-Erwartungen reagieren, gingen die Renditen ebenfalls deutlich zurück.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum fallende Renditen steigende Kurse sind',
      },
      {
        type: 'paragraph',
        text: 'Anleihekurs und Rendite bewegen sich spiegelbildlich: Wer eine bestehende Anleihe mit festem Zinsschein kauft, zahlt mehr für sie, wenn neue Anleihen künftig weniger Zins versprechen – der Kurs steigt, die rechnerische Rendite fällt. Ein Renditerutsch von 4,67 auf 4,61 Prozent binnen Minuten heißt also: Anleger griffen zu, weil sie geringere Zinsen erwarteten. Die **zweijährige** Rendite gilt dabei als der direktere Fed-Sensor, weil auf ihrer kurzen Strecke fast nur die Leitzinserwartung zählt.',
      },
      {
        type: 'paragraph',
        text: 'Auch die Aktienmärkte pendelten: Nasdaq 100 und S&P 500 zogen laut dem Bericht zunächst deutlich an – die Logik „schwächere Daten, weniger Zinsdruck“ –, gaben dann aber rund um die Börseneröffnung große Teile der Gewinne wieder ab. Denn zu schwache Daten werfen die nächste Frage auf: Wie viel Konjunkturschwäche steckt dahinter?',
      },
      {
        type: 'callout',
        variant: 'info',
        items: [
          'Das Pendeln ist kein Zeichen von Orientierungslosigkeit, sondern der Preisfindungsprozess selbst: Der Markt probiert nacheinander zwei Deutungen derselben Zahl – erst „gut für Kurse, weil zinssenkend“, dann „schlecht für Kurse, weil konjunkturschwach“ – und landet dazwischen.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Die erste Marktreaktion auf eine Datenveröffentlichung ist eine Hypothese, kein Urteil. Wer auf sie handelt, handelt auf halbem Informationsstand – ein Grund mehr, Datentage als Beobachter statt als Schnellhändler zu verbringen.',
      },
    ],
  },
  {
    slug: 'datenwoche-cpi-rba-bip-2026-08-09',
    title: 'Die Woche voraus: US-Inflation am Mittwoch ist der Haupttermin',
    metaTitle: 'Woche voraus: US-Inflation am Mittwoch',
    teaser:
      'US-Verbraucherpreise am Mittwoch, Notenbank in Australien, BIP aus London und der Eurozone: Warum schon die Prognosewerte selbst die Kurse bewegen.',
    category: 'Märkte',
    publishedAt: '2026-08-09T21:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Wirtschaftskalender', 'Inflation', 'Notenbanken'],
    relatedTopics: ['notenbanken-geldpolitik', 'boerse', 'inflation'],
    relatedSymbols: ['sp500', 'ftse-100', 'asx-200', 'euro-stoxx-50'],
    sources: [
      {
        label:
          'FXStreet, „Prognose für die kommende Woche: US-Inflation steht nächste Woche im Mittelpunkt“ vom 7.8.2026, 19:34 Uhr GMT, abgerufen 9.8.2026, 19:25 Uhr UTC',
        url: 'https://www.fxstreet.de.com/news/prognose-fur-die-kommende-woche-us-inflation-steht-nachste-woche-im-mittelpunkt-202608071934',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Nach der Arbeitsmarktwoche kommt die Preiswoche: Am Mittwoch erscheint der **US-Verbraucherpreisindex** für Juli. Die Prognose liegt laut FXStreet bei 3,4 Prozent für die Gesamtrate und 2,5 Prozent für die dort ausgewiesene Kernrate; am Donnerstag folgen mit Hammack und Barkin zwei Fed-Redner, dazu im Wochenverlauf Erzeugerpreise, Einzelhandelsumsätze und das Michigan-Konsumklima.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die zweite Reihe: Australien, London, Brüssel',
      },
      {
        type: 'list',
        items: [
          '**Dienstag:** Die australische Notenbank RBA entscheidet über den Leitzins – erwartet wird laut FXStreet, dass sie ihn bei 4,35 Prozent belässt; wichtiger als die Entscheidung dürfte die Begleiterklärung sein.',
          '**Donnerstag:** Großbritannien meldet das BIP für das zweite Quartal – die Prognose sieht eine Verlangsamung auf 0,4 nach 0,6 Prozent.',
          '**Freitag:** Die Eurozone legt die erste BIP-Schätzung für das zweite Quartal vor – erwartet werden 0,4 Prozent zum Vorquartal und 1,0 Prozent zum Vorjahr.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum die Prognose selbst schon ein Kurs ist',
      },
      {
        type: 'paragraph',
        text: 'Dass ein Kalender voller Zahlen Kurse bewegt, liegt nicht an den Zahlen allein, sondern am Abstand zur Erwartung. Die Prognosewerte – 3,4 Prozent Inflation, 4,35 Prozent Leitzins, 0,4 Prozent Wachstum – sind bereits in den Kursen enthalten, bevor die Daten erscheinen. Ein Ergebnis exakt auf Prognose ist deshalb oft ein Nicht-Ereignis; eine Abweichung um wenige Zehntel kann dagegen Renditen, Währungen und Aktien gleichzeitig bewegen – die vergangene Woche hat es vorgeführt.',
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Wer den Wirtschaftskalender liest, sollte neben dem Termin immer die Konsensprognose notieren. Nicht um zu handeln – sondern um am Abend zu verstehen, warum sich das Depot bewegt hat oder eben nicht.',
      },
    ],
  },
  {
    slug: 'dax-rekord-schwacher-us-arbeitsmarkt-2026-08-08',
    title: 'Ein schwacher Jobbericht schickt den DAX auf Rekordkurs',
    teaser:
      'Enttäuschende US-Arbeitsmarktdaten ließen DAX, Dow und Nasdaq am Freitag steigen. Warum schlechte Konjunkturzahlen gute Kurse machen können.',
    category: 'Märkte',
    publishedAt: '2026-08-08T07:50:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Arbeitsmarkt', 'DAX', 'Zinserwartung'],
    relatedTopics: [
      'wie-funktioniert-der-markt',
      'notenbanken-geldpolitik',
      'risiko-und-rendite',
    ],
    relatedSymbols: ['dax', 'dow-jones', 'nasdaq-100'],
    sources: [
      {
        label:
          "wallstreet-online, „ROUNDUP: US-Beschäftigung schrumpft überraschend - 'kalte Dusche'“ (dpa-AFX, 7.8.2026), abgerufen 8.8.2026, 03:47 Uhr UTC",
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
      {
        label:
          'wallstreet-online, Aufmacher „DAX mit Wochengewinn: US-Jobdaten als Turbo: Wall Street und DAX steigen, Gold glänzt“ vom 7.8.2026, abgerufen 8.8.2026, 03:47 Uhr UTC',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: "Am Freitagabend lief über dpa-AFX die Meldung „ROUNDUP: US-Beschäftigung schrumpft überraschend - 'kalte Dusche'“. Der Aufmacher von wallstreet-online fasste die Folgen so zusammen: „Die US-Börsen haben am Freitag mit dem DAX und Europas Börsen zugelegt. Auftrieb gaben enttäuschende Zahlen zum US-Arbeitsmarkt. Öl, Gold und Silber verteuerten sich.“",
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum schwache Zahlen die Kurse heben',
      },
      {
        type: 'paragraph',
        text: 'Das klingt zunächst widersprüchlich: weniger Beschäftigung, mehr Kursgewinn. Der Mechanismus dahinter läuft über die Notenbank. Ein schwächerer Arbeitsmarkt erhöht die Wahrscheinlichkeit, dass die US-Notenbank Fed die Zinsen senkt, um die Konjunktur zu stützen. Niedrigere Zinsen bedeuten einen geringeren Abzinsungssatz für künftige Unternehmensgewinne – und ein geringerer Abzinsungssatz bedeutet rechnerisch einen höheren heutigen Kurswert.',
      },
      {
        type: 'paragraph',
        text: 'Laut der Marktübersicht von wallstreet-online schloss der **DAX** am Freitag bei 26.364,00 Punkten (+0,81 Prozent). In der Kursleiste des Portals standen am Samstagmorgen der **Dow Jones** bei 54.036,10 Punkten (+0,25 Prozent) und der **US Tech 100** bei 29.728,93 Punkten (+1,18 Prozent).',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Betroffen waren mehr als nur Aktien',
      },
      {
        type: 'paragraph',
        text: 'wallstreet-online nannte in derselben Übersicht als betroffene Werte unter anderem **Gold**, **Silber**, Öl (WTI und Brent), **Bitcoin**, **Allianz**, Münchener Rück, Daimler Truck und Lanxess – ein Hinweis darauf, dass die Zinserwartung an diesem Tag nicht nur den Aktienmarkt, sondern auch Rohstoffe und Devisen bewegte.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Ein Rekordstand, der aus einer schwachen Konjunkturmeldung entsteht, ist kein Beleg für eine starke Wirtschaft – er ist ein Beleg dafür, dass Anleger niedrigere Zinsen erwarten. Wer nur den Indexstand liest, ohne den Auslöser zu kennen, liest nur die Hälfte der Geschichte.',
      },
    ],
  },
  {
    slug: 'trump-fed-lisa-cook-entlassung-2026-08-08',
    title: 'Trump erwägt erneut die Entlassung einer Fed-Gouverneurin',
    teaser:
      'US-Medien berichten, Trump denke erneut über die Entlassung von Fed-Gouverneurin Lisa Cook nach. Warum die Unabhängigkeit der Notenbank kein Selbstzweck ist.',
    category: 'Geldpolitik',
    publishedAt: '2026-08-08T07:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Notenbank', 'Fed', 'Geldpolitik'],
    relatedTopics: ['notenbanken-geldpolitik', 'staatsanleihe', 'inflation'],
    relatedSymbols: ['dax', 'sp500', 'eur-usd'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 7.8.2026: „Fed unter Druck: Trump erwägt erneut Entlassung von Lisa Cook“, abgerufen 8.8.2026, 03:46 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
      {
        label:
          'wallstreet-online, Politiknachrichten vom 7.8.2026: „US-Medien: Trump erwägt erneut Entlassung von Fed-Vorständin“ (dpa-AFX), abgerufen 8.8.2026, 03:47 Uhr UTC',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Zwei Portale meldeten am Freitag dieselbe Geschichte: finanzen.net titelte „Fed unter Druck: Trump erwägt erneut Entlassung von Lisa Cook“, wallstreet-online übernahm eine dpa-AFX-Meldung mit der Zeile „US-Medien: Trump erwägt erneut Entlassung von Fed-Vorständin“. Das Wort „erneut“ zeigt: Es ist nicht der erste Vorstoß. Auf welcher Grundlage Trump diesmal argumentiert, geht aus den abgerufenen Übersichten nicht hervor.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum eine Notenbank unabhängig sein soll',
      },
      {
        type: 'paragraph',
        text: 'Eine gewählte Regierung hat kurzfristige Anreize: niedrige Zinsen kurbeln die Konjunktur an und kommen bei Wählern gut an, auch wenn sie langfristig die Inflation anheizen. Eine Notenbank, die vor Entlassung geschützt ist, kann Zinsen auch dann erhöhen, wenn das der amtierenden Regierung nicht passt. Genau dieser Schutz vor kurzfristigem politischem Druck ist der Grund, warum Notenbanken in den meisten Industrieländern formal unabhängig gestellt sind.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was der Markt aus einem Zweifel macht',
      },
      {
        type: 'paragraph',
        text: 'Anleger bewerten nicht nur, was eine Notenbank heute beschließt, sondern auch, wie glaubwürdig sie das in Zukunft tun kann. Wächst der Zweifel an der Unabhängigkeit, verlangen Käufer langlaufender Staatsanleihen einen höheren Zins als Ausgleich für das zusätzliche Risiko – eine Art Risikoprämie für politische Einflussnahme. Auch eine Währung kann unter einem solchen Zweifel leiden, weil Investoren eine lockerere, politisch motivierte Geldpolitik einpreisen.',
      },
      {
        type: 'paragraph',
        text: 'Bislang ist der aktuelle Vorstoß laut den vorliegenden Übersichten nur eine Erwägung, keine vollzogene Entlassung. Ob und wie sich das auf Anleiherenditen oder den Dollar auswirkt, lässt sich aus den abgerufenen Meldungen nicht ablesen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Die Unabhängigkeit einer Notenbank ist unsichtbar, solange niemand an ihr rüttelt – und wird erst dann zu einer handfesten Marktfrage, wenn ernsthaft daran gezweifelt wird. Wiederholte Vorstöße, auch erfolglose, verändern diese Wahrnehmung graduell.',
      },
    ],
  },
  {
    slug: 'gold-dritter-tag-privatanleger-treu-2026-08-08',
    title: 'Gold steigt den dritten Tag – und Privatanleger bleiben treu',
    teaser:
      'Der Goldpreis legt laut Goldreporter den dritten Tag in Folge zu, während finanzen.net Privatanleger trotz Gewinnmitnahmen als treu beschreibt.',
    category: 'Geldanlage',
    publishedAt: '2026-08-08T07:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Gold', 'Edelmetalle', 'Anlegerverhalten'],
    relatedTopics: ['rohstoffe', 'anlegerpsychologie', 'risiko-und-rendite'],
    relatedSymbols: ['gold', 'eur-jpy'],
    sources: [
      {
        label:
          'Goldreporter, „Goldpreis aktuell: Gold steigt dritten Tag in Folge – Japan rückt in den Fokus“ vom 7.8.2026, abgerufen 8.8.2026, 03:47 Uhr UTC',
        url: 'https://www.goldreporter.de/',
      },
      {
        label:
          'finanzen.net, News-Ticker vom 8.8.2026, 05:14 Uhr: „Trotz Gewinnmitnahmen: Warum Privatanleger Gold treu bleiben“, abgerufen 8.8.2026, 03:46 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Goldreporter meldete am 7. August: Der Goldpreis setze seinen Anstieg fort, dritter Tag in Folge. Als Grund nannte der Bericht „neben dem Iran-Konflikt“ nun auch „die erneute Yen-Schwäche“, die für Unsicherheit an den Finanzmärkten sorge. In der Kursleiste von finanzen.net stand Gold am Samstagmorgen bei 4.342 US-Dollar, ein Plus von 2,4 Prozent.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Wenn eine Währung schwächelt, gewinnt Gold',
      },
      {
        type: 'paragraph',
        text: 'Verliert eine große Währung wie der Yen an Stabilität, suchen manche Anleger einen Halt außerhalb jeder Währung. Gold zahlt keine Zinsen und keine Dividende, aber es ist auch die Verbindlichkeit von niemandem – anders als eine Anleihe oder ein Bankguthaben. Genau diese Eigenschaft macht es in Phasen von Währungsunsicherheit gefragt, unabhängig davon, ob die konkrete Ursache Japan, der Iran-Konflikt oder etwas Drittes ist.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Ein Preis ist kein Stimmungsbild',
      },
      {
        type: 'paragraph',
        text: 'Die zweite Meldung des Tages ergänzt ein anderes Bild: finanzen.net berichtete um 05:14 Uhr, Privatanleger blieben Gold trotz Gewinnmitnahmen treu. Das deutet auf zwei Anlegergruppen mit unterschiedlichem Verhalten hin – kurzfristig orientierte Halter, die nach dem Anstieg Gewinne realisieren, und langfristig orientierte Halter, die an ihrer Position festhalten. Wie groß jede Gruppe ist oder welche konkreten Zahlen dahinterstehen, geht aus der Übersicht nicht hervor.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Ein steigender Preis allein sagt nicht, wer kauft und wer hält. Erst die Gegenüberstellung von Kursbewegung und Anlegerverhalten zeigt, ob ein Trend von neuem Geld getragen wird oder nur davon, dass bestehende Halter nicht verkaufen.',
      },
    ],
  },
  {
    slug: 'alphabet-kartellrisiko-ki-anleihen-2026-08-08',
    title: 'Alphabet zwischen Milliardenklage und Milliardennachfrage',
    teaser:
      'Google drohen laut EU-Kartellverfahren neue Klagen, während Anleger sich zugleich um Alphabets KI-Anleihen reißen. Zwei Risiken, zwei Preise.',
    category: 'Märkte',
    publishedAt: '2026-08-08T07:35:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Alphabet', 'Kartellrecht', 'Anleihen'],
    relatedTopics: ['aktie', 'schuldverschreibung', 'risiko-und-rendite'],
    relatedSymbols: ['alphabet'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 8.8.2026, 05:01 Uhr: „Alphabet-Aktie im Blick: Google drohen Milliardenklagen - EU-Kartellstrafe entfacht neue Prozesswelle“, abgerufen 8.8.2026, 03:46 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
      {
        label:
          'finanzen.net, News-Ticker vom 7.8.2026: „Alphabet braucht Milliarden für KI - Anleger reißen sich um die Anleihen - So reagiert die Aktie“, abgerufen 8.8.2026, 03:46 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Zwei Meldungen zu Alphabet liefen kurz hintereinander über den News-Ticker von finanzen.net. Am Freitag: „Alphabet braucht Milliarden für KI - Anleger reißen sich um die Anleihen - So reagiert die Aktie“. Am Samstagmorgen um 05:01 Uhr: „Alphabet-Aktie im Blick: Google drohen Milliardenklagen - EU-Kartellstrafe entfacht neue Prozesswelle“. Die genaue Höhe einer möglichen Strafe oder der Anleihen nennt keine der beiden Zeilen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Zwei Gläubigergruppen, zwei Fragen',
      },
      {
        type: 'paragraph',
        text: 'Ein Aktionär und ein Anleihegläubiger stellen bei derselben Firma unterschiedliche Fragen. Der Aktionär fragt: Wie stark schmälert eine Kartellstrafe künftige Gewinne, und drohen daraus dauerhafte Auflagen für das Geschäftsmodell? Der Anleihegläubiger fragt enger: Kann das Unternehmen Zins und Tilgung bedienen? Bei einem Konzern mit Alphabets Cashflow kann eine Milliardenstrafe die Aktie belasten, ohne die Fähigkeit zur Schuldenbedienung ernsthaft infrage zu stellen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum eine Kartellstrafe nicht gleich ein Strukturrisiko ist',
      },
      {
        type: 'paragraph',
        text: 'Eine Geldstrafe ist zunächst ein einmaliger Aufwand. Gefährlicher für ein Geschäftsmodell sind oft nicht die Bußgelder selbst, sondern begleitende Auflagen – etwa Vorgaben, wie ein Konzern seine Marktmacht künftig nutzen darf. Ob eine solche Auflage hier im Raum steht, geht aus der abgerufenen Übersicht nicht hervor; sie berichtet nur von einer „neuen Prozesswelle“.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Dass Anleger sich gleichzeitig um Alphabets Anleihen reißen und die Aktie auf Klagerisiken beobachtet wird, ist kein Widerspruch. Es zeigt nur, dass Aktien- und Anleihemarkt unterschiedliche Fragen an dasselbe Unternehmen stellen – und nicht zwingend zur gleichen Zeit dieselbe Antwort geben.',
      },
    ],
  },
  {
    slug: 'goldman-jpmorgan-ki-anleihen-handelskoerbe-2026-08-08',
    title: 'Goldman und JPMorgan verpacken den KI-Boom in Handelskörbe',
    teaser:
      'Zwei Großbanken bringen Handelskörbe für KI-Anleihen an den Markt – während eine andere Meldung fragt, wer den KI-Boom eigentlich bezahlen kann.',
    category: 'Märkte',
    publishedAt: '2026-08-08T07:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['KI-Boom', 'Anleihen', 'Kreditmarkt'],
    relatedTopics: ['schuldverschreibung', 'schulden-und-kredit', 'risiko-und-rendite'],
    relatedSymbols: ['goldman-sachs', 'jpmorgan', 'amazon'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 8.8.2026, 05:32 Uhr: „Goldman und JPMorgan bringen Handelskörbe für KI-Anleihen an den Markt“, abgerufen 8.8.2026, 03:46 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
      {
        label:
          'finanzen.net, News-Ticker vom 8.8.2026, 02:37 Uhr: „Cashflow-Schock bei Amazon, SpaceX und Lucid: Wer kann sich den KI-Boom leisten?“, abgerufen 8.8.2026, 03:46 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Um 05:32 Uhr meldete finanzen.net: „Goldman und JPMorgan bringen Handelskörbe für KI-Anleihen an den Markt“. Etwas früher, um 02:37 Uhr, stand dort eine zweite Zeile: „Cashflow-Schock bei Amazon, SpaceX und Lucid: Wer kann sich den KI-Boom leisten?“. Konkrete Zahlen zu Volumen der Handelskörbe oder zur Höhe der Cashflow-Belastung nennt keine der beiden Meldungen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was ein Handelskorb für Anleihen ist',
      },
      {
        type: 'paragraph',
        text: 'Ein Handelskorb bündelt mehrere einzelne Wertpapiere – hier offenbar Anleihen von Unternehmen mit KI-Bezug – zu einem einzigen handelbaren Produkt, ähnlich wie ein ETF mehrere Aktien bündelt. Für Anleger bedeutet das: statt eine einzelne Anleihe zu bewerten, kaufen sie eine Wette auf ein ganzes Thema. Das senkt das Risiko eines einzelnen Ausfalls, verteilt aber auch die Frage, ob das Thema insgesamt trägt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Wer bezahlt den Ausbau eigentlich?',
      },
      {
        type: 'paragraph',
        text: 'Ein Unternehmen kann seine KI-Investitionen aus zwei Quellen finanzieren: aus dem laufenden operativen Cashflow oder über neue Schulden. Die zweite Meldung nennt Amazon, SpaceX und Lucid im Zusammenhang mit einem „Cashflow-Schock“ – ein Hinweis darauf, dass mindestens bei einem Teil der Branche der operative Geldfluss mit dem Investitionstempo nicht mithält. Ob und wie stark das bei den genannten Unternehmen einzeln zutrifft, lässt sich aus der Überschrift allein nicht ablesen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Ein Handelskorb macht es leichter, auf einen Trend zu setzen – er ändert aber nichts daran, dass am Ende jede einzelne Anleihe darin nur so gut ist wie der Cashflow des Unternehmens, das sie ausgegeben hat. Je mehr Kapital über Schulden statt aus laufenden Einnahmen in den KI-Ausbau fließt, desto mehr hängt vom Tempo künftiger Erträge ab.',
      },
    ],
  },
  {
    slug: 'bofa-bull-bear-indikator-extremsignal-2026-08-08',
    title: 'Bank of America warnt: Der Bull-&-Bear-Indikator schlägt Alarm',
    metaTitle: 'BofA-Indikator warnt vor Marktphase',
    teaser:
      'Bank of America meldet ein Extremsignal ihres Bull-&-Bear-Indikators. Was ein Stimmungsindikator misst – und warum er kein Kaufsignal liefert.',
    category: 'Märkte',
    publishedAt: '2026-08-08T07:25:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Sentiment', 'Aktienmarkt', 'BofA'],
    relatedTopics: ['anlegerpsychologie', 'risiko-und-rendite', 'wann-kaufen-verkaufen'],
    relatedSymbols: ['sp500', 'dax'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 7.8.2026: „Bank of America warnt vor Euphorie am Aktienmarkt: Bull-&-Bear-Indikator sendet Extrem-Signal“, abgerufen 8.8.2026, 03:46 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'finanzen.net meldete am Freitag: „Bank of America warnt vor Euphorie am Aktienmarkt: Bull-&-Bear-Indikator sendet Extrem-Signal“. Den genauen Stand des Indikators nennt die Übersicht nicht, nur die Einstufung als Extremsignal.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was ein Stimmungsindikator überhaupt misst',
      },
      {
        type: 'paragraph',
        text: 'Ein Bull-&-Bear-Indikator wie der von Bank of America fasst typischerweise mehrere Marktkennzahlen zu einer Zahl zusammen – etwa Kapitalflüsse zwischen Anlageklassen, die Positionierung von Fondsmanagern oder die Marktbreite. Er misst also nicht, was ein Unternehmen wert ist, sondern wie einheitlich Marktteilnehmer gerade in dieselbe Richtung positioniert sind.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum Extremwerte als Warnung gelesen werden',
      },
      {
        type: 'paragraph',
        text: 'Die dahinterliegende Logik ist antizyklisch: Wenn praktisch alle Marktteilnehmer bereits optimistisch positioniert sind, gibt es kaum noch neues Kapital, das nachziehen und den Kurs weiter treiben könnte. Historisch fielen extreme Optimismus-Werte häufiger mit Marktphasen zusammen, die anschließend schwächer liefen – ein Zusammenhang, keine Vorhersage für einen bestimmten Tag.',
      },
      {
        type: 'paragraph',
        text: 'Genau darin liegt die Grenze eines solchen Indikators: Ein Extremwert kann Wochen oder Monate bestehen bleiben, bevor sich etwas ändert – oder auch gar nicht zu einer Korrektur führen. Er beschreibt die Positionierung der Menge, nicht den nächsten Kursverlauf.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Ein Extremsignal ist ein Hinweis auf die Stimmung im Markt, keine Handlungsanweisung. Wer daraus eine feste Kauf- oder Verkaufsregel ableitet, verwechselt eine Beschreibung der Gegenwart mit einer Prognose der Zukunft.',
      },
    ],
  },
  {
    slug: 'warren-buffett-konzentration-apple-2026-08-08',
    title: 'Warren Buffetts radikale Wette auf fünf Aktien',
    teaser:
      'Hunderte Milliarden Dollar, konzentriert auf nur fünf Positionen: Was Warren Buffetts Ansatz von der üblichen Diversifikation unterscheidet.',
    category: 'Geldanlage',
    publishedAt: '2026-08-08T07:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Diversifikation', 'Portfolio', 'Warren Buffett'],
    relatedTopics: ['portfolio-aufbau', 'risiko-und-rendite', 'aktie'],
    relatedSymbols: ['apple', 'berkshire'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 8.8.2026, 04:13 Uhr: „Hunderte Milliarden US-Dollar, nur fünf Aktien: So radikal setzt Warren Buffett auf Apple-Aktien und Co“, abgerufen 8.8.2026, 03:46 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Um 04:13 Uhr meldete finanzen.net: „Hunderte Milliarden US-Dollar, nur fünf Aktien: So radikal setzt Warren Buffett auf Apple-Aktien und Co“. Buffett führt das Investmentunternehmen Berkshire Hathaway. Wie sich die genannte Summe exakt auf die fünf Positionen verteilt, geht aus der Überschrift nicht hervor.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Konzentration ist das Gegenteil von Diversifikation',
      },
      {
        type: 'paragraph',
        text: 'Diversifikation bedeutet, Kapital auf viele voneinander unabhängige Positionen zu verteilen, damit der Ausfall einer einzelnen das Gesamtergebnis kaum verändert. Ein Portfolio, das zu großen Teilen auf fünf Aktien konzentriert ist, tut das Gegenteil: Es setzt bewusst darauf, dass wenige, genau geprüfte Entscheidungen mehr wert sind als eine breite Streuung.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum das nicht ohne Weiteres übertragbar ist',
      },
      {
        type: 'paragraph',
        text: 'Konzentration erhöht die Bandbreite möglicher Ergebnisse in beide Richtungen: Trifft die Einschätzung zu, fällt der Gewinn größer aus als bei einem breit gestreuten Depot. Trifft sie nicht zu, fällt auch der Verlust größer aus. Berkshire Hathaway kann solche Positionen mit einem Team aus Analysten und jahrzehntelanger Unternehmenskenntnis eingehen – eine Ausgangslage, die bei einem einzelnen Privatanleger in aller Regel fehlt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt: Dass eine Strategie für einen der bekanntesten Investoren der Welt funktioniert, ist kein Beleg dafür, dass sie in kleinerem Maßstab genauso funktioniert. Konzentration verlangt genau die Analysetiefe, die eine breite Streuung überflüssig macht – wer die eine ohne die andere übernimmt, übernimmt nur das Risiko.',
      },
    ],
  },
  {
    slug: 'dax-berichtssaison-hoehepunkt-2026-08-07',
    title: 'Der DAX steht still, während unter ihm viel passiert',
    teaser:
      'Am Höhepunkt der Berichtssaison schloss der DAX kaum verändert. Warum ein ruhiger Indexstand nicht heißt, dass ein ruhiger Tag war.',
    category: 'Märkte',
    publishedAt: '2026-08-07T07:50:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Indizes', 'Quartalszahlen'],
    relatedTopics: ['boerse', 'wie-funktioniert-der-markt', 'aktie'],
    relatedSymbols: ['dax', 'euro-stoxx-50', 'deutsche-telekom'],
    sources: [
      {
        label:
          'onvista, Index-Analysen und Dax-Tagesrückblick vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.onvista.de/news/',
      },
      {
        label:
          'finanzen.net, „Heute im Fokus“ vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Agenturmeldungen vom Donnerstagabend lauteten fast gleich: „Dax an Berichtssaison-Höhepunkt kaum verändert“ (dpa-AFX, 16:19 Uhr) und „Leitindex kaum verändert – Telekom mit starkem Quartal“ (onvista, 15:55 Uhr). Ein Tag, an dem eine der größten Meldungssammlungen des Quartals über die Ticker lief – und der Index bewegte sich kaum.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Ein Index ist ein Durchschnitt, kein Protokoll',
      },
      {
        type: 'paragraph',
        text: 'Der DAX fasst 40 Unternehmen zu einer Zahl zusammen, gewichtet nach Börsenwert. Steigt ein Wert kräftig und fällt ein anderer ähnlich schwer, heben sich die beiden im Indexstand auf. Übrig bleibt eine ruhige Zahl über einem unruhigen Tag.',
      },
      {
        type: 'paragraph',
        text: 'Genau das beschreiben die Meldungen desselben Tages: Die **Deutsche Telekom** verdiente laut den Berichten mehr als zuvor, **Rheinmetall** senkte die Umsatzprognose. Zwei Nachrichten, die einzeln jeweils einen deutlichen Kursausschlag rechtfertigen – und die sich im Index gegenseitig auffangen.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was der Indexstand verschweigt',
        items: [
          'Marktbreite: Wie viele Titel sind gestiegen, wie viele gefallen? Ein Index bei null kann 20 zu 20 bedeuten – oder 35 zu 5 mit einem schweren Verlierer.',
          'Gewichtung: Im DAX zählt ein Schwergewicht mehr als fünf kleine Werte. Der Durchschnitt ist keiner der beteiligten Kurse.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum das für Anleger zählt',
      },
      {
        type: 'paragraph',
        text: 'Wer einen Indexfonds hält, bekommt genau diesen Durchschnitt – und das ist der Zweck. Wer einzelne Aktien hält, bekommt ihn nicht: Für ihn war der Tag entweder gut oder schlecht, je nachdem, welche Seite der Waage er im Depot hat. Der ruhige Indexstand sagt über sein Depot nichts aus.',
      },
      {
        type: 'paragraph',
        text: 'Das ist kein Argument für oder gegen eine der beiden Anlageformen. Es ist ein Argument dafür, die richtige Zahl anzusehen: Ein Index misst den Markt, nicht das eigene Depot.',
      },
    ],
  },
  {
    slug: 'wall-street-zinssorgen-2026-08-07',
    title: 'Wall Street gibt nach – warum Zinsangst zuerst die Kurse trifft',
    metaTitle: 'Zinssorgen an der Wall Street',
    teaser:
      'Nach der Rekordjagd schlossen die US-Börsen tiefer, Grund laut Agentur: Zinssorgen. Was steigende Zinsen rechnerisch mit Aktienkursen machen.',
    category: 'Märkte',
    publishedAt: '2026-08-07T07:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Zinsen', 'Wall Street'],
    relatedTopics: ['notenbanken-geldpolitik', 'aktie', 'risiko-und-rendite'],
    relatedSymbols: ['sp500', 'nasdaq-100', 'dow-jones'],
    sources: [
      {
        label:
          'onvista, „Aktien New York Schluss: Verluste nach Rekordjagd – Zinssorgen sind zurück“ (dpa-AFX, 6.8.2026, 20:32 Uhr), abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.onvista.de/news/',
      },
      {
        label: 'wallstreet-online, Kursleiste vom 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die dpa-AFX-Meldung vom Donnerstagabend trug den Titel „Verluste nach Rekordjagd – Zinssorgen sind zurück“. In der Kursleiste von wallstreet-online stand am Freitagmorgen um 03:33 Uhr UTC der **Dow Jones** bei 53.901,32 Punkten (−0,92 Prozent), der **US Tech 100** bei 29.381,54 Punkten (−0,51 Prozent).',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Rechenweg dahinter',
      },
      {
        type: 'paragraph',
        text: 'Eine Aktie ist rechnerisch nichts anderes als die Summe aller Gewinne, die das Unternehmen künftig ausschüttet – abgezinst auf heute. Abzinsen heißt: Ein Euro in zehn Jahren ist weniger wert als ein Euro heute, und wie viel weniger, bestimmt der Zins.',
      },
      {
        type: 'paragraph',
        text: 'Steigt der Zins, steigt der Abschlag auf alles Künftige. Der Gewinn des Unternehmens hat sich nicht geändert, der Preis, den man dafür zahlen will, schon. Deshalb fallen Kurse auf eine Zinsmeldung hin, ohne dass ein einziges Unternehmen etwas gemeldet hätte.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum es Technologiewerte härter trifft',
      },
      {
        type: 'paragraph',
        text: 'Bei einem Versorger liegt der Gewinn überwiegend in den nächsten Jahren. Bei einem Wachstumsunternehmen liegt er überwiegend weit in der Zukunft – und je weiter weg ein Betrag liegt, desto stärker wirkt der Abschlag auf ihn. Ein höherer Zins entwertet ferne Gewinne stärker als nahe.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Warum Wachstumswerte stärker ausschlagen',
        items: [
          'Naher Gewinn: Ein Betrag in zwei Jahren verliert durch einen höheren Zins nur wenig an heutigem Wert.',
          'Ferner Gewinn: Derselbe Betrag in fünfzehn Jahren verliert deutlich mehr – der Abschlag wirkt über die ganze Laufzeit.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt, ist keine Handlungsanweisung, sondern eine Einordnung: Wer ein Depot mit Schwerpunkt auf Wachstumswerten hält, hat damit auch eine Wette auf den Zinspfad im Depot – ob er sie so gemeint hat oder nicht.',
      },
    ],
  },
  {
    slug: 'zinserwartung-eingepreist-2026-08-07',
    title: 'Wenn plötzlich Zinserhöhungen im Raum stehen',
    teaser:
      'Am Markt kursiert die Erwartung von drei Zinserhöhungen noch 2026. Warum nicht die Entscheidung den Kurs bewegt, sondern die Überraschung.',
    category: 'Geldpolitik',
    publishedAt: '2026-08-07T07:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Zinsen', 'Notenbank'],
    relatedTopics: ['notenbanken-geldpolitik', 'inflation', 'staatsanleihe'],
    relatedSymbols: ['sp500', 'dax'],
    sources: [
      {
        label:
          'wallstreet-online, Aufmacher „Fed-Hammer für die Börse: Noch 2026: Drei Zinserhöhungen stehen plötzlich im Raum“, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
      {
        label:
          'onvista, „Aktien New York Schluss: Verluste nach Rekordjagd – Zinssorgen sind zurück“ (dpa-AFX, 6.8.2026), abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.onvista.de/news/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Auf der Nachrichtenseite von wallstreet-online stand am Freitagmorgen ein Aufmacher mit der Zeile „Noch 2026: Drei Zinserhöhungen stehen plötzlich im Raum“. Am Abend zuvor hatte dpa-AFX die Verluste an der Wall Street mit zurückgekehrten Zinssorgen begründet.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Erwartung ist nicht Beschluss',
        items: [
          'Die Schlagzeile beschreibt, womit Marktteilnehmer rechnen – nicht, was entschieden wurde.',
          'Was eine Notenbank tatsächlich tut, steht erst nach ihrer Sitzung fest. Alles davor ist Einschätzung.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der wichtigste Satz über Notenbanken',
      },
      {
        type: 'paragraph',
        text: '**Was erwartet wird, steckt schon im Kurs.** Wenn alle Marktteilnehmer mit einer Zinserhöhung rechnen, haben sie ihre Käufe und Verkäufe längst danach ausgerichtet. Kommt die Erhöhung dann, passiert wenig – sie war eingepreist.',
      },
      {
        type: 'paragraph',
        text: 'Bewegung entsteht nur aus der **Abweichung**: aus einer Erhöhung, mit der niemand gerechnet hat, aus einer ausbleibenden, die alle erwartet hatten, oder aus einem Halbsatz in der Pressekonferenz, der den erwarteten Pfad verschiebt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum eine Schlagzeile schon reicht',
      },
      {
        type: 'paragraph',
        text: 'Genau deshalb bewegen sich Kurse an einem Tag ohne Notenbanksitzung. Verschiebt sich die Erwartung – etwa von „keine Erhöhung mehr in diesem Jahr“ zu „vielleicht drei“ –, dann ändert sich der Preis heute, obwohl die Entscheidung erst Monate später fällt.',
      },
      {
        type: 'paragraph',
        text: 'Für den Alltag heißt das: Der Kalender einer Notenbank ist kein Fahrplan für Kursbewegungen. Die Bewegung ist meist längst vorher gelaufen, verteilt über all die Tage, an denen sich die Erwartung Stück für Stück verschoben hat.',
      },
    ],
  },
  {
    slug: 'telekom-rheinmetall-prognose-2026-08-07',
    title: 'Telekom verdient mehr, Rheinmetall senkt die Prognose',
    teaser:
      'Zwei Meldungen aus derselben Berichtssaison, zwei Richtungen. Warum eine gesenkte Prognose oft schwerer wiegt als ein gutes Quartal.',
    category: 'Geldanlage',
    publishedAt: '2026-08-07T07:35:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Quartalszahlen', 'Prognose'],
    relatedTopics: ['aktie', 'wann-kaufen-verkaufen', 'anlegerpsychologie'],
    relatedSymbols: ['deutsche-telekom', 'rheinmetall', 'dax'],
    sources: [
      {
        label:
          'finanzen.net, „Heute im Fokus“ vom 6.8.2026: „Rheinmetall senkt Umsatzprognose – Telekom verdient mehr“, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
      {
        label:
          'onvista, Dax-Tagesrückblick vom 6.8.2026, 15:55 Uhr, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.onvista.de/news/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Übersicht von finanzen.net fasste den 6. August so zusammen: „Rheinmetall senkt Umsatzprognose – Telekom verdient mehr“. Der onvista-Rückblick nannte die Telekom-Zahlen ein „starkes Quartal“.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Vergangenheit gegen Zukunft',
      },
      {
        type: 'paragraph',
        text: 'Ein Quartalsbericht enthält zwei sehr verschiedene Dinge. Das eine ist die **Bilanz des vergangenen Vierteljahrs** – Umsatz, Gewinn, Kosten. Das andere ist die **Prognose**, also die Erwartung des Unternehmens für die kommenden Monate.',
      },
      {
        type: 'paragraph',
        text: 'Die Bilanz beschreibt, was schon passiert ist. Der Kurs einer Aktie aber ist ein Preis für die Zukunft. Deshalb kann eine Aktie nach Rekordzahlen fallen, wenn die Prognose enttäuscht – und nach mittelmäßigen Zahlen steigen, wenn der Ausblick besser ist als befürchtet.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum eine Senkung besonders schwer wiegt',
      },
      {
        type: 'paragraph',
        text: 'Eine gesenkte Prognose ändert nicht nur eine Zahl, sondern auch etwas Weicheres: Sie verschiebt die Einschätzung, wie verlässlich die Angaben dieses Unternehmens sind. Wer einmal zurückrudert, dem wird die nächste Prognose weniger geglaubt – und dieser Vertrauensabschlag wirkt über das laufende Jahr hinaus.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Zwei Dinge in einem Bericht',
        items: [
          'Die Bilanz: Umsatz und Gewinn des vergangenen Quartals – Vergangenheit, bereits geschehen.',
          'Die Prognose: die eigene Erwartung für die kommenden Monate – der Teil, auf den der Kurs reagiert.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Für den Leser folgt daraus vor allem eine Lesegewohnheit: Bei jeder Meldung über Quartalszahlen zuerst fragen, ob von der Vergangenheit oder von der Zukunft die Rede ist. Die Überschrift verrät es selten.',
      },
    ],
  },
  {
    slug: 'gold-4268-dollar-etf-bestaende-2026-08-07',
    title: 'Gold über 4.200 Dollar – und was ETF-Bestände darüber verraten',
    metaTitle: 'Gold über 4.200 Dollar',
    teaser:
      'Der Goldpreis stieg am Donnerstag auf 4.268 Dollar, die Bestände des größten Gold-ETF wachsen die dritte Woche. Was der zweite Wert erklärt.',
    category: 'Märkte',
    publishedAt: '2026-08-07T07:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Gold', 'ETF'],
    relatedTopics: ['rohstoffe', 'etf', 'waehrungen-wechselkurse'],
    relatedSymbols: ['gold', 'silber', 'eur-usd'],
    sources: [
      {
        label:
          'Goldreporter, „Goldpreis aktuell: Gold steigt weiter – Anschlusskäufe nach dem Ausbruch“ vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.goldreporter.de/',
      },
      {
        label:
          'Goldreporter, „Größter Gold-ETF: Bestände steigen dritte Woche in Folge“ vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.goldreporter.de/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Goldreporter meldete am 6. August: „Der Goldpreis steigt am Donnerstag auf 4.268 USD. Nach dem kräftigen Ausbruch am Vortag sorgen Anschlusskäufe für weiteres positives Momentum.“ Zugleich stiegen laut derselben Quelle die Bestände des größten Gold-ETF die dritte Woche in Folge.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum die zweite Zahl die interessantere ist',
      },
      {
        type: 'paragraph',
        text: 'Ein Preis sagt, was zuletzt bezahlt wurde. Er sagt nicht, wie viel gekauft wurde. Ein Gold-ETF muss aber für jeden zusätzlichen Anteil physisches Gold einlagern – seine Bestandsmenge ist damit eine unmittelbare Spur der Nachfrage.',
      },
      {
        type: 'paragraph',
        text: 'Steigt der Preis und der Bestand zugleich, kommt die Bewegung aus tatsächlichen Käufen. Steigt der Preis, während der Bestand schrumpft, trägt sie sich aus anderen Quellen – und ist damit schwächer unterlegt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Euro-Anleger rechnet anders',
      },
      {
        type: 'paragraph',
        text: 'Gold wird in Dollar notiert. Wer in Euro rechnet, hat immer **zwei** Ursachen für seine Rendite: die Bewegung des Goldpreises und die Bewegung des Wechselkurses. Ein steigender Goldpreis bei gleichzeitig stärkerem Euro kann für einen Anleger im Euroraum unter dem Strich ein Nullsummenspiel sein.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Zwei Ursachen für eine Euro-Rendite',
        items: [
          'Der Goldpreis in Dollar – die Bewegung, über die berichtet wird.',
          'Der Wechselkurs Euro zu Dollar – die Bewegung, die im deutschen Bericht meist fehlt.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Was dieser Artikel nicht sagt: warum der Ausbruch stattfand. Die Meldung nennt Anschlusskäufe – das beschreibt das Verhalten, nicht den Anlass. Wo eine Ursache nicht belegt ist, bleibt sie hier offen.',
      },
    ],
  },
  {
    slug: 'zentralbanken-goldkaeufe-2026-08-07',
    title: 'Polen kauft Gold – warum Notenbanken das überhaupt tun',
    teaser:
      'Laut Goldreporter kauft Polen kräftig zu, Südkorea erstmals seit 13 Jahren. Was Gold in einer Währungsreserve soll, wenn es keine Zinsen zahlt.',
    category: 'Geldpolitik',
    publishedAt: '2026-08-07T07:25:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Gold', 'Notenbank'],
    relatedTopics: ['notenbanken-geldpolitik', 'geldsystem', 'rohstoffe'],
    relatedSymbols: ['gold'],
    sources: [
      {
        label:
          'Goldreporter, „Goldreserven weltweit: Polen kauft kräftig zu – weitere große Käufer am Markt“ vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.goldreporter.de/',
      },
      {
        label:
          'Goldreporter, „Südkoreas Zentralbank kauft erstmals seit 13 Jahren wieder Gold“, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.goldreporter.de/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Goldreporter berichtete am 6. August über die weltweiten Goldreserven: Polen kaufe kräftig zu, weitere große Käufer seien am Markt. In derselben Beitragsliste steht die Meldung, dass Südkoreas Zentralbank erstmals seit 13 Jahren wieder Gold gekauft habe.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was eine Währungsreserve ist',
      },
      {
        type: 'paragraph',
        text: 'Eine Notenbank hält Vermögenswerte, mit denen sie im Notfall handlungsfähig bleibt – etwa um die eigene Währung zu stützen oder Auslandsschulden zu bedienen. Der größte Teil davon sind üblicherweise Fremdwährungen, vor allem Staatsanleihen in Dollar und Euro.',
      },
      {
        type: 'paragraph',
        text: 'Gold ist in dieser Aufstellung der Sonderfall: Es zahlt **keine Zinsen**. Wer eine Anleihe hält, bekommt laufend etwas dafür; wer Gold hält, bekommt nichts. Rein nach Ertrag betrachtet ist Gold in einer Reserve ein schlechtes Geschäft.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum es trotzdem gekauft wird',
      },
      {
        type: 'paragraph',
        text: 'Weil Gold eine Eigenschaft hat, die keine Anleihe besitzt: Es ist die Verbindlichkeit von niemandem. Eine Staatsanleihe ist immer ein Versprechen eines anderen Staates – und die Erfahrung, dass ein solches Versprechen eingefroren oder gestrichen werden kann, ist für Notenbanken kein theoretischer Gedanke.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Anleihe gegen Gold in einer Reserve',
        items: [
          'Staatsanleihe: zahlt Zinsen, ist aber das Versprechen eines anderen Staates.',
          'Gold: zahlt nichts, ist dafür die Verbindlichkeit von niemandem.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Für Privatanleger ist die Übertragung heikel: Eine Notenbank denkt in Jahrzehnten und hat kein Renteneintrittsdatum. Wer daraus ableitet, was im eigenen Depot sinnvoll ist, überträgt eine Aufgabenstellung, die mit der eigenen wenig zu tun hat.',
      },
    ],
  },
  {
    slug: 'oelvorraete-preisreaktion-2026-08-07',
    title: 'Volle Öltanks trotz Krise – und zwei Zahlen zum selben Preis',
    metaTitle: 'Ölvorräte und zwei Prozentzahlen',
    teaser:
      'Die Weltvorräte an Öl sind kaum gesunken. Zugleich zeigten zwei Portale fast denselben Ölpreis mit +1,3 und +5,15 Prozent an. Beides stimmt.',
    category: 'Märkte',
    publishedAt: '2026-08-07T07:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Öl', 'Rohstoffe'],
    relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['brent', 'wti'],
    sources: [
      {
        label:
          'wallstreet-online, „Ölkrise mit vollen Tanks: Die weltweiten Ölvorräte sind kaum gesunken, trotz Krise“ vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
      {
        label:
          'Kursleisten von wallstreet-online (Brent 83,54, +5,15 %) und finanzen.net (Öl 83,56, +1,3 %), beide abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'wallstreet-online titelte am 6. August „Ölkrise mit vollen Tanks“ und stellte fest, dass die weltweiten Ölvorräte trotz der Krise kaum gesunken seien.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum Lagerbestände den Preis erklären',
      },
      {
        type: 'paragraph',
        text: 'Ein Ölpreis entsteht nicht aus Schlagzeilen, sondern aus dem Verhältnis von Angebot und Nachfrage – und die Lagerbestände sind der sichtbarste Teil davon. Sie sind der Puffer: Solange Tanks gefüllt sind, führt eine Störung der Förderung nicht sofort zu einem Mangel.',
      },
      {
        type: 'paragraph',
        text: 'Das erklärt eine Beobachtung, die vielen widersinnig vorkommt: Es gibt eine Krise in einer Förderregion, und der Preis bewegt sich kaum. Der Markt preist nicht die Nachricht, sondern die erwartete Knappheit – und die bleibt aus, solange der Puffer trägt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Dieselbe Zahl, zwei Prozentangaben',
      },
      {
        type: 'paragraph',
        text: 'Am Freitagmorgen um 03:33 Uhr UTC zeigte wallstreet-online Brent bei **83,54** und dazu **+5,15 Prozent**. finanzen.net zeigte Öl bei **83,56** und dazu **+1,3 Prozent**. Fast derselbe Preis, ein Unterschied von fast vier Prozentpunkten in der Veränderung.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was eine Prozentangabe offenlassen kann',
        items: [
          'Seit wann? Vortagesschluss, Vorwochenschluss oder Handelsbeginn ergeben verschiedene Zahlen.',
          'Welcher Handelsplatz? Brent und WTI sind zwei Sorten mit eigenen Preisen und eigenen Vortageswerten.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Beide Angaben sind vermutlich richtig und meinen verschiedene Bezugszeitpunkte oder Handelsplätze. Wer zwei Quellen vergleicht, vergleicht deshalb zuerst die Bezugspunkte und erst danach die Zahlen. Wer das überspringt, findet Widersprüche, die keine sind.',
      },
    ],
  },
  {
    slug: 'rwe-offshore-stopp-2026-08-07',
    title: 'RWE stoppt Offshore-Projekte – politisches Risiko im Kurs',
    teaser:
      'Laut dpa-AFX stoppt RWE Offshore-Vorhaben nach einer Übereinkunft mit Präsident Trump. Was politisches Risiko für eine Bewertung bedeutet.',
    category: 'Geldanlage',
    publishedAt: '2026-08-07T07:15:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Energie', 'Politik'],
    relatedTopics: ['aktie', 'risiko-und-rendite', 'aktien-laender-branchen'],
    relatedSymbols: ['siemens-energy', 'eon'],
    sources: [
      {
        label:
          'onvista, „Deal mit Windkraftgegner Trump: RWE stoppt Offshore-Projekte“ (dpa-AFX, 7.8.2026, 01:22 Uhr), abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.onvista.de/news/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Um 01:22 Uhr lief über dpa-AFX die Meldung „Deal mit Windkraftgegner Trump: RWE stoppt Offshore-Projekte“. Mehr als diese Zeile stand in der abgerufenen Übersicht nicht – Umfang und Bedingungen der Übereinkunft gehen daraus nicht hervor.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was politisches Risiko konkret ist',
      },
      {
        type: 'paragraph',
        text: 'Ein Offshore-Windpark ist eine Investition über Jahrzehnte: Planung, Genehmigung, Bau und Betrieb erstrecken sich über zwanzig Jahre und mehr. Die Rechnung dahinter setzt voraus, dass die Rahmenbedingungen über diesen Zeitraum ungefähr bestehen bleiben.',
      },
      {
        type: 'paragraph',
        text: 'Genau diese Voraussetzung ist der wunde Punkt. Genehmigungen, Förderzusagen und Netzanschlüsse hängen an politischen Entscheidungen, und Wahlperioden sind kürzer als Projektlaufzeiten. Ein Regierungswechsel kann eine Kalkulation entwerten, an der technisch nichts falsch war.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum Laufzeit und Politik hier kollidieren',
        items: [
          'Ein Offshore-Projekt rechnet sich über zwanzig Jahre und mehr.',
          'Eine Wahlperiode dauert vier bis fünf Jahre – die Rahmenbedingungen können sich mehrfach ändern.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus für ein Depot folgt',
      },
      {
        type: 'paragraph',
        text: 'Wer in Energie-Infrastruktur investiert, trägt eine Unsicherheit, die sich nicht aus Bilanzen ablesen lässt. Sie steht in keiner Kennzahl, taucht in keinem Kurs-Gewinn-Verhältnis auf – und entscheidet trotzdem mit über das Ergebnis. Das ist kein Argument gegen die Branche, aber ein Grund, sie nicht als Versorger-Ersatz mit sicherer Rendite zu betrachten.',
      },
    ],
  },
  {
    slug: 'd-wave-verlust-umsatz-2026-08-07',
    title: '48 Millionen Verlust bei 3,1 Millionen Umsatz',
    teaser:
      'D-Wave meldete laut wallstreet-online 48 Millionen Dollar Verlust bei 3,1 Millionen Umsatz. Warum Umsatzvielfache bei jungen Firmen in die Irre führen.',
    category: 'Geldanlage',
    publishedAt: '2026-08-07T07:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Quartalszahlen', 'Bewertung'],
    relatedTopics: ['aktie', 'risiko-und-rendite', 'anlegerpsychologie'],
    relatedSymbols: ['nasdaq-100'],
    sources: [
      {
        label:
          'wallstreet-online, „Die Aktie zahlt die Rechnung: D-Wave macht 48 Millionen US-Dollar Verlust – bei nur 3,1 Millionen Umsatz“ vom 6.8.2026, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
      {
        label:
          'finanzen.net, „Heute im Fokus“ vom 6.8.2026: „D-Wave enttäuscht“, abgerufen 7.8.2026, 03:33 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'wallstreet-online meldete am 6. August für den Quantencomputer-Anbieter D-Wave einen Verlust von **48 Millionen US-Dollar** bei einem Umsatz von **3,1 Millionen US-Dollar**. finanzen.net führte den Wert am selben Tag unter „D-Wave enttäuscht“.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was diese Relation bedeutet',
      },
      {
        type: 'paragraph',
        text: 'Das Unternehmen gibt für jeden eingenommenen Dollar ein Vielfaches aus. Bei einem jungen Technologieunternehmen ist das nicht automatisch ein Alarmzeichen – Forschung kostet, bevor sie etwas einbringt. Es bedeutet aber, dass der Betrieb aus eigener Kraft nicht trägt und laufend frisches Geld braucht.',
      },
      {
        type: 'paragraph',
        text: 'Woher dieses Geld kommt, ist die entscheidende Frage. Kommt es aus der Ausgabe neuer Aktien, sinkt der Anteil der bisherigen Eigentümer an allem, was später einmal verdient wird. Der Kurs kann steigen, während der eigene Anteil am Unternehmen schrumpft.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum das Kurs-Umsatz-Verhältnis hier versagt',
      },
      {
        type: 'paragraph',
        text: 'Bei Firmen ohne Gewinn greift das Kurs-Gewinn-Verhältnis nicht – man kann nicht durch eine negative Zahl teilen. Ersatzweise wird gern das **Kurs-Umsatz-Verhältnis** genommen. Bei einem Umsatz von 3,1 Millionen ist dieser Nenner aber so klein, dass jede Bewertung ein extremes Vielfaches ergibt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Wann Bewertungskennzahlen versagen',
        items: [
          'Kurs-Gewinn-Verhältnis: nicht berechenbar, solange der Gewinn negativ ist.',
          'Kurs-Umsatz-Verhältnis: rechnerisch möglich, aber bei winzigem Umsatz nur ein Maß für die Erwartung.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Was daraus folgt, ist keine Aussage über die Technik oder die Aussichten dieses Unternehmens – dazu geben die abgerufenen Meldungen nichts her. Es ist eine Aussage über das Werkzeug: Wer eine Firma ohne Gewinn mit Kennzahlen bewertet, die Gewinn voraussetzen, bekommt eine Zahl, die aussieht wie eine Antwort und keine ist.',
      },
    ],
  },
  {
    slug: 'siemens-auftragseingang-2026-08-06',
    title: 'Siemens meldet Rekordauftragseingang – und warum das kein Umsatz ist',
    metaTitle: 'Auftragseingang gegen Umsatz',
    teaser:
      'Siemens hat den höchsten Auftragseingang seiner Geschichte gemeldet und den Ausblick erhöht. Beides sind Versprechen, keine Erlöse.',
    category: 'Märkte',
    publishedAt: '2026-08-06T07:50:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Quartalszahlen', 'Industrie'],
    relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['siemens', 'dax'],
    sources: [
      {
        label: 'finanzen.net, Nachrichten-Ticker vom 6. August 2026, 7:03 bis 7:05 Uhr',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Um 7:04 Uhr lief über den Nachrichtenticker: **Siemens erzielt Rekordauftragseingang – Ergebnisausblick erhöht.** Mehr steht in der Meldung nicht; welche Sparte den Rekord trägt und aus welchen Regionen die Aufträge kommen, geht daraus nicht hervor.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Drei Zahlen, die gern verwechselt werden',
      },
      {
        type: 'paragraph',
        text: '**Auftragseingang** ist die Summe dessen, was Kunden im Quartal bestellt haben. **Umsatz** ist, was im Quartal geliefert und abgerechnet wurde. **Gewinn** ist, was davon nach allen Kosten übrig bleibt. Zwischen der ersten und der zweiten Zahl können bei einem Industriekonzern Jahre liegen – eine Turbine oder eine Zugflotte wird bestellt, gebaut und dann geliefert.',
      },
      {
        type: 'paragraph',
        text: 'Ein Rekord beim Auftragseingang sagt deshalb etwas über die kommenden Jahre und wenig über das vergangene Quartal. Umgekehrt kann ein Unternehmen mit vollen Büchern Umsatz machen und trotzdem am Auftragseingang schrumpfen – dann arbeitet es seinen Bestand ab, ohne ihn nachzufüllen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Das Verhältnis der beiden hat einen Namen',
      },
      {
        type: 'paragraph',
        text: 'Teilt man den Auftragseingang durch den Umsatz derselben Periode, erhält man das Book-to-Bill-Verhältnis. Über eins heißt: Es kommt mehr herein, als abgearbeitet wird, der Bestand wächst. Unter eins heißt das Gegenteil. Die Kennzahl ist in der Industrie und bei Halbleitern gebräuchlich und steht in den Quartalsberichten meist ausdrücklich dabei.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum der Ausblick oft mehr bewegt als die Zahl',
      },
      {
        type: 'paragraph',
        text: 'Dass Siemens zugleich den Ergebnisausblick erhöht hat, ist die zweite Hälfte der Meldung – und börsentäglich häufig die wichtigere. Ein Quartalsergebnis ist Vergangenheit und war zum Teil erwartet; eine erhöhte Prognose ändert die Erwartung an die Zukunft. Bewegen tut Kurse nicht das Erwartete, sondern die Abweichung davon.',
      },
      {
        type: 'paragraph',
        text: 'Was diese Meldung **nicht** hergibt: ob der Kurs darauf gestiegen ist. Die Ticker-Zeile nennt keine Reaktion, und wir tragen keine nach, die wir nicht gesehen haben.',
      },
    ],
  },
  {
    slug: 'telekom-rueckkauf-statt-dividende-2026-08-06',
    title: 'Telekom weitet den Aktienrückkauf aus – Rückkauf oder Dividende?',
    metaTitle: 'Aktienrückkauf gegen Dividende',
    teaser:
      'Zwei Meldungen an einem Morgen: Die Telekom verdient operativ mehr und kauft mehr eigene Aktien zurück. Was das anders macht als eine Dividende.',
    category: 'Geldanlage',
    publishedAt: '2026-08-06T07:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Aktienrückkauf', 'Dividende'],
    relatedTopics: ['aktie', 'kosten-und-gebuehren'],
    relatedSymbols: ['deutsche-telekom', 'dax'],
    sources: [
      {
        label:
          'onvista, Agentur-Meldungen (dpa-AFX) vom 6. August 2026, 4:24 bis 4:48 Uhr',
        url: 'https://www.onvista.de/news/',
      },
      {
        label: 'finanzen.net, Nachrichten-Ticker vom 6. August 2026, 7:03 bis 7:05 Uhr',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Zwei Meldungen desselben Morgens: Um 4:48 Uhr meldete die Agentur, die **Deutsche Telekom weitet ihr Aktienrückkaufprogramm deutlich aus**. Um 7:04 Uhr folgte im Ticker, sie **verdiene operativ mehr und hebe die Barmittel-Prognose leicht an**. Auch Aumovio kündigte an, überschüssige Mittel für Rückkäufe zu verwenden.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Beides gibt Geld an die Eigentümer zurück – auf verschiedenen Wegen',
      },
      {
        type: 'paragraph',
        text: 'Bei der **Dividende** überweist das Unternehmen Geld an alle Aktionäre. Die Zahl der Aktien bleibt gleich, jeder Anteil wird um den ausgeschütteten Betrag ärmer – deshalb fällt der Kurs am Ausschüttungstag rechnerisch um die Dividende.',
      },
      {
        type: 'paragraph',
        text: 'Beim **Rückkauf** kauft das Unternehmen eigene Aktien am Markt und zieht sie meist ein. Es fließt kein Geld an die Aktionäre, aber der Gewinn verteilt sich danach auf weniger Anteile. Wer nicht verkauft, hält anschließend einen größeren Anteil am selben Unternehmen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Unterschied, den man im Depot merkt',
      },
      {
        type: 'paragraph',
        text: 'Eine Dividende ist ein Zufluss und damit in Deutschland ein steuerpflichtiger Kapitalertrag im Jahr der Zahlung – unabhängig davon, ob man das Geld braucht. Beim Rückkauf entsteht kein Zufluss; ein möglicher Vorteil steckt im Kurs und wird erst beim Verkauf steuerlich wirksam. Wer den Zeitpunkt selbst wählen will, hat beim Rückkauf mehr Spielraum.',
      },
      {
        type: 'paragraph',
        text: 'Das ist kein Urteil über die bessere Form. Es ist der Grund, warum zwei Unternehmen mit gleicher Ertragslage sehr verschieden aussehen können, wenn man nur auf die Dividendenrendite schaut.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was ein Rückkauf nicht ist',
      },
      {
        type: 'paragraph',
        text: 'Er ist kein Wertzuwachs aus sich heraus. Kauft ein Unternehmen eigene Aktien über ihrem inneren Wert zurück, vernichtet es Kapital – es zahlt zu viel für etwas, das es bereits besitzt. Ob ein Rückkauf günstig war, lässt sich erst hinterher sagen, und die Meldung selbst gibt darüber nichts her.',
      },
    ],
  },
  {
    slug: 'prognose-erhoeht-merck-rational-2026-08-06',
    title: 'Merck und Rational erhöhen die Prognose – zwei Wege zum selben Satz',
    metaTitle: 'Prognose erhöht: zwei Wege',
    teaser:
      'Beide Unternehmen heben nach dem Quartal ihre Ziele an. Bei einem kommt der Zuwachs aus dem Geschäft, beim anderen aus einer Zoll-Rückzahlung.',
    category: 'Märkte',
    publishedAt: '2026-08-06T07:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Quartalszahlen', 'Prognose'],
    relatedTopics: ['aktie', 'risiko-und-rendite'],
    relatedSymbols: ['merck', 'dax'],
    sources: [
      {
        label: 'finanzen.net, Nachrichten-Ticker vom 6. August 2026, 7:03 bis 7:05 Uhr',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Zwei Zeilen aus demselben Ticker-Fenster: Um 7:03 Uhr **erhöht Merck nach robustem Quartal die Prognose**. Um 7:04 Uhr heißt es, eine **Zoll-Rückzahlung bringt Rational mehr Gewinn – Jahresziele bestätigt**.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum die Prognose zählt und nicht das Quartal',
      },
      {
        type: 'paragraph',
        text: 'Ein Quartalsbericht enthält zwei Dinge: die Ist-Zahlen der vergangenen drei Monate und die Erwartung für den Rest des Jahres, die Guidance. Die Ist-Zahlen kannte der Markt in groben Zügen schon – Analysten schätzen sie, das Unternehmen hat auf Konferenzen Hinweise gegeben. Was niemand kennt, ist die neue Guidance.',
      },
      {
        type: 'paragraph',
        text: 'Deshalb kann ein Kurs nach Rekordzahlen fallen: wenn die Zahlen gut sind, die Erwartung aber leicht gesenkt wird. Und deshalb kann er nach einem mittelmäßigen Quartal steigen, wenn die Prognose steigt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Unterschied zwischen den beiden Meldungen',
      },
      {
        type: 'paragraph',
        text: 'Merck begründet die Anhebung mit einem robusten Quartal – der Zuwachs stammt also dem Wortlaut nach aus dem laufenden Geschäft. Bei Rational nennt die Meldung ausdrücklich eine **Zoll-Rückzahlung** als Ursache des höheren Gewinns, und die Jahresziele bleiben unverändert.',
      },
      {
        type: 'paragraph',
        text: 'Eine Zoll-Rückzahlung ist ein Einmaleffekt: Sie erhöht den Gewinn dieses Quartals und wiederholt sich im nächsten Jahr nicht. Wer das ausgewiesene Ergebnis ungeprüft in die Zukunft fortschreibt, rechnet mit Geld, das nur einmal kommt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Woran man Einmaleffekte erkennt',
      },
      {
        type: 'paragraph',
        text: 'Unternehmen weisen sie meist selbst aus – als bereinigtes Ergebnis, als adjusted EBIT oder in einer Überleitungsrechnung. Der Vergleich zwischen berichtetem und bereinigtem Ergebnis ist eine der lohnendsten Minuten, die man in einen Quartalsbericht stecken kann. Steht dort ein großer Abstand, lohnt die Frage, woher er kommt.',
      },
    ],
  },
  {
    slug: 'oel-gold-hormus-2026-08-06',
    title: 'Öl unter 80 Dollar, Gold über 4.100: eine Nachricht, zwei Richtungen',
    metaTitle: 'Öl und Gold: eine Nachricht',
    teaser:
      'Die Ölpreise verharren unter der 80-Dollar-Marke, Gold sprang zuvor über 4.100 Dollar. Beides hängt an derselben Lage am Persischen Golf.',
    category: 'Märkte',
    publishedAt: '2026-08-06T07:35:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Öl', 'Gold'],
    relatedTopics: ['rohstoffe', 'waehrungen-wechselkurse'],
    relatedSymbols: ['brent', 'gold'],
    sources: [
      {
        label:
          'onvista, Agentur-Meldungen (dpa-AFX) vom 6. August 2026, 4:24 bis 4:48 Uhr',
        url: 'https://www.onvista.de/news/',
      },
      {
        label: 'Goldreporter, Marktbericht vom 5. August 2026',
        url: 'https://www.goldreporter.de/',
      },
      {
        label: 'finanzen.net, Kursleiste, abgerufen am 6. August 2026 um 5:09 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Um 4:41 Uhr meldete die Agentur: **Ölpreise unverändert – Nordseeöl verharrt unter 80-Dollar-Marke.** Um 4:24 Uhr lief eine Zeile über eine Äußerung des US-Präsidenten, er würde lieber einen Deal mit dem Iran schließen. Der Goldreporter hatte am Vortag geschrieben, der Goldpreis sei auf 4.162 Dollar gestiegen, während Fortschritte im Iran-Konflikt Ölpreis und US-Renditen drückten.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum zwei Rohstoffe gegenläufig reagieren',
      },
      {
        type: 'paragraph',
        text: 'Bei Öl schlägt eine Entspannung am Persischen Golf direkt auf die Angebotserwartung: Ein geringeres Risiko für die Straße von Hormus heißt mehr erwartetes Angebot, und mehr Angebot bei gleicher Nachfrage bedeutet einen niedrigeren Preis.',
      },
      {
        type: 'paragraph',
        text: 'Gold hat keine solche Verbindung zur Industrie. Sein Preis hängt stärker daran, was die Alternative bringt: Fallen die Renditen von Staatsanleihen, kostet es weniger, statt verzinster Papiere ein zinsloses Metall zu halten. Sinkende Renditen stützen Gold also, während sie auf Öl keine unmittelbare Wirkung haben.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Dass ein Preis stillsteht, ist auch eine Information',
      },
      {
        type: 'paragraph',
        text: 'Ein Preis, der sich nicht bewegt, wirkt wie eine Nichtmeldung. Tatsächlich heißt es: Was über Nacht bekannt wurde, war bereits eingepreist. Der Markt hatte die Erwartung schon verarbeitet, bevor die Zeile über den Ticker lief.',
      },
      {
        type: 'paragraph',
        text: 'Nachrichten bewegen Kurse nur, soweit sie **von der Erwartung abweichen**. Genau deshalb fällt ein Kurs manchmal auf gute Nachrichten – wenn die Nachricht gut ist, aber weniger gut als erwartet.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was hier offen bleibt',
      },
      {
        type: 'paragraph',
        text: 'Ob die Äußerung zum Iran der Anlass für die Preisentwicklung war, geht aus den Meldungen nicht hervor. Sie standen am selben Morgen nebeneinander; das ist eine zeitliche Nähe und noch keine Ursache.',
      },
    ],
  },
  {
    slug: 'ionq-umsatz-und-verlust-2026-08-06',
    title: 'IonQ: Umsatz wächst kräftig, Verluste bleiben – geht das zusammen?',
    metaTitle: 'Umsatzwachstum und Verlust',
    teaser:
      'Eine Meldung, die man oft liest und selten auflöst: Der Umsatz steigt deutlich, unter dem Strich steht trotzdem ein Minus. Beides kann stimmen.',
    category: 'Geldanlage',
    publishedAt: '2026-08-06T07:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Wachstum', 'Bilanz'],
    relatedTopics: ['aktie', 'risiko-und-rendite'],
    relatedSymbols: ['nasdaq-100'],
    sources: [
      {
        label: 'finanzen.net, Nachrichten-Ticker vom 6. August 2026, 7:03 bis 7:05 Uhr',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Um 7:05 Uhr stand im Ticker: **IonQ-Aktie dreht ins Plus: Umsatz wächst kräftig, doch Verluste bleiben.** Das ist eine Formulierung, die jede Woche irgendwo auftaucht – und ein Satz, an dem sich zwei Kennzahlen sauber trennen lassen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Umsatz steht oben, Gewinn steht unten',
      },
      {
        type: 'paragraph',
        text: 'Der Umsatz steht am Anfang der Gewinn- und Verlustrechnung: alles, was das Unternehmen eingenommen hat. Darunter werden Herstellkosten, Forschung, Vertrieb, Verwaltung, Zinsen und Steuern abgezogen. Was übrig bleibt, ist der Gewinn. Ein Unternehmen kann seinen Umsatz verdoppeln und trotzdem tiefer im Minus landen, wenn es die Ausgaben schneller erhöht.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Wann ein Verlust gewollt ist – und wann er zum Problem wird',
      },
      {
        type: 'paragraph',
        text: 'Bei einem jungen Technologieunternehmen ist ein Verlust oft eine Entscheidung: Es baut Kapazitäten auf, deren Erträge erst später kommen. Die Frage ist dann nicht, ob ein Minus dasteht, sondern ob der Weg zum Gewinn erkennbar ist – wachsen die Kosten langsamer als der Umsatz, verbessert sich also die Marge?',
      },
      {
        type: 'paragraph',
        text: 'Zum Problem wird der Verlust, wenn das Geld ausgeht, bevor der Punkt erreicht ist. Deshalb schaut man auf den Kassenbestand und darauf, wie viel davon je Quartal verbraucht wird. Aus dem Verhältnis ergibt sich, wie lange das Unternehmen ohne frisches Kapital durchhält.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was die Meldung nicht sagt',
      },
      {
        type: 'paragraph',
        text: 'Weder Umsatzhöhe noch Verlusthöhe noch Kassenbestand gehen aus der Ticker-Zeile hervor, und auch nicht, warum die Aktie ins Plus drehte. Wer das beurteilen will, braucht den Quartalsbericht selbst – die Schlagzeile reicht dafür nicht.',
      },
    ],
  },
  {
    slug: 'kursleiste-am-morgen-2026-08-06',
    title: 'Was eine Kursleiste um fünf Uhr morgens zeigt – und was nicht',
    metaTitle: 'Die Kursleiste am Morgen',
    teaser:
      'DAX 26.126, Nasdaq 26.363, Gold 4.264: Um 5:09 Uhr standen diese Zahlen auf dem Portal. Nur zwei davon stammen aus laufendem Handel.',
    category: 'Märkte',
    publishedAt: '2026-08-06T07:25:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Handelszeiten', 'Marktdaten'],
    relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['dax', 'nasdaq-100', 'gold', 'bitcoin'],
    sources: [
      {
        label: 'finanzen.net, Kursleiste, abgerufen am 6. August 2026 um 5:09 Uhr UTC',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Kursleiste des Portals zeigte am 6. August um 5:09 Uhr UTC unter anderem: **DAX 26.126 (−0,3 %), Euro Stoxx 50 6.477 (−0,2 %), MSCI World 4.343 (−0,1 %), Nasdaq 26.363 (−0,8 %), Bitcoin 55.973 (+0,1 %), Euro 1,1550, Öl 79,10 (−0,4 %), Gold 4.264 (+0,4 %).**',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Zu dieser Uhrzeit hat kaum eine dieser Börsen offen',
      },
      {
        type: 'paragraph',
        text: 'Xetra handelt den DAX von 9:00 bis 17:30 Uhr deutscher Zeit, die US-Börsen von 15:30 bis 22:00 Uhr. Um 7:09 Uhr deutscher Zeit ist beides geschlossen. Der DAX-Stand in der Leiste ist deshalb kein an der Börse gehandelter Kurs, sondern eine Fortschreibung aus dem außerbörslichen Handel; der Nasdaq-Stand ist der Schluss des Vorabends oder ein Terminkontrakt darauf.',
      },
      {
        type: 'paragraph',
        text: 'Anders bei Bitcoin und beim Euro-Dollar-Kurs: Krypto handelt an 365 Tagen rund um die Uhr, der Devisenmarkt von Sonntagabend bis Freitagabend durchgehend. Diese beiden Zahlen sind zum Abrufzeitpunkt tatsächlich gehandelt worden.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum das für die Prozentangabe wichtig ist',
      },
      {
        type: 'paragraph',
        text: 'Ein Minus von 0,3 Prozent beim DAX bezieht sich auf den Schluss des Vortags. Ein Plus von 0,1 Prozent bei Bitcoin bezieht sich auf einen Zeitpunkt vor 24 Stunden – ein Wert, der nie mit einem Handelsschluss zusammenfällt, weil es keinen gibt.',
      },
      {
        type: 'paragraph',
        text: 'Vergleicht man beide Prozentzahlen direkt, vergleicht man verschiedene Zeiträume mit verschiedenen Bezugspunkten. Das ist der häufigste stille Fehler beim Blick auf eine Kursleiste.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der praktische Schluss',
      },
      {
        type: 'paragraph',
        text: 'Zu jeder Kursangabe gehören zwei Angaben, die oft fehlen: der Zeitpunkt und der Handelsplatz. Fehlt eine davon, ist die Zahl nicht falsch – sie lässt sich nur nicht einordnen.',
      },
    ],
  },
  {
    slug: 'hormus-uebergangsdeal-oel-unter-79-dollar',
    title: 'Übergangsdeal in der Straße von Hormus – Öl fällt unter 79 Dollar',
    metaTitle: 'Hormus-Übergangsdeal: Öl unter 79 Dollar',
    teaser:
      'Laut Agenturbericht stehen USA und Iran vor einer Übergangslösung für die Meerenge. Brent notiert am Morgen bei rund 79 Dollar – vor zwei Tagen waren es 85.',
    category: 'Märkte',
    publishedAt: '2026-08-05T07:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Ölpreis', 'Hormus', 'Risikoprämie', 'Geopolitik'],
    relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['brent'],
    sources: [
      {
        label:
          'onvista, Agentur-Meldungen vom 5. August 2026, 4:58 Uhr (dpa-AFX): „ROUNDUP/Bericht: USA und Iran vor Übergangsdeal in Straße von Hormus“',
        url: 'https://www.onvista.de/news/',
      },
      {
        label:
          'wallstreet-online, Kurstafel am 5. August 2026 gegen 7:10 Uhr: Brent 78,97 Dollar (+0,22 %); finanzen.net zur selben Zeit 78,86 Dollar (−0,6 %)',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Um 4:58 Uhr läuft über dpa-AFX ein Bericht, wonach **die USA und der Iran vor einer Übergangslösung für die Straße von Hormus stehen**. Am Ölmarkt ist die Bewegung dazu bereits gelaufen: Brent notiert am Morgen bei knapp 79 Dollar je Fass. Am Montag standen noch rund 85 Dollar auf der Tafel, vor einer Woche über 90.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum diese Meerenge so viel Gewicht hat',
      },
      {
        type: 'paragraph',
        text: 'Die Straße von Hormus ist die Verbindung zwischen dem Persischen Golf und dem offenen Meer. An ihrer engsten Stelle ist sie gut 30 Kilometer breit, die nutzbaren Fahrrinnen sind deutlich schmaler. Durch dieses Nadelöhr fährt ein erheblicher Teil des seewärts gehandelten Öls – und es gibt für die meisten Golfstaaten keinen zweiten Weg.',
      },
      {
        type: 'paragraph',
        text: 'Ein Flaschenhals dieser Art wirkt auf den Preis anders als eine Fördermenge. Wird weniger gefördert, fehlt Öl. Wird eine Meerenge unsicher, fehlt zunächst gar nichts – es steigt nur die **Wahrscheinlichkeit**, dass etwas fehlen wird. Genau diese Wahrscheinlichkeit ist es, die im Preis mitschwingt.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Risikoprämie, in zwei Richtungen',
        items: [
          'Eskalation: Der Preis steigt, bevor ein einziges Fass ausfällt – die Möglichkeit wird eingepreist.',
          'Entspannung: Der Preis fällt, bevor ein zusätzlicher Tanker fährt – die Möglichkeit wird ausgepreist.',
          'Beides sind Erwartungspreise. Was physisch passiert, zeigt sich erst später in Lagerbeständen und Frachtraten.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '„Übergangsdeal“ ist nicht „Lösung“',
      },
      {
        type: 'paragraph',
        text: 'Das Wort in der Meldung ist wichtig. Ein Übergang ist eine Regelung auf Zeit, kein Ende des Konflikts. Der Markt preist damit keine Sicherheit ein, sondern eine geringere Wahrscheinlichkeit für die nächsten Wochen. Bleibt die Einigung aus oder wird sie gebrochen, kommt derselbe Aufschlag zurück – schneller, als er verschwunden ist.',
      },
      {
        type: 'paragraph',
        text: 'Erwähnenswert ist auch, was **nicht** in der Meldung steht: Über eine tatsächlich veränderte Zahl von Durchfahrten sagt sie nichts. Wer daraus auf Mengen schließt, schließt weiter, als die Quelle trägt.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Ein Ölpreis, der binnen zweier Tage von 85 auf 79 Dollar geht, beschreibt eine geänderte Einschätzung, keine geänderte Versorgung. Für den Tank an der Ecke zählt trotzdem der Preis – Erwartungen bezahlt man an der Zapfsäule genauso wie Knappheit.',
      },
    ],
  },
  {
    slug: 'amd-prognose-enttaeuscht-nachboerslich',
    title: 'AMD enttäuscht mit der Prognose – und die Aktie fällt, wenn niemand hinsieht',
    metaTitle: 'AMD enttäuscht mit der Prognose',
    teaser:
      'Der Chiphersteller legt Zahlen vor, der Kurs gibt nachbörslich nach. Warum die wichtigsten Kursbewegungen oft dann passieren, wenn die Börse geschlossen ist.',
    category: 'Märkte',
    publishedAt: '2026-08-05T07:35:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['AMD', 'Nachbörse', 'Prognose', 'Halbleiter'],
    relatedTopics: ['aktie', 'boerse'],
    relatedSymbols: ['amd', 'nasdaq-100'],
    sources: [
      {
        label:
          'onvista, Agentur-Meldungen vom 5. August 2026, 4:53 Uhr (dpa-AFX): „AMD enttäuscht mit Prognose – Aktie verliert nachbörslich“',
        url: 'https://www.onvista.de/news/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Meldung steht um 4:53 Uhr deutscher Zeit im Ticker: **AMD enttäuscht mit der Prognose, die Aktie verliert nachbörslich.** Beide Hälften sind lehrreich – die erste, weil es wieder um den Ausblick geht und nicht um das Quartal; die zweite, weil sie beschreibt, wo dieser Kurs gerade gehandelt wird.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was „nachbörslich“ bedeutet',
      },
      {
        type: 'paragraph',
        text: 'Der reguläre Handel an der Nasdaq endet um 16:00 Uhr New Yorker Zeit, also 22:00 Uhr deutscher Sommerzeit. Danach läuft der **nachbörsliche Handel** weiter – über elektronische Handelssysteme, mit denselben Aktien, aber unter anderen Bedingungen.',
      },
      {
        type: 'paragraph',
        text: 'Und genau in dieses Fenster legen amerikanische Unternehmen ihre Quartalszahlen. Das ist Absicht: Die Meldung soll nicht mitten in den laufenden Handel platzen, sondern von allen Marktteilnehmern gelesen werden können, bevor der reguläre Handel wieder beginnt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum diese Kurse mit Vorsicht zu lesen sind',
        items: [
          'Wenig Umsatz: Ein Bruchteil der üblichen Stückzahlen bewegt den Kurs stark.',
          'Große Spanne: Zwischen Kauf- und Verkaufskurs liegen Welten – wer dort handelt, zahlt das mit.',
          'Vorläufig: Die Bewegung der Nachbörse setzt sich am nächsten Tag oft nicht fort, sondern korrigiert sich teilweise.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Für deutsche Anleger kommt eine zweite Ebene dazu',
      },
      {
        type: 'paragraph',
        text: 'Eine US-Aktie lässt sich hierzulande über Xetra, Tradegate oder Lang & Schwarz handeln – und diese Plätze bilden den nachbörslichen US-Kurs nur näherungsweise ab, jeder mit eigener Spanne. Wer morgens um neun auf eine amerikanische Aktie sieht, sieht deshalb nicht den Kurs, zu dem sie in New York gehandelt wurde, sondern den, den ein deutscher Handelsplatz daraus macht.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Die Schlagzeile „Aktie verliert nachbörslich“ ist eine Momentaufnahme aus dem dünnsten Markt des Tages. Sie sagt, in welche Richtung die Meldung gelesen wurde – wie weit, entscheidet sich erst, wenn der reguläre Handel wieder öffnet.',
      },
    ],
  },
  {
    slug: 'dow-sp500-rekord-nasdaq-erholung',
    title: 'Rekorde für Dow und S&P 500 – drei Indizes, drei Bauweisen',
    teaser:
      'Die Wall Street schloss am Dienstag mit Bestmarken für Dow und S&P 500, die Nasdaq erholte sich kräftig. Was die Zahlen darunter eigentlich messen.',
    category: 'Märkte',
    publishedAt: '2026-08-05T07:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Dow Jones', 'S&P 500', 'Nasdaq', 'Index'],
    relatedTopics: ['boerse', 'etf'],
    relatedSymbols: ['dow-jones', 'sp500', 'nasdaq-100'],
    sources: [
      {
        label:
          'onvista, Index-Analysen vom 4. August 2026, 20:31 und 20:37 Uhr (dpa-AFX): „Aktien New York Schluss: Rekorde für Dow und S&P – Nasdaq mit Erholungsrally“',
        url: 'https://www.onvista.de/news/',
      },
      {
        label:
          'wallstreet-online, Kurstafel am 5. August 2026 gegen 7:10 Uhr: Dow Jones 54.149,39 (+1,78 %), US Tech 100 29.737,32 (+3,40 %)',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Dienstag an der Wall Street brachte **Bestmarken für den Dow Jones und den S&P 500** und eine kräftige Erholung der Nasdaq. Die Kurstafel am Mittwochmorgen zeigt den Dow bei 54.149,39 Punkten (+1,78 Prozent) und den Nasdaq-100 bei 29.737,32 (+3,40 Prozent).',
      },
      {
        type: 'paragraph',
        text: 'Drei Indizes, die im selben Satz genannt werden – und drei völlig verschiedene Rechenwerke. Wer sie nebeneinander liest, sollte wissen, was jede Zahl misst.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Dow Jones: preisgewichtet, und das ist ungewöhnlich',
      },
      {
        type: 'paragraph',
        text: 'Der Dow enthält 30 Unternehmen und gewichtet sie **nach ihrem Aktienkurs**, nicht nach ihrer Größe. Eine Aktie, die 500 Dollar kostet, zählt zehnmal so viel wie eine für 50 Dollar – unabhängig davon, welches der beiden Unternehmen mehr wert ist. Das ist ein Erbe aus der Zeit, als man Indizes mit Bleistift rechnete, und es hat eine seltsame Folge: Ein Aktiensplit ändert die Gewichtung, obwohl sich am Unternehmen nichts ändert.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'S&P 500: nach Marktkapitalisierung',
      },
      {
        type: 'paragraph',
        text: 'Der S&P 500 gewichtet nach dem **Börsenwert des frei handelbaren Anteils**. Große Unternehmen zählen mehr, kleine weniger – das ist die heute übliche Bauweise und der Grund, warum dieser Index als Maßstab für „den amerikanischen Aktienmarkt" gilt. Er ist deshalb aber auch konzentrierter, als 500 Namen vermuten lassen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Nasdaq-100: eine Auswahl, kein Marktabbild',
      },
      {
        type: 'paragraph',
        text: 'Der Nasdaq-100 enthält die 100 größten Nichtfinanzunternehmen der Nasdaq-Börse. Er ist damit weder ein Branchenindex noch ein Marktindex, sondern eine Liste mit zwei Filtern – Handelsplatz und Sektorausschluss. Dass er als „Technologieindex" gilt, ist eine Zuschreibung, keine Regel seiner Konstruktion.',
      },
      {
        type: 'table',
        caption: 'Dieselbe Schlagzeile, drei Messgeräte',
        head: ['Index', 'Gewichtung', 'Auswahl'],
        rows: [
          ['Dow Jones', 'nach Aktienkurs', '30 Unternehmen, redaktionell bestimmt'],
          ['S&P 500', 'nach Börsenwert', '500 große US-Unternehmen'],
          [
            'Nasdaq-100',
            'nach Börsenwert, gedeckelt',
            '100 größte Nichtfinanzwerte der Nasdaq',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** „Rekord" heißt bei jedem dieser drei etwas anderes. Und wer einen ETF darauf kauft, kauft die Bauweise mit – sie entscheidet über Streuung und Schwankung mehr als der Name des Index.',
      },
    ],
  },
  {
    slug: 'dhl-aktienrueckkauf-aus-zoll-rueckzahlungen',
    title: 'DHL stockt den Rückkauf auf – bezahlt aus Zoll-Rückzahlungen',
    teaser:
      'Der Konzern meldet überproportional gestiegene Gewinne und erweitert das Rückkaufprogramm. Woher das Geld kommt, ist die interessantere Hälfte der Meldung.',
    category: 'Geldanlage',
    publishedAt: '2026-08-05T07:25:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['DHL', 'Aktienrückkauf', 'Cashflow', 'Einmaleffekt'],
    relatedTopics: ['aktie', 'kosten-und-gebuehren'],
    relatedSymbols: ['deutsche-post', 'dax'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 5. August 2026, 7:01 und 7:04 Uhr: „DHL steigert Gewinne überproportional zum Umsatz im 2Q“ / „DHL stockt Aktienrückkaufprogramm auf – Mittelzuflüsse aus US-Zoll-Rückzahlungen“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Zwei Zeilen, drei Minuten auseinander: Um 7:01 Uhr meldet der Ticker, **DHL habe die Gewinne überproportional zum Umsatz gesteigert**; um 7:04 Uhr, der Konzern **stocke das Aktienrückkaufprogramm auf – mit Mittelzuflüssen aus US-Zoll-Rückzahlungen**.',
      },
      {
        type: 'paragraph',
        text: 'Gestern stand an dieser Stelle HSBC mit demselben Instrument. Heute lohnt die andere Frage: nicht was ein Rückkauf bewirkt, sondern **woher das Geld dafür kommt**.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Nicht jeder Euro ist gleich viel wert',
      },
      {
        type: 'paragraph',
        text: 'Ein Unternehmen kann eine Ausschüttung aus drei sehr verschiedenen Quellen speisen, und für die Beurteilung macht das den ganzen Unterschied:',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Woher das Geld stammt',
        items: [
          'Laufender operativer Cashflow: das Geschäft verdient es Jahr für Jahr. Am tragfähigsten.',
          'Einmaleffekt: ein Verkauf, eine Rückzahlung, ein Rechtsstreit geht gut aus. Einmal da, dann nie wieder.',
          'Schulden: der Rückkauf wird finanziert. Er erhöht dann die Rendite je Aktie und zugleich das Risiko.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Eine Zoll-Rückzahlung gehört in die zweite Kategorie. Sie ist echtes Geld und keine Buchung, aber sie wiederholt sich nicht. Ein Rückkauf daraus ist deshalb weder verdächtig noch besonders aussagekräftig – er ist eine sinnvolle Verwendung eines Sondereffekts.',
      },
      {
        type: 'heading',
        level: 2,
        text: '„Überproportional“ ist die zweite wichtige Vokabel',
      },
      {
        type: 'paragraph',
        text: 'Wenn der Gewinn stärker steigt als der Umsatz, ist die **Marge** gewachsen: Von jedem eingenommenen Euro bleibt mehr übrig. Das kann an Preisen liegen, an Kosten, an einem besseren Geschäftsmix – oder eben an Sondereffekten. Welcher Anteil hier worauf entfällt, sagt die Ticker-Überschrift nicht; das steht im Quartalsbericht.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Bei jeder Ausschüttungsmeldung lohnt eine einzige Rückfrage – ist das Geld verdient oder zugeflossen? Beides ist legitim. Nur die Erwartung für nächstes Jahr sollte man daran unterschiedlich ausrichten.',
      },
    ],
  },
  {
    slug: 'gold-steigt-trotz-aktienrekorden',
    title: 'Gold steigt auf 4.137 Dollar – während die Aktienmärkte Rekorde feiern',
    metaTitle: 'Gold steigt trotz Rekorden an den Börsen',
    teaser:
      'Das Metall legt um rund anderthalb Prozent zu, obwohl Dow und S&P 500 Bestmarken erreichen. Der vermeintliche Widerspruch beruht auf einer falschen Regel.',
    category: 'Märkte',
    publishedAt: '2026-08-05T07:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Gold', 'Korrelation', 'Sicherer Hafen', 'Streuung'],
    relatedTopics: ['rohstoffe', 'portfolio-aufbau'],
    relatedSymbols: ['gold'],
    sources: [
      {
        label:
          'wallstreet-online, Kurstafel am 5. August 2026 gegen 7:10 Uhr: Gold 4.137,19 Dollar (+1,46 %); finanzen.net zur selben Zeit 4.136 (+1,4 %)',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
      {
        label:
          'onvista, Index-Analysen vom 4. August 2026, 20:31 Uhr (dpa-AFX): „Aktien New York Schluss: Rekorde für Dow und S&P“',
        url: 'https://www.onvista.de/news/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Am Mittwochmorgen steht Gold bei **4.137 Dollar je Unze**, ein Plus von rund anderthalb Prozent – am selben Morgen, an dem die Wall Street mit Rekorden für Dow und S&P 500 aus dem Vortag kommt. Nach der landläufigen Regel dürfte das nicht zusammen passieren: Gold gilt als „sicherer Hafen", der steigt, wenn Aktien fallen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die Regel ist keine Regel, sondern eine Beobachtung',
      },
      {
        type: 'paragraph',
        text: 'Gold und Aktien laufen nicht systematisch gegeneinander. Ihre **Korrelation** – das Maß dafür, wie stark zwei Kurse gemeinsam schwanken – ist über lange Zeiträume nahe null. Nahe null heißt nicht „gegenläufig", sondern **„ohne festen Zusammenhang"**. Beide können am selben Tag steigen, beide fallen, und das eine steigen, während das andere fällt.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum das für ein Depot der bessere Fall ist',
        items: [
          'Ein perfekt gegenläufiger Wert wäre eine Versicherung – und würde langfristig genau so viel kosten.',
          'Ein Wert ohne festen Zusammenhang glättet den Verlauf, ohne die Rendite abzuschneiden.',
          'Genau das ist der Kern der Streuung: nicht Gegensätze suchen, sondern Unabhängigkeit.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was heute Morgen mitspielen kann',
      },
      {
        type: 'paragraph',
        text: 'Der Goldpreis in Dollar hat zwei Treiber, die sich an einem Tag wie diesem beide melden können: die **Zinserwartung** – sie war gestern Thema, weil die US-Arbeitsmarktdaten anstehen – und der **Dollarkurs** selbst. Der Euro steht bei 1,1536 Dollar und damit leicht fester; ein schwächerer Dollar hebt den Dollarpreis von Gold rechnerisch an, ohne dass sich für einen Käufer im Euroraum etwas ändern muss.',
      },
      {
        type: 'paragraph',
        text: 'Welcher der beiden Treiber hier überwiegt, geht aus den Kurstafeln nicht hervor – und wird hier deshalb nicht behauptet.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** „Gold steigt, wenn es kracht" ist eine Faustregel für Krisentage, keine Beschreibung des Normalfalls. Wer Gold als Beimischung hält, sollte es für die fehlende Kopplung tun – nicht für eine Gegenläufigkeit, auf die kein Verlass ist.',
      },
    ],
  },
  {
    slug: 'siemens-energy-windgeschaeft-gewinn',
    title: 'Siemens Energy: ungebremste Nachfrage – und Gewinn im Windgeschäft',
    metaTitle: 'Siemens Energy: Gewinn im Windgeschäft',
    teaser:
      'Der Konzern meldet anhaltend hohe Nachfrage und einen Gewinn in der Windsparte. Warum ein einzelnes Segment eine ganze Aktie jahrelang bestimmen kann.',
    category: 'Geldanlage',
    publishedAt: '2026-08-05T07:15:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Siemens Energy', 'Segment', 'Turnaround', 'Berichtssaison'],
    relatedTopics: ['aktie', 'aktien-laender-branchen'],
    relatedSymbols: ['siemens-energy', 'dax'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 5. August 2026, 7:04 Uhr: „Siemens Energy verzeichnet ungebremste Nachfrage – Gewinn im Windgeschäft“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Ticker-Zeile von 7:04 Uhr nennt zwei Dinge: **ungebremste Nachfrage** und **Gewinn im Windgeschäft**. Das zweite ist bei diesem Konzern die eigentliche Nachricht – und ein Musterfall dafür, wie ein einzelner Geschäftsbereich eine ganze Aktie bestimmen kann.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was ein Segment ist',
      },
      {
        type: 'paragraph',
        text: 'Große Konzerne berichten nicht nur ein Gesamtergebnis, sondern **Segmente** – abgegrenzte Geschäftsbereiche mit eigenem Umsatz und eigenem Ergebnis. Die Aufteilung folgt dem, wie das Unternehmen tatsächlich gesteuert wird, und steht im Anhang des Geschäftsberichts.',
      },
      {
        type: 'paragraph',
        text: 'Der Nutzen für den Leser: Ein Konzernergebnis ist eine Summe, und Summen verstecken. Ein Bereich, der stark verdient, kann einen zweiten tragen, der Geld verliert – von außen sieht man nur, dass unter dem Strich etwas übrigbleibt. Erst die Segmentzahlen zeigen, welcher Teil das Geschäft trägt und welcher daran zieht.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Fragen, die Segmentzahlen beantworten',
        items: [
          'Welcher Bereich verdient das Geld – und welcher verbrennt es?',
          'Wächst der profitable Teil schneller als der schwache schrumpft?',
          'Hängt die Bewertung an einem Bereich, der gerade erst dreht?',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum eine Rückkehr in die Gewinnzone besonders wirkt',
      },
      {
        type: 'paragraph',
        text: 'Ein Bereich, der Verluste schreibt, wird an der Börse meist mit null oder negativ bewertet – er zieht vom Wert des Restkonzerns ab. Kippt er in den Gewinn, ändert sich nicht nur ein Betrag in der Rechnung, sondern das Vorzeichen. Deshalb reagieren Kurse auf ein erstes positives Segmentergebnis oft stärker, als die absolute Zahl vermuten lässt.',
      },
      {
        type: 'paragraph',
        text: 'Wie hoch dieser Gewinn ausfällt und ob er von Einmaleffekten getragen wird, steht nicht in der Ticker-Zeile – und deshalb auch nicht hier.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Bei Mischkonzernen führt der Weg zum Verständnis über die Segmenttabelle, nicht über die Schlagzeile. Sie steht im Quartalsbericht, meist auf einer einzigen Seite, und beantwortet in zwei Minuten, was zehn Kommentare nicht klären.',
      },
    ],
  },
  {
    slug: 'vonovia-halbjahr-ausblick-bestaetigt',
    title: 'Vonovia bestätigt den Ausblick – wie man einen Immobilienkonzern liest',
    metaTitle: 'Vonovia bestätigt den Ausblick',
    teaser:
      'Der operative Gewinn steigt leicht, die Jahresprognose bleibt. Bei Immobilienkonzernen zählt eine andere Kennzahl als bei fast allen anderen Unternehmen.',
    category: 'Geldanlage',
    publishedAt: '2026-08-05T07:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Vonovia', 'Immobilien', 'FFO', 'Bewertung'],
    relatedTopics: ['immobilien', 'aktie'],
    relatedSymbols: ['vonovia', 'dax'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 5. August 2026, 7:03 Uhr: „Vonovia steigert operativen Gewinn leicht im 1H – Ausblick bestätigt“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Um 7:03 Uhr meldet der Ticker: **Vonovia steigert den operativen Gewinn im ersten Halbjahr leicht und bestätigt den Ausblick.** Zwei unspektakuläre Halbsätze – und doch der Anlass, eine Besonderheit dieser Branche zu erklären.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum der Jahresüberschuss hier wenig taugt',
      },
      {
        type: 'paragraph',
        text: 'Ein Wohnungskonzern hält seinen Bestand in der Bilanz und muss ihn regelmäßig neu bewerten. Steigen die Immobilienpreise, entsteht ein Gewinn, ohne dass eine Wohnung verkauft wurde. Fallen sie, entsteht ein Verlust in Milliardenhöhe, ohne dass eine Miete ausbleibt.',
      },
      {
        type: 'paragraph',
        text: 'Diese Bewertungseffekte sind buchhalterisch korrekt und für die Frage, wie das Geschäft läuft, weitgehend unbrauchbar. Ein Konzern kann im selben Jahr einen Rekordverlust ausweisen und trotzdem jeden Monat pünktlich Mieten einnehmen.',
      },
      {
        type: 'formula',
        expression: 'FFO ≈ Mieteinnahmen − Bewirtschaftung − Zinsen − laufende Steuern',
        description:
          'Der operative Gewinn eines Immobilienkonzerns wird deshalb als FFO ausgewiesen – „Funds From Operations". Er lässt Bewertungsänderungen und Verkaufsgewinne bewusst außen vor und zeigt, was das laufende Vermieten einbringt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Zinsen sind bei dieser Branche keine Nebenzeile',
      },
      {
        type: 'paragraph',
        text: 'Immobilien werden zu einem großen Teil mit Fremdkapital gehalten. Der Zinsaufwand steht deshalb mitten im operativen Ergebnis, nicht am Rand. Steigende Zinsen treffen einen Wohnungskonzern doppelt: Die Finanzierung wird teurer, und die Bewertung des Bestands sinkt, weil künftige Mieten stärker abgezinst werden.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was ein bestätigter Ausblick sagt – und was nicht',
        items: [
          'Er sagt: Das Unternehmen sieht keinen Anlass, seine Erwartung zu ändern.',
          'Er sagt nicht, ob die Erwartung ehrgeizig oder vorsichtig war.',
          'Erst im Vergleich mit dem, was der Markt unterstellt hatte, wird daraus eine gute oder schlechte Nachricht.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer Immobilienaktien anschaut, sucht zuerst den FFO und die durchschnittliche Verzinsung der Schulden – nicht den Gewinn und nicht den Buchwert. Beide Letzteren schwanken mit einer Bewertung, die niemand bezahlt hat.',
      },
    ],
  },
  {
    slug: 'spacex-billionen-prognose-aktie-faellt',
    title: 'Musk stellt Billionen-Umsätze in Aussicht – die Aktie fällt',
    teaser:
      'Eine sehr große Zahl für eine sehr ferne Zukunft bewegt den Kurs nach unten. Warum lange Prognosen an der Börse oft weniger wert sind als kurze.',
    category: 'Geldanlage',
    publishedAt: '2026-08-05T07:05:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['SpaceX', 'Prognose', 'Abzinsung', 'Bewertung'],
    relatedTopics: ['aktie', 'anlegerpsychologie'],
    relatedSymbols: ['nasdaq-100'],
    sources: [
      {
        label:
          'onvista, Agentur-Meldungen vom 5. August 2026, 4:05 Uhr (dpa-AFX): „ROUNDUP: Musk prophezeit Billionen-Umsatz für SpaceX – Aktie fällt“',
        url: 'https://www.onvista.de/news/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Meldung von 4:05 Uhr trägt ihren Widerspruch offen: **Musk prophezeit einen Billionen-Umsatz für SpaceX – und die Aktie fällt.** Das ist kein Rätsel, sondern eine Lektion darüber, was der Markt mit weit entfernten Versprechen macht.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Geld in der Zukunft ist weniger wert',
      },
      {
        type: 'paragraph',
        text: 'Der Wert eines Unternehmens ist im Kern die Summe dessen, was es künftig ausschütten kann – und jeder Betrag wird umso stärker **abgezinst**, je weiter er entfernt liegt. Das ist keine Meinung, sondern Arithmetik: Wer heute Geld anlegt, bekommt Zinsen; ein Euro in zwanzig Jahren ist deshalb heute weniger als einen Euro wert.',
      },
      {
        type: 'formula',
        expression: 'Heutiger Wert = Betrag ÷ (1 + Zins)^Jahre',
        description:
          'Bei acht Prozent Kapitalkosten ist ein Betrag in zwanzig Jahren heute noch etwa ein Fünftel wert, in dreißig Jahren ein Zehntel. Eine sehr große Zahl in sehr ferner Zukunft schrumpft in der Rechnung auf etwas Überschaubares zusammen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Dazu kommt die Wahrscheinlichkeit',
      },
      {
        type: 'paragraph',
        text: 'Neben der Zeit steht die Frage, wie sicher der Betrag überhaupt eintritt. Je weiter eine Prognose reicht, desto mehr muss dafür gutgehen – Technik, Nachfrage, Regulierung, Wettbewerb, Finanzierung. Der Markt multipliziert die große Zahl also nicht nur mit einem kleinen Abzinsungsfaktor, sondern zusätzlich mit einer Wahrscheinlichkeit, die er selbst schätzt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum ein Kurs auf große Zahlen fallen kann',
        items: [
          'Die Zahl war bereits eingepreist – dann bewegt nur noch, was zusätzlich gesagt wurde.',
          'Der genannte Zeithorizont ist länger als erwartet: dieselbe Zahl, weiter weg, heute weniger wert.',
          'Daneben stand womöglich Konkreteres zum laufenden Jahr – und das wiegt schwerer als ein Ausblick auf ein Jahrzehnt.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Welcher dieser Gründe hier zutrifft, geht aus der Ticker-Überschrift nicht hervor. Festhalten lässt sich nur, dass die Größe einer Prognose nichts über ihre Wirkung sagt.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Bei jeder Zukunftszahl gehören zwei Rückfragen dazu – **wann** und **wie sicher**. Ohne sie ist auch eine Billion nur eine Ziffernfolge; mit ihnen wird daraus ein Betrag, den man mit dem heutigen Kurs vergleichen kann.',
      },
    ],
  },
  {
    slug: 'lufthansa-gewinnausblick-kassiert',
    title: 'Lufthansa kassiert den Gewinnausblick – das wiegt schwerer als das Quartal',
    metaTitle: 'Lufthansa kassiert den Gewinnausblick',
    teaser:
      'Der Flugkonzern verdient im zweiten Quartal weniger als erwartet und nimmt zugleich die Gewinnprognose zurück. Für den Kurs zählt meist der zweite Teil.',
    category: 'Märkte',
    publishedAt: '2026-08-04T07:50:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Lufthansa', 'Prognose', 'Berichtssaison', 'Erwartung'],
    relatedTopics: ['aktie', 'anlegerpsychologie'],
    relatedSymbols: ['dax'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 4. August 2026, 7:21 Uhr: „Lufthansa verdient im 2. Quartal weniger als erwartet“ und 7:38 Uhr: „Lufthansa-Aktie: Flugkonzern kassiert Gewinn-Ausblick“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Zwei Meldungen aus derselben Viertelstunde: Um 7:21 Uhr steht im Nachrichtenticker, die **Lufthansa habe im zweiten Quartal weniger verdient als erwartet**. Um 7:38 Uhr folgt die zweite, gewichtigere – der Konzern **kassiert seinen Gewinnausblick**. Beide Meldungen betreffen dasselbe Unternehmen am selben Morgen, aber sie sagen etwas grundlegend Verschiedenes.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Das Quartal ist Vergangenheit, der Ausblick ist Gegenwart',
      },
      {
        type: 'paragraph',
        text: 'Ein Quartalsergebnis beschreibt drei Monate, die vorbei sind. Der Markt hatte diese drei Monate über Wochen beobachtet: Ölpreis, Buchungslage, Streiks, Wechselkurse – vieles davon war bereits bekannt und in den Kurs eingeflossen. Ein Ergebnis „unter Erwartung" korrigiert eine Schätzung um eine Zahl, die niemand mehr ändern kann.',
      },
      {
        type: 'paragraph',
        text: 'Ein **Ausblick** – im Fachjargon die *Guidance* – ist etwas anderes. Er ist die Aussage des Unternehmens darüber, was es für das laufende Jahr erwartet. Wer eine Aktie hält, hält keinen Anspruch auf vergangene Gewinne, sondern auf künftige. Nimmt die Geschäftsleitung ihre eigene Erwartung zurück, ändert sich damit die Grundlage jeder Bewertung, die auf dieser Erwartung aufbaute.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Drei Stufen, die oft verwechselt werden',
        items: [
          'Ist-Zahlen: Was im abgelaufenen Quartal tatsächlich verdient wurde. Historie.',
          'Analystenschätzung: Was der Markt für dieses Quartal erwartet hatte. Der Vergleichsmaßstab für „besser" oder „schlechter".',
          'Guidance: Was das Unternehmen selbst für die kommenden Quartale in Aussicht stellt. Der Teil, der die Zukunft betrifft – und deshalb meist den Kurs bewegt.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum eine Prognose überhaupt zurückgenommen wird',
      },
      {
        type: 'paragraph',
        text: 'Eine Guidance ist keine Werbeaussage, sondern eine kapitalmarktrechtlich heikle Angabe. Wer erkennt, dass sie nicht mehr zu halten ist, muss das mitteilen – und zwar zügig. Deshalb kommen solche Korrekturen fast immer zusammen mit Quartalszahlen oder als eigene Meldung vor Handelsbeginn, nie beiläufig im Laufe des Tages.',
      },
      {
        type: 'paragraph',
        text: 'Was die Lufthansa im Einzelnen zur Begründung angeführt hat, geht aus der Ticker-Überschrift nicht hervor; die vollständige Mitteilung nennt die Gründe. Für das Verständnis des Musters ist das nachrangig – die Reihenfolge bleibt dieselbe.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer an einem Berichtstag nur auf „übertroffen" oder „verfehlt" schaut, liest die Hälfte. Die Frage, die den Kurs beantwortet, lautet: Hat sich die Erwartung an das nächste Jahr verändert? Bei der Lufthansa lautet die Antwort an diesem Morgen ja.',
      },
    ],
  },
  {
    slug: 'fresenius-medical-care-uebertroffen-aktie-leichter',
    title:
      'Fresenius Medical Care übertrifft die Erwartungen – die Aktie gibt trotzdem nach',
    metaTitle: 'FMC übertrifft – die Aktie gibt trotzdem nach',
    teaser:
      'Das Unternehmen liefert im zweiten Quartal mehr, als die Analysten geschätzt hatten. Der Kurs gibt dennoch nach. Kein Widerspruch, sondern die Regel.',
    category: 'Geldanlage',
    publishedAt: '2026-08-04T07:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Berichtssaison', 'Erwartung', 'Kursreaktion', 'Bewertung'],
    relatedTopics: ['aktie', 'anlegerpsychologie'],
    relatedSymbols: ['dax'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 4. August 2026, 7:11 Uhr: „Fresenius Medical Care übertrifft in Q2 die Erwartungen – Aktie dennoch leichter“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Meldung steht um 7:11 Uhr im Ticker und trägt den Widerspruch schon in der Überschrift: **Fresenius Medical Care übertrifft im zweiten Quartal die Erwartungen – die Aktie ist dennoch leichter.** Wer das zum ersten Mal liest, hält es für einen Fehler. Es ist keiner. Es ist eines der zuverlässigsten Muster der gesamten Berichtssaison.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Erwartet ist nicht dasselbe wie eingepreist',
      },
      {
        type: 'paragraph',
        text: 'Die veröffentlichte Analystenschätzung – der *Konsens* – ist ein Durchschnitt aus den Modellen mehrerer Häuser, oft Wochen alt. Der Kurs dagegen entsteht laufend aus dem, was Käufer und Verkäufer heute für wahrscheinlich halten. Zwischen beiden liegt regelmäßig eine Lücke.',
      },
      {
        type: 'paragraph',
        text: 'Steigt eine Aktie in den Tagen vor dem Bericht, weil der Markt starke Zahlen erwartet, dann ist diese Erwartung bereits bezahlt. Kommen die Zahlen dann tatsächlich gut herein, ist nichts Neues passiert – gemessen an dem, was der Kurs schon unterstellt hatte. Es gibt nichts mehr, wofür man nachkaufen müsste; sehr wohl aber Gründe, Gewinne mitzunehmen.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Der Bezugspunkt entscheidet, nicht die Zahl',
        items: [
          'Gegenüber dem Vorjahr: sagt, wie sich das Geschäft entwickelt hat.',
          'Gegenüber dem Analystenkonsens: sagt, ob die Schätzer danebenlagen.',
          'Gegenüber dem, was der Kurs schon unterstellte: sagt, warum er sich bewegt. Diese dritte Zahl steht nirgends – man kann sie nur aus der Reaktion ablesen.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was sonst noch mitreden kann',
      },
      {
        type: 'paragraph',
        text: 'Neben der eingepreisten Erwartung gibt es weitere übliche Erklärungen: ein Ausblick, der vorsichtiger klingt als das Quartal gut war; eine Sonderbelastung, die das Ergebnis rechnerisch schönt; ein Geschäftsbereich, der schwächer läuft, während der Gesamtwert stimmt. Welche davon hier zutrifft, sagt die Ticker-Überschrift nicht – und deshalb steht sie hier auch nicht als Tatsache.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** „Besser als erwartet" ist eine Aussage über Analysten, keine über den Kurs. Wer aus Quartalszahlen kurzfristig Kursrichtungen ableiten will, wettet nicht auf das Unternehmen, sondern darauf, wie weit der Markt beim Einpreisen schon gekommen war. Das ist eine deutlich schwerere Wette, als sie in der Überschrift aussieht.',
      },
    ],
  },
  {
    slug: 'hsbc-aktienrueckkaeufe-wieder-aufgenommen',
    title:
      'HSBC nimmt die Aktienrückkäufe wieder auf – was das für einen Anteil bedeutet',
    metaTitle: 'HSBC nimmt die Aktienrückkäufe wieder auf',
    teaser:
      'Der Quartalsgewinn steigt stärker als erwartet, das Rückkaufprogramm kehrt zurück. Ein Rückkauf zahlt nichts aus – er vergrößert den Anteil, den man hält.',
    category: 'Geldanlage',
    publishedAt: '2026-08-04T07:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Aktienrückkauf', 'HSBC', 'Dividende', 'Ausschüttung'],
    relatedTopics: ['aktie', 'kosten-und-gebuehren'],
    relatedSymbols: ['hsbc'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 4. August 2026, 7:12 und 7:31 Uhr: „HSBC-Aktie: Quartalsgewinn steigt deutlich – Rückkaufprogramm kehrt zurück“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
      {
        label:
          'onvista, Agentur-Meldungen vom 4. August 2026, 5:12 Uhr (dpa-AFX): „HSBC nimmt Aktienrückkäufe wieder auf – Gewinn steigt stärker als erwartet“',
        url: 'https://www.onvista.de/news/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Zwei unabhängige Ticker melden es an diesem Morgen: **HSBC verdient im Quartal mehr als erwartet und nimmt die Aktienrückkäufe wieder auf.** Der zweite Halbsatz ist der interessantere – und der, bei dem am häufigsten falsche Vorstellungen im Umlauf sind.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was bei einem Rückkauf tatsächlich passiert',
      },
      {
        type: 'paragraph',
        text: 'Ein Unternehmen kauft eigene Aktien über die Börse zurück und zieht sie in der Regel ein. Danach existieren weniger Anteile. Wer seine Aktien behalten hat, besitzt anschließend **einen größeren Bruchteil desselben Unternehmens** – ohne etwas getan oder etwas erhalten zu haben.',
      },
      {
        type: 'formula',
        expression: 'Anteil = eigene Aktien ÷ ausstehende Aktien',
        description:
          'Der Zähler bleibt gleich, der Nenner schrumpft – der Anteil steigt. Genau deshalb steigen nach einem Rückkauf rechnerisch auch Gewinn und Dividende je Aktie, ohne dass das Unternehmen einen Euro mehr verdient.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Rückkauf oder Dividende – der Unterschied für den Anleger',
      },
      {
        type: 'table',
        caption: 'Zwei Wege, Geld an die Eigentümer zu geben',
        head: ['', 'Dividende', 'Aktienrückkauf'],
        rows: [
          ['Was ankommt', 'Geld auf dem Verrechnungskonto', 'nichts – der Anteil wächst'],
          [
            'Wer entscheidet über den Zeitpunkt',
            'das Unternehmen',
            'faktisch der Anleger, beim Verkauf',
          ],
          [
            'Deutsche Besteuerung',
            'sofort bei Zufluss',
            'erst beim Verkauf, auf den Kursgewinn',
          ],
          ['Wirkung auf die Aktienzahl', 'keine', 'sie sinkt'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Der steuerliche Punkt ist für deutsche Privatanleger der greifbarste: Eine Dividende löst im Zuflussjahr Kapitalertragsteuer aus, auch wenn man das Geld gar nicht braucht. Ein Rückkauf verschiebt den steuerbaren Vorgang auf den Tag, an dem man selbst verkauft. Das ist kein Steuervorteil im engeren Sinne, aber ein **Zeitvorteil** – und Zeit ist bei Zinseszins die entscheidende Größe.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Kein Automatismus',
        items: [
          'Ein Rückkauf hebt den Kurs nicht zwangsläufig – er verändert nur die Zahl der Anteile.',
          'Kauft ein Unternehmen zu teuer zurück, vernichtet es Wert, genau wie ein Anleger, der zu teuer kauft.',
          'Ein wiederaufgenommenes Programm ist ein Signal über die Kapitalausstattung – bei Banken zusätzlich über die Aufsicht, die solche Ausschüttungen genehmigen muss.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer Ausschüttungen vergleicht, sollte Dividendenrendite und Rückkaufvolumen zusammen betrachten. Ein Unternehmen mit niedriger Dividende und großem Rückkaufprogramm gibt seinen Eigentümern womöglich mehr zurück als eines mit hoher Dividendenrendite – es sieht nur auf keiner Dividendenliste danach aus.',
      },
    ],
  },
  {
    slug: 'dax-erstmals-ueber-26000-punkten',
    title:
      'Der Dax schließt erstmals über 26.000 Punkten – und zwei Quellen nennen zwei Zahlen',
    metaTitle: 'Dax schließt erstmals über 26.000 Punkten',
    teaser:
      'Am Montag stand zum ersten Mal eine 26 vor dem Schlussstand. Warum Anbieter dabei verschiedene Zahlen zeigen – und was der Rekord überhaupt aussagt.',
    category: 'Märkte',
    publishedAt: '2026-08-04T07:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Dax', 'Allzeithoch', 'Performanceindex', 'Kursindex'],
    relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['dax', 'euro-stoxx-50'],
    sources: [
      {
        label:
          'onvista, Dax-Tagesrückblick vom 3. August 2026, 15:55 Uhr: „Dax schließt erstmals über 26.000 Punkten – Autowerte stark“',
        url: 'https://www.onvista.de/news/',
      },
      {
        label:
          'wallstreet-online, Kurstafel am 4. August 2026 gegen 7:45 Uhr: Dax 26.068,45 Punkte (+1,43 %)',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
      {
        label:
          'finanzen.net, Kursleiste am 4. August 2026 gegen 7:45 Uhr: Dax 26.001 (+1,5 %)',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der deutsche Leitindex hat am Montag **zum ersten Mal über 26.000 Punkten geschlossen**; onvista meldete das um 15:55 Uhr im Tagesrückblick und nannte Autowerte als Treiber. Am Dienstagmorgen zeigten die Kurstafeln zwei verschiedene Zahlen für denselben Vorgang: wallstreet-online **26.068,45 Punkte** bei einem Plus von 1,43 Prozent, finanzen.net **26.001 Punkte** bei plus 1,5 Prozent.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum zwei Anbieter nicht dieselbe Zahl zeigen',
      },
      {
        type: 'paragraph',
        text: 'Beide Angaben können richtig sein, weil „der Dax" kein einzelner Preis ist, sondern eine Rechnung, die je nach Handelsplatz, Zeitstempel und Rundung anders ausfällt. Der Xetra-Schluss um 17:30 Uhr, der außerbörsliche Späthandel und ein vorbörslicher Indikationswert am nächsten Morgen sind drei verschiedene Dinge – und jede Tafel sagt, welches davon sie zeigt, nur meist im Kleingedruckten.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Der Umgang damit ist einfacher als die Ursache',
        items: [
          'Bei jeder Indexzahl mitlesen: Welcher Handelsplatz, welche Uhrzeit?',
          'Zwei abweichende Zahlen sind selten ein Fehler, meist ein anderer Messzeitpunkt.',
          'Für den eigenen Vergleich immer dieselbe Quelle nehmen – der Trend bleibt derselbe, die Nachkommastellen nicht.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was eine Rekordmarke aussagt – und was nicht',
      },
      {
        type: 'paragraph',
        text: 'Der Dax ist ein **Performanceindex**: Dividenden werden rechnerisch wieder angelegt und stecken im Punktestand mit drin. Der Kurs-Dax, der ohne Dividenden rechnet, steht deshalb weit tiefer. Wer 26.000 Punkte mit dem Punktestand eines Kursindex wie dem Euro Stoxx 50 oder dem S&P 500 vergleicht, vergleicht zwei verschieden gebaute Zahlen.',
      },
      {
        type: 'paragraph',
        text: 'Und ein Allzeithoch ist keine Aussage über die Zukunft. Ein Index, der langfristig steigt, verbringt einen erheblichen Teil seiner Zeit in der Nähe seines Hochs – das ist die arithmetische Folge des Steigens, keine Warnung und kein Kaufsignal. Wer auf einen „besseren Einstieg" wartet, wartet in einem steigenden Markt definitionsgemäß oft vergeblich.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Runde Marken sind Erzählhilfen, keine Grenzen. Interessanter als der Stand ist die Frage, wie breit er getragen wird – ob viele Werte steigen oder wenige schwere. Am Montag nennt der Rückblick ausdrücklich die Autowerte; das ist ein Hinweis auf eine Branche, nicht auf den ganzen Markt.',
      },
    ],
  },
  {
    slug: 'zalando-prognose-angepasst-wachstum-und-ergebnis',
    title: 'Zalando wächst zweistellig – und passt die Jahresprognose trotzdem an',
    metaTitle: 'Zalando wächst zweistellig und passt die Prognose an',
    teaser:
      'Der Umsatz legt im zweiten Quartal zweistellig zu, das Ergebnis bleibt unter der Erwartung. Umsatz und Gewinn sind zwei Zahlen, die auseinanderlaufen können.',
    category: 'Geldanlage',
    publishedAt: '2026-08-04T07:25:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Zalando', 'Marge', 'Umsatz', 'Berichtssaison'],
    relatedTopics: ['aktie', 'risiko-und-rendite'],
    relatedSymbols: ['dax'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 4. August 2026, 7:27 Uhr: „Zalando konkretisiert Gewinn- und Umsatzziele – 2Q-Wachstum zweistellig“ und 7:33 Uhr: „Zalando passt Jahresprognose an – Ergebnis unter Erwartung“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Im Ticker stehen zwei Meldungen sechs Minuten auseinander, und sie klingen gegensätzlich: **zweistelliges Wachstum im zweiten Quartal** – und **ein Ergebnis unter Erwartung** bei angepasster Jahresprognose. Wer nur eine der beiden liest, bekommt ein falsches Bild vom selben Unternehmen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Umsatz ist, was hereinkommt. Ergebnis ist, was bleibt.',
      },
      {
        type: 'paragraph',
        text: 'Zwischen beiden liegt die gesamte Kostenseite: Ware, Logistik, Retouren, Marketing, Personal, Abschreibungen, Zinsen, Steuern. Ein Händler kann zweistellig wachsen und trotzdem weniger verdienen – etwa wenn das Wachstum über Rabatte gekauft wurde oder das zusätzliche Volumen teurer zu bewegen ist als das bestehende.',
      },
      {
        type: 'formula',
        expression: 'Ergebnis = Umsatz × Marge',
        description:
          'Steigt der Umsatz um zehn Prozent, während die Marge um ein Fünftel nachgibt, sinkt das Ergebnis – trotz Wachstum. Deshalb steht in Quartalsberichten die Marge oft vor der Umsatzzahl.',
      },
      {
        type: 'heading',
        level: 2,
        text: '„Anpassen" ist nicht automatisch „senken"',
      },
      {
        type: 'paragraph',
        text: 'Eine Prognose kann nach oben, nach unten oder einfach **enger** gefasst werden. Der zweite Ticker-Eintrag spricht von „konkretisiert" – üblicherweise heißt das, dass aus einer Spanne eine schmalere Spanne wird, weil das Jahr zur Hälfte vorbei ist und weniger offen. Ob die Mitte dieser Spanne über oder unter der alten liegt, entscheidet, wie der Markt es liest. Die Ticker-Überschriften allein beantworten das nicht, und deshalb steht hier keine Richtung.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Bei Handelsunternehmen lohnt der Blick auf die Marge mehr als auf die Wachstumsrate. Wachstum lässt sich einkaufen; Marge muss man verdienen. Wer beides zusammen liest, versteht auch, warum eine gute und eine schlechte Nachricht am selben Morgen aus demselben Bericht stammen können.',
      },
    ],
  },
  {
    slug: 'goldpreis-ruhig-vor-us-arbeitsmarktdaten',
    title: 'Der Goldpreis steht still – weil alle auf dieselbe Zahl warten',
    teaser:
      'Vor den US-Arbeitsmarktdaten bewegt sich beim Gold wenig. Diese Ruhe ist kein Desinteresse, sondern das Ergebnis zweier Lager, die sich gegenseitig aufheben.',
    category: 'Märkte',
    publishedAt: '2026-08-04T07:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Gold', 'Arbeitsmarktdaten', 'Erwartung', 'Volatilität'],
    relatedTopics: ['rohstoffe', 'notenbanken-geldpolitik'],
    relatedSymbols: ['gold'],
    sources: [
      {
        label:
          'finanzen.net, Top News vom 4. August 2026, 7:25 Uhr: „Goldpreis: Wenig Bewegung vor US-Arbeitsmarktdaten“, dazu 7:33 Uhr: „Goldpreis vor dem nächsten Sprung? Anleger warten auf US-Daten“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
      {
        label:
          'wallstreet-online, Kurstafel am 4. August 2026 gegen 7:45 Uhr: Gold 4.062,42 Dollar (+0,22 %)',
        url: 'https://www.wallstreet-online.de/nachrichten',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Um 7:25 Uhr meldet finanzen.net **„wenig Bewegung"** beim Goldpreis vor den US-Arbeitsmarktdaten; die Kurstafel zeigt kurz darauf 4.062,42 Dollar je Unze, ein Plus von 0,22 Prozent. Acht Minuten später steht im selben Ticker die Frage nach dem „nächsten Sprung". Beides zusammen beschreibt einen Markt im Wartezustand.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Stillstand ist keine Abwesenheit von Meinung',
      },
      {
        type: 'paragraph',
        text: 'Ein Preis bewegt sich, wenn Käufer und Verkäufer ihre Einschätzung ändern. Vor einem angekündigten Termin passiert genau das nicht: Wer auf schwache Arbeitsmarktdaten setzt, hat gekauft; wer auf starke setzt, hat verkauft. Beide sind positioniert, beide warten. Der Preis steht still, obwohl unter der Oberfläche zwei entgegengesetzte Wetten mit vollem Einsatz laufen.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum ausgerechnet der Arbeitsmarkt für Gold zählt',
        items: [
          'Gold zahlt keine Zinsen. Sein Nachteil gegenüber Anleihen wächst, wenn die Zinsen steigen.',
          'Die US-Notenbank orientiert sich stark am Arbeitsmarkt. Schwache Zahlen erhöhen die Erwartung sinkender Zinsen.',
          'Sinkende Zinserwartung verkleinert also Golds Nachteil – der Umweg läuft über die Notenbank, nicht über Schmuck oder Minen.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die Bewegung entsteht an der Abweichung',
      },
      {
        type: 'paragraph',
        text: 'Entscheidend ist nicht, ob die Zahl gut oder schlecht ist, sondern **wie weit sie von der Erwartung abweicht**. Ein erwarteter Wert bewegt nichts, weil er längst im Preis steckt. Genau deshalb ist die Ruhe vor der Veröffentlichung oft der Vorbote einer starken Bewegung danach – nicht ihres Ausbleibens.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer kurz vor einem solchen Termin kauft oder verkauft, handelt nicht Gold, sondern eine Prognose über eine Statistik. Für einen langfristig aufgebauten Bestand ist der Termin dagegen weitgehend belanglos – er verschiebt einen Preis, nicht die Begründung, aus der jemand Gold hält.',
      },
    ],
  },
  {
    slug: 'dax-futures-fruehhandel-vorboerslich',
    title: 'Woher der vorbörsliche Dax kommt, wenn die Börse noch geschlossen ist',
    metaTitle: 'Woher der vorbörsliche Dax kommt',
    teaser:
      'Um 7:33 Uhr meldet der Ticker feste Dax-Futures und einen schwächeren Bund-Future. Gehandelt wird da längst – nur nicht das, was die meisten vermuten.',
    category: 'Märkte',
    publishedAt: '2026-08-04T07:15:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Futures', 'Eurex', 'Frühhandel', 'Bund-Future'],
    relatedTopics: ['derivat', 'boerse'],
    relatedSymbols: ['dax'],
    sources: [
      {
        label:
          'finanzen.net, News-Ticker vom 4. August 2026, 7:33 Uhr: „EUREX/DAX-Futures im Frühhandel etwas fester“ und 7:31 Uhr: „EUREX/Bund-Future im Frühhandel knapp im Minus“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
      {
        label:
          'finanzen.net, News-Ticker vom 4. August 2026, 7:40 Uhr: „Rekordlauf dürfte sich fortsetzen: DAX vor höherem Start“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Xetra-Handel beginnt um 9:00 Uhr. Trotzdem steht um 7:33 Uhr im Ticker, die **Dax-Futures notierten im Frühhandel etwas fester**, und um 7:40 Uhr, der Dax gehe „vor einem höheren Start" in den Tag. Woher kommt eine Kursaussage über einen Markt, der noch geschlossen ist?',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Future ist ein eigener Markt mit längeren Öffnungszeiten',
      },
      {
        type: 'paragraph',
        text: 'Ein **Future** ist ein Vertrag über einen künftigen Zeitpunkt: Der Käufer verpflichtet sich, den Index zu einem heute festgelegten Kurs abzurechnen. Gehandelt werden diese Verträge an der Terminbörse Eurex – und die öffnet deutlich früher als der Aktienhandel. Was dort morgens passiert, ist echter Handel mit echtem Geld, nur eben in einem anderen Instrument.',
      },
      {
        type: 'paragraph',
        text: 'Weil Future und Index über Arbitrage eng aneinandergekoppelt sind, ist der Future-Preis die beste verfügbare Schätzung dafür, wo der Index eröffnen wird. „Der Dax steht vorbörslich höher" heißt deshalb genau genommen: Der Future auf den Dax wird höher gehandelt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was daran unsicher bleibt',
        items: [
          'Der Frühhandel ist dünn. Wenige Aufträge bewegen den Kurs stärker als am Nachmittag.',
          'Eine Indikation ist keine Zusage: Zwischen 7:33 und 9:00 Uhr kann jede Meldung das Bild drehen.',
          'Der Future bezieht sich auf einen Termin in der Zukunft; kleine Abweichungen zum Index sind normal und kein Fehler.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Und der Bund-Future daneben',
      },
      {
        type: 'paragraph',
        text: 'Die zweite Meldung, zwei Minuten früher, betrifft den **Bund-Future** – den Terminkontrakt auf eine idealisierte zehnjährige Bundesanleihe. Er ist das Standardmaß für den deutschen Kapitalmarktzins. Fällt er, steigen die Renditen; steigt er, fallen sie. Anleihepreis und Rendite bewegen sich immer gegenläufig, und der Bund-Future macht diese Bewegung minütlich sichtbar, obwohl der Anleihemarkt selbst weit weniger transparent ist als der Aktienmarkt.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Vorbörsliche Angaben sind nützlich, um die Richtung eines Tages einzuordnen, und ungeeignet, um daraus Aufträge abzuleiten. Wer eine Order für die Eröffnung platziert, handelt in genau dem dünnsten Moment des Tages – dem, in dem die Spanne zwischen Kauf- und Verkaufskurs am größten ist.',
      },
    ],
  },
  {
    slug: 'nordex-auftraege-480-megawatt-usa',
    title:
      'Nordex meldet Aufträge über 480 Megawatt – Auftragseingang ist noch kein Umsatz',
    metaTitle: 'Nordex: Aufträge über 480 Megawatt aus den USA',
    teaser:
      'Neue US-Aufträge über mehr als 480 Megawatt meldet der Windanlagenbauer. Zwischen einer solchen Meldung und dem Geld auf dem Konto liegen mehrere Jahre.',
    category: 'Geldanlage',
    publishedAt: '2026-08-04T07:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Nordex', 'Auftragseingang', 'Auftragsbestand', 'Bilanz'],
    relatedTopics: ['aktie', 'aktien-laender-branchen'],
    relatedSymbols: ['dax'],
    sources: [
      {
        label:
          'EQS-News via finanzen.net, 4. August 2026, 7:30 Uhr: „Die Nordex Group erhält neue Aufträge über mehr als 480 MW aus den USA“',
        url: 'https://www.finanzen.net/nachrichten/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Um 7:30 Uhr läuft die Unternehmensmitteilung über den EQS-Verteiler: Die **Nordex Group hat neue Aufträge über mehr als 480 Megawatt aus den USA erhalten.** Solche Meldungen sind bei Anlagenbauern der häufigste Nachrichtentyp – und der am leichtesten misszuverstehende.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Drei Zahlen, die nacheinander kommen',
      },
      {
        type: 'table',
        caption: 'Vom Auftrag zum Gewinn',
        head: ['Größe', 'Was sie sagt', 'Wann sie in der Bilanz auftaucht'],
        rows: [
          [
            'Auftragseingang',
            'was in diesem Zeitraum neu bestellt wurde',
            'gar nicht – er steht im Lagebericht',
          ],
          [
            'Auftragsbestand',
            'die Summe aller noch nicht abgearbeiteten Aufträge',
            'gar nicht – aber er trägt die kommenden Jahre',
          ],
          [
            'Umsatz',
            'was tatsächlich geliefert und abgerechnet wurde',
            'in der Gewinn- und Verlustrechnung',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Zwischen der Bestellung einer Windkraftanlage und ihrer Abrechnung liegen Genehmigungen, Fertigung, Transport, Errichtung und Inbetriebnahme – in aller Regel mehrere Jahre. Ein guter Auftragseingang sagt deshalb etwas über die Umsätze von übermorgen, nicht über die von heute.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum die Megawatt-Angabe allein nicht reicht',
      },
      {
        type: 'paragraph',
        text: 'Megawatt sind eine technische Größe, kein Preis. Was ein Auftrag wert ist, hängt vom Preis je Megawatt ab – und der schwankt mit Wettbewerb, Stahlpreisen, Frachtkosten und Wechselkursen. Zwei Aufträge über je 480 Megawatt können sich im Ergebnisbeitrag deutlich unterscheiden. Bei einem US-Auftrag kommt hinzu, dass der Erlös in Dollar anfällt, ein Teil der Kosten aber in Euro.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Was man aus solchen Meldungen ablesen kann',
        items: [
          'Häufung über mehrere Quartale: ein Hinweis auf die Nachfragelage.',
          'Regionale Verteilung: ein Hinweis auf Abhängigkeiten von einzelnen Fördersystemen.',
          'Verhältnis von Auftragseingang zu Umsatz: liegt es über eins, wächst der Bestand – das Unternehmen füllt sein Buch schneller, als es es abarbeitet.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Eine einzelne Auftragsmeldung ist ein Datenpunkt, keine Trendwende. Sie wird erst aussagekräftig im Vergleich mit den Vorquartalen – und der steht nicht in der Meldung, sondern im Quartalsbericht.',
      },
    ],
  },
  {
    slug: 'oelpreis-fuenf-prozent-trump-iran',
    title: 'Ölpreis bricht um fünf Prozent ein – nach einem abgesagten Angriff',
    metaTitle: 'Ölpreis bricht um fünf Prozent ein',
    teaser:
      'Trump sagt Angriffe auf den Iran ab und spricht von einer nahen Einigung. Brent fällt am Morgen um fünf Prozent auf 83,87 Dollar – Freitag waren es gut 90.',
    category: 'Märkte',
    publishedAt: '2026-08-03T07:05:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Ölpreis', 'Iran', 'Geopolitik', 'Risikoprämie'],
    relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['brent'],
    sources: [
      {
        label:
          'AP (via WSLS): „Asian stocks are mixed as yen jumps against the dollar, while oil prices slip“ (3. August 2026)',
        url: 'https://www.wsls.com/business/2026/08/03/asian-stocks-are-mixed-as-yen-jumps-against-the-dollar-while-oil-prices/',
      },
      {
        label: 'Brent-Kursseite dieser Website (Yahoo-Tagesdaten, Stand 31. Juli)',
        url: 'https://iminvests.de/maerkte/brent',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Ölpreis ist am Montagmorgen eingebrochen: **Brent fiel um fünf Prozent auf 83,87 Dollar** je Fass, die US-Sorte WTI um 4,8 Prozent auf 80,58 Dollar – so die Stände aus dem frühen asiatischen Handel laut AP. Auslöser war kein Fass Öl, sondern ein Satz: US-Präsident Trump erklärte, er werde die US-Streitkräfte anweisen, **auf Angriffe gegen den Iran zu verzichten** – eine Vereinbarung zur Beendigung der Kämpfe im Nahen Osten sei nah.',
      },
      {
        type: 'paragraph',
        text: 'Zur Einordnung: Am Freitagabend hatte Brent nach den auf dieser Website geführten Tagesdaten noch bei **gut 90 Dollar** notiert. Der Preis hatte sich seit der faktischen Schließung der Straße von Hormus Ende Februar deutlich über seinem Vorkriegsniveau gehalten – zeitweise über der 100-Dollar-Marke.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die Risikoprämie – ein Preis für Wahrscheinlichkeiten',
      },
      {
        type: 'paragraph',
        text: 'Warum bewegt eine Ankündigung den Preis um fünf Prozent, obwohl sich am physischen Markt an diesem Morgen nichts geändert hat? Weil im Ölpreis eine **Risikoprämie** steckt: ein Aufschlag dafür, dass Lieferungen ausfallen *könnten*. Diese Prämie handelt nicht Fässer, sondern Wahrscheinlichkeiten. Sinkt die Wahrscheinlichkeit einer Eskalation – etwa weil ein angekündigter Angriff abgesagt wird –, schrumpft der Aufschlag sofort, ganz ohne dass ein Tanker mehr fährt.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Dieselbe Logik, zwei Richtungen',
        items: [
          'Eskalation: Der Preis steigt, bevor auch nur ein Barrel fehlt – die Möglichkeit wird eingepreist.',
          'Entspannung: Der Preis fällt, bevor zusätzliche Lieferungen fließen – die Möglichkeit wird ausgepreist.',
          'Beides sind Erwartungspreise. Die physische Knappheit zeigt sich erst später in Lagerbeständen und Frachtraten.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Ölpreis-Schlagzeilen an Tagen wie diesem beschreiben Politik, nicht Produktion. Wer die Bewegung verstehen will, fragt nicht „wo ist das Öl hin?“, sondern „welche Wahrscheinlichkeit wurde gerade neu bewertet?“ – und rechnet damit, dass dieselbe Prämie zurückkommt, wenn die Einigung ausbleibt.',
      },
    ],
  },
  {
    slug: 'yen-intervention-usa-japan-155',
    title: 'USA und Japan stützen den Yen – die Intervention ist offiziell',
    teaser:
      'Washington und Tokio bestätigen den gemeinsamen Eingriff am Devisenmarkt. Der Dollar fällt von fast 164 auf zeitweise 155,20 Yen – und Japans Börse gibt nach.',
    category: 'Geldpolitik',
    publishedAt: '2026-08-03T07:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Yen', 'Devisenmarkt', 'Intervention', 'Japan'],
    relatedTopics: ['waehrungen-wechselkurse', 'notenbanken-geldpolitik'],
    relatedSymbols: ['nikkei-225'],
    sources: [
      {
        label:
          'AP (via WSLS): „Asian stocks are mixed as yen jumps against the dollar, while oil prices slip“ (3. August 2026)',
        url: 'https://www.wsls.com/business/2026/08/03/asian-stocks-are-mixed-as-yen-jumps-against-the-dollar-while-oil-prices/',
      },
      {
        label:
          'Business Recorder: Schlagzeile „Japan confirms joint yen intervention with US, signals readiness for more action“ (3. August 2026; steht in der Meldungsleiste der verlinkten Seite)',
        url: 'https://www.brecorder.com/news/40432965/opec-agrees-september-oil-hike-completing-rollback-of-voluntary-cuts',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die USA und Japan haben bestätigt, dass sie **in der vergangenen Woche gemeinsam am Devisenmarkt eingegriffen** haben, um den Yen zu stützen. Der Dollar war zuvor auf ein **40-Jahres-Hoch** gegenüber der japanischen Währung gestiegen und notierte zuletzt nahe 164 Yen; nach der Bestätigung fiel er laut AP zeitweise auf **155,20 Yen**. Der Yen steht damit so hoch wie seit Ende vergangenen Jahres nicht mehr – und Tokio signalisiert die Bereitschaft zu weiteren Eingriffen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was eine Intervention ist – und was sie besonders macht',
      },
      {
        type: 'paragraph',
        text: 'Bei einer **Devisenmarktintervention** kauft oder verkauft ein Staat gezielt die eigene Währung, um ihren Kurs zu bewegen – hier: Yen kaufen, Dollar verkaufen. Japan hat das in den vergangenen Jahren mehrfach allein versucht, mit begrenzter Wirkung: Der Markt ist riesig, und gegen einen anhaltenden Trend verpufft einzelnes Kaufen schnell. **Gemeinsame** Interventionen zweier großer Währungsräume sind selten – und gerade deshalb wirksamer, weil sie dem Markt signalisieren, dass beide Seiten den Kurs für falsch halten.',
      },
      {
        type: 'paragraph',
        text: 'Warum überhaupt eingreifen? Ein schwacher Yen hat zwei Gesichter. Er **polstert die Gewinne** japanischer Konzerne mit großem Auslandsgeschäft, weil Dollar-Erlöse in mehr Yen getauscht werden – und er lockt Touristen ins Land. Zugleich **verteuert er alle Importe**, allen voran Öl und Rohstoffe, die Japan fast vollständig einführen muss. Bei 164 Yen je Dollar hatte die zweite Seite die Oberhand gewonnen.',
      },
      {
        type: 'paragraph',
        text: 'Die Börsenreaktion zeigt die erste Seite: Der **Nikkei 225 verlor am Montagmorgen 1,9 Prozent auf 63.140 Punkte** – ein stärkerer Yen schmälert die künftigen Auslandsgewinne der Exportwerte, die den Index prägen. Dass eine steigende Währung fallende Aktienkurse auslöst, ist kein Widerspruch, sondern derselbe Mechanismus von der anderen Seite betrachtet.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wechselkurse sind kein Randthema für Weltenbummler – sie verschieben Gewinne zwischen Exporteuren und Importeuren, und damit ganze Indizes. Wer japanische Aktien oder einen Welt-ETF hält, hält immer auch eine Währungswette mit, ob er will oder nicht.',
      },
    ],
  },
  {
    slug: 'opec-plus-beschluss-serie-beendet',
    title: 'OPEC+ beschließt die 188.000 Barrel – und beendet damit eine Serie',
    metaTitle: 'OPEC+ beschließt 188.000 Barrel mehr',
    teaser:
      'Die sieben Kernstaaten heben die September-Quote wie erwartet an. Die 2023er-Kürzungen sind damit zurückgenommen – ab Oktober beginnt das Verhandeln.',
    category: 'Märkte',
    publishedAt: '2026-08-03T07:15:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['OPEC', 'Ölpreis', 'Rohstoffe', 'Erdgas'],
    relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['brent', 'erdgas'],
    sources: [
      {
        label:
          'WirtschaftsWoche / dpa: „Opec+ erhöht Ölförderziele für September“ (2. August 2026)',
        url: 'https://www.wiwo.de/politik/ausland/opec-kartell-opec-erhoeht-oelfoerderziele-fuer-september/100244518.html',
      },
      {
        label:
          'Business Recorder / Reuters: „OPEC agrees September oil hike, completing rollback of voluntary cuts“ (2. August 2026)',
        url: 'https://www.brecorder.com/news/40432965/opec-agrees-september-oil-hike-completing-rollback-of-voluntary-cuts',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Entscheidung, über die an dieser Stelle gestern vorab berichtet wurde, ist gefallen: Die sieben Kernstaaten der OPEC+ – Saudi-Arabien, Russland, Irak, Kuwait, Algerien, Kasachstan und Oman – haben am Sonntag beschlossen, ihre **Förderquote für September um rund 188.000 Barrel pro Tag** anzuheben. Damit ist die schrittweise Rücknahme der 2023 vereinbarten Kürzung von 1,65 Millionen Barrel **vollständig abgeschlossen**.',
      },
      { type: 'heading', level: 2, text: 'Was jetzt anders wird' },
      {
        type: 'paragraph',
        text: 'Zum weiteren Vorgehen ab Oktober sagte die Gruppe **nichts** – und genau das ist die Nachricht. Bisher folgte die Politik einem Fahrplan: Monat für Monat wurde ein Stück der alten Kürzung zurückgenommen, die Entscheidung war im Grunde Verwaltung. Ab jetzt muss neu verhandelt werden. Rystad-Analyst Jorge Leon hält eine **Pause im vierten Quartal** für das wahrscheinlichste Szenario: Die Gruppe habe wenig Anreiz zu weiteren Schritten, solange sie sich auf die Quotengespräche für 2027 vorbereitet. Ein älteres Kürzungspaket von rund **zwei Millionen Barrel aus dem Jahr 2022** bleibt ohnehin bis Jahresende in Kraft.',
      },
      {
        type: 'paragraph',
        text: 'Die Verhandlungen ab 2027 dürften schwierig werden: Die OPEC+ prüft derzeit die **tatsächlichen Förderkapazitäten** ihrer Mitglieder als Grundlage für neue Quoten – und einige, allen voran der Irak, drängen auf höhere Anteile. Es ist derselbe Streitpunkt, an dem im Mai der Austritt der Emirate sichtbar wurde.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Kuwait liefert wieder – ein Signal aus Hormus',
      },
      {
        type: 'paragraph',
        text: 'Bemerkenswert ist eine Zahl am Rande: **Kuwait förderte im Juli durchschnittlich 1,971 Millionen Barrel pro Tag**, nach rund 1,65 Millionen im Juni und nur 580.000 im Mai, wie eine mit der Sache vertraute Person Reuters sagte. Vor der faktischen Schließung der Straße von Hormus Ende Februar waren es 2,5 Millionen. Die Erholung deutet darauf hin, dass wieder mehr Öl durch die Meerenge kommt – teils auf Tankern mit abgeschalteten Ortungssignalen. Die Papierquoten der Vormonate blieben ja gerade deshalb folgenlos, weil die Kriege im Iran und in der Ukraine die realen Exporte drückten.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Nebenschauplatz Gas',
        items: [
          'Der Gaspreis ist seit der erneuten Iran-Eskalation um mehr als elf Prozent gestiegen, berichtet die WirtschaftsWoche.',
          'Der Großproduzent QatarEnergy setzt Pläne zum Hochfahren seiner Produktion aus.',
          'Gas hat keine OPEC: Es gibt kein Kartell, das Kapazität zurückhält und bei Knappheit freigeben könnte – Ausfälle schlagen direkter durch.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Der Ölmarkt wechselt das Regime – von planmäßigen Erhöhungen zu offenen Verhandlungen, während zugleich die Kriegsprämie schwankt. Beschlüsse, Kapazitäten und tatsächliche Lieferungen sind drei verschiedene Zahlen; wer sie auseinanderhält, versteht die Schlagzeilen der nächsten Monate.',
      },
    ],
  },
  {
    slug: 'kospi-achterbahn-samsung-hynix',
    title: 'Südkoreas Kospi: erst bester Tag der Geschichte, dann minus 4,5 Prozent',
    metaTitle: 'Kospi: Rekordtag, dann minus 4,5 Prozent',
    teaser:
      'Freitag plus 17,9 Prozent, Montag minus 4,5: Südkoreas Leitindex hängt an zwei Chipkonzernen. Was ein kopflastiger Index über Streuung lehrt.',
    category: 'Märkte',
    publishedAt: '2026-08-03T07:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Kospi', 'Samsung', 'Halbleiter', 'Konzentrationsrisiko'],
    relatedTopics: ['aktien-laender-branchen', 'risiko-und-rendite'],
    relatedSymbols: ['kospi', 'samsung', 'nikkei-225'],
    sources: [
      {
        label:
          'AP (via WSLS): „Asian stocks are mixed as yen jumps against the dollar, while oil prices slip“ (3. August 2026)',
        url: 'https://www.wsls.com/business/2026/08/03/asian-stocks-are-mixed-as-yen-jumps-against-the-dollar-while-oil-prices/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der südkoreanische Leitindex Kospi hat einen bemerkenswerten Wochenwechsel hinter sich: Am Freitag sprang er um **17,9 Prozent – der beste Tag seiner Geschichte**, nachdem er in den Tagen zuvor noch mehr verloren hatte. Am Montagmorgen ging es dann wieder **4,5 Prozent abwärts auf 6.298,75 Punkte**, so die AP aus dem frühen Handel.',
      },
      { type: 'heading', level: 2, text: 'Zwei Konzerne, ein Landesindex' },
      {
        type: 'paragraph',
        text: 'Hinter beiden Bewegungen stehen im Kern **zwei Namen**: Samsung Electronics und der Speicherhersteller SK Hynix dominieren den Index. Am Freitag gewannen beide Aktien **mehr als 25 Prozent**, am Montagmorgen lag Samsung rund **8 Prozent im Minus** und SK Hynix 7,8 Prozent. Wer „Südkorea“ im Depot hat – etwa über einen Länder-ETF –, hat damit vor allem eine Wette auf den Speicherchip-Zyklus, ob es ihm bewusst ist oder nicht.',
      },
      {
        type: 'paragraph',
        text: 'Das Muster ist kein koreanisches Sonderphänomen, nur ein besonders deutliches: Viele Landesindizes tragen ein oder zwei Schwergewichte, deren Branchenzyklus dann den ganzen Index prägt. Die Schwankung der letzten Tage – zweistellig rauf, zweistellig runter – ist genau das, was **Konzentrationsrisiko** in Zahlen bedeutet: Die Streuung über einen Index schützt nur so weit, wie der Index selbst gestreut ist.',
      },
      {
        type: 'paragraph',
        text: 'Der Blick auf die Nachbarschaft zeigt zugleich, wie unterschiedlich „Asien“ an einem Morgen aussehen kann: Japans Nikkei verlor 1,9 Prozent – aus einem ganz anderen Grund, nämlich dem stärkeren Yen –, Hongkongs Hang Seng **gewann** 0,6 Prozent auf 26.038 Punkte, Shanghai gab 0,5 Prozent nach, Australiens ASX 200 0,2 Prozent.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Vor dem Kauf eines Länder-ETF lohnt ein Blick auf die zehn größten Positionen und ihr Gewicht. Ein Index mit zwei dominanten Titeln ist kein „breiter Markt“, sondern ein konzentriertes Branchenportfolio mit langem Anhang – und schwankt entsprechend.',
      },
    ],
  },
  {
    slug: 'amazon-apple-erwartung-freitag',
    title: 'Amazon plus 15 Prozent, Apple minus 7 – beide hatten „gute“ Zahlen',
    metaTitle: 'Amazon +15 %, Apple −7 %: der Unterschied',
    teaser:
      'Beide meldeten mehr Gewinn als erwartet – die Kurse liefen trotzdem auseinander. Der Unterschied lag nicht in den Zahlen, sondern im Ausblick.',
    category: 'Märkte',
    publishedAt: '2026-08-03T07:25:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Amazon', 'Apple', 'Quartalszahlen', 'Erwartungen'],
    relatedTopics: ['aktie', 'anlegerpsychologie'],
    relatedSymbols: ['amazon', 'apple', 'sp500'],
    sources: [
      {
        label:
          'AP (via WSLS): „Asian stocks are mixed as yen jumps against the dollar, while oil prices slip“ (3. August 2026)',
        url: 'https://www.wsls.com/business/2026/08/03/asian-stocks-are-mixed-as-yen-jumps-against-the-dollar-while-oil-prices/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der US-Börsenfreitag lieferte ein Lehrstück in zwei Akten. **Amazon sprang um 15,3 Prozent**: Der Konzern hatte einen Quartalsgewinn gemeldet, der sich gegenüber dem Vorjahr **mehr als verdreifachte**, getragen von wieder beschleunigtem Wachstum im Cloud-Geschäft – für Analysten ein Signal, dass sich die massiven KI-Investitionen auszuzahlen beginnen. **Apple dagegen fiel um 7,4 Prozent** – obwohl auch hier der Gewinn über den Erwartungen lag. Enttäuscht hat der Ausblick: Die Umsatzprognose fürs laufende Quartal blieb hinter den Schätzungen zurück, begründet mit Engpässen bei Komponenten, die der KI-Boom aufsaugt.',
      },
      { type: 'heading', level: 2, text: 'Nicht die Zahl bewegt, sondern der Abstand' },
      {
        type: 'paragraph',
        text: 'Beide Reaktionen folgen derselben Regel: Ein Kurs bewegt sich nicht an der gemeldeten Zahl, sondern am **Abstand zwischen Meldung und Erwartung** – und zwar über alle Zeitebenen. Bei Amazon überraschte die Gegenwart *und* die Zukunft positiv (der Konzern erhöhte sogar seine Investitionspläne). Bei Apple war die Gegenwart gut, aber die Zukunft schwächer als gedacht – und Kurse sind Preise für Zukunft, nicht für Vergangenheit.',
      },
      {
        type: 'paragraph',
        text: 'Wie nervös der Markt bei allem rund um KI derzeit ist, zeigte der Chipwert Micron am selben Tag: erst **plus 6,4 Prozent, dann minus 6,5, Schlussstand minus 5,9** – eine Spanne von über zwölf Prozentpunkten binnen Stunden, ganz ohne eigene Nachrichten. Insgesamt schloss der S&P 500 den Freitag 0,7 Prozent fester und beendete damit seine **erste Gewinnwoche nach zwei Verlustwochen**; der Nasdaq gewann 1 Prozent.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** „Gute Zahlen“ ist keine Kursprognose. Wer auf Quartalszahlen schaut, sollte drei Fragen stellen: Was wurde erwartet? Was wurde gemeldet? Und was sagt der Ausblick? Die Kursreaktion entsteht aus den Differenzen – nicht aus den absoluten Werten.',
      },
    ],
  },
  {
    slug: 'dax-zwei-schlusskurse-allzeithoch',
    title: 'DAX vor dem Wochenstart: zwei Quellen, zwei Schlusskurse',
    teaser:
      'Plus 2,1 Prozent in der Woche, das Allzeithoch in Reichweite – und je nach Quelle ein anderer Freitagsschluss: 25.650 oder 25.629 Punkte. Beide sind richtig.',
    category: 'Märkte',
    publishedAt: '2026-08-03T07:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['DAX', 'Allzeithoch', 'ifo', 'Datenquellen'],
    relatedTopics: ['boerse', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['dax'],
    sources: [
      {
        label:
          'XTB Marktanalysen: „DAX Aktuell: Allzeithoch wieder im Blick – Wochenausblick KW 32“ (2. August 2026)',
        url: 'https://www.xtb.com/de/Marktanalysen/Trading-News/dax-allzeithoch-wieder-im-blick-chartanalyse-prognose-wochenausblick',
      },
      {
        label:
          'DAX-Kursseite dieser Website (Yahoo-Tagesdaten, Stand 31. Juli, 18:00 Uhr MESZ)',
        url: 'https://iminvests.de/maerkte/dax',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der DAX geht mit Rückenwind in die neue Woche: **rund 2,1 Prozent Wochenplus**, der erste Zuwachs nach drei Verlustwochen, und das Allzeithoch in Sichtweite. Den Freitagsschluss gibt der Broker XTB mit **25.650 Punkten** an; die auf dieser Website geführten Yahoo-Tagesdaten nennen **25.629 Punkte** (Stand 18:00 Uhr MESZ). Gestützt wurde die Stimmung vom ifo-Geschäftsklima, das im Juli zum dritten Mal in Folge stieg – auf 86,6 Punkte, mehr als die erwarteten 86,0.',
      },
      { type: 'heading', level: 2, text: 'Warum zwei Quellen zwei Schlusskurse nennen' },
      {
        type: 'paragraph',
        text: 'Die 21 Punkte Unterschied sind kein Fehler, sondern **Definitionssache**. „Der Schlusskurs“ des DAX existiert mehrfach: Der Xetra-Handel endet um 17:30 Uhr mit einer Schlussauktion, danach wird der Index aus späten Umsätzen nachberechnet, und auf Derivate gestützte Kursreihen (etwa CFD-Anbieter wie XTB) laufen noch Stunden weiter. Je nachdem, welchen Zeitpunkt und welche Berechnungsgrundlage ein Datenanbieter festhält, steht eine leicht andere Zahl im Archiv.',
      },
      {
        type: 'paragraph',
        text: 'Für die Einordnung einer Tagesbewegung ist das egal – 0,08 Prozent Abstand ändern kein Bild. Wichtig wird es, wenn **Schwellen** im Spiel sind: „Allzeithoch erreicht“ oder „nicht erreicht“ kann an genau solchen Definitionsfragen hängen. Seriös ist deshalb nicht die Quelle mit der schöneren Zahl, sondern die, die dazuschreibt, **wann und wie** gemessen wurde.',
      },
      {
        type: 'paragraph',
        text: 'Impulse für den Wochenstart gibt es reichlich: Die Entspannungssignale im Iran-Konflikt drückten den Ölpreis am Morgen um fünf Prozent – für den DAX als Index einer energieimportierenden Volkswirtschaft eher eine Stütze –, dazu kommen am Nachmittag der ISM-Index aus den USA und im Wochenverlauf eine dichte Reihe an Quartalszahlen.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer Kurse vergleicht, vergleicht immer auch Messmethoden. Zwei abweichende Zahlen aus zwei Quellen sind meist beide richtig – sie beantworten nur leicht verschiedene Fragen. Misstrauisch werden sollte man erst, wenn eine Quelle den Messzeitpunkt verschweigt.',
      },
    ],
  },
  {
    slug: 'ism-palantir-termine-montag',
    title: 'Der Montag im Kalender: ISM, Einzelhandel, Palantir',
    teaser:
      'Um 8 Uhr der deutsche Einzelhandelsumsatz, um 16 Uhr der ISM-Index, nach US-Schluss Palantir: die Termine des Tages – und warum die 50er-Marke des ISM zählt.',
    category: 'Märkte',
    publishedAt: '2026-08-03T07:35:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Termine', 'ISM', 'Palantir', 'Konjunktur'],
    relatedTopics: ['wie-funktioniert-der-markt', 'aktie'],
    relatedSymbols: ['palantir', 'sp500'],
    sources: [
      {
        label:
          'dpa-AFX (via ARIVA): „Tagesvorschau: Termine am 3. August 2026“ (31. Juli 2026)',
        url: 'https://www.ariva.de/news/tagesvorschau-termine-am-3-august-2026-12088514',
      },
      {
        label:
          'Terminkalender dieser Website: erwartete Meldetermine aus den 8-K-Mustern der SEC',
        url: 'https://iminvests.de/kalender',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Terminkalender des Tages, nach dpa-AFX: Um **8:00 Uhr** meldet Deutschland den Einzelhandelsumsatz für Juni samt erstem Halbjahr, um **8:30 Uhr** folgen Schweizer Verbraucherpreise. Über den Vormittag verteilt kommen die **zweiten Veröffentlichungen der Einkaufsmanagerindizes** (PMI) für Spanien, Italien, Frankreich, Deutschland, den Euroraum und Großbritannien. Um **16:00 Uhr** dann der wichtigste Wert des Tages: der **ISM-Index für das verarbeitende Gewerbe** der USA, dazu die US-Bauinvestitionen.',
      },
      {
        type: 'paragraph',
        text: 'Bei den Unternehmen meldet früh der Autozulieferer Stabilus, aus Japan Nissan, am Nachmittag der Hotelkonzern Marriott – und um **22:05 Uhr MESZ**, nach US-Börsenschluss, **Palantir**. Berkshire Hathaway, das der Terminkalender dieser Website aus den Meldemustern der Vorjahre für heute erwartet hatte, steht in der dpa-Liste nicht – erwartete Termine bleiben Schätzungen, verbindlich ist allein die Ankündigung des Unternehmens.',
      },
      { type: 'heading', level: 2, text: 'Warum die 50 beim ISM eine Grenze ist' },
      {
        type: 'paragraph',
        text: 'Der ISM ist eine **Umfrage unter Einkaufsmanagern**: Läuft es besser, gleich oder schlechter als im Vormonat? Die Antworten werden zu einer Zahl verdichtet, bei der **50 die Wachstumsschwelle** markiert – darüber expandiert die Industrie, darunter schrumpft sie. Der Index misst also Richtung, nicht Niveau, und gilt als Frühindikator, weil Einkäufer bestellen, bevor produziert wird. Die PMI-Zweitveröffentlichungen am Vormittag bewegen dagegen selten etwas: Ihre erste Schätzung ist längst bekannt, die Erwartung also schon gesetzt.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Ein Terminkalender ist eine Landkarte der möglichen Überraschungen. Kursrelevant ist ein Termin in dem Maß, in dem sein Ergebnis von der Erwartung abweichen kann – deshalb zählt der ISM um 16 Uhr mehr als sechs PMI-Bestätigungen am Vormittag zusammen.',
      },
    ],
  },
  {
    slug: 'opec-plus-quote-papier-fass',
    title: 'OPEC+ berät heute über mehr Öl – doch die Quote ist Papier',
    teaser:
      'Sieben Staaten beraten heute online über 188.000 Barrel mehr ab September. Doch etliche Mitglieder können ihre Ziele gar nicht fördern.',
    category: 'Märkte',
    publishedAt: '2026-08-02T10:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['OPEC', 'Ölpreis', 'Rohstoffe', 'Geopolitik'],
    relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['brent'],
    sources: [
      {
        label:
          'Al-Monitor / AFP: „OPEC+ tipped to raise production again but new quotas loom“ (1. August 2026)',
        url: 'https://www.al-monitor.com/originals/2026/08/opec-tipped-raise-production-again-new-quotas-loom',
      },
      {
        label:
          'Free Malaysia Today / AFP: „Opec+ tipped to raise production again but new quotas loom“ (2. August 2026)',
        url: 'https://www.freemalaysiatoday.com/category/business/2026/08/02/opec-tipped-to-raise-production-again-but-new-quotas-loom',
      },
      {
        label:
          'finanzmarktwelt.de: „Aktienmärkte vor Schicksalswoche: Vier Tage, fünf Risiken“ (28. Juli 2026)',
        url: 'https://finanzmarktwelt.de/aktienmaerkte-vor-schicksalswoche-vier-tage-fuenf-risiken-396636/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Saudi-Arabien, Russland und fünf weitere OPEC+-Staaten beraten **heute in einer Online-Sitzung** über die Förderquoten für September. Erwartet wird laut AFP eine Anhebung um **188.000 Barrel pro Tag** – die gleiche Schrittgröße wie in den Vormonaten. Es dürfte die letzte Erhöhung der laufenden Serie sein, sagt Jorge Leon vom Analysehaus Rystad Energy.',
      },
      {
        type: 'paragraph',
        text: 'Zum Hintergrund: Zwischen Ende 2022 und 2023 hatte die erweiterte OPEC ihre Förderung in drei Runden um zusammen fast **sechs Millionen Barrel pro Tag** gekürzt, weil sie fallende Preise fürchtete. Seit 2025 wird das schrittweise zurückgedreht; mit dem September-Schritt wäre das zweite der drei Kürzungspakete vollständig abgewickelt.',
      },
      { type: 'heading', level: 2, text: 'Warum mehr Quote nicht mehr Öl heißt' },
      {
        type: 'paragraph',
        text: 'Das Bemerkenswerte an dieser Runde: Viele Mitglieder **können ihre erlaubte Menge gar nicht fördern**. Russlands Produktion liegt laut AFP bei rund neun Millionen Barrel pro Tag – das Ziel wären 9,8 Millionen; ukrainische Drohnenangriffe treffen immer wieder die Infrastruktur. Die Golfstaaten wiederum bekommen ihr Öl schwer aus der Region, weil die Straße von Hormus im Nahostkrieg weitgehend lahmgelegt ist – trotz einer kurzen Belebung nach der amerikanisch-iranischen Absichtserklärung im Juni. „Die Ziele zu erhöhen ist damit weniger aussagekräftig geworden“, so UBS-Analyst Giovanni Staunovo.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Papierquote und lieferbares Fass',
        items: [
          'Eine Quote ist eine Erlaubnis, kein Öl. Der Preis richtet sich nach Fässern, die wirklich verladen werden.',
          'Deshalb kann eine „Erhöhung“ den Preis kaltlassen – wenn niemand die zusätzliche Menge liefern kann.',
          'Brent schloss am Freitagabend bei gut 90 Dollar; Mitte der Woche lag der Preis laut finanzmarktwelt zeitweise über 100. Ohne Zeitangabe wären beide Zahlen „der Ölpreis“ – und eine davon irreführend.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die erste Quotenrunde ohne die Emirate' },
      {
        type: 'paragraph',
        text: 'Es ist zugleich die erste September-Entscheidung, seit die **Vereinigten Arabischen Emirate die Gruppe zum 1. Mai verlassen** haben. Abu Dhabi begründete den Schritt damit, er diene „unseren nationalen Interessen und langfristigen strategischen Zielen“ – das Land hatte zuletzt massiv in zusätzliche Förderkapazität investiert und wollte sich enge Quoten nicht länger anrechnen lassen. Rystad-Analyst Leon sieht den Zusammenhalt „im Moment nicht gefährdet“, nennt den Austritt aber eine sichtbar gewordene Schwachstelle. Ab 2027 stehen laut DNB Carnegie ohnehin „möglicherweise schwierige Gespräche“ über ganz neue Quoten an.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Ein Kartell wirkt nur, solange die großen Förderer mitmachen und ihre Zusagen physisch einlösen können. Wer Ölpreis-Schlagzeilen liest, sollte zwei Fragen trennen: Was wurde beschlossen – und was davon kommt tatsächlich auf den Markt?',
      },
    ],
  },
  {
    slug: 'bitcoin-wochenende-62766',
    title: 'Bitcoin fällt am Wochenende weiter – während die Börse zu hat',
    teaser:
      'Freitag 63.744 Dollar, in der Nacht zum Sonntag 62.766: Bitcoin handelt durch, wenn Aktien pausieren. Was das für den Montagsblick bedeutet.',
    category: 'Märkte',
    publishedAt: '2026-08-02T10:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Bitcoin', 'Ethereum', 'Wochenende', 'Handelszeiten'],
    relatedTopics: ['bitcoin-krypto', 'boerse'],
    relatedSymbols: ['bitcoin', 'ethereum'],
    sources: [
      {
        label:
          'wallstreetONLINE: „Bitcoin vor Wochenende schwächer: Kurs fällt auf 63.744 USD“ (31. Juli 2026)',
        url: 'https://www.wallstreet-online.de/nachricht/21178403-bitcoin-kurs-aktuell-bitcoin-wochenende-schwaecher-kurs-faellt-63-744-usd-alarm-31-07-26',
      },
      {
        label:
          'Bitcoin-Kursseite dieser Website (Yahoo-Tagesdaten, Stand 2. August, 0:01 Uhr MESZ)',
        url: 'https://iminvests.de/maerkte/bitcoin',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Bitcoin ist bereits **vor dem Wochenende schwächer** aus der Woche gegangen: Am Freitag fiel der Kurs laut wallstreetONLINE auf **63.744 US-Dollar**, ein Minus von gut anderthalb Prozent binnen 24 Stunden. Und anders als an der Börse war damit nicht Schluss: In der Nacht zum Sonntag stand der Kurs nach den auf dieser Website geführten Yahoo-Daten bei **62.766 Dollar**, Ethereum bei rund 1.845 Dollar.',
      },
      { type: 'heading', level: 2, text: '365 gegen 252' },
      {
        type: 'paragraph',
        text: 'Aktienbörsen handeln an rund **252 Tagen im Jahr**, Kryptowährungen an allen **365**. Was banal klingt, verändert den Blick auf jeden Chart: Während der DAX von Freitagabend bis Montagmorgen schlicht nicht existiert, läuft der Bitcoin-Preis durch – mit dünner Liquidität, denn am Wochenende sind weniger Käufer und Verkäufer unterwegs. Kleine Orders bewegen dann mehr als unter der Woche.',
      },
      {
        type: 'paragraph',
        text: 'Daraus folgen zwei Dinge. Erstens: **Der Montagsblick täuscht.** Eine Aktie „springt“ am Montag scheinbar, dabei hat sich nur über zwei geschlossene Tage Nachrichtenlage angesammelt – die Kurslücke ist das nachgeholte Wochenende. Bitcoin hat diese Lücke nicht, dafür passiert sein Wochenendweg oft in kleinen, nervösen Schritten. Zweitens: **Wochenvergleiche hinken**, wenn man ein 365-Tage-Instrument gegen ein 252-Tage-Instrument stellt – die Zeiträume sind schlicht nicht dieselben.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer Krypto- und Aktienbewegungen vergleicht, sollte auf denselben Zeitraum und dieselbe Uhrzeit achten – und Wochenendbewegungen bei Bitcoin nicht überinterpretieren: Sie entstehen in einem Markt, der gerade besonders dünn besetzt ist.',
      },
    ],
  },
  {
    slug: 'woche-voraus-berkshire-bis-lilly',
    title: 'Die Woche voraus: 31 erwartete Quartalstermine, von Berkshire bis Lilly',
    metaTitle: 'Wochenausblick: 31 erwartete Quartalstermine',
    teaser:
      'Montag Berkshire und Palantir, Dienstag AMD und Caterpillar, Donnerstag Eli Lilly: Unser Kalender erwartet 31 Meldungen – gerechnet, nicht bestätigt.',
    category: 'Märkte',
    publishedAt: '2026-08-02T10:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Quartalszahlen', 'Wochenausblick', 'Berichtssaison'],
    relatedTopics: ['aktie', 'wie-funktioniert-der-markt'],
    relatedSymbols: [
      'berkshire',
      'palantir',
      'amd',
      'caterpillar',
      'eli-lilly',
      'mcdonalds',
      'uber',
      'pfizer',
    ],
    sources: [
      {
        label:
          'finanzmarktwelt.de: „Aktienmärkte vor Schicksalswoche: Vier Tage, fünf Risiken“ (28. Juli 2026)',
        url: 'https://finanzmarktwelt.de/aktienmaerkte-vor-schicksalswoche-vier-tage-fuenf-risiken-396636/',
      },
      {
        label:
          'Terminkalender dieser Website: erwartete Meldetermine, gerechnet aus den 8-K-Mustern der SEC',
        url: 'https://iminvests.de/kalender',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Nach der Woche mit Fed-Entscheid und den Zahlen von vier der „Magnificent Seven“ reißt der Takt nicht ab. Unser Terminkalender erwartet für die kommenden Handelstage **31 Quartalsmeldungen** aus dem hier geführten Aktienbestand – gerechnet aus den Meldemustern der Vorjahre, nicht von den Unternehmen bestätigt.',
      },
      {
        type: 'table',
        head: ['Tag', 'Erwartete Meldungen (Auswahl)'],
        rows: [
          ['Montag, 3. August', 'Berkshire Hathaway, Palantir, Vertex, IDEXX'],
          ['Dienstag, 4. August', 'AMD, Caterpillar, Pfizer, Amgen, Cummins'],
          ['Mittwoch, 5. August', 'McDonald’s, Uber, Airbnb, MetLife, Fortinet'],
          ['Donnerstag, 6. August', 'Eli Lilly, Gilead, ConocoPhillips, Datadog'],
        ],
      },
      { type: 'heading', level: 2, text: 'Worauf der Markt dabei schaut' },
      {
        type: 'paragraph',
        text: 'Die Messlatte der Berichtssaison hat sich verschoben: Nicht mehr das Umsatzwachstum steht im Mittelpunkt, sondern die Frage, **wann sich die milliardenschweren KI-Investitionen auszahlen**. Wie ernst es der Markt damit meint, zeigte laut finanzmarktwelt das Beispiel Alphabet in der vergangenen Woche: Trotz starker Quartalszahlen verlor die Aktie rund sieben Prozent, nachdem der Konzern seine Investitionspläne für KI-Rechenzentren erneut ausgeweitet hatte.',
      },
      { type: 'heading', level: 2, text: '„Erwartet“ ist nicht „bestätigt“' },
      {
        type: 'paragraph',
        text: 'Ein Wort zur Ehrlichkeit dieser Vorschau: Unsere Termine sind **Vorhersagen aus dem bisherigen Meldeverhalten** – meldet ein Unternehmen seit Jahren Ende der ersten August-Woche, erwarten wir das auch diesmal, mit der historischen Streuung als Unsicherheitsmaß. Verbindlich ist allein die Ankündigung des Unternehmens auf seiner Investor-Relations-Seite. Genau deshalb steht an jedem Termin im Kalender das Wort „erwartet“.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Termine sind selbst Kurstreiber – vor Zahlen steigt oft die Schwankung, danach entlädt sie sich. Wer weiß, wann seine Titel melden, wird von Bewegungen seltener überrascht. Der Kalender auf dieser Website führt alle erwarteten Termine je Titel.',
      },
    ],
  },
  {
    slug: 'eingepreist-renditen-vier-sieben',
    title: 'Voll eingepreist: Warum eine erwartete Zinserhöhung kaum bewegt',
    teaser:
      'Der Terminmarkt preist die September-Erhöhung der Fed komplett ein, zehnjährige US-Anleihen rentieren bei 4,7 Prozent. Was „eingepreist“ heißt.',
    category: 'Geldpolitik',
    publishedAt: '2026-08-02T10:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Fed', 'Anleiherenditen', 'Erwartungen', 'Abzinsung'],
    relatedTopics: ['notenbanken-geldpolitik', 'schuldverschreibung'],
    relatedSymbols: ['sp500', 'nasdaq-100'],
    sources: [
      {
        label:
          'finanzmarktwelt.de: „Aktienmärkte vor Schicksalswoche: Vier Tage, fünf Risiken“ (28. Juli 2026)',
        url: 'https://finanzmarktwelt.de/aktienmaerkte-vor-schicksalswoche-vier-tage-fuenf-risiken-396636/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Zwei Zahlen aus der vergangenen Woche lohnen den zweiten Blick. Erstens: Der Terminmarkt preist laut finanzmarktwelt (Stand 28. Juli, vor dem Fed-Entscheid) eine **Zinserhöhung im September vollständig ein** – und bis Jahresende sogar einen zweiten Schritt. Zweitens: Die Rendite zehnjähriger US-Staatsanleihen stieg auf **4,7 Prozent**, den höchsten Stand seit Monaten. Die Fed selbst hielt die Spanne am Mittwoch still – wie hier am Donnerstag berichtet, mit drei Gegenstimmen, die lieber erhöht hätten.',
      },
      { type: 'heading', level: 2, text: 'Eingepreist heißt: schon bezahlt' },
      {
        type: 'paragraph',
        text: 'Wenn eine Zinserhöhung „vollständig eingepreist“ ist, haben Käufer und Verkäufer sie in ihren heutigen Preisen bereits verarbeitet. Tritt sie ein, passiert – wenig. **Bewegung entsteht aus der Abweichung**: aus der Erhöhung, die nicht kommt, oder der, die größer ausfällt als gedacht. Das erklärt das scheinbare Paradox, dass Märkte auf „gute“ Nachrichten fallen und auf „schlechte“ steigen können – gemessen wird immer gegen das, was erwartet wurde.',
      },
      {
        type: 'paragraph',
        text: 'Die 4,7 Prozent sind dabei mehr als eine Anleihe-Notiz. Der Zins ist die **Schwerkraft jeder Bewertung**: Je höher die sichere Alternative verzinst, desto strenger wird jeder künftige Unternehmensgewinn abgezinst – und desto schwerer lassen sich hohe Bewertungen rechtfertigen. Wer nachvollziehen will, wie stark dieser Hebel wirkt, kann im Bewertungsrechner dieser Website die Abzinsung von 8 auf 10 Prozent stellen und zusehen, was mit dem gerechtfertigten Kurs-Gewinn-Verhältnis passiert.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Nicht die Nachricht bewegt den Kurs, sondern ihr Abstand zur Erwartung. Wer Zinstermine liest, sollte deshalb immer zwei Dinge kennen: was beschlossen wurde – und was der Markt vorher eingepreist hatte.',
      },
    ],
  },
  {
    slug: 'juli-tag-gruen-monat-rot',
    title: 'Der Freitag war grün, der Juli war rot – beim selben Index',
    teaser:
      'Der S&P 500 legt am Freitag 0,7 Prozent zu und schließt den Juli 0,1 Prozent im Minus. Dass beides zugleich stimmt, ist die Lektion des Monatswechsels.',
    category: 'Märkte',
    publishedAt: '2026-08-01T09:05:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Indizes', 'Monatsbilanz', 'Bezugszeitraum'],
    relatedTopics: ['boerse', 'wie-funktioniert-der-markt', 'risiko-und-rendite'],
    relatedSymbols: ['sp500', 'nasdaq-100', 'dow-jones'],
    sources: [
      {
        label:
          'CNBC: „S&P 500 closes higher Friday as Amazon surges; Dow posts fourth straight winning month“ (Live-Blog, 31. Juli 2026)',
        url: 'https://www.cnbc.com/2026/07/30/stock-market-today-live-updates.html',
      },
      {
        label:
          'The Associated Press / The Epoch Times: „How Major US Stock Indexes Fared July 31“ (31. Juli 2026)',
        url: 'https://www.theepochtimes.com/bright/how-major-us-stock-indexes-fared-july-31-post-6070080',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Am letzten Handelstag des Juli schlossen die drei großen US-Indizes im Plus: der **S&P 500 mit 0,7 Prozent auf 7.489,72 Punkte**, der Dow Jones Industrial mit 0,53 Prozent oder 276,97 Punkten auf 52.485,03 und der **Nasdaq Composite mit 1 Prozent auf 25.373,85**. Amazon sprang nach Quartalszahlen um 15 Prozent, Apple gab über 7 Prozent nach.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Und trotzdem war der Monat kein guter',
      },
      {
        type: 'paragraph',
        text: 'Für den Juli insgesamt steht beim S&P 500 ein **Minus von 0,1 Prozent**, beim Nasdaq Composite ein **Minus von 3,2 Prozent**. Nur der Dow schloss den Monat mit **plus 0,3 Prozent** – sein vierter Plusmonat in Folge.',
      },
      {
        type: 'paragraph',
        text: 'Das ist kein Widerspruch und keine Ungenauigkeit. Es sind schlicht zwei verschiedene Fragen: Was hat sich seit gestern getan, und was seit dem 30. Juni? Ein starker Schlusstag kann einen schwachen Monat nicht heilen, er kann ihn nur abmildern.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Dieselben Indizes, vier Zeiträume',
        items: [
          'Freitag: S&P 500 plus 0,7 Prozent, Nasdaq plus 1 Prozent, Dow plus 0,53 Prozent.',
          'Woche: Dow und S&P 500 je rund plus 1 Prozent, Nasdaq plus 1,6 Prozent.',
          'Juli: S&P 500 minus 0,1 Prozent, Nasdaq minus 3,2 Prozent, Dow plus 0,3 Prozent.',
          'Seit Jahresbeginn: S&P 500 plus 9,4 Prozent, Dow plus 9,2 Prozent, Nasdaq plus 9,2 Prozent.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum das mehr ist als eine Formalie',
      },
      {
        type: 'paragraph',
        text: 'Eine Schlagzeile nennt fast immer nur einen dieser Zeiträume, und meistens den, der am meisten hergibt. „Wall Street beendet den Monat mit Gewinnen“ ist zum Freitag richtig und zum Juli falsch – je nachdem, worauf sich das Wort „Monat“ bezieht.',
      },
      {
        type: 'paragraph',
        text: 'Wer eine Zahl liest, prüft deshalb zuerst den **Anfangspunkt**. Ohne ihn ist eine Prozentangabe unvollständig: Sie beschreibt eine Strecke, und eine Strecke braucht zwei Enden.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Die eigene Anlage misst man an dem Zeitraum, in dem man sie hält – nicht an dem, der gerade in der Überschrift steht. Wer seit Januar dabei ist, sieht beim S&P 500 rund neun Prozent Plus und hat den Juli kaum bemerkt.',
      },
    ],
  },
  {
    slug: 'dow-plus-nasdaq-minus-im-selben-monat',
    title: 'Dow plus 0,3, Nasdaq minus 3,2 – im selben Monat',
    teaser:
      'Ein Monat, ein Markt, zwei Vorzeichen: Der Dow gewinnt im Juli 0,3 Prozent, der Nasdaq Composite verliert 3,2 Prozent. Der Unterschied liegt nicht an der Börse.',
    category: 'Märkte',
    publishedAt: '2026-08-01T09:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Indizes', 'Gewichtung', 'Nebenwerte'],
    relatedTopics: ['boerse', 'etf', 'portfolio-aufbau'],
    relatedSymbols: ['dow-jones', 'nasdaq-100', 'russell-2000'],
    sources: [
      {
        label:
          'CNBC: „S&P 500 closes higher Friday as Amazon surges; Dow posts fourth straight winning month“ (Live-Blog, 31. Juli 2026)',
        url: 'https://www.cnbc.com/2026/07/30/stock-market-today-live-updates.html',
      },
      {
        label:
          'The Associated Press / The Epoch Times: „How Major US Stock Indexes Fared July 31“ (31. Juli 2026)',
        url: 'https://www.theepochtimes.com/bright/how-major-us-stock-indexes-fared-july-31-post-6070080',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Im Juli 2026 gewann der Dow Jones Industrial **0,3 Prozent**, der Nasdaq Composite verlor **3,2 Prozent**, der S&P 500 verlor **0,1 Prozent**. Der Nasdaq-100 fiel im selben Monat um **6,95 Prozent** – der stärkste Monatsverlust seit März 2025, als es 7,69 Prozent waren.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Alle vier messen dieselbe Börse',
      },
      {
        type: 'paragraph',
        text: 'Der Unterschied entsteht nicht am Markt, sondern in der Rechenvorschrift. Ein Index ist kein Thermometer, das eine vorhandene Temperatur abliest, sondern eine **Auswahl plus eine Gewichtung** – und beide sind gemacht, nicht gefunden.',
      },
      {
        type: 'table',
        head: ['Index', 'Was drin ist', 'Juli 2026'],
        rows: [
          [
            'Dow Jones Industrial',
            '30 Werte, gewichtet nach Kurshöhe',
            'plus 0,3 Prozent',
          ],
          ['S&P 500', '500 Werte, gewichtet nach Marktwert', 'minus 0,1 Prozent'],
          ['Nasdaq Composite', 'alle Nasdaq-Notierungen', 'minus 3,2 Prozent'],
          [
            'Nasdaq-100',
            '100 grösste Nasdaq-Werte ohne Finanzsektor',
            'minus 6,95 Prozent',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Der Dow enthält dreißig Werte und gewichtet sie nach dem **Kurs** der einzelnen Aktie – eine Eigenheit aus dem Jahr 1896, als man Kurse noch von Hand addierte. Der Nasdaq Composite enthält alles, was an der Nasdaq notiert, und ist damit weit stärker von Technologie geprägt. Wenn Halbleiterwerte einen schlechten Monat haben, trifft es diese beiden Indizes völlig verschieden.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Und die kleinen Werte gehen noch einmal eigene Wege',
      },
      {
        type: 'paragraph',
        text: 'Am Freitag selbst fiel der **Russell 2000**, der Index der kleineren US-Unternehmen, um 14,76 Punkte oder 0,5 Prozent auf 2.931,34 – während die drei großen Indizes stiegen. Seit Jahresbeginn steht er mit **18,1 Prozent** im Plus, gegenüber 9,4 Prozent beim S&P 500.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Was das für die eigene Auswahl heißt',
        items: [
          'Wer „den US-Markt“ kaufen will, kauft immer eine bestimmte Auswahl davon.',
          'Zwei ETFs auf „USA“ können in einem Monat mehrere Prozentpunkte auseinanderliegen, ohne dass einer davon schlecht gemacht wäre.',
          'Der Blick in die Indexregel – Anzahl, Gewichtung, Ausschlüsse – erklärt fast jede Abweichung, die zunächst rätselhaft aussieht.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Ein Index ist eine Antwort auf eine Frage, die jemand vorher gestellt hat. Wer die Frage nicht kennt, kann die Antwort nicht einordnen – und vergleicht sonst Zahlen, die nie dasselbe gemeint haben.',
      },
    ],
  },
  {
    slug: 'halbleiter-schwaechster-monat-microsoft-staerkster',
    title: 'Chips: schwächster Monat seit 2008, Microsoft: stärkster seit 2007',
    metaTitle: 'Halbleiter minus 16,9 Prozent, Microsoft plus 20 Prozent',
    teaser:
      'Der Halbleiter-ETF SMH verliert im Juli 16,9 Prozent, Microsoft gewinnt über 20 Prozent. Beides in derselben Branche, im selben Monat, an derselben Börse.',
    category: 'Geldanlage',
    publishedAt: '2026-08-01T09:15:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Halbleiter', 'Streuung', 'Einzelwerte'],
    relatedTopics: ['aktie', 'etf', 'portfolio-aufbau', 'risiko-und-rendite'],
    relatedSymbols: ['microsoft', 'nvidia', 'nasdaq-100'],
    sources: [
      {
        label:
          'CNBC: „S&P 500 closes higher Friday as Amazon surges; Dow posts fourth straight winning month“ (Live-Blog, 31. Juli 2026)',
        url: 'https://www.cnbc.com/2026/07/30/stock-market-today-live-updates.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Zwei Zahlen aus demselben Juli, beide von CNBC am Freitag gemeldet: Der Halbleiter-ETF **VanEck Semiconductor (SMH) lag im Monat 16,9 Prozent im Minus** – der schwächste Monat seit 2008. Und **Microsoft steuerte auf ein Plus von über 20 Prozent zu** – den stärksten Monat seit Oktober 2007, also seit fast neunzehn Jahren.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Beide gehören zur selben Erzählung',
      },
      {
        type: 'paragraph',
        text: 'Halbleiter und Microsoft werden seit Jahren unter demselben Stichwort gehandelt: künstliche Intelligenz. Wer im Juli auf „KI“ gesetzt hat, konnte damit ein Sechstel verlieren oder ein Fünftel gewinnen. Das Thema war dasselbe, das Ergebnis nicht.',
      },
      {
        type: 'paragraph',
        text: 'Bei Microsoft lag der Grund in einem Bericht: Nach den Quartalszahlen vom Donnerstag legte die Aktie an einem Tag rund 15 Prozent zu, am Freitag weitere 2,5 Prozent. Vor dem Bericht, am Mittwoch, stand sie im Monat nur gut 1,5 Prozent im Plus. **Der ganze Monatsgewinn entstand in zwei Handelstagen.**',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was das über Streuung sagt – und was nicht',
      },
      {
        type: 'paragraph',
        text: 'Der übliche Schluss lautet: also breit streuen. Der ist richtig, aber er ist nur die halbe Lehre. Die andere Hälfte ist, dass **eine Branche keine Einheit ist**. „Halbleiter“ und „Software“ hängen an denselben Investitionen und reagieren trotzdem gegensätzlich, weil der eine Teil die Ausgaben trägt und der andere sie einnimmt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Woran man sich hier leicht täuscht',
        items: [
          'Ein Branchen-ETF ist keine Wette auf ein Thema, sondern auf eine bestimmte Stelle der Wertschöpfungskette.',
          'Ein Monatsgewinn, der an zwei Tagen entsteht, ist mit Markttiming nicht einzufangen – wer die zwei Tage verpasst, hat den Monat verpasst.',
          'Rekordvergleiche wie „schwächster Monat seit 2008“ sagen etwas über die Seltenheit aus, nichts über die Richtung danach.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer zwei Positionen hält, die derselben Geschichte folgen, hält nicht zwangsläufig zweimal dasselbe – und wer eine Branche kauft, sollte wissen, welchen Teil von ihr er kauft.',
      },
    ],
  },
  {
    slug: 'brent-88-oder-90-dollar-zwei-quellen',
    title: 'Brent bei 88,14 oder 90,12 Dollar? Beide Zahlen stimmen',
    teaser:
      'Zum selben Tag nennen zwei Quellen 88,14 und 90,12 Dollar je Barrel Brent. Keine irrt sich – sie messen zu anderen Zeiten und für andere Kontrakte.',
    category: 'Märkte',
    publishedAt: '2026-08-01T09:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Öl', 'Terminkontrakt', 'Quellenkritik'],
    relatedTopics: ['rohstoffe', 'derivat', 'boerse'],
    relatedSymbols: ['brent', 'wti'],
    sources: [
      {
        label:
          'APA/dpa-AFX über Energynewsmagazine: „Ölpreise geben weiter nach“ (31. Juli 2026)',
        url: 'https://www.energynewsmagazine.at/2026/07/31/oelpreise-geben-weiter-nach/',
      },
      {
        label:
          'CNBC: „S&P 500 closes higher Friday as Amazon surges; Dow posts fourth straight winning month“ (Live-Blog, 31. Juli 2026)',
        url: 'https://www.cnbc.com/2026/07/30/stock-market-today-live-updates.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Zum Freitag, dem 31. Juli 2026, stehen zwei Angaben nebeneinander. Die Nachrichtenagentur APA/dpa-AFX meldete: Ein Barrel Brent **zur Lieferung im September kostete 88,14 US-Dollar**, ein Prozent weniger als am Vortag. CNBC meldete zum selben Tag: **Brent legte 1,2 Prozent auf 90,12 Dollar zu**, WTI stieg 1,3 Prozent auf einen Abrechnungspreis von 84,67 Dollar.',
      },
      {
        type: 'paragraph',
        text: 'Nicht nur die Zahlen unterscheiden sich, sondern auch das Vorzeichen. Trotzdem ist keine der beiden Meldungen falsch.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Ein Ölpreis braucht drei Angaben, nicht eine',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was eine Preisangabe vollständig macht',
        items: [
          'Welche Sorte: Brent aus der Nordsee oder WTI aus den USA – zwischen beiden liegen an diesem Tag über fünf Dollar.',
          'Welcher Liefermonat: Der Handel läuft in Terminkontrakten. Der September-Kontrakt ist ein anderes Papier als der Oktober-Kontrakt.',
          'Welcher Zeitpunkt: Eine europäische Redaktion schreibt am späten Nachmittag, eine amerikanische nach dem Handelsschluss in New York. Dazwischen liegen Stunden.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Öl wird nicht als Fass gehandelt, sondern als **Terminkontrakt** – ein Vertrag über eine Lieferung zu einem festen Monat. Es gibt deshalb zu jedem Zeitpunkt viele Ölpreise gleichzeitig, und sie können sich unterschiedlich bewegen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum das kein Randthema ist',
      },
      {
        type: 'paragraph',
        text: 'Wer zwei Meldungen nebeneinanderlegt und einen Widerspruch sieht, zieht schnell den Schluss, eine Quelle sei unzuverlässig. Meistens ist die Wahrheit langweiliger: Die eine misst um 17 Uhr mitteleuropäischer Zeit, die andere um 22 Uhr, und dazwischen ist etwas passiert.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Bei Rohstoffpreisen gehört die Uhrzeit zur Zahl. Wer sie weglässt, hat nicht gekürzt, sondern die Angabe unbrauchbar gemacht – und wer zwei Quellen vergleichen will, vergleicht zuerst die Zeitpunkte.',
      },
    ],
  },
  {
    slug: 'oel-im-juli-von-70-ueber-100-auf-88',
    title: 'Öl im Juli: von 70 über 100 und zurück auf 88 Dollar',
    teaser:
      'Brent startete den Juli bei rund 70 Dollar, stand zeitweise über 100 und schloss bei 88,14. Die Monatsbilanz verschweigt genau das, was dazwischen lag.',
    category: 'Märkte',
    publishedAt: '2026-08-01T09:25:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Öl', 'Volatilität', 'Geopolitik'],
    relatedTopics: ['rohstoffe', 'risiko-und-rendite', 'groesste-crashes'],
    relatedSymbols: ['brent', 'wti'],
    sources: [
      {
        label:
          'APA/dpa-AFX über Energynewsmagazine: „Ölpreise geben weiter nach“ (31. Juli 2026)',
        url: 'https://www.energynewsmagazine.at/2026/07/31/oelpreise-geben-weiter-nach/',
      },
      {
        label:
          'RohstoffWelt nach Reuters: „Ölpreise geben nach, während Tanker weiterhin Konfliktzonen im Nahen Osten befahren“ (30. Juli 2026)',
        url: 'https://www.rohstoff-welt.de/news/742477--Oelpreise-geben-nach-waehrend-Tanker-weiterhin-Konfliktzonen-im-Nahen-Osten-befahren.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Juli 2026 war für den Ölmarkt kein ruhiger Monat. Nach Angaben von APA/dpa-AFX **startete Brent bei etwa 70 Dollar je Barrel**, stieg zeitweise **über die Marke von 100 Dollar** und stand am Monatsende bei **88,14 Dollar** für den September-Kontrakt – ein Prozent unter dem Vortag.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was eine Monatsbilanz nicht zeigt',
      },
      {
        type: 'paragraph',
        text: 'Von 70 auf 88 sind rund 26 Prozent. Diese eine Zahl beschreibt den Monat korrekt und beschreibt ihn zugleich falsch: Zwischen Anfang und Ende lagen ein Anstieg um über 40 Prozent und ein Rückgang um mehr als zehn. Wer im Juli zu- oder verkauft hat, hat den Unterschied erlebt; die Monatsbilanz kennt ihn nicht.',
      },
      {
        type: 'paragraph',
        text: 'Der Fachausdruck dafür ist **Spannweite** – der Abstand zwischen Höchst- und Tiefstkurs eines Zeitraums. Sie steht selten in der Schlagzeile, weil sie keine Richtung hat, aber sie sagt mehr über das Risiko als jede Anfangs-Ende-Rechnung.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Grund lag nicht in Angebot und Nachfrage',
      },
      {
        type: 'paragraph',
        text: 'Getrieben wurde der Markt von der Lage im Nahen Osten. Nach Reuters-Angaben passierten am Dienstag **39 Frachtschiffe die Meerenge Bab al-Mandab** – der höchste Wert seit dem 19. Juli; die Straße von Hormus blieb weitgehend blockiert. Rohstoffexperten der Commerzbank verwiesen auf Bloomberg-Daten, wonach in dieser Woche täglich rund **6,5 Millionen Barrel** über die drei wichtigen Handelsrouten flossen.',
      },
      {
        type: 'quote',
        text: 'Das ist jedoch keine Entwarnung. Die regionale Ausweitung des Nahost-Konflikts belastet den globalen Ölmarkt zusätzlich.',
        source: 'Rohstoffanalyse der Commerzbank, zitiert nach APA/dpa-AFX',
      },
      {
        type: 'paragraph',
        text: 'Preisbewegungen dieser Art entstehen nicht daraus, dass mehr oder weniger Öl gefördert wird, sondern daraus, dass sich die **Einschätzung des Risikos** ändert, es könnte künftig weniger fließen. Das erklärt, warum ein Preis an einem Tag sieben Prozent springen und wenige Tage später ebenso schnell zurückkommen kann.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer Rohstoffe im Depot hat, hält keine Ware, sondern eine Erwartung über eine Ware. Und Erwartungen ändern sich schneller als Förderquoten.',
      },
    ],
  },
  {
    slug: 'us-anleihen-fuenf-komma-zwei-fuenf-prozent',
    title: 'US-Anleihen bei 5,25 Prozent – so viel wie zuletzt 2007',
    teaser:
      'Die Rendite dreißigjähriger US-Anleihen erreicht 5,25 Prozent – Höchststand seit 2007. Warum das die Aktienkurse angeht und was mit den Anleihekursen passiert.',
    category: 'Geldanlage',
    publishedAt: '2026-08-01T09:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Anleihen', 'Rendite', 'Bewertung'],
    relatedTopics: [
      'staatsanleihe',
      'schuldverschreibung',
      'zinseszins',
      'risiko-und-rendite',
    ],
    relatedSymbols: ['sp500', 'nasdaq-100'],
    sources: [
      {
        label:
          'CNBC: „S&P 500 closes higher Friday as Amazon surges; Dow posts fourth straight winning month“ (Live-Blog, 31. Juli 2026)',
        url: 'https://www.cnbc.com/2026/07/30/stock-market-today-live-updates.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Rendite **dreißigjähriger US-Staatsanleihen stieg in dieser Woche auf den höchsten Stand seit 2007** und lag am Freitag rund vier Basispunkte höher bei **5,25 Prozent**. Die zehnjährige Anleihe überschritt **4,7 Prozent** – der höchste Stand seit Januar 2025.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Rendite hoch heißt Kurs runter',
      },
      {
        type: 'paragraph',
        text: 'Eine Anleihe zahlt einen festen Betrag. Steigt die Marktrendite, kann dieser feste Betrag nur dadurch attraktiver werden, dass man weniger für das Papier bezahlt. **Kurs und Rendite bewegen sich deshalb immer gegeneinander** – ein Anleiheinhaber, der bei niedrigeren Renditen gekauft hat, sieht in diesen Wochen Verluste, obwohl der Zinsschein unverändert gezahlt wird.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Zwei Wege, dieselbe Anleihe zu betrachten',
        items: [
          'Wer bis zur Fälligkeit hält, bekommt genau das, was beim Kauf feststand – Kursbewegungen dazwischen ändern daran nichts.',
          'Wer vorher verkaufen muss oder einen Anleihe-ETF hält, der laufend umschichtet, realisiert die Kursänderung sehr wohl.',
          'Je länger die Restlaufzeit, desto stärker schlägt eine Renditeänderung auf den Kurs durch. Deshalb bewegen sich dreißigjährige Papiere heftiger als zweijährige.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Und warum Aktienanleger darauf schauen',
      },
      {
        type: 'paragraph',
        text: 'Eine steigende Anleiherendite ist der Zins, den man ohne Unternehmensrisiko bekommt. Je höher er ist, desto mehr muss eine Aktie bieten, um noch zu überzeugen – und desto weniger ist ein Gewinn wert, der erst in vielen Jahren anfällt. Das trifft besonders Unternehmen, deren Bewertung vor allem auf künftigem Wachstum beruht.',
      },
      {
        type: 'paragraph',
        text: 'CNBC zitiert dazu Terry Sandven von US Bancorp Asset Management mit der Einschätzung, dass eine Bewegung der zehnjährigen Rendite in Richtung fünf Prozent Bewertungen unter Druck setzen dürfte. Als Ursache für den Renditeanstieg nennt der Bericht Zweifel der Anleger an der Entschlossenheit der US-Notenbank im Kampf gegen die Inflation; deren Vorsitzender Kevin Warsh sagte in dieser Woche, man habe keinen Zauberstab.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Anleihen sind kein Nebenschauplatz der Aktienmärkte, sondern deren Maßstab. Wer wissen will, warum Kurse fallen, obwohl die Gewinne stimmen, findet die Antwort oft nicht im Unternehmen, sondern in der Zinskurve.',
      },
    ],
  },
  {
    slug: 'bank-of-japan-haelt-yen-steigt-trotzdem',
    title: 'Bank of Japan hält bei 1,0 Prozent – der Yen steigt trotzdem',
    teaser:
      'Die Bank of Japan lässt den Leitzins bei 1,0 Prozent, dem höchsten Stand seit 31 Jahren. Der Yen steigt trotzdem – dahinter steckt vermutlich der Staat.',
    category: 'Geldpolitik',
    publishedAt: '2026-08-01T09:35:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Japan', 'Devisen', 'Intervention'],
    relatedTopics: ['waehrungen-wechselkurse', 'notenbanken-geldpolitik', 'geldsystem'],
    relatedSymbols: ['eur-jpy', 'nikkei-225'],
    sources: [
      {
        label:
          'dpa-AFX über onvista: „Überblick: KONJUNKTUR vom 31.07.2026 – 17.15 Uhr“ (31. Juli 2026)',
        url: 'https://www.onvista.de/news/2026/07-31-dpa-afx-ueberblick-konjunktur-vom-31-07-2026-17-15-uhr-0-10-26538472',
      },
      {
        label:
          'CNBC: „S&P 500 closes higher Friday as Amazon surges; Dow posts fourth straight winning month“ (Live-Blog, 31. Juli 2026)',
        url: 'https://www.cnbc.com/2026/07/30/stock-market-today-live-updates.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die japanische Zentralbank hat ihren Leitzins am Freitag **unverändert bei 1,0 Prozent** belassen – dem **höchsten Stand seit 31 Jahren**. Ökonomen hatten das erwartet. Zugleich lieferte die Notenbank laut dpa-AFX Hinweise auf eine weitere Erhöhung im Kampf gegen die erhöhte Inflation.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Bewegt hat sich trotzdem etwas – beim Wechselkurs',
      },
      {
        type: 'paragraph',
        text: 'Der Dollar notierte am Freitag nahe dem Tagestief bei **158,15 Yen**; das Tief vom Donnerstag bei 157,96 war der niedrigste Stand seit dem 14. Mai. **In der Woche verlor der Dollar 3,3 Prozent gegenüber dem Yen** – der stärkste Wochenrückgang seit Juli 2024.',
      },
      {
        type: 'paragraph',
        text: 'Der Grund dafür ist mutmaßlich nicht die Zinsentscheidung, sondern ein direkter Eingriff. Nach Einschätzung des UBS-Ökonomen Paul Donovan hat das japanische Finanzministerium in dieser Woche am Devisenmarkt interveniert, um den Yen zu stützen – wobei es weniger um ein bestimmtes Niveau gegangen sein dürfte als um das Tempo der Abwertung.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was eine Devisenintervention ist',
      },
      {
        type: 'paragraph',
        text: 'Eine Intervention ist ein Kauf oder Verkauf der eigenen Währung durch den Staat mit dem Ziel, den Kurs zu beeinflussen. Sie wird in Japan üblicherweise **nicht sofort bestätigt** – die Ungewissheit ist Teil der Wirkung, weil sie den Überraschungseffekt erhält.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum Zins und Wechselkurs zusammenhängen',
        items: [
          'Kapital fließt tendenziell dorthin, wo es höher verzinst wird. Ein niedriger Zins in Japan gegenüber hohen Zinsen in den USA schwächt den Yen.',
          'Deshalb bewegt nicht der Zinsentscheid selbst den Kurs, sondern der Abstand zu den anderen Notenbanken – und dessen erwartete Entwicklung.',
          'Eine Intervention kann diesen Abstand nicht ändern. Sie kauft Zeit, nicht Richtung.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer japanische Aktien oder einen Welt-ETF hält, hält immer auch eine Yen-Position. Ein Kursgewinn in Tokio kann im Euro-Depot verschwinden – und ein fester Yen kann ein Minus in einen Gewinn verwandeln, ohne dass ein einziges Unternehmen etwas dafür getan hätte.',
      },
    ],
  },
  {
    slug: 'eurozone-und-italien-gleiche-zahl-andere-richtung',
    title: 'Eurozone 2,9, Italien 2,9 – gleiche Zahl, andere Richtung',
    teaser:
      'Euroraum 2,9 Prozent, Italien 2,9 Prozent – am selben Tag gemeldet. Die eine Rate ist gestiegen, die andere gefallen. Wie das zusammengeht und was daraus folgt.',
    category: 'Geldpolitik',
    publishedAt: '2026-08-01T09:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Inflation', 'Eurostat', 'Kernrate'],
    relatedTopics: ['inflation', 'notenbanken-geldpolitik', 'geldsystem'],
    relatedSymbols: ['eur-usd'],
    sources: [
      {
        label:
          'dpa-AFX über onvista: „Überblick: KONJUNKTUR vom 31.07.2026 – 17.15 Uhr“ (31. Juli 2026)',
        url: 'https://www.onvista.de/news/2026/07-31-dpa-afx-ueberblick-konjunktur-vom-31-07-2026-17-15-uhr-0-10-26538472',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Am Freitag meldete das Statistikamt **Eurostat** in einer ersten Schätzung: Die Verbraucherpreise im Euroraum lagen im Juli **2,9 Prozent** über dem Vorjahresmonat, nach **2,8 Prozent** im Juni. Volkswirte hatten den Anstieg im Schnitt erwartet. Treiber waren vor allem die wieder höheren Energiepreise.',
      },
      {
        type: 'paragraph',
        text: 'Am selben Tag meldete das italienische Statistikamt **Istat**: Die nach europäischem Standard erhobenen Verbraucherpreise legten in Italien im Juli um **2,9 Prozent** zu – nach **3,0 Prozent** im Juni. Auch dieser Rückgang war erwartet worden.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Zwei gleiche Zahlen, zwei entgegengesetzte Bewegungen',
      },
      {
        type: 'paragraph',
        text: 'Italien liegt im Juli exakt auf dem Durchschnitt des Euroraums – aber es kommt von oben, während der Euroraum von unten kommt. Wer nur die aktuelle Rate liest, sieht zweimal 2,9 und hält beide Länder für gleich. Wer die Vormonate danebenlegt, sieht zwei verschiedene Entwicklungen.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Drei Angaben gehören zu jeder Inflationsrate',
        items: [
          'Der Wert selbst – hier 2,9 Prozent.',
          'Der Vormonatswert, also die Richtung – hier 2,8 im Euroraum, 3,0 in Italien.',
          'Die Erwartung der Volkswirte. Märkte reagieren nicht auf die Zahl, sondern auf die Abweichung von der Erwartung. Hier gab es keine – beide Werte lagen im Rahmen.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum ein Währungsraum viele Inflationsraten hat',
      },
      {
        type: 'paragraph',
        text: 'Der Euroraum ist eine Währungsunion, keine Preisunion. Energie, Mieten, Dienstleistungen und Lebensmittel haben in jedem Land ein anderes Gewicht im Warenkorb, und die Preise selbst entwickeln sich unterschiedlich. Die Rate für den Euroraum ist ein **gewichteter Durchschnitt** – kein Land muss sie treffen, und die meisten tun es nicht.',
      },
      {
        type: 'paragraph',
        text: 'Für die Europäische Zentralbank zählt trotzdem der Durchschnitt: Ihr Ziel ist eine Rate von zwei Prozent auf mittlere Sicht für den gesamten Währungsraum. Ein einzelnes Land kann deshalb eine Geldpolitik bekommen, die zu seiner eigenen Lage nicht passt.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Die eigene Kaufkraft hängt am nationalen Warenkorb, die Zinsen am europäischen Durchschnitt. Diese beiden Zahlen fallen regelmäßig auseinander – und das ist kein Fehler der Statistik, sondern die Bauart der Währungsunion.',
      },
    ],
  },
  {
    slug: 'michigan-konsumklima-zweite-schaetzung',
    title: 'Konsumklima 54,4, dann 55,2: was eine zweite Schätzung ist',
    teaser:
      'Das Konsumklima der Universität Michigan steht bei 55,2 statt erwarteten 54,0 Punkten. Erst- und Zweitschätzung sind zwei Dinge, nicht zwei Meinungen.',
    category: 'Märkte',
    publishedAt: '2026-08-01T09:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Stimmungsindex', 'USA', 'Revision'],
    relatedTopics: ['anlegerpsychologie', 'wie-funktioniert-der-markt', 'inflation'],
    relatedSymbols: ['sp500', 'dow-jones'],
    sources: [
      {
        label:
          'dpa-AFX über onvista: „Überblick: KONJUNKTUR vom 31.07.2026 – 17.15 Uhr“ (31. Juli 2026)',
        url: 'https://www.onvista.de/news/2026/07-31-dpa-afx-ueberblick-konjunktur-vom-31-07-2026-17-15-uhr-0-10-26538472',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Stimmung der US-Verbraucher hat sich im Juli stärker verbessert als erwartet. Das von der **Universität Michigan** erhobene Konsumklima stieg laut der am Freitag veröffentlichten **zweiten Schätzung um 5,7 Punkte auf 55,2 Punkte**. Volkswirte hatten mit einer Revision auf 54,0 Punkte gerechnet; in der ersten Schätzung waren **54,4 Punkte** ermittelt worden.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Drei Zahlen, die leicht durcheinandergeraten',
      },
      {
        type: 'table',
        head: ['Angabe', 'Wert', 'Was sie bedeutet'],
        rows: [
          [
            'Erste Schätzung',
            '54,4 Punkte',
            'Ergebnis der zuerst eingegangenen Antworten, meist Mitte des Monats',
          ],
          [
            'Erwartung',
            '54,0 Punkte',
            'Was Volkswirte für die Revision vorhergesagt hatten',
          ],
          ['Zweite Schätzung', '55,2 Punkte', 'Ergebnis nach vollständiger Erhebung'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Eine Revision ist keine Korrektur eines Fehlers. Die erste Schätzung beruht auf einem Teil der Befragten, die zweite auf allen. Dass sich der Wert dabei verschiebt, ist der Normalfall und kein Anzeichen für Schlamperei.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Ein Index ohne Einheit',
      },
      {
        type: 'paragraph',
        text: 'Die 55,2 Punkte sind kein Preis, kein Prozentsatz und keine Menge. Der Index ist auf ein Basisjahr normiert; sein Wert bedeutet für sich genommen nichts. Aussagekraft bekommt er erst **im Vergleich** – zum Vormonat, zum Vorjahr, zur Erwartung. Der Bericht hält denn auch fest, dass die Stimmung trotz der Verbesserung trüber ist als vor einem Jahr.',
      },
      {
        type: 'paragraph',
        text: 'Und noch etwas unterscheidet einen Stimmungsindex von einer Konjunkturzahl: Er misst, was Menschen sagen, nicht was sie tun. Zwischen beidem liegt regelmäßig eine Lücke – gefragt wird nach der Einschätzung, gezählt wird später der Umsatz.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Bei jeder Stimmungszahl lohnt die Frage, ob es die erste oder die zweite Fassung ist und woran sie gemessen wird. Ohne diese beiden Angaben ist ein Punktwert eine Zahl ohne Bedeutung.',
      },
    ],
  },
  {
    slug: 'gold-zwei-marken-zwei-waehrungen',
    title: 'Gold: 4.100 Dollar und 3.600 Euro – zwei Marken für ein Metall',
    teaser:
      'Der Goldpreis startet schwächer in den Freitag. Dass die Analyse zwei Schwellen nennt, eine in Dollar und eine in Euro, ist die eigentliche Lektion.',
    category: 'Märkte',
    publishedAt: '2026-07-31T09:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Gold', 'Wechselkurs', 'Charttechnik'],
    relatedTopics: ['rohstoffe', 'waehrungen-wechselkurse', 'risiko-und-rendite'],
    relatedSymbols: ['gold', 'eur-usd'],
    sources: [
      {
        label:
          'Goldreporter: „Goldpreis am Freitag schwächer: Wichtige 4.100-Dollar-Marke im Fokus“ und „Goldpreis: 4.100 USD und 3.600 EUR sind der Schlüssel zum Trendwechsel“ (31. Juli 2026)',
        url: 'https://www.goldreporter.de/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Gold startet schwächer in den Freitag. Auf dem Tagesprogramm stehen laut Goldreporter die **Inflationsdaten aus der Eurozone** und die Verteidigung der charttechnisch relevanten Marke von **4.100 US-Dollar**. Schon am Donnerstag hatte das Metall nachgegeben – genannt wurden die Fed und steigende Renditen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum in derselben Analyse zwei Zahlen stehen',
      },
      {
        type: 'paragraph',
        text: 'Auffällig ist nicht die Richtung, sondern die Schreibweise: Als Schlüssel für einen Trendwechsel nennt dieselbe Quelle **4.100 USD und 3.600 EUR**. Das sind nicht zwei Meinungen über einen Preis, sondern zwei Preise – und wer nur einen davon verfolgt, sieht die halbe Bewegung.',
      },
      {
        type: 'paragraph',
        text: 'Gold wird international in Dollar je Feinunze gehandelt. Was ein Anleger im Euroraum bezahlt, entsteht erst durch eine zweite Rechnung: Dollarpreis geteilt durch den Wechselkurs Euro/Dollar. **Ein Euro-Goldpreis hat deshalb immer zwei Ursachen.**',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was daraus für die Betrachtung folgt',
        items: [
          'Fällt Gold in Dollar und fällt gleichzeitig der Euro, kann der Euro-Preis unverändert bleiben – oder sogar steigen.',
          'Steigt Gold in Dollar und steigt der Euro stärker, steht im Depot ein Verlust, obwohl die Schlagzeile ein Plus meldet.',
          'Wer Gold als Absicherung hält, sichert damit im Euroraum immer auch eine Währungsposition ab, ob gewollt oder nicht.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Und was eine „Marke“ ist – und was nicht',
      },
      {
        type: 'paragraph',
        text: 'Eine charttechnisch relevante Marke ist keine Aussage über den Wert einer Feinunze. Sie ist eine Zahl, an der in der Vergangenheit auffällig viele Aufträge lagen, und sie wirkt vor allem, **weil viele Marktteilnehmer sie beobachten**. Das macht sie nicht wertlos – aber es macht sie zu einer Aussage über das Verhalten der Beteiligten, nicht über das Metall.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer eine Meldung über den Goldpreis liest, prüft zuerst die Währung. Ohne sie ist die Zahl unvollständig – und zwei Berichte, die sich zu widersprechen scheinen, meinen oft schlicht zwei verschiedene Preise.',
      },
    ],
  },
  {
    slug: 'amazon-neun-prozent-nachboerslich',
    title: 'Amazon springt neun Prozent – nach Börsenschluss',
    teaser:
      'Amazon legt nachbörslich über neun Prozent zu, getragen von der Cloud-Sparte. Warum das außerhalb der Handelszeit geschieht, ist selbst die Lektion.',
    category: 'Märkte',
    publishedAt: '2026-07-31T07:35:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Amazon', 'Quartalszahlen', 'Nachbörse'],
    relatedTopics: ['aktie', 'boerse', 'wann-kaufen-verkaufen'],
    relatedSymbols: ['amazon', 'nasdaq-100'],
    sources: [
      {
        label: 'Trading Economics: US-Aktienmarktindex – Marktbericht vom 31. Juli 2026',
        url: 'https://de.tradingeconomics.com/united-states/stock-market',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Amazon stieg im nachbörslichen Handel um **mehr als neun Prozent**. Das Unternehmen hatte einen Quartalsumsatz gemeldet, der über den Prognosen lag – getragen vom Cloud-Geschäft und von der Erwartung weiter steigender Ausgaben für künstliche Intelligenz.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum die größte Bewegung außerhalb der Öffnungszeit liegt',
      },
      {
        type: 'paragraph',
        text: 'Große US-Unternehmen berichten fast immer **nach** Handelsschluss. Das ist kein Zufall, sondern Absicht: Eine Meldung mitten im Handel träfe auf einen laufenden Markt und erzeugte Sprünge, bevor irgendjemand die Zahlen gelesen hat. Nach Börsenschluss haben alle dieselben Stunden Zeit.',
      },
      {
        type: 'paragraph',
        text: 'Gehandelt wird trotzdem – im nachbörslichen Handel, aber mit viel weniger Beteiligten. Weniger Beteiligte heißt größere Ausschläge bei kleineren Aufträgen. Ein Plus von neun Prozent nach Börsenschluss ist deshalb ein **Signal**, keine feststehende Bewertung.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was das für Privatanleger heißt',
        items: [
          'Der nachbörsliche Kurs ist selten der Eröffnungskurs des nächsten Tages. Dazwischen liegt eine Nacht mit Analysen und weiteren Meldungen.',
          'Wer hier mit einer Bestens-Order hineingeht, kauft in einen dünnen Markt – die Spanne zwischen Geld und Brief ist dort deutlich größer.',
          'Die Zahl in der Schlagzeile stammt fast immer aus diesem dünnen Handel.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer eine Quartalsmeldung als Anlass für eine Entscheidung nimmt, hat es selten eilig. Der reguläre Handel am nächsten Tag zeigt, was der Markt wirklich davon hält – und er ist der erste Kurs, zu dem man vernünftig handeln kann.',
      },
    ],
  },
  {
    slug: 'apple-faellt-trotz-iphone-plus',
    title: 'Apple verliert sechs Prozent – trotz 22 Prozent mehr iPhones',
    teaser:
      'Der iPhone-Absatz stieg um 22 Prozent, der Umsatz übertraf die Schätzungen – und die Aktie fiel über sechs Prozent. Der Grund steckt in einer einzigen Sparte.',
    category: 'Märkte',
    publishedAt: '2026-07-31T07:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Apple', 'Quartalszahlen', 'Erwartungen'],
    relatedTopics: ['aktie', 'wann-kaufen-verkaufen', 'anlegerpsychologie'],
    relatedSymbols: ['apple', 'nasdaq-100'],
    sources: [
      {
        label: 'Trading Economics: US-Aktienmarktindex – Marktbericht vom 31. Juli 2026',
        url: 'https://de.tradingeconomics.com/united-states/stock-market',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Apple fiel nachbörslich um **mehr als sechs Prozent**. Dabei übertraf der Quartalsumsatz die Schätzungen, und die iPhone-Verkäufe legten um **22 Prozent** zu. Verfehlt wurden die Erwartungen an einer Stelle: bei den Umsätzen im Dienstleistungsbereich.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum ausgerechnet diese Sparte den Kurs bewegt',
      },
      {
        type: 'paragraph',
        text: 'Ein Kurs bildet nicht ab, was ein Unternehmen verdient, sondern was der Markt künftig erwartet. Hardware-Verkäufe sind einmalig und schwanken mit dem Produktzyklus. Dienstleistungen – App Store, Abonnements, Cloud – kommen wiederkehrend, mit höherer Marge und besser planbar. Genau deshalb wiegt eine Enttäuschung dort schwerer als ein guter Hardware-Monat.',
      },
      {
        type: 'paragraph',
        text: 'Dazu kommt der Bezugspunkt. Die Erwartung ist bereits im Kurs enthalten, bevor die Zahlen erscheinen. Wer eine Aktie kauft, zahlt schon für das erwartete Wachstum. Erfüllt sich die Erwartung nur, ist das keine gute Nachricht – es ist keine Nachricht. Bewegung entsteht allein durch die **Abweichung**.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die drei Fragen bei jeder Quartalsmeldung',
        items: [
          'Welche Zahl wurde erwartet? Ohne den Vergleichsmaßstab sagt eine Rekordzahl nichts.',
          'Welcher Teil des Geschäfts hat abgewichen – der wiederkehrende oder der einmalige?',
          'Was sagt das Unternehmen über die kommenden Quartale? Der Ausblick bewegt oft mehr als das Ergebnis.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** „Gute Zahlen, fallender Kurs“ ist kein Widerspruch und keine Unvernunft des Marktes. Es heißt, dass die Zahlen gut waren – aber weniger gut als eingepreist. Wer das einmal verstanden hat, liest Quartalsberichte anders.',
      },
    ],
  },
  {
    slug: 'drei-indizes-drei-zahlen',
    title: 'Nasdaq +2,8, Dow +1,2 – ein Tag, drei verschiedene Zahlen',
    teaser:
      'Der Nasdaq stieg um 2,78 Prozent, der S&P 500 um 1,66, der Dow um 1,19. Derselbe Markt, dieselben Stunden – der Unterschied liegt im Bauplan.',
    category: 'Märkte',
    publishedAt: '2026-07-31T07:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Indizes', 'Nasdaq', 'Dow Jones'],
    relatedTopics: ['boerse', 'etf', 'aktien-laender-branchen'],
    relatedSymbols: ['nasdaq-100', 'sp500', 'dow-jones'],
    sources: [
      {
        label: 'Trading Economics: US-Aktienmarktindex – Marktbericht vom 31. Juli 2026',
        url: 'https://de.tradingeconomics.com/united-states/stock-market',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Handelstag am Donnerstag brachte drei Zahlen für einen Markt: Der technologielastige **Nasdaq Composite stieg um 2,78 Prozent**, der **S&P 500 um 1,66**, der **Dow um 1,19**. Vorn lagen Technologie-, Konsumgüter- und Industriewerte.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Drei Baupläne, drei Ergebnisse',
      },
      {
        type: 'table',
        caption: 'Was die drei Indizes voneinander unterscheidet.',
        head: ['Index', 'Gewichtung', 'Folge'],
        rows: [
          [
            'Dow Jones',
            'nach Kurs je Aktie, 30 Werte',
            'Eine teure Aktie zählt mehr als ein großes Unternehmen',
          ],
          [
            'S&P 500',
            'nach Marktwert, 500 Werte',
            'Die größten Konzerne bestimmen den Ausschlag',
          ],
          [
            'Nasdaq Composite',
            'nach Marktwert, Schwerpunkt Technologie',
            'Ein Technologietag schlägt hier am stärksten durch',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'An einem Tag, an dem Technologiewerte vorn liegen, muss der Nasdaq stärker steigen als der Dow – nicht weil er „besser“ ist, sondern weil mehr von dem darin steckt, was gerade steigt. An einem Tag mit starken Industriewerten kehrt sich das um.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Für die eigene Anlage',
        items: [
          'Wer „den amerikanischen Markt“ abbilden will, meint fast immer den S&P 500 – der Dow ist ein Ausschnitt aus dreißig Werten mit einer eigentümlichen Gewichtung.',
          'Ein Welt-ETF enthält typischerweise über sechzig Prozent USA. Wer ihn hält, hat den S&P 500 bereits weitgehend im Depot.',
          'Vergleiche über verschiedene Indizes hinweg sagen wenig, solange die Baupläne verschieden sind.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** „Die Börse ist gestiegen“ ist eine unvollständige Aussage, solange nicht dabeisteht, welche. Der Unterschied von 2,78 zu 1,19 Prozent an einem einzigen Tag ist kein Messfehler – er ist die Bauart.',
      },
    ],
  },
  {
    slug: 'chipwerte-setzen-rally-fort',
    title: 'Chipwerte legen weiter zu – fünf Namen, fünf verschiedene Zahlen',
    teaser:
      'Micron, Sandisk, AMD, Intel und Nvidia stiegen im erweiterten Handel zwischen 0,7 und 5,4 Prozent. Die Spanne zeigt, was „die Halbleiterbranche“ verdeckt.',
    category: 'Märkte',
    publishedAt: '2026-07-31T07:50:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Halbleiter', 'Branche', 'Streuung'],
    relatedTopics: ['aktien-laender-branchen', 'portfolio-aufbau', 'risiko-und-rendite'],
    relatedSymbols: ['nvidia', 'amd', 'intel'],
    sources: [
      {
        label: 'Trading Economics: US-Aktienmarktindex – Marktbericht vom 31. Juli 2026',
        url: 'https://de.tradingeconomics.com/united-states/stock-market',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die Chiphersteller setzten ihre Aufwärtsbewegung im erweiterten Handel fort. Die Zahlen dazu: **Sandisk 5,4 Prozent**, **Intel 4,3**, **Micron 3**, **AMD 3** – und **Nvidia 0,7**.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was in einer Branchenmeldung untergeht',
      },
      {
        type: 'paragraph',
        text: 'Die Schlagzeile lautet „Chipwerte steigen“, und sie stimmt. Aber zwischen 0,7 und 5,4 Prozent liegt ein Faktor von fast acht. Wer nur die Richtung liest, hält die Branche für einen Block, der sich gemeinsam bewegt. Sie ist keiner.',
      },
      {
        type: 'paragraph',
        text: 'Speicherhersteller, Auftragsfertiger, Entwickler von Grafikprozessoren und integrierte Konzerne verdienen an verschiedenen Dingen. Sie liegen im selben Sammelbegriff und in derselben Nachricht – aber nicht im selben Geschäft.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum das für die Streuung zählt',
        items: [
          'Fünf Halbleiterwerte im Depot sind nicht fünffach gestreut. Sie hängen an derselben Nachfrage und derselben Lieferkette.',
          'An schlechten Tagen zeigt sich das umgekehrt: Dann fallen sie gemeinsam, und die Spanne wird kleiner statt größer.',
          'Wer eine Branche für aussichtsreich hält, sollte trotzdem wissen, welchen Anteil am Gesamtdepot sie ausmacht.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Eine Branchenmeldung nennt eine Richtung, keine Größe. Die Größe steht bei den einzelnen Werten – und dort steht auch, ob die Bewegung breit getragen ist oder von zwei Namen kommt.',
      },
    ],
  },
  {
    slug: 'saisonbereinigung-15000-oder-1000',
    title: 'Minus 15.000 oder minus 1.000? Was Saisonbereinigung wirklich tut',
    teaser:
      'Die Arbeitslosigkeit sank um 15.000 – saisonbereinigt nur um 1.000. Beide Zahlen stehen in derselben Meldung, und der Unterschied ist die eigentliche Aussage.',
    category: 'Märkte',
    publishedAt: '2026-07-31T07:15:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Arbeitsmarkt', 'Saisonbereinigung', 'Statistik'],
    relatedTopics: ['budget-und-sparquote', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['dax'],
    sources: [
      {
        label:
          'Bundesagentur für Arbeit: Arbeitsmarkt im Juni 2026 – Monatsbericht (30.06.2026)',
        url: 'https://www.arbeitsagentur.de/news/arbeitsmarkt',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Im Monatsbericht der Bundesagentur für Arbeit stehen zwei Rückgänge nebeneinander: Die Arbeitslosigkeit sank um **15.000** – und **saisonbereinigt um 1.000**. Wer nur die erste Zahl liest, hält den Monat für deutlich besser, als er war.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum es zwei Zahlen braucht',
      },
      {
        type: 'paragraph',
        text: 'Der Arbeitsmarkt atmet im Jahresrhythmus. Im Frühjahr beginnt die Bausaison, im Sommer enden Ausbildungen, im Winter ruhen Außenberufe. Diese Bewegungen wiederholen sich Jahr für Jahr und haben mit der Konjunktur nichts zu tun. Ein Rückgang im Frühsommer ist deshalb erst einmal nur eines: normal.',
      },
      {
        type: 'paragraph',
        text: 'Die Saisonbereinigung rechnet dieses regelmäßige Muster heraus. Übrig bleibt, was **darüber hinaus** geschah. Wenn von 15.000 nach der Bereinigung 1.000 übrig sind, heißt das: Vierzehn Fünfzehntel des Rückgangs waren Jahreszeit, ein Fünfzehntel war Bewegung.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Die Faustregel',
        items: [
          'Unbereinigt sagt: Wie viele Menschen sind aktuell arbeitslos gemeldet? Das ist die Zahl für die Lage.',
          'Saisonbereinigt sagt: Hat sich etwas verändert, das nicht am Kalender liegt? Das ist die Zahl für die Richtung.',
          'Wer beide vergleicht, sieht sofort, wie viel von einer Schlagzeile Substanz ist.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Bei jeder Monatszahl – Arbeitsmarkt, Auftragseingang, Einzelhandelsumsatz – lohnt der Blick auf das Wort „saisonbereinigt“. Es steht fast immer da. Es ist fast immer die ehrlichere Zahl. Und es ist fast nie die, die in der Überschrift landet.',
      },
    ],
  },
  {
    slug: 'inflation-juli-2026-vorlaeufig-2-8-prozent',
    title: 'Inflation im Juli: 2,8 Prozent – und warum „voraussichtlich“ dabeisteht',
    metaTitle: 'Inflation Juli 2026: vorläufig 2,8 Prozent',
    teaser:
      'Das Bundesamt meldet für Juli vorläufig 2,8 Prozent. „Voraussichtlich“ steht nicht aus Höflichkeit – die endgültige Zahl kommt erst am 12. August.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-31T07:05:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Inflation', 'Destatis', 'Verbraucherpreise', 'Schnellschätzung'],
    relatedTopics: ['inflation', 'notenbanken-geldpolitik'],
    relatedSymbols: ['eur-usd'],
    sources: [
      {
        label:
          'Statistisches Bundesamt: Inflationsrate im Juli 2026 voraussichtlich +2,8 % (Pressemitteilung Nr. 270)',
        url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/07/PD26_270_611.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Das Statistische Bundesamt hat die Verbraucherpreise für Juli veröffentlicht: Die Inflationsrate liegt **voraussichtlich bei 2,8 Prozent** gegenüber dem Vorjahresmonat. Das Wort „voraussichtlich“ steht nicht aus Vorsicht in der Überschrift – es ist eine Aussage über die Zahl selbst.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was eine vorläufige Zahl von einer endgültigen unterscheidet',
      },
      {
        type: 'paragraph',
        text: 'Für den Verbraucherpreisindex werden monatlich mehrere hunderttausend Einzelpreise erhoben – in Geschäften, im Internet, aus Verwaltungsdaten. Bis zum Monatsende liegt davon nicht alles vor. Für die Schnellschätzung rechnet das Amt deshalb mit dem, was bis dahin eingetroffen ist, und schließt auf den Rest.',
      },
      {
        type: 'paragraph',
        text: 'Die **endgültigen Ergebnisse für Juli 2026 erscheinen am 12. August**. Erst dann ist jede Erhebung eingearbeitet. In aller Regel bleibt die Zahl gleich oder verschiebt sich um ein Zehntel – aber sie *kann* sich verschieben, und wer sie als feststehend zitiert, zitiert etwas, das noch nicht feststeht.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum es die Schnellschätzung trotzdem gibt',
        items: [
          'Geldpolitik arbeitet mit Vorlauf. Eine Notenbank, die zwei Wochen auf die endgültige Zahl wartet, entscheidet zwei Wochen später.',
          'Märkte preisen ohnehin, was sie erwarten. Ohne offizielle Vorabzahl entstünde der Preis aus Gerüchten statt aus einer Erhebung.',
          'Der Preis dafür ist die Unschärfe – und die ist benannt, nicht versteckt. Genau dafür steht das Wort „voraussichtlich“.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer Wirtschaftszahlen liest, sollte auf zwei Wörter achten – „vorläufig“ und „endgültig“. Sie stehen fast immer da, werden fast immer überlesen, und sie unterscheiden eine Schätzung von einem Ergebnis. Das gilt für die Inflation genauso wie für Wachstum, Arbeitsmarkt und Außenhandel.',
      },
    ],
  },
  {
    slug: 'arbeitslosenquote-und-unterbeschaeftigung-zwei-zahlen',
    title: 'Zwei Zahlen zum Arbeitsmarkt – und beide stimmen',
    teaser:
      'Die Bundesagentur nennt 2.936.000 Arbeitslose und 3.605.000 Unterbeschäftigte – in derselben Meldung. Beide Zahlen stimmen, sie messen Verschiedenes.',
    category: 'Märkte',
    publishedAt: '2026-07-31T07:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Arbeitsmarkt', 'Bundesagentur für Arbeit', 'Unterbeschäftigung'],
    relatedTopics: ['budget-und-sparquote', 'notenbanken-geldpolitik'],
    relatedSymbols: ['dax'],
    sources: [
      {
        label:
          'Bundesagentur für Arbeit: Arbeitsmarkt im Juni 2026 – „Verhaltener Ausklang der Frühjahrsbelebung“ (30.06.2026)',
        url: 'https://www.arbeitsagentur.de/news/arbeitsmarkt',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Im zuletzt veröffentlichten Monatsbericht der Bundesagentur für Arbeit stehen zwei Zahlen dicht beieinander: **2.936.000 Arbeitslose** und **3.605.000 Unterbeschäftigte**. Der Abstand beträgt fast siebenhunderttausend Menschen. Keine der beiden Zahlen ist falsch – sie zählen Verschiedenes, und der Unterschied ist der eigentliche Inhalt.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Wer als arbeitslos gilt – und wer nicht',
      },
      {
        type: 'paragraph',
        text: 'Als arbeitslos zählt, wer keine Beschäftigung hat, dem Arbeitsmarkt zur Verfügung steht und bei der Agentur gemeldet ist. Wer in einer Fortbildung sitzt, in einer Maßnahme steckt oder vorübergehend krankgeschrieben ist, fällt aus dieser Zählung heraus – er sucht in diesem Moment keine Arbeit im Sinne der Statistik.',
      },
      {
        type: 'paragraph',
        text: 'Die **Unterbeschäftigung** nimmt genau diese Menschen wieder hinzu. Sie beantwortet nicht die Frage „wer ist gemeldet arbeitslos?“, sondern „für wie viele Menschen fehlt eine reguläre Stelle?“. Deshalb liegt sie höher, und deshalb ist sie die robustere Größe: Sie lässt sich nicht dadurch senken, dass mehr Maßnahmen beginnen.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Drei Zahlen, die zusammen ein Bild ergeben',
        items: [
          'Arbeitslosenquote 6,2 Prozent – die Schlagzeilenzahl, gemeldet und amtlich abgegrenzt.',
          'Unterbeschäftigung 3.605.000 – dieselbe Lage ohne den Effekt der Arbeitsmarktpolitik.',
          'Sozialversicherungspflichtige Beschäftigung 34,84 Millionen, rund 71.000 weniger als ein Jahr zuvor – die Gegenprobe von der anderen Seite.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Die dritte Zahl ist die unbequemste. Arbeitslosigkeit kann sinken, während zugleich die Zahl der regulären Stellen zurückgeht – dann sind Menschen aus der Zählung gefallen, ohne dass Arbeit entstanden ist. Genau das steht im Bericht: Die Arbeitslosigkeit ging um 15.000 zurück, die Beschäftigung lag trotzdem unter dem Vorjahr.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Eine einzelne Arbeitsmarktzahl trägt keine Aussage über die Lage. Wer wissen will, wie es steht, liest die Quote gegen die Unterbeschäftigung und beide gegen die Zahl der Beschäftigten. Stimmen die drei nicht überein, ist der Widerspruch die Nachricht – nicht die Zahl, die am besten aussieht.',
      },
    ],
  },
  {
    slug: 'fed-haelt-zinsen-drei-stimmen-fuer-erhoehung',
    title: 'Fed hält die Zinsen – aber drei Stimmen wollten die Erhöhung',
    teaser:
      'Die Fed beließ den Leitzins bei 3,50 bis 3,75 Prozent – mit neun zu drei Stimmen. Drei Mitglieder wollten erhöhen: Das Stimmenverhältnis ist die Nachricht.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-30T06:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Fed', 'Leitzins', 'Kevin Warsh', 'Abweichler'],
    relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt', 'inflation'],
    relatedSymbols: ['sp500', 'dow-jones', 'eur-usd'],
    sources: [
      {
        label:
          'CNBC: Fed meeting recap – Warsh says Fed won’t hesitate to stop inflation (29.07.2026)',
        url: 'https://www.cnbc.com/2026/07/29/fed-meeting-today-live-updates.html',
      },
      {
        label:
          'CNN Business: Two key takeaways from the Fed’s unusually unpredictable meeting (29.07.2026)',
        url: 'https://www.cnn.com/2026/07/29/economy/fed-rate-decision-july',
      },
      {
        label: 'Trading Economics: Fed hält Zinssätze stabil (29.07.2026)',
        url: 'https://de.tradingeconomics.com/united-states/interest-rate/news/463954',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Die US-Notenbank hat am Mittwochabend den Leitzins in der Spanne von 3,50 bis 3,75 Prozent belassen – so, wie es nach dem FedWatch-Instrument der CME Group 77,7 Prozent des Marktes erwartet hatten. Und trotzdem folgte der schwerste US-Börsentag seit April 2025. Wie passt das zusammen?',
      },
      {
        type: 'paragraph',
        text: 'Die Antwort steht nicht im Zinssatz, sondern im Abstimmungsergebnis: **neun zu drei**. Beth Hammack (Cleveland), Neel Kashkari (Minneapolis) und Lorie Logan (Dallas) stimmten gegen das Stillhalten – sie wollten eine Erhöhung um einen Viertelpunkt. Drei Abweichler in dieselbe Richtung gab es zuletzt im September 2016.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum ein erwarteter Entscheid trotzdem bewegt',
      },
      {
        type: 'paragraph',
        text: 'Gestern früh stand an dieser Stelle: Was drei Viertel des Marktes erwarten, steht bereits in jedem Kurs – Bewegung entsteht nur durch die Abweichung. Genau das ist eingetreten, nur saß die Abweichung nicht im Zinssatz. Eingepreist war ein ruhiges Stillhalten. Gekommen ist ein Stillhalten, bei dem ein Viertel des Ausschusses die Zinsen lieber angehoben hätte.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Drei Signale, die nicht im Zinssatz standen',
        items: [
          'Die Richtung des Widerspruchs: Alle drei Abweichler wollten erhöhen, keiner senken. Der Ausschuss ringt also nicht mit der Frage, wann gelockert wird, sondern ob gestrafft werden muss.',
          'Der neue Vorsitzende Kevin Warsh erklärte, die Fed sei unter ihm „nicht im Prognosegeschäft“ – Hinweise auf den weiteren Zinspfad gibt es nicht mehr. Ein Anker der Erwartungsbildung fällt weg.',
          'Zugleich versprach Warsh, gegen die Inflation notfalls zu handeln. Zusammen las der Markt das als: Die nächste Bewegung ist eher eine Erhöhung als eine Senkung.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Dass ein Abstimmungsergebnis Kurse bewegt, ist kein Kuriosum, sondern Lehrbuch: Der Ausschuss besteht aus zwölf Stimmberechtigten, und die Verteilung der Stimmen verrät, wie nah die nächste Zinsänderung ist. Ein 12-zu-0-Stillhalten und ein 9-zu-3-Stillhalten ergeben denselben Zinssatz – aber zwei verschiedene Wahrscheinlichkeiten für die übernächste Sitzung. Gehandelt wird die zweite.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer Notenbankentscheide liest, sollte drei Zeilen prüfen, nicht eine – den Satz, das Stimmenverhältnis und die Begründung der Abweichler. Der Satz ist fast immer eingepreist. Die anderen beiden Zeilen sind es oft nicht.',
      },
    ],
  },
  {
    slug: 'wall-street-schwerster-tag-seit-april-2025',
    title: 'Schwerster Tag seit April 2025: die Wall Street nach der Fed',
    teaser:
      'Der Dow verlor 1.153 Punkte, die Rendite dreißigjähriger US-Anleihen stieg auf den höchsten Stand seit 2007 – nach einem erwarteten Zinsentscheid.',
    category: 'Märkte',
    publishedAt: '2026-07-30T06:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Wall Street', 'Dow Jones', 'Anleiherenditen', 'Fed'],
    relatedTopics: [
      'wie-funktioniert-der-markt',
      'staatsanleihe',
      'notenbanken-geldpolitik',
    ],
    relatedSymbols: ['dow-jones', 'sp500', 'nasdaq-100'],
    sources: [
      {
        label: 'CNBC: Dow drops 1,100 points for worst day since April 2025 (29.07.2026)',
        url: 'https://www.cnbc.com/2026/07/28/stock-market-today-live-updates.html',
      },
      {
        label:
          'BBN Times: DJIA Plunges to 51,594.14 in Its Worst Session Since April 2025',
        url: 'https://www.bbntimes.com/global-economy/dow-jones-djia-plunges-to-51-594-14-in-its-worst-session-since-april-2025',
      },
      {
        label:
          'The Motley Fool: Stocks Slide on Hawkish Fed and Increased Middle East Tensions (29.07.2026)',
        url: 'https://www.fool.com/coverage/stock-market-today/2026/07/29/stock-market-today-july-29-stocks-slide-on-hawkish-fed-and-increased-middle-east-tensions/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Dow Jones verlor am Mittwoch 1.153 Punkte oder 2,19 Prozent und schloss bei 51.594,14 – der größte Tagesverlust seit April 2025. Der S&P 500 gab 1,52 Prozent ab, der Nasdaq 1,74 Prozent. Auslöser war der Fed-Entscheid vom Abend: unveränderte Zinsen, aber drei Stimmen für eine Erhöhung und ein Vorsitzender, der keine Zinsprognosen mehr geben will.',
      },
      {
        type: 'keyfacts',
        items: [
          { label: 'Dow Jones', value: '51.594,14 Punkte, minus 2,19 Prozent' },
          { label: 'S&P 500', value: 'minus 1,52 Prozent' },
          { label: 'Nasdaq', value: 'minus 1,74 Prozent' },
          {
            label: 'Rendite 10-jährige US-Anleihe',
            value: 'über 4,67 Prozent, plus 7 Basispunkte',
          },
          {
            label: 'Rendite 30-jährige US-Anleihe',
            value: 'über 5,2 Prozent – höchster Stand seit 2007',
          },
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die Anleihen übersetzen, was die Aktien fühlen',
      },
      {
        type: 'paragraph',
        text: 'Die aufschlussreichste Zeile des Tages steht nicht bei den Aktien, sondern bei den Anleihen. Die Rendite der zehnjährigen US-Staatsanleihe stieg um 7 Basispunkte über 4,67 Prozent, die der dreißigjährigen um 10 Basispunkte über 5,2 Prozent – den höchsten Stand seit 2007. Steigende Renditen nach einer Notenbanksitzung heißen übersetzt: Der Anleihemarkt glaubt nicht, dass die Inflation unter Kontrolle ist.',
      },
      {
        type: 'paragraph',
        text: 'Für Aktien wirkt das über zwei Wege. Erstens konkurrieren Anleihen mit Aktien um dasselbe Geld – je mehr Zins die sichere Anlage zahlt, desto weniger ist man bereit, für unsichere Gewinne zu bezahlen. Zweitens werden künftige Unternehmensgewinne mit dem Zins abgezinst: Steigt er, sind dieselben Gewinne heute weniger wert. Beides trifft hoch bewertete Aktien am stärksten – deshalb verlor der Nasdaq zeitweise mehr als der breite Markt.',
      },
      {
        type: 'paragraph',
        text: 'Dass der Absturz auf einen Entscheid folgte, den fast alle erwartet hatten, ist dabei kein Widerspruch, sondern der Kernbefund: Eingepreist war der Zinssatz. Nicht eingepreist waren das 9-zu-3-Stimmenverhältnis, der Verzicht auf jede Orientierung zum weiteren Pfad – und ein Ölpreis, der am selben Tag um fast acht Prozent sprang.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer verstehen will, warum Aktien auf eine Notenbank reagieren, schaut auf die Anleiherenditen desselben Tages. Sie sind die Messlatte, an der alle anderen Anlagen hängen – und sie sagen nüchterner als jeder Kommentar, was der Markt aus der Sitzung mitgenommen hat.',
      },
    ],
  },
  {
    slug: 'oelpreis-springt-auf-90-dollar-risikopraemie',
    title: 'Öl springt 7,9 Prozent: was eine Risikoprämie ist',
    teaser:
      'Brent schloss 7,9 Prozent höher bei 90,74 Dollar – nach 16 Prozent Verlust in drei Tagen. Gehandelt wird die Wahrscheinlichkeit, nicht der Ausfall.',
    category: 'Märkte',
    publishedAt: '2026-07-30T06:50:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Ölpreis', 'Brent', 'Iran', 'Risikoprämie'],
    relatedTopics: ['rohstoffe', 'wie-funktioniert-der-markt', 'inflation'],
    relatedSymbols: ['brent', 'wti', 'gold'],
    sources: [
      {
        label:
          'CNBC: Brent oil jumps back above $90 after Trump threatens to hit Iran hard (29.07.2026)',
        url: 'https://www.cnbc.com/2026/07/29/oil-prices-today-brent-wti-iran-us-hormuz.html',
      },
      {
        label:
          'Bloomberg: Oil Surges After Three-Day Drop as US Repels Iran Attack on Base (29.07.2026)',
        url: 'https://www.bloomberg.com/news/articles/2026-07-28/latest-oil-market-news-and-analysis-for-july-29',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Ein Barrel Brent kostete zum Handelsschluss am Mittwoch 90,74 US-Dollar – 7,9 Prozent mehr als am Vortag. Die US-Sorte WTI stieg um 6,6 Prozent auf 84,46 Dollar. Auslöser: Irans Revolutionsgarden feuerten ballistische Raketen auf US-Stellungen, die nach US-Angaben abgefangen wurden; Präsident Trump kündigte an, „hart zurückzuschlagen“. Zudem reklamierten die Revolutionsgarden Angriffe auf drei Tanker für sich.',
      },
      {
        type: 'paragraph',
        text: 'Bemerkenswert ist die Vorgeschichte: In den drei Handelstagen davor hatte Brent 16 Prozent verloren – der größte Drei-Tage-Verlust seit 2020 –, weil eine Verhandlungslösung möglich schien. Erst am Dienstag stand der Preis noch bei rund 84 Dollar. Binnen einer Woche also: steiler Absturz, steiler Sprung. Und in dieser ganzen Zeit ist die physische Ölversorgung nicht zusammengebrochen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Preis handelt Wahrscheinlichkeiten, nicht Lieferungen',
      },
      {
        type: 'paragraph',
        text: 'Was sich hier bewegt, heißt Risikoprämie: der Aufschlag, den der Markt dafür verlangt, dass eine Störung eintreten **könnte**. Durch die Straße von Hormus läuft rund ein Fünftel des weltweit gehandelten Öls. Steigt die geschätzte Wahrscheinlichkeit einer Blockade von, sagen wir, fünf auf fünfzehn Prozent, verteuert sich jedes Barrel – obwohl weiter jedes Barrel geliefert wird. Fällt die Schätzung zurück, verschwindet der Aufschlag ebenso schnell.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Woran man eine Risikoprämie erkennt',
        items: [
          'Der Preis bewegt sich auf Nachrichten hin, nicht auf Lieferdaten – Raketen und Verhandlungssignale, nicht Lagerbestände.',
          'Die Bewegungen sind abrupt und symmetrisch: 16 Prozent runter in drei Tagen, 7,9 Prozent rauf an einem – je nachdem, welches Szenario gerade wahrscheinlicher wirkt.',
          'Sie kann sich in Luft auflösen: Eine Entspannungsnachricht genügt, und der Aufschlag ist weg, ohne dass sich an Angebot oder Nachfrage etwas geändert hätte.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Dass Rohstoffe solche Ausschläge zeigen und Aktien seltener, hat einen strukturellen Grund, der hier schon einmal stand: Ein Rohstoff hat keinen Gewinn, keine Dividende, kein Eigenkapital – nichts, was seinen Preis von unten stützt oder nach oben verankert. Er ist genau das wert, was der Markt für das nächste Barrel zu zahlen bereit ist. Deshalb schlägt eine geänderte Wahrscheinlichkeit voll durch.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer den Ölpreis als Konjunktursignal liest, muss die Risikoprämie herausrechnen. 90 Dollar wegen brummender Nachfrage und 90 Dollar wegen Kriegsangst sind zwei verschiedene Botschaften – mit derselben Zahl.',
      },
    ],
  },
  {
    slug: 'microsoft-uebertrifft-nach-30-prozent-kursverlust',
    title: 'Microsoft überzeugt – die Aktie war zuvor 30 Prozent gefallen',
    teaser:
      'Umsatz 90,0 statt erwarteter 87,7 Milliarden Dollar, Gewinn je Aktie 4,81 statt 4,25 – die Aktie sprang. Leichter fiel das nach zuvor 30 Prozent Kursverlust.',
    category: 'Märkte',
    publishedAt: '2026-07-30T06:55:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Microsoft', 'Quartalszahlen', 'Azure', 'Erwartungen'],
    relatedTopics: ['aktie', 'wann-kaufen-verkaufen', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['microsoft', 'nasdaq-100', 'sp500'],
    sources: [
      {
        label:
          'Finanzmarktwelt: Microsoft-Quartalszahlen überzeugen auf den ersten Blick (29.07.2026)',
        url: 'https://finanzmarktwelt.de/microsoft-quartalszahlen-10-396841/',
      },
      {
        label:
          'BÖRSE ONLINE: Microsoft-Aktie nach 30 Prozent Crash – bringen die Zahlen die Wende?',
        url: 'https://www.boerse-online.de/nachrichten/aktien/microsoft-aktie-nach-30-prozent-crash-bringen-die-zahlen-jetzt-die-wende-20405554.html',
      },
      {
        label:
          'Goldesel: Microsoft-Aktie springt nach Quartalszahlen – Umsatzbeat durch Azure',
        url: 'https://goldesel.de/aktien/news/microsoft-aktie-springt-nach-quartalszahlen-umsatzbeat-durch-azure-capex-passt-copilot-impulse',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Microsoft meldete am Mittwoch nach US-Börsenschluss die Zahlen zum vierten Geschäftsquartal: 90,01 Milliarden Dollar Umsatz, erwartet waren 87,7 Milliarden. Der Gewinn je Aktie lag bei 4,81 Dollar statt der geschätzten 4,25. Die Cloud-Sparte Azure wuchs um 43 Prozent zum Vorjahr und damit ebenfalls stärker als erwartet. Die Aktie legte nachbörslich deutlich zu.',
      },
      {
        type: 'paragraph',
        text: 'Interessant ist weniger der Beat als der Ausgangspunkt. Die Microsoft-Aktie hatte vor den Zahlen rund 30 Prozent unter ihrem Hoch notiert – abverkauft im Sog der Zweifel, ob sich die Milliarden für KI-Rechenzentren je verzinsen, zuletzt verschärft durch den Chip-Ausverkauf der Vortage. Ein Kurs, der so weit gefallen ist, preist gedämpfte Erwartungen ein. Genau daran wird ein Bericht gemessen – nicht an der Vergangenheit und nicht am Hoch.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die Messlatte liegt dort, wo der Kurs sie hingelegt hat',
      },
      {
        type: 'paragraph',
        text: 'Derselbe Bericht hätte im Januar, am Hoch, womöglich Enttäuschung ausgelöst – als Bestätigung dessen, was ohnehin jeder unterstellte. Nach 30 Prozent Kursverlust ist er eine positive Überraschung. Der Bericht ist derselbe; verschoben hat sich die Erwartung, gegen die er antritt. Wenige Stunden später zeigte Meta die Gegenrichtung: Umsatz über den Schätzungen, Aktie dennoch deutlich im Minus – dazu mehr im nächsten Artikel.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** „Gute Zahlen“ und „steigender Kurs“ sind zwei verschiedene Aussagen, verbunden nur über die Erwartung. Wer Quartalszahlen liest, sollte deshalb immer zwei Dinge kennen: die Schätzungen der Analysten – und wo der Kurs relativ zu seiner eigenen Geschichte steht.',
      },
    ],
  },
  {
    slug: 'meta-umsatz-ueber-erwartung-gewinn-darunter',
    title: 'Meta: Umsatz über Erwartung, Gewinn deutlich darunter',
    teaser:
      'Der Umsatz lag mit 60,8 Milliarden Dollar über den Schätzungen – die Aktie fiel trotzdem um acht Prozent. Der Grund steht in der Kostenzeile: plus 55 Prozent.',
    category: 'Märkte',
    publishedAt: '2026-07-30T07:00:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Meta', 'Quartalszahlen', 'Investitionen', 'Kosten'],
    relatedTopics: ['aktie', 'risiko-und-rendite', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['meta', 'nasdaq-100', 'microsoft'],
    sources: [
      {
        label:
          'Investing.com: Meta misses EPS in Q2 2026 as stock sinks after hours (29.07.2026)',
        url: 'https://www.investing.com/news/transcripts/earnings-call-transcript-meta-misses-eps-in-q2-2026-as-stock-sinks-after-hours-93CH-4821910',
      },
      {
        label:
          'Seeking Alpha: Meta raises lower end of capex range, sees increased legal expenses (29.07.2026)',
        url: 'https://seekingalpha.com/news/4620908-meta-platforms-raises-lower-end-of-capex-range-sees-increased-legal-expenses-in-fy26',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Meta meldete am Mittwochabend für das zweite Quartal 60,8 Milliarden Dollar Umsatz – etwas mehr, als Analysten geschätzt hatten. Der Gewinn je Aktie verfehlte dagegen deutlich: 6,18 Dollar statt erwarteter 7,14, rund 13 Prozent darunter. Die Aktie verlor nachbörslich etwa acht Prozent.',
      },
      {
        type: 'paragraph',
        text: 'Wie beides zugleich stimmen kann, zeigt der Weg vom Umsatz zum Gewinn: Die betrieblichen Kosten stiegen um 55 Prozent zum Vorjahr – getrieben vom Aufbau der KI-Rechenzentren und von gestiegenen Rechtskosten. Das Betriebsergebnis fiel dadurch um acht Prozent, obwohl oben mehr hereinkam. Zusätzlich hob Meta die Untergrenze der geplanten Investitionen an: 135 bis 145 Milliarden Dollar sollen es im Gesamtjahr werden, fast ausschließlich für Rechenzentren und KI-Infrastruktur.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Wohin der Umsatz verschwindet',
      },
      {
        type: 'paragraph',
        text: 'Eine Gewinn- und Verlustrechnung ist eine Kette: Umsatz minus Kosten gleich Betriebsergebnis, daraus nach Steuern der Gewinn, geteilt durch die Aktienzahl der Gewinn je Aktie. Ein Beat ganz oben sagt nichts darüber, was unten ankommt – jede Zwischenzeile kann ihn aufzehren. Bei Meta taten das zwei Posten: laufende Kosten für Personal und Rechenzentren, die sofort in der Rechnung stehen, und die Investitionen, die als Abschreibungen die Gewinne der **kommenden** Jahre belasten werden.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Zwei Berichte, ein Abend – ein Lehrstück',
        items: [
          'Microsoft: Umsatz und Gewinn über den Schätzungen, Aktie nachbörslich deutlich im Plus – nach 30 Prozent Kursverlust im Vorfeld.',
          'Meta: Umsatz über den Schätzungen, Gewinn 13 Prozent darunter, Aktie rund acht Prozent im Minus.',
          'Beide Unternehmen investieren Milliarden in KI. Der Unterschied an diesem Abend: wo die Erwartung lag und was unten in der Rechnung ankam.',
        ],
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Die Umsatzzeile beantwortet die Frage „wächst das Geschäft?“. Die Gewinnzeile beantwortet „bleibt davon etwas übrig?“. Wer nur eine der beiden liest, kennt die halbe Geschichte – und die Kursreaktion richtet sich regelmäßig nach der anderen Hälfte.',
      },
    ],
  },
  {
    slug: 'bitcoin-drei-quellen-drei-kurse-uhrzeit',
    title: 'Bitcoin: drei Quellen, drei Kurse – alle richtig',
    teaser:
      'Eine Quelle meldete 62.850 Dollar, eine zweite 64.378, eine dritte 64.400. Kein Widerspruch: Ein Markt ohne Schlussglocke hat nur Kurse zu Uhrzeiten.',
    category: 'Geldanlage',
    publishedAt: '2026-07-30T07:05:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Bitcoin', 'Kryptowährungen', 'Kursdaten', 'Fed'],
    relatedTopics: ['bitcoin-krypto', 'boerse', 'anlegerpsychologie'],
    relatedSymbols: ['bitcoin', 'ethereum'],
    sources: [
      {
        label:
          'finanzen.net: Kryptomarkt am Nachmittag – Bitcoin erholt sich auf 64.378 Dollar (29.07.2026)',
        url: 'https://www.finanzen.net/nachricht/devisen/kryptomarkt-bitcoin-erholt-sich-auf-64-400-dollar-citadel-wettet-gegen-den-markt-fomc-entscheid-in-wenigen-stunden-00-15830848',
      },
      {
        label:
          'wallstreetONLINE: Bitcoin bei 64.000 Dollar – warum die Fed-Sitzung über den Sommer entscheidet (29.07.2026)',
        url: 'https://www.wallstreet-online.de/nachricht/21167150-bitcoin-kurs-64-000-dollar-fed-sitzung-sommer-entscheidet',
      },
      {
        label:
          'Bitcoin.com News: Händler treiben den Kurs nach dem Fed-Entscheid zurück auf 64.400 Dollar',
        url: 'https://news.bitcoin.com/de/market-updates/bitcoin-haendler-treiben-den-kurs-wieder-auf-64-400-us-dollar-nachdem-die-entscheidung-der-fed-die-nervositaet-am-markt-gemildert-hat/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Wer am Mittwoch den Bitcoin-Kurs nachschlug, fand je nach Quelle und Stunde verschiedene Zahlen: ein Tagestief bei 62.850 Dollar, am Nachmittag 64.378 Dollar – 1,55 Prozent im Plus –, nach dem Fed-Entscheid am Abend rund 64.400 Dollar. Am Dienstag hatten nach fast drei Prozent Tagesverlust noch Zwangsverkäufe über 670 Millionen Dollar den Markt geprägt.',
      },
      {
        type: 'paragraph',
        text: 'Alle diese Zahlen sind richtig. Sie beschreiben nur verschiedene Uhrzeiten – und genau das ist die Eigenheit, an der Krypto-Berichterstattung regelmäßig schief wird.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Ein Markt ohne Schlussglocke',
      },
      {
        type: 'paragraph',
        text: 'Bei einer Aktie ist „der Kurs von Mittwoch“ eine definierte Zahl: der Schlusskurs der Heimatbörse, festgestellt in der Schlussauktion, für den DAX um 17:30 Uhr. Bitcoin handelt dagegen an hunderten Plätzen gleichzeitig, 24 Stunden am Tag, 365 Tage im Jahr. Es gibt keine Schlussauktion, keinen amtlichen Schlusskurs, keinen gemeinsamen Bezugspunkt. „Bitcoin fiel am Mittwoch“ und „Bitcoin stieg am Mittwoch“ können deshalb beide stimmen – je nachdem, welche zwei Zeitpunkte man vergleicht.',
      },
      {
        type: 'paragraph',
        text: 'Dieselbe Falle steckt in Wochenvergleichen: Ein Aktienindex hat rund 252 Handelstage im Jahr, Bitcoin 365. Wer „Wochenperformance“ vergleicht, vergleicht bei der Aktie fünf Handelstage mit sieben bei Bitcoin – inklusive des Wochenendes, an dem dünner Handel die Ausschläge vergrößert.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Bei Kursangaben ohne Uhrzeit ist Skepsis der richtige Reflex – nicht, weil eine Quelle lügt, sondern weil ohne Zeitstempel nicht feststeht, was verglichen wird. Seriöse Angaben zu einem Markt ohne Schlusskurs nennen den Zeitpunkt mit. Das gilt für Nachrichten wie für diese Seite.',
      },
    ],
  },
  {
    slug: 'dax-hat-den-fed-abend-noch-nicht-gehandelt',
    title: 'Der DAX hat den Fed-Abend noch nicht gehandelt',
    teaser:
      'Xetra schloss um 17:30 Uhr – zweieinhalb Stunden vor der Fed. Den schwersten US-Tag seit April 2025 preist der DAX erst heute früh ein: als Kurslücke.',
    category: 'Märkte',
    publishedAt: '2026-07-30T07:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['DAX', 'Kurslücke', 'Handelszeiten', 'Fed'],
    relatedTopics: ['boerse', 'wie-funktioniert-der-markt', 'wann-kaufen-verkaufen'],
    relatedSymbols: ['dax', 'dow-jones', 'euro-stoxx-50'],
    sources: [
      {
        label:
          'aktiencheck: X-Sequentials Daytrading DAX-Index – Mittwoch, 29. Juli 2026',
        url: 'https://www.aktiencheck.de/kolumnen/Artikel-X_Sequentials_Daytrading_DAX_Index_Mittwoch_29_Juli_2026-19968797',
      },
      {
        label: 'CNBC: Stock futures rise as Microsoft jumps after earnings (30.07.2026)',
        url: 'https://www.cnbc.com/2026/07/29/stock-market-today-live-updates.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der DAX beendete den Mittwoch bei 25.489,73 Punkten. Um 17:30 Uhr, als die Xetra-Schlussauktion lief, war die Welt noch eine andere: Der Fed-Entscheid kam erst um 20 Uhr, der Einbruch an der Wall Street folgte danach, die Quartalszahlen von Microsoft und Meta noch später, und der Ölpreis beendete seinen Sprung um 7,9 Prozent erst zum US-Schluss. Nichts davon steckt im DAX-Schlusskurs von gestern.',
      },
      {
        type: 'paragraph',
        text: 'Heute früh um 9 Uhr holt die Eröffnungsauktion das alles auf einmal nach. Der erste Kurs des Tages kann deutlich vom letzten Kurs des Vortags abweichen – dazwischen liegt kein einziger Handel. Diese Lücke im Kursverlauf heißt Kurslücke, im Börsenenglisch „Gap“.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum die Lücke niemandem gehört',
      },
      {
        type: 'paragraph',
        text: 'Die Kurslücke ist der sichtbarste Beleg gegen die Vorstellung, man könne auf Nachrichten „reagieren“: Zwischen 17:30 Uhr gestern und 9 Uhr heute konnte kein Privatanleger auf Xetra einen DAX-Wert handeln. Wer verkaufen will, weil die Fed straffer klang, bekommt nicht den Kurs von gestern Abend, sondern den von heute früh – in dem die Nachricht bereits steckt. Die Bewegung findet in der Auktion statt, nicht danach.',
      },
      {
        type: 'paragraph',
        text: 'Wie groß die Lücke ausfällt, ist dabei offen – die Signale der Nacht sind gemischt. Nach dem US-Schluss meldete Microsoft starke Zahlen, die US-Futures erholten sich. Ein schwacher Wall-Street-Tag heißt außerdem nicht automatisch einen schwachen DAX-Tag: Erst am Dienstag stieg der DAX gegen fallende US-Kurse, getragen vom damals fallenden Ölpreis. Heute wirkt derselbe Kanal andersherum – Öl bei 90 Dollar verteuert Energie für die europäische Industrie.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Wer abends Nachrichten liest und morgens handelt, handelt immer **nach** der Lücke. Das ist kein Fehler im System, sondern dessen Kern – der Preis springt dorthin, wo Angebot und Nachfrage sich nach der Nachricht treffen. Markttiming über Nacht scheitert nicht an der Disziplin, sondern an der Mechanik.',
      },
    ],
  },
  {
    slug: 'bank-of-england-super-thursday-heute',
    title: 'Bank of England: was ein „Super Thursday“ ist',
    teaser:
      'Um 13 Uhr gibt die Bank of England Zinsentscheid, Protokoll und Inflationsbericht gleichzeitig heraus. Erwartet wird Stillhalten bei 3,75 Prozent.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-30T07:15:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Bank of England', 'Leitzins', 'Super Thursday', 'Erwartungen'],
    relatedTopics: ['notenbanken-geldpolitik', 'inflation', 'waehrungen-wechselkurse'],
    relatedSymbols: ['eur-gbp', 'eur-usd'],
    sources: [
      {
        label: 'Bank of England: Monetary Policy Summary and minutes – July 2026',
        url: 'https://www.bankofengland.co.uk/monetary-policy-summary-and-minutes/2026/july-2026',
      },
      {
        label:
          'Tech Times: Bank of England Super Thursday – Hold Expected, but Services Inflation Keeps Hike Risk Live (27.07.2026)',
        url: 'https://www.techtimes.com/articles/321682/20260727/bank-england-super-thursday-hold-expected-services-inflation-keeps-hike-risk-live.htm',
      },
      {
        label:
          'FXStreet: Bank of England – Higher bar seen for rate hikes (ING, 27.07.2026)',
        url: 'https://www.fxstreet.com/news/bank-of-england-higher-bar-seen-for-rate-hikes-ing-202607271451',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Heute um 13 Uhr deutscher Zeit – 12 Uhr in London – gibt die Bank of England ihren Zinsentscheid bekannt. Erwartet wird, dass der Leitzins bei 3,75 Prozent bleibt; die hartnäckige Teuerung bei Dienstleistungen hält die Möglichkeit einer Erhöhung allerdings im Spiel. Die Terminmärkte preisen bis März 2027 zwei Erhöhungen ein, während etwa die ING-Volkswirte die Hürde dafür höher hängen.',
      },
      {
        type: 'paragraph',
        text: 'Der Termin trägt im Londoner Finanzviertel einen eigenen Namen: „Super Thursday“. Gemeint ist, dass die Bank dreierlei zur selben Minute veröffentlicht – die Entscheidung, das Sitzungsprotokoll mit dem Stimmenverhältnis und viermal im Jahr zusätzlich den Geldpolitischen Bericht mit den neuen Inflations- und Wachstumsprognosen. Heute ist ein solcher Berichtstermin.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum alles auf einmal kommt',
      },
      {
        type: 'paragraph',
        text: 'Bis 2015 erschien das Protokoll zwei Wochen nach dem Entscheid. Zwei Wochen lang handelte der Markt also auf halber Information – und wer das Protokoll früher deuten konnte, hatte einen Vorsprung. Die Bündelung beseitigt diese Stufung: Seither bewertet der Markt Entscheidung, Begründung und Stimmenverhältnis in einem einzigen Moment. Was gestern Abend die Fed lehrte, gilt hier genauso – bewegen wird nicht der erwartete Satz, sondern die Abstimmung und der Ton des Berichts.',
      },
      {
        type: 'paragraph',
        text: 'Für Anleger im Euroraum läuft die Wirkung vor allem über den Wechselkurs: Klingt die Bank strenger als erwartet, stützt das tendenziell das Pfund – der Kurs des Euro in Pfund fällt. Britische Aktien in einem weltweiten Depot sind darüber doppelt betroffen: über die Kurse in London und über die Umrechnung in Euro.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Bei Notenbankterminen lohnt der Blick auf das Veröffentlichungsformat. Wo Entscheid, Protokoll und Prognosen gebündelt kommen, steckt die Überraschung häufig nicht in der Schlagzeile der ersten Minute, sondern im Stimmenverhältnis und in den Prognosetabellen dahinter.',
      },
    ],
  },
  {
    slug: 'apple-zahlen-heute-vom-rekordhoch-aus',
    title: 'Apple meldet heute Abend – vom Rekordhoch aus',
    teaser:
      'Um 22:30 Uhr legt Apple die Zahlen zum dritten Geschäftsquartal vor – vom Rekordhoch aus. Gestern zeigte Meta, was ein hoher Startpunkt aus guten Zahlen macht.',
    category: 'Märkte',
    publishedAt: '2026-07-30T07:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Apple', 'Quartalszahlen', 'Geschäftsjahr', 'Erwartungen'],
    relatedTopics: ['aktie', 'wie-funktioniert-der-markt', 'worauf-achten-einsteiger'],
    relatedSymbols: ['apple', 'nasdaq-100', 'sp500'],
    sources: [
      {
        label:
          'finanzen.ch: Ausblick – Apple informiert über die jüngsten Quartalsergebnisse (29.07.2026)',
        url: 'https://www.finanzen.ch/nachrichten/aktien/ausblick-apple-informiert-ueber-die-juengsten-quartalsergebnisse-1036376532',
      },
      {
        label: 'macprime: Nächste Quartalszahlen von Apple am 30. Juli 2026',
        url: 'https://www.macprime.ch/a/news/naechste-quartalszahlen-von-apple-am-30-juli-2026',
      },
      {
        label:
          'AVR Online: Apple-Aktie auf Rekordkurs – der große Test für iPhone, KI und Quartalszahlen',
        url: 'https://www.avronline.de/nachrichten/news-views-markets/apple-aktie-allzeithoch-quartalszahlen-ki-2026/25314/',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Heute nach US-Börsenschluss, um 22:30 Uhr deutscher Zeit, legt Apple die Zahlen zum abgelaufenen Quartal vor, anschließend folgt die Telefonkonferenz mit Analysten. Die Aktie geht von einem Rekordniveau in den Termin – und damit mit der anspruchsvollsten Messlatte, die es gibt.',
      },
      {
        type: 'paragraph',
        text: 'Eine Begriffsklärung vorweg, weil sie regelmäßig Verwirrung stiftet: Apple meldet heute das **dritte** Quartal seines Geschäftsjahres 2026 – gemeint sind die Monate April bis Juni, also das zweite Kalenderquartal. Apples Geschäftsjahr endet im September, es läuft dem Kalender um ein Quartal voraus. Microsoft wiederum meldete gestern sein **viertes** Geschäftsquartal für denselben Zeitraum, Meta schlicht das zweite Kalenderquartal.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Drei Unternehmen, derselbe Zeitraum, drei Quartalsnummern',
      },
      {
        type: 'paragraph',
        text: 'Ein Geschäftsjahr darf beginnen, wann das Unternehmen will – Apple wählt den Oktober, Microsoft den Juli, Meta den Januar. Für den Vergleich zählt deshalb nie die Quartalsnummer, sondern der abgedeckte Zeitraum. Wer „Q3 von Apple“ mit „Q2 von Meta“ vergleicht, vergleicht exakt dieselben Monate. Wer dagegen Wachstumsraten über Firmen hinweg vergleicht, ohne die Zeiträume zu prüfen, kann um ein volles Quartal danebenliegen.',
      },
      {
        type: 'paragraph',
        text: 'Zur Messlatte des Abends: Der Mittwoch hat in beide Richtungen vorgeführt, wie Ausgangslage und Reaktion zusammenhängen. Microsoft übertraf die Schätzungen nach einem 30-Prozent-Kursrutsch – die Aktie sprang. Meta übertraf beim Umsatz von einem hohen Niveau aus, verfehlte beim Gewinn – die Aktie fiel um rund acht Prozent. Apple tritt heute vom Rekordhoch an: Ein Kurs auf Allzeithoch enthält die Annahme, dass es gut läuft. Zahlen, die das nur bestätigen, sind dann keine Neuigkeit mehr.',
      },
      {
        type: 'paragraph',
        text: '**Was daraus folgt:** Vor Quartalszahlen sind zwei Fragen nützlicher als jede Prognose – welchen Zeitraum deckt der Bericht wirklich ab, und was hat der Kurs bereits vorweggenommen? Die erste schützt vor schiefen Vergleichen, die zweite vor Überraschung über die Reaktion.',
      },
    ],
  },
  {
    slug: 'fed-entscheid-was-eingepreist-ist-bewegt-nichts',
    title: 'Fed entscheidet heute – warum das Erwartete kaum etwas bewegt',
    teaser:
      'Um 20 Uhr verkündet die Fed ihren Zinsentscheid. 77,7 Prozent des Marktes rechnen mit unverändert – und genau deshalb liegt die Bewegung anderswo.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-29T06:45:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Fed', 'Leitzins', 'Kevin Warsh', 'Erwartungen'],
    relatedTopics: ['notenbanken-geldpolitik', 'wie-funktioniert-der-markt', 'inflation'],
    relatedSymbols: ['sp500', 'eur-usd', 'gold'],
    sources: [
      {
        label: 'LBBW: Fed-Zinsentscheid – Uhrzeit, Ablaufplan und Prognose (29.07.2026)',
        url: 'https://www.lbbw.de/artikel/maerkte-verstehen/fed-zinsentscheid-uhrzeit-ablaufplan-29-07-2026_am7r939aon_d.html',
      },
      {
        label: 'LBBW: Fed-Zinsentscheid – aktueller Leitzins und Prognose 2026',
        url: 'https://www.lbbw.de/artikel/maerkte-verstehen/fed-zinsentscheid-leitzins-prognosen_ait4a5bv66_d.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Heute Abend um 20 Uhr deutscher Zeit gibt die US-Notenbank ihren Zinsentscheid bekannt, eine halbe Stunde später beginnt die Pressekonferenz. Es ist die erste Entscheidung unter dem neuen Vorsitzenden Kevin Warsh. Der Leitzins liegt seit dem 10. Dezember 2025 in der Spanne von 3,50 bis 3,75 Prozent.',
      },
      {
        type: 'paragraph',
        text: 'Nach dem FedWatch-Instrument der CME Group liegt die Wahrscheinlichkeit, dass es dabei bleibt, bei **77,7 Prozent**. Wer daraus schließt, der Abend werde unspektakulär, hat die Hälfte verstanden – und die falsche.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Ein Kurs bezahlt keine Tatsachen, sondern Überraschungen',
      },
      {
        type: 'paragraph',
        text: 'Wenn drei Viertel des Marktes mit unveränderten Zinsen rechnen, dann steht diese Erwartung längst in jedem Anleihekurs, in jedem Wechselkurs und in jeder Aktienbewertung. Tritt sie ein, ändert sich nichts – es wurde ja schon dafür bezahlt. Das ist keine Eigenheit der Notenbanken, sondern die Grundmechanik einer Börse: Gehandelt wird die Differenz zwischen dem, was erwartet wurde, und dem, was kommt.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Wo an so einem Abend die Bewegung entsteht',
        items: [
          'Nicht im Zinssatz selbst – der ist mit 77,7 Prozent Wahrscheinlichkeit bekannt.',
          'Sondern in den restlichen 22,3 Prozent: dem Fall, mit dem kaum jemand gerechnet hat.',
          'Und in der Pressekonferenz, in der es um die nächsten Sitzungen geht. Dafür gibt es keine Wahrscheinlichkeitstabelle.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum die Lage in diesem Sommer besonders unklar ist',
      },
      {
        type: 'paragraph',
        text: 'Die im Juni aktualisierten Projektionen der Notenbanker zeigten eine deutlich straffere Haltung: Die Mehrheit erwartete keine weiteren Senkungen, einzelne Mitglieder sogar Erhöhungen. Dann fiel der Arbeitsmarktbericht für Juli überraschend schwach aus. Beides zusammen ergibt kein klares Bild – und ein unklares Bild ist genau die Lage, in der eine Pressekonferenz mehr bewegt als die Entscheidung.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Für die eigene Anlage vor allem eines: Der Reiz, an solchen Abenden etwas zu tun, ist größer als der Nutzen. Wer heute umschichtet, weil er den Ausgang zu kennen glaubt, wettet nicht gegen die Fed, sondern gegen die 77,7 Prozent – also gegen die gesammelte Einschätzung aller, die dieselbe Information haben und Geld darauf gesetzt haben.',
      },
      {
        type: 'paragraph',
        text: 'Die nützlichere Übung ist, sich vorher aufzuschreiben, was man erwartet. Am Donnerstag lässt sich dann nachlesen, ob man richtig lag – und ob es überhaupt einen Unterschied gemacht hätte.',
      },
    ],
  },
  {
    slug: 'oelpreis-faellt-warum-rohstoffe-schneller-drehen',
    title: 'Öl unter 84 Dollar – warum ein Rohstoff schneller dreht als eine Aktie',
    metaTitle: 'Ölpreis fällt: Warum Rohstoffe schneller drehen',
    teaser:
      'Brent kostet 83,74 Dollar, 1,8 Prozent weniger als am Vorabend. Hinter dem Rückgang steht eine Hoffnung – und dahinter ein Preismechanismus ohne Puffer.',
    category: 'Märkte',
    publishedAt: '2026-07-29T06:40:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Öl', 'Brent', 'Rohstoffe', 'Geopolitik'],
    relatedTopics: ['rohstoffe', 'risiko-und-rendite', 'inflation'],
    relatedSymbols: ['brent', 'wti', 'dax'],
    sources: [
      {
        label:
          'Energynewsmagazine: Brent-Ölpreis gibt auf 83,74 Dollar nach (28.07.2026)',
        url: 'https://www.energynewsmagazine.at/2026/07/28/brent-oelpreis-gibt-auf-8374-dollar-nach/',
      },
      {
        label:
          'ARIVA: Ölpreise fallen weiter – Brent kostet deutlich weniger als 90 US-Dollar (28.07.2026)',
        url: 'https://www.ariva.de/brent-crude-rohoel-ice-rolling-kurs/news/oelpreise-fallen-weiter-brent-kostet-deutlich-weniger-als-12082209',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Ein Barrel Brent zur September-Lieferung kostete am Dienstag 83,74 US-Dollar und damit 1,8 Prozent weniger als am Montagabend. Der Auslöser war keine Zahl, sondern eine Aussicht: Nach der Pause der US-Angriffe am Wochenende keimte die Hoffnung, die Vereinigten Staaten und der Iran könnten wieder verhandeln.',
      },
      {
        type: 'paragraph',
        text: 'Vor wenigen Monaten kostete dasselbe Fass deutlich mehr als 90 Dollar. Wer den Rückgang mit den Kursbewegungen einer Aktie vergleicht, wundert sich über das Tempo. Der Grund dafür steckt in der Sache selbst.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Eine Aktie hat einen Boden, ein Fass Öl nicht',
      },
      {
        type: 'paragraph',
        text: 'Hinter einer Aktie steht ein Unternehmen mit Umsatz, Gewinn und Eigenkapital. Fällt der Kurs weit genug, wird die Bewertung irgendwann so niedrig, dass Käufer eingreifen – es gibt einen rechnerischen Bezugspunkt, auch wenn niemand ihn genau kennt.',
      },
      {
        type: 'paragraph',
        text: 'Ein Rohstoff hat das nicht. Er erwirtschaftet nichts, zahlt keine Dividende und hat kein Eigenkapital. Sein Preis ist ausschließlich das, was jemand heute dafür zahlt – bestimmt von der Menge, die gefördert wird, der Menge, die gebraucht wird, und der Erwartung an beides. Ändert sich die Erwartung, gibt es nichts, was den Preis bremst.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Der Unterschied in einem Satz',
        items: [
          'Bei einer Aktie fragt der Markt: Was verdient dieses Unternehmen künftig?',
          'Bei einem Rohstoff fragt er: Wie viel davon gibt es nächsten Monat, und wie viel braucht jemand?',
          'Die zweite Frage lässt sich durch eine einzige Nachricht über Nacht neu beantworten. Die erste nicht.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum das den DAX freut',
      },
      {
        type: 'paragraph',
        text: 'Billigeres Öl senkt die Kosten fast jedes produzierenden Unternehmens und dämpft zugleich die Inflation – beides hilft europäischen Aktien. Der DAX schloss am Dienstag 0,52 Prozent fester bei 25.492,59 Punkten und näherte sich damit wieder seinem Rekordhoch, während in den USA am selben Tag die Halbleiterwerte einbrachen.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Wer Rohstoffe im Depot hat, sollte den Anteil danach bemessen, wie viel Schwankung er aushält – nicht danach, wie überzeugend die Geschichte gerade klingt. Und wer keine hält, hält sie trotzdem mittelbar: über die Energiekosten der Unternehmen, deren Aktien er besitzt.',
      },
    ],
  },
  {
    slug: 'chip-ausverkauf-was-im-index-davon-haengt',
    title: 'Zwölf Prozent in Seoul – wie viel Halbleiter in einem Welt-ETF steckt',
    metaTitle: 'Chip-Ausverkauf: Wie viel davon steckt im ETF?',
    teaser:
      'SK Hynix und Samsung verlieren über zwölf Prozent, Nvidia knapp fünf. Der Tag ist eine gute Gelegenheit, im eigenen Depot nachzusehen.',
    category: 'Märkte',
    publishedAt: '2026-07-29T06:35:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 6,
    tags: ['Halbleiter', 'ETF', 'Klumpenrisiko', 'KI'],
    relatedTopics: ['etf', 'aktien-laender-branchen', 'risiko-und-rendite'],
    relatedSymbols: ['nvidia', 'amd', 'micron', 'sk-hynix', 'samsung'],
    sources: [
      {
        label:
          'MarketScreener: Weltweite Aktien fallen auf Einmonatstief, Chip-Ausverkauf verschärft sich',
        url: 'https://de.marketscreener.com/boerse-nachrichten/weltaktien-fallen-auf-einmonatstief-chip-ausverkauf-verschaerft-sich-ce7f51ddda80ff24',
      },
      {
        label: 'TradingKey: US-Chip-Aktien brechen vorbörslich ein (28.07.2026)',
        url: 'https://www.tradingkey.com/de/analysis/stocks/us-stocks/262058366-us-chip-stocks-plunged-pre-market-trading-micron-fell-5-amd-intel-fell-4-tradingkey',
      },
      {
        label:
          'Euronews: Shares slip as chip stocks come under heavy selling (28.07.2026)',
        url: 'https://www.euronews.com/business/2026/07/28/shares-slip-as-chip-stocks-come-under-heavy-selling-heres-why',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Ausverkauf bei Halbleiteraktien, der am Montag mit einem Bericht über chinesische Lithografieanlagen begann, hat sich am Dienstag verschärft. Die Speicherhersteller SK Hynix und Samsung Electronics verloren in Seoul mehr als zwölf Prozent – eine zuvor außergewöhnlich starke Rally löste sich binnen zweier Tage auf.',
      },
      {
        type: 'table',
        caption: 'Halbleiterwerte am 28. Juli 2026',
        head: ['Wert', 'Veränderung'],
        rows: [
          ['SK Hynix, Samsung Electronics (Seoul)', 'über −12 %'],
          ['SanDisk (S&P 500, größter Verlierer)', '−11,02 %'],
          ['AMD', '−5,17 %'],
          ['Nvidia', '−4,99 %'],
          ['Lam Research', '−4,46 %'],
          ['Chipindex SOX', '−2,20 %'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Die Auslöser sind drei: anhaltende Zweifel, ob sich die enormen Investitionen in künstliche Intelligenz rechnen; die wachsende Verschuldung, mit der neue Rechenzentren finanziert werden; und die Konkurrenz aus China – der Börsengang des Speicherherstellers CXMT verlief stark, und über den Beginn einer eigenen DUV-Fertigung war schon am Montag berichtet worden.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Die Frage, die sich jetzt lohnt',
      },
      {
        type: 'paragraph',
        text: 'Nicht: Ist der Ausverkauf übertrieben? Das weiß heute niemand. Sondern: Wie viel des eigenen Vermögens hängt eigentlich an dieser einen Branche – auch ohne dass man je eine Chip-Aktie gekauft hat?',
      },
      {
        type: 'paragraph',
        text: 'Denn ein weltweit streuender Index gewichtet nach Börsenwert, nicht nach Anzahl. Wenn eine Branche jahrelang schneller wächst als der Rest, wächst ihr Anteil im Index mit – ohne dass jemand eine Entscheidung getroffen hätte. Wer 2015 einen Welt-ETF gekauft hat, hält heute etwas anderes als damals, obwohl er nichts getan hat.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Streuung nach Anzahl ist nicht Streuung nach Gewicht',
        items: [
          '1.500 Werte im Index klingen nach Streuung.',
          'Wenn die zehn größten davon ein Viertel des Gewichts ausmachen und mehrere davon dieselbe Branche sind, ist es weniger, als es klingt.',
          'Die Zahl steht im Factsheet jedes ETF unter „Top-Positionen“ und „Branchengewichtung“. Sie nachzusehen dauert zwei Minuten.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Nichts Hektisches. Ein Tag wie dieser ist kein Grund zu verkaufen, aber ein guter Anlass nachzusehen. Wer feststellt, dass ein Fünftel seines Depots an einer einzigen Branche hängt, hat eine Entscheidung zu treffen – in Ruhe, und nicht an dem Tag, an dem die Kurse zwölf Prozent nachgeben.',
      },
    ],
  },
  {
    slug: 'bitcoin-liquidationen-hebel-bewegt-den-kurs',
    title: 'Bitcoin unter 64.000 – wenn der Hebel den Kurs selbst bewegt',
    teaser:
      'Bitcoin verliert knapp drei Prozent, rund 670 Millionen Dollar werden zwangsweise glattgestellt. Das eine ist die Ursache des anderen.',
    category: 'Geldanlage',
    publishedAt: '2026-07-29T06:30:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Bitcoin', 'Liquidation', 'Hebel', 'Kryptowährungen'],
    relatedTopics: ['bitcoin-krypto', 'derivat', 'anlegerpsychologie'],
    relatedSymbols: ['bitcoin', 'ethereum'],
    sources: [
      {
        label:
          'wallstreetONLINE: Bitcoin fällt am 28. Juli auf 63.150 Dollar, bevor die Fed entscheidet',
        url: 'https://www.wallstreet-online.de/nachricht/21161918-krypto-news-bitcoin-faellt-28-juli-63-150-dollar-fed-entscheidet',
      },
      {
        label:
          'wallstreetONLINE: BTC stürzt auf 63.400 Dollar, 670 Millionen Dollar werden liquidiert',
        url: 'https://www.wallstreet-online.de/nachricht/21162731-bitcoin-prognose-2026-btc-stuerzt-63-400-dollar-670-millionen-dollar-liquidiert',
      },
      {
        label: 'finanzen.net: Kryptomarkt am Nachmittag des 28. Juli 2026',
        url: 'https://www.finanzen.net/nachricht/devisen/kryptomarkt-bitcoin-gibt-nach-fomc-vorabend-liquidationen-und-ny-regulierungsdruck-druecken-btc-unter-64-000-dollar-00-15826715',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Bitcoin notierte am Dienstag zwischen 63.150 und 63.566 US-Dollar und damit knapp drei Prozent unter dem Vortag. Die Spanne ist kein Widerspruch: Es sind Kurse zu verschiedenen Uhrzeiten desselben Tages, und bei einem Markt, der rund um die Uhr handelt, ist die Uhrzeit ein Teil der Angabe.',
      },
      {
        type: 'paragraph',
        text: 'Bemerkenswert ist eine andere Zahl. Rund 670 Millionen Dollar an Positionen wurden im selben Zeitraum zwangsweise glattgestellt. Der Angst-und-Gier-Index stand bei 29 – im Bereich „Angst“.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was eine Liquidation ist',
      },
      {
        type: 'paragraph',
        text: 'Wer auf Kredit spekuliert, hinterlegt eine Sicherheit und leiht sich den Rest. Fällt der Kurs so weit, dass die Sicherheit den Verlust nicht mehr deckt, verkauft die Börse die Position automatisch – ohne Rückfrage. Das ist eine Liquidation, und sie hat eine Eigenschaft, die sie von einem gewöhnlichen Verkauf unterscheidet: Sie ist erzwungen und kommt genau dann, wenn der Kurs ohnehin fällt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die Rückkopplung',
        items: [
          'Der Kurs fällt.',
          'Gehebelte Positionen werden zwangsverkauft.',
          'Diese Verkäufe drücken den Kurs weiter.',
          'Dadurch werden die nächsten Positionen fällig.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Deshalb sind starke Bewegungen an Kryptobörsen oft steiler, als es die Nachricht dahinter erklärt. Der Kurs bewegt sich am Ende nicht mehr wegen der Meldung, sondern wegen der Positionen, die die Meldung ausgelöst hat. Am Montag lief Bitcoin zweimal gegen 65.600 Dollar und wurde abgewiesen; beim zweiten Mal fiel er in kurzer Zeit um fast 3.000 Dollar.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Wer ohne Hebel investiert ist, wird nie liquidiert – er sitzt einen Rückgang aus, wenn er will. Das ist der eigentliche Unterschied zwischen den beiden Arten, an diesem Markt teilzunehmen, und er zeigt sich nicht im Gewinnfall, sondern an Tagen wie diesem.',
      },
      {
        type: 'paragraph',
        text: 'Ein zweiter Punkt betrifft den Vergleich: Bitcoin handelt an 365 Tagen, ein Aktienindex an rund 252. Wer Wochenendbewegungen mit Börsentagen vermengt, vergleicht ungleiche Zeiträume – und wundert sich über Zahlen, die nur unterschiedlich gezählt sind.',
      },
    ],
  },
  {
    slug: 'goldpreis-in-euro-hat-zwei-ursachen',
    title: 'Gold gibt nach – und warum ein Euro-Preis zwei Ursachen hat',
    teaser:
      'Die Feinunze kostete in London 4.034 Dollar, 41 weniger als am Vortag. Für wen der Preis in Euro zählt, ist damit erst die Hälfte gesagt.',
    category: 'Geldanlage',
    publishedAt: '2026-07-29T06:25:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Gold', 'Wechselkurs', 'Dollar', 'Fed'],
    relatedTopics: ['rohstoffe', 'waehrungen-wechselkurse', 'inflation'],
    relatedSymbols: ['gold', 'eur-usd'],
    sources: [
      {
        label: 'ARIVA: Goldpreis gibt nach – Warten auf US-Zinsentscheidung (28.07.2026)',
        url: 'https://www.ariva.de/gold-kurs/news/goldpreis-gibt-nach-warten-auf-us-zinsentscheidung-12082963',
      },
      {
        label:
          'finanzen.at: US-Zinsentscheidung voraus – Goldpreis gibt nach (28.07.2026)',
        url: 'https://www.finanzen.at/nachrichten/rohstoffe/us-zinsentscheidung-voraus-goldpreis-gibt-nach-1036371883',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'An der Börse in London kostete eine Feinunze Gold – etwa 31,1 Gramm – am Dienstag 4.034 US-Dollar und damit 41 Dollar weniger als am Vortag, ein Minus von 0,88 Prozent. Der Grund lag weniger beim Gold als beim Dollar: Die US-Währung rückte in die Nähe eines Ein-Monats-Hochs, weil immer mehr Handelsdaten auf eine Zinserhöhung im September hindeuten.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Zwei Hebel, ein Preis',
      },
      {
        type: 'paragraph',
        text: 'Gold wird weltweit in Dollar gehandelt. Wer in Deutschland kauft, zahlt in Euro – und dieser Euro-Preis entsteht aus zwei voneinander unabhängigen Größen:',
      },
      {
        type: 'list',
        items: [
          'dem Dollarpreis der Unze, den Angebot und Nachfrage weltweit bestimmen,',
          'dem Wechselkurs Euro zu Dollar, der davon unabhängig schwankt.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Beide können sich gegenläufig bewegen. Ein steigender Dollar verteuert Gold für alle, die in anderen Währungen kaufen – und drückt gleichzeitig den Dollarpreis, weil er Käufer außerhalb der USA abschreckt. Für einen Anleger im Euroraum heben sich diese Effekte teilweise auf. Wer nur die Dollarnotierung liest, sieht deshalb nicht, was in seinem Depot passiert ist.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Die Probe',
        items: [
          'Ist der Goldpreis in Dollar gefallen, in Euro aber gestiegen? Dann war es der Wechselkurs.',
          'Sind beide gefallen? Dann war es das Gold.',
          'Diese Unterscheidung braucht dreißig Sekunden und erklärt die meisten Fälle, in denen sich die Schlagzeile und der eigene Depotauszug zu widersprechen scheinen.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Wer Gold als Absicherung hält, hält immer auch eine Wette auf den Dollar – ob er will oder nicht. Das ist kein Argument dagegen, aber ein Grund, den eigenen Ertrag in Euro zu messen und nicht in der Währung, in der zufällig gehandelt wird. Bemerkenswert ist an diesem Dienstag noch etwas anderes: Auch die zuletzt gefallenen Ölpreise und die damit nachlassenden Inflationsgefahren stützten den Goldpreis nicht.',
      },
    ],
  },
  {
    slug: 'drei-notenbanken-abstimmung-als-nachricht',
    title: 'Drei Notenbanken in drei Tagen – lesen Sie das Abstimmungsergebnis',
    metaTitle: 'Fed, BoE, BoJ: Das Abstimmungsergebnis zählt',
    teaser:
      'Fed, Bank of England und Bank of Japan entscheiden diese Woche. Alle drei halten voraussichtlich still – die Nachricht steht deshalb woanders.',
    category: 'Geldpolitik',
    publishedAt: '2026-07-29T06:20:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Notenbanken', 'Bank of England', 'Bank of Japan', 'Leitzins'],
    relatedTopics: [
      'notenbanken-geldpolitik',
      'waehrungen-wechselkurse',
      'staatsanleihe',
    ],
    relatedSymbols: ['eur-gbp', 'eur-jpy', 'nikkei-225'],
    sources: [
      {
        label: 'Bank of England: Interest rates and Bank Rate – our latest decision',
        url: 'https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate',
      },
      {
        label:
          'HomeOwners Alliance: Will the Bank of England cut interest rates on 30 July 2026?',
        url: 'https://hoa.org.uk/news/interest-rate-predictions-2/',
      },
      {
        label:
          'TechTimes: Bank of Japan holds rates at 1% and upgrades GDP forecast as yen nears 40-year low',
        url: 'https://www.techtimes.com/articles/321731/20260727/bank-japan-holds-rates-1-upgrades-gdp-forecast-yen-nears-40-year-low.htm',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Drei Notenbanken entscheiden innerhalb von drei Tagen: die Fed heute Abend, die Bank of England am Donnerstag um 13 Uhr deutscher Zeit, die Bank of Japan zum Abschluss ihrer Sitzung am Donnerstag und Freitag. In allen drei Fällen erwartet der Markt, dass sich nichts ändert.',
      },
      {
        type: 'table',
        caption: 'Die drei Entscheidungen dieser Woche',
        head: ['Notenbank', 'Leitzins', 'Erwartung'],
        rows: [
          ['Fed (29. Juli)', '3,50–3,75 %', '77,7 % für unverändert'],
          ['Bank of England (30. Juli)', '3,75 %', 'rund 86 % für unverändert'],
          ['Bank of Japan (30./31. Juli)', '1,00 %', 'weit überwiegend unverändert'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum das Ergebnis nicht die ganze Nachricht ist',
      },
      {
        type: 'paragraph',
        text: 'Eine Notenbank entscheidet nicht als Person, sondern als Gremium – und veröffentlicht, wie abgestimmt wurde. Im Juni hielt die Bank of England ihren Zins bei 3,75 Prozent, aber mit 7 zu 2 Stimmen: Megan Greene und Huw Pill stimmten für eine Erhöhung auf 4,00 Prozent. Dasselbe Ergebnis mit 9 zu 0 wäre eine völlig andere Botschaft gewesen.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Was ein Abstimmungsverhältnis verrät',
        items: [
          'Einstimmig: Der Kurs ist gefestigt, eine Änderung ist nicht in Sicht.',
          'Knapp: Es fehlen ein oder zwei Stimmen für die Wende – und die Wende kann bei der nächsten Sitzung kommen.',
          'Deshalb bewegt eine Abstimmung von 5 zu 4 die Anleihemärkte oft mehr als der Zinssatz selbst, der ja unverändert blieb.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Japan: eine Währung als Nebenwirkung',
      },
      {
        type: 'paragraph',
        text: 'Die Bank of Japan hält ihren Zins bei 1,00 Prozent und hat zuletzt ihre Wachstumsprognose angehoben, während der Yen sich einem Vierzig-Jahres-Tief nähert. Beides hängt zusammen: Wer deutlich niedrigere Zinsen bietet als andere, dessen Währung verliert an Nachfrage. Für japanische Exporteure ist das gut, für jeden, der importiert, teuer. Ein Zinsentscheid ist deshalb nie nur eine Zinsentscheidung.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Wer diese Woche verfolgt, sollte nicht auf die Zahl schauen, die überall in der Überschrift steht, sondern auf zwei Zeilen weiter unten: das Abstimmungsverhältnis und den Satz zur nächsten Sitzung. Dort steht, was der Markt am nächsten Morgen einpreist.',
      },
    ],
  },
  {
    slug: 'konsumklima-ein-index-ohne-einheit',
    title: 'Minus 29,6 – wie man einen Index liest, der keine Einheit hat',
    teaser:
      'Das Konsumklima sinkt für August um 0,3 auf −29,6 Punkte. Die Zahl bedeutet für sich genommen nichts – erst der Vergleich macht sie lesbar.',
    category: 'Märkte',
    publishedAt: '2026-07-29T06:15:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['Konsumklima', 'Konjunktur', 'Stimmungsindikator', 'Deutschland'],
    relatedTopics: ['budget-und-sparquote', 'inflation', 'wie-funktioniert-der-markt'],
    relatedSymbols: ['dax'],
    sources: [
      {
        label:
          'retail-news.de: GfK – Konsumklima in Deutschland verharrt auf niedrigem Niveau (Juli 2026)',
        url: 'https://retail-news.de/konsumklima-deutschland-juli-2026-gfk/',
      },
      {
        label: 'NIM: Consumer Climate – aktuelle Verbraucherstimmung',
        url: 'https://www.nim.org/en/consumer-climate',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Der Konsumklima-Indikator für Deutschland sinkt für August um 0,3 Punkte auf **−29,6 Punkte**. Der Teilindikator für die Einkommenserwartung fällt deutlicher: um 2,3 Punkte auf −14,5. Schwache Einkommenserwartungen und eine hohe Sparneigung belasten die Nachfrage, obwohl sich Kauf- und Konjunkturerwartungen leicht verbesserten.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Minus 29,6 was?',
      },
      {
        type: 'paragraph',
        text: 'Nichts. Der Wert hat keine Einheit – keine Euro, keine Prozent, keine Stück. Er entsteht aus Befragungen und ist so normiert, dass ein bestimmter Zeitraum den Nullpunkt bildet. Für sich allein ist die Zahl deshalb bedeutungslos. Lesbar wird sie erst im Vergleich: mit dem Vormonat, mit dem Vorjahr, mit dem langjährigen Mittel.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Drei Fragen an jeden Stimmungsindex',
        items: [
          'Wo lag der Wert im Vormonat? Die Richtung ist wichtiger als der Stand.',
          'Wird die Lage abgefragt oder die Erwartung? Beides steckt oft in derselben Zahl, meint aber Verschiedenes.',
          'Wie weit ist er vom eigenen Normalwert entfernt? Dafür braucht es die Reihe, nicht den einzelnen Punkt.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Lage und Erwartung sind zwei verschiedene Dinge',
      },
      {
        type: 'paragraph',
        text: 'Genau das zeigt dieser Monat. Die Kauf- und Konjunkturerwartungen verbesserten sich leicht – im Juni hatten sich die Stimmungsindikatoren vor dem Hintergrund der Verhandlungen zum Iran-Konflikt aufgehellt. Gleichzeitig fiel die Erwartung an das eigene Einkommen. Man kann die Wirtschaft insgesamt optimistischer sehen und für den eigenen Geldbeutel trotzdem schwarzsehen. Wer nur den Gesamtwert liest, bekommt davon nichts mit.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Für die eigene Planung ist die Einkommenserwartung die interessantere der beiden Zahlen, denn sie beschreibt, was Menschen im nächsten halben Jahr zu tun gedenken – sparen oder ausgeben. Für das Depot folgt daraus wenig unmittelbar. Stimmungsindizes sagen etwas über die Richtung der Konjunktur, aber sie sagen nichts darüber, wann.',
      },
    ],
  },
  {
    slug: 'quartalszahlen-warum-rekorde-den-kurs-druecken',
    title: 'Sechs Bilanzen an einem Morgen – warum Rekorde den Kurs drücken können',
    metaTitle: 'Quartalszahlen: Wenn Rekorde den Kurs drücken',
    teaser:
      'Deutsche Bank, BASF, Porsche und drei weitere legen heute früh Zahlen vor. Ein Kurs kann danach fallen, obwohl die Zahlen gut sind – das ist kein Widerspruch.',
    category: 'Märkte',
    publishedAt: '2026-07-29T06:10:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 5,
    tags: ['Quartalszahlen', 'Erwartungen', 'DAX', 'Bilanz'],
    relatedTopics: ['aktie', 'wann-kaufen-verkaufen', 'anlegerpsychologie'],
    relatedSymbols: ['deutsche-bank', 'basf', 'porsche-ag', 'nordex', 'krones'],
    sources: [
      {
        label: 'onvista: Tagesvorschau – Termine am 29. Juli 2026',
        url: 'https://www.onvista.de/news/2026/07-28-tagesvorschau-termine-am-29-juli-2026-0-10-26536934',
      },
      {
        label: 'ARIVA: Tagesvorschau – Termine am 29. Juli 2026',
        url: 'https://www.ariva.de/news/tagesvorschau-termine-am-29-juli-2026-12083289',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Heute früh veröffentlichen mehrere große deutsche Unternehmen ihre Zahlen zum zweiten Quartal beziehungsweise zum Halbjahr: Krones um 6:45 Uhr, Deutsche Bank, BASF, DWS und Nordex um 7:00 Uhr, Porsche AG um 7:30 Uhr. Analystenkonferenzen und Pressekonferenzen folgen über den Vormittag verteilt.',
      },
      {
        type: 'paragraph',
        text: 'Wer an solchen Tagen die Kurse verfolgt, erlebt regelmäßig etwas, das zunächst unlogisch wirkt: Ein Unternehmen meldet den höchsten Gewinn seiner Geschichte – und die Aktie fällt um fünf Prozent.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Der Kurs kennt die Zahlen schon',
      },
      {
        type: 'paragraph',
        text: 'Nicht die Zahlen selbst, aber die Erwartung an sie. Analysten veröffentlichen Schätzungen, Anleger handeln darauf, und der Kurs am Vorabend enthält bereits die Annahme, wie das Quartal ausgefallen sein dürfte. Am Morgen wird nicht der Gewinn gehandelt, sondern der **Abstand zwischen Gewinn und Erwartung**.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die vier möglichen Fälle',
        items: [
          'Zahlen gut, Erwartung war niedriger: Der Kurs steigt.',
          'Zahlen gut, Erwartung war höher: Der Kurs fällt – trotz Rekord.',
          'Zahlen schwach, Erwartung war noch schwächer: Der Kurs steigt trotz Verlust.',
          'Und in jedem Fall gilt: Der Ausblick auf das kommende Halbjahr wiegt oft schwerer als das abgelaufene Quartal.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Warum der Ausblick mehr zählt als die Bilanz',
      },
      {
        type: 'paragraph',
        text: 'Weil eine Bilanz die Vergangenheit beschreibt und ein Kurs die Zukunft bezahlt. Ein Quartalsbericht ist ein Blick zurück auf drei Monate, die vorbei sind. Der Satz „wir erwarten für das Gesamtjahr“ dagegen ändert die Annahmen für alle kommenden Jahre – und damit den Wert, den der Markt dem Unternehmen beimisst.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Wer eine Aktie langfristig hält, gewinnt an solchen Tagen wenig durch Zuschauen. Die Kursreaktion der ersten Stunde ist überwiegend eine Reaktion auf die Abweichung von einer Schätzung, die in einem Jahr niemand mehr kennt. Interessanter ist der Bericht selbst – und dort weniger der Gewinn als die Frage, woher er kam und ob er wiederkehrt.',
      },
    ],
  },
  {
    slug: 'zwei-boersen-ein-tag-zwei-richtungen',
    title: 'DAX im Plus, Chipwerte im Minus – zwei Börsen, ein Tag',
    teaser:
      'Der DAX schloss 0,52 Prozent fester bei 25.492,59 Punkten, während in New York die Halbleiter einbrachen. Der Unterschied steckt in der Zusammensetzung.',
    category: 'Märkte',
    publishedAt: '2026-07-29T06:05:00+02:00',
    author: 'Redaktion IM Invests',
    readingMinutes: 4,
    tags: ['DAX', 'Index', 'Branchen', 'Streuung'],
    relatedTopics: ['aktien-laender-branchen', 'etf', 'boerse'],
    relatedSymbols: ['dax', 'nasdaq-100', 'sp500'],
    sources: [
      {
        label:
          'ARIVA: DAX-FLASH – Dax nähert sich Rekordhoch, Ölpreisrückgang hilft (28.07.2026)',
        url: 'https://www.ariva.de/dax-index/news/dax-flash-dax-naehert-sich-rekordhoch-oelpreisrueckgang-12082208',
      },
      {
        label:
          'Handelsblatt: Dax schließt im Plus – Siemens Energy größter Verlierer, SAP legt zu',
        url: 'https://www.handelsblatt.com/finanzen/maerkte/marktberichte/dax-aktuell-dax-trotzt-ki-sorgen-und-notiert-im-plus/100243302.html',
      },
    ],
    body: [
      {
        type: 'paragraph',
        text: 'Am selben Dienstag, an dem in Seoul und New York die Halbleiterwerte zweistellig verloren, schloss der DAX 0,52 Prozent fester bei 25.492,59 Punkten und näherte sich damit wieder seinem Rekordhoch. Zwei Börsen, ein Handelstag, zwei Richtungen – wer beide Schlagzeilen nebeneinander liest, hält das leicht für einen Fehler.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Ein Index ist kein Land, sondern eine Liste',
      },
      {
        type: 'paragraph',
        text: 'Der Unterschied liegt nicht in der Stimmung, sondern in der Zusammensetzung. Im Nasdaq 100 stehen Technologie- und Halbleiterunternehmen mit hohem Gewicht; ein Ausverkauf in dieser Branche zieht den ganzen Index mit. Im DAX wiegt dieselbe Branche deutlich weniger, dafür stehen dort Chemie, Versicherer, Autobauer, Industrie und Versorger.',
      },
      {
        type: 'paragraph',
        text: 'Am Dienstag kam hinzu, dass gefallene Ölpreise europäische Werte stützten – für einen Chemiekonzern ist Energie ein Kostenblock, für einen Chiphersteller nicht der entscheidende. Innerhalb des DAX war die Spreizung übrigens genauso groß: Siemens Energy war der größte Verlierer, SAP legte zu.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Was „breit gestreut“ wirklich heißt',
        items: [
          'Nicht: viele Werte. Sondern: Werte, die auf dieselbe Nachricht unterschiedlich reagieren.',
          'Zwanzig Halbleiterunternehmen sind zwanzig Positionen und eine Wette.',
          'Ein Chemiekonzern und ein Softwarehaus sind zwei Positionen und zwei verschiedene Geschäftsmodelle.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Was daraus folgt',
      },
      {
        type: 'paragraph',
        text: 'Dass ein Tag wie dieser kein Argument für oder gegen einen der beiden Märkte ist. Er zeigt nur, dass „der Markt“ als Sammelbegriff wenig taugt: Es gibt keinen Markt, es gibt Listen von Unternehmen, und wer eine davon kauft, kauft ihre Zusammensetzung mit. Die steht im Factsheet, nicht in der Schlagzeile.',
      },
    ],
  },
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
