# Contributing to FrJoy

Thanks for helping out. Bug reports, ideas and pull requests are all welcome.

## Reporting bugs and ideas

Open an [issue](https://github.com/frjoy/frjoy/issues) with:

- the package and version (e.g. `@frjoy/otp@0.2.0`)
- what you did, what you expected and what happened
- browser, device and page direction (LTR or RTL) if it's about input behaviour

## Setup

Use Node.js from `.nvmrc` (20.x) and pnpm 10.

```bash
pnpm install
pnpm dev:storybook   # Storybook on http://localhost:6006
pnpm dev             # builds packages, then the Next.js playground on http://localhost:3000
```

Storybook uses the package source directly. The playground in `templates/` uses the built package, so rerun `pnpm build:package` after changes.

## Making a change

1. Fork the repo and create a branch from `main`.
2. Make your change and add tests for it. Unit tests live next to the source (`*.test.tsx`). Add or update a story in `*.stories.tsx` if the behaviour is visible.
3. Run the same checks as CI:
   ```bash
   pnpm typecheck
   pnpm test run
   pnpm build:package
   ```
4. If you changed a published package, add a changeset (see below).
5. Open a pull request against `main`.

## Changesets and releases

Releases use [changesets](https://github.com/changesets/changesets). A changeset is a small file in `.changeset/` that says which package changed and how:

```bash
pnpm changeset
```

Pick the package and the bump: `patch` for fixes, `minor` for new features, `major` for breaking changes. Then describe the change; it goes into the changelog.

Add a changeset when you change anything that ships to npm: a package's source or its `README.md`. Changes to CI, Storybook, tests or the playground don't need one.

Releasing then takes two merges:

1. A PR with a changeset is merged into `main`. A "Version Packages" PR opens, bumping the version and updating the changelog.
2. The "Version Packages" PR is merged. The new version is published to npm.

PRs without a changeset don't release anything.

## Code of Conduct

Please follow the [Code of Conduct](./CODE_OF_CONDUCT.md).
