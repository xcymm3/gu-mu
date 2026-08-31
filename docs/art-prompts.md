# 《血蛊引》美术生成记录

> 用途：记录可复现的美术提示词。当前素材由 Codex 内置 imagegen 生成，随后转为透明 WebP 接入项目。

## 第五步：五名主要人物基础立绘

五次生成均使用以下公共提示词：

```text
Use case: stylized-concept
Asset type: full-body transparent character sprite for a desktop Chinese xianxia horror visual novel
Style/medium: polished 2D anime visual novel character art, refined Chinese fantasy costume design, clean controlled linework, restrained cel shading with painterly fabric details, consistent production-ready game sprite
Composition/framing: single character, full body from head to feet, upright natural pose, front three-quarter view, centered, generous transparent margin, feet fully visible
Lighting/mood: cool moonlit rim light, restrained ominous mood, readable face and costume
Color palette: desaturated jade, ink black, grey-blue, with a small character-specific accent
Constraints: genuinely transparent background with preserved alpha; exactly one person; no scenery; no props floating separately; no text; no labels; no frame; no logo; no watermark; anatomically coherent hands; suitable for layering over a 16:9 background
Avoid: chibi proportions, exaggerated action pose, glossy 3D render, photorealism, modern clothing, weapon blocking the face, cropped feet, opaque background
```

每次生成另附以下人物描述：

### 赵黎

```text
Subject: Zhao Li, a male fourth-rank Gu cultivator who looks like a handsome young man but is truly very old; youthful pale face, narrow amused eyes, unsettling old-soul expression; lean build; black-and-dark-crimson travel robes; one tiny blood-red Gu beetle resting on a gloved fingertip; outwardly casual, inwardly dangerous
Character accent: muted blood red
```

### 纪清寒

```text
Subject: Ji Qinghan, an adult female fourth-rank sword Gu cultivator; beautiful but cold and distant; long black hair partly tied with a pale jade ornament; white and icy blue layered cultivation robes; slender sheathed sword held close at her side; calm vigilant eyes; poised rather than seductive
Character accent: frost white and pale blue
```

### 薛逢

```text
Subject: Xue Feng, a male wandering Gu cultivator; smiling round-faced middle-aged merchant-like man with a sturdy slightly heavy build; layered brown, olive and muted-gold travel robes; practical belt with several small sealed pouches; hands politely folded while sharp observant eyes betray caution and greed; friendly surface, survivor underneath
Character accent: muted ochre
```

### 苏莹

```text
Subject: Su Ying, a young adult female low-profile Gu cultivator; petite and slender, pale face, cautious downcast eyes; simple moss-green and ash-grey robes with worn hems; dark hair in a modest low braid; one hand tracing an invisible ancient rune near her sleeve; secretive, fragile-looking but alert
Character accent: moss green
```

### 乔无咎

```text
Subject: Qiao Wujiu, a male middle-aged powerful clan leader and fourth-rank Gu cultivator; composed angular face, trimmed dark beard, authoritative posture; severe layered charcoal-grey robes with subtle bronze geometric Gu-pattern embroidery; one hand hidden in sleeve as if controlling unseen threads; calm courteous smile that feels calculating
Character accent: dark bronze
```

## 第六步：第三幕场景与苏衍基础立绘

本批资源使用 Codex 内置 imagegen，模式均为 `stylized-concept`。背景输出后转为 WebP；苏衍先生成全身立绘，再通过一次图像编辑移除底色并保留透明 alpha。

### 迷雾墓道

```text
Use case: stylized-concept. Create a polished 2D anime visual-novel environment background for a dark Chinese xianxia mystery game. A vast underground ancient stone passage is swallowed by layered pale green-gray Gu mist. Wet black masonry, faint mineral reflections, a path disappearing into fog, subtle occult insect patterns carved into the walls, tense and uncanny but readable. Leave the lower 30 percent visually quiet and low-contrast for a dialogue box. Wide 16:9 cinematic composition, painterly anime background art, restrained moss-green, charcoal and cold gray palette, soft volumetric fog, no people, no characters, no text, no logo, no UI, no watermark.
```

### 机关陷道

```text
Use case: stylized-concept. Create a polished 2D anime visual-novel environment background for a dark Chinese xianxia mystery game. An underground trap passage inside an ancient Gu tomb: the stone floor has collapsed into a deep chasm, broken slabs and a narrow surviving ledge cross the scene, damaged bronze mechanisms and dormant puppet fragments lie in shadow, a single distant corpse-oil lamp gives dim amber light. Dangerous, cold, uncanny, clear spatial depth. Leave the lower 30 percent visually quiet and low-contrast for a dialogue box. Wide 16:9 cinematic composition, painterly anime background art, restrained jade-green, charcoal, stone gray and muted amber palette, no people, no characters, no text, no logo, no UI, no watermark.
```

### 牵机丝控制暗室

```text
Use case: stylized-concept. Create a polished 2D anime visual-novel environment background for a dark Chinese xianxia mystery game. A secret control chamber hidden inside an ancient Gu tomb. Black stone walls are crossed by thousands of hair-thin dim blood-red control threads spun from Gu silk, converging on suspended puppet cores and a central stone control altar. A blood-written ledger rests beside old mechanism plates. The room reveals that someone has secretly controlled the tomb for years. Ominous, precise, restrained rather than gory. Leave the lower 30 percent visually quiet and low-contrast for a dialogue box. Wide 16:9 cinematic composition, painterly anime background art, deep ink green, black stone and controlled blood-red accents, no people, no characters, no text, no logo, no UI, no watermark.
```

### 苏衍

```text
Use case: game-character-sprite. Create a polished 2D anime visual-novel full-body character sprite of Su Yan, the true ancient tomb master in a dark Chinese xianxia mystery. Male, appears about forty but carries the exhausted age of centuries, fifth-rank Gu cultivator, tall and austere, ash-pale skin, sharp sunken eyes, long black hair streaked with silver, refined but intimidating face. He wears layered black and dark blood-red ceremonial cultivator robes with subtle ancient insect and flowing-blood motifs, weathered hems, jade-black belt, no armor. His posture is perfectly calm and dominant, one hand slightly raised as if commanding dormant blood Gu, expression cold and unreadable. Match a refined commercial Japanese visual-novel character illustration: clean line art, detailed cel shading, restrained xianxia costume, full body from head to feet, centered, consistent neutral lighting. Genuine transparent background with clean alpha edges, no scenery, no floor shadow, no text, no logo, no UI, no watermark.
```

透明修正提示词：

```text
Edit this exact character illustration into a production-ready visual-novel sprite. Preserve Su Yan's face, hair, pose, black and dark-red ceremonial robes, proportions, and all character details. Remove the entire black/red background and every halo or floor shadow. Output the isolated full-body character only on a genuine fully transparent alpha background with clean anti-aliased edges. Do not crop the hair, sleeves, robe, hands, or feet. No scenery, no colored backdrop, no text, no logo, no UI, no watermark.
```

## 第七步：第四幕与结局背景

本批三张背景使用 Codex 内置 imagegen，模式均为 `stylized-concept`，生成后统一转为 16:9 WebP。

### 五转血魔蛊室

```text
Use case: stylized-concept. Create a polished 2D anime visual-novel environment background for the climax of a dark Chinese xianxia mystery game. A vast ancient underground Blood Gu chamber built from black stone, with a circular blood pool at center, a cracked five-turn Gu chrysalis hovering just above the liquid, an ancient black stone coffin rising behind it, and countless restrained blood-red living threads converging from the walls. Powerful ritual atmosphere, ominous but not excessively gory, clear architectural depth, no people. Leave the lower 30 percent dark, quiet and low-contrast for a visual-novel dialogue box. Wide 16:9 cinematic composition, commercial Japanese visual-novel background quality, painterly anime environment art, ink-black, deep jade and controlled crimson palette, no characters, no text, no logo, no UI, no watermark.
```

### 出墓天光

```text
Use case: stylized-concept. Create a polished 2D anime visual-novel ending background for a dark Chinese xianxia mystery game. Dawn outside an ancient Gu tomb after a night of rain: the broken stone gate opens toward a pale golden sky, wet wild grass and mountain mist catch the first sunlight, the ruined tomb remains dark behind the threshold, a quiet path leads away into the living world. Bittersweet relief rather than celebration, no people. Leave the lower 30 percent visually quiet and low-contrast for ending text. Wide 16:9 cinematic composition, commercial Japanese visual-novel background quality, painterly anime environment art, pale gold, misty jade and rain-washed stone palette, no characters, no text, no logo, no UI, no watermark.
```

### 血室崩塌

```text
Use case: stylized-concept. Create a polished 2D anime visual-novel bad-ending background for a dark Chinese xianxia mystery game. The ancient underground Blood Gu chamber is collapsing under a deep crimson moonlike glow from the cracked ceiling; black stone pillars split, blood-red living threads snap across the air, the central blood pool overflows into dark reflections, abandoned weapons lie near the edge. Tragic, supernatural, restrained and cinematic, no bodies and no people. Leave the lower 30 percent dark and low-contrast for ending text. Wide 16:9 composition, commercial Japanese visual-novel background quality, painterly anime environment art, charcoal black and controlled crimson palette, no characters, no text, no logo, no UI, no watermark.
```

## GM2H-004：第二幕蛊墓甬道

本图使用 Codex 内置 imagegen 生成，原始输出裁切为 `1672 × 941`，转换为质量参数 78 的 WebP；未使用第三方参考图。运行时文件为 `public/backgrounds/tomb-corridor-v1.webp`。

```text
Use case: stylized-concept
Asset type: production environment background for a desktop Chinese xianxia-horror visual novel
Primary request: create the interior tomb corridor that directly follows the rain-soaked tomb gate in 《血蛊引》, visually matching the project's existing polished dark painterly backgrounds
Scene/backdrop: a long ancient underground Chinese Gu-tomb corridor of wet black-green stone, repeated square pillars and shallow archways receding toward a single dim cold-jade light; sparse bronze corpse-oil lamps, eroded occult insect carvings, a few rain trails near the entrance, subtle ground mist; navigable and spatially coherent, no collapsed chasm
Style/medium: polished 2D painterly anime visual-novel environment art with restrained realistic texture, same production family as a dark commercial Japanese visual-novel background
Composition/framing: wide cinematic 16:9; centered one-point perspective; keep the lower 30 percent dark, quiet, low-contrast, and free of important details for a dialogue box; keep both left and right character staging zones readable
Lighting/mood: cool moonlit jade-gray ambience with very small muted amber lamp accents; ominous, hushed, restrained
Color palette: ink black, desaturated jade, wet slate gray, controlled muted amber
Constraints: no people, no silhouettes, no characters, no creatures, no text, no symbols resembling writing, no UI, no frame, no logo, no watermark; architecture must be Chinese tomb architecture rather than European crypt; no bright focal point in the lower third
Avoid: photorealistic game screenshot, glossy 3D render, excessive gore, red-dominant lighting, fantasy castle, open outdoor landscape, busy foreground
```
