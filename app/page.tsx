import { XueGuYinGame } from "@/features/xue-gu-yin/XueGuYinGame";

export default function Home() {
  return <>
    <XueGuYinGame />
    <aside className="orientation-prompt" role="status" aria-label="请将手机旋转至横屏">
      <span className="orientation-prompt-mark" aria-hidden="true"><i /></span>
      <p className="eyebrow">横屏游玩</p>
      <h1>请旋转设备</h1>
      <p>《血蛊引》的完整舞台、人物立绘与蛊斗界面将在横屏后自动显示。</p>
    </aside>
  </>;
}
