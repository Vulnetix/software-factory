---
title: Headless and one-shot runs
nav: Headless runs
description: Run Belai without the TUI. One prompt and its answer, plan mode from a script, usage as JSON, answers for questions, and the flags that matter in CI.
order: 3
sources: [belai/README.md, belai/cmd/belai/main.go, belai/cmd/belai/help.go, belai/internal/headless]
checked: [belai@b5d33b6]
updated: 28 Oct 2026
---

For a single answer without the UI:

```sh
belai -prompt "what does internal/run do?"
belai -provider anthropic -model claude-sonnet-4-5 -prompt "review this diff"
belai -plan -mode plan -prompt "plan the migration to the new API"
```

`-prompt` sends one turn, prints the reply and exits. Everything else works as in the TUI: the same classifier, permission rules, guardrails and budgets.

## Flags for scripts

| Flag | Meaning |
|---|---|
| `-prompt TEXT` | One turn, then exit |
| `-mode` | `agent`, `plan`, `goal`, `code` or `auto` |
| `-plan` | Start in read-only plan mode |
| `-provider`, `-model`, `-effort` | The model |
| `-agent NAME` | Engage an agent profile |
| `-tools T,T` | Limit the tools |
| `-answers FILE` | Answers to give questions the agent asks, since nobody is there to type them |
| `-usage-json` | Print token usage as JSON when done |
| `-no-transcript` | Keep no session transcript |
| `-detect-mode` | Print the mode the classifier would pick, and exit |
| `-no-git-sync` | Do not sync the branch before turns |
| `-trust-dir` | Trust the directory first |
| `-firewall` | Route model traffic through the active AI Firewall |

With nobody at the terminal, an ask that cannot be answered is refused unless you allow it: `-allow-ask-without-tty` and the other `-allow-*` flags loosen specific gates on purpose. [CLI reference](/belai/cli-reference/) lists every flag.

> [!CAREFUL] Headless runs have nobody to ask
> A tool call the rules would ask about has no one to answer it. Decide in advance with your permission rules or `-answers`, rather than turning ask or guardrails off.

## Resuming and exporting

| Flag | Meaning |
|---|---|
| `-resume ID` (or `-r`) | Resume a session by id or prefix |
| `-continue` | Continue the most recent session here |
| `-teleport ID` | Continue a session from another host. See [Teleport](/workforce/teleport/). |
| `-export ID` | Write a session as Markdown |

## Related

- [Sessions](/belai/sessions/)
- [CLI reference](/belai/cli-reference/)
