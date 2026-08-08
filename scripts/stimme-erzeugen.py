"""
Vertont den Sprechtext des Tages mit der eigenen, geklonten Stimme.

## Warum das Modell und nicht die Voicebox-Anwendung

Voicebox ist ein Sprachstudio mit Oberfläche, Datenbank und
Modellverwaltung – gedacht für einen Rechner, der steht. Auf einem
GitHub-Läufer, den es nach zwanzig Minuten nicht mehr gibt, wäre das
Ballast. Verwendet wird deshalb dasselbe Modell, das Voicebox unter der
Haube lädt: Qwen3-TTS-12Hz, das Deutsch spricht und Stimmen aus einer
einzigen Aufnahme klont.

Die Stimme steckt in zwei Dateien im Repository:

    assets/stimme-referenz.wav   rund 30 Sekunden Sprache
    assets/stimme-referenz.txt   ihr Wortlaut

Beides gehört zusammen. Das Modell braucht den Text, um Stimme von
Wörtern zu trennen; ohne ihn klont es den Klang der Sätze mit.

## Warum in Stücken gesprochen wird

Fünf Minuten am Stück sind für ein Zero-Shot-Modell zu viel: Die Stimme
driftet, der Rhythmus zerfällt, und ein Fehler in der Mitte kostet den
ganzen Durchgang. Der Text wird deshalb an Satzgrenzen in Stücke von
höchstens ~350 Zeichen zerlegt. Jedes Stück beginnt wieder beim selben
Stimmprofil – das hält den Klang über die ganze Folge gleich.

Zwischen den Stücken steht eine kurze Pause. Sie ist nicht Kosmetik: An
diesen Stellen sucht der Kapitelschritt später die Sprechpausen.

## Was passiert, wenn es scheitert

Nichts Stilles. Ohne Aufnahme endet das Skript mit einem Fehler, und der
Workflow versucht danach die Schnittstelle als Rückfall. Eine halbe Folge
wäre schlimmer als keine.

Aufruf: python scripts/stimme-erzeugen.py [modellgroesse]
"""

import os
import re
import subprocess
import sys
import time

REFERENZ = os.environ.get("STIMME_REFERENZ", "assets/stimme-referenz.wav")
WORTLAUT = REFERENZ.rsplit(".", 1)[0] + ".txt"
GROESSE = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("STIMME_GROESSE", "0.6B")
REPO = f"Qwen/Qwen3-TTS-12Hz-{GROESSE}-Base"

QUELLE = "podcast-folge/sprechtext.txt"
ROHFASSUNG = "podcast-folge/folge.wav"
ZIEL = "podcast-folge/folge.mp3"

# Höchstlänge eines Stücks. 350 Zeichen sind rund 20 Sekunden Sprache –
# kurz genug, dass die Stimme nicht driftet, lang genug, dass die Pausen
# zwischen den Stücken nicht als Stocken hörbar werden.
STUECK_MAX = 350

# Pause zwischen zwei Stücken, in Sekunden. 0,35 s ist eine Atempause,
# keine Zäsur – die 0,6 s, nach denen der Kapitelschritt sucht, entstehen
# an echten Absatzgrenzen im Text.
PAUSE = 0.35


def melde(text):
    print(f"[stimme] {text}", flush=True)


def in_stuecke(text: str) -> list[str]:
    """Zerlegt an Satzgrenzen, ohne einen Satz zu zerreißen.

    Ein Satz, der allein länger als die Höchstlänge ist, bleibt ganz. Ihn
    mitten im Wort zu trennen wäre der einzige Fehler, den man später
    nicht mehr hört, sondern versteht.
    """
    saetze = re.split(r"(?<=[.!?])\s+", text.strip())
    stuecke: list[str] = []
    laufend = ""
    for satz in saetze:
        if not satz:
            continue
        if laufend and len(laufend) + 1 + len(satz) > STUECK_MAX:
            stuecke.append(laufend)
            laufend = satz
        else:
            laufend = f"{laufend} {satz}".strip()
    if laufend:
        stuecke.append(laufend)
    return stuecke


for pfad, was in ((REFERENZ, "Sprachprobe"), (WORTLAUT, "Wortlaut"), (QUELLE, "Sprechtext")):
    if not os.path.exists(pfad):
        melde(f"Keine {was} unter {pfad}.")
        sys.exit(1)

text = open(QUELLE, encoding="utf-8").read().strip()
if not text:
    melde(f"{QUELLE} ist leer – ohne Text keine Aufnahme.")
    sys.exit(1)

referenztext = open(WORTLAUT, encoding="utf-8").read().strip()
stuecke = in_stuecke(text)
melde(f"{len(text)} Zeichen in {len(stuecke)} Stücken, Modell {REPO}.")

import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402
import torch  # noqa: E402

torch.set_num_threads(os.cpu_count() or 2)

t0 = time.time()
from qwen_tts import Qwen3TTSModel  # noqa: E402

# Genau die Aufrufe, die Voicebox in `backend/backends/pytorch_backend.py`
# für einen Rechner ohne Grafikkarte verwendet. Selbst ausgedachte
# Argumente (`device=`, `dtype=`) kennt die Klasse nicht.
modell = Qwen3TTSModel.from_pretrained(
    REPO,
    torch_dtype=torch.float32,
    low_cpu_mem_usage=False,
)
melde(f"Modell geladen in {time.time() - t0:.0f} s.")

t0 = time.time()
prompt = modell.create_voice_clone_prompt(
    ref_audio=REFERENZ,
    ref_text=referenztext,
    x_vector_only_mode=False,
)
melde(f"Stimmprofil erstellt in {time.time() - t0:.0f} s.")

t0 = time.time()
teile: list = []
rate = None
for nummer, stueck in enumerate(stuecke, start=1):
    wavs, rate = modell.generate_voice_clone(
        text=stueck, voice_clone_prompt=prompt, language="German"
    )
    teile.append(np.asarray(wavs[0]))
    teile.append(np.zeros(int(rate * PAUSE), dtype=teile[-1].dtype))
    melde(f"  Stück {nummer}/{len(stuecke)} – {len(teile[-2]) / rate:.1f} s")

audio = np.concatenate(teile)
dauer = len(audio) / rate
rechenzeit = time.time() - t0
melde(f"{dauer / 60:.1f} Minuten Sprache in {rechenzeit / 60:.1f} Minuten gerechnet.")
melde(f"Echtzeitfaktor {dauer / rechenzeit:.2f}.")

sf.write(ROHFASSUNG, audio, rate)

# In MP3 wandeln: Das ist das Format, das der Feed ausweist und jeder
# Abspieler kann. 128 kbit/s mono ist der übliche Wert eines
# Sprach-Podcasts – mehr hört man bei einer Stimme nicht.
subprocess.run(
    [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", ROHFASSUNG,
        "-c:a", "libmp3lame", "-b:a", "128k", "-ac", "1", "-ar", "44100",
        ZIEL,
    ],
    check=True,
)
os.remove(ROHFASSUNG)

groesse = os.path.getsize(ZIEL)
melde(f"{ZIEL} geschrieben – {groesse / 1024 / 1024:.1f} MB.")

# Dieselbe Untergrenze wie beim Weg über die Schnittstelle: Was bei fünf
# Minuten Text unter 100 KB bleibt, ist keine Aufnahme, sondern eine
# Fehlermeldung im Audioformat.
if groesse < 100_000:
    melde(f"FEHLER: {groesse} Bytes sind zu wenig für {dauer / 60:.1f} Minuten.")
    sys.exit(1)
