import Image from "next/image";
import Link from "next/link";
import type { Study } from "@/lib/work-data";

/**
 * Shared case-study card used across:
 * - Home Featured Work
 * - Service Proof sections
 * - Work index
 *
 * If a study contains an image, the real project image is rendered.
 * Otherwise, the existing work-media placeholder remains.
 */
export function WorkCard({
  study,
  spanFull = false,
}: {
  study: Study;
  spanFull?: boolean;
}) {
  return (
    <Link
      href={`/work/${study.slug}`}
      data-hover
      data-label="VIEW"
      className={`work-card notched group relative block overflow-hidden rounded-lg ${
        spanFull
          ? "aspect-[4/3] md:col-span-2 md:aspect-[8/5]"
          : "aspect-[4/3]"
      }`}
    >
      {/* Project media */}
      {study.image ? (
        <div className="work-media absolute inset-0">
          <Image
            src={study.image.src}
            alt={study.image.alt}
            fill
            sizes={
              spanFull
                ? "(max-width: 768px) 100vw, 1280px"
                : "(max-width: 768px) 100vw, 640px"
            }
            className="object-cover"
            style={{
              objectPosition: study.image.objectPosition ?? "center",
            }}
          />
        </div>
      ) : (
        <div className="work-media absolute inset-0" />
      )}

      {/* Dark overlay for text readability */}
      <div className="work-grad absolute inset-0" />

      {/* Extra bottom gradient for real screenshots */}
      {study.image && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent"
        />
      )}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
        <div className="mb-[0.7rem] font-mono text-[0.68rem] uppercase tracking-[0.12em] text-signal">
          {study.tag}
        </div>

        <h3 className="max-w-[26ch] font-display text-[clamp(1.3rem,2.6vw,2rem)] font-medium tracking-[-0.02em] text-bone">
          {study.title}
        </h3>

        <div className="mt-[0.4rem] max-w-[52ch] text-[0.9rem] text-ash">
          {study.outcome}
        </div>
      </div>
    </Link>
  );
}