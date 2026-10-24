import { expect, test } from "vitest";
import { OTPInputClass } from "./controller";

test("length counts every added input", () => {
  const c = new OTPInputClass();
  for (const id of ["a", "b", "c"]) {
    const el = document.createElement("input");
    el.id = id;
    document.body.append(el);
    c.addInput(el);
  }
  expect(c.length).toBe(3);
});
