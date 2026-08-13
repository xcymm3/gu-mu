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
  sceneText,
  scenes,
  storyMeta,
  storyPresentation,
  startBattle,
  type Choice,
  type GameState,
  type GuAction,
  type RoleId,
} from "@/lib/gu-tomb/game";

function roleGuActions(roleId: RoleId, flags: string[]): { id: GuAction; name: string; description: string }[] {
  const blood = flags.includes("血刃蛊")
    ? { id: "blood" as const, name: "血刃蛊", description: "血煞凝锋，伤害翻倍。消耗 1 真元。" }
    : { id: "blood" as const, name: "月光蛊", description: "以月光凝作锋刃，直取近处敌手。消耗 1 真元。" };
  switch (roleId) {
    case "healer": return [blood, { id: "heal" as const, name: "回春蛊", description: "运蛊疗愈，恢复 7 点生命。消耗 2 真元。" }];
    case "swordsman": return [blood, { id: "sword" as const, name: "剑鸣蛊", description: "先伤己 2 点，再以蛊御剑重创敌人 10 点。消耗 4 真元。" }];
    case "heir": return [blood, { id: "charm" as const, name: "惑心蛊", description: "造成攻击伤害并使敌人本回合行动无效。消耗 3 真元。" }];
  }
}
const names = new Set(storyPresentation.names);
const criticalTerms = new Set(storyPresentation.criticalTerms);
const endingStorageKey = "xue-gu-yin-unlocked-endings-v1";
const motionStorageKey = "gu-tomb-reduce-motion";
const themeStorageKey = "gu-tomb-theme";
const saveStorageKey = "xue-gu-yin-save-slots-v2";
const saveSlotCount = 6;
const endingRoleAccess: Record<RoleId, string[]> = { healer: Object.keys(endings), swordsman: Object.keys(endings), heir: Object.keys(endings) };
type HomeView = "menu" | "roles" | "archive" | "saves" | "settings";
type ThemePreference = "system" | "light" | "dark";
type BattleFeedback = { result: string; nextCue?: string; enemyCondition: string; hasEnded: boolean; emphasis?: "danger" | "success" };
type SaveSlot = { version: 2; savedAt: string; game: GameState; narrative: { sceneId: string; page: number } };
type SaveSlots = Array<SaveSlot | null>;

function emptySaveSlots(): SaveSlots { return Array.from({ length: saveSlotCount }, () => null); }

function isSaveSlot(value: unknown): value is SaveSlot {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SaveSlot>;
  return candidate.version === 2 && typeof candidate.savedAt === "string" && Boolean(candidate.game && typeof candidate.game === "object") && Boolean(candidate.narrative && typeof candidate.narrative === "object");
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
    const pieces = paragraph.split(/(赵黎|纪清寒|薛逢|苏莹|乔无咎|苏衍|血魔蛊|月光蛊|血刃蛊|血甲蛊|五转|血祭|祖传旧玉)/g);
    return <p key={paragraphIndex}>{pieces.map((piece, pieceIndex) => names.has(piece) ? <strong className="story-name" key={pieceIndex}>{piece}</strong> : criticalTerms.has(piece) ? <span className="story-critical" key={pieceIndex}>{piece}</span> : piece)}</p>;
  })}</>;
}

function describeBattleTurn(before: GameState, after: GameState, action: GuAction): BattleFeedback {
  const battle = before.battle;
  if (!battle) return { result: "蛊息渐歇，墓道里只余摇晃的灯火。", enemyCondition: "不明", hasEnded: false };
  const enemyName = battle.enemyName;
  const actionText: Record<GuAction, string> = {
    blood: before.flags.includes("血刃蛊")
      ? `你催动血刃蛊，血煞翻倍凝锋，一线血色直贯${enemyName}。`
      : `你催动月光蛊，月白一线凝作锋芒，斩向${enemyName}。`,
    blooddemon: `血魔蛊自掌心跃出，猩红一线既撕开${enemyName}，又牵回一缕血气反哺你的经脉。`,
    armor: before.flags.includes("血甲蛊")
      ? "血甲蛊贴身而起，血色甲纹覆满周身，硬生生挡下这一击。"
      : "甲衣蛊贴身而起，细密甲纹沿经脉铺开，迎向逼近的阴影。",
    rest: "你收束纷乱真元，强行压下翻涌的气血，趁片刻空隙调息回气。",
    heal: `你催动回春蛊，温润的蛊息沿经脉浸润伤处，七分痛楚化作三分热意。`,
    sword: `你咬破舌尖逼出剑鸣蛊，胸前先绽开一道血口——剑蛊借血气长鸣，化作一线寒光直贯${enemyName}。`,
    charm: `惑心蛊如烟渗出，${enemyName}瞳孔一滞，挥到半途的攻势僵在半空。`,
  };
  const nextBattle = after.battle;
  if (!nextBattle || after.sceneId !== before.sceneId) return {
    result: after.sceneId === battle.defeatNext
      ? battle.intent.reflect && action !== "armor"
        ? `${actionText[action]}血幕却将你的蛊力原样倒卷而回。你胸口如受重锤，分明是被自己的攻势反弹所伤，眼前顿时一黑。`
        : `${actionText[action]}${enemyName}的攻势随后压下。你再也压不住翻涌的气血，只能在墓室中踉跄倒下。`
      : `${actionText[action]}${enemyName}的躯壳猛地一滞，随后在昏暗灯火中崩裂倒下，再没有余力还击。`,
    enemyCondition: after.sceneId === battle.defeatNext ? "你已落败" : "已伏诛",
    hasEnded: true,
    emphasis: after.sceneId === battle.defeatNext ? "danger" : "success",
  };
  const immune = false;
  const defended = action === "armor";
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
    ? action === "armor"
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
  const [narrative, setNarrative] = useState({ sceneId: "gate", page: 0 });
  const [readingBox, setReadingBox] = useState({ width: 340, height: 280 });
  const [pendingBattleState, setPendingBattleState] = useState<GameState | null>(null);
  const [battleFeedback, setBattleFeedback] = useState<BattleFeedback | null>(null);
  const [pendingChoice, setPendingChoice] = useState<Choice | null>(null);
  const [showGameMenu, setShowGameMenu] = useState(false);
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

  function loadScene(sceneId: string) { setNarrative({ sceneId, page: 0 }); }

  function selectRole(id: RoleId) {
    loadScene("gate");
    setPendingBattleState(null);
    setBattleFeedback(null);
    setPendingChoice(null);
    setShowGameMenu(false);
    setGame(chooseRole(id));
  }

  function persistSaveSlots(nextSlots: SaveSlots) {
    setSaveSlots(nextSlots);
    window.localStorage.setItem(saveStorageKey, JSON.stringify(nextSlots));
  }

  function saveToSlot(index: number) {
    const stateToSave = pendingBattleState ?? game;
    const nextSlots = [...saveSlots];
    nextSlots[index] = {
      version: 2,
      savedAt: new Date().toISOString(),
      game: stateToSave,
      narrative: stateToSave.sceneId === game.sceneId ? narrative : { sceneId: stateToSave.sceneId, page: 0 },
    };
    persistSaveSlots(nextSlots);
  }

  function loadFromSlot(slot: SaveSlot) {
    const restored = { ...slot.game, battle: slot.game.battle ?? null, endingId: null };
    setPendingBattleState(null);
    setBattleFeedback(null);
    setPendingChoice(null);
    setShowGameMenu(false);
    setGame(restored);
    setNarrative(slot.narrative.sceneId === restored.sceneId ? slot.narrative : { sceneId: restored.sceneId, page: 0 });
  }

  function returnToMainMenu() {
    setPendingBattleState(null);
    setBattleFeedback(null);
    setPendingChoice(null);
    setShowGameMenu(false);
    setGame(initialGame());
    setHomeView("menu");
  }
  function applyAndAdvance(choice: Choice) {
    const next = applyChoice(game, choice);
    if (next.sceneId !== "ending") {
      loadScene(next.sceneId);
      setGame(next);
      return;
    }
    const endingId = resolveEnding(next);
    setSeenEndings((seen) => seen.includes(endingId) ? seen : [...seen, endingId]);
    setGame({ ...next, endingId });
  }
  function selectChoice(choice: Choice) {
    if (choice.result) {
      setPendingChoice(choice);
      return;
    }
    applyAndAdvance(choice);
  }
  function confirmChoice() {
    if (!pendingChoice) return;
    const choice = pendingChoice;
    setPendingChoice(null);
    applyAndAdvance(choice);
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
    if (pendingBattleState.sceneId === "ending") {
      const endingId = resolveEnding(pendingBattleState);
      setSeenEndings((seen) => seen.includes(endingId) ? seen : [...seen, endingId]);
      setGame({ ...pendingBattleState, endingId });
      setPendingBattleState(null);
      setBattleFeedback(null);
      return;
    }
    if (pendingBattleState.sceneId !== game.sceneId) loadScene(pendingBattleState.sceneId);
    setGame(pendingBattleState);
    setPendingBattleState(null);
    setBattleFeedback(null);
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
  const sourceText = sceneText(game, scene);
  const fittedPages = splitForViewport(sourceText, readingBox);
  const pageCount = fittedPages.length;
  const narrativePage = narrative.sceneId === scene.id ? narrative.page : 0;
  const pageIndex = Math.min(narrativePage, pageCount - 1);
  const isLastNarrativePage = pageIndex === pageCount - 1;
  const narrativeParts: string[] = [fittedPages[pageIndex]];
  const visibleChoices = (scene.choices ?? []).filter((choice) => canChoose(game, choice));
  return (
    <main className="game-shell">
      <section className={`game-frame story-frame${battle ? " is-battling" : ""}`} aria-label="血蛊引游戏界面">
        {battle ? <BattlePanel battleFeedback={battleFeedback} game={game} onAction={handleBattle} onContinue={continueBattle} onOpenMenu={() => setShowGameMenu(true)} /> : <>
          <header className="status-bar">
            <div><span>修士</span><strong>{role.name}</strong></div>
            <div className="health-stat"><span>命</span><strong>{game.health}/{game.maxHealth}</strong><i style={{ width: `${(game.health / game.maxHealth) * 100}%` }} /></div>
            <button className="game-menu-trigger" type="button" aria-expanded={showGameMenu} aria-label="打开游戏菜单" onClick={() => setShowGameMenu(true)}>菜单</button>
          </header>
          {pendingChoice ? <>
          <section className="scene" aria-live="polite">
            <p className="eyebrow">抉择已定</p>
            <div className="scene-copy" ref={copyRef}><NarrativePage text={pendingChoice.result ?? ""} /></div>
          </section>
          <div className="choice-panel"><button className="primary-button" onClick={confirmChoice}>继续</button></div>
          </> : <>
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
              ? <button className="primary-button" key={choice.id}>继续</button>
              : <button className="choice-button" key={choice.id} onClick={() => selectChoice(choice)}><span>{choice.label}</span></button>)}
          </nav>
          ) : null}
          </>}
        </>}
        {showGameMenu ? <GameMenu onClose={() => setShowGameMenu(false)} onLoad={loadFromSlot} onMenu={returnToMainMenu} onSave={saveToSlot} saveSlots={saveSlots} /> : null}
      </section>
    </main>
  );
}

function MainMenu({ onArchive, onSaves, onSettings, onStart, saveSlots, unlockedCount }: { onArchive: () => void; onSaves: () => void; onSettings: () => void; onStart: () => void; saveSlots: SaveSlots; unlockedCount: number }) {
  const saveCount = saveSlots.filter(Boolean).length;
  return <main className="game-shell menu-shell"><section className="game-frame main-menu" aria-labelledby="menu-title">
      <header className="menu-intro"><div className="menu-title-row"><GuTombMark className="gu-tomb-mark" /><div><p className="eyebrow">{storyMeta.subtitle}</p><h1 id="menu-title">{storyMeta.title}</h1></div></div><p>一座蛊墓，五名四转修士。大雾落下时，你抓住谁的手，就会走向不同的血路。</p></header>
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
    <p className="eyebrow">固定剧本 · 多结局 · 蛊斗</p><h1 id="game-title">{storyMeta.title}</h1>
    <p className="opening-copy">夜雨入墓，五人同行。大雾落下时，你只能抓住一只手。</p>
    <div className="role-list" aria-label="选择角色">{roles.map((candidate) => <button className="role-card" key={candidate.id} onClick={() => onSelect(candidate.id)}>
      <span className="role-title">{candidate.title}</span><strong>{candidate.name}</strong><span>{candidate.description}</span>
      <small>命数 {candidate.maxHealth} · 真元 {candidate.maxEssence} · 攻势 {candidate.attack} · 神识 {candidate.sense === "high" ? "高" : "中"}</small><em>擅用：{candidate.signatureGu}</em>
    </button>)}</div>
  </section></main>;
}

function BattlePanel({ battleFeedback, game, onAction, onContinue, onOpenMenu }: { battleFeedback: BattleFeedback | null; game: GameState; onAction: (action: GuAction) => void; onContinue: () => void; onOpenMenu: () => void }) {
  const battle = game.battle;
  const role = getRole(game.roleId);
  const [showHelp, setShowHelp] = useState(false);
  if (!battle || !role) return null;
  const defenseAction = game.flags.includes("血甲蛊")
    ? { id: "armor" as const, name: "血甲蛊", description: "蛊甲覆身，抵挡本回合全部伤害。消耗 1 真元。" }
    : { id: "armor" as const, name: "甲衣蛊", description: "蛊甲覆身，减轻本回合伤害。消耗 1 真元。" };
  const attackAction = roleGuActions(game.roleId!, game.flags);
  const bloodDemonAction = game.flags.includes("血魔蛊")
    ? [{ id: "blooddemon" as const, name: "血魔蛊", description: "造成 6 点伤害，并恢复 6 点生命。消耗 2 真元。" }]
    : [];
  const guActions: { id: GuAction; name: string; description: string }[] = game.essence === 0
    ? [{ id: "rest" as const, name: "调息", description: "本回合不出手，恢复 3 点真元。" }]
    : [...attackAction, defenseAction, ...bloodDemonAction];
  const actionCosts: Record<GuAction, number> = { blood: 1, armor: 1, blooddemon: 2, rest: 0, heal: 2, sword: 4, charm: 3 };
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
      <p>月光蛊与甲衣蛊各消耗 1 真元；夺得血刃蛊或血甲蛊后，它们会替换初始蛊。真元归零时只能调息一回合，恢复 3 点真元，敌人仍会行动。</p>
      <p>敌人的异样动作只是征兆，不会直接告诉你下一击是什么。留意其姿态、气息与周围变化。</p>
    </section></div> : null}
  </section>;
}

function EndingScreen({ game, seenEndings, onReplay, onChangeRole, onMenu }: { game: GameState; seenEndings: string[]; onReplay: () => void; onChangeRole: () => void; onMenu: () => void }) {
  const ending = game.endingId ? endings[game.endingId] : null;
  if (!ending) return null;
  const endingText = ending.text;
  return <main className="game-shell"><section className="game-frame ending-card" aria-labelledby="ending-title">
    <p className="eyebrow">结局已定</p><p className="ending-number">{String(seenEndings.length).padStart(2, "0")} / {String(Object.keys(endings).length).padStart(2, "0")}</p><h1 id="ending-title">{ending.name}</h1>
    <p className="epitaph">“{ending.epitaph}”</p><p className="ending-text">{endingText}</p>
    <button className="primary-button" onClick={onReplay}>重入蛊墓</button><button className="quiet-button" onClick={onChangeRole}>重新开始</button><button className="quiet-button" onClick={onMenu}>返回主界面</button>
    <p className="gallery">本次会话已见：{seenEndings.map((id) => endings[id].name).join("、") || "无"}</p>
  </section></main>;
}
