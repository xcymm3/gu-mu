import type { Scene, VisualNovelEvent } from "../../model.ts";

const traitorTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "浓雾漫过石厅，翻板起落的闷响接连从脚下传来。薛逢没有像旁人那样出声示警，只踩着尚未翻转的石沿，接连向墙角退去。到第三步时，你忽然欺近，扣住他的后领，借他落脚之势一同踏上墙边那块窄石。" },
  { type: "narration", text: "近处看得更加分明：周围四块石板已有两块翻入深坑，薛逢选中的却都贴着转轴根部，即使机关发动也只会轻颤，不会倾覆。这不是临时撞上的运气。" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "panicked" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "道友轻些！薛某不过耳朵灵，听见哪块石板下有机括响罢了。", expression: "panicked", position: "left" },
  { type: "narration", text: "你没有与他争辩，只让他继续走。薛逢脸上的笑容僵了片刻，随后俯身按过墙根两处不起眼的凹槽。附近翻板的震动随之一缓，仅够二人抢过下一段石路，身后的凹槽便自行弹回。" },
  { type: "narration", text: "如此走出十余步，前方已是石厅尽头。墙角看似封死，底部却没有积灰，砖缝间还透出极细的气流。薛逢伸手摸向两块微微凸起的石砖，指尖临近时又忽然停住。" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "墙后未必是生路。若次序错了，暗门封死，你我都得困在这片雾里。", expression: "panicked", position: "left" },
  { type: "narration", text: "他仍不肯承认自己来过这里，但踏板的死角、暂缓机关的凹槽和眼前的伪墙，已经足够让那套听声辨位的说辞站不住脚。眼下无需逼他交代所有秘密，只须先让他把这道门打开。" },
];

const traitorTrailConvergence = "暗门后没有外界风声，只有牵机丝擦过石槽的细响。你让薛逢先行，自己落后半步。薛逢没有拒绝，也没有回头；他已经明白，你留下他不是因为信任，而是因为门后的路尚需有人辨认。";

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
      {
        id: "traitor-question-steps",
        label: "压住他将要拨动石砖的手，逐处追问每一步落脚依据",
        next: "traitorKnife",
        result: `你将薛逢的手按回墙面：“从第一块没有翻转的石沿说起。哪一步答不清，我们便回雾里重走。”\n\n薛逢脸上的笑意淡了些，只得逐一说出四处踏板的转轴方向，又解释墙根凹槽只能暂缓机关。说到伪墙时，他却故意漏过开启次序。你将他的手向错误的石砖移了半寸，他立即收力，脱口道：“先下后上！碰错便会封死！”\n\n话一出口，他便知道再也遮掩不过，只得按正确次序拨动石砖。墙面向内退开，露出一道仅容一人侧身通过的暗门。\n\n${traitorTrailConvergence}`,
      },
      {
        id: "traitor-bluff-order",
        label: "谎称自己已看懂暗门，故意报错石砖次序等他纠正",
        next: "traitorKnife",
        result: `你松开薛逢的手，指向墙上两块石砖：“先上后下，门便会开。你一路把我引到这里，不就是等我替你试错？”\n\n薛逢盯着你的手指。眼看你真的要按向上方石砖，他终于开口：“慢着！是先下后上。次序反了，暗门会从里面锁死。”\n\n你收回手：“看来薛道友不只会听机括。”\n\n薛逢没有再谈运气。他按自己说出的次序拨动石砖，墙面向内退开，露出一道仅容一人侧身通过的暗门。\n\n${traitorTrailConvergence}`,
      },
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
