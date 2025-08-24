import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Sun component
const Sun = () => {
  const sunRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[10, 32, 32]} />
      <meshStandardMaterial
        emissive="#ffcc33"
        emissiveIntensity={2}
        color="#ffcc33"
      />
    </mesh>
  );
};

// Planet component
interface PlanetProps {
  name: string;
  size: number;
  distance: number;
  speed: number;
  color: string;
  tilt?: number;
}

const Planet: React.FC<PlanetProps> = ({ name, size, distance, speed, color, tilt = 0 }) => {
  const orbitRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += speed;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh
        ref={planetRef}
        position={[distance, 0, 0]}
        rotation={[tilt, 0, 0]}
        name={name}
      >
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

// Ring component for Saturn
const Ring: React.FC<{ innerRadius: number; outerRadius: number; distance: number; speed: number }> = ({
  innerRadius,
  outerRadius,
  distance,
  speed,
}) => {
  const ringRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.y += speed;
    }
  });

  const ringGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);
    return geometry;
  }, [innerRadius, outerRadius]);

  return (
    <group ref={ringRef}>
      <mesh position={[distance, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={ringGeometry} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Starfield component
const Starfield = () => {
  const starCount = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 2000;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="#ffffff" />
    </points>
  );
};

// Main Scene component
const Scene: React.FC = () => {
  const planetsData = [
    { name: 'mercury', size: 1, distance: 20, speed: 0.004, color: '#8c8c8c' },
    { name: 'venus', size: 2, distance: 35, speed: 0.002, color: '#ffa500' },
    { name: 'earth', size: 2.5, distance: 50, speed: 0.001, color: '#4f94cd', tilt: 0.4 },
    { name: 'mars', size: 1.8, distance: 70, speed: 0.0008, color: '#cd5c5c' },
    { name: 'jupiter', size: 8, distance: 120, speed: 0.0003, color: '#daa520' },
    { name: 'saturn', size: 6, distance: 180, speed: 0.0002, color: '#fad5a5' },
  ];

  return (
    <Canvas
      camera={{ position: [0, 80, 250], fov: 75 }}
      gl={{ alpha: true, antialias: false }}
      dpr={[1, 1]}
      className="fixed top-0 left-0 w-full h-full -z-10"
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} distance={1000} />

      {/* 3D Objects */}
      <Sun />
      {planetsData.map((planet) => (
        <Planet key={planet.name} {...planet} />
      ))}
      
      {/* Saturn's rings */}
      <Ring innerRadius={7} outerRadius={12} distance={180} speed={0.0002} />
      
      {/* Starfield */}
      <Starfield />
      
      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        maxDistance={500}
        minDistance={50}
      />
    </Canvas>
  );
};

export default Scene;