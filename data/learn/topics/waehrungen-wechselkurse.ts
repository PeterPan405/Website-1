import type { LearnTopic } from '@/data/learn/types'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import {
  waehrungEinsatz as EINSATZ,
  waehrungKurse as KURSE,
  waehrungKursgewinn as KURSGEWINN,
  waehrungKursStart as KURS_START,
} from '@/lib/lernszenarien'

/*
  Der Währungseffekt wird gerechnet.

  „Ein stärkerer Euro schmälert die Rendite von Dollar-Anlagen“ ist richtig
  und hilft niemandem. Die Frage ist, um wie viel – und die Antwort
  überrascht regelmäßig, weil sich Kurs- und Währungsentwicklung nicht
  addieren, sondern multiplizieren. Genau daran scheitert die Kopfrechnung.
*/

const waehrungsreihe = KURSE.map((kursEnde) => {
  // In Dollar gerechnet: Einsatz umtauschen, Kursgewinn erzielen, zurücktauschen.
  const dollarStart = EINSATZ * KURS_START
  const dollarEnde = dollarStart * (1 + KURSGEWINN / 100)
  const euroEnde = dollarEnde / kursEnde
  return {
    kursEnde,
    euroEnde,
    renditeEuro: ((euroEnde - EINSATZ) / EINSATZ) * 100,
    waehrungseffekt: ((KURS_START - kursEnde) / kursEnde) * 100,
  }
})

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner lernt einen Kurs zu lesen und sieht am
 * durchgerechneten Beispiel, was Währung mit einer Rendite macht.
 * Fortgeschritten behandelt Absicherung, ihre Kosten und die verdeckten
 * Währungseffekte im eigenen Depot. Profi geht auf die Paritätsbedingungen,
 * die Marktstruktur und die steuerliche Behandlung ein.
 *
 * ## Der Kern des Themas
 *
 * Die Handelswährung eines Wertpapiers ist nicht sein Währungsrisiko. Diese
 * Verwechslung ist der häufigste Irrtum im gesamten Bereich und der Grund,
 * warum das Thema überhaupt eine eigene Seite braucht.
 */
export const waehrungenWechselkurse: LearnTopic = {
  slug: 'waehrungen-wechselkurse',
  title: 'Währungen & Wechselkurse',
  headline: 'Das Risiko, das man nicht sieht',
  metaTitle: 'Währungen und Wechselkurse: Wirkung auf die Rendite',
  metaDescription:
    'Wie ein Wechselkurs zu lesen ist, was Währungsbewegungen mit der Rendite machen, wann eine Absicherung sinnvoll ist und was sie kostet.',
  lead: 'Ein Kurs kann steigen und die Anlage trotzdem verlieren. Dazwischen steht der Wechselkurs.',
  overview: [
    'Wer außerhalb des Euroraums anlegt, hat zwei Positionen statt einer: die Anlage selbst und die Währung, in der sie geführt wird. Beide wirken zusammen, und zwar multiplikativ.',
    'Der häufigste Irrtum betrifft die Handelswährung: Ein in Euro notierter Welt-ETF hat keineswegs kein Währungsrisiko. Entscheidend ist, worin die enthaltenen Unternehmen wirtschaften – und das ist zum großen Teil der Dollar.',
    'Die Stufen führen vom Lesen eines Kurses über Absicherung samt ihrer Kosten bis zu den Paritätsbedingungen, der Marktstruktur und der Behandlung von Währungsgewinnen im Privatvermögen.',
  ],
  keywords: [
    'Wechselkurs',
    'Währungsrisiko',
    'Devisen',
    'Hedging',
    'Kaufkraftparität',
    'Carry-Trade',
  ],
  related: ['etf', 'rohstoffe', 'notenbanken-geldpolitik', 'aktien-laender-branchen'],
  symbols: ['eur-usd'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Wechselkurse einfach erklärt: lesen und einordnen',
      metaDescription:
        'Wie ein Währungspaar zu lesen ist, was Kurse bewegt und wie sich eine Wechselkursänderung auf die Rendite einer Auslandsanlage auswirkt.',
      title: 'Einen Kurs lesen und seine Wirkung verstehen',
      lead: 'Was EUR/USD 1,10 bedeutet, was Kurse bewegt – und was mit deiner Rendite passiert, wenn sich nur die Währung ändert.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: `Ein Währungspaar nennt immer zwei Währungen, und die Reihenfolge entscheidet über die Lesart. **EUR/USD ${formatNumber(KURS_START, 2)}** heißt: Ein Euro kostet ${formatNumber(KURS_START, 2)} US-Dollar. Steigt die Zahl, ist der Euro stärker geworden. Fällt sie, ist der Dollar stärker geworden.`,
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Merkregel',
          items: [
            'Die **erste** Währung ist die Ware, die **zweite** ist der Preis. EUR/USD sagt, was ein Euro in Dollar kostet.',
            'Steigender Kurs = starke erste Währung. Fallender Kurs = starke zweite Währung.',
            'Beim Umtausch am Schalter oder mit der Karte bekommst du nie den Devisenkurs. Zwischen Geld- und Briefkurs liegt eine Spanne, dazu kommt ein Aufschlag – am Flughafen zweistellig, bei guten Karten unter einem Prozent.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was Kurse bewegt',
        },
        {
          type: 'table',
          caption: 'Vier Treiber, nach Zeithorizont',
          head: ['Treiber', 'Wirkung', 'Zeithorizont'],
          rows: [
            [
              'Zinsdifferenz',
              'Kapital fließt dorthin, wo es mehr Zins gibt – die Währung wertet auf',
              'Tage bis Monate. Der stärkste kurzfristige Treiber',
            ],
            [
              'Inflationsunterschied',
              'Wo Preise schneller steigen, verliert die Währung an Kaufkraft und tendenziell an Wert',
              'Jahre bis Jahrzehnte',
            ],
            [
              'Handelsbilanz und Kapitalströme',
              'Wer mehr exportiert als importiert, erzeugt Nachfrage nach seiner Währung',
              'Monate bis Jahre',
            ],
            [
              'Sichere Häfen',
              'In Krisen fließt Geld in Franken, Dollar und Yen – unabhängig von allen anderen Größen',
              'Tage. Und regelmäßig entgegen jeder anderen Logik',
            ],
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was das mit deiner Rendite macht',
        },
        {
          type: 'paragraph',
          text: `Ein Beispiel, an dem sich alles zeigt. Du legst ${formatCurrency(EINSATZ)} in einer US-Aktie an, bei einem Kurs von EUR/USD ${formatNumber(KURS_START, 2)}. Die Aktie steigt in Dollar um ${formatPercent(KURSGEWINN, 0)} – das ist in jedem Fall so. Was am Ende in Euro herauskommt, hängt allein am Wechselkurs beim Rücktausch:`,
        },
        {
          type: 'table',
          caption: `${formatCurrency(EINSATZ)} in einer US-Aktie, ${formatPercent(KURSGEWINN, 0)} Kursgewinn in Dollar`,
          head: [
            'EUR/USD am Ende',
            'Ergebnis in Euro',
            'Rendite in Euro',
            'Davon Währung',
          ],
          rows: waehrungsreihe.map((zeile) => [
            formatNumber(zeile.kursEnde, 2),
            formatCurrency(zeile.euroEnde),
            formatPercent(zeile.renditeEuro, 1),
            formatPercent(zeile.waehrungseffekt, 1),
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Drei Beobachtungen',
          items: [
            'Ein deutlich stärkerer Euro kann den gesamten Kursgewinn aufzehren und darüber hinaus ins Minus führen – ohne dass die Aktie etwas falsch gemacht hätte.',
            'Ein schwächerer Euro wirkt umgekehrt: Aus einem einstelligen Kursgewinn wird ein zweistelliges Ergebnis in Euro.',
            'Kurs- und Währungseffekt **addieren sich nicht, sie multiplizieren sich**. Wer im Kopf rechnet, liegt regelmäßig daneben – meist zugunsten der eigenen Erwartung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der wichtigste Irrtum',
        },
        {
          type: 'paragraph',
          text: 'Ein weltweit anlegender ETF wird in Euro gehandelt. Viele schließen daraus, es gebe kein Währungsrisiko. Das ist falsch: **Die Handelswährung ist nicht das Währungsrisiko.** Der ETF hält Aktien von Unternehmen, die überwiegend in Dollar bilanzieren und wirtschaften. Fällt der Dollar, fällt der Eurowert dieser Beteiligungen – die Euro-Notierung rechnet das nur um, sie schützt nicht davor.',
        },
        {
          type: 'paragraph',
          text: 'Dasselbe gilt in der Gegenrichtung: Ein in Dollar gehandelter ETF auf europäische Aktien trägt kein nennenswertes Dollarrisiko. Entscheidend ist immer, worin die enthaltenen Unternehmen ihr Geld verdienen – nicht, in welcher Währung das Papier notiert.',
        },
        {
          type: 'figure',
          figure: 'waehrung-ergebnis',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Absichern – und warum es meist nicht lohnt',
        },
        {
          type: 'paragraph',
          text: 'Es gibt Fonds, die das Währungsrisiko herausnehmen; sie heißen **währungsgesichert** oder tragen „EUR hedged“ im Namen. Technisch wird dabei laufend ein Termingeschäft abgeschlossen, das die Fremdwährung auf einen festen Kurs festzurrt. Das funktioniert – aber es ist nicht umsonst, und der Preis ist nicht die Gebühr, die im Prospekt steht.',
        },
        {
          type: 'paragraph',
          text: 'Bezahlt wird die **Zinsdifferenz** zwischen den beiden Währungsräumen. Liegen die US-Zinsen zwei Prozentpunkte über den europäischen, kostet die Absicherung ungefähr diese zwei Prozentpunkte pro Jahr – Jahr für Jahr, unabhängig davon, ob sich der Kurs überhaupt bewegt. Dazu kommt die etwas höhere Kostenquote. Über zwanzig Jahre ist das ein erheblicher Betrag für eine Versicherung gegen etwas, das sich über solche Zeiträume erfahrungsgemäß ohnehin ausgleicht.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Wann Absicherung trotzdem sinnvoll ist',
          items: [
            '**Bei Anleihen im Depot.** Dort ist der erwartete Ertrag klein; eine Währungsschwankung von zehn Prozent überdeckt ihn vollständig. Ein Anleiheteil soll beruhigen – ungesichert tut er das Gegenteil.',
            '**Bei kurzem Horizont.** Wer in drei Jahren einen festen Betrag in Euro braucht, hat keine Zeit, eine ungünstige Währungsphase auszusitzen.',
            '**Bei Ausgaben in dieser Währung** ist es umgekehrt: Wer später in den USA leben will, braucht Dollar – dann ist die *ungesicherte* Anlage die passende.',
            'Für den langfristigen Aktienteil eines Depots ist Absicherung dagegen in aller Regel bezahlter Aufwand ohne Gegenwert.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wo Wechselkurse im Alltag auftauchen',
        },
        {
          type: 'paragraph',
          text: 'Nicht nur im Depot. Wer eine Auslandsüberweisung tätigt, im Urlaub mit Karte zahlt oder online in Dollar bestellt, bezahlt jedes Mal einen Kurs – nur steht er selten daneben. Der Unterschied zwischen dem Devisenkurs und dem, was tatsächlich abgebucht wird, liegt je nach Anbieter zwischen unter einem Prozent und deutlich über fünf.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Falle heißt „Zahlung in Euro?"',
          items: [
            'Fragt ein Geldautomat oder ein Kartenterminal im Ausland, ob du **in Euro** abrechnen möchtest, lautet die richtige Antwort fast immer **nein**.',
            'Das Verfahren heißt Dynamic Currency Conversion. Der Kurs wird dann vom Automatenbetreiber gesetzt statt von deiner Bank – mit einem Aufschlag, der regelmäßig im hohen einstelligen Prozentbereich liegt.',
            'In Landeswährung abrechnen zu lassen sieht unsicherer aus und ist billiger: Dann rechnet dein Kartenanbieter um, zu einem Kurs nahe dem Devisenkurs.',
            'Dieselbe Frage stellt sich beim Bezahlen im Netz. „Preis in Euro anzeigen“ ist bequem und kostet dasselbe wie am Automaten.',
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
            'EUR/USD 1,10 heißt: ein Euro kostet 1,10 Dollar. Steigt die Zahl, ist der Euro stärker.',
            'Zinsdifferenzen wirken kurzfristig am stärksten, Inflationsunterschiede über Jahrzehnte.',
            'Kurs- und Währungseffekt multiplizieren sich; ein starker Euro kann den Kursgewinn aufzehren.',
            'Die Handelswährung eines ETF sagt nichts über sein Währungsrisiko.',
            'Absicherung kostet die Zinsdifferenz – bei Anleihen sinnvoll, beim langfristigen Aktienteil selten.',
            'Im Ausland nie „in Euro abrechnen“ wählen. Das ist der teuerste Wechselkurs des Alltags.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Währungsabsicherung: Kosten, Nutzen, verdeckte Effekte',
      metaDescription:
        'Wie eine Währungsabsicherung funktioniert, warum sie die Zinsdifferenz kostet und wo im Depot verdeckte Währungspositionen stecken.',
      title: 'Absichern – oder bewusst nicht',
      lead: 'Was eine Absicherung kostet, wann sie sich lohnt und welche Währungspositionen im Depot stecken, ohne dass sie irgendwo stehen.',
      readingMinutes: 17,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Wie eine Absicherung funktioniert',
        },
        {
          type: 'paragraph',
          text: 'Eine **abgesicherte Anteilsklasse** – erkennbar an Zusätzen wie „EUR Hedged“ – schließt laufend Termingeschäfte ab, die die Fremdwährungsposition gegenrechnen. Meist rollierend über einen Monat. Das Ergebnis ist eine Anlage, die weitgehend nur noch die Wertentwicklung des Basiswerts abbildet, ohne Währungsbewegung.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was die Absicherung kostet – und warum',
          items: [
            'Der Terminkurs zweier Währungen ergibt sich nicht aus einer Prognose, sondern aus **Arbitragefreiheit**: Er entspricht dem Kassakurs, angepasst um die Zinsdifferenz beider Währungsräume.',
            'Genau diese Zinsdifferenz sind daher die laufenden Kosten der Absicherung. Liegen die Zinsen im Fremdwährungsraum höher, kostet die Absicherung ungefähr diesen Abstand pro Jahr – zuzüglich der Handelskosten.',
            'Ein Zahlenbeispiel: Bei zwei Prozentpunkten Zinsvorsprung des Dollars kostet die Absicherung einer Dollarposition rund zwei Prozent im Jahr. Das ist keine Gebühr, die sich verhandeln ließe, sondern eine Folge der Zinsstruktur.',
            'Kehrt sich die Differenz um, wird die Absicherung zur Einnahme. Beides ist symmetrisch und unabhängig davon, wohin der Wechselkurs tatsächlich läuft.',
          ],
        },
        {
          type: 'figure',
          figure: 'waehrung-absicherung',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wann sie sinnvoll ist',
        },
        {
          type: 'table',
          caption: 'Die Entscheidung hängt am Verhältnis der Schwankungen',
          head: ['Anlageklasse', 'Verhältnis', 'Übliche Praxis'],
          rows: [
            [
              'Anleihen',
              'Die Währungsschwankung übersteigt die erwartete Rendite meist deutlich',
              'Absicherung üblich und in aller Regel sinnvoll – sonst dominiert das Währungsrisiko das Ergebnis vollständig',
            ],
            [
              'Aktien',
              'Die Schwankung des Aktienmarkts dominiert die der Währung',
              'Absicherung meist verzichtbar; über lange Zeiträume verschlechtert sie das Ergebnis eher, weil ihre Kosten laufend anfallen',
            ],
            [
              'Rohstoffe',
              'Notierung fast durchweg in Dollar; die Preisschwankung dominiert',
              'Uneinheitlich – hier ist die Dollarposition Teil des Geschäfts',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Zwei Größen verschieben die Antwort',
          items: [
            '**Der Anlagehorizont.** Über sehr lange Zeiträume gleichen sich Währungsbewegungen tendenziell aus – Kaufkraftunterschiede wirken zurück. Über fünf oder zehn Jahre gilt das nicht verlässlich.',
            '**Die Entnahmephase.** Wer feste Beträge in Euro braucht, hat ein anderes Problem als jemand, der ansparen kann. Dort gewinnt die Absicherung an Bedeutung, weil die Planbarkeit wichtiger wird als der Erwartungswert.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Währungspositionen, die nirgends stehen',
        },
        {
          type: 'paragraph',
          text: 'Die aufschlussreichste Übung zu diesem Thema ist, die tatsächliche Währungsaufteilung des eigenen Depots zu ermitteln. Sie steht in keiner Depotübersicht, weil dort die Handelswährung ausgewiesen wird – und die ist, wie gesehen, die falsche Größe.',
        },
        {
          type: 'list',
          items: [
            '**Umsatzwährung statt Sitzland.** Ein europäischer Konzern, der drei Viertel seines Umsatzes in Dollar macht, ist wirtschaftlich zu drei Vierteln eine Dollarposition. Der Sitz in Deutschland ändert daran nichts – nur die Steuerpflicht.',
            '**Schwellenländeranleihen.** Papiere in **Lokalwährung** tragen das volle Währungsrisiko und bieten dafür höhere Kupons. Papiere in **Hartwährung** – Dollar oder Euro – tragen es nicht, dafür trägt der Emittent es, was sein Ausfallrisiko erhöht. Das Risiko verschwindet nicht, es wechselt nur die Seite.',
            '**Rohstoffe.** Sie notieren fast durchweg in Dollar. Wer Gold hält, hält damit auch eine Dollarposition – das erklärt einen Teil der Bewegungen, die sonst rätselhaft wirken.',
            '**Der Welt-ETF.** Er ist die größte verdeckte Dollarposition der meisten Privatdepots, weil US-Unternehmen den größten Teil des Weltindex stellen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was einen Wechselkurs kurzfristig bewegt',
        },
        {
          type: 'paragraph',
          text: 'Langfristig zieht die Kaufkraft; kurzfristig, also über Monate und Jahre, dominiert etwas anderes – und das ist der Zeitraum, in dem die meisten ihre Depots betrachten.',
        },
        {
          type: 'list',
          items: [
            '**Die Zinsdifferenz und ihre Erwartung.** Nicht der Zins selbst bewegt, sondern seine Änderung gegenüber dem, was eingepreist war. Kapital fließt dorthin, wo es künftig mehr Zins erwartet.',
            '**Sichere Häfen in Stressphasen.** Dollar, Schweizer Franken und Yen werten in Krisen regelmäßig auf – unabhängig davon, wo die Krise ihren Ursprung hat. Für einen Anleger im Euroraum ist das ein Dämpfer im Depot, nicht ein zusätzlicher Schaden.',
            '**Handelsbilanz und Kapitalströme.** Ein dauerhaftes Defizit muss finanziert werden; solange das Kapital gern kommt, stützt es die Währung, und wenn es ausbleibt, kippt sie schnell.',
            '**Eingriffe der Notenbank.** Sie können einen Kurs über Monate halten und tun es regelmäßig. Auf Dauer scheitern sie, wenn sie gegen die wirtschaftliche Lage arbeiten.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum Währungsrisiko im Aktiendepot meist unbedeutend ist',
        },
        {
          type: 'paragraph',
          text: 'Es ist die häufigste Sorge und der geringste Effekt. Der Grund liegt in der Zeit: Währungsschwankungen sind über lange Strecken **mittelwertsuchend** – sie schwingen um einen Wert, statt sich aufzuaddieren. Aktienrenditen tun das Gegenteil, sie summieren sich.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was daraus folgt',
          items: [
            '**Über zwanzig Jahre verschwindet der Währungsbeitrag im Aktienergebnis** – nicht, weil er klein wäre, sondern weil er nicht wächst, während das Ergebnis wächst.',
            '**Bei Anleihen ist es umgekehrt.** Deren Ertrag ist klein, und die Währungsschwankung ist größer als er. Deshalb ist die übliche Empfehlung, Anleihen in der eigenen Währung zu halten oder abzusichern – und Aktien nicht.',
            '**Die Absicherung kostet die Zinsdifferenz, jedes Jahr.** Bei einer Währung mit deutlich niedrigerem Zins ist das ein spürbarer, dauerhafter Abschlag für die Beseitigung eines Risikos, das sich über die Zeit ohnehin ausmittelt.',
            '**Für Geld, das in wenigen Jahren gebraucht wird, gilt das alles nicht.** Dort ist die Schwankung nicht ausgemittelt, sondern genau das Risiko.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Fehler beim Blick auf den eigenen Kurs',
        },
        {
          type: 'paragraph',
          text: 'Wer einen amerikanischen Fonds in Euro im Depot sieht, sieht zwei Effekte in einer Zahl: die Entwicklung der Aktien und die des Dollars. Ein Minus kann bedeuten, dass die Kurse gefallen sind – oder dass sie gestiegen sind und der Dollar stärker nachgegeben hat. Beides sieht identisch aus und verlangt verschiedene Schlüsse.',
        },
        {
          type: 'list',
          items: [
            '**Die Fondswährung sagt darüber gar nichts.** Ob ein Weltfonds in Euro oder Dollar notiert, ändert am Währungsrisiko keinen Cent – entscheidend ist, worin die enthaltenen Unternehmen wirtschaften.',
            '**„EUR-hedged" im Namen ist der einzige Hinweis, der zählt.** Nur er bedeutet, dass tatsächlich abgesichert wird.',
            '**Wer den Anteil wissen will, sieht in die Währungsaufteilung des Fonds**, nicht auf sein Kürzel.',
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
            'Die Kosten einer Absicherung entsprechen im Kern der Zinsdifferenz beider Währungsräume.',
            'Bei Anleihen ist Absicherung üblich, bei Aktien meist verzichtbar – es kommt auf das Verhältnis der Schwankungen an.',
            'In der Entnahmephase gewinnt Planbarkeit an Gewicht und damit die Absicherung.',
            'Die echte Währungsaufteilung folgt der Umsatzwährung der Unternehmen, nicht der Handelswährung.',
            'Kurzfristig bewegt die Zinserwartung, langfristig die Kaufkraft.',
            'Währungen schwingen um einen Wert, Aktienrenditen summieren sich – deshalb verschwindet der Effekt über die Zeit.',
            'Bei Anleihen ist die Schwankung größer als der Ertrag, deshalb dort absichern und bei Aktien nicht.',
            'Die Fondswährung sagt nichts über das Währungsrisiko; nur „hedged" tut es.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Devisenmarkt: Paritäten, Struktur, Besteuerung',
      metaDescription:
        'Kaufkraftparität und Zinsparität, das Forward-Premium-Puzzle als Grundlage des Carry-Trades, Marktstruktur und Interventionen sowie steuerliche Behandlung.',
      title: 'Paritäten, Marktstruktur und Steuern',
      lead: 'Die Theorien, warum eine davon empirisch scheitert – und was daraus die größte Wette des Devisenmarkts geworden ist.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Drei Paritätsbedingungen',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Kaufkraftparität.** Gleiche Güter sollten überall gleich viel kosten, umgerechnet in eine Währung. Über Jahrzehnte gibt es eine Tendenz in diese Richtung; über Jahre ist die Abweichung so groß, dass sie für nichts zu gebrauchen ist. Handelshemmnisse, nicht handelbare Leistungen und Produktivitätsunterschiede erklären den Rest.',
            '**Gedeckte Zinsparität.** Der Terminkurs muss der Zinsdifferenz entsprechen, sonst ließe sich risikolos Geld verdienen. Diese Bedingung gilt praktisch immer – sie ist keine Theorie über Verhalten, sondern eine Arbitragebedingung. Größere Abweichungen traten nach 2008 auf und wurden zum Indikator für Stress im Bankensystem.',
            '**Ungedeckte Zinsparität.** Eine Währung mit höherem Zins müsste im gleichen Maß abwerten, sonst wäre der Zinsvorteil ein freies Mittagessen. Das ist die einzige der drei Bedingungen, die sich empirisch nicht bestätigt – und zwar systematisch.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Das Forward-Premium-Puzzle',
          items: [
            'Hochzinswährungen werten im Durchschnitt **nicht** so ab, wie es die ungedeckte Zinsparität verlangt. Über lange Zeiträume werten sie teils sogar auf.',
            'Darauf beruht der **Carry-Trade**: in einer Niedrigzinswährung Geld aufnehmen, in einer Hochzinswährung anlegen, die Zinsdifferenz vereinnahmen.',
            'Er funktioniert über Monate und Jahre und bricht dann abrupt zusammen. Das Ertragsprofil ist dasselbe wie beim Verkauf von Volatilität: viele kleine Gewinne, selten ein sehr großer Verlust.',
            'Genau das ist die vermutlich beste Erklärung für das Puzzle – die Zinsdifferenz ist keine Anomalie, sondern die Vergütung für ein Risiko, das sich in ruhigen Phasen nicht zeigt.',
          ],
        },
        {
          type: 'figure',
          figure: 'waehrung-paritaeten',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie dieser Markt gebaut ist',
        },
        {
          type: 'list',
          items: [
            '**Der größte Markt der Welt.** Der tägliche Umsatz übersteigt den aller Aktienmärkte zusammen um ein Vielfaches. Der überwiegende Teil davon entfällt nicht auf den Kassamarkt, sondern auf **Swaps** – kurzfristige Tauschgeschäfte zur Liquiditätssteuerung von Banken und Unternehmen.',
            '**Dezentral und rund um die Uhr.** Es gibt keine zentrale Börse. Gehandelt wird von der Eröffnung in Asien bis zum Schluss in New York; die Liquidität ist am höchsten, wenn London und New York gleichzeitig geöffnet haben, und am dünnsten in den frühen asiatischen Stunden. Auffällige Kursausschläge fallen deshalb überproportional in diese dünnen Stunden.',
            '**Interventionen.** Notenbanken können am Markt eingreifen, um ihre Währung zu stützen oder zu bremsen. Gegen einen anhaltenden Trend gelingt das selten dauerhaft – die Devisenreserven eines Landes sind endlich, der Markt ist es nicht. Wirksamer sind koordinierte Interventionen mehrerer Notenbanken und solche, die eine ohnehin drehende Entwicklung verstärken.',
            '**Wechselkursbindungen.** Ein Land kann seine Währung an eine andere koppeln. Das erfordert Reserven und den Verzicht auf eine eigenständige Geldpolitik – zwei Preise, die im Ernstfall gleichzeitig fällig werden.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Steuer und Praxis',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Währungsgewinne im Privatvermögen – keine Steuerberatung',
          items: [
            'Bei Wertpapieren in Fremdwährung ist der Währungseffekt Teil des Veräußerungsgewinns: Angeschafft und veräußert wird jeweils zum Eurogegenwert, die Differenz umfasst beides.',
            'Bei reinen **Fremdwährungsguthaben** – also Geld auf einem Devisenkonto – ist die Rechtslage eine andere und hängt an Haltedauer und Verzinsung des Kontos. Wer nennenswerte Beträge in Fremdwährung hält, sollte das klären lassen, statt es zu unterstellen.',
            'Praktisch entscheidend ist die **Dokumentation**: Wer mehrfach umtauscht, braucht die Kurse zu jedem Zeitpunkt. Ein Fremdwährungskonto erzeugt Aufwand, der bei kleineren Beträgen in keinem Verhältnis zum Nutzen steht.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Am Ende steht eine unspektakuläre Einsicht, die die meisten Absicherungsfragen erledigt: **Die wirksamste Währungsabsicherung besteht darin, in der eigenen Verbrauchswährung zu planen.** Wer seinen Ruhestand in Euro verbringt, sollte seine Verpflichtungen in Euro rechnen und die Fremdwährungsquote danach bemessen – nicht nach einer Einschätzung darüber, wohin der Dollar läuft. Diese Einschätzung hat noch niemand verlässlich hinbekommen, und der Devisenmarkt ist der Ort, an dem die meisten Prognosen scheitern.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Die gedeckte Zinsparität ist eine Arbitragebedingung und gilt; die ungedeckte gilt empirisch nicht.',
            'Der Carry-Trade lebt von dieser Lücke – mit dem Ertragsprofil einer Versicherung.',
            'Interventionen wirken selten gegen einen anhaltenden Trend; Reserven sind endlich.',
            'Die beste Absicherung ist, in der eigenen Verbrauchswährung zu planen.',
          ],
        },
      ],
    },
  },
}
