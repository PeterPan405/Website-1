import type { LearnTopic } from '@/data/learn/types'
import { formatPercent } from '@/lib/format'
import {
  portfolioJahre,
  portfolioRenditeAktien,
  portfolioRenditeSicher,
  portfolioStart,
} from '@/lib/lernszenarien'

/*
  Die Verschiebung der Aufteilung wird gerechnet, nicht geschätzt.

  Hier stand „nach fünf guten Börsenjahren vielleicht bei 82 zu 18“. Bei den
  Renditen, mit denen die Grafik daneben zeichnet, sind es nach fünf Jahren
  erst gut 76 Prozent – die 82 werden nach zehn Jahren erreicht. Solche
  Zahlen aus dem Gefühl heraus zu setzen ist genau die Art Fehler, die diese
  Seite anderen vorwirft.
*/
function aktienquoteNach(jahre: number): number {
  const aktien = portfolioStart.aktien * (1 + portfolioRenditeAktien / 100) ** jahre
  const sicher = portfolioStart.sicher * (1 + portfolioRenditeSicher / 100) ** jahre
  return (aktien / (aktien + sicher)) * 100
}

/*
  Die Rückgangstabelle wird gerechnet.

  Sie ist das Kernwerkzeug dieses Themas: Wer wissen will, welche Aktienquote
  zu ihm passt, muss sehen, was sie im Ernstfall bedeutet. Als getippte Tabelle
  wäre sie beim ersten Umschreiben inkonsistent – ein geänderter Marktrückgang
  und fünf vergessene Zeilen.
*/
const MARKTRUECKGANG = 40
const QUOTEN = [100, 80, 60, 40, 20]
const rueckgangJeQuote = QUOTEN.map((quote) => ({
  quote,
  rueckgang: (quote / 100) * MARKTRUECKGANG,
}))

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner zeigt, dass die Aufteilung mehr entscheidet als die
 * Auswahl, und leitet die eigene Aktienquote her. Fortgeschritten behandelt
 * Rebalancing und Depotstrukturen. Profi geht auf Lebensphasen, die
 * Steuerwirkung des Umschichtens und typische Konstruktionsfehler ein.
 *
 * ## Das Verhältnis zu „Risiko & Rendite“
 *
 * Dort geht es darum, Risiko zu **verstehen** und zu messen. Hier darum, es zu
 * **gestalten**. Die Begriffe werden deshalb vorausgesetzt, nicht wiederholt.
 */
export const portfolioAufbau: LearnTopic = {
  slug: 'portfolio-aufbau',
  title: 'Portfolio-Aufbau',
  headline: 'Die Aufteilung entscheidet – nicht die Auswahl',
  metaTitle: 'Portfolio aufbauen: Aufteilung, Aktienquote, Rebalancing',
  metaDescription:
    'Wie eine Depotaufteilung entsteht, welche Rolle der risikoarme Anteil spielt und warum die Aufteilung mehr entscheidet als die Produktauswahl.',
  lead: 'Die Frage „welcher ETF?“ ist die zweite. Die erste lautet: Wie viel davon?',
  overview: [
    'Ein Portfolio ist mehr als eine Sammlung guter Einzelanlagen. Entscheidend ist die Aufteilung zwischen risikoarmem und risikoreichem Teil – sie bestimmt den Großteil der Schwankung und einen erheblichen Teil der Rendite.',
    'Die praktische Konsequenz ist unbequem: Die Zeit, die viele in die Auswahl des besten ETF stecken, wäre in der Frage nach der richtigen Aktienquote deutlich besser angelegt.',
    'Die Stufen führen von einfachen Zwei-Topf-Modellen über Rebalancing-Regeln und Kern-Satellit-Strukturen bis zu Entnahmestrategien, Steuerwirkung des Umschichtens und der Frage, wie sich eine Aufteilung über Lebensphasen verändern sollte.',
  ],
  keywords: [
    'Portfolio',
    'Asset Allocation',
    'Aufteilung',
    'Rebalancing',
    'Aktienquote',
    'Kern-Satellit',
    'Depotstruktur',
  ],
  related: [
    'aktien-laender-branchen',
    'risiko-und-rendite',
    'etf',
    'cost-average-sparplan',
  ],
  calculators: ['/rechner/zinsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Portfolio aufbauen: die richtige Aufteilung finden',
      metaDescription:
        'Warum die Aufteilung wichtiger ist als die Auswahl, wie ein Zwei-Topf-Modell funktioniert und wie du deine Aktienquote bestimmst.',
      title: 'Die Aufteilung ist die Entscheidung',
      lead: 'Nach dieser Stufe weißt du, warum die Aktienquote mehr entscheidet als die Produktwahl – und wie du deine eigene bestimmst.',
      readingMinutes: 8,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'In Foren wird wochenlang über die Wahl zwischen zwei Welt-ETFs diskutiert, deren Unterschied bei einem Zehntelprozent im Jahr liegt. Über die Frage, ob man 40 oder 80 Prozent seines Vermögens in Aktien hält, wird selten so lange gesprochen – dabei ist das die Entscheidung, die alles andere überdeckt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was die Aufteilung praktisch bedeutet',
        },
        {
          type: 'paragraph',
          text: `Nimm an, der Aktienmarkt fällt um ${formatPercent(MARKTRUECKGANG, 0)} – ein Rückgang, wie er historisch mehrfach vorgekommen ist. Der risikoarme Teil bleibt dabei ungefähr, wo er ist. Was mit dem Gesamtvermögen geschieht, hängt allein an der Quote:`,
        },
        {
          type: 'table',
          caption: `Wertverlust des Gesamtdepots bei ${formatPercent(MARKTRUECKGANG, 0)} Marktrückgang`,
          head: ['Aktienquote', 'Rückgang des Depots', 'Aus 100.000 Euro werden'],
          rows: rueckgangJeQuote.map((zeile) => [
            formatPercent(zeile.quote, 0),
            `− ${formatPercent(zeile.rueckgang, 0)}`,
            `${(100_000 * (1 - zeile.rueckgang / 100)).toLocaleString('de-DE')} €`,
          ]),
        },
        {
          type: 'paragraph',
          text: 'Diese Tabelle ist das eigentliche Werkzeug dieses Themas. Sie beantwortet nicht, welche Quote richtig ist – sie zeigt, worüber man entscheidet.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Das Zwei-Topf-Modell',
        },
        {
          type: 'paragraph',
          text: 'Für die meisten Menschen genügt eine Struktur mit zwei Töpfen. Sie ist nicht ein vereinfachtes Modell für Anfänger, sondern für die allermeisten die sachlich richtige Lösung.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Topf eins – der sichere Teil.** Notgroschen und alles, was in den nächsten drei bis fünf Jahren gebraucht wird. Tagesgeld, notfalls Festgeld. Dieser Topf ist nicht zum Verdienen da, sondern damit Topf zwei in Ruhe gelassen werden kann.',
            '**Topf zwei – der wachsende Teil.** Langfristiges Geld, breit gestreut am Aktienmarkt. Ein einziger weltweit anlegender Fonds reicht dafür vollkommen aus.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum der sichere Teil keine Renditebremse ist',
          items: [
            'Er ist der Grund, warum man den riskanten Teil durchhält. Wer im Rückgang nicht verkaufen muss, weil Topf eins die Rechnungen deckt, bleibt investiert – und das ist der ganze Renditevorteil des Aktienmarkts.',
            'Ein Depot mit 100 Prozent Aktien, das nach zwei Jahren im Rückgang aufgelöst wird, schlägt jedes gemischte Depot – nach unten.',
            'Die beste Quote ist nicht die mit der höchsten erwarteten Rendite, sondern die höchste, die man durchhält.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die eigene Quote bestimmen',
        },
        {
          type: 'paragraph',
          text: 'Drei Fragen, in dieser Reihenfolge. Die jeweils niedrigste Antwort gewinnt.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Wann wird das Geld gebraucht?** Alles, was in unter fünf Jahren fällig ist, gehört nicht in Aktien – unabhängig von allem anderen.',
            '**Was wäre finanziell verkraftbar?** Wenn das Depot ein Jahr lang 40 Prozent im Minus stünde: Würde sich an deinem Leben etwas ändern? Müsstest du Pläne verschieben?',
            '**Was wäre emotional durchhaltbar?** Dieselbe Zahl in Euro ausgedrückt. „Minus 40 Prozent“ und „minus 48.000 Euro“ sind dieselbe Aussage und lösen verschiedene Reaktionen aus.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zu den bekannten Faustregeln',
          items: [
            '„100 minus Lebensalter gleich Aktienquote“ ist ein Startpunkt, keine Antwort. Sie kennt weder deinen Anlagehorizont noch deine Rücklagen noch dein Einkommen.',
            'Ein 60-Jähriger mit sicherer Rente und Mietfreiheit kann eine höhere Quote tragen als ein 35-Jähriger mit schwankendem Einkommen und ohne Rücklagen.',
            'Nimm die Regel als groben Anhaltspunkt und korrigiere sie mit den drei Fragen darüber.',
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
            'Die Aktienquote entscheidet über die Schwankung, die Produktwahl kaum.',
            'Zwei Töpfe genügen für die meisten Fälle – erst Topf eins füllen, dann Topf zwei.',
            'Der sichere Teil ist die Voraussetzung dafür, den riskanten durchzuhalten.',
            'Die beste Quote ist die höchste, die du auch im Rückgang aushältst.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Rebalancing und Depotstrukturen für Fortgeschrittene',
      metaDescription:
        'Wann und wie Rebalancing sinnvoll ist, wie Kern-Satellit-Strukturen aufgebaut werden und welche Fehler beim Kombinieren von ETFs entstehen.',
      title: 'Rebalancing und Struktur',
      lead: 'Warum ein Depot ohne Eingriff riskanter wird, wie man das zurückdreht und welche Fehler beim Kombinieren mehrerer Bausteine entstehen.',
      readingMinutes: 10,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Warum ein Depot von allein riskanter wird',
        },
        {
          type: 'paragraph',
          text: `Angenommen, du startest mit ${formatPercent(portfolioStart.aktien, 0)} Aktien und ${formatPercent(portfolioStart.sicher, 0)} Tagesgeld. Läuft der Aktienteil mit ${formatPercent(portfolioRenditeAktien, 0)} im Jahr und der sichere mit ${formatPercent(portfolioRenditeSicher, 0)}, liegt die Aufteilung nach fünf Jahren bei ${formatPercent(aktienquoteNach(5), 0)} zu ${formatPercent(100 - aktienquoteNach(5), 0)} und nach zehn bei ${formatPercent(aktienquoteNach(portfolioJahre), 0)} zu ${formatPercent(100 - aktienquoteNach(portfolioJahre), 0)}. Ohne dass du etwas entschieden hättest, trägst du mehr Risiko als geplant. Und zwar am Ende einer guten Phase, also genau dann, wenn ein Rückschlag am wahrscheinlichsten ist.`,
        },
        {
          type: 'paragraph',
          text: '**Rebalancing** stellt die geplante Aufteilung wieder her. Es ist kein Renditewerkzeug – über lange Zeiträume kostet es sogar leicht Rendite, weil regelmäßig vom besser laufenden Teil in den schwächeren umgeschichtet wird. Sein Zweck ist Risikosteuerung, und den erfüllt es zuverlässig.',
        },
        {
          type: 'table',
          caption: 'Zwei Regeln – beide funktionieren',
          head: ['Regel', 'Wie sie lautet', 'Vorteil'],
          rows: [
            [
              'Kalender',
              'Einmal jährlich zu einem festen Termin prüfen und zurücksetzen',
              'Einfach, planbar, vergisst man nicht',
            ],
            [
              'Bandbreite',
              'Zurücksetzen, sobald eine Position mehr als fünf Prozentpunkte abweicht',
              'Reagiert auf tatsächliche Verschiebungen statt auf den Kalender',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Der steuerlich beste Weg',
          items: [
            'In der Ansparphase: **die neuen Raten umlenken.** Ist der Aktienteil zu hoch, geht die nächste Einzahlung in den sicheren Teil. Kein Verkauf, keine Steuer.',
            'Das funktioniert, solange die Einzahlungen im Verhältnis zum Bestand groß genug sind – bei 400.000 Euro Depot und 300 Euro Rate bewegt sich damit nichts mehr.',
            'Erst danach über Verkäufe, und dann bevorzugt in Konten ohne laufende Besteuerung, falls vorhanden.',
          ],
        },
        {
          type: 'figure',
          figure: 'portfolio-drift',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie viele Bausteine sind sinnvoll?',
        },
        {
          type: 'table',
          caption: 'Drei Strukturen im Vergleich',
          head: ['Struktur', 'Aufbau', 'Passt zu'],
          rows: [
            [
              'Ein Baustein',
              'Ein weltweit anlegender Fonds plus Tagesgeld',
              'Fast allen. Kein Rebalancing innerhalb des Aktienteils nötig',
            ],
            [
              'Zwei bis drei Bausteine',
              'Industrieländer plus Schwellenländer, evtl. Nebenwerte',
              'Wer die Gewichtung bewusst anders setzen will als der Weltindex',
            ],
            [
              'Kern-Satellit',
              'Breiter Kern von 80 bis 90 Prozent, dazu kleine bewusste Wetten',
              'Wer Einzelthemen abbilden will, ohne das Gesamtergebnis daran zu hängen',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Mehr Bausteine bedeuten nicht mehr Streuung. Ein weltweiter Fonds enthält bereits über tausend Unternehmen aus dreiundzwanzig Ländern; ein zweiter Fonds auf denselben Markt fügt nichts hinzu außer Verwaltungsaufwand. Sinnvoll ist ein zusätzlicher Baustein nur, wenn er etwas enthält, das im ersten fehlt – und wenn man begründen kann, warum man diese Abweichung will.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die drei häufigsten Konstruktionsfehler',
          items: [
            '**Doppelung.** Ein Welt-ETF und ein US-ETF nebeneinander: Die USA machen im Weltindex bereits den größten Teil aus – die Wette wird ungewollt verdoppelt.',
            '**Themenfonds als Kern.** Ein Fonds auf ein einzelnes Thema ist eine Wette, kein Fundament. Als Satellit vertretbar, als Kern eine Konzentration auf eine Branche.',
            '**Zu viele Positionen.** Ab etwa fünf Bausteinen wird Rebalancing zur Arbeit, ohne dass sich das Ergebnis erkennbar verbessert.',
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
            'Ohne Eingriff steigt die Aktienquote in guten Phasen – genau dann, wenn ein Rückschlag naheliegt.',
            'Rebalancing steuert Risiko, es erhöht nicht die Rendite.',
            'In der Ansparphase über neue Raten zurücksetzen, nicht über Verkäufe.',
            'Mehr Bausteine sind nicht mehr Streuung; ein zusätzlicher braucht eine Begründung.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Portfolio für Profis: Lebensphasen, Steuern, Entnahme',
      metaDescription:
        'Wie sich eine Aufteilung über Lebensphasen verändert, welche Steuerwirkung Umschichtungen haben und wie eine Entnahmestrategie aufgebaut wird.',
      title: 'Portfolio über die Lebensphasen',
      lead: 'Wie sich die Aufteilung mit der Zeit ändern sollte, was Umschichten wirklich kostet und wie die Entnahmephase vorbereitet wird.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Das Vermögen ist mehr als das Depot',
        },
        {
          type: 'paragraph',
          text: 'Die übliche Betrachtung schaut auf das Depot und teilt es auf. Vollständiger ist eine Sicht, die auch die Posten außerhalb einbezieht – denn sie verhalten sich wie Anlagen und verschieben die tatsächliche Aufteilung erheblich.',
        },
        {
          type: 'list',
          items: [
            '**Das eigene Erwerbseinkommen** verhält sich für die meisten Menschen wie eine Anleihe: planbar, wenig schwankend, über Jahrzehnte laufend. Wer jung ist und einen sicheren Beruf hat, besitzt damit bereits einen großen anleiheähnlichen Posten – und kann im Depot entsprechend mehr Risiko tragen.',
            '**Ansprüche aus der gesetzlichen Rente** wirken ähnlich: eine lebenslange, inflationsgebundene Zahlung. Wer sie hat, braucht im Depot weniger Sicherheitspuffer als jemand ohne.',
            '**Eine selbstgenutzte Immobilie** ist eine große, unteilbare, illiquide Position – oft der größte Vermögensposten überhaupt und in keiner Depotaufteilung sichtbar.',
            '**Ein Unternehmen oder eine Selbstständigkeit** ist das Gegenteil: hochgradig schwankend und mit dem eigenen Einkommen gekoppelt. Wer davon lebt, sollte im Depot vorsichtiger sein, nicht mutiger.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Daraus folgt eine Faustregel, die den gängigen Altersregeln widerspricht: Nicht das Alter bestimmt die Quote, sondern das Verhältnis von sicherem zu unsicherem Gesamtvermögen. Ein Beamter mit fünfzig kann mehr Aktienrisiko tragen als ein Selbstständiger mit dreißig.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was Umschichten wirklich kostet',
        },
        {
          type: 'paragraph',
          text: 'Jede Umschichtung im Privatvermögen löst Abgeltungsteuer auf den aufgelaufenen Gewinn aus. Der versteuerte Betrag arbeitet nicht mehr mit – über die Restlaufzeit ist das der eigentliche Preis, nicht die Steuer selbst.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Drei Punkte, die dabei zusammenkommen',
          items: [
            '**FIFO.** Beim Teilverkauf gelten die ältesten Anteile als verkauft – bei gestiegenen Kursen die mit dem höchsten Gewinn und damit der höchsten Steuer. Wählen lässt sich das nicht.',
            '**Der Zinseszins auf die Steuer.** Wer heute 5.000 Euro Steuer zahlt statt in zwanzig Jahren, verliert nicht 5.000 Euro, sondern das, was daraus geworden wäre.',
            '**Die Gegenrechnung.** Deshalb ist eine Umschichtung nur dann richtig, wenn der Grund über die Steuerwirkung hinausgeht – eine veränderte Lebenslage etwa, nicht eine Marktmeinung.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Praktisch heißt das: Die Aufteilung eher über neue Einzahlungen steuern als über Verkäufe, und eine einmal gewählte Struktur nicht wegen kurzfristiger Einschätzungen ändern. Wer alle zwei Jahre umbaut, zahlt für seine Meinungen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Entnahmephase',
        },
        {
          type: 'paragraph',
          text: 'Der Übergang beginnt Jahre vor der ersten Entnahme, weil in den ersten Entnahmejahren das Sequenzrisiko am größten ist: Fällt der Markt kurz nach dem Start, werden Anteile zu niedrigen Kursen verkauft, und diese Anteile fehlen dauerhaft.',
        },
        {
          type: 'table',
          caption: 'Drei Entnahmestrategien',
          head: ['Strategie', 'Wie sie funktioniert', 'Schwäche'],
          rows: [
            [
              'Fester Betrag, inflationsangepasst',
              'Jedes Jahr derselbe reale Betrag',
              'Ignoriert die Marktlage – in Rückgangsjahren wird am meisten verkauft',
            ],
            [
              'Fester Prozentsatz vom Bestand',
              'Etwa vier Prozent des jeweils aktuellen Werts',
              'Das verfügbare Einkommen schwankt mit dem Markt',
            ],
            [
              'Puffer plus flexible Entnahme',
              'Zwei bis drei Jahresbedarfe schwankungsarm; in guten Jahren daraus auffüllen',
              'Verlangt Disziplin und einen Teil, der real kaum wächst',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die dritte Strategie ist die aufwendigste und die robusteste. Sie beantwortet die Frage, an der die ersten beiden scheitern: Woher kommt das Geld in einem Jahr, in dem man nicht verkaufen möchte?',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Zur oft zitierten Vier-Prozent-Regel',
          items: [
            'Sie stammt aus einer Untersuchung des US-Marktes über historische Zeiträume und besagt, dass eine anfängliche Entnahme von vier Prozent über dreißig Jahre meist trug.',
            'Sie ist keine Naturkonstante: Andere Märkte, andere Zeiträume und ein längerer Ruhestand führen zu anderen Ergebnissen.',
            'Als Größenordnung brauchbar, als Zusage nicht. Wer sie benutzt, sollte die Entnahme in schlechten Jahren nach unten anpassen können.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Keine Steuerberatung',
          items: [
            'Umschichtungen und Entnahmen lösen in Deutschland regelmäßig Abgeltungsteuer aus; die Reihenfolge der Schritte hat erhebliche Wirkung.',
            'Bei größeren Vermögen gehört die Planung zu jemandem mit Zulassung.',
          ],
        },
        {
          type: 'figure',
          figure: 'portfolio-entnahme',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Einkommen, Rentenansprüche und Immobilie gehören in die Betrachtung – sie verschieben die tatsächliche Aufteilung.',
            'Nicht das Alter bestimmt die Quote, sondern das Verhältnis von sicherem zu unsicherem Gesamtvermögen.',
            'Der Preis einer Umschichtung ist nicht die Steuer, sondern der entgangene Zinseszins darauf.',
            'Puffer plus flexible Entnahme ist aufwendiger und hält im Ernstfall am besten.',
          ],
        },
      ],
    },
  },
}
