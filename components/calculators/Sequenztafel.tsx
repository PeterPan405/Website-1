import Link from 'next/link'

import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatCurrencyRounded, formatPercentSigned } from '@/lib/format'
import { getJahresrenditen } from '@/lib/jahresrenditen'
import { reihenfolgevergleich } from '@/lib/sequenzrisiko'

/**
 * Dieselben Jahre, andere Reihenfolge – und ein anderes Ergebnis.
 *
 * ## Was diese Tafel zeigt
 *
 * Ein Rechner mit fester Renditeannahme beantwortet die Frage „was kommt bei
 * sieben Prozent heraus“. Er beantwortet nicht die Frage, die für jeden
 * wichtig wird, der aus dem Depot lebt: Was passiert, wenn die schlechten
 * Jahre am Anfang liegen?
 *
 * Genommen werden echte Jahresrenditen eines Index. Sie werden einmal
 * aufsteigend und einmal absteigend sortiert – dieselben Zahlen, derselbe
 * Mittelwert, verschiedene Reihenfolge. Wer nichts entnimmt, bekommt in beiden
 * Fällen dasselbe Endergebnis; wer entnimmt, nicht.
 *
 * ## Warum das kein Prognosewerkzeug ist
 *
 * Fünf Jahre sind für eine Aussage über einen Entnahmeplan zu wenig, und die
 * Momentaufnahme gibt nicht mehr her. Die Tafel zeigt einen Mechanismus, keine
 * Wahrscheinlichkeit – und das steht darunter.
 */

/** Der Index, an dem gezeigt wird. */
const SYMBOL = 'msci-world'
const NAME = 'MSCI World'

/** Startkapital und Jahresentnahme des Beispiels. */
const STARTKAPITAL = 500_000
const ENTNAHME = 25_000

export function Sequenztafel({ className }: { className?: string }) {
  const renditen = getJahresrenditen(SYMBOL)
  /*
    Unter vier Jahren wird nichts gezeigt. Ein „Reihenfolgevergleich“ aus zwei
    Jahren ist ein Vertauschen von zwei Zahlen und trägt keine Aussage.
  */
  if (renditen.length < 4) return null

  const vergleich = reihenfolgevergleich(
    STARTKAPITAL,
    renditen.map((eintrag) => eintrag.prozent),
    ENTNAHME
  )

  return (
    <section aria-labelledby="sequenz" className={className}>
      <h2 id="sequenz" className="text-fg text-2xl font-bold">
        Dieselbe Rendite, anderes Ergebnis
      </h2>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        Der Rechner oben arbeitet mit einer festen Rendite pro Jahr. In der Wirklichkeit
        gibt es die nicht – es gibt gute und schlechte Jahre, und für jemanden, der Geld
        entnimmt, macht ihre <strong>Reihenfolge</strong> einen Unterschied, den kein
        Mittelwert zeigt.
      </p>
      <p className="text-fg-muted mt-3 max-w-2xl leading-relaxed">
        Hier sind es die tatsächlichen Jahresrenditen des {NAME} der letzten{' '}
        {renditen.length} Jahre – einmal mit den schlechten Jahren zuerst, einmal mit den
        guten. Dieselben Zahlen, derselbe Mittelwert von{' '}
        {formatPercentSigned(vergleich.mittlereRenditeProzent, 1)}. Angenommen sind{' '}
        {formatCurrencyRounded(STARTKAPITAL)} Startkapital und{' '}
        {formatCurrencyRounded(ENTNAHME)} Entnahme je Jahr.
      </p>

      <StatGrid columns={3} className="mt-6">
        <Stat
          label="Schlechte Jahre zuerst"
          value={formatCurrencyRounded(vergleich.schlechtZuerst.endwert)}
          tone="negative"
          hint={
            vergleich.schlechtZuerst.erschoepftImJahr
              ? `Das Depot war im Jahr ${vergleich.schlechtZuerst.erschoepftImJahr} aufgebraucht`
              : 'am Ende übrig'
          }
        />
        <Stat
          label="Gute Jahre zuerst"
          value={formatCurrencyRounded(vergleich.gutZuerst.endwert)}
          tone="positive"
          hint="am Ende übrig"
        />
        <Stat
          label="Unterschied"
          value={formatCurrencyRounded(vergleich.unterschied)}
          hint="allein durch die Reihenfolge"
        />
      </StatGrid>

      <Callout
        variant="warning"
        title="Was daraus folgt – und was nicht"
        className="mt-6"
      >
        <p>
          <strong>Was folgt:</strong> Wer aus dem Depot entnimmt, trägt ein Risiko, das in
          keiner Durchschnittsrendite steckt. Ein schwacher Start zwingt dazu, Anteile zu
          verkaufen, während sie wenig wert sind – und diese Anteile fehlen, wenn es
          wieder aufwärtsgeht. Wer nichts entnimmt, ist davon nicht betroffen: Bei ihm
          kommt in beiden Reihenfolgen dasselbe heraus.
        </p>
        <p>
          <strong>Was nicht folgt:</strong> eine Aussage über die Zukunft.{' '}
          {renditen.length} Jahre sind für einen Entnahmeplan über dreißig Jahre viel zu
          wenig, und die sortierte Reihenfolge ist ein gedachter Extremfall, kein
          beobachteter Verlauf. Gezeigt wird ein Mechanismus, keine Wahrscheinlichkeit.
        </p>
        <p>
          Ausführlich steht das im Lernthema{' '}
          <Link
            href="/lernen/rente"
            className="text-learn font-medium underline underline-offset-2"
          >
            Rente
          </Link>
          .
        </p>
      </Callout>

      <details className="border-border mt-6 rounded-lg border p-4">
        <summary className="text-fg cursor-pointer text-sm font-medium">
          Die verwendeten Jahresrenditen
        </summary>
        <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {renditen.map((eintrag) => (
            <li key={eintrag.jahr} className="text-fg-muted flex justify-between gap-4">
              <span>{eintrag.jahr}</span>
              <span className="tabular-nums">
                {formatPercentSigned(eintrag.prozent, 1)}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
          Aus den gespeicherten Schlusskursen gerechnet, jeweils von Jahresende zu
          Jahresende. Das laufende Jahr fehlt: Eine Rendite über sieben Monate als
          Jahresrendite auszuweisen wäre falsch.
        </p>
      </details>
    </section>
  )
}
