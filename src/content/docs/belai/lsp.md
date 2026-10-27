---
title: Language servers
description: Diagnostics on the same turn as an edit, so the model can fix a syntax error at once. Supported languages, their servers and fallbacks, and the switches.
order: 14
sources: [belai/docs/lsp.md]
checked: [belai@b5d33b6]
updated: 28 Oct 2026
---

After a `Write` or `Edit`, Belai checks the edited file with a language server and hands any diagnostics back on the same tool result. There is no extra round trip, so the model can fix a syntax error at once.

| Language | Server | Fallback |
|---|---|---|
| Go | `gopls` | `gofmt -e` |
| TypeScript, JavaScript | `typescript-language-server` | `node --check` for `.js` |
| Python | `pyright-langserver`, `ruff` or `pylsp` | `python3 -m py_compile` |
| Rust | `rust-analyzer` | `rustfmt --check` |
| C, C++, Objective-C | `clangd` | `clang -fsyntax-only` |
| C# | `csharp-ls` or `omnisharp` | none |
| Java | `jdtls` | none |
| Dart, Flutter | `dart language-server` | `dart analyze` |
| Swift | `sourcekit-lsp` | `swiftc -parse` |

A server must already be installed; Belai never installs one. When none is found, the fallback runs.

## Switches

`/lsp on|off [language]` switches diagnostics for this session. In settings, `lsp.enabled` switches them overall and each language has its own key, such as `lsp.go` and `lsp.typescript`.

## Related

- [Tests and lint](/belai/tests-and-lint/)
- [Hooks](/belai/hooks/), for checks of your own after an edit.
