import type { VisualNovelEvent } from "../../model.ts";

export const gateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-gate", transition: "fade" },
  { type: "narration", text: "黑风呼啸，暴雨倾盆。荒原上的蛊市早已散尽，空气中弥漫着刺骨的寒意与微弱的腥臭。\n\n古老阴森的石门前，稀稀落落站着五名气息各异的散修。雨丝落在众人撑起的微弱护体光罩或粗糙蓑衣上，发出密集连绵的啪嗒声。", mode: "center" },
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
  { type: "narration", text: "石门之后，是一道向下延伸的狭长石阶。雨水从门外灌入，冲开阶面泥浆，露出几道若隐若现的暗红蛊纹。" },
  { type: "character", action: "show", character: "ji-qinghan", asset: "character.ji-qinghan.neutral", position: "right", expression: "alert" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "我先过去。", expression: "alert", position: "right" },
  { type: "narration", text: "纪清寒提气掠过石阶，靴底从蛊纹上方一带而过，没有引发任何异状。\n\n待她走出数丈，雨水又冲掉一层浮泥。你这才看清，暗红蛊纹之间藏着一圈细如牛毛的针孔。纪清寒方才落脚极轻，尚未真正压下机关。\n\n薛逢跟在后面，正要踩上同一块石阶。" },
];

export const bloodThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-gate", transition: "fade" },
  { type: "narration", text: "众人刚穿过门洞，沉寂多年的机关突然醒了。两扇石门自左右合拢，门框石孔里钻出数条赤褐蛊虫。它们身躯细长，嗅到血气便往人身上缠。" },
  { type: "character", action: "show", character: "ji-qinghan", position: "left", expression: "alert" },
  { type: "narration", text: "纪清寒一剑削断三条蛊虫，赵黎则只护住自己的血纹蛊。第四条从门框后绕出，缠上纪清寒受伤的剑腕，将她的剑锋猛地拖低。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "门要合了。", expression: "alert", position: "left" },
];
