import Link from 'next/link'

import { brancheSlug } from '@/lib/branchen'
import type { Branchenvergleich, Vergleichszahl } from '@/lib/branchenvergleich'
import { cn } from '@/lib/cn'
import { formatNumber, formatPercentSigned } from '@/lib/format'

/**
 * Die drei Kennzahlen des Titels neben dem Median seiner Branche.
 *
 * Der Vergleich ersetzt die Frage „Ist ein KGV von 30 viel?“ durch die
 * beantwortbare Frage „Ist es in dieser Branche viel?“. Mehr behauptet die
 * Tafel nicht: Der Platz ist eine Sortierung nach Höhe, keine Note – ob ein
 * hohes KGV teuer oder verdient ist, entscheidet keine Tabelle. Die
 * Vorbehalte (Jahreszahlen verschiedener Stichtage, Median statt Schnitt)
 * stehen sichtbar darunter, nicht in einer Fußnote.
 */

function Zeile({
  name,
  zahl,
  einheit,
  erklaerung,
}: {
  name: string
  zahl: Vergleichszahl
  einheit: 'faktor' | 'prozent'
  erklaerung: string
}) {
  const zeige = (wert: number | null) =>
    wert === null
      ? '–'
      : einheit === 'prozent'
        ? formatPercentSigned(wert)
        : formatNumber(wert, 1)

  return (
    <tr className="border-border border-b">
      <th scope="row" className="py-2.5 pr-4 text-left align-top">
        <span className="text-fg font-medium">{name}</span>
        <span className="text-fg-subtle mt-0.5 block text-xs font-normal">
          {erklaerung}
        </span>
      </th>
      <td
        className={cn(
          'py-2.5 pr-4 text-right align-top font-semibold tabular-nums',
          zahl.eigener === null ? 'text-fg-subtle' : 'text-fg'
        )}
      >
        {zeige(zahl.eigener)}
      </td>
      <td className="text-fg-muted py-2.5 pr-4 text-right align-top tabular-nums">
        {zeige(zahl.median)}
      </td>
      <td className="text-fg-subtle py-2.5 text-right align-top text-xs tabular-nums">
        {zahl.platz ? `${zahl.platz.platz} von ${zahl.platz.von}` : '–'}
      </td>
    </tr>
  )
}

export function Branchenvergleichstafel({
  vergleich,
  name,
  className,
}: {
  vergleich: Branchenvergleich
  name: string
  className?: string
}) {
  return (
    <section aria-labelledby="branchenvergleich" className={className}>
      <h2 id="branchenvergleich" className="text-fg text-2xl font-bold">
        Im Branchenvergleich
      </h2>
      <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
        Ob eine Kennzahl viel oder wenig ist, hängt an der Branche: Acht Prozent
        Nettomarge sind im Handel stark und in der Software schwach. Hier steht {name}{' '}
        neben dem Median der Branche{' '}
        <Link
          href={`/maerkte/branchen/${brancheSlug(vergleich.branche)}`}
          className="text-markets underline underline-offset-4"
        >
          {vergleich.branche}
        </Link>{' '}
        ({vergleich.titelMitZahlen} Titel mit gemeldeten Zahlen).
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] text-sm">
          <thead>
            <tr className="border-border text-fg-subtle border-b text-left text-xs uppercase">
              <th scope="col" className="py-2 pr-4 font-medium">
                Kennzahl
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-medium">
                Dieser Titel
              </th>
              <th scope="col" className="py-2 pr-4 text-right font-medium">
                Branchen-Median
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                Platz nach Höhe
              </th>
            </tr>
          </thead>
          <tbody>
            <Zeile
              name="Kurs-Gewinn-Verhältnis"
              zahl={vergleich.kgv}
              einheit="faktor"
              erklaerung="Was der Markt je Einheit Jahresgewinn bezahlt. Fehlt bei Verlust."
            />
            <Zeile
              name="Nettomarge"
              zahl={vergleich.nettomarge}
              einheit="prozent"
              erklaerung="Gewinn geteilt durch Umsatz – was vom Umsatz übrig bleibt."
            />
            <Zeile
              name="Eigenkapitalrendite"
              zahl={vergleich.ekRendite}
              einheit="prozent"
              erklaerung="Gewinn geteilt durch Eigenkapital – was das Kapital verdient."
            />
          </tbody>
        </table>
      </div>

      <p className="text-fg-subtle mt-3 max-w-2xl text-xs leading-relaxed">
        Grundlage sind die zuletzt gemeldeten Jahreszahlen – die Geschäftsjahre der
        Branche enden nicht am selben Tag. Verglichen wird gegen den Median, weil ein
        einziger Ausreißer jeden Durchschnitt regiert. „Platz nach Höhe“ ist eine
        Sortierung, keine Empfehlung: Ein hohes KGV kann teuer bezahlt oder gut begründet
        sein – das steht in keiner Tabelle.
      </p>
      {/*
        Der Absprung in die Rückwärtsrechnung – nur, wenn es ein KGV gibt.
        Die Raute trägt den Wert, damit der Rechner mit genau dieser Aktie
        öffnet; sie geht nicht an den Server (siehe lib/rechner-vorbelegung).
      */}
      {vergleich.kgv.eigener !== null && (
        <p className="mt-4">
          <Link
            href={`/rechner/bewertungsrechner#kgv=${vergleich.kgv.eigener.toFixed(1)}`}
            className="fk-btn-secondary text-sm"
          >
            Was bezahlt dieses KGV? Im Bewertungsrechner nachrechnen
          </Link>
        </p>
      )}
    </section>
  )
}
