/**
 * Continuous CSS-only loop (Motion Spec Law 2 exception: linear, ambient).
 * Content is duplicated so the 50%-translate loop is seamless; pauses on
 * hover per Motion Spec §6.
 */
export function MarqueeBand({
  items,
  reverse = false,
  outline = false,
}: {
  items: string[];
  reverse?: boolean;
  outline?: boolean;
}) {
  return (
    <div className="marquee-row">
      <div className={`marquee-track gap-12 ${reverse ? "reverse" : ""}`}>
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`flex items-center gap-12 font-display text-[clamp(1.4rem,3vw,2.2rem)] tracking-[-0.01em] whitespace-nowrap ${
              outline
                ? "text-transparent [-webkit-text-stroke:1px_var(--ash)]"
                : "text-ash"
            }`}
          >
            {item}
            <span aria-hidden className="text-[0.6em] text-cobalt">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
