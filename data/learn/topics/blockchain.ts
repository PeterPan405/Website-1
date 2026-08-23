import type { LearnTopic } from '@/data/learn/types'

/**
 * Vollständig ausgearbeitetes Thema.
 *
 * Stufenaufbau: Beginner erklärt den Aufbau der Kette und das Problem, das
 * sie löst – samt einer ausdrücklichen Liste dessen, was sie nicht leistet.
 * Fortgeschritten behandelt Konsensverfahren, Smart Contracts und
 * Skalierung. Profi geht auf Sicherheitsannahmen, Angriffsszenarien und die
 * Ökonomie der Transaktionsreihenfolge ein.
 *
 * ## Warum dieses Thema keine gerechnete Tabelle hat
 *
 * Anders als bei fast allen übrigen Themen gibt es hier nichts sinnvoll
 * Auszurechnendes: Es ist ein technisches Thema, keine Anlageklasse. Die
 * Zahlen, die kursieren – Transaktionen pro Sekunde, Energieverbrauch –
 * ändern sich laufend und wären als Momentaufnahme im Fließtext binnen
 * Monaten falsch. Sie stehen deshalb bewusst nicht darin.
 *
 * ## Abgrenzung zu „Bitcoin & Krypto“
 *
 * Dort steht die Anlageklasse: Verwahrung, Marktstruktur, Bewertung. Hier
 * steht die Technik – und die Frage, wann sie überhaupt das richtige
 * Werkzeug ist.
 */
export const blockchain: LearnTopic = {
  slug: 'blockchain',
  title: 'Blockchain',
  headline: 'Vertrauen in Regeln statt in eine Institution',
  metaTitle: 'Blockchain erklärt: Aufbau, Konsens, Grenzen',
  metaDescription:
    'Wie eine Blockchain aufgebaut ist, welches Problem sie löst, wie Konsensverfahren funktionieren – und wann eine gewöhnliche Datenbank die bessere Wahl ist.',
  lead: 'Eine Blockchain ist ein Kassenbuch, das viele gleichzeitig führen. Der Aufwand dafür ist erheblich – er lohnt sich nur, wenn niemand die zentrale Stelle sein darf.',
  overview: [
    'Blöcke enthalten Transaktionen und die Prüfsumme des Vorgängers. Dadurch hängt jeder Block an allen vorherigen: Eine nachträgliche Änderung macht alles Folgende ungültig und fällt sofort auf.',
    'Gelöst wird damit ein einziges, aber schwieriges Problem: Wie einigen sich Teilnehmer, die einander nicht vertrauen, ohne eine zentrale Stelle darauf, wer was besitzt?',
    'Die Stufen führen vom Aufbau über Konsensverfahren, Smart Contracts und Skalierung bis zu den Sicherheitsannahmen und der Ökonomie der Transaktionsreihenfolge.',
  ],
  keywords: [
    'Blockchain',
    'Hash',
    'Konsens',
    'Proof of Work',
    'Proof of Stake',
    'Smart Contract',
  ],
  related: ['bitcoin-krypto', 'wie-funktioniert-der-markt', 'derivat'],
  levels: {
    // ---------------------------------------------------------------- Beginner
    beginner: {
      metaTitle: 'Blockchain einfach erklärt: Aufbau und Zweck',
      metaDescription:
        'Wie Blöcke verkettet werden, was ein Hash ist, welches Problem damit gelöst wird und was eine Blockchain ausdrücklich nicht leistet.',
      title: 'Wie die Kette funktioniert',
      lead: 'Der Aufbau in vier Begriffen, das Problem, das sie löst – und die vier Dinge, die sie nicht kann.',
      readingMinutes: 11,
      status: 'complete',
      blocks: [
        {
          type: 'paragraph',
          text: 'Stell dir ein Kassenbuch vor, das nicht bei einer Bank liegt, sondern von tausenden Teilnehmern gleichzeitig geführt wird. Jeder hat eine vollständige Kopie, jeder sieht jede Buchung, und niemand kann eine ältere Zeile heimlich ändern. Genau das ist eine Blockchain – der Rest sind die Mittel, mit denen das erzwungen wird.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Vier Begriffe genügen',
        },
        {
          type: 'table',
          caption: 'Der Aufbau',
          head: ['Begriff', 'Was es ist'],
          rows: [
            [
              'Transaktion',
              'Eine einzelne Buchung: Von dieser Adresse geht dieser Betrag an jene Adresse',
            ],
            ['Block', 'Ein Bündel von Transaktionen, die zusammen bestätigt werden'],
            [
              'Hash',
              'Eine Prüfsumme fester Länge. Ändert sich am Inhalt auch nur ein Zeichen, kommt eine völlig andere Prüfsumme heraus',
            ],
            [
              'Kette',
              'Jeder Block enthält den Hash seines Vorgängers – dadurch hängen alle Blöcke aneinander',
            ],
          ],
        },
        {
          type: 'figure',
          figure: 'blockchain-kette',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Warum sich nichts nachträglich ändern lässt',
          items: [
            'Ändert jemand eine Transaktion in einem alten Block, ändert sich dessen Hash.',
            'Der nächste Block enthält aber noch den **alten** Hash – die Kette passt nicht mehr zusammen und die Manipulation ist sofort sichtbar.',
            'Wer die Änderung verstecken will, müsste jeden Folgeblock ebenfalls neu berechnen. Genau das kostet Aufwand, und genau darin besteht der Schutz.',
            'Dazu kommt der zweite Teil: Alle anderen Teilnehmer haben die richtige Version. Eine abweichende Kopie wird schlicht nicht anerkannt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Das Problem dahinter',
        },
        {
          type: 'paragraph',
          text: 'Digitale Dinge lassen sich beliebig kopieren. Wer eine Datei zweimal verschickt, hat sie zweimal verschickt – bei Geld wäre das fatal und heißt **Double Spending**. Bisher löste man das durch eine zentrale Stelle: Die Bank führt das einzige gültige Konto und schließt eine doppelte Ausgabe aus.',
        },
        {
          type: 'paragraph',
          text: 'Eine Blockchain löst dasselbe Problem ohne zentrale Stelle. Sie ersetzt das Vertrauen in eine Institution durch Vertrauen in ein Regelwerk, dessen Einhaltung jeder selbst nachprüfen kann. Das ist die eigentliche Leistung – und sie ist erheblich. Sie ist nur eben teuer erkauft.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wer die Blöcke schreibt – und warum er das tut',
        },
        {
          type: 'paragraph',
          text: 'Wenn es keine Bank gibt, muss trotzdem jemand entscheiden, welche Transaktionen in den nächsten Block kommen. Diese Aufgabe ist nicht vergeben, sie wird **gewonnen**. Bei Bitcoin und ähnlichen Netzen suchen Rechner weltweit gleichzeitig nach einer Zahl, mit der der Hash des neuen Blocks eine vorgegebene Bedingung erfüllt. Das lässt sich nur durch Ausprobieren finden – Millionen Versuche pro Sekunde – und ist danach in Millisekunden nachprüfbar. Wer zuerst fündig wird, darf den Block anhängen und bekommt dafür neue Münzen plus die Gebühren der enthaltenen Transaktionen.',
        },
        {
          type: 'paragraph',
          text: 'Das ist der ganze Trick: Schreiben kostet Strom und Hardware, Prüfen kostet nichts. Ein Angreifer müsste die Rechenleistung aller ehrlichen Teilnehmer zusammen übertreffen und dabei mehr Geld verbrennen, als der Betrug einbringt. **Proof of Work** heißt dieses Verfahren – Arbeitsnachweis. Der oft zitierte Stromverbrauch ist also keine Panne, sondern genau die Kosten, die den Schutz erzeugen.',
        },
        {
          type: 'paragraph',
          text: 'Neuere Netze wie Ethereum arbeiten stattdessen mit **Proof of Stake**: Wer einen Block vorschlagen darf, wird unter denen ausgelost, die eigene Münzen als Pfand hinterlegt haben. Wer betrügt, verliert das Pfand. Die Idee ist dieselbe – Fehlverhalten muss teurer sein als der mögliche Gewinn –, nur der Einsatz ist Kapital statt Strom.',
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Bestätigt ist nicht dasselbe wie im Block',
          items: [
            'Es kann vorkommen, dass zwei Teilnehmer fast gleichzeitig einen gültigen Block finden. Dann gibt es kurzzeitig zwei Versionen der Kette.',
            'Das Netz löst das ohne Schiedsrichter: Es gilt die Kette, an der weitergebaut wird. Der andere Block fällt heraus, seine Transaktionen wandern zurück in die Warteschlange.',
            'Deshalb ist eine Zahlung nicht mit „ihr Block ist da“ sicher, sondern erst, wenn einige Blöcke darauf folgen. Bei Bitcoin gelten sechs als üblich, also rund eine Stunde.',
            'Eine Überweisung ist damit endgültiger als eine Kartenzahlung – zurückholen kann sie niemand –, aber sie ist auch langsamer endgültig, als es der Blick auf den ersten Block nahelegt.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Der Schlüssel ist das Konto',
        },
        {
          type: 'paragraph',
          text: 'Es gibt kein Konto im gewohnten Sinn und keine Zugangsdaten, die sich zurücksetzen lassen. Wer über Guthaben verfügt, beweist das mit einem **privaten Schlüssel** – einer sehr langen Zahl, die nur er kennt. Aus ihr wird der öffentliche Schlüssel und daraus die Adresse berechnet; der Weg zurück ist praktisch unmöglich. Eine Unterschrift mit dem privaten Schlüssel kann jeder prüfen, ohne den Schlüssel je zu sehen.',
        },
        {
          type: 'paragraph',
          text: 'Daraus folgt der wichtigste praktische Satz dieser Stufe: **Wer den Schlüssel hat, hat das Geld.** Es gibt keine Hotline, keine Legitimationsprüfung und kein Zurückbuchen. Ein verlorener Schlüssel bedeutet dauerhaft verlorenes Guthaben – die Münzen sind weiter in der Kette sichtbar, nur kann sie niemand mehr bewegen. Ein gestohlener Schlüssel bedeutet dasselbe für jemand anderen.',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was eine Blockchain nicht ist',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Vier verbreitete Missverständnisse',
          items: [
            '**Keine schnelle Datenbank.** Konsens unter vielen Teilnehmern kostet Zeit und Kapazität. Eine gewöhnliche Datenbank ist um Größenordnungen schneller und billiger – das ist kein Mangel der Technik, sondern der Preis für ihren Zweck.',
            '**Keine Garantie für richtige Daten.** Sie garantiert, dass Daten **unverändert** bleiben, nicht dass sie **stimmen**. Wer einen falschen Wert einträgt, hat ihn danach unveränderlich falsch eingetragen.',
            '**Nicht automatisch anonym.** Bei den großen öffentlichen Netzen ist jede Transaktion für jeden einsehbar, dauerhaft. Adressen sind pseudonym, nicht anonym – und Pseudonyme lassen sich zuordnen, sobald an einer Stelle eine Verbindung zur Person entsteht.',
            '**Nicht für alles geeignet.** Die Frage, an der die meisten Projekte scheitern, lautet schlicht: Warum keine Datenbank? Es gibt nur eine gute Antwort – weil niemand die zentrale Stelle sein darf oder kann. Trifft das nicht zu, ist die Datenbank überlegen.',
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
            'Jeder Block enthält den Hash des Vorgängers – deshalb macht jede nachträgliche Änderung alles Folgende ungültig.',
            'Gelöst wird das Double-Spending-Problem ohne zentrale Stelle.',
            'Schreiben ist teuer, Prüfen ist billig – darin besteht der Schutz, nicht in einer Aufsicht.',
            'Bestätigt ist eine Zahlung erst mit den Blöcken **nach** ihrem Block, nicht mit ihrem eigenen.',
            'Wer den privaten Schlüssel hat, hat das Geld. Es gibt kein Zurücksetzen und kein Zurückbuchen.',
            'Garantiert wird Unveränderlichkeit, nicht Richtigkeit.',
            'Wo eine zentrale Stelle zulässig ist, ist eine gewöhnliche Datenbank besser.',
          ],
        },
      ],
    },

    // -------------------------------------------------------- Fortgeschritten
    fortgeschritten: {
      metaTitle: 'Konsens, Smart Contracts und Skalierung',
      metaDescription:
        'Wie Proof of Work und Proof of Stake funktionieren, was Finalität bedeutet, wozu Smart Contracts taugen und woran Skalierung scheitert.',
      title: 'Konsens, Smart Contracts, Skalierung',
      lead: 'Wie sich Fremde einigen, was programmierte Verträge leisten – und warum Geschwindigkeit immer etwas kostet.',
      readingMinutes: 17,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Wie eine Einigung zustande kommt',
        },
        {
          type: 'paragraph',
          text: 'Wenn viele gleichzeitig Blöcke vorschlagen können, braucht es eine Regel, welcher gilt. Diese Regel muss teuer zu missbrauchen sein – sonst schlägt jemand beliebig viele gefälschte Blöcke vor. Zwei Verfahren haben sich durchgesetzt, und beide lösen das über Kosten.',
        },
        {
          type: 'table',
          caption: 'Zwei Wege, dasselbe Problem zu lösen',
          head: ['', 'Proof of Work', 'Proof of Stake'],
          rows: [
            [
              'Wer darf einen Block vorschlagen',
              'Wer als Erster eine aufwendige Rechenaufgabe löst',
              'Wer ausgewählt wird – die Wahrscheinlichkeit steigt mit dem hinterlegten Kapital',
            ],
            [
              'Was der Einsatz ist',
              'Rechenleistung und Strom, laufend',
              'Im Netz hinterlegte Coins, gebunden',
            ],
            [
              'Was Betrug kostet',
              'Die aufgewendeten Betriebskosten – der Angreifer behält seine Hardware',
              'Das hinterlegte Kapital wird eingezogen; die Sanktion trifft unmittelbar',
            ],
            [
              'Energiebedarf',
              'Hoch und zwangsläufig – der Aufwand **ist** die Sicherheit',
              'Sehr gering; der Hauptgrund für den Wechsel bei einigen Netzen',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Finalität – wann eine Zahlung endgültig ist',
          items: [
            'Bei **Proof of Work** ist eine Transaktion nie mathematisch endgültig. Sie wird mit jedem Folgeblock nur unwahrscheinlicher rückgängig zu machen. Die üblichen sechs Bestätigungen sind eine Konvention, keine Garantie.',
            'Bei **Proof of Stake** ist echte Finalität möglich: Nach einer festgelegten Zahl von Runden gilt ein Block als endgültig, weil ein Rückgängigmachen den Einzug erheblicher Sicherheiten auslösen würde.',
            'Für die Praxis heißt das: Wer eine Zahlung annimmt, sollte wissen, ab wann er liefern darf. Bei kleinen Beträgen genügt eine Bestätigung, bei großen deutlich mehr – der Wert der Ware bestimmt die nötige Sicherheit.',
          ],
        },
        {
          type: 'paragraph',
          text: 'Ein **Fork** entsteht, wenn sich die Regeln ändern. Ein geplantes Upgrade, dem alle folgen, ist unproblematisch. Folgt ein Teil der Teilnehmer nicht, laufen zwei Ketten dauerhaft parallel weiter – mit gemeinsamer Vergangenheit und getrennter Zukunft. Wer vorher Guthaben hielt, hält es danach auf beiden Ketten.',
        },
        {
          type: 'figure',
          figure: 'blockchain-zahlung',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Smart Contracts',
        },
        {
          type: 'paragraph',
          text: 'Ein **Smart Contract** ist kein Vertrag, sondern Programmcode, der auf dem Register liegt und von allen Teilnehmern identisch ausgeführt wird. Sein Reiz: Er läuft ab, ohne dass jemand ihn ausführen muss oder ihn stoppen könnte. Genau daraus folgen aber auch seine beiden Grundprobleme.',
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Zwei Probleme, die sich nicht wegprogrammieren lassen',
          items: [
            '**Das Oracle-Problem.** Ein Vertrag, der auf einen Aktienkurs, ein Wahlergebnis oder eine Lieferung reagieren soll, braucht diese Information von außen. Wer sie liefert, muss vertraut werden – und damit ist die zentrale Stelle wieder da, nur an anderer Stelle. Für rein netzinterne Vorgänge gilt das nicht; für fast alles andere schon.',
            '**Unveränderlichkeit als Risiko.** Ein Fehler im Code lässt sich nicht mit einem Update beheben. Große Beträge sind auf diesem Weg abgeflossen, weil eine Bedingung falsch formuliert war. Die üblichen Gegenmittel – Prüfungen durch Dritte, Notschalter, aktualisierbare Verträge – schwächen dabei genau die Eigenschaft ab, um derentwillen man die Konstruktion gewählt hat.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Skalierung: der unvermeidliche Zielkonflikt',
        },
        {
          type: 'paragraph',
          text: 'Mehr Transaktionen pro Sekunde erreicht man über größere Blöcke oder kürzere Abstände. Beides hat denselben Preis: Wer mitmachen will, braucht mehr Bandbreite und mehr Speicher. Damit können weniger Teilnehmer eine vollständige Kopie führen – und genau diese Vielzahl war der Punkt. **Geschwindigkeit wird immer gegen Dezentralisierung getauscht.**',
        },
        {
          type: 'list',
          items: [
            '**Zusatzschichten** bündeln viele Vorgänge außerhalb der Hauptkette und schreiben nur das Ergebnis hinein. Das funktioniert – bringt aber neue Vertrauensannahmen mit, über die Nutzer selten informiert sind.',
            '**Private und Konsortial-Blockchains** beschränken die Teilnehmer auf bekannte Beteiligte. Sie sind schneller, weil weniger Misstrauen zu überwinden ist. Damit sind sie allerdings nah an einer gemeinsam betriebenen Datenbank – und die Frage, warum es keine sein soll, wird umso dringlicher.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Wofür die Technik taugt – und wofür eine Datenbank reicht',
        },
        {
          type: 'paragraph',
          text: 'Eine Blockchain löst genau ein Problem: Sie erlaubt mehreren Parteien, die einander nicht vertrauen und keine gemeinsame Aufsicht anerkennen, sich auf eine Reihenfolge von Ereignissen zu einigen. Dafür bezahlt sie mit Geschwindigkeit, Kosten und Energie. Wo dieses Problem nicht besteht, ist sie die teurere Lösung für etwas, das eine Datenbank besser kann.',
        },
        {
          type: 'table',
          caption: 'Der Prüfstein: Wer soll wem nicht vertrauen müssen?',
          head: ['Frage', 'Wenn ja', 'Wenn nein'],
          rows: [
            [
              'Gibt es mehrere Parteien mit gegensätzlichen Interessen?',
              'Blockchain kann passen',
              'eine Datenbank reicht',
            ],
            [
              'Gibt es eine Stelle, der alle ohnehin vertrauen?',
              'diese Stelle führt die Datenbank – fertig',
              'Blockchain kann passen',
            ],
            [
              'Muss die Historie unveränderlich sein?',
              'spricht dafür',
              'spricht dagegen: Unveränderlichkeit ist ein Nachteil, sobald etwas korrigiert werden muss',
            ],
            [
              'Geht es um Dinge außerhalb der Kette?',
              'Vorsicht – die Kette kann nur prüfen, was in ihr steht',
              'unproblematisch',
            ],
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Das Orakelproblem',
          items: [
            'Eine Blockchain kann garantieren, dass ein Eintrag nicht verändert wurde. Sie kann **nicht** garantieren, dass er stimmt.',
            'Wer einen Diamanten, ein Bio-Zertifikat oder einen Grundbucheintrag auf eine Kette schreibt, hat einen fälschungssicheren Eintrag über eine Angabe, die jemand von außen eingetragen hat – und genau dort sitzt der Betrug, den man verhindern wollte.',
            'Deshalb funktionieren die Anwendungen, bei denen das Gut selbst digital ist und in der Kette entsteht, und deshalb scheitern die meisten Lieferketten-Projekte.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Was „dezentral" praktisch bedeutet',
        },
        {
          type: 'paragraph',
          text: 'Dezentral heißt nicht gleichmäßig verteilt. Es heißt, dass es keine zentrale Stelle gibt, die abschalten kann – während sich Rechenleistung, Software-Entwicklung und Zugang durchaus konzentrieren, und zwar regelmäßig stark.',
        },
        {
          type: 'list',
          items: [
            '**Die Rechenleistung liegt bei wenigen Zusammenschlüssen.** Wenige davon zusammen erreichen regelmäßig einen erheblichen Anteil der gesamten Leistung.',
            '**Die Software schreiben wenige Personen.** Wer die Regeln ändert, entscheidet über die Kette – auch ohne Mehrheitsbesitz.',
            '**Der Zugang läuft über wenige große Handelsplätze.** Für die meisten Nutzer ist das die eigentliche zentrale Stelle: Sie hält die Schlüssel und kann Auszahlungen anhalten.',
            '**Was tatsächlich dezentral ist, ist die Regelprüfung.** Jeder kann nachrechnen, ob ein Block gültig ist – und das ist der Teil, der die Sache trägt.',
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
            'Beide Konsensverfahren machen Betrug teuer – nur mit verschiedenen Mitteln.',
            'Finalität ist bei Proof of Work eine Wahrscheinlichkeit, bei Proof of Stake erreichbar.',
            'Das Oracle-Problem holt die zentrale Stelle zurück, sobald Daten von außen nötig sind.',
            'Geschwindigkeit geht immer zulasten der Dezentralisierung.',
            'Eine Blockchain löst Uneinigkeit ohne vertrauenswürdige Mitte – und bezahlt mit Tempo und Kosten.',
            'Gibt es eine Stelle, der alle vertrauen, ist eine Datenbank die bessere Lösung.',
            'Die Kette sichert, dass ein Eintrag unverändert ist, nicht dass er stimmt.',
            'Dezentral heißt „niemand kann abschalten", nicht „gleichmäßig verteilt".',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Profi
    profi: {
      metaTitle: 'Blockchain für Profis: Angriffe, Zentralisierung, MEV',
      metaDescription:
        'Byzantinische Fehlertoleranz und ihre Annahmen, Angriffsszenarien, Zentralisierungstendenzen sowie die Ökonomie der Transaktionsreihenfolge.',
      title: 'Sicherheitsannahmen und Anreize',
      lead: 'Worauf die Sicherheit tatsächlich beruht, wo sie erodiert – und was es wert ist, über die Reihenfolge zu entscheiden.',
      readingMinutes: 13,
      status: 'complete',
      blocks: [
        {
          type: 'heading',
          level: 2,
          text: 'Was genau angenommen wird',
        },
        {
          type: 'paragraph',
          text: 'Die theoretische Grundlage heißt **byzantinische Fehlertoleranz**: Ein System bleibt funktionsfähig, solange ein hinreichender Teil der Teilnehmer sich regelkonform verhält – auch wenn der Rest nicht nur ausfällt, sondern aktiv täuscht. Die Annahmen dahinter sind präziser, als die Werbung nahelegt, und jede einzelne ist verletzbar.',
        },
        {
          type: 'list',
          items: [
            '**Die Mehrheit ist ehrlich – oder zumindest eigennützig.** Das Modell unterstellt, dass Teilnehmer ihren wirtschaftlichen Vorteil verfolgen. Ein Angreifer, der Verluste in Kauf nimmt, um das System zu schädigen, ist darin nicht vorgesehen. Bei staatlichen Akteuren ist das keine theoretische Möglichkeit.',
            '**Nachrichten kommen an.** Das Netz muss Informationen verlässlich verteilen. Wer einen Teilnehmer von den ehrlichen Knoten abschneidet und ihm eine gefälschte Sicht liefert, greift ihn einzeln an – ein **Eclipse-Angriff**, der ohne Mehrheit auskommt.',
            '**Die Vergangenheit ist verlässlich.** Bei Proof of Stake kann ein Angreifer, der alte Schlüssel aufkauft, aus deren Vergangenheit heraus eine alternative Kette bauen – ein **Long-Range-Angriff**. Dagegen helfen nur zusätzliche Annahmen wie regelmäßige Prüfpunkte, die außerhalb des reinen Protokolls entstehen.',
          ],
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Die Zentralisierung, die sich nicht abstellen lässt',
          items: [
            '**Mining-Pools.** Einzelne Betreiber haben nur bei gebündelter Rechenleistung planbare Erträge. Daraus entstehen wenige große Pools – und damit eine Konzentration, die genau der Grundidee widerspricht.',
            '**Staking-Anbieter.** Dasselbe Muster: Wer nicht selbst betreiben will, gibt sein Kapital an einen Dienstleister. Wenige Anbieter kontrollieren dadurch einen erheblichen Anteil.',
            '**Vollständige Knoten.** Wachsen Datenmenge und Anforderungen, betreiben immer weniger Teilnehmer eine eigene vollständige Kopie – und damit können immer weniger die Regeln tatsächlich selbst prüfen.',
            'Alle drei folgen aus Skaleneffekten, nicht aus Fehlverhalten. Sie lassen sich abmildern, nicht beseitigen – und sie sind der ehrlichste Einwand gegen die Erzählung von der Dezentralisierung.',
          ],
        },
        {
          type: 'heading',
          level: 2,
          text: 'Die Reihenfolge ist Geld wert',
        },
        {
          type: 'paragraph',
          text: 'Wer einen Block zusammenstellt, entscheidet, welche Transaktionen hineinkommen und in welcher Reihenfolge. Das ist keine technische Nebensache, sondern eine Ertragsquelle – im Fachbegriff **MEV**, der Wert, der sich aus der Kontrolle über die Reihenfolge ziehen lässt.',
        },
        {
          type: 'table',
          caption: 'Wie das ausgenutzt wird',
          head: ['Vorgehen', 'Was passiert'],
          rows: [
            [
              'Front-Running',
              'Ein einträglicher Auftrag wird in der Warteschlange gesehen und ein eigener davorgesetzt',
            ],
            [
              'Sandwich-Angriff',
              'Ein eigener Auftrag davor, ein zweiter dahinter – der Kurs wird zulasten des ursprünglichen Auftrags bewegt',
            ],
            [
              'Liquidationen',
              'Das Recht, eine überfällige Position aufzulösen, wird zur bevorzugten Position im Block',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'Bemerkenswert daran ist die Parallele: An regulierten Börsen ist Front-Running verboten und wird verfolgt. Hier ist es kein Regelverstoß, sondern eine Eigenschaft des Systems – die Reihenfolge ist frei, und wer sie bestimmt, darf sie verkaufen. Ein System, das ohne Vertrauen auskommen sollte, hat damit eine Ertragsquelle geschaffen, die es an regulierten Märkten nicht mehr gibt.',
        },
        {
          type: 'figure',
          figure: 'blockchain-reihenfolge',
        },
        {
          type: 'heading',
          level: 2,
          text: 'Gebühren und Langfristrisiken',
        },
        {
          type: 'list',
          items: [
            '**Der Gebührenmarkt.** Blockplatz ist knapp, also wird geboten. Bei Überlast steigen die Gebühren nicht linear, sondern sprunghaft – kleine Transaktionen werden dann unwirtschaftlich, und das trifft ausgerechnet die Anwendungen, die als Zahlungsmittel gedacht waren.',
            '**Die Sicherheit auf lange Sicht.** Bei Proof of Work sinkt die Blockbelohnung planmäßig gegen null. Danach muss die Sicherheit allein aus Gebühren finanziert werden. Ob diese dafür ausreichen, ist eine offene Frage – und die vermutlich wichtigste ungelöste Frage des Modells.',
            '**Kryptografische Langzeitrisiken.** Die verwendeten Verfahren gelten heute als sicher. Ein hinreichend leistungsfähiger Quantenrechner würde die gebräuchlichen Signaturverfahren angreifbar machen. Es gibt Nachfolgeverfahren; die Schwierigkeit liegt nicht in ihnen, sondern in der Migration eines Systems, das absichtlich niemandem gehört und deshalb von niemandem umgestellt werden kann.',
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
            'Die Sicherheitsannahmen setzen eigennützige Teilnehmer voraus – ein Angreifer, der Verluste hinnimmt, ist nicht vorgesehen.',
            'Eclipse- und Long-Range-Angriffe kommen ohne Mehrheit aus.',
            'Zentralisierung bei Pools, Staking-Anbietern und Knoten folgt aus Skaleneffekten und lässt sich nur abmildern.',
            'Die Kontrolle über die Transaktionsreihenfolge ist eine Ertragsquelle, die an regulierten Märkten verboten wäre.',
          ],
        },
      ],
    },
  },
}
