/**
 * Liest einen Podcast-Feed – die Auswertung, ohne den Abruf.
 *
 * ## Warum getrennt vom Abrufskript
 *
 * Weil sich das Zerlegen prüfen lässt und der Abruf nicht. RSS 2.0 mit der
 * iTunes-Erweiterung ist ein festes Format; ein Test mit einem echten
 * Feed-Ausschnitt sagt zuverlässig, ob dieses Modul es richtig liest. Ein Test,
 * der Spotify anfragt, sagte nur, ob Spotify gerade antwortet.
 *
 * ## Warum ein Feed und nicht die Spotify-Schnittstelle
 *
 * Die Web-API von Spotify verlangt eine Registrierung als Anwendung samt
 * Geheimnis und gibt Folgen nur nach OAuth heraus. Der RSS-Feed dagegen ist
 * das, was Spotify selbst einliest: Jeder Podcast hat einen, er liegt beim
 * Hoster, und er ist ohne Zugangsdaten lesbar. Wer den Podcast anderswohin
 * umzieht, behält ihn – die Spotify-Adresse wäre dann tot.
 *
 * ## Was hier bewusst nicht passiert
 *
 * Kein Umschreiben, kein Kürzen auf eine Wunschlänge, kein Erfinden fehlender
 * Beschreibungen. Was im Feed steht, steht auf der Seite; was fehlt, fehlt. Ein
 * Podcast-Text ist die Ankündigung des Autors, nicht Rohmaterial.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

export interface Folge {
  /** Adressteil, aus dem Titel gebildet. */
  slug: string
  titel: string
  /** Die Beschreibung als reiner Text, ohne Auszeichnung. */
  beschreibung: string
  /** Veröffentlichung als `JJJJ-MM-TT`. */
  datum: string
  /** Länge in Sekunden, oder `null`. */
  dauerSekunden: number | null
  /** Adresse der Folge beim Anbieter, oder `null`. */
  url: string | null
}

/**
 * Die benannten Entities, die in deutschsprachigen Feeds vorkommen.
 *
 * Nicht die vollständige HTML5-Liste – die hat über zweitausend Einträge, und
 * die restlichen zweitausend stehen in keinem Podcast-Text. Die Umlaute stehen
 * hier, weil sie der Regelfall sind: Viele Hoster kodieren jeden Nicht-ASCII-
 * Buchstaben, und ein „Finanzen verst&auml;ndlich“ auf der Seite wäre die
 * sichtbarste Art, das zu übersehen.
 */
const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  // Weiches Trennzeichen: unsichtbar, gehört restlos entfernt.
  shy: '',
  auml: 'ä',
  ouml: 'ö',
  uuml: 'ü',
  Auml: 'Ä',
  Ouml: 'Ö',
  Uuml: 'Ü',
  szlig: 'ß',
  agrave: 'à',
  aacute: 'á',
  egrave: 'è',
  eacute: 'é',
  ccedil: 'ç',
  ntilde: 'ñ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  laquo: '«',
  raquo: '»',
  bdquo: '„',
  ldquo: '“',
  rdquo: '”',
  sbquo: '‚',
  lsquo: '‘',
  rsquo: '’',
  euro: '€',
  copy: '©',
  reg: '®',
  trade: '™',
  deg: '°',
  middot: '·',
  bull: '•',
}

/**
 * Entfernt HTML und macht Entities lesbar.
 *
 * Die Entities werden in **einem** Durchgang aufgelöst und nicht in einer
 * Kette von Ersetzungen. Der Unterschied zeigt sich an `&amp;lt;`: Das ist die
 * korrekte Schreibweise für die Zeichenfolge `&lt;`. Wer erst `&amp;` und
 * danach `&lt;` ersetzt, macht daraus ein `<` – und damit aus einem Text über
 * HTML plötzlich HTML.
 */
/**
 * Entfernt die abschließende Hashtag-Zeile aus einer Folgenbeschreibung.
 *
 * Hashtags sind YouTube-Zubehör: Dort sind sie anklickbar und bringen
 * Reichweite. In einem Podcast-Abspieler steht dieselbe Zeile als toter
 * Text unter jeder Folge – und ist das Erste, was ein Hörer im
 * Beschreibungsfeld sieht, wenn er es aufklappt.
 *
 * Entfernt wird nur eine Zeile am **Ende**, die mit `#` beginnt. Ein
 * Doppelkreuz mitten im Text (etwa in einem Kurskürzel) bleibt stehen.
 */
export function ohneHashtags(text: string): string {
  return text.replace(/\n#\S[^\n]*\s*$/u, '').trim()
}

export function nurText(roh: string): string {
  return roh
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#\d+|#[xX][0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (ganz, name: string) => {
      if (name.startsWith('#')) {
        const nummer =
          name[1] === 'x' || name[1] === 'X'
            ? Number.parseInt(name.slice(2), 16)
            : Number.parseInt(name.slice(1), 10)
        /*
          Unbrauchbare Zahlen bleiben stehen, wie sie sind. `String.fromCodePoint`
          wirft bei allem außerhalb des gültigen Bereichs – ein einziges kaputtes
          Zeichen im Feed brächte damit den ganzen Abruf zu Fall.
        */
        if (!Number.isFinite(nummer) || nummer < 1 || nummer > 0x10ffff) return ganz
        return String.fromCodePoint(nummer)
      }
      return ENTITIES[name] ?? ganz
    })
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Macht aus einem Folgentitel einen Adressteil.
 *
 * Umlaute werden ausgeschrieben wie bei den Branchen – aus „Zinsen erklärt“
 * wird `zinsen-erklaert` und nicht `zinsen-erklrt`. Führende Folgennummern
 * bleiben erhalten: Sie unterscheiden zwei Folgen mit ähnlichem Titel.
 */
export function folgenSlug(titel: string): string {
  return titel
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
    .replace(/-$/, '')
}

/**
 * Liest eine Dauerangabe.
 *
 * iTunes erlaubt drei Schreibweisen: Sekunden (`1830`), Minuten und Sekunden
 * (`30:30`) sowie Stunden, Minuten, Sekunden (`1:30:30`). Alle drei kommen in
 * echten Feeds vor, und wer nur eine liest, zeigt bei den anderen nichts an
 * oder – schlimmer – eine falsche Zahl.
 */
export function leseDauer(roh: string | undefined): number | null {
  if (!roh) return null
  const text = roh.trim()
  if (!text) return null

  const teile = text.split(':').map((teil) => Number(teil))
  if (teile.some((teil) => !Number.isFinite(teil) || teil < 0)) return null

  if (teile.length === 1) return teile[0] > 0 ? teile[0] : null
  if (teile.length === 2) return teile[0] * 60 + teile[1]
  if (teile.length === 3) return teile[0] * 3600 + teile[1] * 60 + teile[2]
  return null
}

/** Wandelt ein RFC-822-Datum in `JJJJ-MM-TT`. */
export function leseDatum(roh: string | undefined): string | null {
  if (!roh) return null
  const zeit = Date.parse(roh.trim())
  if (!Number.isFinite(zeit)) return null
  return new Date(zeit).toISOString().slice(0, 10)
}

/** Holt den Inhalt des ersten Elements dieses Namens. */
function feld(block: string, name: string): string | undefined {
  const treffer = block.match(
    new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i')
  )
  return treffer?.[1]
}

/**
 * Zerlegt einen Feed in Folgen, jüngste zuerst.
 *
 * Folgen ohne Titel fallen heraus: Ein Eintrag ohne Titel hat keinen Slug und
 * damit keine Adresse. Doppelte Slugs bekommen einen Zusatz – zwei Folgen mit
 * demselben Titel gibt es, und die zweite darf die erste nicht überschreiben.
 */
export function leseFeed(xml: string): Folge[] {
  const folgen: Folge[] = []
  const vergeben = new Set<string>()

  for (const treffer of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    const block = treffer[1]
    const titel = nurText(feld(block, 'title') ?? '')
    if (!titel) continue

    let slug = folgenSlug(titel)
    if (!slug) continue
    if (vergeben.has(slug)) {
      let zaehler = 2
      while (vergeben.has(`${slug}-${zaehler}`)) zaehler += 1
      slug = `${slug}-${zaehler}`
    }
    vergeben.add(slug)

    /*
      Die Beschreibung steht je nach Hoster in `description`, in
      `itunes:summary` oder in `content:encoded`. Genommen wird die erste, die
      etwas enthält – und nicht die längste: Wer nach Länge aussucht, landet
      regelmäßig beim Block mit den Werbehinweisen.
    */
    const beschreibung = nurText(
      feld(block, 'description') ??
        feld(block, 'itunes:summary') ??
        feld(block, 'content:encoded') ??
        ''
    )

    /*
      Die Adresse der Folge: `link` ist die Seite beim Anbieter. `enclosure`
      wäre die Audiodatei selbst – die gehört hier nicht hin, denn dieser
      Verweis soll zum Podcast führen und keine Datei herunterladen.
    */
    const url = nurText(feld(block, 'link') ?? '') || null

    folgen.push({
      slug,
      titel,
      beschreibung,
      datum: leseDatum(feld(block, 'pubDate')) ?? '',
      dauerSekunden: leseDauer(nurText(feld(block, 'itunes:duration') ?? '')),
      url,
    })
  }

  /*
    Nach Datum absteigend, bei gleichem Datum nach der Reihenfolge im Feed.
    Ein Feed ist üblicherweise schon so sortiert; verlassen sollte man sich
    darauf nicht.
  */
  return folgen
    .map((folge, index) => ({ folge, index }))
    .sort((a, b) => b.folge.datum.localeCompare(a.folge.datum) || a.index - b.index)
    .map((eintrag) => eintrag.folge)
}

/** Eine Dauer als „34 Min.“ oder „1 Std. 12 Min.“. */
export function dauerText(sekunden: number | null): string | null {
  if (sekunden === null || sekunden <= 0) return null
  const minuten = Math.round(sekunden / 60)
  if (minuten < 60) return `${minuten} Min.`
  return `${Math.floor(minuten / 60)} Std. ${minuten % 60} Min.`
}
