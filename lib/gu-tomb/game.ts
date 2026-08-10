export type RoleId = "healer" | "swordsman" | "heir";
export type AllyId = "qiao" | "shen" | "zhao" | "jia";
export type GuAction = "blood" | "armor" | "mind" | "heal" | "sword" | "bloodflow" | "rest";
export type Intent = "撕咬" | "毒雾" | "蓄势";

export type Role = { id: RoleId; name: string; gender: "female" | "male"; title: string; description: string; maxHealth: number; maxEssence: number; attack: number; insight: number; reputation: number; signatureGu: string };
export type Effect = { health?: number; time?: number; clue?: string; flag?: string; trust?: Partial<Record<AllyId, number>> };
export type Choice = { id: string; label: string; next: string; note?: string; needs?: { insight?: number; reputation?: number; clue?: string; flag?: string }; effect?: Effect };
export type BattleConfig = { enemyName: string; enemyHealth: number; victoryNext: string; defeatNext: string; victoryFlag?: string; defeatFlag?: string };
export type Scene = { id: string; chapter: string; title: string; paragraphs: string[]; choices?: Choice[]; battle?: BattleConfig };
export type Battle = BattleConfig & { enemyMaxHealth: number; turn: number; intent: Intent };
export type GameState = { roleId: RoleId | null; sceneId: string; health: number; maxHealth: number; essence: number; time: number; clues: string[]; flags: string[]; trust: Record<AllyId, number>; battle: Battle | null; endingId: string | null };
export type Ending = { id: string; name: string; epitaph: string; text: string };

export const roles: Role[] = [
  { id: "healer", name: "宁素衣", gender: "female", title: "四转 · 游方蛊医", description: "神识敏锐，能从蛊毒与尸身中辨出真相。", maxHealth: 10, maxEssence: 10, attack: 2, insight: 3, reputation: 1, signatureGu: "回春蛊" },
  { id: "swordsman", name: "陆照野", gender: "male", title: "四转 · 散修剑客", description: "蛊斗强横，却不擅长把话说圆。", maxHealth: 13, maxEssence: 15, attack: 4, insight: 1, reputation: 1, signatureGu: "剑鸣蛊" },
  { id: "heir", name: "顾微尘", gender: "male", title: "四转 · 世家旁支", description: "熟知墓制与人心，容易获得信任也容易被针对。", maxHealth: 11, maxEssence: 10, attack: 3, insight: 2, reputation: 3, signatureGu: "惑心蛊" },
];

export const scenes: Record<string, Scene> = {
  entrance: {
    id: "entrance", chapter: "壹 · 乔家之邀", title: "五名四转蛊修",
    paragraphs: ["测试文本。"],
    choices: [
      { id: "read", label: "先察看墓门上的蛊纹", note: "神识 ≥ 2", needs: { insight: 2 }, next: "bloodDoor", effect: { clue: "五人血印" } },
      { id: "qiao", label: "相信乔家承诺，随乔无咎开门", next: "bloodDoor", effect: { trust: { qiao: 1 } } },
      { id: "alone", label: "不理会众人，独自先行勘探", next: "bloodDoor", effect: { time: 1, flag: "独行" } },
    ],
  },
  bloodDoor: {
    id: "bloodDoor", chapter: "贰 · 五人开门", title: "血锁墓门",
    paragraphs: ["墓门被五道血锁缠死。乔无咎安排众人各以四转真元压住一环：沈青萝放出青藤蛊稳住阵脚，贾贵缩在金壳蛊后面，赵黎却只用两指便震碎了最难的一环。", "血锁断开后，门缝里涌出的不是尘土，而是一阵温热的腥风。你手背上的蛊印微微刺痛，仿佛有什么东西正在墓里记下五人的气息。", "门开的一瞬，乔无咎看向墓道深处的神色不像第一次来。尸油灯亮起，灯影里爬出一排披甲的活尸傀儡。"],
    choices: [
      { id: "expose", label: "记下赵黎未曾掩饰的实力", next: "corpseFight", effect: { clue: "赵黎藏实力" } },
      { id: "follow", label: "跟紧沈青萝，护住她的侧翼", next: "corpseFight", effect: { trust: { shen: 1 } } },
      { id: "rush", label: "催促众人冲过墓道", next: "corpseFight", effect: { time: 1 } },
    ],
  },
  corpseFight: {
    id: "corpseFight", chapter: "叁 · 尸灯傀儡", title: "四转合战",
    paragraphs: ["沈青萝的青藤蛊缠住尸傀双足，贾贵用金壳蛊顶在最前面，赵黎慢吞吞地说‘老夫只出三分力’。轮到你补上缺口。", "尸灯傀儡的甲片相互摩擦，火星从它胸腔的缝里溅出。它忽然伏低身子，像在积蓄某种比寻常扑杀更沉重的力量。", "这是第一次并肩蛊斗。墓道狭窄，谁先退半步，后面的人就会被尸灯火焰吞没。"],
    battle: { enemyName: "尸灯傀儡", enemyHealth: 10, victoryNext: "shenCare", defeatNext: "shenCare", victoryFlag: "尸傀已灭", defeatFlag: "重伤" },
  },
  well: {
    id: "well", chapter: "肆 · 引魂蛊井", title: "井里有人说话",
    paragraphs: ["墓道尽头的枯井传来孩童哭声：‘师姐，别丢下我。’沈青萝的师弟沈砚，正是在这座墓里失踪。", "井口结着一层薄霜，哭声每响一次，霜面便裂开一道细缝。沈青萝握剑的手指泛白，却始终没有立刻跳下去。", "贾贵悄悄后退半步，说自己只会保命；赵黎则笑称井底若有宝物，老夫愿先替诸位试毒。"],
    choices: [
      { id: "save", label: "以真元护住沈青萝，下井查看", next: "shell", effect: { time: 1, trust: { shen: 1 } } },
      { id: "break", label: "指出这是引魂蛊，强行离开", next: "lampRoom", effect: { clue: "引魂蛊" } },
      { id: "zhao-test", label: "顺势请赵黎先探井口", next: "lampRoom", effect: { trust: { zhao: -1 }, time: 1, flag: "试探赵黎" } },
    ],
  },
  shell: {
    id: "shell", chapter: "肆 · 引魂蛊井", title: "空壳师弟",
    paragraphs: ["井底没有活人，只有披着沈砚衣物的空壳。它吐出一枚黑牙蛊，随即散成灰。", "空壳散开前，五根手指仍死死扣住井壁，指缝里塞着一片染血的乔家符纸。你听见上方的风声，像有人把井盖悄悄挪开了一寸。", "沈青萝收起衣角里掉出的半枚玉牌。她没有哭，只说乔家若早知这里有引魂蛊，便不该把任何人骗进来。"],
    choices: [
      { id: "keep", label: "留下玉牌与黑牙蛊作证", next: "lampRoom", effect: { clue: "沈砚玉牌", flag: "黑牙蛊" } },
      { id: "burn", label: "焚掉空壳，不让它再骗人", next: "lampRoom", effect: { health: -1 } },
    ],
  },
  bloodTrap: {
    id: "bloodTrap", chapter: "伍 · 血针机关", title: "乔无咎消失了",
    paragraphs: ["你们刚离开枯井，乔无咎便不见了。墓壁翻转，万千血针从缝隙里射出，显然有人熟悉这里的机关。", "第一轮针雨落下时，乔无咎留在地上的半截灯芯仍在燃烧。灯芯没有被风吹灭，反而向着机关深处弯折，像在替主人指路。", "贾贵撑开金壳蛊为众人挡下第一轮，沈青萝的藤蛊截断针雨，赵黎仍藏着手。余下的血针机关只能由你们击破。"],
    battle: { enemyName: "乔家血针机关", enemyHealth: 13, victoryNext: "needleRest", defeatNext: "needleRest", victoryFlag: "血针机关已毁", defeatFlag: "重伤" },
  },
  bloodHall: {
    id: "bloodHall", chapter: "陆 · 五转遗蛊", title: "血流蛊",
    paragraphs: ["机关尽头是一座血色石室。石台上的玉匣里封着一只沉睡的五转蛊——血流蛊。乔家秘卷只记载它能让血气如江河奔涌，具体威能却无人知晓。", "玉匣周围没有锁，只有五道干涸血槽。你的影子落在其中一道里时，匣内的蛊虫忽然轻轻蜷动，仿佛隔着数百年闻到了新鲜血肉。", "石室四壁浮现五人血印。原来乔无咎早已探明七分墓穴：他邀你们并非看中探索本事，而是要用四人的血与自己乔家血脉，复活这只死去的血流蛊。"],
    choices: [
      { id: "truth", label: "把真相摊开，与沈青萝、贾贵破阵", next: "shadowCave", effect: { trust: { shen: 1, qiao: -1 }, flag: "坦白真相" } },
      { id: "seize", label: "趁乱夺取血流蛊", next: "shadowCave", effect: { flag: "夺蛊" } },
      { id: "chase", label: "放弃玉匣，先追乔无咎", next: "shadowCave", effect: { time: 1, flag: "追乔" } },
    ],
  },
  zhaoDuel: {
    id: "zhaoDuel", chapter: "玖 · 邪修夺蛊", title: "血流邪修 · 赵黎",
    paragraphs: [""],
    battle: { enemyName: "血流邪修 · 赵黎", enemyHealth: 22, victoryNext: "qiaoDuel", defeatNext: "zhaoDeath", victoryFlag: "赵黎已败", defeatFlag: "赵黎夺走血流蛊" },
  },
  zhaoDeath: {
    id: "zhaoDeath", chapter: "玖 · 血流初醒", title: "命丧蛊墓",
    paragraphs: [""],
    choices: [{ id: "die", label: "在蛊墓中失去最后一丝意识", next: "ending" }],
  },
  lastGate: {
    id: "lastGate", chapter: "捌 · 祭阵出口", title: "乔家的血祭",
    paragraphs: [""],
    battle: { enemyName: "乔家血卫", enemyHealth: 34, victoryNext: "bloodRage", defeatNext: "bloodRage", victoryFlag: "血卫独破", defeatFlag: "血卫压境" },
  },
  bloodRage: {
    id: "bloodRage", chapter: "玖 · 血流初醒", title: "赵黎的血祭",
    paragraphs: [""],
    choices: [
      { id: "fight-zhao", label: "趁血流蛊未稳，合力阻止赵黎", note: "需要援手或未重伤", needs: { flag: "赵黎可战" }, next: "zhaoDuel" },
      { id: "yield-zhao", label: "无力阻止，只能看他完成秘法", next: "zhaoDeath", effect: { flag: "赵黎夺走血流蛊" } },
    ],
  },
  bloodExit: {
    id: "bloodExit", chapter: "拾壹 · 血河出墓", title: "夺蛊成魔",
    paragraphs: ["乔无咎倒下时，血流蛊已经听不见别的声音。它沿着你掌中的血脉涌入四肢，替你撕开祭台，也替你撕开最后一点迟疑。贾贵的惊呼、沈青萝的喝止、赵黎留下的血腥，都被那条无形血河卷得越来越远。\n\n荒原的风吹到墓门外时，你才发觉四下已经没有活人。血流蛊伏在心口，安静得像一枚从未醒过的蛹；而你掌上尚未干涸的血，却仍在替它记住所有人的名字。"],
    choices: [{ id: "leave-blood", label: "踏出蛊墓，任由血流蛊随心跳苏醒", next: "ending" }],
  },
  qiaoDuel: {
    id: "qiaoDuel", chapter: "拾 · 家主现身", title: "乔无咎的末路", paragraphs: [""],
    battle: { enemyName: "四转蛊修 · 乔无咎", enemyHealth: 18, victoryNext: "bloodExit", defeatNext: "zhaoDeath", victoryFlag: "乔无咎已诛", defeatFlag: "血流反噬" },
  },
  qiaoCleanExit: {
    id: "qiaoCleanExit", chapter: "拾 · 破蛊出墓", title: "血流成灰", paragraphs: [""],
    choices: [{ id: "leave-clean", label: "看着血流蛊化为灰烬，踏出蛊墓", next: "ending" }],
  },
  corpseAftermath: {
    id: "corpseAftermath", chapter: "叁 · 尸灯傀儡", title: "剑鸣一闪",
    paragraphs: ["剑鸣之声在狭窄墓道里来回震荡，尸灯傀儡的胸甲刚抬起半寸，便自正中裂作两片。惨白灯火骤然熄灭，甲片与断刃散落满地，连那股沉在墓砖间的尸臭都像被剑声一并斩断。\n\n贾贵张着嘴，半晌才把金壳蛊收回袖中；沈青萝的藤蛊停在半空，眸光落在你身上，似乎重新估量起这位同行之人。赵黎捻着并不存在的胡须，笑意却淡了几分。墓道恢复死寂后，众人才继续向更深处走去。"],
    choices: [{ id: "continue-after-sword", label: "收蛊前行", next: "shenCare" }],
  },
  shenCare: {
    id: "shenCare", chapter: "叁 · 尸灯傀儡", title: "青萝的关心", paragraphs: [""],
    choices: [
      { id: "brace", label: "压下伤势，称自己无碍", next: "bloodPool" },
      { id: "confess", label: "坦言伤势，接下她递来的丹药", next: "bloodPool", effect: { health: 99, trust: { shen: 1 } } },
    ],
  },
  bloodPool: {
    id: "bloodPool", chapter: "叁 · 偏室暗门", title: "空血池", paragraphs: ["尸灯熄灭后，贾贵掌中那只寻宝蛊忽然钻出药箱，在一面石壁前焦躁地打转。石壁后竟藏着一间半塌的偏室，中央血池早已干涸，池底古棺也空无一物。乔无咎盯着空池看了很久，神色一瞬间变得极不自然，随即又垂下眼，像是在盘算什么。\n\n你退到棺侧时，恰看见贾贵用肥厚手指从棺缝中夹出两只四转血甲蛊。他动作极快，仍没逃过你的眼睛。此蛊能替防御蛊虫分担重击，乔无咎若得一只，祭台上的血卫必会更难对付；若你分得一只，日后的护身把握也更多。"],
    choices: [
      { id: "report-jia", label: "当众告发贾贵的小动作", next: "shellCorridor", effect: { flag: "乔无咎得血甲蛊", trust: { qiao: 1, jia: -1 } } },
      { id: "blackmail-jia", label: "压低声音，要挟他分你一只", next: "shellCorridor", effect: { flag: "血甲蛊已得", trust: { jia: -1 } } },
      { id: "ignore-jia", label: "移开目光，只当什么也没看见", next: "shellCorridor", effect: { trust: { jia: 1 } } },
    ],
  },
  shellCorridor: {
    id: "shellCorridor", chapter: "叁 · 蛊蜕走廊", title: "蜕壳余香", paragraphs: ["偏室后的走廊两侧嵌着成排石罐，罐中尽是干枯蛊壳。每逢众人经过，壳内便飘出一丝青白药香，沁入伤口时带着细微刺痛。赵黎说此地多半留有养蛊药渣，语气淡淡，袖口却比先前收得更紧；贾贵则盯着石罐，像在估算哪一只尚有余用。\n\n走廊尽头有三只未碎的药囊，药性都不算猛烈，却足够撑过下一段墓道。你可以独取一份，也可以把这点微薄好处分给身边的人。"],
    choices: [
      { id: "share-zhao", label: "分一囊药散给赵黎", next: "well", effect: { health: 2, trust: { zhao: 1 } } },
      { id: "take-draught", label: "取一囊青露，自行调息", next: "well", effect: { health: 2 } },
      { id: "cover-jia", label: "替贾贵挡住散出的药尘", next: "well", effect: { trust: { jia: 1 } } },
    ],
  },
  lampRoom: {
    id: "lampRoom", chapter: "肆 · 井后药室", title: "灯冢药房", paragraphs: ["离开枯井后，墓道旁一间旧药房还亮着半盏尸油灯。药架大半腐朽，唯有一只铜炉中余温未散。沈青萝认出炉底沉着的止血散，贾贵则从碎瓷片下翻出几张封口完好的护心膏。赵黎没有靠近，只站在门外看着灯焰，像在等谁先替他试药。\n\n前方就是血针机关，带伤硬闯绝非明智。药材不多，如何分配，足以让每个人记住你此刻的选择。"],
    choices: [
      { id: "shen-medicine", label: "让沈青萝炼开止血散", next: "bloodTrap", effect: { health: 3, trust: { shen: 1 } } },
      { id: "jia-ointment", label: "与贾贵分用护心膏", next: "bloodTrap", effect: { health: 2, trust: { jia: 1 } } },
      { id: "leave-medicine", label: "不碰药房里的任何东西", next: "bloodTrap", effect: { trust: { zhao: 1 } } },
    ],
  },
  needleRest: {
    id: "needleRest", chapter: "伍 · 血针余烬", title: "针雨之后", paragraphs: ["血针机关终于沉寂，墓道里只余断藤与碎壳。贾贵的金壳蛊裂开一道长缝，他却先摸出一盒止血膏，慢吞吞地说这是自己压箱底的保命物。沈青萝衣袖被针风割破，仍在用藤丝替众人挑出嵌入皮肉的残针。\n\n短暂歇息后便要踏入血色石室。此时肯伸手的人未必可信，但若拒绝一切，也许撑不到下一个转角。"],
    choices: [
      { id: "take-jia-salve", label: "接下贾贵递来的止血膏", next: "bloodHall", effect: { health: 3, trust: { jia: 1 } } },
      { id: "shen-tend", label: "让沈青萝替你清理伤口", next: "bloodHall", effect: { health: 2, trust: { shen: 1 } } },
      { id: "guard-others", label: "留在原地警戒，不再耗费药物", next: "bloodHall", effect: { trust: { zhao: 1 } } },
    ],
  },
  shadowCave: {
    id: "shadowCave", chapter: "陆 · 石室侧洞", title: "伏尸暗格", paragraphs: ["血色石室旁有一道不起眼的侧洞，洞壁嵌着几具早已风化的乔家尸骸。尸骸指骨间还夹着残破阵筹，恰与祭台血槽的纹路相合。乔无咎的声音仍在墓里回荡，催促众人尽快入阵；越是如此，这处被他略过的暗格越显得可疑。\n\n沈青萝想查看阵筹，贾贵却更关心尸骸腰间的储物囊。赵黎站在洞口，脸上又挂回那副若无其事的笑。你们很快仍要去祭台，只是此刻该信谁、该防谁，各人心中已有不同答案。"],
    choices: [
      { id: "check-scripts", label: "陪沈青萝核对阵筹", next: "lastGate", effect: { trust: { shen: 1 } } },
      { id: "watch-jia", label: "与贾贵分守洞口", next: "lastGate", effect: { trust: { jia: 1 } } },
      { id: "exile-zhao", label: "以界裂阵筹反制赵黎", note: "需看破赵黎藏实力", needs: { clue: "赵黎藏实力" }, next: "lastGate", effect: { flag: "赵黎已放逐", trust: { zhao: -2 } } },
    ],
  },
};

export const scenePageNotes: Record<string, string[]> = {
  entrance: [
    "乔无咎说话时始终没有下车。他隔着车帘报出每个人的来历，连你曾在哪座坊市停留过都一清二楚，像这次邀约并非临时起意。",
    "风里混着陈年香灰与铁锈味。墓前没有半点鸟兽痕迹，只有五串被风沙填了一半的旧脚印，一直延伸到石门下。",
    "沈青萝只是垂眼摩挲剑穗，贾贵忙着给自己找退路，赵黎则笑而不语。五个人站得很近，彼此之间却像隔着一条看不见的墓道。",
  ],
  bloodDoor: [
    "乔无咎分配血锁的位置时没有翻阅任何图纸，连哪一环最先松动都说得准确。他很快用一句‘祖上留下的零星记载’将这份熟练遮掩过去。",
    "你感觉到锁链深处有细微的脉搏。它们不像死物，更像一条条伏在石门后的血管；真元一旦注入，就被悄悄抽走一丝。",
    "尸油灯的火焰一盏接一盏亮起，照出墙上早已褪色的祭祀壁画。画中的人跪成五列，最中央却没有享祭者的脸。",
  ],
  corpseFight: [
    "尸傀并不急着扑来。它们拖着铁靴在墓砖上来回摩擦，像是在确认谁的气息最弱；尸灯的火光也随之从昏黄慢慢转成惨白。",
    "沈青萝侧身挡住一具尸傀的视线，青藤在砖缝里疯长。她没有喊你，只以极轻的声音提醒：这些东西会记住第一次受伤的目标。",
    "贾贵脸上的笑已经僵住，金壳蛊却撑得极稳。赵黎站在最后方，袖中始终藏着一只未曾显露的蛊，像在等别人先替他试出机关的底细。",
  ],
  well: [
    "哭声并不连贯，像有人隔着很远的地方学着孩童说话。每当声音喊到‘师姐’，井壁上便会浮出一层细密的血色露珠。",
    "沈青萝提起师弟时只说他三年前奉命入荒原采药，此后杳无音信。她显然比任何人都清楚井下危险，却也比任何人都不愿离开。",
    "赵黎说得轻巧，脚尖却始终没有越过井口半步。贾贵的手已经摸到药箱暗扣，显然在盘算一旦井里冲出东西，先救谁最划算。",
  ],
  shell: [
    "黑牙蛊落地后还在缓缓开合，像一张没有舌头的嘴。你能看出它并非沈砚本命蛊，更像有人专门留在这里，用来把活人的执念钓进井底。",
    "符纸上残余的血色没有干透，落款却是十年前的乔家旁系。乔无咎若说自己只知七分墓穴，那么至少有三分是在故意让你们以为他不知情。",
    "沈青萝把玉牌贴在掌心许久，才收进衣内。她没有道谢，也没有发作，只是身上的杀意比下井之前更沉，像已在心里记下了一笔债。",
  ],
  bloodTrap: [
    "墙砖翻转得极有节律，每三次轻响之后便有一片机关孔同时张开。乔无咎显然不是逃走，而是提前到了能操纵整条墓道的位置。",
    "灯芯所指的方向恰好避开了第一波血针。它像在嘲弄你们：乔无咎仍愿给一条活路，只是那条路永远通向他想让你们去的地方。",
    "贾贵的金壳上已嵌满血针，壳面不断发出脆裂声。沈青萝额前的发丝被针风削断，赵黎终于收起笑容，第一次认真看向机关深处。",
  ],
  bloodHall: [
    "石室里的空气黏稠得像化不开的血。每一次呼吸都让人心跳加快半拍，而玉匣中的血流蛊仍安静得近乎死去，仿佛只差最后一点生机。",
    "五道血槽分别对应你们来时留下的蛊印。贾贵脸色发白，沈青萝盯着玉匣没有动，赵黎则第一次不再掩饰目光中的贪婪。",
    "四壁的回声还在重复乔无咎的安排：开门要五人，破阵要五人，最后复活一只死蛊，也恰好要五人。所谓按功分配，从来只是给祭品听的笑话。",
  ],
  zhaoDuel: [
    "赵黎的气息外放后，先前墓中那些看似勉强的闪避都显得像一场戏。他不是被乔家请来的散修，而是一头耐心等到猎物围成一圈才露牙的狼。",
    "血流蛊对他的血线有所回应，玉匣表面的霜痕正一点点融化。赵黎并不急着出手，仿佛笃定重伤与机关已经替他削掉了所有竞争者。",
    "他说话时仍带着那副老气横秋的腔调，眼神却冷得没有一丝玩笑。此处没有乔家仆从，没有门派规矩，胜负只取决于谁能活着握住玉匣。",
  ],
  zhaoDeath: [
    "疼痛没有立刻传来，先是四周的声音被抽空，只剩血液从伤口涌出的细响。赵黎袖口的血线绕过你的蛊虫，像早就知道该从哪里拆掉防御。",
    "玉匣开启的缝隙里透出一道暗红光芒。乔无咎在远处似乎也发出愤怒的喝声，但赵黎已经不在乎任何人的安排；他只在乎这只蛊终于醒了。",
  ],
  lastGate: [
    "乔无咎站得很稳，脚下祭台却在缓慢吞吐光芒。他终于不再维持家主的温和姿态，像个等了数十年、终于等到祭物齐全的人。",
    "祭阵把整座墓的尸灯、血针与暗道都连成一张网。你现在才明白此前每一次绕路、每一处治疗和每一场战斗，都可能是乔家算进血祭的步骤。",
    "贾贵没有再提分宝，沈青萝也不再追问师弟。所有人都知道只要祭台再亮一次，活着离开便不再是靠运气，而是要从乔无咎手里硬抢。",
  ],
  bloodRage: [
    "血流蛊替代原有攻击蛊的瞬间，你听见体内像有河流决堤。先前的伤口同时发热，连远处血卫甲缝里的血迹都在牵引你的呼吸。",
    "乔无咎的脸色第一次变了。他原以为自己能驾驭复活后的五转蛊，却发现血卫刀锋上的血正脱离主人的控制，顺着石地汇向你的脚下。",
    "力量来得太快，以至于你分不清那是自己的杀意，还是蛊虫在催促你继续向前。每一次出手都能让生命回流，也让理智像灯火一样被风吹薄。",
  ],
  bloodExit: [
    "荒原尽头没有人迎接你。乔家车驾早已空了，连仆从留下的车辙都被风抹平，仿佛这场邀约从一开始就不该留下任何见证。",
    "你回头时，墓门已经合成一块普通石碑。它埋下了同伴、乔家的秘密与无数未问出口的话，只有心口的血流蛊还在提醒你那里发生过什么。",
    "远处的天色一点点亮起来。你知道自己已经离开蛊墓，却不知道从这一刻起，究竟是你带着血流蛊行走，还是血流蛊借你的身体走向人间。",
  ],
};

export const endings: Record<string, Ending> = {
  trapped: { id: "trapped", name: "困墓之人", epitaph: "尸灯灭时，活人也成了墓的一部分。", text: "你们在机关与迟疑中耗尽时辰。血祭重新闭合，墓门外传来新的脚步声；乔家仍会继续寻找下一批四转蛊修。" },
  bloodflow: { id: "bloodflow", name: "夺蛊成魔", epitaph: "一蛊入心，血流如河。", text: "你夺得五转血流蛊，反杀乔家血卫，带着满身鲜血走出荒原。它替你补回每一滴流失的生命，也在你心里留下永不满足的饥渴。" },
  cleansed: { id: "cleansed", name: "破蛊出墓", epitaph: "血流既尽，荒原尚有天光。", text: "赵黎被界裂阵筹放逐，乔无咎亲自现身仍败在你手中。血流蛊失去血祭供养，终于化作灰烬；你带着尚存的人走出墓门，乔家的旧账留待人间清算。" },
  together: { id: "together", name: "两人出墓", epitaph: "有些债，活着才能偿。", text: "你与沈青萝凭玉牌拆解引魂血印，贾贵替你们挡住最后一轮机关。石门崩塌前，沈青萝说：‘乔家的账，出去再算。’" },
  death: { id: "death", name: "命丧蛊墓", epitaph: "血流蛊醒来时，第一个被吞掉的是你。", text: "赵黎夺走血流蛊，以你的血气完成它的初醒。墓门在身后合拢，乔家的阴谋、邪修的笑声与未查明的真相，都留在了黑暗里。" },
  alone: { id: "alone", name: "独活荒原", epitaph: "活下来的人，也要背着秘密。", text: "你踏过最后一道血线，身后是再无声息的蛊墓。乔家的阴谋未能吞掉你，但荒原很大，追问真相的人也不会少。" },
};

export function initialGame(): GameState { return { roleId: null, sceneId: "entrance", health: 0, maxHealth: 0, essence: 0, time: 0, clues: [], flags: [], trust: { qiao: 0, shen: 0, zhao: 0, jia: 0 }, battle: null, endingId: null }; }
export function getRole(id: RoleId | null) { return roles.find((role) => role.id === id) ?? null; }
export function chooseRole(id: RoleId): GameState { const role = getRole(id); return role ? { ...initialGame(), roleId: id, health: role.maxHealth, maxHealth: role.maxHealth } : initialGame(); }
export function canChoose(state: GameState, choice: Choice) {
  const role = getRole(state.roleId);
  if (!role) return false;
  return (!choice.needs?.insight || role.insight >= choice.needs.insight) && (!choice.needs?.reputation || role.reputation >= choice.needs.reputation) && (!choice.needs?.clue || state.clues.includes(choice.needs.clue)) && (!choice.needs?.flag || state.flags.includes(choice.needs.flag));
}
function addUnique(items: string[], item?: string) { return item && !items.includes(item) ? [...items, item] : items; }
export function applyChoice(state: GameState, choice: Choice): GameState {
  const effect = choice.effect;
  return { ...state, sceneId: choice.next, health: Math.max(1, Math.min(state.maxHealth, state.health + (effect?.health ?? 0))), time: state.time + (effect?.time ?? 0), clues: addUnique(state.clues, effect?.clue), flags: addUnique(state.flags, effect?.flag), trust: { qiao: state.trust.qiao + (effect?.trust?.qiao ?? 0), shen: state.trust.shen + (effect?.trust?.shen ?? 0), zhao: state.trust.zhao + (effect?.trust?.zhao ?? 0), jia: state.trust.jia + (effect?.trust?.jia ?? 0) } };
}

const intents: Intent[] = ["撕咬", "毒雾", "蓄势"];
export function startBattle(state: GameState, scene: Scene): GameState {
  const role = getRole(state.roleId);
  if (!scene.battle || !role) return state;
  let flags = state.flags;
  let health = state.health;
  let maxHealth = state.maxHealth;
  let battleConfig = scene.battle;
  if (scene.id === "lastGate") {
    if (state.flags.includes("赵黎已放逐")) {
      battleConfig = { ...battleConfig, enemyName: "四转蛊修 · 乔无咎", enemyHealth: state.flags.includes("乔无咎得血甲蛊") ? 28 : 24 };
    } else {
      flags = addUnique(flags, "贾贵装死");
      if (state.trust.shen >= 2) {
        flags = addUnique(flags, "青萝并肩");
        maxHealth += 3;
        health = Math.min(maxHealth, health + 3);
      } else flags = addUnique(flags, "青萝已殁");
    }
  }
  if (scene.id === "zhaoDuel") {
    const weakenedByAllies = (state.flags.includes("贾贵援手") ? 4 : 0) + (state.flags.includes("赵黎犹疑") ? 2 : 0);
    battleConfig = { ...battleConfig, enemyHealth: Math.max(12, battleConfig.enemyHealth - weakenedByAllies) };
  }
  const enemyHealth = battleConfig.enemyHealth + (battleConfig.enemyName === "乔家血卫" && flags.includes("乔无咎得血甲蛊") ? 4 : 0);
  return { ...state, flags, health, maxHealth, essence: role.maxEssence, battle: { ...battleConfig, enemyHealth, enemyMaxHealth: enemyHealth, turn: 0, intent: intents[0] } };
}
function finishBattle(state: GameState, battle: Battle, won: boolean, health: number, nextScene = won ? battle.victoryNext : battle.defeatNext) {
  const flag = won ? battle.victoryFlag : battle.defeatFlag;
  let flags = addUnique(state.flags, flag);
  let sceneId = nextScene;
  if (battle.enemyName === "乔家血卫") {
    if (state.trust.jia >= 2) flags = addUnique(flags, "贾贵援手");
    if (state.trust.zhao >= 2) flags = addUnique(flags, "赵黎犹疑");
    const canFightZhao = (won && health >= 4) || state.trust.zhao >= 2 || state.trust.shen >= 2 || state.trust.jia >= 2;
    if (canFightZhao) flags = addUnique(flags, "赵黎可战");
  }
  if (battle.enemyName === "血流邪修 · 赵黎" && won) {
    flags = addUnique(flags, "血流蛊已得");
    flags = addUnique(flags, state.trust.zhao >= 2 ? "赵黎遁走" : "赵黎伏诛");
  }
  if (battle.enemyName === "四转蛊修 · 乔无咎") {
    if (won && state.flags.includes("赵黎已放逐")) {
      sceneId = "qiaoCleanExit";
      flags = addUnique(flags, "血流蛊化灰");
    }
    if (!won) {
      sceneId = "zhaoDeath";
      flags = addUnique(flags, "乔无咎杀死你");
    }
  }
  const endingHealth = won ? Math.max(1, health) : battle.enemyName === "乔家血卫" && state.trust.shen >= 2 ? Math.min(state.maxHealth, 5) : 1;
  return { ...state, sceneId, battle: null, health: endingHealth, time: won ? state.time : state.time + 1, flags };
}
const actionCosts: Record<GuAction, number> = { blood: 1, armor: 2, mind: 3, heal: 3, sword: 3, bloodflow: 0, rest: 0 };
export function resolveBattleTurn(state: GameState, action: GuAction): GameState {
  const role = getRole(state.roleId); const battle = state.battle;
  if (!role || !battle) return state;
  const wrongSignature = (action === "heal" && role.id !== "healer") || (action === "sword" && role.id !== "swordsman") || (action === "mind" && role.id !== "heir") || (action === "bloodflow" && !state.flags.includes("血流蛊已得"));
  if (wrongSignature) return state;
  if ((state.essence === 0 && action !== "rest") || (state.essence > 0 && action === "rest") || state.essence < actionCosts[action]) return state;
  let damage = role.attack; let received = battle.intent === "撕咬" ? 3 : battle.intent === "毒雾" ? 2 : 5;
  let healthBeforeHit = state.health;
  if (action === "blood" && battle.intent === "蓄势") damage += 2;
  if (action === "armor") { damage = 1; received = Math.max(0, received - (state.flags.includes("血甲蛊已得") ? 4 : 3)); }
  if (action === "mind") { damage = role.attack; received = 0; }
  if (action === "heal") { damage = 0; healthBeforeHit = Math.min(state.maxHealth, state.health + 6); }
  if (action === "sword") { damage = 10; healthBeforeHit = state.health - 1; }
  if (action === "bloodflow" && state.flags.includes("血流蛊已得")) { damage = 16; received = 0; }
  const actualDamage = Math.min(damage, battle.enemyHealth); const enemyHealth = battle.enemyHealth - actualDamage;
  const essence = action === "rest" ? Math.min(role.maxEssence, state.essence + 3) : state.essence - actionCosts[action];
  const nextState = { ...state, essence };
  if (enemyHealth <= 0) {
    const healthOnKill = action === "bloodflow" ? Math.min(state.maxHealth, Math.max(1, healthBeforeHit) + actualDamage) : healthBeforeHit;
    const swordOneShot = action === "sword" && battle.enemyName === "尸灯傀儡" && battle.turn === 0;
    return finishBattle(nextState, battle, true, healthOnKill, swordOneShot ? "corpseAftermath" : battle.victoryNext);
  }
  const healthAfterHit = healthBeforeHit - received;
  const health = action === "bloodflow" ? Math.min(state.maxHealth, Math.max(1, healthAfterHit) + actualDamage) : healthAfterHit;
  if (health <= 0) return finishBattle(nextState, battle, false, health);
  const turn = battle.turn + 1;
  return { ...nextState, health, battle: { ...battle, enemyHealth, turn, intent: intents[turn % intents.length] } };
}
export function resolveEnding(state: GameState) {
  if (state.flags.includes("血流蛊化灰")) return "cleansed";
  if (state.flags.includes("乔无咎杀死你")) return "death";
  if (state.flags.includes("赵黎夺走血流蛊")) return "death";
  if (state.time >= 4) return "trapped";
  if (state.flags.includes("血流蛊已得")) return "bloodflow";
  if (!state.flags.includes("青萝已殁") && state.trust.shen >= 2 && (state.clues.includes("五人血印") || state.clues.includes("沈砚玉牌"))) return "together";
  return "alone";
}
