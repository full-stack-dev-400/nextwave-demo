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
  typeof window !==
  "undefined"
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

      if (
        stages.length === 0
      ) {
        return;
      }

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

          /*
           * Reduced-motion/mobile fallback:
           * show the final BEZTEQ stage.
           */
          if (
            shouldDisableSequence
          ) {
            progressRef.current = 1;

            gsap.set(
              stages,
              {
                autoAlpha: 0,
                y: 0,
              },
            );

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
                transformOrigin:
                  "left center",
              },
            );

            return;
          }

          progressRef.current = 0;

          /*
           * Initial stage state.
           */
          gsap.set(
            stages,
            {
              autoAlpha: 0,
              y: 34,
            },
          );

          gsap.set(
            stages[0],
            {
              autoAlpha: 1,
              y: 0,
            },
          );

          gsap.set(
            progressSegments,
            {
              scaleX: 0,
              transformOrigin:
                "left center",
            },
          );

          /*
           * Optional lower readouts.
           * These selectors are ignored safely when
           * the elements are not present.
           */
          stages.forEach(
            (
              stage,
              index,
            ) => {
              const leftReadout =
                stage.querySelector<HTMLElement>(
                  "[data-readout-left]",
                );

              const rightReadout =
                stage.querySelector<HTMLElement>(
                  "[data-readout-right]",
                );

              if (leftReadout) {
                gsap.set(
                  leftReadout,
                  {
                    autoAlpha:
                      index === 0
                        ? 1
                        : 0,

                    x:
                      index === 0
                        ? 0
                        : -80,
                  },
                );
              }

              if (rightReadout) {
                gsap.set(
                  rightReadout,
                  {
                    autoAlpha:
                      index === 0
                        ? 1
                        : 0,

                    x:
                      index === 0
                        ? 0
                        : 80,
                  },
                );
              }
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

                end: () =>
                  `+=${
                    window.innerHeight *
                    5.5
                  }`,

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

                onRefresh: (
                  scrollTrigger,
                ) => {
                  progressRef.current =
                    scrollTrigger.progress;
                },
              },
            });

          /*
           * Every visual/text stage receives
           * one full timeline unit.
           */
          progressSegments.forEach(
            (
              progressSegment,
              index,
            ) => {
              timeline.to(
                progressSegment,
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
           * Stage heading and paragraph transitions.
           */
          for (
            let index = 1;
            index < stages.length;
            index += 1
          ) {
            const previousStage =
              stages[
                index - 1
              ];

            const nextStage =
              stages[index];

            const transitionTime =
              index - 0.16;

            const previousLeft =
              previousStage
                .querySelector<HTMLElement>(
                  "[data-readout-left]",
                );

            const previousRight =
              previousStage
                .querySelector<HTMLElement>(
                  "[data-readout-right]",
                );

            const nextLeft =
              nextStage
                .querySelector<HTMLElement>(
                  "[data-readout-left]",
                );

            const nextRight =
              nextStage
                .querySelector<HTMLElement>(
                  "[data-readout-right]",
                );

            timeline
              .to(
                previousStage,
                {
                  autoAlpha: 0,
                  y: -26,
                  duration: 0.3,
                  ease: "power2.in",
                },
                transitionTime,
              )

              .fromTo(
                nextStage,
                {
                  autoAlpha: 0,
                  y: 36,
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

            /*
             * Lower text exits left and right.
             */
            if (previousLeft) {
              timeline.to(
                previousLeft,
                {
                  autoAlpha: 0,
                  x: -70,
                  duration: 0.28,
                  ease: "power2.in",
                },
                transitionTime,
              );
            }

            if (previousRight) {
              timeline.to(
                previousRight,
                {
                  autoAlpha: 0,
                  x: 70,
                  duration: 0.28,
                  ease: "power2.in",
                },
                transitionTime,
              );
            }

            /*
             * New lower text slides into place.
             */
            if (nextLeft) {
              timeline.fromTo(
                nextLeft,
                {
                  autoAlpha: 0,
                  x: -90,
                },
                {
                  autoAlpha: 1,
                  x: 0,
                  duration: 0.62,
                  ease: "power3.out",
                },
                transitionTime +
                  0.24,
              );
            }

            if (nextRight) {
              timeline.fromTo(
                nextRight,
                {
                  autoAlpha: 0,
                  x: 90,
                },
                {
                  autoAlpha: 1,
                  x: 0,
                  duration: 0.62,
                  ease: "power3.out",
                },
                transitionTime +
                  0.24,
              );
            }
          }

          document.fonts?.ready.then(
            () => {
              ScrollTrigger.refresh();
            },
          );

          return () => {
            timeline
              .scrollTrigger
              ?.kill();

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