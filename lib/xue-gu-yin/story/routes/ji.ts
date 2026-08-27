import type { Scene, VisualNovelEvent } from "../../model.ts";

const jiTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "narration", text: "你跃入黑暗，一把扣住纪清寒的手腕。两个人的重量同时坠在手臂上，几乎将你整条肩膀扯脱。\\n\\n第二条机关锁链紧随而至，贴着井壁横扫过来。纪清寒听声转身，以剑脊迎上链身。铁链被撞偏数寸，擦着你们头顶砸进石壁，震落大片碎屑。\\n\\n她趁这一瞬反手将长剑刺入井壁石缝。剑锋刮过青石，火星沿着下坠的轨迹一闪而逝，两人的坠势也随之慢了下来。数丈下方恰有一处凸出的检修石台，你借力荡近井壁，与她先后落了上去。\\n\\n双脚踏上石台时，承受了两人重量的剑身终于从中折断。剑尖留在石缝里，纪清寒只来得及收回半截残剑。你落地时用前臂撑住台沿，一块锐利的碎石划破衣袖，血很快洇了出来。\\n\\n纪清寒先抬头确认锁链没有再次落下，随后才看向你的手臂。她从行囊里取出疗伤散和一卷干净的布带，放在身旁的石面上。" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "手臂给我看。方才落得太重，经脉受了震，再拖下去，等机关重启，你未必还能稳住蛊。", expression: "alert", position: "right" },
];

const jiPromiseEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "井壁深处的机括声渐渐低下去。纪清寒确认上方的锁链一时不会再动，这才在石台内侧坐下，将残剑横放在膝前。\\n\\n她把方才用过的疗伤散收回行囊，又从贴身处取出一方折了数层的白绢。白绢展开，里面躺着一缕细若发丝的银线，末端只剩一点极淡的微光。\\n\\n纪清寒以指腹托住魂丝，渡入一线真元。过了近十息，那点微光才沿着银线向前挪动少许，随即又暗了下去。她静静等到光芒彻底停住，才把真元收回。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "这是我离家前留下的一缕魂丝。那边的气息越弱，它亮得便越慢。一个月前，还不必等这么久。", expression: "softened", position: "right" },
  { type: "narration", text: "她没有说明魂丝另一端系着哪位至亲，只将白绢四角重新拢起，却没有立刻收回去。\\n\\n纪清寒入墓并非为了五转蛊物本身。她打听到墓主生前曾搜集过能够温养神魂、延续生机的蛊材，这才随乔无咎来到荒原。只是沿途所见的血纹与禁制都在抽取入墓者的气血，那件所谓的续命蛊材究竟从何而来，已经不像传闻中那般干净。\\n\\n石台后方忽然传来一声轻响。一块原本嵌死在井壁里的窄石板向内退开，露出仅容一人侧身通过的检修通道。纪清寒看了一眼那道缝隙，又低头看向掌中的魂丝。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "我会找到它，也会先弄清它是如何炼成的。若墓里所谓的生机只能从旁人身上夺来……", expression: "softened", position: "right" },
  { type: "narration", text: "她没有把后半句话说完。魂丝末端的微光又颤了一下，很快归于暗淡。" },
];

const jiBurdenEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "narration", text: "岔道中传来苏莹短促的呼声，另一侧却有成群傀儡逼近。纪清寒本可趁机直奔主墓室，却转身与你一同斩开机关门，把困在石缝后的苏莹拖出死地。" },
  { type: "narration", text: "救人耽误了时间，也让乔无咎放出的傀儡追了上来。纪清寒的残剑再添一道裂口；她仍站在最前面，仿佛自己的命从来不在需要权衡的那一边。" },
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
  { type: "narration", text: "血门开启，祭殿里散落着尚未死去的同行者。乔无咎从暗处启动血祭，牵机丝拖着伤者向血池滑去。纪清寒没有看中央的蛊茧，她先把断剑插进地面，替最近的人截住一根。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "先把人带回来。蛊可以稍后再毁。", expression: "alert", position: "right" },
];

const jiBloodGuardEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "血池里的守门傀儡挡住救人的路。纪清寒以残剑卡住不断收紧的祭线，把正面战场交给你。每拖延一息，身后的活人便离血池更近一寸。" },
];

const jiRescueEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "傀儡倒下后，你与纪清寒逐一斩断丝线。她把最后一粒疗伤药喂给伤势最重的人，自己握剑的手却已经被血纹灼得发黑。你接过她的剑，让她腾出双手救下仍在血池边挣扎的苏莹。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "你还记得我说过的话。伸了手，就不能半途松开。", expression: "softened", position: "right" },
];

const jiArrayTruthEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "被斩断的丝线全都通向墙后的控制台。乔无咎并非临时起意，他早已熟悉墓中七成机关，只等合适的人替他填满祭阵。纪清寒将断剑横在蛊茧与伤者之间，你则循线逼他现身。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "为几个将死之人舍掉五转机缘，你们才是真正的蠢货。", expression: "smug", position: "left" },
];

const jiQiaoDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "cut" },
  { type: "narration", text: "乔无咎亲手拉动整座墓的机关。纪清寒守住你的背后，以断剑截断每一根绕向伤者的丝线；你只需向前，把这位自称执棋者的乔家之主从控制台上斩下来。" },
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
    choices: [{ id: "ji-bind-wound", label: "坦然承认伤势，让她替你重新包扎", next: "jiPromise", result: "你不再遮掩，卷起被血浸湿的衣袖。纪清寒将疗伤散敷在伤处，又沿着前臂按住几处受震的经脉，这才用布带一圈圈缠紧。\\n\\n“伤口一时好不了。照我按过的次序运转真元，别让气血再冲开布结。”\\n\\n你依言调息，落地时散乱的气机渐渐归于平稳。伤势并未消失，牵动手臂时依旧作痛，但几条相互冲撞的经脉已经重新畅通，往后再遇险境，也能多承受几分冲击。\\n\\n包扎完毕，纪清寒持着残剑守住石台上方。机关转动的声响逐渐远去，你们终于有了片刻喘息。", effect: { maxHealth: 4 } }],
  },
  jiPromise: {
    id: "jiPromise", act: 3, node: 2, chapter: "第三幕 · 纪清寒线 · 节点 2 / 4", title: "未尽之约",
    events: jiPromiseEvents,
    choices: [
      { id: "ji-urge-living", label: "提醒她：若蛊材以活人祭炼，带回去便是拿别人的命续命", next: "jiBurden", result: "你的目光停在魂丝上，没有避开她方才未能说完的话。\\n\\n“若那件蛊材要用活人祭炼，拿它回去，不过是把一条命换成另一条。”\\n\\n纪清寒指间的白绢慢慢收紧。片刻后，她将魂丝重新包好，收入衣襟。\\n\\n“我知道。”她看向已经开启的检修通道，“所以更要亲眼确认。若真是如此，我会亲手毁了它。我要救的人，也不会肯用别人的命换。”\\n\\n她拿起残剑，先一步侧身进入通道。经过你身旁时，她脚步稍停：“你若看见我迟疑，便再说一遍。”" },
      { id: "ji-see-the-end", label: "告诉她：先找到蛊材查清代价，无论取舍，都陪她到最后", next: "jiBurden", result: "“先找到它。”你说道，“若能用，便设法带回去；若不能用，也要看清它究竟害过多少人。无论最后带走还是毁掉，我陪你走到那里。”\\n\\n纪清寒抬眼看了你一会儿。井壁里又传来一阵遥远的转轴声，她却没有立刻移开视线。\\n\\n“这未必是一条能回头的路。”\\n\\n“我知道。”\\n\\n她将魂丝仔细收回衣襟，起身拿起残剑。走进检修通道前，她把原本准备独自守住前方的剑势略微收窄，为你留出了并肩通行的位置。\\n\\n“那便一起看清。”" },
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
