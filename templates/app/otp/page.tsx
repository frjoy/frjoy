"use client";
import React from "react";
import * as OTP from "@frjoy/otp";

const box =
  "h-12 w-12 rounded-lg border border-gray-300 bg-gray-50 text-center text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white";

function Example({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: (onChange: (v: string) => void) => React.ReactNode;
}) {
  const [value, setValue] = React.useState("");
  return (
    <section className="rounded-xl border border-gray-200 p-6 dark:border-gray-700">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
      {children(setValue)}
      <p dir="ltr" className="mt-4 text-sm">
        Value: <output className="font-mono">{value}</output>
      </p>
    </section>
  );
}

const inputs = (count: number, props: OTP.InputProps = {}) =>
  Array.from({ length: count }, (_, i) => (
    <OTP.Input
      key={i}
      aria-label={`Character ${i + 1} of ${count}`}
      className={box}
      {...props}
    />
  ));

export default function Page() {
  return (
    <div className="grid max-w-2xl gap-6">
      <h1 className="text-2xl font-bold">@frjoy/otp</h1>

      <Example
        title="SMS code"
        hint="Numeric keypad on mobile, SMS autofill, paste a code with spaces."
      >
        {(onChange) => (
          <OTP.Root type="number" onChange={onChange}>
            <OTP.Label className="mb-2 block text-sm font-medium">
              Enter the 6-digit code
            </OTP.Label>
            <div className="flex gap-3">{inputs(6)}</div>
          </OTP.Root>
        )}
      </Example>

      <Example title="PIN" hint="Masked digits.">
        {(onChange) => (
          <OTP.Root type="number" password onChange={onChange}>
            <div className="flex gap-3">{inputs(4)}</div>
          </OTP.Root>
        )}
      </Example>

      <Example
        title="License key"
        hint="Multi-character inputs joined with a dash. Try pasting ABCD1234EFGH."
      >
        {(onChange) => (
          <OTP.Root type="text" joiner="-" onChange={onChange}>
            <div className="flex gap-3">
              {inputs(3, { length: 4, className: `${box} w-28` })}
            </div>
          </OTP.Root>
        )}
      </Example>

      <Example
        title="Arabic (RTL page)"
        hint='Arabic-Indic digits like ١٢٣٤ become 1234. The dir="ltr" wrapper keeps the code readable.'
      >
        {(onChange) => (
          <div dir="rtl" lang="ar">
            <OTP.Root type="number" onChange={onChange}>
              <OTP.Label className="mb-2 block text-sm font-medium">
                رمز التحقق
              </OTP.Label>
              <div dir="ltr" className="flex gap-3">
                {inputs(4)}
              </div>
            </OTP.Root>
          </div>
        )}
      </Example>
    </div>
  );
}
