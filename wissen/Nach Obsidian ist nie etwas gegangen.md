---
titel: Nach Obsidian ist nie etwas gegangen
datum: 2026-09-29
quelle: ENTSCHEIDUNGEN.md
tags:
  - projektgedaechtnis
  - website-1
---
> [!info] Abbild – nicht hier bearbeiten
> Diese Notiz wird aus `ENTSCHEIDUNGEN.md` im Repository `Website-1` erzeugt
> (`ANWENDEN=1 npm run wissen`). Änderungen hier überschreibt der nächste Lauf.

# Nach Obsidian ist nie etwas gegangen – 29. September 2026

Gefragt hat der Betreiber: „Wurden eigentlich in den letzten Wochen und
Monaten alle Informationen in Obsidian gespeichert? Überprüfe das mal, und es
sollen auch weiterhin immer alle Inhalte dort gespeichert werden."

Nachgesehen, bevor geantwortet wurde:

    Website-1, Arbeitsbaum und ganze Historie   kein Treffer für „obsidian"
    alles-m-gliche- (der lokale Arbeitstisch)   eine Datei, CLAUDE.md
    verbundene Connectors                       Gmail, Kalender, Drive
    MCP-Verzeichnis                             gar kein Obsidian-Connector
    dieser Container                            nichts dieses Namens
    Google Drive durchsuchen                    verweigert (Insufficient scope)

**Es ist nie etwas nach Obsidian geschrieben worden, kein einziges Mal.**

Der tragende Befund ist nicht, dass nichts zu finden ist – das wäre ein
Zwischenstand. Er ist, dass in **keiner** der beiden `AGENTS.md`/`CLAUDE.md`
je eine Regel dazu stand. Was dort nicht steht, tut keine Sitzung; das ist
dieselbe Einsicht wie „Ein Satz im Prompt ist keine Regel, solange ihn kein
Prüfer liest", nur eine Ebene höher.

Die eine Lücke im Befund steht oben und wird nicht weggelassen: Google Drive
ließ sich nicht durchsuchen. Läge dort ein Vault-Ordner, hätte ich ihn nicht
gesehen.

## Warum es überhaupt einen Weg braucht

Weil der naheliegende nicht existiert. Eine Cloud-Sitzung erreicht nur GitHub,
Obsidian läuft auf dem Rechner des Betreibers, und einen Obsidian-Connector
gibt es nicht – nicht bei den verbundenen und auch keinen im Verzeichnis.

Damit ist die Frage nicht „wie schreibe ich in den Vault?", sondern die
allgemeinere aus den Lehren: **„Wer kommt an ihn, und wie bekomme ich sein
Ergebnis?"** Die Antwort ist dieselbe wie bei den Quellen, nur in die andere
Richtung: Das Repository ist der Kanal, und die lokale Sitzung hebt es auf die
andere Seite.

    ENTSCHEIDUNGEN.md ─┐
                       ├─ ANWENDEN=1 npm run wissen ──▶ wissen/  (im Repo)
    AGENTS.md ─────────┘                                   │
                                                           │ lokale Sitzung
                                            wissen-in-vault.ps1 -Anwenden
                                                           ▼
                                                  <Vault>\Website-1\

## Abbild, nicht zweite Fassung

`wissen/` wird **erzeugt** und nicht gepflegt. Der Text der Quelle steht
wörtlich in der Notiz; umformuliert wird nichts.

Der Grund ist der teuerste Fehler dieses Hauses in seiner Textgestalt: Eine
Notiz, die jemand im Vault bearbeitet, und ein Abschnitt in
`ENTSCHEIDUNGEN.md`, der weiterläuft – nach vier Wochen weiß niemand mehr,
welcher von beiden gilt. Deshalb steht in jeder Notiz ein Kasten „Abbild –
nicht hier bearbeiten", und deshalb ist der Ordner von Prettier ausgenommen:
Ein Umbruch, den der Formatierer anders setzt als die Quelle, wäre schon der
Anfang der zweiten Fassung.

Eigene Gedanken haben im Vault trotzdem Platz – nur nicht in diesem einen
Ordner. Beide Spiegelskripte fassen nichts an, was außerhalb liegt, und
löschen nur, was sie selbst geschrieben haben (erkennbar am `quelle:`-Feld im
Kopf). Eine Datei ohne diesen Kopf bleibt liegen und wird gemeldet.

## Der Riegel, ohne den es ein Zettel wäre

**Ein Abbild, das niemand nachzieht, wird stillschweigend falsch** – und ein
Vault, der die Regeln von vorletzter Woche zeigt, sieht aus wie einer, der
stimmt. Genau der stille Fehler.

`tests/wissen.test.ts` vergleicht deshalb Zeichen für Zeichen. Gegenprobe am 29. September: ein erfundener `##`-Abschnitt an `ENTSCHEIDUNGEN.md` angehängt,
und der Lauf wird rot („der Ordner ist auf Stand" schlägt fehl, zwei Notizen
abweichend). Ohne diese Probe wäre nur bewiesen, dass die Prüfung existiert.

Dazu zwei Eigenschaften, an denen ein Vault zerbricht:

- **Kein Link zeigt ins Leere.** Obsidian legt beim Klick auf einen toten
  `[[Link]]` eine leere Notiz an – aus einem übersehenen Verweis würde eine
  erfundene. Geprüft werden alle 127 Links samt Ankern.
- **Kein Dateiname, den Windows ablehnt.** `: * ? " < > |` und der Punkt am
  Ende entstehen hier klaglos und scheitern erst auf dem Zielrechner.

## Was dabei über die Quelle herauskam

`ENTSCHEIDUNGEN.md` ist nicht so gebaut, wie seine eigene Einleitung
behauptet. Dort steht: „Die Abschnittsüberschriften sind dieselben wie die
Verweise in `AGENTS.md`." Nachgezählt stimmt das für **elf** der zwanzig
Verweise. Die anderen neun zeigen auf eine `##`- oder `###`-Überschrift, die
unter einer ganz anderen `#`-Überschrift einsortiert ist: Neue Fälle sind über
Monate unter die jeweils letzte Hauptüberschrift gehängt worden.

Vier der zwanzig Abschnitte tragen dadurch 161.000 der 231.000 Zeichen:

    62.000   Ein Kurs ist so alt wie die Stelle, die ihn anzeigt   (13 Unterpunkte)
    49.000   Der Google-Bewertungslink: raus und am selben Tag zurück
    30.000   Diese Umgebung erreicht nur GitHub
    21.000   Selbst mergen, ohne zu fragen

„Ein Commit vom Bot löst nichts aus" steht unter „Ein Kurs ist so alt wie die
Stelle, die ihn anzeigt". Mit Kursen hat es nichts zu tun.

**Geradegezogen wurde das hier nicht.** Die Überschriftenebenen von 231.000
Zeichen zu verschieben ist eine eigene Sitzung mit eigenem Urteil darüber, was
ein Fall ist und was ein Kapitel darin – und ein Umbau am Gedächtnis selbst
gehört nicht nebenbei gemacht. Stattdessen zwei Dinge, die ohne dieses Urteil
auskommen: Jeder Verweis bekommt den **Anker** auf seine Überschrift und
landet damit auch in einer Notiz von sechzigtausend Zeichen an der richtigen
Stelle, und die Übersicht listet die Unterpunkte jeder Notiz mit auf, die mehr
als drei hat. Wer „Ein Commit vom Bot löst nichts aus" sucht, findet es.

Der Befund bleibt als Befund stehen – mit Datum, Ort und Liste, wie es sich
gehört.
