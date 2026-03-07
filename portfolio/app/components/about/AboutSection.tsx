import Image from "next/image";
import FadeIn from "../ui/FadeIn";

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

        {/* ── Two-column split ──────────────────────────────────── */}
        <FadeIn className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* LEFT — photo */}
          <div className="flex-shrink-0 flex flex-col items-center lg:items-start gap-5 w-full lg:w-auto">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-2xl overflow-hidden
                            ring-1 ring-border shadow-xl shadow-black/40">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
              <Image
                src="/images/profile-image.png"
                alt="Brad Malgas"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Name + title under photo */}
            <div className="text-center lg:text-left">
              <p className="font-semibold text-ink">Brad Malgas</p>
              <p className="text-body-sm text-accent mt-0.5">Senior Software Developer</p>
            </div>
          </div>

          {/* RIGHT — bio + skills */}
          <div className="flex-1 min-w-0">
            <span className="eyebrow">About Me</span>
            <h2 className="text-h2 font-semibold text-ink mt-2">
              Building systems that scale.
            </h2>
            <span className="section-rule" />

            {/* Bio */}
            <div className="space-y-4 text-body text-ink-secondary leading-relaxed">
              <p>
                Senior Software Developer with 5 years of experience designing and
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

            {/* Skills */}
            <div className="mt-10 space-y-5">
              {skills.map(({ category, items }) => (
                <div key={category}>
                  <p className="text-label font-semibold text-accent tracking-widest uppercase mb-3">
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
