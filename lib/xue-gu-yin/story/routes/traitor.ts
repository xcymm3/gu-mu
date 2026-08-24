import type { Scene, VisualNovelEvent } from "../../model.ts";

const traitorTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "大雾吞没众人时，你没有救谁，只扣住了异常安静的薛逢。你逼着他避开每一道陷阱；他走得太熟，直到控制室的伪墙出现在眼前，才明白自己已经暴露。" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "panicked" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "道友误会了！薛某只是保命本事多些，绝没有替乔家做事！", expression: "panicked", position: "left" },
  { type: "narration", text: "你没有拆穿他的谎话，只让他继续带路。棋子在失去价值以前，不必急着丢掉。" },
];

const traitorKnifeEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "panicked" },
  { type: "narration", text: "控制室外，薛逢终于承认自己替乔无咎传递活蛊线。他跪得很快，许诺替你作证、分出暗庄、甚至反过来暗算乔无咎，只求你把他当作仍有用的狗。" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "薛某知道乔家所有退路！留我一命，我能替道友做很多事！", expression: "panicked", position: "left" },
  { type: "narration", text: "你已经从他口中得到最后一条路。他看见你抬手时仍在笑，似乎相信每个人都会为利益留下他。下一瞬，月白蛊刃贯穿了他的心口。" },
];

const traitorBargainEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "你带着薛逢的活蛊线走入控制室。乔无咎看了一眼线上的血，非但没有追究，反而让出半张操控台——他需要的从来不是忠心，而是一个比薛逢更敢下手的同谋。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "替我把剩下三个人送进祭阵。血魔蛊醒后，乔家给你一个仅次于我的位置。", expression: "smug", position: "right" },
  { type: "narration", text: "你知道承诺未必可信，却也知道拒绝只会立刻成为祭品。更重要的是，你想亲手掌握这座墓的机关，而不是继续做局外之人。" },
];

const traitorOathEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "你借控制室的活蛊线封死退路。纪清寒的断剑坠入血池，苏莹被祭阵吞没；乔无咎大笑着等待血魔蛊认主，却没有发现赵黎早已绕过所有机关。" },
  { type: "character", action: "show", character: "zhao-li", position: "center", expression: "amused" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "两个躲在墙后拨线的鼠辈，也配分五转蛊？", expression: "amused", position: "center" },
  { type: "narration", text: "血光先穿透乔无咎，再贯入你的心脉。你看破了棋局，也冷酷地换掉了无用的棋子，却直到最后才明白：赵黎从未坐上这张棋盘，他只等着把执棋的人一并吃掉。" },
  { type: "effect", effect: "darken", tone: "danger" },
];

export const traitorActThreeScenes: Record<string, Scene> = {
  traitorTrail: {
    id: "traitorTrail", act: 3, node: 1, chapter: "第三幕 · 乔无咎线 · 节点 1 / 4", title: "挟住棋子",
    events: traitorTrailEvents,
    choices: [{ id: "traitor-use-xue", label: "逼薛逢继续带路", next: "traitorKnife", result: "你扣住薛逢的命门，让他亲自带你去见真正的执棋者。" }],
  },
  traitorKnife: {
    id: "traitorKnife", act: 3, node: 2, chapter: "第三幕 · 乔无咎线 · 节点 2 / 4", title: "无用之人",
    events: traitorKnifeEvents,
    choices: [{ id: "traitor-kill-xue", label: "杀死薛逢，带走他的活蛊线", next: "traitorBargain", result: "薛逢的笑僵在脸上。你抽出蛊刃，带着染血的活蛊线走向控制室。", effect: { flag: "薛逢已灭口" } }],
  },
  traitorBargain: {
    id: "traitorBargain", act: 3, node: 3, chapter: "第三幕 · 乔无咎线 · 节点 3 / 4", title: "第二双手",
    events: traitorBargainEvents,
    choices: [{ id: "traitor-accept-qiao", label: "接过操控活蛊线的位置", next: "traitorOath", result: "你站到乔无咎身旁，成为这座墓里的第二双手。", effect: { flag: "乔无咎同谋" } }],
  },
  traitorOath: {
    id: "traitorOath", act: 3, node: 4, chapter: "第三幕 · 乔无咎线 · 节点 4 / 4", title: "为虎所噬",
    events: traitorOathEvents,
    choices: [{ id: "traitor-face-zhao", label: "迎向夺蛊而来的赵黎", next: "ending", result: "血光贯穿心口。你与乔无咎一同成为赵黎炼化血魔蛊的最后两份血食。", effect: { ending: "traitor" } }],
  },
};
