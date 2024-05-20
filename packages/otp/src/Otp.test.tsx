import React from "react";
import { describe, expect, vitest } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Root, Input, Label } from "./Otp";

describe("OTP Component", (test) => {
  test("should render the OTP component", async () => {
    const container = render(
      <Root>
        <Label>OTP</Label>
        <Input />
        <Input />
        <Input />
        <Input />
      </Root>
    );

    const inputEls = (await container.findAllByRole(
      "textbox"
    )) as HTMLInputElement[];

    // check if 4 input fields are rendered
    expect(inputEls).toHaveLength(4);

    // check if all input fields are empty
    inputEls.map((inputEl) => {
      expect(inputEl.value).toBe("");
    });

    // check if label is rendered

    const labelEl = container.getByText("OTP");
    expect(labelEl).toBeDefined();
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
