"""
Färbt das App-Icon auf den Grundton der Website.

Aufruf:  python scripts/app-icon-faerben.py
         python scripts/app-icon-faerben.py --pruefen

## Warum es dieses Skript gibt

Der Betreiber wollte am 13. August 2026 das Symbol auf dem Homescreen leicht
beige statt weiß – „mit dem gleichen Ton wie der Hintergrund von der Webseite".
Das ist keine Farbe, die man aussucht, sondern eine, die **abgeleitet** ist:
`--c-canvas` in `app/globals.css`. Ändert sie sich, muss das Icon mit.

Genau so eine Abhängigkeit verrottet still. Eine einmal von Hand umgefärbte
PNG-Datei trägt ihre Herkunft nicht in sich; in einem halben Jahr weiß niemand
mehr, warum ihr Grund `#f2ebdd` ist und dass er an einer CSS-Variablen hängt.
Deshalb steht die Umfärbung hier, liest den Ton aus dem Stylesheet und lässt
sich jederzeit wiederholen.

`tests/app-icon.test.ts` prüft das Ergebnis mit – wer `--c-canvas` ändert und
das Icon vergisst, sieht es beim nächsten `npm test`.

## Warum aus einer Quelldatei und nicht aus `app/icon.svg`

Weil beide **nicht dasselbe Zeichen** sind. `app/icon.svg` ist der Favicon:
ohne Konturen, hellere Farben, randlos bis an die Kante. Das App-Icon hat
dunklere Farben, dunkle Konturen und einen Rand. Aus der SVG zu rendern hätte
das Symbol ausgetauscht statt umgefärbt.

Die weiße Urfassung liegt deshalb als `assets/app-icon-quelle.png` daneben –
so wie `stimme-referenz.txt` neben `stimme-referenz.wav`.

## Wie umgefärbt wird, ohne das Signet anzufassen

Die Vorlage besteht aus vier Flächenfarben auf weißem Grund; alles dazwischen
ist Kantenglättung, also eine Mischung aus einer der vier und dem Weiß.

Ein Pixel wird deshalb auf die Strecke `Signetfarbe → Weiß` projiziert. Der
Anteil `t` sagt, wie viel Grund darin steckt, und nur dieser Anteil bekommt
Beige statt Weiß:

    neu = alt + t · (Beige − Weiß)

Für ein reines Signetpixel ist `t = 0` – es bleibt **auf die Einheit genau**
unverändert. Für reines Weiß ist `t = 1` – es wird genau der Grundton. Für
eine Kante liegt es dazwischen, und deshalb entsteht kein heller Saum.

Der naheliegende Weg – „ersetze Weiß durch Beige" – hätte genau diesen Saum
erzeugt: Die Kantenpixel wären weiß geblieben und lägen als hellerer Rand um
jede Figur.
"""

from __future__ import annotations

import re
import sys

QUELLE = "assets/app-icon-quelle.png"
ZIEL = "app/apple-icon.png"
STILDATEI = "app/globals.css"

#: Die vier Flächenfarben des Signets. Alles andere im Bild ist Mischung.
#:
#: Nachgezählt, nicht geraten: Sie machen zusammen 29,6 % der Pixel aus, der
#: weiße Grund 54,9 %, der Rest von 1.219 Farbwerten sind Kanten.
SIGNET = [(0x6E, 0x6E, 0x6E), (0x8B, 0x22, 0x25), (0x17, 0x29, 0x6F), (0x20, 0x54, 0x37)]

WEISS = (255, 255, 255)

#: Wie viel der Kachelbreite das Signet einnimmt.
#:
#: Die Quelldatei bringt 83,3 % mit (Kasten 15…164 auf 180 Pixeln) – das
#: Signet stößt damit fast an den Rand. Der Betreiber hat am 17. August 2026
#: den Vergleich mit dem Symbol „IM Capital" daneben verlangt, und dort ist
#: der Rand deutlich breiter.
#:
#: **Die Zahl ist am Screenshot abgeschätzt, nicht gemessen.** Sie ist absichtlich
#: eine einzelne Konstante: Wer den Rand ändern will, ändert hier eine Zahl
#: und lässt das Skript neu laufen – kein Bildbearbeitungsprogramm, keine
#: Datei, deren Maße niemand mehr nachvollziehen kann.
#:
#: Warum nicht die Quelldatei kleiner gezeichnet wird: Sie ist die Urfassung
#: in voller Auflösung. Aus ihr zu verkleinern verliert nichts; in ihr zu
#: verkleinern hieße, Rand in die Vorlage einzubacken und beim nächsten
#: Wunsch wieder von vorn anzufangen.
SIGNETANTEIL = 0.70


def grundton(stildatei: str = STILDATEI) -> tuple[int, int, int]:
    """Liest `--c-canvas` aus dem Stylesheet – die eine Quelle für den Ton.

    Genommen wird die **erste** Festlegung. Sie steht in `:root`, also im
    hellen Schema; die späteren gelten für Dunkelmodus und Druck und haben
    mit dem Homescreen nichts zu tun.
    """
    with open(stildatei, encoding="utf-8") as datei:
        treffer = re.search(r"--c-canvas:\s*#([0-9a-fA-F]{6})", datei.read())
    if not treffer:
        raise SystemExit(f"--c-canvas steht nicht in {stildatei}.")
    wert = treffer.group(1)
    return tuple(int(wert[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def faerben(quelle: str, ton: tuple[int, int, int]):
    import numpy as np
    from PIL import Image

    bild = np.asarray(Image.open(quelle).convert("RGB"), dtype=float)
    hoehe, breite, _ = bild.shape
    flach = bild.reshape(-1, 3)

    weiss = np.array(WEISS, dtype=float)
    ziel = np.array(ton, dtype=float)

    # Zu jeder Signetfarbe: Wie weit liegt das Pixel auf der Strecke zum Weiß?
    # Genommen wird die Farbe, die das Pixel am besten erklärt – also die mit
    # dem kleinsten Abstand zur Strecke.
    bestes_t = np.ones(len(flach))
    bester_rest = np.full(len(flach), np.inf)
    for farbe in SIGNET:
        anfang = np.array(farbe, dtype=float)
        richtung = weiss - anfang
        t = np.clip(((flach - anfang) @ richtung) / (richtung @ richtung), 0.0, 1.0)
        rest = np.linalg.norm(flach - (anfang + t[:, None] * richtung), axis=1)
        besser = rest < bester_rest
        bester_rest[besser] = rest[besser]
        bestes_t[besser] = t[besser]

    neu = np.clip(flach + bestes_t[:, None] * (ziel - weiss), 0, 255)
    return Image.fromarray(neu.reshape(hoehe, breite, 3).round().astype("uint8")), flach, neu


def einpassen(bild, ton: tuple[int, int, int]):
    """Setzt das Signet auf `SIGNETANTEIL` der Kachelbreite, mittig.

    Der Rand entsteht **nachträglich** und nicht durch Skalieren des ganzen
    Bildes: Gemessen wird der Kasten, in dem das Signet tatsächlich liegt,
    und nur der wird verkleinert. Sonst hinge das Ergebnis daran, wie viel
    Rand die Quelldatei zufällig schon mitbringt – und beim nächsten Austausch
    der Vorlage säße es woanders.

    Verkleinert wird mit Lanczos, nicht mit dem nächsten Nachbarn. Das Signet
    hat runde Kanten; ein Nachbarverfahren macht daraus Treppen, und die
    fallen auf einem Homescreen sofort auf.
    """
    import numpy as np
    from PIL import Image

    seite = bild.size[0]
    abstand = np.abs(np.asarray(bild).astype(int) - np.array(ton)).sum(axis=2)
    zeilen, spalten = np.nonzero(abstand > 40)
    if len(spalten) == 0:
        raise SystemExit("[icon] Kein Signet gefunden – ist die Quelldatei leer?")

    kasten = (spalten.min(), zeilen.min(), spalten.max() + 1, zeilen.max() + 1)
    breite, hoehe = kasten[2] - kasten[0], kasten[3] - kasten[1]

    """
    Das Seitenverhältnis bleibt erhalten.

    Der Kasten ist heute quadratisch (150 × 150). Ihn blind auf ein Quadrat zu
    ziehen ginge deshalb gut – bis jemand eine Vorlage einsetzt, die es nicht
    ist, und das Signet lautlos verzerrt herauskäme.
    """
    laenge = max(breite, hoehe)
    faktor = (seite * SIGNETANTEIL) / laenge
    neu = (max(1, round(breite * faktor)), max(1, round(hoehe * faktor)))

    signet = bild.crop(kasten).resize(neu, Image.LANCZOS)
    leinwand = Image.new("RGB", bild.size, ton)
    leinwand.paste(signet, ((seite - neu[0]) // 2, (bild.size[1] - neu[1]) // 2))
    return leinwand


def main() -> int:
    import numpy as np

    ton = grundton()
    bild, vorher, nachher = faerben(QUELLE, ton)
    print(f"[icon] Grundton aus {STILDATEI}: #{ton[0]:02x}{ton[1]:02x}{ton[2]:02x}")

    # Gegenprobe: Das Signet muss unangetastet bleiben. Ein Skript, das die
    # Marke umfärbt, während es den Hintergrund umfärben soll, fiele sonst
    # erst auf, wenn jemand die Icons nebeneinanderlegt.
    schief = 0
    for farbe in SIGNET:
        treffer = np.all(vorher == np.array(farbe, dtype=float), axis=1)
        if not treffer.any():
            continue
        heraus = tuple(int(x) for x in nachher[treffer][0].round())
        if heraus != farbe:
            schief += 1
            print(f"[icon] FEHL Signetfarbe {farbe} wurde zu {heraus}.")
    grund = np.all(vorher == np.array(WEISS, dtype=float), axis=1)
    heraus = tuple(int(x) for x in nachher[grund][0].round())
    if heraus != ton:
        schief += 1
        print(f"[icon] FEHL Der Grund wurde {heraus} statt {ton}.")

    if schief:
        return 1

    print(f"[icon] Signet unverändert, Grund auf #{ton[0]:02x}{ton[1]:02x}{ton[2]:02x}.")

    """
    Erst färben, dann einpassen – nicht umgekehrt.

    Die Farbprüfung oben ruht darauf, dass jedes Pixel entweder eine der vier
    Signetfarben, reines Weiß oder eine Mischung aus beidem ist. Nach dem
    Verkleinern stimmt das nicht mehr: Lanczos mischt über mehrere Pixel und
    schießt an harten Kanten sogar über den Farbraum hinaus. Die Prüfung
    „Signetfarbe unverändert" fände dann Abweichungen, die keine sind.
    """
    bild = einpassen(bild, ton)
    print(f"[icon] Signet auf {SIGNETANTEIL:.0%} der Kachelbreite eingepasst.")

    if "--pruefen" in sys.argv:
        from PIL import Image

        vorhanden = np.asarray(Image.open(ZIEL).convert("RGB"))
        if not np.array_equal(vorhanden, np.asarray(bild)):
            print(f"::error::[icon] {ZIEL} weicht ab – neu erzeugen mit:")
            print("           python scripts/app-icon-faerben.py")
            return 1
        print(f"[icon] {ZIEL} ist auf dem Stand.")
        return 0

    bild.save(ZIEL)
    print(f"[icon] {ZIEL} geschrieben.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
