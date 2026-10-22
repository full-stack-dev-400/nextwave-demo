const TAU = Math.PI * 2;

type VectorTuple = readonly [
  number,
  number,
  number,
];

const NETWORK_NODES: readonly VectorTuple[] = [
  [0, 2.5, 0],
  [-2.3, -1.55, 0],
  [2.3, -1.55, 0],
  [-1.2, 0.6, 0.08],
  [1.2, 0.6, -0.08],
  [0, -0.55, 0.12],
  [0, -2.25, 0],
];

const NETWORK_EDGES: readonly [
  number,
  number,
][] = [
  [0, 1], [0, 2], [1, 2],
  [0, 3], [0, 4],
  [1, 3], [2, 4],
  [3, 4], [3, 5], [4, 5],
  [0, 5], [1, 5], [2, 5],
  [1, 6], [2, 6], [5, 6],
];

export type ParticleTargets = {
  intro: Float32Array;
  spiral: Float32Array;
  core: Float32Array;
  blackHole: Float32Array;
  bezteq: Float32Array;
};

/* =========================================================
   Utilities
   ========================================================= */

function createRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;

    let result = value;

    result = Math.imul(
      result ^ (result >>> 15),
      result | 1,
    );

    result ^=
      result +
      Math.imul(
        result ^ (result >>> 7),
        result | 61,
      );

    return (
      ((result ^ (result >>> 14)) >>> 0) /
      4294967296
    );
  };
}

function randomBetween(
  random: () => number,
  minimum: number,
  maximum: number,
) {
  return (
    minimum +
    random() * (maximum - minimum)
  );
}

function writePosition(
  positions: Float32Array,
  index: number,
  x: number,
  y: number,
  z: number,
) {
  const offset = index * 3;

  positions[offset] = x;
  positions[offset + 1] = y;
  positions[offset + 2] = z;
}


export function createNetworkLinePositions() {
  const positions =
    new Float32Array(
      NETWORK_EDGES.length * 2 * 3,
    );

  let offset = 0;

  NETWORK_EDGES.forEach(
    ([startIndex, endIndex]) => {
      const start =
        NETWORK_NODES[startIndex];

      const end =
        NETWORK_NODES[endIndex];

      positions[offset] = start[0];
      positions[offset + 1] = start[1];
      positions[offset + 2] = start[2];

      positions[offset + 3] = end[0];
      positions[offset + 4] = end[1];
      positions[offset + 5] = end[2];

      offset += 6;
    },
  );

  return positions;
}

/* =========================================================
   01 — Visible input particle field
   ========================================================= */

export function createIntroPositions(
  count: number,
  seed = 101,
) {
  const random = createRandom(seed);
  const positions =
    new Float32Array(count * 3);

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const angle =
      random() * TAU;

    const radius =
      0.4 +
      Math.pow(random(), 0.72) * 4.15;

    const twist =
      angle + radius * 0.24;

    const x =
      Math.cos(twist) * radius;

    const y =
      Math.sin(twist) *
        radius *
        0.58 +
      randomBetween(
        random,
        -0.26,
        0.26,
      );

    const z =
      randomBetween(
        random,
        -1.1,
        1.1,
      );

    writePosition(
      positions,
      index,
      x,
      y,
      z,
    );
  }

  return positions;
}

/* =========================================================
   02 — Spiral galaxy
   ========================================================= */

export function createSpiralPositions(
  count: number,
  seed = 202,
) {
  const random = createRandom(seed);
  const positions =
    new Float32Array(count * 3);

  const centreCount =
    Math.floor(count * 0.18);

  let index = 0;

  /* Bright inner galaxy core */
  for (
    ;
    index < centreCount;
    index += 1
  ) {
    const theta =
      random() * TAU;

    const phi =
      Math.acos(2 * random() - 1);

    const radius =
      0.08 +
      Math.pow(random(), 2.1) * 0.95;

    const sinPhi =
      Math.sin(phi);

    writePosition(
      positions,
      index,

      radius *
        sinPhi *
        Math.cos(theta),

      radius *
        Math.cos(phi),

      radius *
        sinPhi *
        Math.sin(theta),
    );
  }

  /* Two visible spiral arms */
  for (
    ;
    index < count;
    index += 1
  ) {
    const progress =
      random();

    const arm =
      index % 2;

    const radius =
      0.42 +
      Math.pow(progress, 0.8) * 4.25;

    const angle =
      progress * TAU * 2.85 +
      arm * Math.PI +
      randomBetween(
        random,
        -0.12,
        0.12,
      );

    const spread =
      0.07 +
      radius * 0.055;

    const x =
      Math.cos(angle) * radius +
      randomBetween(
        random,
        -spread,
        spread,
      );

    const y =
      Math.sin(angle) *
        radius *
        0.62 +
      randomBetween(
        random,
        -spread,
        spread,
      );

    const z =
      randomBetween(
        random,
        -0.42,
        0.42,
      );

    writePosition(
      positions,
      index,
      x,
      y,
      z,
    );
  }

  return positions;
}

/* =========================================================
   03 — Concentrated system core
   ========================================================= */

export function createCorePositions(
  count: number,
  seed = 303,
) {
  const random = createRandom(seed);
  const positions =
    new Float32Array(count * 3);

  const centreCount =
    Math.floor(count * 0.48);

  const orbitCount =
    Math.floor(count * 0.36);

  let index = 0;

  /* Dense central energy */
  for (
    ;
    index < centreCount;
    index += 1
  ) {
    const theta =
      random() * TAU;

    const phi =
      Math.acos(2 * random() - 1);

    const radius =
      0.16 +
      Math.pow(random(), 1.6) * 1.18;

    const sinPhi =
      Math.sin(phi);

    writePosition(
      positions,
      index,

      radius *
        sinPhi *
        Math.cos(theta),

      radius *
        Math.cos(phi),

      radius *
        sinPhi *
        Math.sin(theta),
    );
  }

  /* Strong orbit around core */
  for (
    ;
    index <
    centreCount + orbitCount;
    index += 1
  ) {
    const angle =
      random() * TAU;

    const radius =
      1.5 +
      random() * 1.25;

    const x =
      Math.cos(angle) * radius;

    const y =
      Math.sin(angle) *
        radius *
        0.36 +
      randomBetween(
        random,
        -0.14,
        0.14,
      );

    const z =
      randomBetween(
        random,
        -0.34,
        0.34,
      );

    writePosition(
      positions,
      index,
      x,
      y,
      z,
    );
  }

  /* Outer system halo */
  for (
    ;
    index < count;
    index += 1
  ) {
    const theta =
      random() * TAU;

    const phi =
      Math.acos(2 * random() - 1);

    const radius =
      2.25 +
      random() * 0.95;

    const sinPhi =
      Math.sin(phi);

    writePosition(
      positions,
      index,

      radius *
        sinPhi *
        Math.cos(theta),

      radius *
        Math.cos(phi) *
        0.82,

      radius *
        sinPhi *
        Math.sin(theta),
    );
  }

  return positions;
}

/* =========================================================
   04 — Black-hole system ring
   ========================================================= */

export function createBlackHolePositions(
  count: number,
  seed = 404,
) {
  const random = createRandom(seed);
  const positions =
    new Float32Array(count * 3);

  const discCount =
    Math.floor(count * 0.82);

  let index = 0;

  /* Accretion disc */
  for (
    ;
    index < discCount;
    index += 1
  ) {
    const normalized =
      Math.pow(random(), 2.2);

    const radius =
      0.82 +
      normalized * 2.95;

    const angle =
      random() * TAU +
      radius * 0.48;

    const thickness =
      0.035 +
      radius * 0.032;

    const x =
      Math.cos(angle) * radius;

    const y =
      Math.sin(angle) *
        radius *
        0.48 +
      randomBetween(
        random,
        -thickness,
        thickness,
      );

    const z =
      randomBetween(
        random,
        -thickness * 2.4,
        thickness * 2.4,
      );

    writePosition(
      positions,
      index,
      x,
      y,
      z,
    );
  }

  /* Soft surrounding halo */
  for (
    ;
    index < count;
    index += 1
  ) {
    const theta =
      random() * TAU;

    const phi =
      Math.acos(2 * random() - 1);

    const radius =
      2.75 +
      random() * 1.0;

    const sinPhi =
      Math.sin(phi);

    writePosition(
      positions,
      index,

      radius *
        sinPhi *
        Math.cos(theta),

      radius *
        Math.cos(phi) *
        0.72,

      radius *
        sinPhi *
        Math.sin(theta),
    );
  }

  return positions;
}

/* =========================================================
   05 — BEZTEQ mark and wordmark
   ========================================================= */

export function createBezteqLogoPositions(
  count: number,
  seed = 505,
) {
  /*
   * ParticleScene is dynamically loaded with SSR disabled,
   * but this guard prevents errors during tooling or tests.
   */
  if (
    typeof document === "undefined"
  ) {
    return createBlackHolePositions(
      count,
      seed,
    );
  }

  const random =
    createRandom(seed);

  const positions =
    new Float32Array(count * 3);

  const canvas =
    document.createElement("canvas");

  canvas.width = 1600;
  canvas.height = 700;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return createBlackHolePositions(
      count,
      seed,
    );
  }

  /*
   * Keep the canvas transparent.
   * Do not draw a black background because
   * its alpha would be sampled as particles.
   */
  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  context.fillStyle = "#ffffff";
  context.strokeStyle = "#ffffff";
  context.lineCap = "round";
  context.lineJoin = "round";

  /* BEZTEQ Q-style inner mark */
  context.lineWidth = 38;

  context.beginPath();

  context.arc(
    canvas.width / 2,
    175,
    92,
    0,
    TAU,
  );

  context.stroke();

  context.beginPath();

  context.moveTo(
    canvas.width / 2 + 44,
    226,
  );

  context.lineTo(
    canvas.width / 2 + 142,
    322,
  );

  context.stroke();

  /* BEZTEQ wordmark */
  context.textAlign = "center";
  context.textBaseline = "middle";

  context.font =
    '900 230px "Arial Black", Arial, sans-serif';

  context.fillText(
    "BEZTEQ",
    canvas.width / 2,
    505,
  );

  const image =
    context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

  const availablePoints:
    Array<readonly [number, number]> = [];

  /*
   * Sample transparent canvas pixels.
   */
  for (
    let y = 0;
    y < canvas.height;
    y += 3
  ) {
    for (
      let x = 0;
      x < canvas.width;
      x += 3
    ) {
      const pixelIndex =
        (y * canvas.width + x) * 4;

      const alpha =
        image.data[pixelIndex + 3];

      if (alpha > 40) {
        availablePoints.push([
          x,
          y,
        ]);
      }
    }
  }

  if (
    availablePoints.length === 0
  ) {
    return createBlackHolePositions(
      count,
      seed,
    );
  }

  /*
   * Controls final logo size.
   * Lower value = larger logo.
   */
  const logoScale = 220;

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const sampledPoint =
      availablePoints[
        Math.floor(
          random() *
          availablePoints.length,
        )
      ];

    const x =
      (
        sampledPoint[0] -
        canvas.width / 2
      ) / logoScale;

    const y =
      -(
        sampledPoint[1] -
        canvas.height / 2
      ) / logoScale;

    const z =
      randomBetween(
        random,
        -0.035,
        0.035,
      );

    writePosition(
      positions,
      index,

      x +
        randomBetween(
          random,
          -0.018,
          0.018,
        ),

      y +
        randomBetween(
          random,
          -0.018,
          0.018,
        ),

      z,
    );
  }

  return positions;
}

/* =========================================================
   Complete sequence
   ========================================================= */

export function createParticleTargets(
  count: number,
): ParticleTargets {
  return {
    intro:
      createIntroPositions(count),

    spiral:
      createSpiralPositions(count),

    core:
      createCorePositions(count),

    blackHole:
      createBlackHolePositions(count),

    bezteq:
      createBezteqLogoPositions(count),
  };
}