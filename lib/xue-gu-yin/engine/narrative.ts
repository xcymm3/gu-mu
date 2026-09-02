import { actBackgrounds, getCharacterExpressionAsset, type BackgroundAssetKey, type CharacterAssetKey, type SceneCgAssetKey } from "../assets.ts";
import type { AudioAssetKey } from "../audio.ts";
import type {
  BattleConfig,
  CharacterId,
  CharacterPosition,
  Choice,
  GameState,
  Scene,
  VisualNovelEvent,
} from "../model.ts";

const characterNames: Array<{ id: CharacterId; name: string }> = [
  { id: "zhao-li", name: "赵黎" },
  { id: "ji-qinghan", name: "纪清寒" },
  { id: "xue-feng", name: "薛逢" },
  { id: "su-ying", name: "苏莹" },
  { id: "qiao-wujiu", name: "乔无咎" },
  { id: "su-yan", name: "苏衍" },
];

const characterAssets = {
  "zhao-li": "character.zhao-li.neutral",
  "ji-qinghan": "character.ji-qinghan.neutral",
  "xue-feng": "character.xue-feng.neutral",
  "su-ying": "character.su-ying.neutral",
  "qiao-wujiu": "character.qiao-wujiu.neutral",
  "su-yan": "character.su-yan.neutral",
} as const;

export type ScenePresentation = {
  events: VisualNovelEvent[];
  beats: SceneBeat[];
  text: string;
  choices: Choice[];
  battle: BattleConfig | null;
  background: BackgroundAssetKey;
  sceneCg: SceneCgAssetKey | null;
  characters: PresentedCharacter[];
  visibleCharacters: CharacterId[];
};

export type SceneBeat = {
  kind: "narration" | "dialogue";
  text: string;
  speakerId: CharacterId | null;
  displayName: string;
  mode: "dialogue-box" | "center";
  background: BackgroundAssetKey;
  characters: PresentedCharacter[];
  transition: "cut" | "fade";
  effects: Array<{ effect: "fade" | "flash" | "shake" | "darken"; tone: "neutral" | "danger" }>;
  sounds: AudioAssetKey[];
};

export type PresentedCharacter = {
  id: CharacterId;
  asset: CharacterAssetKey;
  position: CharacterPosition;
  expression: string;
};

type ChoiceEvent = Extract<VisualNovelEvent, { type: "choice" }>;
type BattleEvent = Extract<VisualNovelEvent, { type: "battle" }>;
type BackgroundEvent = Extract<VisualNovelEvent, { type: "background" }>;
type CgEvent = Extract<VisualNovelEvent, { type: "cg" }>;

function isChoiceEvent(event: VisualNovelEvent): event is ChoiceEvent {
  return event.type === "choice";
}

function isBattleEvent(event: VisualNovelEvent): event is BattleEvent {
  return event.type === "battle";
}

function isBackgroundEvent(event: VisualNovelEvent): event is BackgroundEvent {
  return event.type === "background";
}

function isCgEvent(event: VisualNovelEvent): event is CgEvent {
  return event.type === "cg";
}

function resolveCharacters(events: VisualNovelEvent[]): PresentedCharacter[] {
  const visible = new Map<CharacterId, PresentedCharacter>();

  for (const event of events) {
    if (event.type === "character") applyCharacterEvent(visible, event);
    if (event.type === "dialogue") applyDialogueEvent(visible, event);
  }

  return [...visible.values()];
}

function applyDialogueEvent(visible: Map<CharacterId, PresentedCharacter>, event: Extract<VisualNovelEvent, { type: "dialogue" }>) {
  const previous = visible.get(event.speaker);
  const expression = event.expression ?? previous?.expression ?? "neutral";
  visible.set(event.speaker, {
    id: event.speaker,
    asset: getCharacterExpressionAsset(event.speaker, expression) ?? previous?.asset ?? characterAssets[event.speaker],
    position: event.position ?? previous?.position ?? "center",
    expression,
  });
}

function applyCharacterEvent(visible: Map<CharacterId, PresentedCharacter>, event: Extract<VisualNovelEvent, { type: "character" }>) {
  if (event.action === "hide") {
    visible.delete(event.character);
    return;
  }
  const previous = visible.get(event.character);
  const expression = event.expression ?? previous?.expression ?? "neutral";
  visible.set(event.character, {
    id: event.character,
    asset: event.asset ?? getCharacterExpressionAsset(event.character, expression) ?? previous?.asset ?? characterAssets[event.character],
    position: event.position ?? previous?.position ?? "center",
    expression,
  });
}

export function resolveSceneBeats(scene: Scene, events: VisualNovelEvent[]): SceneBeat[] {
  let background: BackgroundAssetKey = actBackgrounds[scene.act];
  let transition: "cut" | "fade" = "cut";
  const visible = new Map<CharacterId, PresentedCharacter>();
  const beats: SceneBeat[] = [];
  const pendingEffects: SceneBeat["effects"] = [];
  const pendingSounds: AudioAssetKey[] = [];

  for (const event of events) {
    if (event.type === "background") {
      background = event.asset;
      transition = event.transition ?? "cut";
      continue;
    }
    if (event.type === "character") {
      applyCharacterEvent(visible, event);
      continue;
    }
    if (event.type === "effect") {
      const effect = { effect: event.effect, tone: event.tone ?? "neutral" };
      if (beats.length) beats.at(-1)!.effects.push(effect);
      else pendingEffects.push(effect);
      continue;
    }
    if (event.type === "sound") {
      if (beats.length) beats.at(-1)!.sounds.push(event.asset);
      else pendingSounds.push(event.asset);
      continue;
    }
    if (event.type !== "narration" && event.type !== "dialogue") continue;
    if (event.type === "dialogue") applyDialogueEvent(visible, event);
    beats.push({
      kind: event.type,
      text: event.text,
      speakerId: event.type === "dialogue" ? event.speaker : null,
      displayName: event.type === "dialogue" ? event.displayName : "旁白",
      mode: event.type === "narration" ? event.mode ?? "dialogue-box" : "dialogue-box",
      background,
      characters: [...visible.values()].map((character) => ({ ...character })),
      transition,
      effects: pendingEffects.splice(0),
      sounds: pendingSounds.splice(0),
    });
    transition = "cut";
  }

  return beats;
}

function resolveLegacyText(state: GameState, scene: Scene): string {
  if (!scene.text) return "";
  return typeof scene.text === "function" ? scene.text(state) : scene.text;
}

function resolveBattleConfig(state: GameState, scene: Scene): BattleConfig | null {
  if (!scene.battle) return null;
  return typeof scene.battle === "function" ? scene.battle(state) : scene.battle;
}

function positionsFor(count: number): CharacterPosition[] {
  if (count <= 1) return ["center"];
  if (count === 2) return ["left", "right"];
  return ["left", "center", "right"];
}

function legacyCharacterEvents(text: string): VisualNovelEvent[] {
  const mentioned = characterNames
    .map((character) => ({ ...character, index: text.indexOf(character.name) }))
    .filter((character) => character.index >= 0)
    .sort((left, right) => left.index - right.index)
    .slice(0, 3);
  const positions = positionsFor(mentioned.length);
  return mentioned.map((character, index) => ({
    type: "character" as const,
    action: "show" as const,
    character: character.id,
    asset: characterAssets[character.id],
    position: positions[index],
    expression: "neutral",
  }));
}

function withDefaultBackground(scene: Scene, events: VisualNovelEvent[]): VisualNovelEvent[] {
  if (events.some((event) => event.type === "background")) return events;
  return [{ type: "background", asset: actBackgrounds[scene.act], transition: "fade" }, ...events];
}

/**
 * 将一个固定剧情节点解析为视觉小说事件序列。旧 Scene 会在这里被无损适配，
 * 新 Scene 则可以直接提供 events，两种格式在迁移期间可共存。
 */
export function resolveSceneEvents(state: GameState, scene: Scene): VisualNovelEvent[] {
  if (scene.events) {
    const nativeEvents = typeof scene.events === "function" ? scene.events(state) : scene.events;
    const events = withDefaultBackground(scene, nativeEvents);
    if (scene.battle && !events.some(isBattleEvent)) {
      const battle = resolveBattleConfig(state, scene);
      if (battle) events.push({ type: "battle", config: battle });
    }
    if (scene.choices?.length && !events.some(isChoiceEvent)) events.push({ type: "choice", choices: scene.choices });
    return events;
  }

  const text = resolveLegacyText(state, scene);
  const battle = resolveBattleConfig(state, scene);
  const events: VisualNovelEvent[] = [
    { type: "background", asset: actBackgrounds[scene.act], transition: "fade" },
    ...legacyCharacterEvents(text),
    { type: "narration", text, mode: "dialogue-box" },
  ];
  if (battle) events.push({ type: "battle", config: battle });
  if (scene.choices?.length) events.push({ type: "choice", choices: scene.choices });
  return events;
}

/** 供当前 React 表现层消费的兼容视图；第三步可直接消费 events。 */
export function resolveScenePresentation(state: GameState, scene: Scene): ScenePresentation {
  const events = resolveSceneEvents(state, scene);
  const beats = resolveSceneBeats(scene, events);
  const text = beats.map((beat) => beat.text).join("\n\n");
  const choiceEvent = [...events].reverse().find(isChoiceEvent);
  const battleEvent = [...events].reverse().find(isBattleEvent);
  const backgroundEvent = events.find(isBackgroundEvent);
  const cgEvent = events.find(isCgEvent);
  const characters = resolveCharacters(events);

  return {
    events,
    beats,
    text,
    choices: choiceEvent?.choices ?? [],
    battle: battleEvent?.config ?? null,
    background: backgroundEvent?.asset ?? actBackgrounds[scene.act],
    sceneCg: cgEvent?.asset ?? null,
    characters,
    visibleCharacters: characters.map((character) => character.id),
  };
}
