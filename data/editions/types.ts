import type { NewsCategory } from '@/data/news'

/**
 * Datenmodell für die Tagesausgaben.
 *
 * Eine Ausgabe fasst die Meldungen eines Tages zusammen, die wichtigsten zuerst.
 * Wie viele es sind, gibt der Tag vor – an einem Zinsentscheid sind es andere als
 * an einem ruhigen Freitag. Die Zusammenfassungen sind selbst geschrieben und
 * keine Übernahme fremder Texte; das ist nicht nur redaktionell besser, sondern
 * auch der Grund, warum das Ganze urheberrechtlich unproblematisch ist. Fremde
 * Artikel dürften weder im Volltext noch in längeren Auszügen gespiegelt werden;
 * verlinkt wird stattdessen auf die Quelle.
 */

/** Eine einzelne Meldung innerhalb einer Tagesausgabe. */
export interface EditionItem {
  /** Überschrift der Meldung – erscheint als <h3> unter der Rubrik-Überschrift. */
  headline: string
  /** Die Zusammenfassung in eigenen Worten, je Absatz ein Eintrag. */
  summary: string[]
  category: NewsCategory
  /**
   * Was die Meldung für Privatanleger bedeutet.
   *
   * Der eigentliche Zweck der Rubrik: Eine Meldung allein hilft niemandem
   * weiter. Dieses Feld ist deshalb Pflicht und nicht optional.
   */
  whyItMatters: string
  /** Slugs verwandter Lernthemen aus `data/learn`. */
  relatedTopics: string[]
  /** Symbole verwandter Kurse aus `data/markets.ts`. */
  relatedSymbols: string[]
  /**
   * Belege zum Nachlesen.
   *
   * Mindestens eine Quelle je Meldung. Eine Zusammenfassung ohne nachprüfbare
   * Herkunft ist bei Finanzthemen wertlos.
   */
  sources: { label: string; url: string }[]
}

/**
 * Eine Tagesausgabe.
 *
 * `top` und `further` waren einmal Tupel: drei plus zwei, vom Compiler
 * erzwungen. Das war eine Regel über die Nachrichtenlage, und die hält sich
 * nicht daran. An manchen Tagen gibt es zwei Meldungen, die diesen Namen
 * verdienen, an anderen sieben. Die feste Zahl hätte nur zwei Auswege gelassen:
 * Belangloses auffüllen oder Wichtiges weglassen.
 *
 * Ganz ohne Regel bleibt es trotzdem nicht – die Untergrenzen stehen jetzt in
 * `lib/editions-validate.ts` und brechen den Build. Der Unterschied ist, dass
 * dort eine Zahl steht, die sich begründen lässt, statt einer, die zufällig
 * einmal gestimmt hat.
 */
export interface DailyEdition {
  /** Erscheinungstag im Format YYYY-MM-DD. Gleichzeitig der URL-Slug. */
  date: string
  /**
   * Ein Satz über den Tag.
   *
   * Dient als Einleitung auf der Seite und als Meta-Description. Zielkorridor
   * daher 110 bis 165 Zeichen (siehe `lib/seo.ts`).
   */
  intro: string
  /** Die wichtigsten Meldungen des Tages, mindestens eine. */
  top: EditionItem[]
  /** Weitere Meldungen, die es wert sind, gelesen zu werden. Darf leer sein. */
  further: EditionItem[]
}
