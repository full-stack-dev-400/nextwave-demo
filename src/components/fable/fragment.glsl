precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

varying float vRandom;
varying float vPulse;

void main() {
  vec2 centredUv =
    gl_PointCoord -
    0.5;

  float distanceFromCentre =
    length(
      centredUv
    );

  /*
   * Soft circular particle boundary.
   */
  float softEdge =
    1.0 -
    smoothstep(
      0.14,
      0.5,
      distanceFromCentre
    );

  /*
   * Small bright centre.
   */
  float brightCore =
    1.0 -
    smoothstep(
      0.0,
      0.16,
      distanceFromCentre
    );

  if (
    softEdge < 0.01
  ) {
    discard;
  }

  /*
   * Most particles stay cyan.
   * A small percentage become white.
   */
  float colourMix =
    smoothstep(
      0.8,
      0.98,
      vRandom
    );

  vec3 particleColour =
    mix(
      uColorA,
      uColorB,
      colourMix
    );

  particleColour +=
    brightCore *
    0.055;

  float alpha =
    softEdge *
    (
      0.2 +
      brightCore *
      0.44
    ) *
    (
      0.88 +
      vPulse *
      0.12
    ) *
    uOpacity;

  gl_FragColor =
    vec4(
      particleColour,
      alpha
    );
}