import React from "react";
import { describe, expect, vitest } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Root, Input, Label } from "./Otp";

describe("OTP Component", (test) => {
  test("should render the OTP component", () => {
    const { container } = render(
      <Root>
        <Label>OTP</Label>
        <Input />
        <Input />
        <Input />
        <Input />
      </Root>
    );

    const inputEl = screen.findByRole("textbox");
    expect(container).toMatchSnapshot();

    expect(inputEl).toBeDefined();
  });

  test("handles onChange event", async () => {
    const fn = vitest.fn();

    render(
      <Root onChange={fn}>
        <Input />
        <Input />
        <Input />
        <Input />
      </Root>
    );

    const inputEls = await screen.findAllByRole("textbox");
    inputEls.map((inputEl, index) => {
      fireEvent.change(inputEl, { target: { value: index } });
    });
    expect(fn).toHaveBeenCalledTimes(5);
  });

  test("should render the label with for value equal to the input id", () => {
    const container = render(
      <Root>
        <Label title="OTP Label">OTP Label</Label>
        <Input id="input" placeholder="Input 1" />
      </Root>
    );
    const labelEl = container.getByTitle("OTP Label");
    const inputEls = container.getByPlaceholderText("Input 1");

    expect(labelEl.getAttribute("for")).toBe(inputEls.id);
  });
});
