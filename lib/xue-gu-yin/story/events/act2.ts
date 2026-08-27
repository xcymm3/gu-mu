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
  { type: "narration", text: "蛊潮退得突兀。脚下黑色死虫堆成厚层，踩上去不断发出碎裂声，腥臭与腐臭填满甬道。" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "panicked" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "侥幸，真是侥幸……", expression: "panicked", position: "left" },
  { type: "character", action: "hide", character: "xue-feng" },
  { type: "narration", text: "火折子忽地一闪。侧方石壁上，一团湿润朱砂般的血影正缓缓蠕动。你盯住它两息，那血痕竟也停了下来，仿佛隔着万斤巨石回望着你。" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "诸位道友，都在看什么呢？", expression: "amused", position: "left" },
  { type: "narration", text: "不知何时，赵黎已滑步至你身侧。他只扫了血影一眼，目光便如刀子般落向你腰间发烫的旧玉。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "小子，你腰间这块玉……借老夫瞧瞧如何？", expression: "wary", position: "left" },
  { type: "narration", text: "你没有接话，只在体内无声运转真元。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "一会儿进了深处若是不幸殒命，这玉便归老夫所有。咱们提前说好。", expression: "amused", position: "left" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "此地古禁留有生门痕迹，阵法不像为了阻挡外敌，反倒像是在等什么人。", expression: "alert", position: "right" },
  { type: "narration", text: "她没有看你，却恰好替你截断了赵黎的话头。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "生门？等什么人？老夫倒也想知道，这位五转大能究竟在等谁。", expression: "wary", position: "left" },
  { type: "character", action: "show", character: "su-ying", position: "center", expression: "wary" },
  { type: "narration", text: "赵黎的余光直扎向苏莹。她身形微震，绞着袖口的手猛然收紧，却咬住牙不吐一字。" },
  { type: "character", action: "hide", character: "zhao-li" },
  { type: "character", action: "hide", character: "ji-qinghan" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "好了，诸位道友莫要疑神疑鬼。一道残存的血影禁制罢了，还是抓紧探墓为妙。", expression: "calm", position: "center" },
  { type: "narration", text: "一时无人能确认那道血影究竟是什么。火光半明半暗，赵黎、纪清寒与苏莹的目光都落到你身上；袖中旧玉的温度，又骤然升高了几分。" },
];

export const chamberEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.tomb-corridor", transition: "fade" },
  { type: "narration", text: "头顶传来极轻的咔嚓声。下一刻，脚下石板轰然塌陷。\n\n火折子脱手坠入黑暗，你在半空强运真元，借凸起岩石翻滚卸力。四周顿时乱成一团。" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "panicked" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "火折子！谁还有火折子！", expression: "panicked", position: "left" },
  { type: "character", action: "hide", character: "xue-feng" },
  { type: "narration", text: "微光重新亮起。乔无咎不知何时捡回火折子，照出一间隐蔽暗室。四壁布满猩红古纹，像活人的血管般微弱鼓动；中央三足石鼎凝着黑红血垢，甜腥得令人作呕。" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "这些血纹在动。石壁里面像是藏着东西。", expression: "wary", position: "right" },
  { type: "narration", text: "暗室最深处立着石龛，封着五只拳头大小的蛊卵。卵壳下微光如五双沉睡的眼睛，直到你的目光扫过，才齐刷刷睁开。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "见者有份。谁先发现的，便由谁先挑。", expression: "calm", position: "center" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "五只蛊卵，三只认主，两只挑人？老夫倒想看看，这座墓究竟想给谁下套。", expression: "amused", position: "left" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "character", action: "hide", character: "zhao-li" },
  { type: "character", action: "show", character: "xue-feng", position: "left", expression: "greedy" },
  { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "既然见者有份，那薛某……", expression: "greedy", position: "left" },
  { type: "character", action: "show", character: "zhao-li", position: "right", expression: "wary" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "哼。", expression: "wary", position: "right" },
  { type: "narration", text: "薛逢立即咽回后半句，眼睛却仍黏在蛊卵上。纪清寒只戒备着活血纹；苏莹则低头站在石龛前，仿佛早知其中封着什么禁忌。" },
  { type: "character", action: "hide", character: "xue-feng" },
  { type: "character", action: "hide", character: "zhao-li" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "calm" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "还愣着做甚？规矩如此，你既先看到，便由你先选。", expression: "calm", position: "center" },
  { type: "narration", text: "你逐一以真元感应。只有甲纹森森与血芒吞吐的两只蛊卵回应了你。赵黎的冷笑、薛逢的贪念、苏莹的惶恐与纪清寒的戒备，一时全都集中到你身上。" },
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
