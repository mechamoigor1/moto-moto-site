### Task 5: Verify application integrity and visual acceptance

**Scope:** Read-only verification unless a concrete defect is discovered. Do not change production code without reporting the defect.

**Requirements:**
- Run `npm.cmd test`, `npm.cmd run lint`, and `npm.cmd run build` with a 120-second cap each; record exit codes and output.
- Confirm scanner globally passes and header-state plus trash-icon tests run in the full suite.
- Use the running local Next server if available to inspect public desktop and 390px mobile. Check official centered logo, desktop menu below top bar, initial mobile menu below top bar, scroll ≥48px hides only menu strip, compact top bar remains legible, and admin login/sidebar brand use the official mark.
- Visually confirm no emoji glyphs in public/admin inspected screens.
- Do not use Git or mutate app code. Write report `.superpowers/sdd/task-5-report.md` with exact evidence and any limitation.
