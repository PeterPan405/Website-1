/**
 * Die Seite „Unternehmensphilosophie“.
 *
 * Der Text ist verfasst und die Seite veröffentlicht. Solange
 * `PHILOSOPHY_PUBLISHED` auf `false` stand, wurde sie mit `noindex` ausgeliefert
 * und nicht in die sitemap.xml aufgenommen – eine fast leere Seite im Index
 * belastet die Sichtbarkeit der ganzen Domain.
 *
 * ── Wenn der Text geändert wird ─────────────────────────────────────────────
 * Die Abschnitte sind Daten, keine Seitenstruktur: `heading` wird als <h2>
 * ausgegeben, jeder Eintrag in `paragraphs` als eigener Absatz. Ein Abschnitt
 * lässt sich damit umformulieren, ergänzen oder streichen, ohne die Seite
 * anzufassen.
 *
 * `hint` bleibt bei jedem Abschnitt stehen, obwohl er nicht mehr angezeigt
 * wird. Er beschreibt, was in den Abschnitt gehört – und ist damit die
 * Prüffrage, an der sich eine spätere Überarbeitung messen lässt.
 */

/** Auf `true` setzen, sobald der Text vollständig verfasst ist. */
export const PHILOSOPHY_PUBLISHED = true

export interface PhilosophySection {
  /** Wird als <h2> ausgegeben. Frei anpassbar. */
  heading: string
  /** Arbeitshinweis. Erscheint nur, solange `paragraphs` leer ist. */
  hint: string
  /** Der fertige Text, ein Eintrag je Absatz. */
  paragraphs?: string[]
}

export const philosophySections: PhilosophySection[] = [
  {
    heading: 'Warum wir das machen',
    hint: 'Der Anlass: Welche Lücke soll IM Invests schließen? Was hat dich dazu gebracht, Finanzwissen zu vermitteln? Ein konkreter Auslöser wirkt hier stärker als eine allgemeine Mission.',
    paragraphs: [
      'Am Anfang stand ein einfacher Gedanke: Jeder sollte sich mit Geld auskennen können, der das möchte – unabhängig davon, was er verdient, was er gelernt hat und ob zu Hause je über Geld gesprochen wurde. Der Umgang mit Geld ist keine Begabung und kein Privileg, sondern erklärbar. Und weil er über Jahrzehnte wirkt, ist er eines der wenigen Dinge, bei denen sich Verstehen so unmittelbar auszahlt. Deshalb steht hier alles offen: kein Konto, keine Bezahlschranke, keine Vorkenntnisse.',
      'Zugang allein genügt allerdings nicht. Ein Text, der fachlich stimmt, den man aber nach drei Sätzen zuklappt, hat nichts erklärt – er hat nur gezeigt, dass jemand das Thema beherrscht. Also fängt hier jedes Thema bei null an: Die erste Stufe klärt die Begriffe, bevor etwas darauf aufbaut, und unter jedem Thema stehen seine Fachbegriffe verlinkt – ein Klick führt zu der Seite, die sie erklärt. Wer den ersten Satz versteht, soll auch den letzten verstehen.',
      'Und Lernen darf Freude machen. Geldanlage wird meist entweder als lästige Pflicht dargestellt oder als Nervenkitzel mit schnellen Gewinnen. Beides trifft es nicht. Zu begreifen, warum der Zinseszins so wirkt, wie er wirkt, oder warum ein halber Prozentpunkt Gebühr über dreißig Jahre so viel ausmacht, ist tatsächlich interessant – und dieser Moment des Verstehens ist der beste Grund weiterzulesen. Kurze Abschnitte, Rechner zum Ausprobieren und ein Quiz nach jedem Thema sind genau dafür da.',
      'An Finanzinformationen herrscht kein Mangel. Es gibt Vergleichsportale, Ratgeber, Videos, Newsletter und ganze Zeitschriften zum Thema. Was fehlt, ist nicht Menge, sondern eine einfache Eigenschaft: dass derjenige, der erklärt, nichts davon hat, wie man sich entscheidet.',
      'Fast überall steht am Ende ein Produkt. Ein Depot, ein Fonds, eine Versicherung, ein Abonnement, mindestens eine Provision für den vermittelten Abschluss. Das macht die Inhalte nicht falsch – die meisten sind fachlich in Ordnung. Es verschiebt aber, was betont und was weggelassen wird. Kosten werden zur Fußnote, Risiken zum Pflichtsatz am Ende, und die unspektakuläre Antwort verliert gegen die interessante.',
      'Genau diese Verschiebung ist der Grund für IM Invests. Hier wird nichts verkauft und nichts vermittelt. Daraus folgt eine andere Gewichtung, und sie ist auf jeder Seite sichtbar: Kosten sind ein Hauptthema, Risiken stehen neben den Chancen statt dahinter, und wo ein verbreitetes Argument nicht trägt, steht das dabei – auch wenn die ehrliche Antwort langweiliger klingt als die verkäufliche.',
      'Der Anspruch ist bewusst begrenzt. Diese Website macht niemanden reich und gibt keine Empfehlungen. Sie erklärt, wie die Dinge funktionieren, damit man Angebote selbst beurteilen kann. Das ist weniger, als andere versprechen – und mehr, als die meisten halten.',
    ],
  },
  {
    heading: 'Woran wir glauben',
    hint: 'Die inhaltlichen Grundüberzeugungen zur Geldanlage – etwa zu Streuung, Kosten, Anlagehorizont oder dem Umgang mit Prognosen. Wichtig: Überzeugungen, die auch unbequem sein dürfen, machen eine Philosophie glaubwürdig.',
    paragraphs: [
      '**Zeit schlägt Zeitpunkt.** Der Zinseszins braucht Jahrzehnte, um zu wirken, und er ist der einzige Mechanismus, der zuverlässig für Anleger arbeitet. Wer zehn Jahre früher anfängt, muss dafür deutlich weniger als die Hälfte einzahlen. Wer auf den richtigen Einstiegszeitpunkt wartet, tauscht dagegen ein bekanntes Risiko gegen ein unbekanntes – und beides ist ein Risiko, nur fällt das zweite nicht im Depotauszug auf.',
      '**Kosten sind das Einzige, was sicher ist.** Renditen sind ungewiss, Gebühren nicht. Sie wirken jedes Jahr auf das gesamte Vermögen, nicht nur auf die neue Sparrate, und der entgangene Zinseszins auf das Entnommene kommt obendrauf. Über dreißig Jahre entscheidet ein Prozentpunkt Kostenunterschied über einen erheblichen Teil des Ergebnisses. Das ist der am leichtesten zu ziehende Hebel überhaupt – und der am seltensten genutzte.',
      '**Streuung ist kein Kompromiss.** Sie ist der einzige Effekt am Kapitalmarkt, der Risiko senkt, ohne dafür Rendite zu kosten. Wer stattdessen auf wenige Titel setzt, kauft sich kein höheres Ertragspotenzial, sondern ein Risiko, für das der Markt nichts bezahlt.',
      '**Die meisten schlagen den Markt nicht – und das ist kein Problem.** Wer breit gestreut und kostengünstig anlegt, bekommt die Marktrendite. Das genügt für Vermögensaufbau vollständig. Der Versuch, mehr zu erreichen, kostet in aller Regel Gebühren, Steuern und Nerven und endet unterhalb des einfachen Wegs.',
      '**Der größte Hebel ist das eigene Verhalten.** Die Lücke zwischen dem, was ein Fonds erwirtschaftet, und dem, was seine Anleger tatsächlich erzielen, entsteht nicht aus mangelndem Wissen, sondern aus Kaufen nach Anstiegen und Verkaufen nach Rückgängen. Deshalb steht auf dieser Website Psychologie neben Mathematik – ein Plan, der in einem Crash nicht durchgehalten wird, hat keine Rendite.',
      '**Prognosen taugen nicht als Handlungsgrundlage.** Niemand kennt den Stand eines Index in zwölf Monaten, und wer eine Zahl nennt, weiß es auch nicht. Deshalb gibt es hier keine Kursziele. Was es gibt, sind Mechanismen, Bandbreiten und offengelegte Annahmen – daraus lässt sich planen, aus einer Prognose nicht.',
    ],
  },
  {
    heading: 'Wie wir arbeiten',
    hint: 'Die redaktionellen Grundsätze: Wie entstehen Inhalte, wie wird geprüft, wie geht IM Invests mit Fehlern und Korrekturen um? Auch die Frage, warum in drei Lernstufen aufgebaut wird, passt hierher.',
    paragraphs: [
      '**Drei Stufen, die wirklich weitergehen.** Jedes Thema gibt es dreimal. Die Beginner-Stufe klärt Begriffe und die häufigsten Missverständnisse, die zweite Varianten, Kennzahlen und die Umsetzung, die dritte Sonderfälle, Steueraspekte, Risiken und Bewertungsdetails. Entscheidend ist, dass die dritte Stufe nicht die erste mit anderen Worten wiederholt – sonst wäre die Einteilung eine Etikettierung und keine Struktur.',
      '**Jede Rechnung zeigt ihren Weg.** Die Rechner nennen ihre Formel und ihre Annahmen. Wer das Ergebnis nicht nachvollziehen kann, kann es auch nicht einordnen – und müsste uns einfach glauben. Genau das soll diese Website nicht verlangen.',
      '**Jede Zahl nennt ihre Herkunft.** Kurse tragen ihre Quelle und ihren Stand direkt an der Angabe. Nachrichten sind selbst zusammengefasst und verlinken die Quelle, aus der sie stammen; fremde Texte werden nicht gespiegelt. Wo Werte zur Veranschaulichung erzeugt sind und keinen realen Markt abbilden, steht das an derselben Stelle und nicht in einer Fußnote.',
      '**Was nicht stimmen kann, soll gar nicht erst online gehen.** Ein Teil der Prüfung ist automatisiert: Fehlt einer Meldung die Quelle, verweist ein Thema auf einen Kurs, den es nicht gibt, oder liegt eine Zahl außerhalb des Plausiblen, bricht der Build ab, statt die Seite auszuliefern. Ein sichtbarer Fehler wird behoben, ein stiller nicht.',
      '**Fehler werden benannt.** Wenn etwas falsch war, wird es korrigiert und die Korrektur steht dabei – nicht stillschweigend überschrieben. Bei Finanzthemen ist der Umgang mit dem eigenen Irrtum ein Teil der Glaubwürdigkeit und keine Randnotiz.',
      '**Aktualität dort, wo sie zählt.** Kurse werden während der Börsenzeit alle dreißig Minuten neu geholt, Nachrichten täglich gepflegt. Die Lerninhalte dagegen ändern sich selten – sie beschreiben Mechanismen, und die halten länger als jede Meldung.',
    ],
  },
  {
    heading: 'Was wir nicht tun',
    hint: 'Die Abgrenzung – oft der überzeugendste Abschnitt. Zum Beispiel: keine Produktempfehlungen, keine Renditeversprechen, keine Einzelfallberatung, keine Panikmache. Was ausgeschlossen wird, sagt mehr aus als jedes Versprechen.',
    paragraphs: [
      '**Keine Produktempfehlungen.** Kein Fonds, kein Depot, keine Versicherung, keine Bank wird hier empfohlen. Es gibt auch keine Bestenlisten und keine Testsieger. Erklärt wird die Gattung – woran ein Produkt zu erkennen ist, welche Kosten es hat und welche Fragen davor stehen. Die Auswahl bleibt bei denen, die sie treffen müssen.',
      '**Keine Renditeversprechen und keine Kursziele.** Modellrechnungen zeigen, was aus einer Annahme folgt, und benennen die Annahme. Das ist etwas anderes als eine Vorhersage, und der Unterschied wird nicht verwischt.',
      '**Keine Anlageberatung.** Diese Website kennt weder die persönliche Situation noch die Ziele oder die steuerlichen Verhältnisse ihrer Leser. Alles hier ist allgemeine Information und Bildung. Wo eine Frage individuell, steuerlich oder rechtlich wird, steht der Verweis auf fachlichen Rat – nicht eine Antwort, die zufällig passen könnte.',
      '**Keine Dringlichkeit.** Es gibt keine Countdown-Angebote, keine Warnungen vor angeblich letzten Chancen und keine Panikmache. Beides – Gier und Angst – sind Verkaufswerkzeuge, und wer nichts verkauft, braucht sie nicht.',
      '**Keine Datensammlung.** Es gibt kein Konto und keine Anmeldung. Rechnereingaben und Lernfortschritt bleiben im Browser des jeweiligen Geräts und werden nicht übertragen. Ein Nutzungsprofil entsteht nicht, weil die Daten dafür gar nicht erst erhoben werden.',
      '**Keine gekauften Inhalte.** Es gibt keine bezahlten Beiträge, keine Gastartikel gegen Entgelt und keine Werbeplätze, die als redaktioneller Inhalt erscheinen.',
    ],
  },
  {
    heading: 'Wie wir uns finanzieren',
    hint: 'Bei Finanzinhalten der entscheidende Vertrauensfaktor: Woher kommt das Geld? Gibt es Provisionen, Werbung, Affiliate-Links, ein Abo? Wenn Interessenkonflikte bestehen, gehören sie offen benannt – wenn keine bestehen, ist genau das ein Argument.',
    paragraphs: [
      'IM Invests wird derzeit privat vom Betreiber finanziert. Es gibt keine Werbung, keine Provisionen, keine Affiliate-Links und kein Abonnement. Für keinen Verweis auf dieser Website fließt Geld – weder für die verlinkten Nachrichtenquellen noch für genannte Anbieter.',
      'Das ist keine Nebensache. Bei Finanzinhalten entscheidet die Finanzierung darüber, welche Antwort sich lohnt. Wo eine Provision an einem Abschluss hängt, wird die Frage „brauche ich das überhaupt?“ zwangsläufig seltener gestellt als die Frage „welches Produkt?“. Wo nichts an der Entscheidung hängt, kann die Antwort auch lauten: gar nichts tun.',
      'Sollte sich das ändern, wird es vorher offengelegt – und zwar an der Stelle, an der es wirkt, nicht in einem Hinweis im Impressum. Eine Einnahmequelle, die den Blick auf ein Thema beeinflussen könnte, gehört neben dieses Thema.',
      'Wer Anmerkungen, Korrekturen oder Fragen hat, erreicht uns über die Kontaktseite. Kritik an einer Darstellung ist willkommen – wer eine Aussage für falsch hält, hilft dieser Website mehr als jede Zustimmung.',
    ],
  },
]
