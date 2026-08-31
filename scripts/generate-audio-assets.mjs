import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sampleRate = 22_050;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "public", "audio");

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffff_ffff;
  };
}

function writeAscii(buffer, offset, value) {
  buffer.write(value, offset, value.length, "ascii");
}

function writeWave(filename, duration, render) {
  const sampleCount = Math.round(duration * sampleRate);
  const samples = new Float64Array(sampleCount);
  let peak = 0;
  for (let index = 0; index < sampleCount; index += 1) {
    const value = render(index / sampleRate, index, sampleCount);
    samples[index] = value;
    peak = Math.max(peak, Math.abs(value));
  }

  const normalization = peak > 0.88 ? 0.88 / peak : 1;
  const dataBytes = sampleCount * 2;
  const buffer = Buffer.alloc(44 + dataBytes);
  writeAscii(buffer, 0, "RIFF");
  buffer.writeUInt32LE(36 + dataBytes, 4);
  writeAscii(buffer, 8, "WAVE");
  writeAscii(buffer, 12, "fmt ");
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  writeAscii(buffer, 36, "data");
  buffer.writeUInt32LE(dataBytes, 40);
  for (let index = 0; index < sampleCount; index += 1) {
    const value = Math.max(-1, Math.min(1, samples[index] * normalization));
    buffer.writeInt16LE(Math.round(value * 32_767), 44 + index * 2);
  }
  writeFileSync(path.join(outputDirectory, filename), buffer);
}

function periodicFrequency(target, duration) {
  return Math.max(1, Math.round(target * duration)) / duration;
}

function makeSpectralBed({ duration, seed, low, high, count, slope = 0.5 }) {
  const random = seededRandom(seed);
  const bands = Array.from({ length: count }, (_, index) => {
    const ratio = (index + 0.5) / count;
    const frequency = periodicFrequency(low * Math.pow(high / low, ratio), duration);
    return {
      amplitude: (0.55 + random() * 0.45) / Math.pow(frequency / low, slope),
      frequency,
      phase: random() * Math.PI * 2,
    };
  });
  const scale = 1 / Math.sqrt(count);
  return (time) => bands.reduce((sum, band) => sum + Math.sin(Math.PI * 2 * band.frequency * time + band.phase) * band.amplitude, 0) * scale;
}

function makeDrone(duration, fundamentals, seed, tension = 0) {
  const random = seededRandom(seed);
  const tones = fundamentals.flatMap((target, index) => {
    const base = periodicFrequency(target, duration);
    const phase = random() * Math.PI * 2;
    return [
      { frequency: base, amplitude: 0.24 / (index + 1), phase },
      { frequency: periodicFrequency(base * 2.01, duration), amplitude: 0.07 / (index + 1), phase: phase * 0.7 },
      { frequency: periodicFrequency(base * (3 + tension * 0.018), duration), amplitude: 0.025 / (index + 1), phase: phase * 1.3 },
    ];
  });
  const air = makeSpectralBed({ duration, seed: seed + 97, low: 90, high: 620, count: 18, slope: 0.82 });
  return (time) => {
    const slowBreath = 0.78 + 0.14 * Math.sin(Math.PI * 2 * (2 / duration) * time - 0.8);
    const harmony = tones.reduce((sum, tone) => sum + Math.sin(Math.PI * 2 * tone.frequency * time + tone.phase) * tone.amplitude, 0);
    return harmony * slowBreath + air(time) * 0.035;
  };
}

function makeOneShot({ duration, seed, start, end, noise = 0, metallic = 0, pulse = 0 }) {
  const random = seededRandom(seed);
  let smoothedNoise = 0;
  return (time, index, sampleCount) => {
    const progress = index / Math.max(1, sampleCount - 1);
    const frequency = start * Math.pow(end / start, progress);
    const phase = Math.PI * 2 * duration * (start * progress + (end - start) * progress * progress * 0.5);
    const attack = Math.min(1, time / Math.min(0.018, duration * 0.18));
    const envelope = attack * Math.pow(1 - progress, 2.7);
    const white = random() * 2 - 1;
    smoothedNoise = smoothedNoise * 0.74 + white * 0.26;
    const body = Math.sin(phase) * 0.62 + Math.sin(phase * 1.997) * metallic + smoothedNoise * noise;
    const impact = pulse > 0 ? Math.sin(Math.PI * Math.min(1, progress / 0.12)) * Math.exp(-progress * 18) * pulse : 0;
    return (body + impact + Math.sin(Math.PI * 2 * frequency * time) * 0.08) * envelope;
  };
}

mkdirSync(outputDirectory, { recursive: true });

const musicDuration = 10;
writeWave("bgm-tomb-depths-v1.wav", musicDuration, makeDrone(musicDuration, [32.7, 49.05, 65.4], 0x584759, 0));
writeWave("bgm-fog-oath-v1.wav", musicDuration, makeDrone(musicDuration, [29.14, 43.7, 58.27], 0x464f47, 0.35));
writeWave("bgm-blood-awakening-v1.wav", musicDuration, makeDrone(musicDuration, [27.5, 41.2, 55], 0x424c44, 1));

const ambienceDuration = 8;
const rain = makeSpectralBed({ duration: ambienceDuration, seed: 0x5241494e, low: 520, high: 5_800, count: 56, slope: 0.2 });
writeWave("amb-rain-gate-v1.wav", ambienceDuration, (time) => rain(time) * (0.2 + 0.025 * Math.sin(Math.PI * 2 * time / ambienceDuration)));

const wind = makeSpectralBed({ duration: ambienceDuration, seed: 0x57494e44, low: 58, high: 920, count: 44, slope: 0.68 });
writeWave("amb-tomb-wind-v1.wav", ambienceDuration, (time) => wind(time) * (0.14 + 0.05 * Math.pow(Math.sin(Math.PI * 2 * time / ambienceDuration), 2)));

const blood = makeSpectralBed({ duration: ambienceDuration, seed: 0x50554c53, low: 34, high: 360, count: 32, slope: 0.92 });
writeWave("amb-blood-pulse-v1.wav", ambienceDuration, (time) => {
  const heartbeat = Math.pow(Math.max(0, Math.sin(Math.PI * 2 * 6 * time / ambienceDuration)), 12);
  const echo = Math.pow(Math.max(0, Math.sin(Math.PI * 2 * 6 * time / ambienceDuration - 0.72)), 18);
  return blood(time) * 0.1 + heartbeat * 0.22 + echo * 0.1;
});

writeWave("sfx-ui-confirm-v1.wav", 0.13, makeOneShot({ duration: 0.13, seed: 11, start: 480, end: 720, metallic: 0.12 }));
writeWave("sfx-ui-back-v1.wav", 0.15, makeOneShot({ duration: 0.15, seed: 12, start: 430, end: 250, metallic: 0.08 }));
writeWave("sfx-scene-flash-v1.wav", 0.24, makeOneShot({ duration: 0.24, seed: 13, start: 980, end: 240, noise: 0.32, metallic: 0.08 }));
writeWave("sfx-battle-hit-v1.wav", 0.22, makeOneShot({ duration: 0.22, seed: 14, start: 170, end: 52, noise: 0.3, metallic: 0.13, pulse: 0.65 }));
writeWave("sfx-battle-guard-v1.wav", 0.2, makeOneShot({ duration: 0.2, seed: 15, start: 340, end: 150, noise: 0.12, metallic: 0.38, pulse: 0.3 }));
writeWave("sfx-battle-heal-v1.wav", 0.4, makeOneShot({ duration: 0.4, seed: 16, start: 310, end: 690, noise: 0.04, metallic: 0.15 }));
writeWave("sfx-battle-danger-v1.wav", 0.48, makeOneShot({ duration: 0.48, seed: 17, start: 118, end: 38, noise: 0.25, metallic: 0.08, pulse: 0.72 }));

console.log(`Generated 13 original WAV assets in ${path.relative(root, outputDirectory)}`);
