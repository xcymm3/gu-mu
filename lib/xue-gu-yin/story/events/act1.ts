import type { VisualNovelEvent } from "../../model.ts";

export const gateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-gate", transition: "fade" },
  { type: "narration", text: "荒原之夜，淫雨霏霏，入夜以来便不曾停歇，带着几分蚀骨的寒意。\n\n散集后的蛊市早已空无一人，墓门前仅余下五名衣装各异的修士。", mode: "center" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "neutral" },
  { type: "narration", text: "为首的中年男子身着灰袍，自称乔无咎。他面色平静地将半张泛黄的兽皮地图在雨幕中缓缓摊开，指尖微凝，轻点在图中一处猩红如血的标记上。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "诸位道友，此地荒原之下，埋着昔日一位五转蛊修的坐化之地。", expression: "neutral", position: "center" },
  { type: "narration", text: "雨声肆虐，漆黑的夜色下却顿时响起几声压抑的沉重呼吸。\n\n五转蛊修。单是这四个字，已足以让在场之人各怀心思。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "在蛊道一途，能将本命蛊炼至第五转者，无一不是手段通天的老怪物。这等前辈高人坐化留下的洞府秘宝，自然是见者有份。", expression: "neutral", position: "center" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "narration", text: "你伫立在队伍偏后的位置，一手始终隐蔽地按在腰间那枚祖传旧玉之上。\n\n这枚平时冰冷异常的旧玉，此刻竟在掌心下微微发烫。墓门深处，仿佛有某种与它同源的力量正在苏醒。" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "见者有份？", expression: "amused", position: "left" },
  { type: "narration", text: "倚在青石旁把玩血纹蛊虫的少年忽地冷笑。他唇红齿白、眉目俊秀，嗓音却苍老刺耳，干枯如风干的树皮。指尖那只通体猩红的蛊虫伸出细长口器，贪婪吞噬着雨幕中的稀薄血气。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "老夫活了这把年纪，只信两样东西——手里的蛊，和拿蛊的那只手。", expression: "amused", position: "left" },
  { type: "character", action: "show", character: "ji-qinghan", asset: "character.ji-qinghan.neutral", position: "right", expression: "neutral" },
  { type: "narration", text: "距他数尺之外，白衣女修纪清寒怀抱长剑，傲立雨中。剑未出鞘，周身却有凛冽剑意。任雨水沿鬓角滑入领口，她连眉头都不曾皱一下，也无半点与旁人攀谈的意思。" },
  { type: "character", action: "hide", character: "zhao-li" },
  { type: "character", action: "hide", character: "ji-qinghan" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "smiling" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "嘿嘿，我等散修在外讨生活，本就维艰！进了墓，诸位可要互相照应。", expression: "smiling", position: "left" },
  { type: "narration", text: "圆脸汉子满面堆笑，口中尽是客套话，那双小眼却在众人的储物袋与要害间打转。此人名唤薛逢，绝不似表面这般憨厚。" },
  { type: "character", action: "hide", character: "xue-feng" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "你身旁的苏莹始终低垂着头。她用白皙纤细的手指在泥土上一笔一画描摹墓门蛊纹，动作极慢，唇角轻微蠕动，仿佛在暗诵某种失传古咒，又似生怕惊醒门后的凶物。" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "neutral" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "时候不早了。此去凶险未知，进墓之后，各凭本事，自求多福。", expression: "neutral", position: "center" },
  { type: "narration", text: "话音未落，他已率先跨入漆黑如墨的石门，身姿转瞬被黑暗吞没。" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "赵黎迈步前，隔着雨幕斜斜打量了你一眼。那目光看似随和，却夹杂着几分看猎物般的阴鸷。\n\n你按紧掌心发烫的旧玉，暗自运转真元，抬脚跟了上去。" },
];

export const rainMarkEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-gate", transition: "fade" },
  { type: "narration", text: "你刚踏上墓门石阶，脚下便传来一声闷响。雨水冲开泥浆，露出几道被人刻意遮住的暗红蛊纹。\n\n乔无咎已经走到石阶中段。纪清寒执剑跟在后面，冷雨正顺着她虎口的一道旧伤往下淌；薛逢则脚下一滑，伸手便要抓住离他最近的人。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "石阶年久失修，诸位当心脚下。", expression: "calm", position: "center" },
  { type: "narration", text: "众人闻言各自放慢脚步。雨势越来越急，石阶边缘又塌下去一角。" },
];

export const bloodThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-gate", transition: "fade" },
  { type: "narration", text: "众人刚穿过门洞，沉寂多年的机关突然醒了。两扇石门自左右合拢，门框石孔里钻出数条赤褐蛊虫。它们身躯细长，嗅到血气便往人身上缠。" },
  { type: "character", action: "show", character: "ji-qinghan", position: "left", expression: "alert" },
  { type: "narration", text: "纪清寒一剑削断三条蛊虫，赵黎则只护住自己的血纹蛊。第四条从门框后绕出，缠上纪清寒受伤的剑腕，将她的剑锋猛地拖低。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "门要合了。", expression: "alert", position: "left" },
];
