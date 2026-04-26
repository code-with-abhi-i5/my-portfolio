import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticleBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animationFrameId;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.0008);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // 2. Particle System Setup
    // Automatically scale particle count for mobile devices (Balanced count)
    const particleCount = window.innerWidth < 768 ? 90 : 180;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    // Glowing Neon Colors (Cyan, Blue, Purple)
    const colors = new Float32Array(particleCount * 3);
    const colorChoices = [
      new THREE.Color(0x00d4ff), // Cyan
      new THREE.Color(0x3a7bd5), // Blue
      new THREE.Color(0x8b5cf6)  // Purple
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 400;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 400; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // z

      velocities.push({
        x: (Math.random() - 0.5) * 0.15, // Balanced movement speed
        y: (Math.random() - 0.5) * 0.15,
        z: (Math.random() - 0.5) * 0.15
      });

      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Dynamic procedural glow texture
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 4.5, // Bigger dots for visibility
      vertexColors: true,
      map: createGlowTexture(),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.9, // Brighter particles
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // 3. Network Connecting Lines
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 6);
    const lineColors = new Float32Array(particleCount * particleCount * 6);

    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35, // Brighter lines for visibility
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(linesMesh);

    // 4. Interactive Events
    const mouse = new THREE.Vector2(0, 0);
    let targetCameraZ = 150;
    let isInteracting = false;

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      isInteracting = true;
    };

    const onMouseLeave = () => {
      isInteracting = false;
    };

    const onClick = () => {
      // Create a ripple effect on click
      targetCameraZ = 120;
      setTimeout(() => {
        targetCameraZ = 150;
      }, 300);

      for (let i = 0; i < particleCount; i++) {
        velocities[i].x += (Math.random() - 0.5) * 1.5;
        velocities[i].y += (Math.random() - 0.5) * 1.5;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('click', onClick);

    // 5. Handling Window Resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // 6. RequestAnimationFrame Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera parallax motion
      if (isInteracting) {
        camera.position.x += (mouse.x * 20 - camera.position.x) * 0.05;
        camera.position.y += (mouse.y * 20 - camera.position.y) * 0.05;
      } else {
        camera.position.x += (0 - camera.position.x) * 0.02;
        camera.position.y += (0 - camera.position.y) * 0.02;
      }
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.lookAt(scene.position);

      // Subtle slow rotation of the whole network
      particleSystem.rotation.y += 0.0005;
      linesMesh.rotation.y += 0.0005;

      const positions = particleSystem.geometry.attributes.position.array;
      const colorsArr = particleSystem.geometry.attributes.color.array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        // Bounce back smoothly within boundaries
        if (positions[i * 3] > 200 || positions[i * 3] < -200) velocities[i].x *= -1;
        if (positions[i * 3 + 1] > 200 || positions[i * 3 + 1] < -200) velocities[i].y *= -1;
        if (positions[i * 3 + 2] > 100 || positions[i * 3 + 2] < -100) velocities[i].z *= -1;
      }

      let vertexpos = 0;
      let colorpos = 0;
      let numConnected = 0;
      
      const maxDistSq = window.innerWidth < 768 ? 2500 : 4500; // More connections visible

      // Draw dynamic lines based on proximity
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxDistSq) {
            const alpha = 1.0 - (distSq / maxDistSq);

            linePositions[vertexpos++] = positions[i * 3];
            linePositions[vertexpos++] = positions[i * 3 + 1];
            linePositions[vertexpos++] = positions[i * 3 + 2];

            linePositions[vertexpos++] = positions[j * 3];
            linePositions[vertexpos++] = positions[j * 3 + 1];
            linePositions[vertexpos++] = positions[j * 3 + 2];

            lineColors[colorpos++] = colorsArr[i * 3] * alpha;
            lineColors[colorpos++] = colorsArr[i * 3 + 1] * alpha;
            lineColors[colorpos++] = colorsArr[i * 3 + 2] * alpha;

            lineColors[colorpos++] = colorsArr[j * 3] * alpha;
            lineColors[colorpos++] = colorsArr[j * 3 + 1] * alpha;
            lineColors[colorpos++] = colorsArr[j * 3 + 2] * alpha;

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

    // 7. Unmount Cleanup
    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);
      
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      
      particles.dispose();
      linesGeometry.dispose();
      particleMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
}
