import { useEffect, useRef, useState, ReactNode } from "react";

interface ScratchCardProps {
  width?: number;
  height?: number;
  revealThreshold?: number; // 0–1, fraction scratched before auto-clearing
  promptText: string;
  fill?: boolean; // true = content fills the card edge-to-edge (e.g. an image)
  onRevealed?: () => void;
  children: ReactNode;
}

/**
 * Canvas-based scratch-off card. Draws a gold-foil layer with a light
 * dot texture, then lets the guest scratch it away with mouse or touch
 * (destination-out compositing). Once enough of the foil is cleared, the
 * whole layer fades out to reveal the content underneath.
 */
export default function ScratchCard({
  width = 360,
  height = 220,
  revealThreshold = 0.5,
  promptText,
  fill = false,
  onRevealed,
  children,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isScratching = useRef(false);
  const hasFiredReveal = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas resolution to its rendered CSS size for crisp scratching.
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;

    // Gold foil base.
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#E4C97A");
    gradient.addColorStop(0.5, "#C9A24B");
    gradient.addColorStop(1, "#9C7C31");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Light decorative dot lattice, like foil texture.
    ctx.fillStyle = "rgba(122,25,48,0.12)";
    for (let x = 8; x < w; x += 18) {
      for (let y = 8; y < h; y += 18) {
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Prompt text + a small scratch icon.
    ctx.fillStyle = "#7A1930";
    ctx.font = `600 ${fill ? 12 : 15}px Poppins, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(promptText, w / 2, h / 2 + (fill ? 10 : 14));
    ctx.font = `${fill ? 22 : 32}px serif`;
    ctx.fillText("✦", w / 2, h / 2 - (fill ? 14 : 20));

    const getPos = (e: MouseEvent | TouchEvent) => {
      const bounds = canvas.getBoundingClientRect();
      const point = "touches" in e ? e.touches[0] : e;
      return {
        x: point.clientX - bounds.left,
        y: point.clientY - bounds.top,
      };
    };

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, fill ? 16 : 22, 0, Math.PI * 2);
      ctx.fill();
    };

    const computeCleared = () => {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      const total = data.length / 4;
      for (let i = 3; i < data.length; i += 4 * 37) {
        // sample every 37th pixel for performance
        if (data[i] < 40) cleared++;
      }
      return cleared / (total / 37);
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
      isScratching.current = true;
      const { x, y } = getPos(e);
      scratch(x, y);
    };
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isScratching.current) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      scratch(x, y);
    };
    const handleEnd = () => {
      if (!isScratching.current) return;
      isScratching.current = false;
      if (computeCleared() > revealThreshold) {
        setFading(true);
        if (!hasFiredReveal.current) {
          hasFiredReveal.current = true;
          onRevealed?.();
        }
        setTimeout(() => setRevealed(true), 650);
      }
    };

    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("touchstart", handleStart, { passive: true });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    canvas.addEventListener("touchend", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleMove);
      canvas.removeEventListener("touchend", handleEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${
        fill ? "w-full h-full" : "mx-auto rounded-2xl border-2 border-gold shadow-lg"
      }`}
      style={fill ? undefined : { width: "100%", maxWidth: width, height }}
    >
      <div
        className={
          fill
            ? "absolute inset-0"
            : "absolute inset-0 flex items-center justify-center bg-white px-6 text-center"
        }
      >
        {children}
      </div>
      {!revealed && (
        <>
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full touch-none select-none transition-opacity duration-[650ms] ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          />
          {/* Diagonal shimmer sweep over the foil — decorative only,
              pointer-events disabled so it never blocks scratching. */}
          <div
            className={`scratch-foil-shimmer absolute inset-0 pointer-events-none transition-opacity duration-[650ms] ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          />
        </>
      )}
    </div>
  );
}
