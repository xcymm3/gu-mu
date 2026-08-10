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
const inkSceneIds = new Set(["entrance", "bloodDoor", "corpseFight", "well", "shell", "bloodTrap", "bloodHall", "zhaoDuel", "zhaoDeath", "lastGate", "bloodRage", "bloodExit"]);
const names = new Set(["宁素衣", "陆照野", "顾微尘", "乔无咎", "沈青萝", "赵黎", "贾贵", "沈砚"]);
const criticalTerms = new Set(["血流蛊", "五转", "血祭", "血针", "尸灯傀儡", "命丧蛊墓"]);

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

export function GuTombGame() {
  const [game, setGame] = useState<GameState>(initialGame);
  const [seenEndings, setSeenEndings] = useState<string[]>([]);
  const [narrative, setNarrative] = useState({ sceneId: "entrance", page: 0 });
  const [inkPage, setInkPage] = useState<InkPage | null>(null);
  const [readingBox, setReadingBox] = useState({ width: 340, height: 280 });
  const inkStory = useRef<Story | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const role = getRole(game.roleId);
  const scene = scenes[game.sceneId];

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

  if (!role) return <RoleSelect onSelect={selectRole} />;
  if (game.endingId) return <EndingScreen game={game} seenEndings={seenEndings} onReplay={() => selectRole(role.id)} onChangeRole={() => setGame(initialGame())} />;
  if (!scene) return null;

  const battle = game.battle;
  const isInkScene = inkSceneIds.has(scene.id) && inkPage !== null;
  const sourceText = scene.id === "shenCare" ? shenCareText(role.gender) : isInkScene ? inkPage.text : scene.paragraphs[0];
  const fittedPages = splitForViewport(sourceText, readingBox);
  const pageCount = fittedPages.length;
  const narrativePage = narrative.sceneId === scene.id ? narrative.page : 0;
  const pageIndex = Math.min(narrativePage, pageCount - 1);
  const isLastNarrativePage = pageIndex === pageCount - 1;
  const narrativeParts: string[] = [fittedPages[pageIndex], !isInkScene ? scenePageNotes[scene.id]?.[pageIndex] : undefined].filter((part): part is string => Boolean(part));
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

function RoleSelect({ onSelect }: { onSelect: (id: RoleId) => void }) {
  return <main className="game-shell role-select"><section className="game-frame opening-card" aria-labelledby="game-title">
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

function EndingScreen({ game, seenEndings, onReplay, onChangeRole }: { game: GameState; seenEndings: string[]; onReplay: () => void; onChangeRole: () => void }) {
  const ending = game.endingId ? endings[game.endingId] : null;
  if (!ending) return null;
  const endingText = readInkKnot(`ending_${ending.id}`) || ending.text;
  return <main className="game-shell"><section className="game-frame ending-card" aria-labelledby="ending-title">
    <p className="eyebrow">结局已定</p><p className="ending-number">{String(seenEndings.length).padStart(2, "0")} / {String(Object.keys(endings).length).padStart(2, "0")}</p><h1 id="ending-title">{ending.name}</h1>
    <p className="epitaph">“{ending.epitaph}”</p><p className="ending-text">{endingText}</p>
    <button className="primary-button" onClick={onReplay}>以此身份重入蛊墓</button><button className="quiet-button" onClick={onChangeRole}>更换修士</button>
    <p className="gallery">本次会话已见：{seenEndings.map((id) => endings[id].name).join("、") || "无"}</p>
  </section></main>;
}
