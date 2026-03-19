export interface Project {
  id: string;
  title: string;
  image: string;
  description: string;
  tags: string[];
  githubLink: string;
  blogLink?: string;
  blogLinkLabel?: string;
}

export const projects: Project[] = [
  {
    id: "01",
    title: "BudgetBuddy",
    image: "/BudgetBuddy-Screenshot.png",
    description:
      "A real-time personal finance workflow built on programmable banking events. Each card transaction triggers an Azure Function, normalises the payload, and logs the result to Google Sheets within seconds.",
    tags: [
      "Azure Functions",
      "C#",
      "Google Sheets",
      "Programmable Banking",
    ],
    githubLink: "https://github.com/bradmalgas/programmable-banking",
    blogLink:
      "/blog/building-budgetbuddy-real-time-transaction-tracking-with-azure-functions-google-sheets",
    blogLinkLabel: "Build Write-up",
  },
  {
    id: "02",
    title: "AzureBlogify",
    image: "/azureblogify-screenshot.png",
    description:
      "A cost-conscious blogging platform designed to run on Azure for roughly $1 per month. It combines Static Web Apps, Azure Functions, Cosmos DB, and CI/CD automation into a lightweight serverless architecture.",
    tags: [
      "Azure Static Web Apps",
      "Azure Functions",
      "Cosmos DB",
      "Next.js",
      "CI/CD",
    ],
    githubLink: "https://github.com/bradmalgas/AzureBlogify",
    blogLink:
      "/blog/how-i-built-a-fully-functional-blog-on-azure-for-just-1month",
    blogLinkLabel: "Build Write-up",
  },
];
