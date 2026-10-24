import React from "react";
import { isAllowed, isInputComplete, normalizeDigits } from "./helpers";
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
    onClick,
    ...rest
  } = props;
  const {
    addRef,
    removeRef,
    onInputClick,
    password,
    type = "any",
    onInputChange,
    onPaste,
    otp,
    handleKeyDown,
    pattern,
  } = useOtpContext();
  const inputId = OTP_UNIQUE_PREFIX_ID + id;
  const ref = React.useCallback(
    (el: HTMLInputElement | null) => {
      if (el) addRef(el);
      else removeRef(inputId);
    },
    [addRef, removeRef, inputId]
  );
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
      onClick={(e) => {
        onInputClick(e);
        onClick && onClick(e);
      }}
      value={otp[inputId] || ""}
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

  // spread text over inputs starting at id, then focus where typing continues
  const fill = (id: string, text: string) => {
    let node = refs.findInputById(id);
    let last = node;
    const newData = { ...otp };

    while (node && text.length > 0) {
      const input = node.value!;
      const maxLength = input.maxLength || 1;
      newData[input.id] = text.substring(0, maxLength);
      text = text.substring(maxLength);
      last = node;
      node = node.next;
    }
    setOtp(newData);

    const input = last?.value;
    if (!input) return;
    const complete = isInputComplete(
      newData[input.id].length,
      input.maxLength || 1
    );
    (complete && last?.next?.value ? last.next.value : input).focus();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxLength = e.target.maxLength || 1;
    const id = e.target.id;
    const value = normalizeDigits(e.target.value);
    if (!isAllowed(value, e.target.dataset.type)) return;

    // autofill can drop the whole code into one input
    if (value.length > maxLength) return fill(id, value);

    // if value have changed, update state
    if (otp[id] !== value) setOtp((prev) => ({ ...prev, [id]: value }));

    isInputComplete(value.length, maxLength) && goToNextInput(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const maxLength = e.currentTarget.maxLength || 1;
    const id = e.currentTarget.id;

    if (e.key === "Backspace") {
      if (!otp[id]) goToPrevInput(id);
      return;
    }

    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";

    if (e.key === "ArrowLeft") {
      return rtl ? goToNextInput(id) : goToPrevInput(id);
    }

    if (e.key === "ArrowRight") {
      return rtl ? goToPrevInput(id) : goToNextInput(id);
    }

    const key = normalizeDigits(e.key);

    // replace current value for input that accepts one character
    if (
      maxLength === 1 &&
      key.length === 1 &&
      Boolean(e.currentTarget.value)
    ) {
      if (!isAllowed(key, e.currentTarget.dataset.type)) return;

      // handled here, or the browser types it again into the next input
      e.preventDefault();
      key != otp[id] && setOtp((prev) => ({ ...prev, [id]: key }));
      goToNextInput(id);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = normalizeDigits(e.clipboardData.getData("text")).replace(
      /\s/g,
      ""
    );
    if (!isAllowed(paste, e.currentTarget.dataset.type)) return;
    fill(e.currentTarget.id, paste);
  };

  // clicking an empty input jumps to the first one that isn't full
  const onInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const current = e.currentTarget;
    if (current.value) return;
    for (let n = refs.head; n && n.value !== current; n = n.next) {
      const input = n.value!;
      if (input.value.length < (input.maxLength || 1)) return input.focus();
    }
  };

  const value = refs
    .ids()
    .filter((id) => id in otp)
    .map((id) => otp[id])
    .join(joiner);

  const addRef = React.useCallback(
    (ref: HTMLInputElement) => refs.addInput(ref),
    [refs]
  );

  const removeRef = React.useCallback(
    (id: string) => {
      refs.removeInput(id);
      setOtp((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [refs]
  );

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
        removeRef,
        onInputClick,
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
