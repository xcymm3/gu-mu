"use client";

import { useEffect, useState } from "react";

import {
  audioAssetManifest,
  defaultAudioSettings,
  type AmbienceAssetKey,
  type AudioAssetKey,
  type AudioAssetDescriptor,
  type AudioSettings,
  type MusicAssetKey,
  type SceneAudioProfile,
  type SfxAssetKey,
} from "@/lib/xue-gu-yin/audio";

type ActiveLoop = {
  gain: GainNode;
  sources: AudioScheduledSourceNode[];
};

function gainValue(value: number): number {
  return Math.pow(value / 100, 1.55);
}

export class VisualNovelAudioEngine {
  private context: AudioContext | null = null;
  private masterBus: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private ambienceBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private musicLoop: ActiveLoop | null = null;
  private ambienceLoop: ActiveLoop | null = null;
  private currentMusic: MusicAssetKey | null = null;
  private currentAmbience: AmbienceAssetKey | null = null;
  private desiredProfile: SceneAudioProfile | null = null;
  private settings: AudioSettings = defaultAudioSettings;
  private bufferCache = new Map<AudioAssetKey, Promise<AudioBuffer | null>>();
  private musicRevision = 0;
  private ambienceRevision = 0;

  async unlock() {
    if (!this.context) this.createContext();
    if (this.context?.state === "suspended") await this.context.resume();
    if (this.desiredProfile) this.applyScene(this.desiredProfile);
    void this.loadBuffer("sfx.ui-confirm");
  }

  configure(settings: AudioSettings) {
    this.settings = settings;
    if (!this.context || !this.masterBus || !this.musicBus || !this.ambienceBus || !this.sfxBus) return;
    const now = this.context.currentTime;
    this.masterBus.gain.setTargetAtTime(settings.muted ? 0 : gainValue(settings.master), now, 0.025);
    this.musicBus.gain.setTargetAtTime(gainValue(settings.music) * 0.065, now, 0.025);
    this.ambienceBus.gain.setTargetAtTime(gainValue(settings.ambience) * 0.11, now, 0.025);
    this.sfxBus.gain.setTargetAtTime(gainValue(settings.sfx) * 0.2, now, 0.015);
  }

  setScene(profile: SceneAudioProfile) {
    this.desiredProfile = profile;
    if (this.context?.state === "running") this.applyScene(profile);
  }

  playSfx(key: SfxAssetKey) {
    if (!this.context || !this.sfxBus || this.context.state !== "running") return;
    void this.playFileSfx(key);
  }

  destroy() {
    this.stopLoop(this.musicLoop, 0);
    this.stopLoop(this.ambienceLoop, 0);
    this.musicLoop = null;
    this.ambienceLoop = null;
    this.currentMusic = null;
    this.currentAmbience = null;
    this.musicRevision += 1;
    this.ambienceRevision += 1;
    this.bufferCache.clear();
    if (this.context && this.context.state !== "closed") void this.context.close();
    this.context = null;
  }

  private createContext() {
    const AudioContextClass = window.AudioContext;
    this.context = new AudioContextClass();
    this.masterBus = this.context.createGain();
    this.musicBus = this.context.createGain();
    this.ambienceBus = this.context.createGain();
    this.sfxBus = this.context.createGain();
    this.musicBus.connect(this.masterBus);
    this.ambienceBus.connect(this.masterBus);
    this.sfxBus.connect(this.masterBus);
    this.masterBus.connect(this.context.destination);
    this.configure(this.settings);
  }

  private applyScene(profile: SceneAudioProfile) {
    if (profile.music !== this.currentMusic) {
      this.stopLoop(this.musicLoop, 0.65);
      this.musicLoop = null;
      this.currentMusic = profile.music;
      const revision = ++this.musicRevision;
      void this.startFileLoop(profile.music, "music").then((loop) => {
        if (!loop) return;
        if (revision !== this.musicRevision || profile.music !== this.currentMusic) {
          this.stopLoop(loop, 0);
          return;
        }
        this.musicLoop = loop;
      });
    }
    if (profile.ambience !== this.currentAmbience) {
      this.stopLoop(this.ambienceLoop, 0.45);
      this.ambienceLoop = null;
      this.currentAmbience = profile.ambience;
      const revision = ++this.ambienceRevision;
      void this.startFileLoop(profile.ambience, "ambience").then((loop) => {
        if (!loop) return;
        if (revision !== this.ambienceRevision || profile.ambience !== this.currentAmbience) {
          this.stopLoop(loop, 0);
          return;
        }
        this.ambienceLoop = loop;
      });
    }
  }

  private async startFileLoop(key: MusicAssetKey | AmbienceAssetKey, channel: "music" | "ambience"): Promise<ActiveLoop | null> {
    const descriptor = audioAssetManifest[key];
    const buffer = await this.loadBuffer(key);
    if (!this.context || this.context.state === "closed") return null;
    const bus = channel === "music" ? this.musicBus : this.ambienceBus;
    if (!bus) return null;
    if (!buffer) return this.startFallbackLoop(descriptor.fallback, bus);

    const gain = this.context.createGain();
    const now = this.context.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(1, now + 0.8);
    gain.connect(bus);
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = descriptor.loop;
    source.connect(gain);
    source.start();
    return { gain, sources: [source] };
  }

  private startFallbackLoop(fallback: AudioAssetDescriptor["fallback"], bus: GainNode): ActiveLoop | null {
    if (!this.context) return null;
    if (fallback.kind === "drone") {
      const gain = this.context.createGain();
      const now = this.context.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(1, now + 0.8);
      gain.connect(bus);
      const sources = fallback.frequencies.map((frequency, index) => {
        const oscillator = this.context!.createOscillator();
        oscillator.type = fallback.waveform;
        oscillator.frequency.value = frequency;
        oscillator.detune.value = index % 2 ? -4 : 3;
        oscillator.connect(gain);
        oscillator.start();
        return oscillator;
      });
      return { gain, sources };
    }
    if (fallback.kind !== "noise") return null;

    const length = this.context.sampleRate * 2;
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let index = 0; index < length; index += 1) {
      const white = Math.random() * 2 - 1;
      last = last * 0.985 + white * 0.015;
      data[index] = white * 0.22 + last * 0.78;
    }
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = buffer;
    source.loop = true;
    filter.type = "lowpass";
    filter.frequency.value = fallback.filterFrequency;
    gain.gain.value = 1;
    source.connect(filter).connect(gain).connect(bus);
    const sources: AudioScheduledSourceNode[] = [source];
    if (fallback.pulseHz) {
      const pulse = this.context.createOscillator();
      const pulseDepth = this.context.createGain();
      pulse.frequency.value = fallback.pulseHz;
      pulseDepth.gain.value = 0.28;
      pulse.connect(pulseDepth).connect(gain.gain);
      pulse.start();
      sources.push(pulse);
    }
    source.start();
    return { gain, sources };
  }

  private async playFileSfx(key: SfxAssetKey) {
    const descriptor = audioAssetManifest[key];
    const buffer = await this.loadBuffer(key);
    if (!this.context || !this.sfxBus || this.context.state !== "running") return;
    if (!buffer) {
      if (descriptor.fallback.kind === "tone") this.playToneFallback(descriptor.fallback);
      return;
    }
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.sfxBus);
    source.start();
  }

  private playToneFallback(descriptor: Extract<AudioAssetDescriptor["fallback"], { kind: "tone" }>) {
    if (!this.context || !this.sfxBus) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = descriptor.waveform;
    oscillator.frequency.setValueAtTime(descriptor.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, descriptor.endFrequency), now + descriptor.duration);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.72, now + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + descriptor.duration);
    oscillator.connect(envelope).connect(this.sfxBus);
    oscillator.start(now);
    oscillator.stop(now + descriptor.duration + 0.02);
  }

  private loadBuffer(key: AudioAssetKey): Promise<AudioBuffer | null> {
    const cached = this.bufferCache.get(key);
    if (cached) return cached;
    const promise = this.fetchAndDecode(key).catch(() => null);
    this.bufferCache.set(key, promise);
    return promise;
  }

  private async fetchAndDecode(key: AudioAssetKey): Promise<AudioBuffer | null> {
    const context = this.context;
    if (!context || context.state === "closed") return null;
    const response = await fetch(audioAssetManifest[key].src);
    if (!response.ok) throw new Error(`Audio asset ${key} returned ${response.status}`);
    const data = await response.arrayBuffer();
    return context.decodeAudioData(data);
  }

  private stopLoop(loop: ActiveLoop | null, fadeSeconds: number) {
    if (!loop || !this.context) return;
    const now = this.context.currentTime;
    loop.gain.gain.cancelScheduledValues(now);
    loop.gain.gain.setValueAtTime(Math.max(0.0001, loop.gain.gain.value), now);
    loop.gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.01, fadeSeconds));
    for (const source of loop.sources) {
      try { source.stop(now + Math.max(0.02, fadeSeconds + 0.02)); } catch { /* source may already be stopped */ }
    }
  }
}

export function useVisualNovelAudio(settings: AudioSettings): VisualNovelAudioEngine {
  const [engine] = useState(() => new VisualNovelAudioEngine());
  useEffect(() => { engine.configure(settings); }, [engine, settings]);
  useEffect(() => () => engine.destroy(), [engine]);
  return engine;
}
