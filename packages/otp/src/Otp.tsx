import React from "react";
import { isAlphaNumeric, isInputComplete, isNumber } from "./helpers";
import { OtpContext, useOtpContext } from "./context";
import { OTPInputClass } from "./controller";

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
    onPaste: ps,
    ...rest
  } = props;
  const {
    addRef,
    password,
    type = "any",
    onInputChange,
    onPaste,
    otp,
    handleKeyDown,
    pattern,
  } = useOtpContext();
  return (
    <input
      {...rest}
      data-type={type}
      onKeyDown={(e) => {
        handleKeyDown(e);
        onKeyDown && onKeyDown(e);
      }}
      onChange={(e) => {
        onInputChange(e);
        onChange && onChange(e);
      }}
      onPaste={(e) => {
        onPaste(e);
        ps && ps(e);
      }}
      value={otp[OTP_UNIQUE_PREFIX_ID + id] || ""}
      pattern={rest.pattern ?? pattern}
      id={OTP_UNIQUE_PREFIX_ID + id}
      ref={(el) => addRef(el!)}
      type={pass || password ? "password" : "text"}
      autoComplete="off"
      maxLength={length}
      minLength={length}
    />
  );
}

export interface LabelProps
  extends Omit<React.ComponentProps<"label">, "htmlFor" | "for"> {}
const Label = ({ children, ...props }: LabelProps) => {
  const { refs, otp } = useOtpContext();
  const otpText = Object.values(otp).join("");
  const [lastNotFull, setLastNotFull] = React.useState<string>("");

  React.useEffect(() => {
    let val = refs.head?.value?.id;

    let current = refs.head;
    while (current) {
      if (!otp[current.value?.id ?? ""]) {
        val = current.value?.id;
        break;
      } else if (
        otp[current.value?.id ?? ""].length !== current.value?.maxLength
      ) {
        val = current.value?.id;
        break;
      }
      current = current.next;
    }

    setLastNotFull(val || refs.tail?.value?.id || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpText, refs.length]);

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
  const [otp, setOtp] = React.useState<{ [id: string]: string }>({});
  const refs = React.useRef<OTPInputClass>(new OTPInputClass()).current;

  const firstRender = React.useRef(true);

  const goToNextInput = (currentId: string) => {
    refs.findInputById(currentId)?.next?.value?.focus();
  };

  const goToPrevInput = (currentId: string) => {
    refs.findInputById(currentId)?.prev?.value?.focus();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxLength = e.target.maxLength || 1;
    const id = e.target.id;
    const value = e.target.value;
    if (e.target?.dataset.type === "number" && !isNumber(value)) return;
    if (e.currentTarget?.dataset.type === "text" && !isAlphaNumeric(value))
      return;

    // if value have changed, update state
    if (otp[id] !== value) setOtp((prev) => ({ ...prev, [id]: value }));

    isInputComplete(value.length, maxLength) && goToNextInput(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const maxLength = e.currentTarget.maxLength || 1;
    const id = e.currentTarget.id;

    if (e.key === "Backspace") {
      const stateValue = otp;
      stateValue[id] =
        stateValue[id]?.substring(0, stateValue[id]?.length) || "";

      if (!stateValue[id]) {
        goToPrevInput(id);
      }

      return;
    }

    if (e.key === "ArrowLeft") {
      return goToPrevInput(id);
    }

    if (e.key === "ArrowRight") {
      return goToNextInput(id);
    }

    // replace current value for input that accepts one character
    if (
      maxLength === 1 &&
      e.key.length === 1 &&
      Boolean(e.currentTarget.value)
    ) {
      if (e.currentTarget?.dataset.type === "number" && !isNumber(e.key))
        return;
      if (e.currentTarget?.dataset.type === "text" && !isAlphaNumeric(e.key))
        return;

      e.key != otp[id] && setOtp((prev) => ({ ...prev, [id]: e.key }));
      goToNextInput(id);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let paste = e.clipboardData.getData("text");
    const isValid =
    e.currentTarget?.dataset.type === "number"
      ? [...paste].every((ch) => isNumber(ch))
      : e.currentTarget?.dataset.type === "text"
        ? [...paste].every((ch) => isAlphaNumeric(ch))
        : true;

    if (!isValid) return;

    let current = refs.findInputById(e.currentTarget.id);
    const newData = { ...otp };

    while (current && paste.length > 0) {
      const maxLength = current.value?.maxLength || 1;
      const id = current.value?.id || "";

      // remove string from 0 to maxLength from paste and add it to newData
      newData[id] = paste.substring(0, maxLength);
      paste = paste.substring(maxLength);

      // if input is complete, move to next input
      if (isInputComplete(newData[id].length, maxLength)) {
        goToNextInput(id);
      }

      // move to next input
      current = current.next;
    }
    setOtp(newData);
  };

  const value = Object.values(otp).join(joiner);

  const addRef = (ref: HTMLInputElement) => {
    Boolean(ref) && refs.addInput(ref);
  };

  React.useEffect(() => {
    // If this is the first render, we don't want to trigger onChange
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onChange && onChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <OtpContext.Provider
      value={{
        addRef,
        onInputChange,
        handleKeyDown,
        onPaste,
        otp,
        refs,
        password,
        type,
        pattern,
      }}
    >
      {children}
    </OtpContext.Provider>
  );
}

export { Input, Root, Label };
