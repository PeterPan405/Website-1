"""
Spricht Lernstufen und Akademielektionen mit der eigenen Stimme.

## Was hier entsteht

Je Seite eine Datei:

    lese-audio/lernen/aktie/beginner.m4a      die Aufnahme
    lese-audio/lernen/aktie/beginner.json     Fingerabdruck, Dauer, Marken

Die Marken sind die Sekunde, in der jeder Abschnitt beginnt. Damit behält die
Vorleseleiste, was sie mit der Gerätestimme hatte – „Abschnitt 12 von 40" und
das Überspringen –, obwohl jetzt eine einzige Datei läuft. Sie kosten beim
Sprechen nichts: Die Zeit steht ohnehin da, sie wird nur mitgeschrieben.

## Warum nicht alles auf einmal

Dreizehneinhalb Stunden Sprache. Bei einem gemessenen Echtzeitfaktor um 0,08
sind das rund 170 Läuferstunden – nichts, was in einen Lauf passt, und nichts,
worauf jemand wartet.

Deshalb hat dieser Lauf ein **Budget** und eine **Reihenfolge**: Er nimmt sich
so viele Seiten, wie in die zugeteilte Zeit passen, und zwar von vorn. Die
Reihenfolge kommt aus `lese-texte-schreiben.ts` und ist dort begründet:
Beginner zuerst, dann die Akademie, dann Fortgeschritten, zuletzt Profi.

Was nicht drankam, ist nicht verloren – es steht beim nächsten Lauf wieder
vorn. Und eine Seite ohne Aufnahme ist kein Loch: Die Vorleseleiste nimmt dort
weiter die Stimme des Geräts.

## Warum AAC und nicht MP3

Der Podcast liefert MP3, weil ein Feed das verlangt. Hier zählt etwas anderes:
Es sind 172 Dateien, die auf einem Webspace liegen und über eine
Mobilfunkverbindung geladen werden. AAC bei 48 kbit/s mono klingt für eine
Sprechstimme so gut wie MP3 bei 96 und ist halb so groß – aus 13,5 Stunden
werden damit rund 280 statt 560 Megabyte. Abspielen kann es jeder Browser,
der dieses Jahrzehnt kennt; die Podcastfolgen liegen ohnehin schon als AAC im
Video.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import klangkette  # noqa: E402
import sprechstimme  # noqa: E402

AUFGABEN = "lese-texte/aufgaben.json"
VERZEICHNIS = "data/lese-audio.json"
ORDNER = "lese-audio"

REFERENZ = "assets/stimme-referenz.wav"
WORTLAUT = "assets/stimme-referenz.txt"
GROESSE = os.environ.get("STIMME_GROESSE", "0.6B")
REPO = f"Qwen/Qwen3-TTS-12Hz-{GROESSE}-Base"

#: Wie viele Minuten dieser Lauf sprechen darf, bevor er aufhört.
#:
#: Gemeint ist die **Rechenzeit**, nicht die Sprechdauer. Der Wert liegt
#: bewusst unter der Frist des Jobs: Was nach dem Budget noch kommt, ist das
#: Umwandeln, das Hochladen und das Verzeichnis – und ein Lauf, der in der
#: Frist stirbt, wirft alles Gesprochene weg.
BUDGET_MINUTEN = int(os.environ.get("BUDGET_MINUTEN", "240"))

#: Höchstens so viele Seiten je Läufer. `0` heißt: so viele wie ins Budget passen.
#:
#: Für die Probe. Ein Defekt, der jede Seite trifft, zeigt sich an der ersten –
#: aber nur, wenn der Lauf danach aufhört. Am 10. August 2026 hat er es nicht
#: getan: vier Stunden, 172 Warnungen, und die Ursache stand ganz oben im
#: Protokoll, wo sie niemand mehr zu fassen bekam.
HOECHSTENS = int(os.environ.get("HOECHSTENS", "0"))

TEIL = int(os.environ.get("TEIL", "0"))
TEILE = int(os.environ.get("TEILE", "0"))


def melde(text):
    print(f"[lesestimme] {text}", flush=True)


def vorhandenes_verzeichnis() -> dict:
    try:
        with open(VERZEICHNIS, encoding="utf-8") as datei:
            return json.load(datei).get("aufnahmen", {})
    except (OSError, ValueError):
        return {}


def zu_aac(quelle: str, ziel: str) -> int:
    """Wandelt die rohe Aufnahme in eine Datei fürs Netz.

    Dieselbe Klangbehandlung wie beim Podcast – Grummeln weg, Rauschen mild
    gedämpft, Lautheit auf −16 LUFS –, nur ein anderes Format am Ende. Die
    Werte kommen aus `klangkette`, damit eine Lektion nicht anders klingt als
    eine Folge.
    """
    gemessen = klangkette._messen(quelle, melde)
    if gemessen:
        lautheit, spitze = gemessen
        pegel = (
            f"volume={klangkette.ZIEL_LUFS - lautheit:.2f}dB,"
            f"alimiter=limit={klangkette.SPITZE}:attack=5:release=50:level=disabled"
        )
    else:
        pegel = klangkette.RUECKFALL

    os.makedirs(os.path.dirname(ziel), exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", quelle,
            "-af", f"{klangkette.FILTER},{pegel}",
            "-c:a", "aac", "-b:a", "48k", "-ac", "1", "-ar", "44100",
            "-movflags", "+faststart",
            ziel,
        ],
        check=True,
    )
    return os.path.getsize(ziel)


def seite_sprechen(sprecher, aufgabe: dict) -> dict:
    """Spricht eine Seite und gibt ihren Verzeichniseintrag zurück.

    Abschnitt für Abschnitt, damit die Marken entstehen. Innerhalb eines
    Abschnitts gilt dieselbe Zerlegung wie beim Podcast: kurze Stücke, Pausen
    nach Satzzeichen.
    """
    import numpy as np
    import soundfile as sf

    teile: list = []
    marken: list[float] = []
    rate = 0
    laenge = 0

    for abschnitt in aufgabe["abschnitte"]:
        marken.append(round(laenge / rate, 2) if rate else 0.0)
        for stueck, ruhe in sprechstimme.in_stuecke(abschnitt):
            wavs, rate = sprecher.sprich(stueck)
            ton = np.asarray(wavs[0])
            pause = np.zeros(int(rate * ruhe), dtype=ton.dtype)
            teile.append(ton)
            teile.append(pause)
            laenge += len(ton) + len(pause)

    audio = np.concatenate(teile)
    roh = f"{ORDNER}/{aufgabe['id']}.wav"
    ziel = f"{ORDNER}/{aufgabe['id']}.m4a"
    os.makedirs(os.path.dirname(roh), exist_ok=True)
    sf.write(roh, audio, rate)

    bytes_ = zu_aac(roh, ziel)
    os.remove(roh)
    dauer = len(audio) / rate

    return {
        "hash": aufgabe["hash"],
        "sekunden": round(dauer, 1),
        "bytes": bytes_,
        "marken": marken,
    }


def main() -> int:
    for pfad, was in ((REFERENZ, "Sprachprobe"), (WORTLAUT, "Wortlaut"), (AUFGABEN, "Arbeitsliste")):
        if not os.path.exists(pfad):
            melde(f"Keine {was} unter {pfad}.")
            return 1

    with open(AUFGABEN, encoding="utf-8") as datei:
        aufgaben = json.load(datei)

    bekannt = vorhandenes_verzeichnis()
    offen = [a for a in aufgaben if bekannt.get(a["id"], {}).get("hash") != a["hash"]]
    melde(f"{len(offen)} von {len(aufgaben)} Seiten haben keine gültige Aufnahme.")

    if TEILE > 0:
        if not 1 <= TEIL <= TEILE:
            melde(f"TEIL={TEIL} passt nicht zu TEILE={TEILE}.")
            return 1
        # Reihum statt blockweise: Die Seiten sind unterschiedlich lang, und
        # reihum verteilt sich die Rechenzeit gleichmäßiger.
        offen = [a for i, a in enumerate(offen) if i % TEILE == TEIL - 1]
        melde(f"Läufer {TEIL} von {TEILE}: {len(offen)} Seiten zur Auswahl.")

    if not offen:
        melde("Nichts zu sprechen – alle Aufnahmen sind auf dem Stand des Textes.")
        os.makedirs(ORDNER, exist_ok=True)
        with open(f"{ORDNER}/teil-{TEIL}.json", "w", encoding="utf-8") as datei:
            json.dump({}, datei)
        return 0

    sprecher = sprechstimme.Sprecher(REFERENZ, WORTLAUT, REPO, melde)

    ergebnis: dict[str, dict] = {}
    gescheitert: list[str] = []
    beginn = time.time()
    gesprochen = 0.0

    for nummer, aufgabe in enumerate(offen, start=1):
        verbraucht = (time.time() - beginn) / 60
        if verbraucht >= BUDGET_MINUTEN:
            melde(f"Budget von {BUDGET_MINUTEN} Minuten aufgebraucht – Rest bleibt liegen.")
            break
        if HOECHSTENS and nummer > HOECHSTENS:
            melde(f"Grenze von {HOECHSTENS} Seiten erreicht – Rest bleibt liegen.")
            break

        zeichen = sum(len(a) for a in aufgabe["abschnitte"])
        melde(f"{nummer}/{len(offen)} {aufgabe['pfad']} – {zeichen} Zeichen")
        try:
            eintrag = seite_sprechen(sprecher, aufgabe)
        except Exception as fehler:  # noqa: BLE001
            # **Eine Seite darf den Lauf nicht kosten.** Beim Podcast gilt das
            # Gegenteil – dort ist ein Loch in der Folge schlimmer als keine
            # Folge. Hier ist es umgekehrt: Die übrigen Aufnahmen sind fertig
            # und nützlich, und die gescheiterte Seite behält die Gerätestimme,
            # bis sie im nächsten Lauf wieder vorn steht.
            #
            # **Mit der ganzen Begründung, nicht nur der letzten Zeile.** Beim
            # ersten scharfen Lauf am 10. August 2026 scheiterte jede Seite,
            # und im Protokoll stand je eine Zeile ohne Herkunft – vier Stunden
            # Rechenzeit, aus denen sich nicht ablesen ließ, woran es lag.
            gescheitert.append(aufgabe["pfad"])
            melde(f"::warning::{aufgabe['pfad']} ließ sich nicht sprechen: {fehler!r}")
            for zeile in traceback.format_exc().strip().splitlines():
                melde(f"    {zeile}")
            continue

        ergebnis[aufgabe["id"]] = eintrag
        gesprochen += eintrag["sekunden"]
        melde(
            f"  {eintrag['sekunden'] / 60:.1f} min, {eintrag['bytes'] / 1024:.0f} KB, "
            f"{len(eintrag['marken'])} Marken"
        )

    rechenzeit = time.time() - beginn
    melde(
        f"{gesprochen / 60:.1f} Minuten Sprache aus {len(ergebnis)} Seiten "
        f"in {rechenzeit / 60:.1f} Minuten gerechnet."
    )

    os.makedirs(ORDNER, exist_ok=True)
    with open(f"{ORDNER}/teil-{TEIL}.json", "w", encoding="utf-8") as datei:
        json.dump(ergebnis, datei, ensure_ascii=False, indent=1)

    # **Wenn jede Seite scheitert, ist das kein Einzelfall, sondern ein Defekt.**
    #
    # Der Absatz oben – „eine Seite darf den Lauf nicht kosten" – stimmt und
    # war trotzdem der Fehler des ersten scharfen Laufs am 10. August 2026:
    # Elf Läufer sprachen vier Stunden lang, **jede** Seite scheiterte, jede
    # erzeugte eine Warnung, und alle elf endeten grün. Der Lauf meldete
    # Erfolg und hatte nichts erzeugt.
    #
    # Genau der stille Fehler, gegen den der Rest dieses Projekts gebaut ist –
    # nur diesmal selbst eingebaut. Nachsicht mit einer einzelnen Seite ist
    # richtig; Nachsicht mit allen ist Wegsehen.
    if not ergebnis and gescheitert:
        melde(f"::error::Keine einzige von {len(gescheitert)} Seiten ließ sich sprechen.")
        melde("  Das ist kein Ausreißer, sondern ein Defekt – die Begründungen stehen oben.")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
