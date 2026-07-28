import type { LearnTopic } from '@/data/learn/types'
import { formatCurrencyRounded, formatNumber, formatPercent } from '@/lib/format'
import {
  derivatEinsatz as EINSATZ,
  derivatSicherheitssaetze as SICHERHEITSSAETZE,
} from '@/lib/lernszenarien'

/*
  Zwei gerechnete Blöcke, beide gegen verbreitete Fehlvorstellungen gerichtet.

  1. Der Hebel. „Hebel 20“ klingt nach einer Eigenschaft des Produkts. Er ist
     aber nur das Verhältnis von Position zu hinterlegter Sicherheit – und
     damit auch die Antwort auf die Frage, ab welcher Kursbewegung das
     eingesetzte Geld weg ist. Diese Zahl gehört in dieselbe Tabelle.

  2. Die Pfadabhängigkeit. Ein Faktorzertifikat mit Faktor vier bildet den
     Basiswert *täglich* vierfach ab – über mehrere Tage tut es das nicht.
     Der Unterschied wird hier durchgerechnet statt beschrieben, weil er
     kontraintuitiv ist: Der Basiswert steht wieder am Ausgangspunkt und das
     Zertifikat notiert zweistellig im Minus.
*/
const hebelreihe = SICHERHEITSSAETZE.map((satz) => {
  const hebel = 100 / satz
  return {
    satz,
    hebel,
    position: (EINSATZ * 100) / satz,
    // Bei welcher Bewegung gegen die Position ist die Sicherheit aufgebraucht?
    totalverlustBei: satz,
    beiFuenfProzent: 5 * hebel,
  }
})

/*
  Pfadabhängigkeit an einem Zweitagesbeispiel.

  Der Basiswert steigt und fällt anschließend genau so weit zurück, dass er
  wieder bei 100 steht. Das tägliche Vielfache tut das nicht – und der
  Rückstand wächst mit dem Faktor und mit der Schwankung.
*/
const ANSTIEG = 10
const rueckgang = (100 / (100 + ANSTIEG)) * 100 - 100 // bringt den Basiswert zurück auf 100
const FAKTOREN = [2, 3, 4]

function nachZweiTagen(faktor: number): number {
  const tagEins = 100 * (1 + (faktor * ANSTIEG) / 100)
  return tagEins * (1 + (faktor * rueckgang) / 100)
}

const faktorreihe = FAKTOREN.map((faktor) => ({
  faktor,
  stand: nachZweiTagen(faktor),
  verlust: nachZweiTagen(faktor) - 100,
}))

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt die Grundidee und rechnet den Hebel vor.
 * Fortgeschritten behandelt Futures, Margin-Mechanik und Swaps. Profi geht
 * auf Bewertung über Arbitragefreiheit, die Kostenstruktur der Retail-
 * Hebelprodukte und die Regulierung ein.
 *
 * ## Abgrenzung zu „Option“
 *
 * Optionen sind ein Derivat unter mehreren und haben ein eigenes Thema, weil
 * sie als einzige ein asymmetrisches Profil haben. Hier stehen sie nur als
 * Familienmitglied; die Prämienzerlegung und die Griechen gehören dorthin.
 */
export const derivat: LearnTopic = {
  slug: 'derivat',
  title: 'Derivat',
  headline: 'Verträge, deren Wert von etwas anderem abhängt',
  metaTitle: 'Derivate erklärt: Arten, Hebel und Risiken',
  metaDescription:
    'Was Derivate sind, wie Futures, Optionen und Swaps funktionieren, wie der Hebel entsteht und warum Absicherung und Spekulation dieselben Werkzeuge nutzen.',
  lead: 'Ein Derivat hat keinen eigenen Wert – er wird von einem Basiswert abgeleitet. Genau daraus entsteht der Hebel.',
  overview: [
    'Derivate sind Verträge über künftige Zahlungen, deren Höhe von der Entwicklung eines Basiswerts abhängt: einer Aktie, einem Index, einem Zins, einem Rohstoff oder einem Wechselkurs.',
    'Dasselbe Instrument kann Risiko abbauen oder aufbauen. Ein Landwirt, der seine Ernte per Future zu einem festen Preis verkauft, sichert ab. Wer denselben Future ohne Ernte kauft, spekuliert. Der Vertrag ist identisch.',
    'Die Stufen führen von der Grundidee über Futures, Margin-Mechanik und Swaps bis zur Bewertung über Arbitragefreiheit und den tatsächlichen Kosten gehebelter Produkte für Privatanleger.',
  ],
  keywords: ['Derivat', 'Future', 'Option', 'Hebel', 'Absicherung', 'Margin'],
  related: ['option', 'schuldverschreibung', 'wie-funktioniert-der-markt'],
  symbols: ['eur-jpy'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Derivate einfach erklärt: Grundidee und Hebel',
      metaDescription:
        'Was ein Derivat ist, wie Absicherung und Spekulation zusammenhängen, wie ein Hebel entsteht und warum Verluste das eingesetzte Geld übersteigen können.',
      title: 'Warum es Verträge auf Kurse gibt',
      lead: 'Die Grundidee, der Ursprung im Warenhandel – und was ein Hebel praktisch bedeutet.',
      readingMinutes: 8,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Derivate gelten als Erfindung der Finanzindustrie und als besonders undurchsichtig. Beides stimmt nicht. Die Grundidee ist mehrere tausend Jahre alt und stammt aus der Landwirtschaft: Ein Bauer und ein Müller vereinbaren im Frühjahr den Preis für die Ernte im Herbst. Beide wissen dann, woran sie sind – unabhängig davon, wie der Preis sich tatsächlich entwickelt.',
        },
        {
          type: 'paragraph',
          text: 'Genau das ist ein Derivat: ein Vertrag, dessen Wert sich von etwas anderem **ableitet** – lateinisch *derivare*. Der Vertrag selbst hat keinen eigenen Wert. Was er wert ist, hängt allein daran, wo der Weizenpreis, der Aktienkurs oder der Wechselkurs am Ende steht.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Dasselbe Werkzeug, zwei Zwecke',
        },
        {
          type: 'table',
          caption: 'Absicherung und Spekulation im selben Vertrag',
          head: ['', 'Absicherung', 'Spekulation'],
          rows: [
            [
              'Ausgangslage',
              'Man besitzt oder braucht den Basiswert',
              'Man besitzt ihn nicht',
            ],
            ['Zweck', 'Ein bestehendes Risiko abgeben', 'Ein neues Risiko eingehen'],
            [
              'Beispiel',
              'Der Landwirt verkauft seine Ernte im Voraus',
              'Jemand ohne Feld kauft denselben Kontrakt',
            ],
            [
              'Wirkung',
              'Planbarkeit – auf Kosten möglicher Gewinne',
              'Gehebelte Beteiligung an einer Kursbewegung',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Beide brauchen einander. Ohne Spekulanten fände der Landwirt keinen Vertragspartner – wer sonst würde ihm das Preisrisiko abnehmen? Deshalb ist die Frage nicht, ob Derivate gut oder schlecht sind, sondern auf welcher Seite man steht.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wie der Hebel entsteht',
        },
        {
          type: 'paragraph',
          text: `Für ein Derivat wird nicht der volle Gegenwert bezahlt, sondern nur eine Sicherheit. Wer ${formatCurrencyRounded(EINSATZ)} hinterlegt, steuert damit eine deutlich größere Position – und daraus ergibt sich alles Weitere:`,
        },
        {
          type: 'table',
          caption: `Sicherheitsleistung, Hebel und Wirkung – Einsatz jeweils ${formatCurrencyRounded(EINSATZ)}`,
          head: [
            'Sicherheit',
            'Hebel',
            'Gesteuerte Position',
            'Bei 5 % Kursbewegung',
            'Einsatz weg bei',
          ],
          rows: hebelreihe.map((zeile) => [
            formatPercent(zeile.satz, 0),
            `${formatNumber(zeile.hebel, 0)}×`,
            formatCurrencyRounded(zeile.position),
            `± ${formatPercent(zeile.beiFuenfProzent, 0)}`,
            `${formatPercent(zeile.totalverlustBei, 0)} gegen dich`,
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die letzte Spalte ist die wichtige',
          items: [
            'Bei Hebel 20 genügt eine Kursbewegung von fünf Prozent in die falsche Richtung, und der Einsatz ist vollständig aufgebraucht.',
            'Fünf Prozent an einem Tag sind bei einer einzelnen Aktie nichts Ungewöhnliches. Bei einem Index sind sie selten, aber sie kommen vor.',
            'Der Hebel wirkt exakt symmetrisch. Was ihn gefährlich macht, ist nicht die Asymmetrie – es ist, dass die Position vorher zwangsweise geschlossen wird und man die Erholung nicht mehr erlebt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Drei Dinge, die vorher klar sein müssen',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Verluste können den Einsatz übersteigen.** Bei Futures und einigen anderen Konstruktionen gibt es eine Nachschusspflicht: Reicht die Sicherheit nicht, muss nachgezahlt werden. Für Privatanleger in der EU ist das bei CFDs untersagt – bei anderen Produkten nicht.',
            '**Manche Derivate verlieren auch ohne Kursbewegung.** Optionen verlieren Zeitwert, gehebelte Produkte tragen Finanzierungskosten. Wer nichts tut, verliert trotzdem – das ist bei einer Aktie anders.',
            '**Für den Vermögensaufbau braucht man das nicht.** Derivate lösen ein Problem, das die meisten Privatanleger nicht haben. Wer keinen konkreten Absicherungsbedarf hat, hat keinen Grund für den Einsatz – und die Werbung für Hebelprodukte richtet sich fast ausschließlich an Menschen ohne diesen Bedarf.',
          ],
        },
        {
          type: 'figure',
          figure: 'derivat-hebel',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Ein Derivat leitet seinen Wert von einem Basiswert ab und hat selbst keinen.',
            'Absicherung und Spekulation benutzen denselben Vertrag – der Unterschied liegt darin, ob man den Basiswert besitzt.',
            'Der Hebel ergibt sich aus der Sicherheitsleistung; bei Hebel 20 kostet eine Bewegung von 5 Prozent den gesamten Einsatz.',
            'Ohne konkretes Absicherungsbedürfnis gibt es für Privatanleger keinen Grund, Derivate einzusetzen.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Derivate: Futures, Margin und Swaps',
      metaDescription:
        'Wie Futures und Forwards funktionieren, was Margin und Nachschusspflicht bedeuten, wie Swaps eingesetzt werden und was Contango für Rohstoffprodukte heißt.',
      title: 'Futures, Margin und Swaps',
      lead: 'Die wichtigsten Derivatearten, ihre tägliche Abwicklung – und warum Rohstoffprodukte hinter dem Rohstoffpreis zurückbleiben.',
      readingMinutes: 12,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Future und Forward',
        },
        {
          type: 'table',
          caption: 'Derselbe Vertrag, zwei Welten',
          head: ['', 'Future', 'Forward'],
          rows: [
            ['Handelsort', 'Börse', 'Direkt zwischen zwei Parteien'],
            [
              'Ausgestaltung',
              'Standardisiert: feste Kontraktgröße und Termine',
              'Frei verhandelbar',
            ],
            [
              'Gegenpartei',
              'Die Clearingstelle tritt zwischen beide',
              'Der andere Vertragspartner selbst',
            ],
            ['Ausfallrisiko', 'Praktisch ausgeschaltet', 'Voll vorhanden'],
            ['Abrechnung', 'Täglich', 'Am Ende der Laufzeit'],
          ],
        },
        {
          type: 'paragraph',
          text: 'Die **Clearingstelle** ist die wichtigste Einrichtung dieses Markts. Sie stellt sich zwischen Käufer und Verkäufer und wird für beide zur Gegenpartei. Fällt einer aus, tritt sie ein. Dafür verlangt sie Sicherheiten von beiden Seiten – und aus dieser Forderung ergibt sich die gesamte Mechanik.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Margin: die tägliche Abrechnung',
        },
        {
          type: 'list',
          items: [
            '**Initial Margin.** Die Sicherheit, die beim Eröffnen hinterlegt werden muss. Sie bemisst sich an der erwarteten Tagesschwankung, nicht am Kontraktwert.',
            '**Variation Margin.** Jeden Abend wird abgerechnet: Gewinne werden gutgeschrieben, Verluste abgebucht. Ein Future hat deshalb keine aufgelaufenen Buchverluste – sie werden täglich real.',
            '**Maintenance Margin.** Die Untergrenze. Fällt die Sicherheit darunter, kommt der **Margin Call**: nachzahlen oder die Position wird geschlossen.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Warum das den Zeithorizont zerstört',
          items: [
            'Bei einer Aktie kann man einen Rückschlag aussitzen. Bei einem Future nicht: Die Sicherheit muss jeden Abend reichen.',
            'Eine Position kann also zwangsweise geschlossen werden, obwohl die zugrunde liegende Einschätzung am Ende richtig war. Nur eben zu spät.',
            'Genau das ist der Unterschied zwischen einem Verlustrisiko und einem Liquiditätsrisiko – und Letzteres ist der häufigere Grund für gescheiterte Positionen.',
          ],
        },
        {
          type: 'figure',
          figure: 'derivat-margin',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Rollen, Contango und die Rohstofffalle',
        },
        {
          type: 'paragraph',
          text: 'Ein Future läuft zu einem festen Termin aus. Wer die Position halten will, muss vorher in den nächsten Kontrakt wechseln – das **Rollen**. Dabei entsteht ein Effekt, der die Wertentwicklung dauerhaft verändert.',
        },
        {
          type: 'table',
          caption: 'Zwei Marktzustände',
          head: ['Zustand', 'Preisstruktur', 'Wirkung beim Rollen'],
          rows: [
            [
              'Contango',
              'Der spätere Kontrakt ist teurer als der laufende',
              'Man verkauft billig und kauft teuer – ein laufender Verlust',
            ],
            [
              'Backwardation',
              'Der spätere Kontrakt ist billiger',
              'Man verkauft teuer und kauft billig – ein laufender Gewinn',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Bei Rohstoffen ist Contango der Normalfall, weil Lagerung und Versicherung Geld kosten und im Terminpreis stecken. Für Privatanleger folgt daraus etwas Wichtiges: Ein Indexprodukt auf Öl bildet **nicht** den Ölpreis ab, sondern eine gerollte Terminposition. Über Jahre kann der Rohstoff steigen und das Produkt trotzdem verlieren. Dieser Unterschied steht selten dort, wo er hingehörte – nämlich groß auf dem Produktblatt.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Swaps',
        },
        {
          type: 'paragraph',
          text: 'Ein **Swap** ist ein Tausch von Zahlungsströmen. Er wird nicht gekauft und verkauft, sondern vereinbart – und ist das mit Abstand größte Segment des Derivatemarkts.',
        },
        {
          type: 'list',
          items: [
            '**Zinsswap.** Eine Seite zahlt fest, die andere variabel. Ein Unternehmen mit variabel verzinstem Kredit macht daraus wirtschaftlich einen Festzinskredit, ohne den Kreditvertrag anzufassen.',
            '**Währungsswap.** Zahlungen in verschiedenen Währungen werden getauscht. Ein Exporteur sichert damit künftige Einnahmen gegen Wechselkursänderungen.',
            '**Total Return Swap.** Eine Seite liefert die gesamte Wertentwicklung eines Index, die andere zahlt einen Zins. Genau das steckt in **synthetischen ETFs**: Sie halten nicht die Indexwerte, sondern einen Korb plus einen Swap auf die Indexentwicklung. Das kann die Abbildung genauer und billiger machen – und bringt ein Kontrahentenrisiko mit, das ein physisch abbildender ETF nicht hat.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Absicherung in der Praxis',
        },
        {
          type: 'paragraph',
          text: 'Wer absichern will, braucht zwei Zahlen. Die **Hedge Ratio** sagt, wie viele Kontrakte eine Position abdecken – Positionswert geteilt durch Kontraktwert, korrigiert um den Gleichlauf zwischen Position und Basiswert. Und das **Basisrisiko** beschreibt, was übrig bleibt: Wer ein Portfolio deutscher Nebenwerte mit DAX-Futures absichert, ist gegen den Markt geschützt, nicht aber gegen das Auseinanderlaufen von Nebenwerten und Standardwerten. Eine perfekte Absicherung gibt es nur, wenn Absicherungsinstrument und Position identisch sind – und dann hätte man auch verkaufen können.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was du dir merken solltest',
        },
        {
          type: 'list',
          items: [
            'Die Clearingstelle nimmt das Ausfallrisiko und verlangt dafür tägliche Sicherheiten.',
            'Die tägliche Abrechnung macht aus einem Verlustrisiko ein Liquiditätsrisiko – man kann herausgeworfen werden, obwohl man recht behält.',
            'Rohstoffprodukte bilden gerollte Terminpositionen ab, nicht den Rohstoffpreis; in Contango kostet das laufend.',
            'Synthetische ETFs benutzen Swaps und tragen dafür ein Kontrahentenrisiko.',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Derivate für Profis: Bewertung und Hebelprodukte',
      metaDescription:
        'Bewertung über Arbitragefreiheit und Cost of Carry, Pfadabhängigkeit von Faktorzertifikaten, Kostenstruktur von Knock-outs und CFDs sowie Modellrisiken.',
      title: 'Bewertung, Hebelprodukte und ihre Kosten',
      lead: 'Warum ein Terminpreis keine Prognose ist, was tägliche Hebel über Zeit anrichten – und wo die Marge der Emittenten sitzt.',
      readingMinutes: 15,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Bewertung: nicht Prognose, sondern Arbitragefreiheit',
        },
        {
          type: 'paragraph',
          text: 'Der verbreitetste Irrtum über Terminmärkte lautet, der Terminpreis sei die Erwartung des Marktes an den künftigen Kassapreis. Das ist er nicht. Er ergibt sich aus einer Bedingung, die mit Erwartungen nichts zu tun hat: Es darf kein risikoloser Gewinn möglich sein.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Cost of Carry',
          items: [
            'Wer den Basiswert heute kauft und bis zum Termin hält, hat Kosten: Finanzierung des Kaufpreises, bei Waren zusätzlich Lagerung und Versicherung. Erträge – etwa Dividenden – ziehen sich davon ab.',
            'Der faire Terminpreis ist der Kassapreis plus diese Nettokosten. Läge er höher, könnte man den Basiswert kaufen, den Future verkaufen und die Differenz risikolos einstreichen.',
            'Deshalb sagt eine steigende Terminkurve nichts über steigende Preise. Sie sagt etwas über Zinsen und Lagerkosten.',
            'Bei Optionen ist es dieselbe Logik in komplizierterer Form: Der Preis ergibt sich aus dem **Replikationsportfolio**, das die Auszahlung nachbaut. Das Modell fragt nie, wohin der Kurs geht.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Und hier liegt zugleich das **Modellrisiko**. Die Replikation setzt voraus, dass man laufend anpassen kann und dass Kurse sich stetig bewegen. Beides bricht genau dann, wenn es darauf ankommt: bei Kurssprüngen über Nacht, bei ausgetrockneter Liquidität, bei ausgesetztem Handel. Modelle sind in ruhigen Phasen präzise und in dem Moment unbrauchbar, für den man sie gebraucht hätte.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der wichtigste Rechenfehler bei Hebelprodukten',
        },
        {
          type: 'paragraph',
          text: `Ein Faktorzertifikat mit Faktor vier bildet den Basiswert **täglich** vierfach ab. Über mehrere Tage tut es das nicht – und der Unterschied ist kein Detail. Ein Beispiel: Der Basiswert steigt an einem Tag um ${formatPercent(ANSTIEG, 0)} und fällt am nächsten um ${formatPercent(Math.abs(rueckgang), 2)}. Er steht danach wieder genau bei 100.`,
        },
        {
          type: 'table',
          caption: 'Stand nach zwei Tagen – der Basiswert ist unverändert bei 100',
          head: ['Faktor', 'Stand nach zwei Tagen', 'Verlust'],
          rows: faktorreihe.map((zeile) => [
            `${zeile.faktor}×`,
            formatNumber(zeile.stand, 2),
            formatPercent(zeile.verlust, 2),
          ]),
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Was daran systematisch ist',
          items: [
            'Der Effekt heißt **Pfadabhängigkeit** und geht immer in dieselbe Richtung: Schwankung kostet, unabhängig davon, wohin der Basiswert am Ende läuft.',
            'Er wächst überproportional mit dem Faktor und mit der Schwankungsbreite. Bei zwei Tagen ist er klein, über Monate in einem seitwärts laufenden, unruhigen Markt frisst er die Position auf.',
            'Das ist kein Konstruktionsfehler und keine versteckte Gebühr. Es ist die zwangsläufige Folge davon, dass täglich neu gehebelt wird – und es steht meist korrekt im Prospekt, nur nicht in der Werbung.',
            'Praktische Folge: Faktorzertifikate sind Instrumente für einzelne Tage. Wer sie über Wochen hält, hat ein anderes Produkt, als er gekauft zu haben glaubte.',
          ],
        },
        {
          type: 'figure',
          figure: 'derivat-pfadabhaengigkeit',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die drei Retail-Hebelprodukte im Vergleich',
        },
        {
          type: 'table',
          caption: 'Konstruktion und die jeweils entscheidende Schwäche',
          head: ['Produkt', 'Konstruktion', 'Worauf zu achten ist'],
          rows: [
            [
              'Knock-out-Zertifikat',
              'Hebel über eine eingebaute Finanzierungsschwelle; bei Berührung verfällt es',
              'Der Totalverlust ist sofort und endgültig – auch bei einer kurzen Spitze mitten in der Nacht',
            ],
            [
              'Faktorzertifikat',
              'Konstanter täglicher Hebel, täglich neu aufgesetzt',
              'Pfadabhängigkeit: über Zeit entspricht das Ergebnis nicht dem Faktor',
            ],
            [
              'CFD',
              'Vertrag über die Kursdifferenz, mit variabler Sicherheitsleistung',
              'Laufende Finanzierungskosten, Spread und die Kursstellung des Anbieters selbst',
            ],
          ],
        },
        {
          type: 'list',
          items: [
            '**Die Finanzierungskosten** sind die am häufigsten übersehene Position. Ein gehebeltes Produkt enthält einen Kredit, und der wird verzinst – meist mit einem Aufschlag auf den Referenzzins. Bei niedrigen Zinsen fiel das kaum auf; seit sie gestiegen sind, ist es ein spürbarer laufender Abzug.',
            '**Der Spread** ist bei diesen Produkten die eigentliche Vergütung des Emittenten. Er wird nicht als Gebühr ausgewiesen, sondern liegt zwischen An- und Verkaufskurs – und ist außerhalb der Handelszeiten des Basiswerts am breitesten.',
            '**Anpassungsklauseln.** Der Emittent darf Bedingungen unter definierten Umständen ändern. Wer die Klauseln nicht gelesen hat, erfährt davon erst, wenn sie angewendet werden.',
            '**Emittentenrisiko.** Alle drei sind rechtlich Schuldverschreibungen der ausgebenden Bank – kein Sondervermögen. Bei deren Ausfall ist das Papier wertlos, unabhängig vom Basiswert.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Regulierung und Steuern',
        },
        {
          type: 'list',
          items: [
            '**Verlustbegrenzung bei CFDs.** Für Privatanleger in der EU ist die Nachschusspflicht bei CFDs untersagt; der Verlust ist auf das Kontoguthaben begrenzt. Bei anderen Produkten gilt das nicht – die Regelung ist produktbezogen, nicht anlegerbezogen.',
            '**Kontrahentenrisiko außerbörslich.** Was nicht über eine Clearingstelle läuft, trägt das Ausfallrisiko der Gegenpartei. Nach 2008 wurde ein großer Teil des Standardgeschäfts in das zentrale Clearing gezwungen – genau deshalb.',
            '**Verlustverrechnung bei Termingeschäften.** In Deutschland galt für Verluste aus Termingeschäften zeitweise eine gesonderte Betragsgrenze. Sie traf Absicherungsstrategien besonders hart, weil dort planmäßig ein Bein verliert, während das andere gewinnt – und die Verrechnung genau daran scheiterte. Die Rechtslage hat sich mehrfach geändert und war verfassungsrechtlich umstritten.',
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Keine Steuerberatung',
          items: [
            'Die Behandlung von Termingeschäften, Stillhalterprämien und Glattstellungen ist komplex und hat sich in kurzen Abständen geändert.',
            'Wer Derivate in nennenswertem Umfang einsetzt, sollte den aktuellen Stand prüfen lassen, statt sich auf ältere Darstellungen – auch auf diese – zu verlassen.',
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
            'Terminpreise folgen der Arbitragefreiheit, nicht einer Prognose – eine steigende Kurve sagt etwas über Zinsen und Lagerkosten.',
            'Ein täglicher Hebel ist über mehrere Tage kein Hebel; Schwankung kostet unabhängig von der Richtung.',
            'Finanzierungskosten und Spread sind bei Hebelprodukten die eigentliche Vergütung des Emittenten.',
            'Alle Retail-Hebelprodukte sind Schuldverschreibungen der Bank, kein Sondervermögen.',
          ],
        },
      ],
    },
  },
}
