"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

type ProgressReference = {
  current: number;
};

type SparkBurstProps = {
  progressRef: ProgressReference;
  reducedMotion?: boolean;
};

type ArcConfiguration = {
  baseAngle: number;
  radius: number;
  arcLength: number;
  phase: number;
  speed: number;
  direction: number;
  turbulence: number;
  brightness: number;
  depth: number;
};

type ElectricArc = {
  line: THREE.Line;
  geometry: THREE.BufferGeometry;
  material: THREE.LineBasicMaterial;
  positions: Float32Array;
  configuration: ArcConfiguration;
};

const ARC_COUNT = 38;
const POINTS_PER_ARC = 18;

function clamp01(
  value: number,
) {
  return Math.min(
    Math.max(value, 0),
    1,
  );
}

function smoothstep(
  minimum: number,
  maximum: number,
  value: number,
) {
  const normalized =
    clamp01(
      (value - minimum) /
      (maximum - minimum),
    );

  return (
    normalized *
    normalized *
    (3 - 2 * normalized)
  );
}

function seededValue(
  index: number,
  offset = 0,
) {
  const value =
    Math.sin(
      (
        index +
        1 +
        offset
      ) *
      12.9898,
    ) *
    43758.5453123;

  return (
    value -
    Math.floor(value)
  );
}

function createArcConfiguration(
  index: number,
): ArcConfiguration {
  const radiusRandom =
    seededValue(
      index,
      21,
    );

  const lengthRandom =
    seededValue(
      index,
      47,
    );

  const direction =
    seededValue(
      index,
      83,
    ) > 0.5
      ? 1
      : -1;

  return {
    baseAngle:
      seededValue(
        index,
        109,
      ) *
      Math.PI *
      2,

    radius:
      0.72 +
      radiusRandom *
      1.55,

    /*
     * Short curved sections rather than
     * full circles or long radial rays.
     */
    arcLength:
      0.2 +
      lengthRandom *
      0.52,

    phase:
      seededValue(
        index,
        137,
      ) *
      Math.PI *
      2,

    speed:
      0.55 +
      seededValue(
        index,
        163,
      ) *
      1.35,

    direction,

    turbulence:
      0.45 +
      seededValue(
        index,
        191,
      ) *
      0.55,

    brightness:
      0.45 +
      seededValue(
        index,
        223,
      ) *
      0.55,

    depth:
      (
        seededValue(
          index,
          257,
        ) -
        0.5
      ) *
      0.32,
  };
}

function createElectricArc(
  index: number,
): ElectricArc {
  const configuration =
    createArcConfiguration(
      index,
    );

  const positions =
    new Float32Array(
      POINTS_PER_ARC * 3,
    );

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      positions,
      3,
    ),
  );

  const isBrightArc =
    index % 5 === 0;

  const material =
    new THREE.LineBasicMaterial({
      color: isBrightArc
        ? "#effeff"
        : "#8debf5",

      transparent: true,
      opacity: 0,

      depthWrite: false,
      depthTest: false,

      blending:
        THREE.AdditiveBlending,
    });

  material.toneMapped =
    false;

  const line =
    new THREE.Line(
      geometry,
      material,
    );

  line.frustumCulled =
    false;

  line.renderOrder = 15;

  return {
    line,
    geometry,
    material,
    positions,
    configuration,
  };
}

export function SparkBurst({
  progressRef,
  reducedMotion = false,
}: SparkBurstProps) {
  const groupRef =
    useRef<THREE.Group>(null);

  const arcs =
    useMemo(
      () =>
        Array.from(
          {
            length: ARC_COUNT,
          },
          (_, index) =>
            createElectricArc(
              index,
            ),
        ),
      [],
    );

  useEffect(() => {
    return () => {
      arcs.forEach(
        ({
          geometry,
          material,
        }) => {
          geometry.dispose();
          material.dispose();
        },
      );
    };
  }, [arcs]);

  useFrame(({ clock }) => {
    const progress =
      clamp01(
        progressRef.current,
      );

    /*
     * Electric current begins during Strategy,
     * becomes strongest in Architecture,
     * then fades before Engineering.
     */
    const fadeIn =
      smoothstep(
        0.18,
        0.28,
        progress,
      );

    const fadeOut =
      1 -
      smoothstep(
        0.58,
        0.68,
        progress,
      );

    const visibility =
      fadeIn *
      fadeOut;

    const architectureEnergy =
      smoothstep(
        0.34,
        0.46,
        progress,
      ) *
      (
        1 -
        smoothstep(
          0.56,
          0.66,
          progress,
        )
      );

    const strategyEnergy =
      smoothstep(
        0.2,
        0.3,
        progress,
      ) *
      (
        1 -
        smoothstep(
          0.4,
          0.5,
          progress,
        )
      );

    const energy =
      Math.max(
        strategyEnergy *
        0.72,
        architectureEnergy,
      );

    const group =
      groupRef.current;

    if (group) {
      group.visible =
        visibility > 0.003;

      const targetScale =
        0.92 +
        energy * 0.14;

      group.scale.setScalar(
        THREE.MathUtils.lerp(
          group.scale.x,
          targetScale,
          0.08,
        ),
      );
    }

    const time =
      reducedMotion
        ? 0
        : clock.elapsedTime;

    arcs.forEach(
      (
        {
          line,
          geometry,
          material,
          positions,
          configuration,
        },
        arcIndex,
      ) => {
        const flicker =
          reducedMotion
            ? 1
            : 0.76 +
            Math.sin(
              time *
              (
                4.5 +
                configuration
                  .speed
              ) +
              configuration
                .phase,
            ) *
            0.16 +
            Math.sin(
              time * 10.5 +
              arcIndex,
            ) *
            0.08;

        material.opacity =
          visibility *
          configuration
            .brightness *
          flicker *
          0.46;

        line.visible =
          material.opacity >
          0.002;

        /*
         * Arcs rotate independently around
         * the core like electrical current.
         */
        const movingBaseAngle =
          configuration
            .baseAngle +
          time *
          configuration
            .speed *
          configuration
            .direction *
          0.38;

        const currentRadius =
          configuration.radius +
          Math.sin(
            time *
            1.7 +
            configuration
              .phase,
          ) *
          0.07 *
          configuration
            .turbulence;

        const currentLength =
          configuration
            .arcLength *
          (
            0.82 +
            energy * 0.42
          );

        for (
          let pointIndex = 0;
          pointIndex <
          POINTS_PER_ARC;
          pointIndex += 1
        ) {
          const t =
            pointIndex /
            (
              POINTS_PER_ARC -
              1
            );

          /*
           * Curve around the centre.
           */
          const arcAngle =
            movingBaseAngle +
            (
              t -
              0.5
            ) *
            currentLength *
            configuration
              .direction;

          /*
           * High-frequency waves produce
           * electrical irregularity.
           */
          const primaryCurrent =
            Math.sin(
              t * 18 +
              time *
              (
                5 +
                configuration
                  .speed
              ) +
              configuration
                .phase,
            ) *
            0.042 *
            configuration
              .turbulence *
            (
              0.48 +
              energy * 0.52
            );

          const secondaryCurrent =
            Math.sin(
              t * 41 -
              time * 7.2 +
              configuration
                .phase *
              1.7,
            ) *
            0.018 *
            energy;

          /*
           * Fade turbulence near both ends
           * so the arc looks naturally tapered.
           */
          const endFalloff =
            Math.sin(
              t *
              Math.PI,
            );

          const electricOffset =
            (
              primaryCurrent +
              secondaryCurrent
            ) *
            endFalloff;

          const radius =
            currentRadius +
            electricOffset;

          const ellipseScale =
            0.62 +
            Math.sin(
              configuration
                .phase,
            ) *
            0.08;

          const x =
            Math.cos(
              arcAngle,
            ) *
            radius;

          const y =
            Math.sin(
              arcAngle,
            ) *
            radius *
            ellipseScale;

          const z =
            configuration.depth +
            Math.sin(
              t * 7 +
              time * 2.1 +
              configuration
                .phase,
            ) *
            0.025 *
            energy;

          const offset =
            pointIndex * 3;

          positions[offset] =
            x;

          positions[
            offset + 1
          ] = y;

          positions[
            offset + 2
          ] = z;
        }

        const positionAttribute =
          geometry.getAttribute(
            "position",
          ) as THREE.BufferAttribute;

        positionAttribute.needsUpdate = true;
      },
    );
  });

  return (
    <group ref={groupRef} visible={false}>
      {arcs.map((arc, index) => (
        <primitive
          key={`electric-arc-${index}`}
          object={arc.line}
        />
      ))}
    </group>
  );
}