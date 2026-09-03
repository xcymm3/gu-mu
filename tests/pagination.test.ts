import assert from "node:assert/strict";
import test from "node:test";
import { paginateNarrative, frameAtAnchor, pageAtOffset } from "../lib/xue-gu-yin/pagination.ts";
import { chooseRole, resolveScenePresentation, scenes } from "../lib/xue-gu-yin/game.ts";
import { createSaveSlot, isSaveSlot, restoreSaveSlot } from "../lib/xue-gu-yin/save.ts";
import { gateEvents } from "../lib/xue-gu-yin/story/events/act1.ts";

test("空页容得下的完整句子不在逗号或分号处分开", () => {
  const first = "前面是一道石门。";
  const second = "古老阴森的石门前，稀稀落落站着六名气息各异的散修。";
  const pages = paginateNarrative(first + second, (text) => text.length <= second.length);
  assert.deepEqual(pages.map((page) => page.text), [first, second]);
  assert.ok(pages.every((page) => !page.forced));
  assert.equal(paginateNarrative("他没有回头；你也没有出声。").length, 1);
});

test("保留作者段落并且一页最多两个句子，允许留白", () => {
  assert.deepEqual(paginateNarrative("雨停了。门开了。灯灭了。\n\n你迈入墓门。\f身后传来脚步。").map((page) => page.text), ["雨停了。门开了。", "灯灭了。", "你迈入墓门。", "身后传来脚步。"]);
  const event = gateEvents.find((event) => event.type === "narration")!;
  assert.ok(event.type === "narration");
  const text = event.text;
  const pages = paginateNarrative(text, (text) => text.length <= 52);
  assert.equal(pages[0].text, "黑风呼啸，暴雨倾盆。荒原上的蛊市早已散尽，空气中弥漫着刺骨的寒意与微弱的腥臭。");
  assert.ok(pages.some((page) => page.text.includes("古老阴森的石门前，稀稀落落站着六名气息各异的散修。")));
  assert.ok(pages.every((page) => !page.text.endsWith("，")));
});

test("引号、括号、连续标点与省略号不会变成孤立页面", () => {
  for (const text of ["他低声道：“停！不要进去。”\n\n雨声骤然消失。", "灯灭了（真的灭了！）。门开了？！你停住……", "她问：「你听到了吗？」", "“走！”他说，别回头。", "版本 1.2，气血 3.5。Go now! Stop?"]) {
    const pages = paginateNarrative(text, (text) => text.length <= 22);
    assert.equal(pages.map((page) => page.text).join("").replace(/\s/g, ""), text.replace(/\s/g, ""));
    assert.ok(pages.every((page) => !/^[”’」』）】》。，！？；，]/u.test(page.text)));
  }
});

test("超长单句才依次按分号、逗号和字素保底，无损且不拆 emoji", () => {
  const text = "你站在石门前，听见墓中传来声音；随后四周陷入黑暗，你攥紧掌中旧玉。";
  const pages = paginateNarrative(text, (text) => text.length <= 16);
  assert.equal(pages.map((page) => page.text).join(""), text);
  assert.ok(pages.every((page) => page.forced && page.text.length <= 16));
  const unicode = "家👨‍👩‍👧‍👦人正在等你é回来。";
  const graphemes = (value: string) => [...new Intl.Segmenter("zh", { granularity: "grapheme" }).segment(value)].length;
  const split = paginateNarrative(unicode, (value) => graphemes(value) <= 3);
  assert.equal(split.map((page) => page.text).join(""), unicode);
  assert.ok(split.some((page) => page.text.includes("👨‍👩‍👧‍👦")));
  assert.ok(split.some((page) => page.text.includes("é")));
  assert.ok(split.every((page) => !/^[。，！？]/u.test(page.text)));
  assert.equal(paginateNarrative("字。", () => false).map((page) => page.text).join(""), "字。");
  assert.deepEqual(paginateNarrative(" \n\n "), []);
});

test("所有剧情与选项结果在不同模拟容量下无丢字、重字和无理由断句", () => {
  let checked = 0;
  for (const role of ["healer", "swordsman", "heir"] as const) {
    for (const scene of Object.values(scenes)) {
      const presentation = resolveScenePresentation({ ...chooseRole(role), sceneId: scene.id }, scene);
      const texts = [...presentation.beats.map((beat) => beat.text), ...presentation.choices.map((choice) => choice.result ?? "")];
      for (const text of texts) for (const capacity of [32, 52, 64, 100, 160]) {
        const pages = paginateNarrative(text, (part) => part.length <= capacity);
        assert.equal(pages.map((page) => page.text).join("").replace(/\s/g, ""), text.replace(/\s/g, ""), `${scene.id}: text conservation`);
        for (const page of pages) {
          assert.equal(page.text, text.slice(page.start, page.end));
          if (/[，；]$/u.test(page.text)) assert.equal(page.forced, true, `${scene.id}: mid-sentence split`);
        }
        checked++;
      }
    }
  }
  assert.ok(checked > 1000);
});

test("阅读锚点在重排及存读档后仍定位原文，非法锚点被拒绝", () => {
  const text = "雨停了。石门前，六人一言不发。灯灭了。";
  const small = paginateNarrative(text, (value) => value.length <= 13);
  const offset = small[1].start;
  const wide = paginateNarrative(text);
  assert.ok(wide[pageAtOffset(wide, offset)].text.includes(small[1].text));
  const frames = wide.map((page) => ({ ...page, beatIndex: 2 }));
  assert.equal(frameAtAnchor(frames, { beatIndex: 2, offset }), pageAtOffset(wide, offset));
  assert.equal(frameAtAnchor(frames), 0);
  assert.equal(frameAtAnchor(frames, { beatIndex: 99, offset: 99999 }), frames.length - 1);
  const narrative = { sceneId: "gate", page: 1, anchor: { beatIndex: 2, offset } };
  const slot = createSaveSlot({ game: chooseRole(), narrative });
  assert.equal(isSaveSlot(JSON.parse(JSON.stringify(slot))), true);
  assert.deepEqual(restoreSaveSlot(slot).narrative, narrative);
  for (const anchor of [null, { beatIndex: -1, offset: 0 }, { beatIndex: 0, offset: NaN }, { beatIndex: 1 }]) {
    assert.equal(isSaveSlot({ ...slot, narrative: { ...narrative, anchor } }), false);
  }
});
