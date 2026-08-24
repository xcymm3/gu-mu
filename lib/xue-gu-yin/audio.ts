import type { BackgroundAssetKey } from "./assets.ts";

export type AudioChannel = "music" | "ambience" | "sfx";
export type AudioSettings = {
  muted: boolean;
  master: number;
  music: number;
  ambience: number;
  sfx: number;
};

type DroneDescriptor = {
  kind: "drone";
  channel: "music";
  frequencies: readonly number[];
  waveform: OscillatorType;
};

type NoiseDescriptor = {
  kind: "noise";
  channel: "ambience";
  filterFrequency: number;
  pulseHz?: number;
};

type ToneDescriptor = {
  kind: "tone";
  channel: "sfx";
  frequency: number;
  endFrequency: number;
  duration: number;
  waveform: OscillatorType;
};

export type AudioAssetDescriptor = DroneDescriptor | NoiseDescriptor | ToneDescriptor;

/**
 * 正式音频到位前的程序化占位清单。剧情只引用稳定资源键；以后可以把任意条目
 * 替换为 OGG/MP3 描述而无需修改场景、设置或播放控制器。
 */
export const audioAssetManifest = {
  "bgm.tomb-depths": { kind: "drone", channel: "music", frequencies: [55, 82.41, 110], waveform: "sine" },
  "bgm.fog-oath": { kind: "drone", channel: "music", frequencies: [46.25, 69.3, 92.5], waveform: "triangle" },
  "bgm.blood-awakening": { kind: "drone", channel: "music", frequencies: [41.2, 61.74, 98], waveform: "sawtooth" },
  "amb.rain-gate": { kind: "noise", channel: "ambience", filterFrequency: 1450 },
  "amb.tomb-wind": { kind: "noise", channel: "ambience", filterFrequency: 520 },
  "amb.blood-pulse": { kind: "noise", channel: "ambience", filterFrequency: 180, pulseHz: 0.78 },
  "sfx.ui-confirm": { kind: "tone", channel: "sfx", frequency: 520, endFrequency: 720, duration: 0.075, waveform: "sine" },
  "sfx.ui-back": { kind: "tone", channel: "sfx", frequency: 420, endFrequency: 280, duration: 0.09, waveform: "sine" },
  "sfx.scene-flash": { kind: "tone", channel: "sfx", frequency: 960, endFrequency: 360, duration: 0.18, waveform: "triangle" },
  "sfx.battle-hit": { kind: "tone", channel: "sfx", frequency: 180, endFrequency: 62, duration: 0.16, waveform: "sawtooth" },
  "sfx.battle-guard": { kind: "tone", channel: "sfx", frequency: 280, endFrequency: 190, duration: 0.12, waveform: "square" },
  "sfx.battle-heal": { kind: "tone", channel: "sfx", frequency: 330, endFrequency: 660, duration: 0.28, waveform: "sine" },
  "sfx.battle-danger": { kind: "tone", channel: "sfx", frequency: 120, endFrequency: 42, duration: 0.38, waveform: "sawtooth" },
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
