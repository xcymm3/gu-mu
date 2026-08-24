import type { VisualNovelEvent } from "../../model.ts";

export const shadowTruthEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "你在暗室角落看见一册用血写就的账本，记的是祭品名单。你的名字，和苏莹的名字，并排写在最后一页。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "乔无咎忽然停下，却没有回头。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "跟了一路，不累么？", expression: "smug", position: "right" },
];

export const qiaoRevealEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "赵黎的身躯在你掌下崩裂倒下。血魔蛊自他的残躯中挣脱，猩红一线没入你的掌心。温热的蛊力顺着经脉游走，像在认主，又像在蛊惑。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "精彩。", expression: "smug", position: "right" },
  { type: "narration", text: "乔无咎从石壁后的阴影里缓缓步出，抚掌而笑。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "我布局十年，等的就是有人替我把这只蛊喂熟。现在，该取回来了。", expression: "smug", position: "right" },
];
