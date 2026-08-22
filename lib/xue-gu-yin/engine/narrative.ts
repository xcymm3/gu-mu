import { actBackgrounds, type BackgroundAssetKey, type CharacterAssetKey } from "../assets.ts";
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
  "zhao-li": "character.zhao-li.placeholder",
  "ji-qinghan": "character.ji-qinghan.placeholder",
  "xue-feng": "character.xue-feng.placeholder",
  "su-ying": "character.su-ying.placeholder",
  "qiao-wujiu": "character.qiao-wujiu.placeholder",
  "su-yan": "character.su-yan.placeholder",
} as const;

export type ScenePresentation = {
  events: VisualNovelEvent[];
  text: string;
  choices: Choice[];
  battle: BattleConfig | null;
  background: BackgroundAssetKey;
  characters: PresentedCharacter[];
  visibleCharacters: CharacterId[];
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

function isChoiceEvent(event: VisualNovelEvent): event is ChoiceEvent {
  return event.type === "choice";
}

function isBattleEvent(event: VisualNovelEvent): event is BattleEvent {
  return event.type === "battle";
}

function isBackgroundEvent(event: VisualNovelEvent): event is BackgroundEvent {
  return event.type === "background";
}

function resolveCharacters(events: VisualNovelEvent[]): PresentedCharacter[] {
  const visible = new Map<CharacterId, PresentedCharacter>();

  for (const event of events) {
    if (event.type !== "character") continue;
    if (event.action === "hide") {
      visible.delete(event.character);
      continue;
    }
    const previous = visible.get(event.character);
    visible.set(event.character, {
      id: event.character,
      asset: event.asset ?? previous?.asset ?? characterAssets[event.character],
      position: event.position ?? previous?.position ?? "center",
      expression: event.expression ?? previous?.expression ?? "neutral",
    });
  }

  return [...visible.values()];
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
    return withDefaultBackground(scene, nativeEvents);
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
  const text = events
    .flatMap((event) => event.type === "narration"
      ? [event.text]
      : event.type === "dialogue"
        ? [`${event.displayName}：${event.text}`]
        : [])
    .join("\n\n");
  const choiceEvent = [...events].reverse().find(isChoiceEvent);
  const battleEvent = [...events].reverse().find(isBattleEvent);
  const backgroundEvent = events.find(isBackgroundEvent);
  const characters = resolveCharacters(events);

  return {
    events,
    text,
    choices: choiceEvent?.choices ?? [],
    battle: battleEvent?.config ?? null,
    background: backgroundEvent?.asset ?? actBackgrounds[scene.act],
    characters,
    visibleCharacters: characters.map((character) => character.id),
  };
}
