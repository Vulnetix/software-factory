---
title: Holds, maintenance windows and blackouts
nav: Holds and blackouts
description: The recurring windows that hold factory work without anyone pressing a switch, what a held run looks like, and what happens to work that arrived while it was held.
order: 6
sources: [vdb-site/docs/factory.md, vdb-site/api/internal/handler/factory_engine_state.go, website/src/shared/factory-settings.ts]
checked: [vdb-site@3d23e48, website@70b0582]
updated: 28 Oct 2026
---

Four things hold factory work. Held work is never dropped: it waits, shows up on the cockpit and in Checkpoints, and starts again when the hold lifts.

| Hold | Set by | Holds |
|---|---|---|
| Pause | The cockpit's **Pause all automations** | Every trigger. Running steps finish. |
| Stop | Settings' **Stop the factory** | Every trigger. Running steps are cancelled. |
| Maintenance window | `pix.maintenance` | Every new step while the window is open. |
| Schedule blackout | `schedules.blackout` | Every new step while the window is open. |

Pause and stop are covered in [Pause, stop and resume](/control/pause-and-stop/). This page covers the windows.

## Maintenance windows

A maintenance window is a recurring time when your Pix Sandbox may be updated and restarted. While it is open the factory starts no new step. Runs that reach a step wait as `held` and continue when the window closes.

```json
[{ "days": ["sun"], "start": "02:00", "end": "04:00", "tz": "Australia/Melbourne" }]
```

It is the same value as the window on the sandbox's own page. Setting either sets both. A maintenance window uses the sandbox's own timezone.

## Schedule blackouts

A blackout is a recurring time when the factory starts no new work, such as a release freeze or a weekend. Schedule fires are counted as held, and runs that events start wait as `held` until the window ends.

```json
[{ "from": { "day": "fri", "time": "16:00" }, "to": { "day": "mon", "time": "08:00" }, "label": "release freeze" }]
```

`day` is `mon` to `sun`, and `time` is `HH:MM`. Blackouts use `schedules.tz`, the timezone for every schedule. It defaults to `UTC`, so set it to your own zone before you rely on a blackout.

> [!CAREFUL] A window does not stop work already running
> Like pause, a window stops new steps from starting. A step that started before the window opened runs to the end. Stop the factory if work in flight must end now.

## What happens to held fires

A schedule fire that arrives during a hold is counted against its trigger as a held fire. The scheduler is told the fire was held, and why: `paused`, `stopped`, `maintenance` or `blackout`. When the window ends, or the factory resumes, `schedules.missed` decides what to do:

| Value | When the hold lifts |
|---|---|
| `run_once` | One run per trigger that had held fires. The default. |
| `skip` | No run. |
| `run_all` | One run per held fire, up to 24. |

> [!WHY] Why the default is one run
> A nightly sweep held over a three-day weekend should run once on Tuesday, not three times in a row against the same code. Pick `run_all` only for schedules where each fire covers a different period.

## Seeing a hold

- The cockpit shows the factory state and whether a window is active now, with the next window and when it starts and ends.
- A held run has status `held` on the Runs page.
- The [event stream](/evidence/event-stream/) records `cron` events `held` and `released`, and `run` events `held`.

## Settings

| Setting | Default | Format |
|---|---|---|
| `pix.maintenance` | none | list of `{days, start, end, tz}`. Stored on the sandbox. |
| `schedules.blackout` | none | list of `{from: {day, time}, to: {day, time}, label}` |
| `schedules.tz` | `UTC` | IANA timezone name |
| `schedules.missed` | `run_once` | `run_once`, `skip`, `run_all` |

## Related

- [Schedules](/workflows/schedules/)
- [Pix Sandboxes](/workforce/pix-sandboxes/)
