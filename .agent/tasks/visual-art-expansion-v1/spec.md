# Task Spec: visual-art-expansion-v1

## Metadata
- Task ID: visual-art-expansion-v1
- Created: 2026-08-31T08:43:32+00:00
- Frozen: 2026-09-01T14:15:15+08:00
- Contract status: FROZEN
- Repo root: D:\mydoc\React\gu-mu-wu-xiu
- Working directory at init: D:\mydoc\React\gu-mu-wu-xiu
- Baseline commit: `eeb5812` (`chore: 添加 ImageGen 预检立绘`)
- Freeze revision: 5

## Guidance sources
- AGENTS.md
- `.codex/agents/task-spec-freezer.toml`
- `package.json`, `next.config.ts`, `playwright.config.ts`, `playwright.production.config.ts`
- `lib/xue-gu-yin/assets.ts`, `lib/xue-gu-yin/save.ts`
- `tests/e2e/full-routes.spec.ts`, `tests/e2e/global-setup.mjs`, `tests/e2e/static-server.mjs`

## Original task statement
在项目 D:\mydoc\React\gu-mu-wu-xiu 中完成可发布级的美术扩展与接入。任务不是完成固定数量的素材或子任务即停止；必须持续执行 proof loop，直到冻结规范中的全部验收标准均由新鲜独立验证器判定 PASS，并且结构化 proof validation 成功。每次迭代结束都必须保存可恢复检查点、criterion-level evidence 和必要的 raw outputs；不得使用低质量 CSS、SVG、Canvas、纯色块、截图或其他占位素材替代应由 ImageGen 生成的正式美术。

目标范围：
1. 为六名主要角色补充统一画风的表情、受伤和战斗立绘，保持身份、服饰、配色、轮廓与既有画风一致，并形成可核验的角色/状态资源矩阵。
2. 为九个结局和关键剧情节点补充正式 CG，建立剧情节点到资源的完整映射并验证实际展示。
3. 重做首页、设置页、存档页的美术表现，保持统一的古墓巫蛊暗黑国风视觉语言，并兼顾可读性、交互状态和性能。
4. 增加攻击、防御、特殊蛊和敌方攻击特效，验证触发、层级、时序、可读性与降级行为。
5. 完成资源压缩、代码接入，以及桌面和手机的布局与视觉验证；正式资源必须进入项目并由运行时代码真实引用，避免未引用资源、破损路径和明显拉伸/裁切。
6. 跑通四条路线、九个结局、存档/读档、战斗和 production build 冒烟；记录可复现命令、截图/日志/映射表等证据。

验收规范必须在 freeze 阶段把以上目标拆成明确的 AC1、AC2……，包含数量/矩阵、资源质量、代码接入、压缩阈值、桌面与手机视口、四路线九结局、存读档、战斗、production build、无占位素材等可检验条件。实现与修复阶段可以调用内置 ImageGen 生成正式位图资源；若 ImageGen 后续不可用，不得伪造替代品，应记录真实 blocker。所有 Git 提交必须遵守 Conventional Commits，摘要使用简体中文；只提交本任务相关改动，并在远程仓库可用时推送。ImageGen 启动前预检已通过，证据文件为 .agent/imagegen-preflight/ji-qinghan-test-battle-portrait.png，提交为 eeb5812。

## Frozen scope and terminology

- “正式美术”指由内置 ImageGen 生成、允许仅做裁切/缩放/透明通道清理/WebP 压缩的最终位图；CSS 渐变、CSS 图形、SVG、Canvas、纯色块、截图、外部网页图片和重复旧图均不能计入数量。
- “真实引用”指资源经类型化清单或映射进入生产运行时代码，并能从公开 UI 操作抵达、在浏览器中成功请求且可见；只被 import、预加载、测试代码或不可达分支引用不算。
- 资源失败时允许保留非美术性的安全回退和文字反馈，但回退不能冒充正式美术或计入矩阵。
- “独立”指不同路径且 SHA-256 不同；同一文件、复制文件、仅改色/镜像或同图不同裁切不能占多个矩阵单元。
- 所有数量均是下限和本任务的完整交付矩阵；在全部 AC 通过前，不因已生成某个固定数量而停止 proof loop。
- 本合同计数范围固定为至少 56 张正式位图：30 张角色状态、16 张剧情/结局 CG、3 张页面主视觉、7 张战斗特效；背景、敌方基础立绘、图标、加载/错误回退和 ImageGen 预检图均不计入这 56 张。
- 56 张计数资源的类别、key 与最终路径必须一一对应；一个文件不得跨类别或跨 key 重复计数。基线已有资源不进入 56 张盘点，即使后续仍作为非计数背景、敌方立绘或生成参考使用。
- 四条路线的专属高潮映射固定为 `zhao -> zhaoAwakening`、`ji -> jiDestroyGu`、`su -> suCoffin`、`traitor -> traitorBloodTaken`；公共节点 `gate`、`bloodThreshold`、`fog` 不替代路线专属高潮。

## Frozen assumptions and decisions

1. 冻结基线为 commit `eeb58125a123511dffd85ca2b0173de6703e799f`；冻结时工作树中已有的 `AGENTS.md`、`.agent/durable-loop/`、`.codex/` 和本任务初始化工件视为用户/监督进程已有改动，后续阶段不得覆盖、清理或整包提交。
2. 本任务的 56 张计数素材必须是本任务 ImageGen 调用产生的新正式成品。基线已有背景、角色基础立绘、敌方立绘以及 `.agent/imagegen-preflight/ji-qinghan-test-battle-portrait.png` 均可作为风格/身份参考，但不能直接占用 56 个矩阵单元。
3. 当前应用是 Next.js `16.3.0` 静态导出项目，冻结验收以 `next.config.ts` 的 `output: "export"`、构建目录 `out/` 和仓库现有静态服务器为准；不把 `next dev` 结果当作 production 证据。
4. AC9 所称“正式存档格式创建的确定性夹具”允许测试在首次页面加载前写入由生产序列化器生成、并经生产读取/迁移逻辑校验的 localStorage 数据；从载入后的公开页面开始必须只使用可见 UI。任意直接调用 React setter、内部 reducer、剧情推进函数或 DOM 注入目标画面的方式均不合格。
5. AC2 的 `injured` / `battle` 状态可以通过新增向后兼容的展示状态元数据在剧情或战斗中触发，但不得改变存档的既有必填字段、战斗数值或剧情分支。旧存档缺少新增展示字段时必须安全迁移到确定性默认值。
6. 视觉人工复核是 AC2、AC3、AC4、AC5、AC6、AC8 的必要条件；自动检查全绿不能覆盖明显的身份漂移、叙事冲突、裁切或生成瑕疵。反之，人工观感不能替代尺寸、体积、哈希、网络和运行时引用的自动证据。
7. 每个 AC 只有在当前仓库、当前命令输出和所有必需 proof 路径共同支持时才能标记 `PASS`；缺文件、命令未运行或证据无法复现时应标记 `UNKNOWN` 或 `FAIL`，不得沿用旧迭代状态。
8. 每次后续 build/evidence/verify/fix 迭代都必须在 `raw/checkpoints/` 写一个不可覆盖的 JSON 检查点，记录 task id、阶段、迭代序号、开始/结束时间、迭代前后 HEAD、`git status --short`、本迭代改动文件、实际命令及退出码、已完成 AC、已知缺口和建议下一动作；该任务目录内检查点是 proof loop 的恢复记录，不得改写监督进程拥有的 `.agent/durable-loop/`。

## Deadline-aware delivery order

本节只规定 build/fix 阶段的执行优先级，不改变任何 AC 的必选性质、数量、阈值或最终 PASS 语义。

1. **可用端到端核心优先**：先建立类型化资源合同、生成溯源与审计骨架，完成“首页进入游戏 → 剧情展示角色状态与关键 CG → 一场可操作战斗展示玩家/敌方特效 → 唯一结局 CG → 手动存档并读回”的代表性纵切，并保持 `pnpm test`、`pnpm lint`、`pnpm build` 可运行。核心阶段使用最终架构和正式 ImageGen 位图，不建立之后要丢弃的占位链路。
2. **其余强制矩阵第二**：补齐 30 张角色状态、16 张 CG、3 张 UI 主视觉、7 张特效及全部四路线、九结局、六槽/快存快读、减少动态、四视口、压缩和 production browser proof；随后完成 AC1–AC12 的全部自动与人工证据。
3. **可选润色最后**：只有 AC1–AC12 已全部具备可验证的 PASS 候选后，才允许进行不扩大范围的细节润色（例如在体积预算内微调压缩、焦点样式或构图裁切）。不得新增路线、结局、角色、动画系统或超出 56 张合同的非必要素材；若时间收紧，首先停止该层。

## Work items

下表是监督器冻结 `plan.json` 的稳定输入。条目 ID、标题和 AC 覆盖关系在后续 build/evidence/fix 阶段不得自行改写；所有条目均为 mandatory，只有对应 AC 的实现范围完整落地时才可标为 `implemented`。

| Work item | Deliverable | AC coverage | Mandatory |
| --- | --- | --- | --- |
| `WI-001` | 建立可审计的类型化资源合同与运行时清单 | AC1 | yes |
| `WI-002` | 补齐六名角色的 30 格状态矩阵并接入真实触发 | AC2 | yes |
| `WI-003` | 生成并接入九结局与七个关键节点的 16 张独立 CG | AC3 | yes |
| `WI-004` | 以统一暗黑国风系统重做首页、设置页与存档页 | AC4 | yes |
| `WI-005` | 接入七类战斗位图特效及触发、层级、时序与降级 | AC5 | yes |
| `WI-006` | 建立正式美术质量复核与 ImageGen 逐文件溯源 | AC6 | yes |
| `WI-007` | 完成 56 张资源压缩、解码、加载预算与卫生审计 | AC7 | yes |
| `WI-008` | 验证四视口布局、可读性、键盘与动态偏好 | AC8 | yes |
| `WI-009` | 通过真实页面覆盖四路线、七节点与九结局 | AC9 | yes |
| `WI-010` | 验证六槽存读档、快存快读与战斗全链路回归 | AC10 | yes |
| `WI-011` | 补齐自动化质量门并通过生产静态导出 | AC11 | yes |
| `WI-012` | 产出可复现的 criterion-level proof 与结构化验证入口 | AC12 | yes |

## Acceptance criteria

### AC1 — 可审计的资源合同与运行时清单

生产代码必须提供单一、类型化且可枚举的视觉资源合同（可拆成同一模块导出的多个表），至少包含 `character state -> asset`、`scene/ending -> CG`、`view -> UI art`、`combat event -> effect` 四类映射。每个条目都包含稳定 key、public 路径、中文 alt/用途说明和实际触发点。自动化检查必须证明：文件存在、路径大小写一致、WebP 可解码、没有重复哈希、没有未登记的新正式美术、没有登记但运行时不可达的正式美术、没有 4xx/失败图片请求。生产清单的 key、路径和 alt 中不得出现 `placeholder`、`temp`、`TODO`、`test` 或 `screenshot`；现有失败回退不得登记为正式资源。当前基线中的 `character.*.placeholder` 别名必须从生产清单和运行时事件中移除，`public/characters/ji-qinghan-placeholder.webp` 不得作为发布资源留在静态导出中；如保留为生成参考，只能迁入任务 proof/raw 范围并在溯源记录中标明“reference, not deliverable”。

### AC2 — 六名角色的 30 格状态矩阵完整且身份一致

以下每格必须对应独立透明背景 WebP，推荐命名 `public/characters/<character>-<state>-v1.webp`，成品尺寸固定为 `1024x1536`：

| 角色 ID | 必需状态 |
| --- | --- |
| `ji-qinghan` 纪清寒 | `neutral`, `alert`, `softened`, `injured`, `battle` |
| `zhao-li` 赵黎 | `neutral`, `amused`, `wary`, `injured`, `battle` |
| `xue-feng` 薛逢 | `neutral`, `smiling`, `panicked`, `greedy`, `injured`, `battle` |
| `su-ying` 苏莹 | `neutral`, `wary`, `sad`, `injured`, `battle` |
| `qiao-wujiu` 乔无咎 | `neutral`, `calm`, `smug`, `injured`, `battle` |
| `su-yan` 苏衍 | `neutral`, `awakened`, `injured`, `battle` |

30 格必须全部进入角色状态映射，并各自在代表性剧情 beat 或战斗状态中真实展示。现有剧情使用的 expression key 必须解析到对应独立状态，不能继续让多个表情共用基础立绘；`injured` 与 `battle` 也不能只存在于清单。浏览器矩阵报告须为每格记录触发 scene/battle、DOM 中的稳定 asset key、实际成功请求的 URL 和可见性断言；contact sheet 只能证明视觉质量，不能替代运行时覆盖。角色 contact sheet 的独立视觉复核必须确认每名角色跨状态保持脸型、发型、年龄感、服饰纹样、主配色、武器/蛊具和轮廓一致，同时表情/受伤/战斗语义可一眼区分；不得有水印、文字、额外肢体、残缺手脸、错误服装、明显拼贴或主体被 UI 不当裁切。

### AC3 — 九结局与七个关键节点的 16 张独立 CG 完整接入

必须生成并接入 16 张独立 16:9 WebP CG，尺寸至少 `1600x900`，宽高比与 16:9 的偏差不超过 2%。九个结局各一张：`demon`、`severed`、`true`、`deathByZhao`、`deathByMaster`、`deathByQiao`、`deathByBloodGuard`、`trapped`、`traitor`；七个剧情节点各一张：`gate`、`bloodThreshold`、`fog`、`zhaoAwakening`、`jiDestroyGu`、`suCoffin`、`traitorBloodTaken`。推荐路径分别为 `public/cg/endings/<id>-v1.webp` 与 `public/cg/scenes/<sceneId>-v1.webp`。

浏览器必须在进入相应节点/结局时展示其唯一 CG；九个结局不得继续复用通用背景。CG 的人物身份、地点、事件结果、光色和情绪必须与对应文本一致，四条路线均有专属高潮 CG；不得有水印、生成文字、现代物件、明显肢体错误或与文本冲突的生死/阵营关系。桌面和手机横屏中主体与关键叙事元素不得被文本面板遮没或被 `object-fit` 明显拉伸/误裁。

九结局的现有可达性归属固定为：赵黎流程覆盖 `demon`、`deathByZhao`、`deathByQiao`、`deathByBloodGuard`；纪清寒流程覆盖 `severed`；苏莹流程覆盖 `true`、`deathByMaster`；背叛流程覆盖 `traitor`；大雾超时公共分支覆盖 `trapped`。这只是 proof 路由，不允许改变既有结局条件或把同一运行时状态伪装成多个结局。

四条路线的高潮 CG 必须按冻结映射接入：`zhaoAwakening` 对应赵黎线、`jiDestroyGu` 对应纪清寒线、`suCoffin` 对应苏莹线、`traitorBloodTaken` 对应背叛线。节点 CG key 可与 scene id 同名，但不能用路线外的通用 CG 代替。

### AC4 — 首页、设置页、存档页完成统一美术重做

`main-menu`、`settings`、`saves` 三个视图必须各使用一张独立 ImageGen 正式主视觉（推荐 `public/ui/<view>-v1.webp`，至少 `1600x900`、16:9±2%），不能复用剧情背景或只依赖 CSS 装饰。三页共同采用“古墓、巫蛊、暗黑国风”的材质、雾气、血/铜/墨色和版式语言，但构图应分别服务入口、设置与卷轴存档语义。

首页必须保留开始、读取存档、结局一览、游戏设置及版本信息；设置页必须保留主题、四路音量/静音、减少动态、清除结局记录；存档页必须保留六个存档位的空/占用/禁用/读取状态。所有可操作控件均有可辨认的默认、hover（有鼠标时）、focus-visible、active、disabled、selected/confirm（适用时）状态，文字不压在高噪声区域，任何装饰层不得拦截点击或键盘焦点。

### AC5 — 七类战斗位图特效具备触发、层级、时序与降级

必须至少生成七个独立透明 WebP 特效资源（最小 `768x768`）：`player-blood-attack`（`blood`）、`player-armor-guard`（`armor`）、`player-heal-gu`（`heal`）、`player-sword-gu`（`sword`）、`player-charm-gu`（`charm`）、`player-blooddemon-gu`（`blooddemon`）、`enemy-attack`（敌方反击）。CSS 只可负责正式位图的定位、透明度、变换和时序，不能用 CSS/SVG/Canvas 图形替代这七个素材。

每类特效必须由对应的有效战斗事件触发且每次只播放一次；玩家特效先于结算反馈，若敌方仍可行动则敌方攻击随后播放。正常动态下单段可见时长为 `300–900ms`，总反馈不得让下一回合永久不可操作；特效层必须位于舞台背景/人物之上、正文和战斗控件之下，`pointer-events: none`，并在 `1366x768` 与 `844x390` 保持攻击方向和命中目标可读。启用系统或应用“减少动态”时，取消大幅位移/闪烁，使用不超过 `150ms` 的静态提示或直接结束，但伤害、治疗、防御和回合逻辑不变。主动中止一个特效图片请求时，战斗文字反馈和按钮仍可用、无崩溃、无永久遮罩，并记录明确的非美术降级行为。

### AC6 — 正式美术质量、画风一致性与生成溯源合格

所有新增正式图像必须能追溯到本任务的 ImageGen 调用。`.agent/tasks/visual-art-expansion-v1/raw/art-generation.json` 必须逐文件记录资源 key、最终路径、生成时间、完整提示词、采用的参考图/角色基准、ImageGen 调用序号与返回的原始输出标识/路径，以及按顺序列出的后处理；后处理只允许裁切、缩放、透明通道清理和 WebP 压缩，不允许手绘补造、拼接其他图、局部生成替换或改色来制造“独立”变体。角色参考至少引用已提交基准或 `.agent/imagegen-preflight/ji-qinghan-test-battle-portrait.png` 所代表的预检链路。若 ImageGen 不可用，不得制作替代图，应把相应 AC 作为真实 blocker。

预检图只证明 ImageGen 能力与参考链路可用，不得直接复制、改名、改色或裁切后计入 AC2 的 30 格矩阵，也不得计入 AC7 的 56 张交付盘点。

独立验证器必须检查角色、CG、UI、特效四张 contact sheet 及代表性原尺寸图，确认整体为统一的半写实暗黑国风游戏美术：冷墨黑/铜锈/暗血红为主，人物造型和蛊墓材质连续，光源与透视可信，画面无水印/乱码/品牌标识/明显生成瑕疵。仅有自动尺寸与文件检查不足以让本 AC PASS。

### AC7 — 压缩、解码、加载预算和资源卫生达标

56 张最终正式资源均为 WebP 且可由 ImageMagick 完整解码：单张角色图 `<=500 KiB`，单张 CG/UI 图 `<=450 KiB`，单张特效图 `<=300 KiB`；56 张资源总大小 `<=24 MiB`。KiB 按 1024 bytes、MiB 按 1024² bytes 计算，阈值比较使用实际文件字节数。不得以低分辨率放大、破坏透明边缘或明显色带来换取体积。页面运行时不得请求原始 PNG/JPEG 生成稿。

在全新 browser context 中禁用磁盘缓存、清空 storage、以 `1366x768` 打开首页且未交互，并等待字体与当前可见图片解码后，图片响应数 `<=4`，各图片响应的 `encodedBodySize` 之和 `<=2.5 MiB`；若浏览器只提供 `transferSize`，使用两者中的较大值并在报告中注明。统计必须包含首页导航开始后、首次交互前的全部 `image` resource，不能通过提前访问或保留跨测试缓存规避预算。不得预取全部角色状态、CG 或特效；进入剧情/结局/战斗时可按当前节点或相邻节点有界预取。资源审计必须列出路径、尺寸、宽高、alpha、字节数、SHA-256、运行时引用点和首屏网络统计，且正式资源无孤儿文件、重复文件、破损路径或大小写不一致。

### AC8 — 桌面与手机布局、可读性和动态偏好合格

必须在 `1366x768`、`1920x1080`、手机横屏 `844x390`、手机竖屏 `390x844` 四个视口截图并检查首页、设置页、存档页；剧情关键 CG、角色多立绘、结局和战斗至少在前三个可游戏视口检查，竖屏保持项目既有且清晰可用的旋转提示。所有视口均不得出现横向滚动、主要控件/标题/正文截断、层叠遮挡、点击目标出屏、背景/角色明显拉伸或安全区错误。

普通正文与背景对比度 `>=4.5:1`，大字 `>=3:1`，focus-visible 边界 `>=3:1`；正文在桌面与横屏手机上保持可读字号和行距。键盘可遍历三页及战斗主要控件，焦点不被装饰捕获；`prefers-reduced-motion: reduce` 和应用减少动态开关均覆盖新增动画。自动截图须使用固定时间/随机数并等待字体与图片解码，保证可复现。

### AC9 — 四条路线、七个关键节点和九个结局可由真实页面验证

Playwright 必须通过公开页面操作覆盖 `zhao`、`ji`、`su`、`traitor` 四条正式路线，抵达并可见 AC3 的七个关键节点 CG，并分别解锁、显示全部九个结局及各自唯一 CG。允许加载由正式存档格式创建的确定性夹具缩短已验证的前置剧情，但夹具必须通过生产 `createSaveSlot`/等价序列化路径生成、由生产校验/迁移代码接受，并在报告中保存夹具内容摘要与目标槽；从载入后的公开页面开始必须只点击真实 UI。不得直接调用 React 内部状态、直接挂载结局组件或修改生产逻辑绕过条件。每次运行均断言页面无 `pageerror`、`console.error`、HTTP `>=400` 和非预期 `requestfailed`，并保存 7 个节点与 9 个结局的截图或等价视频帧；每份截图/帧须同时可识别页面节点/结局和实际 CG asset key，避免只截静态文件。

### AC10 — 存档/读档与战斗全链路无回归

浏览器冒烟必须覆盖：从首页开始，通过可见 UI 手动写入并读取六槽中的至少一个槽、快速存档/快速读取、读取后恢复 scene/page/当前可见角色与状态/生命/真元/路线/战斗状态且旧结局被清除、返回首页后再次读取。还须以至少一个冻结前有效的版本 6 存档样本验证新增可选视觉元数据缺失时的兼容默认值；不得为了本任务修改既有版本 6 必填字段语义。战斗必须通过可见按钮分别触发 `blood`、`armor`、`heal`、`sword`、`charm`、`blooddemon` 和至少一次敌方攻击，断言数值结算、文本反馈、特效 key/可见层和下一回合状态一致；至少完成一场胜利和一场失败。上述流程在正常动态和减少动态下均无阻断，并保留日志/截图。

### AC11 — 自动化质量门与生产静态导出全部通过

当前仓库状态必须依次通过 `pnpm test`、`pnpm lint`、`pnpm build`、`pnpm test:e2e:run`。测试必须新增对 30 格角色矩阵、16 张 CG、3 张 UI 图、7 类特效、重复哈希、缺失/孤儿资源、运行时映射、九结局唯一 CG、首屏图片预算和四视口视觉安全的自动断言；不能通过放宽/删除既有断言、跳过测试或隐藏控制台错误来达标。`next build` 必须生成可由现有静态服务器启动的 `out/`，本地生产静态导出冒烟需从该目录运行而非 dev server。

### AC12 — criterion-level proof 完整且可由新鲜验证器复现

`evidence.md` 与 `evidence.json` 必须逐 AC 列出状态、当前命令、退出码和直接证据；`raw/` 至少包含 `unit.txt`、`lint.txt`、`build.txt`、`e2e.txt`、`image-audit.txt`、`asset-inventory.json`、`runtime-reference-report.json`、`network-budget.json`、`art-generation.json`、`proof-validation.txt`、角色/CG/UI/特效运行时矩阵、版本 6 兼容夹具、人工视觉复核、迭代检查点、四类 contact sheet，以及 AC8/AC9/AC10 要求的截图/日志。`evidence.json` 必须是合法 JSON，列出 changed files、fresh verifier commands、known gaps 和每个 AC 的 proof 路径；所有 proof 路径均使用相对任务目录的仓库内路径且必须存在。状态枚举固定为 `PASS`、`FAIL`、`UNKNOWN`；只有命令 exit code 为 0、自动断言通过、必需人工复核有明确记录且 proof 路径存在时才可写 `PASS`。仓库须提供确定性的 `scripts/validate-task-proof.mjs`（或同等单一入口），校验 task id、AC1–AC12 唯一且连续、字段/状态/命令退出码、overall 与逐项状态一致、所有 proof 路径存在且不逃逸任务目录；验证成功必须退出 0 并输出明确 PASS。独立 verify 阶段必须重跑规定检查与该 proof validator，并基于当前仓库写 `verdict.json`；每个非 PASS AC 都要在 `problems.md` 有可复现、可执行的最小修复说明。只有 AC1–AC12 全部 PASS、所有 proof 路径存在且结构化 proof validation 退出 0 时，整体才可判定 PASS。

`evidence.json` 中每个 AC 必须独立列出 `id`、`status`、`commands`（含命令文本与 exit code）、`proof` 和 `gaps`；不得仅用整体测试通过替代 criterion-level 证据。contact sheet 至少包含角色、CG、UI、特效各一张无损可读图，并在同目录保留生成清单或命令，使新鲜验证器能追溯 sheet 中每一格的源文件。

固定 proof 路径如下；可添加更多文件，但不得用别名替代这些路径：

- `raw/contact-sheets/characters.png`
- `raw/contact-sheets/cg.png`
- `raw/contact-sheets/ui.png`
- `raw/contact-sheets/effects.png`
- `raw/contact-sheets/manifest.json`
- `raw/character-runtime-matrix.json`
- `raw/cg-runtime-matrix.json`
- `raw/ui-runtime-report.json`
- `raw/effect-runtime-matrix.json`
- `raw/manual-visual-review.md`
- `raw/fixtures/save-v6-no-visual-metadata.json`
- `raw/checkpoints/`（每次后续 proof-loop 迭代一个不可覆盖的 JSON）
- `raw/screenshots/layout/`（AC8 四视口截图）
- `raw/screenshots/routes-and-endings/`（AC9 七节点与九结局截图）
- `raw/screenshots/save-and-combat/`（AC10 存读档、七类特效、胜负与减少动态截图）
- `raw/route-ending-smoke.json`、`raw/save-combat-smoke.json`、`raw/reduced-motion-smoke.json`

## Constraints

1. 冻结后 AC 编号、数量、阈值和语义不可在 build/evidence/fix 阶段自行降低；如发现合同矛盾，只能记录问题并由新的 freeze 迭代显式修订。
2. 保留用户现有改动；禁止 `git reset`、`git checkout`、`git clean`、重写历史或编辑 `.agent/durable-loop/`。
3. 本任务只修改任务所需的生产代码、测试、正式资源和 `.agent/tasks/visual-art-expansion-v1/` 证明工件；不得把其他未关联改动纳入提交。
4. 所有 Git 提交遵循 `<type>: <简体中文摘要>` 的 Conventional Commits 规范，每次提交一项逻辑改动；任务最终验证通过且远程可用时按仓库规则提交并推送，不强推。
5. 按仓库 Next.js 规则，任何 Next.js 生产代码修改前先阅读 `node_modules/next/dist/docs/` 中与 Image、静态导出、路由和资源加载相关的当前版本文档。
6. 正式素材生成必须使用内置 ImageGen；不得用低质量 CSS/SVG/Canvas/纯色块/截图或其他模型、图库替代。生成不可用时如实 blocked。
7. 允许 CSS 做布局、遮罩、排版、交互状态和位图动画；允许失败时使用现有安全色块/文字反馈，但它们不能计入正式美术数量。
8. 不引入运行时外链图片、字体或美术服务；静态导出必须离线拥有全部正式资源。
9. 资源路径、映射和测试不得依赖 Windows 大小写不敏感行为；在大小写敏感环境中也必须成立。
10. 不改变既有四路线、九结局、战斗数值、存档格式兼容性和核心剧情含义，除非为接入视觉状态增加向后兼容的展示元数据。

## Non-goals

1. 不新增第五条路线、第十个结局、新角色、剧情重写或战斗数值再平衡。
2. 不重做音频、Android WebView 外壳、线上部署基础设施或生产域名发布；本任务的“production”指本地 `next build` 静态导出与其浏览器冒烟。
3. 不要求角色骨骼动画、逐帧视频、3D、粒子引擎或 Canvas 渲染；位图加轻量 CSS 动画即可。
4. 不把错误回退、加载骨架、旋转提示、图标和品牌标记计入正式美术数量，也不因本任务删除必要的无障碍回退。
5. 不要求为每一个普通剧情节点制作 CG；范围固定为 AC3 的七个关键节点与九个结局。
6. 不要求更改既有音频设置内容、存档槽数量或支持手机竖屏完整游玩。

## Verification commands

Fresh verifier 从仓库根目录按顺序运行，并把完整 stdout/stderr 与退出码保存到 AC12 对应 raw 文件：

```powershell
git status --short
pnpm test
pnpm lint
pnpm build
pnpm test:e2e:run
pnpm exec playwright test tests/e2e/visual-art-expansion.spec.ts --reporter=line
Get-ChildItem public/characters,public/cg,public/ui,public/effects -Recurse -Filter *.webp | ForEach-Object { magick identify -verbose $_.FullName; if ($LASTEXITCODE -ne 0) { throw "ImageMagick decode failed: $($_.FullName)" } }
Test-Path -LiteralPath out/index.html
Get-Content -LiteralPath .agent/tasks/visual-art-expansion-v1/evidence.json -Encoding utf8 -Raw | ConvertFrom-Json | Out-Null
node scripts/validate-task-proof.mjs visual-art-expansion-v1
```

若实现将视觉专项测试合并进现有 Playwright 文件，第六条可改为实际专项文件路径，但 `pnpm test:e2e:run` 必须覆盖同等断言。验证器还须执行以下只读审计并保存输出：

```powershell
Get-ChildItem public/characters,public/cg,public/ui,public/effects -Recurse -File | Get-FileHash -Algorithm SHA256
Get-ChildItem public/characters,public/cg,public/ui,public/effects -Recurse -File | Select-Object FullName,Length
rg -n 'placeholder|TODO|screenshot|kind:\s*[''\"]css[''\"]|\.svg|<canvas' lib features app public tests
```

上述 `rg` 只产生候选命中：现有 SVG 图标、测试基线截图或明确的非美术回退可以存在，但验证器必须逐条分类；任何正式矩阵条目、正式资源 key/path/alt 或其运行时渲染链路命中禁用占位模式即失败。所有资源和 JSON 审计命令必须以 exit code `0` 完成；`Test-Path` 还必须输出 `True`。

Fresh verifier 必须为以上每条命令单独记录开始时间、结束时间、完整命令、stdout/stderr 和 exit code，不得把多个检查的总退出码当作各检查的退出码。若专项测试文件不存在、ImageMagick 不可用、浏览器无法启动或任何必需命令未运行，对应 AC 不得判定 `PASS`。

## Manual verification checklist

1. 打开 AC6 的四张 contact sheet，并抽查每名角色五/六/四种状态、每张 CG、三页 UI 图和七类特效的原尺寸图；按 AC2/AC3/AC6 记录逐项视觉结论。
2. 检查 `1366x768`、`1920x1080`、`844x390`、`390x844` 截图集的裁切、遮挡、滚动、对比度、焦点和旋转提示。
3. 查看 7 个关键节点、9 个结局、四路线、存读档、胜负战斗和七类特效的浏览器证据，确认是运行时真实请求与公开 UI 操作，不是静态资源截图。
4. 对一个特效请求执行 Playwright route abort，检查文字反馈、按钮、回合和错误诊断符合 AC5；再在减少动态模式复跑代表性战斗。
5. 核对 `art-generation.json`、资源哈希/尺寸/体积、首屏网络报告与生产 manifest，确认不存在占位、复制、孤儿、破损或未追溯资源。
