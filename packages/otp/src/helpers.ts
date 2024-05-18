export function isNumber(value: string) {
  return !value || String(parseInt(value)) === value;
}

export function isAlphaNumeric(value: string) {
  return /^[a-zA-Z0-9]*$/.test(value);
}

export function isInputComplete(length: number, maxLength: number) {
  return length === maxLength;
}
