import type { Metadata } from 'next'

import { DebtComparison } from '@/components/debt/DebtComparison'
import { JsonLd } from '@/components/seo/JsonLd'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import { datasetSchema } from '@/lib/jsonld'
import {
  DEBT_EUR_USD,
  DEBT_QUELLEN,
  getCountryDebts,
  getDebtRegions,
  getDebtSummary,
} from '@/lib/debt'
import { getTopicsBySlugs } from '@/lib/learn'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Staatsverschuldung im Ländervergleich'),
  description:
    'Schulden absolut, pro Kopf und in Prozent des BIP – für alle Länder mit belegten Zahlen, sortierbar und filterbar, mit Erklärung zur Aussagekraft der Quote.',
  path: '/staatsverschuldung',
  ogTitle: 'Staatsverschuldung im Ländervergleich',
})

export default async function DebtPage() {
  const [countries, regions, summary, relatedTopics] = await Promise.all([
    getCountryDebts(),
    getDebtRegions(),
    getDebtSummary(),
    getTopicsBySlugs([
      'staatsanleihe',
      'schuldverschreibung',
      'wie-funktioniert-der-markt',
    ]),
  ])

  return (
    <>
      <PageHeader
        area="debt"
        eyebrow="Staatsverschuldung"
        eyebrowIcon="scale"
        title="Wie hoch sind Staatsschulden wirklich?"
        lead="Absolute Milliardenbeträge beeindrucken, sagen aber wenig. Erst im Verhältnis zur Wirtschaftsleistung und zur Einwohnerzahl wird ein Vergleich möglich – und selbst dann bleiben Fallstricke."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Staatsverschuldung' }]} />}
        meta={
          <>
            <span>{summary.countryCount} Länder</span>
            <span aria-hidden="true">·</span>
            <span>
              Quoten {summary.debtYear}, Wirtschaftsleistung {summary.referenceYear}
            </span>
            <span aria-hidden="true">·</span>
            <span>Sortierbar und filterbar</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/*
          Bis Juli 2026 stand hier ein Hinweis auf „gerundete Näherungswerte zu
          Demonstrationszwecken“. Er ist entfallen, weil er nicht mehr stimmt:
          Die Zahlen kommen aus denselben Quellen, die dort als die richtigen
          benannt waren. Was bleibt, sind die Einschränkungen, die auch für
          echte Zahlen gelten – und die sind wichtiger als der alte Vorbehalt.
        */}
        <div className="text-fg-subtle space-y-2 text-sm leading-relaxed">
          <p>
            Die Schuldenquote kommt vom{' '}
            <a
              href={DEBT_QUELLEN.schulden.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Internationalen Währungsfonds
            </a>{' '}
            ({summary.debtYear}), Wirtschaftsleistung und Einwohnerzahl von der Weltbank (
            {summary.referenceYear}). Gespeichert sind nur diese drei Größen; der absolute
            Schuldenstand und die Schulden pro Kopf werden daraus berechnet, damit sie
            nicht auseinanderlaufen können.
          </p>
          <p>
            <strong className="text-fg font-semibold">
              Die beiden Jahre sind nicht dieselben
            </strong>{' '}
            – der Währungsfonds schreibt die Quote fort, die Weltbank braucht für das
            Bruttoinlandsprodukt länger. Die Quote selbst ist davon unberührt; der daraus
            gerechnete Betrag in Euro ist eine Größenordnung, keine Kassenlage.
            {DEBT_EUR_USD !== null && (
              <>
                {' '}
                Umgerechnet wird mit dem Durchschnittskurs des Bezugsjahres von{' '}
                {formatNumber(DEBT_EUR_USD, 4)} Dollar je Euro – nicht mit dem heutigen,
                sonst änderten sich die Schulden eines Landes rückwirkend, sobald der Euro
                schwankt.
              </>
            )}
          </p>
          <p>{DEBT_QUELLEN.schulden.abgrenzung}</p>
        </div>

        {/* -------------------------------------------------- Kennzahlen */}
        <section aria-labelledby="ueberblick" className="mt-12">
          <h2 id="ueberblick" className="text-fg text-2xl font-bold">
            Überblick
          </h2>
          <StatGrid columns={4} className="mt-5">
            <Stat
              label="Höchste Quote"
              value={formatPercent(summary.highest.debtToGdpPercent, 0)}
              tone="negative"
              hint={summary.highest.name}
            />
            <Stat
              label="Niedrigste Quote"
              value={formatPercent(summary.lowest.debtToGdpPercent, 0)}
              tone="positive"
              hint={summary.lowest.name}
            />
            {/*
              Median statt Durchschnitt an dieser Stelle: Bei fast zweihundert
              Ländern ziehen eine Handvoll Quoten über 200 Prozent den
              Mittelwert nach oben, während die meisten deutlich darunter
              liegen. Der Durchschnitt steht im Hinweis daneben, damit beide
              Zahlen vergleichbar bleiben.
            */}
            <Stat
              label="Mittleres Land"
              value={formatPercent(summary.medianDebtToGdpPercent, 0)}
              hint={`Median aller Länder – der Durchschnitt liegt bei ${formatPercent(summary.averageDebtToGdpPercent, 0)}`}
            />
            <Stat
              label="Höchste Schulden pro Kopf"
              value={formatCurrencyRounded(summary.highestPerCapita.debtPerCapitaEur)}
              hint={summary.highestPerCapita.name}
            />
          </StatGrid>
        </section>

        {/* ---------------------------------------------------- Vergleich */}
        <section aria-labelledby="vergleich" className="mt-12">
          <h2 id="vergleich" className="text-fg text-2xl font-bold">
            Ländervergleich
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Sortiere nach der Spalte, die dich interessiert. Der Wechsel zwischen „Prozent
            des BIP“ und „pro Kopf“ verändert die Reihenfolge deutlich – ein gutes
            Beispiel dafür, wie stark die gewählte Kennzahl das Bild prägt.
          </p>
          <div className="mt-6">
            <DebtComparison countries={countries} regions={regions} />
          </div>
        </section>

        {/* ------------------------------------------------- Einordnung */}
        <section aria-labelledby="einordnung" className="mt-16 max-w-3xl">
          <h2 id="einordnung" className="text-fg text-2xl font-bold">
            Warum die Schuldenquote allein wenig aussagt
          </h2>

          <p className="text-fg-muted mt-4 leading-relaxed">
            Die Schuldenquote setzt den Schuldenstand ins Verhältnis zum
            Bruttoinlandsprodukt eines Jahres. Sie vergleicht damit einen Bestand mit
            einem Jahresstrom – so, als würde man einen Immobilienkredit am
            Jahreseinkommen messen. Als Vergleichsmaß ist das brauchbar, als Urteil über
            Tragfähigkeit nicht.
          </p>

          <h3 className="text-fg mt-8 text-lg font-semibold">
            Vier Faktoren, die mehr über Tragfähigkeit sagen
          </h3>
          <ul className="text-fg-muted mt-4 space-y-3">
            {[
              {
                title: 'Eigene Währung',
                text: 'Ein Staat, der sich in seiner eigenen Währung verschuldet, kann nicht in derselben Weise zahlungsunfähig werden wie einer mit Fremdwährungsschulden. Japans Quote von 250 Prozent ist deshalb nicht mit einer gleich hohen Quote in Fremdwährung vergleichbar.',
              },
              {
                title: 'Zins-Wachstums-Differenz',
                text: 'Liegt das nominale Wirtschaftswachstum über dem durchschnittlichen Zinssatz der Schulden, sinkt die Quote von allein – selbst bei neuen Krediten. Liegt es darunter, steigt sie, auch ohne neue Schulden.',
              },
              {
                title: 'Restlaufzeit',
                text: 'Je länger die durchschnittliche Restlaufzeit, desto langsamer wirken Zinsanstiege. Ein Land mit überwiegend kurzfristigen Schulden spürt steigende Zinsen innerhalb von Monaten, ein Land mit langen Laufzeiten erst über Jahre.',
              },
              {
                title: 'Wer die Gläubiger sind',
                text: 'Schulden gegenüber inländischen Sparern oder der eigenen Notenbank verhalten sich anders als Schulden gegenüber internationalen Investoren, die kurzfristig abziehen können.',
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3 leading-relaxed">
                <span
                  aria-hidden="true"
                  className="bg-debt mt-2 size-1.5 shrink-0 rounded-full"
                />
                <span>
                  <strong className="text-fg font-semibold">{item.title}:</strong>{' '}
                  {item.text}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Callout variant="info" title="Der Sonderfall Irland">
              <p>
                Irlands Quote sieht mit rund 40 Prozent sehr günstig aus. Der Grund liegt
                aber nicht in besonders niedrigen Schulden, sondern in einem durch
                internationale Konzernstrukturen stark überhöhten Bruttoinlandsprodukt.
                Wird stattdessen das modifizierte Bruttonationaleinkommen als Bezugsgröße
                verwendet, fällt die Quote deutlich höher aus.
              </p>
              <p>
                Genau darin liegt die Lehre: Eine Kennzahl ist immer nur so gut wie ihr
                Nenner. Wer Länder vergleicht, muss wissen, was in diesem Nenner steckt.
              </p>
            </Callout>
          </div>

          <h3 className="text-fg mt-10 text-lg font-semibold">
            Was das für Privatanleger bedeutet
          </h3>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Für Anleger ist die Verschuldung eines Staates vor allem über zwei Kanäle
            relevant. Erstens über die Rendite seiner Anleihen: Höheres wahrgenommenes
            Ausfallrisiko bedeutet höhere Zinsen und damit fallende Kurse bereits
            umlaufender Papiere. Zweitens über die Steuer- und Ausgabenpolitik, die auf
            die Unternehmensgewinne im eigenen Markt wirkt.
          </p>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Wer breit über viele Länder streut, muss diese Fragen nicht einzeln
            beantworten – die Streuung erledigt das. Wer dagegen einzelne Staatsanleihen
            kauft, sollte sich mit den vier Faktoren oben beschäftigen, bevor eine hohe
            Rendite attraktiv erscheint.
          </p>
        </section>

        <div className="mt-12 max-w-3xl">
          <TopicLinkList
            topics={relatedTopics}
            title="Passende Grundlagen"
            description="Wie Anleihen funktionieren und wie Zinsen und Kurse zusammenhängen."
          />
        </div>
      </div>

      <JsonLd
        data={datasetSchema({
          name: 'Staatsverschuldung im Ländervergleich',
          description: `Schuldenstand in Prozent des BIP, absolut und pro Kopf für ${summary.countryCount} Länder – Quoten vom Internationalen Währungsfonds, Wirtschaftsleistung von der Weltbank.`,
          path: '/staatsverschuldung',
          temporalCoverage: String(summary.referenceYear),
          keywords: [
            'Staatsverschuldung',
            'Schuldenquote',
            'Ländervergleich',
            'Schulden pro Kopf',
          ],
        })}
      />
    </>
  )
}
