# 《血蛊引》两小时受控改进 Loop 交付记录

交付日期：2026-08-29

工作分支：`automation/art-playtest-loop`

任务状态：`GM2H-000` 至 `GM2H-006` 全部完成

## 覆盖范围

- 四条正式路线均通过真实 Chromium 页面动作通关；覆盖游方蛊医、流浪剑修、世家之子的有效差异。
- 覆盖九个登记结局、赵黎线三场关键战斗的胜败与读档恢复、苏衍身份限制、固定随机结果和困墓公开选择。
- 覆盖主菜单、身份选择、正文推进、选项、战斗、历史、设置、手动存档、快速存档、读取与结局。
- 浏览器夹具把页面错误、`console.error`、失败资源请求、HTTP 4xx/5xx 和全局溢出作为失败；本次最终门禁未触发这些错误。
- Node 合同覆盖路线连通、剧情连续性、战斗结算、存档校验、资源预算、音频回退、移动横屏和 Android 外壳。

## 命令证据

| 命令 | 结果 |
| --- | --- |
| `pnpm install --frozen-lockfile --prefer-offline` | 退出码 0；451 个锁文件条目通过供应链策略 |
| `pnpm test:e2e:run`（第一次独立复验） | 退出码 0；11/11 Chromium，通过，5.3 分钟 |
| `pnpm test:e2e:run`（第二次独立复验） | 退出码 0；11/11 Chromium，通过，3.5 分钟 |
| `pnpm verify` | 退出码 0；92/92 Node、ESLint、TypeScript、生产构建、11/11 Chromium，通过 |
| `pnpm audit --prod --registry=https://registry.npmjs.org` | 退出码 0；`No known vulnerabilities found` |
| `pnpm why nanoid` | Next.js／Tailwind 两条 PostCSS 路径均解析为 `nanoid@3.3.18` |

生产构建由最终 `pnpm verify` 内的 `next build` 执行，Next.js 16.3.0 成功生成 `/`、`/_not-found` 与 `/icon.svg` 静态页面。

## 视觉证据

可复现截图位于 `tests/e2e/visual-baselines/`：

- `01-main-menu-1366x768.png` 至 `11-ending-1366x768.png` 覆盖全部关键界面类型；
- `main-menu-boundary-1280x720.png`、`dialogue-boundary-1280x720.png`；
- `main-menu-boundary-1920x1080.png`、`dialogue-boundary-1920x1080.png`；
- `portrait-rotation-prompt-390x844.png`；
- `landscape-main-menu-844x390.png`、`landscape-dialogue-844x390.png`。

本轮逐张目视复核 18 张截图，未发现已知遮挡、裁切、文字溢出、焦点层级或风格统一性阻断。

## 剩余风险与非阻断事项

- 当前立绘与背景是第一版正式资源，部分表情仍复用基础立绘；不会阻断路线、战斗或存读档。
- 当前音频为仓库内原创合成母带，尚未进行真人乐器与 Foley 录音混音；加载失败已有合成回退。
- 自动浏览器回归以 Chromium 为发布门禁，未在本轮扩展 Firefox、WebKit 或真实 Android 设备矩阵。
- `browser-act` 本机入口因 `uv trampoline failed to canonicalize script path` 无法加载；本轮使用仓库锁定的 Playwright Chromium 完成真实浏览器验收，此环境工具故障不影响游戏构建和运行。
- 本轮未部署、发布或合并 `master`；公网域名与 Vercel 部署后冒烟仍属于实际发布步骤。

截至本次交付，没有已知阻断构建、自动试玩、关键存读档、战斗路径、目标视口或生产依赖审计的问题。
