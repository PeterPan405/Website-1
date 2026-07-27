import { Kennzahlzeile } from '@/components/markets/Kennzahlzeile'
import type { Ausfallgrund, Kennwert } from '@/lib/fundamentalkennzahlen'
import type { Fundamentalbefund } from '@/lib/markets'
import { formatDate, formatLargeAmount, formatNumber } from '@/lib/format'
import { fundamentalQuelle, fundamentalStand } from '@/lib/fundamentaldaten'

/**
 * Die fünf Bewertungskennzahlen einer Aktie.
 *
 * ## Warum genau diese fünf
 *
 * Sie beantworten fünf verschiedene Fragen, und keine ist durch eine andere zu
 * ersetzen:
 *
 * - **Marktkapitalisierung** – wie groß ist das Unternehmen an der Börse?
 * - **Kurs-Gewinn-Verhältnis** – wie teuer ist der Gewinn, den es macht?
 * - **Kurs-Umsatz-Verhältnis** – wie teuer ist der Umsatz? Die einzige der
 *   Bewertungszahlen, die auch bei Verlust noch etwas sagt.
 * - **Kurs-Buchwert-Verhältnis** – wie teuer ist das, was tatsächlich da ist?
 * - **Cashflow je Aktie** – wie viel Geld fließt wirklich herein? Gewinn lässt
 *   sich buchhalterisch gestalten, Zahlungsströme weit weniger.
 *
 * ## Warum bei vielen Aktien nichts steht
 *
 * Die Zahlen stammen aus den Pflichtmeldungen an die US-Börsenaufsicht. Wer
 * nicht dort meldet – und das sind die meisten europäischen und asiatischen
 * Unternehmen –, ist nicht enthalten. Eine offene, kostenfreie Quelle mit
 * derselben Verlässlichkeit für den Rest der Welt gibt es nicht. Dann steht
 * hier ein Satz, der das erklärt, und keine geschätzte Zahl.
 */
export function Unternehmenszahlen({
  befund,
  name,
  className,
}: {
  befund: Fundamentalbefund
  name: string
  className?: string
}) {
  const kennzahlen = befund.art === 'zahlen' ? befund.kennzahlen : null

  return (
    <section aria-labelledby="unternehmenszahlen" className={className}>
      <h2 id="unternehmenszahlen" className="text-fg text-2xl font-bold">
        Unternehmenszahlen
      </h2>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        Der Kurs allein sagt nichts darüber, ob eine Aktie teuer ist – dafür braucht es
        die Zahlen des Unternehmens dahinter. Die folgenden fünf setzen den Kurs ins
        Verhältnis zu dem, was {name} tatsächlich erwirtschaftet.
      </p>

      {kennzahlen ? (
        <>
          <div className="fk-card mt-5 p-5 sm:p-6">
            <dl className="space-y-4">
              <Kennzahlzeile
                label="Marktkapitalisierung"
                wert={zahl(kennzahlen.marktkapitalisierung, betrag)}
                erklaerung={
                  kennzahlen.marktkapitalisierung.wert === null
                    ? grundText(kennzahlen.marktkapitalisierung.grund, 'die Aktienzahl')
                    : 'Der Preis für alle Aktien zusammen – was das gesamte Unternehmen an der Börse gerade kostet. Die Zahl ordnet ein, mit wem man es zu tun hat: Ein Wert unter zwei Milliarden gilt als klein, über zweihundert Milliarden als sehr groß.'
                }
              />
              <Kennzahlzeile
                label="Kurs-Gewinn-Verhältnis"
                wert={zahl(kennzahlen.kgv, verhaeltnis)}
                erklaerung={
                  kennzahlen.kgv.wert === null
                    ? grundText(kennzahlen.kgv.grund, 'der Gewinn')
                    : 'Wie viele Jahresgewinne man für eine Aktie bezahlt. Bei 20 kostet die Aktie das Zwanzigfache dessen, was das Unternehmen in einem Jahr verdient hat. Hohe Werte bedeuten, dass der Markt mit wachsenden Gewinnen rechnet – tritt das nicht ein, fällt der Kurs.'
                }
              />
              <Kennzahlzeile
                label="Kurs-Umsatz-Verhältnis"
                wert={zahl(kennzahlen.kuv, verhaeltnis)}
                erklaerung={
                  kennzahlen.kuv.wert === null
                    ? grundText(kennzahlen.kuv.grund, 'der Umsatz')
                    : 'Dasselbe, bezogen auf den Umsatz statt auf den Gewinn. Nützlich bei jungen Unternehmen, die noch keinen Gewinn machen – und als Gegenprobe, wenn ein Gewinn durch Sondereffekte verzerrt ist.'
                }
              />
              <Kennzahlzeile
                label="Kurs-Buchwert-Verhältnis"
                wert={zahl(kennzahlen.kbv, verhaeltnis)}
                erklaerung={
                  kennzahlen.kbv.wert === null
                    ? grundText(kennzahlen.kbv.grund, 'das Eigenkapital')
                    : 'Der Kurs im Verhältnis zum Eigenkapital je Aktie – also zu dem, was nach Abzug aller Schulden bilanziell übrig bliebe. Bei Banken und Industrie ist das aussagekräftig; bei Software- und Markenunternehmen weniger, weil deren Wert kaum in der Bilanz steht.'
                }
              />
              <Kennzahlzeile
                label="Cashflow je Aktie"
                wert={zahl(kennzahlen.cashflowJeAktie, betrag)}
                erklaerung={
                  kennzahlen.cashflowJeAktie.wert === null
                    ? grundText(kennzahlen.cashflowJeAktie.grund, 'der Cashflow')
                    : 'Wie viel Geld das laufende Geschäft je Aktie eingebracht hat. Anders als der Gewinn hängt diese Zahl kaum von Bewertungsspielräumen ab – liegt sie dauerhaft deutlich unter dem Gewinn, lohnt ein genauerer Blick.'
                }
              />
            </dl>
          </div>

          <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
            Quelle:{' '}
            <a
              href={fundamentalQuelle.url}
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-fg underline underline-offset-2"
            >
              {fundamentalQuelle.label}
            </a>
            . {fundamentalQuelle.abgrenzung} Abgerufen am {formatDate(fundamentalStand)};
            der Kurs ist tagesaktuell, die Bilanzzahlen sind es naturgemäß nicht – sie
            ändern sich mit den Quartalsberichten.
          </p>
        </>
      ) : (
        <div className="fk-card mt-5 p-5 sm:p-6">
          {befund.art === 'keinEchterKurs' ? (
            <p className="text-fg-muted leading-relaxed">
              Die Bilanzzahlen von {name} liegen vor, ein echter Kurs jedoch nicht – für
              diesen Wert ist noch keine Kursquelle eingerichtet, der Chart zeigt
              gekennzeichnete Beispieldaten. Jede der fünf Kennzahlen setzt den Kurs ins
              Verhältnis zu den Unternehmenszahlen; mit einem erfundenen Kurs käme eine
              Zahl heraus, die echt aussieht und es nicht ist.
            </p>
          ) : (
            <p className="text-fg-muted leading-relaxed">
              Für {name} liegen keine Unternehmenszahlen vor. Sie stammen aus den
              Pflichtmeldungen an die US-Börsenaufsicht, und die erfassen nur Unternehmen,
              die nach US-Vorschriften bilanzieren. Für die übrigen gibt es keine offene
              Quelle, die dieselbe Verlässlichkeit hätte – jedes Land hat seine eigene
              Aufsicht mit eigenem Format, und die kommerziellen Anbieter verlangen eine
              Lizenz.
            </p>
          )}
          <p className="text-fg-muted mt-3 leading-relaxed">
            Ein geschätztes Kurs-Gewinn-Verhältnis stünde hier zwar – es sähe nur aus wie
            eine Tatsache, ohne eine zu sein. Was sich aus dem Kursverlauf selbst rechnen
            lässt, steht deshalb weiter unten und gilt für jeden Wert gleichermaßen.
          </p>
        </div>
      )}
    </section>
  )
}

/** Formatiert einen Kennwert oder setzt einen Gedankenstrich. */
function zahl(eintrag: Kennwert, wie: (wert: number) => string): string {
  return eintrag.wert === null ? '–' : wie(eintrag.wert)
}

function betrag(wert: number): string {
  // Unter tausend Dollar ist es ein Wert je Aktie, darüber eine Bilanzsumme.
  return Math.abs(wert) < 1000
    ? `${formatNumber(wert, 2)} USD`
    : formatLargeAmount(wert, 'USD')
}

function verhaeltnis(wert: number): string {
  /*
    Ab hundert wird die Nachkommastelle zur Scheingenauigkeit.

    Ein Kurs-Gewinn-Verhältnis von 340,7 unterscheidet sich von 341 in nichts,
    was jemandem bei einer Entscheidung hülfe – beides heißt „sehr teuer“.
  */
  return formatNumber(wert, Math.abs(wert) >= 100 ? 0 : 1)
}

function grundText(grund: Ausfallgrund | null, groesse: string): string {
  if (grund === 'verlust') {
    return 'Das Unternehmen hat im letzten gemeldeten Geschäftsjahr Verlust gemacht. Die Formel ergäbe eine negative Zahl, und die läse sich wie „besonders günstig“, obwohl sie das Gegenteil bedeutet. Deshalb steht hier nichts.'
  }
  if (grund === 'negativesEigenkapital') {
    return 'Das Eigenkapital ist negativ – bilanziell übersteigen die Schulden das Vermögen. Das kommt bei Unternehmen vor, die viele eigene Aktien zurückgekauft haben, und macht diese Kennzahl unbrauchbar.'
  }
  return `Die Quelle meldet für dieses Unternehmen nicht, ${groesse === 'die Aktienzahl' ? 'wie viele Aktien ausstehen' : `wie hoch ${groesse} war`}.`
}
