import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Preload, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'

export interface R3FSceneProps {
  onPlanetFocus?: (name: string, description: string) => void
  isFreeRoam?: boolean
}

type RawPlanet = {
  name: string
  radiusEarth: number
  distanceAU: number
  periodYears: number
  color: string
  description: string
  hasRings?: boolean
  hasMoon?: boolean
}

type PlanetDef = RawPlanet & {
  size: number
  distance: number
  speed: number
}

const distanceScale = 30 // units per AU
const earthRadiusUnits = 1.4 // scene units for Earth
const baseAngularSpeed = 0.001 // per frame

const rawPlanets: RawPlanet[] = [
  { name: 'Sun', radiusEarth: 109, distanceAU: 0, periodYears: 0, color: '#ffcc33', description: 'The star at the center of our solar system.' },
  { name: 'Mercury', radiusEarth: 0.383, distanceAU: 0.39, periodYears: 0.241, color: '#8c8c8c', description: 'The smallest and innermost planet.' },
  { name: 'Venus', radiusEarth: 0.949, distanceAU: 0.72, periodYears: 0.615, color: '#ffa500', description: "Earth’s sister planet with a thick atmosphere." },
  { name: 'Earth', radiusEarth: 1.0, distanceAU: 1.00, periodYears: 1.000, color: '#4f94cd', description: 'Our home, the only known planet with life.', hasMoon: true },
  { name: 'Mars', radiusEarth: 0.532, distanceAU: 1.52, periodYears: 1.881, color: '#cd5c5c', description: 'The red planet with iron oxide rich soil.' },
  { name: 'Jupiter', radiusEarth: 11.21, distanceAU: 5.20, periodYears: 11.86, color: '#daa520', description: 'The largest planet, a gas giant.' },
  { name: 'Saturn', radiusEarth: 9.45, distanceAU: 9.58, periodYears: 29.46, color: '#fad5a5', description: 'Famous for its spectacular rings.', hasRings: true },
]

function usePlanets(): PlanetDef[] {
  return useMemo(() => rawPlanets.map(p => ({
    ...p,
    size: Math.max(0.6, earthRadiusUnits * p.radiusEarth),
    distance: p.distanceAU * distanceScale,
    speed: p.periodYears > 0 ? baseAngularSpeed / p.periodYears : 0,
  })), [])
}

function Planet({ def, onClick }: { def: PlanetDef; onClick?: (name: string, description: string) => void }) {
  const orbitRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const moonOrbitRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += def.speed
    if (planetRef.current) planetRef.current.rotation.y += 0.4 * delta
    if (moonOrbitRef.current) moonOrbitRef.current.rotation.y += 0.8 * delta
  })

  // Shared materials/geometries (memoized by props)
  const planetMat = useMemo(() => new THREE.MeshStandardMaterial({ color: def.color }), [def.color])
  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#bbbbbb', transparent: true, opacity: 0.6, side: THREE.DoubleSide }), [])

  return (
    <group ref={orbitRef}>
      {/* Planet */}
      <mesh
        ref={planetRef}
        position={[def.distance || 0, 0, 0]}
        onPointerDown={(e) => {
          e.stopPropagation()
          onClick?.(def.name, def.description)
        }}
        frustumCulled
      >
        <sphereGeometry args={[def.size, Math.min(48, Math.max(16, Math.floor(def.size * 8))), 32]} />
        <primitive object={planetMat} attach="material" />
      </mesh>

      {/* Saturn rings */}
      {def.hasRings && def.distance > 0 && (
        <mesh position={[def.distance, 0, 0]} rotation={[-Math.PI * 0.4, 0, 0]} frustumCulled>
          <ringGeometry args={[def.size * 1.2, def.size * 2.2, 96]} />
          <primitive object={ringMat} attach="material" />
        </mesh>
      )}

      {/* Earth moon (simple) */}
      {def.hasMoon && (
        <group ref={moonOrbitRef} position={[def.distance, 0, 0]}>
          <mesh position={[Math.max(def.size * 3, 2), 0, 0]} frustumCulled>
            <sphereGeometry args={[Math.max(def.size * 0.27, 0.3), 16, 16]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
        </group>
      )}
    </group>
  )
}

function Sun({ size }: { size: number }) {
  const sunRef = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (sunRef.current) sunRef.current.rotation.y += 0.1 * delta
  })
  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial emissive="#ffcc33" emissiveIntensity={2} color="#ffcc33" />
    </mesh>
  )
}

function AsteroidBelt() {
  const count = 600
  const inner = distanceScale * 2.2
  const outer = distanceScale * 3.2

  const { positions, rotations } = useMemo(() => {
    const pos: number[] = []
    const rot: number[] = []
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = inner + Math.random() * (outer - inner)
      pos.push(Math.cos(a) * r, (Math.random() - 0.5) * 2, Math.sin(a) * r)
      rot.push(Math.random(), Math.random(), Math.random())
    }
    return { positions: pos, rotations: rot }
  }, [])

  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Initialize instance matrices once
  useFrame(() => {
    if (!meshRef.current) return
    if ((meshRef.current as any)._initialized) {
      meshRef.current.rotation.y += 0.0005
      return
    }
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      dummy.position.set(positions[ix], positions[ix + 1], positions[ix + 2])
      dummy.rotation.set(rotations[ix], rotations[ix + 1], rotations[ix + 2])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    ;(meshRef.current as any)._initialized = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined as any, undefined as any, count]} frustumCulled>
      <dodecahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial color="#aaaaaa" />
    </instancedMesh>
  )
}

export default function R3FScene({ onPlanetFocus, isFreeRoam = false }: R3FSceneProps) {
  const defs = usePlanets()
  const sun = defs[0]

  return (
    <Canvas
      camera={{ position: [0, 60, 220], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      className="fixed top-0 left-0 w-full h-full -z-10"
    >
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 0]} intensity={2} distance={2000} />

  {/* Background stars (reduced for lower-end machines) */}
  <Stars radius={2000} depth={50} count={2000} factor={4} saturation={0} fade speed={0} />

      {/* Bodies */}
      <Sun size={Math.max(8, sun.size * 0.1)} />
      {defs.slice(1).map((p) => (
        <Planet key={p.name} def={p} onClick={onPlanetFocus} />
      ))}
      <AsteroidBelt />

      {/* Controls */}
      <OrbitControls enableDamping dampingFactor={0.08} enablePan={true} minDistance={40} maxDistance={500} autoRotate={isFreeRoam} autoRotateSpeed={0.6} />

      {/* Performance helpers */}
      <AdaptiveDpr pixelated />
      <Preload all />
    </Canvas>
  )
}

