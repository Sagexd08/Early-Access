"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uMouse;
  
  attribute vec3 targetPosition;
  attribute float randomOffset;
  attribute float size;
  
  varying vec3 vColor;
  varying float vProgress;
  
  // Simplex noise function for organic movement
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vProgress = uProgress;
    
    // 1. Legacy State (Fragmented, slow moving)
    vec3 noisePos = position + vec3(
      snoise(vec3(position.x, position.y, uTime * 0.1 + randomOffset)),
      snoise(vec3(position.y, position.z, uTime * 0.1 + randomOffset)),
      snoise(vec3(position.z, position.x, uTime * 0.1 + randomOffset))
    ) * 2.0;
    
    // 2. Core State (Unified sphere, fast orbiting)
    // Add rotation to the target sphere based on time
    float angle = uTime * 0.5 + randomOffset;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec3 rotatedTarget = targetPosition;
    rotatedTarget.xz *= rot;
    rotatedTarget.xy *= rot;
    
    // 3. Mouse Interaction (Solver routing)
    // Calculate distance from mouse to particle in screen space
    vec4 projectedPos = projectionMatrix * modelViewMatrix * vec4(rotatedTarget, 1.0);
    vec2 screenPos = projectedPos.xy / projectedPos.w;
    float distToMouse = distance(screenPos, uMouse);
    
    // Pull particles towards mouse when in Core state
    vec3 mousePull = vec3(uMouse.x * 5.0, uMouse.y * 5.0, 0.0);
    float pullStrength = smoothstep(1.5, 0.0, distToMouse) * uProgress * 0.5;
    rotatedTarget = mix(rotatedTarget, mousePull, pullStrength);

    // 4. Interpolate based on scroll progress
    // Use an exponential ease for a "snapping" effect at the end
    float easeProgress = pow(uProgress, 3.0); 
    vec3 finalPos = mix(noisePos, rotatedTarget, easeProgress);
    
    // 5. Colors
    vec3 legacyColor = vec3(0.8, 0.8, 0.9); // Brighter gray for visibility
    vec3 coreColor = vec3(0.0, 0.9, 1.0);    // Lumeo Cyan (#00E5FF)
    vec3 highlightColor = vec3(1.0, 1.0, 1.0); // Pure white
    
    // Mix colors based on progress and add some random highlights
    vec3 mixedColor = mix(legacyColor, coreColor, easeProgress);
    vColor = mix(mixedColor, highlightColor, step(0.9, fract(randomOffset * 10.0)) * easeProgress);

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    
    // Size attenuation based on depth and progress
    float finalSize = mix(size * 8.0, size * 4.0, easeProgress);
    gl_PointSize = finalSize * (50.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying float vProgress;
  
  void main() {
    // Create a soft circular particle
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if(ll > 0.5) discard;
    
    // Soft edge
    float alpha = smoothstep(0.5, 0.1, ll);
    
    // Boost brightness when fully formed
    vec3 finalColor = vColor * (1.0 + vProgress * 1.5);
    
    gl_FragColor = vec4(finalColor, alpha * (0.8 + vProgress * 0.2));
  }
`

// Ultrasonic Rings Shader
const ringVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const ringFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  
  void main() {
    // Center UVs
    vec2 uv = vUv - 0.5;
    float dist = length(uv);
    
    // Create expanding rings
    float rings = sin(dist * 50.0 - uTime * 10.0);
    
    // Fade out at edges and center
    float mask = smoothstep(0.5, 0.3, dist) * smoothstep(0.0, 0.1, dist);
    
    // Only show rings when core is formed (uProgress > 0.8)
    float visibility = smoothstep(0.8, 1.0, uProgress);
    
    // Sharp, high-frequency look
    float intensity = smoothstep(0.8, 1.0, rings) * mask * visibility;
    
    vec3 color = vec3(0.0, 0.9, 1.0); // Cyan
    
    gl_FragColor = vec4(color, intensity * 0.5);
  }
`

export function AtomicCore({ progressRef }: { progressRef: React.MutableRefObject<{ value: number }> }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const ringsMaterialRef = useRef<THREE.ShaderMaterial>(null)
  const mouse = useRef(new THREE.Vector2(0, 0))

  // Generate particle data
  const { positions, targetPositions, randomOffsets, sizes } = useMemo(() => {
    const count = 8000; // High enough for density, low enough for 60fps
    const positions = new Float32Array(count * 3)
    const targetPositions = new Float32Array(count * 3)
    const randomOffsets = new Float32Array(count)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // 1. Initial State: Wide, chaotic distribution (Legacy)
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40

      // 2. Target State: Dense Sphere (Atomic Core)
      // Fibonacci sphere distribution for even spacing
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
      
      // Add slight noise to the sphere surface so it's not perfectly smooth
      const radius = 2.5 + (Math.random() * 0.2)
      
      targetPositions[i * 3] = radius * Math.cos(theta) * Math.sin(phi)
      targetPositions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi)
      targetPositions[i * 3 + 2] = radius * Math.cos(phi)

      // Random attributes for shader variation
      randomOffsets[i] = Math.random() * Math.PI * 2
      sizes[i] = Math.random() * 0.5 + 0.5
    }

    return { positions, targetPositions, randomOffsets, sizes }
  }, [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    // Smooth mouse tracking
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, (state.pointer.x * state.viewport.width) / 2, 0.1)
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, (state.pointer.y * state.viewport.height) / 2, 0.1)

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
      materialRef.current.uniforms.uProgress.value = progressRef.current.value
      // Pass normalized mouse coordinates (-1 to 1)
      materialRef.current.uniforms.uMouse.value.set(state.pointer.x, state.pointer.y)
    }
    
    if (ringsMaterialRef.current) {
      ringsMaterialRef.current.uniforms.uTime.value = time
      ringsMaterialRef.current.uniforms.uProgress.value = progressRef.current.value
    }
  })

  return (
    <group>
      {/* The Particle System */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-targetPosition"
            count={targetPositions.length / 3}
            array={targetPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-randomOffset"
            count={randomOffsets.length}
            array={randomOffsets}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sizes.length}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          uniforms={{
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) }
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* The Ultrasonic Rings (Plane behind the sphere) */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[15, 15]} />
        <shaderMaterial
          ref={ringsMaterialRef}
          uniforms={{
            uTime: { value: 0 },
            uProgress: { value: 0 }
          }}
          vertexShader={ringVertexShader}
          fragmentShader={ringFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Debug Box to ensure Canvas is rendering */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh>
    </group>
  )
}
