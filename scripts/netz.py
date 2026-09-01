"""Ein Abruf, der auch dann durchkommt, wenn der Läufer kein IPv6 hat.

## Der Fall

Läufer bei GitHub haben **kein IPv6**. Viele Quellen haben aber neben dem
A- auch ein AAAA-Eintrag, und `urllib.request.urlopen` nimmt schlicht die
erste Adresse, die `socket.getaddrinfo` zurückgibt – das ist dort die IPv6.
Der Abruf endet mit

    URLError: <urlopen error [Errno 101] Network is unreachable>

Kein Zurückfallen, kein zweiter Versuch. Die Meldung liest sich wie „die
Quelle ist weg", und genau das ist das Teure daran: Sie sagt etwas über das
Werkzeug und wird als Aussage über die Quelle gelesen.

## Wie es aufgefallen ist

Am 1. September 2026 an der **eigenen** Website. `iminvests.de` hat A und
AAAA; `quellen-holen.yml` meldete „Network is unreachable", während
`paket-bauen.yml` im selben Zeitraum mit 200 antwortete. Der Unterschied
liegt nicht am Server, sondern am Werkzeug: `curl` probiert beide
Adressfamilien (Happy Eyeballs), `urlopen` nur die erste.

Deshalb ist es dem Paketbau nie aufgefallen – und deshalb hat
`scripts/aufnahmen-nachpruefen.py` bei **jeder** Aufnahme „nicht
erreichbar" gemeldet, ohne dass je eine gefehlt hätte.

## Warum nicht gleich nur IPv4

Weil es Quellen gibt, die ausschließlich über IPv6 erreichbar sind. Ein
Läufer, der IPv6 hat, soll sie weiterhin bekommen. Der Zwang auf IPv4 ist
der **zweite** Anlauf, nicht der erste.
"""

import socket
import urllib.error
import urllib.request

_AUFLOESEN = socket.getaddrinfo

# `[Errno 101] Network is unreachable` – die einzige Ursache, für die der
# zweite Anlauf etwas ändert. Bei allem anderen (Zeitüberschreitung, 403,
# Namensauflösung) wäre er nur ein zweites Wartenmüssen.
_UNERREICHBAR = 101


def _nur_ipv4(*args, **kwargs):
    return [e for e in _AUFLOESEN(*args, **kwargs) if e[0] == socket.AF_INET]


def oeffnen(was, timeout: float = 45, melden=print):
    """Wie `urlopen`, aber mit einem zweiten Anlauf über IPv4.

    `was` ist eine Adresse oder ein fertiger `Request` – dasselbe, was
    `urlopen` nimmt. `melden` schreibt den Hinweis auf den zweiten Anlauf;
    wer ihn nicht will, übergibt `lambda _: None`.

    Der Zwang auf IPv4 gilt nur für diesen einen Aufruf: `getaddrinfo` wird
    im `finally` zurückgesetzt, auch wenn der zweite Anlauf ebenfalls
    scheitert. Ein Prozess, der danach eine reine IPv6-Quelle abruft, soll
    sie erreichen.
    """
    try:
        return urllib.request.urlopen(was, timeout=timeout)
    except urllib.error.URLError as fehler:
        if getattr(getattr(fehler, "reason", None), "errno", None) != _UNERREICHBAR:
            raise
        melden("Hinweis: IPv6 nicht erreichbar – zweiter Anlauf über IPv4.")
        socket.getaddrinfo = _nur_ipv4
        try:
            return urllib.request.urlopen(was, timeout=timeout)
        finally:
            socket.getaddrinfo = _AUFLOESEN


def _selbsttest() -> int:
    """Legt der Absicherung vor, was sie beanstanden muss – und was nicht.

    Ohne das wäre sie eine Zeile, die nie anschlägt und deshalb wie Ruhe
    aussieht: Auf einem Läufer **mit** IPv6 greift der zweite Anlauf nie,
    und niemand merkte, wenn er kaputt wäre. Läuft in Millisekunden, ohne
    Netz, vor jedem Abruf.
    """
    fehler = 0

    def pruefe(name: str, bedingung: bool) -> None:
        nonlocal fehler
        if not bedingung:
            fehler += 1
        print(f"{'OK  ' if bedingung else 'FEHL'} {name}")

    echt = urllib.request.urlopen
    unerreichbar = urllib.error.URLError(OSError(_UNERREICHBAR, "Network is unreachable"))

    # 1. Der Fall, für den es das gibt: erster Anlauf Errno 101, zweiter geht.
    versuche: list[bool] = []

    def zweimal(*_args, **_kwargs):
        versuche.append(socket.getaddrinfo is _nur_ipv4)
        if len(versuche) == 1:
            raise unerreichbar
        return "durchgekommen"

    urllib.request.urlopen = zweimal
    try:
        pruefe("nach Errno 101 kommt ein zweiter Anlauf durch", oeffnen("http://x", melden=lambda _: None) == "durchgekommen")
        pruefe("der erste Anlauf darf noch beide Adressfamilien", versuche[:1] == [False])
        pruefe("der zweite läuft über IPv4", versuche[1:] == [True])
        pruefe("danach löst wieder alles auf", socket.getaddrinfo is _AUFLOESEN)

        # 2. Ein anderer Grund darf **keinen** zweiten Anlauf auslösen –
        #    sonst wartet jede Zeitüberschreitung doppelt.
        gezaehlt = []

        def zeitueberschreitung(*_args, **_kwargs):
            gezaehlt.append(1)
            raise urllib.error.URLError(TimeoutError("timed out"))

        urllib.request.urlopen = zeitueberschreitung
        try:
            oeffnen("http://x", melden=lambda _: None)
            pruefe("eine Zeitüberschreitung wird durchgereicht", False)
        except urllib.error.URLError:
            pruefe("eine Zeitüberschreitung wird durchgereicht", True)
        pruefe("und zwar ohne zweiten Anlauf", len(gezaehlt) == 1)

        # 3. Auch wenn der zweite Anlauf scheitert, muss die Auflösung zurück.
        def immer_kaputt(*_args, **_kwargs):
            raise unerreichbar

        urllib.request.urlopen = immer_kaputt
        try:
            oeffnen("http://x", melden=lambda _: None)
        except urllib.error.URLError:
            pass
        pruefe("nach einem gescheiterten zweiten Anlauf ebenfalls", socket.getaddrinfo is _AUFLOESEN)
    finally:
        urllib.request.urlopen = echt

    print("Alle Prüfungen bestanden." if fehler == 0 else f"{fehler} Prüfung(en) fehlgeschlagen.")
    return 1 if fehler else 0


if __name__ == "__main__":
    import sys

    if "--selbsttest" in sys.argv:
        raise SystemExit(_selbsttest())
    raise SystemExit("Aufruf: python scripts/netz.py --selbsttest")
