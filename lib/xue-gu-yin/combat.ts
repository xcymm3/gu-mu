export type CombatRoleId = "healer" | "swordsman" | "heir";

export type GuAction =
  | "blood"
  | "armor"
  | "blooddemon"
  | "rest"
  | "heal"
  | "sword"
  | "charm";

export type CombatIntent = {
  damage: number;
  heal?: number;
  invulnerable?: boolean;
  reflect?: boolean;
  essenceDrain?: number;
};

export type CombatTurnInput = {
  action: GuAction;
  roleId: CombatRoleId;
  attack: number;
  health: number;
  maxHealth: number;
  essence: number;
  maxEssence: number;
  hasBloodBlade: boolean;
  hasBloodArmor: boolean;
  hasBloodDemon: boolean;
  enemyHealth: number;
  enemyMaxHealth: number;
  turn: number;
  intent: CombatIntent;
};

export type CombatTurnResult =
  | { valid: false }
  | {
      valid: true;
      status: "ongoing" | "won" | "lost";
      health: number;
      essence: number;
      enemyHealth: number;
      turn: number;
    };

export function actionCost(action: GuAction): number {
  if (action === "rest") return 0;
  if (action === "heal") return 2;
  if (action === "sword") return 4;
  if (action === "charm") return 3;
  if (action === "blooddemon") return 2;
  return 1;
}

function canUseAction(input: CombatTurnInput): boolean {
  if (input.action === "heal" && input.roleId !== "healer") return false;
  if (input.action === "sword" && input.roleId !== "swordsman") return false;
  if (input.action === "charm" && input.roleId !== "heir") return false;
  if (input.action === "blooddemon" && !input.hasBloodDemon) return false;

  const cost = actionCost(input.action);
  if (input.essence < cost) return false;
  if (input.essence === 0 && input.action !== "rest") return false;
  if (input.essence > 0 && input.action === "rest") return false;
  return true;
}

/**
 * 结算一个战斗回合。此函数不读取或修改外部状态，游戏运行时与数值测试
 * 必须共同调用它，避免两套战斗规则随改动逐渐产生差异。
 */
export function resolveCombatTurn(input: CombatTurnInput): CombatTurnResult {
  if (!canUseAction(input)) return { valid: false };

  const nextTurn = input.turn + 1;
  const cost = actionCost(input.action);
  let health = input.health;
  let damage = input.attack;
  let received = input.intent.damage;
  const essence = input.action === "rest"
    ? Math.min(input.maxEssence, input.essence + 3)
    : input.essence - cost;

  if (input.action === "blood" && input.hasBloodBlade) {
    damage = input.attack * 2;
  }

  if (input.action === "sword") {
    health -= 2;
    if (health <= 0) {
      return {
        valid: true,
        status: "lost",
        health,
        essence,
        enemyHealth: input.enemyHealth,
        turn: nextTurn,
      };
    }
    damage = 10;
  }

  if (input.action === "heal") {
    damage = 0;
    health = Math.min(input.maxHealth, health + 7);
  }

  if (input.action === "blooddemon") {
    damage = 6;
    health = Math.min(input.maxHealth, health + 6);
  }

  if (input.action === "charm") {
    const enemyHealth = input.enemyHealth - Math.min(damage, input.enemyHealth);
    return {
      valid: true,
      status: enemyHealth <= 0 ? "won" : "ongoing",
      health,
      essence,
      enemyHealth,
      turn: nextTurn,
    };
  }

  if (input.action === "armor") {
    damage = 1;
    received = input.hasBloodArmor ? 0 : Math.max(0, received - 3);
  }

  if (input.action === "rest") damage = 0;

  // 血幕会先映出本次攻势，再令本体免疫，因此反弹量取免疫前伤害。
  const reflected = input.intent.reflect ? damage : 0;
  if (input.intent.invulnerable) damage = 0;
  received += reflected;

  const enemyHealth = input.enemyHealth - Math.min(damage, input.enemyHealth);
  if (enemyHealth <= 0) {
    return {
      valid: true,
      status: "won",
      health,
      essence,
      enemyHealth,
      turn: nextTurn,
    };
  }

  health -= received;
  if (health <= 0) {
    return {
      valid: true,
      status: "lost",
      health,
      essence,
      enemyHealth,
      turn: nextTurn,
    };
  }

  return {
    valid: true,
    status: "ongoing",
    health,
    essence: Math.max(0, essence - (input.intent.essenceDrain ?? 0)),
    enemyHealth: Math.min(input.enemyMaxHealth, enemyHealth + (input.intent.heal ?? 0)),
    turn: nextTurn,
  };
}
