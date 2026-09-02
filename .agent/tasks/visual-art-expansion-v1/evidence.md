# Evidence: visual-art-expansion-v1

## Overall

`PASS candidate`. The fix cycle restored a fresh production static export, regenerated all browser matrices and screenshots from that export, and passed the prescribed isolated Playwright command. The 844x390 settings view now uses a bounded internal scroll region with a fixed header; automated pairwise-overlap, child-clipping, bottom-reachability, and hit-testing checks pass, and fresh top/bottom screenshots show all controls reachable without overlap. The manual visual review was then rerun against the current `840d8ad` worktree, regenerated contact sheets, and current-export screenshots, replacing the superseded pre-fix observations. This is evidence, not the independent final verdict.

## Fresh command results

| Command | Exit | Result |
| --- | ---: | --- |
| `pnpm build` | 0 | Next.js 16.3.0 production static export completed; fresh `out/index.html` created |
| `pnpm test` | 0 | 98/98 passed |
| `pnpm lint` | 0 | Passed |
| `pnpm proof:visual:static` | 0 | 56 unique assets, 5,165,122 bytes, four contact sheets |
| `pnpm exec playwright test tests/e2e/visual-art-expansion.spec.ts --reporter=line` | 0 | 5/5 passed in 39.2 seconds against fresh `out/` |
| `pnpm test:e2e:run` | 0 | 16/16 passed in 7.9 minutes against fresh `out/` |
| proof structure validation | 0 | Repository proof validator and deadline-carl evidence validator pass after refresh |

The exact command sequence and results for this fix cycle are recorded in `raw/fix-001-command-results.txt`; production E2E regenerated the runtime JSON and screenshots in place.

## Criterion summary

| AC | Status | Direct conclusion |
| --- | --- | --- |
| AC1 | PASS | Typed 56-item contract, static audits, request diagnostics, and fresh runtime matrices pass. |
| AC2 | PASS | Manual identity review passes and fresh runtime matrix is 30/30 with no missing keys. |
| AC3 | PASS | Manual narrative review passes and fresh runtime matrix is 16/16 with no missing keys. |
| AC4 | PASS | Three formal UI artworks render; 844x390 controls are non-overlapping and fully reachable by internal scroll. |
| AC5 | PASS | Seven effects, ordering, duration, reduced motion, request failure, and next-turn recovery pass twice freshly. |
| AC6 | PASS | 56/56 ImageGen traces, contact sheets, originals, style review, and decode evidence pass. |
| AC7 | PASS | Decode/hash/size budgets pass; fresh homepage loads one formal image totaling 33,040 bytes. |
| AC8 | PASS | Four contract viewports, focus, reduced motion, internal-scroll reachability, and visual baselines pass. |
| AC9 | PASS | Fresh public-UI suite covers four routes, seven nodes, and nine endings with no missing keys. |
| AC10 | PASS | Six-slot/manual/quick save-load, version-6 migration, battles, effects, and degradation flows pass. |
| AC11 | PASS | Unit, lint, build, isolated visual E2E, complete E2E, and static proof commands all exit 0. |
| AC12 | PASS | Criterion-level evidence and the manual visual review now describe the current export consistently; both proof validators pass. |

## Key fresh artifacts

- Static: `raw/asset-inventory.json`, `raw/image-audit.txt`, `raw/file-hashes.txt`, `raw/file-sizes.txt`, `raw/runtime-reference-report.json`.
- Runtime: `raw/character-runtime-matrix.json` (30/30), `raw/cg-runtime-matrix.json` (16/16), `raw/ui-runtime-report.json` (12 observations), `raw/effect-runtime-matrix.json`, `raw/network-budget.json` (33,040 bytes).
- Visual: four files under `raw/contact-sheets/`; fresh screenshots under `raw/screenshots/`, including `layout/844x390-settings.png` and `layout/844x390-settings-bottom.png`; `raw/manual-visual-review.md`.
- Reproduction: `raw/fix-001-command-results.txt`, `raw/fix-002-command-results.txt`, `raw/command-metadata.json`, and `raw/checkpoints/`.

## Remaining gate

No implementation or evidence gap is known. A fresh independent verifier must still rerun the required commands and write the final verdict from the current repository state.
