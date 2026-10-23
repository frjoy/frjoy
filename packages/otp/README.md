# @frjoy/otp

[![npm](https://img.shields.io/npm/v/@frjoy/otp)](https://www.npmjs.com/package/@frjoy/otp)
[![license](https://img.shields.io/npm/l/@frjoy/otp)](https://github.com/frjoy/frjoy/blob/main/LICENSE)

A headless, fully customizable OTP input for React. You bring the markup and styles; it handles focus, typing, pasting, SMS autofill and validation.

**[Live demo and playground →](https://www.feldux.com/packages/otp)**

## Features

- **Headless**: no styles and no wrapper element, so you can put any element or class anywhere.
- **SMS autofill**: uses `autocomplete="one-time-code"`, so iOS and Android can offer the code from a text message.
- **Paste anywhere**: a pasted code is spread across the inputs, and whitespace is ignored.
- **Keyboard friendly**: inputs auto-advance, Backspace steps back, and arrow keys move between inputs.
- **Mobile keyboards**: `type="number"` opens the numeric keypad.
- **Multi-character inputs**: each input can hold more than one character (e.g. `ABCD-1234`).
- **Validation**: numbers only, letters and numbers, or anything plus your own `pattern`.
- **International**: Arabic-Indic (`٠-٩`) and Persian (`۰-۹`) digits are converted to `0-9`, and it works on right-to-left pages.
- **Password mode**: masks the characters.
- **Fills in order**: clicking an empty input jumps to the first unfilled one, and filled inputs stay editable.

## Install

```bash
npm install @frjoy/otp
# or
pnpm add @frjoy/otp
# or
yarn add @frjoy/otp
```

Requires React 18 or newer.

## Quick start

```jsx
import * as OTP from "@frjoy/otp";

export function VerifyCode() {
  return (
    <OTP.Root type="number" onChange={(code) => console.log(code)}>
      <OTP.Label>Enter the code we sent you</OTP.Label>
      <OTP.Input />
      <OTP.Input />
      <OTP.Input />
      <OTP.Input />
    </OTP.Root>
  );
}
```

Render as many `OTP.Input`s as your code needs. `onChange` receives the full code each time it changes, but not on the first render.

## Examples

### Styled with Tailwind

Inputs can live inside any layout:

```jsx
<OTP.Root type="number" onChange={setCode}>
  <OTP.Label className="mb-2 block text-sm font-medium">Enter OTP</OTP.Label>
  <div className="flex gap-3">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <OTP.Input
        key={i}
        aria-label={`Digit ${i + 1} of 6`}
        className="h-12 w-12 rounded-lg border text-center text-lg focus:ring-2"
      />
    ))}
  </div>
</OTP.Root>
```

### PIN code

```jsx
<OTP.Root type="number" password onChange={setPin}>
  <OTP.Input />
  <OTP.Input />
  <OTP.Input />
  <OTP.Input />
</OTP.Root>
```

### Referral or license key

Use multi-character inputs with a joiner:

```jsx
<OTP.Root type="text" joiner="-" onChange={setKey}>
  <OTP.Input length={4} />
  <OTP.Input length={4} />
  <OTP.Input length={4} />
</OTP.Root>
// "ABCD-1234-EFGH"
```

### Right-to-left pages (Arabic, Hebrew, Persian, Urdu)

OTP codes are read left to right, even on RTL pages. Wrap the inputs in `dir="ltr"` so the code doesn't appear reversed:

```jsx
<OTP.Root type="number" onChange={setCode}>
  <OTP.Label>رمز التحقق</OTP.Label>
  <div dir="ltr">
    <OTP.Input />
    <OTP.Input />
    <OTP.Input />
    <OTP.Input />
  </div>
</OTP.Root>
```

Arrow keys follow the visual direction either way.

## API

### `OTP.Root`

Holds the state. It renders no element of its own, only its children.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `React.ReactNode` | — | Inputs, label and any other elements. |
| `onChange` | `(value: string) => void` | — | Called with the full code, in input order, whenever it changes. |
| `type` | `"any" \| "number" \| "text"` | `"any"` | `number`: digits only. `text`: letters and digits. `any`: no restriction. |
| `password` | `boolean` | `false` | Masks every input. |
| `joiner` | `string` | `""` | Placed between input values in `onChange`, e.g. `"-"`. |
| `pattern` | `string` | — | HTML `pattern` applied to every input. Best with `type="any"`. |

### `OTP.Input`

Accepts every `<input>` prop except `type`, `value`, `autoComplete`, `maxLength` and `minLength`, which the component manages. Your own `onChange`, `onKeyDown`, `onPaste` and `onClick` still run.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `length` | `number` | `1` | Number of characters this input holds. |
| `password` | `boolean` | `false` | Masks this input only. |

### `OTP.Label`

Accepts every `<label>` prop except `htmlFor`. Clicking it focuses the first input that isn't filled yet.

## Accessibility

The component doesn't add text of its own, so labels stay in your language. Give each input an `aria-label`:

```jsx
<OTP.Input aria-label="Digit 1 of 6" />
```

## Contributing

Issues and pull requests are welcome at [github.com/frjoy/frjoy](https://github.com/frjoy/frjoy). See the [root README](https://github.com/frjoy/frjoy#development) for local setup.

## License

MIT © Felix Dusengimana
