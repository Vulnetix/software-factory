---
title: Handoffs between agents
nav: Handoffs
description: How work passes from one agent to the next inside a crew. Claim lists and labels, success and failure moves, and the handoff map the builders draw.
order: 6
sources: [vdb-site/docs/factory.md, belai/docs/agent-profiles.md, belai/docs/kanban.md]
checked: [vdb-site@c29ffeb, belai@b5d33b6]
updated: 28 Oct 2026
---

Agents in a crew do not call each other. They hand work over through the [board](/workforce/board/): each agent claims cards from a list with certain labels, works on them, and moves them on. The next agent claims what the first one moved.

Each agent profile says:

| Field | Meaning |
|---|---|
| `claims` | The lists it takes cards from, such as `backlog` |
| `labels` | The labels a card must carry for it to claim it |
| `on_success` | Where it moves a card when it succeeds, and labels it adds, such as review with `patched` |
| `on_failure` | Where it moves a card when it fails, such as blocked with `needs-human` |
| `handoff_to` | The agents it hands to |

For example, `vuln-scout` claims cards labelled `vuln` from the backlog, and on success hands them to `patcher`. `patcher` moves them to review, where `verifier` picks them up.

A crew step's card stays in progress until the last member moves it, and that move is what finishes the step. See [Crew node](/workflows/nodes/crew/).

## The handoff map

`GET /v1/factory/handoffs` reads every agent profile and crew in your library and returns:

- each agent's claims, labels, success and failure moves, and who it hands to
- the edges between agents
- **unclaimed labels**: labels an agent adds that no agent claims. Work with such a label waits for a person.

The workflow builder draws crew edges from this map, and the agent builder shows it as "Who hands work to whom". The agent builder's checks also flag a label you add that nothing claims.

## Related

- [Agents and agent profiles](/workforce/agents/)
- [Crews](/workforce/crews/)
