import type { LearnTopic } from '@/data/learn/types'
import { calculatePension, pensionDefaults } from '@/lib/finance'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import {
  rentenBeispiel as BEISPIEL,
  rentenEinkommen as EINKOMMEN,
} from '@/lib/lernszenarien'

/*
  Die Rentenrechnung kommt aus derselben Funktion wie der Rentenrechner.

  Das ist hier keine Bequemlichkeit, sondern Pflicht: Wenn der Lerntext
  andere Zahlen nennt als der Rechner, der drei Klicks entfernt liegt,
  verliert beides seine Glaubwürdigkeit. Auch die Systemgrößen –
  Rentenwert, Durchschnittsentgelt, Beitragssätze – stehen an einer Stelle
  in `lib/finance.ts` und werden hier nur gelesen.

  Alle diese Werte ändern sich jährlich. Der Text sagt das ausdrücklich und
  verweist für die verbindliche Auskunft auf die Rentenversicherung.
*/
const rechnung = calculatePension(BEISPIEL)

/** Wie viele Punkte verschiedene Einkommen im Jahr bringen. */
const punktereihe = EINKOMMEN.map((brutto) => ({
  brutto,
  punkte: calculatePension({ ...BEISPIEL, grossAnnualIncome: brutto }).pointsPerYear,
}))

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt die drei Säulen und die Rentenformel und
 * rechnet ein Beispiel durch. Fortgeschritten führt von brutto zu netto und
 * behandelt die betriebliche Vorsorge. Profi geht auf Rentenbeginn,
 * Abschläge, freiwillige Beiträge und die Frage nach der Lücke ein.
 *
 * ## Zum Rechtsstand
 *
 * Rentenwert, Durchschnittsentgelt, Beitragsbemessungsgrenze und der
 * steuerpflichtige Anteil ändern sich jährlich. Sie stehen deshalb als
 * gepflegte Vorbelegungen in `lib/finance.ts` und werden hier gelesen, nicht
 * wiederholt. Verbindlich ist ausschließlich die Auskunft der Deutschen
 * Rentenversicherung.
 */
export const rente: LearnTopic = {
  slug: 'rente',
  title: 'Rente',
  headline: 'Was am Ende tatsächlich ankommt',
  metaTitle: 'Rente verstehen: Säulen, Rentenpunkte, Netto',
  metaDescription:
    'Wie die gesetzliche Rente rechnet, was Rentenpunkte bedeuten, wie die Renteninformation zu lesen ist und was von der Bruttorente tatsächlich übrig bleibt.',
  lead: 'Die Zahl auf der Renteninformation ist brutto, in heutiger Kaufkraft und unter Annahmen. Drei Gründe, warum sie höher aussieht, als sie ist.',
  overview: [
    'Die gesetzliche Rente ist ein Umlageverfahren: Die Beiträge von heute zahlen die Renten von heute. Angespart wird nichts – was du erwirbst, ist ein Anspruch, kein Guthaben.',
    'Wie hoch dieser Anspruch ausfällt, ergibt sich aus einer erstaunlich einfachen Formel. Was davon nach Kranken-, Pflegeversicherung und Steuern übrig bleibt, ist die Zahl, mit der sich planen lässt – und sie steht auf keiner Renteninformation.',
    'Die Stufen führen von den drei Säulen und der Rentenformel über die Rechnung von brutto zu netto und die betriebliche Vorsorge bis zu Rentenbeginn, Abschlägen und der Frage, wie groß die eigene Lücke tatsächlich ist.',
  ],
  keywords: [
    'Rente',
    'Rentenpunkte',
    'Renteninformation',
    'Betriebsrente',
    'Rentenlücke',
    'Umlageverfahren',
  ],
  related: [
    'sparerpauschbetrag',
    'portfolio-aufbau',
    'inflation',
    'budget-und-sparquote',
  ],
  calculators: ['/rechner/rentenrechner', '/rechner/rentenluecke'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Gesetzliche Rente einfach erklärt: Punkte und Formel',
      metaDescription:
        'Wie das Umlageverfahren funktioniert, was Rentenpunkte sind, wie die Rentenformel rechnet und wie die Renteninformation zu lesen ist.',
      title: 'Wie die gesetzliche Rente rechnet',
      lead: 'Die drei Säulen, die Formel mit zwei Faktoren – und warum die Zahl auf der Renteninformation nicht die Zahl ist, mit der man plant.',
      readingMinutes: 9,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Die deutsche Alterssicherung steht auf drei Säulen, und keine davon trägt allein. Die gesetzliche Rente ist die breiteste, aber sie ist ausdrücklich nicht darauf ausgelegt, den Lebensstandard zu erhalten – das war sie zuletzt vor Jahrzehnten.',
        },
        {
          type: 'table',
          caption: 'Die drei Säulen',
          head: ['Säule', 'Wer zahlt', 'Wer trägt das Risiko'],
          rows: [
            [
              'Gesetzliche Rente',
              'Arbeitnehmer und Arbeitgeber je zur Hälfte, verpflichtend',
              'Die Gemeinschaft – die Höhe hängt an der politischen Entwicklung',
            ],
            [
              'Betriebliche Vorsorge',
              'Arbeitgeber, oft ergänzt durch Entgeltumwandlung des Arbeitnehmers',
              'Je nach Durchführungsweg der Arbeitgeber oder der Arbeitnehmer',
            ],
            [
              'Private Vorsorge',
              'Du selbst',
              'Du selbst – dafür bestimmst du auch die Anlage',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Das Umlageverfahren in einem Satz',
          items: [
            'Deine Beiträge werden nicht angelegt. Sie werden im selben Monat an die heutigen Rentner ausgezahlt.',
            'Was du dafür bekommst, ist ein **Anspruch** gegen das System, kein Guthaben auf einem Konto. Es gibt keinen Topf, aus dem später deine Rente käme.',
            'Daraus folgt die bekannte Abhängigkeit: Die Höhe künftiger Renten hängt am Verhältnis von Beitragszahlern zu Rentnern – und damit an einer demografischen Entwicklung, die bereits feststeht.',
            'Daraus folgt aber auch etwas Positives: Die Rente ist inflationsgebunden. Sie wird an die Lohnentwicklung angepasst und verliert damit nicht wie ein fester Betrag an Kaufkraft.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Rentenpunkte',
        },
        {
          type: 'paragraph',
          text: `Die Rechnung ist einfacher, als ihr Ruf vermuten lässt. Wer in einem Jahr genau das Durchschnittsentgelt aller Versicherten verdient – derzeit rund ${formatCurrencyRounded(pensionDefaults.averageIncome)} –, erhält genau **einen Rentenpunkt**. Wer die Hälfte verdient, bekommt einen halben; wer das Doppelte verdient, zwei. Nach oben begrenzt die Beitragsbemessungsgrenze.`,
        },
        {
          type: 'table',
          caption: 'Rentenpunkte je Beitragsjahr',
          head: ['Bruttojahreseinkommen', 'Punkte im Jahr'],
          rows: punktereihe.map((zeile) => [
            formatCurrencyRounded(zeile.brutto),
            formatNumber(zeile.punkte, 2),
          ]),
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Rentenformel',
          items: [
            `Gesammelte Punkte × aktueller Rentenwert = monatliche Bruttorente. Der Rentenwert liegt derzeit bei rund ${formatCurrencyRounded(pensionDefaults.pointValue)} je Punkt und wird jährlich angepasst.`,
            'Ein Beispiel: Wer 40 Jahre lang exakt durchschnittlich verdient hat, sammelt 40 Punkte – das ist die sogenannte Standardrente, und sie ist ein statistischer Bezugswert, kein typischer Lebenslauf.',
            'Für den Anspruch überhaupt sind mindestens fünf Beitragsjahre nötig. Wer darunter bleibt, bekommt keine Rente – kann sich die Beiträge aber unter Umständen erstatten lassen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Ein durchgerechnetes Beispiel',
        },
        {
          type: 'paragraph',
          text: `Jemand verdient ${formatCurrencyRounded(BEISPIEL.grossAnnualIncome)} brutto im Jahr, hat ${BEISPIEL.yearsWorked} Beitragsjahre hinter sich und noch ${BEISPIEL.yearsRemaining} vor sich. Bleibt das Einkommen so, ergibt sich:`,
        },
        {
          type: 'table',
          caption: 'Von den Punkten zur Nettorente',
          head: ['Größe', 'Wert'],
          rows: [
            ['Punkte je Jahr', formatNumber(rechnung.pointsPerYear, 2)],
            [
              // Nicht „40 Jahre“ tippen: Die Zahl folgt aus dem Beispiel und
              // wäre bei jeder Änderung daran still falsch geworden.
              `Punkte insgesamt nach ${BEISPIEL.yearsWorked + BEISPIEL.yearsRemaining} Jahren`,
              formatNumber(rechnung.totalPoints, 1),
            ],
            [
              'Bruttorente im Monat',
              formatCurrencyRounded(rechnung.grossStatutoryMonthly),
            ],
            [
              '− Kranken- und Pflegeversicherung',
              `− ${formatCurrencyRounded(rechnung.healthDeduction)}`,
            ],
            ['− geschätzte Steuer', `− ${formatCurrencyRounded(rechnung.taxDeduction)}`],
            [
              '= Nettorente im Monat',
              formatCurrencyRounded(rechnung.netStatutoryMonthly),
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Drei Dinge, die diese Zahl relativieren',
          items: [
            `Die Nettorente entspricht ${formatPercent(rechnung.replacementRatePercent, 0)} des heutigen Bruttoeinkommens. Das ist die Größe, um die es geht – nicht der Bruttobetrag.`,
            '**Die Renteninformation nennt brutto.** Der Betrag darauf sieht deutlich besser aus als das, was ankommt. Kranken- und Pflegeversicherung sowie Steuern fehlen dort vollständig.',
            '**Sie ist in heutiger Kaufkraft ausgedrückt** – das ist korrekt und hilfreich, wird aber oft mit dem künftigen Nominalbetrag verwechselt.',
            '**Sie unterstellt, dass es so weitergeht.** Die Hochrechnung schreibt das bisherige Einkommen fort. Teilzeit, Elternzeit, Arbeitslosigkeit oder ein Wechsel in die Selbstständigkeit sind darin nicht enthalten.',
          ],
        },
        {
          type: 'figure',
          figure: 'rente-luecke',
        },
        {
          type: 'paragraph',
          text: 'Die Rechnung oben ist bewusst vereinfacht: konstantes Einkommen, konstanter Rentenwert, keine Kindererziehungszeiten, keine Abschläge. Sie liefert eine Größenordnung, keine Zusage. Verbindlich ist ausschließlich die Auskunft der Deutschen Rentenversicherung – und die ist kostenlos.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Im Umlageverfahren wird nichts angespart – du erwirbst einen Anspruch, kein Guthaben.',
            'Ein Rentenpunkt entspricht einem Jahr mit Durchschnittsverdienst.',
            'Punkte mal Rentenwert ergibt die Bruttorente – netto bleibt deutlich weniger.',
            'Die Renteninformation nennt brutto und unterstellt, dass alles so weitergeht.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Von brutto zu netto und die betriebliche Vorsorge',
      metaDescription:
        'Welche Abzüge auf die Rente anfallen, wie die nachgelagerte Besteuerung funktioniert und wann sich eine Betriebsrente rechnet.',
      title: 'Netto rechnen und die zweite Säule',
      lead: 'Was von der Bruttorente abgeht, wie der Rentenfreibetrag funktioniert – und wann Entgeltumwandlung tatsächlich lohnt.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Die zwei Abzüge',
        },
        {
          type: 'list',
          items: [
            `**Kranken- und Pflegeversicherung.** Auf gesetzliche Renten fallen Beiträge an – derzeit in der Größenordnung von ${formatPercent(pensionDefaults.healthInsurancePercent, 1)} inklusive Zusatzbeitrag und Pflegeversicherung. Bei Pflichtversicherten in der Krankenversicherung der Rentner trägt die Rentenversicherung einen Teil; freiwillig Versicherte zahlen mehr und auch auf weitere Einkünfte.`,
            '**Steuern.** Renten werden **nachgelagert** besteuert: Die Beiträge waren im Erwerbsleben zunehmend steuerfrei, dafür ist die Rente zunehmend steuerpflichtig. Der steuerpflichtige Anteil hängt am Jahr des Rentenbeginns und steigt für spätere Jahrgänge.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Der Rentenfreibetrag – ein oft missverstandener Punkt',
          items: [
            'Im ersten vollen Rentenjahr wird der steuerfreie Anteil **als Eurobetrag** festgeschrieben. Dieser Betrag bleibt dann lebenslang unverändert.',
            'Jede spätere Rentenerhöhung ist damit **vollständig steuerpflichtig** – der Freibetrag wächst nicht mit.',
            'Die Folge ist eine langsam steigende Steuerlast im Ruhestand, ohne dass sich am Steuerrecht etwas ändern müsste. Wer nur mit dem Prozentsatz des ersten Jahres rechnet, plant zu optimistisch.',
            'Ob überhaupt Steuer anfällt, hängt am Gesamteinkommen. Bei einer alleinstehenden Person mit ausschließlich gesetzlicher Rente in üblicher Höhe bleibt oft wenig oder nichts – sobald Betriebsrente, private Rente oder Mieteinnahmen hinzukommen, ändert sich das.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die betriebliche Altersversorgung',
        },
        {
          type: 'paragraph',
          text: 'Die zweite Säule kennt fünf Durchführungswege – Direktzusage, Unterstützungskasse, Pensionskasse, Pensionsfonds und Direktversicherung. Für die Entscheidung sind zwei Fragen wichtiger als der Name: **Wer zahlt ein, und wer trägt das Anlagerisiko?**',
        },
        {
          type: 'table',
          caption: 'Die Entgeltumwandlung im Zeitverlauf',
          head: ['Phase', 'Wirkung'],
          rows: [
            [
              'Einzahlung',
              'Der Beitrag geht vom Bruttogehalt ab: keine Steuer, keine Sozialabgaben. Der Nettoverzicht ist deutlich kleiner als der eingezahlte Betrag',
            ],
            [
              'Nebenwirkung heute',
              'Weniger Bruttoeinkommen bedeutet weniger Rentenpunkte – die gesetzliche Rente sinkt entsprechend',
            ],
            [
              'Auszahlung',
              'Die Betriebsrente ist voll steuerpflichtig, und in der Krankenversicherung der Rentner fallen Beiträge an – oberhalb eines Freibetrags',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Wann sie sich rechnet – und wann nicht',
          items: [
            '**Sie rechnet sich, wenn der Arbeitgeber deutlich zuschießt.** Ein Zuschuss ist eine sofortige, sichere Rendite, die keine Anlage erreicht. Seit einigen Jahren ist ein Mindestzuschuss bei Entgeltumwandlung ohnehin vorgeschrieben.',
            '**Sie rechnet sich schlechter ohne nennenswerten Zuschuss.** Dem Steuervorteil heute stehen die volle Steuer- und Beitragspflicht später gegenüber – der Vorteil schrumpft auf die Differenz der Steuersätze und die gesparten Sozialabgaben, abzüglich der verlorenen Rentenpunkte.',
            '**Die Kosten des Produkts entscheiden mit.** Eine Direktversicherung mit hohen Abschluss- und Verwaltungskosten kann den gesamten steuerlichen Vorteil aufzehren. Diese Kosten stehen im Vertrag und sind selten prominent.',
            '**Beim Jobwechsel** ist die Frage der Übertragbarkeit zu klären. Zusagen sind nach einer Frist unverfallbar, aber nicht jeder Vertrag lässt sich mitnehmen – beitragsfrei gestellte Verträge laufen mit weiterlaufenden Kosten leer.',
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
            'Auf die gesetzliche Rente fallen Kranken- und Pflegeversicherungsbeiträge sowie Steuern an.',
            'Der Rentenfreibetrag wird einmal als Eurobetrag festgeschrieben und wächst nicht mit.',
            'Entgeltumwandlung senkt heute die Abgaben und morgen die gesetzliche Rente.',
            'Ohne nennenswerten Arbeitgeberzuschuss ist die Rechnung deutlich enger.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Rentenbeginn, Abschläge und die eigene Lücke',
      metaDescription:
        'Wie Abschläge und Zuschläge beim Rentenbeginn rechnen, wann sich freiwillige Beiträge lohnen und wie sich die tatsächliche Versorgungslücke ermitteln lässt.',
      title: 'Rentenbeginn, Ausgleich und Lücke',
      lead: 'Was ein früherer Rentenbeginn dauerhaft kostet, wann sich ein Ausgleich rechnet – und wie man die eigene Lücke ehrlich ermittelt.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Früher oder später in Rente',
        },
        {
          type: 'paragraph',
          text: 'Der Rentenbeginn ist die folgenreichste Einzelentscheidung dieses Themas, weil ihre Wirkung **dauerhaft** ist. Ein Abschlag gilt nicht bis zur Regelaltersgrenze, sondern lebenslang – und er wirkt auch auf spätere Rentenerhöhungen und auf die Hinterbliebenenrente.',
        },
        {
          type: 'list',
          items: [
            '**Vorzeitiger Bezug** ist unter bestimmten Voraussetzungen möglich und kostet einen Abschlag von 0,3 Prozent je vorgezogenem Monat – also 3,6 Prozent im Jahr. Wer drei Jahre früher geht, verliert dauerhaft rund elf Prozent.',
            '**Aufschub** über die Regelaltersgrenze hinaus bringt einen Zuschlag von 0,5 Prozent je Monat, also sechs Prozent im Jahr – zusätzlich zu den weiter erworbenen Punkten, wenn man weiterarbeitet.',
            '**Die Amortisationsrechnung** ist die naheliegende Reaktion: Ab welchem Alter hat man die früher bezogenen Beträge wieder eingeholt? Diese Schwelle liegt typischerweise deutlich über der durchschnittlichen Lebenserwartung ab Rentenbeginn – wer sehr lange lebt, fährt mit dem späteren Bezug besser.',
            '**Was die Rechnung nicht enthält:** Gesundheit, die Möglichkeit, überhaupt weiterzuarbeiten, und der Wert von Jahren, in denen man gesund ist. Die Amortisationsrechnung beantwortet eine finanzielle Frage, nicht die eigentliche.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Abschläge ausgleichen',
          items: [
            'Abschläge lassen sich durch eine **Sonderzahlung** an die Rentenversicherung ausgleichen – möglich ab einem bestimmten Alter und in Teilbeträgen.',
            'Der Reiz liegt in zwei Punkten: Die Zahlung ist im Jahr der Leistung weitgehend als Sonderausgabe absetzbar, und der erworbene Anspruch ist lebenslang, inflationsgebunden und ohne Kursrisiko.',
            'Der Preis: Das Geld ist unwiderruflich weg und im Todesfall weitgehend verloren – ein Erbe gibt es nicht, nur gegebenenfalls eine Hinterbliebenenrente.',
            'Ob es sich lohnt, hängt am Steuersatz heute, an der erwarteten Lebensdauer und an der Alternative. Wer die Sicherheit einer lebenslangen Zahlung sucht, findet hier eine der wenigen ehrlich kalkulierten – aber es ist eine Wette auf ein langes Leben.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die eigene Lücke ehrlich ermitteln',
        },
        {
          type: 'paragraph',
          text: 'Die verbreitete Faustregel – siebzig oder achtzig Prozent des letzten Nettoeinkommens – ist ein Startpunkt und wird meist falsch angewendet. Sie unterstellt, dass sich die Ausgaben proportional entwickeln. Tatsächlich verändern sie sich in beide Richtungen, und die Verschiebungen sind erheblich.',
        },
        {
          type: 'table',
          caption: 'Was sich im Ruhestand ändert',
          head: ['Richtung', 'Posten'],
          rows: [
            [
              'Fällt weg oder sinkt',
              'Beiträge zur Rentenversicherung und Arbeitslosenversicherung, Fahrtkosten, berufsbedingte Ausgaben, meist die Unterstützung von Kindern – häufig auch der Immobilienkredit',
            ],
            [
              'Kommt hinzu oder steigt',
              'Gesundheit und Pflege, Reisen und Freizeit in den ersten Jahren, gegebenenfalls Umbauten – und die volle Zeit, die gefüllt werden will',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Der belastbarere Weg',
          items: [
            '**Von den Ausgaben her rechnen, nicht vom Einkommen.** Das aktuelle Haushaltsbudget nehmen, wegfallende Posten streichen, hinzukommende schätzen. Das dauert eine Stunde und ist jeder Faustregel überlegen.',
            '**Alles in heutiger Kaufkraft rechnen.** Dann muss man keine Inflationsannahme treffen – aber auch die Rentenerhöhungen nicht mitrechnen. Beides bleibt konsistent.',
            '**Alle Quellen zusammenzählen:** gesetzliche Rente, Betriebsrente, private Verträge, Mieteinnahmen, Entnahmen aus dem Depot. Erst die Summe ist mit dem Bedarf vergleichbar.',
            '**Die Lücke in eine Sparrate umrechnen.** Erst dann wird aus einer beunruhigenden Zahl eine handhabbare – und meist ist die nötige Rate kleiner, als die Lücke vermuten ließ, wenn genug Zeit bleibt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was die Systemrisiken angeht',
        },
        {
          type: 'list',
          items: [
            '**Die Demografie steht fest.** Die Menschen, die in dreißig Jahren Beiträge zahlen, sind bereits geboren. Das Verhältnis von Beitragszahlern zu Rentnern verschlechtert sich, und daran ändert keine Reform etwas.',
            '**Politisch verstellbar sind drei Schrauben:** Beitragssatz, Rentenniveau und Renteneintrittsalter. Alle drei wurden in der Vergangenheit bewegt, und alle drei werden es wieder – die Frage ist welche, nicht ob.',
            '**Was daraus folgt, ist keine Panik, sondern eine Planungsannahme:** Die gesetzliche Rente wird kommen, aber ihr Anteil am Lebensstandard wird für spätere Jahrgänge kleiner sein als für heutige. Wer sie mit einem Abschlag ansetzt, plant vorsichtig statt pessimistisch.',
            '**Und ein Vorteil bleibt bestehen:** Die gesetzliche Rente ist lebenslang und inflationsgebunden. Beides zusammen bekommt man am privaten Markt nur teuer – dieser Teil der Absicherung ist mehr wert, als seine Höhe vermuten lässt.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Keine Steuer- oder Rentenberatung',
          items: [
            'Rentenwert, Beitragssätze, steuerpflichtiger Anteil und die Voraussetzungen für einen vorzeitigen Bezug ändern sich regelmäßig.',
            'Verbindliche Auskünfte erteilt ausschließlich die Deutsche Rentenversicherung – kostenlos, und mit einer Kontenklärung, die sich in jedem Fall lohnt.',
            'Für die steuerliche Seite und für Entscheidungen über Sonderzahlungen gehört eine Beratung mit Zulassung dazu.',
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
            'Abschläge beim vorzeitigen Bezug gelten lebenslang – 0,3 Prozent je Monat.',
            'Die Amortisationsschwelle liegt meist über der durchschnittlichen Lebenserwartung ab Rentenbeginn.',
            'Die Lücke wird von den Ausgaben her ermittelt, nicht über eine Prozentregel.',
            'Lebenslang und inflationsgebunden – dieser Teil ist mehr wert, als seine Höhe vermuten lässt.',
          ],
        },
      ],
    },
  },
}
