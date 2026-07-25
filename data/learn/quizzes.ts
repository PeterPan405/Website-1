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
 *    verteilen sich die 24 Fragen gleichmäßig auf die vier Positionen. Bei neuen
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
}

/** Fragen zu einer Stufe, falls vorhanden. */
export function getQuizFor(
  topicSlug: string,
  levelId: string
): QuizQuestion[] | undefined {
  return learnQuizzes[`${topicSlug}:${levelId}`]
}
