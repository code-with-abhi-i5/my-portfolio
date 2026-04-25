import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Edges, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────────────
   GLOWING WIREFRAME TORUS KNOT
   The primary hero object – a low-poly torus
   knot with emissive neon edges + distortion.
   ───────────────────────────────────────────── */
function GlowingKnot({ mouse }) {
  const meshRef = useRef();
  const edgesRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Smooth mouse-follow rotation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouse.current[1] * 0.4 + t * 0.08,
      0.04
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouse.current[0] * 0.5 + t * 0.12,
      0.04
    );
  });

  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1.2} floatingRange={[-0.15, 0.15]}>
      <mesh ref={meshRef} scale={1.35}>
        <torusKnotGeometry args={[1, 0.35, 100, 16, 2, 3]} />
        <MeshDistortMaterial
          color="#1a0a2e"
          emissive="#8b5cf6"
          emissiveIntensity={0.4}
          metalness={0.95}
          roughness={0.15}
          distort={0.15}
          speed={1.5}
          transparent
          opacity={0.85}
        />
        <Edges
          ref={edgesRef}
          threshold={15}
          scale={1.001}
          color="#00d4ff"
        />
      </mesh>
    </Float>
  );
}

/* ─────────────────────────────────────────────
   ORBITING RING
   Thin ring orbiting around the knot to add
   a sci-fi / tech feel.
   ───────────────────────────────────────────── */
function OrbitRing({ radius = 2.2, speed = 0.5, tilt = 0.3, color = '#00d4ff' }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = tilt;
    ref.current.rotation.z = t * speed;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 8, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   FLOATING PARTICLES
   Tiny glowing dots that float around the
   main object for depth and atmosphere.
   ───────────────────────────────────────────── */
function FloatingParticles({ count = 60 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = state.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#00d4ff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ─────────────────────────────────────────────
   SCENE — composes everything inside <Canvas>
   ───────────────────────────────────────────── */
function Scene({ mouse }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#ffffff" />
      <pointLight position={[-3, 2, 4]} intensity={1.5} color="#8b5cf6" distance={12} />
      <pointLight position={[3, -2, 2]} intensity={1} color="#00d4ff" distance={10} />
      <pointLight position={[0, 3, -3]} intensity={0.5} color="#00ff94" distance={8} />

      {/* Main object */}
      <GlowingKnot mouse={mouse} />

      {/* Orbit rings */}
      <OrbitRing radius={2.2} speed={0.35} tilt={0.5} color="#8b5cf6" />
      <OrbitRing radius={2.6} speed={-0.25} tilt={-0.7} color="#00d4ff" />

      {/* Particles */}
      <FloatingParticles count={50} />

      {/* Environment for reflections */}
      <Environment preset="night" />
    </>
  );
}

/* ─────────────────────────────────────────────
   HERO3D — the exported component.
   Drop this into the right side of Hero.
   ───────────────────────────────────────────── */
export default function Hero3D() {
  const mouse = useRef([0, 0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e) => {
      mouse.current = [
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
      ];
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [isMobile]);

  /* Mobile fallback — a simple static gradient orb */
  if (isMobile) {
    return (
      <div className="hero3d-mobile-fallback">
        <div className="hero3d-mobile-orb" />
      </div>
    );
  }

  return (
    <div className="hero3d-canvas-wrap">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}
