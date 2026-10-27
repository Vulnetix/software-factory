---
title: Crew node
description: A step that hands work to agents on a host. How the card is written, how the host is chosen, replicas, retries, the author's brief, and what the step does when no machine can take it.
order: 13
sources: [vdb-site/docs/factory.md, vdb-site/docs/factory-engine.md, vdb-site/api/internal/handler/factory_engine_node_crew.go, vdb-site/api/internal/handler/factory_host_select.go]
checked: [vdb-site@c29ffeb]
updated: 28 Oct 2026
---

A crew step is where agents do the work. The engine writes a card on the [board](/workforce/board/), picks a host that has the repository and offers the crew or agent, and dispatches workers to it. The workers claim the card, work on it, and move it. The step finishes when the card does.

## Config

| Key | Values | Notes |
|---|---|---|
| `crew` or `agent` | a crew or agent name | A crew from your library, a built-in crew such as `belai:security`, or a worker agent such as `belai:patcher`. |
| `mode` | `goal`, `agent`, `plan`, `auto` | The Belai mode the session starts in. |
| `brief` | text, at most 2,000 characters | Your instructions for this step. See below. |
| `codeTier` | `smart`, `fast`, `vault:<entryId>` | Which model route codes. See [Model routing](/cost/model-routing/). |
| `replicas` | 1 to 8 | How many workers to start for an agent step. |
| `maxAttempts` | 1 to 10 | Retries before the line stops. Left out, `autonomy.max_attempts`. |
| `runOn` | `auto`, `pix_sandbox`, `self_hosted`, `host:<uuid>`, `label:<name>` | Where it runs. Left out, `hosts.runOn`. |
| `runOnFallback` | `none`, `auto` | What to do when the `runOn` target has no eligible host. |
| `testsPostEnd` | `off`, `session`, `goal`, `goal_plan` | When Belai runs the tests after the agent finishes. |
| `testsOnFail` | `off`, `diagnose`, `fix` | What Belai does when those tests fail. |
| `showInternalWork` | `decisions`, `security`, `all`, `hidden` | How much of the agent's internal work shows in the transcript. |

A crew step can also carry agent limits: `agentCostUsd`, `agentFinalizeAt`, `agentMaxAttempts`, `agentMaxContinuations`, `agentMaxPasses`, `agentMaxWallMinutes` and `agentMaxIterations`. Each falls back to the workflow's limit, then to the organisation's `agents.*` setting. 0 keeps the agent profile's own. See [Budgets](/cost/budgets/).

Naming a crew or agent that no library or host offers is refused with `crew_not_found`. A malformed `runOn` is refused with `runs_on_invalid`. Naming a background agent instead of a worker gives the warning `agent_not_dispatchable`.

## The brief

`brief` tells the agents what the step is for when its title does not say enough. "Go modules" names an ecosystem, not the task. The engine writes it into the card between the lines `--- Brief from the workflow author ---` and `--- End of brief ---`, followed by the facts of the event that started the run. The two are never merged, so text from an event can never pass as your instructions.

A step with a brief gets its own card. A card holds 4 KiB. If the brief and the event facts do not both fit, the facts are left out.

## How the card is written

The card is written so the right worker will claim it:

| The step names | Assignee | Labels | List |
|---|---|---|---|
| A worker agent | the agent as hosts advertise it, such as `belai:builder` | the agent's claim labels, then `factory` and `wf-<slug>` | the list the agent claims from, usually `backlog` (`review` for `belai:reviewer`) |
| A crew | `crew:<name>` | the first member's claim labels, then `factory` and `wf-<slug>` | that member's list |

The later members of a crew take the card through the crew's own handoffs. A retry puts the card back where the agent claims from.

## Choosing the host

The engine looks at the online hosts of the run's principal: the workflow's author, or for a default, the member who enabled the organisation. A host is eligible if it advertises the crew or agent and either has the repository checked out or can clone it. Pix Sandboxes never clone; they work on the repositories you added. Eligible hosts are tried in this order:

1. hosts that have the repository before hosts that would clone it
2. within each, the hosts `hosts.runOn` prefers
3. then the most free worker slots
4. then the most recently seen

A full host stays in the list, last in its class. Its dispatch is refused with the cap and the next host is tried. See [Hosts and placement](/workforce/hosts-and-placement/) for `runOn` and the eligibility page.

## Replicas

`replicas` starts several workers for one agent step in one go, up to what the host has room for. If not all fit, as many as fit start. A crew's replicas are its members' own.

## When the step finishes

Belai has no callback, so the step reads the card:

| The card | The attempt |
|---|---|
| reaches `review` or `done` | succeeds |
| reaches `blocked` | fails |
| is untouched when the dispatch is refused, expires or is stopped, or the session ends | fails |
| is never claimed within `autonomy.claim_ttl_minutes` | fails with `card_unclaimed` |

A failed attempt is retried with a backoff, up to `maxAttempts`. Then the line stops and the run fails.

At autonomy `observe`, the crew step is skipped.

## When no host can take it

If no host is eligible, the engine works out why and acts on it:

| Situation | The step |
|---|---|
| The node sets `runOnFallback: none` with an explicit target | Fails at once with `no_host`, and the run fails. The card is removed so no other host picks it up. |
| No machine has the repository, or nothing can run the work, and no fallback is set | Is skipped with `no_host_skipped`. The run carries on. |
| `runOnFallback: auto` and another host is eligible | Runs there. The dispatch event says it fell back. |
| Anything else | Waits, with the reason on the step, up to `autonomy.no_host_ttl_hours`. |

The reasons a step waits are `launching`, `repo_not_cloned`, `draining`, `profile_not_offered`, `host_offline`, `failed_relaunching` and `stopped_by_user`. When no host takes the step, the run page shows every host and why it was passed over.

> [!WHY] Why a missing repository is skipped, not waited on
> If no machine has the repository, waiting will not fix it. A default workflow that skips quietly lets the rest of the run go on. Set `runOnFallback: none` on a step that must not be skipped, and it fails loudly instead.

## Unattended sessions

Every dispatch the engine makes asks the worker to stay running until there is work, and carries `ask` from the organisation's `belai.ask_permission`. That is off by default: workflow workers run tools without stopping to ask. Guardrails still apply.

## Related

- [Crews](/workforce/crews/) and [Agents](/workforce/agents/)
- [Hosts and placement](/workforce/hosts-and-placement/)
- [Waiting for a machine](/runs/waiting-for-a-machine/)
