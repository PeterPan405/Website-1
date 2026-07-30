'use client'

import Link from 'next/link'

import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatNumber } from '@/lib/format'
import { ordneEin, werteStreuung, type Streuposten } from '@/lib/streuung'

/**
 * Wie breit die gemerkten Titel streuen.
 *
 * ## Warum das hier steht und nicht im Lernbereich
 *
 * Weil es im Lernbereich schon steht – am Beispiel. Streuung ist der einzige
 * Vorgang in der Geldanlage, bei dem sich das Risiko senken lässt, ohne die
 * erwartete Rendite mitzusenken; das erklärt diese Website an mehreren Stellen.
 * Was sie bisher nicht konnte, ist dieselbe Rechnung an den Titeln vorführen,
 * für die sich jemand tatsächlich interessiert.
 *
 * ## Warum die größte Gruppe die Überschrift bekommt
 *
 * Weil die Zahl der Gruppen trügt. „Acht Titel in fünf Branchen“ klingt breit
 * und beschreibt trotzdem eine Auswahl, bei der vier von acht am selben Faden
 * hängen. Der Anteil der größten Gruppe sagt genau das, was die Zahl der
 * Gruppen verschweigt.
 *
 * ## Was hier nicht steht
 *
 * Keine Bewertung des Depots, denn eine Merkliste ist keins: Es gibt keine
 * Stückzahlen, also auch keine Gewichte. Gezählt werden Titel, nicht Euro –
 * und das steht als Einschränkung dabei, weil der Unterschied erheblich ist.
 */
export function Streutafel({
  posten,
  laendernamen,
}: {
  posten: readonly Streuposten[]
  /** ISO-Zahl auf deutschen Ländernamen – kommt fertig von der Seite. */
  laendernamen: Readonly<Record<string, string>>
}) {
  const befund = werteStreuung(posten)
  const einordnung = ordneEin(befund)

  // Unter zwei Titeln gibt es nichts einzuordnen, und das ist keine Lücke.
  if (!einordnung || !befund.groessterKlumpen) return null

  const klumpen = befund.groessterKlumpen
  const groesstesLand = befund.laender[0]

  const zugeordnet = befund.titel - befund.ohneBranche

  /*
    Die Überschrift nennt die Zahl, nicht „die Hälfte“.

    Hier stand zuerst „Die Hälfte deiner Titel sitzt in einer Branche“ – bei
    fünf von acht sind das 63 Prozent, und eine Website, die anderswo auf jede
    Nachkommastelle achtet, sollte nicht bei der eigenen Warnung runden. Die
    konkrete Zahl ist ohnehin die stärkere Aussage.
  */
  const ueberschrift = {
    einseitig: `${klumpen.anzahl} von ${zugeordnet} Titeln in einer Branche`,
    gemischt: 'Gemischt, mit einem Schwerpunkt',
    breit: 'Breit über Branchen verteilt',
  }[einordnung]

  return (
    <section aria-labelledby="streuung" className="mt-12">
      <h2 id="streuung" className="text-fg text-xl font-bold">
        Wie breit das streut
      </h2>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        Streuung ist der einzige Vorgang in der Geldanlage, der das Risiko senkt, ohne die
        erwartete Rendite mitzusenken. Ob sie gelingt, entscheidet nicht die Zahl der
        Titel – sondern ob sie an verschiedenen Fäden hängen.
      </p>

      <StatGrid className="mt-6">
        <Stat
          label="Branchen"
          value={String(befund.branchen.length)}
          hint={`über ${befund.titel} ${befund.titel === 1 ? 'Titel' : 'Titel'}`}
        />
        <Stat
          label="Größte Branche"
          value={`${formatNumber(klumpen.anteilProzent, 0)} %`}
          tone={klumpen.anteilProzent >= 50 ? 'negative' : 'neutral'}
          hint={`${klumpen.name} – ${klumpen.anzahl} von ${zugeordnet}`}
        />
        <Stat
          label="Sitzländer"
          value={String(befund.laender.length)}
          hint={
            groesstesLand
              ? `größtes: ${laendernamen[groesstesLand.name] ?? groesstesLand.name} mit ${formatNumber(groesstesLand.anteilProzent, 0)} %`
              : 'keine Angabe'
          }
        />
      </StatGrid>

      <Callout
        variant={einordnung === 'einseitig' ? 'warning' : 'info'}
        title={ueberschrift}
        className="mt-6"
      >
        {einordnung === 'einseitig' ? (
          <p>
            {klumpen.anzahl} von {zugeordnet} Titeln stehen in der Branche{' '}
            <strong>{klumpen.name}</strong>, also {formatNumber(klumpen.anteilProzent, 0)}{' '}
            Prozent. Das ist kein Fehler – es kann eine bewusste Wette sein. Es heißt nur,
            dass diese Auswahl weniger streut, als ihre Länge vermuten lässt: Was diese
            Branche trifft, trifft {klumpen.anzahl} deiner Titel gleichzeitig.
          </p>
        ) : einordnung === 'breit' ? (
          <p>
            {befund.branchen.length} Branchen, und keine davon macht mehr als{' '}
            {formatNumber(klumpen.anteilProzent, 0)} Prozent aus. Damit hängen die Titel
            an verschiedenen Fäden – genau das, was Streuung leisten soll.
          </p>
        ) : (
          <p>
            {befund.branchen.length} Branchen, die größte mit{' '}
            {formatNumber(klumpen.anteilProzent, 0)} Prozent. Kein Klumpen, aber auch
            keine gleichmäßige Verteilung: <strong>{klumpen.name}</strong> wiegt schwerer
            als der Rest.
          </p>
        )}
        <p>
          <Link
            href="/lernen/aktien-laender-branchen"
            className="text-markets font-medium underline underline-offset-2"
          >
            Warum Streuung über Branchen zählt
          </Link>
        </p>
      </Callout>

      <p className="text-fg-subtle mt-4 text-xs leading-relaxed">
        Gezählt werden Titel, nicht Beträge. Eine Merkliste kennt keine Stückzahlen – wer
        von einem Titel zehnmal so viel hält wie von den anderen, streut also weniger, als
        hier steht. Die Brancheneinteilung ist die dieser Website und keine amtliche.
        {befund.ohneBranche > 0 && (
          <>
            {' '}
            {befund.ohneBranche}{' '}
            {befund.ohneBranche === 1 ? 'Titel trägt' : 'Titel tragen'} keine Branche und{' '}
            {befund.ohneBranche === 1 ? 'bleibt' : 'bleiben'} in der Rechnung außen vor.
          </>
        )}
      </p>
    </section>
  )
}
