import type { SeriesPoint } from '@/data/markets'

/**
 * „Heute vor X Jahren“ – der auffälligste Handelstag zum heutigen Kalendertag.
 *
 * ## Warum es das gibt
 *
 * Die Kursreihen über fünf Jahre liegen ohnehin im Repository. In ihnen
 * stecken die Tage, an denen Anleger etwas fürs Leben gelernt haben – nur
 * findet sie niemand, weil niemand rückwärts blättert. Diese Auswertung holt
 * zum heutigen Kalendertag den auffälligsten davon nach vorn: „Heute vor drei
 * Jahren fiel der DAX um 4,3 Prozent.“
 *
 * Der Lehrwinkel ist immer derselbe und steht deshalb gleich mit im Ergebnis:
 * Extreme Tage ballen sich, kommen unangekündigt und sind der Grund, warum
 * Markttiming an Einzeltagen scheitert. Eine Kachel, die das an einem echten
 * Datum zeigt, sagt mehr als der Merksatz allein.
 *
 * ## Wie gerechnet wird
 *
 * Für jedes übergebene Instrument und jedes Jahr im Bestand wird der
 * Handelstag gesucht, der dem Jahrestag des Stichtags am nächsten liegt –
 * höchstens drei Kalendertage entfernt, sonst zählt das Jahr nicht (der
 * Jahrestag fiel dann in eine längere Handelspause). Dessen Veränderung zum
 * Vortag ist der Messwert. Es gewinnt der größte Ausschlag, egal in welche
 * Richtung; bei Gleichstand der ältere, weil „vor vier Jahren“ mehr erzählt
 * als „vor einem“.
 *
 * Rein und ohne Datumsspielereien: Der Stichtag kommt als `JJJJ-MM-TT` von
 * außen, verglichen wird über Zeichenketten und Kalendertage – kein `new
 * Date`-Umweg, der nach UTC verschiebt.
 */

export interface Geschichtsfund {
  /** Symbol des Instruments, z. B. `dax`. */
  symbol: string
  /** Anzeigename, z. B. `DAX`. */
  name: string
  /** Der gefundene Handelstag, `JJJJ-MM-TT`. */
  datum: string
  /** Wie viele Jahre der Tag zurückliegt, mindestens 1. */
  jahre: number
  /** Veränderung zum vorigen Punkt der Reihe, auf eine Nachkommastelle. */
  prozent: number
  /**
   * Kalendertage zwischen dem vorigen Punkt und diesem – die Zeit, über die
   * die Veränderung tatsächlich entstanden ist.
   *
   * Ohne diese Zahl lässt sich der Satz nicht ehrlich bilden; siehe
   * `TAGESSPANNE_MAX`.
   */
  spanneTage: number
  /**
   * Kalendertage zwischen dem exakten Jahrestag und dem gefundenen Tag.
   *
   * Null heißt: Es ist wirklich „heute vor X Jahren“. Sonst liegt der Tag
   * daneben, und die Kachel darf nicht „heute“ behaupten.
   */
  abstandTage: number
}

/** Eine Reihe samt Namen, wie die Startseite sie übergibt. */
export interface Geschichtsquelle {
  symbol: string
  name: string
  punkte: readonly SeriesPoint[]
}

/** Höchstabstand zwischen Jahrestag und nächstem Handelstag, in Tagen. */
const HOECHSTABSTAND_TAGE = 3

/**
 * Bis zu wie vielen Kalendertagen Abstand zwei Punkte als **aufeinander
 * folgende Handelstage** gelten.
 *
 * Drei deckt Freitag → Montag ab, vier zusätzlich einen Feiertagsmontag.
 *
 * ## Warum diese Grenze gebraucht wird
 *
 * Am 9. August 2026 gemeldet: Die Kachel behauptete einen Kurssturz „an einem
 * einzigen Handelstag“, der in Wahrheit eine Woche umfasste. Der Grund liegt
 * im Bestand, nicht in der Rechnung: Die Fünfjahresreihen sind **nicht
 * gleichmäßig dicht**. Nachgezählt über die acht Leitwerte der Startseite:
 *
 *     Lücke 1–3 Tage   2.271 Paare   jüngerer Teil, echte Handelstage
 *     Lücke 7 Tage     1.372 Paare   älterer Teil, nur Wochenwerte
 *
 * Wer zwei Jahre zurückblickt, landet im wöchentlichen Teil. „Der Punkt
 * davor“ liegt dann sieben Tage zurück, und aus einer Wochenbewegung wird im
 * Satz eine Tagesbewegung. Beim Nikkei am 5. August 2024 wurden so aus real
 * −12,4 Prozent an jenem Tag die −18,2 Prozent der Woche davor.
 *
 * Der vorhandene `HOECHSTABSTAND_TAGE` half dagegen nicht: Er bewacht den
 * Abstand zum **Jahrestag**, nicht den zum Vorpunkt. Der Test von damals
 * nannte die Gefahr sogar beim Namen („sonst würde ein Wochenschluss als
 * Tagesbewegung ausgegeben“) und maß trotzdem die falsche Strecke.
 */
const TAGESSPANNE_MAX = 4

/** Die ersten zehn Zeichen: der Kalendertag, ohne Umweg über `new Date`. */
function tagVon(zeitpunkt: string): string {
  return zeitpunkt.slice(0, 10)
}

/** Kalendertag-Abstand zweier ISO-Daten in ganzen Tagen (UTC, rein rechnerisch). */
function tageAbstand(a: string, b: string): number {
  const ms = Math.abs(Date.parse(`${a}T00:00:00Z`) - Date.parse(`${b}T00:00:00Z`))
  return Math.round(ms / 86_400_000)
}

/** Ob der Fund ein echter Tagesausschlag ist und keine Wochenbewegung. */
function istTagesausschlag(fund: Geschichtsfund): boolean {
  return fund.spanneTage <= TAGESSPANNE_MAX
}

/** Ob `a` die bessere Geschichte erzählt als `b`. */
function besser(a: Geschichtsfund, b: Geschichtsfund): boolean {
  const tagA = istTagesausschlag(a)
  const tagB = istTagesausschlag(b)
  if (tagA !== tagB) return tagA
  if (Math.abs(a.prozent) !== Math.abs(b.prozent)) {
    return Math.abs(a.prozent) > Math.abs(b.prozent)
  }
  return a.jahre > b.jahre
}

/** Der Jahrestag des Stichtags vor `jahre` Jahren; 29. Februar wird zum 28. */
function jahrestag(stichtag: string, jahre: number): string {
  const jahr = Number(stichtag.slice(0, 4)) - jahre
  const monatTag = stichtag.slice(5) === '02-29' ? '02-28' : stichtag.slice(5)
  return `${jahr}-${monatTag}`
}

/**
 * Sucht den auffälligsten Jahrestags-Handelstag über alle Quellen.
 *
 * @param quellen   Reihen mit mindestens zwei Punkten; kürzere werden übergangen.
 * @param stichtag  Heutiges Datum als `JJJJ-MM-TT` – kommt von außen, damit
 *                  die Funktion rein bleibt und testbar ist.
 */
export function findeGeschichte(
  quellen: readonly Geschichtsquelle[],
  stichtag: string
): Geschichtsfund | null {
  let bester: Geschichtsfund | null = null

  for (const quelle of quellen) {
    if (quelle.punkte.length < 2) continue

    for (let jahre = 1; jahre <= 6; jahre++) {
      const ziel = jahrestag(stichtag, jahre)

      /* Den Handelstag mit dem kleinsten Abstand zum Jahrestag suchen. Die
         Reihen sind aufsteigend sortiert; eine lineare Suche über ein paar
         tausend Punkte ist beim Bau einmalig und billig. */
      let index = -1
      let abstand = Number.POSITIVE_INFINITY
      for (let i = 1; i < quelle.punkte.length; i++) {
        const tag = tagVon(quelle.punkte[i].t)
        const d = tageAbstand(tag, ziel)
        if (d < abstand) {
          abstand = d
          index = i
        }
      }
      if (index < 1 || abstand > HOECHSTABSTAND_TAGE) continue

      const heute = quelle.punkte[index]
      const gestern = quelle.punkte[index - 1]
      if (
        !Number.isFinite(heute.value) ||
        !Number.isFinite(gestern.value) ||
        gestern.value === 0
      )
        continue

      const prozent =
        Math.round(((heute.value - gestern.value) / gestern.value) * 1000) / 10
      if (prozent === 0) continue

      const fund: Geschichtsfund = {
        symbol: quelle.symbol,
        name: quelle.name,
        datum: tagVon(heute.t),
        jahre,
        prozent,
        spanneTage: tageAbstand(tagVon(gestern.t), tagVon(heute.t)),
        abstandTage: abstand,
      }

      /*
        Ein echter Tagesausschlag schlägt jede Wochenbewegung, auch eine
        größere. Das ist der Lehrwinkel dieser Kachel: dass **einzelne Tage**
        unangekündigt kommen. Eine Woche mit −19 Prozent erzählt das nicht
        besser als ein Tag mit −7, sie klingt nur lauter.

        Erst innerhalb derselben Klasse zählt der Betrag, dann das ältere Jahr.
      */
      if (bester === null || besser(fund, bester)) bester = fund
    }
  }

  return bester
}

/**
 * Der Satz zur Kachel – eine Stelle, damit Seite und Test dasselbe sagen.
 *
 * Der Zeitraum wird **aus den Daten** benannt und nicht behauptet. Liegt
 * zwischen den beiden Punkten mehr als ein Handelstag, steht das im Satz;
 * sonst hieße es „an einem einzigen Handelstag“ über einer Wochenbewegung.
 *
 * Den Vorspann „Heute vor X Jahren“ trägt die Kachel selbst, damit er dort
 * abgeschwächt werden kann, wo der Tag neben dem Jahrestag liegt.
 */
export function geschichtssatz(fund: Geschichtsfund): string {
  const richtung = fund.prozent > 0 ? 'stieg' : 'fiel'
  const betrag = Math.abs(fund.prozent).toLocaleString('de-DE', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  const zeitraum = istTagesausschlag(fund)
    ? 'an einem einzigen Handelstag'
    : fund.spanneTage <= 10
      ? 'binnen einer Woche'
      : `binnen ${fund.spanneTage} Tagen`
  return `${fund.name} ${richtung} ${zeitraum} um ${betrag} Prozent.`
}

/**
 * Der Vorspann der Kachel.
 *
 * „Heute“ nur, wenn der gefundene Tag wirklich der Jahrestag ist. Sonst liegt
 * er bis zu drei Tage daneben, und die Kachel behauptete einen Kalendertag,
 * den sie nicht zeigt – gemeldet am 9. August 2026: Überschrift „Heute vor 2
 * Jahren“, darunter ein Ereignis vom 5. August.
 */
export function geschichtsvorspann(fund: Geschichtsfund): string {
  const wann = fund.jahre === 1 ? 'einem Jahr' : `${fund.jahre} Jahren`
  return fund.abstandTage === 0 ? `Heute vor ${wann}` : `Vor ${wann}`
}
