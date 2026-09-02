export type VisualAssetDescriptor =
  | { kind: "image"; src: string; alt: string }
  | { kind: "css"; className: string; alt: string };

export type FormalVisualAssetCategory = "character" | "cg" | "ui" | "effect";

export type FormalVisualAssetDescriptor<Key extends string = string> = {
  key: Key;
  kind: "image";
  category: FormalVisualAssetCategory;
  src: `/${string}.webp`;
  alt: string;
  purpose: string;
  trigger: string;
  width: number;
  height: number;
  alpha: boolean;
  maxBytes: number;
};

const characterAsset = <Key extends `character.${string}`>(
  key: Key,
  src: `/characters/${string}.webp`,
  alt: string,
  trigger: string,
): FormalVisualAssetDescriptor<Key> => ({
  key,
  kind: "image",
  category: "character",
  src,
  alt,
  purpose: "剧情与战斗人物状态立绘",
  trigger,
  width: 1024,
  height: 1536,
  alpha: true,
  maxBytes: 500 * 1024,
});

const cgAsset = <Key extends `cg.${string}`>(
  key: Key,
  src: `/cg/${string}.webp`,
  alt: string,
  trigger: string,
): FormalVisualAssetDescriptor<Key> => ({
  key,
  kind: "image",
  category: "cg",
  src,
  alt,
  purpose: "关键剧情或结局全屏叙事画面",
  trigger,
  width: 1600,
  height: 900,
  alpha: false,
  maxBytes: 450 * 1024,
});

const uiAsset = <Key extends `ui.${string}`>(
  key: Key,
  src: `/ui/${string}.webp`,
  alt: string,
  trigger: string,
): FormalVisualAssetDescriptor<Key> => ({
  key,
  kind: "image",
  category: "ui",
  src,
  alt,
  purpose: "首页、设置或存档视图主视觉",
  trigger,
  width: 1600,
  height: 900,
  alpha: false,
  maxBytes: 450 * 1024,
});

const effectAsset = <Key extends `effect.${string}`>(
  key: Key,
  src: `/effects/${string}.webp`,
  alt: string,
  trigger: string,
): FormalVisualAssetDescriptor<Key> => ({
  key,
  kind: "image",
  category: "effect",
  src,
  alt,
  purpose: "战斗动作命中反馈",
  trigger,
  width: 768,
  height: 768,
  alpha: true,
  maxBytes: 300 * 1024,
});

/**
 * 本任务 56 张正式美术的唯一类型化合同。条目先于资源生成冻结；运行时映射
 * 只能引用这里的稳定 key，不得自行拼接 public 路径。
 */
export const formalVisualAssetManifest = {
  "character.ji-qinghan.neutral": characterAsset("character.ji-qinghan.neutral", "/characters/ji-qinghan-neutral-v1.webp", "纪清寒平静持剑的全身立绘", "scene expression:ji-qinghan/neutral"),
  "character.ji-qinghan.alert": characterAsset("character.ji-qinghan.alert", "/characters/ji-qinghan-alert-v1.webp", "纪清寒警觉戒备的全身立绘", "scene expression:ji-qinghan/alert"),
  "character.ji-qinghan.softened": characterAsset("character.ji-qinghan.softened", "/characters/ji-qinghan-softened-v1.webp", "纪清寒神色稍缓的全身立绘", "scene expression:ji-qinghan/softened"),
  "character.ji-qinghan.injured": characterAsset("character.ji-qinghan.injured", "/characters/ji-qinghan-injured-v1.webp", "纪清寒负伤仍保持清醒的全身立绘", "visual-state:ji-qinghan/injured"),
  "character.ji-qinghan.battle": characterAsset("character.ji-qinghan.battle", "/characters/ji-qinghan-battle-v1.webp", "纪清寒拔剑迎战的全身立绘", "visual-state:ji-qinghan/battle"),
  "character.zhao-li.neutral": characterAsset("character.zhao-li.neutral", "/characters/zhao-li-neutral-v1.webp", "赵黎冷眼站立的全身立绘", "scene expression:zhao-li/neutral"),
  "character.zhao-li.amused": characterAsset("character.zhao-li.amused", "/characters/zhao-li-amused-v1.webp", "赵黎玩味轻笑的全身立绘", "scene expression:zhao-li/amused"),
  "character.zhao-li.wary": characterAsset("character.zhao-li.wary", "/characters/zhao-li-wary-v1.webp", "赵黎戒备观察的全身立绘", "scene expression:zhao-li/wary"),
  "character.zhao-li.injured": characterAsset("character.zhao-li.injured", "/characters/zhao-li-injured-v1.webp", "赵黎负伤压制血蛊的全身立绘", "visual-state:zhao-li/injured"),
  "character.zhao-li.battle": characterAsset("character.zhao-li.battle", "/characters/zhao-li-battle-v1.webp", "赵黎催动血蛊迎战的全身立绘", "visual-state:zhao-li/battle"),
  "character.xue-feng.neutral": characterAsset("character.xue-feng.neutral", "/characters/xue-feng-neutral-v1.webp", "薛逢谨慎站立的全身立绘", "scene expression:xue-feng/neutral"),
  "character.xue-feng.smiling": characterAsset("character.xue-feng.smiling", "/characters/xue-feng-smiling-v1.webp", "薛逢堆笑示好的全身立绘", "scene expression:xue-feng/smiling"),
  "character.xue-feng.panicked": characterAsset("character.xue-feng.panicked", "/characters/xue-feng-panicked-v1.webp", "薛逢惊慌失措的全身立绘", "scene expression:xue-feng/panicked"),
  "character.xue-feng.greedy": characterAsset("character.xue-feng.greedy", "/characters/xue-feng-greedy-v1.webp", "薛逢贪念显露的全身立绘", "scene expression:xue-feng/greedy"),
  "character.xue-feng.injured": characterAsset("character.xue-feng.injured", "/characters/xue-feng-injured-v1.webp", "薛逢负伤求生的全身立绘", "visual-state:xue-feng/injured"),
  "character.xue-feng.battle": characterAsset("character.xue-feng.battle", "/characters/xue-feng-battle-v1.webp", "薛逢持蛊具迎战的全身立绘", "visual-state:xue-feng/battle"),
  "character.su-ying.neutral": characterAsset("character.su-ying.neutral", "/characters/su-ying-neutral-v1.webp", "苏莹沉静站立的全身立绘", "scene expression:su-ying/neutral"),
  "character.su-ying.wary": characterAsset("character.su-ying.wary", "/characters/su-ying-wary-v1.webp", "苏莹戒备护住墓图的全身立绘", "scene expression:su-ying/wary"),
  "character.su-ying.sad": characterAsset("character.su-ying.sad", "/characters/su-ying-sad-v1.webp", "苏莹悲伤克制的全身立绘", "scene expression:su-ying/sad"),
  "character.su-ying.injured": characterAsset("character.su-ying.injured", "/characters/su-ying-injured-v1.webp", "苏莹负伤守住墓图的全身立绘", "visual-state:su-ying/injured"),
  "character.su-ying.battle": characterAsset("character.su-ying.battle", "/characters/su-ying-battle-v1.webp", "苏莹展开阵纹迎战的全身立绘", "visual-state:su-ying/battle"),
  "character.qiao-wujiu.neutral": characterAsset("character.qiao-wujiu.neutral", "/characters/qiao-wujiu-neutral-v1.webp", "乔无咎持副印站立的全身立绘", "scene expression:qiao-wujiu/neutral"),
  "character.qiao-wujiu.calm": characterAsset("character.qiao-wujiu.calm", "/characters/qiao-wujiu-calm-v1.webp", "乔无咎从容谋算的全身立绘", "scene expression:qiao-wujiu/calm"),
  "character.qiao-wujiu.smug": characterAsset("character.qiao-wujiu.smug", "/characters/qiao-wujiu-smug-v1.webp", "乔无咎自得掌控机关的全身立绘", "scene expression:qiao-wujiu/smug"),
  "character.qiao-wujiu.injured": characterAsset("character.qiao-wujiu.injured", "/characters/qiao-wujiu-injured-v1.webp", "乔无咎负伤仍握牵机丝的全身立绘", "visual-state:qiao-wujiu/injured"),
  "character.qiao-wujiu.battle": characterAsset("character.qiao-wujiu.battle", "/characters/qiao-wujiu-battle-v1.webp", "乔无咎操纵牵机丝迎战的全身立绘", "visual-state:qiao-wujiu/battle"),
  "character.su-yan.neutral": characterAsset("character.su-yan.neutral", "/characters/su-yan-neutral-v1.webp", "苏衍沉睡前冷漠站立的全身立绘", "scene expression:su-yan/neutral"),
  "character.su-yan.awakened": characterAsset("character.su-yan.awakened", "/characters/su-yan-awakened-v1.webp", "苏衍从黑石棺苏醒的全身立绘", "scene expression:su-yan/awakened"),
  "character.su-yan.injured": characterAsset("character.su-yan.injured", "/characters/su-yan-injured-v1.webp", "苏衍返生未稳负伤的全身立绘", "visual-state:su-yan/injured"),
  "character.su-yan.battle": characterAsset("character.su-yan.battle", "/characters/su-yan-battle-v1.webp", "苏衍催动祖阵迎战的全身立绘", "visual-state:su-yan/battle"),

  "cg.ending.demon": cgAsset("cg.ending.demon", "/cg/endings/demon-v1.webp", "血魔蛊认主后独自踏出墓门的夺蛊成魔结局", "endingId:demon"),
  "cg.ending.severed": cgAsset("cg.ending.severed", "/cg/endings/severed-v1.webp", "纪清寒与主角舍去修为经营山中药铺的断脉相守结局", "endingId:severed"),
  "cg.ending.true": cgAsset("cg.ending.true", "/cg/endings/true-v1.webp", "苏莹收起墓图与众人迎向晨光的血脉归位结局", "endingId:true"),
  "cg.ending.deathByZhao": cgAsset("cg.ending.deathByZhao", "/cg/endings/deathByZhao-v1.webp", "主角倒在赵黎血线前的血蛊反噬结局", "endingId:deathByZhao"),
  "cg.ending.deathByMaster": cgAsset("cg.ending.deathByMaster", "/cg/endings/deathByMaster-v1.webp", "返生祖阵闭合吞没主角的命丧墓主结局", "endingId:deathByMaster"),
  "cg.ending.deathByQiao": cgAsset("cg.ending.deathByQiao", "/cg/endings/deathByQiao-v1.webp", "牵机阵机关压下封死退路的命丧牵机阵结局", "endingId:deathByQiao"),
  "cg.ending.deathByBloodGuard": cgAsset("cg.ending.deathByBloodGuard", "/cg/endings/deathByBloodGuard-v1.webp", "守墓傀儡击倒主角的命丧守墓傀儡结局", "endingId:deathByBloodGuard"),
  "cg.ending.trapped": cgAsset("cg.ending.trapped", "/cg/endings/trapped-v1.webp", "血雾封死墓门后众人被困的困于蛊墓结局", "endingId:trapped"),
  "cg.ending.traitor": cgAsset("cg.ending.traitor", "/cg/endings/traitor-v1.webp", "背叛者被赵黎用作血蛊活气的副印止步结局", "endingId:traitor"),
  "cg.scene.gate": cgAsset("cg.scene.gate", "/cg/scenes/gate-v1.webp", "夜雨中六人初聚蛊墓石门前", "sceneId:gate"),
  "cg.scene.bloodThreshold": cgAsset("cg.scene.bloodThreshold", "/cg/scenes/bloodThreshold-v1.webp", "血门将合时众人跨过祭线", "sceneId:bloodThreshold"),
  "cg.scene.fog": cgAsset("cg.scene.fog", "/cg/scenes/fog-v1.webp", "大雾吞没甬道迫使众人择路", "sceneId:fog"),
  "cg.scene.zhaoAwakening": cgAsset("cg.scene.zhaoAwakening", "/cg/scenes/zhaoAwakening-v1.webp", "赵黎在血池前催醒血纹蛊", "sceneId:zhaoAwakening"),
  "cg.scene.jiDestroyGu": cgAsset("cg.scene.jiDestroyGu", "/cg/scenes/jiDestroyGu-v1.webp", "纪清寒与主角逆转蛊息毁去血魔蛊", "sceneId:jiDestroyGu"),
  "cg.scene.suCoffin": cgAsset("cg.scene.suCoffin", "/cg/scenes/suCoffin-v1.webp", "苏莹在黑石棺前直面苏衍返生阵", "sceneId:suCoffin"),
  "cg.scene.traitorBloodTaken": cgAsset("cg.scene.traitorBloodTaken", "/cg/scenes/traitorBloodTaken-v1.webp", "赵黎抽走背叛者气血稳定血魔蛊", "sceneId:traitorBloodTaken"),

  "ui.main-menu": uiAsset("ui.main-menu", "/ui/main-menu-v1.webp", "夜雨蛊墓与铜灯构成的主界面主视觉", "homeView:menu"),
  "ui.settings": uiAsset("ui.settings", "/ui/settings-v1.webp", "墓室灯火与巫蛊器物构成的设置页主视觉", "homeView:settings"),
  "ui.saves": uiAsset("ui.saves", "/ui/saves-v1.webp", "封蜡卷轴与六格命签构成的存档页主视觉", "homeView:saves"),

  "effect.player-blood-attack": effectAsset("effect.player-blood-attack", "/effects/player-blood-attack-v1.webp", "血刃从玩家侧斩向敌人的攻击特效", "battle-action:blood"),
  "effect.player-armor-guard": effectAsset("effect.player-armor-guard", "/effects/player-armor-guard-v1.webp", "血甲在玩家身前闭合的防御特效", "battle-action:armor"),
  "effect.player-heal-gu": effectAsset("effect.player-heal-gu", "/effects/player-heal-gu-v1.webp", "回春蛊环绕玩家修复伤势的治疗特效", "battle-action:heal"),
  "effect.player-sword-gu": effectAsset("effect.player-sword-gu", "/effects/player-sword-gu-v1.webp", "剑鸣蛊凝成剑气贯向敌人的特效", "battle-action:sword"),
  "effect.player-charm-gu": effectAsset("effect.player-charm-gu", "/effects/player-charm-gu-v1.webp", "惑心蛊符纹束缚敌人神识的特效", "battle-action:charm"),
  "effect.player-blooddemon-gu": effectAsset("effect.player-blooddemon-gu", "/effects/player-blooddemon-gu-v1.webp", "血魔蛊暗红巨影扑向敌人的特效", "battle-action:blooddemon"),
  "effect.enemy-attack": effectAsset("effect.enemy-attack", "/effects/enemy-attack-v1.webp", "守墓傀儡从敌方挥落的反击特效", "battle-event:enemy-attack"),
} as const;

export type FormalVisualAssetKey = keyof typeof formalVisualAssetManifest;
export type FormalCharacterAssetKey = Extract<FormalVisualAssetKey, `character.${string}`>;
export type CgAssetKey = Extract<FormalVisualAssetKey, `cg.${string}`>;
export type UiAssetKey = Extract<FormalVisualAssetKey, `ui.${string}`>;
export type CombatEffectAssetKey = Extract<FormalVisualAssetKey, `effect.${string}`>;

export type CombatArtAction = "blood" | "armor" | "heal" | "sword" | "charm" | "blooddemon";

export const endingCgAssets = {
  demon: "cg.ending.demon",
  severed: "cg.ending.severed",
  true: "cg.ending.true",
  deathByZhao: "cg.ending.deathByZhao",
  deathByMaster: "cg.ending.deathByMaster",
  deathByQiao: "cg.ending.deathByQiao",
  deathByBloodGuard: "cg.ending.deathByBloodGuard",
  trapped: "cg.ending.trapped",
  traitor: "cg.ending.traitor",
} as const satisfies Record<string, CgAssetKey>;

export function getEndingCgAsset(endingId: string) {
  const assetKey = endingCgAssets[endingId as keyof typeof endingCgAssets];
  if (!assetKey) throw new Error(`Unknown ending CG: ${endingId}`);
  return getFormalVisualAsset(assetKey);
}

/**
 * 战斗按钮到正式位图特效的运行时映射。调息不产生玩家攻击/蛊术特效，
 * 但敌方仍可通过 enemyCombatEffectAsset 播放反击反馈。
 */
export const combatActionEffectAssets = {
  blood: "effect.player-blood-attack",
  armor: "effect.player-armor-guard",
  heal: "effect.player-heal-gu",
  sword: "effect.player-sword-gu",
  charm: "effect.player-charm-gu",
  blooddemon: "effect.player-blooddemon-gu",
} as const satisfies Record<CombatArtAction, CombatEffectAssetKey>;

export const enemyCombatEffectAsset = "effect.enemy-attack" satisfies CombatEffectAssetKey;

/**
 * 人形敌手进入战斗及重伤阶段时使用的正式角色状态。傀儡仍沿用既有敌方
 * 立绘；三名主要角色则必须在真实战斗回合中展示矩阵里的 battle/injured。
 */
export const battleCharacterStateAssets = {
  "赵黎": { label: "赵黎", battle: "character.zhao-li.battle", injured: "character.zhao-li.injured" },
  "乔无咎": { label: "乔无咎", battle: "character.qiao-wujiu.battle", injured: "character.qiao-wujiu.injured" },
  "苏衍": { label: "苏衍", battle: "character.su-yan.battle", injured: "character.su-yan.injured" },
} as const satisfies Record<string, { label: string; battle: FormalCharacterAssetKey; injured: FormalCharacterAssetKey }>;

export function getFormalVisualAsset<Key extends FormalVisualAssetKey>(key: Key): (typeof formalVisualAssetManifest)[Key] {
  return formalVisualAssetManifest[key];
}

/**
 * 视觉小说资源的唯一登记处。剧情与运行时只保存资源键，不拼接 public 路径。
 * CSS 条目只保留为资源加载失败时的兼容回退；发布清单中的舞台均应使用 image。
 */
export const visualAssetManifest = {
  "background.tomb-gate": { kind: "image", src: "/backgrounds/tomb-gate-v1.webp", alt: "夜雨中的蛊墓石门" },
  "background.tomb-corridor": { kind: "image", src: "/backgrounds/tomb-corridor-v1.webp", alt: "幽冷灯火延伸入深处的蛊墓甬道" },
  "background.fog-passage": { kind: "image", src: "/backgrounds/fog-passage-v1.webp", alt: "被蛊雾吞没的古墓甬道" },
  "background.trap-passage": { kind: "image", src: "/backgrounds/trap-passage-v1.webp", alt: "坍塌断裂的机关陷道" },
  "background.control-room": { kind: "image", src: "/backgrounds/control-room-v1.webp", alt: "遍布牵机丝的机关控制暗室" },
  "background.blood-chamber": { kind: "image", src: "/backgrounds/blood-chamber-v1.webp", alt: "血魔蛊卵悬于血池上方的五转蛊室" },
  "background.dawn-exit": { kind: "image", src: "/backgrounds/dawn-exit-v1.webp", alt: "雨后天光中的蛊墓出口" },
  "background.blood-ruin": { kind: "image", src: "/backgrounds/blood-ruin-v1.webp", alt: "血光下崩塌的蛊室废墟" },
  "character.ji-qinghan.neutral": { kind: "image", src: "/characters/ji-qinghan-neutral-v1.webp", alt: "纪清寒平静表情" },
  "character.ji-qinghan.alert": { kind: "image", src: "/characters/ji-qinghan-alert-v1.webp", alt: "纪清寒警觉戒备的全身立绘" },
  "character.ji-qinghan.softened": { kind: "image", src: "/characters/ji-qinghan-softened-v1.webp", alt: "纪清寒神色稍缓的全身立绘" },
  "character.ji-qinghan.injured": { kind: "image", src: "/characters/ji-qinghan-injured-v1.webp", alt: "纪清寒负伤仍保持清醒的全身立绘" },
  "character.ji-qinghan.battle": { kind: "image", src: "/characters/ji-qinghan-battle-v1.webp", alt: "纪清寒拔剑迎战的全身立绘" },
  "character.zhao-li.neutral": { kind: "image", src: "/characters/zhao-li-neutral-v1.webp", alt: "赵黎冷眼站立的全身立绘" },
  "character.zhao-li.amused": { kind: "image", src: "/characters/zhao-li-amused-v1.webp", alt: "赵黎玩味轻笑的全身立绘" },
  "character.zhao-li.wary": { kind: "image", src: "/characters/zhao-li-wary-v1.webp", alt: "赵黎戒备观察的全身立绘" },
  "character.zhao-li.injured": { kind: "image", src: "/characters/zhao-li-injured-v1.webp", alt: "赵黎负伤压制血蛊的全身立绘" },
  "character.zhao-li.battle": { kind: "image", src: "/characters/zhao-li-battle-v1.webp", alt: "赵黎催动血蛊迎战的全身立绘" },
  "character.xue-feng.neutral": { kind: "image", src: "/characters/xue-feng-neutral-v1.webp", alt: "薛逢谨慎站立的全身立绘" },
  "character.xue-feng.smiling": { kind: "image", src: "/characters/xue-feng-smiling-v1.webp", alt: "薛逢堆笑示好的全身立绘" },
  "character.xue-feng.panicked": { kind: "image", src: "/characters/xue-feng-panicked-v1.webp", alt: "薛逢惊慌失措的全身立绘" },
  "character.xue-feng.greedy": { kind: "image", src: "/characters/xue-feng-greedy-v1.webp", alt: "薛逢贪念显露的全身立绘" },
  "character.xue-feng.injured": { kind: "image", src: "/characters/xue-feng-injured-v1.webp", alt: "薛逢负伤求生的全身立绘" },
  "character.xue-feng.battle": { kind: "image", src: "/characters/xue-feng-battle-v1.webp", alt: "薛逢持蛊具迎战的全身立绘" },
  "character.su-ying.neutral": { kind: "image", src: "/characters/su-ying-neutral-v1.webp", alt: "苏莹沉静站立的全身立绘" },
  "character.su-ying.wary": { kind: "image", src: "/characters/su-ying-wary-v1.webp", alt: "苏莹戒备护住墓图的全身立绘" },
  "character.su-ying.sad": { kind: "image", src: "/characters/su-ying-sad-v1.webp", alt: "苏莹悲伤克制的全身立绘" },
  "character.su-ying.injured": { kind: "image", src: "/characters/su-ying-injured-v1.webp", alt: "苏莹负伤守住墓图的全身立绘" },
  "character.su-ying.battle": { kind: "image", src: "/characters/su-ying-battle-v1.webp", alt: "苏莹展开阵纹迎战的全身立绘" },
  "character.qiao-wujiu.neutral": { kind: "image", src: "/characters/qiao-wujiu-neutral-v1.webp", alt: "乔无咎持副印站立的全身立绘" },
  "character.qiao-wujiu.calm": { kind: "image", src: "/characters/qiao-wujiu-calm-v1.webp", alt: "乔无咎从容谋算的全身立绘" },
  "character.qiao-wujiu.smug": { kind: "image", src: "/characters/qiao-wujiu-smug-v1.webp", alt: "乔无咎自得掌控机关的全身立绘" },
  "character.qiao-wujiu.injured": { kind: "image", src: "/characters/qiao-wujiu-injured-v1.webp", alt: "乔无咎负伤仍握牵机丝的全身立绘" },
  "character.qiao-wujiu.battle": { kind: "image", src: "/characters/qiao-wujiu-battle-v1.webp", alt: "乔无咎操纵牵机丝迎战的全身立绘" },
  "character.su-yan.neutral": { kind: "image", src: "/characters/su-yan-neutral-v1.webp", alt: "苏衍冷漠站立的全身立绘" },
  "character.su-yan.awakened": { kind: "image", src: "/characters/su-yan-awakened-v1.webp", alt: "苏衍从黑石棺苏醒的全身立绘" },
  "character.su-yan.injured": { kind: "image", src: "/characters/su-yan-injured-v1.webp", alt: "苏衍返生未稳负伤的全身立绘" },
  "character.su-yan.battle": { kind: "image", src: "/characters/su-yan-battle-v1.webp", alt: "苏衍催动祖阵迎战的全身立绘" },
  "character.enemy.tong-pi-kui-lei": { kind: "image", src: "/characters/tong-pi-kui-lei-v1.webp", alt: "铜皮傀儡战斗立绘" },
  "character.enemy.xue-kui-lei": { kind: "image", src: "/characters/xue-kui-lei-v1.webp", alt: "血傀儡战斗立绘" },
} as const satisfies Record<string, VisualAssetDescriptor>;

export type VisualAssetKey = keyof typeof visualAssetManifest;
export type BackgroundAssetKey =
  | Extract<VisualAssetKey, `background.${string}`>
  | Extract<FormalVisualAssetKey, `cg.scene.${string}`>;
export type CharacterAssetKey = Extract<VisualAssetKey, `character.${string}`>;

export function getVisualAsset(key: VisualAssetKey | FormalVisualAssetKey): VisualAssetDescriptor {
  return visualAssetManifest[key as VisualAssetKey] ?? formalVisualAssetManifest[key as FormalVisualAssetKey];
}

const characterExpressionAssets = {
  "zhao-li": {
    neutral: "character.zhao-li.neutral",
    amused: "character.zhao-li.amused",
    wary: "character.zhao-li.wary",
    injured: "character.zhao-li.injured",
    battle: "character.zhao-li.battle",
  },
  "ji-qinghan": {
    neutral: "character.ji-qinghan.neutral",
    alert: "character.ji-qinghan.alert",
    softened: "character.ji-qinghan.softened",
    injured: "character.ji-qinghan.injured",
    battle: "character.ji-qinghan.battle",
  },
  "xue-feng": {
    neutral: "character.xue-feng.neutral",
    smiling: "character.xue-feng.smiling",
    panicked: "character.xue-feng.panicked",
    greedy: "character.xue-feng.greedy",
    injured: "character.xue-feng.injured",
    battle: "character.xue-feng.battle",
  },
  "su-ying": {
    neutral: "character.su-ying.neutral",
    wary: "character.su-ying.wary",
    sad: "character.su-ying.sad",
    injured: "character.su-ying.injured",
    battle: "character.su-ying.battle",
  },
  "qiao-wujiu": {
    neutral: "character.qiao-wujiu.neutral",
    calm: "character.qiao-wujiu.calm",
    smug: "character.qiao-wujiu.smug",
    injured: "character.qiao-wujiu.injured",
    battle: "character.qiao-wujiu.battle",
  },
  "su-yan": {
    neutral: "character.su-yan.neutral",
    awakened: "character.su-yan.awakened",
    injured: "character.su-yan.injured",
    battle: "character.su-yan.battle",
  },
} as const satisfies Partial<Record<string, Partial<Record<string, CharacterAssetKey>>>>;

export function getCharacterExpressionAsset(character: string, expression: string): CharacterAssetKey | undefined {
  const expressions = characterExpressionAssets[character as keyof typeof characterExpressionAssets] as Partial<Record<string, CharacterAssetKey>> | undefined;
  return expressions?.[expression];
}

export const actBackgrounds = {
  1: "background.tomb-gate",
  2: "background.tomb-corridor",
  3: "background.fog-passage",
  4: "background.blood-chamber",
  5: "background.blood-chamber",
} as const satisfies Record<1 | 2 | 3 | 4 | 5, BackgroundAssetKey>;
