import type { LearnTopic } from '@/data/learn/types'
import { formatNumber, formatPercent } from '@/lib/format'
import {
  gewinnschwelle,
  innererWert,
  preis,
  sensitivitaeten,
  zeitwert,
} from '@/lib/optionen'
import {
  optionBasis as BASIS,
  optionKurse as KURSE,
  optionMonate as MONATE,
  optionVolatilitaeten as VOLATILITAETEN,
} from '@/lib/lernszenarien'

/*
  Alle Prämien dieses Themas kommen aus `lib/optionen.ts`.

  Optionen sind das Thema, bei dem getippte Beispielzahlen am schnellsten
  falsch werden: Eine Prämie, die nicht zu Basispreis, Laufzeit und
  Volatilität passt, führt zu Aussagen über den Zeitwert, die niemand
  nachrechnet und die trotzdem nicht stimmen. Hier stammt jede Zahl aus
  derselben geprüften Funktion – einschließlich der Aussage, dass sich der
  Zeitwertverfall zum Ende beschleunigt. Die steht damit als Spalte in einer
  Tabelle statt als Behauptung im Fließtext.
*/
/** Innerer Wert und Zeitwert über verschiedene Kurse des Basiswerts. */
const wertaufteilung = KURSE.map((kurs) => {
  const p = { ...BASIS, kurs }
  return {
    kurs,
    praemie: preis('call', p),
    innerer: innererWert('call', kurs, BASIS.basispreis),
    zeit: zeitwert('call', p),
  }
})

/** Wie die Prämie mit der Restlaufzeit schrumpft – und wie schnell zum Schluss. */
const verfallsreihe = MONATE.map((monate) => {
  const p = { ...BASIS, jahre: monate / 12 }
  return {
    monate,
    praemie: preis('call', p),
    proTag: sensitivitaeten('call', p).thetaProTag,
  }
})

/** Der stärkste Preistreiber: die erwartete Schwankung. */
const volareihe = VOLATILITAETEN.map((volatilitaetProzent) => ({
  volatilitaetProzent,
  praemie: preis('call', { ...BASIS, volatilitaetProzent }),
}))

const amGeld = sensitivitaeten('call', BASIS)
const praemieAmGeld = preis('call', BASIS)
const schwelleAmGeld = gewinnschwelle('call', BASIS)

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt Call und Put, zerlegt die Prämie in inneren
 * Wert und Zeitwert und stellt die Asymmetrie zwischen Käufer und Verkäufer
 * heraus. Fortgeschritten behandelt die Preistreiber und die Standard-
 * strategien mit Bestand. Profi geht auf die Sensitivitäten, den Handel mit
 * Volatilität und die Abwicklungsrisiken ein.
 *
 * ## Abgrenzung zu „Derivat“
 *
 * Dort steht die Familie: Futures, Swaps, Margin, Hebelprodukte. Hier nur die
 * Option – dafür bis zu den Griechen.
 */
export const option: LearnTopic = {
  slug: 'option',
  title: 'Option',
  headline: 'Das Recht, aber nicht die Pflicht',
  metaTitle: 'Optionen erklärt: Call, Put, Prämie und Risiko',
  metaDescription:
    'Wie Calls und Puts funktionieren, woraus sich die Prämie zusammensetzt, was Käufer und Verkäufer riskieren und welche Strategien wofür gedacht sind.',
  lead: 'Eine Option gibt dir ein Recht. Wer sie verkauft, übernimmt eine Pflicht – und ein völlig anderes Risikoprofil.',
  overview: [
    'Eine Option verbrieft das Recht, einen Basiswert zu einem festgelegten Preis zu kaufen (Call) oder zu verkaufen (Put). Ausüben muss man nicht – und genau darin liegt der Wert.',
    'Für dieses Recht zahlt der Käufer eine Prämie. Sein Verlust ist auf sie begrenzt. Der Verkäufer erhält die Prämie und übernimmt dafür eine Verpflichtung, deren Risiko beim ungedeckten Call theoretisch unbegrenzt ist.',
    'Die Stufen führen von den Grundbegriffen über die Zerlegung der Prämie und die Standardstrategien bis zu den Sensitivitäten, dem Handel mit Volatilität und den Risiken am Verfallstag.',
  ],
  keywords: ['Option', 'Call', 'Put', 'Optionsprämie', 'Volatilität', 'Zeitwert'],
  related: ['derivat', 'aktie', 'wie-funktioniert-der-markt'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Optionen einfach erklärt: Call und Put verstehen',
      metaDescription:
        'Was Call und Put bedeuten, wie Basispreis und Laufzeit wirken, woraus die Prämie besteht und warum Verkäufer ein anderes Risiko tragen als Käufer.',
      title: 'Call, Put und der Preis eines Rechts',
      lead: 'Die Grundbegriffe an einem durchgerechneten Beispiel – und die Asymmetrie, die Optionen gefährlich macht.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eine Option ist ein Vertrag über ein Recht. Du darfst etwas zu einem heute festgelegten Preis kaufen oder verkaufen – irgendwann bis zu einem festen Termin. Ob du das tust, entscheidest du dann. Für dieses Wahlrecht zahlst du sofort einen Preis, die **Prämie**.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die beiden Grundformen',
        },
        {
          type: 'table',
          caption: 'Call und Put im Vergleich',
          head: ['', 'Call', 'Put'],
          rows: [
            ['Recht', 'Zu kaufen', 'Zu verkaufen'],
            ['Wird wertvoll, wenn', 'Der Kurs steigt', 'Der Kurs fällt'],
            [
              'Typischer Zweck',
              'Auf steigende Kurse setzen, ohne den vollen Kaufpreis zu binden',
              'Einen Bestand gegen Kursverluste absichern',
            ],
            [
              'Wertlos, wenn',
              'Der Kurs unter dem Basispreis bleibt',
              'Der Kurs über dem Basispreis bleibt',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Vier Begriffe, die auf jedem Kontrakt stehen',
          items: [
            '**Basispreis (Strike).** Der Preis, zu dem gekauft oder verkauft werden darf.',
            '**Verfallstag.** Bis wann das Recht gilt. Danach ist es weg.',
            '**Prämie.** Was das Recht heute kostet.',
            '**Ausübungsart.** *Europäisch* heißt: nur am Verfallstag. *Amerikanisch* heißt: jederzeit bis dahin. Die Namen haben nichts mit dem Handelsplatz zu tun – europäische Optionen werden in den USA gehandelt und umgekehrt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Woraus die Prämie besteht',
        },
        {
          type: 'paragraph',
          text: `Die Prämie hat zwei Bestandteile, und sie auseinanderzuhalten ist der wichtigste Schritt beim Verständnis von Optionen. Der **innere Wert** ist der Betrag, den man bei sofortiger Ausübung bekäme. Der **Zeitwert** ist alles Übrige – der Preis für die Chance, dass es bis zum Verfall noch besser wird. Ein Beispiel mit Basispreis ${formatNumber(BASIS.basispreis, 0)} und ${MONATE[2]} Monaten Restlaufzeit:`,
        },
        {
          type: 'table',
          caption: `Call, Basispreis ${formatNumber(BASIS.basispreis, 0)}, ${MONATE[2]} Monate Restlaufzeit`,
          head: ['Kurs des Basiswerts', 'Prämie', 'Innerer Wert', 'Zeitwert'],
          rows: wertaufteilung.map((zeile) => [
            formatNumber(zeile.kurs, 0),
            formatNumber(zeile.praemie, 2),
            formatNumber(zeile.innerer, 2),
            formatNumber(zeile.zeit, 2),
          ]),
        },
        {
          type: 'paragraph',
          text: 'Zwei Beobachtungen. Bei einem Kurs unter dem Basispreis besteht die Prämie **ausschließlich** aus Zeitwert – man bezahlt reine Hoffnung. Und weit im Geld schrumpft der Zeitwert fast auf null: Die Option verhält sich dann fast wie der Basiswert selbst, nur mit Verfallsdatum.',
        },
        {
          type: 'figure',
          figure: 'option-auszahlung',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Zeitwert schmilzt – und zwar schneller zum Schluss',
        },
        {
          type: 'paragraph',
          text: 'Der Zeitwert ist am Verfallstag zwangsläufig null. Der Weg dorthin ist aber nicht gleichmäßig, und das ist die Eigenschaft, die Optionskäufer am häufigsten unterschätzt:',
        },
        {
          type: 'table',
          caption: `Call am Geld, Basispreis ${formatNumber(BASIS.basispreis, 0)}, ${formatPercent(BASIS.volatilitaetProzent, 0)} erwartete Schwankung`,
          head: ['Restlaufzeit', 'Prämie', 'Verlust pro Tag'],
          rows: verfallsreihe.map((zeile) => [
            // „1 Monate“ stand hier, bis es jemandem auffiel.
            `${zeile.monate} ${zeile.monate === 1 ? 'Monat' : 'Monate'}`,
            formatNumber(zeile.praemie, 2),
            formatNumber(zeile.proTag, 3),
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was daraus folgt',
          items: [
            `Im letzten Monat verliert dieselbe Option täglich rund das Dreifache dessen, was sie ein Jahr vor Verfall verlor.`,
            'Das passiert **auch bei völlig unverändertem Kurs**. Ein Optionskäufer, der recht behält, aber zu spät, verliert trotzdem.',
            'Für den Käufer ist das der laufende Aufwand, für den Verkäufer der laufende Ertrag. Beides ist dieselbe Zahl mit umgekehrtem Vorzeichen.',
          ],
        },
        {
          type: 'figure',
          figure: 'option-zeitwertverfall',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Käufer und Verkäufer sind nicht spiegelbildlich',
        },
        {
          type: 'paragraph',
          text: `Beim Aktienkauf ist die Sache symmetrisch: Der eine gewinnt, was der andere verliert. Bei Optionen sind die Profile grundverschieden. Für den Call am Geld aus dem Beispiel kostet die Prämie ${formatNumber(praemieAmGeld, 2)}; die Gewinnschwelle liegt damit bei ${formatNumber(schwelleAmGeld, 2)}, nicht beim Basispreis.`,
        },
        {
          type: 'table',
          caption: 'Zwei Seiten desselben Kontrakts',
          head: ['', 'Käufer', 'Verkäufer'],
          rows: [
            ['Zahlt oder erhält', 'Zahlt die Prämie', 'Erhält die Prämie'],
            [
              'Maximaler Verlust',
              'Die Prämie – mehr nicht',
              'Beim ungedeckten Call theoretisch unbegrenzt',
            ],
            ['Maximaler Gewinn', 'Theoretisch sehr groß', 'Die Prämie – mehr nicht'],
            [
              'Gewinnt, wenn',
              'Sich der Kurs deutlich genug bewegt',
              'Nichts Wesentliches passiert',
            ],
            ['Die Zeit arbeitet', 'Gegen ihn', 'Für ihn'],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Der ungedeckte Verkauf eines Calls',
          items: [
            'Wer einen Call verkauft, ohne die Aktien zu besitzen, verpflichtet sich, sie im Ernstfall zu liefern – zu welchem Kurs sie dann auch stehen.',
            'Nach oben gibt es keine Grenze. Der maximale Gewinn bleibt die Prämie, der maximale Verlust ist offen. Für Privatanleger ist diese Position ungeeignet, und die meisten Broker geben sie nur mit gesonderter Freigabe frei.',
            'Der gedeckte Verkauf – die Aktien liegen im Depot – ist etwas völlig anderes. Dazu mehr in der nächsten Stufe.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Zu einem verbreiteten Satz noch eine Einordnung: „Neun von zehn Optionen verfallen wertlos“ hört man oft, und es stimmt so nicht. Der größte Teil aller Positionen wird vor dem Verfallstag glattgestellt und taucht in dieser Statistik gar nicht auf. Richtig bleibt der Kern: Als Käufer muss man sich in Richtung **und** Zeitpunkt gleichzeitig nicht irren, und das ist deutlich schwerer, als nur die Richtung zu treffen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Optionsschein ist nicht Option',
        },
        {
          type: 'paragraph',
          text: 'Die Begriffe klingen gleich und bezeichnen zwei verschiedene Dinge. Eine **Option** wird an einer Terminbörse gehandelt, ist standardisiert und hat viele Marktteilnehmer auf beiden Seiten. Ein **Optionsschein** wird von einer Bank ausgegeben – sie legt die Bedingungen fest, stellt den Kurs und ist zugleich die Gegenpartei.',
        },
        {
          type: 'list',
          items: [
            '**Der Emittent zählt mit.** Ein Optionsschein ist rechtlich eine Schuldverschreibung. Geht die ausgebende Bank unter, ist er wertlos, egal wie der Basiswert steht.',
            '**Der Preis kommt von der Gegenseite.** Es gibt kein Orderbuch mit vielen Teilnehmern, sondern eine Bank, die An- und Verkaufskurs stellt. Sie kennt die Bewertung, der Käufer schätzt.',
            '**Dafür sind sie zugänglich.** Kleine Stückelungen, jedes Depot, keine Freigabe nötig. Genau das erklärt, warum Privatanleger fast immer Optionsscheine kaufen und fast nie Optionen.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Und der wichtigste Satz dieser Stufe',
          items: [
            'Für den Vermögensaufbau braucht man von alldem nichts. Optionen lösen ein Problem – die Absicherung eines vorhandenen Bestands –, das die meisten Privatanleger nicht haben.',
            'Wer keinen konkreten Absicherungsbedarf hat, hat keinen Grund für den Einsatz. Die Werbung für Hebelprodukte richtet sich fast ausschließlich an genau diese Gruppe.',
            'Das ist kein Verbot, sondern eine Einordnung: Es ist Werkzeug für eine bestimmte Aufgabe, kein Baustein für ein Depot.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Call ist das Recht zu kaufen, Put das Recht zu verkaufen – eine Pflicht entsteht nur für den Verkäufer.',
            'Die Prämie besteht aus innerem Wert und Zeitwert; aus dem Geld ist sie reiner Zeitwert.',
            'Der Zeitwert schmilzt zum Verfall hin immer schneller, auch bei unverändertem Kurs.',
            'Die Gewinnschwelle liegt um die Prämie über dem Basispreis, nicht auf ihm.',
            'Ein Optionsschein ist eine Bankschuld mit von der Bank gestelltem Kurs – eine Option ist es nicht.',
            'Ohne konkreten Absicherungsbedarf gibt es keinen Grund, damit anzufangen.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Optionen: Preistreiber und Standardstrategien',
      metaDescription:
        'Was die Prämie bestimmt, wie Covered Call und Cash Secured Put funktionieren und warum die implizite Volatilität der wichtigste Preistreiber ist.',
      title: 'Preistreiber und Strategien',
      lead: 'Warum eine Option vor Quartalszahlen teuer ist, welche Strategien mit Bestand funktionieren – und wo ihre Kosten stecken.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Fünf Größen bestimmen die Prämie',
        },
        {
          type: 'table',
          caption: 'Einflussfaktoren und ihre Richtung',
          head: ['Größe', 'Wirkung auf den Call', 'Wirkung auf den Put'],
          rows: [
            ['Kurs des Basiswerts steigt', 'teurer', 'billiger'],
            ['Basispreis liegt höher', 'billiger', 'teurer'],
            ['Mehr Restlaufzeit', 'teurer', 'meist teurer'],
            ['Höhere erwartete Schwankung', 'teurer', 'teurer'],
            ['Höherer Zins', 'etwas teurer', 'etwas billiger'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Vier dieser fünf Größen sind bekannt: Kurs, Basispreis, Restlaufzeit und Zins kann jeder ablesen. Die fünfte nicht – niemand weiß, wie stark ein Kurs künftig schwanken wird. Genau deshalb ist sie der interessante Teil.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Implizite Volatilität: der eigentliche Preis',
        },
        {
          type: 'paragraph',
          text: 'Dreht man die Bewertungsformel um und setzt die am Markt bezahlte Prämie ein, kommt heraus, welche Schwankung der Markt einpreist. Das ist die **implizite Volatilität** – keine Messung der Vergangenheit, sondern eine Erwartung. Ihre Wirkung ist erheblich:',
        },
        {
          type: 'table',
          caption: `Call am Geld, Basispreis ${formatNumber(BASIS.basispreis, 0)}, ${MONATE[2]} Monate Restlaufzeit`,
          head: ['Erwartete Schwankung', 'Prämie', 'Gegenüber der Ausgangslage'],
          rows: volareihe.map((zeile) => [
            formatPercent(zeile.volatilitaetProzent, 0),
            formatNumber(zeile.praemie, 2),
            zeile.volatilitaetProzent === BASIS.volatilitaetProzent
              ? '—'
              : formatPercent(((zeile.praemie - praemieAmGeld) / praemieAmGeld) * 100, 0),
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum Optionen vor Quartalszahlen teuer sind',
          items: [
            'Vor einem angekündigten Termin – Zahlen, Studienergebnis, Gerichtsurteil – steigt die implizite Volatilität, weil eine große Bewegung wahrscheinlich ist.',
            'Nach der Veröffentlichung fällt sie schlagartig zurück. Das nennt man **Volatility Crush**.',
            'Die Folge ist bitter für Käufer: Man kann in der Richtung völlig recht behalten und trotzdem verlieren, weil die eingepreiste Erwartung stärker gefallen ist als der Kurs gestiegen.',
            'Die Regel daraus: Wer vor einem Termin kauft, kauft die Erwartung mit. Wer verkauft, verkauft sie – und das ist der Grund, warum diese Strategien vor Terminen überhaupt attraktiv aussehen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Strategien mit vorhandenem Bestand',
        },
        {
          type: 'paragraph',
          text: 'Drei Konstruktionen sind für Privatanleger überhaupt sinnvoll diskutierbar. Alle drei setzen voraus, dass man den Basiswert besitzt oder besitzen will.',
        },
        {
          type: 'table',
          caption: 'Drei Standardstrategien',
          head: ['Strategie', 'Aufbau', 'Was man eintauscht'],
          rows: [
            [
              'Covered Call',
              'Aktien im Depot, dazu einen Call darauf verkaufen',
              'Prämie sofort gegen den Verzicht auf Kursgewinne über dem Basispreis',
            ],
            [
              'Cash Secured Put',
              'Geld bereithalten, dazu einen Put verkaufen',
              'Prämie gegen die Pflicht, zum Basispreis zu kaufen – auch wenn der Kurs weit darunter steht',
            ],
            [
              'Protective Put',
              'Aktien im Depot, dazu einen Put kaufen',
              'Laufende Kosten gegen einen Boden unter dem Kurs',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Wo bei jeder der drei der Haken sitzt',
          items: [
            '**Covered Call.** Er tauscht eine kleine sichere Zahlung gegen einen kleinen Anteil an sehr großen möglichen Gewinnen. Über viele Jahre schneidet er in steigenden Märkten schlechter ab als schlichtes Halten – man verkauft ausgerechnet die Aufwärtsbewegungen weg, aus denen die Aktienrendite besteht.',
            '**Cash Secured Put.** Wirtschaftlich dasselbe Risiko wie der Aktienbesitz, nur mit gedeckeltem Gewinn. Sinnvoll nur, wenn man die Aktie zu diesem Kurs ohnehin kaufen wollte.',
            '**Protective Put.** Eine Versicherung, und sie kostet wie eine. Wer sie dauerhaft hält, zahlt jedes Jahr Prämie – über lange Zeiträume oft mehr, als die abgewendeten Verluste ausmachten. Als zeitlich begrenzte Absicherung vor einem konkreten Ereignis ist sie dagegen ein sauberes Werkzeug.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Spreads: Chance und Risiko gleichzeitig begrenzen',
        },
        {
          type: 'paragraph',
          text: 'Ein **Spread** kombiniert zwei Optionen derselben Art. Man kauft eine und verkauft eine zweite mit anderem Basispreis oder anderer Laufzeit. Die verkaufte Option verbilligt die gekaufte – und deckelt zugleich den möglichen Gewinn.',
        },
        {
          type: 'list',
          items: [
            '**Vertical Spread.** Gleiche Laufzeit, verschiedene Basispreise. Beides ist begrenzt: der Verlust auf die Nettoprämie, der Gewinn auf den Abstand der Basispreise abzüglich dieser Prämie. Die gebräuchlichste Konstruktion überhaupt.',
            '**Kalender-Spread.** Gleicher Basispreis, verschiedene Laufzeiten. Setzt darauf, dass die kurze Option schneller an Zeitwert verliert als die lange – ein Geschäft mit dem Zeitwertverfall, nicht mit der Richtung.',
            '**Straddle.** Call und Put am selben Basispreis. Setzt darauf, dass sich der Kurs stark bewegt, gleichgültig wohin. Teuer, weil zwei Prämien anfallen, und anfällig für den Volatility Crush.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Kosten entscheiden über die Sinnfrage',
          items: [
            'Jede Position eines Spreads verursacht Gebühren, und beim Schließen noch einmal – bei einem Vertical Spread also vier Transaktionen.',
            'Dazu kommt der Spread zwischen Geld- und Briefkurs, der bei Optionen deutlich breiter ist als bei Aktien.',
            'Bei kleinen Beträgen frisst das die kalkulierte Gewinnspanne vollständig auf. Optionsstrategien haben eine Mindestgröße, unterhalb derer sie rechnerisch nicht aufgehen – das gehört vor dem ersten Einsatz nachgerechnet.',
          ],
        },
        {
          type: 'figure',
          figure: 'option-volatilitaet',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Die implizite Volatilität ist der einzige Preistreiber, den man nicht ablesen kann – und der stärkste.',
            'Vor angekündigten Terminen ist sie hoch und fällt danach schlagartig; Käufer können bei richtiger Richtung verlieren.',
            'Der Covered Call verkauft ausgerechnet die großen Aufwärtsbewegungen weg.',
            'Spreads begrenzen beide Seiten – und haben wegen der Transaktionskosten eine Mindestgröße.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Optionen für Profis: Griechen und Volatilitätshandel',
      metaDescription:
        'Delta, Gamma, Theta und Vega im Zusammenspiel, Volatilitätsskew, die Volatilitätsrisikoprämie sowie Ausübungs- und Zuteilungsrisiken.',
      title: 'Sensitivitäten und Volatilität',
      lead: 'Die vier Griechen, was sie zusammen ergeben, warum Verkäufer im Schnitt verdienen – und wie sie trotzdem alles verlieren.',
      readingMinutes: 15,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die vier Sensitivitäten',
        },
        {
          type: 'paragraph',
          text: `Die **Griechen** beziffern, wie eine Optionsposition auf jede einzelne Einflussgröße reagiert. Für den Call am Geld aus den vorigen Stufen – Basispreis ${formatNumber(BASIS.basispreis, 0)}, ${MONATE[2]} Monate, ${formatPercent(BASIS.volatilitaetProzent, 0)} erwartete Schwankung – sehen sie so aus:`,
        },
        {
          type: 'table',
          caption: 'Sensitivitäten eines Calls am Geld',
          head: ['Größe', 'Wert', 'Bedeutung'],
          rows: [
            [
              'Delta',
              formatNumber(amGeld.delta, 2),
              'Steigt der Basiswert um 1, steigt die Prämie um diesen Betrag',
            ],
            [
              'Gamma',
              formatNumber(amGeld.gamma, 3),
              'Um so viel ändert sich das Delta je 1 Kursbewegung – die Beschleunigung',
            ],
            [
              'Theta',
              formatNumber(amGeld.thetaProTag, 3),
              'Zeitwertverlust pro Kalendertag, auch wenn nichts passiert',
            ],
            [
              'Vega',
              formatNumber(amGeld.vegaProProzentpunkt, 3),
              'Prämienänderung je Prozentpunkt mehr implizite Volatilität',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Wie sie zusammenhängen',
          items: [
            '**Delta und Gamma gehören zusammen.** Delta allein ist eine Momentaufnahme; Gamma sagt, wie schnell sie veraltet. Am Geld und kurz vor Verfall ist Gamma am größten – dort kippt eine Position am schnellsten.',
            '**Gamma und Theta sind gegenläufig.** Wer Gamma besitzt (also Optionen gekauft hat), zahlt dafür mit Theta. Wer Theta einnimmt (also verkauft hat), ist short Gamma und wird von schnellen Bewegungen getroffen. Es gibt keine Position, die beides gleichzeitig auf der guten Seite hat.',
            '**Vega ist die eigentliche Wette.** Bei einer gekauften Option wettet man nicht nur auf die Richtung, sondern darauf, dass die erwartete Schwankung nicht fällt. Diese zweite Wette ist den meisten Käufern nicht bewusst.',
          ],
        },
        {
          type: 'paragraph',
          text: '**Delta-Hedging** neutralisiert die Richtungswette: Man hält den Basiswert im Verhältnis des Delta gegen und passt laufend an. In der Theorie bleibt eine reine Wette auf Volatilität übrig. In der Praxis kostet das Anpassen Gebühren und Spread bei jeder Bewegung – und je größer Gamma, desto häufiger muss angepasst werden. Der Handel mit Volatilität ist deshalb kein Modellproblem, sondern ein Kostenproblem.',
        },
        {
          type: 'figure',
          figure: 'option-delta',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Volatilität ist keine einzelne Zahl',
        },
        {
          type: 'paragraph',
          text: 'Das Bewertungsmodell unterstellt eine konstante Schwankung für alle Basispreise und Laufzeiten. Der Markt sieht das anders, und die Abweichung ist systematisch.',
        },
        {
          type: 'list',
          items: [
            '**Skew.** Puts weit unter dem aktuellen Kurs sind teurer, als das Modell nahelegt. Der Grund ist keine Rechenschwäche, sondern Erfahrung: Aktienmärkte fallen schneller, als sie steigen, und Absicherung gegen Einbrüche ist dauerhaft gefragt. Diese Schiefe ist seit 1987 fest im Markt.',
            '**Term Structure.** Kurze und lange Laufzeiten preisen verschiedene Volatilitäten ein. Normalerweise liegt die kurze niedriger; in Krisen kehrt sich das um, weil die Unsicherheit unmittelbar ist.',
            '**Die Fläche.** Beides zusammen ergibt eine Volatilitätsfläche über Basispreis und Laufzeit. Sie ist das, was Optionshändler tatsächlich handeln – der Preis in Euro ist nur ihre Übersetzung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Volatilitätsrisikoprämie',
        },
        {
          type: 'paragraph',
          text: 'Über lange Zeiträume liegt die implizite Volatilität im Durchschnitt über der später tatsächlich eingetretenen. Wer Optionen verkauft, verdient im Mittel an dieser Differenz. Das ist keine Marktanomalie, sondern eine Versicherungsprämie: Der Verkäufer übernimmt ein Risiko, das andere loswerden wollen, und wird dafür bezahlt.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum daraus trotzdem regelmäßig Katastrophen werden',
          items: [
            'Das Ertragsprofil ist extrem schief: viele kleine Gewinne, selten ein sehr großer Verlust. Über Monate sieht die Strategie aus wie ein sicherer Zins.',
            'Genau das verleitet zum Hebeln. Wer die Position vergrößert, weil sie so ruhig läuft, vergrößert den seltenen Verlust mit.',
            'Am 5. Februar 2018 verdreifachte sich der Volatilitätsindex an einem Tag. Auf Short-Volatility ausgerichtete börsengehandelte Produkte verloren über Nacht den größten Teil ihres Werts und wurden anschließend eingestellt.',
            'Die Lehre ist nicht, dass die Prämie nicht existiert. Sie existiert. Die Lehre ist, dass ihre Vereinnahmung eine Versicherungsgeschäft ist – und Versicherer, die ihr Kapital falsch bemessen, gehen an einem einzigen Ereignis unter.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Abwicklung: wo es praktisch schiefgeht',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Vorzeitige Zuteilung.** Bei amerikanischer Ausübung kann ein verkaufter Call jederzeit zugeteilt werden – typischerweise kurz vor einem Dividendenstichtag, wenn der Zeitwert unter der Dividende liegt. Wer damit nicht rechnet, steht plötzlich ohne die Aktien da.',
            '**Pin-Risiko.** Schließt der Kurs am Verfallstag praktisch genau auf dem Basispreis, weiß ein Verkäufer bis nach Handelsschluss nicht, ob er zugeteilt wird. Am Montag hält er unter Umständen eine ungewollte Position mit vollem Marktrisiko über das Wochenende.',
            '**Kapitalmaßnahmen.** Aktiensplits, Sonderdividenden und Übernahmen führen zu Anpassungen von Basispreis und Kontraktgröße. Der angepasste Kontrakt ist oft deutlich illiquider – aussteigen wird teuer.',
            '**Margin bei Kombinationen.** Die Sicherheitsanforderung berücksichtigt Gegenpositionen nur, wenn der Broker sie als Einheit erkennt. Wird ein Bein eines Spreads vorzeitig geschlossen oder zugeteilt, steht die verbleibende Position plötzlich allein da – mit einer Anforderung, die ein Vielfaches betragen kann.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Steuerliche Einordnung – keine Steuerberatung',
          items: [
            'Optionen zählen in Deutschland zu den Termingeschäften. Für Verluste daraus galt zeitweise eine gesonderte Verrechnungsgrenze, die Absicherungsstrategien empfindlich verteuerte, weil Verluste des einen Beins Gewinne des anderen nicht in voller Höhe ausgleichen konnten.',
            'Die Rechtslage dazu hat sich mehrfach geändert und war Gegenstand verfassungsrechtlicher Kritik. Wer Optionen in nennenswertem Umfang einsetzt, sollte den aktuellen Stand prüfen lassen, statt sich auf ältere Darstellungen zu verlassen.',
            'Gezahlte und erhaltene Prämien, Glattstellungen und Zuteilungen werden steuerlich unterschiedlich behandelt. Das gehört zu jemandem mit Zulassung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Gamma und Theta sind gegenläufig – keine Position hat beide auf der guten Seite.',
            'Wer eine Option kauft, wettet immer auch darauf, dass die implizite Volatilität nicht fällt.',
            'Die Volatilitätsrisikoprämie existiert und ist eine Versicherungsprämie – mit dem Ertragsprofil einer Versicherung.',
            'Die praktischen Risiken liegen in der Abwicklung: vorzeitige Zuteilung, Pin-Risiko und Margin bei aufgelösten Kombinationen.',
          ],
        },
      ],
    },
  },
}
