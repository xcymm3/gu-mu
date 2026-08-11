"use client";

import { useEffect, useRef, useState } from "react";

import { GuTombMark } from "@/components/GuTombMark";
import {
  applyChoice,
  canChoose,
  chooseRole,
  endings,
  getEnemyCondition,
  getRole,
  initialGame,
  resolveBattleTurn,
  resolveEnding,
  roles,
  scenePageNotes,
  scenes,
  startBattle,
  type Choice,
  type GameState,
  type GuAction,
  type RoleId,
} from "@/lib/gu-tomb/game";
import { chooseInk, createInkStory, readInkKnot, readInkPage, type InkPage } from "@/lib/gu-tomb/ink";
import type { Story } from "inkjs";

const baseGuActions: { id: GuAction; name: string; description: string }[] = [
  { id: "blood", name: "血刃蛊", description: "以血煞凝作锋刃，直取近处敌手。消耗 1 真元。" },
];
const inkSceneIds = new Set(["entrance", "bloodDoor", "corpseFight", "well", "shell", "bloodTrap", "bloodHall"]);
const names = new Set(["宁素衣", "陆照野", "顾微尘", "乔无咎", "沈青萝", "赵黎", "贾贵", "沈砚"]);
const criticalTerms = new Set(["血流蛊", "五转", "血祭", "血针", "尸灯傀儡", "命丧蛊墓"]);
const endingStorageKey = "gu-tomb-unlocked-endings";
const motionStorageKey = "gu-tomb-reduce-motion";
const themeStorageKey = "gu-tomb-theme";
const saveStorageKey = "gu-tomb-save-slots-v1";
const saveSlotCount = 6;
const endingRoleAccess: Record<RoleId, string[]> = {
  healer: ["trapped", "bloodflow", "wu", "true", "together", "death", "alone"],
  swordsman: ["trapped", "bloodflow", "cleansed", "wu", "true", "together", "death", "alone"],
  heir: ["trapped", "bloodflow", "traitor", "wu", "true", "together", "death", "alone"],
};
type HomeView = "menu" | "roles" | "archive" | "saves" | "settings";
type ThemePreference = "system" | "light" | "dark";
type BattleFeedback = { result: string; nextCue?: string; enemyCondition: string; hasEnded: boolean; emphasis?: "danger" | "success" };
type SaveSlot = { version: 1; savedAt: string; game: GameState; narrative: { sceneId: string; page: number }; inkPage?: InkPage; inkState?: string };
type SaveSlots = Array<SaveSlot | null>;

function emptySaveSlots(): SaveSlots { return Array.from({ length: saveSlotCount }, () => null); }

function isSaveSlot(value: unknown): value is SaveSlot {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SaveSlot>;
  return candidate.version === 1 && typeof candidate.savedAt === "string" && Boolean(candidate.game && typeof candidate.game === "object") && Boolean(candidate.narrative && typeof candidate.narrative === "object");
}

function readSaveSlots(): SaveSlots {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(saveStorageKey) ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return emptySaveSlots();
    return Array.from({ length: saveSlotCount }, (_, index) => isSaveSlot(parsed[index]) ? parsed[index] : null);
  } catch { return emptySaveSlots(); }
}

function saveSlotLabel(slot: SaveSlot) {
  const role = getRole(slot.game.roleId);
  const scene = scenes[slot.game.sceneId];
  return { role: role?.name ?? "无名修士", scene: scene ? `${scene.chapter} · ${scene.title}` : "墓道深处" };
}

function formatSaveTime(savedAt: string) {
  const time = new Date(savedAt);
  return Number.isNaN(time.valueOf()) ? "时间不明" : time.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function splitParagraphs(text: string) {
  const blocks = text.split(/\n{2,}/).flatMap((block) => {
    const sentences = block.trim().match(/[^。！？；]+[。！？；]?/g) ?? [block.trim()];
    const parts: string[] = [];
    let current = "";
    for (const sentence of sentences) {
      if (current.length >= 110 && current.length + sentence.length > 170) {
        parts.push(current);
        current = sentence;
      } else current += sentence;
    }
    if (current) parts.push(current);
    return parts;
  });
  return blocks.filter(Boolean);
}

function splitForViewport(text: string, readingBox: { width: number; height: number }) {
  const charactersPerLine = Math.max(14, Math.floor(readingBox.width / 16));
  const limit = Math.max(80, Math.floor(readingBox.height / 30) * charactersPerLine * 0.9);
  const sentences = text.match(/[^。！？；]+[。！？；]?/g) ?? [text];
  const pages: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    if (current.length >= Math.floor(limit * 0.62) && current.length + sentence.length > limit) {
      pages.push(current);
      current = sentence;
    } else current += sentence;
  }
  if (current) pages.push(current);
  return pages;
}

function NarrativePage({ text }: { text: string }) {
  return <>{splitParagraphs(text).map((paragraph, paragraphIndex) => {
    const pieces = paragraph.split(/(宁素衣|陆照野|顾微尘|乔无咎|沈青萝|赵黎|贾贵|沈砚|血流蛊|五转|血祭|血针|尸灯傀儡|命丧蛊墓)/g);
    return <p key={paragraphIndex}>{pieces.map((piece, pieceIndex) => names.has(piece) ? <strong className="story-name" key={pieceIndex}>{piece}</strong> : criticalTerms.has(piece) ? <span className="story-critical" key={pieceIndex}>{piece}</span> : piece)}</p>;
  })}</>;
}

const shenCareBaseText = `尸灯傀儡倒下后，墓道里那层黏腻的嗡鸣终于散了。残破的乔家衣袍堆在墙角，领口绣着的暗纹被血浸透，看不出原本的色泽。灯盏翻倒，最后一缕青烟贴着石壁飘上去，在穹顶处散成灰白的丝。你站在原地，耳中还有细微的嗡声残响，像有什么东西在颅骨深处轻轻叩击。

赵黎先动了。他弯腰拾起半截傀儡手臂，指腹在断口处捻了捻，又放下，脸上那点从容淡了些，语气却还是慢的：“机关做得不算精，但用料狠。”他抬眼扫过四周，目光在几处石缝间停住，“这墓里的东西，比乔家说的要老。”

贾贵已经退到墓道口，胖手按着石壁上一道裂纹，回头时脸上还挂着笑，声音却压得低：“老不老的不打紧，退路倒是得先认准。方才那灯亮得邪性，我怕再往前，连来路都认不得。”他说着，又往黑暗中探了探头，喉咙里滚出一声含糊的咕哝。

沈青萝没有接话。她蹲在傀儡残骸边，指尖拂过它胸口嵌着的一枚锈钉，又凑近闻了闻，眉头微蹙。藤蛊从她袖口垂下一截青蔓，在触及地面时轻轻蜷起，像是嗅到了什么不喜的气味。她站起身，目光落在你身上，没有说话，却多看了你一眼。

墓道重新安静下来。那种安静与方才的厮杀不同，更沉，更闷，像整座墓穴都在屏息。远处隐约有滴水声，一滴，又一滴，间隔极长，落在某处石洼里，荡出空空的回响。你低头，看见自己衣摆上溅了几点暗色，不知是傀儡的尸液还是旁的什么。

赵黎忽然开口，声音不大，却让贾贵停了动作：“乔无咎说上次探墓队无功而返，可这傀儡的衣袍，分明是乔家制式。”他顿了顿，像在自言自语，“无功而返，却连自家袍子都留在了这里？”

贾贵干笑一声：“兴许是丢下的。”

“丢下的？”赵黎看他一眼，没再追问，只把视线移向墓道深处。那里黑得不见底，偶尔有风从深处漏出来，带着铁锈与药灰混在一起的味道，还有一丝若有若无的腥甜。

沈青萝终于开口，声音清冷，像在说一件与己无关的事：“这傀儡体内有活物气息，虽已死透，但残留的蛊痕不像是墓中自生。”她顿了顿，目光落在你身上，“像是被人喂过血。”

贾贵脸上的笑僵了一瞬，旋即又堆起来：“沈姑娘说笑了，傀儡哪来的血？”

“正是没有，才更奇怪。”沈青萝不再看他，却朝你走近了一步。她袖中的藤蛊缓缓探出，在离你半步远的地方停住，细须轻轻摆动，像在嗅你身上的气息。她的目光落在你肩头一处渗血的伤口上，眉间微不可察地蹙了一下。

“你伤得不轻。”她说，语气平静，却多了一丝不易察觉的迟疑。她伸手探入怀中，指尖触到一只瓷瓶的边缘，却没有立刻取出。墓道里的风又吹过一阵，那腥甜的气息似乎浓了一分。赵黎和贾贵都静了下来，目光若有若无地落在这边。

沈青萝握着瓷瓶的手停在那里，像在等什么，又像在掂量什么。墓道深处，滴水声又响了一下，比先前更近了些。`;

const shenCareFragText: Record<RoleId, string> = {
  healer: `沈青萝的目光从你袖口扫过，又落回你脸上。她没问伤势如何，只从怀中摸出一只青瓷小瓶，指腹在瓶口摩挲了半圈，才递到你面前。

“荒原上女修受伤，比男修更怕拖。”她声音不高，像在说一件寻常事，“这瓶青元丹，能缓蛊毒侵脉，也能止气血浮散。”

你接过瓶子，没有立刻打开。先凑近瓶口，一股清苦药气漫出来，带着微涩的草木味；你拧开瓶塞，倒出一粒在掌心，用指尖碾碎半颗，细看碎末颜色，又嗅了嗅。药粉灰白中带一层极淡的碧色，是青元草与地髓根研磨的成色，年份不浅，没有掺假。

沈青萝见你验药，没有催促，只将剑穗在指间绕了一圈，又松开。她目光移向墓道深处，声音低了些：“我师弟沈砚，上次入墓前也带过一瓶青元丹。他说，墓里阴气重，伤药要备足。”

你听出她话里的试探。她递药，也在递话。你握住瓷瓶，指尖微凉，药气还留在掌心。她没有问你是否信任她，你也没有说谢。

沈青萝收回手，垂下眼，语气平静得像是怕惊动什么：“你若信得过，便服下。若信不过——”她顿了一下，“药留着，防身也好。”

她不再看你，只等你的回应。`,
  swordsman: `尸灯熄灭后，墓道陷入短暂的暗。你按剑而立，剑鞘上未干的黏液缓缓滴落，在石板上敲出极轻的响。赵黎在几步外重新打量你，目光从你肩头滑到脚下，再落回你脸上，像在称量一柄剑的成色。他捻了捻指腹，忽然笑了：“陆道友这手，倒不像散修的路数。”

贾贵从墙角挪出来，胖脸上笑意未收，却比先前多了一层谨慎。他摸了摸储物囊，干笑道：“早说陆兄深藏不露，是我眼拙了。”你未答话，只将剑横在膝前，指腹抹过刃上血痕。沈青萝站在稍远处，藤蛊在她腕间缓缓收拢，她看了你片刻，目光从剑刃移到你左臂——那里衣袖裂开，渗出的血已浸透半截小臂。

她走近两步，停在恰当的距离，从袖中取出一只青瓷小瓶，递到你面前。瓶身温润，贴着木灵宗常用的药签。“止血的。”她声音清冷，却比方才少了几分疏离，“陆道友若信得过，便敷上。墓中还有路要走。”

你没有立刻接。她也不催，只将瓶口朝你转了转，露出一线药粉的淡香。贾贵在旁咳嗽一声，赵黎则背过身去，像在查看石壁上的刻痕。墓道深处传来滴水声，一下，又一下，像在等一个答复。`,
  heir: `你靠在墓壁湿冷的石面上，右臂的伤口渗出的血已凝成暗色。沈青萝蹲下身，指尖停在你袖口三寸处，没有碰你。

“药呢？”她问，声音清冷。

你从储物囊里取出乔家备的止血散，瓶身刻着乔氏旧印。你拧开瓶塞，药粉气味寡淡，远不如木灵宗的丹丸。你笑了笑，将瓶子递过去：“乔家给的东西，沈姑娘若看不上，便不必费心。”

沈青萝没接，只看着你伤口边缘泛起的灰白色。她眉头微蹙，从袖中取出一只青玉小瓶，瓶口缠着细藤。“木灵宗的地髓丹，止血生肌。你若信得过，便服下。”

你认得那瓶身的纹路，是沈砚的手笔。你抬眼望向她，她神色平静，眼底却压着一丝急切。“沈姑娘的师弟，上次也是带着这种丹入墓的？”

沈青萝指尖收紧，瓶身发出极轻的响动。她没有答话，只将药瓶又往前递了递。墓道深处传来水滴声，一滴，两滴，像是有人在暗处数着时辰。`,
};

function shenCareText(game: GameState, role: NonNullable<ReturnType<typeof getRole>>) {
  const frag = role.id === "swordsman" && game.flags.includes("尸傀已灭") ? "" : shenCareFragText[role.id];
  return frag ? `${shenCareBaseText}\n\n${frag}` : shenCareBaseText;
}

function climaxText(sceneId: string, game: GameState) {
  if (sceneId === "lastGate") {
    if (game.flags.includes("赵黎已放逐")) return "伏尸暗格的界裂阵筹已经裂开，赵黎连同那股阴冷血气被卷入其中，连一声咒骂也未留下。乔无咎望着塌陷的侧洞，脸上的从容终于消失；他原想借邪修之手收尾，如今却只能亲自踏下祭台。\n\n血槽里的血气仍向石室中央汇去。没有赵黎的血瓶与秘法，沉睡的血流蛊迟迟不能真正苏醒。乔无咎抬手放出本命蛊，冷声说只要杀了你，乔家的血脉仍足够完成最后一步。此战之后，便只剩他与你。";
    const shenText = game.trust.shen >= 2
      ? "血卫的刀锋落下时，你替沈青萝挡住了机关最狠的一击。她没有退，青藤蛊反而缠上你的手腕，一缕温润生机灌入经脉。她与你并肩而立，你的命息也因此比先前更盛。"
      : "血卫的刀锋落下时，乔无咎暗藏的机关先一步发动。一枚细若发丝的血针穿过青藤蛊的缝隙，钉入沈青萝心口。她脸上的薄纱被劲风掀起半角，灯火映出一张本该冷艳如霜的面容；那双始终克制的眼睛却只在你身上停了一瞬，仿佛想说什么。\n\n青藤失去主人后仍徒劳地向前攀去，替她拦下第二道血光。她的身影在碎石与血火间缓缓倒下，袖中半枚沈砚玉牌滑落在地，发出极轻的一声脆响；随后，所有藤叶都被血焰吞没。";
    return `祭阵在墓道尽头豁然洞开，石壁上凿出的凹槽纵横交错，汇向正中一方半人高的祭台。台面刻满细密纹路，纹路间残留着暗褐的旧痂。四壁的尸油灯不知何时自行亮起，火苗青白。贾贵走在最前，胖脸上仍挂着笑。他蹲下身，用指尖蹭了蹭祭台边缘，回头道：“乔道友，这阵纹可不像新刻的，你家上次的人当真没走到这儿？”话未说完，他脚下石板忽然一陷，一道血线自地缝中弹出，无声无息地穿过他胸口。贾贵低头看了一眼，笑意僵在脸上，整个人向后栽倒，后脑磕在石地上，发出一声闷响。他袖口处似有什么东西被压住，指尖蜷了蜷，血迹却只在身下洇开一小片，不再扩散。${shenText}\n\n乔无咎从众人身后缓步走出，袍角擦过石地，声音不高不低：“贾道友走得太急，这祭阵认生血。”他抬手向祭台方向一引，石壁后传来沉重的甲叶摩擦声。一名血卫从祭台阴影中直起身来，甲胄与皮肉早已长在一起，缝隙间渗出暗红黏液，头盔下只露出一双浑浊的眼。它迈出一步，整座石室的灯焰齐齐一矮，仿佛被什么压住。\n\n祭台血槽忽然灌满红光，红光顺着凹槽爬满地面，石壁嗡鸣，空气沉得像浸了水，连抬臂都费劲。乔无咎站在祭台阴影里，声音平静得近乎柔和：“诸位，血卫既已起身，便不会空手而归。”血卫踏下祭台，每一步都让地面震颤，甲叶间渗出的黏液滴落石地，发出细微的“嗤嗤”声。它胸腹处沉闷鼓动，像有什么东西在甲壳下翻涌，双臂垂落，指尖的甲刃泛着锈色，对准你的方向。`;
  }
  if (sceneId === "bloodRage") {
    const guardText = game.flags.includes("血卫独破") ? "你竟在血卫倒下前站稳了脚跟，连赵黎也微微眯起眼，像第一次真正看清你的底细。" : "你被血卫逼得跪倒在地，血从指缝间落进祭槽，连呼吸都像在替阵法续火。";
    const shenText = game.flags.includes("青萝并肩") ? "沈青萝将最后一枚灵丹弹入你口中，替你压住几近断裂的气血。" : "石阶上只余散落的藤叶，再无人替你挡住血气。";
    const jiaText = game.flags.includes("贾贵援手") ? "忽然，原本气绝的贾贵从碎甲下翻身而起；装死蛊脱壳成灰，他趁赵黎结印时一记黑刀刺入其肩背。" : "石壁边的贾贵仍一动不动，像是真的死在第一击下。";
    const zhaoText = game.flags.includes("赵黎犹疑") ? "赵黎看向你的目光有一瞬迟疑，手中血瓶并未立刻倾下。" : "赵黎根本没有看任何人，只把一只血瓶咬开，暗红液体尽数浇在玉匣上。";
    return `${guardText}\n\n赵黎站在血卫残骸前，低头看着自己沾满黑血的手，忽然笑了。他笑声不大，却刺得墓室四壁嗡嗡回响。乔无咎在远处石板道上喝道：“赵道友，此墓凶险，莫要擅动！”赵黎恍若未闻，大步走向石台中央的玉匣。他指尖一翻，不知何时多了一只巴掌大的血琉璃瓶，瓶中暗红液体微微晃动，像是活的。他揭开封口，将瓶中血缓缓倾在玉匣之上。${shenText}${jiaText}${zhaoText}\n\n血落匣面，没有滑落，反而像活物一般渗入细缝。玉匣深处传来一声沉闷的搏动，像是心跳。墓室里的空气骤然变重，你闻到一股浓烈的铁锈味。你的伤口忽然剧烈地疼起来，像有什么东西在顺着血脉往回拽——你低头看，肩头渗出的血正沿着手臂逆流，几缕血丝悬在半空，朝玉匣方向飘去。\n\n红光越来越盛，玉匣彻底裂开。一股腥甜的血气涌出，像河水倒灌，漫过你的脚踝。你的心跳忽然和那搏动声同步，每一下都震得耳膜发麻。赵黎转过身，面对众人，红光映在他脸上，把他的笑容照得一片猩红。“接下来，谁的血，喂得饱它？”`;
  }
  if (sceneId === "zhaoDuel") return `赵黎指尖那枚血瓶的塞子被无声拔开。你闻到一股腥甜，像湿土下埋了三日的铁器被重新掘出。他掌前的血线不再只是盘绕，而是缓缓立起，化作一道薄薄的血幕，将他的身形映得模糊。血幕深处有暗流倒涌，像有什么东西在里头翻身。

“乔家主，”赵黎的声音依旧从容，甚至带着几分闲谈的意味，“你方才说，这蛊墓里的机关你只识得七分。可老夫方才瞧你按那块残碑的手法，倒像是练过百遍。”

乔无咎站在石阶上，衣摆沾了灰，神色却不见慌乱。他抬手理了理袖口，轻声道：“赵兄说笑了。乔家祖上与这墓有些渊源，多来过几趟罢了。”

赵黎低低笑了一声，那笑声在空旷的墓室里荡开，像石子落入深井。血幕忽然一颤，你看见幕上映出的人影不止一个——那影子的肩线比赵黎更宽，像是另一个人的轮廓正贴在他身后。

“渊源？”赵黎把血瓶举到眼前，瓶口朝下，一滴暗红的血珠悬在瓶沿，迟迟不落，“那乔家主可知道，这瓶里装的，是你乔家上次探墓队里那个姓沈的小子心头血？”

沈青萝握着剑柄的指节骤然泛白。她没说话，目光却钉在赵黎手上。

乔无咎的呼吸顿了一瞬。他垂下眼，声音还是温和的：“赵兄何必拿死人作伐。沈砚是木灵宗的人，乔家自会向沈姑娘交代。”

“交代？”赵黎嗤笑一声，血珠终于落下，融入他掌前的血幕。那幕布猛地一涨，腥气扑面而来，你脚下的石缝里渗出暗色的水迹，像是整座墓都在渗血，“乔无咎，你拿活人的命喂这蛊墓的锁，又拿老夫当开锁的钥匙。如今钥匙到手了，你还要装到几时？”

话音未落，赵黎袖中忽然滑出一枚漆黑的蛊虫，只有指节大小，通体泛着铁锈色的光。那蛊虫落在血幕上，像落入水中的石子，沉了下去。血幕深处立刻传来沉闷的鼓动声，一下，又一下，像是有什么东西在里头睁开了眼。

你感觉胸口发紧，像是有什么东西在隔着皮肉看你。赵黎的嘴角还带着笑，但他掌前的血气压得两侧的尸油灯焰齐齐弯折，灯影在壁上拉出长长的、扭曲的爪形。

“血流蛊，”赵黎的声音忽然低了下去，像在念一个旧人的名字，“老夫寻了你七十年。今日这墓里，活人也好，死人也好，都只是给你垫脚的土。”

血幕猛地暴涨，将赵黎整个人裹了进去。你只看见幕上那道人影忽然转过头，朝你的方向看了一眼——那目光隔着血光，却像冰水顺着脊背淌下来。

沈青萝忽然低声道：“他在催蛊。血幕里的暗流在倒卷，小心他反手——”

话没说完，赵黎的身影已经从血幕中踏出。他脸上还带着那副从容的笑，但左手的袖口已经湿透了，一滴一滴往下淌着暗红。他掌中托着那枚黑色的蛊虫，蛊虫背上裂开一道细缝，缝里渗出的光像将熄的炭火，忽明忽暗。

“乔家主，”赵黎偏过头，声音还是不急不缓的，“你猜，这蛊吸了老夫七十年的血，如今还认不认得旧主？”

乔无咎没有答话。他退后半步，靴跟磕在石阶边缘，发出一声极轻的响。

而你站在血幕边缘，能感觉到那蛊虫的目光正一寸一寸扫过你的手、你的肩、你的脸。赵黎的指尖微微一动，像是要抬手，却又停住了。他看了你一眼，眼底有什么东西闪了一下，像是迟疑，又像是别的什么。

“道友，”他忽然开口，声音比方才低了些，“你方才递我那块药饼，老夫记着。但记着归记着，今日这墓里，谁也走不脱。”

血幕深处，那道人影的轮廓忽然清晰了一瞬——你看见一张陌生的、没有五官的脸，正贴着幕布，缓缓朝你的方向压来。

腥气更重了。你手里的剑柄冰凉，掌心却全是汗。

赵黎掌中那枚蛊虫背上的裂缝骤然扩大，一道血光从中射出，直直没入他脚下的石缝。整座墓室忽然安静下来——连灯焰的噼啪声都消失了。你听见自己的心跳，一下，又一下，像在替什么人倒计时。

血幕忽然从中间裂开一道缝。缝里没有光，只有一片浓稠的、流动的暗红。那暗红像活物一样蠕动，缓缓朝你伸来——

你没有再退。

身后是乔无咎的脚步声，正一步一步往墓室深处退去。前方是赵黎掌中那枚裂开的蛊虫，和血幕里那张没有五官的脸。你手里的剑尖微微抬起，却不知道该对着谁。

赵黎忽然笑了一声。那笑声很短，像是从喉咙里挤出来的。他掌中的蛊虫猛地一缩，血幕随之塌陷，化作无数细小的血珠，悬在他身周，像一层薄薄的雾。

“也罢，”他说，“老夫今日便看看，这蛊墓里到底埋着谁的血。”

血雾轰然炸开。

你眼前只剩一片暗红。`;
  if (sceneId === "zhaoDeath") return game.flags.includes("乔无咎杀死你")
    ? "乔无咎的蛊刃穿过护体真元。你倒下时，血流蛊在未醒的玉匣中发出极轻的嘶鸣，随后被乔家血火重新吞没。墓门合拢，荒原再无人知道你曾到过这里。"
    : "赵黎的血线绕开护体蛊虫，先刺穿了最虚弱的经脉。他接住震颤的玉匣，笑道：“老夫原想留你一命，可血流蛊不喜欢旁人替它做主。”五转蛊初醒的第一口，吞掉了墓中最后的生机。";
  if (sceneId === "qiaoDuel") return game.flags.includes("赵黎遁走")
    ? "赵黎借血流蛊反噬遁入墓道深处，乔无咎却堵在出口之前。血流蛊已落入你手，他终于不再伪装家主的从容，亲自放出本命蛊。此人已无退路，你也没有。"
    : `赵黎倒地时，手中那枚血玉碎成齑粉。他嘴角还挂着笑，眼里却已没了光。你握着血流蛊，掌心血线微微搏动，像是饥饿的兽终于尝到第一口血。蛊身滚烫，传来一种近乎贪婪的满足——赵黎的修为顺着蛊纹涌入你体内，暖意从指尖漫到胸口。沈青萝收剑后退，袖口沾了灰。她盯着你手中蛊虫，眉头微蹙，却只说了句：“赵黎死了，乔无咎该出来了。”话音未落，墓道尽头传来脚步声。乔无咎走得从容，衣摆不沾尘，仿佛方才那场生死斗不过是一场戏。他身后祭台血气逆流，四壁石缝渗出暗红，像是整座墓都在回应他的步子。他停在十步外，目光落在你掌心的血流蛊上，语气平静：“你倒是比我想的能忍。”你注意到他甲衣下浮起细密血纹，像蛛网般爬满半边身子。那些纹路随他呼吸微微发亮，衬得他面色愈发冷硬。他抬手结印，祭台上残血陡然沸腾，墓室四角同时传来沉闷的嗡鸣。你心头一紧，血流蛊在你掌心躁动起来，仿佛嗅到更浓的血气。沈青萝低喝：“退——”话音未落，乔无咎已踏前一步，整座墓室的血气像被抽干般朝他涌去。`;
  if (sceneId === "qiaoCleanExit") return "乔无咎的本命蛊在石阶上裂成灰。没有赵黎的邪修秘法，血流蛊终究无法吞下足够血气；它在玉匣中挣扎片刻，背甲上的血纹一寸寸黯淡，最终化作一捧温热灰烬。\n\n墓门外的天光照进来时，你才意识到自己仍能听见风声。乔家的血祭断在这里，荒原上留下的只有一座空墓和一笔尚待清算的旧账。";
  return "";
}

function needleRestText(game: GameState) {
  const qiaoText = game.flags.includes("血针重伤")
    ? "乔无咎的声音隔着石壁传来，带着一丝难辨的意味：“诸位能活过来便好。乔某从未指望这点血针取谁性命，不过是让诸位在进主墓前多耗几分真元。如今看来，目的已经达到。”"
    : "墓道深处传来乔无咎的声音，隔着层层石壁，有些失真，却听得清晰：“诸位道友无恙否？这血针机关乃墓中旧设，乔某方才不慎踩中机括，被隔在石闸之外，一时未能提醒，实在惭愧。”话中带着一丝歉意，可你分明听出，那语气里有极淡的一丝意外，像是未曾料到众人能这般轻易地扛过针雨。他顿了顿，又补了一句：“此机关只为消耗入墓者气血，并无取死之意，诸位既已通过，前方路便好走了。”";
  return `针孔闭合之后，石廊尽头露出大片坍塌的痕迹，乱石堆叠，几乎堵住了去路。乱石之间，一缕血雾缓缓弥漫开来，遮住更远处的景象。那血雾不浓，却带着一股铁锈与药灰混合的气味，闻久了便觉得舌根发苦。你站在坍塌的石堆前，能感觉到雾气的边缘拂过手背，微凉。${qiaoText}

血针停歇时，残壁下的石缝里还渗着细密的锈水。你靠着冰冷的墓壁，胸口起伏，指尖微微发颤。贾贵蹲在几步外，正低头翻着腰间的布囊。他摸出一个小瓷瓶，在手里掂了掂，却先嘬着牙花子说：“这补元散是我花大价钱换的，本打算留着救命用。可你们这副模样，若再走两步便栽倒，倒拖累我跑不快。”他说着，把瓷瓶抛向你，力道拿捏得恰好落进掌心。瓶身温热，像是贴身捂了很久。

沈青萝没接话，只在你身旁蹲下来，从袖中取出干净的布条和一小罐药膏。她动作极轻，先拨开你伤口处的碎布，确认没有残针，才蘸着药膏细细涂抹。她低着头，一言不发，却固执地将每一处破口都处理妥当。药膏触到伤口时微凉，旋即泛起一丝暖意。她包扎时打了个极结实的结，才低声道：“针上有锈，不清理会沁毒。”

你转头看去，赵黎正背对众人站在残壁外侧。有人低声问他要不要也处理一下伤口，他只摆摆手，声音平淡：“皮外伤，不必费心。”话虽如此，他站的位置却恰好挡住那条幽深的来路，袍角微动，像是随时能拔步迎敌。

乔无咎的声音从前方传来，隔着一道坍塌的拱门，显得有些远：“诸位无恙便好。前方我乔家探过，有处空旷石室可暂歇。”你听出他脚步未停，正一步步往深处引路。贾贵低笑一声，跟了上去，嘴里嘟囔：“乔家主倒是熟门熟路。”沈青萝收好药具，望了你一眼，没有多言。

前方乔无咎忽然停步。你越过他肩头看去，只见墓道被一堆坍塌的乱石堵死，碎石间露出半截朽烂的横梁。石堆前的地面上，刻着一座暗淡的传送阵，阵纹被灰尘掩盖，只余几道微弱的灵光在纹路间游走，像将熄的余烬。乔无咎沉默片刻，伸手拂去阵沿的碎石，语气依旧平静：“此阵尚能运转，只是不知通往何处。”

贾贵凑上前，眯着眼打量阵纹，半晌啧了一声：“这纹路不像乔家的手笔。”赵黎站在人群外，目光落在阵心一处暗红的刻痕上，忽然开口：“墓中主人留下的路，未必是为活人备的。”他说完便不再言语。沈青萝站在你身侧，低声问：“沈砚上次……也是走这条路吗？”乔无咎没有回头，只答了一句：“他确曾到过此处。”`;
}

function bloodCardText(role: NonNullable<ReturnType<typeof getRole>>, game: GameState) {
  const roleText = role.id === "healer"
    ? "宁素衣的神识掠过阵纹，立刻察觉最亮的血牌下压着一道反向禁制；若贸然注入真元，传送终点绝不会是主墓室。"
    : role.id === "swordsman"
      ? game.trust.zhao < 2
        ? game.trust.shen >= 2
          ? "陆照野按剑立在阵边，赵黎却在背后轻笑，袖中血线已悄然绕向阵心。沈青萝看向你时，掌心的藤丝已经缠上阵台；你们之间积下的裂痕，终于到了无法遮掩的时候。"
          : "陆照野按剑立在阵边，赵黎却在背后轻笑，袖中血线已悄然绕向阵心。沈青萝的手仍压在最裂的一块血牌上，像要独自补住这座随时会塌的阵。"
        : "陆照野按剑立在阵边，赵黎看了你一眼，罕见地收起戏谑，只以血线替你稳住最躁动的一角阵纹。"
      : "顾微尘刚俯身查看血牌，乔无咎的传音便在耳畔响起。他许诺只要你替乔家以世家声望圆下这场事故，便可单独送你入主墓；其余人是否能活，全看你一句话。";
  return `墓室深处，那方刻满符文的石台忽然发出一声裂响，石缝间渗出暗红的光。乔无咎站在三步外，袖手而立，语气仍是周全的：“这阵……怕是年久失修了。”话音未落，头顶碎石簌簌落下，整间墓室都跟着晃了一晃。沈青萝蹲在石台边缘，指尖抚过一道断裂的纹路，脸色忽然变了：“这不是年久失修，是有人刚动过机关。”她指着阵心一处暗槽，“这里本该嵌着六块血牌，现在只剩五块，缺的那块被人取走了——取走的人，多半就在我们中间。”她说着，指尖已从袖中摸出三枚骨针，“这阵我能修，但需要有人稳住阵心。阵心一稳，我就能把血牌归位，重新引动传送。”${roleText}\n\n血牌逐一亮起，又逐一熄灭。留给你们的时间已经不多。`;
}

function teamGatherText(game: GameState) {
  const allTrusted = game.trust.shen >= 2 && game.trust.zhao >= 2 && game.trust.jia >= 2;
  return allTrusted
    ? "武意海伏诛后，密道里的血雾渐渐散去。沈青萝、赵黎与贾贵都没有离开；你们从武意海身上取到两把钥匙，其中一把正对应墓穴控制室的锁孔。赵黎低声说乔无咎还在等血祭，贾贵却难得没有先提报酬。此刻众人仍愿意把后背交给彼此，或许还能在乔家最后一次落锁前结束一切。"
    : "武意海伏诛后，赵黎望向血流蛊室的方向，神色重新变得幽深。他没有等你们救完剩下的人，便独自沿密道离去。待你带着幸存者赶到主墓室时，血瓶碎裂的声音已经响起——赵黎显然比任何人都更急着得到血流蛊。";
}

function describeBattleTurn(before: GameState, after: GameState, action: GuAction): BattleFeedback {
  const battle = before.battle;
  if (!battle) return { result: "蛊息渐歇，墓道里只余摇晃的灯火。", enemyCondition: "不明", hasEnded: false };
  const enemyName = battle.enemyName;
  const actionText: Record<GuAction, string> = {
    blood: `你催动血刃蛊，血煞在掌前凝成一线锋芒，斩向${enemyName}。`,
    bloodflow: `血流蛊自掌心游出，${enemyName}身上的血气被它牵出一缕，反灌回你的经脉。`,
    armor: before.flags.includes("血甲蛊已得")
      ? "血甲蛊覆上周身，薄如一层血雾，却将来势尽数隔在体外。"
      : "甲衣蛊贴身而起，细密甲纹沿经脉铺开，迎向逼近的阴影。",
    heal: "回春蛊化作温和药气游走经脉，原本滞涩的气血重新有了暖意。",
    sword: `剑鸣蛊破空长啸，锐响在墓道里折返，直刺${enemyName}胸前。`,
    mind: `${enemyName}眼中的幽火忽明忽灭，惑心蛊已经先一步扰乱了它凝聚的杀意。`,
    rest: "你收束纷乱真元，强行压下翻涌的气血，趁片刻空隙调息回气。",
  };
  const nextBattle = after.battle;
  if (!nextBattle || after.sceneId !== before.sceneId) return {
    result: after.sceneId === battle.defeatNext
      ? battle.intent.reflect && action !== "armor" && action !== "mind"
        ? `${actionText[action]}血幕却将你的蛊力原样倒卷而回。你胸口如受重锤，分明是被自己的攻势反弹所伤，眼前顿时一黑。`
        : `${actionText[action]}${enemyName}的攻势随后压下。你再也压不住翻涌的气血，只能在墓室中踉跄倒下。`
      : `${actionText[action]}${enemyName}的躯壳猛地一滞，随后在昏暗灯火中崩裂倒下，再没有余力还击。`,
    enemyCondition: after.sceneId === battle.defeatNext ? "你已落败" : "已伏诛",
    hasEnded: true,
    emphasis: after.sceneId === battle.defeatNext ? "danger" : "success",
  };
  const immune = action === "mind" || (action === "armor" && before.flags.includes("血甲蛊已得"));
  const defended = action === "armor" || action === "mind";
  const corpseResponse = battle.intent.id === "corpse-claw"
    ? immune
      ? `${enemyName}俯身扑来的铁爪在半途失了准头，只抓碎了脚边的墓砖。`
      : defended
        ? `${enemyName}的铁爪撞上蛊甲，甲片与利爪相击，震得墓道里火星四散。`
        : `${enemyName}拖着铁靴骤然扑近，带锈的铁爪擦过身侧，留下火辣的一阵疼。`
    : battle.intent.id === "corpse-mist"
      ? immune
        ? `${enemyName}口中涌出的尸雾尚未散开，便在错乱的蛊息中塌回了胸腔。`
        : defended
          ? `灰绿尸雾漫到近前，却被护体蛊息挡在外侧，只余一层冷意贴着皮肤游走。`
          : `${enemyName}张口吐出一片灰绿尸雾，腥腐之气钻入鼻腔，连呼吸都变得沉滞。`
      : immune
        ? `${enemyName}胸腹间的尖啸刚要炸开，便被紊乱的蛊息生生压回，灯火也随之一暗。`
        : action === "armor" && !before.flags.includes("血甲蛊已得")
          ? `你凝神催动甲衣蛊，谁知${enemyName}猛然炸开一圈尖啸音波，声浪灌耳，震得你胸中翻涌，身不由己地连退几步。`
          : `${enemyName}胸腹骤然鼓起，一圈尖啸音波在墓道中炸开，声浪灌耳，震得人胸中气血翻涌。`;
  const enemyResponse = battle.intent.reflect
    ? action === "mind"
      ? `${enemyName}身前的血幕被惑心蛊搅得一阵扭曲，尚未来得及反噬便自行散开。`
      : action === "armor"
        ? `你的一击撞入血幕，反卷而回的血光被甲衣蛊尽数挡在身外。`
        : `你催出的蛊息刚触及血幕，便沿原路倒卷回来，震得气血翻涌。`
    : battle.intent.heal
      ? `${enemyName}仰头饮下血瓶中的赤液，原本萎靡的血气肉眼可见地重新凝实。`
      : immune
        ? `${enemyName}的攻势被扰乱，刚凝成的杀意无声散去。`
        : defended
          ? `${enemyName}的攻势撞上护体蛊息，余劲只在石室中荡开一阵回响。`
          : enemyName === "尸灯傀儡"
            ? corpseResponse
            : `${enemyName}趁蛊息未散逼近，来势震得你气血一滞。`;
  const nextCue = enemyCueFor(nextBattle);
  return {
    result: `${actionText[action]}${enemyResponse}`,
    nextCue,
    enemyCondition: getEnemyCondition(nextBattle.enemyHealth, nextBattle.enemyMaxHealth),
    hasEnded: false,
  };
}

function enemyCueFor(battle: NonNullable<GameState["battle"]>) {
  return battle.intent.cue;
}

export function GuTombGame() {
  const [game, setGame] = useState<GameState>(initialGame);
  const [seenEndings, setSeenEndings] = useState<string[]>([]);
  const [saveSlots, setSaveSlots] = useState<SaveSlots>(emptySaveSlots);
  const [homeView, setHomeView] = useState<HomeView>("menu");
  const [archiveRoleId, setArchiveRoleId] = useState<RoleId>("healer");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [themePreference, setThemePreference] = useState<ThemePreference>("system");
  const [narrative, setNarrative] = useState({ sceneId: "entrance", page: 0 });
  const [inkPage, setInkPage] = useState<InkPage | null>(null);
  const [readingBox, setReadingBox] = useState({ width: 340, height: 280 });
  const [pendingBattleState, setPendingBattleState] = useState<GameState | null>(null);
  const [battleFeedback, setBattleFeedback] = useState<BattleFeedback | null>(null);
  const [showGameMenu, setShowGameMenu] = useState(false);
  const inkStory = useRef<Story | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const storageLoadedRef = useRef(false);
  const role = getRole(game.roleId);
  const scene = scenes[game.sceneId];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const storedEndings = JSON.parse(window.localStorage.getItem(endingStorageKey) ?? "[]") as unknown;
        if (Array.isArray(storedEndings)) setSeenEndings(storedEndings.filter((id): id is string => typeof id === "string" && id in endings));
        setSaveSlots(readSaveSlots());
        setReduceMotion(window.localStorage.getItem(motionStorageKey) === "true");
        const storedTheme = window.localStorage.getItem(themeStorageKey);
        if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") setThemePreference(storedTheme);
      } finally {
        storageLoadedRef.current = true;
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!storageLoadedRef.current) return;
    window.localStorage.setItem(endingStorageKey, JSON.stringify(seenEndings));
    window.localStorage.setItem(motionStorageKey, String(reduceMotion));
    window.localStorage.setItem(themeStorageKey, themePreference);
    document.documentElement.dataset.reduceMotion = String(reduceMotion);
    document.documentElement.dataset.theme = themePreference;
  }, [reduceMotion, seenEndings, themePreference]);

  useEffect(() => {
    const element = copyRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setReadingBox((current) => current.width === width && current.height === height ? current : { width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function loadInkScene(sceneId: string) {
    if (!inkSceneIds.has(sceneId)) {
      setInkPage(null);
      return;
    }
    const story = createInkStory(sceneId);
    inkStory.current = story;
    setInkPage(readInkPage(story));
    setNarrative({ sceneId, page: 0 });
  }

  function selectRole(id: RoleId) {
    loadInkScene("entrance");
    setPendingBattleState(null);
    setBattleFeedback(null);
    setShowGameMenu(false);
    setGame(chooseRole(id));
  }

  function persistSaveSlots(nextSlots: SaveSlots) {
    setSaveSlots(nextSlots);
    window.localStorage.setItem(saveStorageKey, JSON.stringify(nextSlots));
  }

  function saveToSlot(index: number) {
    const stateToSave = pendingBattleState ?? game;
    const canKeepInkState = stateToSave.sceneId === game.sceneId && inkSceneIds.has(stateToSave.sceneId);
    const nextSlots = [...saveSlots];
    nextSlots[index] = {
      version: 1,
      savedAt: new Date().toISOString(),
      game: stateToSave,
      narrative: stateToSave.sceneId === game.sceneId ? narrative : { sceneId: stateToSave.sceneId, page: 0 },
      inkPage: canKeepInkState ? inkPage ?? undefined : undefined,
      inkState: canKeepInkState ? inkStory.current?.state.ToJson() : undefined,
    };
    persistSaveSlots(nextSlots);
  }

  function loadFromSlot(slot: SaveSlot) {
    const restored = { ...slot.game, battle: slot.game.battle ?? null, endingId: null };
    setPendingBattleState(null);
    setBattleFeedback(null);
    setShowGameMenu(false);
    setGame(restored);
    setNarrative(slot.narrative.sceneId === restored.sceneId ? slot.narrative : { sceneId: restored.sceneId, page: 0 });
    if (!inkSceneIds.has(restored.sceneId)) {
      inkStory.current = null;
      setInkPage(null);
      return;
    }
    try {
      const story = createInkStory(restored.sceneId);
      if (slot.inkState) story.state.LoadJson(slot.inkState);
      inkStory.current = story;
      setInkPage(slot.inkPage ?? readInkPage(story));
    } catch {
      loadInkScene(restored.sceneId);
    }
  }

  function returnToMainMenu() {
    setPendingBattleState(null);
    setBattleFeedback(null);
    setShowGameMenu(false);
    setGame(initialGame());
    setHomeView("menu");
  }
  function selectChoice(choice: Choice) {
    const next = applyChoice(game, choice);
    if (next.sceneId !== "ending") {
      loadInkScene(next.sceneId);
      setGame(next);
      return;
    }
    const endingId = resolveEnding(next);
    setSeenEndings((seen) => seen.includes(endingId) ? seen : [...seen, endingId]);
    setGame({ ...next, endingId });
  }

  function handleBattle(action: GuAction) {
    if (pendingBattleState) return;
    const next = resolveBattleTurn(game, action);
    if (next === game) return;
    const feedback = describeBattleTurn(game, next, action);
    setBattleFeedback(feedback);
    if (feedback.hasEnded) {
      setPendingBattleState(next);
      return;
    }
    setGame(next);
  }

  function continueBattle() {
    if (!pendingBattleState) return;
    if (pendingBattleState.sceneId !== game.sceneId) loadInkScene(pendingBattleState.sceneId);
    setGame(pendingBattleState);
    setPendingBattleState(null);
    setBattleFeedback(null);
  }

  function selectInkChoice(id: string) {
    if (!inkStory.current) return;
    const nextInkPage = chooseInk(inkStory.current, id);
    if (id === "continue") {
      setInkPage(nextInkPage);
      setNarrative({ sceneId: scene.id, page: 0 });
      return;
    }
    const choice = scene.choices?.find((item) => item.id === id);
    if (!choice) return;
    selectChoice(choice);
  }

  if (!role) {
    if (homeView === "archive") return <EndingArchive archiveRoleId={archiveRoleId} onBack={() => setHomeView("menu")} onSelectRole={setArchiveRoleId} seenEndings={seenEndings} />;
    if (homeView === "saves") return <SaveArchive onBack={() => setHomeView("menu")} onLoad={loadFromSlot} saveSlots={saveSlots} />;
    if (homeView === "settings") return <GameSettings onBack={() => setHomeView("menu")} onClearEndings={() => setSeenEndings([])} reduceMotion={reduceMotion} onThemeChange={setThemePreference} onToggleReduceMotion={() => setReduceMotion((current) => !current)} themePreference={themePreference} />;
    if (homeView === "menu") return <MainMenu onArchive={() => setHomeView("archive")} onSaves={() => setHomeView("saves")} onSettings={() => setHomeView("settings")} onStart={() => setHomeView("roles")} saveSlots={saveSlots} unlockedCount={seenEndings.length} />;
    return <RoleSelect onBack={() => setHomeView("menu")} onSelect={selectRole} />;
  }
  if (game.endingId) return <EndingScreen game={game} seenEndings={seenEndings} onReplay={() => selectRole(role.id)} onChangeRole={() => { setGame(initialGame()); setHomeView("roles"); }} onMenu={() => { setGame(initialGame()); setHomeView("menu"); }} />;
  if (!scene) return null;

  const battle = game.battle;
  const isInkScene = inkSceneIds.has(scene.id) && inkPage !== null;
  const isDynamicClimaxScene = ["lastGate", "bloodRage", "zhaoDuel", "zhaoDeath", "qiaoDuel", "qiaoCleanExit"].includes(scene.id);
  const isDynamicNarrativeScene = isDynamicClimaxScene || ["needleRest", "bloodCardChange", "teamGather"].includes(scene.id);
  const sourceText = scene.id === "shenCare" ? shenCareText(game, role) : scene.id === "needleRest" ? needleRestText(game) : scene.id === "bloodCardChange" ? bloodCardText(role, game) : scene.id === "teamGather" ? teamGatherText(game) : isDynamicClimaxScene ? climaxText(scene.id, game) : isInkScene ? inkPage.text : scene.paragraphs[0];
  const fittedPages = splitForViewport(sourceText, readingBox);
  const pageCount = fittedPages.length;
  const narrativePage = narrative.sceneId === scene.id ? narrative.page : 0;
  const pageIndex = Math.min(narrativePage, pageCount - 1);
  const isLastNarrativePage = pageIndex === pageCount - 1;
  const narrativeParts: string[] = [fittedPages[pageIndex], !isInkScene && !isDynamicNarrativeScene ? scenePageNotes[scene.id]?.[pageIndex] : undefined].filter((part): part is string => Boolean(part));
  const displayChoices: Choice[] = isInkScene
    ? inkPage.choices.map((inkChoice) => inkChoice.id === "continue" ? { id: "continue", label: inkChoice.label, next: scene.id } : scene.choices?.find((choice) => choice.id === inkChoice.id)).filter((choice): choice is Choice => Boolean(choice))
    : scene.choices ?? [];
  const visibleChoices = displayChoices.filter((choice) => choice.id === "continue" || canChoose(game, choice));
  return (
    <main className="game-shell">
      <section className={`game-frame story-frame${battle ? " is-battling" : ""}`} aria-label="蛊墓五修游戏界面">
        {battle ? <BattlePanel battleFeedback={battleFeedback} game={game} onAction={handleBattle} onContinue={continueBattle} onOpenMenu={() => setShowGameMenu(true)} /> : <>
          <header className="status-bar">
            <div><span>修士</span><strong>{role.name}</strong></div>
            <div className="health-stat"><span>命</span><strong>{game.health}/{game.maxHealth}</strong><i style={{ width: `${(game.health / game.maxHealth) * 100}%` }} /></div>
            <button className="game-menu-trigger" type="button" aria-expanded={showGameMenu} aria-label="打开游戏菜单" onClick={() => setShowGameMenu(true)}>菜单</button>
          </header>
          <section className="scene" aria-live="polite">
            <p className="eyebrow">{scene.chapter}</p>
            <h1>{scene.title}</h1>
            <div className="scene-copy" ref={copyRef}>{narrativeParts.map((paragraph) => <NarrativePage key={paragraph} text={paragraph} />)}</div>
            <p className="narrative-progress">{pageIndex + 1} / {pageCount}</p>
          </section>
          {!isLastNarrativePage ? <div className="choice-panel"><button className="primary-button" onClick={() => setNarrative({ sceneId: scene.id, page: Math.min(pageIndex + 1, pageCount - 1) })}>继续</button></div> : null}
          {isLastNarrativePage && scene.battle ? <div className="choice-panel"><button className="primary-button" onClick={() => setGame((current) => startBattle(current, scene))}>放出本命蛊</button></div> : null}
          {isLastNarrativePage && scene.choices ? (
          <nav className="choice-panel" aria-label="剧情选项">
            {visibleChoices.map((choice) => choice.id === "continue"
              ? <button className="primary-button" key={choice.id} onClick={() => selectInkChoice(choice.id)}>继续</button>
              : <button className="choice-button" key={choice.id} onClick={() => isInkScene ? selectInkChoice(choice.id) : selectChoice(choice)}><span>{isInkScene ? inkPage.choices.find((item) => item.id === choice.id)?.label ?? choice.label : choice.label}</span></button>)}
          </nav>
          ) : null}
        </>}
        {showGameMenu ? <GameMenu onClose={() => setShowGameMenu(false)} onLoad={loadFromSlot} onMenu={returnToMainMenu} onSave={saveToSlot} saveSlots={saveSlots} /> : null}
      </section>
    </main>
  );
}

function MainMenu({ onArchive, onSaves, onSettings, onStart, saveSlots, unlockedCount }: { onArchive: () => void; onSaves: () => void; onSettings: () => void; onStart: () => void; saveSlots: SaveSlots; unlockedCount: number }) {
  const saveCount = saveSlots.filter(Boolean).length;
  return <main className="game-shell menu-shell"><section className="game-frame main-menu" aria-labelledby="menu-title">
      <header className="menu-intro"><div className="menu-title-row"><GuTombMark className="gu-tomb-mark" /><div><p className="eyebrow">乔家荒原 · 五人入墓</p><h1 id="menu-title">蛊墓五修</h1></div></div><p>一座蛊墓，五名四转修士。你所见与所信，都会把人带向不同的墓门。</p></header>
      <nav className="menu-index" aria-label="主界面菜单">
        <button className="menu-action menu-action-primary" onClick={onStart}><span><strong>开始游戏</strong><small>择一身份，重入蛊墓</small></span></button>
        <button className="menu-action" onClick={onSaves}><span><strong>读取存档</strong><small>本设备已有 {saveCount} / {saveSlotCount} 卷行迹</small></span></button>
        <button className="menu-action" onClick={onArchive}><span><strong>结局一览</strong><small>已解锁 {unlockedCount} / {Object.keys(endings).length}</small></span></button>
        <button className="menu-action" onClick={onSettings}><span><strong>游戏设置</strong><small>阅读与记录</small></span></button>
      </nav>
    <p className="menu-note">每一次选择都会留下痕迹。</p>
  </section></main>;
}

function SaveArchive({ onBack, onLoad, saveSlots }: { onBack: () => void; onLoad: (slot: SaveSlot) => void; saveSlots: SaveSlots }) {
  return <main className="game-shell archive-shell"><section className="game-frame archive-card save-archive" aria-labelledby="save-title">
    <header className="menu-page-header"><button className="back-button" onClick={onBack}>返回</button><div><p className="eyebrow">六卷行迹</p><h1 id="save-title">读取存档</h1></div></header>
    <p className="save-archive-copy">存档只保存于当前浏览器。读取任意一卷，将从该处继续行走。</p>
    <div className="save-archive-list">{saveSlots.map((slot, index) => {
      const label = slot ? saveSlotLabel(slot) : null;
      return <article className={`save-slot${slot ? " is-occupied" : ""}`} key={index}><div><span>存档 {index + 1}</span><strong>{label?.role ?? "空白卷轴"}</strong><small>{slot ? `${label?.scene} · ${formatSaveTime(slot.savedAt)}` : "尚未留下任何行迹"}</small></div><button className="slot-load-button" type="button" disabled={!slot} onClick={() => slot && onLoad(slot)}>读取</button></article>;
    })}</div>
  </section></main>;
}

function GameMenu({ onClose, onLoad, onMenu, onSave, saveSlots }: { onClose: () => void; onLoad: (slot: SaveSlot) => void; onMenu: () => void; onSave: (index: number) => void; saveSlots: SaveSlots }) {
  return <div className="game-menu-backdrop" role="presentation" onClick={onClose}><section className="game-menu-dialog" role="dialog" aria-modal="true" aria-label="游戏菜单" onClick={(event) => event.stopPropagation()}>
    <header><div><p className="eyebrow">行囊卷轴</p><h2>游戏菜单</h2></div><button className="game-menu-close" type="button" aria-label="关闭游戏菜单" onClick={onClose}>×</button></header>
    <p className="game-menu-copy">存档仅保存在此浏览器与此设备中。读取存档会放弃当前未保存的进度。</p>
    <div className="save-slot-list" aria-label="六个存档位">{saveSlots.map((slot, index) => {
      const label = slot ? saveSlotLabel(slot) : null;
      return <article className={`save-slot${slot ? " is-occupied" : ""}`} key={index}><div><span>存档 {index + 1}</span><strong>{label?.role ?? "空白卷轴"}</strong><small>{slot ? `${label?.scene} · ${formatSaveTime(slot.savedAt)}` : "尚未留下任何行迹"}</small></div><nav><button className="slot-save-button" type="button" onClick={() => onSave(index)}>存入</button>{slot ? <button className="slot-load-button" type="button" onClick={() => onLoad(slot)}>读取</button> : null}</nav></article>;
    })}</div>
    <button className="game-menu-home" type="button" onClick={onMenu}>返回主菜单</button>
  </section></div>;
}

function EndingArchive({ archiveRoleId, onBack, onSelectRole, seenEndings }: { archiveRoleId: RoleId; onBack: () => void; onSelectRole: (id: RoleId) => void; seenEndings: string[] }) {
  const availableEndingIds = endingRoleAccess[archiveRoleId];
  const unlockedForRole = availableEndingIds.filter((id) => seenEndings.includes(id)).length;
  return <main className="game-shell archive-shell"><section className="game-frame archive-card" aria-labelledby="archive-title">
    <header className="menu-page-header"><button className="back-button" onClick={onBack}>返回</button><div><p className="eyebrow">命数卷宗</p><h1 id="archive-title">结局一览</h1></div></header>
    <div className="archive-tabs" role="tablist" aria-label="选择修士">{roles.map((candidate) => <button aria-selected={candidate.id === archiveRoleId} className="archive-tab" key={candidate.id} onClick={() => onSelectRole(candidate.id)} role="tab">{candidate.name}</button>)}</div>
    <p className="archive-summary"><strong>{unlockedForRole} / {availableEndingIds.length}</strong><span>{roles.find((candidate) => candidate.id === archiveRoleId)?.name}可触及的命数</span></p>
    <ul className="ending-list">{Object.values(endings).map((ending) => {
      const reachable = availableEndingIds.includes(ending.id);
      const unlocked = seenEndings.includes(ending.id);
      return <li className={`ending-entry${unlocked ? " is-unlocked" : ""}${reachable ? "" : " is-unavailable"}`} key={ending.id}><div><strong>{ending.name}</strong><span>{unlocked ? "已解锁" : reachable ? "尚未解锁" : "此身份无法抵达"}</span></div><p>{unlocked ? ending.epitaph : reachable ? "此命数仍藏在蛊墓深处。" : "换一位修士，才可能走到这里。"}</p></li>;
    })}</ul>
  </section></main>;
}

function GameSettings({ onBack, onClearEndings, onThemeChange, onToggleReduceMotion, reduceMotion, themePreference }: { onBack: () => void; onClearEndings: () => void; onThemeChange: (theme: ThemePreference) => void; onToggleReduceMotion: () => void; reduceMotion: boolean; themePreference: ThemePreference }) {
  const [confirmClear, setConfirmClear] = useState(false);
  function clearEndings() {
    if (!confirmClear) { setConfirmClear(true); return; }
    onClearEndings();
    setConfirmClear(false);
  }
  return <main className="game-shell settings-shell"><section className="game-frame settings-card" aria-labelledby="settings-title">
    <header className="menu-page-header"><button className="back-button" onClick={onBack}>返回</button><div><p className="eyebrow">行囊与灯火</p><h1 id="settings-title">游戏设置</h1></div></header>
    <div className="settings-list"><div className="settings-note theme-setting"><strong>界面主题</strong><p>选择蛊墓在此设备上的明暗样式。</p><div aria-label="选择界面主题" className="theme-options" role="group">{(["system", "light", "dark"] as ThemePreference[]).map((theme) => <button aria-pressed={themePreference === theme} className="theme-option" key={theme} onClick={() => onThemeChange(theme)}>{theme === "system" ? "跟随系统" : theme === "light" ? "亮色" : "暗色"}</button>)}</div></div>
      <button aria-pressed={reduceMotion} className="settings-row" onClick={onToggleReduceMotion}><span><strong>减少动态</strong><small>剧情与按钮以更静止的方式呈现</small></span><em>{reduceMotion ? "已开启" : "跟随系统"}</em></button>
      <div className="settings-note"><strong>图鉴记录</strong><p>已解锁结局会保存在当前设备中。</p></div>
      <button className={`settings-row settings-danger${confirmClear ? " is-confirming" : ""}`} onClick={clearEndings}><span><strong>{confirmClear ? "再次点击，确认清除" : "清除结局记录"}</strong><small>{confirmClear ? "此操作无法撤回" : "只清除本设备上的图鉴进度"}</small></span><em>{confirmClear ? "确认" : "清除"}</em></button>
    </div>
  </section></main>;
}

function RoleSelect({ onBack, onSelect }: { onBack: () => void; onSelect: (id: RoleId) => void }) {
  return <main className="game-shell role-select"><section className="game-frame opening-card" aria-labelledby="game-title">
    <button className="back-button role-back" onClick={onBack}>返回主界面</button>
    <p className="eyebrow">固定剧本 · 多结局 · 蛊斗</p><h1 id="game-title">蛊墓五修</h1>
    <p className="opening-copy">五名修士入墓寻宝。墓门合拢后，你只能带着一条魂路离开。</p>
    <div className="role-list" aria-label="选择角色">{roles.map((candidate) => <button className="role-card" key={candidate.id} onClick={() => onSelect(candidate.id)}>
      <span className="role-title">{candidate.title}</span><strong>{candidate.name}</strong><span>{candidate.description}</span>
      <small>命数 {candidate.maxHealth} · {candidate.id === "healer" ? "善察幽微，能护住同伴" : candidate.id === "swordsman" ? "一往无前，最擅正面破局" : "熟悉人情，善借各方余势"}</small><em>擅用：{candidate.signatureGu}</em>
    </button>)}</div>
  </section></main>;
}

function BattlePanel({ battleFeedback, game, onAction, onContinue, onOpenMenu }: { battleFeedback: BattleFeedback | null; game: GameState; onAction: (action: GuAction) => void; onContinue: () => void; onOpenMenu: () => void }) {
  const battle = game.battle;
  const role = getRole(game.roleId);
  const [showHelp, setShowHelp] = useState(false);
  if (!battle || !role) return null;
  const signatureAction = role.id === "healer"
    ? { id: "heal" as const, name: "回春蛊", description: "恢复 7 点生命。消耗 2 真元。" }
    : role.id === "swordsman"
      ? { id: "sword" as const, name: "剑鸣蛊", description: "造成 10 点伤害，自身受 1 点伤害。消耗 4 真元。" }
      : { id: "mind" as const, name: "惑心蛊", description: "打断本回合攻势，并造成等同攻击属性的伤害。消耗 2 真元。" };
  const defenseAction = game.flags.includes("血甲蛊已得")
    ? { id: "armor" as const, name: "血甲蛊", description: "血甲覆身，本回合完全免疫伤害。消耗 1 真元。" }
    : { id: "armor" as const, name: "甲衣蛊", description: "蛊甲覆身，硬受来势。消耗 1 真元。" };
  const attackAction = game.flags.includes("血流蛊已得")
    ? [{ id: "bloodflow" as const, name: "血流蛊", description: "造成 6 点伤害，并恢复 6 点生命。消耗 1 真元。" }]
    : baseGuActions;
  const guActions = game.essence === 0
    ? [{ id: "rest" as const, name: "调息", description: "本回合不出手，恢复 3 点真元。" }]
    : [...attackAction, defenseAction, signatureAction];
  const actionCosts: Record<GuAction, number> = { blood: 1, armor: 1, mind: 2, heal: 2, sword: 4, bloodflow: 1, rest: 0 };
  const enemyCue = enemyCueFor(battle);
  const enemyCondition = battleFeedback?.enemyCondition ?? getEnemyCondition(battle.enemyHealth, battle.enemyMaxHealth);
  return <section className="battle-panel" aria-label="蛊斗">
    <header className="battle-player-bar"><div><span>修士</span><strong>{role.name}</strong></div><div className="battle-health"><span>命</span><strong>{game.health}/{game.maxHealth}</strong><i style={{ width: `${(game.health / game.maxHealth) * 100}%` }} /></div><button className="game-menu-trigger" type="button" aria-label="打开游戏菜单" onClick={onOpenMenu}>菜单</button></header>
    <div className="battle-heading"><div className="enemy-row"><span>{battle.enemyName}</span><strong>敌方状态：{enemyCondition}</strong></div><button className="battle-help-button" type="button" aria-label="查看蛊斗说明" onClick={() => setShowHelp(true)}>?</button></div>
    <p className="essence-stat">真元 <strong>{game.essence}/{game.maxEssence}</strong></p>
    <div className={`intent-copy${battleFeedback?.emphasis ? ` is-${battleFeedback.emphasis}` : ""}`} aria-live="polite">
      {battleFeedback ? <><span className="battle-report-label">本回合结果</span><p>{battleFeedback.result}</p>{battleFeedback.nextCue ? <><span className="battle-report-label">敌方异动</span><p>{battleFeedback.nextCue}</p></> : null}</> : <><span className="battle-report-label">敌方异动</span><p>{enemyCue}</p></>}
    </div>
    {battleFeedback?.hasEnded ? <button className="primary-button" onClick={onContinue}>继续</button> : <div className="gu-list">{guActions.map((action) => <button key={action.id} disabled={game.essence < actionCosts[action.id]} onClick={() => onAction(action.id)}><strong>{action.name}</strong><span>{action.description}</span></button>)}</div>}
    {showHelp ? <div className="battle-help-backdrop" role="presentation" onClick={() => setShowHelp(false)}><section className="battle-help-dialog" role="dialog" aria-modal="true" aria-label="蛊斗说明" onClick={(event) => event.stopPropagation()}>
      <button className="battle-help-close" type="button" aria-label="关闭说明" onClick={() => setShowHelp(false)}>×</button><p className="eyebrow">蛊斗说明</p><h2>真元与回合</h2>
      <p>每一场蛊斗都会以真元全满开始。你先放出蛊虫；若敌人仍存活，才会还击。击杀敌人的那一击不会承受其反击。</p>
      <p>攻击蛊与甲衣蛊各消耗 1 真元；回春蛊、惑心蛊各消耗 2 真元，剑鸣蛊消耗 4 真元。血流蛊会替换血刃蛊，血甲蛊会替换甲衣蛊。真元归零时只能调息一回合，恢复 3 点真元，敌人仍会行动。</p>
      <p>敌人的异样动作只是征兆，不会直接告诉你下一击是什么。留意其姿态、气息与周围变化。</p>
    </section></div> : null}
  </section>;
}

function EndingScreen({ game, seenEndings, onReplay, onChangeRole, onMenu }: { game: GameState; seenEndings: string[]; onReplay: () => void; onChangeRole: () => void; onMenu: () => void }) {
  const ending = game.endingId ? endings[game.endingId] : null;
  if (!ending) return null;
  const endingText = ["cleansed", "traitor", "wu", "true"].includes(ending.id) ? ending.text : readInkKnot(`ending_${ending.id}`) || ending.text;
  return <main className="game-shell"><section className="game-frame ending-card" aria-labelledby="ending-title">
    <p className="eyebrow">结局已定</p><p className="ending-number">{String(seenEndings.length).padStart(2, "0")} / {String(Object.keys(endings).length).padStart(2, "0")}</p><h1 id="ending-title">{ending.name}</h1>
    <p className="epitaph">“{ending.epitaph}”</p><p className="ending-text">{endingText}</p>
    <button className="primary-button" onClick={onReplay}>以此身份重入蛊墓</button><button className="quiet-button" onClick={onChangeRole}>更换修士</button><button className="quiet-button" onClick={onMenu}>返回主界面</button>
    <p className="gallery">本次会话已见：{seenEndings.map((id) => endings[id].name).join("、") || "无"}</p>
  </section></main>;
}
