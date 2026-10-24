---
"@frjoy/otp": patch
---

Fix typing over a filled input also typing the same character into the next empty input (changing `12` to `19` gave `199`).
