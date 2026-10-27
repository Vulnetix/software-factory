---
title: Editors over ACP
nav: Editors (ACP)
description: Use Belai as the agent in Zed, JetBrains IDEs, Neovim, Emacs and VS Code through the Agent Client Protocol, with the same safety as the TUI.
order: 13
sources: [belai/docs/acp.md, belai/docs/acp-zed.md, belai/docs/acp-jetbrains.md, belai/docs/acp-neovim.md, belai/docs/acp-emacs.md, belai/docs/acp-vscode.md]
checked: [belai@b5d33b6]
updated: 28 Oct 2026
---

`belai acp` runs Belai as an [Agent Client Protocol](https://agentclientprotocol.com) agent on standard input and output. Editors that speak ACP can use Belai as their agent, with the same classifier, permission rules, guardrails and budgets as the TUI.

| Flag | Meaning |
|---|---|
| `-provider` | Provider. Default: as for the TUI. |
| `-model` | Model. Default: the provider's. |
| `-no-transcript` | Keep no transcript of editor sessions |

## Editor setup

| Editor | How |
|---|---|
| Zed | Add Belai as an agent server, with the command `belai acp` |
| JetBrains IDEs | Add a custom agent that runs `belai acp` |
| Neovim | An ACP client plugin, pointed at `belai acp` |
| Emacs | An ACP client package, pointed at `belai acp` |
| VS Code | An ACP extension, pointed at `belai acp` |

Sessions from an editor show in the console's Sessions list with the source `acp`.

## Related

- [Language servers](/belai/lsp/)
