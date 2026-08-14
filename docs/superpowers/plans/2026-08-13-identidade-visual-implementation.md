# Moto Moto Visual Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the official Moto Moto logo, replace UI emojis with accessible local SVG icons, and implement the approved glass navigation on desktop and mobile.

**Architecture:** Add focused presentational primitives for the logo and icons under `src/components/ui`, plus a small pure utility that derives the mobile header state from viewport/scroll state. Keep the public layout data flow unchanged: `PublicLayout` passes `Configuracoes` to `Header`; `Header` alone owns client-side menu and scroll interaction. Existing pages consume the visual primitives rather than embedding emoji strings.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Vitest + jsdom.

## Global Constraints

- Preserve `#ff6b00`, `#c44e00`, black/grafite colors and WhatsApp green from `src/app/globals.css`.
- Use the official local source `C:\Users\Sancs\Downloads\igor projeto\MOTO MOTO LOGO.svg`; copy it to `public/brand/moto-moto-logo.svg`.
- Do not introduce an icon package or remote icon URLs; all new icons are inline SVG React components.
- No UI emoji literals may remain in `src/app` or `src/components` after this work.
- The repository currently has no `.git` directory; omit commit commands and report this limitation in the implementation handoff.
- Respect `prefers-reduced-motion`; retain an opaque dark fallback where `backdrop-filter` is unsupported.

---

## File structure

- Create: `public/brand/moto-moto-logo.svg` — official logo asset copied unchanged.
- Create: `src/components/ui/BrandLogo.tsx` — reusable official mark with accessible alternative text.
- Create: `src/components/ui/Icon.tsx` — typed local SVG icon collection.
- Create: `src/components/public/header-state.ts` — pure mobile-header state function.
- Create: `src/components/public/header-state.test.ts` — unit coverage for scroll state logic.
- Create: `src/components/public/no-ui-emojis.test.ts` — scans UI source files for Unicode emoji ranges.
- Modify: `src/app/globals.css` — reusable liquid-glass utilities and reduced-motion fallback.
- Modify: public and admin components that currently render emojis — consume `Icon` and `BrandLogo`.

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

- [ ] **Step 1: Write the failing header-state tests**

```ts
import { describe, expect, it } from "vitest";
import { getMobileHeaderState } from "./header-state";

describe("getMobileHeaderState", () => {
  it("keeps the secondary navigation visible before the threshold", () => {
    expect(getMobileHeaderState(47)).toBe("expanded");
  });

  it("compacts the header after the threshold", () => {
    expect(getMobileHeaderState(48)).toBe("compact");
  });
});
```

- [ ] **Step 2: Run the focused test and confirm the expected missing-module failure**

Run: `npm test -- src/components/public/header-state.test.ts`

Expected: FAIL because `./header-state` does not exist.

- [ ] **Step 3: Implement the minimal state helper**

```ts
export type MobileHeaderState = "expanded" | "compact";

const COMPACT_SCROLL_Y = 48;

export function getMobileHeaderState(scrollY: number): MobileHeaderState {
  return scrollY >= COMPACT_SCROLL_Y ? "compact" : "expanded";
}
```

- [ ] **Step 4: Run the focused test and confirm it passes**

Run: `npm test -- src/components/public/header-state.test.ts`

Expected: PASS with 2 tests.

- [ ] **Step 5: Copy the official asset and add the logo/icon primitives**

Use `Copy-Item -LiteralPath 'C:\Users\Sancs\Downloads\igor projeto\MOTO MOTO LOGO.svg' -Destination 'public\brand\moto-moto-logo.svg'`.

Implement `BrandLogo` with `next/image`, `alt="Moto Moto"`, explicit intrinsic dimensions, and optional class names. Implement `IconName` covering `menu`, `whatsapp`, `map-pin`, `search`, `motorcycle`, `shield-check`, `landmark`, `repeat`, `wrench`, `bolt`, `wallet`, `clock`, `palette`, `gauge`, `settings`, `chart`, `tag`, `folder`, `mail`, `chevron-left`, and `chevron-right`; each icon must use `currentColor` and a 24×24 viewBox.

- [ ] **Step 6: Write the failing UI-source emoji scanner**

```ts
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const UI_ROOTS = ["src/app", "src/components"];
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

async function filesUnder(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(entryPath);
    return entry.isFile() && /\\.tsx?$/.test(entry.name) ? [entryPath] : [];
  }));
  return nested.flat();
}

describe("UI source", () => {
  it("contains no emoji literals", async () => {
    const files = (await Promise.all(UI_ROOTS.map(filesUnder))).flat();
    const matches = await Promise.all(files.map(async (file) => [file, await readFile(file, "utf8")] as const));
    expect(matches.filter(([, source]) => EMOJI.test(source)).map(([file]) => path.relative(process.cwd(), file))).toEqual([]);
  });
});
```

- [ ] **Step 7: Run the scanner and confirm it fails on existing emoji-bearing components**

Run: `npm test -- src/components/public/no-ui-emojis.test.ts`

Expected: FAIL and list existing UI source files such as `Header.tsx`, `Diferenciais.tsx`, `Financiamento.tsx`, `Sidebar.tsx`, and `CardMoto.tsx`.

### Task 2: Build the approved responsive public header and glass styling

**Files:**
- Modify: `src/components/public/Header.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/public/Footer.tsx`

**Interfaces:**
- Consumes `BrandLogo`, `Icon`, and `getMobileHeaderState` from Task 1.
- Preserves `Header({ config }: { config: Configuracoes })`.
- Produces keyboard-accessible mobile menu control and desktop two-row navigation.

- [ ] **Step 1: Add global liquid-glass styles**

```css
.surface-glass {
  background: linear-gradient(120deg, rgb(255 255 255 / 0.13), rgb(255 255 255 / 0.05));
  border: 1px solid rgb(255 255 255 / 0.16);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.2), 0 10px 28px rgb(0 0 0 / 0.2);
  backdrop-filter: blur(18px);
}
@supports not (backdrop-filter: blur(1px)) { .surface-glass { background: rgb(20 20 20 / 0.96); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; } }
```

- [ ] **Step 2: Convert `Header` to a client component and implement the two states**

Use `useEffect` to subscribe to `scroll`, initialize from `window.scrollY`, and remove the listener on cleanup. In mobile expanded state, render the logo-centered top bar followed by a separate navigation strip. In compact state, apply `-translate-y-full opacity-0 pointer-events-none` to the strip and reduced opacity to the fixed top bar. Use a real `<button aria-expanded aria-controls>` for opening the mobile menu; its icon is `Icon name="menu"`.

- [ ] **Step 3: Implement desktop presentation and footer brand**

At `md` and above, render the centered logo in a top bar, store city context on the left and WhatsApp action with `Icon name="whatsapp"` on the right. Render desktop links in the second row. Replace the text-derived brand in `Footer.tsx` with `BrandLogo`.

- [ ] **Step 4: Verify static behavior, lint, and build**

Run: `npm test -- src/components/public/header-state.test.ts && npm run lint && npm run build`

Expected: all commands exit 0.

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

**Interfaces:**
- Consumes `Icon` from Task 1.
- Keeps all current user-facing copy, links, and data shapes.

- [ ] **Step 1: Replace semantic content icons**

Replace inline data values such as `icon: "✅"` with `icon: "shield-check" as const`, then render `<Icon name={item.icon} className="h-5 w-5 text-orange" aria-hidden />`. Apply equivalent mappings: bank→`landmark`, exchange→`repeat`, workshop→`wrench`, speed→`bolt`, FGTS→`wallet`, protection→`shield-check`, location→`map-pin`, empty-photo→`motorcycle`, and search→`search`.

- [ ] **Step 2: Reuse the central WhatsApp SVG**

Move the existing WhatsApp path markup from `WhatsAppFloat.tsx` into `Icon` as `whatsapp`, then make both `WhatsAppFloat` and CTAs consume `<Icon name="whatsapp" />`. Remove the exported duplicate `WhatsAppIcon` only after callers have been migrated.

- [ ] **Step 3: Replace motorcycle metadata and carousel SVG duplication**

Use `gauge`, `palette`, and `settings` in `CardMoto.tsx`; use `chevron-left` and `chevron-right` for carousel actions. Preserve current accessible labels on photo controls.

- [ ] **Step 4: Run the emoji scanner and complete the public migration until it passes**

Run: `npm test -- src/components/public/no-ui-emojis.test.ts`

Expected: it may still fail only for admin files before Task 4; update the scanner in this step to check `src/components/public` only, then broaden it in Task 4.

### Task 4: Apply the official identity and SVGs to the admin panel

**Files:**
- Modify: `src/components/admin/Sidebar.tsx`
- Modify: `src/app/admin/login/page.tsx`
- Modify: `src/app/admin/(dashboard)/layout.tsx`
- Modify: every admin `.tsx` file identified by the scanner in `src/components/public/no-ui-emojis.test.ts`
- Modify: `src/components/public/no-ui-emojis.test.ts`

**Interfaces:**
- Consumes `BrandLogo` and `Icon` from Task 1.
- Preserves existing admin navigation URLs, form submissions, authentication and data actions.

- [ ] **Step 1: Replace sidebar brand and navigation icons**

Change `LINKS` to use `icon: IconName` values: dashboard→`chart`, motos→`motorcycle`, marcas→`tag`, categorias→`folder`, contatos→`mail`, configurações→`settings`. Render `BrandLogo` above the “Admin” caption and use `<Icon name={link.icon} className="h-4 w-4" aria-hidden />` inside each link.

- [ ] **Step 2: Replace login text brand with the shared logo**

Render `<BrandLogo className="mx-auto h-20 w-auto" priority />` above “Painel administrativo”. Keep the existing Supabase configuration notice and login form unchanged.

- [ ] **Step 3: Finish remaining admin emoji replacements**

For every scanner result under `src/components/admin` and `src/app/admin`, replace the literal with the closest `IconName`; add one SVG to `Icon.tsx` only when no existing icon conveys the same meaning. Do not use Unicode symbols as substitutions.

- [ ] **Step 4: Broaden and run the scanner**

Set `UI_ROOTS` back to `["src/app", "src/components"]`, then run: `npm test -- src/components/public/no-ui-emojis.test.ts`

Expected: PASS with no listed UI files.

### Task 5: Verify application integrity and visual acceptance

**Files:**
- Modify only if verification reveals a defect in a prior task.

**Interfaces:**
- Consumes all prior tasks.
- Produces verified desktop/mobile visual states without regressions.

- [ ] **Step 1: Run the full automated suite**

Run: `npm test`

Expected: all existing tests plus `header-state.test.ts` and `no-ui-emojis.test.ts` pass.

- [ ] **Step 2: Run static validation and production build**

Run: `npm run lint && npm run build`

Expected: both commands exit 0 with no lint errors or build failures.

- [ ] **Step 3: Perform visual QA**

Run: `npm run dev` and inspect the public homepage at desktop width and 390px width. Confirm: the official logo is centered; desktop menu is below the top bar; initial mobile menu is below the top bar; scrolling past 48px collapses only the menu strip; the compact top bar remains readable; a reduced-motion browser does not animate the transition; admin login and sidebar show the official mark; no emoji glyph is visible.

- [ ] **Step 4: Record the no-Git limitation**

Run: `git status --short`

Expected: command reports that this checkout is not a Git repository. Include that fact in the final handoff instead of claiming a commit was made.
