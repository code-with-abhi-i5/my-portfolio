import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function StarField() {
  const ref = useRef();
  
  // Create random points for stars
  const sphere = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const r = 10 + Math.random() * 20;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00d4ff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
        />
      </Points>
    </group>
  );
}

function FloatingOrbs() {
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.cos(t / 10) / 10, 0.1);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 10) / 10, 0.1);
  });

  return (
    <group ref={group}>
      <mesh position={[-10, 5, -15]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.05} />
      </mesh>
      <mesh position={[12, -8, -20]}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.05} />
      </mesh>
      <mesh position={[0, -15, -10]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.03} />
      </mesh>
    </group>
  );
}

export default function InteractiveBackground() {
  const bgRef = useRef(null);

  useGSAP(() => {
    // Background Color Transition (Day to Night)
    gsap.to(bgRef.current, {
      background: 'radial-gradient(circle at center, #0a0a1a 0%, #000000 100%)',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    // Particle Speed & Camera Depth Effect
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress;
        // We can communicate this to the 3D scene if needed, 
        // but simple CSS transitions are often more performant for background colors.
      }
    });
  }, []);

  return (
    <div 
      ref={bgRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'radial-gradient(circle at center, #101827 0%, #030712 100%)',
        transition: 'background 0.5s ease'
      }}
    >
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <StarField />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
