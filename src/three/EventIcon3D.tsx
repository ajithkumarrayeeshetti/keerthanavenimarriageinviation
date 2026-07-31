import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EventIconShape } from "./eventShapes";
export type { EventIconShape } from "./eventShapes";

function IconMesh({ shape }: { shape: EventIconShape }) {
  const ref = useRef<THREE.Mesh | THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.6;
  });

  const goldMat = (
    <meshStandardMaterial color="#C9A24B" metalness={0.75} roughness={0.3} />
  );

  switch (shape) {
    case "ring":
      return (
        <mesh ref={ref as React.RefObject<THREE.Mesh>} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[0.5, 0.09, 12, 32]} />
          {goldMat}
        </mesh>
      );
    case "star":
      return (
        <mesh ref={ref as React.RefObject<THREE.Mesh>}>
          <icosahedronGeometry args={[0.55, 0]} />
          {goldMat}
        </mesh>
      );
    case "sparkle":
      return (
        <mesh ref={ref as React.RefObject<THREE.Mesh>}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial color="#E4C97A" metalness={0.6} roughness={0.15} emissive="#7a5b1c" emissiveIntensity={0.3} />
        </mesh>
      );
    case "diya": {
      const bowl = new THREE.LatheGeometry(
        [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(0.4, 0.03),
          new THREE.Vector2(0.48, 0.14),
          new THREE.Vector2(0.34, 0.24),
          new THREE.Vector2(0.14, 0.26),
        ],
        16
      );
      return (
        <group ref={ref as React.RefObject<THREE.Group>}>
          <mesh geometry={bowl}>{goldMat}</mesh>
          <mesh position={[0, 0.32, 0]}>
            <coneGeometry args={[0.06, 0.18, 8]} />
            <meshBasicMaterial color="#FFDE9E" />
          </mesh>
        </group>
      );
    }
    case "flower":
    default:
      return (
        <group ref={ref as React.RefObject<THREE.Group>}>
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.32, Math.sin(a) * 0.32, 0]}>
                <sphereGeometry args={[0.22, 10, 10]} />
                <meshStandardMaterial color={i % 2 === 0 ? "#E4762B" : "#F2A93B"} roughness={0.5} />
              </mesh>
            );
          })}
          <mesh>
            <sphereGeometry args={[0.16, 10, 10]} />
            <meshStandardMaterial color="#C9A24B" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      );
  }
}

export default function EventIcon3D({ shape }: { shape: EventIconShape }) {
  return (
    <Canvas
      className="event-icon-3d-canvas"
      dpr={Math.min(window.devicePixelRatio, 2)}
      camera={{ position: [0, 0, 2.2], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 3]} intensity={0.7} color="#f4d896" />
      <IconMesh shape={shape} />
    </Canvas>
  );
}
