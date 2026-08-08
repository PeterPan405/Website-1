"""
Die Nachbearbeitung der Sprachaufnahme – eine Stelle, zwei Aufrufer.

## Warum das ein eigenes Modul ist

Bis zum 8. August 2026 stand die Kette als Zeichenkette doppelt in
`stimme-erzeugen.py` und `stimme-zusammenfuegen.py`, mit dem Hinweis, wer
sie ändere, müsse sie an beiden Stellen ändern. Das ging, solange sie eine
Zeile war. Die Lautheit zu messen und danach zu rechnen ist keine Zeile
mehr.

Ein Import von `stimme-erzeugen.py` schied aus – das Modul lädt beim Import
das Sprachmodell und wiegt Gigabytes. Dieses hier importiert nichts außer
der Standardbibliothek und ist damit für beide Seiten billig.

## Der Fehler, aus dem diese Datei entstanden ist

Der Betreiber hat die Stimme zweimal beurteilt, und beide Male zu Recht:

1. Nach der ersten Hörprobe: „ein paar Störgeräusche im Hintergrund".
2. Nach der zweiten: „**klingt jetzt wie aus einer Dose**".

Der zweite Befund war die Antwort auf den ersten. `afftdn=nf=-28` sagt dem
Filter, der Störteppich liege bei −28 dBFS – ein sehr hoher Wert, 22 dB
über dem ffmpeg-Vorgabewert. Alles in dieser Gegend wird als Rauschen
abgezogen, und dort liegt nicht nur Störung: Zischlaute, Atem, der Nachhall
am Wortende, die oberen Obertöne.

Nachgemessen an einem Prüfsignal, Abweichung vom Rohsignal auf den
Grundton normiert:

    Band          alte Kette    neue Kette
    1k–4k            −3,5 dB      −0,4 dB
    4k–8k           −11,2 dB      −1,2 dB
    8k–12k          −11,8 dB      −1,8 dB

Elf Dezibel aus den oberen zwei Oktaven. Das ist die Dose, und sie war
hausgemacht.

Deshalb steht der Störteppich jetzt bei −45 dB, nahe der Vorgabe von −50,
und die Dämpfung bei milden 8 dB. Das nimmt gleichmäßiges Rauschen weg und
lässt die Stimme in Ruhe.

Der Hochpass ging von 80 auf 65 Hz. Einer tiefen Männerstimme sitzt der
Grundton bei 85 bis 180 Hz; bei 80 Hz schneidet man ihr das Brustregister
an. Das Grummeln des Modells liegt darunter.

## Warum die Lautheit **nicht** über `loudnorm` läuft

Das war der zweite Anlauf und der zweite Irrtum. `loudnorm` in zwei
Durchgängen mit `linear=true` sollte eine einzige feste Verstärkung
anwenden und die Dynamik unangetastet lassen. Es tut das nur, solange die
nötige Verstärkung die Spitzengrenze nicht reißt – sonst schaltet ffmpeg
**stillschweigend** auf den Regelverstärker um. Im Protokoll steht dann
`Normalization Type: Dynamic`, und wer nicht hinsieht, glaubt an seine
Einstellung.

Am Prüfsignal gemessen, Abstand zwischen lauter und leiser Passage:

    Original                     19,7 dB
    alte Kette                   18,9 dB
    zwei Durchgänge, linear=true 15,1 dB   ← schlechter als vorher
    fester Pegel + Begrenzer     19,7 dB

Also: Die Lautheit wird gemessen, daraus **eine Zahl** gerechnet und als
`volume` angewendet. Ein Begrenzer fängt nur die Spitzen ab, die dabei über
die Grenze geraten – er berührt den Verlauf der Rede nicht.

Die Folge landet damit rund anderthalb Dezibel unter den angestrebten
−16 LUFS, weil die Spitzengrenze Vorrang hat. Das ist beabsichtigt und
nicht schlechter als vorher – die alte Kette lag mit −17,7 bis −17,9 LUFS
an derselben Stelle. −16 LUFS soll die Folgen untereinander gleich laut
machen, und das leistet eine feste Verstärkung besser als jede Regelung.
Spotify und YouTube normalisieren ohnehin selbst.
"""

import json
import os
import subprocess

# Was vor der Lautheit passiert.
#
# ## Die dritte Runde: „monoton, stumpf, immer noch ein wenig wie aus der Dose“
#
# Urteil des Betreibers vom 9. August 2026, zur Fassung mit `nf=-45`. Drei
# Wörter, drei verschiedene Ursachen – und nur zwei davon sitzen hier.
#
# **„Wie aus der Dose“** ist im Kern eine Betonung um 300 bis 400 Hz. Dort
# sitzt der Klang eines Sprechers in einem kleinen, harten Raum. Das erste
# Mal kam er von der Rauschunterdrückung; was jetzt bleibt, ist die Färbung
# der Aufnahme selbst. Dagegen ein schmaler Schnitt bei 350 Hz.
#
# **„Stumpf“** ist das Gegenstück: zu wenig oben. Ein Teil davon war wieder
# `afftdn` (gemessen −1,1 dB bei 4–8 kHz), der Rest liegt am Modell. Dagegen
# eine Anhebung ab 3,5 kHz — dort sitzen die Zisch- und Reibelaute, an denen
# das Ohr Deutlichkeit festmacht.
#
# Gemessen am Prüfsignal, Verfärbung gegen die Rohaufnahme:
#
#     Band              vorher    nachher
#     1k–4k              −0,5      +1,0
#     4k–8k              −1,1      +3,9
#     8k–12k             −0,6      +4,2
#
# Rund fünf Dezibel mehr Präsenz. Die Dämpfung ging zugleich von 8 auf 6 dB
# und der Störteppich von −45 auf −48 zurück: Wer oben anhebt, hebt auch das
# Rauschen mit an, also muss davor weniger übrig bleiben.
#
# **„Monoton“** sitzt **nicht** hier. Kein Filter macht eine gleichförmige
# Betonung lebendig; das entsteht beim Sprechen. Siehe `stimme-erzeugen.py`,
# Abschnitt zu den Pausen.
FILTER = (
    "highpass=f=65,"
    "afftdn=nr=6:nf=-48,"
    # Der Kasten-Ton eines kleinen Raums. Schmal (Q 1,2), damit die
    # Bruststimme darunter unberührt bleibt.
    "equalizer=f=350:t=q:w=1.2:g=-2.5,"
    # Deutlichkeit statt Schärfe: flaches Regal ab 3,5 kHz, kein Glockenfilter.
    "treble=g=3:f=3500:width_type=q:w=0.7"
)

# −16 LUFS ist der Wert für Sprache, den beide Plattformen erwarten.
ZIEL_LUFS = -16.0

# Grenze des Begrenzers als linearer Betrag: 0,750 ≈ −2,5 dBFS.
#
# Warum nicht 0,841 (−1,5 dBFS), wo doch −1,5 dBTP das Ziel ist: Der
# Begrenzer arbeitet auf den Abtastwerten, gemessen wird aber die **echte**
# Spitze zwischen ihnen, und die Kodierung nach 44,1 kHz und MP3 hebt sie an.
#
# Der Vorhalt musste zweimal wachsen, und beide Male fiel es nur beim
# Nachmessen auf:
#
#     0,841 (−1,5 dB)   ein Prüfsignal landete bei −1,38 dBTP   zu hoch
#     0,794 (−2,0 dB)   reichte, bis die Höhen angehoben wurden
#     0,750 (−2,5 dB)   hält beide Prüfsignale (−1,84 und −2,87)
#
# Der zweite Schritt hat einen Grund, den man kennen sollte: **Wer oben
# anhebt, erzeugt steilere Flanken, und steilere Flanken haben höhere
# Zwischenwerte.** Die Präsenzanhebung ab 3,5 kHz kostete 0,5 dB Vorhalt.
# Wer am Filter dreht, misst die Spitze neu.
SPITZE = 0.750

# Nur noch für den Rückfall: die Kette von früher, in einem Durchgang.
RUECKFALL = "loudnorm=I=-16:TP=-1.5:LRA=11"


def _messen(quelle, melde):
    """Bestimmt Lautheit und Spitze der Aufnahme **nach** dem Filter.

    Gibt die Messwerte zurück oder None, wenn ffmpeg nichts Brauchbares
    liefert. `loudnorm` schreibt sein JSON nach stderr, hinter die üblichen
    Meldungen – deshalb wird von hinten nach der Klammer gesucht.
    """
    ergebnis = subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-nostats", "-i", quelle,
            "-af", f"{FILTER},{RUECKFALL}:print_format=json",
            "-f", "null", "-",
        ],
        capture_output=True,
        text=True,
    )
    if ergebnis.returncode != 0:
        melde("Die Messung der Lautheit schlug fehl.")
        return None

    text = ergebnis.stderr
    anfang = text.rfind("{")
    ende = text.rfind("}")
    if anfang < 0 or ende < anfang:
        melde("Die Messung lieferte kein JSON.")
        return None

    try:
        werte = json.loads(text[anfang : ende + 1])
    except json.JSONDecodeError:
        melde("Die Messung lieferte unlesbares JSON.")
        return None

    try:
        # `-inf` steht für Stille. Damit lässt sich nicht rechnen – und eine
        # stumme Aufnahme fängt ohnehin die Größenprüfung des Aufrufers ab.
        return float(werte["input_i"]), float(werte["input_tp"])
    except (KeyError, TypeError, ValueError):
        melde("Der Messung fehlen brauchbare Werte.")
        return None


def zu_mp3(quelle, ziel, melde=print):
    """Wandelt die rohe Aufnahme in die fertige MP3 der Folge.

    128 kbit/s mono ist der übliche Wert eines Sprach-Podcasts – mehr hört
    man bei einer einzelnen Stimme nicht.
    """
    gemessen = _messen(quelle, melde)

    if gemessen:
        lautheit, spitze = gemessen
        verstaerkung = ZIEL_LUFS - lautheit
        melde(
            f"Gemessen: {lautheit:.1f} LUFS, Spitze {spitze:.1f} dBTP "
            f"→ {verstaerkung:+.1f} dB fest."
        )
        pegel = (
            f"volume={verstaerkung:.2f}dB,"
            f"alimiter=limit={SPITZE}:attack=5:release=50:level=disabled"
        )
    else:
        melde("Rückfall auf den geregelten Weg – die Folge wird etwas flacher.")
        pegel = RUECKFALL

    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", quelle,
            "-af", f"{FILTER},{pegel}",
            "-c:a", "libmp3lame", "-b:a", "128k", "-ac", "1", "-ar", "44100",
            ziel,
        ],
        check=True,
    )

    groesse = os.path.getsize(ziel)
    melde(f"{ziel} geschrieben – {groesse / 1024 / 1024:.1f} MB.")
    return groesse
