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
    choices: [{ id: "zhao-open-gate", label: "与赵黎一同推开血色石门", next: "bloodGuard", result: "石门洞开，血光将两个人的影子拉向同一座血池。" }],
  },
};
