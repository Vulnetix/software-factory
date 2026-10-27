---
title: State node
description: A step that names where a run's data lives, so later steps and people can find it. An S3 object, a Postgres table or a kanban card.
order: 17
sources: [vdb-site/docs/factory.md, vdb-site/api/internal/handler/factory_workflow_graph.go]
checked: [vdb-site@c29ffeb]
updated: 28 Oct 2026
---

A state step points at data the run reads or writes. It makes the data part of the graph, so the builder, the run trace and the evidence pack all show where the run kept its state.

| Key | Values |
|---|---|
| `kind` | `s3_object`, `postgres_table`, `kanban_card` |
| `ref` | the object key, table name or card id |

`kind` is required.

| Kind | Use it for |
|---|---|
| `s3_object` | A file under the run's storage folder, such as a report or an SBOM. |
| `postgres_table` | Rows the run writes to your factory tables. |
| `kanban_card` | The card a run works on, when it is not the run's own. |

The run page lists the storage folders that hold a step's output and the rows that belong to the run, under Storage.

## Related

- [Runs and steps](/runs/runs-and-steps/)
- [Run artifacts](/runs/artifacts/)
