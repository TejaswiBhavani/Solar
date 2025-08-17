import * as THREE from 'three'

export type PlanetDef = {
  name: string
  size: number
  distance: number
  color: number
  speed: number
  hasRings?: boolean
  hasMoon?: boolean
  description: string
}

export const distanceScale = 30 // units per AU
export const earthRadiusUnits = 1.4 // scene units for Earth
export const baseAngularSpeed = 0.0012 // per frame

export type PlanetInstance = {
  mesh: THREE.Mesh
  orbit: THREE.Object3D
  moonOrbit?: THREE.Object3D
}

