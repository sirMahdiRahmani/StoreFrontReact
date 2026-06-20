import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms — used for grids so items cascade in. */
  delay?: number;
  className?: string;
  /** Render as a different element (default div). */
  as?: "div" | "section" | "li";
}

/**
 * Fades + lifts its children into view the first time they enter the viewport.
 * Once revealed it stays revealed (no replay on scroll-up). Reduced-motion is
 * handled by the global transition-duration override.
 */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <Tag
      ref={ref as never}
      data-visible={visible}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`scroll-reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
