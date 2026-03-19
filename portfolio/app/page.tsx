import Hero from "./components/hero/Hero";
import ProjectsSection from "./components/projects/ProjectsSection";
import AboutSection from "./components/about/AboutSection";
import CareerSection from "./components/career/CareerSection";
import ContactFooter from "./components/contact/ContactFooter";

export default function Home() {
  return (
    <div className="theme-page">
      <Hero />
      <AboutSection />
      <ProjectsSection />
      <CareerSection />
      <ContactFooter />
    </div>
  );
}
