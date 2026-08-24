import type { GameState, RouteId, VisualNovelEvent } from "../../model.ts";

const routeCharacters = {
  zhao: { id: "zhao-li", name: "赵黎", position: "left", expression: "wary" },
  ji: { id: "ji-qinghan", name: "纪清寒", position: "right", expression: "alert" },
  xue: { id: "xue-feng", name: "薛逢", position: "left", expression: "smiling" },
  su: { id: "su-ying", name: "苏莹", position: "right", expression: "wary" },
} as const;

function routeOrFallback(
  state: GameState,
  content: Record<RouteId, VisualNovelEvent[]>,
): VisualNovelEvent[] {
  return state.route
    ? content[state.route]
    : [{ type: "narration", text: "墓道在身后轰然断裂。你尚未看清同行之人的面孔，只能循着血腥气继续向前。" }];
}

function showRouteCharacter(route: RouteId): VisualNovelEvent {
  const character = routeCharacters[route];
  return {
    type: "character",
    action: "show",
    character: character.id,
    position: character.position,
    expression: character.expression,
  };
}

export function routeTrialEvents(state: GameState): VisualNovelEvent[] {
  const events: VisualNovelEvent[] = [
    { type: "background", asset: "background.trap-passage", transition: "fade" },
    ...routeOrFallback(state, {
      zhao: [
        showRouteCharacter("zhao"),
        { type: "narration", text: "坠入陷道的傀儡群尚未合围，赵黎袖中的血光便已撕开一条路。断裂的机关肢体滚入深坑，他连脚步都未停。" },
        { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "跟得上便跟，跟不上便留在这里。老夫可没有背人的习惯。", expression: "amused", position: "left" },
        { type: "narration", text: "密室枯骨旁留着一卷蛊简，其中只剩一句尚能辨认：血魔蛊性烈属阳，遇极寒则蛊息凝滞。赵黎看过便随手丢开，仿佛毫不在意。" },
      ],
      ji: [
        showRouteCharacter("ji"),
        { type: "narration", text: "你与纪清寒在不足两人并肩的陷道中沉默推进。傀儡重拳自暗处砸来，她抢先横剑硬接，虎口顿时崩出血线；你随即引爆蛊种，将后方追兵埋进碎石。" },
        { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "你这种打法，活不过四十岁。", expression: "alert", position: "right" },
        { type: "narration", text: "她说得冷淡，残剑却始终挡在你与下一处机关之间。" },
      ],
      xue: [
        showRouteCharacter("xue"),
        { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "散修在外，最要紧的便是互相照应。出去以后，蛊晶矿你我平分，绝不让你吃亏。", expression: "smiling", position: "left" },
        { type: "narration", text: "他说得热络，垂在袖边的手却悄悄收起一截乔无咎遗落的活蛊线。线上残留着极淡的操控印记；薛逢以为你没有看见，笑容丝毫未变。" },
      ],
      su: [
        showRouteCharacter("su"),
        { type: "narration", text: "苏莹几乎没有正面战力。你背着她穿过傀儡群，她伏在你肩后，断断续续说起师父留下的半张墓图。" },
        { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "师父只留下八个字：蛊不可祭，蛊只可承。可他从未告诉我，该如何阻止这场血祭。", expression: "sad", position: "right" },
        { type: "narration", text: "她沉默片刻，将手指攥得发白。即便如此，她也没有提出离开。" },
      ],
    }),
  ];

  if (state.flags.includes("曾尾行乔无咎") && state.route) {
    const replies: Record<RouteId, VisualNovelEvent> = {
      zhao: { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "你看得倒清楚。", expression: "wary", position: "left" },
      ji: { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "这墓里，果然有人早来过了。", expression: "alert", position: "right" },
      xue: { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "这等没凭没据的话，可别乱说……", expression: "panicked", position: "left" },
      su: { type: "narration", text: "你把暗室与活蛊线的事说出。苏莹猛地抬头，嘴唇动了动，终究没有说出那个名字。" },
    };
    events.push({ type: "narration", text: "你将先前尾行乔无咎时见到的暗室与活蛊线，低声告知了同行之人。" }, replies[state.route]);
  }
  return events;
}

export function routeTruthEvents(state: GameState): VisualNovelEvent[] {
  return [
    { type: "background", asset: "background.trap-passage", transition: "fade" },
    ...routeOrFallback(state, {
      zhao: [
        showRouteCharacter("zhao"),
        { type: "narration", text: "岔道口横着苏莹的尸身，胸口没有刀剑伤，只被祭阵抽尽血气。赵黎从她身旁走过，连步子都没有慢上一分。再往前，你又捡到纪清寒的半截断剑。" },
        { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "又少一个分蛊的。", expression: "amused", position: "left" },
        { type: "narration", text: "机关蛊矢骤然如雨落下。赵黎以血蛊正面轰碎阵枢，从始至终没有对同伴动过一根手指，也没有为他们停留半步。" },
      ],
      ji: [
        showRouteCharacter("ji"),
        { type: "narration", text: "你与纪清寒每一步都在互相补位。她不再提迷魂阵，你也不问她想救的至亲。血色石门前，祭阵隔空抽走苏莹全身血气；她抓住你的旧玉，只来得及吐出半句话。" },
        { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "那块玉……是……", expression: "sad", position: "center" },
        { type: "narration", text: "手指无力垂落。纪清寒握住残剑，眼中第一次不再只有拒人千里的寒意。" },
      ],
      xue: [
        showRouteCharacter("xue"),
        { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "纪道友！苏道友！你们可在前面？", expression: "panicked", position: "left" },
        { type: "narration", text: "呼喊听似寻找失散的同伴，却更像在向暗处报出你的位置。下一瞬，蛊矢破风而来。你反手以蛊挡下，藏在石壁后的机关印记一闪即逝。" },
        { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "好险，好险……幸而道友反应快。", expression: "smiling", position: "left" },
        { type: "narration", text: "他满脸是汗，笑意却半分不减。你看着他的背影，第一次真正起了疑心。" },
      ],
      su: [
        showRouteCharacter("su"),
        { type: "narration", text: "苏莹在你背上断断续续说，师父找了一辈子墓主后人。她每说一句，望向你腰间旧玉的目光便笃定一分。" },
        { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "也许师父要找的人……一直都不是乔家。", expression: "wary", position: "right" },
        { type: "narration", text: "傀儡尖刺忽从阴影中贯出。旧玉、纪清寒提到的生门与苏莹辨出的活符，将在这一刻决定血光是否会先一步亮起。" },
      ],
    }),
  ];
}

export function routeCostEvents(state: GameState): VisualNovelEvent[] {
  return [
    { type: "background", asset: "background.fog-passage", transition: "fade" },
    ...routeOrFallback(state, {
      zhao: [
        showRouteCharacter("zhao"),
        { type: "narration", text: "血色石门已近在眼前。赵黎忽然停步，目光落在你藏起蛊简的位置。" },
        { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "方才那卷蛊简，你当真都记住了？", expression: "wary", position: "left" },
        { type: "narration", text: "他分明知道你没有全说，却没有逼问，只笑称进门后再谈。你明白，他不是放过你，而是在等最适合夺蛊的一刻。" },
      ],
      ji: [
        showRouteCharacter("ji"),
        { type: "narration", text: "纪清寒以残剑拄地，血线已沿腕骨向上游走。她看了一眼门后涌出的红光，声音仍旧平稳。" },
        { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "我入墓只为续魂蛊材，对五转血魔蛊没有兴趣。若它醒来，我会先斩阵眼。", expression: "softened", position: "right" },
        { type: "narration", text: "你没有答话，只伸手扶正她已经站不稳的肩。" },
      ],
      xue: [
        showRouteCharacter("xue"),
        { type: "dialogue", speaker: "xue-feng", displayName: "薛逢", text: "活蛊线确实能反追控制室。只是底牌嘛，总要留到最值钱的时候再打。", expression: "greedy", position: "left" },
        { type: "narration", text: "你没有拆穿他，只悄然以聚灵蛊留下逆向印记。若薛逢还想拿乔无咎的机关做买卖，这条线也会把你带到执棋者面前。" },
      ],
      su: state.flags.includes("苏莹存活")
        ? [
            showRouteCharacter("su"),
            { type: "narration", text: "旧玉的血光震碎傀儡，苏莹仍站在你身侧。她终于明白，师父寻找的人或许就是你。" },
            { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "门后还有一道更深的锁。若我的血能开它，至少这一趟没有白来。", expression: "wary", position: "right" },
            { type: "narration", text: "她割破指尖，将一滴血留在石门暗纹上。门后随即传来极轻的回应。" },
          ]
        : [
            { type: "narration", text: "苏莹在你怀中咽气前，用尽力气抓住你的手，把血蹭在你指尖。" },
            { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "我的血……能开门。你……是那个人。", expression: "sad", position: "right" },
            { type: "narration", text: "那双眼睛直到最后也没有合上，像还在等一个回答。你替她阖眼，指间那抹血却怎么都擦不掉。" },
          ],
    }),
  ];
}

export function bloodGateEvents(state: GameState): VisualNovelEvent[] {
  const events: VisualNovelEvent[] = [
    { type: "background", asset: "background.fog-passage", transition: "fade" },
    { type: "narration", text: "石门上的五道血纹依次亮起。其余人的生死，早已被崩裂墓道切碎在身后。门缝里吹出的风没有尘土味，只有新鲜血气。" },
  ];
  if (state.route) events.push(showRouteCharacter(state.route));
  events.push(
    { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "前面便是主墓室。各凭本事吧，诸位。", expression: "smug", position: "center" },
    { type: "narration", text: "乔无咎的声音自石壁深处传来，第一次不再掩饰。你握住发烫的旧玉，将血纹石门缓缓推开。" },
  );
  return events;
}

export const shadowQiaoEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "雾未散尽，你借着暗影远远缀在乔无咎身后。他避开所有生门，熟练得像在这座墓里走过千百遍。" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "calm" },
  { type: "narration", text: "乔无咎推开一道伪墙。墙后暗室嵌满活蛊线，无数猩红细线自石壁深处牵出，末端悬着一枚枚傀儡蛊核。" },
  { type: "narration", text: "你终于看清了半盘棋：墓道中的傀儡并非墓主遗留，而是乔无咎借这间暗室操纵的杀局。" },
];

export const shadowBargainEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "你从暗处现身。乔无咎不惊反笑，像早已等着一个能看懂棋盘的人。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "五转血魔蛊的祭引、半座蛊市的暗庄，再加一个活着出墓的名额。这份价钱，够不够买你一双眼？", expression: "smug", position: "right" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "入我的局，做暗室里的第二双眼睛；或者，死在这里。", expression: "calm", position: "right" },
];

export const shadowBetrayalEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "narration", text: "你成了乔无咎暗室里的第二双眼睛。依照他的授意，你以探路为名，将纪清寒引向一段未曾提醒的机关。蛊矢破空时，她本能地先护住你；剑断，血落。" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "sad" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "我知道你会这样选。", expression: "sad", position: "right" },
  { type: "narration", text: "祭阵将她吞没。乱局中，薛逢终于亮出暗线身份，主动站到你身旁；乔无咎却隔空捏碎了他的心脉。" },
  { type: "character", action: "hide", character: "su-ying" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "废物，本就该第一个死。", expression: "smug", position: "right" },
  { type: "character", action: "hide", character: "qiao-wujiu" },
  { type: "effect", effect: "darken", tone: "danger" },
  { type: "narration", text: "唯独赵黎不见踪影。他早已识破幻阵，独自夺蛊，化身血魔。你最终死在他手中；最后一眼，只看见他立在血池边，猩红双目越过尸骸向你望来。", mode: "center" },
];
