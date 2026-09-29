#!/usr/bin/env bash
#
# Alles, was noch einen Menschen braucht – in einem Befehl.
#
#     bash scripts/einrichten.sh            alles Offene der Reihe nach
#     bash scripts/einrichten.sh --stand    nur nachsehen, nichts ändern
#     bash scripts/einrichten.sh --selbsttest   die Prüfungen gegen sich selbst
#     bash scripts/einrichten.sh --nur spotify  einen einzelnen Punkt
#
# ## Warum es dieses Skript gibt
#
# In `EINRICHTUNG.md` stehen zu jedem offenen Punkt „Aufträge zum Kopieren" –
# Textblöcke, die jemand in einen Chat einfügt, damit der die Handgriffe
# ausführt. Das hat funktioniert und hatte zwei Schwächen: Der Auftrag wurde
# jedes Mal neu gelesen und ausgelegt, und was er beschreibt, ist zu neunzig
# Prozent mechanisch.
#
# Der Betreiber hat am 10. September 2026 verlangt, dass das, was er selbst tun
# muss, als Skript dasteht. Also steht es hier. Was ein Mensch beisteuert, sind
# **die Zeichenketten aus einem Browser, in dem er angemeldet ist** – ein
# Bestätigungsschlüssel von Google, ein Anwendungsschlüssel von Spotify. Alles
# davor und alles danach macht dieses Skript.
#
# ## Was es ausdrücklich nicht tut
#
# **Sich an fremden Konten anmelden.** Weder bei Google noch bei Spotify.
# Beide setzen ihre Anmeldung mit Absicht vor die Schlüssel; daran wird nicht
# vorbeigearbeitet. Das Skript sagt, was im Browser zu tun ist, und wartet.
#
# **Ein Geheimnis irgendwo hinschreiben.** Der Spotify-Schlüssel wird mit
# ausgeschalteter Anzeige eingelesen, geht über die Standardeingabe an
# `gh secret set` und steht in keiner Datei, keinem Commit, keinem Protokoll
# und keiner Prozessliste. Er wird auch nicht zur Kontrolle noch einmal
# angezeigt – siehe den Kasten in `EINRICHTUNG.md`: Ein Schlüssel, der einmal
# sichtbar war, wird nicht dadurch wieder geheim, dass man ihn löscht.
#
# **Bestehende Zugangsdaten stillschweigend überschreiben.** Liegt ein Secret
# schon vor, fragt das Skript. Das ist die Grenze aus `AGENTS.md`: Selbst
# mergen ohne Rückfrage ja, Unumkehrbares nein.
#
# ## Die Reihenfolge der Prüfung – erst fragen, dann speichern
#
# Beim Spotify-Punkt geht die Anmeldung **vor** dem Hinterlegen. Ein falsch
# kopiertes Secret sieht sonst genauso aus wie ein richtiges: Das Setzen
# gelingt, und erst der nächste nächtliche Lauf meldet `invalid_client` – in
# einem Protokoll, das niemand liest. Genau so ist der 1. September 2026
# verlaufen (`EINRICHTUNG.md`, 5.0). Deshalb fragt das Skript zuerst Spotify
# selbst und hinterlegt nur, was dort angenommen wurde.
#
# Das ist derselbe Satz wie überall hier: **Ein Riegel ist so gut wie die
# Quelle, die er fragt.**

set -u

# ---------------------------------------------------------------- Ausgabe

if [ -t 1 ]; then
  F_KOPF=$'\033[1m'; F_GUT=$'\033[32m'; F_WARN=$'\033[33m'; F_ROT=$'\033[31m'; F_AUS=$'\033[0m'
else
  F_KOPF=''; F_GUT=''; F_WARN=''; F_ROT=''; F_AUS=''
fi

kopf()   { printf '\n%s══ %s ══%s\n\n' "$F_KOPF" "$1" "$F_AUS"; }
sagen()  { if [ -n "$1" ]; then printf '   %s\n' "$1"; else printf '\n'; fi; }
gut()    { printf '%s ✓ %s%s\n' "$F_GUT" "$1" "$F_AUS"; }
warnen() { printf '%s ! %s%s\n' "$F_WARN" "$1" "$F_AUS"; }
rot()    { printf '%s ✗ %s%s\n' "$F_ROT" "$1" "$F_AUS"; }
frage()  { printf '\n%s?%s %s ' "$F_KOPF" "$F_AUS" "$1"; }

# Ja/Nein, Voreinstellung Nein. Ohne Terminal (etwa in einer Pipe) immer Nein –
# ein Skript, das auf eine unbeantwortete Frage hin weitermacht, hat keine.
bestaetigt() {
  [ -t 0 ] || { warnen "Keine Eingabe möglich – gilt als Nein."; return 1; }
  frage "$1 [j/N]"
  local antwort
  read -r antwort || return 1
  case "$antwort" in [jJyY]*) return 0 ;; *) return 1 ;; esac
}

# ------------------------------------------------------------- Argumente

MODUS=alles
NUR=''

while [ $# -gt 0 ]; do
  case "$1" in
    --stand)      MODUS=stand ;;
    --selbsttest) MODUS=selbsttest ;;
    --nur)        shift; NUR="${1:-}" ;;
    --hilfe|-h|--help)
      sed -n '3,9p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *) rot "Unbekanntes Argument: $1"; exit 2 ;;
  esac
  shift
done

WURZEL=$(cd "$(dirname "$0")/.." && pwd)
cd "$WURZEL" || exit 1

# ------------------------------------------------------- Was die Umgebung kann
#
# `AGENTS.md`: „Diese Umgebung erreicht nur GitHub – erst nachsehen, ob das
# stimmt." Dieses Skript ist für den Rechner des Betreibers geschrieben, wo
# alles erreichbar ist. Läuft es woanders, sagt es das, statt an einer
# Zeitüberschreitung zu scheitern und die Quelle zu beschuldigen.

hat_befehl() { command -v "$1" > /dev/null 2>&1; }

erreichbar() {
  hat_befehl curl || return 1
  curl -sS --max-time 12 -o /dev/null "$1" 2>/dev/null
}

GH_DA=nein
GH_ANGEMELDET=nein
if hat_befehl gh; then
  GH_DA=ja
  gh auth status > /dev/null 2>&1 && GH_ANGEMELDET=ja
fi

# ============================================================================
# Punkt 1 · Google Search Console
# ============================================================================
#
# Der Schlüssel ist **kein** Geheimnis: Er steht anschließend im Quelltext
# jeder Seite. Deshalb `lib/site.ts` und nicht `gh secret`.

SITE_DATEI='lib/site.ts'

search_console_stand() {
  local wert
  wert=$(sed -n "s/.*googleSiteVerification: '\([^']*\)'.*/\1/p" "$SITE_DATEI" | head -1)
  printf '%s' "$wert"
}

search_console_tun() {
  kopf 'Punkt 1 · Google Search Console'

  local jetzt
  jetzt=$(search_console_stand)
  if [ -n "$jetzt" ]; then
    gut "Ein Schlüssel ist eingetragen ($jetzt)."
    sagen 'Zum Ersetzen: erst in der Search Console einen neuen erzeugen.'
    bestaetigt 'Trotzdem einen anderen eintragen?' || return 0
  fi

  sagen 'Im Browser, mit einem Google-Konto (EINRICHTUNG.md, 4.1):'
  sagen ''
  sagen '  1. search.google.com/search-console öffnen'
  sagen '  2. Property hinzufügen → rechte Kachel URL-Präfix'
  sagen '  3. https://iminvests.de eintragen'
  sagen '  4. Bestätigungsart HTML-Tag wählen (nicht HTML-Datei)'
  sagen '  5. Die gezeigte Zeile kopieren – NICHT auf „Bestätigen" klicken'
  sagen ''
  sagen 'Die Zeile sieht so aus:'
  sagen '  <meta name="google-site-verification" content="xPtLm3…" />'
  sagen ''
  sagen 'Die ganze Zeile genügt, der Wert allein auch.'

  [ -t 0 ] || { warnen 'Keine Eingabe möglich – Punkt 1 übersprungen.'; return 0; }
  frage 'Einfügen (leer = überspringen):'
  local eingabe
  read -r eingabe || return 0
  [ -n "$eingabe" ] || { warnen 'Nichts eingegeben – Punkt 1 übersprungen.'; return 0; }

  # Der Vorbefund, bevor irgendetwas geändert wird.
  #
  # Dieselbe Frage wie im Nachrichtenlauf seit dem 10. September 2026: nicht
  # „ist irgendwo etwas rot?", sondern „hat meine Änderung etwas kaputt
  # gemacht?". Ein Test, der aus dem Bestand herausgealtert ist, soll den
  # Betreiber hier so wenig aufhalten wie dort die Tagesausgabe.
  local arbeit
  arbeit=$(mktemp -d)
  sagen ''
  sagen 'Vorbefund – die Prüfkette auf dem unberührten Stand. Das dauert.'
  bash scripts/pruefkette.sh "$arbeit/vorher" > "$arbeit/vorher.log" 2>&1
  sagen "  fertig (Protokoll: $arbeit/vorher.log)"

  # Eintragen, bauen, im gebauten HTML nachsehen – das tut `search-console.ts`
  # selbst. Hier wird es nicht nachgebaut: Die Form des Schlüssels prüft es,
  # und `tests/search-console.test.ts` prüft diese Prüfung. Eine zweite Stelle
  # mit denselben Regeln wäre die Doppelung, vor der `AGENTS.md` warnt.
  sagen ''
  sagen 'Eintragen und im gebauten HTML nachsehen …'
  if ! npm run search-console -- "$eingabe"; then
    rot 'Das Skript hat abgewiesen – oben steht, was mit der Eingabe nicht stimmt.'
    sagen 'Es wurde nichts geändert. Der Schlüssel gehört noch einmal kopiert.'
    return 1
  fi

  sagen ''
  sagen 'Nachbefund – dieselbe Kette mit dem Eintrag.'
  bash scripts/pruefkette.sh "$arbeit/nachher" > "$arbeit/nachher.log" 2>&1
  sagen "  fertig (Protokoll: $arbeit/nachher.log)"

  sagen ''
  if node --experimental-strip-types --import ./scripts/alias-hook.mjs \
       scripts/pruefvergleich.ts "$arbeit/vorher" "$arbeit/nachher"; then
    gut 'Der Eintrag hat nichts kaputt gemacht.'
  else
    rot 'Der Eintrag hat etwas kaputt gemacht – es wird nichts veröffentlicht.'
    sagen 'Oben steht, was erst mit ihm rot geworden ist.'
    sagen "Zurücknehmen mit: git checkout -- $SITE_DATEI"
    return 1
  fi

  search_console_veroeffentlichen
}

# Zweig, Commit, Pull Request, warten, mergen.
#
# `AGENTS.md`: „Selbst mergen, ohne zu fragen. Anordnung des Betreibers." Und:
# Wer einen Pull Request anlegt, beendet den Zug nicht, bevor er gemergt ist.
search_console_veroeffentlichen() {
  if [ "$GH_ANGEMELDET" != ja ]; then
    warnen 'Ohne angemeldetes gh geht das Veröffentlichen nicht von hier.'
    sagen "Eingetragen ist der Schlüssel. Es fehlt: $SITE_DATEI committen,"
    sagen 'Pull Request, grüne Prüfung, mergen.'
    return 0
  fi

  # Ein vorhandener Zweig wird nicht überschrieben – „Löschen und Überschreiben
  # von Bestand" ist die Grenze, an der `AGENTS.md` das Durchregieren beendet.
  local zweig='claude/search-console'
  if git show-ref --verify --quiet "refs/heads/$zweig"; then
    warnen "Der Zweig $zweig liegt schon vor."
    bestaetigt 'Auf den jetzigen Stand zurücksetzen?' || {
      sagen "Dann von Hand: git checkout $zweig"
      return 0
    }
  fi
  git checkout -q -B "$zweig" || return 1

  # **Nur diese eine Datei.** `out/` gehört nicht ins Repository, und was sonst
  # im Arbeitsordner liegt, gehört nicht in diesen Pull Request.
  git add "$SITE_DATEI"
  git commit -q -m "Search Console: Bestätigungsschlüssel eintragen

Google bestätigt den Besitz einer Property über ein <meta>-Element im
Quelltext. Der Wert steht in lib/site.ts und wird von app/layout.tsx in
den Kopf jeder Seite gesetzt.

Eingetragen mit scripts/einrichten.sh; npm run search-console hat gebaut
und im gebauten HTML nachgesehen, dass das Element wirklich dasteht.

Der Schlüssel ist kein Geheimnis – er steht anschließend im Quelltext
jeder Seite. Er beweist nur, dass jemand mit Zugriff auf die Website ihn
dort platziert hat.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>" || {
    warnen 'Nichts zu committen – steht der Schlüssel schon auf main?'
    return 0
  }

  git push -u origin "$zweig" || return 1

  gh pr create --base main --head "$zweig" \
    --title 'Search Console: Bestätigungsschlüssel eintragen' \
    --body 'Google bestätigt den Besitz einer Property über ein `<meta>`-Element
im Quelltext. Der Wert steht in `lib/site.ts` und wird von `app/layout.tsx` in
den Kopf jeder Seite gesetzt.

Eingetragen mit `npm run einrichten`. Das Skript hat

- den Wert aus der von Google gezeigten Zeile herausgelöst und seine Form
  geprüft (`scripts/search-console.ts`),
- gebaut und im gebauten HTML nachgesehen, dass das Element wirklich dasteht,
- die Prüfkette vor und nach dem Eintrag laufen lassen und verglichen – kein
  Befund ist erst mit dieser Änderung entstanden.

Der Schlüssel ist kein Geheimnis: Er steht anschließend im Quelltext jeder
Seite. Er beweist nur, dass jemand mit Zugriff auf die Website ihn dort
platziert hat – deshalb `lib/site.ts` und nicht die Secrets.

Sobald auf `main` „Paket bauen" und „Veröffentlichen" durch sind, kann in der
Search Console auf „Bestätigen" geklickt und `sitemap.xml` eingereicht werden.

🤖 Generated with [Claude Code](https://claude.com/claude-code)' || return 1

  sagen ''
  sagen 'Warten auf „Bauen und prüfen" …'
  if gh pr checks --watch --fail-fast; then
    gh pr merge --squash --delete-branch && gut 'Gemergt.'
  else
    rot 'Die Prüfung ist rot – es wird nicht gemergt.'
    return 1
  fi

  sagen ''
  sagen 'Jetzt läuft auf main „Paket bauen" und „Veröffentlichen". Sobald das'
  sagen 'durch ist (rund zehn Minuten), steht das Element auf iminvests.de.'
  sagen ''
  sagen 'Dann im Browser (EINRICHTUNG.md, 4.3):'
  sagen '  1. In der Search Console auf „Bestätigen" klicken'
  sagen '  2. Links auf Sitemaps → sitemap.xml eintragen → absenden'
}

# ============================================================================
# Punkt 2 · Spotify
# ============================================================================

SPOTIFY_SHOW='033YxQviNJXETJpW2ezG3y'

# Was an den beiden Zeichenketten **ohne** Spotify erkennbar ist.
#
# Wenig, mit Absicht: Ob ein Schlüssel gilt, weiß nur Spotify, und gefragt wird
# gleich darauf. Hier steht nur, was gar nicht erst hinausgeschickt werden
# muss – darunter der in EINRICHTUNG.md 5.4 vorhergesagte Fehler, ID und
# Secret zu verwechseln und damit zweimal dasselbe einzufügen.
spotify_form() {
  local id="$1" gehei="$2"
  [ -n "$id" ]    || { printf 'Die Client ID ist leer.';  return 1; }
  [ -n "$gehei" ] || { printf 'Das Client secret ist leer.'; return 1; }
  case "$id$gehei" in
    *[[:space:]]*) printf 'Da ist ein Leerzeichen mitkopiert worden.'; return 1 ;;
  esac
  if [ "$id" = "$gehei" ]; then
    printf 'ID und Secret sind identisch – das Secret liegt hinter „View client secret".'
    return 1
  fi
  return 0
}

# Was Spotifys Antwort bedeutet – ohne Netz, damit es prüfbar ist.
#
# Getrennt vom Abruf aus demselben Grund wie `lib/tageswecker.ts` und
# `lib/pruefvergleich.ts` vom Rest getrennt sind: Die Tatsachen holt der eine
# Teil, die Entscheidung fällt der andere, und nur der zweite lässt sich einem
# Selbsttest vorlegen. Von hier aus ist `accounts.spotify.com` ohnehin nicht
# erreichbar – eine Deutung, die man nur im Ernstfall sieht, ist keine.
#
# Der Antworttext wird **nie** ausgegeben. Bei einem Fehlschlag kann darin
# stehen, was gesendet wurde.
spotify_deuten() {
  case "$1" in
    *access_token*) return 0 ;;
    *invalid_client*)
      printf 'Spotify lehnt die Anmeldung ab (invalid_client) – eine der beiden Zeichenketten stimmt nicht.'
      return 1 ;;
    *unsupported_grant_type*)
      printf 'Spotify nimmt die Anmeldeart nicht an – das ist ein Fehler im Skript, nicht in den Zugangsdaten.'
      return 1 ;;
    *)
      printf 'Unerwartete Antwort von Spotify – weder ein Token noch eine bekannte Absage.'
      return 1 ;;
  esac
}

# Die eigentliche Prüfung: Spotify fragen.
#
# Die Zugangsdaten gehen im **Rumpf** der Anfrage über die Standardeingabe,
# nicht als Argument. `curl -u id:secret` stünde in der Prozessliste und wäre
# auf einem gemeinsam genutzten Rechner für jeden lesbar.
spotify_anmelden() {
  local id="$1" gehei="$2" antwort rueckgabe
  antwort=$(printf 'grant_type=client_credentials&client_id=%s&client_secret=%s' "$id" "$gehei" |
    curl -sS --max-time 20 -X POST 'https://accounts.spotify.com/api/token' \
      -H 'Content-Type: application/x-www-form-urlencoded' --data-binary @- 2>/dev/null)
  rueckgabe=$?

  # Ein Fehlschlag von curl ist etwas anderes als eine Absage von Spotify.
  # „Von hier nicht erreichbar" ist eine Aussage über die Umgebung, nicht über
  # die Zugangsdaten – wer das verwechselt, wirft einen richtigen Schlüssel weg.
  if [ "$rueckgabe" -ne 0 ]; then
    printf 'accounts.spotify.com war nicht erreichbar (curl %s) – das sagt nichts über die Zugangsdaten.' "$rueckgabe"
    return 1
  fi

  spotify_deuten "$antwort"
}

secret_vorhanden() {
  [ "$GH_ANGEMELDET" = ja ] || return 1
  gh secret list 2>/dev/null | grep -q "^$1[[:space:]]"
}

spotify_tun() {
  kopf 'Punkt 2 · Spotify – die Adressen der einzelnen Folgen'

  if [ "$GH_ANGEMELDET" != ja ]; then
    rot 'Dafür braucht es ein angemeldetes gh (gh auth login).'
    return 1
  fi

  local vorhanden=nein
  if secret_vorhanden SPOTIFY_CLIENT_ID && secret_vorhanden SPOTIFY_CLIENT_SECRET; then
    vorhanden=ja
    gut 'Beide Secrets liegen bereits vor.'
    # Überschreiben ist unumkehrbar: Ein Secret lässt sich nach dem Speichern
    # nicht mehr lesen. Also gefragt – `AGENTS.md`, „Arbeitsweise".
    bestaetigt 'Durch neue ersetzen?' || { spotify_variable; return 0; }
  fi

  sagen 'Im Browser, mit dem gewöhnlichen Spotify-Konto (EINRICHTUNG.md, 5.1):'
  sagen ''
  sagen '  1. developer.spotify.com/dashboard öffnen, anmelden'
  sagen '  2. Create app'
  sagen '  3. Name und Beschreibung frei, etwa „IM Invests Folgenadressen"'
  sagen '  4. Redirect URI: https://iminvests.de/  (wird nie benutzt,'
  sagen '     muss aber ausgefüllt sein)'
  sagen '  5. Bei „Which API/SDKs…": Web API genügt'
  sagen '  6. Speichern → Settings. Dort steht die Client ID, und hinter'
  sagen '     „View client secret" das Client secret.'
  sagen ''
  sagen 'Das Konto muss nicht das sein, dem die Sendung gehört – gelesen'
  sagen 'werden nur öffentliche Angaben.'

  [ -t 0 ] || { warnen 'Keine Eingabe möglich – Punkt 2 übersprungen.'; return 0; }

  local id gehei
  frage 'Client ID (leer = überspringen):'
  read -r id || return 0
  [ -n "$id" ] || { warnen 'Nichts eingegeben – Punkt 2 übersprungen.'; return 0; }

  # Ohne Anzeige. Der Wert wird auch danach nirgends wiederholt.
  frage 'Client secret (wird nicht angezeigt):'
  read -rs gehei || return 0
  printf '\n'

  local beanstandung
  if ! beanstandung=$(spotify_form "$id" "$gehei"); then
    rot "$beanstandung"
    unset gehei
    return 1
  fi

  sagen ''
  sagen 'Spotify fragen, ob die beiden gelten …'
  if ! beanstandung=$(spotify_anmelden "$id" "$gehei"); then
    rot "$beanstandung"
    sagen 'Es wurde nichts hinterlegt. So sieht auch der 1. September 2026 aus,'
    sagen 'wenn man es erst nachts im Protokoll merkt (EINRICHTUNG.md, 5.0).'
    unset gehei
    return 1
  fi
  gut 'Spotify nimmt die Anmeldung an.'

  printf '%s' "$id"    | gh secret set SPOTIFY_CLIENT_ID     || { unset gehei; return 1; }
  printf '%s' "$gehei" | gh secret set SPOTIFY_CLIENT_SECRET || { unset gehei; return 1; }
  unset gehei
  gut 'Beide als Secrets hinterlegt.'

  spotify_variable
  spotify_gegenprobe
}

# Die Kennung der Sendung ist öffentlich und gehört deshalb zu den Variables.
# Ohne sie sucht das Skript die Sendung über ihren Namen – das geht, ist aber
# die schwächere Zuordnung: Ein Name kann doppelt vorkommen, eine Kennung nicht.
spotify_variable() {
  if gh variable list 2>/dev/null | grep -q '^SPOTIFY_SHOW_ID[[:space:]]'; then
    gut 'SPOTIFY_SHOW_ID ist gesetzt.'
    return 0
  fi
  gh variable set SPOTIFY_SHOW_ID --body "$SPOTIFY_SHOW" &&
    gut "SPOTIFY_SHOW_ID gesetzt ($SPOTIFY_SHOW)."
}

# Die Gegenprobe nach 5.3 – und sie ist keine Formsache.
#
# **Findet das Skript null Folgen, obwohl es sich anmelden konnte, ist das ein
# Befund und kein Fehler:** Dann kennt Spotify die Sendung unter dieser Kennung
# nicht. Diese Antwort war bis zum 10. September 2026 nicht zu bekommen, und
# genau sie war am 1. September die Frage.
spotify_gegenprobe() {
  sagen ''
  bestaetigt 'Jetzt nachsehen, was Spotify von der Sendung kennt?' || return 0

  gh workflow run podcast-schaufenster.yml --ref main || return 1
  sagen 'Angestoßen. Der Lauf braucht ein bis zwei Minuten.'
  sagen ''
  sagen 'Danach im Protokoll nach den Zeilen mit [spotify] sehen:'
  sagen '  gh run list --workflow podcast-schaufenster.yml --limit 1'
  sagen '  gh run view <ID> --log | grep spotify'
  sagen ''
  sagen 'Dort muss eine Zahl gefundener Folgen stehen, nicht mehr'
  sagen '„Keine Zugangsdaten hinterlegt".'
}

# ============================================================================
# Punkt 3 · Die offene Frage zum Gesetzestext
# ============================================================================
#
# `lib/kapitalertragsteuer.ts` trägt seit dem 6. September 2026 eine Frage, die
# sich nur am Gesetzestext entscheiden lässt: Zählt eine Ausschüttung in den
# Deckel des Basisertrags? Lesart A (so rechnet der Code) sagt nein, Lesart B
# ja, und für einen ausschüttenden Fonds trennen sich die beiden messbar.
#
# Aus der Sitzungsumgebung ist `gesetze-im-internet.de` nicht erreichbar. Vom
# Rechner des Betreibers aus war es das am 5. September sehr wohl – deshalb
# holt dieses Skript den Text und legt ihn hin. **Entschieden wird von einem
# Menschen, der ihn gelesen hat**; eine Formel wird nicht auf eine Erinnerung
# hin geändert.
gesetz_tun() {
  kopf 'Punkt 3 · § 18 InvStG – zählt die Ausschüttung in den Deckel?'

  local adresse='https://www.gesetze-im-internet.de/instg_2018/__18.html'
  local ziel="${TMPDIR:-/tmp}/invstg-18.html"

  if ! erreichbar "$adresse"; then
    warnen 'gesetze-im-internet.de ist von hier nicht erreichbar.'
    sagen "Von Hand: $adresse"
    return 0
  fi

  curl -sS --max-time 30 -o "$ziel" "$adresse" || return 1
  gut "Geholt nach $ziel"

  sagen ''
  sagen 'Absatz 1, Text ohne Markup:'
  sagen ''
  sed 's/<[^>]*>//g' "$ziel" |
    sed -n '/Vorabpauschale/,/Absatz 2\|(2)/p' |
    grep -v '^[[:space:]]*$' | head -25 | sed 's/^/     /'

  sagen ''
  sagen 'Die eine Frage: Steht dort, dass der Betrag, um den der Wert am Ende'
  sagen 'den am Anfang übersteigt, die Grenze bildet – oder dieser Betrag'
  sagen 'zuzüglich der Ausschüttungen des Jahres?'
  sagen ''
  sagen '  Lesart A (so rechnet der Code)  Deckel = Wertende − Wertbeginn'
  sagen '  Lesart B                        Deckel = Wertende − Wertbeginn + Ausschüttung'
  sagen ''
  sagen 'Die Antwort gehört in lib/kapitalertragsteuer.ts, mit Datum und'
  sagen 'Fundstelle. Ergibt sie Lesart B, ist die Formel zu ändern – dann'
  sagen 'weist der Rechner heute zu wenig Steuer aus.'
}

# ============================================================================
# Der Stand
# ============================================================================

stand_zeigen() {
  kopf 'Was offen ist'

  local schluessel
  schluessel=$(search_console_stand)
  if [ -n "$schluessel" ]; then
    gut "Search Console: eingetragen ($schluessel)"
  else
    warnen 'Search Console: kein Schlüssel – Punkt 1'
  fi

  if [ "$GH_ANGEMELDET" != ja ]; then
    warnen 'Spotify: nicht feststellbar (kein angemeldetes gh)'
  elif secret_vorhanden SPOTIFY_CLIENT_ID && secret_vorhanden SPOTIFY_CLIENT_SECRET; then
    gut 'Spotify: beide Secrets liegen vor'
  else
    warnen 'Spotify: Zugangsdaten fehlen – Punkt 2'
  fi

  # Der Bestand sagt, ob je etwas angekommen ist. Ein Secret zu setzen ist die
  # Absicht; ein `abgerufenAm` ist das Ergebnis.
  local abgerufen
  abgerufen=$(sed -n 's/.*"abgerufenAm":[[:space:]]*"\([^"]*\)".*/\1/p' data/podcast-spotify.json)
  if [ -n "$abgerufen" ]; then
    gut "Spotify: zuletzt abgefragt am $abgerufen"
  else
    warnen 'Spotify: data/podcast-spotify.json ist leer – es wurde noch nie etwas abgefragt'
  fi

  if grep -q 'Offen seit dem 6. September 2026' lib/kapitalertragsteuer.ts; then
    warnen 'Gesetzestext: § 18 InvStG ist noch offen – Punkt 3'
  else
    gut 'Gesetzestext: die Frage zu § 18 InvStG ist beantwortet'
  fi

  sagen ''
  sagen 'Alles erledigen:  bash scripts/einrichten.sh'
  sagen 'Einzeln:          bash scripts/einrichten.sh --nur spotify'
}

# ============================================================================
# Der Selbsttest
# ============================================================================
#
# `AGENTS.md`: „Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe. Wer
# eine baut, legt ihr etwas vor, das sie beanstanden **muss**."
#
# Geprüft wird, was dieses Skript selbst entscheidet. Die Form des
# Search-Console-Schlüssels prüft `scripts/search-console.ts`, und dafür gibt
# es `tests/search-console.test.ts` – hier wird nur nachgesehen, dass eine
# abgewiesene Eingabe wirklich nichts anfasst.

selbsttest() {
  kopf 'Selbsttest'
  local fehl=0
  pruef() {
    if [ "$2" = ja ]; then printf '%s OK   %s%s\n' "$F_GUT" "$1" "$F_AUS"
    else fehl=$((fehl + 1)); printf '%s FEHL %s%s\n' "$F_ROT" "$1" "$F_AUS"; fi
  }
  # „Muss abweisen": bestanden ist die Prüfung, wenn spotify_form **scheitert**.
  weist_ab() {
    local was="$1"; shift
    if spotify_form "$@" > /dev/null; then pruef "$was" nein; else pruef "$was" ja; fi
  }

  # --- Die Formprüfung muss beanstanden, was sie beanstanden soll
  weist_ab 'leere ID wird abgewiesen'                    ''       'abc'
  weist_ab 'leeres Secret wird abgewiesen'               'abc'    ''
  weist_ab 'mitkopiertes Leerzeichen wird abgewiesen'    'a b'    'c'
  weist_ab 'ID gleich Secret wird abgewiesen'            'gleich' 'gleich'

  # Und sie muss durchlassen, was in Ordnung ist – sonst wäre sie nur streng.
  if spotify_form '4f2a9c1e7b3d5086af4e2c9b7d1a3f56' 'b7d1a3f564f2a9c1e7b3d5086af4e2c9' > /dev/null
  then pruef 'ein gültiges Paar kommt durch' ja
  else pruef 'ein gültiges Paar kommt durch' nein; fi

  # --- Die Beanstandung muss auch sagen, was los ist
  local text
  text=$(spotify_form 'x' 'x' 2>&1)
  case "$text" in *'View client secret'*) pruef 'die Meldung nennt die Stelle, an der das Secret steht' ja ;;
    *) pruef 'die Meldung nennt die Stelle, an der das Secret steht' nein ;; esac

  # --- Spotifys Antworten, wortgleich wie sie kommen
  if spotify_deuten '{"access_token":"BQD-x","token_type":"Bearer","expires_in":3600}' > /dev/null
  then pruef 'ein Token gilt als Anmeldung' ja
  else pruef 'ein Token gilt als Anmeldung' nein; fi

  if spotify_deuten '{"error":"invalid_client","error_description":"Invalid client"}' > /dev/null
  then pruef 'invalid_client wird abgewiesen' nein
  else pruef 'invalid_client wird abgewiesen' ja; fi

  # Der Fall, der am 1. September 2026 gefehlt hat: keine der beiden bekannten
  # Antworten. Er darf nicht als Erfolg durchgehen.
  if spotify_deuten '<html>502 Bad Gateway</html>' > /dev/null
  then pruef 'eine unbekannte Antwort gilt nicht als Anmeldung' nein
  else pruef 'eine unbekannte Antwort gilt nicht als Anmeldung' ja; fi

  # Und die Meldung darf den Antworttext nicht wiederholen – darin kann
  # stehen, was gesendet wurde.
  text=$(spotify_deuten 'client_secret=streng-geheim-12345' 2>&1)
  case "$text" in *streng-geheim*) pruef 'die Meldung gibt den Antworttext nicht weiter' nein ;;
    *) pruef 'die Meldung gibt den Antworttext nicht weiter' ja ;; esac

  # --- Der Stand muss den Bestand lesen, nicht raten
  local vorher
  vorher=$(search_console_stand)
  if [ -z "$vorher" ]; then pruef 'lib/site.ts wird gelesen: kein Schlüssel eingetragen' ja
  else pruef "lib/site.ts wird gelesen: $vorher" ja; fi

  # --- Eine abgewiesene Eingabe darf lib/site.ts nicht anfassen
  local summe_vorher summe_nachher
  summe_vorher=$(cksum "$SITE_DATEI")
  npm run search-console -- 'zu-kurz' > /dev/null 2>&1
  summe_nachher=$(cksum "$SITE_DATEI")
  if [ "$summe_vorher" = "$summe_nachher" ]
  then pruef 'ein abgewiesener Schlüssel lässt lib/site.ts unberührt' ja
  else pruef 'ein abgewiesener Schlüssel lässt lib/site.ts unberührt' nein; fi

  # --- Und die Werkzeuge, ohne die nichts geht
  if hat_befehl curl; then pruef 'curl ist da' ja; else pruef 'curl ist da' nein; fi
  if hat_befehl node; then pruef 'node ist da' ja; else pruef 'node ist da' nein; fi
  if [ -f scripts/pruefkette.sh ]
  then pruef 'scripts/pruefkette.sh liegt vor' ja
  else pruef 'scripts/pruefkette.sh liegt vor' nein; fi

  printf '\n'
  if [ "$fehl" -eq 0 ]; then gut 'Selbsttest bestanden.'; return 0; fi
  rot "$fehl Prüfung(en) fehlgeschlagen."
  return 1
}

# ============================================================================
# Ablauf
# ============================================================================

case "$MODUS" in
  stand)      stand_zeigen; exit 0 ;;
  selbsttest) selbsttest; exit $? ;;
esac

kopf 'Einrichtung'
sagen 'Was ein Mensch beisteuert, sind zwei Zeichenketten aus einem Browser,'
sagen 'in dem er angemeldet ist. Alles andere macht dieses Skript.'
sagen ''
[ "$GH_DA" = ja ] || warnen 'gh ist nicht installiert – Punkt 2 entfällt.'
[ "$GH_DA" != ja ] || [ "$GH_ANGEMELDET" = ja ] || warnen 'gh ist nicht angemeldet (gh auth login).'

stand_zeigen

case "$NUR" in
  '')             search_console_tun; spotify_tun; gesetz_tun ;;
  search-console) search_console_tun ;;
  spotify)        spotify_tun ;;
  gesetz|invstg)  gesetz_tun ;;
  *) rot "Unbekannter Punkt: $NUR (search-console, spotify, gesetz)"; exit 2 ;;
esac

kopf 'Stand danach'
stand_zeigen
