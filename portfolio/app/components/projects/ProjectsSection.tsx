import ProjectCard from "./ProjectCard";
import { projects } from "./data";
import FadeIn from "../ui/FadeIn";

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-padding" style={{ background: 'linear-gradient(to bottom, #09090E 0%, #111119 30%)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <FadeIn>
          <span className="eyebrow">Projects</span>
          <h2 className="text-h2 font-semibold text-ink mt-2">
            Things I&apos;ve Built
          </h2>
          <span className="section-rule" />
          <p className="text-body-lg text-ink-secondary max-w-2xl">
            A selection of personal projects spanning cloud automation, full-stack
            development, and developer tooling.
          </p>
        </FadeIn>

        {/* Grid */}
        <FadeIn delay={100} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </FadeIn>

      </div>
    </section>
  );
}
