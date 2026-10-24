import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import * as OTP from ".";

// plain CSS on the package's inputs; nothing here is part of @frjoy/otp itself
const css = `
.box { width: 48px; height: 56px; font-size: 24px; text-align: center;
  border: 1.5px solid #c4c4c4; border-radius: 10px; outline: none; }
.box:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px #0ea5e933; }

.otp-pop:not(:placeholder-shown) { animation: otp-pop 160ms ease-out; }
@keyframes otp-pop {
  0% { transform: scale(0.8); }
  60% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.otp-line { width: 40px; height: 48px; font-size: 24px; text-align: center;
  border: 0; outline: none; background-color: transparent;
  background-image: linear-gradient(#3b82f6, #3b82f6),
    linear-gradient(#d4d4d4, #d4d4d4);
  background-size: 0% 2px, 100% 2px;
  background-position: bottom;
  background-repeat: no-repeat;
  transition: background-size 200ms; }
.otp-line:focus,
.otp-line:not(:placeholder-shown) { background-size: 100% 2px, 100% 2px; }

.otp-wrong input { border-color: #dc2626; animation: otp-shake 300ms; }
.otp-right input { border-color: #16a34a; }
@keyframes otp-shake {
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
`;

const meta: Meta = {
  title: "OTP/Animations",
  decorators: [
    (Story) => (
      <div style={{ fontFamily: "system-ui, sans-serif" }}>
        <style>{css}</style>
        <Story />
      </div>
    ),
  ],
};
export default meta;

const slots = (n: number, className: string) =>
  Array.from({ length: n }, (_, i) => (
    <OTP.Input
      key={i}
      placeholder=" "
      aria-label={`Digit ${i + 1} of ${n}`}
      className={className}
    />
  ));

const boxes = (canvas: HTMLElement) => [...canvas.querySelectorAll("input")];

export const Pop: StoryObj = {
  render: () => (
    <OTP.Root type="number">
      <div style={{ display: "flex", gap: 8 }}>{slots(4, "box otp-pop")}</div>
    </OTP.Root>
  ),
  play: async ({ canvasElement }) => {
    const [first, second] = boxes(canvasElement);
    await expect(getComputedStyle(first).animationName).toBe("none");
    await userEvent.click(first);
    await userEvent.keyboard("1");
    await expect(getComputedStyle(first).animationName).toBe("otp-pop");
    await expect(getComputedStyle(second).animationName).toBe("none");
  },
};

export const Underline: StoryObj = {
  render: () => (
    <OTP.Root type="number">
      <div style={{ display: "flex", gap: 8 }}>{slots(6, "otp-line")}</div>
    </OTP.Root>
  ),
  play: async ({ canvasElement }) => {
    const [first] = boxes(canvasElement);
    await userEvent.click(first);
    await userEvent.keyboard("1");
    await waitFor(() =>
      expect(getComputedStyle(first).backgroundSize).toBe("100% 2px, 100% 2px")
    );
  },
};

function ShakeDemo() {
  const [status, setStatus] = React.useState<"" | "wrong" | "right">("");
  const check = (v: string) => {
    if (v.length < 4) setStatus("");
    else setStatus(v === "1234" ? "right" : "wrong");
  };
  return (
    <div className={status && `otp-${status}`}>
      <p>Try any 4 digits; the right code is 1234.</p>
      <OTP.Root type="number" onChange={check}>
        <div style={{ display: "flex", gap: 8 }}>{slots(4, "box otp-pop")}</div>
      </OTP.Root>
      <p aria-live="polite" data-testid="status">
        {status === "right" ? "Correct" : status === "wrong" ? "Wrong code" : ""}
      </p>
    </div>
  );
}

export const ShakeOnWrongCode: StoryObj = {
  name: "Shake on wrong code",
  render: () => <ShakeDemo />,
  play: async ({ canvasElement }) => {
    const status = within(canvasElement).getByTestId("status");
    await userEvent.click(boxes(canvasElement)[0]);
    await userEvent.keyboard("9999");
    await expect(status).toHaveTextContent("Wrong code");
    await expect(canvasElement.querySelector(".otp-wrong")).not.toBeNull();
    await userEvent.click(boxes(canvasElement)[0]);
    await userEvent.paste("1234");
    await expect(status).toHaveTextContent("Correct");
  },
};
