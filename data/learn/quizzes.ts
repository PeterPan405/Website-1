import type { QuizQuestion } from '@/data/learn/types'

/**
 * Wissensfragen je Lernstufe.
 *
 * Schlüssel ist `themen-slug:stufe`. Die Fragen liegen bewusst hier und nicht in
 * den Inhaltsdateien: Dort geht es um Fließtext, hier um Prüfung – und in einer
 * gemeinsamen Datei lässt sich leichter kontrollieren, dass die Fragen über die
 * drei Stufen hinweg nicht dasselbe abfragen.
 *
 * Aktuell sind nur die vollständig ausformulierten Themen abgedeckt. Fragen zu
 * einem Text, der noch als Gliederung vorliegt, wären nicht beantwortbar; die
 * betroffenen Stufenseiten weisen das sichtbar aus.
 *
 * Jede Frage folgt drei Regeln:
 * 1. Sie prüft Verständnis, nicht Auswendiglernen von Zahlen.
 * 2. Die falschen Antworten sind verbreitete Fehlannahmen, keine Fantasiewerte.
 * 3. Die Begründung erklärt, warum die richtige Antwort richtig ist – nicht nur,
 *    dass sie es ist.
 * 4. Die Position der richtigen Antwort wechselt. Stehen alle richtigen Antworten
 *    an derselben Stelle, lässt sich das Quiz ohne Lesen bestehen – die aktuell
 *    324 Fragen verteilen sich deshalb über alle vier Positionen. Bei neuen
 *    Fragen bitte darauf achten und die bisher seltenste Position bevorzugen.
 */
export const learnQuizzes: Record<string, QuizQuestion[]> = {
  // ------------------------------------------------------------------- Aktie
  'aktie:beginner': [
    {
      question: 'Was erwirbst du, wenn du eine Aktie kaufst?',
      options: [
        'Einen Anspruch auf eine feste jährliche Zinszahlung',
        'Ein Darlehen, das das Unternehmen dir zurückzahlen muss',
        'Einen Miteigentumsanteil am Unternehmen',
        'Eine Absicherung gegen Kursverluste',
      ],
      correctIndex: 2,
      explanation:
        'Eine Aktie ist ein verbrieftes Miteigentumsrecht. Dir gehört ein Anteil am Unternehmen – an den Werten, den Schulden und den künftigen Gewinnen. Ein Darlehen mit Rückzahlungsanspruch und festem Zins wäre eine Anleihe, nicht eine Aktie.',
    },
    {
      question: 'Wann fließt das Geld eines Aktienkaufs tatsächlich an das Unternehmen?',
      options: [
        'Nur bei der Erstausgabe, also beim Börsengang oder einer Kapitalerhöhung',
        'Bei jedem Kauf über die Börse',
        'Immer dann, wenn eine Dividende gezahlt wird',
        'Erst wenn du die Aktie wieder verkaufst',
      ],
      correctIndex: 0,
      explanation:
        'Nur bei der Erstausgabe fließt das Geld ins Unternehmen. Kaufst du später an der Börse, kaufst du von einem anderen Anleger – das Unternehmen ist an diesem Geschäft nicht beteiligt und bekommt davon keinen Cent.',
    },
    {
      question:
        'Ein Unternehmen schüttet 2 Euro Dividende je Aktie aus. Was passiert am Ausschüttungstag typischerweise mit dem Kurs?',
      options: [
        'Er verdoppelt sich, weil die Ausschüttung Nachfrage erzeugt',
        'Er steigt um etwa diesen Betrag',
        'Er bleibt unverändert, weil die Dividende zusätzlich gezahlt wird',
        'Er fällt rechnerisch um etwa diesen Betrag',
      ],
      correctIndex: 3,
      explanation:
        'Das Geld verlässt das Unternehmen, also sinkt der Unternehmenswert entsprechend – der sogenannte Dividendenabschlag. Eine Dividende ist damit kein Zusatzgeschenk, sondern eine Umschichtung aus dem Unternehmenswert auf dein Konto.',
    },
    {
      question:
        'Warum sagt der Preis pro Aktie allein nichts darüber aus, ob eine Aktie teuer ist?',
      options: [
        'Weil Aktienpreise täglich schwanken',
        'Weil es auf das Verhältnis von Preis zum Gewinn ankommt, nicht auf den absoluten Betrag',
        'Weil der Preis von der Anzahl der Aktionäre abhängt',
        'Weil teure Aktien immer von großen Unternehmen stammen',
      ],
      correctIndex: 1,
      explanation:
        'Ein Unternehmen kann seinen Wert auf 1.000 oder auf 1 Milliarde Aktien verteilen – der Preis je Stück ändert sich dadurch massiv, der Unternehmenswert nicht. Eine Aktie für 800 Euro kann deshalb günstiger sein als eine für 3 Euro.',
    },
  ],

  'aktie:fortgeschritten': [
    {
      question: 'Was unterscheidet eine Vorzugsaktie von einer Stammaktie?',
      options: [
        'Sie ist vom Unternehmen gegen Kursverluste garantiert',
        'Sie hat kein Stimmrecht, erhält dafür meist eine höhere oder bevorrechtigte Dividende',
        'Sie wird bei einer Insolvenz vor allen Gläubigern bedient',
        'Sie darf nur von Großinvestoren gekauft werden',
      ],
      correctIndex: 1,
      explanation:
        'Der Vorzug betrifft die Ausschüttung, nicht die Sicherheit. Bezahlt wird er mit dem Verzicht auf das Stimmrecht. In der Insolvenz stehen auch Vorzugsaktionäre hinter allen Gläubigern – es bleibt eine Eigentümerposition.',
    },
    {
      question:
        'Ein Unternehmen hat ein Kurs-Gewinn-Verhältnis von 15. Was bedeutet das?',
      options: [
        'Der Kurs ist in 15 Jahren garantiert doppelt so hoch',
        'Das Unternehmen wächst jährlich um 15 Prozent',
        'Die Dividendenrendite beträgt 15 Prozent',
        'Für 1 Euro Jahresgewinn werden 15 Euro Kaufpreis bezahlt',
      ],
      correctIndex: 3,
      explanation:
        'Das KGV setzt den Kurs ins Verhältnis zum Gewinn je Aktie. Ein niedriges KGV ist aber kein Kaufsignal: Es kann bedeuten, dass der Markt sinkende Gewinne erwartet – dann war der Nenner der Formel schon morgen kleiner.',
    },
    {
      question: 'Wozu dient ein Bezugsrecht bei einer Kapitalerhöhung?',
      options: [
        'Altaktionäre dürfen neue Aktien zu einem festgelegten, meist günstigeren Kurs beziehen',
        'Es verpflichtet Altaktionäre, neue Aktien zu kaufen',
        'Es garantiert, dass der Kurs nach der Kapitalerhöhung nicht fällt',
        'Es erlaubt dem Unternehmen, Aktien zwangsweise zurückzukaufen',
      ],
      correctIndex: 0,
      explanation:
        'Das Bezugsrecht gleicht die Verwässerung aus: Deine Beteiligungsquote sinkt durch neue Aktien, über das Bezugsrecht kannst du sie halten. Wer es nicht nutzt, sollte es an der Börse verkaufen – verfallen zu lassen heißt, Geld zu verschenken.',
    },
    {
      question: 'Wovor schützt ein Stop-Loss ausdrücklich nicht?',
      options: [
        'Vor dem Erreichen der gesetzten Schwelle',
        'Vor langsam fallenden Kursen während der Handelszeit',
        'Vor Kurslücken, wenn eine Aktie deutlich unter der Schwelle eröffnet',
        'Vor Kursverlusten in liquiden Standardwerten',
      ],
      correctIndex: 2,
      explanation:
        'Ein Stop-Loss löst beim Unterschreiten der Schwelle eine Market-Order aus. Eröffnet die Aktie nach einer schlechten Nachricht 30 Prozent tiefer, wird zu diesem tieferen Kurs ausgeführt – die Schwelle wurde übersprungen, nicht getroffen.',
    },
  ],

  'aktie:profi': [
    {
      question:
        'Du realisierst Verluste aus dem Verkauf von Aktien. Womit dürfen diese in Deutschland verrechnet werden?',
      options: [
        'Mit Gewinnen aus Fondsverkäufen',
        'Mit allen Kapitalerträgen, also auch Zinsen und Dividenden',
        'Mit Einkünften aus jeder Einkommensart',
        'Ausschließlich mit Gewinnen aus dem Verkauf von Aktien',
      ],
      correctIndex: 3,
      explanation:
        'Aktienverluste landen in einem eigenen Verrechnungstopf und dürfen nur gegen Aktienveräußerungsgewinne gestellt werden – nicht gegen Dividenden, Zinsen oder Fondsgewinne. Das überrascht regelmäßig und lässt sich nicht durch Umschichten umgehen.',
    },
    {
      question:
        'Welcher Bestandteil macht bei einer Bewertung über abgezinste Zahlungsströme meist den größten Anteil des Ergebnisses aus?',
      options: [
        'Der freie Cashflow des ersten Prognosejahres',
        'Der Endwert, also alle Jahre nach dem Prognosezeitraum',
        'Der aktuelle Buchwert des Eigenkapitals',
        'Die im letzten Jahr gezahlte Dividende',
      ],
      correctIndex: 1,
      explanation:
        'Der Endwert steht in der Praxis für 60 bis 80 Prozent des Ergebnisses – und hängt an zwei Annahmen: ewiger Wachstumsrate und Kapitalkostensatz. Ein halber Prozentpunkt beim Zinssatz verschiebt den Wert leicht um 15 Prozent. Deshalb liefert das Verfahren eine Bandbreite, keine Zahl.',
    },
    {
      question: 'Welche Konstellation ist ein klassisches Warnzeichen in einer Bilanz?',
      options: [
        'Die Eigenkapitalquote liegt unter dem Branchendurchschnitt',
        'Das Unternehmen zahlt keine Dividende, sondern investiert',
        'Der ausgewiesene Gewinn steigt seit Jahren, der freie Cashflow nicht',
        'Der Aktienkurs liegt unter dem Buchwert',
      ],
      correctIndex: 2,
      explanation:
        'Gewinne lassen sich über Bewertungsansätze und Abgrenzungen gestalten, tatsächliche Zahlungsströme deutlich schwerer. Klaffen beide dauerhaft auseinander, sind früh verbuchte Umsätze oder aufgeblähte Forderungen eine häufige Ursache.',
    },
    {
      question:
        'Gilt die Teilfreistellung, die einen Teil der Erträge steuerfrei stellt, auch für direkt gehaltene Einzelaktien?',
      options: [
        'Nein, sie gilt nur für Fondsanteile als Ausgleich der Vorbelastung auf Fondsebene',
        'Ja, in gleicher Höhe wie bei Aktienfonds',
        'Ja, aber nur bei einer Haltedauer über zwölf Monate',
        'Ja, sofern es sich um deutsche Aktien handelt',
      ],
      correctIndex: 0,
      explanation:
        'Die Teilfreistellung kompensiert Steuern, die bereits auf Fondsebene angefallen sind. Bei Direktbesitz gibt es diese Vorbelastung nicht – und damit auch keine Entlastung. Ein struktureller Unterschied, der beim Vergleich Einzelaktie gegen Fonds oft übersehen wird.',
    },
  ],

  // -------------------------------------------------------------- Zinseszins
  'zinseszins:beginner': [
    {
      question: 'Was genau bezeichnet der Begriff Zinseszins?',
      options: [
        'Zinsen, die auf bereits erhaltene Zinsen anfallen',
        'Einen besonders hohen Zinssatz',
        'Zinsen, die die Bank rückwirkend nachzahlt',
        'Den Zinssatz nach Abzug der Inflation',
      ],
      correctIndex: 0,
      explanation:
        'Aus 1.000 Euro bei 5 Prozent werden im ersten Jahr 1.050 Euro. Im zweiten Jahr gibt es 5 Prozent auf 1.050 Euro, also 52,50 statt 50 Euro. Diese 2,50 Euro sind der Zinseszins – im ersten Jahr unscheinbar, über Jahrzehnte dominierend.',
    },
    {
      question:
        'Wie lange dauert es nach der 72er-Regel etwa, bis sich Kapital bei 6 Prozent Zins verdoppelt?',
      options: ['Etwa 24 Jahre', 'Etwa 6 Jahre', 'Etwa 12 Jahre', 'Etwa 36 Jahre'],
      correctIndex: 2,
      explanation:
        '72 geteilt durch den Zinssatz in Prozent ergibt die Verdopplungszeit: 72 / 6 = 12 Jahre. Im Bereich von 4 bis 12 Prozent ist die Näherung auf wenige Monate genau – und funktioniert in beide Richtungen, etwa auch für die Halbierung der Kaufkraft durch Inflation.',
    },
    {
      question:
        'Warum bringt früher Anfangen mehr als das Erhöhen der Sparrate am Ende der Laufzeit?',
      options: [
        'Weil Banken langjährigen Kunden höhere Zinsen zahlen',
        'Weil die Laufzeit im Exponenten steht, der Betrag nur als Faktor',
        'Weil frühe Einzahlungen steuerlich begünstigt sind',
        'Weil die Sparrate mit der Zeit automatisch steigt',
      ],
      correctIndex: 1,
      explanation:
        'Doppeltes Startkapital verdoppelt das Ergebnis. Doppelte Laufzeit quadriert dagegen den Wachstumsfaktor. Deshalb sind die ersten zehn Jahre wertvoller als die letzten zehn – das Geld aus dieser Zeit arbeitet am längsten.',
    },
    {
      question: 'Wirkt der Zinseszinseffekt auch gegen dich?',
      options: [
        'Nur wenn die Inflation über 5 Prozent liegt',
        'Nein, er wirkt ausschließlich beim Sparen',
        'Nur bei Krediten mit variablem Zinssatz',
        'Ja – bei Inflation, Kreditzinsen und laufenden Produktkosten',
      ],
      correctIndex: 3,
      explanation:
        'Es ist dieselbe Mathematik. Ein Prozentpunkt jährliche Fondskosten klingt harmlos, kostet über 30 Jahre aber rund ein Viertel des Endvermögens – weil die Gebühr jedes Jahr auf das gesamte angesparte Kapital wirkt, nicht nur auf die neue Rate.',
    },
  ],

  'zinseszins:fortgeschritten': [
    {
      question:
        'Ein Angebot nennt 12 Prozent nominal bei monatlicher Zinsgutschrift. Wie hoch ist der Effektivzins?',
      options: [
        'Etwa 12,0 Prozent, der Unterschied ist rein rechnerisch',
        'Genau 12,0 Prozent',
        'Etwa 12,7 Prozent',
        'Etwa 144 Prozent',
      ],
      correctIndex: 2,
      explanation:
        '(1 + 0,12/12)^12 − 1 = 12,68 Prozent. Je häufiger Zinsen gutgeschrieben werden, desto früher verzinsen sie sich mit. Der Zuwachs läuft allerdings gegen eine Grenze – von monatlich auf täglich ändert sich fast nichts mehr.',
    },
    {
      question:
        'Deine Anlage bringt 6 Prozent, die Inflation liegt bei 2,5 Prozent. Wie hoch ist der exakte Realzins?',
      options: [
        'Etwa 2,4 Prozent – Rendite geteilt durch Inflation',
        'Genau 3,5 Prozent – die Differenz beider Werte',
        'Etwa 8,5 Prozent – die Summe beider Werte',
        'Etwa 3,41 Prozent – über die Division der Wachstumsfaktoren',
      ],
      correctIndex: 3,
      explanation:
        'Korrekt ist 1,06 / 1,025 − 1 = 3,41 Prozent. Die verbreitete Differenz-Faustformel liefert 3,5 Prozent. Der Unterschied wirkt winzig, macht über 30 Jahre aber rund 8 Prozent Endvermögen aus – weil auch dieser Fehler exponentiell wächst.',
    },
    {
      question:
        'Wie stark schlägt ein Prozentpunkt zusätzliche laufende Kosten über 30 Jahre etwa auf das Endvermögen durch?',
      options: [
        'Rund ein Prozent des Endvermögens',
        'Rund ein Viertel des Endvermögens',
        'Rund 30 Prozent der eingezahlten Summe',
        'Kaum messbar, weil Kosten nur die Rate belasten',
      ],
      correctIndex: 1,
      explanation:
        'Die Kosten werden jährlich vom gesamten Vermögen abgezogen und schmälern damit genau die Basis, auf der der Zinseszins arbeitet. Deshalb ist die Kostenquote bei langfristigen Anlagen wichtiger als fast jedes andere Auswahlkriterium – sie ist die einzige Größe, die vorher bekannt ist.',
    },
    {
      question:
        'Ein Fonds macht in Jahr 1 plus 50 Prozent und in Jahr 2 minus 50 Prozent. Welche Rendite hattest du pro Jahr?',
      options: [
        'Eine negative Rendite von etwa −13,4 Prozent pro Jahr',
        'Null Prozent, die Werte heben sich auf',
        'Plus 25 Prozent pro Jahr',
        'Minus 50 Prozent pro Jahr',
      ],
      correctIndex: 0,
      explanation:
        'Aus 100 Euro werden 150, davon die Hälfte weg ergibt 75 Euro. Das geometrische Mittel lautet (75/100)^(1/2) − 1 = −13,4 Prozent pro Jahr. Das arithmetische Mittel von 0 Prozent beschreibt kein erreichbares Ergebnis – für Zinseszinsrechnungen ist immer das geometrische Mittel die richtige Größe.',
    },
  ],

  'zinseszins:profi': [
    {
      question:
        'Eine Anlage hat 8 Prozent Durchschnittsrendite bei 20 Prozent Schwankungsbreite. Welche Rendite ist tatsächlich erzielbar?',
      options: [
        'Etwa 8 Prozent – die Schwankung mittelt sich heraus',
        'Etwa 6 Prozent – die Schwankung kostet rund zwei Prozentpunkte',
        'Etwa 10 Prozent – Schwankung erhöht die Rendite',
        'Etwa 4 Prozent – die Schwankung halbiert die Rendite',
      ],
      correctIndex: 1,
      explanation:
        'Näherungsweise gilt: geometrische Rendite ≈ arithmetische Rendite − σ²/2, also 0,08 − 0,04/2 = 6 Prozent. Diese Volatilitätsbremse ist der Grund, warum Streuung nicht nur Risiko senkt, sondern eine echte Renditequelle ist: Sie verringert σ bei praktisch unveränderter Durchschnittsrendite.',
    },
    {
      question:
        'Welche Renditegröße beschreibt bei laufenden Ein- und Auszahlungen dein persönliches Ergebnis?',
      options: [
        'Die geldgewichtete Rendite, also der interne Zinsfuß',
        'Die zeitgewichtete Rendite, die Fondsprospekte nennen',
        'Das arithmetische Mittel der Jahresrenditen',
        'Die im Prospekt genannte Zielrendite',
      ],
      correctIndex: 0,
      explanation:
        'Die zeitgewichtete Rendite bewertet das Produkt und blendet Zahlungsströme aus. Die geldgewichtete berücksichtigt, wann wie viel Geld investiert war – nur sie beantwortet, wie gut dein Ergebnis war. Die Differenz beider Werte ist der messbare Preis für Timing-Versuche.',
    },
    {
      question: 'Wann spielt die Reihenfolge der Renditejahre eine entscheidende Rolle?',
      options: [
        'Nur bei Anlagen mit fester Laufzeit',
        'In der Ansparphase, weil frühe Verluste nicht mehr aufholbar sind',
        'Nie – Multiplikation ist unabhängig von der Reihenfolge',
        'In der Entnahmephase, weil in Verlustjahren Anteile verkauft werden müssen',
      ],
      correctIndex: 3,
      explanation:
        'In der Ansparphase ist die Reihenfolge tatsächlich gleichgültig. Sobald entnommen wird, nicht mehr: Wer in einem Verlustjahr verkaufen muss, verkauft zu niedrigen Kursen – diese Anteile fehlen dauerhaft und können an der Erholung nicht teilnehmen. Dieses Sequenzrisiko kann eine Rechnung mit konstanter Rendite grundsätzlich nicht abbilden.',
    },
    {
      question: 'Worin besteht der Vorteil, wenn Steuer erst beim Verkauf anfällt?',
      options: [
        'Die Steuer entfällt nach einer bestimmten Haltedauer vollständig',
        'Der Steuersatz ist am Ende der Laufzeit niedriger',
        'Der noch nicht abgeführte Betrag arbeitet mit, der Zinseszins läuft auf größerer Basis',
        'Es fällt insgesamt weniger Steuer an als bei jährlicher Zahlung',
      ],
      correctIndex: 2,
      explanation:
        'Der Vorteil ist ein Zinsvorteil, kein Steuervorteil: Der Betrag bleibt bis zum Verkauf im Vermögen und erwirtschaftet mit. In Deutschland begrenzt die Vorabpauschale diesen Effekt, hebt ihn aber nicht auf – sie liegt in der Regel unter dem tatsächlichen Wertzuwachs und wird beim Verkauf angerechnet.',
    },
  ],
  // -------------------------------------------------------------- Rohstoffe
  'rohstoffe:beginner': [
    {
      question: 'Worin unterscheidet sich Gold grundsätzlich von einer Aktie?',
      options: [
        'Gold lässt sich nur an bestimmten Wochentagen handeln',
        'Gold erwirtschaftet keinen laufenden Ertrag – der gesamte Gewinn muss aus dem Preis kommen',
        'Gold unterliegt keinen Kursschwankungen',
        'Gold wird von Notenbanken garantiert',
      ],
      correctIndex: 1,
      explanation:
        'Eine Aktie beteiligt am Gewinn eines Unternehmens, eine Anleihe zahlt Zinsen, eine Immobilie bringt Miete. Ein Goldbarren liegt einfach da. Daraus folgt fast alles Weitere – auch, dass sich für Gold kein „fairer Wert“ aus Erträgen berechnen lässt.',
    },
    {
      question:
        'Der Goldpreis in US-Dollar bleibt unverändert, der Euro fällt gegenüber dem Dollar. Was passiert mit dem Goldpreis in Euro?',
      options: [
        'Er bleibt ebenfalls unverändert',
        'Er fällt',
        'Das hängt vom Silberpreis ab',
        'Er steigt',
      ],
      correctIndex: 3,
      explanation:
        'Gold wird in Dollar notiert. Wird der Euro schwächer, braucht man mehr Euro für dieselbe Menge Dollar – und damit für dieselbe Unze Gold. Als Anleger im Euroraum trägst du deshalb immer zwei Risiken: das des Metallpreises und das des Wechselkurses.',
    },
    {
      question: 'Warum schwankt Silber stärker als Gold?',
      options: [
        'Der Markt ist kleiner und rund die Hälfte der Nachfrage kommt aus der Industrie',
        'Silber wird nicht an Börsen gehandelt',
        'Silber ist seltener als Gold',
        'Notenbanken verkaufen regelmäßig Silber',
      ],
      correctIndex: 0,
      explanation:
        'Beides zusammen: Im kleineren Markt bewegt dieselbe Geldsumme den Preis stärker, und die industrielle Nachfrage koppelt Silber zusätzlich an die Konjunktur. Ein Abschwung trifft Silber deshalb doppelt – über die Anlage- und über die Industrienachfrage.',
    },
    {
      question: 'Was gilt in Deutschland beim physischen Kauf von Anlagegold und Silber?',
      options: [
        'Auf beides fällt Umsatzsteuer an',
        'Auf beides fällt keine Umsatzsteuer an',
        'Anlagegold ist umsatzsteuerbefreit, auf Silber fällt Umsatzsteuer an',
        'Silber ist befreit, auf Gold fällt Umsatzsteuer an',
      ],
      correctIndex: 2,
      explanation:
        'Anlagegold ist in der EU von der Umsatzsteuer befreit, Silber nicht. Für Silber bedeutet das einen Startnachteil: Der Preis muss erst um diesen Betrag steigen, bevor überhaupt ein Gewinn beginnt. Bei kleinen Beträgen fällt das spürbar ins Gewicht.',
    },
  ],
  'rohstoffe:fortgeschritten': [
    {
      question: 'Warum sind Gold-Produkte in Europa fast immer ETCs und keine ETFs?',
      options: [
        'ETFs dürfen keine Edelmetalle halten',
        'ETCs sind grundsätzlich günstiger',
        'Ein ETF ist rechtlich ein Fonds und muss streuen – ein einzelner Rohstoff erfüllt das nicht',
        'Die Bezeichnung ist frei wählbar und bedeutet dasselbe',
      ],
      correctIndex: 2,
      explanation:
        'Der Unterschied ist nicht kosmetisch. Ein Fonds ist Sondervermögen und bleibt bei einer Insolvenz der Gesellschaft den Anlegern erhalten. Ein ETC ist eine Schuldverschreibung – du bist Gläubiger des Emittenten. Seriöse Produkte mildern das durch physische Hinterlegung.',
    },
    {
      question: 'Was bedeutet Contango für ein Rohstoffprodukt auf Terminkontrakten?',
      options: [
        'Jeder Rollvorgang kostet Geld, weil der spätere Kontrakt teurer ist',
        'Der Rohstoff ist knapp und sofort verfügbar teurer',
        'Das Produkt zahlt eine Dividende',
        'Der Emittent übernimmt die Lagerkosten',
      ],
      correctIndex: 0,
      explanation:
        'Bei lagerfähigen Rohstoffen ist Contango der Normalfall, weil Lagerung und Zinsen im Terminpreis stecken. Über Jahre kann das so viel kosten, dass der Rohstoffpreis steigt und das Produkt darauf trotzdem verliert – ein Ergebnis, das ohne Kenntnis der Mechanik unerklärlich wirkt.',
    },
    {
      question: 'Welche Größe erklärt Goldbewegungen erfahrungsgemäß am besten?',
      options: [
        'Die Zahl der Krisenmeldungen',
        'Die jährliche Minenförderung',
        'Der Silberpreis',
        'Der Realzins – also der Zins abzüglich erwarteter Inflation',
      ],
      correctIndex: 3,
      explanation:
        'Gold zahlt nichts. Wer es hält, verzichtet auf sicheren Zinsertrag – und dieser Verzicht bemisst sich am Realzins. Steigt er, wird Halten teuer; ist er negativ, verliert auch das Tagesgeld an Kaufkraft und Gold büßt seinen Nachteil ein.',
    },
    {
      question:
        'Ein ETC wird in Euro an einer deutschen Börse gehandelt. Was folgt daraus für das Währungsrisiko?',
      options: [
        'Es entfällt, weil in Euro gehandelt wird',
        'Es bleibt bestehen, solange das Produkt nicht ausdrücklich währungsgesichert ist',
        'Es verdoppelt sich',
        'Es hängt allein von der Kostenquote ab',
      ],
      correctIndex: 1,
      explanation:
        'Die Handelswährung sagt nichts über das zugrunde liegende Risiko. Das Metall wird in Dollar bewertet; der Euro-Kurs des Produkts rechnet das nur um. Ohne ausdrückliche Währungssicherung trägst du die Dollarbewegung mit – Sicherung wiederum kostet laufend.',
    },
  ],
  'rohstoffe:profi': [
    {
      question:
        'Du verkaufst physisches Gold 14 Monate nach dem Kauf mit Gewinn. Wie wird das in Deutschland grundsätzlich behandelt?',
      options: [
        'Abgeltungsteuer auf den Gewinn',
        'Persönlicher Steuersatz auf den Gewinn',
        'Umsatzsteuer auf den Verkaufserlös',
        'Der Gewinn ist steuerfrei, weil die Jahresfrist überschritten ist',
      ],
      correctIndex: 3,
      explanation:
        'Physische Edelmetalle gelten als anderes Wirtschaftsgut nach § 23 EStG. Innerhalb eines Jahres ist der Gewinn mit dem persönlichen Steuersatz zu versteuern, danach steuerfrei – ein Unterschied zu Aktien, bei denen die Haltedauer keine Rolle spielt.',
    },
    {
      question: 'Warum sind Goldminenaktien kein sauberer Ersatz für Gold?',
      options: [
        'Sie folgen dem Goldpreis exakt, kosten aber mehr',
        'Sie bringen alle Unternehmensrisiken mit – Verschuldung, Führung, politische Lage der Förderländer',
        'Sie dürfen in Deutschland nicht gehandelt werden',
        'Ihr Kurs hängt nur an der Fördermenge',
      ],
      correctIndex: 1,
      explanation:
        'Der Hebel wirkt in beide Richtungen und wird von Faktoren überlagert, die mit dem Metall nichts zu tun haben. Über lange Zeiträume bilden Minenaktien den Goldpreis deshalb nicht sauber ab – sie gehören in die Aktienquote, nicht in die Rohstoffquote.',
    },
    {
      question: 'Was lässt sich empirisch über Gold als Inflationsschutz sagen?',
      options: [
        'Es gleicht Inflation zuverlässig Jahr für Jahr aus',
        'Es hat mit Inflation nachweislich nichts zu tun',
        'Über sehr lange Zeiträume erhält es die Kaufkraft ungefähr, über zehn bis zwanzig Jahre kann es deutlich zurückbleiben',
        'Es steigt immer dann, wenn Aktien fallen',
      ],
      correctIndex: 2,
      explanation:
        '2022 zeigte das deutlich: hohe Inflation, und Gold trat auf der Stelle – weil die Realzinsen stiegen. Die ehrlichere Beschreibung ist Schutz gegen Vertrauensverlust statt gegen Inflation. Solche Ereignisse sind selten, und eine Versicherung, die selten zahlt, kostet dazwischen Rendite.',
    },
    {
      question:
        'Welche Eigenschaft eines ETC entscheidet darüber, ob er steuerlich wie physisches Gold behandelt werden kann?',
      options: [
        'Ob er einen Anspruch auf Lieferung des hinterlegten Metalls verbrieft',
        'Ob er an einer deutschen Börse notiert ist',
        'Ob seine Kostenquote unter 0,3 Prozent liegt',
        'Ob er thesaurierend oder ausschüttend ist',
      ],
      correctIndex: 0,
      explanation:
        'Ein ETC ist grundsätzlich eine Schuldverschreibung und damit abgeltungsteuerpflichtig. Für Produkte mit verbrieftem Lieferanspruch hat die Rechtsprechung eine Behandlung wie physisches Gold anerkannt. Ob ein konkretes Produkt darunterfällt, hängt an seinen Bedingungen – das gehört vor den Kauf geprüft.',
    },
  ],
  // --------------------------------------------------------------------- ETF
  'etf:beginner': [
    {
      question:
        'Worin unterscheidet sich ein ETF grundsätzlich von einem klassischen aktiven Fonds?',
      options: [
        'Ein ETF ist kein Sondervermögen und deshalb günstiger',
        'Ein ETF bildet einen Index nach, statt Werte nach eigenem Urteil auszuwählen',
        'Ein ETF enthält immer Aktien, ein aktiver Fonds immer Anleihen',
        'Ein ETF kann nicht an Wert verlieren',
      ],
      correctIndex: 1,
      explanation:
        'Der Unterschied liegt in der Entscheidung, nicht in der Rechtsform. Beide sind Sondervermögen. Ein aktiver Fonds bezahlt Menschen dafür, Werte auszuwählen; ein ETF folgt einer festen Regel – dem Index. Genau daraus folgen die niedrigeren Kosten.',
    },
    {
      question:
        'Ein ETF auf einen Technologie-Index verliert 35 Prozent. Was sagt das über den ETF aus?',
      options: [
        'Der Anbieter hat die Nachbildung schlecht umgesetzt',
        'Das Sondervermögen wurde angegriffen',
        'Nichts Ungewöhnliches – der ETF folgt seinem Index, und der ist gefallen',
        'Der ETF war zu klein und wurde deshalb abgewertet',
      ],
      correctIndex: 2,
      explanation:
        'Ein ETF soll seinen Index abbilden, nach oben wie nach unten. Fällt der Index, fällt der ETF – das ist keine Fehlfunktion, sondern die Funktion. Das Risiko steckt im gewählten Index, nicht in der Fondshülle.',
    },
    {
      question: 'Was bedeutet „Sondervermögen“ bei einem ETF?',
      options: [
        'Das Fondsvermögen ist vom Vermögen der Fondsgesellschaft getrennt und fällt bei deren Insolvenz nicht in die Masse',
        'Der Staat garantiert den eingezahlten Betrag bis 100.000 Euro',
        'Der Fonds darf nur in besonders sichere Werte investieren',
        'Kursverluste werden vom Anbieter ausgeglichen',
      ],
      correctIndex: 0,
      explanation:
        'Sondervermögen schützt vor der Pleite des Anbieters, nicht vor Kursverlusten. Die Einlagensicherung über 100.000 Euro gilt für Bankguthaben, nicht für Wertpapiere – dort braucht es sie auch nicht, weil die Papiere ohnehin dir gehören.',
    },
    {
      question:
        'Zwei ETFs bilden denselben Index ab, einer thesauriert, einer schüttet aus. Was folgt daraus für die Rendite?',
      options: [
        'Der ausschüttende bringt mehr, weil zusätzlich Geld aufs Konto kommt',
        'Der thesaurierende bringt mehr, weil er höhere Kurse hat',
        'Vor Steuern und Kosten ist es dasselbe Geld auf zwei Wegen',
        'Der ausschüttende ist risikoärmer, weil laufend Geld entnommen wird',
      ],
      correctIndex: 2,
      explanation:
        'Am Ausschüttungstag sinkt der Kurs um genau den ausgeschütteten Betrag. Es entsteht also kein zusätzlicher Ertrag – die Frage ist nur, ob das Geld im Fonds bleibt oder auf dein Konto geht. Unterschiede ergeben sich erst durch Steuern und die Kosten der Wiederanlage.',
    },
  ],
  'etf:fortgeschritten': [
    {
      question:
        'Warum ist die Tracking-Differenz aussagekräftiger als die Gesamtkostenquote TER?',
      options: [
        'Weil sie von der Aufsichtsbehörde geprüft wird, die TER nicht',
        'Weil sie den tatsächlichen Rückstand zum Index misst und damit auch Handelskosten, Quellensteuern und Leiheerträge enthält',
        'Weil sie immer kleiner ist als die TER',
        'Weil die TER nur bei synthetischen ETFs anfällt',
      ],
      correctIndex: 1,
      explanation:
        'Die TER nennt eine Gebühr, die Tracking-Differenz misst ein Ergebnis. Sie enthält alles, was zwischen Index und ETF tatsächlich passiert ist – auch Erträge aus Wertpapierleihe, die den Rückstand verkleinern können. Kleiner als die TER ist sie deshalb manchmal, aber nicht immer.',
    },
    {
      question:
        'Ein ETF auf japanische Aktien soll gekauft werden. Wann ist der Spread in Deutschland tendenziell am engsten?',
      options: [
        'Direkt zur Eröffnung um 9 Uhr, wenn die Umsätze am höchsten sind',
        'In der letzten Handelsminute, weil dann der Schlusskurs festgestellt wird',
        'Der Spread hängt nicht von der Uhrzeit ab',
        'Wenn sich die Handelszeiten überlappen oder der Heimatmarkt zumindest kürzlich geschlossen hat',
      ],
      correctIndex: 3,
      explanation:
        'Solange der Heimatmarkt geschlossen ist, muss der Market Maker den fairen Wert schätzen und sichert sich über eine größere Spanne ab. Eröffnung und Schluss sind aus demselben Grund die teuersten Zeitpunkte – dort ist die Preisfindung am unsichersten.',
    },
    {
      question: 'Was besitzt ein synthetisch nachbildender ETF tatsächlich?',
      options: [
        'Ein Wertpapierportfolio, das mit dem Index nichts zu tun haben muss, plus ein Tauschgeschäft mit einer Bank',
        'Die Indextitel, nur in abweichender Gewichtung',
        'Ausschließlich Barmittel',
        'Anteile an einem zweiten, physischen ETF',
      ],
      correctIndex: 0,
      explanation:
        'Beim Swap liefert eine Bank die Indexrendite, der Fonds im Gegenzug die Rendite seines eigenen Portfolios. Was im Fonds liegt, dient als Sicherheit und ist von der Indexzusammensetzung unabhängig. Daraus folgt das Kontrahentenrisiko – gesetzlich auf 10 Prozent begrenzt und in der Praxis meist täglich besichert.',
    },
    {
      question:
        'Ein Anleger vergleicht die Wertentwicklung seines ETF mit dem Kursindex desselben Marktes und stellt einen Vorsprung fest. Was liegt am nächsten?',
      options: [
        'Der ETF hat den Markt geschlagen',
        'Ein Rechenfehler des Anbieters',
        'Der Kursindex lässt Dividenden unberücksichtigt, der ETF vereinnahmt sie',
        'Der ETF enthält zusätzliche Werte außerhalb des Index',
      ],
      correctIndex: 2,
      explanation:
        'Ein Price Index bildet nur Kursbewegungen ab, ein ETF vereinnahmt zusätzlich die Dividenden. Über Jahre summiert sich das erheblich. Verglichen werden muss mit der Net-Return-Variante – sie unterstellt Wiederanlage abzüglich Quellensteuer und ist der Maßstab, an dem ETFs sich messen.',
    },
  ],
  'etf:profi': [
    {
      question:
        'Ein ETF auf den S&P 500 hat ein sehr geringes tägliches Handelsvolumen. Was folgt daraus für die Handelbarkeit?',
      options: [
        'Er ist schwer verkäuflich, weil Käufer fehlen',
        'Wenig – Anteile können am Primärmarkt neu geschaffen oder zurückgegeben werden, die Liquidität hängt an den Basiswerten',
        'Er wird zwangsläufig bald geschlossen',
        'Er weicht deshalb stärker vom Index ab',
      ],
      correctIndex: 1,
      explanation:
        'Anders als bei einer Aktie ist das Handelsvolumen eines ETF kein gutes Maß. Zugelassene Teilnehmer können jederzeit Anteile schaffen oder einlösen, indem sie die Basiswerte liefern oder abnehmen. Handelbar ist ein ETF deshalb so gut wie das, was in ihm steckt.',
    },
    {
      question:
        'Welche Angabe zur Wertpapierleihe eines ETF ist für die Risikoeinschätzung am wichtigsten?',
      options: [
        'Der Name des Entleihers',
        'Die Anzahl der Leihgeschäfte im Jahr',
        'Ob die Erträge thesauriert oder ausgeschüttet werden',
        'Umfang der Leihe, Qualität und Höhe der Sicherheiten sowie die Aufteilung der Erträge',
      ],
      correctIndex: 3,
      explanation:
        'Das Risiko besteht darin, dass ein Entleiher ausfällt und die Sicherheiten weniger wert sind als die verliehenen Papiere. Entscheidend sind deshalb Umfang, Übersicherung und Qualität der Sicherheiten. Die Ertragsteilung sagt zusätzlich, wie viel vom Ertrag beim Fonds bleibt und wie viel beim Anbieter.',
    },
    {
      question: 'Was ist die Vorabpauschale?',
      options: [
        'Eine jährliche Mindestbesteuerung thesaurierender Fonds, begrenzt auf den Wertzuwachs des Jahres',
        'Eine zusätzliche Gebühr des Anbieters für die Wiederanlage',
        'Eine Steuer auf jeden Kauf von Fondsanteilen',
        'Ein Abschlag auf den Verkaufserlös beim Depotwechsel',
      ],
      correctIndex: 0,
      explanation:
        'Weil ein thesaurierender Fonds nichts ausschüttet, gäbe es ohne diese Regel bis zum Verkauf keinen steuerlichen Anknüpfungspunkt. Die Vorabpauschale schließt diese Lücke. Sie ist auf den Wertzuwachs des Jahres gedeckelt, entfällt in Verlustjahren und wird beim späteren Verkauf angerechnet.',
    },
    {
      question:
        'Ein Anleger hat über Jahre monatlich Anteile gekauft und will nun einen Teil verkaufen. Welche Anteile gelten als verkauft?',
      options: [
        'Die zuletzt gekauften, weil dort der Gewinn am kleinsten ist',
        'Anteilig aus allen Käufen',
        'Die zuerst gekauften – FIFO, ohne Wahlmöglichkeit',
        'Die mit dem höchsten Einstandskurs, um Steuern zu sparen',
      ],
      correctIndex: 2,
      explanation:
        'Es gilt First in, first out: Die ältesten Anteile gelten als zuerst verkauft. Bei einem gestiegenen Kurs sind das die mit dem größten Gewinn und damit der höchsten Steuerlast. Wählen lässt sich das nicht – wer Entnahmen plant, sollte es einkalkulieren.',
    },
  ],
  // --------------------------------------------------------------- Inflation
  'inflation:beginner': [
    {
      question:
        'Die Inflationsrate fällt von 6 auf 2 Prozent. Was folgt daraus für die Preise?',
      options: [
        'Die Preise sinken um 4 Prozent',
        'Die Preise kehren auf das Niveau von vor zwei Jahren zurück',
        'Die Preise bleiben unverändert',
        'Die Preise steigen weiter, nur langsamer als zuvor',
      ],
      correctIndex: 3,
      explanation:
        'Die Rate misst die Geschwindigkeit, nicht den Stand. Bei 2 Prozent wird alles weiterhin teurer, nur eben langsamer. Der Preisanstieg der Vorjahre bleibt vollständig bestehen – er wird nicht zurückgenommen. Genau deshalb passt „Entspannung bei der Inflation“ und „im Supermarkt ist alles teuer“ widerspruchsfrei zusammen.',
    },
    {
      question: 'Womit vergleicht die veröffentlichte Inflationsrate eines Monats?',
      options: [
        'Mit demselben Monat des Vorjahres',
        'Mit dem Vormonat',
        'Mit dem Jahresdurchschnitt der letzten zehn Jahre',
        'Mit dem Zielwert der Europäischen Zentralbank',
      ],
      correctIndex: 0,
      explanation:
        'Es ist ein Vorjahresvergleich. Daraus folgt der Basiseffekt: Die Rate hängt ebenso vom Vorjahresmonat ab wie von der Gegenwart. War der Vergleichsmonat außergewöhnlich teuer, fällt die Rate allein deshalb – ohne dass heute etwas billiger geworden wäre.',
    },
    {
      question:
        'Deine persönliche Teuerung weicht regelmäßig von der amtlichen Rate ab. Warum?',
      options: [
        'Weil die amtliche Statistik Mieten nicht erfasst',
        'Weil dein Warenkorb anders gewichtet ist als der eines Durchschnittshaushalts',
        'Weil die Rate erst mit einem Jahr Verzögerung veröffentlicht wird',
        'Weil regionale Preise gar nicht erhoben werden',
      ],
      correctIndex: 1,
      explanation:
        'Der amtliche Warenkorb gewichtet nach dem Konsum eines Durchschnittshaushalts, den es so nicht gibt. Wer zur Miete wohnt und pendelt, spürt Mieten und Spritpreise stärker als jemand mit abbezahltem Haus im Ort. Das ist keine Schwäche der Statistik, sondern die Natur eines Durchschnitts.',
    },
    {
      question:
        'Tagesgeld bringt 2 Prozent, die Inflation liegt bei 2,5 Prozent. Wie steht es um dein Vermögen?',
      options: [
        'Es wächst um 2 Prozent, die Inflation betrifft nur Konsumausgaben',
        'Es bleibt real unverändert, weil die Zahlen nahe beieinanderliegen',
        'Nominal wächst es, real verlierst du rund ein halbes Prozent Kaufkraft',
        'Es verliert 2,5 Prozent, der Zins wird davon nicht abgezogen',
      ],
      correctIndex: 2,
      explanation:
        'Der Realzins ist der Quotient aus Nominalzins und Inflation, hier rund minus 0,5 Prozent. Am Jahresende steht mehr Geld auf dem Konto, und du kannst dir weniger dafür kaufen. Nominal ist eine Zahl, real ist ein Ergebnis.',
    },
  ],
  'inflation:fortgeschritten': [
    {
      question:
        'Warum ist eine Zinserhöhung gegen reine Angebotsinflation ein schwaches Mittel?',
      options: [
        'Weil höhere Zinsen die Nachfrage dämpfen, aber Energie und Rohstoffe dadurch nicht billiger werden',
        'Weil Zinserhöhungen bei Angebotsschocks gesetzlich ausgeschlossen sind',
        'Weil Angebotsinflation sich immer von selbst zurückbildet',
        'Weil höhere Zinsen die Produktionskosten zusätzlich senken',
      ],
      correctIndex: 0,
      explanation:
        'Der Zins wirkt über die Nachfrageseite. Ist die Ursache ein verteuertes Angebot, trifft das Instrument die falsche Seite: Die Notenbank bremst eine ohnehin schwache Wirtschaft, ohne die Ursache zu berühren. Handeln muss sie trotzdem, sobald der Schock über Zweitrundeneffekte in Löhne und Preise einzusickern droht.',
    },
    {
      question: 'Was misst die Kerninflation?',
      options: [
        'Nur die Preise der Grundversorgung – Lebensmittel, Energie, Miete',
        'Die Preisentwicklung ohne Energie und Nahrungsmittel',
        'Die Inflation im Euroraum ohne Deutschland',
        'Den Preisanstieg abzüglich staatlicher Steuererhöhungen',
      ],
      correctIndex: 1,
      explanation:
        'Ausgeklammert werden gerade die stark schwankenden Posten Energie und Nahrungsmittel – nicht weil sie unwichtig wären, sondern weil sie den Blick auf die Frage verstellen, ob die Teuerung sich im Rest der Wirtschaft festgesetzt hat. Als Aussage über die Lebenshaltungskosten taugt die Kernrate deshalb nicht.',
    },
    {
      question:
        'Die Break-even-Inflationsrate ergibt sich aus dem Renditeunterschied zweier Anleihen. Was zeigt sie?',
      options: [
        'Die vom Statistischen Bundesamt für das nächste Jahr prognostizierte Rate',
        'Die Inflationsrate, ab der Aktien Anleihen schlagen',
        'Welche durchschnittliche Inflation der Markt für die Laufzeit einpreist',
        'Die Untergrenze, ab der die Notenbank eingreifen muss',
      ],
      correctIndex: 2,
      explanation:
        'Sie ist die Differenz zwischen der Rendite einer normalen und einer inflationsindexierten Anleihe gleicher Laufzeit – also die Erwartung, für die Marktteilnehmer mit echtem Geld einstehen. Das macht sie zu einem anderen Indikator als eine Umfrage oder eine Prognose.',
    },
    {
      question: 'Warum sprechen Notenbanken von „verankerten Inflationserwartungen“?',
      options: [
        'Weil Erwartungen gesetzlich an das Inflationsziel gebunden sind',
        'Weil erwartete Inflation über Löhne und Kalkulationen zur tatsächlichen wird',
        'Weil Erwartungen erst nach zwei Jahren messbar werden',
        'Weil verankerte Erwartungen die Rate rechnerisch aus dem Index herausnehmen',
      ],
      correctIndex: 1,
      explanation:
        'Wer fünf Prozent Teuerung erwartet, verlangt fünf Prozent mehr Lohn und kalkuliert fünf Prozent höhere Preise – und macht die Erwartung damit wahr. Solange das Vertrauen in die Rückkehr zum Ziel hält, wird ein Preisschock als vorübergehend behandelt. Geht es verloren, muss es mit sehr viel höheren Zinsen zurückgekauft werden.',
    },
  ],
  'inflation:profi': [
    {
      question:
        'Aktien gelten als Inflationsschutz. Welche Einschränkung gehört zwingend dazu?',
      options: [
        'Der Schutz gilt nur für Dividendenaktien',
        'Der Schutz gilt nur bei Inflationsraten unter 2 Prozent',
        'Der Schutz greift nur bei physischer Verwahrung der Aktien',
        'Der Schutz wirkt über lange Zeiträume; kurzfristig fallen Aktien bei anziehender Inflation eher',
      ],
      correctIndex: 3,
      explanation:
        'Langfristig wachsen Unternehmenserträge mit dem Preisniveau. Kurzfristig wirken zwei Kräfte dagegen: Höhere Zinsen senken den heutigen Wert künftiger Gewinne, und Preise lassen sich nicht sofort weitergeben – die Margen geraten zuerst unter Druck. Ohne Angabe des Zeitraums ist die Aussage inhaltsleer.',
    },
    {
      question: 'Wovor schützt eine inflationsindexierte Anleihe tatsächlich?',
      options: [
        'Vor unerwarteter Inflation – die erwartete steckt bereits im Preis',
        'Vor jeder Inflation, unabhängig von der Höhe',
        'Vor steigenden Zinsen',
        'Vor dem Ausfall des Emittenten',
      ],
      correctIndex: 0,
      explanation:
        'Die erwartete Inflation ist als Break-even-Rate eingepreist. Liegt die tatsächliche Teuerung darunter, hättest du mit der normalen Anleihe mehr verdient. Es ist eine Wette auf die Abweichung von der Erwartung, nicht auf die Richtung der Preise.',
    },
    {
      question:
        'Eine Anlage bringt 2 Prozent nominal, die Inflation liegt bei 2,5 Prozent. Wie besteuert das Finanzamt das?',
      options: [
        'Gar nicht, weil real ein Verlust entstanden ist',
        'Nur der Teil oberhalb der Inflationsrate wird besteuert',
        'Der volle nominale Ertrag wird besteuert, obwohl real ein Verlust bleibt',
        'Der Verlust lässt sich mit anderen Kapitalerträgen verrechnen',
      ],
      correctIndex: 2,
      explanation:
        'Das deutsche Steuerrecht kennt keine Inflation. Besteuert wird der nominale Zuwachs – hier also ein Gewinn, den es real nicht gibt. Diese Scheingewinnbesteuerung vergrößert den realen Verlust zusätzlich, und zwar umso stärker, je höher die Inflation ist.',
    },
    {
      question:
        'Warum kann ein Rohstoff-Investment über Terminkontrakte seinen Inflationsschutz verlieren?',
      options: [
        'Weil Rohstoffe von der Inflationsstatistik ausgenommen sind',
        'Weil Terminkontrakte nur in Fremdwährung handelbar sind',
        'Weil Rohstoffe keine laufenden Erträge abwerfen',
        'Weil beim Rollen in Contango jeder Wechsel in den nächsten Kontrakt Geld kostet',
      ],
      correctIndex: 3,
      explanation:
        'Terminkontrakte laufen ab und müssen in den nächsten gerollt werden. Ist der spätere Kontrakt teurer als der auslaufende – Contango –, kostet jeder Rollvorgang einen Teil des Einsatzes. Über Jahre kann das den Preisanstieg des Rohstoffs vollständig aufzehren, während der Spotpreis gestiegen ist.',
    },
  ],
  // ------------------------------------------------------------------ Börse
  'boerse:beginner': [
    {
      question: 'Was garantiert eine Börse?',
      options: [
        'Dass die gehandelten Unternehmen wirtschaftlich gesund sind',
        'Dass Kurse nicht unter einen Mindestwert fallen',
        'Geordnete Preisfindung und eine verlässliche Abwicklung',
        'Dass jeder Anleger am Ende Gewinn macht',
      ],
      correctIndex: 2,
      explanation:
        'Eine Börse organisiert das Zusammentreffen von Aufträgen nach Regeln, die für alle gleich sind, und sorgt dafür, dass Wertpapiere und Geld auch wirklich den Besitzer wechseln. Über die Qualität eines Unternehmens sagt die Zulassung nichts – sie heißt nur, dass die formalen Anforderungen erfüllt sind.',
    },
    {
      question: 'Deine Bank geht insolvent. Was passiert mit den Aktien in deinem Depot?',
      options: [
        'Sie gehören dir und fallen nicht in die Insolvenzmasse',
        'Sie sind bis 100.000 Euro über die Einlagensicherung geschützt',
        'Sie werden verkauft und der Erlös anteilig verteilt',
        'Sie gehen an den Zentralverwahrer über und sind verloren',
      ],
      correctIndex: 0,
      explanation:
        'Die Bank verwahrt die Papiere nur, Eigentümer bist du. Du kannst die Herausgabe verlangen oder das Depot übertragen lassen. Die Einlagensicherung über 100.000 Euro betrifft Guthaben – also Geld, das der Bank gehört und das sie dir schuldet. Wertpapiere muss sie nicht schulden, sie sind bereits deine.',
    },
    {
      question:
        'Warum beginnt und endet der Börsentag mit einer Auktion statt mit fortlaufendem Handel?',
      options: [
        'Damit die Börse ihre Gebühren berechnen kann',
        'Weil sonst zu viele Orders gleichzeitig einträfen und das System überlastet wäre',
        'Weil das Gesetz eine Preisfeststellung durch einen Makler vorschreibt',
        'Weil nach einer Nachrichtenlage unklar ist, wo der Kurs steht – die Auktion bündelt das in einem Preis',
      ],
      correctIndex: 3,
      explanation:
        'Würde nach der Nacht sofort fortlaufend gehandelt, entstünden willkürliche erste Kurse. In der Auktion sammeln sich Aufträge, und es wird der eine Preis ermittelt, zu dem das größte Volumen zustande kommt. Dasselbe am Ende des Tages, wo der Schlusskurs als Referenz für vieles dient.',
    },
    {
      question:
        'Welche der drei Kostenarten eines Wertpapierkaufs taucht auf keiner Abrechnung auf?',
      options: [
        'Die Ordergebühr des Brokers',
        'Der Spread zwischen Kauf- und Verkaufspreis',
        'Das Entgelt des Handelsplatzes',
        'Die Depotgebühr',
      ],
      correctIndex: 1,
      explanation:
        'Der Spread wird nie in Rechnung gestellt – er steckt im Preis. Wer sofort nach dem Kauf wieder verkaufen würde, bekäme weniger heraus, als er bezahlt hat, obwohl sich der Kurs nicht bewegt hat. Bei kleinen Ordern über einen ungünstigen Handelsplatz ist er oft der größte der drei Posten.',
    },
  ],
  'boerse:fortgeschritten': [
    {
      question: 'Beim außerbörslichen Direkthandel handelst du gegen wen?',
      options: [
        'Gegen andere Privatanleger in einem geschlossenen Orderbuch',
        'Gegen die Börse selbst',
        'Gegen ein Unternehmen, das dir einen Preis stellt und vom Spread lebt',
        'Gegen das Unternehmen, dessen Aktie gehandelt wird',
      ],
      correctIndex: 2,
      explanation:
        'Es gibt kein Orderbuch, sondern ein Gegenüber, das einen Preis anbietet. Das ist ein legitimes Geschäftsmodell, aber die Interessen sind gegenläufig. Deshalb gilt hier besonders: den gestellten Preis mit dem Kurs am Referenzmarkt vergleichen, bevor man annimmt.',
    },
    {
      question: 'Warum ist der Handel um 22 Uhr regelmäßig teurer als am Nachmittag?',
      options: [
        'Weil Handelsplätze nachts höhere Entgelte verlangen',
        'Weil der Referenzmarkt geschlossen ist und ein Vergleichskurs fehlt, an dem sich das Angebot messen ließe',
        'Weil nachts nur unlimitierte Orders zulässig sind',
        'Weil die Abwicklung dann einen Tag länger dauert',
      ],
      correctIndex: 1,
      explanation:
        'Ohne laufenden Referenzkurs muss der Anbieter den fairen Wert schätzen und sichert sich über eine größere Spanne ab. Bei ausländischen Werten kommt hinzu, dass auch der Heimatmarkt geschlossen sein kann. Die Order kostet dann mehr, ohne dass irgendwo eine höhere Gebühr auftauchte.',
    },
    {
      question: 'Was verlangt die Best-Execution-Pflicht von deinem Broker?',
      options: [
        'Immer den Handelsplatz mit dem besten Kurs zu wählen',
        'Jede Order an den Referenzmarkt weiterzuleiten',
        'Dich vor jeder Order über den Spread zu informieren',
        'Das bestmögliche Gesamtergebnis anzustreben – Preis, Kosten, Geschwindigkeit und Ausführungswahrscheinlichkeit zusammen',
      ],
      correctIndex: 3,
      explanation:
        'Die Pflicht bezieht sich auf das Gesamtergebnis, nicht allein auf den Preis. Das gibt Spielraum, und deshalb ist die Standardvorgabe eines Brokers nicht automatisch der Handelsplatz mit dem besten Kurs. Wie er abwägt, steht in seinen Ausführungsgrundsätzen.',
    },
    {
      question: 'Was leistet die Finanzaufsicht für Anleger nicht?',
      options: [
        'Sie warnt nicht vor schlechten Geschäftsmodellen und verhindert keine Kursstürze',
        'Sie verfolgt keinen Insiderhandel',
        'Sie überwacht die Veröffentlichungspflichten der Unternehmen nicht',
        'Sie beaufsichtigt die Börsen nicht',
      ],
      correctIndex: 0,
      explanation:
        'Insiderhandel, Marktmanipulation und Publizitätspflichten fallen sehr wohl in ihren Bereich. Was sie nicht tut: Geschäftsmodelle bewerten oder vor Verlusten schützen. Sie greift überwiegend nachträglich ein – bei einem Betrug ist das Geld dann meist weg. „Das ist doch reguliert“ ist deshalb keine Aussage über das Risiko einer Anlage.',
    },
  ],
  'boerse:profi': [
    {
      question:
        'Worin unterscheiden sich regulierter Markt und Freiverkehr für Anleger am deutlichsten?',
      options: [
        'Im Freiverkehr gilt kein Marktmissbrauchsrecht',
        'Im Freiverkehr sind die laufenden Informationspflichten der Unternehmen deutlich schwächer',
        'Im Freiverkehr können nur institutionelle Anleger handeln',
        'Im regulierten Markt garantiert die Börse die Kurse',
      ],
      correctIndex: 1,
      explanation:
        'Der regulierte Markt ist gesetzlich geregelt: Prospektpflicht, Rechnungslegung nach internationalen Standards, Ad-hoc-Publizität, Stimmrechtsmitteilungen. Der Freiverkehr ist privatrechtlich von der Börse organisiert und verlangt weniger. Marktmissbrauchsrecht gilt in beiden Segmenten.',
    },
    {
      question:
        'Welche Aufgabe hat die zentrale Gegenpartei zwischen Abschluss und Lieferung?',
      options: [
        'Sie verwahrt die Wertpapiere der Endanleger',
        'Sie legt den Schlusskurs des Handelstages fest',
        'Sie tritt zwischen beide Seiten, trägt das Ausfallrisiko und verrechnet Geschäfte gegeneinander',
        'Sie prüft, ob der vereinbarte Preis marktgerecht ist',
      ],
      correctIndex: 2,
      explanation:
        'Aus einem Geschäft werden rechtlich zwei: Du kaufst von der Gegenpartei, der Verkäufer verkauft an sie. Fällt eine Seite aus, trägt sie den Schaden – abgesichert über Sicherheitsleistungen und einen Ausfallfonds. Durch das Netting muss zudem nur die Differenz tatsächlich geliefert werden.',
    },
    {
      question:
        'Der Handel in einer Aktie wird für einige Minuten unterbrochen, nachdem der Kurs stark gesprungen ist. Was ist der Zweck?',
      options: [
        'Den Kurs zu stützen und weitere Verluste zu verhindern',
        'Zeit für eine Prüfung durch die Aufsichtsbehörde zu schaffen',
        'Ausstehende Orders automatisch zu löschen',
        'Die Preisbildung zu entschleunigen, damit niemand zu einem Preis ausgeführt wird, der Sekunden später überholt ist',
      ],
      correctIndex: 3,
      explanation:
        'Eine Volatilitätsunterbrechung ersetzt den fortlaufenden Handel kurzzeitig durch eine Auktion. Sie stützt keine Kurse – der Preis darf danach beliebig tief liegen. Davon zu unterscheiden ist die Handelsaussetzung, die auf eine fehlende Information wartet und Tage dauern kann.',
    },
    {
      question:
        'Nach einem Aktiensplit im Verhältnis eins zu drei findest du am Morgen dreimal so viele Aktien zu einem Drittel des Kurses. Was ist mit deiner offenen Limit-Order?',
      options: [
        'Sie wird in der Regel gelöscht und muss neu erfasst werden',
        'Ihr Limit wird automatisch gedrittelt',
        'Sie bleibt unverändert bestehen und wird zum alten Limit ausgeführt',
        'Sie wird zur unlimitierten Order',
      ],
      correctIndex: 0,
      explanation:
        'Ein Limit, das sich auf den alten Kurs bezog, wäre nach dem Split sinnlos – bei einem Kaufauftrag würde es sofort und weit über dem neuen Kurs greifen. Deshalb werden offene Orders bei Kapitalmaßnahmen üblicherweise gestrichen. Wer langfristige Orders stehen hat, muss sie danach neu einstellen.',
    },
  ],
  // -------------------------------------------------------------- Tagesgeld
  'tagesgeld:beginner': [
    {
      question: 'Worin unterscheiden sich Tagesgeld und Festgeld im Kern?',
      options: [
        'Festgeld ist gesetzlich geschützt, Tagesgeld nicht',
        'Beim Festgeld trägt die Bank das Zinsänderungsrisiko, beim Tagesgeld du',
        'Festgeld wird nur bei ausländischen Banken angeboten',
        'Tagesgeld ist nur für Beträge unter 10.000 Euro möglich',
      ],
      correctIndex: 1,
      explanation:
        'Beim Festgeld steht der Satz für die gesamte Laufzeit fest – die Bank muss ihn auch dann zahlen, wenn die Zinsen inzwischen gefallen sind. Beim Tagesgeld ist er variabel: Sinkt das Zinsniveau, sinkt dein Zins mit. Geschützt sind beide gleichermaßen.',
    },
    {
      question:
        'Du hast bei derselben Bank ein Giro-, ein Tagesgeld- und ein Festgeldkonto mit zusammen 150.000 Euro. Wie viel ist gesetzlich geschützt?',
      options: [
        'Alles, weil es drei getrennte Konten sind',
        '150.000 Euro, weil jedes Konto einzeln zählt',
        '50.000 Euro, weil nur das Tagesgeld geschützt ist',
        '100.000 Euro – der Schutz gilt je Person und Institut, nicht je Konto',
      ],
      correctIndex: 3,
      explanation:
        'Alle Guthaben bei einem Institut werden zusammengezählt. Drei Konten bedeuten nicht dreimal Schutz. Bei einem Gemeinschaftskonto zweier Personen verdoppelt sich die Summe dagegen, weil der Schutz je Inhaber gilt.',
    },
    {
      question:
        'Warum ist Tagesgeld für den Vermögensaufbau über dreißig Jahre ungeeignet?',
      options: [
        'Weil Banken langfristige Einlagen kündigen dürfen',
        'Weil der Zins die Inflation meist nicht ausgleicht – nominal sicher heißt nicht real sicher',
        'Weil die Einlagensicherung nach zehn Jahren entfällt',
        'Weil Zinserträge nach fünf Jahren höher besteuert werden',
      ],
      correctIndex: 1,
      explanation:
        'Der Kontostand fällt nie, die Kaufkraft schon. Bei 2 Prozent Zins und 2,5 Prozent Inflation liegt der Realzins bei rund minus einem halben Prozent – jedes Jahr. Für den Notgroschen ist genau diese nominale Stabilität der Zweck; für dreißig Jahre ist es das falsche Werkzeug.',
    },
    {
      question: 'Wie groß sollte ein Notgroschen üblicherweise sein?',
      options: [
        'Drei bis sechs Monatsausgaben',
        'Genau 10.000 Euro, unabhängig von der Lebenssituation',
        'Ein Zwölftel des Jahresbruttoeinkommens',
        'So viel wie eine Jahresmiete',
      ],
      correctIndex: 0,
      explanation:
        'Maßstab sind die eigenen Ausgaben, nicht das Einkommen und keine Pauschale. Drei bis sechs Monate decken die üblichen Fälle ab – kaputte Heizung, defektes Auto, Kündigung. Wer selbstständig ist oder ein schwankendes Einkommen hat, rechnet eher am oberen Rand.',
    },
  ],
  'tagesgeld:fortgeschritten': [
    {
      question:
        'Warum reagieren Tagesgeldzinsen auf Leitzinssenkungen schneller als auf Erhöhungen?',
      options: [
        'Weil die Notenbank Senkungen sofort verbindlich vorgibt',
        'Weil Erhöhungen erst zum Jahreswechsel wirksam werden dürfen',
        'Weil wer sein Geld nicht bewegt, eine ausbleibende Erhöhung nicht bemerkt',
        'Weil Banken bei steigenden Zinsen weniger Einlagen brauchen',
      ],
      correctIndex: 2,
      explanation:
        'Es gibt keine Vorschrift zur Weitergabe. Eine Senkung spart der Bank sofort Geld; eine Erhöhung kostet sie welche, und solange die Kunden bleiben, gibt es keinen Anlass dazu. Der Einlagenzins der Notenbank bleibt dabei die Obergrenze dessen, was überhaupt bezahlbar wäre.',
    },
    {
      question:
        'Ein Angebot wirbt mit einem hohen Zins „für 6 Monate, bis 50.000 Euro, nur für Neukunden“. Du willst 120.000 Euro anlegen. Was folgt daraus?',
      options: [
        'Der beworbene Satz gilt für den vollen Betrag, nur eben ein halbes Jahr',
        'Nur ein Teil wird zum Aktionszins verzinst, der Rest zum niedrigeren Bestandssatz – der Durchschnitt liegt deutlich unter der beworbenen Zahl',
        'Der Zins gilt gar nicht, weil die Obergrenze überschritten ist',
        'Der Betrag über der Grenze wird unverzinst geführt',
      ],
      correctIndex: 1,
      explanation:
        'Beworben wird der günstigste Fall. Über der Obergrenze gilt der Bestandskundenzins, und nach der Frist gilt er für alles. Wer den tatsächlichen Ertrag wissen will, rechnet mit beiden Sätzen und über den gesamten Zeitraum – nicht mit der Zahl aus der Anzeige.',
    },
    {
      question: 'Was passiert ohne Freistellungsauftrag mit den Steuern auf Zinserträge?',
      options: [
        'Es fällt keine Steuer an, solange der Sparerpauschbetrag nicht überschritten ist',
        'Die Bank meldet die Erträge, zieht aber nichts ab',
        'Die Bank führt die Steuer ab; zurückholen lässt sie sich über die Steuererklärung',
        'Die Steuer wird erst bei Auflösung des Kontos fällig',
      ],
      correctIndex: 2,
      explanation:
        'Der Freibetrag entsteht nicht automatisch beim Institut – die Bank muss wissen, dass sie ihn berücksichtigen soll. Ohne Auftrag führt sie ab, und das Geld ist für ein Jahr weg. Der Betrag lässt sich auf mehrere Banken verteilen, insgesamt aber nur einmal ausschöpfen.',
    },
    {
      question:
        'Du hast Tagesgeld bei einer Bank im EU-Ausland. Was ist steuerlich anders?',
      options: [
        'Die Zinsen sind in Deutschland steuerfrei',
        'Es wird nichts automatisch abgeführt – die Zinsen gehören in die Steuererklärung',
        'Es gilt ein doppelter Sparerpauschbetrag',
        'Die deutsche Bank des Verrechnungskontos führt die Steuer ab',
      ],
      correctIndex: 1,
      explanation:
        'Ausländische Institute führen keine deutsche Abgeltungsteuer ab. Manche Länder behalten zudem eine eigene Quellensteuer ein, die sich in der Regel anrechnen lässt – aber nur, wenn man sie erklärt. Wer das übersieht, hat keinen Zinsvorteil erzielt, sondern eine unvollständige Erklärung abgegeben.',
    },
  ],
  'tagesgeld:profi': [
    {
      question:
        'Worin unterscheidet sich ein freiwilliger Einlagensicherungsfonds von der gesetzlichen Sicherung?',
      options: [
        'Er deckt höhere Beträge, begründet aber keinen einklagbaren Anspruch',
        'Er gilt nur für Festgeld, nicht für Tagesgeld',
        'Er ersetzt die gesetzliche Sicherung vollständig',
        'Er wird vom Staat garantiert',
      ],
      correctIndex: 0,
      explanation:
        'Die gesetzliche Sicherung bis 100.000 Euro ist ein Rechtsanspruch mit gesetzlicher Auszahlungsfrist. Der freiwillige Fonds eines Verbands geht darüber hinaus, ist aber eine Leistung des Verbands – im Ernstfall abhängig von dessen Mitteln und Entscheidung.',
    },
    {
      question: 'Was bedeutet Bail-in für Guthaben oberhalb der geschützten Summe?',
      options: [
        'Sie werden vorrangig aus Steuermitteln ersetzt',
        'Sie sind über den freiwilligen Fonds automatisch mitversichert',
        'Sie werden in Aktien der Bank umgewandelt und behalten ihren Wert',
        'Sie können zur Sanierung der Bank herangezogen werden – geschützte Einlagen dagegen nicht',
      ],
      correctIndex: 3,
      explanation:
        'Seit der Bankenkrise haften zuerst Eigentümer und Gläubiger, bevor öffentliche Mittel fließen. Einlagen von Privatpersonen stehen weit hinten in der Reihenfolge, und der Teil bis 100.000 Euro wird gar nicht herangezogen. Der Teil darüber schon – deshalb die Aufteilung auf mehrere Institute.',
    },
    {
      question:
        'Ein Fremdwährungskonto bietet deutlich mehr Zins als ein Eurokonto. Wie ist das einzuordnen?',
      options: [
        'Als Zinsvorteil ohne Gegenleistung',
        'Der Zinsvorsprung entspricht meist der vom Markt erwarteten Abwertung dieser Währung',
        'Als Zeichen besonderer Bonität der Bank',
        'Als steuerfreier Ertrag, weil im Ausland erzielt',
      ],
      correctIndex: 1,
      explanation:
        'Höhere Zinsen und erwartete Abwertung sind zwei Seiten derselben Sache – sonst gäbe es einen risikolosen Gewinn, und den würde der Markt sofort wegarbitrieren. Der höhere Zins ist die Bezahlung für ein Wechselkursrisiko, nicht ein Geschenk.',
    },
    {
      question: 'Ein Geldmarkt-ETF hat keinen Einlagenschutz. Wie schwer wiegt das?',
      options: [
        'Schwer – ohne Einlagenschutz droht bei Insolvenz des Anbieters der Totalverlust',
        'Gar nicht – Geldmarktfonds sind staatlich garantiert',
        'Wenig für den Anbieter, weil er Sondervermögen ist; das Risiko steckt in den gehaltenen Papieren',
        'Nur bei Beträgen über 100.000 Euro',
      ],
      correctIndex: 2,
      explanation:
        'Als Sondervermögen fällt der Fonds bei einer Insolvenz des Anbieters nicht in die Masse – dafür braucht er keinen Einlagenschutz. Sein Risiko liegt im Inhalt: Ein Fonds mit besicherten Übernachtgeschäften ist etwas anderes als einer mit kurzlaufenden Unternehmensanleihen, auch wenn beide „Geldmarkt“ heißen.',
    },
  ],
  // ------------------------------------------------------------------ Fonds
  'fonds:beginner': [
    {
      question: 'Was besitzt du, wenn du Fondsanteile hältst?',
      options: [
        'Die einzelnen Aktien anteilig, mit Stimmrecht auf den Hauptversammlungen',
        'Anteile am gesamten Fondsvermögen – die Wertpapiere selbst hält der Fonds',
        'Ein Darlehen an die Fondsgesellschaft',
        'Ein Recht auf eine feste jährliche Ausschüttung',
      ],
      correctIndex: 1,
      explanation:
        'Du hältst einen Bruchteil von allem, was im Fonds liegt. Auf Hauptversammlungen stimmt die Fondsgesellschaft ab, Dividenden fließen in den Fonds. Ein Darlehen wäre eine Anleihe, und eine feste Ausschüttung verspricht kein Fonds – was ausgeschüttet wird, hängt davon ab, was erwirtschaftet wurde.',
    },
    {
      question: 'Wie entsteht der Anteilspreis eines Fonds?',
      options: [
        'Durch Angebot und Nachfrage an der Börse',
        'Die Fondsgesellschaft legt ihn wöchentlich fest',
        'Wert aller Anlagen abzüglich Verbindlichkeiten, geteilt durch die Zahl der Anteile',
        'Er entspricht dem Einstandspreis zuzüglich der laufenden Kosten',
      ],
      correctIndex: 2,
      explanation:
        'Der Anteilspreis ist eine tägliche Rechnung, kein Verhandlungsergebnis – deshalb kann ein Fonds keine Blase auf sich selbst bilden. Bei börsengehandelten Fonds kommt zusätzlich ein Börsenpreis daneben, der leicht abweichen kann.',
    },
    {
      question:
        'Die Fondsgesellschaft meldet Insolvenz an. Was passiert mit deinem Geld?',
      options: [
        'Es fällt nicht in die Insolvenzmasse – das Fondsvermögen ist rechtlich getrennt',
        'Es ist bis 100.000 Euro über die Einlagensicherung geschützt, darüber verloren',
        'Es wird anteilig an die Gläubiger der Gesellschaft verteilt',
        'Der Fonds wird eingefroren und nach zehn Jahren ausgezahlt',
      ],
      correctIndex: 0,
      explanation:
        'Das ist der Kern des Sondervermögens: Das Fondsvermögen gehört den Anlegern, nicht der Gesellschaft, und wird von einer unabhängigen Depotbank verwahrt. Es wird übertragen oder aufgelöst und ausgezahlt. Vor fallenden Kursen schützt das allerdings nicht.',
    },
    {
      question:
        'Warum wiegen die laufenden Kosten eines Fonds schwerer als der einmalige Ausgabeaufschlag?',
      options: [
        'Weil sie steuerlich nicht absetzbar sind',
        'Weil sie beim Verkauf noch einmal anfallen',
        'Weil sie höher sind als jeder Ausgabeaufschlag',
        'Weil sie jedes Jahr auf das gesamte Vermögen anfallen – auch in Verlustjahren',
      ],
      correctIndex: 3,
      explanation:
        'Der Ausgabeaufschlag trifft einmal den eingezahlten Betrag, die laufenden Kosten jedes Jahr das gesamte angesparte Vermögen. Über Jahrzehnte summiert sich das erheblich. Und es ist die einzige Größe der Geldanlage, die im Voraus feststeht: Rendite ist eine Hoffnung, Kosten sind eine Tatsache.',
    },
  ],
  'fonds:fortgeschritten': [
    {
      question: 'Der Kurs eines offenen Immobilienfonds schwankt kaum. Was folgt daraus?',
      options: [
        'Der Fonds ist besonders sicher und mit Tagesgeld vergleichbar',
        'Wenig – Immobilien werden periodisch durch Gutachter bewertet, nicht täglich gehandelt',
        'Der Fonds hält überwiegend Bargeld',
        'Die Wertentwicklung ist garantiert',
      ],
      correctIndex: 1,
      explanation:
        'Der ruhige Kurs ist eine Folge der Bewertungsmethode, keine Eigenschaft der Anlage. Dazu kommen gesetzliche Fristen: 24 Monate Mindesthaltedauer und zwölf Monate Kündigungsfrist – eingeführt, nachdem in der Finanzkrise mehrere Fonds die Rücknahme aussetzen mussten.',
    },
    {
      question:
        'Warum liegt die durchschnittliche Rendite aktiver Fonds nach Kosten unter der des Marktes?',
      options: [
        'Weil Fondsmanager schlechter informiert sind als Privatanleger',
        'Weil aktive Fonds gesetzlich schlechtere Anlagen kaufen müssen',
        'Weil alle Anleger zusammen den Markt halten – ihr Durchschnitt vor Kosten ist die Marktrendite, nach Kosten weniger',
        'Weil aktive Fonds keine Dividenden vereinnahmen dürfen',
      ],
      correctIndex: 2,
      explanation:
        'Das Argument ist arithmetisch, nicht polemisch: Was der eine besser macht, macht ein anderer schlechter, und in der Summe halten alle den Markt. Die höheren Kosten ziehen den Durchschnitt darunter. Das schließt nicht aus, dass einzelne Fonds den Markt schlagen – nur der Durchschnitt kann es nicht.',
    },
    {
      question: 'Welcher Kostenblock ist in der Gesamtkostenquote (TER) NICHT enthalten?',
      options: [
        'Die Verwaltungsgebühr',
        'Die Kosten der Depotbank',
        'Die Prüfungskosten',
        'Die Transaktionskosten des Handels innerhalb des Fonds',
      ],
      correctIndex: 3,
      explanation:
        'Handelskosten innerhalb des Fonds stehen in keiner TER. Ein Fonds, der seinen Bestand jedes Jahr komplett umschichtet, zahlt hier ein Vielfaches eines ruhigen – bei gleicher ausgewiesener Kostenquote. Deshalb ist die Wertentwicklung nach Kosten der bessere Vergleichsmaßstab.',
    },
    {
      question:
        'Ein Fonds wird mit einem Kursindex verglichen und schneidet hervorragend ab. Was ist zu prüfen?',
      options: [
        'Ob der Fonds überhaupt zugelassen ist',
        'Ob im Kursindex die Dividenden fehlen – dann ist der Vergleich systematisch geschönt',
        'Ob der Fonds thesauriert oder ausschüttet',
        'Ob der Vergleich in Euro oder Dollar gerechnet wurde',
      ],
      correctIndex: 1,
      explanation:
        'Ein Kursindex bildet nur Kursbewegungen ab, ein Fonds vereinnahmt zusätzlich die Dividenden. Über Jahre ergibt das einen Vorsprung, der nichts mit dem Können des Managements zu tun hat. Verglichen wird gegen die Net-Return-Variante – und gegen den passenden Index, nicht irgendeinen.',
    },
  ],
  'fonds:profi': [
    {
      question: 'Was besagt die 5/10/40-Regel für OGAW-Fonds?',
      options: [
        'Der Fonds darf höchstens 40 Prozent seines Vermögens in Aktien halten',
        'Mindestens 40 Prozent müssen in liquiden Anlagen liegen',
        'Höchstens 10 Prozent in einen Emittenten, und Positionen über 5 Prozent zusammen höchstens 40 Prozent',
        'Der Fonds muss mindestens 40 verschiedene Werte halten',
      ],
      correctIndex: 2,
      explanation:
        'Die Regel begrenzt das Klumpenrisiko rechtlich statt nach Ermessen des Managers. Deshalb kann ein OGAW-Fonds nie zur Hälfte aus einem einzigen Wert bestehen, auch wenn der Manager es für richtig hielte.',
    },
    {
      question: 'Wozu dient Swing Pricing?',
      options: [
        'Den Anteilspreis bei hohen Rückgaben zu senken, damit die Handelskosten die Zurückgebenden treffen statt die Verbleibenden',
        'Den Anteilspreis an Börsentagen mehrfach anzupassen',
        'Erfolgsabhängige Vergütungen zu glätten',
        'Wechselkursschwankungen im Fonds auszugleichen',
      ],
      correctIndex: 0,
      explanation:
        'Ohne diesen Mechanismus zahlen die Verbleibenden die Kosten der Notverkäufe – und genau das erzeugt den Anreiz, als Erster zu gehen. Swing Pricing dreht den Anreiz um, indem es die Kosten dorthin legt, wo sie verursacht werden.',
    },
    {
      question:
        'Ein Fonds weist einen hohen Anteil an Positionen der Bewertungsstufe 3 aus. Was heißt das?',
      options: [
        'Er hält überwiegend Aktien großer Unternehmen',
        'Seine Anlagen sind besonders liquide',
        'Er hat besonders niedrige Kosten',
        'Ein erheblicher Teil des Anteilspreises beruht auf Modellannahmen statt auf beobachteten Preisen',
      ],
      correctIndex: 3,
      explanation:
        'Stufe 1 sind notierte Preise an aktiven Märkten, Stufe 2 Ableitungen aus beobachtbaren Größen, Stufe 3 überwiegend Modell. Bei einem Aktienfonds liegt der Anteil nahe null, bei manchen Anleihe- und Mischfonds erheblich. Er steht im Jahresbericht.',
    },
    {
      question:
        'Wie hoch ist die Teilfreistellung bei einem Fonds mit mindestens 51 Prozent Aktienanteil?',
      options: [
        '15 Prozent der Erträge bleiben steuerfrei',
        '30 Prozent der Erträge bleiben steuerfrei',
        '51 Prozent der Erträge bleiben steuerfrei',
        'Es gibt keine Teilfreistellung für Aktienfonds',
      ],
      correctIndex: 1,
      explanation:
        'Die Teilfreistellung gleicht pauschal aus, dass der Fonds selbst bereits Steuern gezahlt hat. Bei Aktienfonds ab 51 Prozent Aktienanteil sind es 30 Prozent, bei Mischfonds ab 25 Prozent sind es 15 Prozent, bei Immobilienfonds 60 oder 80 Prozent.',
    },
  ],
  // -------------------------------------------------------- Risiko & Rendite
  'risiko-und-rendite:beginner': [
    {
      question:
        'Ein Angebot verspricht 12 Prozent Rendite bei „voller Sicherheit“. Was ist die richtige Reaktion?',
      options: [
        'Zugreifen, solange das Angebot gilt',
        'Nachrechnen, ob die Rendite nach Steuern noch reicht',
        'Fragen, wofür man hier bezahlt wird – findet sich keine Gegenleistung, stimmt die Beschreibung nicht',
        'Den Betrag auf mehrere Anbieter verteilen',
      ],
      correctIndex: 2,
      explanation:
        'Rendite ist die Entschädigung dafür, dass jemand etwas übernimmt, das ein anderer vermeiden möchte. Findet man diese Gegenleistung nicht, hat man sie entweder übersehen oder sie wird verschwiegen. Ein Aufteilen auf mehrere Anbieter hilft nicht, wenn das Grundgeschäft nicht aufgeht.',
    },
    {
      question:
        'Dein Depot steht 25 Prozent im Minus. Wann wird daraus ein echter Verlust?',
      options: [
        'Sofort – der Wert ist ja gesunken',
        'Erst beim Verkauf; bis dahin ist es ein Buchverlust',
        'Nach zwölf Monaten, wenn die Spekulationsfrist abläuft',
        'Sobald die Bank den Depotauszug verschickt',
      ],
      correctIndex: 1,
      explanation:
        'Ein Kursrückgang schreibt sich erst durch den Verkauf fest. Genau deshalb ist das Zeitpunktrisiko das gefährlichste der vier: Wer verkaufen muss, weil er das Geld braucht, hat die Wahl nicht mehr. Der Notgroschen auf dem Tagesgeldkonto ist die Versicherung dagegen.',
    },
    {
      question: 'Ein Wert ist um 50 Prozent gefallen. Welcher Anstieg gleicht das aus?',
      options: ['100 Prozent', '50 Prozent', '75 Prozent', '150 Prozent'],
      correctIndex: 0,
      explanation:
        'Aus 100 werden 50; um wieder auf 100 zu kommen, muss sich der Wert verdoppeln. Diese Asymmetrie wächst rasch: Nach minus 90 Prozent braucht es eine Verzehnfachung. Sie ist der Grund, warum Streuung wichtiger ist als Trefferquote – ein Totalausfall lässt sich nicht durch drei gute Griffe ausgleichen.',
    },
    {
      question: 'Welche Angabe entscheidet vor einem Kauf über die passende Anlageform?',
      options: [
        'Die erwartete Rendite',
        'Die Kostenquote',
        'Die Bewertung des Marktes',
        'Wann das Geld wieder gebraucht wird',
      ],
      correctIndex: 3,
      explanation:
        'Der Anlagehorizont bestimmt, wie viel Schwankung überhaupt tragbar ist. Geld, das in zwei Jahren gebraucht wird, gehört unabhängig von jeder Renditeerwartung nicht in den Aktienmarkt – denn dort kann es in zwei Jahren deutlich weniger sein, und dann fehlt die Zeit, das auszusitzen.',
    },
  ],
  'risiko-und-rendite:fortgeschritten': [
    {
      question: 'Was ist die wichtigste Schwäche der Volatilität als Risikomaß?',
      options: [
        'Sie lässt sich nur für Aktien berechnen',
        'Sie behandelt Aufwärts- und Abwärtsbewegungen gleich',
        'Sie ist erst nach zehn Jahren aussagekräftig',
        'Sie berücksichtigt keine Dividenden',
      ],
      correctIndex: 1,
      explanation:
        'Ein Wert, der um 30 Prozent steigt, geht als ebenso „riskant“ in die Rechnung ein wie einer, der um 30 Prozent fällt. Über den ersten Fall hat sich noch niemand beschwert. Dazu kommen zwei weitere Schwächen: die Annahme einer Normalverteilung und der Blick nach hinten.',
    },
    {
      question:
        'Warum ist der maximale Rückgang für viele Anleger die nützlichere Zahl als die Volatilität?',
      options: [
        'Weil er von der Aufsicht vorgeschrieben ist',
        'Weil er die künftige Entwicklung besser vorhersagt',
        'Weil er beschreibt, was tatsächlich auszuhalten war – zusammen mit der Erholungsdauer',
        'Weil er Dividenden mit einrechnet',
      ],
      correctIndex: 2,
      explanation:
        '„Volatilität 18 Prozent“ sagt einem Menschen wenig, „das Depot stand zwei Jahre 40 Prozent im Minus“ sagt ihm alles. Vorhersagekraft hat auch der Rückgang nicht – er beantwortet aber die Frage, auf die es ankommt: Hätte ich das durchgehalten?',
    },
    {
      question: 'Eine Aktie hat ein Beta von 0,6. Was folgt daraus?',
      options: [
        'Sie schwankt historisch schwächer als der Gesamtmarkt – über ihr Insolvenzrisiko sagt das nichts',
        'Sie kann höchstens 60 Prozent verlieren',
        'Sie ist zu 60 Prozent im Index enthalten',
        'Sie erwirtschaftet 60 Prozent der Marktrendite',
      ],
      correctIndex: 0,
      explanation:
        'Beta misst die Bewegung relativ zum Markt, nicht die Wahrscheinlichkeit eines Ausfalls. Ein Unternehmen kann jahrelang ruhig verlaufen und dann insolvent gehen – das Beta hätte davon nichts angezeigt.',
    },
    {
      question: 'Warum enttäuscht Streuung ausgerechnet in Krisen?',
      options: [
        'Weil Fonds dann geschlossen werden',
        'Weil Korrelationen dann steigen – vieles fällt gleichzeitig',
        'Weil die Börsen den Handel aussetzen',
        'Weil Dividenden gestrichen werden',
      ],
      correctIndex: 1,
      explanation:
        'In ruhigen Zeiten laufen Anlageklassen auseinander, in Panikphasen fallen sie gemeinsam – 2008 und 2020 gaben Aktien, Unternehmensanleihen, Rohstoffe und Immobilienwerte zugleich nach. Streuung wirkt trotzdem, nur schwächer als die historische Korrelation verspricht.',
    },
  ],
  'risiko-und-rendite:profi': [
    {
      question: 'Was bedeuten „fette Ränder“ in der Verteilung der Renditen?',
      options: [
        'Die Handelsspannen sind an den Rändern des Tages größer',
        'Die Renditen sind gleichmäßig über alle Werte verteilt',
        'Extreme Tage kommen deutlich häufiger vor, als eine Normalverteilung zulässt',
        'Die Gebühren steigen bei extremen Bewegungen',
      ],
      correctIndex: 2,
      explanation:
        'Unter der Glockenkurve wäre der Tagesverlust von über 20 Prozent im Oktober 1987 ein Ereignis, das in der Lebensdauer des Universums nicht hätte auftreten dürfen. Er trat auf. Wer Risiko über die Standardabweichung steuert, unterschätzt genau die Fälle, auf die es ankommt.',
    },
    {
      question:
        'Warum ist die Reihenfolge der Renditejahre in der Entnahmephase entscheidend?',
      options: [
        'Weil in schlechten Jahren Anteile zu niedrigen Kursen verkauft werden und dauerhaft fehlen',
        'Weil die Steuer auf Kursgewinne mit den Jahren steigt',
        'Weil Dividenden in schlechten Jahren ausfallen',
        'Weil die Depotgebühren dann höher sind',
      ],
      correctIndex: 0,
      explanation:
        'Wer nur anspart, dem ist die Reihenfolge gleichgültig – am Ende steht dasselbe Ergebnis. Wer entnimmt, verkauft in Rückgangsjahren mehr Anteile für denselben Betrag; diese Anteile fehlen, und die spätere Erholung findet auf einem kleineren Bestand statt.',
    },
    {
      question:
        'Risikotragfähigkeit und Risikobereitschaft weichen voneinander ab. Welche ist maßgeblich?',
      options: [
        'Die Tragfähigkeit, weil sie nachrechenbar ist',
        'Die Bereitschaft, weil sie die persönliche Einstellung abbildet',
        'Der Durchschnitt aus beiden',
        'Die kleinere von beiden',
      ],
      correctIndex: 3,
      explanation:
        'Wer viel tragen könnte, es aber nicht aushält, verkauft im Rückgang – und realisiert genau den Verlust, den er sich rechnerisch hätte leisten können. Ein Depot, das nicht durchgehalten wird, ist unabhängig von seiner Konstruktion das falsche.',
    },
    {
      question: 'Was hilft gegen das Sequenzrisiko zu Beginn der Entnahmephase?',
      options: [
        'Die Aktienquote erst nach einem Rückgang senken',
        'Ein Puffer aus schwankungsarmen Anlagen und flexible statt fester Entnahmen',
        'Höhere Entnahmen in schlechten Jahren, um den Verlust auszugleichen',
        'Den Entnahmebetrag jährlich an die Inflation koppeln',
      ],
      correctIndex: 1,
      explanation:
        'Zwei bis drei Jahresbedarfe in schwankungsarmen Anlagen erlauben es, schlechte Jahre zu überbrücken, ohne Anteile zum Tiefstkurs zu verkaufen. Höhere Entnahmen im Rückgang verstärken den Effekt, statt ihn auszugleichen – und die Aktienquote senkt man vor Beginn der Entnahme, nicht danach.',
    },
  ],
  // ------------------------------------------------------- Cost-Average
  'cost-average-sparplan:beginner': [
    {
      question:
        'Warum liegt der durchschnittlich gezahlte Preis je Anteil unter dem Durchschnitt der Kurse?',
      options: [
        'Weil der Broker bei Sparplänen einen Rabatt gewährt',
        'Weil bei niedrigen Kursen mehr Anteile gekauft werden und diese Monate stärker ins Gewicht fallen',
        'Weil Sparpläne steuerlich begünstigt sind',
        'Weil die Ausführung immer zum Tagestief erfolgt',
      ],
      correctIndex: 1,
      explanation:
        'Dieselbe Rate kauft bei einem Kurs von 25 doppelt so viele Anteile wie bei 50. Die billigen Monate wiegen deshalb in deinem eigenen Durchschnitt schwerer als im schlichten Mittelwert der Kurse. Mit Rabatten oder Steuern hat das nichts zu tun.',
    },
    {
      question:
        'Unter welcher Bedingung entsteht der Durchschnittskosteneffekt überhaupt?',
      options: [
        'Wenn der Kurs zwischenzeitlich fällt',
        'Wenn der Kurs durchgehend steigt',
        'Wenn monatlich statt wöchentlich gekauft wird',
        'Wenn der Fonds thesauriert',
      ],
      correctIndex: 0,
      explanation:
        'Ohne Kursrückgänge gibt es keine billigen Monate – und damit keinen Effekt. Bei durchgehend steigenden Kursen kehrt er sich sogar um: Jede spätere Rate kauft teurer, und eine Einmalanlage zu Beginn hätte besser abgeschnitten.',
    },
    {
      question: 'Was ist der eigentliche Vorteil eines Sparplans?',
      options: [
        'Er erzielt zuverlässig eine höhere Rendite als die Einmalanlage',
        'Er schützt vor Kursverlusten',
        'Er macht die Frage nach dem richtigen Einstiegszeitpunkt überflüssig',
        'Er senkt die laufenden Kosten des Fonds',
      ],
      correctIndex: 2,
      explanation:
        'Die Zeitpunktfrage ist unbeantwortbar und hält Menschen jahrelang vom Anfangen ab. Ein Sparplan beantwortet sie ein für alle Mal mit „egal“ und läuft ohne monatliche Entscheidung weiter – gerade dann, wenn schlechte Nachrichten zum Aussetzen verleiten würden.',
    },
    {
      question: 'Was gehört vor den ersten Sparplan?',
      options: [
        'Eine Depoteröffnung bei mindestens zwei Brokern',
        'Der Notgroschen auf einem Tagesgeldkonto',
        'Eine Analyse der aktuellen Marktbewertung',
        'Ein Steuerberatungsgespräch',
      ],
      correctIndex: 1,
      explanation:
        'Ohne Notgroschen wird der Sparplan zur Notreserve, und dann verkauft man ausgerechnet dann, wenn die Kurse unten stehen. Drei bis sechs Monatsausgaben, sofort verfügbar – das ist die Versicherung gegen das Zeitpunktrisiko.',
    },
  ],
  'cost-average-sparplan:fortgeschritten': [
    {
      question:
        'Warum schneidet die Einmalanlage im Durchschnitt besser ab als das Verteilen?',
      options: [
        'Weil sie günstigere Ausführungskosten hat',
        'Weil Einmalanlagen steuerlich begünstigt sind',
        'Weil das Geld länger am Markt ist – in steigenden Märkten kostet jede Wartezeit erwartete Rendite',
        'Weil Fondsgesellschaften Einmalanlagen bevorzugt ausführen',
      ],
      correctIndex: 2,
      explanation:
        'Der Vorteil ist Zeit, nicht Timing. Wer verteilt anlegt, hat einen Teil des Geldes monatelang nicht investiert. In den bekannten Auswertungen für den US-Markt lag die Einmalanlage in etwa zwei von drei Fällen vorn – im verbleibenden Drittel kam kurz nach dem Start ein Rückgang.',
    },
    {
      question: 'Wann ist das Verteilen einer grossen Summe trotzdem die bessere Wahl?',
      options: [
        'Wenn man einen Rückgang kurz nach dem Einstieg nicht aushalten würde, ohne zu verkaufen',
        'Wenn die Summe über 100.000 Euro liegt',
        'Wenn die Märkte gerade auf einem Höchststand stehen',
        'Wenn der Anlagehorizont über zwanzig Jahre beträgt',
      ],
      correctIndex: 0,
      explanation:
        'Die Rechnung kennt nur die Rendite, nicht den Menschen. Ein Verkauf im Rückgang kostet weit mehr, als die Wartezeit gekostet hätte. Das Verteilen ist deshalb eine bewusst bezahlte Versicherungsprämie gegen die eigene Reaktion – man sollte nur wissen, dass man sie zahlt.',
    },
    {
      question:
        'Welche Stellschraube eines Sparplans hat praktisch keine Wirkung auf das Ergebnis?',
      options: [
        'Die Kosten je Ausführung',
        'Die laufenden Kosten des Fonds',
        'Die Höhe der Rate',
        'Der Ausführungstag im Monat',
      ],
      correctIndex: 3,
      explanation:
        'Auswertungen über Jahrzehnte finden keinen belastbaren Unterschied zwischen dem Ersten und dem Fünfzehnten. Kosten je Ausführung dagegen wirken erheblich: Ein Euro auf eine Rate von 25 Euro sind vier Prozent, die sofort weg sind.',
    },
    {
      question:
        'Bei einer Rate von 25 Euro verlangt der Broker 1 Euro je Ausführung. Wie ordnet man das ein?',
      options: [
        'Unerheblich, weil es ein fester Betrag ist',
        'Vier Prozent der Rate – mehr, als die laufenden Kosten eines breiten ETF in zehn Jahren ausmachen',
        'Etwa so viel wie die Abgeltungsteuer auf den erwarteten Gewinn',
        'Vertretbar, solange der Fonds thesauriert',
      ],
      correctIndex: 1,
      explanation:
        'Feste Gebühren treffen kleine Raten prozentual hart. Vier Prozent Einstiegskosten muss die Anlage erst wieder erwirtschaften. Viele Broker führen Sparpläne auf breite ETFs kostenfrei aus – ein Vergleich lohnt hier mehr als jede Feinjustierung am Ausführungstag.',
    },
  ],
  'cost-average-sparplan:profi': [
    {
      question: 'Warum ist eine Dynamisierung der Rate sinnvoll?',
      options: [
        'Weil höhere Raten günstigere Ausführungskonditionen bekommen',
        'Weil eine feste Rate real schrumpft – bei 2,5 Prozent Inflation nach dreissig Jahren auf etwa die Hälfte',
        'Weil sie den Durchschnittskosteneffekt verstärkt',
        'Weil sie die Steuerlast senkt',
      ],
      correctIndex: 1,
      explanation:
        'Eine nominal gleichbleibende Rate verliert über Jahrzehnte den Grossteil ihrer Kaufkraft. Wer sie jährlich um die Inflationsrate oder die Gehaltssteigerung erhöht, hält sie real konstant – am besten direkt nach einer Gehaltserhöhung, bevor sich der Lebensstandard daran gewöhnt.',
    },
    {
      question: 'Wie lässt sich in der Ansparphase ohne Steuerfolge rebalancieren?',
      options: [
        'Indem die neuen Raten dorthin fliessen, wo etwas fehlt',
        'Indem einmal jährlich der gestiegene Teil verkauft wird',
        'Indem der Fonds gewechselt wird',
        'Indem Ausschüttungen entnommen statt wiederangelegt werden',
      ],
      correctIndex: 0,
      explanation:
        'Ein Verkauf löst Abgeltungsteuer aus, eine Umlenkung der nächsten Rate nicht. Das funktioniert, solange die neuen Einzahlungen im Verhältnis zum Bestand gross genug sind – bei 400.000 Euro Depot und 300 Euro Rate verschiebt sich damit nichts mehr.',
    },
    {
      question: 'Was ist der praktische Haupteinwand gegen Value Averaging?',
      options: [
        'Es ist bei deutschen Brokern nicht zulässig',
        'Es funktioniert nur bei Einzelaktien',
        'Es verlangt die grössten Einzahlungen ausgerechnet nach einem Kursrutsch – und erzeugt Verkäufe mit Steuerfolge',
        'Es erfordert tägliche Überwachung des Depots',
      ],
      correctIndex: 2,
      explanation:
        'Die Methode kauft noch stärker antizyklisch als ein gewöhnlicher Sparplan, verlangt dafür aber unvorhersehbare Beträge genau dann, wenn oft auch das Einkommen unsicher ist. Der gemessene Vorsprung ist klein und verschwindet vielfach, sobald Steuern und Handelskosten eingerechnet werden.',
    },
    {
      question: 'Wann beginnt der Übergang von der Anspar- in die Entnahmephase?',
      options: [
        'Am Tag der ersten Entnahme',
        'Sobald das Sparziel erreicht ist',
        'Mit dem Renteneintritt',
        'Jahre vorher – wegen des Sequenzrisikos in den ersten Entnahmejahren',
      ],
      correctIndex: 3,
      explanation:
        'Fällt der Markt kurz nach Beginn der Entnahmen, werden Anteile zu niedrigen Kursen verkauft und fehlen dauerhaft. Deshalb wird die Aktienquote fünf bis zehn Jahre vorher schrittweise gesenkt – über die laufenden Raten, nicht über Verkäufe – und ein Puffer für zwei bis drei Jahre aufgebaut.',
    },
  ],
  // ---------------------------------------------------------- Depot & Broker
  'depot-und-broker:beginner': [
    {
      question: 'Dein Broker wird insolvent. Was gilt für die Wertpapiere im Depot?',
      options: [
        'Sie gehören dir und fallen nicht in die Insolvenzmasse',
        'Sie sind bis 100.000 Euro über die Einlagensicherung gedeckt',
        'Sie werden verkauft und der Erlös anteilig verteilt',
        'Sie gehen an die Fondsgesellschaft zurück',
      ],
      correctIndex: 0,
      explanation:
        'Die Bank verwahrt nur, Eigentümer bist du – die Papiere werden herausgegeben oder übertragen. Anders das Guthaben auf dem Verrechnungskonto: Das gehört der Bank, sie schuldet es dir, und dafür greift die Einlagensicherung bis 100.000 Euro.',
    },
    {
      question: 'Welche Angabe identifiziert ein Wertpapier eindeutig?',
      options: [
        'Der Name des Fonds oder Unternehmens',
        'Das Börsenkürzel',
        'Die ISIN',
        'Die Fondsgesellschaft',
      ],
      correctIndex: 2,
      explanation:
        'Die ISIN ist die weltweit eindeutige zwölfstellige Kennung. Namen sind mehrdeutig – es gibt Dutzende Fonds mit „Global“ im Titel, die völlig Verschiedenes enthalten. Die WKN ist die ältere deutsche Kurzform und ebenfalls eindeutig, aber nur im Inland gebräuchlich.',
    },
    {
      question:
        'Warum sollte der Freistellungsauftrag gleich bei der Depoteröffnung eingerichtet werden?',
      options: [
        'Weil er später nicht mehr geändert werden kann',
        'Weil sonst auf jeden Ertrag Steuer abgeführt wird, die man erst über die Steuererklärung zurückbekommt',
        'Weil er die Ordergebühren senkt',
        'Weil ohne ihn keine Sparpläne möglich sind',
      ],
      correctIndex: 1,
      explanation:
        'Ohne Auftrag weiß die Bank nicht, dass sie den Sparerpauschbetrag berücksichtigen soll, und führt ab. Das Geld ist damit für rund ein Jahr weg. Ändern lässt sich der Auftrag jederzeit – er sollte nur von Anfang an da sein.',
    },
    {
      question: 'Was sagt eine Limit-Order zu, was eine Market-Order nicht zusagt?',
      options: [
        'Die sofortige Ausführung',
        'Den Handelsplatz',
        'Den Höchstpreis beim Kauf beziehungsweise Mindestpreis beim Verkauf',
        'Die Ausführung ohne Gebühren',
      ],
      correctIndex: 2,
      explanation:
        'Market sagt Ausführung zu, aber nicht den Preis; Limit sagt den Preis zu, aber nicht die Ausführung. Beides zugleich gibt es nicht. Bei umsatzstarken Werten am Nachmittag ist der Unterschied klein, außerhalb der Haupthandelszeit kann er erheblich sein.',
    },
  ],
  'depot-und-broker:fortgeschritten': [
    {
      question:
        'Ein Wert eröffnet 25 Prozent tiefer. Dein Stop-Loss lag bei minus 10 Prozent. Was passiert?',
      options: [
        'Es wird bei minus 10 Prozent verkauft, wie eingestellt',
        'Die Order verfällt, weil die Schwelle übersprungen wurde',
        'Es wird bei minus 25 Prozent verkauft – der Stop löst nur aus, er begrenzt den Preis nicht',
        'Der Broker führt zum Vortagesschluss aus',
      ],
      correctIndex: 2,
      explanation:
        'Ein Stop-Loss löst bei Erreichen der Schwelle eine Market-Order aus, und die wird zum nächsten verfügbaren Preis ausgeführt. Genau im Crash, wo man den Schutz bräuchte, versagt er deshalb. Wer den Preis begrenzen will, braucht eine Stop-Limit-Order – riskiert dann aber, gar nicht zu verkaufen.',
    },
    {
      question:
        'Wann ist eine US-Aktie in Deutschland tendenziell am günstigsten zu handeln?',
      options: [
        'Morgens um 9 Uhr zur Eröffnung in Frankfurt',
        'Ab 15:30 Uhr, wenn der US-Heimatmarkt geöffnet hat',
        'Kurz vor 22 Uhr im außerbörslichen Handel',
        'Der Zeitpunkt spielt keine Rolle',
      ],
      correctIndex: 1,
      explanation:
        'Solange der Heimatmarkt geschlossen ist, muss der Market Maker den fairen Wert schätzen und sichert sich über eine größere Spanne ab. Mit der Öffnung in New York gibt es einen laufenden Referenzkurs, und die Spanne wird enger.',
    },
    {
      question: 'Was kostet ein Depotübertrag zu einem anderen Anbieter?',
      options: [
        'Nichts – er ist gesetzlich kostenfrei',
        'Eine Pauschale je übertragener Position',
        'Ein Prozent des Depotwerts',
        'Die Differenz der Depotgebühren beider Anbieter',
      ],
      correctIndex: 0,
      explanation:
        'Die Verwahrung ist eine Nebenpflicht, und für ihre Beendigung darf nichts berechnet werden. Zwei bis sechs Wochen dauert es trotzdem, und in dieser Zeit lässt sich nicht handeln.',
    },
    {
      question: 'Worauf ist bei einem Depotübertrag besonders zu achten?',
      options: [
        'Dass beide Depots dieselbe Bank haben',
        'Dass die Anschaffungsdaten mitwandern – sonst unterstellt der neue Broker Anschaffungskosten von null',
        'Dass der Übertrag im Januar erfolgt',
        'Dass alle Positionen vorher verkauft werden',
      ],
      correctIndex: 1,
      explanation:
        'Ohne Kaufdatum und Kaufkurs kann der neue Broker den steuerpflichtigen Gewinn nicht berechnen und versteuert beim Verkauf den vollen Erlös. Das lässt sich über die Steuererklärung korrigieren – aber nur mit Belegen. Besonders häufig fehlen die Daten bei Überträgen aus dem Ausland.',
    },
  ],
  'depot-und-broker:profi': [
    {
      question:
        'Wie verdient ein Broker an einer Order, für die er keine Gebühr verlangt?',
      options: [
        'Über Zinsen auf das Verrechnungskonto allein',
        'Über eine Vergütung des Handelsplatzes, an den er die Order weiterleitet',
        'Über eine staatliche Förderung',
        'Gar nicht – er subventioniert das Geschäft dauerhaft',
      ],
      correctIndex: 1,
      explanation:
        'Payment for Order Flow: Der Handelsplatz zahlt für die Weiterleitung und verdient am Spread. Für kleine Order kann das vorteilhaft sein, bei großen kehrt es sich um – ein Zehntelprozent auf 50.000 Euro sind 50 Euro. In der EU läuft das Modell mit einer Übergangsfrist bis 2026 aus.',
    },
    {
      question:
        'Du nimmst am Wertpapierleihe-Programm deines Brokers teil. Was ändert sich?',
      options: [
        'Nichts – die Papiere bleiben Sondervermögen',
        'Die Dividenden verdoppeln sich',
        'Für die Dauer der Leihe bist du nicht mehr Eigentümer, sondern hast einen Rückgabeanspruch',
        'Die Papiere sind zusätzlich staatlich versichert',
      ],
      correctIndex: 2,
      explanation:
        'Verliehene Papiere sind kein Sondervermögen mehr – fällt der Entleiher aus, greifen nur die gestellten Sicherheiten. Dividenden werden zudem nur ersetzt, nicht gezahlt, was steuerlich anders behandelt werden kann. Die Erträge liegen bei Standardwerten oft im Bruchteil eines Prozents.',
    },
    {
      question:
        'Was ist der wesentliche Unterschied zwischen einem deutschen und einem ausländischen Broker?',
      options: [
        'Ausländische Broker dürfen keine deutschen Aktien anbieten',
        'Bei ausländischen Brokern gibt es keine Einlagensicherung',
        'Deutsche Broker verlangen grundsätzlich höhere Gebühren',
        'Der deutsche führt die Abgeltungsteuer automatisch ab, beim ausländischen gehört alles in die Steuererklärung',
      ],
      correctIndex: 3,
      explanation:
        'Der Unterschied liegt selten bei den Gebühren, sondern in der Abwicklung: kein Freistellungsauftrag, Vorabpauschale selbst ermitteln, Verlustverrechnung von Hand über die Anlage KAP. Für ein einfaches Depot überschaubar, bei vielen Transaktionen ein Abend im Jahr plus Fehlerrisiko.',
    },
    {
      question: 'Was ist bei einer Brokerinsolvenz die praktisch unangenehmste Folge?',
      options: [
        'Dass die Wertpapiere verloren sind',
        'Dass wochen- bis monatelang nicht gehandelt werden kann',
        'Dass alle Positionen zwangsverkauft werden',
        'Dass die Anschaffungsdaten gelöscht werden',
      ],
      correctIndex: 1,
      explanation:
        'Die Papiere liegen beim Zentralverwahrer und werden übertragen – ein Totalverlust droht nicht. Aber die Übertragung dauert, und wer in dieser Zeit verkaufen will, kann es nicht. Zusätzlich ist Guthaben auf dem Verrechnungskonto nur bis 100.000 Euro geschützt.',
    },
  ],
  // -------------------------------------------------- Worauf Einsteiger achten
  'worauf-achten-einsteiger:beginner': [
    {
      question:
        'Du hast einen Dispokredit und willst mit dem Investieren anfangen. Was kommt zuerst?',
      options: [
        'Den Dispo abbauen – er kostet sicher mehr, als eine Anlage erwarten lässt',
        'Beides parallel, damit die Zeit am Markt nicht verloren geht',
        'Investieren, weil Aktien langfristig mehr bringen als der Dispozins',
        'Erst den Notgroschen, dann den Dispo',
      ],
      correctIndex: 0,
      explanation:
        'Ein Dispo kostet zweistellig, und zwar sicher. Eine Aktienrendite ist eine Hoffnung. Schulden abzubauen ist deshalb keine Alternative zum Anlegen, sondern die Anlage mit der höchsten garantierten Verzinsung, die es gibt.',
    },
    {
      question: 'Wonach bemisst sich die Größe des Notgroschens?',
      options: [
        'Nach dem Nettoeinkommen',
        'Nach den monatlichen Ausgaben – drei bis sechs davon',
        'Nach der Höhe des Depots',
        'Nach einer Pauschale von 10.000 Euro',
      ],
      correctIndex: 1,
      explanation:
        'Was gedeckt werden muss, sind laufende Ausgaben, nicht Einkommen. Wer selbstständig ist, ein schwankendes Einkommen hat oder allein für Kinder sorgt, rechnet eher am oberen Rand. Der Notgroschen ist keine Renditeposition, sondern die Versicherung gegen den Verkauf im falschen Moment.',
    },
    {
      question:
        'Welche dieser Versicherungen ist für die meisten Erwerbstätigen existenziell?',
      options: [
        'Handyversicherung',
        'Reiserücktrittsversicherung',
        'Berufsunfähigkeitsversicherung',
        'Brillenversicherung',
      ],
      correctIndex: 2,
      explanation:
        'Versichert wird, was ruiniert, nicht was ärgert. Der Verlust der Arbeitskraft beendet das Einkommen womöglich für Jahrzehnte – ein kaputtes Handy zahlt man aus dem Notgroschen. Ebenfalls existenziell: die Privathaftpflicht, weil dort unbegrenzte Summen möglich sind.',
    },
    {
      question:
        'Du brauchst in drei Jahren 15.000 Euro für ein Auto. Wohin gehört das Geld?',
      options: [
        'In einen breit gestreuten Aktien-ETF',
        'Auf Tages- oder Festgeld',
        'In Einzelaktien mit hoher Dividende',
        'Zur Hälfte in Aktien, zur Hälfte in Krypto',
      ],
      correctIndex: 1,
      explanation:
        'Drei Jahre sind zu kurz für den Aktienmarkt – er kann in dieser Zeit deutlich im Minus stehen, und dann fehlt die Zeit, das auszusitzen. Jedes Ziel braucht einen Betrag und ein Datum; daraus folgt die Anlageform, nicht umgekehrt.',
    },
  ],
  'worauf-achten-einsteiger:fortgeschritten': [
    {
      question:
        '10.000 Euro, 6 Prozent Bruttorendite, 30 Jahre. Wie groß ist der Unterschied zwischen 0,2 und 1,8 Prozent laufenden Kosten?',
      options: [
        'Etwa 2.000 Euro',
        'Etwa 5.000 Euro',
        'Etwa 20.000 Euro – rund das Doppelte des ursprünglichen Einsatzes',
        'Etwa 50.000 Euro',
      ],
      correctIndex: 2,
      explanation:
        'Aus 10.000 Euro werden bei 0,2 Prozent Kosten rund 54.000, bei 1,8 Prozent rund 34.000 – knapp 20.000 Euro Unterschied bei identischer Anlage und identischem Marktverlauf. Der Unterschied ist keine Frage des Glücks; er stand am ersten Tag fest.',
    },
    {
      question:
        'Warum sind Arbeitgeberaktien ein besonders unterschätztes Klumpenrisiko?',
      options: [
        'Weil sie steuerlich schlechter behandelt werden',
        'Weil sie nur mit Haltefrist verkauft werden dürfen',
        'Weil sie meist überbewertet sind',
        'Weil Einkommen und Vermögen am selben Unternehmen hängen – geht es schief, fällt beides zugleich',
      ],
      correctIndex: 3,
      explanation:
        'Genau dann, wenn man Rücklagen bräuchte, ist auch der Arbeitsplatz gefährdet. Belegschaftsaktien mit Rabatt bleiben trotzdem attraktiv – die Regel lautet nicht "nicht nehmen", sondern "nach der Haltefrist verkaufen und breit anlegen". Als Obergrenze gelten fünf bis zehn Prozent des Vermögens.',
    },
    {
      question: 'Welcher Unterschied im Basisinformationsblatt ist der folgenreichste?',
      options: [
        'Ob das Produkt thesauriert oder ausschüttet',
        'Ob es sich um Sondervermögen handelt oder um eine Schuldverschreibung des Emittenten',
        'Ob die Kosten monatlich oder jährlich berechnet werden',
        'Ob eine empfohlene Haltedauer angegeben ist',
      ],
      correctIndex: 1,
      explanation:
        'Ein Fonds ist Sondervermögen und übersteht die Insolvenz des Anbieters. Ein Zertifikat ist eine Schuldverschreibung – geht der Emittent pleite, ist das Geld weg, unabhängig davon, wie sich der Basiswert entwickelt hat. Dieser Unterschied steht selten in der Werbung.',
    },
    {
      question:
        'Welcher Satz gehört in eine schriftliche Anlagestrategie und wird am häufigsten vergessen?',
      options: [
        'Die erwartete Jahresrendite',
        'Der Name des bevorzugten Brokers',
        'Was bei einem Kursrückgang von 30 Prozent geschieht',
        'Die Liste der geplanten Einzelaktien',
      ],
      correctIndex: 2,
      explanation:
        'Dieser Satz muss geschrieben sein, bevor die 30 Prozent da sind. Im Rückgang argumentiert man mit sich selbst – und gegen ein Blatt Papier vom letzten Jahr argumentiert man schlechter als gegen ein vages Vorhaben.',
    },
  ],
  'worauf-achten-einsteiger:profi': [
    {
      question: 'Warum hilft es, seltener ins Depot zu sehen?',
      options: [
        'Weil die Kurse dann stabiler verlaufen',
        'Weil häufiges Hinsehen überwiegend Rauschen zeigt und die Handelsfrequenz erhöht',
        'Weil Broker für häufige Abfragen Gebühren berechnen',
        'Weil die Steuer sich nach der Zahl der Depotabfragen richtet',
      ],
      correctIndex: 1,
      explanation:
        'Wer täglich hineinsieht, sieht kurzfristige Schwankungen und handelt entsprechend häufiger – jede Runde kostet Gebühr und Spread. Wer vierteljährlich hineinsieht, trifft die gleichen langfristigen Entscheidungen mit deutlich weniger Transaktionen.',
    },
    {
      question:
        'Welches Ausfallszenario wird bei der Depotstruktur am häufigsten übersehen?',
      options: [
        'Der eigene Ausfall – weiß jemand, dass es das Depot gibt und wie man darankommt?',
        'Die Insolvenz des Brokers',
        'Die Schließung eines Fonds',
        'Ein Ausfall der Handelsplattform',
      ],
      correctIndex: 0,
      explanation:
        'Die anderen drei sind bekannt und beherrschbar. Der eigene Ausfall wird dagegen selten bedacht: Eine Aufstellung an einem auffindbaren Ort mit Anbieter, Zugangsweg und Ansprechpartner erspart Angehörigen erhebliche Mühe.',
    },
    {
      question:
        'Welche der vier Kostenebenen ist typischerweise die teuerste und zugleich am schlechtesten sichtbar?',
      options: [
        'Die Depotebene mit Order- und Handelsplatzgebühren',
        'Die Produktebene mit der laufenden Kostenquote',
        'Die Steuerebene mit Abgeltungsteuer und Vorabpauschale',
        'Die Beratungsebene mit Ausgabeaufschlägen und Bestandsprovisionen',
      ],
      correctIndex: 3,
      explanation:
        'Ausgabeaufschläge, Bestandsprovisionen und Verwaltungsgebühren tauchen auf keiner Abrechnung als Posten auf – sie sind im Preis oder im Fondsvermögen enthalten. Vollständig ist eine Kostenbetrachtung erst, wenn alle vier Ebenen zusammengezählt sind.',
    },
    {
      question: 'Welche Kombination reicht allein aus, um ein Angebot abzulehnen?',
      options: [
        'Hohe Rendite bei angeblich geringem Risiko, verbunden mit Zeitdruck',
        'Eine Mindestanlagesumme über 10.000 Euro',
        'Ein Sitz des Anbieters im EU-Ausland',
        'Eine empfohlene Haltedauer über zehn Jahre',
      ],
      correctIndex: 0,
      explanation:
        'Rendite ohne entsprechendes Risiko gibt es nicht – und eine seriöse Anlage läuft einem nicht weg. Weitere Warnzeichen: keine Zulassung bei der BaFin, Ertrag aus der Anwerbung weiterer Anleger, kein Basisinformationsblatt und keine ISIN. Ein EU-Sitz allein ist dagegen unauffällig.',
    },
  ],
  // ------------------------------------------------------- Kosten & Gebühren
  'kosten-und-gebuehren:beginner': [
    {
      question: 'Welche dieser Kostenarten taucht auf keiner Abrechnung auf?',
      options: [
        'Der Ausgabeaufschlag',
        'Die Ordergebühr',
        'Die laufenden Fondskosten',
        'Die Depotgebühr',
      ],
      correctIndex: 2,
      explanation:
        'Sie werden täglich anteilig aus dem Fondsvermögen entnommen – der Anteilspreis ist bereits um sie gemindert. Ebenso unsichtbar sind der Spread und die Handelskosten innerhalb des Fonds. Zusammen sind diese drei fast immer der größere Posten.',
    },
    {
      question:
        'Warum wiegen laufende Kosten schwerer als ein einmaliger Ausgabeaufschlag?',
      options: [
        'Weil sie höher sind als jeder Ausgabeaufschlag',
        'Weil sie jedes Jahr auf das gesamte angesparte Vermögen wirken, nicht nur auf eine Einzahlung',
        'Weil sie steuerlich nicht absetzbar sind',
        'Weil sie beim Verkauf noch einmal anfallen',
      ],
      correctIndex: 1,
      explanation:
        'Der Ausgabeaufschlag trifft einmal die Einzahlung. Eine Kostenquote trifft im dreißigsten Jahr einen sechsstelligen Depotwert, nicht die Monatsrate. Dazu kommt: Was entnommen wird, kann sich nicht mehr verzinsen – der Verlust ist größer als die Summe der Gebühren.',
    },
    {
      question:
        '300 Euro monatlich über 30 Jahre bei 6 Prozent Bruttorendite. Wie viel bleibt bei 0,2 gegenüber 2,0 Prozent Kosten übrig?',
      options: [
        'Etwa 10.000 Euro Unterschied',
        'Etwa 30.000 Euro Unterschied',
        'Etwa 80.000 Euro Unterschied – rund ein Viertel des Ergebnisses',
        'Der Unterschied ist bei Sparplänen vernachlässigbar',
      ],
      correctIndex: 2,
      explanation:
        'Aus 108.000 Euro Einzahlung werden bei 0,2 Prozent Kosten rund 290.000 Euro, bei 2,0 Prozent nur rund 208.000. Knapp 82.000 Euro Unterschied bei identischer Einzahlung und identischem Markt – der einzige Unterschied ist die Kostenquote, und die stand am ersten Tag fest.',
    },
    {
      question: 'Wo lässt sich bei langfristiger Anlage am meisten sparen?',
      options: [
        'Bei den laufenden Fondskosten',
        'Bei der einzelnen Ordergebühr',
        'Bei der Depotgebühr',
        'Beim Handelsplatzentgelt',
      ],
      correctIndex: 0,
      explanation:
        'Die Fondskosten wirken jedes Jahr auf alles – breite Indexfonds liegen bei 0,05 bis 0,25 Prozent, aktive Aktienfonds häufig bei 1,5 Prozent und mehr. Die Ordergebühr ist bei zwei Käufen im Jahr der kleinste Hebel; wichtig wird sie nur bei sehr kleinen Sparraten.',
    },
  ],
  'kosten-und-gebuehren:fortgeschritten': [
    {
      question: 'Welcher Posten ist in der Gesamtkostenquote TER NICHT enthalten?',
      options: [
        'Die Verwaltungsvergütung',
        'Die Kosten der Depotbank',
        'Die Transaktionskosten innerhalb des Fonds',
        'Die Wirtschaftsprüfungskosten',
      ],
      correctIndex: 2,
      explanation:
        'Die TER ist eine Untergrenze, keine Gesamtangabe: Handelskosten im Fonds, erfolgsabhängige Vergütungen und Swap-Gebühren stehen ausdrücklich nicht darin. Ein Fonds, der seinen Bestand jährlich umschlägt, zahlt hier ein Vielfaches eines ruhigen – bei identischer TER.',
    },
    {
      question: 'Warum kann die Tracking-Differenz eines ETF kleiner sein als seine TER?',
      options: [
        'Weil die TER falsch berechnet wurde',
        'Weil Erträge aus Wertpapierleihe und Quellensteueroptimierung den Rückstand verkleinern',
        'Weil die Tracking-Differenz Dividenden ausklammert',
        'Weil sie nur für synthetische ETFs gilt',
      ],
      correctIndex: 1,
      explanation:
        'Die Tracking-Differenz misst ein Ergebnis, keine Gebühr – alles, was tatsächlich passiert ist, steckt darin. Zusatzerträge können den Rückstand verkleinern, in Einzelfällen liegt ein Fonds sogar vor seinem Index. Zu betrachten sind mehrere Jahre; ein einzelnes kann von einem Sondereffekt geprägt sein.',
    },
    {
      question: 'Wie vergleicht man die Gesamtkosten zweier Wege sauber?',
      options: [
        'Alle Prozentangaben addieren',
        'Nur die TER vergleichen',
        'Nur die Ordergebühren vergleichen',
        'Alle Posten eines Jahres in Euro ausrechnen und durch den Depotwert teilen',
      ],
      correctIndex: 3,
      explanation:
        'Prozentzahlen verschiedener Bezugsgrößen lassen sich nicht addieren – die Kostenquote bezieht sich auf den Depotwert, die Ordergebühr auf die Ordergröße. In Euro gerechnet zeigt sich, dass bei kleinen Depots die Ordergebühren dominieren und bei großen die Fondskosten.',
    },
    {
      question:
        'Kleines Depot mit monatlichem Sparplan – worauf kommt es hier vor allem an?',
      options: [
        'Auf kostenfreie Sparplanausführung',
        'Auf die niedrigstmögliche Fondskostenquote',
        'Auf die Zahl der verfügbaren Handelsplätze',
        'Auf die Höhe der Depotgebühr',
      ],
      correctIndex: 0,
      explanation:
        'Bei kleinen Raten dominieren feste Ausführungskosten: Ein Euro auf 25 Euro Rate sind vier Prozent, die sofort weg sind. Die Fondskostenquote ist zweitrangig, solange sie im üblichen Rahmen liegt. Bei großen Depots mit seltenen Käufen kehrt sich das Verhältnis um.',
    },
  ],
  'kosten-und-gebuehren:profi': [
    {
      question: 'Was ist eine Bestandsprovision?',
      options: [
        'Eine Gebühr für die Verwahrung großer Bestände',
        'Ein Teil der laufenden Fondskosten, der jährlich an den Vertrieb zurückfließt',
        'Eine einmalige Vergütung beim Fondskauf',
        'Eine Prämie für langes Halten eines Fonds',
      ],
      correctIndex: 1,
      explanation:
        'Sie wird gezahlt, solange der Fonds im Depot liegt, und beträgt oft die Hälfte der Verwaltungsvergütung. Das erklärt, warum ein provisionsfinanzierter Berater eher einen Fonds mit 1,5 Prozent Kosten empfiehlt als einen Indexfonds mit 0,15. Seit MiFID II steht der Betrag in der jährlichen Kosteninformation.',
    },
    {
      question: 'Wozu dient eine Hochwassermarke bei einer erfolgsabhängigen Vergütung?',
      options: [
        'Sie begrenzt die Vergütung auf einen Höchstbetrag je Jahr',
        'Sie verhindert, dass derselbe Wertzuwachs nach einem Verlustjahr ein zweites Mal vergütet wird',
        'Sie legt fest, ab welchem Fondsvolumen die Vergütung entfällt',
        'Sie koppelt die Vergütung an den risikolosen Zins',
      ],
      correctIndex: 1,
      explanation:
        'Ohne Hochwassermarke kassiert der Manager nach einem Verlustjahr für die blosse Rückkehr zum alten Stand erneut. Mit ihr muss der frühere Höchststand erst wieder überschritten sein. Ohne Hochwassermarke, gegen den Geldmarktzins gemessen und jährlich abgerechnet ist eine Performance-Fee im Kern eine erhöhte Verwaltungsvergütung.',
    },
    {
      question: 'Bei welcher Art von Produkt ist "billiger" NICHT automatisch besser?',
      options: [
        'Bei breiten Indexfonds',
        'Beim Tagesgeld',
        'Beim Wertpapierhandel an einem liquiden Handelsplatz',
        'Bei Versicherungen',
      ],
      correctIndex: 3,
      explanation:
        'Bei standardisierten Produkten ist die Leistung identisch, dort entscheidet der Preis. Bei Leistungsversprechen entscheidet der Vertragstext: Der günstigste Tarif ist wertlos, wenn die Bedingungen den Leistungsfall ausschließen. Die Unterscheidung zu treffen ist die eigentliche Aufgabe.',
    },
    {
      question: 'Warum ist ein sehr kleiner Fonds trotz niedriger Kostenquote riskant?',
      options: [
        'Weil er höhere Spreads hat',
        'Weil er keine Dividenden ausschütten darf',
        'Weil eine Schließung wahrscheinlicher ist – und sie schreibt Gewinne zu einem nicht gewählten Zeitpunkt fest',
        'Weil er nicht als Sondervermögen gilt',
      ],
      correctIndex: 2,
      explanation:
        'Ein Fondsvolumen im niedrigen zweistelligen Millionenbereich rechnet sich für den Anbieter kaum. Wird der Fonds aufgelöst, gilt das steuerlich als Verkauf – aufgelaufene Gewinne werden versteuert, ohne dass man den Zeitpunkt bestimmt hätte. Eine Verschmelzung ist dagegen meist steuerneutral.',
    },
  ],

  // --------------------------------------------------------- Portfolio-Aufbau
  'portfolio-aufbau:beginner': [
    {
      question:
        'Warum entscheidet die Aktienquote mehr über das Ergebnis als die Wahl zwischen zwei ähnlichen Welt-ETFs?',
      options: [
        'Weil ETFs untereinander steuerlich unterschiedlich behandelt werden',
        'Weil die Kostenquote eines ETF über die Jahre keine Rolle spielt',
        'Weil nur die Quote die Rendite bestimmt, das Produkt gar nicht',
        'Weil die Quote festlegt, wie stark sich ein Marktrückgang überhaupt auf das Gesamtvermögen auswirkt',
      ],
      correctIndex: 3,
      explanation:
        'Zwei breite Welt-ETFs unterscheiden sich um Bruchteile eines Prozentpunkts im Jahr. Ob 40 oder 80 Prozent des Vermögens in Aktien stecken, verdoppelt dagegen den Ausschlag nach oben wie nach unten. Die Produktwahl ist nicht egal – sie ist nur die kleinere von zwei Entscheidungen.',
    },
    {
      question:
        'Wozu dient der risikoarme Topf in einem Zwei-Topf-Modell in erster Linie?',
      options: [
        'Er sorgt dafür, dass der Aktienteil im Rückgang nicht angetastet werden muss',
        'Er erwirtschaftet den Inflationsausgleich für das Gesamtvermögen',
        'Er gleicht Kursverluste des Aktienteils rechnerisch aus',
        'Er ist die eigentliche Renditequelle des Depots',
      ],
      correctIndex: 0,
      explanation:
        'Der sichere Topf verdient wenig und soll das auch nicht. Seine Aufgabe ist, laufende Ausgaben und Notfälle zu decken, damit im Rückgang niemand Aktien zu schlechten Kursen verkaufen muss. Genau das Durchhalten ist der Grund, warum der Aktienteil seine Rendite überhaupt liefern kann.',
    },
    {
      question:
        'Der Aktienmarkt fällt um 40 Prozent, der risikoarme Teil bleibt stabil. Wie stark verliert ein Depot mit 60 Prozent Aktienquote?',
      options: [
        'Um 40 Prozent – der Rückgang wirkt auf das ganze Depot',
        'Um 60 Prozent – Quote und Rückgang addieren sich',
        'Gar nicht, solange nichts verkauft wird',
        'Um 24 Prozent – der Rückgang trifft nur den Aktienanteil',
      ],
      correctIndex: 3,
      explanation:
        '60 Prozent des Depots verlieren 40 Prozent ihres Werts, der Rest bleibt. 0,6 × 40 = 24 Prozent Rückgang des Gesamtdepots. Diese einfache Rechnung ist das eigentliche Werkzeug: Sie übersetzt eine abstrakte Quote in den Betrag, den man im Ernstfall auf dem Auszug sieht.',
    },
    {
      question: 'Wie belastbar ist die Regel „100 minus Lebensalter gleich Aktienquote“?',
      options: [
        'Als grober Startpunkt brauchbar, aber sie kennt weder Anlagehorizont noch Rücklagen noch Einkommen',
        'Sie ist die aktuell beste verfügbare Berechnung und sollte übernommen werden',
        'Sie gilt nur für Menschen ohne gesetzliche Rentenansprüche',
        'Sie ist wissenschaftlich widerlegt und darf nicht verwendet werden',
      ],
      correctIndex: 0,
      explanation:
        'Die Regel benutzt eine einzige Größe – das Alter – für eine Entscheidung, die von mehreren abhängt. Ein 60-Jähriger mit sicherer Rente und ohne Miete kann mehr Risiko tragen als ein 35-Jähriger mit schwankendem Einkommen. Als Anhaltspunkt taugt sie, als Antwort nicht.',
    },
  ],

  'portfolio-aufbau:fortgeschritten': [
    {
      question:
        'Warum steigt die Aktienquote eines Depots ohne jedes Zutun – und warum ist das ungünstig?',
      options: [
        'Weil der Aktienteil in guten Phasen stärker wächst; das Risiko steigt damit ausgerechnet am Ende einer guten Phase',
        'Weil Ausschüttungen automatisch in Aktien angelegt werden',
        'Weil der risikoarme Teil durch Inflation nominal schrumpft',
        'Weil Fondsanbieter die Gewichtung regelmäßig anpassen',
      ],
      correctIndex: 0,
      explanation:
        'Aus 70 zu 30 werden nach guten Börsenjahren leicht 82 zu 18. Niemand hat das entschieden, aber das Depot trägt jetzt mehr Risiko als geplant – und zwar nach einem langen Anstieg, also dann, wenn ein Rückschlag eher wahrscheinlicher als unwahrscheinlicher geworden ist.',
    },
    {
      question: 'Was ist der Zweck von Rebalancing?',
      options: [
        'Höhere Rendite durch systematisches Kaufen zu niedrigen Kursen',
        'Steuern zu sparen, weil Verluste mit Gewinnen verrechnet werden',
        'Die Kosten des Depots zu senken',
        'Die geplante Aufteilung und damit das geplante Risiko wiederherzustellen',
      ],
      correctIndex: 3,
      explanation:
        'Rebalancing ist Risikosteuerung, kein Renditewerkzeug. Über lange Zeiträume kostet es sogar leicht Rendite, weil regelmäßig vom besser laufenden in den schwächeren Teil umgeschichtet wird. Dafür hält es die Schwankung dort, wo man sie geplant hat – und das ist der eigentliche Nutzen.',
    },
    {
      question:
        'Was ist in der Ansparphase der steuerlich günstigste Weg, eine verschobene Aufteilung zurückzusetzen?',
      options: [
        'Den zu stark gewachsenen Teil verkaufen und sofort neu aufteilen',
        'Die nächsten Einzahlungen in den zu kleinen Teil umlenken, statt zu verkaufen',
        'Den Sparplan aussetzen, bis sich die Quote von allein wieder einpendelt',
        'Alles verkaufen und das Depot neu aufbauen',
      ],
      correctIndex: 1,
      explanation:
        'Neue Raten in den untergewichteten Teil zu lenken verschiebt die Quote ohne Verkauf und damit ohne Steuer. Der Weg funktioniert allerdings nur, solange die Einzahlungen im Verhältnis zum Bestand groß genug sind: Bei 400.000 Euro Depot und 300 Euro Rate bewegt sich damit nichts mehr.',
    },
    {
      question:
        'Warum ist ein Welt-ETF plus ein zusätzlicher US-ETF meist keine bessere Streuung?',
      options: [
        'Weil die USA im Weltindex ohnehin den größten Anteil stellen – die Wette wird ungewollt verdoppelt',
        'Weil zwei ETFs steuerlich schlechter behandelt werden als einer',
        'Weil US-Aktien im Weltindex vollständig fehlen',
        'Weil ein zweiter ETF die Kostenquote des ersten erhöht',
      ],
      correctIndex: 0,
      explanation:
        'Mehr Bausteine sind nicht automatisch mehr Streuung. Ein zusätzlicher Fonds bringt nur dann etwas, wenn er enthält, was im ersten fehlt. Verstärkt er lediglich eine bereits vorhandene Übergewichtung, ist es eine Wette – nur eine, die man nicht bewusst eingegangen ist.',
    },
  ],

  'portfolio-aufbau:profi': [
    {
      question:
        'Warum kann ein Beamter mit fünfzig oft mehr Aktienrisiko tragen als ein Selbstständiger mit dreißig?',
      options: [
        'Weil Beamte steuerlich bevorzugt anlegen dürfen',
        'Weil das Alter für die Aktienquote grundsätzlich keine Rolle spielt',
        'Weil ein längerer Anlagehorizont das Risiko in jedem Fall ausgleicht',
        'Weil sicheres Einkommen und sichere Rentenansprüche wie ein großer anleiheähnlicher Vermögensteil wirken',
      ],
      correctIndex: 3,
      explanation:
        'Wer ein planbares Einkommen und eine gesicherte Rente hat, besitzt außerhalb des Depots bereits einen großen stabilen Posten und braucht im Depot weniger Puffer. Ein Selbstständiger hat das Gegenteil: schwankendes Einkommen, gekoppelt an dieselbe Konjunktur wie die Aktienmärkte.',
    },
    {
      question: 'Was ist der eigentliche Preis einer Umschichtung im Privatvermögen?',
      options: [
        'Die Ordergebühren beider Transaktionen',
        'Der Spread zwischen Kauf- und Verkaufskurs',
        'Der Zinseszins auf den Betrag, der als Steuer abfließt und deshalb nicht weiterarbeitet',
        'Die Vorabpauschale des Folgejahres',
      ],
      correctIndex: 2,
      explanation:
        'Die Abgeltungsteuer selbst wäre irgendwann ohnehin fällig. Teuer ist die Vorverlegung: Wer heute 5.000 Euro Steuer zahlt statt in zwanzig Jahren, verliert nicht 5.000 Euro, sondern das, was daraus in zwanzig Jahren geworden wäre. Deshalb braucht eine Umschichtung einen Grund, der darüber hinausgeht.',
    },
    {
      question: 'Was beschreibt das Sequenzrisiko in der Entnahmephase?',
      options: [
        'Dass die Reihenfolge der Verkäufe steuerlich nach FIFO festgelegt ist',
        'Dass die Inflation die Entnahmen über die Jahre entwertet',
        'Dass Ausschüttungen und Entnahmen zeitlich auseinanderfallen',
        'Dass ein Markteinbruch kurz nach dem Start dauerhaft wirkt, weil Anteile zu niedrigen Kursen verkauft werden',
      ],
      correctIndex: 3,
      explanation:
        'Bei gleicher Durchschnittsrendite entscheidet die Reihenfolge der Jahre über das Ergebnis. Anteile, die früh zu niedrigen Kursen verkauft wurden, fehlen in jeder späteren Erholung. Deshalb beginnt der Übergang zur Entnahme Jahre vor der ersten Auszahlung, nicht am Tag davor.',
    },
    {
      question: 'Wie ist die oft zitierte Vier-Prozent-Regel einzuordnen?',
      options: [
        'Als Größenordnung aus historischen US-Daten brauchbar, als Zusage für die Zukunft nicht',
        'Als gesetzlich festgelegte Obergrenze für Entnahmen aus Depots',
        'Als Regel, die für jeden Markt und jede Ruhestandslänge gleichermaßen gilt',
        'Als Berechnung des jährlich steuerfrei entnehmbaren Betrags',
      ],
      correctIndex: 0,
      explanation:
        'Die Regel stammt aus einer Untersuchung des US-Marktes über historische Dreißigjahreszeiträume. Andere Märkte, andere Zeiträume und ein längerer Ruhestand führen zu anderen Ergebnissen. Wer sie benutzt, sollte die Entnahme in schlechten Jahren nach unten anpassen können.',
    },
  ],

  // ------------------------------------------------------- Anlegerpsychologie
  'anlegerpsychologie:beginner': [
    {
      question:
        'Ein Depot ist um 50 Prozent gefallen. Welcher Anstieg bringt es zurück auf den Ausgangswert?',
      options: [
        '100 Prozent – der Anstieg wirkt nur noch auf den halbierten Bestand',
        '50 Prozent – Rückgang und Anstieg heben sich auf',
        '75 Prozent, weil zwischenzeitliche Zinsen mitwirken',
        'Das lässt sich ohne Kenntnis des Ausgangsbetrags nicht sagen',
      ],
      correctIndex: 0,
      explanation:
        'Aus 100 werden 50. Um von 50 zurück auf 100 zu kommen, braucht es eine Verdopplung. Rückgang und Erholung sind nie gleich groß, weil der Anstieg auf einen kleineren Bestand wirkt – das ist Prozentrechnung und der sachliche Kern hinter dem Gefühl, dass Verluste schwerer wiegen.',
    },
    {
      question: 'Was beschreibt der Dispositionseffekt?',
      options: [
        'Die Neigung, das Depot nach einem Verlust häufiger zu prüfen',
        'Die Neigung, Gewinner zu früh zu verkaufen und Verlierer zu lange zu halten',
        'Die Bevorzugung von Aktien aus dem eigenen Land',
        'Die Neigung, nach guten Jahren die Sparrate zu erhöhen',
      ],
      correctIndex: 1,
      explanation:
        'Der Verkauf eines Gewinners bestätigt eine gute Entscheidung, der Verkauf eines Verlierers macht den Fehler endgültig. Gehandelt wird also nach dem Bedürfnis, sich nichts eingestehen zu müssen – nicht nach einer Einschätzung dessen, was die Papiere künftig tun.',
    },
    {
      question:
        'Welche Rolle spielt der eigene Einstandskurs für die Frage, ob eine Anlage heute gehalten werden sollte?',
      options: [
        'Er ist die wichtigste Größe, weil unterhalb davon nicht verkauft werden sollte',
        'Er bestimmt, ab wann ein Verkauf steuerlich sinnvoll wird',
        'Er ist eine sinnvolle Untergrenze für Verkaufsentscheidungen',
        'Keine – für die künftige Entwicklung ist er bedeutungslos',
      ],
      correctIndex: 3,
      explanation:
        'Was du bezahlt hast, weiß der Markt nicht und beeinflusst die künftige Entwicklung nicht. Der Einstandskurs wirkt trotzdem als Anker: „erst wieder bei null verkaufen“ ist eine der teuersten Regeln überhaupt, weil sie an einer Zahl festhält, die nur in der eigenen Buchhaltung existiert.',
    },
    {
      question: 'Warum schützt das Wissen über Denkfehler allein nicht vor ihnen?',
      options: [
        'Weil die Muster unter Stress trotzdem greifen – wirksam sind nur vorher festgelegte Regeln',
        'Weil die Forschungsergebnisse für Privatanleger nicht gelten',
        'Weil die Muster nur bei kurzfristigen Anlagen auftreten',
        'Weil sie sich mit genügend Erfahrung vollständig abtrainieren lassen',
      ],
      correctIndex: 0,
      explanation:
        'Wer die Muster kennt, kann sie hinterher benennen. Im Moment fallender Kurse greifen sie trotzdem, weil sie schnell und unbewusst wirken. Deshalb setzt alles Wirksame vorher an: eine schriftliche Regel oder ein Sparplan trifft die Entscheidung, solange nichts passiert ist.',
    },
  ],

  'anlegerpsychologie:fortgeschritten': [
    {
      question: 'Was ist mit „mentaler Buchführung“ gemeint?',
      options: [
        'Das Führen eines Anlagetagebuchs mit Datum und Begründung',
        'Die getrennte Erfassung von Kursgewinnen und Ausschüttungen im Depot',
        'Dass Geld je nach Herkunft in getrennten Schubladen behandelt wird, statt in einer Gesamtrechnung',
        'Die Aufteilung des Vermögens auf mehrere Banken',
      ],
      correctIndex: 2,
      explanation:
        'Ein Euro ist ein Euro, egal ob geerbt, gewonnen oder erspart. Die mentale Buchführung trennt ihn trotzdem – und erzeugt Entscheidungen wie einen Kredit zu acht Prozent zu bedienen, während Tagesgeld zu zwei Prozent danebenliegt. Über beide Schubladen zusammen gerechnet wäre der Fall eindeutig.',
    },
    {
      question:
        'Warum ist es riskant, größere Bestände an Aktien des eigenen Arbeitgebers zu halten?',
      options: [
        'Weil Mitarbeiteraktien höher besteuert werden als andere Aktien',
        'Weil Einkommen und Vermögen dann am selben Unternehmen hängen und gemeinsam ausfallen können',
        'Weil sie in der Regel schlechter abschneiden als der Gesamtmarkt',
        'Weil sie nicht über das eigene Depot gehandelt werden dürfen',
      ],
      correctIndex: 1,
      explanation:
        'Gerät der Arbeitgeber in Schwierigkeiten, fallen Gehalt und Depotwert gleichzeitig – also genau dann, wenn Rücklagen gebraucht würden. Der Rabatt auf Mitarbeiteraktien ist ein echter Vorteil und rechtfertigt den Kauf; er rechtfertigt nicht, den Bestand dauerhaft aufzubauen.',
    },
    {
      question:
        'Untersuchungen finden zwischen der Fondsrendite und dem Ergebnis der Anleger meist rund einen Prozentpunkt pro Jahr Unterschied. Woher stammt diese Lücke?',
      options: [
        'Aus den laufenden Kosten des Fonds, die in der Wertentwicklung nicht enthalten sind',
        'Aus Währungseffekten bei international anlegenden Fonds',
        'Aus der Abgeltungsteuer auf Ausschüttungen',
        'Aus den Zeitpunkten der Ein- und Ausstiege: Es wird nach Anstiegen gekauft und nach Rückgängen verkauft',
      ],
      correctIndex: 3,
      explanation:
        'Verglichen wird dieselbe Anlage mit sich selbst: die Wertentwicklung des Fonds gegen die tatsächlich erzielte Rendite seiner Anleger. Die Kosten stecken in beiden Zahlen. Was übrig bleibt, ist das Verhalten – und über eine Ansparzeit kostet ein Prozentpunkt einen erheblichen Teil des Endergebnisses.',
    },
    {
      question: 'Warum wird empfohlen, seltener ins Depot zu schauen?',
      options: [
        'Weil häufiges Nachsehen mehr rote Tage zeigt und dadurch Handlungsdruck ohne neue Information erzeugt',
        'Weil jeder Depotaufruf Gebühren beim Broker auslöst',
        'Weil Kurse erst mit Verzögerung korrekt angezeigt werden',
        'Weil man sonst den optimalen Verkaufszeitpunkt verpasst',
      ],
      correctIndex: 0,
      explanation:
        'Bei täglicher Betrachtung ist etwa die Hälfte aller Tage negativ, bei jährlicher deutlich weniger. Der Informationsgehalt eines einzelnen Tages ist für einen langfristigen Anleger gleich null – der emotionale Gehalt nicht. Mehr Blicke führen nachweislich zu mehr Handel, und mehr Handel kostet.',
    },
  ],

  'anlegerpsychologie:profi': [
    {
      question:
        'Warum heben sich individuelle Denkfehler im Markt nicht gegenseitig auf?',
      options: [
        'Weil professionelle Anleger sie gezielt verstärken',
        'Weil sie gleichgerichtet auftreten – Menschen werden zur selben Zeit optimistisch',
        'Weil es zu wenige Marktteilnehmer für einen Ausgleich gibt',
        'Weil Kurse nur von institutionellen Anlegern bestimmt werden',
      ],
      correctIndex: 1,
      explanation:
        'Zufällig verteilte Fehler würden sich im Durchschnitt ausgleichen. Verhaltensmuster sind aber synchron: Dieselben Nachrichten erzeugen bei vielen dieselbe Reaktion. Aus einem individuellen Muster wird dadurch eine Marktbewegung – und mit Kredit im Spiel eine selbstverstärkende.',
    },
    {
      question:
        'Warum lassen sich dokumentierte Anomalien wie Momentum in der Praxis oft nicht in Rendite umsetzen?',
      options: [
        'Weil sie nur an US-Börsen auftreten',
        'Weil Privatanleger die nötigen Daten nicht bekommen',
        'Weil sie nach Veröffentlichung schwächer werden und Handelskosten, Steuern und lange Durststrecken den Rest aufzehren',
        'Weil sie inzwischen als statistische Artefakte widerlegt sind',
      ],
      correctIndex: 2,
      explanation:
        'Folgt genug Kapital einem beschriebenen Effekt, verschwindet der Vorsprung, dem es folgt. Was bleibt, wird von Spread, Gebühren und Abgeltungsteuer auf jeden realisierten Gewinn aufgebraucht. Und eine Strategie, die zehn Jahre zurückliegt, geben fast alle vorher auf – wieder aus psychologischen Gründen.',
    },
    {
      question:
        'Die Verhaltensökonomie hat die strenge Effizienzmarkthypothese widerlegt. Was folgt daraus praktisch?',
      options: [
        'Wenig: Ein Markt kann unvollkommen und trotzdem schwer zu schlagen sein, weil die Abweichungen klein und teuer zu handeln sind',
        'Dass aktives Handeln für Privatanleger nun systematisch überlegen ist',
        'Dass Indexanlagen ihre Berechtigung verloren haben',
        'Dass Kurse keinerlei Informationsgehalt besitzen',
      ],
      correctIndex: 0,
      explanation:
        '„Nicht vollkommen effizient“ ist nicht dasselbe wie „leicht auszunutzen“. Die nachgewiesenen Abweichungen sind klein, unbeständig und verursachen im Handel Kosten. Für die Praxis bleibt die Schlussfolgerung deshalb dieselbe wie unter der strengen Hypothese.',
    },
    {
      question:
        'Warum macht der Rückschaufehler die eigene Selbsteinschätzung unbrauchbar?',
      options: [
        'Weil sich frühere Kurse im Nachhinein nicht mehr abrufen lassen',
        'Weil Verluste stärker erinnert werden als Gewinne',
        'Weil er nur bei sehr langen Anlagezeiträumen auftritt',
        'Weil der Verlauf im Nachhinein naheliegend erscheint und die damalige Unsicherheit aus der Erinnerung verschwindet',
      ],
      correctIndex: 3,
      explanation:
        'Der Rückschaufehler vernichtet die Beweise: Er verändert die Erinnerung an das, was man vorher dachte. Wer sich fragt, ob er Märkte einschätzen kann, befragt damit eine bereits angepasste Erinnerung. Prüfbar wird eine Einschätzung nur, wenn sie vor dem Ereignis mit Datum notiert wurde.',
    },
  ],

  // ------------------------------------------------------ Budget & Sparquote
  'budget-und-sparquote:beginner': [
    {
      question: 'Wie ist die Sparquote definiert?',
      options: [
        'Als Anteil des Nettoeinkommens, der nach allen Ausgaben übrig bleibt',
        'Als Anteil des Nettoeinkommens, der nach den Fixkosten übrig bleibt',
        'Als Betrag, der monatlich per Dauerauftrag überwiesen wird',
        'Als Anteil des Bruttoeinkommens, der angelegt wird',
      ],
      correctIndex: 0,
      explanation:
        'Entscheidend ist das Wort „allen“. Der Betrag nach Miete und Versicherungen sieht deutlich besser aus als der Betrag am Monatsende – genau daran schätzen die meisten ihre Quote zu hoch. Und die Bezugsgröße ist das Netto, weil nur das tatsächlich zur Verfügung steht.',
    },
    {
      question:
        'Warum reicht es nicht, drei Monate Kontoauszüge auszuwerten, ohne etwas zu ergänzen?',
      options: [
        'Weil Kontoauszüge nur zwei Jahre lang abrufbar sind',
        'Weil Lastschriften erst mit Verzögerung gebucht werden',
        'Weil Jahreskosten wie Kfz-Versicherung oder Urlaub in einem Dreimonatsfenster meist gar nicht vorkommen',
        'Weil variable Kosten in jedem Monat gleich hoch sind',
      ],
      correctIndex: 2,
      explanation:
        'Fixkosten und variable Kosten sind in drei Monaten sichtbar, Jahreskosten nicht. Sie treffen das Budget später umso härter. Das Gegenmittel ist einfach: alle Jahreskosten zusammenzählen, durch zwölf teilen und den Betrag als monatliche Position mitführen.',
    },
    {
      question: 'Warum ist eine Bargeldabhebung keine brauchbare Ausgabenkategorie?',
      options: [
        'Weil Bargeldabhebungen Gebühren auslösen',
        'Weil sie erst im Folgemonat gebucht wird',
        'Weil sie steuerlich nicht absetzbar ist',
        'Weil sie die eigentliche Ausgabe verdeckt – man weiß hinterher nicht, wofür das Geld ausgegeben wurde',
      ],
      correctIndex: 3,
      explanation:
        '„Abhebung 200 €“ sagt nichts darüber, ob daraus Lebensmittel, Freizeit oder Geschenke wurden. Bei größeren Barbeträgen bleibt nur, diesen Teil eine Woche lang mitzuschreiben – sonst ist der größte unklare Posten ausgerechnet der, den man ändern könnte.',
    },
    {
      question: 'In welcher Reihenfolge gehören Sparen, Notgroschen und Anlegen?',
      options: [
        'Anlegen zuerst, damit die Zeit im Markt nicht verloren geht; der Notgroschen wächst nebenher',
        'Erst sparen und den Notgroschen aufbauen, danach anlegen',
        'Notgroschen und Depot parallel, jeweils zur Hälfte des Überschusses',
        'Zuerst anlegen, den Notgroschen erst ab einem Depotwert von 10.000 Euro',
      ],
      correctIndex: 1,
      explanation:
        'Ohne Notgroschen wird die erste unerwartete Rechnung aus dem Depot bezahlt – und die kommt erfahrungsgemäß dann, wenn die Kurse gerade niedrig sind. Der Notgroschen kostet ein wenig Rendite und schützt dafür genau die Entscheidung, auf der der ganze Plan beruht.',
    },
  ],

  'budget-und-sparquote:fortgeschritten': [
    {
      question:
        'Warum sollten Rücklage für Jahreskosten und Notgroschen getrennt geführt werden?',
      options: [
        'Weil für beide unterschiedliche Zinssätze gelten',
        'Weil die Rücklage steuerpflichtig ist, der Notgroschen nicht',
        'Weil sonst das Geplante das Ungeplante aufbraucht – der Urlaub wird gebucht und der Notgroschen ist weg',
        'Weil die Einlagensicherung nur ein Konto je Zweck abdeckt',
      ],
      correctIndex: 2,
      explanation:
        'Die Rücklage ist dafür da, jedes Jahr aufgebraucht zu werden – das ist ihr Zweck. Der Notgroschen darf genau das nie. In einem gemeinsamen Topf lässt sich beides nicht auseinanderhalten, und im Ernstfall stellt sich heraus, dass der Puffer längst verplant war.',
    },
    {
      question: 'Was beschreibt Lifestyle-Inflation?',
      options: [
        'Den Anstieg der Lebenshaltungskosten durch die allgemeine Preisentwicklung',
        'Dass Ausgaben mit steigendem Einkommen mitwachsen, sodass die Sparquote trotz mehr Gehalt sinkt',
        'Die jährliche Anpassung der Sparrate an die Inflationsrate',
        'Den Anstieg der Fixkosten durch langfristige Verträge',
      ],
      correctIndex: 1,
      explanation:
        'Der Vorgang läuft ohne bewusste Entscheidung ab: größere Wohnung, besseres Auto, mehr Abonnements. Nach einem Jahr bleibt prozentual weniger übrig als vor der Gehaltserhöhung. Dagegen hilft, die Anpassung im selben Monat vorzunehmen, in dem die Erhöhung kommt.',
    },
    {
      question:
        'Wie funktioniert die Regel der halben Erhöhung und warum ist sie leichter durchzuhalten als Verzicht?',
      options: [
        'Die Sparrate wird halbiert, sobald das Einkommen steigt',
        'Die Hälfte des Notgroschens wird angelegt, sobald er vollständig aufgebaut ist',
        'Die Sparrate wird jedes Jahr um die halbe Inflationsrate angehoben',
        'Die Hälfte jeder Gehaltserhöhung geht in die Sparrate, die andere Hälfte steht zur Verfügung',
      ],
      correctIndex: 3,
      explanation:
        'Nach der Erhöhung bleibt mehr Geld übrig als vorher – nur eben nicht das gesamte zusätzliche. Es gibt also nichts aufzugeben, und genau deshalb hält die Regel: Sie verlangt keine Änderung an einer bestehenden Gewohnheit, sondern nur an einer neuen.',
    },
    {
      question:
        'Wie sollte eine Sparquote bei stark schwankendem Einkommen festgelegt werden?',
      options: [
        'Als Untergrenze beziehungsweise Prozentsatz vom Eingang statt als fester Eurobetrag',
        'Als fester Eurobetrag, damit die Planung verlässlich bleibt',
        'Als Betrag, der sich am besten Monat des Vorjahres orientiert',
        'Gar nicht – bei schwankendem Einkommen wird erst am Jahresende gespart',
      ],
      correctIndex: 0,
      explanation:
        'Ein fester Betrag ist in guten Monaten zu niedrig und in schlechten nicht zu halten. Ein Prozentsatz vom tatsächlichen Eingang passt sich von selbst an, und eine Untergrenze sorgt dafür, dass auch in schwachen Monaten etwas fließt. Vor einer Kreditaufnahme wird die Rate gesenkt, nicht danach.',
    },
  ],

  'budget-und-sparquote:profi': [
    {
      question:
        'Warum wiegt in den ersten Jahren eine höhere Sparrate schwerer als ein Prozentpunkt mehr Rendite?',
      options: [
        'Weil Renditen in den ersten Jahren steuerlich schlechter behandelt werden',
        'Weil eine höhere Rendite erst ab einer bestimmten Depotgröße gutgeschrieben wird',
        'Weil der Renditehebel auf den Bestand wirkt – und der ist am Anfang klein',
        'Weil Sparraten in den ersten Jahren nicht mitverzinst werden',
      ],
      correctIndex: 2,
      explanation:
        'Ein zusätzlicher Euro Sparrate ist sofort in voller Höhe da. Ein Prozentpunkt mehr Rendite auf 5.000 Euro sind 50 Euro im Jahr. Erst wenn der Bestand groß geworden ist, dreht sich das Verhältnis – bei einem typischen Sparplan nach ungefähr einem Vierteljahrhundert.',
    },
    {
      question:
        'Was passiert mit einer Sparrate, die zehn Jahre lang unverändert bei einem festen Eurobetrag bleibt?',
      options: [
        'Sie bleibt real gleich, weil auch die Kurse mit der Inflation steigen',
        'Sie sinkt als Anteil des Einkommens, weil Einkommen und Preise steigen und der Betrag stillsteht',
        'Sie steigt real, weil der Zinseszins den Kaufkraftverlust ausgleicht',
        'Sie wird von der Bank automatisch an die Inflation angepasst',
      ],
      correctIndex: 1,
      explanation:
        'Ausgaben und meist auch Einkommen wachsen mit der Inflation, der feste Betrag nicht. Aus zwölf Prozent des Nettoeinkommens werden über die Jahre still und leise acht. Wer die Quote als Prozentsatz definiert statt in Euro, bekommt die Anpassung ohne jeden Aufwand.',
    },
    {
      question:
        'Welche Posten sind auf der Ausgabenseite die einzigen Hebel mit relevanter Größe?',
      options: [
        'Stromanbieter, Mobilfunktarif und Versicherungsvergleiche',
        'Lebensmittel und Freizeit, weil sie monatlich anfallen',
        'Abonnements, weil sie sich sofort kündigen lassen',
        'Wohnen und Mobilität – und darüber hinaus die Einkommensseite',
      ],
      correctIndex: 3,
      explanation:
        'Die kleinen Posten sind schnell optimiert und dann ausgereizt; weitere Mühe bringt zwanzig Euro im Monat. Wohnen ist meist der größte Einzelposten, ein Auto kostet mit Abschreibung und Wartung deutlich mehr als die Rate suggeriert. Danach bleibt nur noch mehr Einkommen.',
    },
    {
      question: 'Warum ist die höchstmögliche Sparquote selten die beste?',
      options: [
        'Weil ein Plan, der jede Ausgabe streicht, meist aufgegeben wird – und ein abgebrochener Plan keine Rendite hat',
        'Weil hohe Sparquoten steuerlich benachteiligt werden',
        'Weil ab einer bestimmten Quote der Sparerpauschbetrag überschritten wird',
        'Weil eine hohe Quote den Notgroschen unnötig macht',
      ],
      correctIndex: 0,
      explanation:
        'Dasselbe Muster wie bei der Aktienquote: Die durchhaltbare Größe schlägt die maximale. Eine Quote, die jede Reise und jeden Restaurantbesuch ausschließt, hält selten zwei Jahre – und mit ihr endet meist auch der Sparplan, um den es eigentlich ging.',
    },
  ],

  // -------------------------------------------------------- Schuldverschreibung
  'schuldverschreibung:beginner': [
    {
      question:
        'Du kaufst eine Anleihe mit 1.000 € Nennwert und 3 % Kupon für 900 €. Wie hoch ist die jährliche Zinszahlung?',
      options: [
        '27 € – der Kupon bezieht sich auf den Kaufpreis',
        '30 € – der Kupon bezieht sich immer auf den Nennwert',
        '33 € – der Kupon wird auf den Rückzahlungsbetrag hochgerechnet',
        'Das hängt vom jeweiligen Marktzins des Jahres ab',
      ],
      correctIndex: 1,
      explanation:
        'Der Kupon ist auf den Nennwert festgeschrieben: 3 % von 1.000 € sind 30 € im Jahr, unabhängig davon, was du bezahlt hast. Deine tatsächliche Verzinsung ist dadurch höher als der Kupon – 30 € auf 900 € Einsatz –, und dazu kommt der Gewinn, wenn am Ende 1.000 € zurückfließen.',
    },
    {
      question:
        'Welche Stellung hat ein Anleihegläubiger in der Insolvenz des Emittenten?',
      options: [
        'An erster Stelle – Anleihen werden immer vorrangig bedient',
        'Gleichrangig mit den Aktionären, aufgeteilt nach Kapitalanteil',
        'Vor den Aktionären, aber hinter besicherten Gläubigern',
        'Nachrangig gegenüber allen anderen Beteiligten',
      ],
      correctIndex: 2,
      explanation:
        '„Vor den Aktionären“ ist nicht dasselbe wie „an erster Stelle“. Vor einem gewöhnlichen Anleihegläubiger stehen Sicherheiten, Löhne, Verfahrenskosten und besicherte Kredite. Verteilt wird erst, was danach übrig bleibt – und das ist häufig nur ein Teil des Nennwerts.',
    },
    {
      question:
        'Ein Zertifikat auf einen Aktienindex verliert seinen Wert, obwohl der Index unverändert steht. Was ist die wahrscheinlichste Ursache?',
      options: [
        'Der Index wurde neu zusammengesetzt',
        'Die ausgebende Bank ist zahlungsunfähig geworden – ein Zertifikat ist ihre Schuldverschreibung',
        'Die Ausschüttungen des Index wurden gestrichen',
        'Das Zertifikat wurde vorzeitig fällig gestellt',
      ],
      correctIndex: 1,
      explanation:
        'Ein Zertifikat bildet einen Index nur ab; rechtlich ist es ein Zahlungsversprechen der Bank. Fällt die Bank aus, ist es wertlos, egal wie der Index steht. 2008 traf das in Deutschland viele Käufer von Lehman-Zertifikaten. Ein Fonds ist dagegen Sondervermögen und gehört nicht der Bank.',
    },
    {
      question:
        'Was bedeutet es, wenn eine Anleihe deutlich mehr Kupon bietet als vergleichbare?',
      options: [
        'Dass der Emittent besonders anlegerfreundlich kalkuliert',
        'Dass die Laufzeit besonders kurz ist',
        'Dass der Kupon steuerlich anders behandelt wird',
        'Dass der Markt ein höheres Ausfallrisiko sieht – der Aufschlag ist dessen Preis',
      ],
      correctIndex: 3,
      explanation:
        'Kein Schuldner zahlt freiwillig mehr als nötig. Wer acht Prozent bieten muss, während andere drei zahlen, bekommt zu drei Prozent kein Geld. Der Aufschlag ist die Einschätzung des Marktes zum Ausfallrisiko – er kann sich als übertrieben herausstellen, aber er ist nie ein Geschenk.',
    },
  ],

  'schuldverschreibung:fortgeschritten': [
    {
      question:
        'Warum fällt der Kurs einer bestehenden Anleihe, wenn das Zinsniveau steigt?',
      options: [
        'Weil der Emittent den Kupon bei steigenden Zinsen kürzen darf',
        'Weil der Kupon fest ist und sich deshalb nur der Kurs an das neue Zinsniveau anpassen kann',
        'Weil Anleihen bei hohen Zinsen seltener gehandelt werden',
        'Weil die Restlaufzeit sich rechnerisch verkürzt',
      ],
      correctIndex: 1,
      explanation:
        'Der Kupon steht für die gesamte Laufzeit fest. Zahlen neue Papiere vier Prozent, will niemand ein Papier mit zwei Prozent zum selben Preis. Es wird gekauft, sobald es so günstig ist, dass die Gesamtrendite wieder passt. Rechnerisch ist der Kurs der Barwert aller Zahlungen – steigt der Zins, sinkt er.',
    },
    {
      question:
        'Zwei Anleihen haben denselben Kupon, aber zwei und zwanzig Jahre Restlaufzeit. Was passiert bei derselben Zinserhöhung?',
      options: [
        'Beide verlieren gleich viel, weil der Kupon identisch ist',
        'Die kurze verliert mehr, weil sie schneller fällig wird',
        'Die lange verliert ein Vielfaches, weil deutlich mehr künftige Zahlungen betroffen sind',
        'Die lange verliert weniger, weil sie mehr Kupons abwirft',
      ],
      correctIndex: 2,
      explanation:
        'Die Restlaufzeit ist der eigentliche Hebel, nicht die Höhe der Zinsänderung. Bei zwei Jahren geht es um wenige Prozent, bei zwanzig um mehr als ein Viertel. Genau daran lagen 2022 die zweistelligen Verluste langlaufender Anleihen, an deren Bonität nichts auszusetzen war.',
    },
    {
      question:
        'Die modifizierte Duration einer Anleihe beträgt 9. Der Marktzins steigt um zwei Prozentpunkte. Was gilt für den tatsächlichen Kursverlust?',
      options: [
        'Er liegt bei etwas weniger als 18 Prozent – die Näherung übertreibt den Verlust',
        'Er liegt bei genau 18 Prozent',
        'Er liegt bei etwas mehr als 18 Prozent, weil die Näherung zu optimistisch ist',
        'Er lässt sich aus der Duration nicht einmal näherungsweise ableiten',
      ],
      correctIndex: 0,
      explanation:
        'Die Durationsregel ist eine lineare Näherung an eine gekrümmte Kurve. Diese Krümmung – die Konvexität – wirkt immer zugunsten des Anleihebesitzers: Bei steigenden Zinsen fällt der Kurs weniger stark als vorhergesagt, bei fallenden steigt er stärker. Je größer der Zinssprung, desto größer die Abweichung.',
    },
    {
      question:
        'Worin unterscheiden sich Einzelanleihe und Anleihefonds nach einem Zinsanstieg grundlegend?',
      options: [
        'Der Fonds ist von Zinsänderungen nicht betroffen, weil er laufend umschichtet',
        'Die Einzelanleihe hat einen Endtermin, an dem der Nennwert zurückkommt; der Fonds hat keinen und holt den Verlust erst über die Zeit seiner Duration auf',
        'Beim Fonds ist der Buchverlust endgültig realisiert',
        'Die Einzelanleihe verliert grundsätzlich stärker als ein Fonds gleicher Laufzeit',
      ],
      correctIndex: 1,
      explanation:
        'Wer eine Einzelanleihe bis zur Fälligkeit hält und deren Schuldner zahlt, bekommt den Nennwert – der Buchverlust löst sich von selbst auf. Ein Fonds ersetzt fällige Papiere laufend durch neue; der Verlust wird durch deren höhere Kupons ausgeglichen, aber eben erst über einen Zeitraum. Dafür bietet er Streuung.',
    },
  ],

  'schuldverschreibung:profi': [
    {
      question:
        'Bei der Notübernahme der Credit Suisse 2023 wurden AT1-Anleihen vollständig abgeschrieben, während Aktionäre UBS-Anteile erhielten. Was zeigt dieser Fall?',
      options: [
        'Dass Anleihen generell riskanter sind als Aktien',
        'Dass Aufsichtsbehörden die Insolvenzordnung außer Kraft setzen können',
        'Dass bei hybriden Papieren das Risiko in den Vertragsbedingungen steht, nicht in der gewohnten Rangfolge',
        'Dass Bail-in-Regeln in der Praxis nicht angewendet werden',
      ],
      correctIndex: 2,
      explanation:
        'AT1-Papiere tragen die Abschreibungs- oder Wandlungsklausel im Vertrag; sie greift bei Unterschreiten einer Kapitalquote, ohne dass ein Insolvenzverfahren nötig wäre. Rund 16 Milliarden Franken wurden so auf null gesetzt. Die übliche Rangfolge war umgekehrt – vertraglich zulässig und für viele überraschend.',
    },
    {
      question:
        'Eine Anleihe enthält ein Kündigungsrecht des Emittenten. Wie wirkt sich das auf dein Rendite-Risiko-Profil aus?',
      options: [
        'Der Kursgewinn bei fallenden Zinsen ist gedeckelt, das Verlustrisiko bei steigenden bleibt voll bestehen',
        'Beide Richtungen werden gleichermaßen begrenzt',
        'Das Kündigungsrecht schützt vor Kursverlusten bei steigenden Zinsen',
        'Es wirkt sich nur auf die Stückzinsberechnung aus',
      ],
      correctIndex: 0,
      explanation:
        'Der Emittent kündigt genau dann, wenn er sich billiger refinanzieren kann – also bei gefallenen Zinsen, wenn dein Papier gerade im Wert gestiegen wäre. Bei steigenden Zinsen lässt er es laufen. Deshalb ist die Rendite bis zum frühesten Kündigungstermin die aussagekräftigere Kennzahl.',
    },
    {
      question:
        'Eine Anleihe bietet fünf Prozentpunkte Aufschlag gegenüber einer sicheren Anlage. Bei einer Erlösquote von 40 Prozent im Ausfall: Welche jährliche Ausfallquote trägt dieser Aufschlag näherungsweise?',
      options: [
        'Etwa 2 Prozent – die Erlösquote verringert den nötigen Aufschlag kaum',
        'Etwa 5 Prozent – Aufschlag und Ausfallquote entsprechen einander',
        'Etwa 12,5 Prozent',
        'Etwa 8 Prozent – der Aufschlag geteilt durch den Verlust im Ausfall',
      ],
      correctIndex: 3,
      explanation:
        'Im Ausfall gehen nicht 100 Prozent verloren, sondern 60. Der Aufschlag muss den erwarteten Verlust decken: 5 geteilt durch 0,6 sind rund 8,3 Prozent pro Jahr. Die Näherung unterschlägt Zinseszins und dass Ausfälle sich in Rezessionen häufen – als Größenordnung zeigt sie aber, dass ein solcher Aufschlag kein Geschenk ist.',
    },
    {
      question:
        'Ein Kapitalschutzzertifikat verspricht die Rückzahlung des Einsatzes zum Laufzeitende. Wovon hängt dieser Schutz ab?',
      options: [
        'Von einer gesetzlichen Sicherung vergleichbar der Einlagensicherung',
        'Von hinterlegten Sicherheiten, die separat verwahrt werden',
        'Von der Zahlungsfähigkeit der ausgebenden Bank – es ist ihr Versprechen, keine Sicherheit',
        'Vom Stand des zugrunde liegenden Index bei Fälligkeit',
      ],
      correctIndex: 2,
      explanation:
        'Zerlegt besteht das Produkt aus einer Nullkuponanleihe der Bank plus einer Option. Der „Schutz“ ist die Rückzahlung dieser Anleihe – also ein Zahlungsversprechen desselben Emittenten. Fällt er aus, schützt es nichts. Die Marge des Anbieters findet man, indem man beide Bausteine einzeln bewertet.',
    },
  ],

  // ------------------------------------------------------------ Staatsanleihe
  'staatsanleihe:beginner': [
    {
      question: 'Was ist mit dem „risikofreien Zins“ gemeint?',
      options: [
        'Dass der Kurs solcher Anleihen nicht schwankt',
        'Dass die Rendite den Kaufkraftverlust in jedem Fall ausgleicht',
        'Dass die nominale Rückzahlung als nahezu sicher gilt – mehr nicht',
        'Dass die Anlage durch die Einlagensicherung abgedeckt ist',
      ],
      correctIndex: 2,
      explanation:
        'Der Begriff bezieht sich ausschließlich auf die Ausfallwahrscheinlichkeit des Emittenten. Der Kurs schwankt trotzdem, teils erheblich, und die Kaufkraft der zurückgezahlten Summe kann deutlich unter der eingesetzten liegen. „Risikofrei“ meint eine Art von Risiko, nicht alle.',
    },
    {
      question:
        'Wodurch unterscheiden sich Bundesanleihe, Bundesobligation und Bundesschatzanweisung?',
      options: [
        'Durch die Laufzeit bei Ausgabe – zehn bis dreißig, fünf und zwei Jahre',
        'Durch die Höhe der staatlichen Garantie',
        'Durch die Art des Emittenten innerhalb des Bundes',
        'Durch die steuerliche Behandlung der Zinserträge',
      ],
      correctIndex: 0,
      explanation:
        'Der Schuldner ist in allen drei Fällen derselbe, die Bonität ebenfalls. Unterschiedlich ist nur die Laufzeit – und damit die Zinsempfindlichkeit. Die zweijährige Schatzanweisung reagiert am stärksten auf Notenbankentscheidungen, die zehnjährige Anleihe ist der Zinsmaßstab der Eurozone.',
    },
    {
      question: 'Warum hängen Bauzinsen an der Rendite langlaufender Staatsanleihen?',
      options: [
        'Weil Banken gesetzlich verpflichtet sind, sich daran zu orientieren',
        'Weil Baukredite über den Verkauf von Staatsanleihen finanziert werden',
        'Weil jeder andere Zins einen Aufschlag auf diesen Referenzsatz darstellt',
        'Weil die Notenbank den Bauzins direkt festlegt',
      ],
      correctIndex: 2,
      explanation:
        'Die Rendite sicherer Staatsanleihen ist der Bezugspunkt für alles andere: Wer risikoreicher verleiht, verlangt einen Aufschlag darauf. Weil ein Baukredit über zehn oder mehr Jahre läuft, orientiert er sich an der zehnjährigen Anleihe – und nicht am Leitzins, der das kurze Ende bestimmt.',
    },
    {
      question:
        'Eine Staatsanleihe in Fremdwährung bietet deutlich mehr Zins als eine vergleichbare in Euro. Was ist dabei zu bedenken?',
      options: [
        'Fremdwährungsanleihen sind steuerfrei, was den Zinsvorteil relativiert',
        'Der Zinsvorteil ist garantiert, weil er im Kupon festgeschrieben ist',
        'Der höhere Zins gleicht ein höheres Ausfallrisiko desselben Staates aus',
        'Es kommt ein Wechselkursrisiko hinzu, das den gesamten Zinsvorteil übersteigen kann',
      ],
      correctIndex: 3,
      explanation:
        'Das zweite Risiko hat mit dem Emittenten nichts zu tun: Verliert die Währung gegenüber dem Euro zehn Prozent, ist ein Zinsvorsprung von drei Prozentpunkten mehrfach aufgezehrt. Wer in Euro lebt und rechnet, trägt dieses Risiko voll – auch bei tadelloser Bonität des Staates.',
    },
  ],

  'staatsanleihe:fortgeschritten': [
    {
      question:
        'Wie ist eine inverse Zinsstrukturkurve als Rezessionssignal einzuordnen?',
      options: [
        'Historisch mit hoher Trefferquote, aber ohne Aussage über den Zeitpunkt',
        'Als zuverlässiges Handelssignal mit einem Vorlauf von etwa drei Monaten',
        'Als widerlegtes Muster, das nur zufällig zustande kam',
        'Als Signal, das ausschließlich für die Eurozone gilt',
      ],
      correctIndex: 0,
      explanation:
        'In den USA ging fast jeder Rezession seit den 1950er-Jahren eine Inversion voraus – das ist der Grund für die Aufmerksamkeit. Der Abstand betrug aber sechs Monate bis über zwei Jahre, und es gab Inversionen ohne folgende Rezession. Als Handelssignal ist das unbrauchbar.',
    },
    {
      question:
        'Warum geriet die Eurozone ab 2010 in eine Schuldenkrise, während Japan mit weit höherer Quote nie in eine vergleichbare Lage kam?',
      options: [
        'Weil Japans Wirtschaft schneller wuchs',
        'Weil Euro-Staaten in einer Währung verschuldet sind, die sie nicht selbst herstellen',
        'Weil japanische Anleihen höhere Kupons bieten',
        'Weil die Eurozone insgesamt höher verschuldet ist als Japan',
      ],
      correctIndex: 1,
      explanation:
        'Ein Staat mit eigener Währung kann nominal immer zahlen – ob das sinnvoll ist, steht auf einem anderen Blatt. Ein Euro-Staat kann das nicht: Er hat eine gemeinsame Geldpolitik, aber einen eigenen Haushalt. Genau diese Trennung ist die strukturelle Spannung, aus der die Spreads entstehen.',
    },
    {
      question:
        'Worin unterscheidet sich eine einzelne Staatsanleihe grundlegend von einem Anleihe-ETF?',
      options: [
        'Der ETF unterliegt keinem Zinsänderungsrisiko',
        'Die Einzelanleihe kann nicht vor Fälligkeit verkauft werden',
        'Die Einzelanleihe hat einen Endtermin, an dem der Nennwert zurückkommt – der ETF hat keinen',
        'Der ETF garantiert die Rückzahlung des eingesetzten Kapitals',
      ],
      correctIndex: 2,
      explanation:
        'Der Endtermin ist der entscheidende Unterschied: Wer hält und dessen Schuldner zahlt, bekommt den Nennwert, wie auch immer der Kurs zwischendurch stand. Ein ETF ersetzt fällige Papiere laufend und hat diesen Punkt nie. Dafür bietet er Streuung und ist jederzeit in kleinen Beträgen handelbar.',
    },
    {
      question:
        'Warum haben Anleihen 2022 nicht als Puffer gegen fallende Aktienkurse funktioniert?',
      options: [
        'Weil die Bonität der Emittenten sich verschlechtert hatte',
        'Weil Anleihen 2022 kaum gehandelt wurden',
        'Weil die Notenbanken Anleihen verkauften und damit die Kurse drückten',
        'Weil beide aus demselben Grund fielen: hohe Inflation und daraufhin steigende Zinsen',
      ],
      correctIndex: 3,
      explanation:
        'Der Puffer beruht darauf, dass Notenbanken in einer Konjunkturschwäche die Zinsen senken – dann steigen Anleihen, während Aktien fallen. 2022 war die Ursache eine andere: Inflation zwang zu Zinserhöhungen, und die trafen beide Seiten. Bei langen Laufzeiten wurde daraus ein zweistelliger Verlust.',
    },
  ],

  'staatsanleihe:profi': [
    {
      question:
        'Unter welcher Bedingung sinkt eine Schuldenquote von allein, auch ohne Primärüberschuss?',
      options: [
        'Wenn der durchschnittliche Zins unter dem nominalen Wachstum liegt',
        'Wenn die Schuldenquote unter 60 Prozent des BIP liegt',
        'Wenn die Notenbank einen Teil der Anleihen hält',
        'Wenn die durchschnittliche Restlaufzeit über zehn Jahre beträgt',
      ],
      correctIndex: 0,
      explanation:
        'Die Zins-Wachstums-Differenz ist der entscheidende Term. Wächst die Wirtschaft nominal schneller, als der Schuldenberg sich verzinst, sinkt die Quote selbst bei laufendem Defizit. Genau diese Konstellation herrschte in Europa über weite Teile der 2010er-Jahre.',
    },
    {
      question:
        'Warum ist die durchschnittliche Restlaufzeit der Staatsschulden so wichtig?',
      options: [
        'Weil sie die Höhe der Schuldenquote begrenzt',
        'Weil ein Zinsanstieg nur die neu aufgenommenen Schulden trifft – je länger finanziert, desto langsamer schlägt er durch',
        'Weil kurze Laufzeiten grundsätzlich teurer sind',
        'Weil sie über die Ratingeinstufung des Landes entscheidet',
      ],
      correctIndex: 1,
      explanation:
        'Auf seinen Altbestand zahlt ein Staat weiter die alten Kupons. Ein Zinssprung wirkt deshalb nur auf den Teil, der ohnehin refinanziert werden muss. Wer über zehn Jahre finanziert ist, spürt ihn über Jahre verteilt; wer kurzfristig finanziert ist, innerhalb weniger Monate in voller Höhe.',
    },
    {
      question:
        'Bei einer Umschuldung wird statt eines Nennwertschnitts die Laufzeit deutlich verlängert. Wie ist das wirtschaftlich zu bewerten?',
      options: [
        'Als reine Formalie ohne Wirkung auf den Gläubiger',
        'Als Vorteil für den Gläubiger, weil länger Zinsen fließen',
        'Ebenfalls als Verlust – der Barwert sinkt, es sieht nur harmloser aus',
        'Als Verlust nur dann, wenn zusätzlich der Kupon gesenkt wird',
      ],
      correctIndex: 2,
      explanation:
        'Geld, das zwanzig Jahre später kommt, ist heute weniger wert als Geld in fünf Jahren. Eine Streckung senkt den Barwert genauso wie ein Nennwertschnitt – sie ist politisch nur leichter zu vermitteln, weil die Zahl auf dem Papier unverändert bleibt.',
    },
    {
      question:
        'Warum kann aus Zweifeln an einem Staat innerhalb von Tagen eine Bankenkrise werden?',
      options: [
        'Weil Banken gesetzlich verpflichtet sind, Staatsanleihen zu halten',
        'Weil Staatsanleihen im Repo-Markt die Sicherheiten stellen – fällt ihr Wert, sinkt der Beleihungswert und Banken müssen nachschießen',
        'Weil Sparer bei fallenden Anleihekursen ihre Einlagen abziehen',
        'Weil Staatsanleihen den größten Teil der Bankbilanzen ausmachen',
      ],
      correctIndex: 1,
      explanation:
        'Der Repo-Markt ist der Ort, an dem sich das Finanzsystem täglich refinanziert, und Staatsanleihen sind dort die üblichen Sicherheiten. Verlieren sie an Wert, müssen Banken Sicherheiten nachschießen oder Positionen auflösen. Das ist der Übertragungsweg – und der Grund für die regulatorische Bevorzugung dieser Papiere.',
    },
  ],

  // ------------------------------------------------------------------ Derivat
  'derivat:beginner': [
    {
      question: 'Was unterscheidet Absicherung von Spekulation mit demselben Future?',
      options: [
        'Ob man den Basiswert besitzt oder braucht – der Vertrag selbst ist identisch',
        'Die Laufzeit des Kontrakts',
        'Ob der Kontrakt an einer Börse oder außerbörslich abgeschlossen wird',
        'Die Höhe der hinterlegten Sicherheit',
      ],
      correctIndex: 0,
      explanation:
        'Der Landwirt, der seine Ernte im Voraus verkauft, gibt ein bestehendes Risiko ab. Wer denselben Kontrakt ohne Feld kauft, geht ein neues ein. Beide brauchen einander: Ohne die zweite Seite fände die erste keinen Vertragspartner. Die Frage ist deshalb nie, ob Derivate gut sind, sondern auf welcher Seite man steht.',
    },
    {
      question:
        'Du hinterlegst 1.000 € Sicherheit und steuerst damit eine Position von 20.000 €. Ab welcher Kursbewegung gegen dich ist der Einsatz aufgebraucht?',
      options: [
        'Ab 20 Prozent – dem Kehrwert des Hebels in Prozentpunkten',
        'Ab 50 Prozent, weil nur die Hälfte des Risikos auf dich entfällt',
        'Ab 5 Prozent – die Sicherheit entspricht einem Zwanzigstel der Position',
        'Erst bei einem Totalverlust des Basiswerts',
      ],
      correctIndex: 2,
      explanation:
        'Die Sicherheit ist ein Zwanzigstel der Position, also fünf Prozent. Bewegt sich der Kurs um fünf Prozent gegen dich, entspricht der Verlust genau dem Einsatz. Fünf Prozent an einem Tag sind bei einer Einzelaktie nichts Ungewöhnliches – das ist die Zahl, die vor dem Hebel selbst zu prüfen wäre.',
    },
    {
      question:
        'Warum ist der Hebel gefährlich, obwohl er in beide Richtungen exakt symmetrisch wirkt?',
      options: [
        'Weil Gewinne höher besteuert werden als Verluste absetzbar sind',
        'Weil die Position vorher zwangsweise geschlossen wird und man die Erholung nicht mehr erlebt',
        'Weil der Hebel bei Verlusten größer ist als bei Gewinnen',
        'Weil Emittenten den Hebel nachträglich anpassen dürfen',
      ],
      correctIndex: 1,
      explanation:
        'Die Rechnung ist symmetrisch, der Verlauf ist es nicht. Reicht die Sicherheit nicht mehr, wird glattgestellt – die Position existiert nicht mehr, wenn sich der Kurs später zurückbewegt. Bei einer unbelehnten Aktie kann man aussitzen, bei einer gehebelten Position nicht.',
    },
    {
      question: 'Welche Aussage über den Vermögensaufbau mit Derivaten trifft zu?',
      options: [
        'Sie eignen sich besonders für kleine Depots, weil weniger Kapital nötig ist',
        'Sie sind für den langfristigen Aufbau notwendig, um die Marktrendite zu erreichen',
        'Sie sind steuerlich vorteilhafter als der Direktbesitz',
        'Sie lösen ein Absicherungsproblem – wer keines hat, hat keinen Grund für den Einsatz',
      ],
      correctIndex: 3,
      explanation:
        'Derivate sind Werkzeuge für ein bestimmtes Problem: ein bestehendes Preisrisiko abzugeben. Für den Vermögensaufbau braucht man sie nicht. Dass die Werbung für Hebelprodukte sich fast ausschließlich an Menschen ohne dieses Problem richtet, ist kein Zufall – der geringere Kapitaleinsatz ist kein Vorteil, sondern die Definition des Hebels.',
    },
  ],

  'derivat:fortgeschritten': [
    {
      question:
        'Bei einem Future wird täglich abgerechnet. Welche praktische Folge hat das gegenüber einer Aktienposition?',
      options: [
        'Aus einem Verlustrisiko wird ein Liquiditätsrisiko – man kann herausgeworfen werden, obwohl die Einschätzung stimmt',
        'Verluste können steuerlich sofort geltend gemacht werden',
        'Die Position verliert an Wert, wenn der Kurs unverändert bleibt',
        'Der Kontrakt kann nicht vor Fälligkeit geschlossen werden',
      ],
      correctIndex: 0,
      explanation:
        'Bei einer Aktie lässt sich ein Rückschlag aussitzen. Beim Future muss die Sicherheit jeden Abend reichen; sonst kommt der Margin Call und danach die Zwangsglattstellung. Die zugrunde liegende Einschätzung kann am Ende richtig gewesen sein – die Position gibt es dann nicht mehr.',
    },
    {
      question:
        'Ein Indexprodukt auf Öl entwickelt sich über Jahre deutlich schlechter als der Ölpreis. Was ist die übliche Ursache?',
      options: [
        'Die Verwaltungsgebühr des Anbieters',
        'Wechselkurseffekte zwischen Dollar und Euro',
        'Contango: Beim Rollen wird billig verkauft und teuer gekauft – ein laufender Verlust',
        'Der Index enthält andere Rohstoffe als Öl',
      ],
      correctIndex: 2,
      explanation:
        'Das Produkt bildet nicht den Ölpreis ab, sondern eine gerollte Terminposition. Bei Rohstoffen ist Contango der Normalfall, weil Lagerung und Versicherung im Terminpreis stecken. Über Jahre kann der Rohstoff steigen und das Produkt verlieren – der Unterschied steht selten dort, wo er hingehörte.',
    },
    {
      question: 'Was ist ein Total Return Swap und wo begegnet er Privatanlegern?',
      options: [
        'Ein Tausch von festen gegen variable Zinszahlungen, üblich bei Unternehmenskrediten',
        'Ein Tausch der gesamten Indexentwicklung gegen eine Zinszahlung – die Konstruktion synthetischer ETFs',
        'Ein Währungstausch zur Absicherung von Auslandseinnahmen',
        'Eine Absicherung gegen den Ausfall eines Emittenten',
      ],
      correctIndex: 1,
      explanation:
        'Ein synthetischer ETF hält nicht die Indexwerte, sondern einen Sicherheitenkorb plus einen Swap auf die Indexentwicklung. Das kann die Abbildung genauer und billiger machen. Dafür kommt ein Kontrahentenrisiko hinzu, das ein physisch abbildender ETF nicht hat – ein bewusster Tausch, kein versteckter Mangel.',
    },
    {
      question:
        'Du sicherst ein Portfolio deutscher Nebenwerte mit DAX-Futures ab. Welches Risiko bleibt?',
      options: [
        'Keines – die Absicherung ist bei gleicher Nominalgröße vollständig',
        'Nur das Währungsrisiko, da Futures in Euro notieren',
        'Nur das Ausfallrisiko der Clearingstelle',
        'Das Basisrisiko: Nebenwerte und Standardwerte können auseinanderlaufen',
      ],
      correctIndex: 3,
      explanation:
        'Abgesichert ist die gemeinsame Marktbewegung, nicht die Differenz zwischen den beiden Segmenten. Genau diese Differenz kann groß werden. Eine perfekte Absicherung gäbe es nur, wenn Instrument und Position identisch wären – dann hätte man allerdings auch schlicht verkaufen können.',
    },
  ],

  'derivat:profi': [
    {
      question: 'Was sagt ein Terminpreis aus, der über dem aktuellen Kassapreis liegt?',
      options: [
        'Dass der Markt steigende Preise erwartet',
        'Nichts über Erwartungen – er spiegelt Finanzierungs- und Lagerkosten bis zum Termin',
        'Dass die Nachfrage nach dem Basiswert das Angebot übersteigt',
        'Dass der Kontrakt überbewertet ist und eine Korrektur bevorsteht',
      ],
      correctIndex: 1,
      explanation:
        'Der Terminpreis folgt der Arbitragefreiheit: Kassapreis plus Nettokosten des Haltens bis zum Termin. Läge er höher, könnte man den Basiswert kaufen, den Future verkaufen und die Differenz risikolos einstreichen. Eine steigende Terminkurve sagt deshalb etwas über Zinsen und Lagerkosten – nicht über die Zukunft.',
    },
    {
      question:
        'Ein Basiswert steigt um 10 Prozent und fällt am nächsten Tag um 9,09 Prozent – er steht wieder bei 100. Wo steht ein Faktorzertifikat mit Faktor 4?',
      options: [
        'Ebenfalls bei 100, da sich die Bewegungen ausgleichen',
        'Bei etwa 104, weil der Anstieg stärker gehebelt wurde',
        'Deutlich unter 100 – tägliches Hebeln macht Schwankung zu einem Verlust',
        'Bei etwa 96, unabhängig vom gewählten Faktor',
      ],
      correctIndex: 2,
      explanation:
        'Aus 100 werden mit Faktor 4 zunächst 140, dann wirken −36,4 Prozent darauf: rund 89. Der Effekt heißt Pfadabhängigkeit, geht immer in dieselbe Richtung und wächst überproportional mit dem Faktor. Faktorzertifikate sind Instrumente für einzelne Tage – über Wochen gehalten sind sie ein anderes Produkt.',
    },
    {
      question:
        'Warum sind Bewertungsmodelle für Derivate genau dann unzuverlässig, wenn es darauf ankommt?',
      options: [
        'Weil die zugrunde liegenden Daten in Krisen nicht veröffentlicht werden',
        'Weil sie laufendes Anpassen und stetige Kurse unterstellen – beides bricht bei Sprüngen und ausgetrockneter Liquidität',
        'Weil Aufsichtsbehörden ihre Verwendung in Krisen untersagen',
        'Weil sie nur für börsengehandelte Kontrakte gelten',
      ],
      correctIndex: 1,
      explanation:
        'Die Replikation setzt voraus, dass man das Gegenportfolio laufend anpassen kann und dass sich Kurse stetig bewegen. Bei Kurssprüngen über Nacht, ausgesetztem Handel oder verschwundener Liquidität gilt beides nicht. Modelle sind in ruhigen Phasen präzise und im Ernstfall unbrauchbar – das ist das Modellrisiko.',
    },
    {
      question:
        'Ein Knock-out-Zertifikat, ein Faktorzertifikat und ein CFD haben ein Risiko gemeinsam. Welches?',
      options: [
        'Alle drei sind Schuldverschreibungen beziehungsweise Forderungen gegen den Anbieter – kein Sondervermögen',
        'Bei allen dreien besteht in der EU eine Nachschusspflicht',
        'Alle drei verfallen zu einem festen Termin',
        'Alle drei werden ausschließlich außerbörslich gehandelt',
      ],
      correctIndex: 0,
      explanation:
        'Keines der drei Produkte ist Sondervermögen. Fällt der Emittent aus, ist das Papier wertlos, gleichgültig wie der Basiswert steht. Die anderen Merkmale unterscheiden sie gerade: Der Knock-out verfällt bei Berührung, das Faktorzertifikat ist pfadabhängig, und beim CFD ist die Nachschusspflicht für Privatanleger in der EU untersagt.',
    },
  ],

  // ------------------------------------------------------------------- Option
  'option:beginner': [
    {
      question:
        'Ein Call hat Basispreis 100, der Kurs steht bei 95. Woraus besteht die Prämie?',
      options: [
        'Ausschließlich aus innerem Wert',
        'Aus fünf Einheiten negativem inneren Wert plus Zeitwert',
        'Sie ist null, weil die Option aus dem Geld ist',
        'Ausschließlich aus Zeitwert – der innere Wert ist null',
      ],
      correctIndex: 3,
      explanation:
        'Der innere Wert ist nie negativ: Ausüben muss niemand, und genau darin besteht das Recht. Unter dem Basispreis besteht die Prämie deshalb vollständig aus Zeitwert – man bezahlt reine Hoffnung darauf, dass sich bis zum Verfall noch etwas tut.',
    },
    {
      question:
        'Der Kurs des Basiswerts bewegt sich über Wochen überhaupt nicht. Was passiert mit einer gekauften Option?',
      options: [
        'Sie behält ihren Wert, solange der Kurs unverändert bleibt',
        'Sie verliert laufend an Wert, weil der Zeitwert schmilzt',
        'Sie gewinnt an Wert, weil die Unsicherheit sinkt',
        'Ihr Wert hängt nur vom Kurs ab, nicht von der Zeit',
      ],
      correctIndex: 1,
      explanation:
        'Der Zeitwert ist am Verfallstag zwangsläufig null, und der Weg dorthin läuft ununterbrochen. Ein Optionskäufer, der in der Richtung recht behält, aber zu spät, verliert trotzdem. Für den Verkäufer ist derselbe Vorgang der laufende Ertrag.',
    },
    {
      question: 'Warum beschleunigt sich der Zeitwertverlust gegen Ende der Laufzeit?',
      options: [
        'Weil Broker kurz vor Verfall höhere Gebühren berechnen',
        'Weil die implizite Volatilität zum Verfall hin immer steigt',
        'Weil mit weniger Restzeit die Chance auf eine noch entscheidende Bewegung überproportional schrumpft',
        'Weil der innere Wert gegen Ende in Zeitwert umgewandelt wird',
      ],
      correctIndex: 2,
      explanation:
        'Der Zeitwert bezahlt die verbleibende Chance. Von zwölf auf sechs Monate halbiert sich die Restzeit, die Chance aber nicht im selben Maß – von einem Monat auf zwei Wochen dagegen bricht sie weg. Im letzten Monat verliert dieselbe Option täglich etwa das Dreifache dessen, was sie ein Jahr vor Verfall verlor.',
    },
    {
      question:
        'Worin unterscheiden sich Optionskäufer und Optionsverkäufer grundlegend?',
      options: [
        'Der Käufer trägt ein begrenztes Risiko bei großer Chance, der Verkäufer das Gegenteil',
        'Beide tragen dasselbe Risiko, nur mit umgekehrtem Vorzeichen',
        'Der Verkäufer kann höchstens die Prämie verlieren',
        'Der Käufer ist zur Ausübung verpflichtet, der Verkäufer nicht',
      ],
      correctIndex: 0,
      explanation:
        'Der Käufer verliert höchstens die Prämie und kann theoretisch viel gewinnen. Der Verkäufer gewinnt höchstens die Prämie und trägt beim ungedeckten Call ein nach oben offenes Risiko. Anders als beim Aktienhandel sind die Profile also nicht spiegelbildlich – deshalb ist der ungedeckte Verkauf für Privatanleger ungeeignet.',
    },
  ],

  'option:fortgeschritten': [
    {
      question: 'Welcher Preistreiber einer Option lässt sich nicht am Markt ablesen?',
      options: [
        'Der Basispreis',
        'Die Restlaufzeit',
        'Der risikofreie Zins',
        'Die erwartete künftige Schwankung – die implizite Volatilität',
      ],
      correctIndex: 3,
      explanation:
        'Kurs, Basispreis, Restlaufzeit und Zins stehen fest oder sind ablesbar. Die erwartete Schwankung nicht: Sie ist die Größe, die aus dem bezahlten Preis zurückgerechnet wird. Deshalb sagt man, dass Optionshändler Volatilität handeln – der Preis in Euro ist nur deren Übersetzung.',
    },
    {
      question:
        'Du kaufst vor Quartalszahlen einen Call. Die Zahlen sind gut, der Kurs steigt – und die Option verliert trotzdem. Warum?',
      options: [
        'Weil gute Nachrichten den inneren Wert nicht erhöhen',
        'Volatility Crush: Die eingepreiste Erwartung fällt nach dem Termin schlagartig',
        'Weil Optionen an Tagen mit Nachrichten nicht gehandelt werden',
        'Weil der Broker die Position vor dem Termin zwangsweise anpasst',
      ],
      correctIndex: 1,
      explanation:
        'Vor einem angekündigten Termin ist die implizite Volatilität hoch, weil eine große Bewegung wahrscheinlich ist – und sie steckt in der Prämie. Ist der Termin vorbei, fällt sie zurück. Wer vorher kauft, kauft die Erwartung mit und kann bei richtiger Richtung verlieren.',
    },
    {
      question:
        'Warum schneidet eine Covered-Call-Strategie in langfristig steigenden Märkten meist schlechter ab als schlichtes Halten?',
      options: [
        'Weil die vereinnahmten Prämien voll zu versteuern sind',
        'Weil die Aktien beim Verkauf des Calls sofort abgegeben werden müssen',
        'Weil sie die großen Aufwärtsbewegungen wegverkauft, aus denen die Aktienrendite besteht',
        'Weil Calls auf Einzelaktien nicht liquide genug sind',
      ],
      correctIndex: 2,
      explanation:
        'Die Aktienrendite entsteht in wenigen starken Phasen. Ein Covered Call tauscht eine kleine sichere Zahlung gegen genau den Teil dieser Phasen ein, der über dem Basispreis liegt. Nach unten schützt er dabei nur in Höhe der Prämie – ein ungünstiges Tauschverhältnis über lange Zeiträume.',
    },
    {
      question: 'Was leistet ein Vertical Spread und was kostet er?',
      options: [
        'Er begrenzt Verlust und Gewinn zugleich – dafür fallen vier Transaktionen samt Spread an',
        'Er verdoppelt die Gewinnchance bei gleichem Einsatz',
        'Er schaltet das Risiko der impliziten Volatilität vollständig aus',
        'Er verlängert die Laufzeit einer bestehenden Position',
      ],
      correctIndex: 0,
      explanation:
        'Die verkaufte Option verbilligt die gekaufte und deckelt zugleich den Gewinn. Der Verlust ist auf die Nettoprämie begrenzt, der Gewinn auf den Abstand der Basispreise abzüglich dieser Prämie. Weil Öffnen und Schließen je zwei Transaktionen sind und Optionsspreads breit ausfallen, gibt es eine Mindestgröße, unterhalb derer die Rechnung nicht aufgeht.',
    },
  ],

  'option:profi': [
    {
      question: 'In welchem Verhältnis stehen Gamma und Theta zueinander?',
      options: [
        'Sie sind unabhängig voneinander',
        'Sie sind gegenläufig: Wer Gamma besitzt, zahlt mit Theta – und umgekehrt',
        'Beide sind für gekaufte Optionen positiv',
        'Gamma wirkt nur auf Puts, Theta nur auf Calls',
      ],
      correctIndex: 1,
      explanation:
        'Wer Optionen gekauft hat, profitiert von schnellen Bewegungen (positives Gamma) und bezahlt dafür täglich Zeitwert (negatives Theta). Der Verkäufer nimmt Theta ein und ist dafür short Gamma. Es gibt keine Position, die beides auf der guten Seite hat – das ist der Kern des Optionsgeschäfts.',
    },
    {
      question: 'Was beschreibt der Volatilitäts-Skew und woher kommt er?',
      options: [
        'Dass die Volatilität im Tagesverlauf schwankt – eine Folge der Handelszeiten',
        'Dass Optionen mit längerer Laufzeit stets höhere Volatilität einpreisen',
        'Dass Calls und Puts am selben Basispreis unterschiedlich bewertet werden – ein Modellfehler',
        'Dass Puts weit unter dem Kurs teurer sind als das Modell nahelegt – Absicherung gegen Einbrüche ist dauerhaft gefragt',
      ],
      correctIndex: 3,
      explanation:
        'Das Modell unterstellt eine einheitliche Volatilität für alle Basispreise. Der Markt preist tiefe Puts systematisch teurer, weil Aktienmärkte schneller fallen als sie steigen und Absicherung gefragt bleibt. Diese Schiefe ist seit 1987 fest im Markt und keine Rechenschwäche.',
    },
    {
      question:
        'Die Volatilitätsrisikoprämie sorgt dafür, dass Optionsverkäufer im Mittel verdienen. Warum enden solche Strategien trotzdem regelmäßig in Katastrophen?',
      options: [
        'Weil das Ertragsprofil viele kleine Gewinne und selten einen sehr großen Verlust liefert – und die ruhige Phase zum Hebeln verleitet',
        'Weil die Prämie tatsächlich nicht existiert und nur ein statistisches Artefakt ist',
        'Weil Broker solche Positionen willkürlich schließen',
        'Weil die Prämie ausschließlich bei Indexoptionen anfällt',
      ],
      correctIndex: 0,
      explanation:
        'Die Prämie ist real – sie ist die Vergütung für ein übernommenes Versicherungsrisiko. Über Monate sieht die Strategie aus wie ein sicherer Zins, und genau das verleitet dazu, die Position zu vergrößern. Am 5. Februar 2018 verdreifachte sich der Volatilitätsindex an einem Tag; darauf ausgerichtete Produkte verloren über Nacht fast alles.',
    },
    {
      question: 'Was ist das Pin-Risiko am Verfallstag?',
      options: [
        'Dass der Broker die Position kurz vor Verfall automatisch schließt',
        'Dass der Kurs praktisch auf dem Basispreis schließt und der Verkäufer bis nach Handelsschluss nicht weiß, ob er zugeteilt wird',
        'Dass die Option wegen fehlender Liquidität nicht mehr handelbar ist',
        'Dass der Basispreis wegen einer Kapitalmaßnahme angepasst wird',
      ],
      correctIndex: 1,
      explanation:
        'Schließt der Kurs genau am Basispreis, ist die Zuteilung offen und entscheidet sich erst nach Handelsschluss. Der Verkäufer hält am Montag unter Umständen eine ungewollte Position mit vollem Marktrisiko über das Wochenende – ein Abwicklungsrisiko, das in keiner Bewertungsformel vorkommt.',
    },
  ],

  // -------------------------------------------------------- Einlagensicherung
  'einlagensicherung:beginner': [
    {
      question:
        'Du hast bei derselben Bank 50.000 € auf dem Tagesgeld und 80.000 € auf dem Festgeld. Wie viel ist gesichert?',
      options: [
        '100.000 € – die Grenze gilt je Person und Institut, die Konten werden zusammengezählt',
        '130.000 € – jedes Konto ist einzeln gesichert',
        '200.000 € – die Grenze gilt je Konto bis maximal zwei Konten',
        '80.000 € – nur das höher verzinste Konto ist erfasst',
      ],
      correctIndex: 0,
      explanation:
        'Die Grenze bezieht sich auf die Person und das Institut, nicht auf einzelne Konten. Alle Guthaben bei derselben Bank werden addiert; 30.000 € lägen hier ungesichert. Bei einem Gemeinschaftskonto steht die Grenze dagegen jedem Inhaber einzeln zu.',
    },
    {
      question:
        'Deine Depotbank wird insolvent. Was passiert mit den ETFs in deinem Depot?',
      options: [
        'Sie fallen in die Insolvenzmasse und werden bis zur Sicherungsgrenze ersetzt',
        'Sie sind Sondervermögen, gehören dir und werden herausgegeben oder übertragen',
        'Sie werden zum letzten Kurs verkauft und der Erlös ausgezahlt',
        'Sie sind vollständig verloren, weil sie nicht der Einlagensicherung unterliegen',
      ],
      correctIndex: 1,
      explanation:
        'Wertpapiere im Depot werden nur verwahrt – rechtlich gehören sie dir. Sie tauchen in der Insolvenzmasse gar nicht auf und brauchen deshalb keine Sicherung. Eine Bankpleite kostet dort Zeit und Nerven, aber nicht das Geld. „Nicht gesichert“ und „unsicher“ sind hier zwei verschiedene Dinge.',
    },
    {
      question:
        'Welches Papier in deinem Depot ist im Fall einer Bankpleite tatsächlich gefährdet?',
      options: [
        'Ein weltweit anlegender ETF',
        'Eine Bundesanleihe',
        'Ein Zertifikat, das diese Bank selbst ausgegeben hat',
        'Ein aktiv gemanagter Aktienfonds',
      ],
      correctIndex: 2,
      explanation:
        'Ein Zertifikat der eigenen Bank ist eine Forderung gegen genau den Schuldner, der ausgefallen ist – und es ist ausdrücklich von der Einlagensicherung ausgenommen. Fonds und ETFs sind Sondervermögen, die Bundesanleihe ist eine Forderung gegen den Bund. Nur das Zertifikat trifft der Ausfall voll.',
    },
    {
      question: 'Warum ist es wichtig, die Markenzugehörigkeit einer Bank zu prüfen?',
      options: [
        'Weil verschiedene Marken unterschiedliche Zinsen anbieten',
        'Weil die Sicherungsgrenze bei bekannten Marken höher ausfällt',
        'Weil nur Marken mit deutschem Namen der deutschen Sicherung angehören',
        'Weil mehrere Marken zu einer juristischen Person gehören können – dann gilt die Grenze nur einmal für alle zusammen',
      ],
      correctIndex: 3,
      explanation:
        'Wer sein Geld auf zwei Marken verteilt, die zu demselben Institut gehören, hat nichts gewonnen: Die Guthaben werden addiert. Die Sicherungsangaben stehen im Impressum und im Preis- und Leistungsverzeichnis und sind in wenigen Minuten geprüft – vor der Verteilung größerer Beträge lohnt sich das.',
    },
  ],

  'einlagensicherung:fortgeschritten': [
    {
      question:
        'Worin unterscheidet sich die gesetzliche Einlagensicherung von einem freiwilligen Sicherungsfonds?',
      options: [
        'Die gesetzliche gibt einen einklagbaren Anspruch, der freiwillige Fonds leistet nach seiner Satzung',
        'Der freiwillige Fonds zahlt schneller aus',
        'Die gesetzliche gilt nur für Girokonten, der freiwillige auch für Festgeld',
        'Es gibt keinen rechtlichen Unterschied, nur einen in der Höhe',
      ],
      correctIndex: 0,
      explanation:
        'Der gesetzliche Anspruch besteht unabhängig davon, wie es dem System geht, und lässt sich einklagen. Eine satzungsmäßige Leistung folgt Regeln, die der Fonds ändern kann – deutsche Fonds haben ihre Grenzen mehrfach abgesenkt. Sie haben in der Praxis zuverlässig gezahlt; die Zusage hat nur eine andere Qualität.',
    },
    {
      question: 'Was ist das Besondere an der Institutssicherung bei Verbundbanken?',
      options: [
        'Sie sichert unbegrenzt hohe Beträge zu',
        'Sie stützt das Institut selbst, statt Einleger zu entschädigen – ein Sicherungsfall tritt dann gar nicht ein',
        'Sie gilt zusätzlich zur gesetzlichen Sicherung und verdoppelt die Grenze',
        'Sie erfasst auch Wertpapiere im Depot',
      ],
      correctIndex: 1,
      explanation:
        'Der Ansatz ist ein anderer: Statt nach dem Ausfall zu entschädigen, soll der Ausfall verhindert werden. Für Einleger ist das im Ergebnis oft besser, weil sie den Entschädigungsfall gar nicht erleben. Ein individueller Rechtsanspruch entsteht daraus allerdings ebenso wenig wie beim freiwilligen Fonds.',
    },
    {
      question:
        'Du hast gerade deine selbstgenutzte Wohnung verkauft und 400.000 € auf dem Konto. Was gilt?',
      options: [
        'Der Betrag ist unbegrenzt gesichert, solange er aus einem Immobilienverkauf stammt',
        'Es gilt die reguläre Grenze; alles darüber ist ungesichert',
        'Für sechs Monate greift ein erhöhter Schutz bis 500.000 € – gegen Nachweis des Anlasses',
        'Der erhöhte Schutz gilt automatisch für zwölf Monate ohne Nachweis',
      ],
      correctIndex: 2,
      explanation:
        'Nach bestimmten Lebensereignissen – Verkauf der selbstgenutzten Immobilie, Erbschaft, Abfindung – gilt vorübergehend eine höhere Grenze. Sie greift aber nicht automatisch: Der Anlass muss im Entschädigungsfall belegt werden. Die Unterlagen dazu gehören aufgehoben, solange das Geld auf dem Konto liegt.',
    },
    {
      question:
        'Du legst über eine Zinsplattform Festgeld bei einer Bank im EU-Ausland an. Wer ist im Sicherungsfall zuständig?',
      options: [
        'Die Plattform, weil der Vertrag über sie geschlossen wurde',
        'Das Sicherungssystem des Sitzlandes der Partnerbank',
        'Die deutsche Einlagensicherung, weil du in Deutschland ansässig bist',
        'Niemand – Anlagen über Plattformen sind von der Sicherung ausgenommen',
      ],
      correctIndex: 1,
      explanation:
        'Vertragspartner ist die Partnerbank, nicht die Plattform. Die Grenze ist EU-weit dieselbe, das System dahinter aber nicht: Es steht hinter dem Bankensektor seines Landes. Wer über eine Plattform bei drei Banken anlegt, hat drei getrennte Grenzen – und drei Systeme unterschiedlicher Leistungsfähigkeit.',
    },
  ],

  'einlagensicherung:profi': [
    {
      question: 'An welcher Stelle der Haftungskaskade stehen gedeckte Einlagen?',
      options: [
        'Vor den Nachranganleihen, aber hinter dem Eigenkapital',
        'Gleichrangig mit den übrigen vorrangigen Verbindlichkeiten',
        'Ganz am Ende – sie sind gesetzlich vom Bail-in ausgenommen',
        'Sie sind Teil des Eigenkapitals und haften zuerst',
      ],
      correctIndex: 2,
      explanation:
        'Die Reihenfolge lautet: Eigenkapital, hybride und nachrangige Papiere, nicht bevorrechtigte Anleihen, übrige vorrangige Verbindlichkeiten samt Einlagen über der Grenze – und erst ganz zuletzt gedeckte Einlagen. Praktisch wird diese Stufe nie erreicht, und genau darauf ist der Aufbau ausgelegt.',
    },
    {
      question: 'Wozu dient die MREL-Anforderung an Banken?',
      options: [
        'Sie legt fest, wie viel Bargeld eine Bank vorhalten muss',
        'Sie begrenzt die Höhe der Einlagen je Kunde',
        'Sie regelt die Beitragshöhe zum Einlagensicherungsfonds',
        'Sie verlangt genug haftendes Material, damit die Kaskade Verluste trägt, bevor sie die Einlagen erreicht',
      ],
      correctIndex: 3,
      explanation:
        'MREL zielt nicht auf Solvenz, sondern auf Abwickelbarkeit. Für Einleger ist die Anforderung damit der wirksamere Schutz als der Sicherungsfonds: Sie verhindert den Entschädigungsfall, statt ihn zu bezahlen. Für Halter von Bankanleihen ist es umgekehrt die Ansage, dass genau ihre Papiere das Haftungsmaterial bilden.',
    },
    {
      question:
        'Die gesetzlichen Sicherungsfonds sind auf einen niedrigen einstelligen Prozentsatz der gedeckten Einlagen vorfinanziert. Wie ist das zu bewerten?',
      options: [
        'Als Konstruktionsfehler – der Fonds kann keinen einzigen Ausfall bewältigen',
        'Als bewusste Auslegung: ausreichend für den Einzelfall, nicht für eine Systemkrise',
        'Als unerheblich, weil der Staat eine ausdrückliche Garantie übernommen hat',
        'Als überdimensioniert, weil Bankausfälle praktisch nicht mehr vorkommen',
      ],
      correctIndex: 1,
      explanation:
        'Für den Ausfall eines mittelgroßen Instituts ist der Fonds gut ausgestattet – dafür ist er gebaut. Fallen mehrere große Institute gleichzeitig aus, übersteigt der Bedarf jeden vorfinanzierten Bestand; dann greifen Nachschusspflichten der übrigen Banken, die dabei selbst unter Druck stehen. Eine ausdrückliche Staatsgarantie gibt es nicht.',
    },
    {
      question:
        'Was hat der Ausfall der Silicon Valley Bank 2023 über die Annahmen des Aufsichtsrechts gezeigt?',
      options: [
        'Dass Einlagen heute binnen Stunden abfließen können – die Annahmen zur Abflussgeschwindigkeit sind zu langsam kalibriert',
        'Dass Sicherungsfonds grundsätzlich überflüssig sind',
        'Dass Bail-in-Regeln in der Praxis nicht angewendet werden können',
        'Dass Einlagen über der Grenze in jedem Fall vollständig ersetzt werden',
      ],
      correctIndex: 0,
      explanation:
        'Binnen eines Tages flossen Beträge ab, für die früher Wochen nötig gewesen wären – ausgelöst über soziale Netzwerke, ausgeführt per App. Die aufsichtsrechtlichen Annahmen stammen aus einer Zeit, in der man dafür in eine Filiale gehen musste. Für Einleger bestätigt das nur die eine wirksame Maßnahme: Verteilung über mehrere Institute und Systeme.',
    },
  ],

  // -------------------------------------------------------- Schulden & Kredit
  'schulden-und-kredit:beginner': [
    {
      question:
        'Warum ist ein Dispositionskredit besonders teuer und besonders gefährlich?',
      options: [
        'Weil er gesetzlich mit einem Mindestzins belegt ist',
        'Weil er unbesichert und jederzeit abrufbar ist – und weil ihm ein Tilgungsplan fehlt',
        'Weil er nur für kurze Laufzeiten vergeben werden darf',
        'Weil er die Bonitätsbewertung automatisch verschlechtert',
      ],
      correctIndex: 1,
      explanation:
        'Der hohe Zins folgt aus der fehlenden Sicherheit und der jederzeitigen Verfügbarkeit. Gefährlich macht ihn aber etwas anderes: Ohne Laufzeit und Tilgungsplan wird nichts abgebaut, und der Zins läuft weiter. Die Ablösung durch einen Ratenkredit ist einer der wenigen Fälle, in denen ein neuer Kredit die richtige Antwort ist.',
    },
    {
      question: 'Woraus besteht die Rate eines Annuitätendarlehens?',
      options: [
        'Aus einem gleichbleibenden Zinsanteil und einem gleichbleibenden Tilgungsanteil',
        'Ausschließlich aus Tilgung; die Zinsen werden am Ende fällig',
        'Aus Zins auf die Restschuld und Tilgung – der Zinsanteil sinkt im Zeitverlauf, der Tilgungsanteil wächst',
        'Aus Tilgung und einer festen Bearbeitungsgebühr',
      ],
      correctIndex: 2,
      explanation:
        'Die Rate bleibt gleich, ihre Zusammensetzung nicht. Weil der Zins auf die noch offene Schuld berechnet wird und diese sinkt, verschiebt sich das Verhältnis laufend zugunsten der Tilgung. Am Anfang geht der größere Teil der Rate an die Bank – bei einem Immobilienkredit oft deutlich mehr als die Hälfte.',
    },
    {
      question: 'Wie wirkt sich eine längere Laufzeit bei gleichem Zinssatz aus?',
      options: [
        'Niedrigere Rate und niedrigere Gesamtkosten',
        'Niedrigere Rate, aber deutlich höhere Gesamtkosten',
        'Höhere Rate, dafür niedrigere Gesamtkosten',
        'Sie wirkt sich nur auf die Rate aus, nicht auf die Zinssumme',
      ],
      correctIndex: 1,
      explanation:
        'Die Schuld steht länger offen, also fallen länger Zinsen an. Beworben wird immer die Rate, weil sie in den Monatshaushalt passen muss; bezahlt wird die Zinssumme. Die Laufzeit ist damit der Hebel mit der größten Wirkung – wer sie verkürzen kann, spart mehr als durch jede Zinsverhandlung.',
    },
    {
      question: 'Was sagt ein beworbener Zinssatz „ab 2,9 Prozent“ aus?',
      options: [
        'Dass dieser Satz der beste Bonitätsklasse vorbehalten ist – dein Angebot kann deutlich darüber liegen',
        'Dass 2,9 Prozent der Durchschnittszins aller vergebenen Kredite ist',
        'Dass der Zins nach oben auf 2,9 Prozent begrenzt ist',
        'Dass der Effektivzins bei 2,9 Prozent liegt',
      ],
      correctIndex: 0,
      explanation:
        'Bonitätsabhängige Zinsen bedeuten, dass der beworbene Satz die untere Kante ist. Aussagekräftiger ist das gesetzlich vorgeschriebene repräsentative Beispiel. Und vergleichbar ist ohnehin nur der Effektivzins – der allerdings eine mitverkaufte Restschuldversicherung nicht enthalten muss.',
    },
  ],

  'schulden-und-kredit:fortgeschritten': [
    {
      question:
        'Was bewirkt eine Anfangstilgung von einem Prozent bei einem Immobilienkredit zu heutigen Zinsen?',
      options: [
        'Eine Laufzeit von etwa zwanzig Jahren bei niedriger Rate',
        'Eine Laufzeit von über vierzig Jahren und eine Zinssumme nahe der Darlehenshöhe',
        'Eine Laufzeit von etwa dreißig Jahren, danach ist der Kredit getilgt',
        'Sie wirkt nur auf die Rate, nicht auf die Laufzeit',
      ],
      correctIndex: 1,
      explanation:
        'Bei Immobilienkrediten wird nicht die Laufzeit vereinbart, sondern der anfängliche Tilgungssatz – die Laufzeit ergibt sich daraus. Ein Prozent führt zu über vierzig Jahren, also über den Ruhestand hinaus, und zu Zinsen in der Größenordnung des Darlehens selbst. Der Schritt auf zwei Prozent kostet gut ein Fünftel mehr Rate und spart mehr als ein Drittel der Zinsen.',
    },
    {
      question:
        'Warum ist die Restschuld nach Ablauf der Zinsbindung das eigentliche Risiko?',
      options: [
        'Weil sie sofort in einer Summe zurückgezahlt werden muss',
        'Weil auf sie ein Strafzins erhoben wird',
        'Weil sie zu dann geltenden Konditionen weiterfinanziert werden muss, die heute niemand kennt',
        'Weil sie nicht mehr durch die Grundschuld besichert ist',
      ],
      correctIndex: 2,
      explanation:
        'Der Zins ist nur für die Dauer der Bindung festgeschrieben. Was danach gilt, entscheidet der Markt in zehn oder fünfzehn Jahren. Bei niedriger Anfangstilgung stehen dann noch fast neunzig Prozent der ursprünglichen Summe offen – wer nur auf die Rate geschaut hat, sieht diese Zahl nie.',
    },
    {
      question:
        'Ein Immobilienkredit hat eine Zinsbindung über zwanzig Jahre. Bist du daran gebunden?',
      options: [
        'Ja, ein vorzeitiges Ende ist nur gegen Vorfälligkeitsentschädigung möglich',
        'Nein – nach zehn Jahren ab Vollauszahlung kann mit sechs Monaten Frist gekündigt werden, ohne Entschädigung',
        'Ja, eine Kündigung ist während der Zinsbindung ausgeschlossen',
        'Nein, aber nur bei einem Verkauf der Immobilie',
      ],
      correctIndex: 1,
      explanation:
        'Das gesetzliche Kündigungsrecht nach zehn Jahren gilt unabhängig von der vereinbarten Bindung. Eine Zinsbindung über fünfzehn oder zwanzig Jahre ist damit einseitig: Sie bindet die Bank, nicht dich. Bei niedrigem Zinsniveau ist eine lange Bindung deshalb die vermutlich sinnvollste Versicherung im Kreditbereich.',
    },
    {
      question:
        'Du hast einen Dispo zu zehn Prozent und legst gleichzeitig Geld zu zwei Prozent an. Wie ist das zu bewerten?',
      options: [
        'Sinnvoll, weil das angelegte Geld verfügbar bleibt',
        'Sinnvoll, solange die Anlage breit gestreut ist',
        'Ein sicherer Verlust in Höhe der Zinsdifferenz – mit einer Ausnahme beim Notgroschen',
        'Neutral, weil sich Zinsen und Erträge steuerlich ausgleichen',
      ],
      correctIndex: 2,
      explanation:
        'Die Differenz geht jedes Jahr verloren, bei jeder Marktlage. Der Vorgang ist ein Musterbeispiel für mentale Buchführung: zwei Töpfe, keine gemeinsame Rechnung. Die einzige begründete Ausnahme ist der Notgroschen – wer ihn zur Tilgung auflöst, landet beim nächsten unerwarteten Betrag wieder im Dispo.',
    },
  ],

  'schulden-und-kredit:profi': [
    {
      question:
        'Warum ist der Vergleich „Kreditzins 3 Prozent gegen erwartete Aktienrendite 7 Prozent“ falsch aufgestellt?',
      options: [
        'Weil die Tilgung eine sichere Rendite liefert und Kapitalerträge zusätzlich besteuert werden',
        'Weil Aktienrenditen langfristig unter drei Prozent liegen',
        'Weil Kreditzinsen immer steuerlich absetzbar sind',
        'Weil die Rendite eines Depots nicht berechenbar ist',
      ],
      correctIndex: 0,
      explanation:
        'Zwei Fehler wirken in dieselbe Richtung. Die Tilgung bringt exakt den Kreditzins, und zwar sicher – ihr fairer Vergleichspartner ist eine sichere Anlage, nicht der Aktienmarkt. Und Steuern greifen nur auf einer Seite: Erträge werden besteuert, ersparte Schuldzinsen nicht.',
    },
    {
      question: 'Wann sind Schuldzinsen in Deutschland steuerlich absetzbar?',
      options: [
        'Immer, sofern der Kredit über eine deutsche Bank läuft',
        'Bei einer vermieteten Immobilie als Werbungskosten – bei Selbstnutzung und bei Kapitalanlagen dagegen nicht',
        'Nur bei selbstgenutzten Immobilien',
        'Bei allen Krediten, die der Vermögensbildung dienen',
      ],
      correctIndex: 1,
      explanation:
        'Entscheidend ist der Zweck. Bei Vermietung gibt es eine Einkunftsart, der die Zinsen zugeordnet werden können. Bei Selbstnutzung und beim Konsumkredit gibt es sie nicht. Bei Kapitalanlagen ist der Abzug tatsächlicher Werbungskosten grundsätzlich ausgeschlossen – der Sparerpauschbetrag tritt an ihre Stelle.',
    },
    {
      question: 'Was macht einen Wertpapierkredit im Abschwung besonders gefährlich?',
      options: [
        'Die Zinsen steigen bei fallenden Kursen automatisch an',
        'Der Beleihungswert sinkt mit den Kursen – die Nachschussforderung kommt genau dann, wenn Nachschießen am schwersten fällt',
        'Er darf bei fallenden Kursen nicht mehr getilgt werden',
        'Die Bank darf ihn nur bei steigenden Kursen kündigen',
      ],
      correctIndex: 1,
      explanation:
        'Der Kredit ist durch das Depot besichert, und dessen Wert fällt mit dem Markt. Wer nicht nachschießen kann, wird zwangsweise verkauft – am Tiefpunkt und ohne Wahl. Es ist derselbe Mechanismus wie bei Derivaten: Aus einem Verlustrisiko wird ein Liquiditätsrisiko.',
    },
    {
      question: 'Wie ist ein Bausparvertrag wirtschaftlich zu bewerten?',
      options: [
        'Als Sparprodukt, dessen Verzinsung mit dem Marktzins vergleichbar ist',
        'Als Darlehen, dessen Konditionen erst bei Zuteilung feststehen',
        'Als zwei Verträge, die nur gemeinsam bewertbar sind: schwache Sparverzinsung als Preis für die spätere Zinssicherung',
        'Als reine Zinswette ohne Sparkomponente',
      ],
      correctIndex: 2,
      explanation:
        'Die Sparphase mit niedriger Verzinsung und das Darlehensrecht zu einem heute festgelegten Zins gehören zusammen. Wer nur eine der beiden Phasen ansieht, bewertet falsch – und wer das Darlehen später nicht abruft, hat eine schlecht verzinste Spareinlage bezahlt, ohne die Gegenleistung je in Anspruch zu nehmen.',
    },
  ],

  // ------------------------------------------------------- Sparerpauschbetrag
  'sparerpauschbetrag:beginner': [
    {
      question:
        'Du hast Kapitalerträge unterhalb des Sparerpauschbetrags, aber keinen Freistellungsauftrag gestellt. Was passiert?',
      options: [
        'Die Bank führt Steuer ab – sie kann nicht wissen, ob der Freibetrag anderswo schon genutzt wird',
        'Nichts, der Freibetrag wirkt automatisch',
        'Die Bank fragt beim Finanzamt nach und behält nur bei Überschreitung ein',
        'Die Steuer wird erst mit der Steuererklärung fällig',
      ],
      correctIndex: 0,
      explanation:
        'Der Freibetrag wirkt nicht von selbst. Ohne Auftrag zieht die Bank ab dem ersten Euro ab – sie kennt nur deine Konten bei ihr, nicht deine Gesamtsituation. Zurückholen lässt sich das über die Anlage KAP; einfacher ist es, den Auftrag rechtzeitig zu stellen.',
    },
    {
      question: 'Wie wirkt der Solidaritätszuschlag auf Kapitalerträge?',
      options: [
        'Er wird auf den Ertrag erhoben, sodass insgesamt 30,5 Prozent anfallen',
        'Er wird auf die Abgeltungsteuer erhoben – zusammen ergibt das rund 26,4 Prozent des Ertrags',
        'Er entfällt bei Kapitalerträgen vollständig',
        'Er ersetzt die Abgeltungsteuer bei Erträgen unter dem Freibetrag',
      ],
      correctIndex: 1,
      explanation:
        'Der Zuschlag bemisst sich nach der Steuer, nicht nach dem Ertrag: 5,5 Prozent von 25 Prozent sind 1,375 Prozentpunkte, zusammen 26,375 Prozent. Das ist der Rechenfehler, der bei dieser Zahl am häufigsten passiert – die Sätze werden addiert statt verkettet.',
    },
    {
      question: 'Was geschieht mit einem nicht ausgeschöpften Sparerpauschbetrag?',
      options: [
        'Er wird auf das Folgejahr übertragen',
        'Er wird beim nächsten Verkauf nachträglich angerechnet',
        'Er verfällt zum 31. Dezember – einen Übertrag gibt es nicht',
        'Er erhöht den Freibetrag des Ehepartners',
      ],
      correctIndex: 2,
      explanation:
        'Der Freibetrag ist ein Jahresbetrag ohne Übertragsmöglichkeit. Wer im November noch Luft hat, kann sie nutzen, indem er Anteile mit Gewinn verkauft und sofort zurückkauft: Der Gewinn bleibt steuerfrei, und der Einstandskurs steigt. Zu rechnen ist das gegen Ordergebühren und Spread.',
    },
    {
      question: 'Wann fällt Steuer auf einen Kursgewinn an?',
      options: [
        'Sobald der Depotwert steigt',
        'Jährlich anteilig auf die Wertsteigerung des Vorjahres',
        'Erst bei der Steuererklärung des Folgejahres',
        'Erst beim Verkauf – nur realisierte Gewinne sind steuerpflichtig',
      ],
      correctIndex: 3,
      explanation:
        'Eine bloße Wertsteigerung im Depot löst nichts aus; besteuert wird erst der realisierte Gewinn. Genau darin liegt die Steuerstundung, die langes Halten wertvoll macht. Die einzige Ausnahme ist die Vorabpauschale bei thesaurierenden Fonds – sie entsteht ohne eigenes Zutun.',
    },
  ],

  'sparerpauschbetrag:fortgeschritten': [
    {
      question:
        'Bei welchem Konto oder Depot sollte der Freistellungsauftrag zuerst liegen?',
      options: [
        'Beim Depot mit thesaurierenden Fonds – die Vorabpauschale wird ohne dein Zutun im Januar eingezogen',
        'Beim Girokonto, weil dort der Zahlungsverkehr läuft',
        'Beim Depot mit den höchsten Kursgewinnen des Vorjahres',
        'Es spielt keine Rolle, die Banken gleichen untereinander ab',
      ],
      correctIndex: 0,
      explanation:
        'Die sinnvolle Reihenfolge folgt der Steuerbarkeit: zuerst dorthin, wo Erträge ohne dein Zutun entstehen. Die Vorabpauschale wird Anfang Januar automatisch belastet. Realisierte Kursgewinne stehen ans Ende der Reihenfolge, weil du über sie selbst entscheidest.',
    },
    {
      question: 'Was passiert beim Depotwechsel mit dem Freistellungsauftrag?',
      options: [
        'Er wandert automatisch mit dem Depot mit',
        'Er wird beim Übertrag anteilig aufgeteilt',
        'Er bleibt beim alten Institut stehen und blockiert dort einen Teil des Freibetrags',
        'Er erlischt automatisch mit der Depotauflösung',
      ],
      correctIndex: 2,
      explanation:
        'Der Auftrag bleibt, wo er ist. Erst beim alten Institut widerrufen oder herabsetzen, dann beim neuen erteilen – in dieser Reihenfolge, sonst überschreitet die Summe kurzzeitig die Grenze. Mitzudenken ist auch die Übermittlung der Anschaffungsdaten: Fehlen sie, unterstellt die neue Bank eine ungünstigere Ersatzbemessungsgrundlage.',
    },
    {
      question:
        'Du hast bei Bank A Verluste und bei Bank B Gewinne realisiert. Wie lassen sie sich verrechnen?',
      options: [
        'Gar nicht – Verluste sind immer institutsgebunden',
        'Automatisch, sobald beide Banken die Jahressteuerbescheinigung ausstellen',
        'Über eine Verlustbescheinigung von Bank A und die Anlage KAP – Antrag bis 15. Dezember',
        'Durch einen Depotübertrag von Bank A zu Bank B',
      ],
      correctIndex: 2,
      explanation:
        'Banken verrechnen nur institutsintern. Institutsübergreifend geht es nur über die Steuererklärung, und dafür braucht es eine Verlustbescheinigung – beantragt bis zum 15. Dezember des Jahres. Diese Frist ist gesetzlich und nicht verlängerbar; versäumt man sie, bleiben die Verluste im Topf der Bank A und werden dort vorgetragen.',
    },
    {
      question:
        'Wer profitiert von einer Nichtveranlagungsbescheinigung – und was leistet sie?',
      options: [
        'Kirchensteuerpflichtige; sie verhindert den automatischen Kirchensteuerabzug',
        'Wer mit dem gesamten Einkommen unter dem Grundfreibetrag bleibt; sie stellt Erträge über den Sparerpauschbetrag hinaus frei',
        'Anleger mit ausländischem Depot; sie ersetzt die Erklärungspflicht',
        'Alle Anleger; sie verdoppelt den Sparerpauschbetrag',
      ],
      correctIndex: 1,
      explanation:
        'Sie wird beim Finanzamt beantragt und lohnt sich typischerweise für Studierende, Kinder und teils im Ruhestand. Anders als der Freistellungsauftrag ist sie nicht auf den Pauschbetrag begrenzt: Sie stellt die Kapitalerträge vollständig frei. Der Kirchensteuerabzug wird dagegen über einen Sperrvermerk gesteuert – und entfällt dadurch nicht, sondern läuft über die Erklärung.',
    },
  ],

  'sparerpauschbetrag:profi': [
    {
      question:
        'Du hast mit Einzelaktien Verluste und mit ETFs Gewinne realisiert. Was gilt?',
      options: [
        'Beides ist verrechenbar, solange es beim selben Institut anfällt',
        'Aktienverluste sind nur mit Gewinnen aus Einzelaktien verrechenbar – der ETF-Gewinn wird versteuert',
        'Der Aktienverlust mindert zuerst den Sparerpauschbetrag',
        'Aktienverluste verfallen am Jahresende, wenn sie nicht genutzt werden',
      ],
      correctIndex: 1,
      explanation:
        'Der Aktienverlusttopf ist strikt getrennt: Er lässt sich weder mit Dividenden noch mit Fondsgewinnen verrechnen, sondern ausschließlich mit Gewinnen aus dem Verkauf einzelner Aktien. Er wird unbegrenzt vorgetragen, bleibt aber topfgebunden – wer nie wieder Einzelaktien mit Gewinn verkauft, nutzt ihn nie.',
    },
    {
      question: 'Wie wird die Vorabpauschale bei einem thesaurierenden Fonds ermittelt?',
      options: [
        'Als fester Prozentsatz des Depotwerts am Jahresende',
        'Als Differenz zwischen Kauf- und Jahresendkurs',
        'Als voller Wertzuwachs des Fonds im abgelaufenen Jahr',
        'Als Basisertrag – Wert am Jahresanfang mal Basiszins mal 0,7 –, gedeckelt auf die tatsächliche Wertsteigerung',
      ],
      correctIndex: 3,
      explanation:
        'Die Deckelung ist der entscheidende Teil: In einem Verlustjahr fällt keine Vorabpauschale an. Der Basiszins wird jährlich vom Bundesfinanzministerium festgesetzt. Bei einem Aktienfonds bleiben davon zusätzlich 30 Prozent teilfreigestellt.',
    },
    {
      question: 'Ist die Vorabpauschale eine Doppelbesteuerung?',
      options: [
        'Nein – gezahlte Vorabpauschalen werden beim späteren Verkauf vom Gewinn abgezogen',
        'Ja, deshalb ist sie verfassungsrechtlich umstritten',
        'Nur bei Fonds mit Sitz im Ausland',
        'Ja, sie wird beim Verkauf ein zweites Mal erhoben',
      ],
      correctIndex: 0,
      explanation:
        'Sie ist eine Vorverlagerung, keine zusätzliche Belastung: Alle gezahlten Pauschalen mindern den steuerpflichtigen Gewinn beim Verkauf. Das praktische Problem liegt woanders – der Betrag wird vom Verrechnungskonto eingezogen, auch wenn nichts verkauft wurde. Ist es nicht gedeckt, entsteht daraus eine Überziehung.',
    },
    {
      question:
        'Ein Depot auf den Namen des Kindes soll dessen eigenen Freibetrag nutzen. Was ist die Bedingung?',
      options: [
        'Ein Sperrvermerk beim Bundeszentralamt für Steuern',
        'Ein gemeinsamer Freistellungsauftrag der Eltern',
        'Das Geld muss dem Kind tatsächlich gehören – endgültig übertragen, mit voller Verfügung ab 18',
        'Das Depot muss bei derselben Bank geführt werden wie das der Eltern',
      ],
      correctIndex: 2,
      explanation:
        'Anerkannt wird die Gestaltung nur, wenn die Übertragung echt ist. Wer die Verfügungsmacht behält oder das Geld später für eigene Zwecke verwendet, hat steuerlich nichts erreicht. Zu bedenken sind außerdem Familienversicherung und Kindergeldanspruch, die von eigenen Einkünften des Kindes berührt werden können.',
    },
  ],

  // ------------------------------------------------- Notenbanken & Geldpolitik
  'notenbanken-geldpolitik:beginner': [
    {
      question: 'Worin unterscheidet sich der Auftrag von EZB und US-Notenbank?',
      options: [
        'Die EZB hat Preisstabilität als vorrangiges Ziel, die Fed zusätzlich maximale Beschäftigung',
        'Die Fed ist auf Preisstabilität festgelegt, die EZB auf Wachstum',
        'Beide haben denselben Auftrag, nur verschiedene Zielwerte',
        'Die EZB ist der Politik weisungsgebunden, die Fed nicht',
      ],
      correctIndex: 0,
      explanation:
        'Die EZB muss bei hoher Inflation handeln, auch wenn die Konjunktur leidet – ihr Ziel ist eindeutig. Die Fed hat ein Doppelmandat und damit zwei Ziele, die sich widersprechen können. Unabhängig von der Politik sind beide, und das gilt als Voraussetzung dafür, dass eine Notenbank überhaupt glaubwürdig sein kann.',
    },
    {
      question:
        'Wenn in Meldungen aus dem Euroraum von „dem Leitzins“ die Rede ist – welcher Satz ist meist gemeint?',
      options: [
        'Der Hauptrefinanzierungssatz',
        'Der Spitzenrefinanzierungssatz',
        'Der Einlagesatz – er bestimmt die Untergrenze des Geldmarkts und damit das Tagesgeld',
        'Der Durchschnitt aller drei Sätze',
      ],
      correctIndex: 2,
      explanation:
        'Der Einlagesatz ist das, was Banken für über Nacht geparktes Geld erhalten. Er ist der Satz, an dem sie sich orientieren, wenn sie überschüssige Liquidität haben – und deshalb bewegt sich dein Tagesgeldzins mit ihm, nicht mit den beiden anderen.',
    },
    {
      question: 'Darf die EZB Staatshaushalte direkt finanzieren?',
      options: [
        'Ja, das ist eine ihrer Kernaufgaben',
        'Nein – die direkte Finanzierung ist vertraglich untersagt; Käufe erfolgen am Sekundärmarkt',
        'Ja, aber nur bis zu einer festgelegten Obergrenze je Staat',
        'Nur in Krisenzeiten nach Beschluss des Europäischen Rates',
      ],
      correctIndex: 1,
      explanation:
        'Anleihen kauft die EZB von Banken und Fonds, nicht vom Staat selbst. Der Unterschied ist rechtlich wesentlich und wirtschaftlich umstritten – aber er ist keine Formalie: Ein Staat muss seine Papiere zunächst am Markt platzieren und dort einen Preis akzeptieren.',
    },
    {
      question:
        'Die EZB erhöht den Zins wie erwartet – und die Aktienkurse steigen. Wie ist das zu erklären?',
      options: [
        'Zinserhöhungen sind für Aktien grundsätzlich positiv',
        'Der Markt reagiert immer mit Verzögerung von mehreren Tagen',
        'Die Erhöhung war bereits eingepreist; bewegt wird nur die Abweichung von der Erwartung',
        'Aktienkurse hängen nicht von Zinsentscheidungen ab',
      ],
      correctIndex: 2,
      explanation:
        'Ein erwarteter Zinsschritt steht längst in den Kursen, wenn er verkündet wird. Fiel er kleiner aus als befürchtet oder klang der Ausblick milder, ist das die eigentliche Nachricht. Genau darauf beruht auch die Forward Guidance: Eine Notenbank kann allein durch Ankündigungen wirken, ohne den Zins anzufassen.',
    },
  ],

  'notenbanken-geldpolitik:fortgeschritten': [
    {
      question:
        'Warum trifft ein Zinsanstieg Wachstumswerte stärker als etablierte Unternehmen mit stabilen Gewinnen?',
      options: [
        'Weil Wachstumsunternehmen höher verschuldet sind',
        'Weil ihre Gewinne weiter in der Zukunft liegen und damit stärker auf den Abzinsungssatz reagieren',
        'Weil sie häufiger von institutionellen Anlegern gehalten werden',
        'Weil ihre Dividenden gekürzt werden müssen',
      ],
      correctIndex: 1,
      explanation:
        'Der Wert einer Aktie ist der Barwert künftiger Gewinne. Je weiter diese in der Zukunft liegen, desto heftiger wirkt jede Änderung des Abzinsungssatzes. Das erklärt, warum 2022 Technologiewerte deutlich stärker verloren als Versorger – ohne dass sich an ihren Geschäften etwas geändert hätte.',
    },
    {
      question:
        'Warum reagieren Notenbanken auf Prognosen statt auf die aktuelle Inflationsrate?',
      options: [
        'Weil aktuelle Daten erst mit einem Jahr Verzögerung veröffentlicht werden',
        'Weil die Prognosen gesetzlich vorgeschrieben sind',
        'Weil aktuelle Daten regelmäßig revidiert werden',
        'Weil ein Zinsschritt erst nach vier bis sechs Quartalen voll auf die Inflation wirkt',
      ],
      correctIndex: 3,
      explanation:
        'Bestehende Kredite laufen weiter, Tarifabschlüsse gelten für Jahre, Investitionen sind entschieden. Wer auf die heutige Inflation reagiert, kommt anderthalb Jahre zu spät. Daraus folgt zugleich das strukturelle Risiko der Übersteuerung: Wer nachsteuert, bis die Daten sich bessern, hat zwangsläufig zu lange nachgesteuert.',
    },
    {
      question: 'Warum kommt ein Zinsanstieg beim Sparer später an als ein Zinsrückgang?',
      options: [
        'Weil Banken sinkende Zinsen auf Einlagen schnell und steigende langsam weitergeben',
        'Weil die Einlagensicherung eine Frist vorschreibt',
        'Weil Tagesgeldzinsen gesetzlich nur quartalsweise angepasst werden dürfen',
        'Weil die EZB Zinserhöhungen erst mit Verzögerung wirksam werden lässt',
      ],
      correctIndex: 0,
      explanation:
        'Die Weitergabe ist asymmetrisch, und bei Krediten ist es genau umgekehrt. Das ist kein Vorwurf, sondern Wettbewerbsverhalten – für Sparer bedeutet es aber, dass der Vergleich von Angeboten nach einem Zinsschritt besonders lohnt, weil die Institute unterschiedlich schnell nachziehen.',
    },
    {
      question: 'Was bewirkt quantitative Lockerung, das eine Zinssenkung nicht bewirkt?',
      options: [
        'Sie senkt die kurzfristigen Zinsen unter null',
        'Sie erhöht direkt die Kreditvergabe der Banken',
        'Sie senkt die langfristigen Zinsen, wenn die kurzen bereits bei null angekommen sind',
        'Sie verhindert Kursverluste bei Anleihen',
      ],
      correctIndex: 2,
      explanation:
        'Der Leitzins wirkt am kurzen Ende. Ist er ausgereizt, bleibt der Ankauf langlaufender Anleihen, um auch die langen Zinsen zu drücken. Die Nebenwirkung zeigt sich beim Ausstieg: Ein großer Teil des Umlaufs war aus dem Markt verschwunden, und private Käufer verlangen einen Preis, den die Notenbank nicht verlangt hat.',
    },
  ],

  'notenbanken-geldpolitik:profi': [
    {
      question: 'Warum taugt die Taylor-Regel zur Erklärung, aber nicht als Vorgabe?',
      options: [
        'Weil sie nur für die US-Notenbank formuliert wurde',
        'Weil zwei ihrer Eingangsgrößen – natürlicher Zins und Output-Lücke – nicht messbar, sondern geschätzt sind',
        'Weil sie die Inflation nicht berücksichtigt',
        'Weil sie erst seit wenigen Jahren bekannt ist',
      ],
      correctIndex: 1,
      explanation:
        'Die Regel erklärt vergangene Entscheidungen erstaunlich gut. Als Vorgabe scheitert sie daran, dass der natürliche Zins nicht beobachtbar ist und die Output-Lücke im Nachhinein regelmäßig deutlich revidiert wird. Geldpolitik ist damit keine Steuerung nach Messwerten, sondern Navigation mit unsicherer Position.',
    },
    {
      question: 'Was ist mit fiskalischer Dominanz gemeint?',
      options: [
        'Dass die Regierung der Notenbank Weisungen erteilen darf',
        'Dass Staatsausgaben stärker auf die Inflation wirken als der Leitzins',
        'Dass die Notenbank Staatsanleihen kaufen muss, wenn niemand sonst sie nimmt',
        'Dass hohe Staatsschulden jede Zinserhöhung zur Haushaltsbelastung machen und den Spielraum faktisch einengen',
      ],
      correctIndex: 3,
      explanation:
        'Bei hoher Verschuldung schlägt jeder Zinsschritt auf den Haushalt durch. Schon der Verdacht, eine Notenbank könnte deshalb zögern, untergräbt ihre Glaubwürdigkeit – auch wenn sie es nicht tut. Eine rechtliche Weisungsbefugnis besteht dabei nicht; die Beschränkung ist eine faktische.',
    },
    {
      question:
        'Welche Größe zeigt am direktesten, welchen Zinspfad der Markt tatsächlich einpreist?',
      options: [
        'Die Prognosen der Notenbank selbst',
        'Die Zinsstrukturkurve und die Terminmärkte auf Tagesgeldsätze',
        'Die Kommentare der Ratsmitglieder nach der Sitzung',
        'Der Verlauf des Aktienindex am Sitzungstag',
      ],
      correctIndex: 1,
      explanation:
        'Zinskurve und Terminmärkte zeigen, was mit echtem Geld erwartet wird – nicht, was jemand meint. Sie sind nützlich, um zu verstehen, was gerade eingepreist ist. Nützlich, um es besser zu wissen, sind sie nicht: Genau diese Erwartung steckt bereits in jedem Kurs.',
    },
    {
      question: 'Welche Konsequenz aus der Geldpolitik ist für ein Privatdepot sinnvoll?',
      options: [
        'Die Aktienquote nach jeder Notenbanksitzung anpassen',
        'Vor erwarteten Zinserhöhungen Anleihen verkaufen',
        'Die Laufzeit der Anleihen und die Konzentration auf Wachstumswerte bewusst wählen – als Strukturentscheidung',
        'Die Sparrate an den Leitzins koppeln',
      ],
      correctIndex: 2,
      explanation:
        'Notenbanksitzungen taugen als Erklärung, nicht als Handelssignal – die erwartete Entwicklung steht im Kurs. Sinnvoll ist, was aus dem Verständnis folgt: Wer weiß, dass lange Anleihen um ein Vielfaches stärker reagieren als kurze, wählt die Laufzeit bewusst. Das ist eine Entscheidung über die Aufteilung, und die trifft man einmal.',
    },
  ],

  // ------------------------------------------------- Währungen & Wechselkurse
  'waehrungen-wechselkurse:beginner': [
    {
      question: 'EUR/USD steigt von 1,10 auf 1,20. Was bedeutet das?',
      options: [
        'Der Euro ist stärker geworden – ein Euro kostet jetzt mehr Dollar',
        'Der Dollar ist stärker geworden',
        'Beide Währungen haben gegenüber Gold verloren',
        'Der Kurs sagt nichts über die Stärke der Währungen aus',
      ],
      correctIndex: 0,
      explanation:
        'Die erste Währung ist die Ware, die zweite der Preis. EUR/USD sagt, was ein Euro in Dollar kostet – steigt die Zahl, ist der Euro stärker. Für einen europäischen Anleger mit Dollar-Anlagen ist das die ungünstige Richtung: Beim Rücktausch bekommt er weniger Euro je Dollar.',
    },
    {
      question: 'Welcher Faktor bewegt Wechselkurse kurzfristig am stärksten?',
      options: [
        'Die Kaufkraftunterschiede zwischen den Ländern',
        'Zinsdifferenzen zwischen den Währungsräumen',
        'Die Handelsbilanz',
        'Die Staatsverschuldung',
      ],
      correctIndex: 1,
      explanation:
        'Kapital fließt dorthin, wo es mehr Zins gibt – das wirkt binnen Tagen. Inflationsunterschiede und Kaufkraft wirken über Jahrzehnte, die Handelsbilanz über Monate bis Jahre. Und in Krisen setzt sich die Flucht in sichere Häfen über alles andere hinweg.',
    },
    {
      question:
        'Eine US-Aktie steigt um 10 Prozent in Dollar, gleichzeitig steigt EUR/USD von 1,10 auf 1,20. Was ergibt sich für einen Euro-Anleger?',
      options: [
        'Ungefähr 10 Prozent Gewinn, der Währungseffekt wirkt sich kaum aus',
        'Rund 20 Prozent Gewinn – beide Effekte addieren sich',
        'Knapp über null – der stärkere Euro zehrt den Kursgewinn fast vollständig auf',
        'Rund 10 Prozent Verlust, weil der Währungseffekt den Kursgewinn übersteigt',
      ],
      correctIndex: 2,
      explanation:
        'Aus 10.000 € werden 11.000 $ zum Ausgangskurs. Die Aktie bringt 12.100 $. Zurückgetauscht zu 1,20 sind das rund 10.083 € – also gut null Prozent. Bei einem Kurs von 1,30 wären es rund sieben Prozent Verlust. Kurs- und Währungseffekt addieren sich nicht, sie multiplizieren sich.',
    },
    {
      question:
        'Ein weltweit anlegender ETF wird in Euro gehandelt. Trägt er ein Währungsrisiko?',
      options: [
        'Ja – die Handelswährung ist nicht das Währungsrisiko; entscheidend ist, worin die Unternehmen wirtschaften',
        'Nein, die Euro-Notierung schließt Währungsrisiken aus',
        'Nur, wenn er ausschüttet',
        'Nur bei einem synthetisch abbildenden ETF',
      ],
      correctIndex: 0,
      explanation:
        'Der ETF hält Aktien von Unternehmen, die überwiegend in Dollar bilanzieren. Fällt der Dollar, fällt der Eurowert dieser Beteiligungen – die Euro-Notierung rechnet das nur um. Umgekehrt trägt ein in Dollar gehandelter Europa-ETF kein nennenswertes Dollarrisiko.',
    },
  ],

  'waehrungen-wechselkurse:fortgeschritten': [
    {
      question: 'Wovon hängen die laufenden Kosten einer Währungsabsicherung ab?',
      options: [
        'Von der erwarteten Wechselkursentwicklung',
        'Von der Zinsdifferenz zwischen beiden Währungsräumen',
        'Von der Größe des abgesicherten Betrags, mit Mengenrabatt',
        'Von der Schwankungsbreite des Wechselkurses im Vorjahr',
      ],
      correctIndex: 1,
      explanation:
        'Der Terminkurs folgt der Arbitragefreiheit, nicht einer Prognose: Er entspricht dem Kassakurs, angepasst um die Zinsdifferenz. Genau diese Differenz sind die Kosten. Bei zwei Prozentpunkten Zinsvorsprung des Dollars kostet die Absicherung rund zwei Prozent im Jahr – unabhängig davon, wohin der Kurs läuft.',
    },
    {
      question:
        'Warum ist eine Währungsabsicherung bei Anleihen üblich, bei Aktien dagegen meist nicht?',
      options: [
        'Weil Anleihen häufiger in Fremdwährung notieren',
        'Weil sich Aktien nicht absichern lassen',
        'Weil bei Anleihen die Währungsschwankung die erwartete Rendite deutlich übersteigt, bei Aktien die Marktschwankung dominiert',
        'Weil die Absicherung bei Aktien steuerlich nachteilig ist',
      ],
      correctIndex: 2,
      explanation:
        'Bei einer Anleihe mit drei Prozent Rendite würde eine Währungsbewegung von zehn Prozent das Ergebnis vollständig bestimmen – dort ist Absicherung sinnvoll. Bei Aktien schwankt der Markt selbst stärker als die Währung; die laufenden Kosten der Absicherung verschlechtern das Ergebnis dann über lange Zeiträume eher.',
    },
    {
      question:
        'Ein europäischer Konzern macht drei Viertel seines Umsatzes in Dollar. Was folgt daraus für die Währungsaufteilung deines Depots?',
      options: [
        'Nichts – als europäische Aktie ist die Position eine Euro-Position',
        'Wirtschaftlich ist es zu drei Vierteln eine Dollarposition; der Sitz ändert daran nichts',
        'Die Position ist währungsneutral, weil der Konzern selbst absichert',
        'Es hängt allein davon ab, an welcher Börse die Aktie gehandelt wird',
      ],
      correctIndex: 1,
      explanation:
        'Die echte Währungsaufteilung folgt der Umsatzwährung, nicht dem Sitzland und nicht der Handelswährung. Deshalb steht sie in keiner Depotübersicht – dort wird die Handelswährung ausgewiesen, also die falsche Größe. Die Übung, sie einmal selbst zu ermitteln, ist die aufschlussreichste zu diesem Thema.',
    },
    {
      question:
        'Worin unterscheiden sich Schwellenländeranleihen in Lokalwährung von solchen in Hartwährung?',
      options: [
        'In Lokalwährung trägst du das Währungsrisiko; in Hartwährung trägt es der Emittent, was sein Ausfallrisiko erhöht',
        'Hartwährungsanleihen sind grundsätzlich risikofrei',
        'Lokalwährungsanleihen sind steuerlich begünstigt',
        'Es gibt keinen wirtschaftlichen Unterschied, nur einen in der Notierung',
      ],
      correctIndex: 0,
      explanation:
        'Das Risiko verschwindet nicht, es wechselt die Seite. Bei Lokalwährungsanleihen liegt es beim Anleger und wird über höhere Kupons vergütet. Bei Hartwährungsanleihen muss der Emittent in einer Währung zahlen, die er nicht selbst herstellt – genau die Konstellation, an der Staaten in Zahlungsschwierigkeiten geraten.',
    },
  ],

  'waehrungen-wechselkurse:profi': [
    {
      question: 'Welche der Paritätsbedingungen gilt praktisch immer und warum?',
      options: [
        'Die Kaufkraftparität, weil Güterpreise sich angleichen',
        'Die ungedeckte Zinsparität, weil sonst freie Gewinne möglich wären',
        'Die gedeckte Zinsparität – sie ist eine Arbitragebedingung, keine Verhaltensannahme',
        'Alle drei gelten gleichermaßen, nur über verschiedene Zeiträume',
      ],
      correctIndex: 2,
      explanation:
        'Der Terminkurs muss der Zinsdifferenz entsprechen, sonst ließe sich risikolos Geld verdienen – das ist keine Theorie über Verhalten, sondern Arbitrage. Größere Abweichungen traten nach 2008 auf und wurden zum Indikator für Stress im Bankensystem. Die Kaufkraftparität wirkt nur über Jahrzehnte, die ungedeckte Zinsparität gar nicht.',
    },
    {
      question: 'Worauf beruht der Carry-Trade?',
      options: [
        'Darauf, dass Hochzinswährungen im Durchschnitt nicht so abwerten, wie es die ungedeckte Zinsparität verlangt',
        'Darauf, dass Terminkurse künftige Kassakurse zuverlässig vorhersagen',
        'Auf Kursunterschieden zwischen verschiedenen Handelsplätzen',
        'Auf Notenbankinterventionen zugunsten schwacher Währungen',
      ],
      correctIndex: 0,
      explanation:
        'In einer Niedrigzinswährung aufnehmen, in einer Hochzinswährung anlegen, die Differenz vereinnahmen. Das funktioniert über Monate und Jahre und bricht dann abrupt zusammen – dasselbe Ertragsprofil wie beim Verkauf von Volatilität. Das ist zugleich die beste Erklärung: Die Zinsdifferenz ist keine Anomalie, sondern die Vergütung eines Risikos.',
    },
    {
      question: 'Wie wirksam sind Notenbankinterventionen am Devisenmarkt?',
      options: [
        'Sehr wirksam, weil Notenbanken unbegrenzte Mittel haben',
        'Gegen einen anhaltenden Trend selten dauerhaft – Reserven sind endlich, der Markt ist es nicht',
        'Wirkungslos, weil der Markt zu groß ist',
        'Nur wirksam bei fest gebundenen Wechselkursen',
      ],
      correctIndex: 1,
      explanation:
        'Die Devisenreserven eines Landes sind begrenzt, der Markt ist es nicht – der tägliche Umsatz übersteigt den aller Aktienmärkte zusammen um ein Vielfaches. Wirksamer sind koordinierte Interventionen mehrerer Notenbanken und solche, die eine ohnehin drehende Entwicklung verstärken.',
    },
    {
      question:
        'Was ist die praktisch wirksamste Form der Währungsabsicherung für einen Privatanleger?',
      options: [
        'Ein Fremdwährungskonto zum Ausgleich der Depotpositionen',
        'Regelmäßiges Umschichten je nach Wechselkursniveau',
        'Ausschließlich abgesicherte Anteilsklassen zu verwenden',
        'In der eigenen Verbrauchswährung zu planen und die Fremdwährungsquote danach zu bemessen',
      ],
      correctIndex: 3,
      explanation:
        'Wer seinen Ruhestand in Euro verbringt, sollte seine Verpflichtungen in Euro rechnen. Die Quote folgt dann aus dieser Planung – nicht aus einer Einschätzung darüber, wohin der Dollar läuft. Diese Einschätzung hat noch niemand verlässlich hinbekommen; der Devisenmarkt ist der Ort, an dem die meisten Prognosen scheitern.',
    },
  ],

  // ------------------------------------------------------------ Bitcoin & Krypto
  'bitcoin-krypto:beginner': [
    {
      question: 'Woraus ergibt sich die Obergrenze von 21 Millionen Bitcoin?',
      options: [
        'Aus einer Vereinbarung der größten Mining-Betreiber',
        'Aus der Summe der Blockbelohnungen, die sich alle 210.000 Blöcke halbieren',
        'Aus der begrenzten Rechenkapazität des Netzes',
        'Aus einer Obergrenze, die jederzeit per Mehrheit geändert werden kann',
      ],
      correctIndex: 1,
      explanation:
        'Die Zahl ist kein Beschluss, sondern die Summe einer geometrischen Reihe: 50 Coins je Block, alle 210.000 Blöcke halbiert. Die Reihe konvergiert gegen 21 Millionen, und schon nach sechs Halbierungsstufen sind über 98 Prozent davon erzeugt.',
    },
    {
      question: 'Folgt aus der begrenzten Menge, dass der Preis steigen muss?',
      options: [
        'Ja, Knappheit erzeugt zwangsläufig Wert',
        'Ja, sobald die Gesamtmenge erreicht ist',
        'Nein – Knappheit ist nur die Voraussetzung dafür, dass Nachfrage sich im Preis niederschlägt',
        'Nein, weil die Menge jederzeit erhöht werden kann',
      ],
      correctIndex: 2,
      explanation:
        'Seltene Dinge ohne Nachfrage sind wertlos. Die Mengenbegrenzung sorgt dafür, dass zusätzliche Nachfrage nicht durch zusätzliches Angebot aufgefangen wird – mehr nicht. Ein Preis entsteht daraus erst, wenn jemand kaufen will.',
    },
    {
      question: 'Was bedeutet „Not your keys, not your coins“?',
      options: [
        'Dass Coins ohne Wallet-Software nicht übertragbar sind',
        'Dass ein Konto bei einer Plattform nur eine Forderung gegen ein Unternehmen ist, keine Verfügung über den Registereintrag',
        'Dass jede Adresse mehrere Schlüssel benötigt',
        'Dass Coins ohne Registrierung bei einer Behörde nicht anerkannt werden',
      ],
      correctIndex: 1,
      explanation:
        'Liegen die Coins bei einer Plattform, gehören sie dir nur nach deren Buchführung. Bei der Insolvenz mehrerer großer Plattformen standen Kunden als gewöhnliche Gläubiger da. Die Gegenseite ist ebenso hart: Ein verlorener privater Schlüssel bedeutet endgültigen Verlust, ohne jede Wiederherstellung.',
    },
    {
      question:
        'Welche Regel folgt aus dem Fehlen eines Bewertungsankers und den historischen Rückgängen?',
      options: [
        'Nur Beträge einsetzen, deren vollständiger Verlust die Finanzplanung nicht berührt',
        'Immer mindestens zehn Prozent des Depots investieren, um die Streuung zu erhöhen',
        'Nur nach starken Rückgängen kaufen',
        'Ausschließlich über regulierte Anbieter investieren, dann besteht kein Verlustrisiko',
      ],
      correctIndex: 0,
      explanation:
        'Es gibt keine Zahlungsströme, gegen die sich ein Preis prüfen ließe, und Rückgänge von über 70 Prozent sind mehrfach eingetreten. Daraus folgt die Größe der Position, nicht ein Verzicht. Vorher stehen Notgroschen und die Tilgung teurer Schulden – beides bringt eine sichere Rendite.',
    },
  ],

  'bitcoin-krypto:fortgeschritten': [
    {
      question: 'Warum gibt es in Europa keine echten Krypto-ETFs?',
      options: [
        'Weil Kryptowerte in der EU nicht handelbar sind',
        'Weil die Aufsicht sie ausdrücklich untersagt hat',
        'Weil ein Fonds nach europäischen Regeln gestreut sein muss – ein Produkt auf einen einzigen Wert erfüllt das nicht',
        'Weil die Verwahrung durch eine Depotbank technisch unmöglich ist',
      ],
      correctIndex: 2,
      explanation:
        'Die europäischen Produkte sind ETPs, also Schuldverschreibungen, meist mit Coins besichert. Die Besicherung mildert das Emittentenrisiko, beseitigt es aber nicht. Der Unterschied zum Sondervermögen eines echten Fonds ist rechtlich erheblich – und die Ähnlichkeit der Kürzel führt in die Irre.',
    },
    {
      question: 'Worauf kommt es bei einem mit Währungsreserven gedeckten Stablecoin an?',
      options: [
        'Auf die Prüfbarkeit der Reserven – wer sie bestätigt, wie oft und mit welcher Tiefe',
        'Auf die Zahl der Handelsplätze, an denen er notiert',
        'Auf die Höhe der Verzinsung, die er ausschüttet',
        'Auf die Zahl der Nutzer im Netzwerk',
      ],
      correctIndex: 0,
      explanation:
        'Das Versprechen hängt vollständig an der Deckung, und ein Bestätigungsvermerk ist keine Vollprüfung. Algorithmische Konstruktionen ohne echtes Deckungsvermögen sind 2022 in großem Stil zusammengebrochen – der Mechanismus hielt der ersten ernsten Belastung nicht stand.',
    },
    {
      question:
        'Was leistet der europäische Regulierungsrahmen für Kryptowerte – und was nicht?',
      options: [
        'Er sichert Kursverluste bis zu einer festgelegten Grenze ab',
        'Er stellt Anforderungen an die Anbieter, schützt aber nicht den Wert der Anlage selbst',
        'Er macht Kryptowerte zu Sondervermögen',
        'Er garantiert die Rückzahlung bei Insolvenz einer Plattform',
      ],
      correctIndex: 1,
      explanation:
        'Geregelt werden Zulassung, Eigenkapital, Trennung von Kundenbeständen und Informationspflichten – der Umgang mit deinen Werten. Eine Einlagensicherung für Kryptowerte gibt es nicht. „Reguliert“ heißt, dass der Anbieter Regeln unterliegt; es heißt nicht, dass jemand für das Ergebnis einsteht.',
    },
    {
      question: 'Warum sind kleine Coins besonders anfällig für Kursmanipulation?',
      options: [
        'Weil sie technisch schlechter abgesichert sind',
        'Weil sie nicht an regulierten Börsen notieren dürfen',
        'Weil ihre Orderbücher dünn sind – einzelne Aufträge bewegen den Preis erheblich',
        'Weil ihre Gesamtmenge unbegrenzt ist',
      ],
      correctIndex: 2,
      explanation:
        'Die Marktkapitalisierung ist stark konzentriert; die vielen tausend kleinen Coins teilen sich einen geringen Rest. Wo wenig gehandelt wird, genügen kleine Beträge für große Bewegungen – das Muster aus schnellem Anstieg, Werbung und Abverkauf ist regelmäßig dokumentiert.',
    },
  ],

  'bitcoin-krypto:profi': [
    {
      question:
        'Warum lassen sich Discounted-Cashflow-Verfahren auf Kryptowerte nicht anwenden?',
      options: [
        'Weil die Zahlungsströme zu stark schwanken',
        'Weil die nötigen Daten nicht öffentlich sind',
        'Weil der Abzinsungssatz nicht bestimmbar ist',
        'Weil es überhaupt keine künftigen Zahlungen gibt – das Verfahren ist nicht ungenau, sondern nicht anwendbar',
      ],
      correctIndex: 3,
      explanation:
        'Jede Bewertung von Aktien, Anleihen und Immobilien beruht darauf, künftige Zahlungen zu schätzen und abzuzinsen. Fehlen sie vollständig, greift das Verfahren nicht. Das macht die Anlage nicht illegitim – Gold hat dasselbe Problem –, aber es macht jede Aussage der Form „unterbewertet“ gegenstandslos.',
    },
    {
      question:
        'Warum taugt das Argument „der Preis kann nicht unter die Mining-Kosten fallen“ nicht?',
      options: [
        'Weil die Kausalität umgekehrt läuft: Der Aufwand richtet sich nach dem Preis, nicht der Preis nach dem Aufwand',
        'Weil die Mining-Kosten nicht messbar sind',
        'Weil Mining in vielen Ländern subventioniert wird',
        'Weil der Aufwand seit dem letzten Halving gesunken ist',
      ],
      correctIndex: 0,
      explanation:
        'Steigt der Preis, lohnt sich mehr Rechenleistung, und die Schwierigkeit passt sich an. Fällt er, schalten Betreiber ab. Der Aufwand folgt dem Preis – daraus lässt sich keine Untergrenze für den Preis ableiten, so plausibel es zunächst klingt.',
    },
    {
      question: 'Wie hat sich die These bestätigt, Krypto sei unkorreliert zu Aktien?',
      options: [
        'Sie hat sich bestätigt: In Stressphasen stieg Krypto, während Aktien fielen',
        'Sie hat sich nicht bestätigt – in Stressphasen fiel Krypto gemeinsam mit Aktien, und stärker',
        'Sie gilt weiterhin für Bitcoin, nicht aber für andere Coins',
        'Die Korrelation ist dauerhaft negativ',
      ],
      correctIndex: 1,
      explanation:
        'Die Korrelation stieg genau dann, wenn ein Ausgleich gebraucht worden wäre – dasselbe Muster wie bei anderen risikoreichen Anlagen. Dazu kommt die Größenordnung der Schwankung: Schon eine Quote von wenigen Prozent trägt spürbar zur Gesamtschwankung eines Depots bei.',
    },
    {
      question: 'Was macht einen 51-Prozent-Angriff bei großen Netzen unattraktiv?',
      options: [
        'Ein technisches Verbot im Protokoll',
        'Die Überwachung durch Aufsichtsbehörden',
        'Dass die Kosten für Rechenleistung oder Kapitaleinsatz den möglichen Ertrag übersteigen',
        'Dass Transaktionen nach sechs Bestätigungen mathematisch endgültig sind',
      ],
      correctIndex: 2,
      explanation:
        'Die Sicherheit dieser Netze ist ein wirtschaftliches Argument: Ein Angriff muss mehr kosten, als er einbringt. Bei kleineren Netzen ist diese Schwelle mehrfach unterschritten und der Angriff tatsächlich durchgeführt worden. Mathematisch endgültig wird eine Transaktion bei Proof of Work ohnehin nie.',
    },
  ],

  // ---------------------------------------------------------------- Blockchain
  'blockchain:beginner': [
    {
      question:
        'Warum lässt sich eine Transaktion in einem alten Block nicht unbemerkt ändern?',
      options: [
        'Weil alte Blöcke verschlüsselt und nicht lesbar sind',
        'Weil eine Änderung den Hash des Blocks verändert und damit die Verkettung zu allen Folgeblöcken bricht',
        'Weil nur der ursprüngliche Absender Schreibrechte hat',
        'Weil ältere Blöcke nach einer Frist gelöscht werden',
      ],
      correctIndex: 1,
      explanation:
        'Jeder Block enthält den Hash seines Vorgängers. Ändert sich der Inhalt, ändert sich der Hash – und der Folgeblock enthält noch den alten. Die Manipulation wäre sofort sichtbar, und alle anderen Teilnehmer haben ohnehin die richtige Version.',
    },
    {
      question: 'Welches Problem löst eine Blockchain?',
      options: [
        'Sie beschleunigt Zahlungen gegenüber herkömmlichen Systemen',
        'Sie stellt sicher, dass eingetragene Daten inhaltlich richtig sind',
        'Sie macht Transaktionen anonym',
        'Sie klärt ohne zentrale Stelle, wer was besitzt – und schließt doppelte Ausgaben aus',
      ],
      correctIndex: 3,
      explanation:
        'Digitale Dinge lassen sich beliebig kopieren; bisher verhinderte eine zentrale Stelle die doppelte Ausgabe. Eine Blockchain ersetzt das Vertrauen in eine Institution durch Vertrauen in ein nachprüfbares Regelwerk. Das ist die eigentliche Leistung – und sie ist teuer erkauft.',
    },
    {
      question: 'Garantiert eine Blockchain, dass die enthaltenen Daten stimmen?',
      options: [
        'Nein – garantiert wird Unveränderlichkeit, nicht Richtigkeit',
        'Ja, falsche Einträge werden vom Netz automatisch abgelehnt',
        'Ja, sofern mehr als die Hälfte der Teilnehmer sie bestätigt',
        'Nur bei Verwendung von Smart Contracts',
      ],
      correctIndex: 0,
      explanation:
        'Wer einen falschen Wert einträgt, hat ihn danach unveränderlich falsch eingetragen. Das Netz prüft die Einhaltung der Regeln, nicht den Wahrheitsgehalt. Diese Unterscheidung ist der Grund, warum viele Anwendungsideen an der Schnittstelle zur realen Welt scheitern.',
    },
    {
      question:
        'Wann ist eine gewöhnliche Datenbank die bessere Wahl als eine Blockchain?',
      options: [
        'Wenn die Datenmenge klein ist',
        'Wenn keine Zahlungen abgewickelt werden',
        'Immer, wenn es zulässig ist, dass eine bekannte Stelle das Register führt',
        'Wenn die Daten öffentlich einsehbar sein sollen',
      ],
      correctIndex: 2,
      explanation:
        'Konsens unter vielen Teilnehmern kostet Zeit und Kapazität; eine Datenbank ist um Größenordnungen schneller und billiger. Der Aufwand lohnt nur, wenn niemand die zentrale Stelle sein darf oder kann. „Warum keine Datenbank?“ ist die Frage, an der die meisten Projekte scheitern.',
    },
  ],

  'blockchain:fortgeschritten': [
    {
      question:
        'Worin unterscheiden sich Proof of Work und Proof of Stake bei der Sanktion?',
      options: [
        'Beide sanktionieren identisch über den Ausschluss aus dem Netz',
        'Bei Proof of Work verliert ein Angreifer nur Betriebskosten; bei Proof of Stake wird das hinterlegte Kapital eingezogen',
        'Proof of Stake sieht keine Sanktion vor',
        'Bei Proof of Work wird die Hardware unbrauchbar gemacht',
      ],
      correctIndex: 1,
      explanation:
        'Beide machen Betrug teuer, aber mit verschiedenen Mitteln. Bei Proof of Work behält der Angreifer seine Hardware und verliert nur den Aufwand. Bei Proof of Stake trifft die Sanktion unmittelbar das eingesetzte Kapital – das ist der wesentliche Unterschied im Anreizgefüge.',
    },
    {
      question: 'Was bedeutet Finalität bei Proof of Work?',
      options: [
        'Nach sechs Bestätigungen ist eine Transaktion mathematisch endgültig',
        'Finalität tritt nach 24 Stunden automatisch ein',
        'Eine Transaktion ist nie mathematisch endgültig – sie wird nur immer unwahrscheinlicher rückgängig zu machen',
        'Finalität wird von den Mining-Pools gemeinsam festgestellt',
      ],
      correctIndex: 2,
      explanation:
        'Die üblichen sechs Bestätigungen sind eine Konvention, keine Garantie. Bei Proof of Stake ist echte Finalität dagegen erreichbar, weil ein Rückgängigmachen den Einzug erheblicher Sicherheiten auslösen würde. Praktisch heißt das: Der Wert der Ware bestimmt, wie lange man warten sollte.',
    },
    {
      question: 'Was ist das Oracle-Problem bei Smart Contracts?',
      options: [
        'Dass Verträge nicht mehrere Bedingungen gleichzeitig prüfen können',
        'Dass der Code nach der Veröffentlichung nicht mehr lesbar ist',
        'Dass Verträge nur auf Zahlungen reagieren können, nicht auf Zeitpunkte',
        'Dass Daten von außen jemandem geliefert werden müssen – womit die zentrale Stelle zurückkehrt',
      ],
      correctIndex: 3,
      explanation:
        'Ein Vertrag, der auf einen Kurs, ein Wahlergebnis oder eine Lieferung reagieren soll, braucht diese Information von außerhalb der Kette. Wer sie liefert, muss vertraut werden. Für rein netzinterne Vorgänge gilt das nicht – für fast alles andere schon, und daran scheitern viele Anwendungsideen.',
    },
    {
      question: 'Warum lässt sich der Durchsatz einer Blockchain nicht beliebig erhöhen?',
      options: [
        'Weil größere Blöcke oder kürzere Abstände mehr Bandbreite und Speicher verlangen – und damit weniger Teilnehmer mitmachen können',
        'Weil die Konsensverfahren eine feste Obergrenze vorschreiben',
        'Weil die Kryptografie ab einer bestimmten Datenmenge unsicher wird',
        'Weil Aufsichtsbehörden eine Obergrenze vorgeben',
      ],
      correctIndex: 0,
      explanation:
        'Geschwindigkeit wird immer gegen Dezentralisierung getauscht: Wer mitmachen will, braucht mehr Ressourcen, also können es weniger. Zusatzschichten umgehen das, indem sie Vorgänge auslagern – und führen dabei neue Vertrauensannahmen ein, über die Nutzer selten informiert sind.',
    },
  ],

  'blockchain:profi': [
    {
      question:
        'Welche Annahme des Sicherheitsmodells greift bei einem staatlichen Angreifer möglicherweise nicht?',
      options: [
        'Dass Teilnehmer über ausreichend Bandbreite verfügen',
        'Dass Teilnehmer eigennützig handeln – ein Angreifer, der Verluste in Kauf nimmt, ist nicht vorgesehen',
        'Dass die Kryptografie sicher ist',
        'Dass die Blockzeit konstant bleibt',
      ],
      correctIndex: 1,
      explanation:
        'Das Modell unterstellt, dass Teilnehmer ihren wirtschaftlichen Vorteil verfolgen – deshalb funktioniert das Argument über Angriffskosten. Wer das System schädigen will und dafür zahlt, fällt aus dieser Logik heraus. Bei staatlichen Akteuren ist das keine theoretische Möglichkeit.',
    },
    {
      question: 'Was ist ein Eclipse-Angriff?',
      options: [
        'Ein Angriff, der die Mehrheit der Rechenleistung erfordert',
        'Das Zurückrechnen der Kette aus alten Schlüsseln heraus',
        'Das Abschneiden eines einzelnen Teilnehmers vom ehrlichen Netz, um ihm eine gefälschte Sicht zu liefern',
        'Ein Ausfall aller Knoten in einer geografischen Region',
      ],
      correctIndex: 2,
      explanation:
        'Er kommt ohne Mehrheit aus und richtet sich gegen einen einzelnen Teilnehmer. Damit greift er die Annahme an, dass Nachrichten im Netz verlässlich ankommen – eine der stillen Voraussetzungen, die in der Darstellung meist fehlen.',
    },
    {
      question:
        'Warum entstehen Zentralisierungstendenzen bei Mining-Pools und Staking-Anbietern?',
      options: [
        'Aus Skaleneffekten – gebündelte Ressourcen liefern planbarere Erträge',
        'Aus regulatorischen Vorgaben in der EU',
        'Weil die Protokolle sie ausdrücklich vorsehen',
        'Weil Einzelteilnehmer technisch ausgeschlossen werden',
      ],
      correctIndex: 0,
      explanation:
        'Einzelne Betreiber haben nur bei gebündelter Leistung planbare Erträge, und wer nicht selbst betreiben will, gibt sein Kapital an einen Dienstleister. Beides folgt aus Skaleneffekten, nicht aus Fehlverhalten – es lässt sich abmildern, nicht beseitigen. Das ist der ehrlichste Einwand gegen die Dezentralisierungserzählung.',
    },
    {
      question:
        'Was ist an der Ausnutzung der Transaktionsreihenfolge (MEV) bemerkenswert?',
      options: [
        'Sie ist nur bei privaten Blockchains möglich',
        'Sie erfordert die Kontrolle über die Mehrheit des Netzes',
        'Sie ist technisch nicht nachweisbar',
        'Front-Running ist an regulierten Börsen verboten – hier ist es keine Regelverletzung, sondern eine Systemeigenschaft',
      ],
      correctIndex: 3,
      explanation:
        'Wer einen Block zusammenstellt, entscheidet über Inhalt und Reihenfolge – und kann dieses Recht verkaufen. Ein System, das ohne Vertrauen auskommen sollte, hat damit eine Ertragsquelle geschaffen, die an regulierten Märkten verfolgt wird. Sandwich-Angriffe und bevorzugte Liquidationen sind die praktischen Formen.',
    },
  ],
}

/** Fragen zu einer Stufe, falls vorhanden. */
export function getQuizFor(
  topicSlug: string,
  levelId: string
): QuizQuestion[] | undefined {
  return learnQuizzes[`${topicSlug}:${levelId}`]
}
