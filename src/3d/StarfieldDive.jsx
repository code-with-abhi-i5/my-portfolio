import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Starfield() {
  const ref = useRef();
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(6000 * 3);
    const cols = new Float32Array(6000 * 3);
    const colorChoices = [new THREE.Color('#00d4ff'), new THREE.Color('#8b5cf6'), new THREE.Color('#ffffff')];
    for (let i = 0; i < 6000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      cols[i * 3] = color.r; cols[i * 3 + 1] = color.g; cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta / 40;
      ref.current.rotation.x += delta / 50;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial transparent vertexColors size={0.04} sizeAttenuation={true} depthWrite={false} opacity={0.3} blending={THREE.AdditiveBlending} />
    </Points>
  );
}

function SceneContent() {
  const cameraRef = useRef();
  useGSAP(() => {
    gsap.to(cameraRef.current.position, {
      z: -15,
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 }
    });
  }, []);
  return (
    <>
      <perspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} />
      <Starfield />
    </>
  );
}

export default function StarfieldDive() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none' }}>
      <Canvas><SceneContent /></Canvas>
    </div>
  );
}
