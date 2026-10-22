"use client";

import type {
  RefObject,
} from "react";

import {
  gsap,
} from "gsap";

import {
  ScrollTrigger,
} from "gsap/ScrollTrigger";

import {
  useGSAP,
} from "@gsap/react";

if (
  typeof window !== "undefined"
) {
  gsap.registerPlugin(
    ScrollTrigger,
    useGSAP,
  );
}

export type FableProgressRef = {
  current: number;
};

export function useFableTimeline(
  sectionRef:
    RefObject<HTMLElement | null>,

  progressRef:
    FableProgressRef,

  reducedMotion = false,
) {
  useGSAP(
    () => {
      const section =
        sectionRef.current;

      if (!section) {
        return;
      }

      const stages =
        gsap.utils.toArray<HTMLElement>(
          "[data-fable-stage]",
          section,
        );

      const progressSegments =
        gsap.utils.toArray<HTMLElement>(
          "[data-fable-progress]",
          section,
        );

      const media =
        gsap.matchMedia();

      media.add(
        {
          desktop:
            "(min-width: 1024px)",

          reduce:
            "(prefers-reduced-motion: reduce)",
        },

        (context) => {
          const conditions =
            context.conditions as {
              desktop?: boolean;
              reduce?: boolean;
            };

          const shouldDisableSequence =
            !conditions.desktop ||
            conditions.reduce ||
            reducedMotion;

          if (
            shouldDisableSequence
          ) {
            progressRef.current = 1;

            gsap.set(stages, {
              autoAlpha: 0,
              y: 0,
            });

            const finalStage =
              stages[
                stages.length - 1
              ];

            if (finalStage) {
              gsap.set(
                finalStage,
                {
                  autoAlpha: 1,
                  y: 0,
                },
              );
            }

            gsap.set(
              progressSegments,
              {
                scaleX: 1,
              },
            );

            return;
          }

          progressRef.current = 0;

          gsap.set(stages, {
            autoAlpha: 0,
            y: 36,
          });

          gsap.set(stages[0], {
            autoAlpha: 1,
            y: 0,
          });

          gsap.set(
            progressSegments,
            {
              scaleX: 0,
              transformOrigin:
                "left center",
            },
          );

          const timeline =
            gsap.timeline({
              defaults: {
                ease: "none",
              },

              scrollTrigger: {
                id:
                  "bezteq-fable-sequence",

                trigger: section,

                start:
                  "top top",

                end: () => `+=${window.innerHeight * 5}`,

                pin: true,
                scrub: 1,

                anticipatePin: 1,

                invalidateOnRefresh:
                  true,

                onUpdate: (
                  scrollTrigger,
                ) => {
                  progressRef.current =
                    scrollTrigger.progress;
                },
              },
            });

          /*
           * Fill each bottom progress segment
           * during its associated stage.
           */
          progressSegments.forEach(
            (
              segment,
              index,
            ) => {
              timeline.to(
                segment,
                {
                  scaleX: 1,
                  duration: 0.82,
                  ease: "none",
                },
                index,
              );
            },
          );

          /*
           * Crossfade the written content while
           * the WebGL particles continue morphing.
           */
          for (
            let index = 1;
            index < stages.length;
            index += 1
          ) {
            const previousStage =
              stages[index - 1];

            const nextStage =
              stages[index];

            const transitionTime =
              index - 0.15;

            timeline
              .to(
                previousStage,
                {
                  autoAlpha: 0,
                  y: -28,
                  duration: 0.32,
                  ease: "power2.in",
                },
                transitionTime,
              )
              .fromTo(
                nextStage,
                {
                  autoAlpha: 0,
                  y: 38,
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.58,
                  ease: "power3.out",
                },
                transitionTime +
                  0.2,
              );
          }

          document.fonts?.ready.then(
            () => {
              ScrollTrigger.refresh();
            },
          );

          return () => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          };
        },
      );

      return () => {
        media.revert();
      };
    },
    {
      scope: sectionRef,
      dependencies: [
        reducedMotion,
      ],
      revertOnUpdate: true,
    },
  );
}