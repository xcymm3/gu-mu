import type { Ending, Role, RoleId, Scene } from "../model.ts";
import { gateEvents } from "./events/act1.ts";
import { chamberEvents, fogEvents, illusionEvents, puppetsEvents, shadowEvents, swarmEvents } from "./events/act2.ts";
import { bloodGateEvents, routeCostEvents, routeTrialEvents, routeTruthEvents, shadowBargainEvents, shadowBetrayalEvents, shadowQiaoEvents } from "./events/act3.ts";
import { awakeningEvents, bloodGuardEvents, bloodRoomEvents, finaleEvents, masterBattleEvents, qiaoBattleEvents, zhaoBattleEvents } from "./events/act4.ts";
import { qiaoRevealEvents, shadowTruthEvents } from "./events/key-scenes.ts";

export const storyMeta = {
  title: "血蛊引",
  subtitle: "夜雨蛊市 · 五人入墓",
  acts: [
    { act: 1, name: "聚", nodes: 1 },
    { act: 2, name: "入", nodes: 6 },
    { act: 3, name: "离", nodes: 4 },
    { act: 4, name: "血魔蛊室", nodes: 3 },
    { act: 5, name: "结局", nodes: "可变" },
  ],
} as const;

export const storyPresentation = {
  names: ["赵黎", "纪清寒", "薛逢", "苏莹", "乔无咎", "苏衍"],
  criticalTerms: ["血魔蛊", "五转", "血祭", "祖传旧玉", "月光蛊", "血刃蛊", "血甲蛊"],
};

export const roles: Role[] = [
  { id: "healer", name: "游方蛊医", gender: "male", title: "四转巅峰 · 游方蛊医", description: "居无定所的流浪蛊医，擅长回春之术。", maxHealth: 14, maxEssence: 12, attack: 3, signatureGu: "回春蛊", sense: "normal" },
  { id: "swordsman", name: "流浪剑修", gender: "male", title: "四转巅峰 · 流浪剑修", description: "以蛊御剑，不善言辞，只求用剑法斩尽一切。", maxHealth: 15, maxEssence: 10, attack: 4, signatureGu: "剑鸣蛊", sense: "normal" },
  { id: "heir", name: "世家之子", gender: "male", title: "四转巅峰 · 世家之子", description: "曾有过显赫世家，如今却穷困潦倒。神识过人，能看清人心。", maxHealth: 12, maxEssence: 10, attack: 3, signatureGu: "惑心蛊", sense: "high" },
];

export const scenes: Record<string, Scene> = {
  gate: {
    id: "gate", act: 1, node: 1, chapter: "第一幕 · 聚 · 节点 1 / 1", title: "夜雨墓门",
    events: gateEvents,
    choices: [
      { id: "jade", label: "旧玉发烫，你不动声色地把它攥进掌心，只当没察觉", next: "swarm", result: "旧玉在掌心越发灼热，隐隐有一股微弱的神识波动自门后透出，仿佛正隔着虚空与你遥遥对视。你面不改色，借着袖袍遮掩将旧玉攥得更紧了三分，体内真元悄然流转，只当浑然不知。这等异象愈是剧烈，你便愈发确定——这座看似寻常的蛊修大墓深处，定然藏着某种与你这枚旧玉有着莫大渊源的至宝。", effect: { flag: "旧玉发烫" } },
      { id: "observe-su", label: "你落后半步，恰好听清苏莹对着墓门念出的最后几个音节", next: "swarm", result: "你故意放缓脚步落后了半步，凝神细听，恰好捕捉到了苏莹口中吐出的最后几个极微弱的音节。那发音晦涩古朴，绝非当世通用的语言，反倒似某种失传已久的祭祀古咒。苏莹似乎警觉地察觉到了你的注视，指尖猛地一顿，随即装作若无其事地加速划动，试图将刚才的失态遮掩过去。", effect: { flag: "苏莹低语" } },
      { id: "enter", label: "你垂下眼，随着乔无咎的背影第一个跨进墓门", next: "swarm", result: "你眼神微敛，收敛周身气息，紧随着乔无咎的脚步径直跨入了漆黑的墓门。石门合拢的刹那，身后肆虐的雨声被瞬间隔绝。墓道内阴气森森，刺骨的寒意直往骨头缝里钻，连呼出的白气都仿佛要冻结成冰。你心知肚明，踏出这一步，便再无退路可言。" },
      { id: "insight", label: "你扫过五人散乱的站位，心里忽然浮起一念——这墓门的生门，似不止一个", next: "swarm", result: "你凭借着异于常人的强大神识，暗中将五人看似散乱的站位尽收眼底，心头忽地闪过一丝明悟——这墓门前的禁制生门竟然并非唯一！整座墓门仿佛一副早已布好的杀局棋盘，只等旁人误入其中。乔无咎的站位占据阵眼，赵黎卡住死角，甚至连冷傲的纪清寒都恰好踏在变数之位上。看清这暗藏的杀机后，你心中不由泛起一股刺骨的寒意。", requires: { flags: ["高神识"] }, effect: { flag: "识破棋局" } },
    ],
  },
  swarm: {
    id: "swarm", act: 2, node: 1, chapter: "第二幕 · 入 · 节点 1 / 6", title: "甬道蛊潮",
    events: swarmEvents,

    choices: [
      { id: "shout-xue", label: "回身朝薛逢喝道：“别退，贴壁走！”", next: "shadow", result: "你收敛真元，回身低沉断喝：“别退，贴壁走！运真元附背，贴紧石壁！”薛逢吓得浑身一抖，出于求生本能死死贴住石壁。说来也奇，那涌动的虫潮顺着石壁的弧度竟绕开了他的身体，顺势向前涌去。薛逢愣了半晌，这才如梦初醒般长舒一口气，朝你挤出一个比哭还难看的讨好笑容，连连拱手。几步之外的赵黎见状微微皱眉，冷哼了一声，显然对你多管闲事、扰了他观蛊的兴致极为不满。", effect: { trust: { xue: 1, zhao: -1 } } },
      { id: "shift-ji", label: "与纪清寒错身换位，堵住她身侧的空当", next: "shadow", result: "你脚下步法一变，身形如风般与纪清寒错身而过，顺势挡在她身侧的防守死角，手中月光蛊不断激发，替她挡下了侧后方扑来的密集蛊虫。纪清寒薄唇微张，似乎道了一句无声的“多谢”。有你护住死角，她再无后顾之忧，手中剑蛊催动到极致，一道道凌厉的寒芒将迎面而来的黑潮强行撕裂。被挤到队尾的薛逢左支右绌，眼中除了惶恐，看向你二人的眼神中更添了几分阴鸷与嫉恨。", effect: { trust: { ji: 1, xue: -1 } } },
      { id: "observe-all", label: "按住旧玉，任蛊潮从身侧绕开，静静观察众人", next: "shadow", result: "你悄然将一缕真元注入腰间旧玉，原本斑驳暗淡的旧玉表面忽地散发出一股幽微的光晕。令人惊异的是，凡是被这股光晕笼罩的噬魂蛊，竟如遭雷击般瞬间僵死落地，其余蛊虫更是如见天敌，纷纷惊恐地避开你身周三尺。顷刻间，你周围便清理出一片空地。远处的赵黎将这一幕尽收眼底，目光在你掌心的旧玉上停留了片刻，嘴角勾起一抹玩味的邪笑；而缩在后面的苏莹则是脸色微微一变，看你的眼神多了几分忌惮。", effect: { trust: { zhao: 1, su: -1 } } },
    ],
  },
  shadow: {
    id: "shadow", act: 2, node: 2, chapter: "第二幕 · 入 · 节点 2 / 6", title: "血影示警",
    events: shadowEvents,

    choices: [
      { id: "refuse-zhao", label: "垂下眼，把旧玉按回袖中", next: "chamber", result: "你眼神沉敛，并未开口理会赵黎的言语挑衅，只是暗中调动真元，顺势将发烫的旧玉推入袖袍深处，指腹紧紧贴着那股惊人的灼热。赵黎盯着你看了良久，脸上的阴邪笑意渐渐淡去，半晌才幽幽道：“……藏得深也好。”他没再追问，只是指尖的血纹蛊虫转了一圈，似在暗中记下这一笔。纪清寒虽未出声，却在侧身时微不可察地朝你微微颔首——只要你守口如瓶，她便不会追查你的机缘。唯有苏莹在你藏玉的瞬间飞快扫了你的袖口一眼，转瞬又低垂下头去。你暗自握紧掌心，指节微白。", effect: { trust: { zhao: -1, ji: 1 } } },
      { id: "ask-ji", label: "压低声，顺着“生门”两个字追下去", next: "chamber", result: "你收敛气息，压着声线，把“生门”两个字接下去：“等谁？”纪清寒默然许久，久到周围人以为她不会作答时，她才极轻地补了一句没头没尾的话。那句话像一粒冰落进心里，却慢慢化开成一扇门的轮廓。赵黎在数步外似有所觉，眉梢微挑，抱着双臂如在看戏；苏莹的娇躯则几不可察地微微颤抖了一下，绞着袖口的手指陡然收紧，似被那句话戳中了隐藏最深的痛处。没有人再开口，甬道里只余那道血影，还停在暗纹前，等着这句问答的余音散尽。", effect: { trust: { ji: 1, su: 1 }, flag: "生门低语" } },
      { id: "ask-su", label: "转向苏莹，轻声问她墓主在等什么人", next: "chamber", result: "你蓦然转头，双目如电般盯紧苏莹，开门见山地轻声质问：“苏道友，这墓主究竟在等什么人？”苏莹浑身一颤，娇小的身躯几乎站立不稳，咬着下唇半晌，才吐出几个微弱如蚊蚋的字节。从她那惊恐莫名的神色中，你瞬间断定：她绝对知晓这大墓真正的秘密，只是不能说，也不敢说！赵黎见状嘿嘿低笑了一声，看你的目光中多了几分对胆大妄为者的赏识；纪清寒则秀眉微皱，略带不悦地将视线移回墙上的血影。你这一问犹如投石入井，让整座大墓暗流汹涌的局势愈发难以预测。", effect: { trust: { su: 1, zhao: 1, ji: -1 }, flag: "活符低语" } },
    ],
  },
  chamber: {
    id: "chamber", act: 2, node: 3, chapter: "第二幕 · 入 · 节点 3 / 6", title: "机关暗室",
    events: chamberEvents,

    choices: [
      { id: "take-armor", label: "伸手取那枚甲纹森森的蛊卵", next: "illusion", result: "你不再犹豫，探手将那枚甲纹森森的蛊卵抓入手中。冰玉触感极凉，上面的表皮纹路犹如密密麻麻的精钢甲片，刚一接触你的真元，竟如活物般微微蜷缩，主动吸纳你的气息。你顺势将其收入蛊囊，腰间原本护体的“甲衣蛊”顿时微微震颤。赵黎在旁冷哼了一声；乔无咎神色平静；唯有苏莹在你收蛊的刹那，飞快瞥了你一眼，又垂下眼去。卵壳里的光，在你合上蛊囊的刹那，悄然暗了下去。", effect: { flag: "血甲蛊" } },
      { id: "take-blade", label: "伸手取那枚血芒吞吐的蛊卵", next: "illusion", result: "你探出右手，径直抓向那枚血芒吞吐的蛊卵。蛊卵入手微温，冰玉之下竟隐隐传来犹如心脏跳动般的律动，一下又一下敲击着你的指腹。你顺手将其纳入蛊囊，原本温驯的“月光蛊”光芒骤然黯淡，仿佛被这股强悍的血腥杀伐之气强行压制。赵黎的视线在你的蛊囊上扫过；薛逢贪婪地咽着唾沫。新蛊入囊，你已能清晰感觉到，它正在你真元的温养下慢慢展现锋芒，缓缓盘成一线锋刃的形状。", effect: { flag: "血刃蛊" } },
      { id: "yield-su", label: "把先手让给苏莹，让她先挑", next: "illusion", effect: { trust: { su: 1 }, flags: ["活符低语"], randomFlags: ["血甲蛊", "血刃蛊"] } },
    ],
  },
  illusion: {
    id: "illusion", act: 2, node: 4, chapter: "第二幕 · 入 · 节点 4 / 6", title: "迷魂阵",
    events: illusionEvents,

    choices: [
      { id: "hold-ji", label: "抬手按住纪清寒的剑柄，对薛逢摇了摇头", next: "puppets", result: "你沉吟片刻，抬手按在纪清寒出鞘的剑柄之上，朝她微不可察地摇了摇头，随即又淡然看向薛逢。纪清寒娇躯一震，感知到你掌心传来的沉稳真元，指尖紧绷的力道终于缓缓松开，并未追问原由——你这一按，把她从幻境的余韵里按回了当下。薛逢讪讪退后半步，脸上的谄笑瞬间僵硬，眼底闪过一丝狠戾。远处观望的赵黎冷哼一声，转身去查看石台蛊纹。唯独纪清寒垂下美眸，耳根的绯红久久未曾消退。", effect: { trust: { ji: 1, xue: -1 } } },
      { id: "ask-su", label: "若无其事地岔开话，问苏莹有无被阵法伤到", next: "puppets", result: "你面色如常地收回目光，主动打破僵局，转头询问苏莹方才可曾被幻阵反噬。苏莹如从梦魇中惊醒，有些失神地抬眼看你，半晌才应了一声，微弱地道了声谢——你这一问，恰好帮她掩饰了适才诵咒流泪的失态，她方才贴着石壁念旧咒、眼角带泪的模样，落在谁眼里都太扎眼。然而侧旁纪清寒的眼神却瞬间冷了下来，手握剑柄微微紧握，别过头去不再看你。薛逢趁机在旁大肆附和，反倒让气氛愈发古怪。", effect: { trust: { su: 1, ji: -1 } } },
      { id: "fix-ji", label: "沉默着替纪清寒把歪斜的剑穗扶正", next: "puppets", result: "你自始至终未发一言，只是神色泰然地伸出手指，替纪清寒将此前激战中歪斜的剑穗轻轻理顺。那剑穗早已染血磨损，在她紧握下略显凌乱。纪清寒娇躯微僵，耳根红晕更甚，紧握剑柄的玉手先紧后松，最终低低道了句“走吧”，将长剑缓缓还入鞘中——她没有道谢，可那柄剑还入鞘里的动作，比任何谢字都轻。远处的苏莹见状，眼底掠过一丝温和的笑意；赵黎则在阴暗处冷冷啐了一口，面露厌恶。", effect: { trust: { ji: 1, su: 1, zhao: -1 } } },
    ],
  },
  puppets: {
    id: "puppets", act: 2, node: 5, chapter: "第二幕 · 入 · 节点 5 / 6", title: "铜皮傀儡",
    events: puppetsEvents,

    battle: { enemyName: "铜皮傀儡", enemyHealth: 12, victoryNext: "fog", defeatNext: "fog", victoryFlag: "傀儡已毁", defeatFlag: "傀儡重伤" },
  },
  fog: {
    id: "fog", act: 2, node: 6, chapter: "第二幕 · 入 · 节点 6 / 6", title: "大雾迷踪",
    events: fogEvents,

    choices: [
      { id: "take-zhao", label: "抓住赵黎的手", next: "routeTrial", result: "蛊雾里你只来得及抓住最近的那只手——是赵黎的。那只手冰凉而稳，指节粗粝，几乎在你攥住的同一瞬就反握回来，力道大得不容你挣脱，像早有准备，也像早就等着这一握。雾里传来他低低一声笑：“抓稳了，摔下去，老夫可不管你。”话是这么说，那只手却把你在下坠的颠簸中拽得牢牢的。", requires: { allyTopTwo: "zhao" }, effect: { route: "zhao", trust: { zhao: 1 } } },
      { id: "take-ji", label: "抓住纪清寒的手", next: "routeTrial", result: "蛊雾里你抓住的那只手，是纪清寒的。她的手心沁着一层薄汗，指尖却在触到你的一瞬反手攥紧了你，紧得指节发白。她没有说话——下坠的风声里，你只听见她短促的呼吸贴着耳侧，剑鞘在黑暗里磕出一点响。直到陷道收住，她才松开手，声音低得几乎听不见：“……谢了。”", requires: { allyTopTwo: "ji" }, effect: { route: "ji", trust: { ji: 1 } } },
      { id: "take-xue", label: "抓住薛逢的手", next: "routeTrial", result: "蛊雾里你抓住的那只手，是薛逢的。他抖得厉害，手心全是冷汗，在你攥住他的瞬间，他整个人像抓住了救命稻草，指甲几乎掐进你手背。等颠簸稍定，他长舒了一口气，又恢复了那副自来熟的笑模样：“多谢多谢，薛某这条命，算是记在道友名下了。”——只是那双眼睛，在黑暗里转得比谁都快。", requires: { allyTopTwo: "xue" }, effect: { route: "xue", trust: { xue: 1 } } },
      { id: "take-su", label: "抓住苏莹的手", next: "routeTrial", result: "蛊雾里你抓住的那只手，是苏莹的。她的手很小，冷得几乎没有温度，像刚从冰水里捞出来。她没有挣扎，也没有回握，只任你攥着，呼吸轻得几乎感觉不到。下坠的颠簸里，她忽然极轻地说了一句，像是说给你听，又像是说给这座墓听：“……你不该抓我的。”你还没品出这句话的滋味，陷道已经到底了。", requires: { allyTopTwo: "su" }, effect: { route: "su", trust: { su: 1 } } },
      { id: "follow-qiao", label: "你没有随众人下坠。雾里那道身影拐进一条暗路——你跟了上去。", next: "shadowQiao", result: "你没有随众人下坠。你松开将要抓住的那只手，屏息跟上雾里那道身影。乔无咎贴着石壁，拐进那条连火光都照不进去的岔道，脚步极轻，落脚时几乎不沾尘土，像早在这座墓里走过千百遍。岔道越走越窄，你在黑暗里跟了三道弯，心头那点疑虑越来越重：一个引众人入墓的散修，凭什么对这墓里的暗路熟成这般？身后传来塌陷的闷响，你回头，雾里已经什么都看不见了；再转回头，那道身影已快没入黑暗，你只得加快脚步。", requires: { flags: ["识破棋局"] } },
    ],
  },
  routeTrial: {
    id: "routeTrial", act: 3, node: 1, chapter: "第三幕 · 离 · 节点 1 / 4", title: "陷道同行",
    events: routeTrialEvents,
    choices: [
      { id: "zhao-cold", label: "收起冰寒蛊简，将秘术暗记于心", next: "routeTruth", result: "你收起冰寒蛊简，将秘术暗记于心。血魔蛊畏寒——这或许是压制它的关键。", requires: { route: "zhao" }, effect: { flag: "冰寒蛊简" } },
      { id: "ji-shield", label: "替纪清寒挡下那一记重拳", next: "routeTruth", result: "你替纪清寒挡下那一记重拳，虎口一麻，却只觉气血翻涌间更凝实了几分。", requires: { route: "ji" }, effect: { health: 4, maxHealth: 4 } },
      { id: "xue-line", label: "记下薛逢藏起的活蛊线印记", next: "routeTruth", result: "你记下了薛逢藏起的活蛊线印记。那线连着操控，也连着执棋之人。", requires: { route: "xue" }, effect: { flag: "活蛊线印记" } },
      { id: "su-continue", label: "背着她穿过傀儡群，继续前行", next: "routeTruth", result: "你背起苏莹穿过傀儡群。她伏在你背上，呼吸很轻，像怕惊扰你。", requires: { route: "su" } },
    ],
  },
  routeTruth: {
    id: "routeTruth", act: 3, node: 2, chapter: "第三幕 · 离 · 节点 2 / 4", title: "各自的代价",
    events: routeTruthEvents,
    choices: [
      { id: "keep-cold", label: "收起冰寒蛊简，继续前行", next: "routeCost", result: "你把冰寒蛊简收得更深了些。赵黎没有追问，只是笑。", requires: { route: "zhao" }, effect: { flag: "冰寒蛊简" } },
      { id: "hold-ji", label: "扶住纪清寒，替她稳住气血", next: "routeCost", result: "你扶住纪清寒，替她稳住气血。她靠着你，没有道谢。", requires: { route: "ji" }, effect: { trust: { ji: 1 } } },
      { id: "mark-line", label: "记下薛逢藏起的活蛊线印记", next: "routeCost", result: "你记下了那枚活蛊线印记，逆向的线索在识海中逐渐清晰。", requires: { route: "xue" }, effect: { flag: "活蛊线印记" } },
      { id: "shield-su", label: "让旧玉回应苏莹的血脉", next: "routeCost", result: "旧玉爆出一团血光，将刺来的傀儡震碎。苏莹仍站在你身侧，望着你的玉，眼里有光。", requires: { route: "su", flags: ["旧玉发烫", "生门低语", "活符低语"] }, effect: { flag: "苏莹存活" } },
      { id: "fail-su", label: "扑向苏莹，却只抓住她留下的血字", next: "routeCost", result: "你扑向苏莹，却只抓住她留下的血字。那半句话，像针一样扎进心里。", requires: { route: "su" }, effect: { flag: "苏莹已殁" } },
    ],
  },
  routeCost: {
    id: "routeCost", act: 3, node: 3, chapter: "第三幕 · 离 · 节点 3 / 4", title: "未说完的话",
    events: routeCostEvents,
    choices: [{ id: "approach-door", label: "推开血色石门", next: "bloodGate", result: "你推开血色石门。门后没有尘土味，只有新鲜的血气。" }],
  },
  bloodGate: {
    id: "bloodGate", act: 3, node: 4, chapter: "第三幕 · 离 · 节点 4 / 4", title: "血纹石门",
    events: bloodGateEvents,
    choices: [{ id: "enter-hall", label: "踏入血魔蛊室", next: "bloodGuard", result: "你踏入血魔蛊室。身后石门轰然合拢，把来路封死。" }],
  },
  bloodGuard: {
    id: "bloodGuard", act: 4, node: 1, chapter: "第四幕 · 血魔蛊室 · 节点 1 / 3", title: "守门血傀儡",
    events: bloodGuardEvents,
    battle: { enemyName: "血傀儡", enemyHealth: 20, victoryNext: "bloodRoom", defeatNext: "bloodRoom", victoryFlag: "血傀儡已毁", defeatFlag: "血傀儡被赵黎击碎" },
  },
  bloodRoom: {
    id: "bloodRoom", act: 4, node: 1, chapter: "第四幕 · 血魔蛊室 · 节点 1 / 3", title: "五转蛊卵",
    events: bloodRoomEvents,
    choices: [{ id: "resist", label: "压住蛊种，寻找血祭阵眼", next: "awakening", result: "你压住翻涌的蛊种，在漫天血纹中寻找阵眼。" }, { id: "answer-qiao", label: "拖住乔无咎，逼他多说一句", next: "awakening", result: "你扬声拖住乔无咎，逼他多说了半句。他的声音里，第一次透出不耐。", effect: { trust: { qiao: -1 } } }],
  },
  awakening: {
    id: "awakening", act: 4, node: 2, chapter: "第四幕 · 血魔蛊室 · 节点 2 / 3", title: "血流将醒",
    events: awakeningEvents,
    choices: [{ id: "face-final", label: "在蛊卵彻底裂开前作出选择", next: "finale", result: "你在蛊卵彻底裂开前，做出了选择。" }],
  },
  finale: {
    id: "finale", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "人吃蛊，还是蛊吃人",
    events: finaleEvents,
    choices: [
      { id: "duel-zhao", label: "以冰寒秘术压蛊，与赵黎决战", next: "zhaoBattle", result: "你以冰寒秘术压住血魔蛊，旧玉血光与赵黎的血线撞在一处。", requires: { route: "zhao", flags: ["冰寒蛊简"] } },
      { id: "break-array", label: "与纪清寒一同炸毁祭阵", next: "ending", result: "你与纪清寒一同引爆祭阵。血魔蛊在将醒未醒之间，化成了灰。", requires: { route: "ji" }, effect: { ending: "severed" } },
      { id: "take-control", label: "借活蛊线反制乔无咎，夺取残缺血魔蛊", next: "ending", result: "你借活蛊线反制控制室，乔无咎的操控被截断了一瞬。", requires: { route: "xue", flags: ["活蛊线印记"] }, effect: { ending: "tyrant" } },
      { id: "feed-blood", label: "以身入池，与血魔蛊共生", next: "ending", result: "你纵身跃入血池，准备以全部血液与血魔蛊共生。", requires: { route: "su" }, effect: { ending: "sacrifice" } },
      { id: "fight-master", label: "唤众人联手，先斩复苏苏衍", next: "masterBattle", result: "你唤众人联手。五人第一次，真正站在了同一边。", requires: { route: "su", flags: ["苏莹存活"] } },
    ],
  },
  masterBattle: {
    id: "masterBattle", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "苏衍诈死",
    events: masterBattleEvents,
    battle: { enemyName: "苏衍", enemyHealth: 28, victoryNext: "ending", defeatNext: "ending", victoryFlag: "墓主已灭", defeatFlag: "墓主吞尽血食" },
  },
  zhaoBattle: {
    id: "zhaoBattle", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "血蛊相争",
    events: zhaoBattleEvents,
    battle: { enemyName: "赵黎", enemyHealth: 22, victoryNext: "qiaoReveal", defeatNext: "ending", victoryFlag: "血魔蛊", defeatFlag: "赵黎夺蛊" },
  },
  qiaoReveal: {
    id: "qiaoReveal", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "执棋者现身",
    events: qiaoRevealEvents,
    choices: [
      { id: "fight-qiao", label: "迎上去，与乔无咎做个了断", next: "qiaoBattle", result: "你迎上去，攥紧掌心那抹猩红，与乔无咎做个了断。" },
    ],
  },
  qiaoBattle: {
    id: "qiaoBattle", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "暗室杀局",
    events: qiaoBattleEvents,
    battle: { enemyName: "乔无咎", enemyHealth: 24, victoryNext: "ending", defeatNext: "ending", victoryFlag: "乔无咎已伏", defeatFlag: "乔无咎得逞" },
  },
  shadowQiao: {
    id: "shadowQiao", act: 3, node: 1, chapter: "第三幕 · 暗线 · 节点 1 / 3", title: "尾行",
    events: shadowQiaoEvents,
    choices: [
      { id: "approach", label: "再靠近些，看他在捣鼓什么", next: "shadowTruth", result: "你又靠近了些，屏息看他究竟在捣鼓什么。" },
      { id: "retreat", label: "记下路线，退回大队", next: "fog", result: "你记下路线，悄然后退——塌陷的坑道边缘，雾还没散，你还有机会抓住一只手。", effect: { flag: "曾尾行乔无咎" } },
    ],
  },
  shadowTruth: {
    id: "shadowTruth", act: 3, node: 2, chapter: "第三幕 · 暗线 · 节点 2 / 3", title: "血祭的账本",
    events: shadowTruthEvents,
    choices: [
      { id: "confront", label: "现身摊牌，用话周旋", next: "shadowBargain", result: "你从暗处现身，与乔无咎摊牌。" },
      { id: "flee", label: "立刻退走，把所见带出墓去", next: "fog", result: "你立刻退走，把所见带出墓去——塌陷的坑道边缘，雾还没散，你还有机会抓住一只手。", effect: { flag: "曾尾行乔无咎" } },
    ],
  },
  shadowBargain: {
    id: "shadowBargain", act: 3, node: 3, chapter: "第三幕 · 暗线 · 节点 3 / 3", title: "执棋者的重利",
    events: shadowBargainEvents,
    choices: [
      { id: "accept", label: "接受邀请，入他的局", next: "shadowBetrayal", result: "你接下了乔无咎的重利，成了他暗室里的第二双眼睛。" },
      { id: "refuse", label: "拒绝。你已看穿这盘棋，不愿做他的棋子", next: "ending", result: "你拒绝了乔无咎。他叹了口气，像早就料到。", effect: { ending: "seer" } },
    ],
  },
  shadowBetrayal: {
    id: "shadowBetrayal", act: 3, node: 4, chapter: "第三幕 · 暗线 · 节点 4 / 4", title: "你如何帮乔无咎杀死队友",
    events: shadowBetrayalEvents,
    choices: [
      { id: "meet-zhao", label: "迎向化魔的赵黎", next: "ending", result: "你迎向化魔的赵黎。他回头望你，眼里的猩红比火光更亮。", effect: { ending: "traitor" } },
    ],
  },
};

export const endings: Record<string, Ending> = {
  demon: { id: "demon", name: "夺蛊成魔", epitaph: "血浪吞人，唯你仍立。", text: "乔无咎现身的瞬间，你终于放开那点克制。血魔蛊脱手，六尺血幕吞了乔无咎，也吞了你最后的人性。墓门外月色如血，你成了再无人敢直呼其名的血蛊魔君。", background: "background.blood-ruin" },
  severed: { id: "severed", name: "破蛊断脉", epitaph: "蛊碎了，人还在。", text: "纪清寒冻结阵眼三息，你引爆蛊种，血魔蛊与血祭一同化灰。你们修为尽废，却互相搀扶走出天亮的墓门。江湖失去两名蛊修，山野多了一间安静药铺。", background: "background.dawn-exit" },
  tyrant: { id: "tyrant", name: "血蛊枭雄", epitaph: "活蛊线断，旧账才刚开始。", text: "你借活蛊线反制控制室，乔无咎被祭阵反噬。临死前，他却隔空捏碎薛逢的心脉——“废物，本就该第一个死。”血魔蛊残缺认主，纪清寒带断剑离开。你未成魔，却亲眼看着那颗卑微的棋子死在执棋人手里。", background: "background.control-room" },
  sacrifice: { id: "sacrifice", name: "以身饲蛊", epitaph: "人蛊共生，意志为主。", text: "你以全身血液替代祭品，与血魔蛊共生。苏莹没有回来，但你让蛊听命于人。此后人间多了一位镇压邪蛊的血蛊主，每年入冬，你都会去她坟前坐一会儿。", background: "background.dawn-exit" },
  true: { id: "true", name: "血脉归位", epitaph: "五人出墓，天光未负。", text: "苏衍败亡，乔无咎化为枯骨，血室崩塌。赵黎留下未竟之战，薛逢发誓改邪，纪清寒将寒蚕丝系在你腕上；苏莹红着眼问你以后会不会丢下她。你说，不丢了。", background: "background.dawn-exit" },
  deathByZhao: { id: "deathByZhao", name: "血蛊反噬", epitaph: "血蛊相争，败者无坟。", text: "赵黎掌中血线穿透你的蛊种。旧玉落地，被他一脚踏碎。血魔蛊在池中发出一声低鸣——它已认主，却不是认你。", background: "background.blood-ruin" },
  deathByMaster: { id: "deathByMaster", name: "命丧墓主", epitaph: "五转之下，皆为祭品。", text: "苏衍的五转威压碾碎了你最后的蛊息。血池倒灌，你看见自己的血汇入那具黑石棺椁，成为它下一场沉睡的养分。", background: "background.blood-chamber" },
  death: { id: "death", name: "命丧血池", epitaph: "血魔蛊醒，先吞活人。", text: "你在蛊室中失去最后一点真元。血祭没有停下，苏衍与乔无咎的谋算都沉入血池，只剩血魔蛊记得你的气息。", background: "background.blood-ruin" },
  trapped: { id: "trapped", name: "困于蛊墓", epitaph: "迟疑太久，墓门已合。", text: "你们在机关与伤势中耗尽时间。血雾封死所有退路，墓门外的夜雨仍在下，却再也落不到你身上。", background: "background.fog-passage" },
  lone: { id: "lone", name: "独活出墓", epitaph: "蛊散，人独活。", text: "乔无咎倒下时，你看见血魔蛊在掌心跃跃欲试的猩红。你收了手，反手将它连同自己的蛊种一并震碎。同行之人死尽，你独自走出墓门，身后背着一座空墓，与再无人能作证的夜雨。", background: "background.dawn-exit" },
  traitor: { id: "traitor", name: "叛徒", epitaph: "为虎作伥，终被虎噬。", text: "你为虎作伥，助乔无咎杀尽同伴，却先被乔无咎弃子，再死于化魔的赵黎之手。连“背叛”都没能救你的命。", background: "background.control-room" },
  seer: { id: "seer", name: "洞见而殁", epitaph: "看懂了棋，落不下子。", text: "你拒绝入局。暗室里万千活蛊线同时绷直，无数傀儡潮水般将你淹没。直到被蛊核的猩红吞没的前一刻，你仍不敢置信——你看懂了整盘棋，却连一枚子都来不及落。", background: "background.control-room" },
};

const allEndingIds = Object.keys(endings);
export const endingAccess: Record<RoleId, string[]> = {
  healer: allEndingIds.filter((endingId) => endingId !== "true"),
  swordsman: [...allEndingIds],
  heir: [...allEndingIds],
};
