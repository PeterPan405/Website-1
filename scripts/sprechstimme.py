"""
Die eigene Stimme, als Baustein für mehr als eine Aufgabe.

## Warum es dieses Modul gibt

`stimme-erzeugen.py` spricht die Podcastfolge, und in ihm steckt alles, was
über ein Jahr Fehlschläge gelernt wurde: die Zerlegung in Stücke, die Pausen
nach Satzzeichen, die Frist je Stück, das Teilen eines hängenden Stücks, das
Schlusszeichen als Abbruchbedingung des Modells. Jede dieser Regeln hat einen
Lauf gekostet, bevor sie dastand.

Als die Lernseiten dieselbe Stimme bekommen sollten, gab es drei
Möglichkeiten: das alles abschreiben, das Podcastskript importierbar machen,
oder den Kern herausziehen. Abschreiben verbietet sich – die Regeln würden
auseinanderlaufen, und zwar unbemerkt.

**Herausgezogen ist es hier. Eingesetzt vorerst nur vom neuen Weg.**

Der Grund ist ein Datum: Als dieses Modul entstand, lief die nächste
Podcastfolge in vier Stunden. Ein Umbau des Skripts, das sie erzeugt, hätte
die Folge riskiert, ohne dass an ihr etwas besser geworden wäre.
`stimme-erzeugen.py` wird nachgezogen, sobald eine Folge Abstand dazwischen
liegt; bis dahin stehen die Regeln zweimal da, und das ist ausdrücklich
Absicht und keine Nachlässigkeit.

Wer hier etwas ändert, sieht in `stimme-erzeugen.py` nach, ob es dort auch
steht.
"""

from __future__ import annotations

import os
import re
import signal
import time

# ---------------------------------------------------------------- Zerlegung

#: Höchstlänge eines Stücks in Zeichen – rund vierzehn Sekunden Sprache.
#:
#: 240 statt 350: Innerhalb eines Stücks spricht das Modell mehrere Sätze
#: durch, und Satzenden bekommen kaum Luft. Je kürzer die Stücke, desto öfter
#: setzt der Sprecher neu an. Das Urteil nach der ersten Hörprobe lautete
#: „klingt ein wenig heruntergerattert"; der Grund steckte genau hier.
STUECK_MAX = 240

#: Die Pausen. Nicht alle gleich lang – zwei Werte sind ein Metronom, und
#: genau das hört man als Monotonie. Die Pause hängt am Satzzeichen.
PAUSE_ABSATZ = 0.95
PAUSE_SATZ = 0.5
PAUSE_FRAGE = 0.66
PAUSE_ANKUENDIGUNG = 0.34
PAUSE_STREUUNG = 0.07


def pause_fuer(stueck: str, absatzende: bool, stelle: int) -> float:
    """Wie lange es nach diesem Stück still bleibt.

    Die Abweichung ist **nicht zufällig, sondern aus dem Text gerechnet**:
    Derselbe Text ergibt dieselbe Aufnahme. Ein `random` an dieser Stelle
    ließe zwei Läufe unterschiedlich klingen, und nichts hätte mehr einen
    Bezugspunkt.
    """
    schluss = stueck.rstrip()[-1:] if stueck.rstrip() else "."
    if absatzende:
        grund = PAUSE_ABSATZ
    elif schluss in "?!":
        grund = PAUSE_FRAGE
    elif schluss in ":–—":
        grund = PAUSE_ANKUENDIGUNG
    else:
        grund = PAUSE_SATZ

    kerbe = (len(stueck) * 7 + stelle * 13) % 11 / 10 - 0.5
    return round(grund + kerbe * 2 * PAUSE_STREUUNG, 3)


def in_stuecke(text: str) -> list[tuple[str, float]]:
    """Zerlegt in Stücke und sagt zu jedem, wie lange danach Ruhe ist.

    Zerlegt wird zuerst an **Absätzen**, dann innerhalb eines Absatzes an
    Satzgrenzen. Ein Satz, der allein länger ist als die Höchstlänge, bleibt
    ganz: Ihn mitten im Wort zu trennen wäre der einzige Fehler, den man
    später nicht mehr hört, sondern versteht.
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


def mit_schlusszeichen(text: str) -> str:
    """Sorgt dafür, dass ein Stück auf einem Satzzeichen endet.

    **Das ist keine Kosmetik, sondern die Abbruchbedingung des Modells.**
    `open-end generation` heißt: Es erzeugt Ton, bis es ein Schlusszeichen
    setzt. Ein Fetzen, der auf ein Komma endet, gibt ihm keinen Anlass dazu –
    also läuft es bis zur Frist.

    Das Komma wird ersetzt, nicht ergänzt: „hat,." spräche das Modell als
    Stocken.
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
    """Teilt ein Stück an der Sprechgrenze, die der Mitte am nächsten liegt.

    Erst ein Satzende, dann ein Komma, dann notfalls ein Leerzeichen. Mitten
    im Wort wird nie getrennt: Das hört man, und zwar sofort. Beide Hälften
    bekommen ein Schlusszeichen – ohne das wäre die Teilung ein Tausch, ein
    hängendes Stück gegen zwei, von denen eines garantiert hängt.
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


# ------------------------------------------------------------------ Sprechen

#: Wie lange ein einzelnes Stück höchstens brauchen darf.
#:
#: Ohne Uhr hing ein Läufer zweiundvierzig Minuten am ersten Stück und meldete
#: dabei keine Zeile. `SIGALRM` unterbricht den Aufruf zwischen zwei
#: Erzeugungsschritten – anders als bei einem einzelnen langen C-Aufruf geht
#: das hier tatsächlich.
FRIST_JE_STUECK = int(os.environ.get("STIMME_FRIST", "180"))


class Zeitueberschreitung(Exception):
    pass


def _wecker(signum, rahmen):  # noqa: ARG001
    raise Zeitueberschreitung()


signal.signal(signal.SIGALRM, _wecker)


#: Sekunden Sprache je Zeichen – an den bisherigen Folgen gemessen.
SEKUNDEN_JE_ZEICHEN = 1 / 14.5

#: Wie weit die Dauer eines Stücks von der erwarteten abweichen darf.
DAUER_UNTEN = 0.45
DAUER_OBEN = 2.2

#: Ab welchem Anteil übersteuerter Abtastwerte ein Stück verdächtig ist.
UEBERSTEUERT_ANTEIL = 0.005


def brauchbar(stueck: str, audio, rate: int) -> str | None:
    """Sagt, warum ein gesprochenes Stück unbrauchbar aussieht – oder nichts.

    Am 10. August 2026 lagen zwei Fassungen derselben Podcastfolge vor. Die
    eine hatte bei 1:21 vier Sekunden Quietschen und Rauschen, die andere war
    sauber – gleicher Text, gleiches Modell. Das Modell würfelt, und
    gelegentlich entgleist ein Stück.

    Die Frist in `Sprecher.sprich` fängt nur das Stück, das **hängt**. Eines,
    das schnell zurückkommt und Unsinn enthält, lief ungeprüft durch.

    Geprüft wird die Dauer gegen die Textlänge (ein entgleistes Stück ist fast
    immer deutlich zu lang oder zu kurz) und der Anteil übersteuerter
    Abtastwerte (Quietschen liegt am Anschlag, Sprache nie über eine ganze
    Passage). Anzeichen, keine Beweise – die Antwort ist ein neuer Versuch.
    """
    import numpy as np

    dauer = len(audio) / rate
    erwartet = len(stueck) * SEKUNDEN_JE_ZEICHEN

    if erwartet >= 1.0:
        if dauer < DAUER_UNTEN * erwartet:
            return f"zu kurz: {dauer:.1f} s statt rund {erwartet:.1f} s"
        if dauer > DAUER_OBEN * erwartet:
            return f"zu lang: {dauer:.1f} s statt rund {erwartet:.1f} s"

    spitze = float(np.max(np.abs(audio))) if len(audio) else 0.0
    if spitze > 0:
        anteil = float(np.mean(np.abs(audio) >= 0.999 * spitze))
        if anteil > UEBERSTEUERT_ANTEIL and spitze >= 0.99:
            return f"übersteuert: {anteil * 100:.1f} % der Abtastwerte am Anschlag"

    return None


class Sprecher:
    """Hält Modell und Stimmprofil und spricht damit Stücke.

    Das Laden kostet knapp zwei Minuten und das Stimmprofil noch einmal
    Sekunden – beides einmal je Lauf, nicht einmal je Seite. Genau dafür ist
    es eine Klasse und keine Funktion.
    """

    def __init__(self, referenz: str, wortlaut: str, repo: str, melde=print):
        import torch

        self.melde = melde
        torch.set_num_threads(os.cpu_count() or 2)

        t0 = time.time()
        from qwen_tts import Qwen3TTSModel

        # Genau die Aufrufe, die Voicebox für einen Rechner ohne Grafikkarte
        # verwendet. Selbst ausgedachte Argumente kennt die Klasse nicht.
        self.modell = Qwen3TTSModel.from_pretrained(
            repo, torch_dtype=torch.float32, low_cpu_mem_usage=False
        )
        melde(f"Modell geladen in {time.time() - t0:.0f} s.")

        t0 = time.time()
        self.prompt = self.modell.create_voice_clone_prompt(
            ref_audio=referenz,
            ref_text=open(wortlaut, encoding="utf-8").read().strip(),
            x_vector_only_mode=False,
        )
        melde(f"Stimmprofil erstellt in {time.time() - t0:.0f} s.")

    def sprich(self, stueck: str, tiefe: int = 0):
        """Spricht ein Stück. Hängt das Modell, wird geteilt statt aufgegeben.

        Ein zweiter Versuch mit demselben Text ist wertlos – dasselbe Stück
        hing schon zweimal hintereinander bis zur Frist. Es liegt am Text,
        nicht am Zufall, und dann hilft nur ein **kürzeres** Stück.
        """
        import numpy as np

        signal.alarm(FRIST_JE_STUECK)
        try:
            return self.modell.generate_voice_clone(
                text=stueck, voice_clone_prompt=self.prompt, language="German"
            )
        except Zeitueberschreitung:
            pass
        finally:
            signal.alarm(0)

        teile = haelften(stueck) if tiefe < 3 else None
        if not teile:
            geschlossen = mit_schlusszeichen(stueck)
            if geschlossen != stueck and tiefe < 4:
                self.melde(f"  Stück ohne Satzende – erneut mit Punkt: {geschlossen[:40]!r}")
                return self.sprich(geschlossen, tiefe + 1)
            raise RuntimeError(
                f"Ein Stück ließ sich nicht sprechen und nicht mehr teilen: {stueck[:60]!r}."
            )

        self.melde(
            f"  Stück hing nach {FRIST_JE_STUECK} s – geteilt in "
            f"{len(teile[0])} + {len(teile[1])} Zeichen (Ebene {tiefe + 1})."
        )
        links, rate = self.sprich(teile[0], tiefe + 1)
        rechts, _ = self.sprich(teile[1], tiefe + 1)
        return [np.concatenate([np.asarray(links[0]), np.asarray(rechts[0])])], rate
