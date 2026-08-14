# Task 5 verification report

Date: 2026-08-13 (America/Sao_Paulo)

Overall status: **NOT ACCEPTED / incomplete verification**. The unit suite and lint command completed successfully, including the global emoji scanner, header-state tests, and trash-icon tests. The production build exited 1 during `/admin/login` prerendering. Interactive desktop/mobile visual acceptance could not be completed because the browser-control runtime was unavailable in this agent session and the existing local Next development server became unhealthy while the mandated build used the same `.next` output directory.

No Git commands were used. No production source file was edited. The only file added by this verifier is this report.

## Mandated command evidence

Every command below was launched with an independent 120,000 ms tool timeout.

### 1. Full test suite

Command: `npm.cmd test`

- Exit code: `0`
- Wall time: `11.9s`
- Timeout status: completed normally; **not capped**
- Vitest output: `Test Files 6 passed (6)`, `Tests 18 passed (18)`, reported test duration `8.15s`

Exact summary:

```text
RUN  v4.1.10 C:/Users/Sancs/Desktop/moto-image-migration/moto-moto-site-main

Test Files  6 passed (6)
     Tests  18 passed (18)
  Duration  8.15s (transform 457ms, setup 0ms, import 3.52s, tests 135ms, environment 38.15s)
```

To prove the named tests were part of the full suite, a second fresh full-suite run used `npm.cmd test -- --reporter=verbose`:

- Exit code: `0`
- Wall time: `11.6s`
- Timeout status: completed normally; **not capped**
- Result: `6` files and `18` tests passed
- Header-state cases executed and passed:
  - `keeps the mobile header expanded before the compact threshold`
  - `makes the mobile header compact at the compact threshold`
- Trash-icon cases executed and passed:
  - `provides a typed trash icon with an SVG path`
  - `uses readable removal labels in the MotoForm control`
- Global scanner case executed and passed:
  - `UI emoji policy > does not use Unicode emoji in app or component TypeScript`

The scanner source defines its roots as `src/app` and `src/components`, recursively reads `.ts`/`.tsx` files, and applies `/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u`. Its passing assertion therefore found no matching Unicode emoji in either application-wide UI source root.

### 2. Lint

Command: `npm.cmd run lint`

- Exit code: `0`
- Wall time: `21.4s`
- Timeout status: completed normally; **not capped**
- Result: `0` errors, `1` warning

Exact diagnostic:

```text
src/app/layout.tsx
  52:11  warning  Using `<img>` could result in slower LCP and higher bandwidth.
  @next/next/no-img-element

✖ 1 problem (0 errors, 1 warning)
```

### 3. Production build

Command: `npm.cmd run build`

- Exit code: `1`
- Wall time: `105.8s`
- Timeout status: command failed before the 120s deadline; **not capped**
- Next.js version: `15.5.21`
- Compilation: `Compiled successfully in 43s`
- Type/lint phase: reached and printed the same single `no-img-element` warning
- Failure phase: static generation/prerendering at `/admin/login`

Exact failure excerpt:

```text
Collecting page data ...
Generating static pages (0/5) ...
TypeError: a[d] is not a function
    at Object.c [as require] (...\.next\server\webpack-runtime.js:1:127)
Error occurred prerendering page "/admin/login".
Export encountered an error on /admin/login/page: /admin/login, exiting the build.
Next.js build worker exited with code: 1 and signal: null
```

The build also warned that Next.js inferred the parent workspace root because both the workspace root and this project contain `package-lock.json` files. This is a warning, not the direct error printed at the failure point.

## Build-failure investigation (read-only)

An existing development server was identified from `.logs/next-dev-56965.out.log`:

```text
npm run dev
next dev --port 56965
Local: http://localhost:56965
Ready in 4.7s
```

The log showed earlier successful `200` responses for admin routes. After the production build wrote the same default `.next` directory, fresh read-only probes returned:

```text
HEAD http://127.0.0.1:56965/            -> 500 Internal Server Error
HEAD http://127.0.0.1:56965/admin/login -> 500 Internal Server Error
```

The live server then logged missing build artifacts:

```text
Error: Cannot find module './611.js'
Require stack:
- .next/server/webpack-runtime.js
- .next/server/app/admin/login/page.js

ENOENT: no such file or directory, open '.next/prerender-manifest.json'
```

`next.config.ts` does not configure a separate `distDir`; therefore the live `next dev` process and `next build` both used `.next`. The temporal sequence and missing/mismatched artifacts strongly support a concurrent `.next` output collision as the build/runtime failure mechanism. A clean isolated build was **not** run, so this mechanism is not claimed as definitively proven: confirming it would require stopping the user-owned server and clearing or isolating `.next`, actions outside this verification-only scope.

No production-code fix was attempted.

## Visual acceptance

Interactive visual status: **UNVERIFIED**.

The installed browser-control skill requires a Node browser-control runtime that was not exposed among the callable tools in this agent session. No alternate interactive browser was substituted. The existing local server was initially present on port `56965`, but after the required build shared its `.next` directory it returned only HTTP 500 responses. No prior desktop/mobile screenshots were present in the repository outside motorcycle seed images. The verifier did not stop, restart, or replace the user-owned server.

Consequently, these required visual claims are not made:

- Public desktop official centered logo
- Desktop menu positioned below the top bar
- Initial 390px mobile menu strip below the top bar
- At scroll `>=48px`, only the menu strip hides
- Compact top bar remains legible
- Admin login and sidebar visibly use the official mark
- No rendered emoji glyphs on inspected public/admin screens

Read-only source and test evidence is consistent with the intended UI, but is not treated as a substitute for visual inspection:

- `BrandLogo` renders `/brand/moto-moto-logo.svg` with `alt="Moto Moto"`; the SVG exists at `public/brand/moto-moto-logo.svg` and declares a `93 x 97` view box.
- `Header` uses a three-column grid with `BrandLogo` in the middle column, renders the `nav` after the top-bar block, and uses desktop `md:flex` navigation.
- Mobile compact state adds `-translate-y-full pointer-events-none opacity-0` only to `nav`; the separate fixed top bar remains rendered and changes to `opacity-80`.
- `getMobileHeaderState(47)` and `(48)` passed their expanded/compact boundary tests.
- `/admin/login` and `Sidebar` both instantiate `BrandLogo`.
- The global Unicode emoji scanner passed over all app/component TypeScript UI sources.

## Acceptance conclusion and limitations

- Tests: **PASS** (`18/18`; named scanner/header/trash cases confirmed in verbose full suite)
- Lint: **PASS WITH WARNING** (`0` errors, `1` warning)
- Build: **FAIL** (exit `1`, `/admin/login` prerender; not timeout-capped)
- Visual desktop/mobile acceptance: **NOT RUN / UNVERIFIED**
- Overall Task 5 acceptance: **FAIL / incomplete** until a clean isolated build succeeds and the required desktop plus 390px browser checks are performed against a healthy local server.
