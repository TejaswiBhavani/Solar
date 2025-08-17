import { useEffect, useRef } from 'react'
import { planetsData } from '../solar/data'
import { initScene, animateLoop, focusCamera } from '../solar/scene'
import { showLabel } from '../solar/uiOverlay'

export interface SolarSceneProps {
  isFreeRoam: boolean
  onPlanetFocus?: (planetName: string, description: string) => void
}

export default function SolarScene({ isFreeRoam, onPlanetFocus }: SolarSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const handlesRef = useRef<ReturnType<typeof initScene> | null>(null)

  // Init / dispose
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handles = initScene(canvas, planetsData, (p, def) => {
      onPlanetFocus?.(def.name, def.description)
      focusCamera(handles, p.mesh)
      if (svgRef.current) showLabel(svgRef.current, def.name)
    })
    handlesRef.current = handles

    animateLoop(handles, planetsData)

    const onResize = () => {
      const h = handlesRef.current
      if (!h) return
      h.camera.aspect = window.innerWidth / window.innerHeight
      h.camera.updateProjectionMatrix()
      h.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      handles.dispose()
    }
  }, [onPlanetFocus])

  // Free-roam toggle
  useEffect(() => {
    const h = handlesRef.current
    if (!h) return
    h.controls.autoRotate = isFreeRoam
    document.body.classList.toggle('free-roam-active', isFreeRoam)
  }, [isFreeRoam])

  return (
    <>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 outline-none" />
      <svg ref={svgRef} className="pointer-events-none fixed top-0 left-0 w-full h-full z-[5]" />
    </>
  )
}

