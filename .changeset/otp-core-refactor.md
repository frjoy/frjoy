---
"@frjoy/otp": patch
---

Internal: the OTP logic now lives in a framework-free core that is bundled into the package, ready for Vue and Angular versions. No API changes. `onChange` now fires during the input event instead of after the next render, and the bundle is about 2.5 KB smaller.

Fix: pasting nothing usable (an image, an empty clipboard or only spaces) no longer throws an error.
