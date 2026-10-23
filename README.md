# FrJoy

`FrJoy` simply means `For React Joy`, or you can throw in my name `Felix` for fun 😂

A small collection of headless, customizable React components. Each one handles the tricky behaviour and leaves the look entirely to you.

## Packages

| Package | Description | Links |
| --- | --- | --- |
| [`@frjoy/otp`](./packages/otp) | Headless OTP / PIN / code input with SMS autofill, paste support and RTL support | [Live demo](https://www.feldux.com/packages/otp) · [npm](https://www.npmjs.com/package/@frjoy/otp) · [Docs](./packages/otp/README.md) |

## Development

This is a pnpm monorepo. Use Node.js from `.nvmrc` (20.x) and pnpm 10.

```bash
pnpm install
pnpm dev:storybook   # Storybook on http://localhost:6006
pnpm dev             # Next.js playground in ./templates
```

| Command | What it does |
| --- | --- |
| `pnpm test` | Run unit tests (Vitest, watch mode) |
| `pnpm test run` | Run unit tests once |
| `pnpm typecheck` | Type-check all packages |
| `pnpm build:package` | Build every package into its `dist` folder |
| `pnpm build-storybook` | Build a static Storybook |

### Repository layout

```
packages/     published packages (one folder each)
templates/    Next.js app for trying packages locally
.storybook/   Storybook config
.changeset/   pending release notes
```

## Contributing

Contributions are welcome. Bug reports, ideas and pull requests all help.

1. Fork the repo and create a branch from `main`.
2. Make your change and add tests for it.
3. Run `pnpm typecheck`, `pnpm test run` and `pnpm build:package`.
4. If a published package changed, run `pnpm changeset` and describe the change.
5. Open a pull request. CI runs the same checks.

Releases are automated: merging to `main` opens a "Version Packages" PR, and merging that publishes to npm.

Please follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © Felix Dusengimana
