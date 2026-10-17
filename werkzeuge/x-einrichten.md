# X (Twitter) einrichten – Auftrag für die Sitzung am PC

> **An die lokale Sitzung:** Diese Datei ist dein Auftrag. Lies zuerst
> `AGENTS.md`; es gilt alles dort, auch „selbst mergen nur bei grüner
> Prüfung". Du arbeitest **mit dem Betreiber zusammen** – Anmeldungen,
> Zahlungen und das Eintippen von Schlüsseln macht er; du führst ihn durch,
> prüfst und schreibst das Ergebnis auf.

## Worum es geht

Der Betreiber am 17.10.2026: „Ich möchte die News und Beiträge auch auf
Twitter (X) automatisch teilen." Gemeint sind die beiden täglichen
Instagram-Beiträge:

| Was                        | Auf X                                                 | Wann                                             |
| -------------------------- | ----------------------------------------------------- | ------------------------------------------------ |
| Top-News des Tages         | Post mit Deckblatt + 3 Kacheln, Antwort mit 2 Kacheln | nach dem Bau, wie Instagram (Rückfall 03:29 UTC) |
| Zahlenkarte (Tagesbeitrag) | ein Post mit der Karte                                | ab 16 Uhr, nur mit Freigabe, wie Instagram       |

**Der Code liegt schon bereit und ruht**, bis du ihn scharf stellst:

- `lib/x-text.ts` – die Texte (höchstens 280 Zeichen, KI-Hinweis, **kein
  Link** – ein Post mit Link kostet rund 0,20 $ statt 0,015 $)
- `lib/x-oauth.ts` – die Anmeldung (OAuth 1.0a), geprüft gegen das
  Rechenbeispiel der X-Dokumentation (`tests/x-text.test.ts`)
- `app/x/heute.json` – was heute hinausginge, auf der Website
- `scripts/x-veroeffentlichen.ts` – Hochladen und Posten, mit Riegeln
- `.github/workflows/x-beitrag.yml` – der Lauf; angestoßen aus
  `paket-bauen.yml` und `instagram-zahlenkarte.yml`, **aber erst, wenn die
  Variable `X_AKTIV` auf `ja` steht**

**Nicht geprüft ist der Weg zu X selbst** – die Cloud-Sitzung, die den Code
schrieb, erreicht X nicht. Unsicher sind vor allem das Hochladen der Bilder
(`POST https://api.x.com/2/media/upload`, multipart, Feld `media`,
`media_category=tweet_image`) und die Form der Antwort. Deshalb erst ein
Trockenlauf, dann ein beobachteter echter Lauf.

## Kosten

X hat seit 2026 keine kostenlose Stufe mehr für neue Entwickler; bezahlt
wird je Aufruf, vorab als Guthaben (Stand Oktober 2026, laut
Drittanbieter-Übersichten – **maßgeblich ist docs.x.com**, dort nachsehen
und hier eintragen):

- ein Post ohne Link: ~0,015 $; mit Link: ~0,20 $
- Bilder hochladen: auf docs.x.com nachsehen
- täglich drei Posts ohne Link → grob 1–2 $ im Monat

Ist das Guthaben leer, antwortet X mit **402** – der Lauf wird rot und sagt
es.

## Schritte

### 1. Das Konto

**Spur vom 17.10.2026:** Im Gmail-Postfach des Betreibers liegt eine
Bestätigungsmail von X (`verify@x.com`) vom **27.07.2026** – dem Tag, an dem
auch der Instagram-Kanal begann. Wahrscheinlich gibt es also ein Konto.
Zuerst dort anmelden (mit der Adresse, an die die Mail ging; Passwort
notfalls über „Passwort vergessen"), Namen (@…) und Profil ansehen. Ob es ein
privates Konto ist oder eins für IM Invests, entscheidet der Betreiber.

- Gibt es ein X-Konto für IM Invests? Welcher Name (@…)? In `lib/site.ts`
  steht `twitterHandle: '@iminvests'` nur als Platzhalter.
- Falls neu: Profilbild, Banner und Beschreibung wie bei Instagram; Link
  auf `https://iminvests.de` ins Profil (dort kostet er nichts).
- Im Profil das Konto als **automatisiert** kennzeichnen (Einstellungen →
  Konto → „Automatisierung", verwaltendes Konto angeben) – X verlangt das
  für Bots.

### 2. Der Entwicklerzugang

Mit dem Betreiber im Browser, angemeldet **als das IM-Invests-Konto**:

1. `https://developer.x.com` → Developer Portal → Zugang beantragen (die
   Abfrage nach dem Zweck: „Automatisches Teilen der eigenen täglichen
   Finanznachrichten-Grafiken von iminvests.de").
2. Ein Projekt und darin eine App anlegen.
3. Abrechnung: Pay-per-use, Guthaben aufladen (für den Anfang 5–10 $).
4. In der App unter **User authentication settings**:
   - App permissions: **Read and write**
   - Type of App: **Web App, Automated App or Bot**
   - Callback URI und Website: `https://iminvests.de`
5. Unter **Keys and tokens**:
   - **API Key and Secret** (Consumer Keys) erzeugen
   - **Access Token and Secret** erzeugen – **erst nach** Schritt 4, sonst
     fehlt das Schreibrecht (403). Wer es vorher erzeugt hat: neu erzeugen.

### 3. Die Schlüssel als GitHub-Secrets

**Der Betreiber tippt sie ein, nicht du.** Kein Schlüssel in den Chat, in
eine Datei oder in einen Commit. Im Terminal des Betreibers:

    gh secret set X_API_KEY       --repo PeterPan405/Website-1
    gh secret set X_API_SECRET    --repo PeterPan405/Website-1
    gh secret set X_ACCESS_TOKEN  --repo PeterPan405/Website-1
    gh secret set X_ACCESS_SECRET --repo PeterPan405/Website-1

(`gh secret set` fragt den Wert verdeckt ab.) Prüfen: `gh secret list`.

### 4. Trockenlauf

    gh workflow run x-beitrag.yml --repo PeterPan405/Website-1 -f art=tagesnews -f scharf=nein

Im Protokoll muss stehen: die Texte beider Posts, „Trockenlauf – zum
Veröffentlichen SCHARF=ja". Mit dem Betreiber ansehen: Gefällt der Text?
Änderungen in `lib/x-text.ts`, Test in `tests/x-text.test.ts`.

### 5. Ein echter Lauf, beobachtet

    gh workflow run x-beitrag.yml --repo PeterPan405/Website-1 -f art=tagesnews -f scharf=ja

Danach auf X nachsehen: zwei Posts (Antwort darunter), vier und zwei
Bilder, Text vollständig. Die Marke steht auf dem Zweig `x-gepostet`
(`git show origin/x-gepostet:x-gepostet.txt`).

Wenn es scheitert – das Protokoll nennt den Code:

| Code               | Bedeutung                                  | Was tun                                                                                           |
| ------------------ | ------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| 401                | Signatur oder Schlüssel falsch             | Secrets prüfen (Leerzeichen?), Access Token neu erzeugen                                          |
| 403                | Kein Schreibrecht, oder Konto/App gesperrt | Schritt 2.4, dann Access Token **neu** erzeugen                                                   |
| 402                | Guthaben leer                              | aufladen                                                                                          |
| 400 beim Hochladen | Form des Medien-Aufrufs stimmt nicht       | docs.x.com → Media Upload nachlesen und `hochladen()` in `scripts/x-veroeffentlichen.ts` anpassen |

Ist nach einem Fehler schon ein Post draußen, steht die Marke – der
nächste Lauf schickt ihn nicht doppelt. Einen halben Beitrag löscht der
Betreiber von Hand; dann die Zeile aus der Marke nehmen, bevor neu
gestartet wird.

### 6. Scharf stellen

Erst wenn Schritt 5 sauber war:

    gh variable set X_AKTIV --body ja --repo PeterPan405/Website-1

Ab dann gehen die Tagesnews nach jedem Bau und die Zahlenkarte nach ihrer
Freigabe ab 16 Uhr von selbst auf X. Abschalten: `gh variable set X_AKTIV --body nein`.

Die Zahlenkarte einmal von Hand prüfen, am ersten Tag nach 16 Uhr:

    gh workflow run x-beitrag.yml --repo PeterPan405/Website-1 -f art=zahlenkarte -f scharf=nein

### 7. Aufräumen und aufschreiben

- `lib/site.ts`: `twitterHandle` auf den echten Namen (für die Twitter-Card
  der Website); PR, Prüfung, mergen.
- Die Kosten von docs.x.com oben eintragen, mit Datum.
- In `ENTSCHEIDUNGEN.md` unter „X teilt, was Instagram zeigt" nachtragen,
  was der erste echte Lauf ergab (welcher Upload-Weg, welche Antwort).
  Danach `ANWENDEN=1 npm run wissen`.
- Dem Betreiber in zwei Sätzen sagen, was jetzt automatisch läuft.
