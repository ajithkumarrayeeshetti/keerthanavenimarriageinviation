export type EventIconShape = "ring" | "flower" | "star" | "diya" | "sparkle";

/** Maps a ceremony's English name to a stand-in 3D icon shape — no
 *  weddingConfig schema changes required, just simple keyword matching.
 *  Kept dependency-free (no three.js imports) so pages can import this
 *  statically without pulling the 3D renderer into the main bundle. */
export function shapeForEventName(nameEn: string): EventIconShape {
  const n = nameEn.toLowerCase();
  if (n.includes("ring") || n.includes("wedding")) return "ring";
  if (n.includes("baraat") || n.includes("varapooja") || n.includes("engagement")) return "star";
  if (n.includes("reception")) return "sparkle";
  if (n.includes("haldi") || n.includes("pasupu") || n.includes("mangala") || n.includes("sangeet") || n.includes("mehndi")) return "flower";
  return "diya";
}
