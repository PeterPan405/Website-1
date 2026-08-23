import type { MetadataRoute } from 'next'

import { getAlleLektionen, getBereiche } from '@/lib/akademie'
import { calculators } from '@/data/calculators'
import { PHILOSOPHY_PUBLISHED } from '@/data/philosophy'

import { getLearnLevelParams, getLearnTopicSlugs } from '@/lib/learn'
import { getBranchen } from '@/lib/branchen'
import { getLernpfadSlugs } from '@/lib/lernpfade'
import { themenMitKarten } from '@/lib/lernkarten-daten'
import { getEditionDates } from '@/lib/editions'
import { getRueckblickJahre } from '@/lib/jahresrueckblick-daten'
import { getInstrumentSymbols } from '@/lib/markets'
import { getLatestNewsDate, getNewsArticles, getNewsByMonth } from '@/lib/news'
import { straenge } from '@/lib/nachrichtenstrang'
import { getFolgen } from '@/lib/podcast'
import { rubriken } from '@/lib/rubriken'
import { absoluteUrl } from '@/lib/site'

/**
 * sitemap.xml – wird von Next.js aus dieser Datei generiert.
 *
 * Enthält alle Unterseiten inklusive der dynamischen Routen: News-Artikel,
 * Marktseiten, Lernthemen und jede der drei Lernstufen pro Thema. Die Liste
 * wird aus derselben Service-Schicht gespeist wie die Seiten selbst – dadurch
 * kann keine neue Seite versehentlich in der Sitemap fehlen.
 *
 * Die Datei entsteht beim Build und wird als statische Datei ausgeliefert, nicht
 * pro Anfrage erzeugt – Voraussetzung für den statischen Export.
 */
export const dynamic = 'force-static'

/** Bezugszeitpunkt für Seiten ohne eigenes Änderungsdatum. */
const buildDate = new Date()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    newsArticles,
    latestNewsDate,
    symbols,
    topicSlugs,
    levelParams,
    editionDates,
    pfadSlugs,
    rueckblickJahre,
    archivMonate,
  ] = await Promise.all([
    getNewsArticles(),
    getLatestNewsDate(),
    getInstrumentSymbols(),
    getLearnTopicSlugs(),
    getLearnLevelParams(),
    getEditionDates(),
    getLernpfadSlugs(),
    getRueckblickJahre(),
    getNewsByMonth(),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/lernen'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/lernen/zeit'), changeFrequency: 'weekly', priority: 0.7 },
    // Das Schaufenster aller Erklärgrafiken.
    { url: absoluteUrl('/lernen/grafiken'), changeFrequency: 'monthly', priority: 0.6 },
    /*
      Lernstand und Wiederholung ändern sich als Seite selten – was sich ändert,
      steht im Browser des Besuchers und nicht in der ausgelieferten Datei.
    */
    { url: absoluteUrl('/lernen/stand'), changeFrequency: 'monthly', priority: 0.7 },
    {
      url: absoluteUrl('/lernen/wiederholen'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: absoluteUrl('/rechner'), changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/maerkte'), changeFrequency: 'hourly', priority: 0.8 },
    {
      url: absoluteUrl('/news'),
      lastModified: new Date(latestNewsDate),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      // Die Korrektursammlung – sie steht auch dann, wenn sie leer ist.
      url: absoluteUrl('/news/korrekturen'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      // Das Archiv wächst mit jeder Ausgabe – der jüngste Tag ist der Änderungsstand.
      url: absoluteUrl('/news/tag'),
      lastModified: editionDates[0] ? new Date(editionDates[0]) : buildDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      /*
        Der Jahresrückblick. Der laufende Jahrgang ändert sich mit jedem
        Kursabruf, die abgeschlossenen nicht mehr – die Übersicht erbt deshalb
        die häufigere Frequenz und die Jahrgangsseiten unten die seltenere.
      */
      url: absoluteUrl('/news/jahr'),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/globus'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      // Termine laufen ab und kommen dazu – häufiger als die Länderdaten.
      url: absoluteUrl('/kalender'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/staatsverschuldung'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: absoluteUrl('/anleihen'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      /*
        Der Podcast steht auf einer Seite, mit einer Sprungmarke je Folge –
        nicht als eine Seite je Folge. Der Grund steht in `lib/podcast.ts`.
        Ihr Änderungsstand ist deshalb das Datum der jüngsten Folge.
      */
      url: absoluteUrl('/podcast'),
      lastModified: getFolgen()[0]?.datum ? new Date(getFolgen()[0].datum) : buildDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    { url: absoluteUrl('/ueber-uns'), changeFrequency: 'yearly', priority: 0.4 },
    // Die Philosophie-Seite erscheint erst in der Sitemap, wenn ihr Text steht –
    // sonst würde eine noindex-Seite zur Indexierung angemeldet.
    ...(PHILOSOPHY_PUBLISHED
      ? ([
          {
            url: absoluteUrl('/unternehmensphilosophie'),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
          },
        ] satisfies MetadataRoute.Sitemap)
      : []),
    { url: absoluteUrl('/kontakt'), changeFrequency: 'yearly', priority: 0.4 },
    { url: absoluteUrl('/glossar'), changeFrequency: 'monthly', priority: 0.7 },
    // Der Karteikasten zum Glossar – eine eigene Seite, also ein eigener
    // Eintrag. Er fehlte bis zum 3. August 2026 und fiel erst der
    // Paketprüfung auf, nicht dem Auge.
    {
      url: absoluteUrl('/glossar/karteikarten'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    { url: absoluteUrl('/quellen'), changeFrequency: 'monthly', priority: 0.3 },
    { url: absoluteUrl('/impressum'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/datenschutz'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/umzug'), changeFrequency: 'yearly', priority: 0.3 },
    {
      url: absoluteUrl('/keine-cookies'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: absoluteUrl('/barrierefreiheit'),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  /*
    Die Nachrichtenstränge – je Wert und je Thema eine Seite.

    Sie entstehen aus denselben Artikeln und wachsen mit ihnen. Welche es
    gibt, entscheidet die Mindestzahl in `lib/nachrichtenstrang.ts`; hier wird
    nur gelesen, was dort herauskommt. Eine abgetippte Liste wäre nach dem
    nächsten Artikel unvollständig.
  */
  const strangPages: MetadataRoute.Sitemap = [
    ...straenge(newsArticles, 'symbol').map((strang) => ({
      url: absoluteUrl(`/news/strang/wert/${strang.schluessel}`),
      lastModified: new Date(strang.bis),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...straenge(newsArticles, 'thema').map((strang) => ({
      url: absoluteUrl(`/news/strang/thema/${strang.schluessel}`),
      lastModified: new Date(strang.bis),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ]

  const newsPages: MetadataRoute.Sitemap = newsArticles.map((article) => ({
    url: absoluteUrl(`/news/${article.slug}`),
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  /*
    Die Rubriken. Fünf Seiten, aus derselben Liste wie die Seiten selbst –
    eine hier abgetippte Aufzählung wäre nach der ersten neuen Rubrik falsch.
  */
  const rubrikPages: MetadataRoute.Sitemap = rubriken.map((rubrik) => ({
    url: absoluteUrl(`/news/rubrik/${rubrik.slug}`),
    lastModified: new Date(latestNewsDate),
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  /*
    Die Monatsseiten. Der jüngste Monat wächst noch täglich, die
    abgeschlossenen ändern sich nie wieder – die Frequenz unterscheidet das.
  */
  const monatsPages: MetadataRoute.Sitemap = [
    {
      // Der Wochenrückblick rechnet bei jedem Bau die letzte volle Woche.
      url: absoluteUrl('/news/woche'),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: absoluteUrl('/news/monat'),
      lastModified: new Date(latestNewsDate),
      changeFrequency: 'daily',
      priority: 0.5,
    },
    ...archivMonate.map(({ monat }, index) => ({
      url: absoluteUrl(`/news/monat/${monat}`),
      changeFrequency: (index === 0 ? 'daily' : 'never') as 'daily' | 'never',
      priority: 0.5,
    })),
  ]

  const editionPages: MetadataRoute.Sitemap = editionDates.map((date) => ({
    url: absoluteUrl(`/news/tag/${date}`),
    lastModified: new Date(date),
    // Eine erschienene Ausgabe wird nicht mehr geändert.
    changeFrequency: 'never',
    priority: 0.6,
  }))

  const jahrgangsPages: MetadataRoute.Sitemap = rueckblickJahre.map((jahr) => ({
    url: absoluteUrl(`/news/jahr/${jahr}`),
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const marketPages: MetadataRoute.Sitemap = symbols.map((symbol) => ({
    url: absoluteUrl(`/maerkte/${symbol}`),
    changeFrequency: 'hourly',
    priority: 0.6,
  }))

  /*
    Die Branchenseiten ändern sich mit jedem Kursabruf – die Reihenfolge der
    Titel hängt an der Tagesveränderung. Der Bestand an Titeln dagegen ändert
    sich selten, deshalb `daily` und nicht `hourly`: Für eine Suchmaschine ist
    das die ehrlichere Angabe.
  */
  const branchenPages: MetadataRoute.Sitemap = [
    // Das Tagesbild rechnet sich mit jedem Kursabruf neu.
    { url: absoluteUrl('/maerkte/tagesbild'), changeFrequency: 'hourly', priority: 0.7 },
    {
      url: absoluteUrl('/maerkte/zusammenhang'),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    /*
      Monatsbefunde ändern sich erst, wenn ein Monat zu Ende ist – häufiger als
      monatlich hat die Seite nichts Neues zu sagen.
    */
    {
      url: absoluteUrl('/maerkte/saisonalitaet'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    { url: absoluteUrl('/maerkte/branchen'), changeFrequency: 'weekly', priority: 0.7 },
    // Der Vergleich rechnet mit denselben Kursen und ändert sich mit ihnen.
    { url: absoluteUrl('/maerkte/vergleich'), changeFrequency: 'daily', priority: 0.7 },
    /*
      Die Dividendenrendite ist ein Bruch mit dem Kurs im Nenner – sie ändert
      sich mit jedem Abruf, auch wenn keine Ausschüttung dazukam.
    */
    { url: absoluteUrl('/maerkte/dividenden'), changeFrequency: 'daily', priority: 0.7 },
    /*
      Der Abstand zum Jahreshoch hat den Kurs im Zähler – er ändert sich mit
      jedem Abruf, auch wenn Hoch und Tief seit Wochen stehen.
    */
    { url: absoluteUrl('/maerkte/52-wochen'), changeFrequency: 'daily', priority: 0.7 },
    /*
      Die Währungsaufteilung folgt dem Factsheet des Indexanbieters und wechselt
      einmal im Monat – seltener als alles andere unter /maerkte.
    */
    {
      url: absoluteUrl('/maerkte/waehrungen-im-weltindex'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    /*
      Das Klumpenrisiko liest dasselbe Factsheet – dieselbe Frequenz. Beide
      Seiten wechseln zusammen oder gar nicht.
    */
    {
      url: absoluteUrl('/maerkte/klumpenrisiko'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    /*
      Der Screener zeigt Kurse und Bilanzzahlen. Die Kurse wechseln täglich,
      die Bilanzzahlen quartalsweise – die Seite folgt der schnelleren.
    */
    { url: absoluteUrl('/maerkte/screener'), changeFrequency: 'daily', priority: 0.7 },
    /*
      Die handelsfreien Tage entstehen aus den Kursreihen und wandern deshalb
      mit jedem Abruf um einen Tag weiter – aber die Aussage ändert sich nur,
      wenn ein Feiertag hinzukommt.
    */
    {
      url: absoluteUrl('/maerkte/handelsfreie-tage'),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    /*
      Die Methodenseite ändert sich nur, wenn sich eine Rechnung ändert – also
      selten. Die Beispiele darauf werden zwar bei jedem Bau neu gerechnet,
      liefern aber dasselbe Ergebnis, solange die Formel steht.
    */
    { url: absoluteUrl('/methoden'), changeFrequency: 'monthly', priority: 0.6 },
    /*
      Das Änderungsprotokoll wächst mit jedem sichtbaren Umbau – seltener als
      die Nachrichten, häufiger als die Methoden.
    */
    { url: absoluteUrl('/aenderungen'), changeFrequency: 'weekly', priority: 0.4 },
    /*
      Die Zahlenseite ändert sich mit jedem Bau – jeder neue Artikel und jede
      neue Podcastfolge verschiebt eine Zahl darauf.
    */
    { url: absoluteUrl('/zahlen'), changeFrequency: 'daily', priority: 0.4 },
    /*
      Die Verwechslungspaare stehen fest – sie ändern sich, wenn ein Paar
      dazukommt, und das ist ein seltener Anlass.
    */
    { url: absoluteUrl('/verwechslungen'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/irrtuemer'), changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/zeitstrahl'), changeFrequency: 'monthly', priority: 0.6 },
    ...getBranchen().map((branche) => ({
      url: absoluteUrl(`/maerkte/branchen/${branche.slug}`),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    })),
  ]

  /*
    Die beiden Stimmungsseiten stehen fest und nicht in `symbols`.

    Sie hängen nicht an einem Instrument, sondern an einem Marktbereich –
    deshalb kommen sie nicht aus derselben Liste. Vergessen worden wären sie
    beinahe; gefunden hat es die Paketprüfung, die jede erreichbare Seite gegen
    die Sitemap hält.
  */
  const stimmungsPages: MetadataRoute.Sitemap = ['aktien', 'krypto'].map((bereich) => ({
    url: absoluteUrl(`/maerkte/stimmung/${bereich}`),
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  /*
    Die Rechner kommen aus ihrer eigenen Liste.

    Hier standen sie zweimal – einmal in `data/calculators.ts` und einmal
    abgetippt an dieser Stelle. Der sechste Rechner hat die Doppelung sofort
    auffliegen lassen: Er war gebaut, verlinkt und gebaut worden, stand aber
    nicht in der Sitemap. Gemerkt hat es die Paketprüfung, nicht der Mensch.
  */
  const calculatorPages: MetadataRoute.Sitemap = calculators.map((rechner) => ({
    url: absoluteUrl(`/rechner/${rechner.slug}`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const topicPages: MetadataRoute.Sitemap = topicSlugs.map((slug) => ({
    url: absoluteUrl(`/lernen/${slug}`),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const levelPages: MetadataRoute.Sitemap = levelParams.map(({ thema, stufe }) => ({
    url: absoluteUrl(`/lernen/${thema}/${stufe}`),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  /*
    Die Kartenbögen – je Thema einer, aber nur wo es Karten gibt.

    Abgeleitet aus derselben Funktion, die `generateStaticParams` benutzt.
    Eine eigene Liste hier wäre die zweite Wahrheit, und sie fiele erst der
    Paketprüfung auf: eine gebaute Seite ohne Sitemap-Eintrag oder ein
    Sitemap-Eintrag ohne Seite.
  */
  const kartenPages: MetadataRoute.Sitemap = themenMitKarten(topicSlugs).map((slug) => ({
    url: absoluteUrl(`/lernen/${slug}/karten`),
    changeFrequency: 'monthly',
    priority: 0.4,
  }))

  /*
    Die Akademie: Übersicht, zwei Bereiche, alle Lektionen.

    Abgeleitet und nicht abgetippt – aus demselben Grund wie bei den Rechnern
    einen Absatz weiter oben. Dort stand die Liste einmal von Hand da, und der
    sechste Rechner fehlte still in der Sitemap.
  */
  const akademiePages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/akademie'), changeFrequency: 'monthly', priority: 0.8 },
    {
      url: absoluteUrl('/akademie/drei-wochen'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...getBereiche().map((bereich) => ({
      url: absoluteUrl(`/akademie/${bereich.id}`),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...getAlleLektionen().map((lektion) => ({
      url: absoluteUrl(`/akademie/${lektion.bereich}/${lektion.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  const pfadPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/lernen/pfade'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/lernen/30-tage'), changeFrequency: 'monthly', priority: 0.7 },
    ...pfadSlugs.map((slug) => ({
      url: absoluteUrl(`/lernen/pfade/${slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [
    ...staticPages,
    ...akademiePages,
    ...pfadPages,
    ...topicPages,
    ...levelPages,
    ...kartenPages,
    ...calculatorPages,
    ...marketPages,
    ...branchenPages,
    ...stimmungsPages,
    ...newsPages,
    ...strangPages,
    ...rubrikPages,
    ...monatsPages,
    ...editionPages,
    ...jahrgangsPages,
  ].map((entry) => ({ lastModified: buildDate, ...entry }))
}
