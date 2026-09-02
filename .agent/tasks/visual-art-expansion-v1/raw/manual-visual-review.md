# Manual visual review — visual-art-expansion-v1

- Reviewed at: 2026-09-02T10:43:00+08:00
- Reviewer phase: evidence
- Source state: current worktree at `eeb58125a123511dffd85ca2b0173de6703e799f`
- Important runtime caveat: the fresh `pnpm build` failed during TypeScript checking, so browser screenshots produced afterward came from the pre-existing `out/` directory and are diagnostic rather than proof of a fresh production export. The complete browser suite passed 16/16; an isolated visual-art run then failed once waiting for `effect.enemy-attack`, and an immediate preserved retry passed 5/5.

## Material reviewed

- `raw/contact-sheets/characters.png`, `cg.png`, `ui.png`, and `effects.png`, traced through `raw/contact-sheets/manifest.json`.
- Full-resolution representative character files for all six identities, including battle, injured, panicked, and awakened states.
- Full-resolution representative CGs `deathByZhao` and `jiDestroyGu`.
- All twelve main-menu/settings/saves screenshots in `raw/screenshots/layout/`.
- Representative route climax and ending screenshots in `raw/screenshots/routes-and-endings/`.
- Player/enemy effect, request-fallback, save restore, and combat screenshots in `raw/screenshots/save-and-combat/`.

## Review findings

### Character art

- The 30-cell contact sheet contains 30 distinct compositions. Across each identity, face shape, hair, age, clothing palette, ornament language, and silhouette remain recognisable.
- Neutral/expression/injured/battle semantics are visually distinguishable. No watermark, generated text, obvious extra limb, missing face, or identity swap was observed at contact-sheet scale or in the representative originals.
- Transparent edges remain usable on the dark contact-sheet background. The green field shown by the local full-resolution viewer is the transparency inspection background, not part of the delivered WebP.
- Visual quality result: PASS for the manual portion of AC2 and AC6. The refreshed runtime matrix contains 30/30 expected keys with no missing key, but it was served from the pre-existing export after the current build failed.

### CG art

- The 16-cell sheet contains nine ending compositions and seven scene compositions with distinct hashes and distinct narrative staging.
- The four route climax images clearly separate Zhao awakening, Ji destroying the gu core, Su at the coffin, and the traitor blood-taking scene. The inspected ending images match their dark tomb outcomes and do not contain watermarks, logos, modern objects, or visible generated text.
- Runtime screenshots show the CG asset behind readable dialogue/ending panels without geometric stretching at 1366x768. Important subjects remain visible in the inspected Zhao/Ji/Su/traitor and ending frames.
- Visual quality result: PASS for the manual portion of AC3 and AC6. The refreshed runtime matrix contains 16/16 expected keys with no missing key, but it was served from the pre-existing export after the current build failed.

### UI art and layout

- Main menu, settings, and saves use three visually distinct tomb-themed images. Desktop screenshots at 1366x768 and 1920x1080 keep headings and controls readable, and the 390x844 screenshots show the intended rotation prompt.
- Main menu and saves are readable in the inspected 844x390 frames.
- The fresh 844x390 settings screenshot shows the sound area hidden behind the reduced-motion card, the ending-record heading overlapped, and the lower clear-record card clipped by the viewport. Because the automated check also reports no document scroll, the hidden controls are not recoverable by page scrolling.
- Manual layout result: FAIL for AC8 pending a fresh production screenshot and a fix or explicit non-overlap/scroll-reachability proof for the 844x390 settings view.

### Combat effects

- All seven effects are visually distinct, transparent, and readable against the combat stage. Player blood and enemy attack frames point toward different targets and sit above the stage/characters while leaving the dialogue and control layers readable.
- The request-abort frame preserves the stage, textual fallback, and controls without a permanent overlay. Reduced-motion evidence reports a bounded duration and a usable next turn.
- Visual quality result: PASS for the manual portion of AC5 and AC6. The full browser suite and isolated retry exercise all seven keys, ordering, reduced motion, request fallback, and next-turn recovery; one preserved isolated timing failure and the failed new production build keep the runtime result diagnostic rather than current-export proof.

### Forbidden-pattern candidate classification

- Matches in `tests/release.test.ts` are negative assertions and do not define release art.
- `vn-character-placeholder` matches in `XueGuYinGame.tsx` and `app/globals.css` are non-art error/fallback UI; they are not registered in the 56-item formal manifest.
- `vn-placeholder-*` CSS selectors are legacy scene/fallback styling outside the counted formal-art matrix; the typed formal manifest contains no forbidden key/path/alt according to the 98 passing Node tests and `raw/runtime-reference-report.json`.
- `kind: "css"` is the typed legacy background/fallback branch, not one of the four formal-art maps.
- Screenshot matches are test/proof capture code. The `.svg` match is only the static server MIME table. No forbidden token was observed in a formal 56-item key, path, or alt.

## Manual conclusion

Formal image quality and style review passes. The complete task does not pass this evidence iteration because the fresh production build fails on the formal asset-key type at `tests/e2e/full-routes.spec.ts:177`, the prescribed `pnpm exec playwright` command cannot resolve the Windows-local executable, one isolated effect run exposed a timing flake before its successful retry, and the 844x390 settings screenshot has confirmed control overlap and clipping. The complete browser suite nevertheless passed 16/16 and refreshed character 30/30 and CG 16/16 matrices from the pre-existing export.
