---
title: Repository profiles
description: What the factory knows a repository is built with (package managers, test runners, CI, artifact types and languages), and how a template picks its variant from that profile.
order: 2
sources: [vdb-site/api/internal/handler/factory_repo_profile.go, vdb-site/docs/factory.md]
checked: [vdb-site@3d23e48]
updated: 28 Oct 2026
---

Every repository the factory can see has a **profile**: a short description of how it is built. A workflow made from a template uses the profile to pick its variant when it runs, for example npm or pnpm, vitest or pytest. You install one workflow, not one per toolchain.

## What a profile holds

| Field | Example values |
|---|---|
| Package managers | npm, pnpm, yarn, bun, poetry, uv, pip, pipenv, go, gradle, maven, cargo, bundler, composer, nuget, swiftpm |
| Test runners | jest, vitest, pytest, rspec, phpunit, junit |
| CI | github actions, gitlab ci, azure pipelines, jenkins |
| Artifact types | container, jar, wheel |
| Languages | the repository's language as GitHub reports it |

## How it is worked out

The profile comes from data the factory already holds. Working it out never calls GitHub. The sources are:

- the manifests the Vulnetix CLI uploaded when it scanned the repository
- the manifest files in GitHub's dependency graph
- the workflow files the factory mirrors
- the repository's primary language

Each file name says one thing:

| File | Adds |
|---|---|
| `package-lock.json`, `npm-shrinkwrap.json` | npm |
| `pnpm-lock.yaml` | pnpm |
| `yarn.lock` | yarn |
| `bun.lockb` | bun |
| `poetry.lock` | poetry |
| `uv.lock` | uv |
| `requirements.txt` | pip |
| `Pipfile.lock` | pipenv |
| `go.mod` | go |
| `build.gradle`, `build.gradle.kts` | gradle |
| `pom.xml` | maven, and junit and jar |
| `Cargo.toml` | cargo |
| `Gemfile.lock` | bundler |
| `composer.lock` | composer |
| `packages.lock.json` | nuget |
| `Package.resolved` | swiftpm |
| `jest.config.js`, `jest.config.ts` | jest |
| `vitest.config.js`, `vitest.config.ts` | vitest |
| `pytest.ini`, `conftest.py` | pytest |
| `.rspec` | rspec |
| `phpunit.xml` | phpunit |
| `pyproject.toml`, `setup.py` | wheel |
| `Dockerfile`, `Containerfile` | container |
| `.github/workflows/*.yml` | github actions |
| `.gitlab-ci.yml` | gitlab ci |
| `azure-pipelines.yml` | azure pipelines |
| `Jenkinsfile` | jenkins |

The profile is refreshed when the GitHub App gains the repository, and when a push to the default branch changes a lockfile, a manifest or a workflow file.

## How runs use it

A run that a webhook starts carries the repository's profile. The card the crew works from lists it under **Repository profile (use the variant that matches)**, so the agent runs the right package manager and test runner.

Templates with variants declare them as axes. The package manager axis covers npm, pnpm, yarn, poetry, uv, pip-tools, go, gradle, maven, cargo, bundler and composer. The test runner axis covers jest, vitest, pytest, rspec, phpunit and junit. See [Templates](/workflows/templates/).

> [!WHY] Why the variant is picked at run time
> A repository can change from npm to pnpm without anyone editing a workflow. Reading the profile when the run starts means the agent always uses what the repository uses today.

## Related

- [Managed orgs and repositories](/control/managed-scope/)
- [Templates](/workflows/templates/)
