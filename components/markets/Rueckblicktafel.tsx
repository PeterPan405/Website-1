import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { cn } from '@/lib/cn'
import { formatDateShort, formatNumber, formatPercentSigned } from '@/lib/format'
import type { Einmalanlage, Sparplan } from '@/lib/rueckblick'

/**
 * Ein Betrag in der Notierungswährung.
 *
 * Glatte Beträge ohne Nachkommastellen: „100 USD je Monat“ statt „100,00 USD je
 * Monat“ – die Rate ist eine Vorgabe und keine Messung. Große Ergebnisse
 * ebenfalls ohne, weil zwei Stellen an 30.078 USD eine Genauigkeit vorspiegeln,
 * die eine Rechnung ohne Gebühren und ohne Dividenden nicht hat.
 */
function betrag(wert: number, einheit: string): string {
  const glatt = Number.isInteger(wert) || wert >= 1000
  return `${formatNumber(wert, glatt ? 0 : 2)} ${einheit}`
}

/**
 * Was aus einem festen Betrag geworden wäre.
 *
 * ## Warum feste Beträge und keine Eingabe
 *
 * Weil ein Eingabefeld hier nichts hinzufügte. Wer wissen will, was aus 2.500
 * Euro geworden wäre, multipliziert die Prozentzahl – die Antwort ist linear,
 * und ein Regler auf tausend Seiten kostet JavaScript, das genau diese
 * Multiplikation nachbaut. Die beiden Beträge stehen für die zwei Arten, wie
 * Menschen tatsächlich anlegen: einmal alles, oder jeden Monat etwas.
 *
 * ## Warum beide Zahlen nebeneinander stehen
 *
 * Weil der Vergleich die Lehre ist, nicht die einzelne Zahl. Bei steigenden
 * Kursen schlägt die Einmalanlage den Sparplan fast immer – sie war länger
 * investiert. Bei schwankenden oder fallenden liegt der Sparplan vorn, weil
 * eine feste Rate bei niedrigem Kurs mehr Anteile kauft.
 *
 * Wer nur eine der beiden Zahlen sieht, zieht daraus den falschen Schluss.
 * Nebeneinander zeigen sie, dass die Frage „was ist besser“ falsch gestellt
 * ist: Es hängt am Kursverlauf, und den kennt vorher niemand.
 */
export function Rueckblicktafel({
  einmal,
  plan,
  einheit,
  name,
  className,
}: {
  einmal: Einmalanlage
  plan: Sparplan | null
  einheit: string
  name: string
  className?: string
}) {
  const gewachsen = einmal.endwert >= einmal.einsatz

  return (
    <section aria-labelledby="rueckblick" className={cn(className)}>
      <h2 id="rueckblick" className="text-fg text-2xl font-bold">
        Was daraus geworden wäre
      </h2>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        Gerechnet an den tatsächlichen Schlusskursen von {name} – vom{' '}
        {formatDateShort(einmal.startTag)} bis zum {formatDateShort(einmal.endTag)}. Das
        ist ein Rückblick und keine Aussage über die nächsten fünf Jahre.
      </p>

      <StatGrid className="mt-6">
        <Stat
          label={`Einmal ${betrag(einmal.einsatz, einheit)}`}
          value={betrag(einmal.endwert, einheit)}
          tone={gewachsen ? 'positive' : 'negative'}
          hint={`${formatPercentSigned(einmal.gesamtProzent)} insgesamt`}
        />
        <Stat
          label="Im Jahr"
          value={
            einmal.jahresProzent !== null
              ? formatPercentSigned(einmal.jahresProzent)
              : 'nicht gebildet'
          }
          tone={
            einmal.jahresProzent !== null && einmal.jahresProzent >= 0
              ? 'positive'
              : 'negative'
          }
          hint={
            einmal.jahresProzent !== null
              ? 'Mittlere jährliche Veränderung über den Zeitraum'
              : 'Der Zeitraum ist kürzer als ein Jahr'
          }
        />
        {plan && (
          <>
            <Stat
              label={`${betrag(plan.rate, einheit)} je Monat`}
              value={betrag(plan.endwert, einheit)}
              tone={plan.endwert >= plan.eingezahlt ? 'positive' : 'negative'}
              hint={`aus ${plan.raten} Raten, zusammen ${betrag(plan.eingezahlt, einheit)}`}
            />
            <Stat
              label="Mittlerer Einstand"
              value={betrag(plan.mittlererKurs, einheit)}
              hint="Was ein Anteil im Schnitt gekostet hat – nicht der Durchschnitt der Kurse"
            />
          </>
        )}
      </StatGrid>

      {plan && (
        <div className="text-fg-muted mt-6 max-w-2xl space-y-4 leading-relaxed">
          <p>
            Die beiden Zahlen stehen bewusst nebeneinander, und der Vergleich ist die
            eigentliche Auskunft. Bei durchweg steigenden Kursen schlägt die Einmalanlage
            den Sparplan fast immer – sie war schlicht länger investiert. Bei schwankenden
            oder fallenden Kursen liegt der Sparplan vorn, weil eine feste Rate bei
            niedrigem Kurs mehr Anteile kauft als bei hohem.
          </p>
          <p>
            Genau das zeigt der mittlere Einstand: Er ist nicht der Durchschnitt der
            Monatskurse, sondern liegt bei schwankenden Kursen darunter. Das ist kein
            Trick und kein Vorteil, sondern die Rechenfolge daraus, dass die Rate fest ist
            und der Kurs nicht.
          </p>
        </div>
      )}

      <Callout variant="warning" title="Was diese Zahl nicht ist" className="mt-6">
        <p>
          Sie beschreibt <strong>einen</strong> Startzeitpunkt und <strong>einen</strong>{' '}
          Titel. Ein halbes Jahr früher oder später eingestiegen, und sie sieht anders aus
          – bei einzelnen Aktien oft dramatisch anders. Aus einem Verlauf auf den nächsten
          zu schließen, ist der häufigste Fehler beim Betrachten solcher Rechnungen.
        </p>
        <p>
          Nicht enthalten sind <strong>Dividenden</strong> – die Kursreihe ist eine
          Kursreihe, und bei einem Titel mit drei Prozent Ausschüttung fehlen über fünf
          Jahre entsprechend viele Prozentpunkte. Ebenfalls nicht enthalten:
          Ordergebühren, Spread und Abgeltungsteuer. Der Betrag steht vor allem, was eine
          Bank und ein Finanzamt davon nehmen.
        </p>
      </Callout>
    </section>
  )
}
