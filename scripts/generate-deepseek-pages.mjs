import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, resolve } from "node:path";

const [sceneId, pagesArg, briefFile] = process.argv.slice(2);
const maxPages = Number(pagesArg);
if (!sceneId || !Number.isInteger(maxPages) || maxPages < 1 || maxPages > 8 || !briefFile) throw new Error("用法：pnpm generate:story <场景id> <最大页数1-8> <剧情简述文件>");

async function getKey() {
  if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY;
  const key = (await readFile(resolve(homedir(), "Desktop", "工作计划.txt"), "utf8")).match(/sk-[A-Za-z0-9_-]+/i)?.[0];
  if (!key) throw new Error("未找到 DeepSeek API 密钥；请设置 DEEPSEEK_API_KEY。");
  return key;
}

function textFromResponse(raw) {
  let value = raw.trim().replace(/^<think>[\s\S]*?<\/think>\s*/i, "");
  const fence = new RegExp("^" + String.fromCharCode(96).repeat(3) + "(?:json)?\\s*([\\s\\S]*?)\\s*" + String.fromCharCode(96).repeat(3) + "$", "i");
  const fenced = value.match(fence);
  if (fenced) value = fenced[1].trim();
  if (!value.startsWith("{") || !value.endsWith("}")) throw new Error("JSON 被截断或含有额外文本");
  const parsed = JSON.parse(value);
  if (Object.keys(parsed).length !== 1 || typeof parsed.text !== "string") throw new Error("响应结构不是唯一的 text 字段");
  const text = parsed.text.trim();
  if (/<think|<\/think|分析过程|思考过程/i.test(text)) throw new Error("正文含非叙事标记");
  return text;
}

function paginate(text, limit) {
  if (text.length < 1000 || text.length > 2000 || text.length > limit * 500) throw new Error("正文长度 " + text.length + "，不在 1000–2000 字符范围内");
  const count = Math.ceil(text.length / 500);
  if (count > limit) throw new Error("分页后超过最大页数");
  const pages = [];
  let rest = text;
  for (let page = 0; page < count; page += 1) {
    if (page === count - 1) { pages.push(rest); break; }
    const target = Math.round(rest.length / (count - page));
    let cut = target;
    for (let i = Math.min(rest.length - 1, 500, target + 80); i >= Math.max(250, target - 80); i -= 1) {
      if ("。！？；".includes(rest[i])) { cut = i + 1; break; }
    }
    pages.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (pages.some((page) => page.length < 250 || page.length > 500)) throw new Error("本地分页后存在不合格页面");
  return pages;
}

async function requestScene(key, brief, priorError) {
  const prompt = [
    "你是固定剧本仙侠游戏《蛊墓五修》的中文主笔。",
    '只输出完整合法 JSON：{"text":"正文"}。除 JSON 外禁止输出任何字符。',
    "禁止思考过程、分析、Markdown、标题、选项、属性和规则提示。",
    "正文必须原创、阴冷、克制，不模仿任何具体作者。",
    "请写一个完整、可衔接分支的场景，长度严格为 1000 到 2000 个中文字符。",
    "剧情简述：" + brief,
    "上次校验失败原因：" + priorError + "。请严格修正。",
  ].join("\n");
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "deepseek-chat", temperature: 0.7, max_tokens: 5000, response_format: { type: "json_object" }, messages: [{ role: "system", content: "只输出完整合法 JSON，绝不输出思考过程。" }, { role: "user", content: prompt }] }),
  });
  if (!response.ok) throw new Error("DeepSeek API " + response.status);
  const raw = (await response.json())?.choices?.[0]?.message?.content;
  if (typeof raw !== "string") throw new Error("API 未返回 content");
  return textFromResponse(raw);
}

const key = await getKey();
const brief = await readFile(resolve(briefFile), "utf8");
let lastError = "首次生成";
let pages;
for (let attempt = 1; attempt <= 4; attempt += 1) {
  try { pages = paginate(await requestScene(key, brief, lastError), maxPages); break; }
  catch (error) { lastError = error instanceof Error ? error.message : "未知错误"; }
}
if (!pages) throw new Error("完整场景连续 4 次未通过校验：" + lastError);
const output = resolve("stories", "generated", sceneId + ".json");
await mkdir(dirname(output), { recursive: true });
await writeFile(output, JSON.stringify({ sceneId, pages }, null, 2), "utf8");
console.log("已生成 " + pages.length + " 页：" + output + "；API 密钥未写入任何文件。");
