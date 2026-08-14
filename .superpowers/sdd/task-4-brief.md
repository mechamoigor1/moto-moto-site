### Task 4: Apply the official identity and SVGs to the admin panel

**Files:**
- Modify: `src/components/admin/Sidebar.tsx`
- Modify: `src/app/admin/login/page.tsx`
- Modify: all remaining admin `.tsx` files reported by `src/components/public/no-ui-emojis.test.ts`
- Modify: `src/components/public/no-ui-emojis.test.ts`
- Modify: `src/components/public/Header.tsx` to fix the recorded minor: SR text must say “Fechar menu de navegação” while open.

**Requirements:**
- Sidebar: use `BrandLogo` above the Admin caption; map links to IconName dashboard→chart, motos→motorcycle, marcas→tag, categorias→folder, contatos→mail, settings→settings.
- Login page: replace text brand with `<BrandLogo className="mx-auto h-20 w-auto" priority />`; preserve notice and form.
- Replace every remaining emoji in admin components/pages with closest local `Icon`. Never substitute a Unicode glyph.
- Restore scanner roots to both `src/app` and `src/components`, keep exact Unicode emoji range, then make it pass with no UI source matches.
- Preserve admin URLs, submissions, auth and data actions. Keep glass restrained to navigation/action surfaces.
- No icon packages/remotes or Git commits.

**Verification:**
- Run scanner RED before changes, scanner GREEN after changes, focused test(s), and lint with 120-second cap.
- Write full report to `.superpowers/sdd/task-4-report.md`.
