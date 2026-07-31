import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

function makeDigitTexture(value: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 160;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#7A1930";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#C9A24B";
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
  ctx.fillStyle = "#E4C97A";
  ctx.font = "700 92px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, canvas.width / 2, canvas.height / 2 + 6);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function FlipDigit({ value, index }: { value: number; index: number }) {
  const display = String(value).padStart(2, "0");
  const group = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const prevValue = useRef(display);
  const texture = useRef(makeDigitTexture(display));
  const pendingValue = useRef(display);

  useEffect(() => {
    if (display === prevValue.current) return;
    pendingValue.current = display;
    const g = group.current;
    if (!g) {
      prevValue.current = display;
      return;
    }
    gsap.killTweensOf(g.rotation);
    gsap.to(g.rotation, {
      x: Math.PI,
      duration: 0.55,
      ease: "power2.inOut",
      onUpdate: function () {
        // swap the texture at the halfway point, like a real flip card
        if (g.rotation.x > Math.PI / 2 && prevValue.current !== pendingValue.current) {
          texture.current = makeDigitTexture(pendingValue.current);
          if (meshRef.current) {
            (meshRef.current.material as THREE.MeshBasicMaterial).map = texture.current;
            (meshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
          }
          prevValue.current = pendingValue.current;
        }
      },
      onComplete: () => {
        g.rotation.x = 0;
      },
    });
  }, [display]);

  return (
    <group ref={group} position={[index * 1.35 - 2.0, 0, 0]}>
      {/* thin gold ring accent around the digit card */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.72, 0.02, 8, 40]} />
        <meshStandardMaterial color="#C9A24B" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh ref={meshRef}>
        <planeGeometry args={[1, 1.2]} />
        <meshBasicMaterial map={texture.current} toneMapped={false} />
      </mesh>
    </group>
  );
}

interface CountdownDigits3DProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Renders all four flip-digit groups in a single shared WebGL canvas
 *  (cheaper than four separate contexts). Purely additive — Countdown.tsx
 *  keeps its plain HTML numbers as a fallback for unsupported/reduced-motion cases. */
export default function CountdownDigits3D({ days, hours, minutes, seconds }: CountdownDigits3DProps) {
  const values = useMemo(
    () => [
      Math.min(days, 99),
      hours,
      minutes,
      seconds,
    ],
    [days, hours, minutes, seconds]
  );

  return (
    <Canvas
      className="countdown-3d-canvas"
      dpr={Math.min(window.devicePixelRatio, 2)}
      camera={{ position: [0, 0, 5], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 3, 4]} intensity={0.8} color="#f4d896" />
      {values.map((v, i) => (
        <FlipDigit key={i} value={v} index={i} />
      ))}
      <SpinKeepAlive />
    </Canvas>
  );
}

/** Keeps the render loop ticking smoothly even between digit changes
 *  (R3F defaults to continuous rendering, this is just a no-op frame hook
 *  kept explicit for clarity/future tuning). */
function SpinKeepAlive() {
  useFrame(() => {});
  return null;
}
