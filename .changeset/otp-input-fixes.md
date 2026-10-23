---
"@frjoy/otp": minor
---

Fix value order when inputs are filled out of order, accept leading zeros and Arabic-Indic/Persian digits, ignore whitespace in pasted codes, support SMS autofill (`autocomplete="one-time-code"`) and the numeric keyboard, follow visual direction for arrow keys in RTL, keep typing left to right, and handle inputs that mount or unmount. React 18 or newer is now required (`useId` was already needed).
