import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Icosahedron, Torus, Box, Octahedron } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '@/hooks/useTheme'

// Floating geometric shapes for Services section
function FloatingShapes({ color, secondaryColor }: { color: string; secondaryColor: string }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <Icosahedron args={[1, 0]} position={[-4, 2, -5]} scale={0.8}>
          <meshStandardMaterial
            color={color}
            wireframe
            transparent
            opacity={0.4}
            metalness={0.8}
            roughness={0.2}
          />
        </Icosahedron>
      </Float>
      
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Octahedron args={[1, 0]} position={[4, -1, -4]} scale={0.6}>
          <meshStandardMaterial
            color={secondaryColor}
            wireframe
            transparent
            opacity={0.5}
            metalness={0.9}
            roughness={0.1}
          />
        </Octahedron>
      </Float>
      
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <Box args={[1, 1, 1]} position={[3, 3, -6]} scale={0.5} rotation={[0.5, 0.5, 0]}>
          <meshStandardMaterial
            color={color}
            wireframe
            transparent
            opacity={0.35}
          />
        </Box>
      </Float>

      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.7}>
        <Torus args={[0.8, 0.3, 16, 32]} position={[-3, -2, -4]} scale={0.7}>
          <meshStandardMaterial
            color={secondaryColor}
            wireframe
            transparent
            opacity={0.4}
            metalness={0.8}
          />
        </Torus>
      </Float>
    </group>
  )
}

// Animated particles for About section
function AboutParticles({ count = 300, color }: { count?: number; color: string }) {
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5
      speeds[i] = Math.random() * 0.5 + 0.2
    }
    return { positions, speeds }
  }, [count])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Glowing orbs for Footer
function GlowingOrbs({ color, secondaryColor }: { color: string; secondaryColor: string }) {
  const orb1Ref = useRef<THREE.Mesh>(null)
  const orb2Ref = useRef<THREE.Mesh>(null)
  const orb3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (orb1Ref.current) {
      orb1Ref.current.position.y = Math.sin(t * 0.5) * 0.5
      orb1Ref.current.position.x = Math.cos(t * 0.3) * 0.3
    }
    if (orb2Ref.current) {
      orb2Ref.current.position.y = Math.sin(t * 0.7 + 2) * 0.4
      orb2Ref.current.position.x = Math.cos(t * 0.4 + 1) * 0.4
    }
    if (orb3Ref.current) {
      orb3Ref.current.position.y = Math.sin(t * 0.6 + 4) * 0.3
      orb3Ref.current.position.x = Math.cos(t * 0.5 + 2) * 0.5
    }
  })

  return (
    <group>
      <Sphere ref={orb1Ref} args={[0.5, 32, 32]} position={[-3, 0, -3]}>
        <MeshDistortMaterial
          color={color}
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.6}
        />
      </Sphere>
      <Sphere ref={orb2Ref} args={[0.3, 32, 32]} position={[3, 1, -4]}>
        <MeshDistortMaterial
          color={secondaryColor}
          distort={0.3}
          speed={1.5}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.5}
        />
      </Sphere>
      <Sphere ref={orb3Ref} args={[0.4, 32, 32]} position={[0, -1, -2]}>
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={2.5}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.4}
        />
      </Sphere>
    </group>
  )
}

// Rotating rings for Process section
function RotatingRings({ color, secondaryColor }: { color: string; secondaryColor: string }) {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.2
      ring1Ref.current.rotation.y = t * 0.1
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.15
      ring2Ref.current.rotation.z = t * 0.2
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.25
      ring3Ref.current.rotation.z = -t * 0.1
    }
  })

  return (
    <group position={[0, 0, -8]}>
      <Torus ref={ring1Ref} args={[3, 0.05, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </Torus>
      <Torus ref={ring2Ref} args={[2.5, 0.04, 16, 100]} position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <meshStandardMaterial color={secondaryColor} transparent opacity={0.25} metalness={0.9} roughness={0.1} />
      </Torus>
      <Torus ref={ring3Ref} args={[2, 0.03, 16, 100]} position={[0, 0, 0]} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <meshStandardMaterial color={color} transparent opacity={0.2} metalness={0.9} roughness={0.1} />
      </Torus>
    </group>
  )
}

// Tech grid for Technologies section
function TechGrid({ color }: { color: string }) {
  const gridRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1 + 0.3
      gridRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const gridSize = 6
  const spacing = 1.5
  const boxes = useMemo(() => {
    const items = []
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i - gridSize / 2) * spacing
        const z = (j - gridSize / 2) * spacing
        const height = Math.random() * 0.5 + 0.1
        items.push({ x, z, height, delay: (i + j) * 0.1 })
      }
    }
    return items
  }, [])

  return (
    <group ref={gridRef} position={[0, -3, -10]}>
      {boxes.map((box, index) => (
        <Float key={index} speed={1 + box.delay} floatIntensity={0.3}>
          <Box args={[0.8, box.height, 0.8]} position={[box.x, box.height / 2, box.z]}>
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.15 + box.height * 0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </Box>
        </Float>
      ))}
    </group>
  )
}

// Scene content wrapper with theme support
function SceneContent({ variant }: { variant: 'services' | 'about' | 'process' | 'technologies' | 'footer' }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const primaryColor = isDark ? '#8b5cf6' : '#7c3aed'
  const accentColor = isDark ? '#a855f7' : '#9333ea'
  const particleColor = isDark ? '#a78bfa' : '#8b5cf6'

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 5]} intensity={0.5} color={primaryColor} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color={accentColor} />

      {variant === 'services' && <FloatingShapes color={primaryColor} secondaryColor={accentColor} />}
      {variant === 'about' && <AboutParticles count={400} color={particleColor} />}
      {variant === 'process' && <RotatingRings color={primaryColor} secondaryColor={accentColor} />}
      {variant === 'technologies' && <TechGrid color={primaryColor} />}
      {variant === 'footer' && <GlowingOrbs color={primaryColor} secondaryColor={accentColor} />}
    </>
  )
}

interface Section3DProps {
  variant: 'services' | 'about' | 'process' | 'technologies' | 'footer'
  className?: string
}

export function Section3D({ variant, className }: Section3DProps) {
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent variant={variant} />
        </Suspense>
      </Canvas>
    </div>
  )
}
