import Image from "next/image";
import FadeIn from "../ui/FadeIn";

const CAREER_START = new Date(2021, 0); // January 2021 — Investec start date
const yearsOfExperience = Math.floor(
  (Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
);

const skills = [
    {
        category: "Core Engineering",
        items: [
            "C#",
            ".NET / ASP.NET Core",
            "REST APIs",
            "TypeScript",
            "SQL",
            "Git",
        ],
    },
    {
        category: "Cloud & Delivery",
        items: [
            "Microsoft Azure",
            "Azure DevOps",
            "Azure Functions",
            "Azure Container Apps",
            "Azure Bicep",
            "Microsoft Entra ID",
        ],
    },
    {
        category: "AI Product Workflows",
        items: [
            "LangGraph",
            "LangChain",
            "Vercel AI SDK",
            "LM Studio",
            "Whisper",
            "Tool Calling",
            "Structured Outputs",
        ],
    },
    {
        category: "Data & App Infrastructure",
        items: ["PostgreSQL", "Supabase", "Clerk", "CI/CD", "Power Automate"],
    },
];

export default function AboutSection() {
  return (
      <section
          id="about"
          className="theme-section theme-section--about section-padding"
      >
          <div className="max-w-6xl mx-auto">
              <FadeIn className="section-shell--bare flex flex-col gap-12 p-8 lg:flex-row lg:gap-20 lg:p-12 xl:p-14 items-start">
                  <div className="flex w-full flex-shrink-0 flex-col items-center gap-5 lg:w-auto lg:items-start">
                      <div className="relative h-52 w-52 overflow-hidden rounded-[2rem] border border-border sm:h-60 sm:w-60 lg:h-72 lg:w-72">
                          <div className="absolute inset-0 z-10 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-transparent pointer-events-none" />
                          <Image
                              src="/images/profile-image.png"
                              alt="Brad Malgas"
                              fill
                              className="object-cover object-center"
                              sizes="(max-width: 640px) 13rem, (max-width: 1024px) 15rem, 18rem"
                          />
                      </div>

                      <div className="text-center lg:text-left">
                          <p className="font-display text-xl font-semibold text-ink">
                              Brad Malgas
                          </p>
                          <p className="mt-1 text-body-sm text-accent">
                              Senior Software Developer
                          </p>
                      </div>
                  </div>

                  <div className="flex-1 min-w-0">
                      <span className="eyebrow">About Me</span>
                      <h2 className="section-heading mt-2">
                          Building systems with weight, clarity, and operational
                          realism.
                      </h2>
                      <span className="section-rule" />

                      <div className="space-y-4 text-body leading-relaxed text-ink-secondary">
                          <p>
                              Senior Software Developer with {yearsOfExperience}{" "}
                              years of experience across C#, .NET, Azure, API
                              integrations and product-focused backend work. I
                              started my career in banking, working on C#/.NET
                              systems, Azure infrastructure and internal product
                              workflows at Investec.
                          </p>
                          <p>
                              Since then I’ve worked across SaaS document
                              workflows, digital signing, cloud platforms and
                              AI-assisted product development. I’m now
                              independent and focused on project-based work. I
                              like building systems where the details matter:
                              financial data, access control, integrations,
                              deployment reliability and product decisions that
                              need more than just writing code.
                          </p>
                      </div>

                      <div className="mt-10 space-y-5">
                          {skills.map(({ category, items }) => (
                              <div key={category}>
                                  <p className="mb-3 text-label font-semibold uppercase tracking-[0.18em] text-accent">
                                      {category}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                      {items.map((item) => (
                                          <span key={item} className="tag">
                                              {item}
                                          </span>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </FadeIn>
          </div>
      </section>
  );
}
