<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Diese Umgebung erreicht nur GitHub

`WebFetch` und `curl` scheitern hier an jeder Adresse außerhalb von GitHub und
npm — der Egress-Proxy antwortet mit `CONNECT tunnel failed, response 403`. Das
gilt für **alles**: destatis, Eurostat, Bundesbank, EZB, Yahoo, jedes
Nachrichtenportal, sogar `example.com` und `iminvests.de` selbst.

Das ist eine Regel der Umgebung, kein Fehler. Prüfen lässt sie sich mit
`curl -sS "$HTTPS_PROXY/__agentproxy/status"`.

## Der Ausweg: ein Läufer holt es

**GitHub-Läufer haben vollen Netzzugang.** Darauf beruht das halbe Projekt schon
– Kurse, Zinsen, Quartalstermine, ESEF-Bilanzen kommen alle über einen Workflow
herein, weil sie von hier aus unerreichbar sind.

Für alles, was nur _gelesen_ werden soll, gibt es dasselbe Muster als fertiges
Werkzeug: **`.github/workflows/quellen-holen.yml`**. Er nimmt Adressen entgegen,
holt sie, entfernt das Markup und schreibt den Text ins Protokoll.

```
1. mcp__github__actions_run_trigger   method: run_workflow
                                      workflow_id: quellen-holen.yml
                                      ref: main
                                      inputs: { urls: "…", zeichen: "12000" }
2. etwa 20 Sekunden warten
3. mcp__github__actions_list          method: list_workflow_jobs
4. mcp__github__get_job_logs          return_content: true
```

Was im Protokoll steht, ist eine gelesene Quelle — mit Statuscode, Datum und
Adresse daneben. Genau das verlangt `.claude/skills/newsupdate/SKILL.md`, und
ohne diesen Umweg ist die Anforderung hier nicht erfüllbar.

**Suchergebnisse sind kein Ersatz.** `WebSearch` funktioniert und ist gut, um
Adressen zu finden — aber es liefert Zusammenfassungen fremder Seiten, keine
Seiten. Am 31. Juli 2026 kamen daraus zum Goldpreis zwei Zahlen, die einander
widersprachen; eine davon wäre ungeprüft in einen Artikel gewandert und hätte
tadellos ausgesehen.

## Warum das hier steht

Weil es zweimal übersehen wurde. Beim ersten Mal endete ein Nachrichtenlauf mit
„geht nicht, kein Netzzugang“, obwohl im selben Repository vier Workflows
stehen, die genau dieses Problem lösen. Die richtige Frage ist nicht „komme ich
an die Seite?“, sondern **„wer kommt an die Seite, und wie bekomme ich sein
Ergebnis?“**

## Nebenwirkung: `workflow_dispatch` braucht `main`

GitHub startet über `workflow_dispatch` nur Workflows, die auf der
Standardverzweigung liegen. Ein neuer Workflow auf einem Nebenzweig antwortet
mit **404**, und das sieht aus wie „gibt es nicht“ statt wie „noch nicht
gemergt“. Wer einen Workflow zum Starten von Hand braucht, muss ihn erst nach
`main` bringen — `zinsen.yml` hing genau daran.
