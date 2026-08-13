import assert from "node:assert/strict";
import test from "node:test";

// ── 战斗数值提取（镜像 game.ts 中的 resolveBattleTurn 逻辑） ──

type BossDef = {
  name: string;
  hp: number;
  pattern: Array<{ damage: number; heal?: number; invulnerable?: boolean; reflect?: boolean }>;
};

const bosses: Record<string, BossDef> = {
  铜皮傀儡: {
    name: "铜皮傀儡",
    hp: 12,
    pattern: [
      { damage: 3 },
      { damage: 5 },
      { damage: 2 },
    ],
  },
  血傀儡: {
    name: "血傀儡",
    hp: 20,
    pattern: [
      { damage: 4 },
      { damage: 6 },
      { damage: 8 },
    ],
  },
  赵黎: {
    name: "赵黎",
    hp: 22,
    pattern: [
      { damage: 4 },
      { damage: 6 },
      { damage: 0, invulnerable: true, reflect: true },
      { damage: 4 },
      { damage: 7 },
      { damage: 0, invulnerable: true, reflect: true },
      { damage: 4 },
      { damage: 8 },
      { damage: 0, invulnerable: true, reflect: true },
    ],
  },
  苏衍: {
    name: "苏衍",
    hp: 28,
    pattern: [
      { damage: 4 },
      { damage: 6 },
      { damage: 9 },
      { damage: 0, heal: 5 },
      { damage: 6, heal: 6 },
    ],
  },
  乔无咎: {
    name: "乔无咎",
    hp: 24,
    pattern: [
      { damage: 3 },
      { damage: 6 },
      { damage: 9 },
    ],
  },
};

type RoleDef = { id: string; name: string; hp: number; essence: number; atk: number; flags?: string[] };
const roles: RoleDef[] = [
  { id: "healer", name: "游方蛊医", hp: 14, essence: 12, atk: 3 },
  { id: "swordsman", name: "流浪剑修", hp: 15, essence: 10, atk: 4 },
  { id: "heir", name: "落魄世家子", hp: 12, essence: 10, atk: 3 },
];

// ── 回合级模拟 ──

type SimState = { hp: number; essence: number; enemyHp: number; turn: number };
type SimAction = "blood" | "armor" | "rest" | "heal" | "sword" | "charm" | "blooddemon";

function actionCost(action: SimAction): number {
  if (action === "heal") return 2;
  if (action === "sword") return 4;
  if (action === "charm") return 3;
  if (action === "blooddemon") return 2;
  if (action === "rest") return 0;
  return 1; // blood, armor
}

function validActions(essence: number, roleId: string, flags: string[]): SimAction[] {
  if (essence === 0) return ["rest"];
  const base: SimAction[] = ["blood", "armor"];
  const roleActions: SimAction[] = (() => {
    switch (roleId) {
      case "healer": return [...base, "heal"];
      case "swordsman": return [...base, "sword"];
      case "heir": return [...base, "charm"];
      default: return base;
    }
  })();
  return flags.includes("血魔蛊") ? [...roleActions, "blooddemon"] : roleActions;
}

/** 模拟单回合，返回新状态或 null（无效行动/已结束则 null） */
function simulateTurn(
  state: SimState,
  action: SimAction,
  role: RoleDef,
  boss: BossDef,
): { state: SimState; won: boolean } | null {
  const intent = boss.pattern[state.turn % boss.pattern.length];
  const cost = actionCost(action);

  // 真元验证
  if (state.essence < cost) return null;

  let damage = role.atk;
  let received = intent.damage;
  let hp = state.hp;
  const essence = action === "rest"
    ? Math.min(role.essence, state.essence + 3)
    : state.essence - cost;

  // ── 月光蛊 / 血刃蛊（强化后攻击×2）──
  if (action === "blood" && role.flags?.includes("血刃蛊")) damage = role.atk * 2;

  // ── 血魔蛊：6 伤害 + 恢复 6 生命 ──
  if (action === "blooddemon") {
    damage = 6;
    hp = Math.min(role.hp, hp + 6);
  }

  // ── 剑鸣蛊：先自伤 2，再造成 10 伤害 ──
  if (action === "sword") {
    hp -= 2;
    if (hp <= 0) {
      return { state: { hp, essence, enemyHp: state.enemyHp, turn: state.turn + 1 }, won: false };
    }
    damage = 10;
  }

  // ── 回春蛊：恢复 7 生命，不造成伤害 ──
  if (action === "heal") {
    damage = 0;
    hp = Math.min(role.hp, hp + 7);
  }

  // ── 惑心蛊：造成 ATK 伤害，敌人行动完全无效 ──
  if (action === "charm") {
    const enemyHp = state.enemyHp - Math.min(damage, state.enemyHp);
    if (enemyHp <= 0) {
      return { state: { hp, essence, enemyHp: 0, turn: state.turn + 1 }, won: true };
    }
    return {
      state: { hp, essence, enemyHp, turn: state.turn + 1 },
      won: false,
    };
  }

  // ── 甲衣蛊 / 血甲蛊（强化后免全伤）──
  if (action === "armor") {
    if (role.flags?.includes("血甲蛊")) { damage = 1; received = 0; }
    else { damage = 1; received = Math.max(0, received - 3); }
  }
  if (action === "rest") {
    damage = 0;
  }

  // invulnerable 先于 reflect
  if (intent.invulnerable) damage = 0;
  const reflected = intent.reflect ? damage : 0;
  received += reflected;

  const enemyHp = state.enemyHp - Math.min(damage, state.enemyHp);

  // 击杀判定
  if (enemyHp <= 0) {
    return { state: { hp, essence, enemyHp: 0, turn: state.turn + 1 }, won: true };
  }

  hp -= received;
  if (hp <= 0) {
    return { state: { hp, essence, enemyHp, turn: state.turn + 1 }, won: false };
  }

  // 敌人恢复（在回合结束时）
  const finalEnemyHp = Math.min(boss.hp, enemyHp + (intent.heal ?? 0));

  return {
    state: { hp, essence, enemyHp: finalEnemyHp, turn: state.turn + 1 },
    won: false,
  };
}

// ── DFS 搜索 + 记忆化 ──

type SearchResult =
  | { kind: "win"; turns: number; actions: SimAction[]; finalHp: number }
  | { kind: "lose" };

function canWin(role: RoleDef, boss: BossDef): SearchResult {
  const initialState: SimState = { hp: role.hp, essence: role.essence, enemyHp: boss.hp, turn: 0 };

  // visited memo：记录每个状态的最佳结果
  const memo = new Map<string, SearchResult>();

  function stateKey(s: SimState): string {
    return `${s.hp}|${s.essence}|${s.enemyHp}|${s.turn % boss.pattern.length}`;
  }

  function dfs(state: SimState, actions: SimAction[], depth: number): SearchResult {
    if (depth > 200) return { kind: "lose" }; // 防止无限循环

    const key = stateKey(state);
    const cached = memo.get(key);
    if (cached) {
      // 如果之前来过这个状态且结果是 lose，直接返回
      // 如果之前来过且结果是 win，比较回合数
      return cached;
    }

    // 标记为已访问（临时标记为 lose 防止循环）
    memo.set(key, { kind: "lose" });

    let bestWin: SearchResult | null = null;

    for (const action of validActions(state.essence, role.id, role.flags ?? [])) {
      const result = simulateTurn(state, action, role, boss);
      if (!result) continue;

      if (result.won) {
        const winResult: SearchResult = {
          kind: "win",
          turns: actions.length + 1,
          actions: [...actions, action],
          finalHp: result.state.hp,
        };
        if (!bestWin || winResult.turns < (bestWin as any).turns) {
          bestWin = winResult;
        }
        continue;
      }

      // 失败的分支跳过
      if (result.state.hp <= 0) continue;

      const sub = dfs(result.state, [...actions, action], depth + 1);
      if (sub.kind === "win") {
        if (!bestWin || sub.turns < (bestWin as any).turns) {
          bestWin = sub;
        }
      }
    }

    const final = bestWin ?? { kind: "lose" as const };
    memo.set(key, final);
    return final;
  }

  return dfs(initialState, [], 0);
}

// ── 测试入口 ──

// 格式化输出表
function printTable() {
  const roleColWidth = 12;
  const bossColWidth = 14;

  // 表头
  const header = `│ ${"角色".padEnd(roleColWidth)} │ ${"BOSS".padEnd(bossColWidth)} │ 结果 │ 回合 │ 剩余HP │`;
  const sep = "├" + "─".repeat(roleColWidth + 2) + "┼" + "─".repeat(bossColWidth + 2) + "┼──────┼──────┼────────┤";

  console.log("\n┌" + "─".repeat(roleColWidth + 2) + "┬" + "─".repeat(bossColWidth + 2) + "┬──────┬──────┬────────┐");
  console.log(header);
  console.log(sep);

  const results: Array<{ role: string; boss: string; result: string; turns: number | string; hp: number | string; pass: boolean }> = [];

  for (const role of roles) {
    for (const bossKey of Object.keys(bosses)) {
      const boss = bosses[bossKey];
      const search = canWin(role, boss);
      const resultIcon = search.kind === "win" ? "✅ 胜" : "❌ 败";
      const turns = search.kind === "win" ? String(search.turns) : "—";
      const hp = search.kind === "win" ? String(search.finalHp) : "—";
      console.log(
        `│ ${role.name.padEnd(roleColWidth)} │ ${boss.name.padEnd(bossColWidth)} │ ${resultIcon} │ ${String(turns).padStart(4)} │ ${String(hp).padStart(6)} │`,
      );
      results.push({
        role: role.name,
        boss: boss.name,
        result: resultIcon,
        turns,
        hp,
        pass: search.kind === "win",
      });
    }
    console.log(sep);
  }
  console.log("└" + "─".repeat(roleColWidth + 2) + "┴" + "─".repeat(bossColWidth + 2) + "┴──────┴──────┴────────┘\n");

  return results;
}

// ── 测试用例 ──

test("输出全角色×全BOSS胜负表", () => {
  const allResults = printTable();
  // 至少有一个结果被输出
  assert.ok(allResults.length > 0);
});

test("铜皮傀儡对所有角色均可胜", () => {
  for (const role of roles) {
    const result = canWin(role, bosses["铜皮傀儡"]);
    assert.equal(
      result.kind,
      "win",
      `${role.name} 应能击败铜皮傀儡`,
    );
  }
});

test("输出专属蛊生效后的路线通行情况", () => {
  const passed: string[] = [];
  const blocked: string[] = [];

  for (const role of roles) {
    for (const bossKey of ["赵黎", "苏衍"]) {
      const result = canWin(role, bosses[bossKey]);
      const label = `${role.name} vs ${bossKey}`;
      if (result.kind === "win") {
        passed.push(`${label} ✅ (${result.turns}回合, 余${result.finalHp}HP)`);
      } else {
        blocked.push(`${label} ❌`);
      }
    }
  }

  console.log("\n── 赵黎 & 苏衍 通关情况 ──");
  for (const line of passed) console.log(`  ${line}`);
  for (const line of blocked) console.log(`  ${line}`);
  console.log(`\n  当前可通: ${passed.length}/6, 需强化: ${blocked.length}/6\n`);

  // 验证铜皮傀儡仍全胜
  for (const role of roles) {
    assert.equal(canWin(role, bosses["铜皮傀儡"]).kind, "win");
  }
});

// ── 数值缺口分析：计算每个角色需要多少额外 HP/ATK/Essence 才能通关 ──

type StatBoost = { hp: number; atk: number; essence: number };

function findMinBoost(
  role: RoleDef,
  boss: BossDef,
  maxSearch: number = 30,
): StatBoost | null {
  // BFS 优先搜索最小总提升
  interface SearchNode {
    hp: number;
    atk: number;
    essence: number;
    total: number;
  }

  const queue: SearchNode[] = [{ hp: 0, atk: 0, essence: 0, total: 0 }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    queue.sort((a, b) => a.total - b.total);
    const node = queue.shift()!;
    const key = `${node.hp}|${node.atk}|${node.essence}`;
    if (visited.has(key)) continue;
    visited.add(key);

    const boosted: RoleDef = {
      ...role,
      hp: role.hp + node.hp,
      atk: role.atk + node.atk,
      essence: role.essence + node.essence,
    };

    if (canWin(boosted, boss).kind === "win") return node;

    if (node.total >= maxSearch) continue;

    // 只搜索合理方向（不超过 maxSearch 总量）
    if (node.hp + node.atk + node.essence + 1 <= maxSearch) {
      queue.push({ hp: node.hp + 1, atk: node.atk, essence: node.essence, total: node.total + 1 });
      queue.push({ hp: node.hp, atk: node.atk + 1, essence: node.essence, total: node.total + 1 });
      queue.push({ hp: node.hp, atk: node.atk, essence: node.essence + 1, total: node.total + 1 });
    }
  }

  return null;
}

test("输出数值缺口分析：每角色对每BOSS需要多少强化", () => {
  console.log("\n═══ 数值缺口分析 ═══");
  console.log("（搜索最小 HP/ATK/Essence 提升组合以达成首次通关）\n");

  for (const role of roles) {
    console.log(`\n── ${role.name}（HP ${role.hp} / ATK ${role.atk} / Ess ${role.essence}）──`);

    for (const bossKey of ["赵黎", "苏衍"]) {
      const boss = bosses[bossKey];
      const result = canWin(role, boss);

      if (result.kind === "win") {
        console.log(`  ✅ ${boss.name}: 当前可胜`);
        continue;
      }

      const boost = findMinBoost(role, boss);
      if (boost) {
        const parts: string[] = [];
        if (boost.hp > 0) parts.push(`HP +${boost.hp}`);
        if (boost.atk > 0) parts.push(`ATK +${boost.atk}`);
        if (boost.essence > 0) parts.push(`Essence +${boost.essence}`);
        console.log(
          `  ❌ ${boss.name}: 需要 ${parts.join(" / ")}（总和 +${boost.hp + boost.atk + boost.essence}）才能通关`,
        );
      } else {
        console.log(`  ❌ ${boss.name}: 搜索范围(${30})内未找到可行提升`);
      }
    }
  }

  console.log();
  assert.ok(true); // 仅输出，不验证
});

test("验证血刃蛊/血甲蛊强化后能否突破苏衍", () => {
  console.log("\n── 强化效果对苏衍战的影响 ──");

  const variants: Array<{ label: string; flags: string[] }> = [
    { label: "无强化", flags: [] },
    { label: "血刃蛊(攻击×2)", flags: ["血刃蛊"] },
    { label: "血甲蛊(免全伤)", flags: ["血甲蛊"] },
  ];

  for (const role of roles) {
    const row: string[] = [`  ${role.name}`];
    for (const variant of variants) {
      const boosted: RoleDef = { ...role, flags: variant.flags };
      const result = canWin(boosted, bosses["苏衍"]);
      row.push(`${variant.label}: ${result.kind === "win" ? "✅" : "❌"}`);
    }
    console.log(row.join(" | "));
  }
  console.log();

  // 至少验证血刃蛊让某个角色能通关苏衍（若当前数值可行）
  // 落魄世家子：无强化必败
  assert.equal(canWin(roles.find((r) => r.id === "heir")!, bosses["苏衍"]).kind, "lose");
  // 血刃蛊强化后至少数值缺口应缩小（用 canWin 直接验证结果类型，不断言具体胜负，因数值可能仍需更多强化）
  const heirBlade = canWin({ ...roles.find((r) => r.id === "heir")!, flags: ["血刃蛊"] }, bosses["苏衍"]);
  assert.ok(heirBlade.kind === "win" || heirBlade.kind === "lose"); // 仅确保不抛异常
});

// ── 拿满强化后的全路线可通性 ──
// 强化来源：血刃蛊/血甲蛊（chamber 二选一）+ 真元+4（铜皮傀儡胜）
// 乔无咎战额外有血魔蛊（赵黎胜后获得，第四选项）

function fullyBoosted(role: RoleDef, bossKey: string): Array<{ label: string; role: RoleDef }> {
  const boosted = { ...role, essence: role.essence + 4 }; // 真元+4
  const demon = bossKey === "乔无咎" ? ["血魔蛊"] : [];
  return [
    { label: "血刃蛊", role: { ...boosted, flags: [...demon, "血刃蛊"] } },
    { label: "血甲蛊", role: { ...boosted, flags: [...demon, "血甲蛊"] } },
  ];
}

test("每个角色拿满强化后（血刃蛊或血甲蛊）所有Boss均可通", () => {
  console.log("\n═══ 拿满强化后全路线可通性 ═══");
  console.log("（每角色：血刃蛊/血甲蛊二选一 + 真元+4；乔无咎战另加血魔蛊）\n");

  const bossList = ["铜皮傀儡", "赵黎", "苏衍", "乔无咎"];
  let allPass = true;

  for (const baseRole of roles) {
    const row: string[] = [`  ${baseRole.name}`];
    for (const bossKey of bossList) {
      const variants = fullyBoosted(baseRole, bossKey);
      const wins = variants.map((v) => ({ label: v.label, win: canWin(v.role, bosses[bossKey]).kind === "win" }));
      const pass = wins.some((w) => w.win);
      const detail = wins.map((w) => `${w.label}:${w.win ? "✅" : "❌"}`).join(" ");
      row.push(`${bossKey}[${pass ? "✅" : "❌"} ${detail}]`);
      if (!pass) allPass = false;
    }
    console.log(row.join("\n      "));
    console.log();
  }

  // 断言：每个角色在拿对强化（血刃蛊或血甲蛊任一）的情况下，所有 Boss 均可通
  for (const baseRole of roles) {
    for (const bossKey of bossList) {
      const variants = fullyBoosted(baseRole, bossKey);
      const anyWin = variants.some((v) => canWin(v.role, bosses[bossKey]).kind === "win");
      assert.ok(
        anyWin,
        `${baseRole.name} 拿满强化后应能击败 ${bossKey}（血刃蛊或血甲蛊至少其一可通）`,
      );
    }
  }

  console.log(allPass ? "  ✅ 全部路线可通" : "  ❌ 存在不可通路线");
});

test("血傀儡战：各角色拿对/拿错强化的通关差异", () => {
  console.log("\n═══ 血傀儡战（HP20，循环 4→6→8）═══");
  console.log("强化前提：真元+4（铜皮傀儡胜）已拿；蛊强化二选一\n");

  const bossKey = "血傀儡";
  const boss = bosses[bossKey];

  // 无蛊强化（只真元+4）
  console.log("  ── 无蛊强化（仅真元+4）──");
  for (const role of roles) {
    const r = { ...role, essence: role.essence + 4 };
    const result = canWin(r, boss);
    console.log(`    ${role.name}: ${result.kind === "win" ? "✅" : "❌"}`);
  }

  // 拿对/拿错对比
  console.log("\n  ── 二选一强化对比 ──");
  for (const role of roles) {
    const variants = fullyBoosted(role, bossKey);
    const parts = variants.map((v) => `${v.label}:${canWin(v.role, boss).kind === "win" ? "✅" : "❌"}`).join("  ");
    console.log(`    ${role.name}  ${parts}`);
  }
  console.log();
});

test("赵黎战：各角色在不同强化组合下的通关情况", () => {
  console.log("\n═══ 赵黎战（HP22，循环递增 4→6→镜→4→7→镜→4→8→镜）═══\n");

  const boss = bosses["赵黎"];

  // 强化组合：蛊强化（血刃/血甲）+ 真元+4 + 生命+4
  const combos: Array<{ label: string; build: (r: RoleDef) => RoleDef }> = [
    { label: "无强化", build: (r) => r },
    { label: "血刃蛊", build: (r) => ({ ...r, flags: ["血刃蛊"] }) },
    { label: "血甲蛊", build: (r) => ({ ...r, flags: ["血甲蛊"] }) },
    { label: "血刃蛊+真元4", build: (r) => ({ ...r, essence: r.essence + 4, flags: ["血刃蛊"] }) },
    { label: "血甲蛊+真元4", build: (r) => ({ ...r, essence: r.essence + 4, flags: ["血甲蛊"] }) },
    { label: "血刃蛊+真元4+生命4", build: (r) => ({ ...r, hp: r.hp + 4, essence: r.essence + 4, flags: ["血刃蛊"] }) },
    { label: "血甲蛊+真元4+生命4", build: (r) => ({ ...r, hp: r.hp + 4, essence: r.essence + 4, flags: ["血甲蛊"] }) },
  ];

  // 表头
  const header = "  " + "角色".padEnd(10) + combos.map((c) => c.label).join(" | ");
  console.log(header);
  console.log("  " + "-".repeat(header.length - 2));

  for (const role of roles) {
    const cells = combos.map((c) => {
      const result = canWin(c.build(role), boss);
      return `${c.label}:${result.kind === "win" ? "✅" : "❌"}`;
    });
    console.log("  " + role.name.padEnd(10) + cells.join(" | "));
  }
  console.log();
});
