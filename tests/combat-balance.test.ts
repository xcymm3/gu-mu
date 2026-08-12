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
  赵黎: {
    name: "赵黎",
    hp: 20,
    pattern: [
      { damage: 3 },
      { damage: 7 },
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
    ],
  },
};

type RoleDef = { id: string; name: string; hp: number; essence: number; atk: number };
const roles: RoleDef[] = [
  { id: "healer", name: "游方蛊医", hp: 14, essence: 12, atk: 3 },
  { id: "swordsman", name: "流浪剑修", hp: 15, essence: 10, atk: 4 },
  { id: "heir", name: "落魄世家子", hp: 12, essence: 10, atk: 3 },
];

// ── 回合级模拟 ──

type SimState = { hp: number; essence: number; enemyHp: number; turn: number };
type SimAction = "blood" | "armor" | "rest";

function validActions(essence: number): SimAction[] {
  return essence > 0 ? ["blood", "armor"] : ["rest"];
}

/** 模拟单回合，返回新状态或 null（无效行动/已结束则 null） */
function simulateTurn(
  state: SimState,
  action: SimAction,
  role: RoleDef,
  boss: BossDef,
): { state: SimState; won: boolean } | null {
  const intent = boss.pattern[state.turn % boss.pattern.length];

  // 验证行动合法性
  if (state.essence === 0 && action !== "rest") return null;
  if (state.essence > 0 && action === "rest") return null;

  let damage = role.atk;
  let received = intent.damage;

  if (action === "armor") {
    damage = 1;
    received = Math.max(0, received - 3);
  }
  if (action === "rest") {
    damage = 0;
  }

  // invulnerable 先于 reflect
  if (intent.invulnerable) damage = 0;
  const reflected = intent.reflect ? damage : 0;
  received += reflected;

  const enemyHp = state.enemyHp - Math.min(damage, state.enemyHp);
  const essence =
    action === "rest"
      ? Math.min(role.essence, state.essence + 3)
      : state.essence - 1;

  // 击杀判定
  if (enemyHp <= 0) {
    return { state: { ...state, essence, enemyHp: 0, turn: state.turn + 1 }, won: true };
  }

  let hp = state.hp - received;
  if (hp <= 0) {
    return { state: { ...state, hp, essence, enemyHp, turn: state.turn + 1 }, won: false };
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

    for (const action of validActions(state.essence)) {
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

test("确认：当前所有角色均无法击败赵黎和苏衍（需要后续强化）", () => {
  for (const role of roles) {
    for (const bossKey of ["赵黎", "苏衍"]) {
      const result = canWin(role, bosses[bossKey]);
      assert.equal(
        result.kind,
        "lose",
        `${role.name} 当前应无法击败 ${bossKey}（可通过强化来突破）`,
      );
    }
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
          `  ❌ ${boss.name}: 需要 ${parts.join(" / ")}（总和 +${boost.total}）才能通关`,
        );
      } else {
        console.log(`  ❌ ${boss.name}: 搜索范围(${30})内未找到可行提升`);
      }
    }
  }

  console.log();
  assert.ok(true); // 仅输出，不验证
});
