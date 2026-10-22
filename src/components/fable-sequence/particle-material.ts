import * as THREE from "three";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

export type ParticleShaderMaterial =
  THREE.ShaderMaterial & {
    uniforms: {
      uTime: {
        value: number;
      };

      uMorph: {
        value: number;
      };

      uNoiseStrength: {
        value: number;
      };

      uPointSize: {
        value: number;
      };

      uPixelRatio: {
        value: number;
      };

      uColorA: {
        value: THREE.Color;
      };

      uColorB: {
        value: THREE.Color;
      };

      uOpacity: {
        value: number;
      };
    };
  };

export function createParticleMaterial():
  ParticleShaderMaterial {
  const material =
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },

        uMorph: {
          value: 0,
        },

        uNoiseStrength: {
          value: 0.08,
        },

        uPointSize: {
          value: 6.5,
        },

        uPixelRatio: {
          value: 1,
        },

        uColorA: {
          value:
            new THREE.Color(
              "#00cae0",
            ),
        },

        uColorB: {
          value:
            new THREE.Color(
              "#e8fdff",
            ),
        },

        uOpacity: {
          value: 0.72,
        },
      },

      vertexShader,
      fragmentShader,

      transparent: true,
      depthWrite: false,
      depthTest: false,

      blending:
        THREE.AdditiveBlending,
    });

  material.toneMapped = false;

  return material as
    ParticleShaderMaterial;
}