<#
.SYNOPSIS
    Spiegelt den Ordner `wissen/` aus dem Repository in den Obsidian-Vault.

.DESCRIPTION
    Der zweite Halbschritt des Projektgedächtnisses. Der erste läuft in der
    Cloud (`ANWENDEN=1 npm run wissen`) und schreibt `wissen/` im Repository;
    dieser hier läuft auf dem Rechner, auf dem Obsidian liegt.

    Warum zweigeteilt: Eine Cloud-Sitzung erreicht nur GitHub. Sie kann den
    Vault nicht sehen, und einen Obsidian-Connector gibt es nicht – weder
    verbunden noch im Verzeichnis (nachgesehen am 29. September 2026). Der
    einzige Weg, der trägt, führt über das Repository.

.NOTES
    **Der Vorlauf ist der Regelfall.** Ohne -Anwenden wird nichts kopiert,
    sondern nur gezeigt, was passieren würde – samt dem Vault-Pfad, den das
    Skript gefunden hat.

    Das ist kein Übervorsichtigsein: Dieses Skript ist in der Umgebung, in der
    es geschrieben wurde, nicht ausführbar – dort gibt es kein Windows und
    keinen Vault. „Müsste jetzt gehen" ist unter dieser Bedingung keine
    Aussage, also gilt der Weg, der ohne die ungeprüfte Annahme auskommt: Erst
    sehen, was es täte, dann tun lassen.

.PARAMETER Vault
    Der Vault-Ordner. Ohne Angabe sucht das Skript ihn selbst.

.PARAMETER Anwenden
    Tatsächlich kopieren. Ohne diesen Schalter passiert nichts.

.EXAMPLE
    .\werkzeuge\wissen-in-vault.ps1
    Zeigt Vault, Ziel und jede Datei, die neu wäre oder sich geändert hat.

.EXAMPLE
    .\werkzeuge\wissen-in-vault.ps1 -Anwenden
    Kopiert.

.EXAMPLE
    .\werkzeuge\wissen-in-vault.ps1 -Vault "D:\Notizen\Zweitgehirn" -Anwenden
#>

[CmdletBinding()]
param(
    [string] $Vault,
    [switch] $Anwenden
)

$ErrorActionPreference = 'Stop'

# Der Ordner im Vault, in den gespiegelt wird. Alles außerhalb bleibt
# unangetastet – eigene Notizen zum Projekt gehören daneben, nicht hinein.
$Unterordner = 'Website-1'

# --------------------------------------------------------------- Quelle finden

# Relativ zum Skript, nicht zum Arbeitsverzeichnis: So lässt es sich von
# überall aufrufen, auch aus einer Verknüpfung.
$RepoWurzel = Split-Path -Parent $PSScriptRoot
$Quelle = Join-Path $RepoWurzel 'wissen'

if (-not (Test-Path -LiteralPath $Quelle)) {
    Write-Error @"
Der Ordner '$Quelle' fehlt.
Er entsteht im Repository mit:  ANWENDEN=1 npm run wissen
"@
    exit 1
}

$Notizen = @(Get-ChildItem -LiteralPath $Quelle -Filter '*.md' -File)
if ($Notizen.Count -eq 0) {
    Write-Error "In '$Quelle' liegt keine einzige Notiz. Da stimmt etwas nicht."
    exit 1
}

# ---------------------------------------------------------------- Vault finden

# Ein Vault ist ein Ordner mit einem Unterordner '.obsidian'. Das ist das
# einzige verlässliche Kennzeichen – am Namen erkennt man ihn nicht.
function Find-Vault {
    $Kandidaten = @(
        $env:OBSIDIAN_VAULT
        (Join-Path $env:USERPROFILE 'Documents\Obsidian')
        (Join-Path $env:USERPROFILE 'Obsidian')
        (Join-Path $env:USERPROFILE 'Documents')
        (Join-Path $env:USERPROFILE 'OneDrive\Dokumente')
        (Join-Path $env:USERPROFILE 'OneDrive\Documents')
        $env:USERPROFILE
    ) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

    foreach ($Ort in $Kandidaten) {
        if (Test-Path -LiteralPath (Join-Path $Ort '.obsidian')) { return $Ort }
        # Eine Ebene tiefer, aber nicht weiter: Eine Suche über die ganze
        # Platte dauert Minuten und findet am Ende auch Sicherungskopien.
        $Treffer = Get-ChildItem -LiteralPath $Ort -Directory -ErrorAction SilentlyContinue |
            Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName '.obsidian') } |
            Select-Object -First 1
        if ($Treffer) { return $Treffer.FullName }
    }
    return $null
}

if (-not $Vault) { $Vault = Find-Vault }

if (-not $Vault) {
    Write-Host 'Kein Vault gefunden.' -ForegroundColor Yellow
    Write-Host 'Gesucht wurde nach einem Ordner mit einem Unterordner .obsidian, unter:'
    Write-Host '  %OBSIDIAN_VAULT%, Dokumente\Obsidian, Obsidian, Dokumente, OneDrive, Benutzerordner'
    Write-Host ''
    Write-Host 'Pfad selbst angeben:'
    Write-Host '  .\werkzeuge\wissen-in-vault.ps1 -Vault "C:\Pfad\zum\Vault"'
    Write-Host 'Oder dauerhaft:'
    Write-Host '  setx OBSIDIAN_VAULT "C:\Pfad\zum\Vault"'
    exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $Vault '.obsidian'))) {
    Write-Host "Warnung: '$Vault' enthält keinen Ordner .obsidian." -ForegroundColor Yellow
    Write-Host 'Das ist vermutlich kein Vault. Obsidian legt ihn beim ersten Öffnen an.'
}

$Ziel = Join-Path $Vault $Unterordner

# ------------------------------------------------------------------ Vergleich

Write-Host "Quelle: $Quelle  ($($Notizen.Count) Notizen)"
Write-Host "Ziel:   $Ziel"
Write-Host ''

$Vorhanden = @{}
if (Test-Path -LiteralPath $Ziel) {
    foreach ($Datei in Get-ChildItem -LiteralPath $Ziel -Filter '*.md' -File) {
        $Vorhanden[$Datei.Name] = $Datei.FullName
    }
}

$Neu = @()
$Geaendert = @()
foreach ($Notiz in $Notizen) {
    if (-not $Vorhanden.ContainsKey($Notiz.Name)) {
        $Neu += $Notiz
        continue
    }
    $A = Get-FileHash -LiteralPath $Notiz.FullName -Algorithm SHA256
    $B = Get-FileHash -LiteralPath $Vorhanden[$Notiz.Name] -Algorithm SHA256
    if ($A.Hash -ne $B.Hash) { $Geaendert += $Notiz }
}

# Was im Ziel liegt und nicht mehr erzeugt wird.
#
# Gelöscht wird nur, was aus diesem Weg stammt – erkennbar am Feld 'quelle:'
# im Kopf der Notiz. Eine Datei ohne diesen Kopf hat jemand selbst abgelegt,
# und fremden Bestand zu löschen ist genau das, was die Regeln ausnehmen.
$Uebrig = @()
$Fremd = @()
foreach ($Name in $Vorhanden.Keys) {
    if ($Notizen.Name -contains $Name) { continue }
    $Kopf = (Get-Content -LiteralPath $Vorhanden[$Name] -TotalCount 12 -Encoding UTF8) -join "`n"
    if ($Kopf -match '(?m)^quelle: ') { $Uebrig += $Name } else { $Fremd += $Name }
}

foreach ($N in $Neu)       { Write-Host "  neu        $($N.Name)" }
foreach ($N in $Geaendert) { Write-Host "  geändert   $($N.Name)" }
foreach ($N in $Uebrig)    { Write-Host "  entfällt   $N" }
foreach ($N in $Fremd)     { Write-Host "  fremd      $N – bleibt liegen, nicht von hier" -ForegroundColor DarkGray }

if ($Neu.Count + $Geaendert.Count + $Uebrig.Count -eq 0) {
    Write-Host ''
    Write-Host 'Der Vault ist auf Stand.' -ForegroundColor Green
    exit 0
}

if (-not $Anwenden) {
    Write-Host ''
    Write-Host "$($Neu.Count) neu, $($Geaendert.Count) geändert, $($Uebrig.Count) entfallen." -ForegroundColor Yellow
    Write-Host 'Es wurde nichts kopiert. Mit -Anwenden ausführen.'
    exit 0
}

# ------------------------------------------------------------------ Kopieren

if (-not (Test-Path -LiteralPath $Ziel)) {
    New-Item -ItemType Directory -Path $Ziel -Force | Out-Null
}

foreach ($Notiz in ($Neu + $Geaendert)) {
    Copy-Item -LiteralPath $Notiz.FullName -Destination (Join-Path $Ziel $Notiz.Name) -Force
}
foreach ($Name in $Uebrig) {
    Remove-Item -LiteralPath $Vorhanden[$Name] -Force
}

Write-Host ''
Write-Host "Kopiert: $($Neu.Count + $Geaendert.Count) Notizen, $($Uebrig.Count) entfernt." -ForegroundColor Green
Write-Host "Obsidian zeigt sie unter '$Unterordner'."
