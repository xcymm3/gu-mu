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
  { type: "narration", text: "控制室外，薛逢终于承认自己替乔无咎看守机关，还随身带着一枚牵机副印。他跪得很快，许诺替你作证、分出暗庄、甚至反过来暗算乔无咎，只求你把他当作仍有用的狗。" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "薛某知道乔家所有退路！留我一命，我能替道友做很多事！", expression: "panicked", position: "left" },
  { type: "narration", text: "你已经从他口中得到最后一条路。他看见你抬手时仍在笑，似乎相信每个人都会为利益留下他。下一瞬，月白蛊刃贯穿了他的心口。" },
];

const traitorBargainEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "你带着从薛逢手中夺来的副印走入控制室。乔无咎看了一眼印上的血，非但没有追究，反而让出半张操控台——他需要的从来不是忠心，而是一个比薛逢更敢下手的同谋。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "替我把剩下三个人送进祭阵。血魔蛊醒后，乔家给你一个仅次于我的位置。", expression: "smug", position: "right" },
  { type: "narration", text: "你知道承诺未必可信，却也知道拒绝只会立刻成为祭品。更重要的是，你想亲手掌握这座墓的机关，而不是继续做局外之人。" },
];

const traitorOathEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "乔无咎将副印扣上你的手腕，又以双方蛊息立下短暂血誓。他不信你的忠心，你也不信他的许诺；这份盟约唯一可信之处，是你们都准备在血魔蛊醒后除掉对方。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "从现在起，你替我执线。让墓里那些自命不凡的蛊修，亲手走进自己的棺材。", expression: "smug", position: "right" },
];

const traitorControlRoomEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "控制室的石墙后垂着成千上万根牵机丝，每一束都通往一处机关。乔无咎承认自己早已摸清墓中七成结构。你坐上薛逢原先的位置，第一次从执棋者的角度看见仍在雾中挣扎的三名同行者。" },
];

const traitorTrapJiEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "narration", text: "纪清寒循着你故意留下的求救信号赶来。她认出你的身影后没有迟疑，直到脚下阵纹亮起，才明白被救之人正是启动机关的人。你按下副印，将她与断剑一同锁入献祭甬道。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "原来你看见了所有陷阱，只是选择让别人踩下去。", expression: "alert", position: "right" },
];

const traitorSacrificeSuEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "苏莹凭苏氏血脉避开前两道机关，却在血门前被你亲手改写的阵纹截住。她看懂了控制室方向残留的旧玉气息，也看懂了你的选择。你没有与她对视，只把血钥连同她一并送入祭阵。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "你不是没能救我们。你只是想站在最后活着的那个人身边。", expression: "sad", position: "right" },
];

const traitorQiaoTriumphEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "祭阵终于被活血填满。乔无咎兑现了半句承诺，把控制室副印交给你，却把真正的认主阵藏在袖中。你也暗中扣住能使血祭逆流的蛊线，准备在他最得意时夺走一切。" },
];

const traitorZhaoArrivesEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "center", expression: "amused" },
  { type: "narration", text: "血魔蛊破茧前，祭殿里忽然响起掌声。赵黎从一条不在控制图上的旧甬道走出，衣袖染血，气息却比入墓时更加深沉。你与乔无咎算遍所有棋子，唯独把这个从不守棋局规则的人漏在了外面。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "两个躲在墙后拨线的鼠辈，也配分五转蛊？", expression: "amused", position: "center" },
];

const traitorBloodTakenEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "赵黎一击撕开乔无咎准备的认主阵，又以血瓶强行唤醒血魔蛊。乔无咎启动全部傀儡仍被血浪碾碎；你试图逆转血祭，却发现副印从一开始便没有控制真正核心的资格。" },
];

const traitorDiscardedEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "乔无咎倒下前抓住你的衣角，仍命令你替他拖住赵黎。你踢开这枚已经无用的棋子，想用密道独自逃生；然而薛逢死后，最后一条真正通往墓外的退路也随他埋进了无人知晓的石缝。" },
];

const traitorDeathEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "center", expression: "amused" },
  { type: "narration", text: "血光从背后贯穿心脉。赵黎甚至没有询问你为何背叛，只把你的气血当作血魔蛊苏醒后的第一份补物。你看破乔无咎的阴谋，杀死薛逢并亲手送走所有可能救你的人，最终仍死在一场不需要你的胜局里。" },
  { type: "effect", effect: "darken", tone: "danger" },
];

export const traitorActThreeScenes: Record<string, Scene> = {
  traitorTrail: {
    id: "traitorTrail", act: 3, node: 1, chapter: "第三幕 · 乔无咎线 · 节点 1 / 4", title: "挟住棋子",
    events: traitorTrailEvents,
    choices: [
      { id: "traitor-break-finger", label: "折断薛逢一根手指，逼他说实话", next: "traitorKnife", result: "第一声惨叫过后，薛逢果然想起了伪墙后的暗门。你松开他的手：“早些想起来，就不用受这一下。”" },
      { id: "traitor-promise-life", label: "许他一条生路，换乔家的暗门", next: "traitorKnife", result: "“带我见乔无咎，我保你活着出去。”薛逢盯着你的眼睛，明知未必可信，仍赔笑着推开了伪墙。" },
    ],
  },
  traitorKnife: {
    id: "traitorKnife", act: 3, node: 2, chapter: "第三幕 · 乔无咎线 · 节点 2 / 4", title: "无用之人",
    events: traitorKnifeEvents,
    choices: [{ id: "traitor-kill-xue", label: "杀死薛逢，夺走他的副印", next: "traitorBargain", result: "薛逢的笑僵在脸上。你抽出蛊刃，带着染血的副印走向控制室。", effect: { flag: "薛逢已灭口" } }],
  },
  traitorBargain: {
    id: "traitorBargain", act: 3, node: 3, chapter: "第三幕 · 乔无咎线 · 节点 3 / 4", title: "第二双手",
    events: traitorBargainEvents,
    choices: [{ id: "traitor-accept-qiao", label: "接过操纵机关的位置", next: "traitorOath", result: "你站到乔无咎身旁，成为这座墓里的第二双手。", effect: { flag: "乔无咎同谋" } }],
  },
  traitorOath: {
    id: "traitorOath", act: 3, node: 4, chapter: "第三幕 · 乔无咎线 · 节点 4 / 4", title: "血誓同谋",
    events: traitorOathEvents,
    choices: [{ id: "traitor-take-lines", label: "扣上乔无咎交出的副印", next: "traitorControlRoom", result: "血誓落成，你坐上控制室里的第二把石椅。" }],
  },
};

export const traitorActFourScenes: Record<string, Scene> = {
  traitorControlRoom: { id: "traitorControlRoom", act: 4, node: 1, chapter: "第四幕 · 乔无咎线 · 节点 1 / 6", title: "第二位执棋者", events: traitorControlRoomEvents, choices: [{ id: "traitor-find-ji", label: "以求救信号引纪清寒入局", next: "traitorTrapJi", result: "你按下副印，远处随即传出足以乱真的求救声。" }] },
  traitorTrapJi: { id: "traitorTrapJi", act: 4, node: 2, chapter: "第四幕 · 乔无咎线 · 节点 2 / 6", title: "断剑入阵", events: traitorTrapJiEvents, choices: [{ id: "traitor-close-ji", label: "合拢献祭甬道", next: "traitorSacrificeSu", result: "石门在纪清寒面前闭合，断剑声被祭阵彻底吞没。" }] },
  traitorSacrificeSu: { id: "traitorSacrificeSu", act: 4, node: 3, chapter: "第四幕 · 乔无咎线 · 节点 3 / 6", title: "血钥献祭", events: traitorSacrificeSuEvents, choices: [{ id: "traitor-send-su", label: "将苏莹送入血祭", next: "traitorQiaoTriumph", result: "苏氏血钥落入阵心，整座蛊墓的血纹同时亮起。" }] },
  traitorQiaoTriumph: {
    id: "traitorQiaoTriumph", act: 4, node: 4, chapter: "第四幕 · 乔无咎线 · 节点 4 / 6", title: "各怀杀心", events: traitorQiaoTriumphEvents,
    choices: [
      { id: "traitor-call-master", label: "称他一声家主，暂且低头", next: "traitorZhaoArrives", result: "“家主算无遗策。”你接过副印，顺势垂下目光，不让乔无咎看见你指间扣住的逆流蛊线。" },
      { id: "traitor-warn-qiao", label: "掂量副印，提醒他别急着庆功", next: "traitorZhaoArrives", result: "“蛊还没认主，乔家主就开始分位置了？”乔无咎笑意不减，藏在袖中的手却按住了认主阵。" },
    ],
  },
  traitorZhaoArrives: { id: "traitorZhaoArrives", act: 4, node: 5, chapter: "第四幕 · 乔无咎线 · 节点 5 / 6", title: "局外之人", events: traitorZhaoArrivesEvents, choices: [{ id: "traitor-stop-zhao", label: "与乔无咎同时启动全部机关", next: "traitorBloodTaken", result: "傀儡与暗弩同时扑向赵黎，血幕却先一步覆盖祭殿。" }] },
  traitorBloodTaken: { id: "traitorBloodTaken", act: 4, node: 6, chapter: "第四幕 · 乔无咎线 · 节点 6 / 6", title: "血蛊易主", events: traitorBloodTakenEvents, choices: [{ id: "traitor-abandon-qiao", label: "舍弃乔无咎，独自寻找退路", next: "traitorDiscarded", result: "你踢开乔无咎伸来的手，转身冲向薛逢曾提过的密道。" }] },
};

export const traitorActFiveScenes: Record<string, Scene> = {
  traitorDiscarded: { id: "traitorDiscarded", act: 5, node: 1, chapter: "第五幕 · 乔无咎线 · 节点 1 / 2", title: "弃子无路", events: traitorDiscardedEvents, choices: [{ id: "traitor-last-door", label: "推开最后一道石门", next: "traitorDeath", result: "石门之后没有出口，只有追来的血光。" }] },
  traitorDeath: { id: "traitorDeath", act: 5, node: 2, chapter: "第五幕 · 乔无咎线 · 节点 2 / 2", title: "为虎所噬", events: traitorDeathEvents, choices: [{ id: "traitor-end", label: "在血光中闭眼", next: "ending", result: "你最终成为赵黎炼化血魔蛊的最后一份血食。", effect: { ending: "traitor" } }] },
};

export const traitorRouteScenes: Record<string, Scene> = { ...traitorActThreeScenes, ...traitorActFourScenes, ...traitorActFiveScenes };
