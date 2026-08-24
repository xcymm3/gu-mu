import type { GameState, RouteId, VisualNovelEvent } from "../../model.ts";

const routeCast = {
  zhao: { id: "zhao-li", name: "赵黎", position: "left", expression: "wary" },
  ji: { id: "ji-qinghan", name: "纪清寒", position: "right", expression: "alert" },
  xue: { id: "xue-feng", name: "薛逢", position: "left", expression: "panicked" },
  su: { id: "su-ying", name: "苏莹", position: "right", expression: "wary" },
} as const;

function routeEvents(state: GameState, content: Record<RouteId, VisualNovelEvent[]>): VisualNovelEvent[] {
  return state.route
    ? content[state.route]
    : [{ type: "narration", text: "血色石门在你身后闭合，墓室里只剩蛊卵裂开的细响。" }];
}

function showRouteCharacter(route: RouteId): VisualNovelEvent {
  const actor = routeCast[route];
  return { type: "character", action: "show", character: actor.id, position: actor.position, expression: actor.expression };
}

export const bloodGuardEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "推开血色石门的刹那，一具通体猩红的傀儡堵在门后。它比甬道中的铜皮傀儡高出整整一倍，胸腹蛊核翻涌着浓稠血光。" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "赵黎只皱了皱眉，尚未抬手，血傀儡已经撞碎脚下石板，直扑你面门。" },
  { type: "effect", effect: "shake", tone: "danger" },
  { type: "sound", asset: "sfx.battle-danger" },
];

export function bloodRoomEvents(state: GameState): VisualNovelEvent[] {
  const events: VisualNovelEvent[] = [
    { type: "background", asset: "background.blood-chamber", transition: "fade" },
    { type: "narration", text: "石门彻底合拢。四壁血纹同时亮起，万千活蛊线汇向中央血池。池中蛊卵一寸寸裂开，五转血魔蛊的威压像潮水灌满石室。" },
    { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "四人的血，一个人的命，正好。", expression: "smug", position: "center" },
    { type: "narration", text: "乔无咎没有现身，声音却沿着活蛊线从每一面石壁同时传来。" },
  ];
  if (state.route) {
    events.push(showRouteCharacter(state.route));
    const routeMoment: Record<RouteId, VisualNovelEvent> = {
      zhao: { type: "narration", text: "赵黎站在你身侧，掌中血纹缓缓舒展，像一头终于等到猎物围成一圈的狼。" },
      ji: { type: "narration", text: "纪清寒以残剑拄地。血线已缠上她的手腕，正从经络中抽取气血，送向池中蛊卵。" },
      xue: { type: "narration", text: "薛逢目光在血池、石门与四壁活蛊线之间来回游移，显然已在盘算此刻向谁下跪最值钱。" },
      su: state.flags.includes("苏莹存活")
        ? { type: "narration", text: "苏莹站在你身侧，指尖那滴血仍嵌在石面暗纹里发亮，与黑石棺深处的某物遥相呼应。" }
        : { type: "narration", text: "门边只余苏莹留下的血字。血池每翻涌一次，那抹字迹便黯淡一分。" },
    };
    events.push(routeMoment[state.route]);
  }
  return events;
}

export function awakeningEvents(state: GameState): VisualNovelEvent[] {
  return [
    { type: "background", asset: "background.blood-chamber", transition: "fade" },
    ...routeEvents(state, {
      zhao: [
        showRouteCharacter("zhao"),
        { type: "narration", text: "赵黎终于出手，掌中血蛊越过翻涌血池，直取你的心脉。你等的正是这一刻：冰寒蛊简上的秘术封住周身血气，腰间旧玉同时亮起。" },
        { type: "effect", effect: "flash", tone: "neutral" },
        { type: "sound", asset: "sfx.scene-flash" },
        { type: "narration", text: "池中血魔蛊的影子凝滞了一瞬。赵黎脸上的笑意也随之一停。" },
      ],
      ji: [
        showRouteCharacter("ji"),
        { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "你选。", expression: "softened", position: "right" },
        { type: "narration", text: "她将冰蚕剑对准血池阵眼，愿以三息寒气替你炸开一线生机。你很清楚，这一剑落下，她与自己的蛊种都可能一同碎裂。" },
      ],
      xue: [
        showRouteCharacter("xue"),
        { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "乔家主！薛某依约，把人带到了！", expression: "panicked", position: "left" },
        { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "做得不错。祭品名册上，也有你。", expression: "smug", position: "right" },
        { type: "narration", text: "薛逢脸上的笑彻底僵住。与此同时，你藏在聚灵蛊中的逆向印记沿活蛊线疾驰，控制暗室的位置终于在识海中亮起。" },
      ],
      su: state.flags.includes("苏莹存活")
        ? [
            showRouteCharacter("su"),
            { type: "narration", text: "苏莹的血滴入暗纹。血池下方传来沉重摩擦声，一具黑石棺椁破水升起。棺盖自行移开，原本应当坐化百年的苏衍缓缓睁眼。" },
            { type: "character", action: "show", character: "su-yan", position: "center", expression: "awakened" },
            { type: "dialogue", speaker: "su-yan", displayName: "苏衍", text: "等了这么久，苏氏的血终于把门重新打开了。", expression: "awakened", position: "center" },
            { type: "narration", text: "乔无咎惊怒未尽，反向绷紧的活蛊线已缠上他的四肢，将他拖向血池。" },
          ]
        : [
            { type: "narration", text: "苏莹的尸身仍留在门边。你看着她未写完的血字，明白再等下去，祭阵会吞掉所有人。" },
            { type: "narration", text: "你割开手腕，让鲜血落入池中，决定用自己的命替换最后一份祭品。" },
          ],
    }),
  ];
}

export function finaleEvents(state: GameState): VisualNovelEvent[] {
  return [
    { type: "background", asset: "background.blood-chamber", transition: "fade" },
    ...routeEvents(state, {
      zhao: [
        showRouteCharacter("zhao"),
        { type: "narration", text: "冰寒秘术与旧玉血光同时压住血魔蛊。赵黎第一次露出讶色，随后仰头大笑。" },
        { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "好。你终于有资格做老夫的对手。", expression: "amused", position: "left" },
        { type: "narration", text: "只有在这里击败他，你才有机会夺得血魔蛊。" },
      ],
      ji: [
        showRouteCharacter("ji"),
        { type: "narration", text: "纪清寒已将冰蚕剑钉进阵眼。寒气沿血纹蔓延，将醒未醒的蛊卵发出刺耳裂响。" },
        { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "带我离开。不要带走这只蛊。", expression: "softened", position: "right" },
        { type: "narration", text: "若你引爆自己的蛊种，血魔蛊会在此刻化灰；代价是你们二人的修为尽废。" },
      ],
      xue: [
        showRouteCharacter("xue"),
        { type: "narration", text: "逆向活蛊线已经指向控制暗室。乔无咎操控中断的一瞬，就是夺蛊的唯一机会。" },
        { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "道友，薛某也是一时糊涂！留我一命，我替你记乔家所有的账！", expression: "panicked", position: "left" },
        { type: "narration", text: "你可以让他活着记账，也可以把他交回血祭。" },
      ],
      su: state.flags.includes("苏莹存活")
        ? [
            { type: "character", action: "show", character: "su-yan", position: "center", expression: "awakened" },
            { type: "narration", text: "苏衍自黑石棺中完全复苏。五转威压压得血池翻涌；赵黎、纪清寒、薛逢与苏莹都还活着，这是唯一能让五人真正联手的时刻。" },
          ]
        : [
            { type: "narration", text: "你立在血池边缘，血水已漫过脚背。苏莹未能回来，但你仍能决定这只蛊醒来后，是吞人，还是被人驾驭。" },
          ],
    }),
  ];
}

export const masterBattleEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "su-yan", position: "center", expression: "awakened" },
  { type: "narration", text: "苏衍抬手，乔无咎立刻被反噬的活蛊线拖入血池。你以旧玉为引，血魔蛊却挣脱掌心，认祖归宗般飞回苏衍手中。" },
  { type: "dialogue", speaker: "su-yan", displayName: "苏衍", text: "此蛊本是我苏氏血脉所养。你凭什么让它认你？", expression: "awakened", position: "center" },
  { type: "narration", text: "赵黎最先出手；纪清寒以断剑重铸阵纹；苏莹用血脉干扰墓室；薛逢被你硬拽去堵住退路。五名各怀心思的入墓者，第一次真正站在同一边。" },
];

export const zhaoBattleEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "center", expression: "wary" },
  { type: "narration", text: "冰寒秘术封住周身血气，祖传旧玉随之放出血光。赵黎脸上的笑意终于收起，掌中血线与池中血魔蛊遥相呼应。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "来。让老夫看看，最后是谁握住这只蛊。", expression: "wary", position: "center" },
  { type: "narration", text: "这一战之后，墓里只会剩下一个能触碰血魔蛊的人。" },
];

export const qiaoBattleEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "center", expression: "smug" },
  { type: "narration", text: "乔无咎十指勾动，整座墓室的活蛊线同时绷紧。他明知血魔蛊已在你掌心，仍不急着近身，只借机关一步步将你逼向死局。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "替我养熟了蛊，便以为它真是你的了？", expression: "smug", position: "center" },
  { type: "narration", text: "你攥紧掌中那抹猩红。用，还是不用，已经没有第三条路。" },
];
