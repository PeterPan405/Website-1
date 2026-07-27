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
      Schlusskurs vom {formatDate(quote.asOf)} · Quelle:{' '}
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
  const demo = quotes.filter((q) => !q.source)
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
      Tagesschlusskurse, keine Echtzeitdaten – die Website wird einmal je Börsentag neu
      gebaut. Quellen: {quellen.join(' und ')}.
      {demo.length > 0 && (
        <>
          {' '}
          Für {demo.map((q) => q.ticker).join(', ')} gibt es keine frei zugängliche
          Quelle; dort stehen weiterhin{' '}
          <strong className="text-fg font-semibold">erzeugte Demo-Kurse</strong>.
        </>
      )}
    </p>
  )
}
