import { resolveDominantPersonalities } from "../../personality.ts";
import type { Choice, GameState } from "../../model.ts";
import { actThreeRouteEntries } from "../routes/contract.ts";

export const gateChoices: Choice[] = [
  {
    id: "gate-power",
    label: "靠近赵黎半步，看清他如何收住血纹蛊",
    next: "rainMark",
    result: "赵黎指间的血纹蛊只显露了片刻威势，你却把真元流转的轨迹牢牢记下。五转遗藏尚未露面，眼前这名邪修的手段已经值得一观。",
    effect: { personality: { power: 1 } },
  },
  {
    id: "gate-insight",
    label: "按住发烫的旧玉，等墓门蛊纹再亮一次",
    next: "rainMark",
    result: "旧玉的热意与墓门蛊纹遥相呼应，苏莹的指尖也在同一刻停顿。你没有声张，只把两处异常一并记在心里。",
    effect: { personality: { insight: 1 }, flag: "旧玉发烫" },
  },
];

export const rainMarkChoices: Choice[] = [
  {
    id: "rain-compassion",
    label: "把温脉符递给纪清寒，让她先护住执剑的手",
    next: "bloodThreshold",
    result: "冷雨把纪清寒虎口的旧伤泡得发白。你递过温脉符，她本想推辞，石门深处却恰好涌来一阵阴风。她最后还是接了，只说：“入墓后还你。”",
    effect: { personality: { compassion: 1 }, flag: "纪清寒回护" },
  },
  {
    id: "rain-scheme",
    label: "借着扶薛逢站稳，把他引向乔无咎避开的落脚处",
    next: "bloodThreshold",
    result: "薛逢以为你只是随手扶了他一把。等他的鞋底压过蛊纹，乔无咎下意识回头，你也由此确认：他从一开始就知道哪些地方不能碰。",
    effect: { personality: { scheme: 1 }, flag: "识破棋局" },
  },
];

export const bloodThresholdChoices: Choice[] = [
  {
    id: "threshold-power",
    label: "催动本命蛊，正面撑住正在闭合的石门",
    next: "swarm",
    result: "你将真元尽数压入本命蛊，硬生生顶住万斤石门。门轴深处传来刺耳崩响，待最后一人掠过门槛，你才收力闪身入内。",
    effect: { personality: { power: 1 } },
  },
  {
    id: "threshold-compassion",
    label: "回身替纪清寒斩断缠住剑腕的活符",
    next: "swarm",
    result: "你折回纪清寒身侧，在活符锁紧前将它斩断。她随即抬剑替你架住落下的门闸，两人一前一后掠进甬道。",
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
    label: "替纪清寒试一试甲纹蛊卵是否藏有禁制",
    next: "illusion",
    result: "纪清寒正提剑戒备四壁的活血纹，你先一步按住甲纹蛊卵。卵壳裂开，血甲蛊顺势认主。她看了你一眼，低声道：“下次不必替我试险。”",
    effect: { personality: { compassion: 1 }, flag: "血甲蛊" },
  },
  {
    id: "chamber-insight",
    label: "让苏莹先选",
    next: "illusion",
    effect: { personality: { insight: 1 }, flags: ["活符低语"], randomFlags: ["血甲蛊", "血刃蛊"] },
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
    label: "假装仍受幻境控制，静看薛逢和乔无咎各自露出破绽",
    next: "stoneBridge",
    result: "你故意维持失神模样。薛逢第一时间摸向退路，乔无咎却看向阵眼深处；两个人显然都比自己声称的更熟悉此地。",
    effect: { personality: { scheme: 1 }, flag: "乔薛有旧" },
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
