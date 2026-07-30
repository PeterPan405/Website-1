import { formatDate, formatDateTime } from '@/lib/format'
import type { MarketQuote } from '@/lib/markets'

/**
 * Woher ein Kurs stammt und wie alt er ist.
 *
 * Steht an jedem einzelnen Wert und nicht mehr pauschal über der Seite: Seit
 * die Devisen, Indizes und Edelmetalle aus echten Quellen kommen und nur noch
 * `msci-world` erzeugt wird, wäre eine Angabe für die ganze Seite entweder
 * falsch oder nichtssagend.
 *
 * Die Datumsangabe ist Pflicht, nicht Zierde. Die Website wird statisch gebaut;
 * zwischen zwei Bauläufen steht hier zwangsläufig der Kurs des letzten
 * Handelstags. Eine Zahl ohne ihr Datum wäre in dieser Lage eine Behauptung
 * über heute, die niemand geprüft hat.
 */
export function SourceNote({
  quote,
  className,
}: {
  quote: MarketQuote
  className?: string
}) {
  const klasse = className ?? 'text-fg-subtle text-xs'

  if (!quote.source) {
    return (
      <p className={klasse}>
        Demo-Kurs, rechnerisch erzeugt – keine echten Marktdaten. Stand des
        Beispieldatensatzes: {formatDateTime(quote.asOf)}.
      </p>
    )
  }

  return (
    <p className={klasse}>
      {quote.intraday
        ? `Stand ${formatDateTime(quote.asOf)}`
        : `Schlusskurs vom ${formatDate(quote.asOf)}`}{' '}
      · Quelle:{' '}
      <a
        href={quote.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-fg underline underline-offset-2"
      >
        {quote.source.label}
      </a>
    </p>
  )
}

/** Ab wie vielen Kürzeln gezählt statt aufgezählt wird. */
const HOECHSTENS_AUFZAEHLEN = 6

/**
 * Kürzel aufzählen – oder zählen, wenn es zu viele werden.
 *
 * Solange es eine Handvoll war, war die Aufzählung die bessere Auskunft: Man
 * sah sofort, welcher Kurs betroffen ist. Mit über vierhundert neu
 * aufgenommenen Aktien wurde daraus ein Absatz aus reinen Kürzeln, quer über
 * den halben Bildschirm, den niemand liest und der die eigentliche Aussage
 * begräbt.
 *
 * Weggelassen wird die Aussage deshalb nicht – nur die Liste. Welcher Kurs
 * betroffen ist, steht ohnehin an jedem einzelnen Kurs.
 */
function nenne(kuerzel: string[], einzahl: string, mehrzahl: string) {
  if (kuerzel.length <= HOECHSTENS_AUFZAEHLEN) return kuerzel.join(', ')
  return `${kuerzel.length} ${kuerzel.length === 1 ? einzahl : mehrzahl}`
}

/**
 * Ein Satz über die Datenlage einer ganzen Liste von Kursen.
 *
 * Nennt die beteiligten Quellen und – falls vorhanden – die Instrumente, die
 * weiterhin Demo-Daten zeigen. Beides ausdrücklich, weil ein gemischter Zustand
 * sonst als „alles echt“ gelesen wird.
 */
export function SourceSummary({
  quotes,
  className,
}: {
  quotes: readonly MarketQuote[]
  className?: string
}) {
  const quellen = [...new Set(quotes.map((q) => q.source?.label).filter(Boolean))]
  /*
    Zwei Gründe für einen Demo-Kurs, die auseinandergehalten gehören: Für das
    eine Instrument gibt es dauerhaft keine Quelle, das andere ist nur noch
    nicht abgerufen worden. Wer den Unterschied verschweigt, behauptet über neue
    Instrumente etwas Falsches.
  */
  const ohneQuelle = quotes.filter((q) => !q.source && !q.sourcePlanned)
  const wartend = quotes.filter((q) => !q.source && q.sourcePlanned)
  const klasse = className ?? 'text-fg-muted text-sm leading-relaxed'

  /*
    Kein einziger echter Kurs – der Zustand vor dem ersten Lauf des Workflows.

    Hier `null` zurückzugeben wäre der gefährlichste Fehler dieser Komponente
    gewesen: Dann stünden erzeugte Zahlen ohne jeden Hinweis auf der Seite.
    Ausgerechnet der Fall, in dem die Kennzeichnung am nötigsten ist.
  */
  if (quellen.length === 0) {
    return (
      <p className={klasse}>
        Diese Kurse werden{' '}
        <strong className="text-fg font-semibold">rechnerisch erzeugt</strong> und
        entsprechen keinen tatsächlichen Marktpreisen. Der Abruf echter Kurse ist
        eingerichtet, hat aber noch nicht gelaufen.
      </p>
    )
  }

  return (
    <p className={klasse}>
      Kurse werden während der Börsenzeit alle dreißig Minuten abgerufen, der Verlauf
      zeigt Tagesschlusskurse. Keine Echtzeitdaten – der angezeigte Stand kann eine halbe
      Stunde alt sein. Quellen: {quellen.join(' und ')}.
      {ohneQuelle.length > 0 && (
        <>
          {' '}
          Für{' '}
          {nenne(
            ohneQuelle.map((q) => q.ticker),
            'Wert',
            'Werte'
          )}{' '}
          gibt es keine frei zugängliche Quelle; dort stehen{' '}
          <strong className="text-fg font-semibold">erzeugte Demo-Kurse</strong>.
        </>
      )}
      {wartend.length > 0 && (
        <>
          {' '}
          {nenne(
            wartend.map((q) => q.ticker),
            'Wert',
            'Werte'
          )}{' '}
          {wartend.length === 1 ? 'wurde' : 'wurden'} neu aufgenommen und{' '}
          {wartend.length === 1 ? 'wartet' : 'warten'} auf den ersten Abruf – bis dahin
          stehen dort <strong className="text-fg font-semibold">Demo-Kurse</strong>. Der
          Hinweis steht auch an jedem einzelnen dieser Kurse.
        </>
      )}
    </p>
  )
}
