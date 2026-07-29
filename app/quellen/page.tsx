import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDate } from '@/lib/format'
import { getQuellengruppen, type Quelleneintrag } from '@/lib/quellen'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Quellen: woher die Zahlen kommen'),
  description:
    'Alle Datenquellen dieser Website an einer Stelle: Herkunft, Abgrenzung, Lizenz und Stand des letzten Abrufs für Kurse, Bilanzzahlen, Länderdaten und Karte.',
  path: '/quellen',
  ogTitle: 'Woher die Zahlen kommen',
})

/**
 * Ein Verzeichnis aller Datenquellen.
 *
 * ## Warum es diese Seite gibt
 *
 * Die Frage „woher kommt diese Zahl“ ist auf einer Seite über Geld die erste,
 * die ein aufmerksamer Leser stellt. Beantwortet war sie bisher nur stückweise:
 * ein Satz unter jeder Kurstafel, drei Zeilen unter dem Globus, ein Absatz im
 * Kalender. Wer wissen wollte, worauf das Ganze steht, musste die Website
 * absuchen.
 *
 * ## Was hier steht und was weiterhin am Wert selbst
 *
 * Datenquellen, die für einen ganzen Bereich gelten – die Börsenaufsicht für
 * alle Unternehmenszahlen, die Weltbank für alle Länderdaten – stehen von jetzt
 * an hier. Vorher wiederholte sich derselbe Absatz auf über fünfhundert
 * Aktienseiten.
 *
 * Was **nicht** hierher wandert, ist die Quelle einer einzelnen Meldung. Bei
 * einem Nachrichtenartikel gehört der Beleg unter den Text, weil sich sonst
 * nicht mehr zuordnen lässt, worauf sich ein bestimmter Satz stützt – und weil
 * genau diese Zuordnung eine Zusammenfassung von einer Behauptung unterscheidet.
 */
export default async function QuellenPage() {
  const gruppen = await getQuellengruppen()
  const anzahl = gruppen.reduce((summe, gruppe) => summe + gruppe.eintraege.length, 0)
  const nachLizenz = gruppen
    .flatMap((gruppe) => gruppe.eintraege)
    .filter((eintrag) => eintrag.grund === 'lizenz').length

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Transparenz"
        eyebrowIcon="info"
        title="Woher die Zahlen kommen"
        lead="Diese Website zeigt Kurse, Bilanzzahlen und Länderdaten. Keine davon stammt von uns. Hier steht, wer sie erhoben hat, wann sie zuletzt geholt wurden und was man wissen muss, um sie richtig zu lesen."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Quellen' }]} />}
        meta={
          <>
            <span>{anzahl} Quellen</span>
            <span aria-hidden="true">·</span>
            <span>{nachLizenz} davon mit Namensnennung als Lizenzbedingung</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl min-w-0">
          <div className="fk-card border-brand/30 p-5 sm:p-6">
            <h2 className="text-fg text-lg font-semibold">Drei Grundsätze</h2>
            <ul className="text-fg-muted mt-3 space-y-2 text-sm leading-relaxed">
              <li>
                <strong className="text-fg font-semibold">Nichts wird geschätzt,</strong>{' '}
                ohne dass es danebensteht. Wo eine Zahl gerechnet statt gemessen ist,
                trägt sie diesen Hinweis an Ort und Stelle.
              </li>
              <li>
                <strong className="text-fg font-semibold">
                  Jede Zahl hat ein Datum.
                </strong>{' '}
                Die Website wird statisch gebaut; zwischen zwei Bauläufen steht hier der
                Stand des letzten Abrufs und nicht der von heute.
              </li>
              <li>
                <strong className="text-fg font-semibold">Lücken bleiben Lücken.</strong>{' '}
                Wo es keine belastbare Quelle gibt, steht „keine Angabe“ – und nicht ein
                Wert, der aussieht wie eine Tatsache.
              </li>
            </ul>
          </div>

          {gruppen.map((gruppe) => (
            <section
              key={gruppe.titel}
              aria-labelledby={kennung(gruppe.titel)}
              className="mt-12"
            >
              <h2
                id={kennung(gruppe.titel)}
                className="text-fg text-2xl font-bold tracking-tight"
              >
                {gruppe.titel}
              </h2>
              <p className="text-fg-muted mt-2 leading-relaxed">{gruppe.einleitung}</p>

              <ul className="mt-5 space-y-4">
                {gruppe.eintraege.map((eintrag) => (
                  <li key={`${gruppe.titel}-${eintrag.name}-${eintrag.url}`}>
                    <Eintrag eintrag={eintrag} />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section aria-labelledby="rechtliches" className="mt-14">
            <h2 id="rechtliches" className="text-fg text-2xl font-bold tracking-tight">
              Zur Verwendung
            </h2>
            <p className="text-fg-muted mt-2 leading-relaxed">
              Tatsachen sind nicht urheberrechtlich geschützt, die Formulierung schon.
              Zusammengefasst wird deshalb in eigenen Worten; fremde Texte werden weder im
              Volltext noch in längeren Auszügen gespiegelt, und fremde Bilder werden
              nicht übernommen. Wo eine Lizenz die Namensnennung zur Bedingung macht – bei
              der Weltbank und bei der Kartengeometrie – steht sie oben am Eintrag und
              bleibt dort stehen.
            </p>
            <p className="text-fg-muted mt-3 leading-relaxed">
              Für die Inhalte verlinkter Seiten sind deren Betreiber verantwortlich.
              Nichts auf dieser Website ist Anlageberatung oder eine Empfehlung, ein
              bestimmtes Wertpapier zu kaufen oder zu verkaufen.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}

function kennung(titel: string): string {
  return titel
    .toLowerCase()
    .replace(/[äöü]/g, (z) => ({ ä: 'ae', ö: 'oe', ü: 'ue' })[z] ?? z)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function Eintrag({ eintrag }: { eintrag: Quelleneintrag }) {
  const intern = eintrag.url.startsWith('/')

  return (
    <article className="fk-card p-5">
      <h3 className="text-fg text-base font-semibold">
        <a
          href={eintrag.url}
          {...(intern ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          className="hover:text-brand underline-offset-4 hover:underline"
        >
          {eintrag.name}
        </a>
      </h3>

      {eintrag.verwendung && (
        <p className="text-fg-muted mt-2 text-sm leading-relaxed">{eintrag.verwendung}</p>
      )}

      {eintrag.abgrenzung && (
        <p className="text-fg-subtle mt-2 text-sm leading-relaxed">
          {eintrag.abgrenzung}
        </p>
      )}

      <dl className="text-fg-subtle mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {eintrag.stand && (
          <div className="flex gap-1">
            <dt>Abgerufen:</dt>
            <dd className="text-fg-muted">{formatDate(eintrag.stand)}</dd>
          </div>
        )}
        {eintrag.lizenz && (
          <div className="flex gap-1">
            <dt>Lizenz:</dt>
            <dd className="text-fg-muted">{eintrag.lizenz}</dd>
          </div>
        )}
        {eintrag.grund === 'lizenz' && (
          <div className="text-brand font-semibold">Namensnennung ist Bedingung</div>
        )}
      </dl>
    </article>
  )
}
