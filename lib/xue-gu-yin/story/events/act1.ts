import type { VisualNovelEvent } from "../../model.ts";

export const gateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-gate", transition: "fade" },
  { type: "narration", text: "黑风呼啸，暴雨倾盆。荒原上的蛊市早已散尽，空气中弥漫着刺骨的寒意与微弱的腥臭。\n\n古老阴森的石门前，稀稀落落站着六名气息各异的散修。雨丝落在众人撑起的微弱护体光罩或粗糙蓑衣上，发出密集连绵的啪嗒声。", mode: "center" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "neutral" },
  { type: "narration", text: "为首的中年男子叫乔无咎，身着一身毫不起眼的灰袍。只见他神色平静地自袖中掏出一张泛黄的兽皮残图，指尖逼出一缕真元注入其中，图上一处猩红如血的标记顿时微光闪烁。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "诸位道友，老夫耗费数载方才查实，这荒原地下埋着的，乃是数百年前一位五转蛊修的坐化洞府。", expression: "neutral", position: "center" },
  { type: "narration", text: "此言一出，密集的雨声中顿时多出了几声压抑的沉重呼吸。五转蛊修，实力堪比高阶强者，这等存在遗留下的秘宝与本命蛊，对苦苦挣扎的散修而言无疑是脱胎换骨的机缘。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "在蛊道一途，能炼出五转本命蛊者无一不是手段通天之人。老夫按约定带路，入内后若有所得，见者有份。", expression: "neutral", position: "center" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "narration", text: "你冷眼伫立在队伍后方最边缘的位置，暗中运转敛气之术，右手则始终隐蔽地按在袖中那枚祖传旧玉之上。\n\n这枚平时冰冷如铁的旧玉，此刻竟在掌心中微微发烫，并伴随着微不可察的律动。石门深处，隐隐有一股与旧玉同源的古老气息正在缓缓苏醒。" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "见者有份？乔道友这话未免太轻巧了。", expression: "amused", position: "left" },
  { type: "narration", text: "斜前方倚靠在青石旁的一名少年忽地冷笑。此人唇红齿白、眉目俊秀，开口的嗓音却十分沙哑如同一位老者。他指尖捏着一只通体腥红的异蛊，任凭那蛊虫伸出细长口器，贪婪地吮吸着雨幕中残留的稀薄血气。" },
  { type: "character", action: "show", character: "ji-qinghan", asset: "character.ji-qinghan.neutral", position: "right", expression: "neutral" },
  { type: "narration", text: "距他数尺之外，白衣女修纪清寒怀抱长剑，傲立雨中。周身散发着令人退避三舍的凛冽剑意，任凭雨水沿鬓角滑落领口，始终面无表情，眼神古井无波。" },
  { type: "character", action: "hide", character: "zhao-li" },
  { type: "character", action: "hide", character: "ji-qinghan" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "smiling" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "嘿嘿，我等散修在外讨生活本就艰难，进了洞府禁制，诸位可要齐心协力才是。", expression: "smiling", position: "left" },
  { type: "narration", text: "圆脸汉子薛逢满面堆笑地打着哈哈，那双细长的三角眼却在众人的储物袋与要害部位暗自扫过，流露出几分遮掩不住的奸诈。" },
  { type: "character", action: "hide", character: "xue-feng" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "而在你侧前方的少女苏莹，自始至终低垂着头，正用修长指尖在泥泞中快速勾勒着石门上的古老蛊纹，口中念念有词，似乎识得这古老的禁制。" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "neutral" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "时候不早，此时正是子夜禁制最弱之际。此去生死难料，诸位自便吧。", expression: "neutral", position: "center" },
  { type: "narration", text: "话音未落，乔无咎周身撑起一道灰光，身形一晃便果断没入漆黑如墨的石门之中。" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "narration", text: "赵黎不屑地冷笑一声，嘴角挂着一抹笑意，紧随其后。\n\n你按紧掌心发烫的旧玉，暗自运转真元，抬脚跟了上去。" },
];

export const rainMarkEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-gate", transition: "fade" },
  { type: "narration", text: "跨过那道幽暗如墨的石门后，一条曲折蜿蜒的狭长石阶赫然呈现在眼前，斜斜通往湿冷阴森的地底深处。\n\n洞内空气沉闷湿腐，夹杂着一股令人作呕的腥膻恶臭。门外倾泻而下的暴雨顺着陡峭的阶梯蜿蜒流淌，不断冲刷着地面上堆积不知多少年岁月的黑黏浮泥。\n\n借着洞壁上偶尔闪烁的微弱磷光，隐约可见石阶表面显露出几道盘曲交错、若隐若现的暗红纹路。那纹路形如蜈蚣百足，隐隐散发着说不出的诡异与阴森。" },
  { type: "character", action: "show", character: "ji-qinghan", asset: "character.ji-qinghan.neutral", position: "right", expression: "alert" },
  { type: "narration", text: "白衣女修纪清寒美眸微凝，显然对此地颇具戒备。她周身灵气微微一荡，施展出某种极为高明的轻身法门，娇躯化作一道白虹迎风掠出。其靴底仅在数块石阶上如蜻蜓点水般轻轻一蹭，便毫发无损地落在了数丈之外的拐弯处。\n\n然而，就在她身形掠过、带起的风劲将阶面泥沙再次吹散了几分时，走在队伍后方的你凝神细看，眼角余光骤然捕捉到了极其细微的异样。\n\n那被雨水冲刷干净的暗红蛊纹交汇处，竟隐蔽地分布着一圈圈针眼大小的密集细孔，孔洞内部隐隐泛着幽绿色的冷光，显然淬有见血封喉的剧毒。" },
  { type: "narration", text: "纪清寒刚才之所以未曾引发异状，全凭其飘逸非凡的身法与极轻的落脚分寸，并未真正触及那隐藏在暗处的机关陷阱。\n\n此时，走在前面的圆脸汉子薛逢正满面堆笑地跟在后头，步履沉重，大摇大摆地抬起右脚，眼看就要结结实实地踩向那块布满毒针暗孔的致命石阶……\n\n你目光微闪，袖中的指尖微微收紧，心中瞬间转过数条计较。" },
];

export const bloodThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-gate", transition: "fade" },
  { type: "narration", text: "这道沉闷湿冷的狭长石阶延伸了约莫三四十丈深，盘旋向下，空气中弥漫着一股积攒多年的泥腐与腥膻之气。\n\n前方甬道口上方，斜斜悬着一道足有数丈之高、斑驳沉重的万斤石闸。门槛后的通道极其低矮狭窄，只能容一人弯腰通过。走在最前头的中年修士乔无咎、少年赵黎、圆脸汉子薛逢以及少女苏莹，早已各怀心思、极其警惕地相继潜入了幽暗的甬道深处，身姿转瞬被浓重的阴影吞没。\n\n整条石阶尽头，只剩下你与那白衣女修纪清寒拉开数尺距离，一前一后地向石闸靠近。\n\n你将感知收拢在周身三尺之内，放慢脚步，留意着纪清寒落脚之处与门框两侧的动静。" },
  { type: "character", action: "show", character: "ji-qinghan", position: "left", expression: "alert" },
  { type: "narration", text: "然而，就在纪清寒那纤细的靴尖刚刚跨过青石门槛的瞬间，异变突生！\n\n原本死寂无声的门槛石板上，数道原本暗淡无光、盘曲如蜈蚣般的暗红禁制符纹毫无征兆地爆发出刺目血光。几乎在同一刹那，上方的山体深处传来一阵沉闷如雷的机关轰鸣，锁住石闸的机括骤然松脱，那道万斤石闸沿着两侧滑轨直坠而下，带着无与伦比的呼啸劲风与沉重威压，如陨石砸地般压向门槛！\n\n不仅如此，石闸两侧斑驳的门框内突然弹开数个精巧机括，几道疾风破空声骤响，四条通体呈赤褐色、长约尺许的毒蛊如怒箭般爆射而出，獠牙毕露，直扑离门槛最近的纪清寒面门与心脏要害！\n\n遭此猝然发难，纪清寒虽惊不乱。她眉宇间寒意大盛，娇叱一声，玉手按在剑柄之上，寒芒骤然大作！数道凌厉无比的雪白剑气如水银泻地般席卷而出，一阵密集的脆响过后，迎面刺来的三条赤褐毒蛊当场被凌厉剑芒削断成数截，腥臭的血水洒落在地。\n\n然而这机关蛊毒极为狡诈，第四条毒蛊竟借着同伴爆开的血雾遮挡，贴着门框死角鬼魅般绕到了纪清寒身后。细长虫躯如虬蛇般缠住她执剑的手腕与剑柄，尾端倒钩仍死死扣在门框石孔之中。虫躯骤然收紧，硬生生拉扯着她的剑锋偏转向地面！\n\n上方下坠的万斤石闸带起狂暴的恶风，将两人的衣袍吹得猎猎作响。纪清寒被绷直的毒蛊拖在门槛处，美眸中终于划过一丝惊慌，牙关紧咬，清冷的声音在轰鸣声中显得格外急促。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "石闸要落下了！", expression: "alert", position: "left" },
];
