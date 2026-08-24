import type { Scene, VisualNovelEvent } from "../../model.ts";

const suTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "narration", text: "你没有追逐人声，而是沿着雾中一闪即逝的血色古文落入侧道。苏莹正跪在断裂阵盘前，以指尖描摹那些旁人看不懂的字符。" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "你不该跟来的。看懂得越多，乔无咎越不会让你活着出去。", expression: "wary", position: "right" },
  { type: "narration", text: "她嘴上驱赶，身体却悄然让开半步，使你得以看清阵盘中央的苏氏旧印。你终于确定，她不是偶然识得墓中文字。" },
];

const suInscriptionEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "sad" },
  { type: "narration", text: "苏莹承认师父留下过半张墓图，图上反复写着“蛊不可祭，蛊只可承”。乔家声称墓主早已坐化，阵纹却仍在以活人的血维持运转。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "墓主苏衍或许根本没有死。乔无咎带我们进来，不是开门，是替他凑齐唤醒血蛊的祭品。", expression: "sad", position: "right" },
  { type: "narration", text: "你按住腰间旧玉。玉中传出的微弱神识与苏氏旧印彼此呼应，证明这座墓等待的从来不只是乔家。" },
];

const suLineageEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "尽头石壁没有门，只有一道需要苏氏血脉与旧玉同时回应的活符。苏莹割破指尖时，四周机关立刻转向，显然乔无咎一直在等待她走到这里。" },
  { type: "narration", text: "你没有让她独自承受阵法。旧玉压入符眼，血光将两个人一并护住；追来的傀儡撞上光幕，像被墓中某个仍然清醒的意志拒之门外。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "若门后真是苏衍，你要先记住——血脉不是命令。我不会替他害人。", expression: "wary", position: "right" },
];

const suThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "sad" },
  { type: "narration", text: "活符解开后，血色石门露出一道缝隙。门后传来的心跳与苏莹的脉搏逐渐重合；她终于明白，自己既是乔无咎需要的钥匙，也是苏衍等待多年的后人。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "我会把门打开，也会亲眼看清祖上留下的究竟是传承，还是一场罪。", expression: "wary", position: "right" },
  { type: "narration", text: "你与她一同按下血钥。石门开启的瞬间，深处有人缓慢吸了一口气；沉睡多年的墓主，似乎已经知道你们来了。" },
];

export const suActThreeScenes: Record<string, Scene> = {
  suTrail: {
    id: "suTrail", act: 3, node: 1, chapter: "第三幕 · 苏莹线 · 节点 1 / 4", title: "雾中古文",
    events: suTrailEvents,
    choices: [{ id: "su-read-signs", label: "不催促她，先把阵盘上的古文看完", next: "suInscription", result: "你记下完整的苏氏旧印，也等到苏莹愿意开口。" }],
  },
  suInscription: {
    id: "suInscription", act: 3, node: 2, chapter: "第三幕 · 苏莹线 · 节点 2 / 4", title: "未死之人",
    events: suInscriptionEvents,
    choices: [{ id: "su-answer-jade", label: "让旧玉回应苏氏旧印", next: "suLineage", result: "旧玉泛起血光，失落的活符在你们面前重新连成一线。", effect: { flags: ["旧玉发烫", "活符低语"] } }],
  },
  suLineage: {
    id: "suLineage", act: 3, node: 3, chapter: "第三幕 · 苏莹线 · 节点 3 / 4", title: "血脉之钥",
    events: suLineageEvents,
    choices: [{ id: "su-share-burden", label: "与她共同承受活符反噬", next: "suThreshold", result: "血光散去时，苏莹仍站在你身侧。你们已经成为彼此进入主墓室的另一半钥匙。", effect: { flags: ["苏莹存活", "苏氏血钥"] } }],
  },
  suThreshold: {
    id: "suThreshold", act: 3, node: 4, chapter: "第三幕 · 苏莹线 · 节点 4 / 4", title: "血门认主",
    events: suThresholdEvents,
    choices: [{ id: "su-open-gate", label: "与苏莹共同按下血钥", next: "bloodGuard", result: "血色石门向两侧退开，沉睡者的呼吸从黑暗深处传来。" }],
  },
};
