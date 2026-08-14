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
