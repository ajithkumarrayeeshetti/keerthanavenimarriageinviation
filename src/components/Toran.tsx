/**
 * Toran / bandhanwar — the floral garland traditionally hung across a
 * doorway for auspicious occasions. Rendered as a single SVG spanning the
 * full width above the door seam: a drooping strand with alternating
 * marigold flowers and mango-leaf motifs, plus tassels hanging from the
 * two outer corners (like it's tied to a gateway frame).
 */
export default function Toran() {
  const width = 900;
  const height = 130;
  const points = 15;

  const flowers = Array.from({ length: points }).map((_, i) => {
    const t = i / (points - 1);
    const x = t * width;
    // gentle double-swag droop (two arcs meeting near center)
    const local = t < 0.5 ? t / 0.5 : (1 - t) / 0.5;
    const y = 18 + Math.sin(local * Math.PI * 0.5) * 46;
    return { x, y, isFlower: i % 2 === 0 };
  });

  const path = flowers
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="toran-svg"
      aria-hidden="true"
    >
      {/* hanging cord */}
      <path
        d={path}
        fill="none"
        stroke="#5C7A3A"
        strokeWidth="3"
        opacity="0.9"
      />

      {flowers.map((p, i) => (
        <g key={i} transform={`translate(${p.x},${p.y})`}>
          {p.isFlower ? (
            <>
              {/* marigold: ring of petals + center */}
              {Array.from({ length: 8 }).map((_, k) => {
                const angle = (k / 8) * Math.PI * 2;
                return (
                  <ellipse
                    key={k}
                    cx={Math.cos(angle) * 7}
                    cy={Math.sin(angle) * 7}
                    rx="5.5"
                    ry="3.2"
                    fill={k % 2 === 0 ? "#E4762B" : "#F2A93B"}
                    transform={`rotate(${(angle * 180) / Math.PI} ${
                      Math.cos(angle) * 7
                    } ${Math.sin(angle) * 7})`}
                  />
                );
              })}
              <circle r="4.5" fill="#C9A24B" />
            </>
          ) : (
            // mango leaf pair
            <>
              <path
                d="M0,0 C-10,-4 -16,4 -20,0 C-16,-4 -10,-4 0,0 Z"
                fill="#5C7A3A"
              />
              <path
                d="M0,0 C10,-4 16,4 20,0 C16,-4 10,-4 0,0 Z"
                fill="#6E8E45"
              />
            </>
          )}
        </g>
      ))}

      {/* short tassels at each end, as if tied off */}
      {[0, width].map((x, i) => (
        <g key={`tassel-${i}`} transform={`translate(${x},${flowers[i === 0 ? 0 : points - 1].y})`}>
          <line x1="0" y1="0" x2="0" y2="26" stroke="#C9A24B" strokeWidth="2" />
          <circle cx="0" cy="30" r="4" fill="#E4762B" />
        </g>
      ))}
    </svg>
  );
}
