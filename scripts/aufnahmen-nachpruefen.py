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


#: Womit sich dieses Skript beim Server meldet.
#:
#: ## Warum das nötig ist
#:
#: Am 19. September 2026 antwortete `podcast-audio/2026-09-19.mp3` auf einen
#: Abruf mit `urllib` durchgehend mit **404**, während derselbe Läufer wenige
#: Minuten zuvor dieselbe Adresse mit `curl` und Statuscode 200 geholt hatte.
#: Der Unterschied war die Kennung: `urllib` schickt „Python-urllib/3.12", und
#: der Hoster weist die pauschal ab.
#:
#: Das ist keine Schranke, die jemand gegen uns gesetzt hat – es ist unser
#: eigener Server, und die Regel richtet sich gegen Skripte im Allgemeinen.
#: Eine schlichte Kennung zu schicken ist erlaubt; was nicht erlaubt wäre,
#: sind Anmeldedaten oder Browser-Merkmale, die eine Sperre gezielt umgehen.
KENNUNG = "iminvests-tonpruefung/1.0 (+https://iminvests.de)"


def hole(url: str, ziel: str) -> bool:
    # `netz.oeffnen` statt `urlopen`: Auf einem Läufer ohne IPv6 scheitert
    # der erste Anlauf an jeder Adresse mit AAAA – und `iminvests.de` hat
    # eine. Die Meldung „nicht erreichbar" stand dann unter **jeder**
    # Aufnahme, ohne dass je eine gefehlt hätte. Begründung in scripts/netz.py.
    anfrage = urllib.request.Request(url, headers={"User-Agent": KENNUNG})
    try:
        with netz.oeffnen(anfrage, timeout=60) as antwort, open(ziel, "wb") as datei:
            datei.write(antwort.read())
        return True
    except Exception as fehler:  # noqa: BLE001
        print(f"  nicht erreichbar: {fehler}")
        return False


def als_uhrzeit(sekunden: float) -> str:
    return f"{int(sekunden) // 60}:{int(sekunden) % 60:02d}"


def zeige_stelle(ton, rate: int, sekunde: float, umfeld: float = 2.0) -> None:
    """Gibt die Messwerte rund um eine Sekunde aus – ohne Urteil.

    Für den Fall, dass ein Mensch eine Stelle meldet und die Prüfung dort
    nichts findet. Ohne diese Ausgabe bliebe nur Raten an Schwellen; mit ihr
    steht da, was gemessen wurde.
    """
    gemessen = sprechstimme.merkmale(ton, rate)
    if gemessen is None:
        print("    (zu kurz für eine Messung)")
        return

    zeit = gemessen["zeit"]
    von, bis = sekunde - umfeld, sekunde + umfeld
    auswahl = [i for i, t in enumerate(zeit) if von <= t <= bis]
    if not auswahl:
        print(f"    (bei {sekunde:.0f} s liegt kein Fenster – Aufnahme zu kurz?)")
        return

    print(
        f"    Messwerte {von:.1f}–{bis:.1f} s "
        f"(laut ab Effektivwert {gemessen['lautgrenze']:.4f}):"
    )
    print("      Sekunde  Effektiv  Nulldurchg.  Anschlag  Tonanteil  Tiefenanteil  laut")
    for i in auswahl:
        print(
            f"      {float(zeit[i]):7.2f}  {float(gemessen['effektiv'][i]):8.4f}  "
            f"{float(gemessen['rauheit'][i]):11.3f}  "
            f"{float(gemessen['anschlag'][i]):8.3f}  "
            f"{float(gemessen['tonanteil'][i]):9.3f}  "
            f"{float(gemessen['tiefenanteil'][i]):12.3f}  "
            f"{'ja' if gemessen['laut'][i] else 'nein'}"
        )

    verteilung(gemessen, sekunde)


def verteilung(gemessen, gemeldet: float | None = None) -> None:
    """Was Tiefenanteil und Nulldurchgänge in **dieser** Aufnahme sonst tun.

    ## Warum das neben den Einzelwerten stehen muss

    Eine Grenze, die nur an der gemeldeten Stelle gemessen wurde, ist geraten.
    Die Grundfrequenz einer männlichen Sprechstimme liegt zwischen 85 und
    180 Hz – also **unter** den 200 Hz, die hier als „tief" zählen. Gesprochene
    Vokale tragen dort zwangsläufig Energie, und eine Schwelle, die das nicht
    berücksichtigt, beanstandet die halbe Folge.

    Am 20. September 2026 nachgemessen, und deutlicher als erwartet: Über die
    1238 lauten Fenster der Folge vom 19. September liegt der Median des
    Tiefenanteils bei 0,52, das 90. Perzentil bei 0,86. **Der Tiefenanteil
    allein trennt nichts** – er ist bei dieser Stimme der Normalfall.

    Deshalb misst diese Ausgabe jetzt das Paar: tiefe Energie **und** wenig
    Nulldurchgänge. Sprache trägt ihre Verständlichkeit in den Formanten
    zwischen 300 und 3.500 Hz und erzeugt damit zwangsläufig Nulldurchgänge;
    ein Rumpeln hat keine. Zu jeder Kombination steht hier, wie viele Fenster
    und wie viele zusammenhängende Stellen ab `STOERUNG_MINDESTENS_S` sie in
    dieser Aufnahme fände – und ob die **gemeldete** Stelle darunter ist.

    Das ist die Gegenprobe zur Schwelle, bevor es sie gibt: Eine Absicherung,
    die nie anschlägt, sieht aus wie Ruhe; eine, die überall anschlägt, wird
    abgeschaltet.
    """
    import numpy as np

    laut = gemessen["laut"]
    anzahl = int(np.sum(laut))
    if anzahl == 0:
        print("    (kein lautes Fenster – keine Verteilung)")
        return

    stufen = [10, 25, 50, 75, 90, 95, 99]
    print(f"\n    Verteilung über alle {anzahl} lauten Fenster:")
    print("      Perzentil     " + "".join(f"{s:>8}" for s in stufen))
    for name, schluessel in (("Tiefenanteil", "tiefenanteil"), ("Nulldurchg.", "rauheit")):
        werte = gemessen[schluessel][laut]
        print(
            f"      {name:<13} "
            + "".join(f"{float(np.percentile(werte, s)):8.3f}" for s in stufen)
        )

    print("\n    Was ein Paar aus Grenzen in dieser Aufnahme fände:")
    print("      tief ab  Nulldurchg. bis  Fenster  Stellen ab 0,4 s  gemeldete dabei")
    for tief in (0.85, 0.90, 0.95):
        for ruhig in (0.015, 0.025, 0.040):
            treffer = (
                laut
                & (gemessen["tiefenanteil"] >= tief)
                & (gemessen["rauheit"] <= ruhig)
            )
            stellen = _laeufe(treffer, gemessen)
            dabei = (
                "–"
                if gemeldet is None
                else ("ja" if _trifft(stellen, gemeldet) else "nein")
            )
            print(
                f"      {tief:7.2f}  {ruhig:15.3f}  {int(np.sum(treffer)):7d}  "
                f"{len(stellen):16d}  {dabei:>15}"
            )


def _trifft(stellen, sekunde: float, spiel: float = 1.0) -> bool:
    """Liegt die gemeldete Sekunde in einer der gefundenen Stellen?"""
    return any(von - spiel <= sekunde <= bis + spiel for von, bis in stellen)


def _laeufe(flaggen, gemessen, luecke: int = 1) -> list[tuple[float, float]]:
    """Die zusammenhängenden Stellen von mindestens 0,4 s.

    `luecke` schliesst Einbrüche von bis zu so vielen Fenstern. Gemessen am
    19. September: Das Störgeräusch läuft von 175,50 bis 175,88 s, aber bei
    175,62 fällt der Tiefenanteil auf 0,019 – ein Fenster mitten darin, in dem
    das Geräusch kurz höher liegt. Ohne Schliessen zerfällt eine halbe Sekunde
    Poltern in zwei Stücke von je 0,375 s, und beide bleiben unter der Grenze.
    """
    import numpy as np

    vorschub = gemessen["vorschub"]
    fenster = gemessen["fenster"]
    rate = fenster / sprechstimme.FENSTER_S

    gesetzt = np.asarray(flaggen).astype(bool)
    if luecke > 0 and gesetzt.any():
        geschlossen = gesetzt.copy()
        (orte,) = np.nonzero(gesetzt)
        for a, b in zip(orte[:-1], orte[1:]):
            if 1 < b - a <= luecke + 1:
                geschlossen[a:b] = True
        gesetzt = geschlossen

    stellen: list[tuple[float, float]] = []
    beginn = None
    for i, flagge in enumerate([*gesetzt, False]):
        if flagge and beginn is None:
            beginn = i
        elif not flagge and beginn is not None:
            von = beginn * vorschub / rate
            bis = ((i - 1) * vorschub + fenster) / rate
            if bis - von >= sprechstimme.STOERUNG_MINDESTENS_S:
                stellen.append((von, bis))
            beginn = None
    return stellen


def pruefe(pfad: str, name: str, stelle: float | None = None) -> int:
    """Meldet die auffälligen Stellen einer Datei. Gibt ihre Anzahl zurück."""
    ton, rate = als_rohdaten(pfad)
    funde = sprechstimme.auffaellige_stellen(ton, rate)
    dauer = len(ton) / rate

    if stelle is not None:
        print(f"  {name}: Messwerte um {als_uhrzeit(stelle)}")
        zeige_stelle(ton, rate, stelle)

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

    #: Sekunde, deren Messwerte ausgegeben werden sollen – `--stelle 176`.
    stelle: float | None = None
    if "--stelle" in argumente:
        i = argumente.index("--stelle")
        stelle = float(argumente[i + 1])
        argumente = argumente[:i] + argumente[i + 2 :]

    gesamt = 0
    betroffen: list[str] = []
    #: Wie viele Aufnahmen wirklich gelesen werden konnten.
    #:
    #: Ohne diese Zahl meldete der Lauf am 19. September 2026 „Keine Aufnahme
    #: mit auffälligen Stellen" und wurde grün – obwohl er keine einzige Datei
    #: heruntergeladen hatte. Ein Lauf, der nichts prüfen konnte, hat nicht
    #: „nichts gefunden".
    gelesen = 0

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
                gelesen += 1
                anzahl = pruefe(ziel, schluessel, stelle)
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
                gelesen += 1
                anzahl = pruefe(ziel, os.path.basename(url), stelle)
                gesamt += anzahl
                if anzahl:
                    betroffen.append(url)

    print()
    if gelesen == 0:
        # Der stille Fehler vom 19. September 2026: Der Lauf holte nichts und
        # meldete „keine auffälligen Stellen" – grün, und ohne eine einzige
        # Sekunde Ton angesehen zu haben.
        print("::error::Keine einzige Aufnahme konnte gelesen werden.")
        print("  Geprüft wurde damit nichts. Das ist kein Ergebnis, sondern")
        print("  ein Ausfall – oben steht je Adresse, woran es lag.")
        return 1

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
