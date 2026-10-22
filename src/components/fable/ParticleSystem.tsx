"use client";

import {
  useEffect,
  useMemo,
} from "react";

import {
  useFrame,
  useThree,
} from "@react-three/fiber";

import * as THREE from "three";

import {
  createParticleTargets,
} from "./particle-shapes";

import {
  createParticleMaterial,
} from "./particleMaterial";

type ProgressReference = {
  current: number;
};

type ParticleSystemProps = {
  progressRef: ProgressReference;
  count?: number;
  reducedMotion?: boolean;
};

type ParticleMotionData = {
  phase: Float32Array;
  speed: Float32Array;
  wobble: Float32Array;
  direction: Float32Array;
};

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

function easeInOut(
  value: number,
) {
  return (
    value *
    value *
    (3 - 2 * value)
  );
}

function mix(
  a: number,
  b: number,
  t: number,
) {
  return a + (b - a) * t;
}

function seededValue(
  index: number,
  offset = 0,
) {
  const value =
    Math.sin(
      (index + 1 + offset) *
        12.9898,
    ) * 43758.5453123;

  return (
    value - Math.floor(value)
  );
}

function createRandomAttribute(
  count: number,
) {
  const values =
    new Float32Array(count);

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    values[index] =
      seededValue(index);
  }

  return values;
}

function createMotionData(
  count: number,
): ParticleMotionData {
  const phase =
    new Float32Array(count);

  const speed =
    new Float32Array(count);

  const wobble =
    new Float32Array(count);

  const direction =
    new Float32Array(count);

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    phase[index] =
      seededValue(
        index,
        77,
      ) *
      Math.PI *
      2;

    speed[index] =
      0.3 +
      seededValue(
        index,
        151,
      ) *
      0.9;

    wobble[index] =
      0.35 +
      seededValue(
        index,
        239,
      ) *
      0.75;

    direction[index] =
      seededValue(
        index,
        331,
      ) > 0.34
        ? 1
        : -1;
  }

  return {
    phase,
    speed,
    wobble,
    direction,
  };
}

export function ParticleSystem({
  progressRef,
  count = 7600,
  reducedMotion = false,
}: ParticleSystemProps) {
  const targets =
    useMemo(
      () =>
        createParticleTargets(
          count,
        ),
      [count],
    );

  /*
   * Shapes:
   * 01 intro cloud
   * 02 spiral galaxy
   * 03 architecture core
   * 04 black hole
   * 05 BEZTEQ
   */
  const sequence =
    useMemo(
      () => [
        targets.intro,
        targets.spiral,
        targets.core,
        targets.blackHole,
        targets.bezteq,
      ],
      [targets],
    );

  const motionData =
    useMemo(
      () =>
        createMotionData(
          count,
        ),
      [count],
    );

  const geometry =
    useMemo(() => {
      const particleGeometry =
        new THREE.BufferGeometry();

      const renderedPositions =
        new Float32Array(
          sequence[0],
        );

      const secondaryPositions =
        new Float32Array(
          sequence[0],
        );

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
          renderedPositions,
          3,
        ),
      );

      particleGeometry.setAttribute(
        "aPositionB",
        new THREE.BufferAttribute(
          secondaryPositions,
          3,
        ),
      );

      particleGeometry.setAttribute(
        "aRandom",
        new THREE.BufferAttribute(
          createRandomAttribute(
            count,
          ),
          1,
        ),
      );

      particleGeometry.setDrawRange(
        0,
        count,
      );

      return particleGeometry;
    }, [
      count,
      sequence,
    ]);

  const material =
    useMemo(
      () =>
        createParticleMaterial(),
      [],
    );

  const { gl } =
    useThree();

  useEffect(() => {
    material.uniforms
      .uPixelRatio.value =
      Math.min(
        gl.getPixelRatio(),
        1.6,
      );
  }, [
    gl,
    material,
  ]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame(({ clock }) => {
    const rawProgress =
      clamp01(
        progressRef.current,
      );

    const progress =
      clamp01(
        rawProgress / 0.94,
      );

    const segmentCount =
      sequence.length - 1;

    const scaledProgress =
      progress *
      segmentCount;

    let segment =
      Math.min(
        Math.floor(
          scaledProgress,
        ),
        segmentCount - 1,
      );

    let localProgress =
      scaledProgress -
      segment;

    if (progress >= 1) {
      segment =
        segmentCount - 1;
      localProgress = 1;
    }

    const easedProgress =
      easeInOut(
        localProgress,
      );

    const sourcePositions =
      sequence[segment];

    const targetPositions =
      sequence[
        segment + 1
      ];

    const positionAttribute =
      geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;

    const renderedPositions =
      positionAttribute
        .array as Float32Array;

    const time =
      reducedMotion
        ? 0
        : clock.elapsedTime;

    for (
      let index = 0;
      index < count;
      index += 1
    ) {
      const offset =
        index * 3;

      const sourceX =
        sourcePositions[
          offset
        ];

      const sourceY =
        sourcePositions[
          offset + 1
        ];

      const sourceZ =
        sourcePositions[
          offset + 2
        ];

      const targetX =
        targetPositions[
          offset
        ];

      const targetY =
        targetPositions[
          offset + 1
        ];

      const targetZ =
        targetPositions[
          offset + 2
        ];

      let x = mix(
        sourceX,
        targetX,
        easedProgress,
      );

      let y = mix(
        sourceY,
        targetY,
        easedProgress,
      );

      let z = mix(
        sourceZ,
        targetZ,
        easedProgress,
      );

      const phase =
        motionData.phase[
          index
        ];

      const speed =
        motionData.speed[
          index
        ];

      const wobble =
        motionData.wobble[
          index
        ];

      const direction =
        motionData.direction[
          index
        ];

      const radius =
        Math.max(
          0.001,
          Math.hypot(x, y),
        );

      const angle =
        Math.atan2(y, x);

      /*
       * 01 → 02
       * Cloud becomes a real galaxy drift.
       */
      if (
        segment === 0 &&
        !reducedMotion
      ) {
        const travelStrength =
          1 -
          smoothstep(
            0.15,
            0.95,
            easedProgress,
          );

        const swirlAngle =
          angle +
          time *
            (
              0.12 +
              speed * 0.22
            ) *
            direction *
            0.45 +
          radius * 0.08;

        const swirlRadius =
          radius *
            (
              1.04 -
              easedProgress * 0.08
            ) +
          Math.sin(
            time * 0.65 +
              phase,
          ) *
            0.05 *
            wobble;

        x =
          Math.cos(
            swirlAngle,
          ) *
            swirlRadius +
          0.18 *
            travelStrength;

        y =
          Math.sin(
            swirlAngle,
          ) *
          swirlRadius *
          0.74;

        z +=
          Math.sin(
            time * 0.55 +
              phase,
          ) *
          0.14 *
          travelStrength;
      }

      /*
       * 02 → 03
       * The galaxy tightens and becomes
       * more organized.
       */
      if (
        segment === 1 &&
        !reducedMotion
      ) {
        const tighten =
          smoothstep(
            0.08,
            0.88,
            easedProgress,
          );

        const orbitAngle =
          angle +
          time *
            (
              0.16 +
              speed * 0.24
            ) *
            direction;

        const pulse =
          1 +
          Math.sin(
            time * 1.8 +
              phase,
          ) *
            0.045 *
            wobble;

        const tightenedRadius =
          radius *
          mix(
            1.0,
            0.86,
            tighten,
          );

        x =
          Math.cos(
            orbitAngle,
          ) *
          tightenedRadius *
          pulse;

        y =
          Math.sin(
            orbitAngle,
          ) *
          tightenedRadius *
          0.72 *
          pulse;

        z +=
          Math.cos(
            time * 1.3 +
              phase,
          ) *
          0.07 *
          (1 - tighten * 0.35);
      }

      /*
       * 03 → 04
       * Architecture becomes a stronger
       * concentrated core before engineering.
       */
      if (
        segment === 2 &&
        !reducedMotion
      ) {
        const collapse =
          smoothstep(
            0.12,
            0.82,
            easedProgress,
          );

        const pulse =
          1 +
          Math.sin(
            time * 2.25 +
              phase,
          ) *
            0.06 *
            wobble;

        const rotation =
          angle +
          time *
            (
              0.08 +
              speed * 0.16
            ) *
            direction *
            0.75;

        const compactRadius =
          radius *
          mix(
            1.0,
            0.8,
            collapse,
          );

        x =
          Math.cos(
            rotation,
          ) *
          compactRadius *
          pulse;

        y =
          Math.sin(
            rotation,
          ) *
          compactRadius *
          0.82 *
          pulse;

        z +=
          Math.sin(
            time * 1.9 +
              phase,
          ) *
          0.05 *
          (1 - collapse * 0.35);
      }

      /*
       * 04 → 05
       * Black-hole orbit gradually settles
       * into BEZTEQ.
       *
       * Black-hole visual styling itself
       * will be improved in the next step.
       */
      if (
        segment === 3 &&
        !reducedMotion
      ) {
        const settleStrength =
          smoothstep(
            0.16,
            0.94,
            easedProgress,
          );

        const orbitStrength =
          1 - settleStrength;

        const flatten =
          0.58;

        const correctedY =
          y /
          Math.max(
            flatten,
            0.001,
          );

        const baseRadius =
          Math.max(
            0.001,
            Math.hypot(
              x,
              correctedY,
            ),
          );

        const baseAngle =
          Math.atan2(
            correctedY,
            x,
          );

        const orbitAngle =
          baseAngle +
          time *
            (
              0.18 +
              speed * 0.44
            ) *
            direction *
            orbitStrength;

        const orbitRadius =
          baseRadius +
          Math.sin(
            time * 1.35 +
              phase,
          ) *
            0.035 *
            wobble *
            orbitStrength;

        const orbitX =
          Math.cos(
            orbitAngle,
          ) * orbitRadius;

        const orbitY =
          Math.sin(
            orbitAngle,
          ) *
          orbitRadius *
          flatten;

        x = mix(
          orbitX,
          x,
          settleStrength,
        );

        y = mix(
          orbitY,
          y,
          settleStrength,
        );

        z =
          mix(
            z +
              Math.sin(
                time * 1.65 +
                  phase,
              ) *
                0.03 *
                orbitStrength,
            z * 0.16,
            settleStrength,
          );
      }

      renderedPositions[
        offset
      ] = x;

      renderedPositions[
        offset + 1
      ] = y;

      renderedPositions[
        offset + 2
      ] = z;
    }

    positionAttribute.needsUpdate =
      true;

    /*
     * CPU animation controls the particle
     * positions, so shader morphing stays off.
     */
    material.uniforms
      .uMorph.value = 0;

    material.uniforms
      .uTime.value =
      time;

    const noiseBySegment = [
      0.02,
      0.014,
      0.01,
      0.004,
    ];

    const sizeBySegment = [
      7.2,
      7.5,
      7.8,
      6.4,
    ];

    const opacityBySegment = [
      0.84,
      0.92,
      0.96,
      0.98,
    ];

    const targetNoise =
      reducedMotion
        ? 0
        : noiseBySegment[
            segment
          ] ?? 0.01;

    const targetSize =
      sizeBySegment[
        segment
      ] ?? 7;

    const targetOpacity =
      opacityBySegment[
        segment
      ] ?? 0.9;

    material.uniforms
      .uNoiseStrength.value =
      THREE.MathUtils.lerp(
        material.uniforms
          .uNoiseStrength
          .value,
        targetNoise,
        0.08,
      );

    material.uniforms
      .uPointSize.value =
      THREE.MathUtils.lerp(
        material.uniforms
          .uPointSize
          .value,
        targetSize,
        0.08,
      );

    material.uniforms
      .uOpacity.value =
      THREE.MathUtils.lerp(
        material.uniforms
          .uOpacity
          .value,
        targetOpacity,
        0.08,
      );
  });

  return (
    <points
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}