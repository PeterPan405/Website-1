import Link from 'next/link'

import { Callout } from '@/components/ui/Callout'
import { kostenFuer } from '@/data/etf-kosten'
import { formatDate, formatPercent } from '@/lib/format'

/**
 * Die Angaben, die einen Fonds ausmachen – und die Lücke, wo eine fehlt.
 *
 * ## Warum die laufenden Kosten hier fehlen dürfen
 *
 * Weil sie in keiner frei abfragbaren Quelle stehen. Sie sind die wichtigste
 * Zahl eines ETF, und genau deshalb wird sie hier nicht aus dem Gedächtnis
 * hingeschrieben: Eine Kostenquote, die niemand nachgeschlagen hat, sähe aus
 * wie eine belegte Angabe.
 *
 * Wo sie fehlt, steht der Weg zum Basisinformationsblatt. Das ist die ehrliche
 * Auskunft und obendrein die rechtlich maßgebliche – verbindlich ist ohnehin
 * das Dokument des Anbieters und nicht seine Wiedergabe auf einer fremden
 * Website.
 */
export function Fondstafel({
  symbol,
  isin,
  ertragsverwendung,
  className,
}: {
  symbol: string
  isin?: string
  ertragsverwendung?: 'ansammelnd' | 'ausschüttend'
  className?: string
}) {
  const kosten = kostenFuer(symbol)

  return (
    <section aria-labelledby="fondsangaben" className={className}>
      <h2 id="fondsangaben" className="text-fg text-2xl font-bold">
        Was dieser Fonds ist
      </h2>

      <dl className="border-border mt-5 border-t">
        {isin && (
          <div className="border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-3">
            <dt className="text-fg-muted text-sm">Kennnummer (ISIN)</dt>
            <dd className="text-fg font-medium tabular-nums">{isin}</dd>
          </div>
        )}
        {ertragsverwendung && (
          <div className="border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-3">
            <dt className="text-fg-muted text-sm">Erträge</dt>
            <dd className="text-fg font-medium">
              {ertragsverwendung === 'ansammelnd'
                ? 'werden angesammelt (thesaurierend)'
                : 'werden ausgeschüttet'}
            </dd>
          </div>
        )}
        <div className="border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-3">
          <dt className="text-fg-muted text-sm">Laufende Kosten je Jahr</dt>
          <dd className="text-fg font-medium tabular-nums">
            {kosten ? (
              formatPercent(kosten.laufendeKostenProzent, 2)
            ) : (
              <span className="text-fg-subtle font-normal">nicht hinterlegt</span>
            )}
          </dd>
        </div>
      </dl>

      {kosten ? (
        <p className="text-fg-subtle mt-3 text-sm leading-relaxed">
          Laufende Kosten laut Basisinformationsblatt vom {formatDate(kosten.stand)}.{' '}
          <a
            href={kosten.quelle}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Zum Dokument des Anbieters
          </a>{' '}
          – maßgeblich ist dieses, nicht seine Wiedergabe hier.
        </p>
      ) : (
        <Callout
          variant="info"
          title="Die laufenden Kosten stehen hier nicht"
          className="mt-5"
        >
          <p>
            Sie sind die wichtigste Zahl eines Indexfonds – und die einzige, für die es
            keine frei abfragbare Quelle gibt. Kurse liefert die Börse, Bilanzzahlen die
            Aufsicht, Zinsen die Zentralbank; die Kostenquote steht in einem Dokument beim
            Anbieter und sonst nirgends.
          </p>
          <p>
            Sie hier aus dem Gedächtnis hinzuschreiben wäre schlechter als die Lücke: Die
            Zahl sähe aus wie eine belegte Angabe.
            {isin && (
              <>
                {' '}
                Nachzulesen ist sie im Basisinformationsblatt des Anbieters, auffindbar
                über die ISIN <strong className="text-fg">{isin}</strong>.
              </>
            )}
          </p>
          <p>
            Was sie über dreißig Jahre ausmacht, rechnet der{' '}
            <Link
              href="/rechner/kostenrechner"
              className="text-tools font-medium underline underline-offset-2"
            >
              Kostenrechner
            </Link>{' '}
            aus – dort lässt sich der Wert aus dem Dokument eintragen.
          </p>
        </Callout>
      )}
    </section>
  )
}
