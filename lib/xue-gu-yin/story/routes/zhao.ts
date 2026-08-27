import type { Scene, VisualNovelEvent } from "../../model.ts";

const zhaoTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "narration", text: "头顶的机关石板轰然闭合，最后一线雾光也被石缝切断。\n\n你与赵黎沿着倾斜的甬道急坠而下，脚下尽是被机关震松的碎石。那些石块擦过衣袍，争先恐后地滚向前方。借着血纹蛊散出的暗红微光，你看见甬道尽头横着数排锈黑铁刺。照这个势头滑下去，护体真元未必挡得住。\n\n赵黎比你早半息出手。血纹蛊从他袖中飞出，数道血线钉入侧壁石缝，生生将他的身形扯得一顿。可那处石壁早已酥脆，血线刚刚绷紧，整片岩层便向外崩落。\n\n你从他身侧滑过，反手扣住他的手腕，同时一脚踏上侧壁凸起的石梁。赵黎也在此时抓住你的前臂，借着这处短暂的支点收回血线。两人各借对方一次力，越过铁刺，翻进上方一处狭窄侧洞。\n\n双脚落地后，你们同时松手，各自退开半步。赵黎掸去袖口的碎屑，先看了一眼已经封死的来路，随后才将目光落到你身上。" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "方才有四条路，你偏挑了老夫这一条。", expression: "amused", position: "left" },
  { type: "narration", text: "你活动了一下被攥得发麻的手腕，平静答道：\n\n“雾中看不清路，血光却看得很清楚。能在这里毫不遮掩地催动血蛊，赵道友总比一条不知通往何处的暗道可靠。”\n\n赵黎听罢，目光在你脸上停留片刻。他自然听得出这句话没有多少信任可言。你追来的原因很简单：他有破开机关的手段，也有争夺五转蛊的资格。跟着这样的强者，既能少走一些冤路，也能提前看清一个迟早要面对的对手。\n\n赵黎低笑一声，转身走向侧洞深处。血纹蛊没有被收入袖中，仍悬在数丈之外探查石缝。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "跟得上便来。若还要老夫回头拉你，你就留在这里。", expression: "amused", position: "left" },
  { type: "narration", text: "他说完便不再理会你。血纹蛊投下的一小片红光在前方缓缓移动，既替你照出脚下的机关，也始终与你保持着一段随时可以翻脸的距离。\n\n更深处传来细碎的碰撞声，像是许多干枯骨节被穿堂风吹得彼此摩擦。\n\n这还算不上结盟。你们只是暂时认定，对方活着比死在这里更有用。" },
];

const zhaoLessonEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "侧洞尽头比别处宽阔一些，地面却被横七竖八的枯骨堵得无处落脚。这些人死去的年岁并不相同，有些衣甲尚未烂尽，有些只剩一层灰白骨粉。\n\n前路被一扇无缝石门截断。门上没有锁孔，只在正中刻着一枚巴掌大小的凹印，周围的细槽早已被暗褐色血垢填满。\n\n赵黎俯身查看片刻，目光落到一具尚未完全风化的尸骨上。那具尸骨的小臂断在骨堆外侧，髓腔深处还凝着少许发黑的旧血。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "退后。别让自己的血气混进来。", expression: "wary", position: "left" },
  { type: "narration", text: "血纹蛊伏上断骨，细长口器探入髓腔，将那点几乎干透的旧血一丝丝抽出。赵黎又划破指腹，添入自己的一滴鲜血。\n\n两股气血并未相融，反而在半空彼此排斥。赵黎五指接连变换，真元沿血线分成数股，时而压制旧血中的死气，时而牵引它依照石门凹印的轮廓游走。十余息后，一枚薄如蝉翼的临时血印逐渐成形。\n\n他不是在向你传授法门，只是这道门恰好需要一枚属于死者的血印。可他分理气血时没有半点迟滞，寻常蛊修避之不及的污血与死气，在他手里却各有去处。\n\n血印即将嵌入石门时，骨堆下方忽然透出一缕寒气。一具冻裂的枯骨随之崩开，肋骨间掉出半枚灰白骨简。简上的淡蓝蛊纹受到血气牵引，骤然亮起，附近几根血线顿时覆上一层薄霜，运转也慢了下来。\n\n赵黎屈指一弹，震碎血线上的冰霜，目光在骨简上略停了一瞬。确认它只剩半篇后，他便重新将血印压入门中。\n\n你已经看清骨简上的几行残文。上面所记并非完整蛊术，而是血属蛊虫遭遇极寒时，真元最容易迟滞的几处运转节点。\n\n随着血印没入凹槽，封门内部响起沉重的转动声。赵黎站在逐渐开启的门前，没有替你收走那枚骨简，也没有出言催促。" },
];

const zhaoPriceEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "narration", text: "前路传来薛逢的求救声。石壁正在合拢，他伸出半只染血的手，许诺把乔家给他的所有好处都交出来。赵黎没有停步，你也只是记下机关闭合的规律，从另一侧穿了过去。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "很好。想拿五转蛊，便不能总想着救下每一个废物。", expression: "amused", position: "left" },
  { type: "narration", text: "这句赞许没有令你安心。赵黎看你的眼神，和看方才那片可供炼蛊的枯骨并无区别。你越接近他所认可的强者，也越接近必须与他分出生死的那一刻。" },
];

const zhaoThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "血色石门后的蛊息已经压得人气血翻涌。赵黎停在门前，第一次不再以“老夫”自居，只平静地与你约定：门开启之前共同破局，血魔蛊现世之后，各凭本事。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "若你死在别人手里，我会觉得可惜。若你死在我手里，那便正好。", expression: "wary", position: "left" },
  { type: "narration", text: "你收紧藏在袖中的冰寒蛊简，与他一同推开石门。所谓同行到此为止；门后的每一步，都会把你们推向同一只蛊，也推向彼此。" },
];

const zhaoBloodGateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "石门之后并非藏宝室，而是一座被血色阵纹填满的祭殿。乔无咎的声音从机关深处传来，承认五名蛊修从踏进墓门起便是唤蛊的血食。你与赵黎没有惊慌，只同时望向祭殿中央仍在跳动的蛊茧。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "看来老夫没有看错。真正值钱的东西，果然要拿命来换。", expression: "amused", position: "left" },
];

const zhaoBloodGuardEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "蛊茧前的血池轰然裂开，一具由旧日祭品缝成的血傀儡撑地而起。赵黎退到阵边，不肯替你出手；这是他对同行者最后一次衡量，也是你向五转蛊证明自己有资格靠近的第一战。" },
];

const zhaoAwakeningEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "血傀儡倒下后，赵黎割开掌心，将早已备好的血瓶尽数倒入祭阵。蛊茧吸饱血气，外壳一寸寸剥落；所谓血魔蛊终于从漫长死寂中苏醒。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "同路到此为止。你既然也想要它，便来取。", expression: "wary", position: "left" },
];

const zhaoDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "赵黎不再隐藏四转巅峰的修为。血线封住石门，反噬血幕映出你的每一次出手；你袖中的冰寒蛊简则将血气一层层冻住。这一战不为同伴或正邪，只为决定谁有资格成为血魔蛊的新主。" },
];

const zhaoClaimEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "赵黎的血线终于断裂。你从他掌中夺下血魔蛊，任由猩红蛊纹沿手臂爬向心口。力量涌入经脉的瞬间，你听见乔无咎在控制室里失态怒吼；他精心准备的五转蛊，竟认了另一个主人。" },
  { type: "effect", effect: "flash", tone: "danger" },
];

const zhaoQiaoDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "乔无咎打开所有暗门，带着傀儡群亲自杀入祭殿。他仍把你当作可回收的祭品，却没有料到血魔蛊每一次撕开他的防御，都会把夺来的气血补回你的身体。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "那是乔家的蛊！你也配据为己有？", expression: "smug", position: "right" },
];

const zhaoFallEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "乔无咎的尸身迅速干瘪，血魔蛊却仍不肯停下。祭殿里每一滴尚有温度的血都在呼唤你，连曾与你并肩的人也逐渐变成可以补足修为的血食。你曾以为自己追逐的是不受任何人摆布的力量，如今力量反过来替你决定一切。" },
];

const zhaoEpilogueEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "天亮时，蛊墓里再无第二道呼吸。你踏着血水走出墓门，五转蛊威使荒原虫兽尽数伏地。没有人能再夺走你的机缘，也没有人能从你眼中找到昔日那个入墓之人。" },
  { type: "effect", effect: "darken", tone: "danger" },
];

export const zhaoActThreeScenes: Record<string, Scene> = {
  zhaoTrail: {
    id: "zhaoTrail", act: 3, node: 1, chapter: "第三幕 · 赵黎线 · 节点 1 / 4", title: "逐血而行",
    events: zhaoTrailEvents,
    choices: [{ id: "zhao-keep-up", label: "不问退路，跟上赵黎", next: "zhaoLesson", result: "你踏过松动的碎石，跟上前方那点若隐若现的血光。赵黎没有回头，只让血纹蛊在两人之间留下了一段不远不近的距离。侧洞越走越冷，前方逐渐露出一片横倒在地的惨白枯骨。" }],
  },
  zhaoLesson: {
    id: "zhaoLesson", act: 3, node: 2, chapter: "第三幕 · 赵黎线 · 节点 2 / 4", title: "强者之法",
    events: zhaoLessonEvents,
    choices: [{ id: "zhao-take-scroll", label: "收起冰寒蛊简，把克制血蛊的法门记下", next: "zhaoPrice", result: "你从碎骨间拾起冰寒蛊简，以一缕真元扫过其中残文，将那几处血气滞点记在心中。\n\n赵黎从眼角瞥见你的动作，没有阻拦。\n\n“半篇残简而已。真到了动手的时候，能不能用出来，还要看你的本事。”\n\n石门已经升起大半。你将冰寒蛊简收入袖中，随他跨过门槛。前方甬道深处隐约传来一阵急促的撞击声，其间还夹着一个男人断断续续的呼喊。", effect: { flag: "冰寒蛊简" } }],
  },
  zhaoPrice: {
    id: "zhaoPrice", act: 3, node: 3, chapter: "第三幕 · 赵黎线 · 节点 3 / 4", title: "力量的价钱",
    events: zhaoPriceEvents,
    choices: [
      { id: "zhao-dismiss-xue", label: "告诉赵黎，你只救还有用的人", next: "zhaoThreshold", result: "“我不是不救人，只是不救已经没用的人。”赵黎低笑一声：“那你最好一直有用。”" },
      { id: "zhao-mark-xue", label: "记下薛逢遇险的位置", next: "zhaoThreshold", result: "赵黎瞥见你在石壁上留下暗记：“还想回来救他？”你摇头：“他知道乔家的路。”赵黎这才笑了。" },
    ],
  },
  zhaoThreshold: {
    id: "zhaoThreshold", act: 3, node: 4, chapter: "第三幕 · 赵黎线 · 节点 4 / 4", title: "同盟尽头",
    events: zhaoThresholdEvents,
    choices: [{ id: "zhao-open-gate", label: "与赵黎一同推开血色石门", next: "zhaoBloodGate", result: "石门洞开，血光将两个人的影子拉向同一座血池。" }],
  },
};

export const zhaoActFourScenes: Record<string, Scene> = {
  zhaoBloodGate: { id: "zhaoBloodGate", act: 4, node: 1, chapter: "第四幕 · 赵黎线 · 节点 1 / 6", title: "血祭真相", events: zhaoBloodGateEvents, choices: [{ id: "zhao-enter", label: "踏入祭殿", next: "zhaoBloodGuard", result: "你越过血纹，走向守在蛊茧前的血傀儡。" }] },
  zhaoBloodGuard: { id: "zhaoBloodGuard", act: 4, node: 2, chapter: "第四幕 · 赵黎线 · 节点 2 / 6", title: "资格之战", events: zhaoBloodGuardEvents, battle: { enemyName: "血傀儡", enemyHealth: 20, victoryNext: "zhaoAwakening", defeatNext: "ending", victoryFlag: "赵黎线血傀儡已毁", defeatFlag: "死于守门血傀儡", defeatEnding: "deathByBloodGuard" } },
  zhaoAwakening: {
    id: "zhaoAwakening", act: 4, node: 3, chapter: "第四幕 · 赵黎线 · 节点 3 / 6", title: "五转蛊醒", events: zhaoAwakeningEvents,
    choices: [
      { id: "zhao-question-trust", label: "问他是否从未打算让你活着", next: "zhaoDuel", result: "赵黎坦然答道：“若你连老夫都胜不过，活着出去又有何用？”你按住袖中的冰寒蛊简，向他走去。" },
      { id: "zhao-welcome-duel", label: "告诉他，你等这一刻很久了", next: "zhaoDuel", result: "“正合我意。”你抽出冰寒蛊简。赵黎咧嘴一笑，血线随之封死所有退路。" },
    ],
  },
  zhaoDuel: { id: "zhaoDuel", act: 4, node: 4, chapter: "第四幕 · 赵黎线 · 节点 4 / 6", title: "血蛊相争", events: zhaoDuelEvents, battle: { enemyName: "赵黎", enemyHealth: 22, victoryNext: "zhaoClaim", defeatNext: "ending", victoryFlag: "赵黎已败", defeatFlag: "赵黎夺蛊", defeatEnding: "deathByZhao" } },
  zhaoClaim: { id: "zhaoClaim", act: 4, node: 5, chapter: "第四幕 · 赵黎线 · 节点 5 / 6", title: "血魔认主", events: zhaoClaimEvents, choices: [{ id: "zhao-take-gu", label: "炼化血魔蛊", next: "zhaoQiaoDuel", result: "血魔蛊钻入蛊窍，旧有攻蛊在血光中崩散。", effect: { flag: "血魔蛊" } }] },
  zhaoQiaoDuel: { id: "zhaoQiaoDuel", act: 4, node: 6, chapter: "第四幕 · 赵黎线 · 节点 6 / 6", title: "执棋者末路", events: zhaoQiaoDuelEvents, battle: { enemyName: "乔无咎", enemyHealth: 24, victoryNext: "zhaoFall", defeatNext: "ending", victoryFlag: "乔无咎已伏", defeatFlag: "死于乔无咎", defeatEnding: "deathByQiao" } },
};

export const zhaoActFiveScenes: Record<string, Scene> = {
  zhaoFall: { id: "zhaoFall", act: 5, node: 1, chapter: "第五幕 · 赵黎线 · 节点 1 / 2", title: "蛊食其主", events: zhaoFallEvents, choices: [{ id: "zhao-embrace", label: "不再压制血魔蛊", next: "zhaoEpilogue", result: "你放开最后一道心防，任由血浪席卷整座蛊墓。" }] },
  zhaoEpilogue: { id: "zhaoEpilogue", act: 5, node: 2, chapter: "第五幕 · 赵黎线 · 节点 2 / 2", title: "血月出墓", events: zhaoEpilogueEvents, choices: [{ id: "zhao-end", label: "走入血色天光", next: "ending", result: "从此世间多了一位血蛊魔君。", effect: { ending: "demon" } }] },
};

export const zhaoRouteScenes: Record<string, Scene> = { ...zhaoActThreeScenes, ...zhaoActFourScenes, ...zhaoActFiveScenes };
