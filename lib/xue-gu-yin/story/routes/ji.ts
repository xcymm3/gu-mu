import type { Scene, VisualNovelEvent } from "../../model.ts";

const jiTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "narration", text: "断剑声从陷道下方传来。你跃入黑暗，在纪清寒被机关锁链拖走前抓住她的手。她借你的肩翻身斩断锁链，落地时却把你护在远离暗箭的一侧。" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "我没有求你下来。", expression: "alert", position: "right" },
  { type: "narration", text: "她说得冷，握住你手腕查看伤势的动作却很轻。你们都没有再提是谁救了谁，只背靠背等下一轮机关停歇。" },
];

const jiPromiseEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "短暂休整时，纪清寒取出一缕早已失去光泽的魂丝。她入墓不是为五转血蛊，而是想寻找能替至亲续命的蛊材；魂丝每暗一分，留给她的时间便少一日。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "若墓中只有害人的东西，我会毁掉它。空手回去，总好过带一场祸事回去。", expression: "softened", position: "right" },
  { type: "narration", text: "你替她重新包好裂开的虎口。她没有道谢，只把仅剩的半瓶疗伤散推到你这一边。" },
];

const jiBurdenEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "narration", text: "岔道中传来苏莹短促的呼声，另一侧却有成群傀儡逼近。纪清寒本可趁机直奔主墓室，却转身与你一同斩开机关门，把困在石缝后的苏莹拖出死地。" },
  { type: "narration", text: "救人耽误了时间，也让乔无咎布置的活蛊线追上来。纪清寒的残剑再添一道裂口；她仍站在最前面，仿佛自己的命从来不在需要权衡的那一边。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "既然伸了手，就别在半途松开。", expression: "softened", position: "right" },
];

const jiThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "血色石门前，纪清寒将断剑抵在阵纹上。门后不只有她需要的续魂蛊材，还有一只足以让整座蛊市化作血食的五转邪蛊。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "进去以后，我先救还能救的人。若再无可救之人，便与你一起毁掉那只蛊。", expression: "softened", position: "right" },
  { type: "narration", text: "你握住她满是裂纹的剑脊，与她共同推开石门。你选择的并不是最安全的路，而是一条必须为每次伸手负责到底的路。" },
];

const jiBloodGateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "血门开启，祭殿里散落着尚未死去的同行者。乔无咎从暗处启动血祭，活蛊线拖着伤者向血池滑去。纪清寒没有看中央的蛊茧，她先把断剑插进地面，替最近的人截住一根线。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "先把人带回来。蛊可以稍后再毁。", expression: "alert", position: "right" },
];

const jiBloodGuardEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "血池里的守门傀儡挡住救人的路。纪清寒以残剑卡住不断收紧的祭线，把正面战场交给你。每拖延一息，身后的活人便离血池更近一寸。" },
];

const jiRescueEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "傀儡倒下后，你与纪清寒逐一斩断活蛊线。她把最后一粒疗伤药喂给伤势最重的人，自己握剑的手却已经被血纹灼得发黑。你接过她的剑，让她腾出双手救下仍在血池边挣扎的苏莹。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "你还记得我说过的话。伸了手，就不能半途松开。", expression: "softened", position: "right" },
];

const jiArrayTruthEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "被斩断的活蛊线全都通向墙后的控制台。乔无咎并非临时起意，他早已熟悉墓中七成机关，只等合适的人替他填满祭阵。纪清寒将断剑横在蛊茧与伤者之间，你则循着活线逼他现身。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "为几个将死之人舍掉五转机缘，你们才是真正的蠢货。", expression: "smug", position: "left" },
];

const jiQiaoDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "cut" },
  { type: "narration", text: "乔无咎亲手拉动整座墓的机关。纪清寒守住你的背后，以断剑截断每一根绕向伤者的活蛊线；你只需向前，把这位自称执棋者的乔家之主从控制台上斩下来。" },
];

const jiDestroyGuEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "乔无咎伏诛，血魔蛊却已在蛊茧中睁开复眼。纪清寒以寒息封住阵眼，你把自身蛊种压进裂缝。两股四转修为同时逆行，足以在五转邪蛊彻底苏醒前毁掉它，也足以让你们从此失去修行根基。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "别怕。废去修为以后，我仍会陪你走出去。", expression: "softened", position: "right" },
];

const jiAftermathEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.dawn-exit", transition: "fade" },
  { type: "narration", text: "蛊种崩碎时，祭殿里落下一场灰白的蛊尘。你与纪清寒互相搀扶，带着幸存者沿失去灵力的机关甬道缓慢前行。没人再拥有争夺机缘的力气，却也没人被留在身后。" },
];

const jiEpilogueEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.dawn-exit", transition: "fade" },
  { type: "narration", text: "墓门外天色初明。多年以后，偏远山野多了一间不问来历的药铺。纪清寒用那柄再也无法灌注真元的断剑劈柴，你替旅人包扎伤口；失去修为并未使那夜的选择变轻，却让你们终于能够把伸出的手握到最后。" },
];

export const jiActThreeScenes: Record<string, Scene> = {
  jiTrail: {
    id: "jiTrail", act: 3, node: 1, chapter: "第三幕 · 纪清寒线 · 节点 1 / 4", title: "断剑回声",
    events: jiTrailEvents,
    choices: [{ id: "ji-bind-wound", label: "坦然承认伤势，让她替你重新包扎", next: "jiPromise", result: "纪清寒替你压住伤口，动作比语气温和得多。", effect: { maxHealth: 4 } }],
  },
  jiPromise: {
    id: "jiPromise", act: 3, node: 2, chapter: "第三幕 · 纪清寒线 · 节点 2 / 4", title: "未尽之约",
    events: jiPromiseEvents,
    choices: [
      { id: "ji-urge-living", label: "劝她先顾好还活着的人", next: "jiBurden", result: "纪清寒沉默片刻，把魂丝收回袖中：“所以我才不能让墓里的祸事出去。”她仍把半瓶药推给了你。" },
      { id: "ji-see-the-end", label: "答应陪她找到最后", next: "jiBurden", result: "“我不保证能救回谁，但会陪你把结果看清。”纪清寒看了你一会儿，把半瓶药放进你手里。" },
    ],
  },
  jiBurden: {
    id: "jiBurden", act: 3, node: 3, chapter: "第三幕 · 纪清寒线 · 节点 3 / 4", title: "不可松手",
    events: jiBurdenEvents,
    choices: [{ id: "ji-save-su", label: "与纪清寒一同把苏莹带离岔道", next: "jiThreshold", result: "你们带着苏莹冲出合拢的机关门，没有把任何一个活人留在身后。" }],
  },
  jiThreshold: {
    id: "jiThreshold", act: 3, node: 4, chapter: "第三幕 · 纪清寒线 · 节点 4 / 4", title: "共赴血门",
    events: jiThresholdEvents,
    choices: [{ id: "ji-open-gate", label: "握住断剑，与她共同破门", next: "jiBloodGate", result: "寒光切开血纹，血色石门在你们面前缓缓开启。" }],
  },
};

export const jiActFourScenes: Record<string, Scene> = {
  jiBloodGate: { id: "jiBloodGate", act: 4, node: 1, chapter: "第四幕 · 纪清寒线 · 节点 1 / 6", title: "先救活人", events: jiBloodGateEvents, choices: [{ id: "ji-cut-lines", label: "与纪清寒一同斩断祭线", next: "jiBloodGuard", result: "你越过蛊茧，径直冲向被血傀儡拦住的伤者。" }] },
  jiBloodGuard: { id: "jiBloodGuard", act: 4, node: 2, chapter: "第四幕 · 纪清寒线 · 节点 2 / 6", title: "血池救援", events: jiBloodGuardEvents, battle: { enemyName: "血傀儡", enemyHealth: 20, victoryNext: "jiRescue", defeatNext: "ending", victoryFlag: "纪清寒线血傀儡已毁", defeatFlag: "死于守门血傀儡", defeatEnding: "deathByBloodGuard" } },
  jiRescue: { id: "jiRescue", act: 4, node: 3, chapter: "第四幕 · 纪清寒线 · 节点 3 / 6", title: "一个不落", events: jiRescueEvents, choices: [{ id: "ji-finish-rescue", label: "带回最后一名伤者", next: "jiArrayTruth", result: "最后一根祭线断开，乔无咎藏身的方向也随之暴露。" }] },
  jiArrayTruth: {
    id: "jiArrayTruth", act: 4, node: 4, chapter: "第四幕 · 纪清寒线 · 节点 4 / 6", title: "线后之人", events: jiArrayTruthEvents,
    choices: [
      { id: "ji-guard-the-wounded", label: "让纪清寒留下守住伤者", next: "jiQiaoDuel", result: "“这里交给你，乔无咎交给我。”纪清寒没有逞强，只将断剑横在伤者身前：“活着回来。”" },
      { id: "ji-promise-return", label: "与她约定两个人都要回来", next: "jiQiaoDuel", result: "你让纪清寒守住祭殿，自己循线追向控制室。她在身后说道：“你若失约，我就进去把你拖回来。”" },
    ],
  },
  jiQiaoDuel: { id: "jiQiaoDuel", act: 4, node: 5, chapter: "第四幕 · 纪清寒线 · 节点 5 / 6", title: "斩断执线者", events: jiQiaoDuelEvents, battle: { enemyName: "乔无咎", enemyHealth: 24, victoryNext: "jiDestroyGu", defeatNext: "ending", victoryFlag: "乔无咎已伏", defeatFlag: "死于乔无咎", defeatEnding: "deathByQiao" } },
  jiDestroyGu: { id: "jiDestroyGu", act: 4, node: 6, chapter: "第四幕 · 纪清寒线 · 节点 6 / 6", title: "破蛊断脉", events: jiDestroyGuEvents, choices: [{ id: "ji-break-gu", label: "与纪清寒一同自毁蛊种", next: "jiAftermath", result: "两枚蛊种同时崩碎，血魔蛊在灰白蛊尘中停止心跳。" }] },
};

export const jiActFiveScenes: Record<string, Scene> = {
  jiAftermath: { id: "jiAftermath", act: 5, node: 1, chapter: "第五幕 · 纪清寒线 · 节点 1 / 2", title: "灰中生路", events: jiAftermathEvents, choices: [{ id: "ji-leave-tomb", label: "扶着彼此走向墓门", next: "jiEpilogue", result: "你们带着所有幸存者，迎着越来越近的天光前行。" }] },
  jiEpilogue: { id: "jiEpilogue", act: 5, node: 2, chapter: "第五幕 · 纪清寒线 · 节点 2 / 2", title: "山野药铺", events: jiEpilogueEvents, choices: [{ id: "ji-end", label: "把药铺的门推开", next: "ending", result: "蛊碎了，人还在。", effect: { ending: "severed" } }] },
};

export const jiRouteScenes: Record<string, Scene> = { ...jiActThreeScenes, ...jiActFourScenes, ...jiActFiveScenes };
