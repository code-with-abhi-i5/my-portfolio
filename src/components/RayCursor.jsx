import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function RayCursor() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animationFrameId;
    const scene = new THREE.Scene();
    
    // Perspective camera gives the ray a nice 3D depth feeling
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // 1. Trail Setup
    const trailCount = 40; // Number of segments in the ray
    const points = [];
    for (let i = 0; i < trailCount; i++) {
      points.push(new THREE.Vector3(0, -i * 0.1, 0));
    }

    // 2. Materials (Core Beam + Outer Glow)
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff, // Cyan Core
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6, // Purple Glow
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create initial geometries
    const initialCurve = new THREE.CatmullRomCurve3(points);
    let tubeMesh = new THREE.Mesh(new THREE.TubeGeometry(initialCurve, 64, 0.4, 8, false), material);
    let glowMesh = new THREE.Mesh(new THREE.TubeGeometry(initialCurve, 64, 1.4, 8, false), glowMaterial);
    
    scene.add(tubeMesh);
    scene.add(glowMesh);

    // 3. Interactivity
    const targetMouse = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    let isMouseMoving = false;
    let idleTimer = null;

    const unprojectMouse = (x, y) => {
      const vec = new THREE.Vector3(
        (x / window.innerWidth) * 2 - 1,
        -(y / window.innerHeight) * 2 + 1,
        0.5
      );
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      return camera.position.clone().add(dir.multiplyScalar(distance));
    };

    const onMouseMove = (e) => {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
      isMouseMoving = true;
      
      // Detect when mouse stops to fade out the ray
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        isMouseMoving = false;
      }, 100);
    };

    const onClick = () => {
      // Flash effect on click
      material.color.setHex(0xffffff);
      glowMaterial.color.setHex(0x00ffff);
      setTimeout(() => {
        material.color.setHex(0x00ffff);
        glowMaterial.color.setHex(0x8b5cf6);
      }, 200);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        targetMouse.x = e.touches[0].clientX;
        targetMouse.y = e.touches[0].clientY;
        isMouseMoving = true;
      }
    });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    let currentPos = unprojectMouse(window.innerWidth / 2, window.innerHeight / 2);

    // 4. Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const targetWorld = unprojectMouse(targetMouse.x, targetMouse.y);
      
      // Move head of the ray smoothly towards mouse
      currentPos.lerp(targetWorld, 0.2);

      // Shift points: each point follows the one ahead of it for fluid trailing
      points[0].copy(currentPos);
      for (let i = 1; i < trailCount; i++) {
        // Lower lerp value = looser tail, Higher = stiffer tail
        points[i].lerp(points[i - 1], 0.35);
      }

      // Check distance from head to tail to determine if the ray is stretched (moving)
      const dist = points[0].distanceTo(points[trailCount - 1]);
      
      if (isMouseMoving && dist > 0.5) {
        // Fade in
        material.opacity += (0.9 - material.opacity) * 0.1;
        glowMaterial.opacity += (0.4 - glowMaterial.opacity) * 0.1;
      } else {
        // Fade out
        material.opacity += (0 - material.opacity) * 0.05;
        glowMaterial.opacity += (0 - glowMaterial.opacity) * 0.05;
      }

      // Only reconstruct TubeGeometry if visible
      if (material.opacity > 0.01) {
        // Add microscopic offset to prevent CatmullRomCurve3 from breaking on identical points
        const curvePoints = points.map((p, i) => new THREE.Vector3(
          p.x, 
          p.y - (i * 0.001), 
          p.z
        ));

        const curve = new THREE.CatmullRomCurve3(curvePoints);
        
        // Dispose old geometry to prevent memory leaks
        tubeMesh.geometry.dispose();
        glowMesh.geometry.dispose();

        // Rebuild geometry along the new curve
        tubeMesh.geometry = new THREE.TubeGeometry(curve, 64, 0.35, 8, false);
        glowMesh.geometry = new THREE.TubeGeometry(curve, 64, 1.2, 8, false);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 5. Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      clearTimeout(idleTimer);
      cancelAnimationFrame(animationFrameId);
      
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      
      if (tubeMesh.geometry) tubeMesh.geometry.dispose();
      if (glowMesh.geometry) glowMesh.geometry.dispose();
      material.dispose();
      glowMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="ray-cursor-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
        mixBlendMode: 'screen', // Ensures dark background is completely transparent
      }}
    />
  );
}
