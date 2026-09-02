# Manual visual review — visual-art-expansion-v1

- Reviewed at: 2026-09-02T12:45:19+08:00
- Reviewer phase: fix
- Production source state: commit `840d8ad3fe4477a165366a3dfc13cd75416af2c4`, with evidence-only fix changes in the current worktree
- Runtime basis: the current production export is fresh. `pnpm build` completed successfully, the complete production Playwright suite passed 16/16, and the isolated visual-art suite passed 5/5. The inspected runtime screenshots and matrices were regenerated from that export.

## Material reviewed

- `raw/contact-sheets/characters.png`, `cg.png`, `ui.png`, and `effects.png`, traced through `raw/contact-sheets/manifest.json`.
- Full-resolution representative character, CG, UI, and effect files for the six identities and all four formal-art classes.
- All main-menu/settings/saves viewport captures under `raw/screenshots/layout/`, with specific comparison of `844x390-settings.png` and `844x390-settings-bottom.png`.
- Representative route and ending captures under `raw/screenshots/routes-and-endings/`, including `cg-scene-suCoffin.png`.
- Player effect, request-fallback, reduced-motion, save restore, and combat captures under `raw/screenshots/save-and-combat/`, including `effect-blood-player.png`, `effect-request-fallback.png`, and `manual-load-restored.png`.

## Review findings

### Character art

- The 30-cell contact sheet contains 30 distinct compositions. Within each identity, face shape, hair, age, clothing palette, ornament language, weapon or gu-tool cues, and silhouette remain recognisable.
- Neutral, expression, injured, and battle semantics are visually distinguishable. No watermark, generated text, obvious extra limb, missing face, identity swap, or release-blocking crop defect was observed at contact-sheet scale or in the representative originals.
- Transparent edges remain usable against the dark stage. The runtime matrix contains all 30 expected keys and the current production screenshots show the assets without geometric stretching.
- Visual quality result: PASS for the manual portions of AC2 and AC6.

### CG art

- The 16-cell sheet contains nine ending compositions and seven scene compositions with distinct narrative staging. The four route climaxes clearly separate Zhao awakening, Ji destroying the gu core, Su at the coffin, and the traitor blood-taking scene.
- The inspected CGs preserve the dark tomb setting and intended relationships without watermarks, logos, modern objects, visible generated text, or a decisive narrative contradiction.
- Current runtime captures show the CG behind readable dialogue or ending panels without geometric stretching. Important subjects remain visible in the inspected Zhao, Ji, Su, traitor, and ending frames.
- Visual quality result: PASS for the manual portions of AC3 and AC6.

### UI art and layout

- Main menu, settings, and saves use three visually distinct tomb-themed images with a consistent ink, bronze, blood-red, fog, and stone visual language. Desktop text and controls remain readable over bounded low-noise panels.
- At 1366x768 and 1920x1080, headings, panels, and controls are readable. The 390x844 captures correctly show the rotation prompt rather than a clipped landscape interface.
- The repaired 844x390 settings view uses a fixed header and a bounded internal scroll region. In the top capture, theme controls and the beginning of the sound section are unobscured; in the bottom capture, reduced motion, ending records, and the full clear-record control are visible without overlap or self-clipping.
- The associated browser assertions confirm five non-overlapping groups, no child clipping, nonzero internal scrolling, final-control reachability, stable header bounds, and correct header hit-testing.
- Manual layout result: PASS for the manual portions of AC4 and AC8.

### Combat effects and degradation

- All seven effects are visually distinct, transparent, and readable against the combat stage. Player blood and enemy attack cues point toward different targets and sit above the stage and characters while leaving dialogue and controls legible.
- The current player-effect capture shows a clear hit direction without hiding the enemy identity or status. The request-abort capture preserves the stage, explicit text fallback, and usable controls without a permanent overlay.
- Reduced-motion and recovery evidence show bounded presentation and a usable next turn; the current isolated and complete production browser runs exercise all seven keys, ordering, request failure, reduced motion, and next-turn recovery without a remaining failure.
- Visual quality result: PASS for the manual portions of AC5 and AC6.

### Save/load and runtime composition

- The restored-save capture retains scene identity, character placement, dialogue readability, health display, and the intended dark tomb composition after loading.
- Current route, ending, save, and combat captures use the formal mapped assets rather than blank fields or visible placeholders. No release-blocking stretch, broken image, permanent overlay, or unreadable text was observed in the reviewed frames.
- Runtime visual result: PASS for the manual portions supporting AC7, AC9, and AC10.

### Forbidden-pattern candidate classification

- Matches in release tests are negative assertions and do not define release art.
- `vn-character-placeholder` is a non-art error/fallback state and is not registered in the 56-item formal manifest. Legacy CSS background/fallback branches likewise do not count as formal art.
- Screenshot-related strings belong to test/proof capture code, and the `.svg` candidate is the static server MIME table. No forbidden token was observed in a formal asset key, path, or alt.

## Manual conclusion

The current production export passes the manual visual review required by AC2, AC3, AC4, AC5, AC6, and AC8. The refreshed 844x390 settings top and bottom captures confirm that the prior overlap and reachability defect is repaired. The four contact sheets and representative runtime frames show coherent formal art, distinct required states and scenes, legible layering, and functioning non-art degradation behavior. No remaining manual visual gap is known; this review is consistent with the current all-PASS criterion evidence and remains subject to the next independent verifier's final verdict.
