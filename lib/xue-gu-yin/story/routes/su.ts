import type { Scene, VisualNovelEvent } from "../../model.ts";

const suTrailEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "narration", text: "石厅中的浓雾尚未散尽，远近人声都被雾气搅得难辨方向。你正要循声而行，脚边忽有一枚暗红古字亮起，片刻后，东南方又有第二枚、第三枚依次浮现。那些古字的起落笔势，与你先前见过的苏莹手势极为相似。" },
  { type: "narration", text: "最后一枚古字停在一块被机关掀斜的石板旁。你以真元试过石板下方并无埋伏，随后沿着露出的几级窄阶进入下层夹道。浓雾被隔在头顶，夹道尽头却传来石环断续转动的轻响。" },
  { type: "narration", text: "苏莹正蹲在一方开裂的圆形阵盘前。她一手按住松动的边角，一手拨开沟槽里的碎屑。阵盘侧面牵着一根细得近乎看不见的牵机丝，没入墙孔深处；每当细丝轻轻抽动，外圈石环便跟着偏移一寸，显然还有人在远处操纵这里的机关。" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "最后一层积灰被拂去，阵盘中央露出一枚残缺旧印。苏莹察觉你靠近，指尖立刻停在旧印边缘。那印记的收笔之法，恰与她方才引路的古字一脉相承。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "石厅里的机关还连着这根牵机丝。操纵它的人若发现有人认出了旧印，先合上的会是我们身后的石板。", expression: "wary", position: "right" },
  { type: "narration", text: "她没有说出幕后之人的名字。墙孔里的牵机丝仍在间歇抽动，留给你们的时间并不多。" },
];

const suInscriptionEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.trap-passage", transition: "fade" },
  { type: "narration", text: "夹道越往前越窄，头顶不时传来石板挪动的闷响。苏莹依照阵盘残留的指向，在一处凹入墙中的石龛前停下。龛内嵌着半块断碑，碑面大半覆着黑褐色硬壳，边缘只露出几笔古字。" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "苏莹取出那半张折旧的墓图，与断碑上的线条逐一比对。墓图残角画着与前一处阵盘相同的苏氏旧印，印旁另有一行墨色稍新的小字：蛊不可祭，蛊只可承。那是留下墓图的人后来添上的警告，并非碑文的一部分。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "师父只告诉我，若墓中仍有人以活血维持祖阵，绝不能让血钥落入对方手中。他没有说明血钥究竟是什么。", expression: "wary", position: "right" },
  { type: "narration", text: "你沿断碑向下看去，几条本该早已干涸的导血槽中，仍有极细的暗红液体缓慢流向墓穴深处。液体尚带着微温，石壁后方也每隔数息传来一次低沉震动。这里的阵法没有随着墓主坐化而停转。" },
  { type: "narration", text: "苏莹辨认了许久，只从裸露的残文中读出“苏衍”“承蛊”和半个“返”字。单凭这些字，还不足以断定墓主仍活着；但祖阵持续吞入血气，至少说明墓中尚有某种东西需要它维持。再想到先前不断改变通路的牵机丝，她怀疑入墓之人正被有意赶往阵法中心。" },
  { type: "narration", text: "你按住逐渐发热的旧玉。玉面靠近断碑时，碑侧一处形制相合的凹槽也泛起微光。旧玉没有带来任何答案，却可能照出藏在硬壳下的其余铭文。" },
];

const suLineageEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "断碑后的侧道尽头没有门户，整面石壁只嵌着三重青石环枢。一路延伸至此的导血槽在最外层汇合，中央凹处刻着苏氏旧印；斜下方另有一处方形辅槽，尺寸恰与旧玉相合，槽内积灰未动。" },
  { type: "narration", text: "苏莹展开墓图。关于此处的部分已经残破，只能辨出“血钥入阵”与“玉镇旁枢”几字。她没有贸然落手，先以手背靠近阵心。相隔尚有半尺，最内层石环便随她的脉息一明一暗；她退开一步，光芒也随之减弱。" },
  { type: "narration", text: "苏莹反复试了两次，才将掌心贴上阵心。三重石环依次转动，暗红阵光沿她的手腕缓慢上行，阵内的牵引也随之压住她的气血。她刚要收手，内圈石环已经扣住掌缘，外层导血槽同时亮了起来。" },
  { type: "narration", text: "来路方向传来牵机丝绷紧的细响，后方石板开始一寸寸合拢。远处操纵机关的人应当察觉了阵枢变化，正试图截断这条侧道。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "别硬拉。石环已经扣住我的脉息，强行扯开只会带动外层一起闭合。墓图缺了反转那一段，只剩旁枢还能试。", expression: "wary", position: "right" },
  { type: "narration", text: "你看向覆着积灰的方槽。旧玉先前能够补全苏氏旧印，“玉镇旁枢”所指的或许正是这里。" },
];

const suThresholdEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.fog-passage", transition: "fade" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "石桥尽头的暗红石门没有门环，门心只留着一方掌印。掌印上方刻着两行古字：同脉者入，承蛊者奉主。门侧另有一道与先前旁枢相连的玉槽，桥下缓慢流动的阵光正由此汇入门框。" },
  { type: "narration", text: "苏莹走近后，门上血纹随她的脉息明灭，却没有立刻向她索取气血。血纹沿掌印向外展开，依次连上“同脉”与“奉主”两行字。若完全照着门上阵路开启，开门之人除了被认作血钥，还会被祖阵记入墓主一侧的承蛊阵位。" },
  { type: "narration", text: "她将墓图上那句“蛊不可祭，蛊只可承”与门文反复对照，终于看出师父留下的警告所指。所谓传承并非只有一道门，门后还藏着祖阵强加给后人的位置。" },
  { type: "narration", text: "你检查门侧玉槽，确认它只连接门框外层的稳定阵纹，并不通向掌印中央。旧玉置入其中，可以压住开门时向外收拢的牵引，却无法代替苏莹通过血脉识别，也不能替她决定是否开门。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "我会把门打开。认出我是苏氏后人，是这座阵的事；要不要认里面的人为主，是我的事。", expression: "wary", position: "right" },
];

const suBloodGateEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "narration", text: "门内是一座向下沉入地底的长方石殿。殿心挖着一口浅池，池上以数条粗索悬着一枚暗红蛊茧；茧壳每隔数息收缩一次，血门外听见的缓慢吸气声也随之在石殿中回荡。石殿最远处立着一具黑石棺，棺前地面被池中升起的薄雾遮住。" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "苏莹没有走向蛊茧。她先查看门槛内的阵纹，很快发现殿中叠着两套路数。较宽的一套与门外苏氏旧印相连，凿口已经磨钝，沿两侧石壁绕过浅池，最终汇向黑石棺；另一套细窄得多，切口仍留着棱角，横穿旧纹后直指池心，附近还接着数根没入墙孔的牵机丝。" },
  { type: "narration", text: "细窄阵线不断将门外流入的血气送向蛊茧，旧阵中残余的微光却仍绕过池心，沿石殿边缘向黑棺传递。有人后来改动过祖阵，但仅凭这些痕迹还无法确定其身份。" },
  { type: "narration", text: "苏莹将墓图贴近地面比对。图上的旧路与宽纹一致，旁边还有一行残注：承蛊在后，血茧为饵。残注没有说明“饵”作何用途，却足以让她暂时避开殿心，把查验目标放到黑棺一侧。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "别碰新凿的细线。它们连着墙里的牵机丝，踩中一处，远端便能知道这条阵路有了动静。旧纹从右侧绕行，我们沿它过去。", expression: "wary", position: "right" },
];

const suBloodGuardEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "血傀儡从半圆旧阵中完全站起，身量接近常人两倍。粗重骨架外覆着早已失去生机的皮肉，左腕拖着一条暗沉锁链，右臂则被炼得格外粗壮。胸骨中央没有心脏，只有一枚拳头大小的暗红血核，正将阵槽送来的血气分往双肩与右膝。\n\n苏莹留在半圆阵线之外，依照棺前残文按住两处旧阵节点，使傀儡无法继续从祖阵抽取更多血气。新凿阵线仍在从远处输送血光，她无法同时切断两套阵纹，也不能让已经醒来的守墓旧物重新伏下。\n\n血傀儡转向你，左腕锁链从石面缓缓抬起。它守住黑棺前唯一的缺口。苏莹看着血光流向，迅速指出双肩、右膝与旧阵相接的位置：“我压住阵路。你截断三处连接，再破胸口血核。”\n\n你停在半圆阵内，血傀儡已经举起锁链。" },
];

const suCoffinEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "sad" },
  { type: "narration", text: "黑棺前的薄雾渐渐散开。棺盖没有封死，边缘留着数道较新的凿痕，石屑中还夹着断裂的牵机丝。有人曾从外侧强行撬动，却只掀开棺盖表层，没有找到真正的开启阵点；这些痕迹还不足以表明动手者是谁。" },
  { type: "narration", text: "你与苏莹推开已经松动的棺盖。棺内没有尸骨，底部只留着一道人形凹腔。凹腔四周分布着密集细槽，向下穿过棺底，与石殿导血槽相连；槽中仍有暗红液体缓慢流动。这里不像埋葬死者的棺椁，更像供某具身体蜕换、转运血气的阵器。" },
  { type: "narration", text: "棺壁原本刻有大段铭文，靠近棺首的位置却被仔细刮去。苏莹检查残面，发现明面字迹虽已消失，石层深处仍压着一层用于校准阵路的反刻底纹。旧玉先前能够照出苏氏旧印，或许也能使这些底纹显形。" },
  { type: "narration", text: "墓图在黑棺旁只留下一句后添的批注：空棺非葬，见遗文即退。苏莹没有照做。她一路追查到这里，若不弄清警告所指，便无法判断应当从何处截断仍在运转的祖阵。" },
];

const suMasterTruthEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "su-yan", position: "left", expression: "awakened" },
  { type: "narration", text: "血池中央浮起一具干枯身体。苏衍睁眼后先称苏莹为后人，又命她交出血脉与旧玉。苏莹站在你身侧没有跪下；她把血钥折断，亲手拒绝了延续数代的命令。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "血脉只让我看见你的罪，不会替你命令我。", expression: "wary", position: "right" },
];

const suMasterDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "苏衍吞下血池残魂，五转威压覆盖整座祭殿。苏莹以断裂血钥压住他与墓阵的联系，你则必须在她支撑不住之前击溃这位真正的墓主。不同的主角身份会带来不同胜算，游方蛊医的攻势不足以突破他的再生。" },
];

const suCollapseEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "苏衍死去的瞬间，祖阵失去主人，乔无咎的祭线也随之反噬。血魔蛊尚未完整孵化便在崩塌中碎裂。你从黑棺旁找到通往控制室的旧钥，与苏莹一同打开所有封死的生门。" },
];

const suAftermathEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.dawn-exit", transition: "fade" },
  { type: "narration", text: "纪清寒、赵黎与其余幸存者沿开启的生门汇合。赵黎看了一眼苏衍的残骸，难得没有争抢已经化灰的五转蛊；乔无咎则被失控的机关拖回控制室，再也没能出来。" },
];

const suEpilogueEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.dawn-exit", transition: "fade" },
  { type: "narration", text: "五人越过将塌的墓门时，荒原正迎来第一线晨光。苏莹回头看了最后一眼埋葬祖先罪孽的废墟，将断裂血钥丢进泥水。她不再是谁的祭品或钥匙，只以自己的名字与你并肩走向蛊市。" },
];

export const suActThreeScenes: Record<string, Scene> = {
  suTrail: {
    id: "suTrail", act: 3, node: 1, chapter: "第三幕 · 苏莹线 · 节点 1 / 4", title: "雾中古文",
    events: suTrailEvents,
    choices: [
      { id: "su-ask-lineage", label: "指出旧印笔势与她先前的指法相同，问她从何处学来", next: "suInscription", result: "“这道旧印的起笔，与你在石厅里用过的手势相同。”你没有逼近，只把视线落在她停住的指尖上。苏莹沉默片刻，低声道：“师父教的。他留下的半张墓图上，也有同样的印记。等我看过前面的下一段铭文，再把知道的事告诉你。”说完，她起身沿阵盘指向的夹道继续前行。" },
      { id: "su-read-in-silence", label: "不追问旧印来历，先替她按住开裂的阵盘", next: "suInscription", result: "你蹲下按稳阵盘松动的一角，外圈石环终于不再随牵机丝偏移。苏莹借机清出最后几道沟槽，将缺失的笔势一一记下，随后主动说道：“师父留下的半张墓图上，也有这枚旧印。我来这里，就是想弄清它的意思。下一段铭文应该就在前面，你若愿意，便一同去看。”她松开阵盘，你们赶在远处机关再次动作前离开夹道。" },
    ],
  },
  suInscription: {
    id: "suInscription", act: 3, node: 2, chapter: "第三幕 · 苏莹线 · 节点 2 / 4", title: "未死之人",
    events: suInscriptionEvents,
    choices: [{ id: "su-answer-jade", label: "让旧玉回应断碑上的苏氏旧印", next: "suLineage", result: "你将旧玉按入凹槽，只注入一线真元。玉面渐渐升温，断碑上的苏氏旧印随之亮起，藏在硬壳下的残缺笔画被暗红微光逐段勾出。苏莹没有急着靠近，先观察导血槽中的流速，确认阵法未因旧玉而加快运转，才俯身辨认。新显出的铭文并不完整，只余下几句断续的话：后人持血钥入内，承蛊者可返，祭血者不可出。落款处的“苏衍”二字也只剩大半。苏莹将墓图上的警告与残文对照片刻，低声道：“师父留下‘不可祭’，应当就是在防备碑上这条路。苏衍是否还保有神智，眼下仍不能断定；能够确定的，只有这座阵一直在等一个能使苏氏旧印回应的人。”她收好墓图，又看向仍在流动的暗红细线：“血钥未必是一件器物。若它指的是开门之人，我来到这里或许并非偶然。”你取回旧玉，碑后随即传来一声短促的机括咬合声，一条更深的侧道缓缓露出。你与苏莹先确认身后的退路仍然敞开，才沿着导血槽延伸的方向继续前行。", effect: { flag: "苏氏旧印" } }],
  },
  suLineage: {
    id: "suLineage", act: 3, node: 3, chapter: "第三幕 · 苏莹线 · 节点 3 / 4", title: "血脉之钥",
    events: suLineageEvents,
    choices: [{ id: "su-share-burden", label: "将旧玉嵌入辅槽，与她共同稳住血脉禁制", next: "suThreshold", result: "你拂去槽中积灰，将旧玉稳稳压入其中，只渡入一线真元。温热玉光沿石环支纹铺开，与缠在苏莹手腕上的暗红阵光相接，原本只向她一人收拢的牵引随之分入旁枢。苏莹没有急着抽手，而是依照墓图尚能辨认的次序，逐一按下石环上的归位点；你则维持旧玉与辅槽的联系，不让外层阵纹再次锁死。最后一重石环回到原位时，阵心浮出一行短暂古字：苏氏后人，血钥可入。字迹隐去后，扣住她掌缘的力量也松开。石壁从中央向两侧退去，露出一条架在深沟上的狭窄石桥，桥尽头立着一道尚未开启的暗红石门。苏莹收回手，看着你取下旧玉，低声道：“师父不肯把苏氏旧事尽数告诉我，或许正是怕我把‘后人’二字当成必须听从的命令。”身后的石板仍在合拢，你们没有停留，赶在侧道封死前踏上石桥。", effect: { flags: ["苏莹存活", "苏氏血钥"] } }],
  },
  suThreshold: {
    id: "suThreshold", act: 3, node: 4, chapter: "第三幕 · 苏莹线 · 节点 4 / 4", title: "血门认主",
    events: suThresholdEvents,
    choices: [{ id: "su-open-gate", label: "以旧玉稳住门侧旁枢，让苏莹亲手开启血门", next: "suBloodGate", result: "你将旧玉嵌入门侧玉槽，玉光沿门框外缘铺成一圈稳定的细纹。苏莹确认旁枢没有越过掌印，才将手放入门心。血纹沿她掌缘亮起，依次核验三重石环留下的血钥印记。“同脉者入”四字先行亮起，通往“奉主”二字的阵光却数次被门框支纹截回。苏莹没有向门后行礼，只按照墓图所载的开门次序，逐一按下掌印中的阵点。片刻后，第一行古字隐去，第二行则从中裂开。血门承认了她的血脉，却没能替她定下承蛊阵位。石门在沉重的摩擦声中向两侧退开，门后没有灯火，只有带着陈旧血腥气的冷风涌出。黑暗深处先传来阵枢运转的低响，随后混入一次极长、极缓的吸气声，分不清来自活人，还是某处仍在运转的阵腔。苏莹收回完好无损的手掌，看了一眼门上断开的“奉主”二字：“门开了。里面是谁，进去看过再说。”你取回旧玉，与她一同跨过门槛；身后的血门没有立即闭合。" }],
  },
};

export const suActFourScenes: Record<string, Scene> = {
  suBloodGate: { id: "suBloodGate", act: 4, node: 1, chapter: "第四幕 · 苏莹线 · 节点 1 / 6", title: "祖阵深处", events: suBloodGateEvents, choices: [{ id: "su-follow-inscription", label: "随苏莹沿苏氏旧纹绕开蛊茧，追查祖阵去向", next: "suBloodGuard", result: "你们贴着石殿右侧前行，每一步都落在旧纹之间未被改动的石面上。越接近黑棺，池中蛊茧的收缩声越弱，棺前地底传来的钝响反而越清楚。绕过最后一根石柱时，苏莹抬手示意你停下。黑棺前横着一道半圆形旧阵，边缘残留的古字只能读出“守血者止步”几字；阵心半跪着一具高大的血色傀儡，双肩与右膝都被粗重阵纹接入地面。你们尚未越过半圆阵线，墙内的牵机丝忽然收紧。池心新阵输送的暗红血气横穿石殿，灌入傀儡背后的旧阵。它的五指随之扣入石地，缓慢抬起头。改阵之人无法直接号令这具苏氏旧物，却能用血气将它惊醒。苏莹退到阵线之外，指向傀儡肩、膝处正在发亮的连接点：“我压住旧阵，你别让它离开棺前这道缺口。”你挡在通往黑棺的必经之处，血色傀儡已经从地上站起。" }] },
  suBloodGuard: { id: "suBloodGuard", act: 4, node: 2, chapter: "第四幕 · 苏莹线 · 节点 2 / 6", title: "守墓之物", events: suBloodGuardEvents, battle: { enemyName: "血傀儡", enemyHealth: 20, victoryNext: "suCoffin", defeatNext: "ending", victoryFlag: "苏莹线血傀儡已毁", defeatFlag: "死于守门血傀儡", defeatEnding: "deathByBloodGuard" } },
  suCoffin: { id: "suCoffin", act: 4, node: 3, chapter: "第四幕 · 苏莹线 · 节点 3 / 6", title: "空棺遗文", events: suCoffinEvents, choices: [{ id: "su-restore-text", label: "以旧玉照出反刻底纹，与苏莹复原棺上遗文", next: "suMasterTruth", result: "你将旧玉贴近棺首残面，只渡入一线真元。玉光沿石层深处的反刻底纹缓慢游走；被刮去的表层文字没有复原，尚存的校准笔画却一段段亮起。苏莹借着微光，将断笔与墓图上的苏氏古字逐一比对，补出几句残文：棺存旧壳，血池养身；后人持钥，奉血承蛊；主归五转……最后一行毁损最重，只在边缘留下“返生”二字的几笔轮廓。这些残句与棺内人形凹腔、向下延伸的导血槽彼此印证。黑棺并非苏衍的埋骨处，而是他舍弃旧躯、转运血气的一环；“后人持血钥入内”也更像是要借苏氏后人的血脉，填补返生阵尚缺的一步。苏莹没有就此断定苏衍仍是活人，只将墓图上的警告与残文并在一处：“师父留下‘不可祭’，防的应当就是这条路。若照碑文奉血，所谓承蛊之人很可能只是祖阵取用的血食。”她收好墓图，按下反刻底纹末端的阵点。人形凹腔下方传来石轴转动声，整块棺底向旁移开，露出一口垂直通往血池下层的窄井。暗红阵光从井底映上来，伴着比先前更清楚的缓慢呼吸。你取回旧玉，与苏莹退到石棺两侧。井壁阵纹正在一层层亮起，某种藏在下层的东西正沿血气向上移动。" }] },
  suMasterTruth: {
    id: "suMasterTruth", act: 4, node: 4, chapter: "第四幕 · 苏莹线 · 节点 4 / 6", title: "血脉拒命", events: suMasterTruthEvents,
    choices: [
      { id: "su-deny-debt", label: "告诉苏衍，她不欠苏氏任何东西", next: "suMasterDuel", result: "苏衍冷笑：“外人也配谈苏氏的债？”苏莹折断血钥：“他说得对。这笔债，到你这里就该断了。”" },
      { id: "su-name-herself", label: "告诉苏莹，她只需留下自己的名字", next: "suMasterDuel", result: "苏莹看着掌中的血钥，忽然笑了一下：“那就记住苏莹，别记什么苏氏后人。”血钥应声折断。" },
    ],
  },
  suMasterDuel: { id: "suMasterDuel", act: 4, node: 5, chapter: "第四幕 · 苏莹线 · 节点 5 / 6", title: "五转墓主", events: suMasterDuelEvents, battle: { enemyName: "苏衍", enemyHealth: 28, victoryNext: "suCollapse", defeatNext: "ending", victoryFlag: "墓主已灭", defeatFlag: "墓主吞尽血食", defeatEnding: "deathByMaster" } },
  suCollapse: { id: "suCollapse", act: 4, node: 6, chapter: "第四幕 · 苏莹线 · 节点 6 / 6", title: "祖阵崩塌", events: suCollapseEvents, choices: [{ id: "su-open-exits", label: "用旧钥开启全部生门", next: "suAftermath", result: "封闭多年的生门逐一开启，幸存者的呼喊从甬道深处传来。" }] },
};

export const suActFiveScenes: Record<string, Scene> = {
  suAftermath: { id: "suAftermath", act: 5, node: 1, chapter: "第五幕 · 苏莹线 · 节点 1 / 2", title: "五人重聚", events: suAftermathEvents, choices: [{ id: "su-lead-out", label: "带所有人离开崩塌的蛊墓", next: "suEpilogue", result: "旧钥指出最后一条生路，五道身影在落石间重新聚齐。" }] },
  suEpilogue: { id: "suEpilogue", act: 5, node: 2, chapter: "第五幕 · 苏莹线 · 节点 2 / 2", title: "血脉归位", events: suEpilogueEvents, choices: [{ id: "su-end", label: "与苏莹走向晨光", next: "ending", result: "血脉不再是命令，五名入墓者全部生还。", effect: { ending: "true" } }] },
};

export const suRouteScenes: Record<string, Scene> = { ...suActThreeScenes, ...suActFourScenes, ...suActFiveScenes };
