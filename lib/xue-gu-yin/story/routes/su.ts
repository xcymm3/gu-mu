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
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "battle" },
  { type: "narration", text: "血傀儡从半圆旧阵中完全站起，身量接近常人两倍。粗重骨架外覆着早已失去生机的皮肉，左腕拖着一条暗沉锁链，右臂则被炼得格外粗壮。胸骨中央没有心脏，只有一枚拳头大小的暗红血核，正将阵槽送来的血气分往双肩与右膝。\n\n苏莹留在半圆阵线之外，依照棺前残文按住两处旧阵节点，使傀儡无法继续从祖阵抽取更多血气。新凿阵线仍在从远处输送血光，她无法同时切断两套阵纹，也不能让已经醒来的守墓旧物重新伏下。\n\n血傀儡转向你，左腕锁链从石面缓缓抬起。它守住黑棺前唯一的缺口。苏莹看着血光流向，迅速指出双肩、右膝与旧阵相接的位置：“我压住阵路。你截断三处连接，再破胸口血核。”\n\n你停在半圆阵内，血傀儡已经举起锁链。" },
];

const suCoffinEvents: VisualNovelEvent[] = [
  { type: "background", asset: "cg.scene.suCoffin", transition: "fade" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "injured" },
  { type: "narration", text: "旧阵散去后，苏莹才松开按住阵点的手。她袖口沾着血水，气息也因强行截断阵路而显得不稳，却仍先俯身检查黑棺。" },
  { type: "character", action: "expression", character: "su-ying", position: "right", expression: "sad" },
  { type: "narration", text: "黑棺前的薄雾渐渐散开。棺盖没有封死，边缘留着数道较新的凿痕，石屑中还夹着断裂的牵机丝。有人曾从外侧强行撬动，却只掀开棺盖表层，没有找到真正的开启阵点；这些痕迹还不足以表明动手者是谁。" },
  { type: "narration", text: "你与苏莹推开已经松动的棺盖。棺内没有尸骨，底部只留着一道人形凹腔。凹腔四周分布着密集细槽，向下穿过棺底，与石殿导血槽相连；槽中仍有暗红液体缓慢流动。这里不像埋葬死者的棺椁，更像供某具身体蜕换、转运血气的阵器。" },
  { type: "narration", text: "棺壁原本刻有大段铭文，靠近棺首的位置却被仔细刮去。苏莹检查残面，发现明面字迹虽已消失，石层深处仍压着一层用于校准阵路的反刻底纹。旧玉先前能够照出苏氏旧印，或许也能使这些底纹显形。" },
  { type: "narration", text: "墓图在黑棺旁只留下一句后添的批注：空棺非葬，见遗文即退。苏莹没有照做。她一路追查到这里，若不弄清警告所指，便无法判断应当从何处截断仍在运转的祖阵。" },
];

const suMasterTruthEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "fade" },
  { type: "character", action: "show", character: "su-yan", position: "left", expression: "neutral" },
  { type: "narration", text: "窄井中的阵光升到棺底后便不再上行。一方与人形凹腔等宽的石台沿井壁缓慢抬起，台上躺着一名形容枯槁的男子。暗红细线从他背后垂入井底，随着每一次微弱呼吸，将血气送入干瘪的四肢。" },
  { type: "character", action: "expression", character: "su-yan", position: "left", expression: "awakened" },
  { type: "narration", text: "石台与黑棺底部齐平时，男子睁开眼。石殿中的苏氏旧纹同时亮起，棺内人形凹腔也开始向他的身形收拢。苏莹依据棺上落款与旧阵反应，认出此人正是墓主苏衍，却没有靠近。" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "苏衍先看向她掌心尚未散去的血钥印记，又看了一眼你手中的旧玉。进入祖阵的苏氏后人与稳定旁枢之物都已来到棺前，正合返生阵所需。" },
  { type: "dialogue", speaker: "su-yan", displayName: "苏衍", text: "把手放入棺中，令旁枢归位。待我重归五转，承蛊之法与苏氏遗藏，自会留给后人。", expression: "awakened", position: "left" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "遗文只写‘主归五转’，从未写过‘后人得蛊’。你要留下的传承，为何先要取尽后人的血？", expression: "wary", position: "right" },
  { type: "dialogue", speaker: "su-yan", displayName: "苏衍", text: "苏氏血脉因我而存。后人奉还一身气血，助我补全大道，本就是偿还祖上所赐。", expression: "awakened", position: "left" },
  { type: "narration", text: "苏莹掌心的血钥印记受到祖阵牵引，数道暗红细线从她指间向黑棺延伸。她依照墓图截住其中两道，却没有替苏衍完成最后一步。" },
];

const suRefusalConvergence = "苏莹依照墓图，将真元逆转掌心印记最后三处阵点。延向黑棺的暗红细线从中断开，血钥纹路也裂成数段，不再接受祖阵牵引；她掌心仍旧完好。连接断开后，苏衍背后的血线同时绷紧。石殿旧阵试图重新扣住苏莹，被她将断开的掌印压在棺沿阵路上，卡在主路之外。苏衍从石台上坐起，返生尚未完成的躯体开始抽取已经蓄在棺底的残余血气。苏莹留在黑棺旁压住祖阵主路，能够截断他与石殿其余阵纹的联系，却无法夺走他已经纳入体内的力量。你向前一步，挡在她与石台之间。";

const suMasterDuelEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-chamber", transition: "cut" },
  { type: "narration", text: "苏衍从升起的石台上站起，背后仍垂着数道通往窄井的暗红细线。血钥连接虽已断开，他此前吸入体内的血气却未散去。残存的五转蛊息沿枯槁躯体向外压来，棺边石屑随之轻轻滚动。\n\n苏莹把断开的掌印压在黑棺主路上。每当旧阵试图重新连向苏衍，掌心残缺的血钥纹便使阵光停在棺沿。她能够截断石殿继续供血，却必须留在原地维持阵势，无法分心参战。\n\n苏衍三次牵动祖阵，都只从窄井底部抽回少量血气。苏莹盯着他背后的细线，低声道：“返生还没完成。他如今用掉一分，便少一分。逼他耗尽体内血气，再断窄井连接。”\n\n你停在石台与黑棺之间。苏衍抬起右手，窄井中的血雾已经沿棺底向外漫出。" },
];

const suCollapseEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.blood-ruin", transition: "fade" },
  { type: "narration", text: "苏衍断气后，黑棺与窄井之间的旧纹一段段熄灭。失去墓主维持，承担石殿重量的祖阵也开始松脱。井壁先传来连续裂响，随后有碎石落入下层，许久才听见回声。" },
  { type: "narration", text: "战斗中落入苏衍掌心的血魔蛊从他指间爬出，试图沿新凿阵线退回石殿中央。细线此时正在反向收紧，送来的血气也变成向远端回抽。血魔蛊刚爬到棺沿，背部血光便逐渐暗下，最终停在一处断开的线槽旁，再没有振翅。" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "苏莹仍按着祖阵主路。旧阵熄灭以后，新凿细线失去约束，纷纷绷向墙内牵机孔。远处控制机关的人还在强行收线，反而使细线切断数处已经开裂的承重阵纹。石殿顶部开始落下石块，血门方向也传来门板错位的摩擦声。" },
  { type: "narration", text: "黑棺侧面随震动脱落一块薄石板，露出藏在下方的生门总枢。总枢中央嵌着一枚石制转钥，周围刻有五处门位；墓图残角正好记录着开启次序。苏衍在世时，转钥被主纹锁住，如今锁纹已经随他死亡而熄灭。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "只开眼前这道门会快些，其余阵区却仍是死路。照墓图转完五处门位，所有生门才会一同解锁。我压住外圈，你来转钥。", expression: "wary", position: "right" },
];

const suAftermathEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.dawn-exit", transition: "fade" },
  { type: "narration", text: "你与苏莹沿外层墓道循声前行。第一处新开的生门后，纪清寒正扶着一块倾斜石板，薛逢从石板下方的窄隙向外挪动。总枢解锁后，压住通道的机关已经卸力；你们一同移开石板，两人随即脱离封闭阵区。" },
  { type: "narration", text: "另一道门响从左侧岔路传来。赵黎带着血纹蛊从黑暗中走出。他先看了苏莹掌心断裂的阵印，又看向你带回的石制转钥，只问了一句通往外墓的生门是否已经全部开启。" },
  { type: "narration", text: "至此，除乔无咎外，与你同行深入墓穴的四人已经重新汇合。五人没有在仍在震动的墓道中停留，沿转钥留下的门位标记向外撤离。" },
  { type: "narration", text: "经过第四处生门时，侧方控制室也因总枢解锁而敞开。乔无咎仰面倒在控制台旁，胸口已经没有起伏。他右手仍扣着一束主牵机丝，线槽上的刻记分别对应石厅翻板、血门外阵盘与祖阵中新添的细纹；中央扳杆被强行拉回原位，数束回卷牵机丝缠在他的手臂与灰袍上。" },
  { type: "narration", text: "总枢反向开启生门时，他仍抓着主线试图合门。回卷之力将他掀倒，后脑撞上控制台石沿。众人确认他已经死亡，没有再靠近仍在轻颤的断线。" },
  { type: "narration", text: "乔无咎带来的兽皮残图摊在控制台上，图中只标出后来改造的机关、牵机线槽与这间控制室，没有苏氏祖阵的生门次序。直到此刻，众人才看清他为何能够改换沿途通路，却始终无法号令守墓旧物与真正的主阵。" },
  { type: "narration", text: "石室顶部再次传来裂响。苏莹将墓图与总枢石钥并在一处，找出通往外墓的最后一条稳定路线。若再迟一步，这条路也会被落石截断。" },
];

const suEpilogueEvents: VisualNovelEvent[] = [
  { type: "background", asset: "background.dawn-exit", transition: "fade" },
  { type: "narration", text: "五人沿长阶向上走了很久，阶顶石门才在转钥带动下缓慢松开。门外的暴雨已经减弱，荒原仍被湿冷晨雾覆盖，东方云层后却透出一线浅白。" },
  { type: "narration", text: "最后一人跨出墓门后，内墓方向仍有低响传来。通往控制室与祖阵的石道在山腹中继续下沉，石门内侧的苏氏旧纹逐一暗去。乔无咎、苏衍与失去活动的血魔蛊都留在已经封死的墓中。" },
  { type: "narration", text: "纪清寒、赵黎与薛逢先到坡下确认道路。三人都活着走出墓门，没有人再提“见者有份”。墓穴已经塌毁，他们能够带走的，只有各自在途中看见和记住的东西。" },
  { type: "character", action: "show", character: "su-ying", position: "right", expression: "wary" },
  { type: "narration", text: "苏莹留在石门外。晨雨落在她摊开的掌心，原本裂成数段的血钥印记随着祖阵熄灭而一点点淡去，最后只剩几道浅红痕迹。掌心没有伤口，也不再回应墓中任何阵纹。" },
  { type: "narration", text: "她取出师父留下的半张墓图。“蛊不可祭，蛊只可承”的警告已经得到印证，残图边缘却仍有几处尚未查明的苏氏标记。她没有烧毁墓图，也没有把它当成祖先留下的命令，只重新折好收起。" },
  { type: "dialogue", speaker: "su-ying", displayName: "苏莹", text: "苏氏血脉说明我从哪里来，管不到我此后往哪里去。我先回蛊市整理墓中的古字，再查残图上余下的标记。你若愿意，之后与我一处处核对。", expression: "wary", position: "right" },
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
      { id: "su-deny-debt", label: "指向棺上“主归五转”的残文，追问承蛊为何先要奉尽后人的血", next: "suMasterDuel", result: `你指向旧玉照出的残文：“棺上只写你一人归五转。若苏氏后人必须先被祖阵取尽气血，这不是传承，只是取用。”苏衍没有再看残文：“血脉既自我而始，自当由我收回。待我复原，自会再续苏氏。”苏莹低头看着掌心阵光：“用后人的命延续的从来不是苏氏，只有你。”${suRefusalConvergence}` },
      { id: "su-name-herself", label: "不替苏莹回答，只提醒她血门认得血脉，却没能替她认主", next: "suMasterDuel", result: `你没有挡到她身前，也没有替她许下任何话，只说道：“血门认出了苏氏后人，却没能替你认主。现在也一样。”苏莹看了你一眼，随后转向苏衍：“我进墓是为查清师父留下的警告，不是来替祖先返生。苏氏给了我血脉，却没有替我决定如何活。”${suRefusalConvergence}` },
    ],
  },
  suMasterDuel: { id: "suMasterDuel", act: 4, node: 5, chapter: "第四幕 · 苏莹线 · 节点 5 / 6", title: "五转墓主", events: suMasterDuelEvents, battle: { enemyName: "苏衍", enemyHealth: 28, victoryNext: "suCollapse", defeatNext: "ending", victoryFlag: "墓主已灭", defeatFlag: "墓主吞尽血食", defeatEnding: "deathByMaster" } },
  suCollapse: { id: "suCollapse", act: 4, node: 6, chapter: "第四幕 · 苏莹线 · 节点 6 / 6", title: "祖阵崩塌", events: suCollapseEvents, choices: [{ id: "su-open-exits", label: "取出棺侧总枢石钥，依次开启全部生门", next: "suAftermath", result: "你将石制转钥向外拔出半寸，按照墓图次序依次转过五处门位。每到一位，墓穴不同方向便传来一道沉重门响。新凿细线数次缠上转钥，苏莹以掌心断开的血钥印记压住总枢外圈，使后来添上的细纹无法越过苏氏主路。第四处门位开启时，远处控制室传来一阵急促的机括声。反向绷紧的牵机丝彼此缠结，随后成束断开；墙后之人仍在试图重新合门，却已无法越过解锁的总枢。你将转钥推入第五处门位，五条生路随即依次亮起。石殿中央残余的茧壳被下落石梁压入浅池，新凿阵线也随石面断裂，再不能向血魔蛊供血。黑棺后的侧门完全升起，较为干燥的外层墓道出现在门后，更远处也传来数道幸存者的呼喊。你取下石制转钥，苏莹从总枢上收回手。棺底窄井正在塌陷，你们立即沿新开的生门离开石殿，循着人声接应仍在墓中的同伴。" }] },
};

export const suActFiveScenes: Record<string, Scene> = {
  suAftermath: { id: "suAftermath", act: 5, node: 1, chapter: "第五幕 · 苏莹线 · 节点 1 / 2", title: "五人重聚", events: suAftermathEvents, choices: [{ id: "su-lead-out", label: "以石钥辨认最后一条生路，带四人离开内墓", next: "suEpilogue", result: "你将石制转钥嵌入控制室出口的门位，苏莹依墓图校准方向。门后的旧纹依次亮起，指出一条绕开塌陷窄井与中央石殿的外行墓道。赵黎放出血纹蛊沿前路查验尚在流动的血线，纪清寒走在其后，以剑锋清开挡路碎石；薛逢留在队伍中段，逐处确认没有人在岔路掉队。你与苏莹守在最后一道门前，直到其余三人全部通过，才取下石钥跟上。内墓再次下沉时，来路石顶成片塌落，控制室与祖阵都被封在后方。五人赶在尘雾追上前穿过外墓石门，抵达通往地面的长阶。阶顶已经透下一线灰白天光，门缝中还能听见雨声。众人没有停下清点所得，只沿长阶继续向上。苏莹回望已经封死的内墓，将掌心残缺阵印收回袖中，与你一同走在队伍最后。" }] },
  suEpilogue: { id: "suEpilogue", act: 5, node: 2, chapter: "第五幕 · 苏莹线 · 节点 2 / 2", title: "血脉归位", events: suEpilogueEvents, choices: [{ id: "su-end", label: "与苏莹一同走出墓门，答应陪她查完墓图余下的标记", next: "ending", result: "你接过她递来的墓图看了一眼，将尚未辨明的几处标记记下，再把图还给她：“先回蛊市。余下的地方，一处一处看。”苏莹将墓图收回袖中，没有道谢，只提醒你别忘了自己说过的话。她掌心最后几道浅红阵痕也在晨光下完全淡去。坡下，纪清寒已经选好避开泥沼的道路；赵黎走在较远处，血纹蛊停在他肩侧；薛逢回头催促了一声。你与苏莹沿湿滑石坡下行，在岔路前追上三人。五人暂且同向蛊市而去。墓门在身后彻底合拢，荒原上的雨还没有停，东方天色却已经足以看清前路。苏莹仍姓苏，也记得自己从何而来；“苏氏后人”从此只是她经历的一部分，不再替她作任何决定。", effect: { ending: "true" } }] },
};

export const suRouteScenes: Record<string, Scene> = { ...suActThreeScenes, ...suActFourScenes, ...suActFiveScenes };
