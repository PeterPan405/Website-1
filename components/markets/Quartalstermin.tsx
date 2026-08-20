import Link from 'next/link'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import type { Quartalsterminbefund } from '@/lib/quartalstermine'

/**
 * Wann diese Aktie das nächste Mal Zahlen vorlegt.
 *
 * ## Warum das auf jede Aktienseite gehört
 *
 * Der Betreiber hat es am 20. August 2026 verlangt, und der Anlass war ein
 * guter: Alibaba legte an dem Tag Zahlen vor, und auf der Aktienseite stand
 * davon nichts. Ein Quartalsbericht ist der einzige planbare Termin, an dem
 * sich der Kurs einer einzelnen Aktie sprunghaft ändert – wer über einen Kauf
 * nachdenkt, will wissen, ob der morgen ansteht.
 *
 * ## Warum auch dann etwas steht, wenn nichts bekannt ist
 *
 * Weil eine Leerstelle nicht erklärt, was sie bedeutet. Für 711 der 1.029
 * geführten Aktien gibt es keinen Termin, und der Grund liegt an der Quelle
 * und nicht am Unternehmen. Wer auf der Seite von SAP nichts findet, soll
 * lesen, warum – sonst zieht er den falschen Schluss, und zwar still.
 */
export function Quartalstermin({
  befund,
  luecke,
  name,
  quelle,
  className,
}: {
  befund: Quartalsterminbefund | null
  /** Der Satz, warum nichts dasteht – wenn kein Befund vorliegt. */
  luecke: string | null
  name: string
  quelle: { label: string; url: string }
  className?: string
}) {
  if (!befund && !luecke) return null

  return (
    <section aria-labelledby="quartalstermin" className={cn(className)}>
      <h2 id="quartalstermin" className="text-fg text-2xl font-bold">
        Nächste Quartalszahlen
      </h2>

      {befund ? (
        <>
          <div
            className={cn(
              'mt-5 rounded-lg border p-5',
              befund.bald ? 'border-brand bg-brand/5' : 'border-border bg-surface'
            )}
          >
            <p className="text-fg-subtle flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.16em] uppercase">
              <Icon name="calendar" className="size-3.5" aria-hidden="true" />
              erwartet
            </p>
            <p className="text-fg mt-2 text-2xl font-semibold tracking-[-0.02em]">
              {formatDate(befund.erwartet)}
            </p>

            {/*
              Die Uhrzeit steht nur da, wenn zwei Jahre in derselben Lage zur
              Handelssitzung gemeldet haben. Fehlt sie, fehlt sie – eine
              erfundene wäre hier besonders teuer.
            */}
            {befund.uhrzeit && (
              <p className="text-fg-muted mt-1.5 text-sm">{befund.uhrzeit}</p>
            )}

            <p className="text-fg-muted mt-3 text-sm leading-relaxed">
              {tageSatz(befund.inTagen)} Der Tag ist{' '}
              <strong className="text-fg font-semibold">geschätzt</strong>: Er ist aus dem
              bisherigen Meldemuster hochgerechnet, im Vorjahr meldete {name} am{' '}
              {formatDate(befund.basis)}
              {befund.streuungTage >= 2
                ? `, und das Muster schwankte dabei um bis zu ${befund.streuungTage} Tage`
                : ''}
              . Den genauen Termin gibt jedes Unternehmen wenige Wochen vorher selbst
              bekannt.
            </p>
          </div>

          <p className="text-fg-subtle mt-3 text-sm">
            Quelle:{' '}
            <a
              href={quelle.url}
              rel="noopener noreferrer"
              target="_blank"
              className="hover:text-fg underline underline-offset-2"
            >
              {quelle.label}
            </a>{' '}
            · Alle Termine im{' '}
            <Link href="/kalender" className="hover:text-fg underline underline-offset-2">
              Börsenkalender
            </Link>
          </p>
        </>
      ) : (
        <p className="text-fg-muted mt-3 leading-relaxed">
          {luecke}{' '}
          <Link href="/kalender" className="hover:text-fg underline underline-offset-2">
            Der Börsenkalender
          </Link>{' '}
          nennt, für wie viele Titel Termine vorliegen.
        </p>
      )}
    </section>
  )
}

/**
 * Wie weit der Termin weg ist, in Worten.
 *
 * Als Satz und nicht als Zahl im Kasten: „14“ neben einem Datum liest sich wie
 * eine Kennzahl der Aktie. Und der heutige Tag bekommt eigene Worte – „in 0
 * Tagen“ wäre die Sorte Zahl, die eine Maschine ausgibt und ein Mensch nicht
 * sagt.
 */
function tageSatz(inTagen: number): string {
  if (inTagen === 0) return 'Das ist heute.'
  if (inTagen === 1) return 'Das ist morgen.'
  if (inTagen <= 14) return `Das ist in ${inTagen} Tagen.`
  return ''
}
