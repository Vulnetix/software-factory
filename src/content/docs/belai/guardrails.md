---
title: Guardrails, classifier, sandbox and trust
nav: Guardrails
description: How Belai keeps a model from acting on text it should not trust. Sealed delimiters, sanitisation, the security classifier, permission rules, the OS sandbox, trusted directories, and the switches that loosen each on purpose.
order: 9
sources: [belai/README.md, belai/docs/role-manager.md, belai/docs/sanitization.md, belai/docs/sandbox.md, belai/docs/nonce-endpoint-spec.md, belai/docs/jev-jobs.md, belai/cmd/belai/help.go]
checked: [belai@b5d33b6]
updated: 28 Oct 2026
---

Belai is built so that a model cannot be steered by text it reads: a web page, a file in the repository, a tool's output, a message from another agent. Several layers do this.

## Sealed delimiters

Every block Belai sends a model (its instructions, the agent profile, the tools, your prompt, a tool result) is fenced with a delimiter that carries a nonce and an integrity hash. Untrusted text can never enter the instruction blocks, and text that tries to forge a delimiter is refused.

## Sanitisation

Belai cleans text with deterministic code, one rule set per destination: text for a model, a terminal line, a file path, a URL, a shell command. No model is asked whether a value is safe. Control characters, terminal escapes, bidirectional overrides and invisible characters are removed or refused.

## The security classifier

The Role Manager classifies untrusted content (your prompt, and tool results from the shell, the web and file reads) before the model acts on it. It answers with a single verdict. The default build embeds the first-stage classifier, so this works with no provider configured. A second stage can run on Jev or Clef.

| Flag | Meaning |
|---|---|
| `-classifier-kind`, `-classifier-provider`, `-classifier-model`, `-classifier-effort` | Choose the classifier |

## Permission rules and ask

Every tool call goes through your permission rules: allow, ask or deny by tool and pattern. `/permissions` edits them. With **ask** on (`f4`), a call the rules would ask about waits for you. With ask off, it is decided by the rules, the classifier and the sandbox.

## Guardrails

**Guardrails** (`f3`) are the posture gates on prompts and results. Each gate can enforce, warn or be ignored. A worker can never run with guardrails off, and neither can remote control.

## The OS sandbox

A command can reach anything your account can, so Belai runs commands inside an operating-system boundary: only the workspace, a private `/tmp` and the usual tool caches are writable, Belai's own state is hidden, and the network can be switched off. `/sandbox` shows the sandbox's status and policy.

## Trusted directories

Belai asks the first time you open a directory whether to trust it. A repository cannot trust itself. `/trusted` manages the list; remote control offers only trusted directories. `-trust-dir` trusts the current directory from the command line.

## Loosening on purpose

Some flags turn a gate off for one run. Each is named for what it does:

| Flag | Allows |
|---|---|
| `-dangerously-yolo-everything` | Everything below, at once |
| `-allow-unsafe-prompt`, `-allow-malformed-prompt` | A prompt the classifier or parser refused |
| `-allow-unsafe-tool-result`, `-allow-malformed-tool-result` | A tool result the classifier or parser refused |
| `-allow-unpermitted-tools` | Tool calls the permission rules deny |
| `-allow-ask-without-tty` | Asks when nobody is at the terminal |
| `-allow-invalid-skills`, `-allow-invalid-hooks` | Skills or hooks that failed validation |
| `-tool-call-mismatch` | What to do when a model calls a tool it was not offered |
| `-guardrails`, `-ask-permission` | Start with guardrails or ask set |

`/yolo` turns guardrails and ask off together in the TUI.

> [!CAREFUL] These flags remove protections
> Use them only in a throwaway sandbox. A factory worker can never turn guardrails off, and a web session can only do so if its host allowed it with `--web-allow-guardrails-off`.

## Jev jobs

Jev can also judge tool calls and edits as they happen (`jev.jobs.tools`, `jev.jobs.edits`), blocking above `jev.thresholds.block` (0.90 by default) and flagging above `jev.thresholds.flag` (0.60).

## Related

- [AI Firewall](/evidence/firewalls/)
- [Questions and permissions](/workforce/questions-and-permissions/)
