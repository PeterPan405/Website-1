#!/usr/bin/env python3
"""Hält das Factsheet des Indexanbieters gegen `data/index-zusammensetzung.ts`.

## Warum das ein Skript ist und kein Heredoc im Workflow

Weil es sich sonst nicht prüfen lässt. Die erste Fassung stand inline in
`.github/workflows/weltindex-pruefen.yml`, und darin steckte ein Fehler, den
niemand gesehen hätte: Der Ausdruck für die Namen der größten Werte verlangte
`name: '…', anteil:` auf **einer** Zeile – Prettier bricht die Einträge aber um.
Der Wächter hätte jeden Monat gemeldet, er könne die Werte nicht ablesen, und
nach dem zweiten Mal hätte das niemand mehr gelesen.

Deshalb liegt die Logik hier, und `--selbsttest` legt ihr etwas vor, das sie
beanstanden **muss**. Dieselbe Bauart wie `scripts/sprechstimme.py`.

## Warum gewarnt und nicht rot abgebrochen wird

Die Frage ist nicht „hat sich etwas geändert?", sondern „sieht ein Besucher
deshalb etwas Falsches?". Ein Ländergewicht, das um ein Zehntel wandert, ändert
an der Aussage der Seiten nichts – „fast drei Viertel Dollar" bleibt richtig.
Erst ein deutlicher Sprung ist ein Fall zum Nachtragen.

Bei der **Rangfolge** der größten Werte ist das anders: Sie steht mit Namen auf
`/maerkte/klumpenrisiko`, und eine vertauschte Rangfolge sieht auf keiner Seite
falsch aus. Sie wird deshalb ohne Toleranz gemeldet.

## Nachtragen

`data/index-zusammensetzung.ts`, danach `npm run test` – die Prüfungen dort
rechnen Summen und Reihenfolgen nach.
"""

from __future__ import annotations

import argparse
import io
import re
import sys
import urllib.request

URL = "https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb"
DATEI = "data/index-zusammensetzung.ts"

# Ab hier gilt eine Abweichung als nachtragenswert. Darunter ist es die
# normale Bewegung zwischen zwei Monatsblättern.
SCHWELLE = 0.5

# Die Bezeichnungen im Blatt sind englisch, die in der Datei deutsch.
LAENDER = {
    "United States": "USA",
    "Japan": "Japan",
    "United Kingdom": "Großbritannien",
    "Canada": "Kanada",
    "France": "Frankreich",
    "Other": "Übrige Industrieländer",
}

BRANCHEN = {
    "Information Technology": "Informationstechnologie",
    "Financials": "Finanzwesen",
    "Industrials": "Industrie",
    "Health Care": "Gesundheitswesen",
    "Consumer Discretionary": "Zyklischer Konsum",
    "Communication Services": "Kommunikationsdienste",
    "Consumer Staples": "Basiskonsumgüter",
    "Energy": "Energie",
    "Materials": "Grundstoffe",
    "Utilities": "Versorger",
    "Real Estate": "Immobilien",
}

# Die Datei ist TypeScript; gelesen wird sie mit Ausdrücken statt mit einem
# Parser. Ein Parser für drei Feldarten wäre mehr Angriffsfläche als Nutzen.
#
# `\s*` zwischen den Feldern ist kein Schmuck: Prettier bricht längere Einträge
# um, und ein Ausdruck, der eine Zeile verlangt, findet dann gar nichts.
MUSTER_LAND = r"land: '([^']+)',\s*anteil: ([\d.]+)"
MUSTER_BRANCHE = r"branche: '([^']+)',\s*anteil: ([\d.]+)"
MUSTER_NAME = r"name: '([^']+)',\s*anteil:"


def gewichte_aus_blatt(text: str, namen: dict[str, str]) -> dict[str, float]:
    """Die Prozentwerte hinter den bekannten Bezeichnungen."""
    gefunden = {}
    for englisch, deutsch in namen.items():
        treffer = re.search(re.escape(englisch) + r"\s+([\d.]+)%", text)
        if treffer:
            gefunden[deutsch] = float(treffer.group(1))
    return gefunden


def gewichte_aus_datei(quelle: str, muster: str) -> dict[str, float]:
    return {name: float(wert) for name, wert in re.findall(muster, quelle)}


def vergleiche_gewichte(
    was: str, blatt: dict[str, float], datei: dict[str, float], gesamt: int
) -> list[str]:
    """Eine Gruppe Gewichte gegenüberstellen. Gibt die Warnzeilen zurück."""
    if not blatt:
        return [
            f"::warning::[weltindex] Im Factsheet keine {was} gefunden – "
            "vermutlich hat sich das Layout geändert. Von Hand nachsehen."
        ]

    print(f"\n{len(blatt)} von {gesamt} {was} im Blatt gefunden\n")
    warnungen = []
    for name, wert in blatt.items():
        alt = datei.get(name)
        zeichen = "=" if alt is not None and abs(alt - wert) < 0.005 else "≠"
        gezeigt = f"{alt:>8}" if alt is not None else f"{'—':>8}"
        print(f"  {zeichen} {name:24} Datei {gezeigt}   Blatt {wert:>8}")
        if alt is None or abs(alt - wert) >= SCHWELLE:
            warnungen.append(
                f"::warning::[weltindex] {name}: Datei {alt}, Blatt {wert}."
            )
    return warnungen


def vergleiche_rangfolge(text: str, quelle: str) -> list[str]:
    """Stehen die größten Werte in der Reihenfolge des Blattes?

    Verglichen wird über die Stelle des ersten Auftretens im Text. Das kommt
    ohne Annahme über das Seitenlayout aus – und dieser Lauf ist die einzige
    Stelle im Projekt, an der ein PDF gelesen wird, also die einzige, deren
    Ausgabe hier niemand vorher gesehen hat.
    """
    namen = re.findall(MUSTER_NAME, quelle)
    if not namen:
        return [
            "::warning::[weltindex] In der Datei stehen keine Einzelwerte – "
            f"der Ausdruck {MUSTER_NAME!r} greift nicht mehr."
        ]

    grossText = text.upper()
    stellen = []
    for name in namen:
        stelle = grossText.find(name.upper())
        if stelle < 0:
            return [
                f"::warning::[weltindex] „{name}“ steht nicht im Blatt – "
                "entweder ist der Wert herausgefallen oder das Layout hat sich geändert."
            ]
        stellen.append((name, stelle))

    if stellen != sorted(stellen, key=lambda eintrag: eintrag[1]):
        nach_blatt = [name for name, _ in sorted(stellen, key=lambda e: e[1])]
        return [
            "::warning::[weltindex] Die Rangfolge der größten Werte weicht ab.",
            f"             Datei: {', '.join(namen)}",
            f"             Blatt: {', '.join(nach_blatt)}",
            "             Sie steht mit Namen auf /maerkte/klumpenrisiko.",
        ]

    print(f"\n  Die Rangfolge der {len(namen)} größten Werte stimmt mit dem Blatt überein.")
    return []


def pruefe(text: str, quelle: str) -> list[str]:
    """Der ganze Vergleich. Gibt alle Warnzeilen zurück."""
    warnungen: list[str] = []
    warnungen += vergleiche_gewichte(
        "Ländern",
        gewichte_aus_blatt(text, LAENDER),
        gewichte_aus_datei(quelle, MUSTER_LAND),
        len(LAENDER),
    )
    warnungen += vergleiche_gewichte(
        "Branchen",
        gewichte_aus_blatt(text, BRANCHEN),
        gewichte_aus_datei(quelle, MUSTER_BRANCHE),
        len(BRANCHEN),
    )
    warnungen += vergleiche_rangfolge(text, quelle)
    return warnungen


# --------------------------------------------------------------- Selbsttest

# Ein Blatt und eine Datei, beide fest. Geprüft wird die **Logik**, nicht der
# gepflegte Bestand – sonst schlüge der Selbsttest fehl, sobald jemand die
# Zahlen richtig nachträgt.
PROBE_BLATT = """
TOP 10 CONSTITUENTS
  NVIDIA           4,634.31   5.18   Info Tech
  APPLE            4,535.15   5.07   Info Tech
  MICROSOFT CORP   3,278.30   3.66   Info Tech
SECTOR WEIGHTS                       COUNTRY WEIGHTS
Information Technology 28.87%        United States 72.03%   Japan 5.73%
Financials 16.81%                    France 2.44%   Other 12.78%
"""

PROBE_DATEI = """
    laender: [
      { land: 'USA', anteil: 72.03, waehrung: 'USD' },
      { land: 'Japan', anteil: 5.73, waehrung: 'JPY' },
      { land: 'Frankreich', anteil: 2.44, waehrung: 'EUR' },
      { land: 'Übrige Industrieländer', anteil: 12.78, sammelposten: true },
    ],
    groesste: [
      { name: 'NVIDIA', anteil: 5.18 },
      {
        name: 'Apple',
        anteil: 5.07,
      },
      { name: 'Microsoft', anteil: 3.66 },
    ],
    branchen: [
      { branche: 'Informationstechnologie', anteil: 28.87 },
      { branche: 'Finanzwesen', anteil: 16.81 },
    ],
"""


def selbsttest() -> int:
    """Legt dem Wächter vor, was er beanstanden muss – und was nicht."""
    fehler = 0

    def fall(titel: str, quelle: str, text: str, erwartet_warnung: bool) -> None:
        nonlocal fehler
        puffer = io.StringIO()
        alt, sys.stdout = sys.stdout, puffer
        try:
            warnungen = pruefe(text, quelle)
        finally:
            sys.stdout = alt
        gut = bool(warnungen) == erwartet_warnung
        if not gut:
            fehler += 1
        print(f"{'OK  ' if gut else 'FEHL'} {titel}")
        if not gut:
            soll = "mindestens eine Warnung" if erwartet_warnung else "keine Warnung"
            print(f"     erwartet: {soll}, bekommen: {len(warnungen)}")
            for zeile in warnungen:
                print(f"     {zeile}")

    print("Der Wächter gegen erfundenes Material\n")

    fall("Blatt und Datei stimmen überein", PROBE_DATEI, PROBE_BLATT, False)
    fall(
        "Ein Land um zwölf Punkte daneben",
        PROBE_DATEI.replace("land: 'USA', anteil: 72.03", "land: 'USA', anteil: 60.0"),
        PROBE_BLATT,
        True,
    )
    fall(
        "Eine Branche um sieben Punkte daneben",
        PROBE_DATEI.replace(
            "branche: 'Finanzwesen', anteil: 16.81",
            "branche: 'Finanzwesen', anteil: 9.81",
        ),
        PROBE_BLATT,
        True,
    )
    fall(
        "Die Rangfolge der größten Werte vertauscht",
        PROBE_DATEI.replace("name: 'NVIDIA',", "name: '@@',")
        .replace("name: 'Apple',", "name: 'NVIDIA',")
        .replace("name: '@@',", "name: 'Apple',"),
        PROBE_BLATT,
        True,
    )
    fall(
        "Ein Wert, den das Blatt nicht kennt",
        PROBE_DATEI.replace("name: 'Microsoft',", "name: 'Erfundenes AG',"),
        PROBE_BLATT,
        True,
    )
    fall(
        "Das Blatt ist unlesbar geworden",
        PROBE_DATEI,
        "Hier steht nichts, was nach einem Factsheet aussieht.",
        True,
    )

    # Und die Gegenprobe zum eigenen Aufbau: Die Ausdrücke müssen auf der
    # **echten** Datei greifen. Genau hier lag der Fehler der ersten Fassung –
    # die Werte spielen dabei keine Rolle, nur dass überhaupt etwas gefunden
    # wird.
    print("\nDie Ausdrücke gegen den echten Datenbestand\n")
    try:
        echt = open(DATEI, encoding="utf-8").read()
    except OSError as fehlgeschlagen:
        print(f"FEHL {DATEI} nicht lesbar: {fehlgeschlagen}")
        return 1

    for was, muster, mindestens in (
        ("Ländergewichte", MUSTER_LAND, 5),
        ("Branchengewichte", MUSTER_BRANCHE, 10),
        ("Namen der größten Werte", MUSTER_NAME, 10),
    ):
        anzahl = len(re.findall(muster, echt))
        gut = anzahl >= mindestens
        if not gut:
            fehler += 1
        print(f"{'OK  ' if gut else 'FEHL'} {anzahl} {was} in {DATEI} gefunden")
        if not gut:
            print(f"     erwartet: mindestens {mindestens}. Der Ausdruck {muster!r}")
            print("     greift nicht mehr – vermutlich hat sich die Schreibweise geändert.")

    print("\nAlle Prüfungen bestanden." if fehler == 0 else f"\n{fehler} fehlgeschlagen.")
    return 0 if fehler == 0 else 1


def main() -> int:
    zerleger = argparse.ArgumentParser(description=__doc__)
    zerleger.add_argument(
        "--selbsttest",
        action="store_true",
        help="Prüft die Logik gegen erfundenes Material, ohne das Blatt zu holen.",
    )
    argumente = zerleger.parse_args()

    if argumente.selbsttest:
        return selbsttest()

    from pdfminer.high_level import extract_text

    quelle = open(DATEI, encoding="utf-8").read()

    try:
        anfrage = urllib.request.Request(
            URL, headers={"User-Agent": "IM-Invests Datenabruf pm252543@gmail.com"}
        )
        with urllib.request.urlopen(anfrage, timeout=60) as antwort:
            text = extract_text(io.BytesIO(antwort.read()))
    except Exception as fehler:  # noqa: BLE001
        print(f"::warning::[weltindex] Factsheet nicht abrufbar: {fehler}")
        print("Die Datei bleibt, wie sie ist – der nächste Lauf versucht es erneut.")
        return 0

    warnungen = pruefe(text, quelle)

    print("")
    if warnungen:
        for zeile in warnungen:
            print(zeile)
        print("")
        print(f"Nachtragen in {DATEI}, danach npm run test.")
    else:
        print("Die Datei ist auf dem Stand des Blattes.")

    # Bewusst grün: Eine Abweichung ist ein Fall zum Nachtragen, kein
    # kaputter Lauf. Der Unterschied steht in AGENTS.md unter „Ein roter Lauf
    # ist ein Vorrat".
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
