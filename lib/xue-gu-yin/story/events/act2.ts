import type { GameState, VisualNovelEvent } from "../../model.ts";
import { resolveFogRouteChoices } from "../common/choices.ts";

export const swarmEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-corridor", transition: "fade" },
  { type: "narration", text: "深入地底墓穴不过百余步，前方的狭长石道便骤然收窄，空气中积聚多年的阴湿与腥臭腐气愈发浓烈。\n\n摇曳的火光只能勉强驱散三丈范围内的黑暗，映出两侧石壁上密密麻麻、深浅不一的抓痕，像是有人被困在这里，直到临死前仍在徒手挖掘石壁。\n\n灰袍中年乔无咎举着一张泛黄兽皮残图走在最前，每逢岔口便借着微弱火光仔细辨查图上的猩红标记。其余几人各怀心思地挤在湿冷狭窄的甬道内，被火光拉扯出的影子如鬼魅般在墙壁上扭曲蠕动。" },
  { type: "narration", text: "“咔嗒、咔嗒——”\n\n突然，头顶沉重的石缝间传来阵阵令人牙酸的碎石摩擦声。\n\n未等众人反应过来，无数拇指大小、通体乌黑发亮、背生坚硬甲壳的异虫便从石缝间争相挤出。不过弹指工夫，虫群已汇聚成一片铺天盖地的滚滚黑浪。密集的振翅声如雷鸣爆发，震得众人耳膜发胀、气血翻涌。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "不好，此乃极为嗜血的噬魂蛊！这些东西对修士的气血与真元波动极其敏感。诸位若不想被啃噬成一具白骨，速速施展敛气之术，切莫外泄半丝真元！", expression: "calm", position: "center" },
  { type: "narration", text: "众人闻言不敢怠慢，纷纷收束体内气血与真元，将身躯紧贴在凹凸不平的石壁两侧。乔无咎迅速卷起残图收入袖中，眼看那铺天盖地的黑色虫浪已如惊涛拍岸般压到近前。" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "一味收敛气血，未免太被动了些。", expression: "amused", position: "left" },
  { type: "narration", text: "赵黎大袖一挥，一只通体腥红的血纹蛊呼啸而出，围绕其周身盘旋飞舞，瞬间撑起一道三尺血环。\n\n铺天盖地的噬魂蛊刚一触碰血芒，便如泼了火油般啪啪爆开，化作团团幽绿色的妖异火焰。赵黎立于血火之中，神色冷漠，脚下干净得犹如狂风暴雨中的一座孤岛。" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "character", action: "hide", character: "zhao-li" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "narration", text: "血光一现，嗜血的虫潮被彻底激怒，整条甬道顿时陷入混乱！\n\n一股黑色虫浪贴着泥水猛然卷向你的脚踝。千钧一发之际，侧旁一道冷冽剑芒贴着你的裤腿斜斜掠过，剑气锋锐无比，瞬间将扑近的噬魂蛊绞成碎屑。\n\n几乎在同一时刻，数只噬魂蛊自拱顶死角无声绕向纪清寒的后颈。你眼疾手快，双指并拢如剑，呼地弹出一段月白色的弧形真元刃芒，划过一道优美弧线，将那几只蛊虫死死钉入石缝，腥血溅射。\n\n纪清寒侧目看了你一眼，手中长剑顺势向你身侧偏转少许，凭空撕开一道密不透风的剑幕，替你分担了大半正面压下的虫潮压力。" },
  { type: "narration", text: "虫潮贴着潮湿的石壁呼啸翻卷，你侧身避开迎面下扑的一片黑影，身形飘忽间，距离赵黎周身撑起的血环不过数步之遥。幽绿色的血火沿着环迹明灭不定，将试图靠近的噬魂蛊纷纷烧得蜷曲坠地。" },
  { type: "character", action: "hide", character: "ji-qinghan" },
  { type: "character", action: "show", character: "su-ying", position: "left", expression: "wary" },
  { type: "narration", text: "而在你左侧不远处，苏莹正咬紧牙关催动着防御蛊光罩。那光罩摇摇欲坠，光芒明暗不定，看似随时都会被狂暴的虫潮撕裂。\n\n然而，你暗中放出的一缕神识却看得真切：所有铺天盖地扑向苏莹的噬魂蛊，在即将触及她的瞬间，都会显得极其忌惮，反常地向两侧偏转绕开！\n\n察觉到你如鹰隼般锐利的窥探视线，苏莹身形微震，急忙故意让手中的掐诀变得杂乱无章，口中原本急促低诵的古怪音节也随之变得断断续续，低垂的睫毛剧烈颤抖，显得慌乱不堪。\n\n“嗡——”\n\n狂暴的虫潮再次从狭窄的甬道上方倾泻而下。一边是赵黎以血火暂时清出的落脚处，一边是苏莹身前那道反常的空隙。两处动静同时落入你的眼中，虫潮已经逼到近前。" },
];

export const shadowEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-corridor", transition: "fade" },
  { type: "narration", text: "汹涌的噬魂蛊潮退得极为突兀，转瞬间便缩回石壁缝隙，密集的振翅声也随之消失。\n\n狭窄的石道内，脚下已被黑色虫尸铺了厚厚一层。众人每向前迈出一步，鞋底都会碾碎几片坚硬甲壳，发出令人牙酸的“咔嚓”声。刺鼻的血腥与腐败气味充斥着整条甬道，久久无法散去。" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "panicked" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "侥幸……若非诸位道友各有手段，我等今日怕是要交代在这里了。", expression: "panicked", position: "left" },
  { type: "character", action: "hide", character: "xue-feng" },
  { type: "narration", text: "就在此时，前方摇曳的火光忽然闪烁了几下。\n\n你心有所感，不经意地望向侧方石壁。只见粗糙的青石缝隙之间，几道原本黯淡难辨的血色纹路正逐段亮起，仿佛新鲜朱砂渗入石中，在半明半暗的火光下泛出诡异的暗红光泽。\n\n你停下脚步，暗自运转真元戒备。\n\n血色纹路接连亮过数道，最终在你面前交汇成一道残缺阵纹。与此同时，藏在袖中的祖传旧玉也随之升温，一次次传来与阵纹相同节奏的细微律动。\n\n你不动声色地按住旧玉，正欲分辨其中规律，一道沙哑的声音忽然从身旁传来。" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "诸位道友，都在看什么呢？这般入神。", expression: "amused", position: "left" },
  { type: "narration", text: "不知何时，赵黎已经走到你身侧。他扫了一眼石壁上的血色阵纹，目光很快落在了你按住衣袖的右手上。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "小子，你藏在袖中的东西似乎有些名堂。借老夫瞧瞧如何？", expression: "wary", position: "left" },
  { type: "narration", text: "你没有回答，只将体内真元悄然运转起来，神色平静地站在原地。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "这洞府深处杀机重重。若有人不慎死在里面，身上的东西自然也就成了无主之物。老夫只是提前问上一句，免得届时认错了归属。", expression: "amused", position: "left" },
  { type: "narration", text: "赵黎语气轻描淡写，眼神却始终停留在你的衣袖上，显然不准备轻易揭过此事。" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "此地的禁制留有生门痕迹。阵法脉络虽然残缺，却不像单纯用于阻拦外人，更像是在辨认某种气息。", expression: "alert", position: "right" },
  { type: "narration", text: "她没有回头，手中长剑斜指地面，目光落在石壁间逐渐暗淡的阵纹上。赵黎这才移开视线，转而望向那道残缺阵纹。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "辨认气息？那位数百年前的五转蛊修，难道还在等什么人不成？", expression: "wary", position: "left" },
  { type: "character", action: "show", character: "su-ying", position: "center", expression: "wary" },
  { type: "narration", text: "他说话间，目光从众人身上一一扫过，最后在苏莹身上稍作停留。\n\n苏莹始终低着头，藏在袖中的手指悄然收紧，却没有开口。" },
  { type: "character", action: "hide", character: "zhao-li" },
  { type: "character", action: "hide", character: "ji-qinghan" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "也可能只是残存禁制受了方才真元波动的惊扰。此处不宜久留，还是先探前路。", expression: "calm", position: "center" },
  { type: "narration", text: "石道内再次安静下来。\n\n赵黎仍在留意你的衣袖，纪清寒则凝视着墙上的残缺阵纹。苏莹垂下目光，悄然松开了攥紧的袖口。\n\n而你袖中的祖传旧玉，温度仍在不断升高，已经隐隐有些烫手。" },
];

export const chamberEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-corridor", transition: "fade" },
  { type: "narration", text: "众人沿着甬道又走出数十步，四周愈发逼仄，只有鞋底摩擦碎石的沙沙声在黑暗中回荡。\n\n行至中段，头顶蓦地传来一声极轻的脆响。你心生警兆，正欲出声示警，脚下青石已从中断裂。整段地面轰然塌陷，碎石裹着积尘坠入下方。\n\n失重感骤然袭来。你强提真元，足尖在岩壁凸起处连点数下，勉强卸去大半坠势。纪清寒拔剑点向石壁，借着反震之力飘然落地；赵黎周身血光一闪，同样稳住身形。其余几人虽然略显狼狈，却都没有受伤。\n\n四周很快陷入伸手不见五指的黑暗。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
  { type: "narration", text: "片刻后，乔无咎从碎石间拾回火折子，重新将其点亮。昏黄微光摇曳而起，一间封闭多年的地下暗室随之出现在众人眼前。\n\n暗室四壁刻满暗红色沟槽，干涸的血垢凝结其中，散发着一股令人作呕的甜腥气味。方才众人落地时逸散的真元顺着沟槽传开，引得几处残纹短暂泛起红光。\n\n暗室中央立着一尊三足青铜古鼎，鼎身布满细密裂痕，里面积着厚厚一层黑红药渣。鼎下的地火早已熄灭，周围却仍残留着淡淡药气。" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "苏莹蹲下身，借着火光观察片刻。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "这些沟槽并非护阵禁制，更像是引导药力的阵纹。石鼎中炼出的东西，当年都被送去了那面墙后。", expression: "wary", position: "right" },
  { type: "narration", text: "顺着她所指的方向望去，暗室尽头嵌着一座残破石龛。\n\n龛门半开，里面并排封着五枚拳头大小的蛊卵。其中两枚已经灰败石化，卵壳表面遍布裂纹，显然早已失去生机。剩下三枚则各有异状：一枚遍生黑斑，一枚覆满厚重甲纹，最后一枚缠绕着暗红血纹。\n\n你缓步靠近石龛。\n\n刚踏入三尺之内，贴身藏着的祖传旧玉便骤然升温。石龛中的甲纹蛊卵与血纹蛊卵同时轻颤，卵壳下分别透出一沉一锐两股气息；那枚黑斑蛊卵却始终毫无反应。\n\n直到苏莹向前走出半步，黑斑蛊卵内部才传来极轻的摩擦声。" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "narration", text: "赵黎环抱双臂，目光在你与苏莹之间来回扫过。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "这三枚东西倒是各有反应。不过能在这种地方存活数百年，未必是什么善物。真要伸手，最好先想清楚。", expression: "amused", position: "left" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "narration", text: "纪清寒没有靠近石龛，只横剑守在众人坠落的缺口旁，留意上方甬道与暗室周围的动静。薛逢站在外围，目光在三枚蛊卵之间游移，迟迟不敢伸手。" },
  { type: "character", action: "hide", character: "zhao-li" },
  { type: "character", action: "hide", character: "ji-qinghan" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
  { type: "narration", text: "乔无咎展开泛黄残图，对照石鼎上的纹路看了片刻，最终摇了摇头。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "残图中没有这间暗室的记载。既然甲纹与血纹蛊卵只对你有所回应，便由你自行处置。至于另外那枚，也该问问苏道友的意思。", expression: "calm", position: "center" },
  { type: "narration", text: "石龛中的药气正在迅速消散，残阵透出的红光也越来越弱。\n\n甲纹蛊卵气息沉稳，暗红蛊卵锋芒隐现，苏莹面前的黑斑蛊卵则安静得近乎死寂。留给你判断的时间不多了。" },
];

export const illusionEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-corridor", transition: "fade" },
  { type: "narration", text: "踏出甬道，周遭温度骤降。石殿中央的黑色石台刻满猩红蛊纹，甜腥奇香早已悄然侵入经络。\n\n你刚想封闭呼吸，眼前石殿便骤然破碎。" },
  { type: "narration", text: "旧宅檐下，大雨初歇。记忆深处总唤你小名的人站在老槐树旁，朝你伸出带着薄茧的手。你分明知道旧宅早已烧尽，却仍一步步向她走去。", mode: "center" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "道友！", expression: "alert", position: "right" },
  { type: "effect", effect: "flash", tone: "neutral" },
  { type: "sound", asset: "sfx.scene-flash" },
  { type: "narration", text: "清冷喝声如剑鸣炸开，温情幻象寸寸崩裂。你猛然清醒，手里握着的并非故人，而是纪清寒冰凉的手掌。\n\n她显然也才脱离心魔，耳根瞬间泛红，另一只手却已按住长剑，寒芒指向数步外的薛逢。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "left", expression: "calm" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "诸位道友，速速收摄心神。", expression: "calm", position: "left" },
  { type: "narration", text: "乔无咎退到阵眼边缘，翻开兽皮地图背面的残图，依照上面的标记连试数处，终于将暗红蛊印扣入枢纽。幻境应声瓦解，他踉跄半步才重新站稳。" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "character", action: "hide", character: "ji-qinghan" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "character", action: "show", character: "xue-feng", position: "center", expression: "greedy" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "sad" },
  { type: "narration", text: "赵黎强行压住失控乱舞的血纹蛊，眼底惊恐一闪即逝；薛逢仍对着空气乱抓，口中嚷着极品蛊晶；苏莹贴墙喘息，眼角泪痕未干。" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "好厉害的古禁……薛某适才竟看见满殿异宝，实在见笑。纪道友无事吧？", expression: "smiling", position: "center" },
  { type: "character", action: "hide", character: "zhao-li" },
  { type: "character", action: "hide", character: "xue-feng" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "纪清寒没有理会他。她终于抽回被你握住的手，偏过头，只留下泛红的侧脸。\n\n幻境虽破，众人的猜忌却已推到顶点。你按紧袖中旧玉：这一环扣一环的死局，究竟是谁在执子？" },
];

export const stoneBridgeEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-corridor", transition: "fade" },
  { type: "narration", text: "迷魂阵后是一道深不见底的墓沟。唯一的去路，是横在沟上的半截石梁；梁面窄得只能容一人侧身，底下不时传来铜铁拖行的沉响。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "石梁撑不了多久。一次过一个，别停。", expression: "calm", position: "center" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "narration", text: "话音刚落，对岸石壁便亮起一枚机关蛊核。石梁开始向下倾斜，身后的退路也被幻雾重新吞没。" },
];

export function puppetsEvents(state: GameState): VisualNovelEvent[] {
  const events: VisualNovelEvent[] = [
    { type: "background", asset: "background.tomb-corridor", transition: "fade" },
    { type: "narration", text: "墓道尽头是一处恢弘地下石坪。四具丈许高的铜皮傀儡同时亮起猩红蛊核，机关关节发出牙酸摩擦声，每一步都震得地面微颤。" },
    { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
    { type: "narration", text: "赵黎抬手催动血纹蛊，随意将逼近的一具傀儡轰碎。" },
    { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "这是牵机蛊吐出的丝。要隔空御使四具傀儡，操纵它们的人不会离得太远。", expression: "wary", position: "left" },
    { type: "character", action: "hide", character: "zhao-li" },
    { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
    { type: "narration", text: "乔无咎只说这是墓主留下的守墓机关，随即催动护身蛊挡住傀儡踏落时飞起的碎石。腰间旧玉再次灼热起来，这一次你没有遮掩。" },
    { type: "character", action: "hide", character: "qiao-wujiu" },
  ];
  if (state.flags.includes("纪清寒回护")) {
    events.push(
      { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
      { type: "narration", text: "傀儡合围前，纪清寒忽然以剑鞘点在你肩上。一缕寒白剑意随之没入经络，替你护住几处要害。" },
      { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "墓门前，你替众人省了一场麻烦。现在还你。", expression: "alert", position: "right" },
      { type: "narration", text: "寒意在体内流转一周，你的气血随之稳固下来。" },
    );
  }
  return events;
}

export function fogEvents(state: GameState): VisualNovelEvent[] {
  const events: VisualNovelEvent[] = [
    { type: "background", asset: "background.fog-passage", transition: "fade" },
    { type: "narration", text: "石坪尽头涌出浓得化不开的蛊雾。灵识被压到不足三尺，连自己的脚尖都看不真切。" },
    { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
    { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "我绕后封住追兵，诸位先走。", expression: "calm", position: "center" },
    { type: "character", action: "hide", character: "qiao-wujiu" },
  ];
  events.push(
    { type: "narration", text: "十二具更沉重的傀儡自雾中逼出，脚步碾过碎石，一声比一声近。地面骤然裂开，所有人都被陷道吞没。\n\n下坠的混乱里，你只来得及抓住一只手。" },
    { type: "choice", choices: resolveFogRouteChoices(state) },
  );
  return events;
}
