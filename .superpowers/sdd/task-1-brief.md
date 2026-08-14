### Task 1: Establish visual primitives and their regression tests

**Files:**
- Create: `src/components/ui/BrandLogo.tsx`
- Create: `src/components/ui/Icon.tsx`
- Create: `src/components/public/header-state.ts`
- Create: `src/components/public/header-state.test.ts`
- Create: `src/components/public/no-ui-emojis.test.ts`
- Create: `public/brand/moto-moto-logo.svg`

**Interfaces:**
- Produces `BrandLogo({ className?, priority? }): JSX.Element`.
- Produces `Icon({ name, className?, title? })`, where `name` is a finite `IconName` union.
- Produces `getMobileHeaderState(scrollY: number): "expanded" | "compact"`.

**Global constraints:**
- Preserve `#ff6b00`, `#c44e00`, black/grafite colors and WhatsApp green.
- Copy the official source `C:\Users\Sancs\Downloads\igor projeto\MOTO MOTO LOGO.svg` to `public/brand/moto-moto-logo.svg`.
- Do not introduce an icon package or remote icon URLs; all new icons are inline SVG React components.
- The project checkout is not a Git repository: do not attempt commits.

- [ ] Write `header-state.test.ts` first, with the exact expectations: `getMobileHeaderState(47)` returns `"expanded"`; `getMobileHeaderState(48)` returns `"compact"`.
- [ ] Run `npm test -- src/components/public/header-state.test.ts` and record the expected missing-module failure.
- [ ] Implement `header-state.ts` with `COMPACT_SCROLL_Y = 48` and the exact union return type.
- [ ] Run the focused test and record the passing output.
- [ ] Copy the logo asset, then implement `BrandLogo` with `next/image`, `alt="Moto Moto"`, explicit intrinsic dimensions, optional `className` and `priority` props.
- [ ] Implement `IconName` and `Icon` with currentColor, 24x24 viewBox, and names: `menu`, `whatsapp`, `map-pin`, `search`, `motorcycle`, `shield-check`, `landmark`, `repeat`, `wrench`, `bolt`, `wallet`, `clock`, `palette`, `gauge`, `settings`, `chart`, `tag`, `folder`, `mail`, `chevron-left`, `chevron-right`.
- [ ] Write `no-ui-emojis.test.ts` using `node:fs/promises` to recursively scan `.ts` and `.tsx` beneath `src/app` and `src/components`, failing on Unicode emoji ranges `[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]`.
- [ ] Run it and record the expected failures listing existing UI files with emojis.
- [ ] Self-review and write a detailed report to `.superpowers/sdd/task-1-report.md`, including RED/GREEN evidence, files changed, and tests.
