import { OTPInputClass } from "./controller";
import { isAllowed, isInputComplete, normalizeDigits } from "./helpers";

export type OtpType = "any" | "number" | "text";

export interface OtpCoreOptions {
  type?: OtpType;
  joiner?: string;
  onChange?: (value: string) => void;
}

// the parts of a keyboard or clipboard event the core needs, so DOM and React events both fit
interface KeyLike {
  key: string;
  currentTarget: EventTarget | null;
  preventDefault(): void;
}
interface PasteLike {
  clipboardData: DataTransfer | null;
  currentTarget: EventTarget | null;
  preventDefault(): void;
}

const sizeOf = (input: HTMLInputElement) => input.maxLength > 0 ? input.maxLength : 1;

export class OtpCore {
  options: OtpCoreOptions;
  readonly inputs = new OTPInputClass();
  values: { [id: string]: string } = {};
  version = 0;
  private listeners = new Set<() => void>();
  private last = "";

  constructor(options: OtpCoreOptions = {}) {
    this.options = options;
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  get value() {
    return this.inputs
      .ids()
      .filter((id) => id in this.values)
      .map((id) => this.values[id])
      .join(this.options.joiner ?? "");
  }

  add(input: HTMLInputElement) {
    this.inputs.addInput(input);
  }

  remove(id: string) {
    this.inputs.removeInput(id);
    if (!(id in this.values)) return;
    const next = { ...this.values };
    delete next[id];
    this.set(next);
  }

  // first input that still needs characters, for the label's `for`
  firstOpenId() {
    for (let n = this.inputs.head; n; n = n.next) {
      const input = n.value!;
      if ((this.values[input.id] || "").length < sizeOf(input)) return input.id;
    }
    return this.inputs.tail?.value?.id ?? "";
  }

  input(target: HTMLInputElement) {
    const size = sizeOf(target);
    const id = target.id;
    const value = normalizeDigits(target.value);
    if (!this.allowed(value)) return;

    // autofill can drop the whole code into one input
    if (value.length > size) return this.fill(id, value);

    if (this.values[id] !== value) this.set({ ...this.values, [id]: value });
    isInputComplete(value.length, size) && this.next(id);
  }

  keydown(e: KeyLike) {
    const target = e.currentTarget as HTMLInputElement;
    const id = target.id;

    if (e.key === "Backspace") {
      if (!this.values[id]) this.prev(id);
      return;
    }

    const rtl = getComputedStyle(target).direction === "rtl";
    if (e.key === "ArrowLeft") return rtl ? this.next(id) : this.prev(id);
    if (e.key === "ArrowRight") return rtl ? this.prev(id) : this.next(id);

    const key = normalizeDigits(e.key);

    // replace current value for input that accepts one character
    if (sizeOf(target) === 1 && key.length === 1 && Boolean(target.value)) {
      if (!this.allowed(key)) return;

      // handled here, or the browser types it again into the next input
      e.preventDefault();
      if (key !== this.values[id]) this.set({ ...this.values, [id]: key });
      this.next(id);
    }
  }

  paste(e: PasteLike) {
    e.preventDefault();
    const text = normalizeDigits(e.clipboardData?.getData("text") ?? "").replace(/\s/g, "");
    if (!this.allowed(text)) return;
    this.fill((e.currentTarget as HTMLInputElement).id, text);
  }

  // clicking an empty input jumps to the first one that isn't full
  click(target: HTMLInputElement) {
    if (target.value) return;
    for (let n = this.inputs.head; n && n.value !== target; n = n.next) {
      const input = n.value!;
      if (input.value.length < sizeOf(input)) return input.focus();
    }
  }

  private allowed(value: string) {
    return isAllowed(value, this.options.type);
  }

  private next(id: string) {
    this.inputs.findInputById(id)?.next?.value?.focus();
  }

  private prev(id: string) {
    this.inputs.findInputById(id)?.prev?.value?.focus();
  }

  // spread text over inputs starting at id, then focus where typing continues
  private fill(id: string, text: string) {
    let node = this.inputs.findInputById(id);
    let last = node;
    const next = { ...this.values };

    while (node && text.length > 0) {
      const input = node.value!;
      const size = sizeOf(input);
      next[input.id] = text.substring(0, size);
      text = text.substring(size);
      last = node;
      node = node.next;
    }
    this.set(next);

    const input = last?.value;
    if (!input) return;
    const complete = isInputComplete(next[input.id].length, sizeOf(input));
    (complete && last?.next?.value ? last.next.value : input).focus();
  }

  private set(values: { [id: string]: string }) {
    this.values = values;
    this.version++;
    this.listeners.forEach((l) => l());
    const value = this.value;
    if (value === this.last) return;
    this.last = value;
    this.options.onChange?.(value);
  }
}
