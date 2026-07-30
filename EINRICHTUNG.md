# Einrichtung: die Zugangsdaten

Alles in diesem Projekt baut und prüft ohne einen einzigen Zugang. Einige Dinge
brauchen trotzdem Zugangsdaten, weil sie nach außen wirken:

| Was                               | Secrets                                                         | Ohne sie passiert                                         |
| --------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| Website ausliefern                | `HOSTINGER_SSH_HOST`, `HOSTINGER_SSH_USER`, `HOSTINGER_SSH_KEY` | Das Paket wird gebaut und geprüft, aber nicht hochgeladen |
| Quartalstermine außerhalb der USA | `TWELVEDATA_API_KEY`                                            | Es bleibt bei 158 von 1.029 Aktien – nur die SEC-Melder   |
| Unternehmenszahlen aus Korea      | `DART_API_KEY`                                                  | Die 15 koreanischen Titel bleiben ohne Kennzahlen         |
| Unternehmenszahlen aus Japan      | `EDINET_API_KEY`                                                | Die Abfrage, ob sich der Weg lohnt, unterbleibt           |

Alle gehören an **eine** Stelle:

```
https://github.com/PeterPan405/Website-1/settings/secrets/actions
```

## Secrets, nicht Variables

Auf dieser Seite gibt es zwei Reiter. Der Unterschied ist keine Geschmacksfrage:

- **Variables** sind für jeden lesbar, der das Repository sehen kann, und stehen
  im Klartext in den Workflow-Protokollen.
- **Secrets** werden verschlüsselt gespeichert und in Protokollen automatisch
  durch `***` ersetzt.

Ein Zugangsschlüssel unter Variables wäre öffentlich. Also immer **Secrets**.

Nach dem Speichern ist ein Secret nicht mehr einsehbar, nur überschreibbar. Das
ist beabsichtigt und kein Grund, sich den Wert daneben zu notieren.

> **Wenn ein Schlüssel je irgendwo anders gestanden hat** – in einer Nachricht,
> einem Commit, einem Screenshot –, gilt er als verbrannt. Beim Anbieter neu
> erzeugen und den neuen hinterlegen. Ein Schlüssel, der einmal sichtbar war,
> wird nicht dadurch wieder geheim, dass man ihn löscht.

---

## 1 · Website ausliefern (SSH)

### 1.1 Schlüsselpaar erzeugen

```
ssh-keygen -t ed25519 -f ~/.ssh/iminvests_deploy -C "github-actions" -N ""
```

`-N ""` heißt **ohne Passphrase**. Das ist Bedingung, nicht Nachlässigkeit: Ein
Workflow kann keine Passphrase eintippen. Mit Passphrase bleibt der Lauf hängen.

Es entstehen zwei Dateien:

| Datei                         | Art                 | Wohin                |
| ----------------------------- | ------------------- | -------------------- |
| `~/.ssh/iminvests_deploy.pub` | öffentlich, harmlos | zum Hoster           |
| `~/.ssh/iminvests_deploy`     | **privat, geheim**  | in das GitHub-Secret |

### 1.2 Öffentlichen Schlüssel beim Hoster eintragen

```
cat ~/.ssh/iminvests_deploy.pub
```

Eine einzelne Zeile, beginnt mit `ssh-ed25519 AAAAC3…`, endet mit
`github-actions`. Diese Zeile im hPanel unter dem SSH-Zugang als neuen Schlüssel
eintragen.

Auf derselben Seite stehen zwei Werte, die gleich gebraucht werden:

- eine **IP-Adresse** – vier Zahlengruppen, etwa `84.32.84.32`
- ein **Benutzername** – meist `u` und Ziffern, etwa `u123456789`

Der Port wird nicht gebraucht: `65002` steht fest in
`.github/workflows/veroeffentlichen.yml`, ebenso das Ziel
`domains/iminvests.de/public_html`.

### 1.3 Privaten Schlüssel kopieren

Nicht mit der Maus markieren – dabei geht der Zeilenumbruch am Ende verloren, und
daran scheitert es am häufigsten.

```
pbcopy < ~/.ssh/iminvests_deploy                       # macOS
xclip -sel clip < ~/.ssh/iminvests_deploy              # Linux
Get-Content ~/.ssh/iminvests_deploy | Set-Clipboard    # Windows, PowerShell
```

Der Inhalt beginnt mit `-----BEGIN OPENSSH PRIVATE KEY-----` und endet mit
`-----END OPENSSH PRIVATE KEY-----`.

### 1.4 Die drei Secrets anlegen

Jeweils **New repository secret** → **Name** → **Secret** → **Add secret**.

| Name                 | Wert                                          |
| -------------------- | --------------------------------------------- |
| `HOSTINGER_SSH_HOST` | die IP aus 1.2                                |
| `HOSTINGER_SSH_USER` | der Benutzername aus 1.2                      |
| `HOSTINGER_SSH_KEY`  | eingefügt aus 1.3, vollständig und mehrzeilig |

### 1.5 Auslösen und ablesen

Actions → linke Spalte **Veröffentlichen** → **Run workflow**.

Im Schritt **Zugangsdaten prüfen** steht das Ergebnis wörtlich:

- Fehlt eines der drei:
  `Keine SSH-Zugangsdaten hinterlegt – es wird nichts übertragen.`
  Der Lauf wird trotzdem **grün**. Grün heißt hier also nicht „hochgeladen“ – das
  ist Absicht, damit ein Repository ohne Zugangsdaten nicht bei jedem Lauf rot
  wird.
- Sind alle drei da, laufen **Bauen**, **Ergebnis prüfen**, **Archiv packen**,
  **SSH einrichten** und die Übertragung. Am Ende steht der Inhalt von
  `version.txt` – das ist der Beleg, dass die Seite auf dem Webspace liegt.

Danach löst jeder erfolgreiche Lauf von **Paket bauen** auf `main` die
Veröffentlichung selbst aus.

---

## 2 · Quartalstermine außerhalb der USA

### 2.1 Zuerst: den Workflow auf `main` bringen

`quartalstermine.yml` muss auf dem Standardbranch liegen. GitHub zeigt den Knopf
**Run workflow** ausschließlich für Workflows auf `main` – vorher gibt es den
Eintrag in der Actions-Spalte nicht, unabhängig vom Schlüssel.

Das Secret lässt sich trotzdem schon vorher anlegen; es wartet einfach.

### 2.2 Schlüssel besorgen

Kostenloses Konto bei Twelve Data. Der Schlüssel ist eine zusammenhängende
Zeichenkette aus Kleinbuchstaben und Ziffern, etwa 32 Zeichen, ohne Bindestriche
und ohne Leerzeichen.

Der kostenlose Tarif genügt: `scripts/quartalstermine-abrufen.ts` wartet 8,5
Sekunden zwischen zwei Abfragen und bleibt damit unter dem Minutenlimit; der
Workflow hat 120 Minuten Zeitbudget.

### 2.3 Secret anlegen

| Name                 | Wert                                                                           |
| -------------------- | ------------------------------------------------------------------------------ |
| `TWELVEDATA_API_KEY` | die Zeichenkette, ohne Anführungszeichen, ohne Leerzeichen davor oder dahinter |

### 2.3a Die beiden asiatischen Schlüssel

Beide sind kostenlos und beide bei der jeweiligen Aufsicht direkt zu bekommen:

| Name             | Woher                                                         |
| ---------------- | ------------------------------------------------------------- |
| `DART_API_KEY`   | Registrierung bei `opendart.fss.or.kr` (Finanzaufsicht Korea) |
| `EDINET_API_KEY` | Registrierung bei EDINET (Finanzaufsicht Japan)               |

Sie gehören an dieselbe Stelle wie die übrigen: **Settings → Secrets and
variables → Actions → New repository secret.** Nicht in eine Datei im
Repository und **nicht in den Chat** – Workflow-Protokolle sind lesbar, und
ein einmal veröffentlichter Schlüssel muss zurückgezogen werden.

Ohne sie passiert nichts Schlimmes: Beide Skripte melden die fehlende
Einstellung und enden erfolgreich. Eine fehlende Zugangsdatei ist ein Zustand
und kein Fehlschlag.

**Was danach kommt, ist bei beiden verschieden.** Korea liefert den fertigen
Abschluss als JSON; `npm run dart` liest ihn und ergänzt die Kennzahlen. Japan
liefert Dokumente: Der Abschluss steckt in einem ZIP mit einer XBRL-Instanz
darin, und der Weg dorthin ist deutlich länger. `npm run edinet` klopft
deshalb vorerst nur ab, ob die Schnittstelle antwortet und ob unter den
Jahresberichten Titel dieses Katalogs vorkommen. Es schreibt keine Datei. Erst
wenn diese Abfrage trägt, lohnt der zweite Schritt.

### 2.3b Warum es zwei Läufe braucht

Ohne den Schlüssel steht der Kalender bei **158 von 1.029** Aktien – das sind
genau die, die bei der SEC ein 8-K einreichen. Von den 871 offenen sind 817
über Twelve Data erreichbar.

Sie passen aber nicht in einen Lauf. Der kostenlose Tarif erlaubt acht Anfragen
je Minute, daher die 8,5 Sekunden Pause; 817 Abfragen wären 116 Minuten, und
der Workflow hat 120. Vier Minuten Puffer sind keine – eine langsame Antwort,
und GitHub bricht bei 120 Minuten ab. Geschrieben wäre dann **nichts**, denn
der Prozess stirbt vor dem Speichern.

Der Abruf hört deshalb nach 75 Minuten von selbst auf, schreibt, was er hat,
und merkt sich je Kürzel den Tag des Versuchs. Der nächste Lauf beginnt bei den
am längsten nicht versuchten. **Nach zwei Wochenläufen ist das Feld einmal
durch**; danach hält sich der Bestand von selbst frisch, weil immer die
ältesten Einträge nachgezogen werden.

Im Protokoll steht, was passiert ist:

```
817 Aktien ohne Termin – zweiter Anlauf über Twelve Data.
  Zeitbudget: 75 Minuten, das reicht für rund 529 Abfragen.
  … 525 von 817
Zeitbudget nach 529 Abfragen aufgebraucht.
```

### 2.4 Auslösen und ablesen

Actions → **Quartalstermine aktualisieren** → **Run workflow**.

Im Schritt **Quartalstermine abrufen** entscheidet eine Zeile, ob der Schlüssel
angekommen ist:

- nicht erkannt:
  `Kein TWELVEDATA_API_KEY hinterlegt – der zweite Weg bleibt zu.`
- erkannt:
  `… Aktien ohne Termin – zweiter Anlauf über Twelve Data.`

Am Ende des Protokolls stehen die Zeilen, auf die es ankommt:

```
Davon über Twelve Data nachgeholt: …

Stand: … von 1.029 Aktien mit Terminen, … ohne.
```

Ab dann läuft der Abruf montags um 05:00 UTC von allein.

---

## Der Zeitplan: was von selbst läuft

Alle Daten dieser Website werden von GitHub Actions abgerufen, in das
Repository geschrieben und ausgeliefert – ohne Zutun. Ein Datencommit auf
`main` löst „Paket bauen" aus, das bei Erfolg „Veröffentlichen" auslöst, und
das lädt auf den Webspace. Von der neuen Zahl bis zur Website sind es etwa
elf Minuten.

| Was                               | Wann (UTC)                                          | Warum dieser Abstand                                                                                                                                                    |
| --------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kurse** (und Dividenden)        | werktags alle 30 Min., 07:00–21:30                  | Handelszeit von Tokio bis New York. Das Ende deckt die Schlussglocke in New York auch im Winterhalbjahr ab – dort schließt sie um 21:00 UTC.                            |
| **Kurse**, nur Krypto und Devisen | Sa/So alle 3 Std.                                   | Bitcoin handelt an 365 Tagen, Aktien nicht. Der Wochenendlauf holt deshalb nur, was sich bewegt: fünf Anfragen statt tausend.                                           |
| **Quartalstermine**               | montags 05:20                                       | Unternehmen geben ihre Meldetermine laufend bekannt; eine Woche ist der Abstand, in dem eine Ankündigung spätestens ankommt.                                            |
| **Unternehmenszahlen**            | samstags 06:00                                      | Die Meldungen kommen in Wellen – Ende Januar, April, Juli und Oktober legen hunderte Firmen innerhalb weniger Tage vor. Monatlich hieße bis zu vier Wochen alte Zahlen. |
| **Länderdaten**                   | am 1. um 04:40                                      | Weltbank, IWF und OECD aktualisieren ihre Reihen in Abständen von Monaten. Öfter abzurufen liefert dieselben Zahlen.                                                    |
| **Paket bauen**                   | bei jedem Push auf `main`, zusätzlich täglich 04:15 | Der tägliche Lauf ist die Rückversicherung: Er baut auch dann, wenn einen Tag lang niemand etwas geändert hat.                                                          |
| **Website prüfen**                | täglich 06:30                                       | Ruft die veröffentlichte Seite von außen ab und schlägt an, wenn sie nicht antwortet oder der Kursstand in `/version.txt` älter als 30 Stunden ist.                     |

Die Zeiten sind bewusst gegeneinander versetzt. Fiele der Monatserste auf
einen Montag, liefen Länderdaten und Quartalstermine sonst gleichzeitig und
schrieben auf denselben Zweig; der Rebase-Versuch fängt das ab, aber ein
Zusammenstoß, den man verhindern kann, gehört verhindert.

**„Quellen abklopfen" hat bewusst keinen Zeitplan.** Der Workflow probiert
Datenquellen durch und schreibt das Ergebnis in sein eigenes Protokoll; er
verändert nichts. Ein wöchentlicher Lauf erzeugte Meldungen, auf die niemand
reagiert – und eine Prüfung, die man nicht mehr ansieht, ist keine. Ob eine
Quelle noch liefert, beantwortet die Frischeprüfung in „Website prüfen", und
die schlägt nur an, wenn tatsächlich etwas fehlt.

### Warum der Abruf nicht auf einem Arbeitszweig laufen sollte

Der Kursabruf schreibt drei Dateien unter `data/snapshots/`: den Kursstand
`kurse-aktuell.json` alle dreißig Minuten, die Historie `markets.json` einmal
je Handelstag und `dividenden.json` nur bei einer neuen Zahlung. Läuft er
sowohl planmäßig auf `main` als auch von Hand auf einem Arbeitszweig, ändern
beide Seiten dieselben Dateien, und der Pull Request lässt sich nicht mehr
zusammenführen: GitHub meldet „unable to merge", obwohl am Code nichts fehlt.

Das ist genau zweimal passiert und beide Male auf dieselbe Weise gelöst:

```bash
git fetch origin main
git merge origin/main            # Konflikt nur in den Momentaufnahmen
git checkout --ours data/snapshots/kurse-aktuell.json   # oder --theirs
git checkout --ours data/snapshots/markets.json         # oder --theirs
git add data/snapshots && git commit --no-edit
```

Welche Seite die richtige ist, entscheidet nicht die Reihenfolge, sondern der
Inhalt: die mit **mehr Instrumenten**, bei gleicher Zahl die **neuere**. Beide
Angaben stehen im Kopf der Datei beziehungsweise lassen sich zählen:

```bash
git show HEAD:data/snapshots/kurse-aktuell.json | head -c 200
```

Seit der Trennung ist der Konflikt seltener und harmloser: Betroffen ist meist
nur die kleine Datei, und die lässt sich notfalls in einer Sekunde neu erzeugen,
indem man den Abruf noch einmal laufen lässt.

Vermeiden lässt sich der Konflikt ganz: Seit die Zeitpläne stehen, holt `main`
die Kurse von selbst. Ein Abruf von Hand auf einem Arbeitszweig ist damit nur
noch nötig, wenn neue Instrumente dazugekommen sind und ihre Kurse sofort
gebraucht werden – etwa um sie vor dem Zusammenführen zu prüfen. Danach gehört
der Zweig zusammengeführt, bevor der nächste planmäßige Lauf auf `main` daran
vorbeizieht.

### Was den Zeitplan stillschweigend anhält

GitHub schaltet geplante Workflows in einem Repository ab, in dem **60 Tage**
lang niemand etwas ändert. Es gibt dann keine Fehlermeldung – die Läufe hören
einfach auf. Wer die Website längere Zeit unbeaufsichtigt lässt, sollte das
wissen: Ein einzelner Commit genügt, um die Zeitpläne wieder zu aktivieren.

## Was hier bewusst nicht steht

Klickpfade in hPanel und im Twelve-Data-Dashboard. Beide Oberflächen ändern sich,
ohne dass es hier jemand merken würde – eine Anleitung mit erfundenen
Knopfbeschriftungen wäre schlechter als keine. Beschrieben ist deshalb, **woran
der richtige Wert zu erkennen ist**: eine IP mit vier Zahlengruppen, ein
Benutzername aus `u` und Ziffern, ein Schlüssel aus 32 Zeichen ohne Trennzeichen.
Damit findet man das Feld auch, wenn es nächstes Jahr woanders sitzt.
