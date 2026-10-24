import React from "react";
import { afterEach, describe, expect, vitest, test } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { Root, Input, Label } from "./Otp";

afterEach(cleanup);

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

  test("value follows input order, not typing order", async () => {
    const fn = vitest.fn();
    render(
      <Root onChange={fn}>
        <Input />
        <Input />
        <Input />
      </Root>
    );
    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    fireEvent.change(inputs[2], { target: { value: "3" } });
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    expect(fn).toHaveBeenLastCalledWith("123");
  });

  test("accepts leading zero in multi-character numeric input", async () => {
    const fn = vitest.fn();
    render(
      <Root type="number" onChange={fn}>
        <Input length={3} />
        <Input length={3} />
      </Root>
    );
    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: "01" } });
    expect(inputs[0].value).toBe("01");
    expect(fn).toHaveBeenLastCalledWith("01");
  });

  test("converts Arabic-Indic and Persian digits when typing", async () => {
    const fn = vitest.fn();
    render(
      <Root type="number" onChange={fn}>
        <Input />
        <Input />
      </Root>
    );
    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: "\u0663" } });
    fireEvent.change(inputs[1], { target: { value: "\u06F7" } });
    expect(inputs.map((i) => i.value)).toEqual(["3", "7"]);
    expect(fn).toHaveBeenLastCalledWith("37");
  });

  test("converts Arabic-Indic digits and strips whitespace on paste", async () => {
    const fn = vitest.fn();
    render(
      <Root type="number" onChange={fn}>
        <Input />
        <Input />
        <Input />
        <Input />
      </Root>
    );
    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => " \u0661\u0662 3 4\n" },
    });
    expect(inputs.map((i) => i.value)).toEqual(["1", "2", "3", "4"]);
    expect(fn).toHaveBeenLastCalledWith("1234");
  });

  test("autofilled full code in one input is spread across inputs", async () => {
    const fn = vitest.fn();
    render(
      <Root onChange={fn}>
        <Input />
        <Input />
        <Input />
      </Root>
    );
    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: "987" } });
    expect(inputs.map((i) => i.value)).toEqual(["9", "8", "7"]);
    expect(fn).toHaveBeenLastCalledWith("987");
  });

  test("clicking an empty input ahead of the first empty one redirects focus", async () => {
    render(
      <Root>
        <Input />
        <Input />
        <Input />
      </Root>
    );
    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: "1" } });
    inputs[2].focus();
    fireEvent.click(inputs[2]);
    expect(document.activeElement).toBe(inputs[1]);
  });

  test("clicking a filled input keeps focus there for editing", async () => {
    render(
      <Root>
        <Input />
        <Input />
        <Input />
      </Root>
    );
    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    inputs[1].focus();
    fireEvent.click(inputs[1]);
    expect(document.activeElement).toBe(inputs[1]);
  });

  test("unmounted inputs leave the value and focus chain", async () => {
    const fn = vitest.fn();
    const Form = ({ show }: { show: boolean }) => (
      <Root onChange={fn}>
        <Input placeholder="a" />
        {show && <Input placeholder="b" />}
        <Input placeholder="c" />
      </Root>
    );
    const { rerender } = render(<Form show />);
    fireEvent.change(screen.getByPlaceholderText("b"), { target: { value: "2" } });
    rerender(<Form show={false} />);
    fireEvent.change(screen.getByPlaceholderText("a"), { target: { value: "1" } });
    expect(fn).toHaveBeenLastCalledWith("1");
    expect(document.activeElement).toBe(screen.getByPlaceholderText("c"));
  });

  test("inputs mounted later keep document order", async () => {
    const fn = vitest.fn();
    const Form = ({ show }: { show: boolean }) => (
      <Root onChange={fn}>
        <Input placeholder="a" />
        {show && <Input placeholder="b" />}
        <Input placeholder="c" />
      </Root>
    );
    const { rerender } = render(<Form show={false} />);
    rerender(<Form show />);
    fireEvent.change(screen.getByPlaceholderText("c"), { target: { value: "3" } });
    fireEvent.change(screen.getByPlaceholderText("b"), { target: { value: "2" } });
    fireEvent.change(screen.getByPlaceholderText("a"), { target: { value: "1" } });
    expect(fn).toHaveBeenLastCalledWith("123");
  });

  test("sets one-time-code autocomplete and numeric keyboard", async () => {
    render(
      <Root type="number">
        <Input />
      </Root>
    );
    const input = (await screen.findByRole("textbox")) as HTMLInputElement;
    expect(input.getAttribute("autocomplete")).toBe("one-time-code");
    expect(input.getAttribute("inputmode")).toBe("numeric");
  });

  // jsdom does not inherit direction, the browser suite covers dir="rtl"
  test("arrow keys follow visual direction in RTL", async () => {
    render(
      <Root>
        <Input style={{ direction: "rtl" }} />
        <Input style={{ direction: "rtl" }} />
        <Input style={{ direction: "rtl" }} />
      </Root>
    );
    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    inputs[1].focus();
    fireEvent.keyDown(inputs[1], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(inputs[2]);
    fireEvent.keyDown(inputs[2], { key: "ArrowRight" });
    expect(document.activeElement).toBe(inputs[1]);
  });

  test("overwrites a filled input with an Arabic-Indic digit key", async () => {
    const fn = vitest.fn();
    render(
      <Root type="number" onChange={fn}>
        <Input />
        <Input />
      </Root>
    );
    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.keyDown(inputs[0], { key: "\u0669" });
    expect(inputs[0].value).toBe("9");
    expect(fn).toHaveBeenLastCalledWith("9");
  });

  test("typing over a filled input does not also type into the next one", async () => {
    const fn = vitest.fn();
    render(
      <Root onChange={fn} type="number">
        <Input />
        <Input />
        <Input />
      </Root>
    );
    const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: "1" } });
    // false means the browser was told not to insert the key itself
    expect(fireEvent.keyDown(inputs[0], { key: "9" })).toBe(false);
    expect(fn).toHaveBeenLastCalledWith("9");
  });
});
