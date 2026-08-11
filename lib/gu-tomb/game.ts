export type RoleId = "healer" | "swordsman" | "heir";
export type AllyId = "qiao" | "shen" | "zhao" | "jia";
export type GuAction = "blood" | "armor" | "mind" | "heal" | "sword" | "bloodflow" | "rest";
export type Intent = "撕咬" | "毒雾" | "蓄势";

export type Role = { id: RoleId; name: string; gender: "female" | "male"; title: string; description: string; maxHealth: number; maxEssence: number; attack: number; insight: number; reputation: number; signatureGu: string };
export type Effect = { health?: number; time?: number; clue?: string; flag?: string; trust?: Partial<Record<AllyId, number>> };
export type Choice = { id: string; label: string; next: string; note?: string; needs?: { insight?: number; reputation?: number; role?: RoleId; clue?: string; flag?: string }; effect?: Effect };
export type BattleConfig = { enemyName: string; enemyHealth: number; victoryNext: string; defeatNext: string; victoryFlag?: string; defeatFlag?: string };
export type Scene = { id: string; chapter: string; title: string; paragraphs: string[]; choices?: Choice[]; battle?: BattleConfig };
export type Battle = BattleConfig & { enemyMaxHealth: number; turn: number; intent: Intent };
export type GameState = { roleId: RoleId | null; sceneId: string; health: number; maxHealth: number; essence: number; time: number; clues: string[]; flags: string[]; trust: Record<AllyId, number>; battle: Battle | null; endingId: string | null };
export type Ending = { id: string; name: string; epitaph: string; text: string };

export const roles: Role[] = [
  { id: "healer", name: "宁素衣", gender: "female", title: "四转 · 游方蛊医", description: "神识敏锐，能从蛊毒与尸身中辨出真相。", maxHealth: 10, maxEssence: 12, attack: 3, insight: 3, reputation: 1, signatureGu: "回春蛊" },
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
    battle: { enemyName: "乔家血针机关", enemyHealth: 13, victoryNext: "needleRest", defeatNext: "needleRest", victoryFlag: "血针机关已毁", defeatFlag: "血针重伤" },
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
    id: "needleRest", chapter: "伍 · 血针余烬", title: "针雨之后", paragraphs: [""],
    choices: [
      { id: "take-jia-salve", label: "接下贾贵递来的止血膏", next: "bloodCardChange", effect: { health: 3, trust: { jia: 1 } } },
      { id: "shen-tend", label: "让沈青萝替你清理伤口", next: "bloodCardChange", effect: { health: 2, trust: { shen: 1 } } },
      { id: "guard-others", label: "留在原地警戒，不再耗费药物", next: "bloodCardChange", effect: { trust: { zhao: 1 } } },
    ],
  },
  bloodCardChange: {
    id: "bloodCardChange", chapter: "陆 · 血牌之变", title: "失效传送阵", paragraphs: [""],
    choices: [
      { id: "array-insight", label: "随沈青萝辨认阵眼，先除陷阱", note: "宁素衣专属", needs: { role: "healer" }, next: "bloodHall", effect: { trust: { shen: 1 }, flag: "血牌无恙" } },
      { id: "array-sword", label: "以剑意镇住阵心，助她修复传送阵", note: "陆照野专属", needs: { role: "swordsman" }, next: "bloodHall", effect: { trust: { shen: 1 } } },
      { id: "traitor-accept", label: "答应乔无咎的私下条件", note: "顾微尘专属", needs: { role: "heir" }, next: "traitorEnd", effect: { trust: { qiao: 2 }, flag: "乔家叛徒" } },
      { id: "traitor-refuse", label: "拒绝乔无咎的传音，继续修阵", note: "顾微尘专属", needs: { role: "heir" }, next: "unknownRoom" },
      { id: "array-force", label: "不顾阵纹，强行灌注真元", next: "unknownRoom" },
    ],
  },
  shadowCave: {
    id: "shadowCave", chapter: "陆 · 石室侧洞", title: "伏尸暗格", paragraphs: ["血色石室旁有一道不起眼的侧洞，洞壁嵌着几具早已风化的乔家尸骸。尸骸指骨间还夹着残破阵筹，恰与祭台血槽的纹路相合。乔无咎的声音仍在墓里回荡，催促众人尽快入阵；越是如此，这处被他略过的暗格越显得可疑。\n\n沈青萝想查看阵筹，贾贵却更关心尸骸腰间的储物囊。赵黎站在洞口，脸上又挂回那副若无其事的笑。你们很快仍要去祭台，只是此刻该信谁、该防谁，各人心中已有不同答案。"],
    choices: [
      { id: "check-scripts", label: "陪沈青萝核对阵筹", next: "lastGate", effect: { trust: { shen: 1 } } },
      { id: "watch-jia", label: "与贾贵分守洞口", next: "lastGate", effect: { trust: { jia: 1 } } },
      { id: "let-zhao-lead", label: "请赵黎先行探明侧洞", next: "lastGate", effect: { trust: { zhao: 1 } } },
    ],
  },
  traitorEnd: {
    id: "traitorEnd", chapter: "陆 · 乔家密约", title: "伪造的事故", paragraphs: ["乔无咎将你单独带入血流蛊室，许诺只要你替乔家以世家声望圆下这场“墓中事故”，便能保你日后无忧。血祭发动时，他终于不再掩饰，仰头狂笑，仿佛五转血流蛊已在掌中。\n\n赵黎却在此时自阴影中出手。血刃穿透乔无咎的后心，血瓶倾入玉匣，血流蛊先一步认了邪修的血气。赵黎带着五转蛊回头看你，眼神中只剩戏谑；这场蛊斗从一开始便没有胜算。"],
    choices: [{ id: "traitor-die", label: "看着赵黎的血河吞没一切", next: "ending", effect: { flag: "叛徒末路" } }],
  },
  unknownRoom: {
    id: "unknownRoom", chapter: "陆 · 不见天日", title: "武意海", paragraphs: ["传送阵没有把你送往血色石室，而是吐进一间封死的暗室。四壁由金刚砂砌成，蛊刃划上去只留下一点白痕；中央坐着一具干枯尸体，衣袍腐朽，眉心却仍压着一道未散的五转蛊印。\n\n绝望将至时，一缕微弱灵识在你脑海中响起。那尸体竟是血流蛊真正的主人武意海。他说自己这些年一直在墓中恢复，乔无咎却把他当成无用枯骨。他远未恢复到能对抗乔无咎的程度，便提出条件：交出血刃蛊，随他走密道，以墓中同伴的血气助他复原。\n\n武意海抬手按向金刚砂墙。没有半点巨响，墙壁却无声裂开一道门，门后正是通往主墓室的阴暗长廊。"],
    choices: [
      { id: "wu-alliance", label: "交出血刃蛊，与武意海签下同盟契约", next: "wuAlliance", effect: { flag: "武意海盟约" } },
      { id: "wu-spare-shen", label: "答应帮他，却请求对沈青萝手下留情", next: "wuBetrayal", effect: { trust: { shen: 1 } } },
      { id: "wu-deceive", label: "假意顺从，暗中准备救回众人", next: "rescueChoice", effect: { flag: "欺瞒武意海" } },
    ],
  },
  wuAlliance: {
    id: "wuAlliance", chapter: "柒 · 旧主复苏", title: "同盟如纸", paragraphs: ["武意海以你的血刃蛊补全残缺蛊印，气息迅速攀升。他引你看见密道另一端的厮杀：赵黎、乔无咎与余下修士都成了他恢复修为的血食。待乔无咎倒下、血流蛊重归旧主掌中，武意海便转身向你伸手，要你履行契约。\n\n此刻你才明白，所谓同盟只是一根套在脖颈上的血线。只有足够强横的剑意与刚夺来的五转蛊，才可能撕开这条线。"],
    choices: [
      { id: "wu-steal", label: "趁其与乔无咎交手，夺下血流蛊反击", note: "陆照野专属", needs: { role: "swordsman" }, next: "wuDuel", effect: { flag: "血流蛊已得" } },
      { id: "wu-submit", label: "接受契约，任由他收回血线", next: "wuBetrayal" },
    ],
  },
  wuBetrayal: {
    id: "wuBetrayal", chapter: "柒 · 旧主反噬", title: "血食", paragraphs: ["武意海的笑声在主墓室里回荡。他从未打算与任何人平分自由；血气一旦足够，盟约与请求都只剩一张无用的纸。赵黎、乔无咎与墓中幸存者的声音先后沉入血河，最后连你眼前的灯火也被染成暗红。\n\n五转蛊修恢复实力的一刻，没有人能从这座墓里走出去。"],
    choices: [{ id: "wu-die", label: "在血河中失去意识", next: "ending", effect: { flag: "武意海屠尽众人" } }],
  },
  rescueChoice: {
    id: "rescueChoice", chapter: "柒 · 密道囚室", title: "先救谁", paragraphs: ["武意海沿密道吸收血气时，你借尸灯熄灭的间隙找到了三间囚室。沈青萝被藤影与血线困住，贾贵缩在破裂金壳后，赵黎则被数十根血钉锁在石台上。你只有一次先手的机会。\n\n其余两人都不足以正面对抗恢复中的五转蛊修；若不能先放出赵黎，密道尽头等着众人的仍会是一条死路。"],
    choices: [
      { id: "save-zhao", label: "先拔去赵黎身上的血钉", next: "wuTeamDuel", effect: { trust: { zhao: 1 }, flag: "赵黎援阵" } },
      { id: "save-shen", label: "先救沈青萝", next: "wuBetrayal", effect: { trust: { shen: 1 } } },
      { id: "save-jia", label: "先救贾贵", next: "wuBetrayal", effect: { trust: { jia: 1 } } },
    ],
  },
  wuTeamDuel: {
    id: "wuTeamDuel", chapter: "捌 · 五转残魂", title: "与赵黎合战", paragraphs: ["赵黎拔出最后一根血钉时，袖中寿蛊终于破茧。他没有说谢，只将一道阴冷血线缠到你腕上，示意自己会替你撕开武意海的护体蛊印。\n\n武意海自密道尽头回首，五转余威令整座墓室震颤。此战若败，所有被救下的人都会重新成为他的血食。"],
    battle: { enemyName: "五转残魂 · 武意海", enemyHealth: 34, victoryNext: "teamGather", defeatNext: "wuBetrayal", victoryFlag: "武意海已灭", defeatFlag: "武意海屠尽众人" },
  },
  teamGather: {
    id: "teamGather", chapter: "玖 · 重逢之前", title: "各怀心思", paragraphs: [""],
    choices: [{ id: "gather-team", label: "收起武意海留下的钥匙，继续寻找众人", next: "zhaoDuel" }],
  },
  trueEnding: {
    id: "trueEnding", chapter: "拾贰 · 控制室", title: "全员生还", paragraphs: ["武意海死后，你从他衣内取出两把钥匙。一把打开囚室，另一把却通往墓穴最深处的控制室。你与沈青萝、赵黎、贾贵循着旧图抵达其中，乔无咎尚未来得及重启血祭，便被众人联手困入自己布下的机关。\n\n临死前，乔无咎毁去血流蛊与密室核心，整座蛊墓开始崩塌。众人带着伤与秘密冲出墓门，身后只余荒原风沙。没有人得到五转遗蛊，却没有人被留下；乔家的账，也终于有了活着追讨的人。"],
    choices: [{ id: "true-leave", label: "与众人一同踏出崩塌的蛊墓", next: "ending", effect: { flag: "全员生还" } }],
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
  traitor: { id: "traitor", name: "叛徒末路", epitaph: "圆谎的人，先成了谎言的一部分。", text: "乔无咎想借你的声望遮掩血祭，赵黎却比他更早取走血流蛊。你被留在两名恶徒之间，再没有资格决定自己的生死。" },
  wu: { id: "wu", name: "血食", epitaph: "旧主醒来，墓中再无活人。", text: "武意海恢复五转修为后，盟约、请求与谋算都失去意义。所有人的血气成了他回归人间的第一份祭礼。" },
  true: { id: "true", name: "全员生还", epitaph: "墓门之外，仍有天光。", text: "武意海伏诛，乔无咎死于自己布下的机关。血流蛊与密室同毁，众人带着伤与秘密走出荒原。" },
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
  return (!choice.needs?.insight || role.insight >= choice.needs.insight) && (!choice.needs?.reputation || role.reputation >= choice.needs.reputation) && (!choice.needs?.role || role.id === choice.needs.role) && (!choice.needs?.clue || state.clues.includes(choice.needs.clue)) && (!choice.needs?.flag || state.flags.includes(choice.needs.flag));
}
function addUnique(items: string[], item?: string) { return item && !items.includes(item) ? [...items, item] : items; }
export function applyChoice(state: GameState, choice: Choice): GameState {
  const effect = choice.effect;
  const role = getRole(state.roleId);
  let flags = addUnique(state.flags, effect?.flag);
  let nextScene = choice.next;
  if (choice.id === "array-sword" && role?.id === "swordsman" && state.trust.zhao < 2) flags = addUnique(flags, "赵黎已放逐");
  if (choice.id === "gather-team") nextScene = state.trust.shen >= 2 && state.trust.zhao >= 2 && state.trust.jia >= 2 ? "trueEnding" : "zhaoDuel";
  return { ...state, sceneId: nextScene, health: Math.max(1, Math.min(state.maxHealth, state.health + (effect?.health ?? 0))), time: state.time + (effect?.time ?? 0), clues: addUnique(state.clues, effect?.clue), flags, trust: { qiao: state.trust.qiao + (effect?.trust?.qiao ?? 0), shen: state.trust.shen + (effect?.trust?.shen ?? 0), zhao: state.trust.zhao + (effect?.trust?.zhao ?? 0), jia: state.trust.jia + (effect?.trust?.jia ?? 0) } };
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
      battleConfig = { ...battleConfig, enemyName: "四转蛊修 · 乔无咎", enemyHealth: 24 };
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
  const enemyHealth = battleConfig.enemyHealth + (battleConfig.enemyName === "四转蛊修 · 乔无咎" && flags.includes("乔无咎得血甲蛊") ? 4 : 0);
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
const actionCosts: Record<GuAction, number> = { blood: 1, armor: 2, mind: 3, heal: 3, sword: 3, bloodflow: 1, rest: 0 };
export function resolveBattleTurn(state: GameState, action: GuAction): GameState {
  const role = getRole(state.roleId); const battle = state.battle;
  if (!role || !battle) return state;
  const wrongSignature = (action === "heal" && role.id !== "healer") || (action === "sword" && role.id !== "swordsman") || (action === "mind" && role.id !== "heir") || (action === "bloodflow" && !state.flags.includes("血流蛊已得"));
  if (wrongSignature) return state;
  if ((state.essence === 0 && action !== "rest") || (state.essence > 0 && action === "rest") || state.essence < actionCosts[action]) return state;
  let damage = role.attack; let received = battle.intent === "撕咬" ? 3 : battle.intent === "毒雾" ? 2 : 5;
  let healthBeforeHit = state.health;
  if (action === "blood" && battle.intent === "蓄势") damage += 2;
  if (action === "armor") { damage = 1; received = state.flags.includes("血甲蛊已得") ? 0 : Math.max(0, received - 3); }
  if (action === "mind") { damage = role.attack; received = 0; }
  if (action === "heal") { damage = 0; healthBeforeHit = Math.min(state.maxHealth, state.health + 7); }
  if (action === "sword") { damage = 10; healthBeforeHit = state.health - 1; }
  if (action === "bloodflow" && state.flags.includes("血流蛊已得")) { damage = 6; healthBeforeHit = Math.min(state.maxHealth, state.health + 6); }
  if (battle.enemyName === "五转残魂 · 武意海" && state.flags.includes("赵黎援阵")) damage += 4;
  const actualDamage = Math.min(damage, battle.enemyHealth); const enemyHealth = battle.enemyHealth - actualDamage;
  const essence = action === "rest" ? Math.min(role.maxEssence, state.essence + 3) : state.essence - actionCosts[action];
  const nextState = { ...state, essence };
  if (enemyHealth <= 0) {
    const healthOnKill = healthBeforeHit;
    const swordOneShot = action === "sword" && battle.enemyName === "尸灯傀儡" && battle.turn === 0;
    return finishBattle(nextState, battle, true, healthOnKill, swordOneShot ? "corpseAftermath" : battle.victoryNext);
  }
  const healthAfterHit = healthBeforeHit - received;
  const health = healthAfterHit;
  if (health <= 0) return finishBattle(nextState, battle, false, health);
  const turn = battle.turn + 1;
  return { ...nextState, health, battle: { ...battle, enemyHealth, turn, intent: intents[turn % intents.length] } };
}
export function resolveEnding(state: GameState) {
  if (state.flags.includes("全员生还")) return "true";
  if (state.flags.includes("叛徒末路")) return "traitor";
  if (state.flags.includes("武意海屠尽众人")) return "wu";
  if (state.flags.includes("血流蛊化灰")) return "cleansed";
  if (state.flags.includes("乔无咎杀死你")) return "death";
  if (state.flags.includes("赵黎夺走血流蛊")) return "death";
  if (state.time >= 4) return "trapped";
  if (state.flags.includes("血流蛊已得")) return "bloodflow";
  if (!state.flags.includes("青萝已殁") && state.trust.shen >= 2 && (state.clues.includes("五人血印") || state.clues.includes("沈砚玉牌"))) return "together";
  return "alone";
}
