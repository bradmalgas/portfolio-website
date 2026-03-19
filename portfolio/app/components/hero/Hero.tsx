"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const CV_URL =
  "https://storageazureblogify.blob.core.windows.net/files/Bradley-Malgas-Resume.pdf";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const handleScroll = () => {
      lastScrollYRef.current = window.scrollY;

      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;

        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${lastScrollYRef.current * 0.18}px)`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{ top: "-10%", height: "120%" }}
        >
          <Image
            src="/images/hero-background-image.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgb(var(--color-background-rgb) / 0.94) 0%, rgb(var(--color-background-rgb) / 0.82) 45%, rgb(var(--color-background-rgb) / 0.72) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[42%] border-l backdrop-blur-[2px]"
          style={{
            borderColor: "rgb(var(--color-ink-rgb) / 0.08)",
            background:
              "linear-gradient(180deg, rgb(var(--color-accent-rgb) / 0.08) 0%, rgb(var(--color-accent-rgb) / 0.02) 100%)",
          }}
        />
        <div className="pointer-events-none absolute left-[8%] top-[14%] h-40 w-40 rounded-full bg-accent/10 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-end gap-14 px-6 py-24 lg:grid-cols-[minmax(0,1fr)_18rem] lg:py-32">
        <div className="hero-content-1 max-w-3xl">
          <div className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-surface/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent shadow-inner-highlight backdrop-blur">
            <span>Cape Town</span>
            <span className="h-1 w-1 rounded-full bg-accent/70" />
            <span>Cloud Systems</span>
            <span className="h-1 w-1 rounded-full bg-accent/70" />
            <span>Delivery-Led Engineering</span>
          </div>

          <h1 className="display-heading mt-7 text-[3.45rem] sm:text-[4.4rem] lg:text-[6rem]">
            Brad Malgas, Senior Software Developer
          </h1>

          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-ink-secondary sm:text-2xl">
            Senior software developer designing Azure platforms, backend systems,
            and delivery workflows that are calm under pressure.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-body-sm text-ink-secondary hero-content-2">
            <span className="tag">Azure architecture</span>
            <span className="tag">C# / .NET</span>
            <span className="tag">Infrastructure as code</span>
            <span className="tag">Operational ownership</span>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 hero-content-3">
            <a href="#projects" className="btn-accent px-6 py-3 text-sm">
              View My Work
            </a>
            <a
              href={CV_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost px-6 py-3 text-sm"
            >
              Download CV
            </a>
          </div>
        </div>

        <div className="hero-content-2 hidden lg:block">
          <div className="section-shell p-6">
            <p className="text-label font-semibold uppercase tracking-[0.18em] text-accent">
              Focus
            </p>
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm text-ink-tertiary">Currently building</p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  Cloud-native platforms with security and operational depth
                </p>
              </div>
              <div>
                <p className="text-sm text-ink-tertiary">Bias</p>
                <p className="mt-1 text-lg font-semibold text-ink">
                  Practical architecture over trend-chasing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
