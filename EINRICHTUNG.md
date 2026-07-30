# Einrichtung: die vier Zugangsdaten

Alles in diesem Projekt baut und prüft ohne einen einzigen Zugang. Drei Dinge
brauchen trotzdem Zugangsdaten, weil sie nach außen wirken:

| Was                               | Secrets                                                         | Ohne sie passiert                                         |
| --------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| Website ausliefern                | `HOSTINGER_SSH_HOST`, `HOSTINGER_SSH_USER`, `HOSTINGER_SSH_KEY` | Das Paket wird gebaut und geprüft, aber nicht hochgeladen |
| Quartalstermine außerhalb der USA | `TWELVEDATA_API_KEY`                                            | Es bleibt bei den Unternehmen, die bei der SEC melden     |

Alle vier gehören an **eine** Stelle:

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

## Was hier bewusst nicht steht

Klickpfade in hPanel und im Twelve-Data-Dashboard. Beide Oberflächen ändern sich,
ohne dass es hier jemand merken würde – eine Anleitung mit erfundenen
Knopfbeschriftungen wäre schlechter als keine. Beschrieben ist deshalb, **woran
der richtige Wert zu erkennen ist**: eine IP mit vier Zahlengruppen, ein
Benutzername aus `u` und Ziffern, ein Schlüssel aus 32 Zeichen ohne Trennzeichen.
Damit findet man das Feld auch, wenn es nächstes Jahr woanders sitzt.
