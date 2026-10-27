---
title: Run artifacts
nav: Artifacts
description: The files a run writes to its storage folder, how to list and open them, and how long they are kept.
order: 2
sources: [vdb-site/docs/factory.md, vdb-site/api/internal/handler/factory_runs_artifacts.go]
checked: [vdb-site@c29ffeb]
updated: 28 Oct 2026
---

Every run has a storage folder. Each step writes what it produced under a folder named for it, for example:

| Folder | Written by | Holds |
|---|---|---|
| `trigger/` | the trigger step | `run.json` (the run's starting facts) and `context.json` (the event's facts) |
| `scan/` | a scan step | `findings.json`, SARIF files, the SBOM |
| `<decision title>/` | a decision step | the decision's record |
| `crew/` | a crew step | what the crew handed back |
| `gate/` | a gate step | the gate's evidence |
| `evidence/` | outputs | `vex.openvex.json`, provenance |
| `output/` | outputs | results such as `conflicts.json` |

Artifacts are kept 400 days. Findings files hold counts and identifiers, not source code.

## Opening artifacts

The run page lists the folders under **Storage**. Panels that show an artifact, such as SARIF results, load it when they scroll into view.

| Method | Path | Returns |
|---|---|---|
| GET | `/v1/factory/runs/{id}/artifacts?prefix=scan/` | The objects under the run's folder, with size, type and when each was written |
| GET | `/v1/factory/runs/{id}/artifacts/content?key=scan/findings.json` | The object. JSON up to 2 MiB comes back directly. Anything larger, or not JSON, redirects to a link that works for 60 seconds. |
| GET | `/v1/factory/runs/{id}/evidence.zip` | The evidence pack: SBOM, provenance, decision ledger rows, gate output and pull request links |

A key outside the run's own folder is refused. None of these call GitHub.

## Related

- [Runs and steps](/runs/runs-and-steps/)
- [Trust and SLSA](/evidence/trust-and-slsa/) for exporting evidence across runs.
