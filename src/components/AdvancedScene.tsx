import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Note: anime.js v4 has a different API - imports temporarily removed  
// import { animate } from 'animejs';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface AdvancedSceneProps {
  onPlanetFocus?: (planetName: string, description: string) => void;
}

const AdvancedScene: React.FC<AdvancedSceneProps> = ({ onPlanetFocus }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const planetsRef = useRef<any[]>([]);
  const sunRef = useRef<THREE.Mesh | null>(null);
  const starMeshRef = useRef<THREE.Points | null>(null);
  const asteroidsRef = useRef<THREE.InstancedMesh | null>(null);
  const targetRef = useRef(new THREE.Vector3());
  const mouseRef = useRef({ x: 0, y: 0 });
  const isFreeRoamRef = useRef(false);
  const activePlanetNameRef = useRef('');

  // Planet data
  const planetsData = useMemo(() => [
    { name: 'mercury', size: 1, distance: 20, speed: 0.004, color: 0x8c8c8c },
    { name: 'venus', size: 2, distance: 35, speed: 0.002, color: 0xffa500 },
    { name: 'earth', size: 2.2, distance: 55, speed: 0.001, color: 0x0077ff, hasMoon: true },
    { name: 'mars', size: 1.5, distance: 75, speed: 0.0008, color: 0xff4500 },
    { name: 'jupiter', size: 6, distance: 120, speed: 0.0004, color: 0xd2b48c },
    { name: 'saturn', size: 5, distance: 180, speed: 0.0002, color: 0xf0e68c, hasRings: true }
  ], []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });
    } catch (error) {
      console.error('WebGL not supported:', error);
      // Show WebGL fallback
      const fallback = document.getElementById('webgl-fallback');
      const root = document.getElementById('root');
      if (fallback && root) {
        fallback.style.display = 'flex';
        root.style.display = 'none';
      }
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Lighting
    const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
    pointLight.position.set(0, 0, 0); // Position at sun
    scene.add(pointLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Increase ambient light for better visibility
    scene.add(ambientLight);

    // Dynamic Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 20000;
    const posArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 4000;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMaterial = new THREE.PointsMaterial({ size: 0.75, color: 0xffffff });
    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);
    starMeshRef.current = starMesh;

    // Create Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(10, 64, 64),
      new THREE.MeshStandardMaterial({
        emissive: 0xffcc33,
        emissiveIntensity: 2
      })
    );
    sun.name = 'sun';
    scene.add(sun);
    sunRef.current = sun;

    // Create Planets
    const planets: any[] = [];
    planetsData.forEach(p => {
      const planet = new THREE.Mesh(
        new THREE.SphereGeometry(p.size, 32, 32),
        new THREE.MeshStandardMaterial({ color: p.color })
      );
      planet.name = p.name;
      
      const orbit = new THREE.Object3D();
      orbit.add(planet);
      planet.position.x = p.distance;

      if (p.hasRings) {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(p.size + 2, p.size + 5, 64),
          new THREE.MeshBasicMaterial({ 
            color: 0xaaaaaa, 
            side: THREE.DoubleSide, 
            transparent: true, 
            opacity: 0.6 
          })
        );
        ring.rotation.x = -Math.PI * 0.4;
        planet.add(ring);
      }

      if (p.hasMoon) {
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(p.size * 0.27, 32, 32),
          new THREE.MeshStandardMaterial({ color: 0xcccccc })
        );
        const moonOrbit = new THREE.Object3D();
        moonOrbit.add(moon);
        moon.position.x = p.size + 2;
        planet.add(moonOrbit);
        (planet as any).moonOrbit = moonOrbit;
      }

      scene.add(orbit);
      planets.push({ mesh: planet, orbit: orbit, speed: p.speed });

      // Orbit lines
      const orbitLine = new THREE.Mesh(
        new THREE.RingGeometry(p.distance - 0.1, p.distance + 0.1, 256),
        new THREE.MeshBasicMaterial({ 
          color: 0xffffff, 
          side: THREE.DoubleSide, 
          transparent: true, 
          opacity: 0.1 
        })
      );
      orbitLine.rotation.x = -Math.PI / 2;
      scene.add(orbitLine);
    });

    planetsRef.current = planets;

    // Asteroid Belt
    const asteroidCount = 1500;
    const asteroids = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(0.1, 0),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa }),
      asteroidCount
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < asteroidCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 90 + Math.random() * 15;
      dummy.position.set(
        Math.cos(angle) * radius, 
        (Math.random() - 0.5) * 2, 
        Math.sin(angle) * radius
      );
      dummy.rotation.set(Math.random(), Math.random(), Math.random());
      dummy.updateMatrix();
      asteroids.setMatrixAt(i, dummy.matrix);
    }
    scene.add(asteroids);
    asteroidsRef.current = asteroids;

    camera.position.set(0, 80, 250);
    camera.lookAt(scene.position);

    // Animation loop
    function animate() {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      // Animate planets
      planetsRef.current.forEach(p => {
        p.orbit.rotation.y += p.speed;
        p.mesh.rotation.y += 0.005;
        if (p.mesh.moonOrbit) p.mesh.moonOrbit.rotation.y += 0.01;
      });

      // Animate other objects
      if (sunRef.current) sunRef.current.rotation.y += 0.001;
      if (starMeshRef.current) starMeshRef.current.rotation.y += 0.0001;
      if (asteroidsRef.current) asteroidsRef.current.rotation.y += 0.0001;

      // Free roam update
      if (isFreeRoamRef.current) {
        freeRoamUpdate();
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    }

    function freeRoamUpdate() {
      if (!cameraRef.current) return;
      const target = targetRef.current;
      const mouse = mouseRef.current;
      
      cameraRef.current.position.x = target.x + Math.sin(mouse.x * Math.PI * 2) * 50;
      cameraRef.current.position.z = target.z + Math.cos(mouse.x * Math.PI * 2) * 50;
      cameraRef.current.position.y = target.y - mouse.y * 50;
      cameraRef.current.lookAt(target);
    }

    function focusOnPlanet(planetName: string, description: string) {
      if (!sceneRef.current || !cameraRef.current) return;
      
      const targetObject = sceneRef.current.getObjectByName(planetName);
      if (targetObject) {
        activePlanetNameRef.current = planetName.charAt(0).toUpperCase() + planetName.slice(1);
        targetObject.getWorldPosition(targetRef.current);
        const offset = planetName === 'sun' ? 50 : 
          (targetObject instanceof THREE.Mesh && targetObject.geometry instanceof THREE.SphereGeometry 
            ? targetObject.geometry.parameters.radius * 10 
            : 20);

        // Starfield pulse effect using GSAP as alternative
        if (starMeshRef.current) {
          // Using GSAP instead of anime.js for now
          gsap.to(starMeshRef.current.scale, {
            z: 150,
            duration: 0.5,
            ease: "power2.in",
            yoyo: true,
            repeat: 1
          });
        }

        // Camera movement
        gsap.to(cameraRef.current.position, {
          x: targetRef.current.x + offset,
          y: targetRef.current.y + (offset / 4),
          z: targetRef.current.z + offset,
          duration: 1.5,
          delay: 0.25,
          ease: "power3.inOut",
          onUpdate: () => cameraRef.current?.lookAt(targetRef.current)
        });

        // Notify parent component
        if (onPlanetFocus) {
          onPlanetFocus(activePlanetNameRef.current, description);
        }
      }
    }

    // Intro animation
    function runIntro() {
      const introTitle = document.querySelector('.intro-title');
      if (introTitle) {
        introTitle.innerHTML = introTitle.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");
      }

      const sections = document.querySelectorAll('.content-section');

      if (cameraRef.current) {
        gsap.timeline()
          .to(cameraRef.current.position, { 
            x: 0, y: 20, z: 100, 
            duration: 3, 
            ease: "power3.inOut", 
            onUpdate: () => cameraRef.current?.lookAt(sceneRef.current!.position) 
          })
          .to(".intro-title .letter", { 
            opacity: 1, 
            y: 0, 
            stagger: 0.07, 
            ease: "expo.out" 
          }, "-=2.5")
          .to(".intro-subtitle", { opacity: 1, duration: 1 }, "-=1.5")
          .to(sections[0], { opacity: 1, duration: 1 }, 0)
          .then(() => {
            focusOnPlanet('sun', 'The star at the center of our solar system.');
            for (let i = 1; i < sections.length; i++) {
              (sections[i] as HTMLElement).style.opacity = '1';
            }
          });
      }
    }

    // Setup scroll triggers
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          if (!isFreeRoamRef.current) {
            const planetName = (section as HTMLElement).dataset.planet;
            const description = (section as HTMLElement).dataset.description;
            if (planetName && description) {
              focusOnPlanet(planetName, description);
            }
          }
        },
        onEnterBack: () => {
          if (!isFreeRoamRef.current) {
            const planetName = (section as HTMLElement).dataset.planet;
            const description = (section as HTMLElement).dataset.description;
            if (planetName && description) {
              focusOnPlanet(planetName, description);
            }
          }
        }
      });
    });

    // Mouse movement for free roam
    const handleMouseMove = (event: MouseEvent) => {
      if (isFreeRoamRef.current) {
        mouseRef.current.x = (event.clientX / window.innerWidth) - 0.5;
        mouseRef.current.y = (event.clientY / window.innerHeight) - 0.5;
      }
    };

    // Window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Start animation and intro
    animate();
    setTimeout(runIntro, 500);

    // Expose methods for external control
    (window as any).toggleFreeRoam = () => {
      isFreeRoamRef.current = !isFreeRoamRef.current;
      document.body.classList.toggle('free-roam-active', isFreeRoamRef.current);
      ScrollTrigger.getAll().forEach(t => {
        if (isFreeRoamRef.current) {
          t.disable();
        } else {
          t.enable();
        }
      });
      document.body.style.overflow = isFreeRoamRef.current ? 'hidden' : 'auto';
      
      if (!isFreeRoamRef.current) {
        const section = sections[Math.round(window.scrollY / window.innerHeight)];
        if (section) {
          const planetName = (section as HTMLElement).dataset.planet;
          const description = (section as HTMLElement).dataset.description;
          if (planetName && description) {
            focusOnPlanet(planetName, description);
          }
        }
      } else {
        const currentPlanet = sceneRef.current?.getObjectByName(activePlanetNameRef.current.toLowerCase());
        if (currentPlanet) currentPlanet.getWorldPosition(targetRef.current);
      }
      
      return isFreeRoamRef.current;
    };

    (window as any).getCurrentPlanet = () => activePlanetNameRef.current;

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [planetsData, onPlanetFocus]);

  return (
    <canvas
      ref={canvasRef}
      id="solar-system-canvas"
      className="fixed top-0 left-0 w-full h-full -z-10 outline-none"
    />
  );
};

export default AdvancedScene;