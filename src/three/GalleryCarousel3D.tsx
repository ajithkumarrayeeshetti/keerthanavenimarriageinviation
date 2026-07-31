import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

function Photo({
  url,
  angle,
  radius,
}: {
  url: string;
  angle: number;
  radius: number;
}) {
  const texture = useLoader(THREE.TextureLoader, url);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (mesh.current) {
      // always face roughly toward the camera/center
      mesh.current.lookAt(0, mesh.current.position.y, radius + 3);
    }
  });

  return (
    <mesh
      ref={mesh}
      position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]}
      castShadow
    >
      <planeGeometry args={[1.5, 1.05]} />
      <meshStandardMaterial map={texture} roughness={0.6} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[14, 14]} />
      <shadowMaterial opacity={0.25} />
    </mesh>
  );
}

function CarouselGroup({ images }: { images: string[] }) {
  const group = useRef<THREE.Group>(null);
  const rotation = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    if (!dragging.current) {
      // gentle auto-rotate when idle
      velocity.current += (0.12 - velocity.current) * 0.02;
    }
    rotation.current += velocity.current * delta;
    group.current.rotation.y = rotation.current;
  });

  const radius = 2.6;
  const step = (Math.PI * 2) / images.length;

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        dragging.current = true;
        lastX.current = e.clientX;
        velocity.current = 0;
        (e.target as Element).setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        const dx = e.clientX - lastX.current;
        lastX.current = e.clientX;
        rotation.current += dx * 0.005;
        velocity.current = dx * 0.02;
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      {images.map((url, i) => (
        <Photo key={url} url={url} angle={i * step} radius={radius} />
      ))}
      <Floor />
    </group>
  );
}

interface GalleryCarousel3DProps {
  images: string[];
}

/** Drag-to-rotate 3D photo carousel. Errors from missing/broken image
 *  files are caught by the parent SceneErrorBoundary-style usage at the
 *  call site (Gallery.tsx wraps this in Suspense + its own try/catch via
 *  React error boundary is handled the same way the ambient scene is). */
export default function GalleryCarousel3D({ images }: GalleryCarousel3DProps) {
  const [ready, setReady] = useState(false);
  const memoImages = useMemo(() => images, [images]);

  return (
    <Canvas
      className="gallery-carousel-3d-canvas"
      dpr={Math.min(window.devicePixelRatio, 2)}
      shadows
      camera={{ position: [0, 0.6, 5.2], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => setReady(true)}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 4]} intensity={0.8} color="#f4d896" castShadow />
      {ready && <CarouselGroup images={memoImages} />}
    </Canvas>
  );
}
