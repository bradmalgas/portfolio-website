export interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  tags: string[];
  githubLink: string;
  blogLink: string;
}

export const projects: Project[] = [
  {
    id: "01",
    title: "BudgetBuddy",
    image: "/BudgetBuddy-Screenshot.png",
    description:
      "A real-time transaction tracker that runs code on my bank card to log every purchase. It triggers an Azure Function, formats the data, and writes it to Google Sheets — all in under 3 seconds.",
    tags: ["Azure Functions", "C#", "Google Sheets", "Programmable Banking"],
    githubLink: "https://github.com/bradmalgas/programmable-banking",
    blogLink:
      "https://blog.bradmalgas.com/post/Azure/701cb780-9f65-4299-8bc4-7aaf6adb67bc",
  },
  {
    id: "02",
    title: "AzureBlogify",
    image: "/azureblogify-screenshot.png",
    description:
      "A fully functional, cost-optimised blog running on Azure for just $1/month. Hosted on Azure Static Web Apps, powered by Azure Functions, and backed by Cosmos DB with seamless CI/CD.",
    tags: [
      "Azure Static Web Apps",
      "Azure Functions",
      "Cosmos DB",
      "Next.js",
      "CI/CD",
    ],
    githubLink: "https://github.com/bradmalgas/AzureBlogify",
    blogLink:
      "https://blog.bradmalgas.com/post/Azure/f38daba8-de4b-4d56-80a5-c9c884efe25e",
  },
];
