"""
Misst, ob die geklonte Stimme auf einem GitHub-Läufer schnell genug ist.

## Warum gemessen und nicht geschätzt wird

Voicebox ist ein lokales Sprachstudio: Es rechnet das Modell auf dem
eigenen Rechner, üblicherweise mit Grafikkarte. Ein GitHub-Läufer hat
zwei Prozessorkerne und keine Grafikkarte. Ob ein 0,6-Milliarden-Modell
darauf fünf Minuten Sprache in vertretbarer Zeit erzeugt, lässt sich
nicht ausrechnen – nur ausprobieren.

Der entscheidende Wert ist der **Echtzeitfaktor**: erzeugte Sekunden
Audio je Sekunde Rechenzeit. Über 1,0 heißt schneller als Echtzeit.
Bei 0,25 bräuchten fünf Minuten Folge zwanzig Minuten Rechnen – dann
lohnt der Weg nicht.

## Was dieses Skript nicht tut

Es startet nicht die Voicebox-Anwendung. Die ist ein Server mit
Oberfläche, Datenbank und Modellverwaltung; auf einem Läufer, der nach
zwanzig Minuten verschwindet, wäre das Ballast. Verwendet wird dasselbe
Modell, das Voicebox unter der Haube lädt – Qwen3-TTS-12Hz CustomVoice,
das laut Voicebox' eigener Konfiguration Deutsch spricht und Stimmen
zero-shot klont.

Aufruf:  python scripts/stimme-messen.py  [referenz.wav]  [modellgroesse]
"""

import os
import sys
import tempfile
import time
import wave

REFERENZ = sys.argv[1] if len(sys.argv) > 1 else "assets/stimme-referenz.wav"
GROESSE = sys.argv[2] if len(sys.argv) > 2 else "0.6B"
REPO = f"Qwen/Qwen3-TTS-12Hz-{GROESSE}-Base"

# Rund 30 Sekunden Sprache – lang genug für eine belastbare Messung,
# kurz genug, dass ein aussichtsloser Versuch nicht 20 Minuten kostet.
STANDARDPROBE = (
    "Guten Morgen und herzlich willkommen zum Marktupdate von IM Invests. "
    "Heute ist Montag, der zehnte August zweitausendsechsundzwanzig. "
    "Ein schwacher US-Jobbericht schickt den DAX auf Rekordkurs, Gold steigt "
    "den dritten Tag in Folge, und zwei Großbanken verpacken den KI-Boom in "
    "Anleihekörbe. Schwache Konjunkturdaten senken die erwarteten "
    "Notenbankzinsen, und niedrigere Zinsen erhöhen rechnerisch den heutigen "
    "Wert künftiger Unternehmensgewinne."
)

# Wer die Stimme **hören** will statt sie zu messen, gibt einen eigenen Text
# vor. Die Messung läuft dabei unverändert weiter – sie kostet nichts extra,
# und eine Zahl neben der Aufnahme schadet nie.
PROBE = os.environ.get("PROBETEXT", "").strip() or STANDARDPROBE

# Die Folge wird von **vier Läufern gleichzeitig** gesprochen; jeder nimmt
# jedes vierte Stück (`TEILE: '4'` in podcast-erzeugen.yml). Das Urteil muss
# sich auf diese Aufteilung beziehen, sonst misst es eine Anordnung, die es
# seit dem 8. August 2026 nicht mehr gibt.
LAEUFER = int(os.environ.get("LAEUFER", "4"))


def melde(text):
    print(f"[stimme] {text}", flush=True)


if not os.path.exists(REFERENZ):
    melde(f"Keine Referenzaufnahme unter {REFERENZ}.")
    melde("Ohne eine Sprachprobe lässt sich keine Stimme klonen.")
    sys.exit(78)

import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402

with wave.open(REFERENZ) as datei:
    referenzdauer = datei.getnframes() / datei.getframerate()
melde(f"Referenz: {referenzdauer:.1f} s, Modell {REPO}, {os.cpu_count()} Kerne.")

"""
Der Wortlaut steht neben der Aufnahme im Repository, nicht in einer
Variablen: Er gehört zur Datei wie die Bildunterschrift zum Bild, und wer
die Aufnahme austauscht, sieht den Text daneben liegen und zieht ihn mit.
"""
WORTLAUT = REFERENZ.rsplit(".", 1)[0] + ".txt"
referenztext = os.environ.get("REFERENZTEXT", "").strip()
if referenztext:
    # `Sprecher` liest den Wortlaut aus einer Datei. Damit `REFERENZTEXT`
    # weiter gilt, wandert er in eine temporäre.
    WORTLAUT = os.path.join(tempfile.gettempdir(), "stimme-wortlaut.txt")
    with open(WORTLAUT, "w", encoding="utf-8") as datei:
        datei.write(referenztext)
elif os.path.exists(WORTLAUT):
    with open(WORTLAUT, encoding="utf-8") as datei:
        referenztext = datei.read().strip()
if not referenztext:
    melde(f"Kein Wortlaut – weder REFERENZTEXT noch {WORTLAUT}.")
    melde("Das Modell braucht den Text der Aufnahme, um Stimme von Wörtern zu trennen.")
    sys.exit(78)
melde(f"Wortlaut: {len(referenztext.split())} Wörter.")

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sprechstimme  # noqa: E402

"""
Gesprochen wird in **Stücken mit Pausen dazwischen** – so wie die Folge.

## Warum das seit dem 13. August 2026 so ist

Vorher ging der ganze Probetext in **einen** Aufruf. Das misst die Stimme
richtig und führt in die Irre, sobald jemand die Probe zur Beurteilung
anhört: Eine echte Folge besteht aus zwanzig bis dreißig Stücken, zwischen
denen unterschiedlich lange Pausen stehen, und genau dieser Rhythmus ist
das, was der Betreiber am 9. August „sehr monoton" genannt hat.

Eine Hörprobe, die den Rhythmus nicht enthält, kann zu ihm nichts sagen.

Die Messung bleibt davon unberührt: Gemessen wird die reine Rechenzeit für
die gesprochenen Stücke, die eingefügte Stille zählt nicht mit.

## Und gesprochen wird seit dem 28. September 2026 über `Sprecher`

Hier stand das Modell zweimal da: einmal in `sprechstimme.Sprecher` mit
Frist, Teilung und Wiederholung, und einmal hier als nackter Aufruf von
`generate_voice_clone`. Die Doppelung hatte beim Anlegen einen Grund – das
Skript war zuerst da – und ist genau so gealtert, wie `AGENTS.md` es
beschreibt.

**Am 28. September 2026 hat sie eine Hörprobe gekostet.** Das sechste von
acht Stücken („Der ATX fiel, der PMI von ISM stieg.") hing dreizehneinhalb
Minuten, bis die Frist des Jobs den ganzen Lauf abräumte:

    Stück 1/8 … 38 s      Stück 4/8 … 29 s
    Stück 2/8 … 31 s      Stück 5/8 … 27 s
    Stück 3/8 … 28 s      Stück 6/8 … ##[error]The operation was canceled.

Das ist das bekannte `open-end generation`: Das Modell erzeugt Ton, bis es
ein Schlusszeichen setzt, und manchmal setzt es keines. `Sprecher.sprich()`
kennt den Fall seit dem 10. August – Frist nach Stücklänge, dann teilen,
dann wiederholen. Dieses Skript kannte ihn nicht, und die sechzehn Minuten
brauchbares Audio davor waren verloren: Geschrieben wurde nichts.

**Ein übersprungenes Stück kostet hier den Satz, nicht die Probe** – dieselbe
Abwägung wie bei den Lernseiten und aus demselben Grund: Die Hörprobe ist
Arbeitsmaterial zum Beurteilen, keine veröffentlichte Folge. Eine Aufnahme
mit einer Lücke schlägt keine Aufnahme.
"""
t0 = time.time()
sprecher = sprechstimme.Sprecher(REFERENZ, WORTLAUT, REPO, melde)
ruestzeit = time.time() - t0

stuecke = sprechstimme.in_stuecke(PROBE)
melde(f"Probetext: {len(PROBE)} Zeichen in {len(stuecke)} Stück(en).")

t0 = time.time()
teile = []
rate = 24000
gesprochene_proben = 0
uebersprungen = 0
for nummer, (stueck, pause) in enumerate(stuecke, start=1):
    try:
        wavs, rate = sprecher.sprich(stueck)
    except RuntimeError as fehler:
        uebersprungen += 1
        melde(f"  Stück {nummer}/{len(stuecke)} übersprungen: {fehler}")
        continue
    ton = np.asarray(wavs[0])
    gesprochene_proben += len(ton)
    teile.append(ton)
    if nummer < len(stuecke):
        teile.append(np.zeros(int(pause * rate), dtype=np.float32))
    melde(f"  Stück {nummer}/{len(stuecke)}: {pause:.2f} s Pause danach.")
rechenzeit = max(time.time() - t0, 1e-6)

if not teile:
    melde("")
    melde("Kein einziges Stück gesprochen – es entsteht keine Aufnahme.")
    sys.exit(1)
if uebersprungen:
    melde(f"::warning::{uebersprungen} von {len(stuecke)} Stücken fehlen in der Aufnahme.")

audio = np.concatenate(teile) if len(teile) > 1 else teile[0]

# Der Echtzeitfaktor misst **gesprochene** Sekunden je Sekunde Rechenzeit.
#
# Die eingefügte Stille kostet keine Rechenzeit und darf deshalb nicht in
# den Zähler: Sonst sähe die Stimme umso schneller aus, je mehr Pausen man
# einbaut. Genau das wäre eine Kennzahl, die sich selbst verbessert, ohne
# dass irgendetwas besser geworden ist.
gesprochen = gesprochene_proben / rate
gesamt = len(audio) / rate
faktor = gesprochen / rechenzeit

sf.write("probe.wav", audio, rate)

# Der gesprochene Wortlaut gehört neben die Aufnahme – aus demselben Grund,
# aus dem `stimme-referenz.txt` neben `stimme-referenz.wav` liegt: Wer die
# Datei in einer Woche wiederfindet, soll nicht raten müssen, was sie sagt.
with open("probe.txt", "w", encoding="utf-8") as datei:
    datei.write(PROBE.strip() + "\n")

melde("")
melde(f"Erzeugt:      {gesprochen:.1f} s Sprache + {gesamt - gesprochen:.1f} s Pausen")
melde(f"Aufnahme:     {gesamt:.1f} s")
melde(f"Gerechnet:    {rechenzeit:.0f} s")
melde(f"Echtzeitfaktor: {faktor:.2f}   (über 1,0 = schneller als Echtzeit)")
melde("")

# Hochrechnung auf eine echte Folge von fünf Minuten.
#
# **Ein Läufer allein schafft das nicht** – das war schon am 8. August 2026 so
# und ist der Grund für die Aufteilung. Maßgeblich ist deshalb nicht diese
# Zahl, sondern die darunter.
allein = 300 / faktor
melde(f"Ein Läufer allein bräuchte für fünf Minuten Folge {allein / 60:.0f} Minuten.")

geteilt = allein / LAEUFER + ruestzeit
melde(
    f"Auf {LAEUFER} Läufer verteilt sind es {geteilt / 60:.0f} Minuten je Läufer, "
    f"Modell und Stimmprofil eingerechnet."
)
melde("Der Sprechlauf hat 45 Minuten Zeit (podcast-erzeugen.yml, Job „sprechen“).")

# 40 Minuten statt 45: Ein Urteil, das die Grenze punktgenau ausreizt, ist
# kein Urteil. Siehe „Eine Grenze, die den guten Tag gerade eben trägt, ist
# eine Wette" in AGENTS.md.
if geteilt > 2400:
    melde("")
    melde("URTEIL: zu langsam – auch verteilt reicht die Zeit nicht.")
    sys.exit(1)

melde("")
melde("URTEIL: schnell genug für den täglichen Lauf.")
