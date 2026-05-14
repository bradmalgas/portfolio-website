import ProjectCard from "./ProjectCard";
import { projects } from "./data";
import FadeIn from "../ui/FadeIn";

export default function ProjectsSection() {
  return (
      <section
          id="projects"
          className="theme-section theme-section--projects section-padding"
      >
          <div className="max-w-6xl mx-auto">
              <FadeIn>
                  <span className="eyebrow">Projects</span>
                  <h2 className="section-heading mt-2">
                      Projects that pushed past the code.
                  </h2>
                  <span className="section-rule" />
                  <p className="section-lead max-w-2xl">
                      Projects where I used backend, cloud and AI tools to solve
                      practical problems, learn through real constraints, and
                      make better technical decisions.
                  </p>
              </FadeIn>

              <FadeIn
                  delay={100}
                  className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
              >
                  {projects.map((project) => (
                      <ProjectCard key={project.id} {...project} />
                  ))}
              </FadeIn>
          </div>
      </section>
  );
}
