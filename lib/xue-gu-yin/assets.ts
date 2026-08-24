export type VisualAssetDescriptor =
  | { kind: "image"; src: string; alt: string }
  | { kind: "css"; className: string; alt: string };

/**
 * 视觉小说资源的唯一登记处。剧情与运行时只保存资源键，不拼接 public 路径。
 * CSS 条目是开发占位资源，可在正式美术到位后原位替换为 image 条目。
 */
export const visualAssetManifest = {
  "background.tomb-gate": { kind: "image", src: "/backgrounds/tomb-gate-v1.png", alt: "夜雨中的蛊墓石门" },
  "background.tomb-corridor": { kind: "css", className: "vn-placeholder-tomb-corridor", alt: "阴暗狭长的蛊墓甬道" },
  "background.fog-passage": { kind: "css", className: "vn-placeholder-fog-passage", alt: "被大雾吞没的墓道" },
  "background.blood-chamber": { kind: "css", className: "vn-placeholder-blood-chamber", alt: "血光浮动的五转蛊室" },
  "character.ji-qinghan.placeholder": { kind: "image", src: "/characters/ji-qinghan-v1.webp", alt: "纪清寒基础立绘" },
  "character.ji-qinghan.neutral": { kind: "image", src: "/characters/ji-qinghan-v1.webp", alt: "纪清寒平静表情" },
  "character.ji-qinghan.alert": { kind: "image", src: "/characters/ji-qinghan-v1.webp", alt: "纪清寒警觉表情" },
  "character.ji-qinghan.softened": { kind: "image", src: "/characters/ji-qinghan-v1.webp", alt: "纪清寒神色稍缓" },
  "character.zhao-li.placeholder": { kind: "image", src: "/characters/zhao-li-v1.webp", alt: "赵黎基础立绘" },
  "character.zhao-li.neutral": { kind: "image", src: "/characters/zhao-li-v1.webp", alt: "赵黎平静表情" },
  "character.zhao-li.amused": { kind: "image", src: "/characters/zhao-li-v1.webp", alt: "赵黎玩味表情" },
  "character.zhao-li.wary": { kind: "image", src: "/characters/zhao-li-v1.webp", alt: "赵黎戒备表情" },
  "character.xue-feng.placeholder": { kind: "image", src: "/characters/xue-feng-v1.webp", alt: "薛逢基础立绘" },
  "character.xue-feng.neutral": { kind: "image", src: "/characters/xue-feng-v1.webp", alt: "薛逢平静表情" },
  "character.xue-feng.smiling": { kind: "image", src: "/characters/xue-feng-v1.webp", alt: "薛逢堆笑表情" },
  "character.xue-feng.panicked": { kind: "image", src: "/characters/xue-feng-v1.webp", alt: "薛逢惊慌表情" },
  "character.xue-feng.greedy": { kind: "image", src: "/characters/xue-feng-v1.webp", alt: "薛逢贪婪表情" },
  "character.su-ying.placeholder": { kind: "image", src: "/characters/su-ying-v1.webp", alt: "苏莹基础立绘" },
  "character.su-ying.neutral": { kind: "image", src: "/characters/su-ying-v1.webp", alt: "苏莹平静表情" },
  "character.su-ying.wary": { kind: "image", src: "/characters/su-ying-v1.webp", alt: "苏莹戒备表情" },
  "character.su-ying.sad": { kind: "image", src: "/characters/su-ying-v1.webp", alt: "苏莹悲伤表情" },
  "character.qiao-wujiu.placeholder": { kind: "image", src: "/characters/qiao-wujiu-v1.webp", alt: "乔无咎基础立绘" },
  "character.qiao-wujiu.neutral": { kind: "image", src: "/characters/qiao-wujiu-v1.webp", alt: "乔无咎平静表情" },
  "character.qiao-wujiu.calm": { kind: "image", src: "/characters/qiao-wujiu-v1.webp", alt: "乔无咎从容表情" },
  "character.qiao-wujiu.smug": { kind: "image", src: "/characters/qiao-wujiu-v1.webp", alt: "乔无咎自得表情" },
  "character.su-yan.placeholder": { kind: "css", className: "vn-placeholder-su-yan", alt: "苏衍临时剪影" },
} as const satisfies Record<string, VisualAssetDescriptor>;

export type VisualAssetKey = keyof typeof visualAssetManifest;
export type BackgroundAssetKey = Extract<VisualAssetKey, `background.${string}`>;
export type CharacterAssetKey = Extract<VisualAssetKey, `character.${string}`>;

export function getVisualAsset(key: VisualAssetKey): VisualAssetDescriptor {
  return visualAssetManifest[key];
}

const characterExpressionAssets = {
  "zhao-li": {
    neutral: "character.zhao-li.neutral",
    amused: "character.zhao-li.amused",
    wary: "character.zhao-li.wary",
  },
  "ji-qinghan": {
    neutral: "character.ji-qinghan.neutral",
    alert: "character.ji-qinghan.alert",
    softened: "character.ji-qinghan.softened",
  },
  "xue-feng": {
    neutral: "character.xue-feng.neutral",
    smiling: "character.xue-feng.smiling",
    panicked: "character.xue-feng.panicked",
    greedy: "character.xue-feng.greedy",
  },
  "su-ying": {
    neutral: "character.su-ying.neutral",
    wary: "character.su-ying.wary",
    sad: "character.su-ying.sad",
  },
  "qiao-wujiu": {
    neutral: "character.qiao-wujiu.neutral",
    calm: "character.qiao-wujiu.calm",
    smug: "character.qiao-wujiu.smug",
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
} as const satisfies Record<1 | 2 | 3 | 4, BackgroundAssetKey>;
