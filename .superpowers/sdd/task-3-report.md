# Task 3 report: public typed SVG icon migration

## Scope completed

- Replaced the public-site emoji UI in Hero, Diferenciais, Financiamento, Sobre, CtaFinal, CatalogoSection, CardMoto, GaleriaFotos, and the public motorcycle detail page with `Icon` primitives.
- Used the requested icon mappings: shield-check, landmark, repeat, wrench, bolt, wallet, map-pin, motorcycle, search, gauge, palette, settings, chevron-left, chevron-right, and whatsapp.
- Preserved existing visible copy, links, and CardMoto photo-arrow aria-labels.
- Moved the existing WhatsApp path data into `Icon`, updated WhatsAppFloat and every public caller (including the contact page), and removed the exported `WhatsAppIcon` duplicate.
- Restricted the policy scanner to `src/app/(public)` and `src/components/public`; its Unicode emoji regex remains unchanged. Admin files were not modified.

## TDD evidence

### RED

Command: `npm.cmd test -- src/components/public/no-ui-emojis.test.ts`

Initial result: failed. The existing scanner reported 12 files: nine public targets plus three admin files. After changing only scanner roots to public UI, the same command remained red and reported exactly these nine public files:

1. `src/app/(public)/motos/[slug]/page.tsx`
2. `src/components/public/CardMoto.tsx`
3. `src/components/public/CatalogoSection.tsx`
4. `src/components/public/CtaFinal.tsx`
5. `src/components/public/Diferenciais.tsx`
6. `src/components/public/Financiamento.tsx`
7. `src/components/public/GaleriaFotos.tsx`
8. `src/components/public/Hero.tsx`
9. `src/components/public/Sobre.tsx`

### GREEN

Command: `npm.cmd test -- src/components/public/no-ui-emojis.test.ts src/components/public/header-state.test.ts`

Result: 2 test files passed, 3 tests passed, 0 failed (final run: 8.7 seconds).

## Verification

- `npm.cmd test -- src/components/public/no-ui-emojis.test.ts` passed after the public migration (1/1 test).
- Final focused test run passed: 2 files, 3 tests, 0 failures.
- `npm.cmd run lint` exited 0 in 12.7 seconds. It has one existing warning in `src/app/layout.tsx:52` for a native `<img>`; the changed files have no lint errors.
- No command timed out; the configured cap was 120 seconds.

## Concerns

- The repository retains the unrelated lint warning above. It was not changed because this task is limited to the public icon migration.
