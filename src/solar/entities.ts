import * as THREE from 'three'
import { PlanetDef, PlanetInstance } from './types'

export function createSun(size: number): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(size, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0xffcc33, emissive: 0xffcc33, emissiveIntensity: 2 })
  )
}

export function createPlanet(def: PlanetDef): PlanetInstance {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(def.size, Math.min(48, Math.max(16, Math.floor(def.size * 8))), 32),
    new THREE.MeshStandardMaterial({ color: def.color })
  )
  mesh.name = def.name

  const orbit = new THREE.Object3D()
  orbit.add(mesh)
  mesh.position.x = def.distance

  if (def.hasRings) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(def.size * 1.2, def.size * 2.2, 96),
      new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
    )
    ring.rotation.x = -Math.PI * 0.4
    mesh.add(ring)
  }

  let moonOrbit: THREE.Object3D | undefined
  if (def.hasMoon) {
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(def.size * 0.27, 0.3), 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xcccccc })
    )
    moonOrbit = new THREE.Object3D()
    moonOrbit.add(moon)
    moon.position.x = Math.max(def.size * 3, 2)
    mesh.add(moonOrbit)
  }

  return { mesh, orbit, moonOrbit }
}

export function createOrbitRing(distance: number): THREE.Mesh {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(distance - 0.15, distance + 0.15, 256),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.08 })
  )
  ring.rotation.x = -Math.PI / 2
  return ring
}

export function createStars(count = 6000): THREE.Points {
  const starGeometry = new THREE.BufferGeometry()
  const starPositions = new Float32Array(count * 3)
  for (let i = 0; i < starPositions.length; i++) starPositions[i] = (Math.random() - 0.5) * 2000
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMaterial = new THREE.PointsMaterial({ size: 0.6, color: 0xffffff })
  return new THREE.Points(starGeometry, starMaterial)
}

