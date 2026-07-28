import type { LearnTopic } from '@/data/learn/types'
import { formatDate, formatPercent } from '@/lib/format'
import {
  timingAuslassungen as AUSLASSUNGEN,
  timingGewinnJeTreffer as GEWINN_JE_TREFFER,
  timingIndex as INDEX,
  timingKostenJeRunde as KOSTEN_JE_RUNDE,
} from '@/lib/lernszenarien'
import { getLiveSeries } from '@/lib/market-live'
import {
  bestePerioden,
  noetigeTrefferquote,
  ohneBestePerioden,
  type Kurspunkt,
} from '@/lib/timing'

/*
  Dieses Thema rechnet mit den eigenen Kursdaten der Website.

  „Wer die zehn besten Tage verpasst, halbiert seine Rendite“ steht in
  Dutzenden Ratgebern – meist ohne Index, ohne Zeitraum und ohne Rechenweg.
  Die Aussage stimmt, aber in dieser Form ist sie eine Behauptung. Hier
  stammt sie aus derselben Momentaufnahme, die auch die Marktseiten
  speisen: dem DAX über die vergangenen fünf Jahre, in Wochenschritten.

  Der Zeitraum ist damit kurz und die Auflösung grob. Beides steht im Text.
  Der Punkt ist auch nicht die konkrete Zahl, sondern das Muster – und das
  ist in diesen Daten so deutlich, dass es keine Zuspitzung braucht: Die
  beste Woche des gesamten Zeitraums folgte unmittelbar auf die
  schlechteste.
*/
/*
  Die Reihe kommt aus der Service-Schicht, nicht aus der Momentaufnahme.

  `getLiveSeries` liefert `null`, wenn für ein Instrument keine echten Kurse
  vorliegen. Dieser Fall ist hier vorgesehen und nicht bloß abgefangen: Die
  Tabellen bleiben dann leer, statt Demo-Kurse als Befund auszugeben. Eine
  Aussage über Markttiming aus erfundenen Kursen wäre schlimmer als gar keine.
*/
const reihe = getLiveSeries(INDEX)
const punkte: Kurspunkt[] =
  reihe?.daily.map((punkt) => ({ d: punkt.t, c: punkt.value })) ?? []
const auslassungen = ohneBestePerioden(punkte, AUSLASSUNGEN)
const extreme = bestePerioden(punkte, 3)

const vonBis =
  punkte.length > 0
    ? { von: punkte[0].d, bis: punkte[punkte.length - 1].d, wochen: punkte.length - 1 }
    : null

/*
  Die Schwelle für eine Timing-Strategie.

  Bewusst wohlwollend gerechnet: fünf Prozent Gewinn je richtiger
  Entscheidung, ein Prozent Kosten je Runde. Ein Prozent ist für Spread,
  Gebühren und Abgeltungsteuer auf realisierte Gewinne eher niedrig
  angesetzt – und schon damit liegt die nötige Trefferquote deutlich über
  der Hälfte.
*/
const schwellen = KOSTEN_JE_RUNDE.map((kosten) => ({
  kosten,
  quote: noetigeTrefferquote(GEWINN_JE_TREFFER, kosten),
}))

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner zeigt an echten Kursdaten, was Warten kostet, und
 * benennt den Sparplan als praktische Antwort. Fortgeschritten trennt
 * tragfähige Verkaufsgründe von Scheingründen und ersetzt Entscheidungen
 * durch Regeln. Profi behandelt die empirischen Befunde zu Timing-Strategien
 * und die steuerliche Bremse.
 *
 * ## Abgrenzung zu „Anlegerpsychologie“
 *
 * Dort stehen die Muster, die Entscheidungen verzerren. Hier steht die
 * Entscheidung selbst – und was die Daten über sie sagen.
 */
export const wannKaufenVerkaufen: LearnTopic = {
  slug: 'wann-kaufen-verkaufen',
  title: 'Wann kaufen & verkaufen',
  headline: 'Der richtige Zeitpunkt ist immer der von gestern',
  metaTitle: 'Wann kaufen und verkaufen: was die Daten dazu sagen',
  metaDescription:
    'Warum sich der günstige Zeitpunkt erst im Rückblick zeigt, was Warten tatsächlich kostet, welche Verkaufsgründe tragen und welche nicht.',
  lead: 'Wer auf den richtigen Moment wartet, trägt zwei Risiken statt einem – und das zweite wird selten mitgezählt.',
  overview: [
    'Ein günstiger Einstiegszeitpunkt ist immer erst im Nachhinein erkennbar. Wer wartet, tauscht das Kursrisiko gegen das Risiko, die Aufwärtsbewegung zu verpassen – und muss zweimal richtig liegen: beim Aussteigen und beim Zurückkommen.',
    'Wie teuer das zweite Risiko ist, lässt sich an den Kursdaten dieser Website nachrechnen: Die Rendite eines Zeitraums hängt an sehr wenigen Perioden, und die liegen unmittelbar neben den schlechtesten.',
    'Die Stufen führen von dieser Rechnung über tragfähige Verkaufsgründe und feste Regeln bis zu den empirischen Befunden über Timing-Strategien und der steuerlichen Bremse jedes Verkaufs.',
  ],
  keywords: [
    'Markttiming',
    'Einstiegszeitpunkt',
    'Verkaufen',
    'Sparplan',
    'Rebalancing',
    'Stop-Loss',
  ],
  related: [
    'anlegerpsychologie',
    'cost-average-sparplan',
    'groesste-crashes',
    'portfolio-aufbau',
  ],
  calculators: ['/rechner/zinsrechner'],
  symbols: [INDEX],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Wann einsteigen? Was Warten tatsächlich kostet',
      metaDescription:
        'Warum ein guter Zeitpunkt erst im Rückblick sichtbar wird, was das Verpassen weniger starker Wochen kostet und warum ein Sparplan die Frage auflöst.',
      title: 'Was Warten kostet',
      lead: 'Die zwei Risiken, eine Rechnung an echten Kursdaten – und der Ausweg, der ohne Prognose auskommt.',
      readingMinutes: 9,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Die häufigste Frage von Einsteigern lautet: Ist jetzt ein guter Zeitpunkt? Sie ist nicht beantwortbar, und zwar nicht aus Bescheidenheit, sondern grundsätzlich. Ein günstiger Zeitpunkt zeigt sich erst, wenn man weiß, was danach passiert ist – und das weiß man immer zu spät.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Zwei Risiken, nicht eines',
          items: [
            '**Das Kursrisiko** ist bekannt: Man kauft, und es geht abwärts. Das fürchtet jeder.',
            '**Das Nichtinvestiert-Risiko** wird selten mitgezählt: Man wartet, und es geht aufwärts – ohne einen. Es fühlt sich nicht wie ein Verlust an, weil kein Geld verschwindet. Rechnerisch ist es einer.',
            'Wer aussteigt, muss außerdem **zweimal** richtig liegen: beim Aussteigen und beim Zurückkommen. Die zweite Entscheidung ist die schwerere, weil sie in einer Phase fällt, in der alle Nachrichten schlecht sind.',
            'Und noch etwas: In einem langfristig steigenden Markt ist ein Höchststand kein Warnsignal, sondern der Normalfall. Wer nur unterhalb von Höchstständen kauft, kauft in manchen Jahren gar nicht.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was das Verpassen weniger Wochen kostet',
        },
        {
          type: 'paragraph',
          text: vonBis
            ? `Statt das zu behaupten, lässt es sich nachrechnen – mit denselben Kursdaten, aus denen auch die Marktseiten dieser Website gespeist werden. Grundlage ist der DAX von ${formatDate(vonBis.von)} bis ${formatDate(vonBis.bis)}, in Wochenschritten. Ausgelassen heißt: In dieser Woche war man nicht investiert.`
            : 'Grundlage der folgenden Rechnung sind die Kursdaten dieser Website in Wochenschritten.',
        },
        {
          type: 'table',
          caption: vonBis
            ? `DAX, ${formatDate(vonBis.von)} bis ${formatDate(vonBis.bis)} – ${vonBis.wochen} Wochen`
            : 'Wirkung ausgelassener Wochen',
          head: ['Ausgelassene Wochen', 'Gesamtrendite'],
          rows: auslassungen.map((a) => [
            a.ausgelassen === 0
              ? 'keine – durchgehend investiert'
              : `die ${a.ausgelassen} besten`,
            formatPercent(a.rendite, 1),
          ]),
        },
        {
          type: 'paragraph',
          text: `Aus einem klar positiven Ergebnis wird ein Verlust, wenn zehn von rund ${vonBis?.wochen ?? 250} Wochen fehlen – das sind vier Prozent der Zeit. Die Rendite eines Zeitraums steckt in sehr wenigen Perioden, und wer nicht investiert ist, verpasst sie.`,
        },
        {
          type: 'figure',
          figure: 'timing-beste-wochen',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Grund, warum Aussteigen so selten funktioniert',
        },
        {
          type: 'paragraph',
          text: 'Man könnte einwenden: Wer aussteigt, verpasst doch auch die schlechtesten Wochen. Richtig – und genau hier liegt das Problem. Beide Sorten liegen nicht zufällig verteilt, sondern unmittelbar nebeneinander:',
        },
        {
          type: 'table',
          caption: 'Die stärksten Ausschläge desselben Zeitraums',
          head: ['Stärkste Anstiege', '', 'Stärkste Rückgänge', ''],
          rows: extreme.beste.map((b, index) => [
            formatDate(b.datum),
            formatPercent(b.rendite, 1),
            formatDate(extreme.schlechteste[index].datum),
            formatPercent(extreme.schlechteste[index].rendite, 1),
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Daten sprechen für sich',
          items: [
            'Die stärkste Aufwärtswoche des gesamten Zeitraums folgte unmittelbar auf die stärkste Abwärtswoche – eine Woche später.',
            'Wer nach dem Einbruch verkauft hat, war in der Erholung nicht dabei. Das ist kein Ausreißer, sondern das Muster: Starke Bewegungen treten in beiden Richtungen in denselben unruhigen Phasen auf.',
            'Um vom Aussteigen zu profitieren, müsste man vor dem Rückgang aussteigen **und** vor der Erholung zurückkommen – und zwar innerhalb weniger Tage, in einer Phase, in der alle Nachrichten für das Gegenteil sprechen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der praktische Ausweg',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Der Sparplan.** Er löst die Frage auf, statt sie zu beantworten: Gekauft wird zu festen Terminen, unabhängig von der Marktlage. Damit ist der Zeitpunkt keine Entscheidung mehr, sondern eine Routine – und Routinen werden nicht von Nachrichten beeinflusst.',
            '**Größere Summen stückeln.** Wer einen größeren Betrag anzulegen hat, kann ihn über einige Monate verteilen. Rechnerisch ist das im Durchschnitt etwas schlechter als sofort alles anzulegen – dafür ist es psychologisch deutlich leichter durchzuhalten, und das ist die Größe, die tatsächlich zählt.',
            '**Nach Zeithorizont auswählen, nicht nach Prognose.** Die Frage „wann“ ersetzt man am besten durch „wie lange“. Geld, das in drei Jahren gebraucht wird, gehört nicht in Aktien – egal wie der Markt gerade steht. Geld, das zwanzig Jahre liegen kann, gehört hinein, ebenfalls unabhängig vom Stand.',
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
            'Warten hat ein eigenes Risiko – es fühlt sich nur nicht wie eines an.',
            'Wenige Wochen entscheiden über die Rendite ganzer Jahre.',
            'Die besten Wochen folgen unmittelbar auf die schlechtesten; wer die einen meidet, verpasst die anderen.',
            'Der Sparplan beantwortet die Zeitpunktfrage nicht, er löst sie auf.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Verkaufen: tragfähige Gründe und feste Regeln',
      metaDescription:
        'Welche vier Gründe für einen Verkauf tragen, welche nicht, was Stop-Kurse leisten und warum Regeln besser sind als Entscheidungen.',
      title: 'Wann Verkaufen tatsächlich richtig ist',
      lead: 'Vier tragfähige Gründe, vier Scheingründe – und warum eine vorher aufgeschriebene Regel jede spätere Entscheidung schlägt.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Vier Gründe, die tragen',
        },
        {
          type: 'table',
          caption: 'Wann ein Verkauf begründet ist',
          head: ['Grund', 'Warum er trägt'],
          rows: [
            [
              'Das Geld wird gebraucht',
              'Der ursprüngliche Zweck tritt ein oder die Lebenslage ändert sich. Der beste aller Gründe – er hat mit dem Markt nichts zu tun',
            ],
            [
              'Das Ziel ist erreicht',
              'Wer für eine bestimmte Summe gespart hat und sie hat, muss das Risiko nicht weiter tragen',
            ],
            [
              'Die Anlagethese ist widerlegt',
              'Der Grund für den Kauf besteht nicht mehr – das Geschäftsmodell ist beschädigt, der Fonds hat die Strategie geändert. Nicht: Der Kurs ist gefallen',
            ],
            [
              'Die Aufteilung ist verschoben',
              'Rebalancing nach einer vorher festgelegten Regel. Kein Urteil über den Markt, sondern Wiederherstellung des geplanten Risikos',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Drei dieser vier Gründe haben eines gemeinsam: Sie stammen nicht aus dem Markt, sondern aus dem eigenen Leben oder dem eigenen Plan. Genau das ist das Erkennungsmerkmal eines guten Verkaufsgrundes.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Vier, die nicht tragen',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Scheingründe',
          items: [
            '**Der eigene Einstiegskurs.** Eine Zahl, die nur du kennst und die für die Zukunft bedeutungslos ist. „Erst wieder bei null verkaufen“ ist eine der teuersten Regeln überhaupt.',
            '**Runde Marken und Chartlinien.** Ein Index bei 20.000 Punkten ist nicht bedeutsamer als bei 19.847. Die Zahl wirkt nur, weil unser Zahlensystem zehn Finger hat.',
            '**Medienstimmung und Einzelprognosen.** Was in der Zeitung steht, wissen alle – es steckt im Kurs. Eine Prognose, die dort erscheint, ist keine Information mehr, sondern eine Meinung mit Verzögerung.',
            '**Das Gefühl, Gewinne mitnehmen zu müssen.** Der Dispositionseffekt in Reinform: Gewinner werden zu früh verkauft, Verlierer zu lange gehalten. Beides folgt dem Bedürfnis, sich nichts eingestehen zu müssen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Regeln schlagen Entscheidungen',
        },
        {
          type: 'paragraph',
          text: 'Der Unterschied zwischen einer Regel und einer Entscheidung ist der Zeitpunkt: Eine Regel wird festgelegt, solange nichts passiert ist. Eine Entscheidung fällt unter Druck. Alles, was empirisch hilft, setzt deshalb vorher an.',
        },
        {
          type: 'list',
          items: [
            '**Rebalancing mit Bandbreiten.** Zurücksetzen, sobald eine Position mehr als eine festgelegte Spanne abweicht. Das wirkt automatisch antizyklisch – man verkauft, was gut lief, und kauft, was schlecht lief, ohne darüber nachdenken zu müssen.',
            '**Ein schriftlicher Krisenplan.** Zwei Sätze genügen: Was tue ich bei einem Rückgang von 20 Prozent, was bei 40? Aufgeschrieben in ruhiger Lage, gelesen in unruhiger. Die häufigste sinnvolle Antwort lautet „nichts“, und genau deshalb hilft es, sie vorher notiert zu haben.',
            '**Weniger handeln.** Die Handelsfrequenz zu senken ist der einzige Renditehebel, der sicher wirkt und nichts kostet – jede eingesparte Transaktion spart Gebühren, Spread und meist Steuer.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was Stop-Kurse leisten – und was nicht',
          items: [
            '**Sie leisten:** eine automatische Verkaufsschwelle für den Fall, dass man selbst nicht reagieren kann oder will. Bei einer einzelnen, konzentrierten Position kann das sinnvoll sein.',
            '**Sie leisten nicht:** einen garantierten Preis. Ein Stop löst eine Marktorder aus – bei einer Kurslücke über Nacht wird zum nächsten verfügbaren Kurs verkauft, der deutlich darunter liegen kann.',
            '**Sie werden regelmäßig durch Schwankung ausgelöst**, ohne dass sich etwas Grundsätzliches geändert hätte. Man wird ausgestoppt und steht dann vor derselben Frage wie jeder, der ausgestiegen ist: Wann zurück?',
            'Für ein breit gestreutes Depot mit langem Horizont ist ein Stop-Kurs deshalb meist kontraproduktiv – er verwandelt ein vorübergehendes Buchminus in einen realisierten Verlust.',
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
            'Gute Verkaufsgründe stammen aus dem eigenen Leben oder Plan, nicht aus dem Markt.',
            'Der eigene Einstiegskurs ist für die Zukunft bedeutungslos.',
            'Rebalancing nach Bandbreiten wirkt antizyklisch, ohne dass man entscheiden muss.',
            'Stop-Kurse garantieren keinen Preis und stellen dieselbe Rückkehrfrage wie jeder Ausstieg.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Markttiming: empirische Befunde und Steuerbremse',
      metaDescription:
        'Welche Trefferquote eine Timing-Strategie braucht, was Trendfolge nach Kosten liefert, wie Rückrechnungen täuschen und was jeder Verkauf steuerlich kostet.',
      title: 'Was die Empirie hergibt',
      lead: 'Die Schwelle, die eine Strategie überschreiten muss, warum Rückrechnungen zu gut aussehen – und die Bremse, die nach jedem Verkauf greift.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die Schwelle, bevor überhaupt von Prognose die Rede ist',
        },
        {
          type: 'paragraph',
          text: `Eine Timing-Strategie muss nicht nur häufiger richtig als falsch liegen – sie muss ihre eigenen Kosten mitverdienen. Ein einfaches Modell zeigt, wie stark das die Latte hebt: Angenommen, jede richtige Entscheidung bringt ${formatPercent(GEWINN_JE_TREFFER, 0)} und jede falsche kostet dasselbe. Dazu kommen Kosten je Runde – Spread, Gebühren, Abgeltungsteuer auf realisierte Gewinne:`,
        },
        {
          type: 'table',
          caption: `Nötige Trefferquote bei ${formatPercent(GEWINN_JE_TREFFER, 0)} Gewinn je richtiger Entscheidung`,
          head: ['Kosten je Runde', 'Nötige Trefferquote'],
          rows: schwellen.map((s) => [
            formatPercent(s.kosten, 1),
            s.quote === null ? 'nicht erreichbar' : formatPercent(s.quote, 1),
          ]),
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was daran bemerkenswert ist',
          items: [
            'Ohne Kosten genügen fünfzig Prozent – das ist die Münzwurf-Schwelle und der Grund, warum Timing im Gespräch immer machbar klingt.',
            'Schon ein Prozent Kosten je Runde hebt sie spürbar darüber. Und ein Prozent ist für Spread, Gebühren und Steuer eher niedrig angesetzt.',
            'Die Schwelle gilt **je Runde**. Wer zwölfmal im Jahr entscheidet, muss diese Trefferquote zwölfmal erreichen – nicht einmal.',
            'Das Modell ist grob. Sein Zweck ist zu zeigen, dass die Diskussion über Prognosefähigkeit erst danach beginnt: Selbst wer den Markt besser einschätzt als der Durchschnitt, verdient daran nichts, wenn der Vorsprung kleiner ist als die Reibung.',
          ],
        },
        {
          type: 'figure',
          figure: 'timing-trefferquote',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was systematische Ansätze liefern',
        },
        {
          type: 'list',
          items: [
            '**Trendfolge über gleitende Durchschnitte.** Investiert sein, solange der Kurs über seinem Durchschnitt liegt, sonst aussteigen. In Rückrechnungen sieht das oft gut aus, weil es große Abwärtsphasen abschneidet. In der Umsetzung frisst die hohe Zahl von Fehlsignalen in Seitwärtsphasen den Vorteil – dazu Kosten und Steuern bei jedem Wechsel. Nach Abzug bleibt meist eine Rendite unter dem schlichten Halten, bei geringerer Schwankung.',
            '**Bewertungsbasierte Steuerung.** Weniger investieren, wenn der Markt teuer bewertet ist. Der Zusammenhang zwischen Bewertung und langfristiger Folgerendite ist gut belegt – aber er wirkt über zehn Jahre und mehr. Wer ihn umsetzt, sitzt unter Umständen ein Jahrzehnt an der Seitenlinie, während der Markt weiter steigt. Fast niemand hält das durch.',
            '**Saisonale Muster.** Regelmäßig veröffentlicht, regelmäßig widerlegt. Wer genügend Kalendermuster prüft, findet immer eines, das in der Vergangenheit funktioniert hat – das ist kein Befund, sondern eine Eigenschaft der Suche.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum Rückrechnungen zu gut aussehen',
          items: [
            '**Überanpassung.** Wer Parameter so lange verändert, bis das Ergebnis stimmt, hat die Vergangenheit beschrieben, nicht die Zukunft vorhergesagt. Je mehr Stellschrauben, desto sicherer.',
            '**Publikationsverzerrung.** Veröffentlicht wird, was funktioniert hat. Die gescheiterten Versuche stehen nirgends – und ohne sie lässt sich nicht beurteilen, wie außergewöhnlich der eine Erfolg war.',
            '**Umsetzungskosten fehlen.** Papierrenditen rechnen ohne Spread, ohne Marktwirkung eigener Aufträge und ohne Steuern. Genau diese drei Posten entscheiden bei häufigem Handeln über das Ergebnis.',
            'Die einzige belastbare Prüfung ist ein Test auf Daten, die bei der Entwicklung nicht verwendet wurden – und selbst dort schwächen sich Effekte nach ihrer Veröffentlichung regelmäßig ab.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die steuerliche Bremse',
        },
        {
          type: 'paragraph',
          text: 'Jeder Verkauf im Privatvermögen realisiert Gewinne und löst Abgeltungsteuer aus. Der eigentliche Preis ist dabei nicht die Steuer selbst – die wäre irgendwann ohnehin fällig –, sondern der **verlorene Stundungseffekt**: Der abgeführte Betrag arbeitet nicht mehr mit. Über eine lange Restlaufzeit ist das der größere Posten.',
        },
        {
          type: 'list',
          items: [
            '**FIFO.** Beim Teilverkauf gelten die ältesten Anteile als verkauft – bei gestiegenen Kursen also die mit dem höchsten Gewinn und der höchsten Steuer. Wählen lässt sich das nicht; steuern lässt es sich nur über getrennte Depots.',
            '**Getrennte Verlusttöpfe.** Verluste aus Einzelaktien sind ausschließlich mit Gewinnen aus Einzelaktien verrechenbar. Wer eine Timing-Strategie über Einzelwerte fährt, kann Verluste dort nicht gegen Gewinne aus Fonds stellen.',
            '**Die Rechnung je Runde.** Wer häufig handelt, zahlt die Steuer immer wieder auf zwischenzeitliche Gewinne. Wer hält, zahlt sie einmal am Ende – auf einen Betrag, der in der Zwischenzeit weitergearbeitet hat.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Allgemeine Information, keine Steuerberatung',
          items: [
            'Die Behandlung von Veräußerungsgewinnen und die Verrechnung von Verlusten hängen an Einzelheiten, die sich im konkreten Fall auswirken.',
            'Bei größeren Beträgen oder Auslandsbezug gehört das zu jemandem mit Zulassung.',
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
            'Die nötige Trefferquote liegt allein wegen der Kosten deutlich über der Hälfte – und gilt je Runde.',
            'Trendfolge senkt die Schwankung und liefert nach Kosten meist weniger als schlichtes Halten.',
            'Rückrechnungen sind durch Überanpassung und Publikationsverzerrung systematisch zu optimistisch.',
            'Der Preis eines Verkaufs ist nicht die Steuer, sondern der verlorene Stundungseffekt darauf.',
          ],
        },
      ],
    },
  },
}
