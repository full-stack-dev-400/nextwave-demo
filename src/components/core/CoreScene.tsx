"use client";

/**
 * This component reads a ref-held BufferGeometry during render to pass it
 * as a JSX prop, then mutates its buffers every frame — the standard R3F
 * performance pattern of updating a GPU-backed object in place rather than
 * recreating it on each render. That's incompatible with the "rules of
 * react" hooks lint's compiler-safety assumption that ref values are never
 * read during render, which has no carve-out for raw WebGL scratch state.
 */
/* eslint-disable react-hooks/refs */

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useDegradation } from "@/providers/DegradationProvider";
import {
  BASE_VERTICES,
  EDGES,
  getMorphTargets,
  type MorphState,
} from "./morph-states";

const COBALT = new THREE.Color("#00cae0");
const BONE = new THREE.Color("#F2F0EA");
const SIGNAL = new THREE.Color("#d8d8d3");

/** Idle spin rate, rad/s (Motion Spec §3). */
const IDLE_SPIN = 0.15;
/** Cursor-tilt lerp factor per frame — heavy, weighted feel, not snappy. */
const TILT_LERP = 0.05;
/** Morph-state transition speed — settles over roughly dur-base (0.8s). */
const MORPH_LERP = 0.06;

function Lattice({ morphState }: { morphState: MorphState }) {
  const { tier } = useDegradation();
  const { invalidate } = useThree();
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.InstancedMesh>(null);

  // Low-GPU / reduced-motion render exactly one frozen frame — no spin, no
  // tilt, no ripple (Motion Spec §11 degradation ladder).
  const frozen = tier === "reduced" || tier === "low-gpu";
  const animateIdle = !frozen && (tier === "full" || tier === "mobile");
  const animateTilt = !frozen && tier === "full";
  const animateRipple = !frozen && (tier === "full" || tier === "mobile");
  const opacity = tier === "mobile" ? 0.4 : 1;

  // Scratch three.js objects mutated every frame for performance — a ref
  // (not useMemo) is the correct home for this: refs are the sanctioned
  // mutable escape hatch, useMemo values are assumed pure/immutable.
  const scratch = useRef<{
    targets: Record<MorphState, [number, number, number][]>;
    current: THREE.Vector3[];
    positions: Float32Array;
    geometry: THREE.BufferGeometry;
    dummy: THREE.Object3D;
  } | null>(null);
  if (scratch.current === null) {
    const positions = new Float32Array(EDGES.length * 2 * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    scratch.current = {
      targets: getMorphTargets(),
      current: BASE_VERTICES.map((v) => new THREE.Vector3(...v)),
      positions,
      geometry,
      dummy: new THREE.Object3D(),
    };
  }
  const { targets, current, positions, geometry, dummy } = scratch.current;
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (!animateTilt) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.tx = ((e.clientX / window.innerWidth) * 2 - 1) * 0.5;
      pointer.current.ty = ((e.clientY / window.innerHeight) * 2 - 1) * 0.5;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [animateTilt]);

  const writeBuffers = (verts: THREE.Vector3[]) => {
    let ptr = 0;
    for (const [a, b] of EDGES) {
      positions[ptr++] = verts[a].x;
      positions[ptr++] = verts[a].y;
      positions[ptr++] = verts[a].z;
      positions[ptr++] = verts[b].x;
      positions[ptr++] = verts[b].y;
      positions[ptr++] = verts[b].z;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeBoundingSphere();

    const im = pointsRef.current;
    if (im) {
      verts.forEach((v, i) => {
        dummy.position.copy(v);
        dummy.scale.setScalar(1 + (v.z + 1) * 0.35);
        dummy.updateMatrix();
        im.setMatrixAt(i, dummy.matrix);
      });
      im.instanceMatrix.needsUpdate = true;
    }
  };

  // Frozen tiers: snap straight to the target shape once and render a single frame.
  useEffect(() => {
    if (!frozen) return;
    const target = targets[morphState];
    current.forEach((v, i) => v.set(...target[i]));
    writeBuffers(current);
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozen, morphState]);

  useFrame((state, delta) => {
    if (frozen) return;

    const g = group.current;
    if (g) {
      if (animateIdle) g.rotation.y += IDLE_SPIN * delta;
      if (animateTilt) {
        pointer.current.x += (pointer.current.tx - pointer.current.x) * TILT_LERP;
        pointer.current.y += (pointer.current.ty - pointer.current.y) * TILT_LERP;
        g.rotation.x = pointer.current.y;
        g.rotation.z = -pointer.current.x * 0.2;
      }
    }

    const target = targets[morphState];
    for (let i = 0; i < current.length; i++) {
      const [tx, ty, tz] = target[i];
      current[i].x += (tx - current[i].x) * MORPH_LERP;
      current[i].y += (ty - current[i].y) * MORPH_LERP;
      current[i].z += (tz - current[i].z) * MORPH_LERP;
    }

    const t = state.clock.elapsedTime;
    const displaced = animateRipple
      ? current.map((v, i) => {
          if (morphState === "surface") {
            const ripple = Math.sin(t * 1.2 + v.x * 2 + v.y * 2) * 0.06;
            return new THREE.Vector3(v.x, v.y, v.z + ripple);
          }
          if (morphState === "waveform") {
            const wave = Math.sin(t * 1.6 + i * 0.9) * 0.18;
            return new THREE.Vector3(v.x, v.y, v.z + wave);
          }
          return v;
        })
      : current;

    writeBuffers(displaced);
  });

  return (
    <group ref={group} scale={0.85}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color={COBALT} transparent opacity={0.4 * opacity} />
      </lineSegments>
      <instancedMesh ref={pointsRef} args={[undefined, undefined, BASE_VERTICES.length]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color={BONE} transparent opacity={opacity} />
      </instancedMesh>
      <pointLight color={SIGNAL} intensity={0.6} position={[0, 0, 2]} />
    </group>
  );
}

export default function CoreScene({
  morphState = "lattice",
  paused = false,
}: {
  morphState?: MorphState;
  paused?: boolean;
}) {
  const { tier } = useDegradation();
  const frozen = tier === "reduced" || tier === "low-gpu";

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 40 }}
      frameloop={paused ? "never" : frozen ? "demand" : "always"}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#0B0C0E", 3, 7]} />
      <Lattice morphState={morphState} />
    </Canvas>
  );
}
