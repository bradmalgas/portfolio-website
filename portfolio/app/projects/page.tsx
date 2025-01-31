import Link from "next/link";
import ProjectCard from "../components/card/Project Card";

export const metadata = {
  title: "Projects", // Overrides default title
  description: "Discover Brad Malgas's software development projects.",
};

export default function Projects() {
  return (
    <div className="bg-white h-full">
      {/* Header Section */}
      <header className="bg-cover bg-[url('/Codebackground.jpg')]">
        <div className="bg-cover bg-white bg-opacity-65 pt-7 min-h-44">
          <div className="text-black lg:flex hidden space-x-24 mx-10 uppercase text-lg font-medium items-center">
            <Link
              className="hover:text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:font-extrabold"
              href="/"
            >
              <p>Home</p>
            </Link>
            <Link href="/projects">
              <p className="hover:text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:font-extrabold">
                Projects
              </p>
            </Link>
            <a
              className="hover:text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:font-extrabold"
              href="https://blog.bradmalgas.com"
              target="_blank"
            >
              <p>Blog</p>
            </a>
            <div className="lg:flex hidden -mr-10 w-full">
              <a
                className="ml-auto"
                href="https://storageazureblogify.blob.core.windows.net/files/Bradley Malgas Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-6 py-2 text-sm font-extralight text-black rounded-md outline outline-1 hover:text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:font-extrabold">
                  DOWNLOAD MY FULL CV
                </button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Project Title Section */}
      <section className="text-black py-12 lg:px-64">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold uppercase tracking-widest text-center">
            Projects
          </h2>
          <div className="border-t-8 border-gray-600 w-16 my-5 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-base leading-6 text-center">
            Explore a showcase of my projects, featuring innovative solutions
            and hands-on applications of modern technologies. Each project
            reflects my dedication to problem-solving, creativity, and technical
            excellence, spanning a variety of domains.
          </p>
        </div>
      </section>

      {/* Project List Section */}
      <section>
        <div className="grid justify-items-center grid-cols-1 gap-20 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 px-10 mb-24 h-full w-full">
          <ProjectCard
            title="Project 01: BudgetBuddy"
            image="/BudgetBuddy-Screenshot.png"
            description="A real-time transaction tracker that runs code on my bank card to log every purchase. It triggers an Azure Function, formats the data, and writes it to Google Sheets—all in under 3 seconds. Built for personal finance tracking, this project showcases cloud automation and API integrations."
            githubLink={"https://github.com/bradmalgas/programmable-banking"}
            blogLink={
              "https://blog.bradmalgas.com/post/Azure/701cb780-9f65-4299-8bc4-7aaf6adb67bc"
            }
          />
          <ProjectCard
            title="Project 02: AzureBlogify"
            image="/OG-Brad Malgas.png"
            description="A fully functional, cost-optimized blog running on Azure for just $1. Hosted on Azure Static Web Apps, powered by Azure Functions, and backed by Cosmos DB. Designed with seamless CI/CD, caching, and scalability, it demonstrates cloud-native development at minimal cost."
            githubLink={"https://github.com/bradmalgas/AzureBlogify"}
            blogLink={
              "https://blog.bradmalgas.com/post/Azure/f38daba8-de4b-4d56-80a5-c9c884efe25e"
            }
          />
        </div>
      </section>
    </div>
  );
}
