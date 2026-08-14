### Task 3: Replace all public UI emojis with typed SVG icons

**Files:**
- Modify: `src/components/public/Hero.tsx`
- Modify: `src/components/public/Diferenciais.tsx`
- Modify: `src/components/public/Financiamento.tsx`
- Modify: `src/components/public/Sobre.tsx`
- Modify: `src/components/public/CtaFinal.tsx`
- Modify: `src/components/public/CatalogoSection.tsx`
- Modify: `src/components/public/CardMoto.tsx`
- Modify: `src/components/public/GaleriaFotos.tsx`
- Modify: `src/components/public/WhatsAppFloat.tsx`
- Modify: `src/components/public/no-ui-emojis.test.ts`

**Requirements:**
- Consume `Icon` from `src/components/ui/Icon.tsx`; preserve visible copy, data and all existing links.
- Replace public content icons with the closest typed icon: laudo→shield-check; bank→landmark; exchange→repeat; workshop→wrench; speed→bolt; FGTS→wallet; protection→shield-check; location→map-pin; empty-photo→motorcycle; search→search.
- Move the existing WhatsApp SVG paths into `Icon` and update `WhatsAppFloat` and callers. Delete duplicate exported WhatsApp icon only after every public caller uses `Icon`.
- Replace motorcycle metadata with gauge/palette/settings and photo arrows with chevron-left/chevron-right. Preserve all aria-labels.
- The scanner must still scan public UI only while admin migration is pending; run it and make it green for that restricted scope. Do not weaken the regex or exclude individual public files.
- Also replace public emoji occurrences in `src/app/(public)/motos/[slug]/page.tsx`, as it is in scanner output even though it is not listed above.
- Do not modify admin files in this task. Do not add icon packages/remotes or Git commits.

**Verification:**
- Run the scanner first and record RED failure; then run after public migration and record GREEN pass.
- Run affected existing focused tests plus `npm.cmd run lint`; record actual output.
- Write detailed report to `.superpowers/sdd/task-3-report.md`.
