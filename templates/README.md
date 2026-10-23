# FrJoy playground

A Next.js app for trying the packages in this repo. It uses the local packages (`workspace:*`), not the versions on npm, so it shows your changes.

```bash
# from the repo root
pnpm dev   # builds the packages, then starts http://localhost:3000
```

Pages:

- `/otp`: SMS code, PIN, license key and Arabic (RTL) examples for `@frjoy/otp`

Packages are built once when `pnpm dev` starts. After changing a package, rerun `pnpm build:package` and refresh.
