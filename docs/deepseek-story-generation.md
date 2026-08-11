# DeepSeek 剧情生成

使用完整场景生成：每次请求一个 1000–2000 字符的完整场景，响应必须是唯一的 JSON 对象。脚本会自动先读取 `stories/briefs/00-generation-guide.txt`，再拼接命令行传入的场景 brief。前者规定世界观、人物动态卡和文风约束；后者只提供本场景的剧情节拍、分支事实与收束位置。脚本在本地仅按句末分页，确保每页为 250–500 字；任何思考标记、分析文字、Markdown、截断或额外字段都会被拒绝。

一个场景最多可生成八页。生成结果写入 stories/generated 目录，只有人工检查后才应合入 Ink，避免模型输出破坏可游玩的分支。

用法：

    pnpm generate:story entrance 6 .\stories\briefs\entrance.txt

无需再手工把统一设定复制进每个 brief；修改 `00-generation-guide.txt` 后，下一次生成会自动使用新内容。旧的 `00-world-bible.txt` 保留为历史参考，不参与 API 请求。

脚本优先使用环境变量 DEEPSEEK_API_KEY；只有未设置时才读取桌面工作计划.txt。密钥不会写入输出或日志。
