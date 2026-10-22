/**
 * The Core's geometry (Motion Spec §3 / CLAUDE.md §5): 12 vertices, ~30 edges,
 * an icosahedron point cloud. Never subdivide past this — the cap is what
 * guarantees 60fps and the Lighthouse budget.
 */
export type MorphState =
  | "lattice"
  | "assembling"
  | "grid"
  | "surface"
  | "waveform";

export const MORPH_LABEL: Record<MorphState, string> = {
  lattice: "Web Development",
  assembling: "Custom Software",
  grid: "POS Software",
  surface: "UI/UX & Design",
  waveform: "Growth",
};

const PHI = (1 + Math.sqrt(5)) / 2;

function normalize([x, y, z]: [number, number, number]): [number, number, number] {
  const len = Math.hypot(x, y, z);
  return [x / len, y / len, z / len];
}

export const BASE_VERTICES: [number, number, number][] = (
  [
    [-1, PHI, 0],
    [1, PHI, 0],
    [-1, -PHI, 0],
    [1, -PHI, 0],
    [0, -1, PHI],
    [0, 1, PHI],
    [0, -1, -PHI],
    [0, 1, -PHI],
    [PHI, 0, -1],
    [PHI, 0, 1],
    [-PHI, 0, -1],
    [-PHI, 0, 1],
  ] as [number, number, number][]
).map(normalize);

export const EDGES: [number, number][] = (() => {
  const pairs: [number, number][] = [];
  for (let i = 0; i < BASE_VERTICES.length; i++) {
    for (let j = i + 1; j < BASE_VERTICES.length; j++) {
      const [ax, ay, az] = BASE_VERTICES[i];
      const [bx, by, bz] = BASE_VERTICES[j];
      const d = Math.hypot(ax - bx, ay - by, az - bz);
      if (d < 1.2) pairs.push([i, j]);
    }
  }
  return pairs;
})();

/**
 * Static per-state target positions. "surface" and "waveform" additionally
 * get a time-based ripple applied per-frame in CoreScene — these targets are
 * just their rest shape.
 */
export function getMorphTargets(): Record<MorphState, [number, number, number][]> {
  const lattice = BASE_VERTICES.map((v) => [...v] as [number, number, number]);

  // Modular blocks: verts pushed outward along their own normal — reads as
  // "assembled" structure rather than a smooth sphere.
  const assembling = BASE_VERTICES.map(
    (v) => v.map((c) => c * 1.18) as [number, number, number],
  );

  // Flatten into a regular 3x4 terminal/grid arrangement.
  const grid = BASE_VERTICES.map((_, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    return [(col - 1.5) * 0.62, (row - 1) * 0.62, 0] as [number, number, number];
  });

  const surface = BASE_VERTICES.map((v) => [...v] as [number, number, number]);
  const waveform = BASE_VERTICES.map((v) => [...v] as [number, number, number]);

  return { lattice, assembling, grid, surface, waveform };
}
