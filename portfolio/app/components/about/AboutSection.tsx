import Image from "next/image";
import FadeIn from "../ui/FadeIn";

const CAREER_START = new Date(2021, 0); // January 2021 — Investec start date
const yearsOfExperience = Math.floor(
  (Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
);

const skills = [
  {
    category: "Languages",
    items: ["C#", "TypeScript", "SQL", "YAML"],
  },
  {
    category: "Cloud & Infrastructure",
    items: [
      "Microsoft Azure",
      "Azure Bicep",
      "Azure DevOps",
      "Azure Container Apps",
      "Azure Functions",
      "Docker",
      "Podman",
      "Microsoft Entra ID",
    ],
  },
  {
    category: "Frameworks & Libraries",
    items: [".NET / ASP.NET Core", "Entity Framework", "Angular", "Vue", "Next.js"],
  },
  {
    category: "Tools & Platforms",
    items: ["Git", "REST APIs", "Power Automate", "Power BI", "KQL"],
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="section-shell flex flex-col gap-12 p-8 lg:flex-row lg:gap-20 lg:p-12 xl:p-14 items-start">
          <div className="flex w-full flex-shrink-0 flex-col items-center gap-5 lg:w-auto lg:items-start">
            <div className="relative h-52 w-52 overflow-hidden rounded-[2rem] border border-border sm:h-60 sm:w-60 lg:h-72 lg:w-72">
              <div className="absolute inset-0 z-10 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-transparent pointer-events-none" />
              <Image
                src="/images/profile-image.png"
                alt="Brad Malgas"
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="text-center lg:text-left">
              <p className="font-display text-xl font-semibold text-ink">Brad Malgas</p>
              <p className="mt-1 text-body-sm text-accent">Senior Software Developer</p>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="eyebrow">About Me</span>
            <h2 className="section-heading mt-2">
              Building systems with weight, clarity, and operational realism.
            </h2>
            <span className="section-rule" />

            <div className="space-y-4 text-body leading-relaxed text-ink-secondary">
              <p>
                Senior Software Developer with {yearsOfExperience} years of experience designing and
                delivering cloud-native solutions on Microsoft Azure, specialising
                in C#/.NET development, infrastructure as code, and secure system
                design. Proven ability to lead projects end-to-end, from
                architecture and infrastructure provisioning to backend API
                development, authentication/authorization workflows, and deployment
                automation.
              </p>
              <p>
                Skilled in Azure Bicep, DevOps pipelines, containerisation (Docker,
                Podman), and identity management with Microsoft Entra ID. Adept at
                diagnosing and resolving complex issues in distributed systems,
                driving faster delivery, cost savings, and improved reliability.
                Passionate about leveraging technology to solve real-world problems,
                collaborating across teams, and mentoring peers to elevate project
                success.
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
