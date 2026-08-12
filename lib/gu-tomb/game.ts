export type RoleId = "healer" | "swordsman" | "heir";
export type AllyId = "zhao" | "ji" | "xue" | "su" | "qiao";
export type RouteId = "zhao" | "ji" | "xue" | "su";
export type GuAction = "blood" | "armor" | "bloodflow" | "rest" | "heal" | "sword" | "charm";
export type EnemyAction = { id: string; damage: number; cue: string; heal?: number; invulnerable?: boolean; reflect?: boolean };

export type Role = { id: RoleId; name: string; gender: "male"; title: string; description: string; maxHealth: number; maxEssence: number; attack: number; signatureGu: string };
export type Effect = { health?: number; essence?: number; time?: number; flag?: string; ending?: string; trust?: Partial<Record<AllyId, number>>; route?: RouteId };
export type Choice = { id: string; label: string; next: string; requires?: { route?: RouteId; flags?: string[] }; effect?: Effect };
export type BattleConfig = { enemyName: string; enemyHealth: number; victoryNext: string; defeatNext: string; victoryFlag?: string; defeatFlag?: string };
export type GameState = { roleId: RoleId | null; sceneId: string; route: RouteId | null; health: number; maxHealth: number; essence: number; maxEssence: number; time: number; flags: string[]; trust: Record<AllyId, number>; battle: Battle | null; endingId: string | null };
export type Battle = BattleConfig & { enemyMaxHealth: number; turn: number; intent: EnemyAction };
export type Scene = { id: string; act: 1 | 2 | 3 | 4; node: number; chapter: string; title: string; text: string | ((state: GameState) => string); choices?: Choice[]; battle?: BattleConfig | ((state: GameState) => BattleConfig) };
export type Ending = { id: string; name: string; epitaph: string; text: string };

export const storyMeta = {
  title: "血蛊醒",
  subtitle: "夜雨蛊市 · 五人入墓",
  acts: [
    { act: 1, name: "聚", nodes: 1 },
    { act: 2, name: "入", nodes: 6 },
    { act: 3, name: "离", nodes: 4 },
    { act: 4, name: "血流蛊室", nodes: 3 },
    { act: 5, name: "结局", nodes: "可变" },
  ],
} as const;

export const storyPresentation = {
  names: ["赵黎", "纪清寒", "薛逢", "苏莹", "乔无咎"],
  criticalTerms: ["血流蛊", "五转", "血祭", "祖传旧玉", "苏衍"],
};

export const roles: Role[] = [
  { id: "healer", name: "游方蛊医", gender: "male", title: "四转巅峰 · 游方蛊医", description: "走遍荒野药市，擅辨蛊毒与伤势。祖传旧玉是他唯一不肯示人的来历。", maxHealth: 14, maxEssence: 12, attack: 3, signatureGu: "回春蛊" },
  { id: "swordsman", name: "流浪剑修", gender: "male", title: "四转巅峰 · 流浪剑修", description: "以蛊御剑，斗法狠厉直接；他不善圆话，只信手中一剑能劈开生路。", maxHealth: 15, maxEssence: 10, attack: 4, signatureGu: "剑鸣蛊" },
  { id: "heir", name: "落魄世家子", gender: "male", title: "四转巅峰 · 落魄世家子", description: "熟悉墓制与人心，能从一句承诺里听出价码；旧玉是家道败落后仅余的遗物。", maxHealth: 12, maxEssence: 10, attack: 3, signatureGu: "惑心蛊" },
];

const routeName: Record<RouteId, string> = { zhao: "赵黎", ji: "纪清寒", xue: "薛逢", su: "苏莹" };
function routeText(state: GameState, content: Record<RouteId, string>) { return state.route ? content[state.route] : "墓道在身后轰然断裂。你尚未看清同行之人的面孔，只能循着血腥气继续向前。"; }

export const scenes: Record<string, Scene> = {
  gate: {
    id: "gate", act: 1, node: 1, chapter: "第一幕 · 聚 · 节点 1 / 1", title: "夜雨墓门",
    text: "蛊市夜雨未歇。乔无咎在荒原墓门前展开半张墓图，许诺五转蛊修坐化墓中的遗物见者有份。赵黎倚石把玩血纹蛊虫，明明面白如少年，开口却自称老夫；纪清寒抱剑立在雨中，不与任何人说话；薛逢见谁都笑，嘴里已先说了三遍散修互照应；苏莹垂头描摹墓门蛊纹，像在背诵一句不该被人听见的话。\n\n你按住腰间祖传旧玉。玉在掌下微微发烫。赵黎隔着雨幕看了你一眼，嘴角那点笑意并未散去。乔无咎一拱手，率先踏进墓门。",
    choices: [
      { id: "jade", label: "任由旧玉发烫，记下墓门的血色回应", next: "swarm", effect: { flag: "旧玉发烫" } },
      { id: "observe-su", label: "留意苏莹口中未念完的蛊诀", next: "swarm", effect: { flag: "苏莹低语" } },
      { id: "enter", label: "不露声色，随乔无咎入墓", next: "swarm" },
    ],
  },
  swarm: {
    id: "swarm", act: 2, node: 1, chapter: "第二幕 · 入 · 节点 1 / 6", title: "甬道蛊潮",
    text: "入墓不过百步，石壁缝隙便涌出万千噬魂蛊，如黑潮压满甬道。薛逢第一个后退，却被乔无咎一句“退路已封”钉在原地。赵黎负手而行，近身的蛊虫无声自焚，像被更暴烈的蛊力从内里撕碎。\n\n蛊潮将你与纪清寒挤到侧壁。一条毒藤缠住你脚踝，她剑光掠过，藤断而裤脚只裂一线；同一刻蛊蝎扑向她后颈，你反手将其拍碎。她只看了你一眼，低声道：“跟紧。”",
    choices: [
      { id: "shield-ji", label: "替纪清寒清开侧后的蛊蝎", next: "shadow", effect: { trust: { ji: 1 }, flag: "清寒援手" } },
      { id: "watch-zhao", label: "压住蛊息，观察赵黎焚蛊的手段", next: "shadow", effect: { trust: { zhao: 1 } } },
      { id: "save-xue", label: "拉住慌乱后退的薛逢", next: "shadow", effect: { trust: { xue: 1 }, health: -1 } },
    ],
  },
  shadow: {
    id: "shadow", act: 2, node: 2, chapter: "第二幕 · 入 · 节点 2 / 6", title: "血影示警",
    text: "蛊潮退去后，石壁深处却有血影随火折子慢慢移动。你腰间旧玉骤然发烫，灼得皮肤生疼。赵黎停下脚步，隔着众人望来：“那块玉，借老夫瞧瞧？”\n\n你没有应声。他也不逼，只笑道：“一会儿你若死了，玉归老夫，提前说好。”纪清寒恰好并肩，声音极低：“这墓的机关有生门，不像防人进，倒像在等什么人。”",
    choices: [
      { id: "listen-ji", label: "记下纪清寒的“等人”之说", next: "chamber", effect: { flag: "生门低语", trust: { ji: 1 } } },
      { id: "refuse-zhao", label: "握紧旧玉，拒绝赵黎", next: "chamber", effect: { trust: { zhao: -1 } } },
      { id: "question-qiao", label: "旁敲侧击乔无咎是否来过此地", next: "chamber", effect: { trust: { qiao: -1 } } },
    ],
  },
  chamber: {
    id: "chamber", act: 2, node: 3, chapter: "第二幕 · 入 · 节点 3 / 6", title: "机关暗室",
    text: "石板塌陷，众人坠入刻满血色蛊纹的暗室。正中石鼎积着干涸血垢，苏莹盯着墙上符文，面色发白：“这些符……是活的，血还在动。”薛逢凑来套近乎，手指却悄然探向你的蛊囊。\n\n乔无咎淡淡解释墓主只是喜欢用血蛊阵作装饰，却在离开前不着痕迹抹去一枚符文的关键一笔。你看见了，也看见苏莹盯住他手背时瞬间发白的脸色。",
    choices: [
      { id: "trust-su", label: "替苏莹遮住异色，记下她识得活符", next: "illusion", effect: { flag: "活符低语", trust: { su: 1 } } },
      { id: "catch-xue", label: "当场扣住薛逢偷蛊囊的手", next: "illusion", effect: { trust: { xue: -1 }, flag: "聚灵蛊失而复得" } },
      { id: "follow-qiao", label: "假作未见，跟着乔无咎离开", next: "illusion", effect: { trust: { qiao: 1 } } },
    ],
  },
  illusion: {
    id: "illusion", act: 2, node: 4, chapter: "第二幕 · 入 · 节点 4 / 6", title: "迷魂阵",
    text: "石殿弥漫着甜腥蛊香。纪清寒刚说出“屏息”，迷魂阵便已发动。你看见她卸下剑与冷意，踉跄着靠近；她也被幻境中的你牵住。迷魂香催的不是欲念，而是人最不愿示人的心防。\n\n阵破时，你们猛然分开。纪清寒耳根通红，攥剑柄的手骨节发白，薛逢想笑，剑鞘已抵住他喉咙。没有人点破那片刻靠近，只是之后的脚步都比先前沉默。",
    choices: [
      { id: "protect-ji", label: "替纪清寒挡住薛逢的讥笑", next: "puppets", effect: { trust: { ji: 1 }, flag: "清寒心防" } },
      { id: "comfort-su", label: "询问苏莹是否被阵法所伤", next: "puppets", effect: { trust: { su: 1 } } },
      { id: "stay-silent", label: "收束心神，什么也不说", next: "puppets" },
    ],
  },
  puppets: {
    id: "puppets", act: 2, node: 5, chapter: "第二幕 · 入 · 节点 5 / 6", title: "铜皮傀儡",
    text: "墓道骤然开阔成地下石坪。四角铜皮傀儡同时睁开猩红蛊核，活蛊线牵动关节，力道不输炼体蛊修。赵黎随手捏碎一具后皱眉：“活蛊线只能由近处施术者维持。”\n\n乔无咎站在石坪上，面色如常，只说是墓主留下的守墓机关。你却发现五条出口中，他恰好挡在最像生门的那一侧。旧玉再次发烫，这一次你没有压住它。",
    battle: { enemyName: "铜皮傀儡", enemyHealth: 12, victoryNext: "fog", defeatNext: "fog", victoryFlag: "傀儡已毁", defeatFlag: "傀儡重伤" },
  },
  fog: {
    id: "fog", act: 2, node: 6, chapter: "第二幕 · 入 · 节点 6 / 6", title: "大雾迷踪",
    text: "石坪尽头的窄道涌出蛊雾，灵识被压到不足三尺。乔无咎的声音从雾中飘来，说要绕后封住追兵，随即消失；紧接着，十二具更沉重的傀儡从四面逼近。地面裂开，所有人被陷道吞没。\n\n你只来得及抓住一只手。这个选择将决定第三幕与你同行的人，也决定你在血流蛊室前看见谁活着、谁倒下。",
    choices: [
      { id: "take-zhao", label: "抓住赵黎的手", next: "routeTrial", effect: { route: "zhao", trust: { zhao: 1 } } },
      { id: "take-ji", label: "抓住纪清寒的手", next: "routeTrial", effect: { route: "ji", trust: { ji: 1 } } },
      { id: "take-xue", label: "抓住薛逢的手", next: "routeTrial", effect: { route: "xue", trust: { xue: 1 } } },
      { id: "take-su", label: "抓住苏莹的手", next: "routeTrial", effect: { route: "su", trust: { su: 1 } } },
    ],
  },
  routeTrial: {
    id: "routeTrial", act: 3, node: 1, chapter: "第三幕 · 离 · 节点 1 / 4", title: "陷道同行",
    text: (state) => routeText(state, {
      zhao: "赵黎落地便以压倒性蛊力撕开傀儡群。他不回头，只说跟不上便留在这里。密室枯骨旁留着一卷蛊简，记载血流蛊畏寒；赵黎看过后随手丢开，你将冰寒秘术暗记于心。",
      ji: "你与纪清寒在狭窄陷道中沉默推进。她替你硬接一记傀儡重拳，虎口崩血；你引爆蛊种堵住追兵。她看着碎石，沉默许久才道：“你这种打法，活不过四十岁。”",
      xue: "薛逢一路说散修互照应，手里却悄悄收起一截乔无咎遗落的活蛊线。那线上连着操控印记，他以为你没有看见，仍在说等出去后要与你平分蛊晶矿。",
      su: "苏莹几乎没有正面战力。你带着她穿过傀儡群，她伏在你背上说起师父留下的半张墓图：墓主曾言“蛊不可祭，蛊只可承”。她不知道如何阻止血祭，只知道自己不能离开。",
    }),
    choices: [{ id: "route-continue", label: "穿过陷道，继续向血色石门前行", next: "routeTruth" }],
  },
  routeTruth: {
    id: "routeTruth", act: 3, node: 2, chapter: "第三幕 · 离 · 节点 2 / 4", title: "各自的代价",
    text: (state) => routeText(state, {
      zhao: "岔道口横着苏莹的尸身。赵黎曾从她身侧出手，却不是救她，只嫌她挡路。再往前，你找到纪清寒半截断剑；她在另一条道里一敌五傀儡，剑断人亡。赵黎没有嘲笑你收剑，只说少两个人分蛊也未必是坏事。",
      ji: "你与纪清寒每一步都在互相补位。她不再提迷魂阵，你也不问她要救的至亲。血色石门前，苏莹被祭阵隔空抽尽血气，抓住你的旧玉只来得及说半句“那块玉……是……”。纪清寒握住残剑，目光第一次不再像冰。",
      xue: "苏莹倒在三步外，薛逢说来不及救，却把能切断祭阵一角的活蛊线藏得更深。你在岔道救下重伤的纪清寒，她没有道谢，只用复杂眼神看着你与薛逢。所有人都在算账，连活命也被算成了价码。",
      su: "苏莹在你背上断断续续说，师父找了一辈子墓主的后人。她看向你的旧玉时神色愈发笃定。傀儡忽从阴影刺来；若旧玉、纪清寒的生门低语与苏莹识活符的线索都已留下，旧玉会先一步爆出血光，否则这一击将贯穿她。",
    }),
    choices: [
      { id: "keep-cold", label: "收起冰寒蛊简，继续前行", next: "routeCost", requires: { route: "zhao" }, effect: { flag: "冰寒蛊简" } },
      { id: "hold-ji", label: "扶住纪清寒，替她稳住气血", next: "routeCost", requires: { route: "ji" }, effect: { trust: { ji: 1 } } },
      { id: "mark-line", label: "记下薛逢藏起的活蛊线印记", next: "routeCost", requires: { route: "xue" }, effect: { flag: "活蛊线印记" } },
      { id: "shield-su", label: "让旧玉回应苏莹的血脉", next: "routeCost", requires: { route: "su", flags: ["旧玉发烫", "生门低语", "活符低语"] }, effect: { flag: "苏莹存活" } },
      { id: "fail-su", label: "扑向苏莹，却只抓住她留下的血字", next: "routeCost", requires: { route: "su" }, effect: { flag: "苏莹已殁" } },
    ],
  },
  routeCost: {
    id: "routeCost", act: 3, node: 3, chapter: "第三幕 · 离 · 节点 3 / 4", title: "未说完的话",
    text: (state) => routeText(state, {
      zhao: "赵黎在血色石门前停步，忽然问你是否记住了蛊简内容。他分明知道你没有全说，却没有逼问，只笑称进了门再谈。你明白他不是放过你，而是在等最适合夺蛊的一刻。",
      ji: "纪清寒以残剑拄地，血线已在她腕间游走。她说自己进墓本为续魂蛊材，对五转蛊毫无兴趣；随后又补了一句，若血流蛊醒来，她会先斩阵眼。你没有答话，只把她站不稳的肩扶正。",
      xue: "薛逢终于承认活蛊线能追到控制室，却说要等最值钱的时候才用。你没有拆穿他，只悄悄以聚灵蛊留下逆向追踪印记。若他还想拿乔无咎的机关做买卖，这条线也能把你带到执棋者面前。",
      su: state.flags.includes("苏莹存活") ? "旧玉的血光震碎傀儡，苏莹仍站在你身侧。她望着玉佩，终于明白师父寻找的人或许就是你。她割破指尖，让一滴血留在石门暗纹上；门后似有另一道更深的锁在回应。" : "苏莹留下的血字没有写完，只能辨出“你，是那个人”。你把她未说尽的秘密压进心底。石门之后血流蛊的威压已开始震动，留给活人的时间不多了。",
    }),
    choices: [{ id: "approach-door", label: "推开血色石门", next: "bloodGate" }],
  },
  bloodGate: {
    id: "bloodGate", act: 3, node: 4, chapter: "第三幕 · 离 · 节点 4 / 4", title: "血纹石门",
    text: (state) => `石门上五道血纹依次亮起。与你同行的是${state.route ? routeName[state.route] : "不明之人"}，其余人的生死已被墓道切碎在身后。乔无咎的声音第一次不再掩饰：“前面便是主墓室。各凭本事吧，诸位。”\n\n门缝里吹出的风没有尘土味，只有新鲜血气。你握住旧玉，推门而入。`,
    choices: [{ id: "enter-hall", label: "踏入血流蛊室", next: "bloodRoom" }],
  },
  bloodRoom: {
    id: "bloodRoom", act: 4, node: 1, chapter: "第四幕 · 血流蛊室 · 节点 1 / 3", title: "五转蛊卵",
    text: (state) => `石门合拢，四壁血纹齐亮，数道血线汇向中央血池。池中蛊卵缓缓裂开，**五转血流蛊**的威压灌满石室。乔无咎不现身，只通过活蛊线从石壁中说：“四人的血，一个人的命，正好。”\n\n${state.route === "ji" ? "纪清寒以残剑拄地，血线正自她体内流向血池。" : state.route === "su" && state.flags.includes("苏莹存活") ? "苏莹站在你身侧，指尖那滴血仍在石面暗纹中发亮。" : state.route === "xue" ? "薛逢已开始盘算向谁跪下最值钱。" : "赵黎站在你身侧，却像一头终于等到猎物围成一圈的狼。"}`,
    choices: [{ id: "resist", label: "压住蛊种，寻找血祭阵眼", next: "awakening" }, { id: "answer-qiao", label: "拖住乔无咎，逼他多说一句", next: "awakening", effect: { trust: { qiao: -1 } } }],
  },
  awakening: {
    id: "awakening", act: 4, node: 2, chapter: "第四幕 · 血流蛊室 · 节点 2 / 3", title: "血流将醒",
    text: (state) => routeText(state, {
      zhao: "赵黎终于出手，掌中血蛊直取你的心脉。你等的正是这一刻：冰寒蛊简的秘术冻住周身血气，旧玉随之发亮，血流蛊的蛊影在池中停滞一瞬。",
      ji: "纪清寒看着你，只说“你选”。她以冰蚕剑插入血池阵眼，愿用三息冻结替你炸出一线生机。你知道这一剑下去，她与自己的蛊种都可能碎裂。",
      xue: "薛逢抢先跪下，向乔无咎说依约把你带来。乔无咎却淡淡答祭品名单上也有他。你藏在聚灵蛊中的追踪印记顺着活蛊线逆行，控制室的位置终于在识海中亮起。",
      su: state.flags.includes("苏莹存活") ? "苏莹的血滴入石面，暗门在血池下缓缓升起。黑石棺椁破水而出，苏衍并未坐化，而是以血流蛊为饵等待祭品。乔无咎惊怒未尽，已被反向活蛊线拖向血池。" : "苏莹的尸身仍在门边。你看着她未写完的血字，明白再等下去，血祭会吞掉所有人。你割开手腕，决定以自己的血替换祭品。",
    }),
    choices: [{ id: "face-final", label: "在蛊卵彻底裂开前作出选择", next: "finale" }],
  },
  finale: {
    id: "finale", act: 4, node: 3, chapter: "第四幕 · 血流蛊室 · 节点 3 / 3", title: "人吃蛊，还是蛊吃人",
    text: (state) => routeText(state, {
      zhao: "冰寒秘术与旧玉血光同时压住血流蛊。赵黎第一次露出讶色，随即大笑，说你终于有资格做他的对手。只有在这里击败他，才能夺得血流蛊。",
      ji: "纪清寒已将冰蚕剑钉进阵眼。她要你带她离开，不要带走蛊。你若引爆自己的蛊种，血流蛊会在将醒未醒之间化灰；代价是你们二人修为尽废。",
      xue: "逆向活蛊线已指向控制室。乔无咎操控被截断的一瞬，就是夺蛊的唯一机会。薛逢还在求饶，你可以让他活着记账，也可以把他交回血祭。",
      su: state.flags.includes("苏莹存活") ? "苏衍从黑石棺中复苏，五转威压压得血池翻涌。赵黎、纪清寒、薛逢与苏莹都还活着；这是唯一能让五人联手的时刻。" : "你纵身跃入血池，准备以全部血液与血流蛊共生。苏莹未能回来，但你能决定这只蛊醒来后是吞人，还是被人驾驭。",
    }),
    choices: [
      { id: "duel-zhao", label: "以冰寒秘术压蛊，与赵黎决战", next: "zhaoBattle", requires: { route: "zhao", flags: ["冰寒蛊简"] } },
      { id: "break-array", label: "与纪清寒一同炸毁祭阵", next: "ending", requires: { route: "ji" }, effect: { ending: "severed" } },
      { id: "take-control", label: "借活蛊线反制乔无咎，夺取残缺血流蛊", next: "ending", requires: { route: "xue", flags: ["活蛊线印记"] }, effect: { ending: "tyrant" } },
      { id: "feed-blood", label: "以身入池，与血流蛊共生", next: "ending", requires: { route: "su" }, effect: { ending: "sacrifice" } },
      { id: "fight-master", label: "唤众人联手，先斩复苏苏衍", next: "masterBattle", requires: { route: "su", flags: ["苏莹存活"] } },
    ],
  },
  masterBattle: {
    id: "masterBattle", act: 4, node: 3, chapter: "第四幕 · 血流蛊室 · 节点 3 / 3", title: "苏衍诈死",
    text: "苏衍抬手，乔无咎被活蛊线拖入血池。赵黎先出手，纪清寒以断剑重铸阵纹，苏莹用血脉干扰墓室，薛逢被你硬拽去堵住退路。你以旧玉为引，让血流蛊暂时认主。五人第一次真正站在同一边。",
    battle: { enemyName: "苏衍", enemyHealth: 28, victoryNext: "ending", defeatNext: "ending", victoryFlag: "墓主已灭", defeatFlag: "墓主吞尽血食" },
  },
  zhaoBattle: {
    id: "zhaoBattle", act: 4, node: 3, chapter: "第四幕 · 血流蛊室 · 节点 3 / 3", title: "血蛊相争",
    text: "冰寒秘术封住周身血气，祖传旧玉随之放出血光。赵黎脸上的笑意终于收起，掌中血线与血流蛊遥相呼应。他说你有资格做他的对手；你知道这一战之后，墓里只会剩下一个能握住血流蛊的人。",
    battle: { enemyName: "赵黎", enemyHealth: 20, victoryNext: "ending", defeatNext: "ending", victoryFlag: "赵黎已败", defeatFlag: "赵黎夺蛊" },
  },
};

export const endings: Record<string, Ending> = {
  demon: { id: "demon", name: "夺蛊成魔", epitaph: "血浪吞人，唯你仍立。", text: "你借冰寒秘术与旧玉压住血流蛊，反手吞没赵黎。墓门外月色如血，怀中只余纪清寒的断剑。你成为唯一活人，也成为蛊道里再无人敢直呼其名的血蛊魔君。" },
  severed: { id: "severed", name: "破蛊断脉", epitaph: "蛊碎了，人还在。", text: "纪清寒冻结阵眼三息，你引爆蛊种，血流蛊与血祭一同化灰。你们修为尽废，却互相搀扶走出天亮的墓门。江湖失去两名蛊修，山野多了一间安静药铺。" },
  tyrant: { id: "tyrant", name: "血蛊枭雄", epitaph: "活蛊线断，旧账才刚开始。", text: "你借薛逢藏起的活蛊线反制控制室，乔无咎被祭阵反噬，血流蛊残缺认主。薛逢活着替你记账，纪清寒带断剑离开。你未成魔，却也再不是从前那个散修。" },
  sacrifice: { id: "sacrifice", name: "以身饲蛊", epitaph: "人蛊共生，意志为主。", text: "你以全身血液替代祭品，与血流蛊共生。苏莹没有回来，但你让蛊听命于人。此后人间多了一位镇压邪蛊的血蛊主，每年入冬，你都会去她坟前坐一会儿。" },
  true: { id: "true", name: "血脉归位", epitaph: "五人出墓，天光未负。", text: "苏衍败亡，乔无咎化为枯骨，血室崩塌。赵黎留下未竟之战，薛逢发誓改邪，纪清寒将寒蚕丝系在你腕上；苏莹红着眼问你以后会不会丢下她。你说，不丢了。" },
  deathByZhao: { id: "deathByZhao", name: "血蛊反噬", epitaph: "血蛊相争，败者无坟。", text: "赵黎掌中血线穿透你的蛊种。旧玉落地，被他一脚踏碎。血流蛊在池中发出一声低鸣——它已认主，却不是认你。" },
  deathByMaster: { id: "deathByMaster", name: "命丧墓主", epitaph: "五转之下，皆为祭品。", text: "苏衍的五转威压碾碎了你最后的蛊息。血池倒灌，你看见自己的血汇入那具黑石棺椁，成为它下一场沉睡的养分。" },
  death: { id: "death", name: "命丧血池", epitaph: "血流蛊醒，先吞活人。", text: "你在蛊室中失去最后一点真元。血祭没有停下，苏衍与乔无咎的谋算都沉入血池，只剩血流蛊记得你的气息。" },
  trapped: { id: "trapped", name: "困于蛊墓", epitaph: "迟疑太久，墓门已合。", text: "你们在机关与伤势中耗尽时间。血雾封死所有退路，墓门外的夜雨仍在下，却再也落不到你身上。" },
  lone: { id: "lone", name: "独活荒原", epitaph: "活下来的人，也背着一座墓。", text: "你从崩塌墓道中逃出，身后是未解的旧玉、未偿的血债与再无人能作证的夜雨。" },
};

export const endingAccess: Record<RoleId, string[]> = { healer: Object.keys(endings), swordsman: Object.keys(endings), heir: Object.keys(endings) };
export function initialGame(): GameState { return { roleId: null, sceneId: "gate", route: null, health: 0, maxHealth: 0, essence: 0, maxEssence: 0, time: 0, flags: [], trust: { zhao: 0, ji: 0, xue: 0, su: 0, qiao: 0 }, battle: null, endingId: null }; }
export function getRole(id: RoleId | null) { return roles.find((role) => role.id === id) ?? null; }
export function chooseRole(id: RoleId = "healer") { const role = getRole(id)!; return { ...initialGame(), roleId: id, health: role.maxHealth, maxHealth: role.maxHealth, essence: role.maxEssence, maxEssence: role.maxEssence, flags: ["旧玉发烫"] }; }
export function canChoose(state: GameState, choice: Choice) { return (!choice.requires?.route || state.route === choice.requires.route) && (choice.requires?.flags ?? []).every((flag) => state.flags.includes(flag)); }
function unique(items: string[], item?: string) { return item && !items.includes(item) ? [...items, item] : items; }
export function applyChoice(state: GameState, choice: Choice): GameState {
  const effect = choice.effect;
  const trust = { ...state.trust };
  for (const [ally, amount] of Object.entries(effect?.trust ?? {})) trust[ally as AllyId] += amount ?? 0;
  return { ...state, sceneId: choice.next, route: effect?.route ?? state.route, health: Math.max(1, Math.min(state.maxHealth, state.health + (effect?.health ?? 0))), essence: Math.max(0, Math.min(state.maxEssence, state.essence + (effect?.essence ?? 0))), time: state.time + (effect?.time ?? 0), flags: unique(unique(state.flags, effect?.flag), effect?.ending ? `结局:${effect.ending}` : undefined), trust };
}
export function sceneText(state: GameState, scene: Scene) { return typeof scene.text === "function" ? scene.text(state) : scene.text; }
export function getEnemyCondition(health: number, maximum: number) { return health >= maximum ? "健康" : health <= maximum * 0.3 ? "重伤" : "受伤"; }

const patterns: Record<string, EnemyAction[]> = {
  "铜皮傀儡": [{ id: "pounce", damage: 3, cue: "铜皮傀儡微微伏低身子，活蛊线在关节间发出绷紧的细响。" }, { id: "crush", damage: 5, cue: "傀儡双臂缓缓抬起，石坪上的碎屑被无形劲力压得贴地滑行，似要砸下一记重击。" }, { id: "wire", damage: 2, cue: "它眼窝里的蛊核忽明忽暗，数条活蛊线正从砖缝中向你脚边游来。" }],
  "苏衍": [{ id: "mist", damage: 4, cue: "苏衍抬手时，血池中升起一层沉重血雾，连呼吸都像被人攥住。" }, { id: "seal", damage: 6, cue: "黑石棺上的蛊印逐一亮起，整座墓室都在回应苏衍的心跳。" }, { id: "feast", damage: 9, cue: "苏衍张开五指，血池中的残魂齐齐尖啸，似要将所有活人的气血一口吞尽。" }, { id: "rest", damage: 0, heal: 5, cue: "苏衍闭目吸纳血池余烬，散开的威压正在重新凝实。" }],
  "赵黎": [{ id: "thread", damage: 3, cue: "赵黎指尖垂下一缕血丝，细得几乎融入石室阴影。" }, { id: "palm", damage: 7, cue: "赵黎袖袍无风自鼓，掌前血气压得灯火偏向一侧。" }, { id: "mirror", damage: 0, invulnerable: true, reflect: true, cue: "赵黎身前浮起一层薄薄血幕，幕中倒映出你的身影，暗流正反向涌动。" }],
};
function configFor(state: GameState, scene: Scene) { return typeof scene.battle === "function" ? scene.battle(state) : scene.battle; }
function patternFor(name: string) { return patterns[name] ?? patterns["铜皮傀儡"]; }
export function startBattle(state: GameState, scene: Scene): GameState {
  const config = configFor(state, scene); const role = getRole(state.roleId); if (!config || !role) return state;
  const pattern = patternFor(config.enemyName); return { ...state, essence: state.maxEssence, battle: { ...config, enemyMaxHealth: config.enemyHealth, turn: 0, intent: pattern[0] } };
}
function finishBattle(state: GameState, battle: Battle, won: boolean, health: number) {
  const next = won ? battle.victoryNext : battle.defeatNext;
  const flag = won ? battle.victoryFlag : battle.defeatFlag;
  const final = battle.enemyName === "苏衍" ? (won ? "true" : "deathByMaster") : battle.enemyName === "赵黎" ? (won ? "demon" : "deathByZhao") : undefined;
  return { ...state, health: won ? Math.min(state.maxHealth, Math.max(1, health) + 2) : 1, time: won ? state.time : state.time + 1, sceneId: next, battle: null, flags: unique(unique(state.flags, flag), final ? `结局:${final}` : undefined) };
}
export function resolveBattleTurn(state: GameState, action: GuAction): GameState {
  const battle = state.battle; const role = getRole(state.roleId); if (!battle || !role) return state;

  // 角色专属蛊验证
  if (action === "heal" && role.id !== "healer") return state;
  if (action === "sword" && role.id !== "swordsman") return state;
  if (action === "charm" && role.id !== "heir") return state;

  // 真元验证
  const cost = action === "rest" ? 0 : action === "heal" ? 2 : action === "sword" ? 4 : action === "charm" ? 3 : 1;
  if (state.essence < cost) return state;
  if (state.essence === 0 && action !== "rest") return state;
  if (state.essence > 0 && action === "rest") return state;

  let damage = role.attack; let received = battle.intent.damage; let health = state.health;
  const essence = action === "rest" ? Math.min(state.maxEssence, state.essence + 3) : state.essence - cost;

  // ── 剑鸣蛊：先自伤 2，再造成 10 伤害 ──
  if (action === "sword") {
    health -= 2;
    if (health <= 0) return finishBattle({ ...state, essence }, battle, false, health);
    damage = 10;
  }

  // ── 回春蛊：恢复 7 生命，不造成伤害 ──
  if (action === "heal") {
    damage = 0;
    health = Math.min(state.maxHealth, health + 7);
  }

  // ── 惑心蛊：造成 ATK 伤害，敌人行动完全无效 ──
  if (action === "charm") {
    const enemyHealth = battle.enemyHealth - Math.min(damage, battle.enemyHealth);
    if (enemyHealth <= 0) return finishBattle({ ...state, essence }, battle, true, health);
    const turn = battle.turn + 1; const pattern = patternFor(battle.enemyName);
    return { ...state, health, essence, battle: { ...battle, enemyHealth, turn, intent: pattern[turn % pattern.length] } };
  }

  // ── 通用动作（blood / armor / bloodflow / rest）──
  if (action === "armor") { damage = 1; received = Math.max(0, received - 3); }
  if (action === "bloodflow" && state.flags.includes("血流蛊已得")) { damage = 6; health = Math.min(state.maxHealth, health + 6); }
  if (action === "rest") damage = 0;

  const reflected = battle.intent.reflect ? damage : 0;
  if (battle.intent.invulnerable) damage = 0;
  received += reflected;
  const enemyHealth = battle.enemyHealth - Math.min(damage, battle.enemyHealth);
  if (enemyHealth <= 0) return finishBattle({ ...state, essence }, battle, true, health);
  health -= received;
  if (health <= 0) return finishBattle({ ...state, essence }, battle, false, health);
  const turn = battle.turn + 1; const pattern = patternFor(battle.enemyName);
  return { ...state, health, essence, battle: { ...battle, enemyHealth: Math.min(battle.enemyMaxHealth, enemyHealth + (battle.intent.heal ?? 0)), turn, intent: pattern[turn % pattern.length] } };
}
export function resolveEnding(state: GameState) {
  const explicit = state.flags.find((flag) => flag.startsWith("结局:"))?.slice(3);
  if (explicit && explicit in endings) return explicit;
  if (state.time >= 4) return "trapped";
  return "lone";
}
