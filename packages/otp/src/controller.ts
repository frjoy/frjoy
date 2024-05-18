class Node {
  value: HTMLInputElement | null;
  prev: Node | null;
  next: Node | null;

  constructor(value: HTMLInputElement) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export class OTPInputClass {
  head: Node | null;
  tail: Node | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // Method to add a new input element
  addInput(input: HTMLInputElement): void {
    const newNode = new Node(input);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else if (!this.findInputById(input?.id)) {
      if (this.tail) {
        newNode.prev = this.tail;
        this.tail.next = newNode;
        this.tail = newNode;
      }
      this.length++;
    }
  }

  clearAllInputs(): void {
    let current = this.head;
    while (current !== null) {
      current.value!.value = "";
      current = current.next;
    }

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // Method to find a node by input id
  findInputById(id: string): Node | null {
    let current = this.head;
    while (current !== null) {
      if (current.value?.id === id) {
        return current;
      }
      current = current.next;
    }
    return null;
  }

  // Method to get the OTP value from input elements
  getOTP(): { [id: string]: string } {
    const otp: { [id: string]: string } = {};
    let current = this.head;
    while (current !== null) {
      otp[current.value?.id || ""] = current.value?.value || "";
      current = current.next;
    }
    return otp;
  }
}
