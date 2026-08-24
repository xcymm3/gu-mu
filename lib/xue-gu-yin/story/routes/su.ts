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

const suBloodGateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "血门认出苏氏血脉后自行开启。门内每一道阵纹都朝黑石棺椁汇聚，乔无咎布下的祭线反而只是附着其上的后来之物。苏莹没有走向五转蛊茧，而是带你沿祖传铭文寻找真正的墓主。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "先看清是谁在借谁的局。乔无咎或许从来不是这里唯一醒着的人。", expression: "wary", position: "right" },
];

const suBloodGuardEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "黑棺前的守墓血傀儡被血脉唤醒。它不受乔无咎的活蛊线控制，只遵从棺中人的命令。苏莹解读阵纹，为你指出通往棺椁的唯一道路；你必须先从傀儡身上打出一道缺口。" },
];

const suCoffinEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "sad" },
  { type: "narration", text: "血傀儡崩解后，黑棺露出被乔家凿过的痕迹。棺盖下并无尸体，只有连接血池深处的人形空腔。苏莹以旧血印复原铭文，终于读出苏衍留下的真实计划：他从未想把血魔蛊留给后人，而是要借后人的血重新成为完整五转蛊修。" },
];

const suMasterTruthEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "su-yan", position: "left", expression: "awakened" },
  { type: "narration", text: "血池中央浮起一具干枯身体。苏衍睁眼后先称苏莹为后人，又命她交出血脉与旧玉。苏莹站在你身侧没有跪下；她把血钥折断，亲手拒绝了延续数代的命令。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "血脉只让我看见你的罪，不会替你命令我。", expression: "wary", position: "right" },
];

const suMasterDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "苏衍吞下血池残魂，五转威压覆盖整座祭殿。苏莹以断裂血钥压住他与墓阵的联系，你则必须在她支撑不住之前击溃这位真正的墓主。不同的主角身份会带来不同胜算，游方蛊医的攻势不足以突破他的再生。" },
];

const suCollapseEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "苏衍死去的瞬间，祖阵失去主人，乔无咎的祭线也随之反噬。血魔蛊尚未完整孵化便在崩塌中碎裂。你从黑棺旁找到通往控制室的旧钥，与苏莹一同打开所有封死的生门。" },
];

const suAftermathEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.dawn-exit", transition: "fade" },
  { type: "narration", text: "纪清寒、赵黎与其余幸存者沿开启的生门汇合。赵黎看了一眼苏衍的残骸，难得没有争抢已经化灰的五转蛊；乔无咎则被倒卷的活蛊线拖入控制室，再也没能出来。" },
];

const suEpilogueEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.dawn-exit", transition: "fade" },
  { type: "narration", text: "五人越过将塌的墓门时，荒原正迎来第一线晨光。苏莹回头看了最后一眼埋葬祖先罪孽的废墟，将断裂血钥丢进泥水。她不再是谁的祭品或钥匙，只以自己的名字与你并肩走向蛊市。" },
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
    choices: [{ id: "su-open-gate", label: "与苏莹共同按下血钥", next: "suBloodGate", result: "血色石门向两侧退开，沉睡者的呼吸从黑暗深处传来。" }],
  },
};

export const suActFourScenes: Record<string, Scene> = {
  suBloodGate: { id: "suBloodGate", act: 4, node: 1, chapter: "第四幕 · 苏莹线 · 节点 1 / 6", title: "祖阵深处", events: suBloodGateEvents, choices: [{ id: "su-follow-inscription", label: "随苏莹追查祖阵", next: "suBloodGuard", result: "你们绕过五转蛊茧，走向守在黑棺前的血傀儡。" }] },
  suBloodGuard: { id: "suBloodGuard", act: 4, node: 2, chapter: "第四幕 · 苏莹线 · 节点 2 / 6", title: "守墓之物", events: suBloodGuardEvents, battle: { enemyName: "血傀儡", enemyHealth: 20, victoryNext: "suCoffin", defeatNext: "ending", victoryFlag: "苏莹线血傀儡已毁", defeatFlag: "死于守门血傀儡", defeatEnding: "deathByBloodGuard" } },
  suCoffin: { id: "suCoffin", act: 4, node: 3, chapter: "第四幕 · 苏莹线 · 节点 3 / 6", title: "空棺遗文", events: suCoffinEvents, choices: [{ id: "su-restore-text", label: "与苏莹复原棺上铭文", next: "suMasterTruth", result: "被刮去的古字重新亮起，墓主未死的真相随之浮现。" }] },
  suMasterTruth: { id: "suMasterTruth", act: 4, node: 4, chapter: "第四幕 · 苏莹线 · 节点 4 / 6", title: "血脉拒命", events: suMasterTruthEvents, choices: [{ id: "su-stand-together", label: "站到苏莹身侧，迎战苏衍", next: "suMasterDuel", result: "苏莹折断血钥，你替她接下墓主压来的第一道蛊威。" }] },
  suMasterDuel: { id: "suMasterDuel", act: 4, node: 5, chapter: "第四幕 · 苏莹线 · 节点 5 / 6", title: "五转墓主", events: suMasterDuelEvents, battle: { enemyName: "苏衍", enemyHealth: 28, victoryNext: "suCollapse", defeatNext: "ending", victoryFlag: "墓主已灭", defeatFlag: "墓主吞尽血食", defeatEnding: "deathByMaster" } },
  suCollapse: { id: "suCollapse", act: 4, node: 6, chapter: "第四幕 · 苏莹线 · 节点 6 / 6", title: "祖阵崩塌", events: suCollapseEvents, choices: [{ id: "su-open-exits", label: "用旧钥开启全部生门", next: "suAftermath", result: "封闭多年的生门逐一开启，幸存者的呼喊从甬道深处传来。" }] },
};

export const suActFiveScenes: Record<string, Scene> = {
  suAftermath: { id: "suAftermath", act: 5, node: 1, chapter: "第五幕 · 苏莹线 · 节点 1 / 2", title: "五人重聚", events: suAftermathEvents, choices: [{ id: "su-lead-out", label: "带所有人离开崩塌的蛊墓", next: "suEpilogue", result: "旧钥指出最后一条生路，五道身影在落石间重新聚齐。" }] },
  suEpilogue: { id: "suEpilogue", act: 5, node: 2, chapter: "第五幕 · 苏莹线 · 节点 2 / 2", title: "血脉归位", events: suEpilogueEvents, choices: [{ id: "su-end", label: "与苏莹走向晨光", next: "ending", result: "血脉不再是命令，五名入墓者全部生还。", effect: { ending: "true" } }] },
};

export const suRouteScenes: Record<string, Scene> = { ...suActThreeScenes, ...suActFourScenes, ...suActFiveScenes };
