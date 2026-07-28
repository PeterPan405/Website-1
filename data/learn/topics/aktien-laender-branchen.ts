import { indexZusammensetzung } from '@/data/index-zusammensetzung'
import type { LearnTopic } from '@/data/learn/types'
import { formatDate, formatPercent } from '@/lib/format'

/*
  Die Ländergewichtung kommt aus der gepflegten Zusammensetzung.

  „Der Welt-Index ist stark US-lastig“ steht in jedem Ratgeber, meist ohne
  Zahl und ohne Stand. Diese Website führt die Gewichtung ohnehin – aus dem
  Factsheet des Anbieters, mit Datum und Quelle. Sie hier zu wiederholen
  hieße, dieselbe Zahl an zwei Stellen zu pflegen und irgendwann zwei
  verschiedene Zahlen zu haben.
*/
const WELTINDEX = 'msci-world'
const zusammensetzung = indexZusammensetzung[WELTINDEX]
const groessterAnteil = zusammensetzung?.laender.find((l) => !l.sammelposten)

/*
  Wie schnell zusätzliche Positionen an Nutzen verlieren.

  Das unternehmensspezifische Risiko eines gleichgewichteten Depots sinkt
  mit der Wurzel aus der Zahl der Positionen. Das ist eine Vereinfachung –
  sie unterstellt gleiche Einzelrisiken und keine Korrelation zwischen den
  Unternehmen. Die Größenordnung stimmt trotzdem, und sie beantwortet die
  Frage, die tatsächlich gestellt wird: Reichen zwanzig Aktien, oder müssen
  es hundert sein?
*/
const POSITIONEN = [1, 5, 10, 20, 50, 100]
const streureihe = POSITIONEN.map((anzahl) => ({
  anzahl,
  verbleibend: (1 / Math.sqrt(anzahl)) * 100,
}))

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt, warum Streuung wirkt und wo ihre Grenze
 * liegt, und benennt den Home Bias. Fortgeschritten behandelt
 * Gewichtungsmethoden, Branchenzyklen und Währungsrisiko. Profi geht auf
 * Faktoren, Klumpenrisiken und die Frage nach der richtigen Zahl von
 * Bausteinen ein.
 *
 * ## Abgrenzung zu „Portfolio-Aufbau“
 *
 * Dort geht es um die Aufteilung zwischen risikoarm und risikoreich. Hier
 * um die Streuung **innerhalb** des risikoreichen Teils.
 */
export const aktienLaenderBranchen: LearnTopic = {
  slug: 'aktien-laender-branchen',
  title: 'Länder & Branchen',
  headline: 'Streuung ist das einzige kostenlose Mittel',
  metaTitle: 'Aktien streuen: Länder, Branchen und Gewichtung',
  metaDescription:
    'Warum Streuung wirkt und wo ihre Grenze liegt, was der Home Bias kostet, welche Gewichtungsmethoden es gibt und wie Währungsrisiko tatsächlich entsteht.',
  lead: 'Streuung senkt das Risiko, ohne die erwartete Rendite zu senken. Das ist der einzige Vorgang in der Geldanlage, bei dem das gilt.',
  overview: [
    'Ein einzelnes Unternehmen kann ausfallen; ein ganzer Markt praktisch nicht. Deshalb lässt sich das unternehmensspezifische Risiko wegstreuen – das Marktrisiko dagegen nicht, und dafür wird man auch bezahlt.',
    'Die praktische Hürde ist nicht die Technik, sondern das Vertraute: Anleger übergewichten ihren Heimatmarkt systematisch, weil er bekannt wirkt. Bekanntheit senkt aber kein Risiko.',
    'Die Stufen führen von der Wirkung der Streuung über Gewichtungsmethoden, Branchenzyklen und Währungsrisiko bis zu Faktoren, versteckten Klumpenrisiken und der Frage nach der sinnvollen Zahl von Bausteinen.',
  ],
  keywords: [
    'Diversifikation',
    'Streuung',
    'Home Bias',
    'Weltindex',
    'Branchen',
    'Gewichtung',
  ],
  related: ['etf', 'portfolio-aufbau', 'aktie', 'waehrungen-wechselkurse'],
  symbols: ['msci-world'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Aktien streuen: warum es wirkt und wie viel genügt',
      metaDescription:
        'Warum Streuung Risiko senkt ohne Renditeverzicht, wie schnell der Nutzen zusätzlicher Positionen abnimmt und was der Home Bias kostet.',
      title: 'Warum Streuung wirkt',
      lead: 'Das einzige kostenlose Mittel der Geldanlage – und die Falle, in die fast alle tappen.',
      readingMinutes: 9,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'In der Geldanlage gibt es für alles einen Preis: Mehr Rendite kostet mehr Risiko, mehr Sicherheit kostet Rendite. Es gibt genau eine Ausnahme, und sie heißt Streuung. Sie senkt das Risiko, **ohne** die erwartete Rendite zu senken. Deshalb steht sie vor jeder anderen Entscheidung.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Zwei Arten von Risiko',
        },
        {
          type: 'table',
          caption: 'Nur eines davon lässt sich wegstreuen',
          head: ['Art', 'Was gemeint ist', 'Wegstreubar?'],
          rows: [
            [
              'Unternehmensrisiko',
              'Ein Werk brennt ab, ein Produkt scheitert, die Führung versagt, ein Patent fällt weg',
              'Ja. In einem breiten Depot fällt ein Einzelfall kaum ins Gewicht',
            ],
            [
              'Marktrisiko',
              'Rezession, Zinsanstieg, Krieg, Pandemie – alles, was alle Unternehmen zugleich trifft',
              'Nein. Es bleibt, egal wie breit gestreut wird',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Diese Unterscheidung erklärt zugleich, warum Streuung nichts kostet: Für das Unternehmensrisiko wird niemand bezahlt – man kann es ja beseitigen. Bezahlt wird nur für das Marktrisiko, und das behält man ohnehin. Wer nicht streut, trägt also ein Risiko, für das es keine Vergütung gibt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie viele Positionen genügen?',
        },
        {
          type: 'table',
          caption: 'Verbleibendes unternehmensspezifisches Risiko, vereinfacht gerechnet',
          head: ['Positionen', 'Verbleibendes Einzelrisiko'],
          rows: streureihe.map((zeile) => [
            `${zeile.anzahl}`,
            formatPercent(zeile.verbleibend, 0),
          ]),
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Was die Tabelle zeigt',
          items: [
            'Der Nutzen nimmt schnell ab: Die ersten zwanzig Positionen bringen den weitaus größten Teil. Von zwanzig auf hundert ist die Verbesserung klein.',
            'Die Rechnung ist vereinfacht – sie unterstellt gleich große Positionen und keine Verwandtschaft zwischen den Unternehmen. Beides trifft in der Praxis nicht zu, und beides verschlechtert das Ergebnis.',
            'Daraus folgt: Zwanzig **verschiedene** Unternehmen aus verschiedenen Branchen und Ländern streuen deutlich besser als hundert aus derselben Branche. Die Zahl allein sagt wenig.',
            'Und daraus folgt der praktische Rat: Ein einziger breiter Fonds erledigt das in einem Schritt und mit hunderten Positionen – ohne dass man selbst auswählen müsste.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Home Bias',
        },
        {
          type: 'paragraph',
          text: 'Anleger in fast allen Ländern halten deutlich mehr heimische Aktien, als es dem Anteil ihres Landes am Weltmarkt entspricht. In Deutschland ist der Effekt besonders folgenreich, weil der deutsche Aktienmarkt gemessen am Weltmarkt klein ist – und weil er stark von wenigen Branchen geprägt wird.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was daran teuer ist',
          items: [
            '**Vertrautheit ist keine Risikoreduktion.** Man kennt die Namen, liest die Nachrichten, war Kunde. Nichts davon hat mit dem Risiko der Anlage zu tun.',
            '**Die Konzentration wird mitgekauft.** Ein Land hat immer eine Branchenstruktur. Wer den Heimatmarkt übergewichtet, wettet ungewollt auf dessen führende Branchen.',
            '**Arbeitsplatz und Depot hängen zusammen.** Gerät die heimische Wirtschaft in eine Krise, trifft das Einkommen und Vermögen gleichzeitig – genau dann, wenn Rücklagen gebraucht würden. Das ist derselbe Fehler wie bei Mitarbeiteraktien, nur eine Ebene höher.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Streuung ohne Aufwand',
        },
        {
          type: 'paragraph',
          text: 'Ein breiter Weltindex enthält weit über tausend Unternehmen aus dreiundzwanzig Industrieländern. Die Branchenstreuung entsteht dabei automatisch mit – man muss sie nicht getrennt herstellen. Was ein solcher Index **nicht** abdeckt, ist ebenso wichtig zu wissen: Schwellenländer fehlen, und kleine Unternehmen fehlen. Beides lässt sich ergänzen, muss es aber nicht.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Streuung senkt Risiko ohne Renditeverzicht – das gilt sonst nirgends.',
            'Nur das Unternehmensrisiko lässt sich wegstreuen, das Marktrisiko bleibt.',
            'Die ersten zwanzig Positionen bringen den größten Teil des Nutzens – wenn sie verschieden genug sind.',
            'Der Heimatmarkt wirkt vertraut und senkt trotzdem kein Risiko.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Gewichtung, Branchen und Währungsrisiko',
      metaDescription:
        'Wie Indizes gewichtet werden, was die US-Quote bedeutet, wie sich zyklische und defensive Branchen unterscheiden und wo Währungsrisiko tatsächlich entsteht.',
      title: 'Gewichtung, Branchen, Währung',
      lead: 'Welche Gewichtungsmethoden es gibt, was in einem Weltindex tatsächlich drinsteckt – und wo das Währungsrisiko wirklich sitzt.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Was in einem Weltindex steckt',
        },
        {
          type: 'paragraph',
          text: zusammensetzung
            ? `„Breit gestreut“ heißt nicht „gleichmäßig verteilt“. Die Ländergewichtung des gebräuchlichsten Weltindex, nach dem Factsheet des Anbieters zum ${formatDate(zusammensetzung.stand)}:`
            : 'Die Ländergewichtung eines Weltindex ist alles andere als gleichmäßig.',
        },
        {
          type: 'table',
          caption: zusammensetzung
            ? `${zusammensetzung.quelle.label}, Stand ${formatDate(zusammensetzung.stand)}`
            : 'Ländergewichtung',
          head: ['Land', 'Anteil'],
          rows: (zusammensetzung?.laender ?? []).map((l) => [
            l.land,
            formatPercent(l.anteil, 1),
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was diese Zahlen bedeuten',
          items: groessterAnteil
            ? [
                `Rund ${formatPercent(groessterAnteil.anteil, 0)} des Index entfallen auf ein einziges Land. Wer einen Welt-ETF hält, hält zu einem großen Teil den US-Markt.`,
                'Das ist kein Konstruktionsfehler: Die Gewichtung folgt der Marktkapitalisierung, und die US-Unternehmen sind tatsächlich so viel wert. Der Index bildet die Realität ab.',
                'Es heißt aber, dass „weltweit“ und „gleichmäßig über die Welt verteilt“ zwei verschiedene Dinge sind – und dass ein Welt-ETF eine erhebliche Wette auf einen Markt und eine Währung enthält.',
                'Der Sammelposten am Ende der Tabelle ist ebenfalls aufschlussreich: Deutschland taucht in dieser Aufteilung nicht einmal einzeln auf.',
              ]
            : ['Die Gewichtung folgt der Marktkapitalisierung.'],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Drei Gewichtungsmethoden',
        },
        {
          type: 'table',
          caption: 'Was sie bewirken und was sie kosten',
          head: ['Methode', 'Prinzip', 'Abwägung'],
          rows: [
            [
              'Marktkapitalisierung',
              'Jedes Unternehmen nach seinem Börsenwert',
              'Selbstregulierend – der Index passt sich ohne Handel an, was Kosten spart. Dafür hohe Länder- und Unternehmenskonzentration',
            ],
            [
              'Nach Wirtschaftsleistung',
              'Regionen nach ihrem Anteil an der Weltwirtschaft',
              'Deutlich höhere Schwellenländerquote. Dafür laufender Umschichtungsbedarf und damit höhere Kosten',
            ],
            [
              'Gleichgewichtung',
              'Jedes Unternehmen mit demselben Anteil',
              'Mehr Gewicht auf kleinere Unternehmen. Erfordert ständiges Rebalancing – bei tausend Positionen ein erheblicher Kostenfaktor',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die verbreitete **70/30-Aufteilung** – Industrieländer zu Schwellenländern – ist ein Kompromiss zwischen den ersten beiden: Sie hebt die Schwellenländerquote deutlich über die Marktkapitalisierung, ohne den Aufwand einer vollen Wirtschaftsleistungsgewichtung. Sie ist begründbar und keineswegs zwingend; ein einzelner breiter Weltindex ist ebenfalls eine vollständig vertretbare Lösung.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Branchen und Zyklen',
        },
        {
          type: 'table',
          caption: 'Zwei Grundtypen',
          head: ['Typ', 'Beispiele', 'Verhalten'],
          rows: [
            [
              'Zyklisch',
              'Automobil, Maschinenbau, Chemie, Banken, Luxusgüter',
              'Gewinne schwanken stark mit der Konjunktur. Im Aufschwung überdurchschnittlich, im Abschwung deutlich schlechter',
            ],
            [
              'Defensiv',
              'Nahrungsmittel, Versorger, Gesundheit, Telekommunikation',
              'Nachfrage bleibt weitgehend bestehen. Schwankt weniger – und bleibt in starken Aufschwüngen zurück',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum Branchenwetten selten aufgehen',
          items: [
            '**Eine Branchenwette ist meist eine Zeitpunktwette.** Zyklische Werte laufen gut, wenn die Konjunktur dreht – und den Zeitpunkt dieser Drehung zu treffen ist dasselbe Problem wie Markttiming.',
            '**Fünf Autohersteller sind keine Streuung.** Sie hängen an derselben Konjunktur, denselben Rohstoffpreisen, denselben Regulierungen. Streuung entsteht durch Verschiedenheit, nicht durch Anzahl.',
            '**Die Konzentration im eigenen Index gehört geprüft, nicht angenommen.** Auch ein breiter Weltindex kann erheblich von einer Branche geprägt sein – das ändert sich über die Jahre, und es steht im Factsheet.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wo das Währungsrisiko sitzt',
        },
        {
          type: 'list',
          items: [
            '**Nicht in der Handelswährung.** Ein in Euro notierter Welt-ETF trägt volles Dollarrisiko – die Notierung rechnet nur um.',
            '**Sondern in den Umsätzen.** Entscheidend ist, worin die enthaltenen Unternehmen wirtschaften. Ein europäischer Konzern mit überwiegendem Dollarumsatz ist wirtschaftlich eine Dollarposition.',
            '**Bei Aktien dominiert es nicht.** Die Schwankung des Aktienmarkts ist deutlich größer als die der Währung. Deshalb ist eine Absicherung hier meist verzichtbar – anders als bei Anleihen, wo die Währungsbewegung die erwartete Rendite übersteigt.',
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
            'Ein Weltindex ist breit gestreut und trotzdem stark auf ein Land konzentriert.',
            'Marktkapitalisierung ist selbstregulierend, alle Alternativen kosten Umschichtung.',
            'Streuung entsteht durch Verschiedenheit, nicht durch Anzahl.',
            'Das Währungsrisiko steckt in den Umsätzen der Unternehmen, nicht in der Notierung.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Faktoren, Klumpenrisiken und die Zahl der Bausteine',
      metaDescription:
        'Was Faktorprämien sind und wie belastbar sie sind, wo versteckte Klumpenrisiken entstehen und wie viele Bausteine ein Depot tatsächlich braucht.',
      title: 'Faktoren, versteckte Klumpen, Bausteine',
      lead: 'Was hinter Faktorprämien steckt, wo im eigenen Depot Konzentration entsteht, die niemand beschlossen hat – und wie viel Struktur genug ist.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Faktoren',
        },
        {
          type: 'paragraph',
          text: 'Die Forschung hat Merkmale identifiziert, die über lange Zeiträume mit höheren Renditen einhergingen: kleinere Unternehmen, niedrig bewertete, zuletzt gut gelaufene, hoch profitable, wenig schwankende. Aus ihnen sind Produkte geworden. Bevor man eines kauft, ist die Frage zu beantworten, **warum** es eine Prämie geben sollte.',
        },
        {
          type: 'table',
          caption: 'Zwei mögliche Begründungen – mit unterschiedlicher Konsequenz',
          head: ['Erklärung', 'Bedeutung', 'Folge'],
          rows: [
            [
              'Risikoprämie',
              'Der Faktor bringt mehr, weil er ein zusätzliches Risiko trägt, das andere nicht tragen wollen',
              'Die Prämie bleibt bestehen – aber das Risiko auch. Man wird bezahlt, und irgendwann zahlt man',
            ],
            [
              'Verhaltensmuster',
              'Der Faktor bringt mehr, weil Anleger systematisch fehlbewerten',
              'Die Prämie kann verschwinden, sobald genug Kapital ihr folgt. Veröffentlichung schwächt sie',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was in der Praxis dazwischenkommt',
          items: [
            '**Lange Durststrecken.** Value lag über mehr als ein Jahrzehnt zurück. Eine Strategie, die so lange schlechter läuft, gibt fast jeder vorher auf – und dann hat man den Nachteil ohne den späteren Vorteil.',
            '**Umsetzungskosten.** Faktorprodukte schichten häufiger um als ein breiter Index. Die Papierrenditen der Studien rechnen ohne Spread, Marktwirkung und Steuern.',
            '**Definitionsvielfalt.** „Value“ wird von verschiedenen Anbietern verschieden definiert, mit spürbar verschiedenen Ergebnissen. Der Faktor im Produkt ist nicht zwingend der Faktor aus der Studie.',
            '**Die ehrliche Einordnung:** Faktoren sind keine Scharlatanerie und keine sichere Sache. Wer sie beimischt, sollte es klein, dauerhaft und in Kenntnis der Durststrecken tun – oder es lassen.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Klumpenrisiken, die niemand beschlossen hat',
        },
        {
          type: 'list',
          items: [
            '**Die Spitze des Index.** In einem nach Marktkapitalisierung gewichteten Index entfällt ein erheblicher Teil auf die größten Unternehmen. Diese Konzentration wächst automatisch, wenn diese Werte gut laufen – niemand entscheidet sie, und sie ist am größten, wenn sie am meisten wehtut.',
            '**Doppelung über Produkte hinweg.** Wer einen Welt-ETF und einen Technologie-ETF hält, hält dieselben Unternehmen zweimal. Die Frage ist nie, was ein Produkt enthält, sondern was das Depot **insgesamt** enthält.',
            '**Das Humankapital.** Das eigene Einkommen ist die größte Position im Gesamtvermögen und hängt an einer Branche und einem Land. Wer in der Automobilindustrie arbeitet und Automobilaktien hält, hat eine Konzentration, die in keiner Depotübersicht steht.',
            '**Die selbstgenutzte Immobilie.** Oft der größte Vermögensposten, gebunden an einen einzigen Standort. Auch sie taucht in keiner Streuungsbetrachtung des Depots auf.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Die Übung, die das sichtbar macht',
          items: [
            'Alle Positionen auf ihre tatsächlichen Bestandteile herunterbrechen: Welche Unternehmen, welche Länder, welche Umsatzwährungen, welche Branchen?',
            'Dann Einkommen und Immobilie danebenstellen und dieselben Fragen stellen.',
            'Fast jeder findet dabei eine Konzentration, die er nicht beschlossen hat. Das ist der eigentliche Ertrag dieser Übung – nicht eine Zahl, sondern eine Entdeckung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie viele Bausteine?',
        },
        {
          type: 'paragraph',
          text: 'Die verbreitete Annahme lautet: mehr Produkte, mehr Streuung. Das ist falsch. Ein einziger breiter Weltindex enthält bereits über tausend Unternehmen; ein zweiter Fonds auf denselben Markt fügt nichts hinzu außer Verwaltungsaufwand. Ein zusätzlicher Baustein lohnt nur, wenn er etwas enthält, das im ersten fehlt – **und** wenn man begründen kann, warum man diese Abweichung will.',
        },
        {
          type: 'table',
          caption: 'Drei sinnvolle Aufbauten',
          head: ['Aufbau', 'Wofür'],
          rows: [
            [
              'Ein Baustein',
              'Ein breiter Weltindex. Für die meisten die richtige Antwort – nicht als Kompromiss, sondern als Optimum bei gegebenem Aufwand',
            ],
            [
              'Zwei bis drei',
              'Industrieländer plus Schwellenländer, gegebenenfalls Nebenwerte. Für alle, die die Gewichtung bewusst anders setzen wollen als der Weltindex',
            ],
            [
              'Kern und Satellit',
              'Breiter Kern von 80 bis 90 Prozent, dazu kleine bewusste Abweichungen. Für alle, die Einzelthemen abbilden wollen, ohne das Ergebnis daran zu hängen',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Ab etwa fünf Bausteinen wird das Rebalancing zur Arbeit, ohne dass sich das Ergebnis erkennbar verbessert. Und jede zusätzliche Position ist eine Entscheidung, die künftig überprüft werden will – der Aufwand fällt nicht einmal an, sondern jedes Jahr.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Vor jedem Faktorprodukt steht die Frage, ob die Prämie ein Risiko vergütet oder ein Verhaltensmuster ausnutzt.',
            'Die Konzentration in der Indexspitze wächst von allein und ist am größten, wenn sie am meisten wehtut.',
            'Einkommen und Immobilie gehören in die Streuungsbetrachtung – sie stehen in keiner Depotübersicht.',
            'Mehr Produkte sind nicht mehr Streuung; ein zusätzlicher Baustein braucht eine Begründung.',
          ],
        },
      ],
    },
  },
}
