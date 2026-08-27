"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { XueGuYinMark } from "@/components/XueGuYinMark";
import { useVisualNovelAudio, type VisualNovelAudioEngine } from "@/features/xue-gu-yin/audio/VisualNovelAudio";
import { getVisualAsset, visualAssetManifest, type BackgroundAssetKey } from "@/lib/xue-gu-yin/assets";
import { defaultAudioSettings, sanitizeAudioSettings, sceneAudioProfile, type AudioAssetKey, type AudioSettings, type SfxAssetKey } from "@/lib/xue-gu-yin/audio";
import { actionCost } from "@/lib/xue-gu-yin/combat";
import { appendBacklog, autoAdvanceDelay, canRunReadingMode, readingFrameKey, type BacklogEntry } from "@/lib/xue-gu-yin/reading";
import { releaseMeta } from "@/lib/xue-gu-yin/release";
import { createSaveSlot, emptySaveSlots, isSaveSlot, normalizeSaveSlots, restoreSaveSlot, SAVE_SLOT_COUNT, type SaveSlot, type SaveSlots } from "@/lib/xue-gu-yin/save";
import {
  applyChoice,
  canChoose,
  chooseRole,
  endings,
  getEnemyCondition,
  getRole,
  initialGame,
  resolveBattleTurn,
  resolveEnding,
  resolveRandomChoice,
  resolveScenePresentation,
  roles,
  scenes,
  storyMeta,
  storyPresentation,
  startBattle,
  type Choice,
  type GameState,
  type GuAction,
  type PresentedCharacter,
  type RoleId,
  type SceneBeat,
} from "@/lib/xue-gu-yin/game";

function bloodGuAction(flags: string[]): { id: GuAction; name: string; description: string } {
  return flags.includes("血刃蛊")
    ? { id: "blood" as const, name: "血刃蛊", description: "血煞凝锋，锋芒较前更甚。" }
    : { id: "blood" as const, name: "月光蛊", description: "以月光凝作锋刃，直取近处敌手。" };
}

function signatureGuAction(roleId: RoleId): { id: GuAction; name: string; description: string } {
  switch (roleId) {
    case "healer": return { id: "heal" as const, name: "回春蛊", description: "运蛊疗愈，温养周身伤处。" };
    case "swordsman": return { id: "sword" as const, name: "剑鸣蛊", description: "先伤己身，再以蛊御剑，重创敌手。" };
    case "heir": return { id: "charm" as const, name: "惑心蛊", description: "迷乱敌手心智，令其一击落空。" };
  }
}
const names = new Set(storyPresentation.names);
const criticalTerms = new Set(storyPresentation.criticalTerms);
const endingStorageKey = "xue-gu-yin-unlocked-endings-v1";
const motionStorageKey = "xue-gu-yin-reduce-motion";
const themeStorageKey = "xue-gu-yin-theme";
const saveStorageKey = "xue-gu-yin-save-slots-v2";
const readStorageKey = "xue-gu-yin-read-frames-v1";
const quickSaveStorageKey = "xue-gu-yin-quick-save-v1";
const audioStorageKey = "xue-gu-yin-audio-settings-v1";
type HomeView = "menu" | "roles" | "archive" | "saves" | "settings";
type ThemePreference = "system" | "light" | "dark";
type BattleFeedback = { result: string; nextCue?: string; enemyCondition: string; hasEnded: boolean; emphasis?: "danger" | "success" };
type StageEffect = { effect: "fade" | "flash" | "shake" | "darken"; tone: "neutral" | "danger" };
function readSaveSlots(): SaveSlots {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(saveStorageKey) ?? "[]") as unknown;
    return normalizeSaveSlots(parsed);
  } catch { return emptySaveSlots(); }
}

function saveSlotLabel(slot: SaveSlot) {
  const role = getRole(slot.game.roleId);
  const scene = scenes[slot.game.sceneId];
  return { role: role?.name ?? "无名修士", scene: scene ? `${scene.chapter} · ${scene.title}` : "墓道深处" };
}

function formatSaveTime(savedAt: string) {
  const time = new Date(savedAt);
  return Number.isNaN(time.valueOf()) ? "时间不明" : time.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function splitParagraphs(text: string) {
  const blocks = text.split(/\n{2,}/).flatMap((block) => {
    const sentences = block.trim().match(/[^。！？；]+[。！？；]?/g) ?? [block.trim()];
    const parts: string[] = [];
    let current = "";
    for (const sentence of sentences) {
      if (current.length >= 110 && current.length + sentence.length > 170) {
        parts.push(current);
        current = sentence;
      } else current += sentence;
    }
    if (current) parts.push(current);
    return parts;
  });
  return blocks.filter(Boolean);
}

function splitForViewport(text: string, limit: number) {
  const blocks = text.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  const units = blocks.flatMap((block, blockIndex) => {
    const clauses = block.match(/[^。！？；，]+[。！？；，]?/g) ?? [block];
    return blockIndex === blocks.length - 1 ? clauses : [...clauses, "\n\n"];
  });
  const pages: string[] = [];
  let current = "";
  for (const unit of units) {
    if (unit === "\n\n") {
      if (current && !current.endsWith("\n\n")) current += unit;
      continue;
    }
    const visibleLength = current.replace(/\s/g, "").length;
    if (current.trim() && visibleLength + unit.length > limit) {
      pages.push(current.trim());
      current = unit;
    } else {
      current += unit;
    }
  }
  if (current.trim()) pages.push(current.trim());
  return pages;
}

function readAudioSettings(): AudioSettings {
  try { return sanitizeAudioSettings(JSON.parse(window.localStorage.getItem(audioStorageKey) ?? "null")); }
  catch { return defaultAudioSettings; }
}

type NarrativeFrame = SceneBeat & { text: string; beatIndex: number };

function framesForPresentation(beats: SceneBeat[], limit: number): NarrativeFrame[] {
  return beats.flatMap((beat, beatIndex) => splitForViewport(beat.text, limit).map((text) => ({ ...beat, text, beatIndex })));
}

function useNarrativeLimit() {
  const [limit, setLimit] = useState(128);

  useEffect(() => {
    function fitToViewport() {
      const { innerHeight: height, innerWidth: width } = window;
      const isCompactLandscape = width < 960 && width > height;
      if (isCompactLandscape) {
        setLimit(height >= 480 ? 84 : height >= 390 ? 64 : 52);
        return;
      }
      if (width >= 960) {
        setLimit(height >= 980 ? 148 : height >= 820 ? 112 : height >= 700 ? 84 : 68);
        return;
      }
      setLimit(height >= 820 ? 112 : height >= 680 ? 88 : 68);
    }

    fitToViewport();
    window.addEventListener("resize", fitToViewport);
    return () => window.removeEventListener("resize", fitToViewport);
  }, []);

  return limit;
}

function useVisualAssetPreloader() {
  useEffect(() => {
    const sources = [...new Set(Object.values(visualAssetManifest).flatMap((asset) => asset.kind === "image" ? [asset.src] : []))];
    const images: HTMLImageElement[] = [];
    const preload = () => {
      for (const source of sources) {
        const image = new window.Image();
        image.decoding = "async";
        image.src = source;
        images.push(image);
      }
    };
    const idleWindow = window as unknown as {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let cancel: () => void;
    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(preload, { timeout: 1800 });
      cancel = () => idleWindow.cancelIdleCallback?.(idleId);
    } else {
      const timeoutId = globalThis.setTimeout(preload, 650);
      cancel = () => globalThis.clearTimeout(timeoutId);
    }
    return () => { cancel(); images.length = 0; };
  }, []);
}

function inferSpeaker(text: string) {
  const firstQuote = text.search(/[“「『]/);
  if (firstQuote < 0) return "旁白";
  const lead = text.slice(Math.max(0, firstQuote - 54), firstQuote);
  const candidates = storyPresentation.names.filter((name) => lead.includes(name));
  return candidates.at(-1) ?? "旁白";
}

function NarrativePage({ text }: { text: string }) {
  return <>{splitParagraphs(text).map((paragraph, paragraphIndex) => {
    const pieces = paragraph.split(/(赵黎|纪清寒|薛逢|苏莹|乔无咎|苏衍|血魔蛊|月光蛊|血刃蛊|血甲蛊|五转|血祭|祖传旧玉)/g);
    return <p key={paragraphIndex}>{pieces.map((piece, pieceIndex) => names.has(piece) ? <strong className="story-name" key={pieceIndex}>{piece}</strong> : criticalTerms.has(piece) ? <span className="story-critical" key={pieceIndex}>{piece}</span> : piece)}</p>;
  })}</>;
}

function VisualNovelRail({ chapter, roleName }: { chapter: string; roleName: string }) {
  return <aside className="vn-rail" aria-label="篇章信息">
    <div className="vn-rail-brand"><XueGuYinMark className="xue-gu-yin-mark" /><div><strong>{storyMeta.title}</strong><span>{chapter}</span></div></div>
    <p className="vn-rail-role">行走之人 <strong>{roleName}</strong></p>
  </aside>;
}

function VisualNovelLedger({ title }: { title: string }) {
  return <aside className="vn-ledger" aria-label="阅读记录">
    <span>当前场景</span><strong>{title}</strong>
  </aside>;
}

const characterLabels: Record<PresentedCharacter["id"], string> = {
  "zhao-li": "赵黎",
  "ji-qinghan": "纪清寒",
  "xue-feng": "薛逢",
  "su-ying": "苏莹",
  "qiao-wujiu": "乔无咎",
  "su-yan": "苏衍",
};

function VisualNovelCharacters({ activeSpeaker, characters }: { activeSpeaker: string; characters: PresentedCharacter[] }) {
  return <div className="vn-character-layer" aria-hidden="true">
    {characters.map((character) => {
      const asset = getVisualAsset(character.asset);
      const isActive = activeSpeaker === characterLabels[character.id];
      return <div
        className={`vn-character-slot is-visible is-${character.position}${isActive ? " is-speaking" : ""}`}
        data-character={character.id}
        data-expression={character.expression}
        key={character.id}
      >
        {asset.kind === "image" ? <CharacterImage key={asset.src} label={characterLabels[character.id]} src={asset.src} /> : <div className={`vn-character-placeholder ${asset.className}`}><span>{characterLabels[character.id]}</span></div>}
      </div>;
    })}
  </div>;
}

function CharacterImage({ label, src }: { label: string; src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="vn-character-placeholder vn-asset-fallback-character"><span>{label}</span></div>;
  return <Image alt="" className="vn-character" height={1536} priority sizes="36vw" src={src} unoptimized width={1024} onError={() => setFailed(true)} />;
}

function StageImage({ alt, className, src }: { alt: string; className: string; src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="vn-asset-fallback" role="img" aria-label={`${alt}（资源加载失败，已使用安全背景）`}><span>场景暂缺</span></div>;
  return <Image alt="" className={className} fill priority sizes="100vw" src={src} unoptimized onError={() => setFailed(true)} />;
}

function VisualNovelEffects({ effects, token }: { effects: StageEffect[]; token: string }) {
  if (!effects.length) return null;
  return <div className="vn-effect-layer" key={token} aria-hidden="true">
    {effects.map((effect, index) => <span className={`vn-effect is-${effect.effect} is-${effect.tone}`} key={`${effect.effect}-${index}`} />)}
  </div>;
}

function SceneSoundCue({ audio, cueKey, sounds }: { audio: VisualNovelAudioEngine; cueKey: string; sounds: AudioAssetKey[] }) {
  const signature = sounds.join("|");
  useEffect(() => {
    if (!signature) return;
    for (const sound of signature.split("|") as AudioAssetKey[]) {
      if (sound.startsWith("sfx.")) audio.playSfx(sound as SfxAssetKey);
    }
  }, [audio, cueKey, signature]);
  return null;
}

function SceneAudioCue({ act, audio, background, inBattle }: { act: number; audio: VisualNovelAudioEngine; background: BackgroundAssetKey; inBattle: boolean }) {
  useEffect(() => { audio.setScene(sceneAudioProfile({ act, background, inBattle })); }, [act, audio, background, inBattle]);
  return null;
}

const battleActorAssets = {
  "铜皮傀儡": { asset: "character.enemy.tong-pi-kui-lei", label: "铜皮傀儡" },
  "血傀儡": { asset: "character.enemy.xue-kui-lei", label: "血傀儡" },
  "赵黎": { asset: "character.zhao-li.wary", label: "赵黎" },
  "乔无咎": { asset: "character.qiao-wujiu.smug", label: "乔无咎" },
  "苏衍": { asset: "character.su-yan.awakened", label: "苏衍" },
} as const;

function BattleStageActor({ defeated, enemyCondition, enemyName, reacting }: { defeated: boolean; enemyCondition: string; enemyName: string; reacting: boolean }) {
  const actor = battleActorAssets[enemyName as keyof typeof battleActorAssets];
  const asset = actor ? getVisualAsset(actor.asset) : null;
  const construct = enemyName.includes("傀儡");
  const conditionTone = enemyCondition === "健康" ? "is-healthy" : enemyCondition === "重伤" ? "is-critical" : "is-wounded";
  return <div className={`vn-battle-actor-layer${reacting ? " is-reacting" : ""}${defeated ? " is-defeated" : ""}`} aria-hidden="true">
    <div className={`vn-battle-actor${construct ? " is-construct" : " is-cultivator"}`} data-enemy={enemyName}>
      {asset?.kind === "image"
        ? <CharacterImage label={actor.label} src={asset.src} />
        : <div className="vn-battle-construct"><i /><i /><i /><span /></div>}
    </div>
    {!defeated ? <p className={`vn-battle-nameplate ${conditionTone}`}><span>{enemyName}</span><strong><small>状态</small>{enemyCondition}</strong></p> : null}
  </div>;
}

function VisualNovelStage({ activeSpeaker, background, battleActor, characters, effects, effectToken }: { activeSpeaker: string; background: BackgroundAssetKey; battleActor?: { defeated: boolean; enemyCondition: string; enemyName: string; reacting: boolean }; characters: PresentedCharacter[]; effects: StageEffect[]; effectToken: string }) {
  const asset = getVisualAsset(background);
  return <>
    <div className={`vn-stage ${asset.kind === "css" ? asset.className : "vn-stage--image"}`} key={background} role="img" aria-label={asset.alt}>
      {asset.kind === "image" ? <StageImage alt={asset.alt} className="vn-stage-image" src={asset.src} /> : null}
      <span className="vn-stage-moon" /><span className="vn-stage-mountain vn-stage-mountain--far" /><span className="vn-stage-mountain vn-stage-mountain--near" /><span className="vn-stage-gate" />
    </div>
    <VisualNovelCharacters activeSpeaker={activeSpeaker} characters={characters} />
    {battleActor ? <BattleStageActor {...battleActor} /> : null}
    <VisualNovelEffects effects={effects} token={effectToken} />
  </>;
}

function describeBattleTurn(before: GameState, after: GameState, action: GuAction): BattleFeedback {
  const battle = before.battle;
  if (!battle) return { result: "蛊息渐歇，墓道里只余摇晃的灯火。", enemyCondition: "不明", hasEnded: false };
  const enemyName = battle.enemyName;
  const actionText: Record<GuAction, string> = {
    blood: before.flags.includes("血刃蛊")
      ? `你体内真元轰然运转，催动血刃蛊！滔天血煞之气瞬间凝为实质，锋芒比往日更甚，一线猩红如雷霆般直贯${enemyName}！`
      : `你指尖真元暴涨，催动月光蛊！一线清冷如雪的月白光芒凝作锋锐刃芒，划破黑暗，直贯${enemyName}要害！`,
    blooddemon: `血魔蛊自你掌心呼啸跃出，猩红血芒既撕开${enemyName}的防御，又牵引回一缕精纯血气反哺你的周身经脉！`,
    armor: before.flags.includes("血甲蛊")
      ? `血甲蛊受真元感应瞬间激活，猩红甲纹覆满周身，与护体真元紧密相合。`
      : `甲衣蛊受真元感应贴身而起，细密如钢鳞般的甲纹沿着全身经脉迅速铺开，正面迎向逼近的沉重阴影！`,
    rest: `你强行收束体内纷乱的真元，压下胸口翻涌的气血，趁着战斗的短暂空隙吐故纳新，迅速回气。`,
    heal: `你催动回春蛊，一股温润绵长的治愈蛊息沿着四肢百骸浸润伤处，周身七分火辣辣的剧痛转瞬间化作三分微热升腾。`,
    sword: `你咬破舌尖逼出一口精血催发剑鸣蛊！胸前衣衫撕裂、绽开一道血口——剑蛊汲取精血杀气清啸长鸣，化作一线惊天寒光直贯${enemyName}！`,
    charm: enemyName.includes("傀儡")
      ? `惑心蛊化作一缕粉烟，沿着牵机丝渗入${enemyName}体内。原本流转有序的真元顿时变得紊乱。`
      : enemyName === "乔无咎"
        ? "惑心蛊散出一缕极淡的粉烟，乔无咎眼前的石轮与线槽随之出现短暂错位，原本连贯的指诀也慢了半拍。"
      : `惑心蛊化作一缕粉烟悄然渗出。${enemyName}眼神短暂失焦，凝聚的气机也随之一乱。`,
  };
  const bloodGuardDefeat = battle.intent.id === "lash"
    ? "血傀儡的锁链绕过最后一层护体蛊息，横扫在你的下盘。你失去平衡，重重摔在血池边的石阶上。"
    : battle.intent.id === "smash"
      ? "血傀儡的重拳击穿最后一层护体蛊息，余劲将你压倒在池沿。你勉强撑起一只手臂，却没能重新站起。"
      : "聚在血傀儡脚边的血浪越过最后一层护体蛊息，将你冲下石阶。待血水退去，你已倒在离血池不过数尺的地方。";
  const qiaoDefeat = battle.intent.id === "wire"
    ? "乔无咎双手向内一合，已经绕到身后的牵机丝同时收紧。细线锁住你的四肢与经脉，你挣开一层，下一层便从梁间落下，直到再也无法站稳。"
    : battle.intent.id === "puppets"
      ? "左侧傀儡先以铜臂封住退路，另一具从石台侧面撞开你最后的防守。你被沉重力道掀倒在控制台前，体内蛊息一时再也无法凝聚。"
      : "脚下墓砖完全退入地槽，你失足跌落半层。收束而来的牵机丝随即缠住手脚，将你悬在石台下方，任凭如何催动真元都无法挣脱。";
  const nextBattle = after.battle;
  if (!nextBattle || after.sceneId !== before.sceneId) return {
    result: after.sceneId === battle.defeatNext
      ? battle.intent.reflect && action !== "armor"
        ? enemyName === "赵黎"
          ? `你催出的蛊息撞上血幕，立刻沿原路倒卷而回。最后一层护体蛊息被自己的攻势震散，你脚下一软，重重跪落在血池边。`
          : `诡异的血幕将你全力的蛊力原样倒卷轰回！胸口如遭万斤重锤轰击，周身经脉剧痛，分明是被自己的杀招所伤，眼前一黑倒飞而出。`
        : enemyName === "赵黎"
          ? `${actionText[action]}赵黎趁你真元运转未定，指尖血线穿过最后一层护体蛊息。你尚未来得及封住经脉，身形已失去支撑。`
          : enemyName === "乔无咎"
            ? `${actionText[action]}${qiaoDefeat}`
          : enemyName === "血傀儡"
            ? `${actionText[action]}${bloodGuardDefeat}`
            : `${actionText[action]}${enemyName}的攻势击溃了你最后的防守。你失去立足之处，倒在地上，再也无力起身。`
      : `${actionText[action]}${enemyName === "铜皮傀儡" ? "铜皮傀儡胸前的蛊核骤然暗下，挥到一半的铁拳也停在半空。" : enemyName === "血傀儡" ? "这一击穿入血傀儡胸骨中央，暗红血核从受击处裂开。它抬起的右臂停在半空，左腕锁链也随之滑落池边。" : enemyName === "赵黎" ? "余劲截断了他指间牵引血纹蛊的主线。血纹蛊失去控制，从半空跌落；赵黎脚步一乱，护体血光也随之散去。" : enemyName === "乔无咎" ? "这一击截断了控制台前的主牵机丝。阵枢中来不及散去的真元沿剩余细线倒冲而回，乔无咎扣在扳杆上的双手被迫松开，后退数步撞上石台，随即倒了下去。" : `${enemyName}的动作猛地一滞，随即轰然倒下，再没有余力还击。`}`,
    enemyCondition: after.sceneId === battle.defeatNext ? "你已落败" : enemyName === "赵黎" ? "已落败" : "已伏诛",
    hasEnded: true,
    emphasis: after.sceneId === battle.defeatNext ? "danger" : "success",
  };
  const immune = action === "charm";
  const defended = action === "armor";
  const corpseResponse = battle.intent.id === "corpse-claw"
    ? immune
      ? `${enemyName}俯身扑来的铁爪在半途失了准头，只抓碎了脚边的墓砖。`
      : defended
        ? `${enemyName}的铁爪撞上蛊甲，甲片与利爪相击，震得墓道里火星四散。`
        : `${enemyName}拖着铁靴骤然扑近，带锈的铁爪擦过身侧，留下火辣的一阵疼。`
    : battle.intent.id === "corpse-mist"
      ? immune
        ? `${enemyName}口中涌出的尸雾尚未散开，便在错乱的蛊息中塌回了胸腔。`
        : defended
          ? `灰绿尸雾漫到近前，却被护体蛊息挡在外侧，只余一层冷意贴着皮肤游走。`
          : `${enemyName}张口吐出一片灰绿尸雾，腥腐之气钻入鼻腔，连呼吸都变得沉滞。`
      : immune
        ? `${enemyName}胸腹间的尖啸刚要炸开，便被紊乱的蛊息生生压回，灯火也随之一暗。`
        : action === "armor" && !before.flags.includes("血甲蛊已得")
          ? `你凝神催动甲衣蛊，谁知${enemyName}猛然炸开一圈尖啸音波，声浪灌耳，震得你胸中翻涌，身不由己地连退几步。`
          : `${enemyName}胸腹骤然鼓起，一圈尖啸音波在墓道中炸开，声浪灌耳，震得人胸中气血翻涌。`;
  const zhaoResponse = immune
    ? "赵黎眼神一滞，指诀错开半寸，尚未成形的血气当即散回池面。"
    : defended
      ? battle.intent.id.startsWith("thread")
        ? "细血丝刺中蛊甲后向旁滑开，只在甲纹表面留下一道浅淡血痕。"
        : "赵黎的血掌正面撞上护体蛊力，沉闷余劲沿池沿散开，未能侵入你的经脉。"
      : battle.intent.id.startsWith("thread")
        ? "细血丝贴着你的防守缝隙掠过，带走一线气血后立即缩回赵黎指间。"
        : "赵黎紧随蛊息之后逼近，血掌余劲透过仓促架起的防御，震得你胸中发闷。";
  const qiaoResponse = battle.intent.id === "wire"
    ? immune
      ? "他扣向主线的手指落错了位置。梁间细线彼此缠住，尚未合拢便失去牵引，纷纷垂回控制台两侧。"
      : defended
        ? "交错压下的细线被护体蛊力挡在身外，未能锁住关节；仍有几缕牵机丝贴着蛊息滑过，从经脉中带走一线真元。"
        : "牵机丝从左右同时收紧，擦过手臂与肩侧。你挣开线网退到石台边缘，蛊窍中的真元也被线身牵走一缕。"
    : battle.intent.id === "puppets"
      ? immune
        ? "乔无咎错扣了两根主线。左右傀儡迈出的步子彼此冲突，一具撞偏同伴的铜臂，两者都停在石台之外。"
        : defended
          ? "两具傀儡的铜臂先后撞上护体蛊力，没能把你逼入侧门；它们背后的主线却仍沿蛊息收束，带走一缕真元。"
          : "第一具傀儡以铜臂撞开防守，第二具紧跟着从侧面逼近。你退开数步才避过合围，气机也让傀儡背后的主线扯乱。"
      : immune
        ? "乔无咎看错了扳杆下方的刻痕，机关只让边缘两块墓砖下沉少许。牵机丝未能在你脚下交汇，很快又松了回去。"
        : defended
          ? "护体蛊力撑住下沉时传来的冲力，也隔开了从四面绞来的细线。牵机丝无法贴近身体，却仍循着外放的蛊息抽走一股真元。"
          : "脚下墓砖突然下沉，你借近处石沿稳住身体，收束而来的牵机丝却趁势缠上腿侧。你挣断细线跃回石台时，体内真元已被抽走一截。";
  const bloodGuardResponse = battle.intent.id === "lash"
    ? immune
      ? "粉烟渗入胸腔血核，牵引左腕的蛊息骤然错乱。锁链刚刚离地便偏向一侧，只在池沿刮出一串碎石。"
      : defended
        ? "横扫而来的锁链撞上护体蛊力，沿着外侧滑开。沉重余劲震得你脚下后移，却没能将你扫倒。"
        : "锁链贴着池面扫中小腿外侧。你踉跄一步才重新站稳，原本准备前进的距离也被迫退了回去。"
    : battle.intent.id === "smash"
      ? immune
        ? "血核内的蛊息短暂断流，抬到高处的右臂随之一滞。重拳偏过你站立之处，砸碎了池边一块石砖。"
        : defended
          ? "重拳正面落在护体蛊力上。你借势屈膝卸去冲力，鞋底擦过湿滑石面，仍守住了通往低层的石阶。"
          : "粗重右拳穿过仓促架起的防守，撞在你的肩侧。你被余劲带得撞上石栏，胸中气血一阵翻涌。"
      : immune
        ? "粉烟扰乱了血核连续鼓动的节奏，刚在傀儡脚边聚起的血浪失去牵引，重新散回池中。"
        : defended
          ? "血浪撞上护体蛊力后向两旁分开。你顶住第一股冲力，没有被血水推下石阶。"
          : "血浪越过石阶迎面冲来，将你推向池沿。冰冷血水没过膝间，震得体内真元一时难以接续。";
  const enemyResponse = battle.intent.reflect
    ? action === "armor"
        ? `你看出血幕正在借力反噬，并未贸然攻入，只催动护体蛊力守住经脉。幕中血光空自倒卷，始终找不到可以反送的外力。`
        : `你催出的蛊息刚一触及血幕，便顺着原路倒卷回来，震得你经脉剧痛，气血翻涌！`
    : battle.intent.heal
      ? `${enemyName}仰头饮下玉瓶中的赤红液体，周身原本萎靡的气血与真元以肉眼可见的速度重新凝实暴涨。`
      : enemyName === "赵黎"
        ? zhaoResponse
      : enemyName === "乔无咎"
        ? qiaoResponse
      : enemyName === "血傀儡"
        ? bloodGuardResponse
      : immune
        ? `${enemyName}的攻势被扰乱，刚凝成的杀意无声散去。`
        : defended
          ? `${enemyName}狂暴的攻势重重撞击在护体真元之上，余劲扫过，只在幽闭的石室中荡开一阵刺耳的回响。`
          : enemyName === "尸灯傀儡"
            ? corpseResponse
            : enemyName === "血傀儡"
              ? "血傀儡踏过漫上石台的血水继续逼近，胸腔血核牵动四肢，下一次攻势已在沉重的骨骼摩擦声中成形。"
            : `${enemyName}不给你丝毫喘息之机，趁着旧力已尽新力未生之际欺身逼近，狂暴的破空余劲震得你周身气血一滞！`;
  const nextCue = enemyCueFor(nextBattle);
  return {
    result: `${actionText[action]}${enemyResponse}`,
    nextCue,
    enemyCondition: getEnemyCondition(nextBattle.enemyHealth, nextBattle.enemyMaxHealth),
    hasEnded: false,
  };
}

function enemyCueFor(battle: NonNullable<GameState["battle"]>) {
  return battle.intent.cue;
}

function buildBattleResultText(game: GameState, won: boolean): string {
  const enemyName = game.battle?.enemyName ?? "那具躯体";
  if (won) {
    if (enemyName === "铜皮傀儡") {
      return "最后一击贯穿铜皮傀儡胸前的蛊核。暗红光芒在裂缝中闪烁两下，随即彻底熄灭。失去真元支撑的牵机丝纷纷垂落，铜皮傀儡保持着挥拳的姿势僵立片刻，最终单膝砸在石坪上，再没有动静。身后的石门缓缓升起，乔无咎等人的身影重新出现在烟尘之后。";
    }
    if (enemyName === "赵黎") {
      return "赵黎退到池沿，单膝抵住石面。他数次勾动手指，跌落在旁的血纹蛊都没有重新飞起，封锁出口的血线也一根根松脱。你没有立即靠近，只隔着尚未散尽的血气确认他已无法再战。环形血池中央，血魔蛊仍由残茧血丝悬在半空，尚未接纳任何人的真元。";
    }
    if (enemyName === "乔无咎") {
      if (game.sceneId === "jiQiaoDuel") {
        return "乔无咎倚着石台滑坐在地，胸口再无起伏。你等了数息，确认他已经断气，才转身处理仍在转动的控制机关。\n\n两具铜皮傀儡失去主线牵引，停在侧门之间。你将中央石轮转到尽头，再压下轮轴旁的锁扣。通往祭殿的几束控制线随即彻底松弛，任凭石轮余力如何回弹，也无法重新接合。\n\n控制室刚安静下来，西墙外便接连传来几声沉重的水响。中央蛊茧收缩得比先前更快，池面血水正一圈圈撞上石阶。\n\n你越过垂落的牵机丝，立即沿夹道返回祭殿。";
      }
      return "倒冲的真元穿过乔无咎胸腹，他扶住石台的手很快失去力气，整个人顺着控制台缓缓滑坐在地。你等了片刻，确认他已经断气。失去操纵的傀儡停在原处，牵机丝也从梁间成片垂落；乔无咎的尸身仍留在散乱阵枢旁。";
    }
    if (enemyName === "血傀儡" && game.sceneId === "jiBloodGuard") {
      return "血傀儡伏倒在池边，胸腔血核的裂缝仍在向外透出暗红微光。一缕尚未被血祭耗尽的无主真元从裂口逸出，没有随地面祭线流回蛊茧。你避开血纹，将它引入经脉运转一周；原本滞涩的几处气路随之贯通，能够容纳的真元也比先前多出四点。\n\n你没有停下调息。纪清寒仍以残剑压住后方祭线，低层池沿上的苏莹也还没有脱险。通往她们之间的石阶已经让开，你立即转身继续救人。";
    }
    const corpse = enemyName === "铜皮傀儡"
      ? "的庞大躯壳轰然倒塌，彻底沦为一堆失去牵引的废铁。"
      : enemyName === "血傀儡"
        ? "失去血核支撑，缝合在骨架外的枯败皮肉层层脱落，最终与断裂锁链一同倒回血池边。"
        : `的身躯轰然倒下，溅起满地尘埃，再无半点动静。`;
    return `你缓缓收势站定，胸口剧烈起伏，掌心沉浮的真元余温尚未散去。${enemyName}${corpse}四下里只剩尚未散尽的真元余波。`;
  }
  const defeatText: Record<string, string> = {
    铜皮傀儡: "最后一缕护体蛊息在铁拳下溃散。你摔落在碎裂的墓砖间，几次试图催动本命蛊，都没有得到回应。铜皮傀儡胸前的蛊核重新亮起，沉重脚步穿过烟尘，停在了你的面前。",
    血傀儡: "血傀儡重新站到石阶中央，截断了所有退路。你身下的祭纹逐段亮起，刚刚被压住的血线也再次收紧。气血与真元沿阵纹流向中央蛊茧；你试图撑起身体，指尖却再也聚不起半点真元。",
    赵黎: "赵黎没有再补第二击，只从你身侧越过，走向池中尚未认主的血魔蛊。旧玉从松开的指间滑落，在石地上裂成数片。你听见血纹蛊重新振翅，却已经分不清那声音来自何处。",
    乔无咎: game.sceneId === "jiQiaoDuel"
      ? "乔无咎没有走下控制台。他拨动最后一处阵枢，西墙夹道的石板随即合拢，外侧数道祭线也重新亮起。纪清寒不得不留在血池边压住断口，无法穿过已经封死的石墙。\n\n控制室下方的侧门同时开启，门后便是高悬在血池上方的转运石道。两具铜皮傀儡架起失去反抗之力的你，沿石道拖向池沿。祭线从下方攀上手腕与脚踝，将气血不断引向中央蛊茧。你最后看见的，是蛊茧外壳重新亮起的暗红血光。"
      : "乔无咎没有离开控制台，只抬手拨动最后一处阵枢。你身下的墓砖随即向两侧退开，几具铜皮傀儡踏过垂落的牵机丝，将失去反抗之力的你拖向祭殿血池。",
    苏衍: "五转威压压碎你最后的蛊息。血池倒卷而来，周身气血沿祭纹离体而去；黑石棺中传出重新变得有力的心跳，而你的意识沉入死寂。",
  };
  return defeatText[enemyName] ?? `${enemyName}击溃了你最后的护体蛊息。真元散尽，意识也随墓室里摇晃的灯火一同熄灭。`;
}

export function XueGuYinGame() {
  useVisualAssetPreloader();
  const [game, setGame] = useState<GameState>(initialGame);
  const [seenEndings, setSeenEndings] = useState<string[]>([]);
  const [saveSlots, setSaveSlots] = useState<SaveSlots>(emptySaveSlots);
  const [homeView, setHomeView] = useState<HomeView>("menu");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(defaultAudioSettings);
  const [narrative, setNarrative] = useState({ sceneId: "gate", page: 0 });
  const [pendingBattleState, setPendingBattleState] = useState<GameState | null>(null);
  const [battleFeedback, setBattleFeedback] = useState<BattleFeedback | null>(null);
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
  const [pendingLinearChoice, setPendingLinearChoice] = useState(false);
  const [battleResult, setBattleResult] = useState<{ won: boolean; text: string } | null>(null);
  const [showGameMenu, setShowGameMenu] = useState(false);
  const [showBacklog, setShowBacklog] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [skipMode, setSkipMode] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);
  const [readFrames, setReadFrames] = useState<string[]>([]);
  const [backlog, setBacklog] = useState<BacklogEntry[]>([]);
  const [quickSave, setQuickSave] = useState<SaveSlot | null>(null);
  const [quickNotice, setQuickNotice] = useState("");
  const [combatEffect, setCombatEffect] = useState<{ id: number; effect: "flash" | "shake" | "darken"; tone: "neutral" | "danger" } | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const storageLoadedRef = useRef(false);
  const narrativeLimit = useNarrativeLimit();
  const role = getRole(game.roleId);
  const scene = scenes[game.sceneId];
  const audio = useVisualNovelAudio(audioSettings);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const storedEndings = JSON.parse(window.localStorage.getItem(endingStorageKey) ?? "[]") as unknown;
        if (Array.isArray(storedEndings)) setSeenEndings(storedEndings.filter((id): id is string => typeof id === "string" && id in endings));
        setSaveSlots(readSaveSlots());
        setReduceMotion(window.localStorage.getItem(motionStorageKey) === "true");
        const storedTheme = window.localStorage.getItem(themeStorageKey);
        if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") setThemePreference(storedTheme);
        const storedRead = JSON.parse(window.localStorage.getItem(readStorageKey) ?? "[]") as unknown;
        if (Array.isArray(storedRead)) setReadFrames(storedRead.filter((key): key is string => typeof key === "string"));
        const storedQuickSave = JSON.parse(window.localStorage.getItem(quickSaveStorageKey) ?? "null") as unknown;
        if (isSaveSlot(storedQuickSave)) setQuickSave(storedQuickSave);
        setAudioSettings(readAudioSettings());
      } finally {
        storageLoadedRef.current = true;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!storageLoadedRef.current) return;
    window.localStorage.setItem(endingStorageKey, JSON.stringify(seenEndings));
    window.localStorage.setItem(motionStorageKey, String(reduceMotion));
    window.localStorage.setItem(themeStorageKey, themePreference);
    window.localStorage.setItem(readStorageKey, JSON.stringify(readFrames));
    window.localStorage.setItem(audioStorageKey, JSON.stringify(audioSettings));
    document.documentElement.dataset.reduceMotion = String(reduceMotion);
    document.documentElement.dataset.theme = themePreference;
  }, [audioSettings, readFrames, reduceMotion, seenEndings, themePreference]);

  useEffect(() => {
    const endingBackground = game.endingId ? endings[game.endingId]?.background : undefined;
    const profile = sceneAudioProfile({ act: scene?.act, background: endingBackground, inBattle: Boolean(game.battle) });
    audio.setScene(profile);
  }, [audio, game.battle, game.endingId, scene?.act]);

  useEffect(() => {
    function handleButtonSound(event: MouseEvent) {
      const button = event.target instanceof Element ? event.target.closest("button") : null;
      if (!button || button.hasAttribute("disabled") || button.closest(".gu-list")) return;
      const key: SfxAssetKey = button.classList.contains("back-button") || button.classList.contains("game-menu-close") ? "sfx.ui-back" : "sfx.ui-confirm";
      void audio.unlock().then(() => audio.playSfx(key)).catch(() => undefined);
    }
    document.addEventListener("click", handleButtonSound);
    return () => document.removeEventListener("click", handleButtonSound);
  }, [audio]);

  useEffect(() => {
    if (!combatEffect) return;
    const timer = window.setTimeout(() => setCombatEffect(null), 520);
    return () => window.clearTimeout(timer);
  }, [combatEffect]);

  useEffect(() => {
    if (copyRef.current) copyRef.current.scrollTop = 0;
  }, [battleResult?.text, game.sceneId, narrative.page, pendingChoice?.id]);

  function loadScene(sceneId: string) { setNarrative({ sceneId, page: 0 }); }

  function selectRole(id: RoleId) {
    loadScene("gate");
    setPendingBattleState(null);
    setBattleFeedback(null);
    setPendingChoice(null);
    setPendingLinearChoice(false);
    setBattleResult(null);
    setShowGameMenu(false);
    setShowBacklog(false);
    setAutoMode(false);
    setSkipMode(false);
    setUiHidden(false);
    setBacklog([]);
    setGame(chooseRole(id));
  }

  function persistSaveSlots(nextSlots: SaveSlots) {
    setSaveSlots(nextSlots);
    window.localStorage.setItem(saveStorageKey, JSON.stringify(nextSlots));
  }

  function saveToSlot(index: number) {
    const nextSlots = [...saveSlots];
    nextSlots[index] = createSaveSlot({ game, narrative, pendingGame: pendingBattleState });
    persistSaveSlots(nextSlots);
  }

  function loadFromSlot(slot: SaveSlot) {
    const restored = restoreSaveSlot(slot);
    setPendingBattleState(null);
    setBattleFeedback(null);
    setPendingChoice(null);
    setPendingLinearChoice(false);
    setBattleResult(null);
    setShowGameMenu(false);
    setShowBacklog(false);
    setAutoMode(false);
    setSkipMode(false);
    setUiHidden(false);
    setGame(restored.game);
    setNarrative(restored.narrative);
  }

  function returnToMainMenu() {
    setPendingBattleState(null);
    setBattleFeedback(null);
    setPendingChoice(null);
    setPendingLinearChoice(false);
    setBattleResult(null);
    setShowGameMenu(false);
    setShowBacklog(false);
    setAutoMode(false);
    setSkipMode(false);
    setUiHidden(false);
    setGame(initialGame());
    setHomeView("menu");
  }
  function applyAndAdvance(choice: Choice) {
    const next = applyChoice(game, choice);
    if (next.sceneId !== "ending") {
      loadScene(next.sceneId);
      setGame(next);
      return;
    }
    const endingId = resolveEnding(next);
    setSeenEndings((seen) => seen.includes(endingId) ? seen : [...seen, endingId]);
    setGame({ ...next, endingId });
  }
  function selectChoice(raw: Choice) {
    const choice = resolveRandomChoice(raw);
    if (choice.result) {
      setPendingLinearChoice(false);
      setPendingChoice(choice);
      return;
    }
    applyAndAdvance(choice);
  }
  function confirmChoice() {
    if (!pendingChoice) return;
    const choice = pendingChoice;
    setPendingChoice(null);
    setPendingLinearChoice(false);
    applyAndAdvance(choice);
  }

  function handleBattle(action: GuAction) {
    if (pendingBattleState) return;
    const next = resolveBattleTurn(game, action);
    if (next === game) return;
    const feedback = describeBattleTurn(game, next, action);
    const lost = game.battle && next.sceneId === game.battle.defeatNext;
    const sfx: SfxAssetKey = lost ? "sfx.battle-danger" : action === "armor" ? "sfx.battle-guard" : action === "heal" ? "sfx.battle-heal" : "sfx.battle-hit";
    audio.playSfx(sfx);
    setCombatEffect({ id: Date.now(), effect: lost ? "darken" : action === "armor" ? "shake" : action === "heal" ? "flash" : "shake", tone: lost ? "danger" : "neutral" });
    if (feedback.hasEnded) {
      const battle = game.battle!;
      const won = Boolean(battle.victoryFlag && next.flags.includes(battle.victoryFlag));
      setPendingBattleState(next);
      setBattleResult({ won, text: buildBattleResultText(game, won) });
      setBattleFeedback(null);
      return;
    }
    setBattleFeedback(feedback);
    setGame(next);
  }

  function continueBattle() {
    if (!pendingBattleState) return;
    if (pendingBattleState.sceneId === "ending") {
      const endingId = resolveEnding(pendingBattleState);
      setSeenEndings((seen) => seen.includes(endingId) ? seen : [...seen, endingId]);
      setGame({ ...pendingBattleState, endingId });
      setPendingBattleState(null);
      setBattleFeedback(null);
      return;
    }
    if (pendingBattleState.sceneId !== game.sceneId) loadScene(pendingBattleState.sceneId);
    setGame(pendingBattleState);
    setPendingBattleState(null);
    setBattleFeedback(null);
  }

  function confirmBattleResult() {
    if (!battleResult) return;
    setBattleResult(null);
    continueBattle();
  }


  if (!role) {
    if (homeView === "archive") return <EndingArchive onBack={() => setHomeView("menu")} seenEndings={seenEndings} />;
    if (homeView === "saves") return <SaveArchive onBack={() => setHomeView("menu")} onLoad={loadFromSlot} saveSlots={saveSlots} />;
    if (homeView === "settings") return <GameSettings audioSettings={audioSettings} onAudioChange={setAudioSettings} onBack={() => setHomeView("menu")} onClearEndings={() => setSeenEndings([])} reduceMotion={reduceMotion} onThemeChange={setThemePreference} onToggleReduceMotion={() => setReduceMotion((current) => !current)} themePreference={themePreference} />;
    if (homeView === "menu") return <MainMenu onArchive={() => setHomeView("archive")} onSaves={() => setHomeView("saves")} onSettings={() => setHomeView("settings")} onStart={() => setHomeView("roles")} saveSlots={saveSlots} unlockedCount={seenEndings.length} />;
    return <RoleSelect onBack={() => setHomeView("menu")} onSelect={selectRole} />;
  }
  if (game.endingId) return <EndingScreen game={game} seenEndings={seenEndings} onReplay={() => selectRole(role.id)} onChangeRole={() => { setGame(initialGame()); setHomeView("roles"); }} onMenu={() => { setGame(initialGame()); setHomeView("menu"); }} />;
  if (!scene) return null;

  const battle = game.battle;
  const presentation = resolveScenePresentation(game, scene);
  const sourceText = presentation.text;
  const narrativeFrames = framesForPresentation(presentation.beats, narrativeLimit);
  const pageCount = Math.max(1, narrativeFrames.length);
  const narrativePage = narrative.sceneId === scene.id ? narrative.page : 0;
  const pageIndex = Math.min(narrativePage, pageCount - 1);
  const isLastNarrativePage = pageIndex === pageCount - 1;
  const activeFrame = narrativeFrames[pageIndex] ?? presentation.beats[0];
  const narrativeParts: string[] = [activeFrame?.text ?? sourceText];
  const visibleChoices = presentation.choices.filter((choice) => canChoose(game, choice));
  const linearRouteChoice = game.routeLocked && visibleChoices.length === 1 ? visibleChoices[0] : null;
  const presentedText = battleResult?.text ?? pendingChoice?.result ?? narrativeParts[0] ?? sourceText;
  const speaker = battleResult ? "旁白" : pendingChoice ? inferSpeaker(presentedText) : activeFrame?.displayName ?? inferSpeaker(presentedText);
  const stageBackground = activeFrame?.background ?? presentation.background;
  const stageCharacters = activeFrame?.characters ?? presentation.characters;
  const currentFrameKey = readingFrameKey(scene.id, activeFrame?.beatIndex ?? 0, pageIndex, presentedText);
  const stageEffects: StageEffect[] = [...(activeFrame?.effects ?? []), ...(combatEffect ? [{ effect: combatEffect.effect, tone: combatEffect.tone } satisfies StageEffect] : [])];
  const stageEffectClasses = stageEffects.map((effect) => ` is-stage-${effect.effect}`).join("");
  const effectToken = `${currentFrameKey}-${combatEffect?.id ?? 0}`;
  const hasBlockingAction = isLastNarrativePage && Boolean(presentation.battle || (visibleChoices.length && !linearRouteChoice));
  const canAdvanceReading = !battle && !battleResult && (pendingLinearChoice || (!pendingChoice && (!isLastNarrativePage || Boolean(linearRouteChoice))));

  function rememberCurrentFrame() {
    setReadFrames((current) => current.includes(currentFrameKey) ? current : [...current, currentFrameKey]);
    setBacklog((current) => appendBacklog(current, {
      id: currentFrameKey,
      sceneId: scene.id,
      sceneTitle: scene.title,
      speaker,
      text: presentedText,
    }));
  }

  function advanceNarrative() {
    if (uiHidden) { setUiHidden(false); return; }
    if (!canAdvanceReading) return;
    rememberCurrentFrame();
    if (isLastNarrativePage && linearRouteChoice) {
      const choice = resolveRandomChoice(linearRouteChoice);
      if (choice.result) {
        setPendingLinearChoice(true);
        setPendingChoice(choice);
      } else applyAndAdvance(choice);
      return;
    }
    setNarrative({ sceneId: scene.id, page: Math.min(pageIndex + 1, pageCount - 1) });
  }

  function advanceInteraction() {
    if (uiHidden) { setUiHidden(false); return; }
    if (showGameMenu || showBacklog) return;
    if (battleResult) { rememberCurrentFrame(); confirmBattleResult(); return; }
    if (pendingChoice) { rememberCurrentFrame(); confirmChoice(); return; }
    if (battle) return;
    advanceNarrative();
  }

  function chooseWithHistory(choice: Choice) {
    rememberCurrentFrame();
    setAutoMode(false);
    setSkipMode(false);
    selectChoice(choice);
  }

  function beginBattle() {
    rememberCurrentFrame();
    setAutoMode(false);
    setSkipMode(false);
    setGame((current) => startBattle(current, scene));
  }

  function openBacklog() {
    rememberCurrentFrame();
    setAutoMode(false);
    setSkipMode(false);
    setShowBacklog(true);
  }

  function createQuickSave() {
    const slot = createSaveSlot({ game, narrative, pendingGame: pendingBattleState });
    setQuickSave(slot);
    window.localStorage.setItem(quickSaveStorageKey, JSON.stringify(slot));
    setQuickNotice("快速存档完成");
  }

  function loadQuickSave() {
    if (!quickSave) { setQuickNotice("尚无快速存档"); return; }
    loadFromSlot(quickSave);
    setQuickNotice("已读取快速存档");
  }

  const readingModeAllowed = canRunReadingMode({
    hasOverlay: showGameMenu || showBacklog,
    inBattle: Boolean(battle),
    hasPendingResult: Boolean((pendingChoice && !pendingLinearChoice) || battleResult),
    hasBlockingAction,
  });

  return (
    <main className="game-shell game-shell--play">
      <ReadingController
        autoMode={autoMode}
        canAdvance={readingModeAllowed && canAdvanceReading}
        onAdvance={advanceInteraction}
        onAuto={() => setAutoMode((current) => !current)}
        onBacklog={() => showBacklog ? setShowBacklog(false) : openBacklog()}
        onHide={() => setUiHidden((current) => !current)}
        onMenu={() => {
          if (showBacklog) setShowBacklog(false);
          else setShowGameMenu((current) => !current);
        }}
        onQuickLoad={loadQuickSave}
        onQuickSave={createQuickSave}
        onSkip={setSkipMode}
        skipMode={skipMode}
        text={presentedText}
      />
      <section
        className={`game-frame story-frame${battle && !battleResult ? " is-battling" : ""}${uiHidden ? " is-ui-hidden" : ""}${stageEffectClasses}`}
        aria-label="血蛊引游戏界面"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("button, a, input, select, textarea")) return;
          if (uiHidden) setUiHidden(false);
          else advanceInteraction();
        }}
        onContextMenu={(event) => { event.preventDefault(); setUiHidden((current) => !current); }}
        onWheel={(event) => {
          if (event.deltaY < -24) openBacklog();
          else if (event.deltaY > 24) advanceInteraction();
        }}
      >
        <SceneAudioCue act={scene.act} audio={audio} background={stageBackground} inBattle={Boolean(battle)} />
        <SceneSoundCue audio={audio} cueKey={currentFrameKey} sounds={activeFrame?.sounds ?? []} />
        <VisualNovelStage
          activeSpeaker={speaker}
          background={stageBackground}
          battleActor={battle && (!battleResult || battleResult.won) ? {
            defeated: Boolean(battleResult?.won),
            enemyCondition: battleFeedback?.enemyCondition ?? getEnemyCondition(battle.enemyHealth, battle.enemyMaxHealth),
            enemyName: battle.enemyName,
            reacting: Boolean(combatEffect),
          } : undefined}
          characters={battle ? [] : stageCharacters}
          effectToken={effectToken}
          effects={stageEffects}
        />
        <div className="vn-play-layout">
        <VisualNovelRail chapter={scene.chapter} roleName={role.name} />
        <div className="vn-story-core">
        {battleResult ? <>
          <header className="status-bar">
            <div><span>修士</span><strong>{role.name}</strong></div>
            <div className="health-stat"><span>命</span><strong>{game.health}/{game.maxHealth}</strong><i style={{ width: `${(game.health / game.maxHealth) * 100}%` }} /></div>
            <button className="game-menu-trigger" type="button" aria-expanded={showGameMenu} aria-label="打开游戏菜单" onClick={() => setShowGameMenu(true)}>菜单</button>
          </header>
          <section className="scene" aria-live="polite">
            <p className="vn-speaker">旁白</p><p className="eyebrow">战斗结束</p>
            <div className="scene-copy vn-text-reveal" key={`battle-result-${battleResult.text}`} ref={copyRef}><NarrativePage text={battleResult.text} /></div>
            <span className="vn-continue-indicator" aria-hidden="true">⌄</span>
          </section>
        </> : battle ? <BattleScene battleFeedback={battleFeedback} game={game} onAction={handleBattle} onOpenMenu={() => setShowGameMenu(true)} /> : <>
          <header className="status-bar">
            <div><span>修士</span><strong>{role.name}</strong></div>
            <div className="health-stat"><span>命</span><strong>{game.health}/{game.maxHealth}</strong><i style={{ width: `${(game.health / game.maxHealth) * 100}%` }} /></div>
            <button className="game-menu-trigger" type="button" aria-expanded={showGameMenu} aria-label="打开游戏菜单" onClick={() => setShowGameMenu(true)}>菜单</button>
          </header>
          {pendingChoice ? <>
          <section className="scene" aria-live="polite">
            <p className="vn-speaker">{speaker}</p><p className="eyebrow">{pendingLinearChoice ? "剧情推进" : "抉择已定"}</p>
            <div className="scene-copy vn-text-reveal" key={`choice-result-${pendingChoice.id}`} ref={copyRef}><NarrativePage text={pendingChoice.result ?? ""} /></div>
            <span className="vn-continue-indicator" aria-hidden="true">⌄</span>
          </section>
          </> : <>
          <section className="scene" aria-live="polite">
            <p className="vn-speaker">{speaker}</p><p className="eyebrow">{scene.chapter}</p>
            <h1>{scene.title}</h1>
            <div className={`scene-copy vn-text-reveal${activeFrame?.transition === "fade" ? " is-scene-fade" : ""}`} key={`${scene.id}-${activeFrame?.beatIndex ?? 0}-${pageIndex}-${narrativeLimit}`} ref={copyRef}>{narrativeParts.map((paragraph) => <NarrativePage key={paragraph} text={paragraph} />)}</div>
            <p className="narrative-progress">{pageIndex + 1} / {pageCount}</p>
            {!isLastNarrativePage || linearRouteChoice ? <span className="vn-continue-indicator" aria-hidden="true">⌄</span> : null}
          </section>
          {isLastNarrativePage && presentation.battle ? <div className="choice-panel"><button className="primary-button" onClick={beginBattle}>放出本命蛊</button></div> : null}
          {isLastNarrativePage && visibleChoices.length > 0 && !linearRouteChoice ? (
            <nav className="choice-panel" aria-label="剧情选项">
              {visibleChoices.map((choice) => <button className="choice-button" key={choice.id} onClick={() => chooseWithHistory(choice)}><span>{choice.label}</span></button>)}
            </nav>
          ) : null}
          </>}
        </>}
        </div>
        <VisualNovelLedger title={battle ? battle.enemyName : scene.title} />
        </div>
        <QuickMenu autoMode={autoMode} canQuickLoad={Boolean(quickSave)} disabled={!readingModeAllowed} onAuto={() => setAutoMode((current) => !current)} onBacklog={openBacklog} onHide={() => setUiHidden(true)} onQuickLoad={loadQuickSave} onQuickSave={createQuickSave} onSkip={() => setSkipMode((current) => !current)} skipMode={skipMode} />
        {quickNotice ? <p className="vn-quick-notice" aria-live="polite" onAnimationEnd={() => setQuickNotice("")}>{quickNotice}</p> : null}
        {showGameMenu ? <GameMenu onClose={() => setShowGameMenu(false)} onLoad={loadFromSlot} onMenu={returnToMainMenu} onSave={saveToSlot} saveSlots={saveSlots} /> : null}
        {showBacklog ? <BacklogOverlay entries={backlog} onClose={() => setShowBacklog(false)} /> : null}
      </section>
    </main>
  );
}

function ReadingController({ autoMode, canAdvance, onAdvance, onAuto, onBacklog, onHide, onMenu, onQuickLoad, onQuickSave, onSkip, skipMode, text }: {
  autoMode: boolean;
  canAdvance: boolean;
  onAdvance: () => void;
  onAuto: () => void;
  onBacklog: () => void;
  onHide: () => void;
  onMenu: () => void;
  onQuickLoad: () => void;
  onQuickSave: () => void;
  onSkip: (active: boolean) => void;
  skipMode: boolean;
  text: string;
}) {
  useEffect(() => {
    function isTypingTarget(target: EventTarget | null) {
      return target instanceof HTMLElement && Boolean(target.closest("button, a, input, textarea, select, [contenteditable='true']"));
    }
    function keyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onMenu(); return; }
      if (isTypingTarget(event.target)) return;
      if (event.key === "Control") { onSkip(true); return; }
      if (event.repeat && !["Enter", " "].includes(event.key)) return;
      const key = event.key.toLowerCase();
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onAdvance(); }
      else if (key === "a") onAuto();
      else if (key === "b") onBacklog();
      else if (key === "h") onHide();
      else if (key === "q") onQuickSave();
      else if (key === "l") onQuickLoad();
    }
    function keyUp(event: KeyboardEvent) { if (event.key === "Control") onSkip(false); }
    function windowBlur() { onSkip(false); }
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("blur", windowBlur);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("blur", windowBlur);
    };
  }, [onAdvance, onAuto, onBacklog, onHide, onMenu, onQuickLoad, onQuickSave, onSkip]);

  useEffect(() => {
    if (!canAdvance || (!autoMode && !skipMode)) return;
    const delay = skipMode ? 90 : autoAdvanceDelay(text);
    const timer = window.setTimeout(onAdvance, delay);
    return () => window.clearTimeout(timer);
  }, [autoMode, canAdvance, onAdvance, skipMode, text]);

  return null;
}

function QuickMenu({ autoMode, canQuickLoad, disabled, onAuto, onBacklog, onHide, onQuickLoad, onQuickSave, onSkip, skipMode }: {
  autoMode: boolean;
  canQuickLoad: boolean;
  disabled: boolean;
  onAuto: () => void;
  onBacklog: () => void;
  onHide: () => void;
  onQuickLoad: () => void;
  onQuickSave: () => void;
  onSkip: () => void;
  skipMode: boolean;
}) {
  return <nav className="vn-quick-menu" aria-label="阅读快捷菜单">
    <button type="button" onClick={onBacklog}>历史 <kbd>B</kbd></button>
    <button aria-pressed={autoMode} className={autoMode ? "is-active" : ""} disabled={disabled} type="button" onClick={onAuto}>自动 <kbd>A</kbd></button>
    <button aria-pressed={skipMode} className={skipMode ? "is-active" : ""} disabled={disabled} type="button" onClick={onSkip}>快进 <kbd>Ctrl</kbd></button>
    <button type="button" onClick={onQuickSave}>快存 <kbd>Q</kbd></button>
    <button disabled={!canQuickLoad} type="button" onClick={onQuickLoad}>快读 <kbd>L</kbd></button>
    <button type="button" onClick={onHide}>隐藏 <kbd>H</kbd></button>
  </nav>;
}

function BacklogOverlay({ entries, onClose }: { entries: BacklogEntry[]; onClose: () => void }) {
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight }); }, [entries]);
  return <div className="vn-backlog-backdrop" role="presentation" onClick={onClose}>
    <section className="vn-backlog" role="dialog" aria-modal="true" aria-labelledby="backlog-title" onClick={(event) => event.stopPropagation()}>
      <header><div><p className="eyebrow">BACKLOG</p><h2 id="backlog-title">历史记录</h2></div><button autoFocus type="button" aria-label="关闭历史记录" onClick={onClose}>×</button></header>
      <div className="vn-backlog-list" ref={listRef}>
        {entries.length ? entries.map((entry) => <article key={entry.id}><p><span>{entry.sceneTitle}</span><strong>{entry.speaker}</strong></p><div><NarrativePage text={entry.text} /></div></article>) : <p className="vn-backlog-empty">尚无可以回看的文字。</p>}
      </div>
      <footer>按 B 或 Esc 返回游戏</footer>
    </section>
  </div>;
}

function MainMenu({ onArchive, onSaves, onSettings, onStart, saveSlots, unlockedCount }: { onArchive: () => void; onSaves: () => void; onSettings: () => void; onStart: () => void; saveSlots: SaveSlots; unlockedCount: number }) {
  const saveCount = saveSlots.filter(Boolean).length;
  return <main className="game-shell menu-shell"><section className="game-frame main-menu" aria-labelledby="menu-title">
      <div className="menu-stage" aria-hidden="true"><span className="menu-stage-moon" /><span className="menu-stage-gate" /><Image alt="" className="menu-character" height={1536} priority sizes="(min-width: 960px) 44vw, 0px" src="/characters/ji-qinghan-placeholder.webp" unoptimized width={1024} /></div>
      <header className="menu-intro"><div className="menu-title-row"><XueGuYinMark className="xue-gu-yin-mark" /><div><p className="eyebrow">{storyMeta.subtitle}</p><h1 id="menu-title">{storyMeta.title}</h1></div></div><p>一座蛊墓，五名四转修士。每一次抉择都在塑造你；大雾落下时，你会循着自己的本心走上不同血路。</p></header>
      <nav className="menu-index" aria-label="主界面菜单">
        <button className="menu-action menu-action-primary" onClick={onStart}><span><strong>开始游戏</strong><small>择一身份，重入蛊墓</small></span></button>
        <button className="menu-action" onClick={onSaves}><span><strong>读取存档</strong><small>本设备已有 {saveCount} / {SAVE_SLOT_COUNT} 卷行迹</small></span></button>
        <button className="menu-action" onClick={onArchive}><span><strong>结局一览</strong><small>已解锁 {unlockedCount} / {Object.keys(endings).length}</small></span></button>
        <button className="menu-action" onClick={onSettings}><span><strong>游戏设置</strong><small>阅读与记录</small></span></button>
      </nav>
    <p className="menu-note">每一次选择都会留下痕迹。<small>v{releaseMeta.version}</small></p>
  </section></main>;
}

function SaveArchive({ onBack, onLoad, saveSlots }: { onBack: () => void; onLoad: (slot: SaveSlot) => void; saveSlots: SaveSlots }) {
  return <main className="game-shell archive-shell"><section className="game-frame archive-card save-archive" aria-labelledby="save-title">
    <header className="menu-page-header"><button className="back-button" onClick={onBack}>返回</button><div><p className="eyebrow">六卷行迹</p><h1 id="save-title">读取存档</h1></div></header>
    <p className="save-archive-copy">存档只保存于当前浏览器。读取任意一卷，将从该处继续行走。</p>
    <div className="save-archive-list">{saveSlots.map((slot, index) => {
      const label = slot ? saveSlotLabel(slot) : null;
      return <article className={`save-slot${slot ? " is-occupied" : ""}`} key={index}><div><span>存档 {index + 1}</span><strong>{label?.role ?? "空白卷轴"}</strong><small>{slot ? `${label?.scene} · ${formatSaveTime(slot.savedAt)}` : "尚未留下任何行迹"}</small></div><button className="slot-load-button" type="button" disabled={!slot} onClick={() => slot && onLoad(slot)}>读取</button></article>;
    })}</div>
  </section></main>;
}

function GameMenu({ onClose, onLoad, onMenu, onSave, saveSlots }: { onClose: () => void; onLoad: (slot: SaveSlot) => void; onMenu: () => void; onSave: (index: number) => void; saveSlots: SaveSlots }) {
  return <div className="game-menu-backdrop" role="presentation" onClick={onClose}><section className="game-menu-dialog" role="dialog" aria-modal="true" aria-label="游戏菜单" onClick={(event) => event.stopPropagation()}>
    <header><div><p className="eyebrow">行囊卷轴</p><h2>游戏菜单</h2></div><button autoFocus className="game-menu-close" type="button" aria-label="关闭游戏菜单" onClick={onClose}>×</button></header>
    <p className="game-menu-copy">存档仅保存在此浏览器与此设备中。读取存档会放弃当前未保存的进度。</p>
    <div className="save-slot-list" aria-label="六个存档位">{saveSlots.map((slot, index) => {
      const label = slot ? saveSlotLabel(slot) : null;
      return <article className={`save-slot${slot ? " is-occupied" : ""}`} key={index}><div><span>存档 {index + 1}</span><strong>{label?.role ?? "空白卷轴"}</strong><small>{slot ? `${label?.scene} · ${formatSaveTime(slot.savedAt)}` : "尚未留下任何行迹"}</small></div><nav><button className="slot-save-button" type="button" onClick={() => onSave(index)}>存入</button>{slot ? <button className="slot-load-button" type="button" onClick={() => onLoad(slot)}>读取</button> : null}</nav></article>;
    })}</div>
    <button className="game-menu-home" type="button" onClick={onMenu}>返回主菜单</button>
  </section></div>;
}

function EndingArchive({ onBack, seenEndings }: { onBack: () => void; seenEndings: string[] }) {
  const endingEntries = Object.values(endings);
  const unlockedCount = endingEntries.filter((ending) => seenEndings.includes(ending.id)).length;
  return <main className="game-shell archive-shell"><section className="game-frame archive-card" aria-labelledby="archive-title">
    <header className="menu-page-header"><button className="back-button" onClick={onBack}>返回</button><div><p className="eyebrow">命数卷宗</p><h1 id="archive-title">结局一览</h1></div></header>
    <p className="archive-summary"><strong>{unlockedCount} / {endingEntries.length}</strong><span>已收录的命数</span></p>
    <ul className="ending-list">{endingEntries.map((ending) => {
      const unlocked = seenEndings.includes(ending.id);
      return <li className={`ending-entry${unlocked ? " is-unlocked" : ""}`} key={ending.id}><div><strong>{ending.name}</strong><span>{unlocked ? "已解锁" : "尚未解锁"}</span></div><p>{unlocked ? ending.epitaph : "此命数仍藏在蛊墓深处。"}</p></li>;
    })}</ul>
  </section></main>;
}

function AudioMixer({ settings, onChange }: { settings: AudioSettings; onChange: (settings: AudioSettings) => void }) {
  const tracks: Array<{ key: "master" | "music" | "ambience" | "sfx"; label: string }> = [
    { key: "master", label: "总音量" },
    { key: "music", label: "背景音乐" },
    { key: "ambience", label: "环境声音" },
    { key: "sfx", label: "界面与战斗" },
  ];
  return <section className="settings-note audio-mixer" aria-labelledby="audio-mixer-title">
    <header><div><strong id="audio-mixer-title">声音</strong><p>程序化占位音可随时替换为正式音频。</p></div><button aria-pressed={settings.muted} type="button" onClick={() => onChange({ ...settings, muted: !settings.muted })}>{settings.muted ? "恢复声音" : "全部静音"}</button></header>
    <div className="audio-tracks">{tracks.map((track) => <label key={track.key}><span>{track.label}<output>{settings[track.key]}</output></span><input aria-label={track.label} disabled={settings.muted} max="100" min="0" step="1" type="range" value={settings[track.key]} onChange={(event) => onChange({ ...settings, [track.key]: Number(event.target.value) })} /></label>)}</div>
  </section>;
}

function GameSettings({ audioSettings, onAudioChange, onBack, onClearEndings, onThemeChange, onToggleReduceMotion, reduceMotion, themePreference }: { audioSettings: AudioSettings; onAudioChange: (settings: AudioSettings) => void; onBack: () => void; onClearEndings: () => void; onThemeChange: (theme: ThemePreference) => void; onToggleReduceMotion: () => void; reduceMotion: boolean; themePreference: ThemePreference }) {
  const [confirmClear, setConfirmClear] = useState(false);
  function clearEndings() {
    if (!confirmClear) { setConfirmClear(true); return; }
    onClearEndings();
    setConfirmClear(false);
  }
  return <main className="game-shell settings-shell"><section className="game-frame settings-card" aria-labelledby="settings-title">
    <header className="menu-page-header"><button className="back-button" onClick={onBack}>返回</button><div><p className="eyebrow">行囊与灯火</p><h1 id="settings-title">游戏设置</h1></div></header>
    <div className="settings-list"><div className="settings-note theme-setting"><strong>界面主题</strong><p>选择蛊墓在此设备上的明暗样式。</p><div aria-label="选择界面主题" className="theme-options" role="group">{(["system", "light", "dark"] as ThemePreference[]).map((theme) => <button aria-pressed={themePreference === theme} className="theme-option" key={theme} onClick={() => onThemeChange(theme)}>{theme === "system" ? "跟随系统" : theme === "light" ? "亮色" : "暗色"}</button>)}</div></div>
      <AudioMixer settings={audioSettings} onChange={onAudioChange} />
      <button aria-pressed={reduceMotion} className="settings-row" onClick={onToggleReduceMotion}><span><strong>减少动态</strong><small>剧情与按钮以更静止的方式呈现</small></span><em>{reduceMotion ? "已开启" : "跟随系统"}</em></button>
      <div className="settings-note"><strong>图鉴记录</strong><p>已解锁结局会保存在当前设备中。</p></div>
      <button className={`settings-row settings-danger${confirmClear ? " is-confirming" : ""}`} onClick={clearEndings}><span><strong>{confirmClear ? "再次点击，确认清除" : "清除结局记录"}</strong><small>{confirmClear ? "此操作无法撤回" : "只清除本设备上的图鉴进度"}</small></span><em>{confirmClear ? "确认" : "清除"}</em></button>
    </div>
  </section></main>;
}

function RoleSelect({ onBack, onSelect }: { onBack: () => void; onSelect: (id: RoleId) => void }) {
  return <main className="game-shell role-select"><section className="game-frame opening-card" aria-labelledby="game-title">
    <button className="back-button role-back" onClick={onBack}>返回主界面</button>
    <h1 id="game-title">{storyMeta.title}</h1>
    <p className="opening-copy">请选择你的身份</p>
    <div className="role-list" aria-label="选择角色">{roles.map((candidate) => <button className="role-card" key={candidate.id} onClick={() => onSelect(candidate.id)}>
      <strong className="role-card-title">{candidate.title}</strong><span>{candidate.description}</span>
      <small>命数 {candidate.maxHealth} · 真元 {candidate.maxEssence} · 攻势 {candidate.attack} · 神识 {candidate.sense === "high" ? "高" : "中"} <em>擅用：{candidate.signatureGu}</em></small>
    </button>)}</div>
  </section></main>;
}

function BattleScene({ battleFeedback, game, onAction, onOpenMenu }: { battleFeedback: BattleFeedback | null; game: GameState; onAction: (action: GuAction) => void; onOpenMenu: () => void }) {
  const battle = game.battle;
  const role = getRole(game.roleId);
  const [showHelp, setShowHelp] = useState(false);
  if (!battle || !role) return null;
  const defenseAction = game.flags.includes("血甲蛊")
    ? { id: "armor" as const, name: "血甲蛊", description: "血色蛊甲覆身，挡下这一击。" }
    : { id: "armor" as const, name: "甲衣蛊", description: "蛊甲覆身，护住周身要害。" };
  const attackAction = bloodGuAction(game.flags);
  const signatureAction = signatureGuAction(game.roleId!);
  const bloodDemonAction = game.flags.includes("血魔蛊")
    ? [{ id: "blooddemon" as const, name: "血魔蛊", description: "既噬敌血气，又反哺己身。" }]
    : [];
  const guActions: { id: GuAction; name: string; description: string }[] = game.essence === 0
    ? [{ id: "rest" as const, name: "调息", description: "收束真元，调息回气。" }]
    : [attackAction, defenseAction, signatureAction, ...bloodDemonAction];
  const enemyCue = enemyCueFor(battle);
  const narration = battleFeedback ? [battleFeedback.result, battleFeedback.nextCue].filter(Boolean) as string[] : [enemyCue];
  const narrationKey = narration.join("|");
  return <>
    <header className="status-bar battle-status-bar">
      <div><span>修士</span><strong>{role.name}</strong></div>
      <div className="health-stat"><span>生命</span><strong>{game.health}/{game.maxHealth}</strong><i style={{ width: `${(game.health / game.maxHealth) * 100}%` }} /></div>
      <div className="battle-essence"><span>真元</span><strong>{game.essence}/{game.maxEssence}</strong><i style={{ width: `${(game.essence / game.maxEssence) * 100}%` }} /></div>
      <nav className="battle-status-actions" aria-label="战斗辅助功能"><button className="battle-help-button" type="button" aria-label="查看蛊斗说明" onClick={() => setShowHelp(true)}>?</button><button className="game-menu-trigger" type="button" aria-label="打开游戏菜单" onClick={onOpenMenu}>菜单</button></nav>
    </header>
    <section className={`scene battle-scene${battleFeedback?.emphasis ? ` is-${battleFeedback.emphasis}` : ""}`} aria-live="polite">
      <p className="vn-speaker">{battle.enemyName}</p>
      <p className="eyebrow">交锋</p>
      <div className="scene-copy vn-text-reveal" key={narrationKey}>{narration.map((paragraph) => <NarrativePage key={paragraph} text={paragraph} />)}</div>
    </section>
    <nav className="choice-panel battle-choice-panel" aria-label="选择本回合蛊术">
      {guActions.map((action) => {
        const cost = actionCost(action.id);
        const lacksEssence = game.essence < cost;
        const resourceText = action.id === "rest" ? "恢复 3 真元" : lacksEssence ? `真元不足 · 需 ${cost}` : `消耗 ${cost} 真元`;
        return <button className="choice-button battle-choice-button" key={action.id} disabled={lacksEssence} aria-label={`${action.name}，${action.description}，${resourceText}`} onClick={() => onAction(action.id)}><span><strong>{action.name}</strong><small>{action.description}</small></span><em className={lacksEssence ? "is-insufficient" : ""}>{resourceText}</em></button>;
      })}
    </nav>
    {showHelp ? <div className="battle-help-backdrop" role="presentation" onClick={() => setShowHelp(false)}><section className="battle-help-dialog" role="dialog" aria-modal="true" aria-label="蛊斗说明" onClick={(event) => event.stopPropagation()}>
      <button autoFocus className="battle-help-close" type="button" aria-label="关闭说明" onClick={() => setShowHelp(false)}>×</button><p className="eyebrow">蛊斗说明</p><h2>真元与回合</h2>
      <p>每一场蛊斗都会以真元全满开始。你先放出蛊虫；若敌人仍存活，才会还击。击杀敌人的那一击不会承受其反击。</p>
      <p>月光蛊与甲衣蛊需以真元催动；夺得血刃蛊或血甲蛊后，它们会替换初始蛊。真元耗尽时，只能调息回气，敌人仍会行动。</p>
      <p>敌人的异样动作只是征兆，不会直接告诉你下一击是什么。留意其姿态、气息与周围变化。</p>
    </section></div> : null}
  </>;
}

function EndingScreen({ game, seenEndings, onReplay, onChangeRole, onMenu }: { game: GameState; seenEndings: string[]; onReplay: () => void; onChangeRole: () => void; onMenu: () => void }) {
  const ending = game.endingId ? endings[game.endingId] : null;
  if (!ending) return null;
  const background = getVisualAsset(ending.background);
  return <main className={`game-shell ending-shell ending-shell--${ending.id}`}><section className="ending-stage" aria-labelledby="ending-title">
    <div className="ending-stage-background" aria-hidden="true">
      {background.kind === "image" ? <StageImage alt={background.alt} className="ending-stage-image" src={background.src} /> : <div className={background.className} />}
    </div>
    <div className="ending-stage-shade" aria-hidden="true" />
    <article className="ending-card">
      <div className="ending-heading"><p className="eyebrow">结局已定</p><p className="ending-number">{String(seenEndings.length).padStart(2, "0")} / {String(Object.keys(endings).length).padStart(2, "0")}</p></div>
      <h1 id="ending-title">{ending.name}</h1>
      <p className="epitaph">“{ending.epitaph}”</p>
      <p className="ending-text">{ending.text}</p>
      <div className="ending-actions"><button className="primary-button" onClick={onReplay}>重入蛊墓</button><button className="quiet-button" onClick={onChangeRole}>重新开始</button><button className="quiet-button" onClick={onMenu}>返回主界面</button></div>
      <p className="gallery">本次会话已见：{seenEndings.map((id) => endings[id].name).join("、") || "无"}</p>
    </article>
  </section></main>;
}
