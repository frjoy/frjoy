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
pnpm dev             # builds packages, then the Next.js playground on http://localhost:3000
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
templates/    Next.js playground that uses the local packages
.storybook/   Storybook config
.changeset/   pending release notes
```

## Contributing

Contributions are welcome. Bug reports, ideas and pull requests all help. See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to make changes and how releases work.

## License

[MIT](./LICENSE) © Felix Dusengimana
