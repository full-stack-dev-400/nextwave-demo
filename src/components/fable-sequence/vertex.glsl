precision highp float;

uniform float uTime;
uniform float uMorph;
uniform float uNoiseStrength;
uniform float uPointSize;
uniform float uPixelRatio;

attribute vec3 aPositionB;
attribute float aRandom;

varying float vRandom;
varying float vPulse;

void main() {
  float easedMorph =
    uMorph *
    uMorph *
    (3.0 - 2.0 * uMorph);

  vec3 transformed =
    mix(
      position,
      aPositionB,
      easedMorph
    );

  /*
   * Distortion becomes strongest during
   * the middle of each morph.
   */
  float transitionStrength =
    sin(
      uMorph *
      3.14159265359
    );

  vec3 wave =
    vec3(
      sin(
        transformed.y * 1.7 +
        uTime * 0.45 +
        aRandom * 6.283185
      ),

      cos(
        transformed.z * 1.55 +
        uTime * 0.35 +
        aRandom * 4.73
      ),

      sin(
        transformed.x * 1.8 -
        uTime * 0.3 +
        aRandom * 5.31
      )
    );

  transformed +=
    wave *
    (
      0.009 +
      transitionStrength *
      uNoiseStrength
    ) *
    (
      0.4 +
      aRandom * 0.7
    );

  vec4 modelPosition =
    modelMatrix *
    vec4(
      transformed,
      1.0
    );

  vec4 viewPosition =
    viewMatrix *
    modelPosition;

  gl_Position =
    projectionMatrix *
    viewPosition;

  float perspective =
    clamp(
      7.4 /
      max(
        1.0,
        -viewPosition.z
      ),
      0.62,
      1.35
    );

  gl_PointSize =
    uPointSize *
    uPixelRatio *
    (
      0.72 +
      aRandom * 0.66
    ) *
    perspective;

  vRandom = aRandom;

  vPulse =
    0.5 +
    0.5 *
    sin(
      uTime * 1.15 +
      aRandom * 6.283185
    );
}