export type RoleId = "healer" | "swordsman" | "heir";
export type AllyId = "zhao" | "ji" | "xue" | "su" | "qiao";
export type RouteId = "zhao" | "ji" | "xue" | "su";
export type GuAction = "blood" | "armor" | "blooddemon" | "rest" | "heal" | "sword" | "charm";
export type EnemyAction = { id: string; damage: number; cue: string; heal?: number; invulnerable?: boolean; reflect?: boolean; essenceDrain?: number };

export type Role = { id: RoleId; name: string; gender: "male"; title: string; description: string; maxHealth: number; maxEssence: number; attack: number; signatureGu: string; sense: "high" | "normal" };
export type Effect = { health?: number; maxHealth?: number; essence?: number; maxEssence?: number; time?: number; flag?: string; ending?: string; trust?: Partial<Record<AllyId, number>>; route?: RouteId };
export type Choice = { id: string; label: string; next: string; result?: string; requires?: { route?: RouteId; flags?: string[]; allyTopTwo?: AllyId }; effect?: Effect };
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
    { act: 4, name: "血魔蛊室", nodes: 3 },
    { act: 5, name: "结局", nodes: "可变" },
  ],
} as const;

export const storyPresentation = {
  names: ["赵黎", "纪清寒", "薛逢", "苏莹", "乔无咎", "苏衍"],
  criticalTerms: ["血魔蛊", "五转", "血祭", "祖传旧玉", "月光蛊", "血刃蛊", "血甲蛊"],
};

export const roles: Role[] = [
  { id: "healer", name: "游方蛊医", gender: "male", title: "四转巅峰 · 游方蛊医", description: "走遍荒野药市，擅辨蛊毒与伤势。祖传旧玉是他唯一不肯示人的来历。", maxHealth: 14, maxEssence: 12, attack: 3, signatureGu: "回春蛊", sense: "normal" },
  { id: "swordsman", name: "流浪剑修", gender: "male", title: "四转巅峰 · 流浪剑修", description: "以蛊御剑，斗法狠厉直接；他不善圆话，只信手中一剑能劈开生路。", maxHealth: 15, maxEssence: 10, attack: 4, signatureGu: "剑鸣蛊", sense: "normal" },
  { id: "heir", name: "落魄世家子", gender: "male", title: "四转巅峰 · 落魄世家子", description: "熟悉墓制与人心，能从一句承诺里听出价码；神识过人，旧玉是家道败落后仅余的遗物。", maxHealth: 12, maxEssence: 10, attack: 3, signatureGu: "惑心蛊", sense: "high" },
];

const routeName: Record<RouteId, string> = { zhao: "赵黎", ji: "纪清寒", xue: "薛逢", su: "苏莹" };
function routeText(state: GameState, content: Record<RouteId, string>) { return state.route ? content[state.route] : "墓道在身后轰然断裂。你尚未看清同行之人的面孔，只能循着血腥气继续向前。"; }

export const scenes: Record<string, Scene> = {
  gate: {
    id: "gate", act: 1, node: 1, chapter: "第一幕 · 聚 · 节点 1 / 1", title: "夜雨墓门",
    text: "荒原的夜雨，从入夜起便没有停过。\n\n蛊市早已散了，此刻墓门前只余下五个来历各异的修士。为首的是个灰袍中年，自称乔无咎，正将半张泛黄的墓图在雨里缓缓摊开。他指尖点着图中一处血色的标记，声音不疾不徐，偏生字字都送进人耳里：“诸位道友，这荒原之下，埋着一位五转蛊修的坐化之地。”\n\n雨声里，有人的呼吸明显重了几分。\n\n“五转蛊修……”乔无咎似笑非笑地环顾众人，“便是将本命蛊养到了第五转的老怪物。这等人物坐化前留下的遗物，见者有份。”\n\n你站在人群靠后的位置，一只手始终按在腰间那枚祖传旧玉上。玉身冰凉，此刻却在掌心下微微发烫，像被墓门深处某样东西遥遥唤醒，又像玉里封着的那半缕气息，正挣扎着要醒过来。\n\n“见者有份？”\n\n倚着青石把玩一枚血纹蛊虫的少年忽地开口。这少年面白如玉，眉目俊秀，嗓音却沙哑苍老，与那张脸极不相称。他说话时，指间的血纹蛊虫一缩一缩，细长的口器探进雨幕，贪婪地啜饮着空中弥漫的血气。\n\n“老夫活到这把年纪，”那少年，也就是赵黎，慢悠悠道，“只信两样东西——手里的蛊，和拿蛊的那只手。”\n\n离他不远处，一名抱剑的女子立在雨里，剑未出鞘，人也不与任何人搭话。雨水顺着她的鬓角滑下，滑进领口，她也懒得去拂。你认得这把剑，也认得这个人——纪清寒，清冷得像是从墓里吹出来的一阵风。\n\n“散修在外，本就不容易！”一个圆脸汉子凑上前来，见谁都先笑三分，嘴里翻来覆去，已把“散修互照应”说了三遍，“今日能与诸位同行，实在是三生有幸、三生有幸！”\n\n这人唤作薛逢。他笑的时候，眼珠子却滴溜溜地转，没有一刻真正落在谁身上。\n\n你身旁还站着个瘦小的身影。那是个叫苏莹的女子，自始至终没有抬头，只垂着眼，用指尖在潮湿的泥土上一笔一划地描摹墓门上的蛊纹。她描得极慢，慢得像在背诵一句不该被人听见的话，又慢得像生怕描错了哪一笔，就会惊动门后蛰伏的什么东西。\n\n乔无咎将墓图折好，收入袖中，一拱手，扫过众人：“时候不早了。进墓之后，各凭本事，也各安天命。”\n\n他说完，率先踏进墓门，身影很快被门内的黑暗吞没。\n\n赵黎隔着一层雨幕，忽然朝你这边看了一眼。那一眼并不凌厉，甚至带着点笑意，可你分不清那笑里藏着的，究竟是对猎物的打量，还是别的什么。\n\n你按住旧玉，跟了上去。玉，烫得更厉害了。",
    choices: [
      { id: "jade", label: "旧玉烫得厉害，你不动声色地把它攥进掌心，只当没察觉", next: "swarm", result: "旧玉在掌心下愈发烫人，仿佛门后有一双眼睛，正透过这枚玉与你遥遥对视。你不动声色地将它攥得更紧，只当什么都没察觉，却已暗中记下了这份异样。玉烫得越急，你便越笃定——这座墓里，藏着与这枚玉遥相呼应的东西。", effect: { flag: "旧玉发烫" } },
      { id: "observe-su", label: "你落后半步，恰好听清苏莹对着墓门念出的最后几个音节", next: "swarm", result: "你落后半步，恰好听清了苏莹念出的最后几个音节。那声音细若蚊蚋，却在雨声里格外清晰，像是念给门后某位故人听的。她似乎察觉了你的目光，指尖微顿，随即又飞快地描了下去，像要抹掉刚才那一瞬的失态。", effect: { flag: "苏莹低语" } },
      { id: "enter", label: "你垂下眼，随着乔无咎的背影第一个跨进墓门", next: "swarm", result: "你垂下眼，随着乔无咎的背影跨进墓门。身后的夜雨声，在石门合拢的那一刻戛然而止。门内比外面更冷，冷得连呼出的气都凝成白雾。你这才明白，自己已真正踏进了这座墓，从此再没有回头路可走。" },
      { id: "insight", label: "你扫过五人散乱的站位，心里忽然浮起一念——这墓门的生门，似不止一个", next: "swarm", result: "你扫过五人散乱的站位，心头忽地一片清明——这墓门的生门竟不止一个，倒像一张早已布好的棋盘，只等着棋子自己走进去。乔无咎、赵黎，甚至一言不发的纪清寒，都各自踩着棋局的某个位置。你看得越清，背脊便越发凉。", requires: { flags: ["高神识"] }, effect: { flag: "识破棋局" } },
    ],
  },
  swarm: {
    id: "swarm", act: 2, node: 1, chapter: "第二幕 · 入 · 节点 1 / 6", title: "甬道蛊潮",
    text: "入墓不过百步，前方的石壁缝隙里，忽然涌出万千噬魂蛊。\n\n那蛊只有米粒大小，通体乌黑，一经放出便如潮水般压满甬道。空气里瞬间灌满细密的振翅声，像无数根针同时扎进耳膜。\n\n乔无咎举着火折子，火光照着黑潮，把每个人的影子都拉得老长。他声音不紧不慢：“噬魂蛊闻血而动。诸位若不想当饵，就别把血洒出来。”说完，他自己却退到了队尾，负手站着，像在看一出戏。\n\n赵黎袖中的血纹蛊虫振翅而起，一圈看不见的蛊力荡开，近身的噬魂蛊无声自焚，像被更暴烈的蛊力从内里生生撕碎。他连眼皮都没抬。\n\n黑潮将你与纪清寒挤到了侧壁。一条毒藤从砖缝里钻出，缠住了你的脚踝；她剑光一掠，藤断而你的裤脚只裂了一线。几乎同一刻，一只蛊蝎扑向她的后颈，你反手催动月光蛊，一线月白将那蝎子钉死在砖缝里。\n\n她只看了你一眼，低声道：“跟紧。”\n\n队尾，薛逢被黑潮撵得乱窜，嘴里连声喊着“退路、退路”。火光在他煞白的脸上跳了跳，那张常年堆笑的脸，此刻终于笑不出来了。\n\n混乱里，乔无咎始终站在最亮处。火光把他半张脸照得忽明忽暗，另一半，沉在更深的黑暗里。",
    choices: [
      { id: "shout-xue", label: "回身朝薛逢喝道：“别退，贴壁走！”", next: "shadow", result: "你回身朝薛逢喝了一声。他正被蛊潮撵得六神无主，闻声浑身一震，踉跄着贴壁站稳，朝你挤出一个感激的笑。赵黎却皱了皱眉，像是嫌你这一嗓子，搅了他看戏的兴致。只是此刻，也无人顾得上计较这些。", effect: { trust: { xue: 1, zhao: -1 } } },
      { id: "shift-ji", label: "与纪清寒错身换位，替她守住后颈方向", next: "shadow", result: "你与纪清寒错身换位，替她守住了后颈。她只看了你一眼，什么也没说，却把剑柄朝你的方向倾了倾。一只蛊蝎刚扑到半空，便被她回手一剑钉死在壁上。你们之间，第一次有了这种不必言说的默契。", effect: { trust: { ji: 1, xue: -1 } } },
      { id: "observe-all", label: "按住旧玉，任蛊潮从身侧绕开，静静观察众人", next: "shadow", result: "你按住旧玉，任蛊潮从身侧绕开，静静观察众人。赵黎似有所觉，隔空瞥来一眼，那目光里带着几分探究。苏莹则垂下头，指尖的蛊纹描到一半便停了，像是被什么刺了一下。你看在眼里，不动声色。", effect: { trust: { zhao: 1, su: -1 } } },
    ],
  },
  shadow: {
    id: "shadow", act: 2, node: 2, chapter: "第二幕 · 入 · 节点 2 / 6", title: "血影示警",
    text: "蛊潮退去后，甬道里静得只剩下火折子偶尔爆出的轻响。\n\n石壁深处，却有一道血影，随着火光慢慢移动。那影子像个人形，又像团化不开的血，贴着墙根，一步、一步，朝更深处游去。\n\n你腰间的旧玉骤然发烫，灼得皮肤生疼。\n\n赵黎停下了脚步。他隔着众人，朝你望来，目光落在你按着玉的那只手上：“那块玉，借老夫瞧瞧？”\n\n你没有应声。\n\n他也不恼，只笑了笑，笑得像在说一件再平常不过的事：“一会儿你若死了，玉归老夫。提前说好。”\n\n就在这时，纪清寒恰好与你并肩。她的声音压得极低，低得只有你能听见：“这墓的机关有生门。不像防人进，倒像在等什么人。”\n\n她说得极轻，却让你背脊微微一凉——这墓里，似乎真的有什么，一直在等。",
    choices: [
      { id: "refuse-zhao", label: "对赵黎摇了摇头，把旧玉收回袖中", next: "chamber", result: "你对赵黎摇了摇头，把旧玉收回袖中。他挑了下眉，嘴角的笑意淡了下去，却也没再坚持。纪清寒在一旁，多看了你一眼，那一眼里似乎有些许不易察觉的赞许。", effect: { trust: { zhao: -1, ji: 1 } } },
      { id: "ask-ji", label: "侧耳听完纪清寒的低语，轻声追问：“等谁？”", next: "chamber", result: "你侧耳听完纪清寒的低语，轻声追问。她顿了顿，只回了你三个字，随即别开目光，像是不愿多谈。你却在心里，把那扇“生门”记了下来——这墓的机关，果然不像表面那般简单。", effect: { trust: { ji: 1, su: 1 }, flag: "生门低语" } },
      { id: "ask-su", label: "转向苏莹，问她墓主究竟在等什么人", next: "chamber", result: "你转向苏莹，问她墓主究竟在等什么人。她脸色一白，半晌才低声说出几个字，字字都像从齿缝里挤出来的。你从她的神色里，读懂了一层她不愿明说的意思。", effect: { trust: { su: 1, zhao: 1, ji: -1 }, flag: "活符低语" } },
    ],
  },
  chamber: {
    id: "chamber", act: 2, node: 3, chapter: "第二幕 · 入 · 节点 3 / 6", title: "机关暗室",
    text: "脚下的石板，忽然塌了下去。\n\n众人坠入一间刻满血色蛊纹的暗室。摔落的闷响在四壁间回荡，激起一层细密的灰。正中一座石鼎，积着干涸的血垢，暗红发黑，也不知是多少年前留下的。\n\n苏莹盯着墙上那些符文，面色渐渐发白：“这些符……是活的。血，还在动。”\n\n你顺着她的目光看去，果然见墙上的纹路间，有极细的红线在缓缓蠕动，像被什么牵引着，一下、一下，搏动如心跳。\n\n墙角一座石龛里，封着五只蛊卵。冰玉裹身，各色蛊息吞吐不定。是你先发现的。\n\n乔无咎扫了一眼，神色如常，只淡淡道：“见者有份。谁找到的，谁先挑。”\n\n你凑近细看。五只蛊卵中，唯有一只甲纹森森、一只血芒吞吐，与你的蛊息隐隐相合；其余三只对你毫无反应，仿佛生来就与你无缘。",
    choices: [
      { id: "take-armor", label: "取那枚甲纹森森的蛊卵，收入蛊囊", next: "illusion", result: "甲纹蛊卵入手冰凉，纹路如甲片般细密，贴着掌心时，竟隐隐与你周身的蛊息相合。你将它收进蛊囊，原本的甲衣蛊似有所感，微微震颤，片刻后重归沉寂。自此，你的防御，怕是再上一层。", effect: { flag: "血甲蛊" } },
      { id: "take-blade", label: "取那枚血芒吞吐的蛊卵，收入蛊囊", next: "illusion", result: "血芒蛊卵入手微温，内里似有温热的心跳，一下一下，与你掌心的脉搏同频。你将它收进蛊囊，月光蛊的光晕黯淡了一瞬，像让出了什么。自此，你手中之刃，锋芒更甚。", effect: { flag: "血刃蛊" } },
      { id: "yield-su", label: "让出先手，示意苏莹先挑她认得的", next: "illusion", result: "你让出先手。苏莹怔了怔，轻声道了句谢，指尖在那些蛊卵上逐一拂过，像在与什么旧识相认。她的神色忽而复杂起来，半晌，才从五只蛊里，取走了最不起眼的一只。", effect: { trust: { su: 1 }, flag: "活符低语" } },
    ],
  },
  illusion: {
    id: "illusion", act: 2, node: 4, chapter: "第二幕 · 入 · 节点 4 / 6", title: "迷魂阵",
    text: "石殿里弥漫着一股甜腥的蛊香。\n\n你只觉眼前一花，甬道、火光、同行之人，尽数消失。再睁眼时，你已回到记忆里那片旧宅的檐下，站着那个总唤你小名的青梅竹马。\n\n她朝你笑，眉眼弯弯，像隔了许多年，又像从未离开。你朝她走，越走越近，近得能看清她眼角那颗小痣，近得能闻见她发间旧日的气息。你几乎要抬手，去替她拂开额前那缕碎发。\n\n然后，幻境碎了。\n\n你回过神来，眼前不是旧宅，是石殿；你牵住的不是青梅竹马，是纪清寒的手。\n\n她同样僵着，耳根烧得通红，却忘了甩开。\n\n是乔无咎破的阵。他不知何时已退到阵眼，一枚暗红蛊印按在石壁，幻象应声而碎。他先朝你与纪清寒这边抬了抬下巴，似笑非笑：“两位，回神了。”\n\n趁他转身去破其余几处阵眼，你才看清旁人被幻境困住的模样：赵黎僵立原地，掌中血纹蛊虫乱了轨迹，像在替主人压住什么破土而出的执念；薛逢对着空处伸手抓了又抓，抓的全是抓不到的蛊晶；苏莹对着石壁喃喃念咒，念的是半句没人教全的旧咒，眼角有泪。\n\n没有人说话。那片刻的靠近，谁都没有点破。",
    choices: [
      { id: "hold-ji", label: "抬手按住纪清寒的剑柄，对薛逢摇了摇头", next: "puppets", result: "你抬手按住纪清寒的剑柄，对薛逢摇了摇头。她僵了僵，缓缓松开剑鞘，像是才从方才的幻境里回过神来。薛逢讪讪退了半步，把到嘴边的揶揄咽了回去。石殿里，一时静得只剩众人粗重的呼吸。", effect: { trust: { ji: 1, xue: -1 } } },
      { id: "ask-su", label: "若无其事地岔开话，问苏莹有无被阵法伤到", next: "puppets", result: "你若无其事地岔开话，问苏莹有无被阵法伤到。她回神般抬眼看你，眼眶还微微发红，像是还没从幻境里完全走出来。纪清寒却偏过头，眼神冷了下来，像是恼你在这时候，把关切给了旁人。", effect: { trust: { su: 1, ji: -1 } } },
      { id: "fix-ji", label: "沉默着替纪清寒把歪斜的剑穗扶正", next: "puppets", result: "你沉默着替纪清寒把歪斜的剑穗扶正。她没看你，耳根却慢慢红了，像是终于从幻境里挣脱出来。赵黎在暗处冷哼了一声，似是在笑你们这般儿女情长，误了正事。", effect: { trust: { ji: 1, su: 1, zhao: -1 } } },
      { id: "follow-qiao", label: "破阵后，你见乔无咎独自拐进一条暗得反常的岔道，脚步极轻，像在避人。你跟了上去。", next: "shadowQiao", result: "你屏息跟上乔无咎，隐进暗影。他脚步极轻，对这座墓的每一处拐角都熟稔得过分，像早在这墓里走过千百遍。你跟在他身后，心跳得极快，生怕一个不慎，便被他察觉。", requires: { flags: ["识破棋局"] } },
    ],
  },
  puppets: {
    id: "puppets", act: 2, node: 5, chapter: "第二幕 · 入 · 节点 5 / 6", title: "铜皮傀儡",
    text: "墓道骤然开阔，成一片地下石坪。\n\n四角各立着一具铜皮傀儡，此刻同时睁开猩红的蛊核，像是被什么从沉睡里唤醒。活蛊线牵着它们的关节，每一步都带着不输炼体蛊修的力道，震得地面簌簌落灰。\n\n赵黎随手捏碎迎面一具，皱眉道：“活蛊线，只能由近处的施术者维持。”\n\n这话一出，众人心头都是一沉。傀儡不是死的——有人在暗处，牵着这些线。\n\n乔无咎站在石坪正中，面色如常，只说是墓主留下的守墓机关。你却发现，五条出口里，他恰好挡在最像生门的那一侧。\n\n腰间旧玉再次发烫。这一次，你没有压住它。",
    battle: { enemyName: "铜皮傀儡", enemyHealth: 12, victoryNext: "fog", defeatNext: "fog", victoryFlag: "傀儡已毁", defeatFlag: "傀儡重伤" },
  },
  fog: {
    id: "fog", act: 2, node: 6, chapter: "第二幕 · 入 · 节点 6 / 6", title: "大雾迷踪",
    text: "石坪尽头的窄道里，忽然涌出一片蛊雾。\n\n那雾浓得化不开，灰白里透着一丝猩红。灵识被压得只剩不足三尺，连身旁的人脸都模糊成一片虚影。\n\n乔无咎的声音从雾中飘来，说要绕到后头去封住追兵。话音未落，人已经没了踪影。紧接着，十二具更沉重的傀儡，从四面逼近，脚步声闷得像擂鼓。\n\n地面，裂开了。\n\n所有人被陷道吞没。下坠的一瞬间，你什么都看不清，只觉雾里有一只只手在黑暗中乱抓。\n\n你只来得及，抓住其中一只。\n\n那只手，属于这一路与你走得最近的人。",
    choices: [
      { id: "take-zhao", label: "抓住赵黎的手", next: "routeTrial", result: "你抓住了赵黎的手。那只手冰凉而稳，像早有准备，又像对这场变故毫不意外。他没有回握，只轻轻一带，便稳住了你的身形。黑暗中，你听见他低低笑了一声。", requires: { allyTopTwo: "zhao" }, effect: { route: "zhao", trust: { zhao: 1 } } },
      { id: "take-ji", label: "抓住纪清寒的手", next: "routeTrial", result: "你抓住了纪清寒的手。她的手心沁着一层薄汗，却在你触及的瞬间，反手死死攥紧了你，像是生怕一松手，便又只剩下自己一个人。你们一同坠入陷道，耳边是呼啸的风。", requires: { allyTopTwo: "ji" }, effect: { route: "ji", trust: { ji: 1 } } },
      { id: "take-xue", label: "抓住薛逢的手", next: "routeTrial", result: "你抓住了薛逢的手。他抖得厉害，指尖冰凉，被你攥住后却长舒了一口气，像是抓住了一根救命稻草。他凑近了些，声音发颤：“可算、可算抓住个活人了。”", requires: { allyTopTwo: "xue" }, effect: { route: "xue", trust: { xue: 1 } } },
      { id: "take-su", label: "抓住苏莹的手", next: "routeTrial", result: "你抓住了苏莹的手。她的手很小，冷得几乎没有温度，却在被你握住后，轻轻回握了一下。她没说话，只是把脸埋进你的肩侧，像终于找到了可以靠一靠的地方。", requires: { allyTopTwo: "su" }, effect: { route: "su", trust: { su: 1 } } },
    ],
  },
  routeTrial: {
    id: "routeTrial", act: 3, node: 1, chapter: "第三幕 · 离 · 节点 1 / 4", title: "陷道同行",
    text: (state) => {
      const base = routeText(state, {
        zhao: "赵黎落地便以压倒性蛊力撕开傀儡群。他不回头，只说跟不上便留在这里。密室枯骨旁留着一卷蛊简，记载血魔蛊畏寒；赵黎看过后随手丢开。",
        ji: "你与纪清寒在狭窄陷道中沉默推进。她替你硬接一记傀儡重拳，虎口崩血；你引爆蛊种堵住追兵。她看着碎石，沉默许久才道：“你这种打法，活不过四十岁。”",
        xue: "薛逢一路说散修互照应，手里却悄悄收起一截乔无咎遗落的活蛊线。那线上连着操控印记，他以为你没有看见，仍在说等出去后要与你平分蛊晶矿。",
        su: "苏莹几乎没有正面战力。你带着她穿过傀儡群，她伏在你背上说起师父留下的半张墓图：墓主曾言“蛊不可祭，蛊只可承”。她不知道如何阻止血祭，只知道自己不能离开。",
      });
      if (state.flags.includes("曾尾行乔无咎")) {
        const replies: Record<RouteId, string> = {
          zhao: "你把暗室里活蛊线的事告诉了赵黎。他只“哦”了一声，眼神却往你身后那堵墙瞟了一眼，半晌道：“你看得倒清楚。”",
          ji: "你把暗室里活蛊线的事告诉了纪清寒。她握剑的手紧了紧，低声道：“这墓里，果然有人早来过了。”",
          xue: "你把暗室里活蛊线的事告诉了薛逢。他脸色一白，赔笑着让你“可别乱说”，袖中的手抖了抖。",
          su: "你把暗室里活蛊线的事告诉了苏莹。她猛地抬头看你，嘴唇动了动，终究没说出那个名字。",
        };
        return base + "\n\n" + (state.route ? replies[state.route] : "");
      }
      return base;
    },
    choices: [
      { id: "zhao-cold", label: "收起冰寒蛊简，将秘术暗记于心", next: "routeTruth", result: "你收起冰寒蛊简，将秘术暗记于心。血魔蛊畏寒——这或许是压制它的关键。", requires: { route: "zhao" }, effect: { flag: "冰寒蛊简" } },
      { id: "ji-shield", label: "替纪清寒挡下那一记重拳", next: "routeTruth", result: "你替纪清寒挡下那一记重拳，虎口一麻，却只觉气血翻涌间更凝实了几分。", requires: { route: "ji" }, effect: { health: 4, maxHealth: 4 } },
      { id: "xue-line", label: "记下薛逢藏起的活蛊线印记", next: "routeTruth", result: "你记下了薛逢藏起的活蛊线印记。那线连着操控，也连着执棋之人。", requires: { route: "xue" }, effect: { flag: "活蛊线印记" } },
      { id: "su-continue", label: "背着她穿过傀儡群，继续前行", next: "routeTruth", result: "你背起苏莹穿过傀儡群。她伏在你背上，呼吸很轻，像怕惊扰你。", requires: { route: "su" } },
    ],
  },
  routeTruth: {
    id: "routeTruth", act: 3, node: 2, chapter: "第三幕 · 离 · 节点 2 / 4", title: "各自的代价",
    text: (state) => routeText(state, {
      zhao: "岔道口横着苏莹的尸身，胸口没有刀剑伤，只被抽干了血气——你认得，那是祭阵的手笔。赵黎从她身侧走过，看也不看，只皱眉道“又少一个分蛊的”。再往前，你找到纪清寒半截断剑；她在另一条道里一敌五傀儡，剑断人亡。你们也撞上乔无咎操控的机关，蛊矢如雨，赵黎以血蛊硬挡，才把机关阵打退。他全程没有对同伴动过一根手指，只是冷漠地看他们一个接一个倒下。",
      ji: "你与纪清寒每一步都在互相补位。她不再提迷魂阵，你也不问她要救的至亲。血色石门前，苏莹被祭阵隔空抽尽血气，抓住你的旧玉只来得及说半句“那块玉……是……”。纪清寒握住残剑，目光第一次不再像冰。",
      xue: "岔道里，薛逢忽然放声大喊，似在唤失散的同伴——可你听得分明，那喊声更像在给暗处的某人报你的方位。蛊矢破风而来，你反手以蛊挡下，乔无咎的暗手被这一挡击退，没入石壁。薛逢脸上的汗更密了，仍赔着笑“好险好险”。你望着他的背影，心里第一次起了疑。",
      su: "苏莹在你背上断断续续说，师父找了一辈子墓主的后人。她看向你的旧玉时神色愈发笃定。傀儡忽从阴影刺来；若旧玉、纪清寒的生门低语与苏莹识活符的线索都已留下，旧玉会先一步爆出血光，否则这一击将贯穿她。",
    }),
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
    text: (state) => routeText(state, {
      zhao: "赵黎在血色石门前停步，忽然问你是否记住了蛊简内容。他分明知道你没有全说，却没有逼问，只笑称进了门再谈。你明白他不是放过你，而是在等最适合夺蛊的一刻。",
      ji: "纪清寒以残剑拄地，血线已在她腕间游走。她说自己进墓本为续魂蛊材，对五转血魔蛊毫无兴趣；随后又补了一句，若血魔蛊醒来，她会先斩阵眼。你没有答话，只把她站不稳的肩扶正。",
      xue: "薛逢终于承认活蛊线能追到控制室，却说要等最值钱的时候才用。你没有拆穿他，只悄悄以聚灵蛊留下逆向追踪印记。若他还想拿乔无咎的机关做买卖，这条线也能把你带到执棋者面前。",
      su: state.flags.includes("苏莹存活") ? "旧玉的血光震碎傀儡，苏莹仍站在你身侧。她望着玉佩，终于明白师父寻找的人或许就是你。她割破指尖，让一滴血留在石门暗纹上；门后似有另一道更深的锁在回应。" : "苏莹在你怀里咽气前，用尽力气抓住你的手，把血蹭在你指尖。“我的血……能开门。”她望着你的旧玉，声音轻得几乎听不见，“你……是那个人。”那双眼睛直到最后也没合上，像还在等一个回答。你替她阖上眼，指间那抹血却怎么都擦不掉。",
    }),
    choices: [{ id: "approach-door", label: "推开血色石门", next: "bloodGate", result: "你推开血色石门。门后没有尘土味，只有新鲜的血气。" }],
  },
  bloodGate: {
    id: "bloodGate", act: 3, node: 4, chapter: "第三幕 · 离 · 节点 4 / 4", title: "血纹石门",
    text: (state) => `石门上五道血纹依次亮起。与你同行的是${state.route ? routeName[state.route] : "不明之人"}，其余人的生死已被墓道切碎在身后。乔无咎的声音第一次不再掩饰：“前面便是主墓室。各凭本事吧，诸位。”\n\n门缝里吹出的风没有尘土味，只有新鲜血气。你握住旧玉，推门而入。`,
    choices: [{ id: "enter-hall", label: "踏入血魔蛊室", next: "bloodGuard", result: "你踏入血魔蛊室。身后石门轰然合拢，把来路封死。" }],
  },
  bloodGuard: {
    id: "bloodGuard", act: 4, node: 1, chapter: "第四幕 · 血魔蛊室 · 节点 1 / 3", title: "守门血傀儡",
    text: "推开血色石门的刹那，一具通体猩红的傀儡堵在门后——它比铜皮傀儡高出整整一倍，蛊核里翻涌着浓稠的血光。赵黎皱了皱眉，正要出手，血傀儡已朝你扑来。",
    battle: { enemyName: "血傀儡", enemyHealth: 20, victoryNext: "bloodRoom", defeatNext: "bloodRoom", victoryFlag: "血傀儡已毁", defeatFlag: "血傀儡被赵黎击碎" },
  },
  bloodRoom: {
    id: "bloodRoom", act: 4, node: 1, chapter: "第四幕 · 血魔蛊室 · 节点 1 / 3", title: "五转蛊卵",
    text: (state) => `石门合拢，四壁血纹齐亮，数道血线汇向中央血池。池中蛊卵缓缓裂开，**五转血魔蛊**的威压灌满石室。乔无咎不现身，只通过活蛊线从石壁中说：“四人的血，一个人的命，正好。”\n\n${state.route === "ji" ? "纪清寒以残剑拄地，血线正自她体内流向血池。" : state.route === "su" && state.flags.includes("苏莹存活") ? "苏莹站在你身侧，指尖那滴血仍在石面暗纹中发亮。" : state.route === "xue" ? "薛逢已开始盘算向谁跪下最值钱。" : "赵黎站在你身侧，却像一头终于等到猎物围成一圈的狼。"}`,
    choices: [{ id: "resist", label: "压住蛊种，寻找血祭阵眼", next: "awakening", result: "你压住翻涌的蛊种，在漫天血纹中寻找阵眼。" }, { id: "answer-qiao", label: "拖住乔无咎，逼他多说一句", next: "awakening", result: "你扬声拖住乔无咎，逼他多说了半句。他的声音里，第一次透出不耐。", effect: { trust: { qiao: -1 } } }],
  },
  awakening: {
    id: "awakening", act: 4, node: 2, chapter: "第四幕 · 血魔蛊室 · 节点 2 / 3", title: "血流将醒",
    text: (state) => routeText(state, {
      zhao: "赵黎终于出手，掌中血蛊直取你的心脉。你等的正是这一刻：冰寒蛊简的秘术冻住周身血气，旧玉随之发亮，血魔蛊的蛊影在池中停滞一瞬。",
      ji: "纪清寒看着你，只说“你选”。她以冰蚕剑插入血池阵眼，愿用三息冻结替你炸出一线生机。你知道这一剑下去，她与自己的蛊种都可能碎裂。",
      xue: "薛逢抢先跪下，向乔无咎说依约把你带来。乔无咎却淡淡答祭品名单上也有他。你藏在聚灵蛊中的追踪印记顺着活蛊线逆行，控制室的位置终于在识海中亮起。",
      su: state.flags.includes("苏莹存活") ? "苏莹的血滴入石面，暗门在血池下缓缓升起。黑石棺椁破水而出，苏衍并未坐化，而是以血魔蛊为饵等待祭品。乔无咎惊怒未尽，已被反向活蛊线拖向血池。" : "苏莹的尸身仍在门边。你看着她未写完的血字，明白再等下去，血祭会吞掉所有人。你割开手腕，决定以自己的血替换祭品。",
    }),
    choices: [{ id: "face-final", label: "在蛊卵彻底裂开前作出选择", next: "finale", result: "你在蛊卵彻底裂开前，做出了选择。" }],
  },
  finale: {
    id: "finale", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "人吃蛊，还是蛊吃人",
    text: (state) => routeText(state, {
      zhao: "冰寒秘术与旧玉血光同时压住血魔蛊。赵黎第一次露出讶色，随即大笑，说你终于有资格做他的对手。只有在这里击败他，才能夺得血魔蛊。",
      ji: "纪清寒已将冰蚕剑钉进阵眼。她要你带她离开，不要带走蛊。你若引爆自己的蛊种，血魔蛊会在将醒未醒之间化灰；代价是你们二人修为尽废。",
      xue: "逆向活蛊线已指向控制室。乔无咎操控被截断的一瞬，就是夺蛊的唯一机会。薛逢还在求饶，你可以让他活着记账，也可以把他交回血祭。",
      su: state.flags.includes("苏莹存活") ? "苏衍从黑石棺中复苏，五转威压压得血池翻涌。赵黎、纪清寒、薛逢与苏莹都还活着；这是唯一能让五人联手的时刻。" : "你纵身跃入血池，准备以全部血液与血魔蛊共生。苏莹未能回来，但你能决定这只蛊醒来后是吞人，还是被人驾驭。",
    }),
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
    text: "苏衍抬手，乔无咎被活蛊线拖入血池。你以旧玉为引，血魔蛊却挣脱你的掌心，认祖归宗飞回苏衍手中——“此蛊本是我苏氏血脉所养。”赵黎先出手，纪清寒以断剑重铸阵纹，苏莹用血脉干扰墓室，薛逢被你硬拽去堵住退路。五人第一次真正站在同一边，对面是握着自己血脉之蛊的墓主。",
    battle: { enemyName: "苏衍", enemyHealth: 28, victoryNext: "ending", defeatNext: "ending", victoryFlag: "墓主已灭", defeatFlag: "墓主吞尽血食" },
  },
  zhaoBattle: {
    id: "zhaoBattle", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "血蛊相争",
    text: "冰寒秘术封住周身血气，祖传旧玉随之放出血光。赵黎脸上的笑意终于收起，掌中血线与血魔蛊遥相呼应。他说你有资格做他的对手；你知道这一战之后，墓里只会剩下一个能握住血魔蛊的人。",
    battle: { enemyName: "赵黎", enemyHealth: 22, victoryNext: "qiaoReveal", defeatNext: "ending", victoryFlag: "血魔蛊", defeatFlag: "赵黎夺蛊" },
  },
  qiaoReveal: {
    id: "qiaoReveal", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "执棋者现身",
    text: "赵黎的身躯在你掌下崩裂倒下。血魔蛊自他的残躯中挣脱，猩红一线没入你的掌心——温热的蛊力顺着经脉游走，像在认主，又像在蛊惑。\n\n“精彩。”乔无咎的声音从石壁后传来。他缓缓步出阴影，抚掌而笑：“我布局十年，等的就是有人替我把这只蛊喂熟。现在，该取回来了。”",
    choices: [
      { id: "fight-qiao", label: "迎上去，与乔无咎做个了断", next: "qiaoBattle", result: "你迎上去，攥紧掌心那抹猩红，与乔无咎做个了断。" },
    ],
  },
  qiaoBattle: {
    id: "qiaoBattle", act: 4, node: 3, chapter: "第四幕 · 血魔蛊室 · 节点 3 / 3", title: "暗室杀局",
    text: "乔无咎十指勾动，整座墓室的活蛊线同时绷紧。他知道血魔蛊已在你掌心，也不急，只一步步把你逼向死局。你攥紧那抹猩红——用，还是不用？",
    battle: { enemyName: "乔无咎", enemyHealth: 24, victoryNext: "ending", defeatNext: "ending", victoryFlag: "乔无咎已伏", defeatFlag: "乔无咎得逞" },
  },
  shadowQiao: {
    id: "shadowQiao", act: 3, node: 1, chapter: "第三幕 · 暗线 · 节点 1 / 3", title: "尾行",
    text: "你借着迷魂阵残存的蛊香与暗影，远远缀在乔无咎身后。他一路走得极熟，避开了所有生门，像在这墓里走过千百遍。你在一条石缝后看见他推开一道伪墙，墙后是一间嵌满活蛊线的暗室——无数细线从石壁深处牵出，末端悬着一枚枚傀儡蛊核。\n\n你终于看清了半盘棋：那些傀儡不是墓主设的，是乔无咎的手笔。",
    choices: [
      { id: "approach", label: "再靠近些，看他在捣鼓什么", next: "shadowTruth", result: "你又靠近了些，屏息看他究竟在捣鼓什么。" },
      { id: "retreat", label: "记下路线，退回大队", next: "puppets", result: "你记下路线，悄然后退，退回大队。", effect: { flag: "曾尾行乔无咎" } },
    ],
  },
  shadowTruth: {
    id: "shadowTruth", act: 3, node: 2, chapter: "第三幕 · 暗线 · 节点 2 / 3", title: "血祭的账本",
    text: "你在暗室角落看见一册用血写就的账本，记的是祭品名单。你的名字，和苏莹的名字，并排写在最后一页。乔无咎忽然停下，头也不回地开口：“跟了一路，不累么？”",
    choices: [
      { id: "confront", label: "现身摊牌，用话周旋", next: "shadowBargain", result: "你从暗处现身，与乔无咎摊牌。" },
      { id: "flee", label: "立刻退走，把所见带出墓去", next: "puppets", result: "你立刻退走，把所见带出墓去。", effect: { flag: "曾尾行乔无咎" } },
    ],
  },
  shadowBargain: {
    id: "shadowBargain", act: 3, node: 3, chapter: "第三幕 · 暗线 · 节点 3 / 3", title: "执棋者的重利",
    text: "你现身。乔无咎不惊反笑，说早等着一个“看得懂棋”的人。他许下重利——五转血魔蛊的祭引、半座蛊市的暗庄、以及活着走出这座墓的名额。\n\n“入我的局，做我暗室里的第二双眼睛；或者，死在这里。”",
    choices: [
      { id: "accept", label: "接受邀请，入他的局", next: "shadowBetrayal", result: "你接下了乔无咎的重利，成了他暗室里的第二双眼睛。" },
      { id: "refuse", label: "拒绝。你已看穿这盘棋，不愿做他的棋子", next: "ending", result: "你拒绝了乔无咎。他叹了口气，像早就料到。", effect: { ending: "seer" } },
    ],
  },
  shadowBetrayal: {
    id: "shadowBetrayal", act: 3, node: 4, chapter: "第三幕 · 暗线 · 节点 4 / 4", title: "你如何帮乔无咎杀死队友",
    text: "你成了乔无咎暗室里的第二双眼睛。在他的授意下，你一步步把同行之人引入死局——你以“探路”为名，把纪清寒引到一段你没有提醒的机关前，蛊矢破空时，她本能地先护住你，剑断、血落；祭阵发动，苏莹认得是你引的路，却没有逃，只轻声说“我知道你会这样选”。\n\n乱局中，薛逢不再演了——他主动亮出暗线身份，与你并肩。可乔无咎隔空捏碎了他的心脉，冷冷一句“废物，本就该第一个死”。\n\n然而，怎么也找不到赵黎。他早就识破了幻阵，独自夺蛊，化身为血魔。你死在他手中，死前最后一眼，是他站在血池边回头望你的样子。",
    choices: [
      { id: "meet-zhao", label: "迎向化魔的赵黎", next: "ending", result: "你迎向化魔的赵黎。他回头望你，眼里的猩红比火光更亮。", effect: { ending: "traitor" } },
    ],
  },
};

export const endings: Record<string, Ending> = {
  demon: { id: "demon", name: "夺蛊成魔", epitaph: "血浪吞人，唯你仍立。", text: "乔无咎现身的瞬间，你终于放开那点克制。血魔蛊脱手，六尺血幕吞了乔无咎，也吞了你最后的人性。墓门外月色如血，你成了再无人敢直呼其名的血蛊魔君。" },
  severed: { id: "severed", name: "破蛊断脉", epitaph: "蛊碎了，人还在。", text: "纪清寒冻结阵眼三息，你引爆蛊种，血魔蛊与血祭一同化灰。你们修为尽废，却互相搀扶走出天亮的墓门。江湖失去两名蛊修，山野多了一间安静药铺。" },
  tyrant: { id: "tyrant", name: "血蛊枭雄", epitaph: "活蛊线断，旧账才刚开始。", text: "你借活蛊线反制控制室，乔无咎被祭阵反噬。临死前，他却隔空捏碎薛逢的心脉——“废物，本就该第一个死。”血魔蛊残缺认主，纪清寒带断剑离开。你未成魔，却亲眼看着那颗卑微的棋子死在执棋人手里。" },
  sacrifice: { id: "sacrifice", name: "以身饲蛊", epitaph: "人蛊共生，意志为主。", text: "你以全身血液替代祭品，与血魔蛊共生。苏莹没有回来，但你让蛊听命于人。此后人间多了一位镇压邪蛊的血蛊主，每年入冬，你都会去她坟前坐一会儿。" },
  true: { id: "true", name: "血脉归位", epitaph: "五人出墓，天光未负。", text: "苏衍败亡，乔无咎化为枯骨，血室崩塌。赵黎留下未竟之战，薛逢发誓改邪，纪清寒将寒蚕丝系在你腕上；苏莹红着眼问你以后会不会丢下她。你说，不丢了。" },
  deathByZhao: { id: "deathByZhao", name: "血蛊反噬", epitaph: "血蛊相争，败者无坟。", text: "赵黎掌中血线穿透你的蛊种。旧玉落地，被他一脚踏碎。血魔蛊在池中发出一声低鸣——它已认主，却不是认你。" },
  deathByMaster: { id: "deathByMaster", name: "命丧墓主", epitaph: "五转之下，皆为祭品。", text: "苏衍的五转威压碾碎了你最后的蛊息。血池倒灌，你看见自己的血汇入那具黑石棺椁，成为它下一场沉睡的养分。" },
  death: { id: "death", name: "命丧血池", epitaph: "血魔蛊醒，先吞活人。", text: "你在蛊室中失去最后一点真元。血祭没有停下，苏衍与乔无咎的谋算都沉入血池，只剩血魔蛊记得你的气息。" },
  trapped: { id: "trapped", name: "困于蛊墓", epitaph: "迟疑太久，墓门已合。", text: "你们在机关与伤势中耗尽时间。血雾封死所有退路，墓门外的夜雨仍在下，却再也落不到你身上。" },
  lone: { id: "lone", name: "独活出墓", epitaph: "蛊散，人独活。", text: "乔无咎倒下时，你看见血魔蛊在掌心跃跃欲试的猩红。你收了手，反手将它连同自己的蛊种一并震碎。同行之人死尽，你独自走出墓门，身后背着一座空墓，与再无人能作证的夜雨。" },
  traitor: { id: "traitor", name: "叛徒", epitaph: "为虎作伥，终被虎噬。", text: "你为虎作伥，助乔无咎杀尽同伴，却先被乔无咎弃子，再死于化魔的赵黎之手。连“背叛”都没能救你的命。" },
  seer: { id: "seer", name: "洞见而殁", epitaph: "看懂了棋，落不下子。", text: "你拒绝入局。暗室里万千活蛊线同时绷直，无数傀儡潮水般将你淹没。直到被蛊核的猩红吞没的前一刻，你仍不敢置信——你看懂了整盘棋，却连一枚子都来不及落。" },
};

export const endingAccess: Record<RoleId, string[]> = { healer: Object.keys(endings), swordsman: Object.keys(endings), heir: Object.keys(endings) };
export function initialGame(): GameState { return { roleId: null, sceneId: "gate", route: null, health: 0, maxHealth: 0, essence: 0, maxEssence: 0, time: 0, flags: [], trust: { zhao: 0, ji: 0, xue: 0, su: 0, qiao: 0 }, battle: null, endingId: null }; }
export function getRole(id: RoleId | null) { return roles.find((role) => role.id === id) ?? null; }
export function chooseRole(id: RoleId = "healer") { const role = getRole(id)!; return { ...initialGame(), roleId: id, health: role.maxHealth, maxHealth: role.maxHealth, essence: role.maxEssence, maxEssence: role.maxEssence, flags: role.sense === "high" ? ["高神识"] : [] }; }

// 好感度并列顺序：赵黎 > 薛逢 > 纪清寒 > 苏莹
const allyOrder: AllyId[] = ["zhao", "xue", "ji", "su"];
function rankTrust(trust: Record<AllyId, number>): AllyId[] {
  return [...allyOrder].sort((a, b) => (trust[b] - trust[a]) || (allyOrder.indexOf(a) - allyOrder.indexOf(b)));
}

export function canChoose(state: GameState, choice: Choice) {
  if (choice.requires?.route && state.route !== choice.requires.route) return false;
  if (choice.requires?.flags && !choice.requires.flags.every((flag) => state.flags.includes(flag))) return false;
  if (choice.requires?.allyTopTwo && !rankTrust(state.trust).slice(0, 2).includes(choice.requires.allyTopTwo)) return false;
  return true;
}
function unique(items: string[], item?: string) { return item && !items.includes(item) ? [...items, item] : items; }
export function applyChoice(state: GameState, choice: Choice): GameState {
  const effect = choice.effect;
  const trust = { ...state.trust };
  for (const [ally, amount] of Object.entries(effect?.trust ?? {})) trust[ally as AllyId] += amount ?? 0;
  const maxHealth = Math.max(1, state.maxHealth + (effect?.maxHealth ?? 0));
  const maxEssence = Math.max(0, state.maxEssence + (effect?.maxEssence ?? 0));
  return { ...state, sceneId: choice.next, route: effect?.route ?? state.route, maxHealth, maxEssence, health: Math.max(1, Math.min(maxHealth, state.health + (effect?.health ?? 0))), essence: Math.max(0, Math.min(maxEssence, state.essence + (effect?.essence ?? 0))), time: state.time + (effect?.time ?? 0), flags: unique(unique(state.flags, effect?.flag), effect?.ending ? `结局:${effect.ending}` : undefined), trust };
}
export function sceneText(state: GameState, scene: Scene) { return typeof scene.text === "function" ? scene.text(state) : scene.text; }
export function getEnemyCondition(health: number, maximum: number) { return health >= maximum ? "健康" : health <= maximum * 0.3 ? "重伤" : "受伤"; }

const patterns: Record<string, EnemyAction[]> = {
  "铜皮傀儡": [{ id: "pounce", damage: 2, cue: "铜皮傀儡微微伏低身子，关节处的活蛊线绷得笔直，发出细而紧的响动，像一张拉满的弓。" }, { id: "wire", damage: 3, cue: "它眼窝里的蛊核忽明忽暗，数条活蛊线自砖缝间悄然游出，正向你脚边蜿蜒而来。" }, { id: "crush", damage: 5, cue: "傀儡双臂缓缓抬起，石坪上的碎屑被无形的劲力压得贴地滑行，这一记若砸实了，怕是要将人碾成肉泥。" }],
  "血傀儡": [{ id: "lash", damage: 4, cue: "血傀儡胸前的血光一亮，一条血色锁链破空抽来。" }, { id: "smash", damage: 6, cue: "血傀儡抬起磨盘大的拳头，带起一阵腥风，似要当头砸下。" }, { id: "roar", damage: 8, cue: "血傀儡胸腔里的血核剧烈鼓动，一圈血浪自它脚下炸开，直逼面门。" }],
  "苏衍": [{ id: "mist", damage: 4, cue: "苏衍抬手时，血池中升起一层沉重血雾，连呼吸都像被人攥住。" }, { id: "seal", damage: 6, cue: "黑石棺上的蛊印逐一亮起，整座墓室都在回应苏衍的心跳。" }, { id: "feast", damage: 9, cue: "苏衍张开五指，血池中的残魂齐齐尖啸，似要将所有活人的气血一口吞尽。" }, { id: "rest", damage: 0, heal: 5, cue: "苏衍闭目吸纳血池余烬，散开的威压正在重新凝实。" }, { id: "blooddemon", damage: 6, heal: 6, cue: "苏衍掌心的血魔蛊舒展开来，一线猩红吸走你的血气，反哺回他干瘪的躯壳。" }],
  "赵黎": [{ id: "thread", damage: 4, cue: "赵黎指尖垂下一缕血丝，细得几乎融入石室阴影。" }, { id: "palm", damage: 6, cue: "赵黎袖袍无风自鼓，掌前血气压得灯火偏向一侧。" }, { id: "mirror", damage: 0, invulnerable: true, reflect: true, cue: "赵黎身前浮起一层薄薄血幕，幕中倒映出你的身影，暗流正反向涌动。" }, { id: "thread2", damage: 4, cue: "赵黎的血丝再次垂落，这一次缠上了石缝里未熄的火星。" }, { id: "palm2", damage: 7, cue: "赵黎掌前血气压得更低，连你的呼吸都跟着一沉。" }, { id: "mirror2", damage: 0, invulnerable: true, reflect: true, cue: "血幕再起，你的倒影在幕中冷冷笑了一声。" }, { id: "thread3", damage: 4, cue: "赵黎的血丝已染红了半截衣袖，杀意凝如实质。" }, { id: "palm3", damage: 8, cue: "赵黎掌前血浪翻涌到极致，整座墓室的灯火齐齐一暗。" }, { id: "mirror3", damage: 0, invulnerable: true, reflect: true, cue: "血幕几乎吞没了你，幕中映出的身影正缓缓抬起与你相同的手。" }],
  "乔无咎": [{ id: "wire", damage: 3, essenceDrain: 1, cue: "乔无咎十指勾动，暗室里的活蛊线如蛛网般绷紧，数枚傀儡蛊核齐齐亮起。" }, { id: "puppets", damage: 6, essenceDrain: 1, cue: "乔无咎一声低笑，成排铜皮傀儡自石壁后转出，向你围拢而来。" }, { id: "trap", damage: 9, essenceDrain: 2, cue: "乔无咎猛地一拽，你脚下的石砖寸寸崩裂，脚下机关几乎要将你吞进去。" }],
};
function configFor(state: GameState, scene: Scene) { return typeof scene.battle === "function" ? scene.battle(state) : scene.battle; }
function patternFor(name: string) { return patterns[name] ?? patterns["铜皮傀儡"]; }
export function startBattle(state: GameState, scene: Scene): GameState {
  const config = configFor(state, scene); const role = getRole(state.roleId); if (!config || !role) return state;
  const pattern = patternFor(config.enemyName);
  const gift = config.enemyName === "铜皮傀儡" && state.flags.includes("苏莹低语") ? 4 : 0;
  const maxHealth = state.maxHealth + gift;
  const health = state.health + gift;
  return { ...state, maxHealth, health, essence: state.maxEssence, battle: { ...config, enemyMaxHealth: config.enemyHealth, turn: 0, intent: pattern[0] } };
}
function finishBattle(state: GameState, battle: Battle, won: boolean, health: number) {
  const next = won ? battle.victoryNext : battle.defeatNext;
  const flag = won ? battle.victoryFlag : battle.defeatFlag;
  const final = battle.enemyName === "苏衍" ? (won ? "true" : "deathByMaster")
    : battle.enemyName === "赵黎" ? (won ? undefined : "deathByZhao")
    : battle.enemyName === "乔无咎" ? (won ? (state.flags.includes("血魔蛊已用") ? "demon" : "lone") : "death")
    : undefined;
  const maxEssence = battle.enemyName === "血傀儡" && won ? state.maxEssence + 4 : state.maxEssence;
  const essence = battle.enemyName === "血傀儡" && won ? Math.min(maxEssence, state.essence + 4) : state.essence;
  return { ...state, maxEssence, essence, health: won ? Math.min(state.maxHealth, Math.max(1, health) + 2) : 1, time: won ? state.time : state.time + 1, sceneId: next, battle: null, flags: unique(unique(state.flags, flag), final ? `结局:${final}` : undefined) };
}
export function resolveBattleTurn(state: GameState, action: GuAction): GameState {
  const battle = state.battle; const role = getRole(state.roleId); if (!battle || !role) return state;

  // 角色专属蛊验证
  if (action === "heal" && role.id !== "healer") return state;
  if (action === "sword" && role.id !== "swordsman") return state;
  if (action === "charm" && role.id !== "heir") return state;
  if (action === "blooddemon" && !state.flags.includes("血魔蛊")) return state;

  // 真元验证
  const cost = action === "rest" ? 0 : action === "heal" ? 2 : action === "sword" ? 4 : action === "charm" ? 3 : action === "blooddemon" ? 2 : 1;
  if (state.essence < cost) return state;
  if (state.essence === 0 && action !== "rest") return state;
  if (state.essence > 0 && action === "rest") return state;

  let damage = role.attack; let received = battle.intent.damage; let health = state.health;
  const essence = action === "rest" ? Math.min(state.maxEssence, state.essence + 3) : state.essence - cost;
  const flags = action === "blooddemon" ? unique(state.flags, "血魔蛊已用") : state.flags;

  // ── 月光蛊 / 血刃蛊（强化后攻击×2）──
  if (action === "blood" && state.flags.includes("血刃蛊")) damage = role.attack * 2;

  // ── 剑鸣蛊：先自伤 2，再造成 10 伤害 ──
  if (action === "sword") {
    health -= 2;
    if (health <= 0) return finishBattle({ ...state, essence, flags }, battle, false, health);
    damage = 10;
  }

  // ── 回春蛊：恢复 7 生命，不造成伤害 ──
  if (action === "heal") {
    damage = 0;
    health = Math.min(state.maxHealth, health + 7);
  }

  // ── 血魔蛊：6 伤害 + 恢复 6 生命 ──
  if (action === "blooddemon") {
    damage = 6;
    health = Math.min(state.maxHealth, health + 6);
  }

  // ── 惑心蛊：造成 ATK 伤害，敌人行动完全无效 ──
  if (action === "charm") {
    const enemyHealth = battle.enemyHealth - Math.min(damage, battle.enemyHealth);
    if (enemyHealth <= 0) return finishBattle({ ...state, essence, flags }, battle, true, health);
    const turn = battle.turn + 1; const pattern = patternFor(battle.enemyName);
    return { ...state, health, essence, flags, battle: { ...battle, enemyHealth, turn, intent: pattern[turn % pattern.length] } };
  }

  // ── 甲衣蛊 / 血甲蛊（强化后免全伤）──
  if (action === "armor") {
    if (state.flags.includes("血甲蛊")) { damage = 1; received = 0; }
    else { damage = 1; received = Math.max(0, received - 3); }
  }
  if (action === "rest") damage = 0;

  const reflected = battle.intent.reflect ? damage : 0;
  if (battle.intent.invulnerable) damage = 0;
  received += reflected;
  const enemyHealth = battle.enemyHealth - Math.min(damage, battle.enemyHealth);
  if (enemyHealth <= 0) return finishBattle({ ...state, essence, flags }, battle, true, health);
  health -= received;
  if (health <= 0) return finishBattle({ ...state, essence, flags }, battle, false, health);
  const drainedEssence = Math.max(0, essence - (battle.intent.essenceDrain ?? 0));
  const turn = battle.turn + 1; const pattern = patternFor(battle.enemyName);
  return { ...state, health, essence: drainedEssence, flags, battle: { ...battle, enemyHealth: Math.min(battle.enemyMaxHealth, enemyHealth + (battle.intent.heal ?? 0)), turn, intent: pattern[turn % pattern.length] } };
}
export function resolveEnding(state: GameState) {
  const explicit = state.flags.find((flag) => flag.startsWith("结局:"))?.slice(3);
  if (explicit && explicit in endings) return explicit;
  if (state.time >= 4) return "trapped";
  return "lone";
}
