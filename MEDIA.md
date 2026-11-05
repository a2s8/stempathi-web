# Website media, November 4, 2026

This public repository contains the marketing website and raster previews, not the proprietary app source or a playable build.

## Source captures

- `img/balance-preview-20261104.jpg`: JPEG export of `docs/ux/2026-11-04-lesson-backdrop/lesson-backdrop-ch1-360x800-light.png` in the app at commit `6693804`.
- `img/brackets-preview-20261104.jpg`: JPEG export of `docs/ux/2026-11-04-lesson-backdrop/lesson-backdrop-brackets-360x800-light.png` at the same commit.
- `img/negative-preview-20261103.png`: unchanged November 3 marketing capture `01-negative-balloons.png`, native 412×914, previously approved and published.

The new JPEG exports preserve the complete frame and intrinsic dimensions. No generated gameplay, compositing, cropping or interface reconstruction. These are development previews, not proof of the currently distributed Play version.

## Layout regression check

The old hero image used a fixed HTML height of 800 while CSS reduced its width to 284. Set `height:auto` on responsive images. Keep intrinsic width/height attributes to reserve proportional space. Do not use `object-fit:cover` for lesson screenshots: it can hide the equation or controls.

Check 320, 390, 768 and 1280 CSS-pixel widths. Confirm no horizontal overflow; all images load; each rendered aspect ratio matches its source; all navigation/CTA destinations resolve. Image links must open the complete native capture. Preserve the existing domain, privacy and support pages.

## Content guardrails

Lead with addition/subtraction. Keep the map out of promotional imagery until the founder accepts it. State closed-beta enrollment, free-during-test status, and development-preview dates. Do not claim public release, proven educational outcomes, preschool suitability or an unverified build rollout.
