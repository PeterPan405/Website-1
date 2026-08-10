import { Dividendenverlauf } from '@/components/markets/Dividendenverlauf'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { cn } from '@/lib/cn'
import {
  rhythmusLabel,
  type Dividendenbefund,
  type Dividendenjahre,
} from '@/lib/dividenden'
import { formatDateShort, formatNumber, formatPercent } from '@/lib/format'

/**
 * Ein Dividendenbetrag mit so vielen Stellen, wie er braucht.
 *
 * Feste vier Nachkommastellen sähen bei Allianz als „17,1000 EUR“ aus, feste
 * zwei würden BP mit 6,1844 Pence auf 6,18 runden. Also so viele, wie der
 * Betrag tatsächlich hat, höchstens vier.
 */
function betrag(wert: number, einheit: string): string {
  const stellen = Math.min(
    4,
    (wert.toFixed(4).split('.')[1] ?? '').replace(/0+$/, '').length
  )
  return `${formatNumber(wert, Math.max(2, stellen))} ${einheit}`
}

/**
 * Was eine Aktie ausschüttet – und wann voraussichtlich die nächste kommt.
 *
 * ## Warum die Rendite auf zwölf Monate zurückblickt
 *
 * Es gibt zwei Arten, eine Dividendenrendite zu bilden. Die eine nimmt die
 * zuletzt gezahlte Dividende und rechnet sie auf ein Jahr hoch; die andere
 * summiert, was tatsächlich in den letzten zwölf Monaten gezahlt wurde. Die
 * erste ist höher, wenn ein Unternehmen gerade erhöht hat, und sie unterstellt
 * drei Zahlungen, die noch niemand beschlossen hat. Hier steht die zweite.
 *
 * Deshalb fehlt die Rendite auch, wenn im Zeitraum nicht der ganze Jahreszyklus
 * liegt: Zwei von vier Quartalszahlungen ergäben eine halbierte Zahl, die
 * aussieht wie eine Eigenschaft der Aktie. Dann steht die Summe da, aber keine
 * Prozentzahl.
 *
 * ## Warum der nächste Termin als Schätzung gekennzeichnet ist
 *
 * Weil er einer ist. Die Quelle liefert die Vergangenheit; der nächste Tag ist
 * aus dem Muster gerechnet. Wer nach dem Datum handelt, soll wissen, worauf es
 * beruht – und der Kalender führt denselben Termin mit demselben Hinweis.
 */
export function Dividendentafel({
  befund,
  einheit,
  name,
  quelle,
  verlauf,
  className,
}: {
  befund: Dividendenbefund
  /** Die Einheit des Kurses, in der auch die Beträge stehen. */
  einheit: string
  name: string
  quelle: { label: string; url: string }
  /** Die Jahressummen für die Verlaufsgrafik, falls es genug davon gibt. */
  verlauf?: Dividendenjahre | null
  className?: string
}) {
  return (
    <section aria-labelledby="dividende" className={cn(className)}>
      <h2 id="dividende" className="text-fg text-2xl font-bold">
        Dividende
      </h2>
      <p className="text-fg-muted mt-2 leading-relaxed">
        Was {name} an die Aktionäre ausschüttet. Grundlage sind die tatsächlich gezahlten
        Beträge der Vergangenheit – nicht eine Ankündigung und keine Prognose.
      </p>

      <StatGrid className="mt-6">
        <Stat
          label="Rhythmus"
          value={rhythmusLabel[befund.rhythmus]}
          hint="Wie oft im Jahr gezahlt wird, abgeleitet aus den Abständen der letzten drei Jahre"
        />
        <Stat
          label="Letzte Zahlung"
          value={betrag(befund.letzte.amount, einheit)}
          hint={`Abschlagstag ${formatDateShort(befund.letzte.date)}`}
        />
        <Stat
          label="Zwölf Monate"
          value={betrag(befund.summeZwoelfMonate, einheit)}
          hint={`Summe aus ${befund.zahlungenZwoelfMonate} ${
            befund.zahlungenZwoelfMonate === 1 ? 'Zahlung' : 'Zahlungen'
          } je Aktie`}
        />
        <Stat
          label="Dividendenrendite"
          value={
            /*
              `formatPercent` erwartet die Prozentzahl selbst und hängt nur das
              Zeichen an – hier stand ein Teilen durch hundert, und damit wies
              Apple eine Dividendenrendite von 0,00 Prozent aus statt 0,31.
              Aufgefallen ist es beim Nachrechnen der gebauten Seiten, nicht
              beim Lesen des Codes: Eine Rendite von 0,03 Prozent sieht auf
              einer Aktienseite nicht falsch aus, sondern nur mager.
            */
            befund.renditeProzent !== null
              ? formatPercent(befund.renditeProzent)
              : 'nicht gebildet'
          }
          hint={
            befund.renditeProzent !== null
              ? 'Zahlungen der letzten zwölf Monate, geteilt durch den aktuellen Kurs'
              : 'Im Zeitraum liegt kein vollständiger Jahreszyklus – eine Zahl wäre zu niedrig'
          }
        />
      </StatGrid>

      {/*
        Der Verlauf steht zwischen den Kennzahlen und dem erwarteten Termin.

        Die Kennzahlen oben beantworten „wie viel“, der Verlauf „wohin“ – und
        das ist bei einer Dividende oft die wichtigere Frage. Eine Rendite von
        drei Prozent bedeutet etwas anderes, wenn die Ausschüttung seit vier
        Jahren steigt, als wenn sie seit vier Jahren fällt. Die Zahl allein
        zeigt diesen Unterschied nicht.
      */}
      {verlauf && verlauf.jahre.length >= 2 && (
        <div className="mt-8">
          <h3 className="text-fg text-lg font-semibold">Verlauf je Jahr</h3>
          <Dividendenverlauf verlauf={verlauf} einheit={einheit} className="mt-3" />
        </div>
      )}

      {befund.naechsterErwartet && befund.schaetzungBasis && (
        <div className="mt-6">
          <Callout variant="info" title="Nächster Abschlag: geschätzt, nicht angekündigt">
            <p>
              {/*
                „Erwartet am", nicht „erwartet um den" – dieselbe Umstellung wie
                im Kalender, aus demselben Grund: Der Vorbehalt steht schon in
                der Überschrift dieses Kastens und im Satz danach. Zweimal
                dasselbe zu sagen verwischt nur das Datum.
              */}
              Erwartet am <strong>{formatDateShort(befund.naechsterErwartet)}</strong>.
              Das ist aus dem bisherigen Muster gerechnet – zuletzt wurde am{' '}
              {formatDateShort(befund.letzte.date)} gezahlt, im Zyklus davor am{' '}
              {formatDateShort(befund.schaetzungBasis)}.
              {befund.streuungTage > 0 && (
                <>
                  {' '}
                  Die Abstände haben bisher um bis zu {befund.streuungTage}{' '}
                  {befund.streuungTage === 1 ? 'Tag' : 'Tage'} geschwankt; so genau ist
                  die Schätzung also höchstens.
                </>
              )}{' '}
              Den verbindlichen Tag nennt das Unternehmen selbst, meist wenige Wochen
              vorher.
            </p>
            <p>
              Am Abschlagstag fällt der Kurs üblicherweise um etwa die Dividende. Das ist
              kein Verlust und kein Gewinn: Wer vorher kauft, bekommt die Zahlung und
              zahlt den höheren Kurs; wer danach kauft, bekommt sie nicht und zahlt
              weniger. Eine Aktie „vor der Dividende“ zu kaufen, bringt deshalb nichts –
              außer der Steuer auf die Ausschüttung.
            </p>
          </Callout>
        </div>
      )}

      <p className="text-fg-subtle mt-4 text-xs leading-relaxed">
        Quelle:{' '}
        <a
          href={quelle.url}
          rel="noopener noreferrer nofollow"
          target="_blank"
          className="hover:text-fg underline underline-offset-2"
        >
          {quelle.label}
        </a>
        . Beträge je Aktie in {einheit}, brutto – vor Quellensteuer des Sitzlandes und vor
        deutscher Abgeltungsteuer.
      </p>
    </section>
  )
}
