import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════
   NEXT-LEVEL ATOM LOGO — Matching loader style
   Same gradient atom (cyan→purple, green→cyan) but
   in full 3D with interactive glow, particles, etc.
   ═══════════════════════════════════════════════════ */

export default function AvatarWithEffect() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const SIZE = 300;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(SIZE, SIZE);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ── Main group ──
    const atom = new THREE.Group();
    scene.add(atom);

    // ═══════════════════════════════════════════════
    //  NUCLEUS — Glowing green-to-cyan pulsing core
    // ═══════════════════════════════════════════════
    const coreMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uHover: { value: 0 } },
      vertexShader: `
        varying vec3 vN; varying vec3 vP;
        void main(){
          vN = normalize(normalMatrix * normal);
          vP = (modelViewMatrix * vec4(position,1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
      fragmentShader: `
        uniform float uTime, uHover;
        varying vec3 vN, vP;
        void main(){
          vec3 vd = normalize(-vP);
          float f = pow(1.0 - abs(dot(vd, vN)), 2.5);

          vec3 neon  = vec3(0.0, 1.0, 0.58);   // #00ff94
          vec3 cyan  = vec3(0.0, 0.83, 1.0);    // #00d4ff
          vec3 white = vec3(1.0);

          // Color shifts between green and cyan over time
          float mix1 = sin(uTime * 1.5) * 0.5 + 0.5;
          vec3 base = mix(neon, cyan, mix1);

          // Bright white center
          float core = smoothstep(0.55, 0.0, length(vP.xy)) * 0.7;
          vec3 col = mix(base, white, core);

          // Fresnel rim
          col += cyan * f * (1.2 + uHover * 0.6);
          col += neon * f * f * 0.4;

          // Glow intensity
          float glow = 1.0 + uHover * 0.3;
          gl_FragColor = vec4(col * glow, 0.95);
        }`,
      transparent: true,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.3, 48, 48), coreMat);
    atom.add(core);

    // ── Core glow layers ──
    const makeGlow = (r, col, op) => {
      const m = new THREE.MeshBasicMaterial({
        color: col, transparent: true, opacity: op,
        side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 20), m);
      atom.add(mesh);
      return { mesh, mat: m };
    };
    const glow1 = makeGlow(0.5, 0x00ff94, 0.2);
    const glow2 = makeGlow(0.7, 0x00d4ff, 0.08);
    const glow3 = makeGlow(0.9, 0x8b5cf6, 0.04);

    // ═══════════════════════════════════════════════
    //  ORBITAL RINGS — Gradient colored like loader
    //  orbit-1: cyan→purple, orbit-2: green→cyan, orbit-3: cyan→purple
    // ═══════════════════════════════════════════════
    const RING_R = 1.35;

    // Custom gradient ring using shader
    function createOrbitRing(color1, color2, tilt, thickness) {
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uColor1: { value: new THREE.Color(color1) },
          uColor2: { value: new THREE.Color(color2) },
          uOpacity: { value: 0.65 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }`,
        fragmentShader: `
          uniform vec3 uColor1, uColor2;
          uniform float uOpacity;
          varying vec2 vUv;
          void main(){
            vec3 col = mix(uColor1, uColor2, vUv.x);
            gl_FragColor = vec4(col, uOpacity);
          }`,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      const geo = new THREE.TorusGeometry(RING_R, thickness, 8, 150);
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.set(...tilt);
      atom.add(ring);
      return { mesh: ring, mat };
    }

    // Same angles as loader: 30°, -30°, 90° (converted + 3D depth tilts)
    const orbit1 = createOrbitRing('#00d4ff', '#8b5cf6',
      [Math.PI / 2.15, 0, Math.PI / 6], 0.018);    // ~30°

    const orbit2 = createOrbitRing('#00ff94', '#00d4ff',
      [Math.PI / 2.15, 0, -Math.PI / 6], 0.018);   // ~-30°

    const orbit3 = createOrbitRing('#00d4ff', '#8b5cf6',
      [Math.PI / 2.15, 0, Math.PI / 2], 0.015);     // ~90°

    const allOrbits = [orbit1, orbit2, orbit3];

    // ═══════════════════════════════════════════════
    //  ELECTRON DOTS — traveling along each orbit
    // ═══════════════════════════════════════════════
    const electronGeo = new THREE.SphereGeometry(0.05, 14, 14);

    const electrons = allOrbits.map((o, i) => {
      // Main dot (white bright)
      const eMat = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
      const eMesh = new THREE.Mesh(electronGeo, eMat);
      o.mesh.add(eMesh);

      // Glow around dot
      const gMat = new THREE.MeshBasicMaterial({
        color: i === 1 ? 0x00ff94 : 0x00d4ff,
        transparent: true, opacity: 0.4,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const gMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), gMat);
      o.mesh.add(gMesh);

      return { dot: eMesh, glow: gMesh, speed: 0.7 + i * 0.15, phase: (i * Math.PI * 2) / 3 };
    });

    // ═══════════════════════════════════════════════
    //  OUTER CONIC RING — matches loader's conic-gradient ring
    // ═══════════════════════════════════════════════
    const outerRingMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main(){
          float angle = vUv.x * 6.2832 + uTime * 0.3;
          vec3 cyan   = vec3(0.0, 0.83, 1.0);
          vec3 purple = vec3(0.55, 0.36, 0.96);
          vec3 green  = vec3(0.0, 1.0, 0.58);

          vec3 col = mix(cyan, purple, smoothstep(0.0, 0.33, fract(angle / 6.2832)));
          col = mix(col, green, smoothstep(0.33, 0.66, fract(angle / 6.2832)));
          col = mix(col, cyan, smoothstep(0.66, 1.0, fract(angle / 6.2832)));

          float fade = smoothstep(0.0, 0.1, fract(angle / 6.2832 * 3.0));
          gl_FragColor = vec4(col, 0.35 * fade);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.012, 6, 180), outerRingMat
    );
    atom.add(outerRing);

    // ── Dashed inner ring (like loader's dashed border) ──
    const dashedMat = new THREE.LineDashedMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.25,
      dashSize: 0.15,
      gapSize: 0.1,
      blending: THREE.AdditiveBlending,
    });
    const dashedCurve = new THREE.EllipseCurve(0, 0, 1.5, 1.5, 0, Math.PI * 2, false);
    const dashedPoints = dashedCurve.getPoints(80).map(p => new THREE.Vector3(p.x, p.y, 0));
    const dashedGeo = new THREE.BufferGeometry().setFromPoints(dashedPoints);
    const dashedRing = new THREE.Line(dashedGeo, dashedMat);
    dashedRing.computeLineDistances();
    atom.add(dashedRing);

    // ═══════════════════════════════════════════════
    //  FLOATING PARTICLES — subtle depth
    // ═══════════════════════════════════════════════
    const pCount = 30;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 1.5;
      pPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.02, color: 0x00d4ff, transparent: true, opacity: 0.5,
      sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ═══════════════════════════════════════════════
    //  LIGHTING
    // ═══════════════════════════════════════════════
    const pLight1 = new THREE.PointLight(0x00d4ff, 2, 8);
    pLight1.position.set(0, 0, 2.5);
    scene.add(pLight1);
    const pLight2 = new THREE.PointLight(0x8b5cf6, 1.2, 8);
    pLight2.position.set(-2, 1, 1);
    scene.add(pLight2);
    scene.add(new THREE.AmbientLight(0x00ff94, 0.1));

    // ═══════════════════════════════════════════════
    //  MOUSE INTERACTION
    // ═══════════════════════════════════════════════
    let mouseX = 0, mouseY = 0, hoverVal = 0, hoverTarget = 0, pulseVal = 0;

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
      hoverTarget = Math.max(0, 1 - dist / 250);
    };

    const onMouseLeave = () => { hoverTarget = 0; mouseX = 0; mouseY = 0; };
    const onClick = () => { pulseVal = 1.0; };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    mount.addEventListener('mouseleave', onMouseLeave);
    mount.addEventListener('click', onClick);

    // ═══════════════════════════════════════════════
    //  ANIMATION LOOP
    // ═══════════════════════════════════════════════
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;

      hoverVal += (hoverTarget - hoverVal) * 0.06;
      pulseVal *= 0.9;

      coreMat.uniforms.uTime.value = t;
      coreMat.uniforms.uHover.value = hoverVal;
      outerRingMat.uniforms.uTime.value = t;

      // Core breathing
      const breathe = 1 + Math.sin(t * 1.8) * 0.06 + pulseVal * 0.2;
      core.scale.setScalar(breathe);
      glow1.mesh.scale.setScalar(breathe * 1.1);
      glow2.mesh.scale.setScalar(breathe * 1.05);
      glow3.mesh.scale.setScalar(breathe);
      glow1.mat.opacity = 0.2 + hoverVal * 0.15 + pulseVal * 0.12;
      glow2.mat.opacity = 0.08 + hoverVal * 0.06;

      // Atom rotation (slow, elegant like loader)
      const rSpeed = 0.12 + hoverVal * 0.08;
      atom.rotation.y += rSpeed * 0.016;

      // Mouse parallax
      atom.rotation.x = THREE.MathUtils.lerp(atom.rotation.x, -mouseY * 0.3, 0.04);
      atom.rotation.z = THREE.MathUtils.lerp(atom.rotation.z, mouseX * 0.2, 0.04);

      // Floating motion
      atom.position.y = Math.sin(t * 0.6) * 0.05;

      // Outer ring spin (like loader's conic gradient spin)
      outerRing.rotation.z = t * 0.25;

      // Dashed ring counter-rotation (like loader)
      dashedRing.rotation.z = -t * 0.15;

      // Electrons orbiting
      const eSpeed = 0.8 + hoverVal * 0.4;
      electrons.forEach(({ dot, glow, speed, phase }) => {
        const angle = t * speed * eSpeed + phase;
        const px = Math.cos(angle) * RING_R;
        const py = Math.sin(angle) * RING_R;
        dot.position.set(px, py, 0);
        glow.position.set(px, py, 0);
      });

      // Orbit ring opacity pulse
      allOrbits.forEach((o, i) => {
        o.mat.uniforms.uOpacity.value = 0.5 + Math.sin(t * 1.2 + i) * 0.12 + hoverVal * 0.2;
      });

      // Particles slow drift
      particles.rotation.y = t * 0.02;
      particles.rotation.x = t * 0.01;

      // Light intensity
      pLight1.intensity = 2 + hoverVal * 2 + pulseVal * 3;

      renderer.render(scene, camera);
    };
    animate();

    // ═══════════════════════════════════════════════
    //  CLEANUP
    // ═══════════════════════════════════════════════
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('mouseleave', onMouseLeave);
      mount.removeEventListener('click', onClick);
      cancelAnimationFrame(animId);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'radial-gradient(circle at 50% 45%, rgba(0,212,255,0.04) 0%, rgba(5,5,10,0.97) 55%)',
      }}
    />
  );
}
