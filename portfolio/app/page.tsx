import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="bg-cover bg-[url('/office-background.jpg')]">
        <div className="bg-cover bg-white bg-opacity-65 pt-7">
          <div className="text-black lg:flex hidden space-x-24 mx-10 uppercase text-lg font-medium items-center">
            <a
              className="hover:text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:font-extrabold"
              href="/"
            >
              <p>Home</p>
            </a>
            <p className="hover:text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:font-extrabold">
              Projects
            </p>
            <a
              className="hover:text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:font-extrabold"
              href="https://blog.bradmalgas.com"
              target="_blank"
            >
              <p>Blog</p>
            </a>
            <div className="lg:flex hidden -mr-10 w-full">
              <button className=" ml-auto px-6 py-2 text-sm font-extralight text-black rounded-md outline outline-1">
                DOWNLOAD MY FULL CV
              </button>
            </div>
          </div>
          <div className="container mx-auto px-4 pt-12 flex flex-col items-center">
            <Image
              src="/brad-malgas-logo.png"
              alt="Brad Malgas"
              width={100}
              height={100}
              priority
              layout="fixed"
            />
            <h1 className="text-5xl font-extrabold text-black">Brad Malgas</h1>
            <p className="text-lg text-gray-600 mt-2">SOFTWARE DEVELOPER</p>
            <button className="lg:hidden mt-4 px-6 py-2 text-sm font-extralight text-black rounded-md outline outline-1">
              DOWNLOAD MY FULL CV
            </button>
          </div>
          {/* Profile Image */}
          <div className="flex justify-center mt-6">
            <div className="rounded-full overflow-hidden w-[140px] h-[140px] outline outline-white outline-[7px] shadow-lg mb-8">
              <img
                src="/brad-author-picture.jpeg" // Replace with the actual path to your image
                alt="Profile"
                className="w-full h-full object-cover"
              />
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
            Versatile software developer with 4 years of experience specializing
            in C# application development, cloud-based systems, and digital
            security solutions. Skilled in designing and deploying robust
            backend APIs, implementing advanced document signing workflows, and
            managing Azure-based infrastructure.
          </p>
          <p className="mt-4 text-white text-base leading-6">
            Proven ability to lead projects to successful completion ahead of
            schedule, delivering operational improvements and cost savings.
            Experienced in collaborating with global teams, supporting client
            integrations, and driving automation through innovative solutions.
            Passionate about leveraging technology to solve complex challenges
            and deliver measurable business value.
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
              Specialist: Software Development
            </p>
            <p className="text-white text-lg">Altron Security</p>
            <p className="mt-3 text-white text-base leading-6">
              I currently work as a software developer and signing technical
              pre-sales specialist at Altron Security. My role involves a
              combination of C# development, creating digital signing solutions,
              and supporting customer integrations for our SaaS document
              workflow and signing platform. I collaborate with both local and
              international teams, including UK-based companies, to deliver
              impactful solutions and ensure seamless client experiences.
            </p>
            <p className="mt-3 text-white text-base">
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
            </p>
            <div className="mt-3 text-white text-base leading-6">
              <p className="font-bold mb-4">Roles & Responsibilities: </p>
              <ul className="list-disc ml-8">
                <li>
                  Collaborating with customers to implement API-based
                  integrations for document signing workflows.
                </li>
                <li>
                  Leading technical meetings and providing ongoing support for
                  SaaS integrations.
                </li>
                <li>
                  Developing backend APIs in C# to enhance application
                  functionality and maintain high performance.
                </li>
                <li>
                  Coordinating with international teams to improve product
                  offerings and ensure cross-border alignment.
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              Software Developer
            </p>
            <p className="text-white text-lg">Investec</p>
            <p className="mt-3 text-white text-base leading-6">
              I worked as a software developer at Investec for 3 years. I have
              experience working predominantly with C#, however I have also had
              exposure to Azure as well as Angular. My team was comprised of
              both in-house and contracted developers as well as business
              analysts. The culture of autonomy allowed me to take on
              responsibilities but there was also a strong sense of community
              with everyone willing to lend a helping hand.
            </p>
            <p className="mt-3 text-white text-base">
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
            </p>
            <div className="mt-3 text-white text-base leading-6">
              <p className="font-bold mb-4">Roles & Responsibilities: </p>
              <ul className="list-disc ml-8">
                <li>
                  Creating new tasks for work items on Azure DevOps boards
                </li>
                <li>Design CI/CD pipelines using YAML</li>
                <li>Reviewing code and PRs of other team members</li>
                <li>
                  Configuring and deploying resources in Azure using
                  infrastructure-as-code.
                </li>
                <li>Writing backend API endpoints using C#.</li>
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
      <section className="bg-gray-600 text-white pt-12  lg:px-96">
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
            <p className="mt-3 text-white text-base leading-6">
              Demonstrate the business value and product capabilities of
              Microsoft Power Platform, such as Power Apps, data connections
              with Dataverse, and Power Automate.
            </p>
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              Microsoft Certified: Azure Data Fundamentals
            </p>
            <p className="text-white text-lg italic">Microsoft</p>
            <p className="mt-3 text-white text-base leading-6">
              Demonstrate foundational knowledge of core data concepts related
              to Microsoft Azure data services.
            </p>
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              Microsoft Certified: Security, Compliance, and Identity
              Fundamentalss
            </p>
            <p className="text-white text-lg italic">Microsoft</p>
            <p className="mt-3 text-white text-base leading-6">
              Demonstrate foundational knowledge on security, compliance, and
              identity concepts and related cloud-based Microsoft solutions.
            </p>
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              Microsoft Certified: Azure AI Fundamentals
            </p>
            <p className="text-white text-lg italic">Microsoft</p>
            <p className="mt-3 text-white text-base leading-6">
              Demonstrate fundamental AI concepts related to the development of
              software and services of Microsoft Azure to create AI solutions.
            </p>
          </div>
          <div className="pt-4">
            <p className="mt-4 text-white text-xl font-bold">
              Microsoft Certified: Azure Fundamentals
            </p>
            <p className="text-white text-lg italic">Microsoft</p>
            <p className="mt-3 text-white text-base leading-6">
              Demonstrate foundational knowledge of cloud concepts, core Azure
              services, plus Azure management and governance features and tools.
            </p>
          </div>
          <div className="text-center">
            <button className="my-12 px-6 py-2 text-base font-extralight text-white rounded-md outline outline-1">
              DOWNLOAD MY FULL CV
            </button>
          </div>
        </div>
      </section>

      {/* Skills Section (Need to expand to have better image quality and individual components) */}
      <section className="text-black pt-12  lg:px-96">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold uppercase tracking-widest">
            Skills
          </h2>
          <div className="border-t-8 border-black w-16 mt-8"></div>
          <div className="my-12 flex justify-center">
            <Image
              src="/Skills collage.png"
              alt="Skills"
              width={370}
              height={486.31}
            />
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <footer className="bg-gray-600 text-white text-center py-8  lg:px-96">
        <div className="container mx-auto px-4">
          <div>
            <button className="my-12 px-6 py-2 text-base font-extralight text-white rounded-md outline outline-1">
              DOWNLOAD MY FULL CV
            </button>
          </div>
          <div className="text-sm mb-12">
            <p>Follow me on social networks</p>
            <div className="flex justify-center space-x-6 my-2">
              <a href="https://www.linkedin.com/in/brad-malgas" target="_blank">
                <Image
                  src="/linkedin-logo.png"
                  alt="Skills"
                  width={50}
                  height={50}
                />
              </a>
              <a href="https://www.instagram.com/_brvd_" target="_blank">
                <Image
                  src="/instagram-logo.png"
                  alt="Skills"
                  width={50}
                  height={50}
                />
              </a>
              <a href="https://github.com/bradmalgas" target="_blank">
                <Image
                  src="/github-logo.png"
                  alt="Skills"
                  width={50}
                  height={50}
                />
              </a>
            </div>
          </div>
          <p className="text-sm">© 2025 Brad Malgas</p>
        </div>
      </footer>
    </div>
  );
}
