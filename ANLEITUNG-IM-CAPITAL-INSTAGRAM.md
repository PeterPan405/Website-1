# Instagram für IM Capital automatisch veröffentlichen

**Für wen:** den Betreiber am Rechner und die **lokale Claude-Sitzung**, die
auf seinem Computer arbeitet und Zugang zu `imcapital.cloud` (VPS, SSH) hat.
Die Cloud-Sitzung dieses Repositorys erreicht weder den VPS noch Meta – sie
hat diese Anleitung nur geschrieben.

**Vorbild:** So läuft es seit Oktober 2026 bei **@im_invests**: täglich ein
Karussell und eine Zahlenkarte, direkt über die Graph API von Meta, ohne
Zwischendienst. Die ausführliche Fassung mit allen Stolpersteinen steht in
`EINRICHTUNG.md`, Abschnitt 3. Hier steht, was für IM Capital **anders** ist,
und alles, was man braucht, um es von Anfang bis Ende am Rechner zu machen.

**Zeitbedarf:** 45 bis 60 Minuten für die Verbindung (Teil A–E), danach die
Einbindung in IM Capital (Teil F–H) durch die lokale Sitzung.

> **Zugangsdaten nie in den Chat, nie in ein Repository, nie in einen
> Screenshot.** Ein Token, das je in einer Nachricht stand, gilt als
> verbrannt und wird neu erzeugt. Die lokale Sitzung schreibt es direkt in
> die Datei auf dem Server (Teil F) und zeigt es nirgends an.

---

## Überblick: die Kette, die nicht umzustellen ist

```
Instagram-Konto IM Capital
        ↓ A  professionelles Konto (Unternehmen)
        ↓ B  Facebook-Seite „IM Capital" anlegen
        ↓ C  beides verknüpfen
        ↓ D  Meta-App (die von IM Invests wiederverwenden)
        ↓ E  Token holen → Seitentoken (läuft nicht ab) + Instagram-Kennung (1784…)
        ↓ F  beides auf dem VPS hinterlegen
        ↓ G  Veröffentlichen-Skript auf imcapital.cloud
        ↓ H  Zeitplan, Prüfungen, erster Beitrag
```

Instagram hat keine eigene Schnittstelle zum Veröffentlichen. Es gibt nur die
Graph API von Meta, und die kennt ein Instagram-Konto nur über eine
**Facebook-Seite**. Wer bei E anfängt, bekommt Fehler, die wie Tokenprobleme
aussehen und keine sind.

---

## Was vorher bereitliegen muss

- [ ] Instagram-App am Telefon, eingeloggt als **IM Capital**
- [ ] Das Facebook-Konto, mit dem auch die Seite **IM Invests** verwaltet
      wird (dann gibt es keine neue Entwickler-Registrierung – die hing am
      29.08.2026 an einer SMS, die nie kam; `EINRICHTUNG.md` 3.11)
- [ ] Ein Rechner mit Browser – die Schritte D und E gehen am Telefon nicht
- [ ] SSH-Zugang zum VPS (`srv1899777.hstgr.cloud`, auf den `imcapital.cloud`
      zeigt) für die lokale Sitzung

---

## A · Instagram-Konto auf „professionell" umstellen (5 Minuten, Telefon)

In der Instagram-App, eingeloggt als IM Capital:

1. Profilbild unten rechts → oben rechts **☰**
2. **Einstellungen und Privatsphäre** → ganz unten **Für Profis**
3. **Kontotyp und Tools** → **Auf professionelles Konto umstellen**
4. Kategorie: **Finanzdienstleistung** (später änderbar)
5. **Unternehmen** wählen, **nicht Creator** – nur so geht später auch der
   Rückfallweg über einen Dienst (`EINRICHTUNG.md` 3.11)

Findet man „Für Profis" nicht: oben in den Einstellungen ins Suchfeld
`professionell` tippen.

**Geklappt, wenn:** auf dem Profil ein Knopf **Professionelles Dashboard**
steht.

---

## B · Facebook-Seite „IM Capital" anlegen (3 Minuten, Rechner)

Eine **Seite**, nicht ein Profil – nur eine Seite hat die Kennung, an der das
Instagram-Konto hängen kann.

1. `https://www.facebook.com/pages/create`
2. Name: `IM Capital`, Kategorie: `Finanzdienstleistung`
3. **Seite erstellen**, alles Weitere überspringen. Die Seite braucht nie
   einen Beitrag; sie ist ein Scharnier.

**Geklappt, wenn:** sie unter
`https://www.facebook.com/pages/?category=your_pages` neben **IM Invests**
steht.

---

## C · Instagram mit der Seite verknüpfen (5 Minuten)

Drei Wege; der erste ist der zuverlässigste.

1. **Instagram-App:** Profil → **Profil bearbeiten** → **Öffentliche
   Unternehmensinformationen** → **Seite** → **IM Capital** wählen →
   bestätigen.
2. **Konten-Center:** ☰ → Einstellungen → **Konten-Center** → Konten →
   Facebook hinzufügen.
3. **Business Suite, Rechner:**
   `https://business.facebook.com/latest/settings/instagram_accounts` →
   Instagram-Konto hinzufügen.

> Ein Häkchen in der App beweist nichts. Die einzige verbindliche Probe ist
> die Abfrage in **E 3**. Unsicher? Trotzdem weitermachen.

---

## D · Die Meta-App (2 Minuten – sie gibt es schon)

**Empfehlung: die vorhandene App von IM Invests mitbenutzen.** Eine App kann
mehrere Seiten bedienen; das Token in E gilt am Ende je Seite getrennt. Eine
zweite App wäre nur nötig, wenn IM Capital einem anderen Facebook-Konto
gehören soll.

1. `https://developers.facebook.com/apps/` – mit dem Facebook-Konto von
   IM Invests anmelden
2. Die App **IM Invests Veroeffentlichung** öffnen (Name laut
   `EINRICHTUNG.md` 3.3 b; heißt sie anders, die eine nehmen, bei der das
   Produkt **Instagram** eingerichtet ist)
3. Prüfen: **App-Modus = Entwicklung**. So bleibt es. **Nicht live
   schalten** – das verlangt eine Prüfung durch Meta, die Wochen dauern
   kann. Im Entwicklungsmodus darf die App alles, was dem eigenen
   Administrator-Konto gehört – und IM Capital gehört ihm.

**Falls doch eine eigene App:** wie `EINRICHTUNG.md` 3.3 b–c, Name z. B.
`IM Capital Veroeffentlichung` – **ohne** die Wörter Instagram, Facebook oder
Meta, sonst wird der Name stumm abgelehnt. Typ **Business**, Produkt
**Instagram** hinzufügen.

Die vier Berechtigungen, die das Token braucht:

| Berechtigung                | Wofür                                 |
| --------------------------- | ------------------------------------- |
| `instagram_basic`           | Konto und Beiträge lesen              |
| `instagram_content_publish` | veröffentlichen                       |
| `pages_show_list`           | die Facebook-Seite finden             |
| `pages_read_engagement`     | die Verknüpfung zu Instagram auslesen |

---

## E · Token und Kennung holen (15 Minuten, Rechner)

Es gibt drei Tokens, die gleich aussehen. Gebraucht wird am Ende das
**Seitentoken der Seite IM Capital** – es läuft **nicht** ab (gemessen bei
IM Invests am 11.10.2026: `expires_at: 0`).

### E 1 · Kurzlebiges Nutzertoken

1. `https://developers.facebook.com/tools/explorer/`
2. Rechts: **Meta App** = die App aus D, **User Token**
3. Unter **Permissions** die vier aus D anhaken (Suchfeld über der Liste)
4. **Generate Access Token** → im Facebook-Fenster:
   - zustimmen,
   - bei der **Seitenauswahl IM Capital anhaken** – und IM Invests
     **angehakt lassen**. Wer IM Invests hier abwählt, kann der App den
     Zugriff darauf entziehen – dann hört das Token von @im_invests auf zu
     funktionieren (Gegenprobe in E 5).
   - bestätigen

### E 2 · Verlängern (wichtig, sonst stirbt alles nach einer Stunde)

1. Token kopieren → `https://developers.facebook.com/tools/debug/accesstoken/`
   → einfügen → **Debug**
2. Prüfen: **Berechtigungen** zeigt alle vier
3. Ganz unten **Extend Access Token** → **das neue, untere** Token kopieren
4. Gegenprobe: das neue noch einmal debuggen → **Läuft ab** ≈ zwei Monate
   voraus. Steht dort „1 Stunde", ist es das alte.

### E 3 · Seitentoken und Instagram-Kennung

Zurück in den Graph API Explorer, das **verlängerte** Token oben ins Feld
**Access Token**. Nur den Pfad hinter `GET v21.0/` ändern:

```
me/accounts
```

Antwort (gekürzt):

```json
{
  "data": [
    { "name": "IM Invests", "id": "…", "access_token": "…" },
    { "name": "IM Capital", "id": "PAGE_ID", "access_token": "SEITENTOKEN" }
  ]
}
```

- `id` bei **IM Capital** = Seiten-ID (**nicht** die Instagram-Kennung)
- `access_token` bei **IM Capital** = **das Token für IM Capital**
  → `IG_ACCESS_TOKEN` (kommt in Teil F direkt auf den Server)

Dann, mit der Seiten-ID:

```
PAGE_ID?fields=instagram_business_account
```

```json
{ "instagram_business_account": { "id": "1784…" }, "id": "PAGE_ID" }
```

Die Zahl mit **1784…** (17 Stellen) = `IG_USER_ID`.

Fehlt `instagram_business_account`: Verknüpfung aus C fehlt oder das Konto
ist noch kein Unternehmenskonto → zurück zu A/C.

### E 4 · Gegenprobe

```
1784…?fields=username,followers_count
```

Steht dort der Benutzername von **IM Capital**, stimmt alles.

### E 5 · @im_invests nicht beschädigt?

Im Repository Website-1: **Actions → Instagram-Zugang prüfen → Run
workflow**. Muss weiter `@im_invests` melden. Wenn nicht: in E 1 wurde IM
Invests abgewählt → E wiederholen, beide Seiten anhaken, das neue
IM-Invests-Seitentoken als Secret `IG_ACCESS_TOKEN` in Website-1 ersetzen.

---

## F · Zugangsdaten auf dem VPS ablegen (lokale Sitzung, 5 Minuten)

`imcapital.cloud` läuft auf dem VPS `srv1899777.hstgr.cloud` (Ubuntu 24.04).
Die Zugangsdaten gehören **auf den Server**, nicht in Git.

Die lokale Sitzung soll **zuerst nachsehen**, wie IM Capital dort läuft
(Sprache, Prozessverwalter, wo die Umgebungsvariablen schon liegen) und sich
danach richten. Gibt es noch keine Stelle, dann so:

```bash
# auf dem VPS, als der Benutzer, unter dem die App läuft
sudo install -d -m 700 /etc/imcapital
sudo install -m 600 /dev/null /etc/imcapital/instagram.env
sudoedit /etc/imcapital/instagram.env
```

Inhalt (Werte aus E 3, **ohne** Leerzeichen davor oder dahinter):

```
IG_ACCESS_TOKEN=…
IG_USER_ID=1784…
IG_ERWARTETER_NAME=<Benutzername von IM Capital, ohne @>
```

- Rechte `600`, Eigentümer = der App-Benutzer
- Nicht im Webverzeichnis, nicht im Repository, nicht im Protokoll
- Der Betreiber tippt das Token selbst ein oder fügt es ein; die lokale
  Sitzung liest es nie zurück in den Chat

---

## G · Das Veröffentlichen (lokale Sitzung baut es in IM Capital ein)

### G 1 · Die drei Aufrufe bei Meta

Meta holt die Bilder **selbst** von einer öffentlichen Adresse. Es wird
keine Datei hochgeladen. Also: **erst** das Bild unter
`https://imcapital.cloud/…` erreichbar machen, **dann** veröffentlichen.

**Ein Bild:**

```bash
API=https://graph.facebook.com/v21.0
# 1. Behälter
curl -s -X POST "$API/$IG_USER_ID/media" \
  --data-urlencode "image_url=https://imcapital.cloud/instagram/1.jpg?v=<hash>" \
  --data-urlencode "caption=…" \
  -d "is_ai_generated=true" \
  -d "access_token=$IG_ACCESS_TOKEN"          # → {"id":"CONTAINER"}
# 2. warten, bis Meta das Bild geholt hat
curl -s "$API/CONTAINER?fields=status_code&access_token=$IG_ACCESS_TOKEN"
#    → so lange alle 3 s fragen, bis "FINISHED" (bei "ERROR" abbrechen, Frist 60 s)
# 3. veröffentlichen
curl -s -X POST "$API/$IG_USER_ID/media_publish" \
  -d "creation_id=CONTAINER" -d "access_token=$IG_ACCESS_TOKEN"   # → {"id":"MEDIA_ID"}
```

**Karussell (2–10 Bilder):** je Bild ein Behälter mit
`is_carousel_item=true` (ohne Beschriftung), auf jeden `FINISHED` warten,
dann ein Sammelbehälter mit `media_type=CAROUSEL`,
`children=ID1,ID2,…`, `caption=…`, `is_ai_generated=true`, warten, dann
`media_publish`. Genau so in `scripts/instagram-veroeffentlichen.ts`
(Website-1) – die lokale Sitzung kann es als Vorlage lesen.

**Danach (optional):** Kommentare einschalten –
`POST $API/MEDIA_ID` mit `comment_enabled=true` (`lib/instagram-nachgang.ts`).

### G 2 · Was die Bilder erfüllen müssen

- **JPEG** (kein PNG, kein WebP) – Meta nimmt für Beiträge nur JPEG
- Seitenverhältnis zwischen **4:5** (1080×1350, Hochformat, das nimmt
  IM Invests) und 1,91:1
- Über **HTTPS** öffentlich erreichbar, ohne Anmeldung, ohne Weiterleitung
  auf eine Login-Seite
- **`?v=<Prüfsumme>`** an die Adresse hängen: Meta merkt sich Bilder an der
  Adresse und holte am 18.10.2026 bei IM Invests Kacheln vom Vortag
  (`ENTSCHEIDUNGEN.md`, „Meta merkt sich Bilder an der Adresse")

### G 3 · Die Beschriftung

- höchstens **2.200 Zeichen**, höchstens **5 Hashtags** (mehr nimmt
  Instagram seit 2025 nicht mehr an)
- Rechtshinweis und KI-Hinweis wie bei IM Invests (`RECHTSHINWEIS` in
  `lib/instagram-plan.ts`), angepasst auf IM Capital

### G 4 · Die Riegel – vor dem ersten Aufruf bei Meta

Übernommen von IM Invests, jeder einzelne aus einem echten Fehler:

1. **Trockenlauf ist die Voreinstellung.** Veröffentlicht wird nur mit
   ausdrücklichem Schalter (`VEROEFFENTLICHEN=ja`).
2. **Freigabe**, falls IM Capital eine will: ein Datum, das _heute_ sein
   muss – kein Schalter, der stehen bleibt („Der vierte Riegel ist ein
   Datum", `ENTSCHEIDUNGEN.md`).
3. **Nicht doppelt:** vorher `GET $API/$IG_USER_ID/media?fields=timestamp,caption&limit=10`
   und abbrechen, wenn der heutige Beitrag schon dort steht.
4. **Richtiges Konto:** einmal je Lauf
   `GET $API/$IG_USER_ID?fields=username` gegen `IG_ERWARTETER_NAME`.
5. **Bild erreichbar:** jede Bildadresse vorher selbst abrufen – 200 und
   `Content-Type: image/jpeg`, sonst nicht anfangen.
6. **Kontingent:** Meta begrenzt die über die Schnittstelle
   veröffentlichten Beiträge je Konto und 24 Stunden;
   `GET $API/$IG_USER_ID/content_publishing_limit` sagt, wie viele übrig
   sind. Bei ein bis zwei Beiträgen am Tag spielt es keine Rolle – erst bei
   einer Wiederholungsschleife.

---

## H · Zeitplan auf dem VPS und der erste Beitrag

### H 1 · Zuerst die Zugangsprobe

Ein kleines Skript, das nur liest:

```bash
set -a; . /etc/imcapital/instagram.env; set +a
curl -s "https://graph.facebook.com/v21.0/$IG_USER_ID?fields=username,followers_count,media_count&access_token=$IG_ACCESS_TOKEN"
```

Erwartet: der Benutzername von IM Capital. Das Token selbst taucht in der
Ausgabe nicht auf – so lassen.

### H 2 · Erster Beitrag: erst ansehen, dann veröffentlichen

1. Trockenlauf: Bildadressen ausgeben, im Browser öffnen, Beschriftung
   lesen. Das ist genau, was Meta abholen würde.
2. Dann einmal von Hand mit `VEROEFFENTLICHEN=ja`. In der App ansehen.
3. Erst danach in den Zeitplan.

### H 3 · Zeitplan

Auf dem VPS gibt es – anders als bei GitHub – einen Rechner, der wirklich
um die Uhrzeit läuft. Ein **systemd-Timer** ist cron vorzuziehen (Protokoll
mit `journalctl`, verpasste Läufe holt `Persistent=true` nach):

```ini
# /etc/systemd/system/imcapital-instagram.service
[Service]
Type=oneshot
User=<app-benutzer>
EnvironmentFile=/etc/imcapital/instagram.env
Environment=VEROEFFENTLICHEN=ja
WorkingDirectory=<pfad der app>
ExecStart=<befehl, der veröffentlicht>

# /etc/systemd/system/imcapital-instagram.timer
[Timer]
OnCalendar=*-*-* 15:07:00 Europe/Berlin
Persistent=true
[Install]
WantedBy=timers.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now imcapital-instagram.timer
systemctl list-timers imcapital-instagram.timer
```

Krumme Minute (15:07, nicht 15:00) – dieselbe Gewohnheit wie bei IM Invests.

### H 4 · Wenn etwas schiefgeht, soll es jemand merken

Ein Lauf, der still scheitert, ist der teuerste Fehler (`AGENTS.md`). Am
einfachsten: bei Fehlschlag eine Mail an den Betreiber (`OnFailure=` im
Service auf eine kleine Mail-Unit) – die Business-E-Mail von Hostinger ist
schon gebucht.

---

## Wenn es nicht klappt

| Meldung                                    | Ursache                                                        |
| ------------------------------------------ | -------------------------------------------------------------- |
| `(#190) … session has expired`             | Nutzertoken statt Seitentoken (E 3), 60 Tage um                |
| `Token wird abgelehnt (400)`               | kurzlebiges Token (E 2 übersprungen) oder Leerzeichen          |
| `Unsupported get request` / nicht abrufbar | Seiten-ID statt `1784…`-Kennung eingetragen                    |
| `(#200) Requires … permission`             | eine der vier Berechtigungen fehlt (E 1)                       |
| `instagram_business_account` fehlt         | Konto nicht verknüpft (C) oder noch kein Unternehmenskonto (A) |
| Meta kann das Bild nicht holen             | Bild nicht erreichbar, kein JPEG, oder Login davor (G 2)       |
| Behälter bleibt `IN_PROGRESS` / `ERROR`    | Bild zu groß, falsches Format, Adresse langsam                 |
| @im_invests meldet plötzlich Fehler        | in E 1 die Seite IM Invests abgewählt → E 5                    |

**Rückfallweg ohne Entwickler-App:** ein Dienst wie Make mit eigener, von
Meta genehmigter App – beschrieben in `EINRICHTUNG.md` 3.11. Setzt ein
**Unternehmenskonto** voraus (deshalb in A nicht Creator wählen).

## Was über die Schnittstelle nicht geht

Stand Juni 2026, siehe `INSTAGRAM.md` „Nach dem Beitrag" und „Musik":

- **Likes und Teilen verbergen** – nur in der App, je Beitrag
- **Musik** – nur bei Reels, nicht bei Bild- und Karussellbeiträgen
- **Story mit Verweis auf den Beitrag** – nur in der App
