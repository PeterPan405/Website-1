#!/usr/bin/env bash
#
# Die Prüfkette des Nachrichtenlaufs – jede Prüfung einzeln, keine bricht ab.
#
# ## Warum nicht einfach `tsc && lint && test && build && pruefen`?
#
# Weil diese Kette beim ersten Fehlschlag aufhört und nur eine Frage
# beantwortet: *Ist irgendwo etwas rot?* Der Nachrichtenlauf braucht seit dem
# 10. September 2026 eine andere Antwort: *Was genau ist rot – und war es das
# schon, bevor die Ausgabe geschrieben wurde?*
#
# Deshalb läuft hier **jede** Prüfung, auch wenn die vorige gescheitert ist,
# und jede hinterlässt zwei Dateien im Zielverzeichnis:
#
#     <name>.status    0 oder 1
#     <name>.log       die vollständige Ausgabe
#
# und, wo die Prüfung Einzelbefunde benennt, eine dritte:
#
#     test.befunde     die gescheiterten Testdateien, eine je Zeile
#     pruefen.befunde  die Beanstandungen der Paketprüfung, eine je Zeile
#
# `scripts/pruefvergleich.ts` liest zwei solche Verzeichnisse – eines von vor
# dem Schreiben, eines von danach – und fällt das Urteil. Die Entscheidung
# steht in `lib/pruefvergleich.ts`; hier werden nur Tatsachen gesammelt.
#
# ## Aufruf
#
#     bash scripts/pruefkette.sh <Zielverzeichnis>
#
# Der Rückgabewert ist immer 0. Ob etwas rot ist, steht in den Dateien –
# wer das Skript in `set -e` einbettet, soll nicht durch einen Vorbefund
# abgebrochen werden, den er gerade erst einsammeln wollte.
#
# ## Was gesammelt wird
#
# Dieselben sechs Prüfungen wie im Paketbau, in derselben Reihenfolge, und
# vorher `prettier --write data/`, weil die Ausgabendateien vom Modell kommen
# und erst hier ihre endgültige Form bekommen.

set -u

dir="${1:?Zielverzeichnis fehlt}"
mkdir -p "$dir"

# Eine Prüfung ausführen und festhalten. Bricht nie ab.
lauf() {
  local name="$1"
  shift
  echo "::group::Prüfung: $name"
  "$@" > "$dir/$name.log" 2>&1
  local status=$?
  cat "$dir/$name.log"
  if [ "$status" -eq 0 ]; then
    echo 0 > "$dir/$name.status"
    echo "→ $name: grün"
  else
    echo 1 > "$dir/$name.status"
    echo "→ $name: ROT (Rückgabewert $status)"
  fi
  echo "::endgroup::"
}

npx prettier --write data/ > /dev/null 2>&1 || true

lauf tsc     npx tsc --noEmit
lauf lint    npm run lint
lauf test    npm test
lauf build   npm run build
lauf pruefen npm run pruefen
lauf format  npm run format:check

# ---------------------------------------------------------------------------
# Einzelbefunde herauslösen – nur dort, wo die Prüfung welche benennt.
#
# `npm test` schreibt nach dem Durchlauf eine Liste:
#
#     Gescheitert:
#       tests/quartalstermine.test.ts
#
# Genommen wird nur, was **nach** dieser Zeile steht – ein Test, der in
# seiner eigenen Ausgabe einen Dateinamen nennt, ist kein Befund.
awk '
  /^Gescheitert:/ { f = 1; next }
  f && /^[[:space:]]+tests\/[^[:space:]]+\.test\.ts[[:space:]]*$/ {
    sub(/^[[:space:]]+/, ""); sub(/[[:space:]]+$/, ""); print
  }
' "$dir/test.log" | sort -u > "$dir/test.befunde"

# `npm run pruefen` schreibt jede Beanstandung als eigene Zeile:
#
#       – /news/…/: keine <h1>
#
# Der Gedankenstrich ist das Kennzeichen; die Warnzeilen (`::warning::`) und
# die Zeile „… und N weitere" tragen ihn nicht.
sed -n 's/^[[:space:]]*– //p' "$dir/pruefen.log" | sort -u > "$dir/pruefen.befunde"

echo ""
echo "Prüfkette abgeschlossen – Ergebnis unter $dir:"
for name in tsc lint test build pruefen format; do
  printf '  %-8s %s\n' "$name" "$([ "$(cat "$dir/$name.status")" = 0 ] && echo grün || echo ROT)"
done
[ -s "$dir/test.befunde" ]    && echo "  gescheiterte Tests: $(wc -l < "$dir/test.befunde")"
[ -s "$dir/pruefen.befunde" ] && echo "  Beanstandungen der Paketprüfung: $(wc -l < "$dir/pruefen.befunde")"

exit 0
