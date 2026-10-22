"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type ProgressReference = {
  current: number;
};

type BlackHoleCoreProps = {
  progressRef: ProgressReference;
  reducedMotion?: boolean;
};

function smoothstep(
  minimum: number,
  maximum: number,
  value: number,
) {
  const normalized =
    THREE.MathUtils.clamp(
      (value - minimum) /
        (maximum - minimum),
      0,
      1,
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
  return (
    smoothstep(
      fadeInStart,
      fadeInEnd,
      progress,
    ) *
    (
      1 -
      smoothstep(
        fadeOutStart,
        fadeOutEnd,
        progress,
      )
    )
  );
}

export function BlackHoleCore({
  progressRef,
  reducedMotion = false,
}: BlackHoleCoreProps) {
  const groupRef =
    useRef<THREE.Group>(null);

  const coreMaterialRef =
    useRef<THREE.MeshBasicMaterial>(
      null,
    );

  const innerHaloRef =
    useRef<THREE.MeshBasicMaterial>(
      null,
    );

  const outerHaloRef =
    useRef<THREE.MeshBasicMaterial>(
      null,
    );

  useFrame(
    ({ clock }, delta) => {
      const group =
        groupRef.current;

      const coreMaterial =
        coreMaterialRef.current;

      const innerHalo =
        innerHaloRef.current;

      const outerHalo =
        outerHaloRef.current;

      if (
        !group ||
        !coreMaterial ||
        !innerHalo ||
        !outerHalo
      ) {
        return;
      }

      /*
       * Engineering is stage 04,
       * approximately 60%–80%.
       */
      const visibility =
        stageEnvelope(
          progressRef.current,
          0.56,
          0.64,
          0.81,
          0.89,
        );

      group.visible =
        visibility > 0.002;

      const targetScale =
        0.4 +
        visibility * 0.72;

      group.scale.setScalar(
        THREE.MathUtils.lerp(
          group.scale.x,
          targetScale,
          0.1,
        ),
      );

      coreMaterial.opacity =
        visibility;

      const pulse =
        reducedMotion
          ? 1
          : 0.82 +
            Math.sin(
              clock.elapsedTime * 2.3,
            ) *
              0.18;

      innerHalo.opacity =
        visibility *
        pulse *
        0.58;

      outerHalo.opacity =
        visibility *
        pulse *
        0.2;

      if (!reducedMotion) {
        group.rotation.z -=
          delta *
          0.075 *
          visibility;
      }
    },
  );

  return (
    <group
      ref={groupRef}
      visible={false}
    >
      {/* Solid dark centre */}
      <mesh
        position={[0, 0, 0.42]}
        renderOrder={30}
      >
        <circleGeometry
          args={[0.92, 128]}
        />

        <meshBasicMaterial
          ref={coreMaterialRef}
          color="#020304"
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bright event-horizon edge */}
      <mesh
        position={[0, 0, 0.43]}
        renderOrder={31}
      >
        <ringGeometry
          args={[
            0.91,
            1.035,
            128,
          ]}
        />

        <meshBasicMaterial
          ref={innerHaloRef}
          color="#e8fdff"
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soft cyan outer halo */}
      <mesh
        position={[0, 0, 0.41]}
        renderOrder={29}
      >
        <ringGeometry
          args={[
            1.02,
            1.32,
            128,
          ]}
        />

        <meshBasicMaterial
          ref={outerHaloRef}
          color="#00cae0"
          transparent
          opacity={0}
          depthTest={false}
          depthWrite={false}
          blending={
            THREE.AdditiveBlending
          }
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}