import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatDate, formatDateShort, formatNumber } from '@/lib/format'
import { handelsfreieUebersicht, MINDEST_REIHEN } from '@/lib/handelsfreie-uebersicht'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  // 148 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`), und
  // sie ist hart: Die erste Fassung kam auf 163 und brach den Bau.
  title: withBrand('Wann welche Börse geschlossen war'),
  description:
    'An welchen Werktagen des letzten Jahres welcher Handelsplatz zu war – aus den eigenen Kursreihen abgelesen, nicht aus einer Liste abgeschrieben.',
  path: '/maerkte/handelsfreie-tage',
  ogTitle: 'Wann welche Börse geschlossen war',
})

/**
 * Die handelsfreien Tage der geführten Handelsplätze.
 *
 * ## Warum diese Seite anders entstanden ist als geplant
 *
 * Geplant war ein Feiertagskalender aus den Veröffentlichungen der Börsen.
 * Der Weg ist zu: NYSE, Xetra, Euronext und London laden ihre Tabellen per
 * JavaScript nach, SIX und JPX antworten mit 404, die Schnittstelle der Börse
 * Frankfurt gibt `{}` zurück. Geprüft am 17. und 18. August 2026 über einen
 * Läufer mit vollem Netzzugang.
 *
 * Eine Liste aus dem Gedächtnis kam nicht in Frage. Sie behauptet irgendwann
 * „Börse geschlossen" an einem Handelstag, und niemand sieht es.
 *
 * Also andersherum: Die Kursreihen liegen ohnehin vor. Wo an einem Werktag
 * keine einzige Aktie eines Platzes einen Kurs hat, war der Platz zu. Das ist
 * beobachtet statt behauptet – und deckt sich für die geprüften Plätze exakt
 * mit den bekannten Feiertagen.
 *
 * Der Preis steht offen auf der Seite: Das ist die Vergangenheit, kein
 * Kalender für morgen.
 */
export default function HandelsfreieTageSeite() {
  const { von, bis, plaetze } = handelsfreieUebersicht(new Date())

  const ausgewertet = plaetze.filter((eintrag) => eintrag.befund.art === 'ausgewertet')
  const abgewiesen = plaetze.filter((eintrag) => eintrag.befund.art === 'abgewiesen')

  const freieTageGesamt = ausgewertet.reduce(
    (summe, eintrag) =>
      summe +
      (eintrag.befund.art === 'ausgewertet'
        ? eintrag.befund.tage.filter((tag) => tag.art === 'handelsfrei').length
        : 0),
    0
  )

  /*
    Der Platz mit den meisten geschlossenen Tagen. Gerechnet und nicht
    hingeschrieben: Welcher das ist, wechselt mit dem Zeitraum.
  */
  const meiste = [...ausgewertet].sort((a, b) => {
    const zahl = (e: (typeof ausgewertet)[number]) =>
      e.befund.art === 'ausgewertet'
        ? e.befund.tage.filter((t) => t.art === 'handelsfrei').length
        : 0
    return zahl(b) - zahl(a)
  })[0]
  const meisteZahl =
    meiste && meiste.befund.art === 'ausgewertet'
      ? meiste.befund.tage.filter((t) => t.art === 'handelsfrei').length
      : 0

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Märkte"
        eyebrowIcon="chart"
        title="Wann welche Börse geschlossen war"
        lead="Ein Kurs, der einen Tag lang stehenbleibt, ist meistens kein Fehler: Die Börse hatte zu. Diese Seite zeigt, an welchen Werktagen das wo der Fall war – abgelesen aus den Kursreihen, nicht abgeschrieben aus einer Liste."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: 'Handelsfreie Tage' }]}
          />
        }
        meta={
          <>
            <span>
              {formatDateShort(von)} bis {formatDateShort(bis)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatNumber(ausgewertet.length)} Handelsplätze</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <StatGrid columns={3}>
          <Stat
            label="Ausgewertete Plätze"
            value={formatNumber(ausgewertet.length)}
            hint={`Mindestens ${MINDEST_REIHEN} Kursreihen mit vollem Jahrgang. ${formatNumber(abgewiesen.length)} weitere stehen weiter unten, mit Grund.`}
          />
          <Stat
            label="Handelsfreie Werktage"
            value={formatNumber(freieTageGesamt)}
            hint="Über alle Plätze zusammengezählt – ein Feiertag in Tokio und einer in New York sind zwei."
          />
          {meiste ? (
            <Stat
              label="Die meisten Schließtage"
              value={`${meiste.platz.land} ${formatNumber(meisteZahl)}`}
              hint={`${meiste.platz.name}. Wie viele Feiertage eine Börse hat, ist eine Eigenschaft des Landes.`}
            />
          ) : null}
        </StatGrid>

        <Callout variant="info" title="Beobachtet, nicht abgeschrieben">
          <p>
            Diese Tage stehen in keiner Liste, die hier gepflegt wird. Sie sind aus den
            Kursreihen abgelesen: Wo an einem Werktag{' '}
            <strong className="text-fg">keine einzige</strong> Aktie eines Platzes einen
            Kurs hat, war der Platz zu.
          </p>
          <p className="mt-3">
            Der Umweg hat einen Grund. Die veröffentlichten Börsenkalender sind aus
            unserer Bauumgebung nicht erreichbar – NYSE, Xetra, Euronext und London laden
            ihre Tabellen per JavaScript nach, SIX und JPX antworten mit 404. Eine
            Feiertagsliste aus dem Gedächtnis zu schreiben wäre der bequeme Weg gewesen
            und der falsche: Ein einziges falsches Datum behauptet „Börse geschlossen“ an
            einem Handelstag, und niemand sieht es.
          </p>
          <p className="mt-3">
            Dafür gilt jede Zeile hier nur für die{' '}
            <strong className="text-fg">Vergangenheit</strong>. Ob die Börse am kommenden
            Montag offen ist, steht hier nicht – das wüsste nur der veröffentlichte
            Kalender.
          </p>
        </Callout>

        {/* ------------------------------------------------ Die Plätze */}

        <div className="mt-10 space-y-4">
          {ausgewertet.map(({ platz, befund }) => {
            if (befund.art !== 'ausgewertet') return null
            const frei = befund.tage.filter((tag) => tag.art === 'handelsfrei')
            const unklar = befund.tage.filter((tag) => tag.art === 'unklar')
            return (
              <div key={platz.kuerzel} className="fk-card p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="text-fg text-base font-semibold">
                    {platz.name}
                    <span className="text-fg-subtle ml-2 text-sm font-normal">
                      {platz.land}
                    </span>
                  </h2>
                  <p className="text-fg-muted text-sm tabular-nums">
                    {formatNumber(frei.length)} von {formatNumber(befund.werktage)}{' '}
                    Werktagen geschlossen
                    <span className="text-fg-subtle">
                      {' '}
                      · {formatNumber(befund.reihen)} Kursreihen geprüft
                    </span>
                  </p>
                </div>

                {frei.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-sm tabular-nums">
                    {frei.map((tag) => (
                      <li
                        key={tag.tag}
                        className="border-border text-fg-muted rounded-md border px-2 py-0.5"
                      >
                        {formatDate(tag.tag)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-fg-muted mt-3 text-sm">
                    Kein Werktag ohne Kurs im Zeitraum.
                  </p>
                )}

                {/*
                  Die unklaren Tage stehen dabei, statt weggelassen zu werden.

                  In Toronto sind es fünf: An kanadischen Feiertagen tragen die
                  Titel, die auch in New York notieren, trotzdem einen Kurs. Sie
                  als Feiertag zu zählen wäre falsch, sie zu verschweigen wäre
                  eine Lücke – also stehen sie mit ihrer Zahl da.
                */}
                {unklar.length > 0 ? (
                  <details className="mt-3">
                    <summary className="text-fg-muted hover:text-markets cursor-pointer text-sm">
                      {formatNumber(unklar.length)} Tage, an denen nur ein Teil der Reihen
                      einen Kurs hat
                    </summary>
                    <ul className="text-fg-subtle mt-2 space-y-1 text-sm tabular-nums">
                      {unklar.map((tag) => (
                        <li key={tag.tag}>
                          {formatDate(tag.tag)} – {formatNumber(tag.mitKurs)} von{' '}
                          {formatNumber(tag.geprueft)} Reihen mit Kurs
                        </li>
                      ))}
                    </ul>
                    <p className="text-fg-subtle mt-2 text-sm leading-relaxed">
                      Das ist kein Feiertag, sondern meistens eine Zweitnotierung: Ein
                      Titel, der auch an einer anderen Börse gehandelt wird, bekommt von
                      dort einen Kurs. Solche Tage werden deshalb nicht mitgezählt.
                    </p>
                  </details>
                ) : null}
              </div>
            )
          })}
        </div>

        {/* -------------------------------- Die Plätze, die nicht gehen */}

        {abgewiesen.length > 0 ? (
          <Callout
            variant="warning"
            title={`${formatNumber(abgewiesen.length)} Plätze werden nicht ausgewertet`}
          >
            <p>
              Sie fehlen nicht stillschweigend – hier steht, warum. Ein Platz, der
              kommentarlos verschwindet, ist eine Lücke, die niemand bemerkt.
            </p>
            <ul className="mt-3 space-y-2">
              {abgewiesen.map(({ platz, befund }) =>
                befund.art === 'abgewiesen' ? (
                  <li key={platz.kuerzel}>
                    <strong className="text-fg">{platz.name}</strong> ({platz.land}):{' '}
                    {befund.erlaeuterung}
                  </li>
                ) : null
              )}
            </ul>
            <p className="mt-3">
              „Das Datum ist verschoben“ heißt: Die Kurstage verteilen sich nicht
              gleichmäßig über die Handelswoche. Bei Sydney standen 26 Freitagen 25
              Sonntage gegenüber – dort rutschen Freitagssitzungen in der Quelle auf das
              Wochenende. Ein Feiertagsbefund daraus wäre zur Hälfte erfunden gewesen.
            </p>
          </Callout>
        ) : null}

        <div className="text-fg-muted mt-12 max-w-3xl space-y-4 text-sm leading-relaxed">
          <p>
            <strong className="text-fg">Wie das gerechnet wird:</strong> Für jeden
            Handelsplatz werden alle Aktien mit vollem Jahrgang genommen – mindestens{' '}
            {formatNumber(MINDEST_REIHEN)} Reihen, sonst sähe ein einzelner Datenausfall
            aus wie ein Feiertag. Ein Werktag zwischen {formatDate(von)} und{' '}
            {formatDate(bis)} gilt als handelsfrei, wenn keine dieser Reihen einen Kurs
            trägt. Die Kurse selbst kommen aus derselben Quelle wie überall auf dieser
            Website.
          </p>
          <p>
            Wann die Börsen an einem Handelstag geöffnet sind, steht auf den{' '}
            <Link
              href="/maerkte"
              className="hover:text-markets underline underline-offset-2"
            >
              Marktseiten
            </Link>{' '}
            beim jeweiligen Wert. Warum ein Kurs auch innerhalb der Handelszeit
            stehenbleiben kann, erklärt das Lernthema{' '}
            <Link
              href="/lernen/aktie"
              className="hover:text-markets underline underline-offset-2"
            >
              Aktie
            </Link>
            .
          </p>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Wann welche Börse geschlossen war',
          description:
            'Handelsfreie Werktage der geführten Handelsplätze, aus den Kursreihen abgelesen.',
          path: '/maerkte/handelsfreie-tage',
          items: ausgewertet.map(({ platz }) => ({
            name: platz.name,
            path: '/maerkte/handelsfreie-tage',
          })),
        })}
      />
    </>
  )
}
