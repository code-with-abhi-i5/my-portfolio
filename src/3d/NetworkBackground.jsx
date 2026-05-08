import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NetworkBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animationFrameId;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const particleCount = window.innerWidth < 768 ? 80 : 150;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const colors = new Float32Array(particleCount * 3);
    const colorChoices = [new THREE.Color(0x00d4ff), new THREE.Color(0x8b5cf6)];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      velocities.push({ x: (Math.random() - 0.5) * 0.1, y: (Math.random() - 0.5) * 0.1, z: (Math.random() - 0.5) * 0.1 });
      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = color.r; colors[i * 3 + 1] = color.g; colors[i * 3 + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({ size: 3, vertexColors: true, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    const lineColors = new Float32Array(particleCount * particleCount * 6);
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));
    const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending });
    const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(linesMesh);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particleSystem.rotation.y += 0.0003;
      linesMesh.rotation.y += 0.0003;
      const pos = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i].x; pos[i * 3 + 1] += velocities[i].y; pos[i * 3 + 2] += velocities[i].z;
        if (pos[i * 3] > 200 || pos[i * 3] < -200) velocities[i].x *= -1;
        if (pos[i * 3 + 1] > 200 || pos[i * 3 + 1] < -200) velocities[i].y *= -1;
      }
      
      let vertexpos = 0; let colorpos = 0; let numConnected = 0;
      const maxDistSq = 3500;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = pos[i * 3] - pos[j * 3]; const dy = pos[i * 3 + 1] - pos[j * 3 + 1]; const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < maxDistSq) {
            const alpha = 1.0 - (distSq / maxDistSq);
            linePositions[vertexpos++] = pos[i * 3]; linePositions[vertexpos++] = pos[i * 3 + 1]; linePositions[vertexpos++] = pos[i * 3 + 2];
            linePositions[vertexpos++] = pos[j * 3]; linePositions[vertexpos++] = pos[j * 3 + 1]; linePositions[vertexpos++] = pos[j * 3 + 2];
            lineColors[colorpos++] = colors[i * 3] * alpha; lineColors[colorpos++] = colors[i * 3 + 1] * alpha; lineColors[colorpos++] = colors[i * 3 + 2] * alpha;
            lineColors[colorpos++] = colors[j * 3] * alpha; lineColors[colorpos++] = colors[j * 3 + 1] * alpha; lineColors[colorpos++] = colors[j * 3 + 2] * alpha;
            numConnected++;
          }
        }
      }
      linesMesh.geometry.setDrawRange(0, numConnected * 2);
      linesMesh.geometry.attributes.position.needsUpdate = true;
      linesMesh.geometry.attributes.color.needsUpdate = true;
      particleSystem.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();
    const handleResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener('resize', handleResize);
    return () => { 
      window.removeEventListener('resize', handleResize); 
      cancelAnimationFrame(animationFrameId); 
      mount.removeChild(renderer.domElement);
      particles.dispose(); linesGeometry.dispose(); renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'fixed', inset: 0, zIndex: -3, pointerEvents: 'none' }} />;
}
