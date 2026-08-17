import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { laendernamen } from '@/data/laender/namen'
import {
  aktienGesamt,
  fehlendeNachLand,
  fundamentalAbdeckung,
  quellenlage,
} from '@/lib/abdeckung'
import { getDividendenAbdeckung } from '@/lib/dividendentermine'
import { formatDate, formatPercent } from '@/lib/format'
import { getQuartalsterminAbdeckung } from '@/lib/quartalstermine'
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
/**
 * Die Abdeckung, aus denselben Beständen gezählt, aus denen die Seiten lesen.
 *
 * Abgeleitet und nicht abgetippt: Eine hier eingetragene Prozentzahl wäre nach
 * dem nächsten Datenlauf falsch, ohne dass es jemandem auffiele.
 */
async function baueAbdeckung() {
  const gesamt = aktienGesamt()
  const fundamental = fundamentalAbdeckung()
  const dividenden = getDividendenAbdeckung()
  const quartale = getQuartalsterminAbdeckung()

  return {
    aktien: gesamt,
    felder: [
      {
        feld: 'Kursverlauf',
        belegt: gesamt,
        gesamt,
        erlaeuterung:
          'Jede geführte Aktie – ohne Kursreihe stünde sie gar nicht erst im Katalog.',
      },
      {
        feld: 'Dividendenhistorie',
        belegt: dividenden.mitZahlungen,
        gesamt: dividenden.aktien,
        erlaeuterung:
          'Wo keine steht, zahlt das Unternehmen entweder nichts oder die Quelle meldet es nicht.',
      },
      {
        feld: 'Unternehmenszahlen',
        belegt: fundamental.belegt,
        gesamt: fundamental.gesamt,
        erlaeuterung:
          'Umsatz, Gewinn, Eigenkapital und Aktienzahl aus den Pflichtmeldungen der Börsenaufsichten.',
      },
      {
        feld: 'Quartalstermine',
        belegt: quartale.unternehmen,
        gesamt: quartale.aktienGesamt,
        erlaeuterung:
          'Aus dem bisherigen Meldemuster abgeleitet – möglich nur, wo es überhaupt veröffentlichte Meldungen gibt.',
      },
    ],
    fehlend: fehlendeNachLand(laendernamen).slice(0, 10),
  }
}

export default async function QuellenPage() {
  const gruppen = await getQuellengruppen()
  const abdeckung = await baueAbdeckung()
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
        /*
          Der Verweis auf die Methoden gehört in den Kopf und nicht ans Ende.

          „Woher" und „wie" sind zwei Hälften derselben Frage, und wer hier
          landet, hat oft die andere gemeint. Ganz unten fände er sie erst nach
          fünf Bildschirmhöhen Quellenliste.
        */
        meta={
          <>
            <span>{anzahl} Quellen</span>
            <span aria-hidden="true">·</span>
            <span>{nachLizenz} davon mit Namensnennung als Lizenzbedingung</span>
            <span aria-hidden="true">·</span>
            <Link href="/methoden" className="underline underline-offset-2">
              Wie daraus eine Kennzahl wird
            </Link>
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

          {/*
            Die Abdeckung – wie vollständig die Daten tatsächlich sind.

            Sie gehört auf diese Seite und nirgendwo sonst hin: Wer sagt, woher
            seine Zahlen kommen, sollte auch sagen, zu wie vielen Titeln er
            keine hat. Bis Juli 2026 stand diese Auskunft ausschließlich im
            Projektverzeichnis, also an einem Ort, den ein Besucher nicht
            erreicht.
          */}
          <section aria-labelledby="abdeckung" className="mt-14">
            <h2 id="abdeckung" className="text-fg text-2xl font-bold tracking-tight">
              Wie vollständig diese Daten sind
            </h2>
            <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
              Nicht jede der {abdeckung.aktien} geführten Aktien hat jede Angabe. Die
              Lücke ist keine gleichmäßige Ausdünnung, sondern hängt an den Meldepflichten
              einzelner Länder – und deshalb steht hier, wo sie sitzt.
            </p>

            <dl className="border-border mt-6 border-t">
              {abdeckung.felder.map((feld) => (
                <div
                  key={feld.feld}
                  className="border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-3"
                >
                  <dt className="text-fg text-sm font-medium">
                    {feld.feld}
                    <span className="text-fg-subtle block text-xs font-normal">
                      {feld.erlaeuterung}
                    </span>
                  </dt>
                  <dd className="text-fg font-medium tabular-nums">
                    {feld.belegt} von {feld.gesamt}
                    <span className="text-fg-subtle ml-2 text-sm font-normal">
                      {formatPercent((feld.belegt / feld.gesamt) * 100, 0)}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <h3 className="text-fg mt-8 text-base font-semibold">
              Wo die Unternehmenszahlen fehlen
            </h3>
            <p className="text-fg-muted mt-1 max-w-2xl text-sm leading-relaxed">
              Die zehn größten Blöcke, nach Sitzland des Unternehmens. Dahinter steht,
              woran es liegt – meistens an einer Meldepflicht, die es nicht gibt, oder an
              einer Quelle, die einen Zugangsschlüssel verlangt.
            </p>
            <ul className="border-border mt-3 border-t text-sm">
              {abdeckung.fehlend.map((eintrag) => (
                <li
                  key={eintrag.land}
                  className="border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b py-2.5"
                >
                  <span className="text-fg font-medium">
                    {eintrag.land}
                    <span className="text-fg-subtle ml-2 font-normal">
                      {quellenlage[eintrag.land] ?? 'nicht untersucht'}
                    </span>
                  </span>
                  <span className="text-fg-muted tabular-nums">{eintrag.anzahl}</span>
                </li>
              ))}
            </ul>
          </section>

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
