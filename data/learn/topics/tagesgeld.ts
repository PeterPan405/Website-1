import type { LearnTopic } from '@/data/learn/types'
import { inflationsbeispiel, realzinsbeispiel } from '@/lib/inflations-beispiele'
import { formatPercent } from '@/lib/format'

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner klärt Funktionsweise, Zweck und Einlagensicherung.
 * Fortgeschritten behandelt die Zinsmechanik, Lockangebote und Steuern. Profi
 * geht auf Sicherungssysteme, Auslandseinlagen und den Vergleich mit
 * Geldmarktfonds ein.
 *
 * ## Warum keine Zinssätze im Text stehen
 *
 * Der Tagesgeldzins ändert sich mit jedem Beschluss der Notenbank und
 * unterscheidet sich zwischen zwei Banken um mehrere Prozentpunkte. Eine Zahl
 * hier wäre in Wochen falsch. Was hier steht, ist die Mechanik – die gilt
 * unabhängig vom Zinsniveau, und mit ihr kann man ein aktuelles Angebot selbst
 * einordnen.
 */
export const tagesgeld: LearnTopic = {
  slug: 'tagesgeld',
  title: 'Tagesgeld',
  headline: 'Tagesgeld: der richtige Ort für Geld, das verfügbar bleiben muss',
  metaTitle: 'Tagesgeld erklärt: Zinsen, Sicherheit, Grenzen',
  metaDescription:
    'Wie Tagesgeld funktioniert, wie Zinsen zustande kommen, was die Einlagensicherung deckt und warum Tagesgeld für langfristigen Aufbau nicht taugt.',
  lead: 'Tagesgeld ist täglich verfügbar und nominal sicher – der Preis dafür ist eine Rendite, die die Inflation kaum schlägt.',
  overview: [
    'Ein Tagesgeldkonto ist ein verzinstes Konto ohne festgelegte Laufzeit. Das Geld ist arbeitstäglich verfügbar, der Zinssatz variabel.',
    'Tagesgeld erfüllt genau zwei Aufgaben gut: den Notgroschen aufbewahren und Geld parken, das in den nächsten Jahren gebraucht wird. Für alles Weitere ist es das falsche Werkzeug.',
    'Die Stufen behandeln Funktionsweise und Einlagensicherung, dann Zinsmechanik, Lockangebote und Steuern, schließlich Bankbonität, Auslandseinlagen und die reale Rendite.',
  ],
  keywords: ['Tagesgeld', 'Zinsen', 'Einlagensicherung', 'Notgroschen', 'Realzins'],
  related: ['einlagensicherung', 'zinseszins', 'sparerpauschbetrag'],
  calculators: ['/rechner/zinsrechner', '/rechner/inflationsrechner'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Tagesgeld einfach erklärt – Zinsen und Sicherheit',
      metaDescription:
        'Wie ein Tagesgeldkonto funktioniert, wofür es taugt, was die Einlagensicherung abdeckt und wie groß ein Notgroschen sein sollte.',
      title: 'Tagesgeld einfach erklärt',
      lead: 'Nach dieser Stufe weißt du, wofür Tagesgeld das richtige Werkzeug ist, wofür nicht, und was die Einlagensicherung tatsächlich abdeckt.',
      readingMinutes: 6,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Ein Tagesgeldkonto ist ein Konto, auf dem Geld liegt und verzinst wird. Keine Laufzeit, keine Kündigungsfrist: Was heute darauf liegt, kann morgen wieder auf dem Girokonto sein. Das klingt unspektakulär und ist genau der Punkt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was es von seinen Nachbarn unterscheidet',
        },
        {
          type: 'table',
          caption: 'Drei Konten, die oft verwechselt werden',
          head: ['', 'Verfügbarkeit', 'Zins', 'Wofür gedacht'],
          rows: [
            [
              'Girokonto',
              'Sofort, mit Karte und Überweisung',
              'In der Regel keiner',
              'Zahlungsverkehr',
            ],
            [
              'Tagesgeld',
              'Arbeitstäglich, per Übertrag auf das Girokonto',
              'Variabel – die Bank darf ihn jederzeit ändern',
              'Geld, das verfügbar bleiben muss',
            ],
            [
              'Festgeld',
              'Erst am Ende der Laufzeit',
              'Fest für die gesamte Laufzeit',
              'Beträge mit bekanntem Verwendungszeitpunkt',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Der entscheidende Unterschied zwischen Tages- und Festgeld ist nicht die Höhe des Zinses, sondern wer das Zinsänderungsrisiko trägt. Beim Festgeld die Bank – sie muss den vereinbarten Satz auch dann zahlen, wenn die Zinsen inzwischen gefallen sind. Beim Tagesgeld du: Sinkt das Zinsniveau, sinkt dein Zins mit, oft binnen Wochen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wofür Tagesgeld gemacht ist',
        },
        {
          type: 'list',
          items: [
            '**Der Notgroschen.** Drei bis sechs Monatsausgaben, die für eine kaputte Heizung, ein defektes Auto oder eine Kündigung bereitliegen. Dieses Geld darf nicht schwanken und muss sofort da sein – beides erfüllt Tagesgeld und sonst kaum etwas.',
            '**Geld mit Termin.** Was in ein, zwei oder drei Jahren gebraucht wird – Anzahlung, Umzug, Auto –, gehört nicht an die Börse. Der Zeitraum ist zu kurz, um einen Kursrückgang aussitzen zu können.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Und wofür nicht',
          items: [
            'Für Vermögensaufbau über Jahrzehnte. Tagesgeld ist nominal sicher, aber real fast immer ein Verlustgeschäft.',
            `Rechenbeispiel: Bei ${formatPercent(realzinsbeispiel.nominal, 1)} Zins und ${formatPercent(inflationsbeispiel.rate, 1)} Inflation beträgt der Realzins ${formatPercent(realzinsbeispiel.real, 2)}. Das Konto wächst, die Kaufkraft schrumpft.`,
            'Das macht Tagesgeld nicht schlecht – es macht es zu einem Werkzeug mit einem klar umrissenen Zweck. Ein Hammer ist auch keine Säge.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie sicher ist das Geld?',
        },
        {
          type: 'paragraph',
          text: 'In der Europäischen Union sind Bankeinlagen gesetzlich bis **100.000 Euro je Person und Institut** geschützt. Geht die Bank pleite, zahlt die Sicherungseinrichtung aus – in Deutschland binnen sieben Arbeitstagen, ohne dass ein Antrag nötig wäre.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Zwei Feinheiten, die häufig übersehen werden',
          items: [
            '**Je Person, nicht je Konto.** Wer bei derselben Bank ein Giro-, ein Tagesgeld- und ein Festgeldkonto hat, hat trotzdem nur einmal 100.000 Euro Schutz. Bei einem Gemeinschaftskonto zweier Personen verdoppelt sich die Summe.',
            '**Je Institut, nicht je Marke.** Manche Banken treten unter mehreren Namen auf, gehören aber zu einer Zulassung. Dann gilt die Grenze einmal für alles zusammen. Im Zweifel hilft die Bankleitzahl oder ein Blick ins Impressum.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Wertpapiere im Depot brauchen diesen Schutz übrigens nicht. Sie gehören dir und nicht der Bank – sie fallen bei einer Insolvenz gar nicht erst in die Masse. Die Einlagensicherung deckt Guthaben, also Geld, das die Bank dir schuldet.',
        },
        {
          type: 'figure',
          figure: 'tagesgeld-realzins',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Der Zins ist variabel – die Bank darf ihn jederzeit ändern.',
            'Zwei gute Zwecke: Notgroschen und Geld mit absehbarem Termin.',
            'Nominal sicher heißt nicht real sicher; die Inflation zieht jedes Jahr ab.',
            'Der Schutz gilt je Person und Institut, nicht je Konto und nicht je Marke.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Tagesgeld fortgeschritten: Zinsmechanik und Steuern',
      metaDescription:
        'Wie der Einlagenzins der Notenbank auf Tagesgeld durchschlägt, wie Lockzinsen kalkuliert sind und wie Zinserträge in Deutschland besteuert werden.',
      title: 'Zinsmechanik, Angebote und Steuern',
      lead: 'Woher der Zins kommt, wie Lockangebote kalkuliert sind und welche Zahl nach Steuern übrig bleibt.',
      readingMinutes: 9,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Woher der Zins kommt',
        },
        {
          type: 'paragraph',
          text: 'Eine Bank kann überschüssiges Geld bei der Notenbank parken und bekommt dafür den **Einlagenzins**. Das ist ihre Alternative zu deinem Tagesgeld – und damit die natürliche Obergrenze dessen, was sie dir zahlen wird. Mehr zu zahlen, als sie risikolos bekommt, ergibt nur Sinn, solange sie damit etwas anderes erreicht: neue Kunden zum Beispiel.',
        },
        {
          type: 'paragraph',
          text: 'Deshalb bewegt sich der Tagesgeldzins des Marktes ungefähr mit dem Einlagenzins – aber nicht symmetrisch. Sinkt der Leitzins, sinken die Tagesgeldzinsen meist binnen Wochen. Steigt er, dauert die Weitergabe oft Monate. Der Grund ist simpel: Wer sein Geld nicht bewegt, merkt es nicht, und die meisten bewegen es nicht.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum manche Banken deutlich mehr bieten',
          items: [
            'Weil sie das Geld brauchen. Eine Bank, die viele Kredite vergibt, muss sich refinanzieren – Kundeneinlagen sind dafür eine der günstigsten Quellen.',
            'Weil sie neu am Markt sind und Kunden gewinnen wollen. Der hohe Zins ist dann Werbebudget, kein Geschäftsmodell.',
            'Ein hoher Zins ist deshalb kein Warnsignal für sich genommen – aber ein Anlass, nachzusehen, wer dahintersteht und welches Sicherungssystem gilt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Angebote richtig lesen',
        },
        {
          type: 'paragraph',
          text: 'Vier Angaben entscheiden darüber, was von einer beworbenen Zahl übrig bleibt:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Für wen und wie lange?** Der beworbene Satz gilt oft nur für Neukunden und nur für sechs Monate. Danach fällt er auf den Bestandskundenzins, der ein Vielfaches darunter liegen kann.',
            '**Bis zu welchem Betrag?** Häufig gilt der Aktionszins nur bis zu einer Obergrenze. Darüber liegt das Geld zum Bestandssatz – wer den Durchschnitt rechnet, kommt auf eine ganz andere Zahl.',
            '**Wann wird gutgeschrieben?** Monatlich, quartalsweise oder jährlich. Bei monatlicher Gutschrift verzinsen sich die Zinsen mit; der effektive Satz liegt dann leicht über dem nominalen.',
            '**Was kostet der Wechsel?** Kontoeröffnung, Identifizierung, Umbuchen – zusammen eine gute Stunde. Bei einem halben Prozentpunkt Unterschied auf 5.000 Euro sind das 25 Euro im Jahr. Ob sich das lohnt, ist eine ehrliche Rechnung wert.',
          ],
        },
        {
          type: 'figure',
          figure: 'tagesgeld-aktionszins',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Steuern auf Zinsen',
        },
        {
          type: 'paragraph',
          text: 'Zinserträge sind Kapitalerträge. Deutsche Banken behalten davon **Abgeltungsteuer**, Solidaritätszuschlag und gegebenenfalls Kirchensteuer ein und führen sie ab – zusammen rund ein Viertel bis gut ein Viertel des Ertrags. Du bekommst netto gutgeschrieben, ohne selbst etwas tun zu müssen.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Den Sparerpauschbetrag richtig verteilen',
          items: [
            'Bis zu einem jährlichen Freibetrag bleiben Kapitalerträge steuerfrei. Damit die Bank ihn berücksichtigt, braucht sie einen **Freistellungsauftrag** – ohne ihn wird abgeführt, und du holst es dir erst über die Steuererklärung zurück.',
            'Der Betrag lässt sich auf mehrere Banken aufteilen, insgesamt aber nur einmal ausschöpfen. Wer bei drei Instituten den vollen Betrag beantragt, macht eine falsche Angabe.',
            'Einmal im Jahr prüfen: Zinsen und Depoterträge verschieben sich, und ein Auftrag, der beim falschen Institut liegt, nützt nichts.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Bei ausländischen Banken ist es anders',
          items: [
            'Sie führen die deutsche Steuer nicht ab. Die Zinsen müssen in der Steuererklärung angegeben werden – von selbst passiert nichts.',
            'Manche Länder behalten eine eigene Quellensteuer ein. Sie lässt sich in der Regel anrechnen, aber nur, wenn man sie erklärt.',
            'Wer das übersieht, hat keinen Zinsvorteil erzielt, sondern eine unvollständige Steuererklärung abgegeben.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Zahl, die am Ende zählt',
        },
        {
          type: 'paragraph',
          text: 'Vom beworbenen Zins geht erst die Steuer ab, dann die Inflation. Was übrig bleibt, ist der reale Ertrag nach Steuern – und der ist in Zeiten mäßiger Zinsen regelmäßig negativ. Das ist kein Argument gegen Tagesgeld, sondern eines dafür, nur so viel darauf zu halten, wie der Zweck verlangt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Der Einlagenzins der Notenbank ist die Obergrenze dessen, was Banken zahlen können.',
            'Senkungen werden schnell weitergegeben, Erhöhungen langsam.',
            'Vier Fragen an jedes Angebot: für wen, wie lange, bis zu welchem Betrag, wie oft gutgeschrieben.',
            'Der Freistellungsauftrag ist teilbar, aber insgesamt nur einmal ausschöpfbar.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Tagesgeld für Profis: Bonität, Ausland, Realrendite',
      metaDescription:
        'Bankbonität und Institutssicherung, Auslandseinlagen mit Quellensteuer und Wechselkursrisiko sowie Geldmarktfonds als Alternative im Vergleich.',
      title: 'Tagesgeld auf Profi-Niveau',
      lead: 'Sicherungssysteme auseinanderhalten, Auslandseinlagen realistisch bewerten und Alternativen sauber vergleichen.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Bei kleinen Beträgen ist Tagesgeld eine Entscheidung über einen halben Prozentpunkt. Ab sechsstelligen Summen wird es eine Entscheidung über Gegenparteirisiko – und dafür muss man wissen, welche Sicherung welche Zusage macht.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Drei Sicherungssysteme, drei verschiedene Zusagen',
        },
        {
          type: 'table',
          caption: 'Wer im Ernstfall wofür einsteht',
          head: ['System', 'Deckt', 'Rechtsanspruch?'],
          rows: [
            [
              'Gesetzliche Einlagensicherung',
              'Bis 100.000 Euro je Person und Institut, EU-weit',
              'Ja – gesetzlich geregelt, Auszahlung binnen weniger Arbeitstage',
            ],
            [
              'Freiwilliger Einlagensicherungsfonds',
              'Beträge darüber hinaus, je nach Institut in erheblicher Höhe',
              'Nein – eine Leistung des Verbands, kein einklagbarer Anspruch',
            ],
            [
              'Institutssicherung',
              'Nicht die Einlage, sondern die Bank selbst – der Verbund stützt das Institut, bevor es fällt',
              'Kein individueller Anspruch, aber historisch ist noch kein Mitglied ausgefallen',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Wichtig ist die Reihenfolge im Ernstfall. Seit der Bankenkrise gilt europaweit das **Bail-in**: Bevor öffentliche Mittel fließen, haften Eigentümer und Gläubiger der Bank. Einlagen von Privatpersonen stehen dabei sehr weit hinten – geschützte Einlagen bis 100.000 Euro werden gar nicht herangezogen. Der Teil darüber allerdings schon.',
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Praktische Folge',
          items: [
            'Wer mehr als die geschützte Summe kurzfristig verfügbar halten muss, verteilt sie auf mehrere Institute – und prüft dabei, ob es wirklich verschiedene Institute sind und nicht nur verschiedene Marken.',
            'Bei Gemeinschaftskonten zählt der Schutz je Inhaber, die Summe verdoppelt sich also.',
            'Alles, was nicht binnen Tagen verfügbar sein muss, gehört ohnehin nicht auf ein Tagesgeldkonto.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Einlagen im Ausland',
        },
        {
          type: 'paragraph',
          text: 'Vermittlungsplattformen bieten Tagesgeld bei Banken in ganz Europa an, oft deutlich über dem heimischen Niveau. Die gesetzliche Sicherung von 100.000 Euro gilt EU-weit – zuständig ist aber jeweils das Sicherungssystem des Sitzlandes, und das ist eine andere Zusage als dieselbe Zahl im Inland.',
        },
        {
          type: 'list',
          items: [
            '**Leistungsfähigkeit.** Die Sicherung ist so stark wie der Staat dahinter. Fällt eine große Bank in einem kleinen Land aus, ist das eine andere Belastung als derselbe Fall in einer großen Volkswirtschaft.',
            '**Verfahren.** Auszahlung, Korrespondenz und Fristen laufen nach dem Recht des Sitzlandes und häufig in dessen Sprache. Im Regelfall ist das kein Thema; im Ernstfall ist es genau dann eines, wenn man das Geld braucht.',
            '**Steuern.** Es wird nichts automatisch abgeführt. Eine ausländische Quellensteuer lässt sich meist anrechnen, aber nur über die Erklärung.',
            '**Fremdwährung.** Ein Konto in einer Hochzinswährung bietet den höheren Zins und das Wechselkursrisiko dazu. Beides gehört zusammen betrachtet – der Zinsvorsprung ist häufig genau die vom Markt erwartete Abwertung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Alternativen und ihre Haken',
        },
        {
          type: 'table',
          caption: 'Kurzfristig geparktes Geld – die üblichen Möglichkeiten',
          head: ['Form', 'Vorteil', 'Haken'],
          rows: [
            [
              'Tagesgeld',
              'Täglich verfügbar, bis 100.000 Euro gesetzlich geschützt',
              'Variabler Zins, real meist negativ',
            ],
            [
              'Festgeldleiter',
              'Höherer Zins, durch gestaffelte Laufzeiten regelmäßig ein fälliger Teil',
              'Der noch laufende Teil ist gebunden; vorzeitige Auflösung kostet',
            ],
            [
              'Geldmarkt-ETF',
              'Folgt dem Marktzins ohne Verzögerung, im Depot verwahrt',
              'Kein Einlagenschutz, dafür Sondervermögen; Spread und laufende Kosten',
            ],
            [
              'Kurzlaufende Staatsanleihen',
              'Bonität des Emittenten statt der einer Bank',
              'Kursschwankungen bei vorzeitigem Verkauf, Handels- und Depotkosten',
            ],
          ],
        },
        {
          type: 'figure',
          figure: 'tagesgeld-parkplaetze',
        },
        {
          type: 'paragraph',
          text: 'Der Geldmarkt-ETF verdient eine Erläuterung, weil er oft als „besseres Tagesgeld“ verkauft wird. Er hat keinen Einlagenschutz – braucht ihn als Sondervermögen aber auch nicht, denn er fällt bei einer Insolvenz des Anbieters nicht in die Masse. Sein Risiko liegt woanders: in den Papieren, die er hält. Ein Fonds, der ausschließlich besicherte Übernachtgeschäfte abbildet, ist etwas anderes als einer mit Unternehmensanleihen kurzer Laufzeit, auch wenn beide „Geldmarkt“ heißen.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Das Auswahlkriterium ist nicht die Rendite',
          items: [
            'Für kurzfristig gebundenes Geld entscheidet zuerst, wann es verfügbar sein muss – erst danach, was es einbringt.',
            'Der Unterschied zwischen den Möglichkeiten beträgt einen Bruchteil eines Prozentpunkts. Der Unterschied zwischen „am Tag X verfügbar“ und „nicht verfügbar“ kann teuer werden.',
            'Wer für den Notgroschen ein halbes Prozent mehr sucht, optimiert die kleinste Stellschraube im ganzen Portfolio.',
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
            'Gesetzliche Sicherung, freiwilliger Fonds und Institutssicherung geben drei verschiedene Zusagen – nur die erste ist einklagbar.',
            'Beim Bail-in stehen geschützte Einlagen ganz hinten, der Teil darüber nicht.',
            'Auslandseinlagen: Sicherung, Verfahren und Steuern richten sich nach dem Sitzland.',
            'Beim Parken von Geld entscheidet der Verfügbarkeitsbedarf, nicht der Nominalzins.',
          ],
        },
      ],
    },
  },
}
