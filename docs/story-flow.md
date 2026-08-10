# 蛊墓五修：当前可玩剧情流图

这份图只描述当前游戏实现中的节点跳转。虚线表示状态后果或结局判定，不代表额外文本节点。

~~~mermaid
flowchart TD
  role[选择修士] --> entrance[乔家之邀]
  entrance --> door[血锁墓门]
  door --> corpse[尸灯傀儡·蛊斗]
  corpse --> well[引魂蛊井]

  well -->|护住沈青萝，下井| shell[空壳师弟]
  well -->|识破引魂蛊 / 试探赵黎| trap[血针机关·蛊斗]
  shell --> trap
  trap --> hall[血流蛊室]

  hall -->|坦白真相 / 追乔无咎| gate[祭阵出口]
  hall -->|趁乱夺蛊| zhao[赵黎显形·蛊斗]
  zhao -->|胜| gate
  zhao -->|败| death[命丧蛊墓]

  gate -->|踏破残阵| resolution[结局判定]
  gate -->|强断血祭| resolution
  gate -->|持有血流蛊| rage[乔家血卫·蛊斗]
  rage --> exit[荒原尽头]
  exit --> bloodEnding[夺蛊成魔]

  resolution -.赵黎夺蛊.-> death
  resolution -.时机耗尽.-> trapped[困墓之人]
  resolution -.沈青萝信任与关键证物.-> together[两人出墓]
  resolution -.其余情况.-> alone[独活荒原]
~~~

## 状态影响表

| 状态类别 | 来源 | 当前作用 |
|---|---|---|
| 线索 | 察看血锁、井底玉牌 | 与沈青萝的关系共同决定“两人出墓” |
| 人物关系 | 护住沈青萝、坦白真相等 | 不在界面显示，以剧情与结局体现 |
| 蛊与旗标 | 夺得血流蛊、赵黎夺蛊 | 开启血卫战或直接决定“命丧蛊墓” |
| 伤势与时间 | 战败、冒险选择 | 影响后续生存与“困墓之人” |

## 维护约定

新增或删除一个剧情节点时，同时更新：

1. stories/gu-tomb.ink：文本、选择和 Ink 跳转；
2. lib/gu-tomb/game.ts：选择后果、战斗配置与结局判定；
3. 本图：节点、战斗和结局连线；
4. tests/game.test.ts：至少覆盖新增分支的关键状态。
