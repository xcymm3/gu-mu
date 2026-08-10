"use client";

import { useEffect, useRef, useState } from "react";

import {
  applyChoice,
  canChoose,
  chooseRole,
  endings,
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
const endingRoleAccess: Record<RoleId, string[]> = {
  healer: ["trapped", "bloodflow", "wu", "true", "together", "death", "alone"],
  swordsman: ["trapped", "bloodflow", "cleansed", "wu", "true", "together", "death", "alone"],
  heir: ["trapped", "bloodflow", "traitor", "wu", "true", "together", "death", "alone"],
};
type HomeView = "menu" | "roles" | "archive" | "settings";

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

function shenCareText(gender: "female" | "male") {
  return gender === "female"
    ? "尸灯傀儡倒下后，墓道里安静得只余你压抑的呼吸。沈青萝收回藤蛊，目光在你染血的衣袖上停了片刻。她没有像贾贵那样急着翻找碎甲，也没有去看赵黎藏在阴影里的手，只从随身药囊中取出一只白玉瓶。\n\n“方才那一下，不必强撑。”她把玉瓶递来，声音仍冷，却放得很轻，“你我同为女修，最知道这荒原里旁人不会因你受伤便手下留情。丹药不多，留给需要的人。”\n\n墓道尽头的风带着潮气吹来。她没有催促，只等你自己决定，是否接下这份并不张扬的善意。"
    : "尸灯傀儡倒下后，墓道里安静得只余你压抑的呼吸。沈青萝收回藤蛊，目光在你染血的衣袖上停了片刻。她没有像贾贵那样急着翻找碎甲，也没有去看赵黎藏在阴影里的手，只从随身药囊中取出一只白玉瓶。\n\n“方才那一下，不必强撑。”她把玉瓶递来，语气清冷，“你若倒在下一道机关前，余下的人只会少一个帮手，不会多半分怜悯。这枚回元丹能稳住伤势，拿着。”\n\n墓道尽头的风带着潮气吹来。她没有催促，只等你自己决定，是否接下这份并不张扬的善意。";
}

function climaxText(sceneId: string, game: GameState) {
  if (sceneId === "lastGate") {
    if (game.flags.includes("赵黎已放逐")) return "伏尸暗格的界裂阵筹已经裂开，赵黎连同那股阴冷血气被卷入其中，连一声咒骂也未留下。乔无咎望着塌陷的侧洞，脸上的从容终于消失；他原想借邪修之手收尾，如今却只能亲自踏下祭台。\n\n血槽里的血气仍向石室中央汇去。没有赵黎的血瓶与秘法，沉睡的血流蛊迟迟不能真正苏醒。乔无咎抬手放出本命蛊，冷声说只要杀了你，乔家的血脉仍足够完成最后一步。此战之后，便只剩他与你。";
    const shenText = game.trust.shen >= 2
      ? "血卫的刀锋落下时，你替沈青萝挡住了机关最狠的一击。她没有退，青藤蛊反而缠上你的手腕，一缕温润生机灌入经脉。她与你并肩而立，你的命息也因此比先前更盛。"
      : "血卫的刀锋落下时，乔无咎暗藏的机关先一步发动。一枚细若发丝的血针穿过青藤蛊的缝隙，钉入沈青萝心口。她脸上的薄纱被劲风掀起半角，灯火映出一张本该冷艳如霜的面容；那双始终克制的眼睛却只在你身上停了一瞬，仿佛想说什么。\n\n青藤失去主人后仍徒劳地向前攀去，替她拦下第二道血光。她的身影在碎石与血火间缓缓倒下，袖中半枚沈砚玉牌滑落在地，发出极轻的一声脆响；随后，所有藤叶都被血焰吞没。";
    return `祭台入口刚刚合拢，乔无咎便抬手唤出一具披血重甲的血卫。贾贵惨叫一声，被血卫一掌拍进石壁，金壳碎裂，半点气息也不再露出。${shenText}\n\n乔无咎站在高台上笑道：“诸位替乔某走到这里，已是大功。余下的血，便由血卫来取。”血卫甲缝间的血光如潮起伏，远非先前机关可比；无论你愿不愿意，都只能先活过这一关。`;
  }
  if (sceneId === "bloodRage") {
    const guardText = game.flags.includes("血卫独破") ? "你竟在血卫倒下前站稳了脚跟，连赵黎也微微眯起眼，像第一次真正看清你的底细。" : "你被血卫逼得跪倒在地，血从指缝间落进祭槽，连呼吸都像在替阵法续火。";
    const shenText = game.flags.includes("青萝并肩") ? "沈青萝将最后一枚灵丹弹入你口中，替你压住几近断裂的气血。" : "石阶上只余散落的藤叶，再无人替你挡住血气。";
    const jiaText = game.flags.includes("贾贵援手") ? "忽然，原本气绝的贾贵从碎甲下翻身而起；装死蛊脱壳成灰，他趁赵黎结印时一记黑刀刺入其肩背。" : "石壁边的贾贵仍一动不动，像是真的死在第一击下。";
    const zhaoText = game.flags.includes("赵黎犹疑") ? "赵黎看向你的目光有一瞬迟疑，手中血瓶并未立刻倾下。" : "赵黎根本没有看任何人，只把一只血瓶咬开，暗红液体尽数浇在玉匣上。";
    return `${guardText}\n\n赵黎终于从阴影里走出，仰头大笑：“哈哈哈，没想到真的是血流蛊！”他抬手便将残破血卫撕成两截，乔无咎在高台上怒喝，他却置若罔闻，径直以邪修秘法催动血瓶。${shenText}${jiaText}${zhaoText}\n\n血流蛊在匣中睁开无形的眼。若再无人阻止，祭台上的每一道血气都会成为赵黎的养料。`;
  }
  if (sceneId === "zhaoDuel") return "血瓶尽碎，赵黎周身血线与血流蛊相连。他不再伪装苍老散修，四转巅峰的威压压得石室不断崩裂。你身边若还有愿意出手的人，此刻就是最后的机会；一旦让他将血流蛊彻底炼入血脉，所有活人都会沦为祭料。";
  if (sceneId === "zhaoDeath") return game.flags.includes("乔无咎杀死你")
    ? "乔无咎的蛊刃穿过护体真元。你倒下时，血流蛊在未醒的玉匣中发出极轻的嘶鸣，随后被乔家血火重新吞没。墓门合拢，荒原再无人知道你曾到过这里。"
    : "赵黎的血线绕开护体蛊虫，先刺穿了最虚弱的经脉。他接住震颤的玉匣，笑道：“老夫原想留你一命，可血流蛊不喜欢旁人替它做主。”五转蛊初醒的第一口，吞掉了墓中最后的生机。";
  if (sceneId === "qiaoDuel") return game.flags.includes("赵黎遁走")
    ? "赵黎借血流蛊反噬遁入墓道深处，乔无咎却堵在出口之前。血流蛊已落入你手，他终于不再伪装家主的从容，亲自放出本命蛊。此人已无退路，你也没有。"
    : "赵黎倒在血流蛊反噬的血河里，乔无咎终于现身。他看着被你夺走的五转蛊，怒意几乎压碎祭台：“乔家等了数十年，岂能为几个祭品作嫁衣？”他亲自出手，誓要把血流蛊重新夺回。";
  if (sceneId === "qiaoCleanExit") return "乔无咎的本命蛊在石阶上裂成灰。没有赵黎的邪修秘法，血流蛊终究无法吞下足够血气；它在玉匣中挣扎片刻，背甲上的血纹一寸寸黯淡，最终化作一捧温热灰烬。\n\n墓门外的天光照进来时，你才意识到自己仍能听见风声。乔家的血祭断在这里，荒原上留下的只有一座空墓和一笔尚待清算的旧账。";
  return "";
}

function needleRestText(game: GameState) {
  const qiaoText = game.flags.includes("血针重伤")
    ? "乔无咎的声音自墓道上方缓缓传来：“诸位能活过来便好。乔某从未指望这点血针取谁性命，不过是让诸位在进主墓前多耗几分真元。如今看来，目的已经达到。”"
    : "乔无咎的声音自墓道上方缓缓传来：“诸位竟无人重伤，倒比乔某预想得更能撑。乔某从未指望这点血针取谁性命，只是想看看诸位的底子。”话音落下时，石壁后传来一声极轻的冷哼，像他对这个结果并不满意。";
  return `血针机关终于沉寂，墓道里只余断藤与碎壳。贾贵的金壳蛊裂开一道长缝，他却先摸出一盒止血膏；沈青萝衣袖被针风割破，仍在用藤丝替众人挑出嵌入皮肉的残针。\n\n${qiaoText}\n\n短暂歇息后便要再往前走。此时肯伸手的人未必可信，但若拒绝一切，也许撑不到下一个转角。`;
}

function bloodCardText(role: NonNullable<ReturnType<typeof getRole>>, game: GameState) {
  const roleText = role.id === "healer"
    ? "宁素衣的神识掠过阵纹，立刻察觉最亮的血牌下压着一道反向禁制；若贸然注入真元，传送终点绝不会是主墓室。"
    : role.id === "swordsman"
      ? game.trust.zhao < 2
        ? "陆照野按剑立在阵边，赵黎却在背后轻笑，袖中血线已悄然绕向阵心。你们之间积下的裂痕，终于到了无法遮掩的时候。"
        : "陆照野按剑立在阵边，赵黎看了你一眼，罕见地收起戏谑，只以血线替你稳住最躁动的一角阵纹。"
      : "顾微尘刚俯身查看血牌，乔无咎的传音便在耳畔响起。他许诺只要你替乔家以世家声望圆下这场事故，便可单独送你入主墓；其余人是否能活，全看你一句话。";
  return `针雨尽头是一条死路。墙上嵌着一座早已失效的传送阵，中央七面血牌暗淡无光。乔无咎忽然启动另一处机关，整座墓穴开始震颤，碎石自穹顶不断坠下。\n\n沈青萝扶住阵台，急声道：“此阵还能修，但需要有人替我稳住阵心！”${roleText}\n\n血牌逐一亮起，又逐一熄灭。留给你们的时间已经不多。`;
}

function teamGatherText(game: GameState) {
  const allTrusted = game.trust.shen >= 2 && game.trust.zhao >= 2 && game.trust.jia >= 2;
  return allTrusted
    ? "武意海伏诛后，密道里的血雾渐渐散去。沈青萝、赵黎与贾贵都没有离开；你们从武意海身上取到两把钥匙，其中一把正对应墓穴控制室的锁孔。赵黎低声说乔无咎还在等血祭，贾贵却难得没有先提报酬。此刻众人仍愿意把后背交给彼此，或许还能在乔家最后一次落锁前结束一切。"
    : "武意海伏诛后，赵黎望向血流蛊室的方向，神色重新变得幽深。他没有等你们救完剩下的人，便独自沿密道离去。待你带着幸存者赶到主墓室时，血瓶碎裂的声音已经响起——赵黎显然比任何人都更急着得到血流蛊。";
}

export function GuTombGame() {
  const [game, setGame] = useState<GameState>(initialGame);
  const [seenEndings, setSeenEndings] = useState<string[]>([]);
  const [homeView, setHomeView] = useState<HomeView>("menu");
  const [archiveRoleId, setArchiveRoleId] = useState<RoleId>("healer");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [narrative, setNarrative] = useState({ sceneId: "entrance", page: 0 });
  const [inkPage, setInkPage] = useState<InkPage | null>(null);
  const [readingBox, setReadingBox] = useState({ width: 340, height: 280 });
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
        setReduceMotion(window.localStorage.getItem(motionStorageKey) === "true");
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
    document.documentElement.dataset.reduceMotion = String(reduceMotion);
  }, [reduceMotion, seenEndings]);

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
    setGame(chooseRole(id));
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
    const next = resolveBattleTurn(game, action);
    if (next.sceneId !== game.sceneId) loadInkScene(next.sceneId);
    setGame(next);
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
    if (homeView === "settings") return <GameSettings onBack={() => setHomeView("menu")} onClearEndings={() => setSeenEndings([])} reduceMotion={reduceMotion} onToggleReduceMotion={() => setReduceMotion((current) => !current)} />;
    if (homeView === "menu") return <MainMenu onArchive={() => setHomeView("archive")} onSettings={() => setHomeView("settings")} onStart={() => setHomeView("roles")} unlockedCount={seenEndings.length} />;
    return <RoleSelect onBack={() => setHomeView("menu")} onSelect={selectRole} />;
  }
  if (game.endingId) return <EndingScreen game={game} seenEndings={seenEndings} onReplay={() => selectRole(role.id)} onChangeRole={() => { setGame(initialGame()); setHomeView("roles"); }} onMenu={() => { setGame(initialGame()); setHomeView("menu"); }} />;
  if (!scene) return null;

  const battle = game.battle;
  const isInkScene = inkSceneIds.has(scene.id) && inkPage !== null;
  const isDynamicClimaxScene = ["lastGate", "bloodRage", "zhaoDuel", "zhaoDeath", "qiaoDuel", "qiaoCleanExit"].includes(scene.id);
  const isDynamicNarrativeScene = isDynamicClimaxScene || ["needleRest", "bloodCardChange", "teamGather"].includes(scene.id);
  const sourceText = scene.id === "shenCare" ? shenCareText(role.gender) : scene.id === "needleRest" ? needleRestText(game) : scene.id === "bloodCardChange" ? bloodCardText(role, game) : scene.id === "teamGather" ? teamGatherText(game) : isDynamicClimaxScene ? climaxText(scene.id, game) : isInkScene ? inkPage.text : scene.paragraphs[0];
  const fittedPages = splitForViewport(sourceText, readingBox);
  const pageCount = fittedPages.length;
  const narrativePage = narrative.sceneId === scene.id ? narrative.page : 0;
  const pageIndex = Math.min(narrativePage, pageCount - 1);
  const isLastNarrativePage = pageIndex === pageCount - 1;
  const narrativeParts: string[] = [fittedPages[pageIndex], !isInkScene && !isDynamicNarrativeScene ? scenePageNotes[scene.id]?.[pageIndex] : undefined].filter((part): part is string => Boolean(part));
  const displayChoices: Choice[] = isInkScene
    ? inkPage.choices.map((inkChoice) => inkChoice.id === "continue" ? { id: "continue", label: inkChoice.label, next: scene.id } : scene.choices?.find((choice) => choice.id === inkChoice.id)).filter((choice): choice is Choice => Boolean(choice))
    : scene.choices ?? [];
  return (
    <main className="game-shell">
      <section className="game-frame story-frame" aria-label="蛊墓五修游戏界面">
        <header className="status-bar">
          <div><span>修士</span><strong>{role.name}</strong></div>
          <div className="health-stat"><span>命</span><strong>{game.health}/{game.maxHealth}</strong><i style={{ width: `${(game.health / game.maxHealth) * 100}%` }} /></div>
        </header>
        <section className="scene" aria-live="polite">
          <p className="eyebrow">{scene.chapter}</p>
          <h1>{scene.title}</h1>
          <div className="scene-copy" ref={copyRef}>{narrativeParts.map((paragraph) => <NarrativePage key={paragraph} text={paragraph} />)}</div>
          <p className="narrative-progress">{pageIndex + 1} / {pageCount}</p>
        </section>
        {!isLastNarrativePage ? <div className="choice-panel"><button className="primary-button" onClick={() => setNarrative({ sceneId: scene.id, page: Math.min(pageIndex + 1, pageCount - 1) })}>继续</button></div> : null}
        {isLastNarrativePage && scene.battle && !battle ? <div className="choice-panel"><button className="primary-button" onClick={() => setGame((current) => startBattle(current, scene))}>放出本命蛊</button></div> : null}
        {isLastNarrativePage && battle ? <BattlePanel game={game} onAction={handleBattle} /> : null}
        {isLastNarrativePage && scene.choices && !battle ? (
          <nav className="choice-panel" aria-label="剧情选项">
            {displayChoices.map((choice) => <button className="choice-button" disabled={!canChoose(game, choice)} key={choice.id} onClick={() => isInkScene ? selectInkChoice(choice.id) : selectChoice(choice)}><span>{isInkScene ? inkPage.choices.find((item) => item.id === choice.id)?.label ?? choice.label : choice.label}</span>{choice.note ? <small>{choice.note}</small> : null}</button>)}
          </nav>
        ) : null}
      </section>
    </main>
  );
}

function MainMenu({ onArchive, onSettings, onStart, unlockedCount }: { onArchive: () => void; onSettings: () => void; onStart: () => void; unlockedCount: number }) {
  return <main className="game-shell menu-shell"><section className="game-frame main-menu" aria-labelledby="menu-title">
    <header className="menu-intro"><p className="eyebrow">乔家荒原 · 五人入墓</p><h1 id="menu-title">蛊墓五修</h1><p>一座蛊墓，五名四转修士。你所见与所信，都会把人带向不同的墓门。</p></header>
    <nav className="menu-index" aria-label="主界面菜单">
      <button className="menu-action menu-action-primary" onClick={onStart}><span className="menu-action-number">壹</span><span><strong>开始游戏</strong><small>择一身份，重入蛊墓</small></span></button>
      <button className="menu-action" onClick={onArchive}><span className="menu-action-number">贰</span><span><strong>结局一览</strong><small>已解锁 {unlockedCount} / {Object.keys(endings).length}</small></span></button>
      <button className="menu-action" onClick={onSettings}><span className="menu-action-number">叁</span><span><strong>游戏设置</strong><small>阅读与记录</small></span></button>
    </nav>
    <p className="menu-note">每一次选择都会留下痕迹。</p>
  </section></main>;
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

function GameSettings({ onBack, onClearEndings, onToggleReduceMotion, reduceMotion }: { onBack: () => void; onClearEndings: () => void; onToggleReduceMotion: () => void; reduceMotion: boolean }) {
  const [confirmClear, setConfirmClear] = useState(false);
  function clearEndings() {
    if (!confirmClear) { setConfirmClear(true); return; }
    onClearEndings();
    setConfirmClear(false);
  }
  return <main className="game-shell settings-shell"><section className="game-frame settings-card" aria-labelledby="settings-title">
    <header className="menu-page-header"><button className="back-button" onClick={onBack}>返回</button><div><p className="eyebrow">行囊与灯火</p><h1 id="settings-title">游戏设置</h1></div></header>
    <div className="settings-list"><button aria-pressed={reduceMotion} className="settings-row" onClick={onToggleReduceMotion}><span><strong>减少动态</strong><small>剧情与按钮以更静止的方式呈现</small></span><em>{reduceMotion ? "已开启" : "跟随系统"}</em></button>
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
      <small>生命 {candidate.maxHealth} · 真元 {candidate.maxEssence} · 攻击 {candidate.attack} · 神识 {candidate.insight} · 声望 {candidate.reputation}</small><em>本命蛊：{candidate.signatureGu}</em>
    </button>)}</div>
  </section></main>;
}

function BattlePanel({ game, onAction }: { game: GameState; onAction: (action: GuAction) => void }) {
  const battle = game.battle;
  const role = getRole(game.roleId);
  const [showHelp, setShowHelp] = useState(false);
  if (!battle || !role) return null;
  const signatureAction = role.id === "healer"
    ? { id: "heal" as const, name: "回春蛊", description: "恢复 6 点生命。消耗 3 真元。" }
    : role.id === "swordsman"
      ? { id: "sword" as const, name: "剑鸣蛊", description: "造成 10 点伤害，自身受 1 点伤害。消耗 3 真元。" }
      : { id: "mind" as const, name: "惑心蛊", description: "打断本回合攻势，并造成等同攻击属性的伤害。消耗 3 真元。" };
  const defenseAction = game.flags.includes("血甲蛊已得")
    ? { id: "armor" as const, name: "四转 · 血甲蛊", description: "血甲覆身，能分担更重的来势。消耗 2 真元。" }
    : { id: "armor" as const, name: "甲衣蛊", description: "蛊甲覆身，硬受来势。消耗 2 真元。" };
  const guActions = game.essence === 0
    ? [{ id: "rest" as const, name: "调息", description: "本回合不出手，恢复 3 点真元。" }]
    : [...baseGuActions, defenseAction, signatureAction, ...(game.flags.includes("血流蛊已得") ? [{ id: "bloodflow" as const, name: "五转 · 血流蛊", description: "造成 16 点伤害，并恢复等量生命。" }] : [])];
  const actionCosts: Record<GuAction, number> = { blood: 1, armor: 2, mind: 3, heal: 3, sword: 3, bloodflow: 0, rest: 0 };
  const enemyCue = battle.intent === "撕咬"
    ? `${battle.enemyName}的身形微微前压，脚下碎石被碾出一串轻响。`
    : battle.intent === "毒雾"
      ? `一缕潮湿腥气自${battle.enemyName}周身漫开，连尸油灯的火光也跟着摇晃。`
      : `${battle.enemyName}忽然收住脚步，胸腹间传出沉闷的鼓动，四周像骤然安静下来。`;
  return <section className="battle-panel" aria-label="蛊斗">
    <div className="battle-heading"><div className="enemy-row"><span>{battle.enemyName}</span><strong>{battle.enemyHealth}/{battle.enemyMaxHealth}</strong></div><button className="battle-help-button" type="button" aria-label="查看蛊斗说明" onClick={() => setShowHelp(true)}>?</button></div>
    <p className="essence-stat">真元 <strong>{game.essence}/{role.maxEssence}</strong></p>
    <p className="intent-copy">{enemyCue}</p>
    <div className="gu-list">{guActions.map((action) => <button key={action.id} disabled={game.essence < actionCosts[action.id]} onClick={() => onAction(action.id)}><strong>{action.name}</strong><span>{action.description}</span></button>)}</div>
    {showHelp ? <div className="battle-help-backdrop" role="presentation" onClick={() => setShowHelp(false)}><section className="battle-help-dialog" role="dialog" aria-modal="true" aria-label="蛊斗说明" onClick={(event) => event.stopPropagation()}>
      <button className="battle-help-close" type="button" aria-label="关闭说明" onClick={() => setShowHelp(false)}>×</button><p className="eyebrow">蛊斗说明</p><h2>真元与回合</h2>
      <p>每一场蛊斗都会以真元全满开始。你先放出蛊虫；若敌人仍存活，才会还击。击杀敌人的那一击不会承受其反击。</p>
      <p>血刃蛊消耗 1 真元，甲衣蛊消耗 2 真元；第三只蛊随修士而变，消耗 3 真元。真元归零时只能调息一回合，恢复 3 点真元，敌人仍会行动。</p>
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
