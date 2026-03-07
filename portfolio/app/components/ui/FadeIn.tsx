"use client";

import { useInView } from "@/app/hooks/useInView";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  /** Delay in ms before the animation starts */
  delay?: number;
  className?: string;
  threshold?: number;
}

export default function FadeIn({
  children,
  delay = 0,
  className = "",
  threshold,
}: FadeInProps) {
  const { ref, inView } = useInView(threshold);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.85s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms,
                     transform 0.85s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
