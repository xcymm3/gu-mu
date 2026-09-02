import type { Scene, VisualNovelEvent } from "../../model.ts";

const jiTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "narration", text: "你跃入黑暗，一把扣住纪清寒的手腕。两个人的重量同时坠在手臂上，几乎将你整条肩膀扯脱。\n\n第二条机关锁链紧随而至，贴着井壁横扫过来。纪清寒听声转身，以剑脊迎上链身。铁链被撞偏数寸，擦着你们头顶砸进石壁，震落大片碎屑。\n\n她趁这一瞬反手将长剑刺入井壁石缝。剑锋刮过青石，火星沿着下坠的轨迹一闪而逝，两人的坠势也随之慢了下来。数丈下方恰有一处凸出的检修石台，你借力荡近井壁，与她先后落了上去。\n\n双脚踏上石台时，承受了两人重量的剑身终于从中折断。剑尖留在石缝里，纪清寒只来得及收回半截残剑。你落地时用前臂撑住台沿，一块锐利的碎石划破衣袖，血很快洇了出来。\n\n纪清寒先抬头确认锁链没有再次落下，随后才看向你的手臂。她从行囊里取出疗伤散和一卷干净的布带，放在身旁的石面上。" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "手臂给我看。方才落得太重，经脉受了震，再拖下去，等机关重启，你未必还能稳住蛊。", expression: "alert", position: "right" },
];

const jiPromiseEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "井壁深处的机括声渐渐低下去。纪清寒确认上方的锁链一时不会再动，这才在石台内侧坐下，将残剑横放在膝前。\n\n她把方才用过的疗伤散收回行囊，又从贴身处取出一方折了数层的白绢。白绢展开，里面躺着一缕细若发丝的银线，末端只剩一点极淡的微光。\n\n纪清寒以指腹托住魂丝，渡入一线真元。过了近十息，那点微光才沿着银线向前挪动少许，随即又暗了下去。她静静等到光芒彻底停住，才把真元收回。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "这是我离家前留下的一缕魂丝。那边的气息越弱，它亮得便越慢。一个月前，还不必等这么久。", expression: "softened", position: "right" },
  { type: "narration", text: "她没有说明魂丝另一端系着哪位至亲，只将白绢四角重新拢起，却没有立刻收回去。\n\n纪清寒入墓并非为了五转蛊物本身。她打听到墓主生前曾搜集过能够温养神魂、延续生机的蛊材，这才随乔无咎来到荒原。只是沿途所见的血纹与禁制都在抽取入墓者的气血，那件所谓的续命蛊材究竟从何而来，已经不像传闻中那般干净。\n\n石台后方忽然传来一声轻响。一块原本嵌死在井壁里的窄石板向内退开，露出仅容一人侧身通过的检修通道。纪清寒看了一眼那道缝隙，又低头看向掌中的魂丝。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "我会找到它，也会先弄清它是如何炼成的。若墓里所谓的生机只能从旁人身上夺来……", expression: "softened", position: "right" },
  { type: "narration", text: "她没有把后半句话说完。魂丝末端的微光又颤了一下，很快归于暗淡。" },
];

const jiBurdenEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "narration", text: "检修通道走到尽头，前方分成左右两路。左侧甬道宽阔，地面的暗红阵纹一路向下延伸，尽头还能看见一扇尚未完全合拢的内门。那里无疑是通往主墓室的近路。\n\n右侧却传来苏莹一声短促的呼喊。你循声看去，只见一扇横向闭合的石门正在缓缓封住侧道。苏莹被困在门后，脚踝让一只从地面弹起的铜扣锁住；她身后的退路早已被另一块落石堵死，只能眼看着门缝一点点收窄。\n\n来路同时响起整齐的撞击声。三具巡行傀儡正从狭窄的检修通道内挤出，铜制脚掌每落下一次，石壁上的积尘便簌簌而下。它们离岔口不过十余丈。\n\n若此刻进入左侧甬道，你与纪清寒仍能赶在内门合拢前直达主墓室。若转去右侧，近路势必封死，傀儡也会在救人时追到身后。\n\n纪清寒只看了那扇内门一眼，便转身走向苏莹所在的侧道。她抽出半截残剑，目光落在石门侧面的锁槽上。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "你撑住门，我进去断开铜扣。赶在后面的东西追上来前，把她带到门内。", expression: "alert", position: "right" },
];

const jiThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "su-ying", position: "left", expression: "wary" },
  { type: "narration", text: "石门足有两人高，门楣上套着五圈由浅入深的蛊纹。下方两道锁纹分别贴着左右门缝延伸，正将沿途汇来的暗红微光一缕缕引入门内。\n\n门下没有完全封死。少量发黑的血水从缝隙中渗出，里面每隔数息还会传来一次拖动重物的摩擦声。声音很轻，间或夹着一两声压抑的喘息。门后至少还有活人。\n\n苏莹蹲在门边，没有直接碰触蛊纹。她拾起一块碎石，压住左侧锁纹的一处交点。左边的红光刚暗下去，右侧锁纹便骤然一亮，随即送回一缕血色，将被压住的缺口重新接了起来。\n\n她立即松开碎石，退离门缝。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "五道蛊纹相套，门后封着的至少是五转蛊物。左右两道门锁会替彼此补回血纹，若不能同时截断，破开一处也没有用。", expression: "wary", position: "left" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "纪清寒取出包着魂丝的白绢。还未贴近石门，银线上那点微弱的光便自行亮起，比在检修石台上清晰了许多。她要找的温养神魂之物确实就在近处。\n\n可魂丝亮起的节奏，恰好与门下血水流动的间隔一致。那件蛊材究竟只是被封在同一座祭殿里，还是本就靠这座抽取气血的阵法滋养，眼下还无法确定。\n\n纪清寒把魂丝收回衣襟，目光从门缝下的血迹移到你脸上。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "开门后先救人，再查蛊材。若它当真靠活人的气血续存，便连同那只五转蛊一起毁掉。", expression: "softened", position: "right" },
  { type: "narration", text: "她走到左侧锁纹前，残剑尖端停在阵纹交汇处上方。你来到右侧，将掌心贴近另一处锁位。两边的红光一明一暗，下一次同时黯淡的间隙很快就要到来。" },
];

const jiBloodGateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "石门完全退入两侧墙壁，祭殿的轮廓逐渐从黑暗中显现出来。这里约有二十余丈见方，数根石柱撑着低沉的穹顶；中央是一座环形血池，半透明蛊茧悬在池心上方，每收缩一次，池面便随之荡开一圈波纹。\n\n五条较粗的祭线从不同墓道穿入殿中，最后汇入蛊茧下方。薛逢倒在右侧石阶旁，正抓住一根石柱勉强稳住身形；缠在腰间的血色细线不断将他向池边拖去。赵黎位于祭殿另一端，血纹蛊放出的数道血芒钉在地面，暂时挡住了脚下祭线，可每当他截断一处，附近的阵纹便会重新亮起。\n\n苏莹跟在你们身后踏过门槛。她脚下的石板忽然向内翻转，整个人随碎石滑落到低了一层的池沿。未等她站稳，一道从地缝中伸出的祭线已经缠住脚踝，将她朝环形血池拖去。她反手抓住池沿凸起，才没有立刻滑入血水。\n\n穹顶深处随即传来一连串机关转动声。五条祭线同时绷紧，地面的暗红阵纹也比先前亮了一层。是谁在墙后发动机关，殿中无人看见。\n\n纪清寒衣襟内的魂丝隔着白绢亮了起来。微光所指并非整个蛊茧，而是茧后石台上一团灰白蛊材。她只看了一眼，便将视线移向被拖动的三人。那团蛊材是否靠血祭滋养，至少要先让眼前的人活下来，才有机会查清。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "薛逢与赵黎离得最近，先截住这两道。苏莹在血池内侧，等站稳阵脚再过去。", expression: "alert", position: "right" },
  { type: "narration", text: "纪清寒提着残剑走向右侧阵纹，你则沿另一道祭线靠近赵黎。两处交点都在向池心输送血光，只要有一处失手，倒地之人便会被拖入血池。" },
];

const jiBloodGuardEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "血傀儡从池中完全站起，足有常人两倍高。粗重骨架外缝着早已失去生机的皮肉，左腕缠有一条浸透血水的锁链，右臂则被炼得格外粗壮。胸骨中央没有心脏，只有一枚拳头大小的暗红血核，正随着蛊茧收缩缓慢鼓动。\n\n纪清寒留在数丈外的石阶旁，残剑横压在两段祭线之间。每当血光试图越过剑锋重新接合，她便渡入一缕真元，将两端再次分开。薛逢尚未脱离阵纹，她无法抽身上前。\n\n更低一层的池沿上，苏莹仍抓着石缝。缠在脚踝上的祭线时松时紧，正在把她一点点拖向血池。\n\n血傀儡踏上通往低层的石阶，胸腔血核随之亮起。它左腕一沉，原本拖在池水中的锁链缓缓抬离水面。你若不能从这里打开缺口，后方被截住的祭线迟早会再次收紧。" },
];

const jiRescueEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "血傀儡倒在池边，胸腔中残余的红光彻底熄灭。你来不及察看它的残骸，转身便向纪清寒所在的石阶赶去。\n\n左侧石台上，赵黎以血纹蛊放出的细线缠住祭线断口，借力站稳。他没有等人相助，便收拢血线，沿石柱后方退离了仍在发光的阵纹。\n\n薛逢却还倒在另一根石柱旁。纪清寒的残剑压在他身侧的线槽中，将断开的两端隔在剑锋左右；只要她稍一松手，血光便会重新接合。\n\n你俯身按住线槽，把真元压入两段血光之间。纪清寒等到断口不再前移，才抽出残剑，顺着祭线贴近石面的部分横切而过。失去牵引后，薛逢终于能够挪动身体。你们将他带到石柱后方，避开了仍在收缩的阵纹。\n\n祭殿内只剩最后一道祭线还在输送血光。下层池沿上，苏莹一手扣住石缝，另一只手已经够不到上方石阶。缠在脚踝上的祭线每收紧一次，她的手指便从湿滑的石面上移开少许。\n\n通往下层的石阶上还残留着血傀儡带起的血水。纪清寒守住石台上方，将残剑压向祭线经过的浅槽，为苏莹争得片刻。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "我压住这里。你下去，把她带上来。", expression: "alert", position: "right" },
];

const jiArrayTruthEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "你来到祭殿西侧，沿墙缝向上摸索。方才缩回来的细线穿过一块略微凹陷的石板，没入墙后。你以真元压住线身，再顺着它收缩的方向推动石板，里面随即传来一声轻响。\n\n石板向侧面退开尺许，露出一条狭窄的检修夹道。夹道只有数丈长，尽头接着一间高出血池半层的石室。几根控制线从夹道两侧穿过，分别缠在室内的石轮与扳杆上。即使站在石室入口，仍能透过身后的墙缝看见祭殿里的石柱，也能听见蛊茧收缩时带起的水声。\n\n乔无咎站在控制台前，正试图转动其中一只石轮。连接血池的细线随着他的动作逐寸绷紧，可外侧祭线已经断开，石轮转过半圈便被卡住。\n\n第一幕中用来带路的泛黄兽皮残图，此刻就摊在他手边。图上原有的猩红标记正与环形血池的位置相合；标记周围又添了许多细小墨线，分别指向沿途经过的石闸、幻阵与祭殿控制槽。那些线条深浅不一，显然不是同时画上去的。\n\n乔无咎松开石轮，转身看向夹道。到了这一步，他已不再遮掩，也没有急着收起那张残图。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "带你们进来，本就是要有人把这些阵位走活。几条散修的命换一只五转蛊，原算不得亏。可你们偏要回头救人，倒让我白等了这许多年。", expression: "smug", position: "left" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "battle" },
  { type: "narration", text: "身后传来轻微的脚步声。纪清寒只走到西墙入口便停了下来。从这里回望，地面的几处断口已经重新泛起暗红微光；赵黎等人还在石柱后方，中央蛊茧也没有停止收缩。\n\n她看清控制台上的残图，又看了一眼仍在缓慢转动的石轮，残剑随即横在身前。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "这里必须有人守住。控制线若再接上一根，外面的人便会重新被拖回去。", expression: "battle", position: "right" },
  { type: "narration", text: "乔无咎身后的几根扳杆已经开始自行下沉。你站在控制室入口，再向前一步便会进入他的攻击范围。纪清寒没有催促，只等着你的回答。" },
];

const jiQiaoDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "cut" },
  { type: "narration", text: "控制室只有数丈宽，正中的石台却占去近半空间。三组牵机丝分别穿过头顶石梁、左右侧门与脚下砖缝，最后汇入乔无咎面前的控制台。若要靠近他，就必须从这些机关之间穿过去。\n\n乔无咎抬手扯下两根垂在梁间的主线，将线端扣在指间。控制台右侧的阵枢随之亮起，两扇仅容傀儡通过的侧门也各自退开一道缝隙。\n\n夹道后方传来残剑抵住线槽的轻响。纪清寒仍在祭殿守着断线，无法进入这里；但原本向夹道游来的血光也停在了西墙之外。\n\n乔无咎向控制台后退了半步。他没有离开机关与主线之间的位置，只将几根扳杆逐一推向能够随手触及的方向。你若让他重新转动中央石轮，外侧刚被救下的人便会再次落入祭阵。\n\n你收拢真元，踏上石台边缘。头顶的第一组牵机丝已经开始下落。" },
];

const jiDestroyGuEvents: VisualNovelEvent[] = [
  { type: "background", asset: "cg.scene.jiDestroyGu", transition: "fade" },
  { type: "narration", text: "你沿夹道回到祭殿时，环形血池已经漫过最下方一级石阶。赵黎、薛逢与苏莹仍留在石柱后方，纪清寒则持着残剑守在池边。\n\n控制石轮虽已锁死，悬在池心上方的蛊茧却没有停止蜕变。茧壳中央裂开一道细缝，一片尚未完全展开的复眼正在缝隙后缓慢转动。它还不能脱离蛊茧，池中余下的血光却仍在沿茧壳向上攀升。\n\n蛊茧后方，那团灰白养魂蛊材也显出了原貌。数根暗红细丝从蛊茧底部穿出，扎进蛊材内部。外侧祭线断开后，蛊材原本温和的微光迅速黯淡，积存在其中的血光反而沿细丝流回茧内。\n\n纪清寒看着那团蛊材，取出包着魂丝的白绢。银线末端仍在微弱发亮，灰白蛊材却已经无法再与它呼应。她将白绢收回衣襟，没有伸手去取蛊材。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "它所谓的生机，都是从祭线另一端取来的。这东西不能带走。", expression: "softened", position: "right" },
  { type: "narration", text: "她以残剑向前送出一线剑气。剑气刚触及茧壳，地面残阵便亮起数段暗红纹路，将外来真元引入血池。下一刻，那道真元随血光回到蛊茧，壳后的复眼也随之张开了一分。\n\n普通真元只会成为它最后蜕变的养分。苏莹贴近池边辨认片刻，指向蛊茧下方相对而立的两处阵眼。那里的血光仍在彼此补回，与开启血门时的左右双锁如出一辙。" },
  { type: "character", action: "show", character: "su-ying", position: "left", expression: "wary" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "两边阵眼通向同一处蛊核。必须同时送入逆行的本命蛊息，让它们在核心相冲。普通真元会被吞掉，只有本命蛊崩解时放出的根本蛊息，阵法来不及化用。", expression: "wary", position: "left" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "如此施为，两人的本命蛊都会一同毁去，积累至今的修行根基也无法保留。纪清寒走到左侧阵眼前，将残剑留在手中，另一只手按向阵纹交汇处。\n\n她隔着血池看向你。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "蛊材不要了，修为也可以不要。若你愿意承担这个代价，出去以后的路，我与你一起走。", expression: "softened", position: "right" },
  { type: "narration", text: "蛊茧又收缩一次，裂缝随之向两侧延长。右侧阵眼就在你脚下，只等两边同时逆转蛊息。" },
];

const jiAftermathEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.dawn-exit", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "injured" },
  { type: "narration", text: "灰白蛊尘落尽后，纪清寒伸出的手仍停在血池对面。你握住她的手，借力从阵眼旁站起。\n\n体内已经感受不到本命蛊的回应，往日随念而动的真元也没有再出现。纪清寒的情形与你相同。两人仍能站立行走，只是从这一刻起，墓中任何一处需要真元应对的禁制都不能再贸然触碰。\n\n石柱后方，赵黎最先自行起身。他收回血纹蛊，冷眼扫过正在熄灭的阵纹：“主阵虽毁，石梁与墓道未必还在。原路走不通。”\n\n薛逢扶着石柱站稳，试着走了几步。他没有再去看散落池边的器物，只低声道：“薛某走得动，不必留人照看。”\n\n苏莹也从地上起身。祭线带来的虚弱尚未完全退去，却不妨碍她缓慢行走。五人越过已经平静的血池，先后进入西墙后的控制室。\n\n乔无咎的尸身仍在控制台旁，泛黄兽皮残图摊在石面上。苏莹逐条辨认他后来补画的细线，很快发现其中一条从控制室后方绕出，避开血池、幻阵与来路上的石梁，最后停在墓门内侧。\n\n线尾旁边画着一道向下的短痕。苏莹依照标记摸到控制台下方，从积灰中找出一根横置石闩。石闩连着墙内配重，不需真元便能开启。众人合力将它拉到尽头，控制室后方的一块窄石板随之缓缓升起，露出仅容一人通行的检修甬道。\n\n没有蛊光从门后涌出，只有一股带着湿土气息的冷风穿过缝隙。乔无咎为自己留下的退路，终于落到了被他送进祭阵的人手中。\n\n出发前，纪清寒取出包着魂丝的白绢。银线末端的微光比先前更弱，却还没有熄灭。她看了片刻，将白绢重新收入衣襟，残剑也仍握在手中。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "还来得及。先出去，再想别的办法。", expression: "softened", position: "right" },
  { type: "narration", text: "赵黎已经站到甬道入口，薛逢与苏莹也做好了动身的准备。你与纪清寒留在队尾，等前面三人依次进入，才一同迈向那道窄门。" },
];

const jiEpilogueEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.dawn-exit", transition: "fade" },
  { type: "narration", text: "赵黎推开最后一道石挡，清晨的冷风便灌入甬道。昨夜的暴雨已经停了，墓门外的荒原仍积着大片水洼。五人依次走出石门，在雨后的泥地上停下脚步。\n\n赵黎辨认过方向，只留下一句“此墓已毁，往后各走各路”，便独自沿北面的山道离开。他没有道谢，也没有再提血魔蛊。\n\n薛逢临走前整了整沾满泥灰的衣襟，第一次收起惯常的笑脸，向你与纪清寒郑重拱手：“血池里那条命，薛某记下了。”\n\n苏莹看向纪清寒收在衣襟内的白绢，低声问道：“你们要去找魂丝另一端的人？”\n\n纪清寒点了点头。苏莹没有再问蛊材，只替你们指明了离荒原最近的车道，随后与薛逢先后离去。\n\n你与纪清寒一路步行，又在沿途集镇换乘过几次运货的车马。银线末端的光一天比一天弱，所幸在它彻底熄灭前，你们赶到了那处偏远山居。\n\n魂丝另一端的人还活着，也认出了纪清寒。你们没有带回能够逆转生死的蛊材，只能按寻常方法煎药、照看饮食，陪着病榻上的人度过剩下的日子。那条银线没有重新明亮，却比入墓前多维持了一个冬天。次年开春的一个清晨，魂丝末端安静地暗了下去。\n\n纪清寒收起白绢，在床边坐了很久。你把已经温凉的药碗端出去，没有劝她，也没有离开。\n\n此后几年，两人留在山中。照料病人的那段日子教会了你们分辨常用药草、控制煎煮火候，也让原本只会应付修士伤势的纪清寒熟悉了寻常人的病痛。为了谋生，你们把旧屋前间收拾出来，做成一间小药铺。\n\n又是一个清晨。纪清寒在后院用半截残剑劈开晒干的药根。失去真元后，它只是一截坚硬旧铁，用来做这些粗活倒很合手。你在前间清点药包、布带与账册，把昨日用空的格子逐一补齐。\n\n门外很快响起脚步声。有人在屋檐下收起斗笠，轻轻叩了两下门板。纪清寒洗净手上的药屑，从后院走进来；药铺的木门还闩着，只等你把它推开。" },
];

export const jiActThreeScenes: Record<string, Scene> = {
  jiTrail: {
    id: "jiTrail", act: 3, node: 1, chapter: "第三幕 · 纪清寒线 · 节点 1 / 4", title: "断剑回声",
    events: jiTrailEvents,
    choices: [{ id: "ji-bind-wound", label: "坦然承认伤势，让她替你重新包扎", next: "jiPromise", result: "你不再遮掩，卷起被血浸湿的衣袖。纪清寒将疗伤散敷在伤处，又沿着前臂按住几处受震的经脉，这才用布带一圈圈缠紧。\n\n“伤口一时好不了。照我按过的次序运转真元，别让气血再冲开布结。”\n\n你依言调息，落地时散乱的气机渐渐归于平稳。伤势并未消失，牵动手臂时依旧作痛，但几条相互冲撞的经脉已经重新畅通，往后再遇险境，也能多承受几分冲击。\n\n包扎完毕，纪清寒持着残剑守住石台上方。机关转动的声响逐渐远去，你们终于有了片刻喘息。", effect: { maxHealth: 4 } }],
  },
  jiPromise: {
    id: "jiPromise", act: 3, node: 2, chapter: "第三幕 · 纪清寒线 · 节点 2 / 4", title: "未尽之约",
    events: jiPromiseEvents,
    choices: [
      { id: "ji-urge-living", label: "提醒她：若蛊材以活人祭炼，带回去便是拿别人的命续命", next: "jiBurden", result: "你的目光停在魂丝上，没有避开她方才未能说完的话。\n\n“若那件蛊材要用活人祭炼，拿它回去，不过是把一条命换成另一条。”\n\n纪清寒指间的白绢慢慢收紧。片刻后，她将魂丝重新包好，收入衣襟。\n\n“我知道。”她看向已经开启的检修通道，“所以更要亲眼确认。若真是如此，我会亲手毁了它。我要救的人，也不会肯用别人的命换。”\n\n她拿起残剑，先一步侧身进入通道。经过你身旁时，她脚步稍停：“你若看见我迟疑，便再说一遍。”" },
      { id: "ji-see-the-end", label: "告诉她：先找到蛊材查清代价，无论取舍，都陪她到最后", next: "jiBurden", result: "“先找到它。”你说道，“若能用，便设法带回去；若不能用，也要看清它究竟害过多少人。无论最后带走还是毁掉，我陪你走到那里。”\n\n纪清寒抬眼看了你一会儿。井壁里又传来一阵遥远的转轴声，她却没有立刻移开视线。\n\n“这未必是一条能回头的路。”\n\n“我知道。”\n\n她将魂丝仔细收回衣襟，起身拿起残剑。走进检修通道前，她把原本准备独自守住前方的剑势略微收窄，为你留出了并肩通行的位置。\n\n“那便一起看清。”" },
    ],
  },
  jiBurden: {
    id: "jiBurden", act: 3, node: 3, chapter: "第三幕 · 纪清寒线 · 节点 3 / 4", title: "不可松手",
    events: jiBurdenEvents,
    choices: [{ id: "ji-save-su", label: "与纪清寒一同把苏莹带离岔道", next: "jiThreshold", result: "你快步抢到石门前，双掌抵住两侧门沿，将真元尽数压进臂间。沉重的石门只停了一瞬，随即顶着你的手臂继续合拢。\n\n纪清寒侧身穿过门缝，残剑顺着地面的铜扣边缘切入。她没有用剑身硬撬，而是找准连接铜扣与石板的细销，接连斩了三次。第三声脆响落下，铜扣从苏莹脚边弹开。\n\n身后的脚步声已经到了岔口。最前一具傀儡抬起手臂，朝你的后背直扑过来。你不能回身，只能继续撑着门缝。石门的力道一寸寸压下，原本已经稳住的经脉也再次震得发麻。\n\n“再撑三息。”\n\n纪清寒将苏莹推向侧道深处，自己守在门内接应。你听见傀儡撞上石门外沿，掌下力道随之一沉。\n\n“既然伸了手，就别在半途松开。”\n\n你没有撤掌。等苏莹站稳，才借着纪清寒探出的手越过门槛。她拉你进入侧道，你随即收回真元。石门在身后轰然合拢，将第一具傀儡伸来的手臂挡在了另一侧。\n\n左侧近路的内门也在最后一刻沉入地面，再没有回去的余地。三人只能沿侧道向下。甬道转过数个弯后，空气中的血腥气越来越重，地面阵纹也重新汇拢到一处。\n\n前方，一扇布满暗红纹路的石门横在路尽头。苏莹扶着墙缓了口气，纪清寒则松开你的手腕，持残剑走到了门前。" }],
  },
  jiThreshold: {
    id: "jiThreshold", act: 3, node: 4, chapter: "第三幕 · 纪清寒线 · 节点 4 / 4", title: "共赴血门",
    events: jiThresholdEvents,
    choices: [{ id: "ji-open-gate", label: "按住右侧锁纹，与纪清寒同时截断门锁", next: "jiBloodGate", result: "两侧锁纹同时暗下的一刻，苏莹在后方低声道：“就是现在。”\n\n你将凝聚在掌中的真元压入右侧交点，截断正在回流的血光。纪清寒的残剑也在同一瞬落下，剑尖沿着左侧纹路横切数寸。\n\n两道锁纹齐齐断开。门上的红光本能地向缺口回涌，却再也找不到能够接续的另一端，只能从两侧向中央逐段熄灭。\n\n石门深处传来一声闷响，锁在门后的石栓落入地槽。紧接着，整扇门向内缓缓退开。先从缝隙中涌出的不是蛊光，而是一股积压已久的血腥气。\n\n拖拽声随之变得清晰。黑暗里，有人艰难地吸了一口气。" }],
  },
};

export const jiActFourScenes: Record<string, Scene> = {
  jiBloodGate: { id: "jiBloodGate", act: 4, node: 1, chapter: "第四幕 · 纪清寒线 · 节点 1 / 6", title: "先救活人", events: jiBloodGateEvents, choices: [{ id: "ji-cut-lines", label: "与纪清寒分头截住最先收紧的两道祭线", next: "jiBloodGuard", result: "你踩住赵黎身前的阵纹，将真元压入祭线交汇处。沿地面流动的血光顿时从中断开，缠在赵黎脚下的细线也随之松弛。\n\n几乎同一刻，纪清寒的残剑贴着薛逢腰侧斩过，将那道祭线截成两段。断口刚要沿阵纹重新接合，她便把剑尖压在交点之间，迫使两端血光停在剑锋两侧。薛逢终于止住滑势，却仍无法自行起身。\n\n两道祭线接连受阻，环形血池下方传来一声沉闷撞击。池水从内侧向外翻开，一只远比常人粗大的手掌按上石台边缘。随后，一道高大的黑影借力从血池中缓缓站起，正好挡在通往低层池沿的石阶前。\n\n苏莹仍抓着远处的池沿。你刚朝她所在的方向迈出一步，守门傀儡便转过头来，空洞的眼眶对准了你。\n\n纪清寒不能松开剑下的阵纹，只能留在薛逢身旁。她抬眼看向挡路的傀儡：“这里我守住。你把路打开。”\n\n你沿着池边向前，停在血傀儡与伤者之间。" }] },
  jiBloodGuard: { id: "jiBloodGuard", act: 4, node: 2, chapter: "第四幕 · 纪清寒线 · 节点 2 / 6", title: "血池救援", events: jiBloodGuardEvents, battle: { enemyName: "血傀儡", enemyHealth: 20, victoryNext: "jiRescue", defeatNext: "ending", victoryFlag: "纪清寒线血傀儡已毁", defeatFlag: "死于守门血傀儡", defeatEnding: "deathByBloodGuard" } },
  jiRescue: { id: "jiRescue", act: 4, node: 3, chapter: "第四幕 · 纪清寒线 · 节点 3 / 6", title: "一个不落", events: jiRescueEvents, choices: [{ id: "ji-finish-rescue", label: "沿石阶踏下池沿，截断缠住苏莹的最后一道祭线", next: "jiArrayTruth", result: "你踏过两级沾着血水的石阶，在苏莹手指滑脱前俯身抓住她的前臂。脚下的池沿只有半尺来宽，你先将一只脚抵进石阶与池壁的夹角，稳住两人的重量，随后循着她脚边的血光找到了祭线嵌入石面的连接处。\n\n你并指压住那里，将真元送入石缝。祭线猛地绷直，表面红光沿着受力处断成两截。苏莹身上的牵引随之一松，你借势将她托向上方。\n\n纪清寒在石台边俯身接住苏莹的手臂。她以残剑压住上方不断抽动的线槽，与你一上一下合力，把人带回了石台。直到苏莹在石柱后坐稳，她才收回剑锋。\n\n断在池沿的最后一截祭线没有垂入血池，反而贴着地面迅速回缩。它越过几处阵纹，最后没入祭殿西侧一道极窄的墙缝。周围原本已经失去动静的断线末端也同时抽动了一下，齐齐偏向同一处。\n\n你沿墙缝看去，隐约看见几根比祭线更细的控制线藏在石壁后方。血池中的蛊茧仍在缓慢收缩，可这些线连接的并不是蛊茧，而是墙后的另一处机关。" }] },
  jiArrayTruth: {
    id: "jiArrayTruth", act: 4, node: 4, chapter: "第四幕 · 纪清寒线 · 节点 4 / 6", title: "线后之人", events: jiArrayTruthEvents,
    choices: [
      { id: "ji-guard-the-wounded", label: "请她守住祭殿与断线，自己去切断控制机关", next: "jiQiaoDuel", result: "“断口和伤者交给你。”你看向乔无咎身后的控制台，“我进去截住他。”\n\n纪清寒没有因这一句托付再作争执。她退到西墙入口，残剑贴着最先亮起的线槽压下，将墙内外的血光再次隔开。\n\n“身后不会有祭线追上你。”她说道，“去吧。”\n\n你将祭殿里的水声留在身后，侧身穿过夹道，踏上控制室的石台。乔无咎松开最后一根扳杆，缓缓转过身来。" },
      { id: "ji-promise-return", label: "告诉她自己会回来，余下的路还要一起走", next: "jiQiaoDuel", result: "你没有立刻迈进控制室，而是回头看向纪清寒。\n\n“守住外面。我会回来，剩下的路还要一起走。”\n\n纪清寒握着残剑，目光在你脸上停了片刻。祭殿中的断线又亮起一道，她转身以剑锋将血光截住，这才应道：“那便说定了。你回来，我们一起带他们出去。”\n\n你点了点头，穿过最后几步夹道，独自踏入控制室。身后剑锋落入线槽的轻响传来，乔无咎也在此时松开扳杆，正面挡住了你。" },
    ],
  },
  jiQiaoDuel: { id: "jiQiaoDuel", act: 4, node: 5, chapter: "第四幕 · 纪清寒线 · 节点 5 / 6", title: "斩断执线者", events: jiQiaoDuelEvents, battle: { enemyName: "乔无咎", enemyHealth: 24, victoryNext: "jiDestroyGu", defeatNext: "ending", victoryFlag: "乔无咎已伏", defeatFlag: "死于乔无咎", defeatEnding: "deathByQiao" } },
  jiDestroyGu: { id: "jiDestroyGu", act: 4, node: 6, chapter: "第四幕 · 纪清寒线 · 节点 6 / 6", title: "破蛊断脉", events: jiDestroyGuEvents, choices: [{ id: "ji-break-gu", label: "按住右侧阵眼，与纪清寒同时逆转本命蛊息", next: "jiAftermath", result: "你俯身按住右侧阵眼，将蛊息收回本命蛊中。纪清寒在血池对面做好了同样的准备，残剑始终握在另一只手里。\n\n苏莹盯着两处阵眼交替亮起的血光，依次报出三声。最后一声落下，你与纪清寒同时逆转蛊息。两股不再循常法运转的根本蛊息分别穿过左右阵眼，直抵蛊茧核心。\n\n残阵立即将右侧血光引向左侧，又把左侧血光送回右侧，试图像先前一样补全缺口。两股方向相反的蛊息却在回流途中正面相撞，沿着彼此补合的纹路一同冲入蛊核。\n\n你体内的本命蛊先传来一声极轻的裂响，随后从核心开始崩散。血池另一侧，纪清寒周身最后一层寒意也在同一刻褪去。两人的修为随蛊息不断注入阵眼，直至再也感受不到本命蛊的回应。\n\n蛊茧上的裂缝停住了。缝隙后的复眼只来得及转动半周，便从边缘逐次黯淡。连接灰白蛊材的暗红细丝随之断裂，茧壳、蛊材与尚未完成蜕变的血魔蛊一同失去形状，化作灰白蛊尘落入已经平静的池水。\n\n祭殿各处的阵纹先后熄灭。纪清寒仍握着残剑，隔着不再流动的血池向你伸出手。" }] },
};

export const jiActFiveScenes: Record<string, Scene> = {
  jiAftermath: { id: "jiAftermath", act: 5, node: 1, chapter: "第五幕 · 纪清寒线 · 节点 1 / 2", title: "灰中生路", events: jiAftermathEvents, choices: [{ id: "ji-leave-tomb", label: "与纪清寒走在队尾，带众人进入检修甬道", next: "jiEpilogue", result: "你与纪清寒相互借力，侧身进入控制室后的窄门。赵黎独自走在最前方，凭尚存的修为探查沿途石壁；薛逢与苏莹跟在中间，脚步虽慢，却都能靠自己继续前行。\n\n检修甬道绕过祭殿后方，沿山腹缓缓向上。每经过一处转折，前方的人都会停下片刻，直到队尾的脚步声传来才继续走。\n\n沿途几处旧机关都保持着停转时的模样。控制石轮已经锁死，血祭阵纹也彻底熄灭，墙内的齿轮与牵机丝无法再被唤醒。众人没有因此加快脚步，仍逐块试过落脚的石面，避开松动之处。\n\n走了不知多久，甬道前方出现一段向上的石阶。湿土与雨水的气息沿阶而下，外面的风声也渐渐清晰。赵黎推开尽头那块虚掩的石挡，墓门内侧随即透进一线微白天光。\n\n五个人都停在了那道光前。你与纪清寒已经无法再撑起护体蛊光；从血池边带出的赵黎、薛逢与苏莹，却都站在这里。" }] },
  jiEpilogue: { id: "jiEpilogue", act: 5, node: 2, chapter: "第五幕 · 纪清寒线 · 节点 2 / 2", title: "山野药铺", events: jiEpilogueEvents, choices: [{ id: "ji-end", label: "把药铺的门推开", next: "ending", result: "你取下木闩，将两扇门板向外推开。等在檐下的是一名走山路时擦伤手臂的樵夫，衣袖上还沾着湿泥。\n\n你请他在前间坐下，解开昨日裁好的干净布带。纪清寒查看伤处后，从药柜中取出止血药粉与一碗清水。你依她说的次序清理泥沙、敷上药粉，再用布带把伤处稳稳缠好。\n\n樵夫留下几枚铜钱，提起柴担离开。第二名等候的山民随即走进门来，手中拿着一张已经受潮的旧药方。\n\n后院煎药的水声渐渐响起。纪清寒回去看火，你将旧药方展平，按住被风卷起的一角。等她从后院报出缺少的药材，你便从柜中逐味取出。\n\n日头越过屋檐时，药铺的门仍然开着。半截残剑挂回后院墙上，晚些还要用来切下一批药根；前间的两张木凳并排放着，你与纪清寒谁先空下手，谁便去接下一位来客。", effect: { ending: "severed" } }] },
};

export const jiRouteScenes: Record<string, Scene> = { ...jiActThreeScenes, ...jiActFourScenes, ...jiActFiveScenes };
