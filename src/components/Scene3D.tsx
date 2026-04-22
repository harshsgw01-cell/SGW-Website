import { useRef, useMemo, Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Stars, Trail } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '@/hooks/useTheme'

// ─────────────────────────────────────────────
// SHARED GEOMETRIES — created once
// ─────────────────────────────────────────────
const sphereGeo64 = new THREE.SphereGeometry(1, 64, 64)
const sphereGeo32 = new THREE.SphereGeometry(1, 32, 32)
const sphereGeo16 = new THREE.SphereGeometry(0.15, 16, 16)
const torusGeo = new THREE.TorusGeometry(1, 0.25, 16, 100)

// ─────────────────────────────────────────────
// ScenePauser – pause rAF when hero off-screen
// ─────────────────────────────────────────────
function ScenePauser({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const { gl, scene, camera } = useThree()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gl.setAnimationLoop(() => {
            gl.render(scene, camera)
          })
        } else {
          gl.setAnimationLoop(null)
        }
      },
      { threshold: 0.05 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [gl, scene, camera, containerRef])

  return null
}

// ─────────────────────────────────────────────
// FloatingSphere
// ─────────────────────────────────────────────
function FloatingSphere({
  position,
  scale,
  speed = 1,
  distort = 0.3,
  color,
}: {
  position: [number, number, number]
  scale: number
  speed?: number
  distort?: number
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 * speed
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed
  })

  return (
    <Float speed={speed * 1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} geometry={sphereGeo64} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={2}
          roughness={0.3}
          metalness={0.9}
          envMapIntensity={0.5}
        />
      </mesh>
    </Float>
  )
}

// ─────────────────────────────────────────────
// ParticleField
// ─────────────────────────────────────────────
function ParticleField({
  count = 800,
  color,
  opacity = 0.7,
}: {
  count?: number
  color: string
    opacity?: number
}) {
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40
      sizes[i] = Math.random() * 0.5 + 0.1
    }
    return { positions, sizes }
  }, [count])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.015
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─────────────────────────────────────────────
// RotatingTorus
// ─────────────────────────────────────────────
function RotatingTorus({
  position,
  scale = 1,
  color,
}: {
  position: [number, number, number]
  scale?: number
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.25
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.1
  })

  return (
    <mesh ref={meshRef} geometry={torusGeo} position={position} scale={scale}>
      <meshStandardMaterial
        color={color}
        metalness={0.95}
        roughness={0.05}
        wireframe
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─────────────────────────────────────────────
// GlowingOrb
// ─────────────────────────────────────────────
function GlowingOrb({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.5
  })

  return (
    <Trail width={2} length={8} color={color} attenuation={(t) => t * t}>
      <mesh ref={meshRef} geometry={sphereGeo16} position={position}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </mesh>
    </Trail>
  )
}

// ─────────────────────────────────────────────
// MouseFollower
// ─────────────────────────────────────────────
function MouseFollower() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport, mouse } = useThree()

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      (mouse.x * viewport.width) / 2,
      0.05,
    )
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      (mouse.y * viewport.height) / 2,
      0.05,
    )
  })

  return (
    <mesh ref={meshRef} geometry={sphereGeo32} scale={0.5} position={[0, 0, 2]}>
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.5}
        transparent
        opacity={0.3}
        roughness={0.1}
        metalness={0.8}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─────────────────────────────────────────────
// SceneContent – theme-aware colors & lights
// ─────────────────────────────────────────────
function SceneContent({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Theme-aware palette
  const primaryColor = isDark ? '#8b5cf6' : '#7c3aed'
  const accentColor = isDark ? '#22d3ee' : '#0ea5e9'
  const particleColor = isDark ? '#a5b4fc' : '#8b5cf6'

  const ambientIntensity = isDark ? 0.25 : 0.45
  const dirLightIntensity = isDark ? 0.9 : 0.75
  const pointLightIntensity = isDark ? 0.5 : 0.35
  const particleOpacity = isDark ? 0.9 : 0.7

  return (
    <>
      <ScenePauser containerRef={containerRef} />

      {/* Lighting tuned per mode */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[10, 10, 5]} intensity={dirLightIntensity} />
      <pointLight
        position={[-10, -10, -5]}
        intensity={pointLightIntensity}
        color={accentColor}
      />
      <pointLight
        position={[5, 5, 5]}
        intensity={pointLightIntensity * 0.8}
        color={primaryColor}
      />

      {/* Floating spheres */}
      <FloatingSphere
        position={[-5, 2, -6]}
        scale={2}
        speed={0.4}
        distort={0.5}
        color={primaryColor}
      />
      <FloatingSphere
        position={[5, -1, -4]}
        scale={1}
        speed={0.6}
        distort={0.3}
        color={accentColor}
      />
      <FloatingSphere
        position={[2, 4, -8]}
        scale={0.6}
        speed={0.8}
        distort={0.4}
        color={primaryColor}
      />
      <FloatingSphere
        position={[-3, -3, -5]}
        scale={0.8}
        speed={0.7}
        distort={0.35}
        color={accentColor}
      />

      {/* Torus frames */}
      <RotatingTorus position={[6, 2, -5]} scale={1.2} color={primaryColor} />
      <RotatingTorus position={[-6, -2, -4]} scale={0.8} color={accentColor} />

      {/* Glowing orbs */}
      <GlowingOrb position={[3, 1, -3]} color={primaryColor} />
      <GlowingOrb position={[-4, -1, -4]} color={accentColor} />
      <GlowingOrb position={[0, 3, -5]} color={primaryColor} />

      {/* Particles - reduced count for performance */}
      <ParticleField count={600} color={particleColor} opacity={particleOpacity} />

      {/* Mouse follower */}
      <MouseFollower />

      {/* Stars only in dark mode */}
      {isDark && (
        <Stars
          radius={120}
          depth={60}
          count={3000}
          factor={5}
          saturation={0}
          fade
          speed={0.5}
        />
      )}
    </>
  )
}

// ─────────────────────────────────────────────
// Scene3D — public export
// ─────────────────────────────────────────────
export function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5])

  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      setDpr([1, 1])
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        dpr={dpr}
        frameloop="always"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
        }}
        style={{ background: 'transparent' }}
        resize={{ scroll: false, debounce: { scroll: 50, resize: 200 } }}
      >
        <Suspense fallback={null}>
          <SceneContent containerRef={containerRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
