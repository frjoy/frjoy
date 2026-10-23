### Easily customizable OTP

### How to install

```bash
npm install @frjoy/otp
```
  
```bash
yarn add @frjoy/otp
```

```bash
pnpm add @frjoy/otp
```

### How to use

```jsx
import * as OTP from '@frjoy/otp';

<OTP.Root>
<OTP.Label >This label allows you to be able to access fist empty otp input</OTP.Label>
<OTP.Input />
<OTP.Input />
<OTP.Input />
<!-- Define as many input as you wants -->
</OTP.Root>
```


### Or we can add any element, any styles anywhere we wants

````
<OTP.Root>
        <OTP.Label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Enter Otp
        </OTP.Label>
        <div className="flex gap-3">
          <OTP.Input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          <OTP.Input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          <OTP.Input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
          <OTP.Input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </div>
      </OTP.Root>

````

### Props supported

1. `Root`

| Prop | Data Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| children | React.ReactNode | - | - | Add custom children to the root element |
| style | React.CSSProperties | - | - | Add custom style to the root element |
| pattern | string | - | - | Add custom pattern to all the inputs elements under the `root` make sure that type is `any`|
| joiner | string | '' | - | Add custom joiner to join all the input value |
| onChange | (e: string) => void | - | - | Return value in all input joined by default `joiner` you set |
| type | "any", "number", "text" | 'any' | - |  Define what type of value you want to get from the input field |

2. `Label`
Accepts all the props of `label` element except `htmlFor`

3. `Input`
Accepts all the props of `input` element except  `type`, `value`, `autoComplete`, `maxLength`and `minLength`
It also accepts the following props

| Prop | Data Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| length | number | 1 | - | Define the number of character that a user can type in an input |
| password | boolean | false | - | Define if the input should be a password field |

### Requirements

React 18 or newer.

### Behaviour

- Inputs use `autocomplete="one-time-code"`, so iOS and Android can offer the code from an SMS. A full code filled into one input is spread across all inputs.
- With `type="number"` the inputs open the numeric keyboard on mobile.
- Arabic-Indic (`٠-٩`) and Persian (`۰-۹`) digits are converted to `0-9`.
- Whitespace in pasted codes is ignored.
- Clicking an empty input moves focus to the first input that isn't filled yet. Filled inputs can still be clicked and edited.

### Accessibility

Give each input a label in your own language:

```jsx
<OTP.Input aria-label="Digit 1 of 4" />
```

### Right-to-left languages

OTP codes are read left to right, even in Arabic or Hebrew. Wrap the inputs in an element with `dir="ltr"` so the code doesn't appear reversed:

```jsx
<OTP.Root>
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
