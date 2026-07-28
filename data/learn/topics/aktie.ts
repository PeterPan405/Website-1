import type { LearnTopic } from '@/data/learn/types'

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Die drei Stufen bauen aufeinander auf, statt denselben Stoff zu wiederholen:
 * Beginner klärt Begriff und Mechanik, Fortgeschritten behandelt Aktiengattungen,
 * Kennzahlen und Orderpraxis, Profi geht auf Bewertung, Bilanzwarnzeichen,
 * Kapitalmaßnahmen und die deutsche Besteuerung ein.
 */
export const aktie: LearnTopic = {
  slug: 'aktie',
  title: 'Aktie',
  headline: 'Die Aktie: Anteil an einem echten Unternehmen',
  metaTitle: 'Aktie erklärt: Grundlagen, Kennzahlen und Risiken',
  metaDescription:
    'Was eine Aktie wirklich ist, wie du mit ihr Geld verdienst oder verlierst und welche Kennzahlen zählen – in drei Stufen bis zu Steuern und Bewertung.',
  lead: 'Eine Aktie ist kein Lottoschein, sondern ein Miteigentumsanteil an einem Unternehmen. Alles Weitere folgt aus diesem einen Satz.',
  overview: [
    'Wer eine Aktie kauft, wird Miteigentümerin oder Miteigentümer eines Unternehmens – mit allem, was dazugehört: Anspruch auf einen Anteil am Gewinn, Stimmrecht auf der Hauptversammlung und dem Risiko, dass der Anteil wertlos wird, wenn das Unternehmen scheitert.',
    'Dieses Thema beginnt bei der Frage, was du beim Aktienkauf überhaupt bekommst, und endet bei Bewertungsverfahren, Kapitalmaßnahmen und der Besteuerung von Kursgewinnen und Dividenden in Deutschland.',
    'Wichtig zum Einstieg: Aktien sind ein langfristiges Instrument. Die Schwankungsbreite einzelner Jahre lässt sich nicht wegdiskutieren – sie ist der Preis für die höhere erwartete Rendite gegenüber dem Sparbuch.',
  ],
  keywords: [
    'Aktie',
    'Aktien kaufen',
    'Dividende',
    'Kursgewinn',
    'Stammaktie',
    'Vorzugsaktie',
    'KGV',
    'Aktien Steuern',
  ],
  related: [
    'etf',
    'boerse',
    'wie-funktioniert-der-markt',
    'aktien-laender-branchen',
    'fonds',
  ],
  calculators: ['/rechner/zinsrechner'],
  symbols: ['dax', 'sp500'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Aktie einfach erklärt – Grundlagen für Einsteiger',
      metaDescription:
        'Was eine Aktie ist, wie du mit Kursgewinn und Dividende verdienst und welche vier Missverständnisse Einsteiger am häufigsten teuer bezahlen.',
      title: 'Aktie einfach erklärt',
      lead: 'Nach dieser Stufe weißt du, was du beim Aktienkauf tatsächlich erwirbst, woher eine Rendite kommt und was schiefgehen kann.',
      readingMinutes: 9,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Eine Aktie ist ein verbrieftes Miteigentumsrecht an einer Aktiengesellschaft. Kauft ein Unternehmen mit einer Million Aktien und du besitzt hundert davon, gehören dir ein Zehntausendstel dieses Unternehmens – ein Zehntausendstel der Fabriken, der Marken, der Patente, der Schulden und der künftigen Gewinne.',
        },
        {
          type: 'paragraph',
          text: 'Dieser Satz klingt banal, aber er beantwortet die meisten Einsteigerfragen. Eine Aktie hat einen Wert, weil das Unternehmen dahinter Werte besitzt und Gewinne erzielt. Sie ist keine Wette gegen andere Marktteilnehmer und kein Stück Papier, dessen Preis grundlos schwankt.',
        },
        {
          type: 'figure',
          figure: 'aktie-anteil',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum Unternehmen Aktien ausgeben',
        },
        {
          type: 'paragraph',
          text: 'Ein Unternehmen, das wachsen will, braucht Geld. Es kann sich Geld leihen – bei einer Bank oder über eine Anleihe – und muss es dann mit Zinsen zurückzahlen. Oder es verkauft Anteile an sich selbst. Dieses Geld muss nie zurückgezahlt werden; dafür geben die Alteigentümer einen Teil des Unternehmens und der künftigen Gewinne ab.',
        },
        {
          type: 'paragraph',
          text: 'Beim **Börsengang** (englisch IPO) werden Aktien erstmals öffentlich angeboten. Nur bei dieser Erstausgabe fließt das Geld tatsächlich an das Unternehmen. Kaufst du später eine Aktie an der Börse, kaufst du sie von einem anderen Anleger – das Unternehmen bekommt davon keinen Cent. Das ist ein Punkt, der oft missverstanden wird.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die zwei Wege, mit Aktien Geld zu verdienen',
        },
        {
          type: 'heading',
          level: 3,
          text: '1. Kursgewinn',
        },
        {
          type: 'paragraph',
          text: 'Du kaufst zu 40 Euro und verkaufst zu 55 Euro. Die Differenz von 15 Euro je Aktie ist dein Kursgewinn. Er entsteht, wenn andere Marktteilnehmer bereit sind, mehr zu zahlen als du damals – typischerweise, weil das Unternehmen inzwischen mehr verdient oder weil man ihm für die Zukunft mehr zutraut.',
        },
        {
          type: 'paragraph',
          text: 'Solange du nicht verkaufst, ist der Gewinn nur ein Buchwert. Er wird erst real, wenn du die Aktie tatsächlich abgibst – und bis dahin kann er auch wieder verschwinden.',
        },
        {
          type: 'heading',
          level: 3,
          text: '2. Dividende',
        },
        {
          type: 'paragraph',
          text: 'Viele Unternehmen schütten einen Teil ihres Gewinns an die Eigentümer aus. Diese Zahlung heißt Dividende. In Deutschland ist sie üblicherweise jährlich, in den USA meist vierteljährlich. Die Höhe beschließt die Hauptversammlung auf Vorschlag der Unternehmensleitung.',
        },
        {
          type: 'paragraph',
          text: 'Wichtig: **Eine Dividende ist kein Zins.** Es gibt keinen Anspruch darauf. Ein Unternehmen kann die Zahlung jederzeit senken oder ganz streichen – und tut das typischerweise in Krisenjahren, also genau dann, wenn auch der Kurs gefallen ist.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Am Ausschüttungstag fällt der Kurs',
          items: [
            'Schüttet ein Unternehmen 2 Euro pro Aktie aus, verlässt dieses Geld das Unternehmen. Der Kurs fällt am Tag der Ausschüttung rechnerisch um etwa diesen Betrag – der sogenannte Dividendenabschlag.',
            'Eine Dividende ist deshalb kein geschenktes Zusatzgeld, sondern eine Umschichtung: aus dem Unternehmenswert auf dein Konto. Wer ausschließlich auf hohe Dividendenrenditen schaut, übersieht das leicht.',
          ],
        },
        {
          type: 'figure',
          figure: 'aktie-dividendenabschlag',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie viel ist eine Aktie wert?',
        },
        {
          type: 'paragraph',
          text: 'Der Kurs ist keine Eigenschaft der Aktie, sondern das Ergebnis von Angebot und Nachfrage: Es ist der Preis, zu dem sich gerade ein Käufer und ein Verkäufer einig werden. Steigen die Gewinnerwartungen, wollen mehr Anleger kaufen, und der Preis steigt, bis genug Besitzer zum Verkauf bereit sind.',
        },
        {
          type: 'paragraph',
          text: 'Aus dem Kurs allein lässt sich nicht ablesen, ob eine Aktie teuer oder billig ist. Eine Aktie für 800 Euro kann günstiger sein als eine für 3 Euro – entscheidend ist das Verhältnis von Preis zu Gewinn, nicht der absolute Betrag. Warum das so ist, behandelt die Stufe „Fortgeschritten“.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du praktisch brauchst',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Ein Depot.** Das ist ein Konto für Wertpapiere, das du bei einer Bank oder einem Broker eröffnest. Es kostet bei vielen Anbietern nichts.',
            '**Einen Handelsplatz.** Über das Depot gibst du eine Order an eine Börse oder einen außerbörslichen Handelspartner.',
            '**Eine Order.** Darin steht, welches Wertpapier du kaufen willst, wie viele Stück und zu welchem Preis maximal.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Deine Aktien liegen nach dem Kauf im Depot und gehören dir. Geht die depotführende Bank pleite, sind Wertpapiere **Sondervermögen** – sie fallen nicht in die Insolvenzmasse und werden auf ein anderes Depot übertragen. Das ist ein wichtiger Unterschied zum Bankguthaben, für das die Einlagensicherung mit einer Obergrenze gilt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was schiefgehen kann',
        },
        {
          type: 'paragraph',
          text: 'Aktien haben keine Garantie. Es gibt keine Zusage, dass du dein Geld zurückbekommst, und keinen Mindestwert. Im Extremfall – der Insolvenz – werden zuerst alle Gläubiger bedient. Eigentümer stehen in der Rangfolge zuletzt; meist bleibt für sie nichts übrig. **Der Totalverlust einer einzelnen Aktie ist möglich und kommt vor.**',
        },
        {
          type: 'paragraph',
          text: 'Deshalb ist die wichtigste Regel für Einsteiger nicht die Auswahl der richtigen Aktie, sondern die Streuung über viele Unternehmen, Branchen und Länder. Fällt eines von 500 Unternehmen aus, kostet das Prozentbruchteile. Fällt das einzige aus, das du besitzt, ist dein Geld weg.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Vier Missverständnisse, die teuer werden',
          items: [
            '**„Eine gefallene Aktie muss wieder steigen.“** Nein. Der frühere Kurs ist für die Zukunft bedeutungslos. Eine Aktie, die von 100 auf 10 Euro gefallen ist, kann genauso gut auf 0 fallen.',
            '**„Ein niedriger Kurs heißt günstig.“** Der Preis pro Aktie sagt nichts über die Bewertung – nur das Verhältnis zum Gewinn tut das.',
            '**„Hohe Dividendenrendite ist ein Qualitätsmerkmal.“** Oft ist sie nur die Folge eines eingebrochenen Kurses. Die Rendite steigt, weil der Preis fiel.',
            '**„Ich verkaufe, wenn ich wieder im Plus bin.“** Der eigene Einstiegskurs ist eine willkürliche Zahl, die niemand außer dir kennt. Er ist kein Argument für eine Anlageentscheidung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie lange ist lange genug?',
        },
        {
          type: 'paragraph',
          text: 'Über einzelne Jahre sind Aktienkurse kaum vorhersagbar; Rückgänge von 30 Prozent und mehr sind historisch regelmäßig aufgetreten. Über Zeiträume von 15 Jahren und mehr hat ein breit gestreutes Aktienportfolio dagegen historisch zuverlässig positive Realrenditen geliefert.',
        },
        {
          type: 'paragraph',
          text: 'Die praktische Folgerung ist unspektakulär, aber wirksam: Geld, das du in den nächsten fünf Jahren brauchst, gehört nicht in Aktien. Geld, das 15 Jahre liegen bleiben kann, ist dort gut aufgehoben.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Nächster Schritt',
          items: [
            'In der Stufe „Fortgeschritten“ geht es um Aktiengattungen, Stimmrechte, die wichtigsten Bewertungskennzahlen und darum, wie du eine Order richtig aufgibst – inklusive der Frage, warum ein Limit fast immer sinnvoll ist.',
          ],
        },
      ],
    },

    // --------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Aktien für Fortgeschrittene: Gattungen, Kennzahlen, Orders',
      metaDescription:
        'Stamm- oder Vorzugsaktie, KGV und Dividendenrendite richtig lesen, Kapitalerhöhung und Verwässerung verstehen und Orders mit Limit korrekt aufgeben.',
      title: 'Aktien für Fortgeschrittene',
      lead: 'Diese Stufe unterscheidet Aktiengattungen, liest die gängigen Kennzahlen kritisch und klärt die Praxis: Handelsplatz, Spread und Orderarten.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Auf der Einsteigerstufe war „die Aktie“ ein einheitliches Ding. In der Praxis unterscheiden sich Aktien in ihren Rechten, ihrer Handelbarkeit und in der Art, wie ein Unternehmen mit seinen Eigentümern umgeht. Diese Unterschiede entscheiden mit über das Risiko.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Aktiengattungen: Was genau du kaufst',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Stamm- und Vorzugsaktien',
        },
        {
          type: 'paragraph',
          text: 'Die **Stammaktie** ist der Normalfall: Sie gewährt ein Stimmrecht auf der Hauptversammlung und einen Anspruch auf Dividende. Die **Vorzugsaktie** verzichtet auf das Stimmrecht und erhält dafür meist eine höhere oder bevorrechtigte Dividende.',
        },
        {
          type: 'paragraph',
          text: 'Mehrere deutsche Unternehmen haben beide Gattungen notiert, oft mit deutlich unterschiedlichen Kursen. Die Differenz ist der Preis der Kontrolle: Wer nur an der wirtschaftlichen Beteiligung interessiert ist, bekommt sie über Vorzüge häufig günstiger. Der Nachteil zeigt sich bei Übernahmen – Übernahmeangebote richten sich in erster Linie an die stimmberechtigten Stammaktien.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Inhaber- und Namensaktien',
        },
        {
          type: 'paragraph',
          text: 'Bei der **Inhaberaktie** ist berechtigt, wer sie besitzt – Übertragung ist einfach. Bei der **Namensaktie** wird die Eigentümerin im Aktienregister der Gesellschaft eingetragen. Das ermöglicht direkte Kommunikation, ist aber verwaltungsaufwändiger. Bei vinkulierten Namensaktien muss die Gesellschaft einer Übertragung sogar zustimmen.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Nennwert, Stückaktie und der Kurs',
        },
        {
          type: 'paragraph',
          text: 'Deutsche Aktien sind heute meist **Stückaktien** ohne festen Nennbetrag. Jede Aktie repräsentiert einen gleichen Anteil am Grundkapital – bei einer Million Aktien also ein Millionstel. Der Börsenkurs hat mit diesem rechnerischen Anteil nichts zu tun; er richtet sich nach den Erwartungen des Markts.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Kennzahlen und was sie nicht sagen',
        },
        {
          type: 'paragraph',
          text: 'Kennzahlen sind Abkürzungen. Sie ersetzen kein Verständnis des Geschäftsmodells, aber sie machen Unternehmen vergleichbar – solange man weiß, wo jede Kennzahl blind ist.',
        },
        {
          type: 'formula',
          expression: 'KGV = Kurs je Aktie / Gewinn je Aktie',
          description:
            'Das Kurs-Gewinn-Verhältnis gibt an, wie viele Jahresgewinne für das Unternehmen bezahlt werden. KGV 15 bedeutet: 15 Euro Kaufpreis für 1 Euro Jahresgewinn.',
        },
        {
          type: 'paragraph',
          text: 'Ein niedriges KGV ist kein Kaufsignal. Es kann bedeuten, dass der Markt sinkende Gewinne erwartet – dann ist der Nenner der Formel schon morgen kleiner und die Kennzahl von heute war eine Illusion. Umgekehrt kann ein hohes KGV bei stark wachsenden Gewinnen gerechtfertigt sein. Sinnvoll ist der Vergleich nur innerhalb einer Branche und über mehrere Jahre.',
        },
        {
          type: 'table',
          caption: 'Die gängigen Kennzahlen und ihre blinden Flecken',
          head: ['Kennzahl', 'Aussage', 'Blinder Fleck'],
          rows: [
            [
              'KGV',
              'Preis je Einheit Jahresgewinn',
              'Gewinn ist bilanzpolitisch beeinflussbar; bei Verlust nicht definiert',
            ],
            [
              'KBV',
              'Preis je Einheit Buchwert des Eigenkapitals',
              'Ignoriert immaterielle Werte wie Marken und Software fast völlig',
            ],
            [
              'Dividendenrendite',
              'Ausschüttung in Prozent des Kurses',
              'Steigt automatisch, wenn der Kurs fällt – oft ein Warnsignal',
            ],
            [
              'Ausschüttungsquote',
              'Anteil des Gewinns, der ausgeschüttet wird',
              'Über 100 Prozent heißt: Die Dividende wird aus Reserven oder Schulden bezahlt',
            ],
            [
              'Eigenkapitalquote',
              'Anteil Eigenkapital an der Bilanzsumme',
              'Branchenabhängig; Banken liegen strukturell niedrig',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Die nützlichste Einzelkennzahl für Einsteiger',
          items: [
            'Nicht das KGV, sondern der **freie Cashflow**: das Geld, das nach allen laufenden Ausgaben und Investitionen tatsächlich übrig bleibt. Gewinne lassen sich über Bewertungsansätze gestalten, tatsächliche Zahlungsströme deutlich schwerer.',
            'Ein Unternehmen, das über Jahre Gewinne ausweist, aber keinen freien Cashflow erzeugt, verdient genauer betrachtet zu werden.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wenn sich dein Anteil verändert',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Kapitalerhöhung und Verwässerung',
        },
        {
          type: 'paragraph',
          text: 'Gibt ein Unternehmen neue Aktien aus, sinkt der prozentuale Anteil der bisherigen Eigentümer. Aus einem Zehntausendstel wird bei einer Verdopplung der Aktienzahl ein Zwanzigtausendstel. Diesen Effekt nennt man **Verwässerung**.',
        },
        {
          type: 'paragraph',
          text: 'Als Ausgleich erhalten Altaktionäre in der Regel ein **Bezugsrecht**: Sie dürfen neue Aktien zu einem festgelegten, meist unter dem Marktpreis liegenden Kurs beziehen. Wer das Recht nicht nutzt, kann es an der Börse verkaufen. Wer es verfallen lässt, verschenkt Geld – ein häufiger und vollständig vermeidbarer Fehler.',
        },
        {
          type: 'paragraph',
          text: 'Entscheidend ist, wofür das Geld verwendet wird. Eine Kapitalerhöhung zur Finanzierung eines lohnenden Projekts kann den Wert je Aktie steigern. Eine Kapitalerhöhung, um ein Loch in der Bilanz zu schließen, ist ein Warnsignal.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Aktienrückkauf',
        },
        {
          type: 'paragraph',
          text: 'Der umgekehrte Fall: Das Unternehmen kauft eigene Aktien am Markt zurück und zieht sie meist ein. Die Zahl der Aktien sinkt, der Gewinn je Aktie steigt rein rechnerisch. Wirtschaftlich ist das eine Alternative zur Dividende.',
        },
        {
          type: 'paragraph',
          text: 'Sinnvoll ist ein Rückkauf, wenn die eigene Aktie unterbewertet ist. Kauft ein Unternehmen dagegen auf dem Höchstkurs zurück, vernichtet es Wert – zu beobachten war das bei mehreren Konzernen, die kurz vor Krisen Rekordsummen für Rückkäufe ausgaben und danach neues Kapital aufnehmen mussten.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Stimmrecht und Hauptversammlung',
        },
        {
          type: 'paragraph',
          text: 'Mit Stammaktien darfst du auf der Hauptversammlung mitstimmen: über die Verwendung des Gewinns, die Entlastung von Vorstand und Aufsichtsrat, Kapitalmaßnahmen und Satzungsänderungen. Ein Stimmrecht je Aktie ist der Normalfall.',
        },
        {
          type: 'paragraph',
          text: 'Bei kleinen Positionen ist der praktische Einfluss null. Interessanter ist die Gegenrichtung: Die Eigentümerstruktur zeigt, wer das Unternehmen tatsächlich steuert. Ein Familienunternehmen mit 60 Prozent in einer Hand trifft Entscheidungen anders als ein Konzern mit reinem Streubesitz – für langfristige Anleger eine relevante Information.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Praxis: Wo und wie du kaufst',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Handelsplatz und Spread',
        },
        {
          type: 'paragraph',
          text: 'Dieselbe Aktie wird an mehreren Handelsplätzen gehandelt. Für jeden gibt es zwei Preise: den **Geldkurs** (Bid), zu dem jemand kaufen will, und den **Briefkurs** (Ask), zu dem jemand verkaufen will. Die Differenz ist der **Spread** – eine Kostenposition, die in keiner Gebührenübersicht auftaucht.',
        },
        {
          type: 'figure',
          figure: 'aktie-spread',
        },
        {
          type: 'paragraph',
          text: 'Bei großen, viel gehandelten Aktien beträgt der Spread Bruchteile eines Prozents. Bei kleinen Werten oder außerhalb der Haupthandelszeiten kann er mehrere Prozent erreichen. **Praktische Konsequenz:** während der Haupthandelszeiten handeln, wenn die Liquidität am höchsten ist.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Orderarten',
        },
        {
          type: 'list',
          items: [
            '**Market-Order:** Wird sofort zum nächsten verfügbaren Preis ausgeführt. Die Ausführung ist sicher, der Preis nicht.',
            '**Limit-Order:** Du legst den maximalen Kaufpreis fest. Der Preis ist begrenzt, die Ausführung nicht garantiert. Für Privatanleger in fast allen Fällen die richtige Wahl.',
            '**Stop-Loss:** Wird eine Kursschwelle unterschritten, entsteht eine Market-Order. Achtung: In einem schnell fallenden Markt kann die Ausführung weit unter der Schwelle liegen.',
            '**Stop-Limit:** Wie Stop-Loss, aber mit Preisuntergrenze. Schützt vor Ausführung zu Ausreißerkursen – dafür kann die Order unausgeführt bleiben.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Stop-Loss ist keine Versicherung',
          items: [
            'Ein Stop-Loss schützt nicht gegen Kurslücken. Eröffnet eine Aktie nach einer schlechten Nachricht 30 Prozent tiefer, wird deine Order zu diesem tieferen Kurs ausgeführt – die Schwelle wurde übersprungen.',
            'Bei kurzfristigen Ausschlägen wirft ein zu enger Stop dich außerdem aus einer Position, die sich anschließend erholt. Für langfristige Anlagen ist Streuung der wirksamere Schutz.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Index-Zugehörigkeit und ihre Nebenwirkung',
        },
        {
          type: 'paragraph',
          text: 'Wird eine Aktie in einen bekannten Index aufgenommen, müssen alle Indexfonds sie kaufen – unabhängig vom Preis. Das erzeugt rund um Indexumstellungen mechanische Nachfrage und häufig Kursbewegungen ohne betriebswirtschaftlichen Anlass. Beim Ausschluss wirkt derselbe Mechanismus umgekehrt.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Nächster Schritt',
          items: [
            'Die Stufe „Profi“ behandelt Bewertung über Zahlungsströme, Warnzeichen in Bilanzen, Kapitalmaßnahmen wie Split, Spin-off und Squeeze-out sowie die deutsche Besteuerung – inklusive der Verlustverrechnungsbeschränkung, die speziell für Aktien gilt.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------- Profi
    profi: {
      metaTitle: 'Aktien für Profis: Bewertung, Bilanzrisiken, Besteuerung',
      metaDescription:
        'Bewertung über Zahlungsströme, Warnzeichen in Bilanzen, Kapitalmaßnahmen von Split bis Squeeze-out und die Besteuerung von Aktien in Deutschland im Detail.',
      title: 'Aktien auf Profi-Niveau',
      lead: 'Bewertung über Zahlungsströme statt Kennzahlen, Warnsignale in Bilanzen, Kapitalmaßnahmen und die steuerlichen Sonderregeln für Aktien in Deutschland.',
      readingMinutes: 15,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Diese Stufe behandelt, was bei einer ernsthaften Einzelaktien-Analyse tatsächlich den Unterschied macht: die Bewertungslogik hinter den Kennzahlen, die Stellen, an denen Bilanzen beschönigen, die Kapitalmaßnahmen, die deinen Anteil verändern, und die steuerlichen Sonderregeln, die für Aktien anders sind als für Fonds.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Bewertung: Der Wert kommt aus den Zahlungsströmen',
        },
        {
          type: 'paragraph',
          text: 'Der theoretisch korrekte Wert eines Unternehmens ist die Summe aller künftigen freien Zahlungsströme, abgezinst auf heute. Abgezinst wird, weil ein Euro in zehn Jahren weniger wert ist als ein Euro heute – er ist unsicher, und er könnte in der Zwischenzeit anderweitig Rendite erzielen.',
        },
        {
          type: 'formula',
          expression: 'Unternehmenswert = Σ FCFₜ / (1 + r)ᵗ + Endwert / (1 + r)ⁿ',
          description:
            'FCFₜ ist der freie Cashflow im Jahr t, r der Kapitalkostensatz. Der **Endwert** fasst alle Jahre nach dem Prognosezeitraum zusammen und macht in der Praxis oft 60 bis 80 Prozent des Ergebnisses aus.',
        },
        {
          type: 'paragraph',
          text: 'Genau darin liegt die Schwäche des Verfahrens. Der größte Teil des Ergebnisses hängt an zwei Annahmen: der ewigen Wachstumsrate und dem Kapitalkostensatz. Eine Änderung von r um einen halben Prozentpunkt verschiebt den Wert leicht um 15 Prozent. Ein Bewertungsmodell liefert deshalb keine Zahl, sondern eine Bandbreite – und eine Rechenschaft darüber, welche Annahmen der aktuelle Kurs unterstellt.',
        },
        {
          type: 'paragraph',
          text: 'Produktiver als „Was ist die Aktie wert?“ ist die umgekehrte Frage: **Welche Annahmen müssten zutreffen, damit der heutige Kurs gerechtfertigt ist?** Wenn ein Kurs unterstellt, dass ein Unternehmen zwanzig Jahre lang 25 Prozent jährlich wächst, ist die Bewertung damit einschätzbar, ohne dass man selbst prognostizieren muss.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Qualitätskennzahlen',
        },
        {
          type: 'table',
          caption: 'Kennzahlen, die über die Qualität eines Geschäftsmodells etwas sagen',
          head: ['Kennzahl', 'Berechnung', 'Worauf sie hinweist'],
          rows: [
            [
              'ROCE',
              'EBIT / (Eigenkapital + verzinsliches Fremdkapital)',
              'Wie produktiv das eingesetzte Kapital arbeitet – dauerhaft hohe Werte deuten auf einen Wettbewerbsvorteil',
            ],
            [
              'Cash-Konversion',
              'Freier Cashflow / Nettogewinn',
              'Dauerhaft unter 1 heißt: Gewinne werden ausgewiesen, aber nicht in Geld umgesetzt',
            ],
            [
              'Nettoverschuldung / EBITDA',
              'Verzinsliche Schulden abzüglich Kassenbestand, geteilt durch EBITDA',
              'Ab etwa 3 wird die Bilanz zinsempfindlich, ab 4 bis 5 kritisch',
            ],
            [
              'Zinsdeckung',
              'EBIT / Zinsaufwand',
              'Unter 3 wird der Schuldendienst zum Risiko für die Dividende',
            ],
            [
              'Verwässerung',
              'Wachstum der Aktienzahl je Jahr',
              'Steigt die Zahl stetig, wächst der Gewinn je Aktie langsamer als der Gesamtgewinn',
            ],
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warnzeichen in Bilanz und Bericht',
        },
        {
          type: 'list',
          items: [
            '**Gewinn steigt, Cashflow nicht.** Die häufigste Konstellation vor unangenehmen Überraschungen. Ursache sind oft früh verbuchte Umsätze oder aufgeblähte Forderungen.',
            '**Forderungen wachsen schneller als der Umsatz.** Verkauft wird, aber nicht bezahlt – häufig ein Zeichen für nachlassende Kundenqualität oder zu aggressive Verkaufsziele.',
            '**Vorräte wachsen schneller als der Umsatz.** Deutet auf Ware hin, die sich schlechter verkauft als geplant; Abschreibungen folgen oft später.',
            '**Hoher Firmenwert (Goodwill) in der Bilanz.** Entsteht bei Zukäufen über Buchwert. Erweist sich ein Zukauf als Fehlgriff, folgt eine Abschreibung, die das Eigenkapital sofort trifft.',
            '**Umfangreiche „bereinigte“ Kennzahlen.** Werden Restrukturierungskosten Jahr für Jahr als Einmaleffekt herausgerechnet, sind sie keine Einmaleffekte, sondern laufender Aufwand.',
            '**Aktienbasierte Vergütung außerhalb des Aufwands.** Sie ist ein echter Kostenblock, der in „bereinigten“ Zahlen häufig unterschlagen wird und die Aktienzahl erhöht.',
            '**Wechsel von Wirtschaftsprüfer oder Finanzvorstand ohne klare Begründung**, besonders kurz vor einem Berichtstermin.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Wo diese Angaben stehen',
          items: [
            'Die Kapitalflussrechnung im Geschäftsbericht zeigt die tatsächlichen Zahlungsströme – sie ist deutlich schwerer zu gestalten als die Gewinn- und Verlustrechnung.',
            'Der Anhang enthält die eigentlich interessanten Angaben: Leasingverpflichtungen, Pensionslasten, Eventualverbindlichkeiten und Geschäfte mit nahestehenden Personen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Kapitalmaßnahmen und Sonderfälle',
        },
        {
          type: 'list',
          items: [
            '**Aktiensplit:** Aus einer Aktie zu 900 Euro werden zehn zu 90 Euro. Rein kosmetisch – dein Anteil und der Gesamtwert bleiben unverändert.',
            '**Spin-off:** Ein Geschäftsbereich wird abgespalten und du erhältst Aktien der neuen Gesellschaft. Der Kurs der Muttergesellschaft fällt entsprechend; die steuerliche Behandlung ist je nach Struktur unterschiedlich und gelegentlich strittig.',
            '**Squeeze-out:** Ab einer bestimmten Beteiligungshöhe kann ein Großaktionär die verbliebenen Aktionäre gegen Barabfindung aus der Gesellschaft drängen. Ein Verkauf ist dann nicht mehr freiwillig.',
            '**Delisting:** Wird die Börsennotierung beendet, bleibt die Aktie in deinem Besitz, ist aber praktisch kaum noch handelbar. Der Wert wird dadurch schwer bestimmbar.',
            '**ADR statt Aktie:** Bei vielen außereuropäischen Unternehmen handelst du kein Eigentum, sondern ein von einer Bank ausgegebenes Hinterlegungszertifikat – mit eigenen Gebühren und dem Bonitätsrisiko der Depotbank.',
            '**Mehrstimmrechtsaktien:** Einige Unternehmen haben Aktienklassen mit zehn oder mehr Stimmen je Aktie. Als Käufer der öffentlich gehandelten Klasse hast du wirtschaftliche Beteiligung, aber praktisch keinen Einfluss.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Besteuerung in Deutschland',
        },
        {
          type: 'paragraph',
          text: 'Kursgewinne und Dividenden aus Aktien gehören zu den Einkünften aus Kapitalvermögen. Darauf wird Abgeltungssteuer erhoben, zuzüglich Solidaritätszuschlag und gegebenenfalls Kirchensteuer. Die depotführende Bank behält den Betrag automatisch ein, sofern kein Freistellungsauftrag vorliegt.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Die Verlustverrechnung ist bei Aktien eingeschränkt',
        },
        {
          type: 'paragraph',
          text: 'Das ist die Regel, die am häufigsten überrascht: **Verluste aus dem Verkauf von Aktien dürfen ausschließlich mit Gewinnen aus dem Verkauf von Aktien verrechnet werden.** Nicht mit Dividenden, nicht mit Zinsen, nicht mit Gewinnen aus Fonds oder Zertifikaten.',
        },
        {
          type: 'paragraph',
          text: 'Die Banken führen dafür getrennte Verlustverrechnungstöpfe: einen allgemeinen und einen ausschließlich für Aktienverluste. Wer im selben Jahr Aktienverluste realisiert und Fondsgewinne erzielt, kann diese nicht gegeneinander stellen. Nicht genutzte Verluste werden in Folgejahre vorgetragen – aber immer nur innerhalb ihres Topfes.',
        },
        {
          type: 'heading',
          level: 3,
          text: 'Weitere Punkte',
        },
        {
          type: 'list',
          items: [
            '**Kein Teilfreistellungsvorteil.** Bei Aktienfonds bleibt ein Teil des Ertrags steuerfrei, um die Vorbelastung auf Fondsebene auszugleichen. Für **direkt gehaltene Einzelaktien gilt diese Teilfreistellung nicht** – ein oft übersehener struktureller Unterschied.',
            '**Quellensteuer auf ausländische Dividenden.** Der Sitzstaat des Unternehmens behält vorab Steuer ein. Über Doppelbesteuerungsabkommen wird ein Teil auf die deutsche Steuer angerechnet, ein Rest muss im Ausland zurückgefordert werden – bei kleinen Beträgen ist der Aufwand meist höher als die Rückzahlung.',
            '**Verluste aus Depotwechsel und Totalausfall.** Wird eine Aktie wertlos ausgebucht, ist die steuerliche Anerkennung des Verlusts an Bedingungen geknüpft. Hier lohnt der Blick in die Abrechnung der Bank.',
            '**Sparerpauschbetrag zuerst dorthin, wo die Erträge anfallen.** Bei mehreren Depots geht der Freibetrag sonst ins Leere.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Keine Steuerberatung',
          items: [
            'Steuersätze, Freibeträge und Verrechnungsregeln ändern sich, und die Anwendung hängt von der persönlichen Situation ab. Die Darstellung hier ist eine Orientierung, keine Beratung. Für konkrete Entscheidungen ist steuerlicher Rat der richtige Weg.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Positionsgröße und Konzentrationsrisiko',
        },
        {
          type: 'paragraph',
          text: 'Bei Einzelaktien ist die Positionsgröße die wichtigere Entscheidung als die Auswahl. Der Grund ist mathematisch: Ein Verlust von 50 Prozent erfordert anschließend ein Plus von 100 Prozent, um wieder auf Null zu kommen. Verluste und Gewinne sind nicht symmetrisch.',
        },
        {
          type: 'formula',
          expression: 'Portfolio-Effekt = Positionsgröße × Kursverlust',
          description:
            'Eine Position von 3 Prozent kostet bei Totalverlust 3 Prozent des Depots – verkraftbar. Eine Position von 25 Prozent kostet 25 Prozent, und das dauert Jahre zum Aufholen.',
        },
        {
          type: 'paragraph',
          text: 'Ein zweiter Punkt betrifft die Korrelation: Fünf Autohersteller sind keine Streuung, sondern eine fünffache Wette auf dieselbe Branche und denselben Konjunkturzyklus. Wirksame Streuung braucht Positionen, die auf unterschiedliche Ursachen reagieren.',
        },
        {
          type: 'paragraph',
          text: 'Ein dritter Punkt betrifft das eigene Einkommen. Aktien des Arbeitgebers – etwa aus Mitarbeiterprogrammen – bündeln Arbeitsplatz und Vermögen im gleichen Unternehmen. Gerät es in Schwierigkeiten, treffen Kursverlust und Einkommensrisiko gleichzeitig zu. Für diesen Fall gilt eine strengere Obergrenze als für jede andere Position.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der ehrliche Vergleichsmaßstab',
        },
        {
          type: 'paragraph',
          text: 'Wer Einzelaktien auswählt, sollte die eigene Wertentwicklung gegen einen breiten Index nach Kosten und Steuern messen – über mindestens zehn Jahre, inklusive aller verkauften Positionen. Ohne dieses Protokoll bleibt die Erinnerung selektiv: Treffer bleiben im Gedächtnis, Fehlgriffe verblassen.',
        },
        {
          type: 'paragraph',
          text: 'Fällt der Vergleich über einen so langen Zeitraum nicht positiv aus, ist das keine Niederlage, sondern eine nützliche Information: Der breite Markt ist für die meisten Anleger nicht die Untergrenze, sondern ein hoher Maßstab.',
        },
      ],
    },
  },
}
