import type { LearnTopic } from '@/data/learn/types'
import { compoundBalance } from '@/lib/finance'
import { formatCurrencyRounded, formatPercent } from '@/lib/format'

/*
  Der Kostenvergleich wird gerechnet.

  „Ein Prozentpunkt über dreißig Jahre“ ist die meistzitierte und die am
  häufigsten falsch abgeschriebene Zahl der Finanzbildung. Aus denselben
  Funktionen wie der Zinsrechner der Website kann sie nicht danebenliegen.
*/
const KOSTENFALL = { einmalig: 10_000, jahre: 30, brutto: 6 }
const kostenreihe = [0.2, 1.0, 1.8].map((kosten) => ({
  kosten,
  endkapital: compoundBalance(
    KOSTENFALL.einmalig,
    KOSTENFALL.brutto - kosten,
    KOSTENFALL.jahre
  ),
}))
const kostenspanne = kostenreihe[0].endkapital - kostenreihe[2].endkapital

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner legt die Reihenfolge vor dem ersten Kauf fest.
 * Fortgeschritten beziffert die häufigsten Fehler und zeigt die Zehn-Minuten-
 * Prüfung eines Produkts. Profi behandelt Verhaltensmuster, Depotstruktur und
 * das Erkennen unseriöser Angebote.
 *
 * ## Warum dieses Thema keine Produkte nennt
 *
 * Weil eine konkrete Empfehlung Anlageberatung wäre und weil sie in zwei Jahren
 * überholt ist. Was hier steht, sind Prüfschritte – die halten länger als jede
 * Produktliste.
 */
export const woraufAchtenEinsteiger: LearnTopic = {
  slug: 'worauf-achten-einsteiger',
  title: 'Worauf Einsteiger achten',
  headline: 'Die richtige Reihenfolge – und die Fehler, die alle machen',
  metaTitle: 'Geldanlage für Einsteiger: Reihenfolge und Fehler',
  metaDescription:
    'Die richtige Reihenfolge beim Start, die häufigsten Fehler und ihre Kosten sowie unseriöse Angebote zuverlässig erkennen – praxisnah zusammengefasst.',
  lead: 'Die Reihenfolge der Schritte entscheidet mehr über das Ergebnis als die Wahl des Produkts.',
  overview: [
    'Vor dem ersten Wertpapierkauf steht eine Reihenfolge: teure Schulden abbauen, Notgroschen aufbauen, existenzielle Risiken versichern, Ziele und Zeithorizont klären. Erst dann folgt die Anlage.',
    'Die typischen Fehler sind gut dokumentiert und wiederholen sich: zu wenig Streuung, zu hohe Kosten, zu häufiges Handeln, Verkaufen im Tief und der Glaube an Prognosen.',
    'Die Stufen gehen von der Startreihenfolge über Fehlerkosten und Produktprüfung bis zu Verhaltensmustern, Depotstruktur und dem Erkennen unseriöser Angebote.',
  ],
  keywords: [
    'Einsteiger',
    'Notgroschen',
    'Anlagefehler',
    'Reihenfolge',
    'Anlagestrategie',
  ],
  related: ['budget-und-sparquote', 'etf', 'anlegerpsychologie', 'kosten-und-gebuehren'],
  calculators: ['/rechner/haushaltsrechner', '/rechner/zinsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Geldanlage für Einsteiger: die richtige Reihenfolge',
      metaDescription:
        'Welche Schritte vor dem ersten Wertpapierkauf kommen, wie groß der Notgroschen sein sollte und wie du Ziele und Zeithorizont festlegst.',
      title: 'Die richtige Reihenfolge',
      lead: 'Nach dieser Stufe kennst du die vier Schritte vor dem ersten Kauf – und weißt, warum sie mehr entscheiden als die Wahl des Produkts.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Die meiste Zeit beim Einstieg geht für die Frage drauf, *was* man kaufen soll. Diese Frage ist die unwichtigste. Wer die vier Schritte davor auslässt, kann das beste Produkt der Welt kaufen und wird trotzdem zum falschen Zeitpunkt verkaufen müssen.',
        },
        {
          type: 'figure',
          figure: 'einsteiger-reihenfolge',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Schritt 1: Teure Schulden zuerst',
        },
        {
          type: 'paragraph',
          text: 'Ein Dispokredit kostet zweistellig, ein Ratenkredit hoch einstellig. Beides ist mehr, als eine Aktienanlage im langjährigen Mittel erwarten lässt – und es ist **sicher**, während die Rendite eine Hoffnung ist. Schulden abzubauen ist deshalb keine Alternative zur Geldanlage, sondern die Anlage mit der höchsten garantierten Verzinsung, die es gibt.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die eine Ausnahme',
          items: [
            'Eine laufende Immobilienfinanzierung mit niedrigem Zins muss nicht vorrangig getilgt werden – dort kann das Investieren daneben sinnvoll sein.',
            'Die Grenze verläuft grob beim erwarteten Anlageertrag: Kostet ein Kredit mehr, tilgen. Kostet er deutlich weniger, ist beides vertretbar.',
            'Bei allem, was „Dispo“, „Rahmenkredit“ oder „Null-Prozent-Finanzierung mit Restschuldversicherung“ heißt, ist die Antwort immer: zuerst weg damit.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Schritt 2: Der Notgroschen',
        },
        {
          type: 'paragraph',
          text: 'Drei bis sechs Monatsausgaben, auf einem Tagesgeldkonto, sofort verfügbar. Nicht als Renditeposten – der bringt real nichts –, sondern als Versicherung gegen den einen Fehler, der wirklich teuer wird: verkaufen zu müssen, wenn die Kurse unten stehen.',
        },
        {
          type: 'paragraph',
          text: 'Maßstab sind die **Ausgaben**, nicht das Einkommen. Wer selbstständig ist, ein schwankendes Einkommen hat oder allein für Kinder sorgt, rechnet eher am oberen Rand.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Schritt 3: Existenzielle Risiken versichern',
        },
        {
          type: 'paragraph',
          text: 'Versichert wird, was einen ruinieren würde, nicht was ärgerlich wäre. Ein kaputtes Handy zahlt man aus dem Notgroschen; eine Berufsunfähigkeit, die das Einkommen für zwanzig Jahre beendet, nicht.',
        },
        {
          type: 'table',
          caption: 'Die Einordnung nach Schadenshöhe, nicht nach Wahrscheinlichkeit',
          head: ['Risiko', 'Einordnung'],
          rows: [
            [
              'Schaden bei anderen (Privathaftpflicht)',
              'Existenziell – unbegrenzte Summen möglich, Beitrag zweistellig im Jahr',
            ],
            [
              'Verlust der Arbeitskraft',
              'Existenziell für alle, die vom eigenen Einkommen leben',
            ],
            [
              'Tod bei Unterhaltspflicht',
              'Existenziell, solange andere von dem Einkommen abhängen',
            ],
            [
              'Handy, Brille, Reiserücktritt',
              'Kein Fall für eine Versicherung – dafür ist der Notgroschen da',
            ],
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Schritt 4: Ziele mit Zeitangabe',
        },
        {
          type: 'paragraph',
          text: 'Jedes Ziel braucht zwei Angaben: einen Betrag und ein Datum. Erst daraus folgt die Anlageform – nicht umgekehrt.',
        },
        {
          type: 'list',
          items: [
            '**Auto in 3 Jahren, 15.000 Euro** → Tagesgeld oder Festgeld. Der Aktienmarkt kann in drei Jahren deutlich im Minus stehen.',
            '**Eigenkapital fürs Haus in 8 Jahren** → gemischt, mit einem Teil, der schwanken darf.',
            '**Altersvorsorge in 30 Jahren** → hier ist Zeit genug, Rückschläge auszusitzen.',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Und dann: einfach anfangen',
          items: [
            'Ein breit gestreuter Basisbaustein reicht für den Start vollkommen. Ein zweiter macht das Ergebnis nicht besser, nur die Verwaltung aufwendiger.',
            'Sparplan einrichten, Rate wählen, die auch in einem schlechten Monat trägt – und dann in Ruhe lassen.',
            'Was in den ersten zwei Jahren nicht gebraucht wird: Einzelaktien, Hebelprodukte, Kryptowährungen. Nicht weil sie verboten wären, sondern weil man ihre Risiken erst einschätzen kann, wenn man einen Rückgang selbst erlebt hat.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die erste Stunde ganz praktisch',
        },
        {
          type: 'paragraph',
          text: 'Wenn die vier Schritte stehen, ist der Rest weniger Arbeit, als er aussieht. Was tatsächlich zu tun ist, in der Reihenfolge, in der man es tut:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Depot eröffnen.** Online, mit Ausweis und einem kurzen Videoanruf zur Legitimation. Ein Depot ist kostenlos zu führen; wer eine Depotgebühr zahlen soll, ist beim falschen Anbieter.',
            '**Verrechnungskonto verstehen.** Zum Depot gehört ein Geldkonto. Dorthin überweist du, von dort wird gekauft, und dort landen später die Ausschüttungen. Das Depot selbst enthält nur Papiere, kein Geld.',
            '**Freistellungsauftrag erteilen.** Zwei Minuten in der App. Ohne ihn zieht der Broker ab dem ersten Euro Ertrag Steuer ab.',
            '**Sparplan anlegen.** Wertpapier suchen, Rate eintragen, Termin wählen, fertig. Die Rate lässt sich jederzeit ändern – nichts daran ist eine Entscheidung für zehn Jahre.',
            '**App vom Startbildschirm nehmen.** Der häufigste Anfängerfehler ist nicht die falsche Auswahl, sondern zu häufiges Nachsehen. Wer täglich schaut, sieht Schwankungen; wer jährlich schaut, sieht Entwicklung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Woran du ein unseriöses Angebot erkennst',
        },
        {
          type: 'paragraph',
          text: 'Einsteiger sind die bevorzugte Zielgruppe für Betrug, und die Muster sind seit Jahrzehnten dieselben. Es braucht kein Fachwissen, um sie zu erkennen – nur die Bereitschaft, bei diesen Sätzen misstrauisch zu werden:',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Fünf Sätze, nach denen das Gespräch endet',
          items: [
            '**„Garantierte Rendite von X Prozent."** Garantie und Rendite schließen sich oberhalb des Zinsniveaus aus. Wer beides zusagt, sagt eines davon nicht ehrlich.',
            '**„Nur heute" oder „nur noch drei Plätze frei."** Zeitdruck hat genau einen Zweck: Er soll das Nachdenken verhindern. Eine seriöse Anlage ist morgen auch noch da.',
            '**„Das versteht man nicht sofort, vertrau mir einfach."** Was sich nicht in drei Sätzen erklären lässt, gehört nicht ins erste Depot – und wer die Erklärung verweigert, hat einen Grund dafür.',
            '**„Empfehlung von einem Bekannten aus der Gruppe."** Die häufigste Form heute: Kontakt über Messenger oder soziale Netzwerke, freundlicher Ton über Wochen, dann eine „Gelegenheit". Die anfänglichen Auszahlungen sind Teil der Masche.',
            '**„Erst noch eine Gebühr überweisen, dann kommt die Auszahlung."** Der sichere Schlusspunkt. Ab hier ist das Geld weg; jeder weitere Euro ist ebenfalls weg.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Die eine Prüfung, die fast alles abdeckt: Ist der Anbieter bei der **BaFin** registriert? Das lässt sich in der Unternehmensdatenbank der Aufsicht in einer Minute nachsehen, und sie führt zusätzlich eine Warnliste unerlaubter Angebote. Ein Anbieter ohne Eintrag ist kein Grenzfall, sondern ein Ausschlusskriterium.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Teure Schulden schlagen jede erwartbare Rendite – und zwar sicher.',
            'Der Notgroschen ist die Versicherung gegen den Verkauf im falschen Moment.',
            'Versichert wird, was ruiniert, nicht was ärgert.',
            'Jedes Ziel braucht einen Betrag und ein Datum; daraus folgt die Anlageform.',
            'Ein Basisbaustein reicht. Der zweite bringt Verwaltungsaufwand, keine Verbesserung.',
            'Zeitdruck, Garantieversprechen und „vertrau mir einfach" sind keine Details, sondern das Erkennungszeichen.',
            'Kein BaFin-Eintrag, kein Geschäft – die Prüfung dauert eine Minute.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Anlagefehler mit Preisschild und die Zehn-Minuten-Prüfung',
      metaDescription:
        'Die häufigsten Fehler mit Zahlen unterlegt, wie du ein Produkt in zehn Minuten prüfst und wie eine schriftliche Anlagestrategie Fehlentscheidungen verhindert.',
      title: 'Fehler, Prüfung, Strategie',
      lead: 'Was die typischen Fehler tatsächlich kosten, wie sich ein Produkt in zehn Minuten einschätzen lässt und warum ein Blatt Papier mehr bringt als jede Prognose.',
      readingMinutes: 16,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Was ein Prozentpunkt Kosten wirklich kostet',
        },
        {
          type: 'paragraph',
          text: `${formatCurrencyRounded(KOSTENFALL.einmalig)} einmalig angelegt, ${formatPercent(KOSTENFALL.brutto, 0)} Bruttorendite, ${KOSTENFALL.jahre} Jahre – nur die laufenden Kosten unterscheiden sich:`,
        },
        {
          type: 'table',
          caption: `Endkapital nach ${KOSTENFALL.jahre} Jahren bei verschiedenen Kostenquoten`,
          head: ['Laufende Kosten', 'Nettorendite', 'Endkapital'],
          rows: kostenreihe.map((fall) => [
            formatPercent(fall.kosten, 1),
            formatPercent(KOSTENFALL.brutto - fall.kosten, 1),
            formatCurrencyRounded(fall.endkapital),
          ]),
        },
        {
          type: 'paragraph',
          text: `Zwischen dem günstigsten und dem teuersten Fall liegen ${formatCurrencyRounded(kostenspanne)} – bei identischer Anlage und identischem Marktverlauf. Der Unterschied ist keine Frage des Glücks, sondern stand am ersten Tag fest.`,
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die anderen drei Fehler',
        },
        {
          type: 'table',
          caption: 'Wiederkehrend, gut dokumentiert, vermeidbar',
          head: ['Fehler', 'Was er kostet', 'Gegenmittel'],
          rows: [
            [
              'Zu häufiges Handeln',
              'Jede Runde kostet Gebühr und Spread – sichere Verluste gegen unsichere Gewinne',
              'Sparplan statt Einzelentscheidungen',
            ],
            [
              'Verkaufen im Tief',
              'Verwandelt einen Buchverlust in einen echten und verpasst die Erholung',
              'Vorher schriftlich festlegen, was bei minus 30 Prozent passiert',
            ],
            [
              'Klumpenrisiko',
              'Ein Ausfall bestimmt das ganze Ergebnis',
              'Besonders auf Arbeitgeberaktien achten – dort hängen Einkommen und Vermögen am selben Unternehmen',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Arbeitgeberaktien sind der unterschätzteste Fall',
          items: [
            'Geht es dem Unternehmen schlecht, fallen Kurs und Arbeitsplatz zugleich – genau dann braucht man beides.',
            'Belegschaftsaktien mit Rabatt sind trotzdem oft attraktiv. Die Regel lautet nicht „nicht nehmen“, sondern „nach der Haltefrist verkaufen und breit anlegen“.',
            'Eine brauchbare Obergrenze: nicht mehr als fünf bis zehn Prozent des Vermögens im eigenen Arbeitgeber.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ein Produkt in zehn Minuten prüfen',
        },
        {
          type: 'paragraph',
          text: 'Für jedes verpackte Anlageprodukt in der EU gibt es ein **Basisinformationsblatt** – drei Seiten, gesetzlich vorgeschrieben, überall gleich aufgebaut. Fünf Fragen daran genügen für eine erste Einschätzung.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Was ist der Basiswert?** Worauf bezieht sich das Produkt tatsächlich? „Zertifikat auf einen Nachhaltigkeitsindex“ – welcher Index, wer stellt ihn zusammen, nach welchen Regeln?',
            '**Wer ist der Emittent, und was passiert bei seiner Insolvenz?** Bei einem Fonds: Sondervermögen, geschützt. Bei einem Zertifikat: Schuldverschreibung, im Insolvenzfall verloren. Das ist der größte Unterschied überhaupt; er steht im Basisinformationsblatt und wird in Produktunterlagen leicht übersehen.',
            '**Was kostet es im Jahr, alles zusammen?** Das Blatt weist Gesamtkosten für verschiedene Haltedauern aus. Diese Zahl nehmen, nicht einzelne Gebührenposten.',
            '**Wie komme ich wieder raus?** Empfohlene Haltedauer, Mindestlaufzeit, Kosten bei vorzeitigem Ausstieg.',
            '**Was steht in den Szenarien?** Vier Verläufe – pessimistisch bis optimistisch. Interessant ist der pessimistische; den überliest man sonst.',
          ],
        },
        {
          type: 'figure',
          figure: 'einsteiger-pruefung',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Strategie auf einem Blatt Papier',
        },
        {
          type: 'paragraph',
          text: 'Der wirksamste Schutz vor Fehlentscheidungen ist, sie vorher auszuschließen – in einem Moment, in dem man ruhig ist. Vier Sätze genügen:',
        },
        {
          type: 'list',
          items: [
            '**Wie ist aufgeteilt?** „70 Prozent Aktien, 30 Prozent Tagesgeld.“',
            '**Wie viel kommt monatlich dazu?** „300 Euro, jährlich um die Inflationsrate erhöht.“',
            '**Wann wird zurückgesetzt?** „Einmal im Jahr im Januar, über die neuen Raten.“',
            '**Was passiert bei minus 30 Prozent?** „Nichts. Sparplan läuft weiter.“ Dieser Satz ist der wichtigste, und er muss geschrieben sein, bevor die 30 Prozent da sind.',
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Warum aufschreiben so viel bringt',
          items: [
            'Im Rückgang argumentiert man mit sich selbst – gegen ein Blatt Papier vom letzten Jahr argumentiert man schlechter als gegen ein vages Vorhaben.',
            'Ein kurzes Protokoll jeder Entscheidung samt Begründung deckt nach zwei Jahren Muster auf, die man sonst nie bemerkt.',
            'Und es entlarvt den Rückschaufehler: Was man wirklich gedacht hat, steht dann da – nicht das, woran man sich erinnert.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Reihenfolge, in der die Dinge zu tun sind',
        },
        {
          type: 'paragraph',
          text: 'Die meisten Fehler am Anfang sind keine falschen Entscheidungen, sondern Entscheidungen in der falschen Reihenfolge. Wer mit der Produktauswahl beginnt, beantwortet die letzte Frage zuerst – und muss danach alles Vorherige an sie anpassen.',
        },
        {
          type: 'list',
          items: [
            '**1. Teure Schulden weg.** Ein Dispo oder ein Ratenkredit kostet mehr, als eine Anlage im Mittel bringt. Tilgen ist eine sichere Rendite in Höhe des Zinssatzes – die einzige garantierte, die es gibt.',
            '**2. Notgroschen aufbauen.** Ohne ihn ist jede Anlage nur geliehen: Der nächste größere Defekt holt sie zurück, und zwar zu einem Kurs, den man sich nicht aussucht.',
            '**3. Existenzielle Risiken versichern.** Berufsunfähigkeit und Haftpflicht schützen vor Schäden, die kein Depot auffangen kann. Das ist keine Geldanlage, aber es kommt davor.',
            '**4. Ziel und Zeitraum festlegen.** Wofür, wie lange, wie viel monatlich. Ohne diese drei Zahlen gibt es kein richtiges Produkt, weil es kein Kriterium gibt.',
            '**5. Erst jetzt: Produkt und Depot.** Es ist der einfachste Schritt und der, der am meisten besprochen wird – weil er sich am leichtesten zu einer Empfehlung verdichten lässt.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Ausnahme von der Reihenfolge',
          items: [
            'Wer wartet, bis alles davor perfekt ist, fängt nie an. Ein kleiner Sparplan parallel zum Notgroschen ist besser als drei Jahre Vorbereitung – nicht wegen der Rendite, sondern weil die Gewohnheit die eigentliche Leistung ist.',
            'Die Reihenfolge betrifft die **Beträge**, nicht den Beginn: Solange der Notgroschen nicht steht, gehört der größere Teil des Monatsüberschusses dorthin.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ausschüttend oder thesaurierend – die Frage hinter der Frage',
        },
        {
          type: 'paragraph',
          text: 'Es ist die meistgestellte Anfängerfrage, und sie ist kleiner, als sie wirkt: Beide Varianten halten dieselben Unternehmen und haben dieselbe Bruttorendite. Der Unterschied liegt in der Steuerabwicklung und in der eigenen Disziplin.',
        },
        {
          type: 'table',
          caption: 'Was tatsächlich verschieden ist',
          head: ['', 'Ausschüttend', 'Thesaurierend'],
          rows: [
            [
              'Was mit den Erträgen passiert',
              'sie kommen aufs Verrechnungskonto',
              'sie bleiben im Fonds und werden automatisch wieder angelegt',
            ],
            [
              'Sparerpauschbetrag',
              'wird durch die Ausschüttung genutzt, ohne dass man etwas tun muss',
              'wird über die Vorabpauschale genutzt – meist in kleinerem Umfang',
            ],
            [
              'Steuerstundung',
              'geringer – es wird laufend versteuert',
              'höher, solange die Vorabpauschale niedrig ist. Über Jahrzehnte ist das der einzige echte Vorteil',
            ],
            [
              'Aufwand',
              'die Ausschüttung muss selbst wieder angelegt werden, sonst liegt sie herum',
              'keiner',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Daraus folgt eine praktische Faustregel: Solange der Sparerpauschbetrag nicht ausgeschöpft ist, spricht wenig gegen die ausschüttende Variante – sie nutzt ihn ohne Zutun. Ist er ausgeschöpft, ist thesaurierend die bequemere und steuerlich etwas günstigere Wahl. Die Entscheidung ist in beiden Richtungen klein genug, dass sie kein Grund zum Aufschieben ist.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Kosten stehen am ersten Tag fest und sind über Jahrzehnte der größte beeinflussbare Posten.',
            'Fonds ist Sondervermögen, Zertifikat ist Schuldverschreibung – der wichtigste Unterschied im Basisinformationsblatt.',
            'Arbeitgeberaktien koppeln Einkommen und Vermögen an dasselbe Unternehmen.',
            'Was bei minus 30 Prozent passiert, wird vorher aufgeschrieben.',
            'Die meisten Anfängerfehler sind Entscheidungen in der falschen Reihenfolge, nicht falsche Entscheidungen.',
            'Teure Schulden tilgen ist die einzige garantierte Rendite.',
            'Ausschüttend gegen thesaurierend ist eine Frage von Steuerabwicklung und Disziplin, nicht von Rendite.',
            'Solange der Sparerpauschbetrag nicht ausgeschöpft ist, nutzt ihn eine Ausschüttung ohne Zutun.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Verhalten, Struktur und unseriöse Angebote erkennen',
      metaDescription:
        'Verhaltensmuster und Gegenmaßnahmen, Depotstruktur und Ausfallszenarien, Kostenanalyse über alle Ebenen sowie Warnzeichen unseriöser Anbieter.',
      title: 'Struktur statt guter Vorsätze',
      lead: 'Wie sich Verhalten durch Regeln begrenzen lässt, was eine Depotstruktur leisten muss – und woran man ein unseriöses Angebot erkennt, bevor Geld geflossen ist.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Verhalten lässt sich nicht abtrainieren, nur einhegen',
        },
        {
          type: 'paragraph',
          text: 'Die bekannten Denkfehler verschwinden nicht dadurch, dass man sie kennt. Wer weiß, dass er zu Verlustaversion neigt, neigt weiterhin dazu. Was hilft, sind nicht Vorsätze, sondern Vorkehrungen, die im Ernstfall ohne Willenskraft auskommen.',
        },
        {
          type: 'table',
          caption: 'Muster und die Vorkehrung dagegen',
          head: ['Muster', 'Wie es sich zeigt', 'Vorkehrung'],
          rows: [
            [
              'Verlustaversion',
              'Verluste wiegen etwa doppelt so schwer wie gleich große Gewinne – man verkauft Gewinner zu früh und behält Verlierer zu lang',
              'Automatischer Sparplan; keine Einzelentscheidungen',
            ],
            [
              'Bestätigungsfehler',
              'Man sucht Argumente für die eigene Position und übersieht die dagegen',
              'Vor jedem Kauf die drei stärksten Gegenargumente notieren',
            ],
            [
              'Rückschaufehler',
              '„Das war doch absehbar“ – im Nachhinein wirkt alles vorhersehbar',
              'Protokoll mit Datum; es widerspricht der Erinnerung',
            ],
            [
              'Selbstüberschätzung',
              'Nach einigen guten Jahren steigt die Handelsfrequenz und mit ihr die Kosten',
              'Feste Regeln für Zukäufe; Depot seltener ansehen',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Der letzte Punkt ist der am leichtesten umzusetzende und der am meisten unterschätzte. Wer täglich ins Depot schaut, sieht überwiegend Rauschen – und handelt entsprechend häufiger. Wer vierteljährlich hineinsieht, trifft die gleichen langfristigen Entscheidungen mit deutlich weniger Transaktionen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Depotstruktur und ihre Ausfallszenarien',
        },
        {
          type: 'paragraph',
          text: 'Eine brauchbare Struktur beantwortet nicht nur, was gekauft wird, sondern auch, was passiert, wenn etwas ausfällt – ein Anbieter, ein Produkt, oder man selbst.',
        },
        {
          type: 'list',
          items: [
            '**Anbieterausfall.** Wertpapiere sind sicher, aber wochenlang nicht handelbar. Wer davon abhängt, verteilt auf zwei Depots – nicht wegen des Verlustrisikos, sondern wegen der Verfügbarkeit.',
            '**Fondsschließung.** Sehr kleine Fonds werden zusammengelegt oder aufgelöst. Eine Auflösung gilt steuerlich als Verkauf und schreibt Gewinne fest, zu einem Zeitpunkt, den man nicht gewählt hat.',
            '**Der eigene Ausfall.** Der am häufigsten übersehene Fall. Weiß jemand, dass es das Depot gibt, und wie man darankommt? Eine Aufstellung an einem auffindbaren Ort mit Anbieter, Zugangsweg und Ansprechpartner erspart Angehörigen erhebliche Mühe.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Kosten über alle Ebenen',
        },
        {
          type: 'paragraph',
          text: 'Die meisten schauen auf eine Ebene und übersehen die anderen drei. Vollständig ist eine Kostenbetrachtung erst, wenn alle vier zusammengezählt sind:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Depotebene** – Depotgebühr, Ordergebühren, Handelsplatzentgelte, Spread.',
            '**Produktebene** – laufende Kosten, Transaktionskosten im Fonds, erfolgsabhängige Vergütung.',
            '**Steuerebene** – Abgeltungsteuer, Vorabpauschale, verlorene Anrechnung ausländischer Quellensteuer.',
            '**Beratungsebene** – Ausgabeaufschläge, Bestandsprovisionen, Vermögensverwaltungsgebühren. Diese Ebene ist die teuerste und die am schlechtesten sichtbare.',
          ],
        },
        {
          type: 'figure',
          figure: 'kosten-ebenen',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Unseriöse Angebote erkennen',
        },
        {
          type: 'paragraph',
          text: 'Betrug im Anlagebereich folgt seit Jahrzehnten denselben Mustern. Wer sie kennt, erkennt sie in wenigen Minuten – und zwar bevor Geld geflossen ist, denn danach ist es fast immer weg.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Warnzeichen, in absteigender Aussagekraft',
          items: [
            '**Hohe Rendite bei angeblich geringem Risiko.** Das eine gibt es nicht ohne das andere. Diese Kombination allein genügt schon.',
            '**Zeitdruck.** „Nur noch heute“, „letzte Plätze“. Eine seriöse Anlage läuft einem nicht weg.',
            '**Keine Aufsicht.** Ein Anbieter mit Sitz außerhalb der EU und ohne Zulassung der BaFin oder einer vergleichbaren Behörde. Die Zulassung lässt sich in der Unternehmensdatenbank der BaFin in einer Minute nachschlagen.',
            '**Ertrag aus der Anwerbung anderer.** Wenn ein Teil des Ertrags davon abhängt, weitere Anleger zu gewinnen, ist es ein Schneeballsystem – unabhängig davon, wie das Produkt genannt wird.',
            '**Kein Basisinformationsblatt**, keine ISIN, kein Prospekt. Für jedes zugelassene Produkt in der EU gibt es diese Unterlagen.',
            '**Auszahlungen funktionieren nicht.** Das letzte Zeichen, und dann ist es zu spät. Wer unsicher ist, testet früh eine kleine Auszahlung.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Kryptowährungen sind dabei ein Sonderfall, der Verwirrung stiftet: Die Anlage selbst ist legal und die Technik echt, das Umfeld aber weitgehend unbeaufsichtigt. Dieselben Warnzeichen gelten dort unverändert – „garantierte Renditen“ auf eine Kryptoanlage sind kein neues Geschäftsmodell, sondern das älteste.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Denkfehler verschwinden nicht durch Wissen – nur Vorkehrungen wirken im Ernstfall.',
            'Seltener ins Depot sehen senkt messbar die Handelsfrequenz.',
            'Kosten haben vier Ebenen; die Beratungsebene ist die teuerste und unsichtbarste.',
            'Hohe Rendite bei geringem Risiko plus Zeitdruck – mehr braucht es nicht, um Nein zu sagen.',
          ],
        },
      ],
    },
  },
}
