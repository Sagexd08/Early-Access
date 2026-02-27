"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Text, Float, Environment, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

function Scene() {
  const sphereRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.2
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={sphereRef} position={[0, 0, -2]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial 
            color="#ffffff" 
            envMapIntensity={1} 
            clearcoat={1} 
            clearcoatRoughness={0.1} 
            metalness={0.8} 
            roughness={0.2}
            distort={0.4}
            speed={2}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 0, 1]}
          fontSize={0.8}
          color="#ffffff"
          font="/fonts/Inter-Bold.woff" // Fallback to default if not found
          anchorX="center"
          anchorY="middle"
          material-toneMapped={false}
        >
          LUMEO
        </Text>
      </Float>
    </>
  )
}

export function CanvasScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
