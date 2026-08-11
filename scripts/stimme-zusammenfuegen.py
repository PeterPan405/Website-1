"""
Fügt die Stücke, die mehrere Läufer gesprochen haben, zur Folge zusammen.

## Warum das ein eigener Schritt ist

Ein Läufer allein schafft die Folge nicht. Am 8. August 2026 gemessen:
Echtzeitfaktor 0,13, daraus gerechnet 38 Minuten für fünf Minuten
Sprache. Der erste echte Lauf brauchte über 57 und lief in die Frist –
jedes Stück kostet eigenen Vorlauf, den eine Messung an einem einzigen
Stück nicht zeigt.

Also sprechen mehrere Läufer gleichzeitig, jeder ein paar Stücke. Dieser
Schritt sammelt ein, was sie geschrieben haben.

## Warum die Nummer im Dateinamen alles trägt

`stueck-000.wav`, `stueck-001.wav`, … – die Zahl ist die Stelle im
Ganzen, nicht die Reihenfolge innerhalb eines Läufers. Damit ist das
Zusammenfügen ein Sortieren nach Namen und sonst nichts. Es gibt keine
zweite Stelle, an der eine Reihenfolge steht und falsch sein könnte.

## Was geprüft wird

Dass **kein** Stück fehlt. Eine Folge mit einer Lücke in der Mitte wäre
der schlimmste Fall: Sie klingt vollständig, bricht aber mitten im Satz
ab, und niemand merkt es vor der Veröffentlichung. Deshalb bricht dieser
Lauf ab, wenn die Nummern nicht lückenlos von null durchlaufen.

Aufruf: python scripts/stimme-zusammenfuegen.py
"""

import glob
import os
import re
import sys

import numpy as np
import soundfile as sf

import klangkette
import sprechstimme

ORDNER = "podcast-folge"
ROHFASSUNG = f"{ORDNER}/folge.wav"
ZIEL = f"{ORDNER}/folge.mp3"


def melde(text):
    print(f"[zusammenfügen] {text}", flush=True)


dateien = sorted(glob.glob(f"{ORDNER}/stueck-*.wav"))
if not dateien:
    melde(f"Keine Stücke unter {ORDNER}/stueck-*.wav.")
    sys.exit(1)

nummern = [int(re.search(r"stueck-(\d+)\.wav$", d).group(1)) for d in dateien]
erwartet = list(range(len(dateien)))
if nummern != erwartet:
    fehlend = sorted(set(range(max(nummern) + 1)) - set(nummern))
    melde(f"Es fehlen Stücke: {fehlend}")
    melde("Eine Folge mit einer Lücke wäre schlimmer als keine.")
    sys.exit(1)

melde(f"{len(dateien)} Stücke, lückenlos von 0 bis {max(nummern)}.")

teile = []
rate = None
for datei in dateien:
    audio, rate = sf.read(datei)
    teile.append(audio)

gesamt = np.concatenate(teile)
dauer = len(gesamt) / rate
melde(f"{dauer / 60:.1f} Minuten.")

# Die letzte Gelegenheit, eine Störung zu bemerken, bevor sie ein Hörer
# bemerkt. Beim Sprechen wird jedes Stück für sich geprüft und im Zweifel neu
# gesprochen – das ist die bessere Abwehr, weil sie den Text rettet. Sie greift
# nur nicht immer: Am 11. August 2026 verwarf sie einen Anlauf und ließ
# trotzdem eine halbe Sekunde Rauschen bei 4:08 durch, die derselbe Maßstab an
# der fertigen Folge auf Anhieb fand.
#
# Hier steht deshalb dasselbe Verfahren noch einmal – an dem, was tatsächlich
# gesendet wird. Begründet ist es bei `sprechstimme.nachbessern`.
gesamt, gedaempft = sprechstimme.nachbessern(gesamt, rate, melde)
if gedaempft:
    melde(f"{gedaempft} Stelle(n) gedämpft. Der Text an diesen Stellen war ohnehin verloren.")

sf.write(ROHFASSUNG, gesamt, rate)

# Die Nachbearbeitung steht in `klangkette.py` und ist dort begründet.
#
# Sie gehört an **diese** Stelle und nicht an die einzelnen Stücke: Eine
# Normalisierung je Stück würde die Lautstärke innerhalb der Folge
# springen lassen.
groesse = klangkette.zu_mp3(ROHFASSUNG, ZIEL, melde)
os.remove(ROHFASSUNG)

# Dieselbe Untergrenze wie beim Weg über die Schnittstelle: Was bei fünf
# Minuten Text unter 100 KB bleibt, ist keine Aufnahme, sondern eine
# Fehlermeldung im Audioformat.
if groesse < 100_000:
    melde(f"FEHLER: {groesse} Bytes sind zu wenig für {dauer / 60:.1f} Minuten.")
    sys.exit(1)
