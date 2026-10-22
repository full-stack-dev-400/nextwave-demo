"use client";

import {
  useEffect,
  useMemo,
  useRef,
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
} from "./particle-material";

type ProgressReference = {
  current: number;
};

type ParticleSystemProps = {
  progressRef: ProgressReference;
  count?: number;
  reducedMotion?: boolean;
};

function clamp01(value: number) {
  return Math.min(
    Math.max(value, 0),
    1,
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
    const value =
      Math.sin(
        (index + 1) *
        12.9898,
      ) *
      43758.5453;

    values[index] =
      value -
      Math.floor(value);
  }

  return values;
}

export function ParticleSystem({
  progressRef,
  count = 9000,
  reducedMotion = false,
}: ParticleSystemProps) {
  const currentSegmentRef =
    useRef(-1);

  const targets =
    useMemo(
      () =>
        createParticleTargets(
          count,
        ),
      [count],
    );

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

  const geometry =
    useMemo(() => {
      const particleGeometry =
        new THREE.BufferGeometry();

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array(
            sequence[0],
          ),
          3,
        ),
      );

      particleGeometry.setAttribute(
        "aPositionB",
        new THREE.BufferAttribute(
          new Float32Array(
            sequence[1],
          ),
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

    /*
     * Finish the BEZTEQ formation at 90%
     * and hold it during the final scroll.
     */
    const progress =
      clamp01(
        rawProgress / 0.9,
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

    if (
      currentSegmentRef.current !==
      segment
    ) {
      const positionAttribute =
        geometry.getAttribute(
          "position",
        ) as THREE.BufferAttribute;

      const targetAttribute =
        geometry.getAttribute(
          "aPositionB",
        ) as THREE.BufferAttribute;

      positionAttribute.copyArray(
        sequence[segment],
      );

      targetAttribute.copyArray(
        sequence[
          segment + 1
        ],
      );

      positionAttribute.needsUpdate =
        true;

      targetAttribute.needsUpdate =
        true;

      currentSegmentRef.current =
        segment;
    }

    material.uniforms
      .uMorph.value =
      localProgress;

    material.uniforms
      .uTime.value =
      reducedMotion
        ? 0
        : clock.elapsedTime;

    /*
     * Four transitions:
     *
     * 0 field → galaxy
     * 1 galaxy → core
     * 2 core → black hole
     * 3 black hole → BEZTEQ
     */
    const noiseBySegment = [
      0.1,
      0.06,
      0.045,
      0.014,
    ];

    const sizeBySegment = [
      6.4,
      7.1,
      7.3,
      5.9,
    ];

    const opacityBySegment = [
      0.72,
      0.82,
      0.87,
      0.96,
    ];

    const targetNoise =
      reducedMotion
        ? 0
        : noiseBySegment[
            segment
          ] ?? 0.05;

    const targetSize =
      sizeBySegment[
        segment
      ] ?? 6.5;

    const targetOpacity =
      opacityBySegment[
        segment
      ] ?? 0.8;

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
          .uPointSize.value,
        targetSize,
        0.08,
      );

    material.uniforms
      .uOpacity.value =
      THREE.MathUtils.lerp(
        material.uniforms
          .uOpacity.value,
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