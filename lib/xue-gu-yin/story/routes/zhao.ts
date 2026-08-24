import type { Scene, VisualNovelEvent } from "../../model.ts";

const zhaoTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "narration", text: "你迎着雾中最浓烈的血气跃下陷道。赵黎反手扣住你的手腕，借下坠之势踏碎两具追来的傀儡；落地之后，他没有松手，只像打量一件新得的蛊材般打量你。" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "别人逃命，你却往老夫这里追。小子，你想要的是活路，还是力量？", expression: "amused", position: "left" },
  { type: "narration", text: "你没有回答。赵黎从你的目光里得到了答案，松手转身，示意你跟上。你们的同行没有信任，只有两个都不肯把机缘让给旁人的蛊修。" },
];

const zhaoLessonEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "陷道尽头横着一片被抽干血气的枯骨。赵黎以血纹蛊牵起其中尚未消散的残血，当着你的面将其炼成一枚临时蛊印。手法邪异，却比寻常控血术精妙数倍。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "正道把力量分成善恶，是因为他们怕旁人比自己更强。蛊只认胜负，不认牌坊。", expression: "wary", position: "left" },
  { type: "narration", text: "枯骨旁还压着半卷冰寒蛊简，上面记着血属蛊虫遇极寒时的运转滞点。赵黎明明看见了，却故意把蛊简留在原处，像是在等你自己决定要不要拿。" },
];

const zhaoPriceEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "amused" },
  { type: "narration", text: "前路传来薛逢的求救声。石壁正在合拢，他伸出半只染血的手，许诺把乔家给他的所有好处都交出来。赵黎没有停步，你也只是记下机关闭合的规律，从另一侧穿了过去。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "很好。想拿五转蛊，便不能总想着救下每一个废物。", expression: "amused", position: "left" },
  { type: "narration", text: "这句赞许没有令你安心。赵黎看你的眼神，和看方才那片可供炼蛊的枯骨并无区别。你越接近他所认可的强者，也越接近必须与他分出生死的那一刻。" },
];

const zhaoThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "血色石门后的蛊息已经压得人气血翻涌。赵黎停在门前，第一次不再以“老夫”自居，只平静地与你约定：门开启之前共同破局，血魔蛊现世之后，各凭本事。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "若你死在别人手里，我会觉得可惜。若你死在我手里，那便正好。", expression: "wary", position: "left" },
  { type: "narration", text: "你收紧藏在袖中的冰寒蛊简，与他一同推开石门。所谓同行到此为止；门后的每一步，都会把你们推向同一只蛊，也推向彼此。" },
];

const zhaoBloodGateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "石门之后并非藏宝室，而是一座被血色阵纹填满的祭殿。乔无咎的声音从机关深处传来，承认五名蛊修从踏进墓门起便是唤蛊的血食。你与赵黎没有惊慌，只同时望向祭殿中央仍在跳动的蛊茧。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "看来老夫没有看错。真正值钱的东西，果然要拿命来换。", expression: "amused", position: "left" },
];

const zhaoBloodGuardEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "蛊茧前的血池轰然裂开，一具由旧日祭品缝成的血傀儡撑地而起。赵黎退到阵边，不肯替你出手；这是他对同行者最后一次衡量，也是你向五转蛊证明自己有资格靠近的第一战。" },
];

const zhaoAwakeningEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "zhao-li", position: "left", expression: "wary" },
  { type: "narration", text: "血傀儡倒下后，赵黎割开掌心，将早已备好的血瓶尽数倒入祭阵。蛊茧吸饱血气，外壳一寸寸剥落；所谓血魔蛊终于从漫长死寂中苏醒。" },
  { type: "dialogue", speaker: "zhao-li", displayName: "赵黎", text: "同路到此为止。你既然也想要它，便来取。", expression: "wary", position: "left" },
];

const zhaoDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "赵黎不再隐藏四转巅峰的修为。血线封住石门，反噬血幕映出你的每一次出手；你袖中的冰寒蛊简则将血气一层层冻住。这一战不为同伴或正邪，只为决定谁有资格成为血魔蛊的新主。" },
];

const zhaoClaimEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "赵黎的血线终于断裂。你从他掌中夺下血魔蛊，任由猩红蛊纹沿手臂爬向心口。力量涌入经脉的瞬间，你听见乔无咎在控制室里失态怒吼；他精心准备的五转蛊，竟认了另一个主人。" },
  { type: "effect", effect: "flash", tone: "danger" },
];

const zhaoQiaoDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.control-room", transition: "fade" },
  { type: "character", action: "show", character: "qiao-wujiu", position: "right", expression: "smug" },
  { type: "narration", text: "乔无咎打开所有暗门，亲自带着活蛊线与傀儡群杀入祭殿。他仍把你当作可回收的祭品，却没有料到血魔蛊每一次撕开他的防御，都会把夺来的气血补回你的身体。" },
  { type: "dialogue", speaker: "qiao-wujiu", displayName: "乔无咎", text: "那是乔家的蛊！你也配据为己有？", expression: "smug", position: "right" },
];

const zhaoFallEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "乔无咎的尸身迅速干瘪，血魔蛊却仍不肯停下。祭殿里每一滴尚有温度的血都在呼唤你，连曾与你并肩的人也逐渐变成可以补足修为的血食。你曾以为自己追逐的是不受任何人摆布的力量，如今力量反过来替你决定一切。" },
];

const zhaoEpilogueEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "天亮时，蛊墓里再无第二道呼吸。你踏着血水走出墓门，五转蛊威使荒原虫兽尽数伏地。没有人能再夺走你的机缘，也没有人能从你眼中找到昔日那个入墓之人。" },
  { type: "effect", effect: "darken", tone: "danger" },
];

export const zhaoActThreeScenes: Record<string, Scene> = {
  zhaoTrail: {
    id: "zhaoTrail", act: 3, node: 1, chapter: "第三幕 · 赵黎线 · 节点 1 / 4", title: "逐血而行",
    events: zhaoTrailEvents,
    choices: [{ id: "zhao-keep-up", label: "不问退路，跟上赵黎", next: "zhaoLesson", result: "你踏过碎裂傀儡，跟着赵黎走入更深的陷道。" }],
  },
  zhaoLesson: {
    id: "zhaoLesson", act: 3, node: 2, chapter: "第三幕 · 赵黎线 · 节点 2 / 4", title: "强者之法",
    events: zhaoLessonEvents,
    choices: [{ id: "zhao-take-scroll", label: "收起冰寒蛊简，把克制血蛊的法门记下", next: "zhaoPrice", result: "你收起蛊简。赵黎看见了，却只笑了一声。", effect: { flag: "冰寒蛊简" } }],
  },
  zhaoPrice: {
    id: "zhaoPrice", act: 3, node: 3, chapter: "第三幕 · 赵黎线 · 节点 3 / 4", title: "力量的价钱",
    events: zhaoPriceEvents,
    choices: [{ id: "zhao-leave-weak", label: "不为身后的求救停步", next: "zhaoThreshold", result: "求救声被合拢的石壁截断。你和赵黎都没有回头。" }],
  },
  zhaoThreshold: {
    id: "zhaoThreshold", act: 3, node: 4, chapter: "第三幕 · 赵黎线 · 节点 4 / 4", title: "同盟尽头",
    events: zhaoThresholdEvents,
    choices: [{ id: "zhao-open-gate", label: "与赵黎一同推开血色石门", next: "zhaoBloodGate", result: "石门洞开，血光将两个人的影子拉向同一座血池。" }],
  },
};

export const zhaoActFourScenes: Record<string, Scene> = {
  zhaoBloodGate: { id: "zhaoBloodGate", act: 4, node: 1, chapter: "第四幕 · 赵黎线 · 节点 1 / 6", title: "血祭真相", events: zhaoBloodGateEvents, choices: [{ id: "zhao-enter", label: "踏入祭殿", next: "zhaoBloodGuard", result: "你越过血纹，走向守在蛊茧前的血傀儡。" }] },
  zhaoBloodGuard: { id: "zhaoBloodGuard", act: 4, node: 2, chapter: "第四幕 · 赵黎线 · 节点 2 / 6", title: "资格之战", events: zhaoBloodGuardEvents, battle: { enemyName: "血傀儡", enemyHealth: 20, victoryNext: "zhaoAwakening", defeatNext: "ending", victoryFlag: "赵黎线血傀儡已毁", defeatFlag: "死于守门血傀儡", defeatEnding: "deathByBloodGuard" } },
  zhaoAwakening: { id: "zhaoAwakening", act: 4, node: 3, chapter: "第四幕 · 赵黎线 · 节点 3 / 6", title: "五转蛊醒", events: zhaoAwakeningEvents, choices: [{ id: "zhao-answer-duel", label: "按住冰寒蛊简，接受决斗", next: "zhaoDuel", result: "冰霜沿血纹蔓延，你与赵黎之间再无退路。" }] },
  zhaoDuel: { id: "zhaoDuel", act: 4, node: 4, chapter: "第四幕 · 赵黎线 · 节点 4 / 6", title: "血蛊相争", events: zhaoDuelEvents, battle: { enemyName: "赵黎", enemyHealth: 22, victoryNext: "zhaoClaim", defeatNext: "ending", victoryFlag: "赵黎已败", defeatFlag: "赵黎夺蛊", defeatEnding: "deathByZhao" } },
  zhaoClaim: { id: "zhaoClaim", act: 4, node: 5, chapter: "第四幕 · 赵黎线 · 节点 5 / 6", title: "血魔认主", events: zhaoClaimEvents, choices: [{ id: "zhao-take-gu", label: "炼化血魔蛊", next: "zhaoQiaoDuel", result: "血魔蛊钻入蛊窍，旧有攻蛊在血光中崩散。", effect: { flag: "血魔蛊" } }] },
  zhaoQiaoDuel: { id: "zhaoQiaoDuel", act: 4, node: 6, chapter: "第四幕 · 赵黎线 · 节点 6 / 6", title: "执棋者末路", events: zhaoQiaoDuelEvents, battle: { enemyName: "乔无咎", enemyHealth: 24, victoryNext: "zhaoFall", defeatNext: "ending", victoryFlag: "乔无咎已伏", defeatFlag: "死于乔无咎", defeatEnding: "deathByQiao" } },
};

export const zhaoActFiveScenes: Record<string, Scene> = {
  zhaoFall: { id: "zhaoFall", act: 5, node: 1, chapter: "第五幕 · 赵黎线 · 节点 1 / 2", title: "蛊食其主", events: zhaoFallEvents, choices: [{ id: "zhao-embrace", label: "不再压制血魔蛊", next: "zhaoEpilogue", result: "你放开最后一道心防，任由血浪席卷整座蛊墓。" }] },
  zhaoEpilogue: { id: "zhaoEpilogue", act: 5, node: 2, chapter: "第五幕 · 赵黎线 · 节点 2 / 2", title: "血月出墓", events: zhaoEpilogueEvents, choices: [{ id: "zhao-end", label: "走入血色天光", next: "ending", result: "从此世间多了一位血蛊魔君。", effect: { ending: "demon" } }] },
};

export const zhaoRouteScenes: Record<string, Scene> = { ...zhaoActThreeScenes, ...zhaoActFourScenes, ...zhaoActFiveScenes };
