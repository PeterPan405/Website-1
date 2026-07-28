import type { LearnTopic } from '@/data/learn/types'
import { zinsschock } from '@/lib/anleihen'
import { formatNumber, formatPercent } from '@/lib/format'

/*
  Die Wirkung eines Zinsschritts wird gerechnet, nicht behauptet.

  „Zinsen rauf, Anleihen runter, Aktien runter“ steht in jedem
  Marktkommentar und erklärt nichts. Interessant ist die Größenordnung – und
  vor allem, dass sie bei Anleihen exakt bestimmbar ist und bei Aktien nur
  modellhaft. Der Unterschied zwischen beiden ist selbst eine Aussage über
  Geldpolitik: Was sie mechanisch bewirkt, lässt sich ausrechnen; was sie
  über Erwartungen bewirkt, nicht.
*/
const LANGE_ANLEIHE = { kuponProzent: 3, jahre: 10 }
const AUSGANGSZINS = 3
const SCHRITTE = [0.25, 0.5, 1]
const anleihewirkung = SCHRITTE.map((punkte) => ({
  punkte,
  ...zinsschock(LANGE_ANLEIHE, AUSGANGSZINS, punkte),
}))

/*
  Der Abzinsungseffekt bei Aktien, an einem bewusst einfachen Modell.

  Barwert einer ewigen, mit g wachsenden Zahlung: Z / (r − g). Das Modell ist
  grob – es unterstellt konstantes Wachstum bis in alle Ewigkeit. Es zeigt
  aber genau den Punkt, um den es geht: Je weiter die Gewinne in der Zukunft
  liegen (also je näher g an r), desto heftiger reagiert der Wert auf eine
  Zinsänderung. Deshalb trifft ein Zinsanstieg Wachstumswerte härter.
*/
const RISIKOPRAEMIE = 4
const WACHSTUMSRATEN = [0, 2, 4]

function barwert(zinsProzent: number, wachstumProzent: number): number {
  const r = (zinsProzent + RISIKOPRAEMIE) / 100
  return 1 / (r - wachstumProzent / 100)
}

const aktienwirkung = WACHSTUMSRATEN.map((wachstum) => {
  const vorher = barwert(AUSGANGSZINS, wachstum)
  const nachher = barwert(AUSGANGSZINS + 1, wachstum)
  return { wachstum, aenderung: ((nachher - vorher) / vorher) * 100 }
})

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner klärt Auftrag, die drei Leitzinsen und den Ablauf
 * eines Zinsentscheids. Fortgeschritten behandelt die Übertragungswege, die
 * Zeitverzögerung und die Instrumente jenseits des Zinses. Profi geht auf
 * Referenzgrößen, Zielkonflikte und die Frage ein, was Anleger daraus
 * machen sollten – und was nicht.
 *
 * ## Abgrenzung zu „Inflation“
 *
 * Dort steht, was Inflation ist und wie sie gemessen wird. Hier steht, wer
 * darauf reagiert und mit welchen Mitteln.
 */
export const notenbankenGeldpolitik: LearnTopic = {
  slug: 'notenbanken-geldpolitik',
  title: 'Notenbanken & Geldpolitik',
  headline: 'Warum ein Zinsentscheid dein Depot erreicht',
  metaTitle: 'Notenbanken und Geldpolitik: EZB, Fed und die Leitzinsen',
  metaDescription:
    'Was Notenbanken tun, welche Leitzinsen es gibt, über welche Wege ein Zinsschritt wirkt und warum die Erwartung wichtiger ist als die Entscheidung selbst.',
  lead: 'Notenbanken setzen den Preis des Geldes – und damit die Messlatte für jede Anlage, jeden Kredit und jeden Sparzins.',
  overview: [
    'Eine Notenbank hat ein Werkzeug von echter Wucht: den Preis, zu dem sich Banken Geld beschaffen. Von dort aus wirkt sie auf jeden Kredit, jeden Sparzins und über die Abzinsung auf jede Bewertung am Kapitalmarkt.',
    'Der wichtigste Satz zum Verständnis lautet: Bewegt wird nicht die Entscheidung, sondern die Abweichung von der Erwartung. Ein erwarteter Zinsschritt steht längst in den Kursen, wenn er verkündet wird.',
    'Die Stufen führen von Auftrag und Leitzinsen über die Übertragungswege und die lange Zeitverzögerung bis zu Referenzgrößen, Zielkonflikten und dem, was daraus für ein Depot folgt.',
  ],
  keywords: [
    'Notenbank',
    'EZB',
    'Fed',
    'Leitzins',
    'Geldpolitik',
    'Einlagesatz',
    'Quantitative Lockerung',
  ],
  related: ['inflation', 'staatsanleihe', 'waehrungen-wechselkurse', 'boerse'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Notenbanken einfach erklärt: Auftrag und Leitzinsen',
      metaDescription:
        'Was eine Notenbank tut, welche drei Leitzinsen die EZB setzt, welcher davon für Sparer zählt und wie ein Zinsentscheid abläuft.',
      title: 'Wer den Preis des Geldes setzt',
      lead: 'Auftrag, die drei Leitzinsen – und warum in den Nachrichten meist nur einer davon gemeint ist.',
      readingMinutes: 8,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eine Notenbank verwaltet kein Geld für Bürger und vergibt keine Kredite an Unternehmen. Sie ist die Bank der Banken – und sie setzt den Preis, zu dem diese sich Geld beschaffen oder anlegen können. Weil jede Bank diesen Preis weitergibt, wirkt eine einzige Entscheidung bis auf das Tagesgeldkonto und in den Baukredit.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Auftrag',
        },
        {
          type: 'table',
          caption: 'Zwei große Notenbanken, zwei Mandate',
          head: ['', 'Europäische Zentralbank', 'US-Notenbank (Fed)'],
          rows: [
            [
              'Vorrangiges Ziel',
              'Preisstabilität – definiert als zwei Prozent Inflation auf mittlere Sicht',
              'Doppelmandat: Preisstabilität **und** maximale Beschäftigung',
            ],
            [
              'Folge daraus',
              'Bei hoher Inflation muss sie handeln, auch wenn die Konjunktur leidet',
              'Sie muss zwischen zwei Zielen abwägen, die sich widersprechen können',
            ],
            [
              'Zuständigkeit',
              'Zwanzig Staaten mit eigenen Haushalten',
              'Ein Staat mit einem Haushalt',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Zwei verbreitete Missverständnisse',
          items: [
            '**„Die Notenbank druckt Geld für den Staat.“** Die direkte Finanzierung von Staatshaushalten ist der EZB vertraglich untersagt. Sie kauft Staatsanleihen am Sekundärmarkt, also von Banken und Fonds – der Unterschied ist rechtlich wesentlich und wirtschaftlich umstritten.',
            '**„Zwei Prozent Inflation sind willkürlich.“** Sie sind eine Setzung, aber keine beliebige: Ein kleiner Abstand zur Null hält Spielraum für Zinssenkungen und verringert die Gefahr fallender Preise, die Konsum und Investitionen aufschieben lässt.',
            'Die **Unabhängigkeit** von der Politik ist die Voraussetzung für beides. Eine Regierung hätte kurz vor Wahlen stets ein Interesse an niedrigen Zinsen – und die Erfahrung mit politisch gesteuerten Notenbanken ist historisch eindeutig schlecht.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die drei Leitzinsen der EZB',
        },
        {
          type: 'table',
          caption: 'Wofür sie jeweils gelten',
          head: ['Satz', 'Wofür', 'Bedeutung'],
          rows: [
            [
              'Einlagesatz',
              'Was Banken erhalten, wenn sie Geld über Nacht bei der EZB parken',
              'Der wichtigste. Er bestimmt die Untergrenze des Geldmarkts – und damit, was auf deinem Tagesgeld möglich ist',
            ],
            [
              'Hauptrefinanzierungssatz',
              'Zu diesem Satz leihen sich Banken wöchentlich Geld',
              'Historisch der zentrale Satz, heute eher ein Referenzwert',
            ],
            [
              'Spitzenrefinanzierungssatz',
              'Notfallkredit über Nacht',
              'Die Obergrenze des Korridors; wird selten in Anspruch genommen',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Ist in Meldungen von „dem Leitzins“ die Rede, ist im Euroraum meist der **Einlagesatz** gemeint. Er ist der Satz, an dem sich Banken orientieren, wenn sie überschüssige Liquidität haben – und genau deshalb bewegt sich dein Tagesgeldzins mit ihm und nicht mit den anderen beiden.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie ein Zinsentscheid abläuft',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Die Sitzung.** Der EZB-Rat tagt etwa alle sechs Wochen, das Pendant der Fed acht Mal im Jahr. Die Termine stehen ein Jahr im Voraus fest.',
            '**Die Entscheidung.** Sie wird zu einer festen Uhrzeit veröffentlicht, gefolgt von einer Pressekonferenz. Die Märkte reagieren dabei häufiger auf die Pressekonferenz als auf die Zahl.',
            '**Die Projektionen.** Vierteljährlich veröffentlichen beide Notenbanken ihre eigenen Prognosen zu Inflation und Wachstum. Die Fed zeigt zusätzlich den **Dot Plot**: die Zinserwartung jedes einzelnen Mitglieds als Punkt.',
            '**Die Einordnung.** Was Notenbanker in den Wochen danach sagen, wirkt weiter – teils stärker als die Entscheidung selbst.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Der wichtigste Satz zu diesem Thema',
          items: [
            '**Bewegt wird nicht die Entscheidung, sondern die Überraschung.** Ein Zinsschritt, den alle erwarten, steht bereits in den Kursen, wenn er verkündet wird.',
            'Deshalb kann der Markt nach einer Zinserhöhung steigen – wenn die Erhöhung kleiner ausfiel als befürchtet oder der Ausblick milder klang.',
            '**Forward Guidance** nutzt genau das: Eine Notenbank kann allein durch Ankündigungen wirken, ohne den Zins anzufassen. Die Erwartung ist das Werkzeug, nicht die Zahl.',
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
            'Die EZB hat ein Ziel – Preisstabilität –, die Fed zwei.',
            'Mit „dem Leitzins“ ist im Euroraum meist der Einlagesatz gemeint; er steuert das Tagesgeld.',
            'Direkte Staatsfinanzierung ist der EZB untersagt; sie kauft am Sekundärmarkt.',
            'Kurse bewegt nicht die Entscheidung, sondern die Abweichung von der Erwartung.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Geldpolitik: Übertragungswege und Zeitverzögerung',
      metaDescription:
        'Über welche Kanäle ein Zinsschritt wirkt, warum die Wirkung Monate braucht, was Anleihekäufe bewirken und wie Geldpolitik auf Wechselkurse durchschlägt.',
      title: 'Wie ein Zinsschritt ankommt',
      lead: 'Die vier Übertragungswege, die lange Verzögerung – und was Notenbanken tun, wenn der Zins nicht mehr reicht.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Vier Wege in die Wirtschaft',
        },
        {
          type: 'list',
          items: [
            '**Zinskanal.** Kredite werden teurer, Einlagen attraktiver. Investitionen und Konsum auf Pump werden zurückgestellt. Der direkteste Weg – und der langsamste, weil bestehende Verträge weiterlaufen.',
            '**Kreditkanal.** Banken verändern nicht nur den Preis, sondern die Bereitschaft: Sie prüfen strenger, verlangen mehr Sicherheiten, lehnen häufiger ab. Dieser Weg wirkt schneller als der Zinskanal und ist in Umfragen unter Banken früh sichtbar.',
            '**Vermögenspreiskanal.** Höhere Zinsen senken den Barwert künftiger Zahlungen – Anleihen, Aktien und Immobilien werden neu bewertet. Wer sich ärmer fühlt, gibt weniger aus.',
            '**Wechselkurskanal.** Höhere Zinsen ziehen Kapital an, die Währung wertet auf. Importe werden billiger, was die Inflation dämpft; Exporte werden teurer, was die Konjunktur dämpft.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Vermögenspreiskanal, ausgerechnet',
        },
        {
          type: 'paragraph',
          text: `Bei Anleihen lässt sich die Wirkung exakt bestimmen. Eine zehnjährige Anleihe mit ${formatPercent(LANGE_ANLEIHE.kuponProzent, 0)} Kupon, bei einem Marktzins von ${formatPercent(AUSGANGSZINS, 0)} also zu 100 notierend:`,
        },
        {
          type: 'table',
          caption: 'Kurswirkung eines Zinsschritts auf eine zehnjährige Anleihe',
          head: ['Zinsschritt', 'Neuer Kurs', 'Kursänderung'],
          rows: anleihewirkung.map((zeile) => [
            `+ ${formatPercent(zeile.punkte, 2)}`,
            formatNumber(zeile.nachher, 2),
            formatPercent(zeile.tatsaechlichProzent, 1),
          ]),
        },
        {
          type: 'paragraph',
          text: 'Bei Aktien geht das nicht exakt, aber die Richtung folgt derselben Logik: Künftige Gewinne werden mit einem höheren Satz abgezinst und sind heute weniger wert. Entscheidend ist dabei, **wann** die Gewinne anfallen. Ein einfaches Modell – eine ewig mit einer festen Rate wachsende Zahlung – zeigt den Zusammenhang:',
        },
        {
          type: 'table',
          caption: `Rechnerische Bewertungsänderung bei einem Prozentpunkt höherem Zins, Risikoprämie ${formatPercent(RISIKOPRAEMIE, 0)}`,
          head: ['Erwartetes Gewinnwachstum', 'Bewertungsänderung'],
          rows: aktienwirkung.map((zeile) => [
            formatPercent(zeile.wachstum, 0),
            formatPercent(zeile.aenderung, 1),
          ]),
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum Wachstumswerte härter getroffen werden',
          items: [
            'Je höher das erwartete Wachstum, desto weiter in der Zukunft liegt der Großteil der Gewinne – und desto stärker wirkt jede Änderung des Abzinsungssatzes.',
            'Das erklärt, warum 2022 Technologiewerte deutlich stärker verloren als Versorger oder Konsumgüterhersteller, ohne dass sich an ihren Geschäften etwas geändert hätte.',
            'Das Modell ist bewusst grob – es unterstellt ewiges gleichmäßiges Wachstum und ist als Bewertung unbrauchbar. Die **Richtung und Größenordnung** des Effekts gibt es trotzdem korrekt wieder.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum alles so lange dauert',
        },
        {
          type: 'paragraph',
          text: 'Die Wirkung auf die Inflation setzt erst nach etwa vier bis sechs Quartalen voll ein. Bestehende Kredite laufen weiter, Mietverträge und Tarifabschlüsse gelten für Jahre, Investitionsentscheidungen sind getroffen. Daraus folgt ein grundsätzliches Problem: **Eine Notenbank kann nicht auf die heutige Inflation reagieren.** Sie muss auf die Inflation in anderthalb Jahren reagieren – also auf eine Prognose.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zwei Folgen daraus',
          items: [
            '**Übersteuerung.** Wer nachsteuert, bis die Daten sich bessern, hat zwangsläufig zu lange nachgesteuert – die Wirkung der letzten Schritte kommt erst danach an. Das ist die strukturelle Ursache dafür, dass Zinszyklen regelmäßig über das Ziel hinausschießen.',
            '**Asymmetrie in der Weitergabe.** Banken geben sinkende Zinsen auf Kredite schnell weiter und auf Einlagen langsam; bei steigenden Zinsen ist es umgekehrt. Das ist kein Vorwurf, sondern Wettbewerb – für Sparer bedeutet es, dass ein Zinsanstieg mit Verzögerung auf dem Tagesgeldkonto ankommt und ein Rückgang sofort.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wenn der Zins nicht mehr reicht',
        },
        {
          type: 'table',
          caption: 'Instrumente jenseits des Leitzinses',
          head: ['Instrument', 'Wirkungsweise', 'Nebenwirkung'],
          rows: [
            [
              'Quantitative Lockerung',
              'Ankauf von Anleihen senkt die langen Zinsen, wenn die kurzen bereits bei null liegen',
              'Ein großer Teil des Umlaufs verschwindet aus dem Markt; die Preisbildung wird dünner',
            ],
            [
              'Quantitative Straffung',
              'Fällige Papiere werden nicht ersetzt, die Bilanz schrumpft',
              'Private Käufer müssen nachrücken – und verlangen einen Preis, den die Notenbank nicht verlangt hat',
            ],
            [
              'Langfristige Refinanzierung',
              'Günstige mehrjährige Kredite an Banken, teils an Kreditvergabe geknüpft',
              'Wirkt gezielt auf den Kreditkanal, macht Banken aber von der Notenbank abhängig',
            ],
            [
              'Mindestreserve',
              'Pflichtguthaben der Banken bei der Notenbank',
              'Heute praktisch bedeutungslos für die Steuerung – wirkt eher über die Verzinsung dieser Guthaben',
            ],
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
            'Ein Zinsschritt wirkt über Zins-, Kredit-, Vermögenspreis- und Wechselkurskanal.',
            'Bei Anleihen ist die Wirkung exakt berechenbar, bei Aktien nur modellhaft – Wachstumswerte reagieren stärker.',
            'Die volle Wirkung auf die Inflation braucht vier bis sechs Quartale; Notenbanken steuern deshalb nach Prognosen.',
            'Sinkende Zinsen kommen beim Sparer schneller an als steigende.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Geldpolitik: Taylor-Regel, natürlicher Zins, Zielkonflikte',
      metaDescription:
        'Referenzgrößen der Geldpolitik, ihre empirischen Schwächen, fiskalische Dominanz und Fragmentierung – und was Anleger daraus ableiten können.',
      title: 'Referenzgrößen, Konflikte und Konsequenzen',
      lead: 'Woran sich Notenbanken orientieren, wo ihre Werkzeuge an Grenzen stoßen – und warum Sitzungen als Erklärung taugen, nicht als Signal.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Größen, an denen sich Geldpolitik misst',
        },
        {
          type: 'list',
          items: [
            '**Die Taylor-Regel.** Eine Faustformel: Der angemessene Leitzins ergibt sich aus dem natürlichen Zins plus der Inflation, korrigiert um die Abweichung der Inflation vom Ziel und um die Auslastung der Wirtschaft. Sie ist erstaunlich gut darin, vergangene Entscheidungen zu erklären, und unbrauchbar als Vorgabe – weil zwei ihrer Eingangsgrößen nicht messbar sind.',
            '**Der natürliche Zins.** Das Niveau, bei dem die Geldpolitik weder bremst noch stimuliert. Er lässt sich nicht beobachten, nur schätzen, und die Schätzungen streuen erheblich. Über Jahrzehnte ist er in den Industrieländern gefallen – Alterung und schwächeres Produktivitätswachstum gelten als Ursachen.',
            '**Die Output-Lücke.** Der Abstand zwischen tatsächlicher und möglicher Wirtschaftsleistung. Ebenfalls nicht messbar und im Nachhinein regelmäßig deutlich revidiert.',
            '**Die Phillips-Kurve.** Der unterstellte Zusammenhang zwischen Arbeitslosigkeit und Inflation. Er war über lange Strecken kaum nachweisbar und meldete sich 2021 überraschend zurück – ein Beleg dafür, dass die Beziehung nicht verschwunden, sondern nur nichtlinear ist.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was das bedeutet',
          items: [
            'Zwei der drei zentralen Bezugsgrößen sind nicht beobachtbar, sondern geschätzt – mit erheblicher Unsicherheit und laufenden Revisionen.',
            'Geldpolitik ist deshalb keine Steuerung nach Messwerten, sondern Navigation mit unsicherer Position. Notenbanken sagen das inzwischen selbst.',
            'Für Anleger folgt daraus vor allem eines: Wer meint, die richtige Zinshöhe besser zu kennen als der Rat, überschätzt die Genauigkeit der verfügbaren Größen – aller verfügbaren, auch der eigenen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wo die Werkzeuge an Grenzen stoßen',
        },
        {
          type: 'table',
          caption: 'Vier strukturelle Konflikte',
          head: ['Konflikt', 'Worin er besteht'],
          rows: [
            [
              'Nullzinsgrenze',
              'Unter null lässt sich der Zins kaum senken – Bargeld ist die Ausweichmöglichkeit. Deshalb wurden Anleihekäufe und Forward Guidance überhaupt entwickelt',
            ],
            [
              'Fiskalische Dominanz',
              'Bei hoher Staatsverschuldung wird jede Zinserhöhung zur Haushaltsbelastung. Der Verdacht, eine Notenbank könnte deshalb zögern, untergräbt ihre Glaubwürdigkeit – auch wenn sie es nicht tut',
            ],
            [
              'Preisstabilität gegen Finanzstabilität',
              'Zinserhöhungen bekämpfen Inflation und belasten zugleich Banken, deren Anleihebestände an Wert verlieren. 2023 wurde dieser Konflikt in den USA akut',
            ],
            [
              'Fragmentierung im Euroraum',
              'Ein Leitzins für zwanzig Staaten mit verschiedenen Schuldenständen. Laufen die Renditeabstände auseinander, kommt derselbe Zinsimpuls unterschiedlich an – dagegen gibt es eigene Instrumente',
            ],
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was Anleger daraus machen sollten',
        },
        {
          type: 'paragraph',
          text: 'Die praktische Schlussfolgerung ist unbequem und robust: **Notenbanksitzungen taugen als Erklärung, nicht als Handelssignal.** Der Grund ist derselbe wie bei allen Nachrichten – die erwartete Entwicklung steht im Kurs. Wer nach einer Zinserhöhung kauft oder verkauft, handelt auf eine Information, die alle anderen ebenfalls haben.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was sich beobachten lässt, ohne zu handeln',
          items: [
            '**Die Zinsstrukturkurve.** Sie zeigt, welchen Zinspfad der Markt einpreist – und zwar mit echtem Geld dahinter, nicht als Meinung.',
            '**Die Break-even-Inflationsrate.** Der Abstand zwischen nominalen und inflationsindexierten Anleihen ist die am Markt gehandelte Inflationserwartung.',
            '**Die Terminmärkte auf Tagesgeldsätze.** Sie zeigen tagesgenau, welche Wahrscheinlichkeit der Markt welchem Zinsschritt gibt.',
            'Diese drei Größen sind nützlich, um zu verstehen, was gerade eingepreist ist. Sie sind nicht nützlich, um es besser zu wissen.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Was dagegen sinnvoll aus der Geldpolitik folgt, betrifft die Struktur des Depots und nicht seinen Zeitpunkt: Wer weiß, dass lange Anleihen auf Zinsänderungen um ein Vielfaches stärker reagieren als kurze, wählt die Laufzeit bewusst. Wer weiß, dass Wachstumswerte an der Abzinsung hängen, versteht seine eigene Konzentration besser. Beides sind Entscheidungen über die Aufteilung, und die trifft man einmal – nicht nach jeder Sitzung.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Natürlicher Zins und Output-Lücke sind geschätzt, nicht gemessen – Geldpolitik navigiert mit unsicherer Position.',
            'Nullzinsgrenze, fiskalische Dominanz und Finanzstabilität begrenzen den Handlungsspielraum.',
            'Zinserwartungen stehen bereits in den Kursen; Sitzungen erklären, sie signalisieren nicht.',
            'Die sinnvolle Konsequenz betrifft Laufzeitwahl und Depotstruktur, nicht den Zeitpunkt.',
          ],
        },
      ],
    },
  },
}
