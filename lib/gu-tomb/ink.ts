import { Story } from "inkjs";

import compiledStory from "./gu-tomb.ink.generated.ts";

export type InkChoice = { id: string; label: string };
export type InkPage = { text: string; choices: InkChoice[] };

const choiceIds: Record<string, string> = {
  "继续": "continue",
  "先察看墓门上的蛊纹": "read",
  "相信乔家承诺，随乔无咎开门": "qiao",
  "不理会众人，独自先行勘探": "alone",
  "记下赵黎未曾掩饰的实力": "expose",
  "跟紧沈青萝，护住她的侧翼": "follow",
  "催促众人冲过墓道": "rush",
  "以真元护住沈青萝，下井查看": "save",
  "指出这是引魂蛊，强行离开": "break",
  "顺势请赵黎先探井口": "zhao-test",
  "留下玉牌与黑牙蛊作证": "keep",
  "焚掉空壳，不让它再骗人": "burn",
  "把真相摊开，与沈青萝、贾贵破阵": "truth",
  "趁乱夺取血流蛊": "seize",
  "放弃玉匣，先追乔无咎": "chase",
  "在蛊墓中失去最后一丝意识": "die",
  "踏破残阵，带人离开蛊墓": "leave",
  "以自身真元强断血祭": "break",
  "催动血流蛊，杀穿乔家血卫": "bloodflow",
  "踏出蛊墓，任由血流蛊随心跳苏醒": "leave-blood",
};

function choiceId(tags: string[]) {
  return tags.find((tag) => tag.startsWith("choice:"))?.slice("choice:".length);
}

function idForChoice(tags: string[] | null, text: string, index: number) {
  return choiceId(tags ?? []) ?? choiceIds[text.trim()] ?? String(index);
}

export function createInkStory(knot: string) {
  const story = new Story(compiledStory);
  story.ChoosePathString(knot);
  return story;
}

export function readInkPage(story: Story): InkPage {
  const text = story.ContinueMaximally().trim();
  const choices = story.currentChoices.map((choice) => ({
    id: idForChoice(choice.tags, choice.text, choice.index),
    label: choice.text.trim(),
  }));
  return { text, choices };
}

export function chooseInk(story: Story, id: string) {
  const choice = story.currentChoices.find((item) => idForChoice(item.tags, item.text, item.index) === id);
  if (!choice) throw new Error(`Ink choice not found: ${id}`);
  story.ChooseChoiceIndex(choice.index);
  return readInkPage(story);
}

export function readInkKnot(knot: string) {
  return readInkPage(createInkStory(knot)).text;
}
