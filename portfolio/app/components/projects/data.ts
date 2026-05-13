export interface Project {
    id: string;
    title: string;
    image: string;
    description: string;
    tags: string[];
    githubLink?: string;
    blogLink?: string;
    blogLinkLabel?: string;
    youtubeLink?: string;
}

export const projects: Project[] = [
    {
        id: "01",
        title: "ZeroScribe",
        image: "https://acxbcruxwkzvsemjbdgq.supabase.co/storage/v1/object/public/blog-images/covers/1778686482247-a922c8ed-1631-4016-8f15-ef2618c910f4-photo-1634041323797-b9fdef9d18f7.jpeg",
        description:
            "A local-first meeting scribe for Apple Silicon Macs. It records audio, transcribes it locally with Whisper, and formats transcripts into Markdown notes without sending meeting content to cloud services by default.",
        tags: ["Python", "Whisper", "LM Studio", "Local AI", "Markdown"],
        githubLink: "https://github.com/bradmalgas/zero-scribe",
        blogLink: "/blog/zeroscribe",
        blogLinkLabel: "Read Blog Post",
        youtubeLink: "https://youtu.be/YpdCh3xp8XM?si=fbsHipD1eiR_XaEq",
    },
    {
        id: "02",
        title: "SoloDesk",
        image: "https://acxbcruxwkzvsemjbdgq.supabase.co/storage/v1/object/public/blog-images/content/1778540771986-75c6d35a-2b79-4893-9dcb-f4585163420e-screenshot-2026-05-08-at-9.56.17-am.png",
        description:
            "An early-stage freelancer admin tool focused on invoice generation and clean PDF output. The first version taught me how much detail sits inside simple business workflows: layout, totals, spacing and reusable document structure.",
        tags: ["Next.js", "TypeScript", "React", "pdfmake", "Zod"],
        blogLink: "/blog/solodesk",
        blogLinkLabel: "Read Blog Post",
        youtubeLink: "https://youtu.be/scaIh_c0x14?t=643&si=FbzXPr3xbHS-D5p5",
    },
    {
        id: "03",
        title: "BudgetBuddy",
        image: "https://acxbcruxwkzvsemjbdgq.supabase.co/storage/v1/object/public/blog-images/covers/1778686755489-4a05b25a-8dbe-4f18-823c-30bd862b397d-dashboard-1.png",
        description:
            "A South African personal finance app for importing bank statements, building budgets and asking practical money questions. The project pushed me to separate deterministic financial workflows from safer, read-only AI assistance.",
        tags: [
            "Next.js",
            "TypeScript",
            "PostgreSQL",
            "LangGraph",
            "AI Workflows",
        ],
    },
    {
        id: "04",
        title: "Programmable Banking",
        image: "/BudgetBuddy-Screenshot.png",
        description:
            "The original BudgetBuddy experiment: a real-time expense tracker triggered by Investec programmable banking card transactions. It used Azure Functions and Google Sheets to turn raw transaction events into useful spending records.",
        tags: [
            "Azure Functions",
            "JavaScript",
            "Google Sheets API",
            "Investec API",
            "Programmable Banking",
        ],
        githubLink: "https://github.com/bradmalgas/programmable-banking",
        blogLink:
            "/blog/building-budgetbuddy-real-time-transaction-tracking-with-azure-functions-google-sheets",
        blogLinkLabel: "Build Write-up",
    },
];