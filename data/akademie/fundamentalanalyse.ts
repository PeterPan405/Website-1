/**
 * Der Zweig „Fundamentalanalyse“ der Akademie.
 *
 * ## Zur Haltung dieses Kapitels
 *
 * Anders als bei der technischen Analyse ist hier das Rechenwerk unstrittig:
 * Ein Kurs-Gewinn-Verhältnis ist eine Division, und über das Ergebnis lässt
 * sich nicht streiten. Umstritten ist alles danach – ob ein KGV von 15 günstig
 * ist, hängt von Branche, Zinsniveau, Wachstum und Erwartung ab.
 *
 * Deshalb hat fast jede Lektion denselben Aufbau: erst der Rechenweg, dann
 * die Deutung, dann die Stelle, an der die Kennzahl in die Irre führt. Der
 * dritte Teil ist der wichtigste. Eine Kennzahl, deren Schwächen man nicht
 * kennt, ist gefährlicher als gar keine – weil sie Sicherheit vortäuscht.
 *
 * ## Verweise auf die eigenen Daten
 *
 * Wo eine Kennzahl auf dieser Website tatsächlich steht, sagt der Text das.
 * Die Zahlen dafür kommen aus den Originalmeldungen bei den Aufsichtsbehörden
 * (siehe `scripts/fundamentaldaten-abrufen.ts` und die Quellenseite), nicht
 * aus einem Datenhändler.
 */

import type { Bereich, Lektion } from '@/data/akademie/types'

export const fundamentalanalyse: Bereich = {
  id: 'fundamentalanalyse',
  titel: 'Fundamentalanalyse',
  kurz: 'Was ein Unternehmen verdient, besitzt und schuldet – und wie sich daraus eine Einschätzung bildet.',
  einleitung:
    'Die Fundamentalanalyse fragt nicht, was der Kurs zuletzt getan hat, sondern was hinter ihm steht: Umsatz, Gewinn, Cashflow, Schulden, Wettbewerbsposition. Diese Lektionen erklären, wo diese Zahlen herkommen, wie die gängigen Kennzahlen gerechnet werden – und an welcher Stelle jede von ihnen in die Irre führt.',
  grenzen: [
    'Alle Zahlen beschreiben die Vergangenheit. Ein Jahresabschluss ist bis zur Veröffentlichung Monate alt.',
    'Bilanzierungsregeln lassen Spielräume. Zwei Unternehmen mit gleicher Wirtschaftslage können unterschiedliche Gewinne ausweisen, ohne dass eines davon falsch bilanziert.',
    'Eine günstige Bewertung ist kein Kaufgrund. Es gibt Gründe, warum ein Unternehmen billig ist – manchmal sind sie berechtigt.',
    'Der Markt kann eine Fehlbewertung länger aufrechterhalten, als die meisten sie aussitzen können oder wollen.',
  ],
  reihenfolge: [
    'was-fundamentalanalyse-ist',
    'die-drei-abschluesse',
    'umsatz-und-margen',
    'gewinn-je-aktie',
    'kurs-gewinn-verhaeltnis',
    'kurs-buchwert-verhaeltnis',
    'kurs-umsatz-verhaeltnis',
    'unternehmenswert-und-verschuldung',
    'cashflow',
    'kapitalrenditen',
    'dividende-und-ausschuettung',
    'wachstum-und-innerer-wert',
    'qualitative-analyse',
  ],
}

export const fundamentalanalyseLektionen: Lektion[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: 'was-fundamentalanalyse-ist',
    bereich: 'fundamentalanalyse',
    titel: 'Was Fundamentalanalyse ist',
    kurz: 'Der Unterschied zwischen Preis und Wert – und warum die Fundamentalanalyse nie eine genaue Zahl liefert.',
    kernaussage:
      'Der Preis steht an der Börse. Den Wert muss man schätzen. Die Fundamentalanalyse ist der Versuch, diese Schätzung nachvollziehbar zu machen – nicht, sie genau zu machen.',
    belegart: 'definition',
    dauer: 6,
    stichworte: ['Fundamentalanalyse', 'innerer Wert', 'Bewertung'],
    lernthemen: ['aktie', 'boerse'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Wer eine Aktie kauft, kauft einen Anteil an einem Unternehmen: an seinen Maschinen, Marken und Patenten, an seinen Schulden und an allen künftigen Gewinnen. Die Fundamentalanalyse fragt, was dieser Anteil wert ist – unabhängig davon, was gerade dafür bezahlt wird.',
      },
      {
        type: 'quote',
        text: 'Der Preis ist, was du zahlst. Der Wert ist, was du bekommst.',
        source: 'Warren Buffett',
      },
      { type: 'heading', level: 2, text: 'Zwei Wege zur Antwort' },
      {
        type: 'list',
        items: [
          '**Absolute Bewertung.** Man schätzt die künftigen Zahlungsströme des Unternehmens und rechnet sie auf heute zurück. Ergebnis ist ein Betrag in Euro. Der Weg ist methodisch sauber und hängt vollständig an Annahmen, die niemand kennt.',
          '**Relative Bewertung.** Man vergleicht das Unternehmen über Verhältniszahlen mit anderen – KGV, KBV, EV/EBITDA. Der Weg ist schnell und robust und beantwortet nur die Frage „teurer oder billiger als die anderen“, nicht „teuer oder billig“.',
        ],
      },
      {
        type: 'paragraph',
        text: 'In der Praxis werden beide kombiniert. Die relativen Kennzahlen grenzen ein, die absolute Rechnung prüft, ob die eingepreisten Erwartungen plausibel sind.',
      },
      { type: 'heading', level: 2, text: 'Wo die Zahlen herkommen' },
      {
        type: 'paragraph',
        text: 'Börsennotierte Unternehmen sind verpflichtet, regelmäßig zu berichten. In den USA laufen diese Meldungen über die Börsenaufsicht SEC, in Europa über das einheitliche Meldeformat ESEF. Diese Originalmeldungen sind die Quelle – nicht die aufbereiteten Zahlen eines Finanzportals, bei denen selten dabeisteht, wie sie zustande kamen.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Auf dieser Website',
        items: [
          'Die Kennzahlen auf den Aktienseiten kommen aus genau diesen Meldungen: SEC für die USA, ESEF für Europa, die offenen Daten der Börse Taipeh für Taiwan.',
          'Wo eine Zahl fehlt, steht sie nicht da. Geschätzt wird nichts – ein geschätztes Kurs-Gewinn-Verhältnis ist etwas anderes als ein gerechnetes, und danach kauft jemand eine Aktie.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die Grenze der Methode',
        items: [
          'Jede Bewertung ruht auf Annahmen über die Zukunft. Wer eine Wachstumsrate um einen Prozentpunkt ändert, verschiebt das Ergebnis oft um zweistellige Prozentsätze.',
          'Wer mit einer Bewertung auf zwei Nachkommastellen wirbt, verkauft Genauigkeit, die es nicht gibt. Sinnvoll ist eine Spanne mit den Annahmen dazu.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: 'die-drei-abschluesse',
    bereich: 'fundamentalanalyse',
    titel: 'Die drei Abschlüsse: GuV, Bilanz, Kapitalfluss',
    kurz: 'Wie die drei Rechnungen zusammenhängen und welche Frage jede von ihnen beantwortet.',
    kernaussage:
      'Die GuV zeigt, was verdient wurde. Die Bilanz zeigt, was übrig ist. Die Kapitalflussrechnung zeigt, was tatsächlich geflossen ist – und nur die dritte lässt sich schwer schönen.',
    belegart: 'definition',
    dauer: 9,
    stichworte: ['Bilanz', 'GuV', 'Kapitalflussrechnung', 'Jahresabschluss'],
    setztVoraus: ['was-fundamentalanalyse-ist'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Ein Geschäftsbericht enthält drei Rechnungen. Sie beschreiben dasselbe Unternehmen aus drei Blickwinkeln, und erst zusammen ergeben sie ein Bild.',
      },
      {
        type: 'table',
        caption: 'Die drei Rechnungen im Überblick.',
        head: ['Rechnung', 'Beantwortet', 'Zeitbezug'],
        rows: [
          [
            'Gewinn- und Verlustrechnung',
            'Was wurde in der Periode verdient?',
            'Zeitraum, meist ein Jahr oder Quartal',
          ],
          [
            'Bilanz',
            'Was besitzt und schuldet das Unternehmen?',
            'Stichtag, meist der 31. Dezember',
          ],
          [
            'Kapitalflussrechnung',
            'Wie viel Geld ist tatsächlich geflossen?',
            'Zeitraum, wie die GuV',
          ],
        ],
      },
      { type: 'heading', level: 2, text: 'Die Gewinn- und Verlustrechnung' },
      {
        type: 'paragraph',
        text: 'Sie beginnt beim Umsatz und zieht Stufe für Stufe Kosten ab. Jede Zwischenstufe hat einen eigenen Aussagewert:',
      },
      {
        type: 'list',
        items: [
          '**Umsatz** – was in Rechnung gestellt wurde.',
          '**Bruttoergebnis** – Umsatz minus Herstellkosten. Zeigt, wie viel vom Verkaufspreis das Produkt selbst kostet.',
          '**Operatives Ergebnis (EBIT)** – nach Vertrieb, Verwaltung und Forschung. Das Ergebnis des eigentlichen Geschäfts, vor Zinsen und Steuern.',
          '**Ergebnis vor Steuern** – nach Zinsen. Hier schlägt die Finanzierung durch.',
          '**Jahresüberschuss** – nach Steuern. Was den Eigentümern zusteht.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die Bilanz' },
      {
        type: 'formula',
        expression: 'Vermögen = Eigenkapital + Schulden',
        description:
          'Die Grundgleichung jeder Bilanz. Links steht, was das Unternehmen hat; rechts, wem es gehört – den Eigentümern oder den Gläubigern. Beide Seiten sind zwangsläufig gleich groß, daher „Bilanz“ von der Waage.',
      },
      {
        type: 'paragraph',
        text: 'Das **Eigenkapital** ist die Differenz: Vermögen minus Schulden. Es ist der rechnerische Wert dessen, was den Aktionären gehört – und die Grundlage für das Kurs-Buchwert-Verhältnis in einer späteren Lektion.',
      },
      { type: 'heading', level: 2, text: 'Die Kapitalflussrechnung' },
      {
        type: 'paragraph',
        text: 'Sie ist die jüngste der drei und die aufschlussreichste. Grund: Gewinn ist eine Rechengröße, Geld nicht. Ein Unternehmen kann Gewinn ausweisen und gleichzeitig zahlungsunfähig werden – nämlich dann, wenn die Rechnungen zwar geschrieben, aber nicht bezahlt wurden.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Woran sich das Auseinanderlaufen zeigt',
        items: [
          'Steigt der Gewinn über Jahre, der operative Cashflow aber nicht, ist das ein Warnzeichen. Irgendwo entsteht ein Gewinn, der nicht zu Geld wird.',
          'Häufigste Ursache sind wachsende Forderungen: Es wurde geliefert und gebucht, aber nicht bezahlt.',
          'Die zweithäufigste sind wachsende Lagerbestände: Es wurde produziert, aber nicht verkauft.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum Cashflow schwerer zu schönen ist',
        items: [
          'Beim Gewinn gibt es Ermessensspielräume: Nutzungsdauern, Rückstellungen, der Zeitpunkt der Umsatzrealisierung.',
          'Ob Geld auf dem Konto eingegangen ist, ist keine Ermessensfrage. Deshalb sehen viele Analysten zuerst auf die Kapitalflussrechnung.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    slug: 'umsatz-und-margen',
    bereich: 'fundamentalanalyse',
    titel: 'Umsatz und Margen',
    kurz: 'Warum Wachstum allein nichts sagt und was die verschiedenen Margen über das Geschäftsmodell verraten.',
    kernaussage:
      'Umsatz ist Größe, Marge ist Qualität. Ein Unternehmen, das mit steigendem Umsatz sinkende Margen zeigt, kauft sich sein Wachstum.',
    belegart: 'definition',
    dauer: 7,
    stichworte: ['Umsatz', 'Marge', 'Bruttomarge', 'operative Marge', 'EBIT'],
    setztVoraus: ['die-drei-abschluesse'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Umsatz ist die erste Zeile jeder Gewinn- und Verlustrechnung und die am häufigsten zitierte Zahl über ein Unternehmen. Für sich allein sagt sie fast nichts: Ein Händler mit einer Milliarde Umsatz und ein Softwarehaus mit derselben Milliarde sind grundverschiedene Geschäfte.',
      },
      { type: 'heading', level: 2, text: 'Die Margen' },
      {
        type: 'formula',
        expression:
          'Bruttomarge = Bruttoergebnis ÷ Umsatz\nOperative Marge = EBIT ÷ Umsatz\nNettomarge = Jahresüberschuss ÷ Umsatz',
        description:
          'Drei Stufen derselben Frage: Wie viel von einem Euro Umsatz bleibt übrig – nach den Herstellkosten, nach allen Betriebskosten, nach Zinsen und Steuern.',
      },
      {
        type: 'table',
        caption: 'Größenordnungen, die je nach Geschäftsmodell üblich sind.',
        head: ['Geschäft', 'Bruttomarge', 'Warum'],
        rows: [
          ['Software', 'sehr hoch', 'Eine weitere Kopie kostet fast nichts'],
          ['Markenartikel', 'hoch', 'Der Preis trägt die Marke, nicht nur das Produkt'],
          ['Industrie', 'mittel', 'Material und Fertigung schlagen durch'],
          [
            'Lebensmittelhandel',
            'niedrig',
            'Der Wettbewerb läuft über den Preis; verdient wird über die Menge',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Margen nur innerhalb einer Branche vergleichen',
        items: [
          'Eine niedrige Marge ist kein Mangel, wenn das Geschäftsmodell auf Umschlag beruht. Ein Discounter mit 3 Prozent Nettomarge kann eine höhere Kapitalrendite haben als ein Markenhersteller mit 15 Prozent.',
          'Aussagekräftig ist der Vergleich mit dem direkten Wettbewerb und mit der eigenen Vergangenheit.',
        ],
      },
      { type: 'heading', level: 2, text: 'Was die Entwicklung verrät' },
      {
        type: 'list',
        items: [
          '**Umsatz steigt, Marge stabil:** Das Geschäft wächst, ohne an Qualität zu verlieren. Der günstigste Fall.',
          '**Umsatz steigt, Marge fällt:** Wachstum wird über Preisnachlässe oder teure Zukäufe erkauft.',
          '**Umsatz stagniert, Marge steigt:** Es wird gespart. Kann Effizienz sein – oder gekürzte Forschung, die in einigen Jahren fehlt.',
          '**Beide fallen:** Das Geschäftsmodell steht unter Druck.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Frage hinter der Marge',
        items: [
          'Eine hohe Marge bedeutet Preissetzungsmacht: Das Unternehmen kann Preise verlangen, die deutlich über den Kosten liegen, ohne die Kunden zu verlieren.',
          'Die entscheidende Anschlussfrage lautet, warum das so ist und wie lange es so bleibt. Diese Frage beantwortet keine Kennzahl – dazu die Lektion zur qualitativen Analyse.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: 'gewinn-je-aktie',
    bereich: 'fundamentalanalyse',
    titel: 'Gewinn je Aktie',
    kurz: 'Warum der Gewinn auf die Aktienzahl bezogen wird, was Verwässerung bedeutet und wo Rückkäufe täuschen.',
    kernaussage:
      'Der Gewinn je Aktie kann steigen, ohne dass das Unternehmen mehr verdient – wenn die Zahl der Aktien sinkt. Beide Zahlen gehören immer zusammen betrachtet.',
    belegart: 'definition',
    dauer: 7,
    stichworte: ['EPS', 'Gewinn je Aktie', 'Verwässerung', 'Aktienrückkauf'],
    setztVoraus: ['die-drei-abschluesse'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Ein Jahresüberschuss von zwei Milliarden Euro sagt nichts darüber, was ein einzelner Anteil wert ist. Dafür wird der Gewinn durch die Zahl der Aktien geteilt – das **Ergebnis je Aktie**, englisch Earnings per Share.',
      },
      {
        type: 'formula',
        expression:
          'EPS = Gewinn der Anteilseigner des Mutterunternehmens ÷ gewichtete durchschnittliche Aktienzahl',
        description:
          'Zwei Feinheiten stecken darin. Erstens zählt nur der Gewinn, der den eigenen Aktionären zusteht – nicht der Anteil von Minderheitsgesellschaftern in Tochterfirmen. Zweitens wird die Aktienzahl über das Jahr gewichtet: Wer im Oktober neue Aktien ausgibt, hatte sie nicht das ganze Jahr.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Ein Detail mit Folgen',
        items: [
          'Der Unterschied zwischen „Gewinn gesamt“ und „Gewinn der eigenen Aktionäre“ ist bei Konzernen mit Beteiligungen erheblich – bei manchen zweistellig prozentual.',
          'Wer die falsche Größe nimmt, rechnet aus derselben Meldung eine um zwanzig Prozent abweichende Aktienzahl heraus. Genau dieser Fehler ist beim Aufbau der Kennzahlen dieser Website vorgekommen und wurde beim Nachrechnen einzelner Werte gefunden.',
        ],
      },
      { type: 'heading', level: 2, text: 'Unverwässert und verwässert' },
      {
        type: 'paragraph',
        text: 'Viele Unternehmen haben Rechte ausgegeben, aus denen später neue Aktien entstehen können: Optionen für Mitarbeiter, Wandelanleihen. Das **verwässerte** Ergebnis je Aktie rechnet so, als wären all diese Rechte bereits ausgeübt. Es ist die vorsichtigere Zahl und deshalb die aussagekräftigere.',
      },
      { type: 'heading', level: 2, text: 'Aktienrückkäufe' },
      {
        type: 'paragraph',
        text: 'Kauft ein Unternehmen eigene Aktien zurück und zieht sie ein, sinkt der Nenner. Derselbe Gewinn verteilt sich auf weniger Anteile, das EPS steigt – ohne dass operativ irgendetwas besser geworden wäre.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was dabei zu prüfen ist',
        items: [
          'Steigt das EPS, während der absolute Gewinn stagniert, kommt das Wachstum vollständig aus dem Rückkauf.',
          'Rückkäufe sind nicht per se schlecht: Sie sind eine Ausschüttung an die Aktionäre, oft steuerlich günstiger als eine Dividende. Fragwürdig werden sie, wenn sie auf Kredit erfolgen oder bei hohen Kursen.',
          'Manche Rückkäufe gleichen nur die Aktien aus, die zuvor als Vergütung ausgegeben wurden. Dann sinkt die Aktienzahl gar nicht – das Geld fließt faktisch an die Belegschaft.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    slug: 'kurs-gewinn-verhaeltnis',
    bereich: 'fundamentalanalyse',
    titel: 'Das Kurs-Gewinn-Verhältnis',
    kurz: 'Die bekannteste Kennzahl: Rechenweg, Deutung als Amortisationsdauer und die vier Fallstricke.',
    kernaussage:
      'Ein KGV von 15 heißt: Beim heutigen Gewinn dauert es 15 Jahre, bis der Kaufpreis verdient ist. Ob das viel ist, hängt davon ab, was in diesen 15 Jahren passiert.',
    belegart: 'definition',
    dauer: 9,
    stichworte: ['KGV', 'P/E', 'Kurs-Gewinn-Verhältnis', 'Bewertung'],
    setztVoraus: ['gewinn-je-aktie'],
    inhalt: [
      {
        type: 'formula',
        expression: 'KGV = Kurs je Aktie ÷ Gewinn je Aktie',
        description:
          'Kostet eine Aktie 60 Euro und verdient das Unternehmen 4 Euro je Aktie, beträgt das KGV 15. Gleichbedeutend: Der gesamte Börsenwert geteilt durch den gesamten Jahresgewinn.',
      },
      { type: 'heading', level: 2, text: 'Zwei Lesarten' },
      {
        type: 'list',
        items: [
          '**Als Dauer.** Bei gleichbleibendem Gewinn braucht das Unternehmen 15 Jahre, um den Kaufpreis zu erwirtschaften.',
          '**Als Rendite.** Der Kehrwert ist die **Gewinnrendite**: 1 ÷ 15 = 6,7 Prozent. Diese Zahl lässt sich mit einer Anleiherendite vergleichen – und genau das macht das KGV zinsabhängig.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Warum steigende Zinsen die KGVs drücken',
        items: [
          'Bringt eine sichere Staatsanleihe 1 Prozent, ist eine Gewinnrendite von 4 Prozent attraktiv – ein KGV von 25 ist vertretbar.',
          'Bringt dieselbe Anleihe 4 Prozent, muss die Aktie mehr bieten, um das höhere Risiko zu rechtfertigen. Die vertretbaren KGVs sinken, ohne dass sich an den Unternehmen etwas geändert hat.',
          'Das erklärt einen großen Teil der Bewegung ganzer Märkte in Zinswendejahren.',
        ],
      },
      { type: 'heading', level: 2, text: 'Welcher Gewinn' },
      {
        type: 'table',
        caption: 'Drei gebräuchliche Varianten – mit sehr unterschiedlichen Ergebnissen.',
        head: ['Variante', 'Gewinn aus', 'Eigenschaft'],
        rows: [
          [
            'Trailing',
            'den letzten vier Quartalen',
            'Tatsächlich berichtet, aber rückwärtsgewandt',
          ],
          [
            'Forward',
            'der Schätzung für das kommende Jahr',
            'Zukunftsbezogen, aber eine Schätzung von Analysten',
          ],
          [
            'Shiller-KGV (CAPE)',
            'dem inflationsbereinigten Zehnjahresdurchschnitt',
            'Glättet Konjunkturzyklen, reagiert träge',
          ],
        ],
      },
      {
        type: 'paragraph',
        text: 'Zwischen Trailing- und Forward-KGV liegen bei einem wachsenden Unternehmen leicht mehrere Punkte. Wer zwei Aktien vergleicht, muss dieselbe Variante verwenden – sonst vergleicht er die Methode, nicht die Unternehmen.',
      },
      { type: 'heading', level: 2, text: 'Die vier Fallstricke' },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Verlust.** Ist der Gewinn negativ, ist das KGV sinnlos. Es wird üblicherweise gar nicht ausgewiesen – nicht, weil die Aktie teuer wäre, sondern weil die Rechnung nicht definiert ist.',
          '**Zyklische Unternehmen.** Bei Rohstoff-, Auto- und Chemiewerten ist das KGV am Gipfel des Zyklus am niedrigsten – dann nämlich, wenn die Gewinne kurz vor dem Einbruch stehen. Ein niedriges KGV ist dort eher Warnung als Einladung.',
          '**Einmaleffekte.** Ein Immobilienverkauf hebt den Gewinn einmalig und drückt das KGV optisch. Im Folgejahr fällt beides zurück.',
          '**Kein Vergleich über Branchen.** Ein Softwarehaus mit KGV 30 und ein Energieversorger mit KGV 12 sind nicht teuer und billig, sondern unterschiedlich schnell wachsend und unterschiedlich kapitalintensiv.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Auf dieser Website',
        items: [
          'Wo für eine Aktie ein KGV steht, wurde es aus dem berichteten Gewinn und der berichteten Aktienzahl gerechnet – Trailing, aus den Originalmeldungen.',
          'Fehlt eine der beiden Größen, fehlt die Kennzahl. Sie wird nicht aus einer Schätzung ergänzt.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: 'kurs-buchwert-verhaeltnis',
    bereich: 'fundamentalanalyse',
    titel: 'Das Kurs-Buchwert-Verhältnis',
    kurz: 'Was der Buchwert ist, warum er bei Banken zählt und bei Softwarehäusern kaum etwas aussagt.',
    kernaussage:
      'Der Buchwert erfasst, was gekauft und bezahlt wurde. Was ein Unternehmen selbst aufgebaut hat – Marke, Software, Kundenstamm –, steht meist nicht in der Bilanz.',
    belegart: 'definition',
    dauer: 7,
    stichworte: ['KBV', 'Buchwert', 'Eigenkapital', 'P/B'],
    setztVoraus: ['die-drei-abschluesse'],
    inhalt: [
      {
        type: 'formula',
        expression: 'KBV = Kurs je Aktie ÷ (Eigenkapital ÷ Aktienzahl)',
        description:
          'Der Buchwert je Aktie ist das bilanzielle Eigenkapital geteilt durch die Aktienzahl. Ein KBV von 1 bedeutet, dass der Börsenwert genau dem bilanziellen Eigenkapital entspricht.',
      },
      { type: 'heading', level: 2, text: 'Was der Buchwert bedeutet' },
      {
        type: 'paragraph',
        text: 'Rechnerisch ist er das, was nach Verkauf aller Vermögenswerte zu Buchwerten und Tilgung aller Schulden übrig bliebe. Praktisch ist das eine Fiktion: Im Notverkauf bringen Maschinen selten ihren Buchwert, und Grundstücke stehen oft mit historischen Anschaffungskosten in den Büchern.',
      },
      { type: 'heading', level: 2, text: 'Wo die Kennzahl trägt' },
      {
        type: 'table',
        caption: 'Aussagekraft nach Geschäftsmodell.',
        head: ['Branche', 'Aussagekraft', 'Grund'],
        rows: [
          [
            'Banken und Versicherer',
            'hoch',
            'Das Vermögen besteht aus Finanzwerten, die laufend neu bewertet werden',
          ],
          ['Immobilien', 'hoch', 'Der Bestand wird regelmäßig zum Zeitwert angesetzt'],
          [
            'Industrie',
            'mittel',
            'Maschinen und Gebäude stehen zu abgeschriebenen Anschaffungskosten',
          ],
          [
            'Software und Marken',
            'gering',
            'Der Wert steckt in Dingen, die nicht bilanziert werden dürfen',
          ],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die Lücke in der Bilanz',
        items: [
          'Selbst geschaffene Marken, Software und Kundenbeziehungen dürfen nach den meisten Regelwerken nicht aktiviert werden. Die Entwicklungskosten laufen als Aufwand durch die GuV und tauchen nie als Vermögen auf.',
          'Gekaufte Marken dagegen erscheinen als Geschäfts- oder Firmenwert. Zwei Unternehmen mit gleichem Portfolio haben deshalb völlig verschiedene Buchwerte – je nachdem, ob sie ihre Marken aufgebaut oder erworben haben.',
          'Deshalb haben erfolgreiche Softwarehäuser regelmäßig KBVs im zweistelligen Bereich. Das ist kein Bewertungsexzess, sondern eine Eigenschaft der Bilanzregeln.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Ein KBV unter 1',
        items: [
          'Der Markt bewertet das Unternehmen unter dem bilanziellen Eigenkapital. Das kann eine Unterbewertung sein – oder die Erwartung, dass die Buchwerte zu hoch angesetzt sind und Abschreibungen bevorstehen.',
          'Bei Banken war das nach der Finanzkrise über Jahre der Normalfall. Der Markt bezweifelte schlicht die Werthaltigkeit der Kreditbücher.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: 'kurs-umsatz-verhaeltnis',
    bereich: 'fundamentalanalyse',
    titel: 'Das Kurs-Umsatz-Verhältnis',
    kurz: 'Die Kennzahl für Unternehmen ohne Gewinn – und warum sie das Wichtigste ausblendet.',
    kernaussage:
      'Das KUV funktioniert auch bei Verlusten, weil Umsatz nie negativ wird. Genau deshalb sagt es nichts darüber, ob mit dem Umsatz Geld verdient wird.',
    belegart: 'definition',
    dauer: 5,
    stichworte: ['KUV', 'P/S', 'Kurs-Umsatz-Verhältnis'],
    setztVoraus: ['umsatz-und-margen', 'kurs-gewinn-verhaeltnis'],
    inhalt: [
      {
        type: 'formula',
        expression: 'KUV = Börsenwert ÷ Jahresumsatz',
        description:
          'Ein KUV von 2 bedeutet, dass für jeden Euro Jahresumsatz zwei Euro Börsenwert bezahlt werden.',
      },
      {
        type: 'paragraph',
        text: 'Der Vorteil liegt auf der Hand: Umsatz gibt es auch bei Verlusten. Junge Unternehmen, zyklische Werte im Tief und Firmen in der Sanierung lassen sich damit bewerten, wenn das KGV keine Zahl liefert.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die eingebaute Blindheit',
        items: [
          'Umsatz ist kein Gewinn. Ein Unternehmen kann seinen Umsatz beliebig steigern, indem es unter Kosten verkauft – das KUV sinkt dabei sogar.',
          'Ein Vergleich zwischen Branchen ist wertlos: Ein Softwarehaus mit 80 Prozent Bruttomarge und ein Händler mit 5 Prozent können nicht dieselbe Umsatzbewertung verdienen.',
          'Sinnvoll ist das KUV nur zusammen mit der Marge. Genau diese Verbindung stellt niemand her, der nur die eine Zahl zitiert.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Wozu es hier zusätzlich dient',
        items: [
          'Auf dieser Website prüft eine automatische Plausibilitätskontrolle unter anderem das KUV jeder Aktie. Liegt es außerhalb einer weiten, aber endlichen Spanne, bricht der Bau ab.',
          'Der Grund ist nicht die Bewertung, sondern die Datenqualität: Ein absurdes KUV heißt fast immer, dass eine Quelle Umsatz oder Aktienzahl in einer anderen Einheit geliefert hat.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 8 */
  {
    slug: 'unternehmenswert-und-verschuldung',
    bereich: 'fundamentalanalyse',
    titel: 'Unternehmenswert und Verschuldung',
    kurz: 'Warum der Börsenwert nicht der Preis des Unternehmens ist – und was EV/EBITDA besser macht als das KGV.',
    kernaussage:
      'Wer ein Unternehmen kauft, übernimmt seine Schulden. Der Börsenwert allein blendet das aus – der Unternehmenswert nicht.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['Enterprise Value', 'EV/EBITDA', 'Nettoverschuldung', 'EBITDA'],
    setztVoraus: ['kurs-gewinn-verhaeltnis', 'die-drei-abschluesse'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Zwei Unternehmen haben denselben Börsenwert und denselben Gewinn, also dasselbe KGV. Das eine hat zwei Milliarden Schulden, das andere zwei Milliarden auf dem Konto. Sie sind offensichtlich nicht gleich teuer – aber das KGV sieht das nicht.',
      },
      {
        type: 'formula',
        expression:
          'Unternehmenswert = Börsenwert + Nettoverschuldung\nNettoverschuldung = zinstragende Schulden − liquide Mittel',
        description:
          'Der Enterprise Value ist das, was ein Käufer aufwenden müsste: den Aktionären ihre Anteile abkaufen und die Schulden übernehmen. Vorhandene Barmittel verringern diesen Betrag, weil sie mit übergehen.',
      },
      { type: 'heading', level: 2, text: 'EBITDA' },
      {
        type: 'paragraph',
        text: 'Zum Unternehmenswert gehört eine Ergebnisgröße, die ebenfalls vor der Finanzierung ansetzt. Das ist das **EBITDA** – das Ergebnis vor Zinsen, Steuern und Abschreibungen.',
      },
      {
        type: 'formula',
        expression: 'EV/EBITDA = Unternehmenswert ÷ EBITDA',
        description:
          'Beide Größen beziehen sich auf das gesamte Unternehmen, unabhängig davon, wie es finanziert ist. Deshalb sind Unternehmen mit unterschiedlicher Verschuldung darüber vergleichbar – anders als beim KGV.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Was EBITDA verschweigt',
        items: [
          'Abschreibungen sind keine Erfindung der Buchhaltung. Eine Maschine verschleißt tatsächlich und muss ersetzt werden. Wer sie herausrechnet, tut so, als koste das Anlagevermögen nichts.',
          'Bei kapitalintensiven Geschäften – Telekom, Industrie, Netzbetrieb – ist der Unterschied zwischen EBITDA und dem tatsächlichen Ergebnis erheblich.',
          'Charlie Munger nannte EBITDA sinngemäß „Gewinn vor den Kosten, die wir nicht zeigen wollen“. Die Zuspitzung trifft den Punkt.',
        ],
      },
      { type: 'heading', level: 2, text: 'Verschuldung einordnen' },
      {
        type: 'formula',
        expression: 'Verschuldungsgrad = Nettoverschuldung ÷ EBITDA',
        description:
          'Wie viele Jahresergebnisse nötig wären, um die Nettoschulden zu tilgen. Werte bis etwa 2 gelten in den meisten Branchen als unauffällig, über 4 als hoch – mit großen Unterschieden je nach Geschäftsmodell und Zinsniveau.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Warum Schulden nicht per se schlecht sind',
        items: [
          'Fremdkapital ist meist billiger als Eigenkapital, und Zinsen mindern die Steuerlast. Ein Unternehmen ganz ohne Schulden verschenkt diesen Effekt.',
          'Gefährlich wird Verschuldung, wenn das Ergebnis schwankt: Zinsen sind fällig, auch wenn kein Gewinn anfällt. Deshalb vertragen stabile Geschäfte mehr Schulden als zyklische.',
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ 9 */
  {
    slug: 'cashflow',
    bereich: 'fundamentalanalyse',
    titel: 'Cashflow und freier Cashflow',
    kurz: 'Die drei Bereiche der Kapitalflussrechnung und warum der freie Cashflow die ehrlichste Zahl im Bericht ist.',
    kernaussage:
      'Der freie Cashflow ist das Geld, das nach allen Investitionen übrig bleibt. Nur daraus lassen sich Dividenden, Rückkäufe und Tilgungen dauerhaft bezahlen.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['Cashflow', 'freier Cashflow', 'Investitionen', 'Working Capital'],
    setztVoraus: ['die-drei-abschluesse'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Die Kapitalflussrechnung teilt alle Zahlungen in drei Bereiche. Wer sie einmal durchliest, weiß mehr über ein Unternehmen als aus dem Gewinn allein.',
      },
      {
        type: 'table',
        caption: 'Die drei Bereiche und was ein Vorzeichen bedeutet.',
        head: ['Bereich', 'Enthält', 'Positiv heißt'],
        rows: [
          [
            'Operativ',
            'Geld aus dem laufenden Geschäft',
            'Das Geschäft trägt sich selbst – der Normalfall bei gesunden Unternehmen',
          ],
          [
            'Investition',
            'Käufe und Verkäufe von Anlagen und Beteiligungen',
            'Es wurde mehr verkauft als investiert – bei wachsenden Unternehmen ungewöhnlich',
          ],
          [
            'Finanzierung',
            'Kredite, Aktienausgaben, Dividenden, Rückkäufe',
            'Es floss Geld zu – über neue Schulden oder neue Aktien',
          ],
        ],
      },
      {
        type: 'formula',
        expression:
          'Freier Cashflow = operativer Cashflow − Investitionen ins Anlagevermögen',
        description:
          'Was übrig bleibt, nachdem das Unternehmen sich selbst instand gehalten und ausgebaut hat. Diese Größe steht für Dividenden, Aktienrückkäufe und Schuldentilgung zur Verfügung.',
      },
      { type: 'heading', level: 2, text: 'Working Capital' },
      {
        type: 'paragraph',
        text: 'Im operativen Cashflow steckt eine Zeile, die oft übersehen wird: die Veränderung des **Nettoumlaufvermögens** – Forderungen plus Lagerbestand minus Lieferantenverbindlichkeiten. Wächst ein Unternehmen, bindet es hier Geld: Es muss produzieren und liefern, bevor es bezahlt wird.',
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Ein Frühwarnzeichen',
        items: [
          'Wachsen die Forderungen deutlich schneller als der Umsatz, wurde entweder an schlechtere Kunden geliefert oder es wurden Zahlungsziele verlängert, um Umsatz zu buchen.',
          'Dasselbe gilt für Lagerbestände: Wachsen sie schneller als der Umsatz, wurde produziert, was sich nicht verkauft.',
          'Beides erscheint im Gewinn zunächst gar nicht – nur im Cashflow.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Auch der Cashflow lässt sich beeinflussen',
        items: [
          'Rechnungen kurz vor dem Stichtag nicht zu bezahlen verbessert den operativen Cashflow – und verschlechtert den des Folgejahres.',
          'Werden Investitionen aufgeschoben, steigt der freie Cashflow, während die Substanz leidet. Das fällt erst Jahre später auf.',
          'Deshalb gilt auch hier: Eine einzelne Periode sagt wenig, die Reihe über fünf Jahre sagt viel.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 10 */
  {
    slug: 'kapitalrenditen',
    bereich: 'fundamentalanalyse',
    titel: 'Kapitalrenditen: ROE, ROCE, ROIC',
    kurz: 'Wie effizient ein Unternehmen mit dem eingesetzten Geld umgeht – und warum eine hohe Eigenkapitalrendite auch von Schulden kommen kann.',
    kernaussage:
      'Die Kapitalrendite ist die Frage, auf die es ankommt: Was macht das Unternehmen aus jedem investierten Euro? Eine hohe Eigenkapitalrendite allein beantwortet sie nicht.',
    belegart: 'definition',
    dauer: 8,
    stichworte: ['ROE', 'ROCE', 'ROIC', 'Eigenkapitalrendite', 'Kapitalrendite'],
    setztVoraus: ['unternehmenswert-und-verschuldung'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Gewinn allein sagt nichts über Qualität. Eine Million Gewinn aus zehn Millionen eingesetztem Kapital ist etwas anderes als eine Million aus hundert. Die Kapitalrenditen setzen das Ergebnis ins Verhältnis zum Einsatz.',
      },
      {
        type: 'formula',
        expression:
          'ROE = Jahresüberschuss ÷ Eigenkapital\nROCE = EBIT ÷ (Eigenkapital + zinstragende Schulden)\nROIC = Ergebnis nach Steuern vor Zinsen ÷ investiertes Kapital',
        description:
          'Drei Varianten mit unterschiedlichem Bezug: Die erste betrachtet nur das Eigenkapital, die beiden anderen das gesamte eingesetzte Kapital einschließlich der Schulden.',
      },
      { type: 'heading', level: 2, text: 'Die Falle der Eigenkapitalrendite' },
      {
        type: 'paragraph',
        text: 'Der ROE lässt sich erhöhen, ohne dass das Geschäft besser wird: Man ersetzt Eigenkapital durch Schulden. Der Nenner schrumpft, der Zähler bleibt fast gleich, die Kennzahl steigt. Dieser **Hebeleffekt** wirkt in beide Richtungen – im schlechten Jahr fällt der Verlust je Euro Eigenkapital ebenso stärker aus.',
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Die Zerlegung nach DuPont',
        items: [
          'ROE = Nettomarge × Kapitalumschlag × Kapitalstruktur.',
          'Damit lässt sich sehen, woher eine hohe Eigenkapitalrendite kommt: aus hohen Margen, aus schnellem Umschlag – oder eben nur aus Verschuldung.',
          'Ein ROE von 25 Prozent aus Marge und Umschlag ist ein anderes Unternehmen als ein ROE von 25 Prozent aus dreifacher Verschuldung.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die eigentliche Frage' },
      {
        type: 'paragraph',
        text: 'Entscheidend ist der Abstand zwischen der Kapitalrendite und den **Kapitalkosten** – dem, was Eigen- und Fremdkapitalgeber für ihr Risiko erwarten. Liegt der ROIC darüber, schafft jeder investierte Euro Wert. Liegt er darunter, vernichtet Wachstum Wert: Das Unternehmen wird größer und weniger wert.',
      },
      {
        type: 'quote',
        text: 'Ein hervorragendes Unternehmen erwirtschaftet über Jahre eine Rendite auf das eingesetzte Kapital, die deutlich über seinen Kapitalkosten liegt. Alles Übrige ist Beiwerk.',
        source: 'Gängige Zusammenfassung des Qualitätsbegriffs in der Fundamentalanalyse',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Zwei Verzerrungen',
        items: [
          'Nach großen Zukäufen steht ein hoher Firmenwert in der Bilanz. Er erhöht das Kapital im Nenner und drückt die Rendite – auch wenn das operative Geschäft unverändert gut ist.',
          'Bei alten, weitgehend abgeschriebenen Anlagen ist es umgekehrt: Der Buchwert ist niedrig, die Rendite sieht hervorragend aus. Beim Ersatz der Anlagen ändert sich das schlagartig.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 11 */
  {
    slug: 'dividende-und-ausschuettung',
    bereich: 'fundamentalanalyse',
    titel: 'Dividendenrendite und Ausschüttungsquote',
    kurz: 'Warum eine hohe Dividendenrendite oft ein Warnzeichen ist und was die Ausschüttungsquote verrät.',
    kernaussage:
      'Die Dividendenrendite steigt, wenn der Kurs fällt. Die höchsten Renditen finden sich deshalb regelmäßig bei den Unternehmen mit den größten Problemen.',
    belegart: 'definition',
    dauer: 7,
    stichworte: ['Dividende', 'Dividendenrendite', 'Ausschüttungsquote', 'Payout Ratio'],
    setztVoraus: ['cashflow'],
    lernthemen: ['aktie'],
    rechner: ['steuerrechner'],
    inhalt: [
      {
        type: 'formula',
        expression:
          'Dividendenrendite = Dividende je Aktie ÷ Kurs je Aktie\nAusschüttungsquote = Dividende je Aktie ÷ Gewinn je Aktie',
        description:
          'Die erste Zahl sagt, was die Ausschüttung bezogen auf den heutigen Kurs bringt. Die zweite sagt, welcher Anteil des Gewinns dafür verwendet wird.',
      },
      { type: 'heading', level: 2, text: 'Der Bruch in der Rendite' },
      {
        type: 'paragraph',
        text: 'Im Nenner steht der Kurs. Halbiert er sich, während die Dividende gleich bleibt, verdoppelt sich die Rendite. Eine Aktie mit 9 Prozent Dividendenrendite ist deshalb selten ein Fund – meist erwartet der Markt, dass die Dividende gekürzt wird.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Der Klassiker: die Dividendenfalle',
        items: [
          'Anleger kaufen wegen der hohen Rendite. Kurz darauf kürzt das Unternehmen die Dividende, weil sie nicht mehr verdient wird. Der Kurs fällt weiter, die Rendite ist weg.',
          'Der Prüfstein ist die Ausschüttungsquote: Liegt sie über 100 Prozent, wird mehr ausgeschüttet als verdient. Das geht aus Rücklagen oder auf Kredit – und nicht lange.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die bessere Prüfung' },
      {
        type: 'paragraph',
        text: 'Aussagekräftiger als die Quote auf den Gewinn ist die Quote auf den **freien Cashflow**. Der Gewinn ist eine Rechengröße, die Dividende wird in echtem Geld gezahlt. Wer über Jahre mehr ausschüttet, als frei erwirtschaftet wird, zehrt von der Substanz.',
      },
      {
        type: 'table',
        caption: 'Grobe Einordnung der Ausschüttungsquote.',
        head: ['Quote', 'Lesart'],
        rows: [
          ['unter 30 %', 'Viel bleibt im Unternehmen – typisch für Wachstumswerte'],
          ['30 bis 60 %', 'Ausgewogen, in den meisten Branchen tragfähig'],
          ['60 bis 90 %', 'Wenig Spielraum für schwächere Jahre'],
          ['über 100 %', 'Nicht verdient. Eine Kürzung ist wahrscheinlich'],
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Dividende ist kein zusätzliches Geld',
        items: [
          'Am Ausschüttungstag fällt der Kurs rechnerisch um den Betrag der Dividende. Das Geld wechselt vom Unternehmen auf das Konto – der Gesamtwert bleibt zunächst gleich.',
          'Steuerlich ist die Ausschüttung sofort zu versteuern, ein Kursgewinn erst beim Verkauf. Was das ausmacht, lässt sich im Steuerrechner dieser Seite durchrechnen.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 12 */
  {
    slug: 'wachstum-und-innerer-wert',
    bereich: 'fundamentalanalyse',
    titel: 'Wachstum, PEG und der innere Wert',
    kurz: 'Wie Wachstum in eine Bewertung eingeht – und warum eine Abzinsungsrechnung so empfindlich auf ihre Annahmen reagiert.',
    kernaussage:
      'Eine Abzinsungsrechnung ist keine Wahrsagerei, sondern eine Buchhaltung über die eigenen Annahmen. Ihr Wert liegt darin, dass sie diese Annahmen sichtbar macht.',
    belegart: 'definition',
    dauer: 9,
    stichworte: ['PEG', 'DCF', 'Abzinsung', 'innerer Wert', 'Wachstum'],
    setztVoraus: ['kurs-gewinn-verhaeltnis', 'cashflow'],
    rechner: ['zinsrechner'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Ein KGV von 30 kann günstiger sein als eines von 10 – wenn das erste Unternehmen schnell wächst und das zweite schrumpft. Die Frage ist, wie sich Wachstum in eine Bewertung übersetzt.',
      },
      { type: 'heading', level: 2, text: 'Die schnelle Variante: PEG' },
      {
        type: 'formula',
        expression: 'PEG = KGV ÷ erwartetes Gewinnwachstum in Prozent',
        description:
          'Ein KGV von 30 bei 30 Prozent Wachstum ergibt ein PEG von 1. Als Faustregel gilt ein Wert unter 1 als günstig – eine Regel, die Peter Lynch populär gemacht hat.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Warum die Faustregel wackelt',
        items: [
          'Die Wachstumsrate ist eine Schätzung. Wer sie um fünf Punkte anhebt, macht aus einer teuren eine günstige Aktie – ohne dass sich etwas geändert hätte.',
          'Die Regel behandelt 30 Prozent Wachstum als dreimal so viel wert wie 10 Prozent. Dafür gibt es keine Herleitung; hohe Wachstumsraten sind zudem seltener von Dauer.',
          'Das Risiko fehlt vollständig. Zwei Unternehmen mit gleichem PEG können völlig verschiedene Ausfallwahrscheinlichkeiten haben.',
        ],
      },
      { type: 'heading', level: 2, text: 'Die saubere Variante: Abzinsung' },
      {
        type: 'paragraph',
        text: 'Der Wert eines Unternehmens ist die Summe aller künftigen freien Cashflows, abgezinst auf heute. Abgezinst wird, weil ein Euro in zehn Jahren weniger wert ist als einer heute – man könnte ihn zwischenzeitlich anlegen.',
      },
      {
        type: 'formula',
        expression: 'Barwert = Σ  CFₜ ÷ (1 + r)ᵗ',
        description:
          'CFₜ ist der freie Cashflow im Jahr t, r der Abzinsungssatz. Da niemand unendlich viele Jahre schätzen kann, wird meist über zehn Jahre gerechnet und für die Zeit danach ein Endwert angesetzt.',
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Wo die Rechnung kippt',
        items: [
          '**Der Endwert dominiert.** In vielen Rechnungen stammen 60 bis 80 Prozent des Ergebnisses aus dem Endwert – also aus der Zeit nach dem Prognosezeitraum. Der am wenigsten belastbare Teil wiegt am schwersten.',
          '**Der Abzinsungssatz.** Ein Prozentpunkt mehr oder weniger verschiebt das Ergebnis um zweistellige Prozentsätze.',
          '**Die ewige Wachstumsrate.** Sie muss unter dem langfristigen Wirtschaftswachstum liegen – sonst würde das Unternehmen rechnerisch irgendwann die gesamte Weltwirtschaft ausmachen.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Die nützlichste Anwendung',
        items: [
          'Statt einen Wert auszurechnen, kann man die Rechnung umdrehen: Welches Wachstum müsste eintreten, damit der heutige Kurs gerechtfertigt ist?',
          'Das Ergebnis ist überprüfbar. „Der Kurs unterstellt 25 Prozent Wachstum über zehn Jahre“ ist eine Aussage, zu der man eine Meinung haben kann – anders als „der faire Wert liegt bei 87,40 Euro“.',
        ],
      },
    ],
  },

  /* ----------------------------------------------------------------- 13 */
  {
    slug: 'qualitative-analyse',
    bereich: 'fundamentalanalyse',
    titel: 'Qualitative Analyse: was keine Kennzahl zeigt',
    kurz: 'Geschäftsmodell, Wettbewerbsvorteil, Abhängigkeiten und Management – die Fragen hinter den Zahlen.',
    kernaussage:
      'Kennzahlen beschreiben, was war. Ob es so bleibt, entscheidet sich an Fragen, die keine Bilanz beantwortet.',
    belegart: 'deutung',
    dauer: 8,
    stichworte: [
      'Geschäftsmodell',
      'Burggraben',
      'Wettbewerbsvorteil',
      'Klumpenrisiko',
      'Management',
    ],
    setztVoraus: ['kapitalrenditen'],
    inhalt: [
      {
        type: 'paragraph',
        text: 'Eine hohe Kapitalrendite zieht Wettbewerb an. Wer 30 Prozent auf das eingesetzte Kapital verdient, bekommt Nachahmer – und die drücken die Rendite. Die entscheidende Frage der Fundamentalanalyse lautet deshalb: Was hindert sie daran?',
      },
      { type: 'heading', level: 2, text: 'Wettbewerbsvorteile' },
      {
        type: 'table',
        caption: 'Vorteile, die sich empirisch als dauerhaft erwiesen haben.',
        head: ['Art', 'Wirkung', 'Beispielhafte Merkmale'],
        rows: [
          [
            'Wechselkosten',
            'Der Wechsel kostet Zeit, Geld oder Risiko',
            'Betriebssysteme in Unternehmen, Bankverbindungen',
          ],
          [
            'Netzwerkeffekt',
            'Der Nutzen wächst mit der Zahl der Teilnehmer',
            'Marktplätze, Zahlungssysteme, Börsen',
          ],
          [
            'Größenvorteile',
            'Fixkosten verteilen sich auf mehr Einheiten',
            'Logistik, Chipfertigung, Versicherung',
          ],
          [
            'Immaterielle Werte',
            'Marke, Patent, Zulassung',
            'Arzneimittel, Luxusgüter, Normen',
          ],
        ],
      },
      { type: 'heading', level: 2, text: 'Abhängigkeiten' },
      {
        type: 'list',
        items: [
          '**Kunden.** Wie viel Umsatz entfällt auf den größten Kunden? Über zehn Prozent ist ein Risiko, das im Geschäftsbericht angabepflichtig ist.',
          '**Lieferanten.** Gibt es für ein Schlüsselteil nur eine Quelle?',
          '**Regulierung.** Wie viel des Ergebnisses hängt an einer Zulassung, einer Einspeisevergütung, einem Patent mit Ablaufdatum?',
          '**Regionen.** Ein Großteil des Gewinns aus einem einzigen Land ist ein politisches Risiko, das in keiner Kennzahl steht.',
        ],
      },
      { type: 'heading', level: 2, text: 'Management' },
      {
        type: 'callout',
        variant: 'tip',
        title: 'Was sich tatsächlich prüfen lässt',
        items: [
          '**Kapitalverwendung.** Wofür wurde in den letzten zehn Jahren Geld ausgegeben, und was hat es gebracht? Zukäufe, die abgeschrieben werden mussten, stehen im Bericht.',
          '**Vergütung.** Woran hängen die Boni? An kurzfristigen Umsatzzielen oder an der Kapitalrendite über mehrere Jahre?',
          '**Frühere Aussagen.** Was wurde vor drei Jahren angekündigt, und was ist daraus geworden? Alte Geschäftsberichte sind öffentlich.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Die Grenze der qualitativen Analyse',
        items: [
          'Sie lädt zu Geschichten ein, und Geschichten überzeugen stärker als Zahlen. Wer ein Unternehmen mag, findet für jede Kennzahl eine Erklärung.',
          'Ein Schutz dagegen: erst die Zahlen ansehen, dann die Geschichte suchen – nicht umgekehrt. Und aufschreiben, welche Beobachtung die eigene These widerlegen würde.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: 'Kein Rat zur Anlage',
        items: [
          'Diese Lektionen erklären ein Verfahren. Sie enthalten keine Empfehlung, ein bestimmtes Unternehmen zu kaufen oder zu verkaufen, und berücksichtigen keine persönliche Situation.',
          'Wer eine Einzelaktie hält, trägt das Risiko genau dieses Unternehmens – anders als in einem breit gestreuten Index, in dem sich ein Ausfall auf viele Werte verteilt.',
        ],
      },
    ],
  },
]
