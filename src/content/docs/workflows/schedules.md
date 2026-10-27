---
title: Schedules
description: Cron triggers for workflows and agent schedules on hosts, in one list. Cron syntax, timezones, where each schedule runs, what happens when runs overlap, and what a missed or held fire does.
order: 23
sources: [vdb-site/docs/factory.md, vdb-site/api/internal/handler/factory_schedules.go, vdb-site/api/internal/handler/factory_cron.go, vdb-site/api/internal/handler/factory_internal.go]
checked: [vdb-site@c29ffeb]
updated: 28 Oct 2026
---

The **Schedules** tab on the Workflows page lists every schedule in one place:

- **Workflow schedules** are cron trigger nodes in published workflows, owned by the factory.
- **Agent schedules** are crons a host keeps for its own background agents. They are listed here and can be switched on or off and re-timed, but the host fires them, not the factory.

The list is ordered by next run, with disabled schedules last.

## A cron trigger

```json
{ "kind": "cron", "cron": "0 3 * * 1-5", "tz": "Australia/Melbourne", "runsOn": "aws", "overlap": "skip_if_running" }
```

### Cron syntax

Five fields: minute, hour, day of month, month, day of week. Day of week `0` and `7` are both Sunday.

| Example | Runs |
|---|---|
| `0 3 * * 1-5` | 03:00 on weekdays |
| `*/30 * * * *` | every 30 minutes |
| `0 2 * * 0` | 02:00 every Sunday |

Not accepted:

| Code | Why |
|---|---|
| `cron_invalid` | Not a valid five-field cron. |
| `cron_unsupported` | Both day of month and day of week are restricted, so "either day" is meant. The scheduler cannot express that. Also `L`, `W` and `#`. |
| `cron_granularity` | Seconds. The finest schedule is one minute. |
| `tz_invalid` | Not an IANA timezone name such as `UTC` or `Australia/Melbourne`. |

Daylight saving is handled by the scheduler, in the trigger's `tz`.

### Where it runs

| `runsOn` | Fired by | Valid for |
|---|---|---|
| `aws` | AWS EventBridge Scheduler. The default. | any workflow |
| `cloudflare` | A Cloudflare Durable Object alarm | workflows with a scan, crew, or decision on a Clef model, which is work that runs in the sandbox or on Workers AI |
| `host` | The host's own schedule | agent schedules only |
| `engine` | Nothing on a timer: the factory starts the run when the event arrives | webhook, finding, label, kanban and manual triggers. Not valid on a cron trigger. |

The builder offers only the values valid for the workflow. Anything else is refused with `runs_on_invalid`. Moving a schedule between `aws` and `cloudflare` keeps its next run time.

### When runs overlap

| `overlap` | If the previous run is still going when the schedule fires |
|---|---|
| `skip_if_running` | Skip this fire. |
| `queue` | Queue a new run behind it. |
| `cancel_previous` | Cancel the running one and start fresh. |

## Sync state

Writing a schedule and creating it in the scheduler are two steps. Each workflow schedule shows a state:

| State | Meaning |
|---|---|
| `synced` | The scheduler has it. |
| `pending` | Written, scheduler call in progress. |
| `error` | The scheduler call failed. The error is shown, and a recovery job retries. |

## Editing schedules

On the Schedules tab you can add, change, pause and delete schedules.

- **Adding or re-timing** a workflow schedule changes its trigger node and publishes a new version of the workflow, so the graph stays the one source of truth. It is refused with `bad_state` if the workflow has an unpublished draft with other changes. Publish or discard it first, so a schedule edit never publishes someone else's work.
- **Pausing** (switching `enabled` off) changes only the schedule, not the workflow version.
- **Deleting** publishes a version without the trigger node and removes it from the scheduler.
- For **agent schedules**, only `enabled` and `cron` can be changed here.

## Holds and missed fires

The factory never polls a clock to decide what is due. The scheduler calls the factory's internal trigger endpoint with a signed request. If the factory is paused or stopped, or a maintenance window or blackout is open, the fire is counted as held and nothing runs yet. When the hold lifts, `schedules.missed` decides: one run (`run_once`, the default), none (`skip`), or one per held fire up to 24 (`run_all`). See [Holds and blackouts](/control/holds-and-blackouts/).

A fire that is not due yet, a duplicate, a disabled schedule, or an overlap that `skip_if_running` skips is ignored.

## API

| Method | Path | Notes |
|---|---|---|
| GET | `/v1/factory/schedules?kind=&host=&workflow=&runsOn=&enabled=` | Up to 500, not paged. Includes the tenant's timezone and blackouts. |
| POST | `/v1/factory/schedules` | `{kind: "workflow", workflowId, nodeId, cron, tz, runsOn, overlap}` |
| PATCH | `/v1/factory/schedules/{id}` | Any of `enabled`, `cron`, `tz`, `runsOn`, `overlap` |
| DELETE | `/v1/factory/schedules/{id}` | |

Workflow schedule ids look like `trg_5`. Agent schedule ids look like `host_<hostId>_<sid>`. Hosts manage their own agent schedules at `/v1/belai/hosts/{hostId}/schedules`. See [Host schedules](/workforce/host-schedules/).

Schedulers fire runs at `POST /v1/factory/internal/trigger`, outside the signed-in API. The credential is a signed request body and an internal key header, not a console session. You do not call it yourself.
