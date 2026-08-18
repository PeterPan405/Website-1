import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  ARTEN,
  dauerText,
  erholungsbefund,
  nachJahrhundert,
  zeitstrahl,
  type Zeitpunkt,
} from '@/lib/finanzgeschichte'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  // 155 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`).
  title: withBrand('Zeitstrahl der Finanzgeschichte'),
  description:
    'Von der Bank of England 1694 bis zur Vorabpauschale: Währungsordnungen, Notenbanken und Kurseinbrüche – mit der Dauer bis zur Erholung, nicht nur der Falltiefe.',
  path: '/zeitstrahl',
  ogTitle: 'Zeitstrahl der Finanzgeschichte',
})

/**
 * Der Zeitstrahl – und wozu er da ist.
 *
 * ## Die Aussage
 *
 * **Nicht die Falltiefe zählt, sondern die Erholungsdauer.** Das steht nicht
 * als Meinung da: `erholungsbefund()` wertet `data/crashes.ts` aus, und
 * `tests/finanzgeschichte.test.ts` beanstandet die Seite, wenn die Auswertung
 * die Aussage nicht mehr trägt.
 *
 * Der stärkste Beleg ist ein Paar: Zwei Einbrüche mit **derselben** Falltiefe
 * und ungleicher Dauer. Wenn identische Tiefe zu unterschiedlicher Erholung
 * führt, kann die Tiefe die Dauer nicht bestimmen.
 *
 * ## Warum Datum und Näherung verschieden aussehen
 *
 * Ein Vertragstag ist nachprüfbar, eine Erholungsdauer nicht – bei 1929 liegen
 * die gängigen Angaben zwischen gut fünfzehn und über fünfundzwanzig Jahren.
 * Beides gleich zu setzen wäre die stille Behauptung, beides sei gleich sicher.
 * Deshalb trägt jeder Punkt seine Genauigkeit sichtbar mit.
 */
export default function ZeitstrahlSeite() {
  const punkte = zeitstrahl()
  const abschnitte = nachJahrhundert(punkte)
  const befund = erholungsbefund()

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Geschichte"
        eyebrowIcon="info"
        title="Zeitstrahl der Finanzgeschichte"
        lead="Wovon das Geld gedeckt war, wer darüber entschied – und was passierte, wenn die Kurse fielen."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Zeitstrahl' }]} />}
        meta={
          <>
            <span>{punkte.length} Punkte</span>
            <span aria-hidden="true">·</span>
            <span>
              {punkte[0]?.jahr} bis {punkte[punkte.length - 1]?.jahr}
            </span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {befund && (
          <Callout variant="info" title="Die Zahl, die zählt, ist die Dauer">
            <p>
              Der tiefste Einbruch dieser Liste ist{' '}
              <strong>{befund.tiefster.name}</strong> mit{' '}
              {befund.tiefster.rueckgangProzent} Prozent. Der <em>schnellste erholt</em>{' '}
              war <strong>{befund.schnellster.name}</strong> – nach{' '}
              {dauerText(befund.schnellster.erholungJahre)}, bei{' '}
              {befund.schnellster.rueckgangProzent} Prozent Rückgang.
            </p>
            {befund.gleicheTiefe && (
              <p className="mt-3">
                Am deutlichsten wird es an zwei Fällen mit{' '}
                <strong>derselben Falltiefe</strong>: {befund.gleicheTiefe.a.name} und{' '}
                {befund.gleicheTiefe.b.name} fielen beide um{' '}
                {befund.gleicheTiefe.a.rueckgangProzent} Prozent – der eine brauchte{' '}
                {dauerText(befund.gleicheTiefe.a.erholungJahre)}, der andere{' '}
                {dauerText(befund.gleicheTiefe.b.erholungJahre)}. Wenn gleiche Tiefe zu
                ungleicher Dauer führt, kann die Tiefe die Dauer nicht bestimmen.
              </p>
            )}
            <p className="mt-3">
              Für einen Anleger ist das der ganze Unterschied: Die Falltiefe steht in der
              Schlagzeile, die Dauer entscheidet, ob man sie aussitzen kann.
            </p>
          </Callout>
        )}

        {/*
          Die Legende steht vor dem Strahl, nicht darunter.

          Vier Arten, die sich in der Anzeige nur durch eine Beschriftung
          unterscheiden – wer sie erst hinterher erklärt bekommt, hat den
          halben Strahl ohne Ordnung gelesen.
        */}
        <dl className="mt-10 grid gap-4 text-sm sm:grid-cols-2">
          {ARTEN.map((art) => (
            <div key={art.id} className="border-border rounded-lg border p-4">
              <dt className="text-fg font-semibold">{art.label}</dt>
              <dd className="text-fg-muted mt-1 leading-relaxed">{art.beschreibung}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 space-y-14">
          {abschnitte.map((abschnitt) => (
            <section
              key={abschnitt.jahrhundert}
              aria-labelledby={`jh-${abschnitt.jahrhundert}`}
            >
              <h2
                id={`jh-${abschnitt.jahrhundert}`}
                className="text-fg-subtle border-border border-b pb-2 text-sm font-semibold tracking-wide uppercase"
              >
                {abschnitt.label}
              </h2>

              {/*
                Eine Liste, kein Diagramm.

                Die Abstände zwischen den Jahren sind hier ungleich – 1694 bis
                1792 und 1998 bis 1999 liegen auf demselben Strahl. Maßstäblich
                gezeichnet wäre der letzte Meter ein Gedränge und der erste
                leer; die Aussage liegt in der Reihenfolge, nicht im Abstand.
              */}
              <ol className="border-border/60 mt-6 space-y-8 border-l pl-6">
                {abschnitt.punkte.map((punkt) => (
                  <PunktBlock key={punkt.id} punkt={punkt} />
                ))}
              </ol>
            </section>
          ))}
        </div>

        <p className="text-fg-subtle mt-16 max-w-3xl text-sm leading-relaxed">
          Auf diesem Strahl stehen keine Geldmengen, Kursstände oder Inflationsraten
          historischer Jahre. Aufgenommen ist, was sich an einem Vorgang festmachen lässt
          – eine Gründung, ein Gesetz, ein Vertrag. Alles andere wäre erinnert, und eine
          erinnerte Zahl sieht genauso aus wie eine nachgeschlagene.{' '}
          <Link href="/quellen" className="underline underline-offset-2">
            Woher die Zahlen dieser Website kommen
          </Link>
          .
        </p>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Zeitstrahl der Finanzgeschichte',
          description:
            'Währungsordnungen, Notenbanken und Kurseinbrüche in zeitlicher Folge – mit der Dauer bis zur Erholung.',
          path: '/zeitstrahl',
          items: punkte.map((punkt) => ({
            name: `${punkt.jahr}: ${punkt.titel}`,
            path: `/zeitstrahl#${punkt.id}`,
          })),
        })}
      />
    </>
  )
}

function PunktBlock({ punkt }: { punkt: Zeitpunkt }) {
  const art = ARTEN.find((eintrag) => eintrag.id === punkt.art)

  return (
    <li id={punkt.id} className="relative">
      {/* Der Punkt auf der Linie – rein dekorativ, die Ordnung trägt die Liste. */}
      <span
        aria-hidden="true"
        className="bg-brand absolute top-2 -left-[1.9rem] h-2.5 w-2.5 rounded-full"
      />

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-fg text-lg font-bold tabular-nums">
          {punkt.tag ?? punkt.jahr}
        </span>
        <span className="text-fg-subtle border-border rounded-full border px-2 py-0.5 text-xs">
          {art?.label ?? punkt.art}
        </span>
        {/*
          Die Genauigkeit steht am Punkt und nicht in einer Fußnote.

          Ein Vertragstag und eine Erholungsdauer sind nicht gleich sicher.
          Wer das nur einmal am Seitenende sagt, hat es für die dreißig
          Zeilen dazwischen nicht gesagt.
        */}
        <span className="text-fg-subtle text-xs">
          {punkt.genauigkeit === 'datum' ? 'nachprüfbares Datum' : 'Größenordnung'}
        </span>
      </div>

      <h3 className="text-fg mt-1 text-xl font-semibold">{punkt.titel}</h3>

      {punkt.einbruch && (
        <p className="text-fg-muted mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <span>
            Rückgang{' '}
            <strong className="text-fg tabular-nums">
              {punkt.einbruch.rueckgangProzent} %
            </strong>
          </span>
          <span>
            Erholung nach{' '}
            <strong className="text-fg">{dauerText(punkt.einbruch.erholungJahre)}</strong>
          </span>
        </p>
      )}

      <p className="text-fg-muted mt-3 max-w-3xl leading-relaxed">{punkt.was}</p>

      <p className="border-brand/40 text-fg-muted mt-3 max-w-3xl border-l-2 pl-4 text-sm leading-relaxed">
        <strong className="text-fg font-semibold">Was man mitnimmt:</strong> {punkt.lehre}
      </p>

      {punkt.glossar && punkt.glossar.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {punkt.glossar.map((slug) => (
            <Link
              key={slug}
              href={`/glossar#${slug}`}
              className="text-fg-subtle hover:text-fg underline underline-offset-2"
            >
              {slug}
            </Link>
          ))}
        </p>
      )}
    </li>
  )
}
