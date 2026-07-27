import type { Kennzahlen } from '@/lib/kennzahlen'
import { cn } from '@/lib/cn'
import { formatDateShort, formatPercentSigned } from '@/lib/format'

/**
 * Risiko und Verlauf eines Kurses in Zahlen.
 *
 * ## Warum nicht Kurs-Gewinn-Verhältnis und Marktkapitalisierung
 *
 * Weil es sie nicht frei gibt. Yahoo beantwortet Anfragen an seine
 * Kennzahlenschnittstellen mit `401 Unauthorized` beziehungsweise
 * `Invalid Crumb`; geliefert werden nur Kurse. Ein geschätztes KGV wäre
 * schlimmer als gar keins – es sähe aus wie eine Tatsache.
 *
 * Was hier steht, ergibt sich vollständig aus den Kursen selbst und gilt
 * deshalb für jeden geführten Wert gleichermaßen. Für die Frage, ob ein Papier
 * zu jemandem passt, ist es sogar die nützlichere Hälfte: Ein KGV sagt etwas
 * über die Bewertung, „schlimmster Rückgang 62 Prozent“ sagt etwas darüber,
 * was man aushalten muss.
 *
 * ## Warum keine Farben bei der Wertentwicklung
 *
 * Doch – aber nur dort. Bei Schwankung und Rückgang wäre Rot eine Wertung:
 * Eine hohe Schwankung ist nicht „schlecht“, sondern eine Eigenschaft, die zu
 * manchen Zielen passt und zu anderen nicht. Gefärbt wird nur, was eine
 * Richtung hat.
 */
export function Kennzahlentafel({
  kennzahlen,
  className,
}: {
  kennzahlen: Kennzahlen
  className?: string
}) {
  const hatWerte =
    kennzahlen.performance.length > 0 ||
    kennzahlen.schwankung !== null ||
    kennzahlen.maxRueckgang !== null

  // Eine frisch aufgenommene Aktie hat noch keine Reihe. Dann steht hier
  // nichts – ein Kasten mit fünfmal „–“ wäre nur Platzverschwendung.
  if (!hatWerte) return null

  const zeitraumName: Record<string, string> = {
    '1M': '1 Monat',
    '6M': '6 Monate',
    '1J': '1 Jahr',
    '3J': '3 Jahre',
    '5J': '5 Jahre',
  }

  return (
    <section aria-labelledby="risiko" className={className}>
      <h2 id="risiko" className="text-fg text-2xl font-bold">
        Wertentwicklung und Risiko
      </h2>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        Alle Zahlen sind aus dem Kursverlauf gerechnet, nicht von außen bezogen.
        Vergangene Entwicklung sagt nichts über die künftige – sie zeigt aber, womit man
        bei diesem Wert bisher rechnen musste.
      </p>

      {kennzahlen.performance.length > 0 && (
        <div className="fk-card mt-5 p-5 sm:p-6">
          <h3 className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
            Wertentwicklung
          </h3>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
            {kennzahlen.performance.map((eintrag) => (
              <div key={eintrag.zeitraum}>
                <dt className="text-fg-subtle text-xs">
                  {zeitraumName[eintrag.zeitraum] ?? eintrag.zeitraum}
                </dt>
                <dd
                  className={cn(
                    'mt-1 text-lg font-bold tabular-nums',
                    eintrag.prozent >= 0 ? 'text-success' : 'text-danger'
                  )}
                >
                  {formatPercentSigned(eintrag.prozent)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="text-fg-subtle mt-4 text-xs leading-relaxed">
            Kursentwicklung ohne Ausschüttungen. Bei Aktien und Indizes, die Dividenden
            zahlen, liegt die tatsächliche Rendite darüber; ein Zeitraum ohne belastbaren
            Startwert fehlt hier ganz.
          </p>
        </div>
      )}

      <div className="fk-card mt-4 p-5 sm:p-6">
        <h3 className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
          Risiko
        </h3>
        <dl className="mt-4 space-y-4">
          {kennzahlen.schwankung !== null && (
            <Zeile
              label="Schwankungsbreite"
              wert={`${kennzahlen.schwankung.toFixed(1)} % im Jahr`}
              erklaerung="Wie weit der Kurs im vergangenen Jahr typischerweise um seinen eigenen Trend schwankte, auf ein Jahr hochgerechnet. Ein Tagesgeldkonto läge bei null, ein breiter Aktienindex meist zwischen 12 und 20."
            />
          )}
          {kennzahlen.maxRueckgang !== null && (
            <Zeile
              label="Schlimmster Rückgang"
              wert={`${kennzahlen.maxRueckgang.toFixed(1)} %`}
              erklaerung={
                kennzahlen.maxRueckgangVon && kennzahlen.maxRueckgangBis
                  ? `Vom Hoch am ${formatDateShort(kennzahlen.maxRueckgangVon)} bis zum Tief am ${formatDateShort(kennzahlen.maxRueckgangBis)}. Die Zahl, die am ehesten beschreibt, was man aushalten musste – wer damals verkauft hat, hat diesen Verlust festgeschrieben.`
                  : 'Größter Abstand von einem Hoch bis zum darauffolgenden Tief.'
              }
            />
          )}
          {kennzahlen.abstand200 !== null && (
            <Zeile
              label="Abstand zum langfristigen Durchschnitt"
              wert={formatPercentSigned(kennzahlen.abstand200)}
              erklaerung="Wie weit der aktuelle Kurs über oder unter dem Durchschnitt der letzten 200 Handelstage liegt. Eine Beschreibung der Lage, keine Kauf- oder Verkaufsempfehlung."
            />
          )}
          {kennzahlen.anteilGewinntage !== null && (
            <Zeile
              label="Tage mit Gewinn"
              wert={`${kennzahlen.anteilGewinntage.toFixed(0)} % der Handelstage`}
              erklaerung="Anteil der Tage im vergangenen Jahr, an denen der Kurs über dem Vortag schloss. Liegt bei fast allen Werten nahe der Hälfte – die Rendite entsteht aus der Größe der Bewegungen, nicht aus ihrer Anzahl."
            />
          )}
        </dl>
      </div>
    </section>
  )
}

function Zeile({
  label,
  wert,
  erklaerung,
}: {
  label: string
  wert: string
  erklaerung: string
}) {
  return (
    <div className="border-border grid gap-1 border-t pt-4 first:border-0 first:pt-0 sm:grid-cols-[14rem_1fr] sm:gap-4">
      <div>
        <dt className="text-fg-subtle text-xs">{label}</dt>
        <dd className="text-fg mt-0.5 text-lg font-bold tabular-nums">{wert}</dd>
      </div>
      <p className="text-fg-muted text-sm leading-relaxed sm:self-center">{erklaerung}</p>
    </div>
  )
}
