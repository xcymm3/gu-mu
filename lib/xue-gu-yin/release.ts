import type { GameState, RoleId, Scene } from "./model.ts";

export const releaseMeta = {
  version: "0.2.0-rc.2",
  channel: "release-candidate",
  date: "2026-08-31",
} as const;

export const canonicalReleasePaths = {
  "赵黎力量线": ["gate", "rainMark", "bloodThreshold", "swarm", "shadow", "chamber", "illusion", "stoneBridge", "puppets", "fog", "zhaoTrail", "zhaoLesson", "zhaoPrice", "zhaoThreshold", "zhaoBloodGate", "zhaoBloodGuard", "zhaoAwakening", "zhaoDuel", "zhaoClaim", "zhaoQiaoDuel", "zhaoFall", "zhaoEpilogue", "ending"],
  "纪清寒关怀线": ["gate", "rainMark", "bloodThreshold", "swarm", "shadow", "chamber", "illusion", "stoneBridge", "puppets", "fog", "jiTrail", "jiPromise", "jiBurden", "jiThreshold", "jiBloodGate", "jiBloodGuard", "jiRescue", "jiArrayTruth", "jiQiaoDuel", "jiDestroyGu", "jiAftermath", "jiEpilogue", "ending"],
  "苏莹洞察线": ["gate", "rainMark", "bloodThreshold", "swarm", "shadow", "chamber", "illusion", "stoneBridge", "puppets", "fog", "suTrail", "suInscription", "suLineage", "suThreshold", "suBloodGate", "suBloodGuard", "suCoffin", "suMasterTruth", "suMasterDuel", "suCollapse", "suAftermath", "suEpilogue", "ending"],
  "乔无咎权谋线": ["gate", "rainMark", "bloodThreshold", "swarm", "shadow", "chamber", "illusion", "stoneBridge", "puppets", "fog", "traitorTrail", "traitorKnife", "traitorBargain", "traitorOath", "traitorControlRoom", "traitorTrapJi", "traitorSacrificeSu", "traitorQiaoTriumph", "traitorZhaoArrives", "traitorBloodTaken", "traitorDiscarded", "traitorDeath", "ending"],
} as const;

function sceneDestinations(scene: Scene, probeStates: GameState[]): string[] {
  const destinations = scene.choices?.map((choice) => choice.next) ?? [];
  const battle = scene.battle;
  if (!battle) return [...new Set(destinations)];
  const configs = typeof battle === "function"
    ? probeStates.map((state) => battle(state))
    : [battle];
  for (const config of configs) destinations.push(config.victoryNext, config.defeatNext);
  return [...new Set(destinations)];
}

export function validateStoryGraph(scenes: Record<string, Scene>, probeStates: GameState[]): string[] {
  const issues: string[] = [];
  const keys = new Set(Object.keys(scenes));
  for (const [key, scene] of Object.entries(scenes)) {
    if (scene.id !== key) issues.push(`${key}: 场景键与 id 不一致`);
    for (const destination of sceneDestinations(scene, probeStates)) {
      if (destination !== "ending" && !keys.has(destination)) issues.push(`${key}: 跳转目标 ${destination} 不存在`);
    }
  }

  const visited = new Set<string>();
  const queue = ["gate"];
  while (queue.length) {
    const current = queue.shift()!;
    if (visited.has(current) || !scenes[current]) continue;
    visited.add(current);
    queue.push(...sceneDestinations(scenes[current], probeStates).filter((next) => next !== "ending"));
  }
  for (const key of keys) if (!visited.has(key)) issues.push(`${key}: 无法从 gate 抵达`);
  return issues;
}

export function validateCanonicalPaths(scenes: Record<string, Scene>, probeStates: GameState[]): string[] {
  const issues: string[] = [];
  for (const [name, path] of Object.entries(canonicalReleasePaths)) {
    for (let index = 0; index < path.length - 1; index += 1) {
      const source = path[index];
      const destination = path[index + 1];
      if (!scenes[source]) {
        issues.push(`${name}: 缺少场景 ${source}`);
        continue;
      }
      if (!sceneDestinations(scenes[source], probeStates).includes(destination)) {
        issues.push(`${name}: ${source} 无法跳转到 ${destination}`);
      }
    }
  }
  return issues;
}

export function validateEndingAccess(
  endingIds: string[],
  access: Record<RoleId, string[]>,
): string[] {
  const known = new Set(endingIds);
  const issues: string[] = [];
  for (const [role, ids] of Object.entries(access)) {
    for (const id of ids) if (!known.has(id)) issues.push(`${role}: 引用了不存在的结局 ${id}`);
    if (new Set(ids).size !== ids.length) issues.push(`${role}: 结局列表存在重复项`);
  }
  return issues;
}
