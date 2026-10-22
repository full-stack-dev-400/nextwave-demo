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

import {
  createNetworkLinePositions,
} from "./particle-shapes";

type ProgressReference = {
  current: number;
};

type ParticleConnectionsProps = {
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

export function ParticleConnections({
  progressRef,
  reducedMotion = false,
}: ParticleConnectionsProps) {
  const materialRef =
    useRef<THREE.LineBasicMaterial>(
      null,
    );

  const geometry = useMemo(() => {
    const lineGeometry =
      new THREE.BufferGeometry();

    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        createNetworkLinePositions(),
        3,
      ),
    );

    return lineGeometry;
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame(() => {
    const material =
      materialRef.current;

    if (!material) {
      return;
    }

    const progress =
      progressRef.current;

    const visibility =
      reducedMotion
        ? 0.32
        : smoothstep(
            0.78,
            0.96,
            progress,
          ) * 0.42;

    material.opacity = visibility;
  });

  return (
    <lineSegments
      geometry={geometry}
      frustumCulled={false}
    >
      <lineBasicMaterial
        ref={materialRef}
        color="#00cae0"
        transparent
        opacity={0}
        depthWrite={false}
        blending={
          THREE.AdditiveBlending
        }
      />
    </lineSegments>
  );
}