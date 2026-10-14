"""Macht aus einer abgerufenen Seite den Text der Quellendatei – mit Links.

Benutzt von `.github/workflows/quellen-sammeln.yml`. Selbsttest:

    python3 scripts/quellentext.py --selbsttest

Den startet auch `tests/quellentext.test.ts`, also `npm test`.

## Warum das ein eigenes Modul ist

Bis zum 14. Oktober 2026 stand diese Aufbereitung als eingebettetes Python
im Workflow. Dort ließ sie sich nicht prüfen – und sie hatte einen Fehler,
der nie auffiel, weil nichts rot wurde: **Sie warf jeden Link weg.**

`<a href="/nachricht/2152…">Ölpreis über 106 Dollar …</a>` wurde zu
„Ölpreis über 106 Dollar …" – die Schlagzeile blieb, die Adresse ging. Wer
daraus eine Meldung schrieb, konnte als Quelle nur die Übersichtsseite
angeben. Am 14. Oktober 2026 nachgezählt: **819 von 1.078 Quellenlinks** der
Website zeigten auf eine Übersicht wie `wallstreet-online.de/nachrichten`
statt auf den Artikel, in den letzten dreißig Tagen 320 von 377. Das
Briefing des Betreibers vom selben Tag verlangt „direkte Links zu den
jeweiligen Artikeln oder Originalmeldungen".

## Welche Links bleiben

Nur die, hinter denen eine Meldung steht: Linktext ab 25 Zeichen – das ist
eine Schlagzeile, kein Menüpunkt wie „Öl (Brent)" oder „Zurück" – und ein
Ziel mit mindestens zwei Pfadteilen, also ein Artikel und keine Rubrik. Die
Adresse steht in spitzen Klammern hinter dem Text:

    Ölpreis über 106 US-Dollar: Huthis treffen … ⟨https://www.wallstreet-…⟩

In Feeds stehen die Links ohnehin als Text im `<link>`-Element; dort ändert
sich nichts.

## Nicht in Menü, Kopf und Fuß

Der erste echte Lauf (14. Oktober 2026, 08:53 UTC) brachte 427 Links – und
244 davon waren Menüpunkte von EZB und Bundesbank: „Our tasks and
responsibilities ⟨…/ecb/orga/tasks/html/index.en.html⟩". Lang genug für eine
Schlagzeile, tief genug für einen Artikel, und trotzdem Navigation. Sie
kosteten das Zeichenbudget, in dem die Meldungen stehen sollten.

Links in `<nav>`, `<header>` und `<footer>` bekommen deshalb keine Adresse.
Ihr **Text** bleibt, wie er vorher war – die Aufbereitung ändert dort nichts
gegenüber dem Stand vor den Links.
"""

from __future__ import annotations

import html
import re
import sys
from urllib.parse import urljoin, urlparse

TEXT_MIN = 25
"""Ab so vielen Zeichen ist ein Linktext eine Schlagzeile und kein Menüpunkt."""

PFAD_MIN = 2
"""So viele Pfadteile hat mindestens eine Artikeladresse."""


def ist_artikeladresse(adresse: str) -> bool:
    """Ein Artikel, keine Rubrik: `http(s)`, mindestens zwei Pfadteile."""
    teile = urlparse(adresse)
    if teile.scheme not in ("http", "https"):
        return False
    return len([t for t in teile.path.split("/") if t]) >= PFAD_MIN


def _anker(basis: str):
    def ersetzen(treffer: re.Match) -> str:
        ziel = urljoin(basis, html.unescape(treffer.group(1)).strip())
        innen = treffer.group(2)
        text = html.unescape(re.sub(r"(?s)<[^>]+>", " ", innen))
        text = re.sub(r"\s+", " ", text).strip()
        if len(text) >= TEXT_MIN and ist_artikeladresse(ziel):
            return f" {text} ⟨{ziel}⟩ "
        return f" {innen} "

    return ersetzen


_RAHMEN = re.compile(r"(?is)(<(nav|header|footer)\b.*?</\2\s*>)")
_LINK = re.compile(r"""(?is)<a\b[^>]*?\bhref\s*=\s*["']([^"'#]+)["'][^>]*>(.*?)</a>""")


def zu_text(roh: str, basis: str = "") -> str:
    """HTML oder Feed zu lesbarem Text; Schlagzeilen behalten ihre Adresse."""
    ohne = re.sub(r"(?is)<(script|style|noscript|svg)\b.*?</\1>", " ", roh)
    if basis:
        # Nur außerhalb von Menü, Kopf und Fuß – Begründung im Modulkopf.
        teile = _RAHMEN.split(ohne)
        ohne = "".join(
            teil if i % 3 else _LINK.sub(_anker(basis), teil)
            for i, teil in enumerate(teile)
            if i % 3 != 2
        )
    ohne = re.sub(r"(?i)</(p|div|li|tr|h[1-6]|section|article|br|item)\s*/?>", "\n", ohne)
    ohne = re.sub(r"(?i)<!\[CDATA\[|\]\]>", " ", ohne)
    ohne = re.sub(r"(?s)<[^>]+>", " ", ohne)
    ohne = html.unescape(ohne)
    ohne = re.sub(r"[ \t\r\f\v]+", " ", ohne)
    ohne = re.sub(r"\n\s*\n\s*", "\n\n", ohne)
    return ohne.strip()


def entdoppeln(text: str) -> str:
    """Wirft jede Zeile weg, die in derselben Quelle schon dastand.

    ## Warum das lohnt

    Am 14. August 2026 nachgemessen: Von 99.526 Zeichen der Quellendatei
    waren 19 Prozent wortgleiche Wiederholungen – „Übersicht" 109-mal,
    „zurück" 106-mal, dazu Rubrikleisten und Fußzeilen, die auf jeder
    Unterseite noch einmal stehen. Das ist Menü, kein Text.

    ## Warum das nichts kostet

    Jede **verschiedene** Zeile bleibt erhalten – nachgeprüft an der echten
    Datei: 2.364 verschiedene Zeilen vorher, 2.364 nachher.

    ## Warum je Quelle und nicht über alle

    Über alle Quellen entdoppelt spart vier Prozentpunkte mehr – und
    verliert die Bestätigung: Meldet eine Schlagzeile sowohl die eine als
    auch die andere Quelle, stünde sie nur noch unter der ersten.

    ## Der Nebeneffekt

    Entdoppelt wird **vor** dem Kürzen. In dasselbe Zeichenbudget passen
    damit mehr echte Meldungen.
    """
    gesehen: set[str] = set()
    raus: list[str] = []
    leer_davor = False
    for zeile in text.split("\n"):
        gestutzt = zeile.strip()
        if not gestutzt:
            # Absatzgrenzen bleiben, aber nur einfach – sie trennen Meldungen.
            if not leer_davor:
                raus.append("")
                leer_davor = True
            continue
        leer_davor = False
        if gestutzt in gesehen:
            continue
        gesehen.add(gestutzt)
        raus.append(zeile)
    return "\n".join(raus)


# ---------------------------------------------------------------- Selbsttest


def _selbsttest() -> int:
    fehler = 0

    def pruefe(was: str, bedingung: bool, hinweis: str = "") -> None:
        nonlocal fehler
        if bedingung:
            print(f"OK   {was}")
        else:
            fehler += 1
            print(f"FEHL {was}" + (f"\n     {hinweis}" if hinweis else ""))

    basis = "https://www.wallstreet-online.de/nachrichten"

    # Der Fall vom 14. Oktober 2026, wie er in der Seite stand.
    seite = (
        '<li><a href="/nachricht/21521533-oelpreis-106-us-dollar-huthis">'
        "Ölpreis über 106 US-Dollar Huthis treffen Aramco-Zentrale</a></li>"
        '<li><a href="/rohstoffe/oelpreis-brent">Öl (Brent)</a></li>'
        '<li><a href="/nachrichten">Alle Nachrichten der Redaktion im Überblick</a></li>'
        '<li><a href="#oben">Zurück nach oben zum Seitenanfang hier</a></li>'
    )
    text = zu_text(seite, basis)
    pruefe(
        "die Schlagzeile behält ihre Adresse – absolut gemacht",
        "Huthis treffen Aramco-Zentrale ⟨https://www.wallstreet-online.de/"
        "nachricht/21521533-oelpreis-106-us-dollar-huthis⟩" in text,
        text,
    )
    pruefe("ein Menüpunkt bekommt keine", "Öl (Brent)" in text and "oelpreis-brent⟩" not in text)
    pruefe(
        "eine Rubrik auch dann nicht, wenn ihr Linktext lang ist",
        "/nachrichten⟩" not in text,
    )
    pruefe("ein Sprung innerhalb der Seite nicht", "#oben" not in text)

    # Der Fall vom ersten echten Lauf: ein Menüpunkt der EZB.
    menue = zu_text(
        '<header><nav><ul><li><a href="/ecb/orga/tasks/html/index.en.html">'
        "Our tasks and responsibilities</a></li></ul></nav></header>"
        '<main><a href="/press/pr/date/2026/html/ecb.pr261015.en.html">'
        "Monetary policy decisions of 15 October 2026</a></main>"
        '<footer><a href="/home/legal/html/index.en.html">Legal notice and privacy statement</a></footer>',
        "https://www.ecb.europa.eu/press/html/index.en.html",
    )
    pruefe(
        "ein Menüpunkt in <nav>/<header> bekommt keine Adresse, behält aber den Text",
        "Our tasks and responsibilities" in menue and "orga/tasks" not in menue,
        menue,
    )
    pruefe("ein Link im <footer> auch nicht", "legal/html" not in menue and "Legal notice" in menue)
    pruefe(
        "die Meldung daneben schon",
        "Monetary policy decisions of 15 October 2026 ⟨https://www.ecb.europa.eu/press/pr/"
        "date/2026/html/ecb.pr261015.en.html⟩" in menue,
        menue,
    )

    # Die Gegenprobe: ohne Basis wie vorher – kein Link, aber derselbe Text.
    ohne = zu_text(seite)
    pruefe("ohne Basisadresse bleibt es beim Text allein", "⟨" not in ohne and "Aramco" in ohne)

    # Ein Link mit Auszeichnung darin – Schlagzeile in <span>, mit &amp;.
    verschachtelt = zu_text(
        '<a href="https://www.tagesschau.de/wirtschaft/finanzen/anleihen-100.html">'
        "<span>US-Staatsanleihen:</span> Renditen &amp; Chancen auf Kursgewinne</a>",
        "https://www.tagesschau.de/wirtschaft",
    )
    pruefe(
        "Auszeichnung im Linktext wird Text, Entitäten werden Zeichen",
        "US-Staatsanleihen: Renditen & Chancen auf Kursgewinne ⟨https://www.tagesschau.de/"
        "wirtschaft/finanzen/anleihen-100.html⟩" in verschachtelt,
        verschachtelt,
    )

    # Ein Feed: Der Link steht als Text im <link>-Element und bleibt stehen.
    feed = zu_text(
        "<item><title>Anleihen: Hohe Renditen</title>"
        "<link>https://www.tagesschau.de/wirtschaft/finanzen/a-100.html</link>"
        "<description><![CDATA[Die Renditen sind hoch.]]></description></item>",
        "https://www.tagesschau.de/wirtschaft/index~rss2.xml",
    )
    pruefe(
        "im Feed bleibt der Link als Text, ohne CDATA-Reste",
        "https://www.tagesschau.de/wirtschaft/finanzen/a-100.html" in feed
        and "CDATA" not in feed
        and "Die Renditen sind hoch." in feed,
        feed,
    )

    pruefe("Artikel erkannt", ist_artikeladresse("https://www.onvista.de/news/2026/10-14-x"))
    pruefe("Rubrik nicht", not ist_artikeladresse("https://www.finanzen.net/nachrichten/"))
    pruefe("Startseite nicht", not ist_artikeladresse("https://www.goldreporter.de/"))
    pruefe("kein mailto", not ist_artikeladresse("mailto:redaktion@example.de/a/b"))

    pruefe(
        "entdoppeln wirft Wiederholungen weg, nicht Verschiedenes",
        entdoppeln("a\nb\na\n\n\nc") == "a\nb\n\nc",
        repr(entdoppeln("a\nb\na\n\n\nc")),
    )

    print(f"\nSelbsttest Quellentext: {'bestanden' if fehler == 0 else f'{fehler} Fehler'}.")
    return 0 if fehler == 0 else 1


if __name__ == "__main__":
    if "--selbsttest" in sys.argv:
        raise SystemExit(_selbsttest())
    raise SystemExit("Aufruf: python3 scripts/quellentext.py --selbsttest")
