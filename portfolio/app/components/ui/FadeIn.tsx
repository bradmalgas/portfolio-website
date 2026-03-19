"use client";

import { useInView } from "@/app/hooks/useInView";
import { ReactNode, useEffect, useState } from "react";

interface FadeInProps {
  children: ReactNode;
  /** Delay in ms before the animation starts */
  delay?: number;
  className?: string;
  threshold?: number;
  eager?: boolean;
}

export default function FadeIn({
  children,
  delay = 0,
  className = "",
  threshold,
  eager = false,
}: FadeInProps) {
  const { ref, inView } = useInView(threshold);
  const [eagerVisible, setEagerVisible] = useState(false);

  useEffect(() => {
    if (!eager) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setEagerVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [eager]);

  const isVisible = eager ? eagerVisible : inView;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.85s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms,
                     transform 0.85s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
