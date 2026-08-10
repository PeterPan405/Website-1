import type { LearnTopic } from '@/data/learn/types'
import { formatCurrency, formatNumber } from '@/lib/format'
import { sparplanKurse as KURSE, sparplanRate as RATE } from '@/lib/lernszenarien'

/*
  Das Sparplanbeispiel wird gerechnet, nicht getippt.

  Der Durchschnittskosteneffekt ist der Fall, in dem eine von Hand geschriebene
  Tabelle am ehesten still falsch wird: Es sind zwei Durchschnitte, die
  verwechselt werden können, und genau darin liegt die Aussage. Als Rechnung
  kann die Tabelle ihrer eigenen Schlussfolgerung nicht widersprechen.
*/

const kaeufe = KURSE.map((kurs) => ({ kurs, anteile: RATE / kurs }))
const anteileGesamt = kaeufe.reduce((summe, kauf) => summe + kauf.anteile, 0)
const eingezahlt = RATE * KURSE.length
/** Was ein Anteil im Schnitt gekostet hat – der Wert, auf den es ankommt. */
const durchschnittspreis = eingezahlt / anteileGesamt
/** Der schlichte Mittelwert der Kurse – die Zahl, mit der er verwechselt wird. */
const kursdurchschnitt = KURSE.reduce((summe, kurs) => summe + kurs, 0) / KURSE.length

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt die Mechanik am durchgerechneten Beispiel und
 * benennt den eigentlichen Vorteil. Fortgeschritten stellt den ehrlichen
 * Vergleich mit der Einmalanlage an. Profi behandelt Dynamisierung,
 * Rebalancing über Raten, Value Averaging und den Übergang zur Entnahme.
 *
 * ## Der Ton dieses Themas
 *
 * Der Durchschnittskosteneffekt wird in der Werbung als Renditevorteil
 * verkauft. Er ist keiner. Das steht hier deutlich – und ebenso deutlich, dass
 * der Sparplan trotzdem für die meisten Menschen die richtige Form ist, nur aus
 * einem anderen Grund.
 */
export const costAverageSparplan: LearnTopic = {
  slug: 'cost-average-sparplan',
  title: 'Cost-Average & Sparplan',
  headline: 'Der Sparplan: automatisch anlegen, ohne den Zeitpunkt zu erraten',
  metaTitle: 'Sparplan und Cost-Average-Effekt erklärt',
  metaDescription:
    'Wie der Durchschnittskosteneffekt rechnerisch funktioniert, warum eine Einmalanlage oft besser abschneidet und worin der echte Vorteil des Sparplans liegt.',
  lead: 'Ein Sparplan nimmt dir die Frage nach dem richtigen Zeitpunkt ab – und das ist sein Wert, nicht der oft beworbene Rechenvorteil.',
  overview: [
    'Ein Sparplan investiert automatisch feste Beträge zu festen Terminen. Bei hohen Kursen kaufst du weniger Anteile, bei niedrigen mehr – der Durchschnittspreis deiner Anteile liegt unter dem Durchschnitt der Kurse.',
    'Dieser mathematische Effekt wird häufig überschätzt. Bei langfristig steigenden Märkten schneidet eine sofortige Einmalanlage im Durchschnitt besser ab, weil das Geld länger investiert ist.',
    'Die Stufen führen von der Grundmechanik über den korrekten Vergleich mit der Einmalanlage bis zu Dynamisierung, Rebalancing über Raten und der Entnahmephase.',
  ],
  keywords: [
    'Sparplan',
    'Cost-Average-Effekt',
    'Durchschnittskosteneffekt',
    'Einmalanlage',
    'ETF-Sparplan',
  ],
  related: ['etf', 'zinseszins', 'wann-kaufen-verkaufen', 'portfolio-aufbau'],
  calculators: ['/rechner/zinsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Sparplan einfach erklärt – mit Rechenbeispiel',
      metaDescription:
        'Wie der Durchschnittskosteneffekt entsteht, ein durchgerechnetes Beispiel, wie du einen Sparplan einrichtest und welcher Vorteil der wichtigste ist.',
      title: 'Sparplan einfach erklärt',
      lead: 'Nach dieser Stufe verstehst du den Durchschnittskosteneffekt an einem durchgerechneten Beispiel – und weißt, warum er nicht der eigentliche Grund für einen Sparplan ist.',
      readingMinutes: 10,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ein Sparplan ist ein Dauerauftrag, der statt auf ein Konto in ein Wertpapier geht. Jeden Monat derselbe Betrag, unabhängig davon, wie die Kurse gerade stehen. Genau daraus entsteht ein Effekt, den man leicht übersieht.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Derselbe Betrag kauft verschieden viel',
        },
        {
          type: 'paragraph',
          text: `Angenommen, du legst ${formatCurrency(RATE, 0)} im Monat an, und der Kurs schwankt über ein halbes Jahr kräftig:`,
        },
        {
          type: 'table',
          caption: `${formatCurrency(RATE, 0)} monatlich bei schwankendem Kurs`,
          head: ['Monat', 'Kurs je Anteil', 'Gekaufte Anteile'],
          rows: kaeufe.map((kauf, index) => [
            String(index + 1),
            formatCurrency(kauf.kurs, 0),
            formatNumber(kauf.anteile, 2),
          ]),
        },
        {
          type: 'keyfacts',
          items: [
            { label: 'Eingezahlt', value: formatCurrency(eingezahlt, 0) },
            { label: 'Anteile insgesamt', value: formatNumber(anteileGesamt, 2) },
            {
              label: 'Durchschnittlich gezahlt je Anteil',
              value: formatCurrency(durchschnittspreis, 2),
            },
            {
              label: 'Durchschnitt der sechs Kurse',
              value: formatCurrency(kursdurchschnitt, 2),
            },
          ],
        },
        {
          type: 'paragraph',
          text: `Du hast im Schnitt ${formatCurrency(durchschnittspreis, 2)} je Anteil bezahlt, obwohl der mittlere Kurs bei ${formatCurrency(kursdurchschnitt, 2)} lag. Der Grund ist schlicht: In den billigen Monaten hat dieselbe Rate mehr Anteile gekauft, und diese Monate wiegen deshalb in deinem Durchschnitt schwerer. Das ist der **Durchschnittskosteneffekt**.`,
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Und jetzt die unbequeme Wahrheit',
          items: [
            'Dieser Effekt ist **kein Renditevorteil**. Er entsteht nur, weil der Kurs zwischendurch gefallen ist – und dass er fällt, war nicht die Leistung des Sparplans.',
            'Bei einem durchgehend steigenden Kurs kehrt sich der Effekt um: Dann kauft jede spätere Rate teurer, und wer alles zu Beginn angelegt hätte, stünde besser da.',
            'In der Werbung steht der Effekt trotzdem an erster Stelle, weil er sich gut rechnet. Der echte Grund für einen Sparplan ist ein anderer.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der eigentliche Vorteil',
        },
        {
          type: 'paragraph',
          text: 'Ein Sparplan beantwortet die Frage „ist jetzt ein guter Zeitpunkt?“ ein für alle Mal mit: egal. Und das ist mehr wert als jeder Rechenvorteil, denn diese Frage ist unbeantwortbar und hält Menschen jahrelang davon ab, überhaupt anzufangen.',
        },
        {
          type: 'list',
          items: [
            '**Er läuft ohne Entscheidung.** Wer jeden Monat neu entscheiden muss, entscheidet irgendwann gegen sich – nach schlechten Nachrichten setzt man aus, und das sind erfahrungsgemäß die günstigen Monate.',
            '**Er passt zum Einkommen.** Die meisten Menschen haben keine große Summe, sondern einen monatlichen Überschuss. Für sie stellt sich die Frage Einmalanlage gegen Sparplan gar nicht.',
            '**Er funktioniert mit kleinen Beträgen.** Bruchstücke von Anteilen machen jede Rate möglich, auch 25 Euro.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Praktisch einrichten',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Notgroschen zuerst.** Drei bis sechs Monatsausgaben auf dem Tagesgeldkonto. Ohne ihn wird der Sparplan zur Notreserve – und dann verkauft man im ungünstigsten Moment.',
            '**Rate wählen, die auch in einem schlechten Monat trägt.** Lieber 100 Euro durchhalten als 300 nach einem halben Jahr abbrechen.',
            '**Kosten je Ausführung prüfen.** Ein Euro auf 25 Euro Rate sind vier Prozent – mehr, als die laufenden Kosten eines ETF in zehn Jahren ausmachen. Viele Broker führen Sparpläne kostenfrei aus.',
            '**Termin ist fast egal.** Ob am Ersten oder am Fünfzehnten gekauft wird, macht über Jahrzehnte keinen erkennbaren Unterschied.',
          ],
        },
        {
          type: 'figure',
          figure: 'sparplan-durchschnittspreis',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was am Ausführungstag tatsächlich passiert',
        },
        {
          type: 'paragraph',
          text: 'Der Broker bucht die Rate ein oder zwei Tage vorher vom Verrechnungskonto ab und kauft am Ausführungstag. Gekauft wird zu **einem** Kurs, meist einmal am Vormittag – nicht zum Tagesdurchschnitt und nicht zu einem Kurs, den du bestimmst. Ein Limit gibt es bei Sparplänen nicht, und das ist richtig so: Ein Limit, das nicht erreicht wird, hieße Rate nicht ausgeführt, und damit wäre der ganze Zweck dahin.',
        },
        {
          type: 'paragraph',
          text: 'Weil eine Rate selten genau auf einen ganzen Anteil passt, bekommst du **Bruchstücke** – 0,0731 Anteile eines ETF sind völlig normal. Sie verhalten sich wie ganze Anteile: Sie steigen und fallen mit dem Kurs und bekommen ihren Anteil an den Ausschüttungen. Ein Punkt ist trotzdem zu kennen: Bei einem Depotwechsel zu einem anderen Broker lassen sich Bruchstücke oft nicht übertragen, sondern werden verkauft. Das ist verkraftbar, aber es ist ein steuerpflichtiger Verkauf.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was du unterwegs ändern darfst – und was das kostet',
          items: [
            '**Rate ändern:** jederzeit, kostenlos, wirkt ab der nächsten Ausführung. Nach oben, wenn das Gehalt steigt; nach unten, wenn es eng wird.',
            '**Aussetzen:** ebenfalls jederzeit. Besser als kündigen, denn ein pausierter Sparplan wird eher wieder aufgenommen als ein gelöschter neu angelegt.',
            '**Wertpapier wechseln:** Der alte Bestand bleibt liegen, die neuen Raten fließen woanders hin. Es entsteht kein Verkauf und damit keine Steuer.',
            '**Verkaufen:** Das ist der einzige Schritt, der etwas kostet – Steuer auf den Gewinn und, falls die Kurse gerade unten stehen, ein festgeschriebener Verlust.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Fehler, der am meisten kostet',
        },
        {
          type: 'paragraph',
          text: 'Es ist nicht die falsche Rate und nicht der falsche Termin. Es ist das **Aussetzen im Rückgang**. Wer den Sparplan pausiert, weil die Kurse gefallen sind, streicht genau die Monate, in denen die Rate am meisten Anteile kauft – und schaltet damit den einen Effekt ab, wegen dem der Sparplan überhaupt beworben wird. Wieder eingestiegen wird erfahrungsgemäß erst, wenn es sich wieder gut anfühlt, also nach der Erholung und damit teurer.',
        },
        {
          type: 'paragraph',
          text: 'Der praktische Schutz dagegen ist nicht Disziplin, sondern die **Höhe der Rate**. Sie muss so gewählt sein, dass sie auch in einem schlechten Monat nicht wehtut – dann gibt es keinen Anlass, die Ausnahme zu machen. Eine Rate, die man drei Jahre durchhält, schlägt jede Rate, die man nach acht Monaten aussetzt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Dieselbe Rate kauft bei niedrigen Kursen mehr Anteile – daher der niedrigere Durchschnittspreis.',
            'Der Effekt ist kein Renditevorteil; er setzt fallende Kurse voraus.',
            'Der wirkliche Wert liegt darin, dass keine Zeitpunktentscheidung mehr nötig ist.',
            'Notgroschen vor Sparplan, und eine Rate, die auch in schlechten Monaten trägt.',
            'Gekauft wird zu einem festen Zeitpunkt und ohne Limit – Bruchstücke sind der Normalfall.',
            'Rate ändern, aussetzen und das Wertpapier wechseln kosten nichts. Nur Verkaufen kostet.',
            'Der teuerste Fehler ist das Aussetzen im Rückgang – dort wirkt der Sparplan am stärksten.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Sparplan gegen Einmalanlage: der ehrliche Vergleich',
      metaDescription:
        'Warum die Einmalanlage im Durchschnitt vorn liegt, wann Stückeln trotzdem sinnvoll ist und wie Kosten und Ausführungstermine das Ergebnis beeinflussen.',
      title: 'Sparplan oder Einmalanlage?',
      lead: 'Was die Untersuchungen tatsächlich zeigen, wann Stückeln trotzdem die bessere Wahl ist und welche Details messbar wirken.',
      readingMinutes: 9,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Die Frage stellt sich nur in einem Fall: Man hat eine größere Summe verfügbar – Erbschaft, Abfindung, verkaufte Immobilie – und muss entscheiden, ob sie auf einmal oder verteilt angelegt wird. Wer aus dem laufenden Einkommen spart, hat die Wahl nicht.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was die Untersuchungen zeigen',
        },
        {
          type: 'paragraph',
          text: 'Über lange Zeiträume und viele Startzeitpunkte liegt die sofortige Einmalanlage im Durchschnitt vorn – in den bekannten Auswertungen für den US-Markt in ungefähr zwei von drei Fällen. Der Grund ist nicht Timing, sondern Zeit: Wer verteilt anlegt, hat einen Teil des Geldes monatelang nicht am Markt. In einem Markt, der langfristig steigt, kostet jede Wartezeit erwartete Rendite.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum „im Durchschnitt“ hier wichtig ist',
          items: [
            'Im Durchschnitt heißt: über sehr viele Startzeitpunkte hinweg. Für den einen Zeitpunkt, den man selbst erwischt, sagt es nichts.',
            'In etwa einem Drittel der Fälle war das Verteilen besser – nämlich wenn kurz nach dem Start ein Rückgang kam.',
            'Wer die 500.000 Euro aus dem Hausverkauf am Tag vor einem Crash anlegt, hat vom statistischen Durchschnitt nichts.',
          ],
        },
        {
          type: 'figure',
          figure: 'sparplan-wartezeit',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum Stückeln trotzdem oft richtig ist',
        },
        {
          type: 'paragraph',
          text: 'Weil die Rechnung nur die Rendite kennt und nicht den Menschen. Wer eine große Summe auf einmal anlegt und drei Wochen später 20 Prozent im Minus steht, macht eine Erfahrung, die viele nicht durchhalten – und ein Verkauf im Rückgang kostet weit mehr, als die Wartezeit gekostet hätte.',
        },
        {
          type: 'paragraph',
          text: 'Die Verteilung über sechs bis zwölf Monate ist deshalb kein Rechenfehler, sondern eine bewusst bezahlte Versicherungsprämie gegen die eigene Reaktion. Wer sie zahlt, sollte nur wissen, dass er sie zahlt – und wofür.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Eine brauchbare Entscheidungshilfe',
          items: [
            'Frage dich: Wenn der Markt vier Wochen nach meiner Einmalanlage um 30 Prozent fällt – halte ich das aus, ohne zu verkaufen?',
            'Ein klares Ja spricht für die Einmalanlage; sie ist im Erwartungswert besser.',
            'Ein Zögern spricht für sechs bis zwölf Monatsraten. Ein längeres Verteilen bringt kaum noch etwas und kostet zunehmend Zeit am Markt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Details, die tatsächlich wirken – und solche, die es nicht tun',
        },
        {
          type: 'table',
          caption: 'Wo sich Optimieren lohnt',
          head: ['Stellschraube', 'Wirkung'],
          rows: [
            [
              'Kosten je Ausführung',
              'Erheblich bei kleinen Raten. Ein Euro auf 25 Euro sind vier Prozent, die sofort verloren sind.',
            ],
            [
              'Laufende Kosten des Fonds',
              'Erheblich über Jahrzehnte, weil sie auf das gesamte Vermögen anfallen.',
            ],
            [
              'Ausführungstag im Monat',
              'Praktisch null. Auswertungen über Jahrzehnte finden keinen belastbaren Unterschied.',
            ],
            [
              'Wöchentlich statt monatlich',
              'Praktisch null in der Rendite; nur mehr Ausführungen und damit womöglich mehr Kosten.',
            ],
            [
              'Thesaurierend statt ausschüttend',
              'Spürbar über lange Zeiträume – nicht wegen der Rendite, sondern weil keine Wiederanlage von Hand nötig ist.',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die Reihenfolge dieser Tabelle ist die Reihenfolge, in der man sich kümmern sollte. Wer über den optimalen Ausführungstag nachdenkt, während sein Sparplan pro Ausführung 1,50 Euro kostet, optimiert das Falsche.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Die Einmalanlage gewinnt im Durchschnitt, weil das Geld länger am Markt ist – nicht durch besseres Timing.',
            'Verteilen über sechs bis zwölf Monate ist eine bezahlte Versicherung gegen die eigene Reaktion.',
            'Kosten je Ausführung und laufende Kosten wirken; der Ausführungstag wirkt nicht.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Sparplan für Profis: Dynamisierung, Rebalancing, Entnahme',
      metaDescription:
        'Dynamisierte Raten, Rebalancing über neue Einzahlungen statt Verkäufe, Value Averaging im Test sowie der Übergang in die Entnahmephase.',
      title: 'Sparplan auf Profi-Niveau',
      lead: 'Wie sich ein Sparplan steuern lässt, warum neue Raten das beste Rebalancing-Werkzeug sind und wie der Übergang zur Entnahme aussieht.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Dynamisierung: die Rate wächst mit',
        },
        {
          type: 'paragraph',
          text: 'Eine feste Rate über dreißig Jahre wird real immer kleiner. Bei 2,5 Prozent Inflation hat sie nach dreißig Jahren nur noch knapp die Hälfte ihrer heutigen Kaufkraft. Wer die Rate jährlich um die Inflationsrate oder um die eigene Gehaltssteigerung erhöht, hält sie real konstant – und erhöht das Endvermögen erheblich, ohne dass es sich in irgendeinem Monat nach Verzicht anfühlt.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Der beste Zeitpunkt für die Erhöhung',
          items: [
            'Direkt nach einer Gehaltserhöhung, bevor sich der Lebensstandard daran gewöhnt hat.',
            'Viele Broker bieten eine automatische jährliche Dynamisierung um einen festen Prozentsatz – einmal eingerichtet, nie wieder Thema.',
            'Wichtig ist nur, dass die Erhöhung stattfindet. Ob im Januar oder im Juli, spielt keine Rolle.',
          ],
        },
        {
          type: 'figure',
          figure: 'sparplan-dynamisierung',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Rebalancing über neue Raten statt über Verkäufe',
        },
        {
          type: 'paragraph',
          text: 'Wer mehrere Bausteine hält – etwa einen Welt-ETF und einen Schwellenländer-ETF –, verschiebt deren Verhältnis mit jeder Kursbewegung. Der klassische Weg zurück zur Zielgewichtung ist, den gestiegenen Teil zu verkaufen und den gefallenen zu kaufen. Das löst Steuern aus und kostet Gebühren.',
        },
        {
          type: 'paragraph',
          text: 'In der Ansparphase gibt es einen besseren Weg: **Die neuen Raten fließen dorthin, wo etwas fehlt.** Ist der Aktienanteil zu hoch, geht die nächste Rate in den Anleiheteil. Kein Verkauf, keine Steuer, keine Verkaufsgebühr. Das funktioniert, solange die neuen Einzahlungen im Verhältnis zum Bestand groß genug sind – bei einem Depot von 400.000 Euro und 300 Euro Rate im Monat verschiebt sich damit nichts mehr, und man kommt um Verkäufe nicht herum.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Value Averaging: klingt besser, als es ist',
        },
        {
          type: 'paragraph',
          text: 'Beim **Value Averaging** wird nicht ein fester Betrag eingezahlt, sondern das Depot soll um einen festen Betrag wachsen. Ist der Markt gestiegen, zahlt man weniger ein oder verkauft sogar; ist er gefallen, zahlt man mehr. Rechnerisch kauft man dadurch noch stärker antizyklisch als beim gewöhnlichen Sparplan.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Drei Gründe, warum es in der Praxis kaum jemand durchhält',
          items: [
            '**Die nötigen Beträge sind unvorhersehbar.** Nach einem Kursrutsch verlangt die Methode die größte Einzahlung – ausgerechnet dann, wenn oft auch das Einkommen unsicher ist.',
            '**Es erzeugt Verkäufe in guten Phasen**, und die kosten Steuern, die beim schlichten Sparplan nicht anfallen.',
            '**Der gemessene Vorsprung ist klein** und verschwindet in vielen Auswertungen, sobald Steuern und Handelskosten berücksichtigt werden.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Übergang in die Entnahmephase',
        },
        {
          type: 'paragraph',
          text: 'Ein Sparplan endet nicht an einem Stichtag. Der Übergang beginnt Jahre vor der ersten Entnahme, und zwar aus einem Grund, der in der Ansparphase keine Rolle spielt: dem Sequenzrisiko. Fällt der Markt kurz nach Beginn der Entnahmen, werden Anteile zu niedrigen Kursen verkauft, und diese Anteile fehlen dauerhaft.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Fünf bis zehn Jahre vorher**: den Anteil schwankungsarmer Anlagen schrittweise erhöhen – über die laufenden Raten, nicht über Verkäufe.',
            '**Zwei bis drei Jahre vorher**: einen Puffer aufbauen, aus dem sich schlechte Jahre überbrücken lassen, ohne Anteile zu verkaufen.',
            '**Beim Übergang**: von thesaurierend auf ausschüttend wechseln ist möglich, aber ein Verkauf mit Steuerfolge. Oft genügt es, die Ausschüttungen eines neuen Bausteins zu nutzen und den alten liegen zu lassen.',
            '**Während der Entnahme**: flexibel statt fest entnehmen. Wer in einem Rückgangsjahr weniger braucht, verkauft weniger zum Tiefstkurs.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Keine Steuerberatung',
          items: [
            'Umschichtungen lösen in Deutschland regelmäßig Abgeltungsteuer aus, und beim Teilverkauf gilt FIFO – die ältesten Anteile gelten als zuerst verkauft.',
            'Bei größeren Beträgen gehört die Reihenfolge der Schritte zu jemandem mit Zulassung.',
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
            'Eine feste Rate schrumpft real – Dynamisierung hält sie konstant, ohne dass es weh tut.',
            'In der Ansparphase ist die nächste Rate das steuerfreie Rebalancing-Werkzeug.',
            'Value Averaging verlangt die größten Einzahlungen im ungünstigsten Moment.',
            'Der Übergang zur Entnahme beginnt Jahre vorher, nicht am Stichtag.',
          ],
        },
      ],
    },
  },
}
