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
  "character.ji-qinghan.placeholder": { kind: "image", src: "/characters/ji-qinghan-placeholder.webp", alt: "纪清寒临时立绘" },
  "character.ji-qinghan.neutral": { kind: "image", src: "/characters/ji-qinghan-placeholder.webp", alt: "纪清寒平静表情临时立绘" },
  "character.ji-qinghan.alert": { kind: "image", src: "/characters/ji-qinghan-placeholder.webp", alt: "纪清寒警觉表情临时立绘" },
  "character.ji-qinghan.softened": { kind: "image", src: "/characters/ji-qinghan-placeholder.webp", alt: "纪清寒神色稍缓临时立绘" },
  "character.zhao-li.placeholder": { kind: "css", className: "vn-placeholder-zhao-li", alt: "赵黎临时剪影" },
  "character.xue-feng.placeholder": { kind: "css", className: "vn-placeholder-xue-feng", alt: "薛逢临时剪影" },
  "character.su-ying.placeholder": { kind: "css", className: "vn-placeholder-su-ying", alt: "苏莹临时剪影" },
  "character.qiao-wujiu.placeholder": { kind: "css", className: "vn-placeholder-qiao-wujiu", alt: "乔无咎临时剪影" },
  "character.su-yan.placeholder": { kind: "css", className: "vn-placeholder-su-yan", alt: "苏衍临时剪影" },
} as const satisfies Record<string, VisualAssetDescriptor>;

export type VisualAssetKey = keyof typeof visualAssetManifest;
export type BackgroundAssetKey = Extract<VisualAssetKey, `background.${string}`>;
export type CharacterAssetKey = Extract<VisualAssetKey, `character.${string}`>;

export function getVisualAsset(key: VisualAssetKey): VisualAssetDescriptor {
  return visualAssetManifest[key];
}

const characterExpressionAssets = {
  "ji-qinghan": {
    neutral: "character.ji-qinghan.neutral",
    alert: "character.ji-qinghan.alert",
    softened: "character.ji-qinghan.softened",
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
