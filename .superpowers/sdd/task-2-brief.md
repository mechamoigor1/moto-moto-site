### Task 2: Build the approved responsive public header and glass styling

**Files:**
- Modify: `src/components/public/Header.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/public/Footer.tsx`

**Interfaces:**
- Consume `BrandLogo`, `Icon`, and `getMobileHeaderState`.
- Preserve `Header({ config }: { config: Configuracoes })`.
- Produce a keyboard-accessible mobile menu control and desktop two-row navigation.

**Requirements:**
- Add reusable liquid-glass styling: translucent gradient, subtle border/highlight, blur fallback, reduced-motion override.
- Convert Header to a client component. Add a scroll listener (initialized from `window.scrollY`, removed on unmount) that uses `getMobileHeaderState`.
- Desktop: fixed logo-centered top bar, city at left, WhatsApp action at right; links in a separate second row below it.
- Mobile expanded: menu trigger left, centered official logo, WhatsApp right; a distinct navigation strip immediately below the top bar.
- Mobile after scroll >= 48px: only the navigation strip transitions upward out of view. The top bar remains fixed, lower opacity, readable, and accessible.
- Mobile menu trigger must be a real button using `aria-expanded` and `aria-controls`; it opens/closes the mobile links without duplicates or broken navigation.
- Footer must use `BrandLogo`; remove the current text-derived wordmark.
- Preserve existing `config` data and WhatsApp URL behavior. No emoji values in the modified Header.

**Verification:**
- Use test-first for any new pure logic; `header-state.test.ts` must remain green.
- Run focused tests, `npm.cmd run lint`, and `npm.cmd run build`; record actual output.
- Do not commit: checkout has no Git repository.
- Write full report to `.superpowers/sdd/task-2-report.md` with changed files, test output and self-review.
