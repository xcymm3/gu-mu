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
  { type: "narration", text: "你第一次看清，赵黎的力量不只来自血纹蛊。如何从旁人避之不及的残血与死气中榨出用处，才是这门邪法真正难缠的地方。" },
];

const zhaoPriceEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "narration", text: "石门升至一人高时，你与赵黎先后俯身穿过。先前听见的撞击声立刻清晰起来，其间还夹着薛逢嘶哑的呼救。\n\n前方甬道被一排粗重石栅分成两路。主路仍向深处延伸，另一条支道却已经向下沉了数尺。薛逢被困在支道中央，两面石墙正沿着地面的凹槽缓慢合拢。他把那面黄铜小盾横卡在墙缝间，盾面已经被压得向内弯曲，勉强替自己撑出一小块空隙。\n\n见到你们，薛逢急忙从石栅间伸出手。\n\n“二位道友，拉我一把！乔家给我的副印，还有后面几道暗门的走法，我全都交出来！”\n\n你没有立刻答应。连接支道的入口已经塌陷，若想过去，只能退回方才走过的那块松动石板，再从石板下方破坏传动石齿。这样做未必救得出薛逢，却很可能重新封死刚刚开启的石门。\n\n赵黎站在主路一侧，以血纹蛊探了探石栅后的缝隙。确认无法隔空将人拖出来后，他收回血线，看向你。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "人是与你一同进来的。救不救，你自己定。", expression: "amused", position: "left" },
  { type: "narration", text: "他没有催促，也没有走远。主路前方的空气正变得越来越冷，隐约透来的蛊息却让体内气血阵阵发热。继续耽搁下去，后面的人或许会先一步找到通往主墓室的路。\n\n石墙又向内推进了一寸。黄铜小盾发出一声刺耳的呻吟。" },
];

const zhaoThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "甬道尽头是一扇高大的血色石门。门扉上布满血管般的凸纹，暗红微光沿着纹路缓慢流动。你们尚未靠近，门后透出的蛊息便已压得体内气血阵阵翻涌。\n\n石门两侧各嵌着一处阵枢，相距数丈。左边是一枚凹陷的掌印，边缘凝着尚未干透的血垢；右边则刻满细密的引气纹，附近石面散落着几截被真元烧焦的指骨。\n\n赵黎驱使血纹蛊靠近左侧。血线刚刚探入掌印，右侧阵枢便骤然亮起，一道失控真元擦着他的肩头射入石壁。赵黎侧身避过，立即截断血线。\n\n他又隔空打出一块碎石。碎石触及右侧引气纹时，左边掌印随即涌出数根血刺。\n\n两处阵枢必须同时压住。凭一人之力，根本来不及在相隔数丈的两端往返。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "左边交给老夫，右边归你。门开启之前，彼此都别动旁的心思。", expression: "wary", position: "left" },
  { type: "narration", text: "你看了一眼他肩侧被真元削开的衣料，走向右侧阵枢。藏在袖中的冰寒蛊简已经被移到掌边，只要赵黎中途收回血线，你便能立刻以寒气截断门内涌来的反噬。\n\n赵黎注意到你的动作，并未点破。他将血纹蛊悬在掌印上方，随后说道：\n\n“见到血魔蛊后，谁先得手便算谁的。另一人若不服，自己来抢。”\n\n“可以。”\n\n你把手按在引气纹上，赵黎也抬起了指尖。两人隔着整扇石门各守一端，谁也没有把后背留给对方。" },
];

const zhaoBloodGateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "石门后并非藏宝室，而是一座二十余丈见方的地下祭殿。数根石柱撑住低沉穹顶，地面则被纵横交错的暗红阵纹分割开来。\n\n祭殿中央悬着一枚丈许高的半透明蛊茧。茧壳每隔数息便收缩一次，下方的环形血池也随之泛起波纹。\n\n你很快看见，地面共有五条较粗的祭线，分别从五处封闭墓道延伸而来，最后全部汇入蛊茧下方。每条祭线残留的气息都不相同：其中一道带着纪清寒的寒锐剑意，另一道还粘着苏氏旧印留下的微弱波动；距离你最近的那一道，则有血纹蛊才会留下的腥甜气息。\n\n沿途那些被触发的禁制，不只是在阻拦入墓者。每个人催动真元、受伤流血时，都会有一部分气血被埋在地下的阵纹带走。\n\n穹顶上方忽然传来齿轮转动声。藏在石壁内的中空铜管轻轻震动，乔无咎的声音随之传遍祭殿。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "你们既已替老夫打开最后一道血门，也该知道自己为何能一路走到这里。除老夫之外，入墓的五个人既是破禁的钥匙，也是喂养五转蛊的血食。如今祭线已成，再知道也迟了。", expression: "smug", position: "right" },
  { type: "narration", text: "铜管里的声音戛然而止。你没有向空处质问，只沿着五条祭线重新估量退路。赵黎也没有动怒。他催使血纹蛊靠近中央蛊茧，放出一根极细的血线贴上茧壳。\n\n血线很快被茧内的东西吸去一截。赵黎立即将其斩断，盯着断口看了片刻。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "还差最后一轮供血。乔无咎若真已大功告成，就不会躲在机关后面等着。", expression: "amused", position: "left" },
  { type: "narration", text: "你按住袖中的冰寒蛊简，从祭殿右侧向前；赵黎则沿左侧石阶移动。血门前的约定已经履行完毕，两人都把中央蛊茧留在视线内，也都没有踏进对方伸手可及的距离。" },
];

const zhaoBloodGuardEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "那只按住石台的手掌骤然收紧，指节将石面压出数道裂纹。血池中的躯体借力站起，粘稠血水顺着肩背不断淌落。\n\n它足有常人两倍高，体内以粗重骨架支撑，骨架外则缝着早已失去生机的皮肉。左腕缠着一条浸透血水的锁链，右臂被炼得格外粗壮。胸骨中央没有心脏，只有一枚拳头大小的暗红血核，正随着蛊茧的收缩频率缓慢跳动。\n\n你脚下那道祭线亮了起来。一缕血光沿石面爬到傀儡脚边，它随即抬起头，空洞眼眶牢牢朝向最先越线的你。\n\n赵黎在血光合拢前退回阵线外。傀儡的头颅跟着他偏转半寸，又很快重新转向你。只要他不越过祭线，这具守墓之物便不会更换目标。" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "血门已经打开，老夫没有再替你出手的理由。若你过不了它，方才的争蛊之约自然也不必再提。", expression: "amused", position: "left" },
  { type: "narration", text: "赵黎停在阵线外，血纹蛊悬于身侧，没有半点出手的迹象。\n\n血傀儡拖动左腕锁链，从池中踏上石台。胸腔血核骤然亮起，铁链随即离地，带着湿重的破风声朝你扬来。" },
];

const zhaoAwakeningEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "血傀儡倒在池边，胸腔血核已经裂成两半，里面储存的祭血却没有散尽，正沿着断裂骨架缓慢流回血池。\n\n赵黎终于越过祭线。血纹蛊抢在祭血流尽前伏上血核，抽出数股暗红血线，将它们送入蛊茧下方的阵眼。随后，他从袖中取出一只黑色小瓶。瓶塞开启时，数种驳杂的气血先后逸出，显然是他沿途收集所得。\n\n你没有上前阻止。蛊茧尚未完全打开，此时毁掉阵眼，谁也拿不到里面的五转蛊。赵黎在等蛊出茧，你同样在等。\n\n你将冰寒蛊简移到掌边，看着他把瓶中精血倒进阵眼。\n\n环形血池中的五条祭线同时亮起。蛊茧先是向内收缩，随即从顶部裂开数道细缝。暗红液体沿茧壳流下，一只巴掌大小的深红蛊虫从裂口中缓缓探出。它背部薄翼紧贴躯壳，数根血丝仍与蛊茧相连，复眼也尚未完全睁开。\n\n血魔蛊已经苏醒，却还没有接纳任何人的真元。\n\n赵黎截断送入阵眼的血线，转身面对你。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "血门已开，蛊也出了茧。先前的约定到此为止。你我谁还能站着，谁便取蛊。", expression: "wary", position: "left" },
];

const zhaoDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "环形血池上方，刚刚出茧的血魔蛊仍由数根血丝牵在残茧之间。薄翼偶尔轻颤一下，池中血水便随之荡开一圈细纹。\n\n赵黎沿池沿退至另一侧，直到你们之间隔开十余丈，才将血纹蛊托到掌前。他体内一直压住的真元随之放开，沉重气机贴着池面铺来，显出的正是四转巅峰修为。\n\n血纹蛊振动薄翅，分出数股暗红血线。两股钉入身后的石门与侧壁，将仅有的出口交错封住；余下一缕却伏低贴近地面，借着池中血光掩护，悄然游向你脚边。\n\n你没有去碰尚未认主的血魔蛊，只把冰寒蛊简扣紧在掌心。简中寒意沿指节散开，恰可帮助你分辨周围血气的细微流动。\n\n那缕血线绕过一块碎石，骤然抬起尖端，直刺你小腿经脉。" },
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
      { id: "zhao-dismiss-xue", label: "连这道机关都过不了的人，不值得你冒险折返", next: "zhaoThreshold", result: "你看了一眼正在变形的黄铜小盾，没有踏回那块松动石板。\n\n“他若连这道机关都闯不过去，我没必要拿自己的退路换他的命。”\n\n薛逢的求救顿时变成咒骂。赵黎却只是转过身，沿主路继续前行。\n\n“记住你今日说的话。”他头也不回地说道，“哪天你跟不上，老夫同样不会停。”\n\n你越过石栅，没有再看身后的支道。随着那阵金铁挤压声逐渐远去，甬道尽头的血光也变得越来越清晰。" },
      { id: "zhao-mark-xue", label: "记下薛逢的位置，等他自行脱困后再取乔家路线", next: "zhaoThreshold", result: "你仍未退回救人，只以指尖在主路石壁的暗处刻下一道浅痕，将支道方位记了下来。\n\n赵黎瞥见你的动作。\n\n“还准备回来捞他？”\n\n“他若能靠自己活下来，手里的乔家路线便还有用。若出不来，我也只多留了一道记号。”\n\n赵黎低笑一声，没有评价这笔打算。你们沿主路继续深入，薛逢的呼喊很快便被石壁阻断。\n\n前方的蛊息越来越强。绕过最后一处弯道时，一层暗红微光从甬道尽头照了过来。" },
    ],
  },
  zhaoThreshold: {
    id: "zhaoThreshold", act: 3, node: 4, chapter: "第三幕 · 赵黎线 · 节点 4 / 4", title: "同盟尽头",
    events: zhaoThresholdEvents,
    choices: [{ id: "zhao-open-gate", label: "与赵黎一同推开血色石门", next: "zhaoBloodGate", result: "你将真元灌入右侧阵枢。几乎同一刻，赵黎催动血纹蛊，把数道血线压进左边掌印。\n\n门内传出一连串沉重的咬合声，两处阵枢先后亮起，随即趋于平稳。紧闭的石门终于向内退开。\n\n浓重血气从门缝涌出，暗红光芒铺过门槛，将你与赵黎隔在各自的一侧。你们同时收回手，却都没有立刻向前。" }],
  },
};

export const zhaoActFourScenes: Record<string, Scene> = {
  zhaoBloodGate: { id: "zhaoBloodGate", act: 4, node: 1, chapter: "第四幕 · 赵黎线 · 节点 1 / 6", title: "血祭真相", events: zhaoBloodGateEvents, choices: [{ id: "zhao-enter", label: "踏入祭殿", next: "zhaoBloodGuard", result: "你跨过外围第一道祭线。靴底落下的瞬间，原本平静的环形血池骤然鼓起，粘稠血水沿池沿向外漫出。\n\n池底传来锁链拖过石面的声音。紧接着，一只肿胀发白的手掌穿出水面，重重按在蛊茧前方的石台上。水下那道沉重身影正借力缓缓起身。" }] },
  zhaoBloodGuard: { id: "zhaoBloodGuard", act: 4, node: 2, chapter: "第四幕 · 赵黎线 · 节点 2 / 6", title: "资格之战", events: zhaoBloodGuardEvents, battle: { enemyName: "血傀儡", enemyHealth: 20, victoryNext: "zhaoAwakening", defeatNext: "ending", victoryFlag: "赵黎线血傀儡已毁", defeatFlag: "死于守门血傀儡", defeatEnding: "deathByBloodGuard" } },
  zhaoAwakening: {
    id: "zhaoAwakening", act: 4, node: 3, chapter: "第四幕 · 赵黎线 · 节点 3 / 6", title: "五转蛊醒", events: zhaoAwakeningEvents,
    choices: [
      { id: "zhao-question-trust", label: "点破他让你独战傀儡，本就是为了借刀破开血核", next: "zhaoDuel", result: "你看了一眼被血纹蛊抽空的破裂血核。\n\n“方才你站在阵线外，不只是在看我能否活下来。你真正等的是我替你打碎这枚血核。”\n\n赵黎没有否认，只把血纹蛊召回身侧。\n\n“你既然看得出来，不也还是动了手？你要蛊，老夫要血核，各取所需而已。”\n\n他的目光落到你的袖口。\n\n“藏了一路的寒属残简，也该拿出来了。”\n\n你扣住冰寒蛊简，与他隔着逐渐升温的血池各退数步。" },
      { id: "zhao-welcome-duel", label: "告诉他，你同样一直在等蛊醒后的这场争夺", next: "zhaoDuel", result: "“不用解释。”\n\n你将冰寒蛊简扣入掌心，平静地看向赵黎。\n\n“血门前已经说得很清楚。我跟你走到这里，就是在等它出茧，也在等这一战。”\n\n赵黎听罢，低低笑了一声。\n\n“好。省得老夫再费口舌。”\n\n他抬手召回血纹蛊。你们各自沿血池边缘退开，将尚未认主的血魔蛊留在两人之间。" },
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
