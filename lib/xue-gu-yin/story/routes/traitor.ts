import type { Scene, VisualNovelEvent } from "../../model.ts";

const traitorTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "narration", text: "浓雾漫过石厅，翻板起落的闷响接连从脚下传来。薛逢没有像旁人那样出声示警，只踩着尚未翻转的石沿，接连向墙角退去。到第三步时，你忽然欺近，扣住他的后领，借他落脚之势一同踏上墙边那块窄石。" },
  { type: "narration", text: "近看才发现，周围四块石板已有两块翻入深坑。薛逢踩中的石沿都贴着转轴根部，机关发动时只会轻颤。他认得这些落脚处。" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "panicked" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "道友轻些！薛某不过耳朵灵，听见哪块石板下有机括响罢了。", expression: "panicked", position: "left" },
  { type: "narration", text: "你没有与他争辩，只让他继续走。薛逢脸上的笑容僵了片刻，随后俯身按过墙根两处不起眼的凹槽。附近翻板的震动随之一缓，仅够二人抢过下一段石路，身后的凹槽便自行弹回。" },
  { type: "narration", text: "如此走出十余步，前方已是石厅尽头。墙角看似封死，底部却没有积灰，砖缝间还透出极细的气流。薛逢伸手摸向两块微微凸起的石砖，指尖临近时又忽然停住。" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "墙后未必是生路。若次序错了，暗门封死，你我都得困在这片雾里。", expression: "panicked", position: "left" },
  { type: "narration", text: "薛逢连暂缓机关的凹槽都摸得准，却还不肯承认来过。你盯着他停在石砖前的手，等他开门。" },
];

const traitorTrailConvergence = "暗门后没有外界风声，只有牵机丝擦过石槽的细响。你让薛逢先行，自己落后半步。薛逢没有拒绝，也没有回头。门后的路还要靠他辨认，你暂时不会放他走。";

const traitorKnifeEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "battle" },
  { type: "narration", text: "夹道尽头比来路稍宽，石壁内嵌着一处半人高的检修龛。数根牵机丝从龛中穿墙而过，门边另有一道形如印齿的凹槽。薛逢走到这里以后，右手始终拢在袖中，脚步也比先前慢了许多。" },
  { type: "narration", text: "你没有催促，只盯着龛内的牵机丝。薛逢袖口微动时，其中一根细丝也跟着轻颤，显然不是脚步震动所致。你骤然扣住他的手腕向外一带，一枚牵机副印随之落在石面上。" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "道友莫急！这东西只能开几道外门，碰不得墓里的核心禁制。", expression: "battle", position: "left" },
  { type: "narration", text: "你拾起副印，抵近门边凹槽。印齿尚未完全嵌入，龛内一根牵机丝便自行松开，墙后的门栓也向内退了半寸。副印与此处机关确实同出一套，薛逢再难用听声辨位搪塞过去。" },
  { type: "narration", text: "追问之下，薛逢承认收了乔无咎的好处，曾入墓维护外围翻板与暗门，这次还要把同行者引到指定的路上。墓穴核心与控制室后的路，乔无咎却一直瞒着他。眼前这道通往控制室的门，凭副印就能打开。" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "薛某可以带你去见他，也能当面对质。留我一命，门后还有什么安排，我替道友问个清楚。", expression: "injured", position: "left" },
  { type: "narration", text: "他说话时上身未动，右脚却贴着石面悄然向后挪去。检修龛最下方，一根原本松垂的牵机丝被他的脚跟一点点压紧，墙后随即传来一声极轻的机括咬合。你不动声色地催起本命蛊；只要他的脚跟再落下半寸，这道警线便会把夹道里的变故传入控制室。" },
];

const traitorBargainEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "内门缓缓合拢，真正的控制室出现在眼前。石室中央隔着数步并列两座石台：主台上的牵机丝没入墓穴深处，连接祭阵内层；靠墙的副台则分出数十道细线，通往外围翻板、暗门与岔路。两台各有一处印槽，彼此并不相通。" },
  { type: "narration", text: "乔无咎立在主台前，一手压着嵌于其中的主印。听见内门动静，他立刻侧过身，掌下几道牵机丝同时绷紧。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "薛逢呢？", expression: "smug", position: "right" },
  { type: "narration", text: "你将牵机副印放在身前，并未向他靠近：“回不来了。”乔无咎看过副印，又扫了一眼控制室角落那根始终未曾响动的警线，按住主印的手没有放松。" },
  { type: "narration", text: "副台石盘上，三组细线缓缓移动。右侧窄道、左侧甬道、下方岔路，正与雾中纪清寒、赵黎、苏莹离开的方向相合。细线的张力能传回落脚轻重与所在路段，墓道里的声音和景象却传不过来。" },
  { type: "narration", text: "乔无咎要守着主台开内门，还得有人同时拨动副台，将三条外路引向祭阵。两座台隔着数步，他一个人顾不过来。薛逢死了，副印又在你手里。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "你接手副台，把他们引到祭阵。我开内门。等血魔蛊现世，再凭各自手段分取所得。", expression: "smug", position: "right" },
  { type: "narration", text: "乔无咎的手仍压着主印，你站在副台印槽外，没有靠近。只要他关门，你就可能被封在控制室与夹道之间；可少了你操作副台，他也来不及将三路人引入祭阵。你们暂时都还用得着对方。" },
];

const traitorInterlockEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "第一道祭阵内门开启后，乔无咎转动主印，准备接续第二道机关。主印刚过半圈，两座石台之间便响起一阵低沉的摩擦声。一根横向牵机杆从石座内部缓缓伸出，两端各露出一道锁闩，分别扣住主台与副台的印槽。" },
  { type: "narration", text: "乔无咎对此并不意外。他检查过主台刻度，随即压下自己一侧的锁闩。数枚卡齿相继咬合，主印被固定在当前位置，方才开启的内门也停稳下来。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "主副两台需同时落闩，后面的门才会接着开。机关这一轮走完以前，谁强拔印牌，内外两路都会卡死。", expression: "smug", position: "right" },
  { type: "narration", text: "你沿横杆看去，两端齿槽相互咬住。主印一退，副台引路线就会锁死；副台逆转，祭阵内门也会卡住。你仍能腾出手动武，只是一旦打起来，谁也别想继续开门。" },
  { type: "narration", text: "乔无咎另一只手搭在关门机括旁，你也守着副台。这轮机关走完，互锁便会解除。到那时，血魔蛊归谁、从哪条路出去，都还没有着落。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "先校准三条外路。待第二道内门到位，再逐一改道。", expression: "smug", position: "right" },
  { type: "narration", text: "石盘上，三组细线仍在缓慢移动。副台锁闩横在你手边，只差最后一次按压，主副两套机关便会暂时连成一体。" },
];

const traitorControlRoomEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "副台分出数十道牵机丝，按外围区域束在一起。石盘上刻着岔路、翻板和暗门，不少刻度已磨平。你绷住细线，对着简图辨认仍在运转的机关。" },
  { type: "narration", text: "右侧那组线缓缓深入窄道，左侧行进极快，下方一组仍在岔口间停顿。纪清寒、赵黎和苏莹已走出不同的距离。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "三路不能同时改。牵机丝若一齐换向，他们立刻就会察觉。右侧窄道离回声廊最近，先动这一处。", expression: "smug", position: "right" },
  { type: "narration", text: "右侧窄道前有两处分岔，一边通往外圈，一边经过回声廊，接入献祭甬道。你找到对应门栓：拨动它们，就能把前路改向回声廊。" },
  { type: "narration", text: "副台下有个拇指粗的传声孔，沿墙通向回声廊。要让那边听见，你得亲自对着孔口说话。" },
  { type: "narration", text: "纪清寒认得你的声音，也知道你被雾困在墓中。让门栓发出受阻的响声，再开口求助，她或许会来查看。" },
];

const traitorTrapJiEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "narration", text: "回声廊内，纪清寒停在半开的外门前。门后是一段短直的检修过道，尽头内门通向献祭甬道。\n\n控制室中，你看见右侧牵机丝停在门外刻度。" },
  { type: "narration", text: "纪清寒先将一枚碎石滚过门槛，再以剑气扫过门缝与墙角，放出神识探查石砖下方。你与乔无咎都没有碰锁闩，门内的机关也一动不动。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "你在里面？", expression: "alert", position: "right" },
  { type: "narration", text: "她的声音沿传声孔回到控制室。你隔着空心石道答道：“门栓被卡住了。”说完便不再出声，也没有制造新的动静。" },
  { type: "narration", text: "纪清寒又等了片刻，确认门缝、墙面与脚下都没有自动禁制，这才持剑跨过外门。她每走一步都会停下查探，身形始终侧对来路，只要机关稍有异动便可立即退出。" },
  { type: "narration", text: "右侧牵机丝轻轻下沉两次，停在过道中段的刻度。她已经越过外门，正向那道“卡住”的内门走去。" },
  { type: "narration", text: "外门归副台控制，内门则连着乔无咎的主印。只有两边同时动作，才能在纪清寒退出以前封住这段过道。乔无咎的手已经扣住主台机括，只等你先拉紧右侧线路。" },
];

const traitorSacrificeSuEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "副台下方那组牵机丝走走停停，最终停在一处没有刻入石盘简图的旧侧道。那里的石门不受副印控制，只有几根后来添入的细线从旧道边缘接回控制室。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "那是苏氏祖阵的旧路。我们动不了门，但她若触发血脉禁制，后来接入的细线自然会有回应。", expression: "smug", position: "right" },
  { type: "narration", text: "旧侧道尽头，苏莹独自停在三重青石环枢前。她展开那半张墓图，将残存的线条与石环逐一比对，直到从破损处辨出“血钥入阵”四字，才把手背缓缓靠近阵心。" },
  { type: "narration", text: "相隔尚有半尺，最内层石环便随她的脉息一明一暗。她退开一步，光芒随即减弱；换过两处方位，反应仍旧相同。反复确认石环只对自身血脉起意后，她才将掌心贴上阵心，准备依照墓图开启旧路。" },
  { type: "narration", text: "三重石环转动，阵光沿苏莹掌缘亮起，扣住脉息。她立即逆转墓图上的几处阵点，内环松了，外环却没有归位。门侧的旁枢凹槽空着，缺了稳住外层阵纹的东西。她的手掌完好，却抽不出来。" },
  { type: "narration", text: "祖阵认出血脉，横切旧纹的新线随之亮起。控制室里的线槽猛然绷紧，阵光已经传到乔无咎后来接入的祭线上。苏氏石环仍不受你们操纵，但外侧石门可以关了，祭线也能接向血池。" },
];

const traitorQiaoTriumphEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "新线稳住后，横向牵机杆缩回石座，互锁解开。乔无咎拔出主印，你也取回副印。" },
  { type: "narration", text: "主台通往血池的刻度只亮起一部分。纪清寒困在隔室，苏莹的血钥引来了阵光，唤醒蛊茧的准备才刚开始。" },
  { type: "narration", text: "左侧那组牵机丝停了很久。线没有断，赵黎却自从进入无图旧道，就再没传回脚步的震动。你已不知他走到了哪里。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "外围能用的线路已经接好。下一步去血池，以主印开启内环。血魔蛊醒后，再分所得。", expression: "smug", position: "right" },
  { type: "narration", text: "你借收印的动作扫过台面：副台的线槽全停在祭阵外环，只有主台那道深槽通向血池内层。乔无咎嘴上答应分蛊，认主的地方却根本容不下副印。" },
];

const traitorQiaoTriumphConvergence = "话音刚落，血池方向传来一次低沉震动。紧接着，那条久无动静的旧侧道深处响起脚步声，一步步走近。";

const traitorZhaoArrivesEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "center", expression: "amused" },
  { type: "narration", text: "脚步声由远及近，最终停在血池旁一处低矮的旧检修口前。赵黎从阴影中走出，衣衫完整，气息也与入墓时并无明显不同。血纹蛊伏在他肩侧，口器朝向墙内几根新凿细线。" },
  { type: "narration", text: "赵黎进了无图旧道，便放出血纹蛊，循着新凿细线残留的血气探路。沿苏氏祖阵底下的检修道，他一路找到了血池。" },
  { type: "narration", text: "旧路藏在后来加设的机关下方，从未接入主副台。外围翻板和门栓都封不到这里，那几根牵机丝也探不出他的脚步。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "新凿的线封得严，下面的旧路却还通着。二位改了这么多门，偏偏漏了血池底下这一条。", expression: "amused", position: "center" },
  { type: "narration", text: "赵黎扫过你们手里的印牌，又看向两座石台。乔无咎没有应声，退回主台，你也回到副台前，各自按住了机关。" },
  { type: "narration", text: "赵黎站在旧检修口与浅池之间。你在石盘上找了一遍，没有一处门位通向他身后那条路。" },
];

const traitorBloodTakenEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-transfer-empty", transition: "fade" },
  { type: "cg", asset: "cg.scene.traitorBloodTaken" },
  { type: "narration", text: "乔无咎先转动主印，血池周围几根后来添入的细线立即收紧，从左右两侧压向旧检修口。你同时以副印升起外围石板，封住赵黎退向控制室的空隙。两套机关各自推进，试图把他的活动范围压在池边。" },
  { type: "narration", text: "赵黎没有迎着细线硬闯。他一路循这些新凿线路而来，早已看清它们与祖阵旧纹的交接位置。血纹蛊贴着血气掠向池沿，他本人则侧移数步，隔空击中固定交接处的一枚石扣。" },
  { type: "narration", text: "石扣碎开，数根新增细线顿时失去约束，沿原路猛然回弹。主台两处线槽被绞在一起，乔无咎双手压住主印，仍试图将它们重新分开；副台上的外围石板也因牵机丝错位，开始断续起落。" },
  { type: "narration", text: "交接点断开后，原本藏在下方、通往蛊茧的供血细线露了出来。赵黎让血纹蛊附上断口，再将自身血道真元渡入其中。祭阵先前聚集的阵光随之改变去向，经血纹蛊传向池中蛊茧。" },
  { type: "narration", text: "蛊茧收缩加快，暗红细线从池里抬起，缠住赵黎与血纹蛊。细线每收紧一次，他的气息就乱上一分。血魔蛊还没认主，赵黎只能不断挪动血纹蛊，勉强接住供血。" },
  { type: "narration", text: "乔无咎趁机将主印推向内环槽，想从新断口夺回控制。纠缠在主台上的牵机丝却同时回弹，带动台侧石板骤然翻起。乔无咎被掀倒在地，主印脱出半寸。他撑着台沿试图起身，呼吸尚在，却已无法立即回到原位。" },
  { type: "narration", text: "你以副印逐道尝试截断供血，动静却都止在祭阵外环，够不到断口后的蛊茧与祖阵。错位石板正牵动夹道门栓，来时的窄门已经开始合拢。" },
];

const traitorDiscardedEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "你沿维护夹道向外走，尽头就是先前的检修龛与伪墙。副印逐一压过凹槽，几段翻板暂缓转动，放你回到外围。苏氏祖阵的旧路仍在这些机关之外。" },
  { type: "narration", text: "机关轮次已经改变。原先通往大雾石厅的道路被重新分隔，外侧墙面只剩一座总枢。总枢上排着五处门位，旁边另有一道副印槽；必须依照正确次序转动门位，才能把外围通路接向墓门方向。" },
  { type: "narration", text: "门位刻字已磨损，只剩几道深浅不一的转痕。乔无咎的残图还在控制室，薛逢临死前也没交代次序。你以副印压住总枢，五处门位都能转动，却不知该从哪处开始。" },
  { type: "narration", text: "你依据磨痕、牵机丝张力与入墓时记下的方向接连试过几组。每转动一次，墙内便有数根细线发出明显震动，片刻后又回到原位。错误组合或是只打开一段维护小道，或是让远处某扇石门响过便再无动静。" },
  { type: "narration", text: "血池回弹的新线已经与外围牵机丝缠在一处，这些震动也沿石壁传向内层。远处渐渐响起脚步，间或夹着血纹蛊口器触碰石面的轻响。赵黎尚未现身，却正循着一次次试门留下的动静接近总枢。" },
  { type: "narration", text: "袖中旧玉仍在发热，热意指向的却是身后祖阵与血池深处。你换过几个方向，玉上的律动始终不变，对墓门所在没有半点提示。" },
  { type: "narration", text: "五处门位只剩最后一组未曾尝试。身后的脚步已经越过上一道伪墙，留给你的时间只够再转动一次总枢。" },
];

const traitorDeathEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "center", expression: "amused" },
  { type: "narration", text: "这是从外部隔离机关故障的缓冲室。你沿墙摸了一圈，找不到副印槽和暗扣，两道门的机括都在墙外。" },
  { type: "narration", text: "后门外的脚步停了片刻，随后渐渐远去。血纹蛊触碰石面的细响却没有消失，而是沿侧墙向前移动。赵黎没有在原地破门，而是顺着祖阵底层的旧检修支路，绕向缓冲室另一端。那条支路同样不在外围简图之中。" },
  { type: "narration", text: "十余息后，前门外响起机括声。门栓被抬起，石门缓缓退开。赵黎站在门缝后，肩臂仍缠着蛊茧牵来的细线，气息时稳时乱。他一路接住供血，血魔蛊却还没有认主。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "副印在你手里。右侧回声廊与下方旧侧道，也是你关的？", expression: "amused", position: "center" },
  { type: "narration", text: "你没有回答。一路试门的震动，已经把赵黎引到了这里。缓冲室狭窄得无法绕行，唯一出口就在他身后；趁石门尚未完全敞开，仍有一次强行冲出的机会。你将真元沉入经脉，暗中催起本命蛊。" },
];

export const traitorActThreeScenes: Record<string, Scene> = {
  traitorTrail: {
    id: "traitorTrail", act: 3, node: 1, chapter: "第三幕 · 乔无咎线 · 节点 1 / 4", title: "雾中识路",
    events: traitorTrailEvents,
    choices: [
      {
        id: "traitor-question-steps",
        label: "压住他将要拨动石砖的手，逐处追问每一步落脚依据",
        next: "traitorKnife",
        result: `你将薛逢的手按回墙面：“从第一块没有翻转的石沿说起。哪一步答不清，我们便回雾里重走。”\n\n薛逢脸上的笑意淡了些，只得逐一说出四处踏板的转轴方向，又解释墙根凹槽只能暂缓机关。说到伪墙时，他却故意漏过开启次序。你将他的手向错误的石砖移了半寸，他立即收力，脱口道：“先下后上！碰错便会封死！”\n\n话一出口，他便知道再也遮掩不过，只得按正确次序拨动石砖。墙面向内退开，露出一道仅容一人侧身通过的暗门。\n\n${traitorTrailConvergence}`,
      },
      {
        id: "traitor-bluff-order",
        label: "谎称自己已看懂暗门，故意报错石砖次序等他纠正",
        next: "traitorKnife",
        result: `你松开薛逢的手，指向墙上两块石砖：“先上后下，门便会开。你一路把我引到这里，不就是等我替你试错？”\n\n薛逢盯着你的手指。眼看你真的要按向上方石砖，他终于开口：“慢着！是先下后上。次序反了，暗门会从里面锁死。”\n\n你收回手：“看来薛道友不只会听机括。”\n\n薛逢没有再谈运气。他按自己说出的次序拨动石砖，墙面向内退开，露出一道仅容一人侧身通过的暗门。\n\n${traitorTrailConvergence}`,
      },
    ],
  },
  traitorKnife: {
    id: "traitorKnife", act: 3, node: 2, chapter: "第三幕 · 乔无咎线 · 节点 2 / 4", title: "无用之人",
    events: traitorKnifeEvents,
    choices: [{
      id: "traitor-kill-xue",
      label: "在他踩实警线前催动本命蛊灭口，夺走牵机副印",
      next: "traitorBargain",
      result: "你先一步踢开薛逢的脚跟，同时催动本命蛊截断他的心脉。薛逢尚未来得及踩实警线，身形便贴着石壁软倒下去。那句尚未说完的退路，也就此断在喉间。\n\n你取走牵机副印，将它压入检修龛旁的凹槽。印齿嵌合，龛内数根牵机丝依次松开，内门随之向后退去。门后透出微弱的灯火，你越过薛逢的尸身，独自走向控制室。",
      effect: { flags: ["薛逢已死", "牵机副印"] },
    }],
  },
  traitorBargain: {
    id: "traitorBargain", act: 3, node: 3, chapter: "第三幕 · 乔无咎线 · 节点 3 / 4", title: "第二双手",
    events: traitorBargainEvents,
    choices: [{
      id: "traitor-accept-qiao",
      label: "将副印扣入侧台，接手外围牵机丝",
      next: "traitorOath",
      result: "你将牵机副印扣入副台凹槽。印齿嵌合，石盘上的细线依次张紧，远处翻板起落与石门开合的震动随之传回指间。你循着三组细线的移动，辨出他们将要抵达的岔口。\n\n乔无咎随即转动主印，祭阵方向的第一道内门轰然开启。他没有再看你，只道：“先改右侧那一路。”\n\n你按住副台对应的牵机槽，将原本通往外圈的岔路缓缓移向祭阵。祭阵方向的门响传回来，与指间的震动接在了一起。",
    }],
  },
  traitorOath: {
    id: "traitorOath", act: 3, node: 4, chapter: "第三幕 · 乔无咎线 · 节点 4 / 4", title: "牵机互锁",
    events: traitorInterlockEvents,
    choices: [{
      id: "traitor-lock-lines",
      label: "压下副台锁闩，与主台完成牵机互锁",
      next: "traitorControlRoom",
      result: "你扣住副台锁闩，将它压入齿槽。最后几枚卡齿依次咬合，主副印同时固定，两台之间的牵机杆也随之绷紧。当前机关运转结束以前，乔无咎无法单独撤走主印，你同样不能带着副印离开。\n\n控制室内杂乱的震动逐渐平复。你依照石盘刻度调直外围三组牵机丝，乔无咎则在主台校准第二道内门。两套机关按同一节奏运转起来。",
    }],
  },
};

export const traitorActFourScenes: Record<string, Scene> = {
  traitorControlRoom: {
    id: "traitorControlRoom", act: 4, node: 1, chapter: "第四幕 · 乔无咎线 · 节点 1 / 6", title: "三线归阵", events: traitorControlRoomEvents,
    choices: [{
      id: "traitor-find-ji",
      label: "切换右侧岔路，再借传声孔引纪清寒转向",
      next: "traitorTrapJi",
      result: "你先松开通往外圈的门栓，又将回声廊一侧的暗门推开。门栓依照你的控制故意停顿了一瞬，远处随之传出石门受阻的闷响。\n\n你俯近传声孔，只说了一句：“纪道友，右侧石门卡住了。”\n\n石盘上，右侧那组牵机丝先是骤然停住，许久没有移动。数息以后，细线才带着极轻的震动缓慢偏向回声廊。纪清寒没有贸然赶来，却仍选择走近确认声音的来处。\n\n乔无咎在主台转动主印，开始校准献祭甬道的第一重内门。",
    }],
  },
  traitorTrapJi: {
    id: "traitorTrapJi", act: 4, node: 2, chapter: "第四幕 · 乔无咎线 · 节点 2 / 6", title: "双门合困", events: traitorTrapJiEvents,
    choices: [{
      id: "traitor-close-ji",
      label: "待她越过中段，与乔无咎同时合拢前后石门",
      next: "traitorSacrificeSu",
      result: "你骤然拉紧副台右侧的牵机丝，外门沿石槽急速落下；同一瞬间，乔无咎转动主印，尽头的内门也向检修过道合拢。\n\n纪清寒察觉机括异动，立即转身后撤，剑光先一步斩向外门。锋刃只在即将闭合的石面上留下一道深痕，她持剑停在门前，剑刃未折，身上也没有伤口。\n\n前后石门先后落定，将她困在献祭甬道前的隔室。片刻之后，她的声音沿传声孔隐约传回：“方才两次都是你的声音，外门也是你关的。你就在控制室里。”\n\n你没有回答。右侧牵机丝已停在隔室刻度，乔无咎也将内门锁死；在后续祭阵启动以前，她暂时无法离开。",
    }],
  },
  traitorSacrificeSu: {
    id: "traitorSacrificeSu", act: 4, node: 3, chapter: "第四幕 · 乔无咎线 · 节点 3 / 6", title: "血钥献祭", events: traitorSacrificeSuEvents,
    choices: [{
      id: "traitor-send-su",
      label: "待祖阵认出血钥，封死侧道并接通后来添入的祭阵细线",
      next: "traitorQiaoTriumph",
      result: "你压下副台对应的门栓，苏莹来路上的外围石门随即闭合。乔无咎同时在主台接通新添的祭线，横切旧纹的几根细线相继张紧，将血钥印记引出的部分阵光导向祭阵。\n\n苏莹的掌心仍完好，脉息却被石环扣着。她顺着阵光辨出新旧凿痕的差别：有人从远处接走了祖阵的回应。石壁遮住了那人的去处，她只得对照墓图，寻找截断新线的办法。\n\n控制室主台上，原本暗淡的一段祭阵刻度随之亮起。",
    }],
  },
  traitorQiaoTriumph: {
    id: "traitorQiaoTriumph", act: 4, node: 4, chapter: "第四幕 · 乔无咎线 · 节点 4 / 6", title: "认主之前", events: traitorQiaoTriumphEvents,
    choices: [
      { id: "traitor-call-master", label: "顺着他的安排，询问认主时自己该守哪一道外环线槽", next: "traitorZhaoArrives", result: `你将副印收妥，语气平常地问道：“等内环开启，我该守哪一道外槽？”\n\n乔无咎指向血池西侧的两处副槽：“你用副印稳住这两路阵光。内环若有变化，我自会处置。”\n\n你点头应下，没有追问。西侧副槽离认主的内槽最远，他只肯让你守在那里。\n\n${traitorQiaoTriumphConvergence}` },
      { id: "traitor-warn-qiao", label: "借检查互锁是否解除，逐道核对主副台通往血池的线槽", next: "traitorZhaoArrives", result: `你沿卡齿逐一检查，确认互锁已经完全退开，随后指着副台尽头问道：“外环线路都断在这里。若内环反冲，副台如何照应？”\n\n乔无咎将主印收回掌中：“主印自有处置。你只须看住外围，不必碰内槽。”\n\n你不再争辩，只取回副印。认主的内槽，他始终不让你碰。\n\n${traitorQiaoTriumphConvergence}` },
    ],
  },
  traitorZhaoArrives: {
    id: "traitorZhaoArrives", act: 4, node: 5, chapter: "第四幕 · 乔无咎线 · 节点 5 / 6", title: "局外之人", events: traitorZhaoArrivesEvents,
    choices: [{
      id: "traitor-stop-zhao",
      label: "退回主副台，封闭血池周围仍受控制的门路",
      next: "traitorBloodTaken",
      result: "你以副印合拢石盘上仍有刻度的几处外围侧门，乔无咎则用主印关住尚未开启的祭阵内门。沉重门响接连从血池四周传来，已知通路相继闭合。\n\n赵黎已经站在血池之内，身后的旧检修口也没有半点变化。他抬手让血纹蛊飞到身前，自己仍停在原处，注视着主副台即将引动的下一轮机关。",
    }],
  },
  traitorBloodTaken: {
    id: "traitorBloodTaken", act: 4, node: 6, chapter: "第四幕 · 乔无咎线 · 节点 6 / 6", title: "血蛊易主", events: traitorBloodTakenEvents,
    choices: [{
      id: "traitor-abandon-qiao",
      label: "舍下乔无咎，从检修夹道撤回外围",
      next: "traitorDiscarded",
      result: "你从副台取回牵机副印，转身赶向尚未闭合的窄门。乔无咎抬手指向歪斜的主印，嘶声让你将它扶回内环槽；你没有停步，只在经过时避开他伸来的手。\n\n石门落定前，你侧身挤入维护夹道。你沿先前押着薛逢走过的路退回外围，出口还得再找。身后仍有牵机丝连续回弹，血池方向的争夺也远未停止。",
    }],
  },
};

export const traitorActFiveScenes: Record<string, Scene> = {
  traitorDiscarded: {
    id: "traitorDiscarded", act: 5, node: 1, chapter: "第五幕 · 乔无咎线 · 节点 1 / 2", title: "副印止步", events: traitorDiscardedEvents,
    choices: [{
      id: "traitor-last-door",
      label: "以副印压住总枢，转动最后一组门位",
      next: "traitorDeath",
      result: "你将副印压入总枢，依次转过最后一组门位。墙内传来连续的卡齿声，一扇石门终于向侧方退开。门后没有通往地面的长阶，只有一间勉强容人转身的缓冲室；对面那道石门平整无缝，看不见任何内侧机括。\n\n脚步声已到上一处转角。你拔出副印，石门随即开始回落，只得在缝隙闭合前闪身进入缓冲室。身后的门彻底合拢，室内既没有副印槽，也没有可供拨动的门位。副印仍在手中，却已无处可用。\n\n片刻之后，追来的脚步停在门外。",
    }],
  },
  traitorDeath: {
    id: "traitorDeath", act: 5, node: 2, chapter: "第五幕 · 乔无咎线 · 节点 2 / 2", title: "归途无门", events: traitorDeathEvents,
    choices: [{
      id: "traitor-end",
      label: "催动本命蛊，抢在石门完全开启前突围",
      next: "ending",
      result: "你先一步扑向门缝，本命蛊截断最先伸入室内的一根暗红细线。阵光从断处散开，赵黎受牵连退了半步，门外也短暂露出一线空隙。\n\n你正要越过门槛，余下细线已在血纹蛊牵引下从两侧交错而来。缓冲室无处侧移，你只能再次催动本命蛊挡住正面阵线，却无法同时清开门口与身后。赵黎借转来的活气压制自身反噬，缠在他肩侧的细线逐渐稳定；你的气血则被一层层抽离，动作越来越慢。\n\n副印仍握在掌中，本命蛊也没有停止抵抗，但这两样都打不开身后的石门。最后一缕意识沉下去时，前门依旧只开着不足一人宽的缝隙。",
      effect: { ending: "traitor" },
    }],
  },
};

export const traitorRouteScenes: Record<string, Scene> = { ...traitorActThreeScenes, ...traitorActFourScenes, ...traitorActFiveScenes };
