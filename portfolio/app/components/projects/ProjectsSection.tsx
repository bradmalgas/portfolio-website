import ProjectCard from "./ProjectCard";
import { projects } from "./data";
import FadeIn from "../ui/FadeIn";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="section-padding"
      style={{ background: "linear-gradient(to bottom, var(--color-background) 0%, rgb(var(--color-surface-rgb) / 0.86) 30%, var(--color-background) 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <span className="eyebrow">Projects</span>
          <h2 className="section-heading mt-2">
            Selected work with real edges.
          </h2>
          <span className="section-rule" />
          <p className="section-lead max-w-2xl">
            Personal projects where delivery, usability, and technical discipline matter as much as the code itself.
          </p>
        </FadeIn>

        <FadeIn delay={100} className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
