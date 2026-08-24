import { resolveDominantPersonalities } from "../../personality.ts";
import type { Choice, GameState } from "../../model.ts";
import { actThreeRouteEntries } from "../routes/contract.ts";

export const gateChoices: Choice[] = [
  {
    id: "gate-power",
    label: "留意赵黎手中的血纹蛊，暗记他的控蛊手法",
    next: "swarm",
    result: "赵黎指间的血纹蛊只显露了片刻威势，你却把真元流转的轨迹牢牢记下。五转遗藏尚未露面，眼前这名邪修的手段已经值得一观。",
    effect: { personality: { power: 1 } },
  },
  {
    id: "gate-compassion",
    label: "替苏莹遮住斜落的冷雨，提醒她墓门将开",
    next: "swarm",
    result: "你替苏莹挡去迎面的冷雨。她怔了一下，收回描摹蛊纹的手，在你身侧低声念完最后几个古怪音节。",
    effect: { personality: { compassion: 1 }, flag: "苏莹低语" },
  },
  {
    id: "gate-insight",
    label: "按住发烫的旧玉，观察墓门与苏莹的细微反应",
    next: "swarm",
    result: "旧玉的热意与墓门蛊纹遥相呼应，苏莹的指尖也在同一刻停顿。你没有声张，只把两处异常一并记在心里。",
    effect: { personality: { insight: 1 }, flag: "旧玉发烫" },
  },
  {
    id: "gate-scheme",
    label: "不急着入墓，先记下乔无咎避开的每一处蛊纹",
    next: "swarm",
    result: "乔无咎嘴上说只来过一次，脚步却从未踏错。你记住他的落脚位置，也记住了哪几道蛊纹从始至终没有亮起。",
    effect: { personality: { scheme: 1 }, flag: "识破棋局" },
  },
];

export const swarmChoices: Choice[] = [
  {
    id: "swarm-power",
    label: "迎着蛊潮逼近赵黎，看清血纹蛊如何焚虫",
    next: "shadow",
    result: "你冒险贴近血环，终于看清血纹蛊吞噬血气、反燃虫潮的法门。赵黎瞥见你的目光，只意味不明地笑了一声。",
    effect: { personality: { power: 1 } },
  },
  {
    id: "swarm-compassion",
    label: "与纪清寒错身换位，堵住她身侧的空当",
    next: "shadow",
    result: "你替纪清寒挡住侧后方的蛊虫。她没有道谢，只将剑锋向你身侧偏了几寸，与你共同撕开虫潮。",
    effect: { personality: { compassion: 1 } },
  },
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
    id: "shadow-compassion",
    label: "替纪清寒挡开赵黎的追问，再询问她所说的生门",
    next: "chamber",
    result: "你接过纪清寒的话，让赵黎暂时移开视线。纪清寒沉默片刻，低声补上关于生门的一句提醒。",
    effect: { personality: { compassion: 1 }, flag: "生门低语" },
  },
  {
    id: "shadow-insight",
    label: "不理会赵黎，转而追问苏莹为何认识墙上的血影",
    next: "chamber",
    result: "苏莹没有正面回答，但她脱口而出的“活符”已经暴露了太多。你记下这个称呼，也记下她望向墓门深处时的恐惧。",
    effect: { personality: { insight: 1 }, flag: "活符低语" },
  },
  {
    id: "shadow-scheme",
    label: "故意说血影只是旧禁残痕，观察乔无咎是否放松",
    next: "chamber",
    result: "你替血影给出一个轻描淡写的解释。众人尚未反应，乔无咎绷紧的肩背已经松了半分——这点变化足以证明他知道血影是什么。",
    effect: { personality: { scheme: 1 }, flag: "乔无咎知情" },
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
    label: "取走甲纹蛊卵，先为接下来的同行准备护身手段",
    next: "illusion",
    result: "你取走甲纹森森的蛊卵。血甲蛊与护体真元相合，足以在危急时替你挡下一次完整攻势。",
    effect: { personality: { compassion: 1 }, flag: "血甲蛊" },
  },
  {
    id: "chamber-insight",
    label: "让苏莹先挑，观察哪一枚蛊卵会回应她的血脉",
    next: "illusion",
    effect: { personality: { insight: 1 }, flags: ["活符低语"], randomFlags: ["血甲蛊", "血刃蛊"] },
  },
  {
    id: "chamber-scheme",
    label: "逼薛逢先触碰蛊卵，确认无禁制后夺下血甲蛊",
    next: "illusion",
    result: "薛逢提心吊胆地试过蛊卵，刚松一口气，你便越过他将血甲蛊收入囊中。他不敢争抢，只把这笔账藏进笑脸后面。",
    effect: { personality: { scheme: 1 }, flag: "血甲蛊" },
  },
];

export const illusionChoices: Choice[] = [
  {
    id: "illusion-power",
    label: "以蛊力正面震碎幻境，不给阵法继续窥探识海",
    next: "puppets",
    result: "你强行催动蛊力，任经脉震痛也要将幻境正面撕开。虚假的人影尽数破碎，只剩阵眼在远处闪烁。",
    effect: { personality: { power: 1 } },
  },
  {
    id: "illusion-compassion",
    label: "先扶住仍困在幻境中的纪清寒，替她稳住气血",
    next: "puppets",
    result: "你没有追击阵眼，而是先替纪清寒稳住紊乱气血。她从幻境中醒来时，握剑的手仍在轻微发抖。",
    effect: { personality: { compassion: 1 } },
  },
  {
    id: "illusion-insight",
    label: "压住心神，记下幻境每次重复时出现的细微偏差",
    next: "puppets",
    result: "幻境重复到第三遍时，你终于找出不属于自身记忆的那道影子。顺着它回望，操阵者留下的活蛊线一闪而逝。",
    effect: { personality: { insight: 1 }, flag: "识破迷魂阵" },
  },
  {
    id: "illusion-scheme",
    label: "假装仍受幻境控制，静看薛逢和乔无咎各自露出破绽",
    next: "puppets",
    result: "你故意维持失神模样。薛逢第一时间摸向退路，乔无咎却看向阵眼深处；两个人显然都比自己声称的更熟悉此地。",
    effect: { personality: { scheme: 1 }, flag: "乔薛有旧" },
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
