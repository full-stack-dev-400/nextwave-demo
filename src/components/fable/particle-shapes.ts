const TAU = Math.PI * 2;

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

/* =========================================================
   01 — Directional particle field
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
      Math.pow(
        random(),
        0.72,
      ) *
        4.15;

    const twist =
      angle +
      radius * 0.24;

    const x =
      Math.cos(twist) *
      radius;

    const y =
      Math.sin(twist) *
        radius *
        0.58 +
      randomBetween(
        random,
        -0.28,
        0.28,
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

  const coreCount =
    Math.floor(count * 0.18);

  let index = 0;

  /* Bright central galaxy core */
  for (
    ;
    index < coreCount;
    index += 1
  ) {
    const theta =
      random() * TAU;

    const phi =
      Math.acos(
        2 * random() - 1,
      );

    const radius =
      0.08 +
      Math.pow(
        random(),
        2.1,
      ) *
        0.95;

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

  /* Two galaxy arms */
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
      Math.pow(
        progress,
        0.8,
      ) *
        4.25;

    const angle =
      progress *
        TAU *
        2.85 +
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
      Math.cos(angle) *
        radius +
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
   03 — Architecture energy core
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

  /* Dense bright centre */
  for (
    ;
    index < centreCount;
    index += 1
  ) {
    const theta =
      random() * TAU;

    const phi =
      Math.acos(
        2 * random() - 1,
      );

    const radius =
      0.16 +
      Math.pow(
        random(),
        1.6,
      ) *
        1.18;

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

  /* Rotating orbit */
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
      Math.cos(angle) *
      radius;

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

  /* Outer energy halo */
  for (
    ;
    index < count;
    index += 1
  ) {
    const theta =
      random() * TAU;

    const phi =
      Math.acos(
        2 * random() - 1,
      );

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
   04 — Engineering black hole
   ========================================================= */

export function createBlackHolePositions(
  count: number,
  seed = 404,
) {
  const random = createRandom(seed);

  const positions =
    new Float32Array(count * 3);

  const discCount =
    Math.floor(count * 0.84);

  let index = 0;

  /* Accretion disc */
  for (
    ;
    index < discCount;
    index += 1
  ) {
    const normalized =
      Math.pow(
        random(),
        2.15,
      );

    const radius =
      0.92 +
      normalized * 3;

    const angle =
      random() *
        TAU +
      radius * 0.5;

    const thickness =
      0.04 +
      radius * 0.034;

    const x =
      Math.cos(angle) *
      radius;

    const y =
      Math.sin(angle) *
        radius *
        0.5 +
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

  /* Surrounding particle halo */
  for (
    ;
    index < count;
    index += 1
  ) {
    const theta =
      random() * TAU;

    const phi =
      Math.acos(
        2 * random() - 1,
      );

    const radius =
      2.9 +
      random() * 1;

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
   05 — BEZTEQ symbol and wordmark
   ========================================================= */

export function createBezteqLogoPositions(
  count: number,
  seed = 505,
) {
  /*
   * ParticleScene is loaded with SSR disabled,
   * but this protects builds and tooling.
   */
  if (
    typeof document ===
    "undefined"
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
    document.createElement(
      "canvas",
    );

  canvas.width = 1800;
  canvas.height = 620;

  const context =
    canvas.getContext("2d");

  if (!context) {
    return createBlackHolePositions(
      count,
      seed,
    );
  }

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  context.fillStyle =
    "#ffffff";

  context.strokeStyle =
    "#ffffff";

  context.lineCap =
    "round";

  context.lineJoin =
    "round";

  /* BEZTEQ circular Q symbol */
  context.lineWidth = 42;

  context.beginPath();

  context.arc(
    255,
    canvas.height / 2,
    115,
    0,
    TAU,
  );

  context.stroke();

  /* Q tail */
  context.beginPath();

  context.moveTo(
    305,
    canvas.height / 2 + 55,
  );

  context.lineTo(
    410,
    canvas.height / 2 + 155,
  );

  context.stroke();

  /*
   * BEZTEQ word.
   * Arial Black provides a dependable,
   * thick particle silhouette.
   */
  context.textAlign =
    "center";

  context.textBaseline =
    "middle";

  context.font =
    '900 245px "Arial Black", Arial, sans-serif';

  context.fillText(
    "BEZTEQ",
    1110,
    canvas.height / 2,
  );

  const image =
    context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

  const sampledPoints:
    Array<
      readonly [
        number,
        number,
      ]
    > = [];

  /*
   * Read only non-transparent pixels.
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
        (
          y *
            canvas.width +
          x
        ) *
        4;

      const alpha =
        image.data[
          pixelIndex + 3
        ];

      if (alpha > 45) {
        sampledPoints.push([
          x,
          y,
        ]);
      }
    }
  }

  if (
    sampledPoints.length === 0
  ) {
    return createBlackHolePositions(
      count,
      seed,
    );
  }

  /*
   * Higher value creates a smaller logo.
   */
  const logoScale = 280;

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    const sampledPoint =
      sampledPoints[
        Math.floor(
          random() *
            sampledPoints.length,
        )
      ];

    const x =
      (
        sampledPoint[0] -
        canvas.width / 2
      ) /
      logoScale;

    const y =
      -(
        sampledPoint[1] -
        canvas.height / 2
      ) /
      logoScale;

    const z =
      randomBetween(
        random,
        -0.03,
        0.03,
      );

    writePosition(
      positions,
      index,

      x +
        randomBetween(
          random,
          -0.012,
          0.012,
        ),

      y +
        randomBetween(
          random,
          -0.012,
          0.012,
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
      createIntroPositions(
        count,
      ),

    spiral:
      createSpiralPositions(
        count,
      ),

    core:
      createCorePositions(
        count,
      ),

    blackHole:
      createBlackHolePositions(
        count,
      ),

    bezteq:
      createBezteqLogoPositions(
        count,
      ),
  };
}