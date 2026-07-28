import type { LearnTopic } from '@/data/learn/types'
import { formatDate, formatPercent } from '@/lib/format'
import { maxRueckgang } from '@/lib/kennzahlen'
import { getLiveSeries } from '@/lib/market-live'

/*
  Ein Teil dieses Themas rechnet mit den eigenen Kursdaten.

  Die historischen Crashs von 1929 bis 2008 lassen sich hier nicht
  nachrechnen – die Momentaufnahme reicht fünf Jahre zurück. Was sich
  nachrechnen lässt, ist der größte Rückgang **in diesem Zeitraum**, und
  genau das ist die lehrreichste Zahl für jemanden, der gerade anfängt:
  Auch in einer Phase ohne historische Katastrophe gab es einen Rückgang
  dieser Größe. Er stand in keiner Rückschau, weil er längst aufgeholt ist.

  Die Zahlen zu den großen Crashs stehen dagegen als Tabelle mit
  Größenordnungen – ohne Nachkommastellen, weil je nach Index und
  Berechnungsart andere Werte kursieren und eine Scheingenauigkeit hier
  nichts hinzufügt.
*/
const INDEX = 'dax'
const reihe = getLiveSeries(INDEX)
const rueckgang = reihe ? maxRueckgang(reihe.daily) : null

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner stellt die großen Ereignisse nebeneinander und
 * zieht die praktische Folgerung. Fortgeschritten erklärt die Mechanik von
 * Blasen und Abstürzen. Profi behandelt Ansteckung, die Rolle der
 * Reaktionen und was sich daraus für ein Depot ableiten lässt.
 *
 * ## Haltung
 *
 * Kein Katastrophenkabinett. Der Zweck ist, Rückgänge dieser Größe als
 * normalen Bestandteil des Anlegens erkennbar zu machen – nicht als
 * Ausnahme, auf die man sich vorbereiten könnte, indem man sie vorhersagt.
 */
export const groessteCrashes: LearnTopic = {
  slug: 'groesste-crashes',
  title: 'Größte Crashs',
  headline: 'Was sie gemeinsam hatten – und was nicht',
  metaTitle: 'Die größten Börsencrashs: Verlauf, Ursachen, Lehren',
  metaDescription:
    'Die großen Börseneinbrüche im Vergleich, was sie gemeinsam hatten, wie Blasen entstehen und was Anleger daraus tatsächlich mitnehmen können.',
  lead: 'Jeder Crash hatte einen anderen Auslöser und dieselbe Struktur. Das Muster ist lehrreich, der Zeitpunkt bleibt unvorhersehbar.',
  overview: [
    'Rückgänge von zwanzig Prozent und mehr sind keine Ausnahme, sondern ein wiederkehrender Bestandteil des Aktienmarkts. Wer über Jahrzehnte anlegt, erlebt mehrere davon.',
    'Die Auslöser waren jedes Mal verschieden – Spekulation, Technologie, Immobilienkredite, eine Pandemie. Der Ablauf ähnelte sich: wachsende Zuversicht, ein Auslöser, Zwangsverkäufe, dann eine Erholung von sehr unterschiedlicher Dauer.',
    'Die Stufen führen von den Ereignissen selbst über die Mechanik von Blasen und Abstürzen bis zu Ansteckungswegen, der Rolle der politischen Reaktion und dem, was sich daraus für ein Depot ableiten lässt.',
  ],
  keywords: [
    'Börsencrash',
    'Finanzkrise',
    'Blase',
    'Maximaler Rückgang',
    'Erholungsdauer',
  ],
  related: [
    'anlegerpsychologie',
    'wann-kaufen-verkaufen',
    'risiko-und-rendite',
    'portfolio-aufbau',
  ],
  symbols: [INDEX],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Die größten Börsencrashs im Überblick',
      metaDescription:
        'Welche großen Einbrüche es gab, wie lange die Erholung jeweils dauerte und was Anleger daraus praktisch mitnehmen können.',
      title: 'Die großen Einbrüche',
      lead: 'Fünf Ereignisse, ihr gemeinsames Muster – und die einzige Schlussfolgerung, die sich daraus ziehen lässt.',
      readingMinutes: 9,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Wer lange genug anlegt, erlebt mehrere große Rückgänge. Das ist keine Warnung, sondern eine Beschreibung: In der Geschichte der Aktienmärkte sind Einbrüche von zwanzig Prozent und mehr regelmäßige Ereignisse. Wer das vorher weiß, reagiert anders, als wenn es ihn überrascht.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Fünf Ereignisse im Vergleich',
        },
        {
          type: 'table',
          caption: 'Größenordnungen – je nach Index und Berechnung weichen die Zahlen ab',
          head: ['Ereignis', 'Auslöser', 'Ausmaß und Dauer'],
          rows: [
            [
              '1929 und die Folgejahre',
              'Spekulation auf Kredit, dann eine einbrechende Realwirtschaft',
              'Der schwerste Fall: rund 85 Prozent Rückgang über drei Jahre, die Erholung dauerte etwa ein Vierteljahrhundert',
            ],
            [
              '1987, Schwarzer Montag',
              'Kein klarer fundamentaler Anlass; automatisierte Absicherungsprogramme verstärkten den Fall',
              'Rund 20 Prozent an einem einzigen Tag – und binnen etwa zwei Jahren aufgeholt',
            ],
            [
              '2000 bis 2003, Dotcom',
              'Bewertungen von Technologiewerten ohne Gewinne',
              'Breite Indizes verloren rund die Hälfte, Technologieindizes fast vier Fünftel. Erholung über Jahre, bei Technologie über ein Jahrzehnt',
            ],
            [
              '2008, Finanzkrise',
              'Immobilienkredite, Verbriefungen und ein Bankensystem am Rand',
              'Rund 50 Prozent Rückgang, Erholung in einigen Jahren – begleitet von beispiellosen Notenbankeingriffen',
            ],
            [
              '2020, Pandemie',
              'Ein exogener Schock und weltweite Stilllegungen',
              'Rund ein Drittel Rückgang in wenigen Wochen – der schnellste Einbruch dieser Größe und die schnellste Erholung',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was auffällt, wenn man die letzte Spalte liest',
          items: [
            'Das Ausmaß sagt wenig über die Erholungsdauer. 1987 war der Tagesverlust dramatisch und nach zwei Jahren erledigt; 1929 dauerte es eine Generation.',
            'Der Unterschied lag nicht im Auslöser, sondern darin, was danach geschah: 1929 wurde die Geldmenge verknappt und der Handel eingeschränkt, 2020 flossen binnen Wochen Hilfen in beispiellosem Umfang.',
            'Wer die Dauer eines Rückgangs abschätzen will, muss also die politische Reaktion abschätzen – und das ist noch schwerer als den Rückgang selbst vorherzusagen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Das gemeinsame Muster',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Vorher: wachsende Zuversicht.** Kurse steigen über längere Zeit, Erklärungen dafür werden nachgeliefert, Vorsicht wirkt rückständig.',
            '**Der Auslöser.** Ein Ereignis lässt die Erwartungen kippen. Es ist oft klein im Verhältnis zur Reaktion – der Auslöser ist nicht die Ursache, sondern der Moment, in dem die Ursache sichtbar wird.',
            '**Die Verstärkung.** Wer auf Kredit gekauft hat, muss verkaufen. Diese Verkäufe drücken die Preise, was weitere Verkäufe erzwingt. Die Bewegung wird von der Mechanik getragen, nicht mehr von Einschätzungen.',
            '**Die Erholung.** Sie kam bisher immer – aber ihre Dauer schwankte zwischen Monaten und Jahrzehnten. Wer sie erleben will, muss dabei sein.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was in den eigenen Daten steht',
        },
        {
          type: 'paragraph',
          text: rueckgang
            ? `Man muss nicht bis 1929 zurückgehen. Die Kursdaten dieser Website reichen fünf Jahre zurück – eine Zeit ohne historische Katastrophe. Auch darin steckt ein Rückgang von ${formatPercent(rueckgang.prozent, 1)}, vom ${formatDate(rueckgang.von)} bis zum ${formatDate(rueckgang.bis)}.`
            : 'Die Kursdaten dieser Website reichen fünf Jahre zurück und enthalten ebenfalls einen deutlichen Rückgang.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum diese Zahl die lehrreichste ist',
          items: [
            'Sie stammt nicht aus einem Geschichtsbuch, sondern aus einem Zeitraum, den die meisten Leser selbst erlebt haben.',
            'In keiner Rückschau taucht sie als Ereignis auf, weil sie längst aufgeholt ist. Genau das ist der Punkt: Rückgänge dieser Größe gehören zum Normalbetrieb und tragen hinterher keinen Namen.',
            'Wer sie miterlebt hat, weiß, wie es sich anfühlte. Wer sie in der Tabelle sieht, sieht nur eine Zahl. Dieser Unterschied ist der Grund, warum jeder Krisenplan **vorher** aufgeschrieben gehört.',
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
            'Rückgänge von 20 Prozent und mehr sind normal, nicht außergewöhnlich.',
            'Das Ausmaß sagt wenig über die Erholungsdauer – die politische Reaktion sagt mehr.',
            'Wer verkauft hat, verpasste historisch den stärksten Teil der Erholung.',
            'Deshalb gilt: nur Geld anlegen, das lange liegen bleiben kann.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Wie Blasen entstehen und Abstürze sich verstärken',
      metaDescription:
        'Der typische Verlauf einer Blase, die Rolle von Kredit, Margin Calls und Liquiditätsspiralen sowie das Verhalten von Korrelationen im Einbruch.',
      title: 'Die Mechanik von Blase und Absturz',
      lead: 'Wie aus einer plausiblen Geschichte eine Blase wird – und warum der Absturz danach von der Mechanik getragen wird, nicht von Meinungen.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Der Verlauf einer Blase',
        },
        {
          type: 'paragraph',
          text: 'Blasen folgen einem Muster, das sich über Jahrhunderte kaum verändert hat. Bemerkenswert ist dabei nicht die Torheit der Beteiligten – der Ausgangspunkt ist fast immer richtig –, sondern wie zwangsläufig aus einer zutreffenden Beobachtung eine falsche Bewertung wird.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Ein realer Anlass.** Eine neue Technologie, ein neuer Markt, eine veränderte Zinslage. Die Eisenbahn, das Internet und die Digitalisierung haben die Welt tatsächlich verändert – der Kern der Geschichte stimmt.',
            '**Frühe Gewinne bestätigen.** Wer früh dabei war, hat recht behalten. Das zieht Aufmerksamkeit an und erzeugt die ersten Erfolgsgeschichten.',
            '**Kredit tritt hinzu.** In der Spätphase wird zunehmend fremdfinanziert gekauft. Das ist der entscheidende Verstärker – und zugleich der Grund, warum der spätere Rückgang so heftig ausfällt.',
            '**Die Bewertung löst sich vom Ertrag.** Kennzahlen werden ersetzt: durch Nutzerzahlen, Umsatzwachstum, Marktanteile. Wo kein Gewinn ist, wird die Bezugsgröße gewechselt, statt die Bewertung infrage zu stellen.',
            '**„Diesmal ist es anders.“** Der Satz taucht in jeder Blase auf und ist teilweise richtig – die Technologie **ist** neu. Falsch ist die Schlussfolgerung, dass deshalb jeder Preis gerechtfertigt sei.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum sich das nicht handeln lässt',
          items: [
            'Das Muster ist im Rückblick offensichtlich und im Verlauf nicht. Zu jedem Zeitpunkt gibt es plausible Argumente für die aktuelle Bewertung – sonst hätte sie sich nicht gebildet.',
            'Wer früh aussteigt, sieht die Kurse jahrelang weiter steigen. Wer auf Bestätigung wartet, ist zu spät. Beide Fehler sind teuer, und es gibt keinen dritten Weg.',
            'Der praktisch tragfähige Schluss ist deshalb kein Ausstiegssignal, sondern eine Frage an die eigene Aufteilung: Wie viel meines Vermögens hängt an dieser einen Geschichte?',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Warum der Absturz seine eigene Dynamik hat',
        },
        {
          type: 'paragraph',
          text: 'Ein Einbruch ist schneller als der vorangegangene Anstieg. Der Grund ist nicht Psychologie allein, sondern Zwang: Ein erheblicher Teil der Verkäufe in einem Crash geschieht nicht freiwillig.',
        },
        {
          type: 'table',
          caption: 'Vier Verstärker',
          head: ['Mechanismus', 'Wirkung'],
          rows: [
            [
              'Margin Calls',
              'Wer auf Kredit gekauft hat, muss Sicherheiten nachschießen oder wird glattgestellt. Verkauft wird nicht, weil man will, sondern weil man muss',
            ],
            [
              'Liquiditätsspirale',
              'Verkäufe drücken Preise, niedrigere Preise senken Beleihungswerte, das erzwingt weitere Verkäufe. Der Kreis schließt sich',
            ],
            [
              'Steigende Korrelationen',
              'Was sonst unabhängig lief, fällt gemeinsam. Wer Liquidität braucht, verkauft was sich verkaufen lässt – nicht was er loswerden will',
            ],
            [
              'Automatisierte Strategien',
              'Risikomodelle schreiben bei steigender Schwankung Positionsabbau vor. Viele Marktteilnehmer bekommen dasselbe Signal zur selben Zeit',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die unbequeme Folge für die Streuung',
          items: [
            'Streuung wirkt im Normalbetrieb zuverlässig und im Einbruch schlechter als erwartet. Das ist kein Versagen des Prinzips, sondern seine bekannte Grenze.',
            'Der Grund ist der Verkaufszwang: In einer Krise wird nicht nach Anlageklasse verkauft, sondern nach Verkäuflichkeit.',
            'Was trotzdem hilft, ist die Trennung nach **Zweck** statt nach Anlageklasse: Ein Notgroschen auf dem Tagesgeldkonto korreliert mit nichts, weil er nicht am Markt hängt. Das ist die einzige Streuung, die in jeder Krise gehalten hat.',
          ],
        },
        {
          type: 'paragraph',
          text: '**Handelsunterbrechungen** sind die institutionelle Antwort darauf. Fällt ein Index um einen festgelegten Prozentsatz, wird der Handel für einige Minuten ausgesetzt. Der Zweck ist nicht, den Kurs zu stützen, sondern die Rückkopplung zu unterbrechen und Zeit für die Bewertung von Informationen zu schaffen. Ob sie den Fall dämpfen oder nur verschieben, ist umstritten – dass sie Zwangsverkäufe entzerren, ist unstrittig.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Jede Blase beginnt mit einer zutreffenden Beobachtung – falsch wird erst der Preis.',
            'Kredit in der Spätphase ist der entscheidende Verstärker in beide Richtungen.',
            'Ein Großteil der Verkäufe im Crash geschieht unfreiwillig.',
            'Korrelationen steigen genau dann, wenn Streuung gebraucht würde.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Crashs: Ansteckung, Reaktion und Konsequenzen',
      metaDescription:
        'Wie sich Krisen vom Finanzmarkt in die Realwirtschaft übertragen, welche Rolle das Bankensystem spielt und wie sich die politische Reaktion auf die Erholungsdauer auswirkte.',
      title: 'Ansteckung, Reaktion, Konsequenz',
      lead: 'Warum manche Einbrüche folgenlos bleiben und andere ein Jahrzehnt kosten – und was daraus für ein Depot folgt.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Der Unterschied zwischen Kurssturz und Krise',
        },
        {
          type: 'paragraph',
          text: 'Nicht jeder Einbruch hat Folgen für die Wirtschaft. 1987 verlor der Markt an einem Tag rund ein Fünftel, ohne dass eine Rezession folgte. 2008 begann mit fallenden Immobilienpreisen und endete in einer weltweiten Wirtschaftskrise. Der Unterschied liegt an einer Stelle: **ob das Bankensystem betroffen ist.**',
        },
        {
          type: 'list',
          items: [
            '**Der Bankkanal.** Verlieren Banken Eigenkapital, vergeben sie weniger Kredite. Unternehmen investieren nicht, stellen nicht ein, gehen im Zweifel unter – obwohl mit ihrem Geschäft nichts war. Das ist der Weg vom Finanzmarkt in die Realwirtschaft, und er ist der einzige mit dieser Wucht.',
            '**Der Vermögenskanal.** Fällt das Vermögen, sinkt der Konsum. Dieser Effekt ist real, aber deutlich schwächer und wirkt langsamer.',
            '**Der Rückkopplungskanal.** Eine schwächere Wirtschaft erzeugt Kreditausfälle, die die Banken erneut treffen. Ist dieser Kreis erst geschlossen, wird aus einem Kurssturz eine Krise – und dann entscheidet nur noch die Reaktion.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was die Reaktion ausmacht',
        },
        {
          type: 'table',
          caption: 'Drei Krisen, drei Antworten',
          head: ['Krise', 'Reaktion', 'Folge'],
          rows: [
            [
              '1929',
              'Geldmenge verknappt, Handelsbarrieren errichtet, Bankenzusammenbrüche zugelassen',
              'Die schwerste und längste Depression des Jahrhunderts',
            ],
            [
              '2008',
              'Zinsen an die Nullgrenze, Anleihekäufe, Bankenrekapitalisierung und Garantien',
              'Tiefe Rezession, aber Erholung in wenigen Jahren',
            ],
            [
              '2020',
              'Beispiellose Geld- und Fiskalhilfen binnen Wochen',
              'Der schnellste Einbruch dieser Größe – und die schnellste Erholung',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was daraus zu lernen ist – und was nicht',
          items: [
            '**Zu lernen ist:** Die Erholungsdauer hing historisch stärker an der Reaktion als am Auslöser. Die Lehren aus 1929 sind der Grund, warum 2008 und 2020 anders verliefen.',
            '**Nicht zu lernen ist:** dass die Reaktion künftig ebenso ausfallen wird. Der Spielraum hängt an der Inflationslage und am Schuldenstand – 2020 war beides günstig, das muss es nicht bleiben.',
            'Wer aus den schnellen Erholungen der letzten Jahrzehnte auf künftige schließt, verlängert eine Reihe von drei Beobachtungen. Das ist derselbe Rezenzeffekt, der auch in die andere Richtung wirkt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was daraus für ein Depot folgt',
        },
        {
          type: 'paragraph',
          text: 'Aus der Beschäftigung mit Crashs folgt keine Prognosefähigkeit. Was folgt, sind vier Entscheidungen über die Struktur – und alle vier trifft man in ruhigen Zeiten, weil sie in unruhigen nicht mehr zu treffen sind.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Die Quote nach dem Ernstfall bemessen.** Nicht danach, was im Aufschwung erträglich schien, sondern danach, was bei einem Rückgang von der Hälfte noch tragbar ist – finanziell und emotional.',
            '**Keinen Hebel, der zum Verkauf zwingt.** Der Unterschied zwischen einem Buchverlust und einem realisierten Verlust ist die Freiheit, nichts zu tun. Ein Wertpapierkredit nimmt genau diese Freiheit, und zwar am Tiefpunkt.',
            '**Liquidität außerhalb des Marktes.** Zwei bis drei Jahresausgaben, die nicht am Kapitalmarkt hängen. Sie sind der einzige Posten, der in jeder Krise gehalten hat – nicht weil er klug angelegt wäre, sondern weil er nicht angelegt ist.',
            '**Den Plan vorher aufschreiben.** Was tue ich bei minus 20, bei minus 40? Die häufigste richtige Antwort ist „weiter einzahlen“, und genau die fällt im Moment am schwersten. Ein Satz auf Papier ersetzt eine Entscheidung, die man in der Lage nicht gut trifft.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was ausdrücklich nicht folgt',
          items: [
            '**Keine Vorhersage.** Kein Indikator hat Crashs verlässlich angekündigt. Wer alle Warnungen der letzten Jahrzehnte befolgt hätte, wäre die meiste Zeit nicht investiert gewesen – und das kostet mehr als die Crashs selbst.',
            '**Keine Absicherung auf Dauer.** Eine dauerhaft gehaltene Versicherung gegen Einbrüche kostet jedes Jahr Prämie. Über lange Zeiträume übersteigen diese Kosten die abgewendeten Verluste regelmäßig.',
            '**Kein Umbau nach dem Ereignis.** Wer nach einem Crash die Struktur ändert, richtet sein Depot am zuletzt Erlebten aus. Die nächste Krise kommt aus einer anderen Richtung – das ist die einzige verlässliche Aussage über sie.',
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
            'Aus einem Kurssturz wird eine Krise, wenn das Bankensystem betroffen ist.',
            'Die Erholungsdauer hing historisch stärker an der Reaktion als am Auslöser.',
            'Aus drei schnellen Erholungen folgt keine vierte – der Spielraum für Reaktionen ist nicht garantiert.',
            'Die vier tragfähigen Konsequenzen betreffen die Struktur und werden in ruhigen Zeiten getroffen.',
          ],
        },
      ],
    },
  },
}
