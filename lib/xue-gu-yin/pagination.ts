/** Reading pages preserve authored paragraphs; layout is supplied by the renderer. */
export type TextPage = { text: string; start: number; end: number; forced: boolean };
export type ReadingAnchor = { beatIndex: number; offset: number };
type Span = { start: number; end: number };

const pairs: Record<string, string> = { "“": "”", "‘": "’", "「": "」", "『": "』", "（": "）", "(": ")", "【": "】", "《": "》", "[": "]" };
const closing = new Set(Object.values(pairs));
const terminal = /[。！？!?…]/u;
const trailing = /[。！？!?…，,；;：:、.）)】\]》”’」』]/u;

function trimmedSpan(text: string, start: number, end: number): Span | null {
  const part = text.slice(start, end);
  const trimmed = part.trim();
  if (!trimmed) return null;
  const left = part.length - part.trimStart().length;
  return { start: start + left, end: start + left + trimmed.length };
}

function paragraphs(text: string): Span[] {
  const spans: Span[] = [];
  let start = 0;
  for (const match of text.matchAll(/\n[ \t]*\n+|\f/g)) {
    const span = trimmedSpan(text, start, match.index!);
    if (span) spans.push(span);
    start = match.index! + match[0].length;
  }
  const tail = trimmedSpan(text, start, text.length);
  if (tail) spans.push(tail);
  return spans;
}

function sentences(text: string, paragraph: Span): Span[] {
  const spans: Span[] = [];
  const stack: string[] = [];
  let start = paragraph.start;
  for (let index = start; index < paragraph.end; index++) {
    const char = text[index];
    if (pairs[char]) { stack.push(pairs[char]); continue; }
    if (closing.has(char)) {
      if (stack.at(-1) === char) stack.pop();
      continue;
    }
    // A decimal or Latin word with a dot is not a sentence boundary.
    const dot = char === "." && !(/[\p{L}\p{N}]/u.test(text[index - 1] ?? "") && /[\p{L}\p{N}]/u.test(text[index + 1] ?? ""));
    if (!terminal.test(char) && !dot) continue;
    let end = index + 1;
    while (end < paragraph.end && /[。！？!?….]/u.test(text[end])) end++;
    const quoted = stack.length > 0;
    while (end < paragraph.end && closing.has(text[end])) {
      if (stack.at(-1) === text[end]) stack.pop();
      end++;
    }
    // Keep quoted speech together, including a following attribution/continuation.
    if (stack.length || (quoted && end < paragraph.end && !/\s/u.test(text[end]))) {
      index = end - 1;
      continue;
    }
    spans.push({ start, end });
    start = end;
    index = end - 1;
  }
  if (start < paragraph.end) spans.push({ start, end: paragraph.end });
  return spans;
}

function splitAt(text: string, span: Span, separator: RegExp): Span[] {
  const result: Span[] = [];
  let start = span.start;
  for (const match of text.slice(span.start, span.end).matchAll(separator)) {
    let end = span.start + match.index! + match[0].length;
    while (end < span.end && closing.has(text[end])) end++;
    if (end > start) result.push({ start, end });
    start = end;
  }
  if (start < span.end) result.push({ start, end: span.end });
  return result;
}

function graphemes(text: string, span: Span): Span[] {
  const result: Span[] = [];
  let openingStart: number | null = null;
  for (const part of new Intl.Segmenter("zh", { granularity: "grapheme" }).segment(text.slice(span.start, span.end))) {
    const start = span.start + part.index;
    const end = start + part.segment.length;
    if (trailing.test(part.segment) && result.length && openingStart === null) {
      result[result.length - 1].end = end;
    } else if (pairs[part.segment]) {
      openingStart ??= start;
    } else {
      result.push({ start: openingStart ?? start, end });
      openingStart = null;
    }
  }
  if (openingStart !== null) {
    if (result.length) result[result.length - 1].end = span.end;
    else result.push({ start: openingStart, end: span.end });
  }
  return result;
}

function extend(left: Span | null, right: Span): Span {
  return { start: left?.start ?? right.start, end: right.end };
}

/** Only called after a complete sentence fails to fit on an otherwise empty page. */
function oversized(text: string, span: Span, fits: (text: string) => boolean, level = 0): Span[] {
  const separators = [/[；;]+/gu, /[，,：:、]+/gu, /\s+/gu];
  const parts = level < separators.length ? splitAt(text, span, separators[level]) : graphemes(text, span);
  const pages: Span[] = [];
  let current: Span | null = null;
  for (const part of parts) {
    if (!fits(text.slice(part.start, part.end)) && level < separators.length) {
      if (current) { pages.push(current); current = null; }
      pages.push(...oversized(text, part, fits, level + 1));
      continue;
    }
    if (current && !fits(text.slice(current.start, part.end))) {
      pages.push(current);
      current = null;
    }
    current = extend(current, part);
  }
  if (current) pages.push(current);
  return pages;
}

export function paginateNarrative(text: string, fits: (text: string) => boolean = () => true): TextPage[] {
  const pages: TextPage[] = [];
  const push = (span: Span, forced = false) => pages.push({ ...span, text: text.slice(span.start, span.end), forced });
  for (const paragraph of paragraphs(text)) {
    let current: Span | null = null;
    let count = 0;
    for (const sentence of sentences(text, paragraph)) {
      if (current && (count >= 2 || !fits(text.slice(current.start, sentence.end)))) {
        push(current);
        current = null;
        count = 0;
      }
      if (!fits(text.slice(sentence.start, sentence.end))) {
        if (current) { push(current); current = null; count = 0; }
        for (const part of oversized(text, sentence, fits)) push(part, true);
      } else {
        current = extend(current, sentence);
        count++;
      }
    }
    if (current) push(current);
  }
  return pages;
}

/** Select the page containing the saved text position, not a viewport-dependent ordinal. */
export function pageAtOffset(pages: Array<Pick<TextPage, "start" | "end">>, offset: number): number {
  const index = pages.findIndex((page) => page.end > offset);
  return index < 0 ? Math.max(0, pages.length - 1) : index;
}

export function frameAtAnchor(frames: Array<TextPage & { beatIndex: number }>, anchor?: ReadingAnchor): number {
  if (!anchor) return 0;
  const index = frames.findIndex((frame) => frame.beatIndex > anchor.beatIndex || (frame.beatIndex === anchor.beatIndex && frame.end > anchor.offset));
  return index < 0 ? Math.max(0, frames.length - 1) : index;
}
