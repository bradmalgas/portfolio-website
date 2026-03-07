"use client";

import Image from "next/image";

const CV_URL =
  "https://storageazureblogify.blob.core.windows.net/files/Bradley Malgas Resume.pdf";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden"
    >
      {/* Background image + overlays */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-background-image.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark wash */}
        <div className="absolute inset-0 bg-background/80" />
        {/* Indigo orb — top right */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px] pointer-events-none" />
        {/* Subtle bottom fade into page bg */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">

          {/* ── Text content ─────────────────────────────────────── */}
          <div className="flex-1 text-center lg:text-left hero-content-1">
            <span className="eyebrow">Software Developer</span>

            <h1 className="mt-4 font-bold text-ink leading-[1.05] tracking-[-0.03em]
                           text-[2.75rem] sm:text-[3.5rem] lg:text-[4.5rem]">
              Brad Malgas
            </h1>

            <p className="mt-2 text-lg sm:text-xl text-accent font-medium tracking-tight">
              Senior Developer · Azure · C# · .NET
            </p>

            <p className="mt-5 text-body-lg text-ink-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
              I build cloud-native systems on Microsoft Azure — specialising in
              C#/.NET, infrastructure as code, and backend API architecture.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start hero-content-2">
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

          {/* ── Profile photo ────────────────────────────────────── */}
          <div className="flex-shrink-0 hero-content-3">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden
                            ring-1 ring-border shadow-xl shadow-black/40">
              {/* Accent corner glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/30 via-transparent to-transparent z-10 pointer-events-none" />
              <Image
                src="/brad-profile-pic.jpeg"
                alt="Brad Malgas"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
