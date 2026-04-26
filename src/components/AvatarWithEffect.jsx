import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AvatarWithEffect() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const SIZE = 280;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(SIZE, SIZE);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ─── NOISE GLSL (simplex 3D) ──────────────────────────────
    const noiseGLSL = `
      vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
      vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
      vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }
    `;

    // ─── ORB SHADER ───────────────────────────────────────────
    const orbMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uGlow: { value: 1.0 },
        uPulse: { value: 0.0 },
      },
      vertexShader: `
        ${noiseGLSL}
        uniform float uTime;
        uniform float uPulse;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vNoise;

        void main() {
          vNormal = normal;
          vPosition = position;

          float n = snoise(position * 2.5 + uTime * 0.4) * 0.15;
          n += snoise(position * 5.0 - uTime * 0.6) * 0.08;

          // Pulse expansion on click
          float pulseDisp = uPulse * 0.15;

          vec3 pos = position + normal * (n + pulseDisp);
          vNoise = n;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uGlow;
        uniform float uPulse;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying float vNoise;

        void main() {
          // Fresnel edge glow
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDir, vNormal), 2.5);

          // Base energy colors
          vec3 cyan = vec3(0.0, 0.83, 1.0);
          vec3 purple = vec3(0.55, 0.36, 0.97);
          vec3 blue = vec3(0.23, 0.48, 0.84);

          // Mix colors based on noise and position
          float mixer = vNoise * 4.0 + vPosition.y * 0.8;
          vec3 col = mix(cyan, purple, smoothstep(-0.5, 0.5, sin(mixer + uTime * 0.3)));
          col = mix(col, blue, smoothstep(-0.3, 0.3, cos(mixer * 1.5 - uTime * 0.2)));

          // Add bright core
          float core = smoothstep(0.6, 0.0, length(vPosition.xy)) * 0.4;
          col += vec3(0.3, 0.6, 1.0) * core;

          // Fresnel rim
          col += cyan * fresnel * 1.2 * uGlow;

          // Pulse flash
          col += vec3(0.4, 0.7, 1.0) * uPulse * 0.5;

          // Overall brightness
          float alpha = 0.85 + fresnel * 0.15;

          gl_FragColor = vec4(col * uGlow, alpha);
        }
      `,
      transparent: true,
    });

    const orb = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), orbMat);
    scene.add(orb);

    // ─── GLOW AURA (larger transparent sphere) ────────────────
    const auraMat = new THREE.ShaderMaterial({
      uniforms: {
        uGlow: { value: 1.0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uGlow;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
          vec3 col = mix(vec3(0.0, 0.83, 1.0), vec3(0.55, 0.36, 0.97), fresnel);
          float alpha = fresnel * 0.45 * uGlow;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const aura = new THREE.Mesh(new THREE.SphereGeometry(1.35, 32, 32), auraMat);
    scene.add(aura);

    // ─── ROTATING RING ────────────────────────────────────────
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.015, 16, 100), ringMat);
    ring.rotation.x = Math.PI / 2.5;
    scene.add(ring);

    // Second ring (thinner, different angle)
    const ring2Mat = ringMat.clone();
    ring2Mat.opacity = 0.3;
    ring2Mat.color = new THREE.Color(0x8b5cf6);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.01, 16, 100), ring2Mat);
    ring2.rotation.x = Math.PI / 1.8;
    ring2.rotation.z = 0.4;
    scene.add(ring2);

    // ─── LIGHTING ─────────────────────────────────────────────
    const pointLight = new THREE.PointLight(0x00d4ff, 2, 8);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x8b5cf6, 0.3);
    scene.add(ambientLight);

    // ─── MOUSE INTERACTION ────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    let glowTarget = 1.0;
    let currentGlow = 1.0;
    let pulseValue = 0;

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      mouseX = dx / rect.width;
      mouseY = dy / rect.height;

      // Increase glow when cursor is near
      const proximity = Math.max(0, 1 - dist / 300);
      glowTarget = 1.0 + proximity * 1.2;
    };

    const onMouseLeave = () => {
      glowTarget = 1.0;
      mouseX = 0;
      mouseY = 0;
    };

    const onClick = () => {
      pulseValue = 1.0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    mount.addEventListener('mouseleave', onMouseLeave);
    mount.addEventListener('click', onClick);

    // ─── ANIMATION LOOP ──────────────────────────────────────
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = performance.now() * 0.001;

      // Update uniforms
      orbMat.uniforms.uTime.value = time;

      // Smooth glow transition
      currentGlow += (glowTarget - currentGlow) * 0.06;
      orbMat.uniforms.uGlow.value = currentGlow;
      auraMat.uniforms.uGlow.value = currentGlow;

      // Pulse decay
      pulseValue *= 0.92;
      orbMat.uniforms.uPulse.value = pulseValue;

      // Orb slow rotation
      orb.rotation.y = time * 0.15;
      orb.rotation.x = Math.sin(time * 0.2) * 0.1;

      // Tilt toward cursor
      orb.rotation.z = -mouseX * 0.3;
      orb.position.x = mouseX * 0.15;
      orb.position.y = -mouseY * 0.15;

      // Aura follows orb
      aura.position.copy(orb.position);
      aura.rotation.y = -time * 0.1;

      // Ring rotations
      ring.rotation.z = time * 0.4;
      ring2.rotation.z = -time * 0.25 + 0.4;

      // Pulsing aura scale
      const pulse = 1 + Math.sin(time * 2) * 0.03;
      aura.scale.setScalar(pulse);

      // Ring opacity pulse
      ringMat.opacity = 0.4 + Math.sin(time * 1.5) * 0.15;

      // Point light intensity with glow
      pointLight.intensity = 1.5 + (currentGlow - 1) * 2 + pulseValue * 3;

      renderer.render(scene, camera);
    };
    animate();

    // ─── CLEANUP ──────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('mouseleave', onMouseLeave);
      mount.removeEventListener('click', onClick);
      cancelAnimationFrame(animId);
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
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'radial-gradient(circle at 40% 40%, rgba(0, 212, 255, 0.08) 0%, rgba(10, 10, 20, 0.95) 65%)',
      }}
    />
  );
}
