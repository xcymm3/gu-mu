import { resolveDominantPersonalities } from "../../personality.ts";
import type { Choice, GameState } from "../../model.ts";
import { actThreeRouteEntries } from "../routes/contract.ts";

export const gateChoices: Choice[] = [
  {
    id: "gate-power",
    label: "落后赵黎半步进入石门，暗中观察其血纹蛊",
    next: "rainMark",
    result: "赵黎指间的血纹蛊只显露了片刻威势，你却把真元流转的轨迹牢牢记下。五转遗藏尚未露面，眼前这名邪修的手段已经值得一观。",
    effect: { personality: { power: 1 } },
  },
  {
    id: "gate-insight",
    label: "按紧发烫的旧玉，静待墓门蛊纹下一次微光闪烁",
    next: "rainMark",
    result: "旧玉的热意与墓门蛊纹遥相呼应，苏莹的指尖也在同一刻停顿。你没有声张，只把两处异常一并记在心里。",
    effect: { personality: { insight: 1 } },
  },
];

export const rainMarkChoices: Choice[] = [
  {
    id: "rain-compassion",
    label: "突然出声喊住薛逢，指明蛊纹下隐藏的剧毒针孔，劝众人贴着石壁边缘绕行",
    next: "bloodThreshold",
    result: "你双眼微眯，当即沉声开口喊住了薛逢，并冷冷指出了那泥水中若隐若现的剧毒细眼。薛逢闻言浑身一颤，额头瞬间渗出冷汗，急忙强行收回迈出一半的重脚。远处的纪清寒闻声折返，美眸中闪过一丝异色。只见她冷哼一声，手中利剑拔出半寸，一道凌厉无匹的雪白剑气席卷而出，轰然将石阶边缘的碎石与禁制边缘斩开一条狭窄裂隙，生生清出了一条可供落脚的安全通道。众人见状大喜，纷纷暗运真元，贴着阴湿的石壁小心翼翼地依次绕开蛊纹。当纪清寒自你身旁拂袖擦肩而过时，侧目深邃地看了你一眼，似乎对你具有如此敏锐的洞察力颇感意外。",
    effect: { personality: { compassion: 1 }, flag: "纪清寒回护" },
  },
  {
    id: "rain-scheme",
    label: "佯装不知，冷眼旁观薛逢踩中机关，借此探明这暗器禁制的具体威力与范围",
    next: "bloodThreshold",
    result: "你按紧袖中发烫的旧玉，嘴角绷紧，脚下悄然向后退了半步，打定主意静观其变。下一刻，薛逢那一脚结结实实地踏上了石阶。只听“咔嚓”一声轻响，阶面上的暗红蛊纹瞬间大放异彩，伴随着刺耳的机括运转声，成百上千道绿荧荧的毒针如骤雨狂风般自两侧石壁的暗孔中暴射而出！薛逢吓得魂飞魄散，急忙祭出一面黄铜小盾试图死挡。关键时刻，纪清寒凌空折返，玉手挥动间划出一片如水银泻地般的密不透风的剑幕，叮叮当当一阵狂响，将铺天盖地的毒针尽数击飞。薛逢面如死灰，浑身衣服已被冷汗浸透。不过经此一遭，众人也彻底看清了此处机关的攻击死角，各自提防着贴近石壁边缘，有惊无险地穿过了这段杀机四伏的狭长石阶。",
    effect: { personality: { scheme: 1 } },
  },
];

export const bloodThresholdChoices: Choice[] = [
  {
    id: "threshold-power",
    label: "运转真元，催动本命蛊托住坠落的石闸",
    next: "swarm",
    result: "你双眼微眯，眼中狠厉之色一闪而过。眼看万斤巨石压顶，你并未选择抽身倒退，而是暴喝一声，将周身脉络中的真元如决堤洪水般尽数灌入袖中的本命蛊内。一瞬间，你周身幽光大盛，双臂肌肉高高鼓起，迎着那呼啸砸落的万斤石闸猛地向上狠狠托去！\n\n“轰！！”一声震耳欲聋的巨响在地底炸裂，万斤石闸硬生生砸在你的双掌之上，恐怖的巨力震得你五脏六腑气血翻涌，脚下的坚硬青石瞬间寸寸龟裂。\n\n纪清寒见状美眸大震，反应极快。她趁着这千钧一发之际反转剑锋，一道冷冽剑气贴着缠腕的虫躯掠过，精准无误地将那条毒蛊绞得粉碎。紧接着，她反手一剑斩断仍扣在门框石孔中的倒钩。\n\n“走！”纪清寒娇躯一闪，贴着地面化作一道白线掠入甬道。\n\n在纪清寒脱身的瞬间，你体内真元剧烈翻涌，本命蛊散出的幽光也迅速黯淡。你当机立断收回双掌，施展出极其娴熟的滚地卸力之法，在千钧一发之际顺势向内狠狠一滚。\n\n沉重无比的石闸紧贴着你的脚后跟轰然砸落，掀起的狂风将你的衣袍撕裂数道口子，险之又险地将整条后路彻底封死。",
    effect: { personality: { power: 1 } },
  },
  {
    id: "threshold-compassion",
    label: "放弃硬撑石闸，先震断缠住纪清寒的毒蛊",
    next: "swarm",
    result: "你判断硬撑万斤石闸必然耗费大量真元，索性放弃与它正面角力。电光火石之间，你脚下步法陡变，踩着诡异的方位欺身而上，右手食中二指并拢如刀，凝聚起一团凝练无比的压缩真元，如电光石火般朝纪清寒的手腕处隔空点去！\n\n“哧！”一道凌厉无比的真元指劲透指而出，精准无误地击中那条赤褐毒蛊的七寸要害。伴随着一声凄厉惨叫，毒蛊爆裂开来，化作一摊腥臭血水。\n\n脱离束缚的纪清寒眼神一凛，夺回长剑控制权后并未后退，反而顺势将利剑化作一道惊鸿，斜斜刺入石闸侧面的制动齿轮之中！\n\n“呲啦啦——”利剑与机关齿轮剧烈摩擦，爆发出刺目的火花。制动齿轮被剑锋强行卡住，那滚滚下坠的万斤石闸顿了一顿！\n\n“走！”你身形轻盈如燕，绝不浪费半分机会，抢先一步贴着地面滑入了门后那低矮漆黑的甬道之中。纪清寒紧随其后，在身躯掠过门槛的瞬间拔出长剑。\n\n没了长剑阻滞，轰鸣声骤起，石闸贴着两人的后背狠狠砸落在地，将甬道内外彻底隔绝开来。二人虽惊出一身冷汗，却有惊无险地闯过了这道断龙石闸。",
    effect: { personality: { compassion: 1 } },
  },
];

export const swarmChoices: Choice[] = [
  {
    id: "swarm-insight",
    label: "收敛真元，观察噬魂蛊为何主动避开苏莹",
    next: "shadow",
    result: "你没有急着出手。数次观察后，你确认噬魂蛊并非偶然绕开苏莹，而是在畏惧她无意间念出的古老音节。",
    effect: { personality: { insight: 1 } },
  },
  {
    id: "swarm-scheme",
    label: "任薛逢继续后退，用他试出虫潮追逐血气的规律",
    next: "shadow",
    result: "薛逢狼狈奔逃，虫潮随他的气血起伏不断转向。等你看清规律才出声指路；他以为你救了他，却不知道自己先替你试了险。",
    effect: { personality: { scheme: 1 } },
  },
];

export const shadowChoices: Choice[] = [
  {
    id: "shadow-power",
    label: "告诉赵黎，想要旧玉便等进了深处凭实力来取",
    next: "chamber",
    result: "你没有藏玉，只平静地迎上赵黎的目光。赵黎先是一怔，随即大笑，第一次把你当成了可能争夺机缘的对手。",
    effect: { personality: { power: 1 } },
  },
  {
    id: "shadow-scheme",
    label: "顺着残禁的说法带过血影，先把发烫的旧玉藏好",
    next: "chamber",
    result: "你称那道血影不过是年深日久的残禁，借众人移开视线的空当，将旧玉压进贴身暗袋。赵黎扫了你一眼，没有当场追问。",
    effect: { personality: { scheme: 1 } },
  },
];

export const chamberChoices: Choice[] = [
  {
    id: "chamber-power",
    label: "直接取走血芒最盛的蛊卵",
    next: "illusion",
    result: "你取走血芒吞吐的蛊卵。血刃蛊压过原有攻击蛊的气息，在蛊囊中缓缓舒展锋芒。",
    effect: { personality: { power: 1 }, flag: "血刃蛊" },
  },
  {
    id: "chamber-compassion",
    label: "先取甲纹蛊卵，免得旁人贸然触碰",
    next: "illusion",
    result: "你没让旁人替自己试险，先一步按住甲纹蛊卵。卵壳安静裂开，血甲蛊顺势认主，并未触发暗藏的机关。",
    effect: { personality: { compassion: 1 }, flag: "血甲蛊" },
  },
  {
    id: "chamber-insight",
    label: "让苏莹先选",
    next: "illusion",
    effect: { personality: { insight: 1 }, randomFlags: ["血甲蛊", "血刃蛊"] },
  },
];

export const illusionChoices: Choice[] = [
  {
    id: "illusion-compassion",
    label: "先扶住仍困在幻境中的纪清寒，替她稳住气血",
    next: "stoneBridge",
    result: "你没有追击阵眼，而是先替纪清寒稳住紊乱气血。她从幻境中醒来时，握剑的手仍在轻微发抖。",
    effect: { personality: { compassion: 1 } },
  },
  {
    id: "illusion-scheme",
    label: "装作仍未完全清醒，避开众人对你心魔的探问",
    next: "stoneBridge",
    result: "你任由目光继续涣散，直到众人各自收拾好失态才缓缓回神。没有人追问你在幻境中看见了什么，你也没有给他们开口的机会。",
    effect: { personality: { scheme: 1 } },
  },
];

export const stoneBridgeChoices: Choice[] = [
  {
    id: "bridge-power",
    label: "先踏上石梁，趁机关未醒抢到对岸",
    next: "puppets",
    result: "石梁在脚下剧烈下沉。你借势跃到对岸，一掌震碎刚刚亮起的机关蛊核，为身后众人争出片刻空隙。",
    effect: { personality: { power: 1 } },
  },
  {
    id: "bridge-compassion",
    label: "留下来与纪清寒一同稳住石梁，接应其他人",
    next: "puppets",
    result: "你与纪清寒分守石梁两端，直到最后一人越过墓沟。她说了声“走”，两人才同时撤力；落到对岸时，你发麻的手臂被她稳稳托住。",
    effect: { personality: { compassion: 1 } },
  },
];

export const fogRouteChoices: Choice[] = [
  {
    id: "fog-power",
    label: "迎着最强烈的血气追去——赵黎就在那个方向",
    next: actThreeRouteEntries.zhao,
    result: "别人都在寻找退路，你却迎着雾中最危险的血气追去。赵黎回手扣住你的手腕，像是早已料到你会跟来。",
    requires: { dominantPersonality: "power" },
    effect: { route: "zhao" },
  },
  {
    id: "fog-compassion",
    label: "循着断剑声跃下陷道——纪清寒可能受了伤",
    next: actThreeRouteEntries.ji,
    result: "剑刃折断的声音从下方传来。你几乎没有思索便跃入陷道，在黑暗中抓住了纪清寒冰冷的手。",
    requires: { dominantPersonality: "compassion" },
    effect: { route: "ji" },
  },
  {
    id: "fog-insight",
    label: "沿血色古文消失的方向追去——苏莹一定知道什么",
    next: actThreeRouteEntries.su,
    result: "雾气遮住视野，却遮不住石壁上一闪即逝的血色古文。你沿着痕迹追下去，在陷道尽头找到了苏莹。",
    requires: { dominantPersonality: "insight" },
    effect: { route: "su" },
  },
  {
    id: "fog-scheme",
    label: "先抓住异常安静的薛逢——他一定知道乔无咎去了哪里",
    next: actThreeRouteEntries.traitor,
    result: "你不是去救薛逢，而是一把扣住他的后颈。所有人都在雾中呼喊，唯独他知道哪里没有机关；这枚棋子还有利用价值。",
    requires: { dominantPersonality: "scheme" },
    effect: { route: "traitor" },
  },
];

export function resolveFogRouteChoices(state: GameState): Choice[] {
  const dominant = new Set(resolveDominantPersonalities(state.personality));
  return fogRouteChoices.filter((choice) => (
    choice.requires?.dominantPersonality
    && dominant.has(choice.requires.dominantPersonality)
  ));
}
