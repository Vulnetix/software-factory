---
title: Pause, stop and resume
nav: Pause and stop
description: The factory's kill switch. Pause holds new work, stop also cancels running work and revokes tokens, and resume releases held work. Also covers pausing or cancelling a single run.
order: 5
sources: [vdb-site/docs/factory.md, vdb-site/docs/factory-operations.md, vdb-site/api/internal/handler/factory_state.go, vdb-site/api/internal/handler/factory_runs_actions.go]
checked: [vdb-site@3d23e48]
updated: 28 Oct 2026
---

The factory has one switch for all automation. It has three states: `running`, `paused` and `stopped`. Only owners and admins can change it.

## Pause

**Pause all automations** is on the cockpit.

- Every trigger is held and no new step starts.
- Steps already running finish.
- Schedule fires that arrive while paused are counted, not run. On resume, `schedules.missed` decides what happens to them.
- It makes no GitHub calls.

Use pause when you want the factory to stop taking on work but let what it is doing finish, for example before a release freeze.

## Stop

**Stop the factory** is in Settings. It does everything pause does, and also:

- cancels running steps
- releases the board leases held by factory runs, so the cards can be claimed again
- revokes the GitHub tokens the factory minted for forges and clones, one GitHub call each
- cancels one-shot sandbox wake schedules

Interactive Belai sessions are never touched. A session a person started in a terminal or on the session page keeps running.

> [!CAREFUL] Stop cancels work in flight
> A crew halfway through a fix loses that attempt. Its card goes back to the board and can be picked up again, but uncommitted work on the host is not kept. Use pause unless you need everything to stop now.

Both actions ask for a reason of up to 500 characters. The reason, who acted and when are shown on the cockpit and written to the [audit ledger](/evidence/audit-ledger/) as a `crew_control` entry.

## Resume

**Resume** takes the factory back to `running`, with an optional note. Held runs are queued again, and the held schedule fires are handled by `schedules.missed`:

| Value | On resume |
|---|---|
| `run_once` | One run for each trigger that had held fires. The default. |
| `skip` | No run. The held fires are discarded. |
| `run_all` | One run per held fire, up to 24. |

The response says how many fires were held and which policy was applied.

## The state on the cockpit

`GET /v1/factory/state` returns:

- the state, since when, by whom and why
- whether a maintenance window or schedule blackout is active now, and the next window
- whether the engine is on
- the [A2A blackout](/workforce/a2a-messaging/), which is a separate switch beside the kill switch

The state is cached for at most 5 seconds.

## Pausing or cancelling one run

To stop one run, not the whole factory, open it on the Runs page:

| Action | Allowed when the run is |
|---|---|
| Pause | `queued`, `running`, `waiting_approval` |
| Cancel | `queued`, `running`, `waiting_approval`, `paused`, `held` |

Cancelling withdraws the crew dispatches the run started. Trying either action from any other state is refused with `bad_state`. See [Runs and steps](/runs/runs-and-steps/) for resume and retry.

> [!PIX] Stop work by phone
> On a call, say "stop the session on payments-api" and Pix reads back exactly what it will stop before it does. Pix can stop sessions. Pausing all automations and the kill switch are on the cockpit and in Settings. See [Stopping work](/pix/stopping-work/) for all five ways to stop, from one session to destroying a sandbox.

## API

| Method | Path | Body |
|---|---|---|
| GET | `/v1/factory/state` | |
| POST | `/v1/factory/stop` | `{"mode": "pause" or "stop", "reason": "..."}` |
| POST | `/v1/factory/resume` | `{"note": "..."}` |

Asking for the state the factory is already in is refused with `409 bad_state`.

## Related

- [Holds and blackouts](/control/holds-and-blackouts/) for the windows that hold work without the switch.
- [A2A messaging](/workforce/a2a-messaging/) for the relay blackout.
