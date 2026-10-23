import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import * as OTP from ".";

interface DemoProps {
  type?: "any" | "number" | "text";
  password?: boolean;
  joiner?: string;
  pattern?: string;
  inputs?: number;
  length?: number;
  dir?: "ltr" | "rtl";
  ltrWrapper?: boolean;
  label?: string;
  theme?: "plain" | "styled";
}

const plainBox: React.CSSProperties = {
  height: 44,
  fontSize: 20,
  textAlign: "center",
  border: "1px solid #c4c4c4",
  borderRadius: 6,
};

const styledBox: React.CSSProperties = {
  height: 56,
  fontSize: 24,
  fontWeight: 600,
  textAlign: "center",
  color: "#f8fafc",
  background: "#1e293b",
  border: "2px solid #334155",
  borderRadius: 12,
  outlineColor: "#38bdf8",
};

function Demo({
  inputs = 6,
  length = 1,
  dir = "ltr",
  ltrWrapper = false,
  label = "Enter code",
  theme = "plain",
  ...root
}: DemoProps) {
  const [value, setValue] = React.useState("");
  const styled = theme === "styled";
  const box = styled ? styledBox : plainBox;

  return (
    <div
      dir={dir}
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: styled ? 24 : 0,
        borderRadius: 16,
        background: styled ? "#0f172a" : undefined,
        color: styled ? "#e2e8f0" : undefined,
        display: "inline-block",
      }}
    >
      <OTP.Root {...root} onChange={setValue}>
        <OTP.Label style={{ display: "block", marginBottom: 8 }}>
          {label}
        </OTP.Label>
        <div
          dir={ltrWrapper ? "ltr" : undefined}
          style={{ display: "flex", gap: 8 }}
        >
          {Array.from({ length: inputs }, (_, i) => (
            <OTP.Input
              key={i}
              length={length}
              aria-label={`Character ${i + 1} of ${inputs}`}
              style={{ ...box, width: 20 * length + 28 }}
            />
          ))}
        </div>
      </OTP.Root>
      <p dir="ltr" style={{ marginTop: 12 }}>
        Value: <output data-testid="value">{value}</output>
      </p>
    </div>
  );
}

const meta: Meta<typeof Demo> = {
  title: "OTP",
  component: Demo,
  argTypes: {
    type: { control: "inline-radio", options: ["any", "number", "text"] },
    password: { control: "boolean" },
    joiner: { control: "text" },
    pattern: { control: "text" },
    inputs: { control: { type: "range", min: 1, max: 10 } },
    length: { control: { type: "range", min: 1, max: 6 } },
    dir: { control: "inline-radio", options: ["ltr", "rtl"] },
    ltrWrapper: { control: "boolean" },
    theme: { control: "inline-radio", options: ["plain", "styled"] },
    label: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Demo>;

const value = (canvas: HTMLElement) => within(canvas).getByTestId("value");
const boxes = (canvas: HTMLElement) => [...canvas.querySelectorAll("input")];

export const Playground: Story = {
  args: { type: "any", inputs: 6, length: 1, dir: "ltr" },
};

export const SmsCode: Story = {
  name: "SMS code",
  args: { type: "number", inputs: 6, label: "Enter the 6-digit code we sent you" },
  play: async ({ canvasElement }) => {
    await userEvent.click(boxes(canvasElement)[0]);
    await userEvent.keyboard("482913");
    await expect(value(canvasElement)).toHaveTextContent("482913");
  },
};

export const PasteFromSms: Story = {
  name: "Paste from SMS",
  args: { type: "number", inputs: 6, label: "Paste a code with spaces" },
  play: async ({ canvasElement }) => {
    await userEvent.click(boxes(canvasElement)[0]);
    await userEvent.paste(" 12 34 56 ");
    await expect(value(canvasElement)).toHaveTextContent("123456");
  },
};

export const FillsInOrder: Story = {
  args: { inputs: 4, label: "Click the last box: focus jumps to the first" },
  play: async ({ canvasElement }) => {
    const inputs = boxes(canvasElement);
    await userEvent.click(inputs[3]);
    await expect(inputs[0]).toHaveFocus();
  },
};

export const Pin: Story = {
  args: { type: "number", password: true, inputs: 4, label: "Enter PIN" },
  play: async ({ canvasElement }) => {
    const inputs = boxes(canvasElement);
    await userEvent.click(inputs[0]);
    await userEvent.keyboard("2580");
    await expect(inputs[0]).toHaveAttribute("type", "password");
    await expect(value(canvasElement)).toHaveTextContent("2580");
  },
};

export const LicenseKey: Story = {
  args: { type: "text", joiner: "-", inputs: 3, length: 4, label: "License key" },
  play: async ({ canvasElement }) => {
    await userEvent.click(boxes(canvasElement)[0]);
    await userEvent.paste("ABCD1234EFGH");
    await expect(value(canvasElement)).toHaveTextContent("ABCD-1234-EFGH");
  },
};

export const CustomPattern: Story = {
  args: { pattern: "[A-Z]", inputs: 4, label: "Uppercase only (invalid boxes turn red)" },
  decorators: [
    (Story) => (
      <>
        <style>{"input:invalid { border-color: #dc2626 !important; }"}</style>
        <Story />
      </>
    ),
  ],
};

export const Styled: Story = {
  args: { type: "number", inputs: 6, theme: "styled", label: "Verification code" },
};

export const Arabic: Story = {
  args: {
    type: "number",
    inputs: 4,
    dir: "rtl",
    ltrWrapper: true,
    label: "رمز التحقق",
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(boxes(canvasElement)[0]);
    await userEvent.paste("١٢٣٤");
    await expect(value(canvasElement)).toHaveTextContent("1234");
  },
};

export const RtlWithoutWrapper: Story = {
  name: "RTL without wrapper",
  args: {
    type: "number",
    inputs: 4,
    dir: "rtl",
    label: "RTL without dir=\"ltr\": box 1 is on the right",
  },
  play: async ({ canvasElement }) => {
    const inputs = boxes(canvasElement);
    await userEvent.click(inputs[0]);
    await userEvent.keyboard("12");
    await userEvent.click(inputs[0]);
    await userEvent.keyboard("{ArrowLeft}");
    await expect(inputs[1]).toHaveFocus();
  },
};

export const DynamicInputs: StoryObj = {
  render: () => {
    const [value, setValue] = React.useState("");
    const [show, setShow] = React.useState(true);
    return (
      <div style={{ fontFamily: "system-ui, sans-serif" }}>
        <button onClick={() => setShow((s) => !s)}>
          {show ? "Hide" : "Show"} middle input
        </button>
        <OTP.Root onChange={setValue}>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <OTP.Input aria-label="First" style={{ ...plainBox, width: 48 }} />
            {show && (
              <OTP.Input aria-label="Middle" style={{ ...plainBox, width: 48 }} />
            )}
            <OTP.Input aria-label="Last" style={{ ...plainBox, width: 48 }} />
          </div>
        </OTP.Root>
        <p>
          Value: <output data-testid="value">{value}</output>
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText("First"));
    await userEvent.keyboard("123");
    await userEvent.click(canvas.getByRole("button"));
    await expect(value(canvasElement)).toHaveTextContent("13");
  },
};
