# Problems: visual-art-expansion-v1

Fresh verdict: `FAIL`. AC6 is the only criterion independently verified as `PASS`; every criterion below needs a fresh fix/reverification cycle.

## Shared reproductions

1. Run `pnpm build`: TypeScript fails at `tests/e2e/full-routes.spec.ts:177:51` because `key` is still `string` when passed to the formal asset-key lookup.
2. Compare `out/index.html` timestamp with the current source/test timestamps: the retained export predates the failed build.
3. Open `raw/screenshots/layout/844x390-settings.png`: the sound controls are covered, the ending-record heading is overlapped, and the lower card is clipped.
4. Run `pnpm exec playwright test tests/e2e/visual-art-expansion.spec.ts --reporter=line`: this process exits 1 because `playwright` is not resolved, even though `node_modules/.bin/playwright.CMD` exists.

### AC1: 可审计的资源合同与运行时清单

- Status: `UNKNOWN`
- Why it is not proven: current-source runtime reachability and request health were not tested from a fresh production export.
- Expected: `pnpm build` succeeds and the runtime matrices/failed-request audit run against the newly generated `out/`.
- Actual: the build fails; browser reports came from retained `out/`.
- Affected files: `tests/e2e/full-routes.spec.ts`, then regenerated runtime proof files.
- Smallest safe fix: narrow the DOM `data-asset-key` string with a real type guard before calling the formal asset lookup; rebuild, remove any ambiguity about export freshness, and rerun the runtime audits.

### AC2: 六名角色的 30 格状态矩阵完整且身份一致

- Status: `UNKNOWN`
- Why it is not proven: visual/manual and retained-export 30/30 evidence pass, but fresh runtime triggering is missing.
- Expected: 30/30 keys are visibly requested from a newly generated export.
- Actual: 30/30 was observed only in the retained export after build failure.
- Affected files: `tests/e2e/full-routes.spec.ts`, `raw/character-runtime-matrix.json`, route screenshots.
- Smallest safe fix: apply the shared type-narrowing fix, rebuild, and regenerate the 30-cell runtime matrix from that export without changing the art.

### AC3: 九结局与七个关键节点的 16 张独立 CG 完整接入

- Status: `UNKNOWN`
- Why it is not proven: visual/manual and retained-export 16/16 evidence pass, but fresh current-source runtime display is missing.
- Expected: all 16 CG keys are reached and requested from a newly generated export.
- Actual: 16/16 was observed only in retained `out/`.
- Affected files: `tests/e2e/full-routes.spec.ts`, `raw/cg-runtime-matrix.json`, route/ending screenshots.
- Smallest safe fix: fix the build typing error, rebuild, and regenerate the 16-key matrix/screenshots from the new export.

### AC4: 首页、设置页、存档页完成统一美术重做

- Status: `FAIL`
- Why it is not proven: the required 844x390 settings page visibly overlaps and clips functional controls.
- Expected: all sound, reduced-motion, ending-record, and clear-record controls remain readable and reachable.
- Actual: the reduced-motion card overlays sound controls; lower sections overlap or leave the viewport.
- Affected files: `app/globals.css` mobile-landscape rules for `.settings-shell`, `.settings-card`, and `.settings-list`.
- Smallest safe fix: give the settings content a correctly sized internal scroll region or compact the 844x390 layout so header and every control occupy non-overlapping boxes; add a bounding-box/reachability assertion that fails on the current screenshot.

### AC5: 七类战斗位图特效具备触发、层级、时序与降级

- Status: `UNKNOWN`
- Why it is not proven: the full retained-export suite passes all seven flows, but no fresh current-source export was exercised and the prescribed isolated command does not launch.
- Expected: full and isolated effect checks pass against newly built `out/`.
- Actual: full suite passes retained `out/`; isolated command exits before tests start.
- Affected files: `tests/e2e/visual-art-expansion.spec.ts`, production build chain, Windows Playwright invocation environment.
- Smallest safe fix: first restore a fresh build, then rerun the full effect test from new `out/`; reproduce the launcher failure under the supervisor and restore normal `.CMD` resolution (or use the contract-approved portable package-script entry without weakening assertions).

### AC7: 压缩、解码、加载预算和资源卫生达标

- Status: `UNKNOWN`
- Why it is not proven: static sizes, hashes, and 64/64 decoding pass, but the first-load network budget is not from a fresh export.
- Expected: a clean browser context measures the newly built homepage before interaction.
- Actual: the 33,040-byte homepage observation is against retained `out/`.
- Affected files: build error in `tests/e2e/full-routes.spec.ts`, then `raw/network-budget.json`.
- Smallest safe fix: fix the type error, build fresh, rerun the network-budget test, and record the new export timestamp/hash with the result.

### AC8: 桌面与手机布局、可读性和动态偏好合格

- Status: `FAIL`
- Why it is not proven: the 844x390 settings viewport violates no-overlap/no-truncation requirements.
- Expected: every primary setting remains readable, focusable, and reachable without clipping.
- Actual: sound and ending-record content overlap; the lower danger card is clipped.
- Affected files: `app/globals.css`, `tests/e2e/visual-art-expansion.spec.ts`.
- Smallest safe fix: correct the mobile-landscape settings sizing/scrolling and extend the test from global overflow only to pairwise overlap, viewport reachability, and internal-scroll assertions.

### AC9: 四条路线、七个关键节点和九个结局可由真实页面验证

- Status: `UNKNOWN`
- Why it is not proven: the 16-test route suite passes, but it served an export older than the current failing build.
- Expected: all route/node/ending checks and screenshots come from the just-built export.
- Actual: reports/screenshots are fresh executions against stale application output.
- Affected files: `tests/e2e/full-routes.spec.ts`, route/ending raw artifacts.
- Smallest safe fix: fix the type narrowing, rebuild, then rerun the route suite and preserve an export freshness marker with the matrices/screenshots.

### AC10: 存档/读档与战斗全链路无回归

- Status: `UNKNOWN`
- Why it is not proven: unit and browser flows pass, but browser proof is not tied to the current source export.
- Expected: manual/quick save-load, version-6 compatibility, seven effects, victory/failure, and reduced-motion flows pass on new `out/`.
- Actual: those browser flows pass retained `out/` only.
- Affected files: build error in `tests/e2e/full-routes.spec.ts`, then save/combat raw reports and screenshots.
- Smallest safe fix: restore the fresh build and rerun the existing save/combat suite unchanged against the new export.

### AC11: 自动化质量门与生产静态导出全部通过

- Status: `FAIL`
- Why it is not proven: two mandatory commands exit nonzero.
- Expected: `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm test:e2e:run`, and the isolated visual command all exit 0 in order.
- Actual: unit/lint/full retained-export E2E pass; build fails with TS2345; isolated Playwright fails to resolve its executable.
- Affected files: `tests/e2e/full-routes.spec.ts`; supervisor/Windows command resolution for `node_modules/.bin/playwright.CMD`.
- Smallest safe fix: add a proper type guard for the asset key and verify `pnpm build`; separately restore normal Windows `.CMD` resolution or use a portable, frozen-contract-compatible package entry, then run the commands in order so E2E necessarily consumes the newly built export.

### AC12: criterion-level proof 完整且可由新鲜验证器复现

- Status: `FAIL`
- Why it is not proven: both validators pass the schema/path checks, but the acceptance gate requires AC1–AC12 and every mandatory command to pass.
- Expected: all criteria are `PASS`, all commands exit 0, and proof is regenerated from the fresh export.
- Actual: AC4, AC8, and AC11 fail; several runtime criteria remain unknown.
- Affected files: the shared code/test fixes above, followed by `evidence.md`, `evidence.json`, and relevant `raw/` artifacts in the fix/evidence phase.
- Smallest safe fix: repair the build and 844x390 layout, resolve the isolated command, regenerate browser proof from new `out/`, update criterion statuses honestly, and rerun both proof validators before fresh verification.
