# Instagram für den privaten Account „Igor Original" – Hochladen vom Rechner

**Für wen:** den Betreiber am Rechner und die lokale Claude-Sitzung
**„Alles-Mögliche-Chat"** auf seinem Computer. Sie soll später Beiträge auf
den privaten Account **Igor Original** hochladen können, wenn dort Inhalte
entstehen – nicht nach Zeitplan, sondern **auf Zuruf, mit Freigabe**.

**Vorbild:** derselbe Weg wie bei **@im_invests** (läuft seit Oktober 2026)
und wie in `ANLEITUNG-IM-CAPITAL-INSTAGRAM.md` für IM Capital: direkt über
die Graph API von Meta, ohne Zwischendienst. Hier steht, was für einen
**privaten** Account anders ist – das sind vor allem drei Dinge:

1. **Ein Profikonto ist immer öffentlich.** Das ist die einzige
   Entscheidung, die vorher fallen muss (Teil A).
2. **Kein Server, keine Website.** Der Chat läuft auf dem Rechner. Meta holt
   Bilder aber nur von einer **öffentlichen Adresse** – also braucht es eine
   Ablage im Netz (Teil F).
3. **Kein Zeitplan.** Hochgeladen wird, wenn Igor es sagt (Teil H).

**Zeitbedarf:** 45 bis 60 Minuten für die Verbindung (A–E), 15 Minuten für
Ablage und erstes Hochladen (F–H).

> **Zugangsdaten nie in den Chat, nie in ein Repository, nie in einen
> Screenshot.** Ein Token, das je in einer Nachricht stand, gilt als
> verbrannt und wird neu erzeugt. Der Chat schreibt es direkt in die Datei
> (Teil F) und zeigt es nirgends an.

---

## Überblick

```
Instagram-Account Igor Original (privat)
        ↓ A  auf Profikonto umstellen (wird damit öffentlich!)
        ↓ B  Facebook-Seite „Igor Original" anlegen
        ↓ C  beides verknüpfen
        ↓ D  Meta-App (die von IM Invests wiederverwenden)
        ↓ E  Token holen → Seitentoken (läuft nicht ab) + Instagram-Kennung (1784…)
        ↓ F  Token auf dem Rechner ablegen + öffentliche Bildablage einrichten
        ↓ G  Hochladen: Bild, Karussell oder Reel
        ↓ H  Freigabe-Ablauf, erster Beitrag
```

Instagram hat keine eigene Schnittstelle zum Veröffentlichen. Es gibt nur die
Graph API von Meta, und die kennt ein Instagram-Konto nur über eine
**Facebook-Seite**. Die Reihenfolge lässt sich nicht umstellen.

---

## Was vorher bereitliegen muss

- [ ] Instagram-App am Telefon, eingeloggt als **Igor Original**
- [ ] Das Facebook-Konto, mit dem auch die Seiten **IM Invests** (und ggf.
      **IM Capital**) verwaltet werden – dann gibt es keine neue
      Entwickler-Registrierung (die hing am 29.08.2026 an einer SMS;
      `EINRICHTUNG.md` 3.11)
- [ ] Ein Rechner mit Browser – D und E gehen am Telefon nicht
- [ ] Für Teil F: SSH-Zugang zum VPS `srv1899777.hstgr.cloud` (die
      Bildablage) oder Zugang zum Hostinger-Webhosting

---

## A · Auf „professionell" umstellen (5 Minuten, Telefon)

> **Vorher entscheiden:** Ein Profikonto (Creator oder Unternehmen) **kann
> nicht privat sein.** Mit dem Umstellen wird Igor Original öffentlich –
> alle bisherigen Beiträge, Profilbild, Bio, für jeden sichtbar, auch ohne
> Folgen-Anfrage. Wer das nicht will, hört hier auf: Für ein privates Konto
> gibt es keine Schnittstelle zum Veröffentlichen.
>
> Zurückstellen auf „privat" geht später wieder (gleiches Menü) – dann
> funktioniert aber auch das automatische Hochladen nicht mehr.

In der Instagram-App, eingeloggt als Igor Original:

1. Profilbild unten rechts → oben rechts **☰**
2. **Einstellungen und Privatsphäre** → ganz unten **Für Profis**
3. **Kontotyp und Tools** → **Auf professionelles Konto umstellen**
4. Kategorie nach Wahl (z. B. **Unternehmer** oder **Persönlicher Blog**,
   später änderbar)
5. **Creator oder Unternehmen?**
   - **Creator** passt zu einer Person und reicht für den Weg in dieser
     Anleitung.
   - **Unternehmen** nur, wenn auch der Rückfallweg über einen Dienst wie
     Make offenstehen soll – der nimmt laut `EINRICHTUNG.md` 3.11 **kein**
     Creator-Konto.

Findet man „Für Profis" nicht: oben in den Einstellungen ins Suchfeld
`professionell` tippen.

**Geklappt, wenn:** auf dem Profil **Professionelles Dashboard** steht.

---

## B · Facebook-Seite anlegen (3 Minuten, Rechner)

Eine **Seite**, nicht das private Facebook-Profil – nur eine Seite hat die
Kennung, an der das Instagram-Konto hängen kann. Die Seite muss nie einen
Beitrag haben; sie ist ein Scharnier.

1. `https://www.facebook.com/pages/create`
2. Name: `Igor Original` (frei wählbar), Kategorie z. B. `Unternehmer`
3. **Seite erstellen**, alles Weitere überspringen

**Geklappt, wenn:** sie unter
`https://www.facebook.com/pages/?category=your_pages` neben **IM Invests**
steht.

---

## C · Instagram mit der Seite verknüpfen (5 Minuten)

1. **Instagram-App** (zuverlässigster Weg): Profil → **Profil bearbeiten** →
   **Seite** (bei Creator-Konten oft unter **Öffentliche
   Kontoinformationen**) → **Igor Original** wählen → bestätigen
2. oder **Konten-Center:** ☰ → Einstellungen → **Konten-Center** → Konten →
   Facebook hinzufügen
3. oder **Business Suite** am Rechner:
   `https://business.facebook.com/latest/settings/instagram_accounts`

> Ein Häkchen in der App beweist nichts. Verbindlich ist erst die Abfrage in
> **E 3**.

---

## D · Die Meta-App (2 Minuten – sie gibt es schon)

**Die vorhandene App von IM Invests mitbenutzen.** Eine App kann mehrere
Seiten bedienen; am Ende hat jede Seite ihr eigenes Token.

1. `https://developers.facebook.com/apps/` – mit dem Facebook-Konto von
   IM Invests anmelden
2. Die App **IM Invests Veroeffentlichung** öffnen (die mit dem Produkt
   **Instagram**)
3. **App-Modus = Entwicklung** – so lassen, **nicht live schalten**. Im
   Entwicklungsmodus darf die App alles, was dem eigenen Konto gehört.

Die vier Berechtigungen:

| Berechtigung                | Wofür                                 |
| --------------------------- | ------------------------------------- |
| `instagram_basic`           | Konto und Beiträge lesen              |
| `instagram_content_publish` | veröffentlichen                       |
| `pages_show_list`           | die Facebook-Seite finden             |
| `pages_read_engagement`     | die Verknüpfung zu Instagram auslesen |

---

## E · Token und Kennung holen (15 Minuten, Rechner)

Gebraucht wird am Ende das **Seitentoken der Seite Igor Original** – es läuft
**nicht** ab (bei IM Invests gemessen am 11.10.2026: `expires_at: 0`).

### E 1 · Kurzlebiges Nutzertoken

1. `https://developers.facebook.com/tools/explorer/`
2. Rechts: **Meta App** = die App aus D, **User Token**
3. Unter **Permissions** die vier aus D anhaken
4. **Generate Access Token** → im Facebook-Fenster:
   - zustimmen,
   - bei der **Seitenauswahl Igor Original anhaken** – und **IM Invests**
     (und **IM Capital**, falls schon eingerichtet) **angehakt lassen**. Wer
     dort eine Seite abwählt, kann der App den Zugriff darauf entziehen,
     und der Beitrag dieser Seite bleibt aus (Gegenprobe E 5).
   - bestätigen

### E 2 · Verlängern

1. Token kopieren → `https://developers.facebook.com/tools/debug/accesstoken/`
   → einfügen → **Debug** → **Berechtigungen** zeigt alle vier?
2. Ganz unten **Extend Access Token** → **das neue, untere** Token kopieren
3. Gegenprobe: das neue noch einmal debuggen → **Läuft ab** ≈ zwei Monate
   voraus

### E 3 · Seitentoken und Instagram-Kennung

Graph API Explorer, das **verlängerte** Token oben einsetzen, Pfad:

```
me/accounts
```

In der Antwort den Eintrag **Igor Original** suchen:

- `id` = Seiten-ID (**nicht** die Instagram-Kennung)
- `access_token` = **das Token für Igor Original** → `IG_ACCESS_TOKEN`

Dann mit der Seiten-ID:

```
SEITEN_ID?fields=instagram_business_account
```

Die Zahl mit **1784…** = `IG_USER_ID`. (Das Feld heißt auch bei
Creator-Konten `instagram_business_account`.)

Fehlt das Feld: Verknüpfung aus C fehlt oder das Konto ist noch privat →
zurück zu A/C.

### E 4 · Gegenprobe

```
1784…?fields=username,followers_count
```

Muss den Benutzernamen von **Igor Original** zeigen.

### E 5 · Die anderen Konten nicht beschädigt?

- **IM Invests:** im Repository Website-1 **Actions → Instagram-Zugang
  prüfen → Run workflow** → muss `@im_invests` melden.
- **IM Capital** (falls eingerichtet): die Zugangsprobe aus
  `ANLEITUNG-IM-CAPITAL-INSTAGRAM.md` H 1.

Meldet eins davon einen Fehler: E wiederholen, alle Seiten anhaken, das
betroffene Seitentoken an seiner Stelle ersetzen.

---

## F · Ablage auf dem Rechner und im Netz (Chat, 10 Minuten)

### F 1 · Das Token auf dem Rechner

Der Chat läuft auf Igors Computer – dort liegt auch das Token, **außerhalb
jedes Projektordners**:

| System        | Datei                                    |
| ------------- | ---------------------------------------- |
| macOS / Linux | `~/.config/igor-instagram/instagram.env` |
| Windows       | `%APPDATA%\igor-instagram\instagram.env` |

Inhalt (ohne Leerzeichen davor oder dahinter):

```
IG_ACCESS_TOKEN=…
IG_USER_ID=1784…
IG_ERWARTETER_NAME=<Benutzername von Igor Original, ohne @>
```

- macOS/Linux: `chmod 700 ~/.config/igor-instagram` und
  `chmod 600 …/instagram.env`
- Igor fügt das Token selbst in die Datei ein; der Chat liest die Datei nur
  beim Hochladen und gibt das Token nie aus
- In keinen Ordner, der mit Git, iCloud-Freigabe oder Dropbox-Freigabe
  geteilt wird

### F 2 · Eine öffentliche Bildablage

**Meta lädt keine Datei vom Rechner.** Übergeben wird eine **Adresse**, von
der Meta das Bild selbst holt. Für einen privaten Account gibt es keine
Website – also braucht es einen Ort im Netz, an dem ein Bild für ein paar
Minuten öffentlich liegt.

**Empfehlung: ein unauffälliger Ordner auf dem VPS** (läuft ohnehin, kostet
nichts extra):

1. Der Chat sieht per SSH nach, welcher Webserver dort läuft und unter
   welcher Domain mit HTTPS (`imcapital.cloud` zeigt auf diesen Server).
2. Ein eigener Ordner, z. B. `…/ablage/<zufällige 24 Zeichen>/`, ohne
   Verzeichnisliste.
3. Ablauf je Beitrag: Bild per `scp` dorthin → veröffentlichen (G) →
   **Bild sofort wieder löschen**. Es liegt damit nur Minuten im Netz, unter
   einer Adresse, die niemand rät.

**Alternative:** eine Subdomain im vorhandenen Hostinger-Webhosting (das
Paket „Unlimited" trägt mehrere Websites), gleiches Vorgehen. Welche der
beiden, entscheidet der Chat nach dem, was er auf dem Server vorfindet –
und fragt, bevor er dort etwas Dauerhaftes anlegt.

> Nicht über Cloud-Links (Google Drive, Dropbox, iCloud): Die liefern meist
> eine Vorschauseite statt des Bildes, und Meta scheitert daran.

---

## G · Hochladen (der Chat macht es auf Zuruf)

### G 1 · Ein Bild

```bash
set -a; . ~/.config/igor-instagram/instagram.env; set +a
API=https://graph.facebook.com/v21.0
BILD="https://<ablage>/<zufall>/bild.jpg"

# 1. Behälter
curl -s -X POST "$API/$IG_USER_ID/media" \
  --data-urlencode "image_url=$BILD" \
  --data-urlencode "caption=…" \
  -d "access_token=$IG_ACCESS_TOKEN"            # → {"id":"BEHAELTER"}
# 2. warten, bis Meta das Bild geholt hat (alle 3 s, Frist 60 s)
curl -s "$API/BEHAELTER?fields=status_code&access_token=$IG_ACCESS_TOKEN"
#    → "FINISHED" abwarten; bei "ERROR" abbrechen
# 3. veröffentlichen
curl -s -X POST "$API/$IG_USER_ID/media_publish" \
  -d "creation_id=BEHAELTER" -d "access_token=$IG_ACCESS_TOKEN"   # → {"id":"MEDIA_ID"}
# 4. Bild aus der Ablage löschen
```

### G 2 · Karussell (2–10 Bilder)

Je Bild ein Behälter mit `is_carousel_item=true` (ohne Beschriftung), jeden
bis `FINISHED` abwarten, dann ein Sammelbehälter mit
`media_type=CAROUSEL`, `children=ID1,ID2,…` und `caption=…`, abwarten,
`media_publish`. Vorlage: `scripts/instagram-veroeffentlichen.ts` in
Website-1.

### G 3 · Reel (Video)

Wie ein Bild, aber `media_type=REELS` und `video_url=…` statt `image_url`
(MP4, H.264, öffentlich erreichbar). Die Verarbeitung dauert bei Videos
länger – Frist für `status_code` auf einige Minuten setzen.

### G 4 · Was Bilder und Text erfüllen müssen

- Bilder **JPEG**, Seitenverhältnis zwischen **4:5** (1080×1350) und 1,91:1
- Adresse per **HTTPS**, ohne Anmeldung; bei erneutem Hochladen derselben
  Datei `?v=<Prüfsumme>` anhängen (Meta merkt sich Bilder an der Adresse,
  `ENTSCHEIDUNGEN.md`)
- Beschriftung höchstens **2.200 Zeichen**, höchstens **5 Hashtags**
- `is_ai_generated=true` nur, wenn der Inhalt mit KI erzeugt ist

---

## H · Ablauf mit Freigabe und der erste Beitrag

**Ohne Igors ausdrückliches „hochladen" / „passt" geht nichts hinaus.** Ein
Beitrag ist nicht zurückzunehmen, nur zu löschen – und gesehen haben ihn dann
schon welche.

1. **Zugangsprobe** (liest nur):
   ```bash
   curl -s "https://graph.facebook.com/v21.0/$IG_USER_ID?fields=username,media_count&access_token=$IG_ACCESS_TOKEN"
   ```
   Benutzername muss `IG_ERWARTETER_NAME` sein – sonst abbrechen.
2. **Vorschau im Chat:** Bild(er) zeigen, Beschriftung zeigen.
3. **Freigabe abwarten.** Nur das Wort von Igor in diesem Chat gilt.
4. **Nicht doppelt:** vorher die letzten Beiträge abfragen
   (`$API/$IG_USER_ID/media?fields=timestamp,caption,permalink&limit=5`).
5. **Hochladen** nach G, danach **Link zum Beitrag** (`permalink`) in den
   Chat und die Datei aus der Ablage löschen.

Beim allerersten Mal ein unkritisches Bild nehmen und in der App
nachsehen, wie es aussieht.

---

## Wenn es nicht klappt

| Meldung                                    | Ursache                                                 |
| ------------------------------------------ | ------------------------------------------------------- |
| `(#190) … session has expired`             | Nutzertoken statt Seitentoken (E 3), 60 Tage um         |
| `Token wird abgelehnt (400)`               | kurzlebiges Token (E 2 übersprungen) oder Leerzeichen   |
| `Unsupported get request` / nicht abrufbar | Seiten-ID statt `1784…`-Kennung                         |
| `(#200) Requires … permission`             | eine der vier Berechtigungen fehlt (E 1)                |
| `instagram_business_account` fehlt         | Konto noch privat (A) oder nicht verknüpft (C)          |
| Meta kann das Bild nicht holen             | Ablage nicht öffentlich, kein JPEG, Cloud-Vorschauseite |
| Behälter bleibt `IN_PROGRESS` / `ERROR`    | Bild/Video zu groß, falsches Format, Adresse zu langsam |
| IM Invests / IM Capital melden Fehler      | in E 1 eine Seite abgewählt → E 5                       |

## Was über die Schnittstelle nicht geht

Stand Juni 2026, siehe `INSTAGRAM.md`:

- **Likes und Teilen verbergen** – nur in der App, je Beitrag
- **Musik** an Bild- und Karussellbeiträgen – nur in der App; per
  Schnittstelle allenfalls bei Reels
- **Story mit Verweis auf den Beitrag** – nur in der App
- **Private Konten** – gar nicht (Teil A)
