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
  { type: "narration", text: "一行人离开炼蛊暗室，沿着一条向下倾斜的甬道继续深入。\n\n约莫走出数十丈，前方豁然开阔，现出一座阴冷的八角石殿。殿中不见棺椁，也没有陪葬之物，只有一方半人高的黑色石台立在中央。石台表面布满暗红蛊纹，纹路层层交叠，一直延伸到周围的地砖之下。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "left", expression: "calm" },
  { type: "narration", text: "乔无咎最先跨过门槛。才走出两步，他手中的兽皮残图便泛起一层微弱红光。\n\n他停下脚步，低头辨认图上的标记。其余几人见状，也各自放慢了脚步。\n\n你走入石殿不久，忽然闻到一股若有若无的甜香。\n\n这香气极淡，却不是随着呼吸进入体内。你分明已经闭住口鼻，仍感觉到一丝凉意透过脚底，沿着经络悄然向上蔓延。\n\n你心中一凛，刚要出声示警，眼前的石殿便毫无征兆地暗了下去。" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "narration", text: "再睁眼时，你已经站在故乡的旧宅中。\n\n雨刚停不久，屋檐上的积水正一滴一滴落在青石板上。院角那棵老槐树枝繁叶茂，湿润的叶片间挂着尚未落尽的水珠。\n\n树下站着一名身穿青布衣裙的姑娘。\n\n她与你年岁相仿，是自幼一同长大的青梅竹马。你离乡求道那年，她曾追到村口，将亲手缝好的旧布囊塞进你怀里。后来故乡遭逢变故，旧宅被烧成废墟，她也从此下落不明。\n\n眼前之人仍是分别时的模样，仿佛这些年从未过去。\n\n她轻声唤出那个只有故乡旧人才知道的小名，随后向你伸出手。", mode: "center" },
  { type: "narration", text: "你清楚自己仍在蛊墓之中，更知道眼前所见多半是迷惑心神的幻象。可那雨后的泥土气息、槐叶间落下的水声，甚至她望向你时的神情，都与记忆中分毫不差。\n\n她的手仍停在半空，安静地等着你。\n\n你最终向前走了一步，伸手握住了她的手掌。\n\n掌心微凉，指节间带着几处细小的薄茧。她的五指很快收紧，与你紧紧握在一起，像是怕一松手，你便会再次离开。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "left", expression: "calm" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "诸位道友，速速收摄心神！", expression: "calm", position: "left" },
  { type: "effect", effect: "flash", tone: "neutral" },
  { type: "sound", asset: "sfx.scene-flash" },
  { type: "narration", text: "声音穿过雨幕，落入耳中时犹如金铁相击。\n\n老槐树上的雨珠忽然停在半空。下一刻，天空浮现出一道暗红裂痕，旧宅、院墙与眼前女子的身影也随之扭曲起来。\n\n你本能地握紧了掌中的手。\n\n幻境迅速消退，石殿昏暗的轮廓重新出现在眼前。那只被你握住的手却没有随幻象一同消失，反而传来真实而清晰的触感。" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "你定睛看去，才发现站在自己面前的并非故人，而是纪清寒。\n\n两人的手仍紧紧交握在一起。\n\n纪清寒似乎也刚被乔无咎的喝声惊醒。她眼中还残留着一丝未散的茫然，直到低头看见彼此交扣的手指，才猛然回过神来。\n\n她那张素来清冷的脸上泛起一层薄红，另一只手下意识按住剑柄，却没有将剑拔出。" },
  { type: "narration", text: "石殿中央，乔无咎是最先恢复清醒的人。\n\n此时他已经退到黑色石台旁，正将数枚暗红蛊印依次压入阵台上的凹槽。兽皮残图被他摊在身前，上面显现出数道与石台蛊纹相互对应的细线。\n\n方才那声低喝只暂时撼动了幻境。赵黎、薛逢与苏莹仍站在原地，各自受困于心中所见。乔无咎背对众人，正忙着寻找剩余阵枢，没有留意到你与纪清寒已经醒来。\n\n纪清寒轻轻挣了一下。\n\n你与她短暂对视，随即察觉到殿中的甜香仍未完全散去。其余三人毫无防备地困在幻境中，一举一动都暴露在你们眼前。" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
];

export const stoneBridgeEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-corridor", transition: "fade" },
  { type: "narration", text: "迷魂阵彻底停下后，石殿后方传来一阵沉闷的摩擦声。\n\n原本严丝合缝的石壁缓缓向两侧退开，露出一条向下延伸的狭窄墓道。冷风从黑暗中迎面吹来，带着潮湿石壁特有的阴寒气息。\n\n众人沿墓道走出不远，前方的路便骤然断开。\n\n一道宽逾十丈的墓沟横在眼前。沟底漆黑不见尽头，隐约能听见铁链拖过石面的声音。乔无咎踢落一块碎石，过了数息，深处才传来一声微不可闻的碰撞。\n\n墓沟上方只横着一条狭窄石梁。\n\n梁身由数块长石拼接而成，宽度仅容一人侧身通过，表面遍布裂纹。石梁两端各有一道弧形锁槽，沟对面的石壁上则嵌着一枚拳头大小的暗红蛊核。几道黯淡蛊纹从蛊核中延伸出来，没入梁下的转轴。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
  { type: "narration", text: "乔无咎在沟边观察片刻，捡起一块碎石抛上石梁。\n\n碎石才滚出数尺，梁下便响起一声机括咬合的轻响。整条石梁随之向右倾斜少许，积灰从接缝间簌簌落下。对岸那枚暗红蛊核也亮起一瞬。\n\n乔无咎脸色微沉。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "石梁受力便会带动下方转轴。人在上面停得越久，倾斜得越快。", expression: "calm", position: "center" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "赵黎盯着对岸的蛊核看了片刻，冷笑一声。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "机关的真元都汇在那里。毁了它，这条石梁自然不会再翻。", expression: "wary", position: "left" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "薛逢探头看了一眼深沟，很快又向后退去。苏莹则蹲在石梁近端，用指尖拂去锁槽上的积灰，露出几道残缺蛊纹。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "锁槽还能暂时卡住转轴，但两端必须同时受力。只压住一边，石梁还是会翻下去。", expression: "wary", position: "right" },
  { type: "character", action: "hide", character: "zhao-li" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "narration", text: "她话音未落，对岸的暗红蛊核再次亮起。\n\n方才用于试探的碎石已经触发机关。蛊纹中的红光非但没有熄灭，反而沿着转轴一寸寸向石梁两端蔓延。\n\n沉重的机括声从墓沟下方传来。\n\n石梁开始缓缓侧倾，近处锁槽中的石齿也在震动中逐渐松脱。照这个速度，用不了多久，整条石梁便会翻入沟底。" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "narration", text: "纪清寒拔剑出鞘，目光在石梁两端扫过。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "我可以先到对岸压住另一处锁槽。近端还要留下一人，否则其他人过不了这座墓沟。", expression: "alert", position: "right" },
  { type: "narration", text: "对岸蛊核的光芒越来越亮。\n\n若有人能够抢在石梁彻底翻转前抵达对岸，直接击碎蛊核，机关便会停止；若要让所有人稳妥通过，则必须有人分别守住两端锁槽。\n\n留给众人的时间已经不多。" },
];

export function puppetsEvents(state: GameState): VisualNovelEvent[] {
  const events: VisualNovelEvent[] = [
    { type: "background", asset: "background.tomb-corridor", transition: "fade" },
    { type: "narration", text: "墓道尽头是一处宽阔的地下石坪。一具丈许高的铜皮傀儡半跪在石坪中央，头颅低垂，胸前的暗红蛊核早已熄灭。\n\n众人踏上石坪后，傀儡背后的牵机丝忽然一根根绷紧。沉重头颅随之抬起，胸前蛊核亮起猩红光芒，铜铸关节在转动中发出刺耳的摩擦声。" },
    { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
    { type: "narration", text: "赵黎眯起眼睛，目光沿着牵机丝一直追到石壁上方。那些细丝没入层层石缝，根本找不到可以直接斩断的位置。" },
    { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "牵机丝藏在墙里。只斩外面的几根没有用，得毁掉它胸前的蛊核。", expression: "wary", position: "left" },
    { type: "character", action: "hide", character: "zhao-li" },
    { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
    { type: "narration", text: "乔无咎只说这是墓主留下的守墓机关，随即展开残图，寻找关闭石坪禁制的方法。\n\n铜皮傀儡迈下石座，蛊核投出的红光牢牢锁在你身上。与此同时，石坪两侧的石门开始下落，准备将你与其余人隔开。腰间旧玉再次灼热起来，这一次你没有遮掩。" },
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
  events.push(
    { type: "narration", text: "其余人被迫退到石门之外的瞬间，两扇厚重石门轰然合拢。外面的声音顿时变得模糊，只剩那具铜皮傀儡拖着沉重脚步，独自向你逼近。" },
  );
  return events;
}

export function fogEvents(state: GameState): VisualNovelEvent[] {
  const events: VisualNovelEvent[] = [
    { type: "background", asset: "background.fog-passage", transition: "fade" },
    { type: "narration", text: "铜皮傀儡胸前的蛊核闪烁两下，终于彻底暗了下去。\n\n沉重的身躯向前倾倒，砸在石面上，扬起一片呛人的尘灰。与此同时，甬道前后紧闭的石门缓缓升起。待尘埃稍散，失散片刻的众人重新聚到了一处。\n\n乔无咎展开那张泛黄的兽皮残图，只看了一眼便继续向墓穴深处走去。方才的厮杀消耗了众人不少真元，一路上无人交谈，甬道内只剩下杂乱的脚步声。\n\n前行数十丈后，狭窄的墓道忽然向外开阔。\n\n一座四四方方的地下石厅出现在众人面前。厅中铺着整齐的黑色石板，四面各有一道封闭的石门，门框附近刻满了黯淡的蛊纹。乍看之下，四条路似乎并无分别。" },
    { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
    { type: "narration", text: "乔无咎停下脚步，将残图翻来覆去看了两遍，眉头渐渐皱起。" },
    { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "残图上没有这座石厅。先别乱走。", expression: "calm", position: "center" },
    { type: "character", action: "hide", character: "qiao-wujiu" },
  ];
  events.push(
    { type: "narration", text: "众人当即止步。\n\n一阵细微的泄气声忽然从四周传来。\n\n灰白色的浓雾从石壁缝隙中喷涌而出，沿地面飞快扩散。短短数息，整座石厅便被雾气填满。神识探入其中，如同陷进一团湿冷的泥浆；原本站在数步外的人，也只剩下一道模糊的影子。" },
    { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "wary" },
    { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "都站在原地！这雾能扰乱感知，莫要胡乱催动真元！", expression: "wary", position: "center" },
    { type: "character", action: "hide", character: "qiao-wujiu" },
    { type: "narration", text: "话音未落，脚下突然传来一阵连续的机括转动声。\n\n你低头望去，只见原本严丝合缝的黑色石板正在缓缓错位。那些石板根本不是固定的地面，而是一块块能够绕轴翻转的机关踏板。\n\n数声惊呼同时从雾中响起。\n\n石板接连倾斜，露出下方深不见底的机关甬道。众人立足不稳，转眼便被雾气和不断翻转的地面分割开来。\n\n你脚下的石板也猛然下沉。\n\n身体失去平衡的一瞬间，浓雾中的数处动静同时传入耳中。\n\n左前方血光暴涨，血纹蛊撕开雾气，将迎面坠落的碎石尽数绞碎。赵黎沙哑的冷笑声在轰鸣中一闪而逝。\n\n右侧先是传来一声清越剑鸣，紧接着便响起剑刃与机关铁链相撞的铮鸣。白色身影随下沉的石板一同没入雾中。\n\n斜后方的墙面上，几道血红蛊纹依次亮起。一条此前不曾出现的狭窄石缝短暂开启，苏莹的身影踉跄着闪入其中。\n\n距离你最近的薛逢却没有呼喊。他踩着几块仍未完全翻转的石板边缘，接连换了数次落脚之处，正悄无声息地向石厅角落退去。那几步看似仓促，却恰好避开了所有正在下沉的机关踏板。\n\n脚下石板倾斜得越来越厉害。\n\n留给你判断的时间，只剩下一瞬。" },
    { type: "choice", choices: resolveFogRouteChoices(state) },
  );
  return events;
}
