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
ganzen Durchgang. Der Text wird deshalb zerlegt: erst an Absätzen, dann
an Satzgrenzen, in Stücke von höchstens ~240 Zeichen. Jedes Stück beginnt
wieder beim selben Stimmprofil – das hält den Klang über die ganze Folge
gleich.

Zwischen den Stücken steht eine Pause, und zwar zwei verschiedene: eine
kurze zwischen Sätzen, eine lange am Absatzende. Sie sind nicht Kosmetik.
An den langen sucht der Kapitelschritt später die Sprechpausen, und die
Mischung aus beiden ist der Unterschied zwischen gesprochen und
heruntergelesen.

## Warum es mehrere Läufer braucht

Am 8. August 2026 gemessen: Echtzeitfaktor 0,13 – 34,7 Sekunden Sprache
in 265 Sekunden. Daraus gerechnet brauchte eine Folge 38 Minuten. Der
erste echte Lauf brauchte **über 57** und lief in die Frist: Jedes Stück
kostet eigenen Vorlauf, den eine Messung an einem einzigen Stück nicht
zeigt.

Ein Läufer reicht damit nicht. `TEIL` und `TEILE` teilen die Stücke auf
mehrere Läufer auf, die gleichzeitig sprechen; jeder schreibt seinen
Abschnitt als WAV, und ein letzter Lauf fügt sie zusammen. Die Aufteilung
passiert **nach** dem Zerlegen an Satzgrenzen – jeder Läufer rechnet
dieselbe Liste aus und nimmt nur seinen Teil daraus. Damit gibt es keine
zweite Stelle, an der sich die Grenzen verschieben könnten.

## Was passiert, wenn es scheitert

Nichts Stilles. Ohne Aufnahme endet das Skript mit einem Fehler, und der
Workflow versucht danach die Schnittstelle als Rückfall. Eine halbe Folge
wäre schlimmer als keine.

Aufruf: python scripts/stimme-erzeugen.py [modellgroesse]
        TEIL=2 TEILE=4 python scripts/stimme-erzeugen.py
"""

import os
import re
import signal
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

# Höchstlänge eines Stücks.
#
# Bis zum 8. August 2026 waren es 350 Zeichen. Das Urteil des Betreibers
# nach der ersten Hörprobe: „klingt ein wenig heruntergerattert“. Der
# Grund steckt genau hier – innerhalb eines Stücks spricht das Modell
# mehrere Sätze am Stück durch, und Satzenden bekommen kaum Luft. Je
# kürzer die Stücke, desto öfter setzt der Sprecher neu an.
#
# 240 Zeichen sind rund vierzehn Sekunden. Das kostet Rechenzeit – mehr
# Stücke, mehr Vorlauf je Stück –, und genau dafür gibt es die vier
# Läufer.
STUECK_MAX = 240

# Zwei Pausen statt einer.
#
# Vorher stand hier ein einziger Wert von 0,35 s für jede Fuge. Das war
# zu wenig und außerdem zu gleichförmig: Ein Absatzwechsel klang wie ein
# Komma. Jetzt trägt jedes Stück seine eigene Pause – die kurze zwischen
# Sätzen desselben Absatzes, die lange am Absatzende.
#
# Die 0,95 s am Absatzende sind zugleich das, wonach der Kapitelschritt
# sucht (`silencedetect ... d=0.6`): Die Marken sitzen damit auf echten
# Themenwechseln statt auf zufälligen Satzfugen.
PAUSE_SATZ = 0.5
PAUSE_ABSATZ = 0.95

# Nachbearbeitung der fertigen Aufnahme.
#
# `highpass` nimmt das Grummeln unter 80 Hz weg, das kein Sprecher
# erzeugt und jedes Modell mitliefert. `afftdn` ist die eigentliche
# Rauschunterdrückung – zurückhaltend eingestellt, weil zu viel davon die
# Stimme blechern macht. `loudnorm` bringt die Lautheit auf −16 LUFS, den
# Wert, den Spotify und YouTube für Sprache erwarten; ohne ihn schwankt
# der Pegel zwischen den Folgen hörbar.
#
# Der Betreiber hat nach der ersten Hörprobe „ein paar Störgeräusche im
# Hintergrund“ gemeldet. Dagegen steht diese Kette.
KLANGKETTE = "highpass=f=80,afftdn=nf=-28,loudnorm=I=-16:TP=-1.5:LRA=11"


def melde(text):
    print(f"[stimme] {text}", flush=True)


def in_stuecke(text: str) -> list[tuple[str, float]]:
    """Zerlegt in Stücke und sagt zu jedem, wie lange danach Ruhe ist.

    Zerlegt wird zuerst an **Absätzen**, dann innerhalb eines Absatzes an
    Satzgrenzen. Ein Satz, der allein länger als die Höchstlänge ist,
    bleibt ganz: Ihn mitten im Wort zu trennen wäre der einzige Fehler,
    den man später nicht mehr hört, sondern versteht.

    Die Absatzgrenze zu kennen ist der ganze Zweck der Umstellung. Vorher
    ging sie beim Zerlegen verloren – `\\s+` verschluckt die Leerzeile –,
    und damit klang der Wechsel von einem Thema zum nächsten wie ein
    beliebiges Komma.
    """
    stuecke: list[tuple[str, float]] = []
    absaetze = [a.strip() for a in re.split(r"\n\s*\n", text.strip()) if a.strip()]

    for absatz in absaetze:
        saetze = [s for s in re.split(r"(?<=[.!?])\s+", absatz) if s]
        im_absatz: list[str] = []
        laufend = ""
        for satz in saetze:
            if laufend and len(laufend) + 1 + len(satz) > STUECK_MAX:
                im_absatz.append(laufend)
                laufend = satz
            else:
                laufend = f"{laufend} {satz}".strip()
        if laufend:
            im_absatz.append(laufend)

        for nummer, stueck in enumerate(im_absatz, start=1):
            letztes = nummer == len(im_absatz)
            stuecke.append((stueck, PAUSE_ABSATZ if letztes else PAUSE_SATZ))

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
alle_stuecke = in_stuecke(text)

"""
Die Aufteilung auf mehrere Läufer. Jeder rechnet dieselbe Stückliste aus
und nimmt daraus nur jedes n-te – reihum statt blockweise. Das ist kein
Schönheitsfehler, sondern Absicht: Die Stücke sind unterschiedlich lang,
und reihum verteilt sich die Rechenzeit gleichmäßiger als in Blöcken, bei
denen ein Läufer zufällig die langen Abschnitte erwischt.
"""
TEIL = int(os.environ.get("TEIL", "0"))
TEILE = int(os.environ.get("TEILE", "0"))

if TEILE > 0:
    if not 1 <= TEIL <= TEILE:
        melde(f"TEIL={TEIL} passt nicht zu TEILE={TEILE}.")
        sys.exit(1)
    meine = [(i, s) for i, s in enumerate(alle_stuecke) if i % TEILE == TEIL - 1]
    melde(f"Läufer {TEIL} von {TEILE}: {len(meine)} von {len(alle_stuecke)} Stücken.")
else:
    meine = list(enumerate(alle_stuecke))
    melde(f"{len(text)} Zeichen in {len(alle_stuecke)} Stücken, Modell {REPO}.")

if not meine:
    melde("Nichts zu sprechen – mehr Läufer als Stücke.")
    sys.exit(1)

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

"""
Jedes Stück kommt als **eigene Datei** heraus, benannt nach seiner Stelle
im Ganzen: `stueck-000.wav`, `stueck-001.wav`, …

Das ist der Grund, warum das Zusammenfügen später nichts weiß und nichts
wissen muss: Es sortiert nach Dateinamen, fertig. Wer die Läufer reihum
verteilt, darf ihre Ergebnisse nicht blockweise aneinanderhängen – mit
dem Index im Namen kann das gar nicht erst schiefgehen.

Die Pause hängt an jedem Stück hinten dran. Am letzten stört sie nicht;
eine Sonderbehandlung dafür wäre eine Fallunterscheidung ohne Nutzen.
"""

"""
## Die Reißleine je Stück

Am 8. August 2026 hing ein Läufer **zweiundvierzig Minuten am ersten
Stück** und meldete in der ganzen Zeit keine einzige Zeile. Erst die
Frist des Jobs beendete ihn, und damit war die ganze Vertonung hin – ein
Stück kostete die Folge.

Der Grund steht eine Zeile davor im Protokoll: `open-end generation`.
Das Modell erzeugt Ton, bis es ein Schlusszeichen setzt. Setzt es keines,
läuft es bis zum Anschlag. Das passiert selten, aber es passiert, und
gegen „selten" hilft kein Zureden, sondern nur eine Uhr.

`SIGALRM` unterbricht den Aufruf. Die Erzeugung ist eine Schleife über
Schritte in Python, und zwischen zwei Schritten kommt der Signalhandler
zum Zug – ein hängender Aufruf lässt sich damit tatsächlich abbrechen,
anders als ein einzelner langer C-Aufruf.

Ein zweiter Versuch lohnt sich, weil gewürfelt wird: Derselbe Text
nimmt beim nächsten Mal einen anderen Weg. Scheitert auch der, endet der
Läufer mit einem Fehler – dann fehlt ein Stück, und das Zusammenfügen
bricht ab, statt eine Folge mit einem Loch auszuliefern.
"""
FRIST_JE_STUECK = int(os.environ.get("STIMME_FRIST", "240"))


class Zeitueberschreitung(Exception):
    pass


def _wecker(signum, rahmen):  # noqa: ARG001
    raise Zeitueberschreitung()


signal.signal(signal.SIGALRM, _wecker)


def sprich(stueck: str):
    """Spricht ein Stück, mit Frist und einem zweiten Versuch."""
    for versuch in (1, 2):
        signal.alarm(FRIST_JE_STUECK)
        try:
            return modell.generate_voice_clone(
                text=stueck, voice_clone_prompt=prompt, language="German"
            )
        except Zeitueberschreitung:
            melde(
                f"  Stück nach {FRIST_JE_STUECK} s abgebrochen "
                f"(Versuch {versuch}/2) – das Modell fand kein Ende."
            )
        finally:
            signal.alarm(0)
    raise RuntimeError(
        "Ein Stück ließ sich zweimal nicht sprechen. Lieber keine Folge als "
        "eine mit einem Loch."
    )


t0 = time.time()
gesamtdauer = 0.0
for lauf, (index, (stueck, ruhe)) in enumerate(meine, start=1):
    wavs, rate = sprich(stueck)
    audio = np.asarray(wavs[0])
    pause = np.zeros(int(rate * ruhe), dtype=audio.dtype)
    sf.write(f"podcast-folge/stueck-{index:03d}.wav", np.concatenate([audio, pause]), rate)
    gesamtdauer += len(audio) / rate
    melde(f"  Stück {index + 1} ({lauf}/{len(meine)}) – {len(audio) / rate:.1f} s")

rechenzeit = time.time() - t0
melde(f"{gesamtdauer / 60:.1f} Minuten Sprache in {rechenzeit / 60:.1f} Minuten gerechnet.")
melde(f"Echtzeitfaktor {gesamtdauer / rechenzeit:.2f}.")

# Bei aufgeteilter Arbeit ist hier Schluss: Die Stücke sind geschrieben,
# das Zusammenfügen macht ein eigener Lauf, der alle hat.
if TEILE > 0:
    melde(f"Teil {TEIL} fertig – {len(meine)} Dateien.")
    sys.exit(0)

teile = []
for index in range(len(alle_stuecke)):
    stueck_audio, rate = sf.read(f"podcast-folge/stueck-{index:03d}.wav")
    teile.append(stueck_audio)
audio = np.concatenate(teile)
dauer = len(audio) / rate

sf.write(ROHFASSUNG, audio, rate)

# In MP3 wandeln: Das ist das Format, das der Feed ausweist und jeder
# Abspieler kann. 128 kbit/s mono ist der übliche Wert eines
# Sprach-Podcasts – mehr hört man bei einer Stimme nicht.
subprocess.run(
    [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", ROHFASSUNG,
        "-af", KLANGKETTE,
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
