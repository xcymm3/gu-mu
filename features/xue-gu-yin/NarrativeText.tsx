import { storyPresentation } from "@/lib/xue-gu-yin/game";

const names = new Set(storyPresentation.names);
const terms = new Set(storyPresentation.criticalTerms);
const pattern = new RegExp(`(${[...names, ...terms].join("|")})`, "g");

function runs(text: string) {
  return text.split(pattern).map((text) => ({ text, className: names.has(text) ? "story-name" : terms.has(text) ? "story-critical" : "" }));
}

export function NarrativePage({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n|\f/).filter(Boolean).map((paragraph, index) => <p key={index}>{runs(paragraph).map((run, part) => run.className === "story-name"
    ? <strong className={run.className} key={part}>{run.text}</strong>
    : run.className ? <span className={run.className} key={part}>{run.text}</span> : run.text)}</p>)}</>;
}

/** An inert sibling uses the same CSS and emphasis as the visible text, without HTML injection. */
export function createDialogueMeasurer(copy: HTMLElement) {
  const probe = copy.cloneNode(false) as HTMLElement;
  const width = copy.getBoundingClientRect().width;
  const height = copy.clientHeight;
  probe.removeAttribute("id");
  probe.setAttribute("aria-hidden", "true");
  probe.inert = true;
  probe.classList.remove("vn-text-reveal", "is-scene-fade");
  Object.assign(probe.style, {
    position: "fixed", top: "0", left: "0", width: `${width}px`, maxWidth: "none",
    height: "auto", maxHeight: "none", minHeight: "0", visibility: "hidden",
    pointerEvents: "none", animation: "none", transition: "none", transform: "none",
  });
  copy.parentElement!.append(probe);
  const cache = new Map<string, boolean>();
  return {
    fits(text: string) {
      const cached = cache.get(text);
      if (cached !== undefined) return cached;
      probe.replaceChildren();
      for (const paragraph of text.split(/\n\s*\n|\f/).filter(Boolean)) {
        const p = document.createElement("p");
        for (const run of runs(paragraph)) {
          if (!run.className) p.append(document.createTextNode(run.text));
          else {
            const span = document.createElement(run.className === "story-name" ? "strong" : "span");
            span.className = run.className;
            span.textContent = run.text;
            p.append(span);
          }
        }
        probe.append(p);
      }
      const fits = probe.getBoundingClientRect().height <= height - 1 && probe.scrollWidth <= copy.clientWidth + 1;
      cache.set(text, fits);
      return fits;
    },
    dispose() { probe.remove(); },
  };
}
