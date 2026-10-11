"""Prüft das Verhalten von `sprich` in `scripts/stimme-erzeugen.py`.

Gestartet von `tests/stimme-anlaeufe.test.ts`, nicht vom Testläufer selbst –
der nimmt nur `*.test.ts`.

## Warum diese Prüfung über echten Quelltext läuft und nicht über eine Kopie

Weil eine Kopie genau den Fehler nicht gefunden hätte, um den es geht.

Am 11. Oktober 2026 fiel die Folge des Tages aus. Nicht am Maßstab, nicht an
der Stimme, nicht am Kontingent – an einem gewöhnlichen Satz:

    RuntimeError: 'Russland liefert künftig deutlich mehr Diesel an die USA.'
    ließ sich nicht sprechen und nicht mehr teilen.

57 Zeichen, Punkt am Ende. Unter der Teilungsgrenze von 80 Zeichen, also
nicht teilbar; mit Schlusszeichen, also war auch die zweite Rettung
(„erneut mit Punkt") wirkungslos – `mit_schlusszeichen` gibt ihn unverändert
zurück. Ein Ausweg, der für einen vollständigen Satz nicht greifen **kann**.

`sprechstimme.py` hatte das am 10. August 2026 schon behoben und schrieb
sogar dazu, im Podcastskript stehe noch die widerlegte Begründung. Zwei
Monate später stand sie da immer noch.

Deshalb wird hier die **ausgelieferte** Funktion ausgeführt: aus der Datei
geholt, mit einem Modell bestückt, das hängt, und befragt, wie oft sie es
versucht. Ein nachgebauter Ablauf würde bestätigen, was der Test selbst
annimmt.

`scripts/stimme-erzeugen.py` lässt sich nicht importieren – im Kopf stehen
`torch`, `numpy` und `qwen_tts`. Also werden die gebrauchten Teile über den
Syntaxbaum herausgeschnitten und einzeln ausgeführt. Was dabei an echtem
Code läuft, ist unverändert der aus der Datei; ersetzt wird nur, was außen
liegt: das Modell und die Meldezeile.
"""

from __future__ import annotations

import ast
import pathlib
import signal
import sys
import types

WURZEL = pathlib.Path(__file__).resolve().parent.parent
QUELLE = WURZEL / "scripts" / "stimme-erzeugen.py"
sys.path.insert(0, str(WURZEL / "scripts"))

fehler = 0


def pruefe(was: str, bedingung: bool, hinweis: str = "") -> None:
    global fehler
    if bedingung:
        print(f"OK   {was}")
    else:
        fehler += 1
        print(f"FEHL {was}" + (f"\n     {hinweis}" if hinweis else ""))


# --------------------------------------------------------- Der Prüfstand

GEBRAUCHT_DEFS = {"mit_schlusszeichen", "haelften", "sprich", "_wecker"}
GEBRAUCHT_WERTE = {"FRIST_JE_STUECK", "ANLAEUFE_KURZ"}


def hol_sprich(quelltext: str, modell, melde=lambda *a: None) -> dict:
    """Schneidet die gebrauchten Teile heraus und führt sie aus.

    Zurück kommt der Namensraum – darin `sprich`, wie es in der Datei steht.
    """
    baum = ast.parse(quelltext)
    behalten: list[ast.stmt] = []
    for knoten in baum.body:
        if isinstance(knoten, (ast.FunctionDef, ast.ClassDef)):
            if knoten.name in GEBRAUCHT_DEFS or knoten.name == "Zeitueberschreitung":
                behalten.append(knoten)
        elif isinstance(knoten, ast.Assign):
            ziele = {z.id for z in knoten.targets if isinstance(z, ast.Name)}
            if ziele & GEBRAUCHT_WERTE:
                behalten.append(knoten)

    raum: dict = {
        "__name__": "stimme_erzeugen_prüfstand",
        "os": __import__("os"),
        "re": __import__("re"),
        "signal": signal,
        "modell": modell,
        "prompt": object(),
        "melde": melde,
    }
    exec(compile(ast.Module(body=behalten, type_ignores=[]), str(QUELLE), "exec"), raum)
    return raum


class HaengendesModell:
    """Ein Modell, das die ersten `hängt` Anläufe in die Frist laufen lässt.

    Es wartet nicht wirklich – es wirft dieselbe Ausnahme, die der Wecker
    wirft. Der Weg durch `sprich` ist damit derselbe, die Prüfung dauert
    Millisekunden statt Minuten.
    """

    def __init__(self, fehler_klasse, haengt: int = 10_000):
        self.fehler_klasse = fehler_klasse
        self.haengt = haengt
        self.texte: list[str] = []

    def generate_voice_clone(self, text: str, voice_clone_prompt=None, language=None):
        self.texte.append(text)
        if len(self.texte) <= self.haengt:
            raise self.fehler_klasse()
        return [[0.0, 0.0, 0.0]], 24_000


def prüfstand(quelltext: str, haengt: int = 10_000):
    """Baut Namensraum und Modell so, dass beide dieselbe Ausnahme kennen."""
    vorlauf = hol_sprich(quelltext, modell=None)
    modell = HaengendesModell(vorlauf["Zeitueberschreitung"], haengt)
    raum = hol_sprich(quelltext, modell=modell)
    # Dieselbe Klasse in beiden Richtungen – sonst fängt `except` nicht.
    modell.fehler_klasse = raum["Zeitueberschreitung"]
    return raum, modell


QUELLTEXT = QUELLE.read_text(encoding="utf8")
HEUTE = "Russland liefert künftig deutlich mehr Diesel an die USA."

signal.signal(signal.SIGALRM, lambda *a: None)

# ------------------------------------------------- Der Fall vom 11. Oktober

raum, modell = prüfstand(QUELLTEXT)
anlaeufe_grenze = raum["ANLAEUFE_KURZ"]

pruefe(
    f"der gemeldete Satz hat {len(HEUTE)} Zeichen und liegt unter der Teilungsgrenze",
    len(HEUTE) < 80 and raum["haelften"](HEUTE) is None,
)
pruefe(
    "sein Schlusszeichen hat er schon – „erneut mit Punkt“ kann nicht greifen",
    raum["mit_schlusszeichen"](HEUTE) == HEUTE,
)

try:
    raum["sprich"](HEUTE)
    gescheitert = False
except RuntimeError:
    gescheitert = True

pruefe(
    f"ein hängender Satz wird {anlaeufe_grenze}-mal versucht, nicht einmal",
    len(modell.texte) == anlaeufe_grenze,
    f"Es waren {len(modell.texte)} Generierung(en). Genau so ging am\n"
    f"     11. Oktober 2026 die Folge des Tages verloren: ein Anlauf, dann\n"
    f"     RuntimeError.",
)
pruefe(
    "und erst danach aufgegeben",
    gescheitert,
    "Ohne Ton darf `sprich` nicht zurückkehren – lieber keine Folge als eine"
    " mit einem Loch.",
)
pruefe(
    "jeder Anlauf bekommt denselben Text",
    set(modell.texte) == {HEUTE},
    f"Gesprochen wurde: {sorted(set(modell.texte))!r}",
)

# -------------------------------------------- Und der Fall, auf den es ankommt

# **Das Modell würfelt.** Hängt es zweimal und spricht beim dritten Mal, muss
# die Folge zustande kommen. Das ist der Satz, den `sprechstimme.py` am
# 10. August 2026 belegt hat – und der Grund für die Anläufe.
raum, modell = prüfstand(QUELLTEXT, haengt=2)
try:
    wavs, rate = raum["sprich"](HEUTE)
    kam_durch = wavs is not None and rate == 24_000
except RuntimeError:
    kam_durch = False

pruefe(
    "hängt es zweimal und spricht beim dritten Mal, kommt die Folge zustande",
    kam_durch and len(modell.texte) == 3,
    f"Anläufe: {len(modell.texte)}, durchgekommen: {kam_durch}. Vor dem"
    " 11. Oktober 2026\n     war das der Totalverlust des Tages.",
)

# ------------------------------------------------ Der Fetzen vom 9. August

# 'Was sich bewegt hat,' – Komma am Ende, kein Halt für das Modell. Hier muss
# zuerst das Schlusszeichen kommen, nicht der nächste Würfel: Ohne
# Abbruchbedingung hängt jeder Anlauf.
raum, modell = prüfstand(QUELLTEXT)
try:
    raum["sprich"]("Was sich bewegt hat,")
except RuntimeError:
    pass

pruefe(
    "ein Fetzen ohne Satzende bekommt zuerst einen Punkt",
    "Was sich bewegt hat." in modell.texte,
    f"Versucht wurde: {modell.texte[:4]!r}",
)
pruefe(
    "und der Punkt kommt vor dem zweiten Würfel",
    modell.texte[1] == "Was sich bewegt hat."
    if len(modell.texte) > 1
    else False,
    f"Reihenfolge: {modell.texte[:3]!r}",
)

# ------------------------------------------------- Ein langes Stück wird geteilt

# Teilen bleibt der erste Weg – kürzer hilft nachweislich, und an einer
# Sprechgrenze hört man den Schnitt nicht.
lang = (
    "Russland liefert künftig deutlich mehr Diesel an die USA. Nach Angaben "
    "von Donald Trump kommen sofort mehr als dreihunderttausend Tonnen, bis "
    "Jahresende sollen insgesamt rund vier Komma acht Millionen Tonnen folgen."
)
raum, modell = prüfstand(QUELLTEXT)
try:
    raum["sprich"](lang)
except RuntimeError:
    pass

pruefe(
    "ein langes Stück wird geteilt, nicht bloß wiederholt",
    any(len(t) < len(lang) for t in modell.texte),
    "Keine Generierung war kürzer als das Ganze – dann wurde nicht geteilt.",
)
pruefe(
    "die Anläufe bleiben beschränkt – kein unbegrenztes Würfeln",
    len(modell.texte) <= 60,
    f"{len(modell.texte)} Generierungen. Mit 60 s Frist wäre das eine Stunde;"
    f"\n     der Sprechauftrag hat 45 Minuten.",
)

# ---------------------------------------------- Die Frist nach der Länge

import sprechstimme  # noqa: E402  – stdlib im Kopf, kein numpy

pruefe(
    "die Frist eines kurzen Satzes liegt unter der harten Obergrenze",
    sprechstimme.frist_fuer(HEUTE) < raum["FRIST_JE_STUECK"],
    f"frist_fuer liefert {sprechstimme.frist_fuer(HEUTE)} s,"
    f" FRIST_JE_STUECK ist {raum['FRIST_JE_STUECK']} s –"
    f"\n     ohne kürzere Frist kosten die Anläufe das Dreifache.",
)
pruefe(
    "und die Anläufe passen damit in den Sprechauftrag",
    anlaeufe_grenze * sprechstimme.frist_fuer(HEUTE) <= 10 * 60,
    f"{anlaeufe_grenze} Anläufe a {sprechstimme.frist_fuer(HEUTE)} s ="
    f" {anlaeufe_grenze * sprechstimme.frist_fuer(HEUTE) / 60:.0f} min je Stück."
    f"\n     Der Auftrag hat 45 min und braucht gemessene 25.",
)

# ------------------------------------------------------ Die Gegenprobe zum Test

# **Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.** Also bekommt
# der Prüfstand den Zustand vom 11. Oktober 2026 vorgelegt: dieselbe Datei,
# nur ohne den Rückgriff auf einen weiteren Anlauf. Er muss ihn beanstanden.
#
# Gestrichen wird über den Syntaxbaum und nicht per Textersetzung – ein
# `replace` auf den Kommentar darüber wäre still durchgelaufen und hätte
# nichts bewiesen.
class OhneAnlauf(ast.NodeTransformer):
    """Entfernt das `if anlauf < ANLAEUFE_KURZ:` aus `sprich`."""

    getroffen = 0

    def visit_If(self, knoten: ast.If):
        self.generic_visit(knoten)
        if (
            isinstance(knoten.test, ast.Compare)
            and isinstance(knoten.test.left, ast.Name)
            and knoten.test.left.id == "anlauf"
        ):
            OhneAnlauf.getroffen += 1
            return None
        return knoten


verstuemmelt = ast.fix_missing_locations(OhneAnlauf().visit(ast.parse(QUELLTEXT)))
pruefe(
    "die Gegenprobe findet den Zweig, den sie entfernen soll",
    OhneAnlauf.getroffen == 1,
    f"{OhneAnlauf.getroffen} Treffer – die Gegenprobe prüft sonst nichts.",
)

raum_alt, modell_alt = prüfstand(ast.unparse(verstuemmelt))
try:
    raum_alt["sprich"](HEUTE)
except RuntimeError:
    pass

pruefe(
    "ohne den Zweig bleibt es bei einem Anlauf – der Test merkt es",
    len(modell_alt.texte) == 1,
    f"Ohne Rückgriff waren es {len(modell_alt.texte)} Anläufe. Erwartet war"
    " einer –\n     der Zustand, der die Folge gekostet hat. Merkt der Test"
    " das nicht,\n     prüft er nicht, was er zu prüfen vorgibt.",
)

print(
    "\nAlle Prüfungen bestanden."
    if fehler == 0
    else f"\n{fehler} Prüfung(en) fehlgeschlagen."
)
sys.exit(0 if fehler == 0 else 1)
