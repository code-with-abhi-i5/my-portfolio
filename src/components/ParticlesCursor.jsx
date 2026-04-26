import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ParticlesCursor() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Skip on mobile
    if (window.innerWidth <= 768) return;

    const container = containerRef.current;
    if (!container) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    // Scene + Orthographic camera (maps directly to screen coords)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 2);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particle pool
    const MAX = 1200;
    const positions = new Float32Array(MAX * 3);
    const colors = new Float32Array(MAX * 3);
    const sizes = new Float32Array(MAX);
    const opacities = new Float32Array(MAX);

    const pool = [];
    for (let i = 0; i < MAX; i++) {
      pool.push({ alive: false, x: 0, y: 0, vx: 0, vy: 0, age: 0, maxAge: 0, size: 0, cr: 0, cg: 0, cb: 0 });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        attribute vec3 aColor;
        varying float vOpacity;
        varying vec3 vColor;
        void main() {
          vOpacity = aOpacity;
          vColor = aColor;
          gl_PointSize = aSize;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float glow = smoothstep(0.5, 0.0, d);
          float core = smoothstep(0.2, 0.0, d) * 0.6;
          float alpha = (glow + core) * vOpacity;
          vec3 col = vColor + vec3(core * 0.3);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse state
    let mx = 0, my = 0, pmx = 0, pmy = 0;
    let moving = false;
    let idleTimer;

    const onMouseMove = (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = -(e.clientY / window.innerHeight) * 2 + 1;
      moving = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { moving = false; }, 80);
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Spawn helper
    let nextIdx = 0;
    const spawn = (x, y, spread, sizeMin, sizeMax, maxAge) => {
      const p = pool[nextIdx];
      p.alive = true;
      p.x = x + (Math.random() - 0.5) * spread;
      p.y = y + (Math.random() - 0.5) * spread;
      p.vx = (Math.random() - 0.5) * 0.006;
      p.vy = (Math.random() - 0.5) * 0.006 + 0.002;
      p.age = 0;
      p.maxAge = maxAge + Math.random() * 0.8;
      p.size = sizeMin + Math.random() * (sizeMax - sizeMin);

      const r = Math.random();
      if (r < 0.45) { p.cr = 0; p.cg = 0.83; p.cb = 1.0; }         // cyan
      else if (r < 0.8) { p.cr = 0.55; p.cg = 0.36; p.cb = 0.97; }  // purple
      else { p.cr = 0.9; p.cg = 0.95; p.cb = 1.0; }                  // white sparkle

      nextIdx = (nextIdx + 1) % MAX;
    };

    // Idle orbit angle
    let idleAngle = 0;

    // Animation
    let lastTime = performance.now();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Spawn particles on cursor trail
      if (moving) {
        const dx = mx - pmx;
        const dy = my - pmy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const count = Math.min(Math.max(Math.floor(dist * 250), 2), 10);
        for (let i = 0; i < count; i++) {
          const t = i / count;
          spawn(pmx + dx * t, pmy + dy * t, 0.025, 3, 8, 1.2);
        }
      } else {
        // Idle: gentle orbit particles around last cursor position
        idleAngle += dt * 1.2;
        if (Math.random() > 0.7) {
          const r = 0.04 + Math.random() * 0.03;
          spawn(
            mx + Math.cos(idleAngle) * r,
            my + Math.sin(idleAngle) * r,
            0.01, 2, 5, 1.5
          );
        }
      }

      pmx = mx;
      pmy = my;

      // Update all particles
      for (let i = 0; i < MAX; i++) {
        const p = pool[i];
        if (!p.alive) {
          opacities[i] = 0;
          sizes[i] = 0;
          continue;
        }

        p.age += dt;
        if (p.age >= p.maxAge) {
          p.alive = false;
          opacities[i] = 0;
          sizes[i] = 0;
          continue;
        }

        const life = p.age / p.maxAge;

        // Drift with slight upward float
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Add swirl noise
        const swirl = Math.sin(p.age * 3 + i * 0.1) * 0.001;
        p.x += swirl;
        p.y += Math.cos(p.age * 2.5 + i * 0.15) * 0.001;

        const i3 = i * 3;
        positions[i3] = p.x;
        positions[i3 + 1] = p.y;
        positions[i3 + 2] = 0;

        colors[i3] = p.cr;
        colors[i3 + 1] = p.cg;
        colors[i3 + 2] = p.cb;

        // Fade curve: quick fade-in, slow fade-out
        const fadeIn = Math.min(p.age * 8, 1);
        const fadeOut = 1 - life * life;
        opacities[i] = fadeIn * fadeOut * 0.75;

        sizes[i] = p.size * (1 - life * 0.4);
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.aColor.needsUpdate = true;
      geometry.attributes.aOpacity.needsUpdate = true;
      geometry.attributes.aSize.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      clearTimeout(idleTimer);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  );
}
