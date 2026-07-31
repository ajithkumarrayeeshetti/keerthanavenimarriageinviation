import { useEffect, useRef, useState, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  as?: "div" | "section";
}

/**
 * Wraps content in a scroll-triggered fade + slide-up reveal, using
 * IntersectionObserver so animations fire as the guest scrolls down the
 * page (not just once on initial mount). Respects prefers-reduced-motion
 * via the .reveal CSS rules in index.css.
 */
export default function Reveal({
  children,
  delayMs = 0,
  className = "",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </Tag>
  );
}
