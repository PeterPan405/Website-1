import type { LearnTopic } from '@/data/learn/types'
import { formatPercent } from '@/lib/format'

/*
  Die Ausgleichsrechnung wird gerechnet, nicht geschrieben.

  „Ein Minus von 30 Prozent braucht ein Plus von rund 43 Prozent“ ist die Art
  Satz, die beim Umschreiben still falsch wird – jemand ändert die 30 in eine
  40 und vergisst die zweite Zahl. Als Funktion kann das nicht passieren.
*/
const ausgleichProzent = (verlust: number) => (1 / (1 - verlust / 100) - 1) * 100
const RUECKGAENGE = [10, 20, 30, 50, 70, 90]

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner klärt die Grundbeziehung, die vier Risikoarten und die
 * Asymmetrie von Verlust und Ausgleich. Fortgeschritten behandelt Volatilität,
 * maximalen Rückgang, Sharpe-Verhältnis und Korrelation – und wo diese Maße
 * versagen. Profi geht auf Verteilungsannahmen, Sequenzrisiko und die
 * Unterscheidung von Tragfähigkeit und Bereitschaft ein.
 */
export const risikoUndRendite: LearnTopic = {
  slug: 'risiko-und-rendite',
  title: 'Risiko & Rendite',
  headline: 'Risiko und Rendite: die Regel hinter allen Anlageentscheidungen',
  metaTitle: 'Risiko und Rendite: Volatilität, Drawdown und Horizont',
  metaDescription:
    'Warum Rendite ohne Risiko nicht zu haben ist, wie Schwankung gemessen wird, was ein maximaler Drawdown aussagt und welche Rolle der Anlagehorizont spielt.',
  lead: 'Jede Anlageentscheidung ist eine Entscheidung über Risiko – die Rendite ist nur der Preis, den der Markt dafür zahlt.',
  overview: [
    'Rendite ist die Entschädigung für übernommenes Risiko. Eine Anlage, die höhere Erträge verspricht als andere, tut das nie ohne Gegenleistung – die Frage ist immer, worin diese Gegenleistung besteht.',
    'Risiko ist dabei nicht ein einziger Begriff: Kursschwankung, dauerhafter Kapitalverlust, Ausfall eines Schuldners und die Gefahr, zum falschen Zeitpunkt verkaufen zu müssen, sind vier verschiedene Dinge.',
    'Die Stufen führen von der Grundbeziehung über Kennzahlen wie Volatilität, maximalen Drawdown und Sharpe-Ratio bis zur Frage, wie sich eine persönliche Risikotragfähigkeit von der Risikobereitschaft unterscheidet.',
  ],
  keywords: [
    'Risiko',
    'Rendite',
    'Volatilität',
    'Drawdown',
    'Schwankung',
    'Anlagehorizont',
    'Risikotragfähigkeit',
    'Sharpe-Ratio',
  ],
  related: ['aktien-laender-branchen', 'portfolio-aufbau', 'groesste-crashes', 'aktie'],
  calculators: ['/rechner/zinsrechner'],
  symbols: ['msci-world', 'dax'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Risiko und Rendite einfach erklärt',
      metaDescription:
        'Warum es keine hohe Rendite ohne Risiko gibt, welche Risikoarten es gibt und was Schwankung im Depot praktisch bedeutet.',
      title: 'Risiko und Rendite einfach erklärt',
      lead: 'Nach dieser Stufe erkennst du, wofür eine Anlage dich eigentlich bezahlt, kennst die vier Risikoarten und weißt, warum Verluste schwerer wiegen als gleich große Gewinne.',
      readingMinutes: 8,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Es gibt eine Frage, die jedes Anlageangebot in wenigen Sekunden einordnet: **Wofür genau werde ich hier bezahlt?**',
        },
        {
          type: 'paragraph',
          text: 'Denn Rendite fällt nicht vom Himmel. Sie ist die Entschädigung dafür, dass jemand etwas auf sich nimmt, das ein anderer lieber vermeidet – Unsicherheit, Wartezeit, die Möglichkeit eines Verlusts. Wer mehr Rendite will, muss mehr davon übernehmen. Eine Anlage, die hohe Erträge ohne Gegenleistung verspricht, gibt es nicht; es gibt nur solche, bei denen man die Gegenleistung noch nicht gefunden hat.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Die Prüffrage anwenden',
          items: [
            '**Tagesgeld, 2 Prozent** – bezahlt wird man dafür, dass man der Bank Geld leiht. Wenig Risiko, wenig Ertrag.',
            '**Unternehmensanleihe, 6 Prozent** – bezahlt wird das Ausfallrisiko des Unternehmens. Geht es pleite, ist das Geld weg.',
            '**Aktien, langfristig mehr** – bezahlt wird, dass man Schwankungen aushält und im Insolvenzfall zuletzt bedient wird.',
            '**„12 Prozent, sicher, monatlich“** – hier findet man die Gegenleistung nicht. Das ist kein Grund zur Freude, sondern zur Vorsicht.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Vier Risiken, die oft in einen Topf geworfen werden',
        },
        {
          type: 'table',
          caption: 'Sie fühlen sich ähnlich an und sind es nicht',
          head: ['Risiko', 'Was passiert', 'Ist es endgültig?'],
          rows: [
            [
              'Kursrisiko',
              'Der Wert schwankt – heute weniger als gestern',
              'Nein. Wer nicht verkauft, hat nichts verloren',
            ],
            [
              'Ausfallrisiko',
              'Der Schuldner zahlt nicht zurück',
              'Ja. Eine Insolvenz nimmt man nicht zurück',
            ],
            [
              'Liquiditätsrisiko',
              'Verkaufen geht nur mit Abschlag – oder gar nicht',
              'Kommt darauf an, wie lange man warten kann',
            ],
            [
              'Zeitpunktrisiko',
              'Man muss verkaufen, gerade wenn die Kurse unten sind',
              'Ja – und aus dem Kursrisiko wird dadurch ein echter Verlust',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die letzte Zeile ist die wichtigste, weil sie die einzige ist, die man selbst in der Hand hat. Ein Kursrückgang wird erst dann zu einem Verlust, wenn man verkauft. Wer verkaufen *muss* – weil die Waschmaschine kaputt ist oder das Auto ersetzt werden will –, hat diese Wahl nicht mehr. Genau deshalb steht der Notgroschen auf dem Tagesgeldkonto und nicht im Depot.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum Verluste schwerer wiegen als Gewinne',
        },
        {
          type: 'paragraph',
          text: 'Ein Minus von 50 Prozent wird nicht durch ein Plus von 50 Prozent ausgeglichen. Aus 100 Euro werden erst 50, und 50 Prozent auf 50 Euro sind 25 – man landet bei 75. Der Ausgleich verlangt ein Plus von 100 Prozent.',
        },
        {
          type: 'table',
          caption: 'Was ein Rückgang zum Ausgleich verlangt',
          head: ['Rückgang', 'Nötiger Anstieg'],
          rows: RUECKGAENGE.map((rueckgang) => [
            `− ${formatPercent(rueckgang, 0)}`,
            `+ ${formatPercent(ausgleichProzent(rueckgang), 0)}`,
          ]),
        },
        {
          type: 'paragraph',
          text: 'Bis etwa 20 Prozent ist der Unterschied klein. Danach wird er dramatisch: Nach minus 90 Prozent braucht es eine Verzehnfachung, nur um wieder bei null zu sein. Diese Asymmetrie ist der ganze Grund, warum Streuung wichtiger ist als Trefferquote – ein Totalausfall ist nicht durch drei gute Griffe auszugleichen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die wichtigste Angabe vor jedem Kauf',
        },
        {
          type: 'paragraph',
          text: 'Nicht die erwartete Rendite. Sondern: **Wann brauche ich das Geld wieder?**',
        },
        {
          type: 'list',
          items: [
            '**Unter 3 Jahren** – Tagesgeld oder Festgeld. Der Aktienmarkt kann in dieser Zeit deutlich im Minus stehen, und die Wahrscheinlichkeit dafür ist nicht klein.',
            '**3 bis 10 Jahre** – gemischt, mit einem Anteil, der schwanken darf, und einem, der nicht muss.',
            '**Über 10 bis 15 Jahre** – hier hat der Aktienmarkt historisch seinen Vorsprung ausgespielt, weil genug Zeit war, Rückschläge auszusitzen.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Ein Hinweis, kein Versprechen',
          items: [
            'Diese Zeiträume sind aus der Vergangenheit abgeleitet. Es gibt keine Garantie, dass fünfzehn Jahre immer reichen – Japan brauchte nach 1989 über dreißig.',
            'Die Zeiträume sind deshalb Mindestangaben, keine Zusagen.',
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
            'Rendite ist der Preis für übernommenes Risiko – finde bei jedem Angebot die Gegenleistung.',
            'Kurs-, Ausfall-, Liquiditäts- und Zeitpunktrisiko sind vier verschiedene Dinge.',
            'Ein Buchverlust wird erst durch den Verkauf zu einem echten.',
            'Verluste und Gewinne sind nicht symmetrisch – ab 30 Prozent wird es unangenehm.',
            'Der Anlagehorizont entscheidet über die Anlageform, nicht die erhoffte Rendite.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Volatilität, Drawdown und Kennzahlen für Fortgeschrittene',
      metaDescription:
        'Wie Volatilität berechnet wird, was der maximale Drawdown aussagt, wie Korrelation Risiko senkt und warum Standardabweichung nicht alles erfasst.',
      title: 'Risiko messen',
      lead: 'Welche Kennzahlen es gibt, was sie leisten – und an welcher Stelle jede von ihnen in die Irre führt.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Risiko lässt sich nicht messen. Messen lässt sich nur, wie stark etwas in der Vergangenheit geschwankt hat – und das ist etwas anderes. Alle folgenden Kennzahlen sind trotzdem nützlich, wenn man weiß, was sie nicht sagen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Volatilität',
        },
        {
          type: 'paragraph',
          text: 'Die **Volatilität** ist die Standardabweichung der Renditen, üblicherweise auf ein Jahr hochgerechnet. Sie beantwortet: Wie weit lagen die einzelnen Tagesergebnisse typischerweise vom Durchschnitt entfernt?',
        },
        {
          type: 'table',
          caption: 'Größenordnungen zur Einordnung',
          head: ['Anlage', 'Jahresvolatilität, grob'],
          rows: [
            ['Tagesgeld', 'nahe 0 %'],
            ['Kurzlaufende Staatsanleihen', '2 bis 4 %'],
            ['Breiter Aktienindex', '12 bis 20 %'],
            ['Einzelaktie', '25 bis 50 %'],
            ['Kryptowährungen', 'oft über 60 %'],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die drei Schwächen der Volatilität',
          items: [
            '**Sie behandelt oben und unten gleich.** Ein Wert, der um 30 Prozent steigt, gilt als ebenso „riskant“ wie einer, der um 30 Prozent fällt. Beschwert hat sich über den ersten Fall noch niemand.',
            '**Sie unterstellt eine Normalverteilung.** Danach dürfte ein Tagesverlust von sieben Prozent alle paar Jahrtausende vorkommen. Tatsächlich passiert er alle paar Jahre.',
            '**Sie ist rückwärtsgewandt.** Am niedrigsten ist sie regelmäßig kurz bevor es kracht – lange ruhige Phasen erzeugen niedrige Messwerte und hohe Sorglosigkeit zugleich.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Maximaler Rückgang',
        },
        {
          type: 'paragraph',
          text: 'Der **maximale Rückgang** – auf Englisch Maximum Drawdown – ist der größte Abstand von einem Hoch bis zum darauffolgenden Tief. Er ist die ehrlichere Zahl, weil sie beschreibt, was man tatsächlich aushalten musste. „Volatilität 18 Prozent“ sagt einem Menschen wenig; „das Depot stand zwei Jahre lang 40 Prozent im Minus“ sagt ihm alles.',
        },
        {
          type: 'paragraph',
          text: 'Dazu gehört eine zweite Angabe, die oft fehlt: die **Erholungsdauer**. Der Rückgang selbst dauert oft Monate, das Zurückkommen Jahre. Wer beides kennt, kann die Frage beantworten, auf die es ankommt – hätte ich das durchgehalten?',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Sharpe-Verhältnis und Beta',
        },
        {
          type: 'formula',
          expression: 'Sharpe = (Rendite − risikoloser Zins) ÷ Volatilität',
          description:
            'Wie viel Überrendite je Einheit Schwankung erwirtschaftet wurde. Höher ist besser. Vergleichbar nur zwischen Anlagen desselben Zeitraums – und nur, solange man der Volatilität als Risikomaß traut.',
        },
        {
          type: 'paragraph',
          text: 'Das **Beta** misst, wie stark sich ein Wert relativ zum Gesamtmarkt bewegt. Ein Beta von 1,3 heißt: Steigt der Markt um 10 Prozent, stieg dieser Wert historisch um 13 – und fiel entsprechend stärker. Ein Beta unter 1 bedeutet ruhigeren Verlauf, nicht weniger Risiko: Ein Unternehmen kann ein Beta von 0,6 haben und trotzdem insolvent gehen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Korrelation: der einzige kostenlose Hebel',
        },
        {
          type: 'paragraph',
          text: 'Zwei Anlagen mit je 20 Prozent Volatilität ergeben zusammen nicht zwangsläufig 20 Prozent. Bewegen sie sich nicht im Gleichschritt, gleichen sich Ausschläge teilweise aus – und die Schwankung des Ganzen liegt unter dem Durchschnitt der Teile, ohne dass Rendite geopfert wurde. Das ist der einzige Punkt bei der Geldanlage, an dem es tatsächlich etwas umsonst gibt.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Der Haken',
          items: [
            'Korrelationen sind nicht stabil. In ruhigen Zeiten laufen Anlageklassen auseinander, in Panikphasen fallen sie gemeinsam – genau dann, wenn man den Ausgleich bräuchte.',
            'Beobachtet wurde das 2008 und 2020: Aktien, Unternehmensanleihen, Rohstoffe und Immobilienwerte gaben zugleich nach.',
            'Streuung wirkt trotzdem – nur schwächer als die historische Korrelation verspricht. Wer damit plant, sollte einen Aufschlag einkalkulieren.',
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
            'Volatilität misst Schwankung, nicht Risiko – und behandelt Gewinne wie Verluste.',
            'Der maximale Rückgang samt Erholungsdauer beschreibt besser, was auszuhalten war.',
            'Ein niedriges Beta ist kein Schutz vor einer Insolvenz.',
            'Geringe Korrelation senkt Schwankung ohne Renditeverzicht – hält aber im Ernstfall am wenigsten.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Risiko für Profis: Verteilungen, Sequenzrisiko, Tragfähigkeit',
      metaDescription:
        'Warum Extremereignisse häufiger sind als das Modell erlaubt, was das Sequenzrisiko in der Entnahmephase anrichtet und wie Tragfähigkeit und Bereitschaft auseinanderfallen.',
      title: 'Risiko auf Profi-Niveau',
      lead: 'Wo die Modelle brechen, warum die Reihenfolge der Renditen zählt und wie man die eigene Grenze bestimmt.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die Verteilung hat dicke Enden',
        },
        {
          type: 'paragraph',
          text: 'Die gängigen Risikomaße unterstellen, dass Renditen normalverteilt sind – die Glockenkurve. Sind sie nicht. Tatsächliche Kursrenditen haben **fette Ränder**: Extreme Tage kommen um Größenordnungen häufiger vor, als das Modell zulässt.',
        },
        {
          type: 'paragraph',
          text: 'Der Unterschied ist nicht akademisch. Unter der Glockenkurve wäre der Börsenkrach vom Oktober 1987 – ein Tagesverlust von über 20 Prozent im Dow Jones – ein Ereignis, das in der Lebensdauer des Universums nicht hätte auftreten dürfen. Er trat auf. Wer Risiko über die Standardabweichung steuert, unterschätzt systematisch genau die Fälle, auf die es ankommt.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Praktische Konsequenz',
          items: [
            'Kennzahlen wie Value at Risk („mit 99 Prozent Wahrscheinlichkeit verliere ich höchstens X“) beschreiben den Normalbetrieb und schweigen über das verbleibende Prozent – in dem der eigentliche Schaden liegt.',
            'Nützlicher sind Szenarien statt Wahrscheinlichkeiten: Was passiert bei minus 50 Prozent? Kann ich dann weiter einzahlen? Muss ich verkaufen?',
            'Diese Fragen brauchen kein Modell, sondern eine ehrliche Antwort.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Sequenzrisiko: dieselbe Durchschnittsrendite, zwei Ergebnisse',
        },
        {
          type: 'paragraph',
          text: 'Wer nur anspart und nichts entnimmt, dem ist die Reihenfolge der Renditejahre gleichgültig – am Ende steht dasselbe Ergebnis, ob die guten Jahre am Anfang oder am Schluss lagen. Sobald regelmäßig Geld entnommen wird, ändert sich das grundlegend.',
        },
        {
          type: 'paragraph',
          text: 'Fallen die schlechten Jahre an den Anfang der Entnahmephase, werden Anteile zu niedrigen Kursen verkauft. Diese Anteile fehlen dauerhaft – die spätere Erholung findet auf einem kleineren Bestand statt. Zwei Ruheständler mit identischer Durchschnittsrendite über zwanzig Jahre können deshalb völlig verschieden dastehen, je nachdem, in welcher Reihenfolge die Jahre kamen.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Was dagegen hilft',
          items: [
            '**Ein Puffer aus schwankungsarmen Anlagen**, aus dem in schlechten Jahren entnommen wird – zwei bis drei Jahresbedarfe sind eine verbreitete Größe.',
            '**Flexible statt fester Entnahmen**: Wer in einem Rückgangsjahr weniger entnimmt, verkauft weniger Anteile zum Tiefstkurs.',
            '**Die Aktienquote vor Beginn der Entnahme senken** – nicht danach. Das Sequenzrisiko ist in den ersten Jahren am größten.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Tragfähigkeit ist nicht Bereitschaft',
        },
        {
          type: 'paragraph',
          text: 'Zwei Fragen werden regelmäßig vermengt und haben nichts miteinander zu tun.',
        },
        {
          type: 'table',
          caption: 'Zwei Fragen, zwei Antworten',
          head: ['', 'Risikotragfähigkeit', 'Risikobereitschaft'],
          rows: [
            [
              'Frage',
              'Wie viel Verlust kann ich verkraften, ohne dass mein Leben sich ändert?',
              'Wie viel Verlust halte ich aus, ohne nachts wach zu liegen?',
            ],
            [
              'Bestimmt durch',
              'Einkommen, Rücklagen, Verpflichtungen, Zeithorizont – nachrechenbar',
              'Charakter und Erfahrung – nicht nachrechenbar',
            ],
            [
              'Ändert sich',
              'Mit den Lebensumständen',
              'Mit der Marktlage, und zwar meist im ungünstigsten Moment',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Maßgeblich ist die **kleinere** der beiden. Wer viel tragen könnte, es aber nicht aushält, verkauft im Rückgang – und realisiert damit genau den Verlust, den er sich rechnerisch hätte leisten können. Ein Depot, das nicht durchgehalten wird, ist unabhängig von seiner Konstruktion das falsche.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Bereitschaft überschätzt sich selbst',
          items: [
            'In Fragebögen wird sie regelmäßig zu hoch angegeben – ein hypothetischer Verlust von 30 Prozent liest sich anders, als er sich anfühlt.',
            'Ein brauchbarer Test: Rechne den Prozentwert in Euro um. „Minus 30 Prozent“ und „minus 24.000 Euro“ sind dieselbe Aussage und lösen verschiedene Reaktionen aus.',
            'Wer das noch nie erlebt hat, sollte vorsichtiger ansetzen und später erhöhen. Der umgekehrte Weg wird fast immer im schlechtesten Moment gegangen.',
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
            'Renditeverteilungen haben fette Ränder – Modelle unterschätzen genau die Fälle, auf die es ankommt.',
            'Szenarien schlagen Wahrscheinlichkeiten: Was tue ich bei minus 50 Prozent?',
            'In der Entnahmephase entscheidet die Reihenfolge der Renditen, nicht ihr Durchschnitt.',
            'Maßgeblich ist die kleinere von Tragfähigkeit und Bereitschaft.',
          ],
        },
      ],
    },
  },
}
