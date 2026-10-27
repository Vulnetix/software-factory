---
title: Built-in models, quota and windows
nav: Built-in models
description: Pix Smart and Pix Fast, the models your plan includes. How calls are routed across the models behind each, your allowance and its windows, and how hosts learn which models they can use.
order: 8
sources: [vdb-site/docs/pix-builtin-models.md, website/.repo/pix-builtin-routing.md, vdb-site/docs/belai-workers-ai.md, vdb-site/api/internal/handler/pix_builtin_quota.go, vdb-site/api/internal/handler/pix_builtin_window.go]
checked: [vdb-site@c29ffeb, website@70b0582]
updated: 28 Oct 2026
---

Your plan includes two model **labels**:

| Label | For |
|---|---|
| Pix Smart (`pix-smart`) | Harder work: coding, planning, review, images |
| Pix Fast (`pix-fast`) | Quick work |

You only ever see the label. Behind each, Vulnetix ranks up to five Workers AI models. Every call is routed across them by recent performance: answers, refusals and speed. If the first is struggling, the call goes to the next. Model ids never appear in your console, sessions or errors.

## Allowance and windows

Each tenant has an allowance of built-in tokens a month, and a rolling window that limits how fast it is spent. When the allowance runs out, the factory does what `onAllowanceExhausted` says: fall back to your own keys, pause, or buy a top-up. See [Model routing](/cost/model-routing/).

The factory's share of the allowance is `budget.factory_share` (75%), and `pix.reservePercent` (20%) is kept for your own sessions.

## Hosts

A host running `belai rc` is told which built-in models it may use, with each model's name, context window, maximum output and whether it takes images, so its sessions can pick Pix Smart or Pix Fast like any provider.

## Related

- [Model routing](/cost/model-routing/)
- [Usage and spend](/cost/usage/)
