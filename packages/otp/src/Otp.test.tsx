import React from "react";
import { describe, expect, vitest, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Root, Input, Label } from "./Otp";

describe("OTP Component", () => {
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
    inputEls.forEach((inputEl) => {
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

    const inputEls = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    inputEls.forEach((inputEl, index) => {
      fireEvent.change(inputEl, { target: { value: index.toString() } });
    });
    // Called once for each change
    expect(fn).toHaveBeenCalledTimes(4);
  });

  test("should render the label with for value equal to the input id", () => {
    const container = render(
      <Root>
        <Label title="OTP Label">OTP Label</Label>
        <Input id="input" placeholder="Input 1" />
      </Root>
    );
    const labelEl = container.getByTitle("OTP Label");
    const inputEl = container.getByPlaceholderText("Input 1");

    expect(labelEl.getAttribute("for")).toBe(inputEl.id);
  });

  // --- Additional tests ---

  test("ArrowRight moves focus to next input", async () => {
    render(
      <Root>
        <Input />
        <Input />
        <Input />
      </Root>
    );

    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    inputs[0].focus();
    fireEvent.keyDown(inputs[0], { key: "ArrowRight" });

    expect(document.activeElement).toBe(inputs[1]);
  });

  test("ArrowLeft moves focus to previous input", async () => {
    render(
      <Root>
        <Input />
        <Input />
        <Input />
      </Root>
    );

    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    inputs[1].focus();
    fireEvent.keyDown(inputs[1], { key: "ArrowLeft" });

    expect(document.activeElement).toBe(inputs[0]);
  });

  test("Backspace on empty input moves focus to previous input", async () => {
    render(
      <Root>
        <Input />
        <Input />
        <Input />
      </Root>
    );

    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];

    // Fill second input with a value
    fireEvent.change(inputs[1], { target: { value: "a" } });
    inputs[1].focus();

    // Clear second input by backspacing to empty
    fireEvent.keyDown(inputs[1], { key: "Backspace" });
    fireEvent.change(inputs[1], { target: { value: "" } });

    // After backspace on empty, focus should move to previous input
    fireEvent.keyDown(inputs[1], { key: "Backspace" });

    expect(document.activeElement).toBe(inputs[0]);
  });

  test("should populate inputs correctly on paste", async () => {
    render(
      <Root type="number">
        <Input />
        <Input />
        <Input />
        <Input />
      </Root>
    );

    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];

    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => "1234" },
    });

    expect(inputs[0].value).toBe("1");
    expect(inputs[1].value).toBe("2");
    expect(inputs[2].value).toBe("3");
    expect(inputs[3].value).toBe("4");
  });
  
  test("does not call onChange on initial render", async () => {
    const onChange = vitest.fn();

    render(
      <Root password={true} onChange={onChange}>
        <Input />
        <Input />
        <Input />
      </Root>
    );

    expect(onChange).not.toHaveBeenCalled();
  });
});
