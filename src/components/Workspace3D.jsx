import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Workspace3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Use a fixed size since the circular avatar has defined CSS dimensions
    const SIZE = 260;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(2.0, 2.2, 4.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(SIZE, SIZE);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ─── Lighting ─────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const purpleLight = new THREE.DirectionalLight(0x8b5cf6, 2.0);
    purpleLight.position.set(-4, 6, -4);
    purpleLight.castShadow = true;
    scene.add(purpleLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
    topLight.position.set(5, 10, 5);
    topLight.castShadow = true;
    scene.add(topLight);

    // Laptop screen glow light
    const screenLight = new THREE.PointLight(0x00d4ff, 2.5, 4);
    screenLight.position.set(-0.4, 0.9, 0.2);
    screenLight.castShadow = false;
    scene.add(screenLight);

    // ─── Workspace Group (floats as one piece) ─────────────────
    const group = new THREE.Group();
    scene.add(group);

    // DESK
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x1a1a28, roughness: 0.7, metalness: 0.2 });
    const desk = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.1, 2.0), deskMat);
    desk.position.y = 0;
    desk.receiveShadow = true;
    group.add(desk);

    // Desk Legs (4)
    const legMat = new THREE.MeshStandardMaterial({ color: 0x111118, roughness: 0.5 });
    const legGeo = new THREE.BoxGeometry(0.1, 0.8, 0.1);
    [[-1.6, -0.9], [1.6, -0.9], [-1.6, 0.9], [1.6, 0.9]].forEach(([x, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, -0.45, z);
      group.add(leg);
    });

    // ─── LAPTOP ────────────────────────────────────────────────
    const laptopMat = new THREE.MeshStandardMaterial({ color: 0x555566, roughness: 0.3, metalness: 0.7 });

    // Base
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.06, 0.9), laptopMat);
    laptopBase.position.set(-0.3, 0.08, 0);
    laptopBase.castShadow = true;
    group.add(laptopBase);

    // Hinge + Screen lid
    const lidPivot = new THREE.Group();
    lidPivot.position.set(-0.3, 0.11, -0.45);
    lidPivot.rotation.x = -1.15; // open angle

    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.9, 0.05), laptopMat);
    lid.position.set(0, 0.45, 0);
    lid.castShadow = true;
    lidPivot.add(lid);

    // Glowing screen (inside of lid)
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      emissive: new THREE.Color(0x0066aa),
      emissiveIntensity: 1.8,
      roughness: 0.1,
    });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 0.78), screenMat);
    screen.position.set(0, 0.45, 0.026);
    lidPivot.add(screen);

    group.add(lidPivot);

    // ─── COFFEE MUG ─────────────────────────────────────────────
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x222230, roughness: 0.5 });
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.13, 0.32, 20), mugMat);
    mug.position.set(0.85, 0.21, -0.1);
    mug.castShadow = true;
    group.add(mug);

    // Mug handle
    const handleGeo = new THREE.TorusGeometry(0.09, 0.025, 8, 16, Math.PI);
    const handle = new THREE.Mesh(handleGeo, mugMat);
    handle.position.set(1.0, 0.21, -0.1);
    handle.rotation.y = Math.PI / 2;
    handle.rotation.z = Math.PI / 2;
    group.add(handle);

    // Coffee liquid top
    const coffeeMat = new THREE.MeshStandardMaterial({ color: 0x2a1500, roughness: 0.05, metalness: 0 });
    const coffeeTop = new THREE.Mesh(new THREE.CircleGeometry(0.12, 20), coffeeMat);
    coffeeTop.rotation.x = -Math.PI / 2;
    coffeeTop.position.set(0.85, 0.365, -0.1);
    group.add(coffeeTop);

    // ─── Notepad ────────────────────────────────────────────────
    const padMat = new THREE.MeshStandardMaterial({ color: 0x0a0a14, roughness: 0.9 });
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.012, 0.55), padMat);
    pad.position.set(0.7, 0.062, 0.4);
    pad.rotation.y = 0.2;
    group.add(pad);

    // ─── Ground Shadow Plane ─────────────────────────────────────
    const shadowMat = new THREE.MeshStandardMaterial({ color: 0x08080f, roughness: 1.0 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), shadowMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.86;
    floor.receiveShadow = true;
    scene.add(floor);

    // ─── Controls ─────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.2, 0);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2.2;

    // ─── Animation Loop ──────────────────────────────────────────
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      // Gentle float
      group.position.y = Math.sin(time * 1.5) * 0.06;

      // Screen flicker (typing effect)
      if (Math.random() > 0.93) {
        const intensity = 1.2 + Math.random() * 1.0;
        screenMat.emissiveIntensity = intensity;
        screenLight.intensity = intensity + 1;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: 'grab',
        background: 'radial-gradient(circle at 40% 40%, rgba(139,92,246,0.18) 0%, rgba(0,0,0,0.85) 70%)',
      }}
    />
  );
}
