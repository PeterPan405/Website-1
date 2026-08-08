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
import time
import wave

REFERENZ = sys.argv[1] if len(sys.argv) > 1 else "assets/stimme-referenz.wav"
GROESSE = sys.argv[2] if len(sys.argv) > 2 else "0.6B"
REPO = f"Qwen/Qwen3-TTS-12Hz-{GROESSE}-Base"

# Rund 30 Sekunden Sprache – lang genug für eine belastbare Messung,
# kurz genug, dass ein aussichtsloser Versuch nicht 20 Minuten kostet.
PROBE = (
    "Guten Morgen und herzlich willkommen zum Marktupdate von IM Investments. "
    "Heute ist Montag, der zehnte August zweitausendsechsundzwanzig. "
    "Ein schwacher US-Jobbericht schickt den DAX auf Rekordkurs, Gold steigt "
    "den dritten Tag in Folge, und zwei Großbanken verpacken den KI-Boom in "
    "Anleihekörbe. Schwache Konjunkturdaten senken die erwarteten "
    "Notenbankzinsen, und niedrigere Zinsen erhöhen rechnerisch den heutigen "
    "Wert künftiger Unternehmensgewinne."
)


def melde(text):
    print(f"[stimme] {text}", flush=True)


if not os.path.exists(REFERENZ):
    melde(f"Keine Referenzaufnahme unter {REFERENZ}.")
    melde("Ohne eine Sprachprobe lässt sich keine Stimme klonen.")
    sys.exit(78)

import numpy as np  # noqa: E402
import soundfile as sf  # noqa: E402
import torch  # noqa: E402

torch.set_num_threads(os.cpu_count() or 2)

with wave.open(REFERENZ) as datei:
    referenzdauer = datei.getnframes() / datei.getframerate()
melde(f"Referenz: {referenzdauer:.1f} s, Modell {REPO}, {os.cpu_count()} Kerne.")

t0 = time.time()
from qwen_tts import Qwen3TTSModel  # noqa: E402

modell = Qwen3TTSModel.from_pretrained(REPO, device="cpu", dtype=torch.float32)
ladezeit = time.time() - t0
melde(f"Modell geladen in {ladezeit:.0f} s.")

"""
Der Wortlaut steht neben der Aufnahme im Repository, nicht in einer
Variablen: Er gehört zur Datei wie die Bildunterschrift zum Bild, und wer
die Aufnahme austauscht, sieht den Text daneben liegen und zieht ihn mit.
"""
WORTLAUT = REFERENZ.rsplit(".", 1)[0] + ".txt"
referenztext = os.environ.get("REFERENZTEXT", "").strip()
if not referenztext and os.path.exists(WORTLAUT):
    with open(WORTLAUT, encoding="utf-8") as datei:
        referenztext = datei.read().strip()
if not referenztext:
    melde(f"Kein Wortlaut – weder REFERENZTEXT noch {WORTLAUT}.")
    melde("Das Modell braucht den Text der Aufnahme, um Stimme von Wörtern zu trennen.")
    sys.exit(78)
melde(f"Wortlaut: {len(referenztext.split())} Wörter.")

t0 = time.time()
prompt = modell.create_voice_clone_prompt(audio=REFERENZ, text=referenztext)
promptzeit = time.time() - t0
melde(f"Stimmprofil erstellt in {promptzeit:.0f} s.")

t0 = time.time()
wavs, rate = modell.generate_voice_clone(
    text=PROBE, voice_clone_prompt=prompt, language="German"
)
rechenzeit = time.time() - t0

audio = np.asarray(wavs[0])
dauer = len(audio) / rate
faktor = dauer / rechenzeit

sf.write("probe.wav", audio, rate)

melde("")
melde(f"Erzeugt:      {dauer:.1f} s Audio")
melde(f"Gerechnet:    {rechenzeit:.0f} s")
melde(f"Echtzeitfaktor: {faktor:.2f}   (über 1,0 = schneller als Echtzeit)")
melde("")

# Hochrechnung auf eine echte Folge von fünf Minuten.
hochgerechnet = 300 / faktor
melde(f"Fünf Minuten Folge bräuchten damit rund {hochgerechnet / 60:.0f} Minuten,")
melde(f"zuzüglich {ladezeit:.0f} s Modellladen. Der Lauf hat 20 Minuten Zeit.")

if hochgerechnet + ladezeit > 900:
    melde("")
    melde("URTEIL: zu langsam für den täglichen Lauf.")
    sys.exit(1)

melde("")
melde("URTEIL: schnell genug.")
