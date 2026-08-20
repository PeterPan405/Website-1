/**
 * Was sich an dieser Website geändert hat – in der Sprache des Lesers.
 *
 * ## Warum das eine gepflegte Datei ist und kein Git-Auszug
 *
 * Weil ein Commit-Titel für Entwickler geschrieben ist. „Wortgrenzen
 * gekoppelt, elf Warnungen aufgelöst" beantwortet keine Frage, die ein
 * Besucher hat. Was ihn angeht, ist: *Was kann ich jetzt, was ich vorher
 * nicht konnte – und worauf muss ich achten?*
 *
 * Eine automatische Übersetzung von Commit-Titeln in Lesersprache gibt es
 * nicht. Sie erfände Bedeutung, wo im Titel keine steht.
 *
 * **Damit trotzdem nichts untergeht**, gibt es `npm run aenderungen`: Der Lauf
 * liest die Git-Historie seit dem jüngsten Eintrag hier und listet auf, was
 * noch keinen Eintrag hat. Er schlägt vor, er schreibt nicht.
 *
 * ## Warum es nicht beim Bauen aus Git entsteht
 *
 * Weil beim Bauen keine Historie da ist. `paket-bauen.yml` klont mit
 * `fetch-depth: 50` – eine Seite, die live aus `git log` läse, wäre nach
 * fünfzig Commits still abgeschnitten, und niemand sähe es. Bei rund zehn
 * Commits am Tag wären das fünf Tage Rückschau statt der ganzen.
 *
 * Genau die Sorte Fehler, die dieses Projekt an allen Ecken abzuschaffen
 * versucht: nicht kaputt, nur unvollständig, und ohne Meldung.
 *
 * ## Was hier hineingehört
 *
 * Was ein Besucher **merkt**: neue Seiten, geänderte Darstellung, korrigierte
 * Angaben. Nicht: Umbauten unter der Haube, Testabdeckung, Formatierung.
 *
 * Und ausdrücklich auch **Korrekturen an uns selbst**. Das ist die Fortsetzung
 * dessen, was `/news/korrekturen` für einzelne Artikel begonnen hat: Wer nur
 * die Verbesserungen aufzählt, schreibt Werbung.
 */

/** Was für ein Eintrag es ist – bestimmt die Beschriftung, nicht die Farbe. */
export type Aenderungsart = 'neu' | 'geaendert' | 'korrigiert'

export interface Aenderung {
  /** ISO-Datum des Tages, an dem es live ging. */
  datum: string
  art: Aenderungsart
  /** Eine Zeile, die ohne Vorwissen verständlich ist. */
  titel: string
  /** Was das für den Leser bedeutet – zwei bis drei Sätze. */
  text: string
  /** Wohin, falls es etwas zu sehen gibt. */
  ziel?: { text: string; href: string }
}

/**
 * Die Einträge, neueste zuerst.
 *
 * Die Reihenfolge steht hier und wird nicht sortiert: Zwei Änderungen am
 * selben Tag haben eine Rangfolge, die kein Zeitstempel kennt.
 */
export const AENDERUNGEN: Aenderung[] = [
  {
    datum: '2026-08-20',
    art: 'neu',
    titel: 'Die Tokioter Börse ist als Terminquelle angeschlossen',
    text: 'Für Toyota, Sony, Nintendo und die übrigen 69 japanischen Titel stand kein Termin für die Quartalszahlen da – die bisherige Quelle deckt nur ab, wer in den USA notiert. Die Tokioter Börse veröffentlicht die geplanten Meldetermine aller dort gelisteten Unternehmen selbst; sie werden jetzt gelesen. Es sind keine Schätzungen, sondern die Tage, die die Unternehmen selbst angekündigt haben. Zwei Einschränkungen stehen dabei: Eine Uhrzeit nennt Tokio nicht, und deshalb steht bei diesen Titeln auch keine. Und die Börse veröffentlicht die Liste je Berichtssaison – zwischen zwei Saisons steht auf der Aktienseite, dass der nächste Tag noch nicht bekannt gegeben ist, statt einer Schätzung.',
    ziel: { text: 'Beispiel: Toyota', href: '/maerkte/toyota' },
  },
  {
    datum: '2026-08-20',
    art: 'neu',
    titel: 'Auf jeder Aktienseite steht, wann die nächsten Zahlen kommen',
    text: 'Unter dem Kursverlauf steht jetzt der erwartete Termin der nächsten Quartalszahlen – und wenn er in den nächsten zwei Wochen liegt, steht oben neben dem Kurs zusätzlich ein Hinweis. Der Kalender nennt dazu die Uhrzeit in deutscher Zeit und ob die Zahlen vor der US-Eröffnung oder nach dem US-Schluss kommen; für den Kurs am selben Tag ist das der ganze Unterschied. Beides ist aus dem bisherigen Meldemuster hochgerechnet und als geschätzt gekennzeichnet.',
    ziel: { text: 'Beispiel: NVIDIA', href: '/maerkte/nvidia' },
  },
  {
    datum: '2026-08-20',
    art: 'korrigiert',
    titel: 'Für 711 Aktien gibt es keinen Meldetermin – und das steht jetzt dort',
    text: 'Nachgezählt: Nur 318 der 1.029 geführten Aktien haben einen erwarteten Termin für die Quartalszahlen, und 302 davon sind amerikanisch. Der Grund liegt an der Quelle – die Pflichtmeldung, aus der sich der Termin ablesen lässt, gibt es nur in den USA. Bisher stand auf den übrigen Seiten dazu nichts, was sich leicht als „das Unternehmen meldet nicht" lesen ließ; jetzt steht dort der Grund. Auf der Kalenderseite ist außerdem ein Satz entfallen, der eine zweite Quelle ankündigte: Sie ist geprüft und liefert die Termine nur gegen Bezahlung.',
    ziel: { text: 'Zum Börsenkalender', href: '/kalender' },
  },
  {
    datum: '2026-08-18',
    art: 'geaendert',
    titel: 'Fünf Fortgeschritten-Stufen deutlich ausgebaut',
    text: 'Die Fortgeschritten-Stufen waren im Schnitt ein Viertel dünner als die Beginner-Stufen darunter – ein Lernweg, der in der Mitte schmaler wird. Fünf davon sind jetzt nachgezogen: Sparplan, Kosten und Gebühren, Depot und Broker, Portfolio-Aufbau und Rente. Neu sind unter anderem die steuerliche Behandlung eines Sparplans (jede Rate ist ein eigener Kauf), welche Kosten die Steuer mindern und welche nicht, was eine Teilausführung kostet, warum zwei gleichlaufende Bausteine keine zwei sind, und was die gesetzliche Rente außer der Altersrente noch leistet. Die Lesezeiten sind mitgezogen.',
    ziel: {
      text: 'Beispiel: Portfolio-Aufbau',
      href: '/lernen/portfolio-aufbau/fortgeschritten',
    },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: 'Das Ausgabenarchiv als ein Dokument zum Lesen am Stück',
    text: 'Bisher war das Archiv eine Seite je Tag – wer die Woche nachlesen wollte, klickte fünfmal. Jetzt gibt es dieselben Ausgaben als eine PDF-Datei: je Monat eine und, sobald ein Jahr Ausgaben aus mehr als einem Monat hat, eine für den ganzen Jahrgang. Nichts daran ist gekürzt: Jede Meldung kommt mit ihrer vollständigen Zusammenfassung, dem „warum es zählt" und ihren Quellen; es fehlen nur die Klicks dazwischen. Jede Ausgabe beginnt auf einer neuen Seite, damit sich der Band durchblättern lässt. Erstellt wird die Datei im Browser, es werden keine Daten übertragen.',
    ziel: { text: 'Zum Archiv', href: '/news/tag' },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: '„Ich habe fünf Minuten" – Einstieg nach Zeit statt nach Thema',
    text: 'Wer nicht weiß, wo er anfangen soll, fragt selten nach dem Thema, sondern nach der Zeit. Die neue Seite sortiert danach: fünf Minuten, eine Viertelstunde, eine Stunde, ein Abend. Jede Minutenangabe steht so in den Inhalten – die Lesezeit einer Lernstufe, die gemessene Länge einer Podcastfolge, die Summe eines Lernpfads. Im Fünf-Minuten-Fenster steht bewusst keine Lernstufe: Die kürzeste braucht neun Minuten, und das sagt die Seite auch. Wo keine Dauer hinterlegt ist, steht keine geschätzte Zahl, sondern der Hinweis darauf.',
    ziel: { text: 'Zum Einstieg nach Zeit', href: '/lernen/zeit' },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: 'Eine Frage des Tages auf der Startseite',
    text: 'Vier Werte derselben Gattung, eine Frage, vier Antworten – gerechnet aus denselben Kursen, die auch die Kacheln zeigen: Wer hat am letzten Handelstag am meisten zugelegt, wer liegt seit Jahresbeginn vorn, wer steht seinem Zwölfmonatshoch am nächsten? Nach dem Klick stehen alle vier Zahlen da, nicht nur die richtige – der Sinn der Frage ist der Vergleich. An einem ruhigen Tag, an dem die beiden Besten zu dicht beieinanderliegen, erscheint keine Frage: Eine Frage ohne eindeutige Antwort wäre schlechter als keine.',
    ziel: { text: 'Zur Startseite', href: '/' },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: 'Lernkarten zum Ausdrucken, je Thema ein Kartenbogen',
    text: 'Zu jedem Lernthema gibt es jetzt einen Bogen mit acht Karten je A4-Blatt: vorn der Begriff oder die Prüffrage, hinten die Erklärung beziehungsweise die richtige Antwort mit Begründung. Der Inhalt kommt aus dem Glossar und den vorhandenen Quizfragen – nichts ist dafür neu geschrieben. Wichtig beim Drucken: beidseitig über die lange Kante und ohne Skalierung. Die Rückseiten stehen auf dem Bildschirm absichtlich seitenverkehrt; beim Wenden tauschen linke und rechte Spalte die Seite, und dadurch landet jede Antwort hinter ihrer eigenen Frage.',
    ziel: { text: 'Beispiel: Karten zum Zinseszins', href: '/lernen/zinseszins/karten' },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: 'Ein Zeitstrahl von 1694 bis heute',
    text: 'Wovon das Geld gedeckt war, wer darüber entschied, und was passierte, wenn die Kurse fielen – von der Gründung der Bank of England bis zur Vorabpauschale. Der Lehrsatz der Seite steht nicht als Meinung da, sondern als Auswertung: Nicht die Falltiefe zählt, sondern die Dauer bis zur Erholung. Zwei Einbrüche der Liste fielen gleich tief, brauchten aber unterschiedlich lange – wenn gleiche Tiefe zu ungleicher Dauer führt, kann die Tiefe die Dauer nicht bestimmen. Jeder Punkt zeigt außerdem an, ob er ein nachprüfbares Datum ist oder eine Größenordnung.',
    ziel: { text: 'Zum Zeitstrahl', href: '/zeitstrahl' },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: 'Sätze, die man ständig hört – und was an ihnen dran ist',
    text: '„Minus 50 Prozent hole ich mit plus 50 wieder rein“, „ein Prozent Gebühr ist doch nichts“, „bei einem thesaurierenden ETF zahle ich erst beim Verkauf“. Eine neue Seite sammelt 35 solcher Sätze. Bei jedem steht zuerst, was daran richtig ist – die meisten sind verkürzte Wahrheiten, keine Dummheiten –, dann der Einwand und dann die Rechnung. Die Rechnungen sind nicht abgeschrieben: Sie werden beim Prüfen mit denselben Funktionen nachgerechnet, mit denen die Rechner dieser Website rechnen. Wo eine Zahl in die Irre führen würde, steht keine, sondern der Grund dafür.',
    ziel: { text: 'Zu den Irrtümern', href: '/irrtuemer' },
  },
  {
    datum: '2026-08-18',
    art: 'geaendert',
    titel: 'Die Suche lässt sich jetzt filtern',
    text: 'Mehr als die Hälfte des Suchindex besteht aus Kursen – wer „Gold“ tippte, bekam Instrumente, und das Lernthema stand dahinter. Über der Trefferliste steht jetzt eine Leiste: Kurs, Lernstufe, Begriff, Nachricht, jeweils mit der Zahl der Treffer davor. Bei Lernstufen kommt die Wahl zwischen Beginner, Fortgeschritten und Profi dazu, bei Nachrichten der Filter auf die letzten sieben Tage. Jeder Knopf erscheint nur, wenn er etwas ausrichten kann – und Einträge ohne Datum gelten nicht als „von heute“, sondern bleiben beim Zeitfilter außen vor.',
    ziel: { text: 'Zur Startseite', href: '/' },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: 'Alle Meldungen zu einem Wert an einer Stelle',
    text: 'Das Archiv war bisher nur über den Kalender erreichbar – nach Tag, Monat, Jahr. Wer wissen wollte, was über die Zeit zum Ölpreis geschrieben wurde, musste die Tage durchgehen. Jetzt gibt es je Wert und je Thema einen Strang: alle Meldungen chronologisch, nach Jahrgängen gegliedert. 35 Stränge sind es zum Start, vom DAX mit 43 Meldungen bis zu den kleineren. Werte mit weniger als fünf Meldungen bekommen keinen – ein Strang aus einem Artikel ist ein Umweg zum Artikel.',
    ziel: { text: 'Beispiel: alles zum DAX', href: '/news/strang/wert/dax' },
  },
  {
    datum: '2026-08-18',
    art: 'korrigiert',
    titel: 'Australische und neuseeländische Kurse standen am falschen Tag',
    text: 'Bei 31 Werten – 27 australischen Aktien, dem ASX 200 und drei neuseeländischen – stand der Kurs am falschen Kalendertag. Der Kurs selbst war richtig, aber das Datum um einen Tag verschoben, weil die Börsenzeit in Sydney der unseren um zehn bis elf Stunden voraus ist und die Sitzung damit in unserer Zeitrechnung schon am Vortag beginnt. Seit dem Beginn der australischen Sommerzeit am 5. Oktober 2025 traf das jede Sitzung. Betroffen war alles, was auf Tagen aufbaut: Zwölfmonatsspanne, Saisonalität, Jahresrenditen. Die gespeicherten Kurse werden mit dem nächsten vollständigen Abruf nachgezogen.',
    ziel: { text: 'Zu den handelsfreien Tagen', href: '/maerkte/handelsfreie-tage' },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: 'Jeder Wert zeigt jetzt mehrere Zeitfenster nebeneinander',
    text: 'Auf jeder Kursseite lässt sich ein neuer Abschnitt aufklappen: dieselbe Rendite, gerechnet über die letzten zwölf Monate, die zwölf davor und die fünf abgeschlossenen Kalenderjahre. Beim DAX liegen zwischen dem besten und dem schlechtesten dieser Zeiträume 45 Prozentpunkte – und jede dieser Zahlen ist richtig gerechnet. Das ist der Punkt: Eine Renditeangabe klingt nach einer Eigenschaft des Werts, ist aber vor allem eine Aussage über den Startpunkt. Wo für einen Zeitraum nur Wochenwerte gespeichert sind, steht beim tiefsten Rückgang „zu grob“ statt einer Zahl, die systematisch zu klein wäre.',
    ziel: { text: 'Beispiel: der DAX', href: '/maerkte/dax' },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: 'Wann welche Börse geschlossen war',
    text: 'Ein Kurs, der einen Tag lang stehenbleibt, ist meistens kein Fehler – die Börse hatte zu. Die neue Seite zeigt für 17 Handelsplätze, an welchen Werktagen des letzten Jahres dort kein Kurs zustande kam. Die Tage stehen in keiner Liste, die wir pflegen: Sie sind aus den Kursreihen abgelesen. Die veröffentlichten Börsenkalender sind aus unserer Bauumgebung nicht erreichbar, und eine Feiertagsliste aus dem Gedächtnis behauptet irgendwann „Börse geschlossen“ an einem Handelstag. Dafür gilt jede Zeile nur für die Vergangenheit.',
    ziel: { text: 'Zu den handelsfreien Tagen', href: '/maerkte/handelsfreie-tage' },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: 'Aktien nach Kennzahlen filtern',
    text: 'Ein Screener über die hier geführten Aktien: KGV, Kurs-Buchwert, Börsenwert, Branche, Sitzland, Abstand zum Zwölfmonatshoch. Das Ungewöhnliche daran steht direkt über der Trefferliste – zu jeder Abfrage die Auskunft, wie viele Titel der Auswahl die gefragte Kennzahl überhaupt haben, nach Land aufgeschlüsselt. Denn Bilanzzahlen liegen für amerikanische Unternehmen fast vollständig vor und für deutsche so gut wie gar nicht; ohne diese Zeile sähe jede Trefferliste aus wie eine Aussage über den Markt, obwohl sie eine über unsere Quellen ist.',
    ziel: { text: 'Zum Screener', href: '/maerkte/screener' },
  },
  {
    datum: '2026-08-18',
    art: 'neu',
    titel: 'Wie breit ist „breit gestreut“?',
    text: 'Der gebräuchlichste Weltindex hält 1.282 Werte – und die zehn größten tragen gut ein Viertel davon. Die neue Seite rechnet die Behauptung „breit gestreut“ mit den Zahlen des Indexanbieters nach: Der größte Einzelwert wiegt das 66-Fache dessen, was er bei Gleichgewicht wöge. Und sie zeigt, was in der Liste leicht übersehen wird – Alphabet steht mit zwei Aktiengattungen darin, die zehn größten Werte sind neun Unternehmen.',
    ziel: { text: 'Zum Klumpenrisiko', href: '/maerkte/klumpenrisiko' },
  },
  {
    datum: '2026-08-18',
    art: 'korrigiert',
    titel: 'Größter Einzelwert im Weltindex: NVIDIA, nicht Apple',
    text: 'Auf der Währungsseite standen Apple und Microsoft als die zwei größten Unternehmen des Weltindex. Das Factsheet nennt seit Juli 2026 NVIDIA an erster Stelle. Beide Zahlen, die dort standen, waren für sich genommen richtig – nur die Rangfolge nicht. Eine Prüfung verlangt jetzt, dass die Einzelwerte absteigend stehen; eine falsche Rangfolge sieht auf keiner Seite falsch aus.',
    ziel: { text: 'Zur Währungsaufteilung', href: '/maerkte/waehrungen-im-weltindex' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Wie viel Dollar in „weltweit“ steckt',
    text: 'Ein weltweit streuender Indexfonds ist zu rund 72 Prozent eine Dollarposition – die neue Seite zeigt die Währungsaufteilung mit den Ländergewichten des Indexanbieters. Und sie sagt dazu, warum wir sie nicht aus unseren eigenen Kursen gerechnet haben: Dabei wären 86 Prozent herausgekommen, und diese Zahl hätte unsere Datenlücke gemessen statt den Markt.',
    ziel: { text: 'Zur Währungsaufteilung', href: '/maerkte/waehrungen-im-weltindex' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Ein Begriff des Tages auf der Startseite',
    text: 'Jeden Tag ein anderer Fachbegriff aus dem Glossar, mit Erklärung und dem Weg ins passende Lernthema. Welcher es ist, folgt aus dem Datum – für alle derselbe, und über den Verlauf eines Durchgangs kommt jeder Begriff genau einmal an die Reihe.',
    ziel: { text: 'Zur Startseite', href: '/' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Begriffe, die ständig verwechselt werden',
    text: 'Sechs Paare, die im Alltag durcheinandergehen – ETF und Fonds, Zins und Rendite, Performance- und Kursindex, nominal und real –, zweispaltig gegenübergestellt. Links und rechts beantworten dieselbe Frage, damit man quer liest statt zweimal längs. Darunter jeweils der eine Satz, an dem man die beiden auseinanderhält.',
    ziel: { text: 'Zu den Verwechslungen', href: '/verwechslungen' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Jeder Rechner zeigt jetzt seinen Rechenweg',
    text: 'Unter dem Ergebnis lässt sich aufklappen, wie es zustande kommt – Schritt für Schritt, mit den Zahlen, die oben eingetragen sind. Wer will, kann das mit dem Taschenrechner nachvollziehen und muss der Seite an dieser Stelle nicht mehr glauben.',
    ziel: { text: 'Zu den Rechnern', href: '/rechner' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Kaufen oder mieten – mit den Posten, die sonst fehlen',
    text: '„Die Rate ist so hoch wie die Miete“ beantwortet die Frage nicht: In der Rate steckt Tilgung, in der Miete keine Instandhaltung. Der neue Rechner stellt beide Wege bei gleichem Geldabfluss gegenüber und sagt vor allem eines – wie stark die Immobilie jedes Jahr steigen müsste, damit der Kauf aufgeht.',
    ziel: { text: 'Zum Vergleich', href: '/rechner/kaufen-oder-mieten' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Kaufkraft und Wechselkurs – getrennt statt in einer Zahl',
    text: '„Was sind 100 € von 2015 heute wert?" wird meist mit einer Zahl beantwortet, und die vermischt zwei Dinge: dass Waren teurer geworden sind, und dass der Euro anders zu anderen Währungen steht. Der neue Rechner weist beides einzeln aus und darunter die Kombination. Gerechnet wird mit gemessenen Jahresreihen von Eurostat, nicht mit angenommenen Raten.',
    ziel: { text: 'Zum Kaufkraftrechner', href: '/rechner/kaufkraft' },
  },
  {
    datum: '2026-08-17',
    art: 'geaendert',
    titel: 'Kreditrechner: Sondertilgung, Anschluss und Tilgungsplan zum Mitnehmen',
    text: 'Der Rechner beantwortet jetzt drei Fragen mehr: Was bringt eine jährliche Sondertilgung – in gesparten Zinsen und in Monaten? Was kostet es, wenn der Zins nach der Bindung einen Prozentpunkt höher liegt? Und der vollständige Tilgungsplan lässt sich als Tabelle herunterladen, um ihn gegen ein Bankangebot zu halten.',
    ziel: { text: 'Zum Kreditrechner', href: '/rechner/kreditrechner' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Notgroschen: eine begründete Zahl statt „drei Monatsgehälter“',
    text: 'Die verbreitete Faustregel gibt einer Beamtin mit zwei Einkommen im Haushalt dieselbe Auskunft wie einem Selbstständigen mit zwei Kindern. Der neue Rechner verschiebt sie anhand von vier Angaben – und schreibt unter das Ergebnis, welcher Zuschlag woher kommt, damit man jedem einzeln widersprechen kann.',
    ziel: { text: 'Zum Notgroschen-Rechner', href: '/rechner/notgroschen' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Entnahmeplan: wie lange das Kapital trägt',
    text: 'Alle bisherigen Rechner hörten am Tag des Ruhestands auf. Dieser fängt dort an: Kapital und gewünschte monatliche Entnahme ergeben die Reichweite in Jahren – und daneben steht der Betrag, den man dauerhaft entnehmen könnte. Die Entnahme steigt jedes Jahr mit der Inflation, sonst wäre eine Kürzung eingerechnet, die niemand beschlossen hat.',
    ziel: { text: 'Zum Entnahmeplan', href: '/rechner/entnahmeplan' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Die Website in Zahlen',
    text: 'Eine Seite, die sagt, wie viel hier eigentlich steht: Lernseiten, Kurse, Artikel, Quellen, Rechenwege. Keine dieser Zahlen ist eingetragen – jede wird beim Bauen aus demselben Bestand gezählt, aus dem die Seiten lesen, und kann deshalb nicht veralten.',
    ziel: { text: 'Zu den Zahlen', href: '/zahlen' },
  },
  {
    datum: '2026-08-17',
    art: 'korrigiert',
    titel: 'Der Podcast sagt jetzt selbst, dass er mit KI entsteht',
    text: 'Bisher stand der Hinweis nur in der Beschreibung – wer eine Folge in einer Podcast-App hört, sieht die nie. Jede Folge beginnt deshalb mit zwei Sätzen: dass sie automatisiert entsteht und dass die Stimme künstlich erzeugt ist.',
    ziel: { text: 'Zum Podcast', href: '/podcast' },
  },
  {
    datum: '2026-08-17',
    art: 'korrigiert',
    titel: 'Ein Versprechen zurückgenommen, das wir nicht einhalten',
    text: 'Unter jeder Folge und im Fußbereich stand, Texte würden „vor der Veröffentlichung von einem Menschen inhaltlich geprüft". Das trifft nicht zu: Nachrichten und Podcast gehen ohne Zwischenhalt online. Der Satz sagt jetzt, was wirklich passiert – automatisiert, mit der redaktionellen Verantwortung beim Betreiber.',
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Methoden: wie jede Kennzahl gerechnet wird',
    text: 'Für acht Kennzahlen stehen jetzt Formel, Datengrundlage und Stichtag an einer Stelle – und vor allem, was dabei bewusst weggelassen wird. Die Beispielrechnungen sind nicht abgetippt, sondern werden aus derselben Funktion erzeugt, die auch die Zahl auf der Website rechnet.',
    ziel: { text: 'Zu den Methoden', href: '/methoden' },
  },
  {
    datum: '2026-08-17',
    art: 'neu',
    titel: 'Jede Zahl sagt, wie alt sie ist',
    text: 'Neben Angaben, die sich regelmäßig ändern, steht jetzt eine Ampel: wie alt der Wert ist und ab wann das zu alt wäre. Sie rechnet im Browser mit Ihrer Uhr – eine beim Bauen gerechnete Ampel stünde für immer auf Grün.',
    ziel: { text: 'Beispiel: Marktstimmung', href: '/maerkte/stimmung/aktien' },
  },
  {
    datum: '2026-08-17',
    art: 'geaendert',
    titel: 'Die Farbe der Browserleiste folgt dem Farbschema',
    text: 'Auf dem Telefon war der Balken über der Seite hell, während die Seite dunkel war – oder umgekehrt. Er folgt jetzt der gewählten Darstellung. Beim Umschalten lädt die Seite dafür kurz neu.',
  },
  {
    datum: '2026-08-16',
    art: 'neu',
    titel: '52 Wochen: wo jeder Wert in seinem Jahr steht',
    text: 'Eine sortierbare Übersicht über alle geführten Werte: Abstand zum Jahreshoch, Abstand zum Jahrestief und die Position dazwischen. Die beiden sind nicht dasselbe – zwei Titel, beide zehn Prozent unter ihrem Hoch, können im unteren Drittel oder im oberen Fünftel ihrer Spanne stehen.',
    ziel: { text: 'Zur Übersicht', href: '/maerkte/52-wochen' },
  },
  {
    datum: '2026-08-13',
    art: 'geaendert',
    titel: 'Der erste Besuch ist hell, auch auf dunkel gestellten Geräten',
    text: 'Vorher entschied die Systemeinstellung des Geräts. Wer sein Telefon auf Dunkel gestellt hatte, bekam eine dunkle Seite, ohne je etwas an ihr eingestellt zu haben. Der Umschalter oben rechts bleibt.',
  },
  {
    datum: '2026-08-11',
    art: 'geaendert',
    titel: 'Nachrichten und Podcast sind zuverlässig um sechs Uhr da',
    text: 'Die Schritte hängen jetzt aneinander statt an einzelnen Uhrzeiten: Jeder stößt den nächsten an, sobald er fertig ist. Vorher konnte ein ausgefallener Termin die ganze Kette bis zum nächsten Tag aufhalten.',
    ziel: { text: 'Zu den Nachrichten', href: '/news' },
  },
]
