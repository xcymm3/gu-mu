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

### 活蛊线控制暗室

```text
Use case: stylized-concept. Create a polished 2D anime visual-novel environment background for a dark Chinese xianxia mystery game. A secret control chamber hidden inside an ancient Gu tomb. Black stone walls are threaded with thousands of hair-thin dim blood-red living Gu lines, converging on suspended puppet cores and a central stone control altar. A blood-written ledger rests beside old mechanism plates. The room reveals that someone has secretly controlled the tomb for years. Ominous, precise, restrained rather than gory. Leave the lower 30 percent visually quiet and low-contrast for a dialogue box. Wide 16:9 cinematic composition, painterly anime background art, deep ink green, black stone and controlled blood-red accents, no people, no characters, no text, no logo, no UI, no watermark.
```

### 苏衍

```text
Use case: game-character-sprite. Create a polished 2D anime visual-novel full-body character sprite of Su Yan, the true ancient tomb master in a dark Chinese xianxia mystery. Male, appears about forty but carries the exhausted age of centuries, fifth-rank Gu cultivator, tall and austere, ash-pale skin, sharp sunken eyes, long black hair streaked with silver, refined but intimidating face. He wears layered black and dark blood-red ceremonial cultivator robes with subtle ancient insect and flowing-blood motifs, weathered hems, jade-black belt, no armor. His posture is perfectly calm and dominant, one hand slightly raised as if commanding dormant blood Gu, expression cold and unreadable. Match a refined commercial Japanese visual-novel character illustration: clean line art, detailed cel shading, restrained xianxia costume, full body from head to feet, centered, consistent neutral lighting. Genuine transparent background with clean alpha edges, no scenery, no floor shadow, no text, no logo, no UI, no watermark.
```

透明修正提示词：

```text
Edit this exact character illustration into a production-ready visual-novel sprite. Preserve Su Yan's face, hair, pose, black and dark-red ceremonial robes, proportions, and all character details. Remove the entire black/red background and every halo or floor shadow. Output the isolated full-body character only on a genuine fully transparent alpha background with clean anti-aliased edges. Do not crop the hair, sleeves, robe, hands, or feet. No scenery, no colored backdrop, no text, no logo, no UI, no watermark.
```
