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

Dazu kommt eine Sache, die **kein** Secret braucht, sondern nur einen Eintrag
im Quelltext: die Anmeldung bei der Google Search Console (Abschnitt 4). Ohne
sie erfährt Google von den 1.766 Seiten nur, was es zufällig findet.

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

Damit die Top-News des Tages täglich als Karussell erscheinen.

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

### 3.2 Instagram vorbereiten (10 Minuten)

> **Zur Vorsicht mit Menünamen.** Meta benennt Menüs mehrmals im Jahr um, und
> die Beschriftungen unterscheiden sich zwischen App, Browser, iOS und
> Android. Diese Anleitung nannte deshalb eine Zeit lang **gar keine**
> Klickwege, nur Erkennungsmerkmale – und war damit an der Stelle unbrauchbar,
> an der man sie am dringendsten braucht.
>
> Ab hier steht deshalb beides: **der Klickweg, Stand August 2026**, und
> daneben **woran man erkennt, dass es geklappt hat**. Weicht das Menü ab,
> gilt das Erkennungsmerkmal – und die verbindliche Antwort gibt ohnehin erst
> die Abfrage in 3.5.

#### a) Aus dem privaten ein professionelles Konto machen

**In der Instagram-App** (das geht am Telefon, im Browser nicht zuverlässig):

1. Unten rechts auf Ihr **Profilbild** – Sie sind auf Ihrem Profil.
2. Oben rechts auf die **drei waagerechten Striche** (☰).
3. **Einstellungen und Privatsphäre**.
4. Ganz nach unten scrollen bis zum Abschnitt **Für Profis**.
5. **Kontotyp und Tools** → **Auf professionelles Konto umstellen**.
6. Instagram fragt nach einer **Kategorie**. Nehmen Sie
   **Finanzdienstleistung** oder **Wirtschafts- und Finanzwebsite**. Die
   Kategorie ist später frei änderbar und für die Schnittstelle bedeutungslos.
7. Bei der Frage **Unternehmen oder Creator**: **Unternehmen**. Beides
   funktioniert, aber „Unternehmen" führt direkter zur Seitenverknüpfung.

> **Wenn Sie den Punkt „Für Profis" nicht finden:** In den Einstellungen gibt
> es oben ein **Suchfeld**. Tippen Sie dort `professionell` ein – das findet
> den Eintrag unabhängig davon, wie das Menü gerade heißt.

**Woran Sie erkennen, dass es geklappt hat:**

- Auf Ihrem Profil steht jetzt ein Knopf **Professionelles Dashboard**.
- In den Einstellungen gibt es **Statistiken** oder **Insights**.
- Unter Ihrem Namen im Profil steht die gewählte **Kategorie**.

Alle drei fehlen bei einem privaten Konto.

#### b) Eine Facebook-Seite anlegen

Gebraucht wird eine **Seite**, nicht Ihr Facebook-Profil. Der Unterschied ist
technisch: Eine Seite hat eine eigene Kennung, ein persönliches Profil nicht –
und nur an einer Kennung kann ein Instagram-Konto hängen.

Direkter Weg, am Rechner:

```
https://www.facebook.com/pages/create
```

1. **Name**: `IM Invests`
2. **Kategorie**: tippen Sie `Finanz` und wählen Sie
   **Finanzdienstleistung** aus der Vorschlagsliste.
3. **Seite erstellen**.
4. Alles Weitere, was Facebook anbietet – Profilbild, Titelbild, Beschreibung,
   Freunde einladen –, können Sie **überspringen**. Die Seite muss nie
   gepflegt werden und braucht keinen einzigen Beitrag. Sie ist ein Scharnier.

**Woran Sie erkennen, dass es geklappt hat:** Unter
`https://www.facebook.com/pages/?category=your_pages` steht Ihre neue Seite
in der Liste.

#### c) Instagram-Konto mit der Seite verknüpfen

**Das ist der Schritt, an dem es meistens hakt** – und der Grund, warum es
drei Wege dafür gibt. Nehmen Sie den ersten; klappt er nicht, den zweiten.

**Weg 1 – aus der Instagram-App heraus (der zuverlässigste):**

1. Profil → **Profil bearbeiten**.
2. Abschnitt **Öffentliche Unternehmensinformationen** → **Seite**.
3. Es erscheint eine Liste Ihrer Facebook-Seiten. **IM Invests** auswählen.
4. Facebook fragt nach Ihrem Login und nach Bestätigung.

**Weg 2 – über das Konten-Center:**

1. Instagram → ☰ → **Einstellungen und Privatsphäre**.
2. Ganz oben **Konten-Center** (Meta-Symbol).
3. **Konten** → **Konten hinzufügen** → **Facebook**.

**Weg 3 – über die Meta Business Suite, am Rechner:**

```
https://business.facebook.com/latest/settings/instagram_accounts
```

**Instagram-Konto hinzufügen** → anmelden → bestätigen.

> **Warum hier kein Erkennungsmerkmal steht:** Weil keines trägt. Ein Häkchen
> an einer dieser drei Stellen heißt nicht, dass die Schnittstelle die
> Verknüpfung sieht – das ist mehrfach beobachtet worden. **Die einzige
> verbindliche Probe ist die Abfrage in 3.5 b.** Wenn Sie hier unsicher sind,
> machen Sie trotzdem mit 3.3 weiter; dort bekommen Sie das Messgerät.

---

### 3.3 Die Meta-App anlegen (im Browser, 10 Minuten)

#### a) Als Entwickler anmelden

```
https://developers.facebook.com/
```

Oben rechts **Anmelden** mit demselben Facebook-Konto, dem die Seite aus
3.2 b gehört. Beim allerersten Mal führt Meta durch eine kurze Registrierung
(Telefonnummer bestätigen, Nutzungsbedingungen).

#### b) App erstellen

```
https://developers.facebook.com/apps/creation/
```

Meta fragt in dieser Reihenfolge:

1. **App-Name**: `IM Invests Veroeffentlichung`. Frei wählbar, aber **ohne
   die Wörter „Instagram", „Facebook" oder „Meta"** – Namen mit Markenbezug
   werden abgelehnt, und die Meldung dazu ist unauffällig.
2. **App-Kontakt-E-Mail**: Ihre Adresse.
3. **Anwendungsfall**: Hier heißt die Option je nach Fassung anders. Suchen
   Sie die, die **„Andere"** heißt – nicht „Mit Facebook anmelden", nicht
   „Spiele". Gibt es stattdessen direkt einen Punkt **Instagram**, nehmen Sie
   den.
4. **App-Typ**: **Business**.
5. **Geschäftsportfolio**: Falls gefragt, dürfen Sie **überspringen** oder
   ein vorhandenes wählen. Für den Entwicklungsmodus ist es ohne Bedeutung.

#### c) Instagram als Produkt hinzufügen

Sie sind jetzt im Dashboard der App. Links in der Spalte oder in der Kachelliste:

**Produkt hinzufügen** → bei **Instagram** auf **Einrichten**.

In älteren Fassungen heißt das Produkt **Instagram Graph API**. Beides ist
dasselbe.

#### d) Die vier Berechtigungen

Diese vier braucht die App – gesetzt werden sie erst in 3.4 b beim Erzeugen
des Tokens, hier zur Übersicht:

| Berechtigung                | Wofür                                        |
| --------------------------- | -------------------------------------------- |
| `instagram_basic`           | das Konto und seine Beiträge lesen           |
| `instagram_content_publish` | Beiträge veröffentlichen                     |
| `pages_show_list`           | die verknüpfte Facebook-Seite finden         |
| `pages_read_engagement`     | die Verknüpfung zum Instagram-Konto auslesen |

Die letzten beiden wirken überflüssig, sind es aber nicht: Ohne sie findet
3.5 a die Seite nicht, über die das Instagram-Konto hängt.

> **Eine Prüfung durch Meta ist nicht nötig**, solange die App im
> **Entwicklungsmodus** bleibt und Sie selbst Administrator des Kontos sind.
> Genau das ist hier der Fall. Der Menüpunkt **App-Überprüfung** und alles,
> was nach „Live schalten" aussieht, darf ignoriert werden – im Gegenteil:
> Eine live geschaltete App verlangt eine Datenschutzerklärung und eine
> Prüfung durch Meta, die Wochen dauern kann.

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

```
https://developers.facebook.com/tools/explorer/
```

Sie sehen eine zweigeteilte Seite: links ein Abfragefeld mit einem blauen
**Submit**-Knopf, rechts eine Spalte mit Auswahlfeldern.

**b) App und Berechtigungen wählen**

In der **rechten Spalte**, von oben nach unten:

1. **Meta App**: Ihre App aus 3.3 b auswählen (`IM Invests Veroeffentlichung`).
2. **User or Page**: **User Token** stehen lassen.
3. Darunter die Liste **Permissions**. Sie ist sehr lang und nach Bereichen
   sortiert. Über der Liste ist ein **Suchfeld** – tippen Sie dort nacheinander
   ein und setzen Sie jeweils den Haken:

   ```
   instagram_basic
   instagram_content_publish
   pages_show_list
   pages_read_engagement
   ```

> **Wenn eine der vier nicht in der Liste auftaucht:** Dann ist das Produkt
> Instagram in 3.3 c nicht hinzugefügt worden. Zurück dorthin – ohne das
> Produkt bietet Meta die beiden `instagram_*`-Berechtigungen gar nicht an.

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

Kopieren Sie das Token aus dem Feld **Access Token** (Knopf zum Kopieren
rechts daneben) und öffnen Sie:

```
https://developers.facebook.com/tools/debug/accesstoken/
```

Token in das große Feld einfügen → blauer Knopf **Debug**.

Sie sehen jetzt eine Tabelle mit Zeilen wie **App-ID**, **Typ**, **Läuft ab**,
**Gültig**, **Berechtigungen**. Prüfen Sie hier gleich zweierlei:

- **Läuft ab** steht auf etwa einer Stunde – das bestätigt, dass es das
  kurzlebige ist.
- **Berechtigungen** listet Ihre vier auf. Fehlt eine, war der Haken in b
  nicht gesetzt; zurück zu 3.4 b, sonst scheitert erst 3.5.

Ganz **unten auf der Seite**, unterhalb der Tabelle, ein grauer Knopf
**Extend Access Token** (in deutschen Fassungen **Zugriffsschlüssel
verlängern**). Klicken.

Darunter erscheint ein **neues Feld mit einem neuen Token**. Das ist das
langlebige mit 60 Tagen.

> **Nehmen Sie das untere, neue.** Das obere ist das alte. Beide sehen gleich
> aus, und der Unterschied fällt erst 60 Minuten später auf – als Beitrag,
> der ausbleibt.
>
> **Gegenprobe, die eine Minute kostet:** Fügen Sie das neue Token noch
> einmal oben in den Debugger ein und klicken Sie **Debug**. Steht bei
> **Läuft ab** jetzt ein Datum rund zwei Monate in der Zukunft, ist es das
> richtige. Steht dort weiter „in etwa einer Stunde", haben Sie das obere
> erwischt.

Dieses Token ist gleich `IG_ACCESS_TOKEN`.

---

### 3.5 Die Instagram-Kennung finden (5 Minuten)

Zurück in den Graph API Explorer:

```
https://developers.facebook.com/tools/explorer/
```

Das **langlebige** Token aus 3.4 d oben in das Feld **Access Token** einfügen
– das ersetzt das kurzlebige, das dort noch steht.

Das Abfragefeld darunter besteht aus drei Teilen: dem Verb (**GET**), der
API-Fassung (etwa **v21.0**) und dem eigentlichen Pfad. **Nur den Pfad
ändern**, den Rest stehen lassen.

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

### 3.6 Pexels (2 Minuten) — **optional, für den Beitrag nicht nötig**

> Die Kacheln, die heute hinausgehen, bestehen aus Text: satori setzt sie,
> resvg rastert sie, ohne Foto und ohne Netz. **Ohne diesen Schlüssel geht
> genauso ein Beitrag hinaus.** Er ist nur dann nötig, wenn die Deckblätter
> später ein Foto bekommen sollen — überspringen Sie den Abschnitt, bis es
> so weit ist.

Für die Fotos auf den Deckblättern.

`pexels.com/api` → **Get Started** → mit E-Mail registrieren → das Formular
nach dem Verwendungszweck ausfüllen (ein Satz genügt, etwa „daily news
graphics for a finance education account").

Der Schlüssel erscheint sofort auf der Seite. Er ist kostenlos, erlaubt
kommerzielle Nutzung und verlangt keine Namensnennung. Das Limit liegt bei
200 Abrufen pro Stunde – wir brauchen einen pro Tag.

---

### 3.7 Die Secrets hinterlegen

```
https://github.com/PeterPan405/Website-1/settings/secrets/actions
```

Jeweils **New repository secret**:

| Name              | Wert                                   | Nötig?           |
| ----------------- | -------------------------------------- | ---------------- |
| `IG_ACCESS_TOKEN` | das **langlebige** Token aus 3.4 d     | ja               |
| `IG_USER_ID`      | die Zahl aus 3.5 b, beginnt mit `1784` | ja               |
| `PEXELS_API_KEY`  | der Schlüssel aus 3.6                  | nein, siehe oben |

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

### 3.8a Der erste Beitrag — erst ansehen, dann veröffentlichen

Die Zugangsprobe sagt, dass die Verbindung steht. Sie sagt nichts darüber,
**was** hinausginge. Dafür gibt es zwei Läufe desselben Workflows.

**Zuerst ohne Haken.** **Actions** → **Instagram-Beitrag** → **Run workflow**,
das Kästchen „Wirklich veröffentlichen?" **leer lassen** → starten.

Der Lauf holt die Kacheln von `iminvests.de`, zählt sie, zeigt die
Beschriftung in der Zusammenfassung — und hört auf:

```
[instagram] 4 Kacheln, Basis https://iminvests.de
[instagram]   https://iminvests.de/instagram/1.png
[instagram]   …
[instagram] Trockenlauf – es geht nichts hinaus.
```

**Sehen Sie sich die vier Adressen im Browser an.** Das ist genau das, was
Meta abrufen würde; ein schiefes Bild fällt hier auf und nicht im Feed.

**Dann mit Haken.** Derselbe Workflow, Kästchen gesetzt. Am Ende steht die
Kennung des Beitrags und der Link zum Kanal.

> **Bricht der Lauf mit „Unter … liegen nur 0 Kachel(n)" ab**, ist die
> Website älter als die Ausgabe: Die Kacheln entstehen beim Bau und liegen
> erst nach der Übertragung draußen. Dann zuerst **Paket bauen** und
> **Veröffentlichen** durchlaufen lassen.

An die Kette (also automatisch nach den Nachrichten) kommt der Beitrag erst,
wenn ein paar davon beurteilt sind. Was bei Instagram einmal draußen war,
ist nicht zurückzunehmen, nur zu löschen.

---

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

### 3.11 Der zweite Weg: über einen Dienst, wenn Meta kein Entwicklerkonto gibt

**Wann dieser Abschnitt gilt:** Wenn 3.3 a nicht durchgeht. Am 29. August 2026
war genau das der Fall – die Registrierung hängt an einer SMS, Meta schickte
sie nicht und meldete stattdessen, das Gerät werde normalerweise nicht
benutzt. Auf einem zweiten Gerät ebenso. Gegen diese Sperre hilft kein Code
und kein weiterer Versuch.

**Der Ausweg:** Dienste wie Make bringen eine **eigene, von Meta genehmigte
App** mit. Eigene Zugangsdaten sind dort ausdrücklich optional – Sie
verbinden Instagram per Klick, ohne selbst Entwickler zu sein.

**Vorher prüfen, sonst ist die halbe Stunde verloren.** Makes Doku nennt drei
Bedingungen, und alle drei sind hier erfüllt:

| Bedingung                                      | Stand                               |
| ---------------------------------------------- | ----------------------------------- |
| Facebook-Konto mit Admin-Rechten auf der Seite | ja, Igor Maier auf `IM Invests`     |
| Instagram als **Business**-Konto               | ja – Creator wird nicht unterstützt |
| Bilder unter öffentlicher Adresse              | ja, `iminvests.de/instagram/1.png`  |

#### a) Das Szenario anlegen

1. Bei `make.com` anmelden, neues Szenario.
2. Erstes Modul: **Webhooks → Custom webhook**. Make zeigt eine Adresse an –
   die kommt gleich nach GitHub.
3. Zweites Modul: **Instagram for Business → List posts**. Verbindung
   anlegen, dabei die Seite `IM Invests` auswählen.
4. **Filter dahinter:** weiter nur, wenn unter den Beiträgen **keiner vom
   heutigen Tag** ist.
5. Drittes Modul: **Instagram for Business → Create a carousel post**. Die
   Bildadressen und die Beschriftung kommen aus dem Webhook (`bilder`,
   `beschriftung`).

> **Schritt 4 ist nicht optional.** Der Riegel gegen den doppelten Beitrag
> liegt bei diesem Weg **im Szenario**, nicht im Repository: Ohne eigenes
> Token kann der Lauf hier den Kanal nicht fragen. `paket-bauen.yml` läuft
> mehrmals täglich und stößt jedes Mal an – ohne Filter bekommen Sie an einem
> Tag so viele Beiträge, wie gebaut wurde.

#### b) Den Haken hinterlegen

Die Webhook-Adresse aus a) 2 nach **Settings → Secrets and variables →
Actions** als `MAKE_WEBHOOK_URL`. Nur `https://` – über die Adresse gehen
Beschriftung und Bildadressen hinaus, und das Skript weist alles andere ab.

Mehr ist nicht nötig: `instagram-beitrag.yml` nimmt den Haken, sobald kein
eigenes Token da ist. Was hinausgeht, ist dasselbe wie beim direkten Weg.

#### c) Was dieser Weg kostet

Ihre Kacheln und Ihre Texte laufen über einen Dritten, und der Dienst kostet
Geld, sobald das Freikontingent nicht reicht. Ein Beitrag am Tag sind wenige
Operationen – rechnen Sie trotzdem nach, bevor Sie sich darauf verlassen.

**Und eine Bremse aus Makes Doku:** Seiten, für die Meta eine _Page Publishing
Authorization_ verlangt, können erst nach deren Abschluss veröffentlichen.
Kommt die Meldung, führt kein Weg daran vorbei.

> **Der direkte Weg bleibt der bessere.** Klappt das Entwicklerkonto später
> doch – etwa über ein zweites Facebook-Konto mit Admin-Rechten auf der Seite
> –, tragen Sie `IG_ACCESS_TOKEN` und `IG_USER_ID` ein. Der Lauf nimmt dann
> von selbst wieder den direkten Weg, und der Doppelriegel liegt wieder dort,
> wo er hingehört: im Repository, mit dem Kanal als Quelle.

---

## 4 · Google Search Console

Damit Google alle 1.766 Seiten kennt statt nur der, die es zufällig findet.

**Rechnen Sie mit zehn Minuten**, davon acht Wartezeit. Es ist der kürzeste
Abschnitt in dieser Datei und der mit dem besten Verhältnis von Aufwand zu
Wirkung.

### 4.0 Was das bringt – und was nicht

**Was es bringt:** Sie reichen die `sitemap.xml` ein, und Google erfährt in
einem Zug von allen Seiten. Danach sehen Sie dort, welche davon tatsächlich im
Index sind, mit welchen Suchwörtern Leute auf die Website kommen und wo etwas
klemmt. Ohne Anmeldung gibt es keine dieser Auskünfte.

**Was es nicht bringt:** die Liste von Unterseiten unter dem Suchtreffer, nach
der am 28. August 2026 gefragt wurde. Die heißt Sitelinks, stellt Google selbst
zusammen, und es gibt keine Auszeichnung dafür – siehe `ENTSCHEIDUNGEN.md`,
„Sitelinks kann man nicht einbauen". Die Anmeldung ist trotzdem die
Voraussetzung dafür, dass Google die Website überhaupt vollständig kennt.

### 4.1 Der Teil, der ein Google-Konto braucht

1. `search.google.com/search-console` öffnen, mit einem Google-Konto anmelden.
2. **Property hinzufügen** → die rechte Kachel **URL-Präfix** →
   `https://iminvests.de` eintragen.
3. Google bietet mehrere Bestätigungsarten an. **HTML-Tag** wählen (nicht
   HTML-Datei – die müsste in `public/` liegen und würde bei jedem Bau
   mitgeschleppt).
4. Google zeigt eine Zeile wie:

   ```html
   <meta name="google-site-verification" content="xPtLm3rQ7yN2kW9vB4hD8sF6" />
   ```

   Diese Zeile kopieren. **Noch nicht auf „Bestätigen" klicken** – das Element
   steht noch nicht auf der Website.

### 4.2 Der Teil, den der lokale Chat erledigt

Im Projektordner:

```
npm run search-console -- '<meta name="google-site-verification" content="…" />'
```

Das Skript nimmt die ganze Zeile entgegen und löst den Wert selbst heraus; nur
der Wert geht auch. Es weist ab, was kein Schlüssel sein kann, trägt ihn in
`lib/site.ts` ein, baut und sieht danach im gebauten HTML nach, ob das Element
wirklich drinsteht.

Danach wie üblich: Zweig, Pull Request, grüne Prüfung, mergen. Erst wenn
„Paket bauen" und „Veröffentlichen" durch sind, steht das Element auf
iminvests.de.

### 4.3 Zurück in der Search Console

1. Auf **Bestätigen** klicken. Klappt es nicht, ist meistens die
   Veröffentlichung noch nicht durch – fünf Minuten warten, noch einmal.
2. Links auf **Sitemaps**, dort `sitemap.xml` eintragen und absenden.
3. Fertig. Die ersten Auswertungen erscheinen nach ein bis drei Tagen, die
   vollständige Indexierung dauert Wochen.

### 4.4 Zum Kopieren: der Auftrag für den lokalen Chat

Wer den Schlüssel hat und nicht selbst tippen will, gibt das hier weiter:

```text
Ich habe den Bestätigungsschlüssel der Google Search Console für iminvests.de.
Bitte trag ihn ein und bring ihn live.

Der Schlüssel (bzw. die ganze Zeile von Google):
<HIER EINFÜGEN>

So gehst du vor:

1. Lies EINRICHTUNG.md, Abschnitt 4 – dort steht der Zusammenhang.
2. Zweig anlegen:  git checkout -b claude/search-console
3. Eintragen und prüfen lassen:
   npm run search-console -- '<der Schlüssel oder die ganze Zeile>'
   Das Skript baut und sieht im gebauten HTML nach. Bricht es ab, lies die
   Meldung – sie sagt, was mit der Eingabe nicht stimmt.
4. Nur lib/site.ts committen. out/ gehört nicht ins Repository.
5. Vor dem Pull Request: npm test, npm run pruefen, npx tsc --noEmit,
   npx prettier --check . – alles muss grün sein.
6. Pull Request anlegen, Prüfung „Bauen und prüfen" abwarten, bei Grün mergen.
7. Warten, bis auf main „Paket bauen" und „Veröffentlichen" durch sind, und
   mir dann Bescheid geben. Erst danach klicke ich in der Search Console auf
   „Bestätigen".

Wichtig: Melde dich, wenn das Skript abbricht oder die Prüfung rot wird –
nicht selbst am Schlüssel herumbasteln. Ein falscher Schlüssel sieht in der
Search Console genauso aus wie gar keiner.
```

Der Schlüssel ist kein Geheimnis – er steht anschließend im Quelltext jeder
Seite und ist für jeden lesbar. Er beweist nur, dass jemand mit Zugriff auf
die Website ihn dort platziert hat. Deshalb gehört er in `lib/site.ts` und
nicht zu den Secrets.

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

## Werkzeuge daneben – nicht Teil der Website

`werkzeuge/screenshot-to-code.sh` holt und startet
[Screenshot to Code](https://github.com/abi/screenshot-to-code): Ein Bild
hinein – Screenshot, Figma-Entwurf, Bildschirmaufnahme –, Code für diese
Oberfläche heraus (HTML mit Tailwind, React, Vue und weitere).

    ANTHROPIC_API_KEY=… werkzeuge/screenshot-to-code.sh

Danach `http://localhost:5173`. Gebraucht werden Docker und mindestens ein
Modellschlüssel; das Skript sagt es, wenn etwas fehlt, **bevor** es anfängt.

Drei Dinge, die dazugehören:

- **Es liegt außerhalb dieses Repositorys**, unter `~/.werkzeuge/`. Hier wird
  nichts einkopiert – ein Update ist ein `git pull` dort statt eines Commits
  hier. Der Schlüssel landet in `backend/.env` des geholten Ordners, mit
  Rechten `600`, und kann so gar nicht erst mitcommittet werden.
- **Es läuft von Hand und in keinem Zeitplan.** Jeder Durchlauf schickt ein
  Bild an ein Modell, und Bilder sind teuer in Tokens – das ist kein
  Cent-Betrag wie beim Nachrichtenlauf.
- **Es holt keine Daten und umgeht keine Sperren.** Das war die Annahme beim
  Einbauen; nachgelesen in der Anleitung selbst, kommen die Wörter „scrape",
  „crawl", „bypass", „block", „bot", „captcha" und „anti" dort kein einziges
  Mal vor. Für fehlende Kurse oder Quartalszahlen ist es das falsche Werkzeug.

## Was hier bewusst nicht steht

Klickpfade in hPanel und im Twelve-Data-Dashboard. Beide Oberflächen ändern sich,
ohne dass es hier jemand merken würde – eine Anleitung mit erfundenen
Knopfbeschriftungen wäre schlechter als keine. Beschrieben ist deshalb, **woran
der richtige Wert zu erkennen ist**: eine IP mit vier Zahlengruppen, ein
Benutzername aus `u` und Ziffern, ein Schlüssel aus 32 Zeichen ohne Trennzeichen.
Damit findet man das Feld auch, wenn es nächstes Jahr woanders sitzt.
