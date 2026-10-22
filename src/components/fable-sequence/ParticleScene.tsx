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

const PARTICLE_OFFSET_X = 2;

function smoothstep(
  minimum: number,
  maximum: number,
  value: number,
) {
  const normalized =
    THREE.MathUtils.clamp(
      (
        value -
        minimum
      ) /
      (
        maximum -
        minimum
      ),
      0,
      1,
    );

  return (
    normalized *
    normalized *
    (
      3 -
      2 * normalized
    )
  );
}

function ParticleStage({
  progressRef,
  count,
  reducedMotion,
}: ParticleStageProps) {
  const groupRef =
    useRef<THREE.Group>(
      null,
    );

  useFrame(
    (
      {
        pointer,
      },
      delta,
    ) => {
      const group =
        groupRef.current;

      if (!group) {
        return;
      }

      const progress =
        progressRef.current;

      /*
       * Lock the final BEZTEQ logo facing
       * straight towards the camera.
       */
      const logoLock =
        smoothstep(
          0.76,
          0.94,
          progress,
        );

      const movementStrength =
        reducedMotion
          ? 0
          : 1 - logoLock;

      const targetRotationX =
        pointer.y *
        0.035 *
        movementStrength;

      const targetRotationY =
        pointer.x *
        0.05 *
        movementStrength;

      group.rotation.x =
        THREE.MathUtils.lerp(
          group.rotation.x,
          targetRotationX,
          0.045,
        );

      group.rotation.y =
        THREE.MathUtils.lerp(
          group.rotation.y,
          targetRotationY,
          0.045,
        );

      if (!reducedMotion) {
        group.rotation.z +=
          delta *
          0.022 *
          movementStrength;
      }

      /*
       * Straighten final wordmark.
       */
      group.rotation.z =
        THREE.MathUtils.lerp(
          group.rotation.z,
          0,
          logoLock * 0.075,
        );

      const targetScale =
        1.04 +
        Math.sin(
          progress *
          Math.PI,
        ) *
        0.07;

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
        progressRef={
          progressRef
        }
        count={count}
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
  progressRef:
    ProgressReference;

  reducedMotion:
    boolean;
}) {
  useFrame(
    ({
      camera,
      pointer,
    }) => {
      const progress =
        progressRef.current;

      const logoLock =
        smoothstep(
          0.76,
          0.94,
          progress,
        );

      const pointerStrength =
        reducedMotion
          ? 0
          : 1 - logoLock;

      const targetX =
        pointer.x *
        0.11 *
        pointerStrength;

      const targetY =
        pointer.y *
        0.075 *
        pointerStrength;

      const targetZ =
        8.8 -
        Math.sin(
          progress *
          Math.PI,
        ) *
        0.34;

      camera.position.x =
        THREE.MathUtils.lerp(
          camera.position.x,
          targetX,
          0.045,
        );

      camera.position.y =
        THREE.MathUtils.lerp(
          camera.position.y,
          targetY,
          0.045,
        );

      camera.position.z =
        THREE.MathUtils.lerp(
          camera.position.z,
          targetZ,
          0.045,
        );

      camera.lookAt(
        PARTICLE_OFFSET_X *
          0.54,
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
        return 9000;
      }

      if (
        window.innerWidth <
        768
      ) {
        return 4200;
      }

      return 9000;
    });

  return (
    <Canvas
      className="h-full w-full"
      dpr={[1, 1.5]}
      camera={{
        position: [
          0,
          0,
          8.8,
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
      onCreated={({
        gl,
      }) => {
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