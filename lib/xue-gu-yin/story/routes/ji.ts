import type { Scene, VisualNovelEvent } from "../../model.ts";

const jiTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "narration", text: "断剑声从陷道下方传来。你跃入黑暗，在纪清寒被机关锁链拖走前抓住她的手。她借你的肩翻身斩断锁链，落地时却把你护在远离暗箭的一侧。" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "我没有求你下来。", expression: "alert", position: "right" },
  { type: "narration", text: "她说得冷，握住你手腕查看伤势的动作却很轻。你们都没有再提是谁救了谁，只背靠背等下一轮机关停歇。" },
];

const jiPromiseEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "短暂休整时，纪清寒取出一缕早已失去光泽的魂丝。她入墓不是为五转血蛊，而是想寻找能替至亲续命的蛊材；魂丝每暗一分，留给她的时间便少一日。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "若墓中只有害人的东西，我会毁掉它。空手回去，总好过带一场祸事回去。", expression: "softened", position: "right" },
  { type: "narration", text: "你替她重新包好裂开的虎口。她没有道谢，只把仅剩的半瓶疗伤散推到你这一边。" },
];

const jiBurdenEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "alert" },
  { type: "narration", text: "岔道中传来苏莹短促的呼声，另一侧却有成群傀儡逼近。纪清寒本可趁机直奔主墓室，却转身与你一同斩开机关门，把困在石缝后的苏莹拖出死地。" },
  { type: "narration", text: "救人耽误了时间，也让乔无咎布置的活蛊线追上来。纪清寒的残剑再添一道裂口；她仍站在最前面，仿佛自己的命从来不在需要权衡的那一边。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "既然伸了手，就别在半途松开。", expression: "softened", position: "right" },
];

const jiThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", position: "right", expression: "softened" },
  { type: "narration", text: "血色石门前，纪清寒将断剑抵在阵纹上。门后不只有她需要的续魂蛊材，还有一只足以让整座蛊市化作血食的五转邪蛊。" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "进去以后，我先救还能救的人。若再无可救之人，便与你一起毁掉那只蛊。", expression: "softened", position: "right" },
  { type: "narration", text: "你握住她满是裂纹的剑脊，与她共同推开石门。你选择的并不是最安全的路，而是一条必须为每次伸手负责到底的路。" },
];

export const jiActThreeScenes: Record<string, Scene> = {
  jiTrail: {
    id: "jiTrail", act: 3, node: 1, chapter: "第三幕 · 纪清寒线 · 节点 1 / 4", title: "断剑回声",
    events: jiTrailEvents,
    choices: [{ id: "ji-bind-wound", label: "坦然承认伤势，让她替你重新包扎", next: "jiPromise", result: "纪清寒替你压住伤口，动作比语气温和得多。", effect: { health: 4, maxHealth: 4 } }],
  },
  jiPromise: {
    id: "jiPromise", act: 3, node: 2, chapter: "第三幕 · 纪清寒线 · 节点 2 / 4", title: "未尽之约",
    events: jiPromiseEvents,
    choices: [{ id: "ji-share-medicine", label: "收下半瓶药，与她继续寻找生路", next: "jiBurden", result: "你收下疗伤散，也记住了她不肯舍弃的那缕魂丝。" }],
  },
  jiBurden: {
    id: "jiBurden", act: 3, node: 3, chapter: "第三幕 · 纪清寒线 · 节点 3 / 4", title: "不可松手",
    events: jiBurdenEvents,
    choices: [{ id: "ji-save-su", label: "与纪清寒一同把苏莹带离岔道", next: "jiThreshold", result: "你们带着苏莹冲出合拢的机关门，没有把任何一个活人留在身后。" }],
  },
  jiThreshold: {
    id: "jiThreshold", act: 3, node: 4, chapter: "第三幕 · 纪清寒线 · 节点 4 / 4", title: "共赴血门",
    events: jiThresholdEvents,
    choices: [{ id: "ji-open-gate", label: "握住断剑，与她共同破门", next: "bloodGuard", result: "寒光切开血纹，血色石门在你们面前缓缓开启。" }],
  },
};

