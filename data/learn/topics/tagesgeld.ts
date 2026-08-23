import type { LearnTopic } from '@/data/learn/types'
import { inflationsbeispiel, realzinsbeispiel } from '@/lib/inflations-beispiele'
import { formatPercent } from '@/lib/format'

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner klärt Funktionsweise, Zweck und Einlagensicherung.
 * Fortgeschritten behandelt die Zinsmechanik, Aktionsangebote und Steuern. Profi
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
    'Die Stufen behandeln Funktionsweise und Einlagensicherung, dann Zinsmechanik, Aktionsangebote und Steuern, schließlich Bankbonität, Auslandseinlagen und die reale Rendite.',
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
      readingMinutes: 10,
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
          text: 'Wie der Zins tatsächlich ankommt',
        },
        {
          type: 'paragraph',
          text: 'Ein Zinssatz wird immer **pro Jahr** angegeben, auch wenn das Geld nur zwei Monate liegt. Zwei Prozent auf 10.000 Euro sind über zwei Monate also nicht 200 Euro, sondern rund 33. Gutgeschrieben wird meist zum Quartals- oder Jahresende; ab der Gutschrift verzinst sich der Zins mit. Bei Tagesgeld ist dieser Effekt klein – über wenige Jahre und bei niedrigen Sätzen fällt er kaum ins Gewicht –, aber er ist der Grund, warum manche Bank mit „monatlicher Zinsgutschrift“ wirbt.',
        },
        {
          type: 'paragraph',
          text: 'Wichtiger für den Alltag ist das **Referenzkonto**. Ein Tagesgeldkonto ist in aller Regel kein Konto, von dem aus man überweisen kann: Geld kommt hinein und geht wieder heraus – aber nur auf genau ein hinterlegtes Girokonto. Das ist ein Sicherheitsmerkmal und keine Schikane. Wer es nicht weiß, wundert sich im Ernstfall, dass er nicht direkt vom Tagesgeld bezahlen kann.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Der Lockzins und was danach kommt',
          items: [
            'Viele Spitzenangebote in Vergleichen gelten **nur für Neukunden** und nur für drei bis zwölf Monate. Danach fällt der Satz auf den Bestandskundenzins zurück, und der liegt oft deutlich unter dem Marktdurchschnitt.',
            'Manche Angebote begrenzen zusätzlich die verzinste Summe – der beworbene Satz gilt dann etwa nur bis 50.000 Euro, der Rest liegt fast unverzinst daneben.',
            'Beides steht in den Bedingungen, nicht im Werbebanner. Die zwei Fragen an jedes Angebot lauten deshalb: Wie lange gilt der Satz, und für welchen Betrag?',
            'Hinterherzuwechseln lohnt sich – aber es ist Arbeit. Wer sie nicht machen will, nimmt lieber ein dauerhaft solides Angebot als das beste Aktionsangebot.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Steuern: was von den Zinsen bleibt',
        },
        {
          type: 'paragraph',
          text: 'Zinsen sind Kapitalerträge und damit steuerpflichtig. Die Bank behält 25 Prozent Abgeltungsteuer plus Solidaritätszuschlag – und, wenn du kirchensteuerpflichtig bist, die Kirchensteuer – automatisch ein und führt sie ab. Du musst dafür nichts tun; der Betrag ist einfach schon weg, wenn die Gutschrift kommt.',
        },
        {
          type: 'paragraph',
          text: 'Was du tun solltest, ist der **Freistellungsauftrag**. Bis zum Sparerpauschbetrag bleiben Kapitalerträge steuerfrei, aber nur, wenn die Bank davon weiß. Ohne Auftrag zieht sie ab dem ersten Euro ab – zurückholen lässt sich das später über die Steuererklärung, was funktioniert, aber Aufwand ist. Der Auftrag ist in jeder Banking-App in zwei Minuten erteilt und lässt sich auf mehrere Banken aufteilen.',
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
          text: 'Woran du erkennst, ob ein Angebot fair ist',
        },
        {
          type: 'paragraph',
          text: 'Es gibt keinen „richtigen“ Tagesgeldzins – es gibt einen, der zum Zinsniveau passt. Der Maßstab dafür ist der **Einlagenzins der Europäischen Zentralbank**: der Satz, zu dem Banken selbst Geld bei der Notenbank parken können. Eine Bank, die dir deutlich weniger zahlt, als sie risikolos bei der EZB bekommt, verdient an deiner Bequemlichkeit.',
        },
        {
          type: 'list',
          items: [
            '**Deutlich über dem Einlagenzins:** fast immer ein befristetes Neukundenangebot. Nachsehen, wie lange.',
            '**In der Nähe:** ein normales, faires Angebot – das ist die Größenordnung, in der man landen sollte.',
            '**Deutlich darunter, oft nahe null:** typisch für Hausbanken und Sparkassen mit vielen Filialen. Das Geld liegt dort sicher, aber es arbeitet nicht.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Fällt der Leitzins, fällt dein Tagesgeldzins mit – meist innerhalb weniger Wochen und ohne Ankündigung, denn „variabel“ heißt genau das. Steigt er, dauert es bei vielen Banken erstaunlich viel länger. Diese Asymmetrie ist kein Zufall und der beste Grund, einmal im Jahr nachzusehen, was auf dem eigenen Konto eigentlich noch gezahlt wird.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Der Zins ist variabel – die Bank darf ihn jederzeit ändern, und nach unten tut sie es schnell.',
            'Zwei gute Zwecke: Notgroschen und Geld mit absehbarem Termin.',
            'Nominal sicher heißt nicht real sicher; die Inflation zieht jedes Jahr ab.',
            'Der Schutz gilt je Person und Institut, nicht je Konto und nicht je Marke.',
            'Freistellungsauftrag erteilen, sonst zieht die Bank ab dem ersten Euro Steuer ab.',
            'Beim Vergleich zwei Fragen stellen: Wie lange gilt der Satz, und bis zu welchem Betrag?',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Tagesgeld fortgeschritten: Zinsmechanik und Steuern',
      metaDescription:
        'Wie der Einlagenzins der Notenbank auf Tagesgeld durchschlägt, wie Aktionszinsen aufgebaut sind und wie Zinserträge in Deutschland besteuert werden.',
      title: 'Zinsmechanik, Angebote und Steuern',
      lead: 'Woher der Zins kommt, wie Aktionsangebote aufgebaut sind und welche Zahl nach Steuern übrig bleibt.',
      readingMinutes: 15,
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
          text: 'Deshalb bewegt sich der Tagesgeldzins des Marktes ungefähr mit dem Einlagenzins – aber nicht symmetrisch. Sinkt der Leitzins, sinken die Tagesgeldzinsen meist binnen Wochen. Steigt er, dauert die Weitergabe oft Monate. In der Praxis reagieren viele Kunden auf Zinsänderungen erst verzögert – entsprechend träge folgt der Marktdurchschnitt.',
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
          text: 'Wie viel gehört überhaupt aufs Tagesgeld',
        },
        {
          type: 'paragraph',
          text: 'Tagesgeld hat genau eine Aufgabe: verfügbar sein. Alles, was darüber hinaus dort liegt, erfüllt keine Aufgabe mehr – es verliert nur langsamer an Kaufkraft als auf dem Girokonto. Die sinnvolle Menge ergibt sich deshalb nicht aus dem Zins, sondern aus dem Zweck.',
        },
        {
          type: 'list',
          items: [
            '**Der Notgroschen.** Drei bis sechs Monatsausgaben, je nach Sicherheit des Einkommens. Er gehört ausschließlich hierher, weil er jederzeit vollständig verfügbar sein muss.',
            '**Absehbare Ausgaben der nächsten zwei bis drei Jahre.** Ein Auto, eine Renovierung, eine Kaution. Was in diesem Zeitraum gebraucht wird, verträgt keine Schwankung – unabhängig davon, wie gut die Aussichten am Aktienmarkt sind.',
            '**Der Puffer für unregelmäßige Jahreskosten**, wenn er nicht ohnehin auf einem eigenen Konto liegt.',
            '**Alles andere gehört nicht hierher.** Wer über Jahre größere Beträge auf Tagesgeld hält, hat keine sichere Anlage, sondern eine mit einem anderen Risiko: dem, das nie auf dem Auszug erscheint.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Realzins ist die einzige Zahl, die zählt',
        },
        {
          type: 'paragraph',
          text: 'Nominal steigt ein Guthaben immer. Ob es **real** wächst, entscheidet der Abstand zwischen Zins und Teuerung – und dieser Abstand war in Deutschland über lange Strecken negativ, auch in Jahren mit auffällig hohen Zinssätzen. Ein Zins von 4 Prozent bei 6 Prozent Teuerung ist ein Verlust, ein Zins von 1 Prozent bei 0 Prozent Teuerung ein Gewinn.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Rechnung, die dazugehört',
          items: [
            '**Erst die Steuer, dann die Teuerung.** Die Abgeltungsteuer greift auf den nominalen Zins zu. Aus 4 Prozent werden nach Steuer knapp 3 – und erst davon wird die Teuerung abgezogen.',
            '**Deshalb ist die Reihenfolge nicht beliebig.** Wer die Teuerung zuerst abzieht und dann versteuert, rechnet sich das Ergebnis schön: Der Staat besteuert auch den Teil des Zinses, der nur den Kaufkraftverlust ausgleicht.',
            '**Der Sparerpauschbetrag ändert das Bild bei kleinen Beträgen deutlich.** Solange die Zinsen darunter bleiben, fällt die Steuer weg – und der Realzins verbessert sich um genau den Steueranteil.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum Lockangebote so verlässlich funktionieren',
        },
        {
          type: 'paragraph',
          text: 'Ein Neukundenzins für sechs Monate ist keine Großzügigkeit, sondern eine Rechnung: Die Bank zahlt einmalig einen Aufschlag und behält dafür einen Kunden, der danach mit hoher Wahrscheinlichkeit bleibt. Sie kalkuliert also mit der Trägheit – und sie behält recht.',
        },
        {
          type: 'list',
          items: [
            '**Der Aktionszins gilt für einen befristeten Zeitraum und oft nur bis zu einer Obergrenze.** Was darüber liegt, wird zum Grundzins verzinst, der deutlich niedriger sein kann.',
            '**Nach Ablauf fällt der Zins ohne Mitteilungspflicht.** Tagesgeld ist täglich änderbar; eine Benachrichtigung ist üblich, aber nicht überall selbstverständlich.',
            '**Der Vergleich lohnt sich nur mit dem Zins, der nach der Aktion gilt.** Ein Angebot mit hohem Lockzins und schwachem Grundzins ist über zwei Jahre gerechnet oft schlechter als ein durchgehend mittleres.',
            '**Ein Wechsel kostet Zeit, kein Geld.** Wer ihn nicht macht, zahlt dafür mit dem Zinsunterschied – das ist die einzige Stelle beim Tagesgeld, an der eigenes Zutun messbar etwas bringt.',
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
            'Der Einlagenzins der Notenbank ist die Obergrenze dessen, was Banken zahlen können.',
            'Senkungen werden schnell weitergegeben, Erhöhungen langsam.',
            'Vier Fragen an jedes Angebot: für wen, wie lange, bis zu welchem Betrag, wie oft gutgeschrieben.',
            'Der Freistellungsauftrag ist teilbar, aber insgesamt nur einmal ausschöpfbar.',
            'Tagesgeld hat eine Aufgabe: verfügbar sein. Was darüber hinaus dort liegt, erfüllt keine.',
            'Erst Steuer, dann Teuerung – der Staat besteuert auch den Teil des Zinses, der nur den Kaufkraftverlust ausgleicht.',
            'Ein Aktionszins ist eine Wette der Bank auf die eigene Trägheit des Kunden.',
            'Verglichen wird der Zins nach der Aktion, nicht der während.',
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
