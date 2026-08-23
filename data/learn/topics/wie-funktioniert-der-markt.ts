import type { LearnTopic } from '@/data/learn/types'
import { formatPercent } from '@/lib/format'

/*
  Der Spread wird gerechnet.

  „Ein enger Spread ist gut“ weiß jeder und niemand weiß, was er kostet.
  Dabei ist es die einfachste Rechnung der ganzen Website: Wer kauft und
  sofort wieder verkauft, hat den Spread verloren – einmal, in voller Höhe.
  Bezogen auf die Handelsfrequenz wird daraus eine jährliche Größe, und die
  überrascht regelmäßig.
*/
const SPREADS = [0.02, 0.1, 0.5, 2]
const HANDEL_PRO_JAHR = 12

const spreadreihe = SPREADS.map((spread) => ({
  spread,
  jeRundlauf: spread,
  jaehrlich: spread * HANDEL_PRO_JAHR,
}))

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt, wie ein Kurs überhaupt entsteht und warum
 * Erwartungen statt Fakten ihn bewegen. Fortgeschritten behandelt das
 * Orderbuch, Liquidität und die Teilnehmer. Profi geht auf
 * Informationseffizienz, ihre Grenzen und die kritische Prüfung von
 * Anomalien ein.
 *
 * ## Abgrenzung zu „Börse“
 *
 * Dort steht die Institution: Handelsplätze, Indizes, Ordertypen. Hier
 * steht die Preisbildung selbst – wie aus zwei Meinungen eine Zahl wird.
 */
export const wieFunktioniertDerMarkt: LearnTopic = {
  slug: 'wie-funktioniert-der-markt',
  title: 'Wie funktioniert der Markt',
  headline: 'Wie aus zwei Meinungen eine Zahl wird',
  metaTitle: 'Wie der Markt funktioniert: Preisbildung und Effizienz',
  metaDescription:
    'Wie ein Kurs entsteht, warum Erwartungen statt Fakten ihn bewegen, wie ein Orderbuch funktioniert und was Informationseffizienz tatsächlich bedeutet.',
  lead: 'Ein Kurs ist keine Eigenschaft eines Unternehmens. Er ist der Preis, zu dem sich zuletzt zwei Leute nicht einig waren – über die Zukunft.',
  overview: [
    'Jeder Kurs braucht zwei Seiten. Wer kauft, hält das Papier für zu billig; wer verkauft, für zu teuer. Der Kurs ist der Punkt, an dem beide handeln – nicht der Punkt, an dem sie sich einig sind.',
    'Bewegt wird er nicht von Nachrichten, sondern von Überraschungen. Was alle erwarten, steckt bereits im Preis – deshalb kann ein guter Quartalsbericht den Kurs fallen lassen.',
    'Die Stufen führen von dieser Grundmechanik über Orderbuch, Liquidität und die Teilnehmer bis zur Frage, wie effizient dieser Markt wirklich ist – und was aus der Antwort folgt.',
  ],
  keywords: [
    'Preisbildung',
    'Orderbuch',
    'Spread',
    'Liquidität',
    'Markteffizienz',
    'Market Maker',
  ],
  related: ['boerse', 'depot-und-broker', 'anlegerpsychologie', 'aktie'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Wie ein Kurs entsteht – Angebot, Nachfrage, Erwartung',
      metaDescription:
        'Warum jeder Kurs zwei Seiten braucht, was der Spread ist, warum Kurse schwanken und weshalb gute Nachrichten den Kurs fallen lassen können.',
      title: 'Wie ein Kurs entsteht',
      lead: 'Warum es keinen richtigen Preis gibt, was zwischen Geld- und Briefkurs liegt – und warum gute Zahlen den Kurs drücken können.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ein Kurs sieht aus wie eine Eigenschaft: Die Aktie **steht** bei 42 Euro. Tatsächlich ist er etwas anderes – der Preis des letzten Geschäfts zwischen zwei Parteien, die gegensätzlicher Meinung waren. Der Käufer hielt 42 für günstig, der Verkäufer für ausreichend. Beide können nicht recht haben.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Zwei Seiten, drei Zahlen',
        },
        {
          type: 'table',
          caption: 'Was auf jeder Kursseite steht',
          head: ['Angabe', 'Bedeutung'],
          rows: [
            [
              'Geldkurs (Bid)',
              'Der höchste Preis, den gerade jemand zu zahlen bereit ist – dafür kannst du verkaufen',
            ],
            [
              'Briefkurs (Ask)',
              'Der niedrigste Preis, zu dem gerade jemand verkaufen will – dafür kannst du kaufen',
            ],
            [
              'Letzter Kurs',
              'Der Preis des letzten tatsächlichen Abschlusses. Er liegt in der Vergangenheit',
            ],
          ],
        },
        {
          type: 'figure',
          figure: 'aktie-spread',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Der Spread ist der Preis der Sofortigkeit',
          items: [
            'Zwischen Geld- und Briefkurs liegt der **Spread**. Wer sofort kaufen will, zahlt den höheren Preis; wer sofort verkaufen will, bekommt den niedrigeren.',
            'Er ist keine Gebühr, die jemand berechnet, sondern die Vergütung dafür, dass immer jemand bereitsteht. Ohne diese Bereitschaft müsste man warten, bis zufällig eine Gegenseite auftaucht.',
            'Und er ist eine echte Kostenposition: Wer kauft und sofort wieder verkauft, hat ihn in voller Höhe verloren – ohne dass sich am Kurs irgendetwas geändert hätte.',
          ],
        },
        {
          type: 'table',
          caption: `Was der Spread kostet – bei ${HANDEL_PRO_JAHR} Rundläufen im Jahr`,
          head: ['Spread', 'Je Kauf und Verkauf', 'Im Jahr'],
          rows: spreadreihe.map((zeile) => [
            formatPercent(zeile.spread, 2),
            formatPercent(zeile.jeRundlauf, 2),
            formatPercent(zeile.jaehrlich, 1),
          ]),
        },
        {
          type: 'paragraph',
          text: 'Bei einem breiten Index-ETF liegt der Spread im Bereich der ersten Zeile und fällt neben allem anderen nicht auf. Bei einem kleinen, selten gehandelten Wert steht man schnell bei der letzten – und dann ist der Spread teurer als die gesamte Verwaltungsgebühr eines Fonds.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum Kurse schwanken',
        },
        {
          type: 'paragraph',
          text: 'Kurse bewegen sich, weil sich Erwartungen ändern – nicht, weil sich Tatsachen ändern. Eine Tatsache, die alle erwartet haben, ist bereits eingepreist, bevor sie eintritt. Bewegung entsteht aus der **Differenz zwischen dem Erwarteten und dem Eingetretenen**.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Deshalb kann ein guter Bericht den Kurs drücken',
          items: [
            'Ein Unternehmen meldet einen Gewinnanstieg von 15 Prozent. Klingt gut – und der Kurs fällt.',
            'Der Grund: Erwartet worden waren 20 Prozent. Der Kurs enthielt diese 20 Prozent bereits. Die Meldung ist gegenüber der Erwartung eine **Enttäuschung**, obwohl sie gegenüber dem Vorjahr ein Erfolg ist.',
            'Dasselbe gilt umgekehrt: Ein Verlust kann den Kurs steigen lassen, wenn ein größerer erwartet wurde.',
            'Wer Kursreaktionen verstehen will, muss deshalb immer zwei Zahlen kennen – die gemeldete und die erwartete. Nur eine davon steht in der Schlagzeile.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was daraus für dich folgt',
        },
        {
          type: 'list',
          items: [
            '**Wer kauft, handelt gegen jemanden.** Auf der anderen Seite steht jemand, der dasselbe Papier bei gleicher Informationslage abgibt. Die Frage „warum sollte ich mehr wissen als er?“ ist unbequem und angebracht.',
            '**Öffentlich bekannte Informationen sind eingepreist.** Was in der Zeitung steht, wissen alle. Es taugt zur Erklärung des Kurses, nicht zur Vorhersage.',
            '**Kurzfristige Bewegungen sind praktisch nicht nutzbar.** Wer gegen Marktteilnehmer antritt, die schneller sind und weniger Kosten haben, verliert an der Reibung, was er an Einsicht gewinnt.',
            '**Die Konsequenz ist der Zeithorizont.** Nicht die bessere Prognose, sondern die längere Haltedauer ist der Vorteil, den ein Privatanleger tatsächlich hat – niemand zwingt ihn zu verkaufen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Das Orderbuch: wo die Kurse herkommen',
        },
        {
          type: 'paragraph',
          text: 'Geld- und Briefkurs stehen nicht einfach da – sie sind die beiden innersten Zeilen einer Liste. Im **Orderbuch** sammeln sich alle Kaufaufträge auf der einen und alle Verkaufsaufträge auf der anderen Seite, jeweils nach Preis sortiert. Ganz oben steht auf der Kaufseite das höchste Gebot, auf der Verkaufsseite die niedrigste Forderung. Berühren sich beide, kommt ein Geschäft zustande und beide Zeilen verschwinden.',
        },
        {
          type: 'list',
          items: [
            '**Eine Limit-Order stellt sich in die Liste.** Sie wartet, bis jemand zu diesem Preis handeln will – und bringt so lange Angebot in den Markt.',
            '**Eine Market-Order nimmt aus der Liste.** Sie arbeitet sich von oben nach unten durch, bis die gewünschte Stückzahl zusammen ist. Reicht die erste Zeile nicht, wird die zweite mitgenommen – zu einem schlechteren Preis.',
            '**Deshalb ist Tiefe wichtiger als der Spread allein.** Ein enger Spread über wenigen Stücken hilft nicht, wenn die Order größer ist als das Angebot in der ersten Zeile.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum es denselben Wert an mehreren Orten gibt',
          items: [
            'Eine Aktie wird nicht nur an einer Börse gehandelt. In Deutschland gibt es den elektronischen Referenzmarkt, mehrere Regionalbörsen und außerbörsliche Handelspartner – jeder mit eigenem Orderbuch und leicht abweichenden Kursen.',
            'Für Privatanleger heißt das vor allem eins: Der Handelsplatz gehört zur Order dazu, und die Unterschiede sind real. Zur Haupthandelszeit ist der Referenzmarkt fast immer die tiefste und damit engste Wahl.',
            'Außerbörsliche Angebote werben mit „gebührenfrei“. Bezahlt wird dort über den Spread – nicht unbedingt teurer, aber eben auch nicht umsonst.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wann gehandelt wird – und wann besser nicht',
        },
        {
          type: 'paragraph',
          text: 'Kurse existieren nicht rund um die Uhr in gleicher Qualität. Die Zeiten, zu denen ein Papier viel gehandelt wird, sind zugleich die Zeiten, zu denen der Spread eng und die Ausführung verlässlich ist. Wer außerhalb davon handelt, zahlt für dieselbe Sache mehr.',
        },
        {
          type: 'list',
          items: [
            '**Deutsche Werte:** vormittags bis zum frühen Nachmittag. Um 9:00 Uhr ist die Eröffnung noch unruhig, ab 15:30 Uhr kommt der US-Handel dazu und bringt Bewegung.',
            '**Welt-ETFs mit US-Aktien:** am besten nachmittags, wenn die amerikanische Börse offen ist. Dann kennen die Handelspartner die Preise der enthaltenen Aktien und müssen sie nicht schätzen.',
            '**Nicht in den ersten und letzten Minuten** eines Handelstags. Dort sind die Spreads am weitesten und die Ausschläge am größten.',
            '**Nicht direkt nach einer Unternehmensmeldung.** Die Preise sortieren sich in diesen Minuten neu; wer dann eine Market-Order schickt, wird zu einem Preis bedient, der gleich darauf nicht mehr gilt.',
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
            'Ein Kurs ist der Preis des letzten Abschlusses, nicht der Wert des Unternehmens.',
            'Der Spread ist der Preis dafür, sofort handeln zu können – und bei häufigem Handeln eine erhebliche Kostenposition.',
            'Geld- und Briefkurs sind die innersten Zeilen des Orderbuchs; Limit stellt sich hinein, Market nimmt heraus.',
            'Bewegt wird der Kurs von der Abweichung zwischen Erwartung und Ergebnis.',
            'Zur Haupthandelszeit handeln – bei Welt-ETFs also nachmittags, wenn die US-Börse offen ist.',
            'Der Vorteil eines Privatanlegers ist der Zeithorizont, nicht die Prognose.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Orderbuch, Liquidität und wer am Markt handelt',
      metaDescription:
        'Wie ein Orderbuch funktioniert, woran sich Liquidität erkennen lässt, was Slippage bedeutet und welche Teilnehmer den Handel prägen.',
      title: 'Orderbuch, Liquidität, Teilnehmer',
      lead: 'Wie eine Order tatsächlich ausgeführt wird, woran gute Handelbarkeit zu erkennen ist – und wer auf der anderen Seite steht.',
      readingMinutes: 17,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Das Orderbuch',
        },
        {
          type: 'paragraph',
          text: 'Ein Orderbuch ist eine sortierte Liste aller offenen Aufträge: Kaufaufträge nach Preis absteigend, Verkaufsaufträge aufsteigend. Ganz oben stehen die besten Gebote beider Seiten – ihr Abstand ist der Spread. Ein Geschäft kommt zustande, sobald sich beide Seiten überlappen.',
        },
        {
          type: 'table',
          caption: 'Zwei Auftragsarten, zwei Rollen',
          head: ['Art', 'Was passiert', 'Wirkung auf das Buch'],
          rows: [
            [
              'Limitauftrag',
              'Wird ins Buch gestellt und wartet auf eine Gegenseite',
              'Stellt Liquidität bereit. Der Preis ist sicher, die Ausführung nicht',
            ],
            [
              'Marktauftrag',
              'Wird sofort gegen die beste vorhandene Gegenseite ausgeführt',
              'Entnimmt Liquidität. Die Ausführung ist sicher, der Preis nicht',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Preis-Zeit-Priorität',
          items: [
            'Ausgeführt wird zuerst der beste Preis. Bei gleichem Preis entscheidet, wer zuerst da war.',
            'Daraus folgt der praktische Rat: Ein Limit, das genau auf dem aktuellen Geldkurs liegt, steht hinter allen Aufträgen, die schon dort liegen. Wer sicher zum Zuge kommen will, muss einen Schritt besser bieten.',
            '**Auktionen** funktionieren anders: Zur Eröffnung und zum Schluss werden Aufträge gesammelt und zu einem einheitlichen Preis ausgeführt, der das größte Volumen ermöglicht. Diese Auktionen sind die liquidesten Momente des Tages – bei wenig gehandelten Werten oft die einzigen brauchbaren.',
          ],
        },
        {
          type: 'figure',
          figure: 'markt-orderbuch',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Markttiefe und Slippage',
        },
        {
          type: 'paragraph',
          text: 'Der Spread sagt nur, was die **erste** Lage kostet. Wer mehr Stücke will, als dort liegen, arbeitet sich in die zweite und dritte Lage – zu schlechteren Preisen. Diesen Unterschied zwischen erwartetem und erzieltem Durchschnittspreis nennt man **Slippage**.',
        },
        {
          type: 'list',
          items: [
            '**Markttiefe** ist deshalb die aussagekräftigere Größe als der Spread allein: Nicht nur, wie eng die beste Lage ist, sondern wie viel dahinter liegt.',
            '**Für Privatanleger** ist Slippage bei üblichen Beträgen und liquiden Werten kein Thema. Bei kleinen Nebenwerten und bei Aufträgen außerhalb der Haupthandelszeiten sehr wohl.',
            '**Ein Limit schützt davor** – es begrenzt den Preis nach oben oder unten. Der Preis dafür ist das Risiko, gar nicht ausgeführt zu werden.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Wann Liquidität verschwindet',
          items: [
            'Liquidität ist keine Eigenschaft eines Papiers, sondern ein Zustand. Sie ist dann am geringsten, wenn sie am meisten gebraucht wird.',
            '**Tageszeit.** Am dünnsten kurz nach der Eröffnung und in der Mittagszeit, am dichtesten in der Überlappung mit dem US-Handel am Nachmittag. Wer in den ersten Minuten nach Handelsbeginn kauft, zahlt regelmäßig einen breiteren Spread.',
            '**Stressphasen.** Wenn alle in dieselbe Richtung wollen, ziehen Market Maker ihre Kurse zurück oder stellen sie weiter. Genau in dem Moment, in dem viele verkaufen wollen, ist die Gegenseite dünn – das ist der Mechanismus hinter den heftigsten Tagesbewegungen.',
            '**Praktische Folge:** Marktaufträge in unruhigen Phasen sind teuer. Wer dann handeln muss, sollte limitieren.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wer auf der anderen Seite steht',
        },
        {
          type: 'table',
          caption: 'Vier Gruppen und was sie antreibt',
          head: ['Teilnehmer', 'Motiv'],
          rows: [
            [
              'Market Maker',
              'Stellen laufend An- und Verkaufskurse und verdienen am Spread. Sie haben keine Meinung zum Papier – sie wollen die Position schnell wieder ausgleichen',
            ],
            [
              'Institutionelle Anleger',
              'Fonds, Versicherer, Pensionskassen. Große Volumina, die über Stunden oder Tage in kleinen Teilen ausgeführt werden, um den Preis nicht zu bewegen',
            ],
            [
              'Indexfonds',
              'Handeln mechanisch: Was der Index aufnimmt, wird gekauft – unabhängig von jeder Bewertung. Diese Nachfrage ist vorhersehbar und wird entsprechend antizipiert',
            ],
            [
              'Algorithmischer Handel',
              'Von der Ausführungsoptimierung großer Aufträge bis zum Hochfrequenzhandel, der auf Bruchteile von Sekunden reagiert',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Zum Hochfrequenzhandel gibt es zwei belastbare Befunde nebeneinander: Er hat die Spreads für normale Anleger deutlich verengt – das ist messbar und ein echter Vorteil. Und er verschwindet in Stressphasen, weil seine Modelle dann keine Kurse mehr stellen. Beide Aussagen stimmen; die Bewertung hängt davon ab, welchen Fall man betrachtet.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Bezahlte Orderweiterleitung',
          items: [
            'Manche Broker leiten Kundenaufträge an bestimmte Handelsplätze weiter und erhalten dafür eine Vergütung. Das ermöglicht Gebührenmodelle ohne Ordergebühr.',
            'Die Frage ist, ob die Ausführung dadurch schlechter wird. Bei liquiden Standardwerten in üblichen Größen ist der Unterschied gering oder nicht vorhanden – bei weniger liquiden Werten kann er die eingesparte Gebühr übersteigen.',
            'Die Praxis ist regulatorisch umstritten und in der EU eingeschränkt worden. Praktisch prüfen lässt sie sich nur durch einen Vergleich der tatsächlichen Ausführung mit dem Referenzkurs – für Privatanleger aufwendig, aber bei größeren Beträgen lohnend.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie ein Preis überhaupt entsteht',
        },
        {
          type: 'paragraph',
          text: 'Ein Kurs ist keine Eigenschaft eines Unternehmens, sondern das Protokoll eines Geschäfts: der Preis, zu dem sich zuletzt zwei Parteien geeinigt haben. Er sagt nichts darüber, zu welchem Preis der nächste Abschluss zustande kommt – und schon gar nicht, ob man die eigene Position dazu verkaufen könnte.',
        },
        {
          type: 'list',
          items: [
            '**Der letzte Kurs kann alt sein.** Bei einem selten gehandelten Wert liegt der letzte Abschluss unter Umständen Stunden zurück, während das Orderbuch längst woanders steht.',
            '**Er gilt für die damalige Menge.** Wer das Zehnfache handeln will, bekommt einen anderen Preis – und zwar systematisch einen schlechteren.',
            '**Zwischen Geld- und Briefkurs gibt es keinen „richtigen" Preis.** Kaufen kostet den Briefkurs, verkaufen bringt den Geldkurs. Der Mittelwert, der auf jeder Website steht, ist der einzige Kurs, zu dem niemand handeln kann.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum der Markt schwerer zu schlagen ist, als er aussieht',
        },
        {
          type: 'paragraph',
          text: 'Nicht, weil er immer recht hätte – sondern wegen der Gegenseite. Jedes Geschäft hat zwei Parteien, und die andere ist heute fast nie ein Privatanleger, sondern eine Institution mit besseren Daten, tieferen Taschen und keinem Bedürfnis, recht zu behalten.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Frage, die vor jedem Kauf steht',
          items: [
            '**Wer verkauft mir das, und warum?** Wenn die Antwort lautet „jemand, der mehr weiß als ich", ist es kein guter Kauf.',
            '**Bei einem breit gestreuten Indexfonds ist die Frage entschärft**: Man behauptet nichts über einzelne Unternehmen und beansprucht nur den Durchschnitt. Deshalb braucht diese Anlageform keine Meinung über die Gegenseite.',
            '**Bei einem Einzeltitel behauptet man etwas.** Nämlich, dass der Markt den Wert falsch einschätzt – gegen die Gegenseite, die das Gegenteil behauptet und bezahlte Analysten hat.',
            'Das ist kein Verbot, Einzeltitel zu kaufen. Es ist die Frage, deren Antwort man kennen sollte, bevor man es tut.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was Kurse zwischen den Handelszeiten machen',
        },
        {
          type: 'paragraph',
          text: 'Ein erheblicher Teil der Kursbewegung entsteht **außerhalb** der Handelszeiten – über Nacht, am Wochenende, in Kurslücken zur Eröffnung. Nachrichten kommen nicht nur zwischen 9 und 17:30 Uhr, und der Markt verarbeitet sie beim nächsten Zusammentreffen von Angebot und Nachfrage auf einmal.',
        },
        {
          type: 'list',
          items: [
            '**Ein Stop-Kurs schützt darüber nicht.** Er wird bei der Eröffnung ausgelöst, und ausgeführt wird zum dann gültigen Kurs – der weit darunter liegen kann.',
            '**Wer nur die Tagesbewegung betrachtet, sieht einen Bruchteil.** Ein Wert kann über Monate innerhalb der Handelszeiten fallen und über Nacht steigen; beides zusammen ergibt erst das Ergebnis.',
            '**Deshalb ist „ich beobachte das und steige rechtzeitig aus" keine Strategie.** Die Bewegungen, auf die es ankommt, finden statt, während niemand handeln kann.',
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
            'Limitaufträge stellen Liquidität bereit, Marktaufträge entnehmen sie.',
            'Markttiefe ist aussagekräftiger als der Spread allein.',
            'Liquidität ist dann am geringsten, wenn sie gebraucht wird – in Stressphasen limitieren.',
            'Market Maker haben keine Meinung zum Papier; sie verdienen am Spread.',
            'Ein Kurs ist das Protokoll eines vergangenen Geschäfts, keine Eigenschaft des Unternehmens.',
            'Der Mittelwert zwischen Geld und Brief ist der einzige Kurs, zu dem niemand handeln kann.',
            'Vor jedem Einzelkauf steht die Frage, wer verkauft und warum.',
            'Ein großer Teil der Bewegung entsteht außerhalb der Handelszeiten – dagegen hilft kein Stop.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Markteffizienz und die kritische Prüfung von Anomalien',
      metaDescription:
        'Die drei Stufen der Informationseffizienz, das Effizienzparadox, Grenzen der Arbitrage und wie sich dokumentierte Anomalien einordnen lassen.',
      title: 'Effizienz und ihre Grenzen',
      lead: 'Was Informationseffizienz tatsächlich behauptet, warum sie sich selbst untergräbt – und wie man eine Anomalie von einem Zufallsfund unterscheidet.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Drei Stufen, drei Behauptungen',
        },
        {
          type: 'table',
          caption: 'Informationseffizienz nach Stärke',
          head: ['Stufe', 'Behauptung', 'Empirischer Stand'],
          rows: [
            [
              'Schwach',
              'Aus vergangenen Kursen lässt sich nichts über künftige ableiten',
              'Weitgehend bestätigt. Die dokumentierten Ausnahmen sind klein und nach Kosten meist verschwunden',
            ],
            [
              'Halbstark',
              'Alle öffentlich verfügbaren Informationen stecken bereits im Kurs',
              'Überwiegend bestätigt. Die Einpreisung neuer Informationen erfolgt in Sekunden, nicht in Tagen',
            ],
            [
              'Stark',
              'Selbst nicht öffentliche Informationen stecken im Kurs',
              'Klar widerlegt – sonst wäre Insiderhandel nicht einträglich und müsste nicht verfolgt werden',
            ],
          ],
        },
        {
          type: 'figure',
          figure: 'markt-effizienzstufen',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Das Effizienzparadox',
          items: [
            'Ein Markt ist effizient, weil viele Teilnehmer nach Ineffizienzen suchen und sie durch ihr Handeln beseitigen.',
            'Wäre er vollkommen effizient, lohnte diese Suche nicht mehr – niemand würde sie betreiben, und der Markt würde ineffizient.',
            'Daraus folgt: Effizienz ist ein Gleichgewichtszustand, in dem die Suche gerade noch ihre Kosten deckt. Es **muss** also eine gewisse Menge auffindbarer Ineffizienz geben – nur ist sie ungefähr so groß wie der Aufwand, sie zu finden.',
            'Für einen Privatanleger ist das die entscheidende Einsicht: Nicht „es gibt nichts zu finden“, sondern „was zu finden ist, kostet ungefähr so viel, wie es bringt“ – und zwar für jemanden, der professionell danach sucht.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum falsche Preise bestehen bleiben können',
        },
        {
          type: 'paragraph',
          text: 'Effizienz bedeutet nicht, dass Preise richtig sind. Sie bedeutet, dass sich aus bekannten Informationen kein verlässlicher Gewinn ziehen lässt. Das ist erheblich weniger – und der Unterschied erklärt, warum offensichtliche Fehlbewertungen jahrelang bestehen können.',
        },
        {
          type: 'list',
          items: [
            '**Kosten der Arbitrage.** Wer eine Fehlbewertung ausnutzen will, braucht Kapital, zahlt Gebühren und bei Leerverkäufen Leihgebühren. Ist die Abweichung kleiner als diese Summe, bleibt sie bestehen.',
            '**Zeithorizont und fremdes Geld.** Ein Verwalter, der auf eine Korrektur wartet, muss sie erleben, bevor seine Anleger das Kapital abziehen. Die berühmte Formulierung, ein Markt könne länger irrational bleiben, als man zahlungsfähig sei, beschreibt genau diese Beschränkung.',
            '**Grenzen des Leerverkaufs.** Nach oben ist der Verlust unbegrenzt, das Papier muss verfügbar sein und kann zurückgefordert werden. Deshalb werden Überbewertungen schlechter korrigiert als Unterbewertungen – ein systematischer Grund für anhaltend zu hohe Preise.',
            '**Modell- und Karriererisiko.** Wer gegen den Konsens liegt und sich irrt, verliert seine Position. Wer mit dem Konsens liegt und sich irrt, hat Gesellschaft. Das ist keine Randbedingung, sondern prägt das Verhalten großer Teile des Marktes.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Anomalien richtig prüfen',
        },
        {
          type: 'paragraph',
          text: 'Die Literatur kennt hunderte dokumentierte Effekte – Momentum, Value, Size, niedrige Volatilität und viele weitere. Bevor man einem davon Geld anvertraut, sind vier Fragen zu stellen, und die meisten Kandidaten scheitern schon an der ersten.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Wie viele Hypothesen wurden geprüft?** Wer hundert Muster testet, findet bei einem Signifikanzniveau von fünf Prozent im Schnitt fünf, die zufällig „funktionieren“. Veröffentlicht wird davon eines – die anderen 99 stehen nirgends. Das ist keine Unterstellung, sondern die dokumentierte Struktur der Literatur.',
            '**Hält der Effekt außerhalb der Entwicklungsdaten?** Nur ein Test auf Daten, die bei der Konstruktion nicht verwendet wurden, sagt etwas aus. Viele Effekte schwächen sich nach ihrer Veröffentlichung deutlich ab – teils weil Kapital ihnen folgt, teils weil sie nie robust waren.',
            '**Gibt es eine Begründung, die nicht aus den Daten stammt?** Ein Effekt braucht einen ökonomischen Grund: eine Risikoprämie, eine strukturelle Beschränkung, ein Verhaltensmuster. Ohne ihn ist die Beobachtung ein Muster im Rauschen.',
            '**Was bleibt nach Umsetzungskosten?** Papierrenditen rechnen ohne Spread, ohne Marktwirkung der eigenen Aufträge, ohne Steuern. Effekte, die häufiges Umschichten verlangen, verlieren daran regelmäßig ihren gesamten Vorsprung.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die praktische Schlussfolgerung',
          items: [
            'Die Frage lautet nicht, ob der Markt perfekt ist – er ist es nicht. Sie lautet, ob die verbleibenden Abweichungen für **dich** nutzbar sind.',
            'Dagegen stehen: höhere Kosten als bei professionellen Teilnehmern, weniger Zeit, weniger Daten und die Steuer auf jeden realisierten Gewinn.',
            'Dafür steht genau ein Vorteil, und er ist echt: **Niemand zwingt dich zu verkaufen.** Kein Anleger kann sein Kapital abziehen, kein Vorgesetzter verlangt eine Quartalserklärung. Diesen Vorteil hat kein Berufsanleger.',
            'Wer ihn nutzt, handelt selten und hält lange. Das ist keine Bescheidenheit, sondern die einzige Strategie, die aus der tatsächlichen Position eines Privatanlegers folgt.',
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
            'Die starke Form der Effizienz ist widerlegt, die halbstarke weitgehend bestätigt.',
            'Effizienz entsteht durch die Suche nach Ineffizienz und kann deshalb nie vollständig sein.',
            'Fehlbewertungen bestehen fort, weil Arbitrage Kosten, Kapital und Zeit braucht.',
            'Der einzige strukturelle Vorteil eines Privatanlegers ist, dass ihn niemand zum Verkaufen zwingt.',
          ],
        },
      ],
    },
  },
}
