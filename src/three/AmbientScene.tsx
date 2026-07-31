import { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneInput } from "./sceneInput";

// Subtle per-route camera "look" — different pages feel like slightly
// different vantage points in the same room, rather than a hard cut.
const ROUTE_TARGETS: Record<string, { pos: [number, number, number]; fov: number }> = {
  "/": { pos: [0, 0.1, 8], fov: 45 },
  "/story": { pos: [1.1, 0.4, 7.4], fov: 44 },
  "/events": { pos: [-1.1, -0.1, 7.6], fov: 44 },
  "/gallery": { pos: [0, 0.3, 6.6], fov: 42 }, // slightly tighter/zoomed
  "/wishes": { pos: [0.6, 0.2, 7.8], fov: 45 },
  "/rsvp": { pos: [0, -0.2, 8.1], fov: 45 },
};

function getRouteTarget(pathname: string) {
  return ROUTE_TARGETS[pathname] ?? ROUTE_TARGETS["/"];
}

/** Gold particle field. When `interactive`, particles gently drift away
 *  from the cursor's approximate screen-projected position each frame. */
function GoldParticles({
  count,
  reflection = false,
  interactive = false,
}: {
  count: number;
  reflection?: boolean;
  interactive?: boolean;
}) {
  const basePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 8 - (reflection ? 3.4 : -1.5);
      const z = (Math.random() - 0.5) * 10 - 2;
      arr[i * 3] = x;
      arr[i * 3 + 1] = reflection ? -Math.abs(y) - 1.5 : y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count, reflection]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(basePositions.slice(), 3));
    return g;
  }, [basePositions]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color("#E4C97A"),
        size: 0.06,
        sizeAttenuation: true,
        transparent: true,
        opacity: reflection ? 0.12 : 0.55,
        depthWrite: false,
      }),
    [reflection]
  );

  const ref = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.015;

    if (!interactive) return;
    const posAttr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    const mx = sceneInput.mouseX;
    const my = sceneInput.mouseY;
    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];
      scratch.set(bx, by, bz).project(camera);
      const dx = scratch.x - mx;
      const dy = scratch.y - my;
      const distSq = dx * dx + dy * dy;
      const influence = Math.max(0, 1 - distSq / 0.05); // falls off quickly
      const cx = posAttr.getX(i);
      const cy = posAttr.getY(i);
      const cz = posAttr.getZ(i);
      const targetX = bx + dx * influence * 1.4;
      const targetY = by + dy * influence * 1.4;
      posAttr.setXYZ(
        i,
        cx + (targetX - cx) * 0.08,
        cy + (targetY - cy) * 0.08,
        cz + (bz - cz) * 0.08
      );
    }
    posAttr.needsUpdate = true;
  });

  return <points ref={ref} geometry={geo} material={material} />;
}

function FloatingRings() {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        pos: [
          (Math.random() - 0.5) * 7,
          Math.random() * 2 - 1,
          (Math.random() - 0.5) * 4 - 1,
        ] as [number, number, number],
        speed: 0.15 + Math.random() * 0.2,
        offset: i * 1.3,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((mesh, i) => {
      const r = rings[i];
      mesh.rotation.x = t * r.speed;
      mesh.rotation.z = t * r.speed * 0.6;
      mesh.position.y = r.pos[1] + Math.sin(t * 0.4 + r.offset) * 0.3;
    });
  });

  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={i} position={r.pos} castShadow>
          <torusGeometry args={[0.35, 0.045, 12, 32]} />
          <meshStandardMaterial
            color="#C9A24B"
            metalness={0.85}
            roughness={0.25}
            emissive="#5c4413"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

function GroundPlane() {
  return (
    <mesh position={[0, -3.4, -2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <shadowMaterial opacity={0.18} />
    </mesh>
  );
}

/** A rotating ring of small marigold-flower blossoms, drifting slowly
 *  behind the hero couple-name text on the Home route. */
function MarigoldRing() {
  const group = useRef<THREE.Group>(null);
  const blossoms = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        return {
          pos: [Math.cos(angle) * 2.6, Math.sin(angle) * 0.9, -3.2] as [number, number, number],
        };
      }),
    []
  );

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.06;
  });

  return (
    <group ref={group} position={[0, 0.2, 0]}>
      {blossoms.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <icosahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#E4762B" : "#F2A93B"}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Stand-in for extruded 3D wordmark text: a beveled gold medallion sitting
 *  behind the hero heading, slowly rotating so its facets catch the light. */
function GoldMedallion() {
  const mesh = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 1.35;
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const wobble = i % 2 === 0 ? r : r * 0.92;
      const x = Math.cos(a) * wobble;
      const y = Math.sin(a) * wobble;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 3,
      curveSegments: 24,
    });
  }, []);

  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.12;
  });

  return (
    <mesh ref={mesh} geometry={geo} position={[0, 0.15, -4]}>
      <meshStandardMaterial color="#C9A24B" metalness={0.9} roughness={0.2} emissive="#3a2a0a" emissiveIntensity={0.15} />
    </mesh>
  );
}

/** One-shot: gold dust falls in from above and settles into a loose cloud
 *  the first time the Home hero mounts. */
function GoldDustSettle() {
  const count = 90;
  const targets = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 2 + 0.5,
        z: (Math.random() - 0.5) * 3 - 1.5,
      })),
    []
  );
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = targets[i].x;
      positions[i * 3 + 1] = targets[i].y + 6 + Math.random() * 3; // start high above
      positions[i * 3 + 2] = targets[i].z;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [targets]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#F2D98A",
        size: 0.05,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
    []
  );

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    let stillFalling = false;
    for (let i = 0; i < count; i++) {
      const cy = posAttr.getY(i);
      const ty = targets[i].y;
      if (cy - ty > 0.01) {
        stillFalling = true;
        posAttr.setY(i, cy + (ty - cy) * Math.min(1, delta * 1.6));
      }
    }
    if (stillFalling) posAttr.needsUpdate = true;
  });

  return <points ref={ref} geometry={geo} material={material} />;
}

/** Small ceremonial diya (oil lamp) centerpiece with a flickering flame
 *  glow, sitting low in the scene and slowly turning. */
function DiyaCenterpiece() {
  const group = useRef<THREE.Group>(null);
  const flame = useRef<THREE.PointLight>(null);
  const bowlGeo = useMemo(() => {
    const points = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.35, 0.02),
      new THREE.Vector2(0.42, 0.12),
      new THREE.Vector2(0.3, 0.2),
      new THREE.Vector2(0.12, 0.22),
    ];
    return new THREE.LatheGeometry(points, 20);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) group.current.rotation.y = t * 0.08;
    if (flame.current) {
      flame.current.intensity = 0.6 + Math.sin(t * 9) * 0.15 + Math.sin(t * 23) * 0.08;
    }
  });

  return (
    <group ref={group} position={[-2.4, -1.6, -1]}>
      <mesh geometry={bowlGeo} castShadow>
        <meshStandardMaterial color="#C9A24B" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <coneGeometry args={[0.05, 0.16, 8]} />
        <meshBasicMaterial color="#FFDE9E" transparent opacity={0.85} />
      </mesh>
      <pointLight ref={flame} position={[0, 0.3, 0]} color="#FFB35C" intensity={0.6} distance={2.5} />
    </group>
  );
}

/** Lerps the real camera toward a target derived from route + scroll + mouse
 *  each frame, plus a brief dramatic push-in when an RSVP submit pulse fires. */
function CameraRig({ enableParallax }: { enableParallax: boolean }) {
  const { camera } = useThree();
  const location = useLocation();
  const target = useRef(new THREE.Vector3(0, 0.1, 8));
  const currentFov = useRef(45);

  useFrame((_, delta) => {
    const routeTarget = getRouteTarget(location.pathname);
    const scroll = sceneInput.scrollProgress;

    let pulseZ = 0;
    if (sceneInput.submitPulseAt !== null) {
      const elapsed = (performance.now() - sceneInput.submitPulseAt) / 1000;
      const duration = 1.4;
      if (elapsed < duration) {
        const p = elapsed / duration;
        // quick push in, then ease back — a simple bell-shaped curve.
        pulseZ = -Math.sin(p * Math.PI) * 1.2;
      } else {
        sceneInput.submitPulseAt = null;
      }
    }

    const tx =
      routeTarget.pos[0] + (enableParallax ? sceneInput.mouseX * 0.35 : 0);
    const ty =
      routeTarget.pos[1] -
      scroll * 1.1 +
      (enableParallax ? -sceneInput.mouseY * 0.2 : 0);
    const tz = routeTarget.pos[2] - scroll * 0.7 + pulseZ;

    target.current.set(tx, ty, tz);

    const smoothing = 1 - Math.pow(0.0001, delta);
    camera.position.lerp(target.current, smoothing);
    camera.lookAt(0, -scroll * 0.4, 0);

    if (camera instanceof THREE.PerspectiveCamera) {
      currentFov.current += (routeTarget.fov - currentFov.current) * smoothing;
      camera.fov = currentFov.current;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

interface AmbientSceneProps {
  reducedMotion: boolean;
  lowPower: boolean;
}

export default function AmbientScene({ reducedMotion, lowPower }: AmbientSceneProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const particleCount = lowPower ? 70 : 160;
  const dpr = lowPower ? 1 : Math.min(window.devicePixelRatio, 2);

  return (
    <Canvas
      className="ambient-3d-canvas"
      dpr={dpr}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: "low-power" }}
      shadows={!lowPower}
      camera={{ position: [0, 0.1, 8], fov: 45, near: 0.1, far: 40 }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <ambientLight intensity={0.35} color="#fbf2df" />
      <directionalLight
        position={[4, 6, 4]}
        intensity={0.9}
        color="#f4d896"
        castShadow={!lowPower}
        shadow-mapSize-width={lowPower ? 512 : 1024}
        shadow-mapSize-height={lowPower ? 512 : 1024}
      />
      <pointLight position={[-5, -2, 2]} intensity={0.25} color="#7a1930" />

      <GoldParticles count={particleCount} interactive={!lowPower && !reducedMotion} />
      {!lowPower && <GoldParticles count={Math.round(particleCount * 0.5)} reflection />}
      {!lowPower && <FloatingRings />}
      {!lowPower && <GroundPlane />}
      {!lowPower && <DiyaCenterpiece />}

      {isHome && !lowPower && <MarigoldRing />}
      {isHome && !lowPower && <GoldMedallion />}
      {isHome && !reducedMotion && <GoldDustSettle />}

      {!reducedMotion && <CameraRig enableParallax={!lowPower} />}
    </Canvas>
  );
}
