import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Stimmungsverlauf } from '@/components/markets/Stimmungsverlauf'
import { Tacho } from '@/components/markets/Tacho'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Datenstandsampel } from '@/components/ui/Datenstandsampel'
import { taktErwartung } from '@/lib/datenstand'
import { formatDate } from '@/lib/format'
import {
  getStimmungsverlauf,
  STIMMUNG_SEITEN,
  STUFEN_TEXT,
  type Marktbereich,
} from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Angst und Gier ausführlich – die Seite hinter der Kachel.
 *
 * ## Was sie beantwortet, das die Kachel nicht kann
 *
 * Drei Fragen. Erstens: Ist der Stand hoch oder niedrig? Das entscheidet sich
 * am Vergleich mit den Wochen davor, nicht an der Zahl. Zweitens: Woraus
 * entsteht er? Auf der Kachel steht nur, welche Bestandteile es gibt, hier
 * steht jeder einzeln mit seinem Wert und seiner Messung. Drittens: Was ist er
 * nicht? Solche Anzeigen werden regelmäßig als Kaufsignal gelesen, und das sind
 * sie nicht.
 *
 * ## Warum es zwei Seiten sind und nicht eine mit Umschalter
 *
 * Aktien und Kryptowährungen werden nach verschiedenen Maßstäben gerechnet –
 * zehn Prozent über dem Halbjahrestrend sind bei einem Aktienindex viel und bei
 * Bitcoin ein ruhiger Monat. Zwei Adressen machen sichtbar, dass es zwei
 * Messungen sind, und sie lassen sich einzeln verlinken.
 */

/* Die Texte liegen in `lib/markets.ts` – der Suchindex braucht sie ebenfalls. */
const BEREICHE = STIMMUNG_SEITEN

type SeitenProps = { params: Promise<{ bereich: string }> }

export function generateStaticParams() {
  return Object.keys(BEREICHE).map((bereich) => ({ bereich }))
}

function istBereich(wert: string): wert is Marktbereich {
  return wert in BEREICHE
}

export async function generateMetadata({ params }: SeitenProps): Promise<Metadata> {
  const { bereich } = await params
  if (!istBereich(bereich)) {
    return buildMetadata({
      title: withBrand('Seite nicht gefunden'),
      description: 'Diese Stimmungsanzeige gibt es nicht.',
      path: `/maerkte/stimmung/${bereich}`,
      noIndex: true,
    })
  }
  const meta = BEREICHE[bereich]
  return buildMetadata({
    title: `${meta.titel}: Stand, Verlauf und Rechenweg`,
    description: meta.beschreibung,
    path: `/maerkte/stimmung/${bereich}`,
    ogTitle: meta.titel,
  })
}

export default async function StimmungsSeite({ params }: SeitenProps) {
  const { bereich } = await params
  if (!istBereich(bereich)) notFound()

  const verlauf = await getStimmungsverlauf(bereich)
  /*
    Kein Wert, keine Seite.

    Die Stimmung entfällt, wenn zu wenige Reihen echte Kurse haben. Eine Seite
    mit einer erfundenen 50 wäre schlimmer als gar keine – sie sähe aus wie ein
    neutraler Markt und wäre in Wahrheit Datenmangel.
  */
  if (!verlauf) notFound()

  const meta = BEREICHE[bereich]
  const { jetzt } = verlauf
  const stufentext = STUFEN_TEXT[jetzt.stufe]
  const anderer: Marktbereich = bereich === 'aktien' ? 'krypto' : 'aktien'

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Marktstimmung"
        title={meta.titel}
        lead={meta.lead}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Märkte', path: '/maerkte' },
              {
                name: `Angst und Gier – ${meta.kurz}`,
                path: `/maerkte/stimmung/${bereich}`,
              },
            ]}
          />
        }
        meta={<span>Stand {formatDate(verlauf.stand)}</span>}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* ------------------------------------------------ Stand und Verlauf */}
          <div className="min-w-0 space-y-8">
            <section className="fk-card p-6 sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10">
                <Tacho stimmung={jetzt} className="h-auto w-[230px] shrink-0" mitSkala />
                <div className="min-w-0">
                  <h2 className="text-fg text-2xl font-bold">
                    {jetzt.wert} von 100 – {stufentext}
                  </h2>
                  <p className="text-fg-muted mt-3 leading-relaxed">
                    Gerechnet am {verlauf.leitkurs.name} als Leitkurs, die Marktbreite aus{' '}
                    {verlauf.einzelwerte} Einzelreihen mit echten Kursen. Null bedeutet
                    größtmögliche Angst, hundert größtmögliche Gier; die Grenzen zwischen
                    den Stufen sind Konvention, keine Messgröße.
                  </p>
                  {/*
                    Der Stand stand bisher nur als Datum im Seitenkopf.

                    Bei einer Zahl, die jeden Handelstag neu entsteht, ist ein
                    Datum ohne Einordnung wertlos: Wer den Takt nicht kennt,
                    weiß nicht, ob der 12. August alt ist. Die Ampel rechnet im
                    Browser und kann deshalb auch dann anschlagen, wenn diese
                    Seite seit Tagen unverändert ausgeliefert wird.
                  */}
                  <Datenstandsampel
                    className="mt-4"
                    stand={verlauf.stand}
                    erwartung={taktErwartung('an jedem Handelstag einen neuen Stand', 1)}
                  />
                </div>
              </div>
            </section>

            <section className="fk-card p-6 sm:p-8">
              <h2 className="text-fg text-xl font-bold">Wie es vorher aussah</h2>
              <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                Derselbe Index, gerechnet auf frühere Handelstage. Nicht nachgeschlagen,
                sondern neu gerechnet – mit denselben Kursreihen, jeweils am Stichtag
                abgeschnitten.
              </p>
              <div className="mt-5">
                <Stimmungsverlauf staende={verlauf.frueher} />
              </div>
            </section>

            <section className="fk-card p-6 sm:p-8">
              <h2 className="text-fg text-xl font-bold">Woraus die Zahl entsteht</h2>
              <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                Jeder Bestandteil ergibt für sich eine Zahl von 0 bis 100, das Ergebnis
                ist ihr Mittel. Fehlt einer, zählt er nicht mit, statt mit einem
                geschätzten Wert einzugehen.
              </p>

              <ul className="mt-6 space-y-5">
                {jetzt.bestandteile.map((teil) => (
                  <li key={teil.label}>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-fg font-semibold">{teil.label}</h3>
                      <span className="text-fg tabular-nums">
                        {Math.round(teil.wert)}
                      </span>
                    </div>
                    {/* Der Balken wiederholt die Zahl daneben – er ist Beiwerk und
                        deshalb aria-hidden, nicht zusätzlich beschriftet. */}
                    <div
                      className="bg-surface-muted mt-2 h-1.5 overflow-hidden rounded-full"
                      aria-hidden="true"
                    >
                      <div
                        className="bg-brand h-full rounded-full"
                        style={{ width: `${Math.round(teil.wert)}%` }}
                      />
                    </div>
                    <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                      {teil.erklaerung}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ------------------------------------------------------- Seitenspalte */}
          <aside className="min-w-0 space-y-6">
            <section className="fk-card p-6">
              <h2 className="text-fg text-lg font-bold">Was das nicht ist</h2>
              <ul className="text-fg-muted mt-3 space-y-3 text-sm leading-relaxed">
                <li>
                  <strong className="text-fg">Kein Kaufsignal.</strong> Der Wert
                  beschreibt eine Marktlage, die es schon gibt. Dass sie extrem ist, sagt
                  nichts darüber, wann sie endet – Märkte können lange ängstlich bleiben
                  und noch länger gierig.
                </li>
                <li>
                  <strong className="text-fg">Keine Prognose.</strong> In die Rechnung
                  geht ausschließlich Vergangenes ein: Kurse bis zum letzten Handelstag.
                  Etwas anderes wäre auch nicht nachprüfbar.
                </li>
                <li>
                  <strong className="text-fg">Keine fremde Zahl.</strong> Der bekannteste
                  Index dieser Art hat keine offene Schnittstelle. Hier wird deshalb
                  selbst gerechnet, aus den Kursen dieser Seite, nach dem Verfahren, das
                  oben steht.
                </li>
              </ul>
            </section>

            <section className="fk-card p-6">
              <h2 className="text-fg text-lg font-bold">Der andere Markt</h2>
              <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                Dasselbe Verfahren, anderer Maßstab: Zehn Prozent über dem Halbjahrestrend
                sind bei einem Aktienindex viel und bei Bitcoin ein ruhiger Monat.
              </p>
              <Link
                href={`/maerkte/stimmung/${anderer}`}
                className="text-brand mt-3 inline-block text-sm font-semibold hover:underline"
              >
                Zu {BEREICHE[anderer].titel}
              </Link>
            </section>

            <section className="fk-card p-6">
              <h2 className="text-fg text-lg font-bold">Dazu passend</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    href="/lernen/anlegerpsychologie/beginner"
                    className="text-brand hover:underline"
                  >
                    Warum Anleger im Rückgang verkaufen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lernen/wann-kaufen-verkaufen/beginner"
                    className="text-brand hover:underline"
                  >
                    Wann Kaufen und Verkaufen sinnvoll ist
                  </Link>
                </li>
                <li>
                  <Link href="/maerkte" className="text-brand hover:underline">
                    Zurück zur Marktübersicht
                  </Link>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}
