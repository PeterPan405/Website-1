#!/usr/bin/env bash
#
# Screenshot to Code – ein Entwurfswerkzeug neben dieser Website, nicht darin.
#
# ## Was es tut
#
# Es nimmt ein Bild – einen Screenshot, einen Entwurf aus Figma, eine
# Bildschirmaufnahme – und schreibt daraus Code für diese Oberfläche. Zur
# Auswahl stehen HTML mit Tailwind, HTML mit CSS, React, Vue, Bootstrap und
# Ionic. Der Ausgangspunkt ist `github.com/abi/screenshot-to-code`.
#
# ## Was es ausdrücklich nicht tut
#
# Es holt **keine Daten** und umgeht **keine Sperren**. Der Anlass, es
# einzubauen, war die Annahme, es könne Blockaden umgehen, wenn ein Programm
# Kurse oder Kennzahlen abruft. Das kann es nicht: Die 7.484 Zeichen seiner
# Anleitung enthalten die Wörter „scrape", „crawl", „bypass", „block", „bot",
# „captcha" und „anti" kein einziges Mal. Nachgelesen am 20. August 2026 in
# der Anleitung selbst, nicht aus dem Gedächtnis.
#
# Wer damit an fehlende Quartalszahlen kommen will, ist hier falsch. Wer eine
# gezeichnete Seite in Code verwandeln will, ist richtig.
#
# ## Warum es nicht Teil der Website ist
#
# Weil es eine eigene Anwendung ist: ein FastAPI-Dienst und eine React-
# Oberfläche, beide mit eigenen Abhängigkeiten. Auf `iminvests.de` hätte es
# nichts verloren – die Seiten dort werden ausgeliefert, nicht erzeugt.
#
# Deshalb wird hier **nichts einkopiert**. Das Skript holt die Anwendung nach
# `~/.werkzeuge/screenshot-to-code`, außerhalb dieses Repositorys, und startet
# sie dort. Dieses Repository bleibt sauber, und ein Update ist ein `git pull`
# im Werkzeugordner statt eines Commits hier.
#
# ## Was es kostet
#
# Jeder Durchlauf ist eine Anfrage an ein Modell mit einem Bild darin. Das ist
# kein Cent-Betrag wie beim Nachrichtenlauf: Bilder sind teuer in Tokens. Das
# Werkzeug läuft deshalb von Hand und niemals in einem Zeitplan.
#
# ## Aufruf
#
#     werkzeuge/screenshot-to-code.sh          # holen, einrichten, starten
#     werkzeuge/screenshot-to-code.sh --nur-holen
#
# Danach im Browser: http://localhost:5173
#
set -euo pipefail

ZIEL="${HOME}/.werkzeuge/screenshot-to-code"
HERKUNFT="https://github.com/abi/screenshot-to-code.git"

nur_holen=0
[ "${1:-}" = "--nur-holen" ] && nur_holen=1

# ------------------------------------------------------------------ Prüfungen
#
# Erst sagen, was fehlt, dann anfangen. Ein Skript, das auf halbem Weg
# abbricht, hinterlässt einen halben Zustand – und der ist schwerer zu
# beurteilen als gar keiner.
fehlt=()
command -v git >/dev/null || fehlt+=("git")
if [ "$nur_holen" -eq 0 ]; then
  command -v docker >/dev/null || fehlt+=("docker")
  docker compose version >/dev/null 2>&1 || fehlt+=("docker compose")
fi

if [ ${#fehlt[@]} -gt 0 ]; then
  echo "Es fehlt: ${fehlt[*]}" >&2
  echo "Ohne diese Programme kann das Werkzeug nicht laufen." >&2
  exit 1
fi

# Mindestens ein Modellschlüssel. Ohne einen davon startet die Anwendung zwar,
# kann aber nichts erzeugen – und das merkt man erst nach dem ersten Bild.
schluessel=()
for name in ANTHROPIC_API_KEY OPENAI_API_KEY GEMINI_API_KEY; do
  [ -n "${!name:-}" ] && schluessel+=("$name")
done

if [ ${#schluessel[@]} -eq 0 ]; then
  cat >&2 <<'HINWEIS'
Kein Modellschlüssel in der Umgebung gefunden.

Gebraucht wird mindestens einer von ANTHROPIC_API_KEY, OPENAI_API_KEY oder
GEMINI_API_KEY. Setzen, dann erneut starten:

    ANTHROPIC_API_KEY=... werkzeuge/screenshot-to-code.sh

Der Schlüssel wird in die Datei backend/.env der geholten Anwendung
geschrieben – außerhalb dieses Repositorys, damit er nirgends mitcommittet
werden kann.
HINWEIS
  exit 1
fi

# --------------------------------------------------------------------- Holen
mkdir -p "$(dirname "$ZIEL")"
if [ -d "$ZIEL/.git" ]; then
  echo "Vorhanden unter $ZIEL – hole den neuesten Stand."
  git -C "$ZIEL" pull --ff-only
else
  echo "Hole $HERKUNFT nach $ZIEL"
  git clone --depth 1 "$HERKUNFT" "$ZIEL"
fi

# ---------------------------------------------------------------- Einrichten
#
# Geschrieben wird die Datei jedes Mal neu, aber nur mit den Schlüsseln, die
# tatsächlich gesetzt sind. Eine Zeile `ANTHROPIC_API_KEY=` ohne Wert ist
# schlimmer als keine: Die Anwendung hält den Anbieter dann für eingerichtet.
umask 077
: > "$ZIEL/backend/.env"
for name in "${schluessel[@]}"; do
  printf '%s=%s\n' "$name" "${!name}" >> "$ZIEL/backend/.env"
done
[ -n "${REPLICATE_API_KEY:-}" ] &&
  printf 'REPLICATE_API_KEY=%s\n' "$REPLICATE_API_KEY" >> "$ZIEL/backend/.env"

echo "Eingerichtet mit: ${schluessel[*]}${REPLICATE_API_KEY:+ REPLICATE_API_KEY}"

if [ "$nur_holen" -eq 1 ]; then
  echo "Nur geholt. Zum Starten dasselbe Skript ohne --nur-holen."
  exit 0
fi

# ---------------------------------------------------------------- Starten
#
# Die Anwendung bringt ihre eigene Compose-Datei mit; die wird benutzt und
# nicht nachgebaut. Eine eigene Fassung liefe beim ersten Update auseinander.
cd "$ZIEL"
echo
echo "Oberfläche danach: http://localhost:5173"
echo "Beenden mit Strg+C."
echo
exec docker compose up --build
