import type { BackgroundAssetKey } from "./assets.ts";

export type AudioChannel = "music" | "ambience" | "sfx";
export type AudioSettings = {
  muted: boolean;
  master: number;
  music: number;
  ambience: number;
  sfx: number;
};

type DroneFallback = {
  kind: "drone";
  frequencies: readonly number[];
  waveform: OscillatorType;
};

type NoiseFallback = {
  kind: "noise";
  filterFrequency: number;
  pulseHz?: number;
};

type ToneFallback = {
  kind: "tone";
  frequency: number;
  endFrequency: number;
  duration: number;
  waveform: OscillatorType;
};

type AudioFallback = DroneFallback | NoiseFallback | ToneFallback;

export type AudioAssetDescriptor = {
  kind: "file";
  channel: AudioChannel;
  src: `/audio/${string}.wav`;
  loop: boolean;
  fallback: AudioFallback;
};

/**
 * 本地音频资源清单。所有文件均由仓库内的确定性合成脚本原创生成，不包含第三方
 * 采样；fallback 只在文件加载或解码失败时维持阅读与战斗反馈。
 */
export const audioAssetManifest = {
  "bgm.tomb-depths": { kind: "file", channel: "music", src: "/audio/bgm-tomb-depths-v1.wav", loop: true, fallback: { kind: "drone", frequencies: [55, 82.41, 110], waveform: "sine" } },
  "bgm.fog-oath": { kind: "file", channel: "music", src: "/audio/bgm-fog-oath-v1.wav", loop: true, fallback: { kind: "drone", frequencies: [46.25, 69.3, 92.5], waveform: "triangle" } },
  "bgm.blood-awakening": { kind: "file", channel: "music", src: "/audio/bgm-blood-awakening-v1.wav", loop: true, fallback: { kind: "drone", frequencies: [41.2, 61.74, 98], waveform: "sawtooth" } },
  "amb.rain-gate": { kind: "file", channel: "ambience", src: "/audio/amb-rain-gate-v1.wav", loop: true, fallback: { kind: "noise", filterFrequency: 1450 } },
  "amb.tomb-wind": { kind: "file", channel: "ambience", src: "/audio/amb-tomb-wind-v1.wav", loop: true, fallback: { kind: "noise", filterFrequency: 520 } },
  "amb.blood-pulse": { kind: "file", channel: "ambience", src: "/audio/amb-blood-pulse-v1.wav", loop: true, fallback: { kind: "noise", filterFrequency: 180, pulseHz: 0.78 } },
  "sfx.ui-confirm": { kind: "file", channel: "sfx", src: "/audio/sfx-ui-confirm-v1.wav", loop: false, fallback: { kind: "tone", frequency: 520, endFrequency: 720, duration: 0.075, waveform: "sine" } },
  "sfx.ui-back": { kind: "file", channel: "sfx", src: "/audio/sfx-ui-back-v1.wav", loop: false, fallback: { kind: "tone", frequency: 420, endFrequency: 280, duration: 0.09, waveform: "sine" } },
  "sfx.scene-flash": { kind: "file", channel: "sfx", src: "/audio/sfx-scene-flash-v1.wav", loop: false, fallback: { kind: "tone", frequency: 960, endFrequency: 360, duration: 0.18, waveform: "triangle" } },
  "sfx.battle-hit": { kind: "file", channel: "sfx", src: "/audio/sfx-battle-hit-v1.wav", loop: false, fallback: { kind: "tone", frequency: 180, endFrequency: 62, duration: 0.16, waveform: "sawtooth" } },
  "sfx.battle-guard": { kind: "file", channel: "sfx", src: "/audio/sfx-battle-guard-v1.wav", loop: false, fallback: { kind: "tone", frequency: 280, endFrequency: 190, duration: 0.12, waveform: "square" } },
  "sfx.battle-heal": { kind: "file", channel: "sfx", src: "/audio/sfx-battle-heal-v1.wav", loop: false, fallback: { kind: "tone", frequency: 330, endFrequency: 660, duration: 0.28, waveform: "sine" } },
  "sfx.battle-danger": { kind: "file", channel: "sfx", src: "/audio/sfx-battle-danger-v1.wav", loop: false, fallback: { kind: "tone", frequency: 120, endFrequency: 42, duration: 0.38, waveform: "sawtooth" } },
} as const satisfies Record<string, AudioAssetDescriptor>;

export type AudioAssetKey = keyof typeof audioAssetManifest;
export type MusicAssetKey = Extract<AudioAssetKey, `bgm.${string}`>;
export type AmbienceAssetKey = Extract<AudioAssetKey, `amb.${string}`>;
export type SfxAssetKey = Extract<AudioAssetKey, `sfx.${string}`>;

export type SceneAudioProfile = { music: MusicAssetKey; ambience: AmbienceAssetKey };

export const defaultAudioSettings: AudioSettings = {
  muted: false,
  master: 70,
  music: 34,
  ambience: 28,
  sfx: 58,
};

export function clampAudioVolume(value: unknown, fallback: number): number {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.min(100, Math.round(numeric))) : fallback;
}

export function sanitizeAudioSettings(value: unknown): AudioSettings {
  if (!value || typeof value !== "object") return defaultAudioSettings;
  const candidate = value as Partial<AudioSettings>;
  return {
    muted: candidate.muted === true,
    master: clampAudioVolume(candidate.master, defaultAudioSettings.master),
    music: clampAudioVolume(candidate.music, defaultAudioSettings.music),
    ambience: clampAudioVolume(candidate.ambience, defaultAudioSettings.ambience),
    sfx: clampAudioVolume(candidate.sfx, defaultAudioSettings.sfx),
  };
}

export function sceneAudioProfile(input: { act?: number; background?: BackgroundAssetKey; inBattle?: boolean }): SceneAudioProfile {
  if (input.inBattle || input.act === 4 || input.background === "background.blood-chamber" || input.background === "background.blood-ruin") {
    return { music: "bgm.blood-awakening", ambience: "amb.blood-pulse" };
  }
  if (input.act === 3 || input.background === "background.fog-passage" || input.background === "background.trap-passage") {
    return { music: "bgm.fog-oath", ambience: "amb.tomb-wind" };
  }
  if (input.act === 1 || input.background === "background.tomb-gate" || input.background === "background.dawn-exit") {
    return { music: "bgm.tomb-depths", ambience: "amb.rain-gate" };
  }
  return { music: "bgm.tomb-depths", ambience: "amb.tomb-wind" };
}
