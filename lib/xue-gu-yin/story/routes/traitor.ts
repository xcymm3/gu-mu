import type { Scene, VisualNovelEvent } from "../../model.ts";

const traitorTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "浓雾漫过石厅，翻板起落的闷响接连从脚下传来。薛逢没有像旁人那样出声示警，只踩着尚未翻转的石沿，接连向墙角退去。到第三步时，你忽然欺近，扣住他的后领，借他落脚之势一同踏上墙边那块窄石。" },
  { type: "narration", text: "近处看得更加分明：周围四块石板已有两块翻入深坑，薛逢选中的却都贴着转轴根部，即使机关发动也只会轻颤，不会倾覆。这不是临时撞上的运气。" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "panicked" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "道友轻些！薛某不过耳朵灵，听见哪块石板下有机括响罢了。", expression: "panicked", position: "left" },
  { type: "narration", text: "你没有与他争辩，只让他继续走。薛逢脸上的笑容僵了片刻，随后俯身按过墙根两处不起眼的凹槽。附近翻板的震动随之一缓，仅够二人抢过下一段石路，身后的凹槽便自行弹回。" },
  { type: "narration", text: "如此走出十余步，前方已是石厅尽头。墙角看似封死，底部却没有积灰，砖缝间还透出极细的气流。薛逢伸手摸向两块微微凸起的石砖，指尖临近时又忽然停住。" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "墙后未必是生路。若次序错了，暗门封死，你我都得困在这片雾里。", expression: "panicked", position: "left" },
  { type: "narration", text: "他仍不肯承认自己来过这里，但踏板的死角、暂缓机关的凹槽和眼前的伪墙，已经足够让那套听声辨位的说辞站不住脚。眼下无需逼他交代所有秘密，只须先让他把这道门打开。" },
];

const traitorTrailConvergence = "暗门后没有外界风声，只有牵机丝擦过石槽的细响。你让薛逢先行，自己落后半步。薛逢没有拒绝，也没有回头；他已经明白，你留下他不是因为信任，而是因为门后的路尚需有人辨认。";

const traitorKnifeEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "panicked" },
  { type: "narration", text: "夹道尽头比来路稍宽，石壁内嵌着一处半人高的检修龛。数根牵机丝从龛中穿墙而过，门边另有一道形如印齿的凹槽。薛逢走到这里以后，右手始终拢在袖中，脚步也比先前慢了许多。" },
  { type: "narration", text: "你没有催促，只盯着龛内的牵机丝。薛逢袖口微动时，其中一根细丝也跟着轻颤，显然不是脚步震动所致。你骤然扣住他的手腕向外一带，一枚牵机副印随之落在石面上。" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "道友莫急！这东西只能开几道外门，碰不得墓里的核心禁制。", expression: "panicked", position: "left" },
  { type: "narration", text: "你拾起副印，抵近门边凹槽。印齿尚未完全嵌入，龛内一根牵机丝便自行松开，墙后的门栓也向内退了半寸。副印与此处机关确实同出一套，薛逢再难用听声辨位搪塞过去。" },
  { type: "narration", text: "追问之下，他只得承认自己收了乔无咎的好处，事先进入墓中维护外围翻板与暗门，此番又负责把同行之人引到预定路径。至于墓穴核心如何运转、控制室后还有哪些道路，乔无咎从未让他知晓。这枚副印能打开眼前内门，也仅此而已。" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "薛某可以带你去见他，也能当面对质。留我一命，门后还有什么安排，我替道友问个清楚。", expression: "panicked", position: "left" },
  { type: "narration", text: "他说话时上身未动，右脚却贴着石面悄然向后挪去。检修龛最下方，一根原本松垂的牵机丝被他的脚跟一点点压紧，墙后随即传来一声极轻的机括咬合。你不动声色地催起本命蛊；只要他的脚跟再落下半寸，这道警线便会把夹道里的变故传入控制室。" },
];

const traitorBargainEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "内门缓缓合拢，真正的控制室出现在眼前。石室中央隔着数步并列两座石台：主台上的牵机丝没入墓穴深处，连接祭阵内层；靠墙的副台则分出数十道细线，通往外围翻板、暗门与岔路。两台各有一处印槽，彼此并不相通。" },
  { type: "narration", text: "乔无咎立在主台前，一手压着嵌于其中的主印。听见内门动静，他立刻侧过身，掌下几道牵机丝同时绷紧。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "薛逢呢？", expression: "smug", position: "right" },
  { type: "narration", text: "你将牵机副印放在身前，并未向他靠近：“回不来了。”乔无咎看过副印，又扫了一眼控制室角落那根始终未曾响动的警线，按住主印的手没有放松。" },
  { type: "narration", text: "副台石盘上，三组细线正在不同刻度间缓慢移动。一组停在右侧窄道，一组正沿左侧甬道深入，另一组则在下方岔路间时走时停。依照大雾中众人离开的方向，正可分别对应纪清寒、赵黎与苏莹。牵机丝只能报出路线与轻重，远不足以让人看见墓道里发生了什么。" },
  { type: "narration", text: "乔无咎若要以主印开合祭阵内门，便无法同时走到副台改变外围岔路；反过来也是一样。薛逢原本要做的，正是在两道内门开启的同时，将那三条路线逐一导向祭阵。如今副印落在你手中，乔无咎想继续原先的安排，只能另找一双手。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "你接手副台，把他们引到祭阵。我开内门。等血魔蛊现世，再凭各自手段分取所得。", expression: "smug", position: "right" },
  { type: "narration", text: "这句约定没有任何约束。乔无咎的手仍压在主印上，你也始终站在副台印槽之外。可若不借副台理清外围路线，你随时可能被主台封死在控制室与夹道之间；而乔无咎少了副台配合，也无法按时将三路人引入祭阵。至少在阵门打开以前，谁都不能先动手。" },
];

const traitorInterlockEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "第一道祭阵内门开启后，乔无咎转动主印，准备接续第二道机关。主印刚过半圈，两座石台之间便响起一阵低沉的摩擦声。一根横向牵机杆从石座内部缓缓伸出，两端各露出一道锁闩，分别扣住主台与副台的印槽。" },
  { type: "narration", text: "乔无咎对此并不意外。他检查过主台刻度，随即压下自己一侧的锁闩。数枚卡齿相继咬合，主印被固定在当前位置，方才开启的内门也停稳下来。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "主副两台需同时落闩，后面的门才会接着开。机关这一轮走完以前，谁强拔印牌，内外两路都会卡死。", expression: "smug", position: "right" },
  { type: "narration", text: "你沿着横杆看了一遍。两端齿槽彼此牵连，主台这边若擅自退印，副台的引路线会立刻锁住；副台若单独逆转，祭阵内门也无法继续开启。它不会拘束人的手脚，更不能阻止任何一方突然出手，只会让先毁约的人同时毁掉眼前这套安排。" },
  { type: "narration", text: "乔无咎的另一只手仍停在关闭内门的机括旁，你也没有离开副台半步。互锁只能维持当前一轮机关，血魔蛊现世后的归属、控制室之后的退路，仍旧各凭手段。可在三组牵机丝汇入祭阵以前，双方都没有理由先让石台停摆。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "先校准三条外路。待第二道内门到位，再逐一改道。", expression: "smug", position: "right" },
  { type: "narration", text: "石盘上，三组细线仍在缓慢移动。副台锁闩横在你手边，只差最后一次按压，主副两套机关便会暂时连成一体。" },
];

const traitorControlRoomEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "副台上的牵机丝共有数十道，依照外围区域分成几束。石盘刻着岔路、翻板与暗门的简图，许多刻度早已磨平，只能与牵机丝传回的张力相互对照，勉强判断哪一段机关仍在运转。" },
  { type: "narration", text: "其中三组细线正在移动。右侧一组沿窄道缓缓深入，左侧一组行进极快，下方一组则在数处岔口间反复停顿。它们与大雾中纪清寒、赵黎、苏莹各自离开的方向一致。除此之外，控制室里的人既听不到他们交谈，也无从知道墓道里的具体情形。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "三路不能同时改。牵机丝若一齐换向，他们立刻就会察觉。右侧窄道离回声廊最近，先动这一处。", expression: "smug", position: "right" },
  { type: "narration", text: "你在简图上找到右侧窄道。它前方有两处分岔，一边继续深入外圈，一边经过回声廊，最终通向献祭甬道。只需松开原路门栓，再将另一边的暗门推开，线路便会自然偏向回声廊。" },
  { type: "narration", text: "副台下方还留着一处拇指粗的传声孔，孔道从石壁内部延伸出去，正与回声廊相通。它只是修建墓穴时用于隔墙传话的空心声道，无法自行发声；若要让远处听见什么，只能由控制室里的人亲自开口。" },
  { type: "narration", text: "纪清寒不会轻信陌生动静。可她认得你的声音，又知道你也被大雾隔在墓中。若在改道时让前方门栓传出一次受阻的响声，再隔着传声孔说上一句短话，至少足以令她走近查探。" },
];

const traitorTrapJiEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "narration", text: "回声廊内，纪清寒停在半开的外门前。外门之后是一段短直的检修过道，尽头另有一道通往献祭甬道的内门。控制室里的你看不见她，只能从右侧牵机丝停止移动，判断她已经抵达门外。" },
  { type: "narration", text: "她没有立即进门。先是一枚碎石滚过门槛，在过道中撞了几下；随后一道剑气贴着地面扫过门缝与两侧墙角。她又放开神识，逐寸探查石砖下方的气息。你与乔无咎都没有碰动锁闩，两套机关始终保持原位，这些试探自然引不出任何变化。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "你在里面？", expression: "alert", position: "right" },
  { type: "narration", text: "她的声音沿传声孔回到控制室。你隔着空心石道答道：“门栓被卡住了。”说完便不再出声，也没有制造新的动静。" },
  { type: "narration", text: "纪清寒又等了片刻，确认门缝、墙面与脚下都没有自动禁制，这才持剑跨过外门。她每走一步都会停下查探，身形始终侧对来路，只要机关稍有异动便可立即退出。" },
  { type: "narration", text: "副台上，右侧那组牵机丝先后传来两次极轻的下沉，随后停在外门与内门之间的中段刻度。你无从知道她此刻如何站立，却能确认她已经越过外门，正接近那道所谓卡住的内门。" },
  { type: "narration", text: "外门归副台控制，内门则连着乔无咎的主印。只有两边同时动作，才能在纪清寒退出以前封住这段过道。乔无咎的手已经扣住主台机括，只等你先拉紧右侧线路。" },
];

const traitorSacrificeSuEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "副台下方那组牵机丝走走停停，最终停在一处没有刻入石盘简图的旧侧道。那里的石门不受副印控制，只有几根后来添入的细线从旧道边缘接回控制室。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "那是苏氏祖阵的旧路。我们动不了门，但她若触发血脉禁制，后来接入的细线自然会有回应。", expression: "smug", position: "right" },
  { type: "narration", text: "旧侧道尽头，苏莹独自停在三重青石环枢前。她展开那半张墓图，将残存的线条与石环逐一比对，直到从破损处辨出“血钥入阵”四字，才把手背缓缓靠近阵心。" },
  { type: "narration", text: "相隔尚有半尺，最内层石环便随她的脉息一明一暗。她退开一步，光芒随即减弱；换过两处方位，反应仍旧相同。反复确认石环只对自身血脉起意后，她才将掌心贴上阵心，准备依照墓图开启旧路。" },
  { type: "narration", text: "三重石环依次转动，暗红阵光沿掌缘亮起，将她的脉息扣在阵心。苏莹立即逆转墓图上尚能辨认的几处阵点，内环随之松动，外环却始终无法归位。门侧另有一道旁枢凹槽，此刻空无一物；缺少稳定外层阵纹的那一步，她无法将手掌完整抽离。她没有受伤，掌心也仍旧完好。" },
  { type: "narration", text: "祖阵确认血脉以后，横切旧纹的几根新凿细线才逐一亮起。控制室内相应的线槽猛然绷紧，证明乔无咎后来添入的祭阵接口已经能够承接这部分阵光。你们仍不能转动苏氏石环，却可以关闭旧侧道外的外围石门，再把新增接口接向祭阵。" },
];

const traitorQiaoTriumphEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "新增细线稳定下来以后，主副台之间的横向牵机杆自行缩回石座，本轮互锁随之解除。乔无咎取回主印，你也将副印从侧台拔出。两枚印牌各归其主，先前那点有限的制衡至此结束。" },
  { type: "narration", text: "主台上，通往血池与蛊茧的刻度只亮起一部分。纪清寒仍被困在隔室，苏莹的血钥印记也只是让新增细线得以截取阵光；这些条件足以开始唤醒准备，却远未完成认主。" },
  { type: "narration", text: "副台左侧那组原本对应赵黎的牵机丝，早已在无图旧道中失去反馈。细线仍然完整，另一端却再没有传回移动。赵黎究竟被困、另寻出路，还是正沿控制室不知道的旧道接近内层，谁也无法确认。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "外围能用的线路已经接好。下一步去血池，以主印开启内环。血魔蛊醒后，再分所得。", expression: "smug", position: "right" },
  { type: "narration", text: "你借着收回副印的动作核对台面。副台数十道线槽无一越过祭阵外环，主台边缘却有一道更深的内槽没入血池方向。乔无咎口中的分取尚未发生，认主接口却从一开始便没有给副印留下位置。" },
];

const traitorQiaoTriumphConvergence = "话音刚落，血池方向传来一次低沉震动。紧接着，那条失去反馈的旧侧道深处响起几声脚步，间隔平稳，绝非机括自行运转。";

const traitorZhaoArrivesEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "center", expression: "amused" },
  { type: "narration", text: "血魔蛊破茧前，祭殿里忽然响起掌声。赵黎从一条不在控制图上的旧甬道走出，衣袖染血，气息却比入墓时更加深沉。你与乔无咎算遍所有棋子，唯独把这个从不守棋局规则的人漏在了外面。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "两个躲在墙后拨线的鼠辈，也配分五转蛊？", expression: "amused", position: "center" },
];

const traitorBloodTakenEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "赵黎一击撕开乔无咎准备的认主阵，又以血瓶强行唤醒血魔蛊。乔无咎启动全部傀儡仍被血浪碾碎；你试图逆转血祭，却发现副印从一开始便没有控制真正核心的资格。" },
];

const traitorDiscardedEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "乔无咎倒下前抓住你的衣角，仍命令你替他拖住赵黎。你踢开这枚已经无用的棋子，想用密道独自逃生；然而薛逢死后，最后一条真正通往墓外的退路也随他埋进了无人知晓的石缝。" },
];

const traitorDeathEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "center", expression: "amused" },
  { type: "narration", text: "血光从背后贯穿心脉。赵黎甚至没有询问你为何背叛，只把你的气血当作血魔蛊苏醒后的第一份补物。你看破乔无咎的阴谋，杀死薛逢并亲手送走所有可能救你的人，最终仍死在一场不需要你的胜局里。" },
  { type: "effect", effect: "darken", tone: "danger" },
];

export const traitorActThreeScenes: Record<string, Scene> = {
  traitorTrail: {
    id: "traitorTrail", act: 3, node: 1, chapter: "第三幕 · 乔无咎线 · 节点 1 / 4", title: "挟住棋子",
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
    }],
  },
  traitorBargain: {
    id: "traitorBargain", act: 3, node: 3, chapter: "第三幕 · 乔无咎线 · 节点 3 / 4", title: "第二双手",
    events: traitorBargainEvents,
    choices: [{
      id: "traitor-accept-qiao",
      label: "将副印扣入侧台，接手外围牵机丝",
      next: "traitorOath",
      result: "你将牵机副印扣入副台凹槽。印齿嵌合，石盘上的细线依次张紧，远处翻板起落与石门开合的震动随之传回指间。三组线路仍只是刻度上的粗略位置，却已足够让你判断他们将抵达哪一道岔口。\n\n乔无咎随即转动主印，祭阵方向的第一道内门轰然开启。他没有再看你，只道：“先改右侧那一路。”\n\n你按住副台对应的牵机槽，将原本通往外圈的岔路缓缓移向祭阵。自这一刻起，你与乔无咎暂时有了同一个目的，也各自握住了对方不能缺少的那部分机关。",
    }],
  },
  traitorOath: {
    id: "traitorOath", act: 3, node: 4, chapter: "第三幕 · 乔无咎线 · 节点 4 / 4", title: "牵机互锁",
    events: traitorInterlockEvents,
    choices: [{
      id: "traitor-lock-lines",
      label: "压下副台锁闩，与主台完成牵机互锁",
      next: "traitorControlRoom",
      result: "你扣住副台锁闩，将它压入齿槽。最后几枚卡齿依次咬合，主副印同时固定，两台之间的牵机杆也随之绷紧。当前机关运转结束以前，乔无咎无法单独撤走主印，你同样不能带着副印离开。\n\n控制室内杂乱的震动逐渐平复。你依照石盘刻度调直外围三组牵机丝，乔无咎则在主台校准第二道内门。两套机关开始按同一节奏运转，临时合作也有了第一道看得见的限制。",
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
      result: "你骤然拉紧副台右侧的牵机丝，外门沿石槽急速落下；同一瞬间，乔无咎转动主印，尽头的内门也向检修过道合拢。\n\n纪清寒察觉机括异动，立即转身后撤，剑光先一步斩向外门。锋刃只在即将闭合的石面上留下一道深痕，她本人则在门前停住，没有受伤，长剑也仍完整握在手中。\n\n前后石门先后落定，将她困在献祭甬道前的隔室。片刻之后，她的声音沿传声孔隐约传回：“方才两次都是你的声音，外门也是你关的。你就在控制室里。”\n\n你没有回答。右侧牵机丝已停在隔室刻度，乔无咎也将内门锁死；在后续祭阵启动以前，她暂时无法离开。",
    }],
  },
  traitorSacrificeSu: {
    id: "traitorSacrificeSu", act: 4, node: 3, chapter: "第四幕 · 乔无咎线 · 节点 3 / 6", title: "血钥献祭", events: traitorSacrificeSuEvents,
    choices: [{
      id: "traitor-send-su",
      label: "待祖阵认出血钥，封死侧道并接通后来添入的祭阵细线",
      next: "traitorQiaoTriumph",
      result: "你压下副台对应的门栓，苏莹来路上的外围石门随即闭合。乔无咎同时在主台打开新增接口，横切旧纹的几根细线相继张紧，将血钥印记引出的部分阵光导向祭阵。\n\n苏莹仍被三重石环扣住脉息，却没有流血，也未受伤。她沿着亮起的纹路看去，很快分辨出旧阵磨钝的凿口与后来细线之间的差别，知道有人正从远处利用祖阵的回应。隔着重重石壁，她看不见控制室，更无法确认操纵机关的是谁，只能继续按墓图寻找中断新线的办法。\n\n控制室主台上，原本暗淡的一段祭阵刻度随之亮起。",
    }],
  },
  traitorQiaoTriumph: {
    id: "traitorQiaoTriumph", act: 4, node: 4, chapter: "第四幕 · 乔无咎线 · 节点 4 / 6", title: "认主之前", events: traitorQiaoTriumphEvents,
    choices: [
      { id: "traitor-call-master", label: "顺着他的安排，询问认主时自己该守哪一道外环线槽", next: "traitorZhaoArrives", result: `你将副印收妥，语气平常地问道：“等内环开启，我该守哪一道外槽？”\n\n乔无咎指向血池西侧的两处副槽：“你用副印稳住这两路阵光。内环若有变化，我自会处置。”\n\n你点头应下，没有追问。西侧副槽与认主接口相隔最远，他安排得越具体，越能证明所谓分取并不包括内环。\n\n${traitorQiaoTriumphConvergence}` },
      { id: "traitor-warn-qiao", label: "借检查互锁是否解除，逐道核对主副台通往血池的线槽", next: "traitorZhaoArrives", result: `你沿卡齿逐一检查，确认互锁已经完全退开，随后指着副台尽头问道：“外环线路都断在这里。若内环反冲，副台如何照应？”\n\n乔无咎将主印收回掌中：“主印自有处置。你只须看住外围，不必碰内槽。”\n\n你不再争辩，只取回副印。主台独占认主接口一事，已经由他亲口确认。\n\n${traitorQiaoTriumphConvergence}` },
    ],
  },
  traitorZhaoArrives: { id: "traitorZhaoArrives", act: 4, node: 5, chapter: "第四幕 · 乔无咎线 · 节点 5 / 6", title: "局外之人", events: traitorZhaoArrivesEvents, choices: [{ id: "traitor-stop-zhao", label: "与乔无咎同时启动全部机关", next: "traitorBloodTaken", result: "傀儡与暗弩同时扑向赵黎，血幕却先一步覆盖祭殿。" }] },
  traitorBloodTaken: { id: "traitorBloodTaken", act: 4, node: 6, chapter: "第四幕 · 乔无咎线 · 节点 6 / 6", title: "血蛊易主", events: traitorBloodTakenEvents, choices: [{ id: "traitor-abandon-qiao", label: "舍弃乔无咎，独自寻找退路", next: "traitorDiscarded", result: "你踢开乔无咎伸来的手，转身冲向薛逢曾提过的密道。" }] },
};

export const traitorActFiveScenes: Record<string, Scene> = {
  traitorDiscarded: { id: "traitorDiscarded", act: 5, node: 1, chapter: "第五幕 · 乔无咎线 · 节点 1 / 2", title: "弃子无路", events: traitorDiscardedEvents, choices: [{ id: "traitor-last-door", label: "推开最后一道石门", next: "traitorDeath", result: "石门之后没有出口，只有追来的血光。" }] },
  traitorDeath: { id: "traitorDeath", act: 5, node: 2, chapter: "第五幕 · 乔无咎线 · 节点 2 / 2", title: "为虎所噬", events: traitorDeathEvents, choices: [{ id: "traitor-end", label: "在血光中闭眼", next: "ending", result: "你最终成为赵黎炼化血魔蛊的最后一份血食。", effect: { ending: "traitor" } }] },
};

export const traitorRouteScenes: Record<string, Scene> = { ...traitorActThreeScenes, ...traitorActFourScenes, ...traitorActFiveScenes };
