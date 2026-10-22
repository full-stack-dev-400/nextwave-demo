"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDegradation } from "@/providers/DegradationProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ProjectItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
};

type CardData = {
  href: string;
  projectIndex: number;
  baseAngle: number;
  hoverScale: number;
  targetHoverScale: number;
};

type CardMesh = THREE.Mesh<
  THREE.PlaneGeometry,
  THREE.ShaderMaterial
>;

const ITEMS: ProjectItem[] = [
  {
    id: "01",
    title: "Fleet Operations",
    category: "Custom Software",
    image: "/images/work/helix/fleet.webp",
    href: "/work/fleet-platform",
  },
  {
    id: "02",
    title: "Retail POS",
    category: "Point of Sale",
    image: "/images/work/helix/pos.webp",
    href: "/work/retail-pos",
  },
  {
    id: "03",
    title: "Fintech Platform",
    category: "Website",
    image: "/images/work/helix/fintech.webp",
    href: "/work/fintech-web",
  },
  {
    id: "04",
    title: "Commerce System",
    category: "E-commerce",
    image: "/images/work/helix/commerce.webp",
    href: "/work",
  },
  {
    id: "05",
    title: "CRM Automation",
    category: "Growth System",
    image: "/images/work/helix/crm.webp",
    href: "/work",
  },
  {
    id: "06",
    title: "WordPress Platform",
    category: "Web System",
    image: "/images/work/helix/wordpress.webp",
    href: "/work",
  },
  {
    id: "07",
    title: "Product Interface",
    category: "Product Design",
    image: "/images/work/helix/product.webp",
    href: "/work",
  },
  {
    id: "08",
    title: "Lead Engine",
    category: "Acquisition",
    image: "/images/work/helix/leads.webp",
    href: "/work",
  },
  {
    id: "09",
    title: "Brand Experience",
    category: "Digital Identity",
    image: "/images/work/helix/brand.webp",
    href: "/work",
  },
];

/* -------------------------------------------------------------------------- */
/*                                CARD SETTINGS                               */
/* -------------------------------------------------------------------------- */

const CARD_WIDTH = 2.55;
const CARD_HEIGHT = 1.68;

/*
 * We create two copies of the project list around one ring.
 *
 * Project 01 duplicate is exactly opposite project 01,
 * so you never see the duplicate beside itself.
 *
 * This gives us a continuous circular carousel.
 */
const RING_REPEAT_COUNT = 2;
const TOTAL_CARDS =
  ITEMS.length * RING_REPEAT_COUNT;

const RING_STEP =
  (Math.PI * 2) / TOTAL_CARDS;

/* -------------------------------------------------------------------------- */
/*                               3D RING SHAPE                                */
/* -------------------------------------------------------------------------- */

/*
 * Horizontal radius controls how wide the gallery looks.
 */
const RING_X_RADIUS = 8.2;

/*
 * Separate depth radius gives us a wide elliptical cylinder
 * rather than a very deep perfect circle.
 *
 * This is important for the TRIONN-style perspective.
 */
const RING_Z_RADIUS = 3.15;

/*
 * Vertical location of the project strip.
 */
const RING_BASE_Y = -2.05;

/*
 * Side cards sit lower than center cards.
 */
const BOWL_DEPTH = 1.12;

/*
 * Cards rotate toward the circular path.
 *
 * Keep below 1 so side cards don't become too extreme.
 */
const CARD_YAW_STRENGTH = 0.82;

/*
 * Only the front portion of the circular gallery is visible.
 */
const VISIBLE_ANGLE_START = 1.48;
const VISIBLE_ANGLE_END = 2.08;

/*
 * Scroll rotation.
 *
 * ~0.9 rotation across the pinned section.
 */
const TOTAL_SCROLL_ROTATION =
  Math.PI * 2 * 0.92;

const INITIAL_RING_ANGLE = -0.34;

/* -------------------------------------------------------------------------- */
/*                                GUIDE LINES                                 */
/* -------------------------------------------------------------------------- */

const LINE_POINTS = 180;
const LINE_ANGLE = 1.82;

/* -------------------------------------------------------------------------- */
/*                                   SHADERS                                  */
/* -------------------------------------------------------------------------- */

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uHover;
  uniform float uRadius;
  uniform vec2 uSize;

  varying vec2 vUv;

  void main() {
    vec2 sampleUv = vUv;

    if (!gl_FrontFacing) {
      sampleUv.x = 1.0 - sampleUv.x;
    }

    vec2 pixelPosition =
      (sampleUv - 0.5) * uSize;

    vec2 distanceVector =
      abs(pixelPosition) -
      uSize * 0.5 +
      uRadius;

    float signedDistance =
      min(
        max(
          distanceVector.x,
          distanceVector.y
        ),
        0.0
      ) +
      length(
        max(
          distanceVector,
          0.0
        )
      ) -
      uRadius;

    float cornerAlpha =
      1.0 -
      smoothstep(
        -0.025,
        0.025,
        signedDistance
      );

    if (cornerAlpha <= 0.001) {
      discard;
    }

    vec4 imageColor =
      texture2D(
        uMap,
        sampleUv
      );

    vec3 finalColor =
      mix(
        imageColor.rgb,
        imageColor.rgb * 1.08,
        uHover
      );

    gl_FragColor =
      vec4(
        finalColor,
        imageColor.a *
        cornerAlpha *
        uOpacity
      );
  }
`;

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function clamp01(value: number) {
  return THREE.MathUtils.clamp(
    value,
    0,
    1,
  );
}

function smoothStep(
  start: number,
  end: number,
  value: number,
) {
  if (start === end) {
    return value >= end ? 1 : 0;
  }

  const progress = clamp01(
    (value - start) /
      (end - start),
  );

  return (
    progress *
    progress *
    (3 - 2 * progress)
  );
}

function normalizeAngle(
  angle: number,
) {
  return Math.atan2(
    Math.sin(angle),
    Math.cos(angle),
  );
}

function getCardData(
  mesh: CardMesh,
) {
  return mesh.userData as CardData;
}

/*
 * TRIONN-like shallow curved vertical positioning.
 *
 * Center = highest.
 * Outer cards = progressively lower.
 */
function getRingY(
  angle: number,
) {
  const normalized =
    Math.min(
      Math.abs(angle) /
        Math.PI,
      1,
    );

  const curve =
    1 -
    Math.cos(
      normalized *
        Math.PI *
        0.88,
    );

  return (
    RING_BASE_Y -
    curve *
      BOWL_DEPTH
  );
}

function getRingPosition(
  angle: number,
) {
  const x =
    Math.sin(angle) *
    RING_X_RADIUS;

  /*
   * Center card = Z 0.
   *
   * Side cards travel backward,
   * creating the cylindrical perspective.
   */
  const z =
    (
      Math.cos(angle) -
      1
    ) *
    RING_Z_RADIUS;

  const y =
    getRingY(angle);

  return {
    x,
    y,
    z,
  };
}

function createFallbackTexture(
  label: string,
) {
  const canvas =
    document.createElement(
      "canvas",
    );

  canvas.width = 1400;
  canvas.height = 900;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return new THREE.Texture();
  }

  const gradient =
    context.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height,
    );

  gradient.addColorStop(
    0,
    "#0b0c0e",
  );

  gradient.addColorStop(
    0.58,
    "#141a22",
  );

  gradient.addColorStop(
    1,
    "#00cae0",
  );

  context.fillStyle =
    gradient;

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  context.strokeStyle =
    "rgba(255,255,255,0.09)";

  for (
    let x = 0;
    x <= canvas.width;
    x += 90
  ) {
    context.beginPath();

    context.moveTo(x, 0);

    context.lineTo(
      x,
      canvas.height,
    );

    context.stroke();
  }

  for (
    let y = 0;
    y <= canvas.height;
    y += 90
  ) {
    context.beginPath();

    context.moveTo(0, y);

    context.lineTo(
      canvas.width,
      y,
    );

    context.stroke();
  }

  context.fillStyle =
    "#f2f0ea";

  context.font =
    "600 76px Arial, sans-serif";

  context.fillText(
    label.toUpperCase(),
    70,
    760,
  );

  const texture =
    new THREE.CanvasTexture(
      canvas,
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  return texture;
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M4 16 16 4M7 4h9v9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export function SystemsInMotion() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const canvasMountRef =
    useRef<HTMLDivElement>(null);

  const {
    prefersReducedMotion,
  } = useDegradation();

  useEffect(() => {
    const section =
      sectionRef.current;

    const canvasMount =
      canvasMountRef.current;

    if (
      !section ||
      !canvasMount ||
      prefersReducedMotion ||
      !window
        .matchMedia(
          "(min-width: 1024px)",
        )
        .matches
    ) {
      return;
    }

    let disposed = false;
    let rafId = 0;
    let active = false;

    let targetProgress = 0;
    let currentProgress = 0;

    let hoveredCard:
      | CardMesh
      | null = null;

    let interactionEnabled =
      false;

    /* ---------------------------------------------------------------------- */
    /*                                  DOM                                   */
    /* ---------------------------------------------------------------------- */

    const title =
      section.querySelector<HTMLElement>(
        "[data-motion-title]",
      );

    const titleOne =
      section.querySelector<HTMLElement>(
        "[data-motion-line-one]",
      );

    const titleTwo =
      section.querySelector<HTMLElement>(
        "[data-motion-line-two]",
      );

    const description =
      section.querySelector<HTMLElement>(
        "[data-motion-description]",
      );

    const leftCopy =
      section.querySelector<HTMLElement>(
        "[data-motion-left]",
      );

    const rightLink =
      section.querySelector<HTMLElement>(
        "[data-motion-link]",
      );

    /* ---------------------------------------------------------------------- */
    /*                                THREE.JS                                */
    /* ---------------------------------------------------------------------- */

    const scene =
      new THREE.Scene();

    const camera =
      new THREE.PerspectiveCamera(
        32,
        1,
        0.1,
        100,
      );

    camera.position.set(
      0,
      0,
      14.5,
    );

    const renderer =
      new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference:
          "high-performance",
      });

    renderer.setClearColor(
      0x000000,
      0,
    );

    renderer.outputColorSpace =
      THREE.SRGBColorSpace;

    renderer.domElement.className =
      "absolute inset-0 h-full w-full";

    renderer.domElement.setAttribute(
      "aria-hidden",
      "true",
    );

    canvasMount.appendChild(
      renderer.domElement,
    );

    const textureLoader =
      new THREE.TextureLoader();

    const cards: CardMesh[] = [];

    const loadedTextures:
      THREE.Texture[] = [];

    /* ---------------------------------------------------------------------- */
    /*                              GUIDE LINES                               */
    /* ---------------------------------------------------------------------- */

    const topLineGeometry =
      new THREE.BufferGeometry();

    const bottomLineGeometry =
      new THREE.BufferGeometry();

    topLineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(
          LINE_POINTS * 3,
        ),
        3,
      ),
    );

    bottomLineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array(
          LINE_POINTS * 3,
        ),
        3,
      ),
    );

    const lineMaterialTop =
      new THREE.LineBasicMaterial({
        color: 0x454545,
        transparent: true,
        opacity: 0,
      });

    const lineMaterialBottom =
      new THREE.LineBasicMaterial({
        color: 0x454545,
        transparent: true,
        opacity: 0,
      });

    const topLine =
      new THREE.Line(
        topLineGeometry,
        lineMaterialTop,
      );

    const bottomLine =
      new THREE.Line(
        bottomLineGeometry,
        lineMaterialBottom,
      );

    scene.add(
      topLine,
      bottomLine,
    );

    const updateGuideGeometry =
      (
        geometry:
          THREE.BufferGeometry,
        verticalOffset: number,
      ) => {
        const positions =
          geometry.getAttribute(
            "position",
          ) as THREE.BufferAttribute;

        for (
          let index = 0;
          index <
          LINE_POINTS;
          index += 1
        ) {
          const fraction =
            index /
            (LINE_POINTS - 1);

          const angle =
            THREE.MathUtils.lerp(
              -LINE_ANGLE,
              LINE_ANGLE,
              fraction,
            );

          const point =
            getRingPosition(
              angle,
            );

          positions.setXYZ(
            index,
            point.x,
            point.y +
              verticalOffset,
            point.z - 0.12,
          );
        }

        positions.needsUpdate =
          true;
      };

    updateGuideGeometry(
      topLineGeometry,
      CARD_HEIGHT * 0.64,
    );

    updateGuideGeometry(
      bottomLineGeometry,
      -CARD_HEIGHT * 0.64,
    );

    /* ---------------------------------------------------------------------- */
    /*                             LOAD TEXTURES                              */
    /* ---------------------------------------------------------------------- */

    const loadTexture =
      async (
        item: ProjectItem,
      ) => {
        try {
          const texture =
            await textureLoader.loadAsync(
              item.image,
            );

          texture.colorSpace =
            THREE.SRGBColorSpace;

          texture.anisotropy =
            Math.min(
              renderer.capabilities
                .getMaxAnisotropy(),
              8,
            );

          loadedTextures.push(
            texture,
          );

          return texture;
        } catch {
          const texture =
            createFallbackTexture(
              item.title,
            );

          loadedTextures.push(
            texture,
          );

          return texture;
        }
      };

    /* ---------------------------------------------------------------------- */
    /*                              CREATE CARD                               */
    /* ---------------------------------------------------------------------- */

    const createCard =
      (
        item: ProjectItem,
        projectIndex: number,
        ringIndex: number,
        texture: THREE.Texture,
      ) => {
        const geometry =
          new THREE.PlaneGeometry(
            CARD_WIDTH,
            CARD_HEIGHT,
            1,
            1,
          );

        const material =
          new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,

            transparent: true,

            depthTest: true,
            depthWrite: true,

            side:
              THREE.DoubleSide,

            toneMapped: false,

            uniforms: {
              uMap: {
                value: texture,
              },

              uOpacity: {
                value: 0,
              },

              uHover: {
                value: 0,
              },

              uRadius: {
                value: 0.08,
              },

              uSize: {
                value:
                  new THREE.Vector2(
                    CARD_WIDTH,
                    CARD_HEIGHT,
                  ),
              },
            },
          });

        const mesh =
          new THREE.Mesh<
            THREE.PlaneGeometry,
            THREE.ShaderMaterial
          >(
            geometry,
            material,
          );

        /*
         * Start positions distributed
         * around the complete circle.
         */
        const baseAngle =
          ringIndex *
            RING_STEP -
          Math.PI;

        mesh.userData = {
          href: item.href,
          projectIndex,
          baseAngle,

          hoverScale: 1,

          targetHoverScale: 1,
        } satisfies CardData;

        mesh.visible = false;

        mesh.frustumCulled =
          false;

        scene.add(mesh);

        cards.push(mesh);
      };

    /* ---------------------------------------------------------------------- */
    /*                              DOM MOTION                                */
    /* ---------------------------------------------------------------------- */

    const updateDOM =
      (
        progress: number,
      ) => {
        const intro =
          smoothStep(
            0,
            0.12,
            progress,
          );

        const titleExit =
          smoothStep(
            0.89,
            1,
            progress,
          );

        const opacity =
          intro *
          (1 - titleExit);

        if (title) {
          title.style.opacity =
            String(opacity);

          title.style.transform = `
            translate3d(
              0,
              ${
                (1 - intro) *
                  55 -
                titleExit *
                  35
              }px,
              0
            )
            scale(
              ${
                0.96 +
                intro *
                  0.04
              }
            )
          `;
        }

        if (titleOne) {
          titleOne.style.transform = `
            translate3d(
              ${
                (1 - intro) *
                  -80
              }px,
              0,
              0
            )
          `;
        }

        if (titleTwo) {
          titleTwo.style.transform = `
            translate3d(
              ${
                (1 - intro) *
                  95
              }px,
              0,
              0
            )
          `;
        }

        if (description) {
          const descriptionIn =
            smoothStep(
              0.05,
              0.17,
              progress,
            );

          description.style.opacity =
            String(
              descriptionIn *
                (1 -
                  titleExit),
            );

          description.style.transform = `
            translate3d(
              0,
              ${
                (1 -
                  descriptionIn) *
                18
              }px,
              0
            )
          `;
        }

        if (leftCopy) {
          const copyIn =
            smoothStep(
              0.08,
              0.2,
              progress,
            );

          leftCopy.style.opacity =
            String(
              copyIn *
                (1 -
                  titleExit),
            );
        }

        if (rightLink) {
          const linkIn =
            smoothStep(
              0.1,
              0.22,
              progress,
            );

          rightLink.style.opacity =
            String(
              linkIn *
                (1 -
                  titleExit),
            );

          rightLink.style.transform = `
            translate3d(
              0,
              ${
                (1 -
                  linkIn) *
                16
              }px,
              0
            )
          `;
        }
      };

    /* ---------------------------------------------------------------------- */
    /*                             UPDATE SCENE                               */
    /* ---------------------------------------------------------------------- */

    const updateScene =
      (
        progress: number,
      ) => {
        const intro =
          smoothStep(
            0.015,
            0.13,
            progress,
          );

        const exit =
          smoothStep(
            0.91,
            1,
            progress,
          );

        /*
         * Scroll drives ring rotation.
         */
        const ringRotation =
          INITIAL_RING_ANGLE +
          progress *
            TOTAL_SCROLL_ROTATION;

        /*
         * Whole ring rises into position
         * when the section first appears.
         */
        const entranceY =
          THREE.MathUtils.lerp(
            -3.7,
            0,
            intro,
          );

        /*
         * Small upward exit for the next section.
         */
        const exitY =
          exit * 1.25;

        cards.forEach(
          (mesh) => {
            const data =
              getCardData(mesh);

            data.hoverScale +=
              (
                data.targetHoverScale -
                data.hoverScale
              ) *
              0.13;

            const angle =
              normalizeAngle(
                data.baseAngle +
                  ringRotation,
              );

            const absoluteAngle =
              Math.abs(angle);

            const point =
              getRingPosition(
                angle,
              );

            /*
             * Position.
             */
            mesh.position.set(
              point.x,
              point.y +
                entranceY +
                exitY,
              point.z,
            );

            /*
             * Make each card tangent to
             * the elliptical ring.
             */
            mesh.rotation.set(
              0,
              -angle *
                CARD_YAW_STRENGTH,
              angle * -0.018,
            );

            /*
             * Cards nearer the center are
             * slightly larger.
             */
            const frontness =
              clamp01(
                (
                  Math.cos(
                    angle,
                  ) +
                  1
                ) /
                  2,
              );

            const perspectiveScale =
              THREE.MathUtils.lerp(
                0.83,
                1,
                Math.pow(
                  frontness,
                  0.72,
                ),
              );

            const finalScale =
              perspectiveScale *
              data.hoverScale;

            mesh.scale.setScalar(
              finalScale,
            );

            /*
             * Fade naturally around the sides.
             */
            const sideVisibility =
              1 -
              smoothStep(
                VISIBLE_ANGLE_START,
                VISIBLE_ANGLE_END,
                absoluteAngle,
              );

            const depthOpacity =
              THREE.MathUtils.lerp(
                0.52,
                1,
                frontness,
              );

            const finalOpacity =
              intro *
              sideVisibility *
              depthOpacity *
              (1 - exit);

            mesh.material.uniforms
              .uOpacity.value =
              finalOpacity;

            mesh.material.uniforms
              .uHover.value =
              Math.max(
                data.hoverScale -
                  1,
                0,
              ) *
              5;

            mesh.visible =
              finalOpacity >
              0.005;

            /*
             * Rendering order helps avoid
             * edge flickering.
             */
            mesh.renderOrder =
              Math.round(
                frontness *
                  1000,
              );
          },
        );

        const lineOpacity =
          0.23 *
          intro *
          (1 - exit);

        lineMaterialTop.opacity =
          lineOpacity;

        lineMaterialBottom.opacity =
          lineOpacity;

        topLine.position.y =
          entranceY +
          exitY;

        bottomLine.position.y =
          entranceY +
          exitY;

        interactionEnabled =
          progress > 0.09 &&
          progress < 0.94;

        if (
          !interactionEnabled &&
          hoveredCard
        ) {
          hoveredCard =
            null;

          cards.forEach(
            (card) => {
              getCardData(
                card,
              ).targetHoverScale =
                1;
            },
          );
        }

        updateDOM(progress);
      };

    /* ---------------------------------------------------------------------- */
    /*                               RAYCASTER                                */
    /* ---------------------------------------------------------------------- */

    const raycaster =
      new THREE.Raycaster();

    const pointer =
      new THREE.Vector2(
        -10,
        -10,
      );

    const updateHover =
      () => {
        if (
          !interactionEnabled
        ) {
          hoveredCard =
            null;

          cards.forEach(
            (card) => {
              getCardData(
                card,
              ).targetHoverScale =
                1;
            },
          );

          renderer.domElement.style.cursor =
            "default";

          return;
        }

        if (
          pointer.x < -1 ||
          pointer.x > 1 ||
          pointer.y < -1 ||
          pointer.y > 1
        ) {
          hoveredCard =
            null;
        } else {
          raycaster.setFromCamera(
            pointer,
            camera,
          );

          const intersections =
            raycaster.intersectObjects(
              cards.filter(
                (card) =>
                  card.visible,
              ),
              false,
            );

          hoveredCard =
            intersections.length
              ? (intersections[0]
                  .object as CardMesh)
              : null;
        }

        cards.forEach(
          (card) => {
            const data =
              getCardData(card);

            if (
              card ===
              hoveredCard
            ) {
              /*
               * Don't over-scale the very
               * distant side cards.
               */
              const angle =
                normalizeAngle(
                  data.baseAngle +
                    INITIAL_RING_ANGLE +
                    currentProgress *
                      TOTAL_SCROLL_ROTATION,
                );

              data.targetHoverScale =
                Math.abs(angle) <
                1.25
                  ? 1.065
                  : 1.025;
            } else {
              data.targetHoverScale =
                1;
            }
          },
        );

        renderer.domElement.style.cursor =
          hoveredCard
            ? "pointer"
            : "default";
      };

    /* ---------------------------------------------------------------------- */
    /*                                 RENDER                                 */
    /* ---------------------------------------------------------------------- */

    const render = () => {
      /*
       * Smooth interpolation gives the
       * premium inertial feel.
       */
      currentProgress +=
        (
          targetProgress -
          currentProgress
        ) *
        0.095;

      updateScene(
        currentProgress,
      );

      updateHover();

      renderer.render(
        scene,
        camera,
      );
    };

    const tick = () => {
      if (disposed) {
        return;
      }

      render();

      const progressMoving =
        Math.abs(
          targetProgress -
            currentProgress,
        ) >
        0.0001;

      const hoverMoving =
        cards.some(
          (card) => {
            const data =
              getCardData(card);

            return (
              Math.abs(
                data.targetHoverScale -
                  data.hoverScale,
              ) >
              0.001
            );
          },
        );

      if (
        active ||
        progressMoving ||
        hoverMoving
      ) {
        rafId =
          window.requestAnimationFrame(
            tick,
          );

        return;
      }

      rafId = 0;
    };

    const requestFrame =
      () => {
        if (
          rafId ||
          disposed
        ) {
          return;
        }

        rafId =
          window.requestAnimationFrame(
            tick,
          );
      };

    /* ---------------------------------------------------------------------- */
    /*                            CREATE PROJECTS                             */
    /* ---------------------------------------------------------------------- */

    const texturePromise =
      Promise.all(
        ITEMS.map(
          loadTexture,
        ),
      ).then(
        (textures) => {
          if (disposed) {
            return;
          }

          for (
            let repeat = 0;
            repeat <
            RING_REPEAT_COUNT;
            repeat += 1
          ) {
            ITEMS.forEach(
              (
                item,
                projectIndex,
              ) => {
                const ringIndex =
                  repeat *
                    ITEMS.length +
                  projectIndex;

                createCard(
                  item,
                  projectIndex,
                  ringIndex,
                  textures[
                    projectIndex
                  ],
                );
              },
            );
          }

          updateScene(
            currentProgress,
          );

          renderer.compile(
            scene,
            camera,
          );

          renderer.render(
            scene,
            camera,
          );

          requestFrame();
        },
      );

    /* ---------------------------------------------------------------------- */
    /*                              SCROLLTRIGGER                             */
    /* ---------------------------------------------------------------------- */

    const scrollTrigger =
      ScrollTrigger.create({
        id:
          "bezteq-motion-showcase",

        trigger: section,

        start: "top top",

        /*
         * Long pinned distance gives
         * the ring enough time to rotate
         * smoothly.
         */
        end: () =>
          `+=${
            window.innerHeight *
            5.5
          }`,

        pin: true,

        scrub: true,

        anticipatePin: 1,

        invalidateOnRefresh:
          true,

        onEnter: () => {
          active = true;
          requestFrame();
        },

        onEnterBack: () => {
          active = true;
          requestFrame();
        },

        onLeave: () => {
          active = false;
        },

        onLeaveBack: () => {
          active = false;
        },

        onUpdate: (self) => {
          targetProgress =
            self.progress;

          requestFrame();
        },

        onRefresh: (self) => {
          targetProgress =
            self.progress;

          currentProgress =
            self.progress;

          updateScene(
            self.progress,
          );

          requestFrame();
        },
      });

    /* ---------------------------------------------------------------------- */
    /*                              POINTER EVENTS                            */
    /* ---------------------------------------------------------------------- */

    const handlePointerMove =
      (
        event: PointerEvent,
      ) => {
        const bounds =
          renderer.domElement
            .getBoundingClientRect();

        pointer.x =
          (
            (event.clientX -
              bounds.left) /
            bounds.width
          ) *
            2 -
          1;

        pointer.y =
          -(
            (event.clientY -
              bounds.top) /
            bounds.height
          ) *
            2 +
          1;

        requestFrame();
      };

    const handlePointerLeave =
      () => {
        pointer.set(
          -10,
          -10,
        );

        hoveredCard =
          null;

        cards.forEach(
          (card) => {
            getCardData(
              card,
            ).targetHoverScale =
              1;
          },
        );

        requestFrame();
      };

    const handleClick =
      () => {
        if (
          !hoveredCard ||
          !interactionEnabled
        ) {
          return;
        }

        window.location.assign(
          getCardData(
            hoveredCard,
          ).href,
        );
      };

    /* ---------------------------------------------------------------------- */
    /*                                 RESIZE                                 */
    /* ---------------------------------------------------------------------- */

    const handleResize =
      () => {
        const width =
          canvasMount.clientWidth;

        const height =
          canvasMount.clientHeight;

        if (
          width <= 0 ||
          height <= 0
        ) {
          return;
        }

        camera.aspect =
          width / height;

        camera.updateProjectionMatrix();

        renderer.setPixelRatio(
          Math.min(
            window.devicePixelRatio,
            1.75,
          ),
        );

        renderer.setSize(
          width,
          height,
          false,
        );

        updateScene(
          currentProgress,
        );

        requestFrame();
      };

    renderer.domElement.addEventListener(
      "pointermove",
      handlePointerMove,
    );

    renderer.domElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );

    renderer.domElement.addEventListener(
      "click",
      handleClick,
    );

    window.addEventListener(
      "resize",
      handleResize,
    );

    handleResize();

    updateScene(0);

    requestFrame();

    document.fonts?.ready.then(
      () => {
        if (!disposed) {
          ScrollTrigger.refresh();
        }
      },
    );

    /* ---------------------------------------------------------------------- */
    /*                                CLEANUP                                 */
    /* ---------------------------------------------------------------------- */

    return () => {
      disposed = true;

      window.cancelAnimationFrame(
        rafId,
      );

      scrollTrigger.kill();

      renderer.domElement.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      renderer.domElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );

      renderer.domElement.removeEventListener(
        "click",
        handleClick,
      );

      window.removeEventListener(
        "resize",
        handleResize,
      );

      cards.forEach(
        (card) => {
          card.geometry.dispose();

          card.material.dispose();

          scene.remove(card);
        },
      );

      loadedTextures.forEach(
        (texture) => {
          texture.dispose();
        },
      );

      topLineGeometry.dispose();
      bottomLineGeometry.dispose();

      lineMaterialTop.dispose();
      lineMaterialBottom.dispose();

      renderer.dispose();

      if (
        renderer.domElement
          .parentElement ===
        canvasMount
      ) {
        canvasMount.removeChild(
          renderer.domElement,
        );
      }

      void texturePromise;
    };
  }, [prefersReducedMotion]);

  /* ------------------------------------------------------------------------ */
  /*                                   JSX                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      ref={sectionRef}
      id="systems-in-motion"
      className="
        relative
        isolate
        overflow-hidden
        bg-[#EFEFEB]
        text-[#3b3b3b]
        lg:h-[100svh]
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/*                     MOBILE / REDUCED MOTION                         */}
      {/* ------------------------------------------------------------------ */}

      <div
        className={`
          relative
          px-[var(--space-gutter)]
          py-[var(--space-section)]

          ${
            prefersReducedMotion
              ? ""
              : "lg:hidden"
          }
        `}
      >
        <p className="
          font-mono
          text-[0.58rem]
          uppercase
          tracking-[0.15em]
          text-black/50
        ">
          / 05 — Selected environments
        </p>

        <h2 className="
          mt-6
          text-[clamp(3.7rem,15vw,7rem)]
          font-medium
          uppercase
          leading-[0.83]
          tracking-[-0.07em]
        ">
          Systems in
          <br />
          motion
        </h2>

        <p className="
          mt-6
          max-w-[420px]
          text-sm
          leading-6
          text-black/55
        ">
          Websites, software and operating systems
          shown through the interfaces they were
          built to support.
        </p>

        <div className="
          mt-12
          grid
          gap-5
          sm:grid-cols-2
        ">
          {ITEMS.map(
            (item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group block"
              >
                <div className="
                  relative
                  aspect-[16/10]
                  overflow-hidden
                  bg-black/10
                ">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-[1.025]
                    "
                  />
                </div>

                <div className="
                  flex
                  items-start
                  justify-between
                  gap-5
                  border-b
                  border-black/20
                  py-4
                ">
                  <div>
                    <p className="
                      font-mono
                      text-[0.48rem]
                      uppercase
                      tracking-[0.12em]
                      text-black/45
                    ">
                      {item.category}
                    </p>

                    <h3 className="
                      mt-2
                      text-lg
                      font-medium
                      tracking-[-0.035em]
                    ">
                      {item.title}
                    </h3>
                  </div>

                  <span>
                    ↗
                  </span>
                </div>
              </Link>
            ),
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*                               DESKTOP                               */}
      {/* ------------------------------------------------------------------ */}

      {!prefersReducedMotion && (
        <div className="
          relative
          hidden
          h-full
          lg:block
        ">
          {/* -------------------------------------------------------------- */}
          {/*                        LARGE TITLE                             */}
          {/* -------------------------------------------------------------- */}

          <div
            data-motion-title
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-[27%]
              z-10
              uppercase
              opacity-0
              will-change-transform
            "
          >
            <h2
              aria-label="Systems in motion"
              className="
                font-medium
                leading-[0.79]
                tracking-[-0.075em]
                text-[#3d3d3d]
              "
            >
              <span
                data-motion-line-one
                className="
                  ml-[23vw]
                  block
                  text-[clamp(5.4rem,8.6vw,10.2rem)]
                  will-change-transform
                "
              >
                Systems in
              </span>

              <span
                data-motion-line-two
                className="
                  ml-[49vw]
                  mt-[5vh]
                  block
                  text-[clamp(5.4rem,8.6vw,10.2rem)]
                  will-change-transform
                "
              >
                Motion
              </span>
            </h2>
          </div>

          {/* -------------------------------------------------------------- */}
          {/*                       CENTER TEXT                              */}
          {/* -------------------------------------------------------------- */}

          <p
            data-motion-description
            className="
              pointer-events-none
              absolute
              left-[52%]
              top-[47%]
              z-10
              max-w-[220px]
              -translate-x-1/2
              text-center
              font-mono
              text-[0.64rem]
              uppercase
              leading-[1.22]
              text-black/55
              opacity-0
              will-change-transform
            "
          >
            Digital systems explored through
            interface, engineering and motion.
          </p>

          {/* -------------------------------------------------------------- */}
          {/*                         LEFT COPY                              */}
          {/* -------------------------------------------------------------- */}

          <p
            data-motion-left
            className="
              absolute
              bottom-[5vh]
              left-[2vw]
              z-30
              max-w-[275px]
              text-[0.9rem]
              leading-[1.35]
              text-black/55
              opacity-0
            "
          >
            Websites, products and operating
            environments presented through an
            evolving visual archive.
          </p>

          {/* -------------------------------------------------------------- */}
          {/*                           CTA                                  */}
          {/* -------------------------------------------------------------- */}

          <Link
            data-motion-link
            href="/work"
            className="
              group
              absolute
              bottom-[5vh]
              right-[2vw]
              z-30
              flex
              items-center
              gap-14
              border-b
              border-black/45
              pb-3
              font-mono
              text-[0.62rem]
              uppercase
              tracking-[0.12em]
              text-black/65
              opacity-0
              transition-colors

              hover:border-cobalt
              hover:text-cobalt
            "
          >
            View all work

            <span className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            ">
              <ArrowIcon />
            </span>
          </Link>

          {/* -------------------------------------------------------------- */}
          {/*                         THREE.JS                               */}
          {/* -------------------------------------------------------------- */}

          <div
            ref={canvasMountRef}
            className="
              absolute
              inset-0
              z-20
            "
          />

          {/* -------------------------------------------------------------- */}
          {/*                     DECORATIVE PATHS                           */}
          {/* -------------------------------------------------------------- */}

          <svg
            aria-hidden="true"
            viewBox="0 0 1600 900"
            preserveAspectRatio="none"
            className="
              pointer-events-none
              absolute
              inset-0
              z-[5]
              h-full
              w-full
            "
          >
            <path
              d="
                M310 105
                C500 185
                650 175
                790 140
              "
              fill="none"
              stroke="rgba(0,0,0,0.13)"
              strokeWidth="1"
            />

            <path
              d="
                M382 347
                C580 290
                760 295
                895 260
              "
              fill="none"
              stroke="rgba(0,0,0,0.13)"
              strokeWidth="1"
            />

            <path
              d="
                M1365 370
                C1270 250
                1145 205
                990 180
              "
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="1"
            />
          </svg>
        </div>
      )}
    </section>
  );
}