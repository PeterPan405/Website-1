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
 *    192 Fragen verteilen sich deshalb über alle vier Positionen. Bei neuen
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
}

/** Fragen zu einer Stufe, falls vorhanden. */
export function getQuizFor(
  topicSlug: string,
  levelId: string
): QuizQuestion[] | undefined {
  return learnQuizzes[`${topicSlug}:${levelId}`]
}
