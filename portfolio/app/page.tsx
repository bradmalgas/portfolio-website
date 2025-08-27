import Image from "next/image";
import Link from "next/link";
import SideNav from "./components/sidenav/SideNav";

export default function Home() {
  return (
    <div>
      {/* Header Section */}
      <header className="bg-cover bg-[url('/office-background.jpg')]">
        <div className="bg-cover bg-white bg-opacity-65 pt-7">
          <SideNav className="mx-3 lg:hidden" />
          <div className="text-black lg:flex hidden space-x-24 mx-10 uppercase text-lg font-medium items-center">
            <Link
              className="hover:text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:font-extrabold"
              href="/"
            >
              <p>Home</p>
            </Link>
            <Link href={"/projects"}>
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
          <div className="container mx-auto px-4 pt-12 flex flex-col items-center">
            <Image
              src="/brad-malgas-logo.png"
              alt="Brad Malgas"
              width={100}
              height={100}
              priority
            />
            <h1 className="text-5xl font-extrabold text-black">Brad Malgas</h1>
            <p className="text-lg text-gray-600 mt-2">SOFTWARE DEVELOPER</p>
            <a
              href="https://storageazureblogify.blob.core.windows.net/files/Bradley Malgas Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="lg:hidden mt-4 px-6 py-2 text-sm font-extralight text-black rounded-md outline outline-1">
                DOWNLOAD MY FULL CV
              </button>
            </a>
          </div>
          {/* Profile Image */}
          <div className="flex justify-center mt-6">
            <div className="relative rounded-full overflow-hidden w-[140px] h-[140px] lg:w-[200px] lg:h-[200px] outline outline-white outline-[7px] shadow-lg mb-8">
              <Image src="/brad-profile-pic.jpeg" alt="Profile" fill priority />
            </div>
          </div>
        </div>
      </header>

      {/* About Me Section */}
      <section className="bg-gray-600 text-white pt-[5rem] lg:px-96">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold uppercase tracking-widest">
            About Me
          </h2>
          <div className="border-t-8 border-gray-100 w-16 my-8"></div>
          <p className="mt-4 text-white text-base leading-6">
            Senior Software Developer with 5 years of experience designing and
            delivering cloud-native solutions on Microsoft Azure, specializing
            in C#/.NET development, infrastructure as code, and secure system
            design. Proven ability to lead projects end-to-end, from
            architecture and infrastructure provisioning to backend API
            development, authentication/authorization workflows, and deployment
            automation.
          </p>
          <p className="mt-4 text-white text-base leading-6">
            Skilled in Azure Bicep, DevOps pipelines, containerization (Docker,
            Podman), and identity management with Microsoft Entra ID. Adept at
            diagnosing and resolving complex issues in distributed systems,
            driving faster delivery, cost savings, and improved reliability.
            Passionate about leveraging technology to solve real-world problems,
            collaborating across teams, and mentoring peers to elevate project
            success.
          </p>
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-gray-600 text-white pt-12  lg:px-96">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold uppercase tracking-widest">
            Experience
          </h2>
          <div className="border-t-8 border-gray-100 w-16 mt-8"></div>
          <div className="pt-6">
            <p className="text-white text-xl font-bold">
              Senior Software Developer
            </p>
            <div className="w-full lg:flex">
              <p className="text-white text-lg italic">Secret Sauce</p>
              <p className="text-white text-lg italic ml-auto">
                April 2025 - Current
              </p>
            </div>
            <p className="mt-3 text-white text-base leading-6">
              At Secret Sauce, my work is split between internal tooling and
              external client delivery. Externally, I've been responsible for
              designing and running a new Investec Product Enablement platform.
              Internally, I've focused on re-usable pipeline templates and
              containerization patterns. This role reflects my step-up into
              senior responsibilities across infrastructure, security, and
              operational ownership.
            </p>
            {/* <p className="mt-3 text-white text-base">
              Some of the projects I have worked on include:
            </p>
            <p className="mt-3 text-white text-base leading-6">
              <span className="font-bold">PDF Signing Solution: </span>Designed
              and implemented a digital signing feature to embed long-term
              validation (LTV)-enabled signatures into PDFs. This project
              introduced new capabilities in digital document compliance and
              security.
            </p>
            <p className="mt-3 text-white text-base leading-6">
              <span className="font-bold">Automated Document Workflow: </span>
              Developed a Power Automate flow to process XML webhook data,
              extract metadata, and archive documents in SharePoint. This
              solution simplified document management and provided a reusable
              framework for clients.
            </p> */}
            <div className="mt-3 text-white text-base leading-6">
              <p className="font-bold mb-4">Roles & Responsibilities: </p>
              <ul className="list-disc ml-8">
                <li>
                  Designed and delivered Azure infrastructure using Bicep with
                  bicepparam files for environment-specific configuration.
                </li>
                <li>
                  Set up Azure DevOps pipelines for infrastructure validation,
                  infrastructure deployment, and container image deployments to
                  Azure Container Apps.
                </li>
                <li>
                  Implemented VNet/subnet topology and NSG rules; ensured all
                  applications were VNet-integrated and compliant with
                  restricted inbound access.
                </li>
                <li>
                  Drove operational excellence by checking deployment and
                  application logs, writing Log Analytics (KQL) queries, and
                  resolving issues across infra and app layers.
                </li>
                <li>
                  Authored internal reusable pipeline templates to orchestrate
                  dependent runs
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6">
            <p className="text-white text-xl font-bold">
              Specialist: Software Development
            </p>
            <div className="w-full lg:flex">
              <p className="text-white text-lg italic">Altron Security</p>
              <p className="text-white text-lg italic ml-auto">
                April 2024 - March 2025
              </p>
            </div>
            <p className="mt-3 text-white text-base leading-6">
              I worked across C# development, digital signing solutions, and
              customer integrations for our SaaS document workflow and signing
              platform. I collaborated with both local and UK-based teams to
              deliver reliable integrations and strong client outcomes.
            </p>
            {/* <p className="mt-3 text-white text-base">
              Some of the projects I have worked on include:
            </p>
            <p className="mt-3 text-white text-base leading-6">
              <span className="font-bold">PDF Signing Solution: </span>Designed
              and implemented a digital signing feature to embed long-term
              validation (LTV)-enabled signatures into PDFs. This project
              introduced new capabilities in digital document compliance and
              security.
            </p>
            <p className="mt-3 text-white text-base leading-6">
              <span className="font-bold">Automated Document Workflow: </span>
              Developed a Power Automate flow to process XML webhook data,
              extract metadata, and archive documents in SharePoint. This
              solution simplified document management and provided a reusable
              framework for clients.
            </p> */}
            <div className="mt-3 text-white text-base leading-6">
              <p className="font-bold mb-4">Roles & Responsibilities: </p>
              <ul className="list-disc ml-8">
                <li>
                  Collaborated with customers to implement API-based document
                  signing workflows and integrations.
                </li>
                <li>
                  Led technical meetings and provided ongoing support for SaaS
                  integrations and pre-sales engagements.
                </li>
                <li>
                  Developed backend C# APIs to enhance functionality and
                  performance.
                </li>
                <li>
                  Coordinated with international teams to improve product
                  offerings and ensure cross-border alignment.
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              Software Developer
            </p>
            <div className="w-full lg:flex">
              <p className="text-white text-lg italic">Investec</p>
              <p className="text-white text-lg italic ml-auto">
                January 2021 - March 2024
              </p>
            </div>
            <p className="mt-3 text-white text-base leading-6">
              I worked as a software developer at Investec for 3 years. I have
              experience working predominantly with C#, however I have also had
              exposure to Azure as well as Angular. My team was comprised of
              both in-house and contracted developers as well as business
              analysts. The culture of autonomy allowed me to take on
              responsibilities but there was also a strong sense of community
              with everyone willing to lend a helping hand.
            </p>
            {/* <p className="mt-3 text-white text-base">
              Some of the projects I have worked on include:
            </p>
            <p className="mt-3 text-white text-base leading-6">
              <span className="font-bold">Forex Solution: </span>A complete
              rewrite of an existing Forex application. The entire
              infrastructure was deployed in Azure using infrastructure-as-code.
              The application comprised of a front-end written in Angular 11 and
              the back-end API was written in C# using the .NET Core framework.
              The objective was to move the workflow off of Documentum. In this
              project I got experience with front-end development. I worked with
              HTML, CSS and created a number of reusable Angular components for
              the project. I also completed a number of backend development
              tasks in C#.
            </p>
            <p className="mt-3 text-white text-base leading-6">
              <span className="font-bold">Limit Management System: </span>
              An application to ensure that accurate reporting is provided with
              real-time data of client transactions. The solution was an API
              only application with no front-end or users logging into the
              application directly. The API solution was built using C# and the
              .NET framework. The database used was a SQL relational database.
              Both resources were hosted on Azure using Azure App Services and
              Azure SQL Databases respectively. My role in this project was to
              design the database structure and scripts to create the tables. I
              also provisioned majority of the resources in Azure using
              infrastructure-as-code. I worked together with another developer
              to write the C# code.
            </p> */}
            <div className="mt-3 text-white text-base leading-6">
              <p className="font-bold mb-4">Roles & Responsibilities: </p>
              <ul className="list-disc ml-8">
                <li>Created and refined work items on Azure DevOps boards.</li>
                <li>Designed CI/CD pipelines using YAML.</li>
                <li>
                  Reviewed code and PRs to maintain quality and consistency.
                </li>
                <li>
                  Configured and deployed Azure resources using
                  infrastructure-as-code.
                </li>
                <li>
                  Wrote backend C# Web API endpoints for new and existing
                  features.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="bg-gray-600 text-white pt-12  lg:px-96">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold uppercase tracking-widest">
            Education
          </h2>
          <div className="border-t-8 border-gray-100 w-16 mt-8"></div>
          <div className="pt-6">
            <p className="text-white text-xl font-bold">
              Computer Science (Honours)
            </p>
            <p className="text-white text-lg italic">University of Cape Town</p>
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              BSc. Computer Science & Business Computing
            </p>
            <p className="text-white text-lg italic">University Cape Town</p>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-gray-600 text-white pt-12 lg:px-96 pb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold uppercase tracking-widest">
            Certifications
          </h2>
          <div className="border-t-8 border-gray-100 w-16 mt-8"></div>
          <div className="pt-6">
            <p className="text-white text-xl font-bold">
              Microsoft Certified: Power Platform Fundamentals
            </p>
            <p className="text-white text-lg italic">Microsoft</p>
            {/* <p className="mt-3 text-white text-base leading-6">
              Demonstrate the business value and product capabilities of
              Microsoft Power Platform, such as Power Apps, data connections
              with Dataverse, and Power Automate.
            </p> */}
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              Microsoft Certified: Azure Data Fundamentals
            </p>
            <p className="text-white text-lg italic">Microsoft</p>
            {/* <p className="mt-3 text-white text-base leading-6">
              Demonstrate foundational knowledge of core data concepts related
              to Microsoft Azure data services.
            </p> */}
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              Microsoft Certified: Security, Compliance, and Identity
              Fundamentalss
            </p>
            <p className="text-white text-lg italic">Microsoft</p>
            {/* <p className="mt-3 text-white text-base leading-6">
              Demonstrate foundational knowledge on security, compliance, and
              identity concepts and related cloud-based Microsoft solutions.
            </p> */}
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              Microsoft Certified: Azure AI Fundamentals
            </p>
            <p className="text-white text-lg italic">Microsoft</p>
            {/* <p className="mt-3 text-white text-base leading-6">
              Demonstrate fundamental AI concepts related to the development of
              software and services of Microsoft Azure to create AI solutions.
            </p> */}
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              Microsoft Certified: Azure Fundamentals
            </p>
            <p className="text-white text-lg italic">Microsoft</p>
            {/* <p className="mt-3 text-white text-base leading-6">
              Demonstrate foundational knowledge of cloud concepts, core Azure
              services, plus Azure management and governance features and tools.
            </p> */}
          </div>
        </div>
      </section>

      {/* Skills Section (Need to expand to have better image quality) */}
      <section className="text-black py-12 lg:px-96 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold uppercase tracking-widest">
            Skills
          </h2>
          <div className="border-t-8 border-black w-16 mt-8"></div>
          <div className="my-12 relative h-[560px] max-w-96 mx-auto">
            <Image
              className="absolute top-[17px]"
              src="/Logo-C-sharp.svg"
              alt="C-Sharp"
              width={57.78}
              height={65}
            />
            <Image
              className="absolute top-[100px] left-0"
              src="/micrsoft-azure-logo.png"
              alt="Azure"
              width={250}
              height={50}
            />
            <Image
              className="absolute left-[calc(50%-70px)] top-0"
              src="/NET_Core_Logo.svg"
              alt=".NET"
              width={100}
              height={100}
            />
            <Image
              className="absolute right-0 top-[12px]"
              src="/vue-logo.png"
              alt="Vue"
              width={125}
              height={75}
            />
            <Image
              className="absolute right-[10px] top-[220px]"
              src="/Git-logo.png"
              alt="Git"
              width={100}
              height={41.8}
            />
            <Image
              className="absolute right-[18px] top-[120px]"
              src="/Typescript_logo.svg.png"
              alt="Typescript"
              width={60}
              height={60}
            />
            <Image
              className="absolute left-0 top-[242px]"
              src="/Angular-logo.png"
              alt="Angular"
              width={100}
              height={100}
            />
            <Image
              className="absolute left-[125px] top-[230px]"
              src="/power-automate-logo.png"
              alt="PowerAutomate"
              width={125}
              height={125}
            />
            <Image
              className="absolute right-0 top-[280px]"
              src="/SQL-logo.jpeg"
              alt="SQL"
              width={100}
              height={41.8}
            />
            <Image
              className="absolute left-[2px] top-[360px]"
              src="/Entity-Framework-Core-Logo.jpg"
              alt="Entity Framework"
              width={150}
              height={112.5}
            />
            <Image
              className="absolute right-0 top-[360px]"
              src="/power-bi-logo.png"
              alt="PowerBI"
              width={200}
              height={111.11}
            />
            <Image
              className="absolute left-[8px] top-[490px]"
              src="/YAML-logo.png"
              alt="YAML"
              width={65}
              height={69.17}
            />
            <Image
              className="absolute right-[calc(50%-50px)] top-[490px]"
              src="/Azure-DevOps-Logo.jpg"
              alt="Azure DevOps"
              width={125}
              height={70.31}
            />
            <Image
              className="absolute right-0 top-[470px]"
              src="/rest-api-icon.png"
              alt="Azure DevOps"
              width={120}
              height={98.23}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
