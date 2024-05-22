### Easily customizable OTP

### How to install

```bash
npm install @react-otp/core
```
  
```bash
yarn add @react-otp/core
```

```bash
pnpm add @react-otp/core
```

### How to use

```jsx
import * as OTP from '@frjoy/otp';

<OTP.Root>
<OTP.Label >This label allows you to be able to access fist empty otp input</OTP.Label>
<OTP.Input />
<OTP.Input />
<OTP.Input />
<!-- Define as many as input as you wants -->
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
