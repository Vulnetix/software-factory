---
title: Knowledge
description: How agents search reference material by meaning alongside their file tools. Profile knowledge, project knowledge from Vulnetix scans, and keeping the indexes current.
order: 24
sources: [belai/docs/knowledge.md, vdb-site/api/internal/handler/belai_rc_knowledge.go]
checked: [belai@b5d33b6, vdb-site@c29ffeb]
updated: 28 Oct 2026
---

An agent that calls `Grep`, `Glob` or `Read` gets its usual answer from the files, and beside it the passages from two kinds of knowledge that resemble what it asked for:

| Knowledge | Is | Searched by |
|---|---|---|
| Profile knowledge | The documents an agent profile lists: a handbook, a style guide, runbooks, a standards folder | Workers and background agents running that profile, and a session while that agent is engaged |
| Project knowledge | The scanner output the Vulnetix tools leave in the project's `.vulnetix` directory (SARIF, CycloneDX, OpenVEX and the rest), and files you attach to a session with `@` | Any session in the project |

Everything runs inside Belai: no embedding model to download and no service to call, so it works offline.

## Keeping it current

```sh
belai agent knowledge                 # the indexes and what they hold
belai agent knowledge -index NAME     # bring a profile's index up to date first
belai agent knowledge -json
```

`/knowledge` in the TUI shows the same. Files an agent carries are added to its knowledge; see [Importing agents](/workforce/agent-import/).

## Related

- [Agents](/workforce/agents/)
- [Vulnetix scanning inside sessions](/belai/vulnetix/)
