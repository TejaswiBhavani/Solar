import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as AnimeJS from 'animejs'
const anime: any = (AnimeJS as any).default ?? (AnimeJS as any)
import { PlanetDef, PlanetInstance } from './types'
import { createOrbitRing, createPlanet, createStars, createSun } from './entities'

export type SceneHandles = {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  stars: THREE.Points
  sun: THREE.Mesh
  planets: PlanetInstance[]
  dispose: () => void
}

export function initScene(canvas: HTMLCanvasElement, planetsData: PlanetDef[], onClickPlanet: (p: PlanetInstance, def: PlanetDef) => void): SceneHandles {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000)
  camera.position.set(0, 30, 220)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  // limit pixel ratio to reduce GPU/CPU load (optimized for free plan)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.0))
  renderer.setSize(window.innerWidth, window.innerHeight)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.enablePan = true
  controls.minDistance = 40
  controls.maxDistance = 500

  const ambient = new THREE.AmbientLight(0xffffff, 0.35)
  scene.add(ambient)
  const point = new THREE.PointLight(0xffffff, 2, 2000)
  scene.add(point)

  // fewer stars = much lower CPU/GPU work (optimized for free plan hosting)
  const stars = createStars(800)
  scene.add(stars)

  const sun = createSun(Math.max(8, planetsData[0].size * 0.1))
  sun.name = planetsData[0].name
  scene.add(sun)

  const planets: PlanetInstance[] = []
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  planetsData.slice(1).forEach(def => {
    const p = createPlanet(def)
    scene.add(p.orbit)
    planets.push(p)
    scene.add(createOrbitRing(def.distance))
  })

  function onCanvasClick(e: MouseEvent) {
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const meshes = planets.map(p => p.mesh)
    const hits = raycaster.intersectObjects(meshes, false)
    if (hits.length > 0) {
      const mesh = hits[0].object as THREE.Mesh
      const idx = planets.findIndex(p => p.mesh === mesh)
      const def = planetsData[idx + 1]
      onClickPlanet(planets[idx], def)
      pulseStars()
    }
  }
  renderer.domElement.addEventListener('click', onCanvasClick)

  function pulseStars() {
    anime({ targets: stars.scale, x: [1, 1.1, 1], y: [1, 1.1, 1], z: [1, 1.1, 1], duration: 500, easing: 'easeInOutSine' })
  }

  function dispose() {
    renderer.domElement.removeEventListener('click', onCanvasClick)
    controls.dispose()
    renderer.dispose()
  }

  return { scene, camera, renderer, controls, stars, sun, planets, dispose }
}

export function animateLoop(handles: SceneHandles, planetsData: PlanetDef[]) {
  const { scene, camera, renderer, controls, sun, planets } = handles

  function tick() {
    planets.forEach((p, idx) => {
      const def = planetsData[idx + 1]
      p.orbit.rotation.y += def.speed
      p.mesh.rotation.y += 0.4 * (1/60)
      if (p.moonOrbit) p.moonOrbit.rotation.y += 0.8 * (1/60)
    })
    sun.rotation.y += 0.1 * (1/60)
    // gently rotate the starfield so it never looks completely static
    try {
      if ((handles.stars as any)?.rotation) handles.stars.rotation.y += 0.0001
    } catch (e) {
      // ignore
    }
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }
  tick()
}

export function focusCamera(handles: SceneHandles, target: THREE.Object3D) {
  const pos = new THREE.Vector3()
  target.getWorldPosition(pos)
  const radius = (target as any).geometry?.parameters?.radius ?? 5
  const offset = radius * 6
  const cam = handles.camera
  anime({ targets: cam.position, x: pos.x + offset, y: pos.y + offset/4, z: pos.z + offset, duration: 1200, delay: 100, easing: 'easeInOutCubic', update: () => cam.lookAt(pos) })
}

