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

    assets/stimme-referenz.wav   zwanzig bis dreißig Sekunden Sprache
    assets/stimme-referenz.txt   ihr Wortlaut

Beides gehört zusammen. Das Modell braucht den Text, um Stimme von
Wörtern zu trennen; ohne ihn klont es den Klang der Sätze mit.

**Der Wortlaut muss wirklich stimmen.** Ein Satz, der so nicht gesprochen
wurde, verschiebt die Zuordnung von Laut zu Buchstabe für die ganze
Aufnahme – das ist schlimmer als ein fehlender Text.

Deshalb steht in `stimme-referenz.txt` bis heute „IM Investments", obwohl
die Marke **IM Invests** heißt und der Sprechtext seit dem 9. August 2026
überall korrigiert ist. Der Wortlaut ist kein Skript, sondern eine
Mitschrift: Er gibt wieder, was auf der Aufnahme gesagt wurde, und das ist
nun einmal die falsche Form. Wer ihn „berichtigt", verschlechtert die
Stimme, ohne dass irgendwo etwas besser klänge – gesprochen wird die
Referenz nie, sie dient nur dem Abgleich.

Richtig wird es erst mit einer **neuen Aufnahme**. Wer eine macht, sagt
„IM Invests" und trägt genau das hier ein.

Format: WAV, 24 kHz, mono, 16 Bit. Eine Sprachnachricht vom Telefon kommt
als AAC in Stereo und muss umgerechnet werden:

    ffmpeg -i aufnahme.m4a -ac 1 -ar 24000 -c:a pcm_s16le stimme-referenz.wav

Stille am Anfang und Ende gehört weggeschnitten; sie trägt keine Stimme
und kostet nur Referenz. Die Lautstärke dagegen bleibt, wie sie ist – die
Aufnahme vom 9. August 2026 liegt bei −36 LUFS, die vorherige bei −35,
und das Modell stört das nicht.

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
import sys
import time

import klangkette

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

# Die Pausen stehen in `sprechstimme.py` – hier steht nur noch der Aufruf.
#
# ## Wie es dazu kam
#
# Vorher stand hier ein einziger Wert von 0,35 s für jede Fuge; dann zwei,
# 0,5 und 0,95. Am 9. August 2026 das Urteil des Betreibers: **„sehr
# monoton“.** Zwei Werte sind ein Metronom, also wurde die Pause an das
# **Satzzeichen** gehängt – vier Werte statt zwei.
#
# Am 13. August 2026 nachgezählt, was davon an einer echten Folge greift:
#
#     0,5  s (Satz)     9 ×
#     0,95 s (Absatz)   7 ×
#     0,66 s (Frage)    0 ×
#     0,34 s (Ankünd.)  0 ×
#
# **Wieder zwei Werte.** In 352 Wörtern Nachrichtentext steht kein
# Fragezeichen, kein Ausrufezeichen und kein Doppelpunkt; eine Meldung
# besteht aus Aussagesätzen mit Punkt. Die Umstellung sah nach Abhilfe aus
# und war keine.
#
# Seither hängt der gewöhnliche Satzschluss an der **Länge des zuletzt
# gesprochenen Satzes** – ein Merkmal, das jeder Satz hat. Begründung,
# Grenzen und Gegenprobe stehen bei `sprechstimme.pause_fuer`.
#
# Das Absatzende bleibt fest bei 0,95 s: Danach sucht der Kapitelschritt
# (`silencedetect ... d=0.6`). Die Abweichung ist so bemessen, dass es nie
# unter 0,8 s fällt – sonst verschöben sich die Kapitelmarken, und die
# Beschreibung bei YouTube zeigte auf die falsche Stelle.


def pause_fuer(stueck: str, absatzende: bool, stelle: int) -> float:
    """Wie lange es nach diesem Stück still bleibt – gerechnet in `sprechstimme`.

    Der Import steht **in** der Funktion und nicht im Kopf der Datei, aus
    demselben Grund wie bei `brauchbar` weiter unten: Die Reihenfolge, in der
    die beiden Module geladen werden, soll keine Rolle spielen.
    """
    import sprechstimme

    return sprechstimme.pause_fuer(stueck, absatzende, stelle)

# Die Nachbearbeitung der fertigen Aufnahme steht in `klangkette.py` –
# eine Stelle für beide Wege, mit der Begründung dort. Kurz: Grummeln
# weg, Rauschen mild gedämpft, Lautheit in zwei Durchgängen auf −16 LUFS
# ohne Dynamikkompression.


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
            stuecke.append((stueck, pause_fuer(stueck, letztes, len(stuecke))))

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
FRIST_JE_STUECK = int(os.environ.get("STIMME_FRIST", "180"))


class Zeitueberschreitung(Exception):
    pass


def _wecker(signum, rahmen):  # noqa: ARG001
    raise Zeitueberschreitung()


signal.signal(signal.SIGALRM, _wecker)


def mit_schlusszeichen(text: str) -> str:
    """Sorgt dafür, dass ein Stück auf einem Satzzeichen endet.

    **Das ist keine Kosmetik, sondern die Abbruchbedingung des Modells.**

    `open-end generation` heißt: Es erzeugt Ton, bis es ein Schlusszeichen
    setzt. Ein Fetzen, der auf ein Komma endet, gibt ihm keinen Anlass dazu –
    also läuft es bis zur Frist.

    Am 9. August 2026 hat das den ersten echten Podcastlauf gekostet. Die
    Teilung schnitt am Komma, und die linke Hälfte hieß:

        'Was sich bewegt hat,'

    Zwanzig Zeichen, kein Satzende, hing zweimal – und war zu kurz, um noch
    einmal geteilt zu werden. Der Lauf endete mit „lieber keine Folge als eine
    mit einem Loch“, und es gab keine Folge.

    Das Komma wird ersetzt, nicht ergänzt: „hat,.“ spräche das Modell als
    Stocken. Gehört wird der Punkt an dieser Stelle ohnehin kaum – die
    Sprechpause danach ist dieselbe.
    """
    sauber = text.rstrip()
    if not sauber:
        return sauber
    if sauber[-1] in ".!?":
        return sauber
    if sauber[-1] in ",;:–—-":
        return sauber[:-1].rstrip() + "."
    return sauber + "."


def haelften(stueck: str) -> tuple[str, str] | None:
    """Teilt ein Stück in der Mitte, an der nächstbesten Sprechgrenze.

    Gesucht wird die Grenze, die der Mitte am nächsten liegt – erst ein
    Satzende, dann ein Komma, dann notfalls ein Leerzeichen. Mitten im
    Wort wird nie getrennt: Das hört man, und zwar sofort.

    Beide Hälften bekommen ein Schlusszeichen; warum, steht bei
    `mit_schlusszeichen`. Ohne das war die Teilung ein Tausch: ein hängendes
    Stück gegen zwei, von denen eines garantiert hängt.

    Die Untergrenze von 80 Zeichen gilt nur für das **Teilen**. Ein kürzeres
    Stück, das hängt, ist damit nicht verloren – es bekommt sein Schlusszeichen
    und einen weiteren Versuch (siehe `sprich`).
    """
    if len(stueck) < 80:
        return None
    mitte = len(stueck) // 2
    for muster in (r"[.!?]\s", r",\s", r"\s"):
        stellen = [m.end() for m in re.finditer(muster, stueck)]
        brauchbar = [s for s in stellen if 20 < s < len(stueck) - 20]
        if brauchbar:
            schnitt = min(brauchbar, key=lambda s: abs(s - mitte))
            return (
                mit_schlusszeichen(stueck[:schnitt]),
                mit_schlusszeichen(stueck[schnitt:]),
            )
    return None


def sprich(stueck: str, tiefe: int = 0):
    """Spricht ein Stück. Hängt das Modell, wird geteilt statt aufgegeben.

    ## Warum teilen und nicht nochmal versuchen

    Der zweite Versuch war die erste Idee und hat sich als wertlos
    erwiesen: Am 8. August 2026 hing **dasselbe** Stück zweimal
    hintereinander, jedes Mal bis zur Frist. Es liegt also am Text, nicht
    am Zufall – und dann hilft ein weiterer Anlauf mit demselben Text
    nicht.

    Was hilft, ist ein **kürzeres** Stück. Das Modell erzeugt Ton, bis es
    ein Schlusszeichen setzt; je weniger es auf einmal sprechen soll,
    desto eher findet es eines. Die beiden Hälften werden nahtlos
    aneinandergehängt – gehört wird davon nichts, weil an einer
    Sprechgrenze getrennt wurde.

    Drei Ebenen tief, dann ist Schluss: Ein Fetzen von zwanzig Zeichen,
    der immer noch hängt, ist kein Textproblem mehr.

    ## Der Fetzen ohne Satzende

    Am 9. August 2026 endete der erste echte Podcastlauf so:

        Stück hing nach 180 s – geteilt in 20 + 60 Zeichen (Ebene 1)
        RuntimeError: 'Was sich bewegt hat,' ließ sich nicht sprechen
        und nicht mehr teilen.

    Zwanzig Zeichen, Komma am Ende, zu kurz zum Teilen – und damit war die
    Folge weg. Die Teilung hatte den Fehler nicht behoben, sondern erzeugt:
    Sie schnitt am Komma und gab dem Modell eine Hälfte ohne Abbruchbedingung.

    Deshalb zwei Dinge: `haelften` setzt jetzt Schlusszeichen, und ein Stück,
    das sich **nicht** teilen lässt, bekommt vorher noch einen Versuch mit
    Schlusszeichen. Erst wenn auch der scheitert, ist Schluss.
    """
    signal.alarm(FRIST_JE_STUECK)
    try:
        return modell.generate_voice_clone(
            text=stueck, voice_clone_prompt=prompt, language="German"
        )
    except Zeitueberschreitung:
        pass
    finally:
        signal.alarm(0)

    teile = haelften(stueck) if tiefe < 3 else None
    if not teile:
        # Zu kurz zum Teilen. Fehlt bloß das Schlusszeichen, ist das kein
        # verlorenes Stück, sondern ein ungestellter Halt.
        geschlossen = mit_schlusszeichen(stueck)
        if geschlossen != stueck and tiefe < 4:
            melde(f"  Stück ohne Satzende – erneut mit Punkt: {geschlossen[:40]!r}")
            return sprich(geschlossen, tiefe + 1)
        raise RuntimeError(
            f"Ein Stück ließ sich nicht sprechen und nicht mehr teilen: "
            f"{stueck[:60]!r}. Lieber keine Folge als eine mit einem Loch."
        )

    melde(
        f"  Stück hing nach {FRIST_JE_STUECK} s – geteilt in "
        f"{len(teile[0])} + {len(teile[1])} Zeichen (Ebene {tiefe + 1})."
    )
    links, rate = sprich(teile[0], tiefe + 1)
    rechts, _ = sprich(teile[1], tiefe + 1)
    return [np.concatenate([np.asarray(links[0]), np.asarray(rechts[0])])], rate


# Die Maße dazu – Sekunden je Zeichen, erlaubte Abweichung, Fensterlänge –
# stehen alle in `sprechstimme.py`. Sie hier noch einmal zu setzen, hieße,
# zwei Zahlen zu pflegen, von denen eine irgendwann die falsche ist.


def brauchbar(stueck: str, audio, rate: int) -> str | None:
    """Sagt, warum ein gesprochenes Stück unbrauchbar aussieht – oder nichts.

    ## Warum das hier nur noch ein Verweis ist

    Diese Prüfung stand am 10. August 2026 zweimal im Repository: einmal hier
    für die Podcastfolge, einmal in `sprechstimme.py` für die Lernseiten. Das
    war als Übergang gedacht und hat sich am selben Abend gerächt.

    Der Betreiber meldete dieselbe Störung zweimal – morgens in der Folge bei
    Minute 1:21, abends in der Aufnahme einer Lernseite bei 1:36. Ein Fehler,
    der an zwei Stellen auftritt, weil die Prüfung an zwei Stellen dieselbe
    Lücke hat, wird nicht dadurch behoben, dass man eine davon repariert.

    **Also gibt es die Prüfung genau einmal.** Was sie tut und warum sie
    fensterweise arbeitet, steht bei `sprechstimme.auffaellige_stellen`.

    Der Rest dieser Datei bleibt vorerst eigenständig – der nächste
    Podcastlauf ist in wenigen Stunden, und ein Umbau des Skripts, das ihn
    erzeugt, wäre an diesem Abend das falsche Risiko. Die Prüfung war die
    Stelle, die nicht warten konnte.

    Der Import steht **in** der Funktion und nicht im Kopf der Datei. Beide
    Module richten beim Laden einen `SIGALRM`-Wecker ein; wer sie in der
    falschen Reihenfolge lädt, hebelt die Zeitgrenze des anderen aus. Eine
    Reihenfolge, auf die man achten muss, ist eine Falle – hier gibt es sie
    gar nicht erst.
    """
    import sprechstimme

    return sprechstimme.brauchbar(stueck, audio, rate)


t0 = time.time()
gesamtdauer = 0.0
verworfen = 0
for lauf, (index, (stueck, ruhe)) in enumerate(meine, start=1):
    # Bis zu drei Anläufe. Gewürfelt wird bei jedem neu – derselbe Text nimmt
    # beim nächsten Mal einen anderen Weg, und genau das hat die zweite
    # Fassung der Folge vom 10. August bewiesen.
    for anlauf in (1, 2, 3):
        wavs, rate = sprich(stueck)
        audio = np.asarray(wavs[0])
        grund = brauchbar(stueck, audio, rate)
        if grund is None:
            break
        verworfen += 1
        melde(f"  Stück {index + 1}, Anlauf {anlauf} verworfen – {grund}")
        melde(f"    {stueck[:70]!r}")
    else:
        # Drei entgleiste Anläufe: lieber ein schiefes Stück als ein Loch.
        # Ein fehlendes Stück bricht das Zusammenfügen ab und kostet die
        # ganze Folge; ein schiefes kostet vier Sekunden.
        melde(f"::warning::Stück {index + 1} klingt auch nach drei Anläufen nicht sauber.")

    pause = np.zeros(int(rate * ruhe), dtype=audio.dtype)
    sf.write(f"podcast-folge/stueck-{index:03d}.wav", np.concatenate([audio, pause]), rate)
    gesamtdauer += len(audio) / rate
    melde(f"  Stück {index + 1} ({lauf}/{len(meine)}) – {len(audio) / rate:.1f} s")

if verworfen:
    melde(f"{verworfen} Anläufe verworfen und neu gesprochen.")

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
# Abspieler kann.
groesse = klangkette.zu_mp3(ROHFASSUNG, ZIEL, melde)
os.remove(ROHFASSUNG)

# Dieselbe Untergrenze wie beim Weg über die Schnittstelle: Was bei fünf
# Minuten Text unter 100 KB bleibt, ist keine Aufnahme, sondern eine
# Fehlermeldung im Audioformat.
if groesse < 100_000:
    melde(f"FEHLER: {groesse} Bytes sind zu wenig für {dauer / 60:.1f} Minuten.")
    sys.exit(1)
