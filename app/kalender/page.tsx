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
              Ergebnisveröffentlichung nicht zuverlässig herauslesen lässt.
            </p>
            {/*
              Hier stand bis zum 20. August 2026 zuerst ein Versprechen („eine zweite
              Quelle kommt hinzu, sobald sie bereitsteht"), dann dessen Widerruf
              („gesucht und nicht gefunden"). Beides war zu bequem: Das erste kündigte
              eine Lösung an, die es nicht gab, das zweite erklärte die Suche für
              beendet. Der Betreiber hat widersprochen – und die Prüfung danach hat
              tatsächlich noch eine Quelle gefunden. Hier steht jetzt der gemessene
              Stand, samt dem, was er nicht abdeckt.
            */}
            <p className="text-fg-muted mt-4 leading-relaxed">
              Für einen Teil der Titel gibt es die Termine trotzdem – und zwar nicht
              hochgerechnet, sondern{' '}
              <strong className="text-fg">
                so, wie das Unternehmen sie angekündigt hat
              </strong>
              . Sie sind hier als „angekündigt“ gekennzeichnet, ohne den Zusatz „erwartet,
              nicht bestätigt“: Erwartet sind sie nicht, sie stehen fest. Zwei Quellen
              liefern sie. Ein Sammelkalender angekündigter Meldetermine führt, was in New
              York notiert – einschließlich der Hinterlegungsscheine ausländischer
              Unternehmen, Alibaba etwa steht darin. Und die{' '}
              <strong className="text-fg">Tokioter Börse</strong> veröffentlicht die
              geplanten Meldetermine aller dort gelisteten Unternehmen selbst; von dort
              kommen die Termine der japanischen Titel. Zwei Dinge gehören dazugesagt:
              Tokio nennt zum Tag keine Uhrzeit, und deshalb steht bei diesen Titeln auch
              keine. Und die Liste erscheint je Berichtssaison – zwischen zwei Saisons
              steht auf der Aktienseite, dass der nächste Tag noch nicht bekannt gegeben
              ist, statt einer Schätzung.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Wer weder in New York notiert noch an einer Börse, die ihre Termine selbst
              veröffentlicht, bleibt offen – vor allem die europäischen Werte. Sechzehn
              Quellen sind bisher geprüft, zuletzt die Börsen selbst. Die Zürcher und die
              Londoner Börse antworten offen und vollständig, führen den Meldetermin aber
              nicht; Euronext, die Deutsche Börse und Hongkong setzen ihre Seiten erst im
              Browser zusammen; die Datenhändler verlangen einen kostenpflichtigen Zugang
              oder eine Kennung, die nur ein Browser erzeugt – und Letzteres nachzubauen
              hieße, eine bewusst gesetzte Sperre zu umgehen. Die Suche geht weiter, Börse
              für Börse. Wo kein Termin vorliegt, steht auf der Seite der Aktie, warum.
              Eine plausibel aussehende Schätzung wäre dort schlechter als eine Lücke.
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
