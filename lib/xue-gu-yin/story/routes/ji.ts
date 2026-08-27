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
  { type: "narration", text: "检修通道走到尽头，前方分成左右两路。左侧甬道宽阔，地面的暗红阵纹一路向下延伸，尽头还能看见一扇尚未完全合拢的内门。那里无疑是通往主墓室的近路。\\n\\n右侧却传来苏莹一声短促的呼喊。你循声看去，只见一扇横向闭合的石门正在缓缓封住侧道。苏莹被困在门后，脚踝让一只从地面弹起的铜扣锁住；她身后的退路早已被另一块落石堵死，只能眼看着门缝一点点收窄。\\n\\n来路同时响起整齐的撞击声。三具巡行傀儡正从狭窄的检修通道内挤出，铜制脚掌每落下一次，石壁上的积尘便簌簌而下。它们离岔口不过十余丈。\\n\\n若此刻进入左侧甬道，你与纪清寒仍能赶在内门合拢前直达主墓室。若转去右侧，近路势必封死，傀儡也会在救人时追到身后。\\n\\n纪清寒只看了那扇内门一眼，便转身走向苏莹所在的侧道。她抽出半截残剑，目光落在石门侧面的锁槽上。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "你撑住门，我进去断开铜扣。赶在后面的东西追上来前，把她带到门内。", expression: "alert", position: "right" },
];

const jiThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "su-ying", position: "left", expression: "wary" },
  { type: "narration", text: "石门足有两人高，门楣上套着五圈由浅入深的蛊纹。下方两道锁纹分别贴着左右门缝延伸，正将沿途汇来的暗红微光一缕缕引入门内。\\n\\n门下没有完全封死。少量发黑的血水从缝隙中渗出，里面每隔数息还会传来一次拖动重物的摩擦声。声音很轻，间或夹着一两声压抑的喘息。门后至少还有活人。\\n\\n苏莹蹲在门边，没有直接碰触蛊纹。她拾起一块碎石，压住左侧锁纹的一处交点。左边的红光刚暗下去，右侧锁纹便骤然一亮，随即送回一缕血色，将被压住的缺口重新接了起来。\\n\\n她立即松开碎石，退离门缝。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "五道蛊纹相套，门后封着的至少是五转蛊物。左右两道门锁会替彼此补回血纹，若不能同时截断，破开一处也没有用。", expression: "wary", position: "left" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "纪清寒取出包着魂丝的白绢。还未贴近石门，银线上那点微弱的光便自行亮起，比在检修石台上清晰了许多。她要找的温养神魂之物确实就在近处。\\n\\n可魂丝亮起的节奏，恰好与门下血水流动的间隔一致。那件蛊材究竟只是被封在同一座祭殿里，还是本就靠这座抽取气血的阵法滋养，眼下还无法确定。\\n\\n纪清寒把魂丝收回衣襟，目光从门缝下的血迹移到你脸上。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "开门后先救人，再查蛊材。若它当真靠活人的气血续存，便连同那只五转蛊一起毁掉。", expression: "softened", position: "right" },
  { type: "narration", text: "她走到左侧锁纹前，残剑尖端停在阵纹交汇处上方。你来到右侧，将掌心贴近另一处锁位。两边的红光一明一暗，下一次同时黯淡的间隙很快就要到来。" },
];

const jiBloodGateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "石门完全退入两侧墙壁，祭殿的轮廓逐渐从黑暗中显现出来。这里约有二十余丈见方，数根石柱撑着低沉的穹顶；中央是一座环形血池，半透明蛊茧悬在池心上方，每收缩一次，池面便随之荡开一圈波纹。\\n\\n五条较粗的祭线从不同墓道穿入殿中，最后汇入蛊茧下方。薛逢倒在右侧石阶旁，正抓住一根石柱勉强稳住身形；缠在腰间的血色细线不断将他向池边拖去。赵黎位于祭殿另一端，血纹蛊放出的数道血芒钉在地面，暂时挡住了脚下祭线，可每当他截断一处，附近的阵纹便会重新亮起。\\n\\n苏莹跟在你们身后踏过门槛。她脚下的石板忽然向内翻转，整个人随碎石滑落到低了一层的池沿。未等她站稳，一道从地缝中伸出的祭线已经缠住脚踝，将她朝环形血池拖去。她反手抓住池沿凸起，才没有立刻滑入血水。\\n\\n穹顶深处随即传来一连串机关转动声。五条祭线同时绷紧，地面的暗红阵纹也比先前亮了一层。是谁在墙后发动机关，殿中无人看见。\\n\\n纪清寒衣襟内的魂丝隔着白绢亮了起来。微光所指并非整个蛊茧，而是茧后石台上一团灰白蛊材。她只看了一眼，便将视线移向被拖动的三人。那团蛊材是否靠血祭滋养，至少要先让眼前的人活下来，才有机会查清。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "薛逢与赵黎离得最近，先截住这两道。苏莹在血池内侧，等站稳阵脚再过去。", expression: "alert", position: "right" },
  { type: "narration", text: "纪清寒提着残剑走向右侧阵纹，你则沿另一道祭线靠近赵黎。两处交点都在向池心输送血光，只要有一处失手，倒地之人便会被拖入血池。" },
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
    choices: [{ id: "ji-save-su", label: "与纪清寒一同把苏莹带离岔道", next: "jiThreshold", result: "你快步抢到石门前，双掌抵住两侧门沿，将真元尽数压进臂间。沉重的石门只停了一瞬，随即顶着你的手臂继续合拢。\\n\\n纪清寒侧身穿过门缝，残剑顺着地面的铜扣边缘切入。她没有用剑身硬撬，而是找准连接铜扣与石板的细销，接连斩了三次。第三声脆响落下，铜扣从苏莹脚边弹开。\\n\\n身后的脚步声已经到了岔口。最前一具傀儡抬起手臂，朝你的后背直扑过来。你不能回身，只能继续撑着门缝。石门的力道一寸寸压下，原本已经稳住的经脉也再次震得发麻。\\n\\n“再撑三息。”\\n\\n纪清寒将苏莹推向侧道深处，自己守在门内接应。你听见傀儡撞上石门外沿，掌下力道随之一沉。\\n\\n“既然伸了手，就别在半途松开。”\\n\\n你没有撤掌。等苏莹站稳，才借着纪清寒探出的手越过门槛。她拉你进入侧道，你随即收回真元。石门在身后轰然合拢，将第一具傀儡伸来的手臂挡在了另一侧。\\n\\n左侧近路的内门也在最后一刻沉入地面，再没有回去的余地。三人只能沿侧道向下。甬道转过数个弯后，空气中的血腥气越来越重，地面阵纹也重新汇拢到一处。\\n\\n前方，一扇布满暗红纹路的石门横在路尽头。苏莹扶着墙缓了口气，纪清寒则松开你的手腕，持残剑走到了门前。" }],
  },
  jiThreshold: {
    id: "jiThreshold", act: 3, node: 4, chapter: "第三幕 · 纪清寒线 · 节点 4 / 4", title: "共赴血门",
    events: jiThresholdEvents,
    choices: [{ id: "ji-open-gate", label: "按住右侧锁纹，与纪清寒同时截断门锁", next: "jiBloodGate", result: "两侧锁纹同时暗下的一刻，苏莹在后方低声道：“就是现在。”\\n\\n你将凝聚在掌中的真元压入右侧交点，截断正在回流的血光。纪清寒的残剑也在同一瞬落下，剑尖沿着左侧纹路横切数寸。\\n\\n两道锁纹齐齐断开。门上的红光本能地向缺口回涌，却再也找不到能够接续的另一端，只能从两侧向中央逐段熄灭。\\n\\n石门深处传来一声闷响，锁在门后的石栓落入地槽。紧接着，整扇门向内缓缓退开。先从缝隙中涌出的不是蛊光，而是一股积压已久的血腥气。\\n\\n拖拽声随之变得清晰。黑暗里，有人艰难地吸了一口气。" }],
  },
};

export const jiActFourScenes: Record<string, Scene> = {
  jiBloodGate: { id: "jiBloodGate", act: 4, node: 1, chapter: "第四幕 · 纪清寒线 · 节点 1 / 6", title: "先救活人", events: jiBloodGateEvents, choices: [{ id: "ji-cut-lines", label: "与纪清寒分头截住最先收紧的两道祭线", next: "jiBloodGuard", result: "你踩住赵黎身前的阵纹，将真元压入祭线交汇处。沿地面流动的血光顿时从中断开，缠在赵黎脚下的细线也随之松弛。\\n\\n几乎同一刻，纪清寒的残剑贴着薛逢腰侧斩过，将那道祭线截成两段。断口刚要沿阵纹重新接合，她便把剑尖压在交点之间，迫使两端血光停在剑锋两侧。薛逢终于止住滑势，却仍无法自行起身。\\n\\n两道祭线接连受阻，环形血池下方传来一声沉闷撞击。池水从内侧向外翻开，一只远比常人粗大的手掌按上石台边缘。随后，一道高大的黑影借力从血池中缓缓站起，正好挡在通往低层池沿的石阶前。\\n\\n苏莹仍抓着远处的池沿。你刚朝她所在的方向迈出一步，守门傀儡便转过头来，空洞的眼眶对准了你。\\n\\n纪清寒不能松开剑下的阵纹，只能留在薛逢身旁。她抬眼看向挡路的傀儡：“这里我守住。你把路打开。”\\n\\n你沿着池边向前，停在血傀儡与伤者之间。" }] },
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
