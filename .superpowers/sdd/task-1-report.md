# Task 1 — Visual primitives and regression tests

## Scope completed

- Added `getMobileHeaderState(scrollY)` and `COMPACT_SCROLL_Y = 48`.
- Added the `BrandLogo` primitive using `next/image`, the official Moto Moto SVG, intrinsic `93 × 97` dimensions, `alt="Moto Moto"`, and optional `className` / `priority` props.
- Added the inline-SVG `Icon` primitive and finite `IconName` union containing all 21 requested icon names. Icons use a 24 × 24 viewBox and `currentColor` styling; `title` makes an icon accessible as an image, while untitled icons are hidden from assistive technology.
- Added an emoji-regression test which recursively scans `.ts` and `.tsx` files in both `src/app` and `src/components` with the required Unicode ranges.

## Files changed

- `src/components/public/header-state.ts`
- `src/components/public/header-state.test.ts`
- `src/components/public/no-ui-emojis.test.ts`
- `src/components/ui/BrandLogo.tsx`
- `src/components/ui/Icon.tsx`
- `public/brand/moto-moto-logo.svg`

## TDD evidence

### Header state: RED

Created `header-state.test.ts` first with the exact boundary assertions:

- `getMobileHeaderState(47)` is `"expanded"`.
- `getMobileHeaderState(48)` is `"compact"`.

`npm.cmd test -- src/components/public/header-state.test.ts` failed before implementation. Vitest reported that `./header-state` could not be resolved from the new test file, confirming the intended missing-module failure.

### Header state: GREEN

Implemented the smallest boundary comparison in `header-state.ts`. The focused test then passed: 1 test file, 2 tests passed.

### Emoji policy: RED (expected existing violations)

Created `no-ui-emojis.test.ts` first, using `node:fs/promises` recursive traversal and `/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u`.

The focused test correctly fails on the existing UI emoji usage in 13 files:

- `src/app/(public)/motos/[slug]/page.tsx`
- `src/components/admin/ImagensUploader.tsx`
- `src/components/admin/MotoForm.tsx`
- `src/components/admin/Sidebar.tsx`
- `src/components/public/CardMoto.tsx`
- `src/components/public/CatalogoSection.tsx`
- `src/components/public/CtaFinal.tsx`
- `src/components/public/Diferenciais.tsx`
- `src/components/public/Financiamento.tsx`
- `src/components/public/GaleriaFotos.tsx`
- `src/components/public/Header.tsx`
- `src/components/public/Hero.tsx`
- `src/components/public/Sobre.tsx`

These were deliberately not changed: replacing them is outside Task 1 and belongs to a later migration task. The test now protects the intended no-emoji end state and gives the subsequent task its precise target list.

## Verification

- `npx.cmd tsc --noEmit` passed with exit code 0.
- `npm.cmd test -- src/components/public/header-state.test.ts` passed: 2/2 tests.
- `npm.cmd test -- src/components/public/no-ui-emojis.test.ts` failed as expected for the 13 pre-existing files above.
- Full `npm.cmd test` result: 4 test files passed, 1 expected emoji-policy test failed; 15 tests passed, 1 failed.
- Verified that the copied logo matches the required source file by SHA-256 (`D4DA5B112527145EF3DE…` for both files).

## Review notes and concerns

- No icon package or remote icon URL was introduced.
- The full test suite remains red until the existing 13 emoji-containing UI files are migrated. This is intentional for Task 1 and is the expected regression-test result specified by the brief.
- PowerShell execution policy blocks `npm.ps1`; commands were executed through the equivalent `npm.cmd` wrapper.
