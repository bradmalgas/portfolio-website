#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

function printUsage() {
  console.error(`
Usage:
  node scripts/cosmos-posts-to-supabase-sql.mjs <input.json> [--out output.sql] [--status published]

Examples:
  node scripts/cosmos-posts-to-supabase-sql.mjs ./blog-posts-export.json
  node scripts/cosmos-posts-to-supabase-sql.mjs ./post.json --out ./posts.sql --status draft
`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    inputPath: "",
    outPath: "",
    status: "published",
  };

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (!current) {
      continue;
    }

    if (!current.startsWith("--") && !options.inputPath) {
      options.inputPath = current;
      continue;
    }

    if (current === "--out") {
      options.outPath = args[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (current === "--status") {
      options.status = args[index + 1] ?? "published";
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${current}`);
  }

  if (!options.inputPath) {
    throw new Error("Missing input file path.");
  }

  if (!["draft", "published", "scheduled"].includes(options.status)) {
    throw new Error(`Invalid status "${options.status}". Use draft, published, or scheduled.`);
  }

  return options;
}

function sqlString(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlArray(values) {
  const safeValues = Array.isArray(values)
    ? values.map((value) => String(value).trim()).filter(Boolean)
    : [];

  if (safeValues.length === 0) {
    return "ARRAY[]::text[]";
  }

  return `ARRAY[${safeValues.map(sqlString).join(", ")}]::text[]`;
}

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normaliseTimestamp(value) {
  if (!value) {
    return new Date().toISOString();
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}

function appendMigrationMetadata(post) {
  const author = String(post.author ?? "").trim();
  const disclaimer = String(post.disclaimer ?? "").trim();
  let content = String(post.content ?? "").trim();

  const metadataLines = [];

  if (author) {
    metadataLines.push(`Source author: ${author}`);
  }

  if (disclaimer) {
    metadataLines.push(`Disclaimer: ${disclaimer}`);
  }

  if (metadataLines.length === 0) {
    return content;
  }

  if (!content) {
    return metadataLines.map((line) => `> ${line}`).join("\n");
  }

  return `${content}\n\n---\n\n${metadataLines.map((line) => `> ${line}`).join("\n")}`;
}

function validatePost(post, index) {
  const problems = [];

  if (!post || typeof post !== "object") {
    problems.push("post is not an object");
  }

  if (!String(post.title ?? "").trim()) {
    problems.push("title is missing");
  }

  if (!String(post.category ?? "").trim()) {
    problems.push("category is missing");
  }

  if (!String(post.content ?? "").trim()) {
    problems.push("content is missing");
  }

  if (!String(post.summary ?? "").trim()) {
    problems.push("summary is missing");
  }

  if (problems.length > 0) {
    throw new Error(`Post ${index + 1} is invalid: ${problems.join(", ")}`);
  }
}

function toInsertSql(post, defaultStatus, index) {
  validatePost(post, index);

  const id = post.id ? String(post.id) : null;
  const title = String(post.title).trim();
  const slug = slugify(title);
  const description = String(post.summary).trim();
  const content = appendMigrationMetadata(post);
  const category = String(post.category).trim();
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const coverImage = String(post.coverImageUrl ?? "").trim() || null;
  const publishedAt = normaliseTimestamp(post.date);
  const readingMinutes =
    Number.isFinite(post.readingMinutes) && Number(post.readingMinutes) > 0
      ? Math.floor(Number(post.readingMinutes))
      : null;

  const columns = [
    "id",
    "slug",
    "title",
    "description",
    "content",
    "category",
    "tags",
    "cover_image",
    "status",
    "published_at",
    "created_at",
    "updated_at",
    "reading_time_minutes",
    "view_count",
  ];

  const values = [
    id ? sqlString(id) : "gen_random_uuid()",
    sqlString(slug),
    sqlString(title),
    sqlString(description),
    sqlString(content),
    sqlString(category),
    sqlArray(tags),
    sqlString(coverImage),
    sqlString(defaultStatus),
    sqlString(publishedAt),
    sqlString(publishedAt),
    sqlString(publishedAt),
    readingMinutes === null ? "NULL" : String(readingMinutes),
    "0",
  ];

  return `INSERT INTO posts (${columns.join(", ")})
VALUES (${values.join(", ")});`;
}

async function main() {
  const { inputPath, outPath, status } = parseArgs(process.argv);
  const absoluteInputPath = path.resolve(process.cwd(), inputPath);
  const raw = await fs.readFile(absoluteInputPath, "utf8");
  const parsed = JSON.parse(raw);
  const posts = Array.isArray(parsed) ? parsed : [parsed];

  const statements = posts.map((post, index) => toInsertSql(post, status, index));
  const output = `-- Generated from Cosmos DB export on ${new Date().toISOString()}
-- Fields not present in the new schema are preserved inside markdown content:
--   - author
--   - disclaimer

BEGIN;

${statements.join("\n\n")}

COMMIT;
`;

  if (outPath) {
    const absoluteOutPath = path.resolve(process.cwd(), outPath);
    await fs.writeFile(absoluteOutPath, output, "utf8");
    console.log(`Wrote ${posts.length} INSERT statement(s) to ${absoluteOutPath}`);
    return;
  }

  process.stdout.write(output);
}

main().catch((error) => {
  console.error(error.message);
  printUsage();
  process.exitCode = 1;
});
