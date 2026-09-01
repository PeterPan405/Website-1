"""
Sucht in fertigen Aufnahmen nach Stellen, die nicht wie Sprache klingen.

## Warum es das gibt

Die Prüfung beim Sprechen (`sprechstimme.brauchbar`) war bis zum 10. August
2026 blind für eine Störung mitten in einem Stück – sie mittelte über das
ganze Stück und verdünnte dabei genau das, was sie finden sollte. Behoben ist
das; die bereits gesprochenen Aufnahmen sind aber unter der alten Prüfung
entstanden.

Zwölf Lernseiten lagen zu diesem Zeitpunkt auf dem Server, zusammen rund eine
Stunde Ton. Sie alle anzuhören ist eine Stunde Arbeit, die niemand hat, und
ein zweites Mal Sprechen kostet vier Läuferstunden für ein Ergebnis, das
vielleicht in Ordnung war.

Also derselbe Maßstab nachträglich: Dieses Skript lädt die Aufnahmen, wandelt
sie in Rohdaten und meldet je Datei, an welcher **Sekunde** etwas verdächtig
aussieht. Wer die Liste hat, hört gezielt an dieser einen Stelle nach und
spricht nur das neu, was es braucht.

## Was es nicht kann

Es hört nicht. Es misst Lautstärke, Nulldurchgänge und Werte am Anschlag –
dieselben drei Anzeichen wie beim Sprechen, mit denselben Grenzen. Eine
Aufnahme ohne Fund ist nicht bewiesen sauber; eine mit Fund ist nicht bewiesen
kaputt. Was hier steht, ist ein **Hinweis, wo man hinhören sollte.**

## Aufruf

    python scripts/aufnahmen-nachpruefen.py https://iminvests.de/lese-audio/…m4a
    python scripts/aufnahmen-nachpruefen.py --verzeichnis https://iminvests.de

Mit `--verzeichnis` liest es `data/lese-audio.json` und prüft alles, was
darin steht. Braucht `ffmpeg` im Pfad.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import netz  # noqa: E402
import sprechstimme  # noqa: E402

VERZEICHNIS = "data/lese-audio.json"
ORDNER = "lese-audio"


def als_rohdaten(pfad: str):
    """Wandelt eine Tondatei in ein Feld aus Fließkommazahlen.

    Über ffmpeg statt über eine Bibliothek: Es ist ohnehin da (der
    Vertonungslauf braucht es zum Umwandeln in AAC), es liest alles, und der
    Umweg über ein Rohformat spart jede Abhängigkeit.
    """
    import numpy as np

    ergebnis = subprocess.run(
        # fmt: off
        [
            "ffmpeg", "-v", "error", "-i", pfad,
            "-f", "f32le", "-acodec", "pcm_f32le", "-ac", "1", "-ar", "24000", "-",
        ],
        # fmt: on
        capture_output=True,
        check=True,
    )
    return np.frombuffer(ergebnis.stdout, dtype=np.float32), 24000


def hole(url: str, ziel: str) -> bool:
    # `netz.oeffnen` statt `urlopen`: Auf einem Läufer ohne IPv6 scheitert
    # der erste Anlauf an jeder Adresse mit AAAA – und `iminvests.de` hat
    # eine. Die Meldung „nicht erreichbar" stand dann unter **jeder**
    # Aufnahme, ohne dass je eine gefehlt hätte. Begründung in scripts/netz.py.
    try:
        with netz.oeffnen(url, timeout=60) as antwort, open(ziel, "wb") as datei:
            datei.write(antwort.read())
        return True
    except Exception as fehler:  # noqa: BLE001
        print(f"  nicht erreichbar: {fehler}")
        return False


def als_uhrzeit(sekunden: float) -> str:
    return f"{int(sekunden) // 60}:{int(sekunden) % 60:02d}"


def pruefe(pfad: str, name: str) -> int:
    """Meldet die auffälligen Stellen einer Datei. Gibt ihre Anzahl zurück."""
    ton, rate = als_rohdaten(pfad)
    funde = sprechstimme.auffaellige_stellen(ton, rate)
    dauer = len(ton) / rate

    if not funde:
        print(f"  {name}: {als_uhrzeit(dauer)} lang, nichts Auffälliges.")
        return 0

    print(f"  {name}: {als_uhrzeit(dauer)} lang, {len(funde)} auffällige Stelle(n):")
    for von, bis, grund in funde:
        print(f"    {als_uhrzeit(von)}–{als_uhrzeit(bis)}  {grund}")
    return len(funde)


def main() -> int:
    argumente = sys.argv[1:]
    if not argumente:
        print(__doc__)
        return 1

    gesamt = 0
    betroffen: list[str] = []

    with tempfile.TemporaryDirectory() as ordner:
        if argumente[0] == "--verzeichnis":
            basis = argumente[1].rstrip("/") if len(argumente) > 1 else ""
            with open(VERZEICHNIS, encoding="utf-8") as datei:
                verzeichnis = json.load(datei)
            eintraege = sorted(verzeichnis.get("aufnahmen", {}))
            print(f"{len(eintraege)} Aufnahmen laut {VERZEICHNIS}.\n")
            for schluessel in eintraege:
                url = f"{basis}/{ORDNER}/{schluessel}.m4a"
                ziel = os.path.join(ordner, "probe.m4a")
                print(f"{url}")
                if not hole(url, ziel):
                    continue
                anzahl = pruefe(ziel, schluessel)
                gesamt += anzahl
                if anzahl:
                    betroffen.append(schluessel)
        else:
            for url in argumente:
                ziel = os.path.join(ordner, "probe" + os.path.splitext(url)[1])
                print(f"{url}")
                if url.startswith("http"):
                    if not hole(url, ziel):
                        continue
                else:
                    ziel = url
                anzahl = pruefe(ziel, os.path.basename(url))
                gesamt += anzahl
                if anzahl:
                    betroffen.append(url)

    print()
    if betroffen:
        print(f"::warning::{len(betroffen)} Aufnahme(n) mit auffälligen Stellen:")
        for eintrag in betroffen:
            print(f"  {eintrag}")
        print()
        print("Diese Stellen anhören. Zum Neusprechen den Eintrag aus")
        print(f"{VERZEICHNIS} entfernen und 'Lernseiten vertonen' starten.")
    else:
        print("Keine Aufnahme mit auffälligen Stellen.")

    # Ein Fund ist kein roter Lauf: Er ist ein Hinweis, kein Beweis, und die
    # Entscheidung darüber trifft ein Ohr. Ein roter Lauf wäre hier eine
    # Behauptung, die dieses Skript nicht aufstellen kann.
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
