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
 *    an derselben Stelle, lässt sich das Quiz ohne Lesen bestehen – aktuell
 *    verteilen sich die 36 Fragen gleichmäßig auf die vier Positionen. Bei neuen
 *    Fragen bitte darauf achten.
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
}

/** Fragen zu einer Stufe, falls vorhanden. */
export function getQuizFor(
  topicSlug: string,
  levelId: string
): QuizQuestion[] | undefined {
  return learnQuizzes[`${topicSlug}:${levelId}`]
}
