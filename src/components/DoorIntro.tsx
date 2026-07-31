import { useEffect, useState } from "react";
import { weddingConfig } from "../weddingConfig";
import Toran from "./Toran";

interface DoorIntroProps {
  // Called once the doors have fully cleared, so the parent can unmount this component.
  onComplete: () => void;
}

type Phase = "closed" | "rumble" | "open";

/**
 * Grand palace-gate reveal — heavy carved double doors with brass ring
 * handles, a floral toran (door-hanging garland) draped across the seam,
 * and a stone gateway arch framing the whole thing. Sequence:
 *   closed -> brief rumble (doors shudder, like heavy stone grinding)
 *   -> swing open with a burst of gold light through the widening gap.
 * - State only (no persisted storage), so it replays on a fresh page load
 *   but never mid-session.
 * - Dependency-free: pure CSS transitions/keyframes, no animation library.
 */
export default function DoorIntro({ onComplete }: DoorIntroProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const rumbleTimer = setTimeout(() => setPhase("rumble"), 900);
    return () => clearTimeout(rumbleTimer);
  }, []);

  useEffect(() => {
    if (phase !== "rumble") return;
    const openTimer = setTimeout(() => setPhase("open"), 500);
    return () => clearTimeout(openTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "open") return;
    // Doors take ~1.6s to swing fully clear (see .door-panel transition duration).
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      onComplete();
    }, 1700);
    return () => clearTimeout(unmountTimer);
  }, [phase, onComplete]);

  if (!mounted) return null;

  const skip = () => setPhase("rumble");
  const wrapperClass = `door-stage ${
    phase === "open" ? "door-open" : phase === "rumble" ? "door-rumble" : ""
  }`;

  return (
    <div className={wrapperClass}>
      <div className="door-backdrop" />

      {/* stone gateway arch framing the doors */}
      <div className="gateway-arch" aria-hidden="true" />

      {/* light bursting through the seam as the gate opens */}
      <div className="light-burst" aria-hidden="true" />

      <div className="toran-wrap" aria-hidden="true">
        <Toran />
      </div>

      <button
        aria-label="Open invitation"
        onClick={skip}
        className="door-panel door-panel-left"
      >
        <DoorFace side="left" />
      </button>

      <button
        aria-label="Open invitation"
        onClick={skip}
        className="door-panel door-panel-right"
      >
        <DoorFace side="right" />
      </button>

      {phase === "closed" && (
        <p className="door-hint absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-[110] text-gold-light text-xs sm:text-sm tracking-[0.3em] font-body uppercase">
          Tap to open ✦ తెరవడానికి నొక్కండి
        </p>
      )}
    </div>
  );
}

function DoorFace({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div className="door-face">
      {/* wood-grain streaks */}
      <div className="door-wood-grain" />

      {/* Layered carved-border frame */}
      <svg
        viewBox="0 0 200 400"
        className="door-frame-svg"
        preserveAspectRatio="none"
      >
        <rect x="6" y="6" width="188" height="388" fill="none" stroke="#8A6B2A" strokeWidth="3" opacity="0.8" />
        <rect x="14" y="14" width="172" height="372" fill="none" stroke="#C9A24B" strokeWidth="2" />
        <rect x="24" y="24" width="152" height="352" fill="none" stroke="#E4C97A" strokeWidth="1" opacity="0.6" />
        {/* corner florets */}
        {[
          [24, 24],
          [176, 24],
          [24, 376],
          [176, 376],
        ].map(([cx, cy], idx) => (
          <g key={idx} transform={`translate(${cx},${cy})`}>
            <circle r="12" fill="none" stroke="#C9A24B" strokeWidth="1.4" />
            <circle r="5" fill="#C9A24B" opacity="0.85" />
          </g>
        ))}
        {/* scalloped top arch, mirrored per side */}
        <path
          d={
            isLeft
              ? "M24 100 Q64 46 100 100 Q136 46 190 24"
              : "M10 24 Q64 46 100 100 Q136 46 176 100"
          }
          fill="none"
          stroke="#C9A24B"
          strokeWidth="1.5"
          opacity="0.85"
        />
        {/* vertical vine of dots along the seam edge */}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle
            key={i}
            cx={isLeft ? 188 : 12}
            cy={44 + i * 42}
            r="2.5"
            fill="#E4C97A"
            opacity="0.7"
          />
        ))}
      </svg>

      {/* brass ring door handle, positioned near the seam like real gate hardware */}
      <div className={`door-handle ${isLeft ? "door-handle-left" : "door-handle-right"}`}>
        <svg width="40" height="56" viewBox="0 0 40 56">
          <circle cx="20" cy="18" r="13" fill="none" stroke="#E4C97A" strokeWidth="4" />
          <circle cx="20" cy="18" r="13" fill="none" stroke="#8A6B2A" strokeWidth="1.5" />
          <rect x="15" y="30" width="10" height="20" rx="3" fill="#C9A24B" stroke="#8A6B2A" strokeWidth="1" />
        </svg>
      </div>

      <div className="door-monogram">
        <svg width="76" height="76" viewBox="0 0 76 76" fill="none" className="mb-1">
          <circle cx="38" cy="38" r="35" stroke="#C9A24B" strokeWidth="1.4" />
          <circle cx="38" cy="38" r="29" stroke="#E4C97A" strokeWidth="1" opacity="0.7" />
          <circle cx="38" cy="38" r="2.5" fill="#C9A24B" />
        </svg>
        <span className="font-display italic text-3xl sm:text-4xl text-gold-light -mt-[56px] sm:-mt-[60px]">
          {isLeft ? weddingConfig.partner1[0] : weddingConfig.partner2[0]}
        </span>
        <span className="font-display text-[10px] sm:text-xs tracking-[0.4em] mt-7 sm:mt-8 uppercase text-gold/90">
          {isLeft ? "Shubh" : "Vivah"}
        </span>
      </div>
    </div>
  );
}
