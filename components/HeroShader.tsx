"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────────
// Vertex shader: standard pass-through for a fullscreen quad.
// Just hands the UV coordinates to the fragment shader and
// projects the plane's corners to screen space.
// ─────────────────────────────────────────────────────────────
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ─────────────────────────────────────────────────────────────
// Fragment shader: an "aurora" flow field that leans toward the
// cursor, with a warm accent color and a light grain pass.
// ─────────────────────────────────────────────────────────────
const fragmentShader = `
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 vUv;

// Cheap pseudo-random noise, used only for the grain pass.
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  // Center the UVs around (0,0) and correct for aspect ratio,
  // so distances (like distance-to-mouse) aren't stretched on
  // wide screens.
  vec2 st = vUv - 0.5;
  st.x *= u_resolution.x / u_resolution.y;

  vec2 mouse = u_mouse - 0.5;
  mouse.x *= u_resolution.x / u_resolution.y;

  // How close this pixel is to the cursor. smoothstep gives a soft
  // falloff instead of a hard circle. This "pull" value nudges both
  // the flow field and the accent color toward the cursor.
  float distToMouse = length(st - mouse);
  float pull = smoothstep(0.6, 0.0, distToMouse) * 0.15;

  // Two layered sine waves, offset by time and the mouse pull,
  // create a slow drifting "aurora" flow field. Different
  // frequencies/speeds on x and y keep it from looking like a
  // simple repeating stripe.
  float flow = sin((st.x + pull) * 3.0 + u_time * 0.4)
             + sin((st.y - pull) * 4.0 - u_time * 0.3);
  flow *= 0.5;

  // Three-color palette: deep blue → teal by default, with a warm
  // "ember" accent that blooms near the cursor (matches the streak
  // orb's color from the 3D scene, for a consistent brand feel).
  vec3 colorA = vec3(0.10, 0.15, 0.35);
  vec3 colorB = vec3(0.20, 0.55, 0.65);
  vec3 colorC = vec3(0.85, 0.55, 0.25);

  vec3 color = mix(colorA, colorB, smoothstep(-0.5, 0.5, flow));
  color = mix(color, colorC, smoothstep(0.3, 0.9, pull * 4.0));

  // Vignette: darkens the edges/center slightly so the headline
  // text overlaid on top keeps enough contrast wherever it sits.
  float vignette = smoothstep(0.9, 0.2, length(st));
  color *= mix(0.6, 1.0, vignette);

  // Subtle film grain breaks up color banding and adds texture,
  // without being strong enough to hurt text readability.
  float grain = (random(vUv * u_resolution.xy + u_time) - 0.5) * 0.04;
  color += grain;

  gl_FragColor = vec4(color, 1.0);
}
`;

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();
  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      targetMouse.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
      );
    }
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((state) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.u_time.value = state.clock.elapsedTime;
    mat.uniforms.u_resolution.value.set(size.width, size.height);
    // Lerp toward the real cursor position for a gentle, non-jittery follow
    mat.uniforms.u_mouse.value.lerp(targetMouse.current, 0.08);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          u_time: { value: 0 },
          u_resolution: { value: new THREE.Vector2(1, 1) },
          u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        }}
      />
    </mesh>
  );
}

export default function HeroShader() {
  return (
    <Canvas dpr={[1, 1.5]} gl={{ antialias: true }} camera={{ position: [0, 0, 1] }}>
      <ShaderPlane />
    </Canvas>
  );
}