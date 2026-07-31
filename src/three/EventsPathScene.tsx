import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function WindingPath() {
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.6, 3.2, 0),
      new THREE.Vector3(0.5, 1.8, -0.3),
      new THREE.Vector3(-0.4, 0.4, 0.2),
      new THREE.Vector3(0.5, -1.0, -0.3),
      new THREE.Vector3(-0.5, -2.4, 0.2),
      new THREE.Vector3(0.3, -3.6, 0),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const geo = useMemo(() => new THREE.TubeGeometry(curve, 80, 0.035, 8, false), [curve]);

  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color="#C9A24B" metalness={0.75} roughness={0.3} emissive="#4a3410" emissiveIntensity={0.2} />
    </mesh>
  );
}

function Diya({ position }: { position: [number, number, number] }) {
  const flame = useRef<THREE.PointLight>(null);
  const bowl = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0.16, 0.01),
          new THREE.Vector2(0.19, 0.05),
          new THREE.Vector2(0.13, 0.09),
          new THREE.Vector2(0.05, 0.1),
        ],
        14
      ),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (flame.current) {
      flame.current.intensity = 0.5 + Math.sin(t * 8 + position[1]) * 0.15 + Math.sin(t * 21) * 0.06;
    }
  });

  return (
    <group position={position}>
      <mesh geometry={bowl}>
        <meshStandardMaterial color="#C9A24B" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <coneGeometry args={[0.025, 0.08, 8]} />
        <meshBasicMaterial color="#FFDE9E" />
      </mesh>
      <pointLight ref={flame} position={[0, 0.16, 0]} color="#FFB35C" intensity={0.5} distance={1.4} />
    </group>
  );
}

function BreathingGroup() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.08;
    }
  });
  return (
    <group ref={ref}>
      <WindingPath />
      <Diya position={[-0.55, 3.15, 0.05]} />
      <Diya position={[-0.35, 0.45, 0.25]} />
      <Diya position={[-0.45, -2.35, 0.25]} />
      <Diya position={[0.3, -3.55, 0.05]} />
    </group>
  );
}

/** Small decorative canvas meant to sit beside/behind the Events page
 *  ceremony list — a stylized "thread" connecting the ceremonies, not a
 *  pixel-precise trace of each card's position. */
export default function EventsPathScene() {
  return (
    <Canvas
      className="events-path-3d-canvas"
      dpr={Math.min(window.devicePixelRatio, 2)}
      camera={{ position: [1.6, 0, 3.2], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 2, 3]} intensity={0.7} color="#f4d896" />
      <BreathingGroup />
    </Canvas>
  );
}
