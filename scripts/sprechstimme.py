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

#: Sekunden Sprache je Zeichen – an den bisherigen Folgen gemessen.
SEKUNDEN_JE_ZEICHEN = 1 / 14.5

#: Wie lange ein einzelnes Stück höchstens brauchen darf.
#:
#: Ohne Uhr hing ein Läufer zweiundvierzig Minuten am ersten Stück und meldete
#: dabei keine Zeile. `SIGALRM` unterbricht den Aufruf zwischen zwei
#: Erzeugungsschritten – anders als bei einem einzelnen langen C-Aufruf geht
#: das hier tatsächlich.
FRIST_JE_STUECK = int(os.environ.get("STIMME_FRIST", "180"))


def frist_fuer(stueck: str) -> int:
    """Wie lange dieses Stück brauchen darf – nach seiner Länge bemessen.

    Eine feste Frist von 180 Sekunden ist für ein volles Stück von 240 Zeichen
    richtig und für einen Satz von 48 Zeichen absurd: Der ist nach fünfzehn
    Sekunden gesprochen oder gar nicht. Gemessen an einem echten Lauf brauchten
    volle Stücke zwischen 30 und 100 Sekunden.

    Das ist keine Feinheit, sondern die Voraussetzung dafür, dass sich
    Wiederholen überhaupt lohnt. Neun Anläufe zu je 180 Sekunden sind
    siebenundzwanzig Minuten für einen Satz; neun Anläufe an einer Frist, die
    zur Länge passt, sind neun.

    Der Faktor zwölf über der erwarteten Sprechdauer ist großzügig – das
    Modell rechnet auf einem Läufer ohne Grafikkarte. Die Untergrenze von
    sechzig Sekunden fängt den Vorlauf ab, den jedes Stück hat.
    """
    erwartet = len(stueck) * SEKUNDEN_JE_ZEICHEN
    return max(60, min(FRIST_JE_STUECK, int(12 * erwartet)))


class Zeitueberschreitung(Exception):
    pass


def _wecker(signum, rahmen):  # noqa: ARG001
    raise Zeitueberschreitung()


signal.signal(signal.SIGALRM, _wecker)


#: Wie weit die Dauer eines Stücks von der erwarteten abweichen darf.
DAUER_UNTEN = 0.45
DAUER_OBEN = 2.2

#: Länge und Vorschub des Fensters, in dem der Ton untersucht wird.
#:
#: Ein Viertel einer Sekunde ist lang genug, dass ein einzelner Laut darin
#: aufgeht, und kurz genug, dass eine vier Sekunden lange Störung sechzehnmal
#: darin auftaucht statt in einem Mittelwert zu verschwinden.
FENSTER_S = 0.25
VORSCHUB_S = 0.125

#: Ab wie vielen Nulldurchgängen je Abtastwert ein Fenster nicht mehr wie
#: Sprache aussieht.
#:
#: Stimmhafte deutsche Laute liegen bei 0,02 bis 0,08, Zischlaute erreichen
#: 0,25 bis 0,5. Ein Pfeifton bei 3 kHz kommt bei 24 kHz Abtastrate auf 0,26 –
#: also mitten im Bereich der Zischlaute. Die Zahl allein trennt beides nicht;
#: was sie trennt, ist die **Dauer** (siehe `STOERUNG_MINDESTENS_S`).
ZISCHGRENZE = 0.22

#: Ab welchem Anteil am Anschlag ein Fenster als übersteuert gilt.
#:
#: Absolut gemessen, nicht mehr im Verhältnis zur Spitze des Stücks. Die alte
#: Fassung verlangte zusätzlich eine Gesamtspitze von 0,99 – damit war die
#: Prüfung bei einer Störung, die bei 0,97 lag, vollständig abgeschaltet.
UEBERSTEUERT_ANTEIL = 0.02

#: Wie laut ein Fenster sein muss, damit es überhaupt betrachtet wird.
#:
#: Anteil am lauten Teil des Stücks (90. Perzentil). Atem, Raumton und die
#: Pausen zwischen den Sätzen haben eine hohe Nulldurchgangsrate und sind
#: trotzdem in Ordnung – sie sind leise.
LAUT_ANTEIL = 0.4

#: Wie lange eine Auffälligkeit am Stück anhalten muss, damit sie zählt.
#:
#: **Das ist die eigentliche Trennlinie.** Ein Zischlaut dauert 40 bis 150
#: Millisekunden; er kann eine hohe Nulldurchgangsrate haben, aber nicht eine
#: halbe Sekunde lang. Eine entgleiste Passage dauert Sekunden.
STOERUNG_MINDESTENS_S = 0.4


def auffaellige_stellen(audio, rate: int) -> list[tuple[float, float, str]]:
    """Findet Stellen im Ton, die nicht wie gesprochene Sprache aussehen.

    Gibt je Fund Anfang und Ende in Sekunden und den Grund zurück.

    ## Warum fensterweise und nicht über das ganze Stück

    Weil der Fehler örtlich ist und die alte Prüfung global war. Am 10. August
    2026 hatte eine Podcastfolge bei 1:21 vier Sekunden Quietschen; am selben
    Tag meldete der Betreiber dieselbe Störung in der Aufnahme einer Lernseite
    bei 1:36. Beide Male lief `brauchbar` vorher darüber und sagte nichts.

    Nachgestellt: Ein dreißig Sekunden langes Stück mit vier Sekunden
    eingeklebtem Pfeifton und Rauschen kam durch. Zwei Gründe, unabhängig
    voneinander:

    1. **Die Dauer stimmte.** Vier Sekunden Unsinn *statt* vier Sekunden
       Sprache ändern an der Gesamtlänge nichts. Die Dauerprüfung fängt das
       Stück, das entgleist *und* dabei die Länge verliert – nicht das, das
       mittendrin kippt und sich wieder fängt.
    2. **Die Übersteuerungsprüfung war abgeschaltet.** Sie verlangte, dass die
       Spitze des ganzen Stücks bei mindestens 0,99 liegt. Lag die Störung bei
       0,97, wurde gar nicht erst gezählt. Und selbst darüber wäre ihr Anteil
       an dreißig Sekunden unter der Schwelle geblieben – vier Sekunden sind
       ein Achtel des Stücks, aber nur ein Bruchteil davon liegt am Anschlag.

    Ein Mittelwert über ein ganzes Stück kann eine Störung nicht finden, die
    ein Achtel davon ausmacht. Er verdünnt sie. Also wird jedes Viertel einer
    Sekunde für sich betrachtet.

    ## Woran eine Störung erkannt wird

    An drei Dingen zusammen, und das Zusammen ist wichtig:

    - **laut** – gemessen am lauten Teil des Stücks selbst. Atemgeräusch und
      Raumton zwischen den Sätzen sehen sonst aus wie Rauschen.
    - **rau** – viele Nulldurchgänge (Rauschen, Pfeifen) oder viele Werte am
      Anschlag (Quietschen).
    - **anhaltend** – mindestens eine knappe halbe Sekunde am Stück.

    Die dritte Bedingung trägt das Ganze. Ein „sch" hat dieselbe
    Nulldurchgangsrate wie ein Pfeifton; was es davon unterscheidet, ist, dass
    es nach einem Zehntel einer Sekunde vorbei ist.

    **Das sind Anzeichen, keine Beweise.** Sie fangen die Form, die dieser
    Fehler hat, und nicht jeden denkbaren. Die Antwort darauf bleibt deshalb
    ein neuer Versuch, kein Abbruch.
    """
    import numpy as np

    ton = np.asarray(audio, dtype=np.float32).reshape(-1)
    fenster = max(1, int(FENSTER_S * rate))
    vorschub = max(1, int(VORSCHUB_S * rate))
    if len(ton) < fenster:
        return []

    anfaenge = range(0, len(ton) - fenster + 1, vorschub)
    stuecke = np.stack([ton[i : i + fenster] for i in anfaenge])

    effektiv = np.sqrt(np.mean(stuecke**2, axis=1))
    # Nulldurchgänge je Abtastwert.
    rauheit = np.mean(np.abs(np.diff(np.signbit(stuecke), axis=1)), axis=1)
    anschlag = np.mean(np.abs(stuecke) >= 0.98, axis=1)

    schwelle = float(np.percentile(effektiv, 90)) * LAUT_ANTEIL
    laut = effektiv >= max(schwelle, 1e-4)

    verdaechtig = laut & ((rauheit >= ZISCHGRENZE) | (anschlag >= UEBERSTEUERT_ANTEIL))

    funde: list[tuple[float, float, str]] = []
    lauf_beginn: int | None = None
    for i, flagge in enumerate([*verdaechtig, False]):
        if flagge and lauf_beginn is None:
            lauf_beginn = i
        elif not flagge and lauf_beginn is not None:
            von = lauf_beginn * vorschub / rate
            bis = ((i - 1) * vorschub + fenster) / rate
            if bis - von >= STOERUNG_MINDESTENS_S:
                bereich = slice(lauf_beginn, i)
                grund = (
                    f"{bis - von:.1f} s rau statt gesprochen "
                    f"(Nulldurchgänge {float(np.max(rauheit[bereich])):.2f}, "
                    f"am Anschlag {float(np.max(anschlag[bereich])) * 100:.0f} %)"
                )
                funde.append((round(von, 2), round(bis, 2), grund))
            lauf_beginn = None

    return funde


def brauchbar(stueck: str, audio, rate: int) -> str | None:
    """Sagt, warum ein gesprochenes Stück unbrauchbar aussieht – oder nichts.

    Am 10. August 2026 lagen zwei Fassungen derselben Podcastfolge vor. Die
    eine hatte bei 1:21 vier Sekunden Quietschen und Rauschen, die andere war
    sauber – gleicher Text, gleiches Modell. Das Modell würfelt, und
    gelegentlich entgleist ein Stück.

    Geprüft wird zweierlei:

    - die **Dauer** gegen die Textlänge – sie fängt das Stück, das ganz
      entgleist und dabei zu lang oder zu kurz wird;
    - der **Verlauf** in Vierteln einer Sekunde – er fängt das Stück, das
      mittendrin kippt und sich wieder fängt. Warum das nötig ist, steht bei
      `auffaellige_stellen`.

    Die Frist in `Sprecher.sprich` fängt daneben das Stück, das **hängt**.
    """
    dauer = len(audio) / rate
    erwartet = len(stueck) * SEKUNDEN_JE_ZEICHEN

    if erwartet >= 1.0:
        if dauer < DAUER_UNTEN * erwartet:
            return f"zu kurz: {dauer:.1f} s statt rund {erwartet:.1f} s"
        if dauer > DAUER_OBEN * erwartet:
            return f"zu lang: {dauer:.1f} s statt rund {erwartet:.1f} s"

    funde = auffaellige_stellen(audio, rate)
    if funde:
        von, bis, grund = funde[0]
        weitere = f" (und {len(funde) - 1} weitere)" if len(funde) > 1 else ""
        return f"ab {von:.1f} s bis {bis:.1f} s: {grund}{weitere}"

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

        frist = frist_fuer(stueck)
        signal.alarm(frist)
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

            # **Ein kurzes Stück, das hängt, bekommt weitere Anläufe.**
            #
            # Im Podcastskript steht an dieser Stelle die Bemerkung, ein
            # zweiter Versuch sei wertlos – dasselbe Stück habe zweimal
            # hintereinander gehangen, es liege also am Text und nicht am
            # Zufall. Diese Schlussfolgerung war falsch, und der Beleg kam am
            # 10. August 2026 von zwei Seiten gleichzeitig:
            #
            # - Zwei Fassungen derselben Podcastfolge, eine mit vier Sekunden
            #   Quietschen, die andere sauber. Gleicher Text.
            # - Der erste Vertonungslauf der Lernseiten scheiterte an
            #   `'Versichert wird, was ruiniert, nicht was ärgert.'` – 48
            #   Zeichen, ein gewöhnlicher Satz, nichts Pathologisches.
            #
            # Das Modell würfelt. Zweimal dasselbe Ergebnis ist bei einer
            # Wahrscheinlichkeit um die Hälfte kein Beweis für Determinismus,
            # sondern ein Münzwurf, der zweimal Kopf zeigt.
            #
            # Also: bis zu vier weitere Anläufe, bevor aufgegeben wird. Sie
            # kosten im schlechtesten Fall Zeit, im besten die ganze Seite.
            if tiefe < 8:
                self.melde(
                    f"  Kurzes Stück hing – Anlauf {tiefe + 2}: {stueck[:50]!r}"
                )
                return self.sprich(stueck, tiefe + 1)

            raise RuntimeError(
                f"Ein Stück ließ sich nicht sprechen und nicht mehr teilen: {stueck[:60]!r}."
            )

        self.melde(
            f"  Stück hing nach {frist} s – geteilt in "
            f"{len(teile[0])} + {len(teile[1])} Zeichen (Ebene {tiefe + 1})."
        )
        links, rate = self.sprich(teile[0], tiefe + 1)
        rechts, _ = self.sprich(teile[1], tiefe + 1)
        return [np.concatenate([np.asarray(links[0]), np.asarray(rechts[0])])], rate


# ------------------------------------------------------------------ Selbsttest


def _probeton(dauer: float, rate: int, keim: int = 0):
    """Ein sprachähnliches Signal: Grundton mit Obertönen und Zischlauten.

    Kein Sprachmodell, nur ein Signal mit den Eigenschaften, auf die die
    Prüfung achtet – schwankende Lautstärke, ein Grundton um 110 Hz, und alle
    1,3 Sekunden ein Zischlaut von 100 Millisekunden. Gerade der Zischlaut ist
    der Punkt: Er hat dieselbe hohe Nulldurchgangsrate wie eine Störung und
    darf trotzdem nicht anschlagen.
    """
    import numpy as np

    r = np.random.default_rng(keim)
    t = np.arange(int(dauer * rate)) / rate
    huelle = 0.5 * (1 + np.sin(2 * np.pi * 3.5 * t)) * 0.35
    grund = 110 + 8 * np.sin(2 * np.pi * 0.7 * t)
    phase = 2 * np.pi * np.cumsum(grund) / rate
    ton = huelle * (np.sin(phase) + 0.5 * np.sin(3 * phase) + 0.3 * np.sin(6 * phase)) / 1.8
    for start in np.arange(0.4, max(dauer - 0.3, 0.5), 1.3):
        i0 = int(start * rate)
        i1 = min(len(ton), i0 + int(0.10 * rate))
        ton[i0:i1] = 0.30 * r.standard_normal(i1 - i0)
    return ton.astype(np.float32)


def selbsttest(melde=print) -> int:
    """Prüft die Prüfung – an nachgestellten Fällen, ohne Modell und ohne Netz.

    ## Warum es das gibt

    Weil `brauchbar` bis zum 10. August 2026 aussah, als tue sie ihre Arbeit,
    und sie nicht tat. Sie war nachweislich vorhanden, lief bei jedem Stück
    mit, schrieb nie eine Warnung – und ließ dabei zweimal eine Störung durch,
    die der Betreiber beim Hören sofort bemerkte.

    Eine Absicherung, die nie anschlägt, sieht genauso aus wie eine, die nichts
    zu beanstanden findet. Der Unterschied wird erst sichtbar, wenn man ihr
    etwas vorlegt, das sie beanstanden **muss**.

    Läuft in unter einer Sekunde und braucht nur numpy. Deshalb steht er im
    Workflow vor dem Sprechen und nicht in einer Testliste, die bei einem
    Vertonungslauf niemand ausführt.
    """
    import numpy as np

    rate = 24000
    r = np.random.default_rng(7)

    def text(dauer: float) -> str:
        return "x" * int(dauer * (1 / SEKUNDEN_JE_ZEICHEN))

    faelle: list[tuple[str, object, str, bool]] = []

    faelle.append(("saubere 30 s", _probeton(30, rate), text(30), False))
    faelle.append(("saubere 3 s", _probeton(3, rate, 5), text(3), False))
    faelle.append(("saubere 60 s", _probeton(60, rate, 9), text(60), False))

    # Die Störung vom 10. August: ein Pfeifton mit Rauschen, laut, aber knapp
    # unter Vollaussteuerung – genau der Fall, den die alte Prüfung nicht sah.
    pfeifen = _probeton(30, rate).copy()
    t4 = np.arange(int(4 * rate)) / rate
    i0 = int(20 * rate)
    pfeifen[i0 : i0 + len(t4)] = np.clip(
        0.9 * np.sin(2 * np.pi * 3100 * t4) + 0.35 * r.standard_normal(len(t4)), -0.97, 0.97
    )
    faelle.append(("4 s Pfeifton bei 0,97", pfeifen, text(30), True))

    # Dieselbe Störung am Anschlag.
    anschlag = _probeton(30, rate).copy()
    n = int(1.5 * rate)
    i0 = int(12 * rate)
    anschlag[i0 : i0 + n] = np.clip(1.6 * r.standard_normal(n), -1.0, 1.0)
    faelle.append(("1,5 s am Anschlag", anschlag, text(30), True))

    # Und ein Stück, das ganz entgleist – der Fall, den schon die Dauerprüfung
    # fing. Er steht hier, damit er beim Umbau nicht verlorengeht.
    faelle.append(("halbe Länge", _probeton(12, rate, 3), text(30), True))

    schief = 0
    for name, ton, txt, erwartet_fund in faelle:
        grund = brauchbar(txt, ton, rate)
        gefunden = grund is not None
        ok = gefunden == erwartet_fund
        if not ok:
            schief += 1
        zeichen = "OK  " if ok else "FEHL"
        melde(f"  {zeichen} {name}: {grund or 'nichts zu beanstanden'}")

    if schief:
        melde(f"::error::{schief} von {len(faelle)} Fällen falsch beurteilt.")
        return 1

    melde(f"Selbsttest der Tonprüfung: {len(faelle)} von {len(faelle)} richtig.")
    return 0


if __name__ == "__main__":
    import sys as _sys

    raise SystemExit(selbsttest() if "--selbsttest" in _sys.argv else 0)
