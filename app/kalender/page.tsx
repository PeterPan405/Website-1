import type { Metadata } from 'next'

import { KalenderAnsicht } from '@/components/kalender/KalenderAnsicht'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  getKalenderZeitraum,
  getTerminAnzahl,
  getTermineNachMonat,
  nurAufWunsch,
  terminArtMeta,
  terminArtReihenfolge,
} from '@/lib/kalender'
import { getLearnTopics, getTopicsBySlugs } from '@/lib/learn'
import { getInstruments } from '@/lib/markets'
import {
  getQuartalsterminAbdeckung,
  quartalstermineQuelle,
  quartalstermineStand,
} from '@/lib/quartalstermine'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Börsenkalender – Zinsentscheide und Quartalszahlen'),
  description:
    'Zinsentscheide von EZB und Fed, erwartete Quartalszahlen, Verfallstage, Börsenfeiertage und Wahlen – mit einer Einordnung, was jeder Termin bedeutet.',
  path: '/kalender',
  ogTitle: 'Der Börsenkalender: worauf der Markt schaut',
})

export default async function KalenderPage() {
  const [gruppen, anzahl, zeitraum, relatedTopics, themen, instrumente] =
    await Promise.all([
      getTermineNachMonat(),
      getTerminAnzahl(),
      getKalenderZeitraum(),
      getTopicsBySlugs(['notenbanken-geldpolitik', 'wann-kaufen-verkaufen', 'boerse']),
      getLearnTopics(),
      getInstruments(),
    ])

  /*
    Namen statt Kennungen.

    Die Termine verweisen über Slugs und Symbole – im Browser soll aber
    „Währungen und Wechselkurse“ stehen und nicht „waehrungen-wechselkurse“.
    Aufgelöst wird das hier auf dem Server, damit die Lern- und Kursdaten nicht
    ins Browser-Bundle wandern.
  */
  const themennamen = Object.fromEntries(themen.map((thema) => [thema.slug, thema.title]))
  const kursnamen = Object.fromEntries(
    instrumente.map((eintrag) => [eintrag.symbol, eintrag.ticker])
  )

  const gesamt = gruppen.reduce((summe, gruppe) => summe + gruppe.termine.length, 0)
  const quartalstermine = getQuartalsterminAbdeckung()

  return (
    <>
      <PageHeader
        area="calendar"
        eyebrow="Kalender"
        eyebrowIcon="clock"
        title="Die Termine, auf die der Markt schaut"
        lead="Zinsentscheide, Quartalszahlen, Verfallstage, Börsenfeiertage und Wahlen – und bei jedem Termin ein Satz dazu, was er für dein Geld bedeutet. Erwartete Termine sind als solche gekennzeichnet."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Kalender' }]} />}
        meta={
          <>
            <span>{gesamt} Termine</span>
            <span aria-hidden="true">·</span>
            <span>bis {new Date(zeitraum.bis).getFullYear()}</span>
            <span aria-hidden="true">·</span>
            <span>jeder mit Quelle</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/*
          Der Verweis aufs Abo steht oben und nicht unten: Wer einen Kalender
          liest, will die Termine meistens dorthin haben, wo seine übrigen
          stehen – und nicht erst nach tausend Zeilen davon erfahren.
        */}
        <p className="text-fg-muted mt-2 text-sm leading-relaxed">
          Diese Termine im eigenen Kalender:{' '}
          <a
            href="/kalender/termine.ics"
            className="text-calendar font-medium underline underline-offset-2"
          >
            termine.ics abonnieren
          </a>{' '}
          – die Datei wird bei jedem Bau der Website neu erzeugt, neue Termine kommen also
          von selbst dazu. Alles Abgeleitete trägt im Titel ein „(erwartet)“. Die
          geschätzten Dividendentermine sind nicht enthalten – wer sie will, abonniert sie
          als eigenen Kalender:{' '}
          <a
            href="/kalender/dividenden.ics"
            className="text-calendar font-medium underline underline-offset-2"
          >
            dividenden.ics
          </a>
          . Getrennt, damit achthundert Ex-Tage nicht zwischen den Zinsentscheiden stehen,
          wenn man nur diese wollte.
        </p>

        {/*
          `max-w-4xl` statt `max-w-3xl`: Die Terminliste hing in einer schmalen
          linken Spalte, rechts daneben blieb ein Drittel der Seite leer. Ganz
          ohne Grenze würden die Zeilen auf breiten Schirmen zu lang zum Lesen –
          eine Stufe breiter füllt die Seite, ohne die Zeile zu überdehnen.
        */}
        <div className="max-w-4xl">
          <KalenderAnsicht
            gruppen={gruppen}
            artMeta={terminArtMeta}
            reihenfolge={terminArtReihenfolge}
            nurAufWunsch={nurAufWunsch}
            anzahl={anzahl}
            themennamen={themennamen}
            kursnamen={kursnamen}
          />

          {/* ---------------------------------------------------- Einordnung */}
          <section aria-labelledby="hinweis" className="mt-16">
            <h2 id="hinweis" className="text-fg text-2xl font-bold">
              Was hier feststeht – und was erwartet wird
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Das meiste in diesem Kalender steht im Voraus fest und ist veröffentlicht.
              Notenbanken geben ihre Sitzungstermine ein Jahr vorher bekannt, Börsen ihre
              Feiertage, Verfallstage folgen einer festen Regel – dem dritten Freitag der
              Quartalsmonate –, und Wahltermine stehen im Gesetz.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Wann ein einzelnes Unternehmen seine Quartalszahlen vorlegt, kündigt es
              dagegen selbst an, meist wenige Wochen vorher. Ein Jahr im Voraus ist dieser
              Tag nirgends zu bekommen. Was es gibt, ist das Muster: Unternehmen melden
              Quartal für Quartal ungefähr am selben Tag des Jahres.{' '}
              {quartalstermine.termine > 0 && (
                <>
                  Aus diesem Muster sind hier{' '}
                  <strong className="text-fg">
                    {quartalstermine.termine} Meldetermine
                  </strong>{' '}
                  für {quartalstermine.unternehmen} Unternehmen hochgerechnet – aus den
                  Pflichtmeldungen der vergangenen Jahre bei der US-Börsenaufsicht SEC
                  (Formular 8-K, Punkt 2.02).
                </>
              )}
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Abgedeckt sind damit {quartalstermine.unternehmen} der{' '}
              {quartalstermine.aktienGesamt} hier geführten Aktien. Der Grund für den
              Unterschied liegt an der Quelle: Die Pflichtmeldung mit der Punktnummer gibt
              es nur in den USA. Wer an einer europäischen oder asiatischen Börse notiert,
              reicht dort nichts ein – und wer als ausländisches Unternehmen in den USA
              gelistet ist, meldet über ein Formular ohne Punktnummern, aus dem sich eine
              Ergebnisveröffentlichung nicht zuverlässig herauslesen lässt. Alibaba ist so
              ein Fall: in New York gelistet, bei der Börsenaufsicht geführt – und ohne
              eine einzige Meldung der Art, aus der sich hier etwas ableiten ließe.
            </p>
            {/*
              Hier stand bis zum 20. August 2026 ein Versprechen: „Für die übrigen Werte
              kommt eine zweite Quelle hinzu, sobald sie bereitsteht." Sie stand längst
              bereit und lieferte nichts – der Anbieter gibt die Meldetermine nur in
              einem kostenpflichtigen Tarif heraus, und das steht in jeder einzelnen
              seiner Antworten. Ein Satz, der eine Lösung ankündigt, die es nicht gibt,
              ist schlechter als das Eingeständnis: Er hält die Frage für erledigt.
            */}
            <p className="text-fg-muted mt-4 leading-relaxed">
              Eine zweite Quelle für die übrigen Werte ist gesucht und bisher nicht
              gefunden. Geprüft sind sieben; alle verlangen entweder einen
              kostenpflichtigen Zugang oder eine Kennung, die nur ein Browser erzeugt –
              und Letzteres nachzubauen hieße, eine bewusst gesetzte Sperre zu umgehen.
              Solange das so bleibt, steht bei diesen Aktien kein Termin, und auf ihrer
              Seite steht, warum. Eine plausibel aussehende Schätzung wäre hier schlechter
              als eine Lücke.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Diese Termine sind mit{' '}
              <strong className="text-fg">„erwartet, nicht bestätigt“</strong> und mit „um
              den …“ gekennzeichnet, und sie stehen nur ein halbes Jahr weit im Voraus.
              Ein Kalender, der geratene Daten wie Fakten ausweist, wäre schlimmer als
              einer mit Lücken: Wer danach plant, verpasst den echten Termin. Ein
              gekennzeichneter Erwartungswert dagegen ist nützlich – er sagt, in welcher
              Woche man hinsehen sollte.
            </p>
            {quartalstermineStand && (
              <p className="text-fg-subtle mt-4 text-sm">
                Hochgerechnet am{' '}
                {new Date(quartalstermineStand).toLocaleDateString('de-DE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
                . {quartalstermineQuelle.abgrenzung}{' '}
                <a
                  href={quartalstermineQuelle.url}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  {quartalstermineQuelle.label}
                </a>
              </p>
            )}

            <Callout variant="tip" title="Was Termine mit Kursen machen" className="mt-6">
              <p>
                Ein bekannter Termin bewegt für sich genommen nichts. Was am Mittwoch
                erwartet wird, steckt schon im Kurs vom Dienstag – bewegt wird erst die
                Abweichung von dieser Erwartung.
              </p>
              <p>
                Nützlich ist der Kalender deshalb anders herum: Er erklärt hinterher,
                warum ein Tag unruhig war. Ein Verfallstag oder ein Zinsentscheid ist der
                häufigste Grund für einen Ausschlag, hinter dem keinerlei Nachricht über
                ein Unternehmen steckt.
              </p>
            </Callout>
          </section>

          <div className="mt-16">
            <TopicLinkList
              topics={relatedTopics}
              description="Was hinter Notenbanken, Verfallstagen und dem richtigen Zeitpunkt steckt."
            />
          </div>
        </div>
      </div>
    </>
  )
}
