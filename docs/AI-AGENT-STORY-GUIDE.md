# AI Agent 剧本维护手册

本项目采用**固定节点合同**与渐进式视觉小说事件模型。修改剧情时，优先修改 `lib/xue-gu-yin/story/data.ts`；不要把人物名、分支判断、场景正文或结局规则重新写进 React 组件。旧 `text/choices/battle` 场景会由叙事运行时自动转换成事件，允许逐节点迁移，不需要一次重写全部剧本。

## 不可破坏的结构合同

前四幕必须保持以下节点数：

```text
第一幕：1 个节点
第二幕：6 个节点
第三幕：4 个节点
第四幕：3 个节点
第五幕：结局数量可变
```

开局必须保留三种无姓名、均为男性的主角身份：游方蛊医（生命 14／真元 12／攻击 3）、流浪剑修（15／10／4）、世家之子（12／10／3）。剧情正文一律使用“你”，不得把身份名当作人物姓名写入叙述。

场景通过 `Scene` 的 `act` 和 `node` 标记归属。第三幕允许四条路线使用不同文本，但必须复用节点 1、2、3、4；第四幕的苏衍战是节点 3 的战斗变体，不得新增第四个高潮节点。

## 文件职责

| 文件 | 可以修改什么 | 不应放什么 |
| --- | --- | --- |
| `lib/xue-gu-yin/model.ts` | 领域类型、`VisualNovelEvent` 联合类型、场景和状态合同 | 具体剧情正文、React JSX。 |
| `lib/xue-gu-yin/story/data.ts` | 角色、场景接线、选项、结局和剧本元数据 | 大段已迁移事件正文、React JSX、CSS。 |
| `lib/xue-gu-yin/story/events/*.ts` | 已迁移节点的旁白、对白、登退场与表情事件 | 选项效果的重复副本、React JSX。 |
| `lib/xue-gu-yin/engine/narrative.ts` | 将场景解析成事件与 `ScenePresentation` 的纯运行时 | 具体节点剧情和视觉组件。 |
| `lib/xue-gu-yin/assets.ts` | 背景、立绘、音频等资源键与路径／占位描述 | 剧情条件、状态修改。 |
| `lib/xue-gu-yin/combat.ts` | 单回合战斗纯函数 | 战斗界面和剧情跳转。 |
| `lib/xue-gu-yin/game.ts` | 状态转换、条件、战斗接线与旧导入兼容门面 | 长篇剧情正文、React JSX、CSS。 |
| `features/xue-gu-yin/XueGuYinGame.tsx` | 视觉小说舞台、分页、按钮、存档 UI、战斗展示；只消费结构化呈现数据 | 任何具体路线判断、剧情段落、结局判定。 |
| `docs/story-flow.md` | 面向人类的路线概览与条件说明 | 与代码不一致的历史设定。 |
| `docs/art-prompts.md` | 已接入生成美术的可复现提示词与生成批次说明 | 剧情规则、资源路径接线。 |
| `tests/game.test.ts` | 节点合同、关键选项条件、分支与结局的自动校验 | 长篇剧情正文。 |

## 如何修改一个节点

1. 在 `lib/xue-gu-yin/story/data.ts` 的 `scenes` 找到目标 `id`。不改变该节点的 `act`、`node`，除非用户明确要求调整五幕合同。
2. 未迁移节点可继续改 `title`、`text` 与 `choices`。`text` 可是静态字符串，也可为 `(state) => string`，用于按路线、旗标或关系生成不同文本。
3. 已迁移节点使用 `events`，可写静态数组或 `(state) => VisualNovelEvent[]`。对白人物、立绘表情、背景、音效、选择与战斗都必须表达成事件，不能在组件里推测。
4. 选项只能通过 `effect` 修改状态：
   - `route`：仅在第二幕节点 6 锁定同行路线；
   - `flag`：记录一次性线索、物品或叙事事实；
   - `trust`：调整 NPC 隐藏关系；
   - `health` / `essence` / `time`：资源后果；
   - `ending`：为第五幕写入显式结局。
5. 需要隐藏选项时使用 `requires`。例如苏莹存活选项要求三枚旗标；不要在选项文字中泄露数值条件。
6. 更新 `docs/story-flow.md` 的相应分支说明，并为新的硬条件添加测试。

## 如何迁移为视觉小说事件

每次只迁移一个节点，并保留原 `id`、`act`、`node`、选择效果、战斗配置和跳转目标：

```ts
events: [
  { type: "background", asset: "background.tomb-corridor", transition: "fade" },
  { type: "character", action: "show", character: "ji-qinghan", asset: "character.ji-qinghan.placeholder", position: "center", expression: "alert" },
  { type: "dialogue", speaker: "ji-qinghan", displayName: "纪清寒", text: "别动。", expression: "alert", position: "center" },
  { type: "choice", choices: [...] },
]
```

- 资源必须先登记在 `assets.ts`，剧情只引用资源键。
- `narration` 与 `dialogue` 各自形成一个阅读节拍；运行时会为每个节拍保存当时的背景、可见角色、位置和表情。不要把多个角色的对白重新塞回同一个 `narration`。
- `dialogue` 会自动让说话者登场，并应用事件上的 `expression` 和 `position`；显式 `character show/hide` 用于控制对白前后的构图与多人同屏。
- `ScenePresentation.beats` 是表现层的逐页输入；React 不得从正文字符串反推说话人或表情。
- `events` 存在时，叙事运行时以它为准；不要同时维护两份含义不同的 `text`。
- 场景仍可把 `choices` 和 `battle` 留在 `Scene` 顶层，叙事运行时会在原生事件末尾自动接入，便于逐节点迁移且避免复制分支规则。
- 迁移前后使用 `resolveScenePresentation` 比较正文、选择和战斗配置，确保玩家流程不变。
- React 只消费 `ScenePresentation` 或事件列表，不直接读取 `scene.text/choices/battle`。
- `ScenePresentation.background` 驱动背景层，`characters` 驱动多角色立绘层；不得在组件里写死某个节点只显示纪清寒。
- 正式美术替换占位资源时，只修改 `assets.ts` 对应资源键的描述，剧情事件与 React 组件不需要改路径。

当前迁移结构：第一幕 `gate` 位于 `story/events/act1.ts`；第二幕六个节点位于 `story/events/act2.ts`；乔无咎揭露相关的 `shadowTruth`、`qiaoReveal` 位于 `story/events/key-scenes.ts`。后续节点应按幕建立事件文件，不要把所有正文重新堆回 `data.ts`。

第二幕中的 `puppetsEvents(state)` 与 `fogEvents(state)` 是条件演出样板：函数只根据现有旗标增减阅读事件，选择条件、状态效果和战斗配置仍留在 `data.ts`。不要在事件函数中直接修改 `GameState`。

## 如何增加剧情内容而不增加节点

- 将更多叙事写入节点的 `text`；UI 会根据实际对白框容量自动分页。
- 同一节点内可用多个选择表达不同态度，但应在后续既有节点汇合。
- 对四线路径，用 `routeText(state, { zhao, ji, xue, su })` 在同一个第三幕节点写出四种不同内容。
- 不要通过复制 `routeTrialB`、`routeTrialC` 等方式增加平行场景。这样会破坏固定节点合同并让存档和测试难以维护。

## 战斗修改

- 在 `game.ts` 的 `patterns` 中定义敌人的 3 至 4 步动作循环；`cue` 必须是叙事征兆，不能直接显示伤害数值或推荐蛊术。
- 在场景的 `battle` 中填敌人、生命、胜负去向；敌人生命在 UI 仅显示“健康／受伤／重伤”。
- 若要添加新 Boss，优先占用既有节点的战斗变体；必须新增战斗节点时，先得到用户对五幕合同修改的明确授权。

## 结局规则

- 主要结局通过选项的 `effect.ending` 写入 `结局:<id>` 旗标；需要战斗的结局可使用第四幕既有节点 3 的战斗变体，并由战斗结算写入该旗标。
- `resolveEnding` 的优先级是：显式结局 → 时辰困墓 → 独活荒原。
- 首领战的胜负若直接进入 `ending`，UI 会在点击战后“继续”时调用 `resolveEnding`；不要在 React 中手写某个结局名称。

## 存档兼容

- 当前存档版本为 2，并使用独立的浏览器存储键；旧版《蛊墓五修》存档与结局图鉴不会污染《血蛊引》状态。
- 不要在无迁移方案时修改 `GameState` 的基础字段含义；如必须修改，提升 `SaveSlot.version` 并更新 `isSaveSlot`。

## 每次修改后的验证

```powershell
pnpm lint
pnpm test
pnpm build
```

三项都必须通过。若节点合同变动，先更新测试，再更新 `storyMeta.acts` 与 `docs/story-flow.md`。
