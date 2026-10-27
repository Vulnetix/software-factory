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
- `inventory/features.mjs` is the full list of features. Each feature names the page that documents it and gives patterns for the atoms it owns. Its status moves from `todo` to `drafted` (the page is written from the code) to `verified` (the page was re-read against the code at the commits in its `checked` frontmatter). A feature found after a pass enters as `drafted`.
- `scripts/inventory-check.mjs` fails if:
  - an atom matches no feature
  - a drafted or verified feature has no page
  - a page leaves out a key, code, enum value, slash command or other user-facing atom of its feature. Routes, CLI flags, Belai config keys and templates may instead be named only on the generated reference pages, and a feature can leave other atoms to them with `refOnly`.

  It writes `COVERAGE.md`.

The scanner reads Go source with regular expressions, so a few rules decide what counts. They live in `scripts/lib/go-source.mjs` and the coverage rules in `scripts/lib/coverage.mjs`, and `yarn test` pins each one:

- A setting's default is read as a whole Go literal and shown as JSON: `[]any{50, 80}` becomes `[50, 80]`, a map becomes an object.
- A subcommand is a `case "x":` of a command file's switch. Cases of a switch on a flag's value (`switch *backend`) are flag values, not subcommands. A file is named for its command (`rccmd.go` is `rc`), except those listed in `SUB_PARENT` (`agentfilescmd.go` is `agent crew`).
- A link to a docs page that does not exist yet renders as plain text, and a blockquote that starts `[!WHY]`, `[!CAREFUL]` or `[!PIX]` becomes a callout (`src/plugins/docs-markdown.mjs`).

CI runs `yarn test` and the strict coverage check before every deploy.

To pick up new upstream features, pull the source repositories and then run:

```sh
yarn inventory:scan
yarn inventory:check     # lists unmatched atoms: add or extend features for them
```

Source paths default to `../<repo>`. Override them with `SF_SRC_VDB_SITE=/path` and the matching variable for each other repository.
