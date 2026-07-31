/**
 * Cheap, synchronous WebGL support check. Used to decide whether to mount
 * any Three.js canvas at all — if this returns false, the site falls back
 * to being exactly what it was before (no 3D layer, nothing else changes).
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

/** Rough device-capability heuristic used to scale particle counts / DPR down. */
export function isLowPowerDevice(): boolean {
  if (typeof window === "undefined") return false;
  const smallScreen = window.innerWidth < 768;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const lowCores =
    typeof navigator !== "undefined" &&
    "hardwareConcurrency" in navigator &&
    navigator.hardwareConcurrency > 0 &&
    navigator.hardwareConcurrency <= 4;
  return smallScreen || (coarsePointer && lowCores);
}
