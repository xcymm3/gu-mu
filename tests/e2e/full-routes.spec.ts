import { expect, test as base, type Locator, type Page } from "@playwright/test";

import {
  applyChoice,
  canChoose,
  chooseRole,
  endings,
  getRole,
  resolveBattleTurn,
  resolveEnding,
  resolveRandomChoice,
  resolveScenePresentation,
  scenes,
  startBattle,
  type Choice,
  type GameState,
  type GuAction,
  type RoleId,
} from "../../lib/xue-gu-yin/game";

type BrowserDiagnostics = { failures: string[] };
type Fixtures = { browserDiagnostics: BrowserDiagnostics };
type BattleOutcome = "win" | "lose";
type FormalRoute = "zhao" | "ji" | "su" | "traitor";

const test = base.extend<Fixtures>({
  browserDiagnostics: async ({ page }, runFixture) => {
    const diagnostics: BrowserDiagnostics = { failures: [] };

    page.on("pageerror", (error) => diagnostics.failures.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") diagnostics.failures.push(`console.error: ${message.text()}`);
    });
    page.on("requestfailed", (request) => {
      diagnostics.failures.push(`requestfailed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? "unknown"})`);
    });
    page.on("response", (response) => {
      if (response.status() >= 400) diagnostics.failures.push(`response: ${response.status()} ${response.request().method()} ${response.url()}`);
    });

    await runFixture(diagnostics);
    expect.soft(diagnostics.failures, "全路线浏览器运行时不应出现错误或失败资源请求").toEqual([]);
  },
});

const roleLabels: Record<RoleId, string> = {
  healer: "游方蛊医",
  swordsman: "流浪剑修",
  heir: "世家之子",
};

const signatureActions: Record<RoleId, GuAction> = {
  healer: "heal",
  swordsman: "sword",
  heir: "charm",
};

const commonChoices: Record<FormalRoute | "trapped", string[]> = {
  zhao: ["gate-power", "rain-compassion", "threshold-power", "swarm-insight", "shadow-power", "chamber-power", "illusion-compassion", "bridge-power", "fog-power"],
  ji: ["gate-insight", "rain-compassion", "threshold-compassion", "swarm-insight", "shadow-scheme", "chamber-power", "illusion-compassion", "bridge-compassion", "fog-compassion"],
  su: ["gate-insight", "rain-scheme", "threshold-power", "swarm-insight", "shadow-scheme", "chamber-insight", "illusion-compassion", "bridge-compassion", "fog-insight"],
  traitor: ["gate-insight", "rain-scheme", "threshold-power", "swarm-scheme", "shadow-scheme", "chamber-power", "illusion-scheme", "bridge-compassion", "fog-scheme"],
  trapped: ["gate-power", "rain-compassion", "threshold-power", "swarm-insight", "shadow-power", "chamber-power", "illusion-compassion", "bridge-power", "fog-trapped"],
};

const actionOrder: GuAction[] = ["blooddemon", "sword", "charm", "blood", "heal", "armor", "rest"];

function battleStateKey(game: GameState): string {
  const battle = game.battle;
  return battle
    ? [game.health, game.essence, battle.enemyHealth, battle.turn, game.flags.includes("血魔蛊已用")].join(":")
    : `ended:${game.sceneId}`;
}

function findBattlePlan(game: GameState, outcome: BattleOutcome, maxDepth = 36): GuAction[] | null {
  const battle = game.battle;
  if (!battle) return null;
  const expectedScene = outcome === "win" ? battle.victoryNext : battle.defeatNext;
  const queue: Array<{ game: GameState; actions: GuAction[] }> = [{ game, actions: [] }];
  const visited = new Set([battleStateKey(game)]);
  const orderedActions = outcome === "win"
    ? actionOrder
    : ["armor", "blood", "sword", "charm", "heal", "blooddemon", "rest"] satisfies GuAction[];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.actions.length >= maxDepth) continue;

    for (const action of orderedActions) {
      const next = resolveBattleTurn(current.game, action);
      if (next === current.game) continue;
      const actions = [...current.actions, action];
      if (!next.battle) {
        if (next.sceneId === expectedScene) return actions;
        continue;
      }
      const key = battleStateKey(next);
      if (visited.has(key)) continue;
      visited.add(key);
      queue.push({ game: next, actions });
    }
  }

  return null;
}

function actionLabel(game: GameState, action: GuAction): string {
  if (action === "blood") return game.flags.includes("血刃蛊") ? "血刃蛊" : "月光蛊";
  if (action === "armor") return game.flags.includes("血甲蛊") ? "血甲蛊" : "甲衣蛊";
  if (action === "blooddemon") return "血魔蛊";
  if (action === "rest") return "调息";
  if (action === "heal") return "回春蛊";
  if (action === "sword") return "剑鸣蛊";
  return "惑心蛊";
}

function withResolvedEnding(game: GameState): GameState {
  return game.sceneId === "ending" && !game.endingId
    ? { ...game, endingId: resolveEnding(game) }
    : game;
}

class BrowserPlaythrough {
  readonly page: Page;
  game: GameState;
  private readonly savedGames = new Map<number, GameState>();

  constructor(page: Page) {
    this.page = page;
    this.game = chooseRole();
  }

  private get stage() {
    return this.page.getByLabel("血蛊引游戏界面");
  }

  async open() {
    await this.page.addInitScript(() => {
      window.localStorage.clear();
      Math.random = () => 0.75;
    });
    await this.page.goto("/");
    await expect(this.page.getByRole("heading", { name: "血蛊引", exact: true })).toBeVisible();
  }

  async selectRole(roleId: RoleId) {
    await this.page.getByRole("button", { name: /^开始游戏/ }).click();
    await this.page.getByRole("button", { name: new RegExp(roleLabels[roleId]) }).click();
    this.game = chooseRole(roleId);
    await this.expectCurrentScene();
  }

  private currentChoices(): Choice[] {
    const scene = scenes[this.game.sceneId];
    return resolveScenePresentation(this.game, scene).choices.filter((choice) => canChoose(this.game, choice));
  }

  private async expectCurrentScene() {
    const scene = scenes[this.game.sceneId];
    await expect(this.page.getByRole("heading", { name: scene.title, exact: true })).toBeVisible();
  }

  private async advanceUntilVisible(target: Locator, label: string, limit = 360) {
    for (let attempt = 0; attempt < limit; attempt += 1) {
      if (await target.isVisible()) return;
      await this.stage.click({ position: { x: 8, y: 8 } });
    }
    throw new Error(`推进 ${limit} 次后仍未出现：${label}（镜像场景 ${this.game.sceneId}）`);
  }

  private async settleAt(game: GameState, label: string) {
    const next = withResolvedEnding(game);
    const target = next.endingId
      ? this.page.getByRole("heading", { name: endings[next.endingId].name, exact: true })
      : this.page.getByRole("heading", { name: scenes[next.sceneId].title, exact: true });
    await this.advanceUntilVisible(target, label);
    this.game = next;
  }

  async takeChoice(choiceId?: string) {
    const choices = this.currentChoices();
    const rawChoice = choiceId ? choices.find((choice) => choice.id === choiceId) : choices[0];
    if (!rawChoice) throw new Error(`场景 ${this.game.sceneId} 找不到选择 ${choiceId ?? "<first>"}`);
    const choice = resolveRandomChoice(rawChoice, () => 0.75);
    const next = applyChoice(this.game, choice);
    const isLinear = this.game.routeLocked && choices.length === 1;

    if (isLinear) {
      await this.settleAt(next, `线性选择 ${choice.id} 的目标场景`);
      return;
    }

    const button = this.page.getByRole("navigation", { name: "剧情选项" }).getByRole("button", { name: rawChoice.label, exact: true });
    await this.advanceUntilVisible(button, `选择 ${choice.id}`);
    await button.click();
    if (choice.id === "chamber-insight") {
      await expect(this.page.getByText("甲纹蛊卵很快变得灰暗，血纹蛊卵内部却传出一声清晰的裂响。", { exact: true })).toBeVisible();
    }
    await this.settleAt(next, `选择 ${choice.id} 的目标场景或结局`);
  }

  async playBattle(outcome: BattleOutcome, options: { requiredFirstAction?: GuAction; expectNoWinningPlan?: boolean } = {}) {
    const scene = scenes[this.game.sceneId];
    const beginBattle = this.page.getByRole("button", { name: "放出本命蛊", exact: true });
    await this.advanceUntilVisible(beginBattle, `${scene.title} 战斗入口`);
    await beginBattle.click();
    this.game = startBattle(this.game, scene);
    const battle = this.game.battle;
    if (!battle) throw new Error(`场景 ${scene.id} 未能通过共享入口开启战斗`);
    await expect(this.page.getByText(battle.enemyName, { exact: true }).first()).toBeVisible();

    if (options.expectNoWinningPlan) {
      expect(findBattlePlan(this.game, "win"), `${getRole(this.game.roleId)?.name} 不应能击败 ${battle.enemyName}`).toBeNull();
    }

    let plan: GuAction[] | null;
    if (options.requiredFirstAction) {
      const afterRequired = resolveBattleTurn(this.game, options.requiredFirstAction);
      expect(afterRequired, `身份专属蛊 ${options.requiredFirstAction} 必须是有效公开行动`).not.toBe(this.game);
      const rest = afterRequired.battle
        ? findBattlePlan(afterRequired, outcome)
        : afterRequired.sceneId === (outcome === "win" ? battle.victoryNext : battle.defeatNext) ? [] : null;
      plan = rest ? [options.requiredFirstAction, ...rest] : null;
    } else {
      plan = findBattlePlan(this.game, outcome);
    }
    expect(plan, `${scene.title} 应存在可复现的${outcome === "win" ? "胜利" : "战败"}操作序列`).not.toBeNull();

    for (const action of plan!) {
      const label = actionLabel(this.game, action);
      const actionButton = this.page.getByRole("navigation", { name: "选择本回合蛊术" }).getByRole("button", { name: new RegExp(`^${label}，`) });
      await expect(actionButton).toBeEnabled();
      await actionButton.click();
      this.game = resolveBattleTurn(this.game, action);
    }

    await expect(this.page.getByRole("navigation", { name: "选择本回合蛊术" })).toBeHidden();
    await this.settleAt(this.game, `${battle.enemyName} ${outcome === "win" ? "胜利" : "战败"}结算`);
  }

  async runCommon(route: FormalRoute | "trapped", roleId: RoleId) {
    await this.selectRole(roleId);
    const choices = commonChoices[route];
    for (const choiceId of choices.slice(0, -1)) await this.takeChoice(choiceId);
    expect(this.game.sceneId).toBe("puppets");
    await this.playBattle("win", { requiredFirstAction: signatureActions[roleId] });
    expect(this.game.sceneId).toBe("fog");
    await this.takeChoice(choices.at(-1));
    if (route !== "trapped") expect(this.game.route).toBe(route);
  }

  async advanceToScene(sceneId: string) {
    for (let step = 0; step < 24 && this.game.sceneId !== sceneId; step += 1) {
      if (this.game.endingId) throw new Error(`抵达 ${sceneId} 前已进入结局 ${this.game.endingId}`);
      if (this.game.battle || scenes[this.game.sceneId].battle) throw new Error(`抵达 ${sceneId} 前遇到未处理战斗 ${this.game.sceneId}`);
      await this.takeChoice();
    }
    expect(this.game.sceneId, `应抵达场景 ${sceneId}`).toBe(sceneId);
  }

  async completeCurrentRoute(expectedEndingId: string) {
    for (let step = 0; step < 32 && !this.game.endingId; step += 1) {
      const scene = scenes[this.game.sceneId];
      if (scene.battle) await this.playBattle("win");
      else await this.takeChoice();
    }
    expect(this.game.endingId).toBe(expectedEndingId);
    await expect(this.page.getByRole("heading", { name: endings[expectedEndingId].name, exact: true })).toBeVisible();
  }

  async saveBattleCheckpoint(slotIndex = 0) {
    await this.advanceUntilVisible(this.page.getByRole("button", { name: "放出本命蛊", exact: true }), `${this.game.sceneId} 存档点`);
    await this.page.getByRole("button", { name: "打开游戏菜单", exact: true }).click();
    const menu = this.page.getByRole("dialog", { name: "游戏菜单" });
    const slot = menu.locator(".save-slot").nth(slotIndex);
    await slot.getByRole("button", { name: "存入", exact: true }).click();
    await expect(slot).toContainText(getRole(this.game.roleId)!.name);
    this.savedGames.set(slotIndex, this.game);
    await this.page.getByRole("button", { name: "关闭游戏菜单", exact: true }).click();
  }

  async loadBattleCheckpoint(slotIndex = 0) {
    const saved = this.savedGames.get(slotIndex);
    if (!saved) throw new Error(`存档位 ${slotIndex + 1} 没有镜像检查点`);
    await this.page.getByRole("button", { name: "返回主界面", exact: true }).click();
    await this.page.getByRole("button", { name: /^读取存档/ }).click();
    const slot = this.page.locator(".save-archive .save-slot").nth(slotIndex);
    await slot.getByRole("button", { name: "读取", exact: true }).click();
    this.game = saved;
    await this.expectCurrentScene();
    await expect(this.page.getByRole("button", { name: "放出本命蛊", exact: true })).toBeVisible();
  }

  async expectEnding(endingId: string) {
    expect(this.game.endingId).toBe(endingId);
    await expect(this.page.getByRole("heading", { name: endings[endingId].name, exact: true })).toBeVisible();
  }
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
});

test("赵黎路线以真实存档复现三场关键战斗胜败并通关", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  test.setTimeout(180_000);
  const run = new BrowserPlaythrough(page);
  await run.open();
  await run.runCommon("zhao", "swordsman");

  await run.advanceToScene("zhaoBloodGuard");
  await run.saveBattleCheckpoint();
  await run.playBattle("lose");
  await run.expectEnding("deathByBloodGuard");
  await run.loadBattleCheckpoint();
  await run.playBattle("win");

  await run.advanceToScene("zhaoDuel");
  await run.saveBattleCheckpoint();
  await run.playBattle("lose");
  await run.expectEnding("deathByZhao");
  await run.loadBattleCheckpoint();
  await run.playBattle("win");

  await run.advanceToScene("zhaoQiaoDuel");
  await run.saveBattleCheckpoint();
  await run.playBattle("lose");
  await run.expectEnding("deathByQiao");
  await run.loadBattleCheckpoint();
  await run.playBattle("win");
  await run.completeCurrentRoute("demon");

  await expect(page.locator(".ending-number")).toHaveText("04 / 09");
  await page.getByRole("button", { name: "返回主界面", exact: true }).click();
  await page.getByRole("button", { name: /^结局一览/ }).click();
  await expect(page.locator(".ending-entry.is-unlocked")).toHaveCount(4);
});

test("纪清寒路线由游方蛊医经公开行动通关", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  test.setTimeout(120_000);
  const run = new BrowserPlaythrough(page);
  await run.open();
  await run.runCommon("ji", "healer");
  await run.completeCurrentRoute("severed");
});

test("游方蛊医在苏莹路线无法击败墓主并进入对应结局", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  test.setTimeout(120_000);
  const run = new BrowserPlaythrough(page);
  await run.open();
  await run.runCommon("su", "healer");
  await run.advanceToScene("suBloodGuard");
  await run.playBattle("win");
  await run.advanceToScene("suMasterDuel");
  await run.playBattle("lose", { expectNoWinningPlan: true });
  await run.expectEnding("deathByMaster");
});

test("世家之子以固定随机结果完成苏莹真结局", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  test.setTimeout(120_000);
  const run = new BrowserPlaythrough(page);
  await run.open();
  await run.runCommon("su", "heir");
  await run.completeCurrentRoute("true");
});

test("乔无咎权谋路线无需战斗篡改即可完整通关", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  test.setTimeout(120_000);
  const run = new BrowserPlaythrough(page);
  await run.open();
  await run.runCommon("traitor", "heir");
  await run.completeCurrentRoute("traitor");
});

test("大雾超时选择可由真实页面解锁困墓结局", async ({ page, browserDiagnostics }) => {
  void browserDiagnostics;
  test.setTimeout(120_000);
  const run = new BrowserPlaythrough(page);
  await run.open();
  await run.runCommon("trapped", "swordsman");
  await run.expectEnding("trapped");
});
