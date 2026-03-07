import ProjectCard from "./ProjectCard";
import { projects } from "./data";

export default function ProjectsSection() {
  return (
    <section id="projects" className="section-padding bg-surface">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <span className="eyebrow">Projects</span>
        <h2 className="text-h2 font-semibold text-ink mt-2">
          Things I&apos;ve Built
        </h2>
        <span className="section-rule" />
        <p className="text-body-lg text-ink-secondary max-w-2xl">
          A selection of personal projects spanning cloud automation, full-stack
          development, and developer tooling.
        </p>

        {/* Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

      </div>
    </section>
  );
}
