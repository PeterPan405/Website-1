/**
 * Das Karussell zeigt kein Thema zweimal – auch nicht über zwei Tage.
 *
 * Ausführen mit `npm test`. Geprüft wird `schonHeute` in `lib/news.ts`.
 *
 * Der Anlass, 14. Oktober 2026: Der Betreiber schickte drei Bildschirmfotos
 * – Öl heute, Gold/Silber heute, und dazwischen der Sammelartikel von
 * gestern „Öl steigt auf 106 Dollar, Gold und Silber geben nach". Dazu:
 * „das ist doppelt".
 */
import { newsArticles } from '@/data/news'
import { getNewsHeadlines, schonHeute } from '@/lib/news'

let failed = 0
function pruefe(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) console.log(`OK   ${was}`)
  else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const tag = (a: { publishedAt: string }) => a.publishedAt.slice(0, 10)
const am = (t: string) => newsArticles.filter((a) => tag(a) === t)
const titel = (t: string) => newsArticles.find((a) => a.title === t)!

const heute = am('2026-10-14')
pruefe(
  'der Sammelartikel vom 13. fällt neben Gold/Silber vom 14. heraus',
  schonHeute(titel('Öl steigt auf 106 Dollar, Gold und Silber geben nach'), heute)
)
for (const t of [
  'Drei Notenbanker sprechen am Dienstag, deutsche Inflation im Fokus',
  'US-Midterms: BofA sieht für Aktien ein Entweder-oder',
  'Dow im Plus, Technologiewerte unter Druck vor der Berichtssaison',
])
  pruefe(
    `ein anderes Thema vom 13. bleibt: ${t.slice(0, 45)}`,
    !schonHeute(titel(t), heute)
  )

/*
  Am ganzen Bestand bis zum 14. Oktober: genau die acht Vortagsartikel, die
  auch der Riegel als Wiederholung findet – und keiner mehr. Neue Tage
  ändern daran nichts, gezählt wird nur bis dahin.
*/
const tage = [...new Set(newsArticles.map(tag))]
  .filter((t) => t <= '2026-10-14')
  .sort()
  .reverse()
let ausgeblendet = 0
for (let i = 0; i + 1 < tage.length; i++)
  for (const a of am(tage[i + 1])) if (schonHeute(a, am(tage[i]))) ausgeblendet++
pruefe(
  'über alle Tage bis zum 14. Oktober: 8 ausgeblendet',
  ausgeblendet === 8,
  `${ausgeblendet}`
)

/*
  Und das Karussell benutzt es: Kein Vortagsartikel darin, dessen Thema heute
  schon steht – geprüft am echten Karussell, nicht an der Hilfsfunktion.
*/
{
  const karussell = await getNewsHeadlines(50)
  const slugs = new Set(karussell.map((h) => (h as { slug: string }).slug))
  const gezeigt = newsArticles.filter((a) => slugs.has(a.slug))
  const jüngster = [...new Set(gezeigt.map(tag))].sort().reverse()[0]
  const neu = gezeigt.filter((a) => tag(a) === jüngster)
  const doppelt = gezeigt.filter((a) => tag(a) !== jüngster && schonHeute(a, neu))
  pruefe(
    'das Karussell zeigt kein Thema vom Vortag, das heute schon steht',
    doppelt.length === 0,
    doppelt.map((a) => a.title).join(' | ')
  )
}

/* Gegenprobe: Ohne Artikel von heute wird nichts ausgeblendet. */
pruefe(
  'ohne heutige Artikel bleibt alles',
  !schonHeute(titel('Öl steigt auf 106 Dollar, Gold und Silber geben nach'), [])
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
