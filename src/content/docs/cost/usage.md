---
title: Usage and spend
nav: Usage
description: Where to see what the factory and your agents used, by model, host, workflow and agent, and how Pix answers spend questions on a call.
order: 3
sources: [vdb-site/docs/factory.md, vdb-site/api/internal/handler/factory_summary_usage.go, website/src/worker/call/tools.ts]
checked: [vdb-site@c29ffeb, website@70b0582]
updated: 28 Oct 2026
---

Usage shows what was spent, over 7, 30 or 90 days. It is on the Budgets page, and the cockpit shows the headline figures.

| View | Shows |
|---|---|
| By model | Tokens per model label |
| By host | Each host's budget gauge and 7 day spend per model |
| By workflow and agent | Which workflows and agents used what. The Workforce page's **Used by workflows** filter reads the same data. |

Token and tool usage per host also comes from Belai's analytics for the same ranges. See [Analytics](/evidence/analytics/).

> [!PIX] Spend by phone
> Ask "what did I spend this month?". Pix answers with `factory_spend` for today, the last 7 or 30 days, or the month so far, including the budget pace and cost by model. "What did the factory save us?" uses `delivery_value`. Pix only reads these figures from your records; it never adds them up itself.

## API

| Method | Path |
|---|---|
| GET | `/v1/factory/budgets/usage?range=7d` (`7d`, `30d`, `90d`) |
| GET | `/v1/factory/budgets/hosts` |
| GET | `/v1/factory/workforce/usage` |

## Related

- [Budgets](/cost/budgets/)
- [Delivery](/evidence/delivery/) for what the spend produced.
