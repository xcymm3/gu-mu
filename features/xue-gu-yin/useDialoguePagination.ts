import { useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { paginateNarrative, type TextPage } from "@/lib/xue-gu-yin/pagination";
import { createDialogueMeasurer } from "./NarrativeText";

export function useDialoguePagination(texts: string[], copyRef: RefObject<HTMLDivElement | null>, layoutKey: string) {
  const initial = useMemo(() => texts.map((text) => paginateNarrative(text)), [texts]);
  const [measured, setMeasured] = useState<{ texts: string[]; pages: TextPage[][] } | null>(null);
  const cache = useRef<{ texts: string[]; signature: string } | null>(null);

  useLayoutEffect(() => {
    const copy = copyRef.current;
    if (!copy) return;
    let disposed = false;
    let pending = 0;
    function measure(force = false) {
      if (disposed || !copy || copy.clientWidth < 1 || copy.clientHeight < 1) return;
      const paragraph = copy.querySelector("p");
      if (!paragraph) return;
      const style = getComputedStyle(paragraph);
      const box = getComputedStyle(copy);
      const signature = [copy.clientWidth, copy.clientHeight, box.padding, box.rowGap, style.font, style.letterSpacing, style.wordSpacing, style.getPropertyValue("text-wrap"), style.wordBreak, style.overflowWrap].join("|");
      if (!force && cache.current?.texts === texts && cache.current.signature === signature) return;
      const measurer = createDialogueMeasurer(copy);
      try {
        const pages = texts.map((text) => paginateNarrative(text, measurer.fits));
        cache.current = { texts, signature };
        setMeasured((previous) => previous?.texts === texts && JSON.stringify(previous.pages) === JSON.stringify(pages) ? previous : { texts, pages });
      } finally { measurer.dispose(); }
    }
    const schedule = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => measure());
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(copy);
    // Theme/font stylesheet changes need not resize the fixed-height dialogue box.
    const styles = new MutationObserver(() => {
      // A stylesheet can change an emphasized word without changing its paragraph's font.
      cache.current = null;
      schedule();
    });
    styles.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true });
    styles.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class", "data-theme"] });
    styles.observe(copy, { attributes: true, subtree: true, attributeFilter: ["style", "class"] });
    window.addEventListener("resize", schedule);
    const fontsChanged = () => measure(true);
    document.fonts.addEventListener("loadingdone", fontsChanged);
    // A resolved fonts.ready promise must not invalidate cached pages on every click.
    if (document.fonts.status === "loading") {
      void document.fonts.ready.then(() => { if (!disposed) measure(true); });
    }
    return () => {
      disposed = true;
      cancelAnimationFrame(pending);
      observer.disconnect();
      styles.disconnect();
      window.removeEventListener("resize", schedule);
      document.fonts.removeEventListener("loadingdone", fontsChanged);
    };
  }, [copyRef, layoutKey, texts]);

  return measured?.texts === texts ? measured.pages : initial;
}
