# software-factory

Source for https://software-factory.vulnetix.com, the user and developer documentation for Vulnetix Software Factory, its console, Pix calls, and the Belai CLI and TUI.

Astro 7, Tailwind v4 and Pagefind. The site is static: search runs in the browser and there is no backend.

```sh
corepack enable
yarn install
yarn dev            # http://localhost:4321
yarn build          # dist/ plus the Pagefind index
yarn check-links    # after a build
```

Pages are Markdown in `src/content/docs/`. Pushing to `main` deploys through `.github/workflows/pages.yml`. DNS and the Pages settings live in `terraform/`.

## Feature coverage

Every Software Factory feature has to be documented, and features land upstream every day, so coverage is checked by machine:

- `scripts/inventory-scan.mjs` reads sibling checkouts of `vdb-site`, `website`, `belai` and `saas` and writes `inventory/atoms.json`. An atom is one thing a user can touch, such as an API route, a console page, a settings key, an enum value, an error code, a CLI flag, a TUI command or a voice tool. It also lists every handler file, package and design doc, so a new one is never skipped silently. The file records the commit of each repository it read.
- `inventory/features.mjs` is the full list of features. Each feature names the page that documents it and gives patterns for the atoms it owns. Its status moves from `todo` to `drafted` to `verified`.
- `scripts/inventory-check.mjs` fails if:
  - an atom matches no feature
  - a drafted feature has no page
  - a page leaves out a key, code, flag or other user-facing atom of its feature

  It writes `COVERAGE.md`.

To pick up new upstream features, pull the source repositories and then run:

```sh
yarn inventory:scan
yarn inventory:check     # lists unmatched atoms: add or extend features for them
```

Source paths default to `../<repo>`. Override them with `SF_SRC_VDB_SITE=/path` and the matching variable for each other repository.
