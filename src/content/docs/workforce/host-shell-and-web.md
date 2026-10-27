---
title: Host shell, git and web sessions
nav: Host shell and web
description: Run shell lines on a host from the session page, keep a session's branch in step with the default branch, and how web sessions edit and commit.
order: 21
sources: [belai/docs/remote-control.md, vdb-site/api/internal/handler/belai_shell.go, vdb-site/api/internal/handler/belai_git.go, vdb-site/api/internal/handler/belai_web.go]
checked: [belai@b5d33b6, vdb-site@c29ffeb]
updated: 28 Oct 2026
---

## Shell lines from the web

With `belai rc --web-shell` (on by default on a Pix Sandbox), the session page can run one shell line at a time on the host:

- **From the composer**, `!cmd` runs the line and attaches its output, after classification, to the model's next turn.
- **From the console drawer**, the output is for you only and never goes to the model.

A line runs under the same permission rules and OS sandbox as the TUI's `!cmd`, and lands in the session's transcript. Without `--web-shell`, shell lines are refused.

## Git sync

**Sync with main** on the session's git strip keeps the session's branch in step with the default branch before each turn. It is the same as `git.sync` in settings, for that session. **Re-check on GitHub** reads the pull request and its checks live, for 1 GitHub call.

A sync before a turn ends as `synced` (brought up to date), `current` (already up to date), `skipped`, `conflict` (it would conflict, so nothing was changed) or `error`.

## Web sessions

A session started from the website runs on the host exactly as if it were typed there. You can follow it, prompt it and answer its questions from the session page. See [Sessions](/runs/sessions/).

## API

| Method | Path |
|---|---|
| POST | `/v1/belai/sessions/{id}/shell` |
| PUT | `/v1/belai/sessions/{id}/git-sync` |
