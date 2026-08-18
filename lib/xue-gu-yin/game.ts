export type RoleId = "healer" | "swordsman" | "heir";
export type AllyId = "zhao" | "ji" | "xue" | "su" | "qiao";
export type RouteId = "zhao" | "ji" | "xue" | "su";
export type GuAction = "blood" | "armor" | "blooddemon" | "rest" | "heal" | "sword" | "charm";
export type EnemyAction = { id: string; damage: number; cue: string; heal?: number; invulnerable?: boolean; reflect?: boolean; essenceDrain?: number };

export type Role = { id: RoleId; name: string; gender: "male"; title: string; description: string; maxHealth: number; maxEssence: number; attack: number; signatureGu: string; sense: "high" | "normal" };
export type Effect = { health?: number; maxHealth?: number; essence?: number; maxEssence?: number; time?: number; flag?: string; flags?: string[]; ending?: string; trust?: Partial<Record<AllyId, number>>; route?: RouteId; randomFlags?: string[] };
export type Choice = { id: string; label: string; next: string; result?: string; requires?: { route?: RouteId; flags?: string[]; allyTopTwo?: AllyId }; effect?: Effect };
export type BattleConfig = { enemyName: string; enemyHealth: number; victoryNext: string; defeatNext: string; victoryFlag?: string; defeatFlag?: string };
export type GameState = { roleId: RoleId | null; sceneId: string; route: RouteId | null; health: number; maxHealth: number; essence: number; maxEssence: number; time: number; flags: string[]; trust: Record<AllyId, number>; battle: Battle | null; endingId: string | null };
export type Battle = BattleConfig & { enemyMaxHealth: number; turn: number; intent: EnemyAction };
export type Scene = { id: string; act: 1 | 2 | 3 | 4; node: number; chapter: string; title: string; text: string | ((state: GameState) => string); choices?: Choice[]; battle?: BattleConfig | ((state: GameState) => BattleConfig) };
export type Ending = { id: string; name: string; epitaph: string; text: string };

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

const routeName: Record<RouteId, string> = { zhao: "赵黎", ji: "纪清寒", xue: "薛逢", su: "苏莹" };
function routeText(state: GameState, content: Record<RouteId, string>) { return state.route ? content[state.route] : "墓道在身后轰然断裂。你尚未看清同行之人的面孔，只能循着血腥气继续向前。"; }

export const scenes: Record<string, Scene> = {
  gate: {
    id: "gate", act: 1, node: 1, chapter: "第一幕 · 聚 · 节点 1 / 1", title: "夜雨墓门",
    text: "荒原之夜，淫雨霏霏，入夜以来便不曾停歇，带着几分蚀骨的寒意。\n\n散集后的蛊市早已空无一人，墓门前仅余下五名衣装各异的修士。\n\n为首的中年男子身着灰袍，自称乔无咎。他面色平静地将半张泛黄的兽皮地图在雨幕中缓缓摊开，指尖微凝，轻点在图中一处猩红如血的标记上，沉声道：\n\n“诸位道友，此地荒原之下，埋着昔日一位五转蛊修的坐化之地。”\n\n雨声肆虐，漆黑的夜色下却顿时响起几声压抑的沉重呼吸。\n\n“五转蛊修……”\n\n乔无咎扫了众人一眼，似笑非笑道：“在蛊道一途，能将本命蛊炼至第五转者，无一不是手段通天的老怪物。这等前辈高人坐化留下的洞府秘宝，自然是见者有份。”\n\n你伫立在队伍偏后位置，一手始终隐蔽地按在腰间那枚祖传旧玉之上。\n\n这枚平时冰冷异常的旧玉，此刻竟在掌心下微微发烫，隐隐透出一丝温热之意。仿佛墓门深处有着某种与其同源的力量正被遥遥唤醒，又似玉中封印的半缕残存气息，正试图挣脱羁绊。\n\n“见者有份？”\n\n不远处，一名倚靠在青石旁把玩血纹蛊虫的少年忽地冷笑开口。\n\n这少年唇红齿白、眉目俊秀，可一开口，嗓音却苍老刺耳，干枯如风干的树皮，与那张年轻的面孔格格不入。他说话间，指尖那只蛊虫微微蠕动，通体猩红，伸出细长口器贪婪地吞噬着雨幕中弥漫的稀薄血气。\n\n“老夫活了这把年纪，”那少年，也就是赵黎，慢条斯理地将蛊虫收回袖中，阴测测道，“只信两样东西——手里的蛊，和拿蛊的那只手。”\n\n距其数尺之外，一名白衣女修怀抱长剑，傲立雨中。剑未出鞘，周身却隐隐散发着令人不愿靠近的凛冽剑意。任凭雨水沿着鬓角滑入领口，她连眉头都不曾皱上一皱，更无半点与旁人攀谈的意思——正是清冷如冰的纪清寒。\n\n“嘿嘿，我等散修在外讨生活，本就维艰！”\n\n一名圆脸中年汉子凑上前，笑嘻嘻地拱了拱手。此人名唤薛逢，满面堆笑，口中翻来覆去念叨着“散修互相照应”的客套话。但他那双小眼里精光闪烁，视线不断在其余几人的储物袋与要害处打量，显然并非表面这般憨厚无害。\n\n至于你身旁那道矮小瘦弱的身影，则是一名叫做苏莹的低阶女修。她自始至终低垂着头，不发一言，只用白皙纤细的手指在潮湿的泥土上一笔一画地描摹着墓门上的古怪蛊纹。她动作极慢，唇角极轻微地蠕动着，仿佛在暗自念诵某种晦涩难懂的古咒，又似生怕描错一丝纹路，惊醒了门后蛰伏的凶物。\n\n乔无咎将兽皮地图收回袖中，朝众人略一拱手：“时候不早了。此去凶险未知，进墓之后，各凭本事，自求多福。”\n\n话音未落，他已率先跨入那道漆黑如墨的石门，身姿转瞬间便被浓重的黑暗吞没。\n\n赵黎在迈步前，突然隔着雨幕斜斜朝你的方向打量了一眼。那眼神看似随和，却夹杂着几分看猎物般的阴鸷，令人脊背发凉。\n\n你按紧掌心发烫的旧玉，暗自运转真元，抬脚跟了上去。",
    choices: [
      { id: "jade", label: "旧玉发烫，你不动声色地把它攥进掌心，只当没察觉", next: "swarm", result: "旧玉在掌心越发灼热，隐隐有一股微弱的神识波动自门后透出，仿佛正隔着虚空与你遥遥对视。你面不改色，借着袖袍遮掩将旧玉攥得更紧了三分，体内真元悄然流转，只当浑然不知。这等异象愈是剧烈，你便愈发确定——这座看似寻常的蛊修大墓深处，定然藏着某种与你这枚旧玉有着莫大渊源的至宝。", effect: { flag: "旧玉发烫" } },
      { id: "observe-su", label: "你落后半步，恰好听清苏莹对着墓门念出的最后几个音节", next: "swarm", result: "你故意放缓脚步落后了半步，凝神细听，恰好捕捉到了苏莹口中吐出的最后几个极微弱的音节。那发音晦涩古朴，绝非当世通用的语言，反倒似某种失传已久的祭祀古咒。苏莹似乎警觉地察觉到了你的注视，指尖猛地一顿，随即装作若无其事地加速划动，试图将刚才的失态遮掩过去。", effect: { flag: "苏莹低语" } },
      { id: "enter", label: "你垂下眼，随着乔无咎的背影第一个跨进墓门", next: "swarm", result: "你眼神微敛，收敛周身气息，紧随着乔无咎的脚步径直跨入了漆黑的墓门。石门合拢的刹那，身后肆虐的雨声被瞬间隔绝。墓道内阴气森森，刺骨的寒意直往骨头缝里钻，连呼出的白气都仿佛要冻结成冰。你心知肚明，踏出这一步，便再无退路可言。" },
      { id: "insight", label: "你扫过五人散乱的站位，心里忽然浮起一念——这墓门的生门，似不止一个", next: "swarm", result: "你凭借着异于常人的强大神识，暗中将五人看似散乱的站位尽收眼底，心头忽地闪过一丝明悟——这墓门前的禁制生门竟然并非唯一！整座墓门仿佛一副早已布好的杀局棋盘，只等旁人误入其中。乔无咎的站位占据阵眼，赵黎卡住死角，甚至连冷傲的纪清寒都恰好踏在变数之位上。看清这暗藏的杀机后，你心中不由泛起一股刺骨的寒意。", requires: { flags: ["高神识"] }, effect: { flag: "识破棋局" } },
    ],
  },
  swarm: {
    id: "swarm", act: 2, node: 1, chapter: "第二幕 · 入 · 节点 1 / 6", title: "甬道蛊潮",
    text: "深入墓穴不过百余步，前方的石道便骤然收窄。\n\n手中的火折子只能驱散三丈内的黑暗，再远之处便是一片粘稠如墨的漆黑，仿佛这暗无天日的古墓正张开血盆大口，蚕食着一切光亮。石壁上布满了密密麻麻的潮湿凿痕，一层叠着一层，倒像是无数困死此地的修士用指甲强行撕挠出来的血痕。\n\n走在最前方的乔无咎脚步极为规律，每一步迈出都分毫不差——这绝非初次闯入险境的散修该有的表现。\n\n你紧跟其后，中间隔着赵黎、苏莹与纪清寒，而那圆脸的薛逢则战战兢兢地负责殿后。一队人挤在这狭窄阴冷的甬道中，摇曳的火光将几人的影子拉扯扭曲，交织在一处，难以分清彼此。\n\n“咔嗒，咔嗒……”\n\n变故生得毫无预兆。\n\n最先出现异常的是头顶上方。石壁间斑驳的接缝深处，传出一阵令人牙酸的摩擦声，细密而绵长，犹如整面石墙内部有成千上万只害虫在同时翻动。\n\n你眉头一皱，微微抬高火折子，只见缝隙中竟挤满了拇指大小、通体漆黑的蛊虫。虫壳上泛着一层湿漉漉的恶心油光，正争先恐后地从中挣扎挤出。\n\n不过弹指功夫，这零星的散虫便化为了滔天黑浪！\n\n千万对薄翅同时振动，汇聚成一股低沉刺耳的嗡鸣声，震得人心神摇曳，耳朵发胀。黑色的虫潮从四面八方的缝隙中喷涌而出，顷刻间漫过石阶，淹没脚踝，朝着膝盖攀爬蔓延。\n\n乔无咎将火折子向后一递，神色依旧波澜不惊：“此乃‘噬魂蛊’，极喜血腥之气。诸位若不想沦为这群毒物的食粮，便收敛好气血，切莫教真元外泄或受一点皮外伤。”\n\n话音未落，他竟身形一晃，轻巧地向后撤出两步，负手而立，径直将前路让给了铺天盖地的虫潮。火光将其身姿投射在墙壁上，拉出一道诡异瘦长的阴影，如同一具冰冷的傀儡。\n\n“乔道友说得倒轻巧。”\n\n赵黎沙哑苍老的笑声从旁传来。他袖袍微一挥动，那只血纹蛊虫便呼啸而出，围绕着他周身盘旋飞舞，划出一道微弱的血光圆环。\n\n虫潮撞击在血光边缘，如遭重创，纷纷退避三分；几只避之不及的噬魂蛊被血光扫中，瞬间周身燃起幽绿火焰，眨眼化为飞灰。赵黎脚下方圆三尺之地干净无比，犹如惊涛骇浪中的一座孤岛。他垂下眼帘，漫不经心地催动真元，仿佛只是在摆弄一件微不足道的法器。\n\n他有如此秘术自保，你却不敢有丝毫大意。\n\n队伍大乱之下，你与纪清寒被激流般的虫潮逼到了石壁边缘。忽地，一条隐藏在暗处、布满倒刺的毒藤猛然缠住你的脚踝，倒刺刺破衣衫，传来一阵冰冷的麻木感。\n\n你刚欲催动真元斩断毒藤，一道凌厉无匹的剑芒已然贴着你的裤腿掠过——正是纪清寒出手！\n\n剑气过处，毒藤应声而断，力道控制得极巧，未伤及你分毫皮肉。与此同时，一道黑影自上方暗处电射而出，直扑纪清寒纤细的后颈，竟是一只剧毒无比的黑甲毒蝎！\n\n你眼神一凝，几乎出于本能地并指一弹，一道月白色的弧光破空而去——正是‘月光蛊’发动！\n\n“噗”的一声轻响，月刃精准地将那毒蝎钉死在砖缝之中。\n\n纪清寒侧过头看了你一眼，清冷的目光中泛起一丝波澜，但并未言语，转过身继续挥剑开路。只是那森寒的剑尖，隐隐向你身侧倾斜了少许，替你分担了大半压力。\n\n“退！快往后退！”\n\n薛逢尖锐刺耳的惊叫声在甬道内回荡。他被虫潮逼得面如土色，手忙脚乱地在石壁上乱抓，抓满了一手的恶心蛊虫，又如触电般疯甩开去，摔得狼狈不堪，险些栽倒在虫潮之中。\n\n慌乱间，薛逢连连倒退，狠狠撞向了一旁的苏莹。\n\n此时的苏莹也在艰难地催动一只寻常的防守蛊虫，弱小的光罩在汹涌的黑潮面前摇摇欲坠。她整个人被冲得节节败退，看起来比薛逢还要不堪——然而你多留意了几眼，便赫然发现：\n\n她退了这许多步，周身衣衫竟连半点破损都没有！那些看似凶猛扑向她的噬魂蛊，每每在落到她身上的前一刻，都会莫名其妙地偏移方向，仿佛被某种无形的力量悄然避开。\n\n似乎察觉到了你的窥探，苏莹催动蛊虫的手法瞬间变得更加混乱，急于将自己藏匿在众人身后。借着微弱的火光，你分明看见她低垂的睫毛剧烈颤抖，薄唇微动，似乎在默念着什么。",
    choices: [
      { id: "shout-xue", label: "回身朝薛逢喝道：“别退，贴壁走！”", next: "shadow", result: "你收敛真元，回身低沉断喝：“别退，贴壁走！运真元附背，贴紧石壁！”薛逢吓得浑身一抖，出于求生本能死死贴住石壁。说来也奇，那涌动的虫潮顺着石壁的弧度竟绕开了他的身体，顺势向前涌去。薛逢愣了半晌，这才如梦初醒般长舒一口气，朝你挤出一个比哭还难看的讨好笑容，连连拱手。几步之外的赵黎见状微微皱眉，冷哼了一声，显然对你多管闲事、扰了他观蛊的兴致极为不满。", effect: { trust: { xue: 1, zhao: -1 } } },
      { id: "shift-ji", label: "与纪清寒错身换位，堵住她身侧的空当", next: "shadow", result: "你脚下步法一变，身形如风般与纪清寒错身而过，顺势挡在她身侧的防守死角，手中月光蛊不断激发，替她挡下了侧后方扑来的密集蛊虫。纪清寒薄唇微张，似乎道了一句无声的“多谢”。有你护住死角，她再无后顾之忧，手中剑蛊催动到极致，一道道凌厉的寒芒将迎面而来的黑潮强行撕裂。被挤到队尾的薛逢左支右绌，眼中除了惶恐，看向你二人的眼神中更添了几分阴鸷与嫉恨。", effect: { trust: { ji: 1, xue: -1 } } },
      { id: "observe-all", label: "按住旧玉，任蛊潮从身侧绕开，静静观察众人", next: "shadow", result: "你悄然将一缕真元注入腰间旧玉，原本斑驳暗淡的旧玉表面忽地散发出一股幽微的光晕。令人惊异的是，凡是被这股光晕笼罩的噬魂蛊，竟如遭雷击般瞬间僵死落地，其余蛊虫更是如见天敌，纷纷惊恐地避开你身周三尺。顷刻间，你周围便清理出一片空地。远处的赵黎将这一幕尽收眼底，目光在你掌心的旧玉上停留了片刻，嘴角勾起一抹玩味的邪笑；而缩在后面的苏莹则是脸色微微一变，看你的眼神多了几分忌惮。", effect: { trust: { zhao: 1, su: -1 } } },
    ],
  },
  shadow: {
    id: "shadow", act: 2, node: 2, chapter: "第二幕 · 入 · 节点 2 / 6", title: "血影示警",
    text: "蛊潮退去得突兀，来得凶猛，去得却极快。\n\n刺耳的翅鸣声如潮水般渐渐隐去，脚下密密麻麻的黑色死虫堆积成厚厚一层，踩上去发出“咔嚓、咔嚓”令人牙酸的碎裂声。\n\n空气中弥漫着腥臭与腐臭混合的恶味。黑潮褪去后，仍有数只命大的“噬魂蛊”残躯在死虫堆里微微抽搐，划出微弱的摩擦声，衬得阴冷的甬道愈发死寂。只听见薛逢靠在石壁上粗重的喘息声——他惊魂未定地擦拭着额头冷汗，嘴里不住咕囔着“侥幸，真是侥幸……”。\n\n赵黎伸手一挥，那只血纹蛊虫便如一道微红流光钻回其袖中，他脚下原本干净的空地瞬间被后方坍塌的虫尸掩埋。\n\n纪清寒锵然一声将手中长剑归鞘，剑尖不经意地在砖缝处那只被月光蛊刺穿的毒蝎残壳上轻磕了一下。她脸色冷淡，并未多言；你亦保持沉默，只低头打量了一下裤脚——先前纪清寒那一剑精准无比，割破布料却毫未伤及皮肉分毫。\n\n你刚欲抬头，手中的火折子忽地闪烁了一下。借着幽暗交错的光影，你眼角余光骤然瞥见侧方石壁上有一道诡异的影迹正在缓缓挪动。\n\n那影迹毫无固定轮廓，倒像是一团在石缝间缓缓渗开的湿润朱砂血迹，不着地，亦不上顶，贴着坚硬的石壁一尺一尺向内蠕动。\n\n你微缩瞳孔，死死盯了那血影两息。那团血痕竟似有所感应般，戛然而止。那绝非死物或寻常阵法留下的痕迹，反倒像某种隐匿在石墙深处、没有面目的邪物，隔着万斤巨石正冷冷向你窥探！\n\n“诸位道友，都在看什么呢？”\n\n赵黎那沙哑苍老的声音毫无征兆地在耳畔响起。不知何时，他已悄然滑步至你身侧，顺着你的视线扫了一眼墙上的血影。他眉梢微微一挑，面上并无惊惧，反倒透出几分早已料到的阴狠与了然。\n\n他的目光在血影上短暂停留了一瞬，随即便缓缓下移，如刀子般落在了你腰间那枚隐隐泛着温热的旧玉上。\n\n“小子，”赵黎忽地咧嘴一笑，“你腰间这块玉……借老夫瞧瞧如何？”\n\n你面色不变，体内真元无声运转，并未接话。\n\n赵黎见状也不强求，只是嘿嘿低笑道：“一会儿进了深处若是不幸殒命，这玉便归老夫所有，咱们提前说好。”\n\n这话说得直白而阴森。旁边的薛逢倒吸一口凉气，张了张嘴似乎想干笑着打个圆场，可对上赵黎那冰冷如蛇毒般的眼神，硬生生将话咽了回去，缩着脖子朝纪清寒那边挪了数步。\n\n就在气氛凝重至极时，纪清寒清冷的声音突然打破了僵局。她几步跨至你侧前方，长剑抱于胸前，神情淡漠道：“此地的古禁机关留有生门痕迹，阵法结构颇为古怪……倒不像为了防备外敌闯入，反而像是留在等什么人似的。”\n\n她这话看似是对着石壁而言，未看任何一人，但场中皆是心思缜密之辈，如何听不出她是在暗中为你解围，强行将赵黎试探旧玉的话题转移开来。\n\n赵黎闻言，眼中的邪异之色更浓了三分：“生门？等什么人？”他将这两个字在齿缝间咀嚼了一遍，意味深长道：“老夫倒也想知道……这位几百年前坐化的五转大能，究竟在等什么人？”\n\n赵黎此言看似向纪清寒发问，那充满疑虑与杀气的余光，却直勾勾地扎向了不远处的苏莹。\n\n苏莹身形微震，原本正绞着袖口的纤小手指猛地一紧，脸色瞬间惨白了少许，但很快又强行镇定下来，咬紧牙关不吐一字。\n\n一直靠在前方石壁上的乔无咎此时轻咳了一声，悠然开口：“好了，诸位道友莫要疑神疑鬼。一道残存的血影禁制罢了，并不伤人，还是抓紧时间探墓为妙。”\n\n这话听起来像是在劝和，却又透露出几分掌控局势的从容，令人摸不清他的底细。\n\n甬道内再次陷入压抑的死寂。昏暗的火光忽明忽暗，将众人的面孔映照得半明半暗。石壁上那团朱砂血影凝固在古怪的暗纹前，仿佛也在耐心地等待着答案。\n\n赵黎在等你的回应，纪清寒在看你是否领情，苏莹在防备你出声质问——所有人的目光隐隐聚焦在你身上，而你袖中按着的旧玉，温度又骤然升高了几分！",
    choices: [
      { id: "refuse-zhao", label: "垂下眼，把旧玉按回袖中", next: "chamber", result: "你眼神沉敛，并未开口理会赵黎的言语挑衅，只是暗中调动真元，顺势将发烫的旧玉推入袖袍深处，指腹紧紧贴着那股惊人的灼热。赵黎盯着你看了良久，脸上的阴邪笑意渐渐淡去，半晌才幽幽道：“……藏得深也好。”他没再追问，只是指尖的血纹蛊虫转了一圈，似在暗中记下这一笔。纪清寒虽未出声，却在侧身时微不可察地朝你微微颔首——只要你守口如瓶，她便不会追查你的机缘。唯有苏莹在你藏玉的瞬间飞快扫了你的袖口一眼，转瞬又低垂下头去。你暗自握紧掌心，指节微白。", effect: { trust: { zhao: -1, ji: 1 } } },
      { id: "ask-ji", label: "压低声，顺着“生门”两个字追下去", next: "chamber", result: "你收敛气息，压着声线，把“生门”两个字接下去：“等谁？”纪清寒默然许久，久到周围人以为她不会作答时，她才极轻地补了一句没头没尾的话。那句话像一粒冰落进心里，却慢慢化开成一扇门的轮廓。赵黎在数步外似有所觉，眉梢微挑，抱着双臂如在看戏；苏莹的娇躯则几不可察地微微颤抖了一下，绞着袖口的手指陡然收紧，似被那句话戳中了隐藏最深的痛处。没有人再开口，甬道里只余那道血影，还停在暗纹前，等着这句问答的余音散尽。", effect: { trust: { ji: 1, su: 1 }, flag: "生门低语" } },
      { id: "ask-su", label: "转向苏莹，轻声问她墓主在等什么人", next: "chamber", result: "你蓦然转头，双目如电般盯紧苏莹，开门见山地轻声质问：“苏道友，这墓主究竟在等什么人？”苏莹浑身一颤，娇小的身躯几乎站立不稳，咬着下唇半晌，才吐出几个微弱如蚊蚋的字节。从她那惊恐莫名的神色中，你瞬间断定：她绝对知晓这大墓真正的秘密，只是不能说，也不敢说！赵黎见状嘿嘿低笑了一声，看你的目光中多了几分对胆大妄为者的赏识；纪清寒则秀眉微皱，略带不悦地将视线移回墙上的血影。你这一问犹如投石入井，让整座大墓暗流汹涌的局势愈发难以预测。", effect: { trust: { su: 1, zhao: 1, ji: -1 }, flag: "活符低语" } },
    ],
  },
  chamber: {
    id: "chamber", act: 2, node: 3, chapter: "第二幕 · 入 · 节点 3 / 6", title: "机关暗室",
    text: "最先察觉异样的是你的双耳。\n\n头顶上方骤然传来极轻微的“咔嚓”一声，犹如某块千斤巨石的悬空平衡被瞬间打破。下一刻，脚下的坚硬石板毫无征兆地轰然塌陷！\n\n剧烈的失重感兜头泼下，慌乱间手中的火折子脱手飞出，在无尽的黑暗中划出一道刺目的抛物线，瞬间不知坠向何方。\n\n风声呼啸，泥尘四起。你在半空中急促运转真元，双手护住头脸要害，背部狠狠撞在一块凸起的花岗岩上，借力翻滚了数圈，这才在漫天呛人的灰尘中硬生生稳住身形。\n\n周围的黑暗中顿时乱成了一锅粥。\n\n薛逢摔得狼狈不堪，连滚带爬地挣扎着站起，一边狼狈拍打着身上的泥土，一边带着哭腔尖叫：“火折子！谁还有火折子！”\n\n赵黎落地时衣摆飘飘，双手负于身后，面色阴沉如水，仿佛早已料到脚下有此一劫；纪清寒则是单膝跪地，手中未出鞘的寒铁长剑在石板上猛地一撑，便顺势潇洒站起。她冰冷的眼眸在暗中扫过，恰好与你的视线撞在一起，随即又若无其事地移开；\n\n“呼。”\n\n几息之后，微弱的火光再次亮起。乔无咎不知何时已将脱落的火折子捡回，拿在手中，微弱的光晕沿着周围冰冷的墙壁一点点蔓延荡开。\n\n这是一间极其隐蔽的黑色暗室。\n\n四周的石壁上密密麻麻刻满了猩红如血的古老蛊纹，从地面一路盘旋蔓延至穹顶，纵横交错，远远看去竟如活人的血管一般在石壁深处微弱鼓动！\n\n暗室正中央立着一座三足青铜石鼎，鼎口边缘凝固着一层厚厚苍白与黑红交织的血垢，散发着一股浓郁到令人发呕的陈腐甜腥味——宛如曾有人在这幽闭之地，耗费了无数修士的鲜血养育过某种极为可怖的凶物。\n\n“这些古符纹……”\n\n苏莹的声音细若蚊蚋，带着几分抑制不住的颤抖。不知何时她已悄然挪到墙边，指尖悬在血色蛊纹上方寸许，不敢贸然触碰，只是死死盯着那些蛊纹，脸色以肉眼可见的速度变得煞白。\n\n“是活的……这些血纹还在蠕动！”\n\n你眉头微皱，顺着她的指尖望去，只见石壁上的那些暗红蛊纹确实在极其缓慢地蠕动——犹如浸入水中的浓墨，在火光的映照下忽明忽暗地扭曲、弥散、再收缩。\n\n随即，你的目光落在了暗室最深处的墙角。\n\n那里立着一座古朴的石龛，封印着五只拳头大小的奇异蛊卵。蛊卵外层包覆着厚厚的千年冰玉，各自散发着强弱不一的凶煞蛊息，卵壳下透出的微光宛如五双沉睡的眼睛，隔着冰玉与你无声对视。\n\n是你最先撞见它们的——它们藏得并不算深，只是这暗室中诡异的活物太多，无论是血纹、石鼎还是古符，都分散了众人的注意力。直到你的目光扫过，那五团沉寂的光芒才如同苏醒的猛兽般，齐刷刷睁开了双眼！\n\n“见者有份。”乔无咎冷眼扫过石龛，语气依旧平淡，“谁先发现的，便由谁先挑。”\n\n赵黎闻言，嘴角勾起一抹残忍的嘲讽：“五只蛊卵，三只认主，两只挑人？嘿嘿，老夫倒真想看看，这几百年前的大墓究竟想给谁下套。”\n\n他话语说得漫不经心，一双鹰隼般的眼睛却在众人脸上逐一扫过，在苏莹身上格外多停留了片刻。\n\n薛逢见状咽了口唾沫，贪婪地往前凑了半步：“既然见者有份，那薛某……”\n\n“哼！”赵黎冷哼了一声，一道冰冷的视线如利刃般扎过去，顿时吓得薛逢把后半句话咽回肚子里，讪讪地缩回了脚，但那双小眼睛却死死黏在蛊卵上，怎么也移不开。\n\n纪清寒一言不发，甚至连看都未看那五只蛊卵一眼，只是一只手紧握剑柄，美眸死死戒备着石壁上那些“活”着的血色蛊纹。\n\n苏莹站在石龛前，低垂着头，纤指在袖口内死死绞在一起。她不敢抬头看那些蛊卵——仿佛早已料到里面封印着什么禁忌之物。\n\n“还愣着做甚？”乔无咎催促道，“规矩如此，你既先看到，便由你先选。”\n\n五只蛊卵静静躺在石龛中，吞吐着奇异光芒。你运转真元逐一感应过去——唯有一只甲纹森森、一只血芒吞吐的蛊卵，与你体内的真元产生了一丝极其微弱的共鸣与呼应；至于其余三只，任凭你如何用真元试探，都如死物般毫无回应，显然是在等待别的“有缘人”。\n\n赵黎的冷笑、薛逢的贪婪、苏莹的惶恐，以及纪清寒的戒备，瞬间全部集中在你的身上。石龛里的光芒微微闪烁，仿佛也在静候你的抉择。",
    choices: [
      { id: "take-armor", label: "伸手取那枚甲纹森森的蛊卵", next: "illusion", result: "你不再犹豫，探手将那枚甲纹森森的蛊卵抓入手中。冰玉触感极凉，上面的表皮纹路犹如密密麻麻的精钢甲片，刚一接触你的真元，竟如活物般微微蜷缩，主动吸纳你的气息。你顺势将其收入蛊囊，腰间原本护体的“甲衣蛊”顿时微微震颤。赵黎在旁冷哼了一声；乔无咎神色平静；唯有苏莹在你收蛊的刹那，飞快瞥了你一眼，又垂下眼去。卵壳里的光，在你合上蛊囊的刹那，悄然暗了下去。", effect: { flag: "血甲蛊" } },
      { id: "take-blade", label: "伸手取那枚血芒吞吐的蛊卵", next: "illusion", result: "你探出右手，径直抓向那枚血芒吞吐的蛊卵。蛊卵入手微温，冰玉之下竟隐隐传来犹如心脏跳动般的律动，一下又一下敲击着你的指腹。你顺手将其纳入蛊囊，原本温驯的“月光蛊”光芒骤然黯淡，仿佛被这股强悍的血腥杀伐之气强行压制。赵黎的视线在你的蛊囊上扫过；薛逢贪婪地咽着唾沫。新蛊入囊，你已能清晰感觉到，它正在你真元的温养下慢慢展现锋芒，缓缓盘成一线锋刃的形状。", effect: { flag: "血刃蛊" } },
      { id: "yield-su", label: "把先手让给苏莹，让她先挑", next: "illusion", effect: { trust: { su: 1 }, flags: ["活符低语"], randomFlags: ["血甲蛊", "血刃蛊"] } },
    ],
  },
  illusion: {
    id: "illusion", act: 2, node: 4, chapter: "第二幕 · 入 · 节点 4 / 6", title: "迷魂阵",
    text: "踏出甬道的瞬间，周遭温度骤降，阴寒蚀骨。\n\n眼前的石殿比此前阔绰数倍，四壁空旷凄清，唯有中央耸立着一座丈许高的黑色石台。石台表面雕刻着密密麻麻的猩红蛊纹，一层叠着一层，几无立足之地，宛若有人以此处为祭场，用鲜血反复涂抹了千百年一般。\n\n在火折子微弱的光芒照耀下，那些暗红纹路如活物般微微亮起，随众人的呼吸吞吐一明一灭，古怪至极。空气中弥漫着一股浓郁甜腥的奇香，初时若有若无，等你觉察时早已侵入经络。\n\n你心中警兆大作，刚欲调动真元封闭呼吸，脑海中便已传来一阵剧烈的眩晕感——这蛊香竟能穿透心神！\n\n下一刻，眼前的场景骤然扭曲破裂——石殿、火光、同行众人尽数烟消云散。\n\n你恍惚间伫立在一处旧宅檐下，滂沱大雨初歇，檐角残雨滴沥，院中那株老槐树被洗得碧翠发亮，空气中混杂着泥土与青草的味道。\n\n檐下站着一道熟悉的身影，正是记忆深处那个总唤你小名的青梅竹马。她眉眼弯弯，眼角那颗小痣与当年分毫未变。\n\n你一步步走近，甚至能嗅到她身上那股淡淡的皂角清香，能看清她朝你递出的那只带有薄茧的纤纤玉手。你理智中分明清楚当年那棵老槐树早已枯死、旧宅早已化为灰烬，可那抹红尘执念依然诱使着你伸手去握……\n\n“道友！”\n\n一声宛如剑鸣般的清冷娇喝如惊雷般在脑海中炸响！眼前的温情画面如镜花水月般寸寸崩塌。\n\n你心神剧震，猛地清醒过来。\n\n眼前哪里有什么旧宅老树，分明仍是那座阴森凄冷的石殿！而你手里死死按着的，更非昔日故人，而是纪清寒那冰凉纤细的手掌。\n\n纪清寒显然也刚脱离心魔幻境，美眸中杀机未退。感知到被你紧紧握住的手掌，她那白皙如玉的耳根瞬间泛起一层绯红，本能地想要抽回，却又生生僵住；而她的另一只手已然按上长剑，寒芒出鞘半寸，锋锐无匹的剑尖死死指向数步之外的薛逢——幻境初破，她一时间竟未能分清周遭是现实还是幻象。\n\n“诸位道友，速速收摄心神。”\n\n乔无咎那波澜不惊的声音自阵眼方向传来。不知何时，他已退至石台边缘，手法熟练无比地将一枚暗红蛊印连续扣入石壁大阵的枢纽之中。\n\n随着一道轻微的碎裂声，弥漫殿内的幻境应声瓦解。\n\n他破阵之熟练、解印之迅捷，简直如同照本宣科，甚至其周身真元毫无波动，显然自始至终未曾沉沦于幻象半分！这等非凡手段与诡异举动，让你心中的戒备与疑虑又加深了几分。\n\n借着恢复的光亮，你暗中凝神打量其余几人的惨状：\n\n赵黎面色难看地矗立原地，掌心那只血纹蛊虫正失控般乱舞盘旋，过了数息才被他强行以真元镇压收回。他眼中那一抹罕见的惊恐转瞬即逝，眨眼又恢复了惯常的阴沉与漫不经心；\n\n薛逢则显得滑稽可笑，双手对着空气胡乱抓挠，面露贪婪疯狂之色，口中不住嚷嚷着“皆是薛某的极品蛊晶”；\n\n而侧方的苏莹正贴着石壁微弱喘息，薄唇蠕动间吟诵着半句古老晦涩的旧咒，清秀的眼角隐有泪痕滑落，自己却浑然察觉。\n\n乔无咎破除完剩余阵眼，转过身来，火光照亮了他大半张脸：“幻阵已破，诸位若无大碍，便继续前行吧。”\n\n薛逢第一个回过神来，讪讪擦去嘴角涎水，干笑道：“好厉害的古禁……薛某适才竟看见满殿异宝，实在见笑。”他说着，往纪清寒身边靠了靠：“纪道友无事吧？”\n\n纪清寒并未理会他，长剑依然未全归鞘，清冷的目光平静却具压迫感地锁定着薛逢，似在逼其露出马脚。赵黎在旁冷眼旁观，嘴角挂着玩味的邪笑；苏莹则低垂着头，飞快用袖口拭去眼角泪痕。\n\n幻境虽破，众人心中的猜忌与防备却推到了顶点。\n\n纪清寒剑尖悬空，薛逢假笑挂面，赵黎暗藏杀机，而你的指尖……依然能清晰感知到纪清寒掌心残留的那一层细密冷汗。\n\n半晌后，纪清寒终于如梦初醒般抽回了手，偏过头去，只留给你一抹泛红的侧脸与通红的耳根。\n\n石台中央的猩红蛊纹依然随着阵法残存真元一明一灭。自踏入古墓以来，虫潮、血影、蛊卵、幻阵……一环扣一环，犹如一张早已铺张开来的惊天杀局。\n\n你暗中握紧袖中旧玉，心中暗自冷哼：这局死棋，究竟是谁在执子？",
    choices: [
      { id: "hold-ji", label: "抬手按住纪清寒的剑柄，对薛逢摇了摇头", next: "puppets", result: "你沉吟片刻，抬手按在纪清寒出鞘的剑柄之上，朝她微不可察地摇了摇头，随即又淡然看向薛逢。纪清寒娇躯一震，感知到你掌心传来的沉稳真元，指尖紧绷的力道终于缓缓松开，并未追问原由——你这一按，把她从幻境的余韵里按回了当下。薛逢讪讪退后半步，脸上的谄笑瞬间僵硬，眼底闪过一丝狠戾。远处观望的赵黎冷哼一声，转身去查看石台蛊纹。唯独纪清寒垂下美眸，耳根的绯红久久未曾消退。", effect: { trust: { ji: 1, xue: -1 } } },
      { id: "ask-su", label: "若无其事地岔开话，问苏莹有无被阵法伤到", next: "puppets", result: "你面色如常地收回目光，主动打破僵局，转头询问苏莹方才可曾被幻阵反噬。苏莹如从梦魇中惊醒，有些失神地抬眼看你，半晌才应了一声，微弱地道了声谢——你这一问，恰好帮她掩饰了适才诵咒流泪的失态，她方才贴着石壁念旧咒、眼角带泪的模样，落在谁眼里都太扎眼。然而侧旁纪清寒的眼神却瞬间冷了下来，手握剑柄微微紧握，别过头去不再看你。薛逢趁机在旁大肆附和，反倒让气氛愈发古怪。", effect: { trust: { su: 1, ji: -1 } } },
      { id: "fix-ji", label: "沉默着替纪清寒把歪斜的剑穗扶正", next: "puppets", result: "你自始至终未发一言，只是神色泰然地伸出手指，替纪清寒将此前激战中歪斜的剑穗轻轻理顺。那剑穗早已染血磨损，在她紧握下略显凌乱。纪清寒娇躯微僵，耳根红晕更甚，紧握剑柄的玉手先紧后松，最终低低道了句“走吧”，将长剑缓缓还入鞘中——她没有道谢，可那柄剑还入鞘里的动作，比任何谢字都轻。远处的苏莹见状，眼底掠过一丝温和的笑意；赵黎则在阴暗处冷冷啐了一口，面露厌恶。", effect: { trust: { ji: 1, su: 1, zhao: -1 } } },
    ],
  },
  puppets: {
    id: "puppets", act: 2, node: 5, chapter: "第二幕 · 入 · 节点 5 / 6", title: "铜皮傀儡",
    text: (state) => {
      const base = "步出狭窄甬道，眼前的墓道骤然开阔，尽头是一处恢弘而幽暗的地下石坪。\n\n四周的石壁凿痕粗粝狂暴，宛如被通天巨能以蛮力硬生生掏空出来一般。石坪四角伫立着四具丈许高的铜皮傀儡，在火光照耀下，其胸前核心处的猩红蛊核同时亮起，死寂的机关关节处发出牙酸的摩擦声。\n\n“咔吧、咔嚓……”\n\n伴随着活蛊线的拉扯牵动，四具傀儡迈步上前，每踩一步皆令地面微微震颤，其周身散发的威压竟丝毫不弱于三转炼体蛊修！\n\n赵黎冷哼一声，抬手间真元催动血纹蛊，随手将一具逼近的傀儡硬生生轰碎，浑浊的眼眸微眯，阴森道：“这活蛊线牵引之法极其消耗神识，施术者定然就在这附近。”\n\n这句话声音不大，落在你耳中却字字如雷。\n\n乔无咎正昂首立于石坪中央，神色平淡如初，只云淡风轻地解释此乃墓主留下的常规守墓机关。\n\n你暗中逐一扫过石坪周围延伸出的五条深邃岔道，赫然发现乔无咎站立的位置极为讲究——他看似随意负手，却恰好不偏不倚地死死卡在了最像生门的那条通路前方，犹如早早在此恭候诸位入局。\n\n就在此刻，腰间旧玉再次爆发出一阵惊人的灼热，这一次，你没有再选择隐忍与遮掩，任由那股滚烫的气息在掌心隐隐沉浮。";
      if (!state.flags.includes("苏莹低语")) return base;
      return base + "\n\n苏莹不知何时悄然挪步至你身旁，纤细的手掌微张，递过一枚暗红色的温润丹丸。丹丸散发着淡淡的安神蛊息，正如她平日低头描绘古符时一般沉静。\n\n“含在舌下。”她声如蚊蚋，低垂着眼睫微弱道，“你若殒命于此……我欠下的那些债，便再无人替我还了。”\n\n你未曾迟疑，顺手将丹丸含入口中。刹那间，一股精纯温热的药力顺着四肢百骸流淌开来，不仅令周身损耗的真元迅速回升，甚至连腰间旧玉的惊人灼痛都被这股药力生生压制下了几分。";
    },
    battle: { enemyName: "铜皮傀儡", enemyHealth: 12, victoryNext: "fog", defeatNext: "fog", victoryFlag: "傀儡已毁", defeatFlag: "傀儡重伤" },
  },
  fog: {
    id: "fog", act: 2, node: 6, chapter: "第二幕 · 入 · 节点 6 / 6", title: "大雾迷踪",
    text: (state) => {
      const base = "石坪尽头的窄道涌出蛊雾，浓得化不开，灵识被压到不足三尺，连自己的脚尖都看不真切。乔无咎的声音从雾中飘来，说要绕后封住追兵——话音未落，人已没了声息。";
      const insight = state.flags.includes("识破棋局")
        ? "\n\n雾涌起来的刹那，你看见乔无咎的身影没有往追兵的方向去——他贴着石壁，拐进了一条连火光都照不进去的岔道，脚步极轻，像早就在等这一刻。你攥着旧玉，指节发白。"
        : "";
      return base + insight + "\n\n紧接着，十二具更沉重的傀儡从雾里逼出，脚步碾过碎石，一声比一声近。地面忽然裂开，所有人被陷道吞没。\n\n下坠的混乱里，你只来得及抓住一只手。那只手，属于这一路与你走得最近的人。";
    },
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
    text: "雾未散尽，你借着暗影远远缀在乔无咎身后。他一路走得极熟，避开了所有生门，像在这墓里走过千百遍。你在一条石缝后看见他推开一道伪墙，墙后是一间嵌满活蛊线的暗室——无数细线从石壁深处牵出，末端悬着一枚枚傀儡蛊核。\n\n你终于看清了半盘棋：那些傀儡不是墓主设的，是乔无咎的手笔。",
    choices: [
      { id: "approach", label: "再靠近些，看他在捣鼓什么", next: "shadowTruth", result: "你又靠近了些，屏息看他究竟在捣鼓什么。" },
      { id: "retreat", label: "记下路线，退回大队", next: "fog", result: "你记下路线，悄然后退——塌陷的坑道边缘，雾还没散，你还有机会抓住一只手。", effect: { flag: "曾尾行乔无咎" } },
    ],
  },
  shadowTruth: {
    id: "shadowTruth", act: 3, node: 2, chapter: "第三幕 · 暗线 · 节点 2 / 3", title: "血祭的账本",
    text: "你在暗室角落看见一册用血写就的账本，记的是祭品名单。你的名字，和苏莹的名字，并排写在最后一页。乔无咎忽然停下，头也不回地开口：“跟了一路，不累么？”",
    choices: [
      { id: "confront", label: "现身摊牌，用话周旋", next: "shadowBargain", result: "你从暗处现身，与乔无咎摊牌。" },
      { id: "flee", label: "立刻退走，把所见带出墓去", next: "fog", result: "你立刻退走，把所见带出墓去——塌陷的坑道边缘，雾还没散，你还有机会抓住一只手。", effect: { flag: "曾尾行乔无咎" } },
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
export function rankTrust(trust: Record<AllyId, number>): AllyId[] {
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
  const flags = [...new Set([...state.flags, ...(effect?.flags ?? []), effect?.flag, effect?.ending ? `结局:${effect.ending}` : undefined].filter((f): f is string => Boolean(f)))];
  return { ...state, sceneId: choice.next, route: effect?.route ?? state.route, maxHealth, maxEssence, health: Math.max(1, Math.min(maxHealth, state.health + (effect?.health ?? 0))), essence: Math.max(0, Math.min(maxEssence, state.essence + (effect?.essence ?? 0))), time: state.time + (effect?.time ?? 0), flags, trust };
}
/** 若选项带 randomFlags，则随机取其一并入 effect.flags，并按结果生成对应 result 文本（供 UI 在选择时调用，保证 result 写明所得蛊）。 */
export function resolveRandomChoice(choice: Choice, roll: () => number = Math.random): Choice {
  const effect = choice.effect;
  if (!effect?.randomFlags?.length) return choice;
  const flag = effect.randomFlags[Math.min(effect.randomFlags.length - 1, Math.floor(roll() * effect.randomFlags.length))];
  const picked = "你收回手，侧过身，示意苏莹先挑。苏莹娇躯一震，眼中满是不可思议，半晌才微不可察地说了句“多谢”。她缓缓上前，纤细的指尖在五只蛊卵上逐一抚过，动作轻柔得如同抚摸旧友。最终，她停在最边缘一枚毫不起眼的黑斑蛊卵前，小心翼翼地将它收进怀中。";
  const result = flag === "血甲蛊"
    ? `${picked}剩下的蛊卵里，你顺理成章地伸出手，将那枚与你真元呼应、甲纹森森的蛊卵收入囊中，腰间的“甲衣蛊”微微震颤。苏莹抬头看你，轻声呢喃：“……多谢。”`
    : `${picked}剩下的蛊卵里，你顺理成章地伸出手，将那枚与你真元呼应、血芒吞吐的蛊卵收入囊中，囊中的“月光蛊”光芒顿暗。苏莹抬头看你，轻声呢喃：“……多谢。”`;
  return { ...choice, result, effect: { ...effect, flags: [...(effect.flags ?? []), flag] } };
}
export function sceneText(state: GameState, scene: Scene) { return typeof scene.text === "function" ? scene.text(state) : scene.text; }
export function getEnemyCondition(health: number, maximum: number) { return health >= maximum ? "健康" : health <= maximum * 0.3 ? "重伤" : "受伤"; }

const patterns: Record<string, EnemyAction[]> = {
  "铜皮傀儡": [{ id: "pounce", damage: 2, cue: "铜皮傀儡周身齿轮嘎吱作响，庞大的躯干猛然一沉，周身活蛊线绷紧如弓弦，宛如一头被铁链死死锁住颈项的绝世凶兽，杀机毕露，正在蓄势待发。" }, { id: "wire", damage: 3, cue: "傀儡那冰冷硕大的铜拳裹挟着撕裂空气的剧烈破风声，带着万钧重压，轰然朝你当头砸来！" }, { id: "crush", damage: 5, cue: "傀儡双臂缓缓抬起，庞大的阴影如塌陷的泰山般沉甸甸压下，无形的劲力封锁了周遭数尺退路，逼得你必须全神贯注全力抵御。" }],
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
