import React from "react";
import { describe, expect } from "vitest";
import { render } from "@testing-library/react";

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

    expect(container).toMatchSnapshot();
  });
});
