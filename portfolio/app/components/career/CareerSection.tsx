"use client";

import { useState } from "react";
import FadeIn from "../ui/FadeIn";

// ── Helpers ───────────────────────────────────────────────────────────

function formatDateRange(start: Date, end?: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  return `${fmt(start)} – ${end ? fmt(end) : "Present"}`;
}

// ── Data ──────────────────────────────────────────────────────────────

const experience = [
  {
    id: "secret-sauce",
    title: "Senior Software Developer",
    company: "Secret Sauce",
    startDate: new Date(2025, 3), // April 2025
    summary:
      "At Secret Sauce, my work is split between internal tooling and external client delivery. Externally, I've been responsible for designing and running a new Investec Product Enablement platform. Internally, I've focused on reusable pipeline templates and containerization patterns. This role reflects my step-up into senior responsibilities across infrastructure, security, and operational ownership.",
    responsibilities: [
      "Designed and delivered Azure infrastructure using Bicep with bicepparam files for environment-specific configuration",
      "Set up Azure DevOps pipelines for infrastructure validation, infrastructure deployment, and container image deployments to Azure Container Apps",
      "Implemented VNet/subnet topology and NSG rules; ensured all applications were VNet-integrated and compliant with restricted inbound access",
      "Drove operational excellence by checking deployment and application logs, writing Log Analytics (KQL) queries, and resolving issues across infra and app layers",
      "Authored internal reusable pipeline templates to orchestrate dependent runs",
    ],
  },
  {
    id: "altron",
    title: "Specialist: Software Development",
    company: "Altron Security",
    startDate: new Date(2024, 3), // April 2024
    endDate: new Date(2025, 2),   // March 2025
    summary:
      "I worked across C# development, digital signing solutions, and customer integrations for our SaaS document workflow and signing platform. I collaborated with both local and UK-based teams to deliver reliable integrations and strong client outcomes.",
    responsibilities: [
      "Collaborated with customers to implement API-based document signing workflows and integrations",
      "Led technical meetings and provided ongoing support for SaaS integrations and pre-sales engagements",
      "Developed backend C# APIs to enhance functionality and performance",
      "Coordinated with international teams to improve product offerings and ensure cross-border alignment",
    ],
  },
  {
    id: "investec",
    title: "Software Developer",
    company: "Investec",
    startDate: new Date(2021, 0), // January 2021
    endDate: new Date(2024, 2),   // March 2024
    summary:
      "Over three years at Investec, I developed backend C# APIs, designed CI/CD pipelines, and provisioned Azure infrastructure using infrastructure-as-code. Working within a cross-functional team of in-house developers, contractors, and business analysts, I took on broad ownership across the full delivery lifecycle — from backlog refinement and code review to deployment and beyond.",
    responsibilities: [
      "Created and refined work items on Azure DevOps boards",
      "Designed CI/CD pipelines using YAML",
      "Reviewed code and PRs to maintain quality and consistency",
      "Configured and deployed Azure resources using infrastructure-as-code",
      "Wrote backend C# Web API endpoints for new and existing features",
    ],
  },
];

const education = [
  {
    degree: "Computer Science (Honours)",
    university: "University of Cape Town",
    graduated: 2021,
  },
  {
    degree: "BSc. Computer Science & Business Computing",
    university: "University of Cape Town",
    graduated: 2020,
  },
];

const certifications = [
  {
    name: "Power Platform Fundamentals",
    url: "https://learn.microsoft.com/api/credentials/share/en-us/BradMalgas/7F68CA14266A9A60",
  },
  {
    name: "Azure Data Fundamentals",
    url: "https://learn.microsoft.com/api/credentials/share/en-us/BradMalgas/20498A08EBF7967E",
  },
  {
    name: "Security, Compliance, and Identity Fundamentals",
    url: "https://learn.microsoft.com/api/credentials/share/en-us/BradMalgas/47BEBDC317FB654D",
  },
  {
    name: "Azure AI Fundamentals",
    url: "https://learn.microsoft.com/api/credentials/share/en-us/BradMalgas/B38CA4FD094B46BC",
  },
  {
    name: "Azure Fundamentals",
    url: "https://learn.microsoft.com/api/credentials/share/en-us/BradMalgas/29B2C8CB53312884",
  },
];

// ── Sub-components ────────────────────────────────────────────────────

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 flex-shrink-0 transition-transform duration-250 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 flex-shrink-0 text-ink-tertiary group-hover:text-accent transition-colors duration-200"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-accent flex-shrink-0"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function TimelineEntry({
  entry,
  isLast,
}: {
  entry: (typeof experience)[0];
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex gap-6 sm:gap-8">
      {/* Timeline spine + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="mt-1 h-3 w-3 rounded-full bg-accent ring-4 ring-accent/20 flex-shrink-0" />
        {!isLast && <div className="mt-1 flex-1 w-px bg-border min-h-8" />}
      </div>

      {/* Content */}
      <div className={`pb-10 flex-1 min-w-0 ${isLast ? "" : ""}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
          <div>
            <h3 className="font-semibold text-ink text-base sm:text-lg leading-snug">
              {entry.title}
            </h3>
            <p className="text-accent text-sm font-medium mt-0.5">
              {entry.company}
            </p>
          </div>
          <span className="text-sm text-ink-secondary italic whitespace-nowrap mt-0.5 sm:mt-1 flex-shrink-0">
            {formatDateRange(entry.startDate, entry.endDate)}
          </span>
        </div>

        {/* Summary */}
        <p className="mt-3 text-body text-ink-secondary leading-relaxed">
          {entry.summary}
        </p>

        {/* Accordion */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-4 flex items-center gap-2 text-xs font-medium text-ink-secondary
                     hover:text-ink border border-border hover:border-accent/40
                     rounded-lg px-3 py-2.5 min-h-[44px] transition-all duration-200 group"
          aria-expanded={open}
        >
          <ChevronIcon open={open} />
          <span>{open ? "Hide" : "View"} responsibilities</span>
        </button>

        {open && (
          <ul className="mt-3 space-y-2 pl-1">
            {entry.responsibilities.map((item, i) => (
              <li key={i} className="flex gap-3 text-body text-ink-secondary">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent/60 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────

export default function CareerSection() {
  return (
    <section
      id="career"
      className="section-padding"
      style={{ background: "linear-gradient(to bottom, var(--color-surface) 0%, var(--color-background) 30%, var(--color-surface) 80%)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Experience ──────────────────────────────────────────── */}
        <span className="eyebrow">Experience</span>
        <h2 className="text-h2 font-semibold text-ink mt-2">
          Where I&apos;ve Worked
        </h2>
        <span className="section-rule" />

        <div className="mt-10">
          {experience.map((entry, i) => (
            <FadeIn key={entry.id} delay={i * 80}>
              <TimelineEntry
                entry={entry}
                isLast={i === experience.length - 1}
              />
            </FadeIn>
          ))}
        </div>

        {/* ── Education ───────────────────────────────────────────── */}
        <div className="mt-16">
          <span className="eyebrow">Education</span>
          <h2 className="text-h2 font-semibold text-ink mt-2">
            Academic Background
          </h2>
          <span className="section-rule" />

          <FadeIn delay={50} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {education.map(({ degree, university, graduated }) => (
              <div
                key={degree}
                className="card p-5 flex flex-col gap-1"
              >
                <p className="font-semibold text-ink text-base leading-snug">
                  {degree}
                </p>
                <p className="text-accent text-sm font-medium mt-0.5">{university}</p>
                <p className="text-ink-secondary text-xs mt-0.5 italic">Graduated {graduated}</p>
              </div>
            ))}
          </FadeIn>
        </div>

        {/* ── Certifications ──────────────────────────────────────── */}
        <div className="mt-16">
          <span className="eyebrow">Certifications</span>
          <h2 className="text-h2 font-semibold text-ink mt-2">
            Microsoft Certified
          </h2>
          <span className="section-rule" />

          <FadeIn delay={50} className="mt-8 flex flex-wrap gap-3">
            {certifications.map((cert) => (
              <a
                key={cert.name}
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View credential: ${cert.name}`}
                className="group card px-4 py-3 flex items-start gap-3 w-full sm:w-auto
                           hover:border-accent/40 hover:shadow-glow transition-all duration-250"
              >
                <ShieldIcon />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink leading-snug group-hover:text-accent transition-colors duration-200">
                    {cert.name}
                  </p>
                  <p className="text-xs text-ink-secondary mt-0.5">Microsoft</p>
                </div>
                <ExternalLinkIcon />
              </a>
            ))}
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
