import React from "react";
import { OtpCore } from "@frjoy/otp-core";
import { OtpContext, useOtpContext } from "./context";

const OTP_UNIQUE_PREFIX_ID = "otp-";

export interface InputProps
  extends Omit<
    React.ComponentProps<"input">,
    "autoComplete" | "type" | "maxLength" | "minLength" | "value"
  > {
  password?: boolean;
  length?: number;
}

function Input(props: InputProps) {
  const id = React.useId();
  const {
    password: pass,
    length = 1,
    onChange,
    onKeyDown,
    onPaste,
    onClick,
    ...rest
  } = props;
  const { core, password, type = "any", pattern } = useOtpContext();
  const inputId = OTP_UNIQUE_PREFIX_ID + id;
  const ref = React.useCallback(
    (el: HTMLInputElement | null) => {
      if (el) core.add(el);
      else core.remove(inputId);
    },
    [core, inputId]
  );
  return (
    <input
      {...rest}
      data-type={type}
      onKeyDown={(e) => {
        core.keydown(e);
        onKeyDown && onKeyDown(e);
      }}
      onChange={(e) => {
        core.input(e.target);
        onChange && onChange(e);
      }}
      onPaste={(e) => {
        core.paste(e);
        onPaste && onPaste(e);
      }}
      onClick={(e) => {
        core.click(e.currentTarget);
        onClick && onClick(e);
      }}
      value={core.values[inputId] || ""}
      pattern={rest.pattern ?? pattern}
      id={inputId}
      ref={ref}
      type={pass || password ? "password" : "text"}
      inputMode={rest.inputMode ?? (type === "number" ? "numeric" : undefined)}
      autoComplete="one-time-code"
      maxLength={length}
      minLength={length}
    />
  );
}

export interface LabelProps
  extends Omit<React.ComponentProps<"label">, "htmlFor" | "for"> {}
const Label = ({ children, ...props }: LabelProps) => {
  const { core } = useOtpContext();
  const [lastNotFull, setLastNotFull] = React.useState<string>("");

  // after render, once inputs are registered
  React.useEffect(() => {
    setLastNotFull(core.firstOpenId());
  });

  // Only render htmlFor if lastNotFull is valid
  const labelProps = Boolean(lastNotFull) ? { htmlFor: lastNotFull } : {};

  return (
    <label {...props} {...labelProps} aria-live="polite" aria-atomic="true">
      {children}
    </label>
  );
};

export interface OtpProps {
  onChange?: (value: string) => void;
  pattern?: string;
  children: React.ReactNode;
  password?: boolean;
  type?: "any" | "number" | "text";
  joiner?: string;
}

function Root({
  onChange,
  pattern,
  children,
  password = false,
  type = "any",
  joiner = "",
}: OtpProps) {
  const [core] = React.useState(() => new OtpCore());
  core.options = { type, joiner, onChange };
  React.useSyncExternalStore(core.subscribe, () => core.version, () => core.version);

  return (
    <OtpContext.Provider value={{ core, password, type, pattern }}>
      {children}
    </OtpContext.Provider>
  );
}

export { Input, Root, Label };
