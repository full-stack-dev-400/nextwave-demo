"use client";

import {
  Suspense,
  useRef,
  useState,
} from "react";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

import {
  ParticleSystem,
} from "./ParticleSystem";

import {
  SparkBurst,
} from "./SparkBurst";

type ProgressReference = {
  current: number;
};

type ParticleSceneProps = {
  progressRef: ProgressReference;
  reducedMotion?: boolean;
};

type ParticleStageProps = {
  progressRef: ProgressReference;
  count: number;
  reducedMotion: boolean;
};

const PARTICLE_OFFSET_X = 1.85;

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

function stageEnvelope(
  progress: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number,
) {
  const entrance =
    smoothstep(
      fadeInStart,
      fadeInEnd,
      progress,
    );

  const exit =
    1 -
    smoothstep(
      fadeOutStart,
      fadeOutEnd,
      progress,
    );

  return entrance * exit;
}

function ParticleStage({
  progressRef,
  count,
  reducedMotion,
}: ParticleStageProps) {
  const groupRef =
    useRef<THREE.Group>(null);

  useFrame(
    ({ pointer }, delta) => {
      const group =
        groupRef.current;

      if (!group) {
        return;
      }

      const progress =
        clamp01(
          progressRef.current,
        );

      if (reducedMotion) {
        group.rotation.set(
          0,
          0,
          0,
        );

        group.scale.setScalar(
          1.03,
        );

        return;
      }

      /*
       * Strategy and Architecture receive
       * slightly stronger scene movement.
       */
      const energyMotion =
        stageEnvelope(
          progress,
          0.18,
          0.28,
          0.6,
          0.7,
        );

      /*
       * Stop all group movement while the
       * final BEZTEQ formation appears.
       */
      const logoLock =
        smoothstep(
          0.78,
          0.95,
          progress,
        );

      const movementStrength =
        1 - logoLock;

      const targetRotationX =
        pointer.y *
        0.022 *
        movementStrength;

      const targetRotationY =
        pointer.x *
        0.034 *
        movementStrength;

      group.rotation.x =
        THREE.MathUtils.lerp(
          group.rotation.x,
          targetRotationX,
          0.04,
        );

      group.rotation.y =
        THREE.MathUtils.lerp(
          group.rotation.y,
          targetRotationY,
          0.04,
        );

      /*
       * Keep whole-scene rotation very low.
       * Individual particle movement is handled
       * inside ParticleSystem.
       */
      group.rotation.z +=
        delta *
        (
          0.0012 +
          energyMotion * 0.002
        ) *
        movementStrength;

      /*
       * Return the final BEZTEQ formation
       * to a straight front-facing position.
       */
      group.rotation.x =
        THREE.MathUtils.lerp(
          group.rotation.x,
          0,
          logoLock * 0.085,
        );

      group.rotation.y =
        THREE.MathUtils.lerp(
          group.rotation.y,
          0,
          logoLock * 0.085,
        );

      group.rotation.z =
        THREE.MathUtils.lerp(
          group.rotation.z,
          0,
          logoLock * 0.09,
        );

      /*
       * Slight scale increase during the
       * central energy stages.
       */
      const middleScale =
        Math.sin(
          progress *
          Math.PI,
        ) * 0.055;

      const targetScale =
        1.02 +
        middleScale;

      const nextScale =
        THREE.MathUtils.lerp(
          group.scale.x,
          targetScale,
          0.045,
        );

      group.scale.setScalar(
        nextScale,
      );
    },
  );

  return (
    <group
      ref={groupRef}
      position={[
        PARTICLE_OFFSET_X,
        0,
        0,
      ]}
    >
      <ParticleSystem
        progressRef={progressRef}
        count={count}
        reducedMotion={
          reducedMotion
        }
      />

      <SparkBurst
        progressRef={progressRef}
        reducedMotion={
          reducedMotion
        }
      />
    </group>
  );
}

function CameraRig({
  progressRef,
  reducedMotion,
}: {
  progressRef: ProgressReference;
  reducedMotion: boolean;
}) {
  useFrame(
    ({
      camera,
      pointer,
    }) => {
      const progress =
        clamp01(
          progressRef.current,
        );

      const logoLock =
        smoothstep(
          0.78,
          0.95,
          progress,
        );

      const pointerStrength =
        reducedMotion
          ? 0
          : 1 - logoLock;

      const targetX =
        pointer.x *
        0.09 *
        pointerStrength;

      const targetY =
        pointer.y *
        0.065 *
        pointerStrength;

      /*
       * Move slightly closer during the
       * middle stages.
       */
      const targetZ =
        8.85 -
        Math.sin(
          progress *
          Math.PI,
        ) * 0.28;

      camera.position.x =
        THREE.MathUtils.lerp(
          camera.position.x,
          targetX,
          0.04,
        );

      camera.position.y =
        THREE.MathUtils.lerp(
          camera.position.y,
          targetY,
          0.04,
        );

      camera.position.z =
        THREE.MathUtils.lerp(
          camera.position.z,
          targetZ,
          0.04,
        );

      /*
       * Keep the animation on the right side,
       * leaving space for the section text.
       */
      camera.lookAt(
        PARTICLE_OFFSET_X * 0.52,
        0,
        0,
      );
    },
  );

  return null;
}

export function ParticleScene({
  progressRef,
  reducedMotion = false,
}: ParticleSceneProps) {
  const [particleCount] =
    useState(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return 7600;
      }

      if (
        window.innerWidth <
        640
      ) {
        return 3000;
      }

      if (
        window.innerWidth <
        1024
      ) {
        return 5000;
      }

      return 7600;
    });

  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.5]}
      camera={{
        position: [
          0,
          0,
          8.85,
        ],
        fov: 46,
        near: 0.1,
        far: 100,
      }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference:
          "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(
          "#0b0c0e",
          0,
        );

        gl.outputColorSpace =
          THREE.SRGBColorSpace;

        gl.toneMapping =
          THREE.NoToneMapping;
      }}
    >
      <Suspense fallback={null}>
        <CameraRig
          progressRef={
            progressRef
          }
          reducedMotion={
            reducedMotion
          }
        />

        <ParticleStage
          progressRef={
            progressRef
          }
          count={
            particleCount
          }
          reducedMotion={
            reducedMotion
          }
        />
      </Suspense>
    </Canvas>
  );
}