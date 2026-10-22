"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

import * as THREE from "three";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useDegradation } from "@/providers/DegradationProvider";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type ProjectItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
};

type CardData = {
  href: string;
  itemIndex: number;
  finalSlot: number;
  hoverScale: number;
  targetHoverScale: number;
};

type FinalEntryPreset = {
  xFactor: number;
  direction: "top" | "bottom";
  z: number;
  rotation: number;
  scale: number;
  delay: number;
  curveX: number;
};

type CardMesh = THREE.Mesh<
  THREE.PlaneGeometry,
  THREE.ShaderMaterial
>;

/* -------------------------------------------------------------------------- */
/*                                PROJECT DATA                                */
/* -------------------------------------------------------------------------- */

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
    image: "/images/home/LeadGeneration.webp",
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
/*                              MOTION SETTINGS                               */
/* -------------------------------------------------------------------------- */

const CARD_WIDTH = 2.62;
const CARD_HEIGHT = 1.66;
const WIDTH_SEGMENTS = 34;

const SCROLL_DISTANCE_VIEWPORTS = 6.2;

const FINAL_ITEM_INDEXES = [
  0,
  1,
  2,
  3,
  4,
  5,
] as const;

const FINAL_INDEX_TO_SLOT = new Map<number, number>(
  FINAL_ITEM_INDEXES.map((itemIndex, slot) => [
    itemIndex,
    slot,
  ]),
);

/* -------------------------------------------------------------------------- */
/*                              HELIX SETTINGS                                */
/* -------------------------------------------------------------------------- */

const HELIX_RADIUS = 5.05;
const HELIX_PITCH = 0.59;
const HELIX_DIP_AMOUNT = 0.58;

const ANGLE_GAP = 0.565;

const FRONT_ANGLE = Math.PI / 2;

const INITIAL_SCROLL_ANGLE = -0.76;
const FINAL_SCROLL_ANGLE = 5.82;

/* -------------------------------------------------------------------------- */
/*                                FINAL GRID                                  */
/* -------------------------------------------------------------------------- */

const GRID_X_GAP = 3.2;
const GRID_Y_GAP = 1.98;
const GRID_CENTER_Y = 0.08;
const GRID_Z = 0.42;

/* -------------------------------------------------------------------------- */
/*                               GUIDE CURVES                                 */
/* -------------------------------------------------------------------------- */

const LINE_POINTS = 220;

/* -------------------------------------------------------------------------- */
/*                            ANIMATION PHASES                                */
/* -------------------------------------------------------------------------- */

const INTRO_START = 0.015;
const INTRO_END = 0.145;

const ROLL_START = 0.105;
const ROLL_END = 0.675;

const TITLE_CROSS_START = 0.42;
const TITLE_CROSS_END = 0.705;

const GRID_PHASE_START = 0.725;
const GRID_PHASE_END = 0.965;

/* -------------------------------------------------------------------------- */
/*                         FINAL CARD ENTRY SETTINGS                          */
/* -------------------------------------------------------------------------- */

const FINAL_ENTRY_PRESETS: FinalEntryPreset[] = [
  {
    xFactor: -0.23,
    direction: "top",
    z: -0.95,
    rotation: -0.075,
    scale: 0.77,
    delay: 0,
    curveX: -0.18,
  },
  {
    xFactor: 0.015,
    direction: "top",
    z: -1.2,
    rotation: 0.055,
    scale: 0.72,
    delay: 0.026,
    curveX: 0.14,
  },
  {
    xFactor: 0.245,
    direction: "top",
    z: -0.88,
    rotation: 0.082,
    scale: 0.78,
    delay: 0.055,
    curveX: 0.2,
  },
  {
    xFactor: -0.24,
    direction: "bottom",
    z: -0.9,
    rotation: 0.068,
    scale: 0.75,
    delay: 0.034,
    curveX: -0.16,
  },
  {
    xFactor: 0.01,
    direction: "bottom",
    z: -1.25,
    rotation: -0.048,
    scale: 0.71,
    delay: 0.075,
    curveX: 0.12,
  },
  {
    xFactor: 0.25,
    direction: "bottom",
    z: -0.9,
    rotation: -0.082,
    scale: 0.76,
    delay: 0.108,
    curveX: 0.22,
  },
];

/* -------------------------------------------------------------------------- */
/*                                  SHADERS                                   */
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
        imageColor.rgb * 1.07,
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
/*                                UTILITIES                                   */
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
    (value - start) / (end - start),
  );

  return (
    progress *
    progress *
    (3 - 2 * progress)
  );
}

function rotatePoint(
  x: number,
  y: number,
  rotation: number,
) {
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);

  return {
    x: x * cosine - y * sine,
    y: x * sine + y * cosine,
  };
}

function getCardData(
  mesh: CardMesh,
): CardData {
  return mesh.userData as CardData;
}

/* -------------------------------------------------------------------------- */
/*                           FALLBACK CARD TEXTURE                            */
/* -------------------------------------------------------------------------- */

function createFallbackTexture(
  label: string,
) {
  const canvas =
    document.createElement("canvas");

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
    0.62,
    "#10172f",
  );

  gradient.addColorStop(
    1,
    "#00cae0",
  );

  context.fillStyle = gradient;

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  context.strokeStyle =
    "rgba(255,255,255,0.10)";

  for (
    let x = 0;
    x <= canvas.width;
    x += 90
  ) {
    context.beginPath();

    context.moveTo(
      x,
      0,
    );

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

    context.moveTo(
      0,
      y,
    );

    context.lineTo(
      canvas.width,
      y,
    );

    context.stroke();
  }

  context.fillStyle =
    "#f4f2ea";

  context.font =
    "600 84px Arial, sans-serif";

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

/* -------------------------------------------------------------------------- */
/*                               HELIX HELPERS                                */
/* -------------------------------------------------------------------------- */

function helixDip(
  angle: number,
) {
  const midpoint =
    FRONT_ANGLE + 2.02;

  const spread = 1.27;

  const difference =
    (angle - midpoint) /
    spread;

  return (
    HELIX_DIP_AMOUNT *
    Math.exp(
      -difference *
        difference,
    )
  );
}

function helixLocalY(
  angle: number,
) {
  return (
    (angle - FRONT_ANGLE) *
      HELIX_PITCH -
    helixDip(angle)
  );
}

/* -------------------------------------------------------------------------- */
/*                                   ICON                                     */
/* -------------------------------------------------------------------------- */

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
/*                          SYSTEMS IN MOTION                                 */
/* -------------------------------------------------------------------------- */

export function SystemsInMotion() {
  const sectionRef =
    useRef<HTMLElement>(null);

  /*
   * React owns the canvas.
   *
   * Three.js only renders into it.
   *
   * Never append/remove this canvas manually.
   */
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  const router = useRouter();

  const {
    prefersReducedMotion,
  } = useDegradation();

  /* ------------------------------------------------------------------------ */
  /*                       THREE + SCROLL LIFECYCLE                           */
  /* ------------------------------------------------------------------------ */

  useGSAP(
    () => {
      const section =
        sectionRef.current;

      const canvas =
        canvasRef.current;

      if (
        !section ||
        !canvas ||
        prefersReducedMotion ||
        !window.matchMedia(
          "(min-width: 1024px)",
        ).matches
      ) {
        return;
      }

      /* -------------------------------------------------------------------- */
      /*                              STATE                                   */
      /* -------------------------------------------------------------------- */

      let disposed = false;
      let rafId = 0;
      let isActive = false;

      let targetProgress = 0;
      let currentProgress = 0;

      let hoveredCard:
        | CardMesh
        | null = null;

      let interactionEnabled =
        false;

      /* -------------------------------------------------------------------- */
      /*                        DOM REFERENCES                                */
      /* -------------------------------------------------------------------- */

      const title =
        section.querySelector<HTMLElement>(
          "[data-motion-title]",
        );

      const firstTitleLine =
        section.querySelector<HTMLElement>(
          "[data-motion-line-one]",
        );

      const secondTitleLine =
        section.querySelector<HTMLElement>(
          "[data-motion-line-two]",
        );

      const descriptor =
        section.querySelector<HTMLElement>(
          "[data-motion-description]",
        );

      const leftCopy =
        section.querySelector<HTMLElement>(
          "[data-motion-left-copy]",
        );

      const rightLink =
        section.querySelector<HTMLElement>(
          "[data-motion-right-link]",
        );

      /* -------------------------------------------------------------------- */
      /*                              THREE                                   */
      /* -------------------------------------------------------------------- */

      const scene =
        new THREE.Scene();

      const camera =
        new THREE.PerspectiveCamera(
          36,
          1,
          0.1,
          100,
        );

      camera.position.set(
        0,
        0.05,
        11.85,
      );

      /*
       * Ask the browser for a valid WebGL context first.
       *
       * This prevents Three.js from continuing into renderer
       * capability detection when a context is unavailable/lost.
       */
      const contextAttributes:
        WebGLContextAttributes = {
          alpha: true,
          antialias: true,
          depth: true,
          stencil: false,
          premultipliedAlpha: true,
          preserveDrawingBuffer: false,
          powerPreference:
            "high-performance",
        };

      const webglContext =
        canvas.getContext(
          "webgl2",
          contextAttributes,
        ) ??
        canvas.getContext(
          "webgl",
          contextAttributes,
        );

      if (!webglContext) {
        console.error(
          "[SystemsInMotion] Unable to create a WebGL context.",
        );

        return;
      }

      /*
       * A context can technically exist but already
       * be marked as lost.
       */
      if (
        typeof webglContext.isContextLost ===
          "function" &&
        webglContext.isContextLost()
      ) {
        console.warn(
          "[SystemsInMotion] WebGL context is currently lost. Skipping renderer creation.",
        );

        return;
      }

      let renderer:
        THREE.WebGLRenderer;

      try {
        renderer =
          new THREE.WebGLRenderer({
            canvas,

            context:
              webglContext as WebGLRenderingContext,

            alpha: true,

            antialias: true,

            powerPreference:
              "high-performance",
          });
      } catch (error) {
        console.error(
          "[SystemsInMotion] WebGL renderer could not be created:",
          error,
        );

        return;
      }

      renderer.setClearColor(
        0x000000,
        0,
      );

      renderer.outputColorSpace =
        THREE.SRGBColorSpace;

      /* -------------------------------------------------------------------- */
      /*                      WEBGL CONTEXT EVENTS                            */
      /* -------------------------------------------------------------------- */

      const handleContextLost = (
        event: Event,
      ) => {
        event.preventDefault();

        isActive = false;

        if (rafId) {
          window.cancelAnimationFrame(
            rafId,
          );

          rafId = 0;
        }

        console.warn(
          "[SystemsInMotion] WebGL context lost.",
        );
      };

      const handleContextRestored =
        () => {
          if (disposed) {
            return;
          }

          console.info(
            "[SystemsInMotion] WebGL context restored.",
          );

          requestAnimationFrame(() => {
            if (disposed) {
              return;
            }

            handleResize();
            requestFrame();
          });
        };

      canvas.addEventListener(
        "webglcontextlost",
        handleContextLost,
        false,
      );

      canvas.addEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false,
      );

      /* -------------------------------------------------------------------- */
      /*                           TEXTURE OWNERSHIP                           */
      /* -------------------------------------------------------------------- */

      const textureLoader =
        new THREE.TextureLoader();

      const cards: CardMesh[] = [];

      const loadedTextures =
        new Set<THREE.Texture>();

      const disposedTextures =
        new WeakSet<THREE.Texture>();

      const disposeTexture = (
        texture: THREE.Texture,
      ) => {
        if (
          disposedTextures.has(
            texture,
          )
        ) {
          return;
        }

        disposedTextures.add(
          texture,
        );

        texture.dispose();
      };

      /* -------------------------------------------------------------------- */
      /*                             GUIDE CURVES                             */
      /* -------------------------------------------------------------------- */

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

      const topLineMaterial =
        new THREE.LineBasicMaterial({
          color: 0x454545,
          transparent: true,
          opacity: 0,
        });

      const bottomLineMaterial =
        new THREE.LineBasicMaterial({
          color: 0x454545,
          transparent: true,
          opacity: 0,
        });

      const topGuide =
        new THREE.Line(
          topLineGeometry,
          topLineMaterial,
        );

      const bottomGuide =
        new THREE.Line(
          bottomLineGeometry,
          bottomLineMaterial,
        );

      scene.add(
        topGuide,
        bottomGuide,
      );

      /* -------------------------------------------------------------------- */
      /*                           TEXTURE LOADER                             */
      /* -------------------------------------------------------------------- */

      const loadTexture =
        async (
          item: ProjectItem,
        ) => {
          try {
            const texture =
              await textureLoader.loadAsync(
                item.image,
              );

            if (disposed) {
              disposeTexture(
                texture,
              );

              return texture;
            }

            texture.colorSpace =
              THREE.SRGBColorSpace;

            texture.anisotropy =
              Math.min(
                renderer.capabilities.getMaxAnisotropy(),
                8,
              );

            loadedTextures.add(
              texture,
            );

            return texture;
          } catch {
            const texture =
              createFallbackTexture(
                item.title,
              );

            if (disposed) {
              disposeTexture(
                texture,
              );

              return texture;
            }

            loadedTextures.add(
              texture,
            );

            return texture;
          }
        };

      /* -------------------------------------------------------------------- */
      /*                              CREATE CARD                             */
      /* -------------------------------------------------------------------- */

      const createCard = (
        item: ProjectItem,
        itemIndex: number,
        texture: THREE.Texture,
      ) => {
        const geometry =
          new THREE.PlaneGeometry(
            CARD_WIDTH,
            CARD_HEIGHT,
            WIDTH_SEGMENTS,
            1,
          );

        const material =
          new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,

            transparent: true,

            side:
              THREE.DoubleSide,

            depthTest: true,

            depthWrite: true,

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
                value: 0.085,
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

        mesh.userData = {
          href: item.href,

          itemIndex,

          finalSlot:
            FINAL_INDEX_TO_SLOT.get(
              itemIndex,
            ) ?? -1,

          hoverScale: 1,

          targetHoverScale: 1,
        } satisfies CardData;

        mesh.frustumCulled =
          false;

        mesh.renderOrder =
          10 + itemIndex;

        scene.add(mesh);

        cards.push(mesh);
      };

      /* -------------------------------------------------------------------- */
      /*                       CAMERA WORLD BOUNDS                            */
      /* -------------------------------------------------------------------- */

      const getVisibleWorldBounds =
        (
          planeZ = GRID_Z,
        ) => {
          const distance =
            Math.abs(
              camera.position.z -
                planeZ,
            );

          const halfHeight =
            Math.tan(
              THREE.MathUtils.degToRad(
                camera.fov *
                  0.5,
              ),
            ) * distance;

          const halfWidth =
            halfHeight *
            camera.aspect;

          return {
            halfWidth,
            halfHeight,
          };
        };

      /* -------------------------------------------------------------------- */
      /*                             GUIDE LINE                               */
      /* -------------------------------------------------------------------- */

      const updateGuideLine = (
        geometry:
          THREE.BufferGeometry,

        firstAngle: number,

        lastAngle: number,

        verticalOffset: number,

        radialOffset: number,

        circleCenterY: number,
      ) => {
        const position =
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
              firstAngle,
              lastAngle,
              fraction,
            );

          const radius =
            HELIX_RADIUS +
            radialOffset;

          position.setXYZ(
            index,

            radius *
              Math.cos(
                angle,
              ),

            circleCenterY +
              helixLocalY(
                angle,
              ) +
              verticalOffset,

            radius *
              Math.sin(
                angle,
              ),
          );
        }

        position.needsUpdate =
          true;
      };

      /* -------------------------------------------------------------------- */
      /*                         CARD GEOMETRY                                */
      /* -------------------------------------------------------------------- */

      const updateCardGeometry = (
        mesh: CardMesh,

        cardIndex: number,

        progress: number,

        scrollAngle: number,

        circleCenterY: number,
      ) => {
        const data =
          getCardData(mesh);

        data.hoverScale +=
          (
            data.targetHoverScale -
            data.hoverScale
          ) * 0.13;

        const {
          halfWidth,
          halfHeight,
        } =
          getVisibleWorldBounds();

        const geometryPosition =
          mesh.geometry.getAttribute(
            "position",
          ) as THREE.BufferAttribute;

        const uv =
          mesh.geometry.getAttribute(
            "uv",
          ) as THREE.BufferAttribute;

        const centerOffset =
          cardIndex -
          (cards.length - 1) /
            2;

        const centerAngle =
          FRONT_ANGLE +
          centerOffset *
            ANGLE_GAP +
          scrollAngle;

        const cardArcWidth =
          CARD_WIDTH /
          HELIX_RADIUS;

        const finalSlot =
          data.finalSlot;

        const isFinalCard =
          finalSlot >= 0;

        let finalEntryProgress =
          0;

        let gridCenterX = 0;
        let gridCenterY = 0;

        let entryCenterX = 0;
        let entryCenterY = 0;

        let entryZ = GRID_Z;

        let entryRotation = 0;
        let entryScale = 1;

        let entryCurveX = 0;

        if (isFinalCard) {
          const preset =
            FINAL_ENTRY_PRESETS[
              finalSlot
            ];

          const column =
            finalSlot % 3;

          const row =
            Math.floor(
              finalSlot / 3,
            );

          gridCenterX =
            (column - 1) *
            GRID_X_GAP;

          gridCenterY =
            (0.5 - row) *
              GRID_Y_GAP +
            GRID_CENTER_Y;

          const cardEntryStart =
            GRID_PHASE_START +
            preset.delay;

          const cardEntryEnd =
            Math.min(
              GRID_PHASE_END,

              cardEntryStart +
                0.175,
            );

          finalEntryProgress =
            smoothStep(
              cardEntryStart,
              cardEntryEnd,
              progress,
            );

          entryCenterX =
            preset.xFactor *
            halfWidth;

          entryCenterY =
            preset.direction ===
            "top"
              ? halfHeight +
                CARD_HEIGHT *
                  1.1
              : -halfHeight -
                CARD_HEIGHT *
                  1.1;

          entryZ =
            GRID_Z +
            preset.z;

          entryRotation =
            preset.rotation;

          entryScale =
            preset.scale;

          entryCurveX =
            preset.curveX;
        }

        for (
          let vertexIndex = 0;
          vertexIndex <
          geometryPosition.count;
          vertexIndex += 1
        ) {
          const u =
            uv.getX(
              vertexIndex,
            );

          const v =
            uv.getY(
              vertexIndex,
            );

          const localX =
            (u - 0.5) *
            CARD_WIDTH;

          const localY =
            (v - 0.5) *
            CARD_HEIGHT;

          /* -------------------------------------------------------------- */
          /*                         3D RIBBON                              */
          /* -------------------------------------------------------------- */

          const vertexAngle =
            centerAngle +
            (u - 0.5) *
              cardArcWidth;

          const helixX =
            HELIX_RADIUS *
            Math.cos(
              vertexAngle,
            );

          const helixY =
            circleCenterY +
            helixLocalY(
              vertexAngle,
            ) +
            localY;

          const helixZ =
            HELIX_RADIUS *
            Math.sin(
              vertexAngle,
            );

          if (
            progress <
              GRID_PHASE_START ||
            !isFinalCard
          ) {
            geometryPosition.setXYZ(
              vertexIndex,

              helixX,

              helixY,

              helixZ,
            );

            continue;
          }

          /* -------------------------------------------------------------- */
          /*                    OFFSCREEN -> GRID                           */
          /* -------------------------------------------------------------- */

          const curvedEntry =
            Math.sin(
              finalEntryProgress *
                Math.PI,
            );

          const currentRotation =
            THREE.MathUtils.lerp(
              entryRotation,
              0,
              finalEntryProgress,
            );

          const currentScale =
            THREE.MathUtils.lerp(
              entryScale,

              data.hoverScale,

              finalEntryProgress,
            );

          const rotatedLocal =
            rotatePoint(
              localX *
                currentScale,

              localY *
                currentScale,

              currentRotation,
            );

          const centerX =
            THREE.MathUtils.lerp(
              entryCenterX,
              gridCenterX,
              finalEntryProgress,
            ) +
            curvedEntry *
              entryCurveX *
              halfWidth *
              0.1;

          const centerY =
            THREE.MathUtils.lerp(
              entryCenterY,

              gridCenterY,

              finalEntryProgress,
            );

          const centerZ =
            THREE.MathUtils.lerp(
              entryZ,

              GRID_Z +
                finalSlot *
                  0.003,

              finalEntryProgress,
            );

          geometryPosition.setXYZ(
            vertexIndex,

            centerX +
              rotatedLocal.x,

            centerY +
              rotatedLocal.y,

            centerZ,
          );
        }

        geometryPosition.needsUpdate =
          true;

        mesh.material.uniforms.uHover.value =
          Math.max(
            data.hoverScale -
              1,
            0,
          );
      };

      /* -------------------------------------------------------------------- */
      /*                          DOM ANIMATION                               */
      /* -------------------------------------------------------------------- */

      const updateDOM = (
        progress: number,
      ) => {
        const intro =
          smoothStep(
            INTRO_START,
            INTRO_END,
            progress,
          );

        const cross =
          smoothStep(
            TITLE_CROSS_START,
            TITLE_CROSS_END,
            progress,
          );

        const titleFade =
          1 -
          smoothStep(
            0.66,
            0.735,
            progress,
          );

        if (title) {
          title.style.opacity =
            String(
              intro *
                titleFade,
            );

          title.style.transform = `
            translate3d(
              0,
              ${
                (1 - intro) *
                24
              }px,
              0
            )
          `;
        }

        if (firstTitleLine) {
          const introX =
            (1 - intro) *
            -34;

          const crossX =
            cross * 79;

          firstTitleLine.style.transform = `
            translate3d(
              ${
                introX +
                crossX
              }vw,
              0,
              0
            )
          `;
        }

        if (secondTitleLine) {
          const introX =
            (1 - intro) *
            34;

          const crossX =
            cross * -88;

          secondTitleLine.style.transform = `
            translate3d(
              ${
                introX +
                crossX
              }vw,
              0,
              0
            )
          `;
        }

        if (descriptor) {
          const descriptorIn =
            smoothStep(
              0.045,
              0.155,
              progress,
            );

          const descriptorOut =
            1 -
            smoothStep(
              0.53,
              0.67,
              progress,
            );

          descriptor.style.opacity =
            String(
              descriptorIn *
                descriptorOut,
            );

          descriptor.style.transform = `
            translate3d(
              0,
              ${
                (1 -
                  descriptorIn) *
                  16 -
                cross * 14
              }px,
              0
            )
          `;
        }

        if (leftCopy) {
          const copyIn =
            smoothStep(
              0.035,
              0.14,
              progress,
            );

          leftCopy.style.opacity =
            String(copyIn);

          leftCopy.style.transform = `
            translate3d(
              0,
              ${
                (1 -
                  copyIn) *
                12
              }px,
              0
            )
          `;
        }

        if (rightLink) {
          const linkIn =
            smoothStep(
              0.055,
              0.16,
              progress,
            );

          rightLink.style.opacity =
            String(linkIn);

          rightLink.style.transform = `
            translate3d(
              0,
              ${
                (1 -
                  linkIn) *
                12
              }px,
              0
            )
          `;

          rightLink.style.pointerEvents =
            linkIn > 0.8
              ? "auto"
              : "none";
        }
      };

      /* -------------------------------------------------------------------- */
      /*                         RESET DOM STYLES                             */
      /* -------------------------------------------------------------------- */

      const resetDOMStyles =
        () => {
          if (title) {
            title.style.removeProperty(
              "opacity",
            );

            title.style.removeProperty(
              "transform",
            );
          }

          if (firstTitleLine) {
            firstTitleLine.style.removeProperty(
              "transform",
            );
          }

          if (secondTitleLine) {
            secondTitleLine.style.removeProperty(
              "transform",
            );
          }

          if (descriptor) {
            descriptor.style.removeProperty(
              "opacity",
            );

            descriptor.style.removeProperty(
              "transform",
            );
          }

          if (leftCopy) {
            leftCopy.style.removeProperty(
              "opacity",
            );

            leftCopy.style.removeProperty(
              "transform",
            );
          }

          if (rightLink) {
            rightLink.style.removeProperty(
              "opacity",
            );

            rightLink.style.removeProperty(
              "transform",
            );

            rightLink.style.removeProperty(
              "pointer-events",
            );
          }
        };

      /* -------------------------------------------------------------------- */
      /*                         SCENE UPDATE                                 */
      /* -------------------------------------------------------------------- */

      function updateScene(
        progress: number,
      ) {
        if (disposed) {
          return;
        }

        const {
          halfHeight,
        } =
          getVisibleWorldBounds();

        const intro =
          smoothStep(
            INTRO_START,
            INTRO_END,
            progress,
          );

        const roll =
          smoothStep(
            ROLL_START,
            ROLL_END,
            progress,
          );

        const scrollAngle =
          THREE.MathUtils.lerp(
            INITIAL_SCROLL_ANGLE,
            FINAL_SCROLL_ANGLE,
            roll,
          );

        const circleStartY =
          -halfHeight -
          CARD_HEIGHT *
            1.95;

        const circleEndY =
          halfHeight +
          CARD_HEIGHT *
            2.15;

        const circleCenterY =
          THREE.MathUtils.lerp(
            circleStartY,
            circleEndY,
            roll,
          );

        cards.forEach(
          (
            mesh,
            cardIndex,
          ) => {
            updateCardGeometry(
              mesh,
              cardIndex,
              progress,
              scrollAngle,
              circleCenterY,
            );

            const data =
              getCardData(
                mesh,
              );

            const centerOffset =
              cardIndex -
              (cards.length -
                1) /
                2;

            const centerAngle =
              FRONT_ANGLE +
              centerOffset *
                ANGLE_GAP +
              scrollAngle;

            const depth =
              Math.sin(
                centerAngle,
              );

            const depthOpacity =
              THREE.MathUtils.lerp(
                0.2,
                1,

                clamp01(
                  (depth +
                    1) /
                    2,
                ),
              );

            const revealDelay =
              cardIndex *
              0.009;

            const ribbonReveal =
              smoothStep(
                ROLL_START +
                  revealDelay,

                ROLL_START +
                  0.1 +
                  revealDelay,

                progress,
              );

            const ribbonOpacity =
              intro *
              ribbonReveal *
              depthOpacity;

            let finalOpacity =
              ribbonOpacity;

            if (
              progress >=
              GRID_PHASE_START
            ) {
              if (
                data.finalSlot <
                0
              ) {
                finalOpacity = 0;
              } else {
                const preset =
                  FINAL_ENTRY_PRESETS[
                    data.finalSlot
                  ];

                const cardEntryStart =
                  GRID_PHASE_START +
                  preset.delay;

                finalOpacity =
                  smoothStep(
                    cardEntryStart,

                    cardEntryStart +
                      0.055,

                    progress,
                  );
              }
            }

            mesh.material.uniforms.uOpacity.value =
              finalOpacity;

            mesh.visible =
              finalOpacity >
              0.004;
          },
        );

        const firstAngle =
          FRONT_ANGLE -
          ((cards.length -
            1) /
            2) *
            ANGLE_GAP +
          scrollAngle -
          0.76;

        const lastAngle =
          FRONT_ANGLE +
          ((cards.length -
            1) /
            2) *
            ANGLE_GAP +
          scrollAngle +
          0.76;

        updateGuideLine(
          topLineGeometry,
          firstAngle,
          lastAngle,
          CARD_HEIGHT *
            0.64,
          -0.09,
          circleCenterY,
        );

        updateGuideLine(
          bottomLineGeometry,
          firstAngle,
          lastAngle,
          -CARD_HEIGHT *
            0.64,
          0.09,
          circleCenterY,
        );

        const lineExit =
          1 -
          smoothStep(
            ROLL_END,
            GRID_PHASE_START,
            progress,
          );

        const lineOpacity =
          0.23 *
          intro *
          lineExit;

        topLineMaterial.opacity =
          lineOpacity;

        bottomLineMaterial.opacity =
          lineOpacity;

        interactionEnabled =
          progress > 0.86;

        if (
          !interactionEnabled &&
          hoveredCard
        ) {
          hoveredCard = null;

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
      }

      /* -------------------------------------------------------------------- */
      /*                           INTERACTION                                */
      /* -------------------------------------------------------------------- */

      const raycaster =
        new THREE.Raycaster();

      const pointer =
        new THREE.Vector2(
          -10,
          -10,
        );

      const updateHover =
        () => {
          if (disposed) {
            return;
          }

          if (
            !interactionEnabled
          ) {
            hoveredCard = null;

            cards.forEach(
              (card) => {
                getCardData(
                  card,
                ).targetHoverScale =
                  1;
              },
            );

            canvas.style.cursor =
              "default";

            return;
          }

          if (
            pointer.x < -1 ||
            pointer.x > 1 ||
            pointer.y < -1 ||
            pointer.y > 1
          ) {
            hoveredCard = null;
          } else {
            raycaster.setFromCamera(
              pointer,
              camera,
            );

            const intersections =
              raycaster.intersectObjects(
                cards.filter(
                  (card) => {
                    const data =
                      getCardData(
                        card,
                      );

                    return (
                      card.visible &&
                      data.finalSlot >=
                        0
                    );
                  },
                ),
                false,
              );

            hoveredCard =
              intersections.length >
              0
                ? (intersections[0]
                    .object as CardMesh)
                : null;
          }

          cards.forEach(
            (card) => {
              const data =
                getCardData(
                  card,
                );

              data.targetHoverScale =
                card ===
                hoveredCard
                  ? 1.055
                  : 1;
            },
          );

          canvas.style.cursor =
            hoveredCard
              ? "pointer"
              : "default";
        };

      /* -------------------------------------------------------------------- */
      /*                             RAF LOOP                                 */
      /* -------------------------------------------------------------------- */

      const render = () => {
        if (disposed) {
          return;
        }

        /*
         * Avoid rendering if browser has lost
         * the WebGL context.
         */
        if (
          typeof webglContext.isContextLost ===
            "function" &&
          webglContext.isContextLost()
        ) {
          return;
        }

        currentProgress +=
          (
            targetProgress -
            currentProgress
          ) * 0.105;

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
          rafId = 0;
          return;
        }

        render();

        const progressMoving =
          Math.abs(
            targetProgress -
              currentProgress,
          ) > 0.0001;

        const hoverMoving =
          cards.some(
            (card) => {
              const data =
                getCardData(
                  card,
                );

              return (
                Math.abs(
                  data.targetHoverScale -
                    data.hoverScale,
                ) > 0.001
              );
            },
          );

        if (
          isActive ||
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

      /* -------------------------------------------------------------------- */
      /*                           TEXTURE LOAD                               */
      /* -------------------------------------------------------------------- */

      void Promise.all(
        ITEMS.map(
          loadTexture,
        ),
      ).then(
        (textures) => {
          if (disposed) {
            textures.forEach(
              disposeTexture,
            );

            return;
          }

          textures.forEach(
            (
              texture,
              index,
            ) => {
              createCard(
                ITEMS[index],
                index,
                texture,
              );
            },
          );

          updateScene(
            currentProgress,
          );

          if (
            !webglContext.isContextLost()
          ) {
            renderer.compile(
              scene,
              camera,
            );

            renderer.render(
              scene,
              camera,
            );
          }

          requestFrame();
        },
      );

      /* -------------------------------------------------------------------- */
      /*                        SCROLL PROGRESS                               */
      /* -------------------------------------------------------------------- */

      /*
       * IMPORTANT:
       *
       * No GSAP pin.
       *
       * CSS sticky handles the full-screen viewport.
       * ScrollTrigger only calculates progress.
       */
      const scrollTrigger =
        ScrollTrigger.create({
          id:
            "bezteq-systems-motion-trionn",

          trigger: section,

          start:
            "top top",

          end:
            "bottom bottom",

          invalidateOnRefresh:
            true,

          onEnter: () => {
            if (disposed) {
              return;
            }

            isActive = true;

            requestFrame();
          },

          onEnterBack: () => {
            if (disposed) {
              return;
            }

            isActive = true;

            requestFrame();
          },

          onLeave: () => {
            isActive = false;
          },

          onLeaveBack: () => {
            isActive = false;
          },

          onUpdate: (
            self,
          ) => {
            if (disposed) {
              return;
            }

            targetProgress =
              self.progress;

            requestFrame();
          },

          onRefresh: (
            self,
          ) => {
            if (disposed) {
              return;
            }

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

      /* -------------------------------------------------------------------- */
      /*                               EVENTS                                 */
      /* -------------------------------------------------------------------- */

      const handlePointerMove =
        (
          event: PointerEvent,
        ) => {
          if (disposed) {
            return;
          }

          const bounds =
            canvas.getBoundingClientRect();

          if (
            bounds.width <= 0 ||
            bounds.height <= 0
          ) {
            return;
          }

          pointer.x =
            ((event.clientX -
              bounds.left) /
              bounds.width) *
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
          if (disposed) {
            return;
          }

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
            !interactionEnabled ||
            disposed
          ) {
            return;
          }

          const href =
            getCardData(
              hoveredCard,
            ).href;

          router.push(href);
        };

      const handleResize =
        () => {
          if (disposed) {
            return;
          }

          if (
            webglContext.isContextLost()
          ) {
            return;
          }

          const width =
            canvas.clientWidth;

          const height =
            canvas.clientHeight;

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

      canvas.addEventListener(
        "pointermove",
        handlePointerMove,
      );

      canvas.addEventListener(
        "pointerleave",
        handlePointerLeave,
      );

      canvas.addEventListener(
        "click",
        handleClick,
      );

      window.addEventListener(
        "resize",
        handleResize,
      );

      /* -------------------------------------------------------------------- */
      /*                           INITIAL FRAME                              */
      /* -------------------------------------------------------------------- */

      handleResize();

      updateScene(0);

      requestFrame();

      /* -------------------------------------------------------------------- */
      /*                             FONT READY                               */
      /* -------------------------------------------------------------------- */

      document.fonts?.ready.then(
        () => {
          if (disposed) {
            return;
          }

          ScrollTrigger.refresh();
        },
      );

      /* -------------------------------------------------------------------- */
      /*                              CLEANUP                                 */
      /* -------------------------------------------------------------------- */

      return () => {
        /*
         * FIRST:
         * prevent async callbacks / RAF from doing more work.
         */
        disposed = true;

        isActive = false;

        interactionEnabled =
          false;

        hoveredCard = null;

        /* ------------------------------------------------------------------ */
        /*                              RAF                                   */
        /* ------------------------------------------------------------------ */

        if (rafId) {
          window.cancelAnimationFrame(
            rafId,
          );

          rafId = 0;
        }

        /* ------------------------------------------------------------------ */
        /*                         SCROLL TRIGGER                             */
        /* ------------------------------------------------------------------ */

        /*
         * No pin exists anymore.
         *
         * A normal kill is enough.
         */
        scrollTrigger.kill();

        /* ------------------------------------------------------------------ */
        /*                          EVENT LISTENERS                            */
        /* ------------------------------------------------------------------ */

        canvas.removeEventListener(
          "pointermove",
          handlePointerMove,
        );

        canvas.removeEventListener(
          "pointerleave",
          handlePointerLeave,
        );

        canvas.removeEventListener(
          "click",
          handleClick,
        );

        canvas.removeEventListener(
          "webglcontextlost",
          handleContextLost,
        );

        canvas.removeEventListener(
          "webglcontextrestored",
          handleContextRestored,
        );

        window.removeEventListener(
          "resize",
          handleResize,
        );

        canvas.style.removeProperty(
          "cursor",
        );

        /* ------------------------------------------------------------------ */
        /*                          DOM STYLES                                 */
        /* ------------------------------------------------------------------ */

        resetDOMStyles();

        /* ------------------------------------------------------------------ */
        /*                          CARD RESOURCES                             */
        /* ------------------------------------------------------------------ */

        cards.forEach(
          (card) => {
            scene.remove(
              card,
            );

            card.geometry.dispose();

            card.material.dispose();
          },
        );

        cards.length = 0;

        /* ------------------------------------------------------------------ */
        /*                           TEXTURES                                  */
        /* ------------------------------------------------------------------ */

        loadedTextures.forEach(
          disposeTexture,
        );

        loadedTextures.clear();

        /* ------------------------------------------------------------------ */
        /*                         GUIDE RESOURCES                             */
        /* ------------------------------------------------------------------ */

        scene.remove(
          topGuide,
          bottomGuide,
        );

        topLineGeometry.dispose();

        bottomLineGeometry.dispose();

        topLineMaterial.dispose();

        bottomLineMaterial.dispose();

        /* ------------------------------------------------------------------ */
        /*                              SCENE                                 */
        /* ------------------------------------------------------------------ */

        scene.clear();

        /* ------------------------------------------------------------------ */
        /*                            RENDERER                                 */
        /* ------------------------------------------------------------------ */

        renderer.renderLists.dispose();

        renderer.dispose();

        /*
         * IMPORTANT:
         *
         * Do NOT use:
         *
         * renderer.forceContextLoss();
         *
         * React owns this canvas and Next.js may
         * preserve/recreate route trees during navigation.
         *
         * Force-losing this context is what can lead to:
         *
         * Cannot read properties of null
         * (reading 'precision')
         */

        /*
         * Also DO NOT:
         *
         * canvas.remove()
         * canvas.parentElement?.removeChild(canvas)
         * appendChild(canvas)
         */
      };
    },
    {
      dependencies: [
        prefersReducedMotion,
        router,
      ],

      revertOnUpdate: true,
    },
  );

  /* ------------------------------------------------------------------------ */
  /*                        SECTION SCROLL HEIGHT                              */
  /* ------------------------------------------------------------------------ */

  const sectionStyle =
    {
      "--systems-scroll-height":
        `${
          (
            SCROLL_DISTANCE_VIEWPORTS +
            1
          ) *
          100
        }svh`,
    } as CSSProperties;

  /* ------------------------------------------------------------------------ */
  /*                                  JSX                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      ref={sectionRef}
      id="systems-in-motion"
      style={sectionStyle}
      className={`
        relative
        isolate
        bg-[#EFEFEB]
        text-[#3b3b3b]
        ${
          prefersReducedMotion
            ? ""
            : "lg:h-[var(--systems-scroll-height)]"
        }
      `}
    >
      {/* ------------------------------------------------------------------ */}
      {/*                     MOBILE / REDUCED MOTION                         */}
      {/* ------------------------------------------------------------------ */}

      <div
        className={`
          relative
          overflow-hidden
          px-[var(--space-gutter)]
          py-[var(--space-section)]
          ${
            prefersReducedMotion
              ? ""
              : "lg:hidden"
          }
        `}
      >
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.15em] text-black/50">
          / 05 — Selected environments
        </p>

        <h2 className="mt-6 text-[clamp(3.7rem,15vw,7rem)] font-medium uppercase leading-[0.83] tracking-[-0.07em]">
          Systems in
          <br />
          motion
        </h2>

        <p className="mt-6 max-w-[420px] text-sm leading-6 text-black/55">
          Websites, software and operating systems shown through the
          interfaces they were built to support.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {ITEMS.map(
            (item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black/10">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="
                      (max-width: 640px) 100vw,
                      50vw
                    "
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                </div>

                <div className="flex items-start justify-between gap-5 border-b border-black/20 py-4">
                  <div>
                    <p className="font-mono text-[0.48rem] uppercase tracking-[0.12em] text-black/45">
                      {item.category}
                    </p>

                    <h3 className="mt-2 text-lg font-medium tracking-[-0.035em]">
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
        <div
          className="
            sticky
            top-0
            hidden
            h-[100svh]
            overflow-hidden
            lg:block
          "
        >
          {/* -------------------------------------------------------------- */}
          {/*                        LARGE HEADING                            */}
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
                  ml-[22vw]
                  block
                  w-max
                  text-[clamp(5.2rem,8.6vw,10.2rem)]
                  will-change-transform
                "
              >
                Systems in
              </span>

              <span
                data-motion-line-two
                className="
                  ml-[50vw]
                  mt-[5.8vh]
                  block
                  w-max
                  text-[clamp(5.2rem,8.6vw,10.2rem)]
                  will-change-transform
                "
              >
                Motion
              </span>
            </h2>
          </div>

          {/* -------------------------------------------------------------- */}
          {/*                     CENTER DESCRIPTION                         */}
          {/* -------------------------------------------------------------- */}

          <p
            data-motion-description
            className="
              pointer-events-none
              absolute
              left-[51.5%]
              top-[47%]
              z-10
              max-w-[225px]
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
            Digital systems explored through interface, engineering and
            motion.
          </p>

          {/* -------------------------------------------------------------- */}
          {/*                       BOTTOM COPY                               */}
          {/* -------------------------------------------------------------- */}

          <p
            data-motion-left-copy
            className="
              absolute
              bottom-[5vh]
              left-[2vw]
              z-30
              max-w-[285px]
              text-[0.9rem]
              leading-[1.35]
              text-black/55
              opacity-0
              will-change-transform
            "
          >
            Websites, products and operating environments presented through
            an evolving visual archive.
          </p>

          {/* -------------------------------------------------------------- */}
          {/*                          CTA                                     */}
          {/* -------------------------------------------------------------- */}

          <Link
            data-motion-right-link
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

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </Link>

          {/* -------------------------------------------------------------- */}
          {/*                    REACT-OWNED THREE CANVAS                     */}
          {/* -------------------------------------------------------------- */}

          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="
              absolute
              inset-0
              z-20
              h-full
              w-full
              touch-none
            "
          />

          {/* -------------------------------------------------------------- */}
          {/*                     EDITORIAL PATHS                             */}
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
              d="M310 108 C505 185 655 175 800 140"
              fill="none"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="1"
            />

            <path
              d="M380 350 C580 290 760 298 900 260"
              fill="none"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="1"
            />

            <path
              d="M1370 370 C1270 250 1145 205 990 180"
              fill="none"
              stroke="rgba(0,0,0,0.10)"
              strokeWidth="1"
            />
          </svg>
        </div>
      )}
    </section>
  );
}