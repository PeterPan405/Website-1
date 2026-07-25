import type { NewsCategory } from '@/data/news'

/**
 * Datenmodell für die Tagesausgaben.
 *
 * Jeden Morgen erscheint eine Ausgabe mit genau fünf Meldungen, davon drei
 * Top-Meldungen. Die Zusammenfassungen sind selbst geschrieben und keine
 * Übernahme fremder Texte – das ist nicht nur redaktionell besser, sondern auch
 * der Grund, warum das Ganze urheberrechtlich unproblematisch ist. Fremde
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
 * `top` und `further` sind absichtlich als Tupel typisiert und nicht als Array:
 * So erzwingt der Compiler die Aufteilung in drei Top-Meldungen und zwei
 * weitere. Eine Ausgabe mit vier oder sechs Meldungen lässt sich damit gar
 * nicht erst schreiben, und niemand muss sich auf eine Prüfung zur Laufzeit
 * verlassen.
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
  /** Die drei wichtigsten Meldungen des Tages. */
  top: [EditionItem, EditionItem, EditionItem]
  /** Zwei weitere Meldungen, die es wert sind, gelesen zu werden. */
  further: [EditionItem, EditionItem]
}
