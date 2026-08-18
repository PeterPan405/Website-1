import type { Irrtum } from '@/lib/irrtuemer'

/**
 * Sätze, die man ständig hört – und was an ihnen dran ist.
 *
 * Wie viele es sind, steht nirgends als Zahl geschrieben: Die Seite zählt
 * `IRRTUEMER.length`, der Zahlenwächter auch. Eine Zahl im Fließtext wäre die
 * erste, die beim nächsten Eintrag falsch wird – und das auf einer Seite über
 * irreführende Zahlen.
 *
 * ## Wie ein Eintrag gebaut ist
 *
 * Zuerst der **Satz, wie er fällt**. Nicht die richtige Aussage: Man erkennt
 * sich an der eigenen Formulierung wieder, nicht an ihrer Korrektur.
 *
 * Dann **was daran richtig ist** – und zwar vor dem Einwand. Fast jeder dieser
 * Sätze ist eine verkürzte Wahrheit; wer ihn übernommen hat, hat nichts falsch
 * gemacht, sondern einen Satz gehört, dem sein Geltungsbereich abhandengekommen
 * ist. Steht der Einwand zuerst, liest sich die Seite als Belehrung, und dann
 * liest sie niemand.
 *
 * Dann **was nicht stimmt**, und zuletzt **die Rechnung**. Die Rechnung ist
 * nicht abgeschrieben: `rechneNach()` erzeugt das Ergebnis aus denselben
 * Funktionen, mit denen die Rechner dieser Website rechnen, und
 * `tests/irrtuemer.test.ts` vergleicht es mit dem, was hier steht.
 *
 * ## Was hier nicht hineingehört
 *
 * **Zahlen ohne Herkunft.** Jede Zahl in dieser Datei kommt aus einer der drei
 * Quellen: aus der Rechnung selbst, aus einem gepflegten Bestand dieses
 * Repositoriums (mit dessen Quelle), oder aus einem Gesetz (mit Fundstelle).
 * Eine Zahl aus dem Gedächtnis wäre hier besonders verlockend – der ganze Text
 * lebt davon, dass er belegt ist – und deshalb besonders schädlich.
 *
 * **Sätze, die niemand sagt.** Ein Irrtum, den man erfinden musste, damit man
 * ihn widerlegen kann, ist keiner.
 *
 * **Spott.** Kein „natürlich falsch", kein „wer das glaubt". Der Ton der Seite
 * ist: *So wird es gesagt, und hier ist die Rechnung.*
 */
export const IRRTUEMER: Irrtum[] = [
  // ----------------------------------------------------- Rendite und Verlust

  {
    slug: 'verlust-ausgleich',
    gruppe: 'rendite',
    satz: 'Wenn mein Depot 50 Prozent verloren hat, brauche ich 50 Prozent Gewinn, um wieder bei null zu sein.',
    richtig:
      'Der Gedanke dahinter stimmt: Was runtergegangen ist, muss wieder hoch. Und bei kleinen Bewegungen fällt der Unterschied kaum auf – nach minus fünf Prozent braucht es 5,3 Prozent.',
    falsch:
      'Die zweite Prozentzahl bezieht sich auf einen kleineren Betrag. Von 100 Euro bleiben nach dem Verlust 50; 50 Prozent davon sind 25, und man landet bei 75. Je größer der Verlust, desto weiter laufen die beiden Zahlen auseinander – das ist der Grund, warum ein großer Verlust nicht doppelt so schlimm ist wie ein halb so großer, sondern schlimmer.',
    beleg: {
      art: 'rechnung',
      text: 'Nach einem Verlust ist der Rest die neue Grundlage. Der nötige Gewinn wächst nicht linear, sondern schießt gegen Ende hoch: 80 Prozent Verlust verlangen 400 Prozent, 90 Prozent verlangen 900.',
      rechnung: {
        titel: 'Was ein Verlust von 50 Prozent zum Ausgleich verlangt',
        zeilen: [
          { was: 'Verlust', wert: 50, einheit: 'prozent' },
          { was: 'Nötiger Gewinn danach', wert: 100, einheit: 'prozent', ergebnis: true },
        ],
        probe: { art: 'erholung' },
      },
    },
    lernen: { text: 'Risiko und Rendite', href: '/lernen/risiko-und-rendite/beginner' },
    glossar: ['rendite', 'volatilitaet'],
  },

  {
    slug: 'mittelwert-null',
    gruppe: 'rendite',
    satz: 'Ein Jahr plus 50, ein Jahr minus 50 – im Schnitt null, also stehe ich wieder da, wo ich angefangen habe.',
    richtig:
      'Der arithmetische Mittelwert der beiden Zahlen ist tatsächlich null. Wer so rechnet, rechnet richtig – nur eine andere Größe aus, als er meint.',
    falsch:
      'Das Depot addiert keine Prozentsätze, es multipliziert Faktoren. Aus 100 Euro werden 150, davon die Hälfte weg sind 75. Der Verlust beträgt ein Viertel, nicht null. Was hier zählt, ist das geometrische Mittel – und das liegt bei rund minus 13,4 Prozent im Jahr.',
    beleg: {
      art: 'rechnung',
      text: 'Dieselbe Funktion rechnet auf der Seite zum Sequenzrisiko. Der Unterschied zwischen beiden Mittelwerten wächst mit der Schwankung: Bei ruhigen Reihen sind sie fast gleich, bei stürmischen weit auseinander.',
      rechnung: {
        titel: 'Plus 50 und minus 50, verkettet',
        zeilen: [
          { was: 'Jahr 1', wert: 50, einheit: 'prozent' },
          { was: 'Jahr 2', wert: -50, einheit: 'prozent' },
          {
            was: 'Mittlere Rendite je Jahr',
            wert: -13.397459621556138,
            einheit: 'prozent',
            ergebnis: true,
          },
        ],
        probe: { art: 'geometrisch' },
      },
    },
    lernen: {
      text: 'Risiko und Rendite',
      href: '/lernen/risiko-und-rendite/fortgeschritten',
    },
    glossar: ['rendite', 'volatilitaet'],
  },

  {
    slug: 'zehn-prozent-hin-und-zurueck',
    gruppe: 'rendite',
    satz: 'Erst zehn Prozent runter, dann zehn Prozent rauf – dann bin ich wieder bei hundert.',
    richtig:
      'Es ist beinahe so. Der Fehler beträgt ein Prozent, und in einer Unterhaltung ist das gleichgültig.',
    falsch:
      'In einer Reihe ist es das nicht. Wer diesen Fehler dreißig Mal hintereinander macht, weil er eine Wertreihe im Kopf zusammenzählt statt zu verketten, liegt am Ende deutlich daneben – und zwar immer in dieselbe Richtung: zu optimistisch.',
    beleg: {
      art: 'rechnung',
      text: 'Der Rückgang bezieht sich auf 100, der Anstieg auf 90. Zehn Prozent von 90 sind neun, nicht zehn. Das fehlende Prozent ist derselbe Effekt wie beim Verlustausgleich, nur klein genug, dass er unbemerkt bleibt.',
      rechnung: {
        titel: 'Hundert Euro, minus zehn Prozent, plus zehn Prozent',
        zeilen: [
          { was: 'Erste Änderung', wert: -10, einheit: 'prozent' },
          { was: 'Zweite Änderung', wert: 10, einheit: 'prozent' },
          { was: 'Stand am Ende', wert: 99, einheit: 'euro', ergebnis: true },
        ],
        probe: { art: 'verkettung', start: 100 },
      },
    },
    glossar: ['rendite'],
  },

  {
    slug: 'dreissig-prozent-in-drei-jahren',
    gruppe: 'rendite',
    satz: 'In drei Jahren hat mein ETF 30 Prozent gemacht – also zehn Prozent im Jahr.',
    richtig:
      'Die Größenordnung stimmt, und für eine grobe Einordnung reicht sie. Bei kurzen Zeiträumen und kleinen Renditen ist der Unterschied zwischen beiden Rechenwegen gering.',
    falsch:
      'Zehn Prozent im Jahr ergeben über drei Jahre nicht 30, sondern 33,1 Prozent – die Erträge des ersten Jahres verzinsen sich mit. Wer aus 30 Prozent Gesamtrendite auf zehn im Jahr schließt, überschätzt sich um fast ein Zehntel. Der richtige Wert liegt bei 9,14 Prozent.',
    beleg: {
      art: 'rechnung',
      text: 'Die Probe: Aus 100 Euro werden mit 9,1393 Prozent über drei Jahre 130 Euro. Genau diese Umrechnung macht die Zeitraumvergleichsseite für jedes Instrument – deshalb steht dort „p. a." und nicht „gesamt".',
      rechnung: {
        titel: 'Was 9,1393 Prozent im Jahr über drei Jahre ergeben',
        zeilen: [
          { was: 'Startkapital', wert: 100, einheit: 'euro' },
          { was: 'Rendite je Jahr', wert: 9.139288, einheit: 'prozent' },
          { was: 'Jahre', wert: 3, einheit: 'jahre' },
          { was: 'Stand am Ende', wert: 130, einheit: 'euro', ergebnis: true },
        ],
        probe: { art: 'zinseszins' },
      },
    },
    lernen: { text: 'Zinseszins', href: '/lernen/zinseszins/beginner' },
    glossar: ['zinseszins', 'rendite'],
  },

  {
    slug: 'verdopplung-verdreifachung',
    gruppe: 'rendite',
    satz: 'Wenn sich mein Geld bei sieben Prozent in zehn Jahren verdoppelt, ist es in dreißig Jahren dreimal so viel.',
    richtig:
      'Die zehn Jahre stimmen ungefähr – die 72er-Regel ergibt 10,3, exakt sind es 10,24. Und dass man in Verdopplungen denkt, ist eine gute Angewohnheit.',
    falsch:
      'Drei Verdopplungen ergeben nicht das Dreifache, sondern das Achtfache. Zinseszins ist keine Addition von Zeitabschnitten. Aus 10.000 Euro werden bei sieben Prozent über dreißig Jahre gut 76.000 – nicht 30.000.',
    beleg: {
      art: 'rechnung',
      text: 'Der Unterschied zwischen 30.000 und 76.000 Euro ist kein Rechenfehler, sondern der ganze Grund, warum früh anfangen mehr bringt als viel einzahlen.',
      rechnung: {
        titel: 'Zehntausend Euro, sieben Prozent, dreißig Jahre',
        zeilen: [
          { was: 'Startkapital', wert: 10_000, einheit: 'euro' },
          { was: 'Rendite je Jahr', wert: 7, einheit: 'prozent' },
          { was: 'Jahre', wert: 30, einheit: 'jahre' },
          { was: 'Stand am Ende', wert: 76_122.55, einheit: 'euro', ergebnis: true },
        ],
        probe: { art: 'zinseszins' },
      },
    },
    lernen: { text: 'Zinseszins', href: '/lernen/zinseszins/beginner' },
    glossar: ['zinseszins'],
  },

  {
    slug: 'ein-prozent-gebuehr',
    gruppe: 'rendite',
    satz: 'Ein Prozent Gebühr im Jahr ist doch nichts.',
    richtig:
      'Für ein einzelnes Jahr ist es fast nichts. Bei 10.000 Euro sind es 100 Euro – weniger, als eine schlechte Woche am Markt kostet.',
    falsch:
      'Die Gebühr fällt jedes Jahr an, und zwar auf den gewachsenen Bestand. Sie nimmt nicht nur den Betrag, sondern auch alles, was dieser Betrag noch verdient hätte. Über dreißig Jahre kostet ein Prozentpunkt mehr laufende Kosten gut ein Sechstel des Endvermögens – bei 200 Euro im Monat und sieben Prozent Bruttorendite.',
    beleg: {
      art: 'rechnung',
      text: 'Gerechnet mit derselben Funktion wie der Kostenrechner: 200 Euro monatlich, dreißig Jahre, sieben Prozent brutto, einmal mit 0,2 und einmal mit 1,2 Prozent laufenden Kosten. Der Anteil bezieht sich auf das Endvermögen der günstigen Anlage.',
      rechnung: {
        titel: 'Was ein Prozentpunkt Kosten über dreißig Jahre wegnimmt',
        zeilen: [
          { was: 'Bruttorendite je Jahr', wert: 7, einheit: 'prozent' },
          {
            was: 'Anteil am Endvermögen, der fehlt',
            wert: 17.64,
            einheit: 'prozent',
            ergebnis: true,
          },
        ],
        probe: { art: 'kosten', jahre: 30, sparrate: 200, guenstig: 0.2, teuer: 1.2 },
      },
    },
    lernen: {
      text: 'Kosten und Gebühren',
      href: '/lernen/kosten-und-gebuehren/beginner',
    },
    glossar: ['ter', 'trackingdifferenz'],
  },

  // -------------------------------------------------- Risiko und Sicherheit

  {
    slug: 'markt-erholt-sich-immer',
    gruppe: 'risiko',
    satz: 'Der Markt hat sich immer wieder erholt.',
    richtig:
      'Für einen breiten, weltweit gestreuten Index über lange Zeiträume ist das bisher zugetroffen. Jeder der großen Einbrüche wurde später überboten – das ist der Grund, warum lange Anlagedauern in jedem Lehrbuch stehen.',
    falsch:
      'Der Satz gilt für den Index, nicht für den Wert. Ein Index tauscht seine Bestandteile aus; was untergeht, fällt heraus und wird ersetzt. Für eine einzelne Aktie gibt es diese Regel nicht, und für einen einzelnen nationalen Markt auch nicht. „Immer" ist außerdem eine Aussage über die Vergangenheit, die als Aussage über die Zukunft gelesen wird.',
    beleg: {
      art: 'daten',
      text: 'Die sechs Einbrüche, die auf dieser Website mit Zahlen hinterlegt sind, reichen von 20 Prozent (1987) bis 85 Prozent (1929). Wie lange die Erholung dauerte, steht dort je Fall dabei – und zwar mit dem Hinweis, für welchen Index die Zahl gilt. Eine gemeinsame Zahl über alle sechs gibt es nicht, weil sie verschiedene Märkte betrifft.',
      quelle: {
        label: 'Lernthema „Die größten Crashs“',
        url: '/lernen/groesste-crashes',
      },
    },
    lernen: { text: 'Die größten Crashs', href: '/lernen/groesste-crashes/beginner' },
    glossar: ['index', 'diversifikation'],
  },

  {
    slug: 'sicherer-hafen',
    gruppe: 'risiko',
    satz: 'In der Krise flüchtet man in sichere Häfen.',
    richtig:
      'In vielen Krisen ist die Nachfrage nach bestimmten Anlagen tatsächlich gestiegen, während Aktien fielen. Das ist beobachtet, nicht erfunden.',
    falsch:
      '„Sicher" ist hier keine Eigenschaft der Anlage, sondern eine Aussage über ihr Verhalten **in einer bestimmten Krise**: Sie fiel weniger oder stieg. Das ist eine Korrelation, und Korrelationen sind nicht stabil – gerade in Krisen ändern sie sich, weil verkauft wird, was sich verkaufen lässt. Der Satz verspricht Werterhalt und meint Gleichlauf.',
    beleg: {
      art: 'rechnung',
      text: 'Hier steht mit Absicht keine Zahl.',
      rechnung: {
        titel: 'Warum hier keine Korrelation steht',
        zeilen: [],
        probe: {
          art: 'keine',
          warum:
            'Eine Korrelation gilt für den Zeitraum, über den sie gemessen wurde, und für keinen anderen. Sie hier hinzuschreiben hieße zu behaupten, sie halte auch beim nächsten Mal – und genau das ist der Irrtum, um den es geht. Wer eine solche Zahl braucht, muss den Zeitraum dazu nennen und darf ihn nicht fortschreiben.',
        },
      },
    },
    glossar: ['korrelation', 'diversifikation'],
  },

  {
    slug: 'tagesgeld-verliert-nichts',
    gruppe: 'risiko',
    satz: 'Auf dem Tagesgeld verliere ich wenigstens nichts.',
    richtig:
      'Nominal stimmt das. Der Kontostand wird nicht kleiner, und für Geld, das in den nächsten Monaten gebraucht wird, ist genau das die richtige Eigenschaft – deshalb liegt der Notgroschen dort und nicht im Depot.',
    falsch:
      'Was zählt, ist die Kaufkraft. Liegt die Inflation über dem Zins, sinkt sie – der Kontostand bleibt gleich, und man kann sich weniger davon kaufen. Bei zwei Prozent Zins und drei Prozent Inflation beträgt der reale Verlust knapp ein Prozent im Jahr, und über zehn Jahre summiert er sich.',
    beleg: {
      art: 'rechnung',
      text: 'Gerechnet als Quotient, nicht als Differenz: Drei minus zwei wäre minus ein Prozent, exakt sind es minus 0,97. Der Unterschied ist bei kleinen Zahlen klein und wächst mit der Inflationsrate.',
      rechnung: {
        titel: 'Zwei Prozent Zins bei drei Prozent Inflation',
        zeilen: [
          { was: 'Zins je Jahr', wert: 2, einheit: 'prozent' },
          { was: 'Inflation je Jahr', wert: 3, einheit: 'prozent' },
          { was: 'Realzins', wert: -0.9708737864, einheit: 'prozent', ergebnis: true },
        ],
        probe: { art: 'realzins' },
      },
    },
    lernen: { text: 'Inflation', href: '/lernen/inflation/beginner' },
    glossar: ['realzins', 'inflation', 'kaufkraft', 'tagesgeld'],
  },

  {
    slug: 'einlagensicherung-depot',
    gruppe: 'risiko',
    satz: 'Meine Wertpapiere sind bis 100.000 Euro geschützt.',
    richtig:
      'Die 100.000 Euro gibt es – und sie schützen zuverlässig. Sie gelten für **Guthaben** bei einer Bank: Girokonto, Tagesgeld, Festgeld, je Kunde und Institut.',
    falsch:
      'Für Wertpapiere gilt eine andere und weitergehende Regel: Sie gehören dem Anleger, die Bank verwahrt sie nur. Bei einer Insolvenz fallen sie nicht in die Masse, sondern werden herausgegeben – ohne Obergrenze. Wer die 100.000 Euro auf sein Depot bezieht, unterschätzt seinen Schutz und schließt daraus womöglich, er müsse auf mehrere Broker verteilen.',
    beleg: {
      art: 'regel',
      text: 'Die gesetzliche Entschädigung deckt Einlagen bis 100.000 Euro je Einleger und Institut (§ 8 Einlagensicherungsgesetz). Wertpapiere sind davon nicht erfasst, weil sie dem Kunden gehören; die Anlegerentschädigung greift nur, wenn die Bank die Herausgabe pflichtwidrig nicht erfüllen kann.',
      quelle: {
        label: '§ 8 Einlagensicherungsgesetz',
        url: 'https://www.gesetze-im-internet.de/einsig/__8.html',
      },
    },
    lernen: { text: 'Einlagensicherung', href: '/lernen/einlagensicherung/beginner' },
    glossar: ['einlagensicherung', 'sondervermoegen', 'depot'],
  },

  {
    slug: 'anbieter-pleite',
    gruppe: 'risiko',
    satz: 'Wenn die Fondsgesellschaft pleitegeht, ist mein ETF weg.',
    richtig:
      'Die Sorge ist berechtigt gestellt – bei vielen Finanzprodukten ist genau das der Fall. Ein Zertifikat zum Beispiel ist eine Schuldverschreibung: Geht der Herausgeber unter, ist das Geld verloren.',
    falsch:
      'Ein Fonds ist Sondervermögen. Er wird getrennt vom Vermögen der Gesellschaft bei einer Verwahrstelle gehalten und fällt nicht in die Insolvenzmasse; im Ernstfall wechselt die Verwaltung. Die verbleibende Frage bei ETFs ist eine andere: Bei Swap-ETFs steckt ein Teil der Wertentwicklung in einem Tauschgeschäft mit einer Gegenpartei.',
    beleg: {
      art: 'regel',
      text: 'Das Sondervermögen ist in § 92 Kapitalanlagegesetzbuch geregelt. Für Swap-ETFs begrenzt die OGAW-Richtlinie das Risiko gegenüber einer einzelnen Gegenpartei auf zehn Prozent des Fondsvermögens – es ist also nicht null, aber gedeckelt und besichert.',
      quelle: {
        label: '§ 92 Kapitalanlagegesetzbuch',
        url: 'https://www.gesetze-im-internet.de/kagb/__92.html',
      },
    },
    lernen: { text: 'Fonds', href: '/lernen/fonds/beginner' },
    glossar: ['sondervermoegen', 'emittentenrisiko', 'zertifikat', 'etf'],
  },

  {
    slug: 'dreissig-aktien',
    gruppe: 'risiko',
    satz: 'Mit dreißig Aktien bin ich breit genug gestreut.',
    richtig:
      'Für das unternehmensspezifische Risiko trifft es weitgehend zu. Der größte Teil davon verschwindet schon mit den ersten zwanzig bis dreißig Werten – jede weitere Aktie bringt danach immer weniger.',
    falsch:
      'Streuung ist keine Frage der Anzahl, sondern der Unabhängigkeit. Dreißig Bankaktien sind eine Wette auf eine Branche, dreißig deutsche Werte eine Wette auf ein Land. Was übrig bleibt, ist das Marktrisiko – und das nimmt keine Anzahl weg.',
    beleg: {
      art: 'daten',
      text: 'Der MSCI World enthält 1.282 Werte, und die zehn größten machen zusammen 26,43 Prozent aus. Ein Index mit über tausend Titeln hat also gut ein Viertel seines Gewichts in zehn Unternehmen – die Anzahl allein sagt über die Streuung wenig.',
      quelle: {
        label: 'Index-Zusammensetzung und Klumpenrisiko',
        url: '/maerkte/klumpenrisiko',
      },
    },
    lernen: { text: 'Portfolio aufbauen', href: '/lernen/portfolio-aufbau/beginner' },
    glossar: ['diversifikation', 'klumpenrisiko', 'korrelation'],
  },

  {
    slug: 'msci-world-weltweit',
    gruppe: 'risiko',
    satz: 'Mit einem MSCI-World-ETF bin ich weltweit investiert.',
    richtig:
      'Weltweiter als mit fast allem anderen. Der Index umfasst 23 Länder und deckt rund 85 Prozent der dortigen Marktkapitalisierung ab – als ein einziges Wertpapier ist das schwer zu schlagen.',
    falsch:
      '„World" heißt hier: entwickelte Märkte. Schwellenländer fehlen vollständig, und weil nach Marktwert gewichtet wird, dominieren die USA. Wer „weltweit" liest und an einen Querschnitt der Weltbevölkerung denkt, hat ein anderes Bild als das, was im Fonds liegt.',
    beleg: {
      art: 'daten',
      text: '23 Länder, 1.282 Werte, rund 85 Prozent Abdeckung der Streubesitz-Marktkapitalisierung in diesen Ländern. Die Länder- und Währungsaufteilung steht mit Zahlen auf der Marktseite.',
      quelle: {
        label: 'Wie viel Dollar in „weltweit" steckt',
        url: '/maerkte/waehrungen-im-weltindex',
      },
    },
    lernen: {
      text: 'Aktien nach Ländern und Branchen',
      href: '/lernen/aktien-laender-branchen/beginner',
    },
    glossar: ['index', 'diversifikation', 'marktkapitalisierung'],
  },

  {
    slug: 'volatilitaet-ist-risiko',
    gruppe: 'risiko',
    satz: 'Je stärker etwas schwankt, desto riskanter ist es.',
    richtig:
      'Als Arbeitsdefinition ist das brauchbar und in der Finanzmathematik die übliche. Schwankung lässt sich messen, Risiko nicht – und was man nicht messen kann, kann man nicht in eine Formel schreiben.',
    falsch:
      'Schwankung nach oben ist im Maß enthalten wie Schwankung nach unten. Und die Umkehrung stimmt nicht: Eine Anlage kann ruhig aussehen und trotzdem alles verlieren – bis zum Tag der Insolvenz schwankt eine Anleihe kaum. Für jemanden, der zwanzig Jahre nicht verkauft, ist Schwankung obendrein ein anderes Problem als für jemanden, der nächstes Jahr an das Geld muss.',
    beleg: {
      art: 'rechnung',
      text: 'Hier steht mit Absicht keine Zahl.',
      rechnung: {
        titel: 'Warum sich das nicht ausrechnen lässt',
        zeilen: [],
        probe: {
          art: 'keine',
          warum:
            'Risiko ist keine Größe mit einer Einheit. Es hängt daran, wann jemand das Geld braucht und was er sich leisten kann zu verlieren – zwei Angaben, die nicht im Kurs stehen. Jede Zahl an dieser Stelle wäre eine Volatilität mit einem anderen Namen und damit genau der Irrtum, um den es geht.',
        },
      },
    },
    lernen: { text: 'Risiko und Rendite', href: '/lernen/risiko-und-rendite/beginner' },
    glossar: ['volatilitaet', 'risikopraemie'],
  },

  // ------------------------------------------------------ Steuern und Kosten

  {
    slug: 'thesaurierend-steuerfrei',
    gruppe: 'steuern',
    satz: 'Bei einem thesaurierenden ETF zahle ich erst beim Verkauf Steuern.',
    richtig:
      'Der größte Teil der Steuer fällt tatsächlich erst beim Verkauf an, und die Stundung ist ein echter Vorteil: Was nicht abgeführt wird, arbeitet weiter mit.',
    falsch:
      'Seit 2018 gibt es die Vorabpauschale. Sie besteuert einen fiktiven Mindestertrag – berechnet aus dem Basiszins des Bundesfinanzministeriums – auch dann, wenn nichts ausgeschüttet wurde. Bezahlt wird sie im Januar, meist durch Einzug vom Verrechnungskonto. Beim späteren Verkauf wird das Gezahlte angerechnet, doppelt besteuert wird also nicht.',
    beleg: {
      art: 'daten',
      text: 'Der Basiszins zum 2. Januar 2026 beträgt 3,20 Prozent. Davon werden 70 Prozent angesetzt, und bei Aktienfonds greift die Teilfreistellung von 30 Prozent. Die Vorabpauschale fällt nur an, wenn der Fonds im Jahr im Wert gestiegen ist – in einem Verlustjahr ist sie null.',
      quelle: {
        label: 'BMF-Schreiben vom 13. Januar 2026, Basiszins nach § 18 Absatz 4 InvStG',
        url: 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Investmentsteuer/2026-01-13-basiszins-berechnung-vorabpauschale.html',
      },
    },
    lernen: { text: 'ETF', href: '/lernen/etf/fortgeschritten' },
    glossar: ['vorabpauschale', 'basiszins', 'thesaurierung', 'teilfreistellung'],
  },

  {
    slug: 'freibetrag-automatisch',
    gruppe: 'steuern',
    satz: 'Die ersten 1.000 Euro Gewinn sind steuerfrei, das macht die Bank automatisch.',
    richtig:
      'Der Betrag stimmt: 1.000 Euro je Person, 2.000 Euro bei Zusammenveranlagung. Und wenn ein Freistellungsauftrag vorliegt, macht die Bank es tatsächlich automatisch.',
    falsch:
      'Ohne Freistellungsauftrag führt die Bank ab dem ersten Euro Steuer ab. Man bekommt das Geld über die Steuererklärung zurück – aber erst im Folgejahr, und nur, wenn man daran denkt. Bei mehreren Banken muss der Betrag außerdem aufgeteilt werden; die Institute wissen nichts voneinander.',
    beleg: {
      art: 'regel',
      text: 'Der Sparerpauschbetrag steht in § 20 Absatz 9 EStG, der Freistellungsauftrag in § 44a EStG. Das Gesetz sieht den Antrag ausdrücklich vor – der Abzug „von Amts wegen" ist nicht vorgesehen.',
      quelle: {
        label: '§ 20 Absatz 9 Einkommensteuergesetz',
        url: 'https://www.gesetze-im-internet.de/estg/__20.html',
      },
    },
    lernen: { text: 'Sparerpauschbetrag', href: '/lernen/sparerpauschbetrag/beginner' },
    glossar: ['sparerpauschbetrag', 'freistellungsauftrag', 'abgeltungsteuer'],
  },

  {
    slug: 'fuenfundzwanzig-prozent',
    gruppe: 'steuern',
    satz: 'Auf Kursgewinne zahle ich 25 Prozent.',
    richtig:
      'Der Steuersatz ist 25 Prozent, und mit Solidaritätszuschlag sind es 26,375. Das ist der Satz, der auf die Bemessungsgrundlage angewendet wird.',
    falsch:
      'Die Bemessungsgrundlage ist selten der ganze Gewinn. Bei Aktienfonds sind 30 Prozent teilfreigestellt, und der Sparerpauschbetrag kommt davor. Wer 2.000 Euro Gewinn aus einem Aktien-ETF hat und seinen Freibetrag noch frei, zahlt effektiv rund 5,3 Prozent – nicht 26,375.',
    beleg: {
      art: 'rechnung',
      text: 'Gerechnet mit derselben Funktion wie der Steuerrechner: 2.000 Euro Ertrag aus einem Aktienfonds, 1.000 Euro freier Sparerpauschbetrag, keine Kirchensteuer. Von 2.000 Euro sind 600 teilfreigestellt, vom Rest deckt der Freibetrag 1.000 – besteuert werden 400.',
      rechnung: {
        titel: 'Was von 2.000 Euro Gewinn wirklich abgeht',
        zeilen: [
          { was: 'Ertrag', wert: 2000, einheit: 'euro' },
          { was: 'Freier Sparerpauschbetrag', wert: 1000, einheit: 'euro' },
          { was: 'Effektive Belastung', wert: 5.275, einheit: 'prozent', ergebnis: true },
        ],
        probe: { art: 'steuer', ertrag: 2000, freibetrag: 1000 },
      },
    },
    lernen: {
      text: 'Sparerpauschbetrag',
      href: '/lernen/sparerpauschbetrag/fortgeschritten',
    },
    glossar: ['abgeltungsteuer', 'teilfreistellung', 'sparerpauschbetrag'],
  },

  {
    slug: 'verluste-verrechnen',
    gruppe: 'steuern',
    satz: 'Verluste kann ich mit meinen Gewinnen verrechnen.',
    richtig:
      'Grundsätzlich ja, und innerhalb derselben Bank passiert es automatisch über die Verlustverrechnungstöpfe. Was übrig bleibt, lässt sich ins nächste Jahr vortragen.',
    falsch:
      'Es gibt zwei getrennte Töpfe. Verluste aus **Aktien** dürfen nur mit Gewinnen aus Aktien verrechnet werden – nicht mit Zinsen, nicht mit Fondsgewinnen, nicht mit Dividenden. Wer im selben Jahr eine Aktie mit Verlust und einen ETF mit Gewinn verkauft, zahlt auf den ETF-Gewinn Steuer, obwohl unterm Strich nichts verdient wurde.',
    beleg: {
      art: 'regel',
      text: 'Die Beschränkung steht in § 20 Absatz 6 Satz 4 EStG. Sie betrifft ausschließlich Aktien im direkten Bestand; Aktien-ETFs fallen nicht darunter, weil sie steuerlich Investmentfonds sind.',
      quelle: {
        label: '§ 20 Absatz 6 Einkommensteuergesetz',
        url: 'https://www.gesetze-im-internet.de/estg/__20.html',
      },
    },
    glossar: ['abgeltungsteuer', 'aktie', 'etf'],
  },

  {
    slug: 'ter-sind-alle-kosten',
    gruppe: 'steuern',
    satz: 'Die TER sagt mir, was der ETF kostet.',
    richtig:
      'Sie ist die wichtigste einzelne Zahl und die einzige, die überall vergleichbar ausgewiesen wird. Für einen ersten Vergleich zweier Fonds auf denselben Index reicht sie.',
    falsch:
      'Sie enthält nicht alles. Transaktionskosten des Fonds stehen nicht darin, der Spread beim eigenen Kauf auch nicht, und Depotgebühren ohnehin nicht. Was am Ende zählt, ist die Trackingdifferenz: der tatsächliche Rückstand des Fonds gegenüber seinem Index. Sie kann kleiner sein als die TER – etwa durch Wertpapierleihe – und größer.',
    beleg: {
      art: 'daten',
      text: 'Auf dieser Website wird die Kostenquote nur dort genannt, wo jemand sie im Basisinformationsblatt des Anbieters nachgeschlagen hat. Steht sie nicht da, sagt die Fondsseite das und verweist auf das Dokument – eine Zahl aus zweiter Hand wäre hier wertlos, weil verbindlich ohnehin das Anbieterdokument ist.',
      quelle: { label: 'Wie jede Kennzahl gerechnet wird', url: '/methoden' },
    },
    lernen: {
      text: 'Kosten und Gebühren',
      href: '/lernen/kosten-und-gebuehren/fortgeschritten',
    },
    glossar: ['ter', 'trackingdifferenz', 'spread', 'wertpapierleihe'],
  },

  {
    slug: 'neobroker-kostenlos',
    gruppe: 'steuern',
    satz: 'Bei meinem Broker ist der Handel kostenlos.',
    richtig:
      'Die Ordergebühr ist es oft wirklich, und das ist gegenüber den früheren fünf bis zehn Euro je Order eine echte Ersparnis – gerade bei kleinen Sparraten war die alte Gebührenstruktur der größte Renditefresser überhaupt.',
    falsch:
      'Bezahlt wird über den Kurs. Der Handelsplatz vergütet den Broker für die zugeleiteten Orders, und die Gegenfinanzierung steckt im Spread – der Differenz zwischen An- und Verkaufskurs. Sie ist nicht ausgewiesen und fällt bei jedem Kauf an. Wer vergleichen will, vergleicht nicht die Ordergebühr, sondern den Spread zur gleichen Uhrzeit.',
    beleg: {
      art: 'daten',
      text: 'Der Spread ist kein Nebenschauplatz: Bei wenig gehandelten Werten und außerhalb der Haupthandelszeiten ist er ein Vielfaches der früheren Ordergebühr. Deshalb steht bei den Handelszeiten dieser Website, wann welcher Heimatmarkt offen ist – ein ETF auf US-Aktien handelt sich am Nachmittag anders als am frühen Morgen.',
      quelle: {
        label: 'Wann welche Börse offen ist',
        url: '/maerkte/handelsfreie-tage',
      },
    },
    lernen: { text: 'Depot und Broker', href: '/lernen/depot-und-broker/beginner' },
    glossar: ['spread', 'broker', 'orderbuch', 'liquiditaet'],
  },

  // ------------------------------------------------------ Markt und Zeitpunkt

  {
    slug: 'warten-bis-billiger',
    gruppe: 'markt',
    satz: 'Ich warte, bis der Markt wieder billiger ist.',
    richtig:
      'Zu einem niedrigeren Kurs zu kaufen ist besser als zu einem höheren – daran ist nichts falsch. Und wer gerade jetzt Geld braucht, soll es nicht anlegen.',
    falsch:
      'Das Warten ist nicht umsonst. Wer ein Jahr an der Seitenlinie steht, verzichtet auf die Rendite dieses Jahres – bei 10.000 Euro und sieben Prozent auf 700 Euro, und über die restliche Anlagedauer auf alles, was diese 700 Euro noch verdient hätten. Der Markt muss also nicht nur fallen, sondern weit genug fallen, um das aufzuwiegen.',
    beleg: {
      art: 'rechnung',
      text: 'Aus 10.000 Euro werden in einem Jahr bei sieben Prozent 10.700. Damit das Warten sich lohnt, muss der Einstiegskurs anschließend mehr als 6,5 Prozent unter dem heutigen liegen – und niemand weiß vorher, ob und wann.',
      rechnung: {
        titel: 'Was ein Jahr Warten kostet',
        zeilen: [
          { was: 'Startkapital', wert: 10_000, einheit: 'euro' },
          { was: 'Rendite je Jahr', wert: 7, einheit: 'prozent' },
          { was: 'Jahre', wert: 1, einheit: 'jahre' },
          { was: 'Stand nach einem Jahr', wert: 10_700, einheit: 'euro', ergebnis: true },
        ],
        probe: { art: 'zinseszins' },
      },
    },
    lernen: {
      text: 'Wann kaufen, wann verkaufen',
      href: '/lernen/wann-kaufen-verkaufen/beginner',
    },
    glossar: ['sparplan', 'cost-average'],
  },

  {
    slug: 'nicht-am-allzeithoch',
    gruppe: 'markt',
    satz: 'Am Allzeithoch kaufe ich nicht.',
    richtig:
      'Der Kurs ist an diesem Tag höher als je zuvor – das ist keine Einbildung, sondern die Definition.',
    falsch:
      'Ein steigender Index ist per Konstruktion oft nahe an seinem Höchststand; das ist die Folge davon, dass er langfristig steigt, nicht ein Warnzeichen. Die Regel schließt außerdem genau die Phasen aus, in denen es aufwärts geht, und lässt einen in den Phasen kaufen, in denen es abwärts geht. Wer sie befolgt, wartet in guten Jahren und greift in schlechten zu.',
    beleg: {
      art: 'daten',
      text: 'Wie weit jedes geführte Instrument gerade von seinem 52-Wochen-Hoch entfernt ist, steht auf der Marktseite – täglich neu gerechnet aus den eigenen Kursreihen. Wer die Verteilung ansieht, sieht, wie oft „nah am Hoch" der Normalzustand ist.',
      quelle: { label: '52-Wochen-Übersicht', url: '/maerkte/52-wochen' },
    },
    lernen: {
      text: 'Wann kaufen, wann verkaufen',
      href: '/lernen/wann-kaufen-verkaufen/beginner',
    },
    glossar: ['index', 'kurs'],
  },

  {
    slug: 'cost-average-rendite',
    gruppe: 'markt',
    satz: 'Der Cost-Average-Effekt bringt mehr Rendite.',
    richtig:
      'Ein Sparplan kauft bei niedrigen Kursen mehr Anteile als bei hohen – das ist arithmetisch zwingend und sorgt dafür, dass der Durchschnittspreis unter dem Durchschnittskurs liegt.',
    falsch:
      'Das ist ein Vergleich zwischen zwei Sparplänen, nicht zwischen Sparplan und Einmalanlage. Wer heute schon das ganze Geld hat und es über zwölf Monate verteilt, hält im Mittel ein halbes Jahr lang die Hälfte in bar – und verzichtet in einem steigenden Markt auf deren Rendite. Der Nutzen der Verteilung ist die kleinere Bandbreite des Ergebnisses, nicht ihr höherer Mittelwert.',
    beleg: {
      art: 'rechnung',
      text: 'Hier steht mit Absicht keine Zahl.',
      rechnung: {
        titel: 'Warum hier kein Vorsprung steht',
        zeilen: [],
        probe: {
          art: 'keine',
          warum:
            'Ob Verteilen oder Einmalanlage besser abschneidet, hängt allein davon ab, was der Markt in diesen zwölf Monaten tut. Jede Zahl hier wäre die Auswahl eines Zeitraums, der zur gewünschten Aussage passt – und das ist derselbe Fehler wie der, den der Satz macht. Wer das messen will, muss über alle möglichen Startzeitpunkte rechnen und die Bandbreite nennen, nicht den Mittelwert.',
        },
      },
    },
    lernen: {
      text: 'Cost-Average und Sparplan',
      href: '/lernen/cost-average-sparplan/beginner',
    },
    glossar: ['cost-average', 'sparplan'],
  },

  {
    slug: 'dividende-zusatzertrag',
    gruppe: 'markt',
    satz: 'Dividenden sind Geld, das ich zusätzlich zum Kursgewinn bekomme.',
    richtig:
      'Es ist echtes Geld, es kommt aufs Konto, und dass ein Unternehmen ausschütten kann, sagt etwas über seine Verfassung. Für jemanden, der aus dem Depot leben will, ist ein planbarer Zahlungsstrom obendrein praktisch.',
    falsch:
      'Am Ex-Tag verlässt das Geld das Unternehmen, und der Kurs wird um denselben Betrag gemindert – das ist keine Marktreaktion, sondern eine rechnerische Anpassung. Aus 100 Euro Kurs werden 97 Euro Kurs und 3 Euro auf dem Konto. Reicher ist man in dem Moment nicht, und in Deutschland ärmer: Auf die Ausschüttung fällt sofort Steuer an, auf einen nicht realisierten Kursgewinn nicht.',
    beleg: {
      art: 'rechnung',
      text: 'Deshalb rechnet ein Performanceindex Ausschüttungen wieder ein und ein Kursindex nicht – und deshalb sind die beiden über zehn Jahre nicht vergleichbar.',
      rechnung: {
        titel: 'Kurs 100 Euro, Dividende 3 Euro, Ex-Tag',
        zeilen: [
          { was: 'Kursabschlag', wert: -3, einheit: 'prozent' },
          { was: 'Auf dem Konto, in Prozent des Kurses', wert: 0, einheit: 'prozent' },
          { was: 'Kurs am Ex-Tag', wert: 97, einheit: 'euro', ergebnis: true },
        ],
        probe: { art: 'verkettung', start: 100 },
      },
    },
    lernen: { text: 'Aktie', href: '/lernen/aktie/fortgeschritten' },
    glossar: ['dividende', 'ex-tag', 'ausschuettung', 'thesaurierung'],
  },

  {
    slug: 'dax-punktestand',
    gruppe: 'markt',
    satz: 'Der DAX steht höher als der Dow Jones – der deutsche Markt läuft also besser.',
    richtig:
      'Beide Zahlen sind Indexstände, beide steigen, wenn ihre Märkte steigen. Der Vergleich zweier Stände desselben Index über die Zeit ist auch völlig in Ordnung.',
    falsch:
      'Zwei Indexstände sind untereinander bedeutungslos – jeder hat einen eigenen Startwert und einen eigenen Starttag. Hinzu kommen zwei bauartbedingte Unterschiede: Der DAX ist ein Performanceindex und rechnet Dividenden ein, der Dow ein Kursindex. Und der Dow gewichtet nach Aktienkurs, nicht nach Unternehmenswert – eine teure Aktie zählt dort mehr als ein großes Unternehmen.',
    beleg: {
      art: 'daten',
      text: 'Was ein Index misst und wie er gewichtet, steht bei jedem geführten Index auf seiner Seite. Vergleichbar werden zwei Indizes erst, wenn man beide auf denselben Starttag normiert – genau das macht der Vergleich auf dieser Website.',
      quelle: {
        label: 'Performanceindex und Kursindex nebeneinander',
        url: '/verwechslungen',
      },
    },
    lernen: {
      text: 'Wie der Markt funktioniert',
      href: '/lernen/wie-funktioniert-der-markt/beginner',
    },
    glossar: ['index', 'marktkapitalisierung', 'dividende'],
  },

  {
    slug: 'niedriges-kgv-billig',
    gruppe: 'markt',
    satz: 'Ein niedriges KGV heißt, die Aktie ist billig.',
    richtig:
      'Das KGV setzt den Preis ins Verhältnis zum Gewinn, und bei zwei sonst gleichen Unternehmen ist das niedrigere tatsächlich das günstigere. Als erste Sortierung ist die Kennzahl brauchbar.',
    falsch:
      '„Sonst gleich" ist die Bedingung, die selten erfüllt ist. Ein niedriges KGV kann heißen: Der Markt erwartet, dass der Gewinn fällt. Branchen unterscheiden sich außerdem systematisch – Versorger liegen dauerhaft niedriger als Software, ohne dass das eine billig und das andere teuer wäre. Und das KGV blickt zurück; das erwartete kann weit davon abweichen.',
    beleg: {
      art: 'daten',
      text: 'Für den MSCI World stehen beide Werte nebeneinander: 24,25 auf Basis der berichteten Gewinne, 18,76 auf Basis der erwarteten. Dieselbe Kennzahl, dieselbe Firmenauswahl, ein Unterschied von fast einem Viertel – allein daran, welchen Gewinn man einsetzt.',
      quelle: {
        label: 'Index-Zusammensetzung und Kennzahlen',
        url: '/maerkte/klumpenrisiko',
      },
    },
    lernen: {
      text: 'Worauf Einsteiger achten',
      href: '/lernen/worauf-achten-einsteiger/fortgeschritten',
    },
    glossar: ['kgv', 'fundamentalanalyse', 'innerer-wert'],
  },

  // --------------------------------------------------------- Zahlen lesen

  {
    slug: 'prozent-prozentpunkt',
    gruppe: 'zahlen',
    satz: 'Der Zins ist von zwei auf drei Prozent gestiegen – also um ein Prozent.',
    richtig: 'Die Differenz beträgt eins, und im Alltag versteht jeder, was gemeint ist.',
    falsch:
      'Um ein Prozent gestiegen wären 2,02 Prozent. Der Anstieg von zwei auf drei ist ein **Prozentpunkt** – und relativ betrachtet ein Anstieg um 50 Prozent. Wer beides verwechselt, verwechselt es auch bei Gebühren: Eine Erhöhung der Kostenquote von 0,2 auf 0,4 Prozent klingt nach „0,2 Prozent mehr" und ist eine Verdopplung.',
    beleg: {
      art: 'rechnung',
      text: 'Der Unterschied ist nicht sprachliche Feinheit, sondern der Faktor, um den sich der Betrag ändert.',
      rechnung: {
        titel: 'Von zwei auf drei Prozent',
        zeilen: [
          { was: 'Neuer Zins', wert: 3, einheit: 'prozent' },
          { was: 'Alter Zins', wert: 2, einheit: 'prozent' },
          { was: 'Verhältnis', wert: 1.5, einheit: 'faktor', ergebnis: true },
        ],
        probe: { art: 'verhaeltnis' },
      },
    },
    glossar: ['leitzins', 'effektivzins'],
  },

  {
    slug: 'durchschnitt-typisch',
    gruppe: 'zahlen',
    satz: 'Der Durchschnitt zeigt, wie groß ein typisches Unternehmen im Index ist.',
    richtig:
      'Der Mittelwert ist richtig gerechnet und beantwortet eine sinnvolle Frage: Wie viel Marktwert kommt auf einen Indexwert, wenn man alles gleichmäßig verteilt.',
    falsch:
      'Nur ist die Verteilung extrem schief. Im MSCI World liegt der mittlere Marktwert bei 69,8 Milliarden Dollar, der Median bei 24,3 – der Durchschnitt ist fast dreimal so hoch wie der Wert in der Mitte. Er wird von wenigen sehr großen Unternehmen nach oben gezogen. Mehr als die Hälfte aller Indexmitglieder liegt unter dem Durchschnitt, und „typisch" ist keines von beiden allein.',
    beleg: {
      art: 'rechnung',
      text: 'Beide Zahlen stehen im Factsheet des Index und sind hier gepflegt hinterlegt. Wo eine Verteilung schief ist, gehören immer beide genannt – ein Mittelwert kann nichts finden, was er verdünnt.',
      rechnung: {
        titel: 'Mittelwert gegen Median im MSCI World',
        zeilen: [
          { was: 'Mittlerer Marktwert, in Mio. USD', wert: 69_833.43, einheit: 'euro' },
          { was: 'Median, in Mio. USD', wert: 24_316.69, einheit: 'euro' },
          { was: 'Verhältnis', wert: 2.8718, einheit: 'faktor', ergebnis: true },
        ],
        probe: { art: 'verhaeltnis' },
      },
      quelle: {
        label: 'Index-Zusammensetzung und Klumpenrisiko',
        url: '/maerkte/klumpenrisiko',
      },
    },
    glossar: ['marktkapitalisierung', 'klumpenrisiko'],
  },

  {
    slug: 'inflation-sinkt',
    gruppe: 'zahlen',
    satz: 'Die Inflation sinkt – dann werden die Sachen wieder billiger.',
    richtig:
      'Eine sinkende Rate ist eine Entlastung, und sie ist der Grund, warum Notenbanken irgendwann aufhören, die Zinsen zu erhöhen.',
    falsch:
      'Die Inflationsrate misst, wie schnell die Preise steigen – nicht, wie hoch sie sind. Sinkt sie von fünf auf zwei Prozent, steigen die Preise langsamer, aber sie steigen. Billiger würde es erst bei einer negativen Rate, und die heißt Deflation und ist kein Wunschzustand. Was einmal an Kaufkraft weg ist, kommt durch eine niedrigere Rate nicht zurück.',
    beleg: {
      art: 'rechnung',
      text: 'Zwei Jahre mit fünf und danach zwei Prozent: Der Preis liegt am Ende 7,1 Prozent über dem Ausgangswert, obwohl die Rate gefallen ist.',
      rechnung: {
        titel: 'Fünf Prozent, dann zwei Prozent',
        zeilen: [
          { was: 'Jahr 1', wert: 5, einheit: 'prozent' },
          { was: 'Jahr 2', wert: 2, einheit: 'prozent' },
          {
            was: 'Preis am Ende, Start 100',
            wert: 107.1,
            einheit: 'euro',
            ergebnis: true,
          },
        ],
        probe: { art: 'verkettung', start: 100 },
      },
    },
    lernen: { text: 'Inflation', href: '/lernen/inflation/beginner' },
    glossar: ['inflation', 'kaufkraft', 'realzins'],
  },

  {
    slug: 'rendite-seit-auflage',
    gruppe: 'zahlen',
    satz: 'Der Fonds hat seit Auflage acht Prozent im Jahr gemacht – damit kann ich rechnen.',
    richtig:
      'Die Zahl ist meist korrekt berechnet und geprüft. Sie sagt genau das, was sie sagt: was in diesem Zeitraum herauskam.',
    falsch:
      'Der Zeitraum ist nicht neutral gewählt, sondern beginnt am Auflagetag – und Fonds werden aufgelegt, wenn ein Thema gut läuft. Fonds, die schlecht liefen, werden geschlossen oder verschmolzen und tauchen in keiner Übersicht mehr auf. Was übrig bleibt, ist eine Auswahl der Überlebenden. Eine Zahl „seit Auflage" ist deshalb keine Erwartung, sondern eine Beschreibung eines bestimmten Fensters.',
    beleg: {
      art: 'rechnung',
      text: 'Hier steht mit Absicht keine Zahl.',
      rechnung: {
        titel: 'Warum es hier keine Vergleichszahl gibt',
        zeilen: [],
        probe: {
          art: 'keine',
          warum:
            'Um zu beziffern, wie stark der Überlebenseffekt eine Fondsübersicht verzerrt, bräuchte man die Zahlen der eingestellten Fonds – also genau die Daten, die niemand mehr veröffentlicht. Eine Zahl hier wäre geschätzt, und eine geschätzte Zahl in einem Text über irreführende Zahlen wäre die Pointe an der falschen Stelle.',
        },
      },
    },
    lernen: { text: 'Fonds', href: '/lernen/fonds/fortgeschritten' },
    glossar: ['rendite', 'fonds'],
  },

  {
    slug: 'sieben-prozent-jedes-jahr',
    gruppe: 'zahlen',
    satz: 'Aktien bringen sieben Prozent im Jahr.',
    richtig:
      'Als langfristiger Mittelwert breiter Aktienmärkte ist die Größenordnung gebräuchlich, und für eine überschlägige Planung über Jahrzehnte ist sie brauchbar. Auch die Rechner dieser Website schlagen sie als Annahme vor.',
    falsch:
      'Sieben Prozent ist ein Mittelwert über sehr lange Zeiträume, kein Jahresergebnis. Einzelne Jahre liegen weit darüber und weit darunter, und das Jahr, in dem jemand sein Geld braucht, ist keines der durchschnittlichen. Wer mit sieben Prozent im Jahr plant, plant mit einer Zahl, die es in kaum einem einzelnen Jahr gegeben hat.',
    beleg: {
      art: 'daten',
      text: 'Die Jahresrenditen der geführten Instrumente stehen einzeln auf ihren Seiten – Jahr für Jahr, aus den eigenen Kursreihen gerechnet. Ein Blick auf die Spalte reicht: Die Spannweite ist das Eigentliche, der Mittelwert nur ihre Zusammenfassung.',
      quelle: { label: 'Zwei Zeiträume nebeneinander', url: '/maerkte' },
    },
    lernen: { text: 'Risiko und Rendite', href: '/lernen/risiko-und-rendite/beginner' },
    glossar: ['rendite', 'volatilitaet', 'risikopraemie'],
  },

  // ------------------------------------------------------- Zinsen und Anleihen

  {
    slug: 'anleihen-sind-sicher',
    gruppe: 'zinsen',
    satz: 'Anleihen sind die sichere Seite im Depot.',
    richtig:
      'Wer eine Anleihe guter Bonität bis zur Fälligkeit hält, bekommt Kupon und Nennwert – der Ertrag steht am Kauftag fest. Das ist eine Eigenschaft, die Aktien nicht haben.',
    falsch:
      'Zwischen Kauf und Fälligkeit schwankt der Kurs, und zwar gegenläufig zum Marktzins. Wer vorher verkaufen muss, verkauft zum Tageskurs. Bei langen Restlaufzeiten sind die Ausschläge erheblich: Eine zehnjährige Anleihe verliert bei einem Zinsanstieg um zwei Prozentpunkte rund ein Sechstel ihres Kurses. „Sicher" gilt für das Endergebnis bei Endfälligkeit, nicht für den Weg dahin.',
    beleg: {
      art: 'daten',
      text: 'Der Anleihenrechner dieser Website zeigt beides: den exakten Kurs nach der Zinsänderung und das, was die Duration vorhergesagt hätte. Die Differenz ist die Konvexität und fällt immer zugunsten des Anleihebesitzers aus.',
      quelle: { label: 'Anleihen: Kurs, Rendite und Duration', url: '/anleihen' },
    },
    lernen: { text: 'Staatsanleihe', href: '/lernen/staatsanleihe/fortgeschritten' },
    glossar: ['staatsanleihe', 'kupon', 'nennwert', 'bonitaet'],
  },

  {
    slug: 'zinsen-steigen-gut',
    gruppe: 'zinsen',
    satz: 'Die Zinsen steigen – gut für meinen Anleihen-ETF.',
    richtig:
      'Für neu gekaufte Anleihen ist es gut, und ein Fonds kauft laufend nach. Nach einigen Jahren liegt die laufende Verzinsung des Fonds höher als vorher – das ist der Grund, warum ein Zinsanstieg für langfristige Anleger am Ende ein Gewinn ist.',
    falsch:
      'Zuerst kommt der Kursverlust, und zwar sofort. Die alten Anleihen im Bestand verzinsen sich schlechter als die neuen und werden deshalb billiger. Ein Anleihen-ETF hat kein Fälligkeitsdatum; er rollt seinen Bestand fortlaufend weiter. Ob und wann sich der Kursverlust durch die höheren Kupons ausgleicht, hängt an der Duration – grob: nach ungefähr so vielen Jahren, wie die Duration angibt.',
    beleg: {
      art: 'daten',
      text: 'Wie stark der Kurs auf eine Zinsänderung reagiert, hängt fast ausschließlich an der Restlaufzeit. Der Rechner zeigt es für jede Kombination aus Kupon, Laufzeit und Marktzins – und daneben den Näherungswert aus der Duration.',
      quelle: { label: 'Anleihen: Zinsschock und Duration', url: '/anleihen' },
    },
    lernen: {
      text: 'Schuldverschreibung',
      href: '/lernen/schuldverschreibung/fortgeschritten',
    },
    glossar: ['kupon', 'leitzins', 'staatsanleihe'],
  },

  {
    slug: 'leitzins-ist-mein-zins',
    gruppe: 'zinsen',
    satz: 'Die EZB hat die Zinsen gesenkt – dann bekomme ich jetzt weniger Tagesgeld.',
    richtig:
      'Die Richtung stimmt fast immer, und der Zusammenhang ist real: Banken legen überschüssiges Geld bei der Notenbank an, und was sie dort bekommen, bestimmt, was sie selbst bieten müssen.',
    falsch:
      'Der Leitzins ist der Preis, zu dem Banken sich bei der Notenbank Geld beschaffen – nicht der Zins für Kunden. Zwischen beiden liegt die Geschäftspolitik der Bank: Senkungen werden schnell weitergegeben, Erhöhungen langsam. Und es gibt mehrere Leitzinsen; welcher gemeint ist, steht in der Meldung meist nicht dabei.',
    beleg: {
      art: 'daten',
      text: 'Die drei Zinssätze der EZB – Hauptrefinanzierung, Einlagefazilität, Spitzenrefinanzierung – werden auf dieser Website getrennt geführt und mit Datum der Beschlussfassung geführt. Für Tagesgeld ist die Einlagefazilität der aussagekräftigste, weil sie die Alternative der Bank beschreibt.',
      quelle: { label: 'Anleihen, Marktzins und Duration', url: '/anleihen' },
    },
    lernen: {
      text: 'Notenbanken und Geldpolitik',
      href: '/lernen/notenbanken-geldpolitik/beginner',
    },
    glossar: ['leitzins', 'notenbank', 'tagesgeld'],
  },

  {
    slug: 'schulden-schlecht',
    gruppe: 'zinsen',
    satz: 'Ein Staat mit hohen Schulden steht schlecht da.',
    richtig:
      'Zinslast bindet Haushaltsmittel, die anderswo fehlen, und eine hohe Quote schränkt den Spielraum in der nächsten Krise ein. Beides ist richtig und wird von Ratingagenturen genau so bewertet.',
    falsch:
      'Der absolute Betrag sagt für sich nichts – deshalb wird er ins Verhältnis zur Wirtschaftsleistung gesetzt. Entscheidend ist außerdem, in welcher Währung geschuldet wird, wie lang die Laufzeiten sind und zu welchem Zins refinanziert wird. Ein Land, das in eigener Währung schuldet, ist in einer grundsätzlich anderen Lage als eines, das auf Dollar angewiesen ist.',
    beleg: {
      art: 'daten',
      text: 'Die Schuldenstände werden hier je Land als Quote zur Wirtschaftsleistung geführt, mit dem Stichtag der Meldung. Ein Vergleich absoluter Beträge zwischen zwei Ländern steht nirgends – er wäre eine Zahl ohne Bezugsgröße.',
      quelle: { label: 'Staatsverschuldung im Vergleich', url: '/staatsverschuldung' },
    },
    lernen: {
      text: 'Schulden und Kredit',
      href: '/lernen/schulden-und-kredit/fortgeschritten',
    },
    glossar: ['staatsanleihe', 'bonitaet', 'verschuldungsgrad'],
  },
]
