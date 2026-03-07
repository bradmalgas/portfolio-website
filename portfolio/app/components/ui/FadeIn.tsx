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
        transform: inView ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms,
                     transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
