const { createClient } = require("@supabase/supabase-js");

async function getDynamicPaths() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return ["/blog", "/blog/feed.xml"];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const [postsResult, categoriesResult] = await Promise.all([
    supabase.from("posts").select("slug").eq("status", "published"),
    supabase.from("posts").select("category").eq("status", "published"),
  ]);

  const categories = Array.from(
    new Set((categoriesResult.data ?? []).map((entry) => entry.category)),
  ).filter(Boolean);

  return [
    "/blog",
    "/blog/feed.xml",
    ...(postsResult.data ?? []).map((entry) => `/blog/${entry.slug}`),
    ...categories.map((category) => `/blog/category/${encodeURIComponent(category)}`),
  ];
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://bradmalgas.com",
  generateRobotsTxt: true,
  additionalPaths: async () => {
    const paths = await getDynamicPaths();
    return paths.map((loc) => ({ loc }));
  },
};
