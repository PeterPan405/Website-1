import { newsArticles, type NewsArticle, type NewsCategory } from '@/data/news'

import { assertNewsValid } from '@/lib/news-validate'

/**
 * Service-Schicht für Nachrichten.
 *
 * Alle Funktionen sind asynchron, damit der Wechsel auf eine echte News-API
 * (oder ein CMS) keine Änderung an den aufrufenden Komponenten erfordert.
 */

export type { NewsArticle, NewsCategory, NewsSource } from '@/data/news'

/*
  Prüfung beim Laden des Moduls und damit bei jedem Build.

  Nachrichten werden schnell geschrieben und schnell ausgetauscht. Ein Artikel
  ohne Quelle oder mit einem Themen-Slug, den es nicht gibt, soll den Build
  abbrechen statt still online zu gehen.
*/
assertNewsValid(newsArticles)

/**
 * Wie viele Schlagzeilen das Karussell der Startseite höchstens zeigt.
 *
 * **Nicht mehr die Grenze zwischen „Aktuelles“ und Archiv.** Die zog bis Juli
 * 2026 diese Zahl, und das war der Fehler: Lieferte ein Tag weniger als neun
 * Artikel, füllte „Aktuelles“ mit dem Vortag auf – aufgeklappt, mitten unter
 * den heutigen. Die Grenze verläuft jetzt am Erscheinungstag, siehe
 * `getCurrentNews`.
 *
 * Als Obergrenze fürs Karussell bleibt die Neun sinnvoll: Sie ist die Länge
 * einer vollen Tagesausgabe, und mehr als das durchzublättern tut niemand.
 */
export const CURRENT_NEWS_COUNT = 9

/**
 * Reduzierte Artikel-Darstellung ohne Fließtext.
 *
 * Das Karussell auf der Startseite ist eine Client-Komponente. Bekäme sie die
 * vollständigen Artikel, landete jeder Artikeltext im JavaScript-Bundle. Diese
 * Variante enthält nur, was für Überschrift und Verlinkung nötig ist.
 */
export interface NewsHeadline {
  slug: string
  title: string
  teaser: string
  category: NewsCategory
  publishedAt: string
  readingMinutes: number
}

function byNewestFirst(a: NewsArticle, b: NewsArticle): number {
  return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
}

function sortedArticles(): NewsArticle[] {
  return [...newsArticles].sort(byNewestFirst)
}

function toHeadline(article: NewsArticle): NewsHeadline {
  return {
    slug: article.slug,
    title: article.title,
    teaser: article.teaser,
    category: article.category,
    publishedAt: article.publishedAt,
    readingMinutes: article.readingMinutes,
  }
}

/** Alle Artikel, neueste zuerst. */
export async function getNewsArticles(limit?: number): Promise<NewsArticle[]> {
  const articles = sortedArticles()
  return typeof limit === 'number' ? articles.slice(0, limit) : articles
}

/**
 * Der Erscheinungstag eines Artikels, in seiner eigenen Zeitzone.
 *
 * Die ersten zehn Zeichen von `publishedAt`. Ein Umweg über `new Date` und
 * `toISOString` verschöbe nach UTC – ein Artikel von 00:30 Uhr deutscher Zeit
 * landete dann auf dem Vortag.
 */
function tagVon(artikel: NewsArticle): string {
  return artikel.publishedAt.slice(0, 10)
}

/**
 * Die aktuellen Meldungen: **alles vom jüngsten Erscheinungstag, sonst nichts.**
 *
 * ## Warum nach Tag und nicht nach Anzahl
 *
 * Bis Juli 2026 standen hier schlicht die neuesten `CURRENT_NEWS_COUNT`
 * Artikel. Das geht gut, solange jeder Tag genau neun liefert – und schief,
 * sobald einer weniger hat: Dann füllte die Liste mit Artikeln des Vortags
 * auf, und die standen oben aufgeklappt zwischen den heutigen, mit vollem
 * Anriss. Wer die Seite öffnete, konnte nicht sehen, wo der heutige Tag endet.
 *
 * Der Tag ist die Einheit, in der diese Nachrichten entstehen – eine Ausgabe
 * gehört zusammen gelesen. Also ist er auch die Einheit der Anzeige: Was von
 * heute ist, steht offen da; alles Ältere liegt im Archiv, nach Tagen
 * gruppiert und zugeklappt, und wird aufgemacht, wer es sehen will.
 *
 * ## Was das für leere Tage bedeutet
 *
 * Nichts. „Jüngster Tag“ heißt der jüngste Tag **mit Artikeln**, nicht heute:
 * Die Website wird statisch gebaut, und nach ein paar Tagen ohne neue Ausgabe
 * wäre „Aktuelles“ sonst leer. Ein Kalenderfilter stünde hier also falsch.
 */
export async function getCurrentNews(): Promise<NewsArticle[]> {
  const alle = sortedArticles()
  const juengster = alle[0] ? tagVon(alle[0]) : null
  if (!juengster) return []
  return alle.filter((artikel) => tagVon(artikel) === juengster)
}

/** Alles außer dem jüngsten Erscheinungstag – die Grundlage des Archivs. */
function aeltereAlsHeute(): NewsArticle[] {
  const alle = sortedArticles()
  const juengster = alle[0] ? tagVon(alle[0]) : null
  if (!juengster) return []
  return alle.filter((artikel) => tagVon(artikel) !== juengster)
}

/**
 * Alles, was aus „Aktuelles“ herausgerutscht ist.
 *
 * Kein eigenes Kennzeichen in den Daten: Was hier landet, ergibt sich allein
 * aus dem Erscheinungstag. Ein Artikel wandert also von selbst nach hinten,
 * sobald ein neuerer Tag erscheint – und bleibt dort vollständig abrufbar.
 *
 * **Das Archiv hat keine Verfallszeit.** Hier steht bewusst kein Datumsfilter
 * und kein `slice` mit Obergrenze: Ein Artikel bleibt, solange es die Website
 * gibt. Wer später eine Grenze einbauen möchte – „nur die letzten dreißig
 * Tage“, „nur hundert Artikel“ –, ändert damit nicht nur eine Anzeige, sondern
 * bricht jeden Verweis, der je auf einen dieser Artikel gesetzt wurde, und
 * nimmt jeder Tagesausgabe die Hälfte ihres Inhalts. Diese Entscheidung ist
 * ausdrücklich gefallen; sie gehört nicht nebenbei rückgängig gemacht.
 */
export async function getFurtherNews(): Promise<NewsArticle[]> {
  return aeltereAlsHeute()
}

/** Ein Tag im Archiv mit den Artikeln, die an ihm erschienen sind. */
export interface Archivtag {
  /** `JJJJ-MM-TT` – zugleich der Schlüssel für die Tagesausgabe. */
  datum: string
  artikel: NewsArticle[]
}

/**
 * Das Archiv nach Erscheinungstag gruppiert, jüngster Tag zuerst.
 *
 * ## Warum gruppiert und nicht als eine Liste
 *
 * Weil die Liste wächst und nie wieder schrumpft: Das Archiv ist dauerhaft,
 * es fällt kein Artikel heraus. Nach ein paar Wochen stünden dort hundert
 * Kacheln ohne Gliederung, und niemand fände darin etwas wieder.
 *
 * Der Tag ist die naheliegende Gliederung, weil er dieselbe Einheit ist, in
 * der die Nachrichten entstehen – und weil es zu vielen Tagen ohnehin eine
 * Tagesausgabe unter `/news/tag/<datum>` gibt, auf die sich von hier aus
 * verweisen lässt.
 */
export async function getFurtherNewsByDay(): Promise<Archivtag[]> {
  const tage = new Map<string, NewsArticle[]>()

  for (const artikel of aeltereAlsHeute()) {
    /*
      Der Tag kommt aus `publishedAt`, nicht aus einem eigenen Feld.

      `publishedAt` trägt eine Zeitzone; die ersten zehn Zeichen sind damit
      der Kalendertag in genau der Zone, in der der Artikel erschienen ist.
      Ein `new Date(...)` mit anschließendem `toISOString()` würde ihn nach
      UTC verschieben – ein Artikel von 00:30 Uhr deutscher Zeit landete
      dann auf dem Vortag.
    */
    const datum = artikel.publishedAt.slice(0, 10)
    const bisher = tage.get(datum)
    if (bisher) bisher.push(artikel)
    else tage.set(datum, [artikel])
  }

  // `sortedArticles` liefert bereits absteigend; damit stimmt auch die
  // Reihenfolge der Tage, weil eine Map ihre Einfügereihenfolge behält.
  return [...tage].map(([datum, artikel]) => ({ datum, artikel }))
}

/** Ein Monat im Archiv mit allen Artikeln, die in ihm erschienen sind. */
export interface Archivmonat {
  /** `JJJJ-MM`, zugleich der Pfadteil unter `/news/monat/`. */
  monat: string
  artikel: NewsArticle[]
}

/**
 * Alle Artikel nach Erscheinungsmonat gruppiert, jüngster Monat zuerst.
 *
 * Der Monat kommt wie der Tag aus `publishedAt` (die ersten sieben Zeichen),
 * nicht über `new Date` – dieselbe Verschiebungsfalle wie bei `tagVon`.
 *
 * Anders als das Tages-Archiv nimmt der Monat **alle** Artikel, auch die vom
 * jüngsten Tag: Eine Monatsseite ist keine Grenze zwischen aktuell und
 * Archiv, sondern ein Register – der laufende Monat ohne seine neuesten
 * Artikel wäre schlicht unvollständig.
 */
export async function getNewsByMonth(): Promise<Archivmonat[]> {
  const monate = new Map<string, NewsArticle[]>()

  for (const artikel of sortedArticles()) {
    const monat = artikel.publishedAt.slice(0, 7)
    const bisher = monate.get(monat)
    if (bisher) bisher.push(artikel)
    else monate.set(monat, [artikel])
  }

  // `sortedArticles` liefert absteigend; die Einfügereihenfolge der Map
  // ordnet damit auch die Monate vom jüngsten zum ältesten.
  return [...monate].map(([monat, artikel]) => ({ monat, artikel }))
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  return newsArticles.find((article) => article.slug === slug) ?? null
}

/** Für `generateStaticParams` und die Sitemap. */
export async function getNewsSlugs(): Promise<string[]> {
  return sortedArticles().map((article) => article.slug)
}

/**
 * Kurzfassungen für Karussell und Teaser-Listen.
 *
 * **Die zwei jüngsten Erscheinungstage**, jüngster zuerst – anders als die
 * Nachrichtenseite, und mit Absicht.
 *
 * Die Nachrichtenseite trennt scharf: aktuell ist der jüngste Tag, alles
 * Ältere liegt zugeklappt im Archiv. Für das Karussell der Startseite war
 * diese Schärfe zu viel des Guten: An einem Sonntag mit drei Meldungen
 * rotierte es dreimal, und die neun Meldungen vom Samstag – für jeden, der
 * am Wochenende vorbeischaut, noch vollkommen aktuell – waren von der
 * Startseite verschwunden. Seit August 2026 nimmt das Karussell deshalb
 * zwei Tage: erst alles von heute, dahinter der Vortag. Das Datum steht an
 * jeder Schlagzeile, es wird also nichts als heutig ausgegeben, was es
 * nicht ist.
 *
 * Für alle anderen Stellen gilt weiter die scharfe Regel aus
 * `getCurrentNews`; `limit` begrenzt nur, wie viele Schlagzeilen gezeigt
 * werden.
 */
export async function getNewsHeadlines(
  limit = CURRENT_NEWS_COUNT
): Promise<NewsHeadline[]> {
  const alle = sortedArticles()
  if (alle.length === 0) return []
  const tage = [...new Set(alle.map(tagVon))].slice(0, 2)
  return alle
    .filter((artikel) => tage.includes(tagVon(artikel)))
    .slice(0, limit)
    .map(toHeadline)
}

/** Vorhandene Kategorien in der Reihenfolge ihres ersten Auftretens. */
export async function getNewsCategories(): Promise<NewsCategory[]> {
  return [...new Set(sortedArticles().map((article) => article.category))]
}

/**
 * Passende weitere Artikel.
 *
 * Priorität haben Artikel derselben Kategorie; danach wird mit den aktuellsten
 * übrigen aufgefüllt, damit immer die gewünschte Anzahl zurückkommt.
 */
export async function getRelatedArticles(
  slug: string,
  limit = 3
): Promise<NewsArticle[]> {
  const current = await getNewsArticle(slug)
  if (!current) return []

  const others = sortedArticles().filter((article) => article.slug !== slug)
  const sameCategory = others.filter((article) => article.category === current.category)
  const rest = others.filter((article) => article.category !== current.category)

  return [...sameCategory, ...rest].slice(0, limit)
}

/**
 * Nachrichten, die einen bestimmten Kurs betreffen.
 *
 * Die Verbindung steht schon in den Daten: Jeder Artikel führt unter
 * `relatedSymbols` die Kurse, um die es geht. Bisher wurde sie nur in eine
 * Richtung gelesen – vom Artikel zum Kurs. Wer auf der Ölseite stand, erfuhr
 * nichts davon, dass es dazu am selben Tag eine Meldung gab.
 *
 * Die Rückrichtung braucht kein zweites Feld und keine Pflege: Dieselbe Liste,
 * andersherum gelesen. Ein neuer Artikel erscheint damit von selbst bei jedem
 * Kurs, den er nennt – und kann nicht mit einer zweiten Zuordnung auseinander-
 * laufen, die jemand zu aktualisieren vergisst.
 *
 * Zurück kommen Kurzfassungen, keine ganzen Artikel: Die Kursseite zeigt
 * Überschrift, Anriss und Datum, alles Weitere steht im Artikel selbst.
 */
export async function getNewsForSymbol(
  symbol: string,
  limit = 4
): Promise<NewsHeadline[]> {
  return sortedArticles()
    .filter((article) => article.relatedSymbols.includes(symbol))
    .slice(0, limit)
    .map(toHeadline)
}

/** Zeitpunkt der jüngsten Veröffentlichung – für `lastModified` in der Sitemap. */
export async function getLatestNewsDate(): Promise<string> {
  return sortedArticles()[0]?.publishedAt ?? new Date().toISOString()
}
