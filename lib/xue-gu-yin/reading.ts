export type BacklogEntry = {
  id: string;
  sceneId: string;
  sceneTitle: string;
  speaker: string;
  text: string;
};

export function readingFrameKey(sceneId: string, beatIndex: number, pageIndex: number, text: string): string {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${sceneId}:${beatIndex}:${pageIndex}:${(hash >>> 0).toString(36)}`;
}

export function appendBacklog(entries: BacklogEntry[], entry: BacklogEntry, limit = 160): BacklogEntry[] {
  if (!entry.text.trim() || entries.at(-1)?.id === entry.id) return entries;
  return [...entries, entry].slice(-limit);
}

export function autoAdvanceDelay(text: string): number {
  return Math.min(3600, 900 + text.replace(/\s/g, "").length * 24);
}

export function canRunReadingMode(input: {
  hasOverlay: boolean;
  inBattle: boolean;
  hasPendingResult: boolean;
  hasBlockingAction: boolean;
}): boolean {
  return !input.hasOverlay && !input.inBattle && !input.hasPendingResult && !input.hasBlockingAction;
}
