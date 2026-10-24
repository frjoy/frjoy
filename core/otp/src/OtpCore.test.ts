import { afterEach, expect, test, vi } from "vitest";
import { OtpCore } from "./OtpCore";

afterEach(() => {
  document.body.innerHTML = "";
});

// plain DOM inputs, the way a Vue or Angular adapter would hand them over
function setup(n = 4, options: ConstructorParameters<typeof OtpCore>[0] = {}, length = 1) {
  const onChange = vi.fn();
  const core = new OtpCore({ onChange, ...options });
  const inputs = Array.from({ length: n }, (_, i) => {
    const el = document.createElement("input");
    el.id = `otp-${i}`;
    el.maxLength = length;
    document.body.append(el);
    core.add(el);
    return el;
  });
  // what an adapter does on each render: show the core's values
  const sync = () => inputs.forEach((el) => (el.value = core.values[el.id] || ""));
  core.subscribe(sync);
  const type = (el: HTMLInputElement, value: string) => {
    el.value = value;
    core.input(el);
  };
  const key = (el: HTMLInputElement, k: string) => {
    const e = new KeyboardEvent("keydown", { key: k, cancelable: true });
    Object.defineProperty(e, "currentTarget", { value: el });
    core.keydown(e);
    return e;
  };
  return { core, inputs, onChange, type, key };
}

test("typing fills inputs in order, moves focus and reports the code", () => {
  const { inputs, onChange, type } = setup();
  type(inputs[0], "1");
  type(inputs[1], "2");
  expect(onChange).toHaveBeenLastCalledWith("12");
  expect(document.activeElement).toBe(inputs[2]);
});

test("does not report until something changes", () => {
  const { onChange } = setup();
  expect(onChange).not.toHaveBeenCalled();
});

test("number type rejects letters", () => {
  const { inputs, onChange, type } = setup(4, { type: "number" });
  type(inputs[0], "a");
  expect(onChange).not.toHaveBeenCalled();
});

test("typing over a filled input replaces it once", () => {
  const { inputs, onChange, type, key } = setup();
  type(inputs[0], "1");
  type(inputs[1], "2");
  const e = key(inputs[1], "9");
  expect(e.defaultPrevented).toBe(true);
  expect(onChange).toHaveBeenLastCalledWith("19");
  expect(document.activeElement).toBe(inputs[2]);
});

test("Backspace on an empty input moves back", () => {
  const { inputs, type, key } = setup();
  type(inputs[0], "1");
  inputs[1].focus();
  key(inputs[1], "Backspace");
  expect(document.activeElement).toBe(inputs[0]);
});

test("paste spreads the code, ignoring spaces, and converts Arabic digits", () => {
  const { core, inputs, onChange } = setup(6, { type: "number" });
  const e = {
    clipboardData: { getData: () => " ١٢ 34 56 " } as unknown as DataTransfer,
    currentTarget: inputs[0],
    preventDefault: vi.fn(),
  };
  core.paste(e);
  expect(e.preventDefault).toHaveBeenCalled();
  expect(onChange).toHaveBeenLastCalledWith("123456");
});

test("pasting nothing usable is ignored", () => {
  const { core, inputs, onChange } = setup();
  for (const text of ["", "   "]) {
    const e = {
      clipboardData: { getData: () => text } as unknown as DataTransfer,
      currentTarget: inputs[0],
      preventDefault: vi.fn(),
    };
    expect(() => core.paste(e)).not.toThrow();
  }
  expect(onChange).not.toHaveBeenCalled();
});

test("autofill of the whole code into one input is spread", () => {
  const { inputs, onChange, type } = setup();
  type(inputs[0], "9876");
  expect(onChange).toHaveBeenLastCalledWith("9876");
});

test("joiner and multi-character inputs", () => {
  const { inputs, onChange, type } = setup(3, { joiner: "-" }, 4);
  type(inputs[0], "ABCD");
  type(inputs[1], "12");
  expect(onChange).toHaveBeenLastCalledWith("ABCD-12");
});

test("removing an input drops its value", () => {
  const { core, inputs, onChange, type } = setup(3);
  type(inputs[0], "1");
  type(inputs[1], "2");
  core.remove(inputs[0].id);
  expect(onChange).toHaveBeenLastCalledWith("2");
});

test("clicking an empty input ahead jumps to the first open one", () => {
  const { core, inputs, type } = setup();
  type(inputs[0], "1");
  core.click(inputs[3]);
  expect(document.activeElement).toBe(inputs[1]);
});

test("firstOpenId points at the first input that needs characters", () => {
  const { core, inputs, type } = setup(3);
  expect(core.firstOpenId()).toBe(inputs[0].id);
  type(inputs[0], "1");
  expect(core.firstOpenId()).toBe(inputs[1].id);
});
