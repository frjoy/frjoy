export function isNumber(value: string) {
  return /^\d*$/.test(value);
}

export function isAlphaNumeric(value: string) {
  return /^[a-zA-Z0-9]*$/.test(value);
}

export function isInputComplete(length: number, maxLength: number) {
  return length === maxLength;
}

// Arabic-Indic (U+0660–0669) and Persian (U+06F0–06F9) digits to 0–9
export function normalizeDigits(value: string) {
  return value.replace(/[٠-٩۰-۹]/g, (d) =>
    String(d.charCodeAt(0) & 0xf)
  );
}

export function isAllowed(value: string, type?: string) {
  if (type === "number") return isNumber(value);
  if (type === "text") return isAlphaNumeric(value);
  return true;
}
