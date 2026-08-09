# Einrichtung: die Zugangsdaten

Alles in diesem Projekt baut und prüft ohne einen einzigen Zugang. Einige Dinge
brauchen trotzdem Zugangsdaten, weil sie nach außen wirken:

| Was                               | Secrets                                                         | Ohne sie passiert                                         |
| --------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| Website ausliefern                | `HOSTINGER_SSH_HOST`, `HOSTINGER_SSH_USER`, `HOSTINGER_SSH_KEY` | Das Paket wird gebaut und geprüft, aber nicht hochgeladen |
| Quartalstermine außerhalb der USA | `TWELVEDATA_API_KEY`                                            | Es bleibt bei 158 von 1.029 Aktien – nur die SEC-Melder   |
| Unternehmenszahlen aus Korea      | `DART_API_KEY`                                                  | Die 15 koreanischen Titel bleiben ohne Kennzahlen         |
| Unternehmenszahlen aus Japan      | `EDINET_API_KEY`                                                | Die Abfrage, ob sich der Weg lohnt, unterbleibt           |
| Instagram-Beitrag des Tages       | `IG_ACCESS_TOKEN`, `IG_USER_ID`, `PEXELS_API_KEY`               | Die Kacheln entstehen, werden aber nicht veröffentlicht   |

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

## 3 · Instagram (@im_invests)

Damit die Top-News des Tages werktäglich als Karussell erscheinen.

**Rechnen Sie mit dreißig bis fünfundvierzig Minuten.** Nicht weil es schwer
wäre, sondern weil die Oberfläche von Meta an mehreren Stellen anders heißt,
als man erwartet, und weil zwischen zwei Schritten Wartezeiten liegen.

### 3.0 Was Sie brauchen, bevor Sie anfangen

- Zugriff auf das Instagram-Konto **@im_invests** (in der App eingeloggt)
- Ein Facebook-Konto. Ein privates genügt; es wird nie öffentlich sichtbar.
- Einen Rechner mit Browser. Die Schritte 3.3 bis 3.5 gehen am Telefon nicht.

### 3.1 Warum das über Facebook läuft, obwohl es um Instagram geht

Weil Instagram keine eigene Schnittstelle zum Veröffentlichen hat. Es gibt
ausschließlich die **Graph API von Meta**, und die kennt Instagram-Konten nur
als Anhängsel einer Facebook-Seite.

Das klingt nach einem Umweg und ist einer. Es gibt keinen anderen. Jeder
Dienst, der Beiträge automatisch auf Instagram stellt – Later, Buffer,
Hootsuite –, geht denselben Weg.

**Daraus folgt eine Reihenfolge, die man nicht ändern kann:**

```
privates Instagram-Konto
        ↓  3.2
Profi- oder Creator-Konto
        ↓  3.2
mit einer Facebook-Seite verknüpft
        ↓  3.3
eine Meta-App, die beides sehen darf
        ↓  3.4
ein Token, das 60 Tage gilt
        ↓  3.5
die Instagram-Business-Kennung
```

Wer bei 3.4 anfängt, bekommt eine Fehlermeldung, die nach einem Tokenproblem
aussieht und keines ist.

---

### 3.2 Instagram vorbereiten (5 Minuten)

> **Vorbemerkung, aus Schaden klug:** Meta benennt seine Menüs mehrmals im
> Jahr um, und die Beschriftungen unterscheiden sich zwischen App, Browser,
> iOS und Android. Diese Anleitung nannte anfangs Menüpfade, die es so nicht
> gab – das kostet Zeit und sät Zweifel an der Sache selbst.
>
> Deshalb steht hier ab jetzt **jeweils das sichtbare Kennzeichen** statt des
> Klickwegs: woran man erkennt, dass es stimmt. Wo es geht, folgt eine
> **Abfrage**, die ohne jedes Menü auskommt.

**a) Profikonto – woran man es erkennt**

Ein umgestelltes Konto zeigt in den Instagram-Einstellungen einen Abschnitt
**„Für Profis"** mit dem Eintrag **„Professionelles Konto"** und einer
Kategorie darunter (etwa „Unternehmer/in"). Im Profil selbst gibt es
zusätzlich **„Professionelles Dashboard"** und **„Statistiken ansehen"** –
beides existiert bei einem privaten Konto nicht.

Steht das da, ist a) erledigt. Ob **Creator** oder **Business** gewählt
wurde, ist für die Schnittstelle ohne Bedeutung; beides veröffentlicht.

Fehlt es, führt die Suche in den Instagram-Einstellungen nach dem Wort
**„professionell"** zur Umstellung – zuverlässiger als jeder Pfad, den man
aufschreiben könnte.

**b) Facebook-Seite – und warum sie hier nicht geprüft wird**

Gebraucht wird eine Facebook-**Seite**, nicht das Facebook-Profil. Eine
Seite ist ein eigenes Objekt mit eigener Kennung; das persönliche Profil hat
keine und trägt deshalb auch kein Instagram-Konto.

Gibt es noch keine: Facebook im Browser, Bereich **Seiten**, **Neue Seite
erstellen**, Name (etwa „IM Invests"), Kategorie (etwa
„Finanzdienstleistung"). Die Seite muss danach **nicht** gepflegt werden –
kein Bild, kein Beitrag, keine Follower. Sie ist ein Scharnier.

**Ob die Verknüpfung zwischen Seite und Instagram-Konto steht, wird hier
bewusst nicht über ein Menü geprüft.** Die Verknüpfung lässt sich an drei
verschiedenen Stellen setzen – im Konten-Center, in den Einstellungen der
Facebook-Seite, im professionellen Dashboard – und keine davon heißt
zuverlässig gleich. Auch ein Häkchen an einer dieser Stellen ist kein
Beweis: Entscheidend ist, was die Schnittstelle sieht.

> **Die verbindliche Probe ist eine einzige Abfrage**, und sie steht in
> **3.5 a**: `me/accounts` im Graph API Explorer. Kommt dort eine Seite mit
> `name` und `id` zurück, steht alles. Kommt `{"data": []}`, fehlt die Seite
> oder die Verknüpfung – dann, und erst dann, lohnt die Suche im Menü.
>
> Dafür wird die App aus 3.3 gebraucht. **Also: 3.3 anlegen, dann 3.5 a
> abfragen.** Wer hier stehenbleibt und sucht, sucht ohne Messgerät.

---

### 3.3 Die Meta-App anlegen (im Browser, 10 Minuten)

**a) Entwicklerkonto**

`developers.facebook.com` → oben rechts **Anmelden** mit dem
Facebook-Konto. Beim ersten Mal führt Meta durch eine kurze Registrierung
als Entwickler (Telefonnummer bestätigen).

**b) App erstellen**

**Meine Apps** → **App erstellen**.

Meta fragt jetzt nach dem Verwendungszweck. Die Bezeichnungen ändern sich
mehrmals im Jahr; gesucht ist die Option, die **Instagram** nennt – zuletzt
hieß sie sinngemäß „Andere" → App-Typ **Business**, in neueren Fassungen
direkt ein Anwendungsfall **Instagram**.

> **Wenn Sie unsicher sind, welche Option die richtige ist:** Nehmen Sie die
> mit „Business" oder „Instagram". Beide führen zum Ziel. Was zählt, sind die
> Berechtigungen in Schritt d – nicht der Name, den die App-Erstellung trägt.

App-Name frei wählbar, etwa `IM Invests Veroeffentlichung`. Der Name ist nur
für Sie sichtbar, solange die App im Entwicklungsmodus bleibt.

**c) Produkt hinzufügen**

In der App links **Produkte hinzufügen** → **Instagram** (in älteren
Fassungen: **Instagram Graph API**) → **Einrichten**.

**d) Berechtigungen**

Diese vier braucht die App:

| Berechtigung                | Wofür                                        |
| --------------------------- | -------------------------------------------- |
| `instagram_basic`           | das Konto und seine Beiträge lesen           |
| `instagram_content_publish` | Beiträge veröffentlichen                     |
| `pages_show_list`           | die verknüpfte Facebook-Seite finden         |
| `pages_read_engagement`     | die Verknüpfung zum Instagram-Konto auslesen |

Die letzten beiden wirken überflüssig, sind es aber nicht: Ohne sie findet
Schritt 3.5 die Seite nicht, über die das Instagram-Konto hängt.

> **Eine Prüfung durch Meta ist nicht nötig**, solange die App im
> **Entwicklungsmodus** bleibt und Sie selbst der Administrator des Kontos
> sind. Genau das ist hier der Fall. Der Menüpunkt „App-Überprüfung" darf
> also ignoriert werden.

---

### 3.4 Das Token holen (im Browser, 10 Minuten)

Das ist der Schritt mit der größten Stolpergefahr, weil es **drei
verschiedene Tokens** gibt, die alle gleich aussehen.

| Art                | Gilt     | Taugt für uns |
| ------------------ | -------- | ------------- |
| Nutzer-Token, kurz | 1 Stunde | nein          |
| Nutzer-Token, lang | 60 Tage  | **ja**        |
| Seiten-Token       | 60 Tage  | auch          |

**a) Graph API Explorer öffnen**

`developers.facebook.com` → oben **Tools** → **Graph API Explorer**.

**b) App und Berechtigungen wählen**

Rechts oben unter **Meta App** Ihre App auswählen.

Darunter unter **Berechtigungen** die vier aus 3.3 d anhaken. Sie stehen in
einer langen Liste; das Suchfeld darüber hilft.

**c) Token erzeugen**

Knopf **Generate Access Token**. Es öffnet sich ein Fenster von Facebook:

1. Zustimmen, dass die App auf Ihr Konto zugreifen darf
2. **Die Facebook-Seite auswählen**, die Sie in 3.2 b verknüpft haben – hier
   erscheint eine Liste mit Kästchen. **Setzen Sie den Haken**, sonst fehlt
   die Seite später.
3. Bestätigen

Im Feld **Access Token** steht jetzt eine sehr lange Zeichenkette. Das ist
das **kurzlebige** Token – es gilt eine Stunde.

> **Schritt 2 ist nebenbei die erste ehrliche Antwort auf die Frage aus
> 3.2 b:** Erscheint dort keine einzige Seite zum Anhaken, gibt es keine
> Facebook-Seite unter diesem Konto. Erscheint eine, existiert sie – ob sie
> auch mit Instagram verknüpft ist, sagt erst 3.5 b.

**d) Aus kurzlebig wird langlebig**

**Tools** → **Access Token Debugger**. Das Token dort einfügen → **Debug**.

Unten auf der Seite: **Extend Access Token**. Nach dem Klick erscheint
darunter ein **neues** Token. Das ist das langlebige mit 60 Tagen.

> **Nehmen Sie das untere, neue.** Das obere ist das alte. Beide sehen gleich
> aus, und der Unterschied fällt erst 60 Minuten später auf.

Dieses Token ist gleich `IG_ACCESS_TOKEN`.

---

### 3.5 Die Instagram-Kennung finden (5 Minuten)

Zurück in den **Graph API Explorer**, das langlebige Token oben einfügen.

**a) Die Seite finden**

Das ist zugleich die in **3.2 b** angekündigte Probe. Sie funktioniert schon
mit dem **kurzlebigen** Token aus 3.4 c – wer nur wissen will, ob die
Facebook-Seite steht, muss 3.4 d nicht abwarten.

In das Abfragefeld (neben `GET` und der API-Fassung) eintragen:

```
me/accounts
```

**Submit.** Die Antwort sieht so aus:

```json
{
  "data": [
    {
      "access_token": "…",
      "name": "IM Invests",
      "id": "123456789012345"
    }
  ]
}
```

Die `id` ist die **Seiten-ID**. Merken, aber **nicht** als `IG_USER_ID`
eintragen – das ist der zweithäufigste Fehler.

> **Kommt `"data": []` zurück?** Dann ist entweder in 3.4 c der Haken bei der
> Seite nicht gesetzt worden, oder es gibt keine Facebook-Seite. Zurück zu
> 3.2 b.

**b) Das Instagram-Konto dahinter finden**

Jetzt mit der Seiten-ID von eben:

```
123456789012345?fields=instagram_business_account
```

Antwort:

```json
{
  "instagram_business_account": {
    "id": "17841400000000000"
  },
  "id": "123456789012345"
}
```

**Diese `id`, die mit `1784…` beginnt, ist `IG_USER_ID`.** Sie ist immer
17 Stellen lang und fängt bei allen Instagram-Business-Konten mit `1784` an –
daran erkennen Sie, dass Sie die richtige haben.

> **Fehlt `instagram_business_account` in der Antwort?** Dann ist das
> Instagram-Konto nicht mit dieser Seite verknüpft oder noch kein Profikonto.
> Zurück zu 3.2.

**c) Gegenprobe**

Noch eine Abfrage, mit der neuen Kennung:

```
17841400000000000?fields=username,followers_count
```

Steht dort `"username": "im_invests"`, ist alles richtig.

---

### 3.6 Pexels (2 Minuten)

Für die Fotos auf den Deckblättern.

`pexels.com/api` → **Get Started** → mit E-Mail registrieren → das Formular
nach dem Verwendungszweck ausfüllen (ein Satz genügt, etwa „daily news
graphics for a finance education account").

Der Schlüssel erscheint sofort auf der Seite. Er ist kostenlos, erlaubt
kommerzielle Nutzung und verlangt keine Namensnennung. Das Limit liegt bei
200 Abrufen pro Stunde – wir brauchen einen pro Tag.

---

### 3.7 Die drei Secrets hinterlegen

```
https://github.com/PeterPan405/Website-1/settings/secrets/actions
```

Jeweils **New repository secret**:

| Name              | Wert                                   |
| ----------------- | -------------------------------------- |
| `IG_ACCESS_TOKEN` | das **langlebige** Token aus 3.4 d     |
| `IG_USER_ID`      | die Zahl aus 3.5 b, beginnt mit `1784` |
| `PEXELS_API_KEY`  | der Schlüssel aus 3.6                  |

Beim Einfügen darauf achten, dass **kein Leerzeichen** davor oder dahinter
steht. Ein Token mit angehängtem Leerzeichen wird abgelehnt, und die
Fehlermeldung nennt den Grund nicht.

> Der Warnkasten ganz oben in dieser Datei gilt auch hier: Ein Token, das je
> in einer Nachricht, einem Screenshot oder einem Protokoll stand, ist
> verbrannt. Dann im Access Token Debugger ein neues erzeugen.

---

### 3.8 Prüfen, bevor irgendetwas veröffentlicht wird

**Actions** → linke Spalte **Instagram-Zugang prüfen** → **Run workflow**.

Der Lauf ändert nichts. Er liest und meldet:

```
[instagram] Token gültig, angemeldet als „…".
[instagram]
[instagram] — Das verbundene Konto —
[instagram]   Benutzername    @im_invests
[instagram]   Name            IM Invests
[instagram]   Folgende        …
[instagram]   Beiträge        …
[instagram]
[instagram] ✓ Das ist @im_invests – die Verbindung führt zum richtigen Konto.
```

### 3.9 Wenn es nicht klappt

Der Lauf nennt zu jedem Fehler die häufigste Ursache. Hier dieselbe Tabelle
zum Nachschlagen:

| Was im Protokoll steht                        | Woran es liegt                                                    |
| --------------------------------------------- | ----------------------------------------------------------------- |
| `Das Token wird abgelehnt (400)`              | Kurzlebiges Token genommen (3.4 d) oder abgelaufen                |
| `OAuthException: … session has expired`       | 60 Tage um – neues Token erzeugen                                 |
| `IG_USER_ID … ist nicht abrufbar`             | Seiten-ID statt Instagram-Kennung eingetragen (3.5 a gegen 3.5 b) |
| `Unsupported get request`                     | Dieselbe Verwechslung; Meta antwortet darauf uneindeutig          |
| `Verbunden ist @… , erwartet war @im_invests` | Die Kennung gehört zu einem anderen Konto                         |
| `(#200) Requires … permission`                | Eine der vier Berechtigungen fehlt (3.3 d)                        |
| `Noch keine Zugangsdaten hinterlegt`          | Secret-Name vertippt – auf Groß- und Kleinschreibung achten       |

### 3.10 Das Token läuft nach 60 Tagen ab

Dann bleibt der Beitrag eines Morgens aus – der stille Fehler, den dieses
Projekt an allen Ecken abzuschaffen versucht.

**Erneuern geht schneller als das erste Mal:** Graph API Explorer → Token
erzeugen → Access Token Debugger → Extend → das neue in `IG_ACCESS_TOKEN`
überschreiben → Zugangsprobe starten. Fünf Minuten.

Tragen Sie sich den Termin ein. Ein langlebiges Token, das am **9. August**
erzeugt wurde, gilt bis zum **8. Oktober**.

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
