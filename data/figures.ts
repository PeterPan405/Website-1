/**
 * Verzeichnis der Grafiken im Lernbereich.
 *
 * ## Warum gezeichnetes SVG und keine Bilddateien
 *
 * Die Grafiken sind handgeschriebenes SVG im HTML, keine hochgeladenen Bilder.
 * Das hat vier Gründe, von denen jeder für sich schon reichen würde:
 *
 * - **Rechte.** Für ein fremdes Bild bräuchte es eine Lizenz und einen
 *   Bildnachweis. Was hier gezeichnet wird, gehört uns.
 * - **Zahlen.** Die Werte in den Grafiken stammen aus denselben Funktionen wie
 *   die Tabellen daneben (`lib/finance.ts`). Ein Bild wäre eine zweite,
 *   unabhängige Quelle für dieselbe Zahl – und die geht irgendwann auseinander.
 *   Eine Grafik, die der Tabelle über ihr widerspricht, ist schlimmer als gar
 *   keine Grafik.
 * - **Darstellung.** SVG bleibt bei jeder Spaltenbreite scharf, übernimmt die
 *   Farben des hellen wie des dunklen Themes und braucht kein JavaScript. Die
 *   Seiten werden statisch gebaut; die Grafik steht fertig im HTML.
 * - **Zugänglichkeit.** Jede Grafik trägt `<title>` und `<desc>`. Wer sie nicht
 *   sehen kann, bekommt den Inhalt vorgelesen statt „Bild“.
 *
 * ## Was hier bewusst fehlt
 *
 * Karikaturen und gezeichnete Illustrationen sind nicht dabei. Sie ließen sich
 * hier nicht ehrlich herstellen: Zeichnungen von Hand gibt es nicht, und
 * fremdes Bildmaterial hätte eine Lizenz- und Urheberfrage im Schlepptau, die
 * eine Bildungsseite sich nicht einhandeln sollte. Was diese Grafiken statt
 * dessen leisten, ist der eigentliche Zweck einer Karikatur: eine Aussage in
 * einem Blick sichtbar machen.
 *
 * ## Aufbau
 *
 * Hier stehen nur Kennung und Beschreibung – die Zeichnung selbst liegt unter
 * `components/content/figures/`. Die Trennung ist nicht kosmetisch: Daten
 * dürfen in diesem Projekt nicht von Komponenten abhängen, und `data/content.ts`
 * braucht die Kennungen für das Blockmodell.
 */

export type FigureId =
  /** Einfacher Zins gegen Zinseszins über 40 Jahre. */
  | 'zins-gerade-vs-kurve'
  /** Drei Sparer mit gleicher Rate und unterschiedlichem Startalter. */
  | 'zins-frueh-vs-spaet'
  /** Endkapital bei vier Kostenquoten. */
  | 'zins-kosten'
  /** Plus 50 Prozent und minus 50 Prozent ergeben minus 25 Prozent. */
  | 'zins-volatilitaetsbremse'
  /** Hundert Anteile, davon wenige die eigenen. */
  | 'aktie-anteil'
  /** Der Kursabschlag am Ausschüttungstag. */
  | 'aktie-dividendenabschlag'
  /** Geldkurs, Briefkurs und die Spanne dazwischen. */
  | 'aktie-spread'
  /** Aktie, Anleihe, Immobilie und Rohstoff im Vergleich des laufenden Ertrags. */
  | 'rohstoffe-kein-ertrag'
  /** Terminkurve in Contango und in Backwardation. */
  | 'rohstoffe-rollkurve'
  /** Ländergewichtung des MSCI World. */
  | 'msci-world-laender'
  /** Kontostand und Kaufkraft desselben Betrags über 30 Jahre. */
  | 'inflation-kaufkraft'
  /** Anleihekurs über dem Marktzins, für drei Restlaufzeiten. */
  | 'anleihe-kurs-und-zins'
  /** Kursverlust je Restlaufzeit bei zwei Prozentpunkten mehr Zins. */
  | 'staatsanleihe-zinsschock'
  /** Ergebnis von Kauf- und Verkaufoption bei Verfall. */
  | 'option-auszahlung'
  /** Wie die Prämie mit der Restlaufzeit schrumpft. */
  | 'option-zeitwertverfall'
  /** Wie sich die gleichbleibende Kreditrate in Zins und Tilgung aufteilt. */
  | 'kredit-zins-und-tilgung'
  /** Laufzeit desselben Darlehens bei vier Anfangstilgungen. */
  | 'kredit-anfangstilgung'
  /** Welcher Gewinn nötig ist, um einen Verlust auszugleichen. */
  | 'risiko-erholung'
  /** Gesamtrendite ohne die besten Wochen. */
  | 'timing-beste-wochen'
  /** Heutiges Netto gegen gesetzliche Nettorente. */
  | 'rente-luecke'
  /** Der Weg einer Wertpapierorder vom Broker bis ins Depot. */
  | 'boerse-vom-klick-zur-buchung'
  /** Der Weg einer Zahlung durch ein Blockchain-Netz. */
  | 'blockchain-zahlung'
  /** Vom Leitzins über die Banken bis zu den Preisen. */
  | 'notenbank-transmission'
  /** Die Reihenfolge vor dem ersten Wertpapierkauf. */
  | 'einsteiger-reihenfolge'
  /** Kauf- und Verkaufseite eines Orderbuchs mit dem Spread dazwischen. */
  | 'markt-orderbuch'
  /** Zins aufs Tagesgeldkonto gegen die Inflation desselben Jahres. */
  | 'tagesgeld-realzins'
  /** Wie viele Anteile eine gleichbleibende Rate bei schwankendem Kurs kauft. */
  | 'sparplan-durchschnittspreis'
  /** Ergebnis einer Fremdwährungsanlage bei vier Wechselkursen. */
  | 'waehrung-ergebnis'
  /** Welchen Hebel eine Sicherheitsleistung ergibt – und wann der Einsatz weg ist. */
  | 'derivat-hebel'
  /** Gesicherte und ungesicherte Anteile eines Bankguthabens. */
  | 'einlagensicherung-grenze'
  /** Ordergebühr und Spread nach Ordergröße. */
  | 'depot-orderkosten'
  /** Endkapital desselben Sparplans bei fünf Kostenquoten. */
  | 'kosten-endkapital'
  /** Zwei Sparverläufe, die sich um einen Prozentpunkt unterscheiden. */
  | 'psychologie-verhaltensluecke'
  /** Mehr sparen gegen mehr Rendite, über vierzig Jahre. */
  | 'budget-hebel'
  /** Wie der Aktienanteil ohne Zutun über die geplante Quote steigt. */
  | 'portfolio-drift'
  /** Bis zu welchem Depotwert der Sparerpauschbetrag reicht. */
  | 'sparerpauschbetrag-grenze'
  /** Von der beworbenen Mietrendite zu dem, was übrig bleibt. */
  | 'immobilie-nettorendite'
  /** Die Bitcoin-Umlaufmenge nach dem Emissionsplan. */
  | 'bitcoin-angebot'
  /** Tiefe und Erholungsdauer der großen Kurseinbrüche. */
  | 'crashes-erholung'
  /** Warum das Fondsvermögen in keine Insolvenzmasse fällt. */
  | 'fonds-sondervermoegen'
  /** Dieselben Renditejahre in beiden Reihenfolgen, mit Entnahme. */
  | 'risiko-sequenz'
  /** Das Delta einer Kaufoption über dem Kurs des Basiswerts. */
  | 'option-delta'
  /** Tatsächliche Kursänderung gegen die Vorhersage der Duration. */
  | 'anleihe-konvexitaet'
  /** Jährlich versteuert gegen erst beim Verkauf versteuert. */
  | 'zinseszins-steuerstundung'
  /** Was von einer Nominalrendite nach Steuer und Inflation übrig bleibt. */
  | 'inflation-steuer'
  /** Wertänderung des Objekts, umgerechnet auf das Eigenkapital. */
  | 'immobilie-hebel'
  /** Warum ein Hebelprodukt nach Hin und Her zurückbleibt. */
  | 'derivat-pfadabhaengigkeit'
  /** Wie die Schwankung eines Depots mit der Zahl der Titel sinkt. */
  | 'streuung-titelzahl'
  /** Vier Entnahmeraten, gerechnet gegen beide Reihenfolgen. */
  | 'portfolio-entnahme'
  /** Steuerfreies Gold gegen ein Wertpapier auf denselben Preis. */
  | 'rohstoffe-gold-steuer'

export interface FigureMeta {
  /** Kurzer Titel – wird als `<title>` im SVG vorgelesen. */
  title: string
  /**
   * Was die Grafik zeigt, in einem Satz.
   *
   * Landet als `<desc>` im SVG und ersetzt die Grafik für alle, die sie nicht
   * sehen. Deshalb inhaltlich, nicht formal: „Die Kurve verdreifacht sich in
   * vierzig Jahren“ hilft, „Ein Liniendiagramm mit zwei Kurven“ nicht.
   *
   * Optional, weil viele Zeichnungen ihre Beschreibung selbst mitbringen: Wo
   * die Zahlen beim Bauen aus `lib/` entstehen, gehört die Beschreibung
   * dorthin, wo sie entstehen – sonst stünden hier Werte, die nach der
   * nächsten Änderung still danebenliegen. Fehlt beides, bricht der Build ab;
   * eine Grafik ohne Vorlesefassung darf es nicht geben.
   */
  description?: string
  /** Bildunterschrift unter der Grafik. */
  caption: string
}

export const figureMeta: Record<FigureId, FigureMeta> = {
  'zins-gerade-vs-kurve': {
    title: 'Einfacher Zins und Zinseszins im Vergleich',
    description:
      'Zwei Verläufe für 10.000 Euro bei 6 Prozent über 40 Jahre. Beim einfachen Zins wächst das Kapital als Gerade auf 34.000 Euro, weil die Erträge jedes Jahr entnommen werden. Bleiben sie liegen, wird daraus eine Kurve, die immer steiler wird und bei rund 103.000 Euro endet – dem Dreifachen.',
    caption:
      'Derselbe Zinssatz, derselbe Startbetrag. Der einzige Unterschied ist, ob die Erträge liegen bleiben.',
  },
  'zins-frueh-vs-spaet': {
    title: 'Startalter gegen Sparrate',
    description:
      'Drei Sparer zahlen bis 67 monatlich 200 Euro bei 6 Prozent ein. Wer mit 25 beginnt, zahlt rund das Doppelte ein wie jemand, der mit 45 beginnt, landet aber bei rund dem Vierfachen. Der dunkle Teil jedes Balkens ist das eingezahlte Geld, der helle sind die Erträge.',
    caption:
      'Die eingezahlten Beträge unterscheiden sich um den Faktor zwei, die Ergebnisse um den Faktor vier. Der Unterschied steckt vollständig in den Erträgen.',
  },
  'zins-kosten': {
    title: 'Wirkung laufender Kosten über 30 Jahre',
    description:
      'Vier Sparpläne über 200 Euro monatlich und 30 Jahre bei 6 Prozent Bruttorendite, belastet mit 0,2 bis 1,8 Prozent laufenden Kosten. Zwischen der günstigsten und der teuersten Variante liegen rund 50.000 Euro – etwa zwei Drittel aller Einzahlungen.',
    caption:
      'Der graue Teil jedes Balkens ist das, was die Kosten gegenüber einer Anlage ganz ohne Gebühren übrig gelassen hätten.',
  },
  'zins-volatilitaetsbremse': {
    title: 'Warum ein Durchschnitt von null Geld kostet',
    description:
      'Aus 100 Euro werden nach einem Plus von 50 Prozent 150 Euro und nach einem anschließenden Minus von 50 Prozent 75 Euro. Der Durchschnitt der beiden Jahresrenditen ist null, das Ergebnis ist ein Verlust von einem Viertel.',
    caption:
      'Plus 50 und minus 50 Prozent heben sich nicht auf: Das Minus wirkt auf den größeren Betrag.',
  },
  'aktie-anteil': {
    title: 'Was eine Aktie ist',
    description:
      'Ein Quadrat aus hundert gleichen Feldern steht für das ganze Unternehmen; jedes Feld ist ein Prozent. Fünf Felder sind hervorgehoben – so viel gehört jemandem, dem fünf Prozent der Aktien gehören: fünf Prozent der Fabriken, der Marken, der Patente, der Schulden und der künftigen Gewinne.',
    caption:
      'Wer Aktien kauft, kauft Anteile am Unternehmen – nicht ein Papier, dessen Preis grundlos schwankt.',
  },
  'aktie-dividendenabschlag': {
    title: 'Der Kursabschlag am Ausschüttungstag',
    description:
      'Vor der Ausschüttung steht die Aktie bei 50 Euro. Werden 2 Euro Dividende gezahlt, verlässt dieses Geld das Unternehmen: Der Kurs fällt rechnerisch auf 48 Euro, auf dem Konto liegen 2 Euro. Zusammen sind es wieder 50 Euro.',
    caption:
      'Eine Dividende ist kein zusätzliches Geld, sondern eine Umschichtung aus dem Unternehmenswert auf dein Konto.',
  },
  'aktie-spread': {
    title: 'Geldkurs, Briefkurs und die Spanne dazwischen',
    description:
      'Auf einer Preisachse liegt der Geldkurs bei 49,90 Euro – so viel bekommst du beim Verkauf. Der Briefkurs liegt bei 50,10 Euro – so viel zahlst du beim Kauf. Die Spanne von 20 Cent ist der Spread; wer sofort wieder verkaufte, wäre um diesen Betrag im Minus.',
    caption:
      'Es gibt nie einen einzigen Kurs. Zwischen Kauf und Verkauf liegt immer eine Spanne – sie ist der erste Kostenblock jeder Order.',
  },
  'rohstoffe-kein-ertrag': {
    title: 'Rohstoffe zahlen nichts',
    description:
      'Eine Aktie zahlt Dividende, eine Anleihe Zinsen, eine vermietete Wohnung Miete. Bei allen dreien entsteht Ertrag, ohne dass jemand kaufen muss. Ein Rohstoff zahlt nichts: Sein gesamter Ertrag muss aus einem höheren Preis kommen, den ein anderer bereit ist zu zahlen.',
    caption:
      'Der Unterschied ist kein Detail, sondern der Grund, warum sich ein Rohstoff nicht wie eine Aktie bewerten lässt.',
  },
  'rohstoffe-rollkurve': {
    title: 'Contango und Backwardation',
    description:
      'Zwei Terminkurven. Im Contango kosten spätere Liefermonate mehr als frühere: Beim Weiterrollen wird jedes Mal teurer nachgekauft, das kostet Rendite. In der Backwardation kosten spätere Monate weniger, dann bringt das Rollen einen Gewinn.',
    caption:
      'Deshalb kann der Rohstoffpreis steigen und das Produkt darauf trotzdem verlieren.',
  },
  'msci-world-laender': {
    title: 'Ländergewichtung des MSCI World',
    description:
      'Balken für die Länderanteile im MSCI World. Die USA stellen mit Abstand den größten Teil, danach folgen Japan, Großbritannien, Kanada und Frankreich mit jeweils wenigen Prozent; der Rest verteilt sich auf die übrigen Industrieländer. Die genauen Werte trägt die Grafik selbst nach, weil sie aus einem datierten Datensatz stammen.',
    caption:
      'Nach Börsenwert gewichtet heißt: Das Gewicht folgt dem Marktwert, nicht der Zahl der Länder.',
  },
  'inflation-kaufkraft': {
    title: 'Kontostand und Kaufkraft im Vergleich',
    description:
      'Ein fester Betrag bleibt 30 Jahre unverzinst liegen. Die Zahl auf dem Konto ändert sich nie – die gestrichelte Linie verläuft waagerecht. Was diese Zahl kaufen kann, fällt stetig; nach 30 Jahren ist gut die Hälfte verschwunden, ohne dass etwas abgebucht wurde.',
    caption:
      'Der Abstand zwischen beiden Linien ist der Verlust. Er steht auf keinem Kontoauszug.',
  },

  /*
    Ab hier tragen die Zeichnungen ihre Beschreibung selbst.

    Ihre Zahlen entstehen beim Bauen aus `lib/` – aus denselben Funktionen wie
    die Tabellen daneben. Eine hier hinterlegte Beschreibung müsste diese
    Zahlen wiederholen und wäre nach der ersten Änderung an einer Annahme
    still falsch, ohne dass es jemandem auffiele: Sie ist nur für die
    sichtbar, die die Grafik gerade nicht sehen können.
  */
  'anleihe-kurs-und-zins': {
    title: 'Anleihekurs und Marktzins',
    caption:
      'Der Kupon ist fest, der Kurs ist es nicht. Er stellt sich so ein, dass die Anleihe genau den Marktzins abwirft – und je länger sie läuft, desto weiter muss er dafür ausschlagen.',
  },
  'staatsanleihe-zinsschock': {
    title: 'Kursverlust bei steigendem Zins',
    caption:
      '„Sicher“ heißt bei einer Staatsanleihe: Der Staat zahlt zurück. Es heißt nicht, dass der Kurs bis dahin ruhig bleibt – wer vorher verkaufen muss, trägt diesen Verlust.',
  },
  'option-auszahlung': {
    title: 'Ergebnis von Kauf- und Verkaufoption bei Verfall',
    caption:
      'Der Knick ist der Basispreis, der waagerechte Teil die bezahlte Prämie. Nach unten ist der Verlust des Käufers begrenzt – für den Verkäufer der Option gilt genau das Gegenteil.',
  },
  'option-zeitwertverfall': {
    title: 'Wie die Prämie mit der Restlaufzeit schrumpft',
    caption:
      'Zeit ist bei Optionen ein Preisbestandteil, und sie läuft immer in dieselbe Richtung. Am Ende geht es am schnellsten.',
  },
  'kredit-zins-und-tilgung': {
    title: 'Zins und Tilgung innerhalb derselben Rate',
    caption:
      'Die Rate bleibt gleich – deshalb sind alle Säulen gleich hoch. Nur was darin steckt, verschiebt sich: erst fast alles Zins, am Ende fast alles Tilgung.',
  },
  'kredit-anfangstilgung': {
    title: 'Anfangstilgung und Laufzeit',
    caption:
      'Ein Prozentpunkt mehr Anfangstilgung kostet etwas mehr im Monat und spart Jahrzehnte. Das ist die folgenreichste Zahl im ganzen Kreditvertrag.',
  },
  'risiko-erholung': {
    title: 'Welcher Gewinn einen Verlust ausgleicht',
    caption:
      'Verlust und Erholung sind nicht symmetrisch. Deshalb ist es wichtiger, große Verluste zu vermeiden, als große Gewinne zu treffen.',
  },
  'timing-beste-wochen': {
    title: 'Rendite ohne die besten Wochen',
    caption:
      'Die guten Wochen sind wenige und lassen sich nicht ankündigen. Wer sie mitnehmen will, muss die schlechten aushalten – dazwischen liegen oft nur Tage.',
  },
  'rente-luecke': {
    title: 'Heutiges Einkommen und gesetzliche Rente',
    caption:
      'Auf der Renteninformation steht der obere Rand der zweiten Säule. Auf dem Konto landet der untere Abschnitt – die Lücke dazwischen ist kein Betriebsunfall, sondern die Bauart des Systems.',
  },
  'boerse-vom-klick-zur-buchung': {
    title: 'Der Weg einer Order',
    caption:
      'Die ersten drei Schritte dauern Sekundenbruchteile, die letzten beiden Tage. Deshalb steht nach einem Kauf sofort ein Kurs im Depot, aber noch nicht das Papier.',
  },
  'blockchain-zahlung': {
    title: 'Eine Zahlung im Blockchain-Netz',
    caption:
      'Anders als bei einer Überweisung gibt es keinen Moment, in dem eine Zahlung „durch“ ist. Sie wird mit jedem weiteren Block nur schwerer rückgängig zu machen.',
  },
  'notenbank-transmission': {
    title: 'Vom Leitzins zu den Preisen',
    caption:
      'Die Notenbank setzt nur den ersten Kasten. Alles danach entscheiden Banken, Unternehmen und Haushalte – und jede Übergabe kostet Monate.',
  },
  'einsteiger-reihenfolge': {
    title: 'Was vor dem ersten Kauf kommt',
    caption:
      'Jeder Schritt vor dem letzten bringt sicher etwas. Der letzte bringt vermutlich mehr – aber nur, wenn die vier davor stehen.',
  },
  'markt-orderbuch': {
    title: 'Kauf- und Verkaufseite eines Orderbuchs',
    caption:
      'Es gibt nie „den Kurs“. Es gibt zwei Seiten, eine Lücke dazwischen und für jede Stückzahl einen anderen Preis.',
  },
  'tagesgeld-realzins': {
    title: 'Zins und Inflation nebeneinander',
    caption:
      'Auf dem Kontoauszug steht nur die linke Säule. Die rechte steht nirgends – und entscheidet trotzdem, ob das Geld mehr oder weniger wert wird.',
  },
  'sparplan-durchschnittspreis': {
    title: 'Was eine gleichbleibende Rate kauft',
    caption:
      'Nicht der Sparplan ist klug, sondern die feste Rate: Sie kauft automatisch mehr, wenn es billig ist, und weniger, wenn es teuer ist.',
  },
  'waehrung-ergebnis': {
    title: 'Dasselbe Geschäft, vier Wechselkurse',
    caption:
      'Bei einer Anlage in fremder Währung wettet man immer auf zwei Dinge zugleich. Der Wechselkurs kann das eine vollständig auffressen.',
  },
  'derivat-hebel': {
    title: 'Sicherheitsleistung, Hebel und Totalverlust',
    caption:
      'Der Hebel ist der Kehrwert der Sicherheitsleistung. Der Preis dafür steht rechts: die Kursbewegung, nach der nichts mehr da ist.',
  },
  'einlagensicherung-grenze': {
    title: 'Was die Einlagensicherung deckt',
    caption:
      'Die Grenze gilt je Kunde und Bank, nicht je Konto. Zwei Konten bei derselben Bank werden zusammengezählt, zwei Banken verdoppeln den Schutz.',
  },
  'depot-orderkosten': {
    title: 'Ordergebühr und Spread nach Ordergröße',
    caption:
      'Der Kostenblock, der auf der Abrechnung steht, ist bei größeren Orders der kleinere. Der andere lässt sich durch Handelsplatz und Uhrzeit beeinflussen.',
  },
  'kosten-endkapital': {
    title: 'Endkapital bei fünf Kostenquoten',
    caption:
      'Der graue Sockel ist bei allen gleich – das eingezahlte Geld. Die Kosten zehren ausschließlich am Ertrag darüber, und zwar jedes Jahr erneut.',
  },
  'psychologie-verhaltensluecke': {
    title: 'Was ein Prozentpunkt im Jahr ausmacht',
    caption:
      'Zwanzig Jahre lang liegen die beiden Linien fast aufeinander. Genau deshalb merkt man die Verhaltenslücke nicht, während sie entsteht.',
  },
  'budget-hebel': {
    title: 'Mehr sparen oder mehr Rendite',
    caption:
      'Die Frage hat keine Antwort ohne Zeitangabe. Die Rate wirkt sofort und liegt in der eigenen Hand; die Rendite überholt sie erst später – und ist nicht bestellbar.',
  },
  'portfolio-drift': {
    title: 'Wie die Aufteilung von allein wandert',
    caption:
      'Niemand hat etwas entschieden, und trotzdem trägt das Depot mehr Risiko als geplant. Rebalancing ist die Antwort darauf – kein Renditewerkzeug.',
  },
  'sparerpauschbetrag-grenze': {
    title: 'Bis zu welchem Depotwert der Freibetrag reicht',
    caption:
      'Nicht die Depotgröße entscheidet, sondern wie viel laufender Ertrag anfällt. Zwei gleich große Depots können völlig unterschiedlich besteuert werden.',
  },
  'immobilie-nettorendite': {
    title: 'Von der beworbenen Mietrendite zur tatsächlichen',
    caption:
      'Beworben wird die linke Säule. Übrig bleibt der untere Abschnitt der rechten – und der Kredit ist darin noch nicht einmal enthalten.',
  },
  'bitcoin-angebot': {
    title: 'Die Umlaufmenge nach dem Emissionsplan',
    caption:
      'Die Knappheit ist kein Versprechen, sondern eine Regel im Programmcode. Was sie über den Preis aussagt, ist eine andere Frage.',
  },
  'crashes-erholung': {
    title: 'Tiefe und Dauer der großen Einbrüche',
    caption:
      'Die Balken sind nach der Tiefe sortiert – ihre Länge folgt dieser Reihenfolge nicht. Wie lange eine Erholung dauert, entscheidet sich nach dem Einbruch.',
  },
  'fonds-sondervermoegen': {
    title: 'Warum das Fondsvermögen geschützt ist',
    description:
      'Zwei getrennte Kästen. Links die Fondsgesellschaft: Sie verwaltet, entscheidet über Käufe und Verkäufe und kassiert die Verwaltungsgebühr. Wird sie insolvent, fällt in die Masse, was ihr gehört – Büros, Verträge, Forderungen. Rechts das Fondsvermögen: die Aktien und Anleihen selbst, verwahrt bei einer unabhängigen Depotbank. Es gehört den Anlegern und fällt in keine Insolvenzmasse, weder in die der Gesellschaft noch in die der Depotbank. Wovor die Trennung nicht schützt: Fallen die enthaltenen Aktien um 40 Prozent, fällt der eigene Anteil um 40 Prozent.',
    caption:
      'Die Trennung schützt vor der Pleite des Anbieters, nicht vor dem Markt. Beides wird regelmäßig verwechselt.',
  },
  'risiko-sequenz': {
    title: 'Dieselben Renditen, zwei Reihenfolgen',
    caption:
      'Ohne Entnahme wären beide Linien am Ende deckungsgleich. Mit Entnahme entscheidet die Reihenfolge – und sie ist niemand zu wählen gegeben.',
  },
  'option-delta': {
    title: 'Das Delta über dem Kurs des Basiswerts',
    caption:
      'Wie stark eine Option reagiert, hängt davon ab, wo der Basiswert steht. Kurz vor Verfall wird aus dem Übergang eine Stufe – das ist das Gamma.',
  },
  'anleihe-konvexitaet': {
    title: 'Näherung über die Duration gegen die exakte Rechnung',
    caption:
      'Die Gerade ist die Faustformel, die Kurve die Wirklichkeit. Der Abstand dazwischen fällt immer zugunsten des Anleihebesitzers aus.',
  },
  'zinseszins-steuerstundung': {
    title: 'Was Steuerstundung über dreißig Jahre wert ist',
    caption:
      'Derselbe Steuersatz, dasselbe Produkt. Der Unterschied entsteht allein daraus, dass der noch nicht abgeführte Betrag bis zum Verkauf mitarbeitet.',
  },
  'inflation-steuer': {
    title: 'Steuer auf Gewinne, die keine sind',
    caption:
      'Besteuert wird der nominale Ertrag – auch der Teil, der nur die Geldentwertung ausgleicht. Ein Zins, der die Inflation gerade deckt, ist real ein Verlust.',
  },
  'immobilie-hebel': {
    title: 'Der Hebel in beide Richtungen',
    caption:
      'Nach oben wird diese Rechnung in jedem Beratungsgespräch vorgeführt. Es ist dieselbe Rechnung wie nach unten – nur mit anderem Vorzeichen.',
  },
  'derivat-pfadabhaengigkeit': {
    title: 'Zwei Tage Hin und Her',
    caption:
      'Der Basiswert steht wieder bei hundert, die Produkte darauf nicht. Das Vielfache wird täglich neu angesetzt – und arbeitet ab dem zweiten Tag auf einer anderen Basis.',
  },
  'streuung-titelzahl': {
    title: 'Wie viele Titel Streuung braucht',
    caption:
      'Zwischen einem und zwanzig Titeln liegt fast der ganze Gewinn. Was danach bleibt, ist das Risiko des Marktes selbst – und dagegen hilft keine Zahl von Titeln.',
  },
  'portfolio-entnahme': {
    title: 'Vier Entnahmeraten, zwei Reihenfolgen',
    caption:
      'Eine Entnahmerate ist keine Zahl, sondern eine Zahl mit einer Spanne. Und die Spanne wächst mit der Rate.',
  },
  'rohstoffe-gold-steuer': {
    title: 'Physisches Gold und die Haltefrist',
    caption:
      'Bei gleicher Bruttorendite trennt die Steuer gut ein Viertel des Gewinns. Dem stehen Kosten gegenüber, die ein Wertpapier nicht hat.',
  },
}
